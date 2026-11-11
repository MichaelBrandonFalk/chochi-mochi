export const desktopVersion='3.3.2';
export const releaseURL='https://github.com/MichaelBrandonFalk/chochi-mochi/releases/tag/v'+desktopVersion;
export const assetURL=name=>'https://github.com/MichaelBrandonFalk/chochi-mochi/releases/download/v'+desktopVersion+'/'+name;
export const desktopFiles={
 windowsPortable:`Chochi-Mochi-${desktopVersion}-Windows-x64-Portable.exe`,
 windowsSetup:`Chochi-Mochi-${desktopVersion}-Windows-x64-Setup.exe`,
 macDmg:`Chochi-Mochi-${desktopVersion}-macOS-universal.dmg`,
 linuxImage:`Chochi-Mochi-${desktopVersion}-Linux-x86_64.AppImage`,
 linuxFolder:`Chochi-Mochi-${desktopVersion}-Linux-x64.tar.gz`,
 linuxDeb:`Chochi-Mochi-${desktopVersion}-Linux-amd64.deb`
};
export function downloadMarkup(desktop=false){return `<section class="download-page">
 <div class="eyebrow">Chochi Mochi · Version ${desktopVersion}</div><h1>Play offline</h1>
 <p class="story">Download the game for your computer. The story, pictures, and music come with it. No internet is needed to play.</p>
 ${desktop?'<p class="lesson">You are playing the downloaded game. The Game menu can show where your players are saved.</p>':''}
 <div class="download-grid">
  <article class="download-card"><div class="eyebrow">Windows 10 or 11 · 64-bit</div><h2>Windows</h2><p>Open the installer to add Chochi Mochi to this PC.</p><a class="primary" href="${assetURL(desktopFiles.windowsSetup)}">Windows installer · v${desktopVersion}</a><a class="secondary" href="${assetURL(desktopFiles.windowsPortable)}">Windows portable · v${desktopVersion}</a></article>
  <article class="download-card"><div class="eyebrow">macOS 13 or newer · Intel and Apple silicon</div><h2>Mac</h2><p>Open the DMG, drag Chochi Mochi to Applications, then open it from Applications. Your players save on this Mac.</p><a class="primary" href="${assetURL(desktopFiles.macDmg)}">Download for Mac · v${desktopVersion} (.dmg)</a></article>
  <article class="download-card"><div class="eyebrow">Linux Mint 21 or 22 · 64-bit</div><h2>Linux Mint</h2><p>Open the DEB file with Mint’s package installer.</p><a class="primary" href="${assetURL(desktopFiles.linuxDeb)}">Mint installer · v${desktopVersion}</a><a class="secondary" href="${assetURL(desktopFiles.linuxFolder)}">Linux portable · v${desktopVersion}</a><a class="text-button" href="${assetURL(desktopFiles.linuxImage)}">AppImage · v${desktopVersion} →</a></article>
 </div>
 <section class="download-help"><h2>Your saved players</h2><p>Installed games save your players on the computer. The Mac game does this automatically, even if you first open it from the disk image. There is no folder to choose before playing.</p><p>Website and downloaded-game progress are separate. Each version has up to five players and the same comfort settings.</p>
 <details><summary>Portable play (optional)</summary><p>You can carry the game on a drive or keep it in a folder on your computer. You do not have to use a USB drive.</p><p><strong>Mac:</strong> the same DMG works for portable play. In the game, choose <strong>Game → Save location → Portable folder…</strong> if you want your players to travel with you. Choose a folder on your Mac or an external drive. The game keeps them in <strong>Chochi Mochi Data</strong> there. Choose <strong>On this Mac</strong> to use your Mac’s saved players again.</p><p><strong>Windows and Linux:</strong> portable editions keep Chochi Mochi Data beside the portable game. Keep that folder with the game when moving it. Close the game before unplugging a drive.</p></details>
 <details><summary>Bring in players from an older Mac copy</summary><p>Open the new game, then choose <strong>Game → Import saved players…</strong>. Select <strong>saved-game.json</strong> from your older Chochi Mochi Data folder. The game backs up the current saved players before importing. Your original file stays unchanged.</p></details>
 <details><summary>Opening the game for the first time</summary><p>Mac and Windows may ask you to approve opening the game. These builds do not have a verified publisher signature. On Mac, install by dragging the app from the DMG to Applications. The game’s title and About window show its version.</p></details>
 <details><summary>Linux Mint steps</summary><p>For installation, open the .deb file with Mint’s package installer. For portable play, extract the .tar.gz folder and open <strong>chochi-mochi</strong> inside it. Keep the whole folder together.</p><p>For an AppImage, open its Properties and allow it to run as a program. If a drive does not allow programs to run, copy the game to your computer. If your system requires an installed sandbox, use the DEB installer.</p></details>
 <details><summary>Offline play and voices</summary><p>Lessons, outings, art, music, gifts, and players work offline. Read-aloud uses voices on your computer. Research links open in your normal browser and need internet.</p></details>
 <p><a href="docs/DOWNLOADS.md">Full download guide</a> · <a href="${releaseURL}">Release notes and files</a> · <a href="${assetURL('SHA256SUMS.txt')}">File checksums</a></p><p class="micro">Version ${desktopVersion}. Keep your saved players when updating the game.</p>
 </section></section>`;}
