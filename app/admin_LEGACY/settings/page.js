'use client';

import { 
    Settings, Shield, Database, 
    Globe, Bell, Lock, 
    Smartphone, Zap, Sliders
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
    return (
        <div className="flex-1 overflow-y-auto p-10 bg-[#050511]">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Configuración del Hub</h1>
                <p className="text-gray-400">Control maestro de parámetros globales y seguridad (God Mode).</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* System Controls */}
                <div className="space-y-6">
                    <section className="bg-[#0A0A12] border border-white/5 rounded-[2rem] p-8 shadow-2xl">
                        <h3 className="text-sm font-black text-amber-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <Zap className="w-4 h-4" /> Nucleo del Sistema
                        </h3>
                        <div className="space-y-6">
                            <SettingToggle 
                                title="Modo Mantenimiento" 
                                desc="Desactiva el acceso público para todos los usuarios." 
                                icon={Shield} 
                                defaultEnabled={false} 
                            />
                            <SettingToggle 
                                title="Backup Automático" 
                                desc="Sincronización horaria con el servidor de respaldo." 
                                icon={Database} 
                                defaultEnabled={true} 
                            />
                            <SettingToggle 
                                title="Nuevos Registros" 
                                desc="Permitir que nuevos clientes se registren desde la web." 
                                icon={Globe} 
                                defaultEnabled={true} 
                            />
                        </div>
                    </section>

                    <section className="bg-[#0A0A12] border border-white/5 rounded-[2rem] p-8">
                        <h3 className="text-sm font-black text-blue-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <Bell className="w-4 h-4" /> Notificaciones Críticas
                        </h3>
                        <div className="space-y-6">
                            <SettingToggle 
                                title="Alertas de Pago" 
                                desc="Notificar al admin sobre cada transacción exitosa." 
                                icon={Bell} 
                                defaultEnabled={true} 
                            />
                            <SettingToggle 
                                title="Reportes de Error" 
                                desc="Envío inmediato de logs críticos al equipo técnico." 
                                icon={Bell} 
                                defaultEnabled={false} 
                            />
                        </div>
                    </section>
                </div>

                {/* Security & Access */}
                <div className="space-y-6">
                    <section className="bg-[#0A0A12] border border-white/5 rounded-[2rem] p-8 border-amber-500/10">
                        <h3 className="text-sm font-black text-amber-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <Lock className="w-4 h-4" /> Seguridad God Mode
                        </h3>
                            <div className="p-6 bg-amber-500/5 rounded-2xl border border-amber-500/10 mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-black text-white uppercase tracking-widest">Contraseña Maestra</span>
                                    <button className="text-[10px] font-black text-amber-500 uppercase tracking-widest hover:underline">123456777</button>
                                </div>
                            <div className="flex gap-2">
                                <input 
                                    type="password" 
                                    value="************" 
                                    disabled 
                                    className="flex-1 h-10 bg-black/40 border border-white/10 rounded-xl px-4 text-gray-500 text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <SettingToggle 
                                title="Autenticación 2FA" 
                                desc="Requerir código móvil para acceso administrativo." 
                                icon={Smartphone} 
                                defaultEnabled={true} 
                            />
                            <SettingToggle 
                                title="Whitelist de IPs" 
                                desc="Limitar acceso al Hub solo desde IPs autorizadas." 
                                icon={Sliders} 
                                defaultEnabled={false} 
                            />
                        </div>
                    </section>

                    <div className="p-8 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-[2rem] border border-white/5 text-center">
                        <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                            <Settings className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-white font-black uppercase tracking-tight mb-2">Build v2.4.0-STABLE</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Última actualización: Hoy, 10:45 AM</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingToggle({ title, desc, icon: Icon, defaultEnabled }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1.5">{title}</h4>
                    <p className="text-[10px] text-gray-600 font-medium leading-none">{desc}</p>
                </div>
            </div>
            <button 
                onClick={() => toast.info(`${title} actualizado`)}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${defaultEnabled ? 'bg-amber-500' : 'bg-gray-800'}`}
            >
                <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${defaultEnabled ? 'ml-6 shadow-lg shadow-black/50' : 'ml-0'}`} />
            </button>
        </div>
    );
}
