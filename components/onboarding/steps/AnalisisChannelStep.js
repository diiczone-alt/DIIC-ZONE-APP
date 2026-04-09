'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Calendar, Database, Check, X, Minus, ShieldCheck, Zap } from 'lucide-react';

export default function AnalisisChannelStep({ onNext, updateData }) {
    const [channels, setChannels] = useState({
        whatsapp: null,
        booking: null,
        crm: null
    });

    const handleSelect = (key, value) => {
        setChannels(prev => ({ ...prev, [key]: value }));
    };

    const isComplete = Object.values(channels).every(v => v !== null);

    const questions = [
        {
            id: 'whatsapp',
            label: 'Canal WhatsApp',
            icon: MessageSquare,
            desc: 'Gestión de prospección y soporte directo.',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            id: 'booking',
            label: 'Sistema Agendamiento',
            icon: Calendar,
            desc: 'Calendly, Google o herramientas de reserva.',
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10'
        },
        {
            id: 'crm',
            label: 'Infraestructura CRM',
            icon: Database,
            desc: 'Software de seguimiento de leads y ventas.',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        }
    ];

    const OptionButton = ({ status, type, onClick, activeColor }) => {
        const isSelected = status === (type === 'yes' ? 'yes' : type === 'no' ? 'no' : 'partial');
        
        const colors = {
            yes: { active: 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]', idle: 'border-white/10 text-gray-500 hover:border-emerald-500/50' },
            partial: { active: 'bg-indigo-500 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]', idle: 'border-white/10 text-gray-500 hover:border-indigo-500/50' },
            no: { active: 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]', idle: 'border-white/10 text-gray-500 hover:border-white/30' }
        };

        const config = colors[type];
        const icon = type === 'yes' ? <Check className="w-3.5 h-3.5" /> : type === 'no' ? <X className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />;
        const label = type === 'yes' ? 'SÍ' : type === 'no' ? 'NO' : 'A VECES';

        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-300 font-black text-[10px] tracking-widest uppercase ${isSelected ? config.active : config.idle}`}
            >
                {icon} {label}
            </motion.button>
        );
    };

    return (
        <div className="space-y-10 flex flex-col h-full w-full max-w-4xl mx-auto py-4">
            <div className="text-center space-y-3">
                <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                    Canales & <span className="text-indigo-500 px-3 py-1 bg-indigo-500/10 rounded-2xl not-italic">Tecnología</span>
                </h2>
                <div className="flex items-center justify-center gap-3 opacity-40">
                    <div className="h-[1px] w-12 bg-white" />
                    <p className="text-[10px] font-mono font-black uppercase text-gray-400 tracking-[0.4em]">Diagnóstico de Infraestructura Actual</p>
                    <div className="h-[1px] w-12 bg-white" />
                </div>
            </div>

            <div className="flex-1 space-y-4">
                {questions.map((q, idx) => (
                    <motion.div 
                        key={q.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 hover:border-white/20 transition-all duration-500 overflow-hidden"
                    >
                        {/* Background Technical Accent */}
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Zap className="w-32 h-32 text-white rotate-12" />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                            {/* Left Side: Info */}
                            <div className="flex items-center gap-6 md:w-1/2">
                                <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center border border-white/5 transition-all duration-500 group-hover:scale-110 ${q.bg} ${q.color} shadow-2xl`}>
                                    <q.icon className="w-7 h-7" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge status={channels[q.id]} />
                                        <h3 className="font-black text-xl text-white italic uppercase tracking-tighter">{q.label}</h3>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[280px]">{q.desc}</p>
                                </div>
                            </div>

                            {/* Right Side: Options */}
                            <div className="flex gap-3 bg-black/40 p-2 border border-white/5 rounded-2xl md:w-1/2">
                                <OptionButton
                                    status={channels[q.id]}
                                    type="yes"
                                    onClick={() => handleSelect(q.id, 'yes')}
                                />
                                <OptionButton
                                    status={channels[q.id]}
                                    type="partial"
                                    onClick={() => handleSelect(q.id, 'partial')}
                                />
                                <OptionButton
                                    status={channels[q.id]}
                                    type="no"
                                    onClick={() => handleSelect(q.id, 'no')}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="space-y-4 pt-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { updateData({ existingChannels: channels }); onNext(); }}
                    disabled={!isComplete}
                    className={`w-full py-6 rounded-[2rem] font-black text-lg uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-5 relative overflow-hidden ${
                        isComplete 
                        ? 'bg-white text-black shadow-[0_20px_50px_rgba(255,255,255,0.15)]' 
                        : 'bg-white/5 text-gray-700 border border-white/5 pointer-events-none'
                    }`}
                >
                    <ShieldCheck className={`w-6 h-6 ${isComplete ? 'text-black' : 'text-gray-800'}`} />
                    Finalizar Diagnóstico
                </motion.button>
                
                {/* Technical Footnote */}
                <div className="flex justify-between px-8 opacity-20 font-mono text-[7px] tracking-[0.5em] uppercase">
                    <span>Infrastruct_Check_v3.2</span>
                    <span>Systems_Diagnostic_Ready</span>
                </div>
            </div>
        </div>
    );
}

function Badge({ status }) {
    if (!status) return <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />;
    const color = status === 'yes' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : status === 'no' ? 'bg-white' : 'bg-indigo-500 shadow-[0_0_100px_rgba(99,102,241,0.5)]';
    return <div className={`w-1.5 h-1.5 rounded-full ${color} animate-pulse`} />;
}
