# Desktop build and storage

The desktop edition uses Electron with bundled static dist files. It serves them from the standard, secure chochi://game origin. Node integration is disabled in the renderer; context isolation, sandboxing, permission denials, an asset-root boundary, and a restrictive content policy remain enabled. Renderer network requests are blocked. Known HTTPS reference links open in the system browser after a user action.

A narrow context-isolated storage bridge replaces the browser storage adapter. It accepts only game-prefixed keys, validates the sending origin, bounds values, and writes a versioned JSON save file atomically. A failed write leaves the previous saved bytes and in-memory values intact. A corrupt file stops startup with an explanation rather than being replaced. An application-instance lock prevents concurrent normal copies from racing over the same saves.

Windows portable saves follow the wrapper’s executable-directory variable. Linux portable saves follow the original AppImage path or extracted-folder executable. Installed Windows and /opt or /usr Linux copies use per-user application data.

Mac uses userData/Saved game by default, including copies opened from Downloads, mounted disk images, and App Translocation. No normal first-launch folder picker is used. Game > Save location offers explicit portable saving and a return to local saving. A separate atomic configuration file remembers the choice. Switching to an empty folder copies current players; existing destination players are opened only after confirmation and are never overwritten by switching. Writes are blocked while relaunching so the old renderer cannot write into the new location.

On first local startup, discoverable legacy adjacent saves are copied without deleting the source. hdiutil/plutil are used only to locate older saves beside an original disk image. Game > Import saved players offers a confirmed manual alternative, validating the source before replacing anything and backing up an existing destination. Mac releases contain one universal DMG, with no ZIP alternative. The native window title and download labels include the version.

## Build

    npm ci
    node node_modules/electron/install.js
    npm test
    npm run desktop:build -- --mac --universal
    npm run desktop:build -- --win --x64
    npm run desktop:build -- --linux --x64

Use a native runner for each OS. The GitHub desktop workflow builds the three platforms in parallel and checks the installed Linux package against the Ubuntu 24.04 base used by Mint 22. The Linux build runner uses 22.04, covering Mint 21’s base. Mac packages are universal and ad-hoc signed, not Developer-ID signed or notarized. Windows builds are unsigned.

The release artifacts are versioned, checksummed, and uploaded only after the native jobs and the Mint-base job pass. The Download page uses explicit versioned release URLs. Verify all linked asset names before publishing the website. Keep older fingerprinted web bundles on gh-pages so already-open browser sessions can finish loading.

## Diagnostics

    npm run desktop:check
    node scripts/desktop-smoke.mjs

The --self-test startup diagnostic uses an isolated temporary save folder and hidden window. It checks the rendered home page, secure origin, absent renderer Node access, the actual storage bridge, bundled images, and bundled audio. It exits with a failure for missing offline assets or unexpected renderer network requests. No diagnostic player data is written to normal saves.

The desktop Node tests check cross-player persistence, failed writes, corrupt saves, URL boundaries, reference-link restrictions, portable locations, disk-image origins, and the download manifest. These tests complement the game and audio-controller tests.

No signing credentials are stored in the repository. Future Developer ID/notarization and Windows certificate setup should be configured separately with the repository owner’s credentials before describing a release as publisher-verified.
