'use client';

import { useState, useEffect } from 'react';
import {
    X, Phone, MessageCircle, Calendar, Mail, MapPin, Globe,
    Facebook, Instagram, Linkedin, Clock, CheckCircle2,
    AlertCircle, FileText, Download, Upload, DollarSign,
    TrendingUp, Shield, User, Send, Paperclip, MoreVertical,
    Bot, BrainCircuit, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScheduleModal from './ScheduleModal';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const COLUMN_CONFIG = {
    'incoming': { title: 'LEADS ENTRANTES', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    'contact': { title: 'CONTACTO INICIAL', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    'rebound': { title: 'REPESCA 15 DÍAS', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    'identified': { title: 'CURSO INTERÉS ID', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    'negotiation': { title: 'NEGOCIACIÓN', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    'won': { title: 'CERRADO - VENTA', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
};

function getStatusColor(status) {
    const key = status?.toLowerCase() || 'incoming';
    return COLUMN_CONFIG[key]?.color || 'bg-blue-500/20 text-blue-400 border-blue-500/30';
}

function getScoreColor(score) {
    if (score >= 80) return 'text-red-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-blue-500';
}

function getScoreBg(score) {
    if (score >= 80) return 'bg-red-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-blue-500';
}

export default function LeadProfileView({ lead, onClose, onLeadStatusChange, onLeadUpdate, onLeadDelete }) {
    const [activeTab, setActiveTab] = useState('timeline');
    const [showSchedule, setShowSchedule] = useState(false);
    const [isSynced, setIsSynced] = useState(false);

    const [editedLead, setEditedLead] = useState({ ...lead });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setEditedLead({ ...lead });
    }, [lead]);

    if (!lead) return null;

    const leadScore = lead.score || lead.growth_level || Math.floor(Math.random() * 40) + 40;

    const handleSaveDetails = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('crm_leads')
                .update({
                    full_name: editedLead.full_name || editedLead.name,
                    email: editedLead.email,
                    phone: editedLead.phone,
                    city: editedLead.city,
                    industry: editedLead.industry || editedLead.niche,
                    price_estimated: Number(editedLead.price_estimated || editedLead.value || 0)
                })
                .eq('id', lead.id);

            if (error) throw error;

            toast.success("Detalles actualizados con éxito");
            
            const updated = {
                ...lead,
                ...editedLead,
                full_name: editedLead.full_name || editedLead.name,
                name: editedLead.full_name || editedLead.name,
                price_estimated: Number(editedLead.price_estimated || editedLead.value || 0),
                value: Number(editedLead.price_estimated || editedLead.value || 0)
            };

            if (onLeadUpdate) {
                onLeadUpdate(updated);
            }
        } catch (err) {
            console.error("Error updating lead details:", err);
            toast.error("Error al guardar cambios");
        } finally {
            setIsSaving(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const statusUpper = newStatus.toUpperCase();
            const { error } = await supabase
                .from('crm_leads')
                .update({ status: statusUpper })
                .eq('id', lead.id);

            if (error) throw error;

            setEditedLead(prev => ({ ...prev, status: newStatus }));
            toast.success(`Estado cambiado a ${COLUMN_CONFIG[newStatus]?.title || newStatus}`);

            if (onLeadStatusChange) {
                onLeadStatusChange(lead.id, statusUpper);
            }
        } catch (err) {
            console.error("Error changing status:", err);
            toast.error("Error al actualizar el estado");
        }
    };

    const handleDeleteLead = async () => {
        if (!confirm("¿Estás seguro de que deseas eliminar este lead del CRM de forma permanente?")) return;
        
        try {
            const { error } = await supabase
                .from('crm_leads')
                .delete()
                .eq('id', lead.id);

            if (error) throw error;

            toast.success("Lead eliminado correctamente");
            if (onLeadDelete) {
                onLeadDelete(lead.id);
            }
            onClose();
        } catch (err) {
            console.error("Error deleting lead:", err);
            toast.error("Error al eliminar el lead");
        }
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[800px] bg-[#0E0E18] border-l border-white/10 shadow-2xl z-50 flex flex-col"
        >
            {/* --- HEADER --- */}
            <div className="p-6 border-b border-white/10 bg-[#151520] flex justify-between items-start">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/20">
                        {(editedLead.full_name || editedLead.name)?.charAt(0) || 'L'}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{editedLead.full_name || editedLead.name}</h2>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {editedLead.city || 'Ubicación No Registrada'}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="flex items-center gap-1"><BriefcaseIcon niche={editedLead.industry || editedLead.niche} /> {editedLead.industry || editedLead.niche || 'General'}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <div className="relative group/wa">
                                <ActionButton 
                                    icon={MessageCircle} 
                                    label="WhatsApp" 
                                    color="text-[#25D366] hover:bg-[#25D366]/10 border-[#25D366]/20" 
                                    onClick={() => {
                                        if (!editedLead.phone) {
                                            toast.error("No hay teléfono registrado");
                                            return;
                                        }
                                        const cleanPhone = editedLead.phone.replace(/\D/g, '');
                                        window.open(`https://wa.me/${cleanPhone}`, '_blank');
                                    }}
                                />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#25D366] text-white text-[8px] font-black uppercase rounded-lg opacity-0 group-hover/wa:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg shadow-[#25D366]/20 flex items-center gap-2">
                                    <Bot className="w-3 h-3" /> Sincronización IA Activa
                                </div>
                            </div>
                            <ActionButton 
                                icon={Phone} 
                                label="Llamar" 
                                color="text-blue-400 hover:bg-blue-400/10" 
                                onClick={() => {
                                    if (!editedLead.phone) {
                                        toast.error("No hay teléfono registrado");
                                        return;
                                    }
                                    window.open(`tel:${editedLead.phone}`);
                                }}
                            />
                            <ActionButton 
                                icon={Mail} 
                                label="Email" 
                                color="text-yellow-400 hover:bg-yellow-400/10" 
                                onClick={() => {
                                    if (!editedLead.email) {
                                        toast.error("No hay correo registrado");
                                        return;
                                    }
                                    window.open(`mailto:${editedLead.email}`);
                                }}
                            />
                            <ActionButton 
                                icon={Calendar} 
                                label="Agendar" 
                                color={isSynced ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-purple-400 hover:bg-purple-400/10"}
                                onClick={() => setShowSchedule(true)}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Estado Actual</p>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(editedLead.status)}`}>
                            {COLUMN_CONFIG[editedLead.status]?.title || 'Nuevo Lead'}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400 hover:text-white" />
                    </button>
                </div>
            </div>

            {/* --- BODY --- */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT: MAIN CONTENT (Tabs) */}
                <div className="flex-1 flex flex-col border-r border-white/5">
                    {/* Tabs Nav */}
                    <div className="flex border-b border-white/5 bg-[#121212]">
                        <TabButton id="timeline" label="Línea de Tiempo" icon={Clock} active={activeTab} set={setActiveTab} />
                        <TabButton id="info" label="Información" icon={User} active={activeTab} set={setActiveTab} />
                        <TabButton id="commercial" label="Comercial" icon={DollarSign} active={activeTab} set={setActiveTab} />
                        <TabButton id="files" label="Archivos" icon={FileText} active={activeTab} set={setActiveTab} />
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0E0E18] p-6">
                        {activeTab === 'timeline' && <TimelineTab />}
                        {activeTab === 'info' && (
                            <InfoTab 
                                editedLead={editedLead} 
                                setEditedLead={setEditedLead} 
                                isSaving={isSaving} 
                                handleSaveDetails={handleSaveDetails} 
                            />
                        )}
                        {activeTab === 'commercial' && <CommercialTab lead={editedLead} />}
                        {activeTab === 'files' && <FilesTab />}
                    </div>

                    {/* Quick Input (Fixed at bottom) */}
                    <div className="p-4 border-t border-white/10 bg-[#151520] flex gap-3 items-center">
                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400"><Paperclip className="w-5 h-5" /></button>
                        <input
                            type="text"
                            placeholder="Escribe una nota o mensaje..."
                            className="flex-1 bg-[#0E0E18] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button className="p-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* RIGHT: INTELLIGENCE SIDEBAR */}
                <div className="w-72 bg-[#121212] flex flex-col overflow-y-auto custom-scrollbar p-5 space-y-6">

                    {/* AI Score */}
                    <div className="bg-[#151520] rounded-xl p-4 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-50"><BrainCircuit className="w-12 h-12 text-indigo-500/20" /></div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Lead Score (IA)</h4>
                        <div className="flex items-end gap-2 mb-2">
                            <span className={`text-4xl font-bold ${getScoreColor(leadScore)}`}>{leadScore}</span>
                            <span className="text-gray-500 text-sm mb-1">/ 100</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${getScoreBg(leadScore)}`} style={{ width: `${leadScore}%` }}></div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2">
                            {leadScore > 70 ? 'Alta probabilidad de cierre. Responder en < 1h.' : 'Requiere nutrición. Enviar secuencia de valor.'}
                        </p>
                    </div>

                    {/* CRM Pipeline Status Selector */}
                    <div className="bg-[#151520] p-4 rounded-2xl border border-white/5">
                        <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Estado en Pipeline</h4>
                        <select 
                            value={editedLead.status || 'incoming'}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="w-full bg-[#0A0A12] border border-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500 appearance-none cursor-pointer font-bold"
                        >
                            <option value="incoming">LEADS ENTRANTES</option>
                            <option value="contact">CONTACTO INICIAL</option>
                            <option value="rebound">REPESCA 15 DÍAS</option>
                            <option value="identified">CURSO INTERÉS ID</option>
                            <option value="negotiation">NEGOCIACIÓN</option>
                            <option value="won">CERRADO - VENTA</option>
                        </select>
                    </div>

                    {/* AI Insights / Next Action */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Bot className="w-3.5 h-3.5 text-indigo-400" /> Next Best Action
                        </h4>
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
                            <p className="text-sm text-indigo-200">
                                {leadScore > 70 
                                    ? `Enviar propuesta comercial para ${editedLead.industry || 'Servicio Premium'}.`
                                    : "Enviar secuencia de nutrición y contenido automatizado por WhatsApp."
                                }
                            </p>
                            <button 
                                onClick={() => toast.info('Generando Propuesta PDF Estratégica...')}
                                className="mt-2 w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
                            >
                                Generar Propuesta
                            </button>
                        </div>
                    </div>

                    {/* Responsible */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Responsable</h4>
                        <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">
                                CA
                            </div>
                            <div>
                                <p className="text-sm text-white font-bold">Carlos Admin</p>
                                <p className="text-[10px] text-gray-500">Sales Manager</p>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Etiquetas</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Real Estate', 'Urgente', 'Presupuesto Alto'].map(tag => (
                                <span key={tag} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md text-[10px] text-gray-300 border border-white/5 cursor-pointer transition-colors hover:border-indigo-500/30">
                                    {tag}
                                </span>
                            ))}
                            <button 
                                onClick={() => toast.info('Añadir nueva etiqueta estratégica...')}
                                className="px-2 py-1 border border-dashed border-gray-600 rounded-md text-[10px] text-gray-500 hover:text-white hover:border-gray-400 transition-colors"
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                    {/* Delete Lead Button */}
                    <div className="pt-4 border-t border-white/5">
                        <button
                            onClick={handleDeleteLead}
                            className="w-full py-2.5 bg-red-950/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-900/20 hover:border-red-500/30 transition-all"
                        >
                            Eliminar Lead
                        </button>
                    </div>

                </div>
            </div>
            <AnimatePresence>
                {showSchedule && (
                    <ScheduleModal 
                        lead={editedLead} 
                        onClose={() => setShowSchedule(false)} 
                        onSchedule={(data) => {
                            console.log('Scheduled:', data);
                            setIsSynced(true);
                            toast.success(`Cita agendada para el ${data.date} a las ${data.time}. Sincronizado con Google Calendar.`);
                        }} 
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// --- SUB-COMPONENTS ---

function TimelineTab() {
    return (
        <div className="space-y-6 relative ml-2">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-white/10"></div>

            {/* Event 1: Message */}
            <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#151520] border border-white/10 flex items-center justify-center z-10">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                </div>
                <div className="bg-[#151520] p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-white">Mensaje de WhatsApp</span>
                        <span className="text-[10px] text-gray-500">Hoy, 10:42 AM</span>
                    </div>
                    <p className="text-sm text-gray-300">Hola, me interesa saber más sobre el paquete de gestión de redes para mi clínica dental.</p>
                </div>
            </div>

            {/* Event 2: Note */}
            <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#151520] border border-white/10 flex items-center justify-center z-10">
                    <User className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-yellow-200">Nota Interna (Carlos)</span>
                        <span className="text-[10px] text-yellow-500/60">Ayer, 4:30 PM</span>
                    </div>
                    <p className="text-sm text-yellow-100/80 italic">Cliente potencial alto valor. Tiene 3 sucursales. Prioridad para agendar llamada esta semana.</p>
                </div>
            </div>

            {/* Event 3: Status Change */}
            <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#151520] border border-white/10 flex items-center justify-center z-10">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Cambio de estado a <span className="text-blue-400 font-bold">Interesado</span></span>
                    <span className="text-[10px] text-gray-600">Ayer, 4:25 PM</span>
                </div>
            </div>
        </div>
    )
}

function InfoTab({ editedLead, setEditedLead, isSaving, handleSaveDetails }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#151520] p-3 rounded-xl border border-white/5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Nombre Completo</label>
                    <input 
                        type="text" 
                        value={editedLead.full_name || editedLead.name || ''} 
                        onChange={(e) => setEditedLead(prev => ({ ...prev, full_name: e.target.value, name: e.target.value }))}
                        className="bg-transparent border-none text-sm text-white focus:outline-none w-full font-medium"
                    />
                </div>
                <div className="bg-[#151520] p-3 rounded-xl border border-white/5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Teléfono (WhatsApp)</label>
                    <input 
                        type="text" 
                        value={editedLead.phone || ''} 
                        onChange={(e) => setEditedLead(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-transparent border-none text-sm text-white focus:outline-none w-full font-medium"
                    />
                </div>
                <div className="bg-[#151520] p-3 rounded-xl border border-white/5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
                    <input 
                        type="email" 
                        value={editedLead.email || ''} 
                        onChange={(e) => setEditedLead(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-transparent border-none text-sm text-white focus:outline-none w-full font-medium"
                    />
                </div>
                <div className="bg-[#151520] p-3 rounded-xl border border-white/5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Ciudad / Ubicación</label>
                    <input 
                        type="text" 
                        value={editedLead.city || ''} 
                        onChange={(e) => setEditedLead(prev => ({ ...prev, city: e.target.value }))}
                        className="bg-transparent border-none text-sm text-white focus:outline-none w-full font-medium"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#151520] p-3 rounded-xl border border-white/5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Especialidad / Interés</label>
                    <input 
                        type="text" 
                        value={editedLead.industry || editedLead.niche || ''} 
                        onChange={(e) => setEditedLead(prev => ({ ...prev, industry: e.target.value, niche: e.target.value }))}
                        className="bg-transparent border-none text-sm text-white focus:outline-none w-full font-medium"
                    />
                </div>
                <div className="bg-[#151520] p-3 rounded-xl border border-white/5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Valor Estimado ($)</label>
                    <input 
                        type="number" 
                        value={editedLead.price_estimated || editedLead.value || 0} 
                        onChange={(e) => setEditedLead(prev => ({ ...prev, price_estimated: Number(e.target.value), value: Number(e.target.value) }))}
                        className="bg-transparent border-none text-sm text-white focus:outline-none w-full font-medium text-emerald-400"
                    />
                </div>
            </div>

            <button 
                onClick={handleSaveDetails}
                disabled={isSaving}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
                {isSaving ? 'Guardando Cambios...' : 'Guardar Detalles del Lead'}
            </button>
        </div>
    )
}

function CommercialTab({ lead }) {
    const score = lead.score || lead.growth_level || 50;
    const probability = score >= 80 ? '85%' : score >= 50 ? '60%' : '25%';
    const probColor = score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-blue-400';
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-center">
                    <p className="text-xs text-emerald-400 uppercase font-bold mb-1">Valor Potencial</p>
                    <p className="text-2xl font-bold text-emerald-300">
                        ${lead.price_estimated ? Number(lead.price_estimated).toLocaleString() : lead.value ? Number(lead.value).toLocaleString() : '0'}
                    </p>
                </div>
                <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 text-center">
                    <p className="text-xs text-indigo-400 uppercase font-bold mb-1">Probabilidad (IA)</p>
                    <p className={`text-2xl font-bold ${probColor}`}>{probability}</p>
                </div>
            </div>

            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Origen e Intereses</h4>
                <div className="bg-[#151520] p-4 rounded-xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Canal de Adquisición:</span>
                        <span className="text-xs text-white font-bold uppercase">{lead.source || 'Ads / Orgánico'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Servicio de Interés:</span>
                        <span className="text-xs text-indigo-400 font-bold uppercase">{lead.industry || lead.niche || 'General'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FilesTab() {
    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#151520] p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center gap-2 hover:bg-white/5 cursor-pointer border-dashed">
                <Upload className="w-6 h-6 text-gray-500" />
                <span className="text-xs text-gray-400">Subir Archivo</span>
            </div>
            <div className="bg-[#151520] p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center gap-2 hover:bg-white/5 cursor-pointer relative group">
                <FileText className="w-8 h-8 text-blue-400" />
                <span className="text-xs text-gray-300 truncate w-full">Brief_Inicial.pdf</span>
                <button className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                    <Download className="w-5 h-5 text-white" />
                </button>
            </div>
        </div>
    )
}

// --- HELPERS ---

function ActionButton({ icon: Icon, label, color, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/5 transition-all ${color} bg-[#151520]`}
        >
            <Icon className="w-3.5 h-3.5" />
            {label}
        </button>
    )
}

function TabButton({ id, label, icon: Icon, active, set }) {
    const isActive = active === id;
    return (
        <button
            onClick={() => set(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all relative ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} />
            {label}
            {isActive && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
        </button>
    )
}

function SocialBtn({ icon: Icon, url }) {
    return (
        <a href={url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#151520] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
            <Icon className="w-5 h-5" />
        </a>
    )
}

function BriefcaseIcon({ niche }) {
    return <Wallet className="w-3.5 h-3.5 text-gray-400" />
}
