'use client';

import { Star, Sparkles, Megaphone, Leaf, Calculator, Heart, Calendar, Activity, Zap, Radio, Terminal, Cpu, Play } from 'lucide-react';
import CalendarDrawer from './CalendarDrawer';
import { Store } from '../../../js/store';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function DatesDrawer({ isOpen, onClose, niche = 'health' }) {
    const router = useRouter();

    // Mock Niche Data
    const NICHE_DATA = {
        health: {
            label: 'Salud & Bienestar',
            icon: Heart,
            description: 'Conecta con la mejor versión de tu audiencia.',
            dates: [
                { id: 1, date: '04 Feb', title: 'Día Mundial contra el Cáncer', category: 'Concienciación', type: 'Reel Educativo', suggestion: '5 Mitos comunes y cómo prevenirlos.' },
                { id: 2, date: '14 Feb', title: 'San Valentín (Enfoque Salud)', category: 'Venta', type: 'Promo Check-up', suggestion: 'Regala salud a quien amas: 2x1 en chequeos.' },
                { id: 3, date: '07 Abr', title: 'Día Mundial de la Salud', category: 'Autoridad', type: 'Live Q&A', suggestion: 'Sesión de preguntas y respuestas con especialistas.' },
            ]
        },
        fitness: {
            label: 'Fitness & Energía',
            icon: Zap,
            description: 'Impulsa el movimiento y la transformación.',
            dates: [
                { id: 1, date: '01 Ene', title: 'Inicio de Año', category: 'Venta', type: 'Reel Motivacional', suggestion: 'Empieza tu transformación hoy. Promo inscripción.' },
                { id: 2, date: '21 Jun', title: 'Día del Yoga', category: 'Evento', type: 'Clase Gratis', suggestion: 'Clase abierta al aire libre para atraer leads.' },
            ]
        },
        agro: {
            label: 'Agro & Naturaleza',
            icon: Leaf,
            description: 'Cultiva relaciones con el sector productivo.',
            dates: [
                { id: 1, date: '15 May', title: 'Día del Agricultor', category: 'Homenaje', type: 'Video Emotivo', suggestion: 'Historias de quienes alimentan al mundo.' },
                { id: 2, date: 'Sep', title: 'Inicio de Siembra', category: 'Educación', type: 'Carrousel Tips', suggestion: 'Mejores prácticas para la temporada primavera-verano.' },
            ]
        }
    };

    const currentNiche = NICHE_DATA[niche] || NICHE_DATA.health;

    const handleCreateProject = (dateItem) => {
        const timestamp = Date.now();
        const newProject = {
            id: `proj_date_${timestamp}`,
            title: `${dateItem.title}`,
            client: 'Cliente Demo',
            status: 'Planning',
            dueDate: new Date(timestamp + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            assignee: 'Sin asignar',
            description: `Proyecto inspirado en: ${dateItem.category}\nSugerencia: ${dateItem.suggestion}`,
            videos: []
        };

        Store.addProject(newProject);
        toast.success(`Inspiración activada: ${dateItem.title}`);
        onClose();
        router.push('/dashboard/production');
    };

    return (
        <CalendarDrawer
            isOpen={isOpen}
            onClose={onClose}
            title="Fechas Importantes"
            icon={Sparkles}
            color="text-purple-400"
        >
            <div className="space-y-8 relative">

                {/* HERO CARD: Creative Aurora */}
                <div className="relative overflow-hidden p-8 rounded-[2rem] glass-prism group transition-all duration-700 hover:shadow-[0_20px_40px_rgba(139,92,246,0.15)]">
                    {/* Aurora Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 blur-[100px] rounded-full mix-blend-screen animate-pulse-soft"></div>

                    <div className="relative z-10 text-center">
                        <div className="nline-flex p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <currentNiche.icon className="w-10 h-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight text-glow-soft">
                            {currentNiche.label}
                        </h2>
                        <p className="text-sm text-gray-300 font-medium tracking-wide opacity-80">
                            {currentNiche.description}
                        </p>
                    </div>
                </div>

                <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-4 text-center opacity-60">
                        Oportunidades Destacadas
                    </h3>

                    {currentNiche.dates.map((item, index) => (
                        <div
                            key={item.id}
                            style={{ animationDelay: `${index * 150}ms` }}
                            className="group relative p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                                    {item.category}
                                </span>
                                <span className="text-xs font-bold text-gray-500 group-hover:text-white transition-colors">
                                    {item.date}
                                </span>
                            </div>

                            <h4 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
                                {item.title}
                            </h4>

                            <p className="text-sm text-gray-400 leading-relaxed font-light mb-6 group-hover:text-gray-300 transition-colors">
                                {item.suggestion}
                            </p>

                            <button
                                onClick={() => handleCreateProject(item)}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-900/20 hover:shadow-purple-700/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 backdrop-blur-md"
                            >
                                <Play className="w-4 h-4 fill-white" />
                                Crear Experiencia
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </CalendarDrawer>
    );
}
