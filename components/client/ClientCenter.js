'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, CreditCard, Receipt, FileText, ChevronRight,
    LayoutDashboard, TrendingUp, ShieldCheck, Download, Zap,
    Cpu, Settings2, ShieldAlert
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import FinanceDashboard from '../billing/FinanceDashboard';

export default function ClientCenter({ isOpen, onClose }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('summary');
    const [mounted, setMounted] = useState(false);

    // Mock user role
    const userRole = 'super_admin';
    const isSystemAdmin = ['super_admin', 'system_admin', 'owner'].includes(userRole);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const tabs = [
        { id: 'summary', label: 'Resumen', icon: LayoutDashboard },
        { id: 'finances', label: 'Finanzas & Pagos', icon: CreditCard },
        { id: 'invoices', label: 'Facturación', icon: Receipt },
        { id: 'contracts', label: 'Contratos', icon: FileText },
        ...(isSystemAdmin ? [{ id: 'system', label: 'Sistema', icon: Cpu }] : []),
    ];

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998]"
                    />

                    {/* Premium Centered Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-6 md:inset-10 z-[9999] flex flex-col pointer-events-none justify-center items-center"
                    >
                        {/* Card Layout - Now strictly centered and contained */}
                        <div className="w-full max-w-6xl h-full max-h-[90vh] bg-[#0E0E18]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/5 pointer-events-auto relative">

                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
                                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[100px]" />
                            </div>

                            {/* Header */}
                            <div className="p-8 border-b border-white/5 flex justify-between items-start relative z-10 shrink-0">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-1 ring-white/20">
                                        DZ
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-white tracking-tight">Cliente Demo</h2>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">ACTIVO</span>
                                            <span className="text-gray-400 font-medium">Nivel 1: Creación</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="px-6 py-3 bg-white text-black hover:bg-gray-200 text-sm font-bold rounded-xl transition-colors shadow-lg shadow-white/10">
                                        Actualizar Plan
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/5"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-white/5 px-8 relative z-10 shrink-0">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-8 py-5 text-sm font-bold border-b-2 transition-all flex items-center gap-3 ${activeTab === tab.id
                                            ? 'border-primary text-white bg-white/5'
                                            : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
                                {/* Summary Tab */}
                                {activeTab === 'summary' && (
                                    <div className="space-y-8 max-w-5xl mx-auto">
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                                <div className="text-sm text-gray-400 mb-2 font-medium uppercase tracking-wider">Saldo a Favor</div>
                                                <div className="text-3xl font-black text-emerald-400">$1,250.00</div>
                                            </div>
                                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                                <div className="text-sm text-gray-400 mb-2 font-medium uppercase tracking-wider">Próximo Cobro</div>
                                                <div className="text-3xl font-bold text-white">Oct 24</div>
                                            </div>
                                        </div>

                                        <div className="p-8 rounded-3xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/20 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-20"><Zap className="w-32 h-32" /></div>
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-2xl font-black text-white">Tu Plan Actual</h3>
                                                    <span className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-bold shadow-lg shadow-violet-600/20">DIIC PRO</span>
                                                </div>
                                                <ul className="grid sm:grid-cols-2 gap-4 mb-8">
                                                    <li className="flex items-center gap-3 text-gray-200 bg-black/20 p-3 rounded-xl">
                                                        <TrendingUp className="w-5 h-5 text-green-400" /> Acceso total a Studio
                                                    </li>
                                                    <li className="flex items-center gap-3 text-gray-200 bg-black/20 p-3 rounded-xl">
                                                        <Zap className="w-5 h-5 text-yellow-400" /> Analíticas Avanzadas
                                                    </li>
                                                </ul>
                                                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold transition-colors border border-white/10">
                                                    Ver detalles del plan
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Finance Tab */}
                                {activeTab === 'finances' && (
                                    <div className="space-y-8 max-w-6xl mx-auto">
                                        <div className="flex items-center gap-4 mb-6 p-6 rounded-2xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20 text-blue-100">
                                            <div className="p-3 rounded-xl bg-blue-500/20 shrink-0"><Zap className="w-6 h-6 text-blue-400" /></div>
                                            <p className="text-lg font-medium">Hola, soy tu asistente financiero 🤖. Aquí ves tu plan, tus facturas y el estado de tus servicios en tiempo real.</p>
                                        </div>
                                        <FinanceDashboard />
                                    </div>
                                )}

                                {/* Invoices Tab */}
                                {activeTab === 'invoices' && (
                                    <div className="space-y-4 max-w-5xl mx-auto">
                                        <h3 className="text-lg font-bold text-white mb-4">Historial de Facturación</h3>
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 rounded-lg bg-white/5 text-gray-400">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">INV-00{i}</div>
                                                        <div className="text-xs text-gray-500">24 Oct 2025 • Plan Pro</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-white">$29.00</div>
                                                    <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 mt-1 justify-end">
                                                        <Download className="w-3 h-3" /> PDF
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Contracts/Docs Tab */}
                                {activeTab === 'contracts' && (
                                    <div className="text-center py-20">
                                        <ShieldCheck className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                                        <h3 className="text-2xl font-bold text-white mb-2">Documentos Legales</h3>
                                        <p className="text-gray-500">Aquí encontrarás tus contratos y acuerdos de confidencialidad.</p>
                                    </div>
                                )}

                                {/* System Tab (Authorized Only) */}
                                {activeTab === 'system' && isSystemAdmin && (
                                    <div className="max-w-4xl mx-auto py-10">
                                        <div className="p-10 rounded-[2.5rem] bg-indigo-600/5 border border-indigo-500/20 text-center relative overflow-hidden backdrop-blur-xl">
                                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />

                                            <div className="w-24 h-24 rounded-3xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                                <ShieldAlert className="w-12 h-12 text-indigo-400" />
                                            </div>

                                            <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Acceso al Modo Sistema</h3>
                                            <p className="text-gray-400 mb-10 text-lg leading-relaxed max-w-lg mx-auto">
                                                Estás a punto de entrar al núcleo operativo de DIIC ZONE.
                                                Toda acción aquí afecta la estructura global de la red.
                                            </p>

                                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                                <button
                                                    onClick={() => {
                                                        onClose();
                                                        router.push('/dashboard/systemcore');
                                                    }}
                                                    className="px-10 py-5 bg-indigo-500 text-white font-black rounded-2xl hover:bg-indigo-400 transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center gap-3 uppercase tracking-widest text-sm"
                                                >
                                                    <Cpu className="w-5 h-5" /> Entrar al Cerebro
                                                </button>
                                                <button
                                                    className="px-10 py-5 bg-white/5 text-gray-400 font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/10"
                                                    onClick={() => setActiveTab('summary')}
                                                >
                                                    Volver al Resumen
                                                </button>
                                            </div>

                                            <div className="mt-12 grid grid-cols-3 gap-6 opacity-40">
                                                <div className="text-xs font-bold text-gray-500 uppercase">Capa 0: Kernel</div>
                                                <div className="text-xs font-bold text-gray-500 uppercase">Estatus: Encriptado</div>
                                                <div className="text-xs font-bold text-gray-500 uppercase">Sesión: Admin</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
