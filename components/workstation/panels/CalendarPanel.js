'use client';

import { motion } from 'framer-motion';
import { 
    Calendar as CalendarIcon, Clock, MapPin, 
    Video, Plus, ChevronLeft, ChevronRight, X 
} from 'lucide-react';

const EVENTS = [
    {
        id: 1,
        title: 'Rodaje Empresa Tech',
        time: '09:00 - 13:00',
        location: 'Estudio A',
        type: 'production',
        color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    },
    {
        id: 2,
        title: 'Reunión Estratégica',
        time: '15:00 - 16:00',
        location: 'Google Meet',
        type: 'meeting',
        color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
    },
    {
        id: 3,
        title: 'Deadline Edición Nike',
        time: '18:00',
        location: 'HQ',
        type: 'deadline',
        color: 'bg-rose-500/10 border-rose-500/20 text-rose-400'
    }
];

export default function CalendarPanel({ onClose }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-16 right-0 w-[450px] bg-[#0E0E18]/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden z-[100]"
        >
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex flex-col items-center justify-center border border-indigo-500/20">
                        <span className="text-[10px] font-black text-indigo-400 uppercase leading-none">May</span>
                        <span className="text-lg font-black text-white">06</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Mi Agenda</h3>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">3 Eventos hoy</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 transition-all">
                        <Plus className="w-4 h-4" />
                    </button>
                    <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Mini Calendar Navigation */}
            <div className="p-6 flex items-center justify-between border-b border-white/5">
                <button className="text-gray-500 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Mayo 2026</span>
                <button className="text-gray-500 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
            </div>

            {/* Events Feed */}
            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {EVENTS.map((event) => (
                    <div key={event.id} className={`p-6 rounded-[2rem] border ${event.color} relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-sm font-black uppercase italic tracking-tight">{event.title}</h4>
                                <div className="p-2 rounded-xl bg-white/10">
                                    <Clock className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex items-center gap-2 text-[10px] font-bold opacity-80 uppercase tracking-widest">
                                    <Clock className="w-3.5 h-3.5" /> {event.time}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold opacity-80 uppercase tracking-widest">
                                    <MapPin className="w-3.5 h-3.5" /> {event.location}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-black/20 border-t border-white/5 text-center">
                <button className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-indigo-400 transition-colors">
                    Ver calendario completo
                </button>
            </div>
        </motion.div>
    );
}
