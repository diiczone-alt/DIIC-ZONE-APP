'use client';

import { 
    Palette, Video, MessageSquare, 
    Globe, User, Layout, 
    Activity, Star, Clock, 
    CheckCircle2, AlertCircle, Zap,
    Shield, Camera
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCreativeZonePage() {
    // Role-Based Gruping
    const roles = [
        {
            title: 'Dirección / Admin',
            icon: Shield,
            members: [
                { name: 'Dicson', roles: ['Admin', 'Filmmaker'], load: '20%', status: 'active', projects: 2 },
            ]
        },
        {
            title: 'Community Managers',
            icon: MessageSquare,
            members: [
                { name: 'Leslie', roles: ['CM'], load: '65%', status: 'busy', projects: 5 },
            ]
        },
        {
            title: 'Editores de Video',
            icon: Video,
            members: [
                { name: 'Anthony', roles: ['Editor', 'Diseñador', 'Filmmaker'], load: '90%', status: 'busy', projects: 8 },
                { name: 'Fausto', roles: ['Editor'], load: '40%', status: 'active', projects: 3 },
                { name: 'Jimmy', roles: ['Editor'], load: '25%', status: 'active', projects: 2 },
            ]
        },
        {
            title: 'Filmmakers',
            icon: Camera,
            members: [
                { name: 'Alex', roles: ['Filmmaker'], load: '50%', status: 'active', projects: 4 },
                { name: 'Anthony', roles: ['Editor', 'Filmmaker'], load: '90%', status: 'busy', projects: 8 },
                { name: 'Dicson', roles: ['Admin', 'Filmmaker'], load: '20%', status: 'active', projects: 2 },
            ]
        },
        {
            title: 'Diseñadores Gráficos',
            icon: Palette,
            members: [
                { name: 'Anthony', roles: ['Diseñador'], load: '90%', status: 'busy', projects: 8 },
            ]
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto p-10 bg-[#050511]">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Equipo Operativo</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Gestión de Roles y Carga en Tiempo Real</p>
                </div>
                <div className="flex gap-4">
                    <div className="h-14 px-8 bg-[#0A0A12] border border-white/5 rounded-2xl flex items-center gap-8 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse" />
                            <span className="text-xs font-black text-white uppercase tracking-widest">6 Operativos Online</span>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">Carga Global</span>
                            <span className="text-xs font-black text-amber-500">58.4%</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Role Sections */}
            <div className="space-y-16">
                {roles.map((roleGroup) => (
                    <section key={roleGroup.title}>
                        <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                <roleGroup.icon className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">{roleGroup.title}</h2>
                            <span className="text-[10px] bg-white/5 text-gray-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                                {roleGroup.members.length} Miembros
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {roleGroup.members.map((member, idx) => (
                                <div key={`${roleGroup.title}-${member.name}-${idx}`} className="bg-[#0A0A12] border border-white/5 p-6 rounded-[2rem] group hover:border-indigo-500/30 transition-all shadow-xl hover:shadow-indigo-500/10 relative overflow-hidden">
                                    <div className="flex flex-col items-center text-center relative z-10">
                                        <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center mb-6 border border-white/5 group-hover:scale-105 transition-transform relative">
                                            <User className="w-10 h-10 text-gray-500" />
                                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#0A0A12] ${
                                                member.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                                            }`} />
                                        </div>

                                        <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                                            {member.name}
                                        </h3>

                                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                                            {member.roles.map(r => (
                                                <span key={r} className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 text-gray-400 rounded-md border border-white/5">
                                                    {r}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="w-full pt-6 border-t border-white/5 space-y-4">
                                            <div className="flex justify-between items-center px-2">
                                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Carga</span>
                                                <span className={`text-[10px] font-black ${parseInt(member.load) > 80 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                    {member.load}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-1000 ${
                                                        parseInt(member.load) > 80 ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                                                    }`} 
                                                    style={{ width: member.load }}
                                                />
                                            </div>
                                            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
                                                <Zap className="w-3 h-3 text-amber-500" />
                                                {member.projects} Proyectos Activos
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover State Background Layer */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Performance Footer Banner */}
            <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] p-12 text-center relative overflow-hidden shadow-2xl group/cta">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Eficiencia Operativa Studio</h3>
                    <p className="max-w-xl mx-auto text-indigo-100/70 text-sm font-medium mb-8 leading-relaxed">
                        Control total sobre el balance de recursos. Cada especialista está conectado a los nodos estratégicos del canvas principal.
                    </p>
                    <button 
                        onClick={() => toast.info('Generando reporte técnico...')}
                        className="h-14 px-10 bg-white text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-all uppercase text-xs tracking-widest shadow-xl shadow-black/20"
                    >
                        Exportar Reporte Global
                    </button>
                </div>
            </div>
        </div>
    );
}


