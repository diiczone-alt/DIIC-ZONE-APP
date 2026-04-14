'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
    MapPin, FileText, Upload, Globe, Navigation, 
    CheckCircle, AlertCircle, Eye, Trash2, Download 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    
    // Form states
    const [fullName, setFullName] = useState('');
    const [location, setLocation] = useState('');
    const [cvUrl, setCvUrl] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || '');
            setLocation(user.location || '');
            setCvUrl(user.cv_url || '');
            setLoading(false);
        }
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    location: location,
                    cv_url: cvUrl
                })
                .eq('id', user.id);

            if (error) throw error;
            
            await refreshUser();
            setMessage({ type: 'success', text: 'Perfil actualizado con éxito 🚀' });
        } catch (err) {
            console.error('Error updating profile:', err);
            setMessage({ type: 'error', text: 'Error al actualizar el perfil.' });
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setMessage({ type: 'error', text: 'Por favor, sube solo archivos PDF.' });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'El archivo es demasiado grande (máx 5MB).' });
            return;
        }

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `cvs/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('cvs')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('cvs')
                .getPublicUrl(filePath);

            setCvUrl(publicUrl);
            
            // Auto-save to profile
            await supabase
                .from('profiles')
                .update({ cv_url: publicUrl })
                .eq('id', user.id);
            
            await refreshUser();
            setMessage({ type: 'success', text: 'CV cargado profesionalmente 📄' });
        } catch (err) {
            console.error('Error uploading CV:', err);
            setMessage({ type: 'error', text: 'Error al subir el CV.' });
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">
                        Perfil de <span className="text-indigo-500">Talento.</span>
                    </h1>
                    <p className="text-gray-400 font-medium">Gestiona tu ubicación y currículum profesional para asignaciones estratégicas.</p>
                </div>
                <div className="px-5 py-2 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                    ID: {user?.id?.slice(0, 8)}...
                </div>
            </div>

            {message.text && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                >
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-sm font-bold tracking-tight">{message.text}</span>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Information Card */}
                <div className="p-8 rounded-[2.5rem] bg-[#0E0E18]/60 border border-white/10 backdrop-blur-3xl shadow-2xl space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                            <MapPin className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Ubicación Estratégica</h2>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Nombre Completo</label>
                            <input 
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-medium outline-none focus:border-indigo-500/50 transition-all"
                                placeholder="Tu nombre real"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Ubicación en Ecuador</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white font-medium outline-none focus:border-indigo-500/50 transition-all"
                                    placeholder="Ej: Quito - Norte, Sector Carcelén"
                                />
                                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            </div>
                            <p className="text-[10px] text-gray-600 font-medium italic mt-1 ml-1">* Especifíca ciudad y zona para coordinar agendas físicas.</p>
                        </div>

                        <button 
                            type="submit"
                            disabled={saving}
                            className="w-full px-8 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5 disabled:opacity-50"
                        >
                            {saving ? 'Guardando...' : 'Actualizar Perfil'}
                        </button>
                    </form>
                </div>

                {/* CV Card */}
                <div className="p-8 rounded-[2.5rem] bg-[#0E0E18]/60 border border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col justify-between space-y-8">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                                <FileText className="w-6 h-6 text-purple-400" />
                            </div>
                            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Hoja de Vida (CV)</h2>
                        </div>

                        {!cvUrl ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] text-center space-y-4">
                                <div className="p-4 rounded-full bg-white/5">
                                    <Upload className="w-8 h-8 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Sube tu CV en PDF</p>
                                    <p className="text-gray-500 text-xs">Máximo 5MB</p>
                                </div>
                                <label className="cursor-pointer px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all">
                                    {uploading ? 'Subiendo...' : 'Seleccionar Archivo'}
                                    <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={uploading} />
                                </label>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-6 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">CV_Actualizado.pdf</p>
                                            <p className="text-emerald-400 text-[10px] font-black uppercase">Archivo Vinculado ✓</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setShowPreview(true)}
                                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={async () => {
                                                if (confirm('¿Seguro que quieres eliminar tu CV?')) {
                                                    await supabase.from('profiles').update({ cv_url: null }).eq('id', user.id);
                                                    setCvUrl('');
                                                    await refreshUser();
                                                }
                                            }}
                                            className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-500 text-center italic">Tu currículum será visible para los Administradores de DIIC ZONE.</p>
                            </div>
                        )}
                    </div>

                    {cvUrl && (
                        <button 
                            onClick={() => setShowPreview(true)}
                            className="w-full px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-3"
                        >
                            <Eye className="w-4 h-4" /> Previsualización Profesional
                        </button>
                    )}
                </div>
            </div>

            {/* Professional PDF Preview Modal */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#050511]/90 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0E0E18] w-full h-full max-w-5xl rounded-[3rem] border border-white/10 overflow-hidden flex flex-col shadow-[0_0_100px_rgba(79,70,229,0.2)]"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black uppercase tracking-widest text-xs">Previsualización de Perfil</h3>
                                        <p className="text-gray-500 text-[10px] font-bold">Documento CV - DIIC ZONE OS</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowPreview(false)}
                                    className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Cerrar Visor
                                </button>
                            </div>

                            {/* PDF Content Area */}
                            <div className="flex-1 bg-white/[0.01] p-4 flex items-center justify-center overflow-auto">
                                <object 
                                    data={cvUrl} 
                                    type="application/pdf" 
                                    className="w-full h-full rounded-2xl shadow-inner border border-white/5"
                                >
                                    <div className="text-center p-12">
                                        <AlertCircle className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                                        <p className="text-white font-bold mb-4">El navegador no puede previsualizar PDF directamente.</p>
                                        <a 
                                            href={cvUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest"
                                        >
                                            <Download className="w-4 h-4" /> Descargar para Ver
                                        </a>
                                    </div>
                                </object>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
