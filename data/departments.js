import {
    Video, Image as ImageIcon, Mic, Camera, Clapperboard,
    Bot, Globe, Share2, Printer, GraduationCap,
    Users, BarChart3, FileText, Calendar, Star, UploadCloud
} from 'lucide-react';

export const DEPARTMENTS = [
    {
        id: 'community',
        title: 'Community Manager',
        description: 'Gestión de redes, copy y estrategia. Nosotros nos encargamos de tu comunidad.',
        icon: Users,
        href: '/dashboard/community',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        badge: 'Social Media',
        cta: 'Ver Reportes',
        gradient: 'from-blue-500/5'
    },
    {
        id: 'design',
        title: 'Diseño Gráfico',
        description: 'Posts, Carruseles, Branding y Miniaturas. Creatividad entregada a tiempo.',
        icon: ImageIcon,
        href: '/dashboard/design',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        badge: 'Branding',
        cta: 'Solicitar Diseño'
    },
    {
        id: 'audition',
        title: 'Audition Pro',
        description: 'Estudios de grabación, mezcla y mastering profesional.',
        icon: Mic,
        href: '/dashboard/audio',
        color: 'text-fuchsia-400',
        bg: 'bg-fuchsia-500/10',
        border: 'border-fuchsia-500/20',
        badge: 'New'
    },
    {
        id: 'video',
        title: 'Edición de Video',
        description: 'Carga tus archivos "crudos" aquí. Nuestro equipo profesional los editará por ti.',
        icon: UploadCloud,
        href: '/dashboard/editing',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        badge: 'Post-Producción',
        cta: 'Subir Material',
        pulse: true
    },
    {
        id: 'photo',
        title: 'Fotografía & Estudio',
        description: 'Reserva sesiones corporativas, de producto o eventos. Calidad de estudio.',
        icon: Camera,
        href: '/dashboard/photo',
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        badge: 'Studio',
        cta: 'Reservar Sesión'
    },
    {
        id: 'filmmaker',
        title: 'Filmmaker Pro',
        description: 'Producción de alto nivel, Cine y Comerciales. Agenda un equipo de rodaje.',
        icon: Clapperboard,
        href: '/dashboard/filmmaker',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        badge: 'Cine',
        cta: 'Nuevo Proyecto'
    },
    {
        id: 'models',
        title: 'Modelos & Talento',
        description: 'Casting y selección de talento para tus producciones.',
        icon: Star,
        href: '/dashboard/talent',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        badge: 'Casting'
    },

    {
        id: 'web',
        title: 'Desarrollo Web',
        description: 'Landing Pages, eCommerce y Embudos de venta.',
        icon: Globe,
        href: '/dashboard/web',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        badge: 'Dev'
    },
    {
        id: 'print',
        title: 'Imprenta & Merch',
        description: 'Material físico, ropa y papelería corporativa.',
        icon: Printer,
        href: '/dashboard/print',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        badge: 'Merch'
    },
    {
        id: 'events',
        title: 'Cobertura de Eventos',
        description: 'Fotografía, Video y Streaming para tus momentos importantes.',
        icon: Calendar,
        href: '/dashboard/events',
        color: 'text-lime-400',
        bg: 'bg-lime-500/10',
        border: 'border-lime-500/20',
        badge: 'Live'
    }
];
