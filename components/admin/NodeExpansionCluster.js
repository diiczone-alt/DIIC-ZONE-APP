'use client';

import { useState } from 'react';
import { Globe, Server, Activity, AlertTriangle, ShieldCheck, MapPin, Zap } from 'lucide-react';

const NODES = [
    {
        id: 'hq',
        name: 'HQ Central',
        location: 'Cloud / Main',
        status: 'online',
        load: 45,
        quality: 99,
        revenue: '12.5k',
        type: 'master'
    },
    {
        id: 'norte',
        name: 'Nodo Norte',
        location: 'Quito, EC',
        status: 'active',
        load: 78,
        quality: 94,
        revenue: '8.2k',
        type: 'satellite'
    },
    {
        id: 'sur',
        name: 'Nodo Sur',
        location: 'Guayaquil, EC',
        status: 'warning', // Quality drop warning
        load: 92, // High load
        quality: 88,
        revenue: '4.9k',
        type: 'satellite'
    },
    {
        id: 'miami',
        name: 'Nodo Global',
        location: 'Miami, USA',
        status: 'setup',
        load: 0,
        quality: 100,
        revenue: '0',
        type: 'satellite'
    }
];

export default function NodeExpansionCluster() {
    const [selectedNode, setSelectedNode] = useState(NODES[0]);

    return (
        <div className="bg-[#0F0F1A] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-6 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                        <Globe className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Red de Nodos Global</h3>
                        <p className="text-[10px] text-gray-400">Infraestructura distribuida</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                    <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-300">Net Flow: 1.2 TB/s</span>
                </div>
            </div>

            {/* Network Visualization (Abstract Map) */}
            <div className="relative h-48 bg-[#13131F] rounded-2xl border border-white/5 mb-6 overflow-hidden grid place-items-center">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                {/* Connections (SVG Lines) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* HQ lines to others... calculated roughly for visualization */}
                    <line x1="50%" y1="50%" x2="25%" y2="35%" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" />
                    <line x1="50%" y1="50%" x2="75%" y2="65%" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" />
                    <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="rgba(16, 185, 129, 0.1)" strokeDasharray="4" />
                </svg>

                {/* Nodes on Map */}
                {/* HQ Center */}
                <div
                    onClick={() => setSelectedNode(NODES[0])}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 z-10`}
                >
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-[#0F0F1A] shadow-[0_0_20px_rgba(16,185,129,0.3)] ${selectedNode.id === 'hq' ? 'border-emerald-400' : 'border-emerald-500/30'}`}>
                        <Server className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 bg-black/60 backdrop-blur rounded text-[10px] font-bold text-emerald-400">HQ CORE</div>
                </div>

                {/* North Node */}
                <div
                    onClick={() => setSelectedNode(NODES[1])}
                    className="absolute top-[30%] left-[20%] cursor-pointer transition-transform hover:scale-110"
                >
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center bg-[#0F0F1A] ${selectedNode.id === 'norte' ? 'border-blue-400' : 'border-blue-500/30'}`}>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* South Node (Warning) */}
                <div
                    onClick={() => setSelectedNode(NODES[2])}
                    className="absolute bottom-[30%] right-[20%] cursor-pointer transition-transform hover:scale-110"
                >
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center bg-[#0F0F1A] ${selectedNode.id === 'sur' ? 'border-orange-400 bg-orange-500/10' : 'border-orange-500/30'}`}>
                        <AlertTriangle className="w-3 h-3 text-orange-400" />
                    </div>
                </div>

                {/* Miami Node (Setup) */}
                <div
                    onClick={() => setSelectedNode(NODES[3])}
                    className="absolute top-[25%] right-[15%] cursor-pointer transition-transform hover:scale-110 opacity-50"
                >
                    <div className={`w-6 h-6 rounded-full border border-dashed flex items-center justify-center bg-[#0F0F1A] border-gray-500`}>
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Selected Node Details */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 transition-all animate-fade-in flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="font-bold text-white text-lg flex items-center gap-2">
                            {selectedNode.name}
                            {selectedNode.status === 'warning' && <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] rounded uppercase">Revisión</span>}
                            {selectedNode.status === 'setup' && <span className="px-2 py-0.5 bg-gray-500/10 border border-gray-500/20 text-gray-400 text-[10px] rounded uppercase">Setup</span>}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" /> {selectedNode.location}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase text-gray-500 font-bold">Ingresos Mes</p>
                        <p className="text-xl font-mono text-white">${selectedNode.revenue}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-black/20 rounded-lg">
                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                            <span>Saturación</span>
                            <span className={selectedNode.load > 80 ? 'text-red-400' : 'text-emerald-400'}>{selectedNode.load}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${selectedNode.load > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${selectedNode.load}%` }}></div>
                        </div>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg">
                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                            <span>Calidad</span>
                            <span className={selectedNode.quality < 90 ? 'text-orange-400' : 'text-emerald-400'}>{selectedNode.quality}/100</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${selectedNode.quality < 90 ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${selectedNode.quality}%` }}></div>
                        </div>
                    </div>
                </div>

                {selectedNode.status === 'warning' && (
                    <div className="flex items-center gap-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg text-xs text-orange-300">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span><strong>Alerta:</strong> Calidad bajo el estándar (90). Se ha activado auditoría central automática.</span>
                    </div>
                )}

                {selectedNode.status === 'active' && (
                    <div className="flex items-center gap-2 p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-xs text-emerald-300/80">
                        <Zap className="w-4 h-4 shrink-0" />
                        <span>Nodo operando óptimamente. Distribución de carga habilitada.</span>
                    </div>
                )}
            </div>
        </div>
    );
}
