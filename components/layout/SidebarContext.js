'use client';

import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSuppressed, setIsSuppressed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <SidebarContext.Provider value={{ 
            isExpanded, 
            setIsExpanded, 
            isSuppressed, 
            setIsSuppressed,
            isMobileOpen,
            setIsMobileOpen
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}
