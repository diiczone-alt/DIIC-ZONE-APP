'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, GraduationCap } from 'lucide-react';
import UnifiedAcademyPage from '@/components/academy/UnifiedAcademyPage';
import WorkstationProfileDropdown from '@/components/workstation/WorkstationProfileDropdown';

export default function AudioAcademyPage() {
    const router = useRouter();

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050511]/90 backdrop-blur-md shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-violet-400" /> Academia de Audio
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <WorkstationProfileDropdown role="Audio" />
                </div>
            </header>
            <div className="flex-1 overflow-hidden relative">
                <UnifiedAcademyPage />
            </div>
        </div>
    );
}
