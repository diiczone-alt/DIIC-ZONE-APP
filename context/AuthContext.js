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

    const fetchProfile = async (userId, email = null) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role, client_id, full_name, xp, level, rank')
                .eq('id', userId)
                .single();
                
            if (error) {
                console.warn('[AuthContext] Profile fetch error:', error.message);
                // Emergency Fallback for known admin email
                if (email === 'diiczone@gmail.com') {
                    return { role: 'ADMIN', client_id: null, full_name: 'Admin DIIC' };
                }
                return { role: 'CLIENT', client_id: null, full_name: null };
            }

            // Return data with fallback values for each field
            let role = data?.role || 'CLIENT';
            let fullName = data?.full_name || (email === 'diiczone@gmail.com' ? 'Admin DIIC' : null);
            let teamId = null;
            
            // Safety: If email is the admin email, force ADMIN role
            if (email === 'diiczone@gmail.com') role = 'ADMIN';

            // Lookup team_id for CMs to enable squad filtering
            if ((role === 'COMMUNITY' || role === 'CM') && fullName) {
                const { data: teamData } = await supabase
                    .from('team')
                    .select('id')
                    .eq('name', fullName)
                    .eq('role', 'Community Manager')
                    .single();
                if (teamData) teamId = teamData.id;
            }

            return {
                role: role,
                client_id: data?.client_id || null,
                full_name: fullName,
                team_id: teamId
            };
        } catch (err) {
            console.error('[AuthContext] Unexpected fetchProfile error:', err);
            if (email === 'diiczone@gmail.com') {
                return { role: 'ADMIN', client_id: null, full_name: 'Admin DIIC' };
            }
            return { role: 'CLIENT', client_id: null, full_name: null };
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check active session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;
                
                setSession(session);
                
                if (session?.user) {
                    const profile = await fetchProfile(session.user.id, session.user.email);
                    setUser({ ...session.user, ...profile });
                    localStorage.setItem('user_role', profile.role);
                    if (profile.client_id) localStorage.setItem('client_id', profile.client_id);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('[AuthContext] Auth initialization failed:', err);
                setUser(null);
                setSession(null);
            } finally {
                setLoading(false);
            }

            // Listen for changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                setSession(session);
                if (session?.user) {
                    const profile = await fetchProfile(session.user.id, session.user.email);
                    setUser({ ...session.user, ...profile });
                    localStorage.setItem('user_role', profile.role || 'CLIENT');
                    if (profile.client_id) localStorage.setItem('client_id', profile.client_id);
                } else {
                    setUser(null);
                    localStorage.removeItem('user_role');
                    localStorage.removeItem('client_id');
                }
            });

            return () => subscription.unsubscribe();
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            console.log('[AuthContext] login() started');
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.warn('[AuthContext] Login error caught:', error.message);
                return { error };
            }
            
            console.log('[AuthContext] Fetching profile for user', data.user?.id);
            const profile = await fetchProfile(data.user.id, email);
            
            const userObj = { ...data.user, ...profile };
            setUser(userObj);
            setSession(data.session);
            localStorage.setItem('user_role', profile.role);
            if (profile.client_id) localStorage.setItem('client_id', profile.client_id);
            
            return { data, role: profile.role, error: null };
        } catch (err) {
            console.error('[AuthContext] Unexpected login exception:', err);
            return { error: err };
        }
    };

    const register = async (email, password, metadata = {}) => {
        console.log('[AuthContext] register() started');
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: metadata.full_name || '',
                    role: metadata.role || 'CLIENT',
                    brand: metadata.brand || '',
                    city: metadata.city || '',
                    ...metadata
                }
            }
        });

        if (error) throw error;
        
        // Profiles are created by DB trigger
        // If 'data.session' is null, it means email confirmation is required by Supabase
        const needsConfirmation = !data.session;
        
        if (data.session && data.user) {
            const profile = await fetchProfile(data.user.id, email);
            setUser({ ...data.user, ...profile });
            setSession(data.session);
        }
        
        return { data, needsConfirmation };
    };

    const refreshUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session?.user) {
            const profile = await fetchProfile(session.user.id, session.user.email);
            setUser({ ...session.user, ...profile });
        }
    };

    const signInWithGoogle = async (metadata = {}) => {
        console.log('[AuthContext] signInWithGoogle() started');
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/dashboard',
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                data: {
                    full_name: metadata.full_name || '',
                    role: metadata.role || 'CLIENT',
                    brand: metadata.brand || '',
                    city: metadata.city || ''
                }
            }
        });

        if (error) throw error;
        return data;
    };

    const resetPassword = async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/auth/reset-password',
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        localStorage.clear();
        router.push('/');
    };

    const getHomeRoute = (role) => {
        const safeRole = (role || 'CLIENT').toUpperCase();
        if (safeRole === 'ADMIN') return '/dashboard/hq';
        if (safeRole === 'CLIENT') return '/dashboard';
        
        const roleRoutes = {
            COMMUNITY: '/workstation/community-manager',
            CM: '/workstation/community-manager',
            EDITOR: '/dashboard/editing',
            DESIGN: '/dashboard/design',
            CREATOR: '/dashboard/creative-zone',
        };
        return roleRoutes[safeRole] || '/dashboard';
    };

    const value = {
        user,
        session,
        loading,
        login,
        register,
        signInWithGoogle,
        logout,
        refreshUser,
        resetPassword,
        getHomeRoute
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
