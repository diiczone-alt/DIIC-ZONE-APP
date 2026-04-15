'use client';

/**
 * AUTOMATED CLIENT SCALING SYSTEM (ACSS) - DIIC ZONE
 * Motor de detección de oportunidades de crecimiento.
 */

// Umbrales para detectar "Salto de Nivel"
const GROWTH_THRESHOLDS = {
    FOLLOWER_GROWTH_RATE: 0.15, // +15% seguidores recientes
    ENGAGEMENT_SPIKE: 0.20,     // +20% interacción
    LEAD_VOLUME: 100,           // >100 leads/semana
    SALES_ROI: 3.5              // ROI > 3.5x
};

export const LEVEL_DEFINITIONS = {
    1: { name: 'Inicio', maxLeads: 50 },
    2: { name: 'Crecimiento', maxLeads: 200 },
    3: { name: 'Expansión', maxLeads: 500 },
    4: { name: 'Autoridad', maxLeads: 1000 }
};

export const analyzeClientGrowth = (clientMetrics) => {
    // clientMetrics: { followers, followerGrowth, engagementRate, leadVolume, salesRoi, currentLevel }

    let upgradeScore = 0;
    const insights = [];

    // 1. Análisis de Audiencia
    if (clientMetrics.followerGrowth > GROWTH_THRESHOLDS.FOLLOWER_GROWTH_RATE) {
        upgradeScore += 30;
        insights.push({ type: 'audience', msg: `Crecimiento de audiencia acelerado (+${(clientMetrics.followerGrowth * 100).toFixed(0)}%)` });
    }

    // 2. Análisis de Interacción
    if (clientMetrics.engagementRate > 0.05) { // 5% engagement es alto
        upgradeScore += 25;
        insights.push({ type: 'engagement', msg: 'Alta tasa de interacción detectada' });
    }

    // 3. Volumen de Negocio (Leads)
    const currentMax = LEVEL_DEFINITIONS[clientMetrics.currentLevel]?.maxLeads || 50;
    if (clientMetrics.leadVolume > currentMax * 0.8) {
        upgradeScore += 40; // Muy importante: está llenando su cupo actual
        insights.push({ type: 'saturation', msg: `Al 80% de capacidad de leads del nivel actual` });
    }

    // 4. Rentabilidad
    if (clientMetrics.salesRoi > GROWTH_THRESHOLDS.SALES_ROI) {
        upgradeScore += 35;
        insights.push({ type: 'roi', msg: 'ROI excelente, presupuesto disponible para escalar' });
    }

    // Determinación de estado
    let status = 'stable';
    let recommendation = null;

    if (upgradeScore >= 80) {
        status = 'upgrade_ready';
        recommendation = {
            action: 'Proponer Nivel Siguiente',
            detail: `Cliente listo para Nivel ${clientMetrics.currentLevel + 1}`,
            urgency: 'high'
        };
    } else if (upgradeScore >= 50) {
        status = 'growing';
        recommendation = {
            action: 'Ofrecer Add-on',
            detail: 'Sugerir paquete de pauta o automatización',
            urgency: 'medium'
        };
    }

    return {
        score: upgradeScore,
        status,
        insights,
        recommendation
    };
};

export const detectUpsellOpportunities = (growthAnalysis) => {
    const opportunities = [];

    if (growthAnalysis.insights.some(i => i.type === 'saturation')) {
        opportunities.push({ service: 'CRM Avanzado', reason: 'Alto volumen de leads' });
        opportunities.push({ service: 'Appointment Setter', reason: 'Necesidad de gestión de agenda' });
    }

    if (growthAnalysis.insights.some(i => i.type === 'audience')) {
        opportunities.push({ service: 'Producción Premium', reason: 'Audiencia creciente exige mayor calidad' });
    }

    if (growthAnalysis.insights.some(i => i.type === 'roi')) {
        opportunities.push({ service: 'Escalado de Pauta (Ads)', reason: 'ROI validado, es seguro invertir más' });
    }

    return opportunities;
};
