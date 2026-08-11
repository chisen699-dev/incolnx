// ===============================
// IMPORT GAMES TO SUPABASE
// ===============================
// Reads database/games-data.js and inserts all games
// into the Supabase `games` table.
//
// NOTE: The hv and ps4 categories are SKIPPED per LincolnX request.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_ANON_KEY=... node scripts/import-games.js
// ===============================

const { createClient } = require('@supabase/supabase-js');

const data = require('../database/games-data.js');

// Categories to SKIP (per request: "WAG MO LANG SAMA YUNG HV TAS PS4 GAMES")
const SKIP_CATEGORIES = ['hv', 'ps4'];

// Load env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing env vars. Set SUPABASE_URL and SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const games = data.gamesData || [];
  console.log(`📦 Found ${games.length} games total`);

  const toImport = games.filter(g => !SKIP_CATEGORIES.includes(g.category));
  console.log(`⏭️  Skipping hv + ps4 (${games.length - toImport.length} games)`);
  console.log(`✅ Importing ${toImport.length} games...\n`);

  let inserted = 0;
  let failed = 0;
  let skippedDupes = 0;

  for (let i = 0; i < toImport.length; i++) {
    const g = toImport[i];

    // Map old field names to Supabase schema
    const record = {
      name: String(g.name || '').trim(),
      category: g.category || 'pc',
      size: g.size || 0,
      download_url: g.url || g.download_url || '',
      image_url: g.img || g.image_url || '',
      is_new: Boolean(g.new || g.is_new)
    };

    if (!record.name || !record.download_url) {
      console.log(`  ⚠️  Skipping "${record.name || 'UNNAMED'}" — missing name or URL`);
      failed++;
      continue;
    }

    // Insert (ignore unique-name conflicts → count as duplicates)
    const { error } = await supabase.from('games').insert(record);

    if (error) {
      if (error.code === '23505') {
        skippedDupes++;
      } else {
        console.log(`  ❌ Error on "${record.name}": ${error.message}`);
        failed++;
      }
    } else {
      inserted++;
    }

    // Progress every 25
    if ((i + 1) % 25 === 0) {
      console.log(`  ...${i + 1}/${toImport.length} processed (${inserted} inserted)`);
    }
  }

  console.log('\n==============================');
  console.log(`DONE!`);
  console.log(`  ✅ Inserted: ${inserted}`);
  console.log(`  ⚠️  Duplicates skipped: ${skippedDupes}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log('==============================');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});