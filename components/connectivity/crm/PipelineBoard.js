'use client';

import { useState } from 'react';
import { MoreHorizontal, Plus, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLUMNS = [
    { id: 'new', title: 'Nuevo Lead', color: 'bg-blue-500' },
    { id: 'contacted', title: 'Contactado', color: 'bg-yellow-500' },
    { id: 'pitch', title: 'Propuesta', color: 'bg-purple-500' },
    { id: 'won', title: 'Cerrado Ganado', color: 'bg-green-500' },
];

const INITIAL_DEALS = [
    { id: 1, title: 'Campaña Verano', client: 'Restaurante El Carbón', value: '$1,200', stage: 'new' },
    { id: 2, title: 'Video Corporativo', client: 'Constructora XYZ', value: '$2,500', stage: 'contacted' },
    { id: 3, title: 'Manejo de Redes', client: 'Dr. López', value: '$800/mes', stage: 'pitch' },
    { id: 4, title: 'Sesión de Fotos', client: 'Marca de Ropa', value: '$500', stage: 'won' },
];

export default function PipelineBoard({ onSelectLead }) {
    const [deals, setDeals] = useState(INITIAL_DEALS);

    const moveDeal = (dealId, direction, e) => {
        e.stopPropagation(); // Prevent opening detail when moving
        setDeals(prev => prev.map(deal => {
            if (deal.id !== dealId) return deal;
            const currentIndex = COLUMNS.findIndex(col => col.id === deal.stage);
            let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
            if (newIndex < 0 || newIndex >= COLUMNS.length) return deal;
            return { ...deal, stage: COLUMNS[newIndex].id };
        }));
    };

    return (
        <div className="h-full overflow-x-auto pb-4">
            <div className="flex gap-4 h-full min-w-[1000px]">
                {COLUMNS.map((col) => (
                    <div key={col.id} className="w-80 flex-shrink-0 flex flex-col h-full bg-white/5 rounded-xl border border-white/5">
                        {/* Column Header */}
                        <div className="p-4 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${col.color}`} />
                                <h4 className="font-bold text-sm text-gray-200 uppercase tracking-wide">{col.title}</h4>
                                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                                    {deals.filter(d => d.stage === col.id).length}
                                </span>
                            </div>
                            <button className="text-gray-500 hover:text-white p-1 rounded hover:bg-white/10">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Deals List */}
                        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                            <AnimatePresence mode="popLayout">
                                {deals.filter(d => d.stage === col.id).map((deal) => (
                                    <motion.div
                                        key={deal.id}
                                        layoutId={deal.id}
                                        onClick={() => onSelectLead && onSelectLead(deal)}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        whileHover={{ y: -2 }}
                                        drag
                                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                        dragElastic={0.1}
                                        className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors cursor-pointer active:cursor-grabbing shadow-sm group relative"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] text-blue-300 font-bold bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">{deal.value}</span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => moveDeal(deal.id, 'prev', e)}
                                                    disabled={col.id === 'new'}
                                                    className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded disabled:opacity-30"
                                                >
                                                    <ArrowLeft className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={(e) => moveDeal(deal.id, 'next', e)}
                                                    disabled={col.id === 'won'}
                                                    className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded disabled:opacity-30"
                                                >
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                        <h5 className="font-bold text-white text-sm mb-1">{deal.title}</h5>
                                        <p className="text-xs text-gray-400">{deal.client}</p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
