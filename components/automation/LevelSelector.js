'use client';

export default function LevelSelector({ levels, activeLevel, onSelect }) {
    return (
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar md:justify-center">
            {levels.map((level) => {
                const isActive = activeLevel === level.id;
                return (
                    <button
                        key={level.id}
                        onClick={() => onSelect(level.id)}
                        className={`flex-shrink-0 px-5 py-3 rounded-2xl border transition-all duration-300 flex flex-col items-center min-w-[140px] ${isActive
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-105'
                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <span className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Nivel {level.id}</span>
                        <span className="text-sm font-bold whitespace-nowrap">{level.name}</span>
                    </button>
                );
            })}
        </div>
    );
}
