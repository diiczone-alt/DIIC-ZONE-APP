'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, LayoutGrid, List } from 'lucide-react';
import { DEPARTMENTS } from '../../../data/departments';
import { motion } from 'framer-motion';

export default function StudioPage() {
    const [viewMode, setViewMode] = useState('grid');
    const [activeFilter, setActiveFilter] = useState('all');

    const enhancedDepartments = DEPARTMENTS.map(d => ({
        ...d,
        type: d.id.includes('film') || d.id === 'editing' || d.id === 'audition' ? 'video' :
            d.id.includes('design') || d.id === 'photo' || d.id === 'print' ? 'design' :
                d.id.includes('web') || d.id === 'automation' || d.id === 'files' ? 'tech' : 'other'
    }));

    const filteredDepartments = activeFilter === 'all'
        ? enhancedDepartments
        : enhancedDepartments.filter(d => d.type === activeFilter);

    // Filter Controls
    const filters = [
        { id: 'all', label: 'Todo' },
        { id: 'video', label: 'Audiovisual' },
        { id: 'design', label: 'Diseño' },
        { id: 'tech', label: 'Tech & Web' }
    ];

    return (
        <div className="min-h-screen bg-[#050511] relative pb-20">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(50, 50, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(50, 50, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
                }}
            />

            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] pointer-events-none" />

            <div className="relative z-10 space-y-6 px-2 md:px-4 pt-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 pb-6 border-b border-white/5">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
                                DIIC ZONE v2.0
                            </span>
                        </div>
                        <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-4" style={{ textShadow: '0 0 40px rgba(6,182,212,0.2)' }}>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
                                ZONA CREATIVA
                            </span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="h-px bg-white/20 w-12" />
                            <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">
                                Central de Producción & Gestión de Medios
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                        {filters.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setActiveFilter(f.id)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all relative overflow-hidden ${activeFilter === f.id
                                    ? 'text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {activeFilter === f.id && (
                                    <motion.div
                                        layoutId="activeFilter"
                                        className="absolute inset-0 bg-white/10 rounded-xl"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{f.label}</span>
                            </button>
                        ))}

                        <div className="w-px bg-white/10 mx-1 self-stretch my-2" />

                        <div className="flex items-center gap-1">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Grid View */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredDepartments.map((dept, idx) => (
                            <motion.div
                                key={dept.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`group relative ${dept.id === 'community' || dept.id === 'ai' ? 'col-span-1 md:col-span-2' : ''}`}
                            >
                                {dept.disabled ? (
                                    <div className="h-full p-6 rounded-3xl bg-[#0A0A12] border border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-60 min-h-[180px]">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 grayscale opacity-50">
                                            <dept.icon className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-500 mb-1">{dept.title}</h3>
                                        <span className="px-2 py-0.5 bg-white/5 rounded-full text-[9px] font-bold uppercase tracking-widest text-gray-600">Próximamente</span>
                                    </div>
                                ) : (
                                    <Link href={dept.href} className="block h-full">
                                        <div className={`relative h-full bg-[#0E0E18] border border-white/5 rounded-3xl p-6 overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl hover:border-${dept.color.split('-')[1]}-500/30 min-h-[220px] flex flex-col`}>

                                            {/* Top Tech Decoration */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className={`absolute top-0 right-0 p-24 bg-${dept.color.split('-')[1]}-500/5 rounded-full blur-3xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-duration-500`} />

                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className={`w-12 h-12 rounded-2xl ${dept.bg} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                                                        <dept.icon className={`w-6 h-6 ${dept.color}`} />
                                                    </div>

                                                    {dept.badge && (
                                                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest border ${dept.border} ${dept.color} ${dept.bg} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                                                            {dept.badge}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                                        {dept.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-400 leading-relaxed font-light opacity-80 group-hover:opacity-100 transition-opacity">
                                                        {dept.description}
                                                    </p>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${dept.bg.replace('10', '50')}`} />
                                                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Activo</span>
                                                    </div>
                                                    <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors ${dept.color}`}>
                                                        <ArrowRight className="w-4 h-4 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hover Glow Border */}
                                            <div className={`absolute inset-0 rounded-3xl border-2 border-${dept.color.split('-')[1]}-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                                        </div>
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                    <div className="space-y-3">
                        {filteredDepartments.map((dept, idx) => (
                            <motion.div
                                key={dept.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                            >
                                <Link href={dept.href} className={`block group ${dept.disabled ? 'pointer-events-none opacity-50' : ''}`}>
                                    <div className="bg-[#0E0E18] border border-white/5 rounded-xl p-4 flex items-center gap-6 hover:bg-white/5 transition-colors relative overflow-hidden">
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${dept.bg.replace('10', '50')} opacity-0 group-hover:opacity-100 transition-opacity`} />

                                        <div className={`w-12 h-12 rounded-lg ${dept.bg} flex items-center justify-center border border-white/5`}>
                                            <dept.icon className={`w-6 h-6 ${dept.color}`} />
                                        </div>

                                        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                            <div className="md:col-span-4">
                                                <h3 className="text-base font-bold text-white tracking-wide">{dept.title}</h3>
                                            </div>
                                            <div className="md:col-span-6 hidden md:block">
                                                <p className="text-sm text-gray-400 truncate font-light">{dept.description}</p>
                                            </div>
                                            <div className="md:col-span-2 flex justify-end">
                                                {dept.badge && (
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${dept.border} ${dept.color} ${dept.bg} rounded`}>
                                                        {dept.badge}
                                                    </span>
                                                )}
                                                {!dept.badge && <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white" />}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
