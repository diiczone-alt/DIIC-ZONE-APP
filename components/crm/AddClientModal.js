'use client';

import { useState } from 'react';
import { X, Save, Building, User } from 'lucide-react';

export default function AddClientModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        plan: 'BASIC'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would call an API
        console.log('New Client Data:', formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0E0E18] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-500" />
                    Nuevo Cliente
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-[#1A1A24] border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                            placeholder="Ej. Roberto Gómez"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Empresa</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full bg-[#1A1A24] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                placeholder="Ej. Tech Solutions"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[#1A1A24] border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                placeholder="contacto@empresa.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Teléfono</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-[#1A1A24] border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                placeholder="+1 234 567 890"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Plan Inicial</label>
                        <select
                            name="plan"
                            value={formData.plan}
                            onChange={handleChange}
                            className="w-full bg-[#1A1A24] border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none"
                        >
                            <option value="BASIC">Básico (Start)</option>
                            <option value="PRO">Pro (Growth)</option>
                            <option value="PREMIUM">Premium (Scale)</option>
                            <option value="CORPORATE">Corporativo (Custom)</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-sm font-bold transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Guardar Cliente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
