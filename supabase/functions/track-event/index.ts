import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { session_id, event_name, page_path, metadata, user_agent } = await req.json();
    
    console.log('[v0] [track-event] Received event:', { session_id, event_name, page_path });

    // Validate required fields
    if (!session_id || !event_name || !page_path) {
      console.log('[v0] [track-event] Missing required fields:', { session_id, event_name, page_path });
      return new Response('Missing required fields', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    console.log('[v0] [track-event] Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('[v0] [track-event] Service key:', supabaseServiceKey ? 'Set' : 'Missing');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert event
    const { error, data } = await supabase
      .from('user_events')
      .insert({
        session_id,
        event_name,
        page_path,
        metadata: metadata || {},
        user_agent
      });

    if (error) {
      console.error('[v0] [track-event] Supabase error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('[v0] [track-event] Event inserted successfully:', data);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[v0] [track-event] Edge function error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
