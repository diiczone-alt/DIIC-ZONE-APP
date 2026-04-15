'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VideoPlayer({ src, onTimeUpdate, comments = [] }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            setProgress((current / total) * 100);
            if (onTimeUpdate) onTimeUpdate(current);
        }
    };

    const handleSeek = (e) => {
        const timeline = e.currentTarget;
        const clickPosition = (e.clientX - timeline.getBoundingClientRect().left) / timeline.offsetWidth;
        if (videoRef.current) {
            videoRef.current.currentTime = clickPosition * videoRef.current.duration;
        }
    };

    return (
        <div className="relative group bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 aspect-video">
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(videoRef.current.duration)}
                onClick={togglePlay}
            />

            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">

                {/* Timeline */}
                <div
                    className="w-full h-2 bg-white/20 rounded-full mb-4 cursor-pointer relative group/timeline"
                    onClick={handleSeek}
                >
                    <div
                        className="h-full bg-primary rounded-full relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full scale-0 group-hover/timeline:scale-100 transition-transform shadow-md" />
                    </div>

                    {/* Comment Markers */}
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full hover:scale-150 transition-transform cursor-help z-10"
                            style={{ left: `${(comment.timestamp / duration) * 100}%` }}
                            title={`${comment.author}: ${comment.text}`}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                        </button>

                        <div className="flex items-center gap-2 text-sm text-gray-300 font-mono">
                            <span>{formatTime(videoRef.current?.currentTime || 0)}</span>
                            <span>/</span>
                            <span>{formatTime(duration || 0)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-gray-300">
                            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                        </button>
                        <button className="text-white hover:text-gray-300">
                            <Maximize className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}
