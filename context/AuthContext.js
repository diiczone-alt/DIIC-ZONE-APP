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
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        
        // El useEffect actualiza el estado y hace el redirect gracias al listende auth, pero podemos forzar el route
        const role = await fetchProfile(data.user.id);
        
        // Lógica de Redirección basada en Rol Real
        if (role === 'ADMIN') router.push('/admin/strategy/map');
        else if (role === 'CLIENT') router.push('/dashboard');
        else router.push(`/dashboard/creative-zone/${role.toLowerCase()}`);
        
        return data;
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
