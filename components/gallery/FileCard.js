'use client';

import {
    FileText, Image as ImageIcon, Video, Mic2, Folder,
    MoreVertical, Play, Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function FileCard({ file, onNavigate }) {
    const isFolder = file.type === 'folder';

    const getIcon = () => {
        switch (file.type) {
            case 'video': return <Video className="w-6 h-6 text-indigo-400" />;
            case 'image': return <ImageIcon className="w-6 h-6 text-pink-400" />;
            case 'audio': return <Mic2 className="w-6 h-6 text-emerald-400" />;
            case 'folder': return <Folder className="w-6 h-6 text-blue-400" />;
            default: return <FileText className="w-6 h-6 text-gray-400" />;
        }
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            onClick={() => isFolder ? onNavigate() : null}
            className="group relative bg-[#0B0B15] border border-white/5 hover:border-primary/50 aspect-[4/5] rounded-2xl p-4 flex flex-col transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer"
        >
            {/* Top Actions */}
            <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 left-3 right-3 z-10">
                <div className="bg-black/50 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                    {file.type}
                </div>
                <button className="p-1.5 hover:bg-white/20 rounded-lg text-white">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>

            {/* Preview / Icon Area */}
            <div className={`
                flex-1 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden
                ${isFolder ? 'bg-blue-500/5' : 'bg-white/5'}
            `}>
                {/* Background Glow */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-tr ${isFolder ? 'from-blue-500 to-cyan-500' : 'from-indigo-500 to-purple-500'}`}></div>

                {/* Icon */}
                <div className="relative z-10 p-4 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    {getIcon()}
                </div>

                {/* Overlay Action (Play/View) */}
                {!isFolder && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                        <div className="p-3 bg-white text-black rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            {file.type === 'video' || file.type === 'audio' ? <Play className="w-5 h-5 fill-current" /> : <Eye className="w-5 h-5" />}
                        </div>
                    </div>
                )}
            </div>

            {/* Info */}
            <div>
                <h4 className="text-sm font-bold text-gray-200 group-hover:text-white truncate mb-1 transition-colors">
                    {file.name}
                </h4>
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium">
                    <span>{isFolder ? `${file.count} items` : file.size}</span>
                    <span>{file.date}</span>
                </div>
            </div>

            {/* Department Tag */}
            <div className="mt-2 flex">
                <span className={`text-[9px] px-1.5 py-0.5 rounded border border-white/5
                    ${file.department === 'Filmmaker' ? 'text-indigo-400 bg-indigo-500/10' : ''}
                    ${file.department === 'Design' ? 'text-pink-400 bg-pink-500/10' : ''}
                    ${file.department === 'Audio' ? 'text-emerald-400 bg-emerald-500/10' : ''}
                `}>
                    {file.department}
                </span>
            </div>
        </motion.div>
    );
}
