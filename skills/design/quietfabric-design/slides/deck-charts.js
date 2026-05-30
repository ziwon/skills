/* ============================================================
   QuietFabric deck — chart renderer (vanilla, SVG).
   Charts are DATA-EDITABLE: every number lives in QF_DECK_DATA
   (defined in index.html). Edit those arrays and the charts
   redraw on reload. Renders into <div data-chart="..."> hosts.
   ============================================================ */
(function () {
  const COLORS = ["#6E8BFF", "#53D0C5", "#8B6DFF", "#3DDC97", "#F5B756"];
  const FONT = "JetBrains Mono, monospace";

  function bounds(series, padFrac) {
    const all = series.flatMap(s => s.data);
    let min = Math.min(...all), max = Math.max(...all);
    if (min > 0 && min / max > 0.4) min = 0;            // baseline at 0 when sensible
    const pad = (max - min) * (padFrac || 0.1) || 1;
    return { min: min === 0 ? 0 : min - pad, max: max + pad };
  }

  function lineChart(host, cfg) {
    const W = 1180, H = cfg.height || 460, P = { t: 30, r: 40, b: 64, l: 96 };
    const series = cfg.series, xl = cfg.xLabels || [], unit = cfg.unit || "";
    const { min, max } = bounds(series, 0.12);
    const iw = W - P.l - P.r, ih = H - P.t - P.b, n = series[0].data.length;
    const X = i => P.l + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
    const Y = v => P.t + ih - ((v - min) / (max - min)) * ih;
    const ticks = 4, out = [];
    for (let i = 0; i <= ticks; i++) {
      const v = min + (i / ticks) * (max - min), y = Y(v);
      out.push(`<line x1="${P.l}" y1="${y}" x2="${W - P.r}" y2="${y}" stroke="var(--hairline)" stroke-width="1.5"/>`);
      out.push(`<text x="${P.l - 18}" y="${y + 9}" font-size="24" fill="var(--ink-faint)" text-anchor="end" font-family="${FONT}">${Math.round(v)}${unit}</text>`);
    }
    series.forEach((s, si) => {
      const c = s.color || COLORS[si % COLORS.length];
      const pts = s.data.map((v, i) => `${X(i)},${Y(v)}`).join(" ");
      if (cfg.area) out.push(`<polygon points="${P.l},${P.t + ih} ${pts} ${X(n - 1)},${P.t + ih}" fill="${c}" opacity="0.10"/>`);
      out.push(`<polyline points="${pts}" fill="none" stroke="${c}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>`);
      s.data.forEach((v, i) => out.push(`<circle cx="${X(i)}" cy="${Y(v)}" r="5" fill="var(--canvas)" stroke="${c}" stroke-width="2.5"/>`));
    });
    xl.forEach((lb, i) => { if (lb) out.push(`<text x="${X(i)}" y="${H - 22}" font-size="24" fill="var(--ink-faint)" text-anchor="middle" font-family="${FONT}">${lb}</text>`); });
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${out.join("")}</svg>`;
  }

  function barChart(host, cfg) {
    const W = 1180, H = cfg.height || 460, P = { t: 30, r: 40, b: 70, l: 96 };
    const data = cfg.data, labels = cfg.labels || [], unit = cfg.unit || "";
    const max = Math.max(...data) * 1.15 || 1;
    const iw = W - P.l - P.r, ih = H - P.t - P.b, bw = (iw / data.length) * 0.54;
    const X = i => P.l + (i + 0.5) * (iw / data.length);
    const Y = v => P.t + ih - (v / max) * ih, out = [];
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const v = (i / ticks) * max, y = Y(v);
      out.push(`<line x1="${P.l}" y1="${y}" x2="${W - P.r}" y2="${y}" stroke="var(--hairline)" stroke-width="1.5"/>`);
      out.push(`<text x="${P.l - 18}" y="${y + 9}" font-size="24" fill="var(--ink-faint)" text-anchor="end" font-family="${FONT}">${Math.round(v)}${unit}</text>`);
    }
    data.forEach((v, i) => {
      const c = (cfg.colors && cfg.colors[i]) || cfg.color || COLORS[0];
      out.push(`<rect x="${X(i) - bw / 2}" y="${Y(v)}" width="${bw}" height="${P.t + ih - Y(v)}" rx="6" fill="${c}" opacity="0.88"/>`);
      out.push(`<text x="${X(i)}" y="${Y(v) - 16}" font-size="24" fill="var(--ink-muted)" text-anchor="middle" font-family="${FONT}">${v}${unit}</text>`);
      if (labels[i]) out.push(`<text x="${X(i)}" y="${H - 24}" font-size="23" fill="var(--ink-faint)" text-anchor="middle" font-family="${FONT}">${labels[i]}</text>`);
    });
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${out.join("")}</svg>`;
  }

  function sparks() {
    document.querySelectorAll("[data-spark]").forEach(el => {
      const d = JSON.parse(el.getAttribute("data-spark")), max = Math.max(...d);
      el.innerHTML = d.map(v => `<i style="height:${(v / max) * 100}%"></i>`).join("");
    });
  }

  function renderAll() {
    const D = window.QF_DECK_DATA || {};
    document.querySelectorAll("[data-chart]").forEach(host => {
      const key = host.getAttribute("data-chart"), cfg = D[key];
      if (!cfg) return;
      if (cfg.type === "bar") barChart(host, cfg); else lineChart(host, cfg);
    });
    sparks();
  }

  window.QFDeckCharts = { renderAll };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderAll);
  else renderAll();
})();
