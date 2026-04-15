'use client';

import { motion } from 'framer-motion';
import { Instagram, Facebook, Youtube, Twitter, TrendingUp, Users, Heart, Share2, Eye } from 'lucide-react';
import { useState } from 'react';

export default function SocialMediaView() {
    const [activePlatform, setActivePlatform] = useState('instagram');

    const PLATFORMS = [
        { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10' },
        { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'tiktok', name: 'TikTok', icon: VideoIcon, color: 'text-white', bg: 'bg-gray-800' },
        { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10' },
    ];

    return (
        <div className="space-y-6">

            {/* Platform Selector */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {PLATFORMS.map(p => {
                    const Icon = p.icon;
                    return (
                        <button
                            key={p.id}
                            onClick={() => setActivePlatform(p.id)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all min-w-[160px] ${activePlatform === p.id
                                ? 'bg-[#0E0E18] border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                : 'bg-[#0E0E18] border-white/5 opacity-60 hover:opacity-100'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${p.bg} ${p.color}`}><Icon className="w-5 h-5" /></div>
                            <span className="font-bold text-white">{p.name}</span>
                        </button>
                    )
                })}
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Seguidores" value="12,450" change="+320" period="vs mes pasado" />
                <StatCard icon={Eye} label="Alcance" value="45.2k" change="+15%" period="vs mes pasado" />
                <StatCard icon={Heart} label="Interacciones" value="3,840" change="-2%" isNegative period="vs mes pasado" />
                <StatCard icon={TrendingUp} label="Engagement" value="8.4%" change="+1.2%" period="avg industria: 4%" />
            </div>

            {/* Growth Chart Placeholder */}
            <div className="bg-[#0E0E18] rounded-3xl border border-white/5 p-8 h-64 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E18] to-transparent z-10"></div>
                {/* Mock Chart Line */}
                <svg className="w-full h-full text-indigo-500 opacity-20" viewBox="0 0 100 20">
                    <path d="M0 15 Q 10 5 20 12 T 40 10 T 60 5 T 80 14 T 100 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
                <div className="z-20 text-center">
                    <p className="text-gray-500 text-sm mb-2">Crecimiento de Audiencia (30 días)</p>
                    <h3 className="text-3xl font-black text-white">+1,240 <span className="text-sm font-normal text-emerald-400">Nuevos Fans</span></h3>
                </div>
            </div>

            {/* Active Content Grid */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Publicaciones Recientes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PostCard image="https://placehold.co/600x600/101010/FFF?text=Reel+Viral" views="12.5k" likes="450" />
                    <PostCard image="https://placehold.co/600x600/151515/FFF?text=Post+Educativo" views="8.2k" likes="210" />
                    <PostCard image="https://placehold.co/600x600/202020/FFF?text=Meme+Corp" views="5.4k" likes="120" />
                </div>
            </div>

        </div>
    );
}

function StatCard({ icon: Icon, label, value, change, period, isNegative }) {
    return (
        <div className="bg-[#0E0E18] p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-white/5 rounded-lg text-gray-400"><Icon className="w-5 h-5" /></div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isNegative ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {change}
                </div>
            </div>
            <div className="text-3xl font-black text-white mb-1">{value}</div>
            <div className="flex justify-between items-end">
                <div className="text-sm font-bold text-gray-400">{label}</div>
                <div className="text-[10px] text-gray-500">{period}</div>
            </div>
        </div>
    )
}

function PostCard({ image, views, likes }) {
    return (
        <div className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer">
            <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex justify-between text-white text-xs font-bold">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {views}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {likes}</span>
                </div>
            </div>
        </div>
    )
}

function VideoIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M15 10l5-3v10l-5-3" />
            <rect x="2" y="6" width="13" height="12" rx="2" ry="2" />
        </svg>
    )
}
