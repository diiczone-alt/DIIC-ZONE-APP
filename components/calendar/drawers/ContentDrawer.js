'use client';

import { Instagram, Linkedin, Video, Image as ImageIcon, CalendarClock, ArrowUpRight } from 'lucide-react';
import CalendarDrawer from './CalendarDrawer';

export default function ContentDrawer({ isOpen, onClose }) {
    // Mock Data
    const contentItems = [
        { id: 1, date: '22 Ene', type: 'Reel', title: 'Lanzamiento', platform: 'Instagram', status: 'scheduled' },
        { id: 2, date: '24 Ene', type: 'Carrusel', title: 'Tips de Salud', platform: 'LinkedIn', status: 'pending' },
        { id: 3, date: '28 Ene', type: 'Story', title: 'Promo Flash', platform: 'Instagram', status: 'published' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'published': return 'bg-green-500/10 text-green-400 border-green-500/20';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    return (
        <CalendarDrawer
            isOpen={isOpen}
            onClose={onClose}
            title="Agenda de Contenido"
            icon={ImageIcon}
            color="text-blue-400"
        >
            <div className="space-y-4">
                {contentItems.map(item => (
                    <div key={item.id} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-white">{item.date.split(' ')[0]}</span>
                                <span className="text-xs uppercase font-bold text-gray-500 pt-1">{item.date.split(' ')[1]}</span>
                            </div>
                            <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getStatusStyle(item.status)}`}>
                                {item.status === 'scheduled' ? 'Programado' : item.status === 'pending' ? 'Borrador' : 'Publicado'}
                            </div>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{item.title}</h4>

                        <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                {item.type === 'Reel' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                                {item.type}
                            </span>
                            <span className="flex items-center gap-1">
                                {item.platform === 'Instagram' ? <Instagram className="w-3 h-3" /> : <Linkedin className="w-3 h-3" />}
                                {item.platform}
                            </span>
                        </div>

                        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                            <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                                Abrir Proyecto <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                ))}

                <button className="w-full py-3 mt-4 border border-dashed border-white/10 hover:border-blue-500/50 text-gray-500 hover:text-blue-400 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                    <CalendarClock className="w-4 h-4" /> Programar Nuevo Post
                </button>
            </div>
        </CalendarDrawer>
    );
}
