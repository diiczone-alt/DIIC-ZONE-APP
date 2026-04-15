'use client';

import { BookOpen, Copy, Plus, Search, ChevronRight } from 'lucide-react';

const scripts = [
    { id: 1, title: 'Cierre de Ventas (High Ticket)', category: 'Cierre', content: 'Entiendo que es una inversión importante. Sin embargo, si consideramos el retorno que obtendrá en los primeros 3 meses, el sistema se paga solo. ¿Prefiere iniciar con el plan Trimestral o Semestral?' },
    { id: 2, title: 'Manejo de Objeción "Muy Caro"', category: 'Objeciones', content: 'Comprendo. ¿Lo estás comparando con otra opción o simplemente te parece alto el número? Porque si comparamos valor vs precio, nuestra solución incluye X, Y y Z que otros cobran aparte.' },
    { id: 3, title: 'Bienvenida (Lead Frío)', category: 'Apertura', content: 'Hola [Nombre], vi que mostraste interés en mejorar tus ventas. Ayudo a empresas como [Su Nicho] a escalar. ¿Te gustaría ver un caso de éxito rápido?' },
];

export default function SalesPlaybook() {
    return (
        <div className="flex-1 h-full bg-[#050511] overflow-y-auto custom-scrollbar p-8">

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Playbook de Ventas</h2>
                    <p className="text-gray-400 text-sm">Biblioteca de guiones ganadores para todo el equipo.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                    <Plus className="w-5 h-5" /> Nuevo Script
                </button>
            </div>

            {/* Config / Categories */}
            <div className="flex gap-4 overflow-x-auto pb-4 mb-4">
                {['Todos', 'Apertura', 'Cualificación', 'Presentación', 'Objeciones', 'Cierre'].map((cat, i) => (
                    <button key={cat} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border ${i === 0 ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-[#151520] text-gray-400 border-white/5 hover:text-white'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Buscar guión por palabra clave..."
                    className="w-full bg-[#0E0E18] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scripts.map(script => (
                    <div key={script.id} className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                            <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-gray-400 uppercase tracking-wider font-bold border border-white/5">
                                {script.category}
                            </span>
                            <button className="text-gray-500 hover:text-white">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-3 leading-tight">{script.title}</h3>
                        <div className="flex-1 bg-[#151520] rounded-xl p-3 mb-4">
                            <p className="text-sm text-gray-400 italic">"{script.content}"</p>
                        </div>
                        <button className="w-full py-2 flex items-center justify-center gap-2 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl text-sm font-bold transition-colors">
                            Usar este Guión <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
