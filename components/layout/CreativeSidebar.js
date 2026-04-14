'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    FolderOpen,
    MessageSquare,
    Calendar,
    LogOut,
    Bell,
    Award,
    GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';
import UserLevelWidget from '../gamification/UserLevelWidget';

const CREATIVE_MENU = [
    { name: 'Mi Workstation', icon: LayoutDashboard, href: '/workstation' }, // Will resolve to specific role page
    { name: 'Mis Archivos', icon: FolderOpen, href: '/workstation/files' },
    { name: 'Chat & Feedback', icon: MessageSquare, href: '/workstation/chat' },
    { name: 'Mi Calendario', icon: Calendar, href: '/workstation/calendar' },
    { name: 'Mi Reputación', icon: Award, href: '/workstation/reputation' },
    { name: 'Academia DIIC', icon: GraduationCap, href: '/workstation/academy' },
];

export default function CreativeSidebar({ user }) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 border-r border-white/5 bg-[#050510] flex flex-col z-50">
            {/* Minimal Logo */}
            <div className="p-6">
                <h1 className="text-xl font-bold font-display text-white tracking-widest">
                    DIIC <span className="text-gray-600">CREW</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {CREATIVE_MENU.map((item) => {
                    const isActive = pathname === item.href || (item.href === '/workstation' && pathname.includes('/workstation/') && !pathname.includes('files') && !pathname.includes('chat') && !pathname.includes('calendar'));

                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'bg-indigo-500/10 text-white'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabCreative"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full"
                                    />
                                )}
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'group-hover:text-white'}`} />
                                <span className="font-medium">{item.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Creative User Footer */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.name || 'Creativo'}</p>
                        <p className="text-xs text-indigo-400 truncate">{user?.role || 'Staff'}</p>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
