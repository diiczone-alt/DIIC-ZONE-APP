import { supabase } from '../supabase';

/**
 * DeliverablesProvider
 * Automates the generation and synchronization of client tasks based on their assigned plans.
 */
export const DeliverablesProvider = {
    
    /**
     * Standard deliverable templates based on plan type
     */
    PLAN_TEMPLATES: {
        'Elite': [
            { title: 'Estrategia Mensual de Contenidos', format: 'PDF/Docs', assigned_role: 'cm' },
            { title: 'Edición: Reel Pro Principal #1', format: 'Video 9:16', assigned_role: 'editor' },
            { title: 'Edición: Reel Pro Principal #2', format: 'Video 9:16', assigned_role: 'editor' },
            { title: 'Diseño: Carrusel de Autoridad #1', format: 'Carousel', assigned_role: 'designer' },
            { title: 'Diseño: Set de Stories Interactivos', format: 'Image', assigned_role: 'designer' },
            { title: 'Video: Testimonios de Clientes', format: 'Video 9:16', assigned_role: 'editor' },
            { title: 'Reporte de Métricas & ROI', format: 'Dashboard', assigned_role: 'cm' }
        ],
        'Pro': [
            { title: 'Estrategia de Contenidos Pro', format: 'PDF/Docs', assigned_role: 'cm' },
            { title: 'Edición: Reel Pro #1', format: 'Video 9:16', assigned_role: 'editor' },
            { title: 'Diseño: Grilla Mensual (Set)', format: 'Image', assigned_role: 'designer' },
            { title: 'Reporte de Rendimiento', format: 'PDF', assigned_role: 'cm' }
        ],
        'Presencia': [
            { title: 'Configuración de Marca (Identidad)', format: 'Image', assigned_role: 'designer' },
            { title: 'Video: Intro de Servicio', format: 'Video 9:16', assigned_role: 'editor' },
            { title: 'Guía de Publicación', format: 'PDF', assigned_role: 'cm' }
        ]
    },

    /**
     * Synchronizes a client's tasks with their assigned plan.
     * If no tasks exist, it populates them with the template.
     */
    async syncClientTasks(clientId) {
        try {
            // 1. Fetch Client Plan
            const { data: client, error: clientErr } = await supabase
                .from('clients')
                .select('*')
                .eq('id', clientId)
                .single();

            if (clientErr || !client) throw new Error('Cliente no encontrado');

            // 2. Determine simplified plan key
            let planKey = 'Presencia';
            if (client.plan.includes('Elite')) planKey = 'Elite';
            else if (client.plan.includes('Pro')) planKey = 'Pro';

            // 3. Check existing tasks
            const { data: existingTasks, error: taskErr } = await supabase
                .from('tasks')
                .select('id')
                .eq('client', clientId);

            if (taskErr) throw taskErr;

            // 4. If no tasks, create from template
            if (!existingTasks || existingTasks.length === 0) {
                console.log(`[Deliverables] Generating initial tasks for ${client.name} (Plan: ${planKey})`);
                
                const template = this.PLAN_TEMPLATES[planKey];
                const tasksToInsert = template.map(t => ({
                    client: clientId,
                    title: t.title,
                    format: t.format,
                    assigned_role: t.assigned_role,
                    status: 'pending',
                    objective: `Cumplir con los entregables del Plan ${planKey}`,
                    duration: 'N/A',
                    structure: 'Basado en estrategia DIIC',
                    notes: 'Tarea generada automáticamente por el sistema de sincronización.',
                    assets: []
                }));

                const { error: insertErr } = await supabase
                    .from('tasks')
                    .insert(tasksToInsert);

                if (insertErr) throw insertErr;
                return { success: true, count: tasksToInsert.length };
            }

            return { success: true, count: 0, message: 'Tareas ya existen' };

        } catch (err) {
            console.error('[Deliverables Error]', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Runs a global sync check for all clients
     */
    async syncAllClients() {
        const { data: clients } = await supabase.from('clients').select('id');
        if (!clients) return;

        const results = await Promise.all(
            clients.map(c => this.syncClientTasks(c.id))
        );
        return results;
    }
};
