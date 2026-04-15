'use client';

import { motion } from 'framer-motion';
import { MoreHorizontal, Calendar, Clock, Paperclip } from 'lucide-react';

const COLUMNS = [
    { id: 'pending_recording', label: '📅 Pendiente Grabación', color: 'border-t-gray-500' },
    { id: 'recorded', label: '🎬 Material Subido', color: 'border-t-blue-500' },
    { id: 'in_editing', label: '✂️ En Edición', color: 'border-t-purple-500' },
    { id: 'in_review', label: '👀 Revisión', color: 'border-t-yellow-500' },
    { id: 'approved', label: '✅ Aprobado', color: 'border-t-green-500' },
];

export default function FilmmakerKanban({ items, onSelect }) {

    const getItemsByStatus = (status) => items.filter(i => i.status === status);

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 h-full min-h-[500px]">
            {COLUMNS.map((col) => (
                <div key={col.id} className="min-w-[300px] flex flex-col h-full bg-[#0B0B15]/50 rounded-xl border border-white/5">
                    {/* Header */}
                    <div className={`p-4 border-b border-white/10 flex justify-between items-center ${col.color} border-t-2 bg-white/[0.02]`}>
                        <h3 className="font-bold text-sm text-gray-200">{col.label}</h3>
                        <span className="text-xs text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded">
                            {getItemsByStatus(col.id).length}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-3">
                        {getItemsByStatus(col.id).map((item) => (
                            <motion.div
                                key={item.id}
                                layoutId={`kanban-${item.id}`}
                                onClick={() => onSelect(item)}
                                className="bg-[#151520] p-4 rounded-lg border border-white/5 hover:border-white/20 cursor-pointer shadow-sm group hover:shadow-md transition-all relative overflow-hidden"
                            >
                                {/* Priority Indicator */}
                                {item.priority === 'high' && (
                                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl-lg" />
                                )}

                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 uppercase tracking-wider font-bold">{item.type}</span>
                                    <button className="text-gray-600 hover:text-white"><MoreHorizontal className="w-4 h-4" /></button>
                                </div>

                                <h4 className="text-sm font-bold text-white mb-2 line-clamp-2">{item.title}</h4>

                                <div className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> {new Date(item.date).toLocaleDateString()}
                                    {item.duration && <><span className="text-gray-700">|</span> <Clock className="w-3 h-3" /> {item.duration}</>}
                                </div>

                                {item.thumbnail && (
                                    <div className="w-full h-32 rounded-md overflow-hidden mb-3 bg-black/50 relative group-hover:ring-1 ring-white/20 transition-all">
                                        <img src={item.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                                                <Paperclip className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center border-t border-white/5 pt-3">
                                    <div className="flex -space-x-2">
                                        {/* Filmmaker Avatar */}
                                        <div className="w-6 h-6 rounded-full bg-red-900 border border-[#151520] flex items-center justify-center text-[8px] text-red-200" title={`Filmmaker: ${item.filmmaker}`}>
                                            {item.filmmaker?.charAt(0) || 'F'}
                                        </div>
                                        {/* Editor Avatar */}
                                        {item.editor && (
                                            <div className="w-6 h-6 rounded-full bg-purple-900 border border-[#151520] flex items-center justify-center text-[8px] text-purple-200" title={`Editor: ${item.editor}`}>
                                                {item.editor.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    {item.status === 'pending_recording' ? (
                                        <span className="text-[10px] text-red-400 font-medium bg-red-400/10 px-2 py-0.5 rounded">Por Grabar</span>
                                    ) : (
                                        <span className="text-[10px] text-gray-500">Act. hoy</span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
