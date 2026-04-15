'use client';

import PhotoSidebar from '@/components/workstation/photography/PhotoSidebar';

export default function PhotoLayout({ children }) {
    return (
        <div className="flex h-screen bg-[#050511] text-white">
            <PhotoSidebar />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[128px] pointer-events-none" />

                {children}
            </main>
        </div>
    );
}
