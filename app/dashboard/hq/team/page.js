'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Shield, Star, Zap, 
    MoreHorizontal, UserPlus, Phone, 
    Mail, Briefcase, Award, Cpu,
    Activity, Layout, LayoutGrid, Plus, Check, X,
    ChevronRight, Target, Flame, Database
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';

export default function HQTeamPage() {
    const [team, setTeam] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('squads'); // Default to squads as per user preference
    const [selectedMember, setSelectedMember] = useState(null);
    const [isAuditOpen, setIsAuditOpen] = useState(false);

    const openAudit = (member) => {
        setSelectedMember(member);
        setIsAuditOpen(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            const [teamData, clientData] = await Promise.all([
                agencyService.getTeam(),
                agencyService.getClients()
            ]);
            setTeam(teamData);
            setClients(clientData || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    const getDepartments = () => {
        return [
            { id: 'gestion', label: 'Estrategia & CMs', icon: Shield, color: 'from-indigo-500 to-blue-600', members: team.filter(m => m.role?.toLowerCase().includes('estratega') || m.role?.toLowerCase().includes('community manager')) },
            { id: 'produccion', label: 'Producción VFX', icon: Zap, color: 'from-purple-500 to-pink-600', members: team.filter(m => m.role.toLowerCase().includes('filmmaker') || m.role.toLowerCase().includes('editor')) },
            { id: 'design', label: 'Creative Design', icon: Star, color: 'from-blue-400 to-indigo-600', members: team.filter(m => m.role.toLowerCase().includes('diseña')) },
            { id: 'tech', label: 'Development', icon: Cpu, color: 'from-emerald-500 to-teal-600', members: team.filter(m => m.role.toLowerCase().includes('programador')) }
        ];
    };

    const getSquads = () => {
        const cms = team.filter(m => m.role === 'Community Manager');
        return cms.map(cm => ({
            id: cm.id, label: `Escuadrón ${cm.name.split(' ')[0]}`, icon: Flame, lead: cm, color: 'from-indigo-600 to-purple-800', members: team.filter(m => m.squad_lead_id === cm.id)
        }));
    };

    return (
        <div className="p-8 space-y-16 min-h-screen bg-[#05050A]">
            {/* BACKGROUND DECORATION */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full" />
            </div>

            {/* Header & Control Center */}
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                <div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                         <h1 className="text-6xl font-black text-white mb-2 uppercase tracking-tighter italic">ZONA <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">CREATIVA</span></h1>
                         <p className="text-gray-400 font-bold uppercase text-[12px] tracking-[0.5em] flex items-center gap-2">
                             <Target className="w-4 h-4 text-pink-500" /> Operational Mastery — HQ Dashboard 2026
                         </p>
                    </motion.div>
                </div>
                <div className="flex gap-6 items-center">
                    <div className="flex bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-1.5 shadow-2xl">
                        <button 
                            onClick={() => setViewMode('squads')}
                            className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'squads' ? 'bg-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] scale-105' : 'text-gray-500 hover:text-white'}`}
                        >
                            Escuadrones
                        </button>
                        <button 
                            onClick={() => setViewMode('departments')}
                            className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'departments' ? 'bg-purple-500 text-white shadow-[0_0_30px_rgba(168,84,247,0.5)] scale-105' : 'text-gray-500 hover:text-white'}`}
                        >
                            Departamentos
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'list' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-105' : 'text-gray-500 hover:text-white'}`}
                        >
                            Lista Pro
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                    {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={viewMode}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="space-y-32 relative z-10"
                    >
                        {viewMode === 'squads' ? (
                            getSquads().map((squad) => (
                                <div key={squad.id} className="space-y-12">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 bg-gradient-to-br ${squad.color} rounded-[2rem] text-white shadow-2xl ring-1 ring-white/20`}>
                                            <squad.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-white uppercase tracking-[0.1em] italic drop-shadow-lg">{squad.label}</h2>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                                <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em]">Lid Operativo: <span className="text-indigo-400">{squad.lead.name}</span></p>
                                            </div>
                                        </div>
                                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                                        <TeamMemberCard member={squad.lead} team={team} allClients={clients} variant="lead" onAudit={() => openAudit(squad.lead)} />
                                        {squad.members.map((member) => (
                                            <TeamMemberCard 
                                                key={member.id} 
                                                member={member} 
                                                cms={team.filter(m => m.role === 'Community Manager')} 
                                                team={team}
                                                allClients={clients}
                                                onAudit={() => openAudit(member)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : viewMode === 'departments' ? (
                            getDepartments().map((dept) => dept.members.length > 0 && (
                                <div key={dept.id} className="space-y-12">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 bg-gradient-to-br ${dept.color} rounded-[2rem] text-white shadow-2xl ring-1 ring-white/20`}>
                                            <dept.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-white uppercase tracking-[0.1em] italic">{dept.label}</h2>
                                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">{dept.members.length} Especialistas en Linea</p>
                                        </div>
                                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                                        {dept.members.map((member) => (
                                            <TeamMemberCard 
                                                key={member.id} 
                                                member={member} 
                                                cms={team.filter(m => m.role === 'Community Manager')}
                                                allClients={clients}
                                                team={team}
                                                onAudit={() => openAudit(member)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="space-y-16">
                                {getDepartments().map((dept) => dept.members.length > 0 && (
                                    <div key={dept.id} className="bg-[#0A0A1F] border border-white/5 rounded-[3rem] p-10 shadow-4xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                                            <dept.icon className="w-48 h-48" />
                                        </div>
                                        
                                        <div className="flex items-center gap-6 mb-12">
                                            <div className={`p-4 bg-gradient-to-br ${dept.color} rounded-2xl text-white shadow-xl`}>
                                                <dept.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{dept.label}</h3>
                                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Cuerpo Creativo Certificado</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {dept.members.map((member) => (
                                                <motion.div 
                                                    key={member.id}
                                                    whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.02)' }}
                                                    className="flex items-center justify-between p-6 border border-white/5 rounded-[2rem] group/item transition-all"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-xl italic border border-indigo-500/20">
                                                            {member.name[0]}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">EQUIPO ZONA CREATIVA</span>
                                                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">• HQ MASTER</span>
                                                            </div>
                                                            <div className="text-white font-black text-lg uppercase tracking-tight mt-1 flex items-center gap-2">
                                                                {member.role} — <span className="text-gray-400 italic font-medium">{member.name}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-8">
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest mb-1">Status Operativo</p>
                                                            <div className="flex items-center gap-2 justify-end">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                <span className="text-[11px] font-black text-emerald-500 uppercase italic">On-line</span>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => openAudit(member)}
                                                            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all border border-white/5"
                                                        >
                                                            Audit Detail
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Unassigned Pool */}
                        {viewMode === 'squads' && team.filter(m => !m.squad_lead_id && m.role !== 'Community Manager').length > 0 && (
                             <div className="space-y-12 pb-20">
                                <div className="flex items-center gap-6 opacity-60">
                                    <div className="p-4 bg-white/5 rounded-[2rem] text-gray-400">
                                        <Users className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-white/50 uppercase tracking-[0.1em]">Pool de Reserva</h2>
                                        <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.3em] mt-1">Miembros HQ listos para designación</p>
                                    </div>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                                    {team.filter(m => !m.squad_lead_id && m.role !== 'Community Manager').map((member) => (
                                        <TeamMemberCard key={member.id} member={member} cms={team.filter(m => m.role === 'Community Manager')} team={team} allClients={clients} />
                                    ))}
                                </div>
                             </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* TEAM AUDIT MODAL */}
            <AnimatePresence>
                {isAuditOpen && (
                    <TeamAuditModal 
                        member={selectedMember} 
                        cms={team.filter(m => m.role === 'Community Manager')}
                        team={team}
                        allClients={clients}
                        onClose={() => setIsAuditOpen(false)} 
                        onSave={() => window.location.reload()}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function TeamMemberCard({ member, cms = [], team = [], allClients = [], variant = 'normal', onAudit }) {
    const [tasks, setTasks] = useState([]);
    const [assignedClients, setAssignedClients] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [showAssigner, setShowAssigner] = useState(false);
    const [showMemberAssigner, setShowMemberAssigner] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const capacityLimit = 8;

    const isCM = member.role.toLowerCase().includes('community manager');
    const isProducer = member.role.toLowerCase().includes('editor') || member.role.toLowerCase().includes('diseña') || member.role.toLowerCase().includes('film');

    useEffect(() => {
        const fetchOperationalData = async () => {
            const [taskData, clientData] = await Promise.all([
                agencyService.getTasksByAssignee(member.name),
                isCM ? agencyService.getClientsByCM(member.name) : Promise.resolve([])
            ]);
            setTasks(taskData);
            setAssignedClients(clientData);
            setLoadingData(false);
        };
        fetchOperationalData();
    }, [member.name, isCM]);

    const handleSquadAssign = async (cmId) => {
        setAssigning(true);
        const success = await agencyService.assignToSquad(member.id, cmId);
        if (success) {
            toast.success(cmId ? `Designado a Squad correctamente` : `Devuelto a Pool HQ`);
            window.location.reload(); 
        }
        setAssigning(false);
    };

    const handleClientAssign = async (clientId, remove = false) => {
        setAssigning(true);
        const success = await agencyService.assignClientToCM(clientId, remove ? null : member.name);
        if (success) {
            toast.success(remove ? `Cuenta retirada del líder` : `Cuenta vinculada con éxito`);
            window.location.reload();
        }
        setAssigning(false);
    };

    const effectiveCount = isCM ? assignedClients.length : tasks.length;
    const loadPercentage = Math.min((effectiveCount / capacityLimit) * 100, 100);
    const isSaturated = effectiveCount >= capacityLimit;
    const squadMembers = isCM ? team.filter(m => m.squad_lead_id === member.id) : [];

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className={`relative group h-full rounded-[3rem] p-[1px] overflow-hidden transition-all duration-700 ${
                isCM ? 'bg-gradient-to-b from-indigo-500/50 via-purple-500/5 to-transparent' : 'bg-gradient-to-b from-white/10 to-transparent hover:from-purple-500/30'
            }`}
        >
            <div className={`absolute inset-0 bg-[#0E0E18]/90 backdrop-blur-3xl rounded-[3rem] -z-10`} />
            
            {/* GLOW EFFECT */}
            <div className={`absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
            <div className={`absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />

            <div className="relative p-8 flex flex-col h-full bg-white/[0.02]">
                {/* Badge Container */}
                <div className="flex justify-between items-start mb-8">
                    <div className={`px-4 py-1.5 rounded-2xl text-[8px] font-black uppercase tracking-[0.2em] shadow-inner ring-1 ring-white/10 ${
                        member.status === 'activo' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'
                    }`}>
                        {member.status === 'activo' ? 'System Active' : 'System Off'}
                    </div>
                    <div className="px-3 py-1.5 rounded-2xl text-[8px] font-black uppercase tracking-widest bg-white/5 text-gray-500 border border-white/5">
                        {member.city}
                    </div>
                </div>

                <div className="flex flex-col items-center text-center flex-1">
                    {/* Avatar with dynamic ring */}
                    <div className="relative mb-8">
                        <div className={`w-32 h-32 rounded-[2.8rem] bg-gradient-to-br p-[2px] transition-transform duration-700 group-hover:rotate-6 ${
                            isCM ? 'from-indigo-500 via-purple-500 to-pink-500' : 'from-white/20 to-transparent'
                        }`}>
                            <div className="w-full h-full rounded-[2.7rem] bg-[#0A0A12] flex items-center justify-center text-5xl font-black text-white italic drop-shadow-2xl">
                                {member.name[0]}
                            </div>
                        </div>
                        {isCM && <div className="absolute -inset-4 bg-indigo-500/10 blur-[30px] rounded-full animate-pulse" />}
                    </div>

                    <h3 className="text-3xl font-black text-white mb-1 uppercase tracking-tighter italic drop-shadow-md">{member.name}</h3>
                    <div className="flex flex-col items-center gap-2 mb-8">
                        <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.3em] bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">EQUIPO ZONA CREATIVA</span>
                        <p className={`text-[10px] font-black uppercase tracking-[0.4em] py-1 px-4 rounded-full border border-white/5 bg-white/5 ${
                            isCM ? 'text-indigo-400' : 'text-purple-400'
                        }`}>{member.role}</p>
                    </div>

                    {/* --- CM EXCLUSIVE: SQUAD MANAGEMENT --- */}
                    {isCM && (
                        <div className="w-full mb-10 py-6 border-y border-white/5 bg-white/[0.01] rounded-[2.5rem] relative">
                            <div className="flex justify-between items-center px-6 mb-4">
                                <span className="text-[10px] font-black text-indigo-400/70 uppercase italic tracking-widest">Zona Creativa Designada</span>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                                         <Users className="w-3 h-3 text-indigo-400" />
                                         <span className="text-[10px] font-black text-indigo-400">{squadMembers.length} Personas</span>
                                    </div>
                                    <button 
                                        onClick={() => setShowMemberAssigner(!showMemberAssigner)}
                                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                            showMemberAssigner ? 'bg-rose-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-indigo-500 hover:text-white'
                                        }`}
                                    >
                                        {showMemberAssigner ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {showMemberAssigner && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-4 px-4 overflow-hidden"
                                    >
                                        <div className="bg-[#0A0A1F] border border-white/10 rounded-2xl p-3 flex flex-col gap-3 shadow-2xl">
                                            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest text-left px-1">Añadir Staff al Escuadrón:</p>
                                            <select 
                                                onChange={(e) => {
                                                    const targetId = e.target.value;
                                                    if (targetId) {
                                                        const targetMember = team.find(m => m.id === targetId);
                                                        if (targetMember) {
                                                            // Reuse handleSquadAssign logic but for the target member
                                                            const assignToTarget = async () => {
                                                                setAssigning(true);
                                                                const success = await agencyService.updateTeamMember(targetId, { squad_lead_id: member.id });
                                                                if (success) {
                                                                    toast.success(`${targetMember.name} añadido al Squad`);
                                                                    window.location.reload();
                                                                }
                                                                setAssigning(false);
                                                            };
                                                            assignToTarget();
                                                        }
                                                    }
                                                }}
                                                className="w-full bg-[#05050A] text-[9px] font-black text-white uppercase outline-none p-2 rounded-xl border border-white/5"
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Seleccionar Talento...</option>
                                                {team.filter(m => !m.squad_lead_id && !m.role.toLowerCase().includes('community manager')).map(unassigned => (
                                                    <option key={unassigned.id} value={unassigned.id}>{unassigned.role} — {unassigned.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* --- CM EXCLUSIVE: SQUAD PREVIEW (SHORT) --- */}
                            <div className="w-full mb-8 py-4 border-y border-white/5 bg-white/[0.01] rounded-[2rem] relative">
                                <div className="flex justify-between items-center px-5 mb-3">
                                    <span className="text-[9px] font-black text-indigo-400/70 uppercase tracking-[0.15em]">Squad Táctico</span>
                                    <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                                         {squadMembers.length} Personas
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1.5 px-3 max-h-[120px] overflow-hidden">
                                     {squadMembers.length > 0 ? squadMembers.slice(0, 3).map((m, i) => (
                                         <div 
                                            key={i} 
                                            className="flex items-center gap-2.5 p-2 bg-white/[0.02] border border-white/5 rounded-xl"
                                         >
                                             <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black text-white shadow-lg ${
                                                 m.role.toLowerCase().includes('editor') ? 'bg-purple-600 shadow-purple-600/30' :
                                                 m.role.toLowerCase().includes('film') ? 'bg-blue-600 shadow-blue-600/30' :
                                                 'bg-indigo-600 shadow-indigo-600/30'
                                             }`}>
                                                 {m.role[0]}
                                             </div>
                                             <div className="text-left overflow-hidden">
                                                 <p className="text-[9px] font-black text-white truncate uppercase tracking-tight">
                                                     {m.name.split(' ')[0]} <span className="text-gray-500 text-[8px]">— {m.role}</span>
                                                 </p>
                                             </div>
                                         </div>
                                     )) : (
                                         <div className="py-2 opacity-20 flex flex-col items-center gap-1">
                                             <Activity className="w-3 h-3" />
                                             <span className="text-[8px] font-black uppercase tracking-widest">Pool General Connect</span>
                                         </div>
                                     )}
                                     {squadMembers.length > 3 && (
                                         <div className="text-[8px] font-black text-gray-600 uppercase text-center mt-1">
                                             + {squadMembers.length - 3} Miembros adicionales
                                         </div>
                                     )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- PRODUCER EXCLUSIVE: ASSIGNMENT --- */}
                    {isProducer && (
                        <div className="mb-10 w-full px-2">
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-3 text-left pl-2">Designar Escuadrón Táctico:</p>
                            <div className="relative group/select">
                                <select 
                                    onChange={(e) => handleSquadAssign(e.target.value)}
                                    disabled={assigning}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[11px] font-black uppercase italic tracking-tighter text-gray-400 outline-none hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all cursor-pointer appearance-none"
                                    value={member.squad_lead_id || ''}
                                >
                                    <option value="" className="bg-[#0A0A12]">Pool General (HQ Core)</option>
                                    {cms.map(cm => <option key={cm.id} value={cm.id} className="bg-[#0A0A12]">Squad Tactical {cm.name.split(' ')[0]}</option>)}
                                </select>
                                <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
                            </div>
                        </div>
                    )}

                    {/* Operational Capacity Engine */}
                    <div className="w-full space-y-4 mb-10 px-2">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{isCM ? 'MRR Portafolio' : 'Operativa Interna'}</span>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                                isSaturated ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                            }`}>
                                <Activity className="w-3 h-3" />
                                <span className="text-[11px] font-black tracking-tighter">{effectiveCount} / {capacityLimit}</span>
                            </div>
                        </div>
                        <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-[2px] shadow-inner shadow-black/50">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${loadPercentage}%` }} 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                    isSaturated ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]' : 
                                    (isCM ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-gradient-to-r from-purple-500 to-pink-500')
                                }`} 
                            />
                        </div>
                    </div>

                    {/* ACCOUNT PORTFOLIO PREVIEW (SHORT) */}
                    <div className="w-full space-y-2 mb-10 flex-1 px-1">
                        <div className="flex items-center gap-2 mb-3 px-1 text-left">
                            <div className={`w-1.5 h-1.5 rounded-full ${isCM ? 'bg-indigo-500' : 'bg-purple-500'}`} />
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">
                                {isCM ? 'Empresas Activas' : 'Producción Crítica'}
                            </span>
                        </div>

                        <div className="space-y-1.5 max-h-[100px] overflow-hidden pr-2">
                             {loadingData ? <div className="h-6 bg-white/5 rounded-2xl animate-pulse w-full" /> : 
                             (isCM ? assignedClients : tasks).length > 0 ? (
                                (isCM ? assignedClients : tasks).slice(0, 3).map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex items-center gap-3 p-2 bg-white/[0.02] border border-white/5 rounded-xl"
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${isCM ? 'bg-indigo-500' : 'bg-purple-500'}`} />
                                        <span className="text-[10px] font-bold text-gray-300 uppercase truncate">
                                            {item.name || item.client?.replace(/_/g, ' ') || item.title}
                                        </span>
                                    </div>
                                ))
                             ) : <div className="text-[8px] font-bold text-gray-700 italic py-4">Sin Vinculaciones Activas</div>}
                             {(isCM ? assignedClients : tasks).length > 3 && (
                                 <div className="text-[8px] font-black text-gray-600 uppercase text-center mt-1">
                                     + {(isCM ? assignedClients : tasks).length - 3} Adicionales
                                 </div>
                             )}
                        </div>
                    </div>

                    {/* GLOBAL COMMAND FOOTER */}
                    <div className="w-full pt-8 border-t border-white/5 flex justify-between items-center">
                        <motion.button 
                            onClick={onAudit}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 group-hover:scale-105 transition-all py-2 px-4 rounded-2xl ${
                                isCM ? 'text-indigo-400 bg-indigo-500/5 ring-1 ring-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'text-gray-500 hover:text-white bg-white/5'
                            }`}
                        >
                             <div className={`w-2 h-2 rounded-full animate-ping ${isCM ? 'bg-indigo-500' : 'bg-gray-500'}`} />
                             <span className="text-[9px] font-black uppercase tracking-[0.2em]">{isCM ? 'Cerebro Operativo' : 'Ver Detalles'}</span>
                        </motion.button>
                        <div className="flex flex-col items-end">
                             <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">Status 2026</span>
                             <span className={`text-[10px] font-black uppercase italic shadow-glow ${isSaturated ? 'text-rose-500' : 'text-emerald-500'}`}>
                                 {isSaturated ? 'Max Capacity' : 'Available Pool'}
                             </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function RoleMiniCard({ label, count, color }) {
    return (
        <div className={`p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl text-center relative overflow-hidden group shadow-2xl`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
            <div className="relative z-10">
                <div className="text-5xl font-black mb-2 italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{count}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 group-hover:text-white transition-colors">Sistema {label}</div>
            </div>
        </div>
    );
}

function TeamAuditModal({ member, cms = [], team = [], allClients = [], onClose, onSave }) {
    const [formData, setFormData] = useState({ ...member });
    const [assignedClients, setAssignedClients] = useState([]);
    const [squadMembers, setSquadMembers] = useState([]);
    const [activeTasks, setActiveTasks] = useState([]);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('portfolio'); // portfolio, squad, tasks
    const [loadingHub, setLoadingHub] = useState(true);

    const isCM = member.role.toLowerCase().includes('community manager');

    useEffect(() => {
        const fetchDetails = async () => {
            setLoadingHub(true);
            try {
                const [clients, tasks] = await Promise.all([
                    agencyService.getClientsByCM(member.name),
                    agencyService.getTasksByMember(member.name)
                ]);
                setAssignedClients(clients || []);
                setActiveTasks(tasks || []);
                setSquadMembers(team.filter(m => m.squad_lead_id === member.id));
            } catch (error) {
                console.error("Error loading hub details:", error);
            } finally {
                setLoadingHub(false);
            }
        };
        fetchDetails();
    }, [member.id, member.name, team]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await agencyService.updateTeamMember(member.id, formData);
            toast.success("Perfil sincronizado con HQ");
            onSave();
            onClose();
        } catch (error) {
            toast.error("Error en sincronización");
        } finally {
            setSaving(false);
        }
    };

    const toggleClient = async (clientId, remove = false) => {
        setSaving(true);
        try {
            await agencyService.updateClient(clientId, { cm: remove ? null : member.name });
            toast.success(remove ? "Cliente desvinculado" : "Cliente vinculado correctamente");
            // Refresh local state
            const updated = await agencyService.getClientsByCM(member.name);
            setAssignedClients(updated || []);
            onSave(); // Refresh parent to show changes in preview
        } catch (err) {
            toast.error("Error en gestión de vinculación");
        } finally {
            setSaving(false);
        }
    };

    const toggleMember = async (targetId, remove = false) => {
        setSaving(true);
        try {
            await agencyService.updateTeamMember(targetId, { squad_lead_id: remove ? null : member.id });
            toast.success(remove ? "Talento retirado del Squad" : "Talento integrado al Squad");
            // Refresh local state
            const updated = team.map(m => m.id === targetId ? { ...m, squad_lead_id: remove ? null : member.id } : m);
            setSquadMembers(updated.filter(m => m.squad_lead_id === member.id));
            onSave();
        } catch (err) {
            toast.error("Error en gestión de escuadrón");
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        >
            <div className="absolute inset-0 bg-[#05050A]/95 backdrop-blur-3xl" onClick={onClose} />
            
            <motion.div 
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="relative w-full max-w-5xl h-[85vh] bg-[#0A0A1F]/80 border border-white/10 rounded-[3.5rem] p-12 shadow-4xl overflow-hidden backdrop-blur-2xl flex flex-col"
            >
                {/* HEAD DECOR */}
                <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                    <Shield className="w-64 h-64 text-indigo-500" />
                </div>

                {/* MODAL HEADER */}
                <div className="relative z-10 flex justify-between items-start mb-12">
                    <div className="flex items-center gap-8">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px]">
                                <div className="w-full h-full rounded-[1.9rem] bg-[#0A0A1F] flex items-center justify-center text-4xl font-black text-white italic">
                                    {member.name[0]}
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-emerald-500 border-4 border-[#0A0A1F] flex items-center justify-center shadow-lg">
                                <Activity className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Audit Hub</h3>
                                <span className="bg-indigo-500/10 text-indigo-500 text-[10px] font-black px-3 py-1 rounded-full border border-indigo-500/20 uppercase tracking-widest">Master Admin</span>
                            </div>
                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">Configuración de Activo: {member.id} // {member.role}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-4 bg-white/5 hover:bg-rose-500 hover:text-white rounded-[1.5rem] text-gray-500 transition-all shadow-xl ring-1 ring-white/5">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* MAIN GRID */}
                <div className="relative z-10 flex-1 grid grid-cols-12 gap-10 overflow-hidden">
                    
                    {/* LEFT PANEL: PROFILE & CORE */}
                    <div className="col-span-4 space-y-8 flex flex-col">
                        <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                            <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest pl-2">Información de Perfil</label>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Nombre Completo</p>
                                    <input 
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-[13px] font-bold text-white outline-none focus:border-indigo-500/30 transition-all shadow-inner"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Rol en la Agencia</p>
                                    <input 
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-[13px] font-bold text-white outline-none focus:border-indigo-500/30 transition-all shadow-inner"
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Salario / Tarifa (USD)</p>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">$</div>
                                        <input 
                                            type="number"
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-[13px] font-bold text-white outline-none focus:border-indigo-500/30 transition-all shadow-inner"
                                            value={formData.salary || ''}
                                            onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full py-6 bg-indigo-500 hover:bg-indigo-600 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] text-white shadow-3xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                        >
                            {saving ? <Database className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                            {saving ? 'Sincronizando...' : 'Guardar Cambios HQ'}
                        </button>
                    </div>

                    {/* RIGHT PANEL: CONTEXTUAL MANAGEMENT */}
                    <div className="col-span-8 bg-white/5 border border-white/5 rounded-[3rem] overflow-hidden flex flex-col p-10">
                        {/* TABS */}
                        <div className="flex gap-4 mb-10 bg-black/40 p-2 rounded-3xl w-fit">
                            <button 
                                onClick={() => setActiveTab('portfolio')}
                                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    activeTab === 'portfolio' ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'text-gray-500 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <LayoutGrid className="w-4 h-4" />
                                    <span>Portafolio</span>
                                </div>
                            </button>
                            {isCM && (
                                <button 
                                    onClick={() => setActiveTab('squad')}
                                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        activeTab === 'squad' ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'text-gray-500 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span>Escuadrón</span>
                                    </div>
                                </button>
                            )}
                            <button 
                                onClick={() => setActiveTab('tasks')}
                                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    activeTab === 'tasks' ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'text-gray-500 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    <span>Auditoría Tareas</span>
                                </div>
                            </button>
                        </div>

                        {/* CONTENT AREA */}
                        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                            {loadingHub ? (
                                <div className="space-y-4">
                                    <div className="h-20 bg-white/5 rounded-3xl animate-pulse" />
                                    <div className="h-20 bg-white/5 rounded-3xl animate-pulse" />
                                    <div className="h-20 bg-white/5 rounded-3xl animate-pulse" />
                                </div>
                            ) : (
                                <>
                                    {/* PORTFOLIO TAB */}
                                    {activeTab === 'portfolio' && (
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center px-4">
                                                <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] italic">Vincular Nuevas Empresas</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {allClients.filter(c => c.cm !== member.name).map(c => (
                                                    <button 
                                                        key={c.id}
                                                        onClick={() => toggleClient(c.id)}
                                                        className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-3xl hover:bg-white/[0.08] hover:border-indigo-500/20 transition-all text-left"
                                                    >
                                                        <div>
                                                            <p className="text-[12px] font-black text-white">{c.name}</p>
                                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{c.cm ? `Vía ${c.cm}` : 'Disponible para HQ'}</p>
                                                        </div>
                                                        <Plus className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="mt-12 pt-8 border-t border-white/5">
                                                <h4 className="text-[11px] font-black text-rose-500 uppercase tracking-[0.2em] italic mb-6 px-4">Portafolio Actual</h4>
                                                <div className="space-y-3">
                                                    {assignedClients.map(c => (
                                                        <div key={c.id} className="flex items-center justify-between p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_indigo]" />
                                                                <span className="text-sm font-black text-white uppercase tracking-tight">{c.name}</span>
                                                            </div>
                                                            <button 
                                                                onClick={() => toggleClient(c.id, true)}
                                                                className="p-2 bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {assignedClients.length === 0 && <div className="text-center py-10 opacity-30 italic text-sm">No hay empresas vinculadas.</div>}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* SQUAD TAB */}
                                    {activeTab === 'squad' && (
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center px-4">
                                                <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] italic">Añadir Talento al Escuadrón</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {team.filter(m => !m.squad_lead_id && m.id !== member.id && !m.role.toLowerCase().includes('community manager')).map(m => (
                                                    <button 
                                                        key={m.id}
                                                        onClick={() => toggleMember(m.id)}
                                                        className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-3xl hover:bg-white/[0.08] hover:border-indigo-500/20 transition-all text-left"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-lg font-black">{m.name[0]}</div>
                                                            <div>
                                                                <p className="text-[12px] font-black text-white">{m.name}</p>
                                                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{m.role}</p>
                                                            </div>
                                                        </div>
                                                        <Plus className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="mt-12 pt-8 border-t border-white/5">
                                                <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] italic mb-6 px-4">Estado del Escuadrón Táctico</h4>
                                                <div className="space-y-3">
                                                    {squadMembers.map(m => (
                                                        <div key={m.id} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] transition-all">
                                                            <div className="flex items-center gap-5">
                                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black italic text-white ${
                                                                    m.role.toLowerCase().includes('editor') ? 'bg-purple-600' : 'bg-blue-600'
                                                                }`}>
                                                                    {m.name[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">MIEMBRO DESIGNADO</p>
                                                                    <p className="text-xl font-black text-white italic tracking-tighter uppercase">{m.name} — <span className="text-indigo-400">{m.role}</span></p>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => toggleMember(m.id, true)}
                                                                className="p-3 bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all"
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* TASKS TAB */}
                                    {activeTab === 'tasks' && (
                                        <div className="space-y-6">
                                            <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] italic px-4">Tareas en Pipeline Operativo</h4>
                                            <div className="space-y-4">
                                                {activeTasks.map(task => (
                                                    <div key={task.id} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex items-center justify-between group">
                                                        <div className="flex items-center gap-8">
                                                            <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                                            <div>
                                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 italic">{task.client?.replace(/_/g, ' ') || 'PROYECTO INTERNO'}</p>
                                                                <h5 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">{task.title}</h5>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl">Oct 2026</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {activeTasks.length === 0 && <div className="text-center py-20 opacity-30 italic text-sm">No hay tareas activas en este momento.</div>}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-[#0E0E18]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 h-[600px] animate-pulse relative overflow-hidden">
            <div className="w-36 h-36 rounded-[2.8rem] bg-white/5 mx-auto mb-10" />
            <div className="h-10 bg-white/5 rounded-2xl w-3/4 mx-auto mb-6" />
            <div className="h-4 bg-white/5 rounded-2xl w-1/2 mx-auto mb-16" />
            <div className="space-y-4">
                <div className="h-12 bg-white/5 rounded-3xl w-full" />
                <div className="h-12 bg-white/5 rounded-3xl w-full" />
            </div>
        </div>
    );
}
