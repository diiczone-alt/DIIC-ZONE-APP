'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Check, Zap, Shield, Crown, 
    Star, Video, Palette, Target,
    Activity, ShieldCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function GrowthPricing() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            setLoading(true);
            try {
                const { data } = await supabase
                    .from('services')
                    .select('*')
                    .eq('category', 'plan')
                    .order('price', { ascending: true });
                setServices(data || []);
            } catch (err) {
                console.error("Error loading services:", err);
            } finally {
                setLoading(false);
            }
        };
        loadServices();
    }, []);

    return (
        <section className="relative py-20 bg-transparent space-y-16">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">
                    <Activity className="w-2.5 h-2.5 text-indigo-500" />
                    Planes de Expansión DIIC
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white italic tracking-tighter leading-[1.1] uppercase">
                    PENSADO A <span className="text-indigo-500">LARGO PLAZO</span>
                </h2>
                
                <div className="flex justify-center pt-4">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full shadow-2xl backdrop-blur-md transition-all hover:bg-white/10 group">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">
                            PROTECCIÓN ESTRATÉGICA: <strong className="text-white">CONTRATO MÍNIMO 3 MESES</strong>
                        </span>
                    </div>
                </div>
            </motion.div>

            {loading ? (
                <div className="flex items-center justify-center py-40">
                    <div className="w-10 h-10 border-t-2 border-indigo-500 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {services.map((service, idx) => (
                        <PricingCard 
                            key={service.id} 
                            service={service} 
                            index={idx} 
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

function PricingCard({ service, index }) {
    const isPopular = service.level === 'PLAN CLAVE';
    const icons = [Shield, Zap, Crown, Star];
    const Icon = icons[index] || Zap;

    const handleWhatsApp = () => {
        const text = `Hola! Me interesa el ${service.name}. Quiero iniciar el despliegue estratégico.`;
        window.open(`https://wa.me/5491100000000?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`p-10 rounded-[3rem] border flex flex-col h-full relative overflow-hidden group transition-all duration-700 ${
                isPopular 
                ? 'bg-indigo-600 border-indigo-400 shadow-[0_40px_80px_rgba(99,102,241,0.2)] scale-105 z-10' 
                : 'bg-[#0E0E18] border-white/5 hover:border-white/10 shadow-2xl'
            }`}
        >
            {isPopular && (
                <div className="absolute top-8 right-8 bg-white/20 text-white text-[9px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20 animate-pulse">
                    NIVEL RECOMENDADO
                </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-5 mb-10">
                <div className={`p-4 rounded-[1.8rem] transition-all duration-500 ${
                    isPopular ? 'bg-white/20 scale-110' : 'bg-white/5 text-indigo-500 opacity-60 group-hover:opacity-100 group-hover:scale-110'
                }`}>
                    <Icon className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-white italic leading-tight mb-1 uppercase tracking-tighter">{service.name}</h3>
                    <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${isPopular ? 'text-white/50' : 'text-gray-600'}`}>{service.level}</p>
                </div>
            </div>

            {/* Price Main */}
            <div className="mb-8">
                <p className={`text-[8px] font-black uppercase tracking-[0.5em] mb-2 ${isPopular ? 'text-white/40' : 'text-gray-700'}`}>Inversión Mensual</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-white tracking-tighter italic">${service.price}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isPopular ? 'text-white/40' : 'text-gray-700'}`}>/MES <span className="opacity-50">(+ IVA)</span></span>
                </div>
            </div>

            {/* Sub Prices Box */}
            <div className="grid grid-cols-1 gap-2 mb-10">
                <div className={`p-4 rounded-2xl border transition-colors ${
                    isPopular ? 'bg-black/20 border-white/10' : 'bg-white/[0.02] border-white/5'
                }`}>
                    <div className="flex justify-between items-center">
                        <span className={`text-[8px] font-black uppercase tracking-widest ${isPopular ? 'text-white/40' : 'text-gray-600'}`}>PAGO TRIMESTRAL:</span>
                        <span className="text-xs font-black text-white">${service.threemonthprice}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                        <span className={`text-[8px] font-black uppercase tracking-widest ${isPopular ? 'text-white/40' : 'text-gray-600'}`}>SETUP Y ONBOARDING:</span>
                        <span className="text-xs font-black text-white">${service.setupfee}</span>
                    </div>
                </div>
            </div>

            {/* Narrative */}
            <div className={`p-8 rounded-[2.5rem] mb-10 flex-1 flex items-center justify-center italic text-center text-[13px] font-medium leading-relaxed tracking-tight ${
                isPopular ? 'bg-white/10 text-white border border-white/10 shadow-inner' : 'bg-black/40 text-gray-400 border border-white/5'
            }`}>
                "{service.narrative}"
            </div>

            {/* Info Row: Enfoque & Filmmaker */}
            <div className="grid grid-cols-2 gap-4 mb-10 px-2 pt-4 border-t border-white/5">
                <div>
                    <p className={`text-[8px] font-black uppercase tracking-[0.3em] mb-1 ${isPopular ? 'text-white/40' : 'text-gray-600'}`}>FILOSOFÍA</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isPopular ? 'text-emerald-300' : 'text-emerald-500'}`}>{service.enfoque}</p>
                </div>
                <div className="text-right">
                    <p className={`text-[8px] font-black uppercase tracking-[0.3em] mb-1 ${isPopular ? 'text-white/40' : 'text-gray-600'}`}>PRODUCCIÓN</p>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest italic">{service.filmmaker}</p>
                </div>
            </div>

            {/* Deliverables Grid */}
            <div className="grid grid-cols-3 gap-2 mb-12">
                <DeliverableItem label="FILMMAKER" value={service.deliverables?.videos || 'Sin sesión'} isPopular={isPopular} icon={Video} />
                <DeliverableItem label="REELS" value={service.deliverables?.reels || 0} isPopular={isPopular} icon={Video} />
                <DeliverableItem label="POSTS" value={service.deliverables?.posts || 0} isPopular={isPopular} icon={Palette} />
            </div>

            {/* Action CTA */}
            <button
                onClick={handleWhatsApp}
                className={`w-full py-6 rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.4em] transition-all duration-500 relative overflow-hidden group/btn ${
                    isPopular 
                    ? 'bg-white text-black hover:bg-emerald-400 shadow-2xl' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl'
                }`}
            >
                <span className="relative z-10">INICIAR DESPLIEGUE</span>
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000`} />
            </button>
        </motion.div>
    );
}

function DeliverableItem({ label, value, isPopular, icon: Icon }) {
    const isString = typeof value === 'string' && value.length > 2;

    return (
        <div className={`p-4 rounded-2xl border flex flex-col items-center gap-1 transition-all group-hover:scale-105 ${
            isPopular ? 'bg-white/10 border-white/10' : 'bg-white/[0.03] border-white/5'
        }`}>
            <Icon className={`w-3.5 h-3.5 mb-1 ${isPopular ? 'text-white/60' : 'text-indigo-400/50'}`} />
            <p className={`${isString ? 'text-xs' : 'text-2xl'} font-black text-white italic leading-tight text-center uppercase`}>{value}</p>
            <p className={`text-[7px] font-black uppercase tracking-widest ${isPopular ? 'text-white/40' : 'text-gray-700'}`}>{label}</p>
        </div>
    );
}
