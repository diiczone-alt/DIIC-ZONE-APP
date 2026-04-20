'use client';

import { useState, useEffect } from 'react';
import { 
    Settings, Users, DollarSign, Activity, 
    Save, Edit3, Trash2, Plus, ArrowLeft, 
    Zap, Target, ShieldCheck, RefreshCw,
    Search, Filter, ClipboardList, Building2,
    MapPin, Truck, Droplets, Home, ShoppingBag,
    CheckCircle2, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { agencyService } from '@/services/agencyService';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminOperationalGovernance() {
    const [activeSection, setActiveSection] = useState('rates'); // 'rates', 'payroll', 'saas', 'op_gov', 'ledger'
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        rates: [],
        team: [],
        ledger: [],
        expenses: [],
        branches: [],
        operatingExpenses: []
    });
    const [saving, setSaving] = useState(false);
    const [isAddingRate, setIsAddingRate] = useState(false);
    const [isAddingSaaS, setIsAddingSaaS] = useState(false);
    const [isAddingOpEx, setIsAddingOpEx] = useState(false);
    const [newRate, setNewRate] = useState({
        name: '',
        description: '',
        cost_internal: 0,
        price_sale: 0,
        unit: 'unidad'
    });
    const [newSaaS, setNewSaaS] = useState({
        name: '',
        category: 'SAAS',
        amount: 0,
        department: '',
        description: ''
    });
    const [newOpEx, setNewOpEx] = useState({
        item: '',
        amount: 0,
        branch_id: '',
        category: 'COMPRAS',
        type: 'VARIABLE',
        status: 'REQUERIMIENTO',
        description: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [ratesData, teamData, scaleData, expensesData, branchesData, opExData] = await Promise.all([
                supabase.from('production_rates').select('*').order('name'),
                agencyService.getTeam(),
                agencyService.getScaleData(),
                agencyService.getAgencyExpenses(),
                agencyService.getBranchOffices(),
                agencyService.getOperatingExpenses()
            ]);

            setData({
                rates: ratesData.data || [],
                team: teamData || [],
                ledger: scaleData?.production_ledger || [],
                expenses: expensesData || [],
                branches: branchesData || [],
                operatingExpenses: opExData || []
            });
        } catch (err) {
            console.error("Error loading Governance data:", err);
            toast.error("Error al cargar datos core");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRate = async (id, updates) => {
        try {
            const { error } = await supabase
                .from('production_rates')
                .update(updates)
                .eq('id', id);
            
            if (error) throw error;
            toast.success("Tasa actualizada correctamente");
            loadData();
        } catch (err) {
            console.error("Error updating rate:", err);
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

    const handleUpdateExpense = async (id, amount) => {
        try {
            await agencyService.updateAgencyExpense(id, { amount: Number(amount) });
            toast.success("Costo de infraestructura actualizado");
            loadData();
        } catch (err) {
            toast.error("Error al actualizar gasto");
        }
    };

    const handleCreateExpense = async (expenseData) => {
        try {
            await agencyService.addAgencyExpense(expenseData);
            toast.success("Nueva herramienta registrada");
            loadData();
        } catch (err) {
            toast.error("Error al registrar herramienta");
        }
    };

    const handleDeleteExpense = async (id) => {
        try {
            await agencyService.deleteAgencyExpense(id);
            toast.success("Herramienta eliminada");
            loadData();
        } catch (err) {
            toast.error("Error al eliminar");
        }
    };

    const handleCreateOpEx = async (exData) => {
        try {
            await agencyService.addOperatingExpense(exData);
            toast.success("Requerimiento/Gasto registrado");
            setIsAddingOpEx(false);
            setNewOpEx({
                item: '',
                amount: 0,
                branch_id: '',
                category: 'COMPRAS',
                type: 'VARIABLE',
                status: 'REQUERIMIENTO',
                description: ''
            });
            loadData();
        } catch (err) {
            toast.error("Error al registrar gasto");
        }
    };

    const handleUpdateOpExStatus = async (id, status) => {
        try {
            await agencyService.updateOperatingExpenseStatus(id, status);
            toast.success(`Estado actualizado a ${status}`);
            loadData();
        } catch (err) {
            toast.error("Error al actualizar estado");
        }
    };

    const handleDeleteOpEx = async (id) => {
        try {
            const confirmed = window.confirm("¿Estás seguro de eliminar este registro operativo? Esta acción no se puede deshacer.");
            if (!confirmed) return;
            
            await agencyService.deleteOperatingExpense(id);
            toast.success("Registro eliminado");
            loadData();
        } catch (err) {
            toast.error("Error al eliminar gasto");
        }
    };

    const handleCreateRate = async () => {
        if (!newRate.name) {
            toast.error("El nombre es obligatorio");
            return;
        }

        try {
            setSaving(true);
            const id = newRate.name.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
                .replace(/[^a-z0-9]/g, '_')
                .replace(/_+/g, '_')
                .replace(/^_|_$/g, '');
            
            const { error } = await supabase
                .from('production_rates')
                .insert({
                    id,
                    ...newRate
                });

            if (error) throw error;
            toast.success("Nuevo formato de tasa creado");
            setIsAddingRate(false);
            setNewRate({ name: '', description: '', cost_internal: 0, price_sale: 0, unit: 'unidad' });
            loadData();
        } catch (err) {
            console.error("Error creating rate:", err);
            toast.error("Error al crear nueva tasa");
        } finally {
            setSaving(false);
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
                        <NavTab active={activeSection === 'saas'} onClick={() => setActiveSection('saas')} icon={DollarSign} label="Infraestructura SaaS" />
                        <NavTab active={activeSection === 'op_gov'} onClick={() => setActiveSection('op_gov')} icon={Building2} label="Operaciones & Sedes" />
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
                                  <button 
                                     onClick={() => setIsAddingRate(true)}
                                     className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10"
                                  >
                                     <Plus className="w-3.5 h-3.5" /> Nueva Tasa
                                  </button>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                 {data.rates.map((rate) => (
                                     <RateCard key={rate.id} rate={rate} onSave={(updates) => handleUpdateRate(rate.id, updates)} />
                                 ))}
                             </div>
                        </motion.div>
                    )}

                    {activeSection === 'payroll' && (
                        <motion.div key="payroll" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                            <div className="flex justify-between items-end px-4">
                                <div className="space-y-1 text-left">
                                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Gestión de Nómina Real</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Modifica salarios y cargos para cálculos de rentabilidad automáticos</p>
                                </div>
                                <div className="bg-black/40 border border-emerald-500/30 px-6 py-3 rounded-2xl flex flex-col items-end shadow-lg shadow-emerald-500/5">
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Inversión Nómina</span>
                                    <span className="text-3xl font-black text-white italic tracking-tighter leading-none">${data.team.reduce((acc, m) => acc + (Number(m.salary) || 0), 0).toLocaleString()}</span>
                                </div>
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

                    {activeSection === 'saas' && (
                        <motion.div key="saas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                            <div className="flex justify-between items-end px-4">
                                <div className="space-y-1 text-left">
                                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Infraestructura & SaaS</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Control de herramientas, licencias y costos fijos operativos</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-black/40 border border-blue-500/30 px-6 py-3 rounded-2xl flex flex-col items-end shadow-lg shadow-blue-500/5">
                                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">Gasto SaaS Mensual</span>
                                        <span className="text-3xl font-black text-white italic tracking-tighter leading-none">${data.expenses.reduce((acc, ex) => acc + (Number(ex.amount) || 0), 0).toLocaleString()}</span>
                                    </div>
                                    <button 
                                        onClick={() => setIsAddingSaaS(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/20"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Registrar Herramienta
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/5">
                                            <th className="px-10 py-5 text-[9px] font-black uppercase text-gray-500 tracking-[0.3em]">Herramienta / Servicio</th>
                                            <th className="px-10 py-5 text-[9px] font-black uppercase text-gray-500 tracking-[0.3em]">Área de Impacto</th>
                                            <th className="px-10 py-5 text-[9px] font-black uppercase text-gray-500 tracking-[0.3em]">Descripción / Conexión</th>
                                            <th className="px-10 py-5 text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] text-right">Inversión</th>
                                            <th className="px-10 py-5 text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {data.expenses.map((expense) => (
                                            <SaaSControlRow 
                                                key={expense.id} 
                                                expense={expense} 
                                                onSave={(val) => handleUpdateExpense(expense.id, val)}
                                                onDelete={() => handleDeleteExpense(expense.id)}
                                            />
                                        ))}
                                        {data.expenses.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="py-20 text-center text-gray-500 font-bold italic text-sm">No hay herramientas registradas.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeSection === 'op_gov' && (
                        <motion.div key="op_gov" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                            {/* BRANCH OFFICES SUMMARY */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {data.branches.map((branch) => (
                                    <BranchOfficeCard key={branch.id} branch={branch} expenses={data.operatingExpenses.filter(e => e.branch_id === branch.id)} />
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
                                <div className="space-y-1 text-left">
                                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tight italic">Libro Diario de Operaciones</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Registro diario de movilidad, servicios e insumos por sede</p>
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setIsAddingOpEx(true)}
                                        className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-white/10"
                                    >
                                        <Plus className="w-4 h-4" /> Nuevo Requerimiento
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/5">
                                            <th className="px-10 py-6 text-[9px] font-black uppercase text-gray-500 tracking-[0.3em]">Fecha / Sede</th>
                                            <th className="px-10 py-6 text-[9px] font-black uppercase text-gray-500 tracking-[0.3em]">Concepto / Detalle</th>
                                            <th className="px-10 py-6 text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] text-center">Estado</th>
                                            <th className="px-10 py-6 text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] text-right">Inversión</th>
                                            <th className="px-10 py-6 text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {data.operatingExpenses.map((expense) => (
                                            <OpExControlRow 
                                                key={expense.id} 
                                                expense={expense} 
                                                onUpdateStatus={(status) => handleUpdateOpExStatus(expense.id, status)}
                                                onDelete={() => handleDeleteOpEx(expense.id)}
                                            />
                                        ))}
                                        {data.operatingExpenses.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="py-20 text-center text-gray-600 font-bold italic text-sm">Sin movimientos operativos registrados.</td>
                                            </tr>
                                        )}
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

            <AnimatePresence>
                {isAddingOpEx && (
                    <NewOpExModal 
                        data={newOpEx}
                        branches={data.branches}
                        onChange={setNewOpEx}
                        onSave={() => handleCreateOpEx(newOpEx)}
                        onClose={() => setIsAddingOpEx(false)}
                        saving={saving}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function BranchOfficeCard({ branch, expenses }) {
    const totalSpent = expenses
        .filter(e => e.status === 'PAGADO')
        .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    
    const pendingReqs = expenses.filter(e => e.status === 'REQUERIMIENTO').length;

    const levels = {
        premium: { color: 'text-amber-400', bg: 'bg-amber-400/10' },
        operativo: { color: 'text-blue-400', bg: 'bg-blue-400/10' },
        basico: { color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
    };

    const lvl = levels[branch.level] || levels.basico;

    return (
        <motion.div whileHover={{ y: -5 }} className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5">
                <MapPin className="w-20 h-20" />
            </div>
            
            <div className="relative z-10 space-y-6">
                <div>
                    <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">{branch.city}</h4>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${lvl.bg} ${lvl.color}`}>{branch.level}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Gasto Pagado</p>
                        <p className="text-lg font-black text-white italic">${totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Requerimientos</p>
                        <p className="text-lg font-black text-indigo-400 italic">{pendingReqs}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-black text-xs uppercase">
                        {branch.director?.charAt(0)}
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-gray-500 uppercase">Director de Nodo</p>
                        <p className="text-[10px] font-bold text-white uppercase">{branch.director}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function OpExControlRow({ expense, onUpdateStatus, onDelete }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const statusMap = {
        'REQUERIMIENTO': { label: 'Requerimiento', color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Clock },
        'APROBADO': { label: 'Aprobado', color: 'text-indigo-400', bg: 'bg-indigo-400/10', icon: CheckCircle2 },
        'PAGADO': { label: 'Pagado', color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: DollarSign }
    };

    const config = statusMap[expense.status] || statusMap.REQUERIMIENTO;
    const StatusIcon = config.icon;

    const categories = {
        'MOVILIZACION': { icon: Truck, color: 'text-blue-400' },
        'SERVICIOS': { icon: Droplets, color: 'text-cyan-400' },
        'ARRIENDO': { icon: Home, color: 'text-purple-400' },
        'COMPRAS': { icon: ShoppingBag, color: 'text-pink-400' },
        'MANTENIMIENTO': { icon: Settings, color: 'text-orange-400' }
    };

    const cat = categories[expense.category] || categories.COMPRAS;
    const CatIcon = cat.icon;

    return (
        <>
            <tr className={`hover:bg-white/[0.03] transition-all group cursor-pointer ${isExpanded ? 'bg-white/[0.05]' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
                <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                            <span className="text-[10px] font-black text-white">{expense.date.split('-')[2]}</span>
                            <span className="text-[8px] font-bold text-gray-600 uppercase italic">
                                {new Date(expense.date).toLocaleString('default', { month: 'short' })}
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <MapPin className="w-2.5 h-2.5 text-indigo-500" />
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{expense.branch_offices?.city || 'Sede Local'}</span>
                            </div>
                            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{expense.branch_offices?.name}</p>
                        </div>
                    </div>
                </td>
                <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${cat.color}`}>
                            <CatIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-white italic uppercase tracking-tight mb-1">{expense.item}</p>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">{expense.category} • {expense.type}</p>
                        </div>
                    </div>
                </td>
                <td className="px-10 py-6 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${config.bg} ${config.color} text-[9px] font-black uppercase tracking-widest`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {config.label}
                    </div>
                </td>
                <td className="px-10 py-6 text-right">
                    <div className="flex items-baseline justify-end gap-1">
                        <span className="text-xs font-bold text-gray-600">$</span>
                        <span className="text-2xl font-black text-white italic">{Number(expense.amount).toLocaleString()}</span>
                    </div>
                </td>
                <td className="px-10 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                        {expense.status === 'REQUERIMIENTO' && (
                            <button 
                                onClick={() => onUpdateStatus('APROBADO')}
                                className="p-3 bg-indigo-500 text-white rounded-xl hover:scale-105 transition-all shadow-lg shadow-indigo-500/20"
                                title="Aprobar Requerimiento"
                            >
                                <ShieldCheck className="w-4 h-4" />
                            </button>
                        )}
                        {expense.status === 'APROBADO' && (
                            <button 
                                onClick={() => onUpdateStatus('PAGADO')}
                                className="p-3 bg-emerald-500 text-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
                                title="Marcar como Pagado"
                            >
                                <DollarSign className="w-4 h-4" />
                            </button>
                        )}
                        <button 
                            onClick={onDelete}
                            className="p-3 bg-white/5 border border-white/10 text-gray-500 rounded-xl hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>
            <AnimatePresence>
                {isExpanded && (
                    <tr>
                        <td colSpan="5" className="px-10 py-0 border-none">
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="py-6 px-12 bg-black/20 rounded-3xl border border-white/5 my-4 space-y-4">
                                    <div className="flex items-start gap-6">
                                        <div className="space-y-1 flex-1">
                                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Notas Operativas & Detalle Interno</p>
                                            <p className="text-xs text-gray-300 font-medium leading-relaxed italic">
                                                {expense.description || "Sin notas adicionales registradas para este movimiento operativo."}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                            <p className="text-[8px] font-black text-gray-600 uppercase mb-2">Trazabilidad</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                                <span className="text-[10px] font-bold text-white uppercase italic">Auditado por AI Governance</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </td>
                    </tr>
                )}
            </AnimatePresence>
        </>
    );
}

function NewOpExModal({ data, branches, onChange, onSave, onClose, saving }) {
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-xl bg-[#0A0A1F] border border-white/10 rounded-[3rem] p-10 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Building2 className="w-48 h-48" />
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Nuevo Requerimiento</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">DIIC ZONE OPERATIONAL GOVERNANCE</p>
                        </div>
                        <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-white">
                             <ArrowLeft className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Concepto / Item</label>
                            <input 
                                value={data.item}
                                onChange={e => onChange({...data, item: e.target.value})}
                                placeholder="Ej: Arriendo Oficina"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Inversión (USD)</label>
                            <input 
                                type="number"
                                value={data.amount}
                                onChange={e => onChange({...data, amount: e.target.value})}
                                placeholder="0.00"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Sede Responsable</label>
                            <div className="relative group">
                                <select 
                                    value={data.branch_id}
                                    onChange={e => onChange({...data, branch_id: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black text-white italic outline-none focus:border-indigo-500 appearance-none cursor-pointer group-hover:bg-white/[0.08] transition-all"
                                >
                                    <option value="" className="bg-[#0A0A1F] text-gray-500 italic">SELECCIONAR SEDE...</option>
                                    {branches.map(b => (
                                        <option key={b.id} value={b.id} className="bg-[#0A0A1F] text-white italic uppercase">{b.city} - {b.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-indigo-400">
                                    <MapPin className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 block">Categoría Operativa</label>
                            <div className="relative group">
                                <select 
                                    value={data.category}
                                    onChange={e => onChange({...data, category: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black text-white italic outline-none focus:border-indigo-500 appearance-none cursor-pointer group-hover:bg-white/[0.08] transition-all"
                                >
                                    <option value="COMPRAS" className="bg-[#0A0A1F] text-white italic">COMPRAS / INSUMOS</option>
                                    <option value="MOVILIZACION" className="bg-[#0A0A1F] text-white italic">MOVILIZACIÓN / PASAJES</option>
                                    <option value="SERVICIOS" className="bg-[#0A0A1F] text-white italic">SERVICIOS (AGUA/LUZ)</option>
                                    <option value="ARRIENDO" className="bg-[#0A0A1F] text-white italic">ARRIENDO DE SEDE</option>
                                    <option value="MANTENIMIENTO" className="bg-[#0A0A1F] text-white italic">MANTENIMIENTO</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-indigo-400">
                                    <Settings className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Notas Operativas</label>
                        <textarea 
                            value={data.description}
                            onChange={e => onChange({...data, description: e.target.value})}
                            placeholder="Detalles adicionales del requerimiento..."
                            className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-xs font-medium text-gray-300 outline-none focus:border-indigo-500 h-24 resize-none"
                        />
                    </div>

                    <button 
                        onClick={onSave}
                        disabled={saving || !data.item || !data.branch_id}
                        className="w-full bg-indigo-500 text-white rounded-[2rem] py-6 font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-400 transition-all shadow-2xl shadow-indigo-500/20 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                    >
                        {saving ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <>Crear Nuevo Requerimiento</>
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
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
    const [formData, setFormData] = useState({
        name: rate.name,
        description: rate.description || '',
        cost_internal: rate.cost_internal,
        price_sale: rate.price_sale || 0,
        profit_margin: rate.profit_margin || 0
    });

    // Cálculos sugeridos en tiempo real
    const calculatedProfit = Number(formData.price_sale) - Number(formData.cost_internal);
    const marginPercent = formData.price_sale > 0 ? (calculatedProfit / formData.price_sale) * 100 : 0;

    const handleSave = () => {
        onSave(formData);
        setIsEditing(false);
    };

    return (
        <motion.div whileHover={{ y: -5 }} className="rounded-[2.5rem] bg-white/[0.03] border border-white/5 relative group overflow-hidden">
            {/* Background Accent */}
            <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${marginPercent > 40 ? 'from-emerald-500 to-teal-500' : 'from-indigo-500 to-purple-500'} opacity-50`} />
            
            <div className="p-8">
                <div className="absolute top-6 right-6 flex gap-2">
                    <button onClick={() => {
                        if (isEditing) handleSave();
                        else setIsEditing(true);
                    }} className={`p-2.5 rounded-xl border transition-all ${isEditing ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}>
                        {isEditing ? <CheckCircle2 className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    </button>
                    {isEditing && (
                        <button onClick={() => {
                            setFormData({
                                name: rate.name,
                                description: rate.description || '',
                                cost_internal: rate.cost_internal,
                                price_sale: rate.price_sale || 0,
                                profit_margin: rate.profit_margin || 0
                            });
                            setIsEditing(false);
                        }} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-red-400">
                             <ArrowLeft className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <input 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="Nombre del Formato"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm font-black text-white italic uppercase outline-none focus:border-indigo-500"
                                />
                            ) : (
                                <h4 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">{rate.name}</h4>
                            )}
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Configuración de Tasa Operativa</p>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-1">
                        {isEditing ? (
                            <textarea 
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="Descripción del servicio (ej. 'Video Reel hasta 60s')"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-400 outline-none focus:border-indigo-500 h-20 resize-none"
                            />
                        ) : (
                            <p className="text-xs text-gray-400 italic line-clamp-2 min-h-[2rem]">
                                {rate.description || 'Sin descripción detallada en base de datos.'}
                            </p>
                        )}
                    </div>

                    {/* Editor de Precios */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Inversión (Costo)</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs font-bold text-gray-600">$</span>
                                {isEditing ? (
                                    <input 
                                        type="number"
                                        value={formData.cost_internal}
                                        onChange={e => setFormData({...formData, cost_internal: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm font-black text-white outline-none"
                                    />
                                ) : (
                                    <span className="text-2xl font-black text-white italic tracking-tighter">${rate.cost_internal}</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest">Venta (Cliente)</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs font-bold text-emerald-500/50">$</span>
                                {isEditing ? (
                                    <input 
                                        type="number"
                                        value={formData.price_sale}
                                        onChange={e => setFormData({...formData, price_sale: e.target.value})}
                                        className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-2 py-1 text-sm font-black text-emerald-400 outline-none"
                                    />
                                ) : (
                                    <span className="text-2xl font-black text-emerald-400 italic tracking-tighter">${rate.price_sale || 0}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Margen Destacado */}
                    <div className="mt-4 p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between">
                        <div>
                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Margen de Ganancia</p>
                            <div className="flex items-center gap-2">
                                <span className={`text-xl font-black italic ${marginPercent > 50 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                    {isEditing ? `$${calculatedProfit}` : `$${Number(rate.price_sale || 0) - Number(rate.cost_internal)}`}
                                </span>
                                <span className="text-[9px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded italic">
                                    {marginPercent.toFixed(0)}%
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                             {isEditing ? (
                                 <div className="space-y-1">
                                     <p className="text-[8px] font-black text-gray-600 uppercase">Ajuste Manual</p>
                                     <input 
                                        type="number"
                                        value={formData.profit_margin}
                                        onChange={e => setFormData({...formData, profit_margin: e.target.value})}
                                        className="w-16 bg-white/5 border border-white/10 rounded-md px-2 py-0.5 text-[10px] font-black text-white outline-none"
                                     />
                                 </div>
                             ) : (
                                 <div className="w-8 h-8 rounded-full border-2 border-white/5 flex items-center justify-center">
                                     <DollarSign className={`w-4 h-4 ${marginPercent > 40 ? 'text-emerald-500' : 'text-gray-500'}`} />
                                 </div>
                             )}
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3"
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                        <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest italic leading-tight">Configuración en memoria... Haz clic en el círculo verde para guardar.</p>
                    </motion.div>
                )}
            </div>
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

function SaaSControlRow({ expense, onSave, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(expense.amount || 0);

    return (
        <tr className="group hover:bg-white/[0.04] transition-all">
            <td className="px-10 py-7">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sm font-black text-blue-400">
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white uppercase italic tracking-tight mb-1">{expense.name}</p>
                        <p className="text-[9px] font-bold text-blue-400/50 uppercase tracking-widest leading-none">{expense.category}</p>
                    </div>
                </div>
            </td>
            <td className="px-10 py-7">
                 <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${expense.department ? 'bg-indigo-500' : 'bg-gray-700'} animate-pulse`} />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{expense.department || 'GENERAL'}</span>
                 </div>
            </td>
            <td className="px-10 py-7 text-left">
                 <p className="text-[11px] text-gray-400 font-bold italic leading-relaxed max-w-xs">{expense.description || 'Configuración operativa estándar de la agencia.'}</p>
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
                            className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-1 text-right font-black text-xl italic text-white focus:border-blue-500 outline-none"
                        />
                    ) : (
                        <span className="text-3xl font-black text-white italic tracking-tighter group-hover:text-blue-400 transition-colors">{Number(expense.amount || 0).toLocaleString()}</span>
                    )}
                </div>
            </td>
            <td className="px-10 py-7 text-right">
                <div className="flex justify-end gap-2">
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
                    {!isEditing && (
                        <button onClick={onDelete} className="p-2.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

function NewRateModal({ data, onChange, onSave, onClose, saving }) {
    const profit = Number(data.price_sale) - Number(data.cost_internal);
    const margin = data.price_sale > 0 ? (profit / data.price_sale) * 100 : 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-left">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0A0A1F] border border-white/10 rounded-[3rem] p-12 max-w-2xl w-full shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500" />
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Crear <span className="text-indigo-500">Nuevo Formato</span></h3>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Expansión del Catálogo de Servicios</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-8 mb-12">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-3 block">Nombre del Formato</label>
                        <input 
                            value={data.name}
                            onChange={e => onChange({...data, name: e.target.value})}
                            placeholder="Ej: Video Reel Pro"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xl text-white font-black italic focus:border-indigo-500 transition-all outline-none uppercase"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-3 block">Descripción Operativa</label>
                        <textarea 
                            value={data.description}
                            onChange={e => onChange({...data, description: e.target.value})}
                            placeholder="Detalles sobre el alcance del servicio..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm text-gray-400 font-bold focus:border-indigo-500 transition-all outline-none h-24 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-3 block">Inversión (Costo)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input 
                                    type="number"
                                    value={data.cost_internal}
                                    onChange={e => onChange({...data, cost_internal: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-8 py-5 text-2xl text-white font-black italic focus:border-indigo-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest pl-3 block">Venta (Cliente)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/30" />
                                <input 
                                    type="number"
                                    value={data.price_sale}
                                    onChange={e => onChange({...data, price_sale: e.target.value})}
                                    className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-2xl pl-14 pr-8 py-5 text-2xl text-emerald-400 font-black italic focus:border-emerald-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Rentabilidad Calculada</p>
                            <div className="flex items-center gap-3">
                                <span className={`text-4xl font-black italic ${profit >= 0 ? 'text-white' : 'text-rose-500'}`}>${profit}</span>
                                <span className={`text-xs font-black px-3 py-1 rounded-full uppercase italic ${margin > 40 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                                    {margin.toFixed(0)}% Profit
                                </span>
                            </div>
                        </div>
                        <Target className={`w-10 h-10 ${margin > 40 ? 'text-emerald-500' : 'text-gray-700'} opacity-20`} />
                    </div>
                </div>

                <div className="flex gap-6">
                    <button 
                        onClick={onSave}
                        disabled={saving}
                        className="flex-1 py-6 bg-indigo-500 text-white text-[12px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-indigo-400 transition-all shadow-2xl shadow-indigo-500/20 disabled:opacity-50"
                    >
                        {saving ? 'Creando...' : 'Confirmar Formato'}
                    </button>
                    <button onClick={onClose} className="px-10 py-6 bg-white/5 text-gray-500 text-[10px] font-black uppercase rounded-2xl hover:text-white transition-all">Cancelar</button>
                </div>
            </motion.div>
        </div>
    );
}


function NewSaaSModal({ data, onChange, onSave, onClose, saving }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0A0A1F] border border-white/10 rounded-[3rem] p-12 max-w-2xl w-full shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Registrar <span className="text-blue-500">Herramienta</span></h3>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Control de Infraestructura SaaS</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-8 mb-12">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-3 block">Herramienta</label>
                            <input 
                                value={data.name}
                                onChange={e => onChange({...data, name: e.target.value})}
                                placeholder="Ej: Figma Pro"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg text-white font-black italic focus:border-blue-500 transition-all outline-none uppercase"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-3 block">Área responsable</label>
                            <input 
                                value={data.department}
                                onChange={e => onChange({...data, department: e.target.value})}
                                placeholder="Ej: DISEÑO / UX"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg text-white font-black italic focus:border-blue-500 transition-all outline-none uppercase"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-3 block">Conexión / Uso Operativo</label>
                        <textarea 
                            value={data.description}
                            onChange={e => onChange({...data, description: e.target.value})}
                            placeholder="¿Para qué se usa y quién la conecta con la operación?"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm text-gray-400 font-bold focus:border-blue-500 transition-all outline-none h-24 resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-3 block">Inversión Mensual</label>
                        <div className="relative">
                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                            <input 
                                type="number"
                                value={data.amount}
                                onChange={e => onChange({...data, amount: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-8 py-5 text-2xl text-white font-black italic focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    <button 
                        onClick={onSave}
                        disabled={saving || !data.name}
                        className="flex-1 py-6 bg-blue-500 text-white text-[12px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-blue-400 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50"
                    >
                        {saving ? 'Registrando...' : 'Confirmar Gasto'}
                    </button>
                    <button onClick={onClose} className="px-10 py-6 bg-white/5 text-gray-500 text-[10px] font-black uppercase rounded-2xl hover:text-white transition-all">Cancelar</button>
                </div>
            </motion.div>
        </div>
    );
}
