'use client';

import HQSidebar from '@/components/layout/HQSidebar';
import { 
    Settings, Shield, DollarSign, 
    Users, Bell, Lock, Globe, 
    ChevronRight, Save, Plus
} from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-[#050511] text-white font-sans selection:bg-indigo-500/30">
            <HQSidebar />

            <div className="pl-64 transition-all duration-300">
                <main className="p-8 max-w-[1200px] mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">Configuración del Sistema</h1>
                            <p className="text-gray-400 mt-1">Personalización de parámetros y niveles de acceso</p>
                        </div>
                        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
                            <Save className="w-5 h-5" /> Guardar Cambios
                        </button>
                    </div>

                    {/* Settings Sections */}
                    <div className="space-y-6">
                        <SettingsSection 
                            title="Planes y Precios" 
                            description="Gestión de ofertas comerciales para clientes"
                            icon={DollarSign}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <PriceCard label="Basic" price="$100" features={['2 Reels', '4 Posts']} />
                                <PriceCard label="Standard" price="$200" features={['4 Reels', '8 Posts', 'IA']} />
                                <PriceCard label="Premium" price="$350" features={['8 Reels', '15 Posts', 'Ads']} active />
                            </div>
                            <button className="mt-4 text-xs font-black uppercase text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
                                <Plus className="w-3 h-3" /> Añadir Nuevo Plan
                            </button>
                        </SettingsSection>

                        <SettingsSection 
                            title="Control de Accesos" 
                            description="Niveles de permiso para el equipo interno"
                            icon={Shield}
                        >
                            <div className="space-y-3">
                                <AccessRow role="Director / Admin" access="Total" />
                                <AccessRow role="Community Manager" access="Clientes Asignados" />
                                <AccessRow role="Editor / Diseñador" access="Producción" />
                                <AccessRow role="Freelance" access="Solo Tareas" />
                            </div>
                        </SettingsSection>

                        <SettingsSection 
                            title="Notificaciones y Alertas" 
                            description="Configuración de avisos automáticos de pagos y retrasos"
                            icon={Bell}
                        >
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-4 h-4 text-amber-500" />
                                    <span className="text-sm font-bold">Alertas de Pagos Vencidos</span>
                                </div>
                                <div className="w-10 h-6 bg-indigo-600 rounded-full relative">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                </div>
                            </div>
                        </SettingsSection>

                        <SettingsSection 
                            title="Seguridad" 
                            description="Cambio de Master Key y accesos restringidos"
                            icon={Lock}
                        >
                            <button className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
                                Rotar Master Key
                            </button>
                        </SettingsSection>
                    </div>

                </main>
            </div>
        </div>
    );
}

function SettingsSection({ title, description, icon: Icon, children }) {
    return (
        <div className="bg-[#0A0A15] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                    <Icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white leading-none">{title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

function PriceCard({ label, price, features, active = false }) {
    return (
        <div className={`p-5 rounded-2xl border transition-all cursor-pointer ${active ? 'bg-indigo-600/10 border-indigo-500/40 shadow-lg shadow-indigo-500/10' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</h4>
            <div className="flex items-end gap-1 mt-2">
                <span className="text-2xl font-black text-white">{price}</span>
                <span className="text-[10px] text-gray-600 font-bold uppercase mb-1.5">/mes</span>
            </div>
            <ul className="mt-4 space-y-2">
                {features.map(f => (
                    <li key={f} className="text-[10px] text-gray-400 flex items-center gap-2">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                        {f}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function AccessRow({ role, access }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white">{role}</h4>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Acceso: {access}</p>
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
        </div>
    );
}
