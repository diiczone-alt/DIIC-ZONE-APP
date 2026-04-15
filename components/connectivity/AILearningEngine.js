'use client';

/**
 * AI LEARNING ENGINE - DIIC ZONE
 * Módulo para procesar patrones de éxito y automatizar recomendaciones.
 */

const NICHE_PROFILES = {
    medico: {
        success_formats: ['educativo', 'FAQ', 'autoridad'],
        ideal_duration: '15-25s',
        hooks: ['Pregunta Directa', 'Dato Estadístico'],
        visual_style: 'Limpio / Profesional',
        cta: 'Agenda Cita / Más Info'
    },
    restaurante: {
        success_formats: ['visual', 'detrás de cámaras', 'emocional'],
        ideal_duration: '10-15s',
        hooks: ['Primer Plano Impactante', 'Sonido ASMR'],
        visual_style: 'Vibrante / Dinámico',
        cta: 'Visítanos / Reserva'
    },
    gym: {
        success_formats: ['motivacional', 'transformación', 'tutorial'],
        ideal_duration: '20-40s',
        hooks: ['Resultado Visual', 'Reto'],
        visual_style: 'Energético / Alto Contraste',
        cta: 'Inscríbete / Prueba Gratuita'
    },
    politico: {
        success_formats: ['cercanía', 'storytelling', 'propuesta'],
        ideal_duration: '30-50s',
        hooks: ['Empatía / Problema Común', 'Llamado a la Acción'],
        visual_style: 'Cálido / Natural',
        cta: 'Únete / Comparte'
    }
};

export const getSmartRecommendation = (niche, category = 'content') => {
    const profile = NICHE_PROFILES[niche.toLowerCase()] || {
        success_formats: ['educativo', 'entretenimiento'],
        ideal_duration: '15-30s',
        hooks: ['Problema → Solución'],
        visual_style: 'Moderno',
        cta: 'Contáctanos'
    };

    const recommendations = {
        content: `En tu nicho (${niche}), los contenidos tipo ${profile.success_formats[0].toUpperCase()} tienen un +40% de retención.`,
        hook: `Usa ganchos tipo: "${profile.hooks[0]}" para maximizar el engagement.`,
        duration: `Mantén tus videos entre ${profile.ideal_duration} para optimizar la tasa de completado.`,
        cta: `El llamado a la acción más efectivo es: "${profile.cta}".`
    };

    return recommendations[category] || recommendations.content;
};

export const analyzePerformanceData = (data) => {
    // Simulación de análisis de datos de rendimiento
    const { retention, engagement, conversion } = data;

    if (retention < 40) return { risk: 'low_retention', suggestion: 'Acortar el gancho inicial' };
    if (engagement < 2) return { risk: 'low_engagement', suggestion: 'Pedir interacción directa (CTA)' };

    return { status: 'healthy', insight: 'Buen rendimiento sostenido' };
};
