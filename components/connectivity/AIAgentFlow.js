'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Bot, Sparkles, Code, Globe, Terminal, Cpu, Database, Network, Search, Zap, Share2, MousePointer2, Hand, Maximize, Settings, Plus, Play, Info, Trash2, Users, XCircle, Video, Clapperboard, Palette, Mic, Camera, UserCheck, Printer, MessageSquare, CheckCircle } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

export default function AIAgentFlow({ activeTool, nodes = [], setNodes, edges = [], setEdges, zoomScale = 1, onNodeClick, connectingNode }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // No local zoomScale calculation, using prop


    const [selectedNode, setSelectedNode] = useState(null);
    const [draggingEdge, setDraggingEdge] = useState(null); // { sourceNode, startX, startY }
    const [mouseCanvasPos, setMouseCanvasPos] = useState({ x: 0, y: 0 });

    // Map string names to Lucide icons
    const iconMap = { Globe, Bot, Sparkles, Code, Terminal, Cpu, Database, Network, Search, Zap, Share2, Users, Video, Clapperboard, Palette, Mic, Camera, UserCheck, Printer, MessageSquare, CheckCircle };

    // HTML5 Drag and Drop Handlers for Canvas
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const dataStr = e.dataTransfer.getData('application/reactflow');
        if (!dataStr) return;

        try {
            const data = JSON.parse(dataStr);
            // Calculate drop position relative to canvas center
            const rect = canvasRef.current.getBoundingClientRect();
            // We use center of canvas as (0,0) based on how nodes were initially positioned
            const x = (e.clientX - rect.left - rect.width / 2) / zoomScale;
            const y = (e.clientY - rect.top - rect.height / 2) / zoomScale;

            const newNode = {
                id: Date.now(),
                type: data.type,
                label: data.label,
                iconName: data.iconName || 'Sparkles',
                color: data.color || 'text-indigo-500',
                x,
                y
            };
            setNodes(prev => [...prev, newNode]);
            setSelectedNode(newNode);
        } catch (err) {
            console.error('Drop parse error:', err);
        }
    };

    // --- Configuration State ---
    const [config, setConfig] = useState({ url: '', auth: '', payload: '' });
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState(null); // 'success', 'error', null

    useEffect(() => {
        if (selectedNode) {
            setConfig({
                url: selectedNode.config?.url || `https://diic.zone/api/webhooks/${selectedNode.id}`,
                auth: selectedNode.config?.auth || 'Ninguna (Público)',
                payload: selectedNode.config?.payload || `{\n  "status": "success",\n  "node": "${selectedNode.label}",\n  "timestamp": "{{$now}}"\n}`
            });
            setTestResult(null);
        }
    }, [selectedNode]);

    const handleSave = () => {
        setNodes(nds => nds.map(n => 
            n.id === selectedNode.id 
                ? { ...n, config: { ...config } } 
                : n
        ));
        // Simple visual feedback: Flash the button or close panel? 
        // Let's just show a brief "Saved" state if I had a toast, for now just close.
        setSelectedNode(null);
    };

    const handleTest = () => {
        setIsTesting(true);
        setTestResult(null);
        
        // Simulate premium network latency
        setTimeout(() => {
            setIsTesting(false);
            setTestResult('success');
        }, 1500);
    };

    return (
        <div 
            ref={containerRef}
            className="w-full h-full relative overflow-hidden bg-[#050511] select-none"
        >
            {/* Background Grid - Futuristic and Deep */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:60px_60px] opacity-20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] opacity-40"></div>

            {/* DRAGGABLE CANVAS WRAPPER */}
            <motion.div 
                ref={canvasRef}
                drag={activeTool === 'hand'}
                dragMomentum={false}
                animate={{ scale: zoomScale }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onPointerMove={(e) => {
                    if (!canvasRef.current) return;
                    const rect = canvasRef.current.getBoundingClientRect();
                    setMouseCanvasPos({ 
                        x: (e.clientX - rect.left - rect.width / 2) / zoomScale, 
                        y: (e.clientY - rect.top - rect.height / 2) / zoomScale 
                    });
                }}
                onPointerUp={() => setDraggingEdge(null)}
                onClick={() => setSelectedNode(null)}
                className={`w-full h-full flex flex-col items-center justify-center relative overflow-visible ${
                    activeTool === 'hand' ? 'cursor-grab active:cursor-grabbing' : 
                    activeTool === 'connect' || draggingEdge ? 'cursor-crosshair' : 'cursor-auto'
                }`}
            >
                {/* ─── LEVEL 2: WORKFLOW PIZARRA (n8n Style) ─── */}
                <div className="relative w-full max-w-5xl h-[300px] flex items-center justify-center">
                    {/* SVG Connections (Dynamic Flowing Wires) */}
                    <div className="absolute inset-0 pointer-events-none overflow-visible">
                        <svg className="absolute top-1/2 left-1/2 w-0 h-0 overflow-visible pointer-events-none">
                            <defs>
                                <filter id="glow-edge">
                                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            
                            {edges.map(edge => {
                                const sourceNode = nodes.find(n => n.id === edge.source);
                                const targetNode = nodes.find(n => n.id === edge.target);
                                if (!sourceNode || !targetNode) return null;

                                // Exact Port Coordinates: Center center of side-ports
                                // With Node Width = 224px, center to port is 112px
                                const sx = sourceNode.x + 112;
                                const sy = sourceNode.y;
                                const tx = targetNode.x - 112;
                                const ty = targetNode.y;
                                
                                const d = `M ${sx} ${sy} 
                                           C ${sx + 50} ${sy}, 
                                             ${tx - 50} ${ty}, 
                                             ${tx} ${ty}`;

                                return (
                                    <g key={edge.id}>
                                        <path 
                                            d={d} 
                                            stroke={edge.color} 
                                            strokeWidth="2" 
                                            fill="none" 
                                            opacity="0.2" 
                                        />
                                        <path 
                                            d={d} 
                                            stroke={edge.color} 
                                            strokeWidth="2" 
                                            strokeDasharray="8 8" 
                                            fill="none" 
                                            filter="url(#glow-edge)"
                                        >
                                            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
                                        </path>
                                    </g>
                                );
                            })}

                            {/* GHOST LINE (during drag-to-connect) */}
                            {draggingEdge && (
                                <path 
                                    d={`M ${draggingEdge.startX} ${draggingEdge.startY} 
                                       C ${draggingEdge.startX + 50} ${draggingEdge.startY}, 
                                         ${mouseCanvasPos.x - 50} ${mouseCanvasPos.y}, 
                                         ${mouseCanvasPos.x} ${mouseCanvasPos.y}`}
                                    stroke="#6366f1"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                    fill="none"
                                    opacity="0.6"
                                />
                            )}
                        </svg>
                    </div>

                    {/* Nodes */}
                    <div className="absolute inset-0 z-10 pointer-events-none">
                        {nodes.map((node) => {
                            const IconComponent = iconMap[node.iconName] || Sparkles;
                            return (
                                <motion.div 
                                    key={node.id}
                                    drag={activeTool === 'selector'}
                                    dragMomentum={false}
                                    onDragEnd={(e, info) => {
                                        setNodes(nds => nds.map(n => 
                                            n.id === node.id 
                                                ? { ...n, x: n.x + info.offset.x / zoomScale, y: n.y + info.offset.y / zoomScale }
                                                : n
                                        ));
                                    }}
                                    style={{ x: node.x, y: node.y, left: '50%', top: '50%' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (activeTool === 'selector') setSelectedNode(node);
                                        if (activeTool === 'connect' && onNodeClick) onNodeClick(node);
                                    }}
                                    whileHover={activeTool === 'selector' || activeTool === 'connect' ? { scale: 1.05 } : {}}
                                    className={`absolute -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-3xl border-2 rounded-[30px] p-5 w-56 shadow-[0_30px_60px_rgba(0,0,0,0.1)] group cursor-pointer transition-all duration-500 pointer-events-auto ${
                                        selectedNode?.id === node.id ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)] z-50' : 
                                        connectingNode?.id === node.id ? 'border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.5)] scale-105 z-50 animate-pulse' : 
                                        'border-indigo-100'
                                    }`}
                                >
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-100 border border-indigo-100 rounded-full text-[9px] font-black text-gray-400 tracking-widest uppercase">{node.type}</div>
                                    
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-2.5 rounded-xl bg-gray-50 border border-indigo-50 ${node.color}`}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <span className="text-[13px] font-black text-gray-900 tracking-tight">{node.label}</span>
                                    </div>
                                    
                                    <div className="h-px bg-indigo-50 w-full mb-3 opacity-50"></div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                                        </div>
                                        <div className="p-1 px-2.5 bg-indigo-50 text-indigo-600 text-[8px] font-black rounded-lg">ACTIVE</div>
                                    </div>

                                    {/* Node Ports */}
                                    <div 
                                        className="absolute top-1/2 -left-2.5 w-5 h-5 bg-white border-2 border-indigo-100 rounded-full z-20 group-hover:border-indigo-400 transition-colors cursor-alias pointer-events-auto"
                                        onPointerUp={(e) => {
                                            e.stopPropagation();
                                            if (draggingEdge && draggingEdge.sourceId !== node.id) {
                                                const newEdge = { 
                                                    id: `e-${Date.now()}`, 
                                                    source: draggingEdge.sourceId, 
                                                    target: node.id, 
                                                    color: '#6366f1' 
                                                };
                                                setEdges(prev => [...prev, newEdge]);
                                                setDraggingEdge(null);
                                            }
                                        }}
                                    ></div>
                                    <div 
                                        className={`absolute top-1/2 -right-2.5 w-5 h-5 bg-white border-2 border-indigo-100 rounded-full z-20 group-hover:border-indigo-400 transition-colors cursor-alias pointer-events-auto ${draggingEdge?.sourceId === node.id ? 'bg-indigo-500 scale-125 border-indigo-300' : ''}`}
                                        onPointerDown={(e) => {
                                            e.stopPropagation();
                                            setDraggingEdge({
                                                sourceId: node.id,
                                                startX: node.x + 112,
                                                startY: node.y
                                            });
                                        }}
                                    ></div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>


            </motion.div>

            {/* Floating Context Labels (Visual Noise) */}
            <div className="absolute top-10 right-10 flex flex-col items-end gap-2 opacity-20 pointer-events-none">
                <span className="text-[9px] font-black text-indigo-300 tracking-widest">NODES_ARRAY_V4</span>
                <span className="text-[9px] font-black text-indigo-300 tracking-widest">DRAG_ENABLED: TRUE</span>
                <span className="text-[9px] font-black text-indigo-300 tracking-widest">SCALE: {Math.round(zoomScale * 100)}%</span>
            </div>

            {/* Glowing Orbs */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[200px] pointer-events-none"
            ></motion.div>
            {/* Premium Node Configuration Panel */}
            {selectedNode && (
                <motion.div 
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    className="absolute top-8 right-8 bottom-8 z-40 w-96 bg-[#0E0E18]/90 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col p-6 pointer-events-auto"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl bg-white/5 ${selectedNode.color}`}>
                                {(() => {
                                    const PanelIcon = iconMap[selectedNode.iconName] || Sparkles;
                                    return <PanelIcon className="w-5 h-5" />;
                                })()}
                            </div>
                            <h3 className="text-white font-black text-sm tracking-widest">{selectedNode.label}</h3>
                        </div>
                        <button onClick={() => setSelectedNode(null)} className="text-gray-500 hover:text-white transition-colors">
                            <XCircle className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block px-1">Node Type</label>
                            <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-xs">{selectedNode.type}</div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block px-1">Webhook URL / API Endpoint</label>
                            <div className="relative group/input">
                                <input 
                                    type="text" 
                                    value={config.url}
                                    onChange={(e) => setConfig({ ...config, url: e.target.value })}
                                    className="w-full bg-black/40 border border-indigo-500/30 rounded-2xl px-5 py-3 text-indigo-300 focus:border-indigo-400 focus:outline-none transition-all text-xs font-mono" 
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-indigo-500 opacity-0 group-hover/input:opacity-100 transition-opacity">COPY URL</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block px-1">Authentication</label>
                            <select 
                                value={config.auth}
                                onChange={(e) => setConfig({ ...config, auth: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-xs appearance-none focus:border-indigo-500 focus:outline-none cursor-pointer"
                            >
                                <option className="bg-[#050511]">Ninguna (Público)</option>
                                <option className="bg-[#050511]">Bearer Token</option>
                                <option className="bg-[#050511]">OAuth 2.0</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between mb-2 px-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Payload Data (JSON)</label>
                                <span className="text-[9px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">Auto-Format</span>
                            </div>
                            <textarea 
                                rows="5" 
                                value={config.payload}
                                onChange={(e) => setConfig({ ...config, payload: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-emerald-400 font-mono text-[10px] focus:border-indigo-500 focus:outline-none transition-all resize-none" 
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 mt-auto flex gap-3">
                        <button 
                            onClick={handleTest}
                            disabled={isTesting}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 ${isTesting ? 'bg-white/5 text-gray-500 animate-pulse' : testResult === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
                        >
                            {isTesting ? 'Verifying...' : testResult === 'success' ? <><CheckCircle className="w-4 h-4" /> Validated</> : 'Test Node'}
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Settings className="w-4 h-4" /> Save Configuration
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );

}
