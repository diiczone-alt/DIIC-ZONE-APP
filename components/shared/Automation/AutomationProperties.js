import React from 'react';
import { X, Settings2, Link2, MessageSquare, Save, Trash2 } from 'lucide-react';
import { AUTO_NODE_TYPES } from './AutomationConstants';

export default function AutomationProperties({ selectedNode, selectedEdge, onClose, onUpdateNode, onDeleteNode }) {
    if (!selectedNode) return null;

    const handleUpdate = (key, value) => {
        onUpdateNode(selectedNode.id, { ...selectedNode.data, [key]: value });
    };

    const typeConfig = AUTO_NODE_TYPES[selectedNode.type];

    return (
        <div className="w-80 bg-[#0A0A0F]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col h-full z-[70] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-500 ease-[0.23,1,0.32,1]">
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        {typeConfig?.icon && <typeConfig.icon className="w-4 h-4" style={{ color: typeConfig.color }} />}
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">
                            Node Settings
                        </h2>
                        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{selectedNode.type}</p>
                    </div>
                </div>
                <button 
                    onClick={onClose} 
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all border border-white/5 active:scale-90"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* General Settings */}
                <section className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] block pl-1">Identificador Visual</label>
                        <input 
                            type="text" 
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-4 text-[11px] text-white focus:outline-none focus:border-indigo-500/50 font-bold placeholder-gray-700 transition-all shadow-inner"
                            placeholder="Nombre del nodo..."
                            value={selectedNode.data?.label || ''}
                            onChange={(e) => handleUpdate('label', e.target.value)}
                        />
                    </div>

                    {/* Conditional Logic Fields */}
                    {selectedNode.type === 'trigger_whatsapp' && (
                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <label className="text-[8px] font-black text-emerald-500 uppercase tracking-widest block pl-1">WhatsApp Filter</label>
                            <input 
                                type="text" 
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[11px] text-white focus:outline-none focus:border-emerald-500/50 font-bold"
                                placeholder="Keyword (Ej. PRECIO)"
                                value={selectedNode.data?.keyword || ''}
                                onChange={(e) => handleUpdate('keyword', e.target.value)}
                            />
                            <p className="text-[9px] text-gray-500 px-1 leading-relaxed italic">Vacío = Todos los mensajes.</p>
                        </div>
                    )}

                    {(selectedNode.type === 'msg_auto' || selectedNode.type === 'bot_ai') && (
                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Contenido de Respuesta</label>
                                <MessageSquare className="w-3 h-3 text-indigo-500 opacity-50" />
                            </div>
                            <textarea 
                                className="w-full h-32 bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-4 text-[11px] text-white focus:outline-none focus:border-indigo-500/50 resize-none font-medium leading-relaxed shadow-inner"
                                placeholder="Escribe el mensaje aquí..."
                                value={selectedNode.data?.message || ''}
                                onChange={(e) => handleUpdate('message', e.target.value)}
                            />
                        </div>
                    )}

                    {/* Integration Specific Fields */}
                    {selectedNode.type === 'ext_gmail' && (
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-[8px] font-black text-red-400 uppercase tracking-widest block pl-1">Gmail Configuration</label>
                            <div className="space-y-3">
                                <input 
                                    type="email" 
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[11px] text-white focus:outline-none focus:border-red-500/50"
                                    placeholder="Destinatario"
                                    value={selectedNode.data?.recipient || ''}
                                    onChange={(e) => handleUpdate('recipient', e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[11px] text-white focus:outline-none focus:border-red-500/50"
                                    placeholder="Asunto (Subject)"
                                    value={selectedNode.data?.subject || ''}
                                    onChange={(e) => handleUpdate('subject', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {selectedNode.type === 'ext_slack' && (
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-[8px] font-black text-purple-400 uppercase tracking-widest block pl-1">Slack Channel</label>
                            <input 
                                type="text" 
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[11px] text-white focus:outline-none focus:border-purple-500/50"
                                placeholder="#ventas-leads"
                                value={selectedNode.data?.channel || ''}
                                onChange={(e) => handleUpdate('channel', e.target.value)}
                            />
                        </div>
                    )}
                </section>
                
                {/* Delete Node Section */}
                <div className="pt-8 border-t border-white/10 mt-auto pb-4">
                    <button 
                        onClick={() => {
                            const confirmed = window.confirm('¿Eliminar este nodo? Todos los enlaces se perderán.');
                            if (confirmed) onDeleteNode(selectedNode.id);
                        }}
                        className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-[20px] flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20 active:scale-95"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar Nodo</span>
                    </button>
                    <p className="text-[8px] text-gray-600 text-center mt-3 font-bold uppercase tracking-widest opacity-50 italic">DIIC Automation Engine v4.0</p>
                </div>
            </div>
        </div>
    );
}
