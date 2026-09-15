'use client';

import EventsCalendar from '../events/EventsCalendar';

export default function UnifiedCalendar({ role = 'cm', clientId = null, campaignId = null, embedded = false }) {
    return (
        <div className="h-full w-full">
            <EventsCalendar role={role} clientId={clientId} />
        </div>
    );
}
