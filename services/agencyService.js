import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const cleanNicheString = (str) => (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

const getPlanPrice = (plan, industry) => {
    const ind = cleanNicheString(industry);
    const isMedical = ind.includes('medico') || ind.includes('salud') || ind.includes('health') || ind.includes('doctor');
    const isHospital = ind.includes('hospital') || ind.includes('clinica');
    const isHospitality = ind.includes('hospitality') || ind.includes('restaurante') || ind.includes('horeca');
    
    let normalizedPlan = plan || 'Presencia';
    if (normalizedPlan === 'Basic') normalizedPlan = 'Presencia';
    if (normalizedPlan === 'Estrategia') normalizedPlan = 'Crecimiento';
    if (normalizedPlan === 'Premium') normalizedPlan = 'Autoridad';
    if (normalizedPlan?.toUpperCase().includes('SOLO USO DE APP') || normalizedPlan?.toUpperCase().includes('SOLO APP')) {
        normalizedPlan = 'Solo App';
    }
    
    if (normalizedPlan === 'Solo App') {
        return '70';
    }
    
    if (isMedical && !isHospital) {
        if (normalizedPlan === 'Presencia') return '250';
        if (normalizedPlan === 'Crecimiento') return '500';
        if (normalizedPlan === 'Autoridad') return '700';
        if (normalizedPlan === 'Control') return '999';
        return '250';
    } else if (isHospital) {
        if (normalizedPlan === 'Presencia') return '300';
        if (normalizedPlan === 'Crecimiento') return '500';
        if (normalizedPlan === 'Autoridad') return '700';
        if (normalizedPlan === 'Control') return '999';
        return '300';
    } else if (isHospitality) {
        if (normalizedPlan === 'Presencia') return '350';
        if (normalizedPlan === 'Crecimiento') return '600';
        if (normalizedPlan === 'Autoridad') return '850';
        if (normalizedPlan === 'Control') return '1200';
        return '350';
    } else {
        if (normalizedPlan === 'Presencia') return '300';
        if (normalizedPlan === 'Crecimiento') return '500';
        if (normalizedPlan === 'Autoridad') return '700';
        if (normalizedPlan === 'Control') return '999';
        return '300';
    }
};

const extractCoordsFromUrl = (url) => {
    if (!url) return null;
    try {
        // 1. Check for @lat,lng
        const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (atMatch) {
            return [parseFloat(atMatch[1]), parseFloat(atMatch[2])];
        }
        
        // 2. Check for query/q parameters
        const queryMatch = url.match(/[?&](?:query|q)=(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/i);
        if (queryMatch) {
            return [parseFloat(queryMatch[1]), parseFloat(queryMatch[2])];
        }
        
        // 3. Check for !3d lat !4d lng (Google Maps internal parameters)
        const dMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
        if (dMatch) {
            return [parseFloat(dMatch[1]), parseFloat(dMatch[2])];
        }

        // 4. Waze ll=lat,lng query parameter
        const wazeMatch = url.match(/[?&]ll=(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/i);
        if (wazeMatch) {
            return [parseFloat(wazeMatch[1]), parseFloat(wazeMatch[2])];
        }
    } catch (e) {
        console.error("Error parsing Google Maps URL:", e);
    }
    return null;
};

const geocodeAddress = async (address, city) => {
    const addressStr = (address || '').trim();
    const cityStr = (city || '').trim();
    if (!addressStr) return null;

    // First try to extract coordinates directly if the address is a map URL
    const extracted = extractCoordsFromUrl(addressStr);
    if (extracted) {
        return extracted;
    }

    if (addressStr.toUpperCase() === cityStr.toUpperCase()) {
        return null;
    }

    try {
        const query = `${addressStr}, ${cityStr || ''}, Ecuador`.trim();
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'DiicZoneHQApp/1.0 (contact: info@diiczone.com)'
            }
        });
        const data = await response.json();
        if (data && data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
    } catch (e) {
        console.error("Geocoding failed for address:", address, e);
    }
    return null;
};

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

            // --- AUTO SYNC CLIENTS FROM PROFILES ---
            const { data: unlinkedProfiles, error: pError } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'CLIENT')
                .is('client_id', null);

            if (!pError && Array.isArray(unlinkedProfiles) && unlinkedProfiles.length > 0) {
                console.log(`✨ [${timestamp}] Found ${unlinkedProfiles.length} unlinked client profiles. Auto-syncing to clients table...`);
                
                const clientInserts = [];
                const profileUpdates = [];

                for (const p of unlinkedProfiles) {
                    if (!p.full_name) continue;
                    
                    const clientSlugClean = (p.client_slug || p.full_name.toLowerCase().trim().replace(/[^a-z0-9]/g, ''));
                    const cleanSlug = clientSlugClean.substring(0, 6).toUpperCase();
                    const newId = `C-${cleanSlug}-${Math.floor(100 + Math.random() * 900)}`;

                    let initialPlan = p.plan || 'Presencia';
                    if (initialPlan === 'Basic') initialPlan = 'Presencia';
                    const calculatedPrice = getPlanPrice(initialPlan, p.industry);

                    const clientRecord = {
                        id: newId,
                        name: p.full_name.trim() + (p.client_slug ? ` (${p.client_slug})` : ''),
                        city: p.location || 'Santo Domingo',
                        type: p.specialty || 'General',
                        status: 'trial',
                        cm: 'Leslie', // default CM assignment
                        priority: 'Media',
                        plan: initialPlan,
                        projects: 0,
                        price: String(calculatedPrice),
                        target: '500',
                        email: p.email || '',
                        whatsapp_number: p.whatsapp || '',
                        sync_active: false,
                        onboarding_data: {
                            brand: {
                                logo: '',
                                accentColor: '#6366f1',
                                primaryColor: '#6366f1',
                                secondaryColor: '#ec4899'
                            },
                            strategic: {
                                cm: 'Leslie',
                                city: p.location || 'Santo Domingo',
                                name: p.full_name.trim(),
                                brandName: p.client_slug || p.full_name.trim()
                            }
                        },
                        notes: 'Creado automáticamente por auto-sincronización de perfiles.',
                        editor: '',
                        filmmaker: 'Sin asignar',
                        growth_level: p.level || 1,
                        business_type: p.business_type || 'Personal',
                        industry: p.industry || 'General',
                        specialty: p.specialty || '',
                        birth_date: p.birth_date || null,
                        country: p.country || 'Ecuador',
                        address: p.address || '',
                        website: p.website || '',
                        goals: p.goals || []
                    };

                    clientInserts.push(clientRecord);
                    profileUpdates.push({ profileId: p.id, clientId: newId, plan: initialPlan, price: calculatedPrice });
                }

                if (clientInserts.length > 0) {
                    const { data: insertedClients, error: insertErr } = await supabase
                        .from('clients')
                        .insert(clientInserts)
                        .select();

                    if (!insertErr && Array.isArray(insertedClients)) {
                        console.log(`✅ [${timestamp}] Inserted ${insertedClients.length} clients in auto-sync`);
                        
                        // Update the profile client_ids, plan and price
                        for (const up of profileUpdates) {
                            const { error: updErr } = await supabase
                                .from('profiles')
                                .update({ 
                                    client_id: up.clientId,
                                    plan: up.plan,
                                    price: up.price
                                })
                                .eq('id', up.profileId);
                            if (updErr) {
                                console.warn(`⚠️ [${timestamp}] Failed to update profile client_id for ${up.profileId}:`, updErr.message);
                            }
                        }

                        // Add new clients to the main data array returned
                        if (data) {
                            data.push(...insertedClients);
                            data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                        }
                    } else {
                        console.warn(`⚠️ [${timestamp}] Client auto-sync insert failed:`, insertErr?.message || insertErr);
                    }
                }
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

    getClientById: async (id) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🚀 [${timestamp}] Service: Fetching Client ${id}...`);
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error(`❌ [${timestamp}] Supabase Error:`, error.message);
                throw error;
            }
            return data;
        } catch (error) {
            console.error(`❌ [${timestamp}] Error in getClientById:`, error);
            throw error;
        }
    },

    createClient: async (clientData) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🚀 [${timestamp}] Service: Creating New Client...`, clientData.name);
        const startTime = Date.now();
        
        try {
            const validFields = [
                'id', 'name', 'city', 'type', 'status', 'cm', 'priority', 'plan', 
                'projects', 'nextpost', 'price', 'target', 'email', 
                'password_initial', 'whatsapp_number', 'google_drive_folder_id',
                'onboarding_data', 'notes', 'created_at',
                'editor', 'filmmaker', 'growth_level', 'business_type', 'industry', 'specialty',
                'birth_date', 'country', 'address', 'website', 'goals', 'brochure_url',
                'start_date', 'cutoff_day', 'app_fee', 'has_crm', 'has_agents', 'coords'
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

            if (newClient.address && !newClient.coords) {
                try {
                    const coords = await geocodeAddress(newClient.address, newClient.city);
                    if (coords) newClient.coords = coords;
                } catch(e) {}
            }

            if (!newClient.price) {
                let planVal = newClient.plan || 'Presencia';
                if (planVal === 'Basic') planVal = 'Presencia';
                newClient.price = String(getPlanPrice(planVal, newClient.industry));
                newClient.plan = planVal;
            }

            // Safer timeout pattern using Promise.race
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Supabase Creation Timeout (45s)")), 45000)
            );

            const insertPromise = (async () => {
                console.log(`📡 [Supabase] Sending insert for ${newClient.id}...`);
                const { data, error } = await supabase
                    .from('clients')
                    .insert([newClient])
                    .select();
                
                if (error) throw error;
                if (!data || data.length === 0) throw new Error("No data returned from insert");
                return data[0];
            })();

            const createdRecord = await Promise.race([insertPromise, timeoutPromise]);
            
            // OPTIMISTIC LOCAL CACHE RECOVERY
            if (typeof window !== 'undefined') {
                try {
                    const stored = localStorage.getItem('diic_clients');
                    const curr = stored ? JSON.parse(stored) : [];
                    localStorage.setItem('diic_clients', JSON.stringify([createdRecord, ...curr]));
                } catch (e) {
                    console.warn("⚠️ LocalStorage update skipped");
                }
            }

            console.log(`✅ [${timestamp}] Success: Client Created in ${Date.now() - startTime}ms (ID: ${createdRecord.id})`);
            return createdRecord;
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
                'editor', 'filmmaker', 'growth_level', 'business_type', 'industry', 'specialty',
                'birth_date', 'country', 'address', 'website', 'goals', 'brochure_url',
                'start_date', 'cutoff_day', 'app_fee', 'has_crm', 'has_agents', 'coords'
            ];
            const sanitizedUpdates = {};
            validFields.forEach(field => {
                if (updates[field] !== undefined) sanitizedUpdates[field] = updates[field];
            });

            if (updates.coords !== undefined) {
                sanitizedUpdates.coords = updates.coords;
            } else if (updates.address !== undefined || updates.city !== undefined) {
                const targetAddress = updates.address !== undefined ? updates.address : '';
                const targetCity = updates.city !== undefined ? updates.city : '';
                try {
                    const coords = await geocodeAddress(targetAddress, targetCity);
                    if (coords) {
                        sanitizedUpdates.coords = coords;
                    }
                } catch(e) {}
            }

            toast.info("Iniciando actualización en BD...", { id: 'debug-db' });
            
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Supabase timeout after 60s")), 60000)
            );

            const updatePromise = (async () => {
                const { data, error } = await supabase
                    .from('clients')
                    .update(sanitizedUpdates)
                    .eq('id', id)
                    .select();
                if (error) throw error;
                return data;
            })();

            const data = await Promise.race([
                updatePromise,
                timeoutPromise
            ]);

            toast.success("BD Clients actualizada", { id: 'debug-db' });

            // 🔄 SYNC TO PROFILE (Propagate Brand Identity)
            if (updates.name || updates.city || updates.whatsapp_number || updates.industry || updates.plan || updates.business_type || updates.specialty || updates.country || updates.address || updates.website || updates.goals || updates.brochure_url) {
                await agencyService.syncClientProfile(id, updates);
            }

            // OPTIMISTIC LOCAL CACHE SYNC
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

            return data[0];
        } catch (error) {
            console.error(`❌ [${timestamp}] Error in updateClient:`, error);
            throw error;
        }
    },

    /**
     * Dedicated method to ensure Profile matches Client data
     */
    /**
     * Dedicated method to ensure Profile matches Client data (The "Double Mirror" core logic)
     */
    syncClientProfile: async (clientId, updates) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🚀 [${timestamp}] Service: Syncing Client-Profile Mirror for ${clientId}...`);
        
        try {
            // 0. Fetch existing client first to preserve/merge onboarding_data if needed
            const { data: existingClient } = await supabase
                .from('clients')
                .select('*')
                .eq('id', clientId)
                .single();
            
            if (!existingClient) throw new Error("Client not found for sync");

            // Resolve fields dynamically from either Client fields, Profile fields, or existing database records
            const resolvedName = updates.name || updates.full_name || updates.brand_name || existingClient.name;
            const resolvedCity = updates.city || updates.location || existingClient.city;
            const resolvedWhatsapp = updates.whatsapp_number || updates.whatsapp || updates.phone || existingClient.whatsapp_number;
            const resolvedIndustry = updates.industry || updates.marketing_type || existingClient.industry;
            const resolvedSpecialty = updates.specialty || existingClient.specialty;
            let resolvedPlan = updates.plan || existingClient.plan;
            if (resolvedPlan === 'Basic') resolvedPlan = 'Presencia';
            const resolvedBusinessType = updates.business_type || existingClient.business_type;
            const resolvedCountry = updates.country || existingClient.country;
            const resolvedAddress = updates.address || existingClient.address;
            const resolvedWebsite = updates.website || existingClient.website;
            const resolvedGoals = updates.goals || existingClient.goals;
            const resolvedBrochureUrl = updates.brochure_url || existingClient.brochure_url;
            const resolvedStartDate = updates.start_date !== undefined ? updates.start_date : existingClient.start_date;
            const resolvedCutoffDay = updates.cutoff_day !== undefined ? updates.cutoff_day : existingClient.cutoff_day;
            const resolvedAppFee = updates.app_fee !== undefined ? updates.app_fee : existingClient.app_fee;
            const resolvedHasCrm = updates.has_crm !== undefined ? updates.has_crm : existingClient.has_crm;
            const resolvedHasAgents = updates.has_agents !== undefined ? updates.has_agents : existingClient.has_agents;

            let resolvedPrice = updates.price !== undefined ? updates.price : existingClient.price;
            if ((updates.plan && updates.plan !== existingClient.plan) || (updates.industry && updates.industry !== existingClient.industry)) {
                let planVal = updates.plan || existingClient.plan || 'Presencia';
                if (planVal === 'Basic') planVal = 'Presencia';
                resolvedPrice = String(getPlanPrice(planVal, updates.industry || existingClient.industry));
            }

            let resolvedCoords = updates.coords || existingClient.coords;
            if (updates.address !== undefined || updates.city !== undefined) {
                const targetAddress = updates.address !== undefined ? updates.address : existingClient.address;
                const targetCity = updates.city !== undefined ? updates.city : existingClient.city;
                if ((targetAddress && targetAddress !== existingClient.address) || (targetCity && targetCity !== existingClient.city) || !resolvedCoords) {
                    try {
                        const coords = await geocodeAddress(targetAddress, targetCity);
                        if (coords) resolvedCoords = coords;
                    } catch(e) {}
                }
            }

            // 1. Update Profile (User-facing side)
            const profileUpdates = {
                full_name: resolvedName,
                location: resolvedCity,
                whatsapp: resolvedWhatsapp,
                industry: resolvedIndustry,
                specialty: resolvedSpecialty,
                plan: resolvedPlan,
                business_type: resolvedBusinessType,
                country: resolvedCountry,
                address: resolvedAddress,
                website: resolvedWebsite,
                goals: resolvedGoals,
                brochure_url: resolvedBrochureUrl,
                start_date: resolvedStartDate,
                cutoff_day: resolvedCutoffDay,
                app_fee: resolvedAppFee,
                has_crm: resolvedHasCrm,
                has_agents: resolvedHasAgents,
                price: resolvedPrice,
                coords: resolvedCoords
            };
            
            // Clean undefined fields
            Object.keys(profileUpdates).forEach(key => 
                profileUpdates[key] === undefined && delete profileUpdates[key]
            );

            const { error: pError } = await supabase
                .from('profiles')
                .update(profileUpdates)
                .eq('client_id', clientId);

            if (pError) console.warn("⚠️ Profile sync warning:", pError.message);

            // 2. Sync fields to clients table to keep both sides completely aligned
            const clientUpdates = {
                name: resolvedName,
                city: resolvedCity,
                whatsapp_number: resolvedWhatsapp,
                industry: resolvedIndustry,
                specialty: resolvedSpecialty,
                plan: resolvedPlan,
                business_type: resolvedBusinessType,
                country: resolvedCountry,
                address: resolvedAddress,
                website: resolvedWebsite,
                goals: resolvedGoals,
                brochure_url: resolvedBrochureUrl,
                start_date: resolvedStartDate,
                cutoff_day: resolvedCutoffDay,
                app_fee: resolvedAppFee,
                has_crm: resolvedHasCrm,
                has_agents: resolvedHasAgents,
                price: resolvedPrice,
                coords: resolvedCoords
            };

            // Clean undefined fields
            Object.keys(clientUpdates).forEach(key => 
                clientUpdates[key] === undefined && delete clientUpdates[key]
            );

            // Update Client Brand Data (merge color/logo updates if provided)
            if (updates.primary_color || updates.secondary_color || updates.accent_color || updates.logo_url) {
                const existingOnboarding = existingClient.onboarding_data || {};
                clientUpdates.onboarding_data = {
                    ...existingOnboarding,
                    brand: {
                        ...(existingOnboarding.brand || {}),
                        primaryColor: updates.primary_color || existingOnboarding.brand?.primaryColor,
                        secondaryColor: updates.secondary_color || existingOnboarding.brand?.secondaryColor,
                        accentColor: updates.accent_color || existingOnboarding.brand?.accentColor,
                        logo: updates.logo_url || existingOnboarding.brand?.logo
                    }
                };
            }

            const { error: cError } = await supabase
                .from('clients')
                .update(clientUpdates)
                .eq('id', clientId);

            if (cError) console.warn("⚠️ Client sync warning:", cError.message);

            toast.success("Perfiles sincronizados", { id: 'debug-profile' });
            return { success: true };
        } catch (error) {
            console.error("❌ Sync Failure:", error);
            return { success: false, error };
        }
    },

    /**
     * Bulk Repairs all profiles based on current clients table
     */
    syncAllProfiles: async () => {
        console.log("🛠️ [Service] Starting Global Profile Sync...");
        toast.info("Sincronizando base de datos global...");
        try {
            const { data: clients, error } = await supabase.from('clients').select('*');
            if (error) throw error;
            let successCount = 0;
            for (const client of clients) {
                const res = await agencyService.syncClientProfile(client.id, client);
                if (res.success) successCount++;
            }
            toast.success(`Sincronización global finalizada: ${successCount}/${clients.length}`);
            return { success: true };
        } catch (err) {
            toast.error("Fallo en sincronización global");
            throw err;
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
                .maybeSingle();
            
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
            // 1. Nullify reference in profiles and change role to USER to avoid auto-sync recreation
            await supabase
                .from('profiles')
                .update({ client_id: null, role: 'USER' })
                .eq('client_id', id);

            // 2. Clean up other related records
            await supabase.from('content').delete().eq('client_id', id);
            await supabase.from('strategies').delete().eq('client_id', id);
            await supabase.from('crm_leads').delete().eq('client_id', id);
            await supabase.from('social_connections').delete().eq('client_id', id);
            await supabase.from('brand_connections').delete().eq('client_id', id);

            // 3. Delete from clients table
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id);

            if (error) throw error;
            console.log("Client deleted from Supabase", id);

            // 4. Update local cache
            if (typeof window !== 'undefined') {
                try {
                    const stored = localStorage.getItem('diic_clients');
                    if (stored) {
                        const curr = JSON.parse(stored);
                        const filtered = curr.filter(c => c.id !== id);
                        localStorage.setItem('diic_clients', JSON.stringify(filtered));
                    }
                } catch (e) {
                    console.warn("⚠️ LocalStorage cache update skipped on deletion");
                }
            }
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
            const tasks = localTasks ? JSON.parse(localTasks) : [];
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
            const { data: teamData, error: teamError } = await supabase
                .from('team')
                .select('*')
                .order('name', { ascending: true });

            if (teamError) throw teamError;

            // Map lowercase or incomplete roles from DB/onboarding to proper display roles
            const mapRoleToDisplay = (role) => {
                if (!role) return 'Creative';
                const r = role.toLowerCase().trim();
                if (r === 'editor') return 'Editor de Video';
                if (r === 'filmmaker') return 'Filmmaker';
                if (r === 'designer' || r === 'diseñador') return 'Diseñador';
                if (r === 'audio') return 'Ingeniería de Audio';
                if (r === 'community' || r === 'cm' || r === 'community manager') return 'Community Manager';
                if (r === 'photo' || r === 'fotografía') return 'Fotografía';
                if (r === 'model' || r === 'modelos') return 'Modelos';
                if (r === 'web' || r === 'desarrollo web') return 'Desarrollo Web';
                if (r === 'print' || r === 'imprenta / merch') return 'Imprenta / Merch';
                if (r === 'event' || r === 'eventos / prod') return 'Eventos / Prod';
                if (r === 'estratega') return 'Estratega';
                
                // Return capitalized version of original
                return role.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
            };

            const mappedTeamData = (teamData || []).map(member => ({
                ...member,
                role: mapRoleToDisplay(member.role)
            }));

            // 1. Fetch profiles that are creatives using case-insensitive ilike filters
            const { data: profiles, error: pError } = await supabase
                .from('profiles')
                .select('*')
                .not('role', 'ilike', 'client')
                .not('role', 'ilike', 'admin');

            if (!pError && Array.isArray(profiles)) {
                // Normalize names for comparison
                const normalizeName = (n) => (n || '').toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^\w]/g, '')
                    .trim();

                const teamEmails = new Set(
                    (mappedTeamData)
                        .map(t => (t.email || '').toLowerCase().trim())
                        .filter(Boolean)
                );

                const teamNames = new Set((mappedTeamData).map(t => normalizeName(t.name)));
                
                const missingCreatives = profiles.filter(p => {
                    if (!p.full_name) return false;
                    
                    const pEmail = (p.email || '').toLowerCase().trim();
                    const pNameNorm = normalizeName(p.full_name);
                    
                    // If team already has this email, it's NOT missing!
                    if (pEmail && teamEmails.has(pEmail)) return false;
                    
                    // If team already has this name, it's NOT missing!
                    if (teamNames.has(pNameNorm)) return false;
                    
                    return true;
                });

                if (missingCreatives.length > 0) {
                    console.log(`✨ [${timestamp}] Found ${missingCreatives.length} missing creatives in profiles. Auto-syncing to team...`);
                    
                    const inserts = missingCreatives.map(p => {
                        let dbRole = 'Creative';
                        const pRole = (p.role || '').toUpperCase();
                        if (pRole === 'FILMMAKER') dbRole = 'Filmmaker';
                        else if (pRole === 'EDITOR') dbRole = 'Editor de Video';
                        else if (pRole === 'COMMUNITY' || pRole === 'CM') dbRole = 'Community Manager';
                        else if (pRole === 'DESIGNER' || pRole === 'DESIGN') dbRole = 'Diseñador';
                        else if (pRole === 'AUDIO') dbRole = 'Ingeniería de Audio';
                        else if (pRole === 'FOTOGRAFIA' || pRole === 'FOTO') dbRole = 'Fotografía';
                        else if (pRole === 'MODELO' || pRole === 'MODEL') dbRole = 'Modelos';
                        else if (pRole === 'WEB') dbRole = 'Desarrollo Web';
                        else if (pRole === 'PRINT' || pRole === 'IMPRENTA') dbRole = 'Imprenta / Merch';
                        else if (pRole === 'EVENT' || pRole === 'EVENTO') dbRole = 'Eventos / Prod';
                        else if (pRole === 'ESTRATEGA') dbRole = 'Estratega';

                        return {
                            id: `TEAM-${Math.floor(1000 + Math.random() * 9000)}`,
                            name: p.full_name,
                            role: dbRole,
                            status: 'activo',
                            city: p.location || 'Santo Domingo',
                            availability: 'full-time',
                            activetasks: 0,
                            salary: 0,
                            cv_url: p.cv_url || '',
                            cv_summary: p.cv_summary || '',
                            skills: p.skills || [],
                            whatsapp: p.whatsapp || '',
                            email: p.email || null
                        };
                    });

                    const { data: insertedData, error: insertErr } = await supabase
                        .from('team')
                        .upsert(inserts, { onConflict: 'name' })
                        .select();

                    if (!insertErr && Array.isArray(insertedData)) {
                        const mappedInserts = insertedData.map(member => ({
                            ...member,
                            role: mapRoleToDisplay(member.role)
                        }));
                        mappedTeamData.push(...mappedInserts);
                        // Sort mappedTeamData by name again
                        mappedTeamData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                        console.log(`✅ [${timestamp}] Auto-sync complete: synced ${insertedData.length} members`);
                    } else {
                        console.warn(`⚠️ [${timestamp}] Auto-sync insert failed:`, insertErr?.message || insertErr);
                    }
                }
            }

            if (typeof window !== 'undefined' && Array.isArray(mappedTeamData)) {
                localStorage.setItem('diic_team', JSON.stringify(mappedTeamData));
            }

            return mappedTeamData || [];
        } catch (error) {
            console.error(`❌ [${timestamp}] Error in getTeam:`, error);
            return [];
        }
    },

    getClientSquad: async (clientId) => {
        try {
            const client = await agencyService.getClientById(clientId);
            if (!client || !client.cm) return null;

            const team = await agencyService.getTeam();
            const normalizedCMName = client.cm.toLowerCase().trim();
            const cmRecord = team.find(m => 
                m.name.toLowerCase().includes(normalizedCMName) && 
                (m.role.toLowerCase().includes('community') || m.role.toLowerCase().includes('cm'))
            );

            if (!cmRecord) {
                // Si no encontramos un CM exacto, buscamos solo por nombre
                const cmFallback = team.find(m => m.name.toLowerCase().includes(normalizedCMName));
                if (!cmFallback) return null;
                
                const creatives = team.filter(m => m.squad_lead_id === cmFallback.id);
                return { client, cm: cmFallback, creatives };
            }

            const creatives = team.filter(m => m.squad_lead_id === cmRecord.id);
            return { client, cm: cmRecord, creatives };
        } catch (error) {
            console.error("Error fetching client squad:", error);
            return null;
        }
    },

    createTeamMember: async (memberData) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🚀 [${timestamp}] Service: Creating New Team Member...`);
        try {
            const validFields = [
                'id', 'name', 'role', 'status', 'city', 'whatsapp', 
                'salary', 'email', 'cv_url', 'cv_summary', 'skills',
                'birth_date', 'address', 'coords'
            ];
            const sanitizedData = {};
            validFields.forEach(field => {
                if (memberData[field] !== undefined) sanitizedData[field] = memberData[field];
            });

            const newMember = {
                ...sanitizedData,
                id: memberData.id || `M-${Math.floor(Math.random() * 9000) + 1000}`,
                status: memberData.status || 'activo',
                created_at: new Date().toISOString()
            };

            if (newMember.address && !newMember.coords) {
                try {
                    const coords = await geocodeAddress(newMember.address, newMember.city);
                    if (coords) newMember.coords = coords;
                } catch(e) {}
            }

            const { data, error } = await supabase
                .from('team')
                .insert([newMember])
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
                'whatsapp', 'email', 'birth_date', 'address'
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

            if (updates.coords !== undefined) {
                sanitizedUpdates.coords = updates.coords;
            } else if (updates.address !== undefined || updates.city !== undefined) {
                const targetAddress = updates.address !== undefined ? updates.address : '';
                const targetCity = updates.city !== undefined ? updates.city : '';
                try {
                    const coords = await geocodeAddress(targetAddress, targetCity);
                    if (coords) {
                        sanitizedUpdates.coords = coords;
                    }
                } catch(e) {}
            }

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
                let planDef = allServices.find(s => s.id === planId || s.name?.toLowerCase().includes(planId));
                
                // Fallback to PLAN_OPTIONS from constants if DB service not found
                if (!planDef && typeof window !== 'undefined') {
                    // Try to get from imported constants if possible, or we just rely on dynamic matching below
                }

                let clientCost = 0;
                let clientIncome = client.status === 'active' ? (Number(client.price) || 0) : 0;
                totalMRR += clientIncome;

                let deliv = planDef ? planDef.deliverables : null;

                if (!deliv) {
                    // Hardcoded fallback logic matching lib/constants.js PLAN_OPTIONS
                    if (planId?.includes('presencia')) deliv = { videos: 3, posts: 6, strategy: 1, cm: 1 };
                    else if (planId?.includes('crecimiento')) deliv = { videos: 5, posts: 8, strategy: 1, cm: 1 };
                    else if (planId?.includes('autoridad')) deliv = { videos: 7, posts: 11, strategy: 1, cm: 1 };
                    else if (planId?.includes('control')) deliv = { videos: 10, posts: 16, strategy: 1, cm: 1 };
                }

                if (deliv) {
                    // Calculate based on the unit-cost model provided by user
                    clientCost += (Number(deliv.videos) || 0) * (costMap['vid_promo'] || 45);
                    clientCost += (Number(deliv.reels) || 0) * (costMap['reel_prod'] || 25);
                    clientCost += (Number(deliv.posts) || 0) * (costMap['post_simple'] || 4);
                    
                    // Fixed Service Costs per client (Real Structure)
                    if (deliv.cm) clientCost += (costMap['cm_service'] || 25);
                    if (deliv.strategy) clientCost += (costMap['strategy_unit'] || 25);
                } else {
                    // Fallback to average if no plan is found at all
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
                income: financial?.metrics?.income || 0,
                estimated_production: financial?.metrics?.variable_costs || 0,
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
                    status: 'trial',
                    whatsapp: data.whatsapp,
                });
            }
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
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
