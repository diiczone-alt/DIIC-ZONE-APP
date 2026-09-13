'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, Shield, Sparkles, CheckCircle2, 
    Flame, Zap, Target, ArrowRight, Award, 
    Clock, HelpCircle, FileText, ChevronRight,
    TrendingUp, AlertCircle, Heart, Star, Check,
    Wheat, Stethoscope, UtensilsCrossed, Building2,
    Shirt, Briefcase, Dumbbell, PlayCircle, Trophy
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { agencyService } from '@/services/agencyService';

const NICHES = [
    {
        id: 'agro',
        name: 'Agropecuario & Ganadería',
        icon: Wheat,
        badge: 'Campo & Producción',
        color: 'from-amber-600 to-emerald-700',
        borderColor: 'border-amber-500/30',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        objective: 'Construir confianza directa con el productor, ganadero o agricultor mediante demostración tangible en terreno.',
        hooks: [
            '🌾 "El error que te está haciendo perder hasta un 30% en tu cosecha de [cultivo]..."',
            '🐂 "¿Sabías que con este suplemento tu ganado puede ganar [X] kg más por semana?"',
            '🚜 "Mira cómo trabaja esta máquina en terreno difícil en menos de 10 minutos."'
        ],
        formats: [
            'Demostraciones en finca / terreno real (sin artificios, calidad visual nítida).',
            'Recomendaciones técnicas explicadas de forma práctica y sin rodeos.',
            'Comparativas de rendimiento (Antes vs. Después de aplicar el producto/servicio).'
        ],
        goldenRules: [
            'Usa terminología del campo precisa (hectáreas, quintales, pastoreo, engorde), nunca inventes.',
            'La credibilidad se gana mostrando resultados en video real, no solo fotos de stock.',
            'Horario clave de publicación: Temprano en la mañana (05:30 - 07:30) y noche (19:00 - 21:00).'
        ]
    },
    {
        id: 'salud',
        name: 'Salud, Clínicas & Médicos',
        icon: Stethoscope,
        badge: 'Medicina & Bienestar',
        color: 'from-cyan-600 to-blue-700',
        borderColor: 'border-cyan-500/30',
        textColor: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        objective: 'Generar autoridad científica humanizada y derribar el miedo del paciente para incentivar la consulta.',
        hooks: [
            '🩺 "Si sientes este síntoma al despertar, esto es lo que tu cuerpo intenta decirte..."',
            '🦷 "3 mitos sobre el [tratamiento] que casi todos creen (el 2do es peligroso)."',
            '✨ "Caso real: Así transformamos la sonrisa y la confianza de [Paciente] en solo 3 citas."'
        ],
        formats: [
            'El especialista hablando a cámara en lenguaje sencillo y empático.',
            'Videos de proceso de tratamiento mostrando tecnología y esterilización impecable.',
            'Testimoniales emotivos de pacientes agradecidos con consentimiento firmado.'
        ],
        goldenRules: [
            'Cumplimiento ético estricto: Nunca prometas curas milagrosas ni uses imágenes sangrientas explícitas.',
            'Humaniza al doctor (muestra su vocación, calidez humana y credenciales académicas).',
            'El Call To Action (CTA) debe ser siempre privado y seguro: "Agenda tu valoración médica al WhatsApp".'
        ]
    },
    {
        id: 'gastro',
        name: 'Gastronomía & Restaurantes',
        icon: UtensilsCrossed,
        badge: 'Food & Experiencia',
        color: 'from-orange-600 to-rose-700',
        borderColor: 'border-orange-500/30',
        textColor: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        objective: 'Provocar deseo visceral inmediato (antojo/Food Porn) y detonar reservas y pedidos de fin de semana.',
        hooks: [
            '🍔 "Si tu acompañante no te lleva a comer esto hoy, te debe una salida..."',
            '🔥 "El secreto detrás de nuestra salsa más adictiva (solo para amantes del buen comer)."',
            '🍕 "El crujido perfecto existe y lo tenemos preparado para ti esta noche."'
        ],
        formats: [
            'Reels ultra sensoriales (Food Porn con sonido ASMR: crujido, queso derretido, vapor caliente).',
            'Promociones relámpago para días flojos (Martes de 2x1, Jueves de amigos).',
            'Stories interactivas a la hora del almuerzo (11:30 - 13:30) y cena (18:30 - 20:30).'
        ],
        goldenRules: [
            'La iluminación y el color de la comida deben verse frescos y vibrantes, jamás apagados.',
            'El menú y la ubicación deben estar a solo 1 clic en la biografía y en historias destacadas.',
            'Responde los DMs de reservas y precios en menos de 5 minutos: un cliente con hambre no espera.'
        ]
    },
    {
        id: 'inmo',
        name: 'Inmobiliaria & Bienes Raíces',
        icon: Building2,
        badge: 'Inversión & Hogar',
        color: 'from-emerald-600 to-teal-700',
        borderColor: 'border-emerald-500/30',
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        objective: 'Proyectar estatus, seguridad patrimonial y plusvalía para captar compradores e inversionistas serios.',
        hooks: [
            '🏡 "¿Vivirías en una casa con esta terraza por menos de $[X] al mes?"',
            '📈 "Por qué comprar en [Sector/Ciudad] hoy es la inversión más inteligente de este año."',
            '🔑 "Tour completo: Mira cómo es por dentro esta propiedad lista para habitar."'
        ],
        formats: [
            'Video Tours fluidos (Home Tours guiados mostrando detalles arquitectónicos clave).',
            'Carruseles con planos, desglose de financiamiento y cuadro de cuotas mensuales.',
            'Videos de estilo de vida: parques cercanos, seguridad, áreas comunales y vistas.'
        ],
        goldenRules: [
            'Siempre incluye precio referencial, cuota estimada o rango de inversión; la transparencia atrae leads calificados.',
            'Muestra la ubicación exacta y las ventajas de plusvalía del sector.',
            'Objetivo directo: Agendar visita presencial o llamada privada con el asesor.'
        ]
    },
    {
        id: 'moda',
        name: 'Moda, Retail & Estética',
        icon: Shirt,
        badge: 'Tendencia & Estilo',
        color: 'from-pink-600 to-purple-700',
        borderColor: 'border-pink-500/30',
        textColor: 'text-pink-400',
        bgColor: 'bg-pink-500/10',
        objective: 'Crear deseo por aspiración e impulso, aprovechando tendencias virales de estilo y escasez de stock.',
        hooks: [
            '✨ "3 formas de combinar esta prenda para lucir elegante con poco presupuesto."',
            '👗 "Llegaron pocas unidades de la colección más esperada de la temporada..."',
            '💄 "El cambio que no sabías que necesitabas para este fin de semana."'
        ],
        formats: [
            'Transiciones dinámicas y rítmicas mostrando outfits completos (OOTD).',
            'Carruseles de lookbook con combinaciones de ropa y accesorios.',
            'Urgencia en Stories: "Últimas 5 tallas disponibles, pide al WhatsApp aquí".'
        ],
        goldenRules: [
            'Enlace directo a WhatsApp o tienda online con catálogo actualizado.',
            'Etiqueta clara de precios y tallas para evitar fricción en la compra.',
            'Usa audios en tendencia con buen ritmo y edición limpia.'
        ]
    },
    {
        id: 'b2b',
        name: 'Servicios B2B, Legal & Marca Personal',
        icon: Briefcase,
        badge: 'Autoridad & Negocios',
        color: 'from-indigo-600 to-blue-800',
        borderColor: 'border-indigo-500/30',
        textColor: 'text-indigo-400',
        bgColor: 'bg-indigo-500/10',
        objective: 'Posicionar al cliente como líder de opinión y referente indiscutible en su sector.',
        hooks: [
            '📊 "El marco de trabajo exacto que usamos para escalar negocios de 0 a 6 cifras."',
            '⚖️ "Si eres dueño de empresa, asegúrate de no estar cometiendo este error legal."',
            '💡 "Cómo resolvimos [Problema Complejo] para nuestro cliente en tiempo récord."'
        ],
        formats: [
            'Carruseles educativos de alto valor guardable y compartible.',
            'Clips cortos de podcast, conferencias o asesorías 1 a 1.',
            'Casos de estudio antes vs. después con cifras reales y aprendizajes.'
        ],
        goldenRules: [
            'El contenido debe entregar valor real, no generalidades que se encuentran en Google.',
            'Diseño sobrio, elegante y con tipografías legibles.',
            'CTA enfocado a agendar diagnóstico estratégico o llamada de consultoría.'
        ]
    },
    {
        id: 'fitness',
        name: 'Fitness, Gimnasios & Bienestar',
        icon: Dumbbell,
        badge: 'Energía & Rendimiento',
        color: 'from-rose-600 to-red-700',
        borderColor: 'border-rose-500/30',
        textColor: 'text-rose-400',
        bgColor: 'bg-rose-500/10',
        objective: 'Motivar a la acción, enseñar técnica correcta y construir una comunidad apasionada.',
        hooks: [
            '🔥 "Deja de hacer este ejercicio así si no quieres lesionarte la espalda..."',
            '💪 "Rutina exprés de 20 minutos para quemar grasa cuando no tienes tiempo."',
            '⚡ "Caso de transformación: 90 días de constancia que cambiaron la vida de [Nombre]."'
        ],
        formats: [
            'Tutoriales de técnica con correcciones visuales (Bien vs. Mal).',
            'Retos mensuales y tablas de progreso de los miembros de la comunidad.',
            'Venta de membresías con beneficios por inscripción temprana.'
        ],
        goldenRules: [
            'Ambiente motivador, música con energía y tomas de entrenamiento real.',
            'Enfatiza la disciplina y los hábitos sostenibles sobre las dietas extremas.',
            'CTA claro: "Comenta RETO para recibir tu plan de inicio gratuito".'
        ]
    }
];

const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: '¿Cuál es la regla de oro de la "Golden Hour" para un Community Manager en DIIC ZONE?',
        options: [
            'Programar los posts y olvidarse de las redes hasta el día siguiente.',
            'Interactuar activamente en los primeros 30 minutos tras publicar para potenciar el algoritmo y responder DMs.',
            'Publicar únicamente a las 12 del mediodía sin importar el nicho.',
            'Subir 10 historias seguidas sin texto ni llamados a la acción.'
        ],
        correct: 1
    },
    {
        id: 2,
        question: 'Si gestionas una marca del nicho AGROPECUARIO, ¿qué elemento es fundamental para generar credibilidad?',
        options: [
            'Usar animaciones 3D futuristas y música electrónica pesada.',
            'Usar lenguaje técnico preciso del campo y demostrar resultados reales en finca/terreno.',
            'Publicar únicamente fotos de stock bajadas de internet.',
            'Evitar mostrar al personal del campo o los animales.'
        ],
        correct: 1
    },
    {
        id: 3,
        question: '¿Cuál es la fórmula estándar de un Reel de Alto Retorno en la metodología DIIC ZONE?',
        options: [
            'Logo de la empresa 5s + Música de fondo sin voz + Texto largo.',
            'Hook de impacto (0-3s) + Retención / Storytelling + Solución o Valor + CTA claro.',
            'Video grabado en horizontal de 3 minutos de duración sin subtítulos.',
            'Múltiples fotos pasando rápido sin mensaje definido.'
        ],
        correct: 1
    },
    {
        id: 4,
        question: 'En el nicho de SALUD y MÉDICOS, ¿cuál es la mejor práctica ética y de conversión?',
        options: [
            'Prometer curas milagrosas en 24 horas y mostrar sangre explícita.',
            'Humanizar al especialista, educar en lenguaje sencillo y dirigir a una valoración médica privada.',
            'Publicar solo frases motivacionales sin hablar de medicina.',
            'Dar diagnósticos públicos en los comentarios abiertos de Instagram.'
        ],
        correct: 1
    },
    {
        id: 5,
        question: '¿Cuál es el rol principal del Community Manager en DIIC ZONE?',
        options: [
            'Ser un posteador pasivo de imágenes.',
            'Diseñar todos los artes en Photoshop y editar todos los videos manualmente.',
            'Ser el estratega que coordina, revisa la calidad, domina el nicho de la marca y garantiza el crecimiento.',
            'Únicamente responder "precio al inbox".'
        ],
        correct: 2
    }
];

export default function CMGuidePlaybook({ user, onCompleteCertification }) {
    const [activeSection, setActiveSection] = useState('philosophy'); // philosophy | weekly | niches | formula | quiz
    const [selectedNiche, setSelectedNiche] = useState(NICHES[0]);
    
    // Quiz State
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(user?.onboarding_quiz_score || 0);
    const [submittingQuiz, setSubmittingQuiz] = useState(false);

    const handleSelectAnswer = (qId, optionIdx) => {
        if (quizSubmitted) return;
        setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    };

    const handleSubmitQuiz = async () => {
        const answeredCount = Object.keys(quizAnswers).length;
        if (answeredCount < QUIZ_QUESTIONS.length) {
            toast.warning("Responde todas las preguntas", {
                description: `Has respondido ${answeredCount} de ${QUIZ_QUESTIONS.length} preguntas.`
            });
            return;
        }

        let correctCount = 0;
        QUIZ_QUESTIONS.forEach(q => {
            if (quizAnswers[q.id] === q.correct) {
                correctCount++;
            }
        });

        const scorePercent = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
        setQuizScore(scorePercent);
        setQuizSubmitted(true);
        setSubmittingQuiz(true);

        try {
            // Update in DB
            if (user?.id) {
                await supabase.from('profiles').update({
                    onboarding_quiz_score: scorePercent
                }).eq('id', user.id);
            }

            if (user?.email) {
                const { data: teamMember } = await supabase.from('team').select('id').eq('email', user.email).single();
                if (teamMember?.id) {
                    await agencyService.updateTeamMember(teamMember.id, {
                        onboarding_quiz_score: scorePercent
                    });
                }
            }

            if (scorePercent >= 80) {
                toast.success("¡Certificación Aprobada con Éxito! 🏆", {
                    description: `Puntaje obtenido: ${scorePercent}%. El Director en HQ ha recibido tu certificación.`
                });
                if (onCompleteCertification) onCompleteCertification(scorePercent);
            } else {
                toast.error("Certificación no superada", {
                    description: `Puntaje: ${scorePercent}%. Repasa la guía y vuelve a intentarlo para obtener mínimo 80%.`
                });
            }
        } catch (err) {
            console.error("Error saving quiz score:", err);
        } finally {
            setSubmittingQuiz(false);
        }
    };

    const handleRetryQuiz = () => {
        setQuizAnswers({});
        setQuizSubmitted(false);
    };

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20">
            {/* Header Banner */}
            <div className="relative rounded-[3rem] bg-gradient-to-r from-[#09091A] via-[#0E0E2A] to-[#0A0A1F] border border-cyan-500/20 p-8 md:p-12 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-cyan-400" /> DIIC ZONE PLAYBOOK 2026
                            </span>
                            {quizScore >= 80 && (
                                <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <Trophy className="w-3 h-3 text-emerald-400" /> Certificado {quizScore}%
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                            Guía Maestra & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Playbooks por Nicho</span>
                        </h1>
                        <p className="text-gray-400 text-sm max-w-2xl font-medium leading-relaxed">
                            Aprende la metodología de alto rendimiento de DIIC ZONE, descubre cómo adaptar la estrategia a cada industria y certifícate para gestionar tus marcas con maestría.
                        </p>
                    </div>

                    <button 
                        onClick={() => setActiveSection('quiz')}
                        className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl flex items-center gap-3 shrink-0 ${
                            quizScore >= 80 
                                ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white' 
                                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:opacity-90 active:scale-95'
                        }`}
                    >
                        <Award className="w-4 h-4" />
                        {quizScore >= 80 ? 'Ver Certificación' : 'Iniciar Micro-Test'}
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-[#090915] border border-white/5 rounded-2xl">
                {[
                    { id: 'philosophy', label: '1. Filosofía & Rol del CM', icon: Shield },
                    { id: 'weekly', label: '2. Ciclo Semanal', icon: Clock },
                    { id: 'niches', label: '3. Playbooks por Nicho', icon: Wheat },
                    { id: 'formula', label: '4. Fórmula de Contenido', icon: Zap },
                    { id: 'quiz', label: '5. Certificación DIIC ZONE', icon: Award }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id)}
                        className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                            activeSection === tab.id
                                ? 'bg-white text-black shadow-lg shadow-white/10 scale-[1.02]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* CONTENT SECTIONS */}
            <AnimatePresence mode="wait">
                {/* SECTION 1: PHILOSOPHY */}
                {activeSection === 'philosophy' && (
                    <motion.div
                        key="philosophy"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-8 rounded-[2.5rem] bg-[#0E0E1C] border border-white/5 space-y-4 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                    <Target className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase italic">Estratega, no Posteador</h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                    Tu labor no es subir imágenes por cumplir un calendario. Eres el cerebro que analiza qué duele al cliente, qué busca su audiencia y cómo generar ventas y reconocimiento real.
                                </p>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-[#0E0E1C] border border-white/5 space-y-4 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <Zap className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase italic">Coordinador de Escuadrón</h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                    El estratega da la directriz clara a los editores, diseñadores y filmmakers. Tú no tienes que diseñar en Photoshop, pero debes saber exigir calidad de 10 sobre 10.
                                </p>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-[#0E0E1C] border border-white/5 space-y-4 relative overflow-hidden group hover:border-pink-500/30 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                                    <Flame className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase italic">Obsesión por la Retención</h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                    Los primeros 3 segundos de cualquier video definen el éxito. Si el gancho es aburrido, el mejor producto del mundo no se venderá. El hook lo es todo.
                                </p>
                            </div>
                        </div>

                        {/* Las 3 Reglas de Oro */}
                        <div className="p-10 rounded-[3rem] bg-gradient-to-b from-[#0F0F24] to-[#070712] border border-white/10 space-y-6">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                                <Shield className="w-6 h-6 text-amber-400" /> Las 3 Reglas de Oro Inquebrantables
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                                    <span className="text-amber-400 font-black text-xs font-mono">REGLA 01</span>
                                    <h4 className="text-white font-bold text-base">Revisión de Calidad Antes de Publicar</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Ortografía impecable, audio nivelado y portadas alineadas. Cero publicaciones con errores tipográficos.</p>
                                </div>
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                                    <span className="text-cyan-400 font-black text-xs font-mono">REGLA 02</span>
                                    <h4 className="text-white font-bold text-base">Protocolo Golden Hour</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Los primeros 30 minutos tras publicar son cruciales. Responde comentarios, sube la historia y activa la interacción inicial.</p>
                                </div>
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                                    <span className="text-pink-400 font-black text-xs font-mono">REGLA 03</span>
                                    <h4 className="text-white font-bold text-base">Adaptación al Nicho</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">No le hables a un productor agrícola como a un comprador de ropa. Adopta el tono, vocabulario y dolor de cada industria.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* SECTION 2: WEEKLY CYCLE */}
                {activeSection === 'weekly' && (
                    <motion.div
                        key="weekly"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        <div className="p-8 rounded-[3rem] bg-[#0A0A18] border border-white/5 space-y-8">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">El Ciclo Semanal de Maestría Operativa</h2>
                                <p className="text-gray-400 text-sm mt-1">Cómo se organiza un estratega de DIIC ZONE para tener cero estrés y máxima efectividad:</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { day: 'Lunes', task: 'Análisis, Tendencias & Pizarra Estratégica', desc: 'Revisión de métricas de la semana anterior. Investigación de audios y formatos en tendencia para cada cliente.', color: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-400' },
                                    { day: 'Martes', task: 'Redacción de Guiones & Copys Persuasivos', desc: 'Creación de los ganchos (hooks) y briefs detallados para el equipo creativo (Filmmakers y Editores).', color: 'border-indigo-500/40 bg-indigo-500/5 text-indigo-400' },
                                    { day: 'Miércoles', task: 'Producción & Supervisión Creativa', desc: 'Seguimiento con los editores y diseñadores. Verificación de avances en el Kanban de Contenidos.', color: 'border-purple-500/40 bg-purple-500/5 text-purple-400' },
                                    { day: 'Jueves', task: 'Control de Calidad & Aprobaciones', desc: 'Revisión final de piezas terminadas. Envío de parrilla al cliente o aprobación en plataforma.', color: 'border-pink-500/40 bg-pink-500/5 text-pink-400' },
                                    { day: 'Viernes', task: 'Programación Integral & Meta Ads', desc: 'Programación de todas las publicaciones en Meta Business Suite / TikTok. Ajuste de campañas si aplica.', color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400' },
                                    { day: 'Sábado - Domingo', task: 'Monitoreo de Golden Hour & Leads', desc: 'Revisión de mensajes directos (DMs), comentarios clave y escalamiento de prospectos calificados a ventas.', color: 'border-amber-500/40 bg-amber-500/5 text-amber-400' }
                                ].map((step, idx) => (
                                    <div key={idx} className={`p-6 rounded-2xl border ${step.color} flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
                                        <div className="flex items-center gap-4">
                                            <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono font-black text-sm text-white">0{idx+1}</span>
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-widest font-mono opacity-75">{step.day}</span>
                                                <h4 className="text-white font-bold text-base">{step.task}</h4>
                                                <p className="text-gray-400 text-xs mt-0.5">{step.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* SECTION 3: NICHES PLAYBOOKS */}
                {activeSection === 'niches' && (
                    <motion.div
                        key="niches"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-8"
                    >
                        {/* Niche Selector Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                            {NICHES.map(niche => {
                                const isSelected = selectedNiche.id === niche.id;
                                const Icon = niche.icon;
                                return (
                                    <button
                                        key={niche.id}
                                        onClick={() => setSelectedNiche(niche)}
                                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                                            isSelected 
                                                ? `bg-gradient-to-b ${niche.color} text-white border-white/30 shadow-xl scale-105` 
                                                : 'bg-[#0E0E1A] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                                        }`}
                                    >
                                        <Icon className="w-6 h-6" />
                                        <span className="text-[11px] font-bold text-center leading-tight">{niche.name.split(' ')[0]}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Selected Niche Deep Dive Card */}
                        <div className={`p-8 md:p-12 rounded-[3rem] bg-[#0A0A18] border ${selectedNiche.borderColor} space-y-10 shadow-2xl relative overflow-hidden`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                                <div className="flex items-center gap-5">
                                    <div className={`p-5 rounded-3xl bg-gradient-to-br ${selectedNiche.color} text-white shadow-xl`}>
                                        <selectedNiche.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${selectedNiche.textColor}`}>{selectedNiche.badge}</span>
                                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">{selectedNiche.name}</h2>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 max-w-md">
                                    <p className="text-xs text-gray-300 italic font-medium">"{selectedNiche.objective}"</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Ganchos */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                                        <Flame className="w-4 h-4" /> Ganchos de Alto Impacto (Hooks)
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedNiche.hooks.map((h, i) => (
                                            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-gray-300 font-medium leading-relaxed">
                                                {h}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Formatos Clave */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                        <PlayCircle className="w-4 h-4" /> Formatos Recomendados
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedNiche.formats.map((f, i) => (
                                            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-gray-300 font-medium leading-relaxed flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Reglas del Nicho */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
                                        <Shield className="w-4 h-4" /> Reglas de Ejecución
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedNiche.goldenRules.map((r, i) => (
                                            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-gray-300 font-medium leading-relaxed flex items-start gap-2">
                                                <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                                <span>{r}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* SECTION 4: FORMULA */}
                {activeSection === 'formula' && (
                    <motion.div
                        key="formula"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-8"
                    >
                        <div className="p-10 rounded-[3rem] bg-[#0A0A18] border border-white/5 space-y-8">
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">Estructura del Reel de Alto Rendimiento</h2>
                                <p className="text-gray-400 text-sm mt-1">La anatomía científica para pasar de 500 vistas a más de 50,000 con retención y ventas:</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="p-6 rounded-3xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 font-mono">00:00 - 00:03</span>
                                    <h4 className="text-lg font-black text-white uppercase italic">1. Hook Visual & Verbal</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Rompe el scroll del usuario. Genera curiosidad, cuestiona una creencia o muestra un resultado chocante.</p>
                                </div>

                                <div className="p-6 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 font-mono">00:03 - 00:15</span>
                                    <h4 className="text-lg font-black text-white uppercase italic">2. Dolor & Contexto</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Explica por qué esto le importa al espectador. Haz que sienta: "Esto me está pasando a mí".</p>
                                </div>

                                <div className="p-6 rounded-3xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 font-mono">00:15 - 00:40</span>
                                    <h4 className="text-lg font-black text-white uppercase italic">3. Solución / Valor</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Entrega el consejo práctico, la demostración del producto o la transformación real.</p>
                                </div>

                                <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono">00:40 - 00:50</span>
                                    <h4 className="text-lg font-black text-white uppercase italic">4. Call To Action (CTA)</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">Un solo llamado a la acción claro: "Comenta INFO", "Escríbenos al WhatsApp" o "Guarda este video".</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* SECTION 5: QUIZ */}
                {activeSection === 'quiz' && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-8"
                    >
                        <div className="p-8 md:p-12 rounded-[3rem] bg-[#0A0A18] border border-white/10 space-y-8 shadow-2xl">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                                        <Award className="w-8 h-8 text-cyan-400" /> Micro-Test de Certificación DIIC ZONE
                                    </h2>
                                    <p className="text-gray-400 text-sm mt-1">Responde las 5 preguntas clave para obtener tu acreditación de Estratega Oficial y habilitar la asignación de marcas en HQ.</p>
                                </div>
                                {quizSubmitted && (
                                    <div className={`px-6 py-3 rounded-2xl border text-center ${quizScore >= 80 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                                        <span className="text-[10px] font-black uppercase tracking-widest block">Calificación Final</span>
                                        <span className="text-2xl font-black">{quizScore}%</span>
                                    </div>
                                )}
                            </div>

                            {/* Questions */}
                            <div className="space-y-8">
                                {QUIZ_QUESTIONS.map((q, qIndex) => {
                                    const selectedAnswer = quizAnswers[q.id];
                                    return (
                                        <div key={q.id} className="p-6 md:p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">0{qIndex+1}</span>
                                                <h3 className="text-white font-bold text-base md:text-lg">{q.question}</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                                {q.options.map((opt, optIndex) => {
                                                    const isSelected = selectedAnswer === optIndex;
                                                    const isCorrect = q.correct === optIndex;
                                                    
                                                    let btnStyle = 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/5';
                                                    if (isSelected && !quizSubmitted) {
                                                        btnStyle = 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/20';
                                                    } else if (quizSubmitted) {
                                                        if (isCorrect) {
                                                            btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                                                        } else if (isSelected && !isCorrect) {
                                                            btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                                                        }
                                                    }

                                                    return (
                                                        <button
                                                            key={optIndex}
                                                            onClick={() => handleSelectAnswer(q.id, optIndex)}
                                                            disabled={quizSubmitted}
                                                            className={`p-4 rounded-2xl border text-left text-xs leading-relaxed transition-all flex items-start gap-3 ${btnStyle}`}
                                                        >
                                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-cyan-400 bg-cyan-400 text-black' : 'border-white/20'}`}>
                                                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                                            </div>
                                                            <span>{opt}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Quiz Actions */}
                            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <span className="text-xs text-gray-500 font-medium">
                                    Mínimo para aprobar: <strong className="text-white">80% (4 de 5 correctas)</strong>
                                </span>

                                {!quizSubmitted ? (
                                    <button
                                        onClick={handleSubmitQuiz}
                                        disabled={submittingQuiz}
                                        className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-black uppercase text-xs tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {submittingQuiz ? 'Evaluando...' : 'Enviar y Calificar'}
                                    </button>
                                ) : (
                                    <div className="flex gap-4">
                                        {quizScore < 80 && (
                                            <button
                                                onClick={handleRetryQuiz}
                                                className="px-8 py-4 rounded-2xl bg-white/10 text-white font-black uppercase text-xs tracking-widest hover:bg-white/20 transition-all"
                                            >
                                                Reintentar Test
                                            </button>
                                        )}
                                        {quizScore >= 80 && (
                                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                                                <Trophy className="w-4 h-4" /> Certificación registrada en HQ
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
