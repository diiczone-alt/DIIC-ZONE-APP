'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Calendar, LayoutList, Grip, RefreshCw, Plus, Search } from 'lucide-react';
import ProductionItem from '@/components/production/ProductionItem';
import ProductionDetail from '@/components/production/ProductionDetail';

export default function PipelinePage() {
    const [viewMode, setViewMode] = useState('list'); // list, grid
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);

    // Mock Data simulating "The Nervous Center"
    const ITEMS = [
        {
            id: 'PROJ-001',
            name: 'Campaña "Seguros" - Parte 1',
            type: 'Video / Reels',
            department: 'video',
            status: 'editing', // start, production, review, approval, copy, scheduled, published
            startDate: '10 Oct',
            targetDate: '15 Oct',
            owner: 'Carlos M.',
            thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&q=80',
            sla: 'on-track' // on-track, risk, delayed
        },
        {
            id: 'PROJ-002',
            name: 'Post "Beneficios 2024"',
            type: 'Diseño Gráfico',
            department: 'design',
            status: 'start',
            startDate: '12 Oct',
            targetDate: '20 Oct',
            owner: 'Ana L.',
            thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80',
            sla: 'on-track'
        },
        {
            id: 'PROJ-003',
            name: 'Cobertura Evento "Tech Summit"',
            type: 'Filmmaker Pro',
            department: 'filmmaker',
            status: 'production',
            startDate: '14 Oct',
            targetDate: '16 Oct',
            owner: 'Roberto G.',
            thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=500&q=80',
            sla: 'risk'
        },
        {
            id: 'PROJ-004',
            name: 'Podcast Ep. 45 - Invitado Especial',
            type: 'Audition Pro',
            department: 'audio',
            status: 'review',
            startDate: '08 Oct',
            targetDate: '18 Oct',
            owner: 'Studio A',
            thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f52b27fa34e?w=500&q=80',
            sla: 'delayed'
        }
    ];

    const DEPARTMENTS = [
        { id: 'all', label: 'Todos' },
        { id: 'video', label: 'Video / Reels' },
        { id: 'design', label: 'Diseño' },
        { id: 'filmmaker', label: 'Filmmaker' },
        { id: 'audio', label: 'Audio' },
        { id: 'web', label: 'Web' },
    ];

    const filteredItems = activeFilter === 'all' ? ITEMS : ITEMS.filter(i => i.department === activeFilter);

    return (
        <div className="min-h-screen bg-[#050511] text-white p-6 pb-24">

            {/* Header: "Control Center" Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Sistema Operativo Activo</span>
                    </div>
                    <h1 className="text-4xl font-black text-white leading-tight">Flujo de Producción 🎬</h1>
                    <p className="text-gray-400 mt-2 max-w-2xl">
                        Centro nervioso de DIIC ZONE. Monitorea el estado real de cada pieza de contenido,
                        desde la idea hasta la publicación.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                        <Calendar className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all">
                        <Plus className="w-5 h-5" /> Nueva Solicitud
                    </button>
                </div>
            </div>

            {/* Toolbar: Filters & Views */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-[#0E0E18] p-2 rounded-2xl border border-white/5">

                {/* Department Filters */}
                <div className="flex items-center gap-1 overflow-x-auto max-w-full md:max-w-3xl no-scrollbar p-1">
                    {DEPARTMENTS.map(dept => (
                        <button
                            key={dept.id}
                            onClick={() => setActiveFilter(dept.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${activeFilter === dept.id
                                    ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400'
                                    : 'bg-transparent border-transparent text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {dept.label}
                        </button>
                    ))}
                </div>

                {/* View Toggles & Search */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar proyecto..."
                            className="w-full bg-[#151520] border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50"
                        />
                    </div>
                    <div className="flex bg-[#151520] rounded-lg p-1 border border-white/5">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            <LayoutList className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            <Grip className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid/List */}
            <motion.div
                layout
                className={`grid gap-4 ${viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
            >
                <AnimatePresence>
                    {filteredItems.map(item => (
                        <ProductionItem
                            key={item.id}
                            item={item}
                            viewMode={viewMode}
                            onClick={() => setSelectedItem(item)} // Open Details
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <ProductionDetail
                        item={selectedItem}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </AnimatePresence>

        </div>
    );
}
