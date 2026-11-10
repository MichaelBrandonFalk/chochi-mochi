const { app, BrowserWindow, protocol, net, session, ipcMain, Menu, shell, dialog } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const { ORIGIN, CSP, isGameURL, assetPath, isExternalLink, saveLocation, diskImageSource } = require('./policy.cjs');
const { SaveStore } = require('./save-store.cjs');
const { readMacLocation, writeMacLocation, portableSaveDirectory, openMacLocation, importSavedPlayers } = require('./mac-saves.cjs');
protocol.registerSchemesAsPrivileged([{ scheme: 'chochi', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }]);
const selfTest = process.argv.includes('--self-test');
const smokeDirectory = selfTest ? fs.mkdtempSync(path.join(os.tmpdir(), 'chochi-smoke-')) : null;
if (selfTest) app.setPath('userData', path.join(smokeDirectory, 'runtime'));
const hasLock = selfTest || app.requestSingleInstanceLock();
let mainWindow, store, location, quitting = false, changingLocation = false;
if (!hasLock) app.quit();
app.on('second-instance', () => { if (mainWindow) { if (mainWindow.isMinimized()) mainWindow.restore(); mainWindow.focus(); } });
function external(url) { if (isExternalLink(url)) shell.openExternal(url).catch(() => {}); }
function fail(error) {
  if (selfTest) { process.stderr.write('Desktop check failed: ' + error.message + '\n'); app.exit(1); return; }
  dialog.showErrorBox('Chochi Mochi could not open', 'The game could not open its saved players. Your existing saved files have not been erased.\n\nIf you chose a portable folder, check that the folder or drive is available.\n\n' + error.message);
  app.quit();
}
app.whenReady().then(async () => {
  if (!hasLock) return;
  try {
    const userData = app.getPath('userData');
    const macPortableDirectory = !selfTest && app.isPackaged && process.platform === 'darwin' ? readMacLocation(userData) : null;
    if (macPortableDirectory && !fs.existsSync(macPortableDirectory)) {
      const answer = await dialog.showMessageBox({ type: 'question', title: 'Portable saves are not available', message: 'Your portable save folder is not connected.', detail: 'You can reconnect it and reopen the game, or use the players saved on this Mac. The portable files will stay unchanged.', buttons: ['Use this Mac', 'Quit'], defaultId: 0, cancelId: 1 });
      if (answer.response === 0) { writeMacLocation(userData, null); app.relaunch(); app.exit(0); } else app.quit();
      return;
    }
    location = selfTest ? { directory: path.join(smokeDirectory, 'Chochi Mochi Data'), portable: true } : saveLocation({ platform: process.platform, executable: app.getPath('exe'), portableDirectory: process.env.PORTABLE_EXECUTABLE_DIR, appImage: process.env.APPIMAGE, userData, packaged: app.isPackaged, macPortableDirectory });
    store = new SaveStore(location.directory);
    // Preserve discoverable saves from earlier Mac copies without assuming USB use.
    if (!selfTest && app.isPackaged && process.platform === 'darwin' && !location.portable && !fs.existsSync(store.file)) {
      const bundleParent = path.resolve(path.dirname(app.getPath('exe')), '../../..');
      let legacy = !bundleParent.includes('/AppTranslocation/') && path.basename(bundleParent) !== 'Applications' ? bundleParent : null;
      if (legacy?.startsWith('/Volumes/')) {
        try {
          const plist = execFileSync('/usr/bin/hdiutil', ['info', '-plist'], { timeout: 5000 });
          const info = JSON.parse(execFileSync('/usr/bin/plutil', ['-convert', 'json', '-o', '-', '-'], { input: plist, timeout: 5000 }).toString());
          legacy = diskImageSource(info, bundleParent);
        } catch { legacy = null; }
      }
      const file = legacy && path.join(legacy, 'Chochi Mochi Data', 'saved-game.json');
      if (file && fs.existsSync(file)) importSavedPlayers(file, store);
    }
    const root = path.join(__dirname, '..', 'dist');
    protocol.handle('chochi', async request => {
      try {
        const file = assetPath(root, request.url);
        if (!fs.statSync(file).isFile()) return new Response('Not found', { status: 404 });
        const response = await net.fetch(pathToFileURL(file).toString());
        const headers = new Headers(response.headers); headers.set('Content-Security-Policy', CSP); headers.set('X-Content-Type-Options', 'nosniff');
        return new Response(response.body, { status: response.status, headers });
      } catch { return new Response('Not found', { status: 404 }); }
    });
    const ses = session.defaultSession;
    ses.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    ses.setPermissionCheckHandler(() => false);
    const networkRequests = [];
    ses.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*'] }, (details, callback) => { networkRequests.push(details.url); callback({ cancel: true }); });
    ipcMain.on('chochi:save', (event, action, key, value) => {
      try {
        if (changingLocation) throw new Error('The game is reopening with the selected players.');
        if (!isGameURL(event.senderFrame?.url)) throw new Error('Unknown game window.');
        let result = null;
        if (action === 'get') result = store.getItem(key);
        else if (action === 'set') store.setItem(key, value);
        else if (action === 'remove') store.removeItem(key);
        else throw new Error('Unknown save action.');
        event.returnValue = { ok: true, value: result };
      } catch (error) { event.returnValue = { ok: false, error: error.message }; }
    });
    mainWindow = new BrowserWindow({ width: 1280, height: 850, minWidth: 700, minHeight: 600, title: 'Chochi Mochi · v' + app.getVersion(), backgroundColor: '#faf8f2', show: !selfTest, autoHideMenuBar: process.platform !== 'darwin', webPreferences: { preload: path.join(__dirname, 'preload.cjs'), nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true, webviewTag: false } });
    app.setAboutPanelOptions({ applicationName: 'Chochi Mochi', applicationVersion: app.getVersion(), version: app.getVersion() });
    mainWindow.webContents.on('page-title-updated', event => { event.preventDefault(); mainWindow.setTitle('Chochi Mochi · v' + app.getVersion()); });
    mainWindow.webContents.setWindowOpenHandler(({ url }) => { external(url); return { action: 'deny' }; });
    mainWindow.webContents.on('will-navigate', (event, url) => { if (!isGameURL(url)) { event.preventDefault(); external(url); } });
    mainWindow.webContents.on('will-attach-webview', event => event.preventDefault());
    const restart = () => { changingLocation = true; app.relaunch(); app.exit(0); };
    const paintSaveMenu = () => { const menu = Menu.getApplicationMenu(); if (menu?.getMenuItemById('mac-save-local')) { menu.getMenuItemById('mac-save-local').checked = !location.portable; menu.getMenuItemById('mac-save-portable').checked = location.portable; } };
    const changeMacLocation = async (directory, portable) => {
      try {
        if (path.resolve(directory) === path.resolve(location.directory)) return;
        const hasPlayers = fs.existsSync(path.join(directory, 'saved-game.json'));
        if (hasPlayers) {
          const answer = await dialog.showMessageBox(mainWindow, { type: 'question', title: 'Open saved players', message: portable ? 'Open the players already in this portable folder?' : 'Open the players saved on this Mac?', detail: 'Your current players will stay in their current folder. Neither location will be overwritten.', buttons: ['Open these players', 'Cancel'], defaultId: 0, cancelId: 1 });
          if (answer.response !== 0) return;
        }
        openMacLocation(directory, store.values);
        writeMacLocation(userData, portable ? directory : null);
        restart();
      } catch (error) { dialog.showErrorBox('The save location did not change', error.message + '\n\nYour current saved players are still in their original location.'); } finally { paintSaveMenu(); }
    };
    const choosePortable = async () => {
      const chosen = await dialog.showOpenDialog(mainWindow, { title: 'Use a portable save folder', message: 'Choose any folder on this Mac or an external drive. The game will keep Chochi Mochi Data here and reopen with those players.', properties: ['openDirectory', 'createDirectory', 'dontAddToRecent'] });
      if (!chosen.canceled && chosen.filePaths[0]) await changeMacLocation(portableSaveDirectory(chosen.filePaths[0]), true);
      paintSaveMenu();
    };
    const importPlayers = async () => {
      const chosen = await dialog.showOpenDialog(mainWindow, { title: 'Import saved players', message: 'Choose saved-game.json from an older Chochi Mochi Data folder.', filters: [{ name: 'Saved players', extensions: ['json'] }], properties: ['openFile', 'dontAddToRecent'] });
      if (chosen.canceled || !chosen.filePaths[0]) return;
      const answer = await dialog.showMessageBox(mainWindow, { type: 'question', title: 'Import saved players', message: 'Use the players in this saved game?', detail: 'The game will back up the current players in the saved game folder before importing. The original file will stay unchanged. The game will then reopen.', buttons: ['Import and reopen', 'Cancel'], defaultId: 1, cancelId: 1 });
      if (answer.response !== 0) return;
      try { importSavedPlayers(chosen.filePaths[0], store); restart(); }
      catch (error) { dialog.showErrorBox('The saved players were not imported', error.message + '\n\nYour previous saved game has not been erased.'); }
    };
    const macItems = process.platform === 'darwin' ? [{ label: 'Save location', submenu: [{ id: 'mac-save-local', label: 'On this Mac', type: 'radio', checked: !location.portable, click: () => changeMacLocation(path.join(userData, 'Saved game'), false) }, { id: 'mac-save-portable', label: 'Portable folder…', type: 'radio', checked: location.portable, click: choosePortable }] }, { label: 'Import saved players…', click: importPlayers }] : [];
    const fileMenu = { label: 'Game', submenu: [...macItems, { label: 'Show saved game folder', click: () => shell.openPath(location.directory) }, { type: 'separator' }, { role: 'quit' }] };
    Menu.setApplicationMenu(Menu.buildFromTemplate([...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []), fileMenu, { role: 'editMenu' }, { label: 'View', submenu: [{ role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { role: 'togglefullscreen' }] }, { label: 'Help', submenu: [{ label: 'Download help', click: () => mainWindow.loadURL(ORIGIN + '/index.html#download') }, { label: 'Visit the website', click: () => external('https://michaelbrandonfalk.github.io/chochi-mochi/') }] }]));
    mainWindow.on('closed', () => { mainWindow = null; });
    await mainWindow.loadURL(ORIGIN + '/index.html#home');
    if (selfTest) {
      const result = await mainWindow.webContents.executeJavaScript(`(async()=>{const title=document.querySelector('main h1')?.textContent;if(!title)throw Error('The home page is empty');if(typeof require!=='undefined')throw Error('Node is exposed in the game');window.chochiDesktop.storage.setItem('little-lights-desktop-check','ok');if(window.chochiDesktop.storage.getItem('little-lights-desktop-check')!=='ok')throw Error('Saving failed');window.chochiDesktop.storage.removeItem('little-lights-desktop-check');const paths=['assets/storybook/01-clover-gate-small.webp','assets/objects/basket.webp','assets/audio/clover-waltz.mp3'];for(const p of paths){const r=await fetch(p);if(!r.ok||(await r.arrayBuffer()).byteLength===0)throw Error('Missing offline asset: '+p);}return {title,secure:window.isSecureContext,storage:!!window.chochiDesktop.storage,assets:paths.length};})()`);
      if (!result.secure || networkRequests.length || !fs.existsSync(store.file)) throw new Error('The offline check did not pass.');
      process.stdout.write('CHOCHI_DESKTOP_OK ' + JSON.stringify({ ...result, platform: process.platform, arch: process.arch }) + '\n');
      quitting = true; app.quit();
    }
  } catch (error) { fail(error); }
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin' || selfTest) app.quit(); });
app.on('activate', () => { if (!mainWindow && !quitting) app.relaunch(); if (!mainWindow) app.quit(); });
app.on('will-quit', () => { if (smokeDirectory) { try { fs.rmSync(smokeDirectory, { recursive: true, force: true }); } catch {} } });
if (selfTest) setTimeout(() => { process.stderr.write('Desktop check timed out.\n'); app.exit(1); }, 30000).unref();
