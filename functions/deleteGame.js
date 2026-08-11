// ===============================
// DELETE GAME
// Deletes a game from the Supabase games table.
// ===============================

const { getSupabase, corsHeaders, apiHandler, parseBody } = require('./shared/supabase');

exports.handler = apiHandler(async (event) => {
  // Only allow DELETE requests
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
    };
  }

  const body = parseBody(event);
  const { id } = body;

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

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('games')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase delete error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: 'Failed to delete game from database'
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
      message: 'Game deleted successfully',
      data
    })
  };
});