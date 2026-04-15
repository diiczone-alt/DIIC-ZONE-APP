'use client';

import { Clock, User as UserIcon, CheckCircle, AlertCircle, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
    'in_process': { label: 'En Proceso', color: 'text-blue-400 bg-blue-400/10' },
    'pending_review': { label: 'Revisión', color: 'text-yellow-400 bg-yellow-400/10' },
    'changes_requested': { label: 'Ajustes', color: 'text-orange-400 bg-orange-400/10' },
    'approved': { label: 'Aprobado', color: 'text-green-400 bg-green-400/10' },
    'completed': { label: 'Publicado', color: 'text-purple-400 bg-purple-400/10' },
    'draft': { label: 'Borrador', color: 'text-gray-400 bg-gray-400/10' },
};

export default function DesignListView({ items, onSelect }) {
    return (
        <div className="w-full bg-[#0B0B15] rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
                        <th className="p-4 font-medium">Nombre del Proyecto</th>
                        <th className="p-4 font-medium">Tipo</th>
                        <th className="p-4 font-medium">Estado</th>

                        <th className="p-4 font-medium">Última Act.</th>
                        <th className="p-4 font-medium text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onSelect(item)}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                        >
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden relative">
                                        {item.file_url && (
                                            <img src={item.file_url} alt="" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="font-medium text-white">{item.title}</div>
                                </div>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-gray-400 capitalize">{item.type || 'General'}</span>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_CONFIG[item.status]?.color || 'text-gray-400'}`}>
                                    {STATUS_CONFIG[item.status]?.label || item.status}
                                </span>
                            </td>

                            <td className="p-4">
                                <span className="text-sm text-gray-500">{new Date(item.updated_at || Date.now()).toLocaleDateString()}</span>
                            </td>
                            <td className="p-4 text-right">
                                <button className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
