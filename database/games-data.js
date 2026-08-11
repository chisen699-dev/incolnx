// =========================
// LINCOLNX GAMES DATA (IMPORT SOURCE)
// =========================
// This file is the source data used by scripts/import-games.js
// to seed the Supabase `games` table.
//
// NOTE: hv and ps4 categories are SKIPPED during import
// (per LincolnX request: "WAG MO LANG SAMA YUNG HV TAS PS4 GAMES")
//
// HOW TO USE:
// 1. Paste your full games-data.js content below (the arrays: pcGames,
//    lowPcGames, ps2Games, ps3Games, switchGames, ps4Games, hvGames)
// 2. Run: SUPABASE_URL=... SUPABASE_ANON_KEY=... node scripts/import-games.js
// =========================

// =========================
// PC Games
// =========================
const pcGames = [
  // PASTE YOUR PC GAMES HERE
];

// =========================
// Low-End PC Games
// =========================
const lowPcGames = [
  // PASTE YOUR LOW PC GAMES HERE
];

// =========================
// PS2 Games
// =========================
const ps2Games = [
  // PASTE YOUR PS2 GAMES HERE
];

// =========================
// PS3 Games
// =========================
const ps3Games = [
  // PASTE YOUR PS3 GAMES HERE
];

// =========================
// Switch Games
// =========================
const switchGames = [
  // PASTE YOUR SWITCH GAMES HERE
];

// =========================
// PS4 JB Games (SKIPPED during import)
// =========================
const ps4Games = [
  // PASTE YOUR PS4 GAMES HERE (optional - skipped)
];

// =========================
// HV (HYPERVISOR) Games (SKIPPED during import)
// =========================
const hvGames = [
  // PASTE YOUR HV GAMES HERE (optional - skipped)
];

// =========================
// Combine with categories
// =========================
const gamesData = [
  ...pcGames.map(g => ({ ...g, category: "pc" })),
  ...lowPcGames.map(g => ({ ...g, category: "lowpc" })),
  ...hvGames.map(g => ({ ...g, category: "hv" })),
  ...ps2Games.map(g => ({ ...g, category: "ps2" })),
  ...ps3Games.map(g => ({ ...g, category: "ps3" })),
  ...switchGames.map(g => ({ ...g, category: "switch" })),
  ...ps4Games.map(g => ({ ...g, category: "ps4" }))
];

module.exports = { gamesData };