'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Store } from '../../js/store';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, TransformControls, Grid, Environment, ContactShadows, useTexture, Text } from '@react-three/drei';
import {
    Rocket, Clapperboard, Video, FileText, Pencil, Plus,
    Trash2, Save, MoreVertical, Play, Pause, Settings,
    ChevronLeft, ChevronRight, Layout, Box, User, Camera,
    Lightbulb, Type, Image as LucideImage, CheckCircle2,
    ArrowRight, Sparkles, LayoutDashboard, Film, Hammer
} from 'lucide-react';
import { contentService } from '../../services/contentService';
import { toast } from 'sonner';
import StoryboardEditor from '../previs/StoryboardEditor';
import ScriptEditor from '../previs/ScriptEditor';
import ScriptCampaignSelector from '../previs/ScriptCampaignSelector';

// --- 1. PrevisWelcome (The 3-Path Entry) ---
const PrevisWelcome = ({ onSelectPath, isSubcomponent = false }) => (
    <div className={`${isSubcomponent ? 'relative flex-1' : 'absolute inset-0 z-[50]'} bg-[#050511] flex flex-col items-center justify-center text-center p-8`}>
        <div className="max-w-4xl w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6 tracking-wider uppercase">
                <Sparkles className="w-3 h-3" /> DIIC Previs Studio
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                Estudio Creativo <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">DIIC</span>
            </h1>
            <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto font-light">
                Transforma tu idea en producción. Selecciona tu punto de partida:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Path 1: Bosquejo (Storyboard) */}
                <button
                    onClick={() => onSelectPath('storyboard')}
                    className="group relative bg-[#0E0E18] hover:bg-[#151525] border border-white/10 hover:border-pink-500/50 rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/10"
                >
                    <div className="h-14 w-14 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Pencil className="w-7 h-7 text-pink-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">Bosquejo</h3>
                    <p className="text-sm text-gray-500 mb-6 min-h-[40px]">Crea Storyboards 2D rápidos con herramientas de dibujo y plantillas.</p>
                    <div className="flex items-center text-xs font-medium text-pink-500 tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                        Iniciar Bosquejo <ArrowRight className="w-3 h-3 ml-2" />
                    </div>
                </button>

                {/* Path 2: Guión Inteligente */}
                <button
                    onClick={() => onSelectPath('script')}
                    className="group relative bg-[#0E0E18] hover:bg-[#151525] border border-white/10 hover:border-indigo-500/50 rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10"
                >
                    <div className="h-14 w-14 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-7 h-7 text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">Guión AI</h3>
                    <p className="text-sm text-gray-500 mb-6 min-h-[40px]">Estructura narrativa inteligente por bloques y sugerencias de IA.</p>
                    <div className="flex items-center text-xs font-medium text-indigo-500 tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                        Redactar Guión <ArrowRight className="w-3 h-3 ml-2" />
                    </div>
                </button>

                {/* Path 3: Previs 3D */}
                <button
                    onClick={() => onSelectPath('previs')}
                    className="group relative bg-[#0E0E18] hover:bg-[#151525] border border-white/10 hover:border-cyan-500/50 rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10"
                >
                    <div className="h-14 w-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Video className="w-7 h-7 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Previs 3D</h3>
                    <p className="text-sm text-gray-500 mb-6 min-h-[40px]">Simulación técnica de cámaras, luces y posición de actores.</p>
                    <div className="flex items-center text-xs font-medium text-cyan-500 tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                        Abrir Engine <ArrowRight className="w-3 h-3 ml-2" />
                    </div>
                </button>
            </div>
        </div>
    </div>
);

// --- 3. Previs (3D Engine) Adaptation ---
// Uses lightweight CSS 3D Engine as fallback for missing WebGL/Three.js libs
import Css3DEngine from '../previs/Css3DEngine';

const PrevisView = ({ scenes, activeSceneId }) => (
    <div className="relative w-full h-full bg-[#050511] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
        <Css3DEngine scenes={scenes} activeSceneId={activeSceneId} />
    </div>
);


// --- 4. Main PrevisStudio Container ---
export default function PrevisStudio({ isSubcomponent = false }) {
    // Global State
    const [projectType, setProjectType] = useState(null); // 'storyboard', 'script', 'previs'
    const [scenes, setScenes] = useState([
        { id: 'sc_01', name: 'Escena 1', duration: 5, objects: [] }
    ]);
    const [activeSceneId, setActiveSceneId] = useState('sc_01');
    const [showWelcome, setShowWelcome] = useState(true);
    
    // Script AI State
    const [selectedScriptContent, setSelectedScriptContent] = useState(null); // { campaign, node }

    const router = useRouter();

    const handleConvertToProduction = () => {
        if (!projectType) return;

        const timestamp = Date.now();
        const typeLabel = projectType === 'storyboard' ? 'Bosquejo' : projectType === 'script' ? 'Guión' : 'Previs';

        const newProject = {
            id: `proj_${timestamp}`,
            title: `Nuevo Proyecto desde ${typeLabel}`,
            client: 'Simulación Interna',
            status: 'Planning',
            dueDate: new Date(timestamp + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +7 days
            assignee: 'Sin asignar',
            description: `Proyecto creado automáticamente desde el Estudio Creativo (${typeLabel}).`,
            videos: []
        };

        // Add to Store
        Store.addProject(newProject);

        toast.success('¡Proyecto creado exitosamente! Redirigiendo a producción...');

        // Redirect to Production Dashboard
        setTimeout(() => {
            router.push('/dashboard/production');
        }, 1500);
    };

    const handleSelectPath = (type) => {
        setProjectType(type);
        setShowWelcome(false);
        toast.success(`Modo ${type === 'storyboard' ? 'Bosquejo' : type === 'script' ? 'Guión' : 'Previs'} iniciado`);
    };

    const handleBackToHome = () => {
        if (projectType === 'script' && selectedScriptContent) {
            // If inside a script editor, go back to selector
            setSelectedScriptContent(null);
            return;
        }

        setShowWelcome(true);
        setProjectType(null);
        setSelectedScriptContent(null);
    };

    return (
        <div className="relative h-full w-full flex flex-col bg-[#020205] text-white overflow-hidden">
            {/* Welcome Modal */}
            {showWelcome && <PrevisWelcome onSelectPath={handleSelectPath} isSubcomponent={isSubcomponent} />}

            {/* Header / Navigation */}
            {(!showWelcome && !(projectType === 'script' && selectedScriptContent)) && (
                <header className="h-16 border-b border-white/5 bg-[#050511] flex items-center justify-between px-6 shrink-0 print:hidden">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBackToHome} className="group flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/10">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-medium">Volver</span>
                        </button>
                        <div className="h-6 w-px bg-white/10"></div>
                        <div>
                            <h2 className="text-sm font-bold text-white leading-tight">
                                {projectType === 'script' && selectedScriptContent 
                                    ? `Guión: ${selectedScriptContent.node.data.title}` 
                                    : 'Estudio Creativo'}
                            </h2>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                                {projectType === 'storyboard' ? 'Bosquejo 2D' : projectType === 'script' ? (selectedScriptContent ? selectedScriptContent.campaign.name : 'Selector de Campaña') : 'Previs 3D'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleConvertToProduction}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Rocket className="w-3 h-3" /> Producción
                        </button>
                    </div>
                </header>
            )}

            {/* Main Workspace */}
            {!showWelcome && (
                <main className="flex-1 overflow-hidden relative">
                    {projectType === 'storyboard' && <div className="p-1 h-full w-full"><StoryboardEditor /></div>}
                    
                    {projectType === 'script' && (
                        !selectedScriptContent ? (
                            <ScriptCampaignSelector onSelectContent={setSelectedScriptContent} />
                        ) : (
                            <ScriptEditor 
                                campaign={selectedScriptContent.campaign} 
                                node={selectedScriptContent.node} 
                                onBack={() => setSelectedScriptContent(null)}
                                onConvertToProduction={handleConvertToProduction}
                            />
                        )
                    )}

                    {projectType === 'previs' && <div className="p-1 h-full w-full"><PrevisView scenes={scenes} activeSceneId={activeSceneId} /></div>}
                </main>
            )}
        </div>
    );
}
