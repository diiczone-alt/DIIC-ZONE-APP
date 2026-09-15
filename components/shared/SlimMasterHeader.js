'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { useSidebar } from '@/components/layout/SidebarContext';

export default function SlimMasterHeader() {
    const { setIsMobileOpen } = useSidebar();

    // On desktop, the sidebar contains all navigation and the profile at the bottom.
    // On mobile (< lg), provide a minimal floating button without any banner or dividing line.
    return (
        <div className="lg:hidden px-4 pt-4 pb-1 flex items-center justify-between z-30">
            <button
                onClick={() => setIsMobileOpen(true)}
                className="p-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                aria-label="Abrir menú"
            >
                <Menu className="w-5 h-5" />
            </button>
        </div>
    );
}

