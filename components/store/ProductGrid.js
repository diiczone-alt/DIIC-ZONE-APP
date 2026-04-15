'use client';

import { useState } from 'react';
import {
    MoreVertical, Edit2, Link as LinkIcon, Trash2,
    Eye, Search, Filter, Plus
} from 'lucide-react';

const mockProducts = [
    {
        id: 1,
        name: 'Paquete Branding Médico',
        category: 'Servicio',
        price: '$450',
        status: 'Activo',
        sales: 12,
        image: 'https://images.unsplash.com/photo-1576091160550-217359f48f4c?auto=format&fit=crop&q=80&w=200'
    },
    {
        id: 2,
        name: 'Curso: Automatización CRM',
        category: 'Digital',
        price: '$99',
        status: 'Activo',
        sales: 45,
        image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=200'
    },
    {
        id: 3,
        name: 'Sesión Consultoría 1h',
        category: 'Servicio',
        price: '$150',
        status: 'Pausado',
        sales: 8,
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200'
    },
    {
        id: 4,
        name: 'Pack 10 Reels Editados',
        category: 'Creativo',
        price: '$300',
        status: 'Activo',
        sales: 24,
        image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=200'
    },
];

export default function ProductGrid() {
    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, categoría o etiqueta..."
                        className="w-full bg-[#0E0E18] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#151520] border border-white/10 rounded-xl text-gray-400 hover:text-white text-sm font-medium">
                    <Filter className="w-4 h-4" /> Categorías
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}

                {/* Empty State / Add New Card */}
                <button className="border-2 border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/5 hover:border-orange-500/50 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-orange-400 transition-colors">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-gray-500 group-hover:text-white transition-colors">Añadir Nuevo</span>
                </button>
            </div>
        </div>
    );
}

function ProductCard({ product }) {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all group">
            {/* Image Preview */}
            <div className="h-40 relative overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${product.status === 'Activo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {product.status}
                    </span>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-black/60 rounded-lg backdrop-blur-md text-white hover:bg-black/80">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div>
                    <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">{product.category}</p>
                    <h4 className="text-white font-bold truncate mt-0.5">{product.name}</h4>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">{product.price}</span>
                    <span className="text-xs text-gray-500">{product.sales} ventas</span>
                </div>

                <div className="flex gap-2 pt-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#151520] hover:bg-[#20202a] text-white rounded-lg text-xs font-bold border border-white/5 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" /> Editar
                    </button>
                    <button className="px-3 flex items-center justify-center bg-[#151520] hover:bg-[#20202a] text-white rounded-lg border border-white/5 transition-colors" title="Copiar link de pago">
                        <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
