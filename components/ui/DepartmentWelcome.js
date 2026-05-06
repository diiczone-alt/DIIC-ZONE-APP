'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    Users, ImageIcon, Mic, UploadCloud, Camera,
    Clapperboard, Star, Globe, Printer, Calendar,
    FileText, MessageSquare, LayoutDashboard, ArrowRight,
    BarChart3, Video, ShoppingBag, CheckCircle2, LayoutGrid, ArrowLeft
} from 'lucide-react';

const DEPARTMENT_CONTENT = {
    community: {
        icon: Users,
        title: "Community Manager",
        welcome: "👋 Hola, soy tu Community Manager",
        description: "Desde aquí coordinaremos tu contenido, publicaciones, campañas y reportes. Tu equipo creativo se encarga del trabajo, tú ves los resultados.",
        color: "blue",
        actions: [
            { label: "Ver mis proyectos", icon: FileText, mode: "projects" },
            { label: "Ver calendario", icon: Calendar, mode: "calendar" },
            { label: "Hablar con mi CM", icon: MessageSquare, mode: "chat" },
            { label: "Ver reportes", icon: BarChart3, mode: "reports" },
            { label: "Flujo de contenido", icon: LayoutDashboard, mode: "pipeline" }
        ]
    },
    design: {
        icon: ImageIcon,
        title: "Diseño Gráfico",
        welcome: "🎨 Hola, este es tu equipo de diseño",
        description: "Transformamos tus ideas en piezas visuales de alto impacto. Desde posts hasta branding corporativo.",
        color: "purple",
        actions: [
            { label: "Diseños en proceso", icon: LayoutDashboard, mode: "projects" },
            { label: "Solicitar nuevo diseño", icon: ArrowRight, mode: "new" },
            { label: "Ver historial", icon: FileText, mode: "history" }
        ]
    },
    video: {
        icon: UploadCloud,
        title: "Editor de Video",
        welcome: "🎬 Aquí editamos tus videos",
        description: "Carga tu material y nosotros nos encargamos de la magia. Edición profesional, color y sonido.",
        color: "orange",
        actions: [
            { label: "Videos en edición", icon: Clapperboard, mode: "projects" },
            { label: "Subir material", icon: UploadCloud, mode: "upload" },
            { label: "Enviar comentarios", icon: MessageSquare, mode: "chat" }
        ]
    },
    filmmaker: {
        icon: Clapperboard,
        title: "Filmmaker Pro",
        welcome: "🎥 Producción audiovisual",
        description: "Equipos de rodaje y cinematografía para tus campañas más ambiciosas.",
        color: "red",
        actions: [
            { label: "Agendar grabación", icon: Calendar, mode: "schedule" },
            { label: "Ver rodajes", icon: Video, mode: "projects" },
            { label: "Ver entregables", icon: FileText, mode: "assets" }
        ]
    },
    audition: {
        icon: Mic,
        title: "Audio & Producción",
        welcome: "🎧 Audio & Producción sonora",
        description: "Podcast, locución y diseño sonoro con calidad de estudio.",
        color: "fuchsia",
        actions: [
            { label: "Audios en edición", icon: Mic, mode: "projects" },
            { label: "Agendar grabación", icon: Calendar, mode: "schedule" },
            { label: "Descargar masters", icon: FileText, mode: "assets" }
        ]
    },
    photo: {
        icon: Camera,
        title: "Fotografía",
        welcome: "📸 Fotografía profesional",
        description: "Capturamos la esencia de tu marca con equipo Full Frame y retoque de alto nivel.",
        color: "pink",
        actions: [
            { label: "Agendar sesión", icon: Camera, mode: "schedule" },
            { label: "Ver fotos", icon: ImageIcon, mode: "projects" },
            { label: "Descargar material", icon: FileText, mode: "assets" }
        ]
    },
    print: {
        icon: Printer,
        title: "Imprenta & Merch",
        welcome: "🖨️ Imprenta y producción física",
        description: "Tus diseños llevados al mundo real con la mejor calidad de impresión.",
        color: "yellow",
        actions: [
            { label: "Solicitar cotización", icon: ArrowRight, mode: "quote" },
            { label: "Ver pedidos", icon: ShoppingBag, mode: "projects" },
            { label: "Historial", icon: FileText, mode: "history" }
        ]
    },
    models: {
        icon: Star,
        title: "Modelos & Talento",
        welcome: "👤 Modelos y talento creativo",
        description: "Casting y selección de talento especializado para tus producciones.",
        color: "rose",
        actions: [
            { label: "Ver perfiles", icon: Users, mode: "catalog" },
            { label: "Solicitar modelo", icon: Star, mode: "request" },
            { label: "Ver disponibilidad", icon: Calendar, mode: "schedule" }
        ]
    },
    events: {
        icon: Calendar,
        title: "Cobertura de Eventos",
        welcome: "🎉 Cobertura de eventos",
        description: "No te pierdas ningún detalle. Streaming y cobertura en vivo para tus momentos especiales.",
        color: "lime",
        actions: [
            { label: "Solicitar cobertura", icon: ArrowRight, mode: "request" },
            { label: "Ver cronograma", icon: Calendar, mode: "schedule" },
            { label: "Aprobar material", icon: CheckCircle2, mode: "approval" }
        ]
    },
    web: {
        icon: Globe,
        title: "Desarrollo Web",
        welcome: "🌐 Tu presencia digital",
        description: "Diseñamos y desarrollamos sitios web, landing pages y soluciones personalizadas.",
        color: "cyan",
        actions: [
            { label: "Webs en desarrollo", icon: LayoutGrid, mode: "projects" },
            { label: "Pedir ajuste", icon: MessageSquare, mode: "chat" },
            { label: "Métricas", icon: BarChart3, mode: "analytics" }
        ]
    }
};

export default function DepartmentWelcome({ deptId, onAction }) {
    const router = useRouter();
    const { user } = useAuth();
    const data = DEPARTMENT_CONTENT[deptId] || DEPARTMENT_CONTENT.community;
    const DeptIcon = data.icon;

    const colorClasses = {
        blue: "from-blue-400 via-indigo-500 to-indigo-600",
        purple: "from-purple-400 via-fuchsia-500 to-fuchsia-600",
        orange: "from-orange-400 via-red-500 to-red-600",
        red: "from-red-400 via-rose-500 to-rose-600",
        fuchsia: "from-fuchsia-400 via-purple-500 to-purple-600",
        pink: "from-pink-400 via-rose-500 to-rose-600",
        yellow: "from-yellow-400 via-orange-500 to-orange-600",
        rose: "from-rose-400 via-pink-500 to-pink-600",
        lime: "from-lime-400 via-emerald-500 to-emerald-600",
        cyan: "from-cyan-400 via-blue-500 to-blue-600",
    };

    const glowClasses = {
        blue: "bg-blue-500/20",
        purple: "bg-purple-500/20",
        orange: "bg-orange-500/20",
        red: "bg-red-500/20",
        fuchsia: "bg-fuchsia-500/20",
        pink: "bg-pink-500/20",
        yellow: "bg-yellow-500/20",
        rose: "bg-rose-500/20",
        lime: "bg-lime-500/20",
        cyan: "bg-cyan-500/20",
    };

    const orbitalRings = [
        { size: "inset-0", duration: 25, opacity: "opacity-20", dash: "border-dashed" },
        { size: "inset-8", duration: 15, opacity: "opacity-40", dash: "border-solid" },
        { size: "inset-16", duration: 20, opacity: "opacity-10", dash: "border-dashed" },
        { size: "inset-24", duration: 12, opacity: "opacity-30", dash: "border-solid" },
        { size: "inset-32", duration: 30, opacity: "opacity-15", dash: "border-dashed" },
    ];

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden font-display">
            {/* Back Button for Admins */}
            {user?.role === 'ADMIN' && (
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.push('/hub')}
                    className="absolute top-10 left-10 z-50 flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Volver al Hub</span>
                </motion.button>
            )}

            {/* Background Layer: Neural Grid & Deep Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className={`absolute top-0 left-1/4 w-[1000px] h-[1000px] ${glowClasses[data.color]} rounded-full blur-[200px] opacity-30 animate-pulse`} />
                <div className={`absolute bottom-0 right-1/4 w-[1000px] h-[1000px] ${glowClasses[data.color]} rounded-full blur-[200px] opacity-20`} />
                
                {/* Neural Mesh Background */}
                <div className="absolute inset-0 opacity-[0.03]" 
                    style={{ 
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '100px 100px'
                    }} 
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                
                {/* Visual Section: Holographic Core */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: -50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative hidden lg:block"
                >
                    <div className="relative w-full aspect-square max-w-lg mx-auto">
                        {/* Central Glow Orb */}
                        <div className={`absolute inset-0 bg-gradient-to-tr ${colorClasses[data.color]} opacity-5 rounded-full blur-[100px] animate-pulse`} />
                        
                        {/* Rotating Orbital System */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {orbitalRings.map((ring, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                                    transition={{ duration: ring.duration, repeat: Infinity, ease: "linear" }}
                                    className={`absolute ${ring.size} border border-white/[0.08] ${ring.dash} rounded-full ${ring.opacity}`}
                                />
                            ))}
                        </div>

                        {/* Glass Core Container */}
                        <div className="absolute inset-12 border border-white/10 rounded-full flex items-center justify-center bg-[#0A0A1F]/40 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] group overflow-hidden">
                            <motion.div
                                animate={{ 
                                    opacity: [0.3, 0.6, 0.3],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <DeptIcon className={`w-48 h-48 text-white opacity-40`} strokeWidth={0.5} />
                            </motion.div>

                            {/* Floating Tech Data Elements */}
                            <div className="absolute inset-0">
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ 
                                            y: [0, -20, 0],
                                            opacity: [0, 1, 0]
                                        }}
                                        transition={{ 
                                            duration: 3 + i, 
                                            repeat: Infinity, 
                                            delay: i * 0.5,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute text-[8px] font-mono text-white/20 whitespace-nowrap"
                                        style={{ 
                                            top: `${15 + i * 15}%`, 
                                            left: i % 2 === 0 ? '10%' : '70%' 
                                        }}
                                    >
                                        {`SYSTEM_MODE::${data.title.toUpperCase()}_v2.0`}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Central Holographic Label */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                        >
                            <div className="bg-[#050511]/80 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-2xl shadow-2xl flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-1 leading-none">Creative Hub</span>
                                <span className="text-sm font-black text-white uppercase tracking-widest">{data.title}</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Text & Actions Section */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full ${glowClasses[data.color]} border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-2xl backdrop-blur-md`}
                    >
                        <span className={`w-2 h-2 rounded-full bg-current animate-pulse shadow-[0_0_10px_currentColor]`} />
                        Zona Creativa • Operación en Vivo
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter italic uppercase">
                        {data.welcome.split(',')[0]},<br />
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${colorClasses[data.color]} not-italic`}>
                            {data.welcome.split(',')[1]}
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-14 font-medium leading-relaxed max-w-xl opacity-80 border-l-2 border-white/10 pl-8">
                        {data.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {data.actions.map((action, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                whileHover={{ scale: 1.02, x: 8 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onAction(action.mode)}
                                className={`group flex items-center justify-between p-6 bg-white/5 border border-white/[0.05] rounded-[2rem] hover:bg-white/10 hover:border-white/20 transition-all text-left backdrop-blur-sm relative overflow-hidden ${i === 0 ? 'sm:col-span-2 bg-indigo-600/10 border-indigo-500/20' : ''}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all shadow-xl`}>
                                        <action.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">Ejecutar</span>
                                        <span className="text-lg font-black text-white tracking-tight uppercase">{action.label}</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="mt-16 flex items-center gap-8"
                    >
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <motion.img 
                                    key={i} 
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + data.color + 10}`} 
                                    className="w-12 h-12 rounded-full border-4 border-[#050511] bg-gray-900 shadow-2xl cursor-pointer" 
                                    alt="team" 
                                />
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Status: Active</span>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                                Tu equipo de <strong className="text-white">{data.title}</strong> está listo para operar.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
