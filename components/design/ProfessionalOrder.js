'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Upload, Calendar, Target, FileText, DollarSign } from 'lucide-react';

const CATEGORIES = [
    { id: 'social', name: 'Redes Sociales', items: ['Carruseles', 'Posts', 'Stories'] },
    { id: 'branding', name: 'Branding & Identidad', items: ['Logo', 'Manual de Marca', 'Rebranding'] },
    { id: 'print', name: 'Impresión & Merch', items: ['Flyers', 'Tarjetas', 'Packaging', 'Lonas'] },
    { id: 'web', name: 'Diseño Web', items: ['Banners', 'Landing Mockups', 'Iconografía'] },
];

export default function ProfessionalOrder({ onBack, onClose }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        category: null,
        subType: null,
        objective: '',
        deadline: '',
        quantity: '', // New field for Print
        files: []
    });

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const renderStep1_Category = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center mb-8">¿Qué tipo de diseño necesitas?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CATEGORIES.map((cat) => (
                    <div
                        key={cat.id}
                        onClick={() => {
                            setFormData({ ...formData, category: cat.id });
                            handleNext();
                        }}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all hover:border-purple-500 bg-[#0E0E15] border-white/5 group`}
                    >
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{cat.name}</h4>
                        <div className="flex flex-wrap gap-2">
                            {cat.items.map((item) => (
                                <span key={item} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep2_Details = () => (
        <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl font-bold text-white text-center">Detalles del Proyecto</h3>

            <div className="space-y-4">
                {formData.category === 'print' && (
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Cantidad Requerida</label>
                        <input
                            type="number"
                            className="w-full bg-[#0E0E15] border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                            placeholder="Ej: 100, 500, 1000"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Objetivo del Diseño</label>
                    <textarea
                        className="w-full bg-[#0E0E15] border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 outline-none h-32"
                        placeholder={formData.category === 'print' ? "Describe el material, acabado y uso..." : "Describe qué quieres lograr, a quién va dirigido..."}
                        value={formData.objective}
                        onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Fecha Ideal</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                            <input
                                type="date"
                                className="w-full bg-[#0E0E15] border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-purple-500 outline-none"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Referencia Visual (Opcional)</label>
                        <div className="border border-dashed border-white/10 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
                            <Upload className="w-4 h-4 text-gray-500" />
                            <span className="text-xs text-gray-400">Subir archivo</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20"
                >
                    Continuar
                </button>
            </div>
        </div>
    );

    const renderStep3_Review = () => (
        <div className="max-w-xl mx-auto text-center space-y-8 py-8">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Todo listo para crear!</h3>
                <p className="text-gray-400">Hemos asignado tu solicitud al equipo de diseño. <br /> Recibirás una notificación cuando el primer borrador esté listo.</p>
            </div>

            <div className="bg-[#0E0E15] p-6 rounded-2xl border border-white/10 text-left space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Categoría:</span>
                    <span className="text-white font-bold capitalize">{CATEGORIES.find(c => c.id === formData.category)?.name}</span>
                </div>
                {formData.category === 'print' && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Cantidad:</span>
                        <span className="text-white font-bold">{formData.quantity || 'N/A'}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Entrega Estimada:</span>
                    <span className="text-white font-bold">48 - 72 Horas</span>
                </div>
                <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                    <span className="text-gray-500">Costo Estimado:</span>
                    <span className={`text-lg font-bold ${formData.category === 'print' ? 'text-yellow-400' : 'text-purple-400'}`}>
                        {formData.category === 'print' ? 'Sujeto a Cotización' : 'Incluido en Plan'}
                    </span>
                </div>
            </div>

            <button
                onClick={onClose}
                className="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
                Entendido, ir al Dashboard
            </button>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col"
        >
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
                <button onClick={step === 1 ? onBack : handlePrev} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">Solicitud Profesional</h2>
                    <div className="flex gap-2 mt-1">
                        <div className={`h-1 w-8 rounded-full ${step >= 1 ? 'bg-purple-500' : 'bg-white/10'}`} />
                        <div className={`h-1 w-8 rounded-full ${step >= 2 ? 'bg-purple-500' : 'bg-white/10'}`} />
                        <div className={`h-1 w-8 rounded-full ${step >= 3 ? 'bg-purple-500' : 'bg-white/10'}`} />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {step === 1 && renderStep1_Category()}
                {step === 2 && renderStep2_Details()}
                {step === 3 && renderStep3_Review()}
            </div>
        </motion.div>
    );
}
