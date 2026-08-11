// ===============================
// LICENSE KEYS CRUD
// Handles list, add, activate, deactivate, revoke operations
// on the Supabase license_keys table.
//
// Actions (via ?action= query param or body.action):
//   GET  /licenseKeys                → list all keys
//   POST /licenseKeys                → add new key(s)  { keys: ["LX-...", ...] }
//   PUT  /licenseKeys                → update status   { id, status }
//   DELETE /licenseKeys              → delete key      { id }
// ===============================

const { getSupabase, corsHeaders, apiHandler, parseBody } = require('./shared/supabase');

exports.handler = apiHandler(async (event) => {
  const supabase = getSupabase();
  const method = event.httpMethod;
  const body = method !== 'GET' && method !== 'OPTIONS' ? parseBody(event) : {};

  // ===============================
  // GET: List all license keys
  // ===============================
  if (method === 'GET') {
    const { data, error } = await supabase
      .from('license_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return {
        statusCode: 500,
        headers: corsHeaders(),
        body: JSON.stringify({ success: false, message: 'Failed to fetch license keys' })
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
  }

  // ===============================
  // POST: Add new license key(s)
  // ===============================
  if (method === 'POST') {
    const { key, keys } = body;

    // Support single key or array of keys
    let keysToInsert = [];
    if (key) {
      keysToInsert.push({ key: key.trim().toUpperCase(), status: 'active' });
    }
    if (Array.isArray(keys)) {
      keys.forEach(k => {
        if (k && k.trim()) {
          keysToInsert.push({ key: k.trim().toUpperCase(), status: 'active' });
        }
      });
    }

    if (keysToInsert.length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({
          success: false,
          message: 'At least one key is required'
        })
      };
    }

    const { data, error } = await supabase
      .from('license_keys')
      .insert(keysToInsert)
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return {
        statusCode: 500,
        headers: corsHeaders(),
        body: JSON.stringify({
          success: false,
          message: 'Failed to add license keys (maybe duplicate)'
        })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: true,
        message: 'License key(s) added successfully',
        data
      })
    };
  }

  // ===============================
  // PUT: Update key status (activate / deactivate / revoke)
  // ===============================
  if (method === 'PUT') {
    const { id, key, status } = body;

    if (!id && !key) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({
          success: false,
          message: 'Either key id or key value is required'
        })
      };
    }

    // Validate status
    const validStatuses = ['active', 'used', 'revoked'];
    if (!status || !validStatuses.includes(status)) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({
          success: false,
          message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
        })
      };
    }

    let query = supabase.from('license_keys').update({ status }).select();

    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('key', key);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error('Supabase update error:', error);
      return {
        statusCode: 500,
        headers: corsHeaders(),
        body: JSON.stringify({
          success: false,
          message: 'Failed to update license key'
        })
      };
    }

    if (!data) {
      return {
        statusCode: 404,
        headers: corsHeaders(),
        body: JSON.stringify({
          success: false,
          message: 'License key not found'
        })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: true,
        message: `License key status set to "${status}"`,
        data
      })
    };
  }

  // ===============================
  // DELETE: Remove a license key
  // ===============================
  if (method === 'DELETE') {
    const { id, key } = body;

    if (!id && !key) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({
          success: false,
          message: 'Either key id or key value is required'
        })
      };
    }

    let query = supabase.from('license_keys').delete().select();

    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('key', key);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error('Supabase delete error:', error);
      return {
        statusCode: 500,
        headers: corsHeaders(),
        body: JSON.stringify({
          success: false,
          message: 'Failed to delete license key'
        })
      };
    }

    if (!data) {
      return {
        statusCode: 404,
        headers: corsHeaders(),
        body: JSON.stringify({
          success: false,
          message: 'License key not found'
        })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: true,
        message: 'License key deleted successfully',
        data
      })
    };
  }

  return {
    statusCode: 405,
    headers: corsHeaders(),
    body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
  };
});