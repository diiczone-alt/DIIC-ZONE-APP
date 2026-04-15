'use client';

import { useState } from 'react';
import {
    Calendar, ArrowRight, CheckCircle, Clock,
    Smartphone, Mail, CalendarDays, Watch,
    Stethoscope, Dumbbell, Briefcase, Zap, Globe, FileText, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgendaInstallationWizard({ onClose, onComplete }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: '', // 'medical', 'gym', 'brand', 'events'
        days: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
        hours: { start: '09:00', end: '18:00' },
        channels: [], // 'whatsapp', 'instagram', 'web', 'facebook'
        reminders: [], // '24h', '1h', 'auto_confirm'
        data: [] // 'name', 'service', 'date', 'phone'
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const toggleDay = (day) => {
        setFormData(prev => {
            const list = prev.days;
            if (list.includes(day)) return { ...prev, days: list.filter(item => item !== day) };
            return { ...prev, days: [...list, day] };
        });
    };

    const toggleSelection = (field, value) => {
        setFormData(prev => {
            const list = prev[field];
            if (list.includes(value)) return { ...prev, [field]: list.filter(item => item !== value) };
            return { ...prev, [field]: [...list, value] };
        });
    };

    const setSingle = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // --- STEPS ---

    const WelcomeStep = () => (
        <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                <Calendar className="w-12 h-12 text-rose-400" />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white mb-3">Agenda Inteligente</h2>
                <p className="text-gray-400 max-w-md mx-auto text-lg">
                    Automatiza tus citas, elimina el ausentismo y ahorra horas de coordinación manual.
                </p>
            </div>
            <button onClick={nextStep} className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 mx-auto">
                <Clock className="w-5 h-5" /> Comenzar Configuración
            </button>
        </div>
    );

    const TypeStep = () => (
        <div className="space-y-6">
            <StepHeader title="¿Qué tipo de citas manejas?" subtitle="Adaptamos el sistema a tu nicho." />
            <div className="grid grid-cols-2 gap-4">
                <SelectCard icon={Stethoscope} label="Médico / Salud" selected={formData.type === 'medical'} onClick={() => setSingle('type', 'medical')} color="rose" />
                <SelectCard icon={Dumbbell} label="Gimnasio / Fit" selected={formData.type === 'gym'} onClick={() => setSingle('type', 'gym')} color="rose" />
                <SelectCard icon={Briefcase} label="Marca / Reuniones" selected={formData.type === 'brand'} onClick={() => setSingle('type', 'brand')} color="rose" />
                <SelectCard icon={Zap} label="Eventos / Visitas" selected={formData.type === 'events'} onClick={() => setSingle('type', 'events')} color="rose" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={!formData.type} color="rose" />
        </div>
    );

    const AvailabilityStep = () => (
        <div className="space-y-6">
            <StepHeader title="Horarios Disponibles" subtitle="¿Cuándo puedes recibir citas?" />

            {/* Dias */}
            <div className="flex justify-center gap-2 flex-wrap">
                {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map(day => (
                    <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`w-10 h-10 rounded-full font-bold text-xs transition-all ${formData.days.includes(day) ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Horas */}
            <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Hora Inicio</label>
                    <input type="time" value={formData.hours.start} onChange={e => setFormData({ ...formData, hours: { ...formData.hours, start: e.target.value } })} className="w-full bg-black/30 text-white rounded-lg p-2 border border-white/10" />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Hora Fin</label>
                    <input type="time" value={formData.hours.end} onChange={e => setFormData({ ...formData, hours: { ...formData.hours, end: e.target.value } })} className="w-full bg-black/30 text-white rounded-lg p-2 border border-white/10" />
                </div>
            </div>

            <NavButtons back={prevStep} next={nextStep} disabled={formData.days.length === 0} color="rose" />
        </div>
    );

    const ChannelStep = () => (
        <div className="space-y-6">
            <StepHeader title="Canales de Agenda" subtitle="¿Dónde podrá reservar el cliente?" />
            <div className="grid grid-cols-2 gap-4">
                <SelectCard icon={Smartphone} label="WhatsApp" selected={formData.channels.includes('whatsapp')} onClick={() => toggleSelection('channels', 'whatsapp')} color="rose" />
                <SelectCard icon={ArrowRight} label="Instagram" selected={formData.channels.includes('instagram')} onClick={() => toggleSelection('channels', 'instagram')} color="rose" />
                <SelectCard icon={Globe} label="Web" selected={formData.channels.includes('web')} onClick={() => toggleSelection('channels', 'web')} color="rose" />
                <SelectCard icon={Briefcase} label="Facebook" selected={formData.channels.includes('facebook')} onClick={() => toggleSelection('channels', 'facebook')} color="rose" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={formData.channels.length === 0} color="rose" />
        </div>
    );

    const RemindersStep = () => (
        <div className="space-y-6">
            <StepHeader title="Recordatorios Automáticos" subtitle="Evita que los clientes olviden su cita." />
            <div className="space-y-3">
                <ActionCheck label="24 Horas Antes" desc="Recordatorio preventivo." checked={formData.reminders.includes('24h')} onChange={() => toggleSelection('reminders', '24h')} color="rose" />
                <ActionCheck label="1 Hora Antes" desc="Aviso urgente con ubicación." checked={formData.reminders.includes('1h')} onChange={() => toggleSelection('reminders', '1h')} color="rose" />
                <ActionCheck label="Confirmación Automática" desc="Solicita confirmar asistencia." checked={formData.reminders.includes('auto_confirm')} onChange={() => toggleSelection('reminders', 'auto_confirm')} color="rose" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={formData.reminders.length === 0} color="rose" />
        </div>
    );

    const DataStep = () => (
        <div className="space-y-6">
            <StepHeader title="Datos a Recolectar" subtitle="¿Qué info pedirás al agendar?" />
            <div className="space-y-3">
                <ActionCheck label="Nombre Completo" desc="Obligatorio." checked={true} color="rose" />
                <ActionCheck label="Servicio de Interés" desc="Selección de lista." checked={true} color="rose" />
                <ActionCheck label="Fecha y Hora" desc="Bloque seleccionado." checked={true} color="rose" />
                <ActionCheck label="Teléfono / WhatsApp" desc="Para recordatorios." checked={true} color="rose" />
            </div>
            <NavButtons back={prevStep} next={nextStep} disabled={false} color="rose" />
        </div>
    );

    const SummaryStep = () => (
        <div className="space-y-6">
            <StepHeader title="Agenda Lista" subtitle="Tu sistema de gestión de tiempo:" />

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <CalendarDays className="w-6 h-6 text-rose-400" />
                    <span className="font-bold text-white">Horario: <span className="text-rose-400">{formData.hours.start} - {formData.hours.end}</span></span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-2">
                    <SummaryItem text={`Tipo: ${formData.type}`} color="rose" />
                    <SummaryItem text={`Canales: ${formData.channels.length} activos`} color="rose" />
                    <SummaryItem text={`Recordatorios: ${formData.reminders.length} reglas`} color="rose" />
                    <SummaryItem text="Datos: Se guardan automáticamente en CRM" color="rose" />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button onClick={prevStep} className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-bold transition-all">
                    Atrás
                </button>
                <button onClick={onComplete} className="flex-1 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2">
                    <Watch className="w-5 h-5" /> Instalar Agenda
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0A0A12] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
                <div className="h-1 bg-white/5 w-full">
                    <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${(step / 7) * 100}%` }} />
                </div>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {step === 1 && <WelcomeStep />}
                            {step === 2 && <TypeStep />}
                            {step === 3 && <AvailabilityStep />}
                            {step === 4 && <ChannelStep />}
                            {step === 5 && <RemindersStep />}
                            {step === 6 && <DataStep />}
                            {step === 7 && <SummaryStep />}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white">✕</button>
            </motion.div>
        </div>
    );
}

// --- Helpers ---

function StepHeader({ title, subtitle }) {
    return (
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{subtitle}</p>
        </div>
    );
}

function NavButtons({ back, next, disabled, color = 'purple' }) {
    const bg = color === 'rose' ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20' : 'bg-purple-600';
    return (
        <div className="flex justify-between pt-8 border-t border-white/5 mt-8">
            <button onClick={back} className="px-6 py-2 text-gray-400 hover:text-white transition-colors font-medium">Atrás</button>
            <button
                onClick={next}
                disabled={disabled}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${disabled ? 'bg-white/5 text-gray-600 cursor-not-allowed' : `${bg} text-white shadow-lg`}`}
            >
                Siguiente <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

function SelectCard({ icon: Icon, label, selected, onClick, color = 'rose' }) {
    const activeClass = color === 'rose' ? 'bg-rose-500/20 border-rose-500' : 'bg-purple-500/20 border-purple-500';
    const activeText = color === 'rose' ? 'text-rose-400' : 'text-purple-400';

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${selected ? `${activeClass} text-white` : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
        >
            <Icon className={`w-8 h-8 ${selected ? activeText : 'text-gray-500'}`} />
            <span className="font-bold text-sm">{label}</span>
        </div>
    );
}

function ActionCheck({ label, desc, checked, onChange, color = 'rose' }) {
    const activeClass = color === 'rose' ? 'bg-rose-500/10 border-rose-500/50' : 'bg-purple-500/10 border-purple-500/50';
    const checkClass = color === 'rose' ? 'bg-rose-500 border-rose-500' : 'bg-purple-500 border-purple-500';

    return (
        <div
            onClick={onChange}
            className={`cursor-pointer p-4 rounded-xl border flex items-start gap-4 transition-all ${checked ? activeClass : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
        >
            <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? checkClass : 'border-gray-600'}`}>
                {checked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
            </div>
            <div>
                <div className={`font-bold text-sm ${checked ? 'text-white' : 'text-gray-300'}`}>{label}</div>
                <div className="text-xs text-gray-500 mt-1">{desc}</div>
            </div>
        </div>
    );
}

function SummaryItem({ text, color = 'green' }) {
    const col = color === 'rose' ? 'text-rose-500' : 'text-green-500';
    return (
        <div className="flex items-center gap-2 text-gray-300 text-sm">
            <CheckCircle className={`w-4 h-4 ${col}`} />
            <span>{text}</span>
        </div>
    );
}
