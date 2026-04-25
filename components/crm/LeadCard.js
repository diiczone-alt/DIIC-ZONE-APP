'use client';

import { MessageCircle, Phone, MoveRight, DollarSign, Wallet, Star, Shield } from 'lucide-react';

export default function LeadCard({ lead, isDragging, onClick }) {
    return (
        <div 
            onClick={() => onClick && onClick(lead)} 
            className={`bg-[#0A0A1F]/80 backdrop-blur-xl p-2.5 rounded-xl border border-white/5 group hover:border-indigo-500/50 transition-all cursor-grab active:cursor-grabbing shadow-lg relative overflow-hidden flex flex-col gap-2 ${
                isDragging 
                ? 'shadow-2xl ring-2 ring-indigo-500 rotate-2 scale-105 z-50' 
                : 'hover:-translate-y-0.5'
            }`}
        >
            {/* Header: Identity */}
            <div className="flex justify-between items-start relative z-10">
                <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1 opacity-60">
                        <div className="w-1 h-1 rounded-full bg-indigo-500" />
                        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-400">
                            {lead.industry || lead.niche || 'LEAD'}
                        </span>
                    </div>
                    <h4 className="text-white font-bold text-[11px] tracking-tight leading-tight group-hover:text-indigo-200 transition-colors uppercase">
                        {lead.name}
                    </h4>
                </div>
                {lead.score && (
                    <div className={`text-[8px] font-black px-1.5 py-0.5 rounded-md border flex items-center gap-1 ${
                        lead.score >= 80 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        lead.score >= 50 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                        {lead.score}
                    </div>
                )}
            </div>

            {/* Metrics Row */}
            <div className="flex items-center justify-between relative z-10 mt-1">
                <div className="flex items-center gap-1.5 text-white font-black text-xs tracking-tighter">
                    <span className="text-gray-500 text-[10px] font-bold">$</span>
                    {lead.value?.toLocaleString() || '0'}
                </div>
                
                <div className="flex items-center gap-1 opacity-50">
                    {lead.source?.toLowerCase().includes('whatsapp') ? (
                        <MessageCircle className="w-2.5 h-2.5 text-[#25D366]" />
                    ) : lead.source?.toLowerCase().includes('instagram') ? (
                        <Star className="w-2.5 h-2.5 text-pink-500" />
                    ) : (
                        <Shield className="w-2.5 h-2.5 text-gray-400" />
                    )}
                    <span className="text-[7px] font-bold uppercase tracking-widest text-gray-500">
                        {lead.source || 'Direct'}
                    </span>
                </div>
            </div>

            {/* Mini Footer Actions */}
            <div className="flex gap-1.5 mt-1 pt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all">
                <button className="flex-1 py-1 bg-white/5 hover:bg-[#25D366]/20 hover:text-[#25D366] text-gray-500 rounded-md transition-all flex items-center justify-center">
                    <MessageCircle className="w-3 h-3" />
                </button>
                <button className="flex-1 py-1 bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-400 text-gray-500 rounded-md transition-all flex items-center justify-center">
                    <Phone className="w-3 h-3" />
                </button>
            </div>
        </div>
    )
}
