'use client';

import { Search, Filter, MoreHorizontal, Mail, Phone } from 'lucide-react';

const MOCK_CONTACTS = [
    { id: 1, name: 'Carlos Rodríguez', email: 'carlos@example.com', phone: '+57 300 123 4567', origin: 'WhatsApp', status: 'Lead' },
    { id: 2, name: 'Ana Sofía', email: 'ana@example.com', phone: '+57 300 987 6543', origin: 'Instagram', status: 'Prospecto' },
    { id: 3, name: 'Pedro Pérez', email: 'pedro@restaurante.com', phone: '+57 310 555 1234', origin: 'Facebook', status: 'Cliente' },
];

export default function ContactTable() {
    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden glass-panel">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar contacto..."
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium border border-white/10 transition-colors">
                        <Filter className="w-4 h-4" /> Filtros
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all">
                        + Nuevo Contacto
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200 uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Contacto</th>
                            <th className="px-6 py-4">Origen</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_CONTACTS.map((contact) => (
                            <tr key={contact.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs text-white  font-bold">
                                            {contact.name.charAt(0)}
                                        </div>
                                        {contact.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                                            <Mail className="w-3 h-3" /> {contact.email}
                                        </div>
                                        <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                                            <Phone className="w-3 h-3" /> {contact.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-white/5 px-2 py-1 rounded text-xs border border-white/10">{contact.origin}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${contact.status === 'Cliente' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                        {contact.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="p-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                <span>Mostrando 3 de 45 contactos</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-50">Anterior</button>
                    <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10">Siguiente</button>
                </div>
            </div>
        </div>
    );
}
