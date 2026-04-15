'use client';

import { Lock, CheckCircle } from 'lucide-react';

const LEVEL_NAMES = [
    'Creación de Marca',
    'Presencia Digital',
    'Conexión & Confianza',
    'Autoridad',
    'Escalabilidad'
];

export default function GrowthRoadmap({ currentLevel = 3 }) {
    const levels = LEVEL_NAMES.map((name, index) => {
        const id = index + 1;
        let status = 'locked';
        let progress = 0;

        if (id < currentLevel) {
            status = 'completed';
            progress = 100;
        } else if (id === currentLevel) {
            status = 'active';
            progress = 68; // Could be dynamic too if schema supported it per level
        }

        return { id, name, status, progress };
    });

    return (
        <div className="glass-panel p-6 rounded-2xl h-full">
            <h3 className="text-lg font-bold text-white mb-6">Mapa de Crecimiento 🚀</h3>

            <div className="relative space-y-0">
                {/* Connecting Line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-white/10"></div>

                {levels.map((level) => (
                    <div key={level.id} className="relative pl-10 pb-8 last:pb-0 group">
                        {/* Node */}
                        <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 transition-all ${level.status === 'completed' ? 'border-green-500 bg-[#0B0B15]' :
                                level.status === 'active' ? 'border-blue-500 bg-[#0B0B15] shadow-[0_0_15px_rgba(59,130,246,0.5)]' :
                                    'border-gray-700 bg-[#0B0B15]'
                            }`}>
                            {level.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                            {level.status === 'active' && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
                            {level.status === 'locked' && <Lock className="w-3 h-3 text-gray-600" />}
                        </div>

                        {/* Content */}
                        <div className={`transition-opacity ${level.status === 'locked' ? 'opacity-50' : 'opacity-100'}`}>
                            <div className="flex justify-between items-center mb-1">
                                <h4 className={`font-bold ${level.status === 'active' ? 'text-blue-400' : 'text-white'
                                    }`}>Nivel {level.id}: {level.name}</h4>
                                <span className="text-xs font-mono font-bold text-gray-500">{level.progress}%</span>
                            </div>

                            {/* Progress Bar for Active/Completed */}
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${level.status === 'completed' ? 'bg-green-500' :
                                            level.status === 'active' ? 'bg-blue-500' : 'bg-transparent'
                                        }`}
                                    style={{ width: `${level.progress}%` }}
                                ></div>
                            </div>

                            {level.status === 'active' && (
                                <p className="text-xs text-gray-400 mt-2">
                                    Objetivo actual: Consolidar la comunidad y aumentar el engagement en video.
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
