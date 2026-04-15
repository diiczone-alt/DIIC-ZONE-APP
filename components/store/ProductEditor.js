'use client';

import { useState } from 'react';
import {
    X, Upload, Bot, Sparkles, Save,
    DollarSign, Type, Info, CheckCircle2
} from 'lucide-react';

export default function ProductEditor({ product, onClose }) {
    const [isGenerating, setIsGenerating] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-[#0F0F1A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Editar Producto</h3>
                            <p className="text-xs text-gray-500">Configura los detalles y optimiza con IA</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Type className="w-3 h-3" /> Nombre del Producto
                            </label>
                            <input
                                type="text"
                                className="w-full bg-[#151520] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-colors"
                                defaultValue={product?.name}
                                placeholder="Ej. Paquete Branding Pro"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <DollarSign className="w-3 h-3" /> Precio (USD)
                            </label>
                            <input
                                type="text"
                                className="w-full bg-[#151520] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-colors"
                                defaultValue={product?.price?.replace('$', '')}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Description with AI */}
                    <div className="space-y-2 relative">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Info className="w-3 h-3" /> Descripción
                            </label>
                            <button
                                onClick={() => setIsGenerating(true)}
                                className="flex items-center gap-2 text-[10px] font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full hover:bg-purple-500/20 transition-all border border-purple-500/20"
                            >
                                <Sparkles className="w-3 h-3" /> Generar con IA
                            </button>
                        </div>
                        <textarea
                            rows={4}
                            className="w-full bg-[#151520] border border-white/5 rounded-2xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-colors resize-none"
                            placeholder="Describe los beneficios y características de tu producto..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Imagen del Producto</label>
                        <div className="h-40 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-orange-500/30 transition-all group cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-600 group-hover:text-orange-400 transition-colors" />
                            <p className="text-xs text-gray-500">Arrastra una imagen o haz clic para subir</p>
                        </div>
                    </div>

                    {/* Type Select */}
                    <div className="grid grid-cols-3 gap-3">
                        {['Digital', 'Servicio', 'Físico'].map(type => (
                            <button
                                key={type}
                                className={`py-3 rounded-xl border text-sm font-bold transition-all ${(product?.category === type || (type === 'Digital' && !product))
                                        ? 'bg-orange-500/10 border-orange-500 text-orange-400'
                                        : 'bg-[#151520] border-white/5 text-gray-500 hover:text-white'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-[#0E0E18] flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors">
                        Cancelar
                    </button>
                    <button className="px-8 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-600/20 transition-all flex items-center gap-2">
                        <Save className="w-4 h-4" /> Guardar Producto
                    </button>
                </div>
            </div>
        </div>
    );
}
