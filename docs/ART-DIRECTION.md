# Storybook art direction, version 2.7

Each of the twenty chapter openings has an original scene painting. Chapter 1 establishes the character reference; all later paintings use that same reference. The map is a separate painted landscape. The requested old fairy-tale book mood is expressed through fine sepia contours, translucent watercolor, botanical borders, warm paper, and soft natural light.

The built-in image generation tool produced the raster paintings. The exact prompt set is in [storybook-prompts.json](storybook-prompts.json). Optimized release paintings and the integrity manifest are in `assets/storybook/`. PNG originals remain in the local workspace and are excluded from source control and published builds.

## Pigment roles

| Role | Color | Purpose |
| --- | --- | --- |
| Reading paper | `#fffdf6` | Quiet surface behind text |
| Page background | `#f9f5eb` | Warm ivory, gentle on bright screens |
| Ink | `#344a43` | Clear dark green text |
| Action | `#4b6657` | Steady sage, white button text |
| Choice wash | `#eee7ef` | Muted lilac for decisions |
| Care wash | `#e9edde` | Soft sage for learning |
| Story response | `#f4e6dc` | Pale rose and peach warmth |
| Pond wash | `#e8efec` | Soft blue-green for quiet supporting panels |

Color is paired with words, borders, focus states, and selected-state markers. Reading text stays on solid paper surfaces. Stronger contrast, plain backgrounds, larger text, less on screen, hidden illustrations, and reduced motion remain available.

## Illustration placement

- Chapter openings: a large painting directly before the first narrative paragraph.
- Opening story and final chapter: paintings of the bluebell garden and the departure gate.
- Map: a painted valley under the existing clockwise hexagon path, with opaque labels.
- Outings and saved postcards: small embedded copies of each location painting behind the interactive pieces. Embedded images let exported SVG pictures remain self-contained.
- Home and garden: the final garden painting with a separate live table-and-lantern plan showing player choices.
- Basket, gifts, and practice pieces: editable artwork with fine ink edges, paper-colored surfaces, and a watercolor wash. Earned items and progress remain state driven.

## Asset preparation

Run `python3 scripts/prepare-storybook.py` after generating the PNG originals. This developer-only command uses Pillow to make full-size and 768-pixel WebP files, compact embedded painting data, and SHA-256 records. The normal build consumes the prepared assets and does not need an image-generation service or Pillow. It excludes `*-original.png` files.
