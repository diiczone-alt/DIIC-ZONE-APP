'use client';

import PrintSidebar from '@/components/workstation/print/PrintSidebar';

export default function PrintLayout({ children }) {
    return (
        <div className="flex h-screen bg-[#050511] text-white">
            <PrintSidebar />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[128px] pointer-events-none" />

                {children}
            </main>
        </div>
    );
}
