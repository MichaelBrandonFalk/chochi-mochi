# Fourth quality and consistency review: v2.9.4

Reviewed November 5, 2026.

## Findings and fixes

- Effects volume was captured when a tune was scheduled, so changing the control did not change notes already playing. Existing sound-effect players also retained their previous volume. Active notes now pass through a shared volume gain, and both sound-setting panels update active output immediately. The tune’s timing and visual score continue when volume becomes zero.
- Hidden-art and large-control settings opened older direct controls but left Button’s text finding list collapsed. The same settings now open that list automatically, including after reload.
- The companion chooser now uses a main heading on its own outing page and a subordinate heading when embedded within a chapter.

## Verification

- All 63 automated tests pass. Three new tests exercise the actual audio controller with a Web Audio and DOM adapter, without playing sound or touching browser saves: change active note volume to zero and restore it without restarting, change active sound-effect volume, and turn effects off to stop both.
- Browser: changed the header effects-volume slider during Watch our tune. The control reached zero, the sound-off notice appeared, and the visual tune continued. The audio regression tests verify the output gain behavior.
- Browser: hiding illustrations immediately revealed all six word-based finding controls. Reload retained the setting and the open list. The picture stage stayed hidden.
- Browser: at 390 × 844 with largest text, hidden pictures, and the word list open, the 375-pixel content viewport had no horizontal overflow. All six finding buttons remained available through normal vertical scrolling. Viewport and changed reading settings were restored afterward.
- Browser fixture: the standalone companion chooser has a level-one heading. Its embedded markup uses a level-two heading.
- No browser console errors in the checked flows. Production build succeeds. No image or music asset files were changed.

## Limits

This pass adds audio-controller and sensory-control checks to the earlier review reports. It does not replace testing with assistive-technology users or constitute a clinical or WCAG certification.
