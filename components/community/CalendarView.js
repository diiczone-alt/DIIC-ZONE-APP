'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Instagram, Linkedin, Video, FileText } from 'lucide-react';

const DAYS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

const PLATFORM_ICONS = {
    'instagram': <Instagram className="w-3 h-3" />,
    'linkedin': <Linkedin className="w-3 h-3" />,
    'tiktok': <Video className="w-3 h-3" />,
    'blog': <FileText className="w-3 h-3" />
};

export default function CalendarView({ posts = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Helper to get days in month
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    // Helper to get starting day of week
    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const totalDays = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const getPostsForDay = (day) => {
        return posts.filter(post => {
            const postDate = new Date(post.scheduled_date);
            return postDate.getDate() === day &&
                postDate.getMonth() === currentDate.getMonth() &&
                postDate.getFullYear() === currentDate.getFullYear();
        });
    };

    return (
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-full animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </h3>
                <div className="flex gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-pink-400">
                        <span className="w-2 h-2 rounded-full bg-pink-500"></span> Instagram
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-400">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> LinkedIn
                    </span>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-4 mb-4 text-gray-400 text-xs font-bold text-center uppercase tracking-wider">
                {DAYS.map(d => <div key={d}>{d}</div>)}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-4 flex-1">
                {blanks.map((_, i) => (
                    <div key={`blank-${i}`} className="p-2 h-24 lg:h-32 rounded-xl bg-white/5 opacity-30 border border-white/5"></div>
                ))}

                {days.map(day => {
                    const dayPosts = getPostsForDay(day);
                    const isToday = new Date().getDate() === day &&
                        new Date().getMonth() === currentDate.getMonth();

                    return (
                        <div key={day} className={`p-2 h-24 lg:h-32 rounded-xl border transition-all relative group overflow-hidden
                            ${isToday ? 'bg-primary/10 border-primary/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                            <span className={`text-sm font-bold block mb-2 ${isToday ? 'text-primary' : 'text-gray-400'}`}>
                                {day}
                            </span>

                            <div className="flex flex-col gap-1 overflow-y-auto max-h-[70%] custom-scrollbar">
                                {dayPosts.map((post, idx) => (
                                    <div key={idx} className="px-2 py-1 rounded bg-[#050511]/50 border border-white/10 mb-1 cursor-pointer hover:bg-white/10 flex items-center gap-2">
                                        <span className={`text-${post.platform === 'instagram' ? 'pink' : 'blue'}-400`}>
                                            {PLATFORM_ICONS[post.platform] || <FileText className="w-3 h-3" />}
                                        </span>
                                        <p className="text-[10px] font-bold text-gray-300 truncate">{post.title}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Add Button on Hover */}
                            <button className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
                                +
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
