'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Brain, ShieldCheck, MessageSquare, Save, Plus, 
    Trash2, Bot, Sparkles, ChevronRight, AlertCircle, 
    Info, Target, UserCheck, Activity, Settings2, X,
    CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import AITrainingMonitor from '@/components/intelligence/AITrainingMonitor';
import AdminClientAIHub from '@/components/admin/AdminClientAIHub';

export default function IntelligencePage() {
    const { user, loading: authLoading } = useAuth();
    const [activeClient, setActiveClient] = useState(null);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [knowledge, setKnowledge] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const clientId = searchParams.get('client');

    // Initial Load
    useEffect(() => {
        if (authLoading || !user) return;
        
        async function loadInitialData() {
            setLoading(true);
            try {
                // Determine target client
                const targetId = clientId || user.user_metadata?.client_id || user.client_id;
                if (targetId) {
                    const { data: cData } = await supabase.from('clients').select('name').eq('id', targetId).single();
                    setActiveClient(cData || { name: 'Estratega Digital' });
                }

                // 1. Load Agents
                const { data: aData, error: aError } = await supabase
                    .from('ai_agents')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                
                if (aError) throw aError;
                setAgents(aData || []);
                
                if (aData && aData.length > 0) {
                    setSelectedAgent(aData[0]);
                }

                // 2. Load Knowledge
                const { data: kData } = await supabase
                    .from('ai_knowledge_base')
                    .select('*')
                    .eq('user_id', user.id);
                setKnowledge(kData || []);

            } catch (err) {
                console.error('[AI] Load error:', err);
            } finally {
                setLoading(false);
            }
        }
        loadInitialData();
    }, [user, authLoading, clientId]);

    // Fetch knowledge for selected agent
    useEffect(() => {
        if (!selectedAgent || !user) return;
        
        async function loadAgentKnowledge() {
            const { data } = await supabase
                .from('ai_knowledge_base')
                .select('*')
                .eq('user_id', user.id)
                .or(`agent_id.is.null,agent_id.eq.${selectedAgent.id}`)
                .order('created_at', { ascending: false });
            setKnowledge(data || []);
        }
        loadAgentKnowledge();
    }, [selectedAgent, user]);

    const handleCreateAgent = async (customName) => {
        const name = (typeof customName === 'string') ? customName : `Nuevo Asistente v${agents.length + 1}`;
        try {
            const { data, error } = await supabase
                .from('ai_agents')
                .insert({
                    user_id: user.id,
                    name,
                    role_type: 'VENTAS',
                    status: 'ACTIVE',
                    tone_instructions: 'Trato profesional y empático enfocado en conversión.',
                    personality_tone: 'PROFESIONAL',
                    golden_rules: 'REGLA 1: Responder en menos de 2 segundos. REGLA 2: No inventar datos clínicos.'
                })
                .select()
                .single();
            
            if (error) throw error;
            setAgents([data, ...agents]);
            setSelectedAgent(data);
        } catch (err) {
            console.error('Error al crear:', err);
        }
    };

    const seedSentinel = async () => {
        setLoading(true);
        try {
            await handleCreateAgent('Sentinel 24/7');
        } catch (err) {
            console.error("Sentinel Seed failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAgent = async () => {
        if (!selectedAgent) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('ai_agents')
                .update({
                    name: selectedAgent.name,
                    role_type: selectedAgent.role_type,
                    tone_instructions: selectedAgent.tone_instructions,
                    personality_tone: selectedAgent.personality_tone,
                    golden_rules: selectedAgent.golden_rules,
                    base_prompt: selectedAgent.base_prompt,
                    status: 'ACTIVE',
                    updated_at: new Date().toISOString()
                })
                .eq('id', selectedAgent.id);
            
            if (error) throw error;
            
            setAgents(agents.map(a => a.id === selectedAgent.id ? selectedAgent : a));
            
            const toast = document.createElement('div');
            toast.innerText = `Asistente "${selectedAgent.name}" actualizado`;
            toast.className = "fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest z-[100] animate-bounce";
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);

        } catch (err) {
            alert('Error al guardar: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const loadMedicalTraining = async () => {
        if (!selectedAgent) return;
        setSaving(true);
        try {
            const training = [
                { title: 'Triaje Inicial Urología', content: 'Si el paciente tiene dolor agudo lumbar, recomendar acudir a urgencias. Si es para control de próstata, preguntar si trae resultados de PSA. Mantener siempre la calma y profesionalismo.' },
                { title: 'Protocolos de Ecografía', content: 'Informar que para ecografía renal o de vejiga debe venir con la VEJIGA LLENA (beber 1L de agua 1h antes).' },
                { title: 'Atención Nocturna', content: 'Hola, soy el asistente virtual de la Dra. Jessica Rey. En este momento el consultorio está cerrado, pero puedo ayudarle a agendar una cita o darle instrucciones básicas de preparación.' }
            ];

            for (const item of training) {
                await supabase.from('ai_knowledge_base').insert({
                    user_id: user.id,
                    agent_id: selectedAgent.id,
                    title: item.title,
                    content: item.content,
                    category: 'EXPERTO'
                });
            }

            const newInstructions = `Eres Sentinel 24/7, el asistente experto en urología de la Dra. Jessica Rey. Tu objetivo es: 1. Responder dudas básicas sobre patologías (Próstata, Cálculos, Infecciones). 2. Agendar citas incluso fuera de horario. 3. Dar instrucciones de preparación clínica de forma empática y profesional. Nunca des diagnósticos definitivos, siempre remite a la doctora.`;
            
            await supabase.from('ai_agents').update({ 
                tone_instructions: newInstructions,
                role_type: 'MEDICO'
            }).eq('id', selectedAgent.id);

            setSelectedAgent({...selectedAgent, tone_instructions: newInstructions, role_type: 'MEDICO'});
            
            const { data } = await supabase
                .from('ai_knowledge_base')
                .select('*')
                .eq('user_id', user.id)
                .or(`agent_id.is.null,agent_id.eq.${selectedAgent.id}`)
                .order('created_at', { ascending: false });
            setKnowledge(data || []);

        } catch (err) {
            console.error("Error loading training:", err);
        } finally {
            setSaving(false);
        }
    };

    const addKnowledge = async () => {
        if (!selectedAgent) return;
        const title = prompt('Título del conocimiento (ej: Horarios de Cirugía):');
        const content = prompt('Contenido del conocimiento:');
        if (!title || !content) return;

        try {
            const { data, error } = await supabase
                .from('ai_knowledge_base')
                .insert({
                    user_id: user.id,
                    agent_id: selectedAgent.id,
                    title,
                    content,
                    category: 'EXPERT'
                })
                .select()
                .single();
            
            if (error) throw error;
            setKnowledge([data, ...knowledge]);
        } catch (err) {
            alert('Error al añadir conocimiento: ' + err.message);
        }
    };

    if (authLoading || (loading && !agents.length)) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050510] text-white gap-6">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <Brain className="w-16 h-16 text-indigo-500" />
            </motion.div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 animate-pulse">Sincronizando Fábrica de Bots</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#050510] text-white p-6 md:p-10 space-y-10">
            {/* FUTURISTIC HEADER */}
            <div className="relative p-10 rounded-[3rem] overflow-hidden border border-white/5 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent backdrop-blur-3xl">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Brain className="w-64 h-64 text-indigo-400" />
                </div>
                
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                    <div>
                        <div className="flex items-center gap-5 mb-4">
                            <div className="p-4 bg-indigo-500/20 rounded-2xl border border-indigo-500/20 shadow-2xl shadow-indigo-500/20">
                                <Sparkles className="w-10 h-10 text-indigo-400" />
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-white">
                                VENTAS <span className="text-indigo-500">&</span> IA
                            </h1>
                        </div>
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em] pl-2 drop-shadow-sm">
                             {activeClient?.name || 'CENTRO DE CRECIMIENTO'} • Terminal de Inteligencia DNA
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-5">
                        <button 
                            onClick={() => handleCreateAgent()}
                            className="group relative px-8 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all overflow-hidden active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-white/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <span className="flex items-center gap-3 relative z-10">
                                <Plus className="w-5 h-5 text-indigo-400" /> Nuevo Asistente
                            </span>
                        </button>
                        
                        {selectedAgent && (
                            <button 
                                onClick={handleSaveAgent}
                                disabled={saving}
                                className="group relative px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/30 overflow-hidden active:scale-95"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="flex items-center gap-3 relative z-10">
                                    <Save className="w-5 h-5" /> {saving ? 'Sincronizando...' : 'Aplicar Cambios'}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* BOTS SELECTION STRIP */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {agents.map((agent) => (
                    <motion.button
                        key={agent.id}
                        onClick={() => setSelectedAgent(agent)}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-6 rounded-[2.5rem] border transition-all text-left relative overflow-hidden group ${
                            selectedAgent?.id === agent.id 
                            ? 'bg-indigo-600/20 border-indigo-500 scale-105 shadow-2xl shadow-indigo-500/20' 
                            : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                        }`}
                    >
                        {selectedAgent?.id === agent.id && (
                            <div className="absolute top-4 right-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
                            </div>
                        )}
                        <div className="relative z-10 flex flex-col gap-5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${selectedAgent?.id === agent.id ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/30' : 'bg-white/5 text-gray-500'}`}>
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-[12px] font-black uppercase tracking-tight text-white group-hover:text-indigo-300 transition-colors line-clamp-1 italic">{agent.name}</h4>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black text-gray-500 uppercase tracking-widest">{agent.role_type}</div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                            <Brain className="w-32 h-32 text-white" />
                        </div>
                    </motion.button>
                ))}
                
                <button 
                    onClick={() => handleCreateAgent()}
                    className="p-8 rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] transition-all flex flex-col items-center justify-center gap-5 text-gray-600 group active:scale-95"
                >
                    <div className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all border border-transparent group-hover:border-indigo-500/20 shadow-inner">
                        <Plus className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] group-hover:text-white transition-colors">Añadir Especialista</span>
                </button>
            </div>

            {/* Main View Area */}
            {selectedAgent ? (
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={selectedAgent.id}
                        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="space-y-10"
                    >
                        <AdminClientAIHub 
                            client={{ 
                                ...activeClient, 
                                id: selectedAgent.id,
                                name: selectedAgent.name
                            }} 
                        />
                    </motion.div>
                </AnimatePresence>
            ) : (
                <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[5rem] gap-12 bg-white/[0.01] backdrop-blur-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="w-32 h-32 rounded-[4rem] bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-2xl shadow-indigo-500/10 relative z-10">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
                            <UserCheck className="w-16 h-16" />
                        </motion.div>
                    </div>
                    <div className="text-center space-y-5 relative z-10">
                        <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">SISTEMA DESCONECTADO</h3>
                        <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.3em] max-w-lg mx-auto leading-loose italic">
                            Sincroniza tu primer nodo de inteligencia virtual para desplegar la red neuronal táctica de tu marca.
                        </p>
                    </div>
                    <button 
                        onClick={seedSentinel}
                        className="group relative bg-indigo-600 text-white px-16 py-6 rounded-3xl text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30 overflow-hidden active:scale-95 transition-all"
                    >
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 animate-pulse" />
                        <span className="relative z-10 flex items-center gap-4">
                            <Zap className="w-5 h-5 fill-current text-yellow-400" /> Activar Sentinel 24/7
                        </span>
                    </button>
                </div>
            )}
        </main>
    );
}
