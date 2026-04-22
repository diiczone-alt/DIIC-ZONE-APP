export const MEDICAL_PROTOCOLS = {
    FULL_BLADDER: {
        id: 'full_bladder',
        title: 'Vejiga Llena (Ecografía/Uroflujometría)',
        instructions: 'Para su estudio urológico, es indispensable que llegue con la vejiga llena. Por favor, beba 4-5 vasos de agua 1 hora antes de su cita y no orine hasta que se le indique en la consulta.',
        whatsappTemplate: 'Hola [NAME], le recordamos que para su estudio con la Dra. Jessica Rey debe acudir con la VEJIGA LLENA. Favor beber 1 litro de agua 1 hora antes y NO orinar. ¡Le esperamos!'
    },
    FASTING: {
        id: 'fasting',
        title: 'Ayuno Clínico (Cirugía/Laboratorio)',
        instructions: 'Para su procedimiento o examen de laboratorio, debe mantener un ayuno total de 8 horas (incluyendo agua).',
        whatsappTemplate: 'Hola [NAME], le recordamos que para su procedimiento médico debe acudir con AYUNO TOTAL de 8 horas. No ingerir alimentos ni líquidos. ¡Saludos!'
    },
    PROSTATE_PREP: {
        id: 'prostate_prep',
        title: 'Preparación Próstata / Biopsia',
        instructions: 'Requiere preparación especial con antibiótico y enema según las indicaciones entregadas previamente.',
        whatsappTemplate: 'Hola [NAME], recordatorio de preparación para su estudio de próstata. Por favor asegúrese de haber tomado su medicación y seguido el protocolo de limpieza indicado.'
    },
    GENERAL_REMINDER: {
        id: 'general_reminder',
        title: 'Recordatorio de Consulta General',
        instructions: 'Recordatorio de su cita programada.',
        whatsappTemplate: 'Hola [NAME], la Dra. Jessica Rey le espera mañana en su consulta de urología. Por favor llegue 10 minutos antes. ¡Feliz día!'
    }
};

export const getUrologyTags = () => [
    'Infección Urinaria', 'Cálculos Renales', 'Próstata', 'Vejiga', 'Incontinencia', 'Disfunción Eréctil', 'Cirugía'
];
