'use client';

import SalesLayout from '@/components/sales/SalesLayout';
import { useRouter } from 'next/navigation';

export default function SalesPage() {
    const router = useRouter();

    return (
        <div className="h-[calc(100vh-4rem)]">
            <SalesLayout onBack={() => router.back()} />
        </div>
    );
}
