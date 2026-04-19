'use client';

import { motion } from 'framer-motion';
import { Instagram, Facebook, Youtube, ExternalLink, RefreshCw, Eye } from 'lucide-react';

export default function SocialFeedPreview({ connected, platform = 'instagram' }) {
    
    const mockPosts = [
        { id: 1, type: 'video', url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80', status: 'published', engagement: '1.2K' },
        { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80', status: 'scheduled', time: 'Mañana 10:00' },
        { id: 3, type: 'video', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&q=80', status: 'published', engagement: '850' },
    ];

    if (!connected) {
        return (
            <div className="bg-[#11111d] border border-white/5 rounded-[2.5rem] p-8 h-full flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50" />
                
                <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 animate-pulse">
                    <RefreshCw className="w-10 h-10" />
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Sincronización Pendiente</h3>
                    <p className="text-sm text-gray-400 font-bold max-w-[200px] leading-relaxed">
                        Conecta tus redes sociales para activar la previsualización en tiempo real.
                    </p>
                </div>

                <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                    Vincular Ahora
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#11111d] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group h-full">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        {platform === 'instagram' ? <Instagram className="w-5 h-5" /> : <Facebook className="w-5 h-5" />}
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-widest italic">Hub Activity</h2>
                        <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em]">En Vivo • Sincronizado</p>
                    </div>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white">
                    <ExternalLink className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-2">
                {mockPosts.map((post, index) => (
                    <motion.div 
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative aspect-square rounded-2xl overflow-hidden border border-white/10 group/post ${index === 0 ? 'col-span-2 aspect-video' : ''}`}
                    >
                        <img 
                            src={post.url} 
                            alt="Social content" 
                            className="w-full h-full object-cover grayscale-[20%] group-hover/post:grayscale-0 group-hover/post:scale-110 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/post:opacity-100 transition-opacity flex flex-col justify-end p-4">
                            <div className="flex justify-between items-center text-white">
                                <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> {post.engagement || 'Preview'}
                                </span>
                                {post.status === 'scheduled' && (
                                    <span className="bg-amber-500 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">
                                        Programado
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full py-4 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20">
                Gestionar Contenidos
            </button>
        </div>
    );
}
