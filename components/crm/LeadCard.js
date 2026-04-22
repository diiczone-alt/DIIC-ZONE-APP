'use client';

import { MessageCircle, Phone, MoveRight, DollarSign, Wallet, Star, Shield } from 'lucide-react';

export default function LeadCard({ lead, isDragging, onClick }) {
    return (
        <div 
            onClick={() => onClick && onClick(lead)} 
            className={`bg-[#151520] p-3 rounded-2xl border border-white/5 group hover:border-indigo-500/50 transition-all cursor-grab active:cursor-grabbing shadow-lg relative overflow-hidden ${
                isDragging 
                ? 'shadow-2xl ring-2 ring-indigo-500 rotate-2 scale-105 z-50' 
                : 'hover:-translate-y-1'
            }`}
        >
            {/* Background Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Header: Name & Score */}
            <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1 text-indigo-400">
                        <Shield className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">{lead.niche || 'NUEVO PROSPECTO'}</span>
                    </div>
                    <h4 className="text-white font-black text-xs tracking-tight leading-tight group-hover:text-indigo-200 transition-colors">{lead.name}</h4>
                </div>
                <div className={`text-[10px] font-black px-2 py-1 rounded-lg border flex items-center gap-1 ${
                    lead.score >= 80 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_#10b98120]' :
                    lead.score >= 50 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                }`}>
                    <Star className="w-3 h-3 fill-current" />
                    {lead.score}
                </div>
            </div>

            {/* Investment & Source */}
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex flex-col">
                    <span className="text-[6px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Inversión</span>
                    <div className="flex items-center gap-0.5 text-white font-black text-sm tracking-tighter">
                        <span className="text-indigo-500 text-xs">$</span>
                        {lead.value?.toLocaleString() || '0'}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-1.5 py-1 rounded-lg">
                    {lead.source === 'whatsapp' ? <MessageCircle className="w-2.5 h-2.5 text-[#25D366]" /> : <Star className="w-2.5 h-2.5 text-gray-500" />}
                    <span className="text-[8px] font-black text-gray-400 capitalize">{lead.source}</span>
                </div>
            </div>

            {/* Actions (Premium Interactive Bar) */}
            <div className="flex gap-2 pt-3 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-all relative z-10 translate-y-1 group-hover:translate-y-0 text-center">
                <button className="flex-1 py-2 bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white text-[#25D366] rounded-xl flex items-center justify-center transition-all">
                    <MessageCircle className="w-4 h-4" />
                </button>
                <button className="flex-1 py-2 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-indigo-400 rounded-xl flex items-center justify-center transition-all">
                    <Phone className="w-4 h-4" />
                </button>
                <button className="flex-1 py-2 bg-white/5 hover:bg-white/20 text-white rounded-xl flex items-center justify-center transition-all border border-white/5">
                    <MoveRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
