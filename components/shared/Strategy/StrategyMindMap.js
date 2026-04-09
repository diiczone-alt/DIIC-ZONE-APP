'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { NODE_TYPES, NODE_CATEGORIES } from './StrategyConstants';
import { Folder, Video, Image as ImageIcon, CheckCircle2, Layout, FileText, StickyNote, PlayCircle } from 'lucide-react';

export default function StrategyMindMap({ activeCampaign, onNodeSelect, selectedNodeId }) {
    const nodes = activeCampaign?.nodes || [];
    
    // Process the hierarchical data
    const treeData = useMemo(() => {
        // Find unique formats (types) used in the campaign
        const formatsMap = new Map();
        
        nodes.forEach(node => {
            if (node.data?.isHidden) return; // Skip hidden
            
            // Map specific strategy types to broader media formats for classification
            let formatKey = 'Otro';
            let icon = Layout;
            let color = 'text-gray-400';
            
            if (node.type.includes('video') || node.type.includes('reel') || node.type.includes('tiktok')) {
                formatKey = 'Video';
                icon = Video;
                color = 'text-indigo-400';
            } else if (node.type.includes('imagen') || node.type.includes('post') || node.type.includes('carrusel')) {
                formatKey = 'Imagen';
                icon = ImageIcon;
                color = 'text-blue-400';
            } else if (node.type.includes('sticky')) {
                formatKey = 'Notas';
                icon = StickyNote;
                color = 'text-amber-400';
            } else if (node.type.includes('documento') || node.type.includes('texto')) {
                formatKey = 'Documento';
                icon = FileText;
                color = 'text-emerald-400';
            }

            if (!formatsMap.has(formatKey)) {
                formatsMap.set(formatKey, { id: formatKey, label: formatKey, icon, color, items: [] });
            }
            formatsMap.get(formatKey).items.push(node);
        });

        const formats = Array.from(formatsMap.values());
        
        // Calculate Layout Measurements
        const rootX = 150;
        const formatX = 450;
        const itemX = 800;
        
        const totalHeight = 1000; // Arbitrary canvas height
        const rootY = totalHeight / 2;

        const layout = {
            root: { x: rootX, y: rootY, label: activeCampaign?.name || 'Campaña Estratégica' },
            formats: [],
            items: [],
            edges: []
        };

        const formatSpacing = Math.max(120, totalHeight / (formats.length + 1));
        
        let currentItemYOffset = 100; // Start spacing for items

        formats.forEach((format, fIdx) => {
            const formatY = (fIdx + 1) * formatSpacing;
            
            layout.formats.push({
                ...format,
                x: formatX,
                y: formatY
            });

            // Edge from Root to Format
            layout.edges.push(getBezier(rootX + 100, rootY, formatX, formatY));

            // Place Items for this format
            format.items.forEach((item, iIdx) => {
                const itemY = currentItemYOffset;
                currentItemYOffset += 80; // Distance between items

                layout.items.push({
                    ...item,
                    x: itemX,
                    y: itemY,
                    formatId: format.id
                });

                // Edge from Format to Item
                layout.edges.push(getBezier(formatX + 80, formatY, itemX, itemY));
            });
            
            // Add extra space after a format group
            currentItemYOffset += 40; 
        });

        // Adjust canvas root Y to match the center of items if needed, but keeping it simple for now.
        return layout;

    }, [nodes, activeCampaign]);

    // Helper for Bezier curves
    function getBezier(x1, y1, x2, y2) {
        const deltaX = Math.abs(x2 - x1);
        const cp1x = x1 + deltaX * 0.4;
        const cp2x = x2 - deltaX * 0.4;
        return `M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`;
    }

    return (
        <div className="flex-1 relative bg-[#050511] overflow-auto custom-scrollbar">
            {/* SVG Lines Layer */}
            <svg className="absolute top-0 left-0 w-[2000px] h-[2000px] pointer-events-none z-0">
                <defs>
                    <filter id="glowTree" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                {treeData.edges.map((path, i) => (
                    <motion.path 
                        key={`edge-${i}`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        d={path} 
                        stroke="rgba(255,255,255,0.15)" 
                        strokeWidth="1.5" 
                        fill="none" 
                    />
                ))}
            </svg>

            {/* Nodes Layer */}
            <div className="w-[2000px] h-[2000px] relative z-10">
                
                {/* Level 0: Root Node */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute px-6 py-4 bg-indigo-600 rounded-3xl border border-indigo-400 shadow-[0_0_30px_rgba(79,70,229,0.3)] flex items-center gap-3 transform -translate-y-1/2"
                    style={{ left: treeData.root.x, top: treeData.root.y }}
                >
                    <Folder className="w-5 h-5 text-indigo-100" />
                    <span className="text-[12px] font-black uppercase tracking-widest text-white whitespace-nowrap">
                        {treeData.root.label}
                    </span>
                </motion.div>

                {/* Level 1: Format Categories */}
                {treeData.formats.map((format, i) => {
                    const Icon = format.icon;
                    return (
                        <motion.div
                            key={format.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="absolute px-5 py-3 bg-[#0a0a0f] rounded-2xl border border-white/10 shadow-xl flex items-center gap-3 transform -translate-y-1/2"
                            style={{ left: format.x, top: format.y }}
                        >
                            <Icon className={`w-4 h-4 ${format.color}`} />
                            <span className="text-[11px] font-black uppercase tracking-widest text-gray-300">
                                {format.label}
                            </span>
                        </motion.div>
                    );
                })}

                {/* Level 2: Individual Items (Strategy Nodes) */}
                {treeData.items.map((item, i) => {
                    const isSelected = selectedNodeId === item.id;
                    const typeConfig = NODE_TYPES[item.type] || NODE_TYPES.educativo;
                    const status = item.data?.status || 'Idea';
                    
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 + (i * 0.05) }}
                            onClick={() => onNodeSelect(item.id)}
                            className={`absolute w-64 p-4 rounded-2xl border transition-all cursor-pointer transform -translate-y-1/2 flex flex-col gap-2 ${
                                isSelected 
                                    ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                                    : 'bg-[#0a0a0f] border-white/5 hover:border-white/20'
                            }`}
                            style={{ left: item.x, top: item.y }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{typeConfig.label}</span>
                                {status === 'Verificado' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                            </div>
                            <span className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-gray-300'} leading-tight line-clamp-2`}>
                                {item.data?.title || 'Contenido Estratégico'}
                            </span>
                            
                            {/* Tags */}
                            <div className="flex items-center gap-2 mt-1">
                                <div className="px-2 py-1 rounded bg-white/5 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                    {item.data?.funnelLevel || 'General'}
                                </div>
                                {item.data?.publishDate && (
                                    <div className="px-2 py-1 rounded bg-indigo-500/10 text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                                        {item.data.publishDate}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
