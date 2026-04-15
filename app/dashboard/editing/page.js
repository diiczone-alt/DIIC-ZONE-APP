'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import DepartmentWelcome from '@/components/ui/DepartmentWelcome';
import ActiveEdits from '../../../components/editing/ActiveEdits';
import EditingWizard from '../../../components/editing/EditingWizard';

export default function EditingPage() {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [view, setView] = useState('welcome');

    const handleAction = (mode) => {
        if (mode === 'upload') setIsWizardOpen(true);
        setView('dashboard');
    };

    return (
        <div className="animate-fade-in pb-20 relative min-h-screen">
            {view === 'welcome' ? (
                <DepartmentWelcome
                    deptId="video"
                    onAction={handleAction}
                />
            ) : (
                <div className="max-w-7xl mx-auto p-6">
                    <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        Edición de Video
                    </h1>
                    <ActiveEdits onNewProject={() => setIsWizardOpen(true)} />
                </div>
            )}

            {/* Editing Wizard Modal */}
            <AnimatePresence>
                {isWizardOpen && (
                    <EditingWizard onClose={() => setIsWizardOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}
