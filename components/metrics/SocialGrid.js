'use client';

import { Instagram, Facebook, Youtube, Video, ArrowUpRight } from 'lucide-react';

const PLATFORM_CONFIG = {
    'instagram': { icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    'facebook': { icon: Facebook, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    'youtube': { icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    'tiktok': { icon: Video, color: 'text-white', bg: 'bg-white/10', border: 'border-white/20' }
};

export default function SocialGrid({ data = [] }) {
    // Fallback mock data if empty (for demo continuity during migration)
    const displayData = data.length > 0 ? data : [
        { platform: 'instagram', followers_count: '12.4k', followers_growth: 340, engagement_rate: 4.5 },
        { platform: 'facebook', followers_count: '8.2k', followers_growth: 120, engagement_rate: 2.1 },
        { platform: 'youtube', followers_count: '1.1k', followers_growth: 45, engagement_rate: 6.8 },
        { platform: 'tiktok', followers_count: '45.2k', followers_growth: 1200, engagement_rate: 8.4 }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayData.map((stat, idx) => {
                const config = PLATFORM_CONFIG[stat.platform] || PLATFORM_CONFIG['instagram'];
                const Icon = config.icon;

                return (
                    <div key={idx} className={`glass-panel p-4 rounded-xl border ${config.border} hover:bg-white/5 transition-all group`}>
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="flex items-center text-green-400 text-xs font-bold gap-0.5 bg-green-500/10 px-1.5 py-0.5 rounded">
                                +{stat.followers_growth} <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>

                        <div className="mb-3">
                            <h3 className="text-2xl font-bold text-white">
                                {typeof stat.followers_count === 'number' ? stat.followers_count.toLocaleString() : stat.followers_count}
                            </h3>
                            <p className="text-xs text-gray-400">Seguidores</p>
                        </div>

                        <div className="flex items-end gap-2 h-8">
                            <div className="w-2 h-4 bg-white/10 rounded-sm"></div>
                            <div className="w-2 h-6 bg-white/10 rounded-sm"></div>
                            <div className="w-2 h-3 bg-white/10 rounded-sm"></div>
                            <div className={`w-2 h-8 opacity-50 rounded-sm ${config.color.includes('text-white') ? 'bg-white' : 'bg-current'}`} style={{ color: config.color.includes('text-white') ? 'white' : 'inherit' }}></div>
                            <div className="w-2 h-5 bg-white/10 rounded-sm"></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
