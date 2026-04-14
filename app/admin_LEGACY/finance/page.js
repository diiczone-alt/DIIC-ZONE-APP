'use client';

import { 
    TrendingUp, ArrowUpRight, ArrowDownRight, 
    DollarSign, Briefcase, User, 
    Calendar, CheckCircle2, Clock, 
    AlertCircle, BarChart3, Wallet
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminFinancePage() {
    const income = [
        { id: 'I-001', client: 'Hospital Nova Clínica', service: 'Estrategia Anual', amount: 45000, status: 'cobrado', date: '12 Jan 2025' },
        { id: 'I-002', client: 'Nova Urology', service: 'Producción Video', amount: 12800, status: 'pendiente', date: '05 Feb 2025' },
        { id: 'I-003', client: 'Global Media', service: 'CM & Social', amount: 3500, status: 'cobrado', date: '01 Mar 2025' },
    ];

    const expenses = [
        { id: 'E-001', member: 'Anthony', project: 'Nova Clínica (Edit)', amount: 1200, status: 'pagado', date: '20 Jan 2025' },
        { id: 'E-002', member: 'Fausto', project: 'Urology (Reels)', amount: 450, status: 'pendiente', date: '10 Feb 2025' },
        { id: 'E-003', member: 'Leslie', project: 'Creative Zone (CM)', amount: 800, status: 'pagado', date: '28 Feb 2025' },
    ];

    const totalIncome = income.filter(i => i.status === 'cobrado').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = expenses.filter(e => e.status === 'pagado').reduce((acc, curr) => acc + curr.amount, 0);
    const utility = totalIncome - totalExpenses;

    return (
        <div className="flex-1 overflow-y-auto p-10 bg-[#050511]">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Finanzas Globales</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Control de Utilidad y Balance Real</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => toast.success('Módulo de Facturación activado')}
                        className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-emerald-500/10 active:scale-95 text-xs uppercase tracking-widest"
                    >
                        <Wallet className="w-5 h-5" />
                        Registrar Transacción
                    </button>
                </div>
            </header>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-[#0A0A12] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                        <BarChart3 className="w-8 h-8 text-white/5 absolute top-8 right-8" />
                    </div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Ingresos Cobrados</p>
                    <h3 className="text-3xl font-black text-white tracking-tighter">${totalIncome.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-500 font-bold">
                        <TrendingUp className="w-3 h-3" /> +15.4% vs Mes Anterior
                    </div>
                </div>

                <div className="bg-[#0A0A12] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <ArrowDownRight className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Egresos Pagados</p>
                    <h3 className="text-3xl font-black text-white tracking-tighter">${totalExpenses.toLocaleString()}</h3>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-[10px] text-indigo-100/70 font-black uppercase tracking-widest mb-1">Utilidad Real (Balance)</p>
                        <h3 className="text-4xl font-black text-white tracking-tighter">${utility.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Ingresos Table */}
                <div className="bg-[#0A0A12] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Detalle de Ingresos
                        </h3>
                    </div>
                    <div className="p-4 space-y-4">
                        {income.map(item => (
                            <div key={item.id} className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-all">
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-tight mb-0.5">{item.client}</p>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{item.service}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white tracking-tighter">${item.amount.toLocaleString()}</p>
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${item.status === 'cobrado' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Egresos Table */}
                <div className="bg-[#0A0A12] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                            Detalle de Egresos
                        </h3>
                    </div>
                    <div className="p-4 space-y-4">
                        {expenses.map(item => (
                            <div key={item.id} className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-all">
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-tight mb-0.5">{item.member}</p>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{item.project}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white tracking-tighter">${item.amount.toLocaleString()}</p>
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${item.status === 'pagado' ? 'text-indigo-400' : 'text-amber-500'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


