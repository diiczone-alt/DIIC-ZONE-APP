'use client';

import { Search, MessageCircle, Instagram, Facebook } from 'lucide-react';

const MOCK_CONVERSATIONS = [
    { id: 1, name: 'Carlos Rodríguez', platform: 'whatsapp', lastMessage: 'Hola, me interesa agendar una cita...', time: '10:30 AM', unread: 2, tags: ['Lead Nuevo'] },
    { id: 2, name: 'Ana Sofía', platform: 'instagram', lastMessage: '¿Cuál es el precio del paquete video?', time: '09:15 AM', unread: 0, tags: ['Precio'] },
    { id: 3, name: 'Restaurante El Carbon', platform: 'whatsapp', lastMessage: 'Ya enviamos el comprobante de pago.', time: 'Ayer', unread: 1, tags: ['Cliente'] },
    { id: 4, name: 'Juan Diego', platform: 'messenger', lastMessage: 'Gracias por la info.', time: 'Ayer', unread: 0, tags: [] },
];

export default function InboxList({ selectedId, onSelect }) {
    return (
        <div className="flex flex-col h-full border-r border-white/5 bg-black/20 w-80 flex-shrink-0">
            {/* Header / Search */}
            <div className="p-4 border-b border-white/5">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar chat..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-all"
                    />
                </div>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                    <FilterBadge label="Todos" active />
                    <FilterBadge label="No leídos" />
                    <FilterBadge label="Leads" />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {MOCK_CONVERSATIONS.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => onSelect(conv)}
                        className={`p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${selectedId === conv.id ? 'bg-white/5 border-l-2 border-l-blue-500' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h4 className={`font-medium text-sm ${conv.unread ? 'text-white font-bold' : 'text-gray-300'}`}>{conv.name}</h4>
                            <span className="text-xs text-gray-500">{conv.time}</span>
                        </div>
                        <p className={`text-xs line-clamp-1 mb-2 ${conv.unread ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                            {conv.lastMessage}
                        </p>
                        <div className="flex items-center gap-2">
                            <PlatformIcon platform={conv.platform} />
                            {conv.tags.map(tag => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-400">
                                    {tag}
                                </span>
                            ))}
                            {conv.unread > 0 && (
                                <span className="ml-auto bg-green-500 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {conv.unread}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FilterBadge({ label, active }) {
    return (
        <button className={`text-xs px-3 py-1 rounded-full whitespace-nowrap border transition-colors ${active ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'}`}>
            {label}
        </button>
    )
}

function PlatformIcon({ platform }) {
    if (platform === 'whatsapp') return <MessageCircle className="w-3 h-3 text-green-500" />;
    if (platform === 'instagram') return <Instagram className="w-3 h-3 text-pink-500" />;
    if (platform === 'messenger') return <Facebook className="w-3 h-3 text-blue-500" />;
    return <div className="w-3 h-3 bg-gray-500 rounded-full" />;
}
