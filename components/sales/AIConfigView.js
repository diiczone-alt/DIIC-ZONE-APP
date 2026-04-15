'use client';

import { useState } from 'react';
import { Bot, Save, Sliders, Upload, Zap, MessageSquare } from 'lucide-react';

export default function AIConfigView() {
    return (
        <div className="flex-1 h-full bg-[#050511] overflow-y-auto custom-scrollbar p-8">

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Configuración del Agente IA</h2>
                    <p className="text-gray-400 text-sm">Personaliza la personalidad, conocimiento y reglas de tu vendedor digital.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                    <Save className="w-5 h-5" /> Guardar Cambios
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Persona Settings */}
                <div className="space-y-6">
                    <SectionHeader icon={Bot} title="Personalidad del Agente" />

                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Nombre del Agente" placeholder="Ej. Ana de Ventas" value="Sofía IA" />
                            <InputGroup label="Rol / Cargo" placeholder="Ej. Asistente Comercial" value="Senior Sales Rep" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Tono de Voz</label>
                            <div className="grid grid-cols-3 gap-3">
                                <ToneButton label="Formal" />
                                <ToneButton label="Empático" active={true} />
                                <ToneButton label="Entusiasta" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Uso de Emojis</label>
                            <input type="range" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Ninguno</span>
                                <span>Moderado</span>
                                <span>Frecuente</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Knowledge Base */}
                <div className="space-y-6">
                    <SectionHeader icon={Upload} title="Base de Conocimiento (RAG)" />

                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 space-y-4">
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-500 mb-2" />
                            <p className="text-sm text-gray-300 font-bold">Sube tus PDFs o Textos</p>
                            <p className="text-xs text-gray-500">Precios, Catálogos, FAQS</p>
                        </div>

                        <div className="space-y-2">
                            <FileItem name="Lista_Precios_2024.pdf" size="1.2 MB" />
                            <FileItem name="Manual_Objeciones.pdf" size="850 KB" />
                        </div>
                    </div>

                    <SectionHeader icon={Zap} title="Reglas de Handoff (Paso a Humano)" />
                    <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between p-3 bg-[#151520] rounded-xl border border-white/5 mb-2">
                            <span className="text-sm text-white">Si detecta intención de compra alta</span>
                            <Switch active={true} />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#151520] rounded-xl border border-white/5 mb-2">
                            <span className="text-sm text-white">Si el usuario pide hablar con humano</span>
                            <Switch active={true} />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#151520] rounded-xl border border-white/5">
                            <span className="text-sm text-white">Si no sabe la respuesta (Alucinación)</span>
                            <Switch active={true} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

function SectionHeader({ icon: Icon, title }) {
    return (
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            <Icon className="w-5 h-5 text-indigo-400" />
            {title}
        </h3>
    )
}

function InputGroup({ label, placeholder, value }) {
    return (
        <div>
            <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
            <input
                type="text"
                defaultValue={value}
                placeholder={placeholder}
                className="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
        </div>
    )
}

function ToneButton({ label, active }) {
    return (
        <button className={`py-2 rounded-xl text-sm font-medium border transition-all ${active ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' : 'bg-[#151520] border-white/10 text-gray-400 hover:text-white'}`}>
            {label}
        </button>
    )
}

function Switch({ active }) {
    return (
        <div className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${active ? 'bg-indigo-600' : 'bg-gray-700'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${active ? 'translate-x-4' : ''}`}></div>
        </div>
    )
}

function FileItem({ name, size }) {
    return (
        <div className="flex items-center justify-between p-3 bg-[#151520] rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500">
                    <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-sm font-bold text-white">{name}</p>
                    <p className="text-[10px] text-gray-500">{size}</p>
                </div>
            </div>
            <button className="text-xs text-red-400 hover:text-red-300">Eliminar</button>
        </div>
    )
}
