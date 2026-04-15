'use client';

import { Search, Filter, Calendar, User, Briefcase, Flag } from 'lucide-react';

export default function DesignFilterBar({ filters, setFilters, isVisible }) {
    if (!isVisible) return null;

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-[#0B0B15] border-b border-white/5 p-4 mb-6 animate-slide-down">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre de proyecto..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap gap-2">
                    {/* Types */}
                    <div className="relative group">
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-300 focus:outline-none cursor-pointer hover:bg-white/10"
                        >
                            <option value="all">Todos los Tipos</option>
                            <option value="post">Post RRSS</option>
                            <option value="carousel">Carrusel</option>
                            <option value="banner">Banner Web</option>
                            <option value="logo">Branding / Logo</option>
                            <option value="print">Impresión</option>
                        </select>
                        <Briefcase className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Status */}
                    <div className="relative group">
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-300 focus:outline-none cursor-pointer hover:bg-white/10"
                        >
                            <option value="all">Todos los Estados</option>
                            <option value="in_process">En Proceso</option>
                            <option value="pending_review">En Revisión</option>
                            <option value="changes_requested">Ajustes</option>
                            <option value="approved">Aprobado</option>
                            <option value="completed">Publicado</option>
                        </select>
                        <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Priority */}
                    <div className="relative group">
                        <select
                            value={filters.priority}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-300 focus:outline-none cursor-pointer hover:bg-white/10"
                        >
                            <option value="all">Prioridad</option>
                            <option value="high">Alta</option>
                            <option value="medium">Media</option>
                            <option value="low">Baja</option>
                        </select>
                        <Flag className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
