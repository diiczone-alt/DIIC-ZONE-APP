'use client';

import { useState } from 'react';
import DepartmentWelcome from '@/components/ui/DepartmentWelcome';
import TalentSelection from '../../../components/talent/TalentSelection';
import TalentCatalog from '../../../components/talent/TalentCatalog';

export default function TalentPage() {
    // Modes: 'welcome', 'selection', 'catalog', 'profile', 'dashboard'
    const [viewMode, setViewMode] = useState('welcome');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleAction = (mode) => {
        if (mode === 'catalog') setViewMode('selection');
        else if (mode === 'request') setViewMode('selection');
        else setViewMode('catalog');
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setViewMode('catalog');
    };

    const handleBack = () => {
        if (viewMode === 'catalog') setViewMode('selection');
        else if (viewMode === 'selection') setViewMode('welcome');
    };

    return (
        <div className="min-h-screen bg-[#050511] text-white">
            {viewMode === 'welcome' && (
                <DepartmentWelcome
                    deptId="models"
                    onAction={handleAction}
                />
            )}

            {viewMode === 'selection' && (
                <TalentSelection onSelect={handleCategorySelect} onBack={handleBack} />
            )}

            {viewMode === 'catalog' && (
                <TalentCatalog category={selectedCategory} onBack={handleBack} />
            )}
        </div>
    );
}
