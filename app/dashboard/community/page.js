'use client';

import { useState } from 'react';
import CommunityDashboard from '@/components/community/CommunityDashboard';
import DepartmentWelcome from '@/components/ui/DepartmentWelcome';

export default function CommunityPage() {
    const [view, setView] = useState('dashboard');

    return (
        <div className="bg-[#050511] min-h-screen text-white">
            {view === 'welcome' ? (
                <DepartmentWelcome
                    deptId="community"
                    onAction={() => setView('dashboard')}
                />
            ) : (
                <CommunityDashboard onBack={() => setView('welcome')} />
            )}
        </div>
    );
}
