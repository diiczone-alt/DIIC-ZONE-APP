/**
 * DIIC ZONE - Creative Reputation System V2 (Internal)
 * 
 * Calculates a 0-100 "Trust Score" based on operational metrics.
 * Not visible to clients. Level visible to creatives. Score visible only to Admin.
 */

export const REPUTATION_LEVELS = {
    NEW: { label: 'Nuevo / En Prueba', min: 0, max: 39, color: 'text-gray-400' },
    VALIDATED: { label: 'Validado', min: 40, max: 69, color: 'text-yellow-400' },
    RELIABLE: { label: 'Confiable', min: 70, max: 84, color: 'text-emerald-400' },
    ELITE: { label: 'Elite / Core', min: 85, max: 100, color: 'text-purple-400' },
};

export function calculateReputationScore(metrics) {
    const {
        onTimeDeliveryPct,      // Weight: 30%
        qualityApprovedPct,     // Weight: 25%
        reworkRatePct,          // Weight: 15% (Inverse)
        communicationScore,     // Weight: 15% (0-100)
        clientHistoryScore,     // Weight: 10% (0-100)
        systemComplianceScore   // Weight: 5% (0-100)
    } = metrics;

    // Inverse logic for rework: 0% rework = 100 points, 100% rework = 0 points
    const reworkScore = Math.max(0, 100 - reworkRatePct);

    let score =
        (onTimeDeliveryPct * 0.30) +
        (qualityApprovedPct * 0.25) +
        (reworkScore * 0.15) +
        (communicationScore * 0.15) +
        (clientHistoryScore * 0.10) +
        (systemComplianceScore * 0.05);

    return Math.round(score);
}

export function getReputationLevel(score) {
    if (score >= REPUTATION_LEVELS.ELITE.min) return REPUTATION_LEVELS.ELITE;
    if (score >= REPUTATION_LEVELS.RELIABLE.min) return REPUTATION_LEVELS.RELIABLE;
    if (score >= REPUTATION_LEVELS.VALIDATED.min) return REPUTATION_LEVELS.VALIDATED;
    return REPUTATION_LEVELS.NEW;
}

export function getTrustColor(score) {
    if (score >= 90) return 'bg-emerald-500'; // Green
    if (score >= 70) return 'bg-amber-500';   // Yellow
    return 'bg-red-500';                      // Red
}
