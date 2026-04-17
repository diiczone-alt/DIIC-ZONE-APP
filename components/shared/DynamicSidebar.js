'use client';

import { useAuth } from '@/context/AuthContext';
import CMSidebar from '@/components/workstation/community-manager/CMSidebar';
import FilmmakerSidebar from '@/components/workstation/filmmaker/FilmmakerSidebar';
import DesignerSidebar from '@/components/workstation/designer/DesignerSidebar';
import EditorSidebar from '@/components/workstation/editor/EditorSidebar';
import AudioSidebar from '@/components/workstation/audio/AudioSidebar';
import AdminSidebar from '@/components/Sidebar';

export default function DynamicSidebar() {
    const { user } = useAuth();
    
    if (!user) return null;

    const role = (user.role || '').toUpperCase();

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
            // Por defecto, si es un cliente o rol no mapeado, mostramos la barra administrativa
            // o podrías optar por no mostrar ninguna dependiendo de la seguridad
            return <AdminSidebar />;
    }
}
