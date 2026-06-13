'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Check, Zap, Activity, ShieldCheck, ClipboardList, Scissors, 
    MessageCircle, BarChart2, Film, ImageIcon, Megaphone, Target, 
    DollarSign, Settings, PieChart, CreditCard, Lock, RefreshCw, 
    AlertCircle, CheckCircle2, X, Printer, ArrowRight, ChevronDown, ChevronUp
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';
import { NICHE_DETAILS } from '@/lib/nicheDetails';

const getAdaptedPrice = (basePrice, planName, industry) => {
    const cleanNiche = (str) => (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const ind = cleanNiche(industry);
    const isMedical = ind.includes('medico') || ind.includes('salud') || ind.includes('health') || ind.includes('doctor') || ind.includes('urologia');
    const isHospital = ind.includes('hospital') || ind.includes('clinica');
    
    let normalizedPlan = planName || '';
    normalizedPlan = normalizedPlan.replace(/PLAN /gi, '').replace(/Nivel /gi, '').trim();
    if (normalizedPlan === 'Basic') normalizedPlan = 'Presencia';
    if (normalizedPlan === 'Estrategia') normalizedPlan = 'Crecimiento';
    if (normalizedPlan === 'Premium') normalizedPlan = 'Autoridad';
    
    if (isMedical && !isHospital) {
        if (normalizedPlan === 'Presencia') return '250';
        if (normalizedPlan === 'Crecimiento') return '500';
        if (normalizedPlan === 'Autoridad') return '700';
        if (normalizedPlan === 'Control') return '999';
    } else if (isHospital) {
        if (normalizedPlan === 'Presencia') return '300';
        if (normalizedPlan === 'Crecimiento') return '500';
        if (normalizedPlan === 'Autoridad') return '700';
        if (normalizedPlan === 'Control') return '999';
    }
    return basePrice;
};

const normalizePlan = (planName) => {
    if (!planName) return '';
    const clean = planName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    if (clean.includes('presencia') || clean === 'basic') return 'presence';
    if (clean.includes('crecimiento') || clean === 'estrategia' || clean === 'medico') return 'growth';
    if (clean.includes('autoridad') || clean === 'premium' || clean.includes('especialista')) return 'authority';
    if (clean.includes('control') || clean.includes('elite') || clean.includes('monopolio')) return 'elite';
    return clean;
};

export default function GrowthPricing() {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [clientSub, setClientSub] = useState(null);

    useEffect(() => {
        const loadServices = async () => {
            setLoading(true);
            try {
                const { data } = await supabase
                    .from('services')
                    .select('*')
                    .eq('category', 'plan')
                    .order('price', { ascending: true });
                
                // --- CUSTOMIZE SERVICES BASED ON CLIENT NICHE ---
                const rawNiche = user?.industry || user?.marketing_type || 'General';
                const cleanNiche = (str) => (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                const nicheStr = cleanNiche(rawNiche);
                
                let resolvedNiche = 'general';
                if (nicheStr.includes('hospital') || nicheStr.includes('clinica')) {
                    resolvedNiche = 'hospital';
                } else if (nicheStr.includes('medico') || nicheStr.includes('health') || nicheStr.includes('doctor') || nicheStr.includes('salud') || nicheStr.includes('urologia')) {
                    resolvedNiche = 'medical';
                } else if (nicheStr.includes('horeca') || nicheStr.includes('restaurant') || nicheStr.includes('gastronom') || nicheStr.includes('comida') || nicheStr.includes('restaurante') || nicheStr.includes('hospitality')) {
                    resolvedNiche = 'hospitality';
                } else if (nicheStr.includes('realestate') || nicheStr.includes('inmobiliaria') || nicheStr.includes('bienes raices') || nicheStr.includes('realtor')) {
                    resolvedNiche = 'realestate';
                } else if (nicheStr.includes('agropecuario') || nicheStr.includes('agro') || nicheStr.includes('campo') || nicheStr.includes('actividad agropecuaria')) {
                    resolvedNiche = 'agropecuario';
                } else if (nicheStr.includes('juridico') || nicheStr.includes('abogado') || nicheStr.includes('derecho') || nicheStr.includes('legal')) {
                    resolvedNiche = 'juridico';
                } else if (nicheStr.includes('educacion') || nicheStr.includes('academia') || nicheStr.includes('cursos') || nicheStr.includes('educativo')) {
                    resolvedNiche = 'educativo';
                }

                const mappedServices = (data || []).map(service => {
                    const nichePlan = NICHE_DETAILS[resolvedNiche]?.plans[service.id];
                    if (nichePlan) {
                        return {
                            ...service,
                            name: nichePlan.name,
                            narrative: nichePlan.narrative,
                            price: nichePlan.price || service.price,
                            originalPrice: nichePlan.originalPrice || null,
                            features: nichePlan.features || service.features,
                            enfoque: nichePlan.enfoque || service.enfoque,
                            filmmaker: nichePlan.filmmaker || service.filmmaker
                        };
                    }
                    return service;
                });
                
                setServices(mappedServices);

                // --- QUERY CURRENT CLIENT PLAN STATUS ---
                let activePlan = user?.plan || null;
                let activePrice = user?.price || null;
                let activeStatus = null;

                if (user?.client_id) {
                    const { data: clientData } = await supabase
                        .from('clients')
                        .select('plan, price, status')
                        .eq('id', user.client_id)
                        .maybeSingle();
                    if (clientData) {
                        activePlan = clientData.plan;
                        activePrice = clientData.price;
                        activeStatus = clientData.status;
                    }
                }
                setClientSub({
                    plan: activePlan,
                    price: activePrice,
                    status: activeStatus
                });
            } catch (err) {
                console.error("Error loading services:", err);
            } finally {
                setLoading(false);
            }
        };
        loadServices();
    }, [user]);

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
                                onSelectService={setSelectedService}
                                userNiche={user?.industry || user?.marketing_type}
                                clientSub={clientSub}
                                user={user}
                            />
                        ))}
                    </div>

                    <ServiceDetails />
                    <PaidAdvertising />
                </>
            )}

            {/* Interactive Checkout Modal */}
            <AnimatePresence>
                {selectedService && (
                    <CheckoutModal 
                        service={selectedService} 
                        user={user} 
                        onClose={() => setSelectedService(null)} 
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

function PricingCard({ service, index, onSelectService, userNiche, clientSub, user }) {
    const isPopular = service.level === 'PLAN CLAVE';
    const finalPrice = getAdaptedPrice(service.price, service.name, userNiche || 'General');

    const normalizedServicePlan = normalizePlan(service.id);
    const normalizedUserPlan = clientSub ? normalizePlan(clientSub.plan) : '';
    const isActivePlan = normalizedUserPlan !== '' && normalizedServicePlan === normalizedUserPlan;
    const hasAnyActivePlan = normalizedUserPlan !== '';

    const handleAction = () => {
        if (onSelectService) {
            onSelectService(service);
        } else {
            const text = `Hola! Me interesa el ${service.name}. Quiero iniciar el despliegue estratégico.`;
            window.open(`https://wa.me/593900000000?text=${encodeURIComponent(text)}`, '_blank');
        }
    };

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

    const features = service.features || getFeatures(service.name);

    // Evaluate trial and subscription status
    const calculateTrialDaysLeft = () => {
        if (!user?.created_at) return 0;
        const creationDate = new Date(user.created_at);
        const currentDate = new Date();
        const differenceInTime = currentDate.getTime() - creationDate.getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
        const daysLeft = 15 - differenceInDays;
        return daysLeft > 0 ? daysLeft : 0;
    };

    const trialDaysLeft = calculateTrialDaysLeft();
    const isTrialing = trialDaysLeft > 0 && clientSub?.status !== 'active';
    const isActuallyPaid = clientSub?.status === 'active';
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={`flex flex-col p-8 rounded-[2.5rem] relative overflow-hidden transition-all duration-500 backdrop-blur-xl ${
                isPopular 
                ? 'bg-gradient-to-br from-[#0A0A1F]/90 via-[#0E0E2A]/90 to-[#0A0A1F]/90 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]' 
                : 'bg-black/40 border border-white/5 hover:bg-black/60'
            }`}
        >
            {/* Glows */}
            {isPopular && (
                <>
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50" />
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
                </>
            )}

            {/* Popular Badge */}
            <div className="h-8 mb-4">
                {isPopular && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                        <Crown className="w-3 h-3" />
                        Recomendado
                    </div>
                )}
            </div>

            {/* Header */}
            <div className="mb-6 space-y-2 relative z-10">
                <h3 className={`text-2xl font-black uppercase tracking-tight italic ${isPopular ? 'text-white' : 'text-gray-300'}`}>{service.name}</h3>
                <p className={`text-sm font-medium ${isPopular ? 'text-indigo-200/70' : 'text-gray-500'}`}>{service.enfoque}</p>
            </div>

            {/* Price Main */}
            <div className="mb-8 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 tracking-tighter">
                        ${finalPrice}
                    </span>
                    {finalPrice !== service.price && (
                        <span className="text-sm line-through text-gray-600 font-bold ml-2">${service.price}</span>
                    )}
                </div>
                <div className="flex flex-col gap-3 mt-2">
                    <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${isPopular ? 'text-indigo-200/80' : 'text-gray-500'}`}>/mes · sin IVA</p>
                    
                    {finalPrice !== service.price && (
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                            ✓ Descuento por nicho aplicado
                        </div>
                    )}
                    
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

            {/* Subscription and Payment Status Info */}
            {isActivePlan && (
                <div className={`mb-4 flex flex-col items-center justify-center p-3 rounded-2xl border text-center ${
                    isActuallyPaid 
                    ? 'bg-emerald-500/5 border-emerald-500/10' 
                    : isTrialing 
                    ? 'bg-amber-500/5 border-amber-500/10' 
                    : 'bg-red-500/5 border-red-500/10'
                }`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 justify-center ${
                        isActuallyPaid ? 'text-emerald-400' : isTrialing ? 'text-amber-400' : 'text-red-400'
                    }`}>
                        {isActuallyPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                        {isActuallyPaid ? 'Suscripción Activa' : isTrialing ? `Periodo de Prueba (${trialDaysLeft} días)` : 'Suscripción Vencida'}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                        Estado del Pago: {isActuallyPaid ? '✓ APROBADO & ACTIVO' : 'Pendiente / No Pagado'}
                    </span>
                </div>
            )}

            {/* Action CTA */}
            {isActivePlan && isActuallyPaid ? (
                <div className="w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2 cursor-default shadow-inner">
                    <Check className="w-4 h-4 text-emerald-400" strokeWidth={3} />
                    PLAN ACTUAL ACTIVO
                </div>
            ) : (
                <button
                    onClick={handleAction}
                    className={`w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${
                        hasAnyActivePlan 
                        ? 'bg-white/10 text-indigo-300 hover:bg-white/20 border border-indigo-500/30' 
                        : isPopular 
                        ? 'bg-white text-black hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 shadow-lg'
                    }`}
                >
                    {isActivePlan && !isActuallyPaid ? 'REALIZAR PAGO AHORA' : hasAnyActivePlan ? 'CAMBIAR PLAN' : 'INICIAR DESPLIEGUE'}
                </button>
            )}
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

// Checkout and Payment Verification Modal Component
function CheckoutModal({ service, user, onClose }) {
    const [tab, setTab] = useState('stripe'); // 'stripe', 'whatsapp'
    const [showInfo, setShowInfo] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    const formattedPlan = service.name.replace(/PLAN /gi, '').replace(/Nivel /gi, '').trim();
    const cleanPlan = formattedPlan === 'Basic' ? 'Presencia' : formattedPlan === 'Estrategia' ? 'Crecimiento' : formattedPlan === 'Premium' ? 'Autoridad' : formattedPlan;
    const finalPrice = getAdaptedPrice(service.price, service.name, user?.industry || user?.marketing_type || 'General');
    const licenseFee = 100; // standard app license fee
    const totalToday = Number(finalPrice) + licenseFee;

    const startStripeCheckout = async () => {
        if (!user) {
            toast.error("Debes iniciar sesión para realizar el pago en línea.");
            return;
        }

        setIsPaying(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientId: user.client_id,
                    userId: user.id,
                    planName: cleanPlan,
                    finalPrice: finalPrice,
                }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Error al crear la sesión de pago');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Error al iniciar la pasarela de Stripe. Intenta de nuevo.');
            setIsPaying(false);
        }
    };

    const handleWhatsAppConnect = () => {
        const text = `Hola! Soy ${user?.full_name || 'Cliente'}. Acabo de seleccionar el plan "${cleanPlan}" por $${finalPrice}/mes. Quiero coordinar el pago manual mediante transferencia.`;
        window.open(`https://wa.me/593900000000?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto text-left">
            <div className="relative w-full max-w-2xl bg-[#080812] border border-white/10 rounded-[32px] p-6 md:p-8 shadow-[0_0_80px_rgba(99,102,241,0.15)] my-auto transition-all">
                
                {/* Close Button */}
                {!isPaying && (
                    <button 
                        onClick={onClose} 
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors border border-white/5"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                <div className="space-y-6">
                    <div>
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] inline-block mb-3">
                            Pasarela de Activación DIIC
                        </span>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tight flex items-center gap-2">
                            <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
                            Activar Plan: {cleanPlan}
                        </h3>
                        <p className="text-xs text-gray-400">Elige tu método de pago para activar tu espacio de trabajo al instante.</p>
                    </div>

                    {/* Order Details Summary */}
                    <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl space-y-3">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block border-b border-white/5 pb-2">Resumen de la Suscripción</span>
                        <div className="flex justify-between text-xs font-bold text-gray-300">
                            <span>Plan de Expansión Mensual ({cleanPlan})</span>
                            <span>${finalPrice}.00 USD</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-gray-300">
                            <span>Licencia de la Plataforma (SaaS)</span>
                            <span>${licenseFee}.00 USD</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-gray-300">
                            <span>Cuota Setup de Inicio</span>
                            <span className="text-emerald-400">Gratis hoy</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Importe Total Mensual</span>
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">${totalToday}.00 USD</span>
                        </div>
                    </div>

                    {/* Tabs Selector */}
                    <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
                        <button 
                            disabled={isPaying}
                            onClick={() => setTab('stripe')}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${tab === 'stripe' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'} disabled:opacity-50`}
                        >
                            <CreditCard className="w-3.5 h-3.5" />
                            Pago en Línea (Stripe)
                        </button>
                        <button 
                            disabled={isPaying}
                            onClick={() => setTab('whatsapp')}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${tab === 'whatsapp' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'} disabled:opacity-50`}
                        >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Coordinar WhatsApp
                        </button>
                    </div>

                    {tab === 'stripe' ? (
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center space-y-3">
                                <ShieldCheck className="w-8 h-8 text-indigo-400 mx-auto" />
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Pasarela Segura de Stripe</h4>
                                    <p className="text-[10px] text-gray-400 leading-relaxed">
                                        Serás redirigido a la pasarela cifrada de Stripe para ingresar tus datos bancarios de manera 100% protegida (Cumple estándar PCI-DSS).
                                    </p>
                                </div>
                            </div>

                            {/* How Webhook Verification Works */}
                            <div className="border border-white/5 rounded-2xl bg-white/[0.01] overflow-hidden">
                                <button 
                                    onClick={() => setShowInfo(!showInfo)}
                                    className="w-full px-4 py-3 flex justify-between items-center text-xs font-bold text-gray-400 hover:text-white transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-indigo-400" />
                                        🛡️ ¿Cómo funciona la verificación de pago y activación?
                                    </span>
                                    {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                                
                                <AnimatePresence>
                                    {showInfo && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-4 pb-4 text-[10px] text-gray-500 space-y-2.5 border-t border-white/5 pt-3 leading-relaxed"
                                        >
                                            <p>
                                                1. **Redirección Cifrada**: Stripe recibe y encripta tus datos bancarios directamente en sus servidores (cumpliendo con PCI-DSS).
                                            </p>
                                            <p>
                                                2. **Notificación Inmediata (Webhooks)**: Al confirmarse el pago en Stripe, se envía un mensaje firmado digitalmente a nuestro backend.
                                            </p>
                                            <p>
                                                3. **Activación de Cuenta**: El servidor valida la firma, actualiza tu perfil en Supabase como **ACTIVO** y sincroniza tu área de trabajo al instante de forma automática.
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button 
                                onClick={startStripeCheckout}
                                disabled={isPaying}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                            >
                                {isPaying ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        Redirigiendo a Stripe...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-3.5 h-3.5 text-indigo-200" />
                                        Proceder al Pago Seguro en Línea
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 py-4 text-center">
                            <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
                                Si prefieres realizar el pago por medio de transferencia bancaria local o efectivo, puedes coordinar directamente con tu estratega asignada para activar tu cuenta de forma manual.
                            </p>
                            <button 
                                onClick={handleWhatsAppConnect}
                                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl inline-flex items-center gap-2 transition-all active:scale-98"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Coordinar Transferencia por WhatsApp
                            </button>
                        </div>
                    )}
                </div>

            </div>
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
                    <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex gap-6 items-start hover:bg-white/[0.04] transition-colors text-left">
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
        <div className="space-y-12 relative z-10 pt-10 text-left">
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

            <div className="pt-12 text-left">
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
