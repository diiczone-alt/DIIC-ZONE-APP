'use client';

import { Play, Clock, Download, MoreHorizontal } from 'lucide-react';

export default function TrackList({ tracks }) {
    if (!tracks || tracks.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No hay pistas disponibles.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {tracks.map((track, index) => (
                <div
                    key={track.id || index}
                    className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer"
                >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-primary transition-all">
                        <Play className="w-4 h-4 fill-current" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-200 group-hover:text-white truncate">{track.title}</h4>
                        <p className="text-xs text-gray-500 truncate">{track.artist} • {track.genre}</p>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{track.duration}</span>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
