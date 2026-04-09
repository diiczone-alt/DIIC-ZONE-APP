'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Wifi, Cpu, Globe, ArrowRight } from 'lucide-react';

export default function AuthStep({ onNext, updateData }) {
    // Magnetic Effect for the Button
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-100, 100], [10, -10]);
    const rotateY = useTransform(mouseXSpring, [-100, 100], [-10, 10]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left - width / 2;
        const mouseY = e.clientY - rect.top - height / 2;
        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleLogin = () => {
        updateData({ auth: { method: 'google', timestamp: new Date().toISOString() } });
        onNext();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[450px] text-center space-y-12 max-w-lg mx-auto relative">
            
            {/* God Mode Visual: Status HUD Labels */}
            <div className="absolute top-0 left-0 w-full flex justify-between px-4 opacity-20 pointer-events-none">
                <div className="flex items-center gap-2 font-mono text-[8px] tracking-[0.2em]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    SYSTEM_READY: 200
                </div>
                <div className="flex items-center gap-2 font-mono text-[8px] tracking-[0.2em]">
                    ENCRYPTION: AES-256
                </div>
            </div>

            {/* Holographic Logo with Rotating Status Ring */}
            <div className="relative group">
                {/* Rotating Rings */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-8 border border-indigo-500/10 rounded-full border-dashed"
                />
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 border-2 border-indigo-500/20 rounded-full border-t-indigo-500/50"
                />
                
                {/* Logo Core */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-28 h-28 bg-gradient-to-br from-[#0A0A1F] to-[#1A1A3F] rounded-[40px] flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.4)] border border-white/20 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent)]" />
                    <span className="text-6xl font-black text-white tracking-tighter italic drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">DZ</span>
                    <motion.div 
                        animate={{ y: [-100, 200] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-full h-[2px] bg-indigo-400/30 blur-[1px] opacity-50"
                    />
                </motion.div>
                
                {/* Float Indicators */}
                <div className="absolute -top-2 -right-8 bg-indigo-500/10 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[8px] font-mono text-indigo-400">
                    ID: GLOBAL_CORE
                </div>
            </div>

            <div className="space-y-4">
                <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-black text-white tracking-tight italic uppercase leading-none"
                >
                    DIIC<span className="text-indigo-500">ZONE</span>
                </motion.h1>
                <div className="flex flex-wrap justify-center gap-4 py-2">
                    {[
                        { icon: ShieldCheck, label: 'Secure' },
                        { icon: Globe, label: 'Global' },
                        { icon: Cpu, label: 'Intelligent' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 font-mono text-[9px] uppercase tracking-widest text-gray-400">
                            <item.icon className="w-3 h-3 text-indigo-500" />
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Liquid Glass Login Button */}
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="w-full relative px-6"
            >
                <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                    onClick={handleLogin}
                    className="group relative w-full py-6 bg-white text-black rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(255,255,255,0.15)] hover:shadow-[0_30px_70px_rgba(79,70,229,0.4)] transition-all overflow-hidden"
                >
                    {/* Interior Shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-200/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    
                    <svg className="w-7 h-7 relative z-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="relative z-10">Iniciar con Google</span>
                    <ArrowRight className="w-6 h-6 relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
            </motion.div>

            <div className="pt-6 font-mono text-[9px] text-gray-600 uppercase tracking-[0.3em] font-black space-y-1">
                <p>ACCESSING SECURE STUDIO PROTOCOL</p>
                <div className="flex justify-center gap-4">
                    <span>IP: 192.168.1.1</span>
                    <span>LAT: 18.4861° N</span>
                    <span>LONG: 69.9312° W</span>
                </div>
            </div>
        </div>
    );
}
