'use client';

import { useState } from 'react';
import {
    Book, FileText, Network,
    ShieldCheck, Search, Download,
    ChevronRight, BookOpen, Scale,
    Briefcase, Users, LayoutGrid,
    CheckCircle2, AlertCircle, Info,
    ArrowUpRight, Target, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDocumentation() {
    const [activeTab, setActiveTab] = useState('manuals'); // 'manuals', 'contracts', 'organigram'
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const manuals = [];

    const contracts = [];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-left">
            {/* DOCS HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-3xl">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <BookOpen className="w-7 h-7 text-indigo-500" /> Centro de Documentación & SOPs
                    </h2>
                    <p className="text-gray-400 text-sm">La Biblia Operativa y Legal de DIIC ZONE</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar procedimiento..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500/50 transition-all w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* NAVIGATION SIDEBAR */}
                <div className="lg:col-span-1 space-y-2">
                    <NavBtn active={activeTab === 'manuals'} icon={Book} label="Manuales Operativos" onClick={() => setActiveTab('manuals')} color="indigo" />
                    <NavBtn active={activeTab === 'contracts'} icon={Scale} label="Contratos & Legal" onClick={() => setActiveTab('contracts')} color="emerald" />
                    <NavBtn active={activeTab === 'organigram'} icon={Network} label="Organigrama Oficial" onClick={() => setActiveTab('organigram')} color="purple" />

                    <div className="pt-6 mt-6 border-t border-white/5">
                        <div className="bg-indigo-500/10 rounded-2xl p-4 border border-indigo-500/20">
                            <div className="flex items-center gap-2 text-indigo-400 mb-2">
                                <Target className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase">Standard Rule</span>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
                                "La estandarización es la única vía para escalar sin perder el alma de la marca."
                            </p>
                        </div>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {activeTab === 'manuals' ? (
                            <motion.div
                                key="manuals"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {manuals.length === 0 && (
                                    <div className="md:col-span-2 py-20 text-center text-gray-500 font-bold italic border border-white/5 rounded-[32px] bg-[#0A0A12]">
                                        <BookOpen className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-20" />
                                        No hay manuales operativos registrados aún.
                                    </div>
                                )}
                                {manuals.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase())).map((m) => (
                                    <ManualCard key={m.id} data={m} onClick={() => setSelectedDoc(m)} />
                                ))}
                            </motion.div>
                        ) : activeTab === 'contracts' ? (
                            <motion.div
                                key="contracts"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-[#0A0A12] border border-white/10 rounded-3xl overflow-hidden"
                            >
                                <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Repositorio Legal Central</h3>
                                </div>
                                <div className="p-2">
                                    {contracts.length === 0 && (
                                        <div className="py-12 text-center text-gray-600 font-bold italic">
                                            No hay documentos legales cargados en el repositorio.
                                        </div>
                                    )}
                                    {contracts.map((c) => (
                                        <ContractRow key={c.id} data={c} />
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="organigram"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-[#0A0A12] border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center"
                            >
                                <Network className="w-12 h-12 text-indigo-500 mb-6" />
                                <h3 className="text-xl font-black text-white mb-8">Estructura Organizacional DIIC ZONE</h3>

                                <div className="space-y-4 w-full max-w-lg">
                                    <OrganNode title="DIIC Central (HQ)" role="Intelligence & Strategy" color="indigo" root={true} />
                                    <div className="w-px h-8 bg-indigo-500/20 mx-auto" />
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <OrganNode title="Admin Core" role="Finance, QA, Ops" color="emerald" />
                                            <div className="w-px h-6 bg-white/5 mx-auto" />
                                            <OrganNode title="Central Creative" role="Editors, Designers" color="blue" />
                                        </div>
                                        <div className="space-y-4">
                                            <OrganNode title="Node Directors" role="Territorial Rep" color="purple" />
                                            <div className="w-px h-6 bg-white/5 mx-auto" />
                                            <OrganNode title="Onsite Crews" role="Filmmakers, Photo" color="pink" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 border-dashed">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-loose">
                                        Escalabilidad: 1 Central Hub → ∞ Regional Nodes
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* DOCUMENT VIEWER MODAL (SIMULTAION) */}
            <AnimatePresence>
                {selectedDoc && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedDoc(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0A0A12] border border-white/10 rounded-[40px] w-full max-w-3xl max-h-[80vh] overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={`p-8 bg-${selectedDoc.color}-500/10 border-b border-white/5 flex justify-between items-center`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl bg-${selectedDoc.color}-500/10 text-${selectedDoc.color}-400`}>
                                        <selectedDoc.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase">{selectedDoc.title}</h3>
                                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mt-1">{selectedDoc.category}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                                    <LayoutGrid className="w-5 h-5 text-gray-500 rotate-45" />
                                </button>
                            </div>
                            <div className="p-12 overflow-y-auto max-h-[60vh] text-left space-y-10 custom-scrollbar">
                                {selectedDoc.content.map((item, i) => (
                                    <div key={i} className="space-y-4 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full group-hover:h-8 transition-all" />
                                            <h4 className="text-lg font-black text-white">{item.section}</h4>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed pl-4 font-medium border-l border-white/5 ml-0.5">
                                            {item.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
                                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase rounded-2xl transition-all border border-white/5 flex items-center gap-2">
                                    <Download className="w-4 h-4" /> Bajar PDF
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- HELPER COMPONENTS ---

function NavBtn({ active, icon: Icon, label, onClick, color }) {
    const colors = {
        indigo: "text-indigo-400",
        emerald: "text-emerald-400",
        purple: "text-purple-400"
    };

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${active ? 'bg-white/5 border-white/10 shadow-lg' : 'border-transparent hover:bg-white/[0.02]'}`}
        >
            <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? colors[color] : 'text-gray-500'}`} />
                <span className={`text-[11px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-gray-600'}`}>{label}</span>
            </div>
            {active && <ChevronRight className="w-4 h-4 text-white" />}
        </button>
    );
}

function ManualCard({ data, onClick }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={onClick}
            className="p-8 bg-[#0A0A12] border border-white/10 rounded-[32px] hover:border-indigo-500/30 transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-gray-400 group-hover:text-indigo-400 transition-colors">
                    <data.icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-700 group-hover:text-white transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <h3 className="text-lg font-black text-white mb-2 leading-tight">{data.title}</h3>
            <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mb-4">{data.category}</p>
            <p className="text-xs text-gray-500 leading-relaxed font-bold">{data.description}</p>
        </motion.div>
    );
}

function ContractRow({ data }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.02] transition-all group border border-transparent hover:border-white/5">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 border border-white/5">
                    <FileText className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-xs font-bold text-white mb-1 group-hover:text-indigo-200 transition-colors">{data.name}</div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase text-gray-500 tracking-tighter">{data.type} • {data.date}</span>
                        {data.status === 'Official' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                    <Download className="w-3.5 h-3.5" />
                </button>
                <button className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

function OrganNode({ title, role, color, root }) {
    const colors = {
        indigo: "border-indigo-500/40 bg-indigo-500/5 text-indigo-400",
        emerald: "border-emerald-500/40 bg-emerald-500/5 text-emerald-400",
        blue: "border-blue-500/40 bg-blue-500/5 text-blue-400",
        purple: "border-purple-500/40 bg-purple-500/5 text-purple-400",
        pink: "border-pink-500/40 bg-pink-500/5 text-pink-400"
    };

    return (
        <div className={`p-4 rounded-2xl border text-center relative ${colors[color]} ${root ? 'ring-2 ring-indigo-500 ring-offset-4 ring-offset-[#0A0A12]' : ''}`}>
            <div className="text-xs font-black uppercase tracking-widest text-white mb-1">{title}</div>
            <div className="text-[9px] font-bold opacity-70 uppercase tracking-tighter">{role}</div>
        </div>
    );
}
