import {
    Megaphone, Users, PenTool, Video, Palette,
    Camera, Image as ImageIcon, MessageCircle, Bot, Rocket
} from 'lucide-react';

export const ACADEMY_COURSES = [
    {
        id: 1,
        title: "Fundamentos de Marketing Digital",
        level: "Básico",
        description: "Domina las bases del marketing actual, embudos y mentalidad de marca.",
        icon: Megaphone,
        topics: [
            "Qué es marketing digital hoy",
            "Redes sociales y su función real",
            "Diferencia entre likes, alcance y ventas",
            "Embudos básicos",
            "Mentalidad de marca"
        ],
        target: ["Emprendedores", "Clientes nuevos", "Principiantes"],
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        progress: 0
    },
    {
        id: 2,
        title: "Community Manager Profesional",
        level: "Intermedio",
        description: "Gestiona comunidades reales, calendarios y crisis como un pro.",
        icon: Users,
        topics: [
            "Rol real del community manager",
            "Calendarios de contenido",
            "Estrategia de publicaciones",
            "Respuesta a mensajes & Crisis",
            "Métricas básicas y Reportes"
        ],
        connectsWith: ["Community Manager", "Calendarios", "Métricas"],
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        progress: 15
    },
    {
        id: 3,
        title: "Creación de Contenido que Vende",
        level: "Intermedio",
        description: "Ganchos, storytelling y guiones que convierten.",
        icon: PenTool,
        topics: [
            "Ganchos efectivos",
            "Storytelling",
            "Contenido educativo vs comercial",
            "Scripts para video",
            "Estructuras de reels y videos cortos"
        ],
        target: ["Marcas personales", "Negocios"],
        color: "text-pink-400",
        bgColor: "bg-pink-500/10",
        borderColor: "border-pink-500/20",
        progress: 0
    },
    {
        id: 4,
        title: "Edición de Video para RRSS",
        level: "Intermedio",
        description: "Edita reels dinámicos, cortes y subtítulos que retienen.",
        icon: Video,
        topics: [
            "Tipos de video y formatos",
            "Edición vertical",
            "Ritmo y cortes",
            "Subtítulos y Branding visual",
            "Uso de plantillas"
        ],
        connectsWith: ["Edición de Video", "Sistema de Carpetas"],
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
        progress: 0
    },
    {
        id: 5,
        title: "Diseño Gráfico para Redes",
        level: "Intermedio",
        description: "Identidad visual, coherencia y diseño práctico.",
        icon: Palette,
        topics: [
            "Identidad visual y Colores",
            "Tipografías y Branding",
            "Artes para redes",
            "Herramientas: Canva y Photoshop",
            "Consistencia visual"
        ],
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/20",
        progress: 0
    },
    {
        id: 6,
        title: "Filmmaker & Producción AV",
        level: "Avanzado",
        description: "Producción de alto nivel: iluminación, audio y rodaje.",
        icon: Camera,
        topics: [
            "Grabación profesional",
            "Iluminación y Audio",
            "Planificación de rodaje",
            "Grabaciones para clientes",
            "Flujo de producción"
        ],
        target: ["Videógrafos", "Productoras"],
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        progress: 0
    },
    {
        id: 7,
        title: "Fotografía Profesional",
        level: "Avanzado",
        description: "Domina la fotografía de producto, eventos y comercial.",
        icon: ImageIcon,
        topics: [
            "Fotografía de marca",
            "Fotografía para redes",
            "Fotografía corporativa",
            "Eventos",
            "Edición básica"
        ],
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
        progress: 0
    },
    {
        id: 8,
        title: "Ventas & Automatización WA",
        level: "Intermedio",
        description: "Cierra ventas con WhatsApp Business y automatizaciones.",
        icon: MessageCircle,
        topics: [
            "WhatsApp Business Config",
            "Respuestas rápidas",
            "Embudos por chat",
            "Automatización de mensajes",
            "Cierre de ventas"
        ],
        connectsWith: ["IA", "CRM", "Automatizaciones"],
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        progress: 0
    },
    {
        id: 9,
        title: "IA para Negocios",
        level: "Avanzado",
        description: "Multiplica tu productividad con Inteligencia Artificial.",
        icon: Bot,
        topics: [
            "Uso práctico de IA",
            "Chatbots",
            "Automatización de procesos",
            "Generación de contenido con IA",
            "Optimización de tiempo"
        ],
        color: "text-indigo-400",
        bgColor: "bg-indigo-500/10",
        borderColor: "border-indigo-500/20",
        progress: 0
    },
    {
        id: 10,
        title: "Escalamiento Digital (Agencias)",
        level: "Avanzado",
        description: "Sistemas para escalar tu agencia o negocio de servicios.",
        icon: Rocket,
        topics: [
            "Cómo escalar servicios",
            "Sistemas y Equipos",
            "Flujos de trabajo",
            "Rentabilidad",
            "Modelo SaaS / agencia híbrida"
        ],
        target: ["Agencias", "Emprendedores Avanzados"],
        color: "text-white",
        bgColor: "bg-white/5",
        borderColor: "border-white/10",
        progress: 0
    }
];
