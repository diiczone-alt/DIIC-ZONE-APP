'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Calendar, MapPin, Camera, Printer, Share2, MoreHorizontal,
    CheckCircle, Aperture, HardDrive, Eye, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function PhotoDashboard({ activeProject, onBack }) {
    const { user } = useAuth();

    // Status Flow
    const STEPS = [
        { id: 'shoot', label: 'Sesión', date: '20 Feb' },
        { id: 'proofing', label: 'Proofing', date: '21 Feb' }, // Contact sheet
        { id: 'retouch', label: 'Retoque', date: '23 Feb' }, // High-end work
        { id: 'delivery', label: 'Entrega', date: '25 Feb' }
    ];

    const currentStepIndex = 1; // Simulation: 'Proofing' / Contact Sheet

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Navbar Compact */}
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={onBack}
                    className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white text-xs font-bold flex items-center gap-2 transition-colors"
                >
                    ← Dashboard
                </button>
                <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded-full">
                    Producción Activa
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Card */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0E0E18] border border-white/10 rounded-3xl p-8 relative overflow-hidden"
                    >
                        {/* Project Header */}
                        <div className="relative z-10 flex justify-between items-start mb-10">
                            <div>
                                <h4 className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mb-2">Proyecto #PH-8942</h4>
                                <h2 className="text-3xl font-black text-white leading-none mb-4">{activeProject?.subType || 'Campaña Médica 2024'}</h2>
                                <div className="flex gap-4 text-xs text-gray-400 font-mono">
                                    <span className="flex items-center gap-2"><Calendar className="w-3 h-3 text-gray-600" /> 20 Feb 2024</span>
                                    <span className="flex items-center gap-2"><MapPin className="w-3 h-3 text-gray-600" /> Consultorio Principal</span>
                                </div>
                            </div>
                            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <MoreHorizontal className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* Pro Timeline */}
                        <div className="relative z-10 mb-10">
                            <div className="flex justify-between items-end">
                                {STEPS.map((step, idx) => {
                                    const isActive = idx === currentStepIndex;
                                    const isDone = idx < currentStepIndex;
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-3 relative group w-1/4">
                                            <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 w-full">
                                                <span className="text-[9px] text-gray-500 block">{step.date}</span>
                                            </div>
                                            <div className={`w-3 h-3 rounded-full border-2 z-10 transition-all ${isActive ? 'bg-black border-pink-500 scale-125' :
                                                    isDone ? 'bg-pink-500 border-pink-500' : 'bg-[#0E0E18] border-gray-800'
                                                }`} />
                                            <span className={`text-[9px] uppercase font-bold tracking-wider ${isActive ? 'text-white' : 'text-gray-600'}`}>{step.label}</span>

                                            {/* Line */}
                                            {idx < STEPS.length - 1 && (
                                                <div className={`absolute top-1.5 left-[50%] w-full h-px -z-0 ${idx < currentStepIndex ? 'bg-pink-500' : 'bg-gray-800'
                                                    }`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Deliverables Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-pink-500/30 transition-colors group cursor-pointer">
                                <div className="flex justify-between items-start mb-8">
                                    <Eye className="w-5 h-5 text-gray-500 group-hover:text-pink-500 transition-colors" />
                                    <ArrowUpRight className="w-3 h-3 text-gray-600" />
                                </div>
                                <div className="text-xs text-gray-400 uppercase font-bold mb-1">Contact Sheet</div>
                                <div className="text-white font-bold text-sm">Ver Pruebas (84)</div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 opacity-50 cursor-not-allowed">
                                <div className="flex justify-between items-start mb-8">
                                    <HardDrive className="w-5 h-5 text-gray-500" />
                                    <ArrowUpRight className="w-3 h-3 text-gray-600" />
                                </div>
                                <div className="text-xs text-gray-400 uppercase font-bold mb-1">Archivos Finales</div>
                                <div className="text-white font-bold text-sm">Pendiente Retoque</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* UPSELL: Fine Art Print */}
                    <div className="relative overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-500/20">
                        <div className="bg-[#0E0E18]/90 backdrop-blur-xl rounded-2xl p-6 flex items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                    <Printer className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight mb-1">Fine Art Printing</h3>
                                    <p className="text-gray-400 text-xs max-w-[200px]">
                                        Imprime tus mejores tomas en papel de algodón o gran formato.
                                    </p>
                                </div>
                            </div>
                            <Link href="/dashboard/print">
                                <button className="px-5 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors">
                                    Cotizar Impresión
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Technical Sidebar */}
                <div className="space-y-6">
                    {/* Crew Block */}
                    <div className="bg-[#0E0E18] border border-white/10 rounded-3xl p-6">
                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Production Crew</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                    {(user?.user_metadata?.full_name || 'DZ').substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">{user?.user_metadata?.full_name || 'DIIC Photographer'}</div>
                                    <div className="text-[10px] text-pink-400 uppercase font-bold">Production Hub</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 text-xs font-bold">AM</div>
                                <div>
                                    <div className="text-sm font-bold text-white">Ana M.</div>
                                    <div className="text-[10px] text-gray-500 uppercase font-bold">DigiTech</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tech Specs Block */}
                    <div className="bg-[#0E0E18] border border-white/10 rounded-3xl p-6">
                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Tech Specs</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <Camera className="w-4 h-4 text-gray-600" />
                                <span className="text-xs text-gray-300">Phase One XF IQ4</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Aperture className="w-4 h-4 text-gray-600" />
                                <span className="text-xs text-gray-300">Schneider 80mm LS</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <HardDrive className="w-4 h-4 text-gray-600" />
                                <span className="text-xs text-gray-300">16-bit RAW (IIQ)</span>
                            </li>
                        </ul>
                    </div>

                    {/* Share Block */}
                    <button className="w-full py-4 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest border border-white/5">
                        <Share2 className="w-4 h-4" /> Share Project
                    </button>
                </div>

            </div>
        </div>
    );
}
