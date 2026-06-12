import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
    console.log('[Calendar API] Sync request received');
    try {
        const { clientId, events } = await req.json();

        if (!clientId || !events || !Array.isArray(events)) {
            console.error('[Calendar API] Missing clientId or events list');
            return NextResponse.json({ error: 'Faltan credenciales del cliente o lista de eventos.' }, { status: 400 });
        }

        // Initialize Supabase with client's Authorization header to respect RLS
        const authHeader = req.headers.get('Authorization');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization: authHeader || ''
                    }
                }
            }
        );

        // Fetch client google tokens
        console.log(`[Calendar API] Fetching Google tokens for client: ${clientId}`);
        const { data: client, error: clientErr } = await supabase
            .from('clients')
            .select('google_access_token, google_refresh_token, google_connected_email')
            .eq('id', clientId)
            .single();

        if (clientErr || !client || !client.google_access_token) {
            console.error('[Calendar API] No active Google connection found in DB:', clientErr);
            return NextResponse.json({ 
                error: 'No se encontró una conexión activa de Google Drive/Calendar para este cliente. Por favor, conéctalo en el Onboarding o en Ajustes.' 
            }, { status: 400 });
        }

        // Setup Google OAuth2 Client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        oauth2Client.setCredentials({
            access_token: client.google_access_token,
            refresh_token: client.google_refresh_token
        });

        // Listen for automatic token refreshes and persist them to DB
        oauth2Client.on('tokens', async (tokens) => {
            if (tokens.access_token) {
                console.log('[Calendar API] Access token refreshed automatically, saving to DB...');
                await supabase
                    .from('clients')
                    .update({ google_access_token: tokens.access_token })
                    .eq('id', clientId);
            }
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // 1. Find or create the "DIIC ZONE" custom calendar
        let calendarId = 'primary';
        try {
            console.log('[Calendar API] Searching for "DIIC ZONE" calendar...');
            const calendarList = await calendar.calendarList.list();
            const existingCalendar = calendarList.data.items?.find(
                item => item.summary === 'DIIC ZONE'
            );

            if (existingCalendar) {
                calendarId = existingCalendar.id;
                console.log(`[Calendar API] Found existing calendar: ${calendarId}`);
            } else {
                console.log('[Calendar API] "DIIC ZONE" calendar not found. Creating a new one...');
                const newCal = await calendar.calendars.insert({
                    requestBody: {
                        summary: 'DIIC ZONE',
                        description: 'Calendario de Producción y Eventos de DIIC ZONE',
                        timeZone: 'America/Santo_Domingo'
                    }
                });
                calendarId = newCal.data.id;
                console.log(`[Calendar API] Created new calendar: ${calendarId}`);
            }
        } catch (calListErr) {
            console.warn('[Calendar API] Failed to manage custom calendar. Falling back to primary calendar:', calListErr.message);
            calendarId = 'primary';
        }

        // 2. Insert events to the calendar
        console.log(`[Calendar API] Syncing ${events.length} events to calendar: ${calendarId}`);
        const syncResults = [];

        for (const event of events) {
            try {
                const response = await calendar.events.insert({
                    calendarId,
                    requestBody: {
                        summary: event.summary,
                        description: event.description || 'Sincronizado vía DIIC ZONE Workspace Engine.',
                        start: {
                            dateTime: event.start,
                            timeZone: 'America/Santo_Domingo'
                        },
                        end: {
                            dateTime: event.end,
                            timeZone: 'America/Santo_Domingo'
                        }
                    }
                });
                syncResults.push({
                    title: event.summary,
                    googleEventId: response.data.id,
                    status: 'success'
                });
            } catch (eventErr) {
                console.error(`[Calendar API] Error syncing event "${event.summary}":`, eventErr.message);
                syncResults.push({
                    title: event.summary,
                    error: eventErr.message,
                    status: 'failed'
                });
            }
        }

        const successfulSyncs = syncResults.filter(r => r.status === 'success').length;
        console.log(`[Calendar API] Completed sync. Success: ${successfulSyncs}/${events.length}`);

        return NextResponse.json({
            success: true,
            syncedCount: successfulSyncs,
            calendarId,
            results: syncResults
        });

    } catch (err) {
        console.error('[Calendar API Fatal Error]:', err);
        return NextResponse.json({ error: err.message || 'Error interno al sincronizar calendario' }, { status: 500 });
    }
}
