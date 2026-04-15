'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CMShimRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/workstation/community-manager');
    }, [router]);

    return (
        <div className="min-h-screen bg-[#050511] flex items-center justify-center p-6 text-white text-center">
            <div className="animate-pulse">
                <span className="text-sm font-bold text-gray-400">Restaurando conexión con el nodo de Community Manager...</span>
            </div>
        </div>
    );
}
