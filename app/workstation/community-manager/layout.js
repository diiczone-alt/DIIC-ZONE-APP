'use client';

import CMSidebar from '@/components/workstation/community-manager/CMSidebar';

export default function CMLayout({ children }) {
    return (
        <div className="flex h-screen bg-[#050511] text-white">
            <CMSidebar />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[128px] pointer-events-none" />

                {children}
            </main>
        </div>
    );
}
