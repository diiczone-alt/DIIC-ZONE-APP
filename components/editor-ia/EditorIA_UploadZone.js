'use client';

import { useState } from 'react';
import { Upload, FileVideo, Music, CheckCircle2, X, Trash2, ScanLine, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditorIA_UploadZone({ onContinue }) {
    const [files, setFiles] = useState([]);
    const [isScanning, setIsScanning] = useState(false);

    // Simulated "Smart Classification" logic
    const handleDrop = (acceptedFiles) => {
        setIsScanning(true);
        const newFiles = acceptedFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: 'analyzing', // will change
            quality: 0,
            tags: [],
            status: 'analyzing', // analyzing -> ready
            file
        }));

        setFiles(prev => [...prev, ...newFiles]);

        // Simulate AI Scanner
        newFiles.forEach((f, index) => {
            setTimeout(() => {
                const analysis = analyzeFileIO(f.file); // Mock analysis
                setFiles(prev => prev.map(pf => pf.id === f.id ? {
                    ...pf,
                    type: analysis.type,
                    quality: analysis.quality,
                    tags: analysis.tags,
                    status: 'ready'
                } : pf));

                if (index === newFiles.length - 1) setIsScanning(false);
            }, 1000 + (index * 800)); // Staggered reveal
        });
    };

    // Mock logic for demo
    const analyzeFileIO = (file) => {
        const n = file.name.toLowerCase();
        let type = 'Raw';
        let quality = Math.floor(Math.random() * (100 - 70) + 70); // 70-100
        let tags = [];

        if (n.includes('interview') || n.includes('talking') || n.includes('cam')) {
            type = 'A-Roll';
            tags = ['Rostro Detectado', 'Voz Clara'];
            quality = 92;
        } else if (n.includes('broll') || n.includes('cover') || n.includes('stock')) {
            type = 'B-Roll';
            tags = ['Estable', 'Iluminación OK'];
            quality = 85;
        } else if (n.includes('drone')) {
            type = 'Drone';
            tags = ['4K', 'Cinemático'];
            quality = 98;
        } else if (file.type.startsWith('audio')) {
            type = 'Audio';
            tags = ['Stereo'];
        } else {
            // Randomly assign "Discard" for demo
            if (Math.random() > 0.8) {
                type = 'Descartable';
                tags = ['Movimiento Brusco', 'Fuera de Foco'];
                quality = 45;
            } else {
                type = 'B-Roll';
                tags = ['General'];
            }
        }
        return { type, quality, tags };
    };

    const removeFile = (id) => {
        setFiles(files.filter(f => f.id !== id));
    };

    const readyFiles = files.filter(f => f.status === 'ready');
    const goodFiles = readyFiles.filter(f => f.type !== 'Descartable');

    return (
        <div className="h-full flex flex-col max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <ScanLine className="w-6 h-6 text-cyan-400" /> Ingesta Inteligente
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Sube tu material. El Scanner IA separará lo útil de lo descartable.</p>
                </div>
                {isScanning && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold animate-pulse">
                        <BrainCircuit className="w-3 h-3" /> ANALIZANDO VECTORES DE MOVIMIENTO...
                    </div>
                )}
            </div>

            {/* Upload Area */}
            <div className="h-32 border-2 border-dashed border-white/10 rounded-2xl bg-[#0A0A12] hover:bg-white/5 transition-colors relative group mb-8 flex flex-col items-center justify-center cursor-pointer">
                <input
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    onChange={(e) => handleDrop(Array.from(e.target.files))}
                />
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-300 font-bold text-sm">Arrastra clips aquí</p>
                <p className="text-gray-500 text-xs">Video, Audio, Imágenes</p>
            </div>

            {/* File List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 overflow-hidden">

                {/* COLUMN 1: USEFUL MATERIAL */}
                <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-4 flex flex-col h-full overflow-hidden">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" /> Material Útil
                        </h3>
                        <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{goodFiles.length} clips</span>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                        <AnimatePresence>
                            {goodFiles.map(file => (
                                <FileItem key={file.id} file={file} onRemove={removeFile} />
                            ))}
                        </AnimatePresence>
                        {goodFiles.length === 0 && !isScanning && (
                            <div className="h-full flex items-center justify-center text-gray-600 text-xs italic">Esperando material...</div>
                        )}
                    </div>
                </div>

                {/* COLUMN 2: DISCARDED / PROBLEMS */}
                <div className="bg-[#0E0E18] border border-red-500/10 rounded-2xl p-4 flex flex-col h-full overflow-hidden">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                        <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                            <Trash2 className="w-3 h-3" /> Descartado por IA
                        </h3>
                        <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                            {readyFiles.filter(f => f.type === 'Descartable').length} clips
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                        <AnimatePresence>
                            {readyFiles.filter(f => f.type === 'Descartable').map(file => (
                                <FileItem key={file.id} file={file} onRemove={removeFile} />
                            ))}
                        </AnimatePresence>
                        {readyFiles.filter(f => f.type === 'Descartable').length === 0 && !isScanning && (
                            <div className="h-full flex items-center justify-center text-gray-600 text-xs italic">Sin descartes (¡Buen trabajo de cámara!)</div>
                        )}
                    </div>
                </div>

            </div>

            {/* Continue Button */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={onContinue}
                    disabled={goodFiles.length === 0 || isScanning}
                    className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                    Analizar y Estructurar <BrainCircuit className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function FileItem({ file, onRemove }) {
    const isDiscard = file.type === 'Descartable';

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className={`flex items-center justify-between p-3 rounded-xl border group transition-all
                ${isDiscard ? 'bg-red-500/5 border-red-500/10 hover:border-red-500/30' : 'bg-[#1A1A24] border-white/5 hover:border-cyan-500/30'}`}
        >
            <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden
                    ${isDiscard ? 'bg-red-900/20 text-red-400' : 'bg-black/40 text-gray-400'}`}>
                    {file.type === 'Audio' ? <Music className="w-4 h-4" /> : <FileVideo className="w-4 h-4" />}

                    {/* Quality Ring */}
                    {!isDiscard && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                            <div className="h-full bg-green-400" style={{ width: `${file.quality}%` }} />
                        </div>
                    )}
                </div>

                <div className="min-w-0">
                    <div className={`text-xs font-bold truncate ${isDiscard ? 'text-red-200' : 'text-gray-200'}`}>
                        {file.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
                            ${isDiscard ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-400'}`}>
                            {file.type}
                        </span>
                        <div className="flex gap-1">
                            {file.tags.map((tag, i) => (
                                <span key={i} className="text-[9px] text-gray-500 bg-white/5 px-1 rounded">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={() => onRemove(file.id)} className="p-1.5 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                <X className="w-3 h-3" />
            </button>
        </motion.div>
    );
}
