export const VIDEO_TYPES = [
    { id: 'V01', name: 'Reel corto', use: 'Redes sociales', basePrice: 40, maxPrice: 60 },
    { id: 'V02', name: 'Reel producido', use: 'Marca / campaña', basePrice: 80, maxPrice: 120 },
    { id: 'V03', name: 'Video testimonial', use: 'Autoridad', basePrice: 120, maxPrice: 180 },
    { id: 'V04', name: 'Video corporativo', use: 'Empresa', basePrice: 300, maxPrice: 600 },
    { id: 'V05', name: 'Video publicitario', use: 'Ventas', basePrice: 250, maxPrice: 500 },
    { id: 'V06', name: 'Cobertura / evento', use: 'Social', basePrice: 400, maxPrice: 1200 },
    { id: 'V07', name: 'Cinematográfico', use: 'Premium', basePrice: 600, maxPrice: 2500 },
];

export const COSTS_FILMMAKER = [
    { type: 'Grabación corta (1–2h)', min: 20, max: 30 },
    { type: 'Grabación media (3–4h)', min: 40, max: 50 },
    { type: 'Grabación pro', min: 60, max: 80 },
    { type: 'Evento', min: 80, max: 150 },
];

export const COSTS_EDITOR = [
    { type: 'Reel simple', min: 5, max: 8 },
    { type: 'Reel medio', min: 10, max: 15 },
    { type: 'Reel pro', min: 20, max: 30 },
    { type: 'Video largo', min: 40, max: 80 },
];

export const COSTS_DESIGN = [
    { type: 'Portada reel', min: 3, max: 5 },
    { type: 'Miniatura YouTube', min: 5, max: 8 },
    { type: 'Gráficos animados', min: 10, max: 20 },
];

export const MOCK_VIDEO_PROJECTS = [
    {
        id: 'PV-001',
        client: 'Clínica Dental RM',
        type: 'V02',
        status: 'Producción',
        filmmaker: 'Mateo González',
        editor: 'Leslie (Manager)',
        community: 'Leslie',
        recordingDate: '2026-02-25',
        deliveryDate: '2026-03-02',
        priceClient: 120,
        internalCost: 45,
        utility: 75,
    },
    {
        id: 'PV-002',
        client: 'Inmobiliaria City',
        type: 'V04',
        status: 'Edición',
        filmmaker: 'Kevin Ruiz',
        editor: 'Andrés Vera',
        community: 'Leslie',
        recordingDate: '2026-02-18',
        deliveryDate: '2026-02-24',
        priceClient: 450,
        internalCost: 120,
        utility: 330,
    },
];
