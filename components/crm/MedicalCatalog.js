'use client';

import { motion } from 'framer-motion';
import { 
    Activity, Shield, Zap, DollarSign, 
    Stethoscope, Heart, Scissors, Plus,
    ShoppingCart, Info, CheckCircle2
} from 'lucide-react';

const MEDICAL_SERVICES = [
    {
        id: 'serv_1',
        name: 'Consulta de Urología General',
        description: 'Evaluación integral, revisión de historial y diagnóstico preventivo.',
        price: 80,
        category: 'CONSULTA',
        icon: Stethoscope
    },
    {
        id: 'serv_2',
        name: 'Ecografía Renal y Vesical',
        description: 'Imagenología de alta resolución para detección de cálculos o quistes.',
        price: 120,
        category: 'DIAGNÓSTICO',
        icon: Activity
    },
    {
        id: 'serv_3',
        name: 'Cirugía Robótica Próstata',
        description: 'Procedimiento de mínima invasión con tecnología Da Vinci.',
        price: 8500,
        category: 'QUIRÚRGICO',
        icon: Zap
    },
    {
        id: 'serv_4',
        name: 'Circuncisión Laser',
        description: 'Técnica avanzada con recuperación rápida y menor inflamación.',
        price: 1500,
        category: 'QUIRÚRGICO',
        icon: Scissors
    }
];

export default function MedicalCatalog({ onSelect, onClose }) {
    return (
        <div className="h-full flex flex-col bg-[#0A0A12] border-l border-white/10 shadow-3xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div>
                    <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">Catálogo de Servicios</h3>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1 italic">Modo Ecommerce Activo</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all">
                    <Plus className="w-5 h-5 rotate-45" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {MEDICAL_SERVICES.map((service, i) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 bg-[#151520] border border-white/5 rounded-2xl group hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden"
                        onClick={() => onSelect(service)}
                    >
                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                <service.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[8px] font-black px-2 py-1 bg-white/5 text-gray-500 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                {service.category}
                            </span>
                        </div>

                        <div className="space-y-1 relative z-10">
                            <h4 className="text-xs font-black text-white uppercase tracking-tight group-hover:text-indigo-200 transition-colors">{service.name}</h4>
                            <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{service.description}</p>
                        </div>

                        <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-3 relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Inversión Rec.</span>
                                <span className="text-sm font-black text-white italic tracking-tighter">${service.price.toLocaleString()}</span>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-indigo-600/30">
                                <Plus className="w-3 h-3" /> Añadir
                            </button>
                        </div>

                        {/* Decoration */}
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all" />
                    </motion.div>
                ))}
            </div>

            <div className="p-6 border-t border-white/5 bg-black/40">
                <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-[9px] font-medium text-emerald-300 leading-snug">
                        El catálogo se actualiza con los precios de la <span className="font-black">Dra. Jessica Rey</span> automáticamente.
                    </p>
                </div>
            </div>
        </div>
    );
}
