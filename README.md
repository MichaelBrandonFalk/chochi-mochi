# Chochi Mochi: The Garden of Little Lights

A peaceful, text-led browser adventure with a three-page opening and seven-page story chapters: 19 learning places and a final 19-gift review with Glaloula. Original SVG artwork, early-reader prose, optional browser read-aloud, local progress, a keepsake book, and adult notes. No timers, penalties, trackers, accounts, runtime packages, or build dependencies.

This independent educational adaptation introduces SPACE principles. It is not official SPACE treatment, endorsed by its developers, or clinically validated. Children do not need to play for their caregivers to use SPACE. See [research and curriculum notes](docs/RESEARCH.md).

## Run locally

Requires Node 22+ for checks/build and Python 3 for the convenience server.

```sh
npm test
npm run build
npm start
```

Open http://localhost:4173. Static files also work on any web server. Use HTTP because the game uses ES modules. The deployable output is `dist/`; relative asset paths support GitHub project Pages.

## GitHub Pages and versioned releases

1. Create a public GitHub repository and push this source.
2. In Settings → Pages choose **GitHub Actions** as the build source.
3. Tag the release `v1.0.0` and push the tag. The included workflow tests, packages, and deploys that exact tagged commit. Main-branch pushes do not deploy automatically.
4. Create a GitHub Release for that tag, using CHANGELOG.md and optionally attaching a ZIP of `dist/`.

For subsequent releases, update the package version, visible footer, and changelog, then create a new semantic version tag. Never move a published tag. To roll back, run the workflow manually selecting a previous tag. The workflow can also be manually run for a selected branch; use a release tag to preserve release provenance.

## Content and accessibility

`content.js` contains the 19 original lessons; `app.js` composes the story and final review. All final-review gifts require a correct response with unlimited supportive retries, and every lesson is revisitable. Choices do not collect personal mental-health data. Reading level is an editorial target around age seven, not a validated assessment. Adult notes intentionally use more precise terminology.

Native buttons, headings, keyboard focus, live feedback, responsive layouts, no motion effects, and user-initiated speech are included. Browser speech availability varies. Local-storage failure falls back to in-memory progress; clearing browser data removes saves.

Version 1.2 adds 19 optional card activities, distinct landmark illustrations, new final scenarios, a saved reading position, and printable keepsakes. Chapter page links allow easy review.

Version 1.3 adds a winding map, a keepsake garden, responsive practice pictures, saved discoveries, and four final-review story scenes. Flowers record learning rather than a character’s anxiety level.

Version 1.4 expands each chapter to seven pages: arrival, discovery, teaching, reply exploration, practice, teach-back, and a new situation. Five story letters bring Glaloula into the trip. Reading position and completion saves remain compatible; older page bookmarks open the corresponding page number in the expanded chapter.

Version 1.5 puts the opening before level 1, moves letters to chapter endings, and adds optional music and effects. Audio is off each visit. Source and CC0 records are in [docs/AUDIO.md](docs/AUDIO.md).
