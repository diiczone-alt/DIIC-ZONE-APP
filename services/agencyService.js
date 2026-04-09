import { supabase } from '@/lib/supabase';
import { MOCK_DATA } from '@/lib/mockData';

export const agencyService = {
    // --- CLIENTS ---
    getClients: async () => {
        try {
            // Check local storage first for interactive sync
            const localRaw = localStorage.getItem('diic_clients');
            if (localRaw) {
                return JSON.parse(localRaw);
            }

            const { data, error } = await supabase.from('clients').select('*');
            if (error) throw error;

            console.log("Loading clients from Supabase/MockData", data?.length);
            const finalData = data?.length > 0 ? data : MOCK_DATA.clients;
            
            // Sync to local storage
            localStorage.setItem('diic_clients', JSON.stringify(finalData));
            return finalData;
        } catch (error) {
            console.error("Error fetching clients:", error);
            return MOCK_DATA.clients;
        }
    },
    createClient: async (clientData) => {
        console.log("Creating New Client:", clientData);
        try {
            const newId = Math.floor(Math.random() * 900000) + 100000; // Generate numeric-like ID for consistency
            const newClient = {
                ...clientData,
                id: newId,
                status: 'active',
                created_at: new Date().toISOString()
            };

            // 1. Supabase insert
            const { data, error } = await supabase.from('clients').insert([newClient]).select();
            if (error) console.warn("Supabase insert error (likely mock env):", error.message);

            // 2. Critical: Sync LocalStorage
            const localRaw = localStorage.getItem('diic_clients');
            const clients = localRaw ? JSON.parse(localRaw) : MOCK_DATA.clients;
            const updatedClients = [newClient, ...clients];
            localStorage.setItem('diic_clients', JSON.stringify(updatedClients));
            
            console.log("Client Created Successfully", newId);
            return newClient;
        } catch (error) {
            console.error("Error in createClient service:", error);
            throw error;
        }
    },

    updateClient: async (id, updates) => {
        console.log("Updating Client:", id, updates);
        try {
            // Update in Supabase
            await supabase.from('clients').update(updates).eq('id', id);
            
            // Critical: Sync with localStorage for demo/interactivity
            const localRaw = localStorage.getItem('diic_clients');
            let existingArray = localRaw ? JSON.parse(localRaw) : MOCK_DATA.clients;
            
            const index = existingArray.findIndex(c => c.id.toString() === id.toString());
            if (index !== -1) {
                existingArray[index] = { ...existingArray[index], ...updates };
                localStorage.setItem('diic_clients', JSON.stringify(existingArray));
                console.log("LocalStorage Sync Success for Client", id);
            }
        } catch (error) {
            console.error("Error updating client:", error);
        }
    },

    getClientById: (id) => {
        if (!id) return null;
        const localRaw = localStorage.getItem('diic_clients');
        const clients = localRaw ? JSON.parse(localRaw) : MOCK_DATA.clients;
        return clients.find(c => c.id.toString() === id.toString()) || null;
    },

    deleteClient: async (id) => {
        try {
            await supabase.from('clients').delete().eq('id', id);
            
            const localRaw = localStorage.getItem('diic_clients');
            if (localRaw) {
                const clients = JSON.parse(localRaw);
                const updated = clients.filter(c => c.id.toString() !== id.toString());
                localStorage.setItem('diic_clients', JSON.stringify(updated));
            }
        } catch (error) {
            console.error("Error deleting client:", error);
        }
    },

    // --- OTHER SERVICES ---
    getTasks: async (role = 'all') => {
        try {
            // Priority: Local Storage (where interactive updates happen)
            const localTasks = localStorage.getItem('diic_tasks');
            if (localTasks) {
                const tasks = JSON.parse(localTasks);
                if (role === 'all') return tasks;
                return tasks.filter(t => t.assigned_role === role.toUpperCase());
            }

            const { data, error } = await supabase.from('tasks').select('*');
            if (error) throw error;
            
            const finalTasks = data?.length > 0 ? data : MOCK_DATA.tasks;
            localStorage.setItem('diic_tasks', JSON.stringify(finalTasks));

            if (role === 'all') return finalTasks;
            return finalTasks.filter(t => t.assigned_role === role.toUpperCase());
        } catch (error) {
            console.error("Error fetching tasks:", error);
            return MOCK_DATA.tasks;
        }
    },

    getSuggestedAssignee: async (taskTitle, assignedRole, clientCity) => {
        const team = await agencyService.getTeam();
        
        // 1. Role mapping
        const roleMap = {
            'editor': 'Editor de Video',
            'design': 'Diseñador',
            'community': 'Community Manager',
            'filmmaker': 'Filmmaker'
        };
        const targetRole = roleMap[assignedRole?.toLowerCase()] || assignedRole;

        // Step 1: Filter by Role
        let eligible = team.filter(m => m.role === targetRole);
        
        // Step 2 & 3: Filter by City and Status (Not busy)
        let localOptions = eligible.filter(m => 
            m.city?.toLowerCase() === clientCity?.toLowerCase() && 
            m.status !== 'ocupado'
        );

        // Step 4: Pick lowest load
        if (localOptions.length > 0) {
            const suggested = localOptions.sort((a, b) => (a.activeTasks || 0) - (b.activeTasks || 0))[0];
            return { ...suggested, assignmentType: 'local' };
        }

        // Fallback: Global search (any city, not busy, lowest load)
        let globalOptions = eligible.filter(m => m.status !== 'ocupado');
        if (globalOptions.length > 0) {
            const suggested = globalOptions.sort((a, b) => (a.activeTasks || 0) - (b.activeTasks || 0))[0];
            return { ...suggested, assignmentType: 'global' };
        }

        return null; // All busy or no match
    },

    createTask: async (task) => {
        try {
            // Intelligent Assignment Trigger
            let finalAssignee = task.assigned_to;
            let assignmentLog = '';
            
            if (!finalAssignee) {
                const suggestion = await agencyService.getSuggestedAssignee(task.title, task.assigned_role, task.city);
                if (suggestion) {
                    finalAssignee = suggestion.name;
                    assignmentLog = suggestion.assignmentType === 'local' ? 'Ubicación Proximidad' : 'Balance Global';
                }
            }

            // Logistics Identification
            const isProduction = task.title?.toLowerCase().includes('rodaje') || 
                               task.title?.toLowerCase().includes('grabación') || 
                               task.assigned_role === 'filmmaker';
            
            const newTask = {
                ...task,
                id: `T-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
                assigned_to: finalAssignee,
                assignment_reason: assignmentLog,
                tags: isProduction ? [...(task.tags || []), 'Requiere Logística'] : task.tags || [],
                created_at: new Date().toISOString()
            };

            // Save to Local Storage first for immediate UI update
            const localTasks = localStorage.getItem('diic_tasks');
            const tasks = localTasks ? JSON.parse(localTasks) : MOCK_DATA.tasks;
            const updatedTasks = [newTask, ...tasks];
            localStorage.setItem('diic_tasks', JSON.stringify(updatedTasks));

            // Sync with Supabase
            const { data, error } = await supabase.from('tasks').insert([newTask]);
            if (error) console.warn("Supabase Sync skipped (Mock Envir):", error.message);
            
            return newTask;
        } catch (error) {
            console.error("Error creating task:", error);
            throw error;
        }
    },

    getStrategySummary: async (clientId) => {
        // Mock data logic for Strategy Preview
        const strategies = {
            '1': { title: 'Estrategia Q4 - Expansión Regional', focus: 'Nova Clínica Santa Anita busca posicionarse como referente en cirugías de alta complejidad en la zona sur.', nodos: 12, completed: 5, lastUpdate: 'Hoy, 10:45 AM', cmNotes: 'Leslie ha optimizado los nodos de conversión para el área de traumatología.' },
            '2': { title: 'Lanzamiento Personal Brand', focus: 'Posicionamiento del Dr. Patiño como líder de opinión en medicina estética.', nodos: 8, completed: 3, lastUpdate: 'Ayer, 4:20 PM', cmNotes: 'Andrea está coordinando la sesión de fotos para la nueva campaña de reels.' },
            '3': { title: 'Dra. Jessica Reyes - Dental Pro', focus: 'Campaña de fidelización y preventivos dentales para familias.', nodos: 10, completed: 7, lastUpdate: 'Hace 2h', cmNotes: 'Implementando el nuevo flujo de citas por WhatsApp.' },
            '4': { title: 'Agropecuarios - Scale Up', focus: 'Digitalización del catálogo de implementos agrícolas y ventas B2B.', nodos: 15, completed: 4, lastUpdate: 'Hace 15m', cmNotes: 'Jimmy cargó los nuevos assets para la sección de tractores.' },
            '5': { title: 'Podcast - Entre Panas y Parcelas', focus: 'Estrategia de crecimiento orgánico masivo vía clips virales.', nodos: 20, completed: 12, lastUpdate: 'En vivo', cmNotes: 'El último clip alcanzó 2.4k visualizaciones en 1 hora.' }
        };
        return strategies[clientId.toString()] || { title: 'Plan Estratégico General', focus: 'Optimización de canales digitales y presencia de marca.', nodos: 10, completed: 0, lastUpdate: 'Sin actividad', cmNotes: 'Pendiente de inicio por el CM asignado.' };
    },

    // --- PRODUCTION & RATES ---
    getProductionRates: () => {
        return MOCK_DATA.production_rates;
    },

    getTeam: async () => {
        const localTeam = localStorage.getItem('diic_team');
        if (localTeam) return JSON.parse(localTeam);
        localStorage.setItem('diic_team', JSON.stringify(MOCK_DATA.team));
        return MOCK_DATA.team;
    },

    getClients: async () => {
        const localClients = localStorage.getItem('diic_clients');
        if (localClients) return JSON.parse(localClients);
        localStorage.setItem('diic_clients', JSON.stringify(MOCK_DATA.clients));
        return MOCK_DATA.clients;
    },

    registerUser: async (data, type) => {
        try {
            if (type === 'creative') {
                const roleCode = (data.roles?.[0] || 'EDT').substring(0, 3).toUpperCase();
                const cityCode = (data.city || 'STD').substring(0, 3).toUpperCase();
                
                const existing = await agencyService.getTeam();
                const count = existing.filter(t => t.id?.startsWith(`${roleCode}-${cityCode}`)).length + 1;
                const paddedCount = String(count).padStart(3, '0');
                
                const newUser = {
                    id: `${roleCode}-${cityCode}-${paddedCount}`,
                    name: data.name,
                    role: data.roles?.[0] || 'Editor de Video',
                    city: data.city,
                    status: 'Active',
                    availability: data.availability,
                    activeTasks: 0,
                    portfolio: data.portfolio,
                    level: data.level,
                    whatsapp: data.whatsapp,
                    joined_at: new Date().toISOString()
                };

                const updatedTeam = [...existing, newUser];
                localStorage.setItem('diic_team', JSON.stringify(updatedTeam));
                return newUser;
            } else {
                const existingClients = await agencyService.getClients();
                const newClient = {
                    id: `C-${Math.floor(Math.random() * 900) + 100}`,
                    name: data.brand || data.name,
                    brand: data.brand,
                    city: data.city,
                    type: data.businessType,
                    status: 'Onboarding',
                    objective: data.objective,
                    whatsapp: data.whatsapp,
                    joined_at: new Date().toISOString(),
                    coords: data.city === 'Quito' ? [-0.1807, -78.4678] : [-0.2530, -79.1754]
                };

                const updatedClients = [...existingClients, newClient];
                localStorage.setItem('diic_clients', JSON.stringify(updatedClients));
                return newClient;
            }
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    },

    // --- SYSTEM ---
    forceSyncMocks: () => {
        console.log("🔥 Force Syncing MOCK_DATA to LocalStorage");
        localStorage.setItem('diic_clients', JSON.stringify(MOCK_DATA.clients));
        localStorage.setItem('diic_team', JSON.stringify(MOCK_DATA.team));
        localStorage.setItem('diic_tasks', JSON.stringify(MOCK_DATA.tasks));
    }
};
