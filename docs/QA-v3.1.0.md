# Soundtrack and sound-design checks

- Twelve distinct playlist files have intact CC0 manifest entries and checksums. The full playlist runs 33.72 minutes before repeating.
- Six new pieces use different instrument envelopes, rhythms, registers, phrase structures, and accompaniment. No sampled recordings or existing compositions were used.
- Measured new recordings range from -29.64 to -29.79 LUFS, with true peaks from -22.20 to -20.02 dBTP. Loudness range is 2.0 to 3.4 LU. Measurements are recorded in audio-measurements-v3.1.0.json. This checks level consistency and headroom, not subjective comfort for every listener.
- Routine clicks are quieter than keepsake feedback, and both remain below the effect-volume setting. Effects do not overlap player-made tunes. Existing tune note levels and visual beat controls are unchanged.
- Controller tests cover live volume adjustment, stopping notes and effects, suppressing effects during tunes, restoring music position, periodic saves, resetting position when skipping, and keeping paused music paused when skipping.
- Existing checks cover quiet preferences, narration ducking, tune suspension, player isolation, story content, and accessibility data.
- Music loads only as needed. The game downloads no external recordings or services while playing.

The native release workflow checks packaged Windows, universal Mac, Linux, and Mint-base installation before publishing the updated offline downloads. Existing progress and comfort settings use the same storage keys and formats, with one optional music-position field added.

Browser verification: Paper Boats loaded and played from the bundled MP3. Pausing at about 37 seconds, reloading, and requesting playback resumed at that position. The paused preference survived reload. Next track while paused selected Meadow Guitar at zero seconds without turning music on. The source desktop diagnostic also passed for the secure origin, local save bridge, images, and bundled audio. All 74 Node checks passed.
