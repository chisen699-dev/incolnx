// ===============================
// COPY ADMIN PANEL INTO PUBLISH DIRECTORY
// ===============================
// Netlify publishes only the `client/` folder.
// This script copies the root `admin/` folder into `client/admin/`
// so the admin panel is accessible at /admin/admin.html on the live site.
// ===============================

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const adminSrc = path.join(root, 'admin');
const adminDest = path.join(root, 'client', 'admin');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source folder not found: ${src}`);
    process.exit(1);
  }

  // Remove existing destination
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyDir(adminSrc, adminDest);
  console.log('✅ Admin panel copied to client/admin/');
} catch (err) {
  console.error('Failed to copy admin panel:', err);
  process.exit(1);
}