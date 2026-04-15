'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import FinanceDashboard from '@/components/billing/FinanceDashboard';
import FinanceWelcome from '@/components/billing/FinanceWelcome';

export default function BillingPage() {
    const [showWelcome, setShowWelcome] = useState(true);

    // Initial load check
    useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenFinanceWelcome');
        if (hasSeen) {
            setShowWelcome(false);
        }
    }, []);

    const handleWelcomeAction = (action) => {
        console.log("Finance/Action:", action);
        setShowWelcome(false);
        localStorage.setItem('hasSeenFinanceWelcome', 'true');
    };

    return (
        <div className="min-h-screen bg-[#050511] p-6 lg:p-10">
            <AnimatePresence>
                {showWelcome && (
                    <FinanceWelcome
                        onSelect={handleWelcomeAction}
                        onClose={() => {
                            setShowWelcome(false);
                            localStorage.setItem('hasSeenFinanceWelcome', 'true');
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Main Finance Dashboard */}
            <FinanceDashboard />
        </div>
    );
}
