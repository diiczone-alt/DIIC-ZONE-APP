import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CLIENT_KEY = Deno.env.get("TIKTOK_CLIENT_KEY")!;
const CLIENT_SECRET = Deno.env.get("TIKTOK_CLIENT_SECRET")!;
const REDIRECT_URI = "http://localhost:3000/auth/callback/tiktok";

Deno.serve(async (req) => {
  // Manejo de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }});
  }

  try {
    const { code, code_verifier } = await req.json();
    
    // 1. Intercambiar código por token
    const tokenParams = new URLSearchParams();
    tokenParams.append('client_key', CLIENT_KEY);
    tokenParams.append('client_secret', CLIENT_SECRET);
    tokenParams.append('code', code);
    tokenParams.append('grant_type', 'authorization_code');
    tokenParams.append('redirect_uri', REDIRECT_URI);
    
    if (code_verifier) {
        tokenParams.append('code_verifier', code_verifier);
    }

    const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });
    
    const tokenData = await tokenRes.json();
    if (tokenData.error) {
        console.error("TikTok Token Error:", tokenData);
        throw new Error(tokenData.error_description || tokenData.error);
    }

    // 2. Obtener Info del Usuario para tener un ID real
    const userRes = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    const userData = await userRes.json();
    const user = userData.data?.user;

    if (!user) {
        console.error("TikTok User Info Error:", userData);
        throw new Error("No se pudo obtener la información del usuario de TikTok");
    }

    // 3. Guardar en DB usando Service Role para saltar RLS en este paso crítico
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    
    // Identificar al usuario que llama a la función
    const authHeader = req.headers.get("Authorization")!;
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    
    if (authError || !currentUser) throw new Error("No autorizado: Debes estar logueado");

    const { error: dbError } = await supabase
      .from("social_connections")
      .upsert({
        user_id: currentUser.id,
        platform: "tiktok",
        external_id: user.open_id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        metadata: {
          display_name: user.display_name,
          avatar_url: user.avatar_url,
          union_id: user.union_id
        },
        updated_at: new Date().toISOString()
      });

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ 
        success: true, 
        message: "Conexión establecida con éxito",
        display_name: user.display_name 
    }), {
      headers: { 
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
      },
    });
  }
});
