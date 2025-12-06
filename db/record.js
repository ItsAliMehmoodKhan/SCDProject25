function validateRecord(record) {
  if (!record.name || !record.value) throw new Error('Record must have both name and value.');
  return true;
}

function generateId() {
  return Date.now();
}

function now() {
  return new Date().toISOString();
}

module.exports = { validateRecord, generateId, now };
