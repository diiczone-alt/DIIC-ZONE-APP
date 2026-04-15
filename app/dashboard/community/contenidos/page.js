'use client';

import ContentKanban from '../../../../components/shared/Kanban/ContentKanban';

export default function ContenidosPage() {
    return (
        <div className="h-screen bg-[#050511] p-8">
            <ContentKanban role="client" clientName="Clínica Dental RM" />
        </div>
    );
}
