/**
 * DIIC ZONE - Client Prioritization System
 * 
 * Calculates a priority score (P1-P5) to determine service order.
 * 100% Internal. Clients do not see this.
 */

export const PRIORITY_LEVELS = {
    P1: { label: 'Estratégico (P1)', color: 'bg-red-500', textColor: 'text-red-500', description: 'Atención Inmediata' },
    P2: { label: 'Prioritario (P2)', color: 'bg-orange-500', textColor: 'text-orange-500', description: 'Alta Importancia' },
    P3: { label: 'Normal (P3)', color: 'bg-yellow-500', textColor: 'text-yellow-500', description: 'Flujo Estándar' },
    P4: { label: 'Bajo (P4)', color: 'bg-blue-500', textColor: 'text-blue-500', description: 'En Cola' },
    P5: { label: 'Free (P5)', color: 'bg-gray-500', textColor: 'text-gray-500', description: 'Sin Prioridad' },
};

export function calculateClientPriority(clientData) {
    let score = 0;

    // 1. Plan Tier (Base Score) - Weight 30% approx
    switch (clientData.plan) {
        case 'CORPORATE': score += 40; break;
        case 'PREMIUM': score += 30; break;
        case 'PRO': score += 20; break;
        case 'BASIC': score += 10; break;
        default: score += 0;
    }

    // 2. Monthly Spend - Weight 20% approx
    if (clientData.monthlySpend > 5000) score += 25;
    else if (clientData.monthlySpend > 2000) score += 15;
    else if (clientData.monthlySpend > 500) score += 5;

    // 3. Payment History - Weight 15%
    if (clientData.alwaysPaysOnTime) score += 15;
    if (clientData.hasPaymentIssues) score -= 20;

    // 4. Urgency/Impact - Weight 25% (Contextual)
    if (clientData.isStrategicPartner) score += 15;
    if (clientData.recentUrgencies > 0) score += 5;

    // Determine Level based on Score (0-100)
    if (score >= 85) return 'P1';
    if (score >= 65) return 'P2';
    if (score >= 40) return 'P3';
    if (score >= 20) return 'P4';
    return 'P5';
}

export function getPriorityBadgeColor(level) {
    return PRIORITY_LEVELS[level]?.color || 'bg-gray-500';
}
