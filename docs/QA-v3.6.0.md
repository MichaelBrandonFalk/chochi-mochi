# v3.6.0 story and starting-path checks

Checked November 12, 2026.

## Automated and desktop checks

All 108 automated checks pass. Added coverage for per-player starting preferences, legacy save migration, valid parent reading pages, prologue-first story routing, and current companion outing titles. Updated practice paging checks to verify instant scrolling to the revealed heading. Production build and macOS arm64 Electron self-test pass.

## Browser checks

Used visible controls in the in-app browser against the production build. No game state was injected.

- Existing adventure with ten completed places retained its story Home screen after upgrade. Fern’s Home button opened the parent hub. A parent note became the separate Continue Fern’s notes destination after reload. Switching back resumed the existing chapter page.
- A new optional player received the two starting cards. The grown-up card opened Fern’s notes before any child progress. After reading a note, Play the story opened the prologue. Returning to Fern resumed the note. Switching players retained the original adventure.
- Fern’s notes has a prominent direct link near the top of About.
- Walked all seven pages of all nineteen chapters, tried both reply choices, used Chochi’s project helper, opened each transfer exercise and tried its first answer, and visited each goodbye. Every current outing title matched Button’s finding walk and the local host. Empty feedback blocks stayed hidden until needed.
- Completed the three-stage homeward ride and all five garden acts with the project helper. The final art afternoon opened with nineteen earned gifts.
- At 320 CSS pixels, checked the new parent Home and a chapter practice page without horizontal overflow. Paging a practice story moved its heading to about 24 pixels from the viewport top. Desktop welcome layout was checked at 1280 pixels. Restored the viewport.
- Confirmed the repaired Mirror Pool image path loaded, and the new lesson vignette disappeared when Hide illustrations was enabled. Restored illustrations. Small artwork uses existing choice-dependent gift assets, without new large reading-page downloads.
- Screenshot: output/start-path-v3.6.0.png. Reflection edit mode, exact prompt, and saved asset paths are recorded in ART-EDITS.md.

## Scope and limits

Editorial consistency pass covered chapter prose, teaching, replies, practice feedback, and parent examples. This is not a guarantee of error-free text, a formal reading-age assessment, clinical validation, or comprehensive accessibility certification. The release does not change clinical recommendations or gate access by age. It stores a content preference, not an age record. Existing progress, boards, choices, received letters, profiles, and access settings remain compatible.

Native release CI verifies Windows, universal Mac, Linux packages, and installation on the Mint 22 Ubuntu base before website publication. Release asset checks compare all six download names and GitHub digests to SHA256SUMS.txt.
