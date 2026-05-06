'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Search, MessageSquare, Calendar, 
    Bell, Star, Zap, Shield, Phone,
    Mail, Globe, CheckCircle2, AlertCircle,
    ChevronRight, Plus, Filter, MoreHorizontal,
    DollarSign, Activity, Target, Flame
} from 'lucide-react';
import { useState } from 'react';

export default function ControlCenterOverlay({ isOpen, onClose, initialTab = 'messages' }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [selectedItem, setSelectedItem] = useState(null);

    if (!isOpen) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[1000] bg-[#05050A]/95 backdrop-blur-2xl flex flex-col overflow-hidden"
        >
            {/* FLOATING CLOSE BUTTON */}
            <button 
                onClick={onClose}
                className="absolute top-10 right-12 z-[1100] p-4 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 rounded-[1.5rem] text-gray-500 transition-all active:scale-95 shadow-2xl backdrop-blur-md"
            >
                <X className="w-6 h-6" />
            </button>

            {/* FLOATING TABS (Integrated) */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[1100]">
                <nav className="flex items-center bg-[#0E0E18]/80 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    <TabButton 
                        active={activeTab === 'messages'} 
                        onClick={() => setActiveTab('messages')}
                        icon={<MessageSquare className="w-4 h-4" />}
                        label="Comunicaciones"
                    />
                    <TabButton 
                        active={activeTab === 'calendar'} 
                        onClick={() => setActiveTab('calendar')}
                        icon={<Calendar className="w-4 h-4" />}
                        label="Cronograma"
                    />
                    <TabButton 
                        active={activeTab === 'alerts'} 
                        onClick={() => setActiveTab('alerts')}
                        icon={<Bell className="w-4 h-4" />}
                        label="Inteligencia"
                    />
                </nav>
            </div>

            {/* 2. THREE-COLUMN COMMAND VIEW */}
            <main className="flex-1 flex overflow-hidden pt-32">
                
                {/* --- COLUMN 1: CONTEXT SIDEBAR (20%) --- */}
                <aside className="w-[20%] border-r border-white/5 flex flex-col overflow-hidden bg-black/20">
                    <div className="p-8">
                        <div className="relative group mb-8">
                            <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Filtrar nodo..." 
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-[10px] text-white uppercase tracking-widest font-black focus:outline-none focus:border-indigo-500/30"
                            />
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Directorio Activo</h3>
                            <Plus className="w-3.5 h-3.5 text-gray-700 cursor-pointer hover:text-white" />
                        </div>

                        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-350px)] no-scrollbar">
                            {activeTab === 'messages' && <ContactList selectedId={selectedItem} onSelect={setSelectedItem} />}
                            {activeTab === 'calendar' && <CalendarMiniView />}
                        </div>
                    </div>
                </aside>

                {/* --- COLUMN 2: MAIN WORKSPACE (55%) --- */}
                <section className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Background Gradients */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600 rounded-full blur-[150px]" />
                        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-600 rounded-full blur-[150px]" />
                    </div>

                    <div className="flex-1 relative z-10 p-12 overflow-y-auto custom-scrollbar">
                        {activeTab === 'messages' && <ChatWorkspace selectedMember={selectedItem} />}
                        {activeTab === 'calendar' && <FullAgendaView />}
                        {activeTab === 'alerts' && <IntelligenceFeed />}
                    </div>
                </section>

                {/* --- COLUMN 3: INTELLIGENCE & STATS (25%) --- */}
                <aside className="w-[25%] border-l border-white/5 p-12 bg-black/40 flex flex-col gap-8 overflow-y-auto no-scrollbar">
                    {activeTab === 'messages' && <MemberIntelligence selectedMember={selectedItem} />}
                    {activeTab === 'calendar' && <EventIntelligence />}
                    {activeTab === 'alerts' && <SystemHealthStats />}
                </aside>

            </main>
        </motion.div>
    );
}

/* --- COMPONENTS HELPER --- */

function TabButton({ active, onClick, icon, label }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all duration-300 ${
                active 
                ? 'bg-white text-black shadow-2xl shadow-white/10' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
        >
            {icon}
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </button>
    );
}

function ContactList({ onSelect, selectedId }) {
    const contacts = [
        { id: 1, name: 'Jessie Caballero', role: 'Estratega Senior', status: 'En reunión', avatar: 'JC', color: 'bg-indigo-500' },
        { id: 2, name: 'David Ruiz', role: 'Editor Video', status: 'Online', avatar: 'DR', color: 'bg-pink-500' },
        { id: 3, name: 'Elena Solís', role: 'Diseño Pro', status: 'Offline', avatar: 'ES', color: 'bg-amber-500' },
    ];

    return (
        <div className="space-y-2">
            {contacts.map(c => (
                <button 
                    key={c.id} 
                    onClick={() => onSelect(c)}
                    className={`w-full p-5 rounded-[2rem] border transition-all text-left flex items-center gap-4 group ${
                        selectedId?.id === c.id 
                        ? 'bg-white text-black border-white shadow-xl' 
                        : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-2xl ${c.color} flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:rotate-6 transition-transform italic`}>
                        {c.avatar}
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase italic tracking-tighter leading-tight">{c.name}</h4>
                        <p className={`text-[8px] font-black uppercase tracking-widest mt-1 ${selectedId?.id === c.id ? 'text-gray-600' : 'text-gray-500'}`}>{c.role}</p>
                    </div>
                </button>
            ))}
        </div>
    );
}

function ChatWorkspace({ selectedMember }) {
    if (!selectedMember) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5">
                    <MessageSquare className="w-12 h-12 text-gray-700" />
                </div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Selecciona una Conexión</h3>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-4">Inicia una comunicación encriptada con el equipo</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-[2rem] ${selectedMember.color} flex items-center justify-center text-white text-3xl font-black italic shadow-2xl`}>
                        {selectedMember.avatar}
                    </div>
                    <div>
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">{selectedMember.name}</h2>
                        <div className="flex items-center gap-4 mt-3">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">{selectedMember.role}</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{selectedMember.status}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="p-5 bg-white/5 border border-white/10 rounded-3xl text-white hover:bg-white/10 transition-all"><Phone className="w-5 h-5" /></button>
                    <button className="p-5 bg-white/5 border border-white/10 rounded-3xl text-white hover:bg-white/10 transition-all"><Globe className="w-5 h-5" /></button>
                </div>
            </div>

            {/* Bubble Chat Area */}
            <div className="flex-1 space-y-8 mb-12">
                <div className="flex gap-4 max-w-2xl">
                    <div className="w-10 h-10 rounded-xl bg-white/10 shrink-0" />
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] rounded-tl-none">
                        <p className="text-sm text-gray-300 leading-relaxed font-medium">Hola equipo, ¿cómo va el montaje del reel de Nike? El cliente está esperando una previa para hoy a las 5pm.</p>
                        <p className="text-[9px] text-gray-600 font-bold uppercase mt-3">12:30 PM — David R.</p>
                    </div>
                </div>
                <div className="flex gap-4 max-w-2xl ml-auto flex-row-reverse">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500 shrink-0" />
                    <div className="bg-indigo-600 p-6 rounded-[2rem] rounded-tr-none shadow-xl shadow-indigo-600/20">
                        <p className="text-sm text-white leading-relaxed font-medium">¡Hola! Ya estoy terminando la colorización. En 30 minutos lo subo a Drive para que lo revises.</p>
                        <p className="text-[9px] text-indigo-200 font-bold uppercase mt-3 italic tracking-widest">Leído — 12:45 PM</p>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="relative group">
                <input 
                    type="text" 
                    placeholder="Escribe un mensaje táctico..."
                    className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-6 pl-8 pr-24 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all shadow-2xl"
                />
                <button className="absolute right-3 top-3 bottom-3 px-8 bg-indigo-500 hover:bg-indigo-400 text-white rounded-[2rem] shadow-xl shadow-indigo-500/20 transition-all group-hover:scale-105 active:scale-95">
                    <Zap className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

function MemberIntelligence({ selectedMember }) {
    if (!selectedMember) return <div className="text-center py-20 text-gray-700 font-black uppercase text-[10px] tracking-widest">Inteligencia no cargada</div>;

    return (
        <div className="space-y-10">
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20"><Shield className="w-12 h-12" /></div>
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6 italic font-mono">Performance Node</h3>
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Eficacia Operativa</span>
                        <span className="text-3xl font-black text-white italic">94%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[94%]" />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2">Interés en Proyectos</h3>
                <div className="space-y-4">
                    <ProjectChip label="Campaña Nike Reel" value="$4,500" active />
                    <ProjectChip label="VFX Empresa Tech" value="$2,100" />
                    <ProjectChip label="Motion Graphics" value="$1,800" />
                </div>
            </div>

            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4">
                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Acciones Rápidas</h4>
                <div className="grid grid-cols-2 gap-3">
                    <QuickActionButton icon={<Star className="w-3 h-3" />} label="Premium" />
                    <QuickActionButton icon={<Target className="w-3 h-3" />} label="Asignar" />
                    <QuickActionButton icon={<Mail className="w-3 h-3" />} label="Email" />
                    <QuickActionButton icon={<Flame className="w-3 h-3" />} label="Urgente" />
                </div>
            </div>
        </div>
    );
}

function ProjectChip({ label, value, active = false }) {
    return (
        <div className={`p-5 rounded-2xl border flex items-center justify-between group transition-all cursor-pointer ${
            active ? 'bg-indigo-500 text-white border-indigo-400 shadow-xl' : 'bg-white/5 border-white/5 hover:border-white/10'
        }`}>
            <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-white/20' : 'bg-indigo-500/10'}`}>
                    <Target className={`w-4 h-4 ${active ? 'text-white' : 'text-indigo-400'}`} />
                </div>
                <span className="text-[11px] font-black uppercase italic tracking-tighter">{label}</span>
            </div>
            <span className={`text-[10px] font-black ${active ? 'text-white' : 'text-emerald-400'}`}>{value}</span>
        </div>
    );
}

function QuickActionButton({ icon, label }) {
    return (
        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[9px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-all">
            {icon} {label}
        </button>
    );
}

function CalendarMiniView() { return <div className="text-white text-center py-10 opacity-30 italic">Mini Calendar Coming...</div>; }
function FullAgendaView() {
    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const days = ['Lunes 04', 'Martes 05', 'Miércoles 06', 'Jueves 07', 'Viernes 08'];

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Cronograma Semanal</h2>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-3">Operaciones — Mayo 2026</p>
                </div>
                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                    <button className="px-6 py-2 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest">Semana</button>
                    <button className="px-6 py-2 rounded-xl text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Mes</button>
                </div>
            </div>

            <div className="flex-1 border border-white/5 rounded-[3rem] bg-black/40 overflow-hidden flex flex-col">
                <div className="flex border-b border-white/5 bg-white/[0.02]">
                    <div className="w-20 border-r border-white/5" />
                    {days.map(day => (
                        <div key={day} className="flex-1 p-6 text-center border-r border-white/5 last:border-r-0">
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">{day}</span>
                        </div>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    {hours.map(hour => (
                        <div key={hour} className="flex border-b border-white/[0.02] min-h-[100px]">
                            <div className="w-20 p-4 text-right border-r border-white/5">
                                <span className="text-[9px] font-mono text-gray-600">{hour}</span>
                            </div>
                            {[1, 2, 3, 4, 5].map(day => (
                                <div key={day} className="flex-1 border-r border-white/5 last:border-r-0 relative p-2">
                                    {day === 3 && hour === '09:00' && (
                                        <div className="absolute inset-2 bg-indigo-500 rounded-3xl p-4 shadow-xl shadow-indigo-500/20 z-10 border border-indigo-400 group cursor-pointer hover:scale-[1.02] transition-transform">
                                            <h4 className="text-[11px] font-black text-white uppercase italic truncate">Rodaje Nike</h4>
                                            <p className="text-[8px] text-indigo-200 font-bold mt-1">Estudio Central</p>
                                        </div>
                                    )}
                                    {day === 2 && hour === '14:00' && (
                                        <div className="absolute inset-2 h-[200%] bg-emerald-500 rounded-3xl p-4 shadow-xl shadow-emerald-500/20 z-10 border border-emerald-400 cursor-pointer hover:scale-[1.02] transition-transform">
                                            <h4 className="text-[11px] font-black text-white uppercase italic truncate">Edición Tech</h4>
                                            <p className="text-[8px] text-emerald-200 font-bold mt-1">Post-Producción</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
function IntelligenceFeed() { return <div className="text-white text-center py-20 opacity-30 italic">Intelligence Feed Coming...</div>; }
function EventIntelligence() { return <div className="text-white text-center py-10 opacity-30 italic">Event Details Coming...</div>; }
function SystemHealthStats() { return <div className="text-white text-center py-10 opacity-30 italic">Health Stats Coming...</div>; }
