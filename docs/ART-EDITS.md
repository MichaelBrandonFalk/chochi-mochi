# Storybook artwork corrections

## Finishing celebration, v3.8.0

November 17, 2026. Built-in image_gen, reference-guided generation mode. The existing garden painting supplied style and character references. This is a new ending image, with no fixed furniture, lanterns, food, or travelling companion painted into it; the game supplies chosen decorations separately.

Saved assets:
- assets/storybook/celebration-homecoming.webp
- assets/storybook/celebration-homecoming-small.webp

Inspected the three characters, book, hands and hooves, flower border, and empty foreground. Preserved the generated original and converted project WebP variants for responsive loading.

### Exact generation prompt

> Use case: illustration-story. Asset type: a NEW final celebration painting for the Chochi Mochi browser storybook game. Input image is a STYLE AND CHARACTER REFERENCE, not an edit target. Create a fresh landscape 1536 by 1024 classic children's storybook watercolor with the same delicate ink outlines, paper texture, detailed flower border and calm pastel sage, lilac, cream and pale peach colors. Show exactly three familiar friends together outside Glaloula's purple bluebell-shaped cottage: Chochi, the small friendly green dinosaur with pale belly and two short arms; Mochi, the cream unicorn with purple mane, one horn and brown saddlebag; and Glaloula, the young fairy with brown curly hair, clear delicate wings and a purple dress. They are joyfully showing their finished journey book to each other, with warm smiles and a gentle sense of a treasured adventure completed. Keep faces and anatomy consistent with the reference. A few soft flower petals make the garden feel festive, no fireworks. Important practical composition: no furniture, no picnic table, no picnic cloth, no food, no lanterns, no boat, no other guests, no snail or robin. Those are variable player choices and will be added separately by the game. Keep the three friends together in the middle-upper portion, with an uncluttered flower-lined grassy foreground across the lower quarter to leave room for the game's chosen decorations outside the artwork. Do not paint any words, lettering, numbers, logo or watermark. Cozy, peaceful, quietly magical, unmistakably a special happy ending; no digital glow, no plastic 3D styling, no confetti storm. Preserve the fine painted detail and natural watercolor softness of the reference.


## Mirror Pool reflection, v3.6.0

November 12, 2026. Used the built-in image_gen tool in edit mode, with the original Mirror Pool painting as the sole edit target. Visually checked that both short arms and hands appear in Chochi the Dinosaur’s reflection and that the composition, characters, decorative frame, and pastel watercolor style remain consistent.

Project assets:

- `assets/storybook/04-mirror-pool-v2.webp`, 1536 × 1024, WebP quality 86.
- `assets/storybook/04-mirror-pool-v2-small.webp`, 768 × 512, WebP quality 82.

The game uses the revised filename so browsers do not keep showing a cached copy of the old reflection. The manifest records the revised image checksum. The earlier files remain available for old cached builds. The generated PNG is preserved locally at `output/art/mirror-pool-reflection-v2.png`; optimized WebP assets are included in the game and offline downloads.

### Exact edit prompt

> Use case: precise-object-edit. Edit target: the supplied Mirror Pool storybook painting for Chochi Mochi. Change ONLY Chochi the Dinosaur's reflection in the lower-left part of the pond. The green dinosaur standing on the left bank has two short arms with small hands. His reflection is missing an arm. Repair the reflected dinosaur so that BOTH short arms and hands are visible in the correct mirrored positions and match the standing dinosaur's pose, proportions, anatomy, and pale belly. Keep a natural, slightly rippled water reflection. Do not add extra arms. Keep the standing dinosaur unchanged. Preserve Mochi the Unicorn, her reflection, Moss the frog and cup, their reflections, the pond, flowers, reeds, rocks, ornamental border, exact framing and composition. Preserve the existing delicate classic children's storybook watercolor technique, fine ink detail, peaceful pastel palette, lighting, and image quality. No new objects, writing, watermark, stylistic change, crop, or layout change. Keep the 1536 by 1024 landscape composition. This is a tiny anatomical correction to the dinosaur's reflection, not a new illustration.
