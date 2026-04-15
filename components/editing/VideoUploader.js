'use client';

import { useState, useCallback } from 'react';
import { UploadCloud, FileVideo, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoUploader({ onUploadComplete }) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFile = (selectedFile) => {
        if (selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
        } else {
            alert('Por favor sube solo archivos de video.');
        }
    };

    const uploadFile = () => {
        setUploading(true);
        // Simulate upload
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setUploading(false);
                if (onUploadComplete) onUploadComplete(file);
                // Reset after success
                setTimeout(() => {
                    setFile(null);
                    setProgress(0);
                }, 2000);
            }
        }, 100);
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!file ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer
                            ${isDragging ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('video-input').click()}
                    >
                        <input
                            type="file"
                            id="video-input"
                            className="hidden"
                            accept="video/*"
                            onChange={(e) => handleFile(e.target.files[0])}
                        />
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-primary">
                            <UploadCloud className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Sube tus clips aquí</h3>
                        <p className="text-gray-400 text-sm max-w-xs">Arrastra y suelta tus archivos de video (.mp4, .mov) para comenzar la edición.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <FileVideo className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-white font-bold truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                            </div>
                            {!uploading && progress < 100 && (
                                <button onClick={() => setFile(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {uploading || progress > 0 ? (
                            <div className="space-y-2 relative z-10">
                                <div className="flex justify-between text-xs font-bold text-gray-400">
                                    <span>{progress >= 100 ? 'Completado' : 'Subiendo...'}</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                {progress >= 100 && (
                                    <div className="flex items-center gap-2 text-green-400 text-sm font-bold mt-2 justify-center">
                                        <CheckCircle className="w-4 h-4" /> Listo para revisar
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={uploadFile}
                                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 relative z-10"
                            >
                                Iniciar Carga
                            </button>
                        )}

                        {/* Background Effect */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
