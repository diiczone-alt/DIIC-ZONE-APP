'use client';

import { useState, useEffect } from 'react';
import {
    ShoppingBag, Tag, Link as LinkIcon, Calendar, Mic2,
    Plus, Search, MoreVertical, DollarSign, BarChart2,
    Settings, Package, Clock, Copy, ExternalLink,
    CheckCircle, AlertCircle, Share2, Grid, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { supabase } from '@/lib/supabase';

// ...

export default function StoreDashboard() {
    const [activeTab, setActiveTab] = useState('products');
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [smartLinks, setSmartLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: pData } = await supabase.from('products').select('*');
            if (pData) setProducts(pData);

            const { data: lData } = await supabase.from('smart_links').select('*');
            if (lData) setSmartLinks(lData);

            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-6rem)] rounded-3xl border border-white/10 overflow-hidden bg-[#050511] shadow-2xl ring-1 ring-white/5">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-600/20 rounded-lg text-emerald-500 border border-emerald-500/30">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-wide">COMMERCIAL CENTRAL</h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Tienda • Catálogo • Links</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-[#121212] p-1 rounded-lg border border-white/10">
                        <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'products' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <Package className="w-3.5 h-3.5" /> Productos
                        </button>
                        <button onClick={() => setActiveTab('links')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'links' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <LinkIcon className="w-3.5 h-3.5" /> Smart Links
                        </button>
                        <button onClick={() => setActiveTab('agenda')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'agenda' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <Calendar className="w-3.5 h-3.5" /> Agenda IA
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-white/10">
                        <Plus className="w-3.5 h-3.5" /> Crear Oferta
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative p-8">
                <AnimatePresence mode="wait">

                    {/* --- PRODUCTS TAB --- */}
                    {activeTab === 'products' && (
                        <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col gap-8">

                            {/* Stats */}
                            <div className="grid grid-cols-4 gap-6 shrink-0">
                                <div className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-500"><DollarSign className="w-6 h-6" /></div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">$4.2k</div>
                                        <div className="text-xs text-gray-500 font-bold uppercase">Ventas Mes</div>
                                    </div>
                                </div>
                                <div className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-500"><Package className="w-6 h-6" /></div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">12</div>
                                        <div className="text-xs text-gray-500 font-bold uppercase">Productos Activos</div>
                                    </div>
                                </div>
                                <div className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                                    <div className="p-3 bg-purple-500/20 rounded-xl text-purple-500"><LinkIcon className="w-6 h-6" /></div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">234</div>
                                        <div className="text-xs text-gray-500 font-bold uppercase">Clicks Totales</div>
                                    </div>
                                </div>
                                <div className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                                    <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500"><BarChart2 className="w-6 h-6" /></div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">4.8%</div>
                                        <div className="text-xs text-gray-500 font-bold uppercase">Conversión Global</div>
                                    </div>
                                </div>
                            </div>

                            {/* Catalog Grid */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-white">Catálogo de Ofertas</h2>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Buscar producto..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-[#121212] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 w-64"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map(product => (
                                        <div key={product.id} className="group bg-[#0E0E18] border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col">
                                            <div className="h-40 relative overflow-hidden">
                                                <img src={product.thumb} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/10">
                                                    ${product.price}
                                                </div>
                                                <div className="absolute top-3 left-3">
                                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border bg-black/60 backdrop-blur-md ${product.status === 'active' ? 'text-green-400 border-green-500/30' : 'text-gray-400 border-gray-500/30'}`}>
                                                        {product.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Tag className="w-3 h-3 text-gray-500" />
                                                    <span className="text-xs text-gray-400 uppercase font-bold">{product.type}</span>
                                                </div>
                                                <h3 className="text-white font-bold mb-2 group-hover:text-emerald-400 transition-colors">{product.name}</h3>
                                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                                    <span className="text-xs text-gray-500 font-mono">{product.sales} ventas</span>
                                                    <div className="flex gap-2">
                                                        <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><Settings className="w-4 h-4" /></button>
                                                        <button className="p-1.5 hover:bg-emerald-500/20 rounded-lg text-gray-400 hover:text-emerald-400 transition-colors"><Share2 className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add New Card */}
                                    <button className="bg-[#151520] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-white hover:border-white/30 hover:bg-[#1a1a2e] transition-all min-h-[280px]">
                                        <div className="p-4 rounded-full bg-white/5 border border-white/5 group-hover:bg-emerald-500/20 group-hover:text-emerald-500 transition-colors">
                                            <Plus className="w-8 h-8" />
                                        </div>
                                        <span className="font-bold text-sm">Nuevo Producto</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- SMART LINKS TAB --- */}
                    {activeTab === 'links' && (
                        <motion.div key="links" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex gap-8">
                            <div className="flex-1 bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-6">Generador de Smart Links</h2>
                                <div className="space-y-4">
                                    {smartLinks.map(link => (
                                        <div key={link.id} className="flex items-center justify-between p-4 bg-[#151520] border border-white/5 rounded-xl hover:border-emerald-500/30 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500 ring-1 ring-emerald-500/20">
                                                    <LinkIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold">{link.name}</h3>
                                                    <a href="#" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                                                        {link.url} <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-white">{link.clicks}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase">Clicks</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-emerald-400">{link.conv}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase">Conv.</div>
                                                </div>
                                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"><Copy className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* AI Voice Placeholder */}
                            <div className="w-80 bg-gradient-to-b from-[#1a1a2e] to-[#0E0E18] border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                                <div className="p-4 bg-purple-500/20 rounded-full text-purple-400 mb-4 ring-1 ring-purple-500/30">
                                    <Mic2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Voz Clonada IA</h3>
                                <p className="text-xs text-gray-400 mb-6">Próximamente: Entrena a tu agente para enviar notas de voz personalizadas con tu propia voz.</p>
                                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white transition-colors w-full">Unirse a Waitlist</button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
}
