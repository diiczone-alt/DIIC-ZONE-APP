'use client';

import { useState } from 'react';
import { Shield, Lock, Users, Database, FileText, AlertTriangle, Check, X, Gavel, Key } from 'lucide-react';

const ROLES_MATRIX = [
    { role: 'Cliente Gratis', view: 'Limitado', action: 'Crear (1 Proyecto)', color: 'text-gray-400' },
    { role: 'Cliente Basic', view: 'Producción', action: 'Crear (3 Proyectos)', color: 'text-blue-400' },
    { role: 'Cliente Pro/Emp', view: 'Total', action: 'Acceso Total', color: 'text-emerald-400' },
    { role: 'Creativo', view: 'Asignaciones', action: 'Editar / Subir', color: 'text-purple-400' },
    { role: 'Admin', view: 'God Mode', action: 'Control Total', color: 'text-red-500' },
];

const PLAN_LIMITS = [
    { plan: 'Gratis', projects: '1', storage: '1GB', automation: 'No', support: 'Baja' },
    { plan: 'Básico', projects: '3', storage: '5GB', automation: '1 Flujo', support: 'Normal' },
    { plan: 'Pro', projects: 'Ilimitado', storage: '20GB', automation: '5 Flujos', support: 'Media' },
    { plan: 'Empresarial', projects: 'Ilimitado', storage: 'Ilimitado', automation: 'Ilimitado', support: 'Alta' },
];

const APPROVAL_RULES = [
    { action: 'Publicar Contenido', approver: 'Cliente', level: 'Strict' },
    { action: 'Aumentar Presupuesto', approver: 'Cliente', level: 'Strict' },
    { action: 'Eliminar Proyecto', approver: 'Admin', level: 'Critical' },
    { action: 'Entrega Final', approver: 'Senior', level: 'Internal' },
];

export default function PlatformGovernanceConsole() {
    const [activeSection, setActiveSection] = useState('roles');

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1A1A2E] border border-white/5 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Gavel className="text-red-500" />
                        Gobernanza y Reglas
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Constitución Digital de DIIC ZONE. Control de roles, límites y seguridad.
                    </p>
                </div>
                <div className="flex gap-2 text-xs font-mono text-gray-500 bg-black/20 p-2 rounded-lg border border-white/5">
                    <span>System Integrity:</span>
                    <span className="text-emerald-400 font-bold">ENFORCED (100%)</span>
                </div>
            </div>

            {/* Navigation Pills */}
            <div className="flex space-x-1 bg-[#0F0F1A] p-1 rounded-xl border border-white/5 w-fit">
                {[
                    { id: 'roles', label: 'Roles y Accesos', icon: Key },
                    { id: 'plans', label: 'Límites de Plan', icon: Database },
                    { id: 'approvals', label: 'Aprobaciones', icon: FileText },
                    { id: 'protection', label: 'Protección', icon: Shield }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${activeSection === tab.id
                                ? 'bg-white/10 text-white shadow'
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Display */}
            <div className="bg-[#0F0F1A] border border-white/5 rounded-3xl p-6 min-h-[400px]">

                {activeSection === 'roles' && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="text-blue-500 w-5 h-5" /> Matriz de Accesos (RBAC)
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-500">
                                        <th className="py-3 px-4">Rol de Usuario</th>
                                        <th className="py-3 px-4">Visibilidad</th>
                                        <th className="py-3 px-4">Permisos Ejecución</th>
                                        <th className="py-3 px-4 text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {ROLES_MATRIX.map((r, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className={`py-4 px-4 font-bold ${r.color}`}>{r.role}</td>
                                            <td className="py-4 px-4 text-gray-300">{r.view}</td>
                                            <td className="py-4 px-4 text-gray-300">{r.action}</td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-emerald-500/20">Active</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeSection === 'plans' && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Database className="text-purple-500 w-5 h-5" /> Límites Técnicos por Plan
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {PLAN_LIMITS.map((plan, i) => (
                                <div key={i} className="bg-[#13131F] border border-white/5 p-4 rounded-xl flex flex-col gap-3 hover:border-white/10 transition-colors">
                                    <h4 className="font-bold text-white text-lg">{plan.plan}</h4>
                                    <div className="space-y-2 text-sm text-gray-400">
                                        <div className="flex justify-between border-b border-white/5 pb-1">
                                            <span>Proyectos</span> <span className="text-white">{plan.projects}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-1">
                                            <span>Storage</span> <span className="text-white">{plan.storage}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-1">
                                            <span>Automations</span> <span className="text-white">{plan.automation}</span>
                                        </div>
                                        <div className="flex justify-between text-xs pt-1 opacity-75">
                                            <span>Prioridad</span> <span className="text-emerald-400">{plan.support}</span>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-2">
                                        <div className="w-full bg-blue-500/10 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-blue-500 h-full w-full animate-pulse-slow"></div>
                                        </div>
                                        <p className="text-[10px] text-center mt-1 text-blue-400">Enforcement Active</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'approvals' && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Lock className="text-orange-500 w-5 h-5" /> Reglas de Aprobación
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {APPROVAL_RULES.map((rule, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1"><AlertTriangle className="w-4 h-4 text-orange-400" /></div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{rule.action}</p>
                                            <p className="text-xs text-gray-400">Requiere aprobación de: <strong className="text-white">{rule.approver}</strong></p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold bg-black/40 px-2 py-1 rounded text-orange-300 border border-orange-500/20">{rule.level}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 mt-4 text-xs text-blue-200">
                            <strong>Nota de Sistema:</strong> Un creativo no puede aprobar su propio trabajo (Regla #402). Esta restricción está hardcodeada en el núcleo de producción.
                        </div>
                    </div>
                )}

                {activeSection === 'protection' && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Shield className="text-emerald-500 w-5 h-5" /> Protección Anti-Abuso
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl">
                                <Check className="w-5 h-5 text-emerald-500" />
                                <div>
                                    <p className="text-sm font-bold text-white">Bloqueo de Storage Excesivo</p>
                                    <p className="text-xs text-emerald-400/70">Activo - Previene subidas masivas sin plan</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl">
                                <Check className="w-5 h-5 text-emerald-500" />
                                <div>
                                    <p className="text-sm font-bold text-white">Feature Flagging</p>
                                    <p className="text-xs text-emerald-400/70">Activo - Oculta funciones premium a usuarios básicos</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl">
                                <Check className="w-5 h-5 text-emerald-500" />
                                <div>
                                    <p className="text-sm font-bold text-white">Rate Limiting (API)</p>
                                    <p className="text-xs text-emerald-400/70">Activo - 100 req/min para Basic</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="text-center text-[10px] text-gray-600 uppercase font-bold tracking-widest pt-4">
                DIIC ZONE Governance Core v1.0
            </div>
        </div>
    );
}
