'use client';

import { useState } from 'react';
import StrategyBoard from '@/components/shared/Strategy/StrategyBoard';

import DepartmentWelcome from '@/components/ui/DepartmentWelcome';

export default function EventsDataPage() {
    const [view, setView] = useState('welcome');

    const handleAction = (mode) => {
        setView('dashboard');
    };

    return (
        <div className="bg-[#050511] min-h-screen text-white">
            {view === 'welcome' ? (
                <DepartmentWelcome
                    deptId="events"
                    onAction={handleAction}
                />
            ) : (
                <div className="h-[calc(100vh-4rem)] relative overflow-hidden -m-4 rounded-[0rem]">
                    <StrategyBoard />
                </div>
            )}
        </div>
    );
}
