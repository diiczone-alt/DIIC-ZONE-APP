'use client';

import { 
    Activity, Terminal, AlertCircle, 
    Database, Shield, Search, 
    RefreshCcw, Trash2
} from 'lucide-react';

export default function AdminLogsPage() {
    const logs = [
        { id: 1084, time: '22:04:15', service: 'AUTH', action: 'Admin Login Success', user: 'admin@diic.zone', status: 'success', ip: '192.168.1.1' },
        { id: 1083, time: '22:02:40', service: 'CRM', action: 'Client Created', user: 'maria@diic.zone', status: 'success', ip: '192.168.1.45' },
        { id: 1082, time: '21:58:12', service: 'CRON', action: 'Backup Failed', user: 'SYSTEM', status: 'error', ip: 'internal' },
        { id: 1081, time: '21:45:00', service: 'DB', action: 'Query slow (> 500ms)', user: 'SYSTEM', status: 'warning', ip: 'internal' },
        { id: 1080, time: '21:30:22', service: 'STRATEGY', action: 'Node Attached', user: 'carlos.video@mail.com', status: 'success', ip: '201.21.4.156' },
    ];

    return (
        <div className="flex-1 overflow-y-auto p-10 bg-[#050511] font-mono">
            <header className="mb-10 flex justify-between items-center font-sans">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Logs del Sistema</h1>
                    <p className="text-gray-400">Monitorización de eventos en tiempo real (God Mode View).</p>
                </div>
                <div className="flex gap-4">
                    <button className="h-12 px-6 bg-white/5 border border-white/10 text-emerald-500 rounded-2xl flex items-center gap-3 transition-all hover:bg-emerald-500/10 text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/5">
                        <RefreshCcw className="w-4 h-4 animate-spin-slow" />
                        Live Update
                    </button>
                    <button className="h-12 px-5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl transition-all shadow-xl active:scale-95">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Terminal View */}
            <div className="bg-[#0A0A12] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                {/* Terminal Header */}
                <div className="px-6 py-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                        <span className="ml-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                            <Terminal className="w-3 h-3" /> diic-system-kernel / logs-stream
                        </span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-gray-700" />
                        <input 
                            type="text" 
                            placeholder="grep --filter..."
                            className="bg-black/40 border border-white/5 rounded-lg pl-9 pr-3 py-1.5 text-[10px] text-emerald-500 focus:outline-none focus:border-emerald-500/50 w-48 font-mono placeholder:text-gray-800"
                        />
                    </div>
                </div>

                {/* Log Stream */}
                <div className="p-0">
                    <table className="w-full text-left">
                        <thead className="text-[10px] font-black text-gray-700 uppercase tracking-widest border-b border-white/5">
                            <tr>
                                <th className="px-8 py-4">Timestamp</th>
                                <th className="px-8 py-4">Service</th>
                                <th className="px-8 py-4">Event Description</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Origin IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-emerald-500/[0.02] group transition-colors">
                                    <td className="px-8 py-4 text-xs text-gray-500 group-hover:text-emerald-500/50">
                                        [{log.time}]
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded text-gray-400 group-hover:text-white transition-colors">
                                            {log.service}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-xs font-bold text-gray-300 group-hover:text-emerald-400 transition-colors">
                                        {log.action} 
                                        {log.user !== 'SYSTEM' && <span className="ml-2 text-[10px] text-gray-600 font-normal">by {log.user}</span>}
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                log.status === 'success' ? 'bg-emerald-500' : 
                                                log.status === 'error' ? 'bg-rose-500 animate-pulse' : 
                                                'bg-amber-500'
                                            }`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                log.status === 'success' ? 'text-emerald-500/70' : 
                                                log.status === 'error' ? 'text-rose-500' : 
                                                'text-amber-500'
                                            }`}>{log.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right text-[10px] text-gray-600 font-mono italic">
                                        {log.ip}
                                    </td>
                                </tr>
                            ))}
                            {/* Empty spacing for terminal feel */}
                            <tr className="border-0">
                                <td colSpan="5" className="px-8 py-20 text-emerald-500/20 text-xs animate-pulse">
                                    _ Listening for incoming system signals...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
