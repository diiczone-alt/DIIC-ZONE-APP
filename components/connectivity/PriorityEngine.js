'use client';

/**
 * PRIORITY ENGINE (APS) - DIIC ZONE
 * Sistema de cálculo de prioridad para ordenamiento automático de tareas.
 */

const WEIGHTS = {
    PLAN: 3,         // Base más fuerte: El plan contratado
    URGENCY: 2.5,    // Multiplicador crítico: Fecha de entrega
    IMPACT: 2,       // Importancia estratégica: Lanzamiento vs Regular
    LEVEL: 1,        // Madurez del cliente (Growth phase)
    HISTORY: 1.5     // Comportamiento de pago y fidelidad
};

const SCORES = {
    PLAN: {
        'Master': 10,
        'Pro+': 8,
        'Pro': 6,
        'Basic': 3
    },
    URGENCY: {
        'Critical': 10, // < 24h
        'High': 7,      // < 3 días
        'Medium': 4,    // < 1 semana
        'Low': 1        // > 1 semana
    },
    IMPACT: {
        'Launch': 10,   // Nuevo producto/servicio
        'Campaign': 7,  // Campaña estacional
        'Regular': 3    // Contenido de mantenimiento
    },
    LEVEL: {
        'Scale': 5,     // Fase de escalado
        'Growth': 3,
        'Start': 1
    },
    HISTORY: {
        'VIP': 10,      // Pagos anticipados / Larga duración
        'Good': 5,
        'New': 3,
        'Late': -5      // Penalización por morosidad
    }
};

export const calculatePriorityScore = (clientData) => {
    // 1. Calcular Puntos Brutos
    const pPlan = (SCORES.PLAN[clientData.plan] || 0) * WEIGHTS.PLAN;
    const pUrgency = (SCORES.URGENCY[clientData.urgencyFormatted] || 0) * WEIGHTS.URGENCY;
    const pImpact = (SCORES.IMPACT[clientData.impact] || 0) * WEIGHTS.IMPACT;
    const pLevel = (SCORES.LEVEL[clientData.growth] || 0) * WEIGHTS.LEVEL;
    const pHistory = (SCORES.HISTORY[clientData.history] || 0) * WEIGHTS.HISTORY;

    // 2. Suma Total (Max teórico aprox: 30+25+20+5+15 = 95 -> normalizado a 100 con bonos)
    let totalScore = pPlan + pUrgency + pImpact + pLevel + pHistory;

    // 3. Normalizar y Cap (0-100)
    totalScore = Math.min(Math.max(Math.round(totalScore), 0), 100);

    // 4. Determinar Nivel
    let priorityLevel = 'low';
    if (totalScore >= 90) priorityLevel = 'critical';
    else if (totalScore >= 70) priorityLevel = 'high';
    else if (totalScore >= 40) priorityLevel = 'medium';

    return {
        score: totalScore,
        level: priorityLevel,
        breakdown: {
            plan: pPlan,
            urgency: pUrgency,
            impact: pImpact,
            level: pLevel,
            history: pHistory
        }
    };
};

export const getPriorityLabel = (level) => {
    switch (level) {
        case 'critical': return 'Crítica';
        case 'high': return 'Alta';
        case 'medium': return 'Media';
        case 'low': return 'Baja';
        default: return 'Normal';
    }
};
