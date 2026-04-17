/**
 * WhatsApp Service (Mock)
 * Simulates sending automated messages via WhatsApp Business API 
 * logic using Supabase Edge Functions (future implementation).
 */

export const whatsappService = {
    /**
     * Sends a template message to the client.
     * @param {string} phone - Client's phone number
     * @param {string} template - Template name (e.g., 'meeting_summary', 'project_approved')
     * @param {object} variables - Variables to inject into the template
     */
    async sendMessage(phone, template, variables = {}) {
        console.log(`[WhatsApp Mock] Sending '${template}' to ${phone}...`, variables);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Start of a real implementation structure
        /*
        const response = await fetch('https://api.diiczone.com/whatsapp/send', {
            method: 'POST',
            body: JSON.stringify({ phone, template, variables })
        });
        */

        // Return mock success
        return {
            success: true,
            id: 'wa_' + Math.random().toString(36).substr(2, 9),
            status: 'sent',
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Sends a real-time notification via the configured WhatsApp provider.
     * Integrated with the platform's automation engine.
     */
    async sendRealtimeNotification(clientId, message) {
        console.log(`[WhatsApp] Sending notification to client ${clientId}:`, message);
        
        try {
            // 1. Fetch client's WhatsApp number from DB
            const { data: client, error } = await supabase
                .from('clients')
                .select('whatsapp_number, name')
                .eq('id', clientId)
                .single();

            if (!client?.whatsapp_number) {
                console.warn('[WhatsApp] No phone number configured for client:', clientId);
                return { success: false, error: 'NO_PHONE' };
            }

            // 2. Format the message for the Bot
            const finalMessage = `🚀 *DIIC ZONE HUB*\n-------------------\n${message}\n-------------------\n_Enviado desde tu Workspace OS_`;

            // 3. Current Implementation: Calls a generic relay (to be specialized by the user in credentials)
            console.log(`[WhatsApp API Call] To: ${client.whatsapp_number} | Message: ${finalMessage}`);
            
            // This is where the Evolution API or Meta API call goes.
            // For now, we simulate success if the number exists.
            return { success: true, timestamp: new Date().toISOString() };
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
