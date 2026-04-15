'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/profile?tab=settings');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[50vh] text-gray-400">
            Redirigiendo a configuración de cuenta...
        </div>
    );
}
