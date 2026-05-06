'use client';

import { 
    Zap, Rocket, Star, 
    Crown, Video, Camera, 
    Layout, CheckCircle2, 
    ArrowRight, DollarSign,
    Tag, Package, Percent,
    Plus, Sparkles, Filter,
    Shield, Bot, Users, Search, 
    Calendar, Clock, Briefcase, 
    LineChart, Monitor, Megaphone,
    Info, CreditCard, ArrowUpRight, Check,
    UserPlus, Target, MousePointer2, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function AdminMonetizationPage() {
    const [activeTab, setActiveTab] = useState('planes');
    const [planes, setPlanes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal & Assignment State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [targetClientID, setTargetClientID] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Strategic Terms State
    const [contractType, setContractType] = useState('monthly'); // 'monthly' | '6month'
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [showSetupInfo, setShowSetupInfo] = useState(false);

    const PLANES_INICIALES = [
        {
            id: 'nivel_1_presencia',
            name: 'Nivel 1: Presencia Digital',
            price: 300,
            setup_fee: 120,
            color: 'emerald',
            icon_name: 'Shield',
            focus: 'Confianza Visual',
            promise: '"Deja de ser invisible. Construimos tu autoridad digital con contenido profesional desde el primer día."',
            description: 'Ideal para negocios que inician y buscan validación.',
            pauta_sugerida: 50,
            reels: 2, posts: 4, stories: '6-8', videos: 0, sessions: 0,
            features: [
                'Optimización de Redes (Bio & Estructura)',
                '2 Reels de alto impacto',
                '4 Carruseles/Posts',
                '6–8 Historias mensuales',
                'Community Manager Base'
            ],
            team: ['C. Manager', 'Diseño']
        },
        {
            id: 'nivel_2_estrategia',
            name: 'Nivel 2: Crecimiento Estratégico',
            price: 450,
            setup_fee: 150,
            color: 'blue',
            icon_name: 'Zap',
            focus: 'Captar Clientes',
            promise: '"No solo publiques, vende. Creamos el sistema que atrae clientes calificados a tu WhatsApp 24/7."',
            description: 'El motor de ventas para empresas en crecimiento.',
            pauta_sugerida: 100,
            reels: '6-8', posts: '6-8', stories: '10-15', videos: 0, sessions: 1,
            features: [
                'Auditoría Completa de Marca',
                '6–8 Reels Estratégicos',
                '6–8 Posts / Carruseles',
                '10–15 Historias mensuales',
                '1 Grabación Mensual (Filmmaker)'
            ],
            team: ['Estrategia Sr', 'Filmmaker', 'Editor Pro', 'C. Manager'],
            is_key: true
        },
        {
            id: 'nivel_3_marca',
            name: 'Nivel 3: Marca y Autoridad',
            price: 850,
            setup_fee: 250,
            color: 'orange',
            icon_name: 'Crown',
            focus: 'Autoridad Elite',
            promise: '"Conviértete en el referente #1. Producción cinematográfica y narrativa de marca para cobrar lo que realmente vales."',
            description: 'Para líderes que quieren dominar su nicho por completo.',
            pauta_sugerida: 200,
            reels: '10-12', posts: '10-12', stories: '15-25', videos: '1-2', sessions: 2,
            features: [
                'Rebranding o Ajuste Visual Avanzado',
                '10–12 Reels de Alta Calidad',
                '10–12 Piezas Gráficas Premium',
                '15–25 Historias Pro',
                '2 Grabaciones + 1-2 Videos Promos'
            ],
            team: ['Director Creativo', 'Filmmaker Sr', 'Editor Pro', 'Copywriter']
        },
        {
            id: 'nivel_4_automatizacion',
            name: 'Nivel 4: Automatización y Escala',
            price: 1200,
            setup_fee: 300,
            color: 'purple',
            icon_name: 'Bot',
            focus: 'Ventas con IA',
            promise: '"Pon tu negocio en piloto automático. Implementamos IA y bots que venden mientras tú te enfocas en lo importante."',
            description: 'Tecnología de punta para escalar sin límites.',
            pauta_sugerida: 500,
            reels: 'Full', posts: 'Full', stories: 'Full', videos: 'Full', sessions: 'Full Team',
            features: [
                'Implementación CRM e Integración Completa',
                'Configuración de Chatbots (WhatsApp/Web)',
                'Flujos de Venta Automatizados',
                'Estructura de Embudo de Conversión',
                'Optimización Continua del Embudo'
            ],
            team: ['Especialista IA', 'Media Buyer', 'Director Creativo', 'Filmmaker', 'Editor Pro']
        }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Plans
            let { data: planesData, error: planesError } = await supabase.from('plans').select('*');
            
            if (planesError) throw planesError;

            // Robust Filtering: Only show the 4 Strategic Levels (Ecuador 2026)
            // Robust Filtering: Only show the 4 Strategic Levels (Ecuador 2026)
            const strategicIds = PLANES_INICIALES.map(p => p.id);
            const filteredPlanes = planesData?.filter(p => strategicIds.includes(p.id)) || [];

            // Detect and Sync Strategic Tiers 2026
            const needsSync = filteredPlanes.length < 4 || 
                             filteredPlanes.some(p => p.id === 'nivel_1_presencia' && p.setup_fee !== 120) ||
                             filteredPlanes.some(p => p.id === 'nivel_1_presencia' && p.reels !== 2);

            if (needsSync) {
                console.log('Force Synchronizing Strategic Portfolio 2026 (Legacy data detected)...');
                await supabase.from('plans').upsert(PLANES_INICIALES);
                
                const { data: refreshedData } = await supabase.from('plans').select('*');
                const uniquePlanes = refreshedData
                    .filter(p => strategicIds.includes(p.id))
                    .reduce((acc, current) => {
                        if (!acc.find(item => item.id === current.id)) {
                            return acc.concat([current]);
                        }
                        return acc;
                    }, []);
                
                setPlanes(uniquePlanes);
            } else {
                setPlanes(filteredPlanes);
            }

            // Fetch Clients for selector
            const { data: clientsData } = await supabase.from('clients').select('id, name, type, city');
            setClients(clientsData || []);

            // Fetch Services
            setServicios([
                { name: 'Reel Básico', category: 'Video', price: 30, unit: 'Unidad' },
                { name: 'Reel Pro', category: 'Video', price: 50, unit: 'Unidad' },
                { name: 'Video Institucional', category: 'Video', price: 80, unit: 'Unidad' },
                { name: 'Post', category: 'Diseño', price: 15, unit: 'Unidad' },
                { name: 'Carrusel', category: 'Diseño', price: 25, unit: 'Unidad' },
            ]);
        } catch (error) {
            console.error('Error fetching monetization data:', error);
            toast.error('Error al cargar datos de monetización');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (plan) => {
        setSelectedPlan(plan);
        setContractType('6month'); // Default to 6-month (Balanced)
        setSelectedTeam(plan.team || []); // Pre-select default plan team
        setIsModalOpen(true);
    };

    const calculateCurrentPrices = (plan, type) => {
        if (!plan) return { monthly: 0, setup: 0, benefit: '' };
        
        // Logical Price Tiers (Ecuador 2026 Proposal)
        const priceMatrix = {
            nivel_1_presencia: { m3: 300, m6: 275, m12: 250 },
            nivel_2_estrategia: { m3: 450, m6: 400, m12: 350 },
            nivel_3_marca: { m3: 850, m6: 750, m12: 650 },
            nivel_4_automatizacion: { m3: 1200, m6: 1000, m12: 900 }
        };

        const setupMatrix = {
            nivel_1_presencia: 120,
            nivel_2_estrategia: 150,
            nivel_3_marca: 250,
            nivel_4_automatizacion: 300
        };

        const prices = priceMatrix[plan.id] || { m3: plan.price, m6: plan.price * 0.9, m12: plan.price * 0.8 };
        const baseSetup = setupMatrix[plan.id] || plan.setup_fee;

        if (type === '6month') {
            return {
                monthly: prices.m6,
                setup: baseSetup, // Full setup required as per proposal? Or discount? 
                // Proposal says Setup Initial (Pago Único), doesn't specify discount for 6m. 
                // But usually we discount setup for longer contracts. Let's keep it same for now.
                isDiscounted: true,
                termLabel: '6 Meses',
                benefit: 'Equilibrio costo-beneficio'
            };
        }

        if (type === '1year') {
            return {
                monthly: prices.m12,
                setup: baseSetup, 
                isDiscounted: true,
                termLabel: '12 Meses',
                benefit: 'Máximo Ahorro Mensual'
            };
        }
        
        return {
            monthly: prices.m3,
            setup: baseSetup,
            isDiscounted: false,
            termLabel: '3 Meses',
            benefit: 'Flexibilidad inicial'
        };
    };

    const getClientAccent = (client) => {
        if (!client) return { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' };
        const name = client.name.toUpperCase();
        
        if (name.includes('G.S.T')) return { 
            text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', glow: 'shadow-red-500/20' 
        };
        if (name.includes('CLÍNICA') || name.includes('SANTA ANITA')) return { 
            text: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30', glow: 'shadow-cyan-400/20' 
        };
        if (name.includes('DR.') || name.includes('DRA.') || name.includes('PATIÑO') || name.includes('REYES')) return { 
            text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' 
        };
        if (name.includes('AGROPECUARIOS') || name.includes('INNOVA')) return { 
            text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' 
        };
        if (name.includes('ENTRE PANAS') || name.includes('PARCELAS')) return { 
            text: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' 
        };

        return { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', glow: 'shadow-indigo-500/20' };
    };

    const handleAssignPlan = (clientId, plan) => {
        if (!clientId) {
            toast.error('Por favor selecciona un cliente');
            return;
        }

        const prices = calculateCurrentPrices(plan, contractType);

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    // 1. Create the subscription with contract terms
                    const { error: subError } = await supabase.from('subscriptions').insert({
                        client_id: clientId,
                        plan_id: plan.id,
                        total_price: prices.monthly,
                        setup_fee: prices.setup,
                        contract_type: contractType,
                        assigned_team: selectedTeam,
                        status: 'active'
                    });

                    if (subError) throw subError;

                    // 2. Trigger Automation Engine to inject nodes
                    // await assignPlanToClient(clientId, plan.id); // Removing legacy import

                    setTimeout(() => {
                        setIsModalOpen(false);
                        resolve();
                    }, 1000);
                } catch (e) {
                    console.error('Plan assignment error:', e);
                    reject(e);
                }
            }),
            {
                loading: `Generando Estrategia & ${plan.name}...`,
                success: () => `¡Éxito! Plan ${plan.name} activado para el cliente.`,
                error: (e) => `Error: ${e.message || 'No se pudo sincronizar'}`,
            }
        );
    };

    const getIcon = (name) => {
        const icons = { Zap, Rocket, Crown, Star, Shield, Bot };
        return icons[name] || Zap;
    };

    const filteredClients = useMemo(() => {
        return clients.filter(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [clients, searchQuery]);

    return (
        <div className="flex-1 overflow-y-auto p-10 bg-[#050511]">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Motor de Monetización</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs tracking-[0.2em]">Cubo de Planes & Venta Estratégica</p>
                </div>
                
                <div className="flex bg-[#0A0A12] p-1.5 rounded-2xl border border-white/5 shadow-2xl">
                    {['planes', 'servicios', 'promos'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === tab 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                                : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Sincronizando con Base de Datos...</p>
                </div>
            ) : activeTab === 'planes' && (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {planes.map((plan, index) => {
                        const Icon = getIcon(plan.icon_name);
                        const prices1y = calculateCurrentPrices(plan, '1year');
                        const prices3m = calculateCurrentPrices(plan, 'monthly');
                        
                        return (
                            <motion.div 
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#0A0A12]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-all shadow-2xl flex flex-col h-full"
                            >
                                {/* Level Icon & Badge */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center relative shadow-2xl ${
                                        plan.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                                        plan.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                                        plan.color === 'orange' ? 'bg-orange-500/10 text-orange-400' :
                                        'bg-purple-500/10 text-purple-400'
                                    }`}>
                                        <Icon className="w-8 h-8" />
                                        <div className="absolute inset-0 bg-inherit opacity-20 blur-xl rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="text-[20px] font-black text-white uppercase tracking-tighter leading-tight">
                                            {plan.name.split(':')[0]} <br/>
                                            <span className="text-white/90">{plan.name.split(':')[1]}</span>
                                        </h3>
                                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1 block">Pricing Individual</span>
                                    </div>
                                </div>

                                 {/* Price Range & Setup (2026 Tiers) */}
                                <div className="mb-8">
                                    <div className="flex flex-col mb-4">
                                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-2">Desde</span>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-4xl font-black text-white tracking-tighter">
                                                ${prices1y.monthly}
                                            </span>
                                            <span className="text-gray-500 font-bold text-xs uppercase">/mes</span>
                                            <span className="text-[9px] text-gray-600 font-black uppercase ml-1 italic opacity-60">(Plan Anual)</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col justify-center items-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-colors">
                                            <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1 leading-none">3 Meses:</span>
                                            <span className="text-sm font-black text-white">${prices3m.monthly}</span>
                                        </div>
                                        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-3 flex flex-col justify-center items-center group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-colors">
                                            <span className="text-[8px] text-indigo-400 font-black uppercase tracking-widest mb-1 leading-none text-center">Setup Mes 1:</span>
                                            <span className="text-sm font-black text-white">${plan.setup_fee}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 p-5 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                                        <p className="text-white text-[12px] leading-relaxed font-black italic mb-3">
                                            {plan.promise}
                                        </p>
                                        <p className="text-gray-500 text-[10px] leading-snug font-bold uppercase tracking-tight opacity-80">
                                            {plan.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Focus & Sessions */}
                                <div className="flex items-center justify-between mb-8 px-2">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest leading-none mb-2">Enfoque</span>
                                        <span className={`text-[11px] font-black uppercase tracking-widest ${
                                            plan.color === 'emerald' ? 'text-emerald-400' :
                                            plan.color === 'blue' ? 'text-blue-400' :
                                            plan.color === 'orange' ? 'text-orange-400' :
                                            'text-purple-400'
                                        }`}>{plan.focus}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest leading-none mb-2">Filmmaker</span>
                                        <span className="block text-[11px] text-white font-black uppercase tracking-widest">{plan.sessions === 0 ? 'Sin Grabación' : plan.sessions === 'Full Team' ? 'Full Team' : `${plan.sessions} Sesión${plan.sessions > 1 ? 'es' : ''}`}</span>
                                    </div>
                                </div>

                                {/* Content Breakdown (Grid 3x1) */}
                                <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 mb-8 grid grid-cols-3 gap-2 relative overflow-hidden">
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                                    <div className="text-center">
                                        <span className="block text-2xl font-black text-white leading-none mb-1">{plan.reels}</span>
                                        <span className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] block">Reels</span>
                                    </div>
                                    <div className="text-center border-x border-white/10 px-2">
                                        <span className="block text-2xl font-black text-white leading-none mb-1">{plan.posts}</span>
                                        <span className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] block">Posts</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-2xl font-black text-white leading-none mb-1">{plan.stories}</span>
                                        <span className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] block">Stories</span>
                                    </div>
                                </div>

                                {/* Final CTAs & Badges */}
                                <div className="mt-auto space-y-4">
                                    <button 
                                        onClick={() => handleOpenModal(plan)}
                                        className={`w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 ${
                                            plan.color === 'emerald' ? 'bg-emerald-500 text-black' :
                                            plan.color === 'blue' ? 'bg-blue-600 text-white shadow-blue-500/20' :
                                            plan.color === 'orange' ? 'bg-orange-500 text-black' :
                                            'bg-purple-600 text-white shadow-purple-500/20'
                                        }`}
                                    >
                                        Asignar Plan <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>

                                {plan.is_key && (
                                    <div className="absolute top-8 right-8 px-4 py-1.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest shadow-2xl shadow-amber-500/40 animate-pulse transition-transform group-hover:scale-110">
                                        Plan Clave
                                    </div>
                                )}

                                {/* Card Background Glow */}
                                <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-10 transition-opacity group-hover:opacity-30 ${
                                    plan.color === 'emerald' ? 'bg-emerald-500' :
                                    plan.color === 'blue' ? 'bg-blue-600' :
                                    plan.color === 'orange' ? 'bg-orange-500' :
                                    'bg-purple-600'
                                }`} />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Comparison Table Integrated */}
                <div className="mt-20">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-8 text-center opacity-50">Comparativa de Soluciones 2026</h3>
                    <div className="bg-[#0A0A12] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl max-w-6xl mx-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5">
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Nivel de Crecimiento</th>
                                    <th className="px-5 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center border-x border-white/5 bg-indigo-500/5">Pago Mes (3m | 6m | 12m)</th>
                                    <th className="px-5 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center border-r border-white/5">Setup Inicial (3m | 6m | 12m)</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Producción</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Enfoque Primario</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {planes.map(p => {
                                    const p6m = calculateCurrentPrices(p, '6month');
                                    const p12m = calculateCurrentPrices(p, '1year');
                                    return (
                                        <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                        p.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        p.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                                                        p.color === 'orange' ? 'bg-orange-500/10 text-orange-400' :
                                                        'bg-purple-500/10 text-purple-400'
                                                    }`}>
                                                        {(() => {
                                                            const IconComp = getIcon(p.icon_name);
                                                            return <IconComp className="w-4 h-4" />;
                                                        })()}
                                                    </div>
                                                    <span className="text-sm font-black text-white uppercase">{p.name.split(':')[1] || p.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-6 text-sm font-bold text-center border-x border-white/5 bg-indigo-500/[0.02]">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="text-gray-500 opacity-50">${p.price}</span>
                                                    <span className="text-white">|</span>
                                                    <span className="text-indigo-300 font-black">${p6m.monthly}</span>
                                                    <span className="text-white">|</span>
                                                    <span className="text-emerald-400 font-black text-lg scale-110 tracking-tighter">${p12m.monthly}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-6 text-sm font-bold text-center border-r border-white/5">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="text-gray-500 opacity-50">${p.setup_fee}</span>
                                                    <span className="text-white">|</span>
                                                    <span className="text-indigo-400">${p6m.setup}</span>
                                                    <span className="text-white">|</span>
                                                    <span className="text-emerald-500 font-black uppercase text-[10px]">$0</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-[11px] font-medium text-gray-400">{p.sessions} ses. / mes</td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                    p.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    p.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                                                    p.color === 'orange' ? 'bg-orange-500/10 text-orange-400' :
                                                    'bg-purple-500/10 text-purple-400'
                                                }`}>
                                                    {p.focus}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Strategic Phrase Footer */}
                <div className="mt-20 py-12 border-t border-white/5 flex flex-col items-center justify-center text-center">
                    <p className="text-2xl font-black text-white italic mb-4 tracking-tighter">
                        “Trabajamos por niveles de crecimiento, no por publicaciones sueltas.”
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-12 bg-indigo-500 rounded-full" />
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">DIIC ZONE STRATEGY 2026</span>
                        <div className="h-1 w-12 bg-indigo-500 rounded-full" />
                    </div>
                </div>
                </>
            )}

            {activeTab === 'servicios' && (
                <div className="bg-[#0A0A12] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl max-w-5xl mx-auto">
                    <div className="px-10 py-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                            <Package className="w-4 h-4 text-indigo-500" />
                            Lista de Servicios Individuales
                        </h3>
                    </div>
                    <div className="p-4">
                        {servicios.map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-6 rounded-2xl hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0">
                                <div className="flex items-center gap-6">
                                    <div className="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center text-[10px] font-black text-gray-500 uppercase">
                                        {s.category[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black uppercase tracking-tight text-sm">{s.name}</h4>
                                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{s.category}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xl font-black text-white tracking-tighter">${s.price}</span>
                                    <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">por {s.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'promos' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {promos.map((promo, i) => (
                        <div key={i} className="bg-[#0A0A12] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-amber-500/30 transition-all shadow-2xl">
                             <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                                    <Tag className="w-6 h-6" />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-500 uppercase tracking-widest">
                                    {promo.tag}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{promo.name}</h3>
                            <p className="text-gray-500 text-xs font-medium mb-6 uppercase tracking-wider">{promo.desc}</p>
                            
                            <div className="flex items-baseline gap-3 mb-8">
                                <span className="text-3xl font-black text-white tracking-tighter">${promo.price}</span>
                                <span className="text-gray-600 font-bold text-sm line-through decoration-amber-500/50">${promo.original}</span>
                            </div>

                            <button 
                                onClick={() => toast.success(`Promo ${promo.name} activada`)}
                                className="w-full h-12 bg-amber-500 text-black font-black rounded-xl hover:bg-amber-400 transition-all uppercase text-[9px] tracking-[0.2em] shadow-lg shadow-amber-500/10"
                            >
                                Aplicar Oferta
                            </button>
                            
                            {/* Glow */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
            )}


            {/* Global Assignment Modal */}
            <AnimatePresence>
                {isModalOpen && selectedPlan && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-5xl bg-[#0A0A12] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-auto max-h-[90vh]"
                        >
                            {/* Left: Client Selection */}
                            <div className="w-full md:w-[400px] border-r border-white/5 flex flex-col bg-black/20">
                                <div className="p-8 border-b border-white/5">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-3">
                                        <Users className="w-6 h-6 text-indigo-500" />
                                        Asignar Cliente
                                    </h3>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input 
                                            type="text" 
                                            placeholder="Buscar cliente por nombre..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-bold text-white focus:border-indigo-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                 <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar bg-black/10">
                                    {(clients || [])
                                        .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .map(client => {
                                            const accent = getClientAccent(client);
                                            const isSelected = targetClientID === client.id;
                                            return (
                                                <button 
                                                    key={client.id}
                                                    onClick={() => setTargetClientID(client.id)}
                                                    className={`w-full p-5 rounded-[2rem] border transition-all text-left flex flex-col group relative overflow-hidden ${
                                                        isSelected 
                                                            ? `${accent.bg} ${accent.border} ${accent.glow} shadow-xl scale-[1.02]` 
                                                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                                                    }`}
                                                >
                                                    {isSelected && (
                                                        <div className={`absolute left-0 top-0 w-1.5 h-full ${accent.text.replace('text-', 'bg-')}`} />
                                                    )}
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div className={`text-[11px] font-black uppercase tracking-tighter transition-colors ${
                                                            isSelected ? accent.text : 'text-white'
                                                        }`}>{client.name}</div>
                                                        <div className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{client.type}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3 h-3 text-gray-600" />
                                                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">{client.city}</div>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    }
                                </div>
                            </div>

                            {/* Right Panel: Sticky Structure */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Sticky Header */}
                                <div className="p-10 pb-6 border-b border-white/5">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center relative shadow-2xl ${
                                                selectedPlan.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                                                selectedPlan.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                                                selectedPlan.color === 'orange' ? 'bg-orange-500/10 text-orange-400' :
                                                'bg-purple-500/10 text-purple-400'
                                            }`}>
                                                {(() => {
                                                    const IconComp = getIcon(selectedPlan.icon_name);
                                                    return <IconComp className="w-8 h-8" />;
                                                })()}
                                                <div className="absolute -inset-1 bg-inherit opacity-20 blur-lg rounded-full" />
                                            </div>
                                            <div className="max-w-md">
                                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">{selectedPlan.name}</h2>
                                                <div className="flex items-center gap-3">
                                                    <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] text-gray-500 font-black uppercase tracking-widest">{selectedPlan.focus}</span>
                                                    <span className="text-[10px] text-indigo-400 font-black italic tracking-tight opacity-70">Strategic Proposal 2026</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 justify-end mb-1">
                                                {contractType === '6month' && (
                                                    <span className="px-2 py-1 rounded bg-emerald-500 text-[8px] font-black text-black uppercase tracking-widest animate-pulse">Oferta</span>
                                                )}
                                                {contractType === '1year' && (
                                                    <span className="px-2 py-1 rounded bg-amber-500 text-[8px] font-black text-black uppercase tracking-widest">Max Ahorro</span>
                                                )}
                                                <div className="text-3xl font-black text-white tracking-tighter leading-none">
                                                    ${calculateCurrentPrices(selectedPlan, contractType).monthly}
                                                </div>
                                            </div>
                                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Pago Mensual</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Scrollable Section */}
                                <div className="flex-1 overflow-y-auto p-10 py-6 custom-scrollbar">
                                    <div className="mb-4">
                                        <p className="text-[12px] text-indigo-300 font-black italic tracking-tight leading-snug p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-8">
                                            "{selectedPlan.promise}"
                                        </p>
                                    </div>

                                {/* Contract Type Selector - 3 Tiers (Ecuador 2026 Structure) */}
                                <div className="mb-8 p-1.5 bg-black/40 rounded-2xl border border-white/5 flex gap-2">
                                    <button 
                                        onClick={() => setContractType('monthly')}
                                        className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${
                                            contractType === 'monthly' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 hover:text-white'
                                        }`}
                                    >
                                        <Calendar className="w-3 h-3" /> 
                                        <span>3 Meses (Base)</span>
                                    </button>
                                    <button 
                                        onClick={() => setContractType('6month')}
                                        className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${
                                            contractType === '6month' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-500 hover:text-white group'
                                        }`}
                                    >
                                        <Clock className="w-3 h-3 group-hover:rotate-12 transition-transform" /> 
                                        <span>6 Meses (Ahorro)</span>
                                    </button>
                                    <button 
                                        onClick={() => setContractType('1year')}
                                        className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${
                                            contractType === '1year' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-500 hover:text-white group'
                                        }`}
                                    >
                                        <Star className="w-3 h-3 group-hover:scale-125 transition-transform" /> 
                                        <span>Anual (Elite)</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    {/* Setup & Pauta */}
                                    <div className="space-y-4">
                                        <div 
                                            onMouseEnter={() => setShowSetupInfo(true)}
                                            onMouseLeave={() => setShowSetupInfo(false)}
                                            className="relative p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4 group transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                                <DollarSign className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div className="text-xs font-black text-white uppercase tracking-tight">
                                                        ${calculateCurrentPrices(selectedPlan, contractType).setup} Setup Inicial
                                                    </div>
                                                    <Info className="w-3 h-3 text-indigo-500/50" />
                                                </div>
                                                <div className="text-[9px] text-gray-500 uppercase tracking-widest">
                                                    {calculateCurrentPrices(selectedPlan, contractType).benefit}
                                                </div>
                                            </div>

                                            {/* Tooltip / Info box */}
                                            <AnimatePresence>
                                                {showSetupInfo && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute bottom-full left-0 right-0 mb-4 p-5 bg-[#0F0F1A] border border-indigo-500/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                                    >
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                                                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                            <Sparkles className="w-3 h-3" /> ¿Por qué el Setup Inicial?
                                                        </h4>
                                                        <p className="text-[9px] text-gray-400 leading-normal font-medium">
                                                            Configurar automatizaciones, flujos de IA, CRM y manuales de marca toma semanas de programación y pruebas. Es la base que garantiza que el sistema funcione solo.
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div className="p-5 rounded-3xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                                <Megaphone className="w-5 h-5 text-rose-400" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-white uppercase tracking-tight">${selectedPlan.pauta_sugerida}+ Ads</div>
                                                <div className="text-[9px] text-gray-500 uppercase tracking-widest">Presupuesto Sugerido</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Team Details / Selection */}
                                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col">
                                        <div className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <UserPlus className="w-3 h-3 text-indigo-500" />
                                            Asignar Equipo Operativo
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Director Creativo', 'Estrategia Sr', 'Media Buyer', 'Filmmaker', 'Editor Pro', 'Copywriter', 'C. Manager'].map((role) => (
                                                <button 
                                                    key={role}
                                                    onClick={() => {
                                                        setSelectedTeam(prev => 
                                                            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
                                                        );
                                                    }}
                                                    className={`px-3 py-2.5 rounded-xl border transition-all text-left relative overflow-hidden group ${
                                                        selectedTeam.includes(role) 
                                                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md' 
                                                        : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
                                                    }`}
                                                >
                                                    <div className="text-[9px] font-black uppercase tracking-tight relative z-10">{role}</div>
                                                    {selectedTeam.includes(role) && (
                                                        <Check className="absolute top-2 right-2 w-2.5 h-2.5 text-white/50" />
                                                    )}
                                                    {/* Selection Glow */}
                                                    {selectedTeam.includes(role) && (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Operational breakdown */}
                                <div className="mb-10">
                                    <div className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Zap className="w-3 h-3 text-yellow-400" />
                                        Operación Zona Creativa
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-8">
                                        {selectedPlan.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-2 text-[11px] font-bold text-gray-400">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                </div>

                                {/* Sticky Footer */}
                                <div className="p-8 border-t border-white/5 bg-black/40 flex items-center gap-4">
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="h-14 px-8 rounded-2xl border border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-white/5 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={() => handleAssignPlan(targetClientID, selectedPlan)}
                                        className="h-14 flex-1 bg-white text-black rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[11px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl shadow-indigo-600/20"
                                    >
                                        Activar Plan Estratégico
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Automation Logic Info */}
            <div className="mt-20 max-w-4xl mx-auto">
                <div className="bg-indigo-600/5 border border-indigo-500/20 p-8 rounded-[2rem] flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Lógica de Auto-Conexión Operativa</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            Cada vez que vinculas un plan a un cliente, el sistema inyecta automáticamente los nodos de producción en la <span className="text-indigo-400">Estrategia Board</span> y genera las tareas correspondientes para los miembros del equipo asignados. Esto elimina la carga administrativa de creación manual de tareas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
