# Version 2.5.0 verification

Checked the built static game on November 3, 2026.

- All 45 automated checks pass. Added coverage for original-save compatibility, separate player data, five-player limits, duplicate names, restart scope, older-tab isolation, storage-write failures, music timing, postcard snapshot isolation, completed-outing memories, earned basket items, received-letter filtering, usable recipes, and flight story endings.
- Created a second local test player through the UI. It began with no progress. Changed its contrast setting, switched back to My adventure, and verified the original 20 shining places and 21 outing versions remained. Switching again restored the test player’s own setting and empty basket.
- Checked both restart confirmation screens. The safe choice received focus. The final erase button was disabled until the named checkbox was checked. Cancelled without erasing browser progress. Restart execution and isolation were exercised against in-memory storage in automated tests.
- Followed the grown-up guide’s restart entry point into the same player dialog. The previous reset shortcut was removed.
- Watched four music-box notes in order with sound off. Confirmed the scene, key, score position, and beat label matched each step. Turned song sound on explicitly, checked synchronized playback, and stopped it. Stop cleared the visual markers.
- Corrected a helper callback error found during testing, then verified that adding a missing note updates the tune, moves focus to the picture-save control on completion, and removes the no-longer-useful helper button.
- Saved a game picture, opened the album, and checked that saved picture images loaded. Snapshot tests verify edits do not alter already-kept scenes or carried tunes and patterns.
- Inspected the filled basket and its five received letters. All 19 gift bounds, number tags, and the selected outline fit inside the inner oval, including an extra three-pixel check margin. The empty player had no gift drawings, received-letter titles, or future-letter content.
- Opened the first letter at chapter end and checked the corrected ribbon-pocket detail. The chapter ending recalled the completed welcome song rather than inviting the same task again.
- Followed Pipkin’s flight to the acorn-tree visit and back to Tuck. The result appeared directly with the outing, there were no dock counters, and retrying offered a new path. Automated checks cover all three welcoming destinations.
- Confirmed the first chapter has no mixing bench without a usable recipe and no repeated replay blurb. Recipe tests verify unrelated objects cannot enable a combination.
- Checked the basket, player dialog, and song at a 390-pixel viewport. The document stayed within its 375-pixel content width and the dialog had no horizontal overflow. Desktop layout was checked at 1280 pixels.
- Checked Rue’s outing panel with overflow visible for text, while the illustration frame retained its own clipping.

These focused checks do not establish full WCAG conformance or replace testing with disabled players and assistive technologies. Browser speech and audio behavior vary by device.
