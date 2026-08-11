// ===============================
// GET GAMES
// Fetches all games from the Supabase games table.
// Supports optional ?category= filter.
// ===============================

const { getSupabase, corsHeaders, apiHandler } = require('./shared/supabase');

exports.handler = apiHandler(async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
    };
  }

  const supabase = getSupabase();

  // Parse query params
  const params = new URL(event.rawUrl || event.url, 'https://localhost').searchParams;
  const category = params.get('category');

  let query = supabase
    .from('games')
    .select('*')
    .order('name', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase query error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch games from database'
      })
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify({
      success: true,
      count: (data || []).length,
      data: data || []
    })
  };
});