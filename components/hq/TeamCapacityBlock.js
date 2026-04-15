'use client';

import { motion } from 'framer-motion';

export default function TeamCapacityBlock() {
    const departments = [
        { name: 'Diseño', load: 70, color: 'bg-pink-500' },
        { name: 'Video', load: 85, color: 'bg-purple-500', alert: true },
        { name: 'Audio', load: 40, color: 'bg-cyan-500' },
        { name: 'Foto', load: 60, color: 'bg-blue-500' },
        { name: 'Community', load: 90, color: 'bg-orange-500', alert: true },
    ];

    return (
        <div className="p-6 rounded-3xl bg-[#0E0E18] border border-white/5 h-full">
            <h3 className="text-lg font-bold text-white mb-6 flex justify-between items-center">
                <span>Carga del Equipo</span>
                <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-1 rounded-full">Tiempo Real</span>
            </h3>

            <div className="space-y-6">
                {departments.map((dept, i) => (
                    <div key={i} className="group">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium text-gray-300">{dept.name}</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${dept.alert ? 'text-red-400' : 'text-gray-400'}`}>
                                    {dept.load}%
                                </span>
                                {dept.alert && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-500 font-bold uppercase">
                                        Alta
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${dept.load}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={`h-full ${dept.color} ${dept.alert ? 'animate-pulse' : ''}`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-xs text-gray-500 leading-relaxed">
                    <span className="text-red-400 font-bold">Nota:</span> Video y Community superan el umbral de seguridad (85%). Considerar pausar nuevos ingresos o asignar freelancers.
                </p>
            </div>
        </div>
    );
}
