# Third quality and consistency review: v2.9.3

Reviewed November 5, 2026.

## Findings and fixes

- Activating Skip to the story from a lesson changed the URL to #main and rendered the home page. The link now focuses the current main content without changing the route or rebuilding the page.
- Legacy Button finding postcards used their old artwork but could receive a description from the newer hidden-object game. The saved snapshot’s artwork mode now also determines its text description.
- Opening an outing without first choosing a companion could mix Button’s activity with other character labels. The actual outing renderer now asks the player to choose a travelling friend first. The main app then refreshes the current scene and its companion labels.
- Corrected visible and accessible singular counts, including 1 gift and 1 tiny wonder.

## Checks

- All 60 automated tests pass. Production build succeeds. No art or audio asset changes.
- Reproduced the skip-link problem on the previous build, then confirmed keyboard Enter preserves the Learn with Rue page and route while focusing main content. Back navigation and reload return to the same lesson.
- Used local QA fixtures with the actual album renderer for an older finding snapshot and a current painted finding snapshot. The older picture now describes its six original places; the current picture names its painted objects and positions. The legacy picture loaded successfully.
- Used a separate local QA fixture with an empty companion choice and the actual outing renderer. No game appears until a choice is made. Button opens the finding game; Pipkin opens the song game. Each choice invokes saving once.
- Confirmed the companion chooser fits a 390-pixel viewport with no horizontal overflow, then restored the viewport.
- Confirmed a one-gift saved adventure displays 1 gift in our art basket.
- No browser console errors in the checked flows. QA fixtures are under ignored output/ and are excluded from the production build. They do not alter player saves.

## Limits

This pass focuses on navigation, unchosen-companion behavior, snapshot descriptions, and count wording. Broader rendering, project, save, audio, and access checks are recorded in the preceding quality reports. This is not a clinical evaluation or assistive-technology conformance certification.
