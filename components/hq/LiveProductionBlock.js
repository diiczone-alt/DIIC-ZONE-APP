'use client';

import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LiveProductionBlock() {
    const projects = [
        { name: 'Lanzamiento Dr. Smith', client: 'Clínica Smith', owner: 'Ana G.', status: 'En Proceso', time: '4h', delay: false },
        { name: 'Reels Gimnasio Power', client: 'Power Gym', owner: 'Carlos R.', status: 'Retrasado', time: '-2h', delay: true },
        { name: 'Campaña Black Friday', client: 'Ecom Store', owner: 'Sofia M.', status: 'Revisión', time: '12h', delay: false },
        { name: 'Edición Podcast Ep.4', client: 'Marca Personal', owner: 'Pedro L.', status: 'En Proceso', time: '6h', delay: false },
        { name: 'Diseño Feed Instagram', client: 'Restaurante X', owner: 'Ana G.', status: 'Pendiente', time: '24h', delay: false },
    ];

    return (
        <div className="p-6 rounded-3xl bg-[#0E0E18] border border-white/5 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 flex justify-between items-center">
                <span>Producción en Vivo</span>
                <button className="text-xs text-indigo-400 hover:text-white transition-colors">Ver Todo</button>
            </h3>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-500 border-b border-white/5">
                            <th className="pb-3 font-medium uppercase tracking-wider pl-2">Proyecto</th>
                            <th className="pb-3 font-medium uppercase tracking-wider">Cliente</th>
                            <th className="pb-3 font-medium uppercase tracking-wider">Responsable</th>
                            <th className="pb-3 font-medium uppercase tracking-wider">Estado</th>
                            <th className="pb-3 font-medium uppercase tracking-wider">Tiempo Est.</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {projects.map((proj, i) => (
                            <tr key={i} className="group border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                <td className="py-3 pl-2 font-medium text-white group-hover:text-indigo-400 transition-colors">
                                    {proj.name}
                                </td>
                                <td className="py-3 text-gray-400">{proj.client}</td>
                                <td className="py-3 text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-gray-700 text-[10px] flex items-center justify-center text-white">
                                            {proj.owner.charAt(0)}
                                        </div>
                                        {proj.owner}
                                    </div>
                                </td>
                                <td className="py-3">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${proj.delay
                                            ? 'bg-red-500/10 text-red-400'
                                            : proj.status === 'Revisión'
                                                ? 'bg-yellow-500/10 text-yellow-400'
                                                : 'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${proj.delay ? 'bg-red-500' : proj.status === 'Revisión' ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`} />
                                        {proj.status}
                                    </span>
                                </td>
                                <td className={`py-3 font-mono font-medium ${proj.delay ? 'text-red-400' : 'text-gray-400'}`}>
                                    {proj.time}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
