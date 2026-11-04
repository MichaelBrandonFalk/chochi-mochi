# Version 2.2.0 verification

Checked the built static game on November 3, 2026.

- All 30 automated checks pass. New checks cover stored preference sanitation, independent presets, effective text-control fallbacks, direct wheel/garden/loom actions, and boat undo while preserving visits.
- Opened Comfort & Access as a native modal, changed reading and sensory options, closed with Escape, and reloaded. Settings persisted separately from existing game progress.
- Used larger text, plain font, more spacing, stronger contrast, plain backgrounds, and paragraph mode together. Existing 20 shining places and 21 outing versions remained present in the test save.
- Advanced the opening to paragraph two and reloaded; the paragraph position remained. Started page narration, paused it, and stopped it through the reading toolbar.
- Used direct wheel menus and checked keyboard focus after the update. Pressing Tab from wheel one reached wheel two. Used direct garden erase and checked the resulting plot label.
- Opened Take a break, reloaded on the same outing, and returned to the saved toy. The break dialog reopened on reload. Selected headphones as a support and checked its break-screen text.
- Turned on effects, selected Quiet, and checked that the sound status became All sound is off.
- Opened the recap and used Build this together with Chochi on a learning project.
- At a 390-pixel viewport (375 CSS pixels of content with the scrollbar), used the largest text, plain font, stronger contrast, hidden artwork, and the place list. Neither the document nor the settings dialog overflowed horizontally.
- Browser error logs were empty during the exercised settings and direct-control flows.

These checks do not establish WCAG conformance. VoiceOver, NVDA, physical switch access, forced-colors mode, and sessions with disabled children and adults still need dedicated end-to-end evaluation. Speech behavior and voices vary by browser.
