import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { clientId, userId, planName, finalPrice, successUrl, cancelUrl } = await req.json();

        if (!planName || !finalPrice) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // 1. Create a dynamic recurring product and price in Stripe
        const product = await stripe.products.create({
            name: `Plan ${planName} - DIIC ZONE`,
            description: `Suscripción mensual de marketing y expansión para el plan ${planName}`,
            metadata: {
                client_id: clientId || '',
                user_id: userId || '',
            }
        });

        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(Number(finalPrice) * 100),
            currency: 'usd',
            recurring: {
                interval: 'month',
            },
        });

        // 2. Create the Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                },
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Licencia de la Plataforma (SaaS)',
                            description: 'Cargo único por configuración y derechos de uso de la plataforma'
                        },
                        unit_amount: 10000, // $100.00 USD in cents
                    },
                    quantity: 1,
                }
            ],
            mode: 'subscription',
            metadata: {
                client_id: clientId || '',
                user_id: userId || '',
                plan_name: planName,
                final_price: String(finalPrice),
            },
            success_url: successUrl || `${req.headers.get('origin') || 'https://diiczone.com'}/dashboard/profile?success=true`,
            cancel_url: cancelUrl || `${req.headers.get('origin') || 'https://diiczone.com'}/dashboard/profile?cancelled=true`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
