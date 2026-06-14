'use client';

import { useState } from 'react';
import { 
    Calendar, Clock, User, Phone, CheckCircle2, 
    XCircle, HelpCircle, MessageSquare, Plus, 
    Sparkles, RefreshCw, AlertCircle, CalendarDays
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const APPOINTMENT_STATUSES = [
    { id: 'scheduled', label: 'Agendada', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { id: 'confirmed', label: 'Confirmada', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { id: 'completed', label: 'Asistió', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { id: 'cancelled', label: 'Cancelada', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' }
];

export default function MedicalScheduler({ leads = [], activeClient, onLeadUpdate }) {
    const [selectedLeadId, setSelectedLeadId] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [notes, setNotes] = useState('');
    const [scheduling, setScheduling] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    // Leads available to schedule (all leads under this client)
    const scheduleableLeads = leads;

    // Filter leads who have an active appointment scheduled
    const appointments = leads
        .filter(lead => lead.appointment_date)
        .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

    const handleScheduleAppointment = async (e) => {
        e.preventDefault();
        if (!selectedLeadId || !appointmentDate || !appointmentTime) {
            toast.error('Por favor completa los campos requeridos');
            return;
        }

        setScheduling(true);
        try {
            const dateTimeString = `${appointmentDate}T${appointmentTime}:00`;
            const selectedLead = leads.find(l => l.id === selectedLeadId);

            const { data, error } = await supabase
                .from('crm_leads')
                .update({
                    appointment_date: new Date(dateTimeString).toISOString(),
                    appointment_status: 'scheduled',
                    notes_logistics: notes,
                    updated_at: new Date().toISOString()
                })
                .eq('id', selectedLeadId)
                .select()
                .single();

            if (error) throw error;

            onLeadUpdate(data);
            toast.success('Cita agendada con éxito', {
                description: `Cita programada para ${selectedLead?.full_name || 'paciente'} el ${appointmentDate} a las ${appointmentTime}.`
            });

            // Reset form
            setSelectedLeadId('');
            setAppointmentDate('');
            setAppointmentTime('');
            setNotes('');
        } catch (err) {
            console.error('Error scheduling appointment:', err);
            toast.error('Error al agendar la cita');
        } finally {
            setScheduling(false);
        }
    };

    const handleUpdateAppointmentStatus = async (leadId, nextStatus) => {
        setUpdatingId(leadId);
        try {
            const { data, error } = await supabase
                .from('crm_leads')
                .update({
                    appointment_status: nextStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', leadId)
                .select()
                .single();

            if (error) throw error;

            onLeadUpdate(data);
            toast.success('Estado de cita actualizado', {
                description: `La cita ahora está en estado: ${APPOINTMENT_STATUSES.find(s => s.id === nextStatus)?.label || nextStatus}.`
            });
        } catch (err) {
            console.error('Error updating appointment status:', err);
            toast.error('Error al actualizar la cita');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleSendReminder = (lead) => {
        if (!lead.appointment_date || !lead.phone) return;

        const dateObj = new Date(lead.appointment_date);
        const dateStr = dateObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        const brandName = activeClient?.name || 'DIIC ZONE';
        const message = `Hola ${lead.full_name?.split(' ')[0]}, le recordamos su cita agendada en ${brandName} para el día ${dateStr} a las ${timeStr}. Por favor, confirme su asistencia respondiendo a este mensaje. ¡Que tenga un excelente día!`;
        
        const phone = lead.phone.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        toast.info('Recordatorio enviado por WhatsApp');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Schedule Form */}
            <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-3xl space-y-6">
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Plus className="w-4 h-4 text-indigo-400" /> Agendar Nueva Cita
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                        Programa una consulta o servicio médico
                    </p>
                </div>

                <form onSubmit={handleScheduleAppointment} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Seleccionar Paciente</label>
                        <select 
                            required
                            value={selectedLeadId}
                            onChange={(e) => setSelectedLeadId(e.target.value)}
                            className="w-full bg-[#050510] border border-white/5 focus:border-indigo-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none"
                        >
                            <option value="">-- Elige un Paciente --</option>
                            {scheduleableLeads.map(l => (
                                <option key={l.id} value={l.id}>{l.full_name} ({l.city})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Fecha</label>
                            <input 
                                type="date"
                                required
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                                className="w-full bg-[#050510] border border-white/5 focus:border-indigo-500/40 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Hora</label>
                            <input 
                                type="time"
                                required
                                value={appointmentTime}
                                onChange={(e) => setAppointmentTime(e.target.value)}
                                className="w-full bg-[#050510] border border-white/5 focus:border-indigo-500/40 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Indicaciones / Síntomas / Notas</label>
                        <textarea 
                            rows={3}
                            placeholder="Ej. Chequeo de próstata de control. Requiere ayuno."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-[#050510] border border-white/5 focus:border-indigo-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none resize-none"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={scheduling}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-indigo-600/10"
                    >
                        {scheduling ? 'Programando...' : (
                            <>
                                <CalendarDays className="w-3.5 h-3.5" /> Programar Consulta
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Right: Weekly / Upcoming Appointments List */}
            <div className="lg:col-span-2 bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-3xl space-y-6 flex flex-col h-[550px]">
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-400" /> Agenda Médica Activa
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                        Listado cronológico de consultas agendadas
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                    {appointments.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-16">
                            <Calendar className="w-12 h-12 text-gray-600 mb-4 animate-pulse" />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No hay citas programadas</p>
                            <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">Completa el formulario lateral para agendar una cita.</p>
                        </div>
                    ) : (
                        appointments.map(app => {
                            const dateObj = new Date(app.appointment_date);
                            const formattedDate = dateObj.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' });
                            const formattedTime = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                            const appStatus = app.appointment_status || 'scheduled';
                            const statusConfig = APPOINTMENT_STATUSES.find(s => s.id === appStatus) || APPOINTMENT_STATUSES[0];

                            return (
                                <div 
                                    key={app.id} 
                                    className="bg-[#050510]/50 border border-white/5 hover:border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all relative overflow-hidden"
                                >
                                    {/* Left: Time and Patient info */}
                                    <div className="flex items-start gap-4">
                                        <div className="px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center shrink-0 min-w-[65px]">
                                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tight block leading-none">{formattedDate}</span>
                                            <span className="text-xs font-black text-white block mt-1 leading-none">{formattedTime}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-white uppercase tracking-wider">{app.full_name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2 py-0.5 border rounded-full text-[8px] font-black uppercase tracking-wider ${statusConfig.color}`}>
                                                    {statusConfig.label}
                                                </span>
                                                <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">
                                                    • {app.city}
                                                </span>
                                            </div>
                                            {app.notes_logistics && (
                                                <p className="text-[9px] text-gray-400 italic mt-1.5 bg-white/[0.01] border border-white/5 p-1.5 rounded-lg">
                                                    {app.notes_logistics}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex flex-wrap items-center gap-2 sm:self-center">
                                        {appStatus === 'scheduled' && (
                                            <button 
                                                disabled={updatingId === app.id}
                                                onClick={() => handleUpdateAppointmentStatus(app.id, 'confirmed')}
                                                className="px-2 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white rounded-lg border border-amber-500/20 text-[8px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Confirmar
                                            </button>
                                        )}
                                        {['scheduled', 'confirmed'].includes(appStatus) && (
                                            <>
                                                <button 
                                                    disabled={updatingId === app.id}
                                                    onClick={() => handleUpdateAppointmentStatus(app.id, 'completed')}
                                                    className="px-2 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    Asistió
                                                </button>
                                                <button 
                                                    disabled={updatingId === app.id}
                                                    onClick={() => handleUpdateAppointmentStatus(app.id, 'cancelled')}
                                                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg border border-rose-500/20 transition-all"
                                                    title="Cancelar Cita"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        )}

                                        {app.phone && (
                                            <button 
                                                onClick={() => handleSendReminder(app)}
                                                className="p-1.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg border border-emerald-500/20 transition-all flex items-center justify-center"
                                                title="Enviar Recordatorio por WhatsApp"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
