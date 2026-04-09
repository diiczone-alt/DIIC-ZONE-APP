'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MONTHS = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

const DAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

export default function DatePicker({ value, onChange, placeholder = 'Seleccionar fecha' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());
    const containerRef = useRef(null);

    // Parse value if it's a string like "01 Oct 2026"
    useEffect(() => {
        if (value && typeof value === 'string') {
            const parts = value.split(' ');
            if (parts.length === 3) {
                const day = parseInt(parts[0]);
                const monthIdx = MONTHS.indexOf(parts[1]);
                const year = parseInt(parts[2]);
                if (!isNaN(day) && monthIdx !== -1 && !isNaN(year)) {
                    // Create date safely
                    const d = new Date(year, monthIdx, day);
                    if (!isNaN(d.getTime())) {
                        setViewDate(d);
                    }
                }
            }
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (date) => {
        const d = date.getDate().toString().padStart(2, '0');
        const m = MONTHS[date.getMonth()];
        const y = date.getFullYear();
        return `${d} ${m} ${y}`;
    };

    const getDaysInMonth = (year, month) => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        return days;
    };

    const handleDateSelect = (date) => {
        onChange(formatDate(date));
        setIsOpen(false);
    };

    const changeMonth = (offset) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    const currentDays = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());

    return (
        <div className="relative w-full" ref={containerRef}>
            <div 
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] px-8 py-5 text-white font-bold placeholder:text-gray-800 focus-within:bg-white/[0.04] focus-within:border-emerald-500/30 outline-none transition-all shadow-inner cursor-pointer flex items-center justify-between group"
            >
                <span className={`text-sm ${value ? 'text-white' : 'text-gray-600'}`}>
                    {value || placeholder}
                </span>
                <CalendarIcon className={`w-4 h-4 transition-colors ${isOpen ? 'text-emerald-400' : 'text-gray-600 group-hover:text-gray-400'}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute z-[110] top-full mt-4 left-0 w-[280px] sm:w-80 bg-[#0A0A0F]/95 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 to-cyan-500/50" />
                        
                        <div className="flex items-center justify-between mb-6">
                            <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); changeMonth(-1); }}
                                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h4 className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic">
                                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                            </h4>
                            <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); changeMonth(1); }}
                                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {DAYS.map(d => (
                                <div key={d} className="text-center text-[9px] font-black text-gray-600 uppercase py-2">
                                    {d}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {currentDays.map((date, idx) => {
                                if (!date) return <div key={`empty-${idx}`} />;
                                
                                const isSelected = value === formatDate(date);
                                const isToday = formatDate(date) === formatDate(new Date());

                                return (
                                    <button
                                        key={date.toISOString()}
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleDateSelect(date); }}
                                        className={`
                                            aspect-square rounded-xl text-[11px] font-bold transition-all flex items-center justify-center relative group
                                            ${isSelected 
                                                ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                                                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                                            ${isToday && !isSelected ? 'text-emerald-400' : ''}
                                        `}
                                    >
                                        {date.getDate()}
                                        {isToday && !isSelected && (
                                            <div className="absolute bottom-1 w-1 h-1 bg-emerald-400 rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-center">
                            <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleDateSelect(new Date()); }}
                                className="text-[9px] font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors"
                            >
                                Ir a Hoy
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
