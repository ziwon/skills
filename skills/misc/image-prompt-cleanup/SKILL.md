---
name: image-prompt-cleanup
description: >-
  Prevent image generation models from drawing visible numbers, labels, captions,
  watermarks, list markers, UI text, or explanatory annotations inside the image.
  Use when I ask to generate/draw an image and say "번호 빼줘", "넘버링 없이",
  "텍스트 없이", "라벨 빼고", "글자 넣지 마", or when the prompt contains numbered
  options that are instructions only and should not appear as visual elements.
---

# Image Prompt Cleanup

Rewrite image-generation prompts so instruction numbering stays outside the image.

## Procedure

1. Preserve the requested subject, composition, style, mood, camera/viewpoint, and output
   constraints.
2. Add a clear negative constraint:

   ```text
   No visible text, numbers, labels, captions, watermarks, list markers, UI annotations,
   diagrams, callouts, arrows, or explanatory overlays inside the image.
   ```

3. If the user provides numbered requirements, convert them into plain prose or comma
   separated visual constraints. Do not ask the image model to render numbered panels,
   labels, badges, captions, or legends.
4. If multiple variants are requested, describe them as separate generation requests or
   alternatives in the prompt text, not as a numbered grid inside one image.
5. If text is actually the subject (poster, UI mockup, typography, comic speech bubble),
   ask for confirmation before removing it. Default recommendation: keep the subject,
   remove decorative/annotation text.

## Prompt Pattern

```text
<positive visual prompt>.

No visible text, numbers, labels, captions, watermarks, list markers, UI annotations,
diagrams, callouts, arrows, or explanatory overlays inside the image.
```

## Guardrails

- Do not remove meaningful visual requirements just because they were listed numerically.
- Do not promise perfect text avoidance; say it reduces the chance of visible text.
- For diagrams, charts, UI mockups, comics, or educational figures, clarify whether the
  user wants all text removed or only numbering/labels removed.
