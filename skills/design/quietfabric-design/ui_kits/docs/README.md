# QuietFabric UI Kit — Docs / Technical Article

A hi-fi recreation of a QuietFabric documentation / field-note article page, following the DESIGN.md "Technical Article Layout" (eyebrow → title → lead → context → system model → design → trade-offs → failure modes → summary). Dark-first, with a light toggle.

## Open
`index.html` — three-column docs layout (doc tree · reading column · on-this-page TOC) with scroll-spy.

## Components shown
- Eyebrow + display title + lead + byline
- Numbered section headings
- Inline `code`, callouts, a syntax-highlighted code surface
- An architecture flow diagram (figure)
- Bulleted trade-off / failure lists

## Files
- `index.html` — plain HTML + a little JS (theme toggle, TOC scroll-spy).
- `styles.css` — docs chrome + article typography (imports `../qf-base.css`).

## Notes
- Reading column capped near the 760px reading width from the spec.
- Code highlighting is hand-classed spans (`.k`, `.s`, `.c`, `.fn`), not a real highlighter.
