'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import DepartmentWelcome from '@/components/ui/DepartmentWelcome';
import ActiveProductions from '../../../components/filmmaker/ActiveProductions';
import ProductionWizard from '../../../components/filmmaker/ProductionWizard';

export default function FilmmakerPage() {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [view, setView] = useState('welcome');

    const handleAction = (mode) => {
        if (mode === 'schedule') setIsWizardOpen(true);
        setView('dashboard');
    };

    return (
        <div className="animate-fade-in pb-20 relative min-h-screen">
            {view === 'welcome' ? (
                <DepartmentWelcome
                    deptId="filmmaker"
                    onAction={handleAction}
                />
            ) : (
                <ActiveProductions onNewProject={() => setIsWizardOpen(true)} />
            )}

            {/* Production Wizard Modal */}
            <AnimatePresence>
                {isWizardOpen && (
                    <ProductionWizard onClose={() => setIsWizardOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}
