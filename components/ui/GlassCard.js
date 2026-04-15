'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // We'll need to create this util or inline clsx/tailwind-merge

export default function GlassCard({ children, className, hoverEffect = true, ...props }) {
    return (
        <motion.div
            whileHover={hoverEffect ? { scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' } : {}}
            className={`glass-card rounded-xl p-6 transition-colors duration-300 ${className || ''}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}
