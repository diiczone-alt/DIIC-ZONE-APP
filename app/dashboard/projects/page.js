'use client';

import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import ProjectCard from '../../../components/ui/ProjectCard';

// Mock Data for now
const MOCK_PROJECTS = [
    {
        id: '1',
        title: 'Campaña Lanzamiento Q1',
        status: 'production',
        deadline: '2024-03-15',
        department: 'video',
        description: 'Serie de 3 videos para redes sociales anunciando el nuevo producto.',
        progress: 45
    },
    {
        id: '2',
        title: 'Rediseño de Identidad Visual',
        status: 'review',
        deadline: '2024-02-28',
        department: 'design',
        description: 'Actualización de manual de marca y templates para social media.',
        progress: 80
    },
    {
        id: '3',
        title: 'Estrategia SEO Blog',
        status: 'planning',
        deadline: '2024-04-10',
        department: 'marketing',
        description: 'Investigación de palabras clave y calendario editorial.',
        progress: 15
    },
    {
        id: '4',
        title: 'Landing Page Evento',
        status: 'approved',
        deadline: '2024-02-20',
        department: 'web',
        description: 'Página de registro para el webinar de marzo.',
        progress: 100
    }
];

export default function ProjectsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Proyectos</h2>
                    <p className="text-gray-400">Gestiona y supervisa el progreso de tus solicitudes.</p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium">
                    <Plus className="w-5 h-5" />
                    Nuevo Proyecto
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar proyectos..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                    <Filter className="w-5 h-5" />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_PROJECTS.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                ))}
            </div>
        </div>
    );
}
