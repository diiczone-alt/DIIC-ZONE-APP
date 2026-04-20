'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Brain, ShieldCheck, MessageSquare, Save, Plus, 
    Trash2, Bot, Sparkles, ChevronRight, AlertCircle, 
    Info, Target, UserCheck, Activity, Settings2, X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function IntelligencePage() {
    const { user, loading: authLoading } = useAuth();
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [knowledge, setKnowledge] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Initial Load
    useEffect(() => {
        if (authLoading || !user) return;
        
        async function loadAgents() {
            setLoading(true);
            try {
                // 1. Load Agents
                const { data: aData, error: aError } = await supabase
                    .from('ai_agents')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                
                if (aError) throw aError;
                setAgents(aData || []);
                
                // Select first agent by default if exists
                if (aData && aData.length > 0) {
                    setSelectedAgent(aData[0]);
                }

                // 2. Load Knowledge (Global/Initial)
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
        loadAgents();
    }, [user, authLoading]);

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

    const handleCreateAgent = async () => {
        const name = prompt('Nombre del nuevo asistente (ej: Asistente CRM):');
        if (!name) return;

        try {
            const { data, error } = await supabase
                .from('ai_agents')
                .insert({
                    user_id: user.id,
                    name,
                    role_type: 'GENERAL',
                    status: 'ACTIVE',
                    tone_instructions: 'Trato profesional y empático.'
                })
                .select()
                .single();
            
            if (error) throw error;
            setAgents([data, ...agents]);
            setSelectedAgent(data);
        } catch (err) {
            alert('Error al crear: ' + err.message);
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
                    base_prompt: selectedAgent.base_prompt,
                    status: 'ACTIVE',
                    updated_at: new Date().toISOString()
                })
                .eq('id', selectedAgent.id);
            
            if (error) throw error;
            
            // Sync agents list
            setAgents(agents.map(a => a.id === selectedAgent.id ? selectedAgent : a));
            
            // Visual feedback
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

    const addKnowledge = async () => {
        if (!selectedAgent) return;
        const title = prompt('Título del conocimiento (Ej: Protocolo de Citas):');
        const content = prompt('Detalle técnico para el bot:');
        if (!title || !content) return;

        try {
            const { data, error } = await supabase
                .from('ai_knowledge_base')
                .insert({
                    user_id: user.id,
                    agent_id: selectedAgent.id,
                    title,
                    content,
                    category: 'EXPERTO'
                })
                .select()
                .single();
            if (error) throw error;
            setKnowledge([data, ...knowledge]);
        } catch (err) {
            alert('Error al añadir: ' + err.message);
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
                    <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter flex items-center gap-4">
                        <Brain className="w-10 h-10 text-indigo-500" /> AI BOT FACTORY
                    </h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">Dra. Jessica Reyes • Centro de Control Multi-Agente</p>
                </div>

                <div className="flex gap-4">
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
                        {selectedAgent?.id === agent.id && (
                            <motion.div layoutId="hoverBot" className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                        )}
                    </motion.button>
                ))}
                
                <button 
                    onClick={handleCreateAgent}
                    className="p-4 rounded-2xl border-2 border-dashed border-white/5 hover:border-white/10 hover:bg-white/[0.01] transition-all flex flex-col items-center justify-center gap-2 text-gray-600"
                >
                    <Plus className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Añadir Especialista</span>
                </button>
            </div>

            {/* Selected Bot Editor */}
            {selectedAgent ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Bot Persona */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <Activity className="w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Configuración del Bot</span>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase tracking-widest">ID: {selectedAgent.id.substring(0, 8)}</span>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Especialidad (Rol)</label>
                                    <select 
                                        value={selectedAgent.role_type}
                                        onChange={(e) => setSelectedAgent({...selectedAgent, role_type: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="GENERAL">Asistente General</option>
                                        <option value="CRM">Gestión de Leads (CRM)</option>
                                        <option value="VENTAS">Ventas & Conversión</option>
                                        <option value="MEDICO">Protocolo Clínico</option>
                                        <option value="ADMIN">Administración Interna</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Instrucciones de Personalidad</label>
                                    <textarea 
                                        rows="8"
                                        value={selectedAgent.tone_instructions}
                                        onChange={(e) => setSelectedAgent({...selectedAgent, tone_instructions: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-indigo-500 outline-none transition-all resize-none leading-relaxed"
                                        placeholder="Define cómo debe interactuar este bot..."
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-3">
                                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                <p className="text-[9px] font-medium text-gray-400 leading-normal italic">
                                    Este bot está configurado para "Marketing para Médicos". Priorizará el agendamiento y la calificación térmica de cada lead.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bot Knowledge */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 space-y-6 h-full">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <Target className="w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Bóveda de Conocimiento de "{selectedAgent.name}"</span>
                                </div>
                                <button 
                                    onClick={addKnowledge}
                                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2 text-[8px] font-black uppercase tracking-widest"
                                >
                                    <Plus className="w-3 h-3" /> Añadir Conocimiento
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {knowledge.length === 0 ? (
                                    <div className="col-span-2 py-16 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                        <p className="text-gray-600 font-black uppercase tracking-widest text-[9px]">Este asistente aún no tiene memoria propia.</p>
                                    </div>
                                ) : (
                                    knowledge.map((item) => (
                                        <div key={item.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3 group hover:border-indigo-500/30 transition-all">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-[10px] font-black text-white italic uppercase">{item.title}</h4>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="text-gray-600 hover:text-white"><Settings2 className="w-3.5 h-3.5" /></button>
                                                    <button className="text-gray-600 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-bold leading-relaxed line-clamp-3 italic">
                                                {item.content}
                                            </p>
                                            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                                <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${item.agent_id ? 'bg-indigo-500/10 text-indigo-400' : 'bg-gray-500/10 text-gray-400'}`}>
                                                    {item.agent_id ? 'EXCLUSIVO' : 'GLOBAL'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] gap-6">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-gray-700">
                        <UserCheck className="w-10 h-10" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-400">Selecciona un Asistente</h3>
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Elige a un bot de tu equipo para configurar su entrenamiento.</p>
                    </div>
                </div>
            )}
        </main>
    );
}
