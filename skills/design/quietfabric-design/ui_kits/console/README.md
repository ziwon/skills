# QuietFabric UI Kit — Developer Console / Control Plane

A hi-fi recreation of a QuietFabric control plane for deploying and operating model-serving services. Dark-first, with a light toggle.

## Open
`index.html` — interactive console. Select a service in the rail, switch tabs (overview / logs / config / routes), and click **Deploy** to watch a canary rollout animate with a streaming log tail.

## Files
- `index.html` — full app (service rail, detail tabs, animated deploy + log stream).
- `styles.css` — top nav, service rail, detail, tabs, log stream, deploy bar (imports `../qf-base.css`).
- Shared: `../icons.jsx`, `../charts.jsx`.

## Notes
- The deploy flow is a scripted fake (progress + log steps) — cosmetic, not real.
- Latency chart on the overview tab is data-editable via `QFLineChart`.
