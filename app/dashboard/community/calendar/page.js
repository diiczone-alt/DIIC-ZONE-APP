'use client';

import UnifiedCalendar from '../../../../components/calendar/UnifiedCalendar';

export default function ClientCalendarPage() {
    return (
        <div className="h-screen bg-[#050511] p-8">
            <UnifiedCalendar role="client" />
        </div>
    );
}
