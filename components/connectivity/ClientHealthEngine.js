'use client';

/**
 * CLIENT HEALTH ENGINE - DIIC ZONE
 * Business logic to calculate the real-time health of a client relationship.
 * 🟢 GREEN: Growth & Satisfaction (Score >= 80)
 * 🟡 YELLOW: Warning/Stagnation (Score 50-79)
 * 🔴 RED: Critical Risk/Intervention (Score < 50)
 */

export const calculateClientHealth = (data) => {
    const {
        activity = 100,      // 0-100: Publication frequency
        metaCompletion = 100, // 0-100: Progress on level milestones
        roi = 100,           // 0-100: Performance return
        toolUsage = 100,     // 0-100: App interaction
        approvals = 100,     // 0-100: Speed of approval
        payments = 100       // 0-100: On-time payments
    } = data;

    // Weights defined in the requirement
    const weights = {
        activity: 0.20,
        metaCompletion: 0.20,
        roi: 0.15,
        toolUsage: 0.10,
        approvals: 0.10,
        payments: 0.25 // Critical factor
    };

    const score = (
        (activity * weights.activity) +
        (metaCompletion * weights.metaCompletion) +
        (roi * weights.roi) +
        (toolUsage * weights.toolUsage) +
        (approvals * weights.approvals) +
        (payments * weights.payments)
    );

    let status = 'green';
    let label = 'Crecimiento';
    let iconColor = 'text-emerald-500';
    let bgColor = 'bg-emerald-500/10';
    let borderColor = 'border-emerald-500/20';

    if (score < 50) {
        status = 'red';
        label = 'Crítico';
        iconColor = 'text-red-500';
        bgColor = 'bg-red-500/10';
        borderColor = 'border-red-500/20';
    } else if (score < 80) {
        status = 'yellow';
        label = 'Riesgo';
        iconColor = 'text-yellow-500';
        bgColor = 'bg-yellow-500/10';
        borderColor = 'border-yellow-500/20';
    }

    return {
        score: Math.round(score),
        status,
        label,
        styles: {
            icon: iconColor,
            bg: bgColor,
            border: borderColor
        },
        recommendation: getStrategicRecommendation(status)
    };
};

const getStrategicRecommendation = (status) => {
    switch (status) {
        case 'green':
            return {
                msg: "Este cliente está creciendo correctamente.",
                action: "Ofrecer Servicio Premium",
                btnColor: "bg-emerald-500"
            };
        case 'yellow':
            return {
                msg: "Este cliente muestra señales de estancamiento.",
                action: "Activar Seguimiento",
                btnColor: "bg-yellow-500"
            };
        case 'red':
            return {
                msg: "Intervención inmediata requerida.",
                action: "Activar Rescate",
                btnColor: "bg-red-500"
            };
        default:
            return null;
    }
};
