'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
    Pencil, Type, Square, Circle, Image as ImageIcon,
    Layers, PlayCircle, Settings, X, Printer, Save,
    MousePointer2, Move, Eraser, Minus, ArrowRight,
    Maximize, ZoomIn, ZoomOut, ChevronRight, History,
    LayoutGrid, Palette, Target, Video,
    Pentagon, Triangle, Hexagon, Send, Share2, FileText, Rocket, Plus, ChevronDown, ChevronUp,
    Brush, Highlighter, SprayCan, Waves, Wand2, Paintbrush,
    Eye, EyeOff, Trash2, Loader2, Scissors, Sparkles, Folder,
    FolderOpen, Check, Download, DownloadCloud, Search, Clock, ImagePlus, Copy, BarChart3, Filter, ShieldAlert, Mic
} from 'lucide-react';
import { useCanvasController } from './CanvasController';
import SceneStrip from './SceneStrip';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '../layout/SidebarContext';
import { useRouter } from 'next/navigation';
import { orchestrationService } from '@/services/orchestrationService';
import { whatsappService } from '@/services/whatsappService';

const TOOLS = [
    { id: 'select', icon: MousePointer2, label: 'Seleccionar (V)', colorClass: 'text-cyan-400', glowClass: 'shadow-[0_0_15px_rgba(34,211,238,0.4)]', bgClass: 'bg-cyan-500' },
    { id: 'draw', icon: Pencil, label: 'Lápiz (P)', colorClass: 'text-indigo-400', glowClass: 'shadow-[0_0_15px_rgba(99,102,241,0.4)]', bgClass: 'bg-indigo-500' },
    { id: 'brush', icon: Paintbrush, label: 'Pincel (B)', colorClass: 'text-fuchsia-400', glowClass: 'shadow-[0_0_15px_rgba(232,121,249,0.4)]', bgClass: 'bg-fuchsia-500' },
    { id: 'marker', icon: Highlighter, label: 'Marcador (M)', colorClass: 'text-yellow-400', glowClass: 'shadow-[0_0_15px_rgba(250,204,21,0.4)]', bgClass: 'bg-yellow-500' },
    { id: 'eraser', icon: Eraser, label: 'Borrador (E)', colorClass: 'text-rose-400', glowClass: 'shadow-[0_0_15px_rgba(251,113,133,0.4)]', bgClass: 'bg-rose-500' },
    { id: 'shape', icon: Pentagon, label: 'Formas geométricas (U)', colorClass: 'text-emerald-400', glowClass: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]', bgClass: 'bg-emerald-500' },
    { id: 'text', icon: Type, label: 'Texto (T)', colorClass: 'text-purple-400', glowClass: 'shadow-[0_0_15px_rgba(192,132,252,0.4)]', bgClass: 'bg-purple-500' },
    { id: 'image', icon: ImageIcon, label: 'Imagen IA (I)', colorClass: 'text-blue-400', glowClass: 'shadow-[0_0_15px_rgba(96,165,250,0.4)]', bgClass: 'bg-blue-500' },
];

const BRUSH_VARIATIONS = [
    { id: 'soft', label: 'Pincel Suave', icon: Brush, desc: 'Bordes difuminados' },
    { id: 'hard', label: 'Pincel Duro', icon: Paintbrush, desc: 'Bordes definidos' },
    { id: 'spray', label: 'Aerosol', icon: SprayCan, desc: 'Efecto granulado' },
    { id: 'caligraphy', label: 'Caligráfico', icon: Wand2, desc: 'Punta inclinada' },
    { id: 'texture', label: 'Textura', icon: Waves, desc: 'Grano artístico' },
];

const MARKER_TYPES = [
    { id: 'highlighter', label: 'Resaltador', icon: Highlighter, desc: 'Líneas transparentes' },
    { id: 'flat', label: 'Marcador Plano', icon: Minus, desc: 'Bordes rectos' },
    { id: 'arrow', label: 'Flecha Automática', icon: ArrowRight, desc: 'Anotaciones' },
];

const PENCIL_PRESETS = [
    { id: 'rough', label: 'Esbozo 2B', weight: 4, opacity: 1.0, smoothing: 0.3, desc: 'Grafito blando y orgánico' },
    { id: 'standard', label: 'Estándar HB', weight: 2, opacity: 1.0, smoothing: 0.5, desc: 'Equilibrado y predictivo' },
    { id: 'technical', label: 'Técnico 4H', weight: 1, opacity: 1.0, smoothing: 0.8, desc: 'Líneas finas y precisas' },
];

const PENCIL_EFFECTS = [
    { id: 'none', label: 'Normal', desc: 'Trazo continuo' },
    { id: 'dashed', label: 'Entrecortada', desc: 'Línea a saltos' },
    { id: 'gothic', label: 'Gótica', desc: 'Ancho y delgado' },
];

const TEXTURE_TYPES = [
    { id: 'grain', label: 'Grano Fino' },
    { id: 'chalk', label: 'Tiza' },
    { id: 'sponge', label: 'Esponja' },
];

const SHAPE_TYPES = [
    { id: 'rect', label: 'Rectángulo', icon: Square },
    { id: 'circle', label: 'Círculo', icon: Circle },
    { id: 'triangle', label: 'Triángulo', icon: Triangle, sides: 3 },
    { id: 'pentagon', label: 'Pentágono', icon: Pentagon, sides: 5 },
    { id: 'hexagon', label: 'Hexágono', icon: Hexagon, sides: 6 },
    { id: 'arrow', label: 'Flecha', icon: ArrowRight },
    { id: 'line', label: 'Línea', icon: Minus },
];

const FONT_FAMILIES = [
    { id: 'Inter', name: 'Inter' },
    { id: 'Montserrat', name: 'Montserrat' },
    { id: 'Bebas Neue', name: 'Bebas Neue' },
    { id: 'Playfair Display', name: 'Playfair' },
    { id: 'Outfit', name: 'Outfit' },
    { id: 'Roboto Mono', name: 'Code' },
];

const SCENE_TYPES = [
    { id: 'wide', label: 'Plano General', icon: Maximize },
    { id: 'medium', label: 'Plano Medio', icon: Video },
    { id: 'close', label: 'Primer Plano', icon: Target },
];

const SCENE_OBJECTIVES = [
    { id: 'idea', label: 'Idea', color: 'bg-indigo-500' },
    { id: 'hook', label: 'Gancho', color: 'bg-pink-500' },
    { id: 'problem', label: 'Problema', color: 'bg-red-500' },
    { id: 'solution', label: 'Solución', color: 'bg-emerald-500' },
    { id: 'development', label: 'Desarrollo', color: 'bg-blue-500' },
    { id: 'cta', label: 'Cierre / CTA', color: 'bg-amber-500' },
];

const blendHex = (hex, mixLevel) => {
    let r = parseInt(hex.slice(1, 3), 16) || 0;
    let g = parseInt(hex.slice(3, 5), 16) || 0;
    let b = parseInt(hex.slice(5, 7), 16) || 0;
    const tr = mixLevel < 0 ? 0 : 255;
    const tg = mixLevel < 0 ? 0 : 255;
    const tb = mixLevel < 0 ? 0 : 255;
    const p = Math.abs(mixLevel);
    r = Math.round(r + (tr - r) * p);
    g = Math.round(g + (tg - g) * p);
    b = Math.round(b + (tb - b) * p);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const pointToSegmentDistance = (px, py, x1, y1, x2, y2) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) {
        param = dot / len_sq;
    }

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
};

const getDynamicTones = (hex) => {
    if (!hex || hex.toLowerCase() === '#000000') return ['#000000', '#1A1A1A', '#333333', '#4D4D4D', '#666666', '#808080'];
    if (hex.toLowerCase() === '#ffffff') return ['#FFFFFF', '#E6E6E6', '#CCCCCC', '#B3B3B3', '#999999', '#808080'];
    return [-0.6, -0.3, 0, 0.2, 0.4, 0.6].map(p => blendHex(hex, p));
};

export default function StoryboardEditor({ role = 'admin' }) {
    const { setIsSuppressed } = useSidebar();
    const router = useRouter();

    useEffect(() => {
        if (setIsSuppressed) {
            setIsSuppressed(true);
            return () => setIsSuppressed(false);
        }
    }, [setIsSuppressed]);

    const [scenes, setScenes] = useState([
        {
            id: 'sc_01',
            name: 'Escena 1',
            duration: 5,
            type: 'wide',
            notes: '',
            layers: [
                { id: 'bg', name: 'Fondo', visible: true, locked: false, data: null },
                { id: 'l1', name: 'Capa 1', visible: true, locked: false, data: null }
            ],
            activeLayerId: 'l1',
            objective: 'idea'
        }
    ]);
    const [activeSceneId, setActiveSceneId] = useState('sc_01');
    const [activeTool, setActiveTool] = useState('draw');
    const [activeColor, setActiveColor] = useState('#6366f1');
    const [baseColor, setBaseColor] = useState('#6366f1');
    const [brushSize, setBrushSize] = useState(3);
    const [isFullscreen, setIsFullscreen] = useState(true);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startCoords, setStartCoords] = useState(null);
    const [configSceneId, setConfigSceneId] = useState(null);
    const [docSize, setDocSize] = useState({ width: 1920, height: 1080 });
    const [activeTemplate, setActiveTemplate] = useState(null);
    const [projectName, setProjectName] = useState('Nuevo Proyecto');

    const activeScene = scenes.find(s => s.id === activeSceneId);
    const configScene = scenes.find(s => s.id === configSceneId);
    const layers = activeScene?.layers || [];
    const activeLayerId = activeScene?.activeLayerId || (layers[0]?.id);
    const [showLanding, setShowLanding] = useState(true); // Controla la pantalla premium inicial
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [tempProjectName, setTempProjectName] = useState(projectName);
    const [tempDocSize, setTempDocSize] = useState(docSize);
    const [cursor, setCursor] = useState('none');
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [bottomBarVisible, setBottomBarVisible] = useState(true);
    const [zenMode, setZenMode] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showGrid, setShowGrid] = useState(true);
    const [activeGuide, setActiveGuide] = useState('none');
    const [workspaceTheme, setWorkspaceTheme] = useState('dark');
    const [showRulers, setShowRulers] = useState(false);
    const [canvasMousePos, setCanvasMousePos] = useState({ visible: false }); // Position removed from state
    const pointerRef = useRef(null);
    const pointerSizeRef = useRef(null);
    const lastCoordsRef = useRef({ x: -1000, y: -1000 }); // Off-screen initialization to avoid ghosting
    const [showPointerTip, setShowPointerTip] = useState(true);
    const [expandedPanels, setExpandedPanels] = useState({ props: true, layers: true, meta: true });
    const [assetsTab, setAssetsTab] = useState('project');
    const [globalAssets, setGlobalAssets] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('diic_global_assets');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('diic_global_assets', JSON.stringify(globalAssets));
    }, [globalAssets]);

    const [brushSettings, setBrushSettings] = useState({
        type: 'hard',
        opacity: 1,
        smoothing: 0.5,
        hardness: 0.8,
        textureType: 'grain',
        spacing: 0.1,
        tip: 'round'
    });

    const [shapeSettings, setShapeSettings] = useState({
        type: 'rect',
        strokeColor: '#6366f1',
        strokeWidth: 4,
        strokeStyle: 'solid',
        fillColor: 'transparent',
        isTransparent: true,
        rounded: 12,
        shadow: false
    });

    const [markerSettings, setMarkerSettings] = useState({
        type: 'highlighter',
        opacity: 0.6,
        snap: true
    });

    const [pencilSettings, setPencilSettings] = useState({
        preset: 'standard',
        effect: 'none',
        stabilizer: 0.5,
        pressureSim: true
    });

    const [colorPickerConfig, setColorPickerConfig] = useState({ isOpen: false, targetKey: null, color: '#000000', title: 'Color' });

    const [textSettings, setTextSettings] = useState({
        fontFamily: 'Inter',
        fontSize: 40,
        fontWeight: '900',
        color: '#000000',
        strokeColor: '#ffffff',
        strokeWidth: 0,
        text: ''
    });

    const [imageSettings, setImageSettings] = useState({
        opacity: 1,
        removeBg: false,
        cutoutMode: 'ai',
        selectionTarget: 'none', // 'none', 'fondo', 'sujeto'
        cutoutApplied: false,
        cutoutStrokeWidth: 0,
        cutoutStrokeColor: '#ffffff',
        enhanceAi: false,
        exposure: 0,
        contrast: 100,
        saturation: 100,
        brightness: 100,
        warmth: 0,
        vibrance: 0,
        highlights: 0,
        shadows: 0,
        whites: 0,
        blacks: 0
    });

    const [isAnalyzingSelection, setIsAnalyzingSelection] = useState(false);
    const [aiCutoutReady, setAiCutoutReady] = useState(false);
    const [renamingLayerId, setRenamingLayerId] = useState(null);
    const [selectedLayerIds, setSelectedLayerIds] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleSendToProduction = async (type = 'CAMPAIGN_SALES') => {
        try {
            setActiveModal(null);
            showToast("Orquestando producción...");
            
            const result = await orchestrationService.orchestrate(type, {
                userId: 'user_current', // In real app, get from context
                projectName: projectName,
                scenesCount: scenes.length
            });

            if (result.success) {
                showToast("✅ Proyecto enviado a producción");
            } else {
                showToast("❌ Error al enviar a producción");
            }
        } catch (error) {
            console.error(error);
            showToast("❌ Error de red");
        }
    };

    const handlePublishAction = async (action) => {
        switch (action) {
            case 'compartir-enlace':
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    setToastMessage("✅ Enlace copiado al portapapeles");
                    setTimeout(() => setToastMessage(null), 3000);
                } catch (e) {
                    setToastMessage("❌ Error al copiar enlace");
                    setTimeout(() => setToastMessage(null), 3000);
                }
                break;
            case 'exportar-storyboard':
                setExportProgress(0);
                setActiveModal('exportar');
                setIsExporting(true);
                setExportProgress(0);
                // Simulate export
                const interval = setInterval(() => {
                    setExportProgress(prev => {
                        if (prev >= 100) {
                            clearInterval(interval);
                            showToast("✅ Storyboard exportado");
                            return 100;
                        }
                        return prev + 10;
                    });
                }, 300);
                break;
            case 'guardar-en-proyecto':
                saveCurrentToState();
                showToast("✅ Proyecto guardado correctamente");
                break;
            default:
                setActiveModal(`publicar-${action}`);
        }
        setActiveMenu(null);
    };

    const handleSelectionClick = (target) => {
        if (imageSettings.selectionTarget === target) {
            setImageSettings(p => ({ ...p, selectionTarget: 'none' }));
            setAiCutoutReady(false);
        } else {
            setImageSettings(p => ({ ...p, selectionTarget: 'none', removeBg: false }));
            setAiCutoutReady(false);
            setIsAnalyzingSelection(true);
            setTimeout(() => {
                setIsAnalyzingSelection(false);
                setImageSettings(p => ({ ...p, selectionTarget: target }));
                setAiCutoutReady(true);
            }, 1500);
        }
    };

    // --- PHASE 19: VECTOR ARCHITECTURE ---
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [clipboard, setClipboard] = useState(null);

    const [selectedElementId, setSelectedElementId] = useState(null);

    const pushToHistory = useCallback((newElements) => {
        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            return [...newHistory, newElements];
        });
        setHistoryIndex(prev => prev + 1);
    }, [historyIndex]);

    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            setElements(history[prevIndex]);
            setHistoryIndex(prevIndex);
            setSelectedElementId(null);
        }
    }, [history, historyIndex]);

    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            setElements(history[nextIndex]);
            setHistoryIndex(nextIndex);
            setSelectedElementId(null);
        }
    }, [history, historyIndex]);

    const handleCopy = useCallback(() => {
        if (selectedElementId) {
            const element = elements.find(el => el.id === selectedElementId);
            if (element) {
                setClipboard({ ...element, id: `element_${Date.now()}` });
            }
        }
    }, [elements, selectedElementId]);

    const handleCut = useCallback(() => {
        if (selectedElementId) {
            const element = elements.find(el => el.id === selectedElementId);
            if (element) {
                setClipboard({ ...element, id: `element_${Date.now()}` });
                const newElements = elements.filter(el => el.id !== selectedElementId);
                setElements(newElements);
                pushToHistory(newElements);
                setSelectedElementId(null);
            }
        }
    }, [elements, selectedElementId, pushToHistory]);

    const handlePaste = useCallback(() => {
        if (clipboard) {
            const pastedElement = {
                ...clipboard,
                id: `element_${Date.now()}`,
                layerId: activeLayerId,
                sceneId: activeSceneId
            };
            
            if (pastedElement.x !== undefined) pastedElement.x += 20;
            if (pastedElement.y !== undefined) pastedElement.y += 20;
            if (pastedElement.startX !== undefined) pastedElement.startX += 20;
            if (pastedElement.startY !== undefined) pastedElement.startY += 20;
            if (pastedElement.endX !== undefined) pastedElement.endX += 20;
            if (pastedElement.endY !== undefined) pastedElement.endY += 20;
            if (pastedElement.points) {
                pastedElement.points = pastedElement.points.map(p => ({ x: p.x + 20, y: p.y + 20 }));
            }

            const newElements = [...elements, pastedElement];
            setElements(newElements);
            pushToHistory(newElements);
            setSelectedElementId(pastedElement.id);
        }
    }, [clipboard, elements, activeLayerId, activeSceneId, pushToHistory]);

    const duplicateSelected = useCallback(() => {
        if (!selectedElementId) return;
        const element = elements.find(el => el && el.id === selectedElementId);
        if (element) {
            const newElement = {
                ...JSON.parse(JSON.stringify(element)),
                id: `${element.type}_${Date.now()}`,
                sceneId: activeSceneId,
                x: (element.x !== undefined) ? element.x + 20 : undefined,
                y: (element.y !== undefined) ? element.y + 20 : undefined,
                startX: (element.startX !== undefined) ? element.startX + 20 : undefined,
                startY: (element.startY !== undefined) ? element.startY + 20 : undefined,
                endX: (element.endX !== undefined) ? element.endX + 20 : undefined,
                endY: (element.endY !== undefined) ? element.endY + 20 : undefined,
                points: element.points ? element.points.map(p => ({ x: p.x + 20, y: p.y + 20 })) : undefined
            };
            const newElements = [...elements, newElement];
            setElements(newElements);
            pushToHistory(newElements);
            setSelectedElementId(newElement.id);
        }
    }, [elements, selectedElementId, activeSceneId, pushToHistory]);

    const deleteSelected = useCallback(() => {
        if (!selectedElementId) return;
        const newElements = elements.filter(el => el.id !== selectedElementId);
        setElements(newElements);
        pushToHistory(newElements);
        setSelectedElementId(null);
    }, [elements, selectedElementId, pushToHistory]);

    const [isTransforming, setIsTransforming] = useState(false);
    const [transformMode, setTransformMode] = useState(null); // 'move', 'nw-resize', 'ne-resize', 'sw-resize', 'se-resize', 'rotate'
    const [transformStartProps, setTransformStartProps] = useState(null);

    const findHitElement = useCallback((cx, cy) => {
        // Search elements from top to bottom (last in array is top)
        for (let i = elements.length - 1; i >= 0; i--) {
            const el = elements[i];
            if (el.sceneId !== activeSceneId || !el) continue;

            if (el.type === 'shape') {
                const minX = Math.min(el.startX, el.endX);
                const maxX = Math.max(el.startX, el.endX);
                const minY = Math.min(el.startY, el.endY);
                const maxY = Math.max(el.startY, el.endY);
                if (cx >= minX && cx <= maxX && cy >= minY && cy <= maxY) return el;
            } else if (el.type === 'image') {
                if (cx >= el.x && cx <= el.x + el.w && cy >= el.y && cy <= el.y + el.h) return el;
            } else if (el.type === 'text') {
                // Approximate hit detection for text
                const padding = 10;
                if (cx >= el.x - padding && cx <= el.x + 200 && cy >= el.y - padding && cy <= el.y + 50) return el;
            } else if (el.type === 'path') {
                if (!el.points) continue;
                for (let j = 1; j < el.points.length; j++) {
                    const p1 = el.points[j - 1];
                    const p2 = el.points[j];
                    const dist = pointToSegmentDistance(cx, cy, p1.x, p1.y, p2.x, p2.y);
                    if (dist < (el.size || 5) + 5) return el;
                }
            }
        }
        return null;
    }, [elements, activeSceneId]);

    const startDrawing = (e) => {
        if (e.button !== 0) return; 
        if (!containerRef.current) return;
        e.preventDefault();
        const rect = containerRef.current.getBoundingClientRect();
        const { x: cx, y: cy } = screenToCanvas(e.clientX, e.clientY, rect);

        setIsDrawing(true);
        setStartCoords({ x: cx, y: cy });
        lastPosRef.current = { x: cx, y: cy };

        if (activeTool === 'select') {
            const el = selectedElementId ? elements.find(e => e.id === selectedElementId) : null;
            if (el) {
                // Check for handles
                let minX, minY, maxX, maxY;
                if (el.type === 'image') { minX = el.x; minY = el.y; maxX = el.x + el.w; maxY = el.y + el.h; }
                else if (el.type === 'shape') { minX = Math.min(el.startX, el.endX); maxX = Math.max(el.startX, el.endX); minY = Math.min(el.startY, el.endY); maxY = Math.max(el.startY, el.endY); }
                else if (el.type === 'path') { const xs = el.points.map(p => p.x); const ys = el.points.map(p => p.y); minX = Math.min(...xs); maxX = Math.max(...xs); minY = Math.min(...ys); maxY = Math.max(...ys); }
                else if (el.type === 'text' && canvasRefs.current[el.layerId]) {
                    const tCtx = canvasRefs.current[el.layerId].getContext('2d');
                    tCtx.font = `${el.settings.fontWeight} ${el.settings.fontSize}px "${el.settings.fontFamily}", sans-serif`;
                    const lines = el.textData.split('\n');
                    const width = Math.max(...lines.map(l => tCtx.measureText(l).width));
                    const height = lines.length * el.settings.fontSize * 1.2;
                    minX = el.x; maxX = el.x + width; minY = el.y; maxY = el.y + height;
                }

                if (minX !== undefined) {
                    const p = 8, h = 12; // Hit area slightly larger
                    const midX = (minX + maxX) / 2;
                    const midY = (minY + maxY) / 2;
                    const hdlPos = [
                        { x: minX - p, y: minY - p, mode: 'nw-resize' }, { x: maxX + p, y: minY - p, mode: 'ne-resize' },
                        { x: minX - p, y: maxY + p, mode: 'sw-resize' }, { x: maxX + p, y: maxY + p, mode: 'se-resize' },
                        { x: midX, y: minY - p, mode: 'n-resize' }, { x: midX, y: maxY + p, mode: 's-resize' },
                        { x: minX - p, y: midY, mode: 'w-resize' }, { x: maxX + p, y: midY, mode: 'e-resize' },
                        { x: midX, y: minY - p - 20, mode: 'rotate' }
                    ];

                    const hitHdl = hdlPos.find(hd => Math.sqrt(Math.pow(cx - hd.x, 2) + Math.pow(cy - hd.y, 2)) < h);
                    if (hitHdl) {
                        setTransformMode(hitHdl.mode);
                        setIsTransforming(true);
                        setTransformStartProps({ ...el, mouseX: cx, mouseY: cy });
                        dragOffsetRef.current = { dx: 0, dy: 0 };
                        return;
                    }
                }
            }

            const hit = findHitElement(cx, cy);
            if (hit) {
                setSelectedElementId(hit.id);
                setIsTransforming(true);
                setTransformMode('move');
                setTransformStartProps({ ...hit, mouseX: cx, mouseY: cy });
                dragOffsetRef.current = { dx: 0, dy: 0 };
            } else {
                setSelectedElementId(null);
            }
        } else if (['draw', 'brush', 'marker', 'eraser'].includes(activeTool)) {
            currentPathRef.current = {
                id: `path_${Date.now()}`,
                type: 'path',
                tool: activeTool,
                points: [{ x: cx, y: cy }],
                color: activeTool === 'eraser' ? 'rgba(0,0,0,1)' : activeColor,
                size: activeTool === 'eraser' ? eraserSettings.size : brushSize,
                sceneId: activeSceneId,
                layerId: activeLayerId,
                settings: activeTool === 'draw' ? { ...pencilSettings } :
                         activeTool === 'brush' ? { ...brushSettings } :
                         activeTool === 'marker' ? { ...markerSettings } :
                         { ...eraserSettings }
            };
        } else if (activeTool === 'shape') {
            shapePreviewData.current = {
                id: `shape_${Date.now()}`,
                type: 'shape',
                shapeType: shapeSettings.type,
                startX: cx,
                startY: cy,
                endX: cx,
                endY: cy,
                sceneId: activeSceneId,
                layerId: activeLayerId,
                settings: { ...shapeSettings }
            };
        } else if (activeTool === 'text') {
            setFloatingTextConfig({
                isOpen: true,
                text: '',
                coords: { x: cx, y: cy },
                screenCoords: { x: e.clientX, y: e.clientY }
            });
            setIsDrawing(false);
        }

        requestAnimationFrame(redrawCanvas);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const { x: cx, y: cy } = screenToCanvas(e.clientX, e.clientY, rect);

        if (activeTool === 'select' && selectedElementId && isTransforming) {
            dragOffsetRef.current = {
                dx: cx - (startCoords?.x || cx),
                dy: cy - (startCoords?.y || cy)
            };
            requestAnimationFrame(redrawCanvas);
        } else if (['draw', 'brush', 'marker', 'eraser'].includes(activeTool) && currentPathRef.current) {
            const last = currentPathRef.current.points[currentPathRef.current.points.length - 1];
            const dist = Math.sqrt(Math.pow(cx - last.x, 2) + Math.pow(cy - last.y, 2));
            
            if (dist > 2) {
                currentPathRef.current.points.push({ x: cx, y: cy });
                requestAnimationFrame(redrawCanvas);
            }
        } else if (activeTool === 'shape' && shapePreviewData.current) {
            shapePreviewData.current.endX = cx;
            shapePreviewData.current.endY = cy;
            requestAnimationFrame(redrawCanvas);
        }
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        if (activeTool === 'select' && selectedElementId && isTransforming) {
            const el = elements.find(el => el.id === selectedElementId);
            if (el) {
                let updatedProps = {};
                const { dx, dy } = dragOffsetRef.current;
                
                if (transformMode === 'move') {
                    if (el.type === 'shape') {
                        updatedProps = { startX: el.startX + dx, endX: el.endX + dx, startY: el.startY + dy, endY: el.endY + dy };
                    } else if (el.type === 'path') {
                        updatedProps = { points: el.points.map(p => ({ x: p.x + dx, y: p.y + dy })) };
                    } else if (el.type === 'text' || el.type === 'image') {
                        updatedProps = { x: el.x + dx, y: el.y + dy };
                    }
                } else if (transformMode && transformStartProps && el.type === 'image') {
                    const sp = transformStartProps;
                    let nx = sp.x, ny = sp.y, nw = sp.w, nh = sp.h, nRot = sp.rotation || 0;

                    if (transformMode === 'se-resize') {
                        nw = Math.max(20, sp.w + dx); nh = Math.max(20, sp.h + dy);
                    } else if (transformMode === 'sw-resize') {
                        nw = Math.max(20, sp.w - dx); nh = Math.max(20, sp.h + dy); nx = sp.x + (sp.w - nw);
                    } else if (transformMode === 'ne-resize') {
                        nw = Math.max(20, sp.w + dx); nh = Math.max(20, sp.h - dy); ny = sp.y + (sp.h - nh);
                    } else if (transformMode === 'nw-resize') {
                        nw = Math.max(20, sp.w - dx); nh = Math.max(20, sp.h - dy); nx = sp.x + (sp.w - nw); ny = sp.y + (sp.h - nh);
                    } else if (transformMode === 'n-resize') {
                        nh = Math.max(20, sp.h - dy); ny = sp.y + (sp.h - nh);
                    } else if (transformMode === 's-resize') {
                        nh = Math.max(20, sp.h + dy);
                    } else if (transformMode === 'e-resize') {
                        nw = Math.max(20, sp.w + dx);
                    } else if (transformMode === 'w-resize') {
                        nw = Math.max(20, sp.w - dx); nx = sp.x + (sp.w - nw);
                    } else if (transformMode === 'rotate') {
                        const centerX = sp.x + sp.w / 2;
                        const centerY = sp.y + sp.h / 2;
                        const currentMouseX = transformStartProps.mouseX + dx;
                        const currentMouseY = transformStartProps.mouseY + dy;
                        const angle = Math.atan2(currentMouseY - centerY, currentMouseX - centerX);
                        nRot = angle * (180 / Math.PI) + 90;
                    }
                    updatedProps = { x: nx, y: ny, w: nw, h: nh, rotation: nRot };
                }

                if (Object.keys(updatedProps).length > 0) {
                    const newElements = elements.map(e => e.id === selectedElementId ? { ...e, ...updatedProps } : e);
                    setElements(newElements);
                    pushToHistory(newElements);
                }
            }
            
            dragOffsetRef.current = { dx: 0, dy: 0 };
            setIsTransforming(false);
            setTransformMode(null);
            setTransformStartProps(null);
        } else if (['draw', 'brush', 'marker', 'eraser'].includes(activeTool) && currentPathRef.current) {
            if (currentPathRef.current.points.length > 1 || activeTool === 'eraser') {
                const newElements = [...elements, currentPathRef.current];
                setElements(newElements);
                pushToHistory(newElements);
            }
            currentPathRef.current = null;
        } else if (activeTool === 'shape' && shapePreviewData.current) {
            const newElements = [...elements, shapePreviewData.current];
            setElements(newElements);
            pushToHistory(newElements);
            shapePreviewData.current = null;
        }

        requestAnimationFrame(() => {
            redrawCanvas();
            saveCurrentToState();
        });
    };

    const [floatingTextConfig, setFloatingTextConfig] = useState({
        isOpen: false,
        text: '',
        coords: null, // Canvas coords
        screenCoords: null // Screen/Viewport coords
    });

    const handleApplyText = (text, coords) => {
        const newElements = [...elements, {
            id: `element_${Date.now()}`,
            type: 'text',
            layerId: activeLayerId,
            sceneId: activeSceneId,
            textData: text,
            x: coords.x,
            y: coords.y,
            settings: { ...textSettings }
        }];
        setElements(newElements);
        pushToHistory(newElements);

        setTextSettings(prev => ({ ...prev, text }));
    };

    const [eraserSettings, setEraserSettings] = useState({
        size: 50,
        opacity: 1,
        hardness: 1.0
    });

    const lastPosRef = useRef(null);
    const lastMidRef = useRef(null);
    const dragOffsetRef = useRef({ dx: 0, dy: 0 });
    const isClient = role === 'client';
    const currentPathRef = useRef(null);
    const shapePreviewData = useRef(null);

    const containerRef = useRef(null);
    const fileInputRef = useRef(null);
    const canvasRefs = useRef({});

    const {
        view,
        setView,
        handleWheel,
        startPanning,
        doPan,
        stopPanning,
        isPanning,
        screenToCanvas
    } = useCanvasController(0.8);

    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setView(prev => ({
                ...prev,
                x: (rect.width - docSize.width * 0.8) / 2,
                y: (rect.height - docSize.height * 0.8) / 2
            }));
        }
    }, [setView]);

    useEffect(() => {
        if (!showLanding) { // Only suppress sidebar when not on landing page
            setIsSuppressed(true);
            return () => setIsSuppressed(false);
        }
    }, [setIsSuppressed, showLanding]);

    const setLayers = useCallback((newLayers) => {
        setScenes(prev => prev.map(s => s.id === activeSceneId ? {
            ...s,
            layers: typeof newLayers === 'function' ? newLayers(s.layers) : newLayers
        } : s));
    }, [activeSceneId]);

    const setActiveLayerId = useCallback((id) => {
        setScenes(prev => prev.map(s => s.id === activeSceneId ? { ...s, activeLayerId: id } : s));
    }, [activeSceneId]);

    const fitToWindow = useCallback(() => {
        if (!containerRef.current) return;
        const sidebarWidth = (sidebarVisible && !zenMode) ? 360 : 0;
        const toolbarWidth = (!zenMode) ? 80 : 0;
        const topBarHeight = (!zenMode) ? 64 : 0;
        const bottomBarHeight = (!zenMode && bottomBarVisible) ? 144 : 0;

        const idealWidth = window.innerWidth - sidebarWidth - toolbarWidth;
        const idealHeight = window.innerHeight - topBarHeight - bottomBarHeight;

        const canvasWidth = docSize.width;
        const canvasHeight = docSize.height;
        const margin = 120;

        const availableWidth = idealWidth - margin;
        const availableHeight = idealHeight - margin;

        const scaleX = availableWidth / canvasWidth;
        const scaleY = availableHeight / canvasHeight;
        const newScale = Math.min(scaleX, scaleY, 1.5);

        setView({
            x: (idealWidth - canvasWidth * newScale) / 2,
            y: (idealHeight - canvasHeight * newScale) / 2,
            scale: newScale
        });
    }, [setView, sidebarVisible, bottomBarVisible, zenMode, docSize]);

    const handleZoomIn = useCallback(() => {
        setView(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 5) }));
    }, [setView]);

    const handleZoomOut = useCallback(() => {
        setView(prev => ({ ...prev, scale: Math.max(prev.scale / 1.2, 0.1) }));
    }, [setView]);

    useEffect(() => {
        if (!showLanding) { // Only fit to window if not on landing page
            fitToWindow();
            window.addEventListener('resize', fitToWindow);
            return () => window.removeEventListener('resize', fitToWindow);
        }
    }, [fitToWindow, sidebarVisible, bottomBarVisible, zenMode, docSize, showLanding]);

    const saveCurrentToState = useCallback(() => {
        setScenes(prev => prev.map(s => {
            if (s.id !== activeSceneId) return s;
            
            // 1. Actualizar datos de cada capa individualmente
            const updatedLayers = s.layers.map(layer => {
                const canvas = canvasRefs.current[layer.id];
                if (!canvas) return layer;
                return { ...layer, data: canvas.toDataURL() };
            });

            // 2. Generar previsualización combinada para SceneStrip
            // Creamos un canvas temporal para fusionar las capas visibles
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = docSize.width;
            tempCanvas.height = docSize.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            // Dibujar fondo de transparencia (opcional, pero ayuda a ver la escena)
            // No lo ponemos para que el SceneStrip se vea limpio
            
            // Dibujar capas visibles en orden
            updatedLayers.filter(l => l.visible).forEach(l => {
                const canvas = canvasRefs.current[l.id];
                if (canvas) tempCtx.drawImage(canvas, 0, 0);
            });

            return { 
                ...s, 
                layers: updatedLayers,
                canvasData: tempCanvas.toDataURL('image/jpeg', 0.5) // JPG para optimizar memoria
            };
        }));
    }, [activeSceneId, docSize]);

    const handleSceneSwitch = useCallback((id) => {
        if (id === activeSceneId) return;
        saveCurrentToState();
        setActiveSceneId(id);
    }, [activeSceneId, saveCurrentToState]);

    useEffect(() => {
        if (!activeScene) return;
        activeScene.layers.forEach(layer => {
            const canvas = canvasRefs.current[layer.id];
            if (!canvas) return;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });

            // Critical Layer Refresh
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (layer.data) {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                    // Force a re-render hook to catch vectors that exist on top of loaded backgrounds
                };
                img.src = layer.data;
            }
        });
    }, [activeSceneId]);

    useEffect(() => {
        const interval = setInterval(() => {
            saveCurrentToState();
        }, 5000);
        return () => clearInterval(interval);
    }, [saveCurrentToState]);
    
    // --- PLAYBACK ENGINE ---
    useEffect(() => {
        if (!isPlaying) return;
        
        const currentScene = scenes.find(s => s.id === activeSceneId);
        const duration = (currentScene?.duration || 5) * 1000;
        
        const timer = setTimeout(() => {
            const currentIndex = scenes.findIndex(s => s.id === activeSceneId);
            const nextIndex = (currentIndex + 1) % scenes.length;
            
            // If it's the last scene, we might want to stop or loop. For now, loop.
            handleSceneSwitch(scenes[nextIndex].id);
        }, duration);
        
        return () => clearTimeout(timer);
    }, [isPlaying, activeSceneId, scenes, handleSceneSwitch]);

    // --- PHASE 19: HUD TO VECTOR SYNC ---
    // --- PHASE 19: HUD TO VECTOR SYNC ---
    useEffect(() => {
        if (!selectedElementId || activeTool !== 'select') return;
        setElements(prev => prev.map(el => {
            if (el.id !== selectedElementId) return el;

            if (el.type === 'shape') return { ...el, settings: { ...shapeSettings } };
            if (el.type === 'text') {
                return { ...el, textData: textSettings.textData !== undefined ? textSettings.textData : el.textData, settings: { ...textSettings } };
            }
            if (el.type === 'image') return { ...el, settings: { ...imageSettings } };
            if (el.type === 'path') {
                if (el.tool === 'draw') return { ...el, color: activeColor, size: brushSize, settings: { ...pencilSettings } };
                if (el.tool === 'brush') return { ...el, color: activeColor, size: brushSize, settings: { ...brushSettings } };
                if (el.tool === 'marker') return { ...el, color: activeColor, size: brushSize, settings: { ...markerSettings } };
                if (el.tool === 'eraser') return { ...el, color: 'rgba(0,0,0,1)', size: eraserSettings.size, settings: { ...eraserSettings } }; // Eraser must be opaque for destination-out mask
            }
            return el;
        }));
    }, [shapeSettings, textSettings, imageSettings, pencilSettings, brushSettings, markerSettings, eraserSettings, activeColor, brushSize]);

    // --- VECTOR RENDER ENGINE ---
    const renderElements = useCallback((ctx, renderableElements) => {
        renderableElements.forEach(el => {
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';

            let drawEl = el;
            if (activeTool === 'select' && el.id === selectedElementId && (dragOffsetRef.current.dx !== 0 || dragOffsetRef.current.dy !== 0 || isTransforming)) {
                // Render transformation preview based on the actively moving drag offsets and mode, or standard move as fallback.
                if (transformMode && transformStartProps && el.type === 'image') {
                    const { dx, dy } = dragOffsetRef.current;
                    const sp = transformStartProps;
                    let nx = sp.x, ny = sp.y, nw = sp.w, nh = sp.h, nRot = sp.rotation || 0;

                    if (transformMode === 'move') {
                        nx += dx; ny += dy;
                    } else if (transformMode === 'se-resize') {
                        nw = Math.max(20, sp.w + dx); nh = Math.max(20, sp.h + dy);
                    } else if (transformMode === 'sw-resize') {
                        nw = Math.max(20, sp.w - dx); nh = Math.max(20, sp.h + dy); nx = sp.x + (sp.w - nw);
                    } else if (transformMode === 'ne-resize') {
                        nw = Math.max(20, sp.w + dx); nh = Math.max(20, sp.h - dy); ny = sp.y + (sp.h - nh);
                    } else if (transformMode === 'nw-resize') {
                        nw = Math.max(20, sp.w - dx); nh = Math.max(20, sp.h - dy); nx = sp.x + (sp.w - nw); ny = sp.y + (sp.h - nh);
                    } else if (transformMode === 'n-resize') {
                        nh = Math.max(20, sp.h - dy); ny = sp.y + (sp.h - nh);
                    } else if (transformMode === 's-resize') {
                        nh = Math.max(20, sp.h + dy);
                    } else if (transformMode === 'e-resize') {
                        nw = Math.max(20, sp.w + dx);
                    } else if (transformMode === 'w-resize') {
                        nw = Math.max(20, sp.w - dx); nx = sp.x + (sp.w - nw);
                    } else if (transformMode === 'rotate') {
                        const centerX = sp.x + sp.w / 2;
                        const centerY = sp.y + sp.h / 2;
                        const currentMouseX = transformStartProps.mouseX + dx;
                        const currentMouseY = transformStartProps.mouseY + dy;
                        const angle = Math.atan2(currentMouseY - centerY, currentMouseX - centerX);
                        nRot = angle * (180 / Math.PI) + 90; // Adjusting 0deg to top
                    }
                    drawEl = { ...el, x: nx, y: ny, w: nw, h: nh, rotation: nRot };
                } else {
                    const { dx, dy } = dragOffsetRef.current;
                    if (el.type === 'shape') {
                        drawEl = { ...el, startX: el.startX + dx, endX: el.endX + dx, startY: el.startY + dy, endY: el.endY + dy };
                    } else if (el.type === 'path') {
                        drawEl = { ...el, points: el.points.map(p => ({ x: p.x + dx, y: p.y + dy })) };
                    } else if (el.type === 'text' || el.type === 'image') {
                        drawEl = { ...el, x: el.x + dx, y: el.y + dy };
                    }
                }
            }

            if (drawEl.type === 'path') {
                const { tool, points, settings, color, size } = drawEl;
                ctx.strokeStyle = color;
                ctx.lineWidth = size;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.globalAlpha = settings?.opacity || 1;

                if (!points || points.length === 0) return;

                const prng = (x, y, i) => {
                    let h = Math.sin(x * 12.9898 + y * 78.233 + i * 45.123) * 43758.5453123;
                    return h - Math.floor(h);
                };

                if (tool === 'draw') {
                    const preset = PENCIL_PRESETS.find(p => p.id === settings?.preset) || PENCIL_PRESETS[1];
                    const effect = settings?.effect || 'none';
                    ctx.globalAlpha = preset.opacity;

                    if (effect === 'dashed') ctx.setLineDash([size * preset.weight, size * preset.weight * 1.5]);
                    else ctx.setLineDash([]);

                    let lastMid = points[0];
                    points.forEach((pt, i) => {
                        if (i === 0) return;
                        const prev = points[i - 1];
                        let currentWidth = size * (preset.weight / 2);
                        const dist = Math.sqrt(Math.pow(pt.x - prev.x, 2) + Math.pow(pt.y - prev.y, 2));
                        const velocity = Math.min(dist / 25, 1);

                        if (effect === 'gothic') {
                            const angle = Math.atan2(pt.y - prev.y, pt.x - prev.x);
                            const angleFactor = Math.abs(Math.sin(angle - Math.PI / 4));
                            currentWidth = currentWidth * (0.3 + angleFactor * 1.2);
                        } else if (effect === 'none') {
                            currentWidth = currentWidth * (1 - velocity * 0.1);
                        } else {
                            currentWidth = currentWidth * (1 - velocity * 0.2);
                        }

                        ctx.lineWidth = currentWidth;
                        ctx.beginPath();
                        ctx.moveTo(lastMid.x, lastMid.y);
                        const xc = (prev.x + pt.x) / 2;
                        const yc = (prev.y + pt.y) / 2;
                        ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
                        ctx.stroke();
                        lastMid = { x: xc, y: yc };

                        if (i === points.length - 1) {
                            ctx.beginPath();
                            ctx.moveTo(lastMid.x, lastMid.y);
                            ctx.lineTo(pt.x, pt.y);
                            ctx.stroke();
                        }
                    });
                    ctx.setLineDash([]);
                }
                else if (tool === 'marker') {
                    ctx.globalCompositeOperation = settings?.type === 'highlighter' ? 'multiply' : 'source-over';
                    ctx.globalAlpha = settings?.opacity || 0.6;
                    ctx.lineCap = settings?.type === 'flat' ? 'square' : 'round';
                    ctx.lineJoin = settings?.type === 'flat' ? 'miter' : 'round';
                    ctx.lineWidth = size * (settings?.type === 'flat' ? 2.5 : 2);

                    let lastMid = points[0];
                    ctx.beginPath();
                    points.forEach((pt, i) => {
                        if (i === 0) { ctx.moveTo(pt.x, pt.y); return; }
                        const prev = points[i - 1];
                        const xc = (prev.x + pt.x) / 2;
                        const yc = (prev.y + pt.y) / 2;
                        if (i === 1) ctx.moveTo(prev.x, prev.y);
                        else ctx.moveTo(lastMid.x, lastMid.y);

                        if (settings?.type === 'flat') {
                            ctx.lineTo(pt.x, pt.y); // sharper angles for flat marker
                        } else {
                            ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
                        }

                        lastMid = { x: xc, y: yc };
                    });

                    if (points.length > 1) {
                        const lastPt = points[points.length - 1];
                        ctx.lineTo(lastPt.x, lastPt.y);
                    }
                    ctx.stroke();

                    if (settings?.type === 'arrow' && points.length > 1) {
                        const start = points[Math.max(0, points.length - 5)];
                        const end = points[points.length - 1];
                        const headlen = size * 3;
                        const angle = Math.atan2(end.y - start.y, end.x - start.x);
                        ctx.beginPath();
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.moveTo(end.x, end.y);
                        ctx.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
                        ctx.moveTo(end.x, end.y);
                        ctx.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
                        ctx.stroke();
                    }

                    ctx.globalCompositeOperation = 'source-over';
                }
                else if (tool === 'brush') {
                    const bType = settings?.type;
                    ctx.globalAlpha = settings?.opacity || 1;

                    if (bType === 'soft') {
                        ctx.shadowBlur = size * (2 - (settings?.hardness || 0.8) * 2);
                        ctx.shadowColor = color;

                        let lastMid = points[0];
                        ctx.beginPath();
                        points.forEach((pt, i) => {
                            if (i === 0) { ctx.moveTo(pt.x, pt.y); return; }
                            const prev = points[i - 1];
                            const xc = (prev.x + pt.x) / 2;
                            const yc = (prev.y + pt.y) / 2;
                            ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
                            lastMid = { x: xc, y: yc };
                        });
                        const last = points[points.length - 1];
                        if (last) ctx.lineTo(last.x, last.y);
                        ctx.stroke();
                        ctx.shadowBlur = 0;
                    } else if (bType === 'spray') {
                        const density = size * 3;
                        ctx.fillStyle = color;
                        points.forEach((pt) => {
                            for (let i = 0; i < density; i++) {
                                const r1 = prng(pt.x, pt.y, i);
                                const r2 = prng(pt.y, pt.x, i);
                                const r3 = prng(pt.x + pt.y, i, 0);
                                const offsetX = (r1 - 0.5) * size * 2.5;
                                const offsetY = (r2 - 0.5) * size * 2.5;
                                ctx.globalAlpha = (settings?.opacity || 1) * (r3 * 0.5 + 0.3);
                                ctx.fillRect(pt.x + offsetX, pt.y + offsetY, 1, 1);
                            }
                        });
                    } else if (bType === 'caligraphy') {
                        ctx.lineWidth = 1;
                        points.forEach((pt, i) => {
                            if (i === 0) return;
                            const prev = points[i - 1];
                            const dist = Math.sqrt(Math.pow(pt.x - prev.x, 2) + Math.pow(pt.y - prev.y, 2));
                            const step = Math.max(1, dist / 10);
                            const angle = Math.atan2(pt.y - prev.y, pt.x - prev.x);
                            for (let d = 0; d < dist; d += step) {
                                const px = prev.x + Math.cos(angle) * d;
                                const py = prev.y + Math.sin(angle) * d;
                                ctx.beginPath();
                                ctx.moveTo(px - size * 0.8, py + size * 0.8);
                                ctx.lineTo(px + size * 0.8, py - size * 0.8);
                                ctx.stroke();
                            }
                        });
                    } else if (bType === 'texture') {
                        ctx.fillStyle = color;
                        const texType = settings?.textureType || 'grain';
                        points.forEach((pt, idx) => {
                            if (idx === 0) return;
                            const prev = points[idx - 1];
                            const dist = Math.sqrt(Math.pow(pt.x - prev.x, 2) + Math.pow(pt.y - prev.y, 2));
                            const step = Math.max(2, size / 4);
                            const angle = Math.atan2(pt.y - prev.y, pt.x - prev.x);
                            for (let d = 0; d < dist; d += step) {
                                const px = prev.x + Math.cos(angle) * d;
                                const py = prev.y + Math.sin(angle) * d;

                                if (texType === 'chalk') {
                                    for (let i = 0; i < 5; i++) {
                                        const ox = (prng(px, py, i) - 0.5) * size * 1.5;
                                        const oy = (prng(py, px, i) - 0.5) * size * 1.5;
                                        ctx.globalAlpha = (settings?.opacity || 1) * (prng(px, py, i + 5) * 0.5 + 0.1);
                                        ctx.fillRect(px + ox, py + oy, prng(px, py, i + 10) * 2 + 1, prng(py, px, i + 10) * 2 + 1);
                                    }
                                } else if (texType === 'sponge') {
                                    ctx.globalAlpha = (settings?.opacity || 1) * 0.4;
                                    ctx.beginPath();
                                    ctx.arc(px + (prng(px, py, 1) - 0.5) * size * 1.5, py + (prng(py, px, 1) - 0.5) * size * 1.5, size * (prng(px, py, 2) * 0.4 + 0.1), 0, Math.PI * 2);
                                    ctx.fill();
                                } else {
                                    for (let i = 0; i < 3; i++) {
                                        const ox = (prng(px, py, i) - 0.5) * size;
                                        const oy = (prng(py, px, i) - 0.5) * size;
                                        ctx.globalAlpha = (settings?.opacity || 1) * prng(px, py, i + 5);
                                        ctx.beginPath();
                                        ctx.arc(px + ox, py + oy, prng(px, py, i + 10) * (size / 4), 0, Math.PI * 2);
                                        ctx.fill();
                                    }
                                }
                            }
                        });
                    } else {
                        let lastMid = points[0];
                        ctx.beginPath();
                        points.forEach((pt, i) => {
                            if (i === 0) { ctx.moveTo(pt.x, pt.y); return; }
                            const prev = points[i - 1];
                            const xc = (prev.x + pt.x) / 2;
                            const yc = (prev.y + pt.y) / 2;
                            if (i === 1) ctx.moveTo(prev.x, prev.y);
                            else ctx.moveTo(lastMid.x, lastMid.y);
                            ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
                            lastMid = { x: xc, y: yc };
                        });
                        const last = points[points.length - 1];
                        if (last) ctx.lineTo(last.x, last.y);
                        ctx.stroke();
                    }
                }
                else if (tool === 'eraser') {
                    ctx.save();
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.globalAlpha = 1; // Force full opacity for erasing
                    ctx.strokeStyle = '#000000';
                    ctx.fillStyle = '#000000';
                    ctx.lineWidth = size;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';

                    if (points.length > 1) {
                        ctx.beginPath();
                        ctx.moveTo(points[0].x, points[0].y);
                        for (let i = 1; i < points.length; i++) {
                            ctx.lineTo(points[i].x, points[i].y);
                        }
                        ctx.stroke();
                    } else if (points.length === 1) {
                        ctx.beginPath();
                        ctx.arc(points[0].x, points[0].y, size / 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                }
            }
            else if (drawEl.type === 'shape') {
                const { shapeType, startX, startY, endX, endY, settings } = drawEl;
                ctx.strokeStyle = settings.strokeColor;
                ctx.lineWidth = settings.strokeWidth;
                ctx.globalAlpha = 1;

                if (!settings.isTransparent) {
                    ctx.fillStyle = settings.fillColor === 'transparent' ? '#ffffff' : settings.fillColor;
                }

                ctx.beginPath();
                if (shapeType === 'rect') {
                    ctx.rect(startX, startY, endX - startX, endY - startY);
                } else if (shapeType === 'circle') {
                    const rx = Math.abs(endX - startX) / 2;
                    const ry = Math.abs(endY - startY) / 2;
                    ctx.ellipse(startX + (endX - startX) / 2, startY + (endY - startY) / 2, rx, ry, 0, 0, Math.PI * 2);
                } else if (shapeType === 'arrow') {
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    const headlen = 15;
                    const angle = Math.atan2(endY - startY, endX - startX);
                    ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
                    ctx.moveTo(endX, endY);
                    ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
                } else if (['triangle', 'pentagon', 'hexagon'].includes(shapeType)) {
                    const shapeDef = SHAPE_TYPES.find(s => s.id === shapeType);
                    const sides = shapeDef ? shapeDef.sides : 3;
                    const xc = startX + (endX - startX) / 2;
                    const yc = startY + (endY - startY) / 2;
                    const rx = Math.abs(endX - startX) / 2;
                    const ry = Math.abs(endY - startY) / 2;
                    for (let i = 0; i < sides; i++) {
                        const angle = -Math.PI / 2 + (Math.PI * 2 * i) / sides;
                        const px = xc + rx * Math.cos(angle);
                        const py = yc + ry * Math.sin(angle);
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                } else if (shapeType === 'line') {
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                }

                if (!settings.isTransparent && ['rect', 'circle', 'triangle', 'pentagon', 'hexagon'].includes(shapeType)) {
                    ctx.fill();
                }
                if (settings.strokeWidth > 0 || ['line', 'arrow'].includes(shapeType)) {
                    ctx.stroke();
                }
            }
            else if (drawEl.type === 'image') {
                const { src, x, y, w, h, settings } = drawEl;
                ctx.globalAlpha = settings.opacity || 1;

                const b = settings.brightness + (settings.exposure || 0);
                const c = settings.contrast;
                const s = settings.saturation;
                const warmthStr = settings.warmth > 0 ? `sepia(${Math.min(100, Math.abs(settings.warmth))}%) hue-rotate(-10deg)` :
                    settings.warmth < 0 ? `sepia(${Math.min(100, Math.abs(settings.warmth))}%) hue-rotate(10deg)` : '';

                const strokeFilters = [];
                if (settings.cutoutApplied && settings.cutoutStrokeWidth > 0) {
                    const sw = settings.cutoutStrokeWidth;
                    const sc = settings.cutoutStrokeColor;
                    strokeFilters.push(`drop-shadow(${sw}px ${sw}px 0px ${sc})`);
                    strokeFilters.push(`drop-shadow(-${sw}px -${sw}px 0px ${sc})`);
                    strokeFilters.push(`drop-shadow(${sw}px -${sw}px 0px ${sc})`);
                    strokeFilters.push(`drop-shadow(-${sw}px ${sw}px 0px ${sc})`);
                    strokeFilters.push(`drop-shadow(${sw}px 0px 0px ${sc})`);
                    strokeFilters.push(`drop-shadow(-${sw}px 0px 0px ${sc})`);
                    strokeFilters.push(`drop-shadow(0px ${sw}px 0px ${sc})`);
                    strokeFilters.push(`drop-shadow(0px -${sw}px 0px ${sc})`);
                }

                ctx.filter = `${strokeFilters.join(' ')} brightness(${b}%) contrast(${c}%) saturate(${s}%) ${warmthStr}`.trim();

                const imgObj = new Image();
                imgObj.src = src;

                const rot = drawEl.rotation || 0;
                if (rot !== 0) {
                    ctx.save();
                    ctx.translate(x + w / 2, y + h / 2);
                    ctx.rotate(rot * Math.PI / 180);
                    ctx.translate(-(x + w / 2), -(y + h / 2));
                }

                if (settings.removeBg) {
                    // Optimized real-time bg removal might be slow, but works for PoC
                    const offCanvas = document.createElement('canvas');
                    offCanvas.width = imgObj.width || w;
                    offCanvas.height = imgObj.height || h;
                    const offCtx = offCanvas.getContext('2d');
                    offCtx.drawImage(imgObj, 0, 0);

                    try {
                        const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
                        const data = imgData.data;
                        const bgR = data[0]; const bgG = data[1]; const bgB = data[2]; const bgA = data[3];
                        const tolerance = 40;

                        // Only apply if the original top-left pixel is NOT already transparent
                        if (bgA > 0) {
                            for (let i = 0; i < data.length; i += 4) {
                                if (data[i + 3] > 0) {
                                    const dist = Math.sqrt(Math.pow(data[i] - bgR, 2) + Math.pow(data[i + 1] - bgG, 2) + Math.pow(data[i + 2] - bgB, 2));
                                    if (dist < tolerance) data[i + 3] = 0;
                                }
                            }
                            offCtx.putImageData(imgData, 0, 0);
                        }
                        ctx.drawImage(offCanvas, x, y, w, h);
                    } catch (e) {
                        ctx.drawImage(imgObj, x, y, w, h);
                    }
                } else {
                    ctx.drawImage(imgObj, x, y, w, h);
                }

                if (rot !== 0) {
                    ctx.restore();
                }

                ctx.filter = 'none'; // reset
            }
            else if (drawEl.type === 'text') {
                const { textData, x, y, settings } = drawEl;
                ctx.font = `${settings.fontWeight} ${settings.fontSize}px "${settings.fontFamily}", sans-serif`;
                ctx.fillStyle = settings.color;
                ctx.strokeStyle = settings.strokeColor;
                ctx.lineWidth = settings.strokeWidth;
                ctx.textBaseline = 'top';

                const lines = textData.split('\n');
                lines.forEach((line, i) => {
                    const lineY = y + (i * settings.fontSize * 1.2);
                    if (settings.strokeWidth > 0) ctx.strokeText(line, x, lineY);
                    ctx.fillText(line, x, lineY);
                });
            }

            ctx.restore();

            // Draw selection bounding box if selected
            if (drawEl.id === selectedElementId && activeTool === 'select') {
                let minX, minY, maxX, maxY;
                if (drawEl.type === 'shape') {
                    minX = Math.min(drawEl.startX, drawEl.endX); maxX = Math.max(drawEl.startX, drawEl.endX);
                    minY = Math.min(drawEl.startY, drawEl.endY); maxY = Math.max(drawEl.startY, drawEl.endY);
                } else if (drawEl.type === 'path') {
                    const xs = drawEl.points.map(p => p.x); const ys = drawEl.points.map(p => p.y);
                    minX = Math.min(...xs); maxX = Math.max(...xs);
                    minY = Math.min(...ys); maxY = Math.max(...ys);
                } else if (drawEl.type === 'image') {
                    minX = drawEl.x; maxX = drawEl.x + drawEl.w;
                    minY = drawEl.y; maxY = drawEl.y + drawEl.h;
                } else if (drawEl.type === 'text') {
                    ctx.font = `${drawEl.settings.fontWeight} ${drawEl.settings.fontSize}px "${drawEl.settings.fontFamily}", sans-serif`;
                    const lines = drawEl.textData.split('\n');
                    const height = lines.length * drawEl.settings.fontSize * 1.2;
                    const width = Math.max(...lines.map(l => ctx.measureText(l).width));
                    minX = drawEl.x; maxX = drawEl.x + width;
                    minY = drawEl.y; maxY = drawEl.y + height;
                }

                if (minX !== undefined) {
                    ctx.save();
                    const rot = drawEl.rotation || 0;

                    if (rot !== 0) {
                        const centerX = minX + (maxX - minX) / 2;
                        const centerY = minY + (maxY - minY) / 2;
                        ctx.translate(centerX, centerY);
                        ctx.rotate(rot * Math.PI / 180);
                        ctx.translate(-centerX, -centerY);
                    }

                    ctx.strokeStyle = '#6366f1';
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([6, 6]);
                    const p = 8;
                    ctx.strokeRect(minX - p, minY - p, (maxX - minX) + p * 2, (maxY - minY) + p * 2);

                    ctx.fillStyle = '#6366f1';
                    ctx.setLineDash([]);
                    const h = 8;
                    const midX = (minX + maxX) / 2;
                    const midY = (minY + maxY) / 2;
                    
                    const handles = [
                        { x: minX - p, y: minY - p, mode: 'nw-resize' },
                        { x: maxX + p, y: minY - p, mode: 'ne-resize' },
                        { x: minX - p, y: maxY + p, mode: 'sw-resize' },
                        { x: maxX + p, y: maxY + p, mode: 'se-resize' },
                        { x: midX, y: minY - p, mode: 'n-resize' },
                        { x: midX, y: maxY + p, mode: 's-resize' },
                        { x: minX - p, y: midY, mode: 'w-resize' },
                        { x: maxX + p, y: midY, mode: 'e-resize' }
                    ];

                    handles.forEach(hd => {
                        ctx.beginPath();
                        ctx.fillRect(hd.x - h / 2, hd.y - h / 2, h, h);
                    });

                    // Top Rotation Handle
                    ctx.beginPath();
                    ctx.moveTo(midX, minY - p);
                    ctx.lineTo(midX, minY - p - 20);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.fillStyle = '#ffffff';
                    ctx.arc(midX, minY - p - 20, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.restore();
                }
            }
        });
    }, [selectedElementId, activeTool]);

    const redrawCanvas = useCallback(() => {
        if (!activeScene) return;
        activeScene.layers.filter(l => l.visible).forEach(layer => {
            const canvas = canvasRefs.current[layer.id];
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (layer.data) {
                const img = new Image();
                img.src = layer.data;
                if (img.complete) {
                    ctx.drawImage(img, 0, 0);
                } else {
                    img.onload = () => { if (canvasRefs.current[layer.id]) redrawCanvas(); };
                }
            }
            
            const sceneLayerElements = elements.filter(el => el.sceneId === activeSceneId && el.layerId === layer.id);
            renderElements(ctx, sceneLayerElements);

            // Draw real-time previews on the active layer
            if (isDrawing && layer.id === activeLayerId) {
                if (currentPathRef.current) {
                    renderElements(ctx, [currentPathRef.current]);
                } else if (shapePreviewData.current) {
                    renderElements(ctx, [shapePreviewData.current]);
                }
            }
        });
    }, [activeScene, activeSceneId, activeLayerId, elements, isDrawing, renderElements]);

    useEffect(() => {
        requestAnimationFrame(redrawCanvas);
    }, [elements, activeSceneId, redrawCanvas]);

    const handleImageImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const newElId = `image_${Date.now()}`;
                const defaultSettings = { ...imageSettings };
                const newEl = {
                    id: newElId,
                    type: 'image',
                    src: event.target.result,
                    x: (docSize.width - 400) / 2,
                    y: (docSize.height - 400) / 2,
                    w: 400,
                    h: 400 * (img.height / img.width),
                    layerId: activeLayerId,
                    sceneId: activeSceneId,
                    settings: defaultSettings
                };
                const newElements = [...elements, newEl];
                setElements(newElements);
                pushToHistory(newElements);
                
                setActiveTool('select');
                setSelectedElementId(newElId);
                setImageSettings(defaultSettings);

                if (fileInputRef.current) fileInputRef.current.value = '';
                const sidebarInput = document.getElementById('sidebar-image-upload');
                if (sidebarInput) sidebarInput.value = '';
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (activeTool === 'select') setCursor('default');
        else if (['draw', 'brush', 'marker', 'eraser'].includes(activeTool)) setCursor('none');
        else setCursor('crosshair');
    }, [activeTool]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            const key = e.key.toLowerCase();
            
            if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
                switch (key) {
                    case 'v': setActiveTool('select'); break;
                    case 'p': setActiveTool('draw'); break;
                    case 'b': setActiveTool('brush'); break;
                    case 'm': setActiveTool('marker'); break;
                    case 'e': setActiveTool('eraser'); break;
                    case 'u': setActiveTool('shape'); break;
                    case 't': setActiveTool('text'); break;
                    case 'i': setActiveTool('image'); break;
                    case 'tab': e.preventDefault(); setZenMode(prev => !prev); break;
                    case ' ': setCursor('grabbing'); break;
                }
            }

            switch (key) {
                case '0': if (e.ctrlKey || e.metaKey) { e.preventDefault(); fitToWindow(); } break;
                case '1': if (e.ctrlKey || e.metaKey) { e.preventDefault(); setView(prev => ({ ...prev, scale: 1 })); } break;
                case 'z': if (e.ctrlKey || e.metaKey) { e.preventDefault(); handleUndo(); } break;
                case 'y': if (e.ctrlKey || e.metaKey) { e.preventDefault(); handleRedo(); } break;
                case 'c': if (e.ctrlKey || e.metaKey) { e.preventDefault(); handleCopy(); } break;
                case 'x': if (e.ctrlKey || e.metaKey) { e.preventDefault(); handleCut(); } break;
                case 'v': if (e.ctrlKey || e.metaKey) { e.preventDefault(); handlePaste(); } break;
                case 'backspace': 
                case 'delete': 
                    if (selectedElementId) {
                        e.preventDefault();
                        deleteSelected();
                    }
                    break;
            }
        };
        const handleKeyUp = (e) => {
            if (e.key === ' ') {
                if (activeTool === 'select') setCursor('default');
                else if (['draw', 'brush', 'marker', 'eraser'].includes(activeTool)) setCursor('none');
                else setCursor('crosshair');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [activeTool, fitToWindow]);

    const handleUpdateScene = (id, data) => {
        setScenes(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    };

    const toggleVisibility = (id) => {
        setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
    };

    const deleteLayer = (id) => {
        if (layers.length <= 1) return;
        setLayers(prev => prev.filter(l => l.id !== id));
        if (activeLayerId === id) setActiveLayerId(layers.find(l => l.id !== id).id);
    };

    const moveLayer = (id, direction) => {
        const index = layers.findIndex(l => l.id === id);
        if (direction === 'up' && index < layers.length - 1) {
            const newLayers = [...layers];
            [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
            setLayers(newLayers);
        } else if (direction === 'down' && index > 0) {
            const newLayers = [...layers];
            [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
            setLayers(newLayers);
        }
    };

    const bringToFront = () => {
        if (!selectedElementId) return;
        setElements(prev => {
            const elIndex = prev.findIndex(el => el && el.id === selectedElementId);
            if (elIndex === -1 || elIndex === prev.length - 1) return prev;
            const newElements = [...prev];
            const [el] = newElements.splice(elIndex, 1);
            newElements.push(el);
            return newElements;
        });
        requestAnimationFrame(() => redrawCanvas());
    };

    const sendToBack = () => {
        if (!selectedElementId) return;
        setElements(prev => {
            const elIndex = prev.findIndex(el => el && el.id === selectedElementId);
            if (elIndex === -1 || elIndex <= 0) return prev;
            const newElements = [...prev];
            const [el] = newElements.splice(elIndex, 1);
            newElements.unshift(el);
            return newElements;
        });
        requestAnimationFrame(() => redrawCanvas());
    };

    const bringForward = () => {
        if (!selectedElementId) return;
        setElements(prev => {
            const elIndex = prev.findIndex(el => el && el.id === selectedElementId);
            if (elIndex === -1 || elIndex === prev.length - 1) return prev;
            const newElements = [...prev];
            [newElements[elIndex], newElements[elIndex + 1]] = [newElements[elIndex + 1], newElements[elIndex]];
            return newElements;
        });
        requestAnimationFrame(() => redrawCanvas());
    };

    const sendToBackwards = () => {
        if (!selectedElementId) return;
        setElements(prev => {
            const elIndex = prev.findIndex(el => el && el.id === selectedElementId);
            if (elIndex <= 0) return prev;
            const newElements = [...prev];
            [newElements[elIndex], newElements[elIndex - 1]] = [newElements[elIndex - 1], newElements[elIndex]];
            return newElements;
        });
        requestAnimationFrame(() => redrawCanvas());
    };




    const effectiveTool = (activeTool === 'select' && selectedElementId)
        ? (elements.find(e => e && e.id === selectedElementId)?.type === 'path'
            ? elements.find(e => e && e.id === selectedElementId)?.tool || 'draw'
            : elements.find(e => e && e.id === selectedElementId)?.type)
        : activeTool;

    // --- RENDERIZADO DE LA PANTALLA PREMIUM INICIAL ---
    if (showLanding) {
        return (
            <div className="fixed inset-0 z-[500] bg-[#05050A] flex flex-col overflow-hidden font-sans">
                {/* Fondo de partículas o gradiente premium */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[#05050A] opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Header Premium de la Landing */}
                <div className="relative z-10 px-8 py-6 border-b border-white/5 flex justify-between items-center bg-[#0A0A10]/50 backdrop-blur-xl">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                            <Layers className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-black text-xl tracking-widest uppercase">Bosquejo <span className="text-indigo-400">Studio</span></h1>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Creative Production Environment</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setActiveModal('nuevoDocumento')}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all active:scale-95 flex items-center gap-3 border border-indigo-400/20"
                        >
                            <Plus className="w-4 h-4" /> Nuevo Documento
                        </button>
                        <div className="w-px h-8 bg-white/10 mx-2" />
                        <button onClick={() => router.push('/dashboard')} className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white border border-white/10 transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Contenido Principal de la Landing */}
                <div className="flex-1 overflow-y-auto px-12 py-10 custom-scrollbar relative z-10">
                    <div className="max-w-7xl mx-auto space-y-12">
                        
                        {/* Sección de Proyectos Recientes */}
                        <section className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-white font-black text-2xl tracking-tight uppercase">Mis Proyectos <span className="text-indigo-500/50">Recientes</span></h2>
                                    <p className="text-gray-500 text-xs font-medium mt-1">Continúa donde lo dejaste o gestiona tus archivos de producción.</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input type="text" placeholder="Buscar..." className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all w-64" />
                                    </div>
                                    <button className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors">
                                        <Filter className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { id: 1, title: 'Campaña Navideña v1', date: 'Hace 2 horas', format: '16:9', scenes: 12, status: 'en_proceso', step: 'boceto', progress: 65 },
                                    { id: 2, title: 'Reel de Instagram - Promo', date: 'Ayer', format: '9:16', scenes: 3, status: 'borrador', step: 'idea', progress: 20 },
                                    { id: 3, title: 'Storyboard TVC Verano', date: 'Hace 5 días', format: 'Wide', scenes: 24, status: 'finalizado', step: 'aprobado', progress: 100 },
                                    { id: 4, title: 'Boceto Logo Diic', date: 'Hace 1 semana', format: '1:1', scenes: 1, status: 'en_proceso', step: 'feedback', progress: 85 }
                                ].map((proj) => (
                                    <motion.div 
                                        key={proj.id} 
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        onClick={() => { setShowLanding(false); setToastMessage('Cargando Proyecto...'); setTimeout(() => setToastMessage(null), 3000); }}
                                        className="group bg-[#0A0A10]/80 border border-white/5 hover:border-indigo-500/50 rounded-[24px] overflow-hidden transition-all duration-300 cursor-pointer shadow-xl backdrop-blur-sm"
                                    >
                                        <div className="h-32 bg-white/[0.02] relative flex items-center justify-center border-b border-white/5">
                                            <ImageIcon className="w-8 h-8 text-white/5 group-hover:text-indigo-500/20 transition-colors duration-500" />
                                            <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 rounded-lg border border-white/10 text-[8px] font-black text-indigo-400 uppercase tracking-widest">{proj.progress}%</div>
                                            
                                            {/* Seguimiento visual */}
                                            <div className="absolute inset-x-4 bottom-4 flex gap-1">
                                                {['idea', 'boceto', 'feedback', 'aprobado'].map((s, i) => {
                                                    const steps = ['idea', 'boceto', 'feedback', 'aprobado'];
                                                    const currentIdx = steps.indexOf(proj.step);
                                                    return (
                                                        <div key={s} className={`h-1 flex-1 rounded-full ${i <= currentIdx ? (proj.step === 'aprobado' ? 'bg-emerald-500' : 'bg-indigo-500') : 'bg-white/10'}`} />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <div>
                                                <h3 className="text-white font-bold text-xs truncate group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{proj.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className={`w-1 h-1 rounded-full ${proj.step === 'aprobado' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{proj.step}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600 uppercase">
                                                    <Clock className="w-3 h-3" /> {proj.date}
                                                </div>
                                                <div className="px-1.5 py-0.5 bg-white/5 rounded text-[8px] font-bold text-gray-500 uppercase">{proj.format}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Card estilo "Nuevo" */}
                                <button 
                                    onClick={() => setActiveModal('nuevoDocumento')}
                                    className="group aspect-[4/3] h-full bg-white/[0.02] border-2 border-dashed border-white/5 hover:border-indigo-500/30 rounded-[24px] flex flex-col items-center justify-center gap-3 transition-all hover:bg-indigo-500/[0.02]"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                                        <Plus className="w-6 h-6 text-gray-600 group-hover:text-indigo-400" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-indigo-300">Crear Nuevo</span>
                                </button>
                            </div>
                        </section>

                        {/* Sección de Materiales y Activos */}
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-white font-black text-lg tracking-widest uppercase flex items-center gap-3">
                                    <FolderOpen className="w-5 h-5 text-indigo-400" /> Materiales de Producción
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[
                                        { title: 'Assets de Marca', items: 24, icon: ShieldAlert, color: 'text-indigo-400' },
                                        { title: 'Librería de Audio', items: 156, icon: Mic, color: 'text-purple-400' },
                                        { title: 'Stock Local', items: 89, icon: ImageIcon, color: 'text-emerald-400' },
                                        { title: 'Guiones/Briefs', items: 12, icon: History, color: 'text-amber-400' },
                                        { title: 'Material IA', items: 45, icon: Sparkles, color: 'text-rose-400' },
                                        { title: 'Historial', items: 300, icon: History, color: 'text-gray-400' }
                                    ].map(item => (
                                        <div key={item.title} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] hover:border-white/10 transition-all cursor-pointer group">
                                            <item.icon className={`w-5 h-5 ${item.color} mb-3 group-hover:scale-110 transition-transform`} />
                                            <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{item.title}</div>
                                            <div className="text-[9px] text-gray-500 font-bold">{item.items} elementos</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-white font-black text-lg tracking-widest uppercase flex items-center gap-3">
                                    <Share2 className="w-5 h-5 text-indigo-400" /> Seguimiento Global
                                </h3>
                                <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-2xl p-6 space-y-6 backdrop-blur-md relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10"><BarChart3 className="w-20 h-20" /></div>
                                    <div className="space-y-4 relative z-10">
                                        {[
                                            { label: 'Proyectos Activos', value: '08', color: 'bg-indigo-500' },
                                            { label: 'Revisiones Pendientes', value: '03', color: 'bg-amber-500' },
                                            { label: 'Aprobados Finales', value: '12', color: 'bg-emerald-500' }
                                        ].map(stat => (
                                            <div key={stat.label} className="flex justify-between items-center group cursor-default">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">{stat.label}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl font-black text-white">{stat.value}</span>
                                                    <div className={`w-1.5 h-6 rounded-full ${stat.color} opacity-40`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-3 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 border border-indigo-500/30">Ver Pipeline Completo</button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Modales Inyectados para la Landing */}
                {activeModal === 'nuevoDocumento' && (
                    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setActiveModal(null)}>
                        {/* El mismo render que ya tienes para nuevoDocumento */}
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0A0A10] border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-lg space-y-6" onClick={e => e.stopPropagation()}>
                             <div className="text-white font-black uppercase tracking-widest text-[16px] flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="flex items-center gap-3"><Plus className="w-5 h-5 text-indigo-400" /> Configurar Nuevo Lienzo</span>
                                <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-white transition-colors p-1"><X className="w-5 h-5" /></button>
                            </div>
                            
                            {/* Reuso de la lógica de templates */}
                            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'reel', label: 'Reel / TikTok', w: 1080, h: 1920, icon: Video },
                                        { id: 'insta', label: 'Instagram Post', w: 1080, h: 1080, icon: ImageIcon },
                                        { id: 'yt', label: 'YouTube Video', w: 1920, h: 1080, icon: PlayCircle },
                                        { id: 'story', label: 'Story IG', w: 1080, h: 1920, icon: ImageIcon }
                                    ].map(tmpl => (
                                        <button 
                                            key={tmpl.id} 
                                            onClick={() => setActiveTemplate({ width: tmpl.w, height: tmpl.h, type: tmpl.id })}
                                            className={`p-4 rounded-xl border text-left transition-all ${activeTemplate?.type === tmpl.id ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                        >
                                            <div className="text-white font-bold text-xs mb-1">{tmpl.label}</div>
                                            <div className="text-[9px] text-gray-500 font-mono tracking-tighter">{tmpl.w} x {tmpl.h} px</div>
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Personalizado</div>
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="Ancho" value={activeTemplate?.width || ''} onChange={(e) => setActiveTemplate(p => ({ ...p, width: parseInt(e.target.value) || 0, type: 'custom' }))} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-indigo-500 transition-colors" />
                                        <input type="number" placeholder="Alto" value={activeTemplate?.height || ''} onChange={(e) => setActiveTemplate(p => ({ ...p, height: parseInt(e.target.value) || 0, type: 'custom' }))} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-indigo-500 transition-colors" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (activeTemplate?.width && activeTemplate?.height) {
                                        const newSceneId = `sc_${Date.now()}`;
                                        const newBgId = `bg_${Date.now()}`;
                                        const newL1Id = `l1_${Date.now()}`;
                                        setDocSize({ width: activeTemplate.width, height: activeTemplate.height });
                                        setScenes([{
                                            id: newSceneId,
                                            name: 'Lienzo 1',
                                            duration: 5,
                                            type: 'wide',
                                            notes: '',
                                            layers: [
                                                { id: newBgId, name: 'Fondo', visible: true, locked: false, data: null },
                                                { id: newL1Id, name: 'Capa 1', visible: true, locked: false, data: null }
                                            ],
                                            activeLayerId: newL1Id,
                                            objective: 'idea'
                                        }]);
                                        setActiveSceneId(newSceneId);
                                        setElements([]);
                                        setShowLanding(false);
                                        setActiveModal(null);
                                        setToastMessage('Lienzo creado correctamente');
                                        setTimeout(() => {
                                            setActiveTool('draw');
                                            fitToWindow();
                                            setToastMessage(null);
                                        }, 100);
                                    }
                                }}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black tracking-widest uppercase text-[11px] shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                Iniciar Espacio de Trabajo
                            </button>
                        </motion.div>
                    </div>
                )}

                {/* Toast Local para la Landing */}
                <AnimatePresence>
                    {toastMessage && (
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[700] bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_15px_40px_rgba(79,70,229,0.4)]">
                            {toastMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-[#010103] text-white select-none overflow-hidden font-sans flex flex-col"
            onClick={() => {
                setActiveMenu(null);
                setContextMenu(prev => prev.visible ? { ...prev, visible: false } : prev);
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY
                });
            }}
        >
            {/* --- PREMIUM ZEN MODE UI --- */}
            <AnimatePresence>
                {zenMode && (
                    <>
                        {/* Botón de Salida Rápida (Top Right) */}
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onClick={() => setZenMode(false)}
                            className="fixed top-8 right-8 z-[300] w-14 h-14 bg-[#0A0A1F]/80 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all group hover:bg-white/10 hover:border-white/20 active:scale-90"
                            title="Salir de Modo Enfoque (TAB)"
                        >
                            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                            <div className="absolute top-full mt-2 px-3 py-1 bg-black/80 rounded-lg text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Cerrar (TAB)</div>
                        </motion.button>

                        {/* Barra de Herramientas Flotante (Bottom Center) */}
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-2 p-2 bg-[#0A0A1F]/80 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-[0_20px_80px_rgba(0,0,0,0.8)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent rounded-[32px] pointer-events-none" />
                            
                            {/* Herramientas Esenciales */}
                            <div className="flex gap-1.5 px-2">
                                {[
                                    { id: 'select', icon: MousePointer2, color: 'text-cyan-400', label: 'Seleccionar (V)' },
                                    { id: 'draw', icon: Pencil, color: 'text-indigo-400', label: 'Lápiz (P)' },
                                    { id: 'brush', icon: Paintbrush, color: 'text-fuchsia-400', label: 'Pincel (B)' },
                                    { id: 'marker', icon: Highlighter, color: 'text-yellow-400', label: 'Marcador (M)' },
                                    { id: 'eraser', icon: Eraser, color: 'text-rose-400', label: 'Borrador (E)' }
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setActiveTool(t.id)}
                                        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all relative group ${activeTool === t.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                        title={t.label}
                                    >
                                        <t.icon className={`w-5 h-5 ${activeTool === t.id ? t.color : ''}`} />
                                        {activeTool === t.id && (
                                            <motion.div layoutId="zen-tool-active" className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="w-px h-8 bg-white/10 mx-1" />

                            <div className="flex gap-1 px-1">
                                {[
                                    { id: 'shape', icon: Pentagon, color: 'text-emerald-400', label: 'Formas (U)' },
                                    { id: 'text', icon: Type, color: 'text-purple-400', label: 'Texto (T)' },
                                    { id: 'image', icon: ImageIcon, color: 'text-blue-400', label: 'Imagen IA (I)' }
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setActiveTool(t.id)}
                                        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all relative group ${activeTool === t.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                        title={t.label}
                                    >
                                        <t.icon className={`w-5 h-5 ${activeTool === t.id ? t.color : ''}`} />
                                        {activeTool === t.id && (
                                            <motion.div layoutId="zen-tool-active" className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="w-px h-8 bg-white/10 mx-2" />

                            {/* Botón de Salida Integrado */}
                            <button
                                onClick={() => setZenMode(false)}
                                className="flex items-center gap-3 pl-2 pr-6 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-2xl border border-indigo-500/30 transition-all group overflow-hidden relative"
                            >
                                <div className="w-8 h-8 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Maximize className="w-4 h-4 rotate-45" />
                                </div>
                                <div className="flex flex-col items-start translate-y-[1px]">
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">Cerrar Enfoque</span>
                                    <span className="text-[7px] font-bold opacity-50 uppercase tracking-tighter">TAB</span>
                                </div>
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {contextMenu.visible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                        className="fixed z-[300] w-72 bg-[#0A0A1F]/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.8)] overflow-hidden p-2.5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
                        
                        <div className="space-y-2 relative z-10">
                            {/* Removed Quick Tool Grid per user request to focus on properties */}

                            {selectedElementId && (
                                <>
                                    <div className="px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-white/30">Capa</div>
                                    <div className="flex px-1 gap-1">
                                        <button onClick={() => { bringToFront(); setContextMenu(p => ({ ...p, visible: false })); }} className="flex-1 flex flex-col items-center gap-1 p-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl transition-all group active:scale-95 text-[9px] font-bold border border-white/5">
                                            <ChevronUp className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" /> Frente
                                        </button>
                                        <button onClick={() => { sendToBack(); setContextMenu(p => ({ ...p, visible: false })); }} className="flex-1 flex flex-col items-center gap-1 p-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl transition-all group active:scale-95 text-[9px] font-bold border border-white/5">
                                            <ChevronDown className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" /> Fondo
                                        </button>
                                    </div>
                                    <div className="h-px bg-white/5 my-1 mx-2" />
                                </>
                            )}

                            <div className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white/40 text-center italic border-b border-white/5 bg-white/[0.02] rounded-xl mx-1">
                                {selectedElementId ? `Editando: ${effectiveTool}` : `Ajustes: ${effectiveTool}`}
                            </div>
                            
                            <div className="px-2 pb-2 space-y-4">
                                {/* DYNAMIC PROPERTY CONTROLS & PRESETS */}
                                {(effectiveTool === 'draw' || effectiveTool === 'brush' || effectiveTool === 'marker' || (selectedElementId && elements.find(el => el.id === selectedElementId)?.type === 'path')) && (
                                    <div className="space-y-3">
                                        {/* Presets Grid */}
                                        <div className="space-y-2">
                                            <div className="text-[8px] font-black uppercase tracking-widest text-gray-500 px-2 italic">Estilos / Presets</div>
                                            <div className="grid grid-cols-3 gap-1 px-1">
                                                {effectiveTool === 'draw' && PENCIL_PRESETS.map(p => (
                                                    <button key={p.id} onClick={() => setPencilSettings(prev => ({ ...prev, preset: p.id }))} className={`py-2 rounded-lg text-[7px] font-black tracking-widest uppercase transition-all border ${pencilSettings.preset === p.id ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'}`}>
                                                        {p.label.split(' ')[0]}
                                                    </button>
                                                ))}
                                                {effectiveTool === 'brush' && BRUSH_VARIATIONS.map(v => (
                                                    <button key={v.id} onClick={() => setBrushSettings(prev => ({ ...prev, type: v.id }))} className={`py-2 rounded-lg text-[7px] font-black tracking-widest uppercase transition-all border ${brushSettings.type === v.id ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-400' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'}`}>
                                                        {v.label.split(' ')[0]}
                                                    </button>
                                                ))}
                                                {effectiveTool === 'marker' && MARKER_TYPES.map(m => (
                                                    <button key={m.id} onClick={() => setMarkerSettings(prev => ({ ...prev, type: m.id }))} className={`py-2 rounded-lg text-[7px] font-black tracking-widest uppercase transition-all border ${markerSettings.type === m.id ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'}`}>
                                                        {m.label.split(' ')[0]}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-1 px-2">
                                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
                                                <span>Tamaño Trazo</span>
                                                <span className="text-indigo-400 font-mono tracking-tighter">{brushSize}px</span>
                                            </div>
                                            <input type="range" min="1" max="100" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full h-1 bg-white/10 rounded-full accent-indigo-500 appearance-none cursor-pointer" />
                                        </div>
                                        <div className="space-y-1 px-2">
                                            <div className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1 italic">Color Activo</div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg border border-white/10 shadow-lg shrink-0" style={{ backgroundColor: activeColor }} />
                                                <button onClick={() => setColorPickerConfig({ isOpen: true, targetKey: 'base', color: activeColor, title: 'Color de Trazo' })} className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-white border border-white/5 transition-all">Cambiar Color</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {(effectiveTool === 'eraser' || (selectedElementId && elements.find(el => el.id === selectedElementId)?.tool === 'eraser')) && (
                                    <div className="space-y-3 px-2">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
                                                <span>Grosor</span>
                                                <span className="text-rose-400">{eraserSettings.size}px</span>
                                            </div>
                                            <input type="range" min="1" max="200" value={eraserSettings.size} onChange={(e) => setEraserSettings(prev => ({ ...prev, size: parseInt(e.target.value) }))} className="w-full h-1 bg-white/10 rounded-full accent-rose-500 appearance-none cursor-pointer" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
                                                <span>Dureza</span>
                                                <span className="text-rose-400">{Math.round((eraserSettings.hardness ?? 0.5) * 100)}%</span>
                                            </div>
                                            <input type="range" min="0" max="100" value={(eraserSettings.hardness ?? 0.5) * 100} onChange={(e) => setEraserSettings(prev => ({ ...prev, hardness: parseInt(e.target.value) / 100 }))} className="w-full h-1 bg-white/10 rounded-full accent-rose-500 appearance-none cursor-pointer" />
                                        </div>
                                    </div>
                                )}

                                {(effectiveTool === 'shape' || (selectedElementId && elements.find(el => el.id === selectedElementId)?.type === 'shape')) && (
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <div className="text-[8px] font-black uppercase tracking-widest text-gray-500 px-2 italic">Tipo de Forma</div>
                                            <div className="grid grid-cols-5 gap-1 px-1">
                                                {SHAPE_TYPES.map(s => (
                                                    <button key={s.id} onClick={() => setShapeSettings(prev => ({ ...prev, type: s.id }))} className={`p-2 rounded-lg transition-all border flex items-center justify-center ${shapeSettings.type === s.id ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'}`} title={s.label}>
                                                        <s.icon className="w-3 h-3" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1 px-2">
                                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
                                                <span>Borde</span>
                                                <span className="text-emerald-400 font-mono">{shapeSettings.strokeWidth}px</span>
                                            </div>
                                            <input type="range" min="1" max="30" value={shapeSettings.strokeWidth} onChange={(e) => setShapeSettings(prev => ({ ...prev, strokeWidth: parseInt(e.target.value) }))} className="w-full h-1 bg-white/10 rounded-full accent-emerald-500 appearance-none cursor-pointer" />
                                        </div>
                                        <div className="flex gap-1 px-1">
                                            <button onClick={() => setShapeSettings(p => ({ ...p, isTransparent: true }))} className={`flex-1 py-1.5 rounded-lg text-[7px] font-black tracking-widest uppercase transition-all ${shapeSettings.isTransparent ? 'bg-emerald-500 text-white shadow-md' : 'bg-white/5 text-gray-500'}`}>Hueco</button>
                                            <button onClick={() => setShapeSettings(p => ({ ...p, isTransparent: false }))} className={`flex-1 py-1.5 rounded-lg text-[7px] font-black tracking-widest uppercase transition-all ${!shapeSettings.isTransparent ? 'bg-emerald-500 text-white shadow-md' : 'bg-white/5 text-gray-500'}`}>Sólido</button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 px-1">
                                            <button onClick={() => setColorPickerConfig({ isOpen: true, targetKey: 'stroke', color: shapeSettings.strokeColor, title: 'Color de Borde' })} className="py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[7px] font-black uppercase tracking-widest text-white border border-white/5">Color Trazo</button>
                                            <button onClick={() => setColorPickerConfig({ isOpen: true, targetKey: 'fill', color: shapeSettings.fillColor === 'transparent' ? '#ffffff' : shapeSettings.fillColor, title: 'Color de Fondo' })} className="py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[7px] font-black uppercase tracking-widest text-white border border-white/5">Color Fondo</button>
                                        </div>
                                    </div>
                                )}

                                {(effectiveTool === 'text' || (selectedElementId && elements.find(el => el.id === selectedElementId)?.type === 'text')) && (
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <div className="text-[8px] font-black uppercase tracking-widest text-gray-500 px-2 italic">Familia Tipográfica</div>
                                            <div className="grid grid-cols-2 gap-1 px-1">
                                                {FONT_FAMILIES.slice(0, 4).map(f => (
                                                    <button key={f.id} onClick={() => setTextSettings(prev => ({ ...prev, fontFamily: f.id }))} className={`py-1.5 rounded-lg text-[8px] font-medium transition-all border ${textSettings.fontFamily === f.id ? 'bg-purple-500 text-white border-purple-500' : 'bg-white/5 border-white/5 text-white/60 hover:border-white/10'}`} style={{ fontFamily: f.id }}>
                                                        {f.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1 px-2">
                                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
                                                <span>Tamaño</span>
                                                <span className="text-purple-400 font-mono">{textSettings.fontSize}px</span>
                                            </div>
                                            <input type="range" min="10" max="200" value={textSettings.fontSize} onChange={(e) => setTextSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))} className="w-full h-1 bg-white/10 rounded-full accent-purple-500 appearance-none cursor-pointer" />
                                        </div>
                                        <div className="px-1 pt-1">
                                            <button onClick={() => setColorPickerConfig({ isOpen: true, targetKey: 'textColor', color: textSettings.color, title: 'Color de Texto' })} className="w-full py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl border border-purple-500/20 text-[8px] font-black uppercase tracking-widest transition-all">Cambiar Color</button>
                                        </div>
                                    </div>
                                )}

                                {(effectiveTool === 'image' || (selectedElementId && elements.find(el => el.id === selectedElementId)?.type === 'image')) && (
                                    <div className="space-y-3 px-2">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
                                                <span>Opacidad</span>
                                                <span className="text-blue-400">{Math.round(imageSettings.opacity * 100)}%</span>
                                            </div>
                                            <input type="range" min="0" max="100" value={imageSettings.opacity * 100} onChange={(e) => setImageSettings(prev => ({ ...prev, opacity: parseInt(e.target.value) / 100 }))} className="w-full h-1 bg-white/10 rounded-full accent-blue-500 appearance-none cursor-pointer" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button onClick={() => handleSelectionClick('fondo')} className="py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/20 text-[7px] font-black uppercase tracking-widest flex flex-col items-center gap-1">
                                                <Scissors className="w-3 h-3" /> Fondo
                                            </button>
                                            <button onClick={() => handleSelectionClick('sujeto')} className="py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/20 text-[7px] font-black uppercase tracking-widest flex flex-col items-center gap-1">
                                                <Sparkles className="w-3 h-3" /> Sujeto
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Removed Action Footer per user request to focus on properties */}
                            
                            {selectedElementId && (
                                <div className="flex gap-1 px-1">
                                    <button onClick={() => { duplicateSelected(); setContextMenu(p => ({ ...p, visible: false })); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 hover:bg-white/5 text-emerald-400/80 hover:text-emerald-400 rounded-xl transition-all group active:scale-95 text-[9px] font-bold border border-white/5">
                                        <Copy className="w-3 h-3" /> Duplicar
                                    </button>
                                    <button onClick={() => { deleteSelected(); setContextMenu(p => ({ ...p, visible: false })); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 hover:bg-rose-500/10 text-rose-400/80 hover:text-rose-400 rounded-xl transition-all group active:scale-95 text-[9px] font-bold border border-white/5">
                                        <Trash2 className="w-3 h-3" /> Borrar
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {colorPickerConfig.isOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setColorPickerConfig(p => ({ ...p, isOpen: false }))}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0A0A10] border border-white/10 rounded-3xl p-6 shadow-2xl w-80 space-y-6" onClick={e => e.stopPropagation()}>
                            <div className="text-white font-black uppercase tracking-widest text-[10px] flex justify-between items-center">
                                <span>{colorPickerConfig.title}</span>
                                <button onClick={() => setColorPickerConfig(p => ({ ...p, isOpen: false }))} className="text-gray-500 hover:text-white transition-colors p-1"><X className="w-4 h-4" /></button>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-xl border border-white/10 shadow-inner" style={{ backgroundColor: colorPickerConfig.color }} />
                                <div className="flex-1 flex flex-col justify-between">
                                    <label className="text-[9px] text-gray-500 font-black tracking-widest uppercase">Código Hex</label>
                                    <div className="flex items-center gap-2 bg-black/50 px-3 py-2 rounded-xl border border-white/5 shadow-inner">
                                        <span className="text-indigo-500 font-black">#</span>
                                        <input type="text" value={colorPickerConfig.color.replace('#', '')} onInput={(e) => setColorPickerConfig(p => ({ ...p, color: '#' + e.target.value }))} className="bg-transparent border-none text-white font-mono uppercase text-sm w-full outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] text-gray-500 font-black tracking-widest uppercase">Preestablecidos</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {['#000000', '#FFFFFF', '#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55'].map(c => (
                                        <button key={c} onClick={() => setColorPickerConfig(p => ({ ...p, color: c }))} className={`w-full aspect-square rounded-lg border flex items-center justify-center ${colorPickerConfig.color.toUpperCase() === c.toUpperCase() ? 'border-white ring-2 ring-white/20' : 'border-white/5'} shadow-lg hover:scale-110 transition-all`} style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                            </div>

                            <div className="relative w-full h-10 rounded-xl overflow-hidden border border-white/10 group cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-indigo-400 text-[9px] font-black tracking-widest uppercase">Selector Avanzado</div>
                                <input type="color" value={colorPickerConfig.color} onInput={(e) => setColorPickerConfig(p => ({ ...p, color: e.target.value }))} className="absolute -top-10 -left-10 w-[200%] h-[200%] opacity-0 cursor-pointer" />
                            </div>



                            <button onClick={() => {
                                if (colorPickerConfig.targetKey === 'base') {
                                    setBaseColor(colorPickerConfig.color);
                                    setActiveColor(colorPickerConfig.color);
                                } else if (colorPickerConfig.targetKey === 'stroke') {
                                    setShapeSettings(prev => ({ ...prev, strokeColor: colorPickerConfig.color }));
                                } else if (colorPickerConfig.targetKey === 'fill') {
                                    setShapeSettings(prev => ({ ...prev, fillColor: colorPickerConfig.color }));
                                } else if (colorPickerConfig.targetKey === 'textColor') {
                                    setTextSettings(prev => ({ ...prev, color: colorPickerConfig.color }));
                                } else if (colorPickerConfig.targetKey === 'textStroke') {
                                    setTextSettings(prev => ({ ...prev, strokeColor: colorPickerConfig.color }));
                                } else if (colorPickerConfig.targetKey === 'cutoutStroke') {
                                    setImageSettings(prev => ({ ...prev, cutoutStrokeColor: colorPickerConfig.color }));
                                }
                                setColorPickerConfig(prev => ({ ...prev, isOpen: false }));
                            }} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black tracking-widest uppercase text-[10px] shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2">
                                Aceptar Color
                            </button>
                        </motion.div>
                    </div>
                )}

                {/* Nuevo Documento Modal */}
                {activeModal === 'nuevoDocumento' && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setActiveModal(null)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0A0A10] border border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-md space-y-6 flex flex-col max-h-full" onClick={e => e.stopPropagation()}>
                            <div className="text-white font-black uppercase tracking-widest text-[14px] flex justify-between items-center shrink-0">
                                <span>Nuevo Documento</span>
                                <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-white transition-colors p-1"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                                <div className="space-y-3">
                                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-2">Redes Sociales</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => setActiveTemplate({ width: 1080, height: 1080 })} className={`flex flex-col items-start px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border ${activeTemplate?.width === 1080 && activeTemplate?.height === 1080 ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/5'} text-left`}><span className="text-xs font-bold text-white">Post Instagram</span> <span className="opacity-50 text-[10px] font-mono mt-1">1080x1080</span></button>
                                        <button onClick={() => setActiveTemplate({ width: 1080, height: 1920, type: 'reel' })} className={`flex flex-col items-start px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border ${activeTemplate?.width === 1080 && activeTemplate?.height === 1920 && activeTemplate?.type === 'reel' ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/5'} text-left`}><span className="text-xs font-bold text-white">Reel / TikTok</span> <span className="opacity-50 text-[10px] font-mono mt-1">1080x1920</span></button>
                                        <button onClick={() => setActiveTemplate({ width: 1080, height: 1920, type: 'story' })} className={`flex flex-col items-start px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border ${activeTemplate?.width === 1080 && activeTemplate?.height === 1920 && activeTemplate?.type === 'story' ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/5'} text-left`}><span className="text-xs font-bold text-white">Historia IG</span> <span className="opacity-50 text-[10px] font-mono mt-1">1080x1920</span></button>
                                        <button onClick={() => setActiveTemplate({ width: 1080, height: 1080, type: 'carousel' })} className={`flex flex-col items-start px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border ${activeTemplate?.width === 1080 && activeTemplate?.height === 1080 && activeTemplate?.type === 'carousel' ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/5'} text-left`}><span className="text-xs font-bold text-white">Carrusel IG</span> <span className="opacity-50 text-[10px] font-mono mt-1">1080x1080</span></button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-2">Contenido Horizontal</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => setActiveTemplate({ width: 1920, height: 1080, type: 'yt' })} className={`flex flex-col items-start px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border ${activeTemplate?.width === 1920 && activeTemplate?.height === 1080 && activeTemplate?.type === 'yt' ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/5'} text-left`}><span className="text-xs font-bold text-white">Video YouTube</span> <span className="opacity-50 text-[10px] font-mono mt-1">1920x1080</span></button>
                                        <button onClick={() => setActiveTemplate({ width: 1280, height: 720 })} className={`flex flex-col items-start px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border ${activeTemplate?.width === 1280 && activeTemplate?.height === 720 ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/5'} text-left`}><span className="text-xs font-bold text-white">Miniatura YT</span> <span className="opacity-50 text-[10px] font-mono mt-1">1280x720</span></button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-2">Publicidad</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => setActiveTemplate({ width: 1920, height: 1080, type: 'ads' })} className={`flex flex-col items-start px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border ${activeTemplate?.width === 1920 && activeTemplate?.height === 1080 && activeTemplate?.type === 'ads' ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/5'} text-left`}><span className="text-xs font-bold text-white">Banner Horiz.</span> <span className="opacity-50 text-[10px] font-mono mt-1">1920x1080</span></button>
                                        <button onClick={() => setActiveTemplate({ width: 1080, height: 1920, type: 'ads' })} className={`flex flex-col items-start px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border ${activeTemplate?.width === 1080 && activeTemplate?.height === 1920 && activeTemplate?.type === 'ads' ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/5'} text-left`}><span className="text-xs font-bold text-white">Banner Vertical</span> <span className="opacity-50 text-[10px] font-mono mt-1">1080x1920</span></button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-2">Storyboard Cine</div>
                                    <div className="grid grid-cols-1 gap-2">
                                        <button onClick={() => setActiveTemplate({ width: 1920, height: 1080, type: 'cine' })} className={`flex flex-col items-start px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border ${activeTemplate?.width === 1920 && activeTemplate?.height === 1080 && activeTemplate?.type === 'cine' ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/5'} text-left`}><span className="text-xs font-bold text-white">Storyboard Horizontal</span> <span className="opacity-50 text-[10px] font-mono mt-1">1920x1080</span></button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-2">Personalizado</div>
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="Ancho px" value={activeTemplate?.width || ''} onChange={(e) => setActiveTemplate(p => ({ ...p, width: parseInt(e.target.value) || 0, type: 'custom' }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-indigo-500 transition-colors" />
                                        <input type="number" placeholder="Alto px" value={activeTemplate?.height || ''} onChange={(e) => setActiveTemplate(p => ({ ...p, height: parseInt(e.target.value) || 0, type: 'custom' }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-indigo-500 transition-colors" />
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (activeTemplate?.width && activeTemplate?.height) {
                                                const newSceneId = `sc_${Date.now()}`;
                                                const newBgId = `bg_${Date.now()}`;
                                                const newL1Id = `l1_${Date.now()}`;
                                                
                                                setDocSize({ width: activeTemplate.width, height: activeTemplate.height });
                                                
                                                setScenes([{
                                                    id: newSceneId,
                                                    name: 'Lienzo 1',
                                                    duration: 5,
                                                    type: 'wide',
                                                    notes: '',
                                                    layers: [
                                                        { id: newBgId, name: 'Fondo', visible: true, locked: false, data: null },
                                                        { id: newL1Id, name: 'Capa 1', visible: true, locked: false, data: null }
                                                    ],
                                                    activeLayerId: newL1Id,
                                                    objective: 'idea'
                                                }]);
                                                
                                                setActiveSceneId(newSceneId);
                                                setElements([]); // Limpiar elementos existentes
                                                setSelectedElementId(null);
                                                setIsDrawing(false);
                                                
                                                // Reset tools state and heavily force reactivation
                                                setActiveTool('draw');
                                                
                                                // Retraso seguro para forzar el remount del canvas antes de enfocar motor
                                                setTimeout(() => {
                                                    setActiveTool('draw');
                                                    fitToWindow();
                                                }, 50);
                                                
                                                setActiveModal(null); // Cerrar modal
                                            }
                                        }}
                                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black tracking-widest uppercase text-[11px] shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all active:scale-95 mt-2 flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Crear Lienzo
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Toast de Éxito General */}
                <AnimatePresence>
                    {toastMessage && (
                        <motion.div
                            key="toast-success"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] bg-[#0A0A10]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                <Check className="w-4 h-4 text-indigo-400" />
                            </div>
                            <span className="text-white text-sm font-bold tracking-wide">{toastMessage}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Guardar Como Modal */}
                {activeModal === 'guardarComo' && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setActiveModal(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-[#0A0A10] border border-white/10 rounded-[24px] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.8)] w-full max-w-md relative overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                            <div className="text-white font-black uppercase tracking-widest text-[16px] flex justify-between items-center mb-8">
                                <span className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"><Save className="w-4 h-4 text-indigo-400" /></div>
                                    Guardar Como
                                </span>
                                <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Nombre del nuevo proyecto</label>
                                    <input type="text" placeholder="Ej: Storyboard v2" className="w-full bg-[#05050A] border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-indigo-500 transition-colors shadow-inner placeholder:text-gray-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Carpeta o categoría</label>
                                    <div className="relative">
                                        <select className="w-full bg-[#05050A] border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer">
                                            <option className="bg-[#0A0A10]">General</option>
                                            <option className="bg-[#0A0A10]">Campañas TV</option>
                                            <option className="bg-[#0A0A10]">Redes Sociales</option>
                                        </select>
                                        <ChevronRight className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 rotate-90" />
                                    </div>
                                </div>
                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded appearance-none border border-white/20 checked:bg-indigo-500 checked:border-indigo-500 text-white relative after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:opacity-0 checked:after:opacity-100 after:text-[10px] after:font-bold outline-none transition-all" />
                                        <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">Duplicar Escenas</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded appearance-none border border-white/20 checked:bg-indigo-500 checked:border-indigo-500 text-white relative after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:opacity-0 checked:after:opacity-100 after:text-[10px] after:font-bold outline-none transition-all" />
                                        <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">Duplicar Capas</span>
                                    </label>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-white/5">
                                    <button onClick={() => setActiveModal(null)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-gray-400 border border-white/5 rounded-xl font-black tracking-widest uppercase text-[11px] transition-all">Cancelar</button>
                                    <button onClick={() => { setActiveModal(null); setToastMessage('Copia del proyecto guardada exitosamente'); setTimeout(() => setToastMessage(null), 3000); }} className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black tracking-widest uppercase text-[11px] shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <Save className="w-4 h-4" /> Guardar Copia
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Abrir Recientes Modal */}
                {activeModal === 'abrirRecientes' && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={() => setActiveModal(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-[#0A0A10] border border-white/10 rounded-[24px] shadow-[0_30px_100px_rgba(0,0,0,0.9)] w-full max-w-5xl h-[85vh] flex flex-col relative overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                            
                            {/* Header */}
                            <div className="p-8 border-b border-white/5 flex flex-col gap-6 shrink-0 z-10 bg-[#0A0A10]/95 backdrop-blur-xl">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                            <FolderOpen className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-white font-black uppercase tracking-widest text-[20px]">Mis Proyectos</h2>
                                            <p className="text-gray-500 text-sm font-medium">Gestiona todos tus storyboards y bocetos</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="relative flex-1">
                                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input type="text" placeholder="Buscar proyectos por nombre, etiqueta o cliente..." className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white outline-none focus:border-indigo-500 transition-colors shadow-inner" />
                                    </div>
                                    <div className="relative w-56 shrink-0 group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-hover:scale-110 transition-transform"><BarChart3 className="w-4 h-4" /></div>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-10 py-4 text-sm text-white outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer h-full font-bold uppercase tracking-widest text-[10px]">
                                            <option className="bg-[#0A0A10]">Filtrar: Todos los estados</option>
                                            <option className="bg-[#0A0A10]">Etapa: Idea</option>
                                            <option className="bg-[#0A0A10]">Etapa: Bocetado</option>
                                            <option className="bg-[#0A0A10]">Etapa: Feedback</option>
                                            <option className="bg-[#0A0A10]">Estado: Aprobado</option>
                                        </select>
                                        <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 rotate-90" />
                                    </div>
                                    <button className="h-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all active:scale-95 flex items-center gap-3 shrink-0 group">
                                        <LayoutGrid className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                        Dashboard Global
                                    </button>
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Mock Projects Array */}
                                    {[
                                        { id: 1, title: 'Campaña Navideña v1', date: 'Hace 2 horas', format: '16:9', scenes: 12, status: 'en_proceso', step: 'boceto', progress: 65, img: '' },
                                        { id: 2, title: 'Reel de Instagram - Promo', date: 'Ayer', format: '9:16', scenes: 3, status: 'borrador', step: 'idea', progress: 20, img: '' },
                                        { id: 3, title: 'Storyboard TVC Verano', date: 'Hace 5 días', format: 'Wide', scenes: 24, status: 'finalizado', step: 'aprobado', progress: 100, img: '' },
                                        { id: 4, title: 'Boceto Logo Diic', date: 'Hace 1 semana', format: '1:1', scenes: 1, status: 'en_proceso', step: 'feedback', progress: 85, img: '' }
                                    ].map((proj) => (
                                        <div key={proj.id} className="group bg-[#05050A] border border-white/5 hover:border-indigo-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_15px_40px_rgba(99,102,241,0.15)] flex flex-col cursor-pointer hover:-translate-y-1" onClick={() => { setActiveModal(null); setToastMessage('Cargando proyecto: ' + proj.title); setTimeout(() => setToastMessage(null), 3000); }}>
                                            <div className="h-40 bg-white/5 relative flex items-center justify-center border-b border-white/5 overflow-hidden">
                                                <ImageIcon className="w-10 h-10 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                                                    {proj.progress}%
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-transparent opacity-60" />
                                                
                                                {/* Tracking Steps Indication */}
                                                <div className="absolute inset-x-4 bottom-4 flex gap-1 items-center">
                                                    {['idea', 'boceto', 'feedback', 'aprobado'].map((step, i) => {
                                                        const steps = ['idea', 'boceto', 'feedback', 'aprobado'];
                                                        const currentIdx = steps.indexOf(proj.step);
                                                        const isActive = i <= currentIdx;
                                                        return (
                                                            <div key={step} className={`h-1 flex-1 rounded-full transition-all duration-500 ${isActive ? (proj.step === 'aprobado' ? 'bg-emerald-500' : 'bg-indigo-500') : 'bg-white/10'}`} />
                                                        );
                                                    })}
                                                </div>

                                                <div className="absolute inset-x-0 bottom-10 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 p-2">
                                                    <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl flex items-center gap-2 transition-all active:scale-95">
                                                        <FolderOpen className="w-3.5 h-3.5" /> Abrir Proyecto
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-5 flex flex-col gap-3">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div>
                                                        <h3 className="text-white font-bold text-sm truncate group-hover:text-indigo-300 transition-colors mb-1">{proj.title}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                                proj.step === 'aprobado' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                                                                proj.step === 'feedback' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                                                                'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                                                            }`} />
                                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{proj.step}</span>
                                                        </div>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest shrink-0 border ${
                                                        proj.status === 'en_proceso' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        proj.status === 'borrador' ? 'bg-gray-500/10 text-gray-400 border-white/5' :
                                                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                    }`}>
                                                        {proj.status.replace('_', ' ')}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500/60 uppercase tracking-tighter">
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {proj.date}</span>
                                                        <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {proj.scenes} esc</span>
                                                    </div>
                                                    <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[8px] font-black text-gray-400 uppercase">{proj.format}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Importar Modal */}
                {activeModal === 'importar' && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setActiveModal(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-[#0A0A10] border border-white/10 rounded-[24px] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.8)] w-full max-w-lg relative overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                            <div className="text-white font-black uppercase tracking-widest text-[16px] flex justify-between items-center mb-8">
                                <span className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"><DownloadCloud className="w-4 h-4 text-indigo-400" /></div>
                                    Importar Archivo
                                </span>
                                <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Dropzone */}
                                <div className="border-2 border-dashed border-white/10 hover:border-indigo-500/50 bg-[#05050A] hover:bg-indigo-500/5 rounded-[20px] h-48 flex flex-col items-center justify-center gap-4 transition-all group cursor-pointer relative overflow-hidden" onClick={() => fileInputRef.current?.click()}>
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                                        <ImagePlus className="w-8 h-8 text-gray-500 group-hover:text-indigo-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-white mb-1">Haz clic o arrastra tu archivo aquí</p>
                                        <p className="text-[10px] font-black tracking-widest uppercase text-gray-500">Soporta PNG, JPG, PDF, WEBP, JSON</p>
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf,.json" onChange={(e) => { handleImageImport(e); setActiveModal(null); }} />
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="h-px bg-white/5 flex-1" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">O Alternativas</span>
                                    <div className="h-px bg-white/5 flex-1" />
                                </div>
                                
                                <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl font-black tracking-widest uppercase text-[11px] transition-all flex items-center justify-center gap-3">
                                    <FolderOpen className="w-4 h-4 text-indigo-400" /> Importar desde Proyecto Anterior
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Exportar Modal */}
                {activeModal === 'exportar' && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setActiveModal(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-[#0A0A10] border border-white/10 rounded-[24px] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.8)] w-full max-w-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                            <div className="text-white font-black uppercase tracking-widest text-[16px] flex justify-between items-center mb-8">
                                <span className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"><Download className="w-4 h-4 text-indigo-400" /></div>
                                    Exportar Proyecto
                                </span>
                                <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Option 1: Current Scene */}
                                <div className="bg-[#05050A] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-6 transition-all group flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2 group-hover:text-indigo-300">Escena Actual</h3>
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">Exporta únicamente el encuadre activo sin compromisos para revisión rápida.</p>
                                        
                                        <div className="space-y-3">
                                            {['PNG (Transparencia)', 'JPG (Ligero)', 'PDF (Vector)'].map((fmt, i) => (
                                                <label key={fmt} className="flex items-center gap-3 cursor-pointer">
                                                    <input type="radio" name="exportFmtScene" defaultChecked={i===0} className="w-4 h-4 rounded-full appearance-none border border-white/20 checked:border-[4px] checked:border-indigo-500 bg-transparent transition-all outline-none" />
                                                    <span className="text-sm font-bold text-gray-300">{fmt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={() => { setActiveModal(null); setToastMessage('Descargando escena en alta calidad...'); setTimeout(() => setToastMessage(null), 3000); }} className="w-full py-4 mt-8 bg-white/5 hover:bg-indigo-600 border border-white/5 hover:border-transparent text-gray-400 hover:text-white rounded-xl font-black tracking-widest uppercase text-[11px] transition-all">Exportar 1 Escena</button>
                                </div>
                                
                                {/* Option 2: Full Project */}
                                <div className="bg-gradient-to-b from-[#0A0A1F] to-[#0A0A10] border border-indigo-500/20 hover:border-indigo-500/50 rounded-2xl p-6 transition-all shadow-[0_10px_30px_rgba(99,102,241,0.1)] group flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-indigo-300">Todo el Proyecto</h3>
                                            <div className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded">Pro</div>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">Exporta el proyecto entero con todas sus escenas compuestas.</p>
                                        
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Formato de Salida</label>
                                                <select className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer">
                                                    <option>PDF Entregable Multi-página</option>
                                                    <option>Paquete ZIP de imágenes (PNG)</option>
                                                    <option>Archivo nativo (.diic)</option>
                                                </select>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded appearance-none border border-white/20 checked:bg-indigo-500 checked:border-indigo-500 text-white relative after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:opacity-0 checked:after:opacity-100 after:text-[10px] after:font-bold outline-none transition-all" />
                                                    <span className="text-xs font-bold text-gray-300">Incluir notas y especificaciones técnicas</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => { setActiveModal(null); setToastMessage('Preparando empaquetado del proyecto...'); setTimeout(() => setToastMessage(null), 3000); }} className="w-full py-4 mt-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black tracking-widest uppercase text-[11px] shadow-[0_10px_20px_rgba(79,70,229,0.3)] transition-all active:scale-95">Exportar {scenes.length} Escenas</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Invitar Modal */}
                {activeModal === 'invitar' && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setActiveModal(null)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0A0A10] border border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-sm space-y-6" onClick={e => e.stopPropagation()}>
                            <div className="text-white font-black uppercase tracking-widest text-[14px] flex justify-between items-center">
                                <span>Invitar Colaboradores</span>
                                <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-white transition-colors p-1"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Correo o número</label>
                                    <input type="text" placeholder="equipo@agencia.com..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Rol en el proyecto</label>
                                    <div className="relative">
                                        <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer">
                                            <option value="editor" className="bg-[#0A0A10]">Editor (Puede modificar)</option>
                                            <option value="commenter" className="bg-[#0A0A10]">Comentarista (Solo comentar)</option>
                                            <option value="viewer" className="bg-[#0A0A10]">Visualizador (Solo lectura)</option>
                                        </select>
                                        <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 rotate-90" />
                                    </div>
                                </div>

                                <button onClick={() => setActiveModal(null)} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black tracking-widest uppercase text-[11px] shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all active:scale-95 mt-2 flex justify-center gap-2 items-center">
                                    Enviar Invitación
                                </button>

                                <div className="pt-5 border-t border-white/10 flex flex-col gap-3">
                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest text-center">Otras formas de invitar</div>
                                    <div className="flex justify-between gap-2">
                                        <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-[10px] text-white uppercase tracking-wider transition-colors border border-white/5 flex items-center justify-center">Copiar Enlace</button>
                                        <button className="flex-1 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-xl font-bold text-[10px] uppercase tracking-wider transition-colors border border-[#25D366]/20 flex items-center justify-center">WhatsApp</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Modals de Publicar */}
                {(activeModal && activeModal.startsWith('publicar-')) && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setActiveModal(null)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0A0A10] border border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-sm space-y-6 flex flex-col" onClick={e => e.stopPropagation()}>
                            <div className="text-white font-black uppercase tracking-widest text-[14px] flex justify-between items-center shrink-0 border-b border-white/5 pb-4">
                                <span className="flex items-center gap-2"><Share2 className="w-4 h-4 text-indigo-400" /> {activeModal.replace('publicar-', '').replace(/-/g, ' ')}</span>
                                <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-white transition-colors p-1"><X className="w-5 h-5" /></button>
                            </div>

                            {activeModal === 'publicar-guardar-en-proyecto' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Seleccionar Proyecto</label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer">
                                            <option className="bg-[#0A0A10]">Campaña Clínica</option>
                                            <option className="bg-[#0A0A10]">Campaña Agro</option>
                                            <option className="bg-[#0A0A10]">Contenido Redes</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Seleccionar Campaña</label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer">
                                            <option className="bg-[#0A0A10]">Lanzamiento Bistoni</option>
                                            <option className="bg-[#0A0A10]">Promo Verano</option>
                                        </select>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black tracking-widest uppercase text-[11px] shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all active:scale-95 mt-4">Guardar</button>
                                </div>
                            )}

                            {activeModal === 'publicar-enviar-a-equipo-creativo' && (
                                <div className="space-y-4">
                                    <div className="text-xs text-gray-400 leading-relaxed font-medium">Selecciona al equipo al que deseas notificar y transferir este storyboard para la siguiente fase de producción.</div>
                                    <div className="space-y-2">
                                        {['Editor', 'Diseñador', 'Filmmaker'].map((rol, i) => (
                                            <label key={rol} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors group">
                                                <input type="checkbox" defaultChecked={i === 0} className="w-4 h-4 rounded appearance-none border border-white/20 checked:bg-indigo-500 checked:border-indigo-500 text-white relative after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:opacity-0 checked:after:opacity-100 after:text-[10px] after:font-bold outline-none transition-all" />
                                                <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{rol}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black tracking-widest uppercase text-[11px] shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all active:scale-95 mt-4">Enviar Notificación</button>
                                </div>
                            )}

                            {activeModal === 'publicar-compartir-enlace' && (
                                <div className="space-y-4">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Permisos del enlace</div>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer">
                                        <option className="bg-[#0A0A10]">Cualquiera con el enlace puede ver</option>
                                        <option className="bg-[#0A0A10]">Solo personas invitadas</option>
                                    </select>
                                    <div className="flex gap-2">
                                        <input type="text" readOnly value="https://bosquejostudio.diiczone.com/p/xj92k1" className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-400 font-mono outline-none" />
                                        <button className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black tracking-widest uppercase text-[11px] transition-all">Copiar</button>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'publicar-exportar-storyboard' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/50 rounded-2xl transition-all group">
                                            <div className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">PDF</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2 group-hover:text-indigo-300/60">Presentación</div>
                                        </button>
                                        <button className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/50 rounded-2xl transition-all group">
                                            <div className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">PNG</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2 group-hover:text-indigo-300/60">Imágenes</div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}

                {/* Configuración del Proyecto Modal */}
                {activeModal === 'configuracion' && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setActiveModal(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-[#0A0A10] border border-white/10 rounded-[24px] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.8)] w-full max-w-md relative overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                            <div className="text-white font-black uppercase tracking-widest text-[16px] flex justify-between items-center mb-8">
                                <span className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"><Settings className="w-4 h-4 text-indigo-400" /></div>
                                    Configuración del Proyecto
                                </span>
                                <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Nombre del Proyecto</label>
                                    <input 
                                        type="text" 
                                        value={tempProjectName} 
                                        onChange={(e) => setTempProjectName(e.target.value)} 
                                        className="w-full bg-[#05050A] border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-indigo-500 transition-colors shadow-inner" 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Ancho (px)</label>
                                        <input 
                                            type="number" 
                                            value={tempDocSize.width} 
                                            onChange={(e) => setTempDocSize(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }))} 
                                            className="w-full bg-[#05050A] border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-indigo-500 transition-colors shadow-inner font-mono" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Alto (px)</label>
                                        <input 
                                            type="number" 
                                            value={tempDocSize.height} 
                                            onChange={(e) => setTempDocSize(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))} 
                                            className="w-full bg-[#05050A] border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-indigo-500 transition-colors shadow-inner font-mono" 
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-white/5">
                                    <button onClick={() => setActiveModal(null)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-gray-400 border border-white/5 rounded-xl font-black tracking-widest uppercase text-[11px] transition-all">Cancelar</button>
                                    <button onClick={() => { 
                                        setProjectName(tempProjectName);
                                        setDocSize(tempDocSize);
                                        setActiveModal(null); 
                                        setToastMessage('Configuración actualizada correctamente'); 
                                        setTimeout(() => setToastMessage(null), 3000); 
                                    }} className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black tracking-widest uppercase text-[11px] shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2">
                                        Guardar Cambios
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Biblioteca de Activos Modal */}
                {activeModal === 'activos' && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={() => setActiveModal(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-[#0A0A10] border border-white/10 rounded-[24px] shadow-[0_30px_100px_rgba(0,0,0,0.9)] w-full max-w-5xl h-[75vh] flex flex-col relative overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                            
                            <div className="p-8 border-b border-white/5 flex flex-col gap-6 shrink-0 z-10 bg-[#0A0A10]/95 backdrop-blur-xl">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                            <LayoutGrid className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-white font-black uppercase tracking-widest text-[20px]">Biblioteca de Activos</h2>
                                            <p className="text-gray-500 text-sm font-medium">Gestión avanzada de recursos multimedia</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5 w-fit self-start">
                                    <button 
                                        onClick={() => setAssetsTab('project')}
                                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${assetsTab === 'project' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <Layers className="w-3.5 h-3.5" /> En este Proyecto
                                    </button>
                                    <button 
                                        onClick={() => setAssetsTab('global')}
                                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${assetsTab === 'global' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <DownloadCloud className="w-3.5 h-3.5" /> Librería Global (Cloud)
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                {assetsTab === 'project' ? (
                                    elements.filter(el => el.type === 'image').length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-700 gap-6 opacity-40">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                            <div className="text-center space-y-2">
                                                <p className="text-xs font-black uppercase tracking-widest text-white">No hay imágenes en este proyecto</p>
                                                <p className="text-[10px] font-bold">Importa imágenes desde el menú "Insertar"</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {elements.filter(el => el.type === 'image').map((img, idx) => {
                                                const isInGlobal = globalAssets.some(ga => ga.src === img.src);
                                                return (
                                                    <div key={img.id} className="group bg-[#05050A] rounded-2xl border border-white/5 hover:border-cyan-500/50 overflow-hidden relative transition-all duration-300 hover:-translate-y-1">
                                                        <div className="aspect-video bg-black/50 overflow-hidden relative">
                                                            <img src={img.src} alt="Project Asset" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                                <button 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        const newImg = { ...img, id: `img_copy_${Date.now()}_${idx}`, x: 50, y: 50 };
                                                                        const newElements = [...elements, newImg];
                                                                        setElements(newElements);
                                                                        pushToHistory(newElements);
                                                                        setActiveModal(null);
                                                                        setToastMessage('Activo duplicado en el lienzo');
                                                                        setTimeout(() => setToastMessage(null), 3000);
                                                                    }}
                                                                    className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
                                                                >
                                                                    <Plus className="w-3.5 h-3.5" /> Usar de nuevo
                                                                </button>
                                                            </div>
                                                            {/* Sync Status Badge */}
                                                            {isInGlobal && (
                                                                <div className="absolute top-3 left-3 w-6 h-6 bg-emerald-500/20 backdrop-blur-md rounded-lg border border-emerald-500/30 flex items-center justify-center" title="Sincronizado con la nube">
                                                                    <Check className="w-3 h-3 text-emerald-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-4 flex flex-col gap-3">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Imagen {idx + 1}</span>
                                                                <span className="text-[8px] font-bold text-gray-700">{img.originalWidth}x{img.originalHeight}</span>
                                                            </div>
                                                            {!isInGlobal ? (
                                                                <button 
                                                                    onClick={() => {
                                                                        setGlobalAssets(prev => [...prev, { ...img, id: `global_${Date.now()}_${idx}`, savedAt: new Date().toISOString() }]);
                                                                        setToastMessage('Activo guardado en la Librería Global');
                                                                        setTimeout(() => setToastMessage(null), 3000);
                                                                    }}
                                                                    className="w-full py-2.5 bg-white/5 hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-500/50 text-gray-400 hover:text-indigo-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn"
                                                                >
                                                                    <DownloadCloud className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" /> Subir a la Nube
                                                                </button>
                                                            ) : (
                                                                <div className="w-full py-2.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-500/60 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                                                    <Check className="w-3.5 h-3.5" /> En la Nube
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )
                                ) : (
                                    globalAssets.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-700 gap-6 opacity-40">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center rotate-45">
                                                <DownloadCloud className="w-8 h-8" />
                                            </div>
                                            <div className="text-center space-y-2">
                                                <p className="text-xs font-black uppercase tracking-widest text-white">Tu Librería Global está vacía</p>
                                                <p className="text-[10px] font-bold">Guarda activos desde "En este Proyecto" para verlos aquí</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {globalAssets.map((asset, idx) => (
                                                <div key={asset.id} className="group bg-[#05050A] rounded-2xl border border-white/5 hover:border-indigo-500/50 overflow-hidden relative transition-all duration-300 hover:-translate-y-1">
                                                    <div className="aspect-video bg-black/50 overflow-hidden relative">
                                                        <img src={asset.src} alt="Global Asset" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 gap-2">
                                                            <button 
                                                                onClick={() => {
                                                                    const newImg = { ...asset, id: `img_from_global_${Date.now()}`, x: 50, y: 50 };
                                                                    const newElements = [...elements, newImg];
                                                                    setElements(newElements);
                                                                    pushToHistory(newElements);
                                                                    setActiveModal(null);
                                                                    setToastMessage('Activo cargado desde la nube');
                                                                    setTimeout(() => setToastMessage(null), 3000);
                                                                }}
                                                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
                                                            >
                                                                <DownloadCloud className="w-3.5 h-3.5" /> Usar en este Proyecto
                                                            </button>
                                                            <button 
                                                                onClick={() => {
                                                                    setGlobalAssets(prev => prev.filter(ga => ga.id !== asset.id));
                                                                    setToastMessage('Activo eliminado de la nube');
                                                                    setTimeout(() => setToastMessage(null), 3000);
                                                                }}
                                                                className="w-full py-2 text-rose-500/60 hover:text-rose-400 text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-rose-500/10 transition-all flex items-center justify-center gap-1"
                                                            >
                                                                <Trash2 className="w-3 h-3" /> Eliminar permanentemente
                                                            </button>
                                                        </div>
                                                        <div className="absolute top-3 right-3 px-2 py-1 bg-indigo-600/20 backdrop-blur-md rounded-lg border border-indigo-500/30 text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                                                            Nube
                                                        </div>
                                                    </div>
                                                    <div className="p-4 flex flex-col gap-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Global Asset</span>
                                                            <span className="text-[7px] font-bold text-gray-700">Añadido: {new Date(asset.savedAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Historial Modal */}
                {activeModal === 'historial' && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={() => setActiveModal(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-[#0A0A10] border border-white/10 rounded-[24px] shadow-[0_30px_100px_rgba(0,0,0,0.9)] w-full max-w-md h-[60vh] flex flex-col relative overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                            <div className="p-8 border-b border-white/5 flex justify-between items-center z-10 bg-[#0A0A10]/95 backdrop-blur-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                        <History className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-black uppercase tracking-widest text-[16px]">Historial</h2>
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Línea de tiempo de cambios</p>
                                    </div>
                                </div>
                                <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                                {history.map((state, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => {
                                            setElements(state);
                                            setHistoryIndex(idx);
                                            setActiveModal(null);
                                            setToastMessage(`Restaurado al estado #${idx}`);
                                            setTimeout(() => setToastMessage(null), 2000);
                                        }}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${idx === historyIndex ? 'bg-purple-500/10 border-purple-500/40' : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${idx === historyIndex ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                                            {idx}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="text-[11px] font-black text-white uppercase tracking-widest">{idx === 0 ? 'Estado Inicial' : `Punto de Control ${idx}`}</div>
                                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">{state.length} elementos • {idx === historyIndex ? 'Actual' : 'Restaurable'}</div>
                                        </div>
                                        {idx === historyIndex && <Check className="w-4 h-4 text-purple-400" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Atajos de Teclado Modal */}
                {activeModal === 'atajos' && (
                    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={() => setActiveModal(null)}>
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                            className="bg-[#0A0A10] border border-white/10 rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.9)] w-full max-w-lg overflow-hidden relative" 
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
                            
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#0A0A10]/95 backdrop-blur-xl shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-black uppercase tracking-widest text-[18px]">Atajos de Teclado</h2>
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Flujo de trabajo "Super Pro"</p>
                                    </div>
                                </div>
                                <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { key: 'V', label: 'Seleccionar', desc: 'Herramienta puntero estándar' },
                                        { key: 'P', label: 'Lápiz', desc: 'Dibujo de trazo fino' },
                                        { key: 'B', label: 'Pincel', desc: 'Trazo artístico con presión' },
                                        { key: 'M', label: 'Marcador', desc: 'Resaltado y líneas semitransparentes' },
                                        { key: 'E', label: 'Borrador', desc: 'Eliminar trazos y elementos' },
                                        { key: 'U', label: 'Formas', desc: 'Rectángulos, círculos y polígonos' },
                                        { key: 'T', label: 'Texto', desc: 'Insertar anotaciones y títulos' },
                                        { key: 'I', label: 'Imagen IA', desc: 'Generar contenido con inteligencia artificial' },
                                        { key: 'Tab', label: 'Modo Zen', desc: 'Ocultar interfaz para máxima concentración' },
                                    ].map((sh, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.05] hover:border-white/10 transition-all">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] font-black text-white uppercase tracking-widest">{sh.label}</span>
                                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">{sh.desc}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <kbd className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400 font-black text-[12px] shadow-[0_0_10px_rgba(99,102,241,0.2)] group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all">
                                                    {sh.key}
                                                </kbd>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-white/5 space-y-4">
                                    <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Comandos Globales</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-xl">
                                            <kbd className="text-[10px] font-black text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">Ctrl+Z</kbd>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right flex-1">Deshacer</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-xl">
                                            <kbd className="text-[10px] font-black text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">Ctrl+V</kbd>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right flex-1">Pegar</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-xl">
                                            <kbd className="text-[10px] font-black text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">Ctrl+C</kbd>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right flex-1">Copiar</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-xl">
                                            <kbd className="text-[10px] font-black text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">Del</kbd>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right flex-1">Borrar</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-black/20 shrink-0">
                                <button onClick={() => setActiveModal(null)} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black tracking-[0.2em] uppercase text-[11px] transition-all border border-white/10">Entendido</button>
                            </div>
                        </motion.div>
                    </div>
                )}

            </AnimatePresence>
            <AnimatePresence>
                {!zenMode && (
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        className="h-16 border-b border-white/[0.03] bg-[#030308]/80 backdrop-blur-3xl flex items-center justify-between px-8 z-50 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                    >
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-4 group cursor-default">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 p-[1px] shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all">
                                    <div className="w-full h-full rounded-xl bg-[#030308] flex items-center justify-center">
                                        <Pencil className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-[13px] font-black text-white tracking-tight uppercase tracking-tighter">Bosquejo <span className="text-indigo-500">Studio</span></h2>
                                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">LEVEL 10</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Sincronización Activa</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-6 w-[1px] bg-white/[0.05] mx-2" />

                            <div className="flex items-center gap-2">
                                {[
                                    { id: 'archivo', label: 'Archivo', items: ['Nuevo documento', 'Abrir / Mis Proyectos', 'Guardar', 'Guardar como', 'Importar', 'Exportar'] },
                                    { id: 'editar', label: 'Editar', items: ['Deshacer (Ctrl+Z)', 'Rehacer (Ctrl+Y)', 'Cortar', 'Copiar', 'Pegar'] },
                                    { id: 'ver', label: 'Ver', items: [
                                        'Zoom In', 
                                        'Zoom Out', 
                                        `${showGrid ? 'Ocultar' : 'Mostrar'} Grid`, 
                                        '---',
                                        'Guía: Tercios', 
                                        'Guía: Áurea', 
                                        'Guía: Diagonal', 
                                        'Guía: Centro', 
                                        'Guía: Seguridad',
                                        'Ocultar Guías',
                                        '---',
                                        `${showRulers ? 'Ocultar' : 'Mostrar'} Reglas`,
                                        `${showPointerTip ? 'Ocultar' : 'Mostrar'} Puntero`,
                                        `${workspaceTheme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}`
                                    ] },
                                    { id: 'insertar', label: 'Insertar', items: ['Seleccionar', 'Lápiz', 'Pincel', 'Marcador', 'Borrador', '---', 'Forma Vectorial', 'Anotación', 'Imagen IA', '---', 'Importar Imagen Local'] },
                                    { id: 'proyecto', label: 'Proyecto', items: ['Configuración', 'Activos', 'Historial', 'Atajos de Teclado'] }
                                ].map(menu => (
                                    <div key={menu.id} className="relative">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === menu.id ? null : menu.id); }}
                                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeMenu === menu.id ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'}`}
                                        >
                                            {menu.label}
                                        </button>
                                        <AnimatePresence>
                                            {activeMenu === menu.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute top-full left-0 mt-2 w-52 bg-[#0A0A10]/95 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-60 p-2 backdrop-blur-3xl overflow-hidden"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                                                    {menu.items.map(item => (
                                                        <button key={item} onClick={() => {
                                                            if (item === 'Nuevo documento') {
                                                                setActiveModal('nuevoDocumento');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Abrir / Mis Proyectos') {
                                                                setActiveModal('abrirRecientes');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Guardar') {
                                                                saveCurrentToState();
                                                                setToastMessage('Proyecto guardado correctamente');
                                                                setTimeout(() => setToastMessage(null), 3000);
                                                                setActiveMenu(null);
                                                            } else if (item === 'Guardar como') {
                                                                setActiveModal('guardarComo');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Importar') {
                                                                setActiveModal('importar');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Exportar') {
                                                                setActiveModal('exportar');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Deshacer (Ctrl+Z)') {
                                                                handleUndo();
                                                                setActiveMenu(null);
                                                            } else if (item === 'Rehacer (Ctrl+Y)') {
                                                                handleRedo();
                                                                setActiveMenu(null);
                                                            } else if (item === 'Cortar') {
                                                                handleCut();
                                                                setActiveMenu(null);
                                                            } else if (item === 'Copiar') {
                                                                handleCopy();
                                                                setActiveMenu(null);
                                                            } else if (item === 'Pegar') {
                                                                handlePaste();
                                                                setActiveMenu(null);
                                                            } else if (item === 'Zoom In') {
                                                                handleZoomIn();
                                                                setActiveMenu(null);
                                                            } else if (item === 'Zoom Out') {
                                                                handleZoomOut();
                                                                setActiveMenu(null);
                                                            } else if (item.includes('Grid')) {
                                                                setShowGrid(prev => !prev);
                                                                setActiveMenu(null);
                                                            } else if (item === 'Guía: Tercios') {
                                                                setActiveGuide('thirds');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Guía: Áurea') {
                                                                setActiveGuide('golden');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Guía: Diagonal') {
                                                                setActiveGuide('diagonal');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Guía: Centro') {
                                                                setActiveGuide('center');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Guía: Seguridad') {
                                                                setActiveGuide('safe');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Ocultar Guías') {
                                                                setActiveGuide('none');
                                                                setActiveMenu(null);
                                                            } else if (item.includes('Reglas')) {
                                                                setShowRulers(prev => !prev);
                                                                setActiveMenu(null);
                                                            } else if (item.includes('Puntero')) {
                                                                setShowPointerTip(prev => !prev);
                                                                setActiveMenu(null);
                                                            } else if (item.includes('Modo')) {
                                                                setWorkspaceTheme(prev => prev === 'dark' ? 'light' : 'dark');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Seleccionar') {
                                                                setActiveTool('select');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Lápiz') {
                                                                setActiveTool('draw');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Pincel') {
                                                                setActiveTool('brush');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Marcador') {
                                                                setActiveTool('marker');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Borrador') {
                                                                setActiveTool('eraser');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Forma Vectorial') {
                                                                setActiveTool('shape');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Anotación') {
                                                                setActiveTool('text');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Imagen IA') {
                                                                setActiveTool('image');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Importar Imagen Local') {
                                                                fileInputRef.current?.click();
                                                                setActiveMenu(null);
                                                            } else if (item === 'Configuración') {
                                                                setTempProjectName(projectName);
                                                                setTempDocSize(docSize);
                                                                setActiveModal('configuracion');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Activos') {
                                                                setActiveModal('activos');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Historial') {
                                                                setActiveModal('historial');
                                                                setActiveMenu(null);
                                                            } else if (item === 'Atajos de Teclado') {
                                                                setActiveModal('atajos');
                                                                setActiveMenu(null);
                                                            } else {
                                                                setActiveMenu(null);
                                                            }
                                                        }} className="w-full text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center justify-between group/item">
                                                            {item}
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover/item:opacity-100 transition-all shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* --- CONTROLES DE PRODUCCIÓN --- */}
                            <div className="flex items-center gap-1.5 p-1.5 bg-white/[0.03] border border-white/[0.05] rounded-2xl mr-2">
                                <button 
                                    onClick={() => setIsPlaying(prev => !prev)}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${isPlaying ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-transparent text-gray-500 hover:bg-white/5 hover:text-white'}`}
                                    title={isPlaying ? "Pausar" : "Reproducir Storyboard"}
                                >
                                    <PlayCircle className={`w-4.5 h-4.5 ${isPlaying ? 'animate-pulse' : ''}`} />
                                </button>
                                
                                <button 
                                    onClick={() => setZenMode(prev => !prev)}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${zenMode ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-transparent text-gray-500 hover:bg-white/5 hover:text-white'}`}
                                    title="Modo Enfoque (Zen)"
                                >
                                    <Maximize className="w-4.5 h-4.5" />
                                </button>
                                
                                <div className="w-px h-4 bg-white/10 mx-1" />
                                
                                <button 
                                    onClick={() => setActiveModal('historial')}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 bg-transparent text-gray-500 hover:bg-white/5 hover:text-white"
                                    title="Historial de Versiones"
                                >
                                    <History className="w-4.5 h-4.5" />
                                </button>

                                <button 
                                    onClick={() => {
                                        const guides = ['none', 'thirds', 'golden', 'diagonal', 'center', 'safe'];
                                        const currentIndex = guides.indexOf(activeGuide);
                                        const nextIndex = (currentIndex + 1) % guides.length;
                                        setActiveGuide(guides[nextIndex]);
                                    }}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${activeGuide !== 'none' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-transparent text-gray-500 hover:bg-white/5 hover:text-white'}`}
                                    title={`Guía: ${activeGuide}`}
                                >
                                    <LayoutGrid className="w-4.5 h-4.5" />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/[0.05] rounded-2xl">
                                <div className="flex -space-x-2">
                                    {[1, 2].map(i => (
                                        <div key={i} className="w-7 h-7 rounded-full border-2 border-[#030308] bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[8px] font-black text-white shadow-lg relative cursor-pointer hover:-translate-y-0.5 transition-transform group">
                                            U{i}
                                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Usuario {i}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-px h-4 bg-white/10" />
                                <button onClick={() => setActiveModal('invitar')} className="text-[10px] font-black text-gray-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">+ Invitar</button>
                            </div>

                            <div className="flex items-center gap-3 relative">
                                <button 
                                    onClick={() => setActiveModal('enviar-produccion')}
                                    className="px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.07] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/[0.05] flex items-center gap-2.5 shadow-xl transition-all active:scale-95"
                                >
                                    <Send className="w-3.5 h-3.5 text-indigo-400" /> Enviar a Producción
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'publicar' ? null : 'publicar'); }} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_8px_25px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_35px_rgba(79,70,229,0.4)] flex items-center gap-2.5 transition-all active:scale-95 border border-white/10">
                                    <Share2 className="w-3.5 h-3.5" /> Publicar
                                </button>

                                <AnimatePresence>
                                    {activeMenu === 'publicar' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-2 w-56 bg-[#0A0A10]/95 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-60 p-2 backdrop-blur-3xl overflow-hidden"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                                            {[
                                                { id: 'guardar-en-proyecto', label: 'Guardar en proyecto' },
                                                { id: 'enviar-equipo', label: 'Enviar a equipo creativo' },
                                                { id: 'compartir-enlace', label: 'Compartir enlace' },
                                                { id: 'exportar-storyboard', label: 'Exportar storyboard' }
                                            ].map(item => (
                                                <button key={item.id} onClick={() => handlePublishAction(item.id)} className="w-full text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center justify-between group/item">
                                                    {item.label}
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover/item:opacity-100 transition-all shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="w-px h-8 bg-white/[0.05] mx-1" />
                                <button onClick={() => router.push('/dashboard')} className="w-11 h-11 flex items-center justify-center rounded-2xl bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white border border-red-500/10 hover:border-red-500/20 transition-all active:scale-90" title="Salir de Bosquejo Studio">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <button
                                onClick={() => setSidebarVisible(prev => !prev)}
                                className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all border shadow-lg ${sidebarVisible ? 'bg-indigo-600 text-white border-white/20' : 'bg-white/5 text-gray-500 border-white/10 hover:text-white hover:bg-white/10'}`}
                                title="Alternar Barra Lateral"
                            >
                                <ChevronRight className={`w-5 h-5 transition-transform ${sidebarVisible ? '' : 'rotate-180'}`} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-1 overflow-hidden relative">
                <AnimatePresence>
                    {!zenMode && (
                        <motion.div
                            initial={{ x: -100 }}
                            animate={{ x: 0 }}
                            exit={{ x: -100 }}
                            className="fixed left-8 top-32 bottom-32 w-20 flex flex-col items-center py-4 gap-3 z-[60]"
                        >
                            <div className="flex-1 p-2.5 bg-[#0A0A10]/90 backdrop-blur-3xl border border-white/[0.05] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-2 relative overflow-hidden h-fit">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                                {TOOLS.map(t => {
                                    const isActive = activeTool === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                setActiveTool(t.id);
                                                if (t.id !== 'select') {
                                                    setSelectedElementId(null);
                                                }
                                            }}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group relative z-10 
                                                ${isActive ? `${t.bgClass} text-white ${t.glowClass} ring-1 ring-white/20 scale-105` : 'text-gray-500 hover:bg-white/[0.05] hover:text-white hover:scale-105 active:scale-95'}
                                            `}
                                        >
                                            <t.icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-md' : `group-hover:scale-110 ${t.colorClass}`}`} />

                                            {/* Tooltip Animado */}
                                            <div className="absolute left-full ml-4 px-3 py-2 bg-[#0A0A1F]/95 backdrop-blur-md border border-white/10 text-white text-[10px] font-black tracking-widest uppercase rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap z-50 flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${t.bgClass} ${t.glowClass}`} />
                                                {t.label}
                                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0A0A1F] border-l border-b border-white/10 rotate-45" />
                                            </div>
                                        </button>
                                    );
                                })}
                                <div className="h-px w-8 bg-white/[0.05] mx-auto my-1" />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-white/[0.05] hover:text-indigo-400 transition-all relative group z-10"
                                >
                                    <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageImport} />
                            </div>

                            <div className="p-3 bg-[#0A0A10]/95 backdrop-blur-3xl border border-white/[0.05] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-4 items-center relative overflow-hidden">
                                <div
                                    className="w-10 h-10 rounded-xl border-2 border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative group cursor-pointer active:scale-95 transition-all overflow-hidden"
                                    style={{ backgroundColor: activeColor }}
                                    onClick={() => setColorPickerConfig({ isOpen: true, targetKey: 'base', color: activeColor, title: 'Color Principal' })}
                                >
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                                <div className="group/slider relative h-24 w-1.5 flex items-center justify-center">
                                    {/* Track Visual */}
                                    <div className="absolute inset-y-0 w-1.5 bg-[#030308] rounded-full shadow-inner p-[1px] pointer-events-none">
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-75"
                                            style={{ height: activeTool === 'text' ? `${(textSettings.fontSize / 150) * 100}%` : activeTool === 'eraser' ? `${(eraserSettings.size / 200) * 100}%` : `${(brushSize / 50) * 100}%` }}
                                        />
                                    </div>
                                    {/* Input Range Invisible pero interactivo */}
                                    <input
                                        type="range"
                                        min="1"
                                        max={activeTool === 'text' ? 150 : activeTool === 'eraser' ? 200 : 50}
                                        value={activeTool === 'text' ? textSettings.fontSize : activeTool === 'eraser' ? eraserSettings.size : brushSize}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (activeTool === 'text') {
                                                setTextSettings(prev => ({ ...prev, fontSize: val }));
                                            } else if (activeTool === 'eraser') {
                                                setEraserSettings(prev => ({ ...prev, size: val }));
                                            } else {
                                                setBrushSize(val);
                                            }
                                        }}
                                        className="absolute w-24 h-6 -rotate-90 appearance-none bg-transparent cursor-ns-resize opacity-0 z-10"
                                    />
                                    {/* Tooltip Value */}
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-[#0A0A1F]/95 backdrop-blur-md border border-white/10 text-white text-[10px] font-black rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.8)] opacity-0 -translate-x-2 pointer-events-none group-hover/slider:opacity-100 group-hover/slider:translate-x-0 transition-all duration-300 z-50 whitespace-nowrap">
                                        {activeTool === 'text' ? `${textSettings.fontSize}px` : activeTool === 'eraser' ? `${eraserSettings.size}px` : `${brushSize}px`}
                                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0A0A1F] border-l border-b border-white/10 rotate-45" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div
                    key={activeSceneId}
                    ref={containerRef}
                    className={`flex-1 overflow-hidden relative transition-colors duration-500 ${workspaceTheme === 'dark' ? 'bg-[#010103]' : 'bg-[#f0f0f5]'}`}
                    onWheel={handleWheel}
                    onPointerDown={(e) => {
                        if (e.button === 2) startPanning(e);
                        else startDrawing(e);
                    }}
                    onPointerMove={(e) => {
                        const rect = containerRef.current.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        // Direct DOM update for Zero-Lag performance using Transform
                        if (pointerRef.current) {
                            pointerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
                        }

                        lastCoordsRef.current = { x, y };
                        
                        if (isPanning) doPan(e);
                        else draw(e);
                    }}
                    onPointerUp={(e) => {
                        if (isPanning) stopPanning();
                        else stopDrawing(e);
                    }}
                    onPointerLeave={(e) => {
                        setCanvasMousePos(prev => ({ ...prev, visible: false }));
                        if (isPanning) stopPanning();
                        else stopDrawing(e);
                    }}
                    onPointerEnter={() => setCanvasMousePos(prev => ({ ...prev, visible: true }))}
                    style={{ cursor: isPanning ? 'grabbing' : (showPointerTip ? 'none' : cursor), touchAction: 'none' }}
                >
                    {/* Subtle Professional Pointer (Refined - Ref Based with Transform) */}
                    {canvasMousePos.visible && showPointerTip && (
                        <div 
                            ref={pointerRef}
                            className="absolute pointer-events-none z-[1000] flex items-center justify-center"
                            style={{
                                left: 0,
                                top: 0,
                                transform: `translate3d(${lastCoordsRef.current.x}px, ${lastCoordsRef.current.y}px, 0) translate(-50%, -50%)`,
                                willChange: 'transform'
                            }}
                        >
                            {/* Main Pointer Circle */}
                            <div 
                                className="relative rounded-full border border-white/20 backdrop-blur-[1px]"
                                style={{
                                    width: activeTool === 'eraser' 
                                        ? Math.max(10, eraserSettings.size * view.scale) 
                                        : (activeTool === 'brush' || activeTool === 'draw' || activeTool === 'marker')
                                        ? Math.max(10, brushSize * view.scale) 
                                        : (activeTool === 'text' ? Math.max(10, textSettings.fontSize * view.scale) : 14),
                                    height: activeTool === 'eraser' 
                                        ? Math.max(10, eraserSettings.size * view.scale) 
                                        : (activeTool === 'brush' || activeTool === 'draw' || activeTool === 'marker')
                                        ? Math.max(10, brushSize * view.scale) 
                                        : (activeTool === 'text' ? Math.max(10, textSettings.fontSize * view.scale) : 14),
                                    borderColor: activeTool === 'eraser' ? '#ef444499' : '#6366f199',
                                    backgroundColor: activeTool === 'eraser' ? 'rgba(239,68,68,0.03)' : 'rgba(99,102,241,0.03)'
                                }}
                            >
                                {/* Crosshair Markers (Very Subtle) */}
                                <div className="absolute inset-[-2px] flex items-center justify-center opacity-30">
                                    <div className={`absolute top-0 w-px h-1 ${activeTool === 'eraser' ? 'bg-red-400' : 'bg-indigo-400'}`} />
                                    <div className={`absolute bottom-0 w-px h-1 ${activeTool === 'eraser' ? 'bg-red-400' : 'bg-indigo-400'}`} />
                                    <div className={`absolute left-0 h-px w-1 ${activeTool === 'eraser' ? 'bg-red-400' : 'bg-indigo-400'}`} />
                                    <div className={`absolute right-0 h-px w-1 ${activeTool === 'eraser' ? 'bg-red-400' : 'bg-indigo-400'}`} />
                                </div>

                                {/* Precision Center Dot */}
                                <div className={`w-0.5 h-0.5 rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${activeTool === 'eraser' ? 'bg-red-400/80' : 'bg-indigo-400/80'}`} />
                            </div>

                            {/* Minimal Size Readout */}
                            {(activeTool === 'brush' || activeTool === 'eraser' || activeTool === 'text') && (
                                <div className="absolute left-full top-0 ml-3 px-1.5 py-0.5 bg-black/40 backdrop-blur-sm rounded border border-white/5 flex items-center gap-1 shadow-md opacity-60">
                                    <span className="text-[9px] font-bold text-indigo-300/80">
                                        {activeTool === 'text' ? textSettings.fontSize : activeTool === 'eraser' ? eraserSettings.size : brushSize}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    {showGrid && (
                        <div 
                            className={`absolute inset-0 pointer-events-none opacity-[0.25] transition-opacity duration-500`}
                            style={{ 
                                backgroundImage: `radial-gradient(${workspaceTheme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)'} 1px, transparent 1px)`,
                                backgroundSize: '24px 24px'
                            }}
                        />
                    )}
                    
                    {showRulers && (
                        <>
                            {/* Horizontal Ruler */}
                            <div className={`absolute top-0 left-0 right-0 h-6 border-b z-50 overflow-hidden pointer-events-none ${workspaceTheme === 'dark' ? 'bg-[#0A0A10]/90 border-white/10' : 'bg-white/90 border-black/10'}`}>
                                <div className="absolute inset-0 flex" style={{ transform: `translateX(${view.x % (100 * view.scale)}px)` }}>
                                    {[...Array(Math.ceil(window.innerWidth / (100 * view.scale)) + 2)].map((_, i) => {
                                        const value = Math.floor((i * 100 - view.x / view.scale) / 100) * 100;
                                        return (
                                            <div key={i} className="flex-shrink-0 relative" style={{ width: 100 * view.scale }}>
                                                <div className={`absolute left-0 top-0 bottom-0 w-[1px] ${workspaceTheme === 'dark' ? 'bg-white/20' : 'bg-black/20'}`} />
                                                <span className={`absolute left-1.5 top-0.5 text-[8px] font-bold ${workspaceTheme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>
                                                    {Math.round((i * 100 * view.scale - view.x) / view.scale)}
                                                </span>
                                                {[...Array(9)].map((_, j) => (
                                                    <div key={j} className={`absolute top-4 bottom-0 w-[1px] ${workspaceTheme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`} style={{ left: (j + 1) * (10 * view.scale) }} />
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Vertical Ruler */}
                            <div className={`absolute top-0 left-0 bottom-0 w-6 border-r z-50 overflow-hidden pointer-events-none ${workspaceTheme === 'dark' ? 'bg-[#0A0A10]/90 border-white/10' : 'bg-white/90 border-black/10'}`}>
                                <div className="absolute inset-0 flex flex-col" style={{ transform: `translateY(${view.y % (100 * view.scale)}px)` }}>
                                    {[...Array(Math.ceil(window.innerHeight / (100 * view.scale)) + 2)].map((_, i) => (
                                        <div key={i} className="flex-shrink-0 relative" style={{ height: 100 * view.scale }}>
                                            <div className={`absolute top-0 left-0 right-0 h-[1px] ${workspaceTheme === 'dark' ? 'bg-white/20' : 'bg-black/20'}`} />
                                            <span className={`absolute top-1.5 left-0.5 text-[8px] font-bold origin-top-left -rotate-90 ${workspaceTheme === 'dark' ? 'text-white/40' : 'text-black/40'}`} style={{ transform: 'rotate(-90deg) translate(-100%, 0)' }}>
                                                {Math.round((i * 100 * view.scale - view.y) / view.scale)}
                                            </span>
                                            {[...Array(9)].map((_, j) => (
                                                <div key={j} className={`absolute left-4 right-0 h-[1px] ${workspaceTheme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`} style={{ top: (j + 1) * (10 * view.scale) }} />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    <motion.div
                        className="absolute origin-top-left pointer-events-none"
                        animate={{ x: view.x, y: view.y, scale: view.scale }}
                        transition={{ type: "spring", stiffness: 260, damping: 30 }}
                    >
                        <div 
                            className="relative overflow-hidden pointer-events-auto border border-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.8)]" 
                            style={{ 
                                width: docSize.width, 
                                height: docSize.height,
                                backgroundColor: '#ffffff',
                                backgroundImage: `
                                    linear-gradient(45deg, #e5e5e5 25%, transparent 25%),
                                    linear-gradient(-45deg, #e5e5e5 25%, transparent 25%),
                                    linear-gradient(45deg, transparent 75%, #e5e5e5 75%),
                                    linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)
                                `,
                                backgroundSize: '32px 32px',
                                backgroundPosition: '0 0, 0 16px, 16px -16px, -16px 0px'
                            }}
                        >
                            {layers.map((layer, index) => (
                                <canvas
                                    key={layer.id}
                                    ref={el => canvasRefs.current[layer.id] = el}
                                    width={docSize.width}
                                    height={docSize.height}
                                    className="absolute inset-0"
                                    style={{
                                        zIndex: (index + 1) * 10,
                                        visibility: layer.visible ? 'visible' : 'hidden',
                                        opacity: layer.visible ? 1 : 0,
                                        pointerEvents: 'none'
                                    }}
                                />
                            ))}
                            {activeGuide !== 'none' && (
                                <div className="absolute inset-0 pointer-events-none z-[100]">
                                    {/* Regla de Tercios */}
                                    {activeGuide === 'thirds' && (
                                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 border border-indigo-500/30">
                                            {[...Array(9)].map((_, i) => (
                                                <div key={i} className="border-r border-b border-indigo-500/30"></div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Proporción Áurea (Phi Grid) */}
                                    {activeGuide === 'golden' && (
                                        <div className="absolute inset-0 border border-indigo-500/30">
                                            <div className="absolute left-[38.2%] top-0 bottom-0 w-px bg-indigo-500/30" />
                                            <div className="absolute left-[61.8%] top-0 bottom-0 w-px bg-indigo-500/30" />
                                            <div className="absolute top-[38.2%] left-0 right-0 h-px bg-indigo-500/30" />
                                            <div className="absolute top-[61.8%] left-0 right-0 h-px bg-indigo-500/30" />
                                        </div>
                                    )}

                                    {/* Guía Diagonal */}
                                    {activeGuide === 'diagonal' && (
                                        <svg className="absolute inset-0 w-full h-full text-indigo-500/30">
                                            <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" />
                                            <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" />
                                        </svg>
                                    )}

                                    {/* Punto Central / Crosshair */}
                                    {activeGuide === 'center' && (
                                        <div className="absolute inset-0">
                                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-indigo-500/30 -translate-x-1/2" />
                                            <div className="absolute top-1/2 left-0 right-0 h-px bg-indigo-500/30 -translate-y-1/2" />
                                            <div className="absolute left-1/2 top-1/2 w-8 h-8 border border-indigo-500/40 rounded-full -translate-x-1/2 -translate-y-1/2" />
                                        </div>
                                    )}

                                    {/* Áreas de Seguridad (Safe Areas) */}
                                    {activeGuide === 'safe' && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            {/* Action Safe (approx 90%) */}
                                            <div className="absolute w-[90%] h-[90%] border border-indigo-500/20 rounded-sm flex items-start justify-center">
                                                <div className="mt-2 text-[8px] font-bold text-indigo-500/40 uppercase tracking-widest">Action Safe</div>
                                            </div>
                                            {/* Title Safe (approx 80%) */}
                                            <div className="absolute w-[80%] h-[80%] border border-indigo-500/30 rounded-sm flex items-end justify-center">
                                                <div className="mb-2 text-[8px] font-bold text-indigo-500/40 uppercase tracking-widest">Title Safe</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {floatingTextConfig.isOpen && (
                                <div
                                    className="absolute pointer-events-auto bg-[#05050A]/80 backdrop-blur-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.9)] rounded-[20px] p-5 w-[320px] flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200"
                                    style={{
                                        left: Math.min(floatingTextConfig.coords?.x, docSize.width - 340),
                                        top: Math.min(floatingTextConfig.coords?.y, docSize.height - 200),
                                        zIndex: 99999
                                    }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onPointerUp={(e) => e.stopPropagation()}
                                    onPointerMove={(e) => e.stopPropagation()}
                                    onWheel={(e) => e.stopPropagation()}
                                >
                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                                    <div className="flex items-center gap-3 px-1">
                                        <div className="w-5 h-5 rounded-md bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                            <Type className="w-3 h-3 text-indigo-400" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Insertar Texto</span>
                                    </div>
                                    <textarea
                                        autoFocus
                                        value={floatingTextConfig.text}
                                        onChange={(e) => setFloatingTextConfig(p => ({ ...p, text: e.target.value }))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                if (floatingTextConfig.text.trim()) {
                                                    handleApplyText(floatingTextConfig.text, floatingTextConfig.coords);
                                                }
                                                setFloatingTextConfig(p => ({ ...p, isOpen: false }));
                                            }
                                        }}
                                        placeholder="Escribe el texto aquí..."
                                        className="w-full h-24 bg-[#0A0A10]/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/40 transition-all resize-none shadow-inner leading-relaxed placeholder:text-white/20 placeholder:font-sans placeholder:font-normal"
                                        style={{
                                            fontFamily: `"${textSettings.fontFamily}", sans-serif`,
                                            fontWeight: textSettings.fontWeight,
                                            color: textSettings.color,
                                            fontSize: `${Math.min(Math.max(textSettings.fontSize, 14), 24)}px`, // Clamp size for WYSIWYG preview in modal
                                            WebkitTextStroke: textSettings.strokeWidth > 0 ? `${Math.min(textSettings.strokeWidth, 2)}px ${textSettings.strokeColor}` : 'none',
                                        }}
                                    />
                                    <div className="flex justify-between items-center gap-3">
                                        <button
                                            onClick={() => setFloatingTextConfig(p => ({ ...p, isOpen: false }))}
                                            className="px-5 py-3 bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 font-black tracking-widest uppercase text-[10px] rounded-xl transition-all active:scale-95 border border-white/5"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (floatingTextConfig.text.trim()) {
                                                    handleApplyText(floatingTextConfig.text, floatingTextConfig.coords);
                                                }
                                                setFloatingTextConfig(p => ({ ...p, isOpen: false }));
                                            }}
                                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-widest uppercase text-[10px] rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.2)] transition-all active:scale-95 text-center flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            Insertar Texto
                                        </button>
                                    </div>
                                </div>
                            )}



                        </div>
                    </motion.div>

                    {/* Removed redundant global cursor system (System 2) as it caused persistent ghosting at (0,0) */}

                    <AnimatePresence>
                        {!zenMode && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute top-8 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-black/60 backdrop-blur-2xl border border-white/5 rounded-full flex items-center gap-5 z-40 shadow-2xl"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{activeTool}</span>
                                </div>
                                <div className="w-px h-4 bg-white/10" />
                                <span className="text-[10px] font-mono font-black text-indigo-400">{Math.round(view.scale * 100)}%</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {!zenMode && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="absolute bottom-8 right-8 flex flex-col gap-2 z-40"
                            >
                                <div className="bg-[#0A0A10]/90 backdrop-blur-3xl border border-white/[0.05] rounded-2xl p-1.5 flex flex-col gap-1 shadow-2xl">
                                    <button onClick={() => setView(p => ({ ...p, scale: Math.min(p.scale * 1.2, 5) }))} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                        <ZoomIn className="w-4 h-4" />
                                    </button>
                                    <div className="h-px w-6 bg-white/5 mx-auto" />
                                    <button onClick={() => setView(p => ({ ...p, scale: Math.max(p.scale / 1.2, 0.1) }))} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                        <ZoomOut className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="bg-[#0A0A10]/90 backdrop-blur-3xl border border-white/[0.05] rounded-2xl p-1.5 flex flex-col gap-1 shadow-2xl">
                                    <button onClick={() => setView(p => ({ ...p, scale: 1 }))} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all text-[9px] font-bold">100%</button>
                                    <button onClick={fitToWindow} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"><Maximize className="w-4 h-4" /></button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {sidebarVisible && !zenMode && (
                        <motion.aside
                            initial={{ x: 400 }}
                            animate={{ x: 0 }}
                            exit={{ x: 400 }}
                            className="w-[360px] bg-[#030308]/90 backdrop-blur-3xl border-l border-white/[0.03] z-50 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
                        >
                            <div className="p-8 flex-1 overflow-y-auto no-scrollbar space-y-12 bg-gradient-to-b from-white/[0.01] to-transparent">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-4 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Editor de Escena</h3>
                                    </div>
                                    <button onClick={() => setSidebarVisible(false)} className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                                </div>

                                <div className="space-y-4 group/props">
                                    <button onClick={() => setExpandedPanels(prev => ({ ...prev, props: !prev.props }))} className="w-full flex items-center justify-between group/head">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-px bg-white/10 group-hover/head:w-8 transition-all" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover/head:text-white">Propiedades</span>
                                        </div>
                                        <ChevronDown className={`w-3 h-3 text-white/20 transition-transform duration-500 ${expandedPanels.props ? '' : '-rotate-90'}`} />
                                    </button>

                                    <AnimatePresence mode="wait">
                                        {expandedPanels.props && (
                                            <motion.div key={activeTool} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-1">
                                                {selectedElementId && (
                                                    <div className="flex gap-2 mt-4 mb-2">
                                                        <button 
                                                            onClick={duplicateSelected}
                                                            className="flex-1 py-3 bg-white/5 hover:bg-indigo-500/10 text-white font-black tracking-widest uppercase text-[9px] rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-2 group"
                                                        >
                                                            <Copy className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" /> Duplicar
                                                        </button>
                                                        <button 
                                                            onClick={deleteSelected}
                                                            className="flex-1 py-3 bg-white/5 hover:bg-red-500/10 text-white font-black tracking-widest uppercase text-[9px] rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-2 group"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" /> Eliminar
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="space-y-6 bg-white/[0.02] p-6 rounded-[32px] border border-white/[0.05] shadow-inner mt-2">
                                                    {effectiveTool === 'draw' && (
                                                        <div className="space-y-8">
                                                            <div className="space-y-4">
                                                                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Grafito y Dureza</div>
                                                                <div className="flex flex-col gap-2">
                                                                    {PENCIL_PRESETS.map(p => (
                                                                        <button key={p.id} onClick={() => setPencilSettings(prev => ({ ...prev, preset: p.id }))} className={`flex items-center gap-4 p-4 rounded-3xl border transition-all active:scale-[0.98] group/preset ${pencilSettings.preset === p.id ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400' : 'bg-white/[0.02] border-white/[0.05] text-gray-500 hover:bg-white/5'}`}>
                                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] ${pencilSettings.preset === p.id ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-600'}`}>{p.id === 'rough' ? '2B' : p.id === 'standard' ? 'HB' : '4H'}</div>
                                                                            <div className="flex-1 text-left">
                                                                                <div className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">{p.label}</div>
                                                                                <div className="text-[9px] font-medium opacity-40">{p.desc}</div>
                                                                            </div>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Efecto de Trazo</div>
                                                                <div className="flex flex-col gap-2">
                                                                    {PENCIL_EFFECTS.map(e => (
                                                                        <button key={e.id} onClick={() => setPencilSettings(prev => ({ ...prev, effect: e.id }))} className={`flex items-center gap-4 p-4 rounded-3xl border transition-all active:scale-[0.98] group/effect ${pencilSettings.effect === e.id ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400' : 'bg-white/[0.02] border-white/[0.05] text-gray-500 hover:bg-white/5'}`}>
                                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[12px] ${pencilSettings.effect === e.id ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-600'}`}>{e.id === 'none' ? '—' : e.id === 'dashed' ? '- -' : 'G'}</div>
                                                                            <div className="flex-1 text-left">
                                                                                <div className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">{e.label}</div>
                                                                                <div className="text-[9px] font-medium opacity-40">{e.desc}</div>
                                                                            </div>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div className="flex justify-between items-end mb-2">
                                                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Estabilizador</div>
                                                                    <div className="text-xs font-mono font-black text-indigo-400">{Math.round(pencilSettings.stabilizer * 100)}%</div>
                                                                </div>
                                                                <input type="range" min="0" max="100" value={pencilSettings.stabilizer * 100} onChange={(e) => setPencilSettings(prev => ({ ...prev, stabilizer: parseInt(e.target.value) / 100 }))} className="w-full appearance-none bg-white/5 h-1.5 rounded-full accent-indigo-500 cursor-pointer" />
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div className="flex justify-between items-end mb-2">
                                                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Tamaño Base</div>
                                                                    <div className="text-xs font-mono font-black text-white/60">{brushSize}px</div>
                                                                </div>
                                                                <input type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full appearance-none bg-white/5 h-1.5 rounded-full accent-indigo-500 cursor-pointer" />
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Tono de Grafito</div>
                                                                    <div className="relative rounded-lg overflow-hidden group cursor-pointer hover:bg-white/10 transition-all px-2 py-1" onClick={() => setColorPickerConfig({ isOpen: true, targetKey: 'base', color: baseColor, title: 'Tono de Grafito' })}>
                                                                        <div className="flex items-center gap-1.5 pointer-events-none">
                                                                            <Palette className="w-3 h-3 text-indigo-400" />
                                                                            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">Paleta</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-6 gap-2">
                                                                    {getDynamicTones(baseColor).map((c, i) => (
                                                                        <button key={`${c}-${i}`} onClick={() => setActiveColor(c)} className={`w-full aspect-square rounded-xl border transition-all active:scale-90 flex items-center justify-center ${activeColor === c ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/5 hover:border-white/20'}`} style={{ backgroundColor: c }} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {effectiveTool === 'brush' && <div className="space-y-6">
                                                        <div className="grid grid-cols-3 gap-2">{BRUSH_VARIATIONS.map(v => (
                                                            <button key={v.id} onClick={() => setBrushSettings(prev => ({ ...prev, type: v.id }))} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all active:scale-90 ${brushSettings.type === v.id ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-transparent text-gray-500'}`}><v.icon className="w-4 h-4" /><span className="text-[8px] font-black uppercase tracking-widest">{v.label}</span></button>
                                                        ))}</div>
                                                        <div className="space-y-4">
                                                            <div className="space-y-2"><div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500 italic"><span>Tamaño</span><span className="text-indigo-400">{brushSize}px</span></div><input type="range" min="1" max="100" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full appearance-none bg-white/5 h-1 rounded-full accent-indigo-500" /></div>

                                                            {brushSettings.type === 'soft' && (
                                                                <div className="space-y-2"><div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500 italic"><span>Dureza</span><span className="text-indigo-400">{Math.round((brushSettings.hardness ?? 0.8) * 100)}%</span></div><input type="range" min="0" max="100" value={(brushSettings.hardness ?? 0.8) * 100} onChange={(e) => setBrushSettings(prev => ({ ...prev, hardness: parseInt(e.target.value) / 100 }))} className="w-full appearance-none bg-white/5 h-1 rounded-full accent-indigo-500" /></div>
                                                            )}

                                                            <div className="space-y-2"><div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500 italic"><span>Opacidad</span><span className="text-indigo-400">{Math.round(brushSettings.opacity * 100)}%</span></div><input type="range" min="0" max="100" value={brushSettings.opacity * 100} onChange={(e) => setBrushSettings(prev => ({ ...prev, opacity: parseInt(e.target.value) / 100 }))} className="w-full appearance-none bg-white/5 h-1 rounded-full accent-indigo-500" /></div>

                                                            {brushSettings.type === 'texture' && (
                                                                <div className="space-y-3 pt-2">
                                                                    <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider italic">Tipo de Textura</div>
                                                                    <div className="grid grid-cols-3 gap-2">
                                                                        {TEXTURE_TYPES.map(t => (
                                                                            <button key={t.id} onClick={() => setBrushSettings(prev => ({ ...prev, textureType: t.id }))} className={`px-2 py-2 rounded-xl text-[9px] font-black tracking-wider uppercase transition-all ${brushSettings.textureType === t.id ? 'bg-indigo-500 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/5'}`}>{t.label}</button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider italic">Color Trazo</div>
                                                            <div className="relative cursor-pointer hover:brightness-110 transition-all" onClick={() => setColorPickerConfig({ isOpen: true, targetKey: 'base', color: activeColor, title: 'Color Trazo' })}>
                                                                <div className="flex items-center gap-3 bg-black/40 border border-white/[0.05] rounded-2xl px-4 py-2.5 shadow-inner pointer-events-none">
                                                                    <div className="w-6 h-6 rounded-lg border border-white/10" style={{ backgroundColor: activeColor }} />
                                                                    <span className="text-indigo-500 font-mono font-black text-sm">#</span>
                                                                    <input type="text" value={activeColor.replace('#', '')} readOnly className="w-full bg-transparent border-none text-white font-mono uppercase tracking-widest text-xs focus:outline-none pointer-events-none" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    }

                                                    {effectiveTool === 'marker' && (
                                                        <div className="space-y-6">
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {MARKER_TYPES.map(m => (
                                                                    <button key={m.id} onClick={() => setMarkerSettings(prev => ({ ...prev, type: m.id }))} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all active:scale-90 ${markerSettings.type === m.id ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'bg-white/5 border-transparent text-gray-500'}`}>
                                                                        <m.icon className="w-4 h-4" />
                                                                        <span className="text-[8px] font-black uppercase tracking-widest text-center">{m.label}</span>
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500 italic"><span>Tamaño</span><span className="text-yellow-400">{brushSize}px</span></div>
                                                                    <input type="range" min="1" max="100" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full appearance-none bg-white/5 h-1 rounded-full accent-yellow-500" />
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500 italic"><span>Opacidad</span><span className="text-yellow-400">{Math.round(markerSettings.opacity * 100)}%</span></div>
                                                                    <input type="range" min="0" max="100" value={markerSettings.opacity * 100} onChange={(e) => setMarkerSettings(prev => ({ ...prev, opacity: parseInt(e.target.value) / 100 }))} className="w-full appearance-none bg-white/5 h-1 rounded-full accent-yellow-500" />
                                                                </div>

                                                                <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-2xl cursor-pointer hover:bg-white/[0.05] transition-all" onClick={() => setMarkerSettings(p => ({ ...p, snap: !p.snap }))}>
                                                                    <div className="flex flex-col gap-0.5">
                                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Snap a Bordes</span>
                                                                        <span className="text-[8px] font-medium text-white/40">Estabilización profesional</span>
                                                                    </div>
                                                                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${markerSettings.snap ? 'bg-yellow-500' : 'bg-white/10'}`}>
                                                                        <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${markerSettings.snap ? 'translate-x-4' : 'translate-x-0'}`} />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider italic">Color Trazo</div>
                                                                <div className="relative cursor-pointer hover:brightness-110 transition-all" onClick={() => setColorPickerConfig({ isOpen: true, targetKey: 'base', color: activeColor, title: 'Color Marcador' })}>
                                                                    <div className="flex items-center gap-3 bg-black/40 border border-white/[0.05] rounded-2xl px-4 py-2.5 shadow-inner pointer-events-none">
                                                                        <div className="w-6 h-6 rounded-lg border border-white/10" style={{ backgroundColor: activeColor }} />
                                                                        <span className="text-yellow-500 font-mono font-black text-sm">#</span>
                                                                        <input type="text" value={activeColor.replace('#', '')} readOnly className="w-full bg-transparent border-none text-white font-mono uppercase tracking-widest text-xs focus:outline-none pointer-events-none" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {effectiveTool === 'eraser' && <div className="space-y-6">
                                                        <div className="space-y-4">
                                                            <div className="space-y-2"><div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500 italic"><span>Tamaño</span><span className="text-indigo-400">{eraserSettings.size}px</span></div><input type="range" min="1" max="200" value={eraserSettings.size} onChange={(e) => setEraserSettings(prev => ({ ...prev, size: parseInt(e.target.value) }))} className="w-full appearance-none bg-white/5 h-1 rounded-full accent-indigo-500 cursor-pointer" /></div>
                                                            <div className="space-y-2"><div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500 italic"><span>Dureza</span><span className="text-indigo-400">{Math.round((eraserSettings.hardness ?? 0.5) * 100)}%</span></div><input type="range" min="0" max="100" value={(eraserSettings.hardness ?? 0.5) * 100} onChange={(e) => setEraserSettings(prev => ({ ...prev, hardness: parseInt(e.target.value) / 100 }))} className="w-full appearance-none bg-white/5 h-1 rounded-full accent-indigo-500 cursor-pointer" /></div>
                                                            <div className="space-y-2"><div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500 italic"><span>Opacidad</span><span className="text-indigo-400">{Math.round(eraserSettings.opacity * 100)}%</span></div><input type="range" min="0" max="100" value={eraserSettings.opacity * 100} onChange={(e) => setEraserSettings(prev => ({ ...prev, opacity: parseInt(e.target.value) / 100 }))} className="w-full appearance-none bg-white/5 h-1 rounded-full accent-indigo-500 cursor-pointer" /></div>
                                                        </div>
                                                    </div>}

                                                    {effectiveTool === 'shape' && <div className="space-y-8">
                                                        <div className="space-y-4">
                                                            <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Tipo de Forma</div>
                                                            <div className="grid grid-cols-5 gap-2">
                                                                {SHAPE_TYPES.map(s => (
                                                                    <button key={s.id} onClick={() => setShapeSettings(prev => ({ ...prev, type: s.id }))} className={`aspect-square flex flex-col items-center justify-center gap-1.5 rounded-2xl border transition-all active:scale-90 ${shapeSettings.type === s.id ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-white/[0.05] text-gray-500'}`}>
                                                                        <s.icon className={`w-5 h-5 ${shapeSettings.type === s.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-end mb-2">
                                                                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Grosor de Trazo</div>
                                                                <div className="text-xs font-mono font-black text-white/60">{shapeSettings.strokeWidth}px</div>
                                                            </div>
                                                            <input type="range" min="1" max="30" value={shapeSettings.strokeWidth} onChange={(e) => setShapeSettings(prev => ({ ...prev, strokeWidth: parseInt(e.target.value) }))} className="w-full appearance-none bg-white/5 h-1.5 rounded-full accent-indigo-500 cursor-pointer" />
                                                        </div>

                                                        <div className="space-y-6">
                                                            <div className="space-y-2">
                                                                <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider italic">Color de Trazo (Borde)</div>
                                                                <div className="flex gap-2 relative group w-full cursor-pointer hover:brightness-110 transition-all" onClick={() => setColorPickerConfig({ isOpen: true, targetKey: 'stroke', color: shapeSettings.strokeColor, title: 'Color de Trazo' })}>
                                                                    <div className="flex items-center gap-3 bg-black/40 border border-white/[0.05] rounded-2xl px-4 py-2.5 shadow-inner flex-1 pointer-events-none">
                                                                        <div className="w-6 h-6 rounded-lg border border-white/10" style={{ backgroundColor: shapeSettings.strokeColor }} />
                                                                        <span className="text-indigo-500 font-mono font-black text-sm">#</span>
                                                                        <input type="text" value={shapeSettings.strokeColor.replace('#', '')} readOnly className="w-full bg-transparent border-none text-white font-mono uppercase tracking-widest text-xs focus:outline-none pointer-events-none" />
                                                                    </div>
                                                                    <div className="flex items-center justify-center bg-indigo-500/20 text-indigo-400 font-black text-[10px] uppercase tracking-widest px-4 rounded-xl border border-indigo-500/30 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all pointer-events-none w-[90px]">
                                                                        Cambiar
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider italic">Estilo del Seleccionable (Trazo y Fondo)</div>
                                                                </div>

                                                                <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/[0.05]">
                                                                    <button onClick={() => setShapeSettings(prev => ({ ...prev, isTransparent: true }))} className={`flex-1 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${shapeSettings.isTransparent ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}>
                                                                        Fondo Hueco
                                                                    </button>
                                                                    <button onClick={() => setShapeSettings(prev => ({ ...prev, isTransparent: false }))} className={`flex-1 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${!shapeSettings.isTransparent ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}>
                                                                        Fondo Sólido
                                                                    </button>
                                                                </div>

                                                                {!shapeSettings.isTransparent && (
                                                                    <div className="flex gap-2 relative group w-full mt-4 cursor-pointer hover:brightness-110 transition-all" onClick={() => setColorPickerConfig({ isOpen: true, targetKey: 'fill', color: shapeSettings.fillColor === 'transparent' ? '#ffffff' : shapeSettings.fillColor, title: 'Color de Fondo' })}>
                                                                        <div className="flex items-center gap-3 bg-black/40 border border-white/[0.05] rounded-2xl px-4 py-2.5 shadow-inner flex-1 pointer-events-none">
                                                                            <div className="w-6 h-6 rounded-lg border border-white/10" style={{ backgroundColor: shapeSettings.fillColor === 'transparent' ? '#ffffff' : shapeSettings.fillColor }} />
                                                                            <span className="text-indigo-500 font-mono font-black text-sm">#</span>
                                                                            <input type="text" value={shapeSettings.fillColor === 'transparent' ? 'FFFFFF' : shapeSettings.fillColor.replace('#', '')} readOnly className="w-full bg-transparent border-none text-white font-mono uppercase tracking-widest text-xs focus:outline-none pointer-events-none" />
                                                                        </div>
                                                                        <div className="flex items-center justify-center bg-indigo-500/20 text-indigo-400 font-black text-[10px] uppercase tracking-widest px-4 rounded-xl border border-indigo-500/30 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all pointer-events-none w-[90px]">
                                                                            Cambiar
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>}

                                                    {effectiveTool === 'image' && <div className="space-y-6 text-white">
                                                        {(activeTool === 'image' && !selectedElementId) ? (
                                                            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-3xl p-6 text-center shadow-[0_0_30px_rgba(99,102,241,0.15)] overflow-hidden relative group">
                                                                <div className="absolute inset-0 bg-indigo-500/10 blur-xl group-hover:bg-indigo-500/20 transition-all duration-500" />
                                                                <input type="file" id="sidebar-image-upload" accept="image/png, image/jpeg, image/jpg, image/webp" className="hidden" onChange={handleImageImport} />
                                                                <label htmlFor="sidebar-image-upload" className="relative z-10 cursor-pointer flex flex-col items-center justify-center gap-3">
                                                                    <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                                        <ImageIcon className="w-6 h-6" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[12px] font-black uppercase tracking-widest text-indigo-100">Cargar Imagen</div>
                                                                        <div className="text-[9px] font-medium text-indigo-300/70 mt-1">Arrastra o haz clic aquí</div>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-6">
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => setSelectedElementId(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-black tracking-widest uppercase text-[10px] rounded-xl transition-all border border-white/5">Cancelar</button>
                                                                    <button onClick={() => setSelectedElementId(null)} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-widest uppercase text-[10px] rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.3)] transition-all flex justify-center items-center gap-2">
                                                                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,213,153,0.8)] animate-pulse" />
                                                                        Guardar Cambios
                                                                    </button>
                                                                </div>

                                                                <div className="space-y-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Corte y Extracción</div>
                                                                        {(imageSettings.cutoutApplied || imageSettings.selectionTarget !== 'none') && (
                                                                            <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${imageSettings.selectionTarget === 'sujeto' ? 'bg-purple-500/20 text-purple-400' : 'bg-indigo-500/20 text-indigo-400'}`}>Activo</span>
                                                                        )}
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        {/* Seleccionar Fondo */}
                                                                        <button
                                                                            onClick={() => handleSelectionClick('fondo')}
                                                                            disabled={isAnalyzingSelection && imageSettings.selectionTarget === 'none'}
                                                                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all relative overflow-hidden ${imageSettings.selectionTarget === 'fondo' ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-[#0D0D14] border-white/[0.05] hover:bg-white/5 hover:border-white/10'} ${isAnalyzingSelection && imageSettings.selectionTarget === 'none' ? 'opacity-90 cursor-wait border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : ''}`}
                                                                        >
                                                                            {isAnalyzingSelection && imageSettings.selectionTarget === 'none' && (
                                                                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent animate-pulse pointer-events-none" />
                                                                            )}
                                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all relative z-10 ${imageSettings.selectionTarget === 'fondo' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/5 text-gray-400'}`}>
                                                                                {isAnalyzingSelection && imageSettings.selectionTarget === 'none' ? <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> : <Sparkles className="w-5 h-5" />}
                                                                            </div>
                                                                            <div className={`text-[11px] font-black uppercase tracking-widest text-center relative z-10 ${imageSettings.selectionTarget === 'fondo' ? 'text-indigo-400' : isAnalyzingSelection && imageSettings.selectionTarget === 'none' ? 'text-indigo-400' : 'text-gray-300'}`}>
                                                                                {isAnalyzingSelection && imageSettings.selectionTarget === 'none' ? 'Analizando...' : 'Selecc. Fondo'}
                                                                            </div>
                                                                            <div className="text-[8px] font-medium opacity-50 text-white mt-1 text-center relative z-10">
                                                                                Detector Inteligente
                                                                            </div>
                                                                        </button>

                                                                        {/* Seleccionar Sujeto */}
                                                                        <button
                                                                            onClick={() => handleSelectionClick('sujeto')}
                                                                            disabled={isAnalyzingSelection && imageSettings.selectionTarget === 'none'}
                                                                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all relative overflow-hidden ${imageSettings.selectionTarget === 'sujeto' ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'bg-[#0D0D14] border-white/[0.05] hover:bg-white/5 hover:border-white/10'} ${isAnalyzingSelection && imageSettings.selectionTarget === 'none' ? 'opacity-90 cursor-wait border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : ''}`}
                                                                        >
                                                                            {isAnalyzingSelection && imageSettings.selectionTarget === 'none' && (
                                                                                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent animate-pulse pointer-events-none" />
                                                                            )}
                                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all relative z-10 ${imageSettings.selectionTarget === 'sujeto' ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-white/5 text-gray-400'}`}>
                                                                                {isAnalyzingSelection && imageSettings.selectionTarget === 'none' ? <Loader2 className="w-5 h-5 animate-spin text-purple-400" /> : <Scissors className="w-5 h-5" />}
                                                                            </div>
                                                                            <div className={`text-[11px] font-black uppercase tracking-widest text-center relative z-10 ${imageSettings.selectionTarget === 'sujeto' ? 'text-purple-400' : isAnalyzingSelection && imageSettings.selectionTarget === 'none' ? 'text-purple-400' : 'text-gray-300'}`}>
                                                                                {isAnalyzingSelection && imageSettings.selectionTarget === 'none' ? 'Detectando...' : 'Selecc. Sujeto'}
                                                                            </div>
                                                                            <div className="text-[8px] font-medium opacity-50 text-white mt-1 text-center relative z-10">
                                                                                Detector Frontal
                                                                            </div>
                                                                        </button>
                                                                    </div>

                                                                    {/* Acción Eliminar */}
                                                                    {imageSettings.selectionTarget !== 'none' && aiCutoutReady && !imageSettings.cutoutApplied && (
                                                                        <button
                                                                            onClick={() => {
                                                                                const selEl = elements.find(e => e.id === selectedElementId);
                                                                                if (!selEl) return;
                                                                                const imgObj = new window.Image();
                                                                                imgObj.crossOrigin = "anonymous";
                                                                                imgObj.src = selEl.src;
                                                                                imgObj.onload = () => {
                                                                                    const offCanvas = document.createElement('canvas');
                                                                                    offCanvas.width = imgObj.width;
                                                                                    offCanvas.height = imgObj.height;
                                                                                    const offCtx = offCanvas.getContext('2d');
                                                                                    offCtx.drawImage(imgObj, 0, 0);
                                                                                    try {
                                                                                        const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
                                                                                        const data = imgData.data;
                                                                                        const tolerance = 40;
                                                                                        const bgR = data[0]; const bgG = data[1]; const bgB = data[2]; const bgA = data[3];
                                                                                        if (bgA > 0) {
                                                                                            for (let i = 0; i < data.length; i += 4) {
                                                                                                if (data[i + 3] > 0) {
                                                                                                    const dist = Math.sqrt(Math.pow(data[i] - bgR, 2) + Math.pow(data[i + 1] - bgG, 2) + Math.pow(data[i + 2] - bgB, 2));
                                                                                                    if (imageSettings.selectionTarget === 'fondo') {
                                                                                                        if (dist < tolerance) data[i + 3] = 0;
                                                                                                    } else {
                                                                                                        if (dist > tolerance) data[i + 3] = 0; // Simulate Sujeto by inverting logic
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                            offCtx.putImageData(imgData, 0, 0);
                                                                                            const finalDataUrl = offCanvas.toDataURL();
                                                                                            setElements(prev => prev.map(e => e.id === selectedElementId ? { ...e, src: finalDataUrl } : e));
                                                                                        }
                                                                                        setImageSettings(p => ({ ...p, cutoutApplied: true }));
                                                                                    } catch (e) { console.error(e); }
                                                                                };
                                                                            }}
                                                                            className={`w-full py-3 ${imageSettings.selectionTarget === 'fondo' ? 'bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border-indigo-500/30' : 'bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 border-purple-500/30'} font-black tracking-widest uppercase text-[10px] rounded-xl border transition-all flex justify-center items-center gap-2 mt-3`}
                                                                        >
                                                                            <Scissors className="w-4 h-4" />
                                                                            Eliminar {imageSettings.selectionTarget === 'fondo' ? 'Fondo ext.' : 'Resto'}
                                                                        </button>
                                                                    )}

                                                                    {/* Opciones de Trazado si el recorte está aplicado */}
                                                                    {imageSettings.cutoutApplied && (
                                                                        <div className="space-y-4 pt-4 border-t border-white/[0.05]">
                                                                            <div className="text-[10px] font-black text-emerald-400/80 uppercase tracking-[0.2em] mb-2">Trazado al Recorte</div>
                                                                            <div className="space-y-5 bg-[#0D0D14] p-4 rounded-2xl border border-white/[0.05]">
                                                                                <div className="space-y-2">
                                                                                    <div className="flex justify-between items-end">
                                                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Grosor de Trazo</span>
                                                                                        <span className="text-[10px] text-emerald-400 font-mono font-black bg-emerald-500/10 px-1.5 rounded">{imageSettings.cutoutStrokeWidth}px</span>
                                                                                    </div>
                                                                                    <input type="range" min="0" max="20" value={imageSettings.cutoutStrokeWidth} onChange={(e) => setImageSettings(p => ({ ...p, cutoutStrokeWidth: parseInt(e.target.value) }))} className="w-full appearance-none bg-white/10 h-1.5 rounded-full accent-emerald-500 cursor-ew-resize" />
                                                                                </div>

                                                                                <div className="space-y-2">
                                                                                    <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider italic">Color de Trazado</div>
                                                                                    <div className="flex gap-2 relative group w-full cursor-pointer hover:brightness-110 transition-all" onClick={() => setColorPickerConfig({ isOpen: true, targetKey: 'cutoutStroke', color: imageSettings.cutoutStrokeColor, title: 'Color de Trazado de Recorte' })}>
                                                                                        <div className="flex items-center gap-3 bg-black/40 border border-white/[0.05] rounded-xl px-4 py-2.5 shadow-inner flex-1 pointer-events-none">
                                                                                            <div className="w-6 h-6 rounded-lg border border-white/10" style={{ backgroundColor: imageSettings.cutoutStrokeColor }} />
                                                                                            <span className="text-emerald-500 font-mono font-black text-sm">#</span>
                                                                                            <input type="text" value={imageSettings.cutoutStrokeColor.replace('#', '')} readOnly className="w-full bg-transparent border-none text-white font-mono uppercase tracking-widest text-xs focus:outline-none pointer-events-none" />
                                                                                        </div>
                                                                                        <div className="flex items-center justify-center bg-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-widest px-4 rounded-xl border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all pointer-events-none">
                                                                                            Cambiar
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="space-y-4">
                                                                    <div className="text-[10px] font-black text-indigo-400/80 uppercase tracking-[0.2em] mb-2">Luz y Contraste</div>

                                                                    <div className="space-y-5 bg-[#0D0D14] p-4 rounded-2xl border border-white/[0.05]">
                                                                        <div className="space-y-2">
                                                                            <div className="flex justify-between items-end">
                                                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Exposición</span>
                                                                                <span className="text-[10px] text-indigo-400 font-mono font-black bg-indigo-500/10 px-1.5 rounded">{imageSettings.exposure > 0 ? '+' : ''}{imageSettings.exposure}</span>
                                                                            </div>
                                                                            <input type="range" min="-100" max="100" value={imageSettings.exposure} onChange={(e) => setImageSettings(p => ({ ...p, exposure: parseInt(e.target.value) }))} className="w-full appearance-none bg-white/10 h-1.5 rounded-full accent-indigo-500 cursor-ew-resize" />
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                            <div className="flex justify-between items-end">
                                                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Contraste</span>
                                                                                <span className="text-[10px] text-indigo-400 font-mono font-black bg-indigo-500/10 px-1.5 rounded">{imageSettings.contrast}%</span>
                                                                            </div>
                                                                            <input type="range" min="0" max="200" value={imageSettings.contrast} onChange={(e) => setImageSettings(p => ({ ...p, contrast: parseInt(e.target.value) }))} className="w-full appearance-none bg-white/10 h-1.5 rounded-full accent-indigo-500 cursor-ew-resize" />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-4">
                                                                    <div className="text-[10px] font-black text-purple-400/80 uppercase tracking-[0.2em] mb-2">Color Studio</div>
                                                                    <div className="space-y-5 bg-[#0D0D14] p-4 rounded-2xl border border-white/[0.05]">
                                                                        <div className="space-y-2">
                                                                            <div className="flex justify-between items-end">
                                                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Saturación</span>
                                                                                <span className="text-[10px] text-purple-400 font-mono font-black bg-purple-500/10 px-1.5 rounded">{imageSettings.saturation}%</span>
                                                                            </div>
                                                                            <input type="range" min="0" max="200" value={imageSettings.saturation} onChange={(e) => setImageSettings(p => ({ ...p, saturation: parseInt(e.target.value) }))} className="w-full appearance-none bg-white/10 h-1.5 rounded-full accent-purple-500 cursor-ew-resize" />
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                            <div className="flex justify-between items-end">
                                                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Temperatura / Calidez</span>
                                                                                <span className="text-[10px] text-orange-400 font-mono font-black bg-orange-500/10 px-1.5 rounded">{imageSettings.warmth > 0 ? '+' : ''}{imageSettings.warmth}</span>
                                                                            </div>
                                                                            <input type="range" min="-100" max="100" value={imageSettings.warmth} onChange={(e) => setImageSettings(p => ({ ...p, warmth: parseInt(e.target.value) }))} className="w-full appearance-none bg-gradient-to-r from-blue-500 via-white/20 to-orange-500 h-1.5 rounded-full accent-white cursor-ew-resize border border-white/10 shadow-inner" />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                    <div className="space-y-4 pt-4 border-t border-white/[0.05]">
                                                                        <div className="flex justify-between items-end mb-2">
                                                                            <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Escala Proporcional</div>
                                                                            <div className="text-[10px] text-indigo-400 font-mono font-black bg-indigo-500/10 px-1.5 rounded">x{elements.find(el => el.id === selectedElementId)?.scaleFactor || 1.0}</div>
                                                                        </div>
                                                                        <input type="range" min="10" max="300" 
                                                                            value={(elements.find(el => el.id === selectedElementId)?.scaleFactor || 1.0) * 100} 
                                                                            onChange={(e) => {
                                                                                const el = elements.find(el => el.id === selectedElementId);
                                                                                if (el) {
                                                                                    const newScale = parseInt(e.target.value) / 100;
                                                                                    const oldScale = el.scaleFactor || 1.0;
                                                                                    const factor = newScale / oldScale;
                                                                                    updateElement(selectedElementId, { 
                                                                                        w: el.w * factor, 
                                                                                        h: el.h * factor,
                                                                                        scaleFactor: newScale 
                                                                                    });
                                                                                }
                                                                            }} 
                                                                            className="w-full appearance-none bg-indigo-500/10 h-1.5 rounded-full accent-indigo-500 cursor-ew-resize" 
                                                                        />
                                                                    </div>

                                                                    <div className="space-y-4 pt-4 border-t border-white/[0.05]">
                                                                        <div className="flex justify-between items-end mb-2">
                                                                            <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Opacidad de Capa Final</div>
                                                                            <div className="text-[10px] text-gray-400 font-mono font-black bg-white/5 px-1.5 rounded">{Math.round(imageSettings.opacity * 100)}%</div>
                                                                        </div>
                                                                        <input type="range" min="0" max="100" value={imageSettings.opacity * 100} onChange={(e) => setImageSettings(prev => ({ ...prev, opacity: parseInt(e.target.value) / 100 }))} className="w-full appearance-none bg-white/5 h-1.5 rounded-full accent-gray-400 cursor-ew-resize" />
                                                                    </div>
                                                            </div>
                                                        )}
                                                    </div>}

                                                    {effectiveTool === 'text' && <div className="space-y-8 text-white">

                                                        {activeTool === 'select' && (
                                                            <div className="space-y-4">
                                                                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Contenido de Texto</div>
                                                                <textarea
                                                                    value={textSettings.textData || ''}
                                                                    onChange={(e) => setTextSettings(prev => ({ ...prev, textData: e.target.value }))}
                                                                    className="w-full bg-[#0D0D14] border border-white/[0.05] rounded-xl p-4 text-sm font-medium text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all resize-none h-24 shadow-inner"
                                                                    placeholder="Escribe el texto aquí..."
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="space-y-4">
                                                            <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Tipografía Profesional</div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {FONT_FAMILIES.map(f => (
                                                                    <button key={f.id} onClick={() => setTextSettings(prev => ({ ...prev, fontFamily: f.id }))}
                                                                        className={`px-4 py-3 rounded-2xl border transition-all active:scale-95 text-center
                                                                                ${textSettings.fontFamily === f.id ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' : 'bg-black/40 border-white/[0.05] text-gray-400 hover:bg-white/5'}`}
                                                                        style={{ fontFamily: f.id }}
                                                                    >
                                                                        <span className="text-[11px] font-bold">{f.name}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-end mb-2">
                                                                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Tamaño de Texto</div>
                                                                <div className="text-xs font-mono font-black text-white/60">{textSettings.fontSize}px</div>
                                                            </div>
                                                            <input type="range" min="10" max="200" value={textSettings.fontSize} onChange={(e) => setTextSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))} className="w-full appearance-none bg-white/5 h-1.5 rounded-full accent-indigo-500 cursor-pointer" />
                                                        </div>

                                                        <div className="space-y-6">
                                                            <div className="space-y-2">
                                                                <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider italic">Color Principal (Relleno)</div>
                                                                <div className="flex gap-2 relative group w-full cursor-pointer hover:brightness-110 transition-all" onClick={() => setColorPickerConfig({ isOpen: true, targetKey: 'textColor', color: textSettings.color, title: 'Color de Texto' })}>
                                                                    <div className="flex items-center gap-3 bg-black/40 border border-white/[0.05] rounded-2xl px-4 py-2.5 shadow-inner flex-1 pointer-events-none">
                                                                        <div className="w-6 h-6 rounded-lg border border-white/10" style={{ backgroundColor: textSettings.color }} />
                                                                        <span className="text-indigo-500 font-mono font-black text-sm">#</span>
                                                                        <input type="text" value={textSettings.color.replace('#', '')} readOnly className="w-full bg-transparent border-none text-white font-mono uppercase tracking-widest text-xs focus:outline-none pointer-events-none" />
                                                                    </div>
                                                                    <div className="flex items-center justify-center bg-indigo-500/20 text-indigo-400 font-black text-[10px] uppercase tracking-widest px-4 rounded-xl border border-indigo-500/30 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all pointer-events-none w-[90px]">
                                                                        Cambiar
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider italic">Grosor de Trazo (Outline)</div>
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span className="text-[10px] text-indigo-400 font-mono">{textSettings.strokeWidth}px</span>
                                                                </div>
                                                                <input type="range" min="0" max="10" value={textSettings.strokeWidth} onChange={(e) => setTextSettings(prev => ({ ...prev, strokeWidth: parseInt(e.target.value) }))} className="w-full appearance-none bg-white/5 h-1 rounded-full accent-indigo-500 cursor-pointer" />
                                                            </div>

                                                            {textSettings.strokeWidth > 0 && (
                                                                <div className="space-y-2">
                                                                    <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider italic">Color de Trazo</div>
                                                                    <div className="flex gap-2 relative group w-full cursor-pointer hover:brightness-110 transition-all" onClick={() => setColorPickerConfig({ isOpen: true, targetKey: 'textStroke', color: textSettings.strokeColor, title: 'Color de Borde de Texto' })}>
                                                                        <div className="flex items-center gap-3 bg-black/40 border border-white/[0.05] rounded-2xl px-4 py-2.5 shadow-inner flex-1 pointer-events-none">
                                                                            <div className="w-6 h-6 rounded-lg border border-white/10" style={{ backgroundColor: textSettings.strokeColor }} />
                                                                            <span className="text-indigo-500 font-mono font-black text-sm">#</span>
                                                                            <input type="text" value={textSettings.strokeColor.replace('#', '')} readOnly className="w-full bg-transparent border-none text-white font-mono uppercase tracking-widest text-xs focus:outline-none pointer-events-none" />
                                                                        </div>
                                                                        <div className="flex items-center justify-center bg-indigo-500/20 text-indigo-400 font-black text-[10px] uppercase tracking-widest px-4 rounded-xl border border-indigo-500/30 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all pointer-events-none w-[90px]">
                                                                            Colorear
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>}

                                                    {activeTool === 'select' && selectedElementId && (
                                                        <div className="pt-6 mt-6 border-t border-white/[0.05] space-y-4">
                                                            {elements.find(el => el.id === selectedElementId)?.type === 'image' && (
                                                                <div className="space-y-4 mb-6">
                                                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Dimensiones y Posición</div>
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <div className="space-y-1">
                                                                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">X</div>
                                                                            <input type="number"
                                                                                value={Math.round(elements.find(el => el.id === selectedElementId)?.x || 0)}
                                                                                onChange={(e) => updateElement(selectedElementId, { x: parseInt(e.target.value) || 0 })}
                                                                                className="w-full bg-[#0D0D14] border border-white/[0.05] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500/50" />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Y</div>
                                                                            <input type="number"
                                                                                value={Math.round(elements.find(el => el.id === selectedElementId)?.y || 0)}
                                                                                onChange={(e) => updateElement(selectedElementId, { y: parseInt(e.target.value) || 0 })}
                                                                                className="w-full bg-[#0D0D14] border border-white/[0.05] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500/50" />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Ancho</div>
                                                                            <input type="number"
                                                                                value={Math.round(elements.find(el => el.id === selectedElementId)?.w || 0)}
                                                                                onChange={(e) => updateElement(selectedElementId, { w: Math.max(10, parseInt(e.target.value) || 0) })}
                                                                                className="w-full bg-[#0D0D14] border border-white/[0.05] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500/50" />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Alto</div>
                                                                            <input type="number"
                                                                                value={Math.round(elements.find(el => el.id === selectedElementId)?.h || 0)}
                                                                                onChange={(e) => updateElement(selectedElementId, { h: Math.max(10, parseInt(e.target.value) || 0) })}
                                                                                className="w-full bg-[#0D0D14] border border-white/[0.05] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500/50" />
                                                                        </div>
                                                                        <div className="space-y-1 col-span-2 mt-2">
                                                                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Rotación (°)</div>
                                                                            <div className="flex items-center gap-2">
                                                                                <input type="range" min="-180" max="180"
                                                                                    value={Math.round(elements.find(el => el.id === selectedElementId)?.rotation || 0)}
                                                                                    onChange={(e) => updateElement(selectedElementId, { rotation: parseInt(e.target.value) })}
                                                                                    className="flex-1 appearance-none bg-white/5 h-1.5 rounded-full accent-indigo-500 cursor-pointer" />
                                                                                <span className="text-xs font-mono font-black text-indigo-400 w-8 text-right">
                                                                                    {Math.round(elements.find(el => el.id === selectedElementId)?.rotation || 0)}°
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-1 col-span-2 mt-2">
                                                                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Opacidad General</div>
                                                                            <div className="flex items-center gap-2">
                                                                                <input type="range" min="0" max="100"
                                                                                    value={Math.round((elements.find(el => el.id === selectedElementId)?.settings?.opacity ?? 1) * 100)}
                                                                                    onChange={(e) => {
                                                                                        const el = elements.find(el => el.id === selectedElementId);
                                                                                        if (el) {
                                                                                            updateElement(selectedElementId, { settings: { ...el.settings, opacity: parseInt(e.target.value) / 100 } });
                                                                                        }
                                                                                    }}
                                                                                    className="flex-1 appearance-none bg-white/5 h-1.5 rounded-full accent-indigo-500 cursor-pointer" />
                                                                                <span className="text-xs font-mono font-black text-indigo-400 w-8 text-right">
                                                                                    {Math.round((elements.find(el => el.id === selectedElementId)?.settings?.opacity ?? 1) * 100)}%
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Organizar Elemento</div>
                                                            <div className="flex gap-2">
                                                                <button onClick={sendToBack} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-black tracking-widest uppercase text-[9px] rounded-xl transition-all border border-white/5 active:scale-95 shadow-lg">Al Fondo</button>
                                                                <button onClick={sendToBackwards} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-black tracking-widest uppercase text-[9px] rounded-xl transition-all border border-white/5 active:scale-95 shadow-lg">Hacia Atrás</button>
                                                                <button onClick={bringForward} className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-black tracking-widest uppercase text-[9px] rounded-xl transition-all shadow-lg active:scale-95">Hacia Adelante</button>
                                                                <button onClick={bringToFront} className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-black tracking-widest uppercase text-[9px] rounded-xl transition-all shadow-[0_10px_20px_rgba(79,70,229,0.3)] active:scale-95">Al Frente</button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {elements.find(el => el.id === selectedElementId)?.type === 'image' && (
                                                        <div className="pt-6 mt-6 border-t border-white/[0.05] space-y-4">
                                                            <div className="text-[10px] font-black text-rose-400/80 uppercase tracking-[0.2em] mb-4">Acciones de Imagen</div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <button onClick={() => {
                                                                    // Reemplazar Lógica
                                                                    const input = document.createElement('input');
                                                                    input.type = 'file';
                                                                    input.accept = 'image/png, image/jpeg, image/jpg, image/webp';
                                                                    input.onchange = (e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (!file) return;
                                                                        const reader = new FileReader();
                                                                        reader.onload = (re) => {
                                                                            const img = new Image();
                                                                            img.onload = () => {
                                                                                updateElement(selectedElementId, { src: img.src });
                                                                            }
                                                                            img.src = re.target.result;
                                                                        };
                                                                        reader.readAsDataURL(file);
                                                                    };
                                                                    input.click();
                                                                }} className="py-3 bg-white/5 hover:bg-white/10 text-white font-black tracking-widest uppercase text-[9px] rounded-xl transition-all border border-white/5 active:scale-95 flex items-center justify-center gap-2">
                                                                    <ImageIcon className="w-4 h-4" />
                                                                    Reemplazar
                                                                </button>
                                                                <button onClick={() => {
                                                                    updateElement(selectedElementId, { ...elements.find(el => el.id === selectedElementId) });
                                                                    setIsFullscreen(false);
                                                                }} className="py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-black tracking-widest uppercase text-[9px] rounded-xl transition-all border border-purple-500/20 active:scale-95 flex items-center justify-center gap-2">
                                                                    <Layers className="w-4 h-4" />
                                                                    Duplicar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {elements.find(el => el.id === selectedElementId)?.type === 'image' && (
                                                        <div className="flex flex-col gap-2 mt-4">
                                                            <button onClick={() => {
                                                                handleSelectionClick('fondo');
                                                                // This will trigger the AI removal sequence for the background
                                                            }} className="w-full py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-black tracking-widest uppercase text-[9px] rounded-xl transition-all border border-indigo-500/30 active:scale-95 shadow-lg flex items-center justify-center gap-2">
                                                                <Sparkles className="w-3.5 h-3.5" />
                                                                Eliminar Fondo
                                                            </button>
                                                            <button onClick={() => {
                                                                const el = elements.find(e => e.id === selectedElementId);
                                                                if (el) {
                                                                    const newLayerId = `l_${Date.now()}`;
                                                                    const newLayerObj = { id: newLayerId, name: 'Capa Imagen', visible: true, locked: false, data: null };
                                                                    setScenes(prev => prev.map(s => s.id === activeSceneId ? { ...s, layers: [newLayerObj, ...s.layers] } : s));
                                                                    updateElement(el.id, { layerId: newLayerId });
                                                                    setActiveLayerId(newLayerId);
                                                                }
                                                            }} className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-black tracking-widest uppercase text-[9px] rounded-xl transition-all border border-emerald-500/30 active:scale-95 shadow-lg flex items-center justify-center gap-2">
                                                                <Layers className="w-3.5 h-3.5" />
                                                                Convertir a Capa
                                                            </button>
                                                            <button onClick={() => {
                                                                const el = elements.find(el => el.id === selectedElementId);
                                                                if (el) {
                                                                    deleteElement(el.id);
                                                                    document.getElementById('sidebar-image-upload').click();
                                                                }
                                                            }} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-black tracking-widest uppercase text-[9px] rounded-xl transition-all border border-white/5 active:scale-95 shadow-lg">
                                                                Reemplazar Imagen
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <section className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <button onClick={() => setExpandedPanels(prev => ({ ...prev, layers: !prev.layers }))} className="flex items-center gap-3 group/head">
                                            <div className="w-4 h-px bg-white/10 group-hover/head:w-8 transition-all" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover/head:text-white">Capas</span>
                                            <ChevronDown className={`w-3 h-3 text-white/20 transition-transform duration-500 ${expandedPanels.layers ? '' : '-rotate-90'}`} />
                                        </button>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => {
                                                const newId = `g${Date.now()}`;
                                                const newGroupName = `Grupo ${layers.filter(l => l.type === 'group').length + 1}`;
                                                if (selectedLayerIds.length > 0) {
                                                    setLayers(prev => {
                                                        const newGroup = { id: newId, type: 'group', name: newGroupName, visible: true, locked: false, data: null };
                                                        return [...prev, newGroup].map(l => selectedLayerIds.includes(l.id) ? { ...l, groupId: newId } : l);
                                                    });
                                                    setSelectedLayerIds([newId]);
                                                } else {
                                                    setLayers([...layers, { id: newId, type: 'group', name: newGroupName, visible: true, locked: false, data: null }]);
                                                    setSelectedLayerIds([newId]);
                                                }
                                                setActiveLayerId(newId);
                                            }} className="p-2 hover:bg-white/[0.05] rounded-xl text-emerald-400 active:scale-90" title="Agrupar Seleccionados"><Folder className="w-4 h-4" /></button>
                                            <button onClick={() => {
                                                const newId = `l${Date.now()}`;
                                                setLayers([...layers, { id: newId, type: 'layer', name: `Capa ${layers.filter(l => l.type !== 'group').length}`, visible: true, locked: false, data: null }]);
                                                setActiveLayerId(newId);
                                                setSelectedLayerIds([newId]);
                                            }} className="p-2 hover:bg-white/[0.05] rounded-xl text-indigo-400 active:scale-90" title="Nueva Capa"><Plus className="w-4 h-4" /></button>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedPanels.layers && (
                                            <motion.div key="panel-layers" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                <div className="space-y-2 bg-black/20 rounded-[32px] p-2 border border-white/[0.03] shadow-inner flex flex-col-reverse">
                                                    {layers.map((layer, idx) => (
                                                        <div key={layer.id} onClick={(e) => {
                                                            if (e.ctrlKey || e.metaKey || e.shiftKey) {
                                                                setSelectedLayerIds(prev => prev.includes(layer.id) ? prev.filter(id => id !== layer.id) : [...prev, layer.id]);
                                                            } else {
                                                                setSelectedLayerIds([layer.id]);
                                                                setActiveLayerId(layer.id);
                                                                const topElement = [...elements].reverse().find(el => el && el.layerId === layer.id);
                                                                setSelectedElementId(topElement ? topElement.id : null);
                                                            }
                                                        }} className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all cursor-pointer relative overflow-hidden ${layer.type === 'group' ? 'border-b border-white/5 bg-white/[0.01] my-1' : ''} ${selectedLayerIds.includes(layer.id) ? 'bg-indigo-600/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : (activeLayerId === layer.id ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-white/[0.03]')} ${layer.groupId ? 'ml-6 border-l-2 border-indigo-500/30 rounded-l-none' : ''}`}>
                                                            {layer.type === 'group' ? (
                                                                <Folder className="w-3 h-3 text-emerald-500 shrink-0" />
                                                            ) : (
                                                                <div className={`w-2 h-2 rounded-full shrink-0 ${activeLayerId === layer.id ? 'bg-indigo-400' : 'bg-gray-700'}`} />
                                                            )}
                                                            <span
                                                                onDoubleClick={(e) => { e.stopPropagation(); setRenamingLayerId(layer.id); }}
                                                                className={`text-[12px] flex-1 tracking-tight truncate ${activeLayerId === layer.id ? 'font-black text-white' : 'text-gray-500 font-bold'}`}
                                                            >
                                                                {renamingLayerId === layer.id ? (
                                                                    <input
                                                                        autoFocus
                                                                        defaultValue={layer.name}
                                                                        onBlur={(e) => {
                                                                            const val = e.target.value.trim() || layer.name;
                                                                            setLayers(prev => prev.map(l => l.id === layer.id ? { ...l, name: val } : l));
                                                                            setRenamingLayerId(null);
                                                                        }}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') e.target.blur();
                                                                            if (e.key === 'Escape') setRenamingLayerId(null);
                                                                        }}
                                                                        onClick={e => e.stopPropagation()}
                                                                        onDoubleClick={e => e.stopPropagation()}
                                                                        className="w-full bg-black/50 border border-indigo-500/50 rounded px-2 py-0.5 text-white outline-none -ml-2"
                                                                    />
                                                                ) : layer.name}
                                                            </span>
                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={(e) => { e.stopPropagation(); toggleVisibility(layer.id); }} className="p-1.5 hover:bg-white/5 rounded-lg">{layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-red-500" />}</button>
                                                                <button onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'up'); }} className="p-1.5 hover:bg-white/5 rounded-lg disabled:opacity-20" disabled={idx === layers.length - 1}><ChevronUp className="w-3 h-3" /></button>
                                                                <button onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'down'); }} className="p-1.5 hover:bg-white/5 rounded-lg disabled:opacity-20" disabled={idx === 0}><ChevronDown className="w-3 h-3" /></button>
                                                                {layers.length > 1 && <button onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }} className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-lg"><Trash2 className="w-3 h-3" /></button>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </section>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div> {/* End Workspace Row Wrapper */}

            <AnimatePresence>
                {!zenMode && bottomBarVisible && (
                    <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="fixed bottom-0 w-full h-36 bg-[#030308]/95 border-t border-white/[0.05] flex items-stretch px-10 gap-8 backdrop-blur-3xl z-[100] shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
                        <button onClick={() => setBottomBarVisible(false)} className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#030308] border border-white/10 border-b-0 rounded-t-xl text-[8px] font-black uppercase tracking-widest text-gray-500 hover:text-white flex items-center gap-2 group shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">Ocultar <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" /></button>
                        <div className="flex flex-col justify-center gap-3 py-4 shrink-0">
                            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Exportar</h3>
                            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-[20px] border border-white/5">
                                <button onClick={() => handlePublishAction('exportar-storyboard')} className="flex items-center gap-2.5 px-4 py-2 hover:bg-indigo-500/10 rounded-xl transition-all group active:scale-95 border border-transparent hover:border-indigo-500/20">
                                    <FileText className="w-4 h-4 text-indigo-400" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white">PDF</span>
                                </button>
                                <div className="w-px h-6 bg-white/10" />
                                <button onClick={() => handlePublishAction('exportar-storyboard')} className="flex items-center gap-2.5 px-4 py-2 hover:bg-emerald-500/10 rounded-xl transition-all group active:scale-95 border border-transparent hover:border-emerald-500/20">
                                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white">PNG</span>
                                </button>
                                <div className="w-px h-6 bg-white/10" />
                                <button onClick={() => handlePublishAction('exportar-storyboard')} className="flex items-center gap-2.5 px-4 py-2 hover:bg-amber-500/10 rounded-xl transition-all group active:scale-95 border border-transparent hover:border-amber-500/20">
                                    <ImageIcon className="w-4 h-4 text-amber-400" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white">JPG</span>
                                </button>
                            </div>
                        </div>
                        <div className="w-px h-full bg-white/[0.05] shrink-0" />
                        <div className="flex-1 min-w-0 flex items-center">
                            <div className="w-full h-full py-2">
                                <SceneStrip
                                    scenes={scenes}
                                    activeSceneId={activeSceneId}
                                    onSelectScene={handleSceneSwitch}
                                    onAddScene={() => {
                                        saveCurrentToState();
                                        const newId = `sc_${Date.now()}`;
                                        setScenes([...scenes, {
                                            id: newId,
                                            name: `Escena ${scenes.length + 1}`,
                                            duration: 5,
                                            type: 'wide',
                                            notes: '',
                                            layers: [
                                                { id: 'bg', name: 'Fondo', visible: true, locked: false, data: null },
                                                { id: 'l1', name: 'Capa 1', visible: true, locked: false, data: null }
                                            ],
                                            activeLayerId: 'l1',
                                            objective: 'idea'
                                        }]);
                                        setActiveSceneId(newId);
                                    }}
                                    onDuplicateScene={(id) => {
                                        const source = scenes.find(s => s.id === id);
                                        const newId = `sc_${Date.now()}`;
                                        setScenes([...scenes, { ...source, id: newId, name: `${source.name} (Copia)` }]);
                                        setActiveSceneId(newId);
                                    }}
                                    onDeleteScene={(id) => {
                                        if (scenes.length <= 1) return;
                                        setScenes(scenes.filter(s => s.id !== id));
                                        if (activeSceneId === id) setActiveSceneId(scenes[0].id);
                                    }}
                                    onUpdateScene={handleUpdateScene}
                                    onConfigScene={setConfigSceneId}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!zenMode && !bottomBarVisible && (
                    <motion.button
                        initial={{ y: 50 }}
                        animate={{ y: 0 }}
                        exit={{ y: 50 }}
                        onClick={() => setBottomBarVisible(true)}
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-[#030308] border border-white/10 border-b-0 rounded-t-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white flex items-center gap-3 group z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-colors"
                    >
                        <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform text-indigo-400" />
                        Mostrar Escenas y Exportar
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {configSceneId && configScene && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setConfigSceneId(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-[400px] bg-[#0A0A10]/95 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
                                    Configurar Escena
                                </h3>
                                <button
                                    onClick={() => setConfigSceneId(null)}
                                    className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all active:scale-90"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Identificador</div>
                                    <input
                                        type="text"
                                        value={configScene.name}
                                        onChange={(e) => handleUpdateScene(configSceneId, { name: e.target.value })}
                                        className="w-full bg-black/40 border border-white/[0.05] rounded-2xl px-5 py-3.5 text-[12px] text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold shadow-inner"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Objetivo Estratégico</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {SCENE_OBJECTIVES.map(obj => (
                                            <button
                                                key={obj.id}
                                                onClick={() => handleUpdateScene(configSceneId, { objective: obj.id })}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all active:scale-95
                                                    ${configScene.objective === obj.id ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-black/40 border-white/[0.05] text-gray-400 hover:bg-white/5'}`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${obj.color} ${configScene.objective === obj.id ? 'shadow-[0_0_8px_currentcolor]' : ''}`} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{obj.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1 flex justify-between">
                                        <span>Duración de Escena</span>
                                        <span className="text-indigo-400 font-mono">{configScene.duration || 5}s</span>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <input 
                                            type="range" 
                                            min="0.5" 
                                            max="30" 
                                            step="0.5"
                                            value={configScene.duration || 5}
                                            onChange={(e) => handleUpdateScene(configSceneId, { duration: parseFloat(e.target.value) })}
                                            className="flex-1 appearance-none bg-white/5 h-1.5 rounded-full accent-indigo-500 cursor-pointer" 
                                        />
                                        <input
                                            type="number"
                                            min="0.5"
                                            max="30"
                                            step="0.1"
                                            value={configScene.duration || 5}
                                            onChange={(e) => handleUpdateScene(configSceneId, { duration: parseFloat(e.target.value) || 0 })}
                                            className="w-20 bg-black/40 border border-white/[0.05] rounded-xl px-3 py-2 text-[12px] text-white text-center focus:outline-none focus:border-indigo-500/50 transition-all font-mono font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Notas del Editor</div>
                                    <textarea
                                        rows={3}
                                        value={configScene.notes}
                                        onChange={(e) => handleUpdateScene(configSceneId, { notes: e.target.value })}
                                        className="w-full bg-black/40 border border-white/[0.05] rounded-3xl p-5 text-[12px] text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-all resize-none leading-relaxed font-bold shadow-inner"
                                        placeholder="Propósito estético o narrativo para esta escena..."
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={() => { saveCurrentToState(); setConfigSceneId(null); }}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[32px] text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_15px_35px_rgba(79,70,229,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3 group"
                                    >
                                        <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        Guardar y Cerrar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {activeModal === 'enviar-produccion' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                        onClick={() => setActiveModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-[500px] bg-[#0A0A10] border border-white/10 rounded-[40px] p-10 shadow-[0_50px_100px_rgba(0,0,0,1)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
                            
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Enviar a Producción</h2>
                                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">DIIC ZONE Orchestration Engine</p>
                                </div>
                                <button onClick={() => setActiveModal(null)} className="p-3 hover:bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-10">
                                {[
                                    { id: 'CAMPAIGN_SALES', label: 'Campaña de Ventas', desc: 'Flujo completo con anuncios y landing', icon: Rocket, color: 'text-indigo-400' },
                                    { id: 'SOCIAL_EXPRESS', label: 'Social Express', desc: 'Contenido rápido para redes sociales', icon: Share2, color: 'text-emerald-400' },
                                    { id: 'BRAND_AWARENESS', label: 'Branding & Posicionamiento', desc: 'Enfoque en identidad y autoridad', icon: Sparkles, color: 'text-purple-400' }
                                ].map(opt => (
                                    <button 
                                        key={opt.id}
                                        onClick={() => handleSendToProduction(opt.id)}
                                        className="w-full p-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-indigo-500/30 rounded-3xl text-left transition-all group flex items-center gap-6"
                                    >
                                        <div className={`p-4 rounded-2xl bg-black/40 border border-white/5 group-hover:border-indigo-500/30 transition-all ${opt.color}`}>
                                            <opt.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-white mb-1 tracking-tight">{opt.label}</div>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{opt.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-6">
                                <p className="text-[10px] font-bold text-indigo-300 leading-relaxed text-center opacity-80 italic">
                                    "Al enviar a producción, nuestro sistema de orquestación creará los tableros de Trello, documentos en Google Drive y el canal de Slack correspondientes."
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {activeModal === 'exportar' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-[450px] text-center"
                        >
                            <div className="relative w-32 h-32 mx-auto mb-10">
                                <svg className="w-full h-full rotate-[-90deg]">
                                    <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                    <motion.circle 
                                        cx="64" cy="64" r="60" fill="none" stroke="#6366f1" strokeWidth="8"
                                        strokeDasharray="377"
                                        initial={{ strokeDashoffset: 377 }}
                                        animate={{ strokeDashoffset: 377 - (377 * exportProgress) / 100 }}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-black text-white">{exportProgress}%</span>
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Exportando Masterpiece</h2>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-10">Procesando {scenes.length} escenas en alta fidelidad</p>
                            
                            <div className="flex items-center gap-3 justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Generando PDF Dinámico...</span>
                            </div>

                            {exportProgress === 100 && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => { setActiveModal(null); setIsExporting(false); }}
                                    className="mt-10 px-10 py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-[32px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all"
                                >
                                    Cerrar y Descargar
                                </motion.button>
                            )}
                        </motion.div>
                    </motion.div>
                )}

                {activeModal === 'publicar-enviar-equipo' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                        onClick={() => setActiveModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-[500px] bg-[#0A0A10] border border-white/10 rounded-[40px] p-10 shadow-[0_50px_100px_rgba(0,0,0,1)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500" />
                            
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Delegar a Equipo</h2>
                                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">Colaboración Creativa</p>
                                </div>
                                <button onClick={() => setActiveModal(null)} className="p-3 hover:bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                                    <div className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-4">¿Qué equipo necesita esto?</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Filmmakers', 'Designers', 'Editors', 'VFX Artists'].map(team => (
                                            <button key={team} className="py-3 px-4 bg-black/40 border border-white/5 hover:border-fuchsia-500/30 rounded-2xl text-[10px] font-black text-gray-400 hover:text-white transition-all uppercase tracking-widest">
                                                {team}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 ml-1">Instrucciones Adicionales</div>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-black/40 border border-white/[0.05] rounded-3xl p-5 text-[12px] text-gray-300 focus:outline-none focus:border-fuchsia-500/50 transition-all resize-none leading-relaxed font-bold shadow-inner"
                                        placeholder="Ej: Mantener el estilo cinematográfico e iluminación cálida..."
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        showToast("✅ Enviado al equipo creativo");
                                        setActiveModal(null);
                                    }}
                                    className="w-full py-5 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white rounded-[32px] text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(217,70,239,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3 group"
                                >
                                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    Enviar Proyecto
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] px-8 py-4 bg-[#0A0A10]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center gap-4"
                    >
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <span className="text-[11px] font-black text-white uppercase tracking-widest">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
