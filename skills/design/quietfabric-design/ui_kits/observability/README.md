# QuietFabric UI Kit — Observability Dashboard

A hi-fi recreation of a QuietFabric infrastructure/observability dashboard. Dark-first, with a light toggle.

## Open
`index.html` — full interactive dashboard (sidebar nav, metric tiles, throughput line chart, live route topology, GPU bar chart, terminal, infra panel).

## Files
- `index.html` — composition + app state (nav selection, theme toggle).
- `Widgets.jsx` — `Sidebar`, `TopBar`, `Tile`, `Panel`, `InfraRow`, `RouteTopology`, `Terminal` (exposed as `window.QFObs`).
- `styles.css` — layout + component styles (imports `../qf-base.css`).
- Shared: `../icons.jsx` (`window.QFIcon`), `../charts.jsx` (`window.QFLineChart`, `QFBarChart`, `QFSparkline`).

## Notes
- All charts are **data-editable** — change the arrays passed to `QFLineChart`/`QFBarChart`/`Tile spark`.
- Icons are Lucide-style 1.5px line icons (substitution — see root README → Iconography).
