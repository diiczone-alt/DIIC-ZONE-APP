'use client';

import { motion } from 'framer-motion';
import { 
    BrainCircuit, Zap, CheckCircle2, 
    TrendingUp, Shield, Activity, 
    ArrowUpRight, Target, Database
} from 'lucide-react';

const TRAINING_LOGS = [
    { id: 1, action: "Corrección de Tono", detail: "Ajuste de 'Amistoso' a 'Quirúrgico' en cotización de cirugía.", time: "Hace 2h", status: "success" },
    { id: 2, action: "Regla de Oro Aplicada", detail: "Bloqueo de descuento no autorizado en Consulta Pro.", time: "Hace 5h", status: "shield" },
    { id: 3, action: "Refinamieno de DNA", detail: "Inyección de terminología médica avanzada (Urología).", time: "Ayer", status: "success" },
];

export default function AITrainingMonitor() {
    return (
        <div className="bg-[#0A0A12] border border-white/5 rounded-[2.5rem] p-8 h-full relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-700" />
            
            <div className="relative z-10 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
                            <BrainCircuit className="w-6 h-6 text-indigo-500 fill-current" /> Monitor de DNA
                        </h3>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Evolución de Inteligencia Quirúrgica</p>
                    </div>
                    <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Madurez: 88%</span>
                    </div>
                </div>

                {/* Progress Bar Group */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-[9px] font-black uppercase text-gray-400">
                            <span>Tono Quirúrgico</span>
                            <span className="text-white">92%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '92%' }}
                                className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-[9px] font-black uppercase text-gray-400">
                            <span>Cumplimiento Golden Rules</span>
                            <span className="text-emerald-400">100%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            />
                        </div>
                    </div>
                </div>

                {/* Training Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Correcciones', value: '142', icon: Activity },
                        { label: 'Conflictos Evitados', value: '28', icon: Shield },
                        { label: 'Nuevos Tokens', value: '+1.2k', icon: Database },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-center">
                            <stat.icon className="w-4 h-4 text-gray-500 mx-auto mb-2" />
                            <div className="text-lg font-black text-white italic">{stat.value}</div>
                            <div className="text-[7px] font-black text-gray-600 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Activity Feed */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Log de Refinamiento</h4>
                    <div className="space-y-3">
                        {TRAINING_LOGS.map((log) => (
                            <motion.div 
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-4 p-3 bg-white/[0.01] hover:bg-white/[0.03] rounded-xl border border-transparent hover:border-white/5 transition-all group/item"
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    log.status === 'success' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                    {log.status === 'success' ? <Zap className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className="text-[10px] font-black text-white uppercase tracking-tight">{log.action}</span>
                                        <span className="text-[8px] font-bold text-gray-600">{log.time}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-tight">{log.detail}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom Action */}
                <button className="w-full py-4 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all border border-indigo-500/20 group-hover:border-indigo-500 shadow-xl shadow-indigo-600/10">
                    Sincronizar DNA en Tiempo Real
                </button>
            </div>
        </div>
    );
}
