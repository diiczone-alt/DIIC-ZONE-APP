import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { 
    Home, Clapperboard, MonitorPlay, BarChart2, User, Share2, 
    CreditCard, MessageSquare, Video, Palette, Mic2, 
    CalendarDays, ShieldAlert, Globe, UserCheck, Users 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const clientId = searchParams.get('client');
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

    // Helper to preserve client context
    const getScopedHref = (baseHref) => {
        if (!clientId) return baseHref;
        const url = new URL(baseHref, 'http://localhost');
        url.searchParams.set('client', clientId);
        return url.pathname + url.search;
    };

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: Home, color: 'text-primary' },
        { label: 'Conectividad & Automatización', href: '/dashboard/connectivity', icon: Share2, color: 'text-indigo-400' },
    ];

    const workstations = [
        { label: 'Community M.', href: '/workstation/community-manager', icon: Users, color: 'text-indigo-400' },
        { label: 'Filmmaker', href: '/dashboard/filmmaker', icon: Clapperboard, color: 'text-orange-400' },
        { label: 'Designer', href: '/dashboard/design', icon: MonitorPlay, color: 'text-fuchsia-400' },
        { label: 'Audio Studio', href: '/dashboard/audio', icon: BarChart2, color: 'text-blue-400' },
    ];

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
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.href}
                                href={getScopedHref(item.href)} 
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all border ${
                                    isActive 
                                    ? 'bg-primary/10 text-primary border-primary/20' 
                                    : 'hover:bg-white/5 text-gray-400 border-transparent'
                                }`}
                            >
                                <item.icon className={`w-6 h-6 ${isActive ? '' : 'opacity-70'}`} />
                                <span className="font-medium hidden lg:block">{item.label}</span>
                            </Link>
                        );
                    })}

                    {/* --- WORKSTATIONS --- */}
                    <div className="px-4 pt-4 pb-2">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden lg:block mb-2">Workstations</p>
                        <div className="space-y-1">
                            {workstations.map((ws) => {
                                const isActive = pathname.startsWith(ws.href);
                                return (
                                    <Link 
                                        key={ws.href}
                                        href={getScopedHref(ws.href)} 
                                        className={`flex items-center gap-4 px-4 py-2 rounded-xl transition-all text-sm border ${
                                            isActive 
                                            ? 'bg-white/10 text-white border-white/10' 
                                            : 'hover:bg-white/5 text-gray-400 hover:text-white border-transparent'
                                        }`}
                                    >
                                        <ws.icon className={`w-5 h-5 ${ws.color} ${isActive ? '' : 'opacity-70'}`} />
                                        <span className="font-medium hidden lg:block">{ws.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* --- ADMIN CORE --- */}
                    <div className="px-4 pt-4">
                        <p className="text-[10px] font-bold text-red-500/50 uppercase tracking-widest hidden lg:block mb-2">Admin Core</p>
                        <Link href={getScopedHref("/dashboard/hq/control")} className={`flex items-center gap-4 px-4 py-2 rounded-xl transition-all text-sm border ${
                            pathname.startsWith('/dashboard/hq')
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'hover:bg-red-500/10 text-red-500/60 hover:text-red-400 border-transparent hover:border-red-500/20'
                        }`}>
                            <ShieldAlert className="w-5 h-5" />
                            <span className="font-medium hidden lg:block">Gobernanza</span>
                        </Link>
                    </div>

                    {/* --- METRICS --- */}
                    <div className="px-4 pt-4 border-t border-white/5 mt-4">
                        <Link href={getScopedHref("/dashboard/analytics")} className={`flex items-center gap-4 px-4 py-2 rounded-xl transition-all text-sm ${
                            pathname === '/dashboard/analytics'
                            ? 'bg-white/5 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 opacity-60 hover:opacity-100'
                        }`}>
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
