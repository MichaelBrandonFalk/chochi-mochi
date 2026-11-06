# Downloading Chochi Mochi

The desktop game includes all twenty places, pictures, music, outings, comfort settings, and local players. It does not need Python, Node.js, an account, or an internet connection to play.

Download files only from the [Chochi Mochi GitHub releases](https://github.com/MichaelBrandonFalk/chochi-mochi/releases). The website’s Download page links to the matching version.

## Windows

Windows 10 or 11, 64-bit.

- **Portable.exe:** put it in a writable folder on the USB drive and open it. It extracts its runtime automatically and keeps game progress in Chochi Mochi Data beside the portable EXE.
- **Setup.exe:** installs for the current user on that computer. Installed progress stays on the computer.

The first release has no verified publisher signature. Windows may ask whether you want to open the downloaded app. Managed school or work computers may require their administrator’s approval.

## Mac

macOS 13 or newer. The universal app supports Intel and Apple silicon.

- **Disk image (.dmg):** recommended for USB play. Put the DMG on the USB drive, open it, then open Chochi Mochi inside. The app detects the original disk-image file and saves Chochi Mochi Data beside that DMG, rather than on its read-only mounted volume. This also keeps the app’s internal links intact on USB formats such as exFAT.
- **Installation:** drag Chochi Mochi from the disk image into Applications, then open that installed copy. Its progress stays on the Mac.
- **ZIP alternative:** extract the app into a normal Mac folder or copy it to Applications. For direct USB play on exFAT or FAT drives, use the DMG instead of extracting the app bundle there.

If macOS opens the app in an isolated first-open location, the game asks you to choose the folder holding the DMG. Choose that folder on your USB drive so your players stay with it. It does not change macOS security settings.

These builds are locally/ad-hoc signed for execution but do not have an Apple Developer ID or Apple notarization. macOS may ask for approval before opening them. Use the normal system approval controls for a trusted download. The game does not change Gatekeeper settings. See [Apple’s opening guidance](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unknown-developer-mh40616/mac).

## Linux Mint

The 64-bit edition targets Linux Mint 21.x and 22.x, including Cinnamon, MATE, and Xfce. Mint 21 uses the Ubuntu 22.04 base; Mint 22 uses Ubuntu 24.04. The release pipeline checks the packaged game on 22.04 and the installed DEB on 24.04. These base-system checks do not replace testing every Mint desktop and hardware configuration.

- **DEB installer:** open the file in Mint’s package installer. It installs the game and its normal desktop launcher, declares needed system libraries, and uses the packager’s sandbox integration. Progress stays in the user’s home folder. You can carry the installer on a USB drive. If system dependencies are missing, installing them may require internet or locally available packages.
- **Portable tar.gz folder:** extract the whole folder to a writable place and open chochi-mochi inside. Keep its libraries and resources together. The save folder sits beside the executable. This option does not need FUSE.
- **AppImage:** keep it on the USB drive, allow it to run as a program in its Properties, and open it. The save folder sits beside the original AppImage. A compatible FUSE runtime and permitted sandbox are needed.

If the USB drive is mounted with execution blocked, copy the game to the computer before opening it. If a system’s sandbox rules prevent the portable edition from starting, use the DEB installer. No download disables the Chromium sandbox or asks you to weaken system security settings.

## Keep your players

Portable editions store the five player slots, story progress, sound, and comfort settings in:

    Chochi Mochi Data/saved-game.json

Keep that folder with the game when copying or updating it. Close the game before copying saves or unplugging the USB drive. The JSON format is the same on Windows, Mac, and Linux. To move between different platform folders, copy this complete data folder beside the new portable edition before opening it.

Single-file portable copies placed in the same folder can share that data folder: the Windows portable EXE, Mac DMG, and Linux AppImage. Installed editions instead keep their saves in the normal per-user application-data location. The Game menu can open the active saved-game folder.

Website progress and desktop progress are separate. Downloading the app does not automatically copy browser profiles. Temporary runtime files and caches may use the computer; portable story progress is kept in the data folder.

If a USB drive is read-only or its save file is damaged, the app explains the problem instead of silently erasing the save. Back up the data folder before moving to another drive.

## Offline features and updates

All game art and music are bundled. Reference websites need internet. Read-aloud depends on voices available on the computer. Desktop editions do not download code or check for updates in the background. Download a newer release when you want to update; retain your data folder.

SHA256SUMS.txt on each release records the packaged downloads. Every release is linked to a source version. Electron and its bundled components retain their included third-party licenses; game and audio rights are recorded in the project and bundled documentation.
