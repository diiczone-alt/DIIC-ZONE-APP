'use client';

import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSuppressed, setIsSuppressed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebar-collapsed') === 'true';
            setIsCollapsed(saved);
            if (saved) {
                document.documentElement.setAttribute('data-sidebar-collapsed', 'true');
            } else {
                document.documentElement.removeAttribute('data-sidebar-collapsed');
            }
        }
    }, []);

    const toggleCollapsed = () => {
        setIsCollapsed(prev => {
            const next = !prev;
            if (typeof window !== 'undefined') {
                localStorage.setItem('sidebar-collapsed', String(next));
                if (next) {
                    document.documentElement.setAttribute('data-sidebar-collapsed', 'true');
                } else {
                    document.documentElement.removeAttribute('data-sidebar-collapsed');
                }
            }
            return next;
        });
    };

    return (
        <SidebarContext.Provider value={{ 
            isExpanded, 
            setIsExpanded, 
            isSuppressed, 
            setIsSuppressed,
            isMobileOpen,
            setIsMobileOpen,
            isCollapsed,
            setIsCollapsed,
            toggleCollapsed
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        return {
            isExpanded: false,
            setIsExpanded: () => {},
            isSuppressed: false,
            setIsSuppressed: () => {},
            isMobileOpen: false,
            setIsMobileOpen: () => {},
            isCollapsed: false,
            setIsCollapsed: () => {},
            toggleCollapsed: () => {}
        };
    }
    return context;
}
