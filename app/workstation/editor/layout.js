'use client';

import EditorSidebar from '@/components/workstation/editor/EditorSidebar';
import WorkstationTopBar from '@/components/workstation/WorkstationTopBar';

export default function EditorLayout({ children }) {
    return (
        <div className="flex h-screen bg-[#080808] text-white">
            <EditorSidebar />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <WorkstationTopBar 
                    title="Panel de Edición" 
                    subtitle="Control maestro de cortes y entregas" 
                    role="Editor" 
                />
                
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
