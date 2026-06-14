import React from 'react';

export default function BrandLogo({ className = "w-6 h-6", color = "currentColor" }) {
    return (
        <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Top Hook Curve to Right Peak */}
            <path 
                d="M 21,50 C 21,28 28,18 48,18 L 84,50" 
                stroke={color} 
                strokeWidth="11" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
            {/* Bottom Hook Curve to Right Peak */}
            <path 
                d="M 19,63 C 19,81 29,82 41,82 L 84,50" 
                stroke={color} 
                strokeWidth="11" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
            {/* Left Vertical Oval */}
            <ellipse cx="34" cy="50" rx="5" ry="14" fill={color} />
            {/* Right Vertical Oval */}
            <ellipse cx="48" cy="50" rx="5" ry="14" fill={color} />
        </svg>
    );
}
