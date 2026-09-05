const path = require("path");
const fs = require("fs");

require("dotenv").config({
  path: path.join(__dirname, "../.env")
});

const { spawnSync } = require("child_process");

const mongodump = "C:\\Users\\hp\\Downloads\\mongodb-tools\\mongodb-database-tools-windows-x86_64-100.18.0\\bin\\mongodump.exe";

const backupRoot = path.resolve(__dirname, "../../backups");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDir = path.join(backupRoot, timestamp);

const mongoBackupDir = path.join(backupDir, "mongodb");
const uploadsBackupDir = path.join(backupDir, "uploads");

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing.");
  process.exit(1);
}

fs.mkdirSync(mongoBackupDir, { recursive: true });

console.log("Starting full backup...");
console.log("Backup folder:", backupDir);

console.log("\n[1/2] Backing up MongoDB...");

const mongoResult = spawnSync(
  mongodump,
  [
    "--uri",
    process.env.MONGO_URI,
    "--out",
    mongoBackupDir
  ],
  { stdio: "inherit" }
);

if (mongoResult.status !== 0) {
  console.error("MongoDB backup failed.");
  process.exit(mongoResult.status || 1);
}

console.log("MongoDB backup completed successfully.");

console.log("\n[2/2] Backing up uploads...");

const uploadsSource = path.join(__dirname, "../uploads");

if (fs.existsSync(uploadsSource)) {
  fs.cpSync(uploadsSource, uploadsBackupDir, {
    recursive: true
  });

  console.log("Uploads backup completed successfully.");
} else {
  console.log("No uploads folder found. Skipping uploads backup.");
}

console.log("\n[3/3] Applying 30-day retention...");

const retentionDays = 30;
const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

const backupFolders = fs.readdirSync(backupRoot, { withFileTypes: true });

for (const item of backupFolders) {
  if (!item.isDirectory()) continue;

  const folderPath = path.join(backupRoot, item.name);
  const stats = fs.statSync(folderPath);

  if (stats.mtimeMs < cutoff) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log("Deleted old backup:", item.name);
  }
}

console.log("\nFull backup completed successfully.");
console.log("Backup location:", backupDir);
