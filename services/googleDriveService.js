import { supabase } from '@/lib/supabase';

/**
 * Google Drive Service
 * Manages client-specific folder structures and file synchronization.
 * Uses OAuth 2.0 tokens stored in the clients table.
 */
export const googleDriveService = {
    /**
     * Initializes a brand directory structure in the client's Drive.
     * @param {string} clientId - The brand ID
     */
    initializeWorkspace: async (clientId) => {
        console.log(`[GoogleDrive] Initializing workspace for client: ${clientId}`);
        
        try {
            // 1. Get tokens from DB
            const { data: client, error } = await supabase
                .from('clients')
                .select('google_access_token, google_refresh_token, name')
                .eq('id', clientId)
                .single();

            if (!client?.google_access_token) {
                throw new Error('No Google connection found for this client.');
            }

            // 2. Call the setup API route
            const response = await fetch('/api/drive/setup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accessToken: client.google_access_token,
                    brandName: client.name
                })
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to setup folders via Google API');
            }

            const folderId = result.rootId;
            const folderLink = result.rootLink;

            // 3. Save root folder ID back to DB
            await supabase
                .from('clients')
                .update({ 
                    google_drive_folder_id: folderId,
                    google_connected_email: folderLink
                })
                .eq('id', clientId);

            return { success: true, folderId, folderLink };
        } catch (err) {
            console.error('[GoogleDrive] Initialization failed:', err.message);
            return { success: false, error: err.message };
        }
    },

    /**
     * Uploads an asset (Reel, Design, etc.) to the specific client folder.
     */
    uploadAsset: async (clientId, file, folderType = 'REELS') => {
        // Implementation will include calling Google Drive API multipart upload
        console.log(`[GoogleDrive] Uploading to ${folderType} for ${clientId}...`);
        return { success: true, fileUrl: 'https://drive.google.com/mock' };
    }
};
