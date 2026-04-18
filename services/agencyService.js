import { supabase } from '@/lib/supabase';
import { MOCK_DATA } from '@/lib/mockData';

export const agencyService = {
    // --- CLIENTS (CONNECTED TO REAL DB) ---
    getClients: async () => {
        const timestamp = new Date().toLocaleTimeString();
        try {
            console.log(`🚀 [${timestamp}] Start: getClients`);
            
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });
 
            if (error) {
                console.error(`❌ [${timestamp}] Supabase Error:`, error.message);
                throw error;
            }
 
            // SYNC CACHE (Read-only fallback)
            if (typeof window !== 'undefined' && Array.isArray(data)) {
                localStorage.setItem('diic_clients', JSON.stringify(data));
            }
 
            return data || [];
        } catch (error) {
            console.error(`🚨 [${timestamp}] Fetch Failed:`, error);
            // Revert to local cache ONLY on failure
            if (typeof window !== 'undefined') {
                const localRaw = localStorage.getItem('diic_clients');
                if (localRaw) {
                    try { return JSON.parse(localRaw); } catch(e) { return []; }
                }
            }
            return [];
        }
    },

    createClient: async (clientData) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🚀 [${timestamp}] Service: Creating New Client...`);
        try {
            // Pick only valid columns that exist in the DB schema
                'id', 'name', 'city', 'type', 'status', 'cm', 'priority', 'plan', 
                'projects', 'nextpost', 'price', 'target', 'email', 
                'password_initial', 'whatsapp_number', 'google_drive_folder_id',
                'onboarding_data', 'notes', 'created_at',
                'editor', 'filmmaker', 'growth_level', 'business_type', 'industry'
            const sanitizedData = {};
            validFields.forEach(field => {
                if (clientData[field] !== undefined) sanitizedData[field] = clientData[field];
            });

            const newClient = {
                ...sanitizedData,
                id: clientData.id || `C-${Math.floor(Math.random() * 9000) + 1000}`,
                status: clientData.status || 'active',
                created_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('clients')
                .insert([newClient])
                .select();

            if (error) throw error;
            
            // OPTIMISTIC LOCAL CACHE RECOVERY
            if (typeof window !== 'undefined') {
                try {
                    const stored = localStorage.getItem('diic_clients');
                    const curr = stored ? JSON.parse(stored) : [];
                    localStorage.setItem('diic_clients', JSON.stringify([data[0], ...curr]));
                } catch (e) {
                    console.warn("⚠️ LocalStorage update skipped during creation");
                }
            }

            console.log(`✅ [${timestamp}] Success: Client Created (ID: ${data[0].id})`);
            return data[0];
        } catch (error) {
            console.error(`❌ [${timestamp}] Error in createClient:`, error);
            throw error;
        }
    },

    updateClient: async (id, updates) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🚀 [${timestamp}] Service: Updating Client ${id}...`);
        try {
            // Data Guardian: Include price/target/access info for persistence
            const validFields = [
                'name', 'city', 'type', 'status', 'cm', 'priority', 'plan', 
                'projects', 'nextpost', 'price', 'target', 'email', 
                'password_initial', 'whatsapp_number', 'google_drive_folder_id',
                'onboarding_data', 'notes',
                'editor', 'filmmaker', 'growth_level', 'business_type', 'industry'
            ];
            const sanitizedUpdates = {};
            validFields.forEach(field => {
                if (updates[field] !== undefined) sanitizedUpdates[field] = updates[field];
            });

            const { data, error } = await supabase
                .from('clients')
                .update(sanitizedUpdates)
                .eq('id', id)
                .select();

            if (error) throw error;

            // OPTIMISTIC LOCAL CACHE SYNC
            if (typeof window !== 'undefined') {
                try {
                    const stored = localStorage.getItem('diic_clients');
                    if (stored) {
                        const curr = JSON.parse(stored);
                        const updated = curr.map(c => c.id === id ? { ...c, ...sanitizedUpdates } : c);
                        localStorage.setItem('diic_clients', JSON.stringify(updated));
                    }
                } catch (e) {
                    console.warn("⚠️ LocalStorage sync skipped during update");
                }
            }

            console.log(`✅ [${timestamp}] Success: Client ${id} updated.`);
            return data[0];
        } catch (error) {
            console.error(`❌ [${timestamp}] Error updating client:`, error);
            throw error;
        }
    },

    getClientById: async (id) => {
        if (!id) return null;
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error fetching client by ID:", error);
            return null;
        }
    },

    deleteClient: async (id) => {
        console.log("Deleting Client Permanently:", id);
        try {
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id);

            if (error) throw error;
            console.log("Client deleted from Supabase", id);
        } catch (error) {
            console.error("Error deleting client in Supabase:", error);
            throw error;
        }
    },

    getClientsByCM: async (cmName) => {
        if (!cmName) return [];
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .eq('cm', cmName);
            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error("Error fetching clients by CM:", err);
            return [];
        }
    },

    getTasksByMember: async (memberName) => {
        if (!memberName) return [];
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*, client')
                .eq('assigned_to', memberName);
            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error("Error fetching tasks by member:", err);
            return [];
        }
    },

    // --- OTHER SERVICES (HYBRID FOR NOW) ---
    getTasks: async (role = 'all') => {
        try {
            const { data, error } = await supabase.from('tasks').select('*');
            if (error) throw error;
            
            // Sync cache
            if (typeof window !== 'undefined' && Array.isArray(data)) {
                localStorage.setItem('diic_tasks', JSON.stringify(data));
            }

            if (role === 'all') return data || [];
            return data.filter(t => t.assigned_role === role.toUpperCase()) || [];
        } catch (error) {
            console.error("Error fetching tasks:", error);
            // Fallback to cache ONLY on error
            if (typeof window !== 'undefined') {
                const localTasks = localStorage.getItem('diic_tasks');
                if (localTasks) {
                    const tasks = JSON.parse(localTasks);
                    if (role === 'all') return tasks;
                    return tasks.filter(t => t.assigned_role === role.toUpperCase());
                }
            }
            return [];
        }
    },
    getTasksByAssignee: async (name) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('assigned_to', name);
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching tasks by assignee:", error);
            return [];
        }
    },

    getSuggestedAssignee: async (taskTitle, assignedRole, clientCity) => {
        const team = await agencyService.getTeam();
        const roleMap = {
            'editor': 'Editor de Video',
            'design': 'Diseñador',
            'community': 'Community Manager',
            'filmmaker': 'Filmmaker'
        };
        const targetRole = roleMap[assignedRole?.toLowerCase()] || assignedRole;
        let eligible = team.filter(m => m.role === targetRole);
        let localOptions = eligible.filter(m => 
            m.city?.toLowerCase() === clientCity?.toLowerCase() && 
            m.status !== 'ocupado'
        );

        if (localOptions.length > 0) {
            const suggested = localOptions.sort((a, b) => (a.activeTasks || 0) - (b.activeTasks || 0))[0];
            return { ...suggested, assignmentType: 'local' };
        }

        let globalOptions = eligible.filter(m => m.status !== 'ocupado');
        if (globalOptions.length > 0) {
            const suggested = globalOptions.sort((a, b) => (a.activeTasks || 0) - (b.activeTasks || 0))[0];
            return { ...suggested, assignmentType: 'global' };
        }

        return null;
    },

    createTask: async (task) => {
        try {
            let finalAssignee = task.assigned_to;
            let assignmentLog = '';
            
            if (!finalAssignee) {
                const suggestion = await agencyService.getSuggestedAssignee(task.title, task.assigned_role, task.city);
                if (suggestion) {
                    finalAssignee = suggestion.name;
                    assignmentLog = suggestion.assignmentType === 'local' ? 'Ubicación Proximidad' : 'Balance Global';
                }
            }

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

            const localTasks = localStorage.getItem('diic_tasks');
            const tasks = localTasks ? JSON.parse(localTasks) : MOCK_DATA.tasks;
            const updatedTasks = [newTask, ...tasks];
            localStorage.setItem('diic_tasks', JSON.stringify(updatedTasks));

            const { error } = await supabase.from('tasks').insert([newTask]);
            if (error) console.warn("Supabase Sync skipped:", error.message);
            
            return newTask;
        } catch (error) {
            console.error("Error creating task:", error);
            throw error;
        }
    },

    getStrategySummary: async (clientId) => {
        // This could be real if strategy table is populated
        const strategies = {
            'gst': { title: 'Estrategia Q4 - Expansión Regional', focus: 'Nova Clínica Santa Anita busca posicionarse como referente en cirugías de alta complejidad en la zona sur.', nodos: 12, completed: 5, lastUpdate: 'Hoy, 10:45 AM', cmNotes: 'Leslie ha optimizado los nodos de conversión para el área de traumatología.' },
        };
        return strategies[clientId.toString()] || { title: 'Plan Estratégico', focus: 'Optimización de marca.', nodos: 0, completed: 0, lastUpdate: 'Sin actividad', cmNotes: 'Pendiente.' };
    },

    getProductionRates: async () => {
        try {
            const { data, error } = await supabase.from('production_rates').select('*');
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching production rates:", error);
            return [];
        }
    },

    getTeam: async () => {
        const timestamp = new Date().toLocaleTimeString();
        try {
            console.log(`🚀 [${timestamp}] Start: getTeam`);
            const { data, error } = await supabase
                .from('team')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;

            if (typeof window !== 'undefined' && Array.isArray(data)) {
                localStorage.setItem('diic_team', JSON.stringify(data));
            }

            return data || [];
        } catch (error) {
            console.error(`❌ [${timestamp}] Error in getTeam:`, error);
            return [];
        }
    },

    createTeamMember: async (memberData) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🚀 [${timestamp}] Service: Creating New Team Member...`);
        try {
            const validFields = ['id', 'name', 'role', 'status', 'city', 'whatsapp', 'salary', 'email'];
            const sanitizedData = {};
            validFields.forEach(field => {
                if (memberData[field] !== undefined) sanitizedData[field] = memberData[field];
            });

            const { data, error } = await supabase
                .from('team')
                .insert([{
                    ...sanitizedData,
                    id: memberData.id || `M-${Math.floor(Math.random() * 9000) + 1000}`,
                    status: memberData.status || 'activo',
                    created_at: new Date().toISOString()
                }])
                .select();

            if (error) throw error;
            
            // Sync Local Cache
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('diic_team');
                const curr = stored ? JSON.parse(stored) : [];
                localStorage.setItem('diic_team', JSON.stringify([data[0], ...curr]));
            }

            return data[0];
        } catch (error) {
            console.error(`❌ [${timestamp}] Error in createTeamMember:`, error);
            throw error;
        }
    },

    updateTeamMember: async (id, updates) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🚀 [${timestamp}] Service: Updating Team Member ${id}...`);
        try {
            const { data, error } = await supabase
                .from('team')
                .update(updates)
                .eq('id', id)
                .select();

            if (error) throw error;
            
            // Sync Local Cache
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('diic_team');
                if (stored) {
                    const curr = JSON.parse(stored);
                    const updated = curr.map(m => m.id === id ? { ...m, ...updates } : m);
                    localStorage.setItem('diic_team', JSON.stringify(updated));
                }
            }

            return data[0];
        } catch (error) {
            console.error(`❌ [${timestamp}] Error updating member:`, error);
            throw error;
        }
    },

    getFinancialSummary: async () => {
        try {
            // 1. Fetch all required datasets
            const [clients, services, rates] = await Promise.all([
                agencyService.getClients(),
                supabase.from('services').select('*'),
                agencyService.getProductionRates()
            ]);

            const allServices = services.data || [];
            
            // 2. Build a Cost Map for easy lookup
            const costMap = {};
            rates.forEach(r => {
                costMap[r.id] = Number(r.cost_internal) || 0;
            });

            // 3. Calculate Real COGS (Cost of Goods Sold) per client
            let totalMRR = 0;
            let totalProductionCosts = 0;

            const analyzedClients = clients.map(client => {
                // Find matching plan in DB (handling possible ID mismatch)
                const planId = client.plan?.toLowerCase();
                const planDef = allServices.find(s => s.id === planId || s.name?.toLowerCase().includes(planId));
                
                let clientCost = 0;
                let clientIncome = Number(client.price) || 0;
                totalMRR += clientIncome;

                if (planDef) {
                    const deliv = planDef.deliverables || {};
                    // Calculate based on the unit-cost model provided by user
                    clientCost += (Number(deliv.videos) || 0) * (costMap['vid_promo'] || 45);
                    clientCost += (Number(deliv.reels) || 0) * (costMap['reel_prod'] || 25);
                    clientCost += (Number(deliv.posts) || 0) * (costMap['post_simple'] || 4);
                    
                    // Fixed Service Costs per client (Real Structure)
                    if (deliv.cm) clientCost += (costMap['cm_service'] || 25);
                    if (deliv.strategy) clientCost += (costMap['strategy_unit'] || 25);
                } else {
                    // Fallback to average if no plan is found
                    clientCost = clientIncome > 0 ? clientIncome * 0.6 : 0; 
                }

                totalProductionCosts += clientCost;
                return { ...client, calculated_cost: clientCost };
            });

            const profit = totalMRR - totalProductionCosts;
            const margin = totalMRR > 0 ? (profit / totalMRR) * 100 : 0;

            // 4. Generate transaction feed from real data
            const recentTransactions = analyzedClients.slice(0, 5).map(c => ({
                id: `TX-${c.id}`,
                client: c.name,
                desc: `Plan ${c.plan} (Utility: $${(Number(c.price) - c.calculated_cost).toFixed(0)})`,
                amount: Number(c.price) || 0,
                type: 'income',
                date: 'Activo'
            }));

            return {
                metrics: {
                    income: totalMRR,
                    variable_costs: totalProductionCosts,
                    gross_profit: profit,
                    gross_margin: Math.round(margin * 10) / 10
                },
                transactions: recentTransactions
            };
        } catch (err) {
            console.error("Error in getFinancialSummary (Unit Cost Model):", err);
            return {
                metrics: { income: 0, variable_costs: 0, gross_profit: 0, gross_margin: 0 },
                transactions: []
            };
        }
    },

    getScaleData: async () => {
        try {
            const [team, financial, { data: tasks }, { data: rates }] = await Promise.all([
                agencyService.getTeam(),
                agencyService.getFinancialSummary(),
                supabase.from('tasks').select('*'),
                supabase.from('production_rates').select('*')
            ]);

            // 1. Calculate REAL Production Cost from tasks
            const ledger = tasks?.map(task => {
                const rate = rates?.find(r => 
                  (task.format && r.name && task.format.toLowerCase().includes(r.name.toLowerCase())) ||
                  (task.title && r.name && task.title.toLowerCase().includes(r.name.toLowerCase()))
                );
                return {
                  id: task.id,
                  title: task.title,
                  client: task.client,
                  cost: Number(rate?.cost_internal || 25), // Average fallback
                  format: task.format || 'Contenido'
                };
            }) || [];

            const productionTotal = ledger.reduce((acc, item) => acc + item.cost, 0);
            const totalPayroll = team.reduce((acc, m) => acc + (Number(m.salary) || 0), 0);
            const softwareCosts = 500; 
            const totalFixedCosts = totalPayroll + softwareCosts;

            const grossProfit = financial?.metrics.income - productionTotal;
            const netProfit = grossProfit - totalFixedCosts;

            // Software breakdown
            const softwareList = [
                { name: 'Adobe Creative Cloud', cost: 150 },
                { name: 'GPT-4 / OpenAI API', cost: 100 },
                { name: 'Supabase / Vercel Pro', cost: 80 },
                { name: 'Figma Professional', cost: 60 },
                { name: 'Slack / CRM Tools', cost: 110 }
            ];

            return {
                payroll: totalPayroll,
                production: productionTotal,
                software: softwareCosts,
                fixed_total: totalFixedCosts,
                net_profit: netProfit,
                itemized_payroll: team.map(m => ({ 
                    id: m.id, 
                    name: m.name, 
                    role: m.role, 
                    salary: Number(m.salary) || 0 
                })),
                itemized_software: softwareList,
                production_ledger: ledger // REAL DATA FOR AUDIT
            };
        } catch (error) {
            console.error("Error in getScaleData:", error);
            return null;
        }
    },

    getOperatingAudit: async () => {
        return agencyService.getScaleData();
    },

    getCommercialSummary: async () => {
        try {
            const [clients, { data: stages }] = await Promise.all([
                agencyService.getClients(),
                supabase.from('crm_stages').select('*').order('id', { ascending: true })
            ]);

            // 1. Leads and Funnel
            const totalLeads = stages?.reduce((acc, s) => acc + (s.items || 0), 0) || 0;
            const closedDeals = stages?.find(s => s.id === 'closing')?.items || 0;
            const closingRate = totalLeads > 0 ? (closedDeals / totalLeads) * 100 : 0;

            // 2. Sales Performance (last 30 days based on clients created_at or price > 0)
            const salesMonth = clients.reduce((acc, c) => acc + (Number(c.price) || 0), 0);
            
            // 3. ROI Estimation (Mock based on fixed 500 ad spend for now if not in DB)
            const adSpend = 500;
            const roi = adSpend > 0 ? (salesMonth / adSpend) * 100 : 0;

            return {
                metrics: {
                    sales_month: salesMonth,
                    leads_total: totalLeads,
                    roi_actual: Math.round(roi),
                    closing_rate: Math.round(closingRate),
                    ad_spend: adSpend
                },
                funnel: stages || [],
                recent_sales: clients.slice(0, 5)
            };
        } catch (error) {
            console.error("Error in getCommercialSummary:", error);
            return null;
        }
    },

    assignToSquad: async (memberId, cmId) => {
        try {
            const { error } = await supabase
                .from('team')
                .update({ squad_lead_id: cmId })
                .eq('id', memberId);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error assigning to squad:", error);
            return false;
        }
    },

    assignClientToCM: async (clientId, cmName) => {
        try {
            const { error } = await supabase
                .from('clients')
                .update({ cm: cmName })
                .eq('id', clientId);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error assigning client to CM:", error);
            return false;
        }
    },


    getTeamByLead: async (cmId) => {
        try {
            const { data, error } = await supabase
                .from('team')
                .select('*')
                .eq('squad_lead_id', cmId);
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching squad:", error);
            return [];
        }
    },

    submitTeamRequest: async (data) => {
        try {
            const { error } = await supabase
                .from('team_requests')
                .insert([{
                    cm_id: data.cm_id,
                    requested_role: data.role,
                    reason: data.reason,
                    urgency: data.urgency
                }]);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error submitting team request:", error);
            return false;
        }
    },

    getTeamRequests: async () => {
        try {
            const { data, error } = await supabase
                .from('team_requests')
                .select('*, cm:team!cm_id(name)')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching team requests:", error);
            return [];
        }
    },

    // --- FIXED COSTS & EXPENDITURES ---
    getFixedCosts: async () => {
        try {
            const stored = localStorage.getItem('diic_fixed_costs');
            if (stored) return JSON.parse(stored);
            
            // Default list if none exists
            const defaults = [
                { id: 'f-1', name: 'Alquiler Oficina', cost: 450, category: 'Fijo' },
                { id: 'f-2', name: 'Servicio Luz / Internet', cost: 120, category: 'Fijo' },
                { id: 'f-3', name: 'ChatGPT - Plus / API', cost: 40, category: 'Fijo' },
                { id: 'f-4', name: 'Adobe Creative Cloud', cost: 85, category: 'Fijo' },
                { id: 'f-5', name: 'Supabase / Vercel Pro', cost: 55, category: 'Fijo' }
            ];
            localStorage.setItem('diic_fixed_costs', JSON.stringify(defaults));
            return defaults;
        } catch (error) {
            console.error("Error fetching fixed costs:", error);
            return [];
        }
    },

    updateFixedCost: async (id, cost) => {
        try {
            const costs = await agencyService.getFixedCosts();
            const updated = costs.map(c => c.id === id ? { ...c, cost: Number(cost) } : c);
            localStorage.setItem('diic_fixed_costs', JSON.stringify(updated));
            return true;
        } catch (error) {
            console.error("Error updating fixed cost:", error);
            return false;
        }
    },

    addFixedCost: async (data) => {
        try {
            const costs = await agencyService.getFixedCosts();
            const newItem = {
                id: `f-${Date.now()}`,
                name: data.name,
                cost: Number(data.cost),
                category: data.category || 'Fijo'
            };
            localStorage.setItem('diic_fixed_costs', JSON.stringify([...costs, newItem]));
            return newItem;
        } catch (error) {
            console.error("Error adding fixed cost:", error);
            return null;
        }
    },

    deleteFixedCost: async (id) => {
        try {
            const costs = await agencyService.getFixedCosts();
            const updated = costs.filter(c => c.id !== id);
            localStorage.setItem('diic_fixed_costs', JSON.stringify(updated));
            return true;
        } catch (error) {
            console.error("Error deleting fixed cost:", error);
            return false;
        }
    },

    // --- EQUIPMENT REQUIREMENTS ---
    getEquipmentRequirements: async () => {
        try {
            const stored = localStorage.getItem('diic_equipment_reqs');
            if (stored) return JSON.parse(stored);
            
            const defaults = [
                { id: 'req-1', name: 'Microfonos Inalámbricos (4 u)', requester: 'Fausto', status: 'approved', cost: 250, date: '2026-04-10' },
                { id: 'req-2', name: 'Luces RGB Pro-Studio', requester: 'Anthony', status: 'pending', cost: 180, date: '2026-04-12' }
            ];
            localStorage.setItem('diic_equipment_reqs', JSON.stringify(defaults));
            return defaults;
        } catch (error) {
            console.error("Error fetching equipment reqs:", error);
            return [];
        }
    },

    updateEquipmentReqStatus: async (id, status) => {
        try {
            const reqs = await agencyService.getEquipmentRequirements();
            const updated = reqs.map(r => r.id === id ? { ...r, status } : r);
            localStorage.setItem('diic_equipment_reqs', JSON.stringify(updated));
            return true;
        } catch (error) {
            console.error("Error updating req status:", error);
            return false;
        }
    },

    submitEquipmentRequirement: async (data) => {
        try {
            const reqs = await agencyService.getEquipmentRequirements();
            const newReq = {
                id: `req-${Date.now()}`,
                name: data.name,
                requester: data.requester || 'Team',
                cost: Number(data.cost || 0),
                status: 'pending',
                date: new Date().toISOString().split('T')[0]
            };
            localStorage.setItem('diic_equipment_reqs', JSON.stringify([newReq, ...reqs]));
            return newReq;
        } catch (error) {
            console.error("Error submitting equipment req:", error);
            return null;
        }
    },

    // --- REAL FINANCIAL TRANSACTIONS (SUBACATEGORIES) ---
    getFinancialTransactions: async () => {
        try {
            const { data, error } = await supabase
                .from('financial_transactions')
                .select('*')
                .order('date', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching financial transactions:", error);
            return [];
        }
    },

    addFinancialTransaction: async (txData) => {
        try {
            const { data, error } = await supabase
                .from('financial_transactions')
                .insert([txData])
                .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error("Error adding financial transaction:", error);
            throw error;
        }
    },

    // --- FINANCIAL GOALS (GROWTH) ---
    getFinancialGoals: async () => {
        try {
            const { data, error } = await supabase
                .from('financial_goals')
                .select('*')
                .order('deadline', { ascending: true });
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching financial goals:", error);
            return [];
        }
    },

    addFinancialGoal: async (goalData) => {
        try {
            const { data, error } = await supabase
                .from('financial_goals')
                .insert([goalData])
                .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error("Error adding financial goal:", error);
            throw error;
        }
    },

    updateFinancialGoal: async (id, status) => {
        try {
            const { data, error } = await supabase
                .from('financial_goals')
                .update({ status })
                .eq('id', id)
                .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error("Error updating financial goal:", error);
            throw error;
        }
    },

    // --- OPERATIONAL INTELLIGENCE ENGINE (HQ SYNC) ---
    getOperationalIntelligence: async () => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🧠 [${timestamp}] Starting Operational Intelligence Engine...`);
        try {
            const [team, tasks, clients] = await Promise.all([
                agencyService.getTeam(),
                agencyService.getTasks('all'),
                agencyService.getClients()
            ]);

            // 1. Task Weight Config
            const WORKLOAD_MAP = {
                'Post Simple': 1.2,
                'Image': 1.2,
                'Carousel': 2,
                'Reel Vertical (9:16)': 1.8,
                'Video 9:16': 1.8,
                'Video 16:9': 4.5,
                'Landscape (16:9)': 1.5,
                'PDF/Docs': 2.0,
                'Default': 2.0
            };

            // 2. Process Team Workload
            const activeTasks = tasks.filter(t => t.status !== 'completed' && t.status !== 'approved');
            
            const processedTeam = team.map(member => {
                const memberTasks = activeTasks.filter(t => 
                    t.assigned_to === member.name || 
                    t.assigned_to === member.id
                );

                const assignedHours = memberTasks.reduce((sum, task) => {
                    const weight = WORKLOAD_MAP[task.format] || WORKLOAD_MAP['Default'];
                    return sum + weight;
                }, 0);

                const loadPercent = Math.round((assignedHours / 40) * 100);

                return {
                    ...member,
                    assigned: Number(assignedHours.toFixed(1)),
                    capacity: 40,
                    load: loadPercent,
                    activeTasksCount: memberTasks.length,
                    status: loadPercent > 90 ? 'rose' : loadPercent > 70 ? 'red' : loadPercent > 50 ? 'yellow' : 'emerald'
                };
            });

            // 3. Risk Analysis
            const risks = [];
            const now = new Date();

            // Check overdue tasks
            activeTasks.forEach(task => {
                if (task.due_date && new Date(task.due_date) < now) {
                    risks.push({
                        id: `risk-task-${task.id}`,
                        category: 'project',
                        severity: 'critical',
                        title: `Tarea Vencida: ${task.title}`,
                        msg: `La tarea debió entregarse el ${new Date(task.due_date).toLocaleDateString()}.`,
                        impact: 'Retraso en cronograma de cliente',
                        action: 'Reasignar / Urgente',
                        color: 'red'
                    });
                }
            });

            // Check overloaded members
            processedTeam.forEach(m => {
                if (m.load > 100) {
                    risks.push({
                        id: `risk-team-${m.id}`,
                        category: 'creative',
                        severity: 'critical',
                        title: `Saturación Extrema: ${m.name}`,
                        msg: `${m.name} tiene ${m.assigned}h asignadas (100%+ de su capacidad semanal).`,
                        impact: 'Riesgo de colapso y baja calidad',
                        action: 'Reasignar tareas de inmediato',
                        color: 'rose'
                    });
                } else if (m.load > 85) {
                    risks.push({
                        id: `risk-team-warn-${m.id}`,
                        category: 'creative',
                        severity: 'warning',
                        title: `Alerta de Carga: ${m.name}`,
                        msg: `${m.name} está llegando a su límite de capacidad (${m.load}%).`,
                        impact: 'Posible cuello de botella',
                        action: 'Monitorizar / No asignar más',
                        color: 'red'
                    });
                }
            });

            // 4. Production Stats
            const productionStats = {
                editing: activeTasks.filter(t => t.assigned_role === 'EDITOR' || t.title?.toLowerCase().includes('edit')).length,
                design: activeTasks.filter(t => t.assigned_role === 'DESIGN' || t.title?.toLowerCase().includes('diseñ')).length,
                shooting: activeTasks.filter(t => t.assigned_role === 'FILMMAKER' || t.title?.toLowerCase().includes('rodaje')).length,
                bottlenecks: risks.filter(r => r.severity === 'critical').length
            };

            const globalLoad = Math.round(processedTeam.reduce((acc, m) => acc + m.load, 0) / (processedTeam.length || 1));

            return {
                team: processedTeam,
                tasks: activeTasks,
                clients: clients,
                risks: risks.length > 0 ? risks : [],
                productionStats,
                globalMetrics: {
                    globalLoad,
                    totalMembers: processedTeam.length,
                    activeTasksCount: activeTasks.length,
                    threatLevel: risks.filter(r => r.severity === 'critical').length > 2 ? 'crítico' : 'estable'
                }
            };

        } catch (error) {
            console.error("🚨 Critical Error in Operational Intelligence Engine:", error);
            return null;
        }
    },

    // --- FINANCIAL BUDGETS (PLANNING) ---
    getFinancialBudgets: async (month) => {
        try {
            const { data, error } = await supabase
                .from('financial_budgets')
                .select('*')
                .eq('month', month);
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching financial budgets:", error);
            return [];
        }
    },

    upsertFinancialBudget: async (budgetData) => {
        try {
            const { data, error } = await supabase
                .from('financial_budgets')
                .upsert([budgetData], { onConflict: 'category,month' })
                .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error("Error upserting financial budget:", error);
            throw error;
        }
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
                return await agencyService.createClient({
                    name: data.brand || data.name,
                    city: data.city,
                    type: data.businessType,
                    status: 'active',
                    whatsapp: data.whatsapp,
                });
            }
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    },

    forceSyncMocks: () => {
        console.log("🔥 Force Syncing MOCK_DATA is DISABLED for Clients");
        localStorage.removeItem('diic_clients'); // Clear local clients to force refresh from Supabase
        localStorage.setItem('diic_team', JSON.stringify(MOCK_DATA.team));
        localStorage.setItem('diic_tasks', JSON.stringify(MOCK_DATA.tasks));
    },

    getClientCount: async () => {
        try {
            const { count, error } = await supabase
                .from('clients')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');
            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error("Error getting client count:", error);
            return 0;
        }
    }
};
