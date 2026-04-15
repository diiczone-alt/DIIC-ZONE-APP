'use client';

import { useState } from 'react';
import DepartmentWelcome from '@/components/ui/DepartmentWelcome';
import PhotoSelection from '@/components/photo/PhotoSelection';
import PhotoConfigurator from '@/components/photo/PhotoConfigurator';
import PhotoDashboard from '@/components/photo/PhotoDashboard';

export default function PhotoPage() {
    const [viewMode, setViewMode] = useState('welcome'); // welcome, selection, configurator, dashboard
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeProject, setActiveProject] = useState(null);

    const handleAction = (mode) => {
        if (mode === 'schedule') setViewMode('selection');
        if (mode === 'projects') setViewMode('dashboard');
        if (mode === 'assets') setViewMode('dashboard');
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setViewMode('configurator');
    };

    const handleBookingComplete = (projectData) => {
        setActiveProject(projectData);
        setViewMode('dashboard');
    };

    const handleBack = () => {
        if (viewMode === 'selection') setViewMode('welcome');
        if (viewMode === 'configurator') setViewMode('selection');
        if (viewMode === 'dashboard') setViewMode('selection');
    };

    return (
        <div className="min-h-screen bg-[#050511] text-white">
            {viewMode === 'welcome' && (
                <DepartmentWelcome
                    deptId="photo"
                    onAction={handleAction}
                />
            )}
            {viewMode === 'selection' && <PhotoSelection onSelect={handleCategorySelect} onBack={handleBack} />}
            {viewMode === 'configurator' && <PhotoConfigurator category={selectedCategory} onComplete={handleBookingComplete} onBack={handleBack} />}
            {viewMode === 'dashboard' && <PhotoDashboard activeProject={activeProject} onBack={() => setViewMode('selection')} />}
        </div>
    );
}
