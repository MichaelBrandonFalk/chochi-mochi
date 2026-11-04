# Audio sources and reuse

Verified November 2, 2026. Every bundled audio asset is creator-designated CC0 1.0 public domain. Attribution is not required, including in commercial projects. Source records are retained here for traceability, not as an attribution obligation.

## Earlier music, through version 2.5

This recording is retained only in earlier releases. See Version 2.6 music below for the current playlist.

- Work: **Calm Track**, by **pmiller**.
- Creator upload and license: https://opengameart.org/content/calm-track
- Original: https://opengameart.org/sites/default/files/calm_track-loop.ogg
- The upload states CC0 and “Public Domain, no attribution necessary.”
- Previously bundled as `assets/audio/calm-garden.mp3`.
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

Music and effects default on for a new player. The first tap or keyboard activation unlocks music under browser autoplay rules. On/off choices and volumes are remembered for each player. Files are hosted with the game; playing them makes no request to a third-party music service. The six-track playlist plays at a low default volume, ducks during read-aloud, and pauses when the tab is hidden. Stop all sound also stops read-aloud. Sound effects give gentle feedback for navigation and learning actions, with no penalty sound for an incorrect answer.


## Pocket music box

Version 2.1 adds original synthesized pentatonic notes for a player-operated four-note music box. No additional recordings or third-party samples are downloaded. The music box follows the Soft sound effects switch and effect volume. Notes stop when Stop all sound is used, narration begins, the page changes, or the tab is hidden. Saved tunes contain note numbers only; playback never resumes automatically.


## Comfort and reading controls

Comfort & Access can adjust music and effect volumes and stop all sound. Narration has its own voice, speed, and volume settings. Quiet stops current audio and disables extra spoken labels. Read-aloud remains available by request. A break, page navigation, hiding the tab, and Stop all sound cancel narration; none automatically restarts it. Browser voices are supplied by the device or browser, not bundled recordings.

Version 2.5 adds a shared 0.6-second beat score for sound and visual playback. Watch our tune runs silently without requiring Web Audio. The score, scene notes, and keys mark the same note, with names and a beat counter as well as color. Sound-off and zero-volume states show an explicit opt-in control. This enables soft effects only, not background music. Volume settings are separate for each local player.

## Version 2.6 music

The previous Calm Track is no longer used. Four original, gently plucked keyboard miniatures replace it: Clover Waltz, Pear Blossom, Cloud Carousel, and Bluebell Tea. Each is about two and a half minutes, with a three-beat accompaniment and a soft attack. The playlist advances after each complete piece, returning to the first after all four. No outside recording, sample, or copyrighted composition is used.

The scores, synthesizer source in `scripts/compose-music.py`, and four generated recordings are dedicated to the public domain under CC0 1.0. No attribution is required for any use. The manifest records their SHA-256 checksums. The existing two Kenney effects keep their recorded CC0 terms.

Sound is enabled initially, but browsers may block playback until a user gesture. Quiet and Stop all sound persist across reloads. Speech still starts only by request.

## Version 2.6.2 tune controls

Play our tune and Watch our tune both use the same audible, visual playback. If effects are muted or their volume is zero, either control still shows the visual notes. The background soundtrack pauses completely while a tune plays, including visual playback, and resumes from its existing position afterward only if music is enabled and the tab is visible. Stop all sound remains in effect.

## Version 2.8 varied playlist and track controls

The current playlist has six original pieces: Clover Waltz, Meadow Guitar, Willow Flute, Cloud Bells, Bluebell Strings, and Orchard Marimba. The first retains the original keyboard arrangement. Five new synthesized arrangements use different timbres, registers, meters, accompaniment, rests, and tempos: plucked guitar, flute with strings, soft music-box bells, a string trio, and marimba with bass. These are original synthesized recordings, not sampled acoustic performances or existing classical works.

The new arrangements and recordings are dedicated to CC0 1.0 without an attribution requirement. Source scores and synthesis are in `scripts/compose-varied-music.py`, and hashes remain in the audio manifest. The new tracks were brought close to the original track’s measured loudness, approximately -29.5 LUFS, to avoid a jump when changing songs. The three retired keyboard pieces remain available in earlier releases.

Next track appears in Sound and Comfort & Access. It advances through all six tracks and remembers the selected filename per player. Skipping while music is paused selects the next piece without turning music on. Skipping during a tune selects the next background piece but waits until the tune ends before playing it. The existing music volume, effects volume, quiet settings, and tune suspension behavior remain in effect.
