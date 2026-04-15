'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function VisionEcosystem({ client }) {
    // Definimos grupos de nodos basados en el estilo "Vision Ecosystem"
    const groups = [
        { id: 'content', color: '#FF6B9D', label: 'Contenidos', nodes: ['Reels', 'TikTok', 'YouTube', 'Fotos'] },
        { id: 'strategy', color: '#4ADE80', label: 'Estrategia', nodes: ['Ads', 'SEO', 'Email', 'Landing'] },
        { id: 'team', color: '#FACC15', label: 'Equipo', nodes: ['CM', 'Editor', 'Diseño', 'Copy'] },
        { id: 'sales', color: '#A855F7', label: 'Ventas', nodes: ['Funnel', 'High Ticket', 'CRM', 'Bot'] }
    ];

    // Posicionamiento en orbitales
    const getPos = (angle, dist) => {
        const x = 50 + dist * Math.cos((angle * Math.PI) / 180);
        const y = 50 + dist * Math.sin((angle * Math.PI) / 180);
        return { x, y };
    };

    return (
        <div className="relative w-full aspect-square max-w-[400px] mx-auto overflow-visible select-none">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                {/* Conexiones de fondo */}
                <defs>
                    <radialGradient id="lineGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(99, 102, 241, 0.2)" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Círculos orbitales */}
                <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />

                {/* Líneas de conexión */}
                {groups.map((g, gi) => {
                    const startPos = getPos(gi * 90, 40);
                    return (
                        <g key={`lines-${g.id}`}>
                            <line 
                                x1="50" y1="50" x2={startPos.x} y2={startPos.y} 
                                stroke={g.color} strokeWidth="0.2" strokeOpacity="0.2" 
                                strokeDasharray="1 1"
                            />
                            {g.nodes.map((n, ni) => {
                                const angle = gi * 90 + (ni - 1.5) * 15;
                                const nodePos = getPos(angle, 40);
                                return (
                                    <line 
                                        key={`subline-${ni}`}
                                        x1="50" y1="50" x2={nodePos.x} y2={nodePos.y} 
                                        stroke={g.color} strokeWidth="0.1" strokeOpacity="0.1" 
                                    />
                                );
                            })}
                        </g>
                    );
                })}

                {/* Nodos de Grupo */}
                {groups.map((g, gi) => {
                    const pos = getPos(gi * 90, 25);
                    return (
                        <motion.g 
                            key={g.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: gi * 0.1 }}
                        >
                            <circle 
                                cx={pos.x} cy={pos.y} r="3" 
                                fill={g.color} fillOpacity="0.1" 
                                stroke={g.color} strokeWidth="0.5" 
                                filter="url(#glow)"
                            />
                            <text 
                                x={pos.x} y={pos.y + 6} 
                                className="text-[2px] font-black uppercase text-gray-500 text-center"
                                textAnchor="middle"
                            >
                                {g.label}
                            </text>
                        </motion.g>
                    );
                })}

                {/* Nodos Individuales Reales */}
                {groups.map((g, gi) => (
                    g.nodes.map((n, ni) => {
                        const angle = gi * 90 + (ni - 1.5) * 15;
                        const pos = getPos(angle, 40);
                        return (
                            <motion.g 
                                key={`${g.id}-${n}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 + ni * 0.05 }}
                            >
                                <circle 
                                    cx={pos.x} cy={pos.y} r="1.5" 
                                    fill={g.color} 
                                    className="cursor-pointer hover:r-2 transition-all"
                                />
                                <text 
                                    x={pos.x} y={pos.y - 3} 
                                    className="fill-gray-600 text-[1.5px] font-bold"
                                    textAnchor="middle"
                                >
                                    {n}
                                </text>
                            </motion.g>
                        );
                    })
                ))}

                {/* Núcleo Central */}
                <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10 }}
                >
                    <circle 
                        cx="50" cy="50" r="8" 
                        fill="#6366F1" fillOpacity="0.1" 
                        stroke="#6366F1" strokeWidth="0.5"
                        filter="url(#glow)"
                    />
                    <text 
                        x="50" y="52" 
                        className="fill-white text-[4px] font-black italic tracking-tighter"
                        textAnchor="middle"
                    >
                        {client?.name?.[0]}
                    </text>
                </motion.g>
            </svg>

            {/* Legend / Info */}
            <div className="absolute top-0 left-0 p-4 border-l border-indigo-500/20 bg-white/[0.02] rounded-r-xl backdrop-blur-sm">
                <div className="text-[8px] font-black text-indigo-400 tracking-widest uppercase mb-1">Estatus del Ecosistema</div>
                <div className="text-white text-xs font-black italic uppercase">Modo Vision Activo</div>
            </div>
        </div>
    );
}
