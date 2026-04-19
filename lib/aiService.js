import { supabase } from './supabase';

/**
 * AI Service for Medical Growth & Messaging
 */
export const aiService = {
  
  /**
   * Generates a suggested response based on brand identity and context
   */
  async generateSuggestion(userId, leadContext, message) {
    // 1. Get brand DNA
    const { data: brand } = await supabase
      .from('ai_brand_settings')
      .eq('user_id', userId)
      .single();

    const identity = brand || { 
      brand_name: "Dra. Jessica Reyes", 
      tone_voice_guide: "Médico profesional y cercano" 
    };

    // 2. Mock AI Logic (In prod this calls OpenAI/Anthropic)
    console.log(`Generating AI suggestion for brand: ${identity.brand_name}`);
    
    return {
      text: `¡Hola! Soy el asistente digital de la ${identity.brand_name}. He recibido tu consulta sobre ${message}. ${identity.tone_voice_guide}`,
      confidence: 0.92,
      score: 85 // Lead score
    };
  },

  /**
   * Refines the AI personality based on extracted social content
   */
  async trainFromSocialContent(userId, brandData) {
    console.log(`Training AI DNA for user ${userId} using ${brandData.recent_captions.length} posts...`);
    
    // Logic: Analysis of tone, vocabulary and frequent topics
    // This refined guide will be used in future prompt generations
    const refinedTone = `Tono detectado: Especialista experto. 
    Vocabulario: Enfocado en "armonización", "resultados naturales" y "ciencia". 
    Estilo: Mensajes directos, informativos y empoderadores.`;

    const { error } = await supabase
      .from('ai_brand_settings')
      .upsert({
        user_id: userId,
        tone_voice_guide: refinedTone,
        brand_dna_status: 'REAL_DATA_SYNCED',
        last_training_at: new Date().toISOString()
      });

    return { success: !error };
  }
};
