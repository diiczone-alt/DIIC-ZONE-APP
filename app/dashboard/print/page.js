'use client';

import { useState } from 'react';
import DepartmentWelcome from '@/components/ui/DepartmentWelcome';
import PrintCategories from '../../../components/print/PrintCategories';
import PrintConfigurator from '../../../components/print/PrintConfigurator';
import PrintDashboard from '../../../components/print/PrintDashboard';

export default function PrintPage() {
    // Modes: 'welcome', 'categories', 'configurator', 'dashboard'
    const [viewMode, setViewMode] = useState('welcome');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeOrder, setActiveOrder] = useState(null);

    const handleAction = (mode) => {
        if (mode === 'quote') setViewMode('categories');
        else if (mode === 'projects') setViewMode('dashboard');
        else if (mode === 'history') setViewMode('dashboard');
        else setViewMode('categories');
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setViewMode('configurator');
    };

    const handleOrderAndTrack = (orderData) => {
        setActiveOrder(orderData);
        setViewMode('dashboard');
    };

    const handleBack = () => {
        if (viewMode === 'dashboard') setViewMode('categories');
        else if (viewMode === 'configurator') setViewMode('categories');
        else if (viewMode === 'categories') setViewMode('welcome');
    };

    return (
        <div className="min-h-screen bg-[#050511] text-white">
            {viewMode === 'welcome' && (
                <DepartmentWelcome
                    deptId="print"
                    onAction={handleAction}
                />
            )}

            {viewMode === 'categories' && (
                <PrintCategories
                    onSelect={handleCategorySelect}
                    onBack={handleBack}
                />
            )}

            {viewMode === 'configurator' && (
                <PrintConfigurator
                    category={selectedCategory}
                    onComplete={handleOrderAndTrack}
                    onBack={handleBack}
                />
            )}

            {viewMode === 'dashboard' && (
                <PrintDashboard
                    activeOrder={activeOrder}
                    onBack={() => setViewMode('categories')}
                />
            )}
        </div>
    );
}
