'use client';

import Link from 'next/link';
import { Instagram, Facebook, Youtube, Share2, TrendingUp } from 'lucide-react';

export default function Level2_Connectivity() {
    return (
        <div className="space-y-6 mt-8">
            <div className="flex justify-between items-end mb-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 rounded-full bg-pink-500 block shadow-[0_0_15px_rgba(236,72,153,0.5)]"></span>
                    Presencia Digital
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Instagram Stat */}
                <Link href="/dashboard/social">
                    <div className="p-5 rounded-2xl bg-[#0A0A12] border border-white/5 relative overflow-hidden group hover:border-pink-500/30 transition-all cursor-pointer h-full">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full blur-2xl -mr-5 -mt-5 transition-all group-hover:bg-pink-500/20"></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500">
                                <Instagram className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +12%
                            </span>
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-2xl font-black text-white">1,240</h4>
                            <p className="text-xs text-gray-500">Seguidores</p>
                        </div>
                    </div>
                </Link>

                {/* Engagement Stat */}
                <Link href="/dashboard/analytics">
                    <div className="p-5 rounded-2xl bg-[#0A0A12] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all cursor-pointer h-full">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl -mr-5 -mt-5 transition-all group-hover:bg-purple-500/20"></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                <Share2 className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +5%
                            </span>
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-2xl font-black text-white">4.8%</h4>
                            <p className="text-xs text-gray-500">Engagement Rate</p>
                        </div>
                    </div>
                </Link>

                {/* Content Stat */}
                <Link href="/dashboard/gallery">
                    <div className="p-5 rounded-2xl bg-[#0A0A12] border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all cursor-pointer h-full">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -mr-5 -mt-5 transition-all group-hover:bg-blue-500/20"></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <Youtube className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                Estable
                            </span>
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-2xl font-black text-white">8</h4>
                            <p className="text-xs text-gray-500">Videos este mes</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
