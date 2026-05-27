'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    UploadCloud, Film, CheckCircle, Clock, 
    ArrowRight, AlertCircle, Plus, Search, 
    HardDrive, ChevronRight
} from 'lucide-react';

const INITIAL_UPLOADS = [
    { id: 'PRJ-204', title: 'Video Corporativo', client: 'Clínica Smith', date: '2026-02-10', filesCount: 0, status: 'pending', size: '--', type: 'Corporativo' },
    { id: 'PRJ-205', title: 'Reels Rutina', client: 'FitLife Gym', date: '2026-02-12', filesCount: 12, status: 'partial', size: '4.8 GB', type: 'Redes' },
    { id: 'PRJ-206', title: 'Cobertura Evento', client: 'Tech Solutions', date: '2026-02-14', filesCount: 38, status: 'uploaded', size: '24.2 GB', type: 'Evento' },
    { id: 'PRJ-207', title: 'Campaña Lanzamiento', client: 'EcoStore', date: '2026-02-15', filesCount: 45, status: 'uploaded', size: '32.1 GB', type: 'Publicidad' },
];

export default function FilmmakerUploadsPage() {
    const router = useRouter();
    const [uploads, setUploads] = useState(INITIAL_UPLOADS);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUploads = uploads.filter(up => 
        up.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        up.client.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 p-8 space-y-8 overflow-y-auto bg-[#050511] text-white custom-scrollbar">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-2">
                        <UploadCloud className="w-8 h-8 text-cyan-500" /> Centro de Subidas
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Sincroniza y organiza el material crudo (raw footage) de tus rodajes para el equipo de edición.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-[#0E0E18] border border-white/10 rounded-2xl px-5 py-2.5 flex items-center gap-4 shadow-xl">
                        <div className="text-right">
                            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Almacenamiento DIIC Cloud</p>
                            <p className="text-xs font-black text-white uppercase tracking-tighter">61.1 GB / 200 GB Usado</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-black border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                            <HardDrive className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Subidas Completas</span>
                        <span className="text-2xl font-black text-white mt-1 block">2 Rodajes</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Subidas Parciales</span>
                        <span className="text-2xl font-black text-white mt-1 block">1 Rodaje</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Pendientes de Envío</span>
                        <span className="text-2xl font-black text-white mt-1 block">1 Rodaje</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Search Input */}
            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Buscar por proyecto o cliente..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0E0E18] border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                />
            </div>

            {/* Uploads List */}
            <div className="bg-[#0E0E18] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Estado de Carga por Rodaje</h3>
                    <span className="text-xs text-gray-500 font-mono bg-black/20 px-2 py-0.5 rounded-full">{filteredUploads.length} total</span>
                </div>

                <div className="divide-y divide-white/5">
                    {filteredUploads.map((project) => (
                        <div key={project.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                                    <Film className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-white uppercase tracking-tight">{project.title}</h4>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">Cliente: <span className="text-cyan-400 font-semibold">{project.client}</span> • ID: {project.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-left md:text-right shrink-0">
                                <div>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Archivos</span>
                                    <span className="text-sm font-bold text-white mt-1 block">{project.filesCount} clips ({project.size})</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Fecha de Rodaje</span>
                                    <span className="text-sm font-bold text-white mt-1 block">{project.date}</span>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Estado de Sincronización</span>
                                    <span className="mt-1 block">
                                        {project.status === 'uploaded' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">
                                                Completado
                                            </span>
                                        )}
                                        {project.status === 'partial' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase">
                                                Parcial (12/24)
                                            </span>
                                        )}
                                        {project.status === 'pending' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 uppercase">
                                                Pendiente
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={() => router.push(`/workstation/filmmaker/upload/${project.id}`)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 self-start md:self-auto ${
                                    project.status === 'uploaded' 
                                    ? 'bg-white/5 hover:bg-white/10 text-white' 
                                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20'
                                }`}
                            >
                                {project.status === 'uploaded' ? 'Subir Más' : 'Subir Material'} <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
