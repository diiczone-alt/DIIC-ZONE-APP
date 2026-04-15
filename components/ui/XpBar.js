'use client';

import { motion } from 'framer-motion';

export default function XpBar({ currentXp, nextLevelXp, level }) {
    const progress = Math.min((currentXp / nextLevelXp) * 100, 100);

    return (
        <div className="w-full max-w-md">
            <div className="flex justify-between mb-2 text-sm font-medium text-muted-foreground">
                <span>LVL {level}</span>
                <span>{currentXp} / {nextLevelXp} XP</span>
            </div>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden relative">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-accent absolute top-0 left-0"
                />
                {/* Glow effect */}
                <motion.div
                    animate={{ x: [-200, 400] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-full w-20 bg-white/20 blur-md absolute top-0 left-0"
                />
            </div>
        </div>
    );
}
