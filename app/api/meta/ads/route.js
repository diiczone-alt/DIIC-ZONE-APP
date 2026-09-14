import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
    try {
        const body = await req.json();
        const { clientId, adAccountId, accessToken, action = 'fetch_campaigns' } = body;

        // 1. ACTION: VALIDATE TOKEN & LIST AD ACCOUNTS
        if (action === 'validate') {
            if (!accessToken) {
                return NextResponse.json({ success: false, error: 'Token de acceso no proporcionado.' }, { status: 400 });
            }

            // Verify token with Meta Graph API
            const meRes = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,email&access_token=${accessToken}`);
            const meData = await meRes.json();

            if (meData.error) {
                return NextResponse.json({ 
                    success: false, 
                    error: meData.error.message || 'Token de Meta inválido o expirado.',
                    metaError: meData.error 
                }, { status: 400 });
            }

            // Fetch available ad accounts
            const accsRes = await fetch(`https://graph.facebook.com/v19.0/me/adaccounts?fields=id,account_id,name,currency,account_status,amount_spent&access_token=${accessToken}`);
            const accsData = await accsRes.json();
            const adAccounts = (accsData.data || []).map(acc => ({
                id: acc.id, // act_XXXXXXXXX
                account_id: acc.account_id,
                name: acc.name || `Cuenta ${acc.account_id}`,
                currency: acc.currency || 'USD',
                status: acc.account_status,
                amount_spent: acc.amount_spent ? (Number(acc.amount_spent) / 100).toFixed(2) : '0'
            }));

            return NextResponse.json({
                success: true,
                user: meData,
                adAccounts
            });
        }

        // 2. ACTION: SAVE REAL CONNECTION
        if (action === 'save_connection') {
            if (!clientId || !accessToken || !adAccountId) {
                return NextResponse.json({ success: false, error: 'Faltan parámetros requeridos (clientId, accessToken, adAccountId).' }, { status: 400 });
            }

            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id || '00000000-0000-0000-0000-000000000000';

            const metadata = {
                ad_account_id: adAccountId,
                account_name: body.accountName || adAccountId,
                connected_at: new Date().toISOString(),
                direct_token: true
            };

            // Save in brand_connections
            await supabase
                .from('brand_connections')
                .upsert({
                    user_id: userId,
                    client_id: clientId,
                    provider: 'facebook',
                    provider_id: adAccountId,
                    access_token: accessToken,
                    status: 'ACTIVE',
                    expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                    metadata: metadata,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'client_id,provider' });

            // Save in social_connections
            await supabase
                .from('social_connections')
                .upsert({
                    user_id: userId,
                    client_id: clientId,
                    platform: 'facebook',
                    external_id: adAccountId,
                    access_token: accessToken,
                    expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                    metadata: metadata,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'client_id,platform' });

            return NextResponse.json({
                success: true,
                message: 'Conexión con Meta Ads guardada exitosamente.'
            });
        }

        // 3. ACTION: DISCONNECT
        if (action === 'disconnect') {
            if (!clientId) {
                return NextResponse.json({ success: false, error: 'clientId requerido' }, { status: 400 });
            }

            await supabase
                .from('brand_connections')
                .delete()
                .eq('client_id', clientId)
                .in('provider', ['facebook', 'meta']);

            await supabase
                .from('social_connections')
                .delete()
                .eq('client_id', clientId)
                .in('platform', ['facebook', 'meta']);

            return NextResponse.json({ success: true, message: 'Cuenta de Meta desconectada.' });
        }

        // 4. ACTION: FETCH REAL LIVE CAMPAIGNS & INSIGHTS
        let token = accessToken;
        let targetAdAccount = adAccountId;
        let accountName = null;

        // If token not provided directly, load from database
        if (!token || !targetAdAccount) {
            const { data: conn } = await supabase
                .from('brand_connections')
                .select('*')
                .eq('client_id', clientId)
                .in('provider', ['facebook', 'meta'])
                .maybeSingle();

            if (conn && conn.access_token) {
                token = conn.access_token;
                targetAdAccount = conn.metadata?.ad_account_id || conn.provider_id;
                accountName = conn.metadata?.account_name || null;
            } else {
                const { data: sConn } = await supabase
                    .from('social_connections')
                    .select('*')
                    .eq('client_id', clientId)
                    .in('platform', ['facebook', 'meta'])
                    .maybeSingle();

                if (sConn && sConn.access_token) {
                    token = sConn.access_token;
                    targetAdAccount = sConn.metadata?.ad_account_id || sConn.external_id;
                    accountName = sConn.metadata?.account_name || null;
                }
            }
        }

        if (!token || !targetAdAccount) {
            return NextResponse.json({
                success: false,
                connected: false,
                message: 'No hay conexión activa con Meta Ads para este cliente.'
            });
        }

        // Ensure ad account ID has 'act_' prefix
        const formattedAdAccountId = targetAdAccount.startsWith('act_') ? targetAdAccount : `act_${targetAdAccount}`;

        // Fetch real campaigns from Meta Graph API
        const metaUrl = `https://graph.facebook.com/v19.0/${formattedAdAccountId}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time,insights.date_preset(maximum){reach,impressions,clicks,spend,cpc,cpm,ctr,actions,cost_per_action_type}&access_token=${token}`;
        
        const campaignsRes = await fetch(metaUrl);
        const campaignsData = await campaignsRes.json();

        if (campaignsData.error) {
            return NextResponse.json({
                success: false,
                connected: true,
                error: campaignsData.error.message,
                metaError: campaignsData.error
            }, { status: 400 });
        }

        const rawList = campaignsData.data || [];
        const formattedCampaigns = rawList.map((c) => {
            const insight = c.insights?.data?.[0] || {};
            
            // Format budget
            let budgetFormatted = 'Automático';
            if (c.daily_budget) {
                budgetFormatted = `$${(Number(c.daily_budget) / 100).toFixed(0)}/día`;
            } else if (c.lifetime_budget) {
                budgetFormatted = `$${(Number(c.lifetime_budget) / 100).toFixed(0)}/total`;
            }

            // Clean objective
            let cleanObjective = c.objective || 'Ventas & Leads';
            if (cleanObjective.includes('MESSAGES')) cleanObjective = 'Mensajes a WhatsApp';
            else if (cleanObjective.includes('LEAD')) cleanObjective = 'Generación de Leads';
            else if (cleanObjective.includes('TRAFFIC')) cleanObjective = 'Tráfico Web';
            else if (cleanObjective.includes('OUTCOME_SALES')) cleanObjective = 'Conversiones / Ventas';
            else if (cleanObjective.includes('AWARENESS') || cleanObjective.includes('REACH')) cleanObjective = 'Reconocimiento de Marca';
            else if (cleanObjective.includes('ENGAGEMENT')) cleanObjective = 'Interacción Reels/Posts';

            // Metrics
            const reachNum = Number(insight.reach || 0);
            const reachStr = reachNum >= 1000 ? `${(reachNum / 1000).toFixed(1)}K` : `${reachNum}`;
            const clicksNum = Number(insight.clicks || 0);
            const spendNum = Number(insight.spend || 0);

            // Extract leads / conversions from actions
            const actions = insight.actions || [];
            const leadAction = actions.find(a => 
                a.action_type === 'lead' || 
                a.action_type.includes('messaging_conversation_started') || 
                a.action_type.includes('contact') ||
                a.action_type.includes('purchase')
            );
            const leadsNum = leadAction ? Number(leadAction.value) : 0;

            // Costs
            const cpcStr = insight.cpc ? `$${Number(insight.cpc).toFixed(2)}` : clicksNum > 0 ? `$${(spendNum / clicksNum).toFixed(2)}` : '$0.00';
            const cpmStr = insight.cpm ? `$${Number(insight.cpm).toFixed(2)}` : '$0.00';
            const ctrStr = insight.ctr ? `${Number(insight.ctr).toFixed(2)}%` : '0.00%';
            const cplStr = leadsNum > 0 ? `$${(spendNum / leadsNum).toFixed(2)}` : '$0.00';

            return {
                id: c.id,
                name: c.name,
                status: c.status === 'ACTIVE' ? 'Activo' : c.status === 'PAUSED' ? 'Pausado' : 'Archivado',
                objective: cleanObjective,
                budget: budgetFormatted,
                metrics: {
                    reach: reachStr,
                    clicks: clicksNum,
                    leads: leadsNum,
                    impressions: Number(insight.impressions || 0),
                    spend: spendNum
                },
                advanced: {
                    ctr: ctrStr,
                    cpc: cpcStr,
                    roas: 'N/D',
                    cpm: cpmStr,
                    watchTime: 'N/D',
                    cpl: cplStr
                },
                activeAdvanced: ['cpl', 'ctr', 'cpc'],
                isAdvantagePlus: true,
                raw: c
            };
        });

        // Save real campaigns to client record in Supabase
        if (clientId) {
            const { data: clientData } = await supabase
                .from('clients')
                .select('onboarding_data')
                .eq('id', clientId)
                .maybeSingle();

            const currentOnboarding = clientData?.onboarding_data || {};
            await supabase
                .from('clients')
                .update({
                    onboarding_data: {
                        ...currentOnboarding,
                        meta_campaigns: formattedCampaigns,
                        meta_last_synced: new Date().toISOString(),
                        meta_ad_account_id: formattedAdAccountId
                    }
                })
                .eq('id', clientId);
        }

        return NextResponse.json({
            success: true,
            connected: true,
            adAccount: {
                id: formattedAdAccountId,
                name: accountName || formattedAdAccountId
            },
            campaigns: formattedCampaigns,
            totalCount: formattedCampaigns.length
        });

    } catch (err) {
        console.error('[API /api/meta/ads] Error:', err);
        return NextResponse.json({
            success: false,
            error: err.message || 'Error interno del servidor al consultar Meta Graph API.'
        }, { status: 500 });
    }
}
