'use client';

import AudioSidebar from '@/components/workstation/audio/AudioSidebar';

export default function AudioLayout({ children }) {
    return (
        <div className="flex h-screen bg-[#050511] text-white">
            <AudioSidebar />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {children}
            </main>
        </div>
    );
}
