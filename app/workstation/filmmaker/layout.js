'use client';

import FilmmakerSidebar from '@/components/workstation/filmmaker/FilmmakerSidebar';

export default function FilmmakerLayout({ children }) {
    return (
        <div className="flex h-screen bg-[#050511] text-white">
            <FilmmakerSidebar />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {children}
            </main>
        </div>
    );
}
