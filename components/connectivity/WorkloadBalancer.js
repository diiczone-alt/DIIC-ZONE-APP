'use client';

/**
 * WORKLOAD BALANCER SYSTEM (WBS) - DIIC ZONE
 * Motor de asignación inteligente de tareas para balancear la carga del equipo.
 */

// Base de Datos de Talento (Se poblará desde Supabase)
export const TEAM_DB = [
    { id: 1, name: "Andrés V.", role: "Editor", load: 45, capacity: 40, reputation: 4.8, skills: ['Reels', 'Dinámico', 'Speedramp'] },
    { id: 2, name: "Carla M.", role: "Editor", load: 82, capacity: 40, reputation: 4.9, skills: ['Corporate', 'Clean', 'Color'] },
    { id: 3, name: "Mateo R.", role: "Editor", load: 30, capacity: 40, reputation: 4.2, skills: ['Field', 'Nature', 'Documentary'] },
    { id: 4, name: "Sofía G.", role: "Filmmaker", load: 55, capacity: 40, reputation: 4.7, skills: ['Cine', 'Docu', 'Lighting'] },
    { id: 5, name: "Jorge L.", role: "Web Dev", load: 15, capacity: 40, reputation: 4.5, skills: ['React', 'Landing', 'Supabase'] }
];

const WEIGHTS = {
    AVAILABILITY: 0.4, // Disponibilidad es lo más crítico para evitar burnout
    SKILL_MATCH: 0.3,  // El creativo debe saber hacer la tarea
    REPUTATION: 0.2,   // Premiar a los mejores
    CURRENT_LOAD: -0.1 // Penalización ligera si ya tiene carga (aunque tenga cupo)
};

export const calculateMatchScore = (candidate, task) => {
    // 1. Disponibilidad (0 a 100)
    const availabilityPercent = Math.max(0, (candidate.capacity - candidate.load) / candidate.capacity * 100);

    // 2. Skill Match (0 o 100) - Simplificado
    // Si el creativo tiene el tag principal de la tarea, 100 puntos.
    const skillMatch = candidate.skills.some(s => task.tags.includes(s)) ? 100 : 0;

    // 3. Reputación (0 a 100)
    const reputationScore = (candidate.reputation / 5) * 100;

    // 4. Carga Actual (Inverso: más carga = menos puntos)
    const loadPenalty = (candidate.load / candidate.capacity) * 100;

    // Fórmula Final
    let finalScore = (
        (availabilityPercent * WEIGHTS.AVAILABILITY) +
        (skillMatch * WEIGHTS.SKILL_MATCH) +
        (reputationScore * WEIGHTS.REPUTATION) -
        (loadPenalty * Math.abs(WEIGHTS.CURRENT_LOAD)) // Restamos penalización
    );

    // Ajuste: Si está saturado (>100%), score es 0
    if (candidate.load >= candidate.capacity) finalScore = 0;

    return Math.max(0, Math.round(finalScore));
};

export const assignTask = (task, teamMembers = TEAM_DB) => {
    // Filtrar candidatos por rol
    const candidates = teamMembers.filter(m => m.role === task.requiredRole);

    if (candidates.length === 0) return { assigned: null, reason: 'No candidates for role' };

    // Calcular Scores
    const rankedCandidates = candidates.map(candidate => {
        return {
            ...candidate,
            matchScore: calculateMatchScore(candidate, task)
        };
    }).sort((a, b) => b.matchScore - a.matchScore); // Ordenar por Score descendente

    const bestMatch = rankedCandidates[0];

    // Decisión
    if (bestMatch.matchScore > 0) {
        return {
            status: 'success',
            assignedTo: bestMatch,
            score: bestMatch.matchScore,
            candidates: rankedCandidates // Para mostrar ranking en UI
        };
    } else {
        return {
            status: 'failed',
            reason: 'Team Saturated',
            candidates: rankedCandidates
        };
    }
};
