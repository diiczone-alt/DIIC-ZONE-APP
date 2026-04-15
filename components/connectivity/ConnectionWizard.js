'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, CheckCircle2, Shield, Settings, Zap, ArrowRight, Loader2,
    QrCode, Lock, Globe, MessageSquare, LayoutDashboard, Database,
    Smartphone, BellRing, Users, Server, Radio, Link as LinkIcon
} from 'lucide-react';

export default function ConnectionWizard({ channel, onClose }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('idle'); // idle, testing, success, error
    const [selectedAsset, setSelectedAsset] = useState(null);

    // Mock Assets for Step 3
    const mockAssets = [
        { id: 1, name: 'Empresa Principal', type: 'Business Account' },
        { id: 2, name: 'Soporte Técnico', type: 'Page' },
        { id: 3, name: 'Ventas Directas', type: 'Profile' }
    ];

    // 5-Step Unified Flow
    const steps = [
        { id: 1, title: 'Resumen', description: 'Capacidades' },
        { id: 2, title: 'Login', description: 'Autenticación' },
        { id: 3, title: 'Activo', description: 'Selección' },
        { id: 4, title: 'Test', description: 'Verificación' },
        { id: 5, title: 'Activar', description: 'Permisos' }
    ];

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1);
        } else {
            handleFinish();
        }
    };

    const handleTestConnection = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setConnectionStatus('success');
        }, 1500);
    };

    const handleFinish = () => {
        setLoading(true);
        // Simulate Final Activation
        setTimeout(() => {
            onClose();
            // Trigger parent update here in real app
        }, 1500);
    };

    if (!channel) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#0E0E18] border border-white/10 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#151520]">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${channel.bg} flex items-center justify-center border border-white/5`}>
                            <channel.icon className={`w-6 h-6 ${channel.color}`} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Conectar {channel.name}</h2>
                            <p className="text-xs text-gray-400">Asistente de Integración Unificado</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500 hover:text-white" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-10 pt-8 pb-4">
                    <div className="flex justify-between relative">
                        {/* Line Background */}
                        <div className="absolute top-4 left-0 w-full h-0.5 bg-white/5 -z-10"></div>

                        {steps.map((s, i) => {
                            const isActive = s.id === step;
                            const isCompleted = s.id < step;

                            return (
                                <div key={s.id} className="flex flex-col items-center gap-3 bg-[#0E0E18] px-4 relative z-10 w-24">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 
                                        ${isActive ? 'bg-indigo-600 border-indigo-500 text-white scale-110 shadow-[0_0_15px_rgba(99,102,241,0.5)]' :
                                            isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-[#151520] border-white/10 text-gray-500'}`}
                                    >
                                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                                    </div>
                                    <span className={`text-[10px] uppercase tracking-wider font-bold text-center leading-tight ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                        {s.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-10 min-h-[400px] flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: SUMMARY */}
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-2xl space-y-8">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white mb-2">Comienza tu Integración</h3>
                                    <p className="text-gray-400">Estás a punto de potenciar <strong>{channel.name}</strong> con inteligencia artificial y automatización.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FeatureCard icon={Zap} title="Respuestas IA 24/7" desc="Atención inmediata a consultas y ventas." />
                                    <FeatureCard icon={ArrowRight} title="Sync CRM" desc="Creación y actualización automática de leads." />
                                    <FeatureCard icon={Shield} title="Seguridad Total" desc="Encriptado extremo a extremo y privacidad." />
                                    <FeatureCard icon={LayoutDashboard} title="Analítica en Vivo" desc="Reportes de conversión y rendimiento." />
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: LOGIN / AUTH */}
                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center justify-center space-y-6 w-full">
                                <div className="text-center mb-4">
                                    <h3 className="text-xl font-bold text-white mb-2">Autenticación Requerida</h3>
                                    <p className="text-sm text-gray-400">Inicia sesión para conceder acceso a DIIC ZONE.</p>
                                </div>

                                {channel.type === 'messaging' && channel.name.includes('WhatsApp') ? (
                                    <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                                        <QrCode className="w-48 h-48 text-black" />
                                        <p className="text-xs text-gray-500 font-medium">Escanea con WhatsApp &gt; Dispositivos Vinculados</p>
                                    </div>
                                ) : (
                                    <button className="flex items-center gap-3 px-8 py-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95 group">
                                        <div className="bg-white/20 p-2 rounded-lg">
                                            <Lock className="w-5 h-5 text-white" />
                                        </div>
                                        <span>Continuar con {channel.name.split(' ')[0]}</span>
                                    </button>
                                )}
                                <p className="text-[10px] text-gray-500 max-w-xs text-center">Al continuar, aceptas dar permisos de lectura y gestión de mensajes a nuestra plataforma.</p>
                            </motion.div>
                        )}

                        {/* STEP 3: ASSET SELECTION */}
                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-md space-y-6">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-2">Selecciona un Activo</h3>
                                    <p className="text-sm text-gray-400">¿Qué cuenta o página deseas conectar?</p>
                                </div>
                                <div className="space-y-3">
                                    {mockAssets.map((asset) => (
                                        <div
                                            key={asset.id}
                                            onClick={() => setSelectedAsset(asset.id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group
                                            ${selectedAsset === asset.id
                                                    ? 'bg-indigo-600/10 border-indigo-500'
                                                    : 'bg-[#151520] border-white/5 hover:border-white/20'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedAsset === asset.id ? 'bg-indigo-600' : 'bg-white/10'}`}>
                                                    <span className="font-bold text-white uppercase">{asset.name[0]}</span>
                                                </div>
                                                <div>
                                                    <h4 className={`text-sm font-bold ${selectedAsset === asset.id ? 'text-white' : 'text-gray-300'}`}>{asset.name}</h4>
                                                    <p className="text-xs text-gray-500">{asset.type}</p>
                                                </div>
                                            </div>
                                            {selectedAsset === asset.id && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: TEST CONNECTION */}
                        {step === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center justify-center space-y-8 w-full">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-2">Verificación de Conexión</h3>
                                    <p className="text-sm text-gray-400">Vamos a enviar un ping de prueba para asegurar el flujo.</p>
                                </div>

                                <div className="relative">
                                    <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-500
                                        ${connectionStatus === 'success' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-white/5'}`}>
                                        {connectionStatus === 'success' ? (
                                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                        ) : loading ? (
                                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                                        ) : (
                                            <Server className="w-12 h-12 text-gray-500" />
                                        )}
                                    </div>
                                    {connectionStatus === 'success' && (
                                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-[#0E0E18]">
                                            24ms
                                        </div>
                                    )}
                                </div>

                                {connectionStatus !== 'success' && (
                                    <button
                                        onClick={handleTestConnection}
                                        disabled={loading}
                                        className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-white transition-all flex items-center gap-2"
                                    >
                                        {loading ? 'Verificando...' : 'Iniciar Test de Ping'}
                                    </button>
                                )}

                                {connectionStatus === 'success' && (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 flex items-center gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span className="text-sm font-medium text-emerald-400">Conexión establecida correctamente</span>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* STEP 5: ACTIVATE */}
                        {step === 5 && (
                            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-md space-y-6">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-2">Activación Final</h3>
                                    <p className="text-sm text-gray-400">Configura los últimos permisos para activar el canal.</p>
                                </div>

                                <div className="space-y-4 bg-[#151520] p-6 rounded-2xl border border-white/5">
                                    <ToggleRow label="Webhook Listener" desc="Escuchar mensajes entrantes" defaultChecked={true} />
                                    <ToggleRow label="Lectura de Medios" desc="Descargar imágenes/audios" defaultChecked={true} />
                                    <ToggleRow label="Envío de Mensajes" desc="Permitir respuestas del Bot" defaultChecked={true} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 border-t border-white/5 bg-[#151520] flex justify-between items-center z-20">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-3 rounded-xl border border-white/10 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Atrás
                        </button>
                    ) : (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Conexión Segura cifrada por DIIC
                        </div>
                    )}

                    <button
                        onClick={handleNext}
                        disabled={loading || (step === 3 && !selectedAsset) || (step === 4 && connectionStatus !== 'success')}
                        className={`px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2
                        ${(loading || (step === 3 && !selectedAsset) || (step === 4 && connectionStatus !== 'success')) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                            </>
                        ) : step === 5 ? (
                            'Finalizar y Activar'
                        ) : (
                            'Continuar'
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc }) {
    return (
        <div className="bg-[#151520] p-4 rounded-xl border border-white/5 flex flex-col gap-2 hover:border-white/10 transition-colors cursor-default group">
            <Icon className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold text-white">{title}</span>
            <span className="text-xs text-gray-500">{desc}</span>
        </div>
    )
}

function ToggleRow({ label, desc, defaultChecked }) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setChecked(!checked)}>
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${checked ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-gray-500'}`}>
                    <LinkIcon className="w-4 h-4" />
                </div>
                <div>
                    <h4 className={`text-sm font-bold ${checked ? 'text-white' : 'text-gray-400'}`}>{label}</h4>
                    <p className="text-[10px] text-gray-500">{desc}</p>
                </div>
            </div>
            <div className={`w-10 h-5 rounded-full p-1 transition-colors ${checked ? 'bg-emerald-500' : 'bg-white/10'}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
        </div>
    )
}
