# Mobile map and project-picture checks

## Problems corrected

The old phone map squeezed wide name labels around a small number of visible stops. Fitting the whole map made labels and controls smaller still. Compact maps now show the route and numbered hexagons, with the selected name and a large Visit link below. Previous and Next controls can reach every place without tapping the small map. The readable place list opens on phones, and the large, scrollable picture map remains available. Desktop names and several stops have more breathing room. Compact CSS applies immediately on a phone resize, independently of the media-query event.

The flag image loaded correctly. Its wide picture was centered in a taller box, while the paint layer revealed from bottom to top. The first placed piece mostly uncovered empty space. Project pictures now size to their natural proportions and reveal from left to right. The unpainted picture is clearer and explains that it will fill with color. The original artwork is retained; apparent neon pixels in the diagnostic transparent-image preview had near-zero alpha.

## Verification

- Checked map targets at viewport widths 320, 390, 768, and 1280 pixels, with no target overlaps after layout settled and no document-wide horizontal overflow.
- Checked desktop label and face bounds together; no visual intersections remained.
- Used the map preview controls to reach all 21 destinations, from the opening story through Glaloula’s Garden. Checked that the final Next control is disabled and that every preview link keeps the correct destination.
- Confirmed that previewing a place does not navigate or change lesson progress. The large Visit link remains a separate action.
- Checked the Largest text setting on the phone map, including readable place names, wrapping, and large visit/arrow controls.
- Confirmed the first welcome flag becomes visibly painted after one card and that all three appear after the project is finished.
- Checked flags, flower pot, invitation, and book pictures on phone and desktop. They loaded and retained their natural proportions; measured ratio differences were below 0.0001, consistent with pixel rounding.
- Reviewed 30 page views across 390- and 1280-pixel layouts: home, map, chapter arrival, outing, representative projects, basket, book, album, garden, guide, and downloads. No broken HTML images or document overflow were observed.
- Decoded every bundled WebP artwork file, and checked all 31 object records against their recorded dimensions. Existing checksum tests cover the files.
- Added regression checks for the map’s story-first default, next unfinished place, completed-game destination, and the first slice of wide project artwork.

The release workflow also checks native Windows, universal Mac, Linux, and installation on Mint 22’s Ubuntu base. Checks on the Ubuntu bases do not represent every physical Mint device. No player saves were migrated or reset.

The phone map’s large-map toggle was checked in both directions. The large canvas was 1200 pixels wide; returning to the overview restored the selected-place card. Both Button’s finding activity and Pipkin’s song activity loaded at phone width without broken images or document overflow. All 76 automated checks and the local desktop startup diagnostic passed before tagging the release.
