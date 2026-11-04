# Chochi Mochi: The Garden of Little Lights

A peaceful, text-led browser adventure with a three-page opening and seven-page story chapters: 19 learning places and a five-part garden gathering with Glaloula. Original SVG artwork, early-reader prose, optional browser read-aloud, local progress, a keepsake book, and adult notes. No timers, penalties, trackers, accounts, runtime packages, or build dependencies.

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

The live site publishes the root of the `gh-pages` branch using GitHub’s branch publishing mode. This was approved on November 4, 2026 after the custom Actions deployments remained queued. The public address stays https://michaelbrandonfalk.github.io/chochi-mochi/.

For each release:

1. Update the package version, visible footer, and changelog. Run `npm test` and `npm run build`.
2. Commit the source and create an immutable semantic version tag. Never move a published tag.
3. Copy the complete `dist/` output to the root of `gh-pages`, including a `.nojekyll` file. Commit the built files with the release tag and source commit in the message, then push that branch. Preserve its publishing history rather than force-pushing.
4. GitHub Pages publishes that branch. Verify the Pages build and the version shown on the public website.
5. Create a GitHub Release for the source tag, optionally attaching a ZIP of `dist/`.

The included Actions workflow validates tagged releases and uploads a build artifact. It does not publish the website. Pushing a source tag alone does not update `gh-pages`. To roll back, build a previous immutable tag and publish that output as a new commit on `gh-pages`.

## Content and accessibility

`content.js` contains the 19 original lessons; `app.js` composes the story and final review. Each chapter has a visual project with unlimited supportive retries; the finale applies all 19 ideas, and every lesson is revisitable. Choices do not collect personal mental-health data. Reading level is an editorial target around age seven, not a validated assessment. Adult notes intentionally use more precise terminology.

Native buttons, headings, keyboard focus, live feedback, responsive layouts, no motion effects, and user-initiated speech are included. Browser speech availability varies. Local-storage failure falls back to in-memory progress; clearing browser data removes saves.

Version 1.2 adds 19 optional card activities, distinct landmark illustrations, new final scenarios, a saved reading position, and printable keepsakes. Chapter page links allow easy review.

Version 1.3 adds a winding map, a keepsake garden, responsive practice pictures, saved discoveries, and four final-review story scenes. Flowers record learning rather than a character’s anxiety level.

Version 1.4 expands each chapter to seven pages: arrival, discovery, teaching, reply exploration, practice, teach-back, and a new situation. Five story letters bring Glaloula into the trip. Reading position and completion saves remain compatible; older page bookmarks open the corresponding page number in the expanded chapter.

Version 1.5 puts the opening before level 1, moves letters to chapter endings, and adds optional music and effects. Audio is off each visit. Source and CC0 records are in [docs/AUDIO.md](docs/AUDIO.md).


Version 2.0 makes the trip a shared garden art afternoon. All 19 chapters include a creative story fork, a lesson, a growing craft project, dialogue exploration, recall, and packing up. An optional garden-stamp toy lets players make a freely editable picture. Nineteen saved creative choices return in later scenes and the final storybook; the companion, cloth, lanterns, flower pot, sign, table, and ride have visual consequences. The final level is five linked projects applying the 19 ideas with Glaloula and her adult caregiver.

The hexagon map circles the valley from its far-left start, climbs to Starlight Library, then offers a manually paced cloud or balloon ride to the garden beside the start. Small screens can scroll the map, fit it into an overview, or use the keyboard-accessible place list. Pastel SVG scenes, paper texture, and 19 distinct craft pictures are original code-native artwork.

`adventure.js` holds creative forks and the pure project rules. `crafts.js`, `painting.js`, and `atlas.js` draw crafts, choice-dependent scenery, and the route. `party.js` maps the finale to all 19 ideas. `pastel.css` supplies the new visual treatment. The build fingerprints the complete ES-module tree to prevent stale modules after deployment. Existing completed chapters and keepsakes remain saved; new project boards, choices, and the ride are added to the same save. Older page bookmarks retain their page number, which may now show a different activity.


Version 2.1 adds twenty optional outings and six interactive toy systems. Every story choice becomes a tool in all later outings; companion routes, pond sizes, wheel rules, scenery, and layouts vary with the kit. Players can combine items into travelling charms, carry tunes and patterns forward, and collect actual toy pictures in an album. Branch saves preserve previous versions when earlier choices change. See [the play guide](docs/PLAY.md) and [verification notes](docs/QA-v2.1.0.md).

`trail-data.js` contains the twenty side stories and tool mapping. `trail.js` contains deterministic variant keys, state sanitation, toy rules, combinations, and carry-over. `trail-art.js` draws the interactive toy scenes. `trail-view.js` binds play controls and renders the album. Optional music-box notes are synthesized in `audio.js` without downloading additional recordings.


Version 2.2 adds Comfort & Access preferences, reading controls, one-paragraph story pages, sensory supports and saved breaks, recaps, direct toy controls, supported project completion, and control-preserving toy updates. See [access features and testing limits](docs/ACCESSIBILITY.md). Preferences, reading positions, and break state use separate local-storage keys from game progress. `access-model.js` sanitizes settings, `access.js` binds reading and comfort tools, `access.css` supplies presentation variants, and `dom-update.js` preserves existing toy controls during updates.

Version 2.5 adds optional browser-local players, guarded restarts, an earned-gift basket with received letters, silent visual songs, fixed postcard pictures, and connected flight stories. The original player retains the legacy save keys; additional players use separate key namespaces. Never clear all local storage to restart one player. See [play instructions](docs/PLAY.md) and [verification notes](docs/QA-v2.5.0.md).

### Version 2.6

Each companion now keeps one musical game across the journey: Button’s leaf drums or Pipkin’s song book. Optional four-note patterns vary by place and story choices. Old toy postcards remain viewable. Four original CC0 miniatures replace the previous soundtrack, with sound on for new players after browser gesture unlock and saved quiet preferences respected. Chapter introductions focus on one new friend, and story mentions label Chochi the Dinosaur and Mochi the Unicorn.
