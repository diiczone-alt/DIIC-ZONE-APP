
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
    const createChainableMock = (tableName, currentData = null) => {
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
                if (!currentData) return this;
                const filtered = currentData.filter(item => item[col] === val);
                return createChainableMock(tableName, filtered);
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
                console.log(`[MockDB] update in ${tableName}:`, updates);
                // Return this so .eq() can be called
                return this; 
            },
            insert: function (item) {
                console.log(`[MockDB] queueing insert into ${tableName}:`, item);
                const itemsToAdd = Array.isArray(item) ? item : [item];
                const newItems = itemsToAdd.map(it => ({ 
                    id: it.id || Math.floor(Math.random() * 900000) + 100000, 
                    status: 'active',
                    ...it 
                }));
                
                // Add to currentData so select() can see it
                const updatedData = [...(currentData || []), ...newItems];
                
                // Persist immediately for mock
                if (typeof window !== 'undefined') {
                    const stored = localStorage.getItem(`mock_db_${tableName}`);
                    const prevData = stored ? JSON.parse(stored) : [];
                    localStorage.setItem(`mock_db_${tableName}`, JSON.stringify([...prevData, ...newItems]));
                }

                return createChainableMock(tableName, newItems); // The result of insert().select() should be the new items
            },
            delete: function () { 
                console.log(`[MockDB] delete from ${tableName}`);
                // Return this so .eq() can be called
                return this;
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
                    currentData = currentRecords;
                }
                return createChainableMock(tableName, itemsToUpsert);
            },
            then: function (resolve) { 
                resolve({ data: currentData, error: null }); 
            },
        };
        return mock;
    };

    supabaseClient = {
        from: (table) => {
            return createChainableMock(table);
        },
        auth: {
            getUser: () => Promise.resolve({ data: { user: { id: 'mock-user-id', email: 'demo@diic.zone' } }, error: null }),
            getSession: () => Promise.resolve({ data: { session: { user: { id: 'mock-user-id', email: 'demo@diic.zone' } } }, error: null }),
            signInWithPassword: ({ email, password }) => {
                console.log('MOCK AUTH: Signed in', email);
                return Promise.resolve({ data: { user: { id: 'mock-user-id', email }, session: { access_token: 'mock-token' } }, error: null });
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
