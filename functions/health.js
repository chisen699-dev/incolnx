// ===============================
// HEALTH CHECK
// Returns the status of the API and validates
// that Supabase env vars are configured.
// ===============================

const { corsHeaders, apiHandler } = require('./shared/supabase');

exports.handler = apiHandler(async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
    };
  }

  const hasSupabaseUrl = !!process.env.SUPABASE_URL;
  const hasSupabaseKey = !!process.env.SUPABASE_ANON_KEY;

  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify({
      success: true,
      status: 'ok',
      message: 'LincolnX API is running',
      timestamp: new Date().toISOString(),
      env: {
        supabase_url_configured: hasSupabaseUrl,
        supabase_anon_key_configured: hasSupabaseKey
      }
    })
  };
});