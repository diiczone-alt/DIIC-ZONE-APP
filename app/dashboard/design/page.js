"use client";
import { useState, useEffect } from 'react';
import DepartmentWelcome from '@/components/ui/DepartmentWelcome';
import DesignSelection from '@/components/design/DesignSelection';
import DesignWizard from '@/components/design/DesignWizard';
import DesignDashboard from '@/components/design/DesignDashboard';
import AIGenerator from '@/components/design/AIGenerator';
import DesignKanbanView from '@/components/design/DesignKanbanView';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, LayoutGrid, List } from 'lucide-react';

export default function DesignPage() {
    const [view, setView] = useState('welcome'); // welcome, selection, wizard, dashboard, ai, tasks
    const [selectedService, setSelectedService] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('kanban');

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('assigned_role', 'design')
                .order('created_at', { ascending: false });

            if (data) setTasks(data);
        } catch (err) {
            console.error('Error fetching design tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'tasks') {
            fetchTasks();
        }
    }, [view]);

    // Navigation Handlers
    const handleStart = (mode) => {
        if (mode === 'ai') {
            setView('ai');
        } else if (mode === 'new') {
            setView('selection');
        } else if (mode === 'projects') {
            setView('tasks');
        } else {
            setView('dashboard');
        }
    };

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setView('wizard');
    };

    const handleWizardComplete = () => {
        setView('tasks');
    };

    return (
        <div className="bg-[#050511] min-h-screen text-white">
            {view === 'welcome' && (
                <DepartmentWelcome
                    deptId="design"
                    onAction={handleStart}
                />
            )}

            {view === 'ai' && (
                <AIGenerator onBack={() => setView('welcome')} />
            )}

            {view === 'selection' && (
                <DesignSelection
                    onSelect={handleServiceSelect}
                    onBack={() => setView('welcome')}
                />
            )}

            {view === 'wizard' && (
                <DesignWizard
                    service={selectedService}
                    onBack={() => setView('selection')}
                    onComplete={handleWizardComplete}
                />
            )}

            {view === 'tasks' && (
                <div className="p-8 lg:p-12 max-w-[1800px] mx-auto space-y-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setView('welcome')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-3xl font-black italic tracking-tighter">DIIC <span className="text-fuchsia-500 text-2xl ml-2">Studio</span></h1>
                        </div>
                        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="h-[60vh] flex items-center justify-center">
                            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-fuchsia-500/40 animate-pulse">Sincronizando Studio...</div>
                        </div>
                    ) : (
                        <DesignKanbanView items={tasks} onSelect={(t) => {
                            setSelectedService({ label: t.title });
                            setView('dashboard');
                        }} />
                    )}
                </div>
            )}

            {view === 'dashboard' && (
                <DesignDashboard
                    project={{ projectName: selectedService?.label }}
                    onBack={() => setView('tasks')}
                />
            )}
        </div>
    );
}
