'use client';

import { useState } from 'react';
import { ArrowRight, Zap, PlayCircle, Clock } from 'lucide-react';

export default function RecipeCard({ title, description, trigger, action, active = false, icon: Icon }) {
    const [isActive, setIsActive] = useState(active);

    return (
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${isActive ? 'bg-gradient-to-br from-blue-900/40 to-black border-blue-500/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
            {/* Status Indicator */}
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${isActive ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/10 text-gray-400'}`}>
                    {Icon ? <Icon className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                </div>
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => setIsActive(!isActive)}
                        className="peer sr-only"
                    />
                    <div
                        onClick={() => setIsActive(!isActive)}
                        className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-600'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${isActive ? 'left-6' : 'left-1'}`} />
                    </div>
                </div>
            </div>

            <h3 className={`text-lg font-bold mb-2 leading-tight ${isActive ? 'text-white' : 'text-gray-300'}`}>{title}</h3>
            <p className="text-sm text-gray-500 mb-6 min-h-[40px]">{description}</p>

            {/* Micro Flow Visual */}
            <div className="flex items-center gap-2 p-3 bg-black/40 rounded-lg border border-white/5 text-xs text-gray-300 mb-4">
                <span className="truncate max-w-[40%] text-blue-300">{trigger}</span>
                <ArrowRight className="w-3 h-3 text-gray-600 flex-shrink-0" />
                <span className="truncate max-w-[40%] text-green-300">{action}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1">
                    <PlayCircle className="w-3 h-3" /> 1.2k runs
                </span>
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Instant
                </span>
            </div>
        </div>
    );
}
