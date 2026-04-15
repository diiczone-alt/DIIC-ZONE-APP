'use client';

import { useRouter } from 'next/navigation';
import EditorIA_Workspace from '@/components/editor-ia/EditorIA_Workspace';

export default function DeepEditorPage() {
    const router = useRouter();

    return (
        <div className="h-screen bg-[#050511] overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px]" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            </div>

            <div className="relative z-10 h-full">
                <EditorIA_Workspace onBack={() => router.back()} />
            </div>
        </div>
    );
}
