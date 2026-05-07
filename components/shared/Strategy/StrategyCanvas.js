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
    RotateCcw, ChevronUp, ChevronLeft, CalendarDays, ShieldCheck, Video, Mail, Workflow, Repeat, Bot
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
    onToolChange,
    isCompactMode = false,
    theme = 'dark',
    activeCampaign = null
}) {

    const canvasRef = useRef(null);
    const [dragState, setDragState] = useState({ isDragging: false, startX: 0, startY: 0, originX: 0, originY: 0, targetId: null });
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectStartNodeId, setConnectStartNodeId] = useState(null);
    const [activeNodeMenu, setActiveNodeMenu] = useState(null); // { id: nodeId, type: 'status' | 'platform' | 'stage' }
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [currentPath, setCurrentPath] = useState(null);
    
    // Neural Tree State - Manageable positions for Hubs
    const [hubPositions, setHubPositions] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`diic_strategy_hub_pos_${activeCampaign?.id || 'default'}`);
            if (saved) return JSON.parse(saved);
        }
        return {
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
        };
    });

    // Handle initial loading from campaign if storage is empty
    useEffect(() => {
        if (activeCampaign?.id) {
             const saved = localStorage.getItem(`diic_strategy_hub_pos_${activeCampaign.id}`);
             if (saved) setHubPositions(JSON.parse(saved));
        }
    }, [activeCampaign?.id]);

    // Persist Hub Positions on Change
    useEffect(() => {
        if (typeof window !== 'undefined' && activeCampaign?.id) {
            localStorage.setItem(`diic_strategy_hub_pos_${activeCampaign.id}`, JSON.stringify(hubPositions));
        }
    }, [hubPositions, activeCampaign?.id]);

    // --- MAGIC WAND (AUTO-LAYOUT) TRIGGER ---
    useEffect(() => {
        if (activeTool === 'organize') {
            // 1. Reset Hubs to defaults
            setHubPositions(DEFAULT_HUB_POSITIONS);

            // 2. Align Tactical Nodes to their Strategic Columns
            const getColIdx = (cat) => {
                const c = (cat || '').toLowerCase();
                if (c === 'conciencia' || c === 'video') return 0;
                if (c === 'interés' || c === 'conexión') return 1;
                if (c === 'consideración' || c === 'autoridad' || c === 'imagen') return 2;
                if (c === 'conversión' || c === 'crm') return 3;
                if (c === 'retención' || c === 'recurso') return 4;
                return 0;
            };

            const updatedNodes = nodes.map(node => {
                if (node.id.startsWith('hu_') || node.type === 'estrategia') return node;
                const typeConfig = NODE_TYPES[node.type] || NODE_TYPES.educativo;
                const colIdx = getColIdx(node.data?.funnelLevel || typeConfig.category);
                const colX = STRATEGIC_RAILS.COLUMNS[colIdx] + 50; 
                return { ...node, x: colX };
            });

            // Trigger node updates
            updatedNodes.forEach(node => onNodeMove(node.id, node.x, node.y));

            // --- ZOOM TO FIT LOGIC ---
            // Calculate bounding box of all updated nodes and hubs
            const allPositions = [
                ...updatedNodes.map(n => ({ x: n.x, y: n.y })),
                ...Object.values(DEFAULT_HUB_POSITIONS)
            ];

            if (allPositions.length > 0) {
                const minX = Math.min(...allPositions.map(p => p.x));
                const maxX = Math.max(...allPositions.map(p => p.x)) + 300; // Add card width
                const minY = Math.min(...allPositions.map(p => p.y));
                const maxY = Math.max(...allPositions.map(p => p.y)) + 150; // Add card height

                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;
                
                // Calculate scale to fit (with some padding)
                const boardWidth = 2000; // Expected visible width
                const boardHeight = 1000; // Expected visible height
                const contentWidth = maxX - minX;
                const contentHeight = maxY - minY;
                
                const scaleX = boardWidth / contentWidth;
                const scaleY = boardHeight / contentHeight;
                const newScale = Math.min(Math.max(Math.min(scaleX, scaleY) * 0.8, 0.3), 1.0);

                // Center the transformation
                onViewChange({
                    x: (window.innerWidth / 2) - (centerX * newScale),
                    y: (window.innerHeight / 2) - (centerY * newScale),
                    scale: newScale
                });
            }
            
            setTimeout(() => {
                if (onToolChange) onToolChange('select');
            }, 1000);
        }
    }, [activeTool, onToolChange, nodes, onNodeMove]);

    const hubHierarchy = {
        'root': ['l2_creativa', 'l2_crm', 'l2_conversion'],
        'l2_creativa': ['hub_videos', 'hub_posts', 'hub_stories', 'hub_reels', 'hub_tiktok'],
        'l2_crm': ['hub_crm'],
        'l2_conversion': ['hub_forms']
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
         { id: 'l2_creativa', label: 'ZONA CREATIVA', parent: 'root', color: '#6366f1', icon: PenTool },
         { id: 'l2_crm', label: 'AUTOMATIZACIÓN CRM', parent: 'root', color: '#10b981', icon: Workflow },
         { id: 'l2_conversion', label: 'CONVERSIONES', parent: 'root', color: '#f43f5e', icon: Target }
     ];
 
     const l3Hubs = []; // Flattened into architecture components
 
     const hubs = [
         { parent: 'l2_creativa', lane: 'v_youtube', id: 'hub_videos', label: 'VIDEOS', color: '#f43f5e', icon: Video },
         { parent: 'l2_creativa', lane: 'i_post', id: 'hub_posts', label: 'POSTS', color: '#818cf8', icon: Box },
         { parent: 'l2_creativa', lane: 'i_historias', id: 'hub_stories', label: 'STORIES', color: '#f97316', icon: Instagram },
         { parent: 'l2_creativa', lane: 'v_reels', id: 'hub_reels', label: 'REELS', color: '#10b981', icon: PlayCircle },
         { parent: 'l2_creativa', lane: 'v_tiktok', id: 'hub_tiktok', label: 'TIK TOK', color: '#22d3ee', icon: Video },
         { parent: 'l2_crm', lane: 'l3_crm_email', id: 'hub_crm', label: 'FLUJOS CRM', color: '#10b981', icon: Bot },
         { parent: 'l2_conversion', lane: 'r_form', id: 'hub_forms', label: 'FORMS', color: '#22d3ee', icon: Target },
     ];

    const DEFAULT_HUB_POSITIONS = {
        'root': { x: 100, y: 1500 },
        'l2_creativa': { x: 500, y: 1000 },
        'l2_crm': { x: 500, y: 2400 },
        'l2_conversion': { x: 500, y: 3200 },
        'hub_videos': { x: 1000, y: 300 },
        'hub_posts': { x: 1000, y: 650 },
        'hub_stories': { x: 1000, y: 1000 },
        'hub_reels': { x: 1000, y: 1350 },
        'hub_tiktok': { x: 1000, y: 1700 },
        'hub_crm': { x: 1000, y: 2400 },
        'hub_forms': { x: 1000, y: 3200 }
    };

    // Shared Drag Handler for Neural Hubs
    const handleHubDrag = (id, delta) => {
        setHubPositions(prev => {
            const latestParentPos = prev[id];
            if (!latestParentPos) return prev;

            const dx = delta.x;
            const dy = delta.y;

            const newPositions = { ...prev, [id]: { x: latestParentPos.x + dx, y: latestParentPos.y + dy } };
            
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
            moveChildren(id);
            return newPositions;
        });
    };

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

    // Neural Bezier routing for a fluid, organic look
    const getEdgePath = (sourceId, targetId) => {
        const source = nodes.find(n => n.id === sourceId);
        const target = nodes.find(n => n.id === targetId);
        if (!source || !target) return '';

        const startX = source.x + 290; // End of tactical chassis
        const startY = source.y + 38;  // Vertical center
        const endX = target.x;
        const endY = target.y + 38;

        return getBezier(startX, startY, endX, endY);
    };

    // Dynamic node counting for Ingredient Hubs
    const hubCounts = React.useMemo(() => {
        const counts = {};
        
        // 1. Initialize with Strategic Targets (from Architecture Wizard)
        if (activeCampaign?.strategyIngredients) {
            const si = activeCampaign.strategyIngredients;
            const mapping = {
                'video': 'hub_videos', 
                'reel': 'hub_reels',
                'tiktok': 'hub_tiktok',
                'imagen': 'hub_posts',
                'historia': 'hub_stories',
                'carrusel': 'hub_posts',
                'crm': 'hub_crm',
                'form': 'hub_forms'
            };
            Object.entries(si).forEach(([key, val]) => {
                const hubId = mapping[key];
                if (hubId) counts[hubId] = val;
            });
        }

        // 2. Count actual nodes (Tactical reality)
        nodes.forEach(node => {
            const laneId = getNodeLaneId(node);
            if (laneId) {
                // Find which hub handles this lane
                const hub = hubs.find(h => h.id === laneId || h.lane === laneId);
                if (hub) {
                    counts[hub.id] = (counts[hub.id] || 0) + 1;
                }
            }
        });

        return counts;
    }, [nodes, activeCampaign?.strategyIngredients]);

    // --- NEURAL AUTO-PRUNING LOGIC ---
    const activeHubs = React.useMemo(() => {
        const activeSet = new Set(['root']); // Master Root is always active

        // Helper: Check if a hub ID is considered active based on node count
        const isTacticalActive = (id) => {
            return counts[id] > 0;
        };

        // Recursive: A hub is active if it has nodes OR any active child hub
        const checkHubActivity = (hubId) => {
            // If it's a leaf tactical hub, check counts
            if (hubs.some(h => h.id === hubId)) {
                if (isTacticalActive(hubId)) {
                    activeSet.add(hubId);
                    return true;
                }
                return false;
            }

            // If it's an L2/L3 hub, check children
            const children = hubHierarchy[hubId] || [];
            let hasActiveChild = false;
            
            children.forEach(childId => {
                if (checkHubActivity(childId)) {
                    hasActiveChild = true;
                    activeSet.add(childId);
                }
            });

            if (hasActiveChild) {
                activeSet.add(hubId);
                return true;
            }
            return false;
        };

        // Initialize recursion from Root's immediate children
        (hubHierarchy['root'] || []).forEach(childId => {
            checkHubActivity(childId);
        });

        return activeSet;
    }, [nodes, hubCounts]);

    // --- NEURAL ROOT ARCHITECTURE HELPERS ---
    const getBezier = (x1, y1, x2, y2) => {
        const dx = (x2 - x1);
        // Clamp control points to be between x1 and x2 to prevent overshoot/loops
        const cp1x = x1 + dx * 0.4;
        const cp2x = x1 + dx * 0.6; 
        return `M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`;
    };

    const renderRootEdges = () => {
        const edges = [];
        Object.entries(hubHierarchy).forEach(([parent, children]) => {
            // Only process if parent is active
            if (!activeHubs.has(parent)) return;

            const pPos = hubPositions[parent];
            if (!pPos) return;

            children.forEach(child => {
                // Only process if child is active
                if (!activeHubs.has(child)) return;

                const cPos = hubPositions[child];
                if (!cPos) return;

                const hubData = [...l2Hubs, ...l3Hubs, ...hubs].find(h => h.id === child);
                const color = hubData?.color || '#6366f1';
                
                // Offset logic for Ingredient Cards (160x100)
                const isParentCard = hubs.some(h => h.id === parent);
                const isChildCard = hubs.some(h => h.id === child);
                
                const startX = isParentCard ? pPos.x + 80 : pPos.x;
                const endX = isChildCard ? cPos.x - 80 : cPos.x;

                const path = getBezier(startX, pPos.y, endX, cPos.y);
                const isLight = theme === 'light';

                edges.push(
                    <g key={`root-edge-${parent}-${child}`}>
                        {/* Glow Layer */}
                        <motion.path 
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: isLight ? 0.35 : 0.15 }}
                            d={path} 
                            stroke={color} 
                            strokeWidth={isLight ? "4" : "8"} 
                            fill="none" 
                            filter={isLight ? "" : "url(#glow)"}
                        />
                        {/* Solid Core */}
                        <motion.path 
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: isLight ? 0.7 : 0.4 }}
                            d={path} 
                            stroke={color} 
                            strokeWidth={isLight ? "2.5" : "2"} 
                            fill="none" 
                        />
                        {/* Energy Pulse */}
                        <motion.circle r={isLight ? "4" : "3"} fill={color} filter={isLight ? "" : "url(#glow)"}>
                             <animateMotion dur="3s" repeatCount="indefinite" path={path} />
                             <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" />
                        </motion.circle>
                    </g>
                );
            });
        });
        return edges;
    };

    const renderNodeToHubEdges = () => {
        const connections = [];
        const hubUsage = {}; // Map to track how many nodes are connected to each hub for fanned offsets

        nodes.forEach(node => {
            if (node.data?.isHidden) return;
            const laneId = getNodeLaneId(node);
            if (!laneId) return;

            const hub = hubs.find(h => h.id === laneId || h.lane === laneId);
            const l3Hub = l3Hubs.find(h => h.id === laneId || h.lane === laneId);
            
            const targetId = hub?.id || l3Hub?.id;
            const targetPos = hubPositions[targetId];

            if (targetPos) {
                // Initialize usage counter for this hub
                if (!hubUsage[targetId]) hubUsage[targetId] = 0;
                const nodeIdx = hubUsage[targetId]++;

                // Calculate a vertical offset on the Hub to avoid "The Ladder" look
                // This creates a "Neural Fanning" effect where each fiber has its own origin
                const verticalFanOffset = (nodeIdx * 8) - 20; 

                // Offset to the right side of the hub
                const isCard = hubs.some(h => h.id === targetId);
                const startX = isCard ? targetPos.x + 80 : targetPos.x;
                const startY = targetPos.y + verticalFanOffset;
                
                // End exactly at the tactical card left edge (x) and vertical center (y+38)
                const endX = node.x;
                const endY = node.y + 38;

                // POSITION GUARD: Only render if the hub is reasonably to the left 
                // of the node to avoid "backwards" messy lines in same-column overlaps.
                if (startX > endX - 100) return;

                const path = getBezier(startX, startY, endX, endY);
                const color = hub?.color || l3Hub?.color || '#6366f1';
                
                connections.push(
                    <g key={`node-hub-edge-${node.id}`} className="neural-fiber">
                        <path 
                            d={path} 
                            stroke={color} 
                            strokeWidth="1.2" 
                            strokeOpacity="0.08" 
                            fill="none" 
                            className="transition-all duration-1000"
                        />
                         <motion.circle r="1.5" fill={color} opacity="0.4">
                              <animateMotion dur={`${3 + (nodeIdx % 2)}s`} repeatCount="indefinite" path={path} />
                         </motion.circle>
                    </g>
                );
            }
        });
        return connections;
    };

    const renderIngredientCard = (id, pos, hubData) => {
        const isRoot = id === 'root';
        const color = hubData?.color || (isRoot ? '#818cf8' : '#6366f1');
        const label = isRoot ? 'ESTRATEGIA MAESTRA' : hubData?.label;
        const count = hubCounts[hubData?.lane || id] || 0;
        const Icon = hubData?.icon || (isRoot ? BrainCircuit : Box);

        // Adjust position to center the card on the hub point
        const cardWidth = 160;
        const cardHeight = 100;

        return (
            <motion.g 
                key={`hub-point-${id}`} 
                initial={false}
                animate={{ x: pos.x - cardWidth/2, y: pos.y - cardHeight/2 }}
                drag
                dragMomentum={false}
                onDrag={(e, info) => handleHubDrag(id, info.delta)}
                className="cursor-grab active:cursor-grabbing group/hub pointer-events-auto"
            >
                {/* Glass Background with Glow */}
                    <rect 
                        width={cardWidth} 
                        height={cardHeight} 
                        rx="12" 
                        fill={theme === 'dark' ? "rgba(10, 10, 15, 0.95)" : "rgba(255, 255, 255, 0.98)"} 
                        stroke={color} 
                        strokeWidth="1.5" 
                        strokeOpacity={theme === 'dark' ? "0.4" : "0.6"}
                        filter={theme === 'dark' ? "url(#glow)" : "none"}
                        className={theme === 'light' ? 'shadow-lg' : ''}
                    />
                    
                    {/* Header Section */}
                    <g transform="translate(15, 15)">
                        <Icon size={14} style={{ color: theme === 'dark' ? color : color }} />
                        <text x="20" y="11" fill={theme === 'dark' ? "white" : "black"} className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80" style={{ fill: theme === 'dark' ? 'white' : '#1e293b' }}>
                            {label}
                        </text>
                    </g>

                    {/* Sub-container for the Number */}
                    <rect 
                        x="15" 
                        y="40" 
                        width={cardWidth - 30} 
                        height="45" 
                        rx="8" 
                        fill={theme === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"} 
                        stroke={color} 
                        strokeWidth="1" 
                        strokeOpacity="0.1" 
                    />
                    
                    {/* Central Value (Count) */}
                    <text 
                        x={cardWidth / 2} 
                        y="72" 
                        textAnchor="middle" 
                        fill={theme === 'dark' ? "white" : "#0f172a"} 
                        className="text-2xl font-black tracking-tighter"
                    >
                        {count}
                    </text>

                {/* Status Indicator / Connection point glow */}
                <circle 
                    cx={cardWidth - 5} 
                    cy={cardHeight / 2} 
                    r="3" 
                    fill={color} 
                    filter="url(#glow)" 
                />
            </motion.g>
        );
    };

    const renderRootArchitecture = () => {
        return (
            <g className="root-architecture">
                {renderRootEdges()}
                {renderNodeToHubEdges()}

                {/* Rendering Hubs Points */}
                {Object.entries(hubPositions).map(([id, pos]) => {
                    // Filter out inactive hubs
                    if (!activeHubs.has(id)) return null;

                    const hubData = [...l2Hubs, ...l3Hubs, ...hubs].find(h => h.id === id);
                    const isTacticalHub = hubs.some(h => h.id === id);
                    const isRoot = id === 'root';
                    const color = hubData?.color || (isRoot ? '#818cf8' : '#6366f1');
                    const label = isRoot ? 'ESTRATEGIA MAESTRA' : hubData?.label;

                    if (isTacticalHub) {
                        return renderIngredientCard(id, pos, hubData);
                    }

                    return (
                        <motion.g 
                            key={`hub-point-${id}`} 
                            initial={false}
                            animate={{ x: pos.x, y: pos.y }}
                            drag
                            dragMomentum={false}
                            onDrag={(e, info) => handleHubDrag(id, info.delta)}
                            className="cursor-grab active:cursor-grabbing group/hub pointer-events-auto"
                        >
                            {isRoot ? (
                                <g>
                                    <circle r="60" fill={color} fillOpacity="0.05" filter="url(#glow)" />
                                    <circle r="15" fill={color} fillOpacity={theme === 'dark' ? "0.8" : "1"} />
                                    <rect x="-120" y="35" width="240" height="46" rx="23" fill={theme === 'dark' ? "#0A0A0F" : "#FFFFFF"} stroke={color} strokeWidth="1.5" strokeOpacity={theme === 'dark' ? "0.4" : "0.6"} className={theme === 'light' ? 'shadow-xl' : ''} />
                                    <text y="62" textAnchor="middle" fill={theme === 'dark' ? "white" : "#0f172a"} className="text-[11px] font-black uppercase tracking-[0.4em]">
                                        {activeCampaign?.name || label}
                                    </text>
                                    <BrainCircuit x="-15" y="-15" size={30} className="text-white" />
                                </g>
                            ) : (
                                <g>
                                    <circle r="20" fill="#0A0A0F" stroke={color} strokeWidth="2" strokeOpacity="0.4" />
                                    <circle r="7" fill={color} filter="url(#glow)" />
                                    {/* Label tooltip or static label if important */}
                                    <text 
                                        y="-30" 
                                        textAnchor="middle" 
                                        fill={color} 
                                        className="text-[10px] font-black uppercase tracking-widest opacity-80"
                                    >
                                        {label}
                                    </text>
                                </g>
                            )}
                        </motion.g>
                    );
                })}
            </g>
        );
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
            className={`flex-1 overflow-hidden relative transition-colors duration-700 outline-none ${theme === 'dark' ? 'bg-[#050511]' : 'bg-[#F1F5F9]'} ${cursorClass}`}
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
                        className={`fixed z-[300] w-64 p-4 backdrop-blur-2xl border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-5 ${
                            theme === 'dark' ? 'bg-[#0a0a0f]/90 border-white/10' : 'bg-white border-slate-200'
                        }`}
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Colors */}
                        <div className="space-y-3">
                            <div className={`flex items-center gap-2 mb-1 ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>
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
                            <div className={`flex items-center gap-2 mb-1 ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>
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
                            <div className={`flex items-center gap-2 mb-1 ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>
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

                    {/* NEURAL TREE ROOT ARCHITECTURE LAYER */}
                    {renderRootArchitecture()}

                    {/* Architectural Columns - Clean Modern Labels */}
                    {STRATEGIC_COLUMNS.map((col, idx) => (
                        <g key={col.id} transform={`translate(${STRATEGIC_RAILS.COLUMNS[idx]}, 0)`}>
                            {/* Simplified Header - Minimalist Style */}
                            <text 
                                x="350" y="58" 
                                textAnchor="middle" 
                                className={`text-[16px] font-black tracking-[0.4em] uppercase fill-current transition-colors duration-500 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}
                            >
                                {col.label}
                            </text>
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

                    {/* Manual connections disabled as per user request to eliminate broken/dangling lines */}
                    {/* The strategy flow is now solely represented by high-fidelity neural fibers */}

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
                                    theme === 'dark' ? 'bg-[#0A0A0F]/90 backdrop-blur-3xl border-white/10' : 'bg-white shadow-2xl border-indigo-200'
                                }`}>
                                    {/* Glass Grain Texture */}
                                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay rounded-[46px]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

                                    <div className="flex-1 flex flex-col items-center z-10">
                                        <div className="w-full flex justify-center mb-8">
                                            <div className={`px-5 py-2 rounded-full border backdrop-blur-xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-indigo-50 border-indigo-100'}`}>
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
                    // --- VISTA TÁCTICA (UNIFICADA - ESTILO DASHBOARD PREMIUM) ---
                    const progress = node.data?.status === 'completed' ? 100 : 35;
                    
                    return (
                        <motion.div
                            key={node.id}
                            animate={{ scale: 1, opacity: 1, x: node.x, y: node.y }}
                            whileHover={{ scale: 1.04, boxShadow: `0 0 50px ${nodeColor}40` }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, node.id); }}
                            className={`absolute flex flex-col items-center group ${isSelected ? 'z-50' : 'z-30'} ${activeTool === 'connect' ? 'cursor-alias' : 'cursor-grab active:cursor-grabbing'}`}
                        >
                            {/* Orphan Alert Badge */}
                            {isOrphan && (
                                <motion.div 
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="mb-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500 flex items-center gap-2 backdrop-blur-md"
                                >
                                    <AlertTriangle className="w-2.5 h-2.5 text-rose-500" />
                                    <span className="text-[7px] font-[1000] tracking-widest text-rose-500 uppercase">DESCONECTADO</span>
                                </motion.div>
                            )}

                            {/* The Node Chassis - Rediseñado Estilo Hub (180x180) */}
                            <div 
                                className={`relative w-[180px] h-[180px] rounded-[24px] flex flex-col p-4 transition-all duration-500 border-2 overflow-hidden shadow-2xl ${
                                    theme === 'dark' ? 'bg-[#0A0A0F]/95 backdrop-blur-3xl border-transparent' : 'bg-white border-slate-200'
                                }`}
                                style={{ 
                                    borderColor: isSelected ? nodeColor : (theme === 'dark' ? `${nodeColor}40` : 'rgba(15, 23, 42, 0.1)'),
                                    boxShadow: isSelected 
                                        ? `0 0 60px ${nodeColor}40, inset 0 0 20px ${nodeColor}10` 
                                        : theme === 'dark' ? `0 10px 40px rgba(0,0,0,0.5)` : `0 10px 30px rgba(0,0,0,0.05)`
                                }}
                            >
                                {/* Inner Shimmer Glow (Consistent with Hub) */}
                                {isSelected && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 pointer-events-none"
                                        style={{ background: `radial-gradient(circle at 50% 0%, ${nodeColor}15, transparent 70%)` }}
                                    />
                                )}

                                {/* Glow superior sutil */}
                                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: nodeColor, opacity: isSelected ? 0.8 : 0.2 }} />

                                {/* Header: Icon + Category/Platform */}
                                <div className="flex items-center gap-2 mb-3 z-10">
                                    <div 
                                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: nodeColor + '20', border: `1px solid ${nodeColor}40` }}
                                    >
                                        {node.data?.platform === 'instagram' && <Instagram size={12} style={{ color: nodeColor }} />}
                                        {node.data?.platform === 'facebook' && <Facebook size={12} style={{ color: nodeColor }} />}
                                        {node.data?.platform === 'youtube' && <Youtube size={12} style={{ color: nodeColor }} />}
                                        {node.data?.platform === 'tiktok' && <Globe size={12} style={{ color: nodeColor }} />}
                                        {!node.data?.platform && (
                                            isVideo ? <Video size={12} style={{ color: nodeColor }} /> : 
                                            isAudio ? <Mic size={12} style={{ color: nodeColor }} /> : 
                                            <Image size={12} style={{ color: nodeColor }} />
                                        )}
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-[0.25em] opacity-40" style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                                        {node.data?.platform || typeConfig.label}
                                    </span>
                                </div>

                                {/* Title: Uppercase Black (Consistent with StrategyMindMap) */}
                                <h4 className={`text-[10px] font-[1000] tracking-[0.2em] uppercase leading-tight mb-3 truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    {node.data?.title || 'Contenido Maestro'}
                                </h4>

                                {/* CENTRAL VALUE BOX (Para Miniatura/Contenido) */}
                                <div 
                                    className={`flex-1 w-full rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden group/thumb ${
                                        theme === 'dark' ? 'bg-white/[0.03]' : 'bg-slate-50'
                                    }`}
                                    style={{ borderColor: `${nodeColor}15` }}
                                >
                                    {/* Miniatura Placeolder (Similar al estilo de los Hubs) */}
                                    <div className="absolute inset-0 opacity-[0.05] group-hover/thumb:opacity-[0.1] transition-opacity flex items-center justify-center">
                                        {isVideo ? <Film size={64} /> : <Box size={64} />}
                                    </div>

                                    {/* Contenido Visual (Si existe) */}
                                    {node.data?.thumbnail ? (
                                        <img src={node.data.thumbnail} className="w-full h-full object-cover z-10" alt="content" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 z-10">
                                            <span className="text-[18px] font-black tracking-tighter" style={{ color: nodeColor }}>
                                                {progress}%
                                            </span>
                                        </div>
                                    )}

                                    {/* Action Button Overlay */}
                                    <motion.button 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onNodeSelect(node.id); 
                                        }}
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity z-20 bg-black/20 backdrop-blur-[2px]"
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-200 text-indigo-600 shadow-md'}`}>
                                            <ChevronRight size={14} />
                                        </div>
                                    </motion.button>
                                </div>

                                {/* Footer: Metadata & Status (Status Dot like Hub) */}
                                <div className="flex items-center justify-between mt-3 px-1 z-10">
                                    <span className="text-[7px] font-black tracking-[0.3em] uppercase opacity-40 italic" style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                                        {node.data?.status || 'Active'}
                                    </span>
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5 shadow-sm">
                                        <div className={`w-1.5 h-1.5 rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-400'}`} style={{ boxShadow: `0 0 8px ${progress === 100 ? '#10b981' : '#6366f1'}` }} />
                                        <span className={`text-[8px] font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{progress}%</span>
                                    </div>
                                </div>

                                {/* Progress Bar Glow (Bottom) */}
                                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full"
                                        style={{ 
                                            backgroundColor: nodeColor, 
                                            boxShadow: isSelected ? `0 0 10px ${nodeColor}` : 'none' 
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Node Interaction HUD Popover */}
                            <AnimatePresence>
                                {activeNodeMenu?.id === node.id && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                                        className={`absolute -bottom-4 translate-y-full left-1/2 -translate-x-1/2 z-50 p-4 border rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] backdrop-blur-3xl min-w-[280px] ${
                                            theme === 'dark' ? 'bg-black/95 border-white/10' : 'bg-white border-slate-200'
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
                                                            : (theme === 'dark' ? 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100')
                                                        }`}
                                                    >
                                                        {React.createElement(s.icon || Check, { size: 16 })}
                                                        <span className="text-[7px] font-black uppercase tracking-widest">{s.label}</span>
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Color Palette Area */}
                                            <div className={`flex items-center justify-center gap-3 py-2 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
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



