'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, MessageSquare, Clock, Send } from 'lucide-react';

export default function VideoReviewPlayer({ src, initialComments = [] }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) setDuration(videoRef.current.duration);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const addComment = () => {
        if (!newComment.trim()) return;
        const comment = {
            id: Date.now(),
            text: newComment,
            timestamp: currentTime,
            user: 'Cliente',
            avatar: 'DZ',
            color: 'bg-primary'
        };
        setComments([...comments, comment].sort((a, b) => a.timestamp - b.timestamp));
        setNewComment('');
    };

    const jumpToTime = (time) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            // Optionally auto-play
            // videoRef.current.play();
            // setIsPlaying(true);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[500px]">
            {/* Video Player Area */}
            <div className="flex-1 bg-black/50 rounded-3xl overflow-hidden relative group border border-white/5 flex flex-col">
                <div className="relative flex-1 bg-black flex items-center justify-center">
                    <video
                        ref={videoRef}
                        src={src}
                        className="max-h-full max-w-full"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onClick={togglePlay}
                    />

                    {/* Play Button Overlay */}
                    {!isPlaying && (
                        <div
                            className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                            onClick={togglePlay}
                        >
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 fill-current ml-1" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="p-4 bg-[#0B0B15]">
                    <div className="flex items-center gap-4 mb-2">
                        <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                        </button>
                        <span className="text-white text-xs font-mono">{formatTime(currentTime)} / {formatTime(duration)}</span>

                        {/* Seeker */}
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={(e) => {
                                const time = parseFloat(e.target.value);
                                videoRef.current.currentTime = time;
                                setCurrentTime(time);
                            }}
                            className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </div>

                {/* Comments Markers on Timeline (Optional visual enhancement) */}
                <div className="absolute bottom-[52px] left-16 right-4 h-1 pointer-events-none">
                    {comments.map(c => (
                        <div
                            key={c.id}
                            className="absolute top-0 w-2 h-2 rounded-full bg-yellow-400 -ml-1"
                            style={{ left: `${(c.timestamp / duration) * 100}%` }}
                        />
                    ))}
                </div>
            </div>

            {/* Comments Sidebar */}
            <div className="w-full lg:w-96 glass-panel rounded-3xl flex flex-col">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-gray-400" /> Notas de Revisión
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p className="text-sm">No hay comentarios aún.</p>
                            <p className="text-xs mt-1">Pausa el video y escribe una nota.</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                                onClick={() => jumpToTime(comment.timestamp)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-yellow-500 flex items-center gap-1 group-hover:bg-yellow-500/10 transition-colors">
                                        <Clock className="w-3 h-3" /> {formatTime(comment.timestamp)}
                                    </span>
                                    <span className="text-[10px] text-gray-500">{comment.user}</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-snug">{comment.text}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-white/5 bg-black/20">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={`Comentar en ${formatTime(currentTime)}...`}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-3 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
                                onKeyDown={(e) => e.key === 'Enter' && addComment()}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-500 bg-white/5 px-1 rounded">
                                {formatTime(currentTime)}
                            </span>
                        </div>
                        <button
                            onClick={addComment}
                            className="p-2.5 bg-primary rounded-xl text-white hover:bg-primary/90 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
