'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, Shield, Star, Zap, 
    MoreHorizontal, UserPlus, Phone, 
    Mail, Briefcase, Award 
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';

export default function HQTeamPage() {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            const data = await agencyService.getTeam();
            setTeam(data);
            setLoading(false);
        };
        fetchTeam();
    }, []);

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Nuestro Equipo</h1>
                    <p className="text-gray-400">Gestión de talento, roles y disponibilidad operativa.</p>
                </div>
                <button className="px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/20">
                    <UserPlus className="w-5 h-5" /> Invitar Miembro
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    [1,2,3,4].map(i => <SkeletonCard key={i} />)
                ) : (
                    team.map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                    ))
                )}
            </div>

            {/* Roles Summary */}
            <div className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-500" /> Distribución de Roles
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <RoleMiniCard label="CMs" count="2" color="indigo" />
                    <RoleMiniCard label="Editores" count="4" color="purple" />
                    <RoleMiniCard label="Diseño" count="1" color="blue" />
                    <RoleMiniCard label="Dev" count="1" color="green" />
                    <RoleMiniCard label="Filmmakers" count="3" color="amber" />
                </div>
            </div>
        </div>
    );
}

function TeamMemberCard({ member }) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group"
        >
            <div className="absolute top-4 right-4">
                <button className="p-2 text-gray-600 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                        {member.name[0]}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-4 border-[#0E0E18] ${
                        member.status === 'activo' ? 'bg-green-500' : 'bg-rose-500'
                    }`} />
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">{member.role}</p>

                <div className="w-full grid grid-cols-2 gap-2 mb-6">
                    <button className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
                        <Phone className="w-4 h-4 mx-auto" />
                    </button>
                    <button className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
                        <Mail className="w-4 h-4 mx-auto" />
                    </button>
                </div>

                <div className="w-full pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-indigo-500" /> {member.tasks_count || 0} Tareas</span>
                    <span className="flex items-center gap-1 text-emerald-500">{member.status === 'activo' ? 'Disponible' : 'Ocupado'}</span>
                </div>
            </div>
        </motion.div>
    );
}

function RoleMiniCard({ label, count, color }) {
    const colors = {
        indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        green: 'bg-green-500/10 text-green-500 border-green-500/20',
        amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    };

    return (
        <div className={`p-4 rounded-2xl border ${colors[color]} text-center`}>
            <div className="text-2xl font-black mb-1">{count}</div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 h-[380px] animate-pulse">
            <div className="w-24 h-24 rounded-3xl bg-white/5 mx-auto mb-6" />
            <div className="h-6 bg-white/5 rounded-lg w-3/4 mx-auto mb-2" />
            <div className="h-4 bg-white/5 rounded-lg w-1/2 mx-auto" />
        </div>
    );
}
