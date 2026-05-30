/* QuietFabric shared charts — lightweight SVG, no deps.
   window.QFLineChart, QFBarChart, QFSparkline, QFAreaChart. */

function _bounds(series) {
  const all = series.flatMap(s => s.data);
  const min = Math.min(...all), max = Math.max(...all);
  const pad = (max - min) * 0.12 || 1;
  return { min: min - pad, max: max + pad };
}
const QF_SERIES_COLORS = ["#6E8BFF", "#53D0C5", "#8B6DFF", "#3DDC97", "#F5B756"];

/* Multi-series line chart with grid + optional area fill */
function QFLineChart({ series, width = 640, height = 240, pad = { t: 16, r: 16, b: 28, l: 40 },
  yTicks = 4, xLabels = [], area = false, unit = "" }) {
  const { min, max } = _bounds(series);
  const iw = width - pad.l - pad.r, ih = height - pad.t - pad.b;
  const n = series[0].data.length;
  const x = i => pad.l + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
  const y = v => pad.t + ih - ((v - min) / (max - min)) * ih;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => min + (i / yTicks) * (max - min));
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }} fontFamily="var(--font-mono)">
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={pad.l} y1={y(t)} x2={width - pad.r} y2={y(t)} stroke="var(--hairline)" strokeWidth="1" />
          <text x={pad.l - 8} y={y(t) + 3} fontSize="10" fill="var(--ink-faint)" textAnchor="end">{Math.round(t)}{unit}</text>
        </g>
      ))}
      {series.map((s, si) => {
        const c = s.color || QF_SERIES_COLORS[si % QF_SERIES_COLORS.length];
        const pts = s.data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
        const areaPts = `${pad.l},${pad.t + ih} ${pts} ${x(n - 1)},${pad.t + ih}`;
        return (
          <g key={si}>
            {area && <polygon points={areaPts} fill={c} opacity="0.10" />}
            <polyline points={pts} fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {s.data.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill="var(--canvas)" stroke={c} strokeWidth="1.5" />)}
          </g>
        );
      })}
      {xLabels.map((lb, i) => (
        <text key={i} x={x(i)} y={height - 8} fontSize="10" fill="var(--ink-faint)" textAnchor="middle">{lb}</text>
      ))}
    </svg>
  );
}

/* Grouped/single bar chart */
function QFBarChart({ data, labels = [], width = 640, height = 240, pad = { t: 16, r: 16, b: 28, l: 40 },
  yTicks = 4, color = "#6E8BFF", unit = "" }) {
  const max = Math.max(...data) * 1.15 || 1;
  const iw = width - pad.l - pad.r, ih = height - pad.t - pad.b;
  const bw = (iw / data.length) * 0.56;
  const x = i => pad.l + (i + 0.5) * (iw / data.length);
  const y = v => pad.t + ih - (v / max) * ih;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => (i / yTicks) * max);
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }} fontFamily="var(--font-mono)">
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={pad.l} y1={y(t)} x2={width - pad.r} y2={y(t)} stroke="var(--hairline)" strokeWidth="1" />
          <text x={pad.l - 8} y={y(t) + 3} fontSize="10" fill="var(--ink-faint)" textAnchor="end">{Math.round(t)}{unit}</text>
        </g>
      ))}
      {data.map((v, i) => (
        <g key={i}>
          <rect x={x(i) - bw / 2} y={y(v)} width={bw} height={pad.t + ih - y(v)} rx="3" fill={color} opacity="0.85" />
          {labels[i] && <text x={x(i)} y={height - 8} fontSize="10" fill="var(--ink-faint)" textAnchor="middle">{labels[i]}</text>}
        </g>
      ))}
    </svg>
  );
}

/* Inline sparkline (bars) */
function QFSparkline({ data, width = 96, height = 26, color = "#6E8BFF" }) {
  const max = Math.max(...data) || 1;
  const bw = width / data.length;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {data.map((v, i) => (
        <rect key={i} x={i * bw + 1} y={height - (v / max) * height} width={bw - 2}
          height={(v / max) * height} rx="1" fill={color} opacity="0.55" />
      ))}
    </svg>
  );
}

Object.assign(window, { QFLineChart, QFBarChart, QFSparkline });
