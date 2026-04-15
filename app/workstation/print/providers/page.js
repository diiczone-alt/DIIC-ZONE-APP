'use client';

import { MapPin, Star, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProviderMap() {
    // Mock Providers
    const providers = [
        { id: 1, name: "Imprenta Rápida Centro", rating: 4.8, distance: "1.2 km", time: "24h", price: "Económico" },
        { id: 2, name: "Grafix Pro Lab", rating: 5.0, distance: "3.5 km", time: "48h", price: "Premium" },
        { id: 3, name: "Print & Go Norte", rating: 4.5, distance: "5.0 km", time: "4h Express", price: "Alto" },
    ];

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <header className="h-20 border-b border-white/5 flex items-center px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-10">
                <div>
                    <h1 className="text-xl font-bold text-white">Selecciona tu Proveedor</h1>
                    <p className="text-sm text-gray-400">Elige dónde quieres que se produzca tu pedido.</p>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* List */}
                <div className="w-full lg:w-[450px] border-r border-white/5 overflow-y-auto p-6 space-y-4 bg-[#050511] z-10">
                    {providers.map(p => (
                        <div key={p.id} className="bg-[#0E0E18] border border-white/5 p-6 rounded-2xl hover:border-yellow-500/30 transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white group-hover:text-yellow-400 transition-colors">{p.name}</h3>
                                <div className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                                    <Star className="w-3 h-3 fill-current" /> {p.rating}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.distance}</span>
                                <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> {p.time}</span>
                                <span className="text-emerald-400">{p.price}</span>
                            </div>
                            <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 transition-colors">
                                Seleccionar este proveedor
                            </button>
                        </div>
                    ))}
                </div>

                {/* Map Placeholder */}
                <div className="flex-1 bg-[#0A0A0E] relative flex items-center justify-center">
                    <div className="absolute inset-0 opacity-30 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-99.1332,19.4326,12,0/800x600?access_token=YOUR_TOKEN')] bg-cover bg-center grayscale" />

                    <div className="relative z-10 bg-black/80 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center max-w-sm">
                        <MapPin className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Explora en el Mapa</h3>
                        <p className="text-gray-400 text-sm mb-6">Encuentra imprentas cercanas a tu ubicación o a la zona de entrega.</p>
                        <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 transition-colors">
                            Usar mi ubicación actual
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
