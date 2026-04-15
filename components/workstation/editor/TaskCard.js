'use client';

import {
    Clock, AlertTriangle, CheckCircle2, MoreVertical,
    ArrowRight, FileVideo
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TaskCard({ task, onClick }) {
    const statusColors = {
        'pending': 'bg-gray-500/10 border-gray-500/20 text-gray-400',
        'in_progress': 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        'review': 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        'changes_requested': 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        'done': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    };

    const priorityColors = {
        'high': 'text-red-400',
        'medium': 'text-amber-400',
        'low': 'text-blue-400',
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className={`p-4 rounded-xl border bg-[#0E0E18] border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group relative overflow-hidden`}
        >
            {/* Priority Indicator */}
            <div className={`absolute top-0 right-0 w-2 h-2 rounded-full m-2 ${priorityColors[task.priority] || 'bg-gray-600'}`} />

            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-gray-500 group-hover:text-white transition-colors">
                        {task.client.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors line-clamp-1">
                            {task.title}
                        </h4>
                        <p className="text-xs text-gray-500">{task.client}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{task.deadline}</span>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${statusColors[task.status]}`}>
                    {task.status.replace('_', ' ')}
                </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {/* Avatars of collaborators (e.g. CM, Filmmaker) */}
                    {[1, 2].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gray-700 border border-[#0E0E18]" />
                    ))}
                </div>

                <button className="text-xs font-bold text-gray-500 group-hover:text-white flex items-center gap-1 transition-colors">
                    Abrir <ArrowRight className="w-3 h-3" />
                </button>
            </div>
        </motion.div>
    );
}
