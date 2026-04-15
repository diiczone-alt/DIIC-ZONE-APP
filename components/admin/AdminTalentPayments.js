'use client';

import { useState } from 'react';
import {
    FileText, DollarSign, CheckCircle2,
    Clock, Shield, Signature,
    Download, Briefcase, Calculator,
    ArrowUpRight, History, Calendar,
    AlertCircle, Scale, PenTool, Users,
    ChevronRight, Wallet
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

    const settlements = [
        {
            id: 1,
            creative: "Fausto R.",
            projects: [
                { name: "Reel Clínica A", amount: 5, status: "approved" },
                { name: "Video Promo B", amount: 10, status: "approved" },
                { name: "Carrusel C", amount: 6, status: "approved" }
            ],
            total: 21,
            cycle: "15-20 Ene",
            status: "pending"
        },
        {
            id: 2,
            creative: "Andrea P.",
            projects: [
                { name: "Docum. Premium Nike", amount: 20, status: "approved" },
                { name: "Short Edit D", amount: 5, status: "approved" }
            ],
            total: 25,
            cycle: "15-20 Ene",
            status: "paid"
        }
    ];

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
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-10 space-y-8">
                <div className="flex items-center gap-4 text-emerald-500">
                    <FileText className="w-8 h-8" />
                    <h3 className="text-xl font-black text-white uppercase">Generador de Contratos Digitales</h3>
                </div>
                <div className="space-y-4 text-xs text-gray-400 font-medium leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5">
                    <p className="border-b border-white/10 pb-4">
                        <span className="text-white font-black">DIIC ZONE – Contrato de Prestación de Servicios Digitales.</span>
                    </p>
                    <p>Por medio del presente, el creativo se compromete a entregar piezas bajo los estándares de DIIC ZONE...</p>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>Independencia total (Sin relación laboral).</li>
                        <li>Confidencialidad absoluta de activos de clientes.</li>
                        <li>Pago sujeto a validación de calidad y tiempos.</li>
                        <li>Uso autorizado de marca DIIC ZONE para portafolio.</li>
                    </ul>
                </div>
                <div className="pt-6">
                    <button
                        onClick={() => toast.success("Contrato generado para nuevo creativo")}
                        className="w-full py-4 bg-white text-black font-black text-xs uppercase rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                    >
                        <PenTool className="w-4 h-4" /> Generar & Enviar para Firma
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[40px] p-8">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Firmas Recientes</h4>
                    <div className="space-y-3">
                        <RecentSignature name="Elena G." date="Hoy, 14:30" role="Junior Editor" />
                        <RecentSignature name="Samuel T." date="Hoy, 10:15" role="Social Media" />
                        <RecentSignature name="Marcos L." date="Ayer, 18:40" role="Web Dev" />
                    </div>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[40px] p-8">
                    <h4 className="text-xs font-black text-white mb-2">Seguridad Legal DIIC</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                        Todos los contratos incluyen firma criptográfica y sello de tiempo para validez legal en mediaciones internacionales.
                    </p>
                </div>
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
