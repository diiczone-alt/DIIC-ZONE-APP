'use client';

import { motion } from 'framer-motion';
import {
    MessageSquare, Users, Calendar, DollarSign, Flame,
    ArrowRight, CheckCircle, Clock, Zap, MessageCircle,
    Instagram, Facebook, Globe, MoreHorizontal, TrendingUp
} from 'lucide-react';

export default function AiAgentPerformance() {
    return (
        <div className="space-y-6">

            {/* TOP: Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <StatCard label="Conversaciones" value="23" icon={MessageSquare} color="text-blue-400" />
                <StatCard label="Leads Hoy" value="12" icon={Users} color="text-purple-400" />
                <StatCard label="Citas Agendadas" value="7" icon={Calendar} color="text-pink-400" />
                <StatCard label="Ventas Generadas" value="$1,350" icon={DollarSign} color="text-green-400" bg="bg-green-500/10" />
                <StatCard label="Leads Calientes" value="5" icon={Flame} color="text-orange-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COL: Feed & Funnel */}
                <div className="space-y-6">
                    {/* BLOQUE 1: Actividad en Tiempo Real */}
                    <Section title="Actividad en Tiempo Real" icon={Zap} color="text-amber-400">
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                            <ActivityItem time="Ahore" text="María escribió por Instagram" type="msg" />
                            <ActivityItem time="2m" text="Juan pidió info de tratamiento" type="lead" />
                            <ActivityItem time="15m" text="Cita agendada: Mañana 10:30 AM" type="appt" />
                            <ActivityItem time="32m" text="Lead interesado guardado (Carlos)" type="save" />
                            <ActivityItem time="1h" text="Cotización enviada a Ana" type="doc" />
                        </div>
                        <button className="w-full mt-4 py-2 text-xs font-bold text-gray-500 hover:text-white border-t border-white/5 transition-colors">
                            Ver todas las conversaciones
                        </button>
                    </Section>

                    {/* BLOQUE 2: Embudo de Ventas */}
                    <Section title="Embudo de Conversión" icon={TrendingUp} color="text-blue-400">
                        <div className="space-y-3 py-2">
                            <FunnelRow label="Contactos Totales" value="150" width="100%" color="bg-blue-500/20" />
                            <FunnelRow label="Interesados" value="82" width="70%" color="bg-purple-500/20" />
                            <FunnelRow label="Calificados" value="46" width="50%" color="bg-pink-500/20" />
                            <FunnelRow label="Citas" value="21" width="30%" color="bg-orange-500/20" />
                            <FunnelRow label="Ventas" value="12" width="15%" color="bg-green-500/20" />
                        </div>
                        <div className="mt-4 p-3 bg-white/5 rounded-xl text-center">
                            <p className="text-sm text-gray-300">
                                Tu sistema está convirtiendo al <span className="font-bold text-green-400">14%</span> de los contactos en clientes.
                            </p>
                        </div>
                    </Section>

                    {/* BLOQUE 7: Plataformas */}
                    <Section title="Conexiones Activas" icon={Globe} color="text-cyan-400">
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="flex gap-4">
                                <PlatformIcon icon={MessageCircle} color="text-green-400" active />
                                <PlatformIcon icon={Instagram} color="text-pink-400" active />
                                <PlatformIcon icon={Facebook} color="text-blue-400" active />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-bold text-green-400">SISTEMA ONLINE</span>
                            </div>
                        </div>
                    </Section>
                </div>

                {/* MIDDLE/RIGHT COL: Main Data */}
                <div className="lg:col-span-2 space-y-6">

                    {/* BLOQUE 4: Decisiones IA */}
                    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" /> Resumen de Decisiones Autónomas (Hoy)
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <DecisionCard value="4" label="Citas Agendadas" />
                            <DecisionCard value="18" label="Respuestas IA" />
                            <DecisionCard value="6" label="Leads Calificados" />
                            <DecisionCard value="5" label="Cotizaciones Env." />
                        </div>
                    </div>

                    {/* BLOQUE 3: Tabla de Leads */}
                    <Section title="Leads Recientes & Clasificación IA" icon={CheckCircle} color="text-green-400">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs text-gray-500 border-b border-white/10">
                                        <th className="p-3 font-bold uppercase">Nombre</th>
                                        <th className="p-3 font-bold uppercase">Servicio</th>
                                        <th className="p-3 font-bold uppercase">Estado</th>
                                        <th className="p-3 font-bold uppercase">Fuente</th>
                                        <th className="p-3 font-bold uppercase">Detección IA</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <LeadRow
                                        name="Carlos M." service="Cirugía Láser"
                                        status="Caliente 🔥" statusColor="text-orange-400"
                                        source="WhatsApp" aiDetail="Alta Intención: 'Quiero cita'"
                                    />
                                    <LeadRow
                                        name="Ana P." service="Consulta"
                                        status="Interesado 🟡" statusColor="text-yellow-400"
                                        source="IG DM" aiDetail="Solicita precio"
                                    />
                                    <LeadRow
                                        name="Luis R." service="Blanqueamiento"
                                        status="Informativo 🔴" statusColor="text-blue-400"
                                        source="Facebook" aiDetail="Duda horarios"
                                    />
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* BLOQUE 5: Próximas Citas */}
                        <Section title="Próximas Citas Generadas" icon={Calendar} color="text-purple-400">
                            <div className="space-y-3">
                                <ApptItem date="Mañana" time="10:30 AM" service="Consulta" source="Instagram" />
                                <ApptItem date="Viernes" time="15:00 PM" service="Tratamiento" source="WhatsApp" />
                                <ApptItem date="Sábado" time="09:00 AM" service="Control" source="Web" />
                            </div>
                            <button className="w-full mt-3 text-xs text-purple-400 hover:text-white font-bold text-center">Ver Calendario Completo</button>
                        </Section>

                        {/* BLOQUE 6: Seguimientos */}
                        <Section title="Seguimientos Pendientes" icon={Clock} color="text-amber-400">
                            <div className="space-y-3">
                                <FollowUpItem name="Luis R." last="Hace 2 días" next="Recordatorio en 24h" />
                                <FollowUpItem name="Carla M." last="Hoy" next="Envío de Info (Auto)" />
                                <FollowUpItem name="Pedro S." last="Ayer" next="Preguntar decisión" />
                            </div>
                        </Section>
                    </div>

                </div>
            </div>
        </div>
    );
}

// --- Sub-components ---

function Section({ title, icon: Icon, color, children }) {
    return (
        <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-5 h-full">
            <div className="flex items-center gap-2 mb-4">
                <Icon className={`w-5 h-5 ${color}`} />
                <h3 className="font-bold text-white text-sm uppercase tracking-wide">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color, bg = 'bg-[#0A0A12]' }) {
    return (
        <div className={`${bg} border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-colors`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-500 font-bold uppercase">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
        </div>
    );
}

function ActivityItem({ time, text, type }) {
    const colors = {
        msg: 'bg-blue-500', lead: 'bg-yellow-500', appt: 'bg-green-500', save: 'bg-gray-500', doc: 'bg-purple-500'
    };
    return (
        <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-white/5 transition-colors">
            <div className={`w-2 h-2 mt-1.5 rounded-full ${colors[type]}`} />
            <div>
                <p className="text-sm text-gray-200 leading-snug">{text}</p>
                <span className="text-[10px] text-gray-500 font-mono">{time}</span>
            </div>
        </div>
    );
}

function FunnelRow({ label, value, width, color }) {
    return (
        <div className="relative h-8 flex items-center mb-1">
            <div className={`absolute left-0 top-0 bottom-0 ${color} rounded-r-lg`} style={{ width }} />
            <div className="relative z-10 w-full flex justify-between px-3 text-xs">
                <span className="font-bold text-white">{label}</span>
                <span className="font-mono text-white/70">{value}</span>
            </div>
        </div>
    );
}

function LeadRow({ name, service, status, statusColor, source, aiDetail }) {
    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="p-3 font-bold text-white">{name}</td>
            <td className="p-3 text-gray-400">{service}</td>
            <td className={`p-3 font-bold ${statusColor}`}>{status}</td>
            <td className="p-3 text-gray-500 text-xs">{source}</td>
            <td className="p-3 text-gray-300 italic text-xs border-l border-white/5">
                <span className="opacity-70">🤖 {aiDetail}</span>
            </td>
        </tr>
    );
}

function DecisionCard({ value, label }) {
    return (
        <div className="bg-black/20 rounded-xl p-3 text-center border border-white/5">
            <div className="text-xl font-black text-white">{value}</div>
            <div className="text-[10px] text-gray-400 uppercase font-bold">{label}</div>
        </div>
    );
}

function ApptItem({ date, time, service, source }) {
    return (
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
            <div>
                <div className="font-bold text-white text-sm">{date} • {time}</div>
                <div className="text-xs text-gray-400">{service}</div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-black/30 text-gray-500 border border-white/5">{source}</span>
        </div>
    );
}

function FollowUpItem({ name, last, next }) {
    return (
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
            <div>
                <div className="font-bold text-white text-sm">{name}</div>
                <div className="text-xs text-gray-500">Último: {last}</div>
            </div>
            <div className="text-xs font-bold text-amber-400">{next}</div>
        </div>
    );
}

function PlatformIcon({ icon: Icon, color, active }) {
    return (
        <div className={`relative p-2 rounded-lg bg-white/5 ${active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
            <Icon className={`w-5 h-5 ${color}`} />
            {active && <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-black" />}
        </div>
    );
}
