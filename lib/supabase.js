
import { createClient } from '@supabase/supabase-js'
import { MOCK_DATA } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabaseClient

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials missing. App running in UI-only mode with mock data (LocalStorage).')

    // Helper to simulate DB delay
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Improved Mock with LocalStorage Persistence
    const createChainableMock = (tableName, currentData = null, mutationInfo = null) => {
        const mock = {
            select: function () {
                console.log(`[MockDB] select from ${tableName}`);
                const stored = typeof window !== 'undefined' ? localStorage.getItem(`mock_db_${tableName}`) : null;
                const data = stored ? JSON.parse(stored) : (MOCK_DATA[tableName] || []);
                return createChainableMock(tableName, data);
            },
            order: function (col, { ascending }) {
                if (!currentData) return this;
                const sorted = [...currentData].sort((a, b) => {
                    const valA = a[col];
                    const valB = b[col];
                    if (valA < valB) return ascending ? -1 : 1;
                    if (valA > valB) return ascending ? 1 : -1;
                    return 0;
                });
                return createChainableMock(tableName, sorted);
            },
            eq: function (col, val) {
                console.log(`[MockDB] eq filter: ${col} = ${val}`);
                
                // If we are in a selection flow
                if (currentData) {
                    const filtered = currentData.filter(item => item[col] === val);
                    return createChainableMock(tableName, filtered, mutationInfo);
                }
                
                // If we are in a mutation flow (tracking filter for update/delete)
                return createChainableMock(tableName, null, { ...(mutationInfo || {}), filter: { col, val } });
            },
            ilike: function (col, val) {
                console.log(`[MockDB] ilike filter: ${col} matches ${val}`);
                if (!currentData) return this;
                const searchStr = val.replace(/%/g, '').toLowerCase();
                const filtered = currentData.filter(item => 
                    item[col] && item[col].toString().toLowerCase().includes(searchStr)
                );
                return createChainableMock(tableName, filtered, mutationInfo);
            },
            in: function () { return this; },
            limit: function (n) {
                if (!currentData) return this;
                return createChainableMock(tableName, currentData.slice(0, n));
            },
            single: async function () {
                await delay(100);
                return { data: currentData && currentData.length > 0 ? currentData[0] : {}, error: null };
            },
            update: function (updates) {
                console.log(`[MockDB] queueing update in ${tableName}:`, updates);
                return createChainableMock(tableName, null, { type: 'update', updates });
            },
            insert: function (item) {
                console.log(`[MockDB] queueing insert into ${tableName}:`, item);
                const itemsToAdd = Array.isArray(item) ? item : [item];
                const newItems = itemsToAdd.map(it => ({ 
                    id: it.id || Math.floor(Math.random() * 900000) + 100000, 
                    status: 'active',
                    ...it 
                }));
                
                // Persist immediately for mock
                if (typeof window !== 'undefined') {
                    const stored = localStorage.getItem(`mock_db_${tableName}`);
                    const prevData = stored ? JSON.parse(stored) : (MOCK_DATA[tableName] || []);
                    localStorage.setItem(`mock_db_${tableName}`, JSON.stringify([...prevData, ...newItems]));
                }

                return createChainableMock(tableName, newItems);
            },
            delete: function () { 
                console.log(`[MockDB] queueing delete from ${tableName}`);
                return createChainableMock(tableName, null, { type: 'delete' });
            },
            upsert: function (item) {
                console.log(`[MockDB] upsert into ${tableName}:`, item);
                const itemsToUpsert = Array.isArray(item) ? item : [item];
                
                if (typeof window !== 'undefined') {
                    const stored = localStorage.getItem(`mock_db_${tableName}`);
                    let currentRecords = stored ? JSON.parse(stored) : (MOCK_DATA[tableName] || []);
                    
                    itemsToUpsert.forEach(newItem => {
                        const index = currentRecords.findIndex(r => r.id === newItem.id);
                        if (index !== -1) {
                            currentRecords[index] = { ...currentRecords[index], ...newItem };
                        } else {
                            currentRecords.push({ id: Math.floor(Math.random() * 900000) + 100000, ...newItem });
                        }
                    });
                    
                    localStorage.setItem(`mock_db_${tableName}`, JSON.stringify(currentRecords));
                }
                return createChainableMock(tableName, itemsToUpsert);
            },
            then: function (resolve) { 
                // Handle pending Mutations
                if (mutationInfo && typeof window !== 'undefined') {
                    const stored = localStorage.getItem(`mock_db_${tableName}`);
                    let allData = stored ? JSON.parse(stored) : (MOCK_DATA[tableName] || []);
                    let affectedItems = [];

                    if (mutationInfo.type === 'update' && mutationInfo.filter) {
                        allData = allData.map(item => {
                            if (item[mutationInfo.filter.col] === mutationInfo.filter.val) {
                                const updated = { ...item, ...mutationInfo.updates };
                                affectedItems.push(updated);
                                return updated;
                            }
                            return item;
                        });
                    } else if (mutationInfo.type === 'delete' && mutationInfo.filter) {
                        allData = allData.filter(item => {
                            if (item[mutationInfo.filter.col] === mutationInfo.filter.val) {
                                affectedItems.push(item);
                                return false;
                            }
                            return true;
                        });
                    }

                    localStorage.setItem(`mock_db_${tableName}`, JSON.stringify(allData));
                    resolve({ data: affectedItems, error: null });
                } else {
                    // Selection flow
                    resolve({ data: currentData, error: null }); 
                }
            },
        };
        return mock;
    };

    supabaseClient = {
        from: (table) => {
            return createChainableMock(table);
        },
        auth: {
            getUser: () => Promise.resolve({ data: { user: { id: '46db6cc3-a1eb-4993-9c8e-5b2da24a8738', email: 'leslie@diic.zone' } }, error: null }),
            getSession: () => Promise.resolve({ data: { session: { user: { id: '46db6cc3-a1eb-4993-9c8e-5b2da24a8738', email: 'leslie@diic.zone' } } }, error: null }),
            signInWithPassword: ({ email, password }) => {
                console.log('MOCK AUTH: Signed in', email);
                return Promise.resolve({ data: { user: { id: '46db6cc3-a1eb-4993-9c8e-5b2da24a8738', email }, session: { access_token: 'mock-token' } }, error: null });
            },
            signOut: () => {
                console.log('MOCK AUTH: Signed out');
                return Promise.resolve({ error: null });
            },
            onAuthStateChange: (callback) => {
                return { data: { subscription: { unsubscribe: () => { } } } };
            }
        }
    }
} else {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseClient
