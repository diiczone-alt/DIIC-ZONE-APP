'use client';

import { Suspense } from 'react';
import StrategyBoard from '../../../components/shared/Strategy/StrategyBoard';

export default function StrategyPage() {
    return (
        <div className="h-screen bg-[#0E0E18] overflow-hidden">
            <Suspense fallback={
                <div className="h-full flex items-center justify-center text-white text-xs font-mono">
                    Cargando Estrategia...
                </div>
            }>
                <StrategyBoard />
            </Suspense>
        </div>
    );
}

