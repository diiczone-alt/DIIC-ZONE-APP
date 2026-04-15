'use client';

/**
 * SMART ALERT ENGINE (SAI) - DIIC ZONE
 * Motor de detección de Riesgos y Oportunidades basado en telemetría de contenido.
 */

const RULES = {
    RISK: {
        INTERACTION_DROP: {
            threshold: 0.25, // 25% de caída
            msg: 'Tu audiencia está respondiendo menos.',
            recommendation: 'Se recomienda ajustar estrategia de contenido y probar un nuevo gancho visual.'
        },
        SILENCE: {
            days: 7,
            msg: 'Riesgo de pérdida de visibilidad.',
            recommendation: 'Publica un video de autoridad o una historia interactiva para reactivar el algoritmo.'
        },
        RETENTION_LOW: {
            threshold: 0.40, // < 40% retención
            msg: 'Tus videos actuales pierden atención antes de la mitad.',
            recommendation: 'Acorta la introducción y ve directo al valor en los primeros 3 segundos.'
        }
    },
    OPPORTUNITY: {
        VIRAL_TENDENCY: {
            engagement_rate: 0.15, // 15% rate
            msg: 'Este formato está funcionando excepcionalmente bien.',
            recommendation: 'Repite este estilo de contenido y considera escalar con una pequeña pauta inicial.'
        },
        SAVE_MAGNET: {
            save_ratio: 0.05, // 5% de saves sobre alcance
            msg: 'Este tipo de tema genera mucho interés de consulta.',
            recommendation: 'Crea una parte 2 de este contenido o conviértelo en un carrusel educativo.'
        },
        PEAK_INTERACTION: {
            msg: 'Buen momento para impulsar con pauta.',
            recommendation: 'Aprovecha el pulso orgánico para maximizar resultados con promoción pagada.'
        }
    }
};

export const analyzePerformance = (currentStats, history) => {
    const alerts = [];

    // 1. Detección de Caída de Interacción
    if (currentStats.interaction < (history.avgInteraction * (1 - RULES.RISK.INTERACTION_DROP.threshold))) {
        alerts.push({
            type: 'risk',
            severity: 'critical',
            title: '🚨 Alerta de Rendimiento',
            msg: RULES.RISK.INTERACTION_DROP.msg,
            recommendation: RULES.RISK.INTERACTION_DROP.recommendation
        });
    }

    // 2. Detección de Silencio Editorial
    if (currentStats.daysSinceLastPost >= RULES.RISK.SILENCE.days) {
        alerts.push({
            type: 'risk',
            severity: 'warning',
            title: '⚠️ Alerta de Frecuencia',
            msg: RULES.RISK.SILENCE.msg,
            recommendation: RULES.RISK.SILENCE.recommendation
        });
    }

    // 3. Detección de Oportunidad Viral
    if (currentStats.engagementRate > RULES.OPPORTUNITY.VIRAL_TENDENCY.engagement_rate) {
        alerts.push({
            type: 'opportunity',
            severity: 'success',
            title: '✨ Oportunidad de Crecimiento',
            msg: RULES.OPPORTUNITY.VIRAL_TENDENCY.msg,
            recommendation: RULES.OPPORTUNITY.VIRAL_TENDENCY.recommendation
        });
    }

    // 4. Detección de Guardados (Educativo)
    if (currentStats.saveRatio > RULES.OPPORTUNITY.SAVE_MAGNET.save_ratio) {
        alerts.push({
            type: 'opportunity',
            severity: 'success',
            title: '🧠 Insight Educativo',
            msg: RULES.OPPORTUNITY.SAVE_MAGNET.msg,
            recommendation: RULES.OPPORTUNITY.SAVE_MAGNET.recommendation
        });
    }

    return alerts;
};
