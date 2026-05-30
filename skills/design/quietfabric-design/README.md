# QuietFabric Design System

> **Invisible systems. Visible intelligence.**

QuietFabric is a **calm technical design language for AI infrastructure** — GPU clusters, model serving, distributed systems, network fabrics, observability platforms, and developer tooling. It is built for the people who maintain the layer beneath modern intelligence.

It is **not** a generic AI-startup style. It combines Linear-like structural discipline, Vercel-like developer clarity, Cursor-like AI-native editor surfaces, Carbon-like hierarchy for dense technical content, and Anthropic-like editorial calm.

The system should feel: **calm, deep, technical, precise, quietly futuristic, minimal but not empty.** It should feel like a control plane that has been running reliably for years.

- [Demo](https://restack-ai.github.io/quite-fabric-design-system/) 
- [Slides](https://restack-ai.github.io/quite-fabric-design-system/slides/) 
- [Components](https://restack-ai.github.io/quite-fabric-design-system/preview/) 

---

## Sources

This design system was reconstructed from materials the user supplied. The reader may or may not have access — links are stored for reference.

- **GitHub:** [`restack-ai/quite-fabric`](https://github.com/restack-ai/quite-fabric) — the canonical QuietFabric spec. Contains `DESIGN.md` (full system), `tokens/` (CSS variables + JSON tokens), and `examples/` (live dark/light specimen pages). **Explore this repo further to build higher-fidelity QuietFabric designs.**
- **Uploaded reference:** `uploads/quietfabric-design-system.html` — a refined single-page live specimen (color, type, components, cards, architecture surfaces).
- **Imported tokens:** `tokens/css-variables.css`, `tokens/quiet-fabric.tokens.json`.
- **Imported preview:** `assets/quiet-fabric-dark.png` (dark specimen screenshot).

### Font note (important)
The brand sans is **Pretendard (locked)**. The Pretendard `.otf` files referenced in the brief were **not delivered** to the project, so Pretendard is loaded from the official jsDelivr CDN (`fonts/fonts.css`). For fully offline use or font-embedded PPTX, drop the `.otf` files into `fonts/` and switch to local `@font-face`. The mono companion is **JetBrains Mono** (the original spec used Geist/Geist Mono; we substitute Pretendard for sans per the brief and JetBrains Mono — a close, freely-available match — for mono).

---

## Content Fundamentals

How QuietFabric writes. Copy is a first-class part of the system — it carries the same calm authority as the visuals.

**Voice:** Calm, precise, technical, reflective, architect-like. Minimal hype. It reads like notes from a senior infrastructure engineer who has operated the system in production, not a marketer.

**Tone & vibe:** Quietly confident. Confidence comes from *clarity, not volume*. Never breathless. The system "rewards attention" rather than demanding it.

**Person:** Largely impersonal / system-centric ("This note traces how…", "Live inference route across…"). Speaks *about the system* rather than *to the reader*. Avoids the chummy second-person "you" of consumer SaaS. First-person plural ("we") only sparingly, for editorial notes.

**Casing:**
- Headlines & titles: **sentence case** ("Routing the signal path", "Edge ingress to GPU pool"). Avoid Title Case.
- Eyebrows / section labels: **lowercase** or **UPPERCASE mono** ("AI INFRASTRUCTURE NOTES", "live dark specimen", "inference-route / live").
- Technical truth (commands, resource IDs, regions, metrics): **verbatim lowercase mono** (`gpu-east-03`, `kubectl get pods`, `asia-northeast3`).

**Emoji:** **None.** Avoid playful emoji-style icons in core UI. Use simple 1.5px line icons instead.

**Numbers & units:** Metrics are concrete and operational, with units set smaller/subtle: `38ms` TTFT, `126 tok/s`, `71%` GPU util, `400 Gbps`. Mono everywhere.

**Do write like this:**
> "QuietFabric explores the systems beneath modern intelligence: compute, networks, storage, observability, and the engineering patterns that keep them reliable."
> "Live inference route across edge ingress, fabric routing, GPU pool scheduling, and token streaming."
> "Route stable for 142d 06h — last reschedule 11m ago."

**Never write like this:**
> ~~"Supercharge your AI infra with next-gen revolutionary workflows."~~
> ~~"Build the future with magical AI-powered infrastructure."~~

---

## Visual Foundations

**Color & mood.** Dark-first — *dark because the system is the stage*, not for drama. Canvas is near-black blue (`#05070B`). Surfaces step up in cool blue-grey (`#0D111A → #121826 → #182033`). Text is a cool off-white (`#F4F7FA`) descending through three muted greys. Accents are reserved and meaningful: `fabric-blue` (CTA/links), `quiet-cyan` (network/fabric), `deep-violet` (AI/model), plus semantic `signal-green` / `event-amber` / `fault-red`. **Light mode is a documentation/specimen mode** — swatches stay canonical, only text contrast strengthens.

**Type.** Pretendard for structure; JetBrains Mono for technical truth (commands, IDs, versions, protocols, logs, metrics). Negative letter-spacing **only** on large display sizes (down to −2.6px at 72px). Body breathes at 1.65 line-height. Headings are weight 600, never heavier — no black/ultra weights.

**Spacing & layout.** 4px base unit. Generous section rhythm (96px sections, 144px hero). Max content 1200px; reading 760px; dashboards 1280px. Prefer **fewer, larger sections** over many small decorative blocks. Diagrams and code blocks are the visual anchors. Strong vertical rhythm; no random floating elements.

**Backgrounds.** Two ambient motifs, both *very low opacity*: (1) a faint **fabric grid** (64px lines at ~12% opacity), and (2) a slow-drifting **signal-flow gradient** (radial cyan/blue/violet glows at ~18–22% opacity). Gradients = signal flow, **not** decoration; never on every card. No bright cyberpunk imagery, no glass everywhere, no gradient blobs.

**Borders & cards.** Everything is bordered with a 1px `hairline` (`#222A3A`); focus/hover lifts to `hairline-strong` (`#33405A`). Cards = `surface-1` fill + hairline border + radius (14–18px). Featured cards add a faint top-down blue wash. Cards group content; they are not decoration.

**Corner radii.** sm 6 · md 10 (buttons) · lg 14 (cards, terminals) · xl 18 (architecture/feature cards) · full (badges/pills).

**Shadows / elevation.** Quiet and low-contrast — depth comes from surface steps and hairlines more than drop shadows. Glows are reserved for live signal nodes (`0 0 12px cyan`) and focus rings (`0 0 0 3px blue@26%`).

**Hover / press.** Cards: `translateY(-3px)` + border brightens to `hairline-strong` over 180ms. Primary button: `brightness(1.08)` + blue focus-glow ring. Secondary: surface + border brighten. Ghost: text brightens to ink + faint surface fill. Transitions use `cubic-bezier(0.4,0,0.2,1)`.

**Motion.** Subtle and purposeful only. `fast 120ms` (button hover), `base 180ms` (card hover), `slow 320ms` (section reveal, fade+rise), `ambient 8–16s` (background drift, signal pulses traveling along route lines). *If motion does not explain flow, state, or hierarchy, remove it.* No bounces.

**Transparency & blur.** Sticky header uses `backdrop-filter: blur(14px)` over a translucent canvas. `color-mix` for translucent accent washes and borders. Used restrained — not glassmorphism everywhere.

**Signature motifs.** Node-link topology diagrams (thin lines, small glowing nodes); animated signal pulses traveling a route; terminal/code surfaces (mono, traffic-light dots); metric tiles with mini bar-sparklines; route-strips with a gradient top hairline; infra context panels (key/value rows). These — the **Architecture Surfaces** — are first-class primitives, because QuietFabric is an *operating interface*, not a generic component library.

---

## Iconography

- **Style:** Simple **line icons, 1.5px stroke**, no fill (or fill only for small node circles). Geometric, minimal, calm. Themes: nodes, layers, routes, signals, streams, brackets, terminal, cube/grid, shield, graph, chip, database.
- **In-repo icons:** The source repo ships **no icon font or SVG sprite** — icons in the specimen are small inline hand-tuned SVGs (node-link glyph, layer stack, terminal bracket). The brand mark itself is a 3-node topology (`assets/quietfabric-mark.svg`).
- **Substitution (flagged):** For broad icon coverage in the UI kits and slides we use **[Lucide](https://lucide.dev)** via CDN — its 1.5px stroke, rounded-but-precise geometry matches QuietFabric exactly (network, cpu, server, activity, terminal, git-branch, database, layers, shield, gauge, etc.). This is a substitution, not from the source repo. *If you have a canonical icon set, swap it in.*
- **Emoji:** Never. **Unicode glyphs** used sparingly as inline marks (the list "—" bullet, route arrows "→").
- **Logo:** `assets/quietfabric-mark.svg` — three nodes (blue, cyan, violet) on `hairline-strong` connectors, works at favicon size. Pair with the wordmark "QuietFabric" in Pretendard 600.

---

## Index — what's in this folder

**Foundations**
- `colors_and_type.css` — canonical tokens (color, type scale, spacing, radius, motion, elevation) + semantic type roles + light-mode overrides. **Start here.**
- `fonts/fonts.css` — Pretendard (CDN) + JetBrains Mono (CDN) loading.
- `tokens/css-variables.css`, `tokens/quiet-fabric.tokens.json` — imported raw token exports from the source repo.

**Assets**
- `assets/quietfabric-mark.svg` — brand mark (3-node topology).
- `assets/quiet-fabric-dark.png` — dark specimen reference screenshot.

**Preview cards** (`preview/`) — small specimen cards that populate the Design System tab (colors, type, spacing, components, brand).

**UI kits** (`ui_kits/<product>/`) — hi-fi clickable recreations, one folder per surface:
- `observability/` — infra/observability dashboard (metrics, topology, terminal, route health)
- `console/` — developer console / control plane
- `docs/` — technical article / docs page
- `marketing/` — landing hero specimen + reusable hero sections

**Slides** (`slides/`) — 20–30 reusable QuietFabric presentation slides for AI infrastructure architecture reviews, with **data-editable charts** (line/time-series, bar, sparkline/metric tiles), dark + light, and **editable-PPTX/Keynote** export.

**Skill**
- `SKILL.md` — Agent-Skill-compatible entry point for reusing this system.

---

*QuietFabric · alpha · reconstructed from `restack-ai/quite-fabric`.*
