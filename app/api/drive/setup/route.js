import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { accessToken, brandName } = await req.json();

        if (!accessToken || !brandName) {
            return NextResponse.json({ error: 'Faltan credenciales o nombre de marca.' }, { status: 400 });
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const drive = google.drive({ version: 'v3', auth });

        // 1. Crear Carpeta Raíz
        const rootMetadata = {
            name: `DIIC ZONE - ${brandName}`,
            mimeType: 'application/vnd.google-apps.folder',
        };

        const rootFolder = await drive.files.create({
            resource: rootMetadata,
            fields: 'id, name, webViewLink',
        });

        const rootId = rootFolder.data.id;

        // 2. Estructura de Subcarpetas
        const subfolders = [
            '01_Identidad',
            '02_Recursos',
            '03_Producción',
            '04_Publicaciones',
            '05_Finanzas',
            '06_Web',
            '07_Automatización',
            '08_Métricas'
        ];

        const results = [];
        for (const name of subfolders) {
            const metadata = {
                name,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [rootId],
            };
            const folder = await drive.files.create({
                resource: metadata,
                fields: 'id, name',
            });
            results.push({ id: folder.data.id, name: folder.data.name });
        }

        return NextResponse.json({
            success: true,
            rootId,
            rootLink: rootFolder.data.webViewLink,
            subfolders: results
        });

    } catch (error) {
        console.error('[Drive API Error]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
