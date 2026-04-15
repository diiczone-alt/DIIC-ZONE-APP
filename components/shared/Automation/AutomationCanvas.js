'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AUTO_NODE_TYPES } from './AutomationConstants';
import { Target, Zap, ChevronRight, Settings } from 'lucide-react';

export default function AutomationCanvas({
    nodes,
    edges,
    activeTool,
    onNodeMove,
    onNodeSelect,
    onEdgeSelect,
    onConnectionStart,
    onConnect,
    onDeleteNode,
    onDeleteEdge,
    selectedNodeId,
    selectedEdgeId,
    connectionStart,
    view,
    onViewChange,
    onAddNode
}) {
    const canvasRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [dragState, setDragState] = useState({
        isDragging: false,
        startX: 0, startY: 0,
        originX: 0, originY: 0,
        targetId: null
    });

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const typeId = e.dataTransfer.getData('nodeType');
        if (!typeId) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - view.x) / view.scale;
        const y = (e.clientY - rect.top - view.y) / view.scale;

        onAddNode(typeId, x - 140, y - 60); // Center on drop
    };

    // Handle panning and dragging
    const handleMouseDown = (e, id) => {
        if (e.button !== 0) return; // Only left click allowed

        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - view.x) / view.scale;
        const y = (e.clientY - rect.top - view.y) / view.scale;

        if (id) {
            e.stopPropagation();
            setDragState({
                isDragging: true,
                startX: e.clientX,
                startY: e.clientY,
                originX: nodes.find(n => n.id === id).position.x,
                originY: nodes.find(n => n.id === id).position.y,
                targetId: id
            });
            onNodeSelect(id);
        } else {
            setDragState({
                isDragging: true,
                startX: e.clientX,
                startY: e.clientY,
                originX: view.x,
                originY: view.y,
                targetId: 'canvas'
            });
            if (activeTool === 'select') onNodeSelect(null);
        }
    };

    const handleMouseMove = useCallback((e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            setMousePos({
                x: (e.clientX - rect.left - view.x) / view.scale,
                y: (e.clientY - rect.top - view.y) / view.scale
            });
        }

        if (!dragState.isDragging) return;

        const dx = (e.clientX - dragState.startX) / view.scale;
        const dy = (e.clientY - dragState.startY) / view.scale;

        if (dragState.targetId === 'canvas') {
            onViewChange({
                ...view,
                x: dragState.originX + (e.clientX - dragState.startX),
                y: dragState.originY + (e.clientY - dragState.startY)
            });
        } else if (dragState.targetId !== 'connect') {
            onNodeMove(dragState.targetId, { x: dragState.originX + dx, y: dragState.originY + dy });
        }
    }, [dragState, view, onNodeMove, onViewChange]);

    const handleMouseUp = (e) => {
        if (dragState.targetId === 'connect' && connectionStart) {
            const dropTarget = nodes.find(n => {
                const nodeX = n.position.x;
                const nodeY = n.position.y;
                return mousePos.x >= nodeX && mousePos.x <= nodeX + 280 &&
                       mousePos.y >= nodeY && mousePos.y <= nodeY + 120;
            });
            if (dropTarget && dropTarget.id !== connectionStart.nodeId) {
                onConnect(connectionStart.nodeId, dropTarget.id, connectionStart.outletId);
            }
        }
        setDragState({ isDragging: false, startX: 0, startY: 0, originX: 0, originY: 0, targetId: null });
        onConnectionStart?.(null, null); // Clear connection state
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove]);

    const handleWheel = (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const scaleAmount = -e.deltaY * 0.005;
            const newScale = Math.min(Math.max(0.1, view.scale * (1 + scaleAmount)), 3);
            
            const rect = canvasRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const dx = (mouseX - view.x) * (1 - newScale / view.scale);
            const dy = (mouseY - view.y) * (1 - newScale / view.scale);

            onViewChange({ x: view.x + dx, y: view.y + dy, scale: newScale });
        } else {
            onViewChange({ ...view, x: view.x - e.deltaX, y: view.y - e.deltaY });
        }
    };

    const drawPath = (startX, startY, endX, endY) => {
        const dx = endX - startX;
        const dy = endY - startY;
        const isHorizontal = Math.abs(dx) > Math.abs(dy);
        
        if (isHorizontal) {
            const cpOffset = Math.max(Math.abs(dx) * 0.5, 50);
            return `M ${startX} ${startY} C ${startX + cpOffset} ${startY}, ${endX - cpOffset} ${endY}, ${endX} ${endY}`;
        } else {
            const cpOffset = Math.max(Math.abs(dy) * 0.5, 50);
            return `M ${startX} ${startY} C ${startX} ${startY + cpOffset}, ${endX} ${endY - cpOffset}, ${endX} ${endY}`;
        }
    };

    return (
        <div 
            ref={canvasRef} onDragOver={handleDragOver} onDrop={handleDrop}
            className="w-full h-full bg-[#0A0A0F] overflow-hidden cursor-grab active:cursor-grabbing relative"
            onMouseDown={(e) => handleMouseDown(e, null)}
            onWheel={handleWheel}
        >
            <div 
                className="absolute inset-0 z-0 origin-top-left"
                style={{ 
                    transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
                    willChange: 'transform'
                }}
            >
                {/* Grid Background */}
                <div 
                    className="absolute inset-[-10000px] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Edges Layer */}
                <svg className="absolute inset-[-10000px] w-[20000px] h-[20000px] pointer-events-none z-10 overflow-visible">
                    <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" opacity="0.6" />
                        </marker>
                        <marker id="arrow-selected" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
                        </marker>
                    </defs>

                    {edges.map(edge => {
                        const sourceNode = nodes.find(n => n.id === edge.source);
                        const targetNode = nodes.find(n => n.id === edge.target);
                        if (!sourceNode || !targetNode) return null;

                        // Precise connection points (Fixed Height 140px / 2 = 70px)
                        // Port centers are exactly at NodeX and NodeX + 280
                        const startX = sourceNode.position.x + 280; 
                        const startY = sourceNode.position.y + 70;
                        const endX = targetNode.position.x;
                        const endY = targetNode.position.y + 70;

                        const isSelected = edge.id === selectedEdgeId;

                        return (
                            <g key={edge.id} className="pointer-events-auto cursor-pointer" onClick={(e) => { e.stopPropagation(); onEdgeSelect(edge.id); }}>
                                {/* Invisible hover target */}
                                <path d={drawPath(startX, startY, endX, endY)} fill="none" stroke="transparent" strokeWidth="20" />
                                
                                {/* Neon Glow Outer */}
                                <path 
                                    d={drawPath(startX, startY, endX, endY)} 
                                    fill="none" 
                                    stroke={isSelected ? '#a855f7' : '#8b5cf6'} 
                                    strokeOpacity={isSelected ? 0.3 : 0.1}
                                    strokeWidth={isSelected ? 12 : 8}
                                    className="blur-md"
                                />

                                {/* Core Line */}
                                <path 
                                    d={drawPath(startX, startY, endX, endY)} 
                                    fill="none" 
                                    stroke={isSelected ? '#a855f7' : '#8b5cf6'} 
                                    strokeOpacity={isSelected ? 1 : 0.6}
                                    strokeWidth={isSelected ? 3 : 2}
                                    markerEnd={`url(#${isSelected ? 'arrow-selected' : 'arrow'})`}
                                    className="transition-all duration-300"
                                    strokeDasharray={edge.outlet !== 'default' ? "6,6" : "none"}
                                />
                            </g>
                        );
                    })}

                    {/* Active Drag Connection Line */}
                    {connectionStart && dragState.targetId === 'connect' && (() => {
                        const sourceNode = nodes.find(n => n.id === connectionStart.nodeId);
                        if (!sourceNode) return null;
                        const startX = sourceNode.position.x + 280;
                        const startY = sourceNode.position.y + 70;
                        return (
                            <path 
                                d={drawPath(startX, startY, mousePos.x, mousePos.y)} 
                                fill="none" 
                                stroke="#f472b6" 
                                strokeOpacity={1}
                                strokeWidth={2}
                                strokeDasharray="5,5"
                                className="animate-pulse drop-shadow-[0_0_10px_rgba(244,114,182,1)]"
                            />
                        );
                    })()}
                </svg>

                {/* Nodes Layer */}
                <div className="absolute inset-0 z-20">
                    {nodes.map(node => {
                        const typeConfig = AUTO_NODE_TYPES[node.type];
                        if (!typeConfig) return null;
                        
                        const isSelected = selectedNodeId === node.id;
                        let nodeStyle = 'border-white/5 bg-[#14141e]/90 hover:border-white/20 hover:shadow-2xl';
                        if (isSelected) nodeStyle = 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] z-30 scale-[1.03] bg-[#14141e]';

                        return (
                            <motion.div
                                key={node.id}
                                className={`absolute w-[280px] h-[140px] rounded-2xl border backdrop-blur-sm cursor-grab active:cursor-grabbing transition-all duration-200 group/node p-4 ${nodeStyle}`}
                                style={{ 
                                    left: node.position.x, 
                                    top: node.position.y,
                                    transformOrigin: 'center center'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, node.id)}
                            >
                                {/* Left Input Port (White Circle) - Center exactly at X=0 */}
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center z-40 pointer-events-none">
                                    <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#8b5cf6]/30 shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/10 shadow-inner group-hover/node:brightness-125 transition-all group-hover/node:border-purple-500/30">
                                        <typeConfig.icon style={{ color: typeConfig.color }} className="w-5 h-5 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                       <h4 className="text-[11px] font-black uppercase tracking-tight text-white/90 truncate group-hover/node:text-white transition-colors">
                                            {node.data?.label || typeConfig.label}
                                       </h4>
                                       <p className="text-[9px] text-gray-500 font-bold truncate mt-0.5 uppercase tracking-widest opacity-60">
                                            {typeConfig.category}
                                       </p>
                                    </div>
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            onNodeSelect(node.id); 
                                        }} 
                                        className="w-7 h-7 rounded-full bg-white/5 hover:bg-indigo-600 border border-white/5 hover:border-indigo-400 flex items-center justify-center transition-all hover:scale-110 active:scale-90 group/settings"
                                    >
                                        <Settings className="w-3.5 h-3.5 text-gray-400 group-hover/settings:text-white transition-colors" />
                                    </button>
                                </div>

                                {/* Right Output Port (White Circle - Interactive) - Center exactly at X=280 */}
                                <div 
                                    className={`absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-crosshair z-40 group/outlet`}
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        onConnectionStart(node.id, 'default');
                                        setDragState({ isDragging: true, targetId: 'connect', startX: e.clientX, startY: e.clientY });
                                    }}
                                >
                                    {/* Visual Circle */}
                                    <div className={`w-3.5 h-3.5 rounded-full bg-white border-2 transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.6)] ${
                                        (connectionStart?.nodeId === node.id || isSelected) 
                                        ? 'border-purple-500 scale-125 shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
                                        : 'border-white/20 group-hover/outlet:border-purple-500/50 group-hover/outlet:scale-110'
                                    }`} />
                                </div>

                                {/* Node Details Snippet */}
                                <div className="mt-3 p-2.5 bg-black/30 rounded-xl border border-white/5 h-[44px] overflow-hidden">
                                    {node.type === 'trigger_whatsapp' && (
                                        <div className="text-[9px] text-gray-400 font-bold truncate">
                                            <span className="text-gray-600 uppercase tracking-tighter mr-2">Keyword:</span> {node.data?.keyword || "Cualquier mensaje"}
                                        </div>
                                    )}
                                    {node.type === 'msg_auto' && (
                                        <div className="text-[9px] text-indigo-300 font-bold leading-tight line-clamp-2 italic opacity-80 pl-1 border-l border-indigo-500/30">
                                            "{node.data?.message || "Sin mensaje..."}"
                                        </div>
                                    )}
                                    {node.type === 'action_crm' && (
                                        <div className="text-[9px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-2 pl-1">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                            {node.data?.crmStage || "Pipeline Update"}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
