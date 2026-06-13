import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { agencyService } from '@/services/agencyService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_builds');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy_for_builds';

export async function POST(req) {
    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event;

    try {
        if (!sig || !endpointSecret) {
            throw new Error('Missing signature or webhook secret');
        }
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed:`, err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { client_id, user_id, plan_name, final_price } = session.metadata || {};

        console.log(`[Stripe Webhook] Checkout completed session. metadata:`, session.metadata);

        if (client_id) {
            try {
                // 1. Update clients table
                const { error: clientErr } = await supabase
                    .from('clients')
                    .update({
                        plan: plan_name,
                        price: String(final_price),
                        status: 'active',
                        sync_active: true
                    })
                    .eq('id', client_id);

                if (clientErr) {
                    console.error('[Stripe Webhook] Error updating clients:', clientErr.message);
                }

                // 2. Update profiles table if user_id is provided
                if (user_id) {
                    const { error: profileErr } = await supabase
                        .from('profiles')
                        .update({
                            plan: plan_name,
                            price: String(final_price)
                        })
                        .eq('id', user_id);

                    if (profileErr) {
                        console.error('[Stripe Webhook] Error updating profiles:', profileErr.message);
                    }
                }

                // 3. Mirror logic sync
                await agencyService.syncClientProfile(client_id, {
                    plan: plan_name,
                    price: String(final_price)
                });

                console.log(`[Stripe Webhook] Successfully processed and synchronized subscription for client: ${client_id}`);
            } catch (dbErr) {
                console.error('[Stripe Webhook] Database sync exception:', dbErr);
            }
        } else {
            console.warn('[Stripe Webhook] Missing client_id in checkout session metadata.');
        }
    }

    return NextResponse.json({ received: true });
}
