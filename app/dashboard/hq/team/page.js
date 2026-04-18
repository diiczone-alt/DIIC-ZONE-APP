'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Shield, Star, Zap, 
    MoreHorizontal, UserPlus, Phone, 
    Mail, Briefcase, Award, Cpu,
    Activity, Layout, LayoutGrid, Plus, Check, X,
    ChevronRight, Target, Flame, Database,
    ChevronDown, Trash2, Edit, MessageSquare, Globe
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
            {/* Header */}
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                <div>
                    <h1 className="text-6xl font-black text-white mb-2 uppercase tracking-tighter italic">ZONA <span className="text-indigo-500">CREATIVA</span></h1>
                    <p className="text-gray-400 font-bold uppercase text-[12px] tracking-[0.5em] flex items-center gap-2">
                        <Target className="w-4 h-4 text-pink-500" /> Operational Mastery — HQ Dashboard 2026
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
                        <button onClick={() => setViewMode('squads')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'squads' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Escuadrones</button>
                        <button onClick={() => setViewMode('departments')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'departments' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Departamentos</button>
                    </div>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-4 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all">
                        <UserPlus className="w-4 h-4" /> Registrar Talento
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-white text-center py-20 animate-pulse">Cargando Sistema HQ...</div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div key={viewMode} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-20">
                        {viewMode === 'squads' ? (
                            getSquads().map((squad) => (
                                <div key={squad.id} className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 bg-gradient-to-br ${squad.color} rounded-2xl text-white shadow-lg`}><squad.icon className="w-6 h-6" /></div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-widest">{squad.label}</h2>
                                        <div className="h-px flex-1 bg-white/5" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                        <TeamMemberCard member={squad.lead} team={team} allClients={clients} variant="lead" onAudit={() => openAudit(squad.lead)} />
                                        {squad.members.map((member) => (
                                            <TeamMemberCard key={member.id} member={member} team={team} allClients={clients} onAudit={() => openAudit(member)} />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            getDepartments().map((dept) => dept.members.length > 0 && (
                                <div key={dept.id} className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 bg-gradient-to-br ${dept.color} rounded-2xl text-white shadow-lg`}><dept.icon className="w-6 h-6" /></div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-widest">{dept.label}</h2>
                                        <div className="h-px flex-1 bg-white/5" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
    const isCM = member.role.toLowerCase().includes('community manager');
    
    return (
        <motion.div whileHover={{ y: -5 }} className="bg-[#0E0E18] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full group-hover:bg-indigo-500/10 transition-all`} />
            
            <div className="flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${isCM ? 'from-indigo-500 to-purple-500' : 'from-white/10 to-transparent'} p-[2px] mb-6`}>
                    <div className="w-full h-full rounded-[1.9rem] bg-[#0A0A12] flex items-center justify-center text-3xl font-black text-white italic">
                        {member.name[0]}
                    </div>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{member.name}</h3>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">{member.role}</p>
                <div className="w-full h-px bg-white/5 mb-6" />
                <button onClick={onAudit} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all border border-white/5">
                    Detalles Operativos
                </button>
            </div>
        </motion.div>
    );
}

function TeamAuditModal({ member, team = [], allClients = [], onClose, onSave }) {
    const [formData, setFormData] = useState({ ...member });
    const [saving, setSaving] = useState(false);
    const isCM = member.role.toLowerCase().includes('community manager');

    const handleSave = async () => {
        setSaving(true);
        try {
            await agencyService.updateTeamMember(member.id, formData);
            toast.success("HQ Sincronizado");
            onSave();
            onClose();
        } catch (error) {
            toast.error("Error de sincronización");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-[#0A0A1F] border border-white/10 rounded-[3rem] p-10 overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-3xl font-black text-white uppercase italic italic">Control Operativo</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{member.name} // {member.role}</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-rose-500/20 rounded-xl text-gray-400 hover:text-rose-500 transition-all"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Nombre</label>
                        <input className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Salario (USD)</label>
                        <input type="number" className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none" value={formData.salary || ''} onChange={(e) => setFormData({...formData, salary: e.target.value})} />
                    </div>
                    <button onClick={handleSave} disabled={saving} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black uppercase tracking-widest text-[11px] shadow-xl disabled:opacity-50 transition-all">
                        {saving ? 'Guardando...' : 'Sincronizar Perfil'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function AddMemberModal({ newMember, setNewMember, onClose, onSubmit, isSubmitting }) {
    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-full max-w-xl bg-[#0A0A1F] border border-white/10 rounded-[3rem] p-10 shadow-2xl">
                <h3 className="text-3xl font-black text-white uppercase italic italic mb-8">Nuevo Talento</h3>
                <form onSubmit={onSubmit} className="space-y-6">
                    <input required className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none" placeholder="Nombre" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="email" required className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none text-sm" placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} />
                        <input className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none text-sm" placeholder="WhatsApp" value={newMember.whatsapp} onChange={(e) => setNewMember({ ...newMember, whatsapp: e.target.value })} />
                    </div>
                    <select className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none appearance-none" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}>
                        <option value="Editor de Video">Editor de Video</option>
                        <option value="Community Manager">Community Manager</option>
                        <option value="Diseñador">Diseñador</option>
                        <option value="Filmmaker">Filmmaker</option>
                        <option value="Programador">Programador</option>
                    </select>
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-[11px] hover:bg-indigo-500 transition-all opacity-100 disabled:opacity-50">
                        {isSubmitting ? 'Registrando...' : 'Confirmar Ingreso'}
                    </button>
                    <button type="button" onClick={onClose} className="w-full py-3 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Cancelar</button>
                </form>
            </motion.div>
        </div>
    );
}
