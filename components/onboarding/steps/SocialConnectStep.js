'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Facebook, Youtube, Video, CheckCircle2, Link2, ShieldCheck, RefreshCw, Cpu, Database, ArrowRight, Eye, EyeOff } from 'lucide-react';

const platforms = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500', glow: 'shadow-pink-500/20', bg: 'bg-pink-500/5', border: 'border-pink-500/20' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-500', glow: 'shadow-blue-500/20', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
    { id: 'tiktok', label: 'TikTok', icon: Video, color: 'text-white', glow: 'shadow-white/20', bg: 'bg-white/5', border: 'border-white/10' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500', glow: 'shadow-red-500/20', bg: 'bg-red-500/5', border: 'border-red-500/20' }
];

const ConnectionPortal = ({ platform, onComplete, onCancel }) => {
    const [status, setStatus] = useState('ready');
    const [progress, setProgress] = useState(0);
    const [terminalOutput, setTerminalOutput] = useState([]);
    const [accountHandle, setAccountHandle] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const stages = {
        ready: "Secure Channel Ready for Auth",
        authenticating: "Awaiting Mock Auth Interface...",
        handshake: "Expert Protocol Handshake...",
        complete: "Cloud Sync Established"
    };

    const handshakeSteps = [
        { label: "Establishing Secure API Bridge...", p: 10 },
        { label: "Optimizing Meta Pixels...", p: 25 },
        { label: "Syncing Engagement Metrics...", p: 40 },
        { label: "Mapping Content Strategy...", p: 60 },
        { label: "Validating Ad Performance Hub...", p: 80 },
        { label: "Finalizing DIIC Cloud Link...", p: 100 }
    ];

    const addToTerminal = (text) => {
        setTerminalOutput(prev => [...prev.slice(-4), `> ${text}`]);
    };

    const startHandshake = async () => {
        setStatus('handshake');
        for (const step of handshakeSteps) {
            addToTerminal(step.label);
            setProgress(step.p);
            await new Promise(res => setTimeout(res, 800));
        }
        addToTerminal("PROTOCOL_SUCCESS: ACTIVE");
        await new Promise(res => setTimeout(res, 1000));
        onComplete(platform.id);
    };

    const handleMockLogin = () => {
        setStatus('authenticating');
        addToTerminal(`REQ_AUTH: ${platform.id.toUpperCase()}`);
        setTimeout(() => {
            // This is where we show the mock login form
        }, 500);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-md bg-[#020208] border border-white/10 rounded-[3rem] p-10 relative overflow-hidden shadow-[0_0_150px_rgba(0,0,0,1)]"
            >
                {/* Close Button */}
                <button 
                    onClick={onCancel}
                    className="absolute top-8 right-10 text-gray-700 hover:text-white transition-colors z-20 font-black text-[9px] tracking-[0.3em]"
                >
                    ESC_ABORT
                </button>

                {/* Brand Specific Glow */}
                <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-${platform.color.split('-')[1]}-500 to-transparent opacity-40`} />
                
                <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                    <AnimatePresence mode="wait">
                        {status === 'ready' ? (
                            <motion.div 
                                key="ready"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="space-y-8 py-4"
                            >
                                <div className="space-y-4">
                                    <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                                        <div className={`absolute inset-0 rounded-3xl ${platform.bg} border ${platform.border} animate-pulse`} />
                                        <platform.icon className={`w-10 h-10 ${platform.color} relative z-10`} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                                            Link <span className={platform.color}>{platform.label}</span>
                                        </h3>
                                        <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Expert_Sync_Module</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setStatus('authenticating')}
                                    className="w-full py-5 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                                >
                                    Iniciar Sesión
                                </motion.button>
                            </motion.div>
                        ) : status === 'authenticating' ? (
                            <motion.div 
                                key="auth"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full space-y-6 pt-4"
                            >
                                <div className="flex items-center gap-3 justify-center mb-4">
                                    <div className={`w-10 h-10 rounded-xl ${platform.bg} flex items-center justify-center border ${platform.border}`}>
                                        <platform.icon className={`w-5 h-5 ${platform.color}`} />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-700" />
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                        <img src="/logo-dz.png" className="w-5 h-5 invert opacity-50" alt="DZ" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-left space-y-1.5 px-2">
                                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-2">Account Identifier</label>
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="@tu_usuario"
                                            value={accountHandle}
                                            onChange={e => setAccountHandle(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-indigo-500 transition-all placeholder:text-gray-700"
                                        />
                                    </div>
                                    <div className="text-left space-y-1.5 px-2 relative">
                                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-2">Secret Key / Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-indigo-500 transition-all placeholder:text-gray-700"
                                            />
                                            <button 
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">DIIC ZONE Permissions Granted</span>
                                    </div>
                                </div>
                                <button
                                    onClick={startHandshake}
                                    disabled={!accountHandle || !password}
                                    className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all ${
                                        (accountHandle && password) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-gray-700 pointer-events-none'
                                    }`}
                                >
                                    Confirmar Acceso
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="handshake"
                                className="w-full flex flex-col items-center space-y-8"
                            >
                                <div className="relative">
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className={`w-32 h-32 rounded-full border-2 border-dashed ${platform.border} opacity-40`}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {status === 'complete' ? <CheckCircle2 className="w-12 h-12 text-emerald-500" /> : <RefreshCw className={`w-10 h-10 ${platform.color} animate-spin`} />}
                                    </div>
                                </div>

                                <div className="space-y-4 w-full">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest animate-pulse">
                                            {stages[status]}
                                        </span>
                                        <span className="text-[10px] font-mono text-white font-black">{progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Live Terminal HUD */}
                                <div className="w-full bg-black/60 rounded-2xl border border-white/5 p-4 font-mono text-[9px] text-left space-y-2 h-[120px] overflow-hidden relative">
                                    <div className="absolute top-2 right-4 opacity-30 text-[7px] uppercase tracking-widest">DIIC_TERMINAL_V.2</div>
                                    {terminalOutput.map((line, i) => (
                                        <motion.div 
                                            initial={{ x: -5, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            key={i} 
                                            className={`${line.includes('SUCCESS') ? 'text-emerald-500' : 'text-indigo-400/70'}`}
                                        >
                                            {line}
                                        </motion.div>
                                    ))}
                                    {status === 'handshake' && <div className="w-1.5 h-3 bg-indigo-500 animate-pulse inline-block align-middle ml-1" />}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Meta Data Footer */}
                    <div className="flex justify-between items-center w-full px-4 pt-4 opacity-20 border-t border-white/5">
                        <div className="font-mono text-[7px] tracking-[0.4em] uppercase">LINK_ID: {platform.id.slice(0,3)}_SYNC</div>
                        <div className="font-mono text-[7px] tracking-[0.4em] uppercase">V.09.28.EXT</div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function SocialConnectStep({ onNext, updateData }) {
    const [connected, setConnected] = useState({});
    const [activePortal, setActivePortal] = useState(null);

    const handleConnectComplete = (id) => {
        setConnected(prev => ({ ...prev, [id]: true }));
        setActivePortal(null);
    };

    const togglePlatform = (p) => {
        if (connected[p.id]) {
            setConnected(prev => {
                const ns = { ...prev };
                delete ns[p.id];
                return ns;
            });
        } else {
            setActivePortal(p);
        }
    };

    const handleContinue = () => {
        updateData({ social: Object.keys(connected) });
        onNext();
    };

    return (
        <div className="space-y-8 flex flex-col h-full w-full max-w-3xl mx-auto py-4">
            <div className="text-center space-y-2">
                <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                    Ecosistema <span className="text-indigo-500">Social</span>
                </h2>
                <p className="text-gray-400 text-xs font-medium tracking-wide">
                    Conecta tus canales para automatizar publicaciones y métricas globales.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1 content-start">
                <AnimatePresence mode="popLayout">
                    {platforms.map((p, idx) => (
                        <motion.button
                            key={p.id}
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => togglePlatform(p)}
                            className={`group relative flex items-center justify-between p-7 rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                                connected[p.id] 
                                ? `bg-emerald-500/5 border-emerald-500/30 ${p.glow}` 
                                : `bg-white/[0.02] border-white/10 hover:border-white/30`
                            }`}
                        >
                            {/* Inner Glow Base */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[80px] ${p.bg} -z-10`} />
                            
                            <div className="flex items-center gap-6 relative z-10">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-2xl ${
                                    connected[p.id] ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-black/40 border border-white/5'
                                }`}>
                                    <p.icon className={`w-7 h-7 ${connected[p.id] ? 'text-black' : p.color}`} />
                                </div>
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="font-black text-xl italic uppercase tracking-tighter text-white">{p.label}</span>
                                    <span className="text-[8px] font-mono font-black text-gray-500 uppercase tracking-widest">
                                        {connected[p.id] ? 'PROTOCOL_ESTABLISHED' : 'READY_TO_SYNC'}
                                    </span>
                                </div>
                            </div>

                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                connected[p.id] 
                                ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                                : 'border-white/10 text-transparent'
                            }`}>
                                {connected[p.id] ? <CheckCircle2 className="w-5 h-5 font-black" /> : <Link2 className="w-4 h-4 text-gray-700" />}
                            </div>
                            
                            {/* Technical Corner Label */}
                            <div className="absolute top-4 right-4 opacity-5 pointer-events-none">
                                <ShieldCheck className="w-4 h-4 text-white" />
                            </div>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            <div className="space-y-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinue}
                    className={`w-full py-5 rounded-[1.8rem] font-black text-lg uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 relative overflow-hidden ${
                        Object.keys(connected).length > 0 
                        ? 'bg-white text-black shadow-[0_15px_40px_rgba(255,255,255,0.15)] hover:shadow-white/20' 
                        : 'bg-indigo-600/10 text-indigo-500 border border-indigo-500/20'
                    }`}
                >                
                    {Object.keys(connected).length > 0 
                        ? `Proceed (${Object.keys(connected).length} Linked)` 
                        : 'Skip Connectivity'}
                </motion.button>

                {/* Micro Data Footer */}
                <div className="flex justify-between items-center px-6 opacity-30 font-mono text-[7px] tracking-[0.3em] uppercase">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        Network_Active
                    </div>
                    <span>DIIC_HANDSHAKE_v4.2</span>
                </div>
            </div>

            {/* Connection Portal Modal */}
            <AnimatePresence>
                {activePortal && (
                    <ConnectionPortal 
                        platform={activePortal} 
                        onComplete={handleConnectComplete}
                        onCancel={() => setActivePortal(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
