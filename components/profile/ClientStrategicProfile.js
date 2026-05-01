'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Network, Tag, Target, Users, Search, Target as TargetIcon, Zap, Heart, Link as LinkIcon, Globe, Image as ImageIcon, CheckCircle2, ShieldAlert, Crosshair, Plus, Trash2, ShieldCheck, Activity, Bot, Sparkles, Database, Command, Maximize2, Wand2, Edit3, Paperclip, Mic, FileUp, Facebook, Instagram, Linkedin } from 'lucide-react';
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
        whatsappNumber: ''
    });

    const [syncCount, setSyncCount] = useState(0);
    const [showFormats, setShowFormats] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isSimulatingScrape, setIsSimulatingScrape] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
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

    const handleConfirm = async () => {
        if (!clientId) {
            toast.error("Error: No se encontró la sesión del cliente.");
            return;
        }
        
        setIsSaving(true);
        try {
            // Strip out non-strategic keys to avoid large/circular payloads
            const { id, created_at, metadata, onboarding_data, editor, filmmaker, ...strategicData } = profile;

            // Limpiamos referencias circulares o data inválida de onboarding_data actual
            const safeOnboardingData = onboarding_data ? JSON.parse(JSON.stringify(onboarding_data)) : {};

            const updatePayload = {
                name: profile.brandName,
                onboarding_data: {
                    ...safeOnboardingData,
                    strategic: { 
                        ...strategicData, 
                        websiteUrl: profile.websiteUrl || '', 
                        instagramUrl: profile.instagramUrl || ''
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
            
            toast.success("Perfil estratégico guardado con éxito");
        } catch (error) {
            console.error("Strategic Profile save error:", error);
            toast.error("Error al guardar: " + (error.message || "Problema de red"));
        } finally {
            setIsSaving(false);
        }
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
            setProfile(prev => ({
                ...prev,
                brandName: d.brandName || prev.brandName,
                leadership: d.leadership || "Datos no hallados en el footprint público.",
                whatItDoes: d.whatItDoes || "Información pendiente de extracción profunda.",
                whatItOffers: d.whatItOffers || "Servicios/Productos no detectados.",
                targetAudience: d.targetAudience || "Público general del sector.",
                problemSolved: d.problemSolved || "Problemas comunes de la industria.",
                valueProp: d.valueProp || "Propuesta en fase de definición.",
                tone: d.tone || "Profesional",
                mainGoal: d.mainGoal || "Ventas y Autoridad",
                marketContext: d.marketContext || "Contexto de mercado estándar."
            }));
            
            setSyncCount(c => c + 1);

            // Use the real steps from the engine
            const displaySteps = result.steps || [
                { msg: 'Rastreando activos...', icon: 'Target' },
                { msg: 'Mapeando core...', icon: 'Bot' },
                { msg: 'Generando reporte...', icon: 'Database' }
            ];

            for (const step of displaySteps) {
                setAnalysisMsg(step.msg);
                await new Promise(r => setTimeout(r, 1000)); // Slightly longer for 'God Mode' feel
            }
            
            setHasUnsyncedUrl(false);
            toast.success("Investigación Omni-Nivel completada con éxito");

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
                    setProfile(p => ({ ...p, competitors: res.competitors }));
                    toast.success("Competidores inyectados en la cuadrícula inferior", { id: 'comp-toast' });
                }
            } else {
                setInsightData({ title, content: res.insight, loading: false });
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
            </div>

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
                            <button 
                                onClick={handleSimulateSync}
                                disabled={!profile.websiteUrl}
                                className={`px-4 py-3 md:px-8 font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
                                    hasUnsyncedUrl 
                                    ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] animate-pulse' 
                                    : 'bg-white text-black hover:bg-gray-200'
                                } disabled:opacity-50 disabled:bg-gray-800 disabled:text-gray-500`}
                            >
                                {isSimulatingScrape ? <Activity className="w-5 h-5 animate-pulse text-white" /> : <Command className="w-5 h-5" />}
                                {isSimulatingScrape ? 'ANALIZANDO...' : 'MODO IA'}
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
                    
                    {/* Recording Formats Button */}
                    <div className="relative z-10 flex flex-col justify-end pb-4">
                        <button 
                            onClick={() => setShowFormats(!showFormats)}
                            className="w-full flex items-center justify-between gap-4 p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all group shadow-lg shadow-indigo-500/5 mt-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Activity size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">PRODUCCIÓN</p>
                                    <p className="text-xs text-white font-bold">FORMATOS DE GRABACIÓN</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/40 transition-colors">
                                <Maximize2 size={16} className="text-gray-400 group-hover:text-indigo-400" />
                            </div>
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
            
            <div className="mt-12 flex justify-end">
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
                                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all"
                                    >
                                        <Trash2 className="w-5 h-5 rotate-45" />
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
                                        <button 
                                            onClick={() => setInsightModalOpen(false)}
                                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={18} /> Entendido
                                        </button>
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
        </div>
    );
}
