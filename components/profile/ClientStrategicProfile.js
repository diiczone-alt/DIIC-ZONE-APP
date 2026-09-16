'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Brain, Network, Tag, Target, Users, Search, Target as TargetIcon, Zap, Heart, Link as LinkIcon, Globe, Image as ImageIcon, CheckCircle2, ShieldAlert, Crosshair, Plus, Trash2, ShieldCheck, Activity, Bot, Sparkles, Database, Command, Maximize2, Wand2, Edit3, Paperclip, Mic, FileUp, Facebook, Instagram, Linkedin, Camera, Smartphone, Monitor, Layout, Layers, Video, X, MapPin, FolderOpen, Bookmark, Folder, FolderPlus, Printer, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { agencyService } from '@/services/agencyService';
import { aiService } from '@/services/aiService';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import SavedResearchesModal from '@/components/strategy/SavedResearchesModal';
import SavedResearchesManager from '@/components/strategy/SavedResearchesManager';
import StrategicBrainChat from '@/components/strategy/StrategicBrainChat';
import StrategicBrainStudio from '@/components/strategy/StrategicBrainStudio';
import StrategicMindMapModal from '@/components/strategy/StrategicMindMapModal';
import { generateResearchPdf } from '@/components/strategy/ResearchPdfExporter';

// Helper to decode HTML entities from titles
const decodeEntities = (text) => {
    if (!text) return '';
    if (typeof window === 'undefined') return text;
    const temp = document.createElement('textarea');
    temp.innerHTML = text;
    return temp.value;
};

// Safe date and time helpers
const formatDateSafe = (dateVal, options, fallback = '') => {
    if (!dateVal) return fallback;
    try {
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return fallback;
        return options ? d.toLocaleDateString('es-ES', options) : d.toLocaleDateString();
    } catch {
        return fallback;
    }
};

const formatTimeSafe = (dateVal, fallback = '') => {
    if (!dateVal) return fallback;
    try {
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return fallback;
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return fallback;
    }
};

// Helper component for Claude-style professional markdown rendering
const ClaudeStyleMarkdownViewer = ({ content }) => {
    if (!content) return null;

    const blocks = content.replace(/\r\n/g, '\n').split(/\n\n+/);

    return (
        <div className="space-y-4 text-gray-200 leading-relaxed font-sans text-xs md:text-sm antialiased">
            {blocks.map((block, bIdx) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                // 1. Alert boxes / Blockquotes (either starts with > or matches warning trigger pattern)
                const isWarningTrigger = trimmed.startsWith('>') || 
                                         /^(es importante señalar|nota|atención|advertencia|importante|cuidado):/i.test(trimmed);

                if (isWarningTrigger) {
                    const cleanText = trimmed.startsWith('>') ? trimmed.slice(1).trim() : trimmed;
                    const isImportantOrWarning = /^(es importante señalar|atención|advertencia|importante)/i.test(cleanText);
                    
                    return (
                        <div 
                            key={bIdx} 
                            className={`p-4 rounded-2xl border backdrop-blur-md flex gap-3 my-3 animate-in fade-in slide-in-from-left-2 duration-500 ${
                                isImportantOrWarning 
                                    ? 'bg-rose-500/5 border-rose-500/20 text-rose-200' 
                                    : 'bg-indigo-500/5 border-indigo-500/20 text-indigo-200'
                            }`}
                        >
                            <div className="shrink-0 mt-0.5">
                                {isImportantOrWarning ? (
                                    <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                                ) : (
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                )}
                            </div>
                            <div className="space-y-1 flex-1">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                                    {isImportantOrWarning ? 'Nota Estratégica / Alerta' : 'Sugerencia de Investigación'}
                                </span>
                                <p className="text-[11px] md:text-xs font-medium leading-relaxed">
                                    {cleanText.split('**').map((part, i) => (
                                        i % 2 === 1 
                                            ? <strong key={i} className="text-white font-bold">{part}</strong> 
                                            : part
                                    ))}
                                </p>
                            </div>
                        </div>
                    );
                }

                // 2. Headings (starts with # or ## or ###)
                if (trimmed.startsWith('#')) {
                    const level = (trimmed.match(/^#+/) || ['#'])[0].length;
                    const cleanText = trimmed.replace(/^#+\s*/, '');
                    const headingClasses = level === 1 
                        ? "text-base md:text-lg font-black text-white uppercase tracking-wider border-b border-white/10 pb-1.5 mt-5" 
                        : level === 2 
                        ? "text-sm md:text-base font-black text-indigo-300 uppercase tracking-widest mt-3.5" 
                        : "text-xs md:text-sm font-bold text-white tracking-wide mt-2.5";
                    
                    return (
                        <div key={bIdx} className={headingClasses}>
                            {cleanText}
                        </div>
                    );
                }

                // 3. Lists (lines starting with *, -, or numbers)
                const lines = trimmed.split('\n');
                const isList = lines.every(line => /^\s*([\*\-\•]|\d+\.)\s+/.test(line));

                if (isList) {
                    return (
                        <ul key={bIdx} className="space-y-2.5 pl-1 my-2.5">
                            {lines.map((line, lIdx) => {
                                const cleanLine = line.replace(/^\s*([\*\-\•]|\d+\.)\s+/, '').trim();
                                return (
                                    <li key={lIdx} className="flex gap-2.5 text-[11px] md:text-xs text-gray-300 font-medium group">
                                        <div className="w-4 h-4 shrink-0 rounded-md bg-indigo-500/10 border border-white/5 flex items-center justify-center text-indigo-400 group-hover:border-indigo-500/30 transition-colors mt-0.5">
                                            <Zap size={8} className="group-hover:scale-110 transition-transform" />
                                        </div>
                                        <span className="flex-1 leading-relaxed">
                                            {cleanLine.split('**').map((part, i) => (
                                                i % 2 === 1 
                                                    ? <strong key={i} className="text-white font-bold">{part}</strong> 
                                                    : part
                                            ))}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    );
                }

                // 4. Standard Paragraph
                return (
                    <p key={bIdx} className="text-[11px] md:text-xs text-gray-300 font-medium leading-relaxed">
                        {trimmed.split('\n').map((line, lineIdx) => (
                            <React.Fragment key={lineIdx}>
                                {lineIdx > 0 && <br />}
                                {line.split('**').map((part, i) => (
                                    i % 2 === 1 
                                        ? <strong key={i} className="text-white font-bold">{part}</strong> 
                                        : part
                                ))}
                            </React.Fragment>
                        ))}
                    </p>
                );
            })}
        </div>
    );
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
                    className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl print-modal-container"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="w-full max-w-5xl max-h-[90vh] bg-[#0A0A0F] border border-white/10 rounded-[40px] shadow-2xl relative overflow-y-auto custom-scrollbar print-modal-content print-modal-body"
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

const isValidSocialUrl = (url) => {
    if (!url) return false;
    const cleanUrl = url.trim();
    if (cleanUrl.length < 3) return false;
    
    // Check if it's a handle starting with @
    if (cleanUrl.startsWith('@') && cleanUrl.length >= 3) return true;
    
    // Check if it is a standard URL or has a slash and domain
    const socialDomains = ['facebook.com', 'instagram.com', 'tiktok.com', 'youtube.com', 'linkedin.com', 'fb.com', 'youtu.be'];
    const hasSocialDomain = socialDomains.some(domain => cleanUrl.toLowerCase().includes(domain));
    if (hasSocialDomain && cleanUrl.includes('/')) return true;
    
    try {
        if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
            new URL(cleanUrl);
            return true;
        }
        if (cleanUrl.startsWith('www.')) {
            new URL('https://' + cleanUrl);
            return true;
        }
    } catch (_) {
        return false;
    }
    
    const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    return domainRegex.test(cleanUrl);
};

export default function ClientStrategicProfile({ forcedViewMode, activeTab, clientId: propClientId, onOpenSaveModal, onOpenBrainChat, onResearchesChange }) {
    const { user } = useAuth();
    const [activeClientId, setActiveClientId] = useState(propClientId || user?.client_id || null);

    useEffect(() => {
        if (propClientId) {
            setActiveClientId(propClientId);
        } else if (user?.client_id) {
            setActiveClientId(user.client_id);
        }
    }, [propClientId, user?.client_id]);

    // Basic state for the profile
    // Saved researches & folders state
    const [savedResearches, setSavedResearches] = useState([]);
    const [researchFolders, setResearchFolders] = useState([
        { id: 'f_nicho', name: 'Nicho & Pacientes', color: 'indigo' },
        { id: 'f_competencia', name: 'Competencia', color: 'fuchsia' },
        { id: 'f_objeciones', name: 'Objeciones & Fricción', color: 'amber' }
    ]);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isMindMapModalOpen, setIsMindMapModalOpen] = useState(false);
    const [capa1ActiveTab, setCapa1ActiveTab] = useState('search'); // 'search' | 'saved'
    const [capa2ActiveTab, setCapa2ActiveTab] = useState('profile'); // 'profile' | 'brain' | 'saved_sources'

    const [profile, setProfile] = useState({
        brandName: (user?.user_metadata?.brand || '').replace(/[-_\s]+workspace\s*$/i, '').trim(),
        leadership: '',
        whatItDoes: '',
        whatItOffers: '',
        targetAudience: '',
        problemSolved: '',
        valueProp: '',
        tone: '',
        mainGoal: '',
        marketContext: '',
        socialAudit: '',
        competitors: [],
        strategicAllies: [],
        websiteUrl: '',
        instagramUrl: '',
        facebookUrl: '',
        tiktokUrl: '',
        youtubeUrl: '',
        linkedinUrl: '',
        whatsappNumber: '',
        recordingFormats: {
            preferred: 'reels',
            resolution: '4K',
            fps: 30
        },
        insights: {}, // Para guardar reportes de tráfico, fricción, etc.
        goals: [],
        dynamicButtons: []
    });

    const [syncCount, setSyncCount] = useState(0);
    const [showFormats, setShowFormats] = useState(false);
    const [viewMode, setViewMode] = useState(forcedViewMode || 'edit'); // 'edit' or 'report'

    // Social visibility and expand states
    const [visibleSocials, setVisibleSocials] = useState({
        facebook: false,
        instagram: false,
        tiktok: false,
        youtube: false,
        linkedin: false
    });
    const [showMoreSocials, setShowMoreSocials] = useState(false);

    const toggleSocialInput = (network) => {
        setVisibleSocials(prev => ({
            ...prev,
            [network]: !prev[network]
        }));
    };

    useEffect(() => {
        if (profile) {
            setVisibleSocials(prev => ({
                facebook: prev.facebook || !!profile.facebookUrl,
                instagram: prev.instagram || !!profile.instagramUrl,
                tiktok: prev.tiktok || !!profile.tiktokUrl,
                youtube: prev.youtube || !!profile.youtubeUrl,
                linkedin: prev.linkedin || !!profile.linkedinUrl
            }));
        }
    }, [profile.facebookUrl, profile.instagramUrl, profile.tiktokUrl, profile.youtubeUrl, profile.linkedinUrl]);

    useEffect(() => {
        if (forcedViewMode) {
            setViewMode(forcedViewMode);
        }
    }, [forcedViewMode]);
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
            let currentClientId = activeClientId;
            
            // Fallback: Fetch directly from profiles if missing in user context
            if (!currentClientId && user?.id) {
                try {
                    const { data: profileRow } = await supabase
                        .from('profiles')
                        .select('client_id')
                        .eq('id', user.id)
                        .single();
                    if (profileRow?.client_id) {
                        currentClientId = profileRow.client_id;
                        setActiveClientId(currentClientId);
                    }
                } catch (e) {
                    console.log("No client_id found in profile yet:", e);
                }
            }

            if (!currentClientId) {
                console.log("Strategic Profile: No activeClientId found yet.");
                return;
            }
            try {
                const client = await agencyService.getClientById(currentClientId);
                if (client) {
                    const strategic = client.onboarding_data?.strategic || client.metadata?.strategic || {};
                    const social = client.onboarding_data?.social || {};
                    // Load saved researches and folders
                    const rawResearches = client.onboarding_data?.saved_researches || [];
                    const rawFolders = client.onboarding_data?.research_folders || [];
                    if (Array.isArray(rawResearches) && rawResearches.length > 0) {
                        setSavedResearches(rawResearches);
                    } else if (typeof window !== 'undefined') {
                        try {
                            const localRes = localStorage.getItem('diic_saved_researches_' + currentClientId);
                            if (localRes) setSavedResearches(JSON.parse(localRes));
                        } catch(e) {}
                    }
                    if (Array.isArray(rawFolders) && rawFolders.length > 0) {
                        setResearchFolders(rawFolders);
                    }

                    const cleanBrandName = (strategic.brandName || client.name || client.brandName || user?.user_metadata?.brand || '')
                        .replace(/[-_\s]+workspace\s*$/i, '')
                        .trim();

                    setProfile(prev => ({
                        ...prev,
                        ...client,
                        brandName: cleanBrandName,
                        goals: Array.isArray(strategic.goals) ? strategic.goals : (Array.isArray(client.goals) ? client.goals : (Array.isArray(client.onboarding_data?.goals) ? client.onboarding_data.goals : (Array.isArray(prev.goals) ? prev.goals : []))),
                        ...strategic,
                        brandName: cleanBrandName,
                        goals: Array.isArray(strategic.goals) ? strategic.goals : (Array.isArray(client.goals) ? client.goals : (Array.isArray(client.onboarding_data?.goals) ? client.onboarding_data.goals : (Array.isArray(prev.goals) ? prev.goals : []))),
                        competitors: Array.isArray(strategic.competitors) ? strategic.competitors : (Array.isArray(client.competitors) ? client.competitors : (Array.isArray(prev.competitors) ? prev.competitors : [])),
                        strategicAllies: Array.isArray(strategic.strategicAllies) ? strategic.strategicAllies : (Array.isArray(client.strategicAllies) ? client.strategicAllies : (Array.isArray(prev.strategicAllies) ? prev.strategicAllies : [])),
                        snapshots: Array.isArray(strategic.snapshots) ? strategic.snapshots : (Array.isArray(client.snapshots) ? client.snapshots : (Array.isArray(prev.snapshots) ? prev.snapshots : [])),
                        dynamicButtons: Array.isArray(strategic.dynamicButtons) ? strategic.dynamicButtons : (Array.isArray(prev.dynamicButtons) ? prev.dynamicButtons : []),
                        insights: (strategic.insights && typeof strategic.insights === 'object') ? strategic.insights : (prev.insights && typeof prev.insights === 'object' ? prev.insights : {}),
                        websiteUrl: strategic.websiteUrl || (social.instagram ? (social.instagram.startsWith('http') ? social.instagram : `https://instagram.com/${social.instagram.replace(/^@/, '')}`) : prev.websiteUrl),
                        instagramUrl: strategic.instagramUrl || (social.instagram ? (social.instagram.startsWith('http') ? social.instagram : `https://instagram.com/${social.instagram.replace(/^@/, '')}`) : prev.instagramUrl),
                        facebookUrl: strategic.facebookUrl || (social.facebook ? (social.facebook.startsWith('http') ? social.facebook : `https://facebook.com/${social.facebook}`) : prev.facebookUrl),
                        tiktokUrl: strategic.tiktokUrl || (social.tiktok ? (social.tiktok.startsWith('http') ? social.tiktok : `https://tiktok.com/@${social.tiktok.replace(/^@/, '')}`) : prev.tiktokUrl),
                        youtubeUrl: strategic.youtubeUrl || social.youtube || prev.youtubeUrl,
                        linkedinUrl: strategic.linkedinUrl || social.linkedin || prev.linkedinUrl
                    }));
                    if (strategic.websiteUrl || client.websiteUrl || strategic.whatItDoes || cleanBrandName) {
                        setIsPreviewMode(true);
                    }
                }
            } catch (error) {
                console.error("Error loading client profile:", error);
            }
        };
        loadClient();
    }, [user?.id, activeClientId]);

    const handleSaveNewResearch = (newResearch) => {
        const updated = [newResearch, ...savedResearches];
        setSavedResearches(updated);
        if (onResearchesChange) onResearchesChange(updated);
        if (typeof window !== 'undefined' && activeClientId) {
            try {
                localStorage.setItem('diic_saved_researches_' + activeClientId, JSON.stringify(updated));
            } catch(e) {}
        }
        saveResearchesToClient(updated, researchFolders);
    };

    const handleDeleteResearch = (resId) => {
        const updated = savedResearches.filter(r => r.id !== resId);
        setSavedResearches(updated);
        if (typeof window !== 'undefined' && activeClientId) {
            try {
                localStorage.setItem('diic_saved_researches_' + activeClientId, JSON.stringify(updated));
            } catch(e) {}
        }
        saveResearchesToClient(updated, researchFolders);
    };

    const handleCreateFolder = (newFolder) => {
        const updated = [...researchFolders, newFolder];
        setResearchFolders(updated);
        saveResearchesToClient(savedResearches, updated);
    };

    const handleDeleteFolder = (folderId) => {
        const updatedFolders = researchFolders.filter(f => f.id !== folderId);
        const updatedResearches = savedResearches.map(r => 
            (r.folderId === folderId || r.folder_id === folderId) ? { ...r, folderId: 'general', folder_id: 'general' } : r
        );
        setResearchFolders(updatedFolders);
        setSavedResearches(updatedResearches);
        saveResearchesToClient(updatedResearches, updatedFolders);
    };

    const saveResearchesToClient = async (researchesToSave, foldersToSave) => {
        if (!activeClientId) return;
        try {
            const client = await agencyService.getClientById(activeClientId);
            const safeOnboarding = client?.onboarding_data ? JSON.parse(JSON.stringify(client.onboarding_data)) : {};
            await agencyService.updateClient(activeClientId, {
                onboarding_data: {
                    ...safeOnboarding,
                    saved_researches: researchesToSave,
                    research_folders: foldersToSave
                }
            });
        } catch (err) {
            console.error('Error auto-syncing researches:', err);
        }
    };

    const handleLoadResearchIntoProfile = (research) => {
        if (!research) return;
        const d = research.data || {};
        const updatedProfile = {
            ...profile,
            whatItDoes: d.whatItDoes || profile.whatItDoes || (typeof d === 'string' ? d.substring(0, 300) : ''),
            whatItOffers: d.whatItOffers || profile.whatItOffers,
            targetAudience: d.targetAudience || profile.targetAudience,
            problemSolved: d.problemSolved || profile.problemSolved || (Array.isArray(d.frictionPoints) ? d.frictionPoints.map(f => typeof f === 'object' ? f.pain || f.title : f).join(', ') : profile.problemSolved),
            valueProp: d.valueProp || profile.valueProp,
            tone: d.tone || profile.tone,
            mainGoal: d.mainGoal || profile.mainGoal
        };
        setProfile(updatedProfile);
        handleConfirm(updatedProfile);
        toast.success('Datos de "' + research.title + '" transferidos al Perfil Estratégico.');
    };

    const handleConsolidateResearchesWithAI = async (selectedItems) => {
        const toastId = toast.loading('Consolidando investigaciones con Inteligencia Estratégica...');
        try {
            const res = await fetch('/api/ai/strategy/brain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'consolidate_profile',
                    clientName: profile.brandName || user?.user_metadata?.brand || 'Dr. Oscar Cujilema',
                    researches: selectedItems
                })
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Error al consolidar');

            const c = data.consolidatedProfile || {};
            const updatedProfile = {
                ...profile,
                brandName: c.brandName || profile.brandName,
                whatItDoes: c.whatItDoes || profile.whatItDoes,
                whatItOffers: c.whatItOffers || profile.whatItOffers,
                targetAudience: c.targetAudience || profile.targetAudience,
                problemSolved: c.problemSolved || profile.problemSolved,
                valueProp: c.valueProp || profile.valueProp,
                tone: c.tone || profile.tone,
                mainGoal: c.mainGoal || profile.mainGoal,
                marketContext: c.executiveSummary || profile.marketContext
            };
            setProfile(updatedProfile);
            await handleConfirm(updatedProfile);
            toast.success('íPerfil Estratégico 360° consolidado y guardado!', { id: toastId });
        } catch (err) {
            toast.error('Error al consolidar con IA: ' + err.message, { id: toastId });
        }
    };

    const handleChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        if (
            field === 'websiteUrl' || 
            field === 'instagramUrl' ||
            field === 'facebookUrl' ||
            field === 'tiktokUrl' ||
            field === 'youtubeUrl' ||
            field === 'linkedinUrl'
        ) {
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
        // Avoid using React event objects as profile overrides
        const isEvent = overrideProfile && (
            overrideProfile.nativeEvent || 
            typeof overrideProfile.preventDefault === 'function' || 
            typeof overrideProfile.stopPropagation === 'function'
        );
        const targetProfile = (overrideProfile && !isEvent) ? overrideProfile : profile;
        let currentClientId = activeClientId;

        setIsSaving(true);
        try {
            // Auto-create client record if missing in profiles table
            if (!currentClientId && user?.id) {
                console.log("No client_id found. Auto-creating client record...");
                const newClientRes = await agencyService.createClient({
                    name: (targetProfile.brandName || user?.user_metadata?.brand || user?.user_metadata?.full_name || 'Nuevo Cliente').replace(/[-_\s]+workspace\s*$/i, '').trim(),
                    email: user?.email || '',
                    website: targetProfile.websiteUrl || '',
                    goals: targetProfile.goals || []
                });
                
                if (!newClientRes || !newClientRes.id) {
                    throw new Error("No se pudo auto-crear el registro del cliente.");
                }

                currentClientId = newClientRes.id;
                setActiveClientId(currentClientId);
                
                // Link it to the user profile
                const { error: linkError } = await supabase
                    .from('profiles')
                    .update({ client_id: currentClientId })
                    .eq('id', user.id);
                
                if (linkError) {
                    throw new Error("Error al enlazar el cliente al perfil: " + linkError.message);
                }
            }

            if (!currentClientId) {
                toast.error("Error: No se encontró la sesión del cliente.");
                setIsSaving(false);
                return;
            }

            // Strip out non-strategic keys to avoid large/circular payloads
            const { id, created_at, metadata, onboarding_data, editor, filmmaker, ...strategicData } = targetProfile;

            // Limpiamos referencias circulares o data inválida de onboarding_data actual
            const safeOnboardingData = onboarding_data ? JSON.parse(JSON.stringify(onboarding_data)) : {};

            const updatePayload = {
                name: targetProfile.brandName,
                onboarding_data: {
                    ...safeOnboardingData,
                    brand: {
                        ...(safeOnboardingData.brand || {}),
                        completed: true
                    },
                    strategic: { 
                        ...strategicData, 
                        completed: true,
                        websiteUrl: targetProfile.websiteUrl || '', 
                        instagramUrl: targetProfile.instagramUrl || '',
                        facebookUrl: targetProfile.facebookUrl || '',
                        tiktokUrl: targetProfile.tiktokUrl || '',
                        youtubeUrl: targetProfile.youtubeUrl || '',
                        linkedinUrl: targetProfile.linkedinUrl || ''
                    }
                }
            };

            // Sanitización absoluta: Supabase-js puede congelarse (hang) si intentamos pasarle objetos
            // con referencias circulares complejas (ej. Eventos de React) que escapen al safeOnboardingData.
            const ultraSafePayload = JSON.parse(JSON.stringify(updatePayload));

            const updatePromise = agencyService.updateClient(currentClientId, ultraSafePayload);

            // Esperamos que termine el guardado sin forzar un timeout artificial.
            // Si el servidor de Supabase está despertando (Cold Boot), puede tomar hasta 2 minutos.
            await updatePromise;
            setIsSaving(false);
            toast.success("íEcosistema Estratégico sincronizado con éxito!", { id: 'save-toast' });
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
        if (!confirm(`┐Estás seguro de activar "${snapshot.name}"? Esto reemplazará los datos actuales de la cuadrícula.`)) return;

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
        const primaryUrl = profile.websiteUrl || 
                            profile.instagramUrl || 
                            profile.facebookUrl || 
                            profile.tiktokUrl || 
                            profile.youtubeUrl || 
                            profile.linkedinUrl;

        if (!primaryUrl) {
            toast.error("Ingresa al menos una URL para iniciar la investigación");
            return;
        }

        try {
            console.log("!!! INICIANDO INVESTIGACIÓN OMNINIVEL - DIIC ZONE !!!");
            setIsSimulatingScrape(true);
            setIsPreviewMode(true);
            
            const channelsToScan = [];
            if (profile.websiteUrl) channelsToScan.push('sitio web');
            if (profile.facebookUrl) channelsToScan.push('Facebook');
            if (profile.instagramUrl) channelsToScan.push('Instagram');
            if (profile.tiktokUrl) channelsToScan.push('TikTok');
            if (profile.youtubeUrl) channelsToScan.push('YouTube');
            if (profile.linkedinUrl) channelsToScan.push('LinkedIn');
            
            const scanTargetMsg = channelsToScan.length > 0 
                ? `Infiltrando: ${channelsToScan.join(', ')}...` 
                : 'Infiltrando activos digitales...';
            
            setAnalysisMsg(scanTargetMsg);
            
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
                marketContext: 'Auditando mercado...',
                socialAudit: 'Analizando perfiles sociales...'
            }));

            const result = await aiService.analyzeStrategicProfile(
                primaryUrl, 
                profile.brandName,
                {
                    facebookUrl: profile.facebookUrl || '',
                    instagramUrl: profile.instagramUrl || '',
                    tiktokUrl: profile.tiktokUrl || '',
                    youtubeUrl: profile.youtubeUrl || '',
                    linkedinUrl: profile.linkedinUrl || ''
                }
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
                marketContext: d.marketContext || "Contexto de mercado estándar.",
                socialAudit: d.socialAudit || "Auditoría de canales sociales no disponible.",
                dynamicButtons: d.dynamicButtons || []
            };

            setProfile(updatedProfile);
            setSyncCount(c => c + 1);

            // DYNAMIC PROGRESS STEPS BASED ON ENTERED URLS
            const displaySteps = [
                { msg: 'Activando motores de búsqueda y rastreo...', icon: 'Target' }
            ];
            
            if (profile.websiteUrl) {
                displaySteps.push({ msg: `Analizando estructura y contenido web de: ${profile.websiteUrl.replace(/https?:\/\//, '')}`, icon: 'Globe' });
            }
            if (profile.facebookUrl) {
                displaySteps.push({ msg: 'Rastreando fanpage y publicaciones en Facebook...', icon: 'Facebook' });
            }
            if (profile.instagramUrl) {
                displaySteps.push({ msg: 'Analizando feed, tono y engagement en Instagram...', icon: 'Instagram' });
            }
            if (profile.tiktokUrl) {
                displaySteps.push({ msg: 'Evaluando tendencias y videos virales en TikTok...', icon: 'Video' });
            }
            if (profile.youtubeUrl) {
                displaySteps.push({ msg: 'Analizando portafolio de video largo en YouTube...', icon: 'Camera' });
            }
            if (profile.linkedinUrl) {
                displaySteps.push({ msg: 'Verificando liderazgo y autoridad corporativa en LinkedIn...', icon: 'ShieldCheck' });
            }
            
            displaySteps.push(
                { msg: 'Detectando competidores y brechas de mercado...', icon: 'Search' },
                { msg: 'Sintetizando inteligencia estratégica real...', icon: 'Zap' },
                { msg: 'Generando recomendaciones de producción...', icon: 'Camera' },
                { msg: 'Compilando reporte de ecosistema omni-nivel...', icon: 'Database' }
            );

            for (const step of displaySteps) {
                setAnalysisMsg(step.msg);
                await new Promise(r => setTimeout(r, 1200)); // God Mode feel
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
        const primaryUrl = profile.websiteUrl || profile.instagramUrl || profile.facebookUrl || profile.tiktokUrl || profile.youtubeUrl || profile.linkedinUrl;
        if (!primaryUrl) {
            toast.error("Por favor ingresa un enlace web o perfil social primero");
            return;
        }
        
        setActiveInsightBtn(mode);
        setInsightModalOpen(true);
        setInsightData({ title, content: '', mode, loading: true, rawData: null, savedResearch: null });

        try {
            const res = await aiService.generateQuickInsight(primaryUrl, profile.brandName, mode);
            
            const folderMap = {
                competitors: 'f_competencia',
                friction: 'f_objeciones',
                traffic: 'f_nicho',
                social_audit: 'f_nicho',
                improvement_plan: 'general'
            };
            const categoryMap = {
                competitors: 'Análisis de Competencia',
                friction: 'Puntos de Fricción & Objeciones',
                traffic: 'Auditoría de Tráfico B2B',
                social_audit: 'Auditoría de Redes Sociales',
                improvement_plan: 'Plan de Mejora Estratégico'
            };
            const tagMap = {
                competitors: ['Competencia', 'Mercado', 'Benchmarking'],
                friction: ['Fricción', 'Objeciones', 'Dolores', 'CRO'],
                traffic: ['Tráfico', 'Captación', 'Funnels', 'B2B'],
                social_audit: ['RedesSociales', 'Instagram', 'Facebook', 'Engagement'],
                improvement_plan: ['Estrategia', 'PlanDeMejora', 'Crecimiento']
            };

            let formattedContent = '';
            let researchData = null;

            if (mode === 'competitors') {
                const compList = res.competitors || [];
                const updatedProfile = { ...profile, competitors: compList };
                setProfile(updatedProfile);
                handleConfirm(updatedProfile);

                formattedContent = `**COMPETIDORES DIRECTOS IDENTIFICADOS (${compList.length}):**\n\n` +
                    compList.map((c, i) => `* **${c.name || 'Competidor ' + (i+1)}:** ${c.url ? `[${c.url}](${c.url})` : ''} ${c.location ? `(${c.location})` : ''} - ${c.strengthsWeaknesses || ''}`).join('\n');

                researchData = {
                    summary: `Mapeo estratégico de ${compList.length} competidores directos en el mercado.`,
                    competitors: compList
                };
            } else {
                formattedContent = res.insight || 'No se recibieron datos de la investigación.';
                researchData = {
                    summary: typeof res.insight === 'string' ? res.insight.substring(0, 300) : title,
                    insight: res.insight
                };

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

            // AUTO-SAVE TO BRAND RESEARCH REPOSITORY
            const newQuickResearch = {
                id: `res_${mode}_${Date.now()}`,
                title: `${title} - ${profile.brandName || 'Marca'}`,
                category: categoryMap[mode] || 'Auditoría Estratégica',
                folderId: folderMap[mode] || 'general',
                tags: tagMap[mode] || ['Estrategia'],
                createdAt: new Date().toISOString(),
                data: researchData,
                summary: typeof formattedContent === 'string' ? formattedContent.substring(0, 300) : title
            };

            handleSaveNewResearch(newQuickResearch);
            setInsightData({ 
                title, 
                content: formattedContent, 
                mode, 
                loading: false, 
                rawData: researchData,
                savedResearch: newQuickResearch 
            });

            toast.success(`✓ "${title}" guardado en el Repositorio de Marca`);

        } catch (error) {
            console.error("Quick Insight Error:", error);
            setInsightData({ title, content: 'Ocurrió un error en la infiltración: ' + (error.message || 'Error de red'), mode, loading: false });
            toast.error("Fallo al ejecutar la investigación estratégica");
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

    const handleResearchChat = async (e, customInput = null) => {
        if (e && e.preventDefault) e.preventDefault();
        
        const textToSubmit = customInput || chatInput;
        if ((!textToSubmit.trim() && !selectedFile) || isChatting) return;
        
        const url = profile.websiteUrl || profile.instagramUrl;
        if (!url) {
            toast.error("Por favor, ingresa primero la URL web que vamos a investigar.");
            return;
        }

        const userMsg = textToSubmit || (selectedFile ? `Archivo adjunto: ${selectedFile.name}` : '');
        const newMessages = [...chatMessages, { role: 'user', content: userMsg }];
        setChatMessages(newMessages);
        
        const currentInput = textToSubmit;
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
                brandName: profile.brandName,
                websiteUrl: profile.websiteUrl,
                instagramUrl: profile.instagramUrl,
                location: profile.city || profile.location || '',
                industry: profile.industry || '',
                leadership: profile.leadership,
                whatItDoes: profile.whatItDoes,
                whatItOffers: profile.whatItOffers,
                valueProp: profile.valueProp,
                tone: profile.tone
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
                toast.success("íContenido optimizado!", { id: toastId });
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
        <div className="animate-in fade-in duration-500 pb-16 main-strategic-profile-container">
            {/* 1. BÚSQUEDA & AUDITORÍA TAB */}
            {activeTab === 'search' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    {/* LUXURY CYBERPUNK HUD SEARCH TERMINAL */}
                    <div className="bg-[#080914]/90 backdrop-blur-2xl border border-indigo-500/20 rounded-[36px] p-6 md:p-10 relative overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.06)] text-center flex flex-col items-center justify-center">
                        {/* Ambient Neon Highlights */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

                        {/* HUD Header */}
                        <div className="flex flex-col items-center mb-5 z-10 text-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-2.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Estudio de Mercado & Huella Digital</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight">
                                Estudio de Mercado & <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Auditoría IA</span>
                            </h3>
                            <p className="text-gray-400 text-xs font-medium mt-1 max-w-lg">
                                Investigación de nicho, análisis de competidores y auditoría omnicanal con inteligencia estratégica en tiempo real.
                            </p>
                        </div>

                        {/* Search & Channel Command Bar */}
                        <div className="w-full max-w-3xl relative z-10">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 rounded-[26px] blur-md opacity-30 group-hover:opacity-70 transition duration-700"></div>
                                <div className="relative bg-[#0A0A14] border border-white/10 rounded-[24px] p-2.5 md:p-3.5 flex items-center gap-3 shadow-2xl">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 ml-1 shrink-0">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 flex flex-col text-left">
                                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Activo Digital / Enlace a Auditar</span>
                                        <input 
                                            type="text" 
                                            placeholder="Pega el enlace web (ej. tumarca.com) o perfil social..."
                                            value={profile.websiteUrl || ''}
                                            onChange={(e) => handleChange('websiteUrl', e.target.value)}
                                            className="bg-transparent border-none text-white text-sm md:text-base focus:outline-none flex-1 font-medium placeholder:text-gray-600"
                                        />
                                    </div>

                                    {(() => {
                                        const activeScanChannels = [];
                                        if (profile.websiteUrl) activeScanChannels.push('WEB');
                                        if (isValidSocialUrl(profile.facebookUrl)) activeScanChannels.push('FB');
                                        if (isValidSocialUrl(profile.instagramUrl)) activeScanChannels.push('IG');
                                        if (isValidSocialUrl(profile.tiktokUrl)) activeScanChannels.push('TK');
                                        if (isValidSocialUrl(profile.youtubeUrl)) activeScanChannels.push('YT');
                                        if (isValidSocialUrl(profile.linkedinUrl)) activeScanChannels.push('IN');
                                        const buttonLabel = isSimulatingScrape 
                                            ? 'AUDITANDO...' 
                                            : (activeScanChannels.length > 1 
                                                ? `ESCANEAR (${activeScanChannels.join(' + ')})` 
                                                : 'AUDITAR CON IA');

                                        return (
                                            <button 
                                                onClick={handleSimulateSync}
                                                disabled={!(profile.websiteUrl || profile.instagramUrl || profile.facebookUrl || profile.tiktokUrl || profile.youtubeUrl || profile.linkedinUrl)}
                                                className={`px-5 py-3 md:px-7 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
                                                    hasUnsyncedUrl 
                                                    ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.5)] animate-pulse' 
                                                    : 'bg-white text-black hover:bg-indigo-50 shadow-xl'
                                                } disabled:opacity-40 disabled:bg-gray-800 disabled:text-gray-500 group relative overflow-hidden active:scale-95`}
                                            >
                                                {isSimulatingScrape ? <Activity className="w-4 h-4 animate-pulse text-white" /> : <Command className="w-4 h-4" />}
                                                <span className="relative z-10">{buttonLabel}</span>
                                            </button>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Digital Footprint Channel Badges */}
                            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mr-1">Canales Digitales:</span>
                                
                                {/* Facebook */}
                                <button
                                    type="button"
                                    onClick={() => toggleSocialInput('facebook')}
                                    className={`px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all text-[10px] font-black uppercase tracking-wider ${
                                        profile.facebookUrl 
                                            ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.2)]' 
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                    } border`}
                                >
                                    <Facebook size={12} />
                                    <span>Facebook</span>
                                    {profile.facebookUrl && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                                </button>

                                {/* Instagram */}
                                <button
                                    type="button"
                                    onClick={() => toggleSocialInput('instagram')}
                                    className={`px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all text-[10px] font-black uppercase tracking-wider ${
                                        profile.instagramUrl 
                                            ? 'bg-pink-600/20 border-pink-500/50 text-pink-400 shadow-[0_0_12px_rgba(219,39,119,0.2)]' 
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                    } border`}
                                >
                                    <Instagram size={12} />
                                    <span>Instagram</span>
                                    {profile.instagramUrl && <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />}
                                </button>

                                {/* TikTok */}
                                <button
                                    type="button"
                                    onClick={() => toggleSocialInput('tiktok')}
                                    className={`px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all text-[10px] font-black uppercase tracking-wider ${
                                        profile.tiktokUrl 
                                            ? 'bg-teal-600/20 border-teal-500/50 text-teal-400 shadow-[0_0_12px_rgba(13,148,136,0.2)]' 
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                    } border`}
                                >
                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.95-1.72-.1.08-.21.17-.3.26v9.71c-.04 2.44-1.42 4.77-3.69 5.75-2.28.98-5.06.72-7.06-.66-2-1.38-2.92-3.9-2.31-6.28.61-2.38 2.84-4.06 5.3-4.02.16 0 .32.01.48.03v4.02c-.83-.22-1.73-.05-2.42.44-.7.49-1.1 1.35-1.07 2.22.03.87.52 1.69 1.28 2.1 1.05.57 2.44.42 3.32-.4.4-.38.62-.93.61-1.49V.02z"/>
                                    </svg>
                                    <span>TikTok</span>
                                    {profile.tiktokUrl && <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />}
                                </button>

                                {/* Más Redes Dropdown */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowMoreSocials(!showMoreSocials)}
                                        className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-[10px] font-black uppercase tracking-wider ${
                                            showMoreSocials || profile.youtubeUrl || profile.linkedinUrl
                                                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400' 
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                        } border`}
                                    >
                                        <Plus size={12} />
                                        <span>Más</span>
                                    </button>
                                    
                                    <AnimatePresence>
                                        {showMoreSocials && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                                className="absolute z-30 top-10 left-1/2 -translate-x-1/2 bg-[#0F0F1A] border border-white/10 rounded-2xl p-2 flex gap-2 shadow-2xl min-w-[220px]"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        toggleSocialInput('youtube');
                                                        setShowMoreSocials(false);
                                                    }}
                                                    className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all flex-1 justify-center ${
                                                        profile.youtubeUrl 
                                                            ? 'bg-red-600/20 text-red-400 border border-red-500/30' 
                                                            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                                    }`}
                                                >
                                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                        <path d="M23.498 6.163c-.272-.98-1.04-1.755-2.02-2.027C19.7 3.5 12 3.5 12 3.5s-7.7 0-9.478.436c-.98.272-1.748 1.047-2.02 2.027C0 7.9 0 12 0 12s0 4.1.522 5.837c.272.98 1.04 1.755 2.02 2.027C4.3 20.5 12 20.5 12 20.5s7.7 0 9.478-.436c.98-.272 1.748-1.047 2.02-2.027C24 16.1 24 12 24 12s0-4.1-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                    </svg>
                                                    YouTube
                                                </button>
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        toggleSocialInput('linkedin');
                                                        setShowMoreSocials(false);
                                                    }}
                                                    className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all flex-1 justify-center ${
                                                        profile.linkedinUrl 
                                                            ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30' 
                                                            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                                    }`}
                                                >
                                                    <Linkedin size={13} />
                                                    LinkedIn
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Active Social Inputs Row */}
                            <AnimatePresence>
                                {Object.keys(visibleSocials).some(key => visibleSocials[key]) && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 space-y-2.5 w-full text-left overflow-hidden pt-2 border-t border-white/5"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                            {/* Facebook input */}
                                            {visibleSocials.facebook && (
                                                <div className="flex items-center bg-black/40 border border-blue-500/30 rounded-xl px-3 py-2 gap-2">
                                                    <Facebook size={14} className="text-blue-400 shrink-0" />
                                                    <input
                                                        type="text"
                                                        placeholder="URL de Facebook..."
                                                        value={profile.facebookUrl || ''}
                                                        onChange={(e) => handleChange('facebookUrl', e.target.value)}
                                                        className="bg-transparent border-none text-white text-xs focus:outline-none flex-1 font-medium placeholder:text-gray-600"
                                                    />
                                                    <button type="button" onClick={() => { handleChange('facebookUrl', ''); toggleSocialInput('facebook'); }} className="text-gray-600 hover:text-rose-400">
                                                        <X size={13} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Instagram input */}
                                            {visibleSocials.instagram && (
                                                <div className="flex items-center bg-black/40 border border-pink-500/30 rounded-xl px-3 py-2 gap-2">
                                                    <Instagram size={14} className="text-pink-400 shrink-0" />
                                                    <input
                                                        type="text"
                                                        placeholder="URL o @usuario de Instagram..."
                                                        value={profile.instagramUrl || ''}
                                                        onChange={(e) => handleChange('instagramUrl', e.target.value)}
                                                        className="bg-transparent border-none text-white text-xs focus:outline-none flex-1 font-medium placeholder:text-gray-600"
                                                    />
                                                    <button type="button" onClick={() => { handleChange('instagramUrl', ''); toggleSocialInput('instagram'); }} className="text-gray-600 hover:text-rose-400">
                                                        <X size={13} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* TikTok input */}
                                            {visibleSocials.tiktok && (
                                                <div className="flex items-center bg-black/40 border border-teal-500/30 rounded-xl px-3 py-2 gap-2">
                                                    <span className="text-[10px] font-black text-teal-400">TK</span>
                                                    <input
                                                        type="text"
                                                        placeholder="URL o @usuario de TikTok..."
                                                        value={profile.tiktokUrl || ''}
                                                        onChange={(e) => handleChange('tiktokUrl', e.target.value)}
                                                        className="bg-transparent border-none text-white text-xs focus:outline-none flex-1 font-medium placeholder:text-gray-600"
                                                    />
                                                    <button type="button" onClick={() => { handleChange('tiktokUrl', ''); toggleSocialInput('tiktok'); }} className="text-gray-600 hover:text-rose-400">
                                                        <X size={13} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* YouTube input */}
                                            {visibleSocials.youtube && (
                                                <div className="flex items-center bg-black/40 border border-red-500/30 rounded-xl px-3 py-2 gap-2">
                                                    <span className="text-[10px] font-black text-red-400">YT</span>
                                                    <input
                                                        type="text"
                                                        placeholder="URL de canal YouTube..."
                                                        value={profile.youtubeUrl || ''}
                                                        onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                                                        className="bg-transparent border-none text-white text-xs focus:outline-none flex-1 font-medium placeholder:text-gray-600"
                                                    />
                                                    <button type="button" onClick={() => { handleChange('youtubeUrl', ''); toggleSocialInput('youtube'); }} className="text-gray-600 hover:text-rose-400">
                                                        <X size={13} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* LinkedIn input */}
                                            {visibleSocials.linkedin && (
                                                <div className="flex items-center bg-black/40 border border-sky-500/30 rounded-xl px-3 py-2 gap-2">
                                                    <Linkedin size={14} className="text-sky-400 shrink-0" />
                                                    <input
                                                        type="text"
                                                        placeholder="URL de empresa LinkedIn..."
                                                        value={profile.linkedinUrl || ''}
                                                        onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                                                        className="bg-transparent border-none text-white text-xs focus:outline-none flex-1 font-medium placeholder:text-gray-600"
                                                    />
                                                    <button type="button" onClick={() => { handleChange('linkedinUrl', ''); toggleSocialInput('linkedin'); }} className="text-gray-600 hover:text-rose-400">
                                                        <X size={13} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 5 EXECUTIVE QUICK-DIAGNOSTIC TILES */}
                        <div className="w-full mt-8 pt-6 border-t border-white/5 z-10">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400 flex items-center gap-2">
                                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
                                    Auditorías Rápidas de Alto Impacto
                                </span>
                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest hidden sm:inline">
                                    Autoguardado en Repositorio
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                                {/* 1. Competidores */}
                                <button 
                                    disabled={activeInsightBtn === 'competitors'}
                                    onClick={() => handleQuickInsight('competitors', 'Competidores')}
                                    type="button"
                                    className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group overflow-hidden ${
                                        activeInsightBtn === 'competitors'
                                            ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                                            : 'bg-[#0E0E1A]/80 border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5'
                                    }`}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2.5 group-hover:scale-110 transition-transform">
                                        {activeInsightBtn === 'competitors' ? <Activity size={16} className="animate-spin text-indigo-400" /> : <Globe size={16} />}
                                    </div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Competidores</h4>
                                    <p className="text-[10px] text-gray-400 font-medium leading-snug">Mapeo directo y ventajas de mercado</p>
                                </button>

                                {/* 2. Fricción CRO */}
                                <button 
                                    disabled={activeInsightBtn === 'friction'}
                                    onClick={() => handleQuickInsight('friction', 'Puntos de Fricción CRO')}
                                    type="button"
                                    className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group overflow-hidden ${
                                        activeInsightBtn === 'friction'
                                            ? 'bg-pink-600/20 border-pink-500 shadow-[0_0_20px_rgba(219,39,119,0.3)]'
                                            : 'bg-[#0E0E1A]/80 border-white/5 hover:border-pink-500/40 hover:bg-pink-500/5'
                                    }`}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-2.5 group-hover:scale-110 transition-transform">
                                        {activeInsightBtn === 'friction' ? <Activity size={16} className="animate-spin text-pink-400" /> : <TargetIcon size={16} />}
                                    </div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Fricción CRO</h4>
                                    <p className="text-[10px] text-gray-400 font-medium leading-snug">Detección de fugas en la conversión</p>
                                </button>

                                {/* 3. Tráfico B2B */}
                                <button 
                                    disabled={activeInsightBtn === 'traffic'}
                                    onClick={() => handleQuickInsight('traffic', 'Rutas de Tráfico B2B')}
                                    type="button"
                                    className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group overflow-hidden ${
                                        activeInsightBtn === 'traffic'
                                            ? 'bg-emerald-600/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                            : 'bg-[#0E0E1A]/80 border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5'
                                    }`}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2.5 group-hover:scale-110 transition-transform">
                                        {activeInsightBtn === 'traffic' ? <Activity size={16} className="animate-spin text-emerald-400" /> : <Activity size={16} />}
                                    </div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Tráfico B2B</h4>
                                    <p className="text-[10px] text-gray-400 font-medium leading-snug">Rutas y procedencia de prospectos</p>
                                </button>

                                {/* 4. Auditoría Redes */}
                                <button 
                                    disabled={activeInsightBtn === 'social_audit'}
                                    onClick={() => handleQuickInsight('social_audit', 'Auditoría de Redes Sociales')}
                                    type="button"
                                    className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group overflow-hidden ${
                                        activeInsightBtn === 'social_audit'
                                            ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                                            : 'bg-[#0E0E1A]/80 border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5'
                                    }`}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2.5 group-hover:scale-110 transition-transform">
                                        {activeInsightBtn === 'social_audit' ? <Activity size={16} className="animate-spin text-indigo-400" /> : <Bot size={16} />}
                                    </div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Auditoría Redes</h4>
                                    <p className="text-[10px] text-gray-400 font-medium leading-snug">Alcance, engagement y huella digital</p>
                                </button>

                                {/* 5. Plan de Mejora */}
                                <button 
                                    disabled={activeInsightBtn === 'improvement_plan'}
                                    onClick={() => handleQuickInsight('improvement_plan', 'Plan de Mejora Estratégico')}
                                    type="button"
                                    className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group overflow-hidden ${
                                        activeInsightBtn === 'improvement_plan'
                                            ? 'bg-amber-600/20 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                                            : 'bg-[#0E0E1A]/80 border-white/5 hover:border-amber-500/40 hover:bg-amber-500/5'
                                    }`}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2.5 group-hover:scale-110 transition-transform">
                                        {activeInsightBtn === 'improvement_plan' ? <Activity size={16} className="animate-spin text-amber-400" /> : <Wand2 size={16} />}
                                    </div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Plan de Mejora</h4>
                                    <p className="text-[10px] text-gray-400 font-medium leading-snug">Hoja de ruta táctica a 30 días</p>
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
                                    <p className="text-sm text-gray-400 font-medium">Chatea con el escáner. Ej: "┐Qué cursos de ganadería tienen y cuándo inician?"</p>
                                </div>
                            ) : (
                                chatMessages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-indigo-600/30 text-indigo-100 border border-indigo-500/30 rounded-br-none' : 'bg-white/5 text-gray-300 border border-white/10 rounded-bl-none'}`}>
                                            {msg.role === 'user' ? (
                                                <div style={{ whiteSpace: "pre-wrap" }} className="leading-relaxed">
                                                    {msg.content}
                                                </div>
                                            ) : (
                                                <ClaudeStyleMarkdownViewer content={msg.content} />
                                            )}
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

                        <div className="p-3 border-t border-white/5 bg-black/40">
                            {/* Dynamic Suggested Question Chips */}
                            {Array.isArray(profile.dynamicButtons) && profile.dynamicButtons.length > 0 && (
                                <div className="flex flex-wrap gap-2 px-1 pb-3 pt-1 border-b border-white/5 mb-3">
                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest w-full mb-1 flex items-center gap-1">
                                        <Sparkles size={10} className="animate-pulse" /> Investigaciones Sugeridas:
                                    </span>
                                    {profile.dynamicButtons.map((btnText, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleResearchChat(null, btnText)}
                                            disabled={isChatting}
                                            className="text-[10px] md:text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/40 rounded-xl px-3 py-1.5 transition-all text-left font-medium leading-tight disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                            {btnText}
                                        </button>
                                    ))}
                                </div>
                            )}

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
                                            toast.success(`Archivo cargado: ${e.target.files[0].name}`, { icon: '📌' });
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
                </div>
            )}

            {/* 2. REPOSITORIO & DOSSIER TAB */}
            {activeTab === 'saved' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <SavedResearchesManager
                        researches={savedResearches}
                        folders={researchFolders}
                        onDeleteResearch={handleDeleteResearch}
                        onCreateFolder={handleCreateFolder}
                        onDeleteFolder={handleDeleteFolder}
                        onLoadIntoProfile={handleLoadResearchIntoProfile}
                        onConsolidateWithAI={handleConsolidateResearchesWithAI}
                        clientName={profile.brandName || 'Dr. Oscar Cujilema'}
                    />
                </div>
            )}

            {/* 3. PERFIL ESTRATÉGICO 360° TAB */}
            {activeTab === 'profile' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    {/* Ficha Nuclear de Identidad 360° (Barra Ejecutiva Superior) */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 md:p-5 bg-[#080914]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl">
                        <div className="flex items-center gap-3.5">
                            <div className="p-2.5 bg-gradient-to-tr from-indigo-600/20 to-fuchsia-600/20 border border-indigo-500/30 rounded-xl text-indigo-400 shadow-inner">
                                <TargetIcon className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-black text-white uppercase italic tracking-tight">
                                        Perfil Estratégico 360° • <span className="text-indigo-400">{profile.brandName || 'Marca DIIC'}</span>
                                    </h3>
                                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[8px] font-bold text-emerald-400 uppercase tracking-widest">
                                        Ecosistema Activo
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium">
                                    Identidad nuclear, propuesta de valor, público objetivo y mapeo de mercado
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
                            {/* Toggle Edit vs Report View */}
                            <div className="flex bg-black/60 border border-white/10 rounded-xl p-1">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('edit')}
                                    className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                        viewMode === 'edit'
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Modo Edición
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('report')}
                                    className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                        viewMode === 'report'
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Vista Reporte
                                </button>
                            </div>

                            {/* Mapa Mental Launcher Button */}
                            <button
                                type="button"
                                onClick={() => setIsMindMapModalOpen(true)}
                                className="px-3.5 py-2 bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 hover:from-indigo-600/30 hover:to-fuchsia-600/30 border border-indigo-500/40 text-indigo-200 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-md group"
                            >
                                <Brain className="w-3.5 h-3.5 text-fuchsia-400 group-hover:rotate-12 transition-transform" />
                                <span>Mapa Mental</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleDownloadReport}
                                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95"
                            >
                                <FileUp className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Exportar PDF</span>
                            </button>

                            {viewMode === 'edit' && (
                                <button
                                    type="button"
                                    onClick={() => handleConfirm()}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    )}
                                    <span>{isSaving ? 'Guardando...' : 'Guardar Perfil'}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* View Switch */}
                    {viewMode === 'edit' ? (
                        <div className="space-y-8">
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
                    <div className="relative z-10">{renderInput('┐QUÉ HACE?', 'whatItDoes', Network, 'Ej. Consultoría en Inteligencia Artificial...')}</div>
                    <div className="relative z-10">{renderInput('┐QUÉ OFRECE?', 'whatItOffers', Zap, 'Ej. Asesorías High-Ticket, Cursos, SaaS...', true)}</div>
                    <div className="relative z-10">{renderInput('PÚBLICO OBJETIVO', 'targetAudience', Users, 'Ej. Dueños de negocios B2B, edad 30-45...', true)}</div>
                    <div className="relative z-10">{renderInput('PROBLEMA QUE RESUELVE', 'problemSolved', Search, 'Ej. Falta de tiempo, procesos manuales lentos...', true)}</div>
                    <div className="relative z-10">{renderInput('PROPUESTA DE VALOR', 'valueProp', TargetIcon, 'Ej. Aumentamos tus ventas un 30% usando automatizaciones en 30 días.', true)}</div>
                    <div className="relative z-10">{renderInput('CONTEXTO DE MERCADO', 'marketContext', Globe, 'Ej. Líderes en el sector agropecuario de Ecuador...', true)}</div>
                    <div className="relative z-10">{renderInput('TONO DE COMUNICACIÓN', 'tone', Heart, 'Ej. Profesional, directo, corporativo, disruptivo...')}</div>
                    <div className="relative z-10">{renderInput('OBJETIVO PRINCIPAL', 'mainGoal', Target, 'Ej. Lograr $100K MRR para Q3 2024.', true)}</div>
                    <div className="relative z-10">{renderInput('AUDITORÍA DE REDES SOCIALES', 'socialAudit', Bot, 'Análisis y diagnóstico profundo de la huella digital en redes sociales del cliente...', true)}</div>
                    
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

                    {/* Onboarding & Brand Assets Card */}
                    <div className="bg-[#0A0A0F] border border-white/5 rounded-[32px] p-6 space-y-4 hover:border-indigo-500/30 transition-all duration-300 group relative shadow-lg hover:shadow-indigo-500/10 flex flex-col h-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <label className="text-sm font-black text-white uppercase italic tracking-widest">Activos & Onboarding</label>
                            </div>
                        </div>
                        
                        <div className="flex-1 space-y-3 mt-2 text-left">
                            {/* Website */}
                            {(profile.website || profile.websiteUrl) ? (
                                <div className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Sitio Web</span>
                                        <span className="text-[10px] text-gray-300 font-bold truncate max-w-[150px]">{profile.website || profile.websiteUrl}</span>
                                    </div>
                                    <a href={profile.website || profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-colors">
                                        <Globe size={12} />
                                    </a>
                                </div>
                            ) : (
                                <span className="text-[9px] text-gray-600 block italic">Sin Sitio Web (ir a Cuenta)</span>
                            )}

                            {/* Brochure */}
                            {profile.brochure_url ? (
                                <div className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Brochure de Marca</span>
                                        <span className="text-[10px] text-rose-400 font-bold truncate">Archivo PDF/Doc</span>
                                    </div>
                                    <a href={profile.brochure_url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors">
                                        <FileUp size={12} />
                                    </a>
                                </div>
                            ) : (
                                <span className="text-[9px] text-gray-600 block italic">Sin Brochure (ir a Cuenta)</span>
                            )}

                            {/* Google Drive Workspace */}
                            {(profile.drive_root_link || profile.google_drive_folder_id) ? (
                                <div className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Google Drive</span>
                                        <span className="text-[10px] text-emerald-400 font-bold truncate">Workspace Sincronizado</span>
                                    </div>
                                    <a href={profile.drive_root_link || `https://drive.google.com/drive/folders/${profile.google_drive_folder_id}`} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors">
                                        <FolderOpen size={12} />
                                    </a>
                                </div>
                            ) : (
                                <span className="text-[9px] text-gray-600 block italic">Sin Drive (ir a Cuenta)</span>
                            )}
                        </div>

                        <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1.5 justify-start">
                            {profile.country && (
                                <span className="px-2 py-1 bg-white/5 rounded-md text-[8px] font-bold text-gray-400 uppercase tracking-wide">
                                    📍 {profile.country}
                                </span>
                            )}
                            {(profile.industry || profile.marketing_type) && (
                                <span className="px-2 py-1 bg-white/5 rounded-md text-[8px] font-bold text-gray-400 uppercase tracking-wide">
                                    💼 {profile.industry || profile.marketing_type}
                                </span>
                            )}
                        </div>
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
                        {Array.isArray(profile.competitors) && profile.competitors.length > 0 ? (
                            profile.competitors.map((comp, idx) => (
                            <div key={idx} className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
                                <div className="flex justify-between items-center bg-white/5 rounded-xl p-2 border border-white/5 focus-within:border-rose-500/30 transition-colors">
                                    <input 
                                        type="text" 
                                        placeholder="Nombre del Competidor..." 
                                        value={comp?.name || ''}
                                        onChange={(e) => handleArrayChange('competitors', idx, 'name', e.target.value)}
                                        className="bg-transparent border-none text-white font-black text-sm uppercase px-3 focus:outline-none flex-1"
                                    />
                                    <button onClick={() => removeArrayItem('competitors', idx)} className="p-2 text-gray-500 hover:text-rose-500 bg-white/5 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input type="text" placeholder="Sitio Web (URL)" value={comp?.url || ''} onChange={(e) => handleArrayChange('competitors', idx, 'url', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 font-medium text-xs focus:outline-none focus:border-rose-500/50 transition-colors" />
                                    <input type="text" placeholder="Ubicación / Alcance" value={comp?.location || ''} onChange={(e) => handleArrayChange('competitors', idx, 'location', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 font-medium text-xs focus:outline-none focus:border-rose-500/50 transition-colors" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input type="text" placeholder="Redes Sociales" value={comp?.social || ''} onChange={(e) => handleArrayChange('competitors', idx, 'social', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 font-medium text-xs focus:outline-none focus:border-rose-500/50 transition-colors" />
                                    <button 
                                        onClick={() => handleQuickInsight('competitors', 'Detective de Competencia')}
                                        className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-all text-[10px] font-black uppercase tracking-widest text-rose-400"
                                    >
                                        <Bot className="w-3 h-3" /> Investigar a fondo
                                    </button>
                                </div>
                                <textarea 
                                    placeholder="Análisis Estratégico (Fortalezas vs Debilidades)..." 
                                    value={comp?.strengthsWeaknesses || comp?.reviews || ''} 
                                    onChange={(e) => handleArrayChange('competitors', idx, 'strengthsWeaknesses', e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 font-medium text-xs focus:outline-none focus:border-rose-500/50 transition-colors resize-none h-24 italic leading-relaxed" 
                                />
                            </div>
                        ))) : (
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
                        {Array.isArray(profile.strategicAllies) && profile.strategicAllies.length > 0 ? (
                            profile.strategicAllies.map((ally, idx) => (
                            <div key={idx} className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
                                <div className="flex justify-between items-center bg-white/5 rounded-xl p-2 border border-white/5 focus-within:border-blue-500/30 transition-colors">
                                    <input 
                                        type="text" 
                                        placeholder="Nombre del Aliado..." 
                                        value={ally?.name || ''}
                                        onChange={(e) => handleArrayChange('strategicAllies', idx, 'name', e.target.value)}
                                        className="bg-transparent border-none text-white font-black text-sm uppercase px-3 focus:outline-none flex-1"
                                    />
                                    <button onClick={() => removeArrayItem('strategicAllies', idx)} className="p-2 text-gray-500 hover:text-blue-500 bg-white/5 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input type="text" placeholder="Sitio Web (URL)" value={ally?.url || ''} onChange={(e) => handleArrayChange('strategicAllies', idx, 'url', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 font-medium text-xs focus:outline-none focus:border-blue-500/50 transition-colors" />
                                    <input type="text" placeholder="Redes (Para Etiquetar)" value={ally?.social || ''} onChange={(e) => handleArrayChange('strategicAllies', idx, 'social', e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 font-medium text-xs focus:outline-none focus:border-blue-500/50 transition-colors" />
                                </div>
                                <input type="text" placeholder="┐Por qué etiquetarlos? (Ej. Proveedor de Software...)" value={ally?.tagReason || ''} onChange={(e) => handleArrayChange('strategicAllies', idx, 'tagReason', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 font-medium text-xs focus:outline-none focus:border-blue-500/50 transition-colors" />
                            </div>
                        ))) : (
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
                        onClick={() => handleSaveSnapshot()}
                        className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center gap-2"
                    >
                        <Plus size={14} /> Nuevo Snapshot
                    </button>
                </div>

                {Array.isArray(profile.snapshots) && profile.snapshots.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profile.snapshots.map((snapshot) => (
                            <div key={snapshot.id || Math.random()} className="bg-[#0A0A0F] border border-white/5 rounded-[32px] p-6 space-y-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full" />
                                
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <h4 className="text-xs font-black text-white uppercase tracking-widest">{snapshot.name || 'Snapshot'}</h4>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                            {formatDateSafe(snapshot.date)} • {formatTimeSafe(snapshot.date)}
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
            {profile.insights && typeof profile.insights === 'object' && Object.keys(profile.insights).length > 0 && (
                <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                            <Bot size={20} />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Reportes de Inteligencia</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(profile.insights).map(([key, data]) => {
                            if (!data) return null;
                            return (
                            <div key={key} className="bg-[#0A0A0F] border border-white/5 rounded-[32px] p-8 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-widest italic">{data.title || 'Reporte de Inteligencia'}</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Generado el {formatDateSafe(data.date)}</p>
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
                        )})}
                    </div>
                </div>
            )}
            
            <div className="mt-12 flex justify-end gap-4">
                 <button 
                    onClick={() => handleSaveSnapshot()}
                    className="px-8 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 active:scale-95 transition-all flex items-center gap-3"
                >
                    <Database className="w-5 h-5 text-gray-400" />
                    Guardar Investigación
                 </button>

                 <button 
                    onClick={() => handleConfirm()}
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
                        </div>
                    ) : (
                        <div className="space-y-16 animate-in fade-in zoom-in-95 duration-500">
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
                                    onClick={handleDownloadReport}
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
                                    { label: 'Meta Principal', val: profile.mainGoal, icon: Target },
                                    { label: 'Auditoría de Redes', val: profile.socialAudit, icon: Bot }
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

                            {/* Onboarding Goals */}
                            {Array.isArray(profile.goals) && profile.goals.length > 0 && (
                                <div className="mt-12 p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 space-y-4 text-left w-full">
                                    <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-widest text-[10px]">
                                        <TargetIcon className="w-5 h-5 text-indigo-500 animate-pulse" /> Objetivos de Onboarding
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {profile.goals.map((gId) => {
                                            const goalMap = {
                                                clients: 'Conseguir más clientes',
                                                sales: 'Vender más',
                                                authority: 'Posicionarme como experto',
                                                automate: 'Automatizar mi negocio',
                                                scale: 'Escalar mi marca'
                                            };
                                            return (
                                                <span key={gId} className="px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                                                    {goalMap[gId] || gId}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Brand Assets & Onboarding Details */}
                            {(profile.website || profile.websiteUrl || profile.brochure_url || profile.google_drive_folder_id || profile.drive_root_link || profile.country || profile.address || profile.industry || profile.marketing_type || profile.birth_date) && (
                                <div className="mt-12 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6 text-left w-full">
                                    <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-widest text-[10px]">
                                        <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" /> Activos y Datos de Onboarding
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Website */}
                                        {(profile.website || profile.websiteUrl) && (
                                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between space-y-2">
                                                <div>
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Sitio Web</span>
                                                    <p className="text-xs font-bold text-white truncate">{profile.website || profile.websiteUrl}</p>
                                                </div>
                                                <a 
                                                    href={profile.website || profile.websiteUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-colors pt-2"
                                                >
                                                    <Globe className="w-3.5 h-3.5" /> Visitar Sitio Web
                                                </a>
                                            </div>
                                        )}

                                        {/* Brochure */}
                                        {profile.brochure_url && (
                                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between space-y-2">
                                                <div>
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Brochure de Marca</span>
                                                    <p className="text-xs font-bold text-white truncate">Archivo adjunto disponible</p>
                                                </div>
                                                <a 
                                                    href={profile.brochure_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-[10px] font-black text-rose-400 hover:text-rose-300 uppercase tracking-wider transition-colors pt-2"
                                                >
                                                    <FileUp className="w-3.5 h-3.5" /> Descargar Brochure
                                                </a>
                                            </div>
                                        )}

                                        {/* Google Drive Workspace */}
                                        {(profile.drive_root_link || profile.google_drive_folder_id) && (
                                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between space-y-2">
                                                <div>
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Workspace Cloud</span>
                                                    <p className="text-xs font-bold text-white truncate">Google Drive Sincronizado</p>
                                                </div>
                                                <a 
                                                    href={profile.drive_root_link || `https://drive.google.com/drive/folders/${profile.google_drive_folder_id}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-wider transition-colors pt-2"
                                                >
                                                    <FolderOpen className="w-3.5 h-3.5" /> Abrir Carpeta Drive
                                                </a>
                                            </div>
                                        )}

                                        {/* Sector / Nicho */}
                                        {(profile.industry || profile.marketing_type) && (
                                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Sector / Nicho</span>
                                                <p className="text-xs font-bold text-white uppercase tracking-wide">
                                                    {profile.industry || profile.marketing_type} 
                                                    {profile.specialty ? ` - ${profile.specialty}` : ''}
                                                </p>
                                            </div>
                                        )}

                                        {/* Ubicación / Dirección */}
                                        {(profile.country || profile.city || profile.location) && (
                                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Ubicación</span>
                                                <p className="text-xs font-bold text-white truncate">
                                                    {[profile.city || profile.location, profile.country].filter(Boolean).join(', ')}
                                                </p>
                                                {profile.address && (
                                                    <p className="text-[10px] text-gray-400 truncate">{profile.address}</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Birth Date */}
                                        {profile.birth_date && formatDateSafe(profile.birth_date) && (
                                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Fecha de Fundación</span>
                                                <p className="text-xs font-bold text-white">
                                                    {formatDateSafe(profile.birth_date, { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

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
                                            {Array.isArray(profile.competitors) && profile.competitors.length > 0 ? (
                                                profile.competitors.map((c, i) => (
                                                    <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-black text-white uppercase italic">{c?.name || 'Competidor'}</span>
                                                            <span className="text-[9px] text-rose-400 font-bold uppercase tracking-widest">{c?.location || ''}</span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-500 italic leading-relaxed">{c?.strengthsWeaknesses || ''}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-600 font-medium italic">No se han registrado competidores estratégicos.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Allies List */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Aliados Estratégicos</h4>
                                        <div className="space-y-4">
                                            {Array.isArray(profile.strategicAllies) && profile.strategicAllies.length > 0 ? (
                                                profile.strategicAllies.map((a, i) => (
                                                    <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-black text-white uppercase italic">{a?.name || 'Aliado'}</span>
                                                            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Partner</span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-500 italic leading-relaxed">{a?.tagReason || ''}</p>
                                                    </div>
                                                ))
                                            ) : (
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
                    )}
                </div>
            )}

            {/* MODALS & POPUPS */}
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
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-3xl bg-black/90 print-modal-container"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#050508] border border-white/10 rounded-[40px] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(99,102,241,0.1)] print-modal-content"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                                        <Database size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{selectedSnapshotForPreview.name || 'Snapshot'}</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Snapshot Histórico • {formatDateSafe(selectedSnapshotForPreview.date)}</p>
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

                            <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar print-modal-body">
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
                                                {selectedSnapshotForPreview?.data?.[item.field] || 'Dato no registrado en esta versión.'}
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print-modal-container"
                        onClick={() => setInsightModalOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="w-full max-w-2xl bg-[#0A0A0F] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative print-modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Bot className="w-64 h-64 text-indigo-500" />
                            </div>
                            
                            <div className="p-8 md:p-10 relative z-10 max-h-[85vh] flex flex-col print-modal-body">
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

            {/* Modal de Mapa Mental Estratégico */}
            <StrategicMindMapModal
                isOpen={isMindMapModalOpen}
                onClose={() => setIsMindMapModalOpen(false)}
                profile={profile}
                onOpenBrainWithPrompt={onOpenBrainChat}
            />

            {/* Modal para Guardar Investigación */}
            <SavedResearchesModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onSave={handleSaveNewResearch}
                currentSearchQuery={profile.websiteUrl || profile.brandName || ''}
                currentData={{
                    brandName: profile.brandName,
                    whatItDoes: profile.whatItDoes,
                    whatItOffers: profile.whatItOffers,
                    targetAudience: profile.targetAudience,
                    problemSolved: profile.problemSolved,
                    valueProp: profile.valueProp,
                    tone: profile.tone,
                    frictionPoints: (profile.problemSolved ? profile.problemSolved.split('.').filter(Boolean) : []),
                    summary: profile.whatItDoes || profile.valueProp || 'Investigación estratégica de marca'
                }}
                folders={researchFolders}
                onCreateFolder={handleCreateFolder}
            />

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
