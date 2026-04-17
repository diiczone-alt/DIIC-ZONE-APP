'use client';

import { Bell, Search, Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

import NotificationCenter from '@/components/ui/NotificationCenter';

export default function Header({ userLevel = 1 }) {
    return (
        <header className="sticky top-0 z-40 bg-[#050511]/80 backdrop-blur-md border-b border-white/5 py-3 px-6 lg:px-10 flex justify-between items-center">

            {/* LEFT: Logo & Breadcrumbs */}
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg">
                        D
                    </div>
                    <span className="text-xl font-black tracking-tight text-white hidden md:block">
                        DIIC <span className="text-gray-500">ZONE</span>
                    </span>
                </div>

                {/* Search Bar - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 w-64 focus-within:border-white/20 transition-colors">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="🔍 Buscar proyecto, tarea o archivo..."
                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-600"
                    />
                </div>
            </div>

            {/* RIGHT: Actions & Profile */}
            <div className="flex items-center gap-4">


                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
