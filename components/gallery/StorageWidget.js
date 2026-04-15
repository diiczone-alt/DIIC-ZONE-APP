'use client';

import { Cloud, HardDrive, CheckCircle2 } from 'lucide-react';

const CONNECTORS = [
    { id: 'drive', name: 'Google Drive', connected: true, type: 'cloud' },
    { id: 'dropbox', name: 'Dropbox', connected: false, type: 'cloud' },
    { id: 'local', name: 'Local', connected: true, type: 'local' },
];

export default function StorageWidget() {
    return (
        <div className="flex gap-3">
            {CONNECTORS.map(conn => (
                <div
                    key={conn.id}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
                        ${conn.connected
                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                            : 'bg-white/5 border-white/10 text-gray-500 opacity-60 hover:opacity-100'}
                    `}
                >
                    {conn.type === 'cloud' ? <Cloud className="w-3.5 h-3.5" /> : <HardDrive className="w-3.5 h-3.5" />}
                    <span>{conn.name}</span>
                    {conn.connected && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>}
                </div>
            ))}
        </div>
    );
}
