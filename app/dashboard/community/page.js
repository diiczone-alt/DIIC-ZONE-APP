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
            // Solo redirigir si el rol NO es CLIENT ni COMMUNITY/CM
            const isAllowed = user.role === 'CLIENT' || user.role === 'COMMUNITY' || user.role === 'CM' || user.role === 'ADMIN';
            
            if (!isAllowed && home && home !== '/dashboard/community') {
                router.push(home);
            }
        }
    }, [user, getHomeRoute, router]);

    return (
        <div className="bg-[#050511] min-h-screen">
            <div className="max-w-[1600px] mx-auto p-4 md:p-8">
                <CommunityDashboard />
            </div>
        </div>
    );
}
