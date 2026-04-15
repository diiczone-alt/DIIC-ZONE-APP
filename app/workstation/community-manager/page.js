'use client';

import CMWorkstationLayout from '@/components/workstation/cm/CMWorkstationLayout';
import { Suspense } from 'react';

export default function CMPage() {
    return (
        <div className="h-[calc(100vh-4rem)]">
            <Suspense fallback={<div className="flex h-full items-center justify-center text-cyan-400 font-bold uppercase tracking-widest italic">Cargando Workstation...</div>}>
                <CMWorkstationLayout />
            </Suspense>
        </div>
    );
}
