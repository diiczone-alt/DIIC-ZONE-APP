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

    let role = (user.role || user.user_metadata?.role || '').toUpperCase();
    const specialty = (user.specialty || user.user_metadata?.specialty || '').toUpperCase();
    const fullName = (user.full_name || user.user_metadata?.full_name || user.name || '').toUpperCase();

    // Check for Community Manager patterns across role, specialty, or name
    if (
        role === 'COMMUNITY' || 
        role === 'CM' || 
        role === 'COMMUNITY_MANAGER' || 
        role.includes('COMMUNITY') || 
        specialty.includes('COMMUNITY') || 
        specialty.includes('ESTRATEGA') || 
        fullName.includes(' CM') || 
        fullName.includes('(CM)') ||
        fullName.includes('ESTRATEGA')
    ) {
        return <CMSidebar />;
    }

    // Mapeo detallado de roles a sus respectivas barras laterales
    switch (role) {
        case 'ADMIN':
            return <AdminSidebar />;
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
            if (specialty.includes('FILM')) return <FilmmakerSidebar />;
            if (specialty.includes('DISEÑ') || specialty.includes('DESIGN')) return <DesignerSidebar />;
            if (specialty.includes('EDIT')) return <EditorSidebar />;
            if (specialty.includes('AUDIO')) return <AudioSidebar />;
            // Por defecto, usamos la barra de alta fidelidad 'Client Hub'
            return <ClientHubSidebar />;
    }
}
