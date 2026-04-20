'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Shield, Star, Zap, 
    MoreHorizontal, UserPlus, Phone, 
    Mail, Briefcase, Award, Cpu,
    Activity, Layout, LayoutGrid, Plus, Check, X,
    ChevronRight, Target, Flame, Database,
    ChevronDown, Trash2, Edit, MessageSquare, Globe, ListTodo,
    MapPin, DollarSign, FileText,
    Video, Clapperboard, Palette, Mic, Camera, User, Printer, Ticket, Monitor,
    Copy
} from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';
import { isCloudConnected } from '@/lib/supabase';

export default function HQTeamPage() {
    const [team, setTeam] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('squads');
    const [selectedMember, setSelectedMember] = useState(null);
    const [isAuditOpen, setIsAuditOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newMember, setNewMember] = useState({
        name: '',
        role: 'Editor de Video',
        email: '',
        whatsapp: '',
        city: 'Quito',
        salary: 0
    });

    const openAudit = (member) => {
        setSelectedMember(member);
        setIsAuditOpen(true);
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await agencyService.createTeamMember(newMember);
            const updatedTeam = await agencyService.getTeam();
            setTeam(updatedTeam);
            setIsAddModalOpen(false);
            setNewMember({ 
                name: '', 
                role: 'Editor de Video', 
                email: '', 
                whatsapp: '', 
                city: 'Quito', 
                salary: 0 
            });
            toast.success("Talento Vinculado");
        } catch (error) {
            console.error("Error creating member:", error);
            toast.error("Error al registrar");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("🚀 [HQ-Team] Initializing DB Sync...");
                const [teamData, clientData] = await Promise.all([
                    agencyService.getTeam(),
                    agencyService.getClients()
                ]);
                
                if (!teamData) {
                    console.warn("⚠️ [HQ-Team] Team data returned null");
                }
                
                console.log(`[HQ-Team] Data Fetched: ${teamData?.length || 0} members, ${clientData?.length || 0} clients`);
                setTeam(teamData || []);
                setClients(clientData || []);
            } catch (error) {
                console.error("❌ [HQ-Team] Critical Sync Failed:", error);
                toast.error("Fallo de conexión con la Central HQ");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getDepartments = () => {
        return [
            { id: 'gestion', label: 'Estrategia & CMs', icon: Shield, color: 'from-indigo-500 to-blue-600', members: team.filter(m => m.role?.toLowerCase().includes('estratega') || m.role?.toLowerCase().includes('community manager')) },
            { id: 'diseno', label: 'Diseño Gráfico', icon: Palette, color: 'from-pink-500 to-rose-600', members: team.filter(m => m.role?.toLowerCase().includes('diseña')) },
            { id: 'edicion', label: 'Edición de Video', icon: Video, color: 'from-purple-500 to-indigo-600', members: team.filter(m => m.role?.toLowerCase().includes('editor')) },
            { id: 'film', label: 'Filmmakers', icon: Clapperboard, color: 'from-orange-500 to-red-600', members: team.filter(m => m.role?.toLowerCase().includes('film')) },
            { id: 'foto', label: 'Fotografía', icon: Camera, color: 'from-amber-400 to-orange-500', members: team.filter(m => m.role?.toLowerCase().includes('foto')) },
            { id: 'audio', label: 'Ingeniería de Audio', icon: Mic, color: 'from-emerald-400 to-teal-500', members: team.filter(m => m.role?.toLowerCase().includes('audio')) },
            { id: 'web', label: 'Desarrollo Web', icon: Globe, color: 'from-blue-500 to-cyan-600', members: team.filter(m => m.role?.toLowerCase().includes('web') || m.role?.toLowerCase().includes('programador')) },
            { id: 'modelos', label: 'Modelos', icon: User, color: 'from-fuchsia-500 to-pink-600', members: team.filter(m => m.role?.toLowerCase().includes('modelo')) },
            { id: 'imprenta', label: 'Imprenta / Merch', icon: Printer, color: 'from-slate-500 to-slate-700', members: team.filter(m => m.role?.toLowerCase().includes('imprenta') || m.role?.toLowerCase().includes('merch')) },
            { id: 'eventos', label: 'Eventos / Prod', icon: Ticket, color: 'from-indigo-400 to-purple-500', members: team.filter(m => m.role?.toLowerCase().includes('evento')) }
        ];
    };

    const getSquads = () => {
        // More flexible filter to avoid exact match issues
        const cms = team.filter(m => 
            m.role?.toLowerCase().includes('community manager') || 
            m.role?.toLowerCase().includes('estratega')
        );
        
        return cms.map(cm => ({
            id: cm.id, 
            label: `Escuadrón ${cm.name ? cm.name.split(' ')[0] : 'Talento'}`, 
            icon: Flame, 
            lead: cm, 
            color: 'from-indigo-600 to-purple-800', 
            members: team.filter(m => m.squad_lead_id === cm.id)
        }));
    };

    return (
        <div className="p-8 space-y-16 min-h-screen bg-[#05050A]">
            {/* Header */}
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                <div>
                    <h1 className="text-6xl font-black text-white mb-2 uppercase tracking-tighter italic">ZONA <span className="text-indigo-500">CREATIVA</span></h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <p className="text-gray-400 font-bold uppercase text-[12px] tracking-[0.5em] flex items-center gap-2">
                            <Target className="w-4 h-4 text-pink-500" /> Operational Mastery — HQ Dashboard 2026
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 h-fit">
                        <button onClick={() => setViewMode('squads')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'squads' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Escuadrones</button>
                        <button onClick={() => setViewMode('departments')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'departments' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Departamentos</button>
                    </div>
                    <InviteButton label="Invitación para Equipo" type="creative" color="indigo" icon={UserPlus} />
                </div>
            </div>

            {loading ? (
                <div className="text-white text-center py-20 animate-pulse">Cargando Sistema HQ...</div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div key={viewMode} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-20">
                        {viewMode === 'squads' ? (
                            getSquads().length > 0 ? (
                                getSquads().map((squad) => (
                                    <div key={squad.id} className="space-y-8">
                                        <div className="flex items-center gap-6">
                                            <div className={`p-4 bg-gradient-to-br ${squad.color} rounded-3xl text-white shadow-[0_0_30px_rgba(79,70,229,0.2)]`}><squad.icon className="w-8 h-8" /></div>
                                            <div className="flex flex-col">
                                                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{squad.label}</h2>
                                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2 mt-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                                                    Lid Operativo: {squad.lead.name}
                                                </div>
                                            </div>
                                            <div className="h-px flex-1 bg-white/5" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                                            <TeamMemberCard member={squad.lead} team={team} allClients={clients} variant="lead" onAudit={() => openAudit(squad.lead)} />
                                            {squad.members.map((member) => (
                                                <TeamMemberCard key={member.id} member={member} team={team} allClients={clients} onAudit={() => openAudit(member)} />
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-40 text-center space-y-4">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 border border-white/10">
                                        <Users className="w-10 h-10 text-gray-600" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">No se detectan escuadrones activos</h3>
                                    
                                    {/* Diagnostic Info */}
                                    <div className="flex items-center justify-center gap-6 my-8">
                                        <div className="px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mr-2">Total Team:</span>
                                            <span className="text-sm font-black text-white tracking-widest">{team.length}</span>
                                        </div>
                                        <div className="px-4 py-2 bg-pink-500/10 rounded-full border border-pink-500/20">
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mr-2">Roles CM/STR:</span>
                                            <span className="text-sm font-black text-white tracking-widest">
                                                {team.filter(m => m.role?.toLowerCase().includes('community') || m.role?.toLowerCase().includes('estratega')).length}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                                        Asegúrate de que los líderes tengan asignado el rol de <span className="text-indigo-400">Community Manager</span> o <span className="text-indigo-400">Estratega</span> para generar la jerarquía operativa.
                                    </p>
                                    <button onClick={() => window.location.reload()} className="mt-8 px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">Sincronizar Manualmente</button>
                                </div>
                            )
                        ) : (
                            getDepartments().map((dept) => dept.members.length > 0 && (
                                <div key={dept.id} className="space-y-10">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 bg-gradient-to-br ${dept.color} rounded-3xl text-white shadow-lg`}><dept.icon className="w-8 h-8" /></div>
                                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">{dept.label}</h2>
                                        <div className="h-px flex-1 bg-white/5" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                                        {dept.members.map((member) => (
                                            <TeamMemberCard key={member.id} member={member} team={team} allClients={clients} onAudit={() => openAudit(member)} />
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Modals */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <AddMemberModal 
                        newMember={newMember}
                        setNewMember={setNewMember}
                        onClose={() => setIsAddModalOpen(false)}
                        onSubmit={handleAddMember}
                        isSubmitting={isSubmitting}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAuditOpen && selectedMember && (
                    <TeamAuditModal 
                        member={selectedMember} 
                        team={team}
                        allClients={clients}
                        onClose={() => setIsAuditOpen(false)} 
                        onSave={() => fetchData()}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function TeamMemberCard({ member, team = [], allClients = [], variant = 'normal', onAudit }) {
    if (!member) return null;
    const isCM = (member.role || '').toLowerCase().includes('community manager');
    
    // Filter brands assigned to this member
    const assignedBrands = allClients.filter(c => 
        c.cm === member.name || 
        c.editor === member.name || 
        c.filmmaker === member.name
    );

    // If lead, find squad members
    const squadMembers = variant === 'lead' ? team.filter(m => m.squad_lead_id === member.id) : [];
    
    // Internal summary tags
    const skills = member.skills || (isCM ? ['Estrategia', 'Gestión', 'Brands'] : ['VFX', 'Edición', 'Ritmo']);

    return (
        <motion.div 
            whileHover={{ y: -8, scale: 1.01 }} 
            className="relative w-full h-auto min-h-[520px] max-w-[310px] mx-auto bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-6 flex flex-col shadow-2xl group overflow-hidden"
        >
            {/* Premium Glass Accents */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[90px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000" />
            
            {/* Identity Header */}
            <div className="flex flex-col items-center mb-8 pt-4">
                <div className="relative mb-5">
                    <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 scale-150" />
                    <div className="w-20 h-20 rounded-[1.8rem] bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-2xl relative z-10 transition-transform duration-500 group-hover:rotate-6">
                        <div className="w-full h-full rounded-[1.7rem] bg-[#050510] flex items-center justify-center text-3xl font-black text-white italic tracking-tighter shadow-inner">
                            {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-indigo-400 transition-colors duration-500">
                        {member.name ? member.name.split(' ')[0] : 'Talento'}
                    </h3>
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2 bg-white/5 py-1 px-3 rounded-full border border-white/5 inline-block">{member.role}</p>
                </div>
            </div>

            {/* Statistics Row (Image 2 style) */}
            <div className="grid grid-cols-3 gap-2 mb-8 relative z-10">
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 text-center group-hover:border-indigo-500/20 transition-all">
                    <p className="text-[7px] font-black text-indigo-400/50 uppercase tracking-widest mb-1.5 italic font-mono">Brands</p>
                    <div className="flex items-center justify-center gap-1.5">
                        <Activity className="w-2.5 h-2.5 text-indigo-400" />
                        <span className="text-xs font-black text-white">{assignedBrands.length}</span>
                    </div>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 text-center group-hover:border-purple-500/20 transition-all">
                    <p className="text-[7px] font-black text-purple-400/50 uppercase tracking-widest mb-1.5 italic font-mono">Squad</p>
                    <div className="flex items-center justify-center gap-1.5">
                        <Shield className="w-2.5 h-2.5 text-purple-400" />
                        <span className="text-xs font-black text-white">{variant === 'lead' ? squadMembers.length : 'OK'}</span>
                    </div>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 text-center group-hover:border-emerald-500/20 transition-all">
                    <p className="text-[7px] font-black text-emerald-400/50 uppercase tracking-widest mb-1.5 italic font-mono">Status</p>
                    <div className="flex items-center justify-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,1)]" />
                        <span className="text-[9px] font-black text-white uppercase tracking-tighter">ACT</span>
                    </div>
                </div>
            </div>

            {/* Internal Summary (6-Box Grid) */}
            <div className="flex-1 space-y-4 mb-8">
                <div className="flex items-center justify-between px-1">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Resumen Interno</p>
                    <Database className="w-2 h-2 text-gray-600" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {/* Core Stats Grid */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 group/box hover:bg-white/5 transition-all">
                        <MapPin className="w-2.5 h-2.5 text-indigo-400" />
                        <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest leading-none">Sede</span>
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter truncate w-full text-center">{member.city || '---'}</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 group/box hover:bg-white/5 transition-all">
                        <DollarSign className="w-2.5 h-2.5 text-emerald-400" />
                        <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest leading-none">Sueldo</span>
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter truncate w-full text-center">${member.salary || '0'}</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 group/box hover:bg-white/5 transition-all">
                        <Globe className="w-2.5 h-2.5 text-blue-400" />
                        <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest leading-none">Marcas</span>
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter truncate w-full text-center">{assignedBrands.length}</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 group/box hover:bg-white/5 transition-all">
                        <Zap className="w-2.5 h-2.5 text-yellow-400" />
                        <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest leading-none">Skills</span>
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter truncate w-full text-center">{skills.length}</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 group/box hover:bg-white/5 transition-all">
                        <MessageSquare className="w-2.5 h-2.5 text-pink-400" />
                        <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest leading-none">WhatsApp</span>
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter truncate w-full text-center">{member.whatsapp ? 'REG' : '---'}</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 group/box hover:bg-white/5 transition-all">
                        <FileText className="w-2.5 h-2.5 text-indigo-400" />
                        <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest leading-none">Expediente</span>
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter truncate w-full text-center">{member.cv_url ? 'CV' : '---'}</span>
                    </div>
                </div>
            </div>

            {/* Tactical Action */}
            <button 
                onClick={onAudit}
                className="w-full py-4 rounded-2xl bg-white/[0.03] hover:bg-indigo-600 border border-white/5 hover:border-indigo-400 text-gray-500 hover:text-white font-black uppercase text-[8px] tracking-[0.4em] transition-all duration-500 shadow-xl"
            >
                Detalles Operativos
            </button>
        </motion.div>
    );
}



function TeamAuditModal({ member, team = [], allClients = [], onClose, onSave }) {
    const [formData, setFormData] = useState({ ...member });
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('perfil');
    const [activeTasks, setActiveTasks] = useState([]);
    const [skillsInput, setSkillsInput] = useState(Array.isArray(member.skills) ? member.skills.join(', ') : '');
    
    // Fetch member tasks
    useEffect(() => {
        const loadData = async () => {
            const tasks = await agencyService.getTasksByMember(member.name);
            setActiveTasks(tasks);
        };
        loadData();
    }, [member.name]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Process skills from input string
            const updatedSkills = skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
            const finalData = { ...formData, skills: updatedSkills };
            
            await agencyService.updateTeamMember(member.id, finalData);
            toast.success("HQ Sincronizado");
            onSave();
            onClose();
        } catch (error) {
            toast.error("Error de sincronización");
        } finally {
            setSaving(false);
        }
    };

    const toggleMember = async (memberId, remove = false) => {
        try {
            if (remove) {
                await agencyService.updateTeamMember(memberId, { squad_lead_id: null });
            } else {
                await agencyService.updateTeamMember(memberId, { squad_lead_id: member.id });
            }
            onSave();
            toast.success(remove ? "Retirado del escuadrón" : "Vínculo de escuadrón activo");
        } catch (error) {
            toast.error("Error en vinculación");
        }
    };

    const toggleBrand = async (clientId, remove = false) => {
        try {
            if (remove) {
                await agencyService.updateClient(clientId, { cm: null });
            } else {
                await agencyService.assignClientToCM(clientId, member.name);
            }
            onSave();
            toast.success(remove ? "Marca desvinculada" : "Marca asignada con éxito");
        } catch (error) {
            toast.error("Error al gestionar marca");
        }
    };

    const squadMembers = team.filter(m => m.squad_lead_id === member.id);
    const assignedBrands = allClients.filter(c => c.cm === member.name);
    const availableBrands = allClients.filter(c => c.cm !== member.name);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-indigo-950/20 backdrop-blur-xl" />
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 50 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 50 }} 
                className="relative w-full max-w-5xl bg-[#0F0F1A]/90 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] flex flex-row max-h-[85vh] overflow-hidden"
            >
                {/* Sidebar Section */}
                <div className="w-80 border-r border-white/5 bg-white/[0.02] flex flex-col p-10">
                    <div className="flex flex-col items-center mb-12 text-center">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white italic shadow-2xl mb-6 ring-4 ring-indigo-500/20">
                            {member.name[0]}
                        </div>
                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase w-full truncate">{member.name}</h3>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-2 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">{member.role}</p>
                    </div>

                    <div className="flex-1 space-y-3">
                        <TabButton active={activeTab === 'perfil'} onClick={() => setActiveTab('perfil')} icon={LayoutGrid} label="Perfil" />
                        <TabButton active={activeTab === 'profesional'} onClick={() => setActiveTab('profesional')} icon={Award} label="Expediente" />
                        <TabButton active={activeTab === 'marcas'} onClick={() => setActiveTab('marcas')} icon={Globe} label="Marcas" />
                        <TabButton active={activeTab === 'squad'} onClick={() => setActiveTab('squad')} icon={Shield} label="Squad" />
                        <TabButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={ListTodo} label="Tasks" />
                    </div>

                    <div className="pt-8 mt-auto border-t border-white/5">
                        <button onClick={onClose} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 text-gray-500 transition-all font-black uppercase text-[10px] tracking-widest border border-transparent hover:border-rose-500/20">
                            <X className="w-4 h-4" />
                            Cerrar Panel
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-indigo-600/5 to-transparent">
                        <div>
                            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Control <span className="text-indigo-400">Operativo</span></h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Sincronización en tiempo real</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#050510]/30">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            {activeTab === 'perfil' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-indigo-400/60 uppercase tracking-widest pl-2">Identidad</label>
                                            <input className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/40 transition-all font-bold text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-indigo-400/60 uppercase tracking-widest pl-2">Salario Base (USD)</label>
                                            <input type="number" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/40 transition-all font-bold text-sm placeholder:text-gray-700" placeholder="Ej: 800" value={formData.salary || ''} onChange={(e) => setFormData({...formData, salary: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-indigo-400/60 uppercase tracking-widest pl-2">Ubicación Estratégica</label>
                                            <select 
                                                className="w-full bg-[#0F0F1A] border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/40 transition-all font-bold text-sm appearance-none cursor-pointer" 
                                                value={formData.city || ''} 
                                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                            >
                                                <option value="" disabled>Seleccionar Ciudad</option>
                                                <option value="Quito">Quito</option>
                                                <option value="Santo Domingo">Santo Domingo</option>
                                                <option value="Guayaquil">Guayaquil</option>
                                                <option value="Cuenca">Cuenca</option>
                                                <option value="Manta">Manta</option>
                                                <option value="Portoviejo">Portoviejo</option>
                                                <option value="Ambato">Ambato</option>
                                                <option value="Loja">Loja</option>
                                                <option value="Machala">Machala</option>
                                                <option value="Remoto">Remoto (Global)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-indigo-400/60 uppercase tracking-widest pl-2">Email</label>
                                            <input className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/40 transition-all font-bold text-sm" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@diiczone.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-indigo-400/60 uppercase tracking-widest pl-2">WhatsApp</label>
                                            <input className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/40 transition-all font-bold text-sm" value={formData.whatsapp || ''} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} placeholder="+593 ..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-indigo-400/60 uppercase tracking-widest pl-2">Rol Operativo</label>
                                            <select className="w-full bg-[#0F0F1A] border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/40 transition-all font-bold text-sm appearance-none cursor-pointer" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                                                <option value="Editor de Video">Editor de Video</option>
                                                <option value="Community Manager">Community Manager</option>
                                                <option value="Filmmaker">Filmmaker</option>
                                                <option value="Diseñador">Diseñador</option>
                                                <option value="Estratega">Estratega</option>
                                                <option value="Director General">Director General</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 pt-4">
                                        <button onClick={handleSave} disabled={saving} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-[10px] transition-all disabled:opacity-50">
                                            {saving ? 'Guardando...' : 'Sincronizar Perfil'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'profesional' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.2em] px-4">Recursos de Talento</h4>
                                            <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-6">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Vínculo de CV / Portfolio</label>
                                                    {formData.cv_url ? (
                                                        <a 
                                                            href={formData.cv_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl group hover:bg-indigo-500 transition-all"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Database className="w-5 h-5 text-indigo-400 group-hover:text-white" />
                                                                <span className="text-xs font-bold text-white uppercase tracking-tighter">Ver Documento Oficial</span>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:text-white" />
                                                        </a>
                                                    ) : (
                                                        <div className="p-4 bg-white/5 border border-dashed border-white/10 rounded-2xl text-center">
                                                            <span className="text-[10px] font-bold text-gray-600 uppercase">Sin CV adjunto</span>
                                                        </div>
                                                    )}
                                                    <input 
                                                        className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-[10px] text-gray-400 outline-none focus:border-indigo-500 transition-all font-mono"
                                                        value={formData.cv_url || ''}
                                                        onChange={(e) => setFormData({...formData, cv_url: e.target.value})}
                                                        placeholder="URL del CV (Google Drive / PDF)"
                                                    />
                                                </div>

                                                <div className="space-y-3 pt-4">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Gestión de Habilidades</label>
                                                    <input 
                                                        className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-[11px] text-indigo-300 outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                                                        value={skillsInput}
                                                        onChange={(e) => setSkillsInput(e.target.value)}
                                                        placeholder="Ej: Photoshop, After Effects, Estrategia..."
                                                    />
                                                    <div className="flex flex-wrap gap-2 p-4 bg-black/20 rounded-2xl border border-white/5 mt-2">
                                                        {skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0).map((skill, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-500/30">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[12px] font-black text-purple-400 uppercase tracking-[0.2em] px-4">Resumen de Trayectoria</h4>
                                            <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[3rem] h-full min-h-[300px]">
                                                <textarea 
                                                    className="w-full h-full min-h-[220px] bg-transparent text-gray-300 text-sm leading-relaxed outline-none resize-none font-medium placeholder:text-gray-700"
                                                    placeholder="El resumen profesional del talento aparecerá aquí..."
                                                    value={formData.cv_summary || ''}
                                                    onChange={(e) => setFormData({...formData, cv_summary: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button onClick={handleSave} disabled={saving} className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-3xl hover:shadow-indigo-500/30 transition-all disabled:opacity-50">
                                            {saving ? 'Guardando Historial...' : 'Actualizar Expediente Profesional'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'marcas' && (
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] italic mb-4 px-4">Vincular Nueva Marca</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {availableBrands.map(brand => (
                                                <button 
                                                    key={brand.id} 
                                                    onClick={() => toggleBrand(brand.id)}
                                                    className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-sm font-black italic text-indigo-400 border border-indigo-500/20">{brand.name[0]}</div>
                                                        <div className="text-left">
                                                            <p className="text-[11px] font-black text-white uppercase italic leading-tight truncate max-w-[120px]">{brand.name}</p>
                                                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{brand.type || 'Cliente Regular'}</p>
                                                        </div>
                                                    </div>
                                                    <Plus className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] italic mb-4 px-4">Marcas Designadas</h4>
                                        <div className="space-y-3">
                                            {assignedBrands.map(brand => (
                                                <div key={brand.id} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.08] transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-lg font-black italic text-emerald-400 border border-emerald-500/20">
                                                            {brand.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">ZONA CREATIVA ACTIVA</p>
                                                            <p className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">{brand.name} <span className="text-emerald-400 text-xs ml-2">// {brand.type}</span></p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => toggleBrand(brand.id, true)}
                                                        className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            {assignedBrands.length === 0 && (
                                                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                                                    <Globe className="w-8 h-8 text-gray-800 mx-auto mb-3 opacity-20" />
                                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Sin marcas asignadas</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'squad' && (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center px-4">
                                        <h4 className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.2em] italic">Vincular Talento al Escuadrón</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {team.filter(m => !m.squad_lead_id && m.id !== member.id && !m.role.toLowerCase().includes('community manager')).map(m => (
                                            <button 
                                                key={m.id}
                                                onClick={() => toggleMember(m.id)}
                                                className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-xl font-black italic text-indigo-400 border border-indigo-500/20">{m.name[0]}</div>
                                                    <div className="text-left">
                                                        <p className="text-[13px] font-black text-white uppercase italic">{m.name}</p>
                                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{m.role}</p>
                                                    </div>
                                                </div>
                                                <Plus className="w-5 h-5 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-white/5">
                                        <h4 className="text-[12px] font-black text-purple-400 uppercase tracking-[0.2em] italic mb-6 px-4">Escuadrón Táctico Designado</h4>
                                        <div className="space-y-4">
                                            {squadMembers.map(m => (
                                                <div key={m.id} className="flex items-center justify-between p-8 bg-white/[0.03] border border-white/10 rounded-[3rem] hover:bg-white/[0.08] transition-all group">
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black italic text-white shadow-xl ${
                                                            m.role.toLowerCase().includes('editor') ? 'bg-purple-600' : 'bg-blue-600'
                                                        }`}>
                                                            {m.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">MIEMBRO OPERATIVO</p>
                                                            <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{m.name} <span className="text-indigo-400 ml-2">// {m.role}</span></p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => toggleMember(m.id, true)}
                                                        className="p-4 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                            {squadMembers.length === 0 && (
                                                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
                                                    <Shield className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-20" />
                                                    <p className="text-xs font-black text-gray-600 uppercase tracking-widest">Sin miembros vinculados</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'tasks' && (
                                <div className="space-y-8">
                                    <h4 className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.2em] italic px-4">Pipeline de Operaciones</h4>
                                    <div className="space-y-4">
                                        {activeTasks.map(task => (
                                            <div key={task.id} className="p-10 bg-white/[0.03] border border-white/5 rounded-[3rem] flex items-center justify-between group hover:bg-white/[0.08] transition-all">
                                                <div className="flex items-center gap-10">
                                                    <div className="w-5 h-5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                                                    <div>
                                                        <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3 italic">{task.client?.replace(/_/g, ' ') || 'PROYECTO INTERNO'}</p>
                                                        <h5 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{task.title}</h5>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                                                        Octubre 2026
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {activeTasks.length === 0 && (
                                            <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[4rem]">
                                                <ListTodo className="w-16 h-16 text-gray-800 mx-auto mb-6 opacity-20" />
                                                <p className="text-sm font-black text-gray-600 uppercase tracking-[0.3em] italic">Pipeline despejado // Sin tareas activas</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    </div>
);
}

function TabButton({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all duration-300 ${
                active 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl translate-x-1' 
                : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300'
            }`}
        >
            <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-600'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.15em]">{label}</span>
        </button>
    );
}


function AddMemberModal({ newMember, setNewMember, onClose, onSubmit, isSubmitting }) {
    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-indigo-950/20 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.95, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 30, opacity: 0 }} className="relative w-full max-w-md bg-[#0F0F1A]/90 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-3xl">
                <h3 className="text-3xl font-black text-white uppercase italic italic mb-8">Nuevo Talento</h3>
                <form onSubmit={onSubmit} className="space-y-6">
                    <input required className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none" placeholder="Nombre" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="email" required className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none text-sm" placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} />
                        <input className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none text-sm" placeholder="WhatsApp" value={newMember.whatsapp} onChange={(e) => setNewMember({ ...newMember, whatsapp: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <select className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none appearance-none text-sm cursor-pointer" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}>
                            <option value="Editor de Video">Editor de Video</option>
                            <option value="Community Manager">Community Manager</option>
                            <option value="Diseñador">Diseñador</option>
                            <option value="Filmmaker">Filmmaker</option>
                            <option value="Estratega">Estratega</option>
                            <option value="Ingeniería de Audio">Ingeniería de Audio</option>
                            <option value="Fotografía">Fotografía</option>
                            <option value="Modelos">Modelos</option>
                            <option value="Desarrollo Web">Desarrollo Web</option>
                            <option value="Imprenta / Merch">Imprenta / Merch</option>
                            <option value="Eventos / Prod">Eventos / Prod</option>
                        </select>
                        <select className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none appearance-none text-sm cursor-pointer" value={newMember.city} onChange={(e) => setNewMember({ ...newMember, city: e.target.value })}>
                            <option value="Quito">Quito</option>
                            <option value="Santo Domingo">Santo Domingo</option>
                            <option value="Guayaquil">Guayaquil</option>
                            <option value="Cuenca">Cuenca</option>
                            <option value="Manta">Manta</option>
                            <option value="Remoto">Remoto</option>
                        </select>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-[11px] hover:bg-indigo-500 transition-all opacity-100 disabled:opacity-50">
                        {isSubmitting ? 'Registrando...' : 'Confirmar Ingreso'}
                    </button>
                    <button type="button" onClick={onClose} className="w-full py-3 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Cancelar</button>
                </form>
            </motion.div>
        </div>
    );
}

function InviteButton({ label, type, color, icon: Icon }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        const url = `${window.location.origin}/onboarding?type=${type}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success(`Enlace copiado`, {
            description: `Se ha generado el link de acceso para ${type === 'client' ? 'Socio' : 'Equipo'}.`
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const colors = {
        indigo: 'bg-indigo-500/5 text-indigo-400 border-indigo-500/20 hover:bg-indigo-600 hover:text-white',
        purple: 'bg-purple-500/5 text-purple-400 border-purple-500/20 hover:bg-purple-600 hover:text-white'
    };

    return (
        <button onClick={handleCopy} className={`flex items-center gap-3 px-6 py-4 rounded-2xl border ${colors[color]} font-black uppercase text-[10px] transition-all active:scale-95 shadow-xl`}>
            <Icon className="w-4 h-4" />
            {copied ? '¡COPIADO!' : label}
            <Copy className="w-3 h-3 opacity-30 ml-2" />
        </button>
    );
}
