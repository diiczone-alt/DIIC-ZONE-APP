'use client';

import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';

const COLUMNS = [
    { id: 'draft', label: 'Borrador / Pendiente', color: 'border-l-gray-500' },
    { id: 'in_process', label: 'En Proceso', color: 'border-l-blue-500' },
    { id: 'pending_review', label: 'En Revisión', color: 'border-l-yellow-500' },
    { id: 'changes_requested', label: 'Ajustes', color: 'border-l-orange-500' },
    { id: 'approved', label: 'Aprobado', color: 'border-l-green-500' },
    { id: 'completed', label: 'Publicado', color: 'border-l-purple-500' }
];

export default function DesignKanbanView({ items, onSelect }) {

    const getItemsByStatus = (status) => items.filter(i => i.status === status);

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 h-full min-h-[500px]">
            {COLUMNS.map((col) => (
                <div key={col.id} className="min-w-[280px] flex flex-col h-full bg-[#0B0B15]/50 rounded-xl border border-white/5">
                    {/* Header */}
                    <div className={`p-3 border-b border-white/10 flex justify-between items-center ${col.color} border-l-4 rounded-t-xl bg-white/[0.02]`}>
                        <h3 className="font-bold text-sm text-gray-200">{col.label}</h3>
                        <span className="text-xs text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded">
                            {getItemsByStatus(col.id).length}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-2 overflow-y-auto space-y-2">
                        {getItemsByStatus(col.id).map((item) => (
                            <motion.div
                                key={item.id}
                                layoutId={`kanban-${item.id}`}
                                onClick={() => onSelect(item)}
                                className="bg-[#151520] p-3 rounded-lg border border-white/5 hover:border-white/20 cursor-pointer shadow-sm group hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 uppercase tracking-wider">{item.type || 'General'}</span>
                                    <button className="text-gray-600 hover:text-white"><MoreHorizontal className="w-3 h-3" /></button>
                                </div>
                                <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">{item.title}</h4>

                                {item.file_url && (
                                    <div className="w-full h-24 rounded-md overflow-hidden mb-2 bg-black/20">
                                        <img src={item.file_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                )}

                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] border border-[#151520] text-white">
                                            {item.designer ? item.designer.charAt(0) : 'D'}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-500">{new Date(item.updated_at || Date.now()).toLocaleDateString()}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
