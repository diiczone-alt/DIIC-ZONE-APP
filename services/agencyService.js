import { supabase } from '@/lib/supabase';
import { MOCK_DATA } from '@/lib/mockData';
import { toast } from 'sonner';

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
 
            // SYNC CACHE (Clean & Overwrite)
            if (typeof window !== 'undefined' && Array.isArray(data)) {
                localStorage.removeItem('diic_clients');
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
            const validFields = [
                'id', 'name', 'city', 'type', 'status', 'cm', 'priority', 'plan', 
                'projects', 'nextpost', 'price', 'target', 'email', 
                'password_initial', 'whatsapp_number', 'google_drive_folder_id',
                'onboarding_data', 'notes', 'created_at',
                'editor', 'filmmaker', 'growth_level', 'business_type', 'industry'
            ];
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
            const validFields = [
                'name', 'city', 'type', 'status', 'cm', 'priority', 'plan', 
                'projects', 'nextpost', 'price', 'target', 'email', 
                'password_initial', 'whatsapp_number', 'google_drive_folder_id',
                'onboarding_data', 'notes',
                'editor', 'filmmaker', 'growth_level', 'business_type', 'industry', 'marketing_type', 'specialty'
            ];
            const sanitizedUpdates = {};
            validFields.forEach(field => {
                if (updates[field] !== undefined) sanitizedUpdates[field] = updates[field];
            });

            toast.info("Iniciando actualización en BD...", { id: 'debug-db' });
            
            const { data, error } = await supabase
                .from('clients')
                .update(sanitizedUpdates)
                .eq('id', id)
                .select();

            if (error) {
                toast.error("Error BD Clients: " + error.message, { id: 'debug-db' });
                throw error;
            }
            toast.success("BD Clients actualizada", { id: 'debug-db' });

            // SYNC TO PROFILE (Propagate Brand Identity)
            if (updates.name || updates.city || updates.whatsapp_number || updates.industry || updates.plan || updates.business_type || updates.specialty) {
                console.log(`🔄 Syncing identity changes to public profile for client ${id}`);
                toast.info("Sincronizando perfiles públicos...", { id: 'debug-profile' });
                await supabase
                    .from('profiles')
                    .update({
                        full_name: updates.name,
                        location: updates.city,
                        whatsapp: updates.whatsapp_number,
                        marketing_type: updates.industry, // Sync industry to marketing_type
                        plan: updates.plan,
                        business_type: updates.business_type,
                        specialty: updates.specialty
                    })
                    .eq('client_id', id);
                toast.success("Perfiles sincronizados", { id: 'debug-profile' });
            }

            // OPTIMISTIC LOCAL CACHE SYNC
            toast.info("Actualizando caché local...", { id: 'debug-cache' });
            if (typeof window !== 'undefined') {
                try {
                    const stored = localStorage.getItem('diic_clients');
                    if (stored) {
                        const curr = JSON.parse(stored);
                        const updated = curr.map(c => c.id == id ? { ...c, ...sanitizedUpdates } : c);
                        localStorage.setItem('diic_clients', JSON.stringify(updated));
                    }
                } catch (e) {
                    console.warn("⚠️ LocalStorage sync skipped during update");
                }
            }
            toast.success("Caché local listo", { id: 'debug-cache' });

            console.log(`✅ [${timestamp}] Success: Client ${id} updated.`);
            return data[0];
        } catch (error) {
            console.error(`❌ [${timestamp}] Error updating client:`, error);
            throw error;
        }
    },

    syncClientProfile: async (clientId, updates) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🚀 [${timestamp}] Service: Bidirectional Sync for ${clientId}...`);
        try {
            // 1. Update Profile (Personal side)
            const profileUpdates = {
                full_name: updates.full_name,
                location: updates.location,
                whatsapp: updates.whatsapp,
                industry: updates.marketing_type,
                specialty: updates.specialty,
                plan: updates.plan
            };
            
            const { error: pError } = await supabase
                .from('profiles')
                .update(profileUpdates)
                .eq('client_id', clientId);

            if (pError) console.warn("Profile sync warning:", pError.message);

            // 2. Update Client (Admin side)
            const clientUpdates = {
                name: updates.full_name,
                city: updates.location,
                whatsapp_number: updates.whatsapp,
                industry: updates.marketing_type, // Mapping marketing type to industry
                specialty: updates.specialty,
                plan: updates.plan,
                // Preserving existing onboarding_data and updating brand section
                onboarding_data: {
                    brand: {
                        primaryColor: updates.primary_color,
                        secondaryColor: updates.secondary_color,
                        accentColor: updates.accent_color,
                        logo: updates.logo_url
                    }
                }
            };

            const { data: cData, error: cError } = await supabase
                .from('clients')
                .update(clientUpdates)
                .eq('id', clientId)
                .select();

            if (cError) throw cError;

            return cData[0];
        } catch (error) {
            console.error("❌ Sync Failure:", error);
            throw error;
        }
    },

    assignClientToCM: async (clientId, cmName) => {
        try {
            const { data, error } = await supabase
                .from('clients')
                .update({ cm: cmName })
                .eq('id', clientId)
                .select();

            if (error) throw error;

            // Update Cache
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('diic_clients');
                if (stored) {
                    const clients = JSON.parse(stored);
                    const updated = clients.map(c => c.id === clientId ? { ...c, cm: cmName } : c);
                    localStorage.setItem('diic_clients', JSON.stringify(updated));
                }
            }
            return data[0];
        } catch (error) {
            console.error("Error assigning client to CM:", error);
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
            console.error("Error fetching client by ID:", error?.message || error);
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
            const validFields = [
                'id', 'name', 'role', 'status', 'city', 'whatsapp', 
                'salary', 'email', 'cv_url', 'cv_summary', 'skills'
            ];
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
            // Campos Válidos en DB (Excluyendo ID y Metadatos de UI)
            const validFields = [
                'name', 'role', 'status', 'city', 'coords', 
                'availability', 'activetasks', 'salary', 
                'squad_lead_id', 'cv_url', 'cv_summary', 'skills', 
                'whatsapp', 'email'
            ];
            
            const sanitizedUpdates = {};
            validFields.forEach(field => {
                if (updates[field] !== undefined) {
                    let value = updates[field];
                    // Casting especial para tipos de datos DB
                    if (field === 'salary' && value !== null) value = Number(value);
                    if (field === 'activetasks' && value !== null) value = parseInt(value);
                    sanitizedUpdates[field] = value;
                }
            });

            console.log(`[${timestamp}] Sanitized Updates:`, Object.keys(sanitizedUpdates));

            const { data, error } = await supabase
                .from('team')
                .update(sanitizedUpdates)
                .eq('id', id)
                .select();

            if (error) {
                console.error("Supabase Update Error:", error);
                throw error;
            }
            
            // Sync Local Cache
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('diic_team');
                if (stored) {
                    const curr = JSON.parse(stored);
                    const updated = curr.map(m => m.id === id ? { ...m, ...sanitizedUpdates } : m);
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

            // 4. Fetch Real Ledger Transactions (New)
            const { data: ledgerTxs, error: txError } = await supabase
                .from('financial_transactions')
                .select('*')
                .order('date', { ascending: false });

            // 5. Integrate Fixed Costs (Overhead) from getScaleData logic
            const [team, expenses] = await Promise.all([
                agencyService.getTeam(),
                agencyService.getAgencyExpenses()
            ]);
            
            const totalPayroll = team.reduce((acc, m) => acc + (Number(m.salary) || 0), 0);
            const softwareCosts = expenses.reduce((acc, ex) => acc + (Number(ex.amount) || 0), 0);
            const totalOverhead = totalPayroll + softwareCosts;
            const netProfit = profit - totalOverhead;

            return {
                metrics: {
                    income: totalMRR,
                    variable_costs: totalProductionCosts,
                    fixed_costs: totalOverhead,
                    gross_profit: profit,
                    net_profit: netProfit,
                    gross_margin: Math.round(margin * 10) / 10
                },
                transactions: ledgerTxs || []
            };
        } catch (err) {
            console.error("Error in getFinancialSummary (Unit Cost Model):", err);
            return {
                metrics: { income: 0, variable_costs: 0, gross_profit: 0, gross_margin: 0 },
                transactions: []
            };
        }
    },

    getTransactions: async (billingCycle = null) => {
        try {
            let query = supabase.from('financial_transactions').select('*').order('date', { ascending: false });
            if (billingCycle) {
                query = query.eq('billing_cycle', billingCycle);
            }
            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching transactions:", error);
            return [];
        }
    },

    projectMonthlyCycle: async (cycle) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🚀 [${timestamp}] Projecting Cycle: ${cycle}`);
        try {
            const [clients, team] = await Promise.all([
                agencyService.getClients(),
                agencyService.getTeam()
            ]);

            const pendingTransactions = [];

            // 1. Project Client Incomes
            clients.filter(c => Number(c.price) > 0 && c.status === 'active').forEach(c => {
                pendingTransactions.push({
                    type: 'income',
                    category: 'Clientes',
                    subcategory: c.plan || 'Plan Individual',
                    amount: Number(c.price),
                    description: `Cobro Mensual: ${c.name}`,
                    billing_cycle: cycle,
                    status: 'pending',
                    reference_id: c.id,
                    date: new Date().toISOString()
                });
            });

            // 2. Project Team Expenses (Salaries)
            team.filter(m => Number(m.salary) > 0 && m.status === 'Active').forEach(m => {
                pendingTransactions.push({
                    type: 'expense',
                    category: 'Pago a Profesionales',
                    subcategory: m.role,
                    amount: Number(m.salary),
                    description: `Sueldo Mensual: ${m.name}`,
                    billing_cycle: cycle,
                    status: 'pending',
                    reference_id: m.id,
                    date: new Date().toISOString()
                });
            });

            if (pendingTransactions.length === 0) return { count: 0 };

            const { data, error } = await supabase
                .from('financial_transactions')
                .insert(pendingTransactions)
                .select();

            if (error) throw error;
            return { count: data.length };
        } catch (error) {
            console.error("Error projecting monthly cycle:", error);
            throw error;
        }
    },

    certifyTransaction: async (id) => {
        try {
            const { data, error } = await supabase
                .from('financial_transactions')
                .update({ status: 'completed', date: new Date().toISOString() })
                .eq('id', id)
                .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error("Error certifying transaction:", error);
            throw error;
        }
    },

    registerTransaction: async (txData) => {
        try {
            const { data, error } = await supabase
                .from('financial_transactions')
                .insert([{ ...txData, status: txData.status || 'completed' }])
                .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error("Error registering manual transaction:", error);
            throw error;
        }
    },

    getScaleData: async () => {
        try {
            const [team, financial, { data: tasks }, { data: rates }, { data: expenses }] = await Promise.all([
                agencyService.getTeam(),
                agencyService.getFinancialSummary(),
                supabase.from('tasks').select('*'),
                supabase.from('production_rates').select('*'),
                supabase.from('agency_expenses').select('*')
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
            
            // REAL SaaS Costs from DB
            const softwareCosts = expenses?.reduce((acc, ex) => acc + (Number(ex.amount) || 0), 0) || 0;
            const totalFixedCosts = totalPayroll + softwareCosts;

            const grossProfit = (financial?.metrics?.income || 0) - productionTotal;
            const netProfit = grossProfit - totalFixedCosts;

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
                itemized_software: expenses || [],
                production_ledger: ledger 
            };
        } catch (error) {
            console.error("Error in getScaleData:", error);
            return null;
        }
    },

    // --- AGENCY EXPENSES (SaaS / Infrastructure) ---
    getAgencyExpenses: async () => {
        try {
            const { data, error } = await supabase
                .from('agency_expenses')
                .select('*')
                .order('name');
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching agency expenses:", error);
            return [];
        }
    },

    addAgencyExpense: async (expenseData) => {
        try {
            const { data, error } = await supabase
                .from('agency_expenses')
                .insert([expenseData])
                .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error("Error adding agency expense:", error);
            return null;
        }
    },

    updateAgencyExpense: async (id, updates) => {
        try {
            const { data, error } = await supabase
                .from('agency_expenses')
                .update(updates)
                .eq('id', id)
                .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error("Error updating agency expense:", error);
            return null;
        }
    },

    deleteAgencyExpense: async (id) => {
        try {
            const { error } = await supabase
                .from('agency_expenses')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error deleting agency expense:", error);
            return false;
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

            const totalAssignedHours = Number(processedTeam.reduce((acc, m) => acc + m.assigned, 0).toFixed(1));
            const totalCapacity = processedTeam.length * 40;
            const globalLoad = Math.round(processedTeam.reduce((acc, m) => acc + m.load, 0) / (processedTeam.length || 1));

            return {
                team: processedTeam,
                tasks: activeTasks,
                clients: clients,
                risks: risks.length > 0 ? risks : [],
                productionStats,
                globalMetrics: {
                    globalLoad,
                    assignedHours: totalAssignedHours,
                    totalCapacity: totalCapacity,
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
    },

    // --- OPERATING GOVERNANCE (Sedes & Gastos Operativos) ---
    getBranchOffices: async () => {
        try {
            const { data, error } = await supabase
                .from('branch_offices')
                .select('*')
                .order('city');
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching branch offices:", error);
            return [];
        }
    },

    createBranchOffice: async (branchData) => {
        try {
            const { data, error } = await supabase
                .from('branch_offices')
                .insert([branchData])
                .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error("Error creating branch office:", error);
            throw error;
        }
    },

    deleteBranchOffice: async (id) => {
        try {
            const { error } = await supabase
                .from('branch_offices')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error deleting branch office:", error);
            return false;
        }
    },

    getOperatingExpenses: async (month = null, branchId = null) => {
        try {
            let query = supabase.from('operating_expenses').select('*, branch_offices(city, name)').order('date', { ascending: false });
            
            if (branchId) {
                query = query.eq('branch_id', branchId);
            }

            const { data, error } = await query;
            if (error) throw error;

            // Filtrar por mes si se provee (formato 'YYYY-MM')
            if (month) {
                return data.filter(ex => ex.date.startsWith(month));
            }

            return data || [];
        } catch (error) {
            console.error("Error fetching operating expenses:", error);
            return [];
        }
    },

    addOperatingExpense: async (expenseData) => {
        try {
            const { data, error } = await supabase
                .from('operating_expenses')
                .insert([expenseData])
                .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error("Error adding operating expense:", error);
            return null;
        }
    },

    updateOperatingExpenseStatus: async (id, status) => {
        try {
            const { data, error } = await supabase
                .from('operating_expenses')
                .update({ status })
                .eq('id', id)
                .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error("Error updating operating expense status:", error);
            return null;
        }
    },

    deleteOperatingExpense: async (id) => {
        try {
            const { error } = await supabase
                .from('operating_expenses')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error deleting operating expense:", error);
            return false;
        }
    },

    // --- STRATEGIC PERSISTENCE (GOD MODE) ---
    loadStrategy: async (clientId) => {
        if (!clientId) return null;
        try {
            const { data, error } = await supabase
                .from('strategies')
                .select('*')
                .eq('client_id', clientId)
                .single();
            
            if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
                console.error("Error loading strategy:", error);
                return null;
            }
            return data;
        } catch (err) {
            console.error("Strategy load exception:", err);
            return null;
        }
    },

    saveStrategy: async (clientId, strategyData) => {
        if (!clientId) return null;
        try {
            // Check if exists
            const { data: existing } = await supabase
                .from('strategies')
                .select('id')
                .eq('client_id', clientId)
                .single();

            if (existing) {
                const { data, error } = await supabase
                    .from('strategies')
                    .update({ 
                        data: strategyData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('client_id', clientId)
                    .select();
                if (error) throw error;
                return data[0];
            } else {
                const { data, error } = await supabase
                    .from('strategies')
                    .insert([{
                        client_id: clientId,
                        data: strategyData,
                        updated_at: new Date().toISOString()
                    }])
                    .select();
                if (error) throw error;
                return data[0];
            }
        } catch (err) {
            console.error("Strategy save exception:", err);
            throw err;
        }
    },

    getGlobalMetrics: async () => {
        const intel = await agencyService.getOperationalIntelligence();
        return intel?.globalMetrics || { globalLoad: 0, assignedHours: 0, totalCapacity: 0 };
    }
};
