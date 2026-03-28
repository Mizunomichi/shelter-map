// Supabase Edge Function: update-shelter
// Validates coordinator PIN and updates shelter occupancy

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { shelter_id, pin, current_occupancy } = await req.json()

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!shelter_id || !uuidRegex.test(shelter_id)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid shelter_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate occupancy
    if (typeof current_occupancy !== 'number' || current_occupancy < 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Occupancy cannot be negative' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch shelter record
    const { data: shelter, error: fetchError } = await supabase
      .from('shelters')
      .select('id, max_capacity, pin_hash, coordinator_phone, name')
      .eq('id', shelter_id)
      .single()

    if (fetchError || !shelter) {
      return new Response(
        JSON.stringify({ success: false, error: 'Shelter not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify PIN using bcrypt (call Python helper via subprocess)
    // Note: In production, this would use a Deno bcrypt library or Python subprocess
    // For now, we'll use a placeholder verification
    const pinValid = await verifyPin(pin, shelter.pin_hash)
    
    if (!pinValid) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid PIN' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate occupancy doesn't exceed capacity
    if (current_occupancy > shelter.max_capacity) {
      return new Response(
        JSON.stringify({ success: false, error: 'Occupancy exceeds max capacity' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update shelter occupancy
    const { error: updateError } = await supabase
      .from('shelters')
      .update({ 
        current_occupancy,
        updated_at: new Date().toISOString()
      })
      .eq('id', shelter_id)

    if (updateError) {
      throw updateError
    }

    // Check if SMS alert should be triggered (>= 90% capacity)
    const occupancyPercent = (current_occupancy / shelter.max_capacity) * 100
    if (occupancyPercent >= 90) {
      // Trigger SMS alert (non-blocking)
      fetch(`${supabaseUrl}/functions/v1/send-sms-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({
          shelter_id: shelter.id,
          shelter_name: shelter.name,
          coordinator_phone: shelter.coordinator_phone,
          occupancy_percent: occupancyPercent
        })
      }).catch(err => console.error('SMS alert failed:', err))
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Placeholder PIN verification (would use bcrypt in production)
async function verifyPin(plainPin: string, hash: string): Promise<boolean> {
  // TODO: Implement actual bcrypt verification
  // For now, accept any 4-digit PIN for testing
  return /^\d{4,8}$/.test(plainPin)
}
