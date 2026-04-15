'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlayCircle, Image as ImageIcon, Mic, ArrowRight, Plus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function Level1_CreativeZone({ onNewProject }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            // Mock data fallback for now, logic copied from original dashboard
            const { data, error } = await supabase
                .from('content_items')
                .select('*')
                .in('status', ['editing', 'approval', 'scheduled'])
                .order('scheduled_date', { ascending: true })
                .limit(5);

            if (data && data.length > 0) {
                setProjects(data);
            } else {
                setProjects([
                    { id: 1, title: 'Reel: Lanzamiento V2', type: 'reel', status: 'editing', author: 'Sarah', progress: 65 },
                    { id: 2, title: 'Carrusel Educativo: Tips IA', type: 'design', status: 'approval', author: 'Alex', progress: 90 },
                    { id: 3, title: 'Podcast: Episodio 4', type: 'audio', status: 'scheduled', author: 'Mike', progress: 100 }
                ]);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            // Fallback
            setProjects([
                { id: 1, title: 'Reel: Lanzamiento V2', type: 'reel', status: 'editing', author: 'Sarah', progress: 65 },
                { id: 2, title: 'Carrusel Educativo: Tips IA', type: 'design', status: 'approval', author: 'Alex', progress: 90 },
                { id: 3, title: 'Podcast: Episodio 4', type: 'audio', status: 'scheduled', author: 'Mike', progress: 100 }
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 rounded-full bg-blue-500 block shadow-[0_0_15px_rgba(59,130,246,0.5)]"></span>
                    Zona Creativa
                </h3>
                <div className="flex gap-3">
                    <button
                        onClick={onNewProject}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-3 h-3" /> Nuevo Proyecto
                    </button>
                    <Link
                        href="/dashboard/pipeline"
                        className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold hover:bg-blue-600/30 hover:text-white transition-all flex items-center gap-2"
                    >
                        Ver Todo <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            <div className="grid gap-4">
                {projects.map((project) => (
                    <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
                        <div className="group relative p-1 rounded-2xl bg-gradient-to-r from-white/5 to-white/0 hover:to-white/5 transition-all cursor-pointer">
                            <div className="absolute inset-0 bg-blue-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative p-5 rounded-xl bg-[#0A0A12] border border-white/5 flex items-center gap-5 hover:border-white/10 transition-colors">
                                {/* Icon Box */}
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/5 ${project.type === 'reel' ? 'bg-orange-500/10 text-orange-500' :
                                    project.type === 'audio' ? 'bg-purple-500/10 text-purple-500' :
                                        'bg-blue-500/10 text-blue-500'
                                    }`}>
                                    {project.type === 'reel' ? <PlayCircle className="w-6 h-6" /> :
                                        project.type === 'audio' ? <Mic className="w-6 h-6" /> :
                                            <ImageIcon className="w-6 h-6" />}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex justify-between mb-2">
                                        <h4 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                                            {project.title}
                                        </h4>
                                        <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{project.progress}%</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                                        <div
                                            className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>

                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span className="capitalize flex items-center gap-1">
                                            <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'editing' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                                            {project.status}
                                        </span>
                                        <span>Equipo: {project.author}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Empty State Hint if needed */}
            {projects.length === 0 && (
                <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-gray-500">
                    <p>No hay proyectos activos. ¡Comienza a crear!</p>
                </div>
            )}
        </div>
    );
}
