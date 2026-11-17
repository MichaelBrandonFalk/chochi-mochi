# v3.7.0 artwork and music checks

Checked November 17, 2026.

## Findings and changes

The homeward illustration combined the library painting, which already contains Chochi and Mochi, with a second image of them in the ride. Both balloon and cloud now use the existing character-free valley landscape and a single ride cutout. All three page positions fit inside the scene.

The reported intermittent blocky image rendering was not reliably reproducible. Removed the whole-scene SVG turbulence/displacement filters that rasterized finished watercolor images, removed the unused global filter definition, and changed chapter paintings from asynchronous to synchronous decoding. The ride now uses ordinary HTML image layers. These are preventive rendering and resource changes, not a claim that every GPU/browser issue can be ruled out.

## Art and browser checks

- Verified all 74 WebP files decode successfully with Pillow.
- Reviewed all twenty chapter paintings, all six homeward combinations, and the filled basket in a local browser gallery using the actual rendering functions. All gallery images loaded without a broken source. The gallery is an ignored developer fixture, not shipped game content.
- Completed all nineteen chapter projects with Chochi’s helper in the production build and opened the goodbye pages. The homeward sequence unlocked normally.
- Reloading the second homeward page retained its position and loaded both images. Checked the final page and a 390-pixel viewport: no horizontal overflow and the complete ride remained within the picture.
- Hide illustrations removed the ride scene while retaining its caption and story. Restored that setting and the viewport afterward.
- The new music-box artwork retained its four live note markers. Playing a tune paused the background; after completion the background resumed. The inspected pages produced no browser error logs.
- Advanced through all sixteen track labels while paused. Quiet remained paused. The saved track filename and game progress remain compatible.
- Proof: output/homeward-art-v3.7.0.jpg.

## Music and automated checks

Added four original scores with independent melodies, rhythms, and arrangements, and measured the encoded files with ffmpeg. Measurements are in audio-measurements-v3.7.0.json. The source and recordings are CC0, with hashes and provenance in the audio manifest. No game-time synthesis or third-party audio request is needed for background tracks.

All 110 automated checks pass, including the new homeward composition regression, complete audio integrity records, sixteen-track cycling, and start-volume fade. Production build and the local macOS arm64 desktop self-test pass. Release CI checks Windows, universal Mac, Linux, and installation on the Mint 22 Ubuntu base before website publication.

## Limits

This is an editorial and technical art/audio review. It is not a comprehensive audit of every browser, graphics driver, assistive device, or listener’s sensory response. No curriculum, character choices, saved projects, earned gifts, or clinical recommendations changed.
