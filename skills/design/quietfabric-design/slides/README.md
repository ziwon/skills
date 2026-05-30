# QuietFabric — AI Infrastructure Architecture Review (deck)

A reusable 23-slide executive presentation system in the QuietFabric language, for **architecture reviews, technical proposals, product overviews, and executive briefings**. Dark-first with a live light toggle (top-right).

## Open
`index.html` — full deck. Navigate with ←/→, Space, or the thumbnail rail. Press the **dark/light** pill (top-right) to switch theme. Print → Save as PDF gives one page per slide.

## Reusable slide templates included
Cover · Agenda · Section divider · Executive summary (metric tiles) · System-at-a-glance (route topology) · Architecture stack (layered) · Line chart · Bar chart · Utilization tiles (sparklines) · Route detail · Fabric table + terminal · Two-column trade-offs · SLO tiles + table · Failure-modes list · Capacity line chart · Cost bar + table · Recommendation / ADR card · Risks & next steps · Closing quote.

## Data-editable charts
**All chart numbers live in one place** — the `window.QF_DECK_DATA` object near the bottom of `index.html`. Edit the arrays and the charts redraw on reload:
- `latency` — line (TTFT p50 / p95 over 12h)
- `pools` — bar (throughput by GPU pool)
- `demand` — line (capacity vs projected demand)
- `cost` — bar (quarterly spend by component)
- Sparklines are inline `data-spark="[…]"` attributes on the utilization tiles.

`deck-charts.js` reads that object and renders SVG into each `<div data-chart="key">`. Charts inherit theme colors via CSS variables, so they restyle automatically in light mode.

## Files
- `index.html` — slides (static, directly editable) + `QF_DECK_DATA` + chrome script (brand mark, slide numbers, cover topology, theme toggle).
- `deck.css` — slide system (imports `../fonts/fonts.css` + `../colors_and_type.css`).
- `deck-charts.js` — vanilla SVG chart renderer.
- `deck-stage.js` — deck shell (scaling, nav, thumbnails, print).

## Export to editable PPTX / Keynote
The deck exports to **native, editable PowerPoint** (text boxes + shapes), which Keynote opens directly:
1. Open `slides/index.html` in the preview.
2. Run the **Export as PPTX (editable)** flow at 1920×1080, one entry per `section`, navigating with `document.querySelector('deck-stage').goTo(n)`.

**Caveat on charts:** editable-PPTX export emits the charts as vector **shapes/images**, not native PowerPoint chart objects. The data-edit point for charts is `QF_DECK_DATA` in the HTML (re-export after editing). Text, titles, tiles, tables, and the topology diagrams come through as fully editable PowerPoint text/shapes. For Korean text to render in the exported file, install **Pretendard** locally (the fonts are in `../fonts/`).
