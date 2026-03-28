// Supabase Edge Function: send-sms-alert
// Sends SMS alerts via Semaphore PH when shelter reaches 90% capacity

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { shelter_id, shelter_name, coordinator_phone, occupancy_percent } = await req.json()

    // Get Semaphore PH API key from environment
    const semaphoreApiKey = Deno.env.get('SEMAPHORE_API_KEY')
    if (!semaphoreApiKey) {
      throw new Error('SEMAPHORE_API_KEY not configured')
    }

    // Compose alert message
    const message = `ALERT: ${shelter_name} has reached ${occupancy_percent.toFixed(1)}% capacity. Immediate action required.`

    // Send SMS via Semaphore PH
    const smsResponse = await fetch('https://api.semaphore.co/api/v4/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apikey: semaphoreApiKey,
        number: coordinator_phone,
        message: message,
        sendername: 'ShelterMap'
      })
    })

    const smsResult = await smsResponse.json()
    const status = smsResponse.ok ? 'sent' : 'failed'

    // Log SMS delivery to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    await supabase
      .from('sms_logs')
      .insert({
        shelter_id,
        message,
        recipient: coordinator_phone,
        status,
        sent_at: new Date().toISOString()
      })

    return new Response(
      JSON.stringify({ success: status === 'sent', status, smsResult }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('SMS alert error:', error)
    
    // Log failure to database if possible
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      const { shelter_id, coordinator_phone } = await req.json()
      await supabase
        .from('sms_logs')
        .insert({
          shelter_id,
          message: 'Failed to send alert',
          recipient: coordinator_phone,
          status: 'failed',
          sent_at: new Date().toISOString()
        })
    } catch (logError) {
      console.error('Failed to log SMS error:', logError)
    }

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
