import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const rootDir = process.cwd();
const standaloneDir = path.join(rootDir, ".next", "standalone");
const publicDir = path.join(rootDir, "public");
const staticDir = path.join(rootDir, ".next", "static");
const targetPublicDir = path.join(standaloneDir, "public");
const targetStaticDir = path.join(standaloneDir, ".next", "static");

console.log("Preparing cPanel deployment bundle...");

if (!fs.existsSync(standaloneDir)) {
  console.error("Error: .next/standalone does not exist. Run 'next build' first.");
  process.exit(1);
}

// 1. Copy public assets into .next/standalone/public
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, targetPublicDir, { recursive: true });
  console.log("✓ Copied public/ -> .next/standalone/public");
}

// 2. Copy .next/static into .next/standalone/.next/static
if (fs.existsSync(staticDir)) {
  fs.cpSync(staticDir, targetStaticDir, { recursive: true });
  console.log("✓ Copied .next/static -> .next/standalone/.next/static");
}

// 3. Create zip archive for easy cPanel upload
const zipFileName = "cpanel-deployment.zip";
const zipFilePath = path.join(rootDir, zipFileName);

if (fs.existsSync(zipFilePath)) {
  fs.unlinkSync(zipFilePath);
}

try {
  // Zip contents of standalone directly so server.js is at root of the archive
  execSync(`cd "${standaloneDir}" && zip -q -r "${zipFilePath}" .`, { stdio: "inherit" });
  console.log(`\n🎉 Success! Created deployment archive: ${zipFileName}`);
  console.log(`Upload ${zipFileName} to your cPanel application root and extract it.`);
} catch (err) {
  console.warn("Could not create zip archive automatically. You can manually compress the contents of .next/standalone.");
}

