import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Clapperboard, MonitorPlay, BarChart2, User, Share2, CreditCard, MessageSquare, Video, Palette, Mic2, CalendarDays, ShieldAlert, Globe, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
    const router = useRouter();
    const { user } = useAuth();
    const [clickCount, setClickCount] = useState(0);

    const handleLogoClick = () => {
        setClickCount(prev => prev + 1);

        if (clickCount + 1 === 3) {
            toast.info("Acceso restringido...", { description: "Solo personal autorizado.", duration: 1000 });
        }
    };

    useEffect(() => {
        if (clickCount >= 5) {
            toast.success("🔐 NÚCLEO ACTIVADO", {
                description: "Entrando al Sistema Core de DIIC ZONE.",
                style: { background: "#050510", color: "#6366f1", border: "1px solid #6366f120" }
            });
            router.push('/dashboard/systemcore');
            setClickCount(0);
        }

        // Reset count after 2 seconds of inactivity
        const timer = setTimeout(() => setClickCount(0), 3000);
        return () => clearTimeout(timer);
    }, [clickCount, router]);

    return (
        <aside className="w-20 lg:w-64 glass border-r border-white/5 flex flex-col justify-between hidden md:flex z-50 h-screen sticky top-0">
            <div>
                <div
                    onClick={handleLogoClick}
                    className="h-20 flex items-center justify-center border-b border-white/5 mx-4 cursor-pointer hover:opacity-80 transition-all select-none group"
                >
                    <h1 className="font-display font-bold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary glow-text group-hover:scale-105 transition-transform">
                        DIIC
                    </h1>
                </div>

                <nav className="mt-8 flex flex-col gap-2 px-4">
                    <Link href="/" className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all">
                        <Home className="w-6 h-6" />
                        <span className="font-medium hidden lg:block">Dashboard</span>
                    </Link>

                    {/* --- CONNECTIVITY --- */}
                    <div className="px-4 pt-1">
                        <Link href="/dashboard/connectivity" className="flex items-center gap-4 px-4 py-2 rounded-xl hover:bg-indigo-500/10 text-indigo-400 hover:text-white transition-all text-sm border border-transparent hover:border-indigo-500/20">
                            <Share2 className="w-5 h-5" />
                            <span className="font-medium hidden lg:block">Conectividad & Automatización</span>
                        </Link>
                    </div>

                    {/* --- WORKSTATIONS --- */}
                    <div className="px-4 pt-4 pb-2">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden lg:block mb-2">Workstations</p>
                        <div className="space-y-1">
                            <Link href="/dashboard/community" className="flex items-center gap-4 px-4 py-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all text-sm">
                                <Share2 className="w-5 h-5 text-indigo-400" />
                                <span className="font-medium hidden lg:block">Community M.</span>
                            </Link>
                            <Link href="/dashboard/filmmaker" className="flex items-center gap-4 px-4 py-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all text-sm">
                                <Clapperboard className="w-5 h-5 text-orange-400" />
                                <span className="font-medium hidden lg:block">Filmmaker</span>
                            </Link>
                            <Link href="/dashboard/design" className="flex items-center gap-4 px-4 py-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all text-sm">
                                <MonitorPlay className="w-5 h-5 text-fuchsia-400" />
                                <span className="font-medium hidden lg:block">Designer</span>
                            </Link>
                            <Link href="/dashboard/audio" className="flex items-center gap-4 px-4 py-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all text-sm">
                                <BarChart2 className="w-5 h-5 text-blue-400" />
                                <span className="font-medium hidden lg:block">Audio Studio</span>
                            </Link>
                        </div>
                    </div>

                    {/* --- ADMIN CORE --- */}
                    <div className="px-4 pt-4">
                        <p className="text-[10px] font-bold text-red-500/50 uppercase tracking-widest hidden lg:block mb-2">Admin Core</p>
                        <Link href="/dashboard/hq/control" className="flex items-center gap-4 px-4 py-2 rounded-xl hover:bg-red-500/10 text-red-500/60 hover:text-red-400 transition-all text-sm border border-transparent hover:border-red-500/20">
                            <ShieldAlert className="w-5 h-5" />
                            <span className="font-medium hidden lg:block">Gobernanza</span>
                        </Link>
                    </div>

                    {/* --- LEGACY LINKS (Optional or collapsed) --- */}
                    <div className="px-4 pt-4 border-t border-white/5 mt-4">
                        <Link href="/dashboard/analytics" className="flex items-center gap-4 px-4 py-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all text-sm opacity-60 hover:opacity-100">
                            <BarChart2 className="w-5 h-5" />
                            <span className="font-medium hidden lg:block">Métricas</span>
                        </Link>
                    </div>
                </nav>
            </div>

            <div className="p-4">
                <div className="glass p-4 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-primary flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                        {user?.full_name?.substring(0, 2).toUpperCase() || 'DZ'}
                    </div>
                    <div className="hidden lg:block overflow-hidden">
                        <div className="text-sm font-bold text-white truncate">{user?.full_name || 'DIIC User'}</div>
                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{user?.role || 'Visitante'}</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
