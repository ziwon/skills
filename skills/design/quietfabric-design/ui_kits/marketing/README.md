# QuietFabric UI Kit — Marketing Landing / Heroes

A hi-fi recreation of the QuietFabric platform landing page, built around the signature topology hero. Dark-first, with a light toggle. **Feels like an AI infrastructure platform, not consumer SaaS.**

## Open
`index.html` — landing page (nav, hero, feature grid, footer) with a **hero variant switcher**.

## Reusable hero sections
The `Hero` component renders four reusable variants from `HERO_VARIANTS` — switch them live in the header:
- **product overview** — "Invisible systems. Visible intelligence." platform hero
- **executive** — board-ready executive-presentation hero (spend, utilization, SLO)
- **architecture review** — end-to-end route/topology hero
- **technical proposal** — capacity-model / rollout proposal hero

Each variant supplies eyebrow, title, lead, two CTAs, three stat figures, and the topology-viz labels — so you can drop a QuietFabric hero into a deck cover, a proposal, or a microsite by swapping the data object.

## Files
- `index.html` — composition + variant/theme state.
- `Heroes.jsx` — `Hero`, `TopologyViz` (animated node-link SVG), `HERO_VARIANTS` (exposed as `window.QFMkt`).
- `styles.css` — nav, hero, switcher, features, footer (imports `../qf-base.css`).
- Shared: `../icons.jsx`.
