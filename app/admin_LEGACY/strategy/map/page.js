'use client';

import Strategic3DMap from '@/components/admin/Strategic3DMap';

export default function StrategicMapPage() {
    return (
        <div className="flex-1 overflow-hidden p-6 md:p-10 flex flex-col">
            <header className="mb-8 shrink-0">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-8 bg-amber-500 rounded-full" />
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">MAPA ESTRATÉGICO GLOBAL</h1>
                </div>
                <p className="text-gray-500 text-sm">Visualización avanzada de la red DIIC ZONE en tiempo real.</p>
            </header>

            <div className="flex-1 relative min-h-0">
                <Strategic3DMap />
            </div>
        </div>
    );
}
