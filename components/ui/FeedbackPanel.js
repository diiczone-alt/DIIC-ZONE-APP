'use client';

import { Send, User } from 'lucide-react';
import { useState } from 'react';

export default function FeedbackPanel({ comments, onAddComment }) {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a16] border-l border-white/10 w-full lg:w-96">
            <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold text-white">Comentarios</h3>
                <p className="text-xs text-gray-400">{comments.length} notas en este video</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 group">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${comment.isClient ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}>
                            {comment.initials}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-baseline justify-between mb-1">
                                <span className="text-sm font-medium text-gray-200">{comment.author}</span>
                                <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-1.5 rounded">{formatTime(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{comment.text}</p>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                        <p>No hay comentarios.</p>
                        <p className="text-sm">Sé el primero en opinar.</p>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-white/10 bg-[#050510]">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}
