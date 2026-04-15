'use client';

import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import VideoReviewPlayer from '@/components/editing/VideoReviewPlayer';

// Mock Data
const MOCK_COMMENTS = [
    { id: 1, user: 'Director Creativo', initials: 'DC', text: 'El corte está bien, pero la música entra muy tarde.', timestamp: 12.5, isClient: false },
    { id: 2, user: 'Cliente Demo', initials: 'CD', text: 'Me gusta este color, pero el logo se ve pequeño.', timestamp: 45.2, isClient: true },
];

export default function ReviewPage({ params }) {
    // If VideoReviewPlayer is default export
    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-white/10 bg-[#050510] flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/projects/${params.id}`} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-white font-semibold">Reel_Teaser_V1.mp4</h1>
                        <p className="text-xs text-gray-500">Versión 1 • Subido hace 2 horas</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors">
                        Solicitar Cambios
                    </button>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-black hover:bg-green-400 transition-colors flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Aprobar Video
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden bg-black/90 p-6">
                <VideoReviewPlayer
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    initialComments={MOCK_COMMENTS}
                />
            </div>
        </div>
    );
}
