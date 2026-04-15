'use client';

import { motion } from 'framer-motion';

export default function SubProfileStep({ onNext, updateData, profileType }) {
    // Definición de sub-nichos mapeados a los nuevos IDs de ProfileSelectorStep
    const subNiches = {
        personal: ['Coach / Mentor', 'Consultor Independiente', 'Autor / Escritor', 'Speaker / Conferencista', 'Artista', 'Político', 'Deportista de Élite', 'Influencer', 'Otro'],
        creator: ['Vlogs / Lifestyle', 'Tech Reviews', 'Gaming / Streamer', 'Educativo / Tutoriales', 'Entretenimiento', 'Podcast de Entrevistas', 'Podcast de Nicho', 'Otro'],
        marketing: ['Agencia 360', 'Especialista SEO/SEM', 'Content Strategy', 'Social Media Management', 'Diseño Gráfico / Branding', 'PR / Relaciones Públicas', 'Otro'],
        ecommerce: ['Moda & Accesorios', 'Tecnología & Gadgets', 'Hogar & Decoración', 'Cosmética / Belleza', 'Suplementos / Salud', 'Productos Digitales', 'Dropshipping', 'Otro'],
        education: ['Idiomas', 'Marketing & Negocios', 'Programación / Tech', 'Finanzas Personales', 'Música / Arte', 'Academia de Oposiciones', 'Colegio / Universidad', 'Otro'],
        finance: ['Banca / Seguros', 'Inversiones / Trading', 'Contabilidad / Auditoría', 'Fintech', 'Cripto / Web3', 'Asesoría Fiscal', 'Otro'],
        health: ['Clínica Médica', 'Odontología', 'Psicología / Terapia', 'Nutrición / Dietética', 'Estética / Dermocosmética', 'Fisioterapia', 'Hospital / Centro de Salud', 'Otro'],
        horeca: ['Restaurante de Autor', 'Cafetería de Especialidad', 'Bar / Club Nocturno', 'Hotel / Resort', 'Catering / Eventos', 'Fast Food Premium', 'Otro'],
        tech: ['Software / SaaS', 'Ciberseguridad', 'Inteligencia Artificial', 'Hardware / IoT', 'Servicios IT / Soporte', 'Blockchain', 'Otro'],
        legal: ['Bufete de Abogados', 'Notaría', 'Asesoría Jurídica', 'Propiedad Intelectual', 'Derecho Digital', 'Otro'],
        realestate: ['Agencia Inmobiliaria', 'Promotora / Constructora', 'Inversión Inmobiliaria', 'Gestión de Alquileres', 'Arquitectura / Interiorismo', 'Otro'],
        retail: ['Tienda Física (Local)', 'Supermercado', 'Franquicia', 'Distribución / Mayorista', 'Moda Retail', 'Otro'],
        consulting: ['Estrategia de Negocio', 'Recursos Humanos', 'Operaciones / Procesos', 'Transformación Digital', 'Ventas / Comercial', 'Otro'],
        manufacturing: ['Industrial / Fábrica', 'Artesanía / Hecho a Mano', 'Automotriz', 'Textil', 'Alimentaria', 'Otro'],
        construction: ['Obra Civil', 'Reformas / Interiorismo', 'Instalaciones / Energía', 'Materiales de Construcción', 'Otro'],
        transport: ['Logística de Envios', 'Transporte de Pasajeros', 'Almacenamiento / Stock', 'Delivery', 'Flotas de Vehículos', 'Otro'],
        travel: ['Agencia de Viajes', 'Guía Turístico', 'Experiencias / Aventuras', 'Cruceros', 'Turismo Rural', 'Otro'],
        ong: ['Fundación', 'Asociación Cultural', 'Ayuda Humanitaria', 'Medio Ambiente', 'Derechos Humanos', 'Otro'],
        government: ['Ayuntamiento / Municipalidad', 'Ministerio / Entidad Pública', 'Servicios Ciudadanos', 'Turismo Público', 'Otro'],
        other: ['Servicios Generales', 'Comercio Variado', 'Sector Industrial', 'Entorno Creativo', 'Otro']
    };

    const options = subNiches[profileType] || subNiches['other'];

    const handleSelect = (niche) => {
        updateData({ niche });
        onNext();
    };

    return (
        <div className="flex flex-col h-full max-w-2xl mx-auto w-full text-center">
            <div className="mb-10 space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                    ¿Cuál es tu <span className="text-indigo-500">Enfoque?</span>
                </h2>
                <p className="text-gray-400 text-lg font-medium">
                    Esto nos permite configurar los módulos de estrategia <br className="hidden md:block" /> y el lenguaje de tu IA.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 overflow-y-auto custom-scrollbar pb-10 content-start">
                {options.map((opt, idx) => (
                    <motion.button
                        key={opt}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleSelect(opt)}
                        className="p-5 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all text-left font-bold text-gray-300 flex items-center justify-between group backdrop-blur-sm"
                    >
                        <span className="group-hover:translate-x-1 transition-transform">{opt}</span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
