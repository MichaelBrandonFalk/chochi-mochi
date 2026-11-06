const { contextBridge, ipcRenderer } = require('electron');
function call(action, key, value) {
  const result = ipcRenderer.sendSync('chochi:save', action, key, value);
  if (!result?.ok) throw new Error(result?.error || 'Could not access the saved game.');
  return result.value;
}
contextBridge.exposeInMainWorld('chochiDesktop', {
  platform: process.platform,
  storage: { getItem: key => call('get', key), setItem: (key, value) => call('set', key, value), removeItem: key => call('remove', key) }
});
