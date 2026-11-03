# Version 2.4.0 layout and palette check

Checked the built static game on November 3, 2026.

- All 31 automated content, save, toy, and preference checks pass. Static build and diff whitespace checks pass.
- Inspected the home page, chapter arrival, craft activity, map, keepsake book, keepsake garden, and final gathering at a 1280-pixel viewport. No document-level horizontal overflow was measured.
- Checked chapter navigation at 1280, 820, 390, and 320-pixel viewports. Labels stayed at least 10 pixels inside their links horizontally, all seven links retained a minimum 48-pixel height, and wrapping did not clip labels.
- At 390 pixels, combined Largest text, plain font, increased line spacing, large controls, stronger contrast, and plain backgrounds. Checked home, map, craft, outing, book, and garden. The document remained within its 375-pixel content width (the scrollbar takes 15 pixels).
- Confirmed the tablet reading layout uses a single main column, with illustrations and supporting material below the story. Desktop keeps illustrations beside the reading area.
- Reset the local test preferences through the Comfort & Access interface after checking them. Saved learning and outing progress remained available.
- No browser errors were logged during the exercised flows.

## Palette roles

Warm paper supports the page. Opaque, pale reading surfaces keep text off the decorative washes. Sage marks learning and making, lavender marks a current choice, peach holds notes and memories, and pond blue groups activity information. Main actions use the same deeper green throughout. The current chapter also has an outline and bold label.

Calculated contrast ratios for the shared palette: body ink on reading paper 9.22:1, secondary text on page paper 5.55:1, white on the main green action 5.71:1, selected text on lavender 6.86:1. Body ink on sage, pond blue, and peach is at least 7.89:1. These calculations cover the shared token pairs, not every SVG or inherited legacy style.

Reference: [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). These focused checks do not establish full WCAG conformance.

The shared theme lives in calm.css and loads before the accessibility stylesheet so stronger-contrast, plain-background, and other comfort preferences retain priority.
