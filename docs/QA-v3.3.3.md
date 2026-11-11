# Resume, recap, and instruction review

The additional review reproduced a reading-position bug: entering level 20 before finishing the journey replaced the saved reading page with an unavailable finale. Continue then led back to that preview. The same problem affected an early homeward-ride visit.

A shared reading-route check now accepts only real story, chapter, and outing destinations, and saves the finale/homeward route only after the nineteen chapters are complete. Existing unavailable saved bookmarks recover to the next unfinished chapter. The early-finale recap now says Glaloula is waiting at home rather than claiming the friends have already returned.

The mirror-reply project now asks for two strips that show what matters and how the frog feels, instead of referring to unseen spaces. Corrected “Sit with the badger” and matching carried-pattern link wording.

## Verification

- All 86 automated checks passed. The new regression covers a level-3 reading page surviving both unavailable ending previews, valid finale/homeward bookmarks after nineteen unique chapter completions, invalid routes, and duplicate completion entries.
- Reproduced the original resume problem in an isolated browser origin before editing.
- After the fix, visited level 3’s teaching page, previewed the unavailable finale, and used Continue to return to the same page. Repeated the check with an early homeward visit and a reload. Confirmed both pointer and keyboard resume.
- Opened Where were we on the unavailable finale and confirmed that its title and story describe a garden visit still to come.
- Retained the previous release’s completed journey checks; this patch changes bookmark eligibility and a few text labels, not the project rules or chapter ordering.

The Mint installation workflow now uses the same standard signed Ubuntu repository configuration that passed the independent exact-installer recheck, avoiding the runner mirror’s observed DNS failure. Signature verification remains required. Native packages and their startup checks are built and validated for the new version before website download links are published.
