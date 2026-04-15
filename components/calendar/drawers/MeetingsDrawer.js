'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Video, Calendar, ArrowRight, FileText, CheckCircle2, MessageSquare, Plus, Send, Clock, MapPin } from 'lucide-react';
import CalendarDrawer from './CalendarDrawer';
import { whatsappService } from '../../../services/whatsappService';
import { toast } from 'sonner';

export default function MeetingsDrawer({ isOpen, onClose }) {
    const [sendingId, setSendingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newMeeting, setNewMeeting] = useState({ title: '', date: '', time: '' });

    const handleSendWhatsApp = async (id, title) => {
        setSendingId(id);
        const mockMeetingData = {
            clientName: "Cliente Estratégico",
            agreements: [
                "Aprobación de la nueva línea visual 3D",
                "Ajuste de presupuesto para campañas Q2"
            ],
            tasks: [
                "Enviar assets de marca mañana",
                "Agendar rodaje para el día 15"
            ]
        };

        const result = await whatsappService.sendMeetingSummary("555-123-4567", mockMeetingData);
        if (result.success) {
            toast.success("Resumen enviado por WhatsApp", {
                description: `Se ha enviado el resumen de "${title}" correctamente.`
            });
        }
        setSendingId(null);
    };

    const handleSchedule = () => {
        if (!newMeeting.title || !newMeeting.date) {
            toast.error("Por favor completa los datos de la reunión");
            return;
        }
        toast.success("Reunión agendada con éxito");
        setShowForm(false);
        setNewMeeting({ title: '', date: '', time: '' });
    };

    return (
        <CalendarDrawer
            isOpen={isOpen}
            onClose={onClose}
            title="Centro de Reuniones"
            icon={Users}
            color="text-purple-400"
        >
            <div className="space-y-6">

                {/* --- AGENDAR REUNIÓN --- */}
                {!showForm ? (
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full p-4 rounded-2xl border border-dashed border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 transition-all flex items-center justify-center gap-3 group"
                    >
                        <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-purple-300">Agendar Nueva Reunión</span>
                    </button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-2xl bg-white/5 border border-purple-500/20 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Nueva Reunión</h4>
                            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white text-xs">Cancelar</button>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Título de la reunión"
                                value={newMeeting.title}
                                onChange={e => setNewMeeting({ ...newMeeting, title: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500/50 outline-none transition-all"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="date"
                                        value={newMeeting.date}
                                        onChange={e => setNewMeeting({ ...newMeeting, date: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-purple-500/50 outline-none"
                                    />
                                </div>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="time"
                                        value={newMeeting.time}
                                        onChange={e => setNewMeeting({ ...newMeeting, time: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-purple-500/50 outline-none"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleSchedule}
                                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-purple-600/20"
                            >
                                Confirmar Agendamiento
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Active Meeting Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/40 to-[#0B0B15] border border-purple-500/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Video className="w-24 h-24 text-purple-500" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-xs font-bold text-green-400 uppercase tracking-wider">En Curso</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Estrategia Mensual</h3>
                        <p className="text-sm text-gray-400 mb-4">Inició hace 45 min • Google Meet</p>

                        <div className="flex gap-2">
                            <button className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors">
                                Unirse Ahora
                            </button>
                            <button className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors" title="Ver Notas">
                                <FileText className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Upcoming */}
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Próximas Sesiones</h4>
                    <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-bold text-white">Revisión de Guiones</h5>
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex items-center gap-4 text-[10px] text-gray-400 font-medium">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Jue 24 Mar</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>15:00 PM</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-bold text-white">Kickoff Campaña</h5>
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex items-center gap-4 text-[10px] text-gray-400 font-medium">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Lun 28 Mar</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>11:00 AM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Past */}
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Historial Reciente</h4>
                    <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold text-gray-300">Reporte Resultados Q4</h5>
                                    <p className="text-[10px] text-gray-500 font-medium">Finalizada hace 2d</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSendWhatsApp('h1', 'Reporte Resultados Q4')}
                                disabled={sendingId === 'h1'}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 text-[10px] font-bold transition-all"
                            >
                                {sendingId === 'h1' ? (
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                        Enviando...
                                    </span>
                                ) : (
                                    <>
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>Enviar Resumen</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold text-gray-300">Onboarding Equipo</h5>
                                    <p className="text-[10px] text-gray-500 font-medium">Finalizada hace 5d</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSendWhatsApp('h2', 'Onboarding Equipo')}
                                disabled={sendingId === 'h2'}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 text-[10px] font-bold transition-all"
                            >
                                {sendingId === 'h2' ? (
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                        Enviando...
                                    </span>
                                ) : (
                                    <>
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>Enviar Resumen</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </CalendarDrawer>
    );
}
