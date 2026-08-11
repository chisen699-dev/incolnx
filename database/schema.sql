-- =============================================
-- LINCOLNX SUPABASE SCHEMA (NEXT-GEN)
-- Run this in Supabase: SQL Editor → New query → Paste → Run
-- =============================================

-- =============================================
-- LICENSE KEYS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS license_keys (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('active','used','revoked')) DEFAULT 'active',
  user_id UUID NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- GAMES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  size NUMERIC,
  download_url TEXT,
  image_url TEXT,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Permissive policies because Netlify functions use the anon key.
-- For production hardening, restrict to authenticated service role.
-- =============================================

ALTER TABLE license_keys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS license_keys_all_access ON license_keys;
CREATE POLICY license_keys_all_access ON license_keys
  FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS games_all_access ON games;
CREATE POLICY games_all_access ON games
  FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- SEED SAMPLE DATA (uncomment to test)
-- =============================================
-- INSERT INTO games (name, category, size, download_url, image_url, is_new)
-- VALUES
--   ('Cyberpunk 2077', 'pc', 68.5, 'https://example.com/cyberpunk', 'https://example.com/cyberpunk.jpg', true),
--   ('God of War', 'ps2', 4.2, 'https://example.com/gow', 'https://example.com/gow.jpg', false),
--   ('Breath of the Wild', 'switch', 13.4, 'https://example.com/botw', 'https://example.com/botw.jpg', false);

-- INSERT INTO license_keys (key, status)
-- VALUES ('LX-ABCD-1234-EFGH', 'active');