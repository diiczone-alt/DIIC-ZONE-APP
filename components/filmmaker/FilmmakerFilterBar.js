'use client';

import { Search, Filter, Calendar, Clapperboard, MonitorPlay, Users } from 'lucide-react';

export default function FilmmakerFilterBar({ filters, setFilters, isVisible }) {
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
                        placeholder="Buscar proyecto, lugar o tema..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-500/50"
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
                            <option value="all">Todo el Contenido</option>
                            <option value="reel">Reels / TikTok</option>
                            <option value="youtube">Video Largo (YouTube)</option>
                            <option value="spot">Spot Publicitario</option>
                            <option value="event">Cobertura Evento</option>
                            <option value="podcast">Podcast</option>
                        </select>
                        <Clapperboard className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Status */}
                    <div className="relative group">
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-300 focus:outline-none cursor-pointer hover:bg-white/10"
                        >
                            <option value="all">Todos los Estados</option>
                            <option value="pending_recording">Pendiente Grabación</option>
                            <option value="recorded">Grabado</option>
                            <option value="in_editing">En Edición</option>
                            <option value="in_review">En Revisión</option>
                            <option value="approved">Aprobado</option>
                        </select>
                        <MonitorPlay className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Role / User */}
                    <div className="relative group">
                        <select
                            value={filters.assignee}
                            onChange={(e) => handleFilterChange('assignee', e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-300 focus:outline-none cursor-pointer hover:bg-white/10"
                        >
                            <option value="all">Equipo</option>
                            <option value="filmmaker">Filmmakers</option>
                            <option value="editor">Editores</option>
                        </select>
                        <Users className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
