import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

const PremiumDropdown = ({ value, onChange, options, label, icon: Icon, searchable = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset search when opening
    useEffect(() => {
        if (isOpen) setSearchTerm('');
    }, [isOpen]);

    const selectedOption = options.find(opt => opt.value === value) || options[0];
    const filteredOptions = searchable 
        ? options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
        : options;

    return (
        <div className="space-y-3 relative" ref={containerRef}>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4 flex items-center gap-2">
                {Icon && <Icon className="w-3 h-3" />} {label}
            </label>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white/[0.03] border ${isOpen ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.1)]' : 'border-white/5'} rounded-2xl py-4 px-6 text-white cursor-pointer transition-all flex items-center justify-between group`}
            >
                <div className="flex flex-col">
                    <span className="font-bold">{selectedOption?.label || value}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[200] top-full left-0 right-0 mt-2 bg-[#0A0A1F]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-4xl overflow-hidden p-2"
                    >
                        {searchable && (
                            <div className="p-2 border-b border-white/5 mb-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                                    <input 
                                        autoFocus
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-indigo-500/30 transition-all font-bold"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={`px-5 py-3 rounded-xl cursor-pointer transition-all flex items-center justify-between group
                                            ${value === option.value ? 'bg-indigo-600/20 text-indigo-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <span className="font-bold text-sm">{option.label}</span>
                                        {value === option.value && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.8)]" />}
                                    </div>
                                ))
                            ) : (
                                <div className="px-5 py-4 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">No resultados</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PremiumDropdown;
