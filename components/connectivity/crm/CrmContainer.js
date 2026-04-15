import { useState } from 'react';
import { Layout, Table, BrainCircuit, Bot } from 'lucide-react';
import PipelineBoard from './PipelineBoard';
import ContactTable from './ContactTable';
import CommercialIntelligenceDashboard from './CommercialIntelligenceDashboard';
import LeadDetail from './LeadDetail';
import QuoteGenerator from './QuoteGenerator';

import AgentsHub from './AgentsHub';

export default function CrmContainer() {
    const [viewMode, setViewMode] = useState('intelligence'); // 'pipeline' | 'contacts' | 'intelligence' | 'lead-detail' | 'quote-generator' | 'ai-agent'

    const handleOpenLead = () => {
        setViewMode('lead-detail');
    };

    const handleGenerateQuote = () => {
        setViewMode('quote-generator');
    };

    return (
        <div className="h-full flex flex-col gap-6">
            {viewMode !== 'lead-detail' && viewMode !== 'quote-generator' && viewMode !== 'ai-agent' && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            CRM & Inteligencia Comercial
                            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                                Pro
                            </span>
                        </h2>
                        <p className="text-sm text-gray-400">Todo el ciclo de vida: Desde el Lead hasta el ROI.</p>
                    </div>

                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 overflow-x-auto">
                        <button
                            onClick={() => setViewMode('pipeline')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${viewMode === 'pipeline' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Layout className="w-4 h-4" /> Embudo
                        </button>
                        <button
                            onClick={() => setViewMode('contacts')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${viewMode === 'contacts' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Table className="w-4 h-4" /> Contactos
                        </button>
                        <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                        <button
                            onClick={() => setViewMode('intelligence')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${viewMode === 'intelligence' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <BrainCircuit className="w-4 h-4" /> Inteligencia
                        </button>
                        <button
                            onClick={() => setViewMode('ai-agent')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${viewMode === 'ai-agent' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Bot className="w-4 h-4" /> Agentes Inteligentes
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                {viewMode === 'pipeline' && <PipelineBoard />}
                {viewMode === 'contacts' && <ContactTable />}
                {viewMode === 'intelligence' && (
                    <CommercialIntelligenceDashboard onOpenLead={handleOpenLead} />
                )}
                {viewMode === 'lead-detail' && (
                    <LeadDetail
                        onBack={() => setViewMode('intelligence')}
                        onGenerateQuote={handleGenerateQuote}
                    />
                )}
                {viewMode === 'quote-generator' && (
                    <QuoteGenerator
                        onBack={() => setViewMode('lead-detail')}
                        onFinish={() => setViewMode('lead-detail')}
                    />
                )}
                {viewMode === 'ai-agent' && (
                    <div className="relative">
                        <button
                            onClick={() => setViewMode('intelligence')}
                            className="absolute top-0 right-0 z-10 p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
                        >
                            <span className="sr-only">Cerrar</span>
                            ✕
                        </button>
                        <AgentsHub />
                    </div>
                )}
            </div>
        </div>
    );
}
