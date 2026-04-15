'use client';

import { useState } from 'react';
import { User, Lock, Bell, CreditCard, Save, Camera, Mail, Phone, Shield, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import GrowthPricing from '../growth/GrowthPricing';

export default function ClientAccountSettings() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('profile'); // profile, security, billing, notifications
    const [showPlans, setShowPlans] = useState(false);

    const full_name = user?.user_metadata?.full_name || user?.full_name || 'DIIC User';
    const initials = full_name.substring(0, 2).toUpperCase();
    const brand = user?.user_metadata?.brand || 'CEO / Fundador';
    const email = user?.email || 'usuario@example.com';

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Cambios guardados correctamente');
        }, 1500);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">

            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 shrink-0 space-y-2 sticky top-24">
                <NavButton
                    id="profile"
                    label="Perfil Público"
                    icon={User}
                    isActive={activeSection === 'profile'}
                    onClick={() => setActiveSection('profile')}
                />
                <NavButton
                    id="security"
                    label="Seguridad"
                    icon={Lock}
                    isActive={activeSection === 'security'}
                    onClick={() => setActiveSection('security')}
                />
                <NavButton
                    id="notifications"
                    label="Notificaciones"
                    icon={Bell}
                    isActive={activeSection === 'notifications'}
                    onClick={() => setActiveSection('notifications')}
                />
                <NavButton
                    id="billing"
                    label="Plan y Facturación"
                    icon={CreditCard}
                    isActive={activeSection === 'billing'}
                    onClick={() => setActiveSection('billing')}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full bg-[#0F0F1A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl min-h-[600px]">

                {/* Background Decor */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

                {/* PROFILE SECTION */}
                {activeSection === 'profile' && (
                    <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="border-b border-white/5 pb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Perfil Público</h2>
                            <p className="text-gray-400 text-sm">Administra tu información personal y cómo te ven los demás.</p>
                        </div>

                        {/* Avatar Upload */}
                        <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="relative group cursor-pointer w-20 h-20">
                                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20 overflow-hidden">
                                    {initials}
                                </div>
                                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Foto de Perfil</h3>
                                <p className="text-xs text-gray-500 mb-3 max-w-[200px]">Recomendado: 400x400px, PNG o JPG. Máx 2MB.</p>
                                <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold rounded-lg border border-white/10 transition-colors uppercase tracking-wider">
                                    Subir Nueva
                                </button>
                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <InputField label="Nombre Completo" placeholder={full_name} defaultValue={full_name} icon={User} />
                            <InputField label="Cargo / Título" placeholder={brand} defaultValue={brand} icon={Shield} />
                            <InputField label="Correo Electrónico" placeholder={email} defaultValue={email} type="email" icon={Mail} />
                            <InputField label="Teléfono" placeholder="+52 55 1234 5678" type="tel" icon={Phone} />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Biografía Corta</label>
                            <textarea
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors min-h-[120px] resize-none placeholder:text-gray-600"
                                placeholder="Escribe algo sobre ti y tu empresa..."
                            />
                        </div>
                    </div>
                )}

                {/* SECURITY SECTION */}
                {activeSection === 'security' && (
                    <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="border-b border-white/5 pb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Seguridad</h2>
                            <p className="text-gray-400 text-sm">Protege tu cuenta y gestiona tus credenciales.</p>
                        </div>

                        <div className="space-y-6 max-w-lg">
                            <InputField label="Contraseña Actual" type="password" placeholder="••••••••••••" icon={Lock} />
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Nueva Contraseña" type="password" placeholder="••••••••••••" icon={Lock} />
                                <InputField label="Confirmar Contraseña" type="password" placeholder="••••••••••••" icon={Lock} />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <h3 className="text-white font-bold mb-4">Dispositivos Activos</h3>
                            <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center border border-white/5">
                                        <Shield className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Windows PC - Chrome</h4>
                                        <p className="text-xs text-gray-400 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            Activo ahora • {user?.user_metadata?.city || 'Santo Domingo'}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-emerald-400 text-[10px] font-bold px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 uppercase tracking-wide">Actual</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* NOTIFICATIONS SECTION */}
                {activeSection === 'notifications' && (
                    <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="border-b border-white/5 pb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Notificaciones</h2>
                            <p className="text-gray-400 text-sm">Elige cómo y cuándo quieres que te contactemos.</p>
                        </div>

                        <div className="space-y-4">
                            <ToggleOption title="Nuevos Proyectos" description="Recibir alertas cuando se asignen nuevos proyectos." defaultChecked />
                            <ToggleOption title="Actualizaciones de Estado" description="Cuando un creativo cambie el estado de una tarea." defaultChecked />
                            <ToggleOption title="Mensajes Directos" description="Notificaciones de chat con el equipo." defaultChecked />
                            <ToggleOption title="Marketing y Ofertas" description="Recibir noticias sobre nuevas funciones y descuentos." />
                        </div>
                    </div>
                )}

                {/* BILLING SECTION */}
                {activeSection === 'billing' && (
                    <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="border-b border-white/5 pb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Plan y Facturación</h2>
                            <p className="text-gray-400 text-sm">Gestiona tu suscripción y métodos de pago.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-2xl p-6 border border-blue-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 bg-blue-500 text-white text-xs font-bold rounded-bl-xl shadow-lg">PLAN ACTUAL</div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white mb-1">Plan Business</h3>
                                <p className="text-blue-200 text-sm mb-4">$499.00 USD / mes</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowPlans(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-600/20 active:scale-95">
                                        Cambiar Plan
                                    </button>
                                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 transition-colors active:scale-95">
                                        Cancelar Suscripción
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-white font-bold text-sm">Método de Pago</h3>
                            <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5 opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">•••• •••• •••• 4242</h4>
                                        <p className="text-xs text-gray-400">Expira 12/28</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Visa</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Global Footer Actions */}
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3 relative z-10">
                    <button className="px-6 py-2.5 text-gray-400 hover:text-white font-bold text-xs transition-colors rounded-xl hover:bg-white/5">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform"
                    >
                        {isLoading ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-3.5 h-3.5" />
                        )}
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>

            {/* Plans Modal Overlay */}
            {showPlans && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md overflow-y-auto custom-scrollbar">
                    <div className="relative w-full max-w-7xl bg-[#070710] border border-white/10 rounded-[40px] p-2 md:p-8 shadow-[0_0_100px_rgba(0,0,0,1)] my-auto animate-in fade-in zoom-in-95 duration-300">
                        <button 
                            onClick={() => setShowPlans(false)} 
                            className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-gray-400 transition-colors z-50 group border border-white/5"
                        >
                            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                        <div className="w-full h-full overflow-hidden">
                            <GrowthPricing />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Sub-components for internal organization
function NavButton({ id, label, icon: Icon, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden group ${isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
        >
            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
            <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`} />
            <span className="relative z-10">{label}</span>
        </button>
    );
}

function InputField({ label, placeholder, defaultValue, type = 'text', icon: Icon }) {
    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
            <div className="relative group">
                <input
                    type={type}
                    defaultValue={defaultValue}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all placeholder:text-gray-600 group-hover:border-white/20"
                    placeholder={placeholder}
                />
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
        </div>
    );
}

function ToggleOption({ title, description, defaultChecked }) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div>
                <h4 className="text-white font-bold text-sm">{title}</h4>
                <p className="text-gray-400 text-xs">{description}</p>
            </div>
            <button
                onClick={() => setChecked(!checked)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${checked ? 'bg-blue-600' : 'bg-white/10'}`}
            >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 ${checked ? 'left-6' : 'left-1'}`} />
            </button>
        </div>
    );
}
