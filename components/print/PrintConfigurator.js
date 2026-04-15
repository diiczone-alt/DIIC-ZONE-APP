'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronRight, Check, Upload, Palette,
    CreditCard, CheckCircle, Package, ArrowRight,
    Ruler, PaintBucket, Layers, AlertTriangle, Info
} from 'lucide-react';

const PRODUCT_SPECS = {
    'Tarjetas de Presentación': {
        sizes: ['9 x 5 cm (Estándar)', '8.5 x 5.5 cm (Americano)', '5 x 5 cm (Cuadrada)'],
        materials: ['Couché 300g (Estándar)', 'Couché 350g (Grueso)', 'Opalina 280g (Textura)', 'Kraft (Ecológico)'],
        finishes: ['Mate', 'Brillante', 'Mate + UV Localizado', 'Soft Touch', 'Laminado Mate']
    },
    'Flyers & Volantes': {
        sizes: ['A6 (10x15 cm)', 'A5 (15x21 cm)', 'DL (10x21 cm)', 'Cuadrado (14x14 cm)'],
        materials: ['Couché 115g (Delgado)', 'Couché 150g (Medio)', 'Couché 200g (Premium)', 'Bond 90g'],
        finishes: ['Sin acabado', 'Barniz acuoso', 'Plastificado Mate', 'Plastificado Brillante']
    },
    'Lonas Publicitarias': {
        sizes: ['100 x 100 cm', '200 x 100 cm', '300 x 100 cm', 'Medida Personalizada'],
        materials: ['Lona Frontlit 13oz (Estándar)', 'Lona Mesh (Microperforada)', 'Lona Blackout (Doble faz)'],
        finishes: ['Ojetes Metálicos', 'Bolsillos', 'Refuerzo perimetral', 'Corte al ras']
    },
    // Default fallback
    'default': {
        sizes: ['Pequeño', 'Mediano', 'Grande', 'Personalizado'],
        materials: ['Estándar', 'Premium', 'Ecológico'],
        finishes: ['Ninguno', 'Básico', 'Premium']
    }
};

export default function PrintConfigurator({ category, onComplete, onBack }) {
    const [step, setStep] = useState(1);

    // Use enhanced products list or fallback
    const products = category?.products || ['Producto Genérico'];
    const [selectedProduct, setSelectedProduct] = useState(products[0]);

    // Config State
    const [config, setConfig] = useState({
        quantity: '1000',
        size: '',
        material: '',
        finish: '',
        designOption: null // 'upload' or 'request'
    });

    const currentSpecs = PRODUCT_SPECS[selectedProduct] || PRODUCT_SPECS['default'];

    const handleNext = () => {
        if (step < 5) setStep(step + 1);
        else onComplete({ ...config, product: selectedProduct });
    };

    const updateConfig = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Header / Stepper - Compact Vertical on Mobile, Horizontal on Desktop */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <button
                    onClick={onBack}
                    className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-2"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" /> Cancelar
                </button>
                <div className="flex items-center gap-2">
                    {['Producto', 'Especificaciones', 'Diseño', 'Cotización', 'Pago'].map((label, idx) => {
                        const s = idx + 1;
                        return (
                            <div key={s} className="flex items-center">
                                <div className={`flex flex-col items-center gap-1`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${step === s ? 'bg-yellow-500 border-yellow-500 text-black' :
                                            step > s ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' :
                                                'bg-transparent border-white/10 text-gray-600'
                                        }`}>
                                        {step > s ? <Check className="w-4 h-4" /> : s}
                                    </div>
                                    <span className={`text-[10px] uppercase font-bold hidden md:block ${step === s ? 'text-white' : 'text-gray-600'
                                        }`}>{label}</span>
                                </div>
                                {s < 5 && <div className={`w-8 md:w-16 h-0.5 mx-2 mb-4 ${step > s ? 'bg-yellow-500/50' : 'bg-white/10'}`} />}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Card with step-specific layouts */}
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#0E0E18] border border-white/10 rounded-3xl p-8 min-h-[500px] flex flex-col relative overflow-hidden"
            >
                {/* Step Indicator Background */}
                <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl text-white pointer-events-none">
                    0{step}
                </div>

                {step === 1 && (
                    <div className="flex-grow">
                        <h2 className="text-3xl font-black text-white mb-2">Selecciona el Producto</h2>
                        <p className="text-gray-400 mb-8">Elige el tipo de {category?.title?.toLowerCase() || 'producto'} que necesitas.</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {products.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setSelectedProduct(p)}
                                    className={`p-6 rounded-2xl border text-left transition-all group relative overflow-hidden ${selectedProduct === p
                                            ? 'bg-yellow-500/10 border-yellow-500 text-white'
                                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <span className="font-bold text-lg relative z-10">{p}</span>
                                    {selectedProduct === p && (
                                        <motion.div
                                            layoutId="selectedGlow"
                                            className="absolute inset-0 bg-yellow-500/5 z-0"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex-grow">
                        <h2 className="text-3xl font-black text-white mb-2">Especificaciones Técnicas</h2>
                        <p className="text-gray-400 mb-8">Configura los detalles de producción para {selectedProduct}.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-gray-300 text-sm font-bold mb-3">
                                        <Layers className="w-4 h-4 text-yellow-500" /> Cantidad
                                    </label>
                                    <select
                                        value={config.quantity}
                                        onChange={(e) => updateConfig('quantity', e.target.value)}
                                        className="w-full bg-[#050511] border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 outline-none transition-colors"
                                    >
                                        <option value="100">100 unidades (Mínimo)</option>
                                        <option value="500">500 unidades</option>
                                        <option value="1000">1000 unidades (Recomendado)</option>
                                        <option value="5000">5000 unidades (Mayorista)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-gray-300 text-sm font-bold mb-3">
                                        <Ruler className="w-4 h-4 text-yellow-500" /> Tamaño Final
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {currentSpecs.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => updateConfig('size', size)}
                                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${config.size === size
                                                        ? 'bg-yellow-500/20 border-yellow-500 text-white'
                                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-gray-300 text-sm font-bold mb-3">
                                        <Package className="w-4 h-4 text-yellow-500" /> Material / Papel
                                    </label>
                                    <div className="space-y-2">
                                        {currentSpecs.materials.map(mat => (
                                            <button
                                                key={mat}
                                                onClick={() => updateConfig('material', mat)}
                                                className={`w-full text-left p-3 rounded-xl border text-sm font-medium transition-all ${config.material === mat
                                                        ? 'bg-yellow-500/20 border-yellow-500 text-white'
                                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {mat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-gray-300 text-sm font-bold mb-3">
                                        <PaintBucket className="w-4 h-4 text-yellow-500" /> Acabados
                                    </label>
                                    <select
                                        value={config.finish}
                                        onChange={(e) => updateConfig('finish', e.target.value)}
                                        className="w-full bg-[#050511] border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
                                    >
                                        <option value="">Seleccionar Acabado...</option>
                                        {currentSpecs.finishes.map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex-grow">
                        <h2 className="text-3xl font-black text-white mb-2">Archivos de Diseño</h2>
                        <p className="text-gray-400 mb-8">Para garantizar la mejor calidad, asegúrate de enviar vectores o imágenes en alta resolución (300 DPI).</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                            {/* Upload Option */}
                            <button
                                onClick={() => updateConfig('designOption', 'upload')}
                                className={`relative h-full min-h-[250px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all group overflow-hidden ${config.designOption === 'upload'
                                        ? 'border-yellow-500 bg-yellow-500/5'
                                        : 'border-white/10 hover:border-yellow-500/50 hover:bg-white/5'
                                    }`}
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Upload className={`w-8 h-8 ${config.designOption === 'upload' ? 'text-yellow-500' : 'text-gray-400'}`} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-1">Ya tengo mi diseño</h3>
                                    <p className="text-sm text-gray-500 px-8">Subir PDF, AI, PSD o JPG (Min. 300 DPI, CMYK)</p>
                                </div>

                                {config.designOption === 'upload' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 px-4 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/50 text-xs font-bold text-yellow-200 flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3" /> Archivo listo para Pre-prensa
                                    </motion.div>
                                )}
                            </button>

                            {/* Request Design Option */}
                            <button
                                onClick={() => updateConfig('designOption', 'request')}
                                className={`relative h-full min-h-[250px] border rounded-3xl flex flex-col items-center justify-center gap-4 transition-all group overflow-hidden ${config.designOption === 'request'
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : 'border-white/10 bg-gradient-to-br from-purple-500/5 to-blue-500/5 hover:brightness-125'
                                    }`}
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:rotate-12 transition-transform">
                                    <Palette className={`w-8 h-8 ${config.designOption === 'request' ? 'text-purple-400' : 'text-gray-400'}`} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-1">Quiero que lo diseñen</h3>
                                    <p className="text-sm text-gray-500 px-8">Solicitar a un diseñador experto (+ costo adicional)</p>
                                </div>
                            </button>
                        </div>

                        {/* Pre-press info box */}
                        <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3 items-start">
                            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="text-white font-bold mb-1">Nota Técnica de Pre-prensa:</p>
                                <p className="text-gray-400">Si subes tu archivo, recuerda dejar <span className="text-blue-300">3mm de sangrado</span> por cada lado y convertir textos a curvas para evitar errores de fuente.</p>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex-grow">
                        <h2 className="text-3xl font-black text-white mb-6">Cotización Inteligente</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-4">
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-4">Desglose del Pedido</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Producto Base</span>
                                            <span className="text-white font-medium">{selectedProduct}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Cantidad</span>
                                            <span className="text-white font-medium">{config.quantity} unidades</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Especificaciones</span>
                                            <span className="text-white font-medium text-right max-w-[200px]">
                                                {config.size || 'Tamaño Estándar'} • {config.material || 'Material Estándar'}
                                            </span>
                                        </div>
                                        {config.finish && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Acabado Extra</span>
                                                <span className="text-white font-medium">{config.finish} (+$15.00)</span>
                                            </div>
                                        )}
                                        {config.designOption === 'request' && (
                                            <div className="flex justify-between text-sm text-purple-300 bg-purple-500/10 p-2 rounded">
                                                <span className="">Servicio de Diseño</span>
                                                <span className="font-bold">+$25.00</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#12121f] rounded-2xl p-6 border border-yellow-500/20 flex flex-col justify-between">
                                <div>
                                    <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Estimado</span>
                                    <div className="text-4xl font-black text-white mt-2 mb-1">$85.00</div>
                                    <span className="text-xs text-gray-500">Incluye IVA</span>
                                </div>

                                <div className="mt-6 space-y-2">
                                    <div className="flex gap-2 text-xs text-gray-400">
                                        <Clock className="w-4 h-4 text-green-400" />
                                        <span>Producción: <strong>3-4 días hábiles</strong></span>
                                    </div>
                                    <div className="flex gap-2 text-xs text-gray-400">
                                        <Truck className="w-4 h-4 text-blue-400" />
                                        <span>Envío: <strong>Gratis en Ciudad</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="flex-grow text-center flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20 relative">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"
                            />
                            <CreditCard className="w-10 h-10 text-green-500 relative z-10" />
                        </div>

                        <h2 className="text-3xl font-black text-white mb-4">Confirmar Producción</h2>
                        <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
                            Al confirmar, congelaremos el precio y enviaremos la orden a nuestro equipo de pre-prensa para validación inmediata.
                        </p>

                        <div className="flex flex-col w-full max-w-xs gap-3">
                            <button className="w-full py-4 rounded-xl bg-green-500 text-black font-bold uppercase tracking-wider hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20">
                                Pagar con Tarjeta
                            </button>
                            <button className="w-full py-4 rounded-xl bg-white/5 text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-colors border border-white/10">
                                Transferencia
                            </button>
                            <p className="text-xs text-center text-gray-500 mt-2 flex items-center justify-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Pago 100% Seguro y Encriptado
                            </p>
                        </div>
                    </div>
                )}

                {/* Footer Controls */}
                <div className="flex justify-end pt-8 border-t border-white/5 mt-auto">
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-all hover:scale-105 shadow-lg"
                    >
                        {step === 5 ? 'Finalizar Pedido' : 'Siguiente Paso'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>

            {/* Added for import fix */}
            <div className="hidden">
                <Truck /> <Clock />
            </div>
        </div>
    );
}

// Ensure necessary imports are present for the newly added icons
import { Truck, Clock } from 'lucide-react';
