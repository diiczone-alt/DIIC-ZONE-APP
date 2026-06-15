'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function BrandLogo({ className = "w-6 h-6", color = "currentColor" }) {
    const svgRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!svgRef.current) return;
            const rect = svgRef.current.getBoundingClientRect();
            
            // Calculate the center of the SVG
            const svgCenterX = rect.left + rect.width / 2;
            const svgCenterY = rect.top + rect.height / 2;
            
            // Vector from SVG center to mouse position
            const dx = e.clientX - svgCenterX;
            const dy = e.clientY - svgCenterY;
            
            // Distance
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Limit the maximum offset in SVG coordinate space (out of 100)
            const maxOffset = 2.5; 
            
            let offsetX = 0;
            let offsetY = 0;
            if (dist > 0) {
                // Control sensitivity: 0.02
                offsetX = (dx / dist) * Math.min(dist * 0.02, maxOffset);
                offsetY = (dy / dist) * Math.min(dist * 0.02, maxOffset);
            }
            
            setMousePos({ x: offsetX, y: offsetY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Unique ID for mask to prevent conflicts if multiple instances are rendered
    const maskId = useRef(`play-mask-${Math.random().toString(36).substr(2, 9)}`);

    return (
        <svg 
            ref={svgRef}
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <defs>
                <mask id={maskId.current}>
                    {/* Everything white in the mask remains visible */}
                    <rect x="0" y="0" width="100" height="100" fill="white" />
                    {/* Everything black in the mask is punched out */}
                    <motion.polygon 
                        points="43,38 63,50 43,62" 
                        fill="black" 
                        animate={{ 
                            x: mousePos.x, 
                            y: mousePos.y,
                            scale: isHovered ? 1.15 : 1
                        }}
                        transition={{ 
                            scale: { type: "spring", stiffness: 300, damping: 15 },
                            x: { type: "spring", stiffness: 150, damping: 15 },
                            y: { type: "spring", stiffness: 150, damping: 15 }
                        }}
                        style={{ originX: "50px", originY: "50px" }}
                    />
                </mask>
            </defs>

            {/* D Shape */}
            <motion.path 
                d="M 28,20 L 52,20 C 68,20 80,32 80,50 C 80,68 68,80 52,80 L 28,80 Z" 
                fill={color} 
                mask={`url(#${maskId.current})`}
                animate={{
                    filter: isHovered ? "drop-shadow(0px 0px 8px rgba(255,255,255,0.4))" : "drop-shadow(0px 0px 0px rgba(255,255,255,0))"
                }}
                transition={{ duration: 0.3 }}
            />
        </svg>
    );
}


