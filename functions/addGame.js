// ===============================
// ADD GAME
// Inserts a new game into the Supabase games table.
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
  const { name, category, size, download_url, image_url, is_new } = body;

  // Validate required fields
  if (!name || !download_url) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: 'Game name and download URL are required'
      })
    };
  }

  if (size === undefined || size === null || isNaN(parseFloat(size))) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: 'Valid size (GB) is required'
      })
    };
  }

  const supabase = getSupabase();

  // Insert new game
  const { data, error } = await supabase
    .from('games')
    .insert({
      name: name.trim(),
      category: category || 'pc',
      size: parseFloat(size),
      download_url: download_url.trim(),
      image_url: image_url ? image_url.trim() : null,
      is_new: is_new || false
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: 'Failed to add game to database'
      })
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify({
      success: true,
      message: 'Game added successfully',
      data
    })
  };
});