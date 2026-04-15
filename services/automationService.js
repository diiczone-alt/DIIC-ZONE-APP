/**
 * Automation Intelligence Service
 * The "Brain" that detects patterns and suggests/executes actions.
 */

import { orchestrationService } from './orchestrationService';

class AutomationService {

    // Simulate analyzing data from multiple sources
    async analyzeSystemState() {
        // In a real scenario, this would fetch data from Meta, Supabase (CRM), Content API

        const insights = [
            this._checkHighPerformanceContent(),
            this._checkLowPerformanceAds(),
            this._checkLeadSpikes(),
            this._checkContentDrought(),
            this._checkSalesOpportunities()
        ];

        // Filter out nulls (no issues found)
        return insights.filter(i => i !== null);
    }

    // 🟢 CASE 1: HIGH PERFORMER CONTENT
    _checkHighPerformanceContent() {
        // Logic: Check recent posts with engagement > 20% above avg
        return {
            id: 'auto_01',
            type: 'OPPORTUNITY',
            icon: 'ROCKET', // 🚀
            title: 'Contenido Estrella Detectado',
            description: 'El Reel "Testimonio Cliente #2" tiene 45% más guardados que tu promedio. Es viral en potencia.',
            actions: [
                { label: 'Pautar este post ($10/día)', code: 'PROMOTE_POST', context: { id: 'post_123', platform: 'instagram' } },
                { label: 'Crear versión corta', code: 'REPLICATE_FORMAT', context: { type: 'video' } },
                { label: 'Ignorar', code: 'DISMISS', style: 'ghost' }
            ]
        };
    }

    // 🟢 CASE 2: LOW PERFORMANCE ADS
    _checkLowPerformanceAds() {
        // Logic: Check campaigns with CTR < 0.5% or Frequency > 3
        return {
            id: 'auto_02',
            type: 'WARNING',
            icon: 'ALERT', // ⚠️
            title: 'Alerta: "Ventas Urología" está cayendo',
            description: 'El costo por resultado subió 30% hoy. El creativo parece fatigado.',
            actions: [
                { label: 'Pausar Campaña', code: 'PAUSE_CAMPAIGN', context: { id: 'camp_55', platform: 'meta' }, style: 'danger' },
                { label: 'Solicitar Nuevo Diseño', code: 'REQUEST_CREATIVE', context: { type: 'design' } }
            ]
        };
    }

    // 🟢 CASE 3: LEAD SPIKE
    _checkLeadSpikes() {
        // Logic: Leads/hour > threshold
        return {
            id: 'auto_03',
            type: 'INFO',
            icon: 'FIRE', // 🔥
            title: '¡Pico de Tráfico Detectado!',
            description: 'Han entrado +12 leads en la última hora. El equipo podría saturarse.',
            actions: [
                { label: 'Activar Respuesta Rápida IA', code: 'ACTIVATE_FAST_MODE', context: { mode: 'fast_response' } },
                { label: 'Notificar Equipo de Ventas', code: 'NOTIFY_TEAM', context: { role: 'sales' } }
            ]
        };
    }

    // 🟢 CASE 4: CONTENT DROUGHT
    _checkContentDrought() {
        // Logic: Last post date > 3 days ago
        // Returning null to simulate mixed state (maybe they posted recently)
        // return null; 

        return {
            id: 'auto_04',
            type: 'WARNING',
            icon: 'CLOCK', // ⏰
            title: 'Baja Frecuencia de Contenido',
            description: 'Hace 3 días que no publicas nada nuevo. El algoritmo penalizará el alcance.',
            actions: [
                { label: 'Agendar Producción Express', code: 'SCHEDULE_SHOOT', context: { type: 'express' } },
                { label: 'Repostear Antigüo', code: 'REPOST_OLD', context: { id: 'post_99' } }
            ]
        };
    }

    // 🟢 CASE 5: SALES OPPORTUNITY
    _checkSalesOpportunities() {
        return {
            id: 'auto_05',
            type: 'OPPORTUNITY',
            icon: 'MONEY', // 💰
            title: 'Oportunidad de Cierre',
            description: 'Hay 5 clientes que visitaron el checkout 3 veces pero no compraron.',
            actions: [
                { label: 'Enviar Descuento Flash (WhatsApp)', code: 'SEND_DISCOUNT', context: { amount: '10%' } },
                { label: 'Asignar a Vendedor', code: 'ASSIGN_LEAD', context: { role: 'closer' } }
            ]
        };
    }

    // --- EXECUTION ENGINE ---

    async executeAction(actionCode, context) {
        console.log(`⚡ EXECUTING AUTOMATION: ${actionCode}`, context);

        // Simulation of delay execution
        await new Promise(resolve => setTimeout(resolve, 1500));

        switch (actionCode) {
            case 'PROMOTE_POST':
                return { success: true, message: 'Campaña de Boost creada en borrador.' };
            case 'PAUSE_CAMPAIGN':
                return { success: true, message: 'Campaña pausada correctamente.' };
            case 'ACTIVATE_FAST_MODE':
                return { success: true, message: 'Chatbot en modo "Respuesta Inmediata" activado.' };
            case 'REQUEST_CREATIVE':
                // Orchestrate a Design Task
                await orchestrationService.orchestrate('CAMPAIGN_SALES', { ...context, note: 'Optimización Creativa' });
                return { success: true, message: 'Solicitud de diseño enviada al equipo.' };

            // --- NEW ORCHESTRATION LINKS ---
            case 'REPLICATE_FORMAT':
                await orchestrationService.orchestrate('REPLICATE_CONTENT', { originalId: context.id });
                return { success: true, message: 'Proyecto de replicación creado y asignado.' };

            case 'SCHEDULE_SHOOT':
                await orchestrationService.orchestrate('EMERGENCY_SHOOT', {});
                return { success: true, message: 'Producción Express agendada. Equipo notificado.' };

            default:
                return { success: true, message: 'Acción ejecutada.' };
        }
    }
}

export const automationService = new AutomationService();
