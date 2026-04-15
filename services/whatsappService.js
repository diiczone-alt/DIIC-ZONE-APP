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
     * Sends the Post-Meeting Automation Summary
     */
    async sendMeetingSummary(phone, meetingData) {
        const summary = `
🤖 *Resumen de Reunión - DIIC ZONE*
Hola ${meetingData.clientName || 'Cliente'}, aquí tienes los puntos clave de nuestra sesión de hoy:

📅 *Fecha:* ${new Date().toLocaleDateString()}
✅ *Acuerdos:*
${meetingData.agreements.map(a => `• ${a}`).join('\n')}

📝 *Siguientes Pasos:*
${meetingData.tasks.map(t => `👉 ${t}`).join('\n')}

¡Manos a la obra! 🚀
        `;

        return this.sendMessage(phone, 'meeting_summary_freeform', { text: summary });
    }
};
