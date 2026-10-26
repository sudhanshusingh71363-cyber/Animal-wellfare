// Supabase Edge Function: animal-assistant
// Serves as secure gateway for AI assistance and deterministic safety verification

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userText, animalType, imageBase64, currentAnswers } = await req.json();

    // Check deterministic emergency flags
    const lowerText = (userText || '').toLowerCase();
    const isCritical =
      lowerText.includes('struggling to breathe') ||
      lowerText.includes('cannot breathe') ||
      lowerText.includes('unconscious') ||
      lowerText.includes('collapsed') ||
      lowerText.includes('spurting blood') ||
      lowerText.includes('poison') ||
      lowerText.includes('rat poison') ||
      lowerText.includes('swollen abdomen and retching');

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    let aiExplanation = '';
    if (geminiApiKey) {
      try {
        const payload: any = {
          contents: [
            {
              parts: [
                {
                  text: `You are PawCare Assistant. A user found a ${animalType || 'animal'}: "${userText}".
Provide a 2-sentence compassionate guidance note. NEVER diagnose. Emphasize veterinary checkup.`,
                },
              ],
            },
          ],
        };

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );

        if (res.ok) {
          const json = await res.json();
          aiExplanation = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } catch (err) {
        console.error('Gemini error:', err);
      }
    }

    return new Response(
      JSON.stringify({
        isEmergency: isCritical,
        aiExplanation: aiExplanation || 'PawCare deterministic triage active. Immediate safe steps provided.',
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
