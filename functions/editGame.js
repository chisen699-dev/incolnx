// ===============================
// EDIT GAME
// Updates an existing game in the Supabase games table.
// ===============================

const { getSupabase, corsHeaders, apiHandler, parseBody } = require('./shared/supabase');

exports.handler = apiHandler(async (event) => {
  // Only allow PUT requests
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
    };
  }

  const body = parseBody(event);
  const { id, name, category, size, download_url, image_url, is_new } = body;

  if (!id) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: 'Game id is required'
      })
    };
  }

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

  // Update the game
  const { data, error } = await supabase
    .from('games')
    .update({
      name: name.trim(),
      category: category || 'pc',
      size: parseFloat(size),
      download_url: download_url.trim(),
      image_url: image_url ? image_url.trim() : null,
      is_new: is_new || false
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase update error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: 'Failed to update game in database'
      })
    };
  }

  if (!data) {
    return {
      statusCode: 404,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: 'Game not found'
      })
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify({
      success: true,
      message: 'Game updated successfully',
      data
    })
  };
});