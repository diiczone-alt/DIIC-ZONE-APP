/**
 * Real Service para la interacción con Google Drive durante el onboarding.
 */
import { supabase } from '@/lib/supabase';

export const driveService = {
    /**
     * Inicia el flujo OAuth con Google a través de Supabase
     */
    connectGoogle: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                redirectTo: window.location.origin + '/onboarding',
                scopes: 'https://www.googleapis.com/auth/drive.file'

            }
        });
        if (error) throw error;
        return data;
    },

    /**
     * Ejecuta la creación de carpetas en el servidor
     */
    automatedSetup: async (accessToken, brandName) => {
        const response = await fetch('/api/drive/setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken, brandName })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Error al configurar Drive');
        }

        return await response.json();
    },

    /**
     * Estructura de carpetas estándar para referencia UI
     */
    StandardStructure: [
        { name: "01_Identidad", icon: "🎨" },
        { name: "02_Recursos", icon: "📂" },
        { name: "03_Producción", icon: "🎬" },
        { name: "04_Publicaciones", icon: "📱" },
        { name: "05_Finanzas", icon: "💰" },
        { name: "06_Web", icon: "💻" },
        { name: "07_Automatización", icon: "🤖" },
        { name: "08_Métricas", icon: "📊" }
    ]
};

