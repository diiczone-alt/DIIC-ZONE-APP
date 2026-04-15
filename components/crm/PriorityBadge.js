import { PRIORITY_LEVELS } from '@/utils/priorityCalculator';

export default function PriorityBadge({ level, showLabel = true }) {
    const config = PRIORITY_LEVELS[level] || PRIORITY_LEVELS.P5;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/5 ${config.color.replace('bg-', 'bg-').replace('500', '500/10')} ${config.textColor}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
            {showLabel && <span className="text-[10px] font-bold uppercase tracking-wide">{config.label}</span>}
        </span>
    );
}
