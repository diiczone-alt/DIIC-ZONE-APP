'use client';

import { Calendar, MoreHorizontal, Video, Edit3, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
    'pending_recording': { label: 'Pendiente Grabación', color: 'text-gray-400 bg-gray-400/10', icon: Calendar },
    'recorded': { label: 'Material Listo', color: 'text-blue-400 bg-blue-400/10', icon: Video },
    'in_editing': { label: 'En Edición', color: 'text-purple-400 bg-purple-400/10', icon: Edit3 },
    'in_review': { label: 'En Revisión', color: 'text-yellow-400 bg-yellow-400/10', icon: Clock },
    'approved': { label: 'Aprobado', color: 'text-green-400 bg-green-400/10', icon: CheckCircle },
};

export default function FilmmakerList({ items, onSelect }) {
    return (
        <div className="w-full bg-[#0B0B15] rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
                        <th className="p-4 font-medium">Proyecto</th>
                        <th className="p-4 font-medium">Tipo</th>
                        <th className="p-4 font-medium">Estado</th>
                        <th className="p-4 font-medium">Fecha Rodaje</th>
                        <th className="p-4 font-medium">Equipo</th>
                        <th className="p-4 font-medium text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => {
                        const StatusIcon = STATUS_CONFIG[item.status]?.icon || Calendar;
                        return (
                            <motion.tr
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => onSelect(item)}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                <td className="p-4">
                                    <div className="font-bold text-white mb-1">{item.title}</div>
                                    <div className="text-xs text-gray-500">{item.client}</div>
                                </td>
                                <td className="p-4">
                                    <span className="text-sm text-gray-400 capitalize bg-white/5 px-2 py-1 rounded">{item.type}</span>
                                </td>
                                <td className="p-4">
                                    <div className={`flex items-center gap-2 px-2 py-1 rounded-full w-fit text-xs font-bold ${STATUS_CONFIG[item.status]?.color}`}>
                                        <StatusIcon className="w-3 h-3" />
                                        {STATUS_CONFIG[item.status]?.label}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm text-gray-400">{new Date(item.date).toLocaleDateString()}</div>
                                    <div className="text-xs text-gray-600">{item.location}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-red-900 border-2 border-[#0B0B15] flex items-center justify-center text-xs text-red-200 font-bold" title={item.filmmaker}>
                                            {item.filmmaker?.charAt(0)}
                                        </div>
                                        {item.editor && (
                                            <div className="w-8 h-8 rounded-full bg-purple-900 border-2 border-[#0B0B15] flex items-center justify-center text-xs text-purple-200 font-bold" title={item.editor}>
                                                {item.editor.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </motion.tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
