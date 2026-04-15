'use client';

import RegistrationHub from '@/components/auth/RegistrationHub';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function OnboardingContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'client';
    
    // El usuario pidió que el botón "Quiero Crecer Mi Marca" (client) 
    // use el flujo completo con Google Drive y Términos Legales.
    if (type === 'client') {
        return <OnboardingWizard initialType="client" />;
    }
    
    return <OnboardingWizard initialType="creative" />;
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050510] flex items-center justify-center font-black text-indigo-500 animate-pulse uppercase tracking-widest">Initializing Smart Entry...</div>}>
            <OnboardingContent />
        </Suspense>
    );
}
