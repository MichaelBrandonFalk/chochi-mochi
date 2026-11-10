# Projects, wording, and Mac downloads

## Changes

Sorting shows one card and named category buttons immediately beneath it. A correct choice places the card and advances automatically. A different choice keeps the card and saved work, with a gentle hint. Live feedback includes the next card for screen-reader users. Other projects retain direct card choices; ordered projects show the next step position.

Chochi’s helper places the remaining pieces and focuses the completion message. Completed projects hide their input and helper controls. Each finished gift appears in the basket immediately, without a packing click. Replaying a project retains the earned gift. Chapter completion and received letters remain tied to the chapter ending. The remaining-gift list excludes gifts already made.

Corrected Nell’s pronouns and parent role across the project and older activity wording. Updated gift articles, plural completion messages, remaining-place counts, and chapter-end labels.

Mac releases have one universal DMG and local saving by default. Portable saving is an explicit menu preference. Imports validate the source and back up existing players. Version labels appear in the native title and each download link.

## Local verification

- All 82 automated checks passed, including saved-location selection, failed writes, import backups, existing destination preservation, the six-download manifest, and immediate basket gifts without early letters.
- Built the Apple-silicon app. Its packaged startup diagnostic passed with the secure offline origin, storage bridge, bundled image/audio access, and no renderer network access. The development startup diagnostic also passed.
- Opened the packaged app normally and verified the versioned title, rendered home page, and absence of a first-launch folder picker. Opened the optional portable-folder chooser and cancelled back to the game. Location switching and imports were verified in isolated filesystem tests, not against personal player files.
- In the browser, reset the welcome project, used Chochi’s helper, verified visible completion, hidden finished controls, the basket gift, and no received letters before the chapter ending.
- Sorted all four cloth cards using the category buttons. Checked that a wrong category retains the current card, correct choices advance, and completion adds the cloth automatically. Checked the phone layout at 390 pixels, no page overflow, and hidden controls staying hidden.
- Placed the first ordered listening step, then completed the rest with Chochi’s help. Checked that the chapter ending has a next-place action and no separate packing action.
- Reviewed the Download page for the single versioned Mac DMG and six platform downloads.

The native release workflow additionally checks Windows, universal Mac, Linux, and the installed DEB on Mint 22’s Ubuntu base before publishing downloads. These checks do not cover every physical device or assistive technology.
