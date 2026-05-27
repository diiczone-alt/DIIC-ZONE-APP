'use client';

import FilmmakerSidebar from '@/components/workstation/filmmaker/FilmmakerSidebar';
import WorkstationTopBar from '@/components/workstation/WorkstationTopBar';

export default function FilmmakerLayout({ children }) {
    return (
        <div className="flex h-screen bg-[#050511] text-white">
            <FilmmakerSidebar />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <WorkstationTopBar 
                    title="Estación de Producción" 
                    subtitle="Control y gestión de rodajes" 
                    role="Filmmaker" 
                />
                
                <div className="flex-1 min-h-0 relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
