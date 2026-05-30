/* Observability kit — shell + widgets. Exposes window.QFObs.* */
const { useState } = React;
const Icon = window.QFIcon;

function Sidebar({ active, setActive }) {
  const nav = [
    { grp: "fabric" },
    { id: "overview", label: "Overview", icon: "grid" },
    { id: "topology", label: "Topology", icon: "network", count: "12" },
    { id: "routes", label: "Routes", icon: "route", count: "38" },
    { grp: "compute" },
    { id: "gpu", label: "GPU pools", icon: "cpu", count: "8" },
    { id: "serving", label: "Model serving", icon: "box" },
    { id: "storage", label: "Storage", icon: "database" },
    { grp: "operate" },
    { id: "logs", label: "Logs", icon: "terminal" },
    { id: "alerts", label: "Alerts", icon: "bell", count: "2" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];
  return (
    <aside className="side">
      <div className="brand">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
          <line x1="7" y1="9" x2="20" y2="9" stroke="#33405A" strokeWidth="1.5"/>
          <line x1="20" y1="9" x2="13" y2="23" stroke="#33405A" strokeWidth="1.5"/>
          <circle cx="7" cy="9" r="3" fill="#6E8BFF"/><circle cx="20" cy="9" r="3" fill="#53D0C5"/><circle cx="13" cy="23" r="3" fill="#8B6DFF"/>
        </svg>
        <span className="wm">QuietFabric</span>
      </div>
      {nav.map((it, i) => it.grp
        ? <div className="navgrp" key={i}>{it.grp}</div>
        : <div key={i} className={"nav" + (active === it.id ? " active" : "")} onClick={() => setActive(it.id)}>
            <Icon name={it.icon} size={16} />
            <span>{it.label}</span>
            {it.count && <span className="count">{it.count}</span>}
          </div>
      )}
      <div className="spacer"></div>
      <div className="region"><Icon name="shield" size={14} color="var(--quiet-cyan)" /> gcp · asia-northeast3</div>
    </aside>
  );
}

function TopBar({ title, crumb }) {
  return (
    <div className="topbar">
      <h1>{title}</h1>
      <span className="crumb">{crumb}</span>
      <span className="grow"></span>
      <div className="search"><Icon name="search" size={14} /> Search routes, pods, nodes…</div>
      <button className="btn btn-primary"><Icon name="zap" size={14} color="#fff" /> Deploy route</button>
    </div>
  );
}

function Tile({ value, unit, label, delta, dir, spark, color }) {
  return (
    <div className="tile">
      <div className="val">{value}<span className="u">{unit}</span></div>
      <div className="lab">{label}</div>
      {delta && <div className={"delta " + (dir === "down" ? "down" : "up")}>{dir === "down" ? "▼" : "▲"} {delta}</div>}
      {spark && <div style={{ marginTop: 12 }}><QFSparkline data={spark} width={150} height={26} color={color || "#6E8BFF"} /></div>}
    </div>
  );
}

function Panel({ title, meta, icon, children, right }) {
  return (
    <div className="panel">
      <div className="ph">
        {icon && <Icon name={icon} size={16} color="var(--quiet-cyan)" />}
        <span className="pt">{title}</span>
        <span className="grow"></span>
        {meta && <span className="meta">{meta}</span>}
        {right}
      </div>
      {children}
    </div>
  );
}

function InfraRow({ k, sub, v }) {
  return <div className="irow"><div className="k">{k}<small>{sub}</small></div><div className="v">{v}</div></div>;
}

/* Animated route topology */
function RouteTopology({ nodes, caption }) {
  return (
    <div style={{ position: "relative", background: "var(--canvas-soft)", border: "1px solid var(--hairline)",
      borderRadius: "var(--r-lg)", padding: "22px 18px 16px", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(83,208,197,0.72), rgba(110,139,255,0.46), transparent)" }}></div>
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", gap: 8 }}>
        <span style={{ position: "absolute", top: "50%", left: "8%", right: "8%", height: 1,
          background: "var(--route-line)", opacity: 0.4 }}></span>
        <span className="qf-signal"></span>
        {nodes.map((nd, i) => (
          <div key={i} style={{ position: "relative", zIndex: 1, flex: 1, textAlign: "center",
            background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "var(--r-md)", padding: "10px 11px" }}>
            <div style={{ fontSize: 12.5, fontWeight: 500 }}>{nd.name}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-subtle)", marginTop: 2 }}>{nd.meta}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12.5, color: "var(--ink-subtle)", marginTop: 13, fontStyle: "italic" }}>{caption}</div>
    </div>
  );
}

function Terminal({ name, lines }) {
  return (
    <div className="term">
      <div className="bar"><span className="d"></span><span className="d"></span><span className="d"></span><span className="nm">{name}</span></div>
      <div className="body" dangerouslySetInnerHTML={{ __html: lines }} />
    </div>
  );
}

window.QFObs = { Sidebar, TopBar, Tile, Panel, InfraRow, RouteTopology, Terminal };
