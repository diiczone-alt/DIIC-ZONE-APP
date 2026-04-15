'use client';

import { motion } from 'framer-motion';
import {
    Clock, Calendar, MessageSquare, MoreHorizontal, CheckCircle,
    AlertCircle, Play, FileText, Camera, Video, Mic, PenTool, Globe, Printer
} from 'lucide-react';

export default function ProductionItem({ item, viewMode, onClick }) {

    // Status Logic
    const SLA_COLORS = {
        'on-track': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        'risk': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        'delayed': 'text-red-400 bg-red-500/10 border-red-500/20'
    };

    const STATUS_LABELS = {
        'on-track': 'A tiempo',
        'risk': 'En Riesgo',
        'delayed': 'Retrasado'
    };

    // Department Icons & Colors
    const DEPT_CONFIG = {
        'video': { icon: Video, color: 'text-blue-400', badge: 'bg-blue-500/10 border-blue-500/20' },
        'design': { icon: PenTool, color: 'text-pink-400', badge: 'bg-pink-500/10 border-pink-500/20' },
        'filmmaker': { icon: Camera, color: 'text-purple-400', badge: 'bg-purple-500/10 border-purple-500/20' },
        'audio': { icon: Mic, color: 'text-orange-400', badge: 'bg-orange-500/10 border-orange-500/20' },
        'web': { icon: Globe, color: 'text-cyan-400', badge: 'bg-cyan-500/10 border-cyan-500/20' },
        'print': { icon: Printer, color: 'text-yellow-400', badge: 'bg-yellow-500/10 border-yellow-500/20' },
    };

    const DeptIcon = DEPT_CONFIG[item.department]?.icon || FileText;
    const deptStyle = DEPT_CONFIG[item.department] || { color: 'text-gray-400', badge: 'bg-gray-500/10 border-gray-500/20' };

    // Pipeline Steps Visualization
    const STEPS = ['start', 'production', 'review', 'approval', 'copy', 'scheduled', 'published'];
    const currentStepIndex = STEPS.indexOf(item.status);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            className={`group bg-[#0E0E18] border border-white/5 hover:border-indigo-500/30 rounded-2xl overflow-hidden cursor-pointer transition-all ${viewMode === 'list' ? 'p-4 flex flex-col lg:flex-row gap-6 items-center' : 'p-5 flex flex-col'}`}
        >

            {/* 1. Thumbnail & Basic Info */}
            <div className={`flex items-center gap-4 ${viewMode === 'list' ? 'lg:w-1/3' : 'w-full mb-4'}`}>
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                    <img src={item.thumbnail} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        {/* Type Icon Overlay */}
                        <DeptIcon className={`w-6 h-6 ${deptStyle.color} drop-shadow-lg`} />
                    </div>
                </div>
                <div className="min-w-0">
                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 px-2 py-0.5 rounded-full inline-block border ${deptStyle.badge} ${deptStyle.color}`}>
                        {item.type}
                    </div>
                    <h3 className="text-white font-bold leading-tight truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500">ID: {item.id} • {item.owner}</p>
                </div>
            </div>

            {/* 2. Pipeline Steps (The "Subway Map") */}
            <div className={`flex-1 w-full ${viewMode === 'list' ? '' : 'mb-6'}`}>
                <div className="relative flex justify-between items-center">
                    {/* Progress Line Background */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-800 z-0"></div>
                    {/* Active Progress Line */}
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-500 z-0 transition-all duration-500"
                        style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                    ></div>

                    {STEPS.map((step, index) => {
                        const isActive = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        return (
                            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${isActive
                                        ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                                        : 'bg-[#0E0E18] border-gray-700'
                                    }`}></div>
                                {/* Label only for start, end, and current to avoid clutter */}
                                <span className={`absolute top-5 text-[9px] font-bold uppercase whitespace-nowrap transition-colors ${isCurrent ? 'text-white' : 'text-gray-600'
                                    } ${viewMode === 'grid' && !isCurrent ? 'hidden' : ''}`}>
                                    {step}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* 3. SLA & Dates */}
            <div className={`flex items-center gap-4 justify-end ${viewMode === 'list' ? 'lg:w-[200px]' : 'w-full justify-between border-t border-white/5 pt-4'}`}>

                {/* Due Date */}
                <div className="text-right">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Entrega</div>
                    <div className="text-xs font-bold text-white flex items-center justify-end gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" /> {item.targetDate}
                    </div>
                </div>

                {/* SLA Status */}
                <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-2 ${SLA_COLORS[item.sla]}`}>
                    {item.sla === 'on-track' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {viewMode === 'list' ? STATUS_LABELS[item.sla] : ''}
                </div>
            </div>

        </motion.div>
    );
}
