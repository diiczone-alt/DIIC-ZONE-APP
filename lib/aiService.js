import { supabase } from './supabase';

/**
 * AI Service for DIIC HEALTH 
 * Handles message processing and suggestion generation
 */
export const aiService = {
  
  /**
   * Generates a suggested response for an incoming message
   * @param {string} userId - The brand owner's user ID
   * @param {string} incomingMessage - Text received from the lead
   * @param {string} channel - WHATSAPP, INSTAGRAM, etc.
   */
  async generateSuggestion(userId, incomingMessage, channel) {
    try {
      // 1. Fetch AI Settings for this brand
      const { data: settings } = await supabase
        .from('ai_brand_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      // 2. Fetch relevant knowledge base entries (Mocked search logic for now)
      const { data: knowledge } = await supabase
        .from('ai_knowledge_base')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      // 3. Simple logic to determine context (To be replaced by real AI model call)
      let context = knowledge?.map(k => `${k.title}: ${k.content}`).join('\n') || '';
      
      const assistantName = settings?.assistant_name || 'Asistente Digital';
      const masterPrompt = settings?.base_prompt || `Eres el ${assistantName} de la Dra. Jessica Reyes. Responde de forma profesional y empática.`;

      // 4. MOCK AI GENERATION (This represents the call to OpenAI/Anthropic)
      let suggestedResponse = '';
      
      const lowerMsg = incomingMessage.toLowerCase();
      if (lowerMsg.includes('precio') || lowerMsg.includes('cuanto') || lowerMsg.includes('valor')) {
        suggestedResponse = `Hola, soy el ${assistantName}. Para darte el valor exacto del tratamiento, la Dra. Jessica requiere una valoración previa. ¿Te gustaría agendar una cita de diagnóstico?`;
      } else if (lowerMsg.includes('horario') || lowerMsg.includes('cita')) {
        suggestedResponse = `¡Claro! Con gusto te ayudo. El consultorio atiende de Lunes a Viernes de 9:00 AM a 6:00 PM. ¿Te queda bien algún día de esta semana?`;
      } else {
        suggestedResponse = `Hola, soy el ${assistantName}. He recibido tu mensaje sobre "${incomingMessage}". ¿Podrías darme más detalles para que la Dra. Jessica pueda asesorarte mejor?`;
      }

      // 5. Store the draft for human approval
      const { data: draft, error } = await supabase
        .from('ai_conversation_drafts')
        .insert({
          user_id: userId,
          channel_source: channel,
          incoming_message: incomingMessage,
          suggested_response: suggestedResponse,
          status: 'PENDING'
        })
        .select()
        .single();

      return draft;
    } catch (err) {
      console.error('AI Service Error:', err);
      return null;
    }
  },

  /**
   * Approves and "sends" a draft (updates status)
   */
  async approveDraft(draftId, editedResponse = null) {
    const { data, error } = await supabase
      .from('ai_conversation_drafts')
      .update({
        status: 'APPROVED',
        edited_response: editedResponse,
        updated_at: new Date().toISOString()
      })
      .eq('id', draftId)
      .select()
      .single();

    return { data, error };
  }
};
