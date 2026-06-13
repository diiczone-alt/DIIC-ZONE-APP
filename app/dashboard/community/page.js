'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CommunityDashboard from '@/components/community/CommunityDashboard';
import DepartmentWelcome from '@/components/ui/DepartmentWelcome';

export default function CommunityPage() {
    const { user, getHomeRoute } = useAuth();
    const router = useRouter();
    const [view, setView] = useState('welcome');

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

    const handleAction = (mode) => {
        if (mode === 'production_report' || mode === 'ad_report' || mode === 'reports') {
            router.push('/dashboard/community/reports');
        } else if (mode === 'strategy') {
            router.push('/dashboard/community/strategy');
        } else if (mode === 'chat') {
            router.push('/dashboard/community/team');
        } else if (mode === 'pipeline') {
            router.push('/dashboard/community/contenidos');
        } else if (mode === 'calendar') {
            router.push('/dashboard/community/calendar');
        } else {
            setView('dashboard');
        }
    };

    return (
        <div className="bg-[#050511] min-h-screen">
            {view === 'welcome' ? (
                <DepartmentWelcome
                    deptId="community"
                    onAction={handleAction}
                />
            ) : (
                <div className="max-w-[1600px] mx-auto p-4 md:p-8">
                    <div className="mb-6">
                        <button
                            onClick={() => setView('welcome')}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors text-xs font-bold"
                        >
                            ← Volver al Saludo
                        </button>
                    </div>
                    <CommunityDashboard />
                </div>
            )}
        </div>
    );
}
