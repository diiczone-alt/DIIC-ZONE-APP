import { supabase } from '@/lib/supabase';

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || 'EAALr6JON8B8BSuaTYfSLfShpQvrWO3FZCKfn6XSP1sCWJ4LnjfxGYuRlGl3XYsSgzP75ZCf4IcxjkjYuQ8SLNWRPFbfyktsJxjAw3omfXUG1b2';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '1375784752177186';

export const whatsappService = {
    /**
     * Sends a template message to the client via Meta WhatsApp Cloud API
     */
    async sendMessage(phone, template = 'hello_world', languageCode = 'en_US') {
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        try {
            const response = await fetch(`https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: cleanPhone,
                    type: 'template',
                    template: {
                        name: template,
                        language: { code: languageCode }
                    }
                })
            });

            const data = await response.json();
            if (data.error) {
                console.error('[WhatsApp Cloud API Error]:', data.error);
                return { success: false, error: data.error.message };
            }

            return {
                success: true,
                id: data.messages?.[0]?.id || 'wa_' + Math.random().toString(36).substr(2, 9),
                status: 'sent',
                timestamp: new Date().toISOString()
            };
        } catch (err) {
            console.error('[WhatsApp Service Exception]:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Sends a real-time text notification via Meta WhatsApp Cloud API
     */
    async sendRealtimeNotification(clientId, message) {
        try {
            const { data: client, error } = await supabase
                .from('clients')
                .select('whatsapp_number, name')
                .eq('id', clientId)
                .single();

            if (!client?.whatsapp_number) {
                console.warn('[WhatsApp] No phone number configured for client:', clientId);
                return { success: false, error: 'NO_PHONE' };
            }

            const cleanPhone = client.whatsapp_number.replace(/[^0-9]/g, '');
            const finalMessage = `🚀 *DIIC ZONE*\n\n${message}\n\n_Enviado desde DIIC ZONE Platform_`;

            const response = await fetch(`https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: cleanPhone,
                    type: 'text',
                    text: { body: finalMessage }
                })
            });

            const data = await response.json();
            return { success: !data.error, data, timestamp: new Date().toISOString() };
        } catch (err) {
            console.error('[WhatsApp Service Error]:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Sends the Post-Meeting Automation Summary
     */
    async sendMeetingSummary(phone, meetingData) {
        const summary = `Hola ${meetingData.clientName || 'Cliente'}, aquí tienes los puntos clave de nuestra sesión de hoy.`;
        return this.sendRealtimeNotification(meetingData.clientId, summary);
    }
};
