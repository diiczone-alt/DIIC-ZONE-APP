'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    Printer, ShoppingBag, ArrowRight, Search, Filter,
    Star, Tag, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrintClientHub() {
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get('cat') || 'print'; // 'print' or 'merch'

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">

            {/* Header */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        {activeCategory === 'print' ? 'Imprenta Digital' : 'Merchandising & Branding'}
                        <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-lg border border-white/5 uppercase">
                            Catálogo
                        </span>
                    </h1>
                    <p className="text-sm text-gray-400">Material publicitario y corporativo de alta calidad.</p>
                </div>

                <div className="flex bg-[#0E0E18] p-1 rounded-xl border border-white/10">
                    <Link href="/workstation/print?cat=print">
                        <button className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === 'print' ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-600/20' : 'text-gray-400 hover:text-white'}`}>
                            Impresión
                        </button>
                    </Link>
                    <Link href="/workstation/print?cat=merch">
                        <button className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === 'merch' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-gray-400 hover:text-white'}`}>
                            Merch
                        </button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8">

                {/* Search & Filter */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder={`Buscar en ${activeCategory === 'print' ? 'impresión' : 'merch'}...`}
                            className="w-full bg-[#0E0E18] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatePresence mode="wait">
                        {activeCategory === 'print' ? <PrintProducts /> : <MerchProducts />}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}

function PrintProducts() {
    const products = [
        { id: 'business-cards', title: 'Tarjetas de Presentación', price: 'Desde $15.00', image: 'https://images.unsplash.com/photo-1593988647970-891d4ffbc06b?auto=format&fit=crop&q=80&w=800' },
        { id: 'flyers', title: 'Flyers Promocionales', price: 'Desde $25.00', image: 'https://images.unsplash.com/photo-1576158673752-19c8f00dbef6?auto=format&fit=crop&q=80&w=800' },
        { id: 'brochures', title: 'Trípticos / Folletos', price: 'Desde $40.00', image: 'https://images.unsplash.com/photo-1596263576925-50e501a35548?auto=format&fit=crop&q=80&w=800' },
        { id: 'posters', title: 'Afiches & Posters', price: 'Desde $10.00', image: 'https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?auto=format&fit=crop&q=80&w=800' },
        { id: 'banners', title: 'Lonas & Pendones', price: 'Desde $35.00', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800' },
        { id: 'stickers', title: 'Stickers & Etiquetas', price: 'Desde $20.00', image: 'https://images.unsplash.com/photo-1627931494639-65b59762145e?auto=format&fit=crop&q=80&w=800' },
    ];

    return products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} type="print" />
    ));
}

function MerchProducts() {
    const products = [
        { id: 'tshirts', title: 'Camisetas Estampadas', price: 'Desde $12.00', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800' },
        { id: 'caps', title: 'Gorras Bordadas', price: 'Desde $8.00', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800' },
        { id: 'mugs', title: 'Tazas Sublimadas', price: 'Desde $5.00', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800' },
        { id: 'hoodies', title: 'Hoodies / Sudaderas', price: 'Desde $30.00', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800' },
        { id: 'totes', title: 'Bolsas Ecológicas', price: 'Desde $3.50', image: 'https://images.unsplash.com/photo-1590858682059-8692790937a5?auto=format&fit=crop&q=80&w=800' },
    ];

    return products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} type="merch" />
    ));
}

function ProductCard({ product, index, type }) {
    const accentColor = type === 'print' ? 'hover:border-yellow-500/50' : 'hover:border-orange-500/50';
    const btnColor = type === 'print' ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-orange-600 hover:bg-orange-500';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden transition-all ${accentColor} hover:shadow-2xl flex flex-col`}
        >
            <div className="h-48 overflow-hidden relative">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white">
                    {product.price}
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2">{product.title}</h3>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">Calidad premium garantizada. Ideal para promocionar tu marca.</p>

                <div className="mt-auto">
                    <Link href={`/workstation/print/configure?product=${product.id}&type=${type}`}>
                        <button className={`w-full py-2.5 rounded-xl text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 ${btnColor}`}>
                            Configurar <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
