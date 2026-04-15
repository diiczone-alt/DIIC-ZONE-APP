/**
 * Orchestration Service
 * The "Hands" that coordinate projects, tasks, and teams based on high-level commands.
 */

import { supabase } from '@/lib/supabase';
import { projectService } from './projectService'; // Reusing the lower-level CRUD
import { talentService } from './talentService';

class OrchestrationService {

    constructor() {
        // Mock Team Availability (Round Robin or Load Based in future)
        this.team = {
            design: ['Ana L.', 'Carlos D.'],
            video: ['Roberto G.', 'Sofia M.'],
            copy: ['Lucia T.'],
            automation: ['Bot Admin'],
            manager: ['Account Manager']
        };
    }

    /**
     * Main Entry Point: Turn an Intent into a Reality
     * @param {string} intentType - 'CAMPAIGN_SALES', 'CAMPAIGN_AUTHORITY', 'REPLICATE_CONTENT', 'EMERGENCY_SHOOT'
     * @param {Object} context - Extra details (content_id, budget, etc.)
     */
    async orchestrate(intentType, context) {
        console.log(`🎻 ORCHESTRATING: ${intentType}`, context);

        // 1. Determine Project Structure (Templates)
        const blueprint = this._getBlueprint(intentType, context);

        if (!blueprint) throw new Error(`No blueprint for intent: ${intentType}`);

        // 2. Create Project Skeleton
        const projectData = {
            name: blueprint.projectName,
            type: blueprint.type,
            department: blueprint.mainDepartment,
            description: blueprint.description,
            priority: blueprint.priority,
            start_date: new Date().toISOString(),
            end_date: this._calculateDeadline(blueprint.durationDays), // Auto-calc deadline
            user_id: context.userId // In real app, get from auth context
        };

        // Call ProjectService to create the DB entry
        // Note: projectService.createProject already handles basic insert. 
        // We will enhance it here by adding the SPECIFIC tasks from the blueprint.

        try {
            // Fake creating the project for now if no user_id, 
            // In real app this would call projectService.createProject(projectData)
            console.log('Creating Project Header:', projectData);

            // 3. Orchestrate Tasks (Assign & Schedule)
            const tasks = blueprint.tasks.map(taskTemplate => this._prepareTask(taskTemplate));

            console.log('Generated Tasks:', tasks);

            // In a real implementation:
            // const project = await projectService.createProject(projectData);
            // await projectService.createTasks(project.id, tasks);

            return {
                success: true,
                message: `Proyecto "${projectData.name}" orquestado con ${tasks.length} tareas.`,
                preview: { project: projectData, tasks }
            };

        } catch (error) {
            console.error('Orchestration Failed:', error);
            return { success: false, message: 'Fallo en orquestación.' };
        }
    }

    // --- TEMPLATES (The Logic) ---

    _getBlueprint(intentType, context) {
        const timestamp = new Date().toLocaleDateString();

        switch (intentType) {
            case 'CAMPAIGN_SALES':
                return {
                    projectName: `Campaña Ventas ${context.month || 'General'} - ${timestamp}`,
                    type: 'CAMPAIGN',
                    mainDepartment: 'account', // Account manager leads campaigns
                    description: 'Campaña completa de conversión de ventas.',
                    priority: 'HIGH',
                    durationDays: 14,
                    tasks: [
                        { role: 'copy', title: 'Concepto & Guiones (5 Variaciones)', effort: 2 },
                        { role: 'design', title: '6 Piezas Gráficas (Producto/Beneficio)', effort: 3 },
                        { role: 'video', title: '3 Reels (Gancho/CTA)', effort: 5 },
                        { role: 'automation', title: 'Configurar Píxel & Eventos', effort: 1 },
                        { role: 'manager', title: 'Revisión Final & Lanzamiento', effort: 1, dependency: 'ALL' }
                    ]
                };

            case 'CAMPAIGN_AUTHORITY':
                return {
                    projectName: `Campaña Autoridad - ${timestamp}`,
                    type: 'CAMPAIGN',
                    mainDepartment: 'video',
                    description: 'Posicionamiento de marca y confianza.',
                    priority: 'NORMAL',
                    durationDays: 21,
                    tasks: [
                        { role: 'copy', title: 'Guiones Educativos (Storytelling)', effort: 3 },
                        { role: 'video', title: '4 Reels Educativos (Edición Dinámica)', effort: 7 },
                        { role: 'design', title: '2 Carruseles de Valor', effort: 3 }
                    ]
                };

            case 'REPLICATE_CONTENT':
                return {
                    projectName: `Replicar Éxito: ${context.originalTitle || 'Contenido'}`,
                    type: 'VIDEO',
                    mainDepartment: 'video',
                    description: `Basado en el éxito de ${context.originalId}. Mantener formato, cambiar gancho.`,
                    priority: 'HIGH',
                    durationDays: 3,
                    tasks: [
                        { role: 'copy', title: 'Adaptar Guion (Mismo formato)', effort: 1 },
                        { role: 'video', title: 'Edición Express', effort: 2 }
                    ]
                };

            case 'EMERGENCY_SHOOT':
                return {
                    projectName: `Producción Express (Sequía)`,
                    type: 'SHOOT',
                    mainDepartment: 'filmmaker',
                    description: 'Generación de contenido rápida por baja frecuencia.',
                    priority: 'URGENT',
                    durationDays: 5,
                    tasks: [
                        { role: 'manager', title: 'Coordinar Agenda Cliente', effort: 1 },
                        { role: 'filmmaker', title: 'Rodaje Express (2h)', effort: 1 },
                        { role: 'video', title: 'Edición Rápida (3 piezas)', effort: 3 }
                    ]
                };

            default:
                return null;
        }
    }

    // --- SMART ENGINES ---

    _prepareTask(template) {
        // 1. Assign Person (Load Balancing Mock)
        const assignee = this._assignRole(template.role);

        // 2. Calculate Due Date based on effort & dependencies
        // (Simplified: Start today + effort days)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + template.effort);

        return {
            title: template.title,
            department: template.role, // Mapping role to department
            assigned_to: assignee,
            status: 'TODO',
            due_date: dueDate.toISOString(),
            description: `Generado automáticamente. Esfuerzo estimado: ${template.effort} días.`
        };
    }

    _assignRole(role) {
        const candidates = this.team[role] || this.team['manager'];
        // Pick random for now (Mock Smart Assignment)
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    _calculateDeadline(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString();
    }
}

export const orchestrationService = new OrchestrationService();
