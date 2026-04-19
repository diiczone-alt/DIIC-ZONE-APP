'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Brain, ShieldCheck, MessageSquare, Save, Plus, 
    Trash2, Bot, Sparkles, ChevronRight, AlertCircle, Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function IntelligencePage() {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        assistant_name: 'Asistente Digital',
        tone_instructions: 'Trato profesional, empático y con autoridad médica. Evitar diagnósticos directos.',
        base_prompt: ''
    });
    const [knowledge, setKnowledge] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) return;
        
        async function loadAIConfig() {
            setLoading(true);
            try {
                // Load Settings
                const { data: s } = await supabase
                    .from('ai_brand_settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();
                if (s) setSettings(s);

                // Load Knowledge
                const { data: k } = await supabase
                    .from('ai_knowledge_base')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                if (k) setKnowledge(k);
            } catch (err) {
                console.error('Error loading AI config:', err);
            } finally {
                setLoading(false);
            }
        }
        loadAIConfig();
    }, [user]);

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('ai_brand_settings')
                .upsert({
                    user_id: user.id,
                    ...settings,
                    updated_at: new Date().toISOString()
                });
            if (error) throw error;
            alert('Configuración guardada con éxito');
        } catch (err) {
            alert('Error al guardar: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const addKnowledge = async () => {
        const title = prompt('Título de la información (Ej: Precios de Bótox):');
        const content = prompt('Contenido detallado para la IA:');
        if (!title || !content) return;

        try {
            const { data, error } = await supabase
                .from('ai_knowledge_base')
                .insert({
                    user_id: user.id,
                    title,
                    content,
                    category: 'FAQ'
                })
                .select()
                .single();
            if (error) throw error;
            setKnowledge([data, ...knowledge]);
        } catch (err) {
            alert('Error al añadir: ' + err.message);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#050510] text-white">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Brain className="w-12 h-12 text-indigo-500" />
            </motion.div>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#050510] text-white p-8 md:p-12 space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Brain className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">AI Intelligence</h1>
                            <p className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-500" /> Centro de Entrenamiento y Control
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 shadow-lg shadow-indigo-600/20"
                    >
                        <Save className="w-4 h-4" /> {saving ? 'Guardando...' : 'Aplicar Cambios'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Persona Settings */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 space-y-8 h-full">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-indigo-400">
                                <Bot className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Identidad del Asistente</span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-2">Nombre Comercial</label>
                                <input 
                                    type="text" 
                                    value={settings.assistant_name}
                                    onChange={(e) => setSettings({...settings, assistant_name: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none transition-all placeholder:text-gray-700" 
                                    placeholder="Ej: Asistente Digital de Dra. Jessica"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-2">Instrucciones de Tono</label>
                                <textarea 
                                    rows="6"
                                    value={settings.tone_instructions}
                                    onChange={(e) => setSettings({...settings, tone_instructions: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-500 outline-none transition-all resize-none leading-relaxed"
                                    placeholder="Describe cómo debe hablar la IA..."
                                />
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                            <p className="text-[10px] font-bold text-gray-400 leading-relaxed italic">
                                La IA operará actualmente en "Modo Sugerencia". Todas las respuestas deben ser validadas en el CRM antes de ser enviadas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Knowledge Base */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 space-y-8 h-full">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3 text-emerald-400">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Base de Conocimiento Médica</span>
                            </div>
                            <button 
                                onClick={addKnowledge}
                                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"
                            >
                                <Plus className="w-4 h-4" /> Añadir Dato
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {knowledge.length === 0 ? (
                                <div className="col-span-2 py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                    <p className="text-gray-600 font-black uppercase tracking-widest text-[10px]">Sin información cargada aún.</p>
                                </div>
                            ) : (
                                knowledge.map((item) => (
                                    <div key={item.id} className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-4 group">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-xs font-black text-white italic uppercase tracking-tight">{item.title}</h4>
                                            <button className="text-gray-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-[11px] text-gray-400 font-bold leading-relaxed line-clamp-3">
                                            {item.content}
                                        </p>
                                        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                                            <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">{item.category}</span>
                                            <div className="w-1 h-1 rounded-full bg-gray-700" />
                                            <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Activo</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h5 className="text-sm font-black text-white uppercase italic">Sugerencias Pendientes</h5>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hay 3 mensajes esperando validación clínica.</p>
                                </div>
                            </div>
                            <button className="px-6 py-3 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                                Revisar Sugerencias <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
