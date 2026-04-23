'use client';

import { motion } from 'framer-motion';
import {
    Clock, CheckCircle, FileText, Download, MessageSquare,
    AlertCircle, Users, Layout, Eye, ThumbsUp, PenTool, Share2
} from 'lucide-react';

export default function DesignDashboard({ project, onBack }) {
    // Mock Data
    const versions = [
        { id: 'v2', name: 'Concept_V2_Dark.png', status: 'pending', date: '2h ago', comments: 3 },
        { id: 'v1', name: 'Concept_V1.png', status: 'rejected', date: 'Yesterday', comments: 12 },
    ];

    return (
        <div className="min-h-screen bg-[#050511] p-6 lg:p-12 text-white">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse"></span>
                            <span className="text-fuchsia-500 text-xs font-mono uppercase tracking-widest">Active Sprint</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">{project?.projectName || 'Brand Rebranding 2024'}</h1>
                        <p className="text-gray-500 font-mono text-sm mt-1">Ticket: #DSGN-882 • {project?.service?.label || 'Identity Pack'}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-bold text-sm">
                            Back to Studio
                        </button>
                        <button className="px-6 py-3 rounded-xl bg-white text-black font-bold text-sm shadow-lg hover:scale-105 transition-transform">
                            Full Preview
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left: Main Stage / Proofing */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Current Version Card */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-1 overflow-hidden relative">
                            {/* Toolbar */}
                            <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
                                <div className="bg-[#0E0E18]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-white flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    V2 (Latest)
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-[#0E0E18]/80 backdrop-blur-md rounded-full border border-white/10 text-white hover:text-fuchsia-400">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-[#0E0E18]/80 backdrop-blur-md rounded-full border border-white/10 text-white hover:text-fuchsia-400">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Image Placeholder area */}
                            <div className="aspect-video bg-[#050511] rounded-[22px] m-1 border border-dashed border-white/5 flex items-center justify-center relative group">
                                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10"></div>
                                <div className="text-center relative z-10 transition-transform duration-500 group-hover:scale-105">
                                    <div className="w-24 h-24 bg-gradient-to-tr from-fuchsia-600 to-purple-600 rounded-2xl mx-auto mb-4 shadow-2xl rotate-3 flex items-center justify-center">
                                        <Layout className="w-10 h-10 text-white" />
                                    </div>
                                    <p className="text-gray-500 text-sm font-mono">Generando Previsualización...</p>
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="p-6 flex justify-between items-center">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0E0E18] bg-gray-700"></div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-[#0E0E18] bg-gray-800 flex items-center justify-center text-[10px] text-gray-400">+2</div>
                                </div>
                                <div className="flex gap-4">
                                    <button className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-bold transition-colors flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> Comentar
                                    </button>
                                    <button className="px-6 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-bold transition-colors shadow-lg shadow-fuchsia-500/20 flex items-center gap-2">
                                        <ThumbsUp className="w-4 h-4" /> Aprobar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Version History */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-8">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-500" /> Historial de Versiones
                            </h3>
                            <div className="space-y-4">
                                {versions.map(v => (
                                    <div key={v.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center font-bold text-gray-500">{v.id.toUpperCase()}</div>
                                            <div>
                                                <div className="font-bold text-sm text-white">{v.name}</div>
                                                <div className="text-[10px] text-gray-500 font-mono">{v.date}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <MessageSquare className="w-3 h-3" /> {v.comments}
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${v.status === 'rejected' ? 'border-red-500/20 text-red-500 bg-red-500/10' :
                                                'border-gray-500/20 text-gray-500'
                                                }`}>
                                                {v.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right: Project Meta */}
                    <div className="space-y-6">

                        {/* Brief Summary */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                            <h3 className="font-bold text-white mb-4">Project Brief</h3>
                            <div className="space-y-3 text-sm">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Archetype</div>
                                    <div className="text-fuchsia-400 font-bold">{project?.archetype || 'The Creator'}</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Color Mood</div>
                                    <div className="text-white font-bold">{project?.colorMood || 'Bold & Vibrante'}</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Deliverables</div>
                                    <div className="text-white font-bold">Vector + Digital Kit</div>
                                </div>
                            </div>
                        </div>

                        {/* Team */}
                        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white">Creative Team</h3>
                                <button className="text-xs text-fuchsia-400 font-bold hover:text-white transition-colors">Manage</button>
                            </div>
                            <div className="flex -space-x-3 overflow-hidden p-2">
                                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0E0E18]" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="" />
                                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0E0E18]" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="" />
                                <div className="h-10 w-10 rounded-full ring-2 ring-[#0E0E18] bg-gray-800 flex items-center justify-center text-xs font-bold text-white">+3</div>
                            </div>
                            <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-sm font-bold text-white transition-colors flex items-center justify-center gap-2">
                                <MessageSquare className="w-4 h-4" /> Team Chat
                            </button>
                        </div>

                        {/* Help / Support */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-fuchsia-900/20 to-purple-900/20 border border-fuchsia-500/20">
                            <h4 className="font-bold text-fuchsia-300 text-sm mb-1">Need Adjustments?</h4>
                            <p className="text-xs text-fuchsia-200/60 mb-3">You have 2 revision rounds remaining for this sprint.</p>
                            <button className="text-xs font-bold text-white hover:text-fuchsia-300 transition-colors underline">Request Changes</button>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
