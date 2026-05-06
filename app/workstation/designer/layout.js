'use client';

import DesignerSidebar from '@/components/workstation/designer/DesignerSidebar';
import WorkstationTopBar from '@/components/workstation/WorkstationTopBar';

export default function DesignerLayout({ children }) {
    return (
        <div className="flex h-screen bg-[#050511] text-white">
            <DesignerSidebar />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <WorkstationTopBar 
                    title="Nodo de Diseño" 
                    subtitle="Gestión de identidad y piezas gráficas" 
                    role="Designer" 
                />
                
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
