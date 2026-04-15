'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Play, Pause, Save, RotateCcw, Download } from 'lucide-react';

export default function AudioRecorder({ onBack, onSave }) {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioPlayerRef = useRef(null);
    const timerRef = useRef(null);

    // Start Recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioBlob(audioBlob);
                setAudioUrl(audioUrl);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);

            // Timer
            setDuration(0);
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("No se pudo acceder al micrófono. Por favor verifica los permisos.");
        }
    };

    // Stop Recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Play/Pause Preview
    const togglePlayback = () => {
        if (audioPlayerRef.current) {
            if (isPlaying) {
                audioPlayerRef.current.pause();
            } else {
                audioPlayerRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="min-h-screen bg-[#050511] p-8 flex flex-col items-center justify-center">

            <div className="max-w-2xl w-full bg-[#0E0E18] rounded-3xl border border-white/10 p-12 text-center relative overflow-hidden">

                {/* Visualizer Background Mockup */}
                <div className="absolute inset-x-0 bottom-0 h-32 opacity-20 flex items-end justify-center gap-1 pointer-events-none">
                    {[...Array(40)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={isRecording || isPlaying ? { height: ["10%", "80%", "30%"] } : { height: "10%" }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                            className="w-2 bg-orange-500 rounded-t-full"
                        />
                    ))}
                </div>

                <h2 className="text-2xl font-bold text-white mb-8">Estudio de Grabación</h2>

                {/* Timer Display */}
                <div className="text-7xl font-mono font-black text-white mb-12 tracking-widest tabular-nums">
                    {formatTime(duration)}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 relative z-10">

                    {!audioBlob ? (
                        <>
                            {!isRecording ? (
                                <button
                                    onClick={startRecording}
                                    className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all transform hover:scale-105"
                                >
                                    <Mic className="w-10 h-10 text-white" />
                                </button>
                            ) : (
                                <button
                                    onClick={stopRecording}
                                    className="w-24 h-24 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center border-4 border-red-500 animate-pulse transition-all"
                                >
                                    <Square className="w-8 h-8 text-white fill-white" />
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <button onClick={() => { setAudioBlob(null); setDuration(0); }} className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                <RotateCcw className="w-6 h-6" />
                            </button>

                            <button
                                onClick={togglePlayback}
                                className="w-20 h-20 rounded-full bg-orange-500 hover:bg-orange-400 flex items-center justify-center shadow-lg text-white transition-all hover:scale-105"
                            >
                                {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white pl-1" />}
                            </button>

                            <button onClick={() => onSave(audioBlob)} className="p-4 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 transition-colors">
                                <Save className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>

                {/* Instructions */}
                <p className="mt-12 text-gray-500 text-sm">
                    {isRecording ? "Grabando... Habla claro frente al micrófono." : audioBlob ? "Revisa tu grabación antes de guardar." : "Presiona el botón rojo para comenzar."}
                </p>

                {/* Hidden Audio Element */}
                {audioUrl && (
                    <audio
                        ref={audioPlayerRef}
                        src={audioUrl}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                    />
                )}

            </div>

            <button onClick={onBack} className="mt-8 text-gray-500 hover:text-white transition-colors text-sm font-medium">
                Volver al Menú
            </button>
        </div>
    );
}
