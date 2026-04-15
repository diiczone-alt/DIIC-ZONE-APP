'use client';

/**
 * AI RECOMMENDATION ENGINE - DIIC ZONE
 * Motor para sugerir decisiones estratégicas basadas en datos.
 */

const STRATEGIC_PATTERNS = {
    medico: {
        focus: 'Autoridad & Confianza',
        insight: 'Los videos educativos que resuelven una duda común en los primeros 5s tienen mayor retención.',
        suggestedCTA: '📩 Agenda una Consulta / Guarda para después',
        structures: ['Problema -> Solución -> Proof -> CTA']
    },
    restaurante: {
        focus: 'Antojo Visual & Experiencia',
        insight: 'Ganchos ASMR o primeros planos extremos de comida aumentan el share rate en un 35%.',
        suggestedCTA: '📍 Visítanos hoy / Etiqueta a alguien',
        structures: ['Hook Visual -> Proceso -> Plato Final -> CTA']
    },
    gym: {
        focus: 'Motivación & Resultados',
        insight: 'Los tutoriales de "técnica correcta" generan más saves que los videos de solo rutina.',
        suggestedCTA: '💪 Únete al reto / Envía a tu gym bro',
        structures: ['Error Común -> Corrección -> Beneficio -> CTA']
    },
    otro: {
        focus: 'Engagement General',
        insight: 'Los formatos de "Listas" (Top 3 tips) son los más compartidos actualmente.',
        suggestedCTA: '🚀 Síguenos para más',
        structures: ['Categoría -> Tip 1 -> Tip 2 -> Tip 3 -> CTA']
    }
};

export const getSmartStrategy = (contentData) => {
    const { niche, format, duration } = contentData;

    const pattern = STRATEGIC_PATTERNS[niche.toLowerCase()] || STRATEGIC_PATTERNS.otro;

    const suggestions = [...(pattern.insight ? [pattern.insight] : [])];

    // Sugerencias tácticas según formato y duración
    if (format === 'Reel' && duration > 30) {
        suggestions.push('Optimiza el ritmo: Los Reels de <25s están promediando mayor VTR en tu sector.');
    }

    if (format === 'Reel') {
        suggestions.push('Asegúrate de incluir texto dinámico para captar atención sin sonido.');
    }

    return {
        focus: pattern.focus,
        insight: pattern.insight,
        suggestedCTA: pattern.suggestedCTA,
        structure: pattern.structures[0],
        suggestions,
        bestTime: "6:30 PM - 8:30 PM",
        confidence: 92
    };
};
