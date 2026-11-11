# v3.4.0 curriculum and interaction checks

Checked November 11, 2026.

## Scope and evidence

- Rechecked the official SPACE program and Eli Lebowitz’s IOCDF overview. The parent-focused sequence and limits are documented in RESEARCH.md. This is editorial source checking, not independent clinical review.
- All 92 automated checks pass, including six new checks for parent-note coverage, the shared three-part plan, mixed-practice feedback, smaller finale groups, old partial boards, and parent-route bookmarks.
- Production build passes. Local Electron self-test reports CHOCHI_DESKTOP_OK for secure context, storage, and assets on macOS arm64; Chromium emitted cache warnings during shutdown after the successful result.

## Browser interaction checks

Used the in-app browser against the production build on localhost, through visible controls without injecting saved state.

- Opened the parent hub before reading the child prologue. Followed all nineteen distinct notes and confirmed prompts, navigation, and read-aloud controls. Parent reading did not overwrite the child’s saved Continue our story location.
- Read the prologue, selected Button, completed all nineteen chapter projects, and visited each goodbye. Gift packing and chapter progress continued to work; the final gathering showed nineteen earned gifts.
- Inspected level 8’s four-step loop, retained low table, and taking-over example. Tried both answers in both new practice cases at levels 8 and 16.
- Placed level 11’s three plan strips with Enter, after an out-of-order attempt. The correct sequence finished and packed the plan card automatically.
- Completed all five finale acts. In the third act, an unsuitable note left work intact; three correct notes revealed group two, then two revealed group three. Focus moved to a visible card and status named the next group.
- Reopened the finale in another tab and reloaded it: the partial board resumed at the correct group. Make it again returned to group one. Chochi’s helper completed the remaining activity and allowed normal continuation.
- At 320 CSS pixels with the Largest text setting, all eight optional practice pages accepted both answers, displayed feedback, and had no horizontal page overflow. The loop and parent notes also fit at that width. At 390 pixels the finale fit. Restored the normal viewport and text size after checks.
- No browser error logs were reported for the checked pages. Screenshot: output/curriculum-v3.4.0.png (local verification artifact).

## Limits

No claim of WCAG certification, formal reading-age assessment, clinical validation, or testing on every physical device is made. Parent notes and mixed practice request and record no personal responses. Existing local profiles, project card indices, gifts, letters, and bookmark formats are retained.
