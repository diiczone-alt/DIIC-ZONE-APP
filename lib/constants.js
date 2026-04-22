export const ECUADOR_CITIES = [
    { value: 'Quito', label: 'Quito' },
    { value: 'Guayaquil', label: 'Guayaquil' },
    { value: 'Cuenca', label: 'Cuenca' },
    { value: 'Santo Domingo', label: 'Santo Domingo' },
    { value: 'Manta', label: 'Manta' },
    { value: 'Quevedo', label: 'Quevedo' },
    { value: 'Machala', label: 'Machala' },
    { value: 'Portoviejo', label: 'Portoviejo' },
    { value: 'Duran', label: 'Durán' },
    { value: 'Loja', label: 'Loja' },
    { value: 'Ambato', label: 'Ambato' },
    { value: 'Esmeraldas', label: 'Esmeraldas' },
    { value: 'Riobamba', label: 'Riobamba' },
    { value: 'Milagro', label: 'Milagro' },
    { value: 'Ibarra', label: 'Ibarra' },
    { value: 'La Libertad', label: 'La Libertad' },
    { value: 'Babahoyo', label: 'Babahoyo' },
    { value: 'Sangolqui', label: 'Sangolquí' },
    { value: 'Daule', label: 'Daule' },
    { value: 'Latacunga', label: 'Latacunga' },
    { value: 'Tulcan', label: 'Tulcán' },
    { value: 'Chone', label: 'Chone' },
    { value: 'Pasaje', label: 'Pasaje' },
    { value: 'Santa Rosa', label: 'Santa Rosa' },
    { value: 'Nueva Loja', label: 'Nueva Loja (Lago Agrio)' },
    { value: 'Huaquillas', label: 'Huaquillas' },
    { value: 'Salinas', label: 'Salinas' },
    { value: 'Otavalo', label: 'Otavalo' },
    { value: 'Cayambe', label: 'Cayambe' },
    { value: 'Azogues', label: 'Azogues' },
    { value: 'Puyo', label: 'Puyo' },
    { value: 'Tena', label: 'Tena' },
    { value: 'Macas', label: 'Macas' },
    { value: 'Zamora', label: 'Zamora' },
    { value: 'Remoto', label: 'Remoto / Multinacional' }
];
export const MARKETING_TYPES = [
    { value: 'medicos', label: 'Marketing para Médicos' },
    { value: 'dental', label: 'Marketing Dental' },
    { value: 'juridico', label: 'Marketing Jurídico' },
    { value: 'estetica', label: 'Marketing Estético / Spa' },
    { value: 'ecommerce', label: 'E-commerce / Retail' },
    { value: 'marca_personal', label: 'Marca Personal / Coaching' },
    { value: 'real_estate', label: 'Real Estate / Bienes Raíces' },
    { value: 'fianza_global', label: 'Fianza Global / Seguros' },
    { value: 'general', label: 'Marketing General / Otros' }
];

export const PLAN_OPTIONS = [
    { 
        value: 'Basic', 
        label: 'Plan Básico', 
        price: 150, 
        deliverables: { videos: 0, reels: 4, posts: 8, cm: 1 } 
    },
    { 
        value: 'Agency', 
        label: 'Plan Agency', 
        price: 250, 
        deliverables: { videos: 1, reels: 6, posts: 12, strategy: 1, cm: 1 } 
    },
    { 
        value: 'Premium', 
        label: 'Plan Premium', 
        price: 350, 
        deliverables: { videos: 2, reels: 8, posts: 16, strategy: 1, cm: 1 } 
    }
];

export const CREATIVE_RATES = {
    reel_edit: 5,        // $5 por reel al Editor de Video
    reel_prod: 25,       // $25 por grabar reel al Filmmaker
    vid_promo: 50,       // $50 por video largo al Filmmaker/Editor
    cm_base: 50,         // $50 tarifa base mínima por manejo de cuenta
    post_simple: 3       // $3 por diseño al Diseñador Gráfico
};
export const MEDICAL_SPECIALTIES = [
    { value: 'urologia', label: 'Cirujana Uróloga / Urología' },
    { value: 'cardiologia', label: 'Cardiología' },
    { value: 'dermatologia', label: 'Dermatología' },
    { value: 'ginecologia', label: 'Ginecología y Obstetricia' },
    { value: 'pediatria', label: 'Pediatría' },
    { value: 'traumatologia', label: 'Traumatología y Ortopedia' },
    { value: 'oftalmologia', label: 'Oftalmología' },
    { value: 'otorrinolaringologia', label: 'Otorrinolaringología' },
    { value: 'medicina_interna', label: 'Medicina Interna' },
    { value: 'cirugia_estetica', label: 'Cirugía Estética / Plástica' },
    { value: 'nutricion', label: 'Nutrición y Dietética' },
    { value: 'psicologia', label: 'Psicología / Psiquiatría' },
    { value: 'odontologia', label: 'Odontología Especializada' },
    { value: 'oncologia', label: 'Oncología' },
    { value: 'otra', label: 'Otra Especialidad' }
];

export const AGRO_SPECIALTIES = [
    { value: 'bovinos', label: 'Bovinos (Ganado Vacuno)' },
    { value: 'porcinos', label: 'Porcinos (Cerdos)' },
    { value: 'avicultura', label: 'Avicultura (Aves)' },
    { value: 'apicultura', label: 'Apicultura' },
    { value: 'equinos', label: 'Equinos (Caballos)' },
    { value: 'agricultura', label: 'Agricultura General' },
    { value: 'otra', label: 'Otra Rama Agro' }
];

export const INDUSTRY_OPTIONS = [
    { value: 'agropecuario', label: 'Agropecuario / Ganadero' },
    { value: 'educativo', label: 'Formación / Educación' },
    { value: 'medico', label: 'Salud / Médico' },
    { value: 'juridico', label: 'Servicios Jurídicos' },
    { value: 'estetica', label: 'Estética / Bienestar' },
    { value: 'retail', label: 'E-commerce / Retail' },
    { value: 'construccion', label: 'Inmobiliaria / Construcción' },
    { value: 'tecnologia', label: 'Tecnología / SaaS' },
    { value: 'Marca Personal', label: 'Marca Personal' },
    { value: 'Otro', label: 'Otro Sector' }
];
