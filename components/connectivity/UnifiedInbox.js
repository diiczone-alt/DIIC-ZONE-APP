'use client';

import { useState } from 'react';
import InboxList from './inbox/InboxList';
import InboxChat from './inbox/InboxChat';
import InboxContext from './inbox/InboxContext';

export default function UnifiedInbox() {
    const [selectedConversation, setSelectedConversation] = useState(null);

    return (
        <div className="h-[80vh] flex glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            {/* Left Column: List */}
            <InboxList
                selectedId={selectedConversation?.id}
                onSelect={setSelectedConversation}
            />

            {/* Middle Column: Chat */}
            <InboxChat conversation={selectedConversation} />

            {/* Right Column: Context (CRM) */}
            <InboxContext conversation={selectedConversation} />
        </div>
    );
}
