import {
    Megaphone, Users, PenTool, Video, Palette,
    Camera, Image as ImageIcon, MessageCircle, Bot, Rocket,
    Clapperboard, Lightbulb, Mic, Move, FileText, FolderOpen,
    Scissors, Sliders, Paintbrush, Layers, Activity
} from 'lucide-react';

export const ACADEMY_COURSES = [
    {
        id: 1,
        title: "Fundamentos de Marketing Digital",
        level: "Básico",
        focus: "Digital Marketing",
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
        focus: "Community Management",
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
        focus: "Content Marketing",
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
        focus: "Video Editing",
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
        focus: "Graphic Design",
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
        focus: "AV Production",
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
        focus: "Photography",
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
        focus: "WhatsApp Sales",
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
        focus: "Business AI",
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
        focus: "Agency Scale",
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

export const FILMMAKER_ACADEMY_COURSES = [
    {
        id: 101,
        title: "Introducción al Filmmaking & Equipo Esencial",
        level: "Básico",
        focus: "Gear & Camera Setup",
        description: "Domina los tipos de cámaras, sensores, lentes ideales y accesorios para iniciar tu rodaje.",
        icon: Camera,
        topics: [
            "Introducción al mundo audiovisual y roles",
            "Sensores Full Frame vs APS-C",
            "Lentes de focal fija vs zoom",
            "Sistemas de estabilización (Trípodes and Gimbals)",
            "Accesorios esenciales para el filmmaker"
        ],
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        progress: 0
    },
    {
        id: 102,
        title: "Exposición & Composición Cinematográfica",
        level: "Básico",
        focus: "Cinematic Look",
        description: "Aprende el triángulo de exposición y las reglas compositivas para dar un look de cine a tus planos.",
        icon: Clapperboard,
        topics: [
            "Triángulo de Exposición: ISO, Apertura y Obturación",
            "La Regla del Obturador a 180 grados",
            "Composición: Tercios, simetría y líneas de fuga",
            "Tipos de Planos: Wide, Medium, Close-up",
            "Regla del eje cinematográfico (Eje de 180°)"
        ],
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        progress: 0
    },
    {
        id: 103,
        title: "Iluminación de Tres Puntos & Luz Natural",
        level: "Básico",
        focus: "Lighting Design",
        description: "El arte de modelar con luz. Controla fuentes artificiales y aprovecha al máximo la luz del sol.",
        icon: Lightbulb,
        topics: [
            "Luz principal (Key Light) y modelado",
            "Luz de relleno (Fill Light) para controlar sombras",
            "Contraluz (Rim Light) para separar del fondo",
            "Difusores, reboteadores y control de temperatura",
            "Aprovechar la Golden Hour y luz natural"
        ],
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        progress: 0
    },
    {
        id: 104,
        title: "Diseño de Audio: Micrófonos & Captura Limpia",
        level: "Intermedio",
        focus: "Sound Design",
        description: "El 50% de un buen video es el sonido. Conoce la captura limpia y sincronización.",
        icon: Mic,
        topics: [
            "Micrófonos Lavalier vs Shotgun de cañón",
            "Grabadoras de audio externas y preamplificadores",
            "Ganancia y niveles óptimos de grabación",
            "Control de reverberación y ruido ambiente",
            "Sincronización de audio externo en edición"
        ],
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        progress: 0
    },
    {
        id: 105,
        title: "Movimientos de Cámara & Narrativa Visual",
        level: "Intermedio",
        focus: "Camera Movement",
        description: "Utiliza paneos, tilts, gimbals y tomas manuales para contar una historia sin palabras.",
        icon: Move,
        topics: [
            "Paneos y tilts mecánicos vs dinámicos",
            "Uso narrativo del plano secuencia",
            "Handheld look (toma en mano) controlado",
            "Speed ramping en cámara para transiciones",
            "Motivar los movimientos a través de la acción"
        ],
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        progress: 0
    },
    {
        id: 106,
        title: "Planificación de Rodaje, Guion & Shotlist",
        level: "Intermedio",
        focus: "Pre-Production",
        description: "Prepárate antes de apretar REC. Crea guiones técnicos, listas de planos y dirección de talento.",
        icon: FileText,
        topics: [
            "Estructura del guion cinematográfico",
            "Desglose de guion técnico y planos",
            "Creación del Shot List y cronograma",
            "Scouting de locaciones (búsqueda de sitios)",
            "Dirección de actores y talentos"
        ],
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        progress: 0
    },
    {
        id: 107,
        title: "Flujo de Trabajo: Organización & Proxies",
        level: "Intermedio",
        focus: "Post-Production Flow",
        description: "Optimiza tu hardware. Aprende a catalogar, renombrar material y editar fluido con proxies.",
        icon: FolderOpen,
        topics: [
            "Estructura premium de carpetas DIIC",
            "Copias de seguridad seguras en tarjetas",
            "Creación de proxies en Premiere y Resolve",
            "Metadata de clips y selección de tomas (B-Roll)",
            "Optimización de memoria caché y discos"
        ],
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        progress: 0
    },
    {
        id: 108,
        title: "Edición Rítmica: Corte & Sound Design",
        level: "Intermedio",
        focus: "Rhythmic Editing",
        description: "Edición avanzada de ritmo, jump cuts, transiciones sonoras y diseño de foley.",
        icon: Scissors,
        topics: [
            "El ritmo del corte y sincronización musical",
            "Edición de reels y videos verticales dinámicos",
            "Transiciones invisibles (Match cuts, Whip pans)",
            "Diseño de sonido: Foley, risers y efectos",
            "Control de retención del espectador"
        ],
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        progress: 0
    },
    {
        id: 109,
        title: "Color Grading: Corrección de Color & LUTs",
        level: "Avanzado",
        focus: "Color Grading",
        description: "Aprende el revelado de archivos LOG, curvas de luminancia, ruedas de color y uso de LUTs.",
        icon: Sliders,
        topics: [
            "Diferencia entre Corrección y Gradación de color",
            "Normalización de curvas LOG y balance de blancos",
            "Uso y creación de LUTs de estilo",
            "Color matching (igualar cámaras distintas)",
            "Exportación óptima para RRSS y Web"
        ],
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        progress: 0
    },
    {
        id: 110,
        title: "Dirección de Fotografía: Estética & Color",
        level: "Avanzado",
        focus: "Dirección de Foto",
        description: "El lenguaje de los lentes anamórficos, paletas de colores dramáticas y aspect ratios.",
        icon: Paintbrush,
        topics: [
            "Teoría y psicología del color en la escena",
            "Lentes anamórficos vs esféricos",
            "Formatos y relaciones de aspecto (2.39:1 vs 9:16)",
            "Dirección artística en conjunto con fotografía",
            "Creación de atmósferas con iluminación teatral"
        ],
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        progress: 0
    },
    {
        id: 111,
        title: "Efectos Visuales & Técnicas de Chroma Key",
        level: "Avanzado",
        focus: "VFX & Chroma Key",
        description: "Domina el croma verde (Green Screen), seguimiento de cámara en 3D y rotoscopia.",
        icon: Layers,
        topics: [
            "Iluminación perfecta para croma (Green Screen)",
            "Keying avanzado y remoción de rebote verde",
            "Seguimiento de cámara 3D (Camera Tracking)",
            "Rotoscopia básica e integración de elementos",
            "Limpieza de cables y elementos de escena"
        ],
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        progress: 0
    },
    {
        id: 112,
        title: "Comercialización de Servicios AV & Presupuestos",
        level: "Avanzado",
        focus: "AV Business",
        description: "Cómo presupuestar tus rodajes, armar un showreel letal y cerrar contratos comerciales de alto valor.",
        icon: Activity,
        topics: [
            "Creación de un Showreel (portafolio de video) de impacto",
            "Cómo calcular costes de rodaje y post-producción",
            "Modelado de presupuestos y propuestas comerciales",
            "Negociación y trato con clientes corporativos",
            "Aspectos legales, contratos y derechos de uso"
        ],
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        progress: 0
    }
];

export const DESIGNER_ACADEMY_COURSES = [
    {
        id: 201,
        title: "Fundamentos del Diseño Gráfico",
        level: "Básico",
        focus: "Teoría del Diseño",
        description: "Aprende los principios fundamentales del diseño: composición, balance, contraste, alineación y espacio negativo.",
        icon: Palette,
        topics: [
            "Introducción al lenguaje visual",
            "Principios de composición y equilibrio",
            "Contraste, jerarquía y legibilidad",
            "El espacio negativo y la retícula básica",
            "Crítica de diseño: Identificar aciertos y errores"
        ],
        target: ["Principiantes", "Creadores de Contenido", "Nuevos Diseñadores"],
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        progress: 0
    },
    {
        id: 202,
        title: "Teoría y Psicología del Color",
        level: "Básico",
        focus: "Teoría del Color",
        description: "El color comunica antes que el texto. Domina círculos cromáticos, armonías y psicología del color en branding.",
        icon: Paintbrush,
        topics: [
            "Modelos de color: RGB vs CMYK vs Pantones",
            "Armonías cromáticas (Análogos, Complementarios, Tríadas)",
            "Psicología del color y emociones",
            "Creación de paletas de color consistentes",
            "Accesibilidad y contraste en entornos digitales"
        ],
        target: ["Marcas", "Ilustradores", "Diseñadores Web"],
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
        progress: 0
    },
    {
        id: 203,
        title: "Tipografía y Jerarquía Visual",
        level: "Básico",
        focus: "Tipografía",
        description: "Aprende a elegir y combinar fuentes para guiar la lectura y transmitir la personalidad adecuada de la marca.",
        icon: FileText,
        topics: [
            "Clasificación tipográfica: Serif, Sans Serif, Slab, Script",
            "Anatomía de la letra y espaciados (Kerning, Tracking, Leading)",
            "Combinación de fuentes tipográficas con éxito",
            "Establecer una escala tipográfica clara",
            "Tipografía responsiva para pantallas"
        ],
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/20",
        progress: 0
    },
    {
        id: 204,
        title: "Adobe Illustrator: Vectorización Profesional",
        level: "Intermedio",
        focus: "Software vectorial",
        description: "Domina la herramienta reina de la vectorización. De bocetos simples a logotipos e ilustraciones complejas.",
        icon: PenTool,
        topics: [
            "Interfaz y flujo de trabajo vectorial",
            "Dominio de la Herramienta Pluma (Pen Tool)",
            "Buscatrazos y creador de formas",
            "Efectos vectoriales y deformación controlada",
            "Exportación óptima para imprenta y web"
        ],
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        progress: 0
    },
    {
        id: 205,
        title: "Adobe Photoshop: Edición & Fotocomposición",
        level: "Intermedio",
        focus: "Retoque Digital",
        description: "Edita fotos de alta calidad, crea recortes limpios y fusiona imágenes con luces y sombras realistas.",
        icon: ImageIcon,
        topics: [
            "Flujo no destructivo: Capas y Máscaras",
            "Herramientas de selección avanzada y pluma",
            "Ajustes de color, curvas y revelado de fotos",
            "Fotocomposición y técnicas de iluminación artificial",
            "Filtros inteligentes y retoque de retratos"
        ],
        color: "text-pink-400",
        bgColor: "bg-pink-500/10",
        borderColor: "border-pink-500/20",
        progress: 0
    },
    {
        id: 206,
        title: "Diseño de Identidad de Marca (Branding)",
        level: "Intermedio",
        focus: "Branding",
        description: "Diseña marcas completas. Desde el logotipo principal hasta el manual de identidad y sus aplicaciones reales.",
        icon: Layers,
        topics: [
            "Fase de investigación y Briefing creativo",
            "Conceptualización de logotipos (Isotipo, Imagotipo, Isologo)",
            "Diseño de papelería corporativa y merchandising",
            "Creación del Manual de Identidad Visual",
            "Presentación de propuestas y Mockups realistas"
        ],
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
        progress: 0
    },
    {
        id: 207,
        title: "Diseño Editorial y Diagramación",
        level: "Intermedio",
        focus: "InDesign",
        description: "Aprende a estructurar libros, revistas, dossieres y catálogos digitales interactivos utilizando retículas avanzadas.",
        icon: Move,
        topics: [
            "Retículas editoriales complejas",
            "Estilos de párrafo y de carácter en InDesign",
            "Manejo de grandes volúmenes de texto y saltos",
            "Diseño de portadas que llaman la atención",
            "Preparación de PDFs interactivos y artes finales"
        ],
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        progress: 0
    },
    {
        id: 208,
        title: "Diseño de Interfaces (UI) con Figma",
        level: "Avanzado",
        focus: "UI/UX Design",
        description: "Diseña interfaces limpias, funcionales y modernas. Domina componentes, auto-layout y prototipos interactivos.",
        icon: Bot,
        topics: [
            "Estructura del lienzo en Figma e interfaz",
            "Auto Layout avanzado para layouts responsivos",
            "Componentes, variantes y propiedades de componente",
            "Sistemas de Diseño: Colores, Tipografías y Espaciado",
            "Prototipado interactivo y transiciones inteligentes"
        ],
        color: "text-indigo-400",
        bgColor: "bg-indigo-500/10",
        borderColor: "border-indigo-500/20",
        progress: 0
    },
    {
        id: 209,
        title: "Dirección de Arte y Campañas Visuales",
        level: "Avanzado",
        focus: "Dirección de Arte",
        description: "El paso de diseñador a director creativo. Lidera el concepto visual, la narrativa y la consistencia en campañas multiplataforma.",
        icon: Rocket,
        topics: [
            "Qué hace un Director de Arte",
            "Conceptualización de campañas y Moodboards",
            "Coherencia visual en fotografía, video e ilustración",
            "Dirección de sesiones fotográficas y de rodaje",
            "Presentación de pitches de alto nivel a marcas globales"
        ],
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        progress: 0
    },
    {
        id: 210,
        title: "Modelado y Composición 3D en Blender",
        level: "Avanzado",
        focus: "3D Design",
        description: "Introduce volumen 3D en tus piezas. Crea objetos, iluminación dramática y renderizados fotorrealistas para branding.",
        icon: Scissors,
        topics: [
            "Navegación espacial e interfaz de Blender",
            "Modelado poligonal básico y curvas",
            "Creación de materiales realistas (Shaders PBR)",
            "Configuración de cámaras e iluminación de estudio",
            "Renderizado en Cycles e integración en Photoshop"
        ],
        color: "text-white",
        bgColor: "bg-white/5",
        borderColor: "border-white/10",
        progress: 0
    }
];

