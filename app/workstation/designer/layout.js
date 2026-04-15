'use client';

import DesignerSidebar from '@/components/workstation/designer/DesignerSidebar';

export default function DesignerLayout({ children }) {
    return (
        <div className="flex h-screen bg-[#050511] text-white">
            <DesignerSidebar />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {children}
            </main>
        </div>
    );
}
