'use client';

import { useState } from 'react';
import {
    Activity, Filter, AlertTriangle,
    Users, BarChart2, Plus
} from 'lucide-react';
import { CapacityBar, TeamMemberLoad } from '@/components/capacity/CapacityComponents';

export default function CapacityPage() {
    const [filter, setFilter] = useState('all');

    // Mock Data
    const departments = [
        { id: 'video', name: 'Video Editors', capacity: 78, members: 5 },
        { id: 'design', name: 'Graphic Design', capacity: 45, members: 3 },
        { id: 'film', name: 'Filmmakers', capacity: 92, members: 4 }, // High Load
    ];

    const team = [
        { id: 1, name: 'Carlos Editor', role: 'Video Editor', load: 85, max: 100, projects: 4, dept: 'video' },
        { id: 2, name: 'Ana Design', role: 'Graphic Designer', load: 40, max: 100, projects: 2, dept: 'design' },
        { id: 3, name: 'Mike Film', role: 'Filmmaker', load: 95, max: 100, projects: 5, dept: 'film' }, // Overloaded
        { id: 4, name: 'Sarah Editor', role: 'Video Editor', load: 60, max: 100, projects: 3, dept: 'video' },
    ];

    const filteredTeam = filter === 'all' ? team : team.filter(m => m.dept === filter);

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">

            {/* Header */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-10">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3">
                        <Activity className="w-6 h-6 text-amber-500" /> Control de Capacidad
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Monitoreo de carga de trabajo y disponibilidad del equipo.</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl px-4 py-2 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <div>
                            <p className="text-[10px] text-amber-400 uppercase font-bold">Alerta Sistema</p>
                            <p className="text-sm font-bold text-white">Filmmakers al 92%</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">

                {/* Department Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {departments.map((dept) => (
                        <div key={dept.id} onClick={() => setFilter(dept.id)} className={`cursor-pointer transition-transform hover:scale-[1.02] ${filter === dept.id ? 'ring-2 ring-purple-500' : ''}`}>
                            <CapacityBar
                                label={dept.name}
                                current={dept.capacity}
                                max={100}
                            />
                        </div>
                    ))}
                </div>

                {/* Team List */}
                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden flex-1 flex flex-col">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-400" /> Miembros del Equipo
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1 rounded-lg text-xs font-bold ${filter === 'all' ? 'bg-white text-black' : 'bg-white/5 text-gray-400'}`}
                            >
                                Ver Todos
                            </button>
                            {/* More filters could go here */}
                        </div>
                    </div>

                    <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                        {filteredTeam.map((member) => (
                            <TeamMemberLoad
                                key={member.id}
                                name={member.name}
                                role={member.role}
                                currentLoad={member.load}
                                maxLoad={member.max}
                                activeProjects={member.projects}
                            />
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}
