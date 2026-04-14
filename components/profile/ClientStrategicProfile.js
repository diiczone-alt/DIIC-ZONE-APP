'use client';

import React, { useState, useEffect } from 'react';
import { Network, Tag, Target, Users, Search, Target as TargetIcon, Zap, Heart, Link as LinkIcon, Globe, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { agencyService } from '@/services/agencyService';
import { aiService } from '@/services/aiService';
import { toast } from 'sonner';

export default function ClientStrategicProfile() {
    const { user } = useAuth();
    // Current client ID from auth context
    const clientId = user?.client_id || 1; 

    // Basic state for the profile
    const [profile, setProfile] = useState({
        brandName: user?.user_metadata?.brand || '',
        websiteUrl: '',
        instagramUrl: '',
        linkedinUrl: '',
        whatItDoes: '',
        whatItOffers: '',
        targetAudience: '',
        problemSolved: '',
        valueProp: '',
        tone: '',
        mainGoal: ''
    });

    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isSimulatingScrape, setIsSimulatingScrape] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [analysisMsg, setAnalysisMsg] = useState('');

    useEffect(() => {
        const loadClient = async () => {
            const client = await agencyService.getClientById(clientId);
            if (client) {
                setProfile(prev => ({
                    ...prev,
                    ...client,
                    brandName: client.name || client.brandName || '',
                    // Ensure metadata fields are mapped if they exist
                    ...(client.metadata?.strategic || {})
                }));
                if (client.websiteUrl || client.brandName) setIsPreviewMode(true);
            }
        };
        loadClient();
    }, []);

    const handleChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirm = async () => {
        setIsSaving(true);
        try {
            await agencyService.updateClient(clientId, {
                name: profile.brandName,
                websiteUrl: profile.websiteUrl,
                metadata: {
                    ...profile.metadata,
                    strategic: { ...profile }
                }
            });
            toast.success("Perfil estratégico actualizado");
        } catch (error) {
            toast.error("Error al guardar perfil");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSimulateSync = async () => {
        if (!profile.websiteUrl && !profile.instagramUrl) {
            toast.error("Ingresa una URL para iniciar la investigación");
            return;
        }

        setIsSimulatingScrape(true);
        setIsPreviewMode(true);
        
        try {
            // Get analysis from service
            const result = await aiService.analyzeStrategicProfile(
                profile.websiteUrl || profile.instagramUrl, 
                profile.brandName
            );

            // simulate the processing steps with delays
            for (const step of result.steps) {
                setAnalysisMsg(step.msg);
                await new Promise(r => setTimeout(r, 1200));
            }

            // Apply the results
            setProfile(p => ({
                ...p,
                ...result.data
            }));
            
            toast.success("Investigación profunda completada con éxito");

        } catch (error) {
            console.error("AI Analysis error:", error);
            toast.error("Error durante la investigación profunda");
        } finally {
            setIsSimulatingScrape(false);
            setAnalysisMsg('');
        }
    };

    const renderInput = (label, field, icon, placeholder, isTextarea = false) => {
        const Icon = icon;
        return (
            <div className="bg-[#0A0A0F] border border-white/5 rounded-[32px] p-8 space-y-4 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/5 rounded-2xl text-indigo-400">
                        <Icon className="w-5 h-5" />
                    </div>
                    <label className="text-sm font-black text-white uppercase italic tracking-widest">{label}</label>
                </div>
                {isTextarea ? (
                    <textarea 
                        value={profile[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-none text-gray-400 font-medium leading-relaxed focus:outline-none resize-none h-24 text-sm"
                    />
                ) : (
                    <input 
                        type="text"
                        value={profile[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-none text-gray-400 font-medium leading-relaxed focus:outline-none text-sm"
                    />
                )}
            </div>
        );
    };

    return (
        <div className="animate-in fade-in duration-500 pb-16">
            <div className="space-y-4 text-center pb-8 border-b border-white/5 mb-12">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                    Capa 1: Base del Negocio
                </span>
                <h2 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
                    Perfil <span className="text-indigo-500">Estratégico</span>
                </h2>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto">
                    Define la identidad central de tu marca. Conecta tus redes y web para que Diiczone entienda tu negocio automáticamente.
                </p>
            </div>

            {/* Smart Connection Hub */}
            <div className="bg-gradient-to-br from-[#0A0A12] to-[#11111E] border border-indigo-500/20 rounded-[40px] p-10 mb-12 relative overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.05)]">
                <div className="absolute top-0 right-0 p-8 opacity-10 blur-sm pointer-events-none">
                    <Globe className="w-64 h-64 text-indigo-500" />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <LinkIcon className="w-6 h-6 text-indigo-400" /> Conexión Digital
                            </h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                Ingresa tus URLs. La IA raspará (scrape) tu web para aprender qué haces.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 focus-within:border-indigo-500/50 transition-colors">
                                <Globe className="w-5 h-5 text-gray-500" />
                                <input 
                                    type="text" 
                                    placeholder="https://tupaginaweb.com"
                                    value={profile.websiteUrl}
                                    onChange={(e) => handleChange('websiteUrl', e.target.value)}
                                    className="bg-transparent border-none text-white text-sm focus:outline-none flex-1 font-medium"
                                />
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 focus-within:border-pink-500/50 transition-colors">
                                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z"/></svg>
                                <input 
                                    type="text" 
                                    placeholder="https://instagram.com/tuperfil"
                                    value={profile.instagramUrl}
                                    onChange={(e) => handleChange('instagramUrl', e.target.value)}
                                    className="bg-transparent border-none text-white text-sm focus:outline-none flex-1 font-medium"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleSimulateSync}
                            disabled={!profile.websiteUrl && !profile.instagramUrl}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_10px_30px_rgba(79,70,229,0.2)] disabled:shadow-none flex items-center justify-center gap-3"
                        >
                            <Zap className="w-5 h-5" /> 
                            Sincronizar IA
                        </button>
                    </div>

                    {/* Preview / Sync Card */}
                    <div className="flex items-center justify-center">
                        <div className={`w-full max-w-sm rounded-[32px] border transition-all duration-700 bg-white/5 overflow-hidden ${isSimulatingScrape ? 'border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.2)]' : isPreviewMode ? 'border-emerald-500/50' : 'border-white/10'}`}>
                            {isSimulatingScrape ? (
                                <div className="h-[280px] flex flex-col items-center justify-center space-y-4">
                                    <div className="relative w-16 h-16">
                                        <div className="absolute inset-0 rounded-full border-[3px] border-indigo-500/20" />
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 rounded-full border-[3px] border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Zap className="w-6 h-6 text-indigo-400" />
                                        </div>
                                    </div>
                                    <div className="text-center px-4">
                                        <p className="text-xs font-black uppercase text-indigo-400 tracking-widest animate-pulse min-h-[1.5em]">{analysisMsg || 'Iniciando Escaneo...'}</p>
                                        <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-tighter italic">Investigando como Estratega de Nicho</p>
                                    </div>
                                </div>
                            ) : isPreviewMode ? (
                                <div className="flex flex-col h-full animate-in fade-in zoom-in duration-500">
                                    <div className="h-24 bg-gradient-to-br from-indigo-600 to-purple-600 relative">
                                        <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-xl bg-black border-2 border-[#11111E] shadow-2xl flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6 text-gray-500" />
                                        </div>
                                    </div>
                                    <div className="p-6 pt-10 space-y-3 bg-[#0A0A12]">
                                        <div>
                                            <h4 className="text-lg font-black text-white">{profile.brandName || 'Tu Marca Analizada'}</h4>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                                                <TargetIcon className="w-3 h-3 text-emerald-500" /> Web y Redes conectadas
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-400 line-clamp-3">
                                            {profile.valueProp || profile.whatItDoes || 'La inteligencia artificial ha escaneado tus sitios y completado preliminarmente tu perfil. Revisa y aprueba la información abajo.'}
                                        </p>
                                        <div className="flex gap-2 pt-2">
                                            <div className="px-2 py-1 rounded bg-white/5 text-[9px] font-black uppercase tracking-widest text-gray-500 border border-white/5">Tecnología</div>
                                            <div className="px-2 py-1 rounded bg-white/5 text-[9px] font-black uppercase tracking-widest text-gray-500 border border-white/5">B2B</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[280px] flex flex-col items-center justify-center text-center p-8 opacity-50">
                                    <Globe className="w-12 h-12 text-gray-600 mb-4" />
                                    <p className="text-xs font-black uppercase text-gray-500 tracking-widest">Sin Conectar</p>
                                    <p className="text-[10px] font-medium text-gray-600 mt-2">Ingresa tu link y sincroniza para que la IA llene tu perfil</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* Visual feedback if fields are filled by system */}
                <AnimatePresence>
                    {isPreviewMode && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute -inset-4 border-2 border-indigo-500/20 rounded-[48px] pointer-events-none z-0"
                            style={{ boxShadow: '0 0 100px rgba(99,102,241,0.05) inset' }}
                        />
                    )}
                </AnimatePresence>

                <div className="relative z-10">{renderInput('Nombre de Marca', 'brandName', Tag, user?.user_metadata?.brand || 'Ej. DIIC ZONE INC.')}</div>
                <div className="relative z-10">{renderInput('¿Qué hace?', 'whatItDoes', Network, 'Ej. Consultoría en Inteligencia Artificial...')}</div>
                <div className="relative z-10">{renderInput('¿Qué ofrece?', 'whatItOffers', Zap, 'Ej. Asesorías High-Ticket, Cursos, SaaS...', true)}</div>
                <div className="relative z-10">{renderInput('Público Objetivo', 'targetAudience', Users, 'Ej. Dueños de negocios B2B, edad 30-45...', true)}</div>
                <div className="relative z-10">{renderInput('Problema que resuelve', 'problemSolved', Search, 'Ej. Falta de tiempo, procesos manuales lentos...', true)}</div>
                <div className="relative z-10">{renderInput('Propuesta de Valor', 'valueProp', TargetIcon, 'Ej. Aumentamos tus ventas un 30% usando automatizaciones en 30 días.', true)}</div>
                <div className="relative z-10">{renderInput('Tono de Comunicación', 'tone', Heart, 'Ej. Profesional, directo, corporativo, disruptivo...')}</div>
                <div className="relative z-10">{renderInput('Objetivo Principal', 'mainGoal', Target, 'Ej. Lograr $100K MRR para Q3 2024.', true)}</div>
            </div>
            
            <div className="mt-12 flex justify-end">
                 <button 
                    onClick={handleConfirm}
                    disabled={isSaving}
                    className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                     {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     ) : (
                        <CheckCircle2 className="w-5 h-5" /> 
                     )}
                     {isSaving ? 'Guardando...' : 'Confirmar Identidad'}
                 </button>
            </div>
        </div>
    );
}
