const fs = require('fs');
const zlib = require('zlib');
const { execSync } = require('child_process');

try {
  // Try to use AdmZip equivalent or just parse the headers if possible.
  // Actually, node doesn't have a built-in zip lister without external packages.
  // Let's just use tar since tar can sometimes list zip files, or install a package.
  execSync('npm i adm-zip --no-save');
  const AdmZip = require('adm-zip');
  const zip = new AdmZip('attached_assets/remote_guardian_v4_apk_pro_1771903933547.zip');
  const zipEntries = zip.getEntries();
  zipEntries.forEach(function(zipEntry) {
      console.log(zipEntry.entryName);
  });
} catch (e) {
  console.error(e);
}
