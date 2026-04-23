'use client';

import { useState } from 'react';
import { 
    Cpu, Settings, BrainCircuit, Target, 
    Zap, Save, RefreshCw, Plus, Trash2, 
    MessageSquare, Sparkles, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AdminAIChatbot from './AdminAIChatbot';

export default function AdminClientAIHub({ client }) {
    const [subTab, setSubTab] = useState('config'); // 'config' | 'chat'
    const [config, setConfig] = useState({
        specialty: 'Ventas',
        personality: 'Profesional', // 'Profesional' | 'Empático' | 'Autoritario'
        instructions: 'Trato profesional y empático enfocado en conversión.',
        knowledgeBase: []
    });

    const specialties = ['Ventas', 'Soporte', 'Estrategia', 'Operaciones'];
    const personalities = ['Profesional', 'Empático', 'Autoritario'];

    const handleSave = () => {
        toast.success("Configuración de IA Sincronizada", {
            description: `El motor de IA para ${client.name} ha sido actualizado.`
        });
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500 text-left">
            {/* COMPACT SWITCHER */}
            <div className="flex items-center justify-between bg-cyan-500/5 border border-cyan-500/10 p-4 rounded-3xl backdrop-blur-xl">
                <div className="flex items-center gap-3 pl-2">
                    <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/20">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Motor Inteligente</h3>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">Nodo: {client.id}AI</p>
                    </div>
                </div>
                
                <div className="flex gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                    <TabBtn active={subTab === 'config'} onClick={() => setSubTab('config')} icon={Settings} label="Config" />
                    <TabBtn active={subTab === 'chat'} onClick={() => setSubTab('chat')} icon={MessageSquare} label="Chat" />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {subTab === 'config' ? (
                    <motion.div 
                        key="config"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-5"
                    >
                        {/* CONFIG PANEL */}
                        <div className="lg:col-span-12 xl:col-span-5 bg-white/[0.01] border border-white/5 rounded-[32px] p-8 space-y-6">
                            <div className="space-y-5">
                                <div className="space-y-2.5">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-2">Especialidad del Bot</label>
                                    <select 
                                        value={config.specialty}
                                        onChange={(e) => setConfig({...config, specialty: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs font-black text-white italic outline-none focus:border-cyan-500 appearance-none cursor-pointer"
                                    >
                                        {specialties.map(s => <option key={s} value={s} className="bg-[#0A0A1F]">{s}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-2">Voz de Marca</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {personalities.map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setConfig({...config, personality: p})}
                                                className={`py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${config.personality === p ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-2">Instrucciones Maestras</label>
                                    <textarea 
                                        value={config.instructions}
                                        onChange={(e) => setConfig({...config, instructions: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[11px] font-medium text-gray-300 outline-none focus:border-cyan-500 h-24 resize-none"
                                        placeholder="Define el comportamiento..."
                                    />
                                </div>

                                <button 
                                    onClick={handleSave}
                                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
                                >
                                    <Save className="w-3.5 h-3.5" /> Sincronizar Cerebro
                                </button>
                            </div>
                        </div>

                        {/* KNOWLEDGE BASE PANEL */}
                        <div className="lg:col-span-12 xl:col-span-7 bg-white/[0.01] border border-white/5 rounded-[32px] p-8 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                <Cpu className="w-40 h-40 text-white" />
                            </div>

                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <div>
                                    <h3 className="text-sm font-black text-white italic uppercase tracking-tighter">Bóveda de Conocimiento</h3>
                                    <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">Entrenamiento DNA</p>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-black text-[8px] uppercase tracking-widest hover:scale-105 transition-all">
                                    <Plus className="w-3 h-3" /> Añadir Activo
                                </button>
                            </div>

                            <div className="flex-1 min-h-[140px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl p-6 relative z-10 bg-black/20">
                                <BrainCircuit className="w-7 h-7 text-gray-800 mb-3" />
                                <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">Bóveda Vacía</span>
                                <p className="text-[8px] text-gray-600 mt-1.5 text-center max-w-[200px]">Carga activos para entrenamiento contextual.</p>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3 relative z-10">
                                <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-3">
                                    <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg"><ShieldCheck className="w-3.5 h-3.5" /></div>
                                    <p className="text-[8px] font-black text-white uppercase tracking-tighter">Sync DNA Local</p>
                                </div>
                                <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-center gap-3">
                                    <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg"><Cpu className="w-3.5 h-3.5" /></div>
                                    <p className="text-[8px] font-black text-white uppercase tracking-tighter">DIIC-Master-V9</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="chat"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="h-[400px] border border-white/5 rounded-3xl overflow-hidden bg-black/40"
                    >
                        <AdminAIChatbot clientMode={true} clientContext={client} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TabBtn({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                active 
                ? 'bg-white text-black shadow-lg shadow-white/10' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
        >
            <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-600' : ''}`} />
            {label}
        </button>
    );
}
