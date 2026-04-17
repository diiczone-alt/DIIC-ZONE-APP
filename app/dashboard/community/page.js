'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CommunityDashboard from '@/components/community/CommunityDashboard';
import DepartmentWelcome from '@/components/ui/DepartmentWelcome';

export default function CommunityPage() {
    const { user, getHomeRoute } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            const home = getHomeRoute(user.role);
            if (home && home !== '/dashboard/community') {
                router.push(home);
            }
        }
    }, [user, getHomeRoute, router]);

    return (
        <div className="bg-[#050511] min-h-screen text-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 animate-pulse">
                    Redireccionando a la Estación CM...
                </span>
            </div>
        </div>
    );
}
