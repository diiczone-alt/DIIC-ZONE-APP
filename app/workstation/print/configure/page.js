'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, Upload, ArrowRight } from 'lucide-react';

export default function ConfigureOrder() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('product');
    const type = searchParams.get('type');

    const [quantity, setQuantity] = useState(100);

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">

            <header className="h-20 border-b border-white/5 flex items-center px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-10">
                <Link href={`/workstation/print?cat=${type}`} className="mr-6 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-white capitalize">{productId?.replace('-', ' ')}</h1>
                    <p className="text-sm text-gray-400">Configuración de pedido</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Setup Form */}
                    <div className="space-y-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-3">Cantidad</label>
                            <div className="grid grid-cols-4 gap-4">
                                {[50, 100, 250, 500, 1000].map(qty => (
                                    <button
                                        key={qty}
                                        onClick={() => setQuantity(qty)}
                                        className={`py-3 rounded-xl border font-bold transition-all ${quantity === qty ? 'bg-white text-black border-white' : 'bg-[#0E0E18] border-white/10 text-gray-400 hover:border-white/30'}`}
                                    >
                                        {qty}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-3">Material / Acabado</label>
                            <select className="w-full bg-[#0E0E18] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-yellow-500 appearance-none cursor-pointer">
                                <option>Estándar (300g Mate)</option>
                                <option>Premium (350g Soft Touch)</option>
                                <option>Ecológico (Kraft Reciclado)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-3">Arte / Diseño</label>
                            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-white/20 transition-colors cursor-pointer group">
                                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2 group-hover:text-white transition-colors" />
                                <p className="text-sm text-gray-400">Arrastra tu archivo aquí o <span className="text-yellow-500 underline">examina</span></p>
                                <p className="text-xs text-gray-600 mt-2">PDF, AI, PSD (Max 50MB)</p>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <input type="checkbox" id="nodesign" className="w-4 h-4 rounded bg-[#0E0E18] border-white/10 text-yellow-500 focus:ring-0" />
                                <label htmlFor="nodesign" className="text-sm text-gray-400">No tengo diseño (Solicitar servicio)</label>
                            </div>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8 h-fit">
                        <h3 className="text-xl font-bold text-white mb-6">Resumen</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Producto Base</span>
                                <span className="text-white">$15.00</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Cantidad ({quantity})</span>
                                <span className="text-white">${(quantity * 0.15).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Acabado</span>
                                <span className="text-white">$5.00</span>
                            </div>
                            <div className="h-px bg-white/5 my-4" />
                            <div className="flex justify-between text-lg font-bold text-white">
                                <span>Total Estimado</span>
                                <span>${(20 + (quantity * 0.15)).toFixed(2)}</span>
                            </div>
                        </div>

                        <Link href={`/workstation/print/providers`}>
                            <button className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-yellow-600/20">
                                Seleccionar Proveedor <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                        <p className="text-xs text-gray-500 text-center mt-4">El precio final puede variar según el proveedor seleccionado.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
