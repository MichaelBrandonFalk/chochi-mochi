# Offline desktop release checks

## Local checks

- All 71 Node checks pass, including the existing curriculum, story continuity, accessibility preferences, companion outings, postcards, music controls, and player isolation.
- Added checks cover atomic saved-game writes, failure preservation, corrupt-file protection, platform-specific portable locations, disk-image source folders, safe asset paths, external-link restrictions, and versioned download URLs.
- The Mac ARM64 packaged application opens the game through a secure local origin. Its diagnostic confirms no renderer Node access, a working storage bridge, bundled chapter and basket images, bundled music, and no unexpected network requests.
- Created a player through the native Players dialog, quit the app, and reopened it. The selected player survived.
- Built a universal Mac ZIP and DMG. Opened the app from the mounted read-only DMG, created a player, and verified saved-game.json was written beside the original DMG, not inside its mounted volume.
- Reviewed the new download page in the native app and website. At a 390-pixel mobile viewport, the three platform cards stack, buttons fit, and the document has no horizontal overflow.

## Automated release checks

The release workflow builds native Windows, universal Mac, and x64 Linux packages. Each runs the packaged offline startup diagnostic. The Windows check also opens the portable EXE wrapper with the same isolated diagnostic. A separate Ubuntu 24.04 job installs and opens the DEB, complementing the Ubuntu 22.04 packaged check. The checksums and public downloads are published only after every required job passes.

## Limits

The Linux checks cover the Ubuntu bases used by Mint 21 and 22, not a physical Mint computer or every Cinnamon, MATE, and Xfce configuration. AppImage execution depends on FUSE and host sandbox/mount rules; the DEB is the recommended Mint option. Windows installer interaction and first-open OS reputation prompts have not been manually exercised here.

Mac builds are ad-hoc signed, not Developer-ID signed or notarized. Windows builds are unsigned. macOS App Translocation has a folder-selection fallback; the actual first-open quarantined flow has not been manually exercised. USB progress was verified using a mounted DMG and its original folder, not every USB filesystem or hardware device. Installed copies keep separate per-user saves. Website profiles are not automatically imported.
