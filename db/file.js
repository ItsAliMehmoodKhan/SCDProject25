const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const backupDir = path.join(__dirname, '..', 'backups');
const dbFile = path.join(dataDir, 'vault.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '[]');

function readDB() {
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

  // create automatic backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `backup_${timestamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
}

function exportDB() {
  const data = readDB();
  const exportFile = path.join(__dirname, '..', 'export.txt');

  const now = new Date().toISOString();
  let content = `Export Date: ${now}\nTotal Records: ${data.length}\n\n`;

  data.forEach((r, i) => {
    content += `${i + 1}. ID: ${r.id} | Name: ${r.name} | Value: ${r.value} | Created: ${r.createdAt}\n`;
  });

  fs.writeFileSync(exportFile, content);
}

module.exports = { readDB, writeDB, exportDB };
