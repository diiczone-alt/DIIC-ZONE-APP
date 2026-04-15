'use client';

import { motion } from 'framer-motion';
import {
    CheckCircle2, Share2, MessageSquare, Database,
    Facebook, Instagram, Video, Mail, RefreshCw, Zap
} from 'lucide-react';

export default function ConnectivityDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Conectividad Digital</h1>
                    <p className="text-gray-400">Sistema Nervioso Central de tu Ecosistema.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold text-white transition-colors">
                    <RefreshCw className="w-4 h-4" /> Sincronizar Todo
                </button>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatusCard
                    title="Meta Business"
                    status="Conectado"
                    icon={Facebook}
                    color="blue"
                    metrics={{ ads: '14 Activos', pixels: 'Recibiendo Datos' }}
                />
                <StatusCard
                    title="WhatsApp API"
                    status="Conectado"
                    icon={MessageSquare}
                    color="green"
                    metrics={{ msgs: '1.2k/mes', bot: 'Activo' }}
                />
                <StatusCard
                    title="CRM Hub"
                    status="Sincronizado"
                    icon={Database}
                    color="orange"
                    metrics={{ leads: '450 Contactos', deals: '12 Abiertos' }}
                />
                <StatusCard
                    title="TikTok Ads"
                    status="Pendiente"
                    icon={Video}
                    color="pink"
                    metrics={{ ads: '--', pixels: 'Inactivo' }}
                    isPending
                />
            </div>

            {/* Automations Flow Visualization (Mock) */}
            <div className="p-6 rounded-3xl bg-[#0E0E18] border border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" /> Flujos Automáticos Activos
                    </h3>
                    <div className="flex gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                        <span>3 Flows Corriendo</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <AutomationRow
                        name="Lead Magnet: Ebook 2024"
                        trigger="Formulario Web"
                        actions={['Email Bienvenida', 'Etiqueta CRM', 'Notificar Ventas']}
                        stats="245 ejecuciones"
                    />
                    <AutomationRow
                        name="Recuperación Carrito"
                        trigger="Checkout Abandonado"
                        actions={['Email Recordatorio', 'WhatsApp (si > $100)']}
                        stats="12 recuperados"
                    />
                    <AutomationRow
                        name="Agendamiento Cita"
                        trigger="Calendly"
                        actions={['Crear Reunión Zoom', 'Email Confirmación']}
                        stats="56 citas"
                    />
                </div>
            </div>
        </div>
    );
}

function StatusCard({ title, status, icon: Icon, color, metrics, isPending }) {
    const colors = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        green: 'text-green-400 bg-green-500/10 border-green-500/20',
        orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
        pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
        gray: 'text-gray-400 bg-white/5 border-white/10',
    };

    const scheme = isPending ? colors.gray : colors[color];

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`p-5 rounded-2xl border ${isPending ? 'border-dashed border-white/10' : 'border-white/5'} bg-[#0E0E18] relative overflow-hidden`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${scheme}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isPending ? 'bg-gray-800 text-gray-500' : 'bg-green-500/20 text-green-400'}`}>
                    {status}
                </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>

            <div className="space-y-1">
                {Object.entries(metrics).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-xs text-gray-500">
                        <span className="capitalize">{key}</span>
                        <span className="text-gray-300 font-medium">{val}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function AutomationRow({ name, trigger, actions, stats }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm">{name}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300">{trigger}</span>
                        <span>→</span>
                        <span>{actions.join(' + ')}</span>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <span className="block text-sm font-bold text-green-400">{stats}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Este Mes</span>
            </div>
        </div>
    );
}
