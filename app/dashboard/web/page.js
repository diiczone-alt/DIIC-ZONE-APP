'use client';

import { useState } from 'react';
import DepartmentWelcome from '@/components/ui/DepartmentWelcome';
import WebSelection from '../../../components/web/WebSelection';
import WebLevels from '../../../components/web/WebLevels';
import WebDashboard from '../../../components/web/WebDashboard';

export default function WebPage() {
    // Modes: 'welcome', 'selection', 'levels', 'dashboard'
    const [viewMode, setViewMode] = useState('welcome');
    const [projectData, setProjectData] = useState({
        goal: null, // 'create' or 'improve'
        objective: null, // 'landing', 'corporate', etc.
        level: null // 1, 2, 3, 4
    });

    const handleAction = (mode) => {
        if (mode === 'projects') setViewMode('dashboard');
        else if (mode === 'chat') setViewMode('dashboard');
        else if (mode === 'analytics') setViewMode('dashboard');
        else {
            // Default to start new project flow
            setProjectData(prev => ({ ...prev, goal: 'create' }));
            setViewMode('selection');
        }
    };

    const handleObjectiveSelect = (objective) => {
        setProjectData(prev => ({ ...prev, objective }));
        setViewMode('levels');
    };

    const handleLevelSelect = (level) => {
        setProjectData(prev => ({ ...prev, level }));
        setViewMode('dashboard');
    };

    const handleBack = () => {
        if (viewMode === 'dashboard') setViewMode('levels');
        else if (viewMode === 'levels') setViewMode('selection');
        else if (viewMode === 'selection') setViewMode('welcome');
    };

    return (
        <div className="min-h-screen bg-[#050511] text-white">
            {viewMode === 'welcome' && (
                <DepartmentWelcome
                    deptId="web"
                    onAction={handleAction}
                />
            )}

            {viewMode === 'selection' && (
                <WebSelection
                    goal={projectData.goal}
                    onSelect={handleObjectiveSelect}
                    onBack={handleBack}
                />
            )}

            {viewMode === 'levels' && (
                <WebLevels
                    objective={projectData.objective}
                    onSelect={handleLevelSelect}
                    onBack={handleBack}
                />
            )}

            {viewMode === 'dashboard' && (
                <WebDashboard
                    projectData={projectData}
                    onBack={handleBack}
                />
            )}
        </div>
    );
}
