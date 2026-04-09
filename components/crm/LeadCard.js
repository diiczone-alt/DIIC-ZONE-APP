'use client';

import { MessageCircle, Phone, MoveRight, DollarSign, Wallet } from 'lucide-react';

export default function LeadCard({ lead, isDragging, onClick }) {
    return (
        <div onClick={() => onClick && onClick(lead)} className={`bg-[#151520] p-4 rounded-xl border border-white/5 group hover:border-indigo-500/50 transition-all cursor-grab active:cursor-grabbing shadow-lg ${isDragging ? 'shadow-2xl ring-2 ring-indigo-500 rotate-2 scale-105 z-50' : 'hover:-translate-y-1'}`}>

            {/* Header: Name & Score */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 block">{lead.niche}</span>
                    <h4 className="text-white font-bold text-sm leading-tight">{lead.name}</h4>
                </div>
                <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${lead.score >= 80 ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        lead.score >= 50 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                    {lead.score}
                </div>
            </div>

            {/* Value & Source */}
            <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-mono font-bold">
                    <DollarSign className="w-3 h-3" />
                    {lead.value.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs capitalize">
                    {lead.source === 'whatsapp' && <MessageCircle className="w-3 h-3" />}
                    {lead.source}
                </div>
            </div>

            {/* Actions (Hidden until hover) */}
            <div className="flex gap-2 pt-2 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-lg flex items-center justify-center transition-colors">
                    <MessageCircle className="w-4 h-4" />
                </button>
                <button className="flex-1 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center transition-colors">
                    <Phone className="w-4 h-4" />
                </button>
                <button className="flex-1 py-1.5 bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 rounded-lg flex items-center justify-center transition-colors">
                    <MoveRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
