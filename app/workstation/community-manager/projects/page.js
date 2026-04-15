'use client';

import { useState } from 'react';
import {
    Kanban, List, CheckCircle, Clock,
    MoreHorizontal, User, Paperclip
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProjectsPage() {

    // Mock Data
    const projects = [
        {
            id: 'PROJ-101',
            campaign: 'Black Friday Deals',
            title: 'Reel: Unboxing Producto A',
            type: 'Video Vertical',
            assignee: 'Editor: Juan P.',
            deadline: 'Mañana',
            status: 'in_progress', // todo, in_progress, review, done
            thumb: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop'
        },
        {
            id: 'PROJ-102',
            campaign: 'Black Friday Deals',
            title: 'Carrusel: 5 Beneficios',
            type: 'Diseño',
            assignee: 'Diseño: Laura G.',
            deadline: 'Jueves',
            status: 'review',
            thumb: 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1974&auto=format&fit=crop'
        },
        {
            id: 'PROJ-103',
            campaign: 'Branding Médico',
            title: 'Post Historia Clínica',
            type: 'Diseño',
            assignee: 'Diseño: Laura G.',
            deadline: 'Viernes',
            status: 'todo',
            thumb: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop'
        }
    ];

    const columns = [
        { id: 'todo', label: 'Por Hacer', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
        { id: 'in_progress', label: 'En Proceso', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
        { id: 'review', label: 'Revisión', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
        { id: 'done', label: 'Listo', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white">Proyectos de Contenido</h1>
                    <p className="text-sm text-gray-400">Supervisa la producción creativa.</p>
                </div>
                <div className="flex bg-[#0E0E18] rounded-xl p-1 border border-white/10">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white"><Kanban className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500"><List className="w-5 h-5" /></button>
                </div>
            </header>

            <div className="flex-1 overflow-x-auto p-8">
                <div className="flex gap-6 h-full min-w-[1200px]">
                    {columns.map(col => (
                        <div key={col.id} className="w-80 flex flex-col h-full">
                            <div className={`flex items-center justify-between p-4 rounded-xl border ${col.color} mb-4 bg-[#0E0E18]/50 backdrop-blur-sm`}>
                                <span className="font-bold">{col.label}</span>
                                <span className="text-xs bg-black/20 px-2 py-1 rounded">
                                    {projects.filter(p => p.status === col.id).length}
                                </span>
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pb-20">
                                {projects.filter(p => p.status === col.id).map(feat => (
                                    <ProjectCard key={feat.id} project={feat} />
                                ))}
                                <button className="w-full py-3 border border-dashed border-white/10 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Añadir Tarea
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProjectCard({ project }) {
    return (
        <motion.div
            layoutId={project.id}
            className="bg-[#0E0E18] border border-white/5 p-4 rounded-xl hover:border-indigo-500/30 group cursor-pointer shadow-lg shadow-black/20"
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">{project.campaign}</span>
                <button className="text-gray-500 hover:text-white"><MoreHorizontal className="w-4 h-4" /></button>
            </div>

            <h4 className="font-bold text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">{project.title}</h4>

            {/* Visual Preview (Mock) */}
            <div className="h-24 bg-gray-800 rounded-lg mb-3 overflow-hidden border border-white/5 relative">
                <img src={project.thumb} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Thumb" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-bold">Ver</div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-gray-400" title={project.assignee}>
                    <User className="w-3.5 h-3.5 text-gray-500" />
                    <span className="truncate max-w-[80px]">{project.assignee.split(':')[1]}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{project.deadline}</span>
                </div>
            </div>
        </motion.div>
    );
}

import { Plus } from 'lucide-react';
