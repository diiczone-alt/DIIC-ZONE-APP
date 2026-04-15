'use client';

import { ShieldCheck, SortDesc, TrendingUp, Globe, Lock, AlertCircle, UserPlus, CheckCircle, Server } from 'lucide-react';
import SmartPriorityQueue from '../production/SmartPriorityQueue';
import CapacityOperationsCenter from '../admin/CapacityOperationsCenter';
import NodeExpansionCluster from '../admin/NodeExpansionCluster'; // Import // Import // Import

export default function OperationsCommandCenter() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#13131F] border border-white/5 p-6 rounded-3xl">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Server className="text-blue-500" />
                        Centro de Operaciones Global
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Control de Gobernanza, Priorización y Expansión de Nodos.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-emerald-400 uppercase">Sistema Nominal</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. GOBERNANZA DE PLATAFORMA */}
                <div className="bg-[#0F0F1A] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Gobernanza</h3>
                        </div>
                        <span className="text-xs font-mono text-gray-500">v4.2.0 Active</span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <Lock className="w-4 h-4 text-gray-400" />
                                <div>
                                    <p className="text-sm font-bold text-white">Control de Roles</p>
                                    <p className="text-[10px] text-gray-500">Limita acceso a datos sensibles</p>
                                </div>
                            </div>
                            <span className="text-emerald-400 text-xs font-bold">ACTIVO</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-4 h-4 text-orange-400" />
                                <div>
                                    <p className="text-sm font-bold text-white">Límites de Plan</p>
                                    <p className="text-[10px] text-gray-500">Restricción de Features automática</p>
                                </div>
                            </div>
                            <span className="text-emerald-400 text-xs font-bold">ENFORZADO</span>
                        </div>

                        <div className="mt-4 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 text-xs text-blue-300">
                            <strong>Log Reciente:</strong> Usuario "Junior_Ed" intentó acceder a "Finanzas". Acceso bloqueado por protocolo de gobernanza.
                        </div>
                    </div>
                </div>

                {/* 2. PRIORIZACIÓN INTELIGENTE (Componente Dinámico) */}
                <SmartPriorityQueue />

                {/* 3. ESCALAMIENTO DE CAPACIDAD (Monitor Dinámico) */}
                <CapacityOperationsCenter />

                {/* 4. EXPANSIÓN DE NODOS (Cluster Dinámico) */}
                <NodeExpansionCluster />

            </div>
        </div>
    );
}
