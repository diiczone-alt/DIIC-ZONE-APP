'use client';

import { useState, useEffect } from 'react';
import { X, Instagram, Facebook, Twitter, Linkedin, Video, Image as ImageIcon, Check, Loader2, Calendar, Clock, Tag, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const PLATFORMS = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { id: 'youtube', label: 'YouTube', icon: Video, color: 'text-red-400', bg: 'bg-red-500/10' },
];

const STATUSES = [
    { id: 'draft', label: 'Borrador', color: 'bg-gray-500/20 text-gray-400' },
    { id: 'scheduled', label: 'Programado', color: 'bg-blue-500/20 text-blue-400' },
    { id: 'published', label: 'Publicado', color: 'bg-emerald-500/20 text-emerald-400' },
    { id: 'editing', label: 'En Edición', color: 'bg-amber-500/20 text-amber-400' },
];

export default function ContentModal({ isOpen, onClose, task, selectedDate, onSave }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        platform: 'instagram',
        status: 'draft',
        publish_date: '',
        publish_time: '12:00',
        notes: '',
        client_id: '',
    });

    const [clients, setClients] = useState([]);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                platform: task.platform || 'instagram',
                status: task.status || 'draft',
                publish_date: task.publish_date ? new Date(task.publish_date).toISOString().split('T')[0] : '',
                publish_time: task.publish_date ? new Date(task.publish_date).toTimeString().slice(0, 5) : '12:00',
                notes: task.notes || '',
                client_id: task.client_id || '',
            });
        } else if (selectedDate) {
            setFormData(prev => ({
                ...prev,
                publish_date: selectedDate.toISOString().split('T')[0]
            }));
        } else {
             setFormData({
                title: '',
                platform: 'instagram',
                status: 'draft',
                publish_date: new Date().toISOString().split('T')[0],
                publish_time: '12:00',
                notes: '',
                client_id: '',
            });
        }
    }, [task, selectedDate, isOpen]);

    useEffect(() => {
        const fetchClients = async () => {
            const { data } = await supabase.from('clients').select('id, name');
            if (data) setClients(data);
        };
        if (isOpen) fetchClients();
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const fullDate = new Date(`${formData.publish_date}T${formData.publish_time}:00`);
            
            const taskData = {
                title: formData.title,
                platform: formData.platform,
                status: formData.status,
                publish_date: fullDate.toISOString(),
                notes: formData.notes,
                client_id: formData.client_id,
                updated_at: new Date().toISOString(),
            };

            let res;
            if (task?.id) {
                res = await supabase.from('tasks').update(taskData).eq('id', task.id);
            } else {
                res = await supabase.from('tasks').insert([{ ...taskData, created_at: new Date().toISOString() }]);
            }

            if (res.error) throw res.error;
            
            toast.success(task?.id ? 'Entrada actualizada' : 'Entrada creada con éxito');
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving task:', error);
            toast.error('Error al guardar la entrada');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0E0E18] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-indigo-600/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-white tracking-tight">
                                    {task ? 'Editar Entrada' : 'Nueva Entrada Editorial'}
                                </h3>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1.5 block">Título del Contenido</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ej: Lanzamiento Producto X"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                {/* Platform Multi-select (Simulation) */}
                                <div>
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2 block">Plataforma</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {PLATFORMS.map((p) => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, platform: p.id })}
                                                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                                                    formData.platform === p.id 
                                                    ? `${p.bg} border-indigo-500` 
                                                    : 'bg-white/5 border-white/5 hover:border-white/20'
                                                }`}
                                            >
                                                <p.icon className={`w-5 h-5 ${formData.platform === p.id ? p.color : 'text-gray-500'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Date */}
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1.5 block">Fecha de Publicación</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                required
                                                type="date"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium appearance-none"
                                                value={formData.publish_date}
                                                onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    {/* Time */}
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1.5 block">Hora Sugerida</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                required
                                                type="time"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium appearance-none"
                                                value={formData.publish_time}
                                                onChange={(e) => setFormData({ ...formData, publish_time: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2 block">Estado de la Tarea</label>
                                    <div className="flex flex-wrap gap-2">
                                        {STATUSES.map(s => (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, status: s.id })}
                                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                    formData.status === s.id 
                                                    ? 'bg-indigo-600 text-white border-indigo-500' 
                                                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1.5 block">Notas / Brief</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Instrucciones adicionales..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium resize-none text-sm"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-2">
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full h-12 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            {task ? 'Guardar Cambios' : 'Crear Entrada'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
