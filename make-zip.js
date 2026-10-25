const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const outDir = path.join(__dirname, 'out');
const zipPath = path.join(__dirname, 'deploy-live.zip');

if (!fs.existsSync(outDir)) {
  console.error('[make-zip] Error: out/ directory does not exist. Run npm run build first.');
  process.exit(1);
}

const zip = new AdmZip();

function addFilesRecursively(dirPath, zipFolderPath) {
  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const fullPath = path.join(dirPath, item);
    // Force forward slash relative path for Linux zip compliance
    const relativeZipPath = zipFolderPath ? `${zipFolderPath}/${item}` : item;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      addFilesRecursively(fullPath, relativeZipPath);
    } else {
      const fileBuffer = fs.readFileSync(fullPath);
      zip.addFile(relativeZipPath, fileBuffer);
    }
  });
}

// Add all files inside out/ recursively
addFilesRecursively(outDir, '');

// Write to deploy-live.zip in root
zip.writeZip(zipPath);
console.log(`[make-zip] Successfully created ${zipPath} with strict Linux forward-slash (/) directory entries!`);
