'use client';

/**
 * QUALITY CONTROL SYSTEM (QCS) - DIIC ZONE
 * Motor de cálculo de calidad y detección de riesgos.
 */

// Pesos para la fórmula de calidad
const WEIGHTS = {
    ON_TIME: 40,        // Cumplimiento de plazos (+ importante)
    QUICK_APPROVAL: 40, // Eficiencia en la primera entrega (= calidad)
    ADJUSTMENTS: -10,   // Penalización por cada ronda de ajustes extra
    DELAY: -20          // Penalización fuerte por retraso
};

export const QUALITY_THRESHOLDS = {
    EXCELLENCE: 90, // Calidad Premium
    GOOD: 70,       // Estándar aceptable
    RISK: 50,       // Riesgo de insatisfacción
    CRITICAL: 30    // Intervención inmediata
};

export const calculateQualityIndex = (metrics) => {
    // metrics: { onTimeDeliveries, totalProjects, quickApprovals, totalAdjustments, delays }

    // Normalizar métricas a base 100 aproximada
    const onTimeScore = (metrics.onTimeDeliveries / metrics.totalProjects) * WEIGHTS.ON_TIME; // Max 40

    // Quick Approval Ratio (Proyectos aprobados en < 2 revisiones)
    const approvalRatio = (metrics.quickApprovals / metrics.totalProjects) * WEIGHTS.QUICK_APPROVAL; // Max 40

    // Ajustes promedio (si > 2 ajustes por proyecto, penaliza)
    const avgAdjustments = metrics.totalAdjustments / metrics.totalProjects;
    const adjustmentPenalty = Math.max(0, (avgAdjustments - 1.5)) * Math.abs(WEIGHTS.ADJUSTMENTS); // Penaliza si > 1.5 ajustes promedio

    // Retrasos
    const delayPenalty = metrics.delays * Math.abs(WEIGHTS.DELAY);

    // Fórmula Final (Base 20 puntos "de gracia" + méritos - deméritos)
    let iq = 20 + onTimeScore + approvalRatio - adjustmentPenalty - delayPenalty;

    // Cap 0-100
    iq = Math.min(Math.max(Math.round(iq), 0), 100);

    let status = 'risk';
    if (iq >= QUALITY_THRESHOLDS.EXCELLENCE) status = 'excellence';
    else if (iq >= QUALITY_THRESHOLDS.GOOD) status = 'good';
    else if (iq < QUALITY_THRESHOLDS.CRITICAL) status = 'critical';

    return {
        iq,
        status,
        details: {
            onTimeScore,
            approvalRatio,
            adjustmentPenalty,
            delayPenalty
        }
    };
};

export const analyzeProjectRisk = (project) => {
    // Análisis en tiempo real de un proyecto individual
    const risks = [];

    // Regla 1: Exceso de revisiones
    if (project.revisions >= 3) {
        risks.push({ id: 'adjustments', level: 'high', msg: 'Exceso de revisiones (>3)' });
    } else if (project.revisions > 1) {
        risks.push({ id: 'adjustments', level: 'low', msg: 'Revisiones activas' });
    }

    // Regla 2: Retraso explícito (asumiendo bandera status)
    if (project.status === 'delayed') {
        risks.push({ id: 'delay', level: 'critical', msg: 'Retraso activo en entrega' });
    }

    // Regla 3: Sentimiento del feedback
    if (project.feedbackSentiment === 'negative') {
        risks.push({ id: 'sentiment', level: 'high', msg: 'Feedback negativo del cliente' });
    }

    // Calcular nivel de riesgo global para el proyecto
    let riskLevel = 'low';
    if (risks.some(r => r.level === 'critical')) riskLevel = 'critical';
    else if (risks.some(r => r.level === 'high')) riskLevel = 'high';

    return {
        riskLevel,
        activators: risks
    };
};
