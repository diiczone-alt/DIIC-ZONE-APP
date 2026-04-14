'use client';

import ClientCMSidebar from '@/components/community/ClientCMSidebar';

export default function CommunityLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#050511] p-6 lg:p-12 flex gap-12 relative">
            {/* Ambient Background Noise */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
            
            <ClientCMSidebar />
            <main className="flex-1 relative z-10">
                {children}
            </main>
        </div>
    );
}
