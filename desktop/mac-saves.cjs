const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { SaveStore, readSaveValues } = require('./save-store.cjs');
const configFile = userData => path.join(userData, 'save-location.json');
function readMacLocation(userData) {
  const file = configFile(userData);
  if (!fs.existsSync(file)) return null;
  const value = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (value.mode === 'local') return null;
  if (value.mode !== 'portable' || typeof value.directory !== 'string' || !path.isAbsolute(value.directory)) throw Error('The saved location setting is not valid.');
  return value.directory;
}
function writeMacLocation(userData, directory) {
  if (directory !== null && (typeof directory !== 'string' || !path.isAbsolute(directory))) throw Error('Choose a complete folder path.');
  fs.mkdirSync(userData, { recursive: true });
  const file = configFile(userData), temp = file + '.' + randomUUID() + '.tmp';
  try { fs.writeFileSync(temp, JSON.stringify(directory ? { mode: 'portable', directory } : { mode: 'local' }), { flag: 'wx', mode: 0o600 }); fs.renameSync(temp, file); }
  finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
}
function portableSaveDirectory(folder) { return path.basename(folder) === 'Chochi Mochi Data' ? folder : path.join(folder, 'Chochi Mochi Data'); }
function openMacLocation(directory, currentValues) {
  const next = new SaveStore(directory);
  // Existing players belong to this location. Never replace them on a switch.
  if (!fs.existsSync(next.file)) next.commit({ ...currentValues });
  return next;
}
function importSavedPlayers(source, store) {
  const values = readSaveValues(source); // Validate before creating or replacing anything.
  if (path.resolve(source) === path.resolve(store.file)) return null;
  let backup = null;
  if (fs.existsSync(store.file)) {
    backup = path.join(path.dirname(store.file), 'saved-game-before-import-' + randomUUID() + '.json');
    fs.copyFileSync(store.file, backup, fs.constants.COPYFILE_EXCL);
  }
  store.commit(values);
  return backup;
}
module.exports = { readMacLocation, writeMacLocation, portableSaveDirectory, openMacLocation, importSavedPlayers };
