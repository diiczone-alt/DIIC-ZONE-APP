'use client';

import EditorSidebar from '@/components/workstation/editor/EditorSidebar';

export default function EditorLayout({ children }) {
    return (
        <div className="flex h-screen bg-[#080808] text-white">
            <EditorSidebar />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header (Optional, if needed for global controls) */}
                {/* <header className="h-16 border-b border-white/5 flex items-center px-6">
                    <h1 className="text-lg font-bold">Workstation</h1>
                </header> */}

                {children}
            </main>
        </div>
    );
}
