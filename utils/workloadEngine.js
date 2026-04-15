/**
 * DIIC ZONE - Workload & Capacity Prediction Engine
 * 
 * Uses "Carga de Producción" (CP) units to measure real effort.
 */

// CP DEFINITIONS (Configurable)
export const CP_VALUES = {
    VIDEO: {
        REEL_SIMPLE: 1,
        REEL_COMPLEX: 2,
        YOUTUBE_STD: 3,
        CORP_VIDEO: 5,
        DOCU_SHORT: 8
    },
    DESIGN: {
        POST_SIMPLE: 0.5,
        CAROUSEL: 1.5,
        BRANDING_BASIC: 5,
        WEB_DESIGN: 10
    },
    DEV: {
        LANDING_PAGE: 5,
        WEB_APP_FEATURE: 8,
        BUG_FIX: 1
    }
};

// DEPARTMENT CAPACITIES (Weekly CP Max)
const DEPT_CAPACITY = {
    VIDEO: 100, // e.g., 20 Reels + 10 YouTube + 4 Corp
    DESIGN: 120,
    WEB: 40,
    MARKETING: 80
};

export function calculateDepartmentLoad(activeProjects, department) {
    let currentCP = 0;

    activeProjects.forEach(project => {
        // Mock logic to sum CP based on type
        // in real app, project.type would map to CP_VALUES
        currentCP += (project.cp_estimate || 1);
    });

    const maxCP = DEPT_CAPACITY[department] || 100;
    const percentage = Math.round((currentCP / maxCP) * 100);

    let status = 'FLUID';
    if (percentage >= 90) status = 'SATURATED';
    else if (percentage >= 70) status = 'TIGHT';

    return {
        currentCP,
        maxCP,
        percentage,
        status, // FLUID (Green), TIGHT (Yellow), SATURATED (Orange), CRITICAL (Blue - Strategic Only)
    };
}

export function getLoadStatusColor(status) {
    switch (status) {
        case 'FLUID': return 'text-emerald-400';
        case 'TIGHT': return 'text-amber-400';
        case 'SATURATED': return 'text-orange-500';
        case 'CRITICAL': return 'text-blue-400'; // Only Premium enters here
        default: return 'text-gray-400';
    }
}
