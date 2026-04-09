'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORTS DE ETAPAS (13 PASOS) ---
import AuthStep from './steps/AuthStep';               // Etapa 1
import LegalStep from './steps/LegalStep';             // Etapa 1 (Técnicamente parte del inicio)
import WelcomeStep from './steps/WelcomeStep';         // Etapa 2
import ProfileSelectorStep from './steps/ProfileSelectorStep'; // Etapa 3 (Nuevo)
import SubProfileStep from './steps/SubProfileStep';   // Etapa 4 (Nuevo)
import GoalStep from './steps/GoalStep';               // Etapa 5 (Nuevo)
import BusinessInfoStep from './steps/BusinessInfoStep'; // Etapa 6 (Nuevo)
import CapacityStep from './steps/CapacityStep';       // Etapa 7
import AnalisisChannelStep from './steps/AnalisisChannelStep'; // Etapa 8
import SocialConnectStep from './steps/SocialConnectStep'; // Etapa 11
import BrandIdentityStep from './steps/BrandIdentityStep';   // Etapa 12
import LevelCalculationStep from './steps/LevelCalculationStep'; // Etapa 13
import SmartRecommendationStep from './steps/SmartRecommendationStep'; // Etapa 14
import EnvironmentSuccessStep from './steps/EnvironmentSuccessStep'; // Etapa 15 (Final)

// --- SHARED STEPS ---
import UserInfoStep from './steps/UserInfoStep';

// --- CREATIVE SPECIALIZED STEPS ---
import TalentRoleStep from './steps/TalentRoleStep';
import TalentDescriptionStep from './steps/TalentDescriptionStep';

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

    const isCreative = formData.type === 'creative';
    const totalSteps = isCreative ? 8 : 15;

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
        if (currentStep === 1) return <AuthStep onNext={nextStep} updateData={updateRoot} />;
        if (currentStep === 2) return <LegalStep onNext={nextStep} />;
        if (currentStep === 3) return <WelcomeStep onNext={nextStep} />;
        if (currentStep === 4) return <UserInfoStep onNext={nextStep} updateData={updateRoot} />;

        if (isCreative) {
            switch (currentStep) {
                case 5: return <TalentRoleStep onNext={nextStep} updateData={updateRoot} />;
                case 6: return <TalentDescriptionStep onNext={nextStep} updateData={updateRoot} />;
                case 7: return <SubProfileStep onNext={nextStep} updateData={updateRoot} profileType="creator" />;
                case 8: return <EnvironmentSuccessStep onNext={nextStep} formData={formData} />;
                default: return <div className="text-white">Fin del flujo</div>;
            }
        }

        switch (currentStep) {
            case 5: return <ProfileSelectorStep onNext={nextStep} updateData={updateRoot} />;
            case 6: return <SubProfileStep onNext={nextStep} updateData={updateRoot} profileType={formData.profileType} />;
            case 7: return <GoalStep onNext={nextStep} updateData={updateRoot} />;
            case 8: return <BusinessInfoStep onNext={nextStep} updateData={updateRoot} />;
            case 9: return <CapacityStep onNext={nextStep} updateData={(d) => handleUpdateData('capacity', d)} userType={formData.profileType} niche={formData.niche} />;
            case 10: return <AnalisisChannelStep onNext={nextStep} updateData={(d) => handleUpdateData('channels', d)} />;
            case 11: return <SocialConnectStep onNext={nextStep} updateData={(d) => handleUpdateData('social', d)} />;
            case 12: return <BrandIdentityStep onNext={nextStep} updateData={(d) => handleUpdateData('brandIdentity', d)} />;
            case 13: return <LevelCalculationStep onNext={nextStep} formData={formData} />;
            case 14: return <SmartRecommendationStep onNext={nextStep} formData={formData} />;
            case 15: return <EnvironmentSuccessStep onNext={nextStep} formData={formData} />;
            default: return <div className="text-white text-center p-10 font-bold">¡Flujo Completado! Generando tu entorno...</div>;
        }
    };

    return (
        <div className="min-h-screen bg-[#020208] text-white flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden font-display selection:bg-indigo-500/30">
            
            {/* God Mode Background: Animated Grid & Particles */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#020208]" />
                <div 
                    className="absolute inset-0 opacity-[0.15]"
                    style={{ 
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(79, 70, 229, 0.3) 1px, transparent 0)`,
                        backgroundSize: '40px 40px' 
                    }}
                />
                
                {/* Moving Light Shards */}
                <motion.div
                    animate={{ 
                        x: [0, 400, 0], 
                        y: [0, 200, 0],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[10%] left-[10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{ 
                        x: [0, -300, 0], 
                        y: [0, 100, 0],
                        opacity: [0.05, 0.2, 0.05]
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[130px]"
                />
            </div>

            {/* Quantum Progress Section */}
            <div className="w-full max-w-4xl mb-10 relative z-10">
                <div className="flex justify-between items-end mb-4 px-4">
                    <div className="space-y-1">
                        <span className="block text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] leading-none">
                            ESTADO DE ADOPCIÓN
                        </span>
                        <h3 className="text-xl font-bold tracking-tighter italic text-white/90">DIIC ZONE PROTOCOL</h3>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-mono text-gray-500 block mb-1">STAREGIC PHASE {currentStep}/{totalSteps}</span>
                        <span className="text-3xl font-black text-white leading-none">
                            {Math.round((currentStep/totalSteps)*100)}<span className="text-indigo-500 text-sm ml-1">%</span>
                        </span>
                    </div>
                </div>
                
                <div className="h-2 bg-white/5 rounded-full overflow-hidden backdrop-blur-md border border-white/5 p-[2px]">
                    <motion.div
                        className="h-full rounded-full relative overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                    >
                        {/* Progressive Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-400 to-emerald-400" />
                        {/* Shimmer Effect */}
                        <motion.div 
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
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
