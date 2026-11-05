# Second quality and consistency review: v2.9.2

Reviewed November 5, 2026.

This pass emphasizes actual first-time interactions and replays, complementing the rendering and mobile coverage recorded in QA-v2.9.1.md.

## Findings and fixes

The project helper invited players to try parts again, but completed projects disabled all pieces without a way to start another attempt. A Try this project again control now clears only that project’s pieces, saves the empty board, and returns focus to its cards. Earned gifts, received letters, completed chapters, other projects, and player profiles remain intact.

In the final gathering, retrying hides the next-part action until the project is completed again. Project completion now says Our project is ready, which fits both the journey and the return home.

## Checks performed

- All 60 automated tests pass and the production build succeeds. No image or audio assets changed.
- Used the existing separate test player for the three-page introduction and first chapter: companion selection, discovery, teaching, project, both conversation replies, remembrance, letter delivery, and gift packing.
- A non-matching project card produced a teaching hint without losing useful work. The three matching cards completed the first project.
- Retried the first project and reloaded: the cards stayed available. Completing it again worked.
- Packed the first gift and checked the basket: exactly one gift and one received letter. Retrying the packed project retained both.
- Tested retry and assisted completion for all four project types: collecting, sorting, sequencing, and composing word strips.
- Replayed all five final gathering scenes. Retrying the first scene hid the next-part button until completion; the gathering then finished normally.
- Checked the project retry control at 390 × 844: no horizontal overflow. Viewport restored afterward.
- Took a break, reloaded, and returned to the same project with its work and retry control preserved.
- No browser console errors in the checked flows.

## Limits

The prior release’s full rendering and accessibility checks remain documented separately. This pass is not a clinical evaluation or an assistive-technology conformance certification. It does not claim that every possible choice combination has been manually played.
