'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Calendar as CalendarIcon, Users, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function ClientCMSidebar() {
    const { user } = useAuth();
    const pathname = usePathname();
    const [clientName, setClientName] = useState('DIIC ZONE');
    const [clientPlan, setClientPlan] = useState('Plan Pro Active');

    useEffect(() => {
        const fetchClientInfo = async () => {
            if (user?.client_id) {
                const { data, error } = await supabase
                    .from('clients')
                    .select('name, plan')
                    .eq('id', user.client_id)
                    .single();
                
                if (data && !error) {
                    setClientName(data.name);
                    setClientPlan(data.plan || 'Plan Pro Active');
                }
            } else if (user?.full_name) {
                // Fallback for CMs without explicit client_id link in profile but assigned via cm column
                const { data, error } = await supabase
                    .from('clients')
                    .select('name, plan')
                    .eq('cm', user.full_name)
                    .limit(1)
                    .single();
                
                if (data && !error) {
                    setClientName(data.name);
                    setClientPlan(data.plan || 'Plan Pro Active');
                }
            }
        };

        fetchClientInfo();
    }, [user]);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Panel General', path: '/dashboard/community' },
        { icon: Bot, label: 'Agente IA', path: '/dashboard/community/agent' },
        { icon: Users, label: 'Mi Perfil / CV', path: '/dashboard/community/profile' },
        { icon: FileText, label: 'Reportes', path: '/dashboard/community/reports' },
        { icon: CalendarIcon, label: 'Calendario', path: '/dashboard/community/calendar' },
        { icon: Users, label: 'Equipo', path: '/dashboard/community/team' },
    ];

    return (
        <div className="hidden lg:flex flex-col w-72 bg-[#0E0E18]/60 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 h-[calc(100vh-6rem)] sticky top-12 shadow-2xl">
            {/* Branding Section */}
            <div className="flex items-center gap-4 mb-12">
                <motion.div 
                    animate={{ 
                        boxShadow: ["0 0 20px rgba(79,70,229,0.2)", "0 0 40px rgba(79,70,229,0.4)", "0 0 20px rgba(79,70,229,0.2)"]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl"
                >
                    <Users className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                    <h2 className="font-black text-white leading-none text-lg tracking-tighter uppercase italic">Community</h2>
                    <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] block mt-1">Management Hub</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-3 flex-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link key={item.path} href={item.path} className="block group">
                            <motion.div 
                                whileHover={{ x: 5 }}
                                className={`relative w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isActive ? 'bg-indigo-600/10 text-white border border-indigo-500/30' : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'}`}
                            >
                                {isActive && (
                                    <motion.div 
                                        layoutId="active-nav"
                                        className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(79,70,229,1)]"
                                    />
                                )}
                                <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`} />
                                {item.label}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Profile/Footer Section */}
            <div className="mt-auto pt-8 border-t border-white/5">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-4 hover:bg-white/[0.05] transition-all cursor-pointer group">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-fuchsia-500 p-[2px] animate-gradient-xy">
                            <div className="w-full h-full rounded-full bg-[#0E0E18] flex items-center justify-center overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=brand" alt="brand" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0E0E18]" />
                    </div>
                    <div>
                        <div className="text-sm font-black text-white tracking-tight uppercase group-hover:text-indigo-400 transition-colors">{clientName}</div>
                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{clientPlan}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
