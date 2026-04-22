'use client';

import { useState } from 'react';
import {
    X, Phone, MessageCircle, Calendar, Mail, MapPin, Globe,
    Facebook, Instagram, Linkedin, Clock, CheckCircle2,
    AlertCircle, FileText, Download, Upload, DollarSign,
    TrendingUp, Shield, User, Send, Paperclip, MoreVertical,
    Bot, BrainCircuit, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScheduleModal from './ScheduleModal';

export default function LeadProfileView({ lead, onClose }) {
    const [activeTab, setActiveTab] = useState('timeline');
    const [showSchedule, setShowSchedule] = useState(false);
    const [isSynced, setIsSynced] = useState(false);

    if (!lead) return null;

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
                        {lead.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{lead.name}</h2>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {lead.city || 'Ciudad de México'}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="flex items-center gap-1"><BriefcaseIcon niche={lead.niche} /> {lead.niche}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <div className="relative group/wa">
                                <ActionButton 
                                    icon={MessageCircle} 
                                    label="WhatsApp Business" 
                                    color="text-[#25D366] hover:bg-[#25D366]/10 border-[#25D366]/20" 
                                    onClick={() => window.open('https://wa.me/525512345678', '_blank')}
                                />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#25D366] text-white text-[8px] font-black uppercase rounded-lg opacity-0 group-hover/wa:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg shadow-[#25D366]/20 flex items-center gap-2">
                                    <Bot className="w-3 h-3" /> Sincronización IA Activa
                                </div>
                            </div>
                            <ActionButton 
                                icon={Phone} 
                                label="Llamar" 
                                color="text-blue-400 hover:bg-blue-400/10" 
                                onClick={() => window.open('tel:+525512345678')}
                            />
                            <ActionButton 
                                icon={Mail} 
                                label="Email" 
                                color="text-yellow-400 hover:bg-yellow-400/10" 
                                onClick={() => window.open('mailto:contacto@dentalpro.com')}
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
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(lead.status)}`}>
                            {lead.statusName || 'Nuevo Lead'}
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
                        {activeTab === 'info' && <InfoTab lead={lead} />}
                        {activeTab === 'commercial' && <CommercialTab lead={lead} />}
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
                            <span className={`text-4xl font-bold ${getScoreColor(lead.score)}`}>{lead.score}</span>
                            <span className="text-gray-500 text-sm mb-1">/ 100</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${getScoreBg(lead.score)}`} style={{ width: `${lead.score}%` }}></div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2">
                            {lead.score > 70 ? 'Alta probabilidad de cierre. Responder en < 1h.' : 'Requiere nutrición. Enviar secuencia de valor.'}
                        </p>
                    </div>

                    {/* AI Insights / Next Action */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Bot className="w-3.5 h-3.5 text-indigo-400" /> Next Best Action
                        </h4>
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
                            <p className="text-sm text-indigo-200">
                                Enviar propuesta "Plan Growth" basándose en su interés por Reels y Ads.
                            </p>
                            <button 
                                onClick={() => alert('Generando Propuesta PDF Estratégica...') }
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
                                onClick={() => alert('Añadir nueva etiqueta estratégica...')}
                                className="px-2 py-1 border border-dashed border-gray-600 rounded-md text-[10px] text-gray-500 hover:text-white hover:border-gray-400 transition-colors"
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <AnimatePresence>
                {showSchedule && (
                    <ScheduleModal 
                        lead={lead} 
                        onClose={() => setShowSchedule(false)} 
                        onSchedule={(data) => {
                            console.log('Scheduled:', data);
                            setIsSynced(true);
                            // Visual feedback
                            const toast = document.createElement('div');
                            toast.innerText = `Cita agendada para el ${data.date} a las ${data.time}. Sincronizado con Google Calendar.`;
                            toast.className = "fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest z-[100] animate-bounce";
                            document.body.appendChild(toast);
                            setTimeout(() => toast.remove(), 4000);
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
                    <p className="text-sm text-yellow-100/80 italic">Cliente potencial alto valore. Tiene 3 sucursales. Prioridad para agendar llamada esta semana.</p>
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

function InfoTab({ lead }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <InfoField label="Email" value="contacto@dentalpro.com" icon={Mail} />
                <InfoField label="Teléfono" value="+52 55 1234 5678" icon={Phone} />
                <InfoField label="Empresa" value="Dental Pro S.A." icon={Shield} />
                <InfoField label="Sitio Web" value="www.dentalpro.com" icon={Globe} />
            </div>

            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Redes Sociales</h4>
                <div className="flex gap-3">
                    <SocialBtn icon={Instagram} url="#" />
                    <SocialBtn icon={Facebook} url="#" />
                    <SocialBtn icon={Linkedin} url="#" />
                </div>
            </div>
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Dirección</h4>
                <div className="bg-[#151520] p-3 rounded-xl border border-white/5 flex gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <p className="text-sm text-gray-300">Av. Reforma 222, CDMX, México</p>
                </div>
            </div>
        </div>
    )
}

function CommercialTab({ lead }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-center">
                    <p className="text-xs text-emerald-400 uppercase font-bold mb-1">Valor Potencial</p>
                    <p className="text-2xl font-bold text-emerald-300">${lead.value ? lead.value.toLocaleString() : '0'}</p>
                </div>
                <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 text-center">
                    <p className="text-xs text-indigo-400 uppercase font-bold mb-1">Probabilidad</p>
                    <p className="text-2xl font-bold text-indigo-300">75%</p>
                </div>
            </div>

            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Intereses</h4>
                <div className="bg-[#151520] p-4 rounded-xl border border-white/5 space-y-2">
                    {['Gestión Redes Sociales', 'Campañas Ads', 'Diseño Web'].map(service => (
                        <div key={service} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm text-gray-300">{service}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Historial de Propuestas</h4>
                <div className="space-y-2">
                    <div className="bg-[#151520] p-3 rounded-xl border border-white/5 flex justify-between items-center hover:bg-white/5 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm text-white font-bold">Propuesta_Growth_v1.pdf</p>
                                <p className="text-[10px] text-gray-500">Enviado hace 2 días</p>
                            </div>
                        </div>
                        <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">Vista</span>
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

function InfoField({ label, value, icon: Icon }) {
    return (
        <div className="bg-[#151520] p-3 rounded-xl border border-white/5">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Icon className="w-3 h-3" /> {label}</p>
            <p className="text-sm text-white font-medium truncate">{value}</p>
        </div>
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

function getStatusColor(status) {
    if (status === 'won') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (status === 'lost') return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
}

function getScoreColor(score) {
    if (score >= 80) return 'text-red-500'; // Hot
    if (score >= 50) return 'text-orange-500'; // Warm
    return 'text-blue-500'; // Cold
}

function getScoreBg(score) {
    if (score >= 80) return 'bg-red-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-blue-500';
}
