# Comfort and access

Version 2.2 adds player-controlled access settings. No diagnosis is requested. Preferences are separate from lesson progress, and resetting these settings does not erase the story or postcards.

## Available throughout the game

- **Comfort & Access** in the header and before the opening story. Quiet, Larger controls, and Less on screen are starting presets; individual settings can then be adjusted.
- Three reading sizes, a plain or storybook font, more line spacing, and stronger text/control contrast.
- Plain backgrounds, reduced motion, optional hidden illustrations, and a simpler layout. Device reduced-motion preferences remain respected.
- Large controls on any screen and a saved place-list map preference. Hiding pictures keeps the text controls and place list available.
- A reading toolbar with page reading, pause/resume, repeat, and stop. Voice, speed, and narration volume can be set independently of music and effects. Optional spoken labels and feedback start off.
- One-paragraph reading for groups of story paragraphs, with previous/next controls and saved paragraph position.
- **Where were we?** recaps with the current place, story goal, travelling friend, and an idea from the keepsake book.
- **Take a break** stops sound and leaves the current page in place. A reload on the same route reopens the break screen. Returning restores the saved scroll position. Saved toy pieces, selected kit item, garden stamp/lift tool, projects, and paragraph positions remain available.
- A support preference for a quieter place, headphones, a familiar cushion, or whatever helps. Supports do not depend on winning or feeling calm.

Read-aloud is user initiated and depends on browser speech support. It reads visible story text, controls, and instructions, and includes a toy’s picture description. Spoken labels are optional so they can remain off when using a screen reader. Music and effects continue to start off each visit.

## Play controls

- The turning-paper puzzle can be played by choosing a direction from a labelled menu.
- Ribbon rows can be chosen directly from menus.
- Garden shapes can be placed or lifted using a selected stamp and labelled plot buttons.
- Finding games offer labelled buttons; music-box notes have written names and a picture description. Boat position and target dock are given in text.
- Boat moves can be undone while earlier dock visits remain in the book.
- All toy types retain a companion-help action and a link to continue the story.
- Learning projects and the final gathering offer **Build this together with Chochi**, which demonstrates how the pieces fit. It is available to everyone and does not assess a player’s feelings.
- Toy updates retain matching controls and live regions in the DOM. Brief feedback is announced through live regions; focus stays on the control used when possible.

## Verification and limits

The release includes automated tests for preference sanitation, independent settings, alternate toy actions, and undo behavior, alongside the existing content and game tests. Browser checks cover keyboard order, direct controls, native dialogs, read-aloud controls, saved paragraph position, break/reload behavior, text-only play, maximum text at narrow widths, and preserving existing progress.

These checks are not a WCAG conformance certification. End-to-end testing with VoiceOver, NVDA, switch-access users, and disabled children and adults has not been completed. Browser speech voices and behavior vary. Physical supports such as headphones and cushions are chosen by the player; the game does not supply or prescribe them.

## Guidance used

- [W3C cognitive accessibility: clear and understandable content](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/)
- [W3C WCAG 2.2 guidance on focus, targets, and input alternatives](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/)
