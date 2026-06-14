'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function BrandLogo({ className = "w-6 h-6", color = "currentColor" }) {
    const svgRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
            
            // Limit the maximum eye offset (say 3.5 units in SVG space)
            const maxOffset = 3.5; 
            
            let offsetX = 0;
            let offsetY = 0;
            if (dist > 0) {
                // Adjust scale factor (0.04) to control sensitivity
                offsetX = (dx / dist) * Math.min(dist * 0.04, maxOffset);
                offsetY = (dy / dist) * Math.min(dist * 0.04, maxOffset);
            }
            
            setMousePos({ x: offsetX, y: offsetY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <svg 
            ref={svgRef}
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Top Hook Curve to Right Peak */}
            <path 
                d="M 21,50 C 21,28 28,18 48,18 L 84,50" 
                stroke={color} 
                strokeWidth="8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
            {/* Bottom Hook Curve to Right Peak */}
            <path 
                d="M 19,63 C 19,81 29,82 41,82 L 84,50" 
                stroke={color} 
                strokeWidth="8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
            {/* Left Vertical Oval with Blink & Look Animation */}
            <motion.ellipse 
                cx="34" 
                cy="50" 
                rx="5" 
                fill={color} 
                animate={{
                    ry: [14, 14, 1, 14, 14],
                    x: mousePos.x,
                    y: mousePos.y
                }}
                transition={{
                    ry: {
                        duration: 4,
                        repeat: Infinity,
                        times: [0, 0.82, 0.85, 0.88, 1],
                        ease: "easeInOut"
                    },
                    x: { type: "spring", stiffness: 120, damping: 14 },
                    y: { type: "spring", stiffness: 120, damping: 14 }
                }}
            />
            {/* Right Vertical Oval with Blink & Look Animation */}
            <motion.ellipse 
                cx="48" 
                cy="50" 
                rx="5" 
                fill={color} 
                animate={{
                    ry: [14, 14, 1, 14, 14],
                    x: mousePos.x,
                    y: mousePos.y
                }}
                transition={{
                    ry: {
                        duration: 4,
                        repeat: Infinity,
                        times: [0, 0.82, 0.85, 0.88, 1],
                        ease: "easeInOut"
                    },
                    x: { type: "spring", stiffness: 120, damping: 14 },
                    y: { type: "spring", stiffness: 120, damping: 14 }
                }}
            />
        </svg>
    );
}


