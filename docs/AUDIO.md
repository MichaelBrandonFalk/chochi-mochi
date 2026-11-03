# Audio sources and reuse

Verified November 2, 2026. Every bundled audio asset is creator-designated CC0 1.0 public domain. Attribution is not required, including in commercial projects. Source records are retained here for traceability, not as an attribution obligation.

## Music

- Work: **Calm Track**, by **pmiller**.
- Creator upload and license: https://opengameart.org/content/calm-track
- Original: https://opengameart.org/sites/default/files/calm_track-loop.ogg
- The upload states CC0 and “Public Domain, no attribution necessary.”
- Bundled as `assets/audio/calm-garden.mp3`.
- Changes: MP3 encoding at 96 kbps, loudness adjustment to -24 LUFS, peak limit target -6 dBTP, two-second fades at the loop edges.

## Effects

- Work: **Interface Sounds 1.0**, by **Kenney**.
- Creator asset page and license: https://kenney.nl/assets/interface-sounds
- Creator upload mirror: https://opengameart.org/content/interface-sounds
- Original pack: https://opengameart.org/sites/default/files/kenney_interfaceSounds.zip
- Creator confirms CC0 and no attribution requirement: https://kenney.nl/support
- `Audio/tick_001.ogg` becomes `assets/audio/page-touch.mp3`.
- `Audio/pluck_001.ogg` becomes `assets/audio/keepsake.mp3`.
- Changes: MP3 encoding, reduced loudness, and short onset fades. No error or alarm sounds are used.
- The pack’s original license file is retained in `docs/licenses/kenney-interface-sounds.txt`.

CC0 information and legal code: https://creativecommons.org/publicdomain/zero/1.0/ and https://creativecommons.org/publicdomain/zero/1.0/legalcode

## Playback behavior

Music and effects start off on every page load. Volume levels alone are remembered. Files are hosted with the game; playing them makes no request to a third-party music service. Music loops at a low default volume, ducks during read-aloud, and pauses when the tab is hidden. Stop all sound also stops read-aloud. Sound effects give gentle feedback for navigation and learning actions, with no penalty sound for an incorrect answer.


## Pocket music box

Version 2.1 adds original synthesized pentatonic notes for a player-operated four-note music box. No additional recordings or third-party samples are downloaded. The music box follows the Soft sound effects switch and effect volume. Notes stop when Stop all sound is used, narration begins, the page changes, or the tab is hidden. Saved tunes contain note numbers only; playback never resumes automatically.


## Comfort and reading controls

Comfort & Access can adjust music and effect volumes and stop all sound. Narration has its own voice, speed, and volume settings. Quiet stops current audio and disables extra spoken labels. Read-aloud remains available by request. A break, page navigation, hiding the tab, and Stop all sound cancel narration; none automatically restarts it. Browser voices are supplied by the device or browser, not bundled recordings.
