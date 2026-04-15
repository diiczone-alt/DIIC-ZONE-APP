'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PipelineBoard from '@/components/connectivity/crm/PipelineBoard';
import LeadDetail from '@/components/connectivity/crm/LeadDetail';

export default function CRMMainView() {
    const [view, setView] = useState('board'); // 'board', 'detail'
    const [selectedLead, setSelectedLead] = useState(null);

    const handleSelectLead = (lead) => {
        setSelectedLead(lead);
        setView('detail');
    };

    const handleBack = () => {
        setSelectedLead(null);
        setView('board');
    };

    return (
        <div className="h-full w-full relative">
            <AnimatePresence mode="wait">
                {view === 'board' ? (
                    <motion.div
                        key="board"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        <PipelineBoard onSelectLead={handleSelectLead} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        <LeadDetail
                            lead={selectedLead}
                            onBack={handleBack}
                            onGenerateQuote={() => console.log('Quote logic here')}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
