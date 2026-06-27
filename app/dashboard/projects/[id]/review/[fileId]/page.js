'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VideoReviewPlayer from '@/components/editing/VideoReviewPlayer';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ReviewPage({ params }) {
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;

                if (data) {
                    setProject(data);
                    setComments(Array.isArray(data.comments) ? data.comments : []);
                }
            } catch (err) {
                console.error("Error loading project for review:", err);
                toast.error("Error al cargar el proyecto");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [params.id]);

    const handleAddComment = async (newComment) => {
        const updated = [...comments, newComment].sort((a, b) => a.timestamp - b.timestamp);
        setComments(updated);

        try {
            await supabase
                .from('projects')
                .update({ comments: updated })
                .eq('id', params.id);
        } catch (err) {
            console.error("Error saving comment to DB:", err);
        }
    };

    const handleApprove = async () => {
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('projects')
                .update({
                    current_stage: 4,
                    stage_name: 'Entrega',
                    stage_status: 'Aprobado'
                })
                .eq('id', params.id);

            if (error) throw error;

            toast.success("¡Contenido Aprobado con Éxito! El equipo ha sido notificado.");
            router.push(`/dashboard/projects/${params.id}`);
        } catch (err) {
            console.error("Error approving project:", err);
            toast.error("Error al aprobar el contenido");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRequestChanges = async () => {
        setSubmitting(true);
        try {
            // Update project status
            const { error } = await supabase
                .from('projects')
                .update({
                    stage_status: 'Requiere Cambios'
                })
                .eq('id', params.id);

            if (error) throw error;

            // Increment the error/corrections counter of the editor
            const { data: teamMembers } = await supabase
                .from('team')
                .select('id, name, role, reputation')
                .ilike('role', '%editor%');

            if (teamMembers && teamMembers.length > 0) {
                const editor = teamMembers[0];
                const rep = editor.reputation || { quality: 95, timing: 95, communication: 95, organization: 95, errors: 0, clients_happy: 95 };
                rep.errors = (Number(rep.errors) || 0) + 1;
                rep.quality = Math.max(50, (Number(rep.quality) || 95) - 5); // reduce quality score slightly on revisions

                await supabase
                    .from('team')
                    .update({ reputation: rep })
                    .eq('id', editor.id);
            }

            toast.warning("Cambios solicitados. El editor ha sido notificado y su puntuación de correcciones se ha actualizado.");
            router.push(`/dashboard/projects/${params.id}`);
        } catch (err) {
            console.error("Error requesting changes:", err);
            toast.error("Error al solicitar cambios");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050510] flex items-center justify-center font-black text-indigo-500 uppercase tracking-widest animate-pulse">
                Cargando Entorno de Revisión...
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-white/10 bg-[#050510] flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/projects/${params.id}`} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-white font-semibold">{project?.title || 'Reel_Teaser_V1.mp4'}</h1>
                        <p className="text-xs text-gray-500">Código: {project?.code} • Estado: {project?.stage_status}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleRequestChanges}
                        disabled={submitting}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 border border-white/10 disabled:opacity-50 transition-colors"
                    >
                        Solicitar Cambios
                    </button>
                    <button 
                        onClick={handleApprove}
                        disabled={submitting}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-black hover:bg-green-400 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Aprobar Video
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden bg-black/90 p-6">
                <VideoReviewPlayer
                    src={project?.video_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                    comments={comments}
                    onAddComment={handleAddComment}
                />
            </div>
        </div>
    );
}
