'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { NODE_TYPES, STRATEGIC_AREAS } from './StrategyConstants';
import { Folder, Video, Image as ImageIcon, CheckCircle2, Layout, FileText, StickyNote, PlayCircle, BarChart3, Target, Workflow, PenTool, ChevronRight } from 'lucide-react';

export default function StrategyMindMap({ activeCampaign, onNodeSelect, selectedNodeId }) {
    const nodes = activeCampaign?.nodes || [];
    
    // Process the hierarchical data into 4 levels
    const treeData = useMemo(() => {
        const layout = {
            root: { x: 100, y: 500, label: activeCampaign?.name || 'ESTRATEGIA OBJETIVO' },
            levels: [],
            edges: []
        };

        // 1. Group by Area
        const areasData = STRATEGIC_AREAS.map((area, areaIdx) => {
            const areaNodes = nodes.filter(n => n.data?.areaId === area.id);
            
            // 2. Group within Area by Category
            const categoriesMap = new Map();
            areaNodes.forEach(node => {
                const catId = node.data?.categoryId || 'Otros';
                if (!categoriesMap.has(catId)) {
                    categoriesMap.set(catId, { id: catId, label: catId.toUpperCase(), nodes: [] });
                }
                categoriesMap.get(catId).nodes.push(node);
            });

            return {
                ...area,
                categories: Array.from(categoriesMap.values())
            };
        });

        // Calculate Layout
        const AREA_X = 400;
        const CAT_X = 750;
        const NODE_X = 1100;
        const CANVAS_HEIGHT = Math.max(1000, nodes.length * 100);
        const rootY = CANVAS_HEIGHT / 2;
        layout.root.y = rootY;

        let currentY = 100;

        areasData.forEach((area, aIdx) => {
            // Area Position (Spread vertically)
            const areaY = (aIdx + 1) * (CANVAS_HEIGHT / (areasData.length + 1));
            
            layout.levels.push({
                type: 'area',
                id: area.id,
                label: area.label,
                icon: area.icon,
                color: area.color,
                x: AREA_X,
                y: areaY
            });

            // Edge Root -> Area
            layout.edges.push(getBezier(layout.root.x + 120, rootY, AREA_X, areaY, area.color));

            area.categories.forEach((cat, cIdx) => {
                // Category Position
                const catY = currentY + (cat.nodes.length * 40);
                
                layout.levels.push({
                    type: 'category',
                    id: `${area.id}-${cat.id}`,
                    label: cat.label,
                    x: CAT_X,
                    y: catY,
                    color: area.color
                });

                // Edge Area -> Category
                layout.edges.push(getBezier(AREA_X + 150, areaY, CAT_X, catY, area.color));

                cat.nodes.forEach((node, nIdx) => {
                    const nodeY = currentY;
                    currentY += 100;

                    layout.levels.push({
                        type: 'node',
                        ...node,
                        x: NODE_X,
                        y: nodeY,
                        color: area.color
                    });

                    // Edge Category -> Node
                    layout.edges.push(getBezier(CAT_X + 120, catY, NODE_X, nodeY, area.color));
                });
                
                currentY += 40; // Space between categories
            });
        });

        return layout;

    }, [nodes, activeCampaign]);

    // Helper for Bezier curves with varying colors
    function getBezier(x1, y1, x2, y2, color) {
        const deltaX = Math.abs(x2 - x1);
        const cp1x = x1 + deltaX * 0.5;
        const cp2x = x2 - deltaX * 0.5;
        return {
            path: `M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`,
            color: color || 'rgba(255,255,255,0.1)'
        };
    }

    return (
        <div className="flex-1 relative bg-[#050511] overflow-auto custom-scrollbar">
            {/* SVG Background - The "Neural Network" */}
            <svg className="absolute top-0 left-0 w-[3000px] h-[3000px] pointer-events-none z-0">
                <defs>
                    <filter id="glowPath" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(99,102,241,0.05)" />
                        <stop offset="100%" stopColor="rgba(99,102,241,0.3)" />
                    </linearGradient>
                </defs>
                
                {treeData.edges.map((edge, i) => (
                    <g key={`edge-group-${i}`}>
                        {/* Glow effect path */}
                        <motion.path 
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.3 }}
                            transition={{ delay: i * 0.02, duration: 0.8 }}
                            d={edge.path} 
                            stroke={edge.color} 
                            strokeWidth="4" 
                            fill="none"
                            style={{ filter: 'blur(8px)' }}
                        />
                        {/* Solid core path */}
                        <motion.path 
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.6 }}
                            transition={{ delay: i * 0.02, duration: 0.8 }}
                            d={edge.path} 
                            stroke={edge.color} 
                            strokeWidth="1.5" 
                            fill="none" 
                        />
                    </g>
                ))}
            </svg>

            {/* Content Layer */}
            <div className="w-[3000px] h-[3000px] relative z-10 p-20">
                
                {/* Level 0: The Core Root */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute p-8 bg-[#0D0D18] rounded-[40px] border-2 border-indigo-500/50 shadow-[0_0_60px_rgba(99,102,241,0.3)] flex flex-col items-center justify-center gap-4 transform -translate-y-1/2 min-w-[240px] backdrop-blur-xl"
                    style={{ left: treeData.root.x, top: treeData.root.y }}
                >
                    <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <Folder className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div className="text-center">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1 block">ESTRATEGIA MAESTRA</span>
                        <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">
                            {treeData.root.label}
                        </h1>
                    </div>
                </motion.div>

                {/* Levels 1, 2, 3 */}
                {treeData.levels.map((item, i) => {
                    if (item.type === 'area') {
                        const Icon = item.icon || PenTool;
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + (i * 0.05) }}
                                className="absolute px-8 py-5 bg-[#0D0D18]/80 rounded-[30px] border border-white/5 shadow-2xl flex items-center gap-5 transform -translate-y-1/2 backdrop-blur-md group hover:border-white/20 transition-all min-w-[260px]"
                                style={{ left: item.x, top: item.y }}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center" style={{ color: item.color }}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-black text-white uppercase tracking-tighter group-hover:text-indigo-400 transition-colors">
                                        {item.label}
                                    </h3>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Raíz Estratégica</p>
                                </div>
                                <div className="ml-auto">
                                    <ChevronRight className="w-4 h-4 text-gray-700" />
                                </div>
                            </motion.div>
                        );
                    }

                    if (item.type === 'category') {
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 + (i * 0.02) }}
                                className="absolute px-5 py-3 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center gap-3 transform -translate-y-1/2"
                                style={{ left: item.x, top: item.y }}
                            >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    {item.label}
                                </span>
                            </motion.div>
                        );
                    }

                    if (item.type === 'node') {
                        const isSelected = selectedNodeId === item.id;
                        const status = item.data?.status || 'Idea';
                        
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 + (i * 0.01) }}
                                onClick={() => onNodeSelect(item.id)}
                                className={`absolute w-72 p-5 rounded-[28px] border transition-all cursor-pointer transform -translate-y-1/2 backdrop-blur-sm group ${
                                    isSelected 
                                        ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)] scale-105' 
                                        : 'bg-white/[0.03] border-white/5 hover:border-white/20'
                                }`}
                                style={{ left: item.x, top: item.y }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center ${isSelected ? 'text-indigo-400' : 'text-gray-500'}`}>
                                            <PlayCircle className="w-4 h-4" />
                                        </div>
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{item.type}</span>
                                    </div>
                                    {status === 'Listo' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                                </div>
                                
                                <h4 className={`text-[12px] font-black uppercase tracking-tight leading-tight mb-4 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                    {item.data?.title || 'Contenido Estratégico'}
                                </h4>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="px-2 py-1 rounded-md bg-white/5 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                                            {item.data?.funnelLevel || 'General'}
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold text-indigo-400/60 italic tracking-tighter">DIIC GEN v2.1</span>
                                </div>

                                {isSelected && (
                                    <motion.div 
                                        layoutId="glowNode"
                                        className="absolute inset-0 rounded-[28px] pointer-events-none"
                                        style={{ boxShadow: `0 0 20px ${item.color}20` }}
                                    />
                                )}
                            </motion.div>
                        );
                    }
                    
                    return null;
                })}
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #050511; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
            `}</style>
        </div>
    );
}
