'use client';

import React, { useState, useCallback, useEffect } from 'react';
import AutomationTopBar from './AutomationTopBar';
import AutomationCanvas from './AutomationCanvas';
import AutomationProperties from './AutomationProperties';
import { AUTO_NODE_TYPES } from './AutomationConstants';
import { Plus, Minus, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { PRESET_FLOWS } from './AutomationConstants';

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function AutomationBoard({ onBack, initialFlow }) {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    useEffect(() => {
        if (initialFlow && PRESET_FLOWS[initialFlow.title]) {
            const preset = PRESET_FLOWS[initialFlow.title];
            setNodes(preset.nodes);
            setEdges(preset.edges);
        } else {
            setNodes([]);
            setEdges([]);
        }
    }, [initialFlow]);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState(null);
    const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
    const [activeTool, setActiveTool] = useState('select'); // 'select', 'create', 'connect'
    const [connectionStart, setConnectionStart] = useState(null);
    const [expandedGroups, setExpandedGroups] = useState(['flows', 'data']);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleGroup = (group) => {
        setExpandedGroups(prev => 
            prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
        );
    };

    const GROUPS = [
        { 
            id: 'flows', 
            label: 'Automation Flows', 
            types: ['trigger_whatsapp', 'trigger_lead', 'msg_auto', 'bot_ai', 'question_options'] 
        },
        { 
            id: 'data', 
            label: 'Data Management', 
            types: ['action_crm'] 
        },
        {
            id: 'integrations',
            label: 'External Tools',
            types: ['ext_slack', 'ext_discord', 'ext_gmail', 'ext_airtable', 'ext_github']
        }
    ];

    // Navigation Handlers
    const handleZoomIn = useCallback(() => {
        setView(prev => ({ ...prev, scale: Math.min(prev.scale + 0.1, 3) }));
    }, []);

    const handleZoomOut = useCallback(() => {
        setView(prev => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.1) }));
    }, []);

    const handleZoomReset = useCallback(() => {
        setView(prev => ({ ...prev, scale: 1, x: 0, y: 0 }));
    }, []);

    const handlePan = useCallback((dx, dy) => {
        setView(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Zoom with + / - (Allow Ctrl for standard browser feel)
            if (e.key === '+' || e.key === '=') {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    handleZoomIn();
                }
            } else if (e.key === '-') {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    handleZoomOut();
                }
            } else if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleZoomReset();
            }
            // Pan with Arrows
            else if (e.key === 'ArrowUp') {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    handlePan(0, 50);
                }
            }
            else if (e.key === 'ArrowDown') {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    handlePan(0, -50);
                }
            }
            else if (e.key === 'ArrowLeft') {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    handlePan(50, 0);
                }
            }
            else if (e.key === 'ArrowRight') {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    handlePan(-50, 0);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleZoomIn, handleZoomOut, handleZoomReset, handlePan]);

    const handleAddNode = (selection, x, y) => {
        const typeId = typeof selection === 'string' ? selection : selection.type;
        const typeConfig = AUTO_NODE_TYPES[typeId];
        if (!typeConfig) return;

        const newNode = {
            id: generateId(),
            type: typeId,
            position: { x: x || (-view.x + window.innerWidth / 2), y: y || (-view.y + window.innerHeight / 2) },
            data: { 
                label: typeConfig.label,
                message: '',
                crmStage: '',
                options: []
            }
        };

        setNodes(prev => [...prev, newNode]);
        setSelectedNodeId(newNode.id);
    };

    const handleNodeMove = (id, newPosition) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, position: newPosition } : n));
    };

    const handleUpdateNode = (id, newData) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, data: newData } : n));
    };

    const handleDeleteNode = (id) => {
        setNodes(prev => prev.filter(n => n.id !== id));
        setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
        if (selectedNodeId === id) setSelectedNodeId(null);
    };

    const handleConnect = (sourceId, targetId, outletId = 'default') => {
        const newEdge = { id: generateId(), source: sourceId, target: targetId, outlet: outletId };
        setEdges(prev => [...prev, newEdge]);
    };

    const handleDeleteEdge = (id) => {
        setEdges(prev => prev.filter(e => e.id !== id));
        if (selectedEdgeId === id) setSelectedEdgeId(null);
    };

    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    const selectedEdge = edges.find(e => e.id === selectedEdgeId);

    return (
        <div className="flex flex-col h-full w-full bg-[#050511] font-sans overflow-hidden">
            <AutomationTopBar 
                flowName={initialFlow?.title || "Nuevo Flujo de Ventas"}
                status="borrador"
                // Zoom Props
                view={view}
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
                handleZoomReset={handleZoomReset}
                handlePan={handlePan}
                onBack={onBack}
                onSave={async () => {
                    // Logic for saving nodes/edges state
                    console.log('Saving flow...', { nodes, edges });
                }}
                onPublish={async () => {
                    // Logic for publishing
                    console.log('Publishing flow...');
                }}
            />
            
            <div className="flex-1 flex overflow-hidden relative">
                {/* Node Library / Toolbar */}
                <motion.div 
                    initial={false}
                    animate={{ 
                        x: isSidebarOpen ? 0 : -320,
                        opacity: isSidebarOpen ? 1 : 0.5,
                        scale: isSidebarOpen ? 1 : 0.95
                    }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute top-6 left-6 z-40 w-64 flex flex-col gap-4 pointer-events-none"
                >
                    <div className="bg-[#0A0A0F]/90 backdrop-blur-3xl border border-white/10 rounded-[24px] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.8)] pointer-events-auto relative group">
                        {/* Toggle Button Inside Header */}
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute -right-12 top-0 p-3 bg-[#0A0A0F]/90 backdrop-blur-3xl border border-white/10 rounded-2xl text-white/50 hover:text-white hover:border-white/20 transition-all shadow-2xl active:scale-90 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 mb-6 px-1">
                            <div className="w-1 h-3 bg-purple-500 rounded-full" />
                            <span className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Logical Groups</span>
                        </div>

                        <div className="space-y-4">
                            {GROUPS.map(group => {
                                const isExpanded = expandedGroups.includes(group.id);
                                const groupColor = group.id === 'flows' ? '#a855f7' : '#14b8a6';
                                
                                return (
                                    <div key={group.id} className="space-y-3">
                                        <button 
                                            onClick={() => toggleGroup(group.id)}
                                            className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl transition-all duration-500 group/btn border ${
                                                isExpanded 
                                                ? 'bg-white/[0.05] border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.05)]' 
                                                : 'bg-transparent border-transparent hover:bg-white/[0.02]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                                                    isExpanded ? 'scale-125' : 'opacity-40'
                                                }`} 
                                                style={{ 
                                                    backgroundColor: groupColor,
                                                    boxShadow: isExpanded ? `0 0 15px ${groupColor}` : 'none'
                                                }} />
                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                                                    isExpanded ? 'text-white' : 'text-white/30 group-hover/btn:text-white/50'
                                                }`}>
                                                    {group.label}
                                                </span>
                                            </div>
                                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-700 ${
                                                isExpanded ? 'rotate-180 text-white' : 'text-gray-600'
                                            }`} />
                                        </button>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0, y: -10 }}
                                                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                                                    exit={{ height: 0, opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                                    className="overflow-hidden space-y-1.5 pl-2"
                                                >
                                                    {group.types.map(typeId => {
                                                        const config = AUTO_NODE_TYPES[typeId];
                                                        if (!config) return null;
                                                        return (
                                                            <button
                                                                key={typeId}
                                                                
                                                                draggable
                                                                onDragStart={(e) => {
                                                                    e.dataTransfer.setData('nodeType', typeId);
                                                                }}
                                                                onClick={() => handleAddNode(typeId)}
                                                                className="w-full p-4 bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 rounded-[22px] flex items-center gap-4 transition-all group/item hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                                                            >
                                                                <div 
                                                                    className="w-10 h-10 rounded-2xl flex items-center justify-center bg-black/40 border border-white/5 group-hover/item:scale-110 transition-all duration-500"
                                                                    style={{ borderColor: config.color + '20' }}
                                                                >
                                                                    <config.icon 
                                                                        style={{ color: config.color }} 
                                                                        className="w-5 h-5" 
                                                                    />
                                                                </div>
                                                                <div className="text-left flex-1">
                                                                     <h4 className="text-[11px] font-black text-white/90 uppercase tracking-[0.1em] group-hover/item:text-white transition-colors">{config.label}</h4>
                                                                     <p className="text-[8px] text-gray-500 font-bold leading-none mt-1.5 uppercase tracking-widest">{config.category}</p>
                                                                 </div>
                                                                 <div className="opacity-40 group-hover/item:opacity-100 transition-all">
                                                                     <Plus className="w-3.5 h-3.5 text-white" />
                                                                 </div>
                                                            </button>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* Open Sidebar FAB (Floating Action Button) */}
                <AnimatePresence>
                    {!isSidebarOpen && (
                        <motion.button
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            onClick={() => setIsSidebarOpen(true)}
                            className="absolute top-6 left-6 z-50 p-5 bg-[#0A0A0F]/90 backdrop-blur-3xl border border-white/10 rounded-[24px] text-white shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-purple-500/30 hover:shadow-purple-500/20 transition-all active:scale-95 group"
                        >
                            <div className="absolute inset-0 bg-purple-500/5 blur-xl group-hover:opacity-100 transition-opacity rounded-full opacity-0" />
                            <ChevronRight className="w-6 h-6 text-purple-400 relative z-10" />
                        </motion.button>
                    )}
                </AnimatePresence>


                <AutomationCanvas
                    onAddNode={handleAddNode}
                    nodes={nodes}
                    edges={edges}
                    view={view}
                    onViewChange={setView}
                    activeTool={activeTool}
                    selectedNodeId={selectedNodeId}
                    selectedEdgeId={selectedEdgeId}
                    connectionStart={connectionStart}
                    onNodeMove={handleNodeMove}
                    onNodeSelect={(id) => { setSelectedNodeId(id); setSelectedEdgeId(null); }}
                    onEdgeSelect={(id) => { setSelectedEdgeId(id); setSelectedNodeId(null); }}
                    onConnectionStart={(nodeId, outletId) => setConnectionStart({ nodeId, outletId })}
                    onConnect={handleConnect}
                    onDeleteNode={handleDeleteNode}
                    onDeleteEdge={handleDeleteEdge}
                />

                <AnimatePresence>
                    {(selectedNode || selectedEdge) && (
                        <AutomationProperties
                            selectedNode={selectedNode}
                            selectedEdge={selectedEdge}
                            onClose={() => { setSelectedNodeId(null); setSelectedEdgeId(null); }}
                            onUpdateNode={handleUpdateNode}
                            onDeleteNode={handleDeleteNode}
                            onDeleteEdge={handleDeleteEdge}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
