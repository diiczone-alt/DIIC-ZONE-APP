'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trophy, ArrowRight, Zap, Target, BarChart, ChevronRight, 
    Stethoscope, Activity, Users, Shield, X, User, 
    Building2, MapPin, Briefcase, FileText, Check, 
    CreditCard, Download, Trash2, Info 
} from 'lucide-react';
import { toast } from 'sonner';
import { NICHE_DETAILS } from '@/lib/nicheDetails';

const soloAppPlan = {
    name: 'SOLO USO DE APP (BÁSICO)',
    price: 70,
    narrative: 'Acceso completo al software DIIC ZONE Internal OS. Sin servicios de marketing, pauta o filmmaker. Ideal para gestionar tu propio marketing y automatizaciones.',
    features: [
        'Acceso al software de gestión e informes',
        'Automatización básica de WhatsApp y Calendario',
        'Acceso al módulo de Inteligencia Artificial',
        'Soporte técnico por correo'
    ],
    enfoque: 'Gestión interna y software propio',
    filmmaker: 'No incluido (Solo Software)'
};

const getTrialDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function SmartRecommendationStep({ onNext, formData, updateData }) {
    const isDoctor = formData.profileType === 'doctor' || formData.profileType === 'health';

    const getFilmmakerText = (planFilmmaker) => {
        if (selectedPlanKey === 'solo_app') return 'No incluido (Solo Software)';
        const isEcuador = (formData.country || '').toLowerCase().trim() === 'ecuador';
        if (isEcuador) return planFilmmaker;
        return `En revisión / Por coordinar en ${formData.country || 'tu país'}`;
    };
    
    // --- ESTADOS LOCALES DE WIZARD ---
    // 1: Plan Selection, 2: Contract, 3: Payment, 4: Final Success
    const [localStep, setLocalStep] = useState(1);
    const [selectedPlanKey, setSelectedPlanKey] = useState('solo_app'); // 'presence', 'growth', 'authority', 'elite', 'solo_app'
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState({ cardNumber: '', expiry: '', cvv: '', cardholderName: '' });

    // --- ESTADOS Y REFS DE CANVAS PARA FIRMA ---
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [signatureImage, setSignatureImage] = useState(null);

    // --- NICHOS Y MAPEO ---
    const resolvedNiche = formData.profileType === 'doctor' ? 'medical' :
                          formData.profileType === 'health' ? 'hospital' :
                          formData.profileType === 'education' ? 'educativo' :
                          formData.profileType === 'horeca' ? 'hospitality' : formData.profileType || 'general';

    const nicheDetails = NICHE_DETAILS[resolvedNiche] || NICHE_DETAILS['general'];
    const plans = nicheDetails.plans;

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

    const businessTypeLabel = nicheNames[formData.profileType] || nicheNames[resolvedNiche] || 'Marketing Especializado';

    // --- LÓGICA DE CÁLCULO DE NIVEL SUGERIDO ---
    const calculateLevel = () => {
        const { channels, capacity } = formData;
        let score = 1;

        if (channels?.crm === 'yes') score += 1.5;
        if (channels?.booking === 'yes') score += 1;
        if (channels?.whatsapp === 'yes') score += 0.5;
        if (isDoctor) score += 0.5;

        if (channels?.crm === 'yes' && channels?.booking === 'yes') {
            return 3;
        }
        
        return Math.max(1, Math.min(Math.ceil(score), 4));
    };

    const recommendedLevel = calculateLevel();
    const planKeys = ['presence', 'growth', 'authority', 'elite'];
    const recommendedKey = planKeys[recommendedLevel - 1] || 'growth';

    // El plan inicial por defecto es 'solo_app' (Solo Uso de App) para evitar cargos accidentales
    const activePlan = selectedPlanKey === 'solo_app' ? soloAppPlan : (plans[selectedPlanKey] || plans['growth']);

    // --- MANIPULADORES DE DIBUJO ---
    const isCanvasInitialized = useRef(false);

    const initializeCanvas = () => {
        if (canvasRef.current && !isCanvasInitialized.current) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                canvas.width = rect.width;
                canvas.height = rect.height;
                isCanvasInitialized.current = true;
                
                const ctx = canvas.getContext('2d');
                ctx.strokeStyle = '#6366f1';
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
            }
        }
    };

    // Inicializar tamaño del lienzo al cargar la vista de firma
    useEffect(() => {
        if (localStep === 2) {
            isCanvasInitialized.current = false;
            const timer = setTimeout(() => {
                initializeCanvas();
            }, 300); // Esperar a que la animación de entrada de framer-motion termine
            
            // Prevenir scroll táctil al firmar en móvil
            const preventDefault = (e) => {
                if (canvasRef.current && e.target === canvasRef.current) {
                    e.preventDefault();
                }
            };
            
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.addEventListener('touchstart', preventDefault, { passive: false });
                canvas.addEventListener('touchmove', preventDefault, { passive: false });
            }
            
            return () => {
                clearTimeout(timer);
                if (canvas) {
                    canvas.removeEventListener('touchstart', preventDefault);
                    canvas.removeEventListener('touchmove', preventDefault);
                }
            };
        }
    }, [localStep]);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        initializeCanvas(); // Asegurar inicialización en el primer click
        
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
        if (isDrawing) {
            setIsDrawing(false);
            if (canvasRef.current) {
                setSignatureImage(canvasRef.current.toDataURL());
            }
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

    // --- DESCARGA DE CONTRATO ---
    const handleDownloadContract = () => {
        const clientName = formData.name || 'Cliente Titular';
        const companyName = formData.brand || 'Compañía / Marca';
        const locationStr = `${formData.city || 'Santo Domingo'}, ${formData.country || 'Ecuador'}`;

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
                            <p>${activePlan.name}</p>
                        </div>
                        <div class="grid-item">
                            <label>Inversión Mensual</label>
                            <p>$${activePlan.price} USD / mes (Tras período de prueba)</p>
                        </div>
                        <div class="grid-item">
                            <label>Período de Prueba</label>
                            <p>15 Días Gratis (Hoy pagas $0.00 USD)</p>
                        </div>
                        <div class="grid-item">
                            <label>Inicio de Facturación</label>
                            <p>${getTrialDateString()}</p>
                        </div>
                        <div class="grid-item">
                            <label>Cliente Titular</label>
                            <p>${clientName}</p>
                        </div>
                        <div class="grid-item">
                            <label>Compañía / Marca</label>
                            <p>${companyName}</p>
                        </div>
                        <div class="grid-item">
                            <label>Ubicación</label>
                            <p>${locationStr}</p>
                        </div>
                        <div class="grid-item">
                            <label>Nicho de Mercado</label>
                            <p>${businessTypeLabel}</p>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">Detalles y Entregables Incluidos en el Paquete</div>
                    <div class="clauses">
                        <p>El plan estratégico adquirido incluye los siguientes servicios y entregables detallados para la optimización de los canales digitales:</p>
                        <ul style="padding-left: 20px; line-height: 1.8; font-size: 13px;">
                            ${activePlan.features ? activePlan.features.map(f => `<li><strong>${f}</strong></li>`).join('') : ''}
                        </ul>
                        <p style="margin-top: 15px; font-size: 13px;"><strong>Enfoque Estratégico principal:</strong> ${activePlan.enfoque}</p>
                        <p style="font-size: 13px;"><strong>Cobertura Audiovisual (Filmmaker):</strong> ${getFilmmakerText(activePlan.filmmaker)}</p>
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
                        <div class="signature-line">EL CLIENTE (${clientName})</div>
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
        a.download = `contrato_diic_${companyName.toLowerCase().replace(/\s+/g, '_')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Contrato descargado exitosamente');
    };

    return (
        <div className="w-full flex flex-col justify-between min-h-[480px]">
            <AnimatePresence mode="wait">
                {localStep === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6 flex-1 flex flex-col justify-center"
                    >
                        <div className="space-y-2 text-center">
                            <span className="block text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Análisis Algorítmico Final</span>
                            <h2 className="text-3xl font-black tracking-tight uppercase italic text-white leading-none">
                                Elige tu <span className="text-indigo-500">Nivel de Crecimiento</span>
                            </h2>
                            <p className="text-gray-400 text-xs max-w-lg mx-auto">
                                Nuestro sistema sugiere el <span className="text-indigo-400 font-bold uppercase">Nivel {recommendedLevel}</span> en base a tu madurez técnica, pero puedes seleccionar el nivel de pauta y producción ideal para tu ritmo actual.
                            </p>
                        </div>

                        {/* Free Trial Premium Banner */}
                        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between gap-4 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                                    <Zap className="w-4 h-4 text-indigo-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-black uppercase text-[10px] tracking-wider">Período de Prueba de 15 Días Gratis</p>
                                    <p className="text-gray-400 text-[9px] font-medium leading-none mt-1">Todos los niveles incluyen prueba gratuita. Hoy pagas $0.00 USD.</p>
                                </div>
                            </div>
                            <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full leading-none">
                                Activo
                            </span>
                        </div>

                        {/* NICHE PLAN CARD SELECTOR */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                            {planKeys.map((key, idx) => {
                                const plan = plans[key];
                                const isRecommended = key === recommendedKey;
                                const isSelected = key === selectedPlanKey;
                                
                                return (
                                    <div
                                        key={key}
                                        onClick={() => setSelectedPlanKey(key)}
                                        className={`p-6 rounded-3xl border transition-all text-left cursor-pointer relative flex flex-col justify-between group backdrop-blur-md ${
                                            isSelected 
                                            ? 'bg-indigo-950/30 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.25)]' 
                                            : 'bg-white/[0.01] border-white/5 hover:border-white/15'
                                        }`}
                                    >
                                        {isRecommended && (
                                            <span className="absolute top-4 right-4 bg-indigo-500 text-white font-black text-[7px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg shadow-indigo-500/30">
                                                Recomendado
                                            </span>
                                        )}
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">{plan.name}</h3>
                                                <span className="text-[7px] bg-indigo-500/10 text-indigo-300 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-indigo-500/20 whitespace-nowrap">
                                                    15 Días Gratis
                                                </span>
                                            </div>
                                            <p className="text-2xl font-black text-white mt-2 font-mono">${plan.price} <span className="text-[10px] text-gray-500 font-bold">USD/mes</span></p>
                                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed mt-2.5 italic border-l-2 border-indigo-500/50 pl-3">
                                                {plan.narrative}
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-white/5 text-[9px] font-bold text-gray-500 space-y-1">
                                            <p>📍 Enfoque: <span className="text-white font-black">{plan.enfoque}</span></p>
                                            <p>🎥 Filmmaker: <span className="text-white font-black">{getFilmmakerText(plan.filmmaker)}</span></p>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Solo Uso de App Card */}
                            <div
                                onClick={() => setSelectedPlanKey('solo_app')}
                                className={`p-6 rounded-3xl border transition-all text-left cursor-pointer relative flex flex-col justify-between group backdrop-blur-md md:col-span-2 ${
                                    selectedPlanKey === 'solo_app' 
                                    ? 'bg-indigo-950/30 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.25)]' 
                                    : 'bg-white/[0.01] border-white/5 hover:border-white/15'
                                }`}
                            >
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
                                            Solo Uso de App (Básico)
                                        </h3>
                                        <div className="flex gap-2">
                                            <span className="bg-indigo-500/20 text-indigo-300 font-bold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                                                15 Días Gratis
                                            </span>
                                            <span className="bg-white/10 text-white font-bold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/5">
                                                Sin Producción
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-2xl font-black text-white mt-2 font-mono">$70 <span className="text-[10px] text-gray-500 font-bold">USD/mes</span></p>
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed mt-2.5 italic border-l-2 border-indigo-500/50 pl-3">
                                        {soloAppPlan.narrative}
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 text-[9px] font-bold text-gray-500 space-y-1">
                                    <p>📍 Enfoque: <span className="text-white font-black">{soloAppPlan.enfoque}</span></p>
                                    <p>🎥 Filmmaker: <span className="text-white font-black">{getFilmmakerText(soloAppPlan.filmmaker)}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Cobertura Warning */}
                        {formData.country && formData.country.toLowerCase().trim() !== 'ecuador' && selectedPlanKey !== 'solo_app' && (
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-left flex items-start gap-3 mt-4">
                                <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-amber-400 font-black uppercase text-[10px] tracking-wider">Servicio Fuera de Ecuador (En Revisión)</p>
                                    <p className="text-gray-400 text-[9px] font-medium leading-relaxed">
                                        Has seleccionado {formData.country} como país. Actualmente no contamos con equipos de filmación (Filmmaker) locales activos fuera de Ecuador. La cobertura presencial de Filmmaker quedará en estado <strong>"En revisión / Por coordinar"</strong> y su precio o viabilidad estará sujeta a coordinación.
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setLocalStep(2)}
                            className="w-full py-5 bg-white hover:bg-gray-100 text-black rounded-2xl font-black text-sm uppercase tracking-widest transition-transform hover:scale-[1.01] shadow-xl shadow-white/5 flex items-center justify-center gap-2 mt-4"
                        >
                            Confirmar Nivel y Firmar Acuerdo
                            <ArrowRight className="w-5 h-5 text-indigo-600" />
                        </button>
                    </motion.div>
                )}

                {localStep === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6 flex-1 flex flex-col justify-center"
                    >
                        <div className="space-y-1 text-center">
                            <span className="block text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Acuerdo Formal de Servicio</span>
                            <h2 className="text-2xl font-black tracking-tight uppercase italic text-white">
                                Firma de <span className="text-indigo-400">Contrato Electrónico</span>
                            </h2>
                            <p className="text-gray-400 text-xs max-w-md mx-auto">
                                Por favor revisa las bases del acuerdo de producción de DIIC ZONE y firma electrónicamente a continuación para continuar al portal de pagos.
                            </p>
                        </div>

                        {/* CONTRACT CONTAINER */}
                        <div className="bg-[#05050C] border border-white/5 rounded-[2rem] p-6 max-h-[300px] overflow-y-auto custom-scrollbar space-y-6 text-[10px] text-gray-500 leading-relaxed text-left font-medium">
                            <div className="bg-indigo-600/10 border border-indigo-500/10 rounded-2xl p-5 space-y-3 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest">Plan Adquirido</p>
                                        <h4 className="text-base font-black italic">{activePlan.name}</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest">Inversión Fija</p>
                                        <p className="text-xl font-black font-mono">${activePlan.price} USD/mes</p>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5 w-full" />
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Prueba Gratis</p>
                                        <p className="font-bold text-emerald-400">15 Días (Activa)</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Inicio de Facturación</p>
                                        <p className="font-bold font-mono text-indigo-400">{getTrialDateString()}</p>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5 w-full" />
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Titular</p>
                                        <p className="font-bold">{formData.name || 'Cliente Representante'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Marca / Compañía</p>
                                        <p className="font-bold">{formData.brand || 'Marca Corporativa'}</p>
                                    </div>
                                </div>
                            </div>

                            {formData.country && formData.country.toLowerCase().trim() !== 'ecuador' && selectedPlanKey !== 'solo_app' && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-[10px] text-amber-400 font-bold uppercase tracking-wider space-y-1">
                                    <p>⚠️ SERVICIO DE FILMMAKER FUERA DE ECUADOR ({formData.country.toUpperCase()})</p>
                                    <p className="text-[9px] text-gray-400 font-medium normal-case">
                                        El recurso presencial de filmación no está activo actualmente en tu ubicación. Al firmar este acuerdo, aceptas que la cobertura presencial queda en estado <strong>"En revisión / Por coordinar"</strong> hasta confirmar viabilidad local con la administración.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <p className="text-white font-black uppercase tracking-wider text-xs flex items-center gap-2">
                                    <Check className="w-4 h-4 text-indigo-400" />
                                    Detalles y Entregables Incluidos en el Paquete:
                                </p>
                                <div className="space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-gray-300">
                                    <p className="text-white font-bold text-xs uppercase tracking-wider">
                                        Período de Prueba y Facturación:
                                    </p>
                                    <p className="text-xs text-gray-300 leading-relaxed italic">
                                        El servicio inicia hoy con una <strong className="text-emerald-400">prueba gratuita de 15 días</strong>. El cargo mensual de <strong>${activePlan.price} USD</strong> se cobrará automáticamente a partir del <strong>{getTrialDateString()}</strong>. Puede cancelar la suscripción en cualquier momento antes del vencimiento de la prueba para evitar cargos.
                                    </p>
                                    <div className="h-px bg-white/5 my-3" />
                                    <p className="text-white font-bold text-xs uppercase tracking-wider">
                                        Servicios y Entregables Activos:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2 text-xs">
                                        {activePlan.features && activePlan.features.map((feature, i) => (
                                            <li key={i} className="text-gray-300">
                                                <strong className="text-white">{feature}</strong>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="h-px bg-white/5 my-3" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <span className="text-gray-500 uppercase text-[9px] font-bold block">Enfoque de Estrategia:</span>
                                            <span className="text-white font-bold">{activePlan.enfoque}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 uppercase text-[9px] font-bold block">Recurso de Filmmaker:</span>
                                            <span className="text-white font-bold">{getFilmmakerText(activePlan.filmmaker)}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[8px] text-gray-600 font-mono uppercase tracking-widest mt-2">
                                    * La firma de este acuerdo confirma la aceptación de los entregables y la tarifa recurrente del plan.
                                </p>
                            </div>

                            {/* SIGNATURE PAD */}
                            <div className="border-t border-white/5 pt-6 space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-400">Panel de Firma Digital</span>
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
                                <div className="border border-dashed border-white/10 rounded-2xl bg-[#090916]/80 backdrop-blur-md w-full h-36 relative overflow-hidden shadow-inner group hover:border-indigo-500/30 transition-all">
                                    <canvas
                                        ref={canvasRef}
                                        className="w-full h-full cursor-crosshair touch-none"
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                        onTouchStart={(e) => { e.preventDefault(); startDrawing(e); }}
                                        onTouchMove={(e) => { e.preventDefault(); draw(e); }}
                                        onTouchEnd={stopDrawing}
                                    />
                                    {!hasSignature && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[9px] text-gray-600 font-mono tracking-widest uppercase">
                                            Dibuja tu firma con el mouse o dedo
                                        </div>
                                    )}
                                </div>
                                <p className="text-[7px] text-gray-600 font-mono uppercase tracking-widest">
                                    IP registrada • Firma legal digitalizada en base al art. 13 de la Ley de Comercio Electrónico
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => setLocalStep(1)}
                                className="px-8 py-5 border border-white/5 hover:border-white/15 bg-white/[0.01] text-gray-500 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                            >
                                Atrás
                            </button>
                            <button
                                onClick={() => setLocalStep(3)}
                                disabled={!hasSignature}
                                className="flex-1 py-5 bg-white hover:bg-gray-100 disabled:opacity-30 disabled:grayscale text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                            >
                                Proceder al Pago Seguro
                                <ArrowRight className="w-4 h-4 text-indigo-600" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {localStep === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6 flex-1 flex flex-col justify-center"
                    >
                        <div className="space-y-1 text-center">
                            <span className="block text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Bóveda de Pagos Seguros</span>
                            <h2 className="text-2xl font-black tracking-tight uppercase italic text-white">
                                Pago <span className="text-indigo-400">Seguro en Línea</span>
                            </h2>
                            <p className="text-gray-400 text-xs max-w-md mx-auto">
                                Ingresa la información de tu tarjeta de crédito o débito para activar la facturación recurrente de tu plan.
                            </p>
                        </div>

                        {/* BILLING OVERVIEW */}
                        <div className="bg-[#05050C] border border-white/5 rounded-3xl p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Plan Contratado</span>
                                    <p className="text-sm font-black text-white mt-1 italic">{activePlan.name}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Inversión Recurrente</span>
                                    <p className="text-lg font-black text-white font-mono mt-1">${activePlan.price} USD<span className="text-[10px] text-gray-500 font-bold">/mes</span></p>
                                </div>
                            </div>
                            <div className="h-px bg-white/5 w-full" />
                            <div className="flex justify-between items-center text-xs">
                                <div>
                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">Período de Prueba</span>
                                    <span className="text-white font-bold">15 Días Gratis</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block">Total Hoy</span>
                                    <span className="text-lg font-black text-emerald-400 font-mono">$0.00 USD</span>
                                </div>
                            </div>
                            <p className="text-[9px] text-gray-500 text-center italic mt-2">
                                Tu prueba de 15 días gratis finaliza el <span className="text-white font-bold">{getTrialDateString()}</span>. No se realizará ningún cargo hoy.
                            </p>
                            {formData.country && formData.country.toLowerCase().trim() !== 'ecuador' && selectedPlanKey !== 'solo_app' && (
                                <p className="text-[9px] text-amber-400 text-center italic mt-2">
                                    ⚠️ Nota: El recurso de Filmmaker en {formData.country} está en revisión y sujeto a coordinación.
                                </p>
                            )}
                        </div>

                        {/* STRIPE-LIKE FORM */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-4 text-left">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block px-1">Nombre del Tarjetahabiente</label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="COMO FIGURA EN LA TARJETA"
                                        value={paymentInfo.cardholderName}
                                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value.toUpperCase() })}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 uppercase"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block px-1">Número de Tarjeta</label>
                                <div className="relative">
                                    <CreditCard className="w-4 h-4 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" />
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
                                            setPaymentInfo({
                                                ...paymentInfo,
                                                cardNumber: parts.length > 0 ? parts.join(' ') : v
                                            });
                                        }}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 font-mono tracking-widest"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block px-1">Vencimiento</label>
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
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 font-mono text-center"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block px-1">CVV</label>
                                    <input
                                        type="text"
                                        maxLength="4"
                                        placeholder="123"
                                        value={paymentInfo.cvv}
                                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/[^0-9]/g, '') })}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white font-bold focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 font-mono text-center"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => setLocalStep(2)}
                                disabled={isProcessingPayment}
                                className="px-8 py-5 border border-white/5 hover:border-white/15 bg-white/[0.01] text-gray-500 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                            >
                                Atrás
                            </button>
                            <button
                                onClick={() => {
                                    setIsProcessingPayment(true);
                                    setTimeout(() => {
                                        setIsProcessingPayment(false);
                                        updateData({
                                            selectedPlan: activePlan,
                                            isPaid: true,
                                            signatureImage: signatureImage
                                        });
                                        setLocalStep(4);
                                        toast.success("Pago Procesado con Éxito. Acuerdo Activado.");
                                    }, 1800);
                                }}
                                disabled={!paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv || !paymentInfo.cardholderName || isProcessingPayment}
                                className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:grayscale text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 uppercase text-xs tracking-[0.25em] flex items-center justify-center gap-3"
                            >
                                {isProcessingPayment ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Verificando Fondos...
                                    </>
                                ) : (
                                    "Confirmar y Pagar"
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}

                {localStep === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="space-y-6 flex-1 flex flex-col justify-center py-4"
                    >
                        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                            <Check className="w-10 h-10 animate-bounce text-emerald-400" />
                        </div>

                        <div className="space-y-2 text-center">
                            <span className="block text-[8px] font-black text-emerald-400 uppercase tracking-[0.5em] leading-none animate-pulse">
                                Factura Emitida • Contrato Firmado
                            </span>
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">
                                ¡Contratación <span className="text-indigo-400">Exitosa!</span>
                            </h2>
                            <p className="text-gray-400 text-xs max-w-sm mx-auto">
                                El pago de la suscripción mensual se ha verificado. Tu contrato legal personalizado ha sido emitido.
                            </p>
                        </div>

                        {/* MINI CONTRACT SUMMARY */}
                        <div className="bg-[#05050C] border border-white/5 rounded-3xl p-6 text-left max-w-md mx-auto w-full space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Resumen del Acuerdo</span>
                                <span className="text-[8px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold px-2 py-0.5 rounded-full uppercase">Activo</span>
                            </div>
                            <div className="space-y-2 text-xs font-bold text-gray-400">
                                <div className="flex justify-between"><span>Socio:</span><span className="text-white">{formData.name || 'Cliente Titular'}</span></div>
                                <div className="flex justify-between"><span>Marca:</span><span className="text-white">{formData.brand || 'Compañía / Marca'}</span></div>
                                <div className="flex justify-between"><span>Nicho:</span><span className="text-indigo-400 uppercase">{businessTypeLabel}</span></div>
                                <div className="flex justify-between"><span>Nivel/Plan:</span><span className="text-white">{activePlan.name}</span></div>
                                <div className="flex justify-between"><span>Inversión:</span><span className="text-white">${activePlan.price} USD/mes</span></div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 mt-6">
                            <button
                                onClick={handleDownloadContract}
                                className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase text-xs tracking-widest flex items-center justify-center gap-3"
                            >
                                <Download className="w-5 h-5" />
                                Descargar Contrato PDF
                            </button>
                            <button
                                onClick={() => {
                                    toast.success('¡Entorno Creado Exitosamente!');
                                    setTimeout(onNext, 1000);
                                }}
                                className="flex-1 py-5 bg-white hover:bg-gray-100 text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-transform hover:scale-[1.01] shadow-xl shadow-white/5 flex items-center justify-center gap-2"
                            >
                                Entrar a mi Dashboard
                                <ArrowRight className="w-5 h-5 text-indigo-600" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
