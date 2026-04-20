import React from 'react';
import { motion } from 'framer-motion';

const GlassInput = ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    type = "text", 
    icon: Icon, 
    readOnly = false,
    className = "",
    error = null
}) => {
    return (
        <div className={`space-y-3 group ${className}`}>
            {label && (
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                    {Icon && <Icon className="w-3 h-3" />}
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    className={`
                        w-full bg-white/[0.02] border rounded-2xl py-4 px-6 text-white outline-none 
                        transition-all duration-300 font-bold text-sm
                        ${readOnly 
                            ? 'border-white/5 cursor-not-allowed opacity-60' 
                            : 'border-white/5 focus:border-indigo-500/50 focus:bg-white/[0.04] focus:shadow-[0_0_20px_rgba(79,70,229,0.1)]'
                        }
                        ${error ? 'border-rose-500/50 focus:border-rose-500' : ''}
                    `}
                />
                
                {/* Subtle bottom glow effect on focus */}
                {!readOnly && (
                    <motion.div 
                        initial={false}
                        animate={{ opacity: 0 }}
                        whileFocus={{ opacity: 1 }}
                        className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm pointer-events-none"
                    />
                )}
            </div>
            {error && <p className="text-[10px] font-bold text-rose-500 pl-2 italic">{error}</p>}
        </div>
    );
};

export default GlassInput;
