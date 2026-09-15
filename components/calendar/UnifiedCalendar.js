'use client';

import EventsCalendar from '../events/EventsCalendar';

export default function UnifiedCalendar({ 
    role = 'cm', 
    clientId = null, 
    client = null, 
    clients = [], 
    squad = [], 
    user = null, 
    campaignId = null, 
    embedded = false 
}) {
    return (
        <div className="h-full w-full">
            <EventsCalendar 
                role={role} 
                clientId={clientId} 
                client={client} 
                clients={clients} 
                squad={squad} 
                user={user} 
                campaignId={campaignId} 
                embedded={embedded} 
            />
        </div>
    );
}
