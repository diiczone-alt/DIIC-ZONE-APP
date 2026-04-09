'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchProfile = async (userId) => {
        const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).single();
        if (error) console.error('Error fetching profile:', error);
        return data?.role || 'CLIENT';
    };

    useEffect(() => {
        const initializeAuth = async () => {
            // Check active session
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            
            if (session?.user) {
                const role = await fetchProfile(session.user.id);
                setUser({ ...session.user, role });
                localStorage.setItem('user_role', role); // Fallback for components that haven't been updated
            } else {
                setUser(null);
            }

            // Listen for changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                setSession(session);
                if (session?.user) {
                    const role = await fetchProfile(session.user.id);
                    setUser({ ...session.user, role });
                    localStorage.setItem('user_role', role);
                } else {
                    setUser(null);
                }
            });

            setLoading(false);

            return () => subscription.unsubscribe();
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        console.log('[AuthContext] login() started');
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        console.log('[AuthContext] signInWithPassword done. error:', error, 'data:', data);

        if (error) throw error;
        
        console.log('[AuthContext] Fetching profile for user', data.user?.id);
        const role = await fetchProfile(data.user.id);
        
        console.log('[AuthContext] Got role:', role);
        // Eagerly set state to prevent race conditions con layout guards
        const userObj = { ...data.user, role };
        setUser(userObj);
        setSession(data.session);
        localStorage.setItem('user_role', role);
        
        console.log('[AuthContext] login() completed. Returning role.');
        // Return data and role so the caller (page.js) handles the redirect independently!
        return { data, role };
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        router.push('/login');
    };

    const value = {
        user,
        session,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
