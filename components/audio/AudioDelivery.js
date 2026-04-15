'use client';

import { useState } from 'react';
import { Upload, CheckCircle2, AlertTriangle, FileAudio, RefreshCw } from 'lucide-react';

export default function AudioDelivery() {
    const [isChecking, setIsChecking] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, checking, success, error

    const handleUpload = () => {
        setIsChecking(true);
        setUploadStatus('checking');

        // Mock analysis
        setTimeout(() => {
            setIsChecking(false);
            setUploadStatus('success');
        }, 2500);
    };

    return (
        <div className="bg-[#0A0A12] border border-white/5 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" /> Entrega Técnica
            </h3>

            {uploadStatus === 'idle' && (
                <div
                    onClick={handleUpload}
                    className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
                >
                    <div className="w-16 h-16 bg-black/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <FileAudio className="w-8 h-8 text-gray-500 group-hover:text-indigo-400" />
                    </div>
                    <p className="text-gray-300 font-bold">Arrastra tu Mix Final aquí</p>
                    <p className="text-gray-500 text-xs mt-2">WAV 48kHz / 24bit Check Automático de LUFS</p>
                </div>
            )}

            {uploadStatus === 'checking' && (
                <div className="py-12 text-center space-y-4">
                    <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
                    <div>
                        <p className="text-white font-bold animate-pulse">Analizando Especificaciones...</p>
                        <p className="text-gray-500 text-xs">Verificando Loudness Standards (EBU R128)</p>
                    </div>
                </div>
            )}

            {uploadStatus === 'success' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-emerald-500 rounded-full text-white shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-emerald-400 font-black uppercase tracking-wider text-sm">Validación Exitosa</h4>
                            <p className="text-white font-bold text-lg">Podcast_Final_Master_v2.wav</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-[#050510] p-3 rounded-lg border border-emerald-500/20 text-center">
                            <span className="block text-gray-500 text-[10px] uppercase">Integrated</span>
                            <span className="text-white font-mono font-bold">-14.1 LUFS</span>
                        </div>
                        <div className="bg-[#050510] p-3 rounded-lg border border-emerald-500/20 text-center">
                            <span className="block text-gray-500 text-[10px] uppercase">True Peak</span>
                            <span className="text-white font-mono font-bold">-1.1 dBTP</span>
                        </div>
                        <div className="bg-[#050510] p-3 rounded-lg border border-emerald-500/20 text-center">
                            <span className="block text-gray-500 text-[10px] uppercase">LRA</span>
                            <span className="text-white font-mono font-bold">4.2 LU</span>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold uppercase tracking-widest rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
                        Confirmar y Enviar a Cliente
                    </button>
                </div>
            )}
        </div>
    );
}
