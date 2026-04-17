'use client';

import { useAuth } from '@/context/AuthContext';
import CMSidebar from '@/components/workstation/community-manager/CMSidebar';
import FilmmakerSidebar from '@/components/workstation/filmmaker/FilmmakerSidebar';
import DesignerSidebar from '@/components/workstation/designer/DesignerSidebar';
import EditorSidebar from '@/components/workstation/editor/EditorSidebar';
import AudioSidebar from '@/components/workstation/audio/AudioSidebar';
import AdminSidebar from '@/components/Sidebar';
import ClientHubSidebar from '@/components/layout/Sidebar';

export default function DynamicSidebar() {
    const { user } = useAuth();
    
    if (!user) return null;

    let role = (user.role || '').toUpperCase();
    const fullName = (user.full_name || user.user_metadata?.full_name || '').toUpperCase();

    // Mapeo detallado de roles a sus respectivas barras laterales
    switch (role) {
        case 'ADMIN':
            return <AdminSidebar />;
        case 'COMMUNITY':
        case 'CM':
            return <CMSidebar />;
        case 'FILMMAKER':
            return <FilmmakerSidebar />;
        case 'DESIGN':
        case 'DESIGNER':
            return <DesignerSidebar />;
        case 'EDITOR':
            return <EditorSidebar />;
        case 'AUDIO':
        case 'MUSIC':
            return <AudioSidebar />;
        default:
            // Por defecto, usamos la barra de alta fidelidad 'Client Hub'
            return <ClientHubSidebar />;
    }
}
