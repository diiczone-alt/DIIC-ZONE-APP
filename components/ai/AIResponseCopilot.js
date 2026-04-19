'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, Check, Edit3, Send, 
    X, RefreshCw, MessageSquare, Bot 
} from 'lucide-react';
import { aiService } from '@/lib/aiService';

export default function AIResponseCopilot({ 
    leadId, 
    lastMessage = "", 
    userId,
    onSend 
}) {
    const [draft, setDraft] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedResponse, setEditedResponse] = useState("");

    const generateNewDraft = async () => {
        setLoading(true);
        try {
            const newDraft = await aiService.generateSuggestion(userId, lastMessage, 'CRM');
            setDraft(newDraft);
            setEditedResponse(newDraft.suggested_response);
        } catch (err) {
            console.error('Error generating AI draft:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!draft) return;
        setLoading(true);
        try {
            await aiService.approveDraft(draft.id, isEditing ? editedResponse : null);
            if (onSend) onSend(isEditing ? editedResponse : draft.suggested_response);
            setDraft(null); // Clear after send
            setIsEditing(false);
        } catch (err) {
            console.error('Error approving draft:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {!draft ? (
                <button 
                    onClick={generateNewDraft}
                    disabled={loading || !lastMessage}
                    className="flex items-center gap-3 px-6 py-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 hover:bg-indigo-500/20 transition-all group"
                >
                    {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform" />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Consultar Asistente IA</span>
                </button>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-[#11111d] border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden"
                >
                    {/* Decorative Header */}
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <Bot className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black text-white uppercase tracking-widest italic">Sugerencia de la IA</span>
                        </div>
                        <button onClick={() => setDraft(null)} className="text-gray-600 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Response Area */}
                    <div className="relative group">
                        {isEditing ? (
                            <textarea 
                                value={editedResponse}
                                onChange={(e) => setEditedResponse(e.target.value)}
                                className="w-full bg-black/40 border border-indigo-500/30 rounded-2xl px-6 py-6 text-sm font-bold text-gray-200 outline-none min-h-[120px] focus:border-indigo-500 transition-all leading-relaxed"
                            />
                        ) : (
                            <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-6 text-sm font-medium text-gray-300 italic leading-relaxed">
                                "{draft.suggested_response}"
                            </div>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <button 
                            onClick={handleApprove}
                            disabled={loading}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-600/20"
                        >
                            <Send className="w-4 h-4" /> {isEditing ? 'Validar y Enviar' : 'Aprobar y Enviar'}
                        </button>
                        
                        {!isEditing ? (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                            >
                                <Edit3 className="w-4 h-4" /> Personalizar
                            </button>
                        ) : (
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-3"
                            >
                                <X className="w-4 h-4" /> Cancelar Edición
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/5 opacity-50">
                        <MessageSquare className="w-3 h-3 text-gray-600" />
                        <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">
                            Esta respuesta se basa en la Base de Conocimiento de Nova Estética
                        </span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
