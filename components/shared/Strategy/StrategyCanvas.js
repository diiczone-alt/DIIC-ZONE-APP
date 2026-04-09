'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    STRATEGIC_COLUMNS, 
    NODE_TYPES, 
    STRATEGIC_RAILS,
    NODE_CATEGORIES, 
    NODE_PLATFORMS, 
    NODE_STATUS, 
    NODE_STAGES, 
    getNodeLaneId 
} from './StrategyConstants';
import { 
    Target, ArrowRight, Calendar, BarChart2, Link2, StickyNote, Sparkles, Trash2, Palette, Minus, 
    Type as TypeIcon, ArrowUpRight, Check, Square, Maximize, MousePointer2, Pencil, Layout, 
    Instagram, Facebook, Youtube, Globe, Chrome, Clock, CheckCircle2, PlayCircle, Lightbulb, 
    PenTool, Search, AlertTriangle, Plus, Layers, BrainCircuit, Megaphone, Rocket, ChevronRight, 
    Mic, Printer, Image, Film, Smartphone, Monitor, Maximize2, Box, BarChart3, Filter, Table, List, 
    RotateCcw, ChevronUp, ChevronLeft, CalendarDays, ShieldCheck
} from 'lucide-react';


function getFunnelLevel(category) {
    if (category === 'atracción') return { id: 'TOFU', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' };
    if (category === 'conexión') return { id: 'MOFU', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    if (category === 'autoridad') return { id: 'MOFU+', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
    if (category === 'conversión') return { id: 'BOFU', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
    if (category === 'escala') return { id: 'ADVOCACY', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' };
    return { id: 'GENERAL', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
}
export default function StrategyCanvas({ 
    nodes, 
    edges, 
    activeTool,
    viewMode = 'tactical', // Default to tactical
    onNodeMove, 
    onNodeSelect, 
    onEdgeSelect, 
    onConnectionStart,
    onConnect,
    onAddNode,
    onDeleteNode,
    onDeleteEdge,
    onUpdateNode,
    onUpdateEdge,
    selectedNodeId,
    selectedEdgeId,
    connectionStart,
    strategyHealth,
    view,
    onViewChange,
    isAILoading,
    drawings,
    onDrawingsUpdate,
    onClearDrawings,
    penSettings,
    onPenSettingsUpdate,
    contextMenu,
    onContextMenuUpdate,
    isAuditorActive,
    funnelHealth,
    isCompactMode = false,
    theme = 'dark'
}) {

    const canvasRef = useRef(null);
    const [dragState, setDragState] = useState({ isDragging: false, startX: 0, startY: 0, originX: 0, originY: 0, targetId: null });
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectStartNodeId, setConnectStartNodeId] = useState(null);
    const [activeNodeMenu, setActiveNodeMenu] = useState(null); // { id: nodeId, type: 'status' | 'platform' | 'stage' }
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [currentPath, setCurrentPath] = useState(null);
    
    // Neural Tree State - Manageable positions for Hubs
    const [hubPositions, setHubPositions] = useState({
        'root': { x: 100, y: 1500 },
        'l2_creativa': { x: 500, y: 1000 },
        'l2_crm': { x: 500, y: 2400 },
        'l2_conversion': { x: 500, y: 3200 },
        'l3_imagen': { x: 1000, y: 600 },
        'l3_videos': { x: 1000, y: 1800 },
        'l3_audios': { x: 1000, y: 2200 },
        'l3_imprenta': { x: 1000, y: 2500 },
        'l3_crm_email': { x: 1000, y: 2700 },
        'l3_crm_scoring': { x: 1000, y: 2900 },
        'l3_crm_retargeting': { x: 1000, y: 3100 },
        'hub_post': { x: 1400, y: 300 },
        'hub_st_img': { x: 1400, y: 650 },
        'hub_portada': { x: 1400, y: 1000 },
        'hub_carrucel': { x: 1400, y: 1350 },
        'hub_reels': { x: 1400, y: 1700 },
        'hub_st_vid': { x: 1400, y: 2050 },
        'hub_tiktok': { x: 1400, y: 2400 },
        'hub_youtube': { x: 1400, y: 2750 }
    });

    const hubHierarchy = {
        'root': ['l2_creativa', 'l2_crm', 'l2_conversion'],
        'l2_creativa': ['l3_imagen', 'l3_videos', 'l3_audios', 'l3_imprenta'],
        'l2_crm': ['l3_crm_email', 'l3_crm_scoring', 'l3_crm_retargeting'],
        'l3_imagen': ['hub_post', 'hub_st_img', 'hub_portada', 'hub_carrucel'],
        'l3_videos': ['hub_reels', 'hub_st_vid', 'hub_tiktok', 'hub_youtube']
    };

    // Handle Wheel for Zoom
    const handleWheel = (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = -e.deltaY * 0.001;
            const newScale = Math.min(Math.max(view.scale + delta, 0.2), 2);
            onViewChange({ ...view, scale: newScale });
        } else {
            onViewChange({ ...view, x: view.x - e.deltaX, y: view.y - e.deltaY });
        }
    };
 
     const l2Hubs = [
         { id: 'l2_creativa', label: 'Zona Creativa', parent: 'root', color: '#10b981' },
         { id: 'l2_crm', label: 'Automatización CRM', parent: 'root', color: '#0ea5e9' },
         { id: 'l2_conversion', label: 'Conversiones y Formularios', parent: 'root', color: '#6366f1' }
     ];
 
     const l3Hubs = [
         { id: 'l3_imagen', label: 'IMAGEN', parent: 'l2_creativa', color: '#10b981' },
         { id: 'l3_videos', label: 'Videos', parent: 'l2_creativa', color: '#facc15' },
         { id: 'l3_audios', label: 'Audios', parent: 'l2_creativa', color: '#fb923c' },
         { id: 'l3_imprenta', label: 'Imprenta', parent: 'l2_creativa', color: '#f43f5e' },
         { id: 'l3_crm_email', label: 'Secuencia Email', parent: 'l2_crm', color: '#0ea5e9', isFinal: true, lane: 'crm_email' },
         { id: 'l3_crm_scoring', label: 'Lead Scoring', parent: 'l2_crm', color: '#0ea5e9', isFinal: true, lane: 'crm_scoring' },
         { id: 'l3_crm_retargeting', label: 'Retargeting', parent: 'l2_crm', color: '#0ea5e9', isFinal: true, lane: 'crm_retargeting' }
     ];
 
     const hubs = [
         { parent: 'l3_imagen', lane: 'i_post', id: 'hub_post', label: 'post', color: '#10b981' },
         { parent: 'l3_imagen', lane: 'i_historias', id: 'hub_st_img', label: 'Historia', color: '#facc15' },
         { parent: 'l3_imagen', lane: 'i_portadas', id: 'hub_portada', label: 'portada', color: '#fb923c' },
         { parent: 'l3_imagen', lane: 'i_carrucel', id: 'hub_carrucel', label: 'carrucel', color: '#ef4444' },
         { parent: 'l3_videos', lane: 'v_reels', id: 'hub_reels', label: 'Reel', color: '#10b981' },
         { parent: 'l3_videos', lane: 'v_historias', id: 'hub_st_vid', label: 'V. Historia', color: '#facc15' },
         { parent: 'l3_videos', lane: 'v_tiktok', id: 'hub_tiktok', label: 'TIK TOK', color: '#fb923c' },
         { parent: 'l3_videos', lane: 'v_youtube', id: 'hub_youtube', label: 'YOUTUBE', color: '#ef4444' },
     ];

    // Handle Mouse Events for Pan and Drag
    const handleMouseDown = (e, id) => {
        if (e.button !== 0) return; // Only left click
        
        const rect = canvasRef.current.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left - view.x) / view.scale;
        const canvasY = (e.clientY - rect.top - view.y) / view.scale;

        // 1. Specialized Creation Tools (Early exit if no ID or draw)
        if (activeTool === 'draw') {
            const newId = Date.now().toString();
            setCurrentPath({ 
                id: newId, 
                points: [{ x: canvasX, y: canvasY }],
                d: `M ${canvasX} ${canvasY}`,
                color: penSettings.color,
                style: penSettings.style,
                thickness: penSettings.thickness,
                arrowSize: penSettings.arrowSize
            });
            setDragState({ isDragging: true, targetId: 'draw' });
            onContextMenuUpdate({ ...contextMenu, visible: false });
            return;
        }

        if (activeTool === 'create' && !id) {
            onAddNode('educativo', canvasX - 128, canvasY - 50);
            return;
        }

        if (activeTool === 'note' && !id) {
            onAddNode('sticky', canvasX - 128, canvasY - 50);
            return;
        }

        if (activeTool === 'text' && !id) {
            onAddNode('label', canvasX - 128, canvasY - 50);
            return;
        }

        // 2. Node/Hub Specific Tools (Require ID)
        if (id) {
            if (activeTool === 'delete') {
                e.stopPropagation();
                onDeleteNode(id);
                return;
            }

            if (activeTool === 'connect') {
                e.stopPropagation();
                onConnectionStart(id);
                setDragState({ isDragging: true, targetId: 'connect', startX: e.clientX, startY: e.clientY });
                return;
            }
        }

        // 3. Navigation & Selection Tools
        if (activeTool === 'hand') {
            // "Hand" tool ALWAYS pans, even if clicking on a node
            setDragState({
                isDragging: true,
                startX: e.clientX,
                startY: e.clientY,
                originX: view.x,
                originY: view.y,
                targetId: 'canvas'
            });
            return;
        }

        if (activeTool === 'select') {
            if (id) {
                // Determine if it's a hub or a standard node
                const isHub = id.toString().startsWith('l2_') || id.toString().startsWith('l3_') || id.toString().startsWith('hub_') || id === 'root';
                
                if (isHub) {
                    const hub = hubPositions[id];
                    if (hub) {
                        setDragState({
                            isDragging: true,
                            startX: canvasX - hub.x,
                            startY: canvasY - hub.y,
                            targetId: id
                        });
                        onNodeSelect(id);
                    }
                } else {
                    const node = nodes.find(n => n.id === id);
                    if (node) {
                        setDragState({
                            isDragging: true,
                            startX: canvasX - node.x,
                            startY: canvasY - node.y,
                            targetId: id
                        });
                        onNodeSelect(id);
                    }
                }
            } else {
                // Select tool on background -> ONLY Deselect, NO Pan
                onNodeSelect(null);
            }
        }
    };

    const handleMouseMove = useCallback((e) => {
        if (!canvasRef.current || !dragState.isDragging) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left - view.x) / view.scale;
        const canvasY = (e.clientY - rect.top - view.y) / view.scale;

        setMousePos({ x: canvasX, y: canvasY });

        if (dragState.targetId === 'draw' && currentPath) {
            const lastPoint = currentPath.points[currentPath.points.length - 1];
            const smoothingFactor = 0.25; 
            const smoothedX = lastPoint.x + (canvasX - lastPoint.x) * smoothingFactor;
            const smoothedY = lastPoint.y + (canvasY - lastPoint.y) * smoothingFactor;
            
            const dist = Math.sqrt(Math.pow(smoothedX - lastPoint.x, 2) + Math.pow(smoothedY - lastPoint.y, 2));
            
            if (dist > 1.5) {
                setCurrentPath(prev => ({ 
                    ...prev, 
                    points: [...prev.points, { x: smoothedX, y: smoothedY }],
                    d: `${prev.d} L ${smoothedX} ${smoothedY}` 
                }));
            }
            return;
        }

        if (dragState.targetId === 'canvas') {
            onViewChange({
                ...view,
                x: dragState.originX + (e.clientX - dragState.startX),
                y: dragState.originY + (e.clientY - dragState.startY)
            });
        } else if (dragState.targetId === 'connect') {
            // Preview handled above setting mousePos
        } else {
            // Node/Hub drag: newPosition = currentCanvasPos - offsetWithinNode
            const newX = canvasX - dragState.startX;
            const newY = canvasY - dragState.startY;
            
            const isHub = dragState.targetId.toString().startsWith('l2_') || dragState.targetId.toString().startsWith('l3_') || dragState.targetId.toString().startsWith('hub_') || dragState.targetId === 'root';

            if (isHub) {
                setHubPositions(prev => {
                    const latestParentPos = prev[dragState.targetId];
                    if (!latestParentPos) return prev;

                    const dx = newX - latestParentPos.x;
                    const dy = newY - latestParentPos.y;

                    // If no movement, skip update
                    if (dx === 0 && dy === 0) return prev;

                    const newPositions = { ...prev, [dragState.targetId]: { x: newX, y: newY } };
                    
                    // Smart Move: Move all children recursively by the incremental delta
                    const moveChildren = (parentId) => {
                        const children = hubHierarchy[parentId] || [];
                        children.forEach(childId => {
                            const currentChildPos = prev[childId];
                            if (currentChildPos) {
                                newPositions[childId] = { 
                                    x: currentChildPos.x + dx, 
                                    y: currentChildPos.y + dy 
                                };
                                moveChildren(childId);
                            }
                        });
                    };
                    moveChildren(dragState.targetId);
                    
                    return newPositions;
                });
            } else {
                onNodeMove(dragState.targetId, newX, newY);
            }
        }
    }, [dragState, view, onNodeMove, onViewChange, currentPath]);

    const handleMouseUp = (e) => {
        if (dragState.targetId === 'draw' && currentPath) {
            onDrawingsUpdate(prev => [...prev, currentPath]);
            setCurrentPath(null);
        }

        if (dragState.targetId === 'connect' && connectionStart) {
            // Find if dropped on a node OR a HUB
            const dropTarget = nodes.find(n => {
                const nodeX = n.x;
                const nodeY = n.y;
                return mousePos.x >= nodeX && mousePos.x <= nodeX + 240 &&
                       mousePos.y >= nodeY && mousePos.y <= nodeY + 50;
            }) || Object.entries(hubPositions).find(([id, pos]) => {
                return mousePos.x >= pos.x - 60 && mousePos.x <= pos.x + 60 &&
                       mousePos.y >= pos.y - 15 && mousePos.y <= pos.y + 15;
            });

            if (dropTarget) {
                const targetId = dropTarget.id || dropTarget[0];
                if (targetId !== connectionStart) {
                    onConnect(connectionStart, targetId);
                }
            }
        }
        setDragState({ isDragging: false, startX: 0, startY: 0, originX: 0, originY: 0, targetId: null });
        onConnectionStart(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const selectionData = e.dataTransfer.getData('nodeSelection');
        if (!selectionData) return;

        try {
            const selection = JSON.parse(selectionData);
            const rect = canvasRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - view.x) / view.scale;
            const y = (e.clientY - rect.top - view.y) / view.scale;

            onAddNode(selection, x - 128, y - 50);
        } catch (err) {
            console.error('Error parsing drop data:', err);
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    // Orthogonal (Manhattan) routing for a high-fidelity "Manifold" look
    const getEdgePath = (sourceId, targetId) => {
        const source = nodes.find(n => n.id === sourceId);
        const target = nodes.find(n => n.id === targetId);
        if (!source || !target) return '';

        const startX = source.x + 290; // End of tactical chassis
        const startY = source.y + 38;  // Vertical center of h-76
        const endX = target.x;
        const endY = target.y + 38;

        // Implementation of Advanced Z-shape Manifold routing
        const GAP = 30; // Minimum gap for the manifold
        const isBackwards = endX < startX + GAP;
        
        if (isBackwards) {
            // Complex Z-path to wrap around nodes
            const midY = startY + (endY - startY) * 0.5;
            const detoutX = startX + GAP;
            return `M ${startX} ${startY} L ${detoutX} ${startY} L ${detoutX} ${midY} L ${endX - GAP} ${midY} L ${endX - GAP} ${endY} L ${endX} ${endY}`;
        }

        // Standard 3-point orthogonal path (Step)
        const midX = startX + (endX - startX) * 0.5;
        return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
    };

    const getPreviewPath = () => {
        if (!connectionStart) return '';
        const source = nodes.find(n => n.id === connectionStart);
        if (!source) return '';

        const startX = source.x + 290;
        const startY = source.y + 38;
        const endX = mousePos.x;
        const endY = mousePos.y;

        const isBackwards = endX < startX + 30;
        if (isBackwards) {
            const midY = startY + (endY - startY) * 0.5;
            const detoutX = startX + 30;
            return `M ${startX} ${startY} L ${detoutX} ${startY} L ${detoutX} ${midY} L ${endX - 30} ${midY} L ${endX - 30} ${endY} L ${endX} ${endY}`;
        }

        const midX = startX + (endX - startX) * 0.5;
        return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
    };

    const cursorClass = activeTool === 'create' ? 'cursor-cell' : 
                        activeTool === 'connect' ? 'cursor-alias' :
                        activeTool === 'delete' ? 'cursor-crosshair' : 
                        activeTool === 'hand' ? (dragState.isDragging ? 'cursor-grabbing' : 'cursor-grab') :
                        activeTool === 'note' ? 'cursor-copy' :
                        activeTool === 'draw' ? 'cursor-crosshair' : 
                        activeTool === 'text' ? 'cursor-text' :
                        dragState.isDragging ? 'cursor-grabbing' : 'cursor-grab';

    return (
        <div 
            ref={canvasRef}
            className={`flex-1 overflow-hidden relative transition-colors duration-700 outline-none ${theme === 'dark' ? 'bg-[#050511]' : 'bg-slate-50'} ${cursorClass}`}
            onWheel={handleWheel}
            onMouseDown={(e) => handleMouseDown(e, null)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onContextMenu={(e) => {
                e.preventDefault();
                onContextMenuUpdate({ visible: true, x: e.clientX, y: e.clientY });
            }}
            tabIndex={0}
        >
            {/* Premium Context Menu */}
            <AnimatePresence>
                {contextMenu?.visible && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="fixed z-[300] w-64 p-4 bg-[#0a0a0f]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-5"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Colors */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-white/40 mb-1">
                                <Palette className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Colores Neón</span>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                                {[
                                    { id: 'cyan', val: '#22d3ee' },
                                    { id: 'emerald', val: '#10b981' },
                                    { id: 'amber', val: '#f59e0b' },
                                    { id: 'rose', val: '#f43f5e' },
                                    { id: 'indigo', val: '#6366f1' },
                                    { id: 'white', val: '#ffffff' }
                                ].map(color => (
                                    <button 
                                        key={color.id}
                                        onClick={() => onPenSettingsUpdate({ ...penSettings, color: color.val })}
                                        className={`w-7 h-7 rounded-lg border-2 transition-all flex items-center justify-center ${penSettings.color === color.val ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                                        style={{ backgroundColor: color.val }}
                                    >
                                        {penSettings.color === color.val && <Check className={`w-3.5 h-3.5 ${color.id === 'white' ? 'text-black' : 'text-white'}`} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Line Styles */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-white/40 mb-1">
                                <Minus className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Estilos de Línea</span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {[
                                    { id: 'solid', icon: Minus, label: 'Sólida' },
                                    { id: 'dashed', icon: Minus, label: 'Discontinua', dash: '12, 8' },
                                    { id: 'dotted', icon: Minus, label: 'Puntos', dash: '2, 6' },
                                    { id: 'arrow', icon: ArrowUpRight, label: 'Flecha' }
                                ].map(style => (
                                    <button 
                                        key={style.id}
                                        onClick={() => onPenSettingsUpdate({ ...penSettings, style: style.id })}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${penSettings.style === style.id ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white/60'}`}
                                    >
                                        <div className="w-6 flex justify-center">
                                            {style.id === 'arrow' ? <ArrowUpRight className="w-4 h-4" /> : (
                                                <div 
                                                    className="h-0.5 w-full bg-current rounded-full" 
                                                    style={{ borderBottom: `2px ${style.id === 'solid' ? 'solid' : style.id} currentcolor`, opacity: 0.8 }} 
                                                />
                                            )}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{style.label}</span>
                                        {penSettings.style === style.id && <Check className="w-3.5 h-3.5 ml-auto opacity-40" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Thickness */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-white/40 mb-1">
                                <Maximize className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Grosor de Trazo</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'thin', val: 3, label: 'Fino' },
                                    { id: 'mid', val: 8, label: 'Normal' },
                                    { id: 'bold', val: 18, label: 'Impacto' }
                                ].map(t => (
                                    <button 
                                        key={t.id}
                                        onClick={() => onPenSettingsUpdate({ ...penSettings, thickness: t.val })}
                                        className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${penSettings.thickness === t.val ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white/60'}`}
                                    >
                                        <div className="h-6 flex items-center justify-center w-full">
                                            <div 
                                                className="bg-current rounded-full" 
                                                style={{ height: t.val > 10 ? '6px' : t.val > 4 ? '3px' : '1.5px', width: '80%' }} 
                                            />
                                        </div>
                                        <span className="text-[8px] font-bold uppercase tracking-widest">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Arrow Size */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-white/40 mb-1">
                                <MousePointer2 className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Tamaño de Flecha</span>
                            </div>
                            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                                {[
                                    { id: 's', val: 0.5, label: 'S' },
                                    { id: 'm', val: 1.0, label: 'M' },
                                    { id: 'l', val: 2.0, label: 'L' }
                                ].map(size => (
                                    <button 
                                        key={size.id}
                                        onClick={() => onPenSettingsUpdate({ ...penSettings, arrowSize: size.val })}
                                        className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${penSettings.arrowSize === size.val ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
                                    >
                                        {size.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={() => onContextMenuUpdate({ ...contextMenu, visible: false })}
                            className="w-full py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl transition-all border border-indigo-500/20 mt-1"
                        >
                            Listo
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Drawing Controls (Contextual) */}
            <AnimatePresence>
                {activeTool === 'draw' && drawings.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-6 right-6 z-[100]"
                    >
                        <button 
                            onClick={(e) => { e.stopPropagation(); onClearDrawings(); }}
                            className="group flex items-center gap-3 px-5 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/20 backdrop-blur-xl transition-all shadow-2xl"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Limpiar Lienzo</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dot Grid Pattern */}
            <div 
                className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${theme === 'dark' ? 'opacity-[0.15]' : 'opacity-[0.08]'}`} 
                style={{ 
                    backgroundImage: theme === 'dark' 
                        ? 'radial-gradient(circle, #4f46e5 0.5px, transparent 0.5px)' 
                        : 'radial-gradient(circle, #000 0.8px, transparent 0.8px)', 
                    backgroundSize: `${20 * view.scale}px ${20 * view.scale}px`, 
                    backgroundPosition: `${view.x}px ${view.y}px` 
                }} 
            />

            {/* Main Movable Layer */}
            <div 
                className="absolute top-0 left-0 w-full h-full origin-top-left" 
                style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
            >
                {/* SVG Content Layer */}
                <svg 
                    width="10000" 
                    height="5000" 
                    className={`absolute inset-0 pointer-events-none transition-colors duration-700 ${theme === 'dark' ? 'bg-[#050511]' : 'bg-white'}`}
                >
                    <defs>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="15" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity={theme === 'dark' ? '0.4' : '0.1'} />
                        </filter>
                    </defs>

                    <rect width="10000" height="5000" fill={theme === 'dark' ? '#05050B' : '#F8FAFC'} />

                    {/* Architectural Columns - Zero Overlap Layout */}
                    {STRATEGIC_COLUMNS.map((col, idx) => (
                        <g key={col.id} transform={`translate(${STRATEGIC_RAILS.COLUMNS[idx]}, 0)`}>
                            <line 
                                x1="0" y1="0" x2="0" y2="5000" 
                                stroke={theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(203,213,225,0.5)"} 
                                strokeWidth="1" 
                            />
                            
                            {/* Column Header - Premium Centered Styling */}
                            <rect 
                                x="50" y="25" 
                                width="600" height="50" 
                                rx="10" 
                                fill={theme === 'dark' ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.5)'}
                                className="backdrop-blur-md border border-white/5 shadow-sm"
                            />
                            <text 
                                x="350" y="58" 
                                textAnchor="middle" 
                                className={`text-[16px] font-black tracking-[0.4em] uppercase fill-current transition-colors duration-500 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}
                            >
                                {col.label}
                            </text>
                            
                            {/* Structural Rail - Anchor for tactical flow */}
                            <line 
                                x1="50" y1="50" x2="650" y2="50"
                                stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(99,102,241,0.1)"}
                                strokeWidth="1"
                                strokeDasharray="4 8"
                            />
                            <circle cx="50" cy="50" r="4" className="fill-indigo-500/40" />
                        </g>
                    ))}

                    {/* Freehand Drawings */}
                    {drawings.map(draw => (
                        <motion.path 
                            key={draw.id} 
                            d={draw.d} 
                            stroke={draw.color || "rgba(99, 102, 241, 0.6)"} 
                            strokeWidth={draw.thickness || "8"} 
                            fill="none" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeDasharray={draw.style === 'dashed' ? '12, 12' : draw.style === 'dotted' ? '2, 8' : 'none'}
                            markerEnd={draw.style === 'arrow' ? (draw.arrowSize > 1.5 ? 'url(#arrowhead_large)' : draw.arrowSize > 0.8 ? 'url(#arrowhead_mid)' : 'url(#arrowhead_small)') : 'none'}
                            filter="url(#glow)"
                            className={`pointer-events-auto cursor-pointer transition-all duration-300 ${activeTool === 'delete' ? 'hover:stroke-rose-500 hover:opacity-100 hover:scale-[1.02]' : 'hover:opacity-100 opacity-90'}`}
                            onClick={(e) => {
                                if (activeTool === 'delete') {
                                    e.stopPropagation();
                                    onDrawingsUpdate(prev => prev.filter(d => d.id !== draw.id));
                                }
                            }}
                        />
                    ))}
                    {currentPath && (
                        <path 
                            d={currentPath.d} 
                            stroke={currentPath.color || "rgba(99, 102, 241, 0.8)"} 
                            strokeWidth={currentPath.thickness || "8"} 
                            fill="none" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeDasharray={currentPath.style === 'dashed' ? '12, 12' : currentPath.style === 'dotted' ? '2, 8' : 'none'}
                            markerEnd={currentPath.style === 'arrow' ? (currentPath.arrowSize > 1.5 ? 'url(#arrowhead_large)' : currentPath.arrowSize > 0.8 ? 'url(#arrowhead_mid)' : 'url(#arrowhead_small)') : 'none'}
                        />
                    )}

                    {/* All connections are now manual via Tactical Ports */}

                    {edges.filter(edge => {
                        const source = nodes.find(n => n.id === edge.source);
                        const target = nodes.find(n => n.id === edge.target);
                        return source && target && !source.data?.isHidden && !target.data?.isHidden;
                    }).map(edge => {
                        const isSelected = selectedEdgeId === edge.id;
                        const path = getEdgePath(edge.source, edge.target);
                        
                        // Extract color from source node category
                        const sourceNode = nodes.find(n => n.id === edge.source);
                        const typeConfig = NODE_TYPES[sourceNode?.type] || NODE_TYPES.educativo;
                        const catConfig = NODE_CATEGORIES[typeConfig.category] || NODE_CATEGORIES.conciencia;
                        const edgeColor = sourceNode?.data?.color || catConfig.color;

                        return (
                            <g key={edge.id} className="pointer-events-auto cursor-pointer group" onClick={(e) => { 
                                e.stopPropagation(); 
                                if (activeTool === 'delete') onDeleteEdge(edge.id);
                                else onEdgeSelect(edge.id); 
                            }}>
                                {/* Click Area */}
                                <path d={path} stroke="transparent" strokeWidth="20" fill="none" />
                                
                                {/* Layer 1: Neon Halo Glow (Persistent) */}
                                <path 
                                    d={path} 
                                    stroke={edgeColor} 
                                    strokeWidth={isSelected ? 10 : 4} 
                                    strokeOpacity={isSelected ? 0.3 : 0.08}
                                    fill="none" 
                                    filter="url(#glow)"
                                />

                                {/* Layer 2: Main High-Fidelity Fiber */}
                                <motion.path 
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    d={path} 
                                    stroke={edgeColor} 
                                    strokeWidth={isSelected ? 3 : 1.5} 
                                    strokeOpacity={isSelected ? 1 : 0.8}
                                    fill="none" 
                                    className="transition-all duration-500"
                                    markerEnd={isSelected ? "url(#arrowhead_flow_active)" : "none"}
                                />

                                {/* Layer 3: Energy Flow Shimmer (Directional Awareness) */}
                                <circle r={isSelected ? "3" : "1.5"} fill={edgeColor} filter="url(#glow)">
                                    <animateMotion dur={isSelected ? "1.5s" : "3s"} repeatCount="indefinite" path={path} />
                                    <animate attributeName="opacity" values="0;1;1;0" dur={isSelected ? "1.5s" : "3s"} repeatCount="indefinite" />
                                </circle>
                            </g>
                        );
                    })}
                    {/* Preview Connection (Cinematic Neon) */}
                    {connectionStart && (
                        <g>
                            <path 
                                d={getPreviewPath()} 
                                stroke="#818cf8" 
                                strokeWidth="4" 
                                strokeOpacity="0.2"
                                fill="none" 
                                filter="url(#glow)"
                            />
                            <path 
                                d={getPreviewPath()} 
                                stroke="#818cf8" 
                                strokeWidth="1.5" 
                                strokeDasharray="8,8"
                                fill="none" 
                            >
                                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
                            </path>
                        </g>
                    )}
                </svg>

                {/* Nodes */}
                {nodes.filter(n => !n.data?.isHidden).map(node => {
                    const typeConfig = NODE_TYPES[node.type] || NODE_TYPES.educativo;
                    const catConfig = NODE_CATEGORIES[typeConfig.category];
                    const isSelected = selectedNodeId === node.id;
                    const funnelLevel = getFunnelLevel(typeConfig.category);
                    
                    const isOrphan = strategyHealth?.orphans?.some(o => o.id === node.id);
                    const metricsScore = node.data?.metricsScore || 'none'; // 'high', 'mid', 'low', 'none'
                    const inPlanner = !!node.data?.plannerStatus && node.data?.plannerStatus !== 'unassigned';
                    const crmActive = node.data?.crmActive;

                    const isSticky = node.type === 'sticky';
                    const isLabel = node.type === 'label';

                    if (isLabel) {
                        return (
                            <motion.div
                                key={node.id}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ 
                                    scale: 1, 
                                    opacity: 1,
                                    top: node.y,
                                    left: node.x
                                }}
                                onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, node.id); }}
                                className={`absolute p-2 bg-transparent border-none text-2xl font-black cursor-text select-none uppercase tracking-[0.3em] transition-colors duration-700 ${
                                    isSelected 
                                    ? (theme === 'dark' ? 'text-indigo-400 opacity-100' : 'text-indigo-600 opacity-100') 
                                    : (theme === 'dark' ? 'text-white/40' : 'text-slate-300')
                                } ${isSelected ? 'z-30' : 'z-10'}`}
                            >
                                {node.data?.title || 'TEXTO ESTRATÉGICO'}
                            </motion.div>
                        );
                    }

                    if (isSticky) {
                        return (
                            <motion.div
                                key={node.id}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ 
                                    scale: 1, 
                                    opacity: 1,
                                    top: node.y,
                                    left: node.x
                                }}
                                onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, node.id); }}
                                className={`absolute w-64 p-6 border transition-all cursor-grab group/sticky rounded-sm rotate-[-1deg] hover:rotate-0 ${
                                    theme === 'dark'
                                    ? 'bg-amber-400/90 backdrop-blur-sm border-amber-300 shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:shadow-2xl'
                                    : 'bg-amber-50 border-amber-200 shadow-md hover:shadow-xl'
                                } ${isSelected ? 'z-30 border-2 border-amber-500 scale-[1.05]' : 'z-10 hover:scale-[1.02]'}`}
                            >
                                <div className="flex flex-col gap-2">
                                    <StickyNote className={`w-5 h-5 mb-2 ${theme === 'dark' ? 'text-amber-900/50' : 'text-amber-400'}`} />
                                    <p className={`font-black text-[10px] uppercase tracking-widest leading-relaxed ${theme === 'dark' ? 'text-amber-950' : 'text-slate-800'}`}>
                                        {node.data?.title || 'NUEVA IDEA O RECORDATORIO...'}
                                    </p>
                                </div>
                                {/* Visual Tape Effect */}
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 border rotate-1 shadow-sm transition-all ${
                                    theme === 'dark' ? 'bg-white/20 backdrop-blur-sm border-white/10' : 'bg-white/60 border-slate-200'
                                }`} />
                            </motion.div>
                        );
                    }

                    // --- HIGH FIDELITY NEON PILL NODE ---
                    const nodeCategory = NODE_CATEGORIES[typeConfig?.category] || NODE_CATEGORIES.conciencia;
                    const nodeColor = node.data?.color || nodeCategory.color;
                    const nodeGlow = nodeCategory.glow || nodeColor;
                    const nodeShape = nodeCategory.shape || 'pill';
                    
                    const isAudio = (node.data?.subtype === 'v_podcast' || node.data?.type === 'audio');
                    const isVideo = (node.data?.type === 'video' && !isAudio);
                    const isImage = (node.data?.type === 'imagen');

                    // --- VISTA ESTÁNDAR (SYSTEM UPDATE CARD STYLE) ---
                    if (viewMode === 'standard') {
                        const progress = node.data?.progress || (node.data?.status === 'Listo' || node.data?.status === 'completada' ? 100 : 35);
                        const progressGradient = (node.data?.status === 'Listo' || node.data?.status === 'completada') ? 'from-emerald-500 to-teal-400' : 'from-sky-500 via-indigo-600 to-cyan-400';

                        return (
                            <motion.div
                                key={node.id}
                                animate={{ scale: 1, opacity: 1, x: node.x, y: node.y }}
                                whileHover={{ scale: 1.02, boxShadow: `0 0 60px ${nodeColor}40` }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, node.id); }}
                                className={`absolute z-30 p-[2px] rounded-[48px] overflow-visible ${isSelected ? 'z-50' : 'z-20'}`}
                            >
                                {/* Outer Glow Ring (Expert Polish) */}
                                {isSelected && (
                                    <motion.div 
                                        layoutId={`glow-${node.id}`}
                                        className="absolute inset-0 rounded-[48px] blur-3xl opacity-40 shadow-[0_0_120px_60px_rgba(99,102,241,0.25)] pointer-events-none"
                                        style={{ backgroundColor: nodeColor }}
                                    />
                                )}

                                <div className={`relative w-[360px] h-[460px] rounded-[46px] flex flex-col p-10 transition-all duration-500 border-2 ${
                                    theme === 'dark' ? 'bg-[#0A0A0F]/90 backdrop-blur-3xl border-white/10' : 'bg-white shadow-3xl border-indigo-100'
                                }`}>
                                    {/* Glass Grain Texture */}
                                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay rounded-[46px]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

                                    <div className="flex-1 flex flex-col items-center z-10">
                                        <div className="w-full flex justify-center mb-8">
                                            <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                                                <span className={`text-[11px] font-black uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-sky-400/80 shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'text-indigo-600'}`}>
                                                    VERSION 2.4.1 DISPONIBLE
                                                </span>
                                            </div>
                                        </div>

                                        <h2 className={`text-4xl font-extrabold text-center mb-3 tracking-tighter leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                            {node.data?.title || 'System Update'}
                                        </h2>
                                        
                                        <p className={`text-xl font-medium text-center opacity-60 mb-14 px-4 ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>
                                            {node.data?.objective || 'Ready to improve your strategy performance.'}
                                        </p>

                                        {/* Premium Thick Progress Section */}
                                        <div className="w-full mt-auto mb-10">
                                            <div className={`h-6 w-full rounded-2xl overflow-hidden mb-6 p-1 border-2 ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-slate-100 border-indigo-50'}`}>
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    className={`h-full rounded-xl bg-gradient-to-r ${progressGradient} shadow-[0_0_30px_rgba(99,102,241,0.5)] relative`}
                                                >
                                                    {/* Shimmer on bar (Only for selected or active nodes) */}
                                                    {isSelected && (
                                                        <motion.div 
                                                            animate={{ x: ['-100%', '100%'] }}
                                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                                        />
                                                    )}
                                                </motion.div>
                                            </div>
                                            <div className="flex justify-between items-center px-2">
                                                <span className={`text-base font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>Progress</span>
                                                <span className={`text-base font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{progress}%</span>
                                            </div>
                                        </div>

                                        {/* Large Primary Action Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.04, y: -2 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onNodeSelect(node.id); // Ensure panel opens
                                                onUpdateNode(node.id, { status: node.data?.status === 'Listo' ? 'completed' : 'ready' });
                                            }}
                                            className={`w-full h-20 rounded-[32px] text-xl font-black uppercase tracking-[0.15em] shadow-2xl transition-all border-b-4 flex items-center justify-center gap-3 ${
                                                theme === 'dark' 
                                                ? 'bg-white text-black border-slate-300 hover:bg-slate-50' 
                                                : 'bg-indigo-600 text-white border-indigo-800'
                                            }`}
                                        >
                                            {node.data?.status === 'Listo' || node.data?.status === 'completada' ? (
                                                <>
                                                    <CheckCircle2 className="w-6 h-6" />
                                                    <span>Publicar Ahora</span>
                                                </>
                                            ) : (
                                                <span>Reiniciar Nodo</span>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Connection Ports (Standard View - Dual Neon) */}
                                <div 
                                    className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-4 h-12 rounded-full z-40 cursor-alias border-2 transition-all hover:scale-125 bg-indigo-500 border-indigo-200 shadow-[0_0_30px_rgba(99,102,241,0.6)]"
                                    onMouseDown={(e) => { e.stopPropagation(); onConnectionStart(node.id); }}
                                />
                                <div 
                                    className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-4 h-12 rounded-full z-40 cursor-alias border-2 transition-all hover:scale-125 bg-indigo-500 border-indigo-200 shadow-[0_0_30px_rgba(99,102,241,0.6)]"
                                    onMouseDown={(e) => { e.stopPropagation(); onConnectionStart(node.id); }}
                                />
                            </motion.div>
                        );
                    }

                    // --- VISTA TÁCTICA (EXISTENTE) ---
                    // Shape classes
                    const shapeClasses = {
                        leaf: 'rounded-tl-[2.2rem] rounded-br-[2.2rem] rounded-tr-md rounded-bl-md',
                        pill: 'rounded-full',
                        hex: 'rounded-2xl',
                        rect: 'rounded-2xl'
                    };
                    return (
                        <motion.div
                            key={node.id}
                            x={node.x}
                            y={node.y}
                            animate={{ scale: 1, opacity: 1, x: node.x, y: node.y }}
                            whileHover={{ scale: 1.04, boxShadow: `0 0 40px ${nodeColor}50` }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, node.id); }}
                            className={`absolute flex flex-col items-center group ${isSelected ? 'z-50' : 'z-30'} ${activeTool === 'connect' ? 'cursor-alias' : 'cursor-grab active:cursor-grabbing'}`}
                        >
                            {/* Orphan Alert Badge (Integrated) */}
                            {isOrphan && (
                                <motion.div 
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="mb-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500 flex items-center gap-2 backdrop-blur-md"
                                >
                                    <AlertTriangle className="w-2.5 h-2.5 text-rose-500" />
                                    <span className="text-[7px] font-[1000] tracking-widest text-rose-500 uppercase">SIN VINCULO</span>
                                </motion.div>
                            )}

                            {/* The Node Chassis - Specialized Expert Styles */}
                            <div 
                                className={`relative h-[76px] min-w-[290px] ${shapeClasses[nodeShape]} flex items-center px-2 transition-all duration-500 border-b-4 border-r-2 overflow-hidden ${
                                    isSelected ? 'scale-105 z-50' : 'hover:scale-[1.03]'
                                } ${isAudio ? 'bg-white text-slate-900 border-indigo-100 shadow-2xl' : theme === 'dark' ? (isSelected ? 'bg-[#0A0A0F]/80 backdrop-blur-3xl' : 'bg-[#0A0A0F]/40 backdrop-blur-md') : 'bg-white shadow-2xl shadow-indigo-100/50'}`}
                                style={{ 
                                    borderColor: isSelected ? nodeColor : (isAudio ? 'rgba(99,102,241,0.1)' : theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'),
                                    boxShadow: isSelected 
                                        ? `0 0 60px ${nodeGlow}30, inset 0 0 20px ${nodeColor}20` 
                                        : theme === 'dark' ? `0 10px 40px rgba(0,0,0,0.4)` : `0 10px 30px rgba(99,102,241,0.05)`
                                }}
                            >
                                {/* Liquid Glass Shimmer (Only on Selection - Performance Fix) */}
                                {isSelected && (
                                    <motion.div 
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -z-5 -skew-x-12"
                                        animate={{ x: ['-200%', '200%'] }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                    />
                                )}

                                {/* Grain Texture Overlay (Expert Feel) */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

                                {/* Platform Icon - Creative Circle with Platform Glow */}
                                <div 
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner shrink-0 transition-all ${isAudio ? 'scale-90 bg-indigo-50 border border-indigo-100' : ''}`}
                                    style={{ 
                                        backgroundColor: isAudio ? '#EEF2FF' : nodeColor + '15', 
                                        border: isAudio ? '1px solid #E0E7FF' : `1px solid ${nodeColor}30`,
                                        boxShadow: isSelected ? `0 0 30px ${nodeColor}30` : `0 0 20px ${nodeColor}20`
                                    }}
                                >
                                    {node.data?.platform === 'instagram' && <Instagram size={24} style={{ color: nodeColor }} />}
                                    {node.data?.platform === 'facebook' && <Facebook size={24} style={{ color: nodeColor }} />}
                                    {node.data?.platform === 'youtube' && <Youtube size={24} style={{ color: nodeColor }} />}
                                    {node.data?.platform === 'tiktok' && <Globe size={24} style={{ color: nodeColor }} />}
                                    {!node.data?.platform && (
                                        isVideo ? <Video size={24} style={{ color: nodeColor }} /> : 
                                        isAudio ? <Mic size={24} style={{ color: nodeColor }} /> : 
                                        <Image size={24} style={{ color: nodeColor }} />
                                    )}
                                </div>
 
                                {/* Content Info & Visualizations */}
                                <div className="flex-1 px-5 flex flex-col justify-center overflow-hidden">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h4 className={`text-[14px] font-[1000] tracking-wider uppercase truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                            {node.data?.title || typeConfig.label}
                                        </h4>
                                    </div>
 
                                    {/* Specialized Visualization Layer */}
                                    <div className="flex items-center gap-3">
                                        {isAudio ? (
                                            /* Waveform Visualization (Advanced) */
                                            <div className="flex items-center gap-[2px] h-3 pr-4">
                                                {[0.4, 0.7, 0.5, 0.9, 0.6, 0.3, 0.8, 0.5, 0.4, 0.6, 0.4].map((h, i) => (
                                                    <motion.div 
                                                        key={i}
                                                        animate={{ height: [`${h*100}%`, `${(h*1.5)%1.0*100}%`, `${h*100}%`] }}
                                                        transition={{ duration: 0.4 + Math.random()*0.4, repeat: Infinity, ease: "easeInOut" }}
                                                        className="w-[2px] bg-indigo-500 rounded-full"
                                                    />
                                                ))}
                                                <span className="text-[9px] font-black text-indigo-400 ml-2 opacity-80">READY</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => { e.stopPropagation(); onNodeSelect(node.id); setActiveNodeMenu({ id: node.id, type: 'status' }); }}
                                                    className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                                                >
                                                    <span className={`text-[8px] font-black tracking-widest uppercase ${isAudio ? 'text-indigo-400' : theme === 'dark' ? 'text-white/60' : 'text-slate-500'}`}>
                                                        {typeConfig.category}
                                                    </span>
                                                </motion.button>
                                                <div className="w-1 h-1 rounded-full bg-current opacity-20" />
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => { e.stopPropagation(); onNodeSelect(node.id); setActiveNodeMenu({ id: node.id, type: 'platform' }); }}
                                                    className={`px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer truncate max-w-[80px]`}
                                                >
                                                    <span className={`text-[9px] font-black tracking-widest uppercase truncate ${isAudio ? 'text-indigo-400' : theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
                                                        {node.data?.subtype || 'standard'}
                                                    </span>
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>
                                </div>
 
                                {/* Trailing Action Area (Figma Style) */}
                                <div className="pr-4 flex items-center gap-3 border-l border-white/5 pl-4 h-10">
                                    {node.data?.status === 'completed' ? (
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                    ) : (
                                        <motion.button 
                                            whileHover={{ x: 3, scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onNodeSelect(node.id, 'estilo'); // Opens side panel in Style tab
                                                if (setActiveNodeMenu) setActiveNodeMenu(null); 
                                            }}
                                            className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white/80 hover:border-white/40 transition-all cursor-pointer z-50"
                                        >
                                            <ChevronRight size={14} />
                                        </motion.button>
                                    )}
                                </div>

                                {/* Ready-to-Shoot Progress Bar (Bottom Edge) */}
                                <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: node.data?.status === 'completed' ? '100%' : '35%' }}
                                        className="h-full"
                                        style={{ backgroundColor: nodeColor, boxShadow: `0 0 10px ${nodeColor}80` }}
                                    />
                                </div>

                                {/* Cinematic Interactive Connection Ports (Input/Output) */}
                                <div 
                                    className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full z-[100] cursor-alias transition-all duration-300 opacity-0 group-hover:opacity-100 border-2 bg-[#050511] hover:scale-150 active:scale-95"
                                    style={{ borderColor: nodeColor, boxShadow: `0 0 15px ${nodeColor}80` }}
                                    onMouseDown={(e) => { e.stopPropagation(); onConnectionStart(node.id); }}
                                />
                                <div 
                                    className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full z-[100] cursor-alias transition-all duration-300 opacity-0 group-hover:opacity-100 border-2 bg-[#050511] hover:scale-150 active:scale-95"
                                    style={{ borderColor: nodeColor, boxShadow: `0 0 15px ${nodeColor}80` }}
                                    onMouseDown={(e) => { e.stopPropagation(); onConnectionStart(node.id); }}
                                />

                                {/* Stack Effect for Carousel */}
                                {isImage && (
                                    <>
                                        <div className="absolute inset-0 -z-10 translate-x-1 translate-y-1 rounded-full border border-white/5 bg-black/20" />
                                        <div className="absolute inset-0 -z-20 translate-x-2 translate-y-2 rounded-full border border-white/5 bg-black/10" />
                                    </>
                                )}
                            </div>

                            {/* Node Interaction HUD Popover */}
                            <AnimatePresence>
                                {activeNodeMenu?.id === node.id && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                                        className={`absolute -bottom-4 translate-y-full left-1/2 -translate-x-1/2 z-50 p-4 border rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-3xl min-w-[280px] ${
                                            theme === 'dark' ? 'bg-black/95 border-white/10' : 'bg-white/95 border-slate-200'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex flex-col gap-5">
                                            <div className="flex items-center justify-between px-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10">
                                                        <PenTool size={14} className="text-indigo-400" />
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Node Master Control</span>
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); onDeleteNode(node.id); }} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-xl transition-colors group">
                                                    <Trash2 className="w-4 h-4 group-hover:scale-110" />
                                                </button>
                                            </div>

                                            {/* Status Grid */}
                                            <div className="grid grid-cols-4 gap-2">
                                                {Object.entries(NODE_STATUS).map(([statusId, s]) => (
                                                    <button
                                                        key={statusId}
                                                        onClick={() => onUpdateNode(node.id, { status: statusId })}
                                                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                                                            node.data?.status === statusId 
                                                            ? 'bg-indigo-500 border-indigo-400 text-white shadow-xl shadow-indigo-500/20' 
                                                            : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'
                                                        }`}
                                                    >
                                                        {React.createElement(s.icon || Check, { size: 16 })}
                                                        <span className="text-[7px] font-black uppercase tracking-widest">{s.label}</span>
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Color Palette Area */}
                                            <div className="flex items-center justify-center gap-3 py-2 border-t border-white/5">
                                                {['#22d3ee', '#10b981', '#f59e0b', '#f43f5e', '#a855f7', '#ffffff'].map(c => (
                                                    <button 
                                                        key={c}
                                                        onClick={() => onUpdateNode(node.id, { color: c })}
                                                        className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center ${
                                                            nodeColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'
                                                        }`}
                                                        style={{ backgroundColor: c }}
                                                    >
                                                        {nodeColor === c && <Check size={12} className={c === '#ffffff' ? 'text-black' : 'text-white'} />}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            <button 
                                                onClick={() => setActiveNodeMenu(null)}
                                                className={`w-full py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all ${
                                                    theme === 'dark' ? 'bg-white text-black hover:bg-gray-100' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                }`}
                                            >
                                                Synchronize Node
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* --- MANUAL CONNECTION PORTS (RHOMBUS DESIGN) --- */}
                            {/* Input Port (Left Extreme) */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ 
                                    opacity: activeTool === 'connect' ? 1 : (isSelected ? 0.7 : 0),
                                    scale: activeTool === 'connect' ? 1 : 0.8,
                                    x: -8
                                }}
                                className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 z-[60] ${activeTool === 'connect' ? 'cursor-alias' : 'pointer-events-none'} border flex items-center justify-center transition-all group/port-in`}
                                style={{ 
                                    backgroundColor: '#050511',
                                    borderColor: nodeColor,
                                    boxShadow: `0 0 15px ${nodeColor}50`
                                }}
                                onMouseDown={(e) => { 
                                    if (activeTool !== 'connect') return;
                                    e.stopPropagation(); 
                                    onConnectionStart(node.id); 
                                }}
                            >
                                <div className="absolute inset-1 bg-white opacity-20" />
                                <div className="text-[7px] font-black uppercase text-white tracking-[0.1em] hidden group-hover/port-in:block absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-0.5 rounded border border-white/10 -rotate-45 font-mono">IN</div>
                            </motion.div>

                            {/* Output Port (Right Extreme) */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ 
                                    opacity: activeTool === 'connect' ? 1 : (isSelected ? 0.7 : 0),
                                    scale: activeTool === 'connect' ? 1 : 0.8,
                                    x: 8
                                }}
                                className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 z-[60] ${activeTool === 'connect' ? 'cursor-alias' : 'pointer-events-none'} border flex items-center justify-center transition-all group/port-out`}
                                style={{ 
                                    backgroundColor: '#050511',
                                    borderColor: nodeColor,
                                    boxShadow: `0 0 15px ${nodeColor}50`
                                }}
                                onMouseDown={(e) => { 
                                    if (activeTool !== 'connect') return;
                                    e.stopPropagation(); 
                                    onConnectionStart(node.id); 
                                }}
                            >
                                <div className="absolute inset-1 bg-white opacity-20" />
                                <div className="text-[7px] font-black uppercase text-white tracking-[0.1em] hidden group-hover/port-out:block absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-0.5 rounded border border-white/10 -rotate-45 font-mono">OUT</div>
                            </motion.div>

                        </motion.div>
                    );
                })}
            </div>
            {/* Global Operative Selection HUD Removed by User Request */}

        </div>
    );
}



