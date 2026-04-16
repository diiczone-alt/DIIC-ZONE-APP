'use client';

import { motion } from 'framer-motion';
import { Shield, User, Video, Edit3, Image, Music, Users, Camera, Globe, Box, Layout, Clapperboard, Palette, Mic, MessageSquare, UserCheck, Printer } from 'lucide-react';
import Link from 'next/link';

const WORKSTATIONS = [
    { id: 'editor', name: 'Editor', icon: Video, color: 'text-indigo-400' },
    { id: 'filmmaker', name: 'Filmmaker', icon: Clapperboard, color: 'text-rose-400' },
    { id: 'design', name: 'Diseño', icon: Palette, color: 'text-fuchsia-400' },
    { id: 'audio', name: 'Audio', icon: Mic, color: 'text-emerald-400' },
    { id: 'community', name: 'Community Manager', icon: MessageSquare, color: 'text-blue-400', specialized: true },
    { id: 'photo', name: 'Fotografía', icon: Camera, color: 'text-orange-400' },
    { id: 'models', name: 'Modelos', icon: UserCheck, color: 'text-purple-400' },
    { id: 'dev', name: 'Desarrollo Web', icon: Globe, color: 'text-cyan-400' },
    { id: 'print', name: 'Imprenta / Merch', icon: Printer, color: 'text-amber-400' },
    { id: 'events', name: 'Eventos / Prod', icon: Clapperboard, color: 'text-red-400' },
];

export default function HubPage() {
    const { user, loading, getHomeRoute } = useAuth();
    const router = useRouter();

    // AUTO-GUARD: If already logged in, push to the correct dashboard immediately
    useEffect(() => {
        if (!loading && user && getHomeRoute) {
            router.push(getHomeRoute(user.role));
        }
    }, [user, loading, router, getHomeRoute]);

    if (loading) return <div className="min-h-screen bg-[#050511] flex items-center justify-center text-white italic animate-pulse">Sincronizando Accesos...</div>;

    return (
        <div className="min-h-screen bg-[#050511] text-white flex flex-col items-center justify-center p-8 font-sans">
            
            {/* Logo / Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16 text-center"
            >
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-600/20">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-2">DIIC ZONE <span className="text-indigo-500">OS</span></h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Selecciona tu perfil de acceso al sistema</p>
            </motion.div>

            {/* Main Selection Grid */}
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Admin / HQ Card */}
                <Link href="/dashboard/hq" className="md:col-span-4 group h-full">
                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="h-full bg-[#0A0A1F] border border-white/5 rounded-[40px] p-10 flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Shield className="w-32 h-32" />
                        </div>
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-10 group-hover:bg-indigo-600 transition-colors">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black mb-2">Admin / HQ</h2>
                            <p className="text-gray-500 font-medium">Control Total & Calidad</p>
                        </div>
                        <div className="mt-20">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Ingresar →</span>
                        </div>
                    </motion.div>
                </Link>

                {/* Cliente / Brand Card */}
                <Link href="/dashboard" className="md:col-span-4 group h-full">
                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="h-full bg-[#0A0A1F] border border-white/5 rounded-[40px] p-10 flex flex-col justify-between hover:border-blue-500/50 transition-all shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <User className="w-32 h-32" />
                        </div>
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-10 group-hover:bg-blue-600 transition-colors">
                                <User className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black mb-2">Cliente</h2>
                            <p className="text-gray-500 font-medium">Dashboard & Progresos</p>
                        </div>
                        <div className="mt-20">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Ingresar →</span>
                        </div>
                    </motion.div>
                </Link>

                {/* Creative Workstations List */}
                <div className="md:col-span-4 flex flex-col gap-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Workstations (Creativos)</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {WORKSTATIONS.map((w) => (
                            <Link key={w.id} href={w.specialized ? `/dashboard/${w.id}` : `/dashboard/creative-zone/${w.id}`} className="group">
                                <motion.div 
                                    whileHover={{ x: 5 }}
                                    className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/10 hover:border-white/20 transition-all aspect-square text-center"
                                >
                                    <w.icon className={`w-6 h-6 ${w.color}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{w.name}</span>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
