'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/ui/BrandLogo';
import { Menu, X, ArrowRight, Sparkles, User, LogIn, LayoutDashboard } from 'lucide-react';

export default function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Quiénes Somos', href: '#quienes-somos' },
        { name: 'Marcas', href: '#marcas' },
        { name: 'Nichos', href: '#nichos' },
        { name: 'Servicios', href: '#servicios' },
        { name: 'Academy', href: '#academy' },
        { name: 'Planes', href: '#planes' },
        { name: 'Testimonios', href: '#testimonios' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-[#050510]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50 py-3' 
                : 'bg-transparent py-5'
        }`}>
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-950/60 group-hover:scale-105 transition-transform">
                        <div className="w-full h-full bg-[#070718] rounded-[10px] flex items-center justify-center">
                            <BrandLogo className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                            DIIC ZONE
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        </span>
                        <span className="text-[9px] font-mono tracking-widest text-indigo-400 uppercase font-semibold -mt-1">
                            Estudio & Marketing
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden lg:flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-inner">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="#zona-creativa"
                        className="px-3 py-1.5 rounded-full text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all ml-1 flex items-center gap-1"
                    >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Zona Creativa
                    </a>
                </div>

                {/* Right Action Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/login"
                        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center gap-1.5"
                    >
                        <LogIn className="w-3.5 h-3.5 text-gray-400" />
                        Iniciar Sesión
                    </Link>

                    <Link
                        href="/onboarding?type=client"
                        className="px-4 py-2 rounded-xl text-xs font-black text-white bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-400/30 hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-1.5"
                    >
                        <User className="w-3.5 h-3.5" />
                        Registrar Marca
                    </Link>

                    <Link
                        href="/hub"
                        className="px-4 py-2 rounded-xl text-xs font-black text-black bg-white hover:bg-gray-100 shadow-lg shadow-white/10 hover:scale-105 transition-all flex items-center gap-1.5"
                    >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Dashboard
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
                    aria-label="Toggle Menu"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-[#08081a]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 animate-slide-up">
                    <div className="flex flex-col space-y-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="#zona-creativa"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-4 py-2.5 rounded-xl text-sm font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20"
                        >
                            ✨ Zona Creativa (Talentos)
                        </a>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
                        <Link
                            href="/login"
                            className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-gray-300 bg-white/5 border border-white/10"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link
                            href="/onboarding?type=client"
                            className="w-full text-center py-2.5 rounded-xl text-xs font-black text-white bg-indigo-600 border border-indigo-400/30"
                        >
                            Registrar Mi Marca
                        </Link>
                        <Link
                            href="/hub"
                            className="w-full text-center py-2.5 rounded-xl text-xs font-black text-black bg-white"
                        >
                            Entrar al Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
