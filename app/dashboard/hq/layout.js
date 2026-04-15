'use client';

import HQSidebar from '@/components/layout/HQSidebar';

export default function HQLayout({ children }) {
    return (
        <div className="flex h-screen bg-[#050511] overflow-hidden">
            <HQSidebar />
            <main className="flex-1 overflow-y-auto pl-64 pb-24 custom-scrollbar relative">
                {children}
            </main>
        </div>
    );
}
