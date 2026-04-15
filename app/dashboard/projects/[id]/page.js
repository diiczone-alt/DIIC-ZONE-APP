'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Check, Scissors, Send, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabase';
import GlassCard from '../../../../components/ui/GlassCard';

export default function ProjectProcessPage({ params }) {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');

    useEffect(() => {
        // Fetch project details
        // For preview, we might use mock data if DB is empty
        async function fetchProject() {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (data) {
                    setProject(data);
                } else {
                    // Fallback Mock
                    setProject({
                        id: params.id,
                        title: 'Reel: Lanzamiento V2',
                        code: 'PROY-2026-001',
                        current_stage: 3, // 1: Guion, 2: Rodaje, 3: Edicion, 4: Entrega
                        stage_name: 'Edición',
                        stage_status: 'En Revisión'
                    });
                }
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }
        fetchProject();
    }, [params.id]);

    const stages = [
        { id: 1, name: 'Guion', icon: Check },
        { id: 2, name: 'Rodaje', icon: Check },
        { id: 3, name: 'Edición', icon: Scissors },
        { id: 4, name: 'Entrega', icon: null } // Number 4
    ];

    if (loading) return <div className="p-8 text-white">Cargando proyecto...</div>;

    return (
        <div className="flex h-screen bg-[#050511] justify-center items-center p-4">
            {/* Main Container matching the Modal design */}
            <div className="bg-[#12121F] border border-white/10 rounded-2xl w-full max-w-3xl p-8 relative shadow-2xl flex flex-col h-[90vh]">

                {/* Header */}
                <div className="mb-8">
                    <Link href="/dashboard" className="absolute top-8 right-8 text-gray-400 hover:text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>

                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-500 text-[10px] font-bold border border-red-500/30">
                            FILMMAKER PRO
                        </span>
                        <p className="text-xs text-gray-500">{project?.code || 'PROY-GEN'}</p>
                    </div>
                    <h3 className="text-3xl font-bold text-white">{project?.title}</h3>
                </div>

                {/* Stepper */}
                <div className="flex justify-between items-center relative mb-10 px-4">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 -z-10"></div>

                    {stages.map((stage) => {
                        const isActive = stage.id === (project?.current_stage || 3);
                        const isCompleted = stage.id < (project?.current_stage || 3);

                        return (
                            <div key={stage.id} className="flex flex-col items-center gap-3 relative">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#12121F] z-10 
                                    ${isActive ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]' :
                                        isCompleted ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' :
                                            'bg-[#1A1A2E] border-white/10'}`}>

                                    {isCompleted || (isActive && stage.id < 3) ? (
                                        <Check className="w-5 h-5 text-black" />
                                    ) : (
                                        stage.icon ? <stage.icon className={`w-5 h-5 ${isActive ? 'text-white animate-pulse' : 'text-gray-500'}`} /> : <span className="text-xs text-gray-500">{stage.id}</span>
                                    )}
                                </div>
                                <p className={`text-xs font-bold ${isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-600'}`}>
                                    {stage.name}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* Stage Detail Content */}
                <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-white flex items-center gap-2">
                            <Scissors className="w-4 h-4 text-blue-400" /> Etapa Actual: {project?.stage_name || 'Edición'}
                        </h4>
                        <span className="text-xs text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                            {project?.stage_status || 'En Revisión'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-6">
                        El editor ha subido la versión 2. Por favor revisa el corte final antes de proceder a colorización.
                    </p>

                    {/* Chat / Feedback Simulation */}
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">ED</div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 mb-1">Editor</p>
                                <div className="bg-black/30 p-3 rounded-xl rounded-tl-none text-sm text-gray-300 border border-white/5">
                                    He ajustado el ritmo de la música como pediste.
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 flex-row-reverse">
                            <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-xs font-bold text-pink-400">TU</div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-400 mb-1">Tú</p>
                                <div className="bg-blue-500/20 p-3 rounded-xl rounded-tr-none text-sm text-white border border-blue-500/30">
                                    ¡Genial! Solo falta el logo al final.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 mt-auto">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Escribe un comentario..."
                            className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-white">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-bold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-lg shadow-green-500/20">
                        <CheckCircle className="w-4 h-4" /> Aprobar Etapa
                    </button>
                </div>
            </div>
        </div>
    );
}
