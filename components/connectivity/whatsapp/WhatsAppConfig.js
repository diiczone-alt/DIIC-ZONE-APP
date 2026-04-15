'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Bot, User, Clock, MessageSquare, Briefcase, Tag,
    Plus, Search, Trash2, Smartphone, Zap, Save, CheckCircle2,
    ShieldCheck, Sparkles, Scale, Wifi, RefreshCw, Power // Added icons
} from 'lucide-react';

export default function WhatsAppConfig({ onClose }) {
    const [activeTab, setActiveTab] = useState('mode'); // mode, ai_config, assign, tags, status

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0E0E18] border border-white/10 rounded-3xl w-full max-w-5xl h-[85vh] flex overflow-hidden shadow-2xl"
            >
                {/* Sidebar Navigation */}
                <div className="w-64 bg-[#151520] border-r border-white/5 flex flex-col p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white">WhatsApp</h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] text-emerald-400 font-medium">Online & Listening</span>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1">
                        <NavItem id="mode" label="Modo de Atención" icon={Clock} active={activeTab} onClick={setActiveTab} />
                        <NavItem id="ai_config" label="Personalidad IA" icon={Sparkles} active={activeTab} onClick={setActiveTab} />
                        <NavItem id="assign" label="Asignación Auto" icon={Briefcase} active={activeTab} onClick={setActiveTab} />
                        <NavItem id="tags" label="Etiquetado Inteligente" icon={Tag} active={activeTab} onClick={setActiveTab} />
                        <NavItem id="status" label="Estados de WhatsApp" icon={Smartphone} active={activeTab} onClick={setActiveTab} />
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 px-2">
                            <span>Sincronizado:</span>
                            <span className="text-white flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Hace 2m</span>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-colors">
                            <Save className="w-4 h-4" /> Guardar Todo
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col relative overflow-hidden bg-[#050510]">
                    <div className="flex justify-between items-center p-6 border-b border-white/5">
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {activeTab === 'mode' && 'Modo de Atención'}
                                {activeTab === 'ai_config' && 'Personalidad y Respuestas IA'}
                                {activeTab === 'assign' && 'Reglas de Asignación'}
                                {activeTab === 'tags' && 'Etiquetado Lead Scoring'}
                                {activeTab === 'status' && 'Publicación de Estados'}
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">Configura cómo interactúa tu asistente virtual.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-colors border border-red-500/20">
                                <Power className="w-3.5 h-3.5" /> Desconectar
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {activeTab === 'mode' && <AttentionModeSettings key="mode" />}
                            {activeTab === 'ai_config' && <AIResponseSettings key="ai_config" />}
                            {activeTab === 'assign' && <AutoAssignment key="assign" />}
                            {activeTab === 'tags' && <TaggingSystem key="tags" />}
                            {activeTab === 'status' && <StatusLibrary key="status" />}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function NavItem({ id, label, icon: Icon, active, onClick }) {
    return (
        <button
            onClick={() => onClick(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left group
            ${active === id ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
        >
            <Icon className={`w-4 h-4 transition-colors ${active === id ? 'text-indigo-400' : 'text-gray-500 group-hover:text-white'}`} />
            {label}
        </button>
    )
}

/* --- SUB-COMPONENTS --- */

function AttentionModeSettings() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModeCard
                title="IA 24/7"
                desc="El agente responde todo el tiempo. Ideal para captación masiva."
                icon={Bot}
                active={true}
                features={['Calificación Auto', 'Agenda Citas', 'Venta Directa']}
            />
            <ModeCard
                title="Híbrido"
                desc="Humanos horario laboral, IA resto del tiempo."
                icon={Clock}
                active={false}
                features={['Horarios Flexibles', 'Escalado a Humano', 'Modo Silencioso']}

            />
            <ModeCard
                title="Solo Humano"
                desc="La IA sugiere respuestas pero no envía nada."
                icon={User}
                active={false}
                features={['Copilot Mode', 'Borradores Auto', 'Análisis Sentiment']}
            />
        </div>
    )
}

function AIResponseSettings() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ModeCard
                    title="Conservador"
                    desc="Solo responde preguntas frecuentes exactas."
                    icon={ShieldCheck}
                    active={false}
                    features={['Minimiza Alucinaciones', 'Estricto', 'Formal']}
                />
                <ModeCard
                    title="Balanceado"
                    desc="Conversacional y amigable, busca ayudar."
                    icon={Scale}
                    active={true}
                    features={['Empático', 'Informado', 'Persuasivo']}
                />
                <ModeCard
                    title="Pro (Ventas)"
                    desc="Agresivo en cierre, califica y hace ofertas."
                    icon={Rocket}
                    active={false}
                    features={['Upselling', 'Manejo Objeciones', 'Cierre Rápido']}
                />
            </div>

            <div className="bg-[#151520] p-6 rounded-2xl border border-white/5">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" /> Instrucciones del Sistema (Prompt)</h3>
                <textarea
                    className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    placeholder="Escribe aquí las instrucciones de comportamiento para tu IA..."
                    defaultValue="Eres un experto en ventas inmobiliarias. Tu tono es profesional pero cercano. Tu objetivo principal es conseguir agendar una visita..."
                ></textarea>
            </div>
        </div>
    )
}
const Rocket = Zap; // Alias for icon

function ModeCard({ title, desc, icon: Icon, active, features }) {
    return (
        <div className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group flex flex-col h-full
        ${active ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.15)]' : 'bg-[#151520] border-white/5 hover:border-white/10 hover:-translate-y-1'}`}>
            {active && (
                <div className="absolute top-4 right-4 text-indigo-400 bg-indigo-500/20 p-1 rounded-full">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
            )}
            <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors ${active ? 'bg-indigo-600/20 text-indigo-400' : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-white'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4 flex-1">{desc}</p>

            <div className="space-y-2 pt-4 border-t border-white/5">
                {features && features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] text-gray-500">
                        <div className={`w-1 h-1 rounded-full ${active ? 'bg-indigo-500' : 'bg-gray-600'}`}></div>
                        {f}
                    </div>
                ))}
            </div>
        </div>
    )
}

function AutoAssignment() {
    return (
        <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3">
                <Briefcase className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-blue-400">Reglas de Enrutamiento</h4>
                    <p className="text-xs text-gray-300 mt-1">Define quién recibe los chats si la IA detecta intenciones específicas.</p>
                </div>
            </div>

            {['Palabra clave: "Precio" -> Equipo de Ventas', 'Palabra clave: "Queja" -> Atención al Cliente', 'Cliente VIP -> Ejecutivo Senior'].map((rule, i) => (
                <div key={i} className="flex items-center gap-4 bg-[#151520] p-4 rounded-xl border border-white/5 group hover:border-white/10 transition-all">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/30">{i + 1}</div>
                    <span className="text-sm text-gray-300 font-mono flex-1">{rule}</span>
                    <button className="text-gray-600 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                </div>
            ))}
            <button className="w-full py-3 border border-dashed border-white/10 rounded-xl text-xs text-gray-500 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Agregar Nueva Regla
            </button>
        </div>
    )
}

function TaggingSystem() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#151520] p-6 rounded-2xl border border-white/5 flex flex-col">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Tag className="w-4 h-4 text-pink-400" /> Etiquetas del Sistema</h3>
                <div className="flex flex-wrap gap-2 content-start">
                    {['Lead Nuevo', 'Lead Tibio', 'Lead Caliente', 'Cliente', 'Follow-up', 'Spam'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">{tag}</span>
                    ))}
                    <button className="px-3 py-1 border border-dashed border-white/20 rounded-full text-xs text-gray-500 hover:text-white hover:border-white/40 group flex gap-1 items-center">
                        <Plus className="w-3 h-3" /> Crear
                    </button>
                </div>
            </div>
            <div className="bg-[#151520] p-6 rounded-2xl border border-white/5">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Bot className="w-4 h-4 text-yellow-400" /> Auto-Etiquetado IA</h3>
                <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Si intención detectada =</span>
                            <span className="text-white font-bold">Interés Compra</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <ArrowRightIcon className="w-3 h-3 text-gray-600" />
                            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Lead Caliente</span>
                        </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Si inactividad {'>'}</span>
                            <span className="text-white font-bold">48 Horas</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <ArrowRightIcon className="w-3 h-3 text-gray-600" />
                            <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">Follow-up</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
const ArrowRightIcon = Zap; // Alias

function StatusLibrary() {
    return (
        <div className="space-y-6">
            <div className="bg-[#151520] p-6 rounded-2xl border border-white/5 flex justify-between items-center group">
                <div>
                    <h3 className="font-bold text-white">Estados Activos</h3>
                    <p className="text-xs text-gray-400">Gestiona las historias que ven tus clientes</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors shadow-lg shadow-indigo-600/20">
                    <Plus className="w-4 h-4" /> Nuevo Estado
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { name: 'Promo Febrero', views: 245, date: 'Hoy, 10:00' },
                    { name: 'Nuevo Ingreso', views: 112, date: 'Ayer, 18:30' }
                ].map((item, i) => (
                    <div key={i} className="aspect-[9/16] bg-gray-800 rounded-xl relative group overflow-hidden border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                            <span className="text-white font-bold text-sm mb-0.5">{item.name}</span>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] text-gray-400">{item.date}</span>
                                <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 rounded flex items-center gap-1">
                                    <Smartphone className="w-3 h-3" /> {item.views}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
