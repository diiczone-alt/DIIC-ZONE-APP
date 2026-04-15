'use client';

import MasterCommandCenter from '@/components/admin/MasterCommandCenter';

/**
 * HQ Control Page
 * This route (/dashboard/hq/control) serves as the operational hub
 * for managing the internal operating system of DIIC ZONE.
 */
export default function HQControlPage() {
    return (
        <main className="min-h-screen bg-[#050511]">
            <MasterCommandCenter />
        </main>
    );
}
