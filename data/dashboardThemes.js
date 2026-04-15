import {
    Flag,       // Nivel 1: Inicio
    Zap,        // Nivel 2: Acción
    Target,     // Nivel 3: Objetivo
    Bot,        // Nivel 4: Automatización
    TrendingUp  // Nivel 5: Crecimiento
} from 'lucide-react';

export const dashboardThemes = {
    1: {
        id: 'start',
        label: 'Nivel 1: Inicio',
        badge: 'Presente',
        badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        primaryColor: 'text-blue-500',
        gradientDetails: 'from-blue-600 to-cyan-400',
        cardGradient: 'from-[#0F0F1A] to-[#1A1A2E]', // Azul oscuro profundo
        glowColor: 'bg-blue-500/10',
        icon: Flag,
        welcomeTitle: 'Tu marca ya está viva',
        motivationalMsg: 'Vamos a hacer visible tu marca. Estás dando el primer paso.',
        progressLabel: 'Siguiente: Presencia Digital',
        progressColor: 'bg-blue-500'
    },
    2: {
        id: 'digital',
        label: 'Nivel 2: Presencia',
        badge: 'Visible',
        badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
        primaryColor: 'text-pink-500',
        gradientDetails: 'from-pink-600 to-purple-400',
        cardGradient: 'from-[#1A0F1A] to-[#2E1A25]', // Tono rojizo/rosado oscuro
        glowColor: 'bg-pink-500/10',
        icon: Zap,
        welcomeTitle: 'Ahora ya te ven',
        motivationalMsg: 'Tu presencia está creciendo. Trabajamos tu autoridad.',
        progressLabel: 'Siguiente: Atracción',
        progressColor: 'bg-pink-500'
    },
    3: {
        id: 'sales',
        label: 'Nivel 3: Atracción',
        badge: 'Creciendo',
        badgeColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        primaryColor: 'text-yellow-500',
        gradientDetails: 'from-yellow-600 to-orange-400',
        cardGradient: 'from-[#1A150F] to-[#2E251A]', // Tono ámbar oscuro
        glowColor: 'bg-yellow-500/10',
        icon: Target,
        welcomeTitle: 'Ahora atraemos oportunidades',
        motivationalMsg: 'Aquí empiezan los clientes reales.',
        progressLabel: 'Siguiente: Automatización',
        progressColor: 'bg-yellow-500'
    },
    4: {
        id: 'automation',
        label: 'Nivel 4: Automatización',
        badge: 'Eficiente',
        badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        primaryColor: 'text-purple-500',
        gradientDetails: 'from-purple-600 to-indigo-400',
        cardGradient: 'from-[#120F1A] to-[#201A2E]', // Tono violeta oscuro
        glowColor: 'bg-purple-500/10',
        icon: Bot,
        welcomeTitle: 'Negocio Autónomo',
        motivationalMsg: 'Tu negocio ya no depende solo de ti.',
        progressLabel: 'Siguiente: Escala',
        progressColor: 'bg-purple-500'
    },
    5: {
        id: 'scale',
        label: 'Nivel 5: Escala',
        badge: 'Líder',
        badgeColor: 'text-red-400 bg-red-500/10 border-red-500/20',
        primaryColor: 'text-red-500',
        gradientDetails: 'from-red-600 to-rose-400',
        cardGradient: 'from-[#1A0F0F] to-[#2E1A1A]', // Tono rojo intenso oscuro
        glowColor: 'bg-red-500/10',
        icon: TrendingUp,
        welcomeTitle: 'Imperio Digital',
        motivationalMsg: 'Ahora optimizamos ganancias y autoridad.',
        progressLabel: 'Nivel Máximo Alcanzado',
        progressColor: 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500' // Fuego
    }
};
