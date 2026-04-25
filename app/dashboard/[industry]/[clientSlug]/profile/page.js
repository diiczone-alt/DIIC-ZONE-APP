'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ClientProfileHub from '@/components/profile/ClientProfileHub';

export default function DynamicProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            const role = user.role || 'CLIENT';
            
            // Dispatcher Logic: Redirect non-clients to their primary zones
            if (role === 'ADMIN') {
                router.replace('/dashboard/strategy');
            } else if (role === 'CREATOR' || role === 'CM' || role === 'COMMUNITY') {
                router.replace('/workstation/community-manager');
            } else {
                // Clients see the Profile Hub
                // Optional: Verify if slugs match the user's slugs for security
                const userIndustrySlug = user.industry_slug || 'general';
                const userClientSlug = user.client_slug || 'default';

                if (params.industry !== userIndustrySlug || params.clientSlug !== userClientSlug) {
                    console.warn('[DynamicProfile] Slug mismatch detected, redirecting to canonical path');
                    router.replace(`/dashboard/${userIndustrySlug}/${userClientSlug}/profile`);
                } else {
                    setIsAuthorized(true);
                }
            }
        } else if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router, params]);

    if (loading || (!isAuthorized && user)) {
        return (
            <div className="min-h-screen bg-[#050511] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-t-2 border-indigo-500 rounded-full animate-spin" />
                <p className="text-white font-black uppercase tracking-[0.3em] text-[10px] italic animate-pulse">
                    Sincronizando Identidad...
                </p>
            </div>
        );
    }

    return <ClientProfileHub />;
}
