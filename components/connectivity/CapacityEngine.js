'use client';

/**
 * CAPACITY ENGINE (TCS) - DIIC ZONE
 * Sistema de gestión de carga operativa y límites de producción.
 */

export const ROLE_CAPACITIES = {
    'Editor de Video': { limit: 40, unit: 'piezas', icon: 'Cpu' },
    'Diseñador Gráfico': { limit: 60, unit: 'artes', icon: 'LayoutGrid' },
    'Community Manager': { limit: 12, unit: 'clientes', icon: 'Users' }, // Ajustado de 10 a 12 según prompt original variaba, usaremos 12 como 'ideal' en código previo
    'Fotógrafo': { limit: 12, unit: 'sesiones', icon: 'Activity' },
    'Filmmaker': { limit: 10, unit: 'prods', icon: 'TrendingUp' }
};

const THRESHOLDS = {
    HEALTHY: 70, // 0-70%
    CAUTION: 90, // 70-90%
    LIMIT: 100,  // 90-100%
    SATURATED: 101 // >100%
};

export const calculateWorkload = (role, currentLoad) => {
    const config = ROLE_CAPACITIES[role];
    if (!config) return { percent: 0, status: 'unknown' };

    const percent = Math.round((currentLoad / config.limit) * 100);

    let status = 'healthy';
    let label = 'Flujo Saludable';
    let color = 'emerald';
    let action = 'Accepting';
    let recommendation = null;

    if (percent > 100) {
        status = 'saturated';
        label = 'Saturado (Bloqueo)';
        color = 'rose';
        action = 'Blocked';
        recommendation = `SUSPENDER ventas para ${role} inmediatamente. Evaluar contratación de urgencia.`;
    } else if (percent >= 90) {
        status = 'limit';
        label = 'Límite Crítico';
        color = 'red';
        action = 'Urgent';
        recommendation = `Derivar excedente de ${role} a Nodo Auxiliar. Activar recargo por urgencia.`;
    } else if (percent >= 70) {
        status = 'caution';
        label = 'Carga Alta';
        color = 'yellow';
        action = 'Warning';
        recommendation = `Monitorizar ${role}. Próximo a necesitar refuerzos freelance.`;
    }

    return {
        role,
        current: currentLoad,
        limit: config.limit,
        unit: config.unit,
        percent,
        status,
        label,
        color,
        action,
        recommendation
    };
};

export const getSystemDirectives = (currentStatusList) => {
    // Genera alertas globales basadas en el estado de todos los roles
    const alerts = [];

    currentStatusList.forEach(stat => {
        if (stat.status === 'saturated') {
            alerts.push({
                type: 'block',
                text: `${stat.role} ha excedido capacidad (${stat.percent}%). Bloqueo automático de nuevos proyectos activo.`
            });
        } else if (stat.status === 'limit') {
            alerts.push({
                type: 'critical',
                text: `${stat.role} al límite (${stat.percent}%). Se requiere derivación inmediata a nodos externos.`
            });
        } else if (stat.status === 'caution' && stat.percent > 80) {
            alerts.push({
                type: 'suggest',
                text: `${stat.role} acercándose a saturación. Preparar onboarding de talento junior.`
            });
        }
    });

    return alerts;
};
