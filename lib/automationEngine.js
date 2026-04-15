import { supabase } from './supabase';

export const PLAN_CONFIGS = {
    nivel_1_presencia: {
        reels: 4,
        posts: 4,
        stories: 8,
        strategyType: 'Presencia Digital',
        nodes: [
            { type: 'reel_pro', count: 1, label: 'Video Promocional HQ' },
            { type: 'reel_viral', count: 4, label: 'Reel Informativo' },
            { type: 'educativo', count: 4, label: 'Post Carrusel' },
            { type: 'historia_interaccion', count: 8, label: 'Story Interacción' }
        ]
    },
    nivel_2_estrategia: {
        reels: 10,
        posts: 8,
        stories: 15,
        strategyType: 'Estrategia Captación',
        nodes: [
            { type: 'embudo_lead', count: 1, label: 'Setup Lead Magnet' },
            { type: 'reel_alcance', count: 8, label: 'Reel Estratégico' },
            { type: 'reel_tendencia', count: 2, label: 'Reel TikTok Style' },
            { type: 'carrusel_valor', count: 8, label: 'Post Captación' },
            { type: 'historia_venta', count: 15, label: 'Story Conversión' }
        ]
    },
    nivel_3_marca: {
        reels: 16,
        posts: 12,
        stories: 30,
        strategyType: 'Autoridad Elite',
        nodes: [
            { type: 'branding_premium', count: 1, label: 'Identidad Visual' },
            { type: 'reel_pro', count: 2, label: 'Promo HQ' },
            { type: 'reel_corporativo', count: 1, label: 'Video Storytelling' },
            { type: 'reel_autoridad', count: 12, label: 'Reels Autoridad' },
            { type: 'diseno_premium', count: 12, label: 'Pieza Gráfica Elite' },
            { type: 'historia_daily', count: 30, label: 'Cobertura Diaria' }
        ]
    },
    nivel_4_automatizacion: {
        reels: 20,
        posts: 20,
        stories: 60,
        strategyType: 'Ventas con IA',
        nodes: [
            { type: 'ia_bot', count: 1, label: 'Arquitectura IA Bot' },
            { type: 'crm_autom', count: 1, label: 'Integración CRM' },
            { type: 'meta_ads', count: 1, label: 'Media Buying Setup' },
            { type: 'reel_premium', count: 20, label: 'Contenido Omnichannel' },
            { type: 'diseno_ia', count: 20, label: 'Diseño Inteligente' },
            { type: 'historia_omni', count: 60, label: 'Omnipresencia' }
        ]
    }
};

/**
 * Assigns a plan to a client and generates persistent strategy nodes in Supabase.
 */
export async function assignPlanToClient(clientId, planId) {
    console.log(`[Automation] Assigning ${planId} to Client ${clientId}`);
    
    const config = PLAN_CONFIGS[planId];
    if (!config) throw new Error('Plan no reconocido');

    const nodesToInsert = [];

    // Generate Nodes
    config.nodes.forEach(nodeType => {
        for (let i = 0; i < nodeType.count; i++) {
            nodesToInsert.push({
                client_id: clientId,
                type: nodeType.type,
                label: `${nodeType.label} #${i + 1}`,
                status: 'draft',
                content_details: `Inyectado automáticamente por Motor DIIC via ${planId}`
            });
        }
    });

    // Save to Supabase
    const { data, error } = await supabase
        .from('strategy_nodes')
        .insert(nodesToInsert);

    if (error) {
        console.error('[Automation Error] Failed to inject nodes:', error);
        throw error;
    }

    return { nodes_count: nodesToInsert.length, data };
}
