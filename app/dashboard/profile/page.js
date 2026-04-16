'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ClientProfileHub from '@/components/profile/ClientProfileHub';

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            const role = user.role || 'CLIENT';
            
            // Dispatcher Logic: Redirect non-clients to their primary zones if they shouldn't see Client Hub
            if (role === 'ADMIN') {
                // Admins belong in the HQ / Strategic board
                router.replace('/dashboard/strategy');
            } else if (role === 'CREATOR' || role === 'CM' || role === 'COMMUNITY') {
                // Talent/CMs belong in their Workstations
                router.replace('/workstation/community-manager');
            } else {
                // Clients see the Profile Hub
                setIsAuthorized(true);
            }
        } else if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

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
