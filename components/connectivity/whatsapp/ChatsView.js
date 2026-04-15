'use client';

import { useState } from 'react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import LeadPanel from './LeadPanel';

export default function ChatsView() {
    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <div className="flex-1 flex h-full overflow-hidden bg-[#050511]">
            {/* Column 1: Conversations List (30% or fixed width) */}
            <ConversationList
                activeId={selectedChat?.id}
                onSelect={setSelectedChat}
            />

            {/* Column 2: Active Chat Window (Fluid) */}
            <ChatWindow
                chat={selectedChat}
            />

            {/* Column 3: Lead Intelligence Panel (25% or fixed width) */}
            <LeadPanel
                chat={selectedChat}
            />
        </div>
    )
}
