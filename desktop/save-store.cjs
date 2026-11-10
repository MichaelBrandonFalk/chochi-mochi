const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const MAX_VALUE = 8 * 1024 * 1024, MAX_FILE = 40 * 1024 * 1024;
function validKey(key) { return typeof key === 'string' && key.length <= 300 && key.startsWith('little-lights-'); }
function readSaveValues(file) {
  const values = Object.create(null);
  if (fs.statSync(file).size > MAX_FILE) throw new Error('The save file is too large.');
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (parsed.format !== 1 || !parsed.values || typeof parsed.values !== 'object' || Array.isArray(parsed.values)) throw new Error('The save file format is not supported.');
  for (const [key, value] of Object.entries(parsed.values)) {
    if (!validKey(key) || typeof value !== 'string' || Buffer.byteLength(value) > MAX_VALUE) throw new Error('The save file contains invalid data.');
    values[key] = value;
  }
  return values;
}
class SaveStore {
  constructor(directory) {
    fs.mkdirSync(directory, { recursive: true });
    this.file = path.join(directory, 'saved-game.json');
    this.values = fs.existsSync(this.file) ? readSaveValues(this.file) : Object.create(null);
    // Check write access before a player starts, rather than losing work later.
    const probe = path.join(directory, '.write-check-' + randomUUID());
    fs.writeFileSync(probe, '', { flag: 'wx', mode: 0o600 }); fs.unlinkSync(probe);
  }
  getItem(key) { if (!validKey(key)) throw new Error('Unknown save key.'); return this.values[key] ?? null; }
  setItem(key, value) {
    if (!validKey(key) || typeof value !== 'string' || Buffer.byteLength(value) > MAX_VALUE) throw new Error('Invalid save value.');
    this.commit({ ...this.values, [key]: value });
  }
  removeItem(key) { if (!validKey(key)) throw new Error('Unknown save key.'); const next = { ...this.values }; delete next[key]; this.commit(next); }
  commit(next) {
    const content = JSON.stringify({ format: 1, values: next });
    if (Buffer.byteLength(content) > MAX_FILE) throw new Error('The save file is full.');
    const temp = this.file + '.' + randomUUID() + '.tmp';
    try {
      const fd = fs.openSync(temp, 'wx', 0o600);
      try { fs.writeFileSync(fd, content); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
      fs.renameSync(temp, this.file); this.values = next;
    } finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
  }
}
module.exports = { SaveStore, validKey, readSaveValues };
