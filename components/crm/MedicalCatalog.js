'use client';

import { motion } from 'framer-motion';
import { 
    Activity, Shield, Zap, DollarSign, 
    Stethoscope, Heart, Scissors, Plus,
    ShoppingCart, Info, CheckCircle2,
    Cake, Coffee, Sprout, Tractor, Globe, Target
} from 'lucide-react';

const SERVICE_FALLBACKS = {
    medical: [
        {
            id: 'med_1',
            name: 'Consulta de Urología General',
            description: 'Evaluación integral, revisión de historial y diagnóstico preventivo.',
            price: 80,
            category: 'CONSULTA',
            icon: Stethoscope
        },
        {
            id: 'med_2',
            name: 'Ecografía Renal y Vesical',
            description: 'Imagenología de alta resolución para detección de cálculos o quistes.',
            price: 120,
            category: 'DIAGNÓSTICO',
            icon: Activity
        },
        {
            id: 'med_3',
            name: 'Cirugía Robótica Próstata',
            description: 'Procedimiento de mínima invasión con tecnología Da Vinci.',
            price: 8500,
            category: 'QUIRÚRGICO',
            icon: Zap
        },
        {
            id: 'med_4',
            name: 'Circuncisión Laser',
            description: 'Técnica avanzada con recuperación rápida y menor inflamación.',
            price: 1500,
            category: 'QUIRÚRGICO',
            icon: Scissors
        }
    ],
    bakery: [
        {
            id: 'bak_1',
            name: 'Torta de Bodas de Autor',
            description: 'Pastel personalizado de múltiples pisos con decoraciones de azúcar hechas a mano.',
            price: 180,
            category: 'PERSONALIZADO',
            icon: Cake
        },
        {
            id: 'bak_2',
            name: 'Pan de Masa Madre Premium',
            description: 'Fermentación natural de 48 horas, corteza crujiente y miga alveolada.',
            price: 6,
            category: 'PANADERÍA',
            icon: Coffee
        },
        {
            id: 'bak_3',
            name: 'Caja de Cupcakes Gourmet (x12)',
            description: 'Selección de cupcakes rellenos de chocolate belga, frutos rojos y caramelo salado.',
            price: 25,
            category: 'POSTRES',
            icon: Cake
        },
        {
            id: 'bak_4',
            name: 'Mesa de Dulces Completa (Eventos)',
            description: 'Montaje de estación dulce con 80 postres miniatura para 30 personas.',
            price: 450,
            category: 'EVENTOS',
            icon: Cake
        }
    ],
    agro: [
        {
            id: 'agr_1',
            name: 'Abono Orgánico Compostado (50kg)',
            description: 'Nutrientes de liberación lenta para mejorar la fertilidad y estructura del suelo.',
            price: 15,
            category: 'INSUMOS',
            icon: Sprout
        },
        {
            id: 'agr_2',
            name: 'Asesoría Técnica en Cultivos',
            description: 'Visita de agrónomo experto para diagnóstico de plagas y plan de fertilización.',
            price: 90,
            category: 'CONSULTORÍA',
            icon: Tractor
        },
        {
            id: 'agr_3',
            name: 'Sistema de Riego Automatizado',
            description: 'Diseño e instalación de riego por goteo con controlador WiFi para 1 hectárea.',
            price: 1200,
            category: 'EQUIPO',
            icon: Activity
        },
        {
            id: 'agr_4',
            name: 'Semillas Certificadas de Maíz (Saco)',
            description: 'Variedad de alta resistencia climática y excelente rendimiento por hectárea.',
            price: 45,
            category: 'INSUMOS',
            icon: Sprout
        }
    ],
    gym: [
        {
            id: 'gym_1',
            name: 'Plan Mensual VIP Fit',
            description: 'Acceso ilimitado a máquinas, clases dirigidas de CrossFit y evaluación física mensual.',
            price: 45,
            category: 'MEMBRESÍA',
            icon: Activity
        },
        {
            id: 'gym_2',
            name: 'Plan Trimestral Ahorro',
            description: 'Acceso completo por 90 días con descuento preferencial e inducción inicial de coach.',
            price: 110,
            category: 'MEMBRESÍA',
            icon: Shield
        },
        {
            id: 'gym_3',
            name: 'Personal Trainer (12 sesiones)',
            description: 'Entrenamiento guiado uno a uno con coach certificado para cumplimiento rápido de metas.',
            price: 150,
            category: 'PERSONALIZADO',
            icon: Zap
        },
        {
            id: 'gym_4',
            name: 'Asesoría Nutricional Avanzada',
            description: 'Plan alimenticio semanal adaptado a objetivos de ganancia muscular o quema de grasa.',
            price: 30,
            category: 'SALUD',
            icon: Heart
        }
    ],
    education: [
        {
            id: 'edu_1',
            name: 'Curso Grabado Completo',
            description: 'Acceso ilimitado a plataforma con 24 módulos en video, plantillas y exámenes.',
            price: 149,
            category: 'CURSO',
            icon: Globe
        },
        {
            id: 'edu_2',
            name: 'Mentoría Estratégica 1-on-1',
            description: 'Acompañamiento personalizado de 4 sesiones semanales de 60 minutos con consultor senior.',
            price: 590,
            category: 'MENTORÍA',
            icon: Target
        },
        {
            id: 'edu_3',
            name: 'Workshop Intensivo (En Vivo)',
            description: 'Taller práctico de fin de semana con resolución de dudas e interacción grupal directa.',
            price: 75,
            category: 'TALLER',
            icon: Zap
        }
    ],
    industrial: [
        {
            id: 'ind_1',
            name: 'Fabricación de Lote a Medida',
            description: 'Mecanizado y conformado de piezas en acero o aluminio según planos suministrados.',
            price: 2400,
            category: 'FABRICACIÓN',
            icon: Tractor
        },
        {
            id: 'ind_2',
            name: 'Diseño y Modelado 3D CAD',
            description: 'Servicio de ingeniería inversa y desarrollo de planos técnicos e industriales.',
            price: 350,
            category: 'INGENIERÍA',
            icon: Globe
        },
        {
            id: 'ind_3',
            name: 'Mantenimiento Técnico Industrial',
            description: 'Servicio preventivo o correctivo de motores, sistemas hidráulicos y automatización.',
            price: 800,
            category: 'SERVICIO',
            icon: Activity
        }
    ],
    general: [
        {
            id: 'gen_1',
            name: 'Estrategia Digital y Redes',
            description: 'Creación de marca, parrilla de contenidos mensual y pauta publicitaria básica.',
            price: 350,
            category: 'MARKETING',
            icon: Globe
        },
        {
            id: 'gen_2',
            name: 'Asesoría de Negocios 1-on-1',
            description: 'Sesión estratégica de 90 minutos para revisar modelo de negocio y funnel de ventas.',
            price: 120,
            category: 'CONSULTORÍA',
            icon: Target
        },
        {
            id: 'gen_3',
            name: 'Campañas de Tráfico en Meta Ads',
            description: 'Optimización de anuncios de Instagram y Facebook dirigidos a captar clientes calificados.',
            price: 250,
            category: 'ADS',
            icon: Zap
        }
    ]
};

export default function MedicalCatalog({ activeClient, onSelect, onClose }) {
    const brandName = activeClient?.onboarding_data?.strategic?.brandName || activeClient?.name || 'Neyser';
    const industry = activeClient?.industry || activeClient?.onboarding_data?.strategic?.industry || 'General';
    const industryLower = industry.toLowerCase();
    const nameLower = (activeClient?.name || '').toLowerCase();

    // Determine the niche
    const isMedical = ['doctor', 'medico', 'médico', 'medical', 'salud', 'clinica', 'clínica', 'urologia', 'urología'].some(k => industryLower.includes(k));
    const isAgro = ['agro', 'campo', 'agropecuario', 'agropecuaria', 'vete', 'veterinaria'].some(k => industryLower.includes(k));
    const isFood = ['panaderia', 'panadería', 'pasteleria', 'pastelería', 'bakery', 'comida', 'restaurante', 'alimentos'].some(k => industryLower.includes(k) || nameLower.includes(k)) || activeClient?.id === 'C-NEYSER-964';
    const isGym = ['gym', 'fitness', 'gimnasio', 'deporte', 'entrenador'].some(k => industryLower.includes(k));
    const isEducation = ['curso', 'formacion', 'formación', 'educacion', 'educación', 'mentoria', 'mentoría'].some(k => industryLower.includes(k));
    const isIndustrial = ['industrial', 'fabrica', 'fábrica', 'manufactura'].some(k => industryLower.includes(k));

    // Get services from client profile or fallback
    let services = [];
    let isRealFromProfile = false;

    if (activeClient?.onboarding_data?.services && Array.isArray(activeClient.onboarding_data.services) && activeClient.onboarding_data.services.length > 0) {
        services = activeClient.onboarding_data.services.map(s => ({
            id: s.id || Math.random().toString(),
            name: s.name,
            description: s.description || 'Sin descripción disponible.',
            price: parseFloat(s.price) || 0,
            category: s.category || 'SERVICIO',
            icon: isMedical ? Stethoscope : isFood ? Cake : isAgro ? Sprout : isGym ? Activity : isEducation ? Globe : Target
        }));
        isRealFromProfile = true;
    } else {
        // Use default fallbacks based on niche
        if (isMedical) {
            services = SERVICE_FALLBACKS.medical;
        } else if (isFood) {
            services = SERVICE_FALLBACKS.bakery;
        } else if (isAgro) {
            services = SERVICE_FALLBACKS.agro;
        } else if (isGym) {
            services = SERVICE_FALLBACKS.gym;
        } else if (isEducation) {
            services = SERVICE_FALLBACKS.education;
        } else if (isIndustrial) {
            services = SERVICE_FALLBACKS.industrial;
        } else {
            services = SERVICE_FALLBACKS.general;
        }
    }

    return (
        <div className="h-full flex flex-col bg-[#0A0A12] border-l border-white/10 shadow-3xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div>
                    <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">Catálogo Comercial</h3>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1 italic">
                        {isRealFromProfile ? 'Servicios de la Marca' : 'Sugerencias de Nicho'}
                    </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all">
                    <Plus className="w-5 h-5 rotate-45" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {services.map((service, i) => {
                    const IconComponent = service.icon || (isMedical ? Stethoscope : isFood ? Cake : isAgro ? Sprout : isGym ? Activity : isEducation ? Globe : Target);
                    return (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-4 bg-[#151520] border border-white/5 rounded-2xl group hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden"
                            onClick={() => onSelect(service)}
                        >
                            <div className="flex justify-between items-start mb-3 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                    <IconComponent className="w-5 h-5" />
                                </div>
                                <span className="text-[8px] font-black px-2 py-1 bg-white/5 text-gray-400 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-all uppercase">
                                    {service.category}
                                </span>
                            </div>

                            <div className="space-y-1 relative z-10">
                                <h4 className="text-xs font-black text-white uppercase tracking-tight group-hover:text-indigo-200 transition-colors">{service.name}</h4>
                                <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{service.description}</p>
                            </div>

                            <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-3 relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Inversión</span>
                                    <span className="text-sm font-black text-white italic tracking-tighter">${service.price.toLocaleString()}</span>
                                </div>
                                <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-indigo-600/30">
                                    <Plus className="w-3 h-3" /> Añadir
                                </button>
                            </div>

                            {/* Decoration */}
                            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all" />
                        </motion.div>
                    );
                })}
            </div>

            <div className="p-6 border-t border-white/5 bg-black/40">
                <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-[9px] font-medium text-emerald-300 leading-snug">
                        El catálogo se actualiza con los precios de la marca <span className="font-black text-white">{brandName}</span> automáticamente.
                    </p>
                </div>
            </div>
        </div>
    );
}
