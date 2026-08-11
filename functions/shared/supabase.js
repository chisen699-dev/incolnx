// ===============================
// SUPABASE CLIENT HELPER
// ===============================
// Shared connection helper for all Netlify functions.
// Uses environment variables set in Netlify dashboard:
//   SUPABASE_URL      - your Supabase project URL
//   SUPABASE_ANON_KEY - your Supabase anon/public API key
// ===============================

const { createClient } = require('@supabase/supabase-js');

let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase environment variables missing. Set SUPABASE_URL and SUPABASE_ANON_KEY in your Netlify dashboard (Site settings → Environment variables).'
    );
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

// Standard CORS headers for all function responses
function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };
}

// Wrap a handler with CORS + OPTIONS handling + common error handling
function apiHandler(handler) {
  return async (event) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: corsHeaders(),
        body: ''
      };
    }

    try {
      return await handler(event);
    } catch (error) {
      console.error('Function error:', error);
      return {
        statusCode: 500,
        headers: corsHeaders(),
        body: JSON.stringify({
          success: false,
          message: error.message || 'Internal server error'
        })
      };
    }
  };
}

// Parse JSON body safely
function parseBody(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch (e) {
    throw new Error('Invalid JSON body');
  }
}

module.exports = {
  getSupabase,
  corsHeaders,
  apiHandler,
  parseBody
};