'use client';

import { Camera, Scissors, Package, Clock, ArrowRight } from 'lucide-react';
import CalendarDrawer from './CalendarDrawer';

export default function ProductionDrawer({ isOpen, onClose }) {
    // Mock Data
    const productions = [
        { id: 1, name: 'Entrevista CEO', dept: 'Rodaje', status: 'confirmed', time: 'Vie 24 • 10:00 AM' },
        { id: 2, name: 'Reels Educativos', dept: 'Edición', status: 'in_progress', time: 'Entrega: Lun 27' },
        { id: 3, name: 'Pack Fotos Producto', dept: 'Entrega', status: 'ready', time: 'Listo para descarga' },
    ];

    return (
        <CalendarDrawer
            isOpen={isOpen}
            onClose={onClose}
            title="Flujo de Producción"
            icon={Camera}
            color="text-orange-400"
        >
            <div className="space-y-4">
                {productions.map(item => (
                    <div key={item.id} className="p-4 rounded-xl bg-[#0B0B15] border-l-2 border-orange-500 hover:bg-white/5 transition-all">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">{item.dept}</span>
                            <span className={`w-2 h-2 rounded-full ${item.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-2">{item.name}</h4>

                        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-2 rounded-lg">
                            <Clock className="w-3 h-3" />
                            {item.time}
                        </div>
                    </div>
                ))}

                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
                    <p className="text-xs text-orange-300 mb-3">¿Necesitas agendar un nuevo rodaje?</p>
                    <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-colors">
                        Solicitar Producción
                    </button>
                </div>
            </div>
        </CalendarDrawer>
    );
}
