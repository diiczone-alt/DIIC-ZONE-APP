'use client';

import { Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Sem 1', uv: 4000, pv: 2400 },
    { name: 'Sem 2', uv: 3000, pv: 1398 },
    { name: 'Sem 3', uv: 2000, pv: 9800 },
    { name: 'Sem 4', uv: 2780, pv: 3908 },
    { name: 'Sem 5', uv: 1890, pv: 4800 },
    { name: 'Sem 6', uv: 2390, pv: 3800 },
    { name: 'Actual', uv: 3490, pv: 4300 },
];

export default function GrowthVisionChart() {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-[2rem] p-8 h-[400px] flex flex-col relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Crecimiento / Visión Futura</span>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tight">Impacto Digital</h3>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-emerald-400">+34.5%</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Últimos 30 días</div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0A0F1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                            labelStyle={{ color: '#9ca3af', fontSize: '10px', marginBottom: '4px' }}
                        />
                        <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" strokeWidth={3} />
                        <Area type="monotone" dataKey="pv" stroke="#10b981" fillOpacity={1} fill="url(#colorPv)" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
