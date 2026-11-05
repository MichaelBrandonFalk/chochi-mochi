# v2.9.0 verification

- All 59 Node tests pass, including all twenty finding walks, replay positions, unique painted targets, snapshot migration, and byte-preserving postcard embedding.
- Production build succeeds. Script payload is 260,439 bytes in one request, down from 1,177,552 bytes of source modules in v2.8.0 (77.9% smaller before HTTP compression). Five stylesheets become one request. This is a payload comparison, not a promised timing improvement on every connection.
- Full-size chapter, map, audio, and gift asset files are unchanged. Postcards fetch only the images used by visible cards, with an in-memory shared image cache. Their source WebP bytes are embedded without re-encoding.
- Home gift count is above the lower garden-plan illustration, separate from the main story portrait caption.
- Browser: Button’s Clover Gate walk starts fresh, hints point to the next treasure, all three targets complete, and the saved picture loads as a self-contained SVG.
- Browser: a replay changes positions and resets the finding progress; the saved postcard URI stays identical after replay.
- Browser: the meadow has a different picture, story, and target set. Pipkin still opens the musical game and old musical postcards remain available.
- Mobile at 390 × 844: no horizontal overflow; larger-view hit targets exceed 44 CSS pixels; the text-based finding controls produce the same progress as the picture buttons. Viewport reset after the check.
- Browser console: no errors during the checked flows.
- No local-player keys, curriculum progress, or profile schema were removed. Native hunt state is versioned so old found-spot progress cannot accidentally complete the new walk; old postcard snapshots retain their original mode.
