'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X, Zap, Copy, Check, Play, CheckCircle2, ArrowRight,
    Code, Sparkles, RefreshCw, Send, Layers, Settings2
} from 'lucide-react';
import { toast } from 'sonner';

export default function AutomationModal({
    isOpen,
    onClose,
    clientName = 'Dr. Oscar Cujilema',
    clientId = 'C_OSCAR_562'
}) {
    const [copied, setCopied] = useState(false);
    const [testing, setTesting] = useState(false);
    const [selectedIntegration, setSelectedIntegration] = useState('make'); // 'make' | 'zapier' | 'n8n'

    if (!isOpen) return null;

    const webhookUrl = `https://diiczone.com/api/webhooks/${clientId || 'client_oscar'}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(webhookUrl);
        setCopied(true);
        toast.success('Webhook URL copiado al portapapeles');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTestWebhook = () => {
        setTesting(true);
        setTimeout(() => {
            setTesting(false);
            toast.success('Evento de prueba enviado exitosamente. Payload procesado 200 OK.');
        }, 1200);
    };

    const payloadExample = {
        event: "new_patient_lead",
        timestamp: new Date().toISOString(),
        client_id: clientId || "C_OSCAR_562",
        source: "instagram_reels",
        patient: {
            name: "María Fernanda Lopez",
            phone: "+593 98 123 4567",
            service_interest: "Artroscopía de Hombro",
            trigger_keyword: "CITA",
            channel: "whatsapp"
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                className="bg-[#090A16] border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative"
            >
                {/* Background Glow */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500 blur-[120px] rounded-full opacity-15 pointer-events-none" />

                {/* HEADER */}
                <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-[#090A16]/90 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-[1px] shadow-lg shadow-black/50">
                            <div className="w-full h-full bg-[#08081a] rounded-2xl flex items-center justify-center">
                                <Zap className="w-7 h-7 text-emerald-400" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black italic tracking-tight text-white uppercase">Centro de Webhooks & Make / Zapier</h2>
                                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                                    En Línea
                                </span>
                            </div>
                            <p className="text-sm font-bold text-gray-400 mt-0.5">
                                Endpoint de Sincronización Automática para <span className="text-emerald-300">{clientName}</span>
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-3 bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 rounded-2xl border border-white/10 text-gray-400 transition-all active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
                    {/* Webhook URL Box */}
                    <div className="p-6 bg-[#101226] border border-white/5 rounded-3xl space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Tu Webhook URL Oficial:
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                readOnly
                                value={webhookUrl}
                                className="flex-1 bg-[#050510] border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono text-emerald-300 select-all outline-none"
                            />
                            <button
                                onClick={handleCopy}
                                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copiado' : 'Copiar'}
                            </button>
                        </div>
                        <p className="text-[11px] text-gray-400">
                            Pega esta URL en tus escenarios de <strong>Make.com</strong>, <strong>Zapier</strong> o <strong>n8n</strong> como receptor de eventos <code>HTTP POST</code>.
                        </p>
                    </div>

                    {/* Quick Guide Tabs */}
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            {[
                                { id: 'make', label: 'Make (Integromat)' },
                                { id: 'zapier', label: 'Zapier' },
                                { id: 'n8n', label: 'n8n Workflow' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedIntegration(tab.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                        selectedIntegration === tab.id
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            : 'bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* JSON Payload Example */}
                        <div className="bg-[#050510] border border-white/10 rounded-3xl p-5 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Code className="w-4 h-4 text-emerald-400" /> Estructura del Payload JSON (200 OK):
                                </span>
                                <button
                                    onClick={handleTestWebhook}
                                    disabled={testing}
                                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-indigo-600/20"
                                >
                                    <Play className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
                                    {testing ? 'Enviando...' : 'Simular Evento de Prueba'}
                                </button>
                            </div>
                            <pre className="p-4 bg-black/50 rounded-2xl text-[11px] font-mono text-emerald-400/90 overflow-x-auto leading-relaxed border border-white/5">
                                {JSON.stringify(payloadExample, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
