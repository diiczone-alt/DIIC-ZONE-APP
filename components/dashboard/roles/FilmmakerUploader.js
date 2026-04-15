'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UploadCloud, Film, Camera, Mic,
    Aperture, Sun, AlertTriangle, CheckCircle2,
    FolderPlus, X, ChevronRight, FileVideo
} from 'lucide-react';
import { toast } from 'sonner';

export default function FilmmakerUploader({ projectId, onComplete }) {
    const [step, setStep] = useState(1); // 1: Select Type, 2: Upload Files, 3: Metadata
    const [currentScene, setCurrentScene] = useState('');
    const [uploads, setUploads] = useState([]);

    // Upload Categories defined in workflow
    const categories = [
        { id: 'MAIN', label: 'Toma Principal', icon: Film, desc: 'Entrevistas, acción principal' },
        { id: 'SUPPORT', label: 'Tomas de Apoyo', icon: Camera, desc: 'B-Roll, detalles, insertos' },
        { id: 'DRONE', label: 'Dron / Aéreas', icon: Aperture, desc: 'Contexto, ubicación' },
        { id: 'AUDIO', label: 'Audio Directo', icon: Mic, desc: 'Micrófono externo, ambiente' }
    ];

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [metadata, setMetadata] = useState({
        lighting: 'GOOD', // GOOD, BAD, MIXED
        issues: '',
        notes: ''
    });

    const handleFileDrop = (e) => {
        e.preventDefault();
        // Simulation of file handling
        const newFiles = Array.from(e.dataTransfer ? e.dataTransfer.files : e.target.files).map(f => ({
            name: f.name,
            size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
            type: selectedCategory?.id || 'UNCATEGORIZED'
        }));

        setUploads([...uploads, ...newFiles]);
        toast.success(`${newFiles.length} clips agregados a ${selectedCategory?.label}`);
    };

    const handleUpload = () => {
        // Here we would trigger the actual upload to Supabase Storage
        toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
            loading: 'Subiendo material estructurado...',
            success: 'Material subido y notificado al CM.',
            error: 'Error al subir material'
        });
        setTimeout(() => onComplete && onComplete(), 2000);
    };

    return (
        <div className="bg-[#0A0A12] border border-white/10 rounded-3xl overflow-hidden text-left">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-white flex items-center gap-2">
                            <UploadCloud className="w-5 h-5 text-indigo-400" />
                            Ingesta de Material <span className="text-gray-500">Filmmaker Pro</span>
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Sube el material organizado por escenas para facilitar la edición.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Proyecto</div>
                        <div className="text-sm font-bold text-white">Campaña Dental Confianza</div>
                    </div>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: Category Selection */}
                <div className="lg:col-span-4 space-y-4 border-r border-white/5 pr-8">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">1. Selecciona Categoría</h3>

                    <div className="space-y-2">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${selectedCategory?.id === cat.id
                                        ? 'bg-indigo-500/20 border-indigo-500 text-white'
                                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${selectedCategory?.id === cat.id ? 'bg-indigo-500' : 'bg-white/10 group-hover:bg-white/20'
                                    }`}>
                                    <cat.icon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{cat.label}</div>
                                    <div className="text-[10px] opacity-60">{cat.desc}</div>
                                </div>
                                {selectedCategory?.id === cat.id && (
                                    <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                        <div className="flex gap-2">
                            <Sun className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            <div>
                                <div className="text-xs font-bold text-yellow-500 mb-1">Condición de Luz</div>
                                <select
                                    className="w-full bg-[#050511] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-yellow-500/50"
                                    value={metadata.lighting}
                                    onChange={(e) => setMetadata({ ...metadata, lighting: e.target.value })}
                                >
                                    <option value="GOOD">Buena / Controlada</option>
                                    <option value="MIXED">Mixta / Variable</option>
                                    <option value="BAD">Poca luz / Ruido</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CENTER: Dropzone & File List */}
                <div className="lg:col-span-8 flex flex-col h-full">
                    {selectedCategory ? (
                        <div className="flex-1 space-y-6">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex justify-between">
                                <span>2. Archivos en {selectedCategory.label}</span>
                                <span className="text-indigo-400">{uploads.filter(u => u.type === selectedCategory.id).length} clips</span>
                            </h3>

                            {/* Dropzone */}
                            <div
                                className="border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors p-10 text-center cursor-pointer group relative overflow-hidden"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleFileDrop}
                            >
                                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <UploadCloud className="w-10 h-10 text-gray-600 group-hover:text-indigo-400 mx-auto mb-4 transition-colors" />
                                <h4 className="text-white font-bold mb-1">Arrastra tus clips aquí</h4>
                                <p className="text-gray-500 text-xs">Soporta .MP4, .MOV, .MXF (Max 50GB)</p>
                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileDrop} />
                            </div>

                            {/* List */}
                            <div className="bg-[#050511] border border-white/10 rounded-xl p-4 max-h-[300px] overflow-y-auto space-y-2">
                                {uploads.length === 0 && (
                                    <div className="text-center text-gray-600 text-xs py-8 italic">No hay archivos cargados aún</div>
                                )}
                                {uploads.map((file, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileVideo className="w-4 h-4 text-indigo-400" />
                                            <div>
                                                <div className="text-xs font-bold text-white text-left">{file.name}</div>
                                                <div className="text-[10px] text-gray-500 flex gap-2">
                                                    <span>{file.size}</span>
                                                    <span className="uppercase text-indigo-400">{file.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-gray-600 hover:text-red-400 p-1"><X className="w-3 h-3" /></button>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Notes Input */}
                            <div>
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">Notas para el Editor</label>
                                <textarea
                                    className="w-full bg-[#050511] border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-indigo-500/50 min-h-[80px]"
                                    placeholder="Ej: Usar toma 3 para el gancho, el audio del dron falló..."
                                    value={metadata.notes}
                                    onChange={(e) => setMetadata({ ...metadata, notes: e.target.value })}
                                />
                            </div>

                            {/* Action Footer */}
                            <div className="pt-4 border-t border-white/10 flex justify-end">
                                <button
                                    onClick={handleUpload}
                                    disabled={uploads.length === 0}
                                    className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    Subir y Notificar CM
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-30">
                            <FolderPlus className="w-16 h-16 text-gray-500 mb-4" />
                            <p className="text-sm font-bold text-gray-400">Selecciona una categoría a la izquierda para empezar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
