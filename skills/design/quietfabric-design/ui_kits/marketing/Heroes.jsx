/* Marketing kit — reusable heroes + topology visual. window.QFMkt.* */
const Icon = window.QFIcon;

/* Animated node-link topology graph (the QuietFabric signature visual) */
function TopologyViz({ label = "fabric.route", region = "gpu-east-03", stat = "p95 18ms" }) {
  const nodes = [
    { x: 86, y: 78, r: 5, c: "#6E8BFF" },
    { x: 250, y: 120, r: 6, c: "#53D0C5" },
    { x: 158, y: 210, r: 5, c: "#8B6DFF" },
    { x: 320, y: 64, r: 4, c: "#6E8BFF" },
    { x: 360, y: 188, r: 5, c: "#53D0C5" },
  ];
  const edges = [[0,1],[1,4],[2,1],[0,2],[3,1]];
  return (
    <div className="viz">
      <div className="grid"></div>
      <svg viewBox="0 0 440 280" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {edges.map(([a,b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
            stroke="url(#qfedge)" strokeWidth="1.2" opacity="0.55" />
        ))}
        <defs>
          <linearGradient id="qfedge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#53D0C5" /><stop offset="0.5" stopColor="#6E8BFF" /><stop offset="1" stopColor="#8B6DFF" />
          </linearGradient>
        </defs>
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r + 5} fill={n.c} opacity="0.14" />
            <circle cx={n.x} cy={n.y} r={n.r} fill={i === 1 ? "var(--canvas)" : n.c} stroke={n.c} strokeWidth="1.5" />
            {i === 1 && <circle cx={n.x} cy={n.y} r="2.5" fill={n.c}><animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" /></circle>}
          </g>
        ))}
        <circle r="3" fill="#53D0C5">
          <animateMotion dur="3.4s" repeatCount="indefinite" path="M86,78 L250,120 L360,188" />
        </circle>
      </svg>
      <div className="label">{label} <span className="r">/ {region}</span></div>
      <div className="stat">{stat}</div>
    </div>
  );
}

/* Reusable hero. variant supplies eyebrow / title / lead / primary / secondary / viz props */
function Hero({ v }) {
  return (
    <section className="hero">
      <div>
        <div className="eyebrow">{v.eyebrow}</div>
        <h1 dangerouslySetInnerHTML={{ __html: v.title }} />
        <p className="lead">{v.lead}</p>
        <div className="actions">
          <a className="btn btn-primary" href="#">{v.primary} →</a>
          <a className="btn btn-secondary" href="#">{v.secondary}</a>
        </div>
        <div className="trust">
          {v.stats.map((s, i) => <div className="item" key={i}><b>{s.v}</b>{s.k}</div>)}
        </div>
      </div>
      <TopologyViz {...v.viz} />
    </section>
  );
}

const HERO_VARIANTS = {
  product: {
    eyebrow: "AI Infrastructure Platform",
    title: "Invisible systems.<br>Visible intelligence.",
    lead: "QuietFabric is the control plane for compute fabrics, model serving, and observability — the calm layer beneath modern intelligence.",
    primary: "Explore the platform", secondary: "Read DESIGN.md",
    stats: [{ v: "400G", k: "fabric bandwidth" }, { v: "8×B200", k: "per pool" }, { v: "142d", k: "route uptime" }],
    viz: { label: "fabric.route", region: "gpu-east-03", stat: "p95 18ms" },
  },
  exec: {
    eyebrow: "Executive Presentation",
    title: "The infrastructure<br>behind every token.",
    lead: "A calm, board-ready view of the AI platform: what we run, what it costs, and why it stays reliable at scale.",
    primary: "Open the briefing", secondary: "Download deck",
    stats: [{ v: "$1.2M", k: "quarterly spend" }, { v: "71%", k: "GPU utilization" }, { v: "3", k: "regions" }],
    viz: { label: "platform.summary", region: "fy26-q2", stat: "99.95% slo" },
  },
  architecture: {
    eyebrow: "Architecture Review",
    title: "Routing the signal<br>path, end to end.",
    lead: "From edge ingress through fabric routing to GPU scheduling and token streaming — every hop, budget, and trade-off in one topology.",
    primary: "Walk the topology", secondary: "View ADRs",
    stats: [{ v: "4", k: "route stages" }, { v: "2.1ms", k: "ingress p50" }, { v: "ecn", k: "congestion" }],
    viz: { label: "inference.route", region: "edge→pool", stat: "ttft 38ms" },
  },
  proposal: {
    eyebrow: "Technical Proposal",
    title: "A fabric built<br>for what you run.",
    lead: "A concrete proposal for your serving workload: topology, capacity model, rollout plan, and the operational guarantees behind it.",
    primary: "Review the proposal", secondary: "See capacity model",
    stats: [{ v: "16", k: "max replicas" }, { v: "126", k: "tok/s / pool" }, { v: "<60ms", k: "ttft target" }],
    viz: { label: "proposal.fabric", region: "phase-1", stat: "rps 1.2k" },
  },
};

window.QFMkt = { Hero, TopologyViz, HERO_VARIANTS };
