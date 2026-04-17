'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

// --- IMPORTS DE ETAPAS (13 PASOS) ---
import WelcomeStep from './steps/WelcomeStep';         // Etapa 2
import StorageSelectorStep from './steps/StorageSelectorStep'; // Etapa 1
import AuthStep from './steps/AuthStep';               // Etapa 4
import LegalStep from './steps/LegalStep';             // Etapa 3
import ProfileSelectorStep from './steps/ProfileSelectorStep'; // Etapa 3 (Nuevo)
import SubProfileStep from './steps/SubProfileStep';   // Etapa 4 (Nuevo)
import GoalStep from './steps/GoalStep';               // Etapa 5 (Nuevo)
import BusinessInfoStep from './steps/BusinessInfoStep'; // Etapa 6 (Nuevo)
import CapacityStep from './steps/CapacityStep';       // Etapa 7
import AnalisisChannelStep from './steps/AnalisisChannelStep'; // Etapa 8
import SocialConnectStep from './steps/SocialConnectStep'; // Etapa 11
import DriveSetupStep from './steps/DriveSetupStep';   // Etapa 12 (Nuevo)
import BrandIdentityStep from './steps/BrandIdentityStep';   // Etapa 13
import LevelCalculationStep from './steps/LevelCalculationStep'; // Etapa 14
import SmartRecommendationStep from './steps/SmartRecommendationStep'; // Etapa 15
import EnvironmentSuccessStep from './steps/EnvironmentSuccessStep'; // Etapa 16 (Final)

// --- SHARED STEPS ---
// UserInfoStep removido e integrado en AuthStep

// --- CREATIVE SPECIALIZED STEPS ---
import TalentRoleStep from './steps/TalentRoleStep';
import TalentDescriptionStep from './steps/TalentDescriptionStep';
import TalentCVStep from './steps/TalentCVStep';

export default function OnboardingWizard({ initialType = 'client' }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        type: initialType,
        auth: {},
        name: '',         
        city: '',         
        legalAccepted: false,
        profileType: '',  
        role: '',         
        description: '',  
        niche: '',        
        goal: '',         
        businessInfo: {}, 
        capacity: {},     
        channels: {},     
        social: {},       
        brandIdentity: {},
        driveData: null,
        resources: []
    });
    const [isHydrated, setIsHydrated] = useState(false);
    const { user, loading } = useAuth();

    const isCreative = formData.type === 'creative';
    const totalSteps = isCreative ? 9 : 15;


    // 1. Persistence: Load state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('diic_onboarding_progress');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.formData) setFormData(parsed.formData);
                if (parsed.currentStep) setCurrentStep(parsed.currentStep);
            } catch (err) {
                console.error('[OnboardingWizard] Error recovery state:', err);
            }
        }
        setIsHydrated(true);
    }, []);

    // 2. Persistence: Save state on every change
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem('diic_onboarding_progress', JSON.stringify({
                formData,
                currentStep
            }));
        }
    }, [formData, currentStep, isHydrated]);

    // 3. Auto-Advance: If already authenticated, skip Welcome/Legal/Auth and go to ProfileSelector (Step 4)
    useEffect(() => {
        if (isHydrated && currentStep < 4 && user) {
            console.log('[OnboardingWizard] Session detected, skipping to profile technical setup...');
            setCurrentStep(4);
        }
    }, [user, isHydrated]);

    // 4. Persistence: Clear on success (last step)
    useEffect(() => {
        if (currentStep === totalSteps) {
            localStorage.removeItem('diic_onboarding_progress');
        }
    }, [currentStep, totalSteps]);


    const nextStep = () => {
        if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleUpdateData = (key, data) => {
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
            setFormData(prev => ({ ...prev, [key]: { ...(prev[key] || {}), ...data } }));
        } else {
            setFormData(prev => ({ ...prev, [key]: data }));
        }
    };

    const updateRoot = (data) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const renderStep = () => {
        if (currentStep === 1) return <WelcomeStep onNext={nextStep} type={formData.type} />;
        if (currentStep === 2) return <LegalStep onNext={nextStep} />;
        if (currentStep === 3) return <AuthStep onNext={nextStep} updateData={updateRoot} type={formData.type} />;

        if (isCreative) {
            switch (currentStep) {
                case 4: return <TalentRoleStep onNext={nextStep} updateData={updateRoot} />;
                case 5: return <TalentDescriptionStep onNext={nextStep} updateData={updateRoot} />;
                case 6: return <TalentCVStep onNext={nextStep} updateData={updateRoot} />;
                case 7: return <SubProfileStep onNext={nextStep} updateData={updateRoot} profileType="creator" />;
                case 8: return <DriveSetupStep onNext={nextStep} updateData={(d) => handleUpdateData('driveData', d)} data={formData} />;
                case 9: return <EnvironmentSuccessStep onNext={nextStep} formData={formData} />;
                default: return <div className="text-white text-center p-10 font-bold">¡Bienvenido a la Zona Creativa! 🎥</div>;
            }
        }

        switch (currentStep) {
            case 4: return <ProfileSelectorStep onNext={nextStep} updateData={updateRoot} />;
            case 5: return <SubProfileStep onNext={nextStep} updateData={updateRoot} profileType={formData.profileType} />;
            case 6: return <GoalStep onNext={nextStep} updateData={updateRoot} />;
            case 7: return <BusinessInfoStep onNext={nextStep} updateData={updateRoot} />;
            case 8: return <CapacityStep onNext={nextStep} updateData={(d) => handleUpdateData('capacity', d)} userType={formData.profileType} niche={formData.niche} />;
            case 9: return <AnalisisChannelStep onNext={nextStep} updateData={(d) => handleUpdateData('channels', d)} />;
            case 10: return <SocialConnectStep onNext={nextStep} updateData={(d) => handleUpdateData('social', d)} />;
            case 11: return <BrandIdentityStep onNext={nextStep} updateData={(d) => handleUpdateData('brandIdentity', d)} />;
            case 12: return <LevelCalculationStep onNext={nextStep} formData={formData} />;
            case 13: return <SmartRecommendationStep onNext={nextStep} formData={formData} />;
            case 14: return <DriveSetupStep onNext={nextStep} updateData={(d) => handleUpdateData('driveData', d)} data={formData} />;
            case 15: return <EnvironmentSuccessStep onNext={nextStep} formData={formData} />;
            default: return <div className="text-white text-center p-10 font-bold">¡Flujo Completado! Generando tu entorno...</div>;
        }
    };

    if (!isHydrated || loading) {
        return (
            <div className="min-h-screen bg-[#020208] flex items-center justify-center p-6">
                <div className="space-y-6 text-center">
                    <div className="relative w-24 h-24 mx-auto">
                        {/* Multiple spinning rings for high-end look */}
                        <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin" />
                        <div className="absolute inset-2 border-r-2 border-purple-500 rounded-full animate-spin [animation-duration:1.5s]" />
                        <div className="absolute inset-4 border-l-2 border-emerald-500 rounded-full animate-spin [animation-duration:2s]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] animate-pulse">
                            Iniciando Protocolo de Seguridad
                        </p>
                        <p className="text-[8px] text-white/20 font-mono uppercase tracking-widest">
                            {!isHydrated ? 'HYDRATING_LOCAL_STATE' : 'AUTHENTICATING_SESSION'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020208] text-white flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden font-display selection:bg-indigo-500/30">
            
            {/* God Mode Background: Animated Grid & Particles */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#020208]" />
                <div 
                    className="absolute inset-0 opacity-[0.1]"
                    style={{ 
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(79, 70, 229, 0.2) 1px, transparent 0)`,
                        backgroundSize: '40px 40px' 
                    }}
                />
                
                {/* Dynamic Ambient Glows */}
                <motion.div
                    animate={{ 
                        opacity: [0.1, 0.2, 0.1],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at ${currentStep * 5}% 50%, rgba(79, 70, 229, 0.15) 0%, transparent 50%)`
                    }}
                />
            </div>

            {/* Quantum Progress Section */}
            <div className="w-full max-w-4xl mb-10 relative z-10 px-4">
                <div className="flex justify-between items-end mb-4">
                    <div className="space-y-1">
                        <span className="block text-[8px] font-black text-indigo-400 uppercase tracking-[0.6em] leading-none opacity-60">
                            EVOLUTION_PROTOCOLO
                        </span>
                        <h3 className="text-lg font-black tracking-tighter italic text-white/90">DIIC ZONE <span className="text-gray-600">v2.0</span></h3>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-mono text-gray-500 block mb-1">PHASE_{currentStep.toString().padStart(2, '0')}</span>
                        <div className="flex items-end gap-1">
                            <span className="text-4xl font-black text-white leading-none tracking-tighter">
                                {Math.round((currentStep/totalSteps)*100)}
                            </span>
                            <span className="text-indigo-500 text-xs font-black mb-1">%</span>
                        </div>
                    </div>
                </div>
                
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-md relative p-[1px] border border-white/5">
                    <motion.div
                        className="h-full rounded-full relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Progressive Gradient Energy */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-400 to-emerald-400" />
                        
                        {/* Pulse Glow at the tip */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white blur-md rounded-full opacity-50" />
                        
                        {/* Shimmer Effect */}
                        <motion.div 
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Cinematic Main Container */}
            <div className="w-full max-w-4xl relative z-10">
                {/* Rotating Border Glow */}
                <div className="absolute -inset-[2px] bg-gradient-to-tr from-indigo-500/20 via-white/10 to-purple-500/20 rounded-[40px] opacity-50 blur-[2px]" />
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="relative bg-black/40 backdrop-blur-[40px] border border-white/10 rounded-[38px] p-8 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.8)] min-h-[550px] flex flex-col items-center justify-center overflow-hidden"
                    >
                        {/* Subtle Interior Lighting */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                        
                        {renderStep()}

                        {/* Premium Navigation Controls */}
                        <div className="mt-auto px-6 w-full pt-10 flex justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
                            <motion.button 
                                whileHover={{ x: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={prevStep} 
                                disabled={currentStep === 1} 
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white disabled:opacity-0 transition-all font-mono"
                            >
                                <span className="text-lg">←</span> BACK:PROTOCOL
                            </motion.button>
                            <div className="flex gap-1 h-1">
                                {[...Array(totalSteps)].map((_, i) => (
                                    <div key={i} className={`w-3 rounded-full transition-all duration-500 ${i + 1 === currentStep ? 'bg-indigo-500 w-8' : 'bg-white/10'}`} />
                                ))}
                            </div>
                            <span className="text-[10px] font-mono text-indigo-500/80 font-black">DIIC_SYSTEM_v2.06</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Corner Decorative Elements */}
            <div className="fixed top-8 left-8 hidden lg:block opacity-20 pointer-events-none">
                <div className="w-12 h-12 border-t-2 border-l-2 border-white/50" />
            </div>
            <div className="fixed bottom-8 right-8 hidden lg:block opacity-20 pointer-events-none">
                <div className="w-12 h-12 border-b-2 border-r-2 border-white/50" />
            </div>
        </div>
    );
}
