// ===============================
// VALIDATE LICENSE KEY
// Checks a license key against the Supabase license_keys table.
// ===============================

const { getSupabase, corsHeaders, apiHandler, parseBody } = require('./shared/supabase');

exports.handler = apiHandler(async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
    };
  }

  const body = parseBody(event);
  const { key, user_id } = body;

  if (!key) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: 'License key is required'
      })
    };
  }

  const supabase = getSupabase();

  // Look up the key in the database
  const { data: licenseKey, error } = await supabase
    .from('license_keys')
    .select('*')
    .eq('key', key)
    .maybeSingle();

  if (error) {
    console.error('Supabase query error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: 'Database error while validating key'
      })
    };
  }

  // Key not found in database → invalid
  if (!licenseKey) {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: 'Invalid or inactive license key'
      })
    };
  }

  // Key found but not active
  if (licenseKey.status !== 'active') {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: 'Invalid or inactive license key'
      })
    };
  }

  // If key has a user already bound, it must match (prevents sharing)
  if (licenseKey.user_id && user_id && licenseKey.user_id !== user_id) {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: 'License key is already tied to another user'
      })
    };
  }

  // If key is not bound to a user yet, bind it now
  if (!licenseKey.user_id && user_id) {
    const { error: bindError } = await supabase
      .from('license_keys')
      .update({ user_id: user_id })
      .eq('key', key);

    if (bindError) {
      console.error('Supabase bind error:', bindError);
    }
  }

  // Mark the key as "used" (optional - per requirements)
  const { error: statusError } = await supabase
    .from('license_keys')
    .update({ status: 'used' })
    .eq('key', key);

  if (statusError) {
    console.error('Supabase status update error:', statusError);
  }

  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify({
      success: true,
      message: 'License key validated'
    })
  };
});