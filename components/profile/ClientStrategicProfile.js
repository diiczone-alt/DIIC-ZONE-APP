'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Network, Tag, Target, Users, Search, Target as TargetIcon, Zap, Heart, Link as LinkIcon, Globe, Image as ImageIcon, CheckCircle2, ShieldAlert, Crosshair, Plus, Trash2, ShieldCheck, Activity, Bot, Sparkles, Database, Command, Maximize2, Wand2, Edit3, Paperclip, Mic, FileUp, Facebook, Instagram, Linkedin, Camera, Smartphone, Monitor, Layout, Layers, Video, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { agencyService } from '@/services/agencyService';
import { aiService } from '@/services/aiService';
import { toast } from 'sonner';

// Helper to decode HTML entities from titles
const decodeEntities = (text) => {
    if (!text) return '';
    const temp = document.createElement('textarea');
    temp.innerHTML = text;
    return temp.value;
};

// Helper component for luxury report rendering
const StrategicReportViewer = ({ content }) => {
    if (!content) return null;
    
    // Split into logical blocks
    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {lines.map((line, idx) => {
                // Type 1: Main Header and Intro Text (ej: **TITULO:** Contenido)
                if (line.match(/^\*\*(.*?)\*\*:(.*)/)) {
                    const [, title, text] = line.match(/^\*\*(.*?)\*\*:(.*)/);
                    return (
                        <div key={idx} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                                <h4 className="text-indigo-400 font-black uppercase text-[11px] tracking-[0.4em] italic whitespace-nowrap bg-[#0A0A0F] px-4">
                                    {title}
                                </h4>
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                            </div>
                            {text && (
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed font-medium subpixel-antialiased pl-4 border-l-2 border-indigo-500/10">
                                    {text.trim()}
                                </p>
                            )}
                        </div>
                    );
                }

                // Type 2: Bullet points (ej: * **Subtema:** Detalle)
                if (line.match(/^\*\s+\*\*(.*?)\*\*(.*)/)) {
                    const [, subtitle, detail] = line.match(/^\*\s+\*\*(.*?)\*\*(.*)/);
                    return (
                        <div key={idx} className="group relative">
                            <div className="absolute -inset-x-6 -inset-y-4 bg-white/[0.02] rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />
                            <div className="flex gap-5">
                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-500/5 border border-white/5 flex items-center justify-center text-indigo-400 shadow-sm group-hover:border-indigo-500/30 transition-colors">
                                    <Zap size={18} className="group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="space-y-1 flex-1">
                                    <h5 className="text-white font-black text-xs uppercase tracking-widest">{subtitle}</h5>
                                    <p className="text-gray-400 text-sm leading-relaxed">{detail.replace(/^:/, '').trim()}</p>
                                </div>
                            </div>
                        </div>
                    );
                }

                // Type 3: Numbered lists (ej: 1. **Paso:** Desc)
                if (line.match(/^\d+\.\s+\*\*(.*?)\*\*(.*)/)) {
                    const [, step, desc] = line.match(/^\d+\.\s+\*\*(.*?)\*\*(.*)/);
                    const number = line.match(/^(\d+)/)[1];
                    return (
                        <div key={idx} className="p-6 rounded-[32px] bg-gradient-to-br from-indigo-500/5 to-transparent border border-white/5 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                           <div className="flex gap-6 relative z-10">
                                <div className="w-14 h-14 shrink-0 rounded-full border-2 border-indigo-500/20 flex items-center justify-center">
                                    <span className="text-2xl font-black text-indigo-500 italic">0{number}</span>
                                </div>
                                <div className="space-y-1">
                                    <h5 className="text-white font-black text-sm uppercase tracking-widest italic">{step}</h5>
                                    <p className="text-gray-400 text-sm leading-relaxed">{desc.replace(/^:/, '').trim()}</p>
                                </div>
                           </div>
                        </div>
                    );
                }

                // Type 4: Simple text or emphasis
                return (
                    <p key={idx} className="text-gray-300 text-sm md:text-base leading-relaxed font-medium">
                        {line.split('**').map((part, i) => (
                            i % 2 === 1 
                                ? <strong key={i} className="text-white font-black italic">{part}</strong> 
                                : part
                        ))}
                    </p>
                );
            })}

        </div>
    );
};

// Helper to generate AI-tailored recording ideas based on profile context
const getStrategicIdea = (formatId, profile) => {
    if (!profile || !profile.brandName) return null;
    
    const brand = profile.brandName;
    const audience = profile.targetAudience || 'tu audiencia';
    
    const ideas = {
        historias: `Historias de "Detrás de Cámara" en ${brand}: Muestra la preparación de una consulta o el unboxing de un nuevo equipo médico. Habla de la importancia del cuidado preventivo y pide a ${audience} que compartan sus dudas por DM.`,
        reels: `Tip Rápido de Salud: Crea un Reel de 15s con 3 mitos comunes en el sector de la urología que afectan a ${audience}. Usa un gancho visual fuerte y música en tendencia para posicionar a ${brand} como autoridad disruptiva.`,
        podcast: `Entrevista Especial: Invita a un colega para hablar sobre cómo la tecnología de DIIC ZONE está revolucionando el tratamiento de pacientes. Enfócate en el beneficio a largo plazo y la confianza médica.`
    };
    
    return ideas[formatId] || null;
};

// Recording Formats Configuration
const RECORDING_FORMATS = [
    {
        id: 'historias',
        label: 'Historias / Storytelling',
        icon: Smartphone,
        color: 'from-pink-500 to-rose-400',
        strategy: 'Hablar de beneficios y cuidados. Nosotros como estrategas solicitamos las historias para conectar.',
        focus: 'Vida Diaria & Autenticidad',
        aiPrompt: 'Generar historias de lifestyle médico'
    },
    {
        id: 'reels',
        label: 'Reels / Viral',
        icon: Video,
        color: 'from-indigo-500 to-purple-500',
        strategy: 'Informativo y estratégico. Usar entretenimiento con moderación sin abusar del formato.',
        focus: 'Crecimiento & Virilidad',
        aiPrompt: 'Diseñar reels educativos disruptivos'
    },
    {
        id: 'podcast',
        label: 'Podcast / Autoridad',
        icon: Mic,
        color: 'from-emerald-500 to-teal-500',
        strategy: 'Entrevistas y temas profundos. Construye autoridad y educa a la audiencia de forma experta.',
        focus: 'Autoridad & Expertise',
        aiPrompt: 'Planificar episodios de autoridad'
    }
];

// Modal component for Recording Formats
const RecordingFormatsModal = ({ isOpen, onClose, profile }) => {
    const handleExportPDF = () => {
        window.print();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="w-full max-w-5xl max-h-[90vh] bg-[#0A0A0F] border border-white/10 rounded-[40px] shadow-2xl relative overflow-y-auto custom-scrollbar"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 -z-10" />

                        <div className="p-8 md:p-12 pb-4 sticky top-0 bg-[#0A0A0F]/80 backdrop-blur-md z-20 border-b border-white/5 flex items-center justify-between no-print">
                            <div className="space-y-1">
                                <h3 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter">Configuración de <span className="text-indigo-500">Producción</span></h3>
                                <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                                    <Activity size={10} className="text-indigo-500" /> Estándares de Calidad DIIC Zone v2.0
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={handleExportPDF}
                                    className="px-6 py-3 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all hover:bg-indigo-400 flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                                >
                                    <FileUp size={14} /> Exportar PDF
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all outline-none"
                                >
                                    <X className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="space-y-8">
                                {RECORDING_FORMATS.map((format) => (
                                    <div 
                                        key={format.id}
                                        className="group p-6 md:p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500 relative overflow-hidden flex flex-col lg:flex-row items-center lg:items-stretch gap-8 md:gap-12"
                                    >
                                        {/* Gradient Glow */}
                                        <div className={`absolute -inset-px bg-gradient-to-br ${format.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                        
                                        <div className="flex flex-col items-center justify-center space-y-4 lg:w-1/4 shrink-0">
                                            <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${format.color} flex items-center justify-center text-white shadow-2xl group-hover:scale-105 transition-transform duration-500`}>
                                                <format.icon size={48} />
                                            </div>
                                            <div className="text-center">
                                                <h4 className="text-2xl font-black text-white uppercase tracking-tight">{format.label}</h4>
                                                <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mt-3 inline-block">{format.focus}</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-6 flex flex-col justify-center text-left">
                                            <div className="p-6 md:p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5">
                                                <p className="text-base text-gray-300 font-medium leading-relaxed italic">
                                                    "{format.strategy}"
                                                </p>
                                            </div>
                                            
                                            {profile.brandName && (
                                                <div className="p-6 md:p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 border-dashed animate-in fade-in slide-in-from-top-2 duration-700">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                                                        <span className="text-[11px] font-black uppercase text-indigo-400 tracking-widest">Inteligencia Estratégica IA</span>
                                                    </div>
                                                    <p className="text-sm text-gray-200 font-medium leading-relaxed">
                                                        {getStrategicIdea(format.id, profile)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="lg:w-48 flex flex-col items-center justify-center border-l border-white/5 pl-8 shrink-0 hidden lg:flex">
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 text-center">Protocolo DIIC</span>
                                            <div className="w-16 h-16 rounded-3xl border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all shadow-xl group-hover:shadow-white/20">
                                                <CheckCircle2 size={32} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>              
                        </div>

                        <div className="p-8 md:p-12 pt-0 no-print">
                            <div className="mt-4 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                                        <Camera size={24} />
                                    </div>
                                    <div>
                                        <h5 className="text-white font-black text-xs uppercase tracking-widest">Hardware Recomendado</h5>
                                        <p className="text-[10px] text-gray-500 font-medium">iPhone 15 Pro Max (Historias) | Sony FX3 + Lente 35mm f/1.4 (Podcast) | Rode Wireless PRO</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleExportPDF}
                                    className="w-full md:w-auto px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3"
                                >
                                    <FileUp size={16} /> Guardar e Imprimir Reporte
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default function ClientStrategicProfile() {
    const { user } = useAuth();
    // Current client ID from auth context
    const clientId = user?.client_id;

    // Basic state for the profile
    const [profile, setProfile] = useState({
        brandName: user?.user_metadata?.brand || '',
        leadership: '',
        whatItDoes: '',
        whatItOffers: '',
        targetAudience: '',
        problemSolved: '',
        valueProp: '',
        tone: '',
        mainGoal: '',
        marketContext: '',
        competitors: [],
        strategicAllies: [],
        websiteUrl: '',
        instagramUrl: '',
        linkedinUrl: '',
        whatsappNumber: '',
        recordingFormats: {
            preferred: 'reels',
            resolution: '4K',
            fps: 30
        },
        insights: {} // Para guardar reportes de tráfico, fricción, etc.
    });

    const [syncCount, setSyncCount] = useState(0);
    const [showFormats, setShowFormats] = useState(false);
    const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'report'
    const [isSaving, setIsSaving] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
    const [tempSnapshotName, setTempSnapshotName] = useState('');
    const [selectedSnapshotForPreview, setSelectedSnapshotForPreview] = useState(null);
    const [isSimulatingScrape, setIsSimulatingScrape] = useState(false);
    const [analysisMsg, setAnalysisMsg] = useState('');
    
    const [insightModalOpen, setInsightModalOpen] = useState(false);
    const [insightData, setInsightData] = useState({ title: '', content: '', loading: false });
    const [activeInsightBtn, setActiveInsightBtn] = useState(null);
    
    // Deep Dive Expansion States
    const [expandedField, setExpandedField] = useState(null); // { label, field, icon, value }
    const [isFieldLoading, setIsFieldLoading] = useState(false);
    
    // Continuous Research Chat States
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isChatting, setIsChatting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [hasUnsyncedUrl, setHasUnsyncedUrl] = useState(false);
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const loadClient = async () => {
            if (!clientId) {
                console.log("Strategic Profile: No clientId found in user context.");
                return;
            }
            try {
                const client = await agencyService.getClientById(clientId);
                if (client) {
                    setProfile(prev => ({
                        ...prev,
                        ...client,
                        brandName: client.name || client.brandName || prev.brandName || '',
                        // Map strategic data from onboarding_data (or fallback to metadata for legacy)
                        ...(client.onboarding_data?.strategic || client.metadata?.strategic || {})
                    }));
                    if (client.onboarding_data?.strategic?.websiteUrl || client.websiteUrl || client.brandName) {
                        setIsPreviewMode(true);
                    }
                }
            } catch (error) {
                console.error("Error loading client profile:", error);
            }
        };
        loadClient();
    }, [clientId]);

    const handleChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        if (field === 'websiteUrl' || field === 'instagramUrl') {
            setHasUnsyncedUrl(true);
        }
    };

    const handleArrayChange = (field, index, key, value) => {
        setProfile(prev => {
            const newArray = [...(prev[field] || [])];
            newArray[index] = { ...newArray[index], [key]: value };
            return { ...prev, [field]: newArray };
        });
    };

    const addArrayItem = (field, defaultItem) => {
        setProfile(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), defaultItem]
        }));
    };

    const removeArrayItem = (field, index) => {
        setProfile(prev => {
            const newArray = [...(prev[field] || [])];
            newArray.splice(index, 1);
            return { ...prev, [field]: newArray };
        });
    };

    const handleConfirm = async (overrideProfile = null) => {
        const targetProfile = overrideProfile || profile;

        if (!clientId) {
            toast.error("Error: No se encontró la sesión del cliente.");
            return;
        }
        
        setIsSaving(true);
        try {
            // Strip out non-strategic keys to avoid large/circular payloads
            const { id, created_at, metadata, onboarding_data, editor, filmmaker, ...strategicData } = targetProfile;

            // Limpiamos referencias circulares o data inválida de onboarding_data actual
            const safeOnboardingData = onboarding_data ? JSON.parse(JSON.stringify(onboarding_data)) : {};

            const updatePayload = {
                name: targetProfile.brandName,
                onboarding_data: {
                    ...safeOnboardingData,
                    strategic: { 
                        ...strategicData, 
                        websiteUrl: targetProfile.websiteUrl || '', 
                        instagramUrl: targetProfile.instagramUrl || ''
                    }
                }
            };

            // Sanitización absoluta: Supabase-js puede congelarse (hang) si intentamos pasarle objetos
            // con referencias circulares complejas (ej. Eventos de React) que escapen al safeOnboardingData.
            const ultraSafePayload = JSON.parse(JSON.stringify(updatePayload));

            const updatePromise = agencyService.updateClient(clientId, ultraSafePayload);

            // Esperamos que termine el guardado sin forzar un timeout artificial.
            // Si el servidor de Supabase está despertando (Cold Boot), puede tomar hasta 2 minutos.
            await updatePromise;
            setIsSaving(false);
            toast.success("¡Ecosistema Estratégico sincronizado con éxito!", { id: 'save-toast' });
            setIsPreviewMode(false);
        } catch (error) {
            console.error("Strategic Profile save error:", error);
            setIsSaving(false);
            toast.error("Error al guardar: " + (error.message || "Problema de red"), { id: 'save-toast' });
        }
    };

    const handleSaveSnapshot = () => {
        setTempSnapshotName(`Investigación ${new Date().toLocaleDateString()}`);
        setIsSnapshotModalOpen(true);
    };

    const confirmSaveSnapshot = () => {
        if (!tempSnapshotName.trim()) return;

        const fieldsToSave = [
            'brandName', 'leadership', 'whatItDoes', 'whatItOffers', 
            'targetAudience', 'problemSolved', 'valueProp', 
            'marketContext', 'tone', 'mainGoal'
        ];

        const snapshotData = {};
        fieldsToSave.forEach(f => snapshotData[f] = profile[f] || '');

        const newSnapshot = {
            id: Date.now().toString(),
            name: tempSnapshotName,
            date: new Date().toISOString(),
            data: snapshotData
        };

        const updatedProfile = {
            ...profile,
            snapshots: [newSnapshot, ...(profile.snapshots || [])]
        };

        setProfile(updatedProfile);

        setIsSnapshotModalOpen(false);
        toast.info("Guardando snapshot en base de datos...");
        
        // Auto-save the new snapshot directly to the database
        handleConfirm(updatedProfile);
    };

    const handleApplySnapshot = (snapshot) => {
        if (!confirm(`¿Estás seguro de activar "${snapshot.name}"? Esto reemplazará los datos actuales de la cuadrícula.`)) return;

        setProfile(prev => ({
            ...prev,
            ...snapshot.data
        }));

        toast.success(`Ecosistema "${snapshot.name}" activado.`);
        setIsPreviewMode(true);
        setTimeout(() => setIsPreviewMode(false), 3000);
    };

    const deleteSnapshot = (id) => {
        const updatedProfile = {
            ...profile,
            snapshots: profile.snapshots.filter(s => s.id !== id)
        };
        setProfile(updatedProfile);
        toast.info("Snapshot eliminado. Actualizando base de datos...");
        handleConfirm(updatedProfile);
    };

    const handleSimulateSync = async () => {
        if (!profile.websiteUrl && !profile.instagramUrl) {
            toast.error("Ingresa una URL para iniciar la investigación");
            return;
        }

        try {
            console.log("!!! INICIANDO INVESTIGACIÓN OMNINIVEL - DIIC ZONE !!!");
            setIsSimulatingScrape(true);
            setIsPreviewMode(true);
            setAnalysisMsg('Infiltrando arquitectura web...');
            
            // CLEAR PREVIOUS STATE TO PREVENT STALENESS - VITAL FOR USER FEEDBACK
            setProfile(p => ({
                ...p,
                leadership: 'Analizando...',
                whatItDoes: 'Escaneando...',
                whatItOffers: 'Buscando portafolio...',
                targetAudience: 'Identificando...',
                problemSolved: 'Mapeando soluciones...',
                valueProp: 'Extrayendo USP...',
                tone: 'Definiendo...',
                mainGoal: 'Mapeando KPIs...',
                marketContext: 'Auditando mercado...'
            }));

            const result = await aiService.analyzeStrategicProfile(
                profile.websiteUrl || profile.instagramUrl, 
                profile.brandName
            );

            console.log("RESULTADO DE INTELIGENCIA RECIBIDO:", result);

            // result should now be { steps, data } from aiService
            const d = result.data || {};
            
            // ATOMIC UPDATE WITH REAL DATA ONLY
            const updatedProfile = {
                ...profile,
                brandName: d.brandName || profile.brandName,
                leadership: d.leadership || "Datos no hallados en el footprint público.",
                whatItDoes: d.whatItDoes || "Información pendiente de extracción profunda.",
                whatItOffers: d.whatItOffers || "Servicios/Productos no detectados.",
                targetAudience: d.targetAudience || "Público general del sector.",
                problemSolved: d.problemSolved || "Problemas comunes de la industria.",
                valueProp: d.valueProp || "Propuesta en fase de definición.",
                tone: d.tone || "Profesional",
                mainGoal: d.mainGoal || "Ventas y Autoridad",
                marketContext: d.marketContext || "Contexto de mercado estándar."
            };

            setProfile(updatedProfile);
            setSyncCount(c => c + 1);

            // EXTENDED INTELLIGENCE STEPS
            const displaySteps = result.steps || [
                { msg: 'Rastreando activos digitales y footprint...', icon: 'Target' },
                { msg: 'Mapeando arquitectura de marca y core...', icon: 'Bot' },
                { msg: 'Analizando audiencia y puntos de dolor...', icon: 'Users' },
                { msg: 'Detectando competidores y brechas de mercado...', icon: 'Search' },
                { msg: 'Sintetizando inteligencia estratégica real...', icon: 'Zap' },
                { msg: 'Generando recomendaciones de producción...', icon: 'Camera' },
                { msg: 'Compilando reporte de ecosistema...', icon: 'Database' }
            ];

            for (const step of displaySteps) {
                setAnalysisMsg(step.msg);
                await new Promise(r => setTimeout(r, 1000)); // Slightly longer for 'God Mode' feel
            }
            
            setHasUnsyncedUrl(false);
            toast.success("Investigación Omni-Nivel completada con éxito. Guardando...");
            handleConfirm(updatedProfile);

        } catch (error) {
            console.error("AI Analysis error:", error);
            // HONEST ERROR FEEDBACK
            toast.error(error.message || "Fallo en la investigación estratégica");
            
            // Reset fields to avoid showing 'Analizando...' if it failed
            setProfile(p => ({
                ...p,
                leadership: '', whatItDoes: '', whatItOffers: '', targetAudience: '',
                problemSolved: '', valueProp: '', tone: '', mainGoal: '', marketContext: ''
            }));
        } finally {
            setIsSimulatingScrape(false);
            setAnalysisMsg('');
        }
    };

    const handleQuickInsight = async (mode, title) => {
        if (!profile.websiteUrl && !profile.instagramUrl) {
            toast.error("Por favor ingresa una URL web primero");
            return;
        }
        
        setActiveInsightBtn(mode);
        
        if (mode !== 'competitors') {
            setInsightModalOpen(true);
            setInsightData({ title, content: '', loading: true });
        } else {
            toast.loading("Rastreando mercado competidor...", { id: 'comp-toast' });
        }

        try {
            const url = profile.websiteUrl || profile.instagramUrl;
            const res = await aiService.generateQuickInsight(url, profile.brandName, mode);
            
            if (mode === 'competitors') {
                if (res.competitors) {
                    const updatedProfile = { ...profile, competitors: res.competitors };
                    setProfile(updatedProfile);
                    toast.success("Competidores inyectados. Guardando...", { id: 'comp-toast' });
                    handleConfirm(updatedProfile);
                }
            } else {
                setInsightData({ title, content: res.insight, loading: false });
                // PERSISTENCIA: Guardamos el reporte en el estado del perfil
                const updatedProfile = {
                    ...profile,
                    insights: {
                        ...profile.insights,
                        [mode]: { title, content: res.insight, date: new Date().toISOString() }
                    }
                };
                setProfile(updatedProfile);
                handleConfirm(updatedProfile);
            }
        } catch (error) {
            console.error("Quick Insight Error:", error);
            if (mode !== 'competitors') {
                setInsightData({ title, content: 'Ocurrió un error en la infiltración. Por favor intenta de nuevo.', loading: false });
            } else {
                toast.error("Fallo al detectar competidores", { id: 'comp-toast' });
            }
        } finally {
            setActiveInsightBtn(null);
        }
    };

    const handleDownloadReport = () => {
        const toastId = toast.loading("Compilando Reporte Estratégico Omni-Nivel...");
        
        // Gather full intelligence context
        const reportTitle = profile.brandName || 'Marca No Identificada';
        console.log(`[DIIC EXPORT] Generando reporte para: ${reportTitle}`);

        setTimeout(() => {
            toast.success("Reporte compilado. Preparando vista de impresión...", { id: toastId });
            window.print();
        }, 1500);
    };

    const handleResearchChat = async (e) => {
        e.preventDefault();
        if ((!chatInput.trim() && !selectedFile) || isChatting) return;
        
        const url = profile.websiteUrl || profile.instagramUrl;
        if (!url) {
            toast.error("Por favor, ingresa primero la URL web que vamos a investigar.");
            return;
        }

        const userMsg = chatInput || (selectedFile ? `Archivo adjunto: ${selectedFile.name}` : '');
        const newMessages = [...chatMessages, { role: 'user', content: userMsg }];
        setChatMessages(newMessages);
        
        const currentInput = chatInput;
        const currentFile = selectedFile;
        
        setChatInput('');
        setSelectedFile(null);
        setIsChatting(true);

        try {
            let fileData = null;
            if (currentFile) {
                fileData = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({
                        data: reader.result.split(',')[1],
                        mimeType: currentFile.type,
                        name: currentFile.name
                    });
                    reader.readAsDataURL(currentFile);
                });
            }

            // Using the insight route with mode='chat'
            // Streamlined context to prevent API errors
            const profileContext = {
                leadership: profile.leadership,
                whatItDoes: profile.whatItDoes,
                whatItOffers: profile.whatItOffers,
                valueProp: profile.valueProp
            };

            const response = await fetch('/api/ai/insight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    url, 
                    brandName: profile.brandName, 
                    mode: 'chat', 
                    query: currentInput,
                    file: fileData,
                    context: profileContext // SEND ONLY RELEVANT DATA
                })
            });
            const data = await response.json();
            
            if (response.ok && data.insight) {
                setChatMessages([...newMessages, { role: 'assistant', content: data.insight }]);
            } else {
                toast.error(data.error || "Fallo en chat de investigación");
            }
        } catch (error) {
            console.error("Chat Error:", error);
            toast.error("Error al investigar, revisa la consola.");
        } finally {
            setIsChatting(false);
            setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const handleFieldAIAction = async (field, action) => {
        const url = profile.websiteUrl || profile.instagramUrl;
        if (!url) {
            toast.error("Detecto que no hay una URL web para investigar. Por favor ingrésala.");
            return;
        }

        setIsFieldLoading(true);
        const toastId = toast.loading(action === 'refine' ? "Investigando huella digital en tiempo real..." : "Optimizando con sesgos cognitivos...");

        try {
            const body = { 
                url, 
                brandName: profile.brandName, 
                mode: action,
                field: field,
                currentText: profile[field]
            };

            const response = await fetch('/api/ai/insight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (response.ok && data.insight) {
                setProfile(prev => ({ ...prev, [field]: data.insight }));
                toast.success("¡Contenido optimizado!", { id: toastId });
                // If it's expanded, update the expanded view value too if we need to
                if (expandedField && expandedField.field === field) {
                    setExpandedField({ ...expandedField, value: data.insight });
                }
            } else {
                toast.error("La IA tuvo una interferencia. Inténtalo de nuevo.", { id: toastId });
            }
        } catch (error) {
            console.error("Field AI Error:", error);
            toast.error("Error de conexión con el satélite DIIC.", { id: toastId });
        } finally {
            setIsFieldLoading(false);
        }
    };

    const renderInput = (label, field, icon, placeholder, isTextarea = false) => {
        const Icon = icon;
        return (
            <div className="bg-[#0A0A0F] border border-white/5 rounded-[32px] p-6 space-y-4 hover:border-indigo-500/30 focus-within:border-indigo-500/50 transition-all duration-300 group relative shadow-lg hover:shadow-indigo-500/10 flex flex-col h-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/5 group-hover:bg-indigo-500/10 rounded-2xl text-indigo-400 animate-in fade-in transition-colors">
                            <Icon className="w-5 h-5" />
                        </div>
                        <label className="text-sm font-black text-white uppercase italic tracking-widest">{label}</label>
                    </div>
                    {/* Deep dive expansion anchor */}
                    <button 
                        onClick={() => setExpandedField({ label, field, icon, value: profile[field] })} 
                        className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all text-gray-400 hover:text-white" title="Expandir Módulo"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="flex-1 mt-2">
                    {isTextarea ? (
                        <textarea 
                            value={decodeEntities(profile[field] || '')}
                            onChange={(e) => handleChange(field, e.target.value)}
                            placeholder={placeholder}
                            className={`w-full bg-transparent border-none text-gray-400 font-medium leading-relaxed focus:outline-none resize-none h-24 text-sm focus:text-indigo-100 transition-all duration-500 ${isSimulatingScrape ? 'animate-pulse opacity-50' : ''}`}
                        />
                    ) : (
                        <input 
                            type="text"
                            value={decodeEntities(profile[field] || '')}
                            onChange={(e) => handleChange(field, e.target.value)}
                            placeholder={placeholder}
                            className={`w-full bg-transparent border-none text-gray-400 font-medium leading-relaxed focus:outline-none text-sm focus:text-indigo-100 transition-all duration-500 ${isSimulatingScrape ? 'animate-pulse opacity-50' : ''}`}
                        />
                    )}
                </div>

            </div>
        );
    };

    return (
        <div className="animate-in fade-in duration-500 pb-16">
            <div className="space-y-4 text-center pb-8 border-b border-white/5 mb-12">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                    Capa 1: Base del Negocio
                </span>
                <h2 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
                    Perfil <span className="text-indigo-500">Estratégico</span>
                </h2>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto">
                    Define la identidad central de tu marca. Conecta tus redes y web para que Diiczone entienda tu negocio automáticamente.
                </p>
                <div className="flex justify-center items-center gap-6 mt-6 print:hidden">
                    <div className="flex bg-[#0A0A0F] border border-white/5 rounded-2xl p-1 p-1">
                        <button 
                            onClick={() => setViewMode('edit')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'edit' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Modo Edición
                        </button>
                        <button 
                            onClick={() => setViewMode('report')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'report' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Vista de Reporte
                        </button>
                    </div>
                    <button 
                        onClick={handleDownloadReport}
                        className="px-6 py-2.5 bg-indigo-600 border border-indigo-400/50 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex items-center gap-2 transform active:scale-95"
                    >
                        <FileUp size={14} className="animate-bounce" /> Descargar Reporte (PDF)
                    </button>
                {/* Print Styles - Ultra Optimized for PDF */}
            <style jsx global>{`
                @media print {
                    @page { margin: 1cm; size: auto; }
                    body { 
                        background: white !important; 
                        color: black !important; 
                        margin: 0 !important; 
                        padding: 0 !important;
                    }
                    /* Hide EVERYTHING except the report content */
                    nav, aside, header, footer, .print\:hidden, [role="status"], .toaster, .Toastify { 
                        display: none !important; 
                    }
                    
                    /* Force visibility of the main report container */
                    .bg-[#0A0A0F], .bg-[#0A0A12], .bg-[#11111E] { 
                        background: white !important; 
                        border: 1px solid #ddd !important;
                        box-shadow: none !important;
                        margin: 0 !important;
                        padding: 20px !important;
                        width: 100% !important;
                        display: block !important;
                        position: relative !important;
                    }

                    /* Text Contrast */
                    h2, h3, h4, h5, label, p, span, div { 
                        color: black !important; 
                        text-shadow: none !important;
                    }
                    .text-indigo-500, .text-indigo-400, .text-rose-500, .text-blue-500 { 
                        color: #1a1a1a !important; 
                        font-weight: bold !important;
                        border-bottom: 2px solid #eee !important;
                        display: inline-block;
                        width: 100%;
                        margin-bottom: 10px;
                    }

                    /* Grid Optimization */
                    .grid { 
                        display: block !important; 
                        width: 100% !important;
                    }
                    .grid > div { 
                        margin-bottom: 30px !important; 
                        page-break-inside: avoid !important;
                        width: 100% !important;
                        border: 1px solid #eee !important;
                        padding: 15px !important;
                        border-radius: 8px !important;
                    }

                    /* Remove all high-end effects for clean PDF */
                    .animate-in, .animate-pulse, .shadow-2xl, .shadow-lg, .blur-xl, .opacity-10 { 
                        animation: none !important; 
                        box-shadow: none !important; 
                        filter: none !important;
                        opacity: 1 !important;
                    }

                    /* Content Spacing */
                    .space-y-20 > * + * { margin-top: 40px !important; }
                    .pl-6 { border-left: 3px solid #eee !important; padding-left: 20px !important; }
                }
            `}</style>
                </div>
            </div>

            {viewMode === 'report' ? (
                <div className="mt-12 space-y-16 animate-in fade-in zoom-in-95 duration-500">
                    {/* Professional Report Layout */}
                    <div className="bg-[#0A0A0F] border border-white/5 rounded-[48px] p-12 md:p-20 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none no-print">
                            <ShieldCheck className="w-[500px] h-[500px] text-white" />
                        </div>

                        <div className="relative z-10 space-y-20">
                            {/* PDF Export Controls (Internal Only) */}
                            <div className="flex items-center justify-between no-print mb-8 border-b border-white/5 pb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                                        <FileUp size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-sm uppercase tracking-widest">Reporte Estratégico Profesional</h4>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Optimizado para impresión DIIC Zone</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleExportPDF}
                                    className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all flex items-center gap-3 active:scale-95 group"
                                >
                                    <FileUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span>DESCARGAR REPORTE (PDF)</span>
                                </button>
                            </div>
                            {/* Brand Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-12">
                                <div className="space-y-4 text-left">
                                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">{profile.brandName || 'Marca Diic Zone'}</h3>
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">Estrategia Activa</span>
                                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Generado: {new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center min-w-[200px]">
                                    <p className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-1">Status Operativo</p>
                                    <p className="text-sm text-white font-black uppercase italic tracking-widest">Optimización IA</p>
                                </div>
                            </div>

                            {/* Core Strategy Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                                {[
                                    { label: 'Liderazgo', val: profile.leadership, icon: ShieldCheck },
                                    { label: 'Core del Negocio', val: profile.whatItDoes, icon: Network },
                                    { label: 'Oferta Estratégica', val: profile.whatItOffers, icon: Zap },
                                    { label: 'Público Objetivo', val: profile.targetAudience, icon: Users },
                                    { label: 'Propuesta de Valor', val: profile.valueProp, icon: TargetIcon },
                                    { label: 'Meta Principal', val: profile.mainGoal, icon: Target }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-4 group">
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5 text-indigo-500" />
                                            <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em]">{item.label}</h4>
                                        </div>
                                        <p className="text-lg font-medium text-gray-300 leading-relaxed border-l-2 border-indigo-500/20 pl-6 group-hover:border-indigo-500 transition-colors">
                                            {item.val || 'Información no definida'}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Production Strategy Section */}
                            <div className="pt-12 border-t border-white/5 space-y-12 text-left">
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                                    <Activity className="w-6 h-6 text-indigo-500" /> Estrategia de Producción
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {RECORDING_FORMATS.map(f => (
                                        <div key={f.id} className="space-y-6 group p-8 bg-white/[0.02] border border-white/5 rounded-[40px] hover:border-indigo-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-4 bg-gradient-to-br ${f.color} rounded-3xl text-white shadow-xl`}>
                                                    <f.icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h4 className="text-sm font-black text-white uppercase tracking-wider">{f.label}</h4>
                                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{f.focus}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[13px] font-medium text-gray-400 leading-relaxed italic border-l-2 border-indigo-500/20 pl-6 group-hover:border-indigo-500 transition-colors">
                                                    "{f.strategy}"
                                                </p>
                                                {profile.brandName && (
                                                    <div className="mt-4 p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 border-dashed">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Sparkles size={12} className="text-indigo-400" />
                                                            <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">Sugerencia IA</span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                                                            {getStrategicIdea(f.id, profile)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Market Intelligence Section */}
                            <div className="pt-12 border-t border-white/5 space-y-12">
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                                    <Globe className="w-6 h-6 text-indigo-500" /> Inteligencia de Mercado
                                </h3>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    {/* Competitors List */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">Mapeo de Competidores</h4>
                                        <div className="space-y-4">
                                            {profile.competitors?.map((c, i) => (
                                                <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-black text-white uppercase italic">{c.name}</span>
                                                        <span className="text-[9px] text-rose-400 font-bold uppercase tracking-widest">{c.location}</span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 italic leading-relaxed">{c.strengthsWeaknesses}</p>
                                                </div>
                                            ))}
                                            {(!profile.competitors || profile.competitors.length === 0) && (
                                                <p className="text-xs text-gray-600 font-medium italic">No se han registrado competidores estratégicos.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Allies List */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Aliados Estratégicos</h4>
                                        <div className="space-y-4">
                                            {profile.strategicAllies?.map((a, i) => (
                                                <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-black text-white uppercase italic">{a.name}</span>
                                                        <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Partner</span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 italic leading-relaxed">{a.tagReason}</p>
                                                </div>
                                            ))}
                                            {(!profile.strategicAllies || profile.strategicAllies.length === 0) && (
                                                <p className="text-xs text-gray-600 font-medium italic">No se han registrado aliados estratégicos.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Final Footnote */}
                            <div className="pt-12 border-t border-white/5 flex flex-col items-center gap-4 opacity-30">
                                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em]">DIIC ZONE • ESTRATEGIA OMNI-NIVEL 2026</p>
                                <div className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                {/* MEGA MODO IA: SEARCH ENGINE */}
            <div className="bg-gradient-to-br from-[#0A0A12] to-[#11111E] border border-indigo-500/20 rounded-[40px] p-8 md:p-16 mb-12 relative overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.05)] text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl pointer-events-none">
                    <Globe className="w-96 h-96 text-indigo-500" />
                </div>
                
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 z-10 flex items-center justify-center gap-4">
                    <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
                    Hola, {user?.user_metadata?.first_name || 'Estratega'}
                </h3>
                <p className="text-gray-400 text-sm md:text-base font-bold uppercase tracking-[0.2em] mb-10 z-10">
                    ¿Qué empresa, marca o ecosistema digital deseas analizar hoy?
                </p>

                <div className="w-full max-w-3xl relative z-10">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-[#0A0A12] border border-white/10 rounded-[2rem] p-3 md:p-4 flex items-center gap-4 shadow-2xl">
                            <Bot className="w-6 h-6 md:w-8 md:h-8 text-indigo-400 ml-2 md:ml-4 shrink-0" />
                            <div className="flex-1 flex flex-col">
                                <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-0.5 ml-1">Escanear Activo Digital</span>
                                <input 
                                    type="text" 
                                    placeholder="Pega el enlace web (Ej: tupaginaweb.com) o perfil social..."
                                    value={profile.websiteUrl || profile.instagramUrl || ''}
                                    onChange={(e) => {
                                       const val = e.target.value;
                                       handleChange('websiteUrl', val);
                                    }}
                                    className="bg-transparent border-none text-white text-base md:text-xl focus:outline-none flex-1 font-medium placeholder:text-gray-600"
                                />
                            </div>
                            <button 
                                onClick={handleSimulateSync}
                                disabled={!profile.websiteUrl && !profile.instagramUrl}
                                className={`px-4 py-3 md:px-8 font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
                                    hasUnsyncedUrl 
                                    ? 'bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.5)] animate-pulse' 
                                    : 'bg-white text-black hover:bg-indigo-50 shadow-xl'
                                } disabled:opacity-50 disabled:bg-gray-800 disabled:text-gray-500 group relative overflow-hidden`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {isSimulatingScrape ? <Activity className="w-5 h-5 animate-pulse text-white" /> : <Command className="w-5 h-5" />}
                                <span className="relative z-10">{isSimulatingScrape ? 'INVESTIGANDO...' : 'REPORTE IA'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick actions chips - REINSTATED BY USER REQUEST */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        <button 
                            disabled={activeInsightBtn === 'competitors'}
                            onClick={() => handleQuickInsight('competitors', 'Competidores')}
                            className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-xs font-black hover:bg-white/10 hover:border-indigo-500/50 transition-all uppercase tracking-[0.15em] flex items-center gap-2 disabled:opacity-50"
                        >
                           {activeInsightBtn === 'competitors' ? <Activity size={14} className="text-indigo-400 animate-pulse" /> : <Globe size={14} className="text-gray-400" />}
                           {activeInsightBtn === 'competitors' ? 'Extrayendo...' : 'Analizar Competidores'}
                        </button>
                        <button 
                            disabled={activeInsightBtn === 'friction'}
                            onClick={() => handleQuickInsight('friction', 'Puntos de Fricción CRO')}
                            className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-xs font-black hover:bg-white/10 hover:border-pink-500/50 transition-all uppercase tracking-[0.15em] flex items-center gap-2 disabled:opacity-50"
                        >
                           {activeInsightBtn === 'friction' ? <Activity size={14} className="text-pink-400 animate-pulse" /> : <TargetIcon size={14} className="text-gray-400" />}
                           Detectar Puntos de Fricción
                        </button>
                        <button 
                            disabled={activeInsightBtn === 'traffic'}
                            onClick={() => handleQuickInsight('traffic', 'Rutas de Tráfico B2B')}
                            className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-xs font-black hover:bg-white/10 hover:border-emerald-500/50 transition-all uppercase tracking-[0.15em] flex items-center gap-2 disabled:opacity-50"
                        >
                           {activeInsightBtn === 'traffic' ? <Activity size={14} className="text-emerald-400 animate-pulse" /> : <Activity size={14} className="text-gray-400" />}
                           Auditoría de Tráfico B2B
                        </button>
                    </div>
                </div>
            </div>

            {/* Inline Research Chat - Activated once a URL is typed */}
            <AnimatePresence>
            {profile.websiteUrl && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 w-full max-w-3xl mx-auto rounded-3xl overflow-hidden backdrop-blur-xl bg-[#0F0F15]/80 border border-white/5 shadow-2xl relative"
                    >
                        <div className="bg-indigo-500/10 px-6 py-3 border-b border-indigo-500/20 flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                                <Bot size={14} /> Investigación Continua
                            </span>
                            {chatMessages.length > 0 && (
                                <button onClick={() => setChatMessages([])} className="text-xs text-gray-500 hover:text-white uppercase tracking-widest font-bold">Limpiar</button>
                            )}
                        </div>
                        
                        <div className="p-4 md:p-6 min-h-[150px] max-h-[300px] overflow-y-auto space-y-4 text-left custom-scrollbar">
                            {chatMessages.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-center opacity-50 py-8">
                                    <p className="text-sm text-gray-400 font-medium">Chatea con el escáner. Ej: "¿Qué cursos de ganadería tienen y cuándo inician?"</p>
                                </div>
                            ) : (
                                chatMessages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-indigo-600/30 text-indigo-100 border border-indigo-500/30 rounded-br-none' : 'bg-white/5 text-gray-300 border border-white/10 rounded-bl-none'}`}>
                                            <div style={{ whiteSpace: "pre-wrap" }} className="leading-relaxed">
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            {isChatting && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 text-gray-300 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-50">Investigando web...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-2 border-t border-white/5 bg-black/40">
                            {/* File Preview Chip */}
                            <AnimatePresence>
                                {selectedFile && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                        className="mx-2 mb-2 p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <FileUp size={14} className="text-indigo-400 shrink-0" />
                                            <span className="text-[10px] text-white font-bold truncate uppercase tracking-widest">{selectedFile.name}</span>
                                        </div>
                                        <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                                            <Trash2 size={12} />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleResearchChat} className="relative flex items-center gap-1">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setSelectedFile(e.target.files[0]);
                                            toast.success(`Archivo cargado: ${e.target.files[0].name}`, { icon: '📎' });
                                        }
                                    }}
                                />
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3 text-gray-500 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all"
                                    title="Adjuntar archivo o audio"
                                >
                                    <Paperclip size={18} />
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => toast.info('Grabación de voz próximamente disponible')}
                                    className="p-3 text-gray-500 hover:text-rose-400 hover:bg-white/5 rounded-xl transition-all"
                                    title="Enviar audio"
                                >
                                    <Mic size={18} />
                                </button>

                                <input 
                                    type="text" 
                                    className="flex-1 bg-transparent border-none text-sm text-white px-2 py-3 focus:outline-none placeholder:text-gray-600"
                                    placeholder="Pregúntale algo profundo al investigador..."
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    disabled={isChatting}
                                />
                                <button 
                                    type="submit"
                                    disabled={(!chatInput.trim() && !selectedFile) || isChatting}
                                    className="p-3 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-400 rounded-xl transition-all disabled:opacity-30 flex items-center justify-center min-w-[48px]"
                                >
                                    <Sparkles size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>


            {/* Tactical Grid Container */}
                {/* Visual feedback if fields are filled by system */}
                <AnimatePresence>
                    {isPreviewMode && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute -inset-4 border-2 border-indigo-500/20 rounded-[48px] pointer-events-none z-0"
                            style={{ boxShadow: '0 0 100px rgba(99,102,241,0.05) inset' }}
                        />
                    )}
                </AnimatePresence>

            <div key={`sync-grid-${syncCount}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative mt-16 w-full">
                    <div className="relative z-10">{renderInput('NOMBRE DE MARCA', 'brandName', Tag, user?.user_metadata?.brand || 'Ej. DIIC ZONE INC.')}</div>
                    <div className="relative z-10">{renderInput('LIDERAZGO / FUNDADORES', 'leadership', ShieldCheck, 'Ej. Ing. Mauro Borja - CEO...')}</div>
                    <div className="relative z-10">{renderInput('¿QUÉ HACE?', 'whatItDoes', Network, 'Ej. Consultoría en Inteligencia Artificial...')}</div>
                    <div className="relative z-10">{renderInput('¿QUÉ OFRECE?', 'whatItOffers', Zap, 'Ej. Asesorías High-Ticket, Cursos, SaaS...', true)}</div>
                    <div className="relative z-10">{renderInput('PÚBLICO OBJETIVO', 'targetAudience', Users, 'Ej. Dueños de negocios B2B, edad 30-45...', true)}</div>
                    <div className="relative z-10">{renderInput('PROBLEMA QUE RESUELVE', 'problemSolved', Search, 'Ej. Falta de tiempo, procesos manuales lentos...', true)}</div>
                    <div className="relative z-10">{renderInput('PROPUESTA DE VALOR', 'valueProp', TargetIcon, 'Ej. Aumentamos tus ventas un 30% usando automatizaciones en 30 días.', true)}</div>
                    <div className="relative z-10">{renderInput('CONTEXTO DE MERCADO', 'marketContext', Globe, 'Ej. Líderes en el sector agropecuario de Ecuador...', true)}</div>
                    <div className="relative z-10">{renderInput('TONO DE COMUNICACIÓN', 'tone', Heart, 'Ej. Profesional, directo, corporativo, disruptivo...')}</div>
                    <div className="relative z-10">{renderInput('OBJETIVO PRINCIPAL', 'mainGoal', Target, 'Ej. Lograr $100K MRR para Q3 2024.', true)}</div>
                    
                    {/* Strategic Recording Formats Card */}
                    <div className="bg-[#0A0A0F] border border-white/5 rounded-[32px] p-6 space-y-4 hover:border-indigo-500/30 transition-all duration-300 group relative shadow-lg hover:shadow-indigo-500/10 flex flex-col h-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <label className="text-sm font-black text-white uppercase italic tracking-widest">Formatos de Grabación</label>
                            </div>
                            <button 
                                onClick={() => setShowFormats(true)}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                            >
                                <Maximize2 size={14} />
                            </button>
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 gap-2 mt-2">
                            {RECORDING_FORMATS.map(f => (
                                <div key={f.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group/item hover:bg-white/[0.04] transition-colors">
                                    <div className="flex flex-col">
                                        <span className={`text-[9px] font-black uppercase tracking-widest bg-gradient-to-r ${f.color} bg-clip-text text-transparent`}>{f.label}</span>
                                        <span className="text-[10px] text-gray-500 font-medium truncate max-w-[180px] italic">{f.strategy.substring(0, 45)}...</span>
                                    </div>
                                    <f.icon size={14} className="text-gray-700 group-hover/item:text-gray-400 transition-colors" />
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => setShowFormats(true)}
                            className="w-full py-2.5 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                            Ver Configuración Completa
                        </button>
                    </div>
                </div>

            {/* Intel Modules: Competitors & Allies */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 mb-12">
                
                {/* Competitors Module */}
                <div className="bg-[#0A0A0F] border border-rose-500/20 rounded-[32px] p-8 space-y-6 relative overflow-hidden group hover:border-rose-500/40 transition-colors">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Crosshair className="w-32 h-32 text-rose-500" />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-inner">
                                <Crosshair className="w-6 h-6 text-rose-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Competidores</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Análisis de Mercado Directo</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => addArrayItem('competitors', { name: '', url: '', social: '', reviews: '' })}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 flex items-center justify-center text-white transition-all active:scale-95 shadow-lg"
                        >
                            <Plus className="w-5 h-5 text-rose-400" />
                        </button>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {profile.competitors?.map((comp, idx) => (
                            <div key={idx} className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
                                <div className="flex justify-between items-center bg-white/5 rounded-xl p-2 border border-white/5 focus-within:border-rose-500/30 transition-colors">
                                    <input 
                                        type="text" 
                                        placeholder="Nombre del Competidor..." 
                                        value={comp.name || ''}
                                        onChange={(e) => handleArrayChange('competitors', idx, 'name', e.target.value)}
                                        className="bg-transparent border-none text-white font-black text-sm uppercase px-3 focus:outline-none flex-1"
                                    />
                                    <button onClick={() => removeArrayItem('competitors', idx)} className="p-2 text-gray-500 hover:text-rose-500 bg-white/5 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input type="text" placeholder="Sitio Web (URL)" value={comp.url || ''} onChange={(e) => handleArrayChange('competitors', idx, 'url', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 font-medium text-xs focus:outline-none focus:border-rose-500/50 transition-colors" />
                                    <input type="text" placeholder="Ubicación / Alcance" value={comp.location || ''} onChange={(e) => handleArrayChange('competitors', idx, 'location', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 font-medium text-xs focus:outline-none focus:border-rose-500/50 transition-colors" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input type="text" placeholder="Redes Sociales" value={comp.social || ''} onChange={(e) => handleArrayChange('competitors', idx, 'social', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 font-medium text-xs focus:outline-none focus:border-rose-500/50 transition-colors" />
                                    <button 
                                        onClick={() => handleQuickInsight('competitors', 'Detective de Competencia')}
                                        className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-all text-[10px] font-black uppercase tracking-widest text-rose-400"
                                    >
                                        <Bot className="w-3 h-3" /> Investigar a fondo
                                    </button>
                                </div>
                                <textarea 
                                    placeholder="Análisis Estratégico (Fortalezas vs Debilidades)..." 
                                    value={comp.strengthsWeaknesses || comp.reviews || ''} 
                                    onChange={(e) => handleArrayChange('competitors', idx, 'strengthsWeaknesses', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 font-medium text-xs focus:outline-none focus:border-rose-500/50 transition-colors resize-none h-24 italic leading-relaxed" 
                                />
                            </div>
                        ))}
                        {(!profile.competitors || profile.competitors.length === 0) && (
                            <div className="text-center py-8 opacity-50 border border-dashed border-rose-500/20 rounded-3xl bg-rose-500/5">
                                <Search className="w-8 h-8 text-rose-500/50 mx-auto mb-2" />
                                <p className="text-[10px] text-rose-400/80 uppercase font-black tracking-widest">Sin competidores registrados</p>
                                <p className="text-[9px] text-gray-500 mt-1 font-medium">Añade o deja que la IA investigue simulados</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Strategic Allies Module */}
                <div className="bg-[#0A0A0F] border border-blue-500/20 rounded-[32px] p-8 space-y-6 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <ShieldCheck className="w-32 h-32 text-blue-500" />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-inner">
                                <ShieldAlert className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Aliados Estratégicos</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Partners & Proveedores Clave</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => addArrayItem('strategicAllies', { name: '', url: '', social: '', tagReason: '' })}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/30 flex items-center justify-center text-white transition-all active:scale-95 shadow-lg"
                        >
                            <Plus className="w-5 h-5 text-blue-400" />
                        </button>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {profile.strategicAllies?.map((ally, idx) => (
                            <div key={idx} className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
                                <div className="flex justify-between items-center bg-white/5 rounded-xl p-2 border border-white/5 focus-within:border-blue-500/30 transition-colors">
                                    <input 
                                        type="text" 
                                        placeholder="Nombre del Aliado..." 
                                        value={ally.name || ''}
                                        onChange={(e) => handleArrayChange('strategicAllies', idx, 'name', e.target.value)}
                                        className="bg-transparent border-none text-white font-black text-sm uppercase px-3 focus:outline-none flex-1"
                                    />
                                    <button onClick={() => removeArrayItem('strategicAllies', idx)} className="p-2 text-gray-500 hover:text-blue-500 bg-white/5 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input type="text" placeholder="Sitio Web (URL)" value={ally.url || ''} onChange={(e) => handleArrayChange('strategicAllies', idx, 'url', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 font-medium text-xs focus:outline-none focus:border-blue-500/50 transition-colors" />
                                    <input type="text" placeholder="Redes (Para Etiquetar)" value={ally.social || ''} onChange={(e) => handleArrayChange('strategicAllies', idx, 'social', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 font-medium text-xs focus:outline-none focus:border-blue-500/50 transition-colors" />
                                </div>
                                <input type="text" placeholder="¿Por qué etiquetarlos? (Ej. Proveedor de Software...)" value={ally.tagReason || ''} onChange={(e) => handleArrayChange('strategicAllies', idx, 'tagReason', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 font-medium text-xs focus:outline-none focus:border-blue-500/50 transition-colors" />
                            </div>
                        ))}
                        {(!profile.strategicAllies || profile.strategicAllies.length === 0) && (
                            <div className="text-center py-8 opacity-50 border border-dashed border-blue-500/20 rounded-3xl bg-blue-500/5">
                                <Network className="w-8 h-8 text-blue-500/50 mx-auto mb-2" />
                                <p className="text-[10px] text-blue-400/80 uppercase font-black tracking-widest">Sin aliados registrados</p>
                                <p className="text-[9px] text-gray-500 mt-1 font-medium">Añade marcas amigas para tu ecosistema de networking</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* STRATEGIC SNAPSHOTS: USER SAVED INVESTIGATIONS */}
            <div className="mt-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                            <Database size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Investigaciones Guardadas</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">Snapshot Estratégico de Identidad</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleSaveSnapshot}
                        className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center gap-2"
                    >
                        <Plus size={14} /> Nuevo Snapshot
                    </button>
                </div>

                {profile.snapshots && profile.snapshots.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profile.snapshots.map((snapshot) => (
                            <div key={snapshot.id} className="bg-[#0A0A0F] border border-white/5 rounded-[32px] p-6 space-y-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full" />
                                
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <h4 className="text-xs font-black text-white uppercase tracking-widest">{snapshot.name}</h4>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                            {new Date(snapshot.date).toLocaleDateString()} • {new Date(snapshot.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => deleteSnapshot(snapshot.id)}
                                        className="p-2 text-gray-600 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div className="space-y-3 mb-6 min-h-[60px]">
                                    <p className="text-xs text-gray-400 font-medium leading-relaxed italic">
                                        {snapshot.brandName ? `Configuración estratégica optimizada para ${snapshot.brandName}.` : 'Respaldo integral de identidad, mercado y metas principales para blindaje de marca.'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[8px] font-black text-indigo-400 uppercase tracking-widest">Estrategia Activa</span>
                                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[8px] font-black text-emerald-400 uppercase tracking-widest">Snapshot de Seguridad</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleApplySnapshot(snapshot)}
                                    className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 mb-2"
                                >
                                    <CheckCircle2 size={14} /> Activar Investigación
                                </button>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setSelectedSnapshotForPreview(snapshot)}
                                        className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Maximize2 size={12} /> Vista Previa
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setSelectedSnapshotForPreview(snapshot);
                                            setTimeout(() => window.print(), 500);
                                        }}
                                        className="flex-1 py-3 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <FileUp size={12} /> PDF
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">No hay investigaciones guardadas aún</p>
                        <p className="text-xs text-gray-500 mt-2 font-medium">Guarda versiones de tu perfil para comparar estrategias</p>
                    </div>
                )}
            </div>

            {/* AI Generated Insights Section (Saved in DB) */}
            {profile.insights && Object.keys(profile.insights).length > 0 && (
                <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                            <Bot size={20} />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Reportes de Inteligencia</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(profile.insights).map(([key, data]) => (
                            <div key={key} className="bg-[#0A0A0F] border border-white/5 rounded-[32px] p-8 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-widest italic">{data.title}</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Generado el {new Date(data.date).toLocaleDateString()}</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const newInsights = { ...profile.insights };
                                            delete newInsights[key];
                                            const updatedProfile = { ...profile, insights: newInsights };
                                            setProfile(updatedProfile);
                                            toast.info("Reporte eliminado. Actualizando base de datos...");
                                            handleConfirm(updatedProfile);
                                        }}
                                        className="p-2 text-gray-600 hover:text-rose-500 transition-colors print:hidden"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                
                                <div className="space-y-3 mb-6 min-h-[70px]">
                                    <p className="text-xs text-gray-300 font-medium leading-relaxed line-clamp-3">
                                        {data.content ? data.content.substring(0, 160).replace(/[#*]/g, '') + '...' : 'Análisis profundo de mercado, detección de fricciones UX y optimización de activos digitales en tiempo real.'}
                                    </p>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded-md text-[8px] font-black text-rose-400 uppercase tracking-widest">Inteligencia IA</span>
                                        <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[8px] font-black text-indigo-400 uppercase tracking-widest">Optimización Omni</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <button 
                                        onClick={() => {
                                            setInsightData({ title: data.title, content: data.content, loading: false });
                                            setInsightModalOpen(true);
                                        }}
                                        className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Maximize2 size={12} /> Abrir Reporte
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setInsightData({ title: data.title, content: data.content, loading: false });
                                            setInsightModalOpen(true);
                                            setTimeout(() => window.print(), 500);
                                        }}
                                        className="flex-1 py-3 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <FileUp size={12} /> PDF
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="mt-12 flex justify-end gap-4">
                 <button 
                    onClick={handleSaveSnapshot}
                    className="px-8 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 active:scale-95 transition-all flex items-center gap-3"
                >
                    <Database className="w-5 h-5 text-gray-400" />
                    Guardar Investigación
                 </button>

                 <button 
                    onClick={handleConfirm}
                    disabled={isSaving}
                    className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                     {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     ) : (
                        <CheckCircle2 className="w-5 h-5" /> 
                     )}
                     {isSaving ? 'Guardando...' : 'Confirmar Identidad'}
                 </button>
            </div>
                </>
            )}

            {/* CUSTOM SNAPSHOT NAME MODAL */}
            <AnimatePresence>
                {isSnapshotModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-[#050508]/80"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0A0A12] border border-indigo-500/30 rounded-[40px] p-10 max-w-xl w-full shadow-[0_0_100px_rgba(99,102,241,0.15)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <Database className="w-48 h-48 text-indigo-500" />
                            </div>

                            <div className="relative z-10 space-y-8">
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-400 mb-4">
                                        <Database size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Guardar Investigación</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">Asigna un nombre para este snapshot estratégico</p>
                                </div>

                                <div className="relative">
                                    <input 
                                        type="text" 
                                        autoFocus
                                        value={tempSnapshotName}
                                        onChange={(e) => setTempSnapshotName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold text-lg focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-700"
                                        placeholder="Ej. Análisis de Mercado Q4..."
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500/30">
                                        <Edit3 size={20} />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        onClick={() => setIsSnapshotModalOpen(false)}
                                        className="flex-1 py-5 bg-white/5 text-gray-400 font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={confirmSaveSnapshot}
                                        className="flex-2 px-12 py-5 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95"
                                    >
                                        Guardar Snapshot
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SNAPSHOT PREVIEW MODAL */}
            <AnimatePresence>
                {selectedSnapshotForPreview && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-3xl bg-black/90"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#050508] border border-white/10 rounded-[40px] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(99,102,241,0.1)]"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                                        <Database size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{selectedSnapshotForPreview.name}</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Snapshot Histórico • {new Date(selectedSnapshotForPreview.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => window.print()}
                                        className="px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all flex items-center gap-2 print:hidden"
                                    >
                                        <FileUp size={14} /> Exportar PDF
                                    </button>
                                    <button 
                                        onClick={() => setSelectedSnapshotForPreview(null)}
                                        className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center justify-center border border-white/10"
                                    >
                                        <Maximize2 size={18} className="rotate-45" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[
                                        { label: 'Marca', field: 'brandName', icon: Tag },
                                        { label: 'Liderazgo', field: 'leadership', icon: ShieldCheck },
                                        { label: 'Actividad', field: 'whatItDoes', icon: Network },
                                        { label: 'Oferta', field: 'whatItOffers', icon: Zap },
                                        { label: 'Público', field: 'targetAudience', icon: Users },
                                        { label: 'Problema', field: 'problemSolved', icon: Search },
                                        { label: 'Propuesta de Valor', field: 'valueProp', icon: TargetIcon },
                                        { label: 'Mercado', field: 'marketContext', icon: Globe },
                                        { label: 'Tono', field: 'tone', icon: Heart },
                                        { label: 'Meta Principal', field: 'mainGoal', icon: Target },
                                    ].map((item, idx) => (
                                        <div key={idx} className="space-y-3 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                                            <div className="flex items-center gap-3 opacity-50">
                                                <item.icon size={16} className="text-indigo-400" />
                                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.label}</span>
                                            </div>
                                            <p className="text-sm text-gray-200 font-medium leading-relaxed italic">
                                                {selectedSnapshotForPreview.data[item.field] || 'Dato no registrado en esta versión.'}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-12 border-t border-white/5 text-center opacity-30">
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.5em]">DIIC ZONE • ECOSISTEMA ESTRATÉGICO SEGURO</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* STRATEGIC INSIGHT MODAL */}
            <AnimatePresence>
                {insightModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setInsightModalOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="w-full max-w-2xl bg-[#0A0A0F] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Bot className="w-64 h-64 text-indigo-500" />
                            </div>
                            
                            <div className="p-8 md:p-10 relative z-10 max-h-[85vh] flex flex-col">
                                <div className="flex justify-between items-center mb-8 shrink-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                            {insightData.loading ? <Activity className="w-7 h-7 animate-pulse" /> : <Bot className="w-7 h-7" />}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{insightData.title}</h3>
                                            <p className="text-[10px] text-indigo-500/70 font-black uppercase tracking-[0.3em] mt-1">Intelligence Report v2.5</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setInsightModalOpen(false)}
                                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest print:hidden"
                                    >
                                        <span>Entendido</span>
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                    {insightData.loading ? (
                                        <div className="py-20 text-center space-y-6">
                                            <div className="relative w-20 h-20 mx-auto">
                                                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
                                                <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Zap className="w-8 h-8 text-indigo-400 animate-pulse" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-lg font-black uppercase tracking-widest text-white italic">Investigando profundamente...</p>
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Midiendo rutas de mercado y fricción UX</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                                <div className="relative z-10 p-2 md:p-4">
                                                    <StrategicReportViewer content={insightData.content} />
                                                </div>
                                            
                                            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                                <p className="text-[10px] text-emerald-400/70 font-black uppercase tracking-widest">Datos verificados con Grounding IA en tiempo real</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {!insightData.loading && (
                                    <div className="mt-8 pt-6 border-t border-white/5 shrink-0">
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => setTimeout(() => window.print(), 200)}
                                                className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-2 print:hidden"
                                            >
                                                <FileUp size={18} /> Exportar PDF
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    toast.success("Investigación asegurada en tu base de datos");
                                                    setInsightModalOpen(false);
                                                }}
                                                className="flex-2 w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 print:hidden"
                                            >
                                                <Database size={18} /> Guardar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DEEP DIVE EXPANSION MODAL */}
            <AnimatePresence>
                {expandedField && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        onClick={() => setExpandedField(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="w-full max-w-4xl bg-[#0A0A0F] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 md:p-12">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                                            <expandedField.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{expandedField.label}</h3>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                                                <Activity size={10} className="text-indigo-500" /> Modo Profundidad Estratégica
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setExpandedField(null)}
                                        className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all outline-none"
                                    >
                                        <Trash2 className="w-6 h-6 rotate-45" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
                                        <textarea 
                                            value={profile[expandedField.field] || ''}
                                            onChange={(e) => handleChange(expandedField.field, e.target.value)}
                                            className="w-full min-h-[350px] bg-[#0F0F1A] border border-white/10 rounded-3xl p-8 text-xl text-gray-300 font-medium leading-relaxed focus:outline-none focus:border-indigo-500/50 transition-all custom-scrollbar"
                                            placeholder="Desarrolla aquí la idea profunda..."
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <button 
                                            onClick={() => handleFieldAIAction(expandedField.field, 'refine')}
                                            disabled={isFieldLoading}
                                            className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 disabled:opacity-50 group"
                                        >
                                            {isFieldLoading ? <Activity className="w-5 h-5 animate-pulse" /> : <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />} 
                                            Investigar en la Web
                                        </button>
                                        <button 
                                            onClick={() => handleFieldAIAction(expandedField.field, 'persuade')}
                                            disabled={isFieldLoading || !profile[expandedField.field]}
                                            className="flex-1 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                                        >
                                            <Sparkles className="w-5 h-5 text-emerald-400 group-hover:animate-pulse" />
                                            Optimizar Copy Estratégico
                                        </button>
                                    </div>
                                    
                                    <p className="text-[10px] text-gray-600 text-center font-bold uppercase tracking-widest pt-4">
                                        Los cambios se guardan automáticamente en tu perfil estratégico local.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Recording Formats Modal */}
            <RecordingFormatsModal 
                isOpen={showFormats} 
                onClose={() => setShowFormats(false)} 
                profile={profile}
            />
            {/* Floating Action Button for Save (Visible only in Edit Mode) */}
            {!isPreviewMode && (
                <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <button 
                        onClick={() => handleConfirm(profile)}
                        disabled={isSaving}
                        className="px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.5)] transition-all flex items-center gap-3 active:scale-95 group"
                    >
                        {isSaving ? (
                            <Activity className="w-5 h-5 animate-pulse" />
                        ) : (
                            <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        )}
                        <span>{isSaving ? 'SINCRONIZANDO...' : 'SINCRONIZAR ECOSISTEMA'}</span>
                    </button>
                </div>
            )}
        </div>
    );
}

