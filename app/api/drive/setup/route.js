import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
    console.log('[Drive API] Setup request received');
    try {
        const { accessToken, brandName } = await req.json();

        if (!accessToken || !brandName) {
            console.error('[Drive API] Missing accessToken or brandName');
            return NextResponse.json({ error: 'Faltan credenciales o nombre de marca.' }, { status: 400 });
        }

        console.log(`[Drive API] Initializing Google Auth for brand: ${brandName}`);
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const drive = google.drive({ version: 'v3', auth });

        // 1. Buscar o Crear la carpeta padre "DIIC ZONE"
        let parentId = null;
        try {
            console.log('[Drive API] Searching for existing DIIC ZONE folder...');
            const listResponse = await drive.files.list({
                q: "name = 'DIIC ZONE' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
                fields: 'files(id, name, webViewLink)',
                spaces: 'drive'
            });

            const existingFolders = listResponse.data.files || [];
            if (existingFolders.length > 0) {
                parentId = existingFolders[0].id;
                console.log(`[Drive API] Found existing DIIC ZONE folder with ID: ${parentId}`);
            } else {
                console.log('[Drive API] DIIC ZONE folder not found. Creating a new one...');
                const parentMetadata = {
                    name: 'DIIC ZONE',
                    mimeType: 'application/vnd.google-apps.folder',
                };
                const parentFolder = await drive.files.create({
                    resource: parentMetadata,
                    fields: 'id, name, webViewLink',
                });
                parentId = parentFolder.data.id;
                console.log(`[Drive API] Created new DIIC ZONE parent folder with ID: ${parentId}`);
            }
        } catch (searchErr) {
            console.error('[Drive API] Error searching/creating parent DIIC ZONE folder:', searchErr);
            throw new Error(`Error con carpeta DIIC ZONE: ${searchErr.message}`);
        }

        // 2. Crear Carpeta de la Marca dentro de "DIIC ZONE"
        console.log(`[Drive API] Creating brand folder "${brandName}" inside DIIC ZONE...`);
        const brandMetadata = {
            name: brandName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentId],
        };

        const brandFolder = await drive.files.create({
            resource: brandMetadata,
            fields: 'id, name, webViewLink',
        });

        const brandFolderId = brandFolder.data.id;
        const brandFolderLink = brandFolder.data.webViewLink;
        console.log(`[Drive API] Brand folder created successfully. ID: ${brandFolderId}`);

        // 3. Estructura de Subcarpetas dentro de la carpeta de la marca
        const subfolders = [
            '01_Identidad', '02_Recursos', '03_Producción', 
            '04_Publicaciones', '05_Finanzas', '06_Web', 
            '07_Automatización', '08_Métricas'
        ];
        
        console.log('[Drive API] Creating subfolders parallelly...');
        const results = await Promise.all(subfolders.map(async (name) => {
            const metadata = {
                name,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [brandFolderId],
            };
            const folder = await drive.files.create({
                resource: metadata,
                fields: 'id, name',
            });
            return { id: folder.data.id, name: folder.data.name };
        }));

        console.log('[Drive API] All folders created successfully.');
        return NextResponse.json({
            success: true,
            rootId: brandFolderId,
            rootLink: brandFolderLink,
            subfolders: results
        });

    } catch (error) {
        console.error('[Drive API Error]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
