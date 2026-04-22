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
import AdvancedBotTraining from '@/components/intelligence/AdvancedBotTraining';

export default function IntelligencePage() {
    const { user, loading: authLoading } = useAuth();
    const [activeClient, setActiveClient] = useState(null);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [knowledge, setKnowledge] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [viewMode, setViewMode] = useState('editor'); // 'editor' or 'lab'
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
            setViewMode('editor');
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
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter flex items-center gap-4 text-white">
                        <Brain className="w-10 h-10 text-indigo-500" /> VENTAS & IA
                    </h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">
                        {activeClient?.name || 'CENTRO DE CRECIMIENTO'} • Terminal de Inteligencia Médica
                    </p>
                </div>

                <div className="flex gap-4">
                    {selectedAgent && (
                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 shadow-2xl">
                            <button 
                                onClick={() => setViewMode('editor')}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${viewMode === 'editor' ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Bot className="w-3.5 h-3.5" /> Perfil
                            </button>
                            <button 
                                onClick={() => setViewMode('lab')}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${viewMode === 'lab' ? 'bg-indigo-600 text-white shadow-xl scale-105 shadow-indigo-600/30' : 'text-indigo-400/60 hover:text-indigo-400'}`}
                            >
                                <Brain className="w-3.5 h-3.5" /> Laboratorio
                                {viewMode !== 'lab' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />}
                            </button>
                        </div>
                    )}
                    <button 
                        onClick={handleCreateAgent}
                        className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Nuevo Asistente
                    </button>
                    {selectedAgent && (
                        <button 
                            onClick={handleSaveAgent}
                            disabled={saving}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                        >
                            <Save className="w-4 h-4" /> {saving ? 'Guardando...' : 'Aplicar Cambios'}
                        </button>
                    )}
                </div>
            </div>

            {/* Bots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {agents.map((agent) => (
                    <motion.button
                        key={agent.id}
                        onClick={() => setSelectedAgent(agent)}
                        className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden group ${
                            selectedAgent?.id === agent.id 
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                            : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                        }`}
                    >
                        <div className="relative z-10 flex flex-col gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedAgent?.id === agent.id ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-400'}`}>
                                <Bot className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-tight text-white group-hover:text-indigo-300 transition-colors line-clamp-1">{agent.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-1 h-1 rounded-full ${agent.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{agent.role_type}</span>
                                </div>
                            </div>
                        </div>
                    </motion.button>
                ))}
                
                <button 
                    onClick={() => handleCreateAgent()}
                    className="p-8 rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] transition-all flex flex-col items-center justify-center gap-4 text-gray-600 group"
                >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors">Añadir Especialista</span>
                </button>
            </div>

            {/* Main View Area */}
            {selectedAgent ? (
                <AnimatePresence mode="wait">
                    {viewMode === 'editor' ? (
                        <motion.div 
                            key="editor"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <AITrainingMonitor />
                                <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(79,70,229,0.2)] flex flex-col justify-center relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Modo Executive Mobile</h3>
                                        <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mt-2">Acceso instantáneo para la Dra. Jessica Rey</p>
                                        <ul className="mt-6 space-y-3">
                                            <li className="flex items-center gap-3 text-xs font-bold text-white"><CheckCircle2 className="w-4 h-4" /> Visualización de ROI Diario</li>
                                            <li className="flex items-center gap-3 text-xs font-bold text-white"><CheckCircle2 className="w-4 h-4" /> Alertas de Fuga de Leads</li>
                                            <li className="flex items-center gap-3 text-xs font-bold text-white"><CheckCircle2 className="w-4 h-4" /> Control de Pauta Masiva</li>
                                        </ul>
                                        <button 
                                            onClick={() => router.push('/dashboard/crm?view=productivity')}
                                            className="mt-8 px-8 py-3 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-white/10"
                                        >
                                            Ir al Hub Móvil
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 space-y-6">
                                        <div className="flex items-center justify-between font-black text-[9px] uppercase tracking-widest text-indigo-400">
                                            <div className="flex items-center gap-2 italic"><Activity className="w-4 h-4" /> Configuración</div>
                                            <span className="opacity-50">ID: {selectedAgent.id.substring(0, 8)}</span>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Especialidad</label>
                                                <select 
                                                    value={selectedAgent.role_type}
                                                    onChange={(e) => setSelectedAgent({...selectedAgent, role_type: e.target.value})}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-indigo-500 outline-none"
                                                >
                                                    <option value="GENERAL">Asistente General</option>
                                                    <option value="CRM">Lead Management</option>
                                                    <option value="VENTAS">Ventas</option>
                                                    <option value="MEDICO">Protocolo Clínico</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Personalidad</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {['PROFESIONAL', 'EMPATICO', 'AUTORITARIO'].map((t) => (
                                                        <button 
                                                            key={t}
                                                            onClick={() => setSelectedAgent({...selectedAgent, personality_tone: t})}
                                                            className={`py-2 rounded-lg text-[7px] font-black border transition-all ${selectedAgent.personality_tone === t ? 'bg-indigo-600 border-indigo-400' : 'bg-white/5 border-white/10 text-gray-500'}`}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Instrucciones</label>
                                                <textarea 
                                                    rows="4"
                                                    value={selectedAgent.tone_instructions}
                                                    onChange={(e) => setSelectedAgent({...selectedAgent, tone_instructions: e.target.value})}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-indigo-500 outline-none resize-none"
                                                />
                                            </div>

                                            <button 
                                                onClick={loadMedicalTraining}
                                                className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[8px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Sparkles className="w-3 h-3" /> Cargar Entrenamiento Médico
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-8">
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 space-y-6 h-full">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-emerald-400 text-[9px] font-black uppercase tracking-widest italic">
                                                <Target className="w-4 h-4" /> Bóveda de Conocimiento
                                            </div>
                                            <button onClick={addKnowledge} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-[8px] font-black uppercase tracking-widest">
                                                <Plus className="w-3 h-3" /> Añadir
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {knowledge.length === 0 ? (
                                                <div className="col-span-2 py-16 text-center border-2 border-dashed border-white/5 rounded-3xl text-gray-600 text-[9px] font-black uppercase">Vacío</div>
                                            ) : (
                                                knowledge.map((item) => (
                                                    <div key={item.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                                                        <h4 className="text-[10px] font-black text-white uppercase italic">{item.title}</h4>
                                                        <p className="text-[9px] text-gray-500 leading-relaxed italic line-clamp-3">{item.content}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="lab"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <AdvancedBotTraining selectedAgent={selectedAgent} />
                        </motion.div>
                    )}
                </AnimatePresence>
            ) : (
                <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[4rem] gap-8 bg-white/[0.01]">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <UserCheck className="w-12 h-12" />
                    </div>
                    <div className="text-center space-y-4">
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Desconectado</h3>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Activa tu primer asistente para comenzar.</p>
                    </div>
                    <button 
                        onClick={seedSentinel}
                        className="bg-indigo-600 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                    >
                        Activar Sentinel 24/7
                    </button>
                </div>
            )}
        </main>
    );
}
