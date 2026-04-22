'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CheckCircle2, Bot, Bell, Shield, ChevronRight } from 'lucide-react';

export default function ScheduleModal({ lead, onClose, onSchedule }) {
    const [step, setStep] = useState(1);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [syncGoogle, setSyncGoogle] = useState(true);

    const handleSchedule = () => {
        if (!date || !time) return;
        
        // Simulator: Syncing
        setStep(3);
        setTimeout(() => {
            onSchedule({ date, time, syncGoogle });
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#0A0A12] border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-black italic uppercase tracking-tighter text-lg">Agendar Cita</h3>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Dra. Jessica Rey • Google Calendar Sync</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div 
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Paciente</label>
                                        <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white font-bold flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px]">
                                                {lead.name.charAt(0)}
                                            </div>
                                            {lead.name}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Fecha</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-indigo-400" />
                                                <input 
                                                    type="date" 
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all custom-calendar-picker"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Hora</label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-3.5 w-4 h-4 text-indigo-400" />
                                                <input 
                                                    type="time" 
                                                    value={time}
                                                    onChange={(e) => setTime(e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-tight">Sincronizar con Google Calendar</p>
                                            <p className="text-[9px] text-indigo-300/60 font-medium">Se enviará invitación automática al paciente.</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSyncGoogle(!syncGoogle)}
                                        className={`w-12 h-6 rounded-full transition-all relative ${syncGoogle ? 'bg-indigo-500' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${syncGoogle ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>

                                <button 
                                    onClick={handleSchedule}
                                    disabled={!date || !time}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
                                >
                                    Confirmar y Agendar <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div 
                                key="step3"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="py-12 flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full border-2 border-indigo-500/20 flex items-center justify-center">
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                            className="absolute border-t-2 border-indigo-500 w-full h-full rounded-full"
                                        />
                                        <Calendar className="w-10 h-10 text-indigo-400" />
                                    </div>
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 1 }}
                                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                    </motion.div>
                                </div>
                                <div>
                                    <h4 className="text-xl font-black italic uppercase tracking-tighter text-white">Sincronizando...</h4>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mt-2">Asistente Google Calendar Activado</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
