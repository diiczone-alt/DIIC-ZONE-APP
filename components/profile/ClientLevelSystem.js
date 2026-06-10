'use client';

import { useState, useEffect } from 'react';
import {
    Star, Target, Zap,
    ArrowUpRight, CheckCircle2,
    Circle, Rocket, Award,
    Trophy, Flag, ShieldCheck,
    Briefcase, Activity, Sparkles,
    ChevronRight, Info, TrendingUp,
    LayoutGrid, Video, Globe, Lock,
    Camera, Palette, Type, CheckCircle,
    Gift, Stethoscope, Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import GrowthAlertSystem from '../connectivity/GrowthAlertSystem';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';

const NICHE_LEVELS = {
    general: [
        {
            id: 1,
            name: "Presencia Digital",
            color: "emerald",
            mainGoal: "Existir profesionalmente",
            indicator: "Identidad creada",
            status: "El cliente apenas comienza.",
            suggestedContent: "Diseño de Marca, Bio Optimizada, 6 Posts Base",
            complexity: "BAJA",
            fullDescription: "En esta fase, el objetivo es garantizar que tu marca 'exista' en el ecosistema digital con una identidad visual coherente.",
            technicalTasks: [
                "Diseño de Identidad Visual (Logo/Colores)",
                "Configuración de Perfiles Sociales",
                "Optimización de Biografías (SEO)",
                "Garantía de Estética: Primer Grid Profesional"
            ],
            coachTip: "Enfoque inicial: Menos es más. Una bio clara vence a 100 posts sin dirección.",
            metas: [
                { id: 'logo', label: "Logo definido", service: "Diseño Base" },
                { id: 'colors', label: "Colores de marca", service: "Diseño Base" },
                { id: 'bio', label: "Bio profesional", service: "Configuración Redes" },
                { id: 'photo', label: "Foto profesional", service: "Fotografía" },
                { id: 'socials', label: "Redes abiertas", service: "Configuración Redes" },
                { id: 'posts6', label: "6 contenidos publicados", service: "Primeros Posts" }
            ],
            rewards: [
                { id: 'tips', label: "Tips IA Personalizados", icon: Sparkles },
                { id: 'templates', label: "Plantillas Básicas", icon: LayoutGrid },
                { id: 'support', label: "Soporte Base", icon: Info }
            ],
            icon: Globe
        },
        {
            id: 2,
            name: "Estrategia",
            color: "yellow",
            mainGoal: "Ser visible y constante",
            indicator: "Marca activa y reconocida",
            status: "Ya se ve, pero aún no vende de forma automática.",
            suggestedContent: "Contenido 12/mes, Reels Virales, Historias Vendedoras",
            complexity: "MEDIA",
            fullDescription: "Aquí construimos el hábito. El algoritmo debe reconocerte como un creador activo para empezar a generar tracción.",
            technicalTasks: [
                "Ejecución de Calendario Mensual (12 Posts)",
                "Producción de 2-4 Reels Profesionales",
                "Engagement Automático con Audiencia",
                "Monitoreo de Estadísticas Semanales"
            ],
            coachTip: "La consistencia vence al talento. El cliente compra cuando te ve presente.",
            metas: [
                { id: 'calendar', label: "Calendario de contenido activo", service: "Community Manager" },
                { id: 'posts12', label: "12 publicaciones al mes", service: "Community Manager" },
                { id: 'reels2', label: "2 videos profesionales", service: "Edición de Video / Reels" },
                { id: 'profile', label: "Perfil optimizado", service: "Community Manager" },
                { id: 'message', label: "Mensaje claro de servicios", service: "Estrategia" }
            ],
            rewards: [
                { id: 'priority', label: "Prioridad Media", icon: Activity },
                { id: 'review', label: "Revisión Mensual", icon: CheckCircle2 },
                { id: 'auto-suggest', label: "Sugerencias Auto", icon: Zap }
            ],
            icon: Target
        },
        {
            id: 3,
            name: "Marca",
            color: "orange",
            mainGoal: "Generar credibilidad sólida",
            indicator: "Marca confiable y experta",
            status: "La gente confía, pero el proceso de venta es manual.",
            suggestedContent: "Videos Testimoniales, Portafolios de Éxito, Livestreaming",
            complexity: "ALTA",
            fullDescription: "El enfoque cambia del 'qué vendes' al 'por qué eres el mejor'. Validamos tu autoridad con pruebas sociales.",
            technicalTasks: [
                "Producción de Video Corporativo/Expertice",
                "Curaduría de Testimonios Reales",
                "Refuerzo Premuim de Identidad Visual",
                "Creación de Digital Portfolio Interactivo"
            ],
            coachTip: "El cliente ya te conoce, ahora debe creerte. Los testimonios son tu mejor vendedor.",
            metas: [
                { id: 'testimonio3', label: "3 testimonios reales", service: "Videos Testimoniales" },
                { id: 'corpvideo', label: "Video corporativo", service: "Edición Profesional" },
                { id: 'solidbrand', label: "Branding sólido", service: "Diseño Avanzado" },
                { id: 'educontent', label: "Contenido educativo", service: "Community Manager" },
                { id: 'digitalport', label: "Portafolio digital", service: "Fotografía Profesional" }
            ],
            rewards: [
                { id: 'audit', label: "Auditoría de Marca", icon: ShieldCheck },
                { id: 'bio-opt', label: "Optimización Bio", icon: Type },
                { id: 'early', label: "Acceso Anticipado", icon: Rocket }
            ],
            icon: Star
        },
        {
            id: 4,
            name: "Automatización",
            color: "blue",
            mainGoal: "Ser el referente y vender",
            indicator: "Sistema de ventas con tracción",
            status: "Es referencia nacional. El CRM ya captura leads.",
            suggestedContent: "Masterclass, Funnels de Lead Magnet, Facebook Ads",
            complexity: "AVANZADA",
            fullDescription: "Configuramos la maquinaria pesada. Tu marca personal se convierte en un activo que genera dinero mientras descansas.",
            technicalTasks: [
                "Implementación de CRM Estratégico",
                "Diseño de Embudo de Ventas (Funnels)",
                "Lanzamiento de Pauta Publicitaria (Ads)",
                "Integración de Agendamiento Automático"
            ],
            coachTip: "Deja de perseguir, empieza a atraer. Un lead automatizado vale por 10 chats manuales.",
            metas: [
                { id: 'proweb', label: "Web profesional", service: "Desarrollo Web" },
                { id: 'schedu', label: "Sistema de agendamiento", service: "SaaS / Chatbot" },
                { id: 'autobasic', label: "Automatización básica", service: "Automatizaciones" },
                { id: 'crmactive', label: "CRM activo", service: "CRM DIIC" },
                { id: 'ads', label: "Campañas publicitarias", service: "Pauta Publicitaria" }
            ],
            rewards: [
                { id: 'extra-strat', label: "Sesión Estratégica Extra", icon: Target },
                { id: 'competitors', label: "Análisis Competencia", icon: TrendingUp },
                { id: 'premium-rev', label: "Review Premium", icon: Video }
            ],
            icon: Zap
        },
        {
            id: 5,
            name: "Escala",
            color: "purple",
            mainGoal: "Crecimiento constante masivo",
            indicator: "Negocio escalando con IA",
            status: "Negocio estructurado. Operatividad delegada a IA.",
            suggestedContent: "IA Custom Flow, Contenido Omnicanal, Embudos Pro",
            complexity: "CRÍTICA",
            fullDescription: "Dominio absoluto. Usamos inteligencia artificial para predecir comportamientos y escalar tu ROI a niveles exponenciales.",
            technicalTasks: [
                "Desarrollo de IA para Proceso de Venta",
                "Optimización de ROI en Campañas Masivas",
                "Escalado de Operatividad a Nivel Nacional",
                "Estrategia de Retención y Valor de Vida (LTV)"
            ],
            coachTip: "La verdadera escala no requiere más de ti, sino mejores procesos. La IA es tu clon infinito.",
            metas: [
                { id: 'stableflow', label: "Flujo estable de clientes", service: "Marketing Escala" },
                { id: 'roipos', label: "ROI positivo", service: "Optimización Campañas" },
                { id: 'advauto', label: "Automatizaciones avanzadas", service: "IA / Custom Dev" },
                { id: 'funnels', label: "Embudos activos", service: "Estrategia de Ventas" },
                { id: 'contentpro', label: "Producción constante", service: "Full Production" }
            ],
            rewards: [
                { id: 'expansion', label: "Plan Expansión", icon: Globe },
                { id: 'vip-ia', label: "Automatización IA VIP", icon: Zap },
                { id: 'vip-support', label: "Soporte Prioritario", icon: ShieldCheck }
            ],
            icon: Rocket
        }
    ],
    medical: [
        {
            id: 1,
            name: "Presencia Médica",
            color: "emerald",
            mainGoal: "Existir éticamente en redes y mapas",
            indicator: "Consultorio Configurado",
            status: "El doctor apenas comienza.",
            suggestedContent: "Grid Estético, Sesión de Fotos en Consultorio, Bio Configurada",
            complexity: "BAJA",
            fullDescription: "Establecemos tu perfil profesional y ficha de Google Maps cumpliendo normativas éticas de salud y ganando visibilidad local.",
            technicalTasks: [
                "Gestión de Redes: Creación y optimización de perfiles sociales",
                "Estrategia mensual + copywriting especializado",
                "Fotografía Profesional: Médico en consultorio, equipo e instalaciones",
                "Diseño de posts y stories base (Grid Estético)"
            ],
            coachTip: "El paciente busca autoridad y empatía. Empieza educando sobre prevención, no vendiendo tratamientos.",
            metas: [
                { id: 'logo', label: "Redes creadas y optimizadas", service: "Social Media" },
                { id: 'colors', label: "Paleta de colores clínica definida", service: "Diseño Base" },
                { id: 'bio', label: "Biografía médica configurada (SEO)", service: "Configuración Redes" },
                { id: 'photo', label: "Fotografías de médico e instalaciones", service: "Fotografía Profesional" },
                { id: 'socials', label: "Estrategia de contenido unificada", service: "Estrategia" },
                { id: 'posts6', label: "6 publicaciones e historias iniciales", service: "Primeros Posts" }
            ],
            rewards: [
                { id: 'tips', label: "Tips IA Personalizados", icon: Sparkles },
                { id: 'templates', label: "Plantillas Básicas", icon: LayoutGrid },
                { id: 'support', label: "Soporte Base", icon: Info }
            ],
            icon: Globe
        },
        {
            id: 2,
            name: "Estrategia Educativa",
            color: "yellow",
            mainGoal: "Ser constante educando al paciente",
            indicator: "Especialista Activo en Redes",
            status: "Ya se ve, pero aún no vende de forma automática.",
            suggestedContent: "12 Posts al mes, Reels de tips médicos, respuestas rápidas",
            complexity: "MEDIA",
            fullDescription: "Creamos un calendario constante enfocado en resolver dudas frecuentes y educar sobre patologías comunes en tu área.",
            technicalTasks: [
                "Producción Audiovisual: Videos informativos y tips médicos",
                "Grabación de procedimientos y resultados (Consultorio)",
                "Automatización y configuración básica de respuestas",
                "Lanzamiento de campañas Meta Ads para captar pacientes"
            ],
            coachTip: "Un paciente informado es un paciente decidido. Explica términos complejos en palabras sencillas.",
            metas: [
                { id: 'calendar', label: "Calendario editorial especializado activo", service: "Community Manager" },
                { id: 'posts12', label: "12 publicaciones de valor y tips al mes", service: "Community Manager" },
                { id: 'reels2', label: "2 videos informativos / tips profesionales", service: "Edición de Video / Reels" },
                { id: 'profile', label: "Automatización de respuestas activa", service: "Community Manager" },
                { id: 'message', label: "Funnels de mensajes en Meta Ads", service: "Estrategia" }
            ],
            rewards: [
                { id: 'priority', label: "Prioridad Media", icon: Activity },
                { id: 'review', label: "Revisión Mensual", icon: CheckCircle2 },
                { id: 'auto-suggest', label: "Sugerencias Auto", icon: Zap }
            ],
            icon: Target
        },
        {
            id: 3,
            name: "Autoridad Especialista",
            color: "orange",
            mainGoal: "Generar confianza con casos y testimonios",
            indicator: "Especialista Recomendado",
            status: "La gente confía, pero el proceso de agendamiento es manual.",
            suggestedContent: "Videos de testimoniales, Grabaciones en Quirófano, Dossier de Tratamientos",
            complexity: "ALTA",
            fullDescription: "Validamos tu reputación médica mediante testimonios permitidos, casos de éxito anónimos y tu historia profesional.",
            technicalTasks: [
                "Producción de videos testimoniales de pacientes",
                "Grabaciones y fotos premium en quirófanos y cirugías",
                "Refuerzo luxury de identidad de marca del doctor",
                "Diseño de dossier digital de tratamientos y servicios"
            ],
            coachTip: "El mayor obstáculo en medicina es el miedo. Tus testimonios de pacientes recuperados curan ese miedo.",
            metas: [
                { id: 'testimonio3', label: "3 videos de testimoniales de pacientes", service: "Videos Testimoniales" },
                { id: 'corpvideo', label: "Video de trayectoria o quirófano premium", service: "Edición Profesional" },
                { id: 'solidbrand', label: "Estética clínica unificada premium", service: "Diseño Avanzado" },
                { id: 'educontent', label: "Carruseles explicativos de cirugías", service: "Community Manager" },
                { id: 'digitalport', label: "Dossier digital de tratamientos", service: "Fotografía Profesional" }
            ],
            rewards: [
                { id: 'audit', label: "Auditoría de Marca", icon: ShieldCheck },
                { id: 'bio-opt', label: "Optimización Bio", icon: Type },
                { id: 'early', label: "Acceso Anticipado", icon: Rocket }
            ],
            icon: Star
        },
        {
            id: 4,
            name: "Consultorio Automatizado",
            color: "blue",
            mainGoal: "Agendar citas de forma automática 24/7",
            indicator: "Embudo de Pacientes Activo",
            status: "Es referencia nacional. El CRM ya captura leads.",
            suggestedContent: "Funnels de Agendamiento, Campañas de Google Ads para Urgencias",
            complexity: "AVANZADA",
            fullDescription: "Instalamos campañas publicitarias locales y sistemas de agendamiento automático para tu secretaria o Doctoralia.",
            technicalTasks: [
                "Integración de Agenda Online (Doctoralia / Calendly)",
                "Lanzamiento de Meta Ads (Captación de Citas)",
                "Configuración de Campañas Google Ads de Urgencias",
                "CRM Básico para seguimiento de pacientes"
            ],
            coachTip: "Tu tiempo en consultorio es oro. Automatiza el agendamiento y enfócate en atender a tus pacientes.",
            metas: [
                { id: 'proweb', label: "Página de agendamiento online", service: "Desarrollo Web" },
                { id: 'schedu', label: "Sistema de citas automatizado", service: "SaaS / Chatbot" },
                { id: 'autobasic', label: "Filtro inicial en chatbot de WhatsApp", service: "Automatizaciones" },
                { id: 'crmactive', label: "CRM de pacientes activo", service: "CRM DIIC" },
                { id: 'ads', label: "Campañas de Google & Meta Ads activas", service: "Pauta Publicitaria" }
            ],
            rewards: [
                { id: 'extra-strat', label: "Sesión Estratégica Extra", icon: Target },
                { id: 'competitors', label: "Análisis Competencia", icon: TrendingUp },
                { id: 'premium-rev', label: "Review Premium", icon: Video }
            ],
            icon: Zap
        },
        {
            id: 5,
            name: "Escala Clínica",
            color: "purple",
            mainGoal: "Crecimiento de centro médico y multiespecialidad",
            indicator: "Marca Médica Consolidada",
            status: "Negocio estructurado. Operatividad delegada a IA.",
            suggestedContent: "Campañas Multiespecialidad, Documentales de Casos Complejos",
            complexity: "CRÍTICA",
            fullDescription: "Escalamos el ROI de tus campañas y posicionamos a tu centro médico con múltiples profesionales e inteligencia artificial.",
            technicalTasks: [
                "Desarrollo de IA para clasificación inicial de pacientes",
                "Campañas Masivas de Posicionamiento de la Clínica",
                "Escalado de Marca a Nivel Regional o Nacional",
                "Embudo de Retención (Revisiones Médicas Recurrentes)"
            ],
            coachTip: "Deja de ser un consultorio individual. Convierte tu apellido o marca en una institución.",
            metas: [
                { id: 'stableflow', label: "Flujo constante de cirugías/procedimientos", service: "Marketing Escala" },
                { id: 'roipos', label: "ROI medible y altamente positivo", service: "Optimización Campañas" },
                { id: 'advauto', label: "WhatsApp IA para triaje básico", service: "IA / Custom Dev" },
                { id: 'funnels', label: "Embudos activos multiespecialidad", service: "Estrategia de Ventas" },
                { id: 'contentpro', label: "Producción audiovisual corporativa constante", service: "Full Production" }
            ],
            rewards: [
                { id: 'expansion', label: "Plan Expansión", icon: Globe },
                { id: 'vip-ia', label: "Automatización IA VIP", icon: Zap },
                { id: 'vip-support', label: "Soporte Prioritario", icon: ShieldCheck }
            ],
            icon: Rocket
        }
    ],
    hospitality: [
        {
            id: 1,
            name: "Presencia Foodie",
            color: "emerald",
            mainGoal: "Antojar a primera vista",
            indicator: "Menú y Local Digital Listo",
            status: "El local apenas comienza.",
            suggestedContent: "Diseño de Carta, Grid 'Food Porn', Historias de Ambiente",
            complexity: "BAJA",
            fullDescription: "Creamos un perfil visualmente delicioso que muestre tu menú, dirección y ambiente con total claridad.",
            technicalTasks: [
                "Configuración e indexación en Google Maps y TripAdvisor",
                "Diseño de Grid Visual del Menú Destacado",
                "Optimización de Enlace en Bio (Menú Digital / Reservas)",
                "Sesión Fotográfica Inicial de Platos Estrella"
            ],
            coachTip: "En gastronomía, el amor entra por los ojos. Fotos caseras y pixeladas alejan clientes. Invierte en estética.",
            metas: [
                { id: 'logo', label: "Logo o isotipo de restaurante", service: "Diseño Base" },
                { id: 'colors', label: "Colores que estimulen el apetito (Cálidos)", service: "Diseño Base" },
                { id: 'bio', label: "Bio con dirección, horario y link de menú", service: "Configuración Redes" },
                { id: 'photo', label: "Fotos reales de alta calidad de platos", service: "Fotografía" },
                { id: 'socials', label: "TripAdvisor / Google Maps activo", service: "Configuración Redes" },
                { id: 'posts6', label: "6 publicaciones de menú y ambiente", service: "Primeros Posts" }
            ],
            rewards: [
                { id: 'tips', label: "Tips IA Personalizados", icon: Sparkles },
                { id: 'templates', label: "Plantillas Básicas", icon: LayoutGrid },
                { id: 'support', label: "Soporte Base", icon: Info }
            ],
            icon: Globe
        },
        {
            id: 2,
            name: "Estrategia de Antojo",
            color: "yellow",
            mainGoal: "Construir antojo diario y constante",
            indicator: "Restaurante Activo en Redes",
            status: "Ya se ve, pero aún no vende de forma automática.",
            suggestedContent: "12 Publicaciones, Reels de Cocina, Promociones Especiales",
            complexity: "MEDIA",
            fullDescription: "Mantener al algoritmo recomendando tus reels de cocina y preparaciones especiales para generar visitas constantes.",
            technicalTasks: [
                "Ejecución de Calendario (12 Posts Gastronómicos)",
                "Producción de 2-4 Reels (Preparaciones, 'Detrás de Escena')",
                "Interacción Diaria en Comentarios y Mensajes de Clientes",
                "Análisis Semanal de Alcance Local"
            ],
            coachTip: "Muestra el humo de la parrilla, el queso derretirse. Ese contenido genera antojo y visitas ese mismo día.",
            metas: [
                { id: 'calendar', label: "Calendario de contenido activo", service: "Community Manager" },
                { id: 'posts12', label: "12 posts con Reels de antojo al mes", service: "Community Manager" },
                { id: 'reels2', label: "2 videos profesionales de platillos estrella", service: "Edición de Video / Reels" },
                { id: 'profile', label: "Perfil optimizado con botón de Reservas", service: "Community Manager" },
                { id: 'message', label: "Fácil acceso a WhatsApp de Delivery / Reserva", service: "Estrategia" }
            ],
            rewards: [
                { id: 'priority', label: "Prioridad Media", icon: Activity },
                { id: 'review', label: "Revisión Mensual", icon: CheckCircle2 },
                { id: 'auto-suggest', label: "Sugerencias Auto", icon: Zap }
            ],
            icon: Target
        },
        {
            id: 3,
            name: "Autoridad Gastronómica",
            color: "orange",
            mainGoal: "Posicionar la experiencia y el Chef",
            indicator: "Lugar de Moda y Recomendado",
            status: "La gente confía, pero el proceso de reserva es manual.",
            suggestedContent: "Videos de la Experiencia, Detrás de la Cocina, Historias del Chef",
            complexity: "ALTA",
            fullDescription: "Diferenciamos tu marca de la competencia mostrando tu historia, la técnica del chef y reseñas de comensales reales.",
            technicalTasks: [
                "Producción de Video Documental de la Cocina/Chef",
                "Recopilación de Reseñas de Influencers o Clientes Reales",
                "Actualización Estética Premium de Carta / Menú",
                "Estrategia de Promoción para Días Lentos (Martes/Miércoles)"
            ],
            coachTip: "La gente no solo compra comida, compra estatus y experiencias. Haz que tu local sea instagrameable.",
            metas: [
                { id: 'testimonio3', label: "3 testimonios en video de clientes", service: "Videos Testimoniales" },
                { id: 'corpvideo', label: "Video historia de la marca o Chef", service: "Edición Profesional" },
                { id: 'solidbrand', label: "Identidad visual de menú unificada", service: "Diseño Avanzado" },
                { id: 'educontent', label: "Videos explicando ingredientes / origen", service: "Community Manager" },
                { id: 'digitalport', label: "Fotos de alta calidad del local y ambiente", service: "Fotografía Profesional" }
            ],
            rewards: [
                { id: 'audit', label: "Auditoría de Marca", icon: ShieldCheck },
                { id: 'bio-opt', label: "Optimización Bio", icon: Type },
                { id: 'early', label: "Acceso Anticipado", icon: Rocket }
            ],
            icon: Star
        },
        {
            id: 4,
            name: "Mesas Automatizadas",
            color: "blue",
            mainGoal: "Automatizar reservas y pauta local",
            indicator: "Reservas de Fin de Semana Llenas",
            status: "Es referencia nacional. El CRM ya captura leads.",
            suggestedContent: "Anuncios Segmentados Locales, Chatbots de Reservas",
            complexity: "AVANZADA",
            fullDescription: "Establecemos un chatbot que entregue el menú y gestione reservas automáticamente, potenciado con pauta local a 5km.",
            technicalTasks: [
                "Integración de Sistema de Reservas (Otter / WhatsApp Chatbot)",
                "Lanzamiento de Meta Ads geolocalizados a la redonda",
                "Campañas Automáticas para Cumpleañeros de la Semana",
                "CRM de Clientes para remarketing (Fidelización)"
            ],
            coachTip: "Vender a un cliente que ya te visitó es 5 veces más barato. Pídeles su WhatsApp y envíales promociones semanales.",
            metas: [
                { id: 'proweb', label: "Menú digital interactivo propio", service: "Desarrollo Web" },
                { id: 'schedu', label: "Sistema de reserva de mesas online", service: "SaaS / Chatbot" },
                { id: 'autobasic', label: "Chatbot para enviar menú y dirección", service: "Automatizaciones" },
                { id: 'crmactive', label: "Base de datos de clientes activa", service: "CRM DIIC" },
                { id: 'ads', label: "Anuncios locales en Meta activos", service: "Pauta Publicitaria" }
            ],
            rewards: [
                { id: 'extra-strat', label: "Sesión Estratégica Extra", icon: Target },
                { id: 'competitors', label: "Análisis Competencia", icon: TrendingUp },
                { id: 'premium-rev', label: "Review Premium", icon: Video }
            ],
            icon: Zap
        },
        {
            id: 5,
            name: "Imperio Gastronómico",
            color: "purple",
            mainGoal: "Escalar a franquicias o múltiples locales",
            indicator: "Marca Reconocida a Nivel Nacional",
            status: "Negocio estructurado. Operatividad delegada a IA.",
            suggestedContent: "Campañas de Lanzamiento, Embudos de Franquicia",
            complexity: "CRÍTICA",
            fullDescription: "Utilizamos inteligencia artificial para analizar preferencias y optimizar presupuestos masivos en múltiples sucursales.",
            technicalTasks: [
                "Segmentación de campañas por múltiples zonas / sucursales",
                "Funnels automáticos para captación de inversionistas/franquiciados",
                "Estrategia Omnicanal Masiva de Contenido y Delivery",
                "Análisis de ROI de publicidad vs. tickets promedio de compra"
            ],
            coachTip: "El negocio no es la comida, son los procesos. Escala tu marca sistematizando cada plato y cada anuncio.",
            metas: [
                { id: 'stableflow', label: "Tráfico lleno garantizado cada semana", service: "Marketing Escala" },
                { id: 'roipos', label: "ROI publicitario medible en ventas de caja", service: "Optimización Campañas" },
                { id: 'advauto', label: "IA CRM para sugerencias y fidelización", service: "IA / Custom Dev" },
                { id: 'funnels', label: "Funnels para abrir nuevos locales activos", service: "Estrategia de Ventas" },
                { id: 'contentpro', label: "Producción a escala para múltiples sedes", service: "Full Production" }
            ],
            rewards: [
                { id: 'expansion', label: "Plan Expansión", icon: Globe },
                { id: 'vip-ia', label: "Automatización IA VIP", icon: Zap },
                { id: 'vip-support', label: "Soporte Prioritario", icon: ShieldCheck }
            ],
            icon: Rocket
        }
    ],
    realestate: [
        {
            id: 1,
            name: "Presencia Inmobiliaria",
            color: "emerald",
            mainGoal: "Generar confianza y profesionalismo",
            indicator: "Catálogo Inmobiliario Configurado",
            status: "El realtor apenas comienza.",
            suggestedContent: "Diseño de Grid, Plantillas de Listings, Bio Profesional",
            complexity: "BAJA",
            fullDescription: "Diseñamos un grid limpio y profesional para Realtor con propiedades destacadas y plantillas de fichas técnicas.",
            technicalTasks: [
                "Configuración de Perfiles Profesionales de Realtor en Portales y Redes",
                "Diseño de Plantillas para Presentación de Propiedades",
                "Optimización de Bio con Enlaces a Cartera de Propiedades",
                "Fotografía Profesional del Realtor (Marca Personal)"
            ],
            coachTip: "En bienes raíces vendes seguridad. Un grid desordenado o fotos borrosas de casas destruyen tu credibilidad de inmediato.",
            metas: [
                { id: 'logo', label: "Logo personal o de agencia", service: "Diseño Base" },
                { id: 'colors', label: "Colores corporativos elegantes (Azules/Negros)", service: "Diseño Base" },
                { id: 'bio', label: "Bio con zona de enfoque y licencia", service: "Configuración Redes" },
                { id: 'photo', label: "Foto de retrato corporativo premium", service: "Fotografía" },
                { id: 'socials', label: "Presencia en portales inmobiliarios clave", service: "Configuración Redes" },
                { id: 'posts6', label: "6 publicaciones de propiedades destacadas", service: "Primeros Posts" }
            ],
            rewards: [
                { id: 'tips', label: "Tips IA Personalizados", icon: Sparkles },
                { id: 'templates', label: "Plantillas Básicas", icon: LayoutGrid },
                { id: 'support', label: "Soporte Base", icon: Info }
            ],
            icon: Globe
        },
        {
            id: 2,
            name: "Estrategia de Captación",
            color: "yellow",
            mainGoal: "Atracción constante de interesados",
            indicator: "Realtor Activo y Visibilizado",
            status: "Ya se ve, pero aún no vende de forma automática.",
            suggestedContent: "12 Publicaciones, House Tours en Reels, Historias Diarias de Visitas",
            complexity: "MEDIA",
            fullDescription: "Mantener constancia mostrando listings, consejos de compra/venta y house tours cortos para generar leads inmobiliarios.",
            technicalTasks: [
                "Ejecución de Calendario (12 Publicaciones Inmobiliarias)",
                "Producción de 2-4 Reels (Tours Rápidos y Consejos Financieros)",
                "Gestión y Respuesta Rápida a Leads de Compradores",
                "Monitoreo Semanal de Interesados y Mensajes"
            ],
            coachTip: "No solo subas fotos de casas. Muestra tu cara explicando por qué es una buena inversión. La gente le compra a personas.",
            metas: [
                { id: 'calendar', label: "Calendario de listings activo", service: "Community Manager" },
                { id: 'posts12', label: "12 publicaciones informativas al mes", service: "Community Manager" },
                { id: 'reels2', label: "2 videos en formato tour vertical", service: "Edición de Video / Reels" },
                { id: 'profile', label: "Perfil optimizado para captación de leads", service: "Community Manager" },
                { id: 'message', label: "Llamados a la acción claros para cotizar", service: "Estrategia" }
            ],
            rewards: [
                { id: 'priority', label: "Prioridad Media", icon: Activity },
                { id: 'review', label: "Revisión Mensual", icon: CheckCircle2 },
                { id: 'auto-suggest', label: "Sugerencias Auto", icon: Zap }
            ],
            icon: Target
        },
        {
            id: 3,
            name: "Autoridad del Broker",
            color: "orange",
            mainGoal: "Posicionar propiedades High-Ticket",
            indicator: "Agente de Confianza en la Zona",
            status: "La gente confía, pero el filtrado es manual.",
            suggestedContent: "Cinematic House Tours, Testimonios de Firmas, Análisis de Mercado",
            complexity: "ALTA",
            fullDescription: "Posicionamos tu estatus de Broker experto en propiedades de alto valor mediante cinematic house tours e historias de éxito.",
            technicalTasks: [
                "Producción de House Tours Cinemáticos (Dron/Estabilizador)",
                "Recopilación de Testimonios de Propietarios Felices",
                "Actualización de Identidad Visual a Nivel Luxury",
                "Creación de Ebook/Guía de Inversión Local como Gancho"
            ],
            coachTip: "El comprador de lujo busca discreción y excelencia técnica. Habla de plusvalía y retorno de inversión en tus videos.",
            metas: [
                { id: 'testimonio3', label: "3 testimonios de clientes de compra/venta", service: "Videos Testimoniales" },
                { id: 'corpvideo', label: "Video cinematic de presentación de tu marca", service: "Edición Profesional" },
                { id: 'solidbrand', label: "Fichas técnicas y folletos luxury", service: "Diseño Avanzado" },
                { id: 'educontent', label: "Contenido educativo sobre créditos e impuestos", service: "Community Manager" },
                { id: 'digitalport', label: "Dossier premium de propiedades activas", service: "Fotografía Profesional" }
            ],
            rewards: [
                { id: 'audit', label: "Auditoría de Marca", icon: ShieldCheck },
                { id: 'bio-opt', label: "Optimización Bio", icon: Type },
                { id: 'early', label: "Acceso Anticipado", icon: Rocket }
            ],
            icon: Star
        },
        {
            id: 4,
            name: "Embudo Inmobiliario",
            color: "blue",
            mainGoal: "Filtrar e interesados calificados automáticamente",
            indicator: "Funnels de Captación Funcionando",
            status: "Es referencia nacional. El CRM ya captura leads.",
            suggestedContent: "Campañas de Captación de Propietarios, Embudos de Inversión",
            complexity: "AVANZADA",
            fullDescription: "Instalamos campañas con formularios automáticos en Meta Ads y WhatsApp Chatbots para perfilar presupuestos antes de llamar.",
            technicalTasks: [
                "Integración de CRM Inmobiliario (ActiveCampaign / HubSpot / Salesforce)",
                "Lanzamiento de Meta Ads con Formularios de Captación",
                "Chatbot de Calificación (Filtro de presupuesto e ingresos)",
                "Automatización de agendamiento para visitas a propiedades"
            ],
            coachTip: "El 80% del tiempo de un Realtor se pierde con curiosos sin presupuesto. Filtra a tus leads automáticamente con un chatbot.",
            metas: [
                { id: 'proweb', label: "Landing page de captación de propietarios", service: "Desarrollo Web" },
                { id: 'schedu', label: "Agenda online para visitas guiadas", service: "SaaS / Chatbot" },
                { id: 'autobasic', label: "WhatsApp bot de filtrado de presupuesto", service: "Automatizaciones" },
                { id: 'crmactive', label: "CRM inmobiliario activo", service: "CRM DIIC" },
                { id: 'ads', label: "Campañas activas en Meta Ads para propiedades", service: "Pauta Publicitaria" }
            ],
            rewards: [
                { id: 'extra-strat', label: "Sesión Estratégica Extra", icon: Target },
                { id: 'competitors', label: "Análisis Competencia", icon: TrendingUp },
                { id: 'premium-rev', label: "Review Premium", icon: Video }
            ],
            icon: Zap
        },
        {
            id: 5,
            name: "Desarrollo & Escala",
            color: "purple",
            mainGoal: "Preventa de desarrollos y proyectos en planos",
            indicator: "Venta de Proyectos Masivos",
            status: "Negocio estructurado. Operatividad delegada a IA.",
            suggestedContent: "Campañas Internacionales, Renders y Avances de Obra Cinemáticos",
            complexity: "CRÍTICA",
            fullDescription: "Escalamos el sistema para constructoras o grandes agencias, automatizando pre-ventas de edificios y atrayendo inversionistas internacionales.",
            technicalTasks: [
                "Embudo de Ventas Internacional (Targeting de migrantes/inversionistas)",
                "Producción de Renders Cinemáticos y Avances de Obra en Video",
                "Estrategia de Email Marketing Automático para Inversionistas",
                "Análisis de ROI por costo de adquisición de cliente (CAC)"
            ],
            coachTip: "La pre-venta de planos se vende con renders emocionales y números fríos de plusvalía. Atrae a los inversionistas con datos.",
            metas: [
                { id: 'stableflow', label: "Flujo constante de visitas semanales", service: "Marketing Escala" },
                { id: 'roipos', label: "ROI medible en ventas de unidades", service: "Optimización Campañas" },
                { id: 'advauto', label: "Integración de CRM + Chatbot IA + Brokers", service: "IA / Custom Dev" },
                { id: 'funnels', label: "Funnels internacionales de inversión activos", service: "Estrategia de Ventas" },
                { id: 'contentpro', label: "Producción constante de avances de obra y tours", service: "Full Production" }
            ],
            rewards: [
                { id: 'expansion', label: "Plan Expansión", icon: Globe },
                { id: 'vip-ia', label: "Automatización IA VIP", icon: Zap },
                { id: 'vip-support', label: "Soporte Prioritario", icon: ShieldCheck }
            ],
            icon: Rocket
        }
    ]
};

export default function ClientLevelSystem({ initialLevel = 1, clientId }) {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [level, setLevel] = useState(initialLevel);
    const [activeLevel, setActiveLevel] = useState(initialLevel);
    const [clientNiche, setClientNiche] = useState('general');
    const [clientName, setClientName] = useState('Cliente');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Checkbox states for demo simulation
    const [completedMetas, setCompletedMetas] = useState({
        // L1
        'logo': true, 'colors': true, 'bio': true, 'photo': true, 'socials': true, 'posts6': true,
        // L2
        'calendar': true, 'posts12': true, 'reels2': false, 'profile': true, 'message': false,
    });

    useEffect(() => {
        const loadClientData = async () => {
            if (!clientId) return;
            const client = await agencyService.getClientById(clientId);
            if (client) {
                const numericLevel = client.growth_level || 1;
                setLevel(numericLevel);
                setActiveLevel(numericLevel);
                setClientName(client.name || 'Cliente');

                // Determine Niche
                const rawIndustry = (client.industry || '').toLowerCase().trim();
                let determinedNiche = 'general';
                if (rawIndustry.includes('medico') || rawIndustry.includes('health') || rawIndustry.includes('doctor') || rawIndustry.includes('salud') || rawIndustry.includes('urología') || rawIndustry.includes('urologia')) {
                    determinedNiche = 'medical';
                } else if (rawIndustry.includes('horeca') || rawIndustry.includes('restaurant') || rawIndustry.includes('gastronom') || rawIndustry.includes('comida') || rawIndustry.includes('restaurante')) {
                    determinedNiche = 'hospitality';
                } else if (rawIndustry.includes('realestate') || rawIndustry.includes('construccion') || rawIndustry.includes('inmobiliaria') || rawIndustry.includes('bienes raíces') || rawIndustry.includes('bienes raices') || rawIndustry.includes('realtor')) {
                    determinedNiche = 'realestate';
                }
                setClientNiche(determinedNiche);
                
                if (client.onboarding_data?.completedMetas) {
                    setCompletedMetas(client.onboarding_data.completedMetas);
                }
            }
        };
        loadClientData();
    }, [clientId]);

    const levels = NICHE_LEVELS[clientNiche] || NICHE_LEVELS.general;

    const currentLevelData = levels[activeLevel - 1];
    const userActualLevelData = levels[level - 1];

    // Progress calculation for CURRENT USER level
    const userLevelMetas = userActualLevelData.metas;
    const completedCount = userLevelMetas.filter(m => completedMetas[m.id]).length;
    const progress = Math.round((completedCount / userLevelMetas.length) * 100);

    const getCoachFeedback = () => {
        const namePart = clientName.split(' ')[0];
        const levelName = userActualLevelData?.name || 'Presencia Digital';
        
        const nicheFeedbacks = {
            general: `Hola ${namePart}, vas por buen camino en tu nivel de ${levelName}. Para consolidar esta fase, asegúrate de completar las metas de desarrollo pendientes y coordinar con tu estratega.`,
            medical: `Estimado Dr. ${namePart}, tu estrategia de ${levelName} avanza con éxito. Para captar más pacientes, enfoquémonos en resolver sus dudas y simplificar el agendamiento.`,
            hospitality: `Hola equipo de ${namePart}, vuestra presencia en la fase de ${levelName} es clave. Potenciemos el antojo visual con reels dinámicos y facilitemos las reservas en línea.`,
            realestate: `Estimado broker ${namePart}, en esta etapa de ${levelName} la confianza es todo. Asegúrate de mostrar tu experiencia local y de segmentar bien tus leads inmobiliarios.`
        };
        return nicheFeedbacks[clientNiche] || nicheFeedbacks.general;
    };

    if (!isMounted) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-left pb-16">
            {/* SMART ALERTS SECTION */}
            <GrowthAlertSystem />

            {/* LEVEL HEADER - STRATEGIC OVERVIEW */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeLevel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gradient-to-br from-[#0A0A12] to-[#11111E] border border-white/10 p-10 rounded-[40px] relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <currentLevelData.icon className={`w-64 h-64 text-${currentLevelData.color}-500`} />
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10 text-left">
                        <div className="space-y-6 flex-1">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-3xl bg-${currentLevelData.color}-500/10 text-${currentLevelData.color}-400 border border-${currentLevelData.color}-500/20`}>
                                    <currentLevelData.icon className="w-10 h-10" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest text-${currentLevelData.color}-500`}>Nivel {activeLevel}</span>
                                        <div className="w-1 h-1 rounded-full bg-gray-600" />
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border border-${currentLevelData.color}-500/30 text-${currentLevelData.color}-400 bg-${currentLevelData.color}-500/5`}>
                                            Complejidad: {currentLevelData.complexity}
                                        </span>
                                    </div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mt-1">{currentLevelData.name}</h2>
                                </div>
                            </div>
                            <div className="space-y-4 max-w-2xl">
                                <p className="text-gray-400 font-bold text-sm leading-relaxed">
                                    {currentLevelData.fullDescription}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-2xl flex items-center gap-2">
                                        <Video className="w-3.5 h-3.5 text-indigo-400" />
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{currentLevelData.suggestedContent}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Status Badge (If activeLevel === level) */}
                        <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 flex flex-col items-center text-center min-w-[220px] backdrop-blur-md relative overflow-hidden group">
                            {activeLevel === level ? (
                                <>
                                    <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                            <motion.circle
                                                cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={301.6}
                                                initial={{ strokeDashoffset: 301.6 }}
                                                animate={{ strokeDashoffset: 301.6 * (1 - progress / 100) }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                className={`text-${currentLevelData.color}-500 shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
                                            />
                                        </svg>
                                        <span className="absolute text-2xl font-black text-white">{progress}%</span>
                                    </div>
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-tight">Tu Nivel Actual</p>
                                </>
                            ) : activeLevel < level ? (
                                <div className="py-8 flex flex-col items-center gap-4">
                                    <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Nivel Completado</span>
                                </div>
                            ) : (
                                <div className="py-8 flex flex-col items-center gap-4 opacity-40">
                                    <Lock className="w-16 h-16 text-gray-500" />
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Siguiente Hito</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* STRATEGIC ROADMAP & TASKS */}
                <div className="lg:col-span-2 bg-[#0A0A12] border border-white/10 rounded-[40px] p-10 text-left relative overflow-hidden shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Task List */}
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                    <Briefcase className="w-6 h-6 text-indigo-400" /> Hoja de Ruta Técnica
                                </h3>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest ml-9">Responsabilidades del Strategist</p>
                            </div>
                            <div className="space-y-4">
                                {currentLevelData.technicalTasks.map((task, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="mt-1">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                        </div>
                                        <p className="text-xs text-gray-300 font-bold leading-tight group-hover:text-white transition-colors">{task}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Suggested Content & Formula */}
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                    <Palette className="w-6 h-6 text-pink-400" /> Fórmula de Contenido
                                </h3>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest ml-9">Contenido sugerido por la IA</p>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Sparkles className="w-12 h-12 text-white" />
                                </div>
                                <p className="text-[11px] text-gray-300 font-bold leading-relaxed mb-4">
                                    "{currentLevelData.suggestedContent}. Cada pieza está diseñada para maximizar el {currentLevelData.mainGoal.toLowerCase()}."
                                </p>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                                        Conversión
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-widest">
                                        Confianza
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* METAS CHECKLIST (Only show for active level) */}
                    <div className="mt-12 pt-10 border-t border-white/5">
                        <div className="flex justify-between items-center mb-10">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                    <Flag className="w-6 h-6 text-emerald-400" /> Metas de Desarrollo
                                </h3>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest ml-9">Requisitos para certificación Nivel {activeLevel}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentLevelData.metas.map((meta, i) => (
                                <div
                                    key={meta.id}
                                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${completedMetas[meta.id] ? 'bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5' : 'bg-white/5 border-white/5'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl transition-colors ${completedMetas[meta.id] ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-600'}`}>
                                            {completedMetas[meta.id] ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <h4 className={`text-[11px] font-black uppercase tracking-tight ${completedMetas[meta.id] ? 'text-white' : 'text-gray-400'}`}>
                                                {meta.label}
                                            </h4>
                                            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">
                                                {meta.service}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COACH INSIGHTS & UPCOMING METAS */}
                <div className="space-y-8">
                    {/* ENTRENADOR EMPRESARIAL IA (STAGE SPECIFIC) */}
                    <div className={`bg-gradient-to-br from-${currentLevelData.color}-900/40 to-black border border-${currentLevelData.color}-500/30 rounded-[40px] p-8 text-left relative overflow-hidden group`}>
                        <div className={`absolute -top-4 -right-4 w-24 h-24 bg-${currentLevelData.color}-500/20 blur-3xl rounded-full`} />
                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-4">
                            <Sparkles className={`w-5 h-5 text-${currentLevelData.color}-400 animate-pulse`} /> Coach Insight (Stage {activeLevel})
                        </h4>
                        <div className="p-6 bg-black/40 rounded-3xl border border-white/5 mb-8 backdrop-blur-sm relative z-10 shadow-inner">
                            <p className="text-xs text-gray-300 font-black italic leading-relaxed uppercase tracking-tighter">
                                "{currentLevelData.coachTip}"
                            </p>
                        </div>
                        {activeLevel === level && (
                            <button 
                                onClick={() => router.push('?tab=catalog')}
                                className={`w-full py-4 bg-${currentLevelData.color}-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-${currentLevelData.color}-500/20 flex items-center justify-center gap-2 group border border-white/10`}
                            >
                                Lograr Siguiente Meta <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>

                    {/* RECOMPENSAS DESBLOQUEADAS */}
                    <div className="mt-12 pt-10 border-t border-white/5">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <Gift className="w-6 h-6 text-pink-400" /> Beneficios Desbloqueados (Nivel {level})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {currentLevelData.rewards.map((reward, i) => (
                                <motion.div
                                    key={reward.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white/5 border border-white/10 p-6 rounded-[32px] group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <reward.icon className="w-12 h-12 text-white" />
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl bg-${currentLevelData.color}-500/10 flex items-center justify-center mb-4 text-${currentLevelData.color}-400 border border-${currentLevelData.color}-500/20`}>
                                        <reward.icon className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">{reward.label}</h4>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase mt-2">Estado: <span className="text-emerald-400">Activo</span></p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COACH INSIGHTS & UPCOMING METAS */}
                <div className="space-y-8">
                    {/* ENTRENADOR EMPRESARIAL IA */}
                    <div className="bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/30 rounded-[40px] p-8 text-left relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/20 blur-3xl rounded-full" />
                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-4">
                            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" /> Coach Empresarial IA
                        </h4>
                        <div className="p-6 bg-black/40 rounded-3xl border border-white/5 mb-8 backdrop-blur-sm relative z-10 shadow-inner">
                            <p className="text-xs text-gray-300 font-bold italic leading-relaxed">
                                "{getCoachFeedback()}"
                            </p>
                        </div>
                        <button 
                            onClick={() => {
                                router.push('?tab=identity');
                                toast.info("Consultando al Coach IA...");
                            }}
                            className="w-full py-4 bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group border border-white/10"
                        >
                            Lograr Siguiente Meta <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* METAS BLOQUEADAS (NEXT LEVELS) */}
                    <div className="bg-[#0A0A12] border border-white/5 rounded-[40px] p-8 text-left">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Selector de Crecimiento</h4>
                            <Activity className="w-3 h-3 text-indigo-500" />
                        </div>
                        <div className="space-y-3">
                            {levels.map(l => (
                                <button 
                                    key={l.id} 
                                    onClick={() => setActiveLevel(l.id)}
                                    className={`w-full p-5 rounded-3xl border transition-all text-left group flex flex-col gap-2 ${l.id === activeLevel 
                                        ? `bg-${l.color}-500/10 border-${l.color}-500 shadow-xl` 
                                        : 'bg-white/[0.02] border-white/[0.05] hover:border-white/20'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${l.id === activeLevel ? `text-${l.color}-400` : 'text-gray-500'}`}>
                                            Nivel {l.id}
                                        </span>
                                        {l.id === level && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                                        {l.id > level && <Lock className="w-3 h-3 text-gray-700" />}
                                    </div>
                                    <h5 className={`text-xs font-black uppercase leading-none ${l.id === activeLevel ? 'text-white' : 'text-gray-500'}`}>{l.name}</h5>
                                    
                                    {l.id === activeLevel && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="pt-2"
                                        >
                                            <p className="text-[9px] text-gray-400 font-bold uppercase truncate">{l.indicator}</p>
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* FULL EVOLUTION FOOT PRINT */}
            <div className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-10 text-left shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <TrendingUp className="w-40 h-40 text-indigo-500" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-12 flex items-center gap-4">
                    <TrendingUp className="w-7 h-7 text-indigo-400" /> Tu Historial de Éxito
                </h3>
                <div className="flex gap-8 overflow-x-auto pb-6 relative no-scrollbar">
                    {levels.map(l => (
                        <div key={l.id} className={`flex-1 min-w-[300px] p-8 rounded-[40px] border transition-all duration-700 group ${l.id === level ? 'bg-white/5 border-indigo-500/50 scale-[1.02] shadow-[0_0_40px_rgba(0,0,0,0.6)]' : l.id < level ? 'bg-white/5 border-emerald-500/20 opacity-60' : 'bg-white/5 border-white/5 opacity-30 select-none'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border ${l.id <= level ? `bg-${l.color}-500/10 text-${l.color}-400 border-${l.color}-500/20` : 'bg-white/5 text-gray-700 border-white/5'}`}>
                                    L{l.id}
                                </span>
                                {l.id < level ? <Award className="w-6 h-6 text-emerald-400" /> : l.id > level ? <Lock className="w-4 h-4 text-gray-800" /> : <Target className="w-5 h-5 text-indigo-400 animate-pulse" />}
                            </div>
                            <h5 className="text-lg font-black text-white uppercase tracking-tighter mb-2">{l.name}</h5>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">{l.indicator}</p>
                            <div className={`w-full h-2 rounded-full mb-6 ${l.id < level ? 'bg-emerald-500' : l.id === level ? `bg-${l.color}-500` : 'bg-white/5'}`} />
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Metas Clave</span>
                                    {l.metas.slice(0, 2).map((m, idx) => (
                                        <div key={idx} className="flex items-center gap-2 opacity-60">
                                            {l.id <= level && completedMetas[m.id] ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <div className="w-3 h-3 rounded-full border border-gray-700" />}
                                            <span className="text-[9px] font-bold text-gray-400 uppercase truncate">{m.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Beneficios</span>
                                    <div className="flex gap-2">
                                        {l.rewards.map((r, idx) => (
                                            <div key={idx} className={`p-2 rounded-lg border border-white/5 ${l.id <= level ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white/5 text-gray-800'}`} title={r.label}>
                                                <r.icon className="w-3 h-3" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
