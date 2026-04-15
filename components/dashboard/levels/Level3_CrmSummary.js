'use client';

import { Users, Filter, ArrowUpRight, MessageSquare, DollarSign } from 'lucide-react';

export default function Level3_CrmSummary() {
    return (
        <div className="space-y-6 mt-8">
            <div className="flex justify-between items-end mb-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 rounded-full bg-yellow-500 block shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
                    Generación de Clientes
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Leads */}
                <div className="p-5 rounded-2xl bg-[#0A0A12] border border-white/5 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                             <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="text-xs text-emerald-400 font-bold">+24%</span>
                        </div>
                        <h4 className="text-2xl font-black text-white">42</h4>
                        <p className="text-xs text-gray-500">Leads este mes</p>
                    </div>
                </div>

                 {/* In Conversation */}
                 <div className="p-5 rounded-2xl bg-[#0A0A12] border border-white/5 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                             <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                        </div>
                        <h4 className="text-2xl font-black text-white">18</h4>
                        <p className="text-xs text-gray-500">En Coversacion</p>
                    </div>
                </div>

                {/* Pipeline Summary */}
                <div className="md:col-span-2 p-5 rounded-2xl bg-[#0A0A12] border border-white/5 relative overflow-hidden flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                         <h4 className="font-bold text-white text-sm">Embudo de Ventas</h4>
                         <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">Activo</span>
                    </div>
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden w-full">
                         <div className="h-full bg-blue-500/50 w-[50%]"></div>
                         <div className="h-full bg-yellow-500/50 w-[30%]"></div>
                         <div className="h-full bg-emerald-500/50 w-[20%]"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                         <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Nuevos</span>
                         <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Negociación</span>
                         <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Cierre</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
