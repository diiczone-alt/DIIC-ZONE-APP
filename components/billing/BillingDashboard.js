'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, CheckCircle, AlertTriangle, Shield, Zap, History, ChevronRight } from 'lucide-react';

export default function BillingDashboard() {
    const [activeTab, setActiveTab] = useState('overview'); // overview, history, payment-methods

    // Mock Data
    const CURRENT_PLAN = {
        name: 'DIIC Pro Agency',
        price: '$299',
        cycle: 'Mensual',
        nextBilling: '24 Nov, 2024',
        status: 'active',
        features: ['Acceso Total al Studio', 'Soporte Prioritario 24/7', 'Almacenamiento Ilimitado', '5 Usuarios']
    };

    const INVOICES = [
        { id: 'INV-2024-001', date: '24 Oct, 2024', amount: '$299.00', status: 'Paid' },
        { id: 'INV-2024-002', date: '24 Sep, 2024', amount: '$299.00', status: 'Paid' },
        { id: 'INV-2024-003', date: '24 Aug, 2024', amount: '$299.00', status: 'Paid' },
    ];

    const PAYMENT_METHODS = [
        { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
        { id: 2, type: 'Mastercard', last4: '8899', expiry: '08/26', isDefault: false },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">Finanzas & Pagos</h1>
                    <p className="text-gray-400">Administra tu suscripción y métodos de pago.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-[#0E0E18] hover:bg-white/5 border border-white/10 rounded-xl text-white font-bold transition-all flex items-center gap-2">
                        <History className="w-4 h-4" /> Historial Completo
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-white font-bold shadow-lg shadow-indigo-600/20 transition-all">
                        Upgrade Plan
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Column: Plan Details & Usage */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Active Plan Card */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] group-hover:bg-indigo-600/20 transition-colors"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-start gap-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        Activo
                                    </div>
                                    <span className="text-gray-500 text-sm font-bold">Renueva el {CURRENT_PLAN.nextBilling}</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-6">{CURRENT_PLAN.name}</h2>
                                <div className="space-y-3">
                                    {CURRENT_PLAN.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-gray-300">
                                            <CheckCircle className="w-5 h-5 text-indigo-500" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-black text-white mb-2">{CURRENT_PLAN.price}<span className="text-lg text-gray-500 font-normal">/mes</span></div>
                                <button className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors text-sm">Cambiar Ciclo de Facturación</button>
                            </div>
                        </div>

                        {/* Usage Bar */}
                        <div className="mt-10 pt-8 border-t border-white/5">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-bold text-gray-400">Almacenamiento (Cloud Vault)</span>
                                <span className="text-indigo-400 font-bold text-sm">75% Usado</span>
                            </div>
                            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                                <div className="w-[75%] h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">1.5TB de 2TB utilizados. <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer underline">Aumentar espacio</span></p>
                        </div>
                    </div>

                    {/* Recent Invoices */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Download className="w-5 h-5 text-indigo-500" />
                                Últimas Facturas
                            </h3>
                            <button className="text-sm text-gray-400 hover:text-white transition-colors">Ver todas</button>
                        </div>
                        <div className="space-y-4">
                            {INVOICES.map(inv => (
                                <div key={inv.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#050511] flex items-center justify-center text-gray-400 group-hover:text-white">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-sm">Factura #{inv.id}</div>
                                            <div className="text-xs text-gray-500">{inv.date}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-white font-bold">{inv.amount}</div>
                                        <div className="px-3 py-1 rounded bg-green-500/10 text-green-500 text-xs font-bold uppercase">{inv.status}</div>
                                        <Download className="w-4 h-4 text-gray-500 hover:text-white transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column: Payment Methods & Security */}
                <div className="space-y-8">

                    {/* Payment Methods */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-purple-500" />
                            Métodos de Pago
                        </h3>
                        <div className="space-y-4">
                            {PAYMENT_METHODS.map(method => (
                                <div key={method.id} className={`p-4 rounded-xl border flex items-center justify-between ${method.isDefault ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-white/5 border-white/5'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                                            {/* Accessing external brand icons or using text for now */}
                                            <span className="text-black font-bold text-[10px]">{method.type}</span>
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-sm">•••• {method.last4}</div>
                                            <div className="text-xs text-gray-500">Expira {method.expiry}</div>
                                        </div>
                                    </div>
                                    {method.isDefault && (
                                        <div className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded uppercase font-bold">Default</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all text-sm font-bold flex items-center justify-center gap-2">
                            + Agregar Nuevo Método
                        </button>
                    </div>

                    {/* Security & Support Upsell */}
                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Pagos Seguros</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                Todas tus transacciones están encriptadas con seguridad de nivel bancario (AES-256).
                            </p>
                            <button className="text-indigo-400 font-bold text-sm hover:text-white transition-colors flex items-center gap-1 group">
                                Ver Certificados <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
// Helper icon
function FileText({ className }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
