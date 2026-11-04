# Version 2.7.0 checks

- All 52 automated checks pass, including twenty distinct chapter paintings, image hashes and responsive variants, self-contained postcard backgrounds, four live note markers, chapter picture placement, and comfort stylesheet order.
- Reviewed a contact sheet of all twenty chapter paintings and the map for subject, character consistency, scene, tone, and anatomy.
- Desktop browser: chapter 1 shows its painting before narrative text; home shows the bluebell garden and the separate choice-based table plan; the hex map keeps the clockwise path, opening story left of 1, and final garden below 1.
- Mobile browser at 390 pixels: document width 375 pixels, chapter painting 295 pixels, no horizontal overflow, and all seven chapter tabs at least 46 pixels high.
- Hide illustrations removes the new chapter painting. Stronger contrast restores dark text. Both options were restored after testing.
- The music game retains four visible note cues during playback, with the soundtrack paused. Its painted SVG backdrop is embedded as data, and saved game-picture previews load.
- The production build includes optimized WebP art and excludes local PNG originals. No game state or storage keys changed.
