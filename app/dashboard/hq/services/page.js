'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag, Plus, Edit2, Trash2,
    Check, Zap, Globe, Video,
    Palette, Layers, X, User,
    Building2, MapPin, Briefcase, FileText,
    Shield, Crown, Star,
    ClipboardList, Scissors, MessageCircle, BarChart2,
    Film, ImageIcon, Megaphone, Target, DollarSign, Settings, PieChart,
    Stethoscope, Utensils, Home, GraduationCap, HeartPulse,
    HardHat, Coins, Landmark, UtensilsCrossed, Cpu, Gavel, Factory, 
    HeartHandshake, Store, Truck, Plane, MoreHorizontal, Mic, Sprout, ShoppingBag, Croissant,
    TrendingUp, Calculator, Clock, CheckCircle2, Eye, Compass, Sparkles, Award, ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import useRealtimeSync from '@/hooks/useRealtimeSync';
import { NICHE_DETAILS } from '@/lib/nicheDetails';

export default function HQServicesPage() {
    const [services, setServices] = useState([]);
    const [automations, setAutomations] = useState([]);
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [wizardStep, setWizardStep] = useState(1); // 1: Cards, 2: Profile, 3: Agreement, 4: Payment, 5: Success
    const [clientProfile, setClientProfile] = useState({
        name: '',
        company: '',
        location: '',
        businessType: ''
    });
    const [activeCategory, setActiveCategory] = useState('plan'); // 'plan' or 'pack'
    const [selectedNiche, setSelectedNiche] = useState('general');

    // --- ESTADOS Y REFS PARA FIRMA DIGITAL & PAGO ---
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [signatureImage, setSignatureImage] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState({ cardNumber: '', expiry: '', cvv: '', cardholderName: '' });
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
        const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
        if (clientX === undefined || clientY === undefined) return;
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
        const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
        if (clientX === undefined || clientY === undefined) return;
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        ctx.lineTo(x, y);
        ctx.stroke();
        setHasSignature(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        if (canvasRef.current) {
            setSignatureImage(canvasRef.current.toDataURL());
        }
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
        setSignatureImage(null);
    };

    const handleDownloadContract = () => {
        const docContent = `
            <html>
            <head>
                <title>Contrato de Producción - DIIC ZONE</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; padding: 40px; max-width: 800px; margin: auto; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 40px; }
                    .header h1 { margin: 0; font-size: 28px; color: #111; text-transform: uppercase; letter-spacing: 2px; }
                    .header p { margin: 5px 0 0 0; color: #666; font-size: 12px; font-weight: bold; }
                    .section { margin-bottom: 30px; }
                    .section-title { font-size: 14px; font-weight: bold; text-transform: uppercase; color: #6366f1; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; }
                    .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                    .grid-item { background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eee; }
                    .grid-item label { font-size: 10px; font-weight: bold; color: #999; text-transform: uppercase; display: block; margin-bottom: 5px; }
                    .grid-item p { margin: 0; font-size: 14px; font-weight: bold; }
                    .clauses { font-size: 12px; color: #444; text-align: justify; }
                    .signatures { display: flex; justify-content: space-between; margin-top: 60px; }
                    .signature-box { text-align: center; width: 40%; }
                    .signature-line { border-top: 1px solid #333; margin-top: 50px; padding-top: 10px; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #555; }
                    .signature-img { max-height: 60px; max-width: 100%; object-fit: contain; }
                    .badge { display: inline-block; background: #10b981; color: white; font-size: 10px; font-weight: bold; padding: 5px 10px; border-radius: 20px; text-transform: uppercase; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>DIIC ZONE</h1>
                    <p>ACUERDO ESTRATÉGICO DE PRODUCCIÓN & MARKETING DIGITAL</p>
                    <div style="margin-top: 15px;"><span class="badge">Pago Verificado Online</span></div>
                </div>
                
                <div class="section">
                    <div class="section-title">Detalles de la Suscripción</div>
                    <div class="grid">
                        <div class="grid-item">
                            <label>Plan Adquirido</label>
                            <p>${selectedPlan?.name}</p>
                        </div>
                        <div class="grid-item">
                            <label>Inversión Mensual</label>
                            <p>$${selectedPlan?.price} USD / mes</p>
                        </div>
                        <div class="grid-item">
                            <label>Cliente Titular</label>
                            <p>${clientProfile.name}</p>
                        </div>
                        <div class="grid-item">
                            <label>Compañía / Marca</label>
                            <p>${clientProfile.company}</p>
                        </div>
                        <div class="grid-item">
                            <label>Ubicación</label>
                            <p>${clientProfile.location}</p>
                        </div>
                        <div class="grid-item">
                            <label>Nicho de Mercado</label>
                            <p>${clientProfile.businessType}</p>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">Cláusulas del Acuerdo</div>
                    <div class="clauses">
                        <p><strong>Primera: Objeto del Servicio.</strong> DIIC ZONE se compromete a prestar servicios de marketing estratégico y creación de contenido en base al nicho <strong>${clientProfile.businessType}</strong>, optimizando la parrilla de contenidos en los canales correspondientes según el nivel adquirido.</p>
                        <p><strong>Segunda: Compromiso del Cliente.</strong> El cliente garantiza facilitar el acceso a locaciones comerciales y personal clave para las sesiones de rodaje programadas, así como el material necesario para la correcta ejecución de las campañas de pauta.</p>
                        <p><strong>Tercera: Facturación y Pagos.</strong> La facturación se realizará de forma mensual recurrente por el monto de $${selectedPlan?.price} USD. Los cargos se debitarán automáticamente de la tarjeta autorizada por el titular.</p>
                        <p><strong>Cuarta: Propiedad Intelectual.</strong> Todo el contenido final aprobado y entregado es propiedad del cliente para su uso comercial. Los brutos y archivos de edición del Studio pertenecen a DIIC ZONE hasta la finalización del contrato.</p>
                    </div>
                </div>
                
                <div class="signatures">
                    <div class="signature-box">
                        <div style="height: 60px; display: flex; align-items: center; justify-content: center; font-style: italic; font-weight: bold; color: #6366f1;">DIIC ZONE OS</div>
                        <div class="signature-line">DIIC ZONE STRATEGIST</div>
                    </div>
                    <div class="signature-box">
                        <div style="height: 60px; display: flex; align-items: center; justify-content: center;">
                            ${signatureImage ? `<img src="${signatureImage}" class="signature-img" />` : '<span style="color: #ccc;">FIRMADO ELECTRÓNICAMENTE</span>'}
                        </div>
                        <div class="signature-line">EL CLIENTE (${clientProfile.name})</div>
                    </div>
                </div>
                
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;
        const blob = new Blob([docContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contrato_diic_${clientProfile.company.toLowerCase().replace(/\s+/g, '_')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Contrato descargado exitosamente');
    };

    const loadData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [servRes, autoRes, ratesRes] = await Promise.all([
                supabase.from('services').select('*').order('price', { ascending: true }),
                supabase.from('automations').select('*'),
                supabase.from('production_rates').select('*').order('name', { ascending: true })
            ]);
            setServices(servRes.data || []);
            setAutomations(autoRes.data || []);
            setRates(ratesRes.data || []);
        } catch (err) {
            console.error("Error loading services:", err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useRealtimeSync(['services', 'automations', 'production_rates'], () => loadData(true));

    const toggleExtra = (extraId) => {
        setSelectedExtras(prev => 
            prev.includes(extraId) 
                ? prev.filter(id => id !== extraId) 
                : [...prev, extraId]
        );
    };

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        const nicheNames = {
            general: 'Estrategia General',
            personal: 'Marca Personal',
            medical: 'Marketing Médico',
            doctor: 'Marketing Médico',
            hospital: 'Sistema de Hospitales',
            health: 'Sistema de Hospitales',
            educativo: 'Capacitaciones / Cursos',
            education: 'Capacitaciones / Cursos',
            hospitality: 'Marketing para Restaurantes',
            horeca: 'Marketing para Restaurantes',
            realestate: 'Marketing Inmobiliario',
            agro: 'Marketing Agropecuario',
            creator: 'Blog / Podcast',
            marketing: 'Marketing Digital',
            ecommerce: 'E-commerce',
            finance: 'Finanzas / Seguros',
            tech: 'Tecnología / SaaS',
            legal: 'Legal / Abogados',
            retail: 'Ventas Minoristas',
            consulting: 'Consultoría / Asesores',
            manufacturing: 'Manufactura / Industria',
            construction: 'Construcción / Obra',
            transport: 'Logística / Transporte',
            travel: 'Viajes / Turismo',
            ong: 'Sin Fines de Lucro',
            government: 'Gubernamental',
            other: 'Otro Sector'
        };
        setClientProfile(prev => ({
            ...prev,
            businessType: nicheNames[selectedNiche] || 'General'
        }));
        setWizardStep(2);
    };

    const closeWizard = () => {
        setSelectedPlan(null);
        setWizardStep(1);
        setClientProfile({ name: '', company: '', location: '', businessType: '' });
        setHasSignature(false);
        setSignatureImage(null);
        setPaymentInfo({ cardNumber: '', expiry: '', cvv: '', cardholderName: '' });
    };

    return (
        <div className="p-8 space-y-12 relative min-h-screen bg-[#050511]">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">DIIC <span className="text-indigo-500">MONETIZACIÓN</span></h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Comando Central Dashboard v5.0 — Estrategia de Precios 2026</p>
                </div>
            </div>

            {/* Niche Selector */}
            <div className="flex flex-col items-center gap-6 w-full max-w-[1600px] mx-auto -mb-2">
                <div className="text-center space-y-2">
                    <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em]">Filtrar por Nicho Estratégico</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Selecciona tu nicho para personalizar los planes, enfoques y flujos de marketing específicos.</p>
                </div>
                <div className="bg-[#0E0E18]/80 backdrop-blur-2xl p-8 rounded-[3.5rem] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] w-full">
                    {[
                        { id: 'general', label: 'Estrategia General', desc: 'Crecimiento estándar y marca', icon: Briefcase },
                        { id: 'personal', label: 'Marca Personal', desc: 'Autoridad para profesionales', icon: User },
                        { id: 'medical', label: 'Marketing Médico', desc: 'Funnels para médicos y especialistas', icon: Stethoscope },
                        { id: 'hospital', label: 'Sistema Hospitales', desc: 'Reputación & directorio médico', icon: HeartPulse },
                        { id: 'educativo', label: 'Cursos / Talleres', desc: 'Conversión para cursos y talleres', icon: GraduationCap },
                        { id: 'hospitality', label: 'Restaurantes', desc: 'Atracción foodie & delivery', icon: Utensils },
                        { id: 'realestate', label: 'Bienes Raíces', desc: 'Leads inmobiliarios de alta gama', icon: Home },
                        { id: 'agro', label: 'Agropecuario', desc: 'Venta mayorista e insumos', icon: Sprout },
                        { id: 'creator', label: 'Blog / Podcast', desc: 'Viralidad y monetización de marca', icon: Mic },
                        { id: 'marketing', label: 'Marketing Digital', desc: 'Embudo de captación B2B', icon: Megaphone },
                        { id: 'ecommerce', label: 'E-commerce', desc: 'Conversión y escala de ventas web', icon: ShoppingBag },
                        { id: 'finance', label: 'Finanzas / Seguros', desc: 'Captación de capital e inversiones', icon: Coins },
                        { id: 'tech', label: 'Tecnología / SaaS', desc: 'Adquisición de usuarios y SaaS', icon: Cpu },
                        { id: 'legal', label: 'Legal / Abogados', desc: 'Posicionamiento y casos complejos', icon: Gavel },
                        { id: 'retail', label: 'Retail / Tiendas', desc: 'Tráfico al punto de venta físico', icon: Store },
                        { id: 'consulting', label: 'Consultoría', desc: 'Asesoría de negocio high-ticket', icon: Briefcase },
                        { id: 'manufacturing', label: 'Manufactura', desc: 'Licitaciones y clientes corporativos', icon: Factory },
                        { id: 'construction', label: 'Construcción', desc: 'Pre-ventas y portafolio de obra', icon: HardHat },
                        { id: 'transport', label: 'Logística', desc: 'Logística y distribución B2B', icon: Truck },
                        { id: 'travel', label: 'Viajes / Turismo', desc: 'Reservas y branding de turismo', icon: Plane },
                        { id: 'ong', label: 'ONG / Sin Fines', desc: 'Recaudación y concientización social', icon: HeartHandshake },
                        { id: 'government', label: 'Gubernamental', desc: 'Comunicación institucional', icon: Landmark },
                        { id: 'other', label: 'Otro Sector', desc: 'Estrategias a la medida', icon: MoreHorizontal }
                    ].map((niche) => {
                        const Icon = niche.icon;
                        const isActive = selectedNiche === niche.id;
                        return (
                            <motion.button
                                key={niche.id}
                                onClick={() => setSelectedNiche(niche.id)}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-5 rounded-2xl transition-all duration-300 flex items-start gap-4 border text-left w-full relative overflow-hidden group ${
                                    isActive
                                        ? 'bg-gradient-to-br from-indigo-600/90 via-indigo-600 to-purple-600/90 border-indigo-400 text-white shadow-[0_15px_30px_rgba(99,102,241,0.3)]'
                                        : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.06] hover:border-white/12'
                                }`}
                            >
                                <div className={`p-3 rounded-xl flex-shrink-0 transition-all ${
                                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20'
                                }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col pr-2">
                                    <span className="font-black text-xs uppercase tracking-wider leading-tight">{niche.label}</span>
                                    <span className={`text-[10px] mt-1 transition-colors leading-normal ${
                                        isActive ? 'text-indigo-200' : 'text-gray-500 group-hover:text-gray-400'
                                    }`}>
                                        {niche.desc}
                                    </span>
                                </div>
                                {isActive && (
                                    <div className="absolute right-4 top-4 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Category Switcher */}
            <div className="flex justify-center">
                <div className="bg-white/5 p-1.5 rounded-3xl flex gap-1 border border-white/5">
                    <button 
                        onClick={() => setActiveCategory('plan')}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'plan' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-white'}`}
                    >
                        Niveles Mensuales
                    </button>
                    <button 
                        onClick={() => setActiveCategory('pack')}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'pack' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-white'}`}
                    >
                        Paquetes Especiales
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-20 text-indigo-500 font-black animate-pulse uppercase tracking-[0.5em]">
                    Sincronizando Catálogo...
                </div>
            ) : (
                <>
                    {activeCategory === 'plan' ? (
                        (() => {
                            const resolvedNiche = selectedNiche === 'doctor' ? 'medical' :
                                                  selectedNiche === 'health' ? 'hospital' :
                                                  selectedNiche === 'education' ? 'educativo' :
                                                  selectedNiche === 'horeca' ? 'hospitality' : selectedNiche;
                            const nicheData = NICHE_DETAILS[resolvedNiche] || NICHE_DETAILS.general;
                            const nichePlans = nicheData?.plans || {};
                            const planKeys = Object.keys(nichePlans);
                            const is5Col = planKeys.length >= 5;

                            return (
                                <div className={`grid grid-cols-1 ${is5Col ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' : 'sm:grid-cols-2 xl:grid-cols-4'} gap-6 relative z-10`}>
                                    {planKeys.map((planKey, index) => {
                                        const nichePlan = nichePlans[planKey];
                                        const baseService = services.find(s => s.id === planKey && s.category === 'plan') || {};
                                        const customizedService = {
                                            id: planKey,
                                            category: 'plan',
                                            level: planKey === 'authority' || planKey === 'marca' ? 'NIVEL CLAVE' :
                                                   planKey === 'scale' ? 'NIVEL MAESTRO' :
                                                   planKey === 'elite' ? 'NIVEL AVANZADO' :
                                                   `NIVEL ${planKey.toUpperCase()}`,
                                            name: nichePlan.name || baseService.name || `NIVEL ${planKey.toUpperCase()}`,
                                            narrative: nichePlan.narrative || baseService.narrative || '',
                                            price: nichePlan.price || baseService.price || '300',
                                            originalPrice: nichePlan.originalPrice || null,
                                            features: nichePlan.features || baseService.features || [],
                                            enfoque: nichePlan.enfoque || baseService.enfoque || '',
                                            filmmaker: nichePlan.filmmaker || baseService.filmmaker || '',
                                            deliverables: nichePlan.deliverables || baseService.deliverables || { videos: (index + 1) * 4, posts: (index + 1) * 6 },
                                            complexity: nichePlan.complexity || null
                                        };

                                        return (
                                            <PricingCard
                                                key={planKey}
                                                service={customizedService}
                                                index={index}
                                                onSelect={() => handleSelectPlan(customizedService)}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })()
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 relative z-10">
                            {services
                                .filter(s => s.category === 'pack')
                                .map((service, index) => (
                                    <PackCard 
                                        key={service.id}
                                        service={service}
                                        index={index}
                                        onSelect={() => handleSelectPlan(service)}
                                    />
                                ))
                            }
                        </div>
                    )}
                </>
            )}
            
            {/* Real Estate Master Strategic Blueprint */}
            {selectedNiche === 'realestate' && <RealEstateDossier />}

            {/* Medical Specific Strategic Blueprint & ROI Dossier */}
            {selectedNiche === 'medical' && <MedicalDossier />}

            {/* General Service Details & Paid Ads Info for other niches */}
            {selectedNiche !== 'realestate' && selectedNiche !== 'medical' && <ServiceDetails />}
            {selectedNiche !== 'realestate' && selectedNiche !== 'medical' && <PaidAdvertising />}

            {/* Individual Services Catalog - Point 3 of User Request */}
            <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] whitespace-nowrap">Catálogo Individual (Venta por Unidad)</h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* PRODUCTION CATEGORY */}
                    <CategoryCard 
                        title="🎬 Producción" 
                        items={rates.filter(r => r.id.includes('vid') || r.id.includes('reel') || r.id.includes('podcast'))} 
                        color="indigo"
                    />
                    {/* DESIGN CATEGORY */}
                    <CategoryCard 
                        title="🎨 Diseño" 
                        items={rates.filter(r => r.id.includes('post') || r.id.includes('carousel') || r.id.includes('portada'))} 
                        color="emerald"
                    />
                    {/* STRATEGY & SCALE */}
                    <CategoryCard 
                        title="🧠 Estrategia & Fotografía" 
                        items={rates.filter(r => r.id.includes('strategy') || r.id.includes('photo') || r.id.includes('auto'))} 
                        color="orange"
                    />
                </div>
            </div>

            {/* Advanced Levels - Automations & Scale */}
            <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] whitespace-nowrap">Niveles Avanzados (Opcional)</h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {automations.map((extra) => (
                        <motion.div
                            key={extra.id}
                            whileHover={{ y: -5 }}
                            onClick={() => toggleExtra(extra.id)}
                            className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group flex items-center justify-between ${
                                selectedExtras.includes(extra.id) 
                                    ? 'bg-orange-500/10 border-orange-500 shadow-[0_20px_40px_rgba(249,115,22,0.1)]' 
                                    : 'bg-[#0E0E18] border-white/5 hover:border-white/10'
                            }`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`p-4 rounded-2xl transition-all ${
                                    selectedExtras.includes(extra.id) ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 text-gray-500 group-hover:text-white'
                                }`}>
                                    {extra.id === 'systems' ? <Layers className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-wider mb-1">{extra.name}</h4>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{extra.price}</p>
                                </div>
                            </div>
                            
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                selectedExtras.includes(extra.id) ? 'bg-orange-500 border-orange-500 text-black' : 'border-white/10 text-transparent'
                            }`}>
                                <Check className="w-4 h-4 font-black" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Rules of Business & Key Phrase - Point 5 & Clave of User Request */}
            <div className="pt-20 pb-10 space-y-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Reglas de Negocio ZONA CREATIVA</h4>
                        </div>
                        <ul className="space-y-4">
                            {[
                                'Nunca vender por debajo de estos precios',
                                'Los extras siempre se facturan por separado',
                                'No aumentar entregables sin reajustar el precio'
                            ].map((rule, i) => (
                                <li key={i} className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] font-black text-indigo-500/50 uppercase tracking-[0.6em] mb-4">Filosofía de Rentabilidad</p>
                        <h2 className="text-3xl font-black text-white italic leading-tight tracking-tighter uppercase">
                            “Cada servicio tiene <span className="text-indigo-500">margen</span>, <br />
                            cada nivel tiene <span className="text-indigo-500">utilidad</span>.”
                        </h2>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-gray-700 uppercase tracking-[0.5em]">
                    <span>DIIC ZONE OS © 2026</span>
                    <span>Nivel Empresa Seria v1.0.4</span>
                    <span>Sincronizado Localmente</span>
                </div>
            </div>

            {/* Wizard Modal */}
            <AnimatePresence>
                {wizardStep > 1 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeWizard}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative w-full max-w-2xl bg-[#0E0E18] border border-white/10 rounded-[3rem] shadow-[0_100px_200px_rgba(0,0,0,0.8)] overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-500/20 rounded-2xl">
                                        <Zap className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">
                                        {wizardStep === 2 ? 'Perfil Estratégico' : 
                                         wizardStep === 3 ? 'Acuerdo de Producción' : 
                                         wizardStep === 4 ? 'Pago Seguro en Línea' : 'Contrato Emitido'}
                                    </h2>
                                </div>
                                <button onClick={closeWizard} className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {wizardStep === 2 && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block px-1">Titular del Acuerdo</label>
                                                <div className="relative">
                                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre y Apellido"
                                                        value={clientProfile.name}
                                                        onChange={(e) => setClientProfile({ ...clientProfile, name: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block px-1">Compañía / Marca</label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Ej. Nova Clínica"
                                                        value={clientProfile.company}
                                                        onChange={(e) => setClientProfile({ ...clientProfile, company: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block px-1">Territorio de Aplicación</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Ciudad, País"
                                                        value={clientProfile.location}
                                                        onChange={(e) => setClientProfile({ ...clientProfile, location: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block px-1">Vertical de Negocio</label>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Ej. Medicina / Real Estate"
                                                        value={clientProfile.businessType}
                                                        onChange={(e) => setClientProfile({ ...clientProfile, businessType: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {wizardStep === 3 && (
                                    <div className="space-y-8">
                                        <div className="bg-indigo-600 rounded-3xl p-10 space-y-8 shadow-2xl shadow-indigo-500/20">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-2">Entidad DIIC Strategist</p>
                                                    <h3 className="text-2xl font-black text-white italic">{selectedPlan.name}</h3>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-2">Compromiso Mensual</p>
                                                    <p className="text-4xl font-black text-white">${selectedPlan.price}</p>
                                                </div>
                                            </div>

                                            <div className="h-px bg-white/10 w-full" />

                                            <div className="grid grid-cols-2 gap-8 text-white">
                                                <div>
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Titular Confirmado</p>
                                                    <p className="text-lg font-black">{clientProfile.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Corporativo</p>
                                                    <p className="text-lg font-black">{clientProfile.company}</p>
                                                </div>
                                            </div>

                                            {selectedExtras.length > 0 && (
                                                <div className="pt-6 border-t border-white/10 space-y-4">
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Adicionales Seleccionados</p>
                                                    <div className="flex flex-wrap gap-3">
                                                        {selectedExtras.map(id => {
                                                            const extra = automations.find(a => a.id === id);
                                                            return (
                                                                <div key={id} className="px-5 py-2 bg-black/40 border border-white/20 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">
                                                                    + {extra.name} (A Cotizar)
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 px-2">
                                                <FileText className="w-5 h-5 text-indigo-400" />
                                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Cláusulas de Producción</h4>
                                            </div>
                                            <div className="bg-black/40 border border-white/5 rounded-[2rem] p-10 text-xs text-gray-500 leading-loose font-medium italic">
                                                <p className="mb-6 text-white not-italic font-black text-sm uppercase tracking-widest">Base del Acuerdo:</p>
                                                "Este acuerdo establece la activación inmediata del {selectedPlan?.category === 'pack' ? 'paquete' : 'nivel'} seleccionado ({selectedPlan?.name}), detallando la producción conforme a los niveles estratégicos de ZONA CREATIVA."
                                                <div className="mt-8 h-px bg-white/5 mb-8" />
                                                <p>
                                                    DIIC ZONE garantiza la entrega de las piezas descritas manteniendo los estándares de calidad cinemática.
                                                    El cliente asegura el acceso a locaciones y personal clave para las sesiones de rodaje programadas.
                                                </p>
                                                <div className="mt-12 flex flex-col md:flex-row justify-between gap-8">
                                                    <div className="flex flex-col gap-4">
                                                        <div className="w-40 h-px bg-gray-800" />
                                                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-700 pl-2 text-center md:text-left">DIIC ZONE</span>
                                                    </div>
                                                    <div className="flex flex-col gap-3 w-full md:w-1/2">
                                                        <div className="flex justify-between items-center px-1">
                                                            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-indigo-400">Firma del Cliente</span>
                                                            {hasSignature && (
                                                                <button
                                                                    type="button"
                                                                    onClick={clearSignature}
                                                                    className="text-[9px] text-red-500 hover:text-red-400 font-black uppercase tracking-wider"
                                                                >
                                                                    Limpiar
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="border border-white/10 rounded-2xl bg-black/60 w-full h-32 relative overflow-hidden">
                                                            <canvas
                                                                ref={canvasRef}
                                                                width={300}
                                                                height={128}
                                                                className="w-full h-full cursor-crosshair touch-none"
                                                                onMouseDown={startDrawing}
                                                                onMouseMove={draw}
                                                                onMouseUp={stopDrawing}
                                                                onMouseLeave={stopDrawing}
                                                                onTouchStart={startDrawing}
                                                                onTouchMove={draw}
                                                                onTouchEnd={stopDrawing}
                                                            />
                                                            {!hasSignature && (
                                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[10px] text-gray-600 font-mono tracking-widest uppercase">
                                                                    Firma Aquí con el mouse o touch
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="w-full h-px bg-gray-800" />
                                                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-700 pl-2">EL CLIENTE: {clientProfile.name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {wizardStep === 4 && (
                                    <div className="space-y-8">
                                        <div className="bg-[#05050C] border border-white/5 rounded-3xl p-8 space-y-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Suscripción Mensual</span>
                                                <span className="text-xl font-black text-white">${selectedPlan?.price} USD</span>
                                            </div>
                                            <div className="h-px bg-white/5 w-full" />
                                            <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                                <span>Ecosistema DIIC ZONE OS v2</span>
                                                <span className="text-emerald-400 uppercase tracking-widest">Activación Inmediata</span>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] px-1">Detalle de Pago Tarjeta de Crédito</h4>
                                            
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block px-1">Nombre del Tarjetahabiente</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Como figura en la tarjeta"
                                                        value={paymentInfo.cardholderName}
                                                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 uppercase"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block px-1">Número de Tarjeta</label>
                                                    <input
                                                        type="text"
                                                        maxLength="19"
                                                        placeholder="4000 1234 5678 9010"
                                                        value={paymentInfo.cardNumber}
                                                        onChange={(e) => {
                                                            const v = e.target.value.replace(/\s?/g, '').replace(/[^0-9]/g, '');
                                                            const matches = v.match(/\d{4,16}/g);
                                                            const match = matches && matches[0] || '';
                                                            const parts = [];
                                                            for (let i=0, len=match.length; i<len; i+=4) {
                                                                parts.push(match.substring(i, i+4));
                                                            }
                                                            if (parts.length > 0) {
                                                                setPaymentInfo({ ...paymentInfo, cardNumber: parts.join(' ') });
                                                            } else {
                                                                setPaymentInfo({ ...paymentInfo, cardNumber: v });
                                                            }
                                                        }}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 font-mono tracking-widest"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block px-1">Vencimiento (MM/AA)</label>
                                                        <input
                                                            type="text"
                                                            maxLength="5"
                                                            placeholder="MM/AA"
                                                            value={paymentInfo.expiry}
                                                            onChange={(e) => {
                                                                let v = e.target.value.replace(/[^0-9]/g, '');
                                                                if (v.length > 2) {
                                                                    v = v.substring(0, 2) + '/' + v.substring(2, 4);
                                                                }
                                                                setPaymentInfo({ ...paymentInfo, expiry: v });
                                                            }}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 font-mono text-center"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block px-1">CVV (Código Seguridad)</label>
                                                        <input
                                                            type="text"
                                                            maxLength="3"
                                                            placeholder="123"
                                                            value={paymentInfo.cvv}
                                                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/[^0-9]/g, '') })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 font-mono text-center"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {wizardStep === 5 && (
                                    <div className="space-y-8 text-center py-6">
                                        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                                            <Check className="w-10 h-10 animate-bounce" />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-white uppercase tracking-wider">¡Contratación Exitosa!</h3>
                                            <p className="text-gray-400 text-sm max-w-md mx-auto">
                                                El pago del plan se ha procesado correctamente. Tu contrato de producción digital con DIIC ZONE ha sido emitido y firmado.
                                            </p>
                                        </div>

                                        <div className="bg-[#05050C] border border-white/5 rounded-3xl p-6 text-left space-y-4 max-w-md mx-auto">
                                            <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Resumen del Acuerdo</h4>
                                            <div className="space-y-2 text-xs font-bold text-gray-400">
                                                <div className="flex justify-between"><span>Socio:</span><span className="text-white">{clientProfile.name}</span></div>
                                                <div className="flex justify-between"><span>Marca:</span><span className="text-white">{clientProfile.company}</span></div>
                                                <div className="flex justify-between"><span>Nicho:</span><span className="text-indigo-400 uppercase">{clientProfile.businessType}</span></div>
                                                <div className="flex justify-between"><span>Nivel/Plan:</span><span className="text-white">{selectedPlan?.name}</span></div>
                                                <div className="flex justify-between"><span>Tarifa:</span><span className="text-white">${selectedPlan?.price} USD/mes</span></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-10 border-t border-white/5 bg-white/[0.02] flex gap-4">
                                {wizardStep === 2 && (
                                    <button
                                        onClick={() => setWizardStep(3)}
                                        disabled={!clientProfile.name || !clientProfile.company}
                                        className="flex-1 py-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:grayscale text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase text-xs tracking-[0.3em]"
                                    >
                                        Generar Acuerdo
                                    </button>
                                )}

                                {wizardStep === 3 && (
                                    <>
                                        <button
                                            onClick={() => setWizardStep(2)}
                                            className="px-10 py-6 bg-white/5 hover:bg-white/10 text-gray-500 font-black rounded-2xl transition-all uppercase text-xs tracking-widest"
                                        >
                                            Atrás
                                        </button>
                                        <button
                                            onClick={() => setWizardStep(4)}
                                            disabled={!hasSignature}
                                            className="flex-1 py-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:grayscale text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase text-xs tracking-[0.3em]"
                                        >
                                            Confirmar Firma
                                        </button>
                                    </>
                                )}

                                {wizardStep === 4 && (
                                    <>
                                        <button
                                            onClick={() => setWizardStep(3)}
                                            disabled={isProcessingPayment}
                                            className="px-10 py-6 bg-white/5 hover:bg-white/10 text-gray-500 font-black rounded-2xl transition-all uppercase text-xs tracking-widest"
                                        >
                                            Atrás
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsProcessingPayment(true);
                                                setTimeout(() => {
                                                    setIsProcessingPayment(false);
                                                    setWizardStep(5);
                                                    toast.success("Pago Procesado con Éxito. Contrato Activado.");
                                                }, 1800);
                                            }}
                                            disabled={!paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv || !paymentInfo.cardholderName || isProcessingPayment}
                                            className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:grayscale text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3"
                                        >
                                            {isProcessingPayment ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Procesando Cobro...
                                                </>
                                            ) : (
                                                "Proceder al Pago Seguro"
                                            )}
                                        </button>
                                    </>
                                )}

                                {wizardStep === 5 && (
                                    <>
                                        <button
                                            onClick={handleDownloadContract}
                                            className="flex-1 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase text-xs tracking-widest flex items-center justify-center gap-3"
                                        >
                                            Descargar Contrato
                                        </button>
                                        <button
                                            onClick={closeWizard}
                                            className="px-10 py-6 bg-white/5 hover:bg-white/10 text-gray-500 font-black rounded-2xl transition-all uppercase text-xs tracking-widest"
                                        >
                                            Cerrar
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PricingCard({ service, index, onSelect }) {
    const isPopular = service.level === 'NIVEL CLAVE';
    const icons = [Shield, Zap, Crown, Star, Award];
    const Icon = icons[index] || Zap;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-10 rounded-[3rem] border flex flex-col h-full relative overflow-hidden group transition-all duration-500 ${isPopular ? 'bg-indigo-600 border-indigo-400 shadow-[0_40px_80px_rgba(99,102,241,0.2)]' : 'bg-[#0E0E18] border-white/5 hover:border-white/10'
                }`}
        >
            {isPopular && (
                <div className="absolute top-8 right-8 bg-white/20 text-white text-[9px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
                    NIVEL CLAVE 🌟
                </div>
            )}

            {/* Header: Icon & Name */}
            <div className="flex items-start gap-5 mb-10">
                <div className={`p-4 rounded-3xl ${isPopular ? 'bg-white/20' : 'bg-white/5 text-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity'}`}>
                    <Icon className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-white italic leading-tight mb-1">{service.name}</h3>
                    <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${isPopular ? 'text-white/50' : 'text-gray-600'}`}>{service.level}</p>
                </div>
            </div>

            {/* Price Main */}
            <div className="mb-6">
                <div className="flex items-baseline gap-2 flex-wrap">
                    {service.originalPrice && (
                        <span className="text-xl font-bold text-gray-500 line-through mr-2">${service.originalPrice}</span>
                    )}
                    <span className="text-6xl font-black text-white tracking-tighter">${service.price}</span>
                    <span className={`text-[10px] font-bold ${isPopular ? 'text-white/40' : 'text-gray-700'}`}>/MES</span>
                </div>
                <p className={`text-[10px] font-medium mt-2 italic ${isPopular ? 'text-white/70' : 'text-gray-500'}`}>{service.narrative}</p>
            </div>

            {/* Deliverables Grid */}
            <div className="grid grid-cols-2 gap-2 mb-8">
                <div className={`p-4 rounded-2xl flex flex-col items-center justify-center border ${isPopular ? 'bg-black/20 border-black/10' : 'bg-white/5 border-white/5'}`}>
                    <span className="text-3xl font-black text-white mb-1">{service.deliverables?.videos || 0}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isPopular ? 'text-white/60' : 'text-gray-500'}`}>Videos</span>
                </div>
                <div className={`p-4 rounded-2xl flex flex-col items-center justify-center border ${isPopular ? 'bg-black/20 border-black/10' : 'bg-white/5 border-white/5'}`}>
                    <span className="text-3xl font-black text-white mb-1">{service.deliverables?.posts || 0}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isPopular ? 'text-white/60' : 'text-gray-500'}`}>Posts</span>
                </div>
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-8 flex-1">
                {service.features?.map((feature, i) => (
                    <div key={i} className={`flex items-center gap-3 text-xs font-medium ${isPopular ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'} transition-colors`}>
                        <Check className={`w-4 h-4 ${isPopular ? 'text-white' : 'text-gray-600'}`} />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>

            {/* Pauta / Enfoque */}
            <div className={`p-4 rounded-2xl border text-center mb-10 ${isPopular ? 'bg-black/30 border-black/20' : 'bg-emerald-500/5 border-emerald-500/10'}`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <p className={`text-xs font-black ${isPopular ? 'text-emerald-300' : 'text-emerald-400'}`}>{service.enfoque}</p>
                </div>
                <p className={`text-[9px] font-bold uppercase tracking-widest ${isPopular ? 'text-white/50' : 'text-gray-600'}`}>{service.filmmaker}</p>
            </div>

            {/* Action CTA */}
            <button
                onClick={onSelect}
                className={`w-full py-6 rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.4em] transition-all ${isPopular ? 'bg-white text-black hover:bg-gray-100 shadow-2xl' : 'bg-black border border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-500 shadow-xl'
                    }`}
            >
                Seleccionar nivel
            </button>
        </motion.div>
    );
}

function PackCard({ service, index, onSelect }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-10 rounded-[3rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 flex flex-col h-full relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-500"
        >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 blur-[50px] group-hover:bg-indigo-500/20 transition-all" />
            
            {/* Type Badge */}
            <div className="mb-8 items-center flex gap-3">
                <div className="p-3 bg-white/5 rounded-2xl text-indigo-400">
                    {service.id.includes('design') ? <Palette className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </div>
                <div>
                    <h3 className="text-lg font-black text-white italic tracking-tight">{service.name}</h3>
                    <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">{service.enfoque}</p>
                </div>
            </div>

            {/* Price section */}
            <div className="mb-10">
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Inversión Pack</p>
                <div className="flex items-center gap-3">
                    <span className="text-5xl font-black text-white tracking-tighter">${service.price}</span>
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <span className="text-[8px] font-black text-emerald-400 tracking-[0.2em] uppercase">Pack Ahorro</span>
                    </div>
                </div>
            </div>

            {/* Deliverables List (Pill style) */}
            <div className="space-y-3 mb-12 flex-1">
                {service.features?.map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 text-[10px] font-bold text-gray-500 group-hover:text-gray-300 transition-colors">
                        <Check className="w-4 h-4 text-indigo-500" />
                        <span className="uppercase tracking-widest">{feature}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={onSelect}
                className="w-full py-5 rounded-2xl bg-white/5 hover:bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest transition-all border border-white/5 hover:border-indigo-500 shadow-xl"
            >
                Adquirir este Pack
            </button>
        </motion.div>
    );
}

function DeliverableItem({ label, value, isPopular }) {
    const isString = typeof value === 'string' && value.length > 2;

    return (
        <div className="text-center">
            <p className={`${isString ? 'text-xl' : 'text-3xl'} font-black text-white mb-1 uppercase tracking-tighter`}>{value}</p>
            <p className={`text-[8px] font-black uppercase tracking-widest ${isPopular ? 'text-white/40' : 'text-gray-700'}`}>{label}</p>
        </div>
    );
}

function CategoryCard({ title, items, color }) {
    const colorClasses = {
        indigo: 'text-indigo-400 bg-indigo-500/10',
        emerald: 'text-emerald-400 bg-emerald-500/10',
        orange: 'text-orange-400 bg-orange-500/10'
    };

    return (
        <div className="bg-[#0E0E18] border border-white/5 p-8 rounded-[2rem] space-y-6">
            <h3 className={`text-xs font-black uppercase tracking-[0.3em] px-4 py-2 rounded-xl inline-block ${colorClasses[color] || colorClasses.indigo}`}>
                {title}
            </h3>
            <div className="space-y-4">
                {items.length > 0 ? items.map(item => (
                    <div key={item.id} className="flex justify-between items-center group">
                        <span className="text-gray-400 group-hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">{item.name}</span>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] text-gray-600 font-black line-through opacity-0 group-hover:opacity-100 transition-opacity">
                                ${(item.price_sale * 1.2).toFixed(0)}
                             </span>
                             <span className="text-white font-black text-sm tracking-tighter">${item.price_sale}</span>
                        </div>
                    </div>
                )) : (
                    <p className="text-[10px] text-gray-700 italic">Cargando catálogo...</p>
                )}
            </div>
        </div>
    );
}

function ServiceDetails() {
    const details = [
        { icon: ClipboardList, title: "Estrategia & Calendario", desc: "Plan mensual de contenido con temas, fechas y objetivos claros por plataforma." },
        { icon: Film, title: "Producción filmmaker", desc: "Sesión profesional de filmación para crear contenido de calidad cinematográfica." },
        { icon: Scissors, title: "Edición de video", desc: "Reels y videos editados con subtítulos, música, efectos y branding de tu marca." },
        { icon: ImageIcon, title: "Diseño gráfico", desc: "Posts, carruseles, stories e infografías con identidad visual consistente." },
        { icon: MessageCircle, title: "Community management", desc: "Respuesta a comentarios y mensajes. Construcción activa de tu comunidad." },
        { icon: Megaphone, title: "Gestión de pauta", desc: "Creamos y optimizamos tus anuncios. El presupuesto lo pones tú a la plataforma." },
        { icon: BarChart2, title: "Reporte mensual", desc: "Informe con alcance, clics, leads y recomendaciones para el siguiente mes." },
        { icon: Target, title: "Estrategia de conversión", desc: "Cada pieza de contenido diseñada para atraer clientes reales a tu negocio." }
    ];

    return (
        <div className="space-y-8 relative z-10">
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
                    <div key={i} className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex gap-6 items-start hover:bg-white/[0.02] transition-colors">
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
                <div className="bg-[#0E0E18] border border-indigo-500/30 p-8 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400">01</div>
                    <div className="p-5 bg-white/5 rounded-2xl text-yellow-500 mb-6 mt-4">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-white mb-4">Tú pones el presupuesto</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">El cliente transfiere directamente a Facebook, Instagram, TikTok o YouTube. Ese dinero nunca pasa por nosotros — es 100% tuyo y de la plataforma.</p>
                </div>
                
                <div className="bg-[#0E0E18] border border-purple-500/30 p-8 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-black text-purple-400">02</div>
                    <div className="p-5 bg-white/5 rounded-2xl text-purple-400 mb-6 mt-4">
                        <Settings className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-white mb-4">Nosotros lo gestionamos</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Creamos los anuncios, diseñamos las creatividades, segmentamos la audiencia correcta y optimizamos semana a semana para maximizar resultados.</p>
                </div>

                <div className="bg-[#0E0E18] border border-emerald-500/30 p-8 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400">03</div>
                    <div className="p-5 bg-white/5 rounded-2xl text-emerald-400 mb-6 mt-4">
                        <PieChart className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-black text-white mb-4">Recibes el reporte</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Cada mes te enviamos un informe detallado: cuántas personas vieron tus anuncios, cuántos clicaron, cuántos contactaron y cuánto invertiste vs. retorno.</p>
                </div>
            </div>

            <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-6 rounded-r-2xl">
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
                    <div className="bg-[#0E0E18] border-t-4 border-blue-500 p-6 rounded-b-2xl border-x border-b border-white/5">
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
                    <div className="bg-[#0E0E18] border-t-4 border-purple-500 p-6 rounded-b-2xl border-x border-b border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)] relative">
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
                    <div className="bg-[#0E0E18] border-t-4 border-cyan-500 p-6 rounded-b-2xl border-x border-b border-white/5">
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
                    <div className="bg-[#0E0E18] border-t-4 border-yellow-500 p-6 rounded-b-2xl border-x border-b border-white/5">
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
{/* ... */}
                    </div>

                </div>
            </div>
        </div>
    );
}

function MedicalDossier() {
    // --- SIMULADOR DE ROI INTERACTIVO (MARKETING MÉDICO) ---
    const [monthlyMessages, setMonthlyMessages] = useState(40);
    const [conversionRate, setConversionRate] = useState(30); // 30% default target
    const [consultationFee, setConsultationFee] = useState(40);
    const [procedureRate, setProcedureRate] = useState(15); // 15% need procedure/studies
    const [procedureFee, setProcedureFee] = useState(300);
    const [selectedTierPrice, setSelectedTierPrice] = useState(350);

    const calculatedPatients = Math.max(1, Math.round(monthlyMessages * (conversionRate / 100)));
    const consultationIncome = calculatedPatients * consultationFee;
    const procedurePatients = Math.round(calculatedPatients * (procedureRate / 100));
    const procedureIncome = procedurePatients * procedureFee;
    const totalGrossIncome = consultationIncome + procedureIncome;
    const totalMarketingCost = selectedTierPrice;
    const netProfit = totalGrossIncome - totalMarketingCost;
    const roiPercentage = totalMarketingCost > 0 ? Math.round((netProfit / totalMarketingCost) * 100) : 0;

    const dimensions = [
        {
            num: '01',
            title: 'Identidad Profesional',
            desc: 'Quién es el médico, su especialidad y lo que lo distingue ante los pacientes.',
            icon: Stethoscope,
            color: 'from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30'
        },
        {
            num: '02',
            title: 'Construcción de Autoridad',
            desc: 'Contenido educativo constante que posiciona como referente confiable en su área.',
            icon: Award,
            color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30'
        },
        {
            num: '03',
            title: 'Cumplimiento Ético',
            desc: 'Todo contenido respeta la confidencialidad médica y el consentimiento del paciente.',
            icon: Shield,
            color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
        },
        {
            num: '04',
            title: 'Diversificación de Ingresos',
            desc: 'La marca abre puertas más allá de la consulta: conferencias, medios y colaboraciones.',
            icon: Compass,
            color: 'from-orange-500/20 to-yellow-500/20 text-orange-400 border-orange-500/30'
        },
        {
            num: '05',
            title: 'Credibilidad Editorial',
            desc: 'Presencia en medios digitales que valida al médico ante pacientes, colegas y clínicas.',
            icon: Star,
            color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
        }
    ];

    const channels = [
        {
            name: 'Instagram',
            role: 'Descubrimiento & Autoridad',
            desc: 'Reels educativos, casos clínicos y testimonios autorizados.',
            badge: 'Reels & Testimonios',
            color: 'border-pink-500/30 bg-pink-500/5 text-pink-400'
        },
        {
            name: 'Facebook',
            role: 'Comunidad & Confianza',
            desc: 'Educación a familias y grupos de pacientes con enfoque institucional.',
            badge: 'Comunidad Familiar',
            color: 'border-blue-500/30 bg-blue-500/5 text-blue-400'
        },
        {
            name: 'TikTok',
            role: 'Alcance Masivo',
            desc: 'Mitos y verdades de la especialidad para desmentir desinformación.',
            badge: 'Mitos y Verdades',
            color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
        },
        {
            name: 'YouTube',
            role: 'Autoridad Profunda',
            desc: 'Episodios educativos largos, explicación de tratamientos y patologías.',
            badge: 'Educación en Profundidad',
            color: 'border-red-500/30 bg-red-500/5 text-red-400'
        },
        {
            name: 'WhatsApp',
            role: 'Canal de Conversión',
            desc: 'Donde se realiza el triaje inicial y se agenda la consulta con fecha/hora.',
            badge: 'Triaje & Agendamiento',
            color: 'border-green-500/30 bg-green-500/5 text-green-400'
        },
        {
            name: 'Google',
            role: 'Reputación & Perfil Médico',
            desc: 'Reseñas de pacientes en Google Maps y posicionamiento para búsquedas de urgencia.',
            badge: 'Google Reviews & SEO',
            color: 'border-amber-500/30 bg-amber-500/5 text-amber-400'
        }
    ];

    const roadmapLevels = [
        {
            level: 'Nivel 1',
            name: 'Presencia Digital',
            price: '$350',
            complexity: 'Baja',
            objective: 'Dar a conocer la oferta médica y generar confianza básica.',
            color: 'border-blue-500/40 text-blue-400'
        },
        {
            level: 'Nivel 2',
            name: 'Estrategia',
            price: '$500',
            complexity: 'Media',
            objective: 'Captación de pacientes con contenido educativo y pauta inicial.',
            color: 'border-purple-500/40 text-purple-400'
        },
        {
            level: 'Nivel 3',
            name: 'Marca',
            price: '$700',
            complexity: 'Alta',
            objective: 'Posicionar al médico como referente indiscutible de su especialidad.',
            color: 'border-indigo-500/40 text-indigo-400'
        },
        {
            level: 'Nivel 4',
            name: 'Automatización',
            price: '$999',
            complexity: 'Avanzada',
            objective: 'Bot de WhatsApp 24/7 para agendamiento, triaje y recordatorios.',
            color: 'border-emerald-500/40 text-emerald-400'
        },
        {
            level: 'Nivel 5',
            name: 'Escala',
            price: '$1,500',
            complexity: 'Maestro',
            objective: 'Dominar múltiples canales y maximizar el valor por paciente.',
            color: 'border-amber-500/40 text-amber-400'
        }
    ];

    const priceLadder = [
        { from: 'Presencia', to: 'Estrategia', desc: 'Se activa pauta publicitaria y aumenta la frecuencia de producción.' },
        { from: 'Estrategia', to: 'Marca', desc: 'Se suma producción cinematográfica y testimonios en video.' },
        { from: 'Marca', to: 'Automatización', desc: 'Se integra el bot de WhatsApp y el sistema de agendamiento.' },
        { from: 'Automatización', to: 'Escala', desc: 'Se dominan múltiples canales y se maximiza el valor por paciente.' }
    ];

    const adTiers = [
        { spend: 'Hasta $100/mes de pauta', fee: '20% de comisión (mínimo $20)' },
        { spend: '$101 – $200/mes', fee: '15% de comisión' },
        { spend: '$201 – $500/mes', fee: '12% de comisión' },
        { spend: '$500/mes en adelante', fee: '10% de comisión' }
    ];

    return (
        <div className="space-y-16 relative z-10 pt-12 pb-16">
            {/* 1. HEADER & MANIFIESTO ESTRATÉGICO */}
            <div className="bg-gradient-to-br from-indigo-900/30 via-[#0E0E18] to-purple-900/20 border border-indigo-500/30 p-8 sm:p-12 rounded-[3.5rem] shadow-[0_30px_100px_rgba(99,102,241,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30">
                                <Stethoscope className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
                                SISTEMA DE CRECIMIENTO MÉDICO DIIC ZONE 2026
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                            Marketing Digital para Médicos
                        </h2>
                        <p className="text-sm text-gray-400 font-medium mt-1">
                            Propuesta de Posicionamiento y Crecimiento Digital para Especialistas y Clínicas
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <div className="text-right">
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Meta de Conversión</span>
                            <span className="text-xs font-black text-emerald-400">30% Mensaje a Consulta Agendada</span>
                        </div>
                    </div>
                </div>

                {/* POR QUÉ ESTO IMPORTA & MISIÓN/VISIÓN */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Eye className="w-4 h-4" /> 1. Por Qué Esto Importa
                            </h3>
                            <p className="text-sm font-bold text-white leading-relaxed">
                                El <strong className="text-emerald-400 font-black">94% de los pacientes</strong> revisa reseñas y presencia digital antes de elegir a un médico.
                            </p>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                Buscan primero en Google e Instagram — y solo después agendan la consulta. Si un médico no aparece en ese momento de búsqueda, ese paciente simplemente no sabe que existe como opción.
                            </p>
                            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-200 leading-relaxed">
                                <strong className="font-black text-white">La Verdad Ineludible:</strong> La ausencia de marca personal ya es, en sí misma, una marca — <span className="text-rose-400 font-bold">comunica invisibilidad en vez de autoridad</span>. Un médico con trayectoria real que no se refleja en su presencia digital está perdiendo pacientes frente a colegas con menos experiencia pero más visibilidad.
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 bg-black/40 border border-white/5 p-6 rounded-3xl space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
                            2. Misión, Visión y Objetivo
                        </h3>
                        <div className="space-y-3">
                            <div className="border-l-2 border-indigo-500 pl-4 py-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block">Misión</span>
                                <p className="text-xs text-gray-300 font-medium leading-snug">
                                    Ayudar a que los pacientes encuentren, entiendan y confíen en el médico correcto para su necesidad de salud.
                                </p>
                            </div>
                            <div className="border-l-2 border-purple-500 pl-4 py-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-purple-400 block">Visión</span>
                                <p className="text-xs text-gray-300 font-medium leading-snug">
                                    Ser el médico o la clínica de referencia reconocida en su especialidad y ciudad.
                                </p>
                            </div>
                            <div className="border-l-2 border-emerald-500 pl-4 py-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block">Objetivo Principal</span>
                                <p className="text-xs text-gray-300 font-medium leading-snug">
                                    Construir presencia digital que traduzca seguidores en consultas agendadas reales.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. LAS 5 DIMENSIONES DE LA MARCA MÉDICA */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] whitespace-nowrap">
                        3. Las 5 Dimensiones de la Marca Médica
                    </h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {dimensions.map((dim, i) => {
                        const Icon = dim.icon;
                        return (
                            <motion.div
                                key={i}
                                whileHover={{ y: -6 }}
                                className="bg-[#0E0E18] border border-white/5 hover:border-white/15 p-6 rounded-[2rem] flex flex-col justify-between transition-all duration-300 relative overflow-hidden group"
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-black text-gray-700 group-hover:text-indigo-400 font-mono transition-colors">
                                            {dim.num}
                                        </span>
                                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${dim.color} border`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-wider leading-snug">
                                        {dim.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                        {dim.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* 4. ESTUDIO DE MERCADO & 5. QUÉ INCLUYE EL SERVICIO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 4. Estudio de Mercado */}
                <div className="bg-[#0E0E18] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/5 rounded-2xl text-yellow-400">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Investigación Previa</span>
                            <h3 className="text-lg font-black text-white uppercase tracking-wide">4. Estudio de Mercado</h3>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                        Lo que nuestro equipo investiga exhaustivamente antes de producir la primera pieza de contenido:
                    </p>
                    <div className="space-y-3">
                        {[
                            { label: 'Competencia Directa', desc: 'Otros médicos de la misma especialidad activos en la zona.' },
                            { label: 'Demanda Real', desc: 'Qué preguntas, dudas y síntomas busca la gente sobre esa especialidad.' },
                            { label: 'Barreras del Paciente', desc: 'Vergüenza, desconocimiento o miedo específicos de la especialidad.' },
                            { label: 'Estado de Redes Actuales', desc: 'Auditoría integral si ya cuenta con perfiles creados.' },
                            { label: 'Precio de Consulta / Procedimientos', desc: 'Valores de consulta y procedimientos para calcular el ROI real.' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h5 className="text-xs font-black text-white">{item.label}</h5>
                                    <p className="text-[11px] text-gray-500 font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Qué Incluye el Servicio */}
                <div className="bg-[#0E0E18] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/5 rounded-2xl text-indigo-400">
                            <Film className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Entregables de Calidad</span>
                            <h3 className="text-lg font-black text-white uppercase tracking-wide">5. Qué Incluye el Servicio</h3>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-indigo-400">
                                <Film className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-wider text-white">Audiovisual Pro</span>
                            </div>
                            <ul className="text-[11px] text-gray-500 font-medium space-y-1">
                                <li>• Videos testimoniales de pacientes</li>
                                <li>• Videos informativos y educativos</li>
                                <li>• Grabaciones en consultorio/quirófano</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-purple-400">
                                <ImageIcon className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-wider text-white">Fotografía Pro</span>
                            </div>
                            <ul className="text-[11px] text-gray-500 font-medium space-y-1">
                                <li>• Sesiones en entorno clínico</li>
                                <li>• Equipo médico e instalaciones</li>
                                <li>• Procedimientos con autorización</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <Megaphone className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-wider text-white">Gestión de Redes</span>
                            </div>
                            <ul className="text-[11px] text-gray-500 font-medium space-y-1">
                                <li>• Creación y optimización de perfiles</li>
                                <li>• Diseño de posts, stories y reels</li>
                                <li>• Copywriting médico especializado</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-yellow-400">
                                <Zap className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-wider text-white">Automatización & Ads</span>
                            </div>
                            <ul className="text-[11px] text-gray-500 font-medium space-y-1">
                                <li>• Bot de WhatsApp para agendamiento</li>
                                <li>• Gestión de campañas publicitarias</li>
                                <li>• Triaje inicial de pacientes</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. CANALES DE COMUNICACIÓN */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] whitespace-nowrap">
                        6. Ecosistema de Canales de Comunicación
                    </h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {channels.map((chan, i) => (
                        <div
                            key={i}
                            className={`p-6 rounded-[2rem] bg-[#0E0E18] border ${chan.color} flex flex-col justify-between space-y-4`}
                        >
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-lg font-black text-white">{chan.name}</h4>
                                    <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                        {chan.badge}
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-indigo-300 italic mb-2">{chan.role}</p>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed">{chan.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 7 & 8. EL MAPA DE RUTA DE 5 NIVELES & ESCALERA DE VALOR */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] whitespace-nowrap">
                        7. El Mapa de Ruta — Sistema DIIC ZONE de 5 Niveles
                    </h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {roadmapLevels.map((lvl, i) => (
                        <div
                            key={i}
                            className={`p-6 rounded-[2.5rem] bg-[#0E0E18] border ${lvl.color} flex flex-col justify-between relative overflow-hidden`}
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{lvl.level}</span>
                                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-white">
                                        {lvl.complexity}
                                    </span>
                                </div>
                                <h4 className="text-base font-black text-white uppercase">{lvl.name}</h4>
                                <p className="text-2xl font-black text-white tracking-tight">{lvl.price}<span className="text-xs text-gray-500 font-medium">/mes</span></p>
                                <div className="h-px bg-white/5 w-full" />
                                <p className="text-xs text-gray-400 font-medium leading-relaxed">{lvl.objective}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-xs text-gray-400 font-medium italic">
                        ✦ <strong className="text-white font-bold">Revisión de ruta:</strong> A los 3 meses iniciales del Nivel 1, se evalúan los resultados en conjunto para definir si se avanza al Nivel 2 (Estrategia). El avance nunca es automático, se acuerda por escrito entre ambas partes.
                    </p>
                </div>

                {/* 8. Por qué sube el precio */}
                <div className="bg-[#0E0E18] border border-white/5 p-8 rounded-[3rem] space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Escalera de Valor</span>
                            <h3 className="text-xl font-black text-white uppercase tracking-wide">8. Por Qué Sube el Precio en Cada Nivel</h3>
                        </div>
                        <div className="px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
                            Principio de Utilidad Mutua
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {priceLadder.map((step, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-black text-indigo-400">
                                    <span>{step.from}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-white">{step.to}</span>
                                </div>
                                <p className="text-xs text-gray-400 font-medium leading-snug">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 text-center">
                        <h4 className="text-base font-black text-white uppercase italic tracking-wide">
                            “El médico nunca paga más por lo mismo — paga más porque el sistema hace más por su consulta.”
                        </h4>
                    </div>
                </div>
            </div>

            {/* 9. SISTEMA DE CONVERSIÓN (DE MENSAJE A CONSULTA AGENDADA) */}
            <div className="bg-gradient-to-br from-[#0E0E18] via-[#0E0E18] to-emerald-950/20 border border-emerald-500/30 p-8 sm:p-12 rounded-[3.5rem] space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                            <Clock className="w-4 h-4" /> Protocolo de Respuesta Inmediata
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                            9. Sistema de Conversión — De Mensaje a Consulta Agendada
                        </h3>
                    </div>
                    <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-black uppercase tracking-wider">
                        Meta: 30% Conversión
                    </div>
                </div>

                <p className="text-xs text-gray-400 font-medium">
                    Así se trabaja cada contacto recibido para garantizar que los mensajes de pacientes se traduzcan en consultas efectivas:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { num: '01', title: 'Respuesta en < 2 Horas — Siempre', desc: 'La rapidez genera confianza inmediata en momentos de necesidad o molestia de salud.' },
                        { num: '02', title: 'Identificar la Necesidad Real', desc: 'Escuchar el síntoma o inquietud médica antes de ofrecer la cita de valoración.' },
                        { num: '03', title: 'Llamado a la Acción Directo (CTA)', desc: 'Canalización clara a fecha y hora tentativa en cada conversación generada.' },
                        { num: '04', title: 'Seguimiento a las 24h y 72h', desc: 'Protocolo de reactivación respetuoso si el paciente no responde al primer mensaje.' },
                        { num: '05', title: 'Registro en Pipeline CRM', desc: 'Clasificación en estados: Convertido, En seguimiento o No interesado.' },
                        { num: '06', title: 'Reporte Mensual de Métricas', desc: 'Monitoreo de mensajes recibidos vs. consultas agendadas y efectividad médica.' }
                    ].map((step, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                            <span className="text-xl font-black text-emerald-400 font-mono">{step.num}</span>
                            <div>
                                <h5 className="text-xs font-black text-white uppercase mb-1">{step.title}</h5>
                                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 10. SIMULADOR INTERACTIVO DE PROYECCIÓN DE ROI MÉDICO */}
            <div className="bg-[#0E0E18] border border-indigo-500/30 p-8 sm:p-12 rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                            <Calculator className="w-4 h-4" /> Simulador en Tiempo Real (Especialistas & Clínicas)
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                            10. Proyección de Retorno de Inversión (ROI)
                        </h3>
                        <p className="text-xs text-gray-400 font-medium mt-1">
                            Fórmula Oficial: <code className="text-indigo-300 font-mono bg-white/5 px-2 py-0.5 rounded">ROI = ((Ingresos Generados - Costo de Marketing) ÷ Costo de Marketing) × 100</code>
                        </p>
                    </div>
                </div>

                {/* Interactive Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-6 space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-black text-gray-300">
                                <span>Mensajes Recibidos al Mes (WhatsApp / Redes):</span>
                                <span className="text-indigo-400 font-bold">{monthlyMessages} mensajes</span>
                            </div>
                            <input
                                type="range"
                                min="20"
                                max="200"
                                step="10"
                                value={monthlyMessages}
                                onChange={(e) => setMonthlyMessages(Number(e.target.value))}
                                className="w-full accent-indigo-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-gray-600 font-bold">
                                <span>20 msgs</span>
                                <span>40 (Ejemplo Base Nivel 1)</span>
                                <span>200 msgs</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-black text-gray-300">
                                <span>Tasa de Conversión a Consulta Agendada:</span>
                                <span className="text-emerald-400 font-bold">{conversionRate}% ({calculatedPatients} pacientes nuevos)</span>
                            </div>
                            <input
                                type="range"
                                min="15"
                                max="50"
                                step="5"
                                value={conversionRate}
                                onChange={(e) => setConversionRate(Number(e.target.value))}
                                className="w-full accent-emerald-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-gray-600 font-bold">
                                <span>15%</span>
                                <span>30% (Meta Estándar DIIC)</span>
                                <span>50%</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-black text-gray-300">
                                <span>Valor Promedio de Consulta Médica:</span>
                                <span className="text-white font-bold">${consultationFee} USD</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[30, 40, 50, 80].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setConsultationFee(val)}
                                        className={`py-2 rounded-xl text-xs font-bold transition-all ${consultationFee === val ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                                    >
                                        ${val} USD
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Optional Procedures add-on */}
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                            <div className="flex justify-between items-center text-xs font-black text-gray-300">
                                <span className="text-indigo-300">Procedimientos / Cirugías Derivadas ({procedureRate}% de pacientes):</span>
                                <span className="text-purple-400 font-bold">{procedurePatients} procedimientos</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-gray-500 font-bold block mb-1">% que requiere procedimiento</label>
                                    <select
                                        value={procedureRate}
                                        onChange={(e) => setProcedureRate(Number(e.target.value))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none"
                                    >
                                        <option value="0" className="bg-[#0E0E18]">0% (Solo consultas)</option>
                                        <option value="15" className="bg-[#0E0E18]">15% (Especialidad estándar)</option>
                                        <option value="25" className="bg-[#0E0E18]">25% (Quirúrgica / Estética)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Ticket Promedio Procedimiento</label>
                                    <select
                                        value={procedureFee}
                                        onChange={(e) => setProcedureFee(Number(e.target.value))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none"
                                    >
                                        <option value="150" className="bg-[#0E0E18]">$150 USD (Menor)</option>
                                        <option value="300" className="bg-[#0E0E18]">$300 USD (Medio)</option>
                                        <option value="600" className="bg-[#0E0E18]">$600 USD (Mayor)</option>
                                        <option value="1200" className="bg-[#0E0E18]">$1,200 USD (Alta Complejidad)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Nivel DIIC ZONE Seleccionado</label>
                            <div className="grid grid-cols-5 gap-1.5">
                                {[
                                    { name: 'N1', price: 350 },
                                    { name: 'N2', price: 500 },
                                    { name: 'N3', price: 700 },
                                    { name: 'N4', price: 999 },
                                    { name: 'N5', price: 1500 }
                                ].map((tier) => (
                                    <button
                                        key={tier.price}
                                        onClick={() => setSelectedTierPrice(tier.price)}
                                        className={`py-2 rounded-xl text-center transition-all ${selectedTierPrice === tier.price ? 'bg-emerald-500 text-black font-black' : 'bg-white/5 text-gray-400 hover:text-white text-xs font-bold'}`}
                                    >
                                        <div className="text-[9px] uppercase">{tier.name}</div>
                                        <div>${tier.price}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Dashboard */}
                    <div className="lg:col-span-6 bg-gradient-to-br from-indigo-950/40 via-black to-purple-950/30 border border-indigo-500/30 p-8 rounded-3xl space-y-6 shadow-2xl">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Consultas Agendadas</span>
                                <span className="text-2xl font-black text-white">{calculatedPatients} pacientes</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block">Ingresos Consultas</span>
                                <span className="text-2xl font-black text-emerald-400">${consultationIncome.toLocaleString()} USD</span>
                            </div>
                        </div>

                        {procedureIncome > 0 && (
                            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex justify-between items-center text-xs">
                                <div>
                                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block">Procedimientos Derivados ({procedurePatients})</span>
                                    <span className="text-lg font-black text-white">+${procedureIncome.toLocaleString()} USD</span>
                                </div>
                                <span className="text-xs text-purple-300 font-bold bg-purple-500/20 px-3 py-1 rounded-full">Valor Agregado</span>
                            </div>
                        )}

                        <div className="space-y-3 border-t border-b border-white/10 py-4 text-xs font-medium text-gray-300">
                            <div className="flex justify-between">
                                <span>Ingreso Bruto Total Estimado:</span>
                                <span className="text-emerald-400 font-bold">${totalGrossIncome.toLocaleString()} USD</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Inversión en Marketing DIIC ZONE:</span>
                                <span className="text-gray-400 font-bold">${totalMarketingCost.toLocaleString()} USD</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Utilidad Neta Generada</span>
                                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                    {netProfit >= 0 ? `+$${netProfit.toLocaleString()}` : `-$${Math.abs(netProfit).toLocaleString()}`} <span className="text-xs text-gray-500 font-normal">USD</span>
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Retorno Proyectado (ROI)</span>
                                <span className={`text-2xl sm:text-3xl font-black font-mono ${roiPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {roiPercentage >= 0 ? `+${roiPercentage}%` : `${roiPercentage}%`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 11. GESTIÓN DE PAUTA PUBLICITARIA — A PARTIR DEL NIVEL 2 */}
            <div className="bg-[#0E0E18] border border-white/5 p-8 sm:p-12 rounded-[3.5rem] space-y-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Comisiones Transparentes</span>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                            11. Gestión de Pauta Publicitaria — A partir del Nivel 2
                        </h3>
                    </div>
                </div>

                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    DIIC ZONE cobra un porcentaje sobre el presupuesto de pauta invertido — <strong className="text-white">nunca un monto fijo</strong>. El porcentaje baja conforme el presupuesto sube:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {adTiers.map((tier, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                            <span className="text-xs font-black text-white block">{tier.spend}</span>
                            <span className="text-sm font-bold text-indigo-400 block">{tier.fee}</span>
                        </div>
                    ))}
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4 text-xs text-gray-400 font-medium italic">
                    <Shield className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>
                        <strong className="text-white font-bold">Aclaración de Transparencia:</strong> El presupuesto de pauta en sí se paga directamente a Meta o Google desde la tarjeta del médico — DIIC ZONE cobra exclusivamente por la estrategia, segmentación médica ética, diseño de creatividades y optimización de la campaña.
                    </span>
                </div>
            </div>
        </div>
    );
}

function RealEstateDossier() {
    // --- SIMULADOR DE ROI INTERACTIVO (MERCADO ECUADOR) ---
    const [adBudget, setAdBudget] = useState(160);
    const [avgCpl, setAvgCpl] = useState(8);
    const [propertyPrice, setPropertyPrice] = useState(80000);
    const [commissionRate, setCommissionRate] = useState(3);
    const [selectedTierPrice, setSelectedTierPrice] = useState(500);

    const calculatedLeads = Math.max(1, Math.round(adBudget / avgCpl));
    const calculatedVisits = Math.max(1, Math.round(calculatedLeads * 0.3));
    // Estimación de cierre: 1 cada 20 leads calificados
    const estimatedClosings = Math.max(1, Math.floor(calculatedLeads / 20));
    const commissionGrossIncome = estimatedClosings * (propertyPrice * (commissionRate / 100));
    const totalMarketingCost = adBudget + selectedTierPrice;
    const netProfit = commissionGrossIncome - totalMarketingCost;
    const roiPercentage = totalMarketingCost > 0 ? Math.round((netProfit / totalMarketingCost) * 100) : 0;

    const dimensions = [
        {
            num: '01',
            title: 'Identidad de Marca del Asesor',
            desc: 'Quién es usted, su estilo distintivo y la narrativa que lo separa de la competencia.',
            icon: Sparkles,
            color: 'from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30'
        },
        {
            num: '02',
            title: 'Autoridad de Mercado y Zona',
            desc: 'Posicionamiento como el profesional que mejor domina los precios y oportunidades del sector.',
            icon: Award,
            color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30'
        },
        {
            num: '03',
            title: 'Transparencia y Confianza',
            desc: 'Factor decisivo en transacciones de alto valor económico como la compra de una vivienda.',
            icon: Shield,
            color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
        },
        {
            num: '04',
            title: 'Diversificación de Servicios',
            desc: 'Venta de estrenar, reventa, arriendo y asesoría integral de inversión patrimonial.',
            icon: Compass,
            color: 'from-orange-500/20 to-yellow-500/20 text-orange-400 border-orange-500/30'
        },
        {
            num: '05',
            title: 'Credibilidad y Validación Social',
            desc: 'Testimonios en video, reseñas de clientes satisfechos y presencia en medios digitales.',
            icon: Star,
            color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
        }
    ];

    const channels = [
        {
            name: 'Instagram',
            role: 'La Vitrina Principal',
            desc: 'Tours cinematográficos, fotos estéticas y presencia de marca personal.',
            badge: 'Branding & Listings',
            color: 'border-pink-500/30 bg-pink-500/5 text-pink-400'
        },
        {
            name: 'Facebook',
            role: 'Comunidad & Urgencia',
            desc: 'Grupos zonales y publicaciones de "Recién Vendido" para detonar urgencia.',
            badge: 'Comunidad Local',
            color: 'border-blue-500/30 bg-blue-500/5 text-blue-400'
        },
        {
            name: 'TikTok',
            role: 'Alcance Masivo',
            desc: 'Recorridos rápidos tipo House Tour dinámico y contenido viral del sector.',
            badge: 'Viralidad Orgánica',
            color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
        },
        {
            name: 'YouTube',
            role: 'Tours Completos 4K',
            desc: 'Recorridos detallados para compradores e inversionistas de alta intención.',
            badge: 'Alta Intención',
            color: 'border-red-500/30 bg-red-500/5 text-red-400'
        },
        {
            name: 'WhatsApp',
            role: 'Canal de Conversión',
            desc: 'Donde se califica el presupuesto y se agenda la visita guiada a la propiedad.',
            badge: 'Cierres & Agendamiento',
            color: 'border-green-500/30 bg-green-500/5 text-green-400'
        },
        {
            name: 'Google SEO',
            role: 'Búsqueda Activa Local',
            desc: 'Posicionamiento para "casa en venta + zona" y departamentos nuevos.',
            badge: 'SEO & Google Ads',
            color: 'border-amber-500/30 bg-amber-500/5 text-amber-400'
        }
    ];

    const roadmapLevels = [
        {
            level: 'Nivel 1',
            name: 'Presencia Digital',
            price: '$350',
            complexity: 'Baja',
            objective: 'Dar a conocer catálogo y generar confianza básica en la zona.',
            color: 'border-blue-500/40 text-blue-400'
        },
        {
            level: 'Nivel 2',
            name: 'Estrategia',
            price: '$500',
            complexity: 'Media',
            objective: 'Captación activa de leads con landing pages por propiedad.',
            color: 'border-purple-500/40 text-purple-400'
        },
        {
            level: 'Nivel 3',
            name: 'Marca',
            price: '$700',
            complexity: 'Alta',
            objective: 'Posicionar como el/la asesor/a #1 de la zona con tours de dron.',
            color: 'border-indigo-500/40 text-indigo-400'
        },
        {
            level: 'Nivel 4',
            name: 'Automatización',
            price: '$999',
            complexity: 'Avanzada',
            objective: 'Bot de WhatsApp 24/7 y CRM de propiedades para filtrar leads.',
            color: 'border-emerald-500/40 text-emerald-400'
        },
        {
            level: 'Nivel 5',
            name: 'Escala',
            price: '$1,500',
            complexity: 'Maestro',
            objective: 'Dominar múltiples sectores y maximizar volumen de comisiones.',
            color: 'border-amber-500/40 text-amber-400'
        }
    ];

    const priceLadder = [
        { from: 'Presencia', to: 'Estrategia', desc: 'Se activan landing pages y captación de leads por propiedad.' },
        { from: 'Estrategia', to: 'Marca', desc: 'Se suman video tours cinematográficos y testimonios en video.' },
        { from: 'Marca', to: 'Automatización', desc: 'Se integra el bot de WhatsApp y el CRM de propiedades.' },
        { from: 'Automatización', to: 'Escala', desc: 'Se domina múltiples zonas y se maximizan comisiones.' }
    ];

    const adTiers = [
        { spend: 'Hasta $100/mes de pauta', fee: '20% de comisión (mínimo $20)' },
        { spend: '$101 – $200/mes', fee: '15% de comisión' },
        { spend: '$201 – $500/mes', fee: '12% de comisión' },
        { spend: '$500/mes en adelante', fee: '10% de comisión' }
    ];

    return (
        <div className="space-y-16 relative z-10 pt-12 pb-16">
            {/* 1. HEADER & MANIFIESTO ESTRATÉGICO */}
            <div className="bg-gradient-to-br from-indigo-900/30 via-[#0E0E18] to-purple-900/20 border border-indigo-500/30 p-8 sm:p-12 rounded-[3.5rem] shadow-[0_30px_100px_rgba(99,102,241,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30">
                                <Home className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
                                SISTEMA DE CRECIMIENTO INMOBILIARIO DIIC ZONE 2026
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                            Marketing Digital Inmobiliario
                        </h2>
                        <p className="text-sm text-gray-400 font-medium mt-1">
                            Propuesta Estratégica de Crecimiento & Monetización para Asesores y Brokers
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <div className="text-right">
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Meta de Conversión</span>
                            <span className="text-xs font-black text-emerald-400">30% Mensaje a Visita Agendada</span>
                        </div>
                    </div>
                </div>

                {/* POR QUÉ ESTO IMPORTA & MISIÓN/VISIÓN */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Eye className="w-4 h-4" /> 1. Por Qué Esto Importa
                            </h3>
                            <p className="text-sm font-bold text-white leading-relaxed">
                                El <strong className="text-emerald-400 font-black">97% de los compradores de vivienda</strong> utiliza internet en su búsqueda antes de contactar a un agente inmobiliario.
                            </p>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                Buscan primero en Google y redes sociales — <span className="text-gray-300 italic">"casa en venta en Santo Domingo"</span>, <span className="text-gray-300 italic">"departamento nuevo norte"</span> — y solo después llaman. Si usted no aparece en ese momento de búsqueda, ese comprador simplemente no sabe que existe como opción.
                            </p>
                            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-200 leading-relaxed">
                                <strong className="font-black text-white">El Gran Diferenciador:</strong> Hoy el valor ya no es el listado de propiedades (todos publican en Plusvalía o Mercado Libre). El verdadero diferenciador es cómo el comprador <span className="text-emerald-400 font-bold underline">te encuentra a ti</span> antes de llegar a esos portales genéricos.
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 bg-black/40 border border-white/5 p-6 rounded-3xl space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
                            2. Misión, Visión y Objetivo
                        </h3>
                        <div className="space-y-3">
                            <div className="border-l-2 border-indigo-500 pl-4 py-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block">Misión</span>
                                <p className="text-xs text-gray-300 font-medium leading-snug">
                                    Conectar al asesor con compradores calificados antes de que lleguen a portales genéricos, construyendo una marca personal de confianza.
                                </p>
                            </div>
                            <div className="border-l-2 border-purple-500 pl-4 py-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-purple-400 block">Visión</span>
                                <p className="text-xs text-gray-300 font-medium leading-snug">
                                    Ser reconocido/a como el/la asesor/a de referencia indiscutible en su zona de trabajo.
                                </p>
                            </div>
                            <div className="border-l-2 border-emerald-500 pl-4 py-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block">Objetivo Principal</span>
                                <p className="text-xs text-gray-300 font-medium leading-snug">
                                    Generar presencia digital sólida que traduzca seguidores en visitas agendadas y cierres reales de compraventa.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. LAS 5 DIMENSIONES DE LA MARCA INMOBILIARIA */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] whitespace-nowrap">
                        3. Las 5 Dimensiones de la Marca Inmobiliaria
                    </h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {dimensions.map((dim, i) => {
                        const Icon = dim.icon;
                        return (
                            <motion.div
                                key={i}
                                whileHover={{ y: -6 }}
                                className="bg-[#0E0E18] border border-white/5 hover:border-white/15 p-6 rounded-[2rem] flex flex-col justify-between transition-all duration-300 relative overflow-hidden group"
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-black text-gray-700 group-hover:text-indigo-400 font-mono transition-colors">
                                            {dim.num}
                                        </span>
                                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${dim.color} border`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-wider leading-snug">
                                        {dim.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                        {dim.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* 4. ESTUDIO DE MERCADO & 5. QUÉ INCLUYE EL SERVICIO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 4. Estudio de Mercado */}
                <div className="bg-[#0E0E18] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/5 rounded-2xl text-yellow-400">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Investigación Previa</span>
                            <h3 className="text-lg font-black text-white uppercase tracking-wide">4. Estudio de Mercado</h3>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                        Lo que nuestro equipo investiga exhaustivamente antes de producir la primera pieza de contenido:
                    </p>
                    <div className="space-y-3">
                        {[
                            { label: 'Competencia Directa', desc: 'Otros agentes e inmobiliarias activos en su zona de enfoque.' },
                            { label: 'Demanda Real', desc: 'Qué busca la gente ("casa en venta + zona", "departamento nuevo").' },
                            { label: 'Precio de Mercado / m²', desc: 'Valores por metro cuadrado y plusvalía por sector.' },
                            { label: 'Perfil del Comprador Ideal', desc: 'Presupuesto, urgencia de compra y tipo de crédito (BIESS/Bancos).' },
                            { label: 'Estado de Redes Actuales', desc: 'Auditoría integral si ya cuenta con perfiles creados.' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h5 className="text-xs font-black text-white">{item.label}</h5>
                                    <p className="text-[11px] text-gray-500 font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Qué Incluye el Servicio */}
                <div className="bg-[#0E0E18] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/5 rounded-2xl text-indigo-400">
                            <Film className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Entregables de Calidad</span>
                            <h3 className="text-lg font-black text-white uppercase tracking-wide">5. Qué Incluye el Servicio</h3>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-indigo-400">
                                <Film className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-wider text-white">Audiovisual Pro</span>
                            </div>
                            <ul className="text-[11px] text-gray-500 font-medium space-y-1">
                                <li>• Tours cinematográficos 4K</li>
                                <li>• Videos testimoniales</li>
                                <li>• Recorridos aéreos con dron</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-purple-400">
                                <ImageIcon className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-wider text-white">Fotografía Pro</span>
                            </div>
                            <ul className="text-[11px] text-gray-500 font-medium space-y-1">
                                <li>• Interior y exterior por listing</li>
                                <li>• Puntos de interés y zona</li>
                                <li>• Fotos antes / después</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <Megaphone className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-wider text-white">Gestión de Redes</span>
                            </div>
                            <ul className="text-[11px] text-gray-500 font-medium space-y-1">
                                <li>• Creación y optimización bio</li>
                                <li>• Vitrina digital permanente</li>
                                <li>• Copywriting persuasivo mensual</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-yellow-400">
                                <Zap className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-wider text-white">Automatización & Ads</span>
                            </div>
                            <ul className="text-[11px] text-gray-500 font-medium space-y-1">
                                <li>• Bot de WhatsApp 24/7</li>
                                <li>• Gestión de campañas Meta</li>
                                <li>• Calificación automática</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. CANALES DE COMUNICACIÓN */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] whitespace-nowrap">
                        6. Ecosistema de Canales de Comunicación
                    </h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {channels.map((chan, i) => (
                        <div
                            key={i}
                            className={`p-6 rounded-[2rem] bg-[#0E0E18] border ${chan.color} flex flex-col justify-between space-y-4`}
                        >
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-lg font-black text-white">{chan.name}</h4>
                                    <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                        {chan.badge}
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-indigo-300 italic mb-2">{chan.role}</p>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed">{chan.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 7 & 8. EL MAPA DE RUTA DE 5 NIVELES & ESCALERA DE VALOR */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] whitespace-nowrap">
                        7. El Mapa de Ruta — Sistema DIIC ZONE de 5 Niveles
                    </h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {roadmapLevels.map((lvl, i) => (
                        <div
                            key={i}
                            className={`p-6 rounded-[2.5rem] bg-[#0E0E18] border ${lvl.color} flex flex-col justify-between relative overflow-hidden`}
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{lvl.level}</span>
                                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-white">
                                        {lvl.complexity}
                                    </span>
                                </div>
                                <h4 className="text-base font-black text-white uppercase">{lvl.name}</h4>
                                <p className="text-2xl font-black text-white tracking-tight">{lvl.price}<span className="text-xs text-gray-500 font-medium">/mes</span></p>
                                <div className="h-px bg-white/5 w-full" />
                                <p className="text-xs text-gray-400 font-medium leading-relaxed">{lvl.objective}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-xs text-gray-400 font-medium italic">
                        ✦ <strong className="text-white font-bold">Revisión de ruta:</strong> A los 3 meses iniciales del Nivel 1, se evalúan los resultados en conjunto para definir el avance a Nivel 2 (Estrategia). El avance nunca es automático, se acuerda por escrito entre ambas partes.
                    </p>
                </div>

                {/* 8. Por qué sube el precio */}
                <div className="bg-[#0E0E18] border border-white/5 p-8 rounded-[3rem] space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Escalera de Valor</span>
                            <h3 className="text-xl font-black text-white uppercase tracking-wide">8. Por Qué Sube el Precio en Cada Nivel</h3>
                        </div>
                        <div className="px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
                            Principio de Utilidad Mutua
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {priceLadder.map((step, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-black text-indigo-400">
                                    <span>{step.from}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-white">{step.to}</span>
                                </div>
                                <p className="text-xs text-gray-400 font-medium leading-snug">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 text-center">
                        <h4 className="text-base font-black text-white uppercase italic tracking-wide">
                            “Usted nunca paga más por lo mismo — paga más porque el sistema hace más por su negocio.”
                        </h4>
                    </div>
                </div>
            </div>

            {/* 9. SISTEMA DE CONVERSIÓN (DE MENSAJE A VISITA AGENDADA) */}
            <div className="bg-gradient-to-br from-[#0E0E18] via-[#0E0E18] to-emerald-950/20 border border-emerald-500/30 p-8 sm:p-12 rounded-[3.5rem] space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                            <Clock className="w-4 h-4" /> Protocolo de Respuesta Inmediata
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                            9. Sistema de Conversión — De Mensaje a Visita Agendada
                        </h3>
                    </div>
                    <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-black uppercase tracking-wider">
                        Meta: 30% Conversión
                    </div>
                </div>

                <p className="text-xs text-gray-400 font-medium">
                    Así se trabaja cada contacto recibido para garantizar que los leads de redes sociales se transformen en citas presenciales:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { num: '01', title: 'Respuesta < 2 Horas — Siempre', desc: 'El 80% de los compradores contacta a otro agente si no recibe respuesta rápida.' },
                        { num: '02', title: 'Calificación Inmediata del Lead', desc: 'Filtro de presupuesto, zona de interés, urgencia y tipo de financiamiento.' },
                        { num: '03', title: 'Llamado a la Acción Directo (CTA)', desc: 'Canalización directa a agendar visita en cada conversación generada.' },
                        { num: '04', title: 'Seguimiento a las 24h y 72h', desc: 'Protocolo de reactivación si el prospecto no responde al primer contacto.' },
                        { num: '05', title: 'Registro en Pipeline CRM', desc: 'Clasificación en estados: Visitado, En seguimiento o No calificado.' },
                        { num: '06', title: 'Reporte Mensual de Cierres', desc: 'Monitoreo de leads recibidos, visitas guiadas y comisiones logradas.' }
                    ].map((step, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                            <span className="text-xl font-black text-emerald-400 font-mono">{step.num}</span>
                            <div>
                                <h5 className="text-xs font-black text-white uppercase mb-1">{step.title}</h5>
                                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 10. SIMULADOR INTERACTIVO DE PROYECCIÓN DE ROI */}
            <div className="bg-[#0E0E18] border border-indigo-500/30 p-8 sm:p-12 rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                            <Calculator className="w-4 h-4" /> Simulador en Tiempo Real (Ecuador)
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                            10. Proyección de Retorno de Inversión (ROI)
                        </h3>
                        <p className="text-xs text-gray-400 font-medium mt-1">
                            Fórmula Oficial: <code className="text-indigo-300 font-mono bg-white/5 px-2 py-0.5 rounded">ROI = ((Ingresos por Comisión - Costo de Marketing) ÷ Costo de Marketing) × 100</code>
                        </p>
                    </div>
                </div>

                {/* Interactive Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-6 space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-black text-gray-300">
                                <span>Inversión Mensual en Pauta (Ads):</span>
                                <span className="text-indigo-400">${adBudget} USD</span>
                            </div>
                            <input
                                type="range"
                                min="80"
                                max="1000"
                                step="20"
                                value={adBudget}
                                onChange={(e) => setAdBudget(Number(e.target.value))}
                                className="w-full accent-indigo-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-gray-600 font-bold">
                                <span>$80 USD</span>
                                <span>$160 (Recomendado)</span>
                                <span>$1,000 USD</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-black text-gray-300">
                                <span>Precio Promedio del Inmueble:</span>
                                <span className="text-emerald-400">${propertyPrice.toLocaleString()} USD</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[60000, 80000, 120000, 200000].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setPropertyPrice(val)}
                                        className={`py-2 rounded-xl text-xs font-bold transition-all ${propertyPrice === val ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                                    >
                                        ${val / 1000}k
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Costo por Lead (CPL)</label>
                                <select
                                    value={avgCpl}
                                    onChange={(e) => setAvgCpl(Number(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-bold focus:border-indigo-500 focus:outline-none"
                                >
                                    <option value="4" className="bg-[#0E0E18]">$4 USD (Vivienda Social/Media)</option>
                                    <option value="8" className="bg-[#0E0E18]">$8 USD (Promedio Ecuador)</option>
                                    <option value="12" className="bg-[#0E0E18]">$12 USD (Alta Gama / Lujo)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Comisión Asesor (%)</label>
                                <select
                                    value={commissionRate}
                                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-bold focus:border-indigo-500 focus:outline-none"
                                >
                                    <option value="3" className="bg-[#0E0E18]">3% (Estándar Inmobiliario)</option>
                                    <option value="4" className="bg-[#0E0E18]">4% (Exclusivas)</option>
                                    <option value="5" className="bg-[#0E0E18]">5% (Proyectos Nuevos)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Nivel DIIC ZONE Seleccionado</label>
                            <div className="grid grid-cols-5 gap-1.5">
                                {[
                                    { name: 'N1', price: 350 },
                                    { name: 'N2', price: 500 },
                                    { name: 'N3', price: 700 },
                                    { name: 'N4', price: 999 },
                                    { name: 'N5', price: 1500 }
                                ].map((tier) => (
                                    <button
                                        key={tier.price}
                                        onClick={() => setSelectedTierPrice(tier.price)}
                                        className={`py-2 rounded-xl text-center transition-all ${selectedTierPrice === tier.price ? 'bg-emerald-500 text-black font-black' : 'bg-white/5 text-gray-400 hover:text-white text-xs font-bold'}`}
                                    >
                                        <div className="text-[9px] uppercase">{tier.name}</div>
                                        <div>${tier.price}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Dashboard */}
                    <div className="lg:col-span-6 bg-gradient-to-br from-indigo-950/40 via-black to-purple-950/30 border border-indigo-500/30 p-8 rounded-3xl space-y-6 shadow-2xl">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Leads Generados</span>
                                <span className="text-2xl font-black text-white">{calculatedLeads} leads</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block">Visitas Agendadas (30%)</span>
                                <span className="text-2xl font-black text-emerald-400">{calculatedVisits} visitas</span>
                            </div>
                        </div>

                        <div className="space-y-3 border-t border-b border-white/10 py-4 text-xs font-medium text-gray-300">
                            <div className="flex justify-between">
                                <span>Cierres Estimados (1 de cada 20 leads):</span>
                                <span className="text-white font-bold">{estimatedClosings} venta</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Ingreso Bruto por Comisión:</span>
                                <span className="text-emerald-400 font-bold">${commissionGrossIncome.toLocaleString()} USD</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Costo Total Marketing (Pauta + Plan DIIC):</span>
                                <span className="text-gray-400 font-bold">${totalMarketingCost.toLocaleString()} USD</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Utilidad Neta Generada</span>
                                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                    +${netProfit.toLocaleString()} <span className="text-xs text-gray-500 font-normal">USD</span>
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Retorno Proyectado (ROI)</span>
                                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                                    +{roiPercentage}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 11. GESTIÓN DE PAUTA PUBLICITARIA — A PARTIR DEL NIVEL 2 */}
            <div className="bg-[#0E0E18] border border-white/5 p-8 sm:p-12 rounded-[3.5rem] space-y-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Comisiones Transparentes</span>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                            11. Gestión de Pauta Publicitaria — A partir del Nivel 2
                        </h3>
                    </div>
                </div>

                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    DIIC ZONE cobra un porcentaje sobre el presupuesto de pauta invertido — <strong className="text-white">nunca un monto fijo</strong>. El porcentaje baja conforme el presupuesto sube:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {adTiers.map((tier, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                            <span className="text-xs font-black text-white block">{tier.spend}</span>
                            <span className="text-sm font-bold text-indigo-400 block">{tier.fee}</span>
                        </div>
                    ))}
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4 text-xs text-gray-400 font-medium italic">
                    <Shield className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>
                        <strong className="text-white font-bold">Aclaración de Transparencia:</strong> El presupuesto de pauta en sí se paga directamente a Meta o Google desde la tarjeta de crédito del cliente — DIIC ZONE cobra exclusivamente por la estrategia, segmentación, diseño de creatividades y optimización técnica de la campaña.
                    </span>
                </div>
            </div>
        </div>
    );
}
