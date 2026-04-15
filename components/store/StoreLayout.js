'use client';

import { useState } from 'react';
import {
    ShoppingBag, Package, ListOrdered, Tag,
    Plus, Search, Filter, ChevronRight, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductGrid from './ProductGrid';

export default function StoreLayout() {
    const [activeTab, setActiveTab] = useState('products');

    const navItems = [
        { id: 'products', label: 'Productos', icon: Package },
        { id: 'orders', label: 'Órdenes', icon: ListOrdered },
        { id: 'discounts', label: 'Cupones & Desc.', icon: Tag },
        { id: 'inventory', label: 'Inventario', icon: ShoppingBag },
    ];

    return (
        <div className="flex-1 h-full bg-[#050511] overflow-hidden flex flex-col">
            {/* Header / Sub-nav */}
            <div className="h-16 border-b border-white/5 bg-[#0E0E18] flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-sm">Tienda Digital</h2>
                        <div className="flex gap-4 mt-1">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`text-xs font-bold transition-colors ${activeTab === item.id ? 'text-orange-400' : 'text-gray-500 hover:text-white'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-orange-600/20 transition-colors">
                        <Plus className="w-4 h-4" /> Nuevo Producto
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                {activeTab === 'products' && <ProductGrid />}
                {activeTab === 'orders' && <div className="text-white">Próximamente: Gestión de Órdenes</div>}
                {activeTab === 'inventory' && <div className="text-white">Próximamente: Control de Inventario</div>}
                {activeTab === 'discounts' && <div className="text-white">Próximamente: Cupones y Descuentos</div>}
            </div>
        </div>
    );
}
