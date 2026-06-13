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
    HeartHandshake, Store, Truck, Plane, MoreHorizontal, Mic, Sprout, ShoppingBag, Croissant
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
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">God Mode Dashboard v5.0 — Estrategia de Precios 2026</p>
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
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 relative z-10">
                    {services
                        .filter(s => s.category === activeCategory)
                        .map((service, index) => {
                            const resolvedNiche = selectedNiche === 'doctor' ? 'medical' :
                                                  selectedNiche === 'health' ? 'hospital' :
                                                  selectedNiche === 'education' ? 'educativo' :
                                                  selectedNiche === 'horeca' ? 'hospitality' : selectedNiche;
                            const nichePlan = NICHE_DETAILS[resolvedNiche]?.plans[service.id];
                            const customizedService = nichePlan ? {
                                ...service,
                                name: nichePlan.name,
                                narrative: nichePlan.narrative,
                                price: nichePlan.price || service.price,
                                originalPrice: nichePlan.originalPrice || null,
                                features: nichePlan.features || service.features,
                                enfoque: nichePlan.enfoque || service.enfoque,
                                filmmaker: nichePlan.filmmaker || service.filmmaker
                            } : service;

                            return activeCategory === 'plan' ? (
                                <PricingCard
                                    key={service.id}
                                    service={customizedService}
                                    index={index}
                                    onSelect={() => handleSelectPlan(customizedService)}
                                />
                            ) : (
                                <PackCard 
                                    key={service.id}
                                    service={service}
                                    index={index}
                                    onSelect={() => handleSelectPlan(service)}
                                />
                            );
                        })
                    }
                </div>
            )}
            
            {/* New Sections */}
            <ServiceDetails />
            {selectedNiche === 'medical' && <MedicalRoadmap />}
            <PaidAdvertising />

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
    const icons = [Shield, Zap, Crown, Star];
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
                    </div>

                </div>
            </div>
        </div>
    );
}

function MedicalRoadmap() {
    const steps = [
        {
            month: "Mes 1",
            title: "Cimiento & Confianza",
            objective: "Objetivo: Diseñar y estructurar la identidad digital del médico, eliminando la desconfianza del paciente.",
            details: [
                "Sesión fotográfica premium en consultorio (médico, equipo e instalaciones).",
                "Optimización completa de perfiles (bio clínica y diseño de Grid Estético).",
                "Estrategia de contenidos y copywriting enfocado en empatía y profesionalismo.",
                "Creación del manual de identidad de marca para redes sociales."
            ],
            metric: "Calidad de Imagen & Optimización de Bio",
            icon: Shield,
            color: "from-blue-500/20 to-indigo-500/20 border-indigo-500/30 text-indigo-400"
        },
        {
            month: "Mes 2",
            title: "Crecimiento & Tráfico",
            objective: "Objetivo: Generar un flujo constante de consultas activando anuncios y produciendo video de valor.",
            details: [
                "Edición de videos profesionales en formato vertical (información y tips médicos).",
                "Puesta en marcha de campañas Meta Ads segmentadas a pacientes ideales de la zona.",
                "Grabación y edición de procedimientos clínicos y testimonios en consultorio.",
                "Configuración de respuestas rápidas y canalización directa a WhatsApp."
            ],
            metric: "Costo por Consulta en WhatsApp (CPL)",
            icon: Target,
            color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400"
        },
        {
            month: "Mes 3",
            title: "Autoridad & Posicionamiento",
            objective: "Objetivo: Consolidar al médico como el referente #1 de su especialidad en la región.",
            details: [
                "Producción de testimonios detallados de pacientes recuperados (casos complejos).",
                "Campañas de Google Ads de alta intención (búsqueda activa de cirugías/procedimientos).",
                "Automatización del embudo de agendamiento y recordatorios automáticos de citas.",
                "Lanzamiento de minidocumental sobre la trayectoria y profesionalismo del médico."
            ],
            metric: "Tasa de Agendamiento Final & ROAS",
            icon: Crown,
            color: "from-orange-500/20 to-yellow-500/20 border-orange-500/30 text-orange-400"
        }
    ];

    return (
        <div className="space-y-12 relative z-10 pt-10">
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5" />
                <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] whitespace-nowrap">Ruta Crítica de Crecimiento</h2>
                <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="mb-10 text-center md:text-left">
                <h3 className="text-3xl font-black text-white tracking-tighter mb-4">¿Cómo construimos tu marca sólida en 3 meses?</h3>
                <p className="text-sm text-gray-500 font-medium max-w-2xl leading-relaxed">
                    Un plan estructurado diseñado específicamente para el sector salud. Cada mes tiene metas claras para transformar tu reputación digital en consultas y cirugías reales.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {steps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-[2.5rem] bg-[#0E0E18] border border-white/5 flex flex-col justify-between h-full relative overflow-hidden group hover:border-white/10 transition-all duration-300"
                        >
                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] bg-indigo-500/10 px-4 py-2 rounded-xl">
                                        {step.month}
                                    </span>
                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${step.color} border`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-black text-white uppercase tracking-wider mb-2">{step.title}</h4>
                                    <p className="text-xs font-bold text-gray-400 italic mb-4 leading-relaxed">{step.objective}</p>
                                    <div className="h-px bg-white/5 w-full my-4" />
                                    <ul className="space-y-3">
                                        {step.details.map((detail, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-xs text-gray-500 leading-relaxed font-medium">
                                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-1">
                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Métrica de Éxito Clave</span>
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">{step.metric}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

