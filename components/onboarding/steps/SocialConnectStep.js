'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Instagram, Facebook, Youtube, Video, CheckCircle2, 
    Link2, ShieldCheck, RefreshCw, Cpu, Database, 
    ArrowRight, Eye, EyeOff, Plus, Twitter, Linkedin, 
    Twitch, AlertTriangle, AlertCircle
} from 'lucide-react';
import { socialService } from '@/services/socialService';
import { adsService } from '@/services/adsService';
import { toast } from 'sonner';

const platforms = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500', glow: 'shadow-pink-500/20', bg: 'bg-pink-500/5', border: 'border-pink-500/20', provider: 'facebook', ads: true },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-500', glow: 'shadow-blue-500/20', bg: 'bg-blue-500/5', border: 'border-blue-500/20', provider: 'facebook', ads: true },
    { id: 'tiktok', label: 'TikTok', icon: Video, color: 'text-white', glow: 'shadow-white/20', bg: 'bg-white/5', border: 'border-white/10', provider: 'tiktok', ads: true },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500', glow: 'shadow-red-500/20', bg: 'bg-red-500/5', border: 'border-red-500/20', provider: 'google', ads: false }
];

// ... (extraPlatforms)

export default function SocialConnectStep({ onNext, updateData }) {
    const [connected, setConnected] = useState({});
    const [loading, setLoading] = useState(false);
    const [showExtras, setShowExtras] = useState(false);
    const [showSkipConfirm, setShowSkipConfirm] = useState(false);
    
    // Ads selection state
    const [selectingAccountsFor, setSelectingAccountsFor] = useState(null);
    const [availableAccounts, setAvailableAccounts] = useState([]);
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [loadingAccounts, setLoadingAccounts] = useState(false);
    const [savedAdAccounts, setSavedAdAccounts] = useState({});

    useEffect(() => {
        const checkConnections = async () => {
            try {
                const identities = await socialService.getLinkedAccounts();
                const connectedMap = {};
                platforms.concat(extraPlatforms).forEach(p => {
                    if (identities.includes(p.provider)) {
                        connectedMap[p.id] = true;
                    }
                });
                setConnected(connectedMap);

                // También cargar cuentas publicitarias ya guardadas
                const saved = await adsService.getSelectedAccounts();
                const savedMap = {};
                saved.forEach(acc => {
                    if (!savedMap[acc.platform]) savedMap[acc.platform] = [];
                    savedMap[acc.platform].push(acc);
                });
                setSavedAdAccounts(savedMap);

            } catch (err) {
                console.error('[SocialConnectStep] Failed to check identities');
            }
        };
        checkConnections();
    }, []);

    const handleConnect = async (platform) => {
        if (connected[platform.id]) {
            // Si ya está conectado y tiene anuncios, abrir selector
            if (platform.ads) {
                openAccountSelector(platform);
            }
            return;
        }

        setLoading(true);
        try {
            toast.info(`Iniciando conexión segura con ${platform.label}...`);
            await socialService.connect(platform.provider);
        } catch (err) {
            toast.error(`Error al conectar ${platform.label}`);
            setLoading(false);
        }
    };

    const openAccountSelector = async (platform) => {
        setSelectingAccountsFor(platform);
        setLoadingAccounts(true);
        setSelectedAccounts([]);
        try {
            const accounts = await adsService.fetchAvailableAccounts(platform.provider);
            setAvailableAccounts(accounts);
            
            // Marcar las que ya estaban seleccionadas
            const currentSaved = savedAdAccounts[platform.provider] || [];
            setSelectedAccounts(currentSaved.map(s => s.external_id));
        } catch (err) {
            if (err.message === "TOKEN_EXPIRED") {
                toast.error(`La sesión de ${platform.label} ha expirado. Por favor, reconecta.`);
                setConnected(prev => ({ ...prev, [platform.id]: false }));
            } else {
                toast.error(`No pudimos encontrar tus cuentas de ${platform.label}`);
            }
            setSelectingAccountsFor(null);
        } finally {
            setLoadingAccounts(false);
        }
    };

    const toggleAccount = (accountId) => {
        setSelectedAccounts(prev => 
            prev.includes(accountId) 
            ? prev.filter(id => id !== accountId) 
            : [...prev, accountId]
        );
    };

    const handleSaveAccounts = async () => {
        setLoadingAccounts(true);
        try {
            const platform = selectingAccountsFor;
            const accountsToSave = availableAccounts.filter(a => selectedAccounts.includes(a.id));
            
            await adsService.saveSelectedAccounts(platform.provider, accountsToSave);
            
            toast.success(`Cuentas de ${platform.label} vinculadas.`);
            
            // Actualizar estado local
            setSavedAdAccounts(prev => ({
                ...prev,
                [platform.provider]: accountsToSave
            }));
            
            setSelectingAccountsFor(null);
        } catch (err) {
            toast.error("Error al guardar la selección");
        } finally {
            setLoadingAccounts(false);
        }
    };

    const handleContinue = () => {
        updateData({ social: Object.keys(connected) });
        onNext();
    };

    return (
        <div className="space-y-8 flex flex-col h-full w-full max-w-3xl mx-auto py-4 relative">
            <div className="text-center space-y-2">
                <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                    Ecosistema <span className="text-indigo-500">Social</span>
                </h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
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
                            onClick={() => handleConnect(p)}
                            className={`group relative flex items-center justify-between p-7 rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                                connected[p.id] 
                                ? `bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]` 
                                : `bg-white/[0.02] border-white/10 hover:border-white/30`
                            }`}
                        >
                            <div className="flex items-center gap-6 relative z-10">
                                <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${
                                    connected[p.id] ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-black/40 border border-white/5'
                                }`}>
                                    <p.icon className={`w-6 h-6 ${connected[p.id] ? 'text-black' : p.color}`} />
                                </div>
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="font-black text-xl italic uppercase tracking-tighter text-white">{p.label}</span>
                                    <span className="text-[8px] font-mono font-black text-gray-500 uppercase tracking-widest">
                                        {connected[p.id] ? (
                                            (savedAdAccounts[p.provider]?.length > 0) 
                                            ? `${savedAdAccounts[p.provider].length} CUENTAS_SYNC` 
                                            : 'PROTOCOL_ESTABLISHED'
                                        ) : 'READY_TO_SYNC'}
                                    </span>
                                </div>
                            </div>
                            
                            {connected[p.id] && p.ads && (
                                <div className="absolute top-4 right-4 animate-pulse">
                                    <div className="bg-emerald-500/20 px-2 py-1 rounded-md border border-emerald-500/30">
                                        <span className="text-[7px] text-emerald-400 font-black">ADS_OK</span>
                                    </div>
                                </div>
                            )}

                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                connected[p.id] 
                                ? 'bg-emerald-500 border-emerald-500 text-black' 
                                : 'border-white/10 text-transparent'
                            }`}>
                                {connected[p.id] ? <CheckCircle2 className="w-4 h-4" /> : <Link2 className="w-4 h-4 text-gray-700" />}
                            </div>
                        </motion.button>
                    ))}

                    {/* Button for More Networks */}
                    {!showExtras && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setShowExtras(true)}
                            className="flex items-center justify-center gap-3 p-7 rounded-[2rem] border border-dashed border-white/10 hover:border-white/30 transition-all bg-white/[0.01] min-h-[100px]"
                        >
                            <Plus className="w-6 h-6 text-indigo-500" />
                            <span className="font-black text-xs uppercase tracking-widest text-gray-500">Añadir Otros</span>
                        </motion.button>
                    )}

                    {showExtras && extraPlatforms.map((p, idx) => (
                        <motion.button
                            key={p.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleConnect(p)}
                            className={`group relative flex items-center justify-between p-7 rounded-[2rem] border transition-all ${
                                connected[p.id] ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/[0.02] border-white/10 hover:border-white/30'
                            }`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${connected[p.id] ? 'bg-emerald-500' : 'bg-black/40 border border-white/5'}`}>
                                    <p.icon className={`w-6 h-6 ${connected[p.id] ? 'text-black' : p.color}`} />
                                </div>
                                <span className="font-black text-xl italic uppercase tracking-tighter text-white">{p.label}</span>
                            </div>
                            {connected[p.id] && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            <div className="pt-8 px-2 md:px-0">
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleContinue}
                    className={`w-full py-5 rounded-[2rem] font-black text-lg uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 ${
                        Object.keys(connected).length > 0 
                        ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30' 
                        : 'bg-white/5 text-gray-500 border border-white/10'
                    }`}
                >                
                    {Object.keys(connected).length > 0 
                        ? (
                            (Object.values(savedAdAccounts).flat().length > 0)
                            ? `Protocolo Activo (${Object.values(savedAdAccounts).flat().length} Cuentas)`
                            : `Avanzar con ${Object.keys(connected).length} Conexiones`
                        )
                        : 'Omitir por ahora'} <ArrowRight className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Account Selector Modal */}
            <AnimatePresence>
                {selectingAccountsFor && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            className="bg-[#0D0D15] border border-white/10 w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(79,70,229,0.1)] flex flex-col max-h-[85vh]"
                        >
                            <div className="p-10 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center ${selectingAccountsFor.bg} border ${selectingAccountsFor.border}`}>
                                        <selectingAccountsFor.icon className={`w-7 h-7 ${selectingAccountsFor.color}`} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Cuentas Publicitarias</h3>
                                        <p className="text-gray-500 text-[10px] font-mono tracking-widest uppercase">SELECT_AD_DATA_SOURCES</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-4 custom-scrollbar">
                                {loadingAccounts ? (
                                    <div className="py-20 text-center space-y-4">
                                        <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin mx-auto opacity-50" />
                                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest animate-pulse">Analizando Red...</p>
                                    </div>
                                ) : availableAccounts.length === 0 ? (
                                    <div className="py-20 text-center space-y-6">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                            <AlertCircle className="w-8 h-8 text-gray-600" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-gray-400 font-bold uppercase text-xs">No encontramos cuentas publicitarias</p>
                                            <p className="text-gray-600 text-[10px]">Asegúrate de que este perfil sea administrador en el Business Manager de {selectingAccountsFor.label}.</p>
                                        </div>
                                        <button 
                                            onClick={() => setSelectingAccountsFor(null)}
                                            className="text-indigo-500 text-[10px] font-black uppercase underline tracking-widest"
                                        >
                                            Entendido
                                        </button>
                                    </div>
                                ) : (
                                    availableAccounts.map(acc => (
                                        <div 
                                            key={acc.id}
                                            onClick={() => toggleAccount(acc.id)}
                                            className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${
                                                selectedAccounts.includes(acc.id)
                                                ? 'bg-indigo-500/10 border-indigo-500/40'
                                                : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                                            }`}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-black text-white uppercase italic tracking-tight">{acc.name}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-mono text-gray-500">{acc.account_id}</span>
                                                    <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[8px] font-bold text-gray-400">{acc.currency}</span>
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                selectedAccounts.includes(acc.id)
                                                ? 'bg-indigo-500 border-indigo-500 text-black'
                                                : 'border-white/10'
                                            }`}>
                                                {selectedAccounts.includes(acc.id) && <CheckCircle2 className="w-3 h-3" />}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-10 bg-white/[0.02] border-t border-white/5 flex gap-4">
                                <button 
                                    onClick={() => setSelectingAccountsFor(null)}
                                    className="flex-1 py-4 text-gray-500 font-black text-xs uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleSaveAccounts}
                                    disabled={loadingAccounts}
                                    className={`flex-[2] py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                                        selectedAccounts.length > 0 
                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
                                        : 'bg-white/10 text-gray-600 pointer-events-none'
                                    }`}
                                >
                                    Confirmar Selección
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Skip Confirmation Modal (Same as before) */}
            <AnimatePresence>
                {showSkipConfirm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[140] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#0A0A12] border border-red-500/20 p-10 rounded-[3rem] max-w-sm text-center space-y-8 shadow-[0_0_100px_rgba(239,68,68,0.1)]"
                        >
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">¿Omitir Protocolo?</h3>
                                <p className="text-gray-500 text-xs leading-relaxed">
                                    Sin conexiones sociales activas, DIIC ZONE <span className="text-white font-bold">no podrá automatizar métricas</span> ni programar contenido global.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => setShowSkipConfirm(false)}
                                    className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest"
                                >
                                    Volver a Conectar
                                </button>
                                <button 
                                    onClick={() => { setShowSkipConfirm(false); onNext(); }}
                                    className="w-full py-4 text-gray-500 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest"
                                >
                                    Confirmar Omisión
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

