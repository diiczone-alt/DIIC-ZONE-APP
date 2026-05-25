'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Check, Zap,
    Activity, ShieldCheck,
    ClipboardList, Scissors, MessageCircle, BarChart2,
    Film, ImageIcon, Megaphone, Target, DollarSign, Settings, PieChart
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
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        {services.map((service, idx) => (
                            <PricingCard 
                                key={service.id} 
                                service={service} 
                                index={idx} 
                            />
                        ))}
                    </div>

                    {/* New Presentation Details & Paid Ads sections requested by user */}
                    <ServiceDetails />
                    <PaidAdvertising />
                </>
            )}
        </section>
    );
}

function PricingCard({ service, index }) {
    const isPopular = service.level === 'PLAN CLAVE';

    const handleWhatsApp = () => {
        const text = `Hola! Me interesa el ${service.name}. Quiero iniciar el despliegue estratégico.`;
        window.open(`https://wa.me/5491100000000?text=${encodeURIComponent(text)}`, '_blank');
    };

    // Mapeo de características basado en la imagen de referencia
    const getFeatures = (name) => {
        const upperName = name.toUpperCase();
        if (upperName.includes('PRESENCIA')) {
            return [
                'Estrategia de contenido',
                'Calendario editorial',
                'Community mgmt'
            ];
        }
        if (upperName.includes('CRECIMIENTO')) {
            return [
                'Estrategia de captación',
                'Calendario editorial',
                'Community mgmt',
                'Edición profesional'
            ];
        }
        if (upperName.includes('AUTORIDAD')) {
            return [
                'Narrativa de marca',
                'Calendario editorial',
                'Community mgmt',
                'Producción de contenido',
                'Edición profesional'
            ];
        }
        if (upperName.includes('ÉLITE') || upperName.includes('ELITE') || upperName.includes('CONTROL')) {
            return [
                'Estrategia B2B',
                'Calendario editorial',
                'Community mgmt',
                'Producción de contenido',
                'Edición profesional',
                'Viralidad agresiva'
            ];
        }
        return [
            'Estrategia de contenido',
            'Calendario editorial',
            'Community mgmt'
        ];
    };

    const features = getFeatures(service.name);

    const formatPlanName = (name) => {
        let clean = name.replace(/PLAN /gi, '').replace(/Nivel /gi, '').trim();
        if (clean.toLowerCase() === 'elite') clean = 'Control';
        return `Nivel ${clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase()}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`p-8 rounded-[2rem] border flex flex-col h-full relative overflow-hidden group transition-all duration-700 backdrop-blur-xl ${
                isPopular 
                ? 'bg-gradient-to-b from-indigo-600 to-indigo-900/90 border-indigo-400/50 shadow-[0_0_50px_rgba(99,102,241,0.25)] scale-105 z-10' 
                : 'bg-white/[0.02] border-white/10 hover:border-white/20 shadow-2xl'
            }`}
        >
            {/* Header Badge */}
            <div className="flex items-center mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    isPopular ? 'bg-black/20 text-white shadow-inner' : 'bg-white/5 text-gray-300 border border-white/5'
                }`}>
                    {service.level === 'PLAN CLAVE' ? 'NIVEL CLAVE' : service.level} {isPopular && '⭐'}
                </span>
            </div>

            {/* Plan Name & Short Phrase */}
            <div className="mb-6">
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{formatPlanName(service.name)}</h3>
                <p className={`text-sm font-medium leading-relaxed ${isPopular ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {service.name.toUpperCase().includes('PRESENCIA') ? "Presencia digital para generar confianza visual." :
                     service.name.toUpperCase().includes('CRECIMIENTO') ? "Sistema enfocado en captar clientes calificados." :
                     service.name.toUpperCase().includes('AUTORIDAD') ? "Conviértete en el referente #1 de tu nicho." :
                     "Dominio total del mercado y viralidad agresiva."}
                </p>
            </div>

            {/* Price Main */}
            <div className="mb-8 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 tracking-tighter">
                        ${service.price}
                    </span>
                </div>
                <div className="flex flex-col gap-3 mt-2">
                    <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${isPopular ? 'text-indigo-200/80' : 'text-gray-500'}`}>/mes · sin IVA</p>
                    
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit text-[10px] font-black uppercase tracking-widest ${
                        isPopular ? 'bg-black/20 text-white' : 'bg-white/5 text-gray-300 border border-white/5'
                    }`}>
                        <Zap className={`w-3 h-3 ${isPopular ? 'text-amber-400' : 'text-amber-500/70'}`} />
                        Setup Inicial: $70 - $120
                    </div>
                </div>
            </div>

            {/* Features List */}
            <div className="flex-1 space-y-4 mb-8">
                {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 rounded-full p-0.5 ${isPopular ? 'bg-white/20' : 'bg-white/5'}`}>
                            <Check className={`w-3.5 h-3.5 ${isPopular ? 'text-white' : 'text-emerald-400'}`} strokeWidth={3} />
                        </div>
                        <span className={`text-sm font-medium ${isPopular ? 'text-white/90' : 'text-gray-300'}`}>{feature}</span>
                    </div>
                ))}
            </div>

            {/* Deliverables Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <DeliverableItem label="Videos" value={service.deliverables?.videos || service.deliverables?.reels || 0} isPopular={isPopular} />
                <DeliverableItem label="Posts" value={service.deliverables?.posts || 0} isPopular={isPopular} />
            </div>

            {/* Action CTA */}
            <button
                onClick={handleWhatsApp}
                className={`w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    isPopular 
                    ? 'bg-white text-black hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 shadow-lg'
                }`}
            >
                INICIAR DESPLIEGUE
            </button>
        </motion.div>
    );
}

function DeliverableItem({ label, value, isPopular }) {
    return (
        <div className={`py-4 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 border ${
            isPopular ? 'bg-black/10 border-white/10' : 'bg-white/[0.02] border-white/5'
        }`}>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">{value}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isPopular ? 'text-white/60' : 'text-gray-500'}`}>{label}</span>
        </div>
    );
}

function ServiceDetails() {
    const details = [
        { icon: ClipboardList, title: "Estrategia & Calendario", desc: "Plan mensual de contenido con temas, fechas y objetivos claros por plataforma." },
        { icon: Film, title: "Producción filmmaker", desc: "Sesión profesional de filmación para crear contenido de calidad cinematográfica." },
        { icon: Scissors, title: "Edición de video", desc: "Reels y videos editados con subtítulos, música, efectos and branding de tu marca." },
        { icon: ImageIcon, title: "Diseño gráfico", desc: "Posts, carruseles, stories e infografías con identidad visual consistente." },
        { icon: MessageCircle, title: "Community management", desc: "Respuesta a comentarios y mensajes. Construcción activa de tu comunidad." },
        { icon: Megaphone, title: "Gestión de pauta", desc: "Creamos y optimizamos tus anuncios. El presupuesto lo pones tú a la plataforma." },
        { icon: BarChart2, title: "Reporte mensual", desc: "Informe con alcance, clics, leads y recomendaciones para el siguiente mes." },
        { icon: Target, title: "Estrategia de conversión", desc: "Cada pieza de contenido diseñada para atraer clientes reales a tu negocio." }
    ];

    return (
        <div className="space-y-8 relative z-10 pt-16">
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5" />
                <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] whitespace-nowrap">Detalle de Servicios</h2>
                <div className="h-px flex-1 bg-white/5" />
            </div>
            
            <div className="mb-6">
                <h3 className="text-3xl font-black text-white tracking-tighter">Todo lo que incluye tu nivel mensual</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.map((item, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex gap-6 items-start hover:bg-white/[0.04] transition-colors">
                        <div className="p-4 bg-white/5 rounded-xl text-indigo-400">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white mb-2">{item.title}</h4>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PaidAdvertising() {
    return (
        <div className="space-y-12 relative z-10 pt-10">
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5" />
                <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] whitespace-nowrap">Publicidad Pagada</h2>
                <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="mb-8">
                <h3 className="text-3xl font-black text-white tracking-tighter">¿Cómo funciona la pauta publicitaria?</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/[0.02] border border-indigo-500/30 p-8 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400">01</div>
                    <div className="p-5 bg-white/5 rounded-2xl text-yellow-500 mb-6 mt-4">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-white mb-4">Tú pones el presupuesto</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">El cliente transfiere directamente a Facebook, Instagram, TikTok o YouTube. Ese dinero nunca pasa por nosotros — es 100% tuyo y de la plataforma.</p>
                </div>
                
                <div className="bg-white/[0.02] border border-purple-500/30 p-8 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-black text-purple-400">02</div>
                    <div className="p-5 bg-white/5 rounded-2xl text-purple-400 mb-6 mt-4">
                        <Settings className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-white mb-4">Nosotros lo gestionamos</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Creamos los anuncios, diseñamos las creatividades, segmentamos la audiencia correcta y optimizamos semana a semana para maximizar resultados.</p>
                </div>

                <div className="bg-white/[0.02] border border-emerald-500/30 p-8 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400">03</div>
                    <div className="p-5 bg-white/5 rounded-2xl text-emerald-400 mb-6 mt-4">
                        <PieChart className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-white mb-4">Recibes el reporte</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Cada mes te enviamos un informe detallado: cuántas personas vieron tus anuncios, cuántos clicaron, cuántos contactaron y cuánto invertiste vs. retorno.</p>
                </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/25 p-6 rounded-2xl">
                <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                    La gestión de pauta está <strong className="font-black uppercase tracking-widest text-emerald-400">INCLUIDA</strong> en tu nivel. Solo necesitas poner tu presupuesto de anuncios. Si superas el límite del nivel, aplicamos un pequeño porcentaje adicional.
                </p>
            </div>

            <div className="pt-12">
                <div className="mb-10">
                    <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-2">Inversión en Pauta</h2>
                    <h3 className="text-3xl font-black text-white tracking-tighter">Presupuesto recomendado y distribución por nivel</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Presencia */}
                    <div className="bg-white/[0.02] border-t-4 border-blue-500 p-6 rounded-b-2xl border-x border-b border-white/5">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-6">NIVEL PRESENCIA</h4>
                        <div className="text-center mb-6">
                            <span className="text-3xl font-black text-white tracking-tighter">$200-$300</span>
                            <p className="text-[8px] text-gray-600 mt-1 uppercase tracking-widest">presupuesto del cliente/mes</p>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center mb-4">
                            <p className="text-xs font-black text-emerald-400">✦ Gestión incluida hasta $200</p>
                        </div>
                        <div className="text-center mb-8">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">+15% si supera el límite</p>
                            <p className="text-[10px] font-medium text-gray-500">$30-$45/mes</p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Distribución Recomendada</p>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>Facebook/Instagram</span><span>60%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[60%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>TikTok</span><span>30%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[30%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>YouTube</span><span>10%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-orange-500 h-full w-[10%]"></div></div>
                            </div>
                        </div>
                    </div>

                    {/* Crecimiento */}
                    <div className="bg-white/[0.02] border-t-4 border-purple-500 p-6 rounded-b-2xl border-x border-b border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)] relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-purple-500/20 to-transparent opacity-50 pointer-events-none rounded-b-2xl"></div>
                        <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] text-center mb-6 relative z-10">NIVEL CRECIMIENTO</h4>
                        <div className="text-center mb-6 relative z-10">
                            <span className="text-3xl font-black text-white tracking-tighter">$300-$600</span>
                            <p className="text-[8px] text-gray-600 mt-1 uppercase tracking-widest">presupuesto del cliente/mes</p>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center mb-4 relative z-10">
                            <p className="text-xs font-black text-emerald-400">✦ Gestión incluida hasta $500</p>
                        </div>
                        <div className="text-center mb-8 relative z-10">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">+15% si supera el límite</p>
                            <p className="text-[10px] font-medium text-gray-500">$45-$90/mes</p>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Distribución Recomendada</p>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>Facebook/Instagram</span><span>50%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-purple-500 h-full w-[50%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>TikTok</span><span>30%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[30%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>YouTube</span><span>20%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-orange-500 h-full w-[20%]"></div></div>
                            </div>
                        </div>
                    </div>

                    {/* Autoridad */}
                    <div className="bg-white/[0.02] border-t-4 border-cyan-500 p-6 rounded-b-2xl border-x border-b border-white/5">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-6">NIVEL AUTORIDAD</h4>
                        <div className="text-center mb-6">
                            <span className="text-3xl font-black text-white tracking-tighter">$500-$1,000</span>
                            <p className="text-[8px] text-gray-600 mt-1 uppercase tracking-widest">presupuesto del cliente/mes</p>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center mb-4">
                            <p className="text-xs font-black text-emerald-400">✦ Gestión incluida hasta $1,000</p>
                        </div>
                        <div className="text-center mb-8">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">+12% si supera el límite</p>
                            <p className="text-[10px] font-medium text-gray-500">$60-$120/mes</p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Distribución Recomendada</p>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>Facebook/Instagram</span><span>40%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-cyan-500 h-full w-[40%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>TikTok</span><span>30%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[30%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>YouTube</span><span>30%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-orange-500 h-full w-[30%]"></div></div>
                            </div>
                        </div>
                    </div>

                    {/* Control (Elite) */}
                    <div className="bg-white/[0.02] border-t-4 border-yellow-500 p-6 rounded-b-2xl border-x border-b border-white/5">
                        <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] text-center mb-6">NIVEL CONTROL</h4>
                        <div className="text-center mb-6">
                            <span className="text-2xl lg:text-3xl font-black text-white tracking-tighter whitespace-nowrap">$1,000-$2,500</span>
                            <p className="text-[8px] text-gray-600 mt-1 uppercase tracking-widest">presupuesto del cliente/mes</p>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center mb-4">
                            <p className="text-xs font-black text-emerald-400">✦ Gestión incluida hasta $2,000</p>
                        </div>
                        <div className="text-center mb-8">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">+10% si supera el límite</p>
                            <p className="text-[10px] font-medium text-gray-500">$100-$250/mes</p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">Distribución Recomendada</p>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>Facebook/Instagram</span><span>35%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-yellow-500 h-full w-[35%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>TikTok</span><span>30%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[30%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>YouTube</span><span>35%</span></div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><div className="bg-cyan-500 h-full w-[35%]"></div></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
