'use client';

import { useState } from 'react';
import {
    FileText, DollarSign, CheckCircle2,
    Clock, Shield, Signature,
    Download, Briefcase, Calculator,
    ArrowUpRight, History, Calendar,
    AlertCircle, Scale, PenTool, Users,
    ChevronRight, Wallet, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminTalentPayments() {
    const [view, setView] = useState('settlements'); // 'settlements', 'contracts', 'pricing'

    const pricingTable = [
        { type: "Reel", price: 5, category: "Video" },
        { type: "Video Estándar", price: 10, category: "Video" },
        { type: "Video Premium", price: 20, category: "Video" },
        { type: "Diseño (Pack)", price: 8, category: "Design" },
        { type: "Foto Edición", price: 5, category: "Design" },
    ];

    const settlements = [];
    const contracts = [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left pb-10">

            {/* 🏗 HEADER & NAVIGATION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                        <Wallet className="w-7 h-7 text-emerald-500" /> Contratos & Pagos del Talento
                    </h2>
                    <p className="text-gray-400 text-xs font-medium">Gestión legal y financiera automatizada para la red creativa.</p>
                </div>
                <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
                    <TabBtn label="Liquidación" active={view === 'settlements'} onClick={() => setView('settlements')} />
                    <TabBtn label="Contratos" active={view === 'contracts'} onClick={() => setView('contracts')} />
                    <TabBtn label="Tarifario" active={view === 'pricing'} onClick={() => setView('pricing')} />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'settlements' && <SettlementsView key="settlements" data={settlements} />}
                {view === 'contracts' && <ContractsView key="contracts" />}
                {view === 'pricing' && <PricingView key="pricing" data={pricingTable} />}
            </AnimatePresence>
        </div>
    );
}

// --- VIEWS ---

function SettlementsView({ data }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 💳 RESUMEN DE CICLO */}
                <div className="lg:col-span-2 bg-[#0A0A12] border border-white/10 rounded-[40px] p-8">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-lg font-black text-white uppercase flex items-center gap-3">
                            <History className="w-6 h-6 text-emerald-500" /> Liquidaciones Pendientes (Ciclo 15-20)
                        </h3>
                        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                            Pagar Todo el Ciclo
                        </button>
                    </div>

                    <div className="space-y-6">
                        {data.length === 0 && (
                            <div className="py-20 text-center text-gray-500 font-bold italic border border-white/5 rounded-[32px]">
                                No hay liquidaciones pendientes para este ciclo.
                            </div>
                        )}
                        {data.map((settlement) => (
                            <SettlementRow key={settlement.id} settlement={settlement} />
                        ))}
                    </div>
                </div>

                {/* 🤖 REGLAS FINANCIERAS */}
                <div className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-8 h-fit">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                        <Scale className="w-4 h-4" /> Reglas de Pago IA
                    </h3>
                    <div className="space-y-4">
                        <RuleItem icon={CheckCircle2} label="Aprobación Obligatoria" desc="Solo se liquidan proyectos con firma del cliente." color="emerald" />
                        <RuleItem icon={Clock} label="Ciclo 15-20" desc="Procesamiento automático de facturación." color="blue" />
                        <RuleItem icon={Shield} label="Retenciones" desc="Aplica por penalizaciones de tiempo/calidad." color="red" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function ContractsView() {
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedRole, setSelectedRole] = useState('EDITOR');
    const [contractStatus, setContractStatus] = useState('IDLE');
    const [contractData, setContractData] = useState(null);

    const handleGenerate = () => {
        if (!selectedMember) {
            toast.error("Selecciona un creativo");
            return;
        }
        
        setContractStatus('GENERATING');
        
        setTimeout(() => {
            const newContract = {
                id: `TAL-${Math.floor(Math.random()*90000) + 10000}`,
                date: new Date().toLocaleDateString(),
                name: selectedMember.name,
                role: selectedRole,
                hash: 'TALENT_SECURE_' + Math.random().toString(36).substring(7).toUpperCase(),
            };
            setContractData(newContract);
            setContractStatus('READY');
            toast.success("Contrato de Talento Generado");
        }, 1500);
    };

    const ROLES = [
        { id: 'EDITOR', name: 'Editor de Video', desc: 'Edición y post-producción de contenido.' },
        { id: 'FILMMAKER', name: 'Filmmaker', desc: 'Producción audiovisual y rodajes en campo.' },
        { id: 'DESIGNER', name: 'Diseñador Gráfico', desc: 'Diseño de piezas estáticas y carruseles.' },
        { id: 'CM', name: 'Community Manager', desc: 'Gestión de redes y atención estratégica.' }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left"
        >
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#0A0A12] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                            <User className="w-3 h-3" /> 1. Nombre del Creativo
                        </label>
                        <input 
                            type="text"
                            placeholder="Nombre legal completo..."
                            onChange={(e) => setSelectedMember({ name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:border-purple-500 transition-all"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                            <Briefcase className="w-3 h-3" /> 2. Rol / Especialidad
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            {ROLES.map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                    className={`p-4 rounded-2xl border transition-all text-left ${selectedRole === role.id ? 'bg-purple-500/20 border-purple-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'}`}
                                >
                                    <div className="text-xs font-black uppercase italic mb-1">{role.name}</div>
                                    <p className="text-[9px] font-medium leading-tight opacity-70">{role.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={contractStatus === 'GENERATING'}
                        className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl"
                    >
                        {contractStatus === 'GENERATING' ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Sellar Contrato Staff'}
                    </button>
                </div>
            </div>

            <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                    {contractStatus === 'READY' ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="bg-white p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-gray-900 min-h-[600px]"
                        >
                             <div className="relative z-10 space-y-10">
                                <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8">
                                    <div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">DIIC ZONE • Acuerdo de Staff</h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Registro Legal ID: {contractData.id}</p>
                                    </div>
                                    <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase">Vinculación Oficial</span>
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Especialista (Firmante)</p>
                                        <p className="text-sm font-black uppercase">{contractData.name}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Designación Técnica</p>
                                        <p className="text-sm font-black uppercase">{contractData.role}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase border-b border-gray-100 pb-2">Cláusulas de Colaboración Operativa</h4>
                                    <div className="space-y-4 text-[11px] leading-relaxed font-medium text-gray-600 italic">
                                        <p><strong>1. PRESTACIÓN DE SERVICIOS:</strong> El especialista se compromete a la ejecución de tareas audiovisuales y creativas bajo demanda de DIIC ZONE HQ.</p>
                                        <p><strong>2. ESTÁNDARES DE CALIDAD:</strong> Toda entrega debe ajustarse a los manuales de producción y tiempos de entrega estipulados en el tablero de operaciones.</p>
                                        <p><strong>3. PROPIEDAD Y CONFIDENCIALIDAD:</strong> El contenido generado es propiedad patrimonial de DIIC ZONE. Se prohíbe la divulgación de procesos internos.</p>
                                    </div>
                                </div>

                                <div className="pt-24 flex justify-between items-end border-t-2 border-gray-100">
                                    <div className="space-y-4">
                                        <div className="w-48 h-12 border-b-2 border-gray-900/20 flex flex-col items-center justify-center">
                                            <p className="text-[8px] font-black text-gray-400 uppercase">Firma Digital DIIC HQ</p>
                                            <p className="font-serif italic text-lg text-purple-600">CERTIFIED_OS</p>
                                        </div>
                                        <p className="text-[9px] font-black uppercase">Director de Operaciones</p>
                                    </div>
                                    <div className="space-y-4 text-right">
                                        <div className="w-48 h-12 border-b-2 border-gray-900/20 flex items-center justify-center">
                                            <p className="text-[8px] font-black text-gray-400 uppercase italic">Huella Digital del Especialista</p>
                                        </div>
                                        <p className="text-[9px] font-black uppercase">Aceptación de Protocolos</p>
                                    </div>
                                </div>
                             </div>
                        </motion.div>
                    ) : (
                        <div className="h-[600px] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center gap-6 bg-white/[0.01]">
                            <PenTool className="w-16 h-16 text-white/5" />
                            <div className="text-center space-y-2">
                                <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Protocolo de Firma de Staff...</p>
                                <p className="text-[10px] text-gray-600 italic">Identifica al especialista para iniciar el blindaje de la red operativa.</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function PricingView({ data }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-8 max-w-4xl">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-black text-white uppercase flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-blue-500" /> Tarifario DIIC de Valor Creativo
                </h3>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">Actualizado 2026</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-xs font-black text-white uppercase">{item.type}</div>
                                <div className="text-[10px] text-gray-500 font-bold uppercase">{item.category}</div>
                            </div>
                        </div>
                        <div className="text-xl font-black text-emerald-500">${item.price}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// --- HELPERS ---

function SettlementRow({ settlement }) {
    return (
        <div className="bg-white/5 border border-white/5 hover:border-white/10 p-6 rounded-3xl transition-all group">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center font-black text-emerald-500 uppercase">
                        {settlement.creative.substring(0, 1)}
                    </div>
                    <div>
                        <div className="text-sm font-black text-white uppercase">{settlement.creative}</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{settlement.cycle}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-black text-white">${settlement.total}</div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${settlement.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {settlement.status === 'paid' ? 'Pagado' : 'Pendiente'}
                    </span>
                </div>
            </div>

            <div className="space-y-2 border-t border-white/5 pt-4">
                {settlement.projects.map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-400 font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {p.name}
                        </span>
                        <span className="text-white font-black">${p.amount}</span>
                    </div>
                ))}
            </div>

            {settlement.status === 'pending' && (
                <button
                    onClick={() => toast.success(`Liquidación de ${settlement.creative} enviada.`)}
                    className="w-full mt-6 py-3 bg-white/5 hover:bg-emerald-500 hover:text-black text-gray-400 font-black text-[9px] uppercase rounded-xl transition-all border border-white/5"
                >
                    Liquidar Ahora
                </button>
            )}
        </div>
    );
}

function RecentSignature({ name, date, role }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 text-xs">
            <div className="flex items-center gap-3">
                <Signature className="w-4 h-4 text-indigo-400 invisible group-hover:visible" />
                <div>
                    <div className="font-bold text-white uppercase">{name}</div>
                    <div className="text-[9px] text-gray-500 font-bold">{role}</div>
                </div>
            </div>
            <div className="text-[9px] text-gray-500 font-black uppercase">{date}</div>
        </div>
    );
}

function RuleItem({ icon: Icon, label, desc, color }) {
    const colors = {
        emerald: "text-emerald-500 bg-emerald-500/10",
        blue: "text-blue-500 bg-blue-500/10",
        red: "text-red-500 bg-red-500/10"
    };
    return (
        <div className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
            <div className={`p-2 rounded-lg ${colors[color]}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="space-y-1">
                <div className="text-xs font-black text-white uppercase">{label}</div>
                <p className="text-[10px] text-gray-500 font-medium leading-tight">{desc}</p>
            </div>
        </div>
    );
}

function TabBtn({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
        >
            {label}
        </button>
    );
}
