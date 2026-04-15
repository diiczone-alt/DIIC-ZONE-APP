'use client';

import {
    Users, UserPlus, TrendingUp, AlertTriangle, ArrowLeft
} from 'lucide-react';
import { useState } from 'react';
import { ClientTable } from '@/components/crm/CRMComponents';
import AddClientModal from '@/components/crm/AddClientModal';
import PriorityBadge from '@/components/crm/PriorityBadge';
import { calculateClientPriority } from '@/utils/priorityCalculator';

import { useRouter } from 'next/navigation';

export default function CRMPage() {
    const router = useRouter();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // Mock Data
    const clients = [
        { id: 'cli-001', name: 'Roberto Gómez', company: 'Tech Solutions Inc.', initials: 'RG', status: 'active', statusLabel: 'Activo', ltv: '12,500', projectsCount: 5, lastActivity: 'Reunión de Feedback - Ayer' },
        { id: 'cli-002', name: 'Ana Martínez', company: 'Boutique Floral', initials: 'AM', status: 'lead', statusLabel: 'Prospecto', ltv: '0', projectsCount: 0, lastActivity: 'Email enviado - Hace 2h' },
        { id: 'cli-003', name: 'Luis & Carla', company: 'Boda Civil', initials: 'L&C', status: 'active', statusLabel: 'En Producción', ltv: '3,200', projectsCount: 1, lastActivity: 'Pago Recibido - Hoy' },
        { id: 'cli-004', name: 'Constructora Elite', company: 'Grupo Elite', initials: 'GE', status: 'churn_risk', statusLabel: 'Riesgo Bajas', ltv: '45,000', projectsCount: 12, lastActivity: 'Queja registrada - Hace 3 días' },
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">

            {/* Header */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Regresar"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-white flex items-center gap-3">
                            <Users className="w-6 h-6 text-indigo-500" /> Clientes & CRM
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">Gestión centralizada de relaciones comerciales.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" /> Nuevo Cliente
                    </button>
                </div>
            </header>

            <AddClientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-5">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-500 text-xs font-bold uppercase">Total Clientes</span>
                            <Users className="w-4 h-4 text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white">142</h3>
                        <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +12% vs mes anterior
                        </p>
                    </div>

                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-5">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-500 text-xs font-bold uppercase">Nuevos Leads</span>
                            <UserPlus className="w-4 h-4 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white">28</h3>
                        <p className="text-[10px] text-gray-500 mt-1">Esta semana</p>
                    </div>

                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-5">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-500 text-xs font-bold uppercase">Churn Risk</span>
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white">3</h3>
                        <p className="text-[10px] text-red-400 mt-1">Atención requerida</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden">
                        <h3 className="text-lg font-bold text-white relative z-10">LTV Promedio</h3>
                        <p className="text-3xl font-black text-indigo-400 relative z-10">$8,450</p>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/20 blur-xl rounded-full" />
                    </div>
                </div>

                {/* Main Table */}
                <ClientTable clients={clients} />

            </main>
        </div>
    );
}
