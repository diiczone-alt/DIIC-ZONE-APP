'use client';

import { Calendar, MoreVertical, PlayCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import Link from 'next/link';

export default function ProjectCard({ project, index }) {
    const statusColors = {
        planning: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
        production: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
        review: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
        approved: 'bg-green-500/20 text-green-400 border-green-500/20',
        completed: 'bg-gray-500/20 text-gray-400 border-gray-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Link href={`/dashboard/projects/${project.id}`}>
                <GlassCard className="group hover:bg-white/10 transition-all duration-300 relative overflow-hidden cursor-pointer">
                    {/* Priority Badge */}
                    {project.priority && (
                        <div className={`absolute top-4 left-4 z-10 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${project.priority === 'HIGH' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                                project.priority === 'MEDIUM' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' :
                                    'text-green-400 bg-green-500/10 border-green-500/20'
                            }`}>
                            {project.priority === 'HIGH' ? '🔥 Alta' : project.priority === 'MEDIUM' ? '⚡ Media' : '🟢 Baja'}
                        </div>
                    )}

                    <div className="absolute top-0 right-0 p-4 z-10">
                        <button className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className={`w-fit px-3 py-1 rounded-full text-xs font-medium border mb-4 ${statusColors[project.status] || statusColors.planning}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </div>

                        <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-primary transition-colors">
                            {project.title}
                        </h3>

                        <p className="text-sm text-gray-400 mb-6 line-clamp-2">
                            {project.description || 'Sin descripción'}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(project.deadline).toLocaleDateString()}</span>
                            </div>

                            {project.department && (
                                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">
                                    {project.department}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="h-1 w-full bg-white/5 mt-4">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${project.progress || 0}%` }}
                        />
                    </div>
                </GlassCard>
            </Link>
        </motion.div>
    );
}
