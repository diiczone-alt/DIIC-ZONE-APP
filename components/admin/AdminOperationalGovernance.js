'use client';

import { useState, useEffect } from 'react';
import { 
    Settings, Users, DollarSign, Activity, 
    Save, Edit3, Trash2, Plus, ArrowLeft, 
    Zap, Target, ShieldCheck, RefreshCw,
    Search, Filter, ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { agencyService } from '@/services/agencyService';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminOperationalGovernance() {
    const [activeSection, setActiveSection] = useState('rates'); // 'rates', 'payroll', 'ledger'
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        rates: [],
        team: [],
        ledger: []
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [ratesData, teamData, scaleData] = await Promise.all([
                supabase.from('production_rates').select('*').order('name'),
                agencyService.getTeam(),
                agencyService.getScaleData()
            ]);

            setData({
                rates: ratesData.data || [],
                team: teamData || [],
                ledger: scaleData?.production_ledger || []
            });
        } catch (err) {
            console.error("Error loading Governance data:", err);
            toast.error("Error al cargar datos core");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRate = async (id, field, value) => {
        try {
            const { error } = await supabase
                .from('production_rates')
                .update({ [field]: value })
                .eq('id', id);
            
            if (error) throw error;
            toast.success("Tasa actualizada correctamente");
            loadData();
        } catch (err) {
            toast.error("Error al actualizar tasa");
        }
    };

    const handleUpdateSalary = async (id, salary) => {
        try {
            const { error } = await supabase
                .from('team')
                .update({ salary: Number(salary) })
                .eq('id', id);
            
            if (error) throw error;
            toast.success("Salario actualizado");
            loadData();
        } catch (err) {
            toast.error("Error al actualizar salario");
        }
    };

    if (loading) {
        return (
            <div className="h-[600px] flex flex-col items-center justify-center gap-4">
                 <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Sincronizando Gobernanza...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
            {/* GOVERNANCE HEADER */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 p-10 rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20">
                                <Settings className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Gobernanza Operativa</h2>
                        </div>
                        <p className="text-gray-400 text-sm font-medium italic pl-16">Panel Maestro de Control de Costos, Nómina y Tasas Reales de DIIC ZONE.</p>
                    </div>
                    
                    <div className="flex gap-3 bg-black/20 p-2 rounded-[2rem] border border-white/5">
                        <NavTab active={activeSection === 'rates'} onClick={() => setActiveSection('rates')} icon={Zap} label="Tasas Producción" />
                        <NavTab active={activeSection === 'payroll'} onClick={() => setActiveSection('payroll')} icon={Users} label="Nómina Staff" />
                        <NavTab active={activeSection === 'ledger'} onClick={() => setActiveSection('ledger')} icon={ClipboardList} label="Libro Mayor" />
                    </div>
                </div>
            </div>

            <main className="min-h-[600px]">
                <AnimatePresence mode="wait">
                    {activeSection === 'rates' && (
                        <motion.div key="rates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                             <div className="flex justify-between items-end px-4">
                                 <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Editor de Tasas Maestro</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Determina cuánto paga la agencia por cada formato de contenido</p>
                                 </div>
                                 <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                                     <Plus className="w-3.5 h-3.5" /> Nueva Tasa
                                 </button>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                 {data.rates.map((rate) => (
                                     <RateCard key={rate.id} rate={rate} onSave={(val) => handleUpdateRate(rate.id, 'cost_internal', val)} />
                                 ))}
                             </div>
                        </motion.div>
                    )}

                    {activeSection === 'payroll' && (
                        <motion.div key="payroll" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                            <div className="space-y-1 px-4 text-left">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Gestión de Nómina Real</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Modifica salarios y cargos para cálculos de rentabilidad automáticos</p>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/5">
                                            <th className="px-10 py-5 text-[9px] font-black uppercase text-gray-500 tracking-[0.3em]">Talento HQ</th>
                                            <th className="px-10 py-5 text-[9px] font-black uppercase text-gray-500 tracking-[0.3em]">Cargo / Rol</th>
                                            <th className="px-10 py-5 text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] text-right">Salario Mensual</th>
                                            <th className="px-10 py-5 text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {data.team.map((member) => (
                                            <TeamControlRow key={member.id} member={member} onSave={(val) => handleUpdateSalary(member.id, val)} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeSection === 'ledger' && (
                        <motion.div key="ledger" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                             <div className="space-y-1 px-4">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Libro Mayor Operativo</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Trazabilidad total de tareas, clientes y costos generados</p>
                             </div>

                             <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden">
                                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-left">
                                        <thead className="sticky top-0 bg-[#0A0A1F] z-10">
                                            <tr className="border-b border-white/10">
                                                <th className="px-10 py-6 text-[9px] font-black uppercase text-gray-600 tracking-[0.3em]">Tarea / Auditoría</th>
                                                <th className="px-10 py-6 text-[9px] font-black uppercase text-gray-600 tracking-[0.3em] text-center">Cliente</th>
                                                <th className="px-10 py-6 text-[9px] font-black uppercase text-gray-600 tracking-[0.3em] text-right">Costo Interno</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {data.ledger.map((item, i) => (
                                                <tr key={i} className="hover:bg-white/[0.03] transition-all group">
                                                    <td className="px-10 py-6">
                                                        <p className="text-sm font-black text-white italic uppercase tracking-tight">{item.title}</p>
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.format}</p>
                                                    </td>
                                                    <td className="px-10 py-6 text-center">
                                                        <span className="text-[10px] font-black text-gray-400 bg-white/5 px-4 py-1 rounded-full border border-white/5 uppercase tracking-widest">{item.client}</span>
                                                    </td>
                                                    <td className="px-10 py-6 text-right">
                                                        <span className="text-xl font-black text-emerald-400 italic">${item.cost}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {data.ledger.length === 0 && (
                                                 <tr>
                                                     <td colSpan="3" className="py-20 text-center text-gray-500 font-bold italic">No hay tareas auditadas en el periodo actual</td>
                                                 </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                             </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function NavTab({ active, onClick, icon: Icon, label }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] transition-all duration-500 ${active ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
        >
            <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : ''}`} />
            <span className="font-black text-[10px] uppercase tracking-widest leading-none">{label}</span>
        </button>
    );
}

function RateCard({ rate, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(rate.cost_internal);

    return (
        <motion.div whileHover={{ y: -5 }} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 relative group">
            <div className="absolute top-6 right-6 flex gap-2">
                 <button onClick={() => {
                     if (isEditing) {
                         onSave(tempValue);
                         setIsEditing(false);
                     } else {
                         setIsEditing(true);
                     }
                 }} className={`p-2.5 rounded-xl border transition-all ${isEditing ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}>
                     {isEditing ? <CheckCircle2 className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                 </button>
            </div>

            <div className="space-y-4 pt-2">
                <div className="p-3 w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">{rate.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Costo Interno por Unidad</p>
                </div>

                <div className="pt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white italic tracking-tighter">$</span>
                    {isEditing ? (
                        <input 
                            type="number" 
                            autoFocus
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="w-32 bg-white/10 border border-white/20 rounded-xl px-4 py-2 font-black text-3xl italic text-white outline-none focus:border-indigo-500 transition-all"
                        />
                    ) : (
                        <span className="text-5xl font-black text-white italic tracking-tighter leading-none group-hover:text-indigo-400 transition-colors">{rate.cost_internal}</span>
                    )}
                </div>
            </div>
            {isEditing && (
                <p className="mt-4 text-[9px] text-emerald-400 font-bold uppercase tracking-widest italic animate-pulse">Guardando cambios en Base de Datos...</p>
            )}
        </motion.div>
    );
}

function TeamControlRow({ member, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(member.salary || 0);

    return (
        <tr className="group hover:bg-white/[0.04] transition-all">
            <td className="px-10 py-7">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-sm font-black text-white">
                        {member.name[0]}
                    </div>
                    <div>
                        <p className="text-sm font-black text-white uppercase italic tracking-tight mb-1">{member.name}</p>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Status: Activo</p>
                    </div>
                </div>
            </td>
            <td className="px-10 py-7">
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-xl">{member.role}</span>
            </td>
            <td className="px-10 py-7 text-right">
                <div className="flex items-baseline justify-end gap-2">
                    <span className="text-lg font-black text-gray-500 italic">$</span>
                    {isEditing ? (
                        <input 
                            type="number" 
                            autoFocus
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-1 text-right font-black text-2xl italic text-white focus:border-indigo-500 outline-none"
                        />
                    ) : (
                        <span className="text-3xl font-black text-white italic tracking-tighter group-hover:text-emerald-400 transition-colors">{Number(member.salary || 0).toLocaleString()}</span>
                    )}
                </div>
            </td>
            <td className="px-10 py-7 text-right">
                <button onClick={() => {
                    if (isEditing) {
                        onSave(tempValue);
                        setIsEditing(false);
                    } else {
                        setIsEditing(true);
                    }
                }} className={`px-6 py-2 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${isEditing ? 'bg-emerald-500 text-black' : 'bg-white/5 border border-white/10 text-gray-500 hover:text-white'}`}>
                    {isEditing ? 'Confirmar' : 'Modificar'}
                </button>
            </td>
        </tr>
    );
}

function CheckCircle2(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
