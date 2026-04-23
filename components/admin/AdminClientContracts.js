'use client';

import { useState, useEffect } from 'react';
import { 
    ShieldCheck, Download, Plus, Search, 
    FileText, User, Calendar, Briefcase,
    CheckCircle2, AlertCircle, RefreshCw,
    CheckSquare, PenTool, Hash, Lock, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';

export default function AdminClientContracts() {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState('CRECIMIENTO');
    const [showGenerator, setShowGenerator] = useState(false);
    const [contractStatus, setContractStatus] = useState('IDLE'); // IDLE, GENERATING, READY
    const [contractData, setContractData] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await agencyService.getClients();
            setClients(data);
        } catch (err) {
            toast.error("Error al cargar clientes");
        }
    };

    const handleGenerate = () => {
        if (!selectedClient) {
            toast.error("Selecciona un cliente primero");
            return;
        }
        
        setContractStatus('GENERATING');
        
        // Simulación de Generación Inteligente
        setTimeout(() => {
            const newContract = {
                id: `CTR-${Math.floor(Math.random()*90000) + 10000}`,
                date: new Date().toLocaleDateString(),
                client: selectedClient.name,
                plan: selectedPlan,
                amount: selectedPlan === 'ELITE' ? 900 : selectedPlan === 'AUTORIDAD' ? 500 : selectedPlan === 'CRECIMIENTO' ? 350 : 250,
                hash: 'DIIC_SECURE_' + Math.random().toString(36).substring(7).toUpperCase(),
                status: 'SIGNED'
            };
            setContractData(newContract);
            setContractStatus('READY');
            toast.success("Contrato Blindado Generado");
        }, 1500);
    };

    const PLANS = [
        { id: 'PRESENCIA', name: 'Plan Presencia', price: 250, desc: 'Ideal para marca personal inicial.' },
        { id: 'CRECIMIENTO', name: 'Plan Crecimiento', price: 350, desc: 'Enfoque en captar clientes 24/7.' },
        { id: 'AUTORIDAD', name: 'Plan Autoridad', price: 500, desc: 'Domina tu nicho con autoridad.' },
        { id: 'ELITE', name: 'Plan Élite', price: 900, desc: 'Todo el mercado y viralidad agresiva.' }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
            {/* HEADER LEGAL */}
            <div className="bg-gradient-to-r from-indigo-900/40 to-[#0A0A1F] border border-indigo-500/20 p-10 rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <ShieldCheck className="w-48 h-48 text-indigo-500" />
                </div>
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-indigo-500 rounded-3xl shadow-xl shadow-indigo-500/20">
                            <PenTool className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Generador Legal DIIC</h2>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mt-2">Plataforma de Blindaje Jurídico Corporativo</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CONFIGURACIÓN DE CONTRATO */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0A0A12] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 flex items-center gap-2">
                                <User className="w-3 h-3" /> 1. Seleccionar Cliente
                            </label>
                            <select 
                                onChange={(e) => setSelectedClient(clients.find(c => c.id === e.target.value))}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black text-white italic outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                            >
                                <option value="">--- CLIENTE REAL ---</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id} className="bg-[#0A0A1F]">{c.name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 flex items-center gap-2">
                                <Briefcase className="w-3 h-3" /> 2. Plan Estratégico
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                {PLANS.map(plan => (
                                    <button
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={`p-4 rounded-2xl border transition-all text-left group ${selectedPlan === plan.id ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'}`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-black uppercase italic tracking-wider">{plan.name}</span>
                                            <span className={`text-[10px] font-black ${selectedPlan === plan.id ? 'text-indigo-400' : 'text-gray-600'}`}>${plan.price}/mes</span>
                                        </div>
                                        <p className="text-[9px] font-medium leading-tight opacity-70">{plan.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={contractStatus === 'GENERATING'}
                            className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3"
                        >
                            {contractStatus === 'GENERATING' ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <>Garantizar Contrato IQ</>
                            )}
                        </button>
                    </div>
                </div>

                {/* VISOR DE DOCUMENTO */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {contractStatus === 'READY' ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden min-h-[700px] text-gray-900"
                            >
                                {/* WATERMARK */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none rotate-[-45deg]">
                                    <h1 className="text-[12rem] font-black">DIIC ZONE</h1>
                                </div>

                                <div className="relative z-10 space-y-10">
                                    <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8">
                                        <div>
                                            <img src="/logo-black.png" alt="DIIC ZONE" className="h-8 mb-4 grayscale opacity-50" />
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Acuerdo de Representación Estratégica</h3>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contrato No: {contractData.id}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Validado IQ</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Titular / Cliente</p>
                                            <p className="text-sm font-black uppercase">{contractData.client}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Fecha de Emisión</p>
                                            <p className="text-sm font-black">{contractData.date}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-xs font-black uppercase border-b border-gray-100 pb-2">Cláusulas de Rendimiento</h4>
                                        <div className="space-y-4 text-[11px] leading-relaxed font-medium text-gray-600 italic">
                                            <p><strong>1. OBJETO DEL CONTRATO:</strong> DIIC ZONE se compromete a ejecutar la estrategia del <strong>{contractData.plan}</strong>, enfocada en la creación de autoridad digital y captación de leads mediante contenido de alto impacto.</p>
                                            <p><strong>2. INVERSIÓN MENSUAL:</strong> El cliente acuerda un pago de <strong>${contractData.amount} USD</strong> mensuales por el servicio de representación y producción.</p>
                                            <p><strong>3. PROPIEDAD INTELECTUAL:</strong> Todo el material producido es propiedad de DIIC ZONE hasta la finalización del pago mensual correspondiente.</p>
                                        </div>
                                    </div>

                                    <div className="pt-20 flex justify-between items-end border-t-2 border-gray-100 italic">
                                        <div className="space-y-4">
                                            <div className="w-48 h-12 border-b-2 border-gray-900/20 flex flex-col items-center justify-center">
                                                <p className="text-[8px] font-black text-gray-400 uppercase">Firma Digital DIIC</p>
                                                <p className="font-serif italic text-lg text-indigo-600">{contractData.hash.substring(0, 10)}</p>
                                            </div>
                                            <p className="text-[9px] font-black uppercase">Dirección General DIIC ZONE</p>
                                        </div>
                                        <div className="space-y-4 text-right">
                                            <div className="w-48 h-12 border-b-2 border-gray-900/20 flex items-center justify-center">
                                                <p className="text-[8px] font-black text-gray-400 uppercase italic">Firma del Cliente Representado</p>
                                            </div>
                                            <p className="text-[9px] font-black uppercase">Aceptación de Términos</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-10">
                                        <button className="flex-1 bg-gray-900 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all">
                                            <Download className="w-4 h-4" /> Exportar PDF Certificado
                                        </button>
                                        <button className="flex-1 border-2 border-gray-900 text-gray-900 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">
                                            <ShieldCheck className="w-4 h-4" /> Guardar en Bóveda Legal
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[700px] border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 bg-white/[0.01]">
                                <FileText className="w-16 h-16 text-white/10" />
                                <div className="text-center space-y-2">
                                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Esperando Parámetros IQ...</p>
                                    <p className="text-[10px] text-gray-600 italic">Configura el cliente y el plan para desplegar el blindaje legal.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ label, icon: Icon, value, color }) {
    const colors = {
        emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        rose: "bg-rose-500/10 text-rose-500 border-rose-500/20"
    };

    return (
        <div className={`p-4 rounded-2xl border ${colors[color]} space-y-3`}>
            <div className="flex justify-between items-center">
                <span className="text-[8px] font-black uppercase tracking-widest opacity-60 leading-none">{label}</span>
                <Icon className="w-3.5 h-3.5 leading-none" />
            </div>
            <div className="text-xl font-black italic tracking-tighter leading-none">{value}</div>
        </div>
    );
}
