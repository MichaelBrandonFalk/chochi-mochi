# Sound panel layout check

The expanded header could wrap Sound onto a new row while its panel remained anchored to the button’s right edge. At a 1280-pixel viewport this put the panel’s left edge at about -146 pixels.

The panel now anchors to the header, remains inside the horizontal viewport, and scrolls internally when space is short. Browser checks confirmed bounds of 901–1241 pixels at 1280×720, and 19–359 pixels at 390×844. Its bottom remained inside the viewport at both tested sizes. Keyboard music controls and quiet preferences were checked in the soundtrack update. All 74 automated checks still pass.

No recordings, notes, saved progress, or music preferences changed in this layout patch.
