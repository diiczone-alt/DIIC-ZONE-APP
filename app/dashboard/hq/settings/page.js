'use client';

import { 
    Settings, Shield, Database, 
    Globe, Bell, Lock, 
    Smartphone, Zap, Sliders,
    Save, Plus, ChevronRight,
    Search, Server, Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function GodModeSettingsPage() {
    const [settings, setSettings] = useState({
        maintenance: false,
        backup: true,
        registrations: true,
        alerts: true,
        errors: false,
        twoFactor: true,
        whitelist: false
    });

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        toast.info(`Protocolo ${key.toUpperCase()} actualizado`);
    };

    return (
        <div className="bg-[#050511] min-h-screen text-white font-sans selection:bg-indigo-500/30">
            <main className="p-10 max-w-[1400px] mx-auto space-y-12 pb-32">
                
                {/* Header Táctico */}
                <div className="relative group">
                    <div className="absolute -inset-4 bg-indigo-500/5 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Acceso de Nivel 5</span>
                                </div>
                                <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">GOD MODE</span>
                                </div>
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Configuración del <span className="text-indigo-500">HUB</span></h1>
                            <p className="text-gray-500 mt-2 font-medium">Control maestro de parámetros globales, seguridad y arquitectura del sistema.</p>
                        </div>
                        <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all flex items-center gap-3 border border-indigo-400/20 group/btn">
                            <Save className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" /> GUARDAR CONFIGURACIÓN
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Columna Izquierda: Nucleo y Notificaciones */}
                    <div className="lg:col-span-7 space-y-8">
                        
                        {/* NUCLEO DEL SISTEMA */}
                        <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Zap className="w-32 h-32 text-indigo-500" />
                            </div>
                            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                                NUCLEO DEL SISTEMA
                            </h3>
                            <div className="space-y-8">
                                <SettingRow 
                                    title="Modo Mantenimiento" 
                                    desc="Desactivar acceso público global. Solo IPs en whitelist podrán entrar." 
                                    icon={Shield} 
                                    enabled={settings.maintenance}
                                    onToggle={() => toggleSetting('maintenance')}
                                />
                                <SettingRow 
                                    title="Backup Automático" 
                                    desc="Sincronización horaria con los servidores de respaldo global." 
                                    icon={Database} 
                                    enabled={settings.backup}
                                    onToggle={() => toggleSetting('backup')}
                                />
                                <SettingRow 
                                    title="Protocolo de Registros" 
                                    desc="Permitir que nuevos usuarios inicien el ciclo de onboarding." 
                                    icon={Globe} 
                                    enabled={settings.registrations}
                                    onToggle={() => toggleSetting('registrations')}
                                />
                            </div>
                        </section>

                        {/* NOTIFICACIONES CRÍTICAS */}
                        <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10">
                            <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                                NOTIFICACIONES CRÍTICAS
                            </h3>
                            <div className="space-y-8">
                                <SettingRow 
                                    title="Alertas de Producción" 
                                    desc="Notificar al admin sobre retrasos en etapas de entrega." 
                                    icon={Bell} 
                                    enabled={settings.alerts}
                                    onToggle={() => toggleSetting('alerts')}
                                />
                                <SettingRow 
                                    title="Reportes de Error (Dev)" 
                                    desc="Envío inmediato de logs críticos al equipo técnico de soporte." 
                                    icon={Server} 
                                    enabled={settings.errors}
                                    onToggle={() => toggleSetting('errors')}
                                />
                            </div>
                        </section>
                    </div>

                    {/* Columna Derecha: Seguridad y Versión */}
                    <div className="lg:col-span-5 space-y-8">
                        
                        {/* SEGURIDAD GOD MODE */}
                        <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 border-amber-500/10 group/sec">
                            <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
                                SEGURIDAD GOD MODE
                            </h3>
                            
                            <div className="p-6 bg-amber-500/5 rounded-3xl border border-amber-500/10 mb-10 group-hover/sec:bg-amber-500/10 transition-colors">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Contraseña Maestra</span>
                                    <span className="text-[10px] font-mono text-amber-500 font-bold tracking-widest">ID: 8872_SEC</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 h-12 bg-black/40 border border-white/10 rounded-2xl flex items-center px-4 font-mono text-sm text-gray-500 tracking-widest">
                                        ••••••••••••
                                    </div>
                                    <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all text-white">
                                        <Search className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <SettingRow 
                                    title="Autenticación 2FA" 
                                    desc="Requerir código móvil para todo acceso administrativo." 
                                    icon={Smartphone} 
                                    enabled={settings.twoFactor}
                                    onToggle={() => toggleSetting('twoFactor')}
                                    small
                                />
                                <SettingRow 
                                    title="Whitelist de IPs" 
                                    desc="Limitar acceso al HUB solo desde redes autorizadas." 
                                    icon={Sliders} 
                                    enabled={settings.whitelist}
                                    onToggle={() => toggleSetting('whitelist')}
                                    small
                                />
                            </div>
                        </section>

                        {/* INFO DE COMPILACIÓN */}
                        <div className="p-10 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-transparent rounded-[2.5rem] border border-white/5 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
                            <div className="w-20 h-20 mx-auto bg-white/5 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-white/10 group">
                                <Settings className="w-10 h-10 text-white group-hover:rotate-180 transition-transform duration-1000" />
                            </div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-2 italic">BUILD V2.4.0-STABLE</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Última actualización: HOY, 10:45 AM</p>
                            
                            <div className="mt-8 pt-8 border-t border-white/5 flex justify-center gap-10">
                                <div>
                                    <p className="text-xl font-black text-white">99.9%</p>
                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">Uptime</p>
                                </div>
                                <div>
                                    <p className="text-xl font-black text-indigo-400">12ms</p>
                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">Latencia</p>
                                </div>
                                <div>
                                    <p className="text-xl font-black text-emerald-400">OK</p>
                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">Base de Datos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

function SettingRow({ title, desc, icon: Icon, enabled, onToggle, small = false }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-5">
                <div className={`rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-white/[0.08] transition-all duration-300 ${small ? 'w-10 h-10' : 'w-14 h-14'}`}>
                    <Icon className={`${small ? 'w-5 h-5' : 'w-7 h-7'} text-gray-500 group-hover:text-white transition-colors duration-300`} />
                </div>
                <div className="max-w-[280px]">
                    <h4 className={`font-black text-white uppercase tracking-tight leading-none mb-2 ${small ? 'text-xs' : 'text-sm'}`}>{title}</h4>
                    <p className={`text-gray-500 font-medium leading-tight ${small ? 'text-[9px]' : 'text-[11px]'}`}>{desc}</p>
                </div>
            </div>
            <button 
                onClick={onToggle}
                className={`w-14 h-7 rounded-full p-1 transition-all duration-500 relative ${enabled ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-white/5'}`}
            >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xl transition-all duration-500 transform ${enabled ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
        </div>
    );
}
