'use client';

import { motion } from 'framer-motion';
import {
    Clock, Calendar, MessageSquare, FileAudio, CheckCircle2,
    MoreHorizontal, Download, Play, Pause, Activity, Mic2, Disc
} from 'lucide-react';

export default function AudioDashboard({ activeProject, onBack }) {
    // Mock Data if no active project
    const project = activeProject || {
        id: 'PRJ-2024-001',
        title: 'Neon Nights Podcast - Ep 1',
        status: 'mixing', // received, recording, mixing, mastering, delivered
        service: 'Full Production Suite',
        engineer: 'Alex V.',
        startDate: '2024-03-15',
        deliveryDate: '2024-03-18'
    };

    const STEPS = [
        { id: 'recording', label: 'Tracking', date: 'Mar 15' },
        { id: 'mixing', label: 'Mixing', date: 'Mar 16' },
        { id: 'mastering', label: 'Mastering', date: 'In Progress' },
        { id: 'delivered', label: 'Release', date: 'Est. Mar 18' }
    ];

    const getCurrentStepIndex = () => {
        const statuses = ['received', 'recording', 'mixing', 'mastering', 'delivered'];
        return statuses.indexOf(project.status) - 1; // Adjust index as needed
    };

    return (
        <div className="min-h-screen bg-[#050511] text-white p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">

                {/* Top Nav / Status Bar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            <span className="text-amber-400 text-xs font-mono uppercase tracking-widest">Work in Progress</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">{project.title}</h1>
                        <p className="text-gray-500 font-mono text-sm mt-1">ID: {project.id} • {project.service}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-bold text-sm">
                            Volver al Estudio
                        </button>
                        <button className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-500/20">
                            Abrir Sesión
                        </button>
                    </div>
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Column: Timeline & Status */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Process Visualizer (DAW Track Style) */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <Activity className="w-24 h-24 text-white" />
                            </div>

                            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <Disc className="w-5 h-5 text-sky-500" />
                                Signal Flow
                            </h2>

                            <div className="relative">
                                {/* Connecting Line */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 rounded-full"></div>
                                <div className="absolute top-1/2 left-0 h-1 bg-sky-500 -translate-y-1/2 rounded-full transition-all duration-1000" style={{ width: '60%' }}></div>

                                <div className="grid grid-cols-4 gap-4 relative z-10">
                                    {STEPS.map((step, i) => (
                                        <div key={step.id} className="flex flex-col items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${i <= 2 // Mocking "Mixing" as current
                                                    ? 'bg-[#0E0E18] border-sky-500 text-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.3)]'
                                                    : 'bg-[#0E0E18] border-gray-800 text-gray-600'
                                                }`}>
                                                {i < 2 ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-3 h-3 rounded-full bg-current" />}
                                            </div>
                                            <div className="text-center">
                                                <div className={`font-bold text-sm mb-1 ${i <= 2 ? 'text-white' : 'text-gray-600'}`}>{step.label}</div>
                                                <div className="text-[10px] font-mono text-gray-500 uppercase">{step.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Stems / Files List */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-3">
                                    <FileAudio className="w-5 h-5 text-violet-500" />
                                    Entregables & Stems
                                </h2>
                                <button className="text-xs font-bold text-violet-400 hover:text-violet-300 uppercase tracking-widest">Download All</button>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { name: 'Master_Final_v3.wav', type: 'WAV 48kHz', size: '45MB' },
                                    { name: 'Mix_Reference_v3.mp3', type: 'MP3 320kbps', size: '8MB' },
                                    { name: 'Vocal_Stems.zip', type: 'ZIP Archive', size: '120MB' }
                                ].map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                                                <Play className="w-4 h-4 text-gray-400 group-hover:text-white fill-current" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-gray-200">{file.name}</div>
                                                <div className="text-[10px] text-gray-500 font-mono uppercase">{file.type} • {file.size}</div>
                                            </div>
                                        </div>
                                        <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Engineer & Chat */}
                    <div className="space-y-8">

                        {/* Engineer Card */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8 text-center">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mb-4 border-2 border-white/10 p-1">
                                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                                    <Mic2 className="w-8 h-8 text-gray-500" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">{project.engineer}</h3>
                            <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-sky-400 mb-6">
                                Lead Engineer
                            </div>
                            <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Contactar Estudio
                            </button>
                        </div>

                        {/* Recent Activity / Logs */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Session Logs</h3>
                            <div className="space-y-6 relative">
                                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-white/5"></div>
                                {[
                                    { time: '10:42 AM', text: 'v3 Mix uploaded for review' },
                                    { time: '09:15 AM', text: 'Vocal tuning completed' },
                                    { time: 'Yesterday', text: 'Tracking session finished' }
                                ].map((log, i) => (
                                    <div key={i} className="flex gap-4 relative z-10">
                                        <div className="w-3 h-3 rounded-full bg-gray-800 border-2 border-[#050511] mt-1.5 ring-2 ring-gray-800"></div>
                                        <div>
                                            <div className="text-sm text-gray-300">{log.text}</div>
                                            <div className="text-[10px] text-gray-600 font-mono mt-1">{log.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
