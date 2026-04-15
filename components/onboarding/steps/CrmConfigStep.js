'use client';

import { useState } from 'react';
import { DollarSign, Tag, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export default function CrmConfigStep({ onNext, updateData }) {
    const [products, setProducts] = useState([
        { id: 1, name: '', price: '' }
    ]);

    const addProduct = () => {
        setProducts([...products, { id: Date.now(), name: '', price: '' }]);
    };

    const updateProduct = (id, field, value) => {
        setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleSubmit = () => {
        const validProducts = products.filter(p => p.name && p.price);
        if (validProducts.length === 0) {
            toast.error('Define al menos un producto o servicio principal');
            return;
        }
        updateData({ products: validProducts });
        onNext();
    };

    return (
        <div className="space-y-6 text-center h-full flex flex-col">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Configuración CRM</h2>
                <p className="text-gray-400">Pre-cargaremos tus servicios para que puedas cotizar hoy mismo.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[400px]">
                {products.map((p, i) => (
                    <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-center animate-in slide-in-from-bottom-2 fade-in">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                            <Tag className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <input
                                type="text"
                                placeholder="Nombre del Servicio / Producto"
                                value={p.name}
                                onChange={(e) => updateProduct(p.id, 'name', e.target.value)}
                                className="w-full bg-transparent border-b border-white/10 text-white placeholder-gray-500 focus:border-indigo-500 outline-none pb-1"
                            />
                            <div className="relative">
                                <DollarSign className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                <input
                                    type="number"
                                    placeholder="Precio"
                                    value={p.price}
                                    onChange={(e) => updateProduct(p.id, 'price', e.target.value)}
                                    className="w-full bg-transparent border-none text-gray-300 placeholder-gray-600 outline-none pl-4 text-sm"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={addProduct}
                    className="w-full py-3 border border-dashed border-white/20 rounded-2xl text-gray-400 hover:text-white hover:border-white/40 transition-all text-sm font-bold uppercase tracking-widest"
                >
                    + Agregar Otro Servicio
                </button>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-white/10"
            >
                Guardar Configuración
            </button>
        </div>
    );
}
