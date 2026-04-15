'use client';

import { useState, useRef, useEffect } from 'react';
import { MousePointer2, Box, Move3d } from 'lucide-react';

export default function Css3DEngine({ scenes, activeSceneId }) {
    // Current Scene Data
    const activeScene = scenes.find(s => s.id === activeSceneId) || scenes[0];
    const objects = activeScene?.objects || [];

    // Camera State
    const [rotation, setRotation] = useState({ x: 60, y: 0 }); // Initial view angle
    const [zoom, setZoom] = useState(1000); // TranslateZ
    const [isDragging, setIsDragging] = useState(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // --- Controls ---
    const handleMouseDown = (e) => {
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;

        setRotation(prev => ({
            x: Math.min(Math.max(prev.x - deltaY * 0.5, 0), 90), // Clamp pitch
            y: prev.y + deltaX * 0.5
        }));

        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e) => {
        setZoom(prev => Math.min(Math.max(prev + e.deltaY, 200), 2000));
    };

    // --- Demo Objects if scene is empty ---
    const renderObjects = objects.length > 0 ? objects : [
        { id: 'demo1', type: 'cube', x: 0, z: 0, color: '#6366f1' },
        { id: 'demo2', type: 'cube', x: 200, z: -200, color: '#ec4899' },
        { id: 'demo3', type: 'cube', x: -200, z: -200, color: '#06b6d4' },
    ];

    return (
        <div
            className="w-full h-full bg-[#050511] overflow-hidden relative cursor-move select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        >
            {/* HUD / UI Overlay */}
            <div className="absolute top-4 left-4 z-50 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg p-3 text-xs text-white">
                    <h3 className="font-bold mb-1 flex items-center gap-2">
                        <Move3d className="w-3 h-3 text-indigo-400" /> CSS 3D Engine
                    </h3>
                    <p className="text-gray-400">Rotación: X {Math.round(rotation.x)}° | Y {Math.round(rotation.y)}°</p>
                    <p className="text-gray-400">Zoom: {zoom}px</p>
                </div>
            </div>

            <div className="absolute bottom-4 left-4 z-50 pointer-events-none text-[10px] text-gray-500">
                Arrastra para rotar • Rueda para zoom
            </div>

            {/* 3D Scene Container */}
            <div
                className="w-full h-full flex items-center justify-center"
                style={{
                    perspective: '1000px',
                    overflow: 'hidden'
                }}
            >
                {/* World (Rotatable) */}
                <div
                    style={{
                        transform: `translateZ(-${zoom / 2}px) rotateX(${rotation.x}deg) rotateZ(${-rotation.y}deg)`,
                        transformStyle: 'preserve-3d',
                        width: '0px',
                        height: '0px',
                        position: 'relative',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                >
                    {/* Floor Grid */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{
                            width: '2000px',
                            height: '2000px',
                            background: `
                                linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                            `,
                            backgroundSize: '100px 100px',
                            transform: 'translateZ(0px)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        {/* Center Marker */}
                        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_white]"></div>
                    </div>

                    {/* Objects */}
                    {renderObjects.map(obj => (
                        <div
                            key={obj.id}
                            className="absolute top-1/2 left-1/2 group"
                            style={{
                                transform: `translate3d(${obj.x}px, ${obj.z}px, 50px) rotateX(-90deg)`, // Billboard effect or Cube position
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            {/* Cube / Object Body */}
                            <div
                                className="w-24 h-24 -ml-12 -mt-12 relative transition-transform duration-300 group-hover:scale-110"
                            >
                                {/* Front Face (Visual) */}
                                <div
                                    className="absolute inset-0 flex items-center justify-center border-2 border-white/20 shadow-lg"
                                    style={{
                                        backgroundColor: obj.color + '40', // 25% opacity
                                        boxShadow: `0 0 30px ${obj.color}20`
                                    }}
                                >
                                    <Box className="w-8 h-8 text-white opacity-50" />
                                </div>
                                {/* Top Face (Lid) */}
                                <div
                                    className="absolute inset-0 bg-white/10"
                                    style={{ transform: 'translateZ(12px)' }}
                                ></div>
                                {/* Label floating above */}
                                <div
                                    className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-black/80 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ transform: `rotateX(90deg)` }} // Counter-rotate to face camera roughly
                                >
                                    Objeto 3D
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}
