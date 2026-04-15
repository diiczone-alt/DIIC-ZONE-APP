'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Palette, Type } from 'lucide-react';
import { toast } from 'sonner';

export default function BrandIdentityStep({ onNext, updateData }) {
    const [logo, setLogo] = useState(null);
    const [colors, setColors] = useState({ primary: '#6366f1', secondary: '#ec4899' });

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(URL.createObjectURL(file));
            toast.success('Logo cargado correctamente');
        }
    };

    const handleSubmit = () => {
        if (!logo) {
            toast.error('Por favor, sube tu logotipo para continuar');
            return;
        }
        updateData({ logo, colors });
        onNext();
    };

    return (
        <div className="space-y-8 text-center h-full flex flex-col">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Identidad Visual</h2>
                <p className="text-gray-400">Personalizaremos tu dashboard con tu marca.</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Logo Upload */}
                <div className="space-y-4">
                    <label className="block w-full aspect-video rounded-3xl border-2 border-dashed border-white/20 hover:border-indigo-500/50 hover:bg-white/5 transition-all cursor-pointer relative group overflow-hidden flex flex-col items-center justify-center">
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        {logo ? (
                            <img src={logo} alt="Logo Preview" className="w-1/2 h-1/2 object-contain z-10" />
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-white" />
                                </div>
                                <span className="text-sm font-bold text-gray-400">Sube tu Logotipo</span>
                                <span className="text-xs text-gray-600 mt-1">PNG, SVG (Max 5MB)</span>
                            </>
                        )}
                        <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </label>
                </div>

                {/* Colors */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Palette className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-lg font-bold">Paleta de Colores</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Color Primario</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={colors.primary}
                                    onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                                />
                                <span className="font-mono text-sm bg-black/30 px-3 py-2 rounded-lg">{colors.primary}</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Color Secundario</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={colors.secondary}
                                    onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                                />
                                <span className="font-mono text-sm bg-black/30 px-3 py-2 rounded-lg">{colors.secondary}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:scale-[1.02] transition-transform"
            >
                Confirmar Identidad
            </button>
        </div>
    );
}
