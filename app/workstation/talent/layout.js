'use client';

import { useState, useEffect } from 'react';
import TalentSidebar from '@/components/workstation/talent/TalentSidebar';
import { usePathname } from 'next/navigation';

export default function TalentLayout({ children }) {
    const pathname = usePathname();
    const [mode, setMode] = useState('client'); // 'client' or 'model'

    useEffect(() => {
        // Simple logic to detect if we are in the dashboard view for models
        // In a real app, this would be determined by the user's role from auth context
        if (pathname.includes('/dashboard')) {
            setMode('model');
        } else {
            setMode('client');
        }
    }, [pathname]);

    return (
        <div className="flex h-screen bg-[#050511] text-white">
            <TalentSidebar mode={mode} />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[128px] pointer-events-none" />

                {children}
            </main>
        </div>
    );
}
