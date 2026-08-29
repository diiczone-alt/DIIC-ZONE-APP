'use client';

import { useSidebar } from '@/components/layout/SidebarContext';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function MobileSidebarController() {
    const { isMobileOpen, setIsMobileOpen } = useSidebar();
    const pathname = usePathname();

    // Auto-collapse sidebar on route transitions
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname, setIsMobileOpen]);

    // Handle body locking / mobile menu active classes
    useEffect(() => {
        if (isMobileOpen) {
            document.body.classList.add('mobile-sidebar-open');
        } else {
            document.body.classList.remove('mobile-sidebar-open');
        }
        return () => {
            document.body.classList.remove('mobile-sidebar-open');
        };
    }, [isMobileOpen]);

    // HQ sidebar renders its own direct sibling backdrop to guarantee it is always in front and fully clickable
    if (pathname?.startsWith('/dashboard/hq')) {
        return null;
    }

    return (
        <AnimatePresence>
            {isMobileOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
                />
            )}
        </AnimatePresence>
    );
}
