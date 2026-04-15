'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Smartphone, Monitor, Tablet } from 'lucide-react';

const data = [
    { name: 'Móvil', value: 75, color: '#06b6d4' }, // Cyan
    { name: 'Desktop', value: 20, color: '#8b5cf6' }, // Purple
    { name: 'Tablet', value: 5, color: '#10b981' }, // Emerald
];

export default function DeviceBreakdown() {
    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Dispositivos</h3>

            <div className="h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000000', borderColor: '#333', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <Smartphone className="w-6 h-6 text-gray-500 mb-1" />
                    <span className="text-2xl font-black text-white">75%</span>
                    <span className="text-[10px] text-gray-500 uppercase">Móvil</span>
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-2">
                {data.map(item => (
                    <div key={item.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-gray-400">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
