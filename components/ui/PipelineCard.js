'use client';

import { Calendar, PlayCircle, Image as ImageIcon, Check, Scissors, Eye, FileText, Rocket, Activity, CalendarCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS = [
    { id: 'start', label: 'Inicio', icon: Check },
    { id: 'editing', label: 'Edición', icon: Scissors },
    { id: 'approval', label: 'Aprobación', icon: Eye },
    { id: 'copy', label: 'Copy/Plan', icon: FileText },
    { id: 'ready', label: 'Listo', icon: Rocket },
];

export default function PipelineCard({ item, onUpdateDate, onAdvanceStep }) {

    // Determine current step index based on status flags or status string
    // A simple mapping for this demo
    const statusMap = { 'draft': 0, 'editing': 1, 'approval': 2, 'scheduled': 3, 'published': 4 };
    const currentStepIndex = statusMap[item.status] || 0;

    const typeConfig = {
        'reel': { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-500', label: 'Reel' },
        'post': { color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-500', label: 'Post IG' },
        'video': { color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-500', label: 'Video' },
    };

    const theme = typeConfig[item.type] || typeConfig['reel'];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 border-l-4 ${theme.border} relative overflow-hidden group`}
        >
            {item.status === 'published' || item.status === 'ready' ? (
                <div className="absolute right-0 top-0 p-3 bg-green-500/10 rounded-bl-xl text-green-400 flex items-center gap-2 border-b border-l border-green-500/10 z-10">
                    <CalendarCheck className="w-4 h-4" />
                    <span className="text-xs font-bold">LISTO</span>
                </div>
            ) : null}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Asset Preview */}
                <div className="w-full lg:w-48 aspect-video bg-black/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {item.thumbnail_url ? (
                        <img src={item.thumbnail_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Preview" />
                    ) : (
                        <div className="flex flex-col items-center text-gray-600">
                            {item.type === 'reel' || item.type === 'video' ? <PlayCircle className="w-8 h-8 mb-2" /> : <ImageIcon className="w-8 h-8 mb-2" />}
                            <span className="text-xs">Sin Vista Previa</span>
                        </div>
                    )}
                </div>

                {/* Content Details */}
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${theme.color} ${theme.bg}`}>
                                    {theme.label}
                                </span>
                                <span className="text-xs text-gray-500">#{item.id.slice(0, 4)}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        </div>
                        <div className="text-right mt-6 lg:mt-0">
                            <p className="text-xs text-gray-400 mb-1">Fecha Programada</p>
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-primary/50 transition-colors">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <input
                                    type="date"
                                    value={item.scheduled_date || ''}
                                    onChange={(e) => onUpdateDate(item.id, e.target.value)}
                                    className="bg-transparent text-sm text-white focus:outline-none w-32 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Progress Stepper */}
                    <div className="relative pt-6 pb-2">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2"></div>
                        <div className="relative flex justify-between">
                            {STEPS.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isActive = index === currentStepIndex;
                                const isFuture = index > currentStepIndex;

                                let stepClass = "bg-white/5 text-gray-500 border-white/10"; // Default pending
                                if (isActive) stepClass = "bg-primary text-white border-primary shadow-[0_0_15px_rgba(139,92,246,0.5)] animate-pulse";
                                if (isCompleted && !isActive) stepClass = "bg-green-500 text-white border-green-500";

                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-2 z-10 cursor-pointer" onClick={() => onAdvanceStep(item.id, step.id)}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${stepClass}`}>
                                            <step.icon className="w-4 h-4" />
                                        </div>
                                        <span className={`text-xs font-medium transition-colors ${isActive ? 'text-primary font-bold' : (isCompleted ? 'text-green-500' : 'text-gray-500')
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
