'use client';

import { useState } from 'react';
import DepartmentWelcome from '@/components/ui/DepartmentWelcome';
import AudioRecorder from '@/components/audio/AudioRecorder';
import AudioRequest from '@/components/audio/AudioRequest';
import AudioDashboard from '@/components/audio/AudioDashboard';

export default function AudioPage() {
    const [view, setView] = useState('welcome');
    const [serviceData, setServiceData] = useState(null);

    const handleAction = (mode) => {
        if (mode === 'schedule') setView('request');
        if (mode === 'projects') setView('dashboard');
        if (mode === 'assets') setView('dashboard'); // Assuming dashboard has asset list
    };

    return (
        <div className="bg-[#050511] min-h-screen text-white">
            {view === 'welcome' && (
                <DepartmentWelcome
                    deptId="audition"
                    onAction={handleAction}
                />
            )}

            {view === 'recorder' && (
                <AudioRecorder
                    onBack={() => setView('welcome')}
                    onSave={handleSaveRecording}
                />
            )}

            {view === 'request' && (
                <AudioRequest
                    onBack={() => setView('welcome')}
                    onSubmit={handleRequestSubmit}
                />
            )}

            {view === 'dashboard' && (
                <AudioDashboard />
            )}
        </div>
    );
}
