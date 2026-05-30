---
name: quietfabric-design
description: Use this skill to generate well-branded interfaces and assets for QuietFabric, a calm technical design system for AI infrastructure (GPU clusters, model serving, distributed systems, observability). Use it for production UI or throwaway prototypes, mocks, decks, and architecture-review presentations. Contains essential design guidelines, colors, type, fonts, assets, UI kit components, and a reusable slide deck.
user-invocable: true
---

# QuietFabric Design System — Skill

QuietFabric is a calm, dark-first design language for AI infrastructure. **Invisible systems. Visible intelligence.**

Read `README.md` first — it contains the full system: content fundamentals (voice/tone), visual foundations, iconography, and an index of every file. Then explore the other files as needed.

## How to use this skill

- **Start with the tokens.** Import `fonts/fonts.css` then `colors_and_type.css` for the canonical color, type, spacing, radius, motion, and elevation variables, plus semantic type roles. Fonts: **Pretendard** (locked brand sans, self-hosted in `fonts/`) + **JetBrains Mono** (technical truth).
- **Lift real components.** The `ui_kits/` folders are hi-fi recreations you can copy from:
  - `ui_kits/observability/` — infra dashboard (metric tiles, topology, charts, terminal)
  - `ui_kits/console/` — developer control plane (services, tabs, live deploy + logs)
  - `ui_kits/docs/` — technical article / docs page
  - `ui_kits/marketing/` — landing hero + 4 reusable hero variants (product / executive / architecture / proposal)
  - Shared: `ui_kits/icons.jsx`, `ui_kits/charts.jsx`, `ui_kits/qf-base.css`
- **Make presentations.** `slides/` is a 23-slide architecture-review deck with **data-editable charts** (`QF_DECK_DATA`) and editable-PPTX export.
- **Brand assets.** `assets/quietfabric-mark.svg` (3-node topology mark), `assets/quiet-fabric-dark.png` (reference).

## When producing output

- **Visual artifacts** (slides, mocks, throwaway prototypes): copy the assets you need out of this skill and produce static HTML files for the user to view. Keep the dark canvas, hairline borders, reserved accents, mono for technical truth, and the calm/precise voice.
- **Production code**: copy assets and read the rules here to design as an expert in this brand.

If invoked without guidance, ask the user what they want to build, ask a few focused questions (surface, dark/light, content), then act as an expert QuietFabric designer who outputs HTML artifacts *or* production code.

## Non-negotiables
- Pretendard for sans, JetBrains Mono for code/IDs/metrics/logs.
- Dark is canonical; light is a documentation/specimen mode.
- No emoji in core UI. 1.5px line icons only. Gradients = signal flow, used sparingly.
- Calm, precise, technical voice. Confidence from clarity, not volume.

## Source
Reconstructed from the GitHub repo [`restack-ai/quite-fabric`](https://github.com/restack-ai/quite-fabric) and an uploaded live specimen. Explore that repo for deeper fidelity.

Bundled into this repository from [`restack-ai/quite-fabric-design-system`](https://github.com/restack-ai/quite-fabric-design-system) at commit `7e2f246c2736c47ec42e666f6d9522ce868d6f32`.
