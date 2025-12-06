require('dotenv').config();
const events = require('../events');
const { validateRecord, generateId, now } = require('./record');
const { readDB, writeDB, exportDB } = require('./file');

function addRecord({ name, value }) {
  validateRecord({ name, value });

  const db = readDB();
  const record = {
    id: generateId(),
    name,
    value,
    createdAt: now(),
    updatedAt: now()
  };

  db.push(record);
  writeDB(db);

  events.emit('recordAdded', record);
  return record;
}

function listRecords() {
  return readDB();
}

function updateRecord(id, name, value) {
  const db = readDB();
  const idx = db.findIndex(r => r.id === id);
  if (idx === -1) return false;

  db[idx].name = name;
  db[idx].value = value;
  db[idx].updatedAt = now();

  writeDB(db);
  events.emit('recordUpdated', db[idx]);
  return true;
}

function deleteRecord(id) {
  const db = readDB();
  const idx = db.findIndex(r => r.id === id);
  if (idx === -1) return false;

  const deleted = db.splice(idx, 1)[0];
  writeDB(db);
  events.emit('recordDeleted', deleted);
  return true;
}

function searchRecords(keyword) {
  keyword = keyword.toLowerCase();
  const db = readDB();
  return db.filter(r =>
    r.name.toLowerCase().includes(keyword) ||
    String(r.id).includes(keyword)
  );
}

function sortRecords(field, order) {
  const db = readDB();
  order = order === 'asc' ? 1 : -1;

  return db.sort((a, b) => {
    if (field === 'name')
      return a.name.localeCompare(b.name) * order;
    else
      return (new Date(a.createdAt) - new Date(b.createdAt)) * order;
  });
}

function exportData() {
  exportDB();
}

function getStatistics() {
  const db = readDB();
  if (db.length === 0) return {
    total: 0, lastModified: 'N/A', longestName: '-', longestLen: 0, earliest: '-', latest: '-'
  };

  const total = db.length;
  const longest = db.reduce((a, b) => (b.name.length > a.name.length ? b : a));
  const dates = db.map(r => new Date(r.createdAt));

  return {
    total,
    lastModified: db[db.length - 1].updatedAt,
    longestName: longest.name,
    longestLen: longest.name.length,
    earliest: new Date(Math.min(...dates)).toISOString(),
    latest: new Date(Math.max(...dates)).toISOString(),
  };
}

module.exports = {
  addRecord,
  listRecords,
  updateRecord,
  deleteRecord,
  searchRecords,
  sortRecords,
  exportData,
  getStatistics
};
