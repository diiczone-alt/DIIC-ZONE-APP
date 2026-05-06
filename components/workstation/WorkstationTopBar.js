'use client';

import { useState } from 'react';
import { 
    Bell, MessageCircle, Calendar, Settings, 
    Search, User, ChevronDown, Zap, ShieldCheck,
    LogOut, CreditCard, Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Global Modals
import WorkstationGlobalModal from './modals/WorkstationGlobalModal';

export default function WorkstationTopBar({ title, subtitle, role = 'Editor' }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalView, setModalView] = useState('messages');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error logging out:', error);
            window.location.href = '/';
        }
    };

    const openModal = (view) => {
        setModalView(view);
        setIsModalOpen(true);
    };

    return (
        <>
        <div className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/20 backdrop-blur-md relative z-30">
            {/* Left: Dynamic Page Title */}
            <div>
                <div className="flex items-center gap-3 mb-0.5">
                    <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">{title}</h1>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                        {role} OS
                    </span>
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-60">{subtitle}</p>
            </div>

            {/* Right: Smart Controls */}
            <div className="flex items-center gap-6">
                
                {/* 1. Global Search (Command Palette Trigger) */}
                <button className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all hidden md:block">
                    <Search className="w-5 h-5" />
                </button>

                {/* 2. Communication & Alert Cluster */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
                    {/* Calendar Button */}
                    <TopBarButton 
                        icon={<Calendar className="w-4 h-4" />} 
                        label="Agenda" 
                        isActive={isModalOpen && modalView === 'calendar'}
                        onClick={() => openModal('calendar')}
                        badge="2"
                    />
                    
                    {/* Messages Button */}
                    <TopBarButton 
                        icon={<MessageCircle className="w-4 h-4" />} 
                        label="Mensajes" 
                        isActive={isModalOpen && modalView === 'messages'}
                        onClick={() => openModal('messages')}
                        badge="5"
                        badgeColor="bg-indigo-500"
                    />

                    {/* Notifications Button */}
                    <TopBarButton 
                        icon={<Bell className="w-4 h-4" />} 
                        label="Alertas" 
                        isActive={isModalOpen && modalView === 'notifications'}
                        onClick={() => openModal('notifications')}
                        badge="!"
                        badgeColor="bg-amber-500"
                    />
                </div>

                {/* 3. Node Status (Global) */}
                <div className="h-10 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <div className="text-right">
                        <p className="text-[8px] font-black text-emerald-500/60 uppercase tracking-tighter leading-none mb-0.5">Nodo</p>
                        <p className="text-[10px] font-black text-white leading-none">ACTIVO</p>
                    </div>
                </div>

                {/* 4. Mini Profile */}
                <div className="relative">
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className={`flex items-center gap-3 pl-4 border-l border-white/10 group transition-all ${showProfileMenu ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                    >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-xs shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform overflow-hidden border border-white/10">
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span>{user?.full_name?.substring(0, 2).toUpperCase() || 'DI'}</span>
                            )}
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-xs font-black text-white leading-none mb-1 group-hover:text-indigo-400 transition-colors">
                                {user?.full_name || 'Talento Pro'}
                            </p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Zona Creativa</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-600 group-hover:text-white transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown Menu */}
                    <AnimatePresence>
                        {showProfileMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-14 right-0 w-64 bg-[#0E0E18] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-50 overflow-hidden"
                                >
                                    <div className="p-4 border-b border-white/5 mb-2">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Cuenta</p>
                                        <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <ProfileMenuItem 
                                            icon={<User className="w-4 h-4" />} 
                                            label="Mi Perfil" 
                                            onClick={() => { setShowProfileMenu(false); router.push('/workstation/profile'); }}
                                        />
                                        <ProfileMenuItem 
                                            icon={<Layout className="w-4 h-4" />} 
                                            label="Panel Principal" 
                                            onClick={() => { setShowProfileMenu(false); router.push('/workstation/editor'); }}
                                        />
                                        <ProfileMenuItem 
                                            icon={<Settings className="w-4 h-4" />} 
                                            label="Configuración" 
                                            onClick={() => { setShowProfileMenu(false); router.push('/workstation/settings'); }}
                                        />
                                        <ProfileMenuItem 
                                            icon={<CreditCard className="w-4 h-4" />} 
                                            label="Pagos y Wallet" 
                                            onClick={() => { setShowProfileMenu(false); router.push('/workstation/editor/finance'); }}
                                        />
                                        
                                        <div className="h-px bg-white/5 my-2 mx-2" />
                                        
                                        <ProfileMenuItem 
                                            icon={<LogOut className="w-4 h-4" />} 
                                            label="Cerrar Sesión" 
                                            variant="danger"
                                            onClick={handleLogout}
                                        />
                                    </div>

                                    {/* App Info */}
                                    <div className="p-4 mt-2 bg-black/20 rounded-xl border border-white/5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Version</span>
                                            <span className="text-[8px] font-black text-indigo-500 uppercase">DIIC OS 3.1</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>

        {/* --- GLOBAL OPERATIONAL MODALS (Centered Large Window) --- */}
        <AnimatePresence>
                {isModalOpen && (
                    <WorkstationGlobalModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        view={modalView}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

function TopBarButton({ icon, label, isActive, onClick, badge, badgeColor = 'bg-purple-500' }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all relative group ${
                isActive ? 'bg-white/10 text-white shadow-inner' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
        >
            {icon}
            <span className={`text-[10px] font-black uppercase tracking-widest hidden lg:block`}>{label}</span>
            {badge && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 ${badgeColor} text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-[#050511]`}>
                    {badge}
                </span>
            )}
        </button>
    );
}

function ProfileMenuItem({ icon, label, onClick, variant = 'default' }) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                variant === 'danger' 
                ? 'text-red-400 hover:bg-red-500/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
            {icon}
            {label}
        </button>
    );
}

