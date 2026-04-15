import { supabase } from '../lib/supabase';

// Mock Data for Initial State
const DRIVE_FOLDERS = [
    { id: '1', name: '01_Community_Manager', type: 'folder', provider: 'drive', updated: '2024-03-10' },
    { id: '2', name: '02_Diseño_Gráfico', type: 'folder', provider: 'drive', updated: '2024-03-12' },
    { id: '3', name: '03_Edición_Video', type: 'folder', provider: 'drive', updated: '2024-03-15' },
    { id: '4', name: '04_Fotografía', type: 'folder', provider: 'drive', updated: '2024-02-20' },
];

const MOCK_FILES = [
    { id: '101', parentId: '1', name: 'Calendario_Marzo.pdf', type: 'pdf', size: '2.5 MB', updated: 'Hace 2h', status: 'synced' },
    { id: '102', parentId: '1', name: 'Copy_Ideas_V2.docx', type: 'doc', size: '1.2 MB', updated: 'Ayer', status: 'synced' },
    { id: '201', parentId: '2', name: 'Logo_Final.png', type: 'image', size: '4.5 MB', updated: 'Hace 5d', status: 'synced' },
    { id: '202', parentId: '2', name: 'Banner_Web.psd', type: 'psd', size: '45 MB', updated: 'Hace 1sem', status: 'pending' },
    { id: '301', parentId: '3', name: 'Raw_Drone_Shot.mp4', type: 'video', size: '1.2 GB', updated: 'Hace 1h', status: 'syncing' },
];

export const storageService = {
    // 1. Get Integration Status
    getIntegrations: async () => {
        // Simulate API delay
        await new Promise(r => setTimeout(r, 800));
        return [
            { id: 'gdrive', name: 'Google Drive', connected: true, account: 'cliente@demo.com', usage: '45%' },
            { id: 'dropbox', name: 'Dropbox', connected: false, account: null, usage: '0%' },
        ];
    },

    // 2. Connect Provider (Mock)
    connectProvider: async (provider) => {
        await new Promise(r => setTimeout(r, 1500));
        return { success: true, message: `Conectado exitosamente a ${provider}` };
    },

    // 3. List Files (Simulating both DB and Cloud merge)
    listFiles: async (folderId = 'root') => {
        await new Promise(r => setTimeout(r, 600));
        if (folderId === 'root') return { folders: DRIVE_FOLDERS, files: [] };

        // Return files for specific folder
        return {
            folders: [],
            files: MOCK_FILES.filter(f => f.parentId === folderId)
        };
    },

    // 4. Upload File (Mock)
    uploadFile: async (file, folderId) => {
        console.log(`Uploading ${file.name} to ${folderId}...`);
        await new Promise(r => setTimeout(r, 2000));
        return {
            id: Date.now().toString(),
            parentId: folderId,
            name: file.name,
            type: file.name.split('.').pop(),
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            updated: 'Ahora',
            status: 'synced'
        };
    }
};
