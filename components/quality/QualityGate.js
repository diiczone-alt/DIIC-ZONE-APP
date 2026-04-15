'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { qcService } from '@/services/qcService';

export default function QualityGate({ type = 'QC_INPUT', projectId = 'demo', onComplete }) {
    const [checklist, setChecklist] = useState(null);
    const [checkedItems, setCheckedItems] = useState({});
    const [status, setStatus] = useState('PENDING'); // PENDING, SUBMITTING, PASSED, FAILED

    useEffect(() => {
        const data = qcService.getChecklist(type);
        if (data) {
            setChecklist(data);
            // Initialize all as false
            const initial = {};
            data.items.forEach(i => initial[i.id] = false);
            setCheckedItems(initial);
        }
    }, [type]);

    const toggleItem = (id) => {
        if (status === 'PASSED') return;
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleSubmit = async () => {
        setStatus('SUBMITTING');
        const result = await qcService.submitReview(projectId, type, checkedItems);
        setStatus(result.status);

        if (result.status === 'PASSED' && onComplete) {
            setTimeout(() => onComplete(true), 1500);
        }
    };

    if (!checklist) return null;

    const progress = Object.values(checkedItems).filter(Boolean).length;
    const total = checklist.items.length;
    const isComplete = progress === total;

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 max-w-md w-full relative overflow-hidden group">

            {/* Header */}
            <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className={`p-3 rounded-xl shrink-0 transition-colors ${status === 'PASSED' ? 'bg-green-500/20 text-green-400' :
                        status === 'FAILED' ? 'bg-red-500/20 text-red-400' :
                            'bg-indigo-500/20 text-indigo-400'
                    }`}>
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{checklist.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{checklist.description}</p>
                </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3 relative z-10">
                {checklist.items.map((item) => (
                    <motion.div
                        key={item.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleItem(item.id)}
                        className={`
                            flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                            ${checkedItems[item.id]
                                ? 'bg-green-500/10 border-green-500/30 text-white'
                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }
                        `}
                    >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${checkedItems[item.id] ? 'bg-green-500 border-green-500 text-black' : 'border-gray-600'
                            }`}>
                            {checkedItems[item.id] && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>
                ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-between relative z-10">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Progreso: {progress}/{total}
                </div>

                {status !== 'PASSED' ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!isComplete || status === 'SUBMITTING'}
                        className={`
                            px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all
                            ${isComplete
                                ? 'bg-green-500 hover:bg-green-400 text-black shadow-lg shadow-green-500/20'
                                : 'bg-white/10 text-gray-500 cursor-not-allowed'
                            }
                        `}
                    >
                        {status === 'SUBMITTING' ? 'Verificando...' : 'Aprobar Etapa'}
                        {isComplete && <ChevronRight className="w-4 h-4" />}
                    </button>
                ) : (
                    <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse">
                        <CheckCircle2 className="w-4 h-4" /> Aprobado
                    </div>
                )}
            </div>

            {/* Status Feedback Overlay (Optional simple animation) */}
            {status === 'PASSED' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-green-500/5 pointer-events-none"
                />
            )}
        </div>
    );
}
