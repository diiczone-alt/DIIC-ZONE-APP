'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSyncingTokens, setIsSyncingTokens] = useState(false);
    const router = useRouter();

    const fetchProfile = async (userId, email = null, metadata = null) => {
        console.log(`[AuthContext] fetchProfile start for ${userId} (${email || 'no-email'})`);
        try {
            // First attempt: Database Profile
            const { data, error } = await supabase
                .from('profiles')
                .select('role, client_id, full_name, xp, level, rank')
                .eq('id', userId)
                .single();
                
            let role = data?.role;
            let fullName = data?.full_name;
            let client_id = data?.client_id;

            // Second attempt: Fallback to metadata if DB fails or is empty
            if (error || !role) {
                console.warn('[AuthContext] Profile fetch error or empty, using metadata fallback:', error?.message);
                
                // Emergency hardcoded fallback for known CM (Leslie)
                if (email === 'leslie.xio59@gmail.com') {
                    role = 'COMMUNITY';
                    fullName = 'Leslie';
                } else {
                    role = metadata?.role || (email === 'diiczone@gmail.com' ? 'ADMIN' : 'CLIENT');
                    fullName = metadata?.full_name || (email === 'diiczone@gmail.com' ? 'Admin DIIC' : null);
                }
                client_id = metadata?.client_id || null;
            }

            let teamId = null;
            
            // Normalize role
            const adminEmails = ['diiczone@gmail.com', 'admin@diiczone.com'];
            if (email && adminEmails.includes(email.toLowerCase())) {
                role = 'ADMIN';
            }

            // Lookup team_id for CMs - WRAPPED IN SUB-TRY-CATCH to prevent hang
            if ((role === 'COMMUNITY' || role === 'CM') && fullName) {
                try {
                    console.log(`[AuthContext] Looking up team ID for CM: ${fullName}`);
                    const { data: teamData, error: teamError } = await supabase
                        .from('team')
                        .select('id')
                        .eq('name', fullName)
                        .eq('role', 'Community Manager')
                        .single();
                    
                    if (teamError) {
                        console.warn('[AuthContext] Team lookup non-fatal error:', teamError.message);
                    } else if (teamData) {
                        teamId = teamData.id;
                    }
                } catch (teamEx) {
                    console.error('[AuthContext] Team lookup exception (ignoring):', teamEx);
                }
            }

            console.log(`[AuthContext] Profile loaded successfully for ${fullName} (${role})`);
            return {
                role: role,
                client_id: client_id,
                full_name: fullName,
                team_id: teamId,
                industry: data?.industry || metadata?.industry || 'general',
                industry_slug: data?.industry_slug || metadata?.industry_slug || 'general',
                client_slug: data?.client_slug || metadata?.client_slug || 'default',
                onboarding_completed: metadata?.onboarding_completed || false
            };
        } catch (err) {
            console.error('[AuthContext] Unexpected fetchProfile error:', err);
            return { role: 'CLIENT', client_id: null, full_name: null };
        }
    };

    useEffect(() => {
        let authSubscription = null;
        let active = true;

        const initializeAuth = async () => {
            try {
                setLoading(true);

                // 🚀 TEMPORARY BYPASS: God Mode for unrestricted access
                if (typeof window !== 'undefined') {
                    const searchParams = new URLSearchParams(window.location.search);
                    if (searchParams.get('godmode') === 'true' || localStorage.getItem('diic_god_mode') === 'true') {
                        console.log('🚀 [AuthContext] GOD MODE ACTIVE - Bypassing Authentication');
                        localStorage.setItem('diic_god_mode', 'true');
                        setUser({
                            id: 'god-user',
                            email: 'admin@diiczone.com',
                            role: 'ADMIN',
                            full_name: 'Director General (God Mode)',
                            user_metadata: { role: 'ADMIN', full_name: 'Director General' }
                        });
                        setLoading(false);
                        return;
                    }
                }

                const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
                
                if (!active) return;
                if (sessionError) throw sessionError;

                if (initialSession) {
                    setSession(initialSession);
                    setUser(initialSession.user);
                    
                    const profileData = await fetchProfile(initialSession.user.id, initialSession.user.email, initialSession.user.user_metadata);
                    if (active) {
                        setUser(prev => ({ ...prev, ...profileData }));
                        console.log('✅ [AuthContext] Extended Profile Loaded');
                    }
                } else if (active) {
                    setUser(null);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('[AuthContext] Auth initialization failed:', err);
                }
                if (active) {
                    setUser(null);
                    setSession(null);
                }
            } finally {
                if (active) setLoading(false);
            }

            // Detect Hash Errors (like #error=otp_expired)
            if (active && typeof window !== 'undefined' && window.location.hash) {
                const hash = window.location.hash.substring(1);
                const params = new URLSearchParams(hash);
                
                if (params.get('error')) {
                    const errorCode = params.get('error_code');
                    const errorDesc = params.get('error_description')?.replace(/\+/g, ' ');
                    
                    console.error('[AuthContext] Auth error detected in URL:', { errorCode, errorDesc });
                    
                    if (errorCode === 'otp_expired' || errorDesc?.includes('expired')) {
                        toast.error('El enlace de verificación ha expirado. Por favor, intenta iniciar sesión para generar uno nuevo o continuar.', { duration: 6000 });
                        
                        if (window.location.pathname === '/' && localStorage.getItem('diic_onboarding_progress')) {
                            router.push('/onboarding');
                        }
                    } else if (params.get('error')) {
                        toast.error(`Error de Authenticación: ${errorDesc || params.get('error')}`);
                    }
                    
                    window.history.replaceState(null, null, window.location.pathname);
                }
            }

            // Listen for changes - Wrapped in active check to prevent concurrent lock attempts
            if (active) {
                const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                    if (!active) return;
                    setSession(session);
                    if (session?.user) {
                        const profile = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
                        if (active) {
                            setUser({ ...session.user, ...profile });
                            localStorage.setItem('user_role', profile.role || 'CLIENT');
                            if (profile.client_id) localStorage.setItem('client_id', profile.client_id);
                        }
                    } else if (active) {
                        setUser(null);
                        localStorage.removeItem('user_role');
                        localStorage.removeItem('client_id');
                    }
                });
                
                authSubscription = subscription;
            }
        };

        initializeAuth();

        return () => {
            active = false;
            if (authSubscription) authSubscription.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        try {
            console.group('[AuthContext] Login Process');
            console.log('Initiating sign in for:', email);
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.warn('Login failed:', error.message);
                console.groupEnd();
                return { error };
            }
            
            console.log('Sign in success, loading profile...');
            const profile = await fetchProfile(data.user.id, email, data.user.user_metadata);
            
            const userObj = { ...data.user, ...profile };
            
            // Critical: Update state immediately
            setUser(userObj);
            setSession(data.session);
            
            // Persist for quick access
            localStorage.setItem('user_role', profile.role);
            if (profile.client_id) localStorage.setItem('client_id', profile.client_id);
            
            console.log('Login logic complete for role:', profile.role);
            console.groupEnd();
            return { data, role: profile.role, error: null };
        } catch (err) {
            console.error('Fatal login exception:', err);
            console.groupEnd();
            return { error: err };
        }
    };

    const register = async (email, password, metadata = {}) => {
        console.log('[AuthContext] register() started');
        
        // Define redirect URL to return to onboarding
        const redirectUrl = typeof window !== 'undefined' 
            ? `${window.location.origin}/onboarding?type=${metadata.type || 'client'}`
            : undefined;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectUrl,
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
            const profile = await fetchProfile(data.user.id, email, data.user.user_metadata);
            setUser({ ...data.user, ...profile });
            setSession(data.session);
        }
        
        return { data, needsConfirmation };
    };

    const refreshUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session?.user) {
            const profile = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
            setUser({ ...session.user, ...profile });
        }
    };

    const signInWithGoogle = async (metadata = {}) => {
        console.log('[AuthContext] signInWithGoogle() started');
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: typeof window !== 'undefined' 
                    ? (window.location.pathname.includes('onboarding') ? window.location.href : window.location.origin + '/dashboard')
                    : undefined,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                scopes: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
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
        if (error) {
            console.warn('Logout error (might be already signed out):', error.message);
        }
        localStorage.clear();
        localStorage.removeItem('diic_god_mode');
        router.push('/');
    };

    const syncGoogleTokens = async (clientId, accessToken, refreshToken, email) => {
        if (isSyncingTokens) return;
        setIsSyncingTokens(true);
        console.log(`[AuthContext] Syncing Google Tokens for client: ${clientId}`);
        try {
            const { error } = await supabase
                .from('clients')
                .update({
                    google_access_token: accessToken,
                    google_refresh_token: refreshToken,
                    google_connected_email: email,
                    sync_active: true
                })
                .eq('id', clientId);
            
            if (error) throw error;
            console.log('[AuthContext] Google Tokens synced successfully.');
        } catch (err) {
            console.error('[AuthContext] Google Token sync failed:', err.message);
        } finally {
            setIsSyncingTokens(false);
        }
    };

    const getHomeRoute = (role, industrySlug = null, clientSlug = null) => {
        const safeRole = (role || 'CLIENT').toUpperCase();
        if (safeRole === 'ADMIN') return '/dashboard/hq';
        
        if (safeRole === 'CLIENT') {
            if (industrySlug && clientSlug) {
                return `/dashboard/${industrySlug}/${clientSlug}`;
            }
            return '/dashboard';
        }
        
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
