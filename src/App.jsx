import { useState, useMemo, useEffect } from "react";
import { FRAMEWORKS, CATEGORIES, EXCLUSION_REASONS, TIER_BOUNDARIES } from "./data/frameworks";
import { FUNDS, NAMING_NOTE, getFund } from "./data/funds";

// Equiton brand palette
const EQ = {
  navy:       "#1e3a5f",
  navyLight:  "#3d4a6a",
  gold:       "#c9a020",
  goldLight:  "#f5edd6",
  white:      "#ffffff",
  surface:    "#f4f5f8",
  border:     "#dde0ea",
  borderDark: "#c8ccd8",
  textMuted:  "#7a8099",
};

const TIER_COLORS = {
  1: { color: "var(--tier1-color)", bg: "var(--tier1-bg)", label: "Low" },
  2: { color: "var(--tier2-color)", bg: "var(--tier2-bg)", label: "Low-Med" },
  3: { color: "var(--tier3-color)", bg: "var(--tier3-bg)", label: "Medium" },
  4: { color: "var(--tier4-color)", bg: "var(--tier4-bg)", label: "Med-High" },
  5: { color: "var(--tier5-color)", bg: "var(--tier5-bg)", label: "High" },
};

const TIER_LABEL_INDEX = { "Low": 1, "Low-Medium": 2, "Medium": 3, "Medium-High": 4, "High": 5 };

function tierFromLabel(label) {
  const idx = TIER_LABEL_INDEX[label] ?? 3;
  const tc = TIER_COLORS[idx];
  return { label: `${label} Risk`, color: tc.color, bg: tc.bg };
}

// Tier classification for CRS values that don't match a fund's document-stated
// rating exactly (e.g. after an analyst edits scores) — uses the source
// document's own published tier-boundary table (Low: 1.00–1.50, Low-Medium:
// 1.51–2.50, Medium: 2.51–3.00, Medium-High: 3.01–3.50, High: 3.51–5.00).
function getTier(crs) {
  const match = TIER_BOUNDARIES.find(b => crs <= b.max) || TIER_BOUNDARIES[TIER_BOUNDARIES.length - 1];
  return tierFromLabel(match.label);
}

const TIER_REF_ROWS = [
  ["1.00 – 1.50", "Low"],
  ["1.51 – 2.50", "Low-Medium"],
  ["2.51 – 3.00", "Medium"],
  ["3.01 – 3.50", "Medium-High"],
  ["3.51 – 5.00", "High"],
];

function GaugeArc({ crs, tier }) {
  const score = Math.min(Math.max(crs, 0), 5);
  const pct   = score / 5;
  const angle = -135 + pct * 270;

  const cx = 130, cy = 104, r = 83, sw = 16;

  const pt = (deg, rad) => [
    cx + rad * Math.cos((deg * Math.PI) / 180),
    cy + rad * Math.sin((deg * Math.PI) / 180),
  ];

  const arcPath = (s, e, rad) => {
    const [ax, ay] = pt(s, rad);
    const [bx, by] = pt(e, rad);
    return `M ${ax} ${ay} A ${rad} ${rad} 0 ${e - s > 180 ? 1 : 0} 1 ${bx} ${by}`;
  };

  const zones = [
    { s: -135, e:  -81, color: "var(--tier1-color)" },
    { s:  -81, e:  -27, color: "var(--tier2-color)" },
    { s:  -27, e:   27, color: "var(--tier3-color)" },
    { s:   27, e:   81, color: "var(--tier4-color)" },
    { s:   81, e:  135, color: "var(--tier5-color)" },
  ];

  const boundaries = [-81, -27, 27, 81];
  const [nx, ny]   = pt(angle, r - 17);
  const [bkx, bky] = pt(angle + 180, 19);

  return (
    <svg viewBox="0 0 260 200" style={{ width: "100%", maxWidth: 280, display: "block", margin: "0 auto" }}>

      {/* Track background */}
      <path d={arcPath(-135, 135, r)} fill="none" stroke="var(--gauge-track)" strokeWidth={sw + 6} strokeLinecap="butt" />

      {/* Zone arcs — segmented background */}
      {zones.map((z, i) => (
        <path key={i} d={arcPath(z.s + 1.5, z.e - 1.5, r)} fill="none" stroke={z.color} strokeWidth={sw} opacity={0.22} />
      ))}

      {/* Active arc — soft glow layer */}
      {score > 0 && (
        <path d={arcPath(-135, angle, r)} fill="none" stroke={tier.color} strokeWidth={sw + 12} strokeLinecap="round" opacity={0.12} />
      )}

      {/* Active arc */}
      {score > 0 && (
        <path d={arcPath(-135, angle, r)} fill="none" stroke={tier.color} strokeWidth={sw} strokeLinecap="round" />
      )}

      {/* Zone boundary tick marks */}
      {boundaries.map((deg, i) => {
        const [x1, y1] = pt(deg, r - sw / 2 - 1);
        const [x2, y2] = pt(deg, r + sw / 2 + 1);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={2.5} opacity={0.9} />;
      })}

      {/* Needle counterbalance */}
      <line x1={cx} y1={cy} x2={bkx} y2={bky} stroke={tier.color} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />

      {/* Needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={tier.color} strokeWidth={2} strokeLinecap="round" />

      {/* Hub — outer ring */}
      <circle cx={cx} cy={cy} r={10} fill="white" stroke={tier.color} strokeWidth={2.5} />
      {/* Hub — inner fill */}
      <circle cx={cx} cy={cy} r={5} fill={tier.color} />

      {/* Score value */}
      <text x={cx} y={cy + 38} textAnchor="middle" fontSize={30} fontWeight={700} fill={tier.color} fontFamily="Inter,Helvetica Neue,Arial,sans-serif">
        {score.toFixed(2)}
      </text>
      <text x={cx} y={cy + 53} textAnchor="middle" fontSize={9} fill="var(--text-muted)" fontFamily="sans-serif" letterSpacing="0.5">
        OF 5.00
      </text>
    </svg>
  );
}

function CriteriaTable({ criteria, selectedScore }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 0, fontSize: 11, fontFamily: "sans-serif" }}>
      <thead>
        <tr style={{ background: "var(--card-header-bg)" }}>
          <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 700, color: "#ffffff", fontSize: 10, letterSpacing: ".08em", width: 52 }}>SCORE</th>
          <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 700, color: "#ffffff", fontSize: 10, letterSpacing: ".08em", width: 70 }}>TIER</th>
          <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 700, color: "#ffffff", fontSize: 10, letterSpacing: ".08em" }}>CRITERIA</th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3, 4, 5].map(v => {
          const tc = TIER_COLORS[v];
          const isSelected = v === selectedScore;
          return (
            <tr
              key={v}
              style={{
                background: isSelected ? tc.bg : "transparent",
                borderTop: "1px solid var(--border)",
              }}
            >
              <td style={{ padding: "7px 10px", fontWeight: isSelected ? 700 : 400, color: isSelected ? tc.color : "var(--text-mid)", verticalAlign: "top" }}>{v}</td>
              <td style={{ padding: "7px 10px", fontWeight: isSelected ? 700 : 400, color: isSelected ? tc.color : "var(--text-mid)", verticalAlign: "top", whiteSpace: "nowrap" }}>{tc.label}</td>
              <td style={{ padding: "7px 10px", fontWeight: isSelected ? 600 : 400, color: isSelected ? "var(--text)" : "var(--text-mid)", verticalAlign: "top", lineHeight: 1.5 }}>{criteria[v - 1]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        position: "relative",
        width: 36,
        height: 20,
        borderRadius: 10,
        border: "none",
        background: on ? EQ.gold : "#c8ccd8",
        cursor: "pointer",
        padding: 0,
        flexShrink: 0,
        transition: "background .2s ease",
      }}
    >
      <span style={{
        position: "absolute",
        top: 2,
        left: on ? 18 : 2,
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "#fff",
        transition: "left .2s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,.5)",
      }} />
    </button>
  );
}

// Category display order, split into two UI columns for the factor-configuration panel.
const CATEGORY_ORDER = ["Structural", "Financial", "Portfolio", "Governance", "Performance"];
const CATEGORY_COLUMNS = [
  ["Structural", "Financial", "Portfolio"],
  ["Governance", "Performance"],
];

// Builds the per-fund editable state (scores/enabled/reasons/notes), seeded from
// the document-sourced defaults in data/funds.js so every fund opens showing the
// source document's own assessment, fully editable from there.
function buildInitialFundState(fund) {
  const factorNames = Object.keys(fund.defaultScores);
  return {
    scores: { ...fund.defaultScores },
    enabled: Object.fromEntries(factorNames.map(n => [n, true])),
    reasons: Object.fromEntries(factorNames.map(n => [n, ""])),
    notes: { ...fund.defaultNotes },
  };
}

function buildInitialAllState() {
  return Object.fromEntries(FUNDS.map(f => [f.code, buildInitialFundState(f)]));
}

export default function App() {
  const [fundCode, setFundCode] = useState(FUNDS[0].code);
  const [allFundState, setAllFundState] = useState(buildInitialAllState);
  const [openCriteria, setOpenCriteria] = useState(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("kyp-theme") !== "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("kyp-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const fund      = getFund(fundCode);
  const framework = FRAMEWORKS[fund.frameworkId];
  const factors   = framework.factors;
  const current   = allFundState[fundCode];
  const { scores, enabled, reasons, notes } = current;

  // Updates a slice of the *current fund's* state, leaving other funds untouched
  // — this is what lets switching funds preserve in-progress work.
  const updateCurrent = (patch) => setAllFundState(prev => ({ ...prev, [fundCode]: { ...prev[fundCode], ...patch } }));
  const setScores  = (updater) => updateCurrent({ scores:  typeof updater === "function" ? updater(current.scores)  : updater });
  const setEnabled = (updater) => updateCurrent({ enabled: typeof updater === "function" ? updater(current.enabled) : updater });
  const setReasons = (updater) => updateCurrent({ reasons: typeof updater === "function" ? updater(current.reasons) : updater });
  const setNotes   = (updater) => updateCurrent({ notes:   typeof updater === "function" ? updater(current.notes)   : updater });

  const handleResetFund = () => {
    setAllFundState(prev => ({ ...prev, [fundCode]: buildInitialFundState(fund) }));
  };

  const toggleCriteria = (name) => {
    setOpenCriteria(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const toggleFactor = (name, val) => {
    setEnabled(prev => ({ ...prev, [name]: val }));
    if (val) {
      setReasons(prev => ({ ...prev, [name]: "" }));
    } else {
      const presets = EXCLUSION_REASONS[name];
      if (presets && presets.length > 0) {
        setReasons(prev => ({ ...prev, [name]: presets[0] }));
      }
    }
  };

  const setReason = (name, text) => setReasons(prev => ({ ...prev, [name]: text }));

  // Active weight sum — excludes disabled or unscored factors.
  const activeWeightSum = useMemo(
    () => factors.filter(f => enabled[f.name] && scores[f.name] != null).reduce((s, f) => s + f.weight, 0),
    [enabled, scores, factors]
  );

  const contribs = useMemo(() => factors.map(f => {
    const isOn = enabled[f.name];
    const hasScore = scores[f.name] != null;
    const canContribute = isOn && hasScore;
    const effectiveWeight = canContribute && activeWeightSum > 0 ? f.weight / activeWeightSum : 0;

    return {
      ...f,
      isOn,
      isComplete: hasScore,
      score: scores[f.name],
      effectiveWeight,
      contrib: canContribute ? scores[f.name] * effectiveWeight : 0,
    };
  }), [scores, enabled, activeWeightSum, factors]);

  const CRS     = useMemo(() => contribs.reduce((s, f) => s + f.contrib, 0), [contribs]);
  const activeContribs = useMemo(() => contribs.filter(f => f.isOn), [contribs]);
  const maxC    = useMemo(() => Math.max(...activeContribs.map(f => f.contrib), 0.001), [activeContribs]);
  const matchesDocument = Math.abs(CRS - fund.crs) < 0.005;
  // At the fund's document-default scores, use its authoritative stated rating
  // (the source document's own numeric tier-boundary table does not always
  // agree with the narrative rating it assigns — see NAMING_NOTE-adjacent
  // discrepancy for EMFIT/ERIED/ERGFI). Once scores are edited away from the
  // default, fall back to the published boundary table.
  const tier    = matchesDocument ? tierFromLabel(fund.tierLabel) : getTier(CRS);
  const top5    = [...activeContribs].sort((a, b) => b.contrib - a.contrib).slice(0, 5);
  const disabledCount = factors.length - activeContribs.length;
  const today   = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  // Factor-configuration groups, derived from each factor's category so the
  // panel automatically follows whichever framework is active.
  const groupedByCategory = useMemo(() => {
    const map = Object.fromEntries(CATEGORY_ORDER.map(c => [c, []]));
    factors.forEach(f => map[f.category].push(f));
    return map;
  }, [factors]);

  const generateReport = () => {
    const tierBadgeColor = tier.color;
    const tierBgColor    = tier.bg;

    const factorRows = contribs.map((f, idx) => {
      const tc = TIER_COLORS[f.score] || TIER_COLORS[3];
      const weightPct = f.isOn ? (f.effectiveWeight * 100).toFixed(1) : "—";
      const basePct   = (f.weight * 100).toFixed(1);
      const weightChanged = f.isOn && Math.abs(f.effectiveWeight - f.weight) > 0.0001;
      const contribVal = f.isOn ? f.contrib.toFixed(3) : "—";

      const factorReason = reasons[f.name] || "";

      const criteriaRows = f.criteria.map((c, vi) => {
        const v = vi + 1;
        const vtc = TIER_COLORS[v];
        const isSel = v === f.score && f.isOn;
        return `
          <tr style="background:${isSel ? vtc.bg : "transparent"}; border-top:1px solid #e0e2e9;">
            <td style="padding:5px 8px;font-weight:${isSel ? 700 : 400};color:${isSel ? vtc.color : "#666"};vertical-align:top;font-size:11px;">${v}</td>
            <td style="padding:5px 8px;font-weight:${isSel ? 700 : 400};color:${isSel ? vtc.color : "#888"};vertical-align:top;white-space:nowrap;font-size:11px;">${vtc.label}</td>
            <td style="padding:5px 8px;font-weight:${isSel ? 600 : 400};color:${isSel ? "#111" : "#555"};vertical-align:top;line-height:1.5;font-size:11px;">${c}</td>
          </tr>`;
      }).join("");

      if (!f.isOn) {
        return `
          <div style="margin-bottom:10px;border:1px solid #c8ccd8;border-radius:6px;overflow:hidden;page-break-inside:avoid;">
            <div style="background:#eaecf1;border-bottom:1px solid #c8ccd8;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;">
              <div>
                <span style="font-size:10px;color:#aaa;font-weight:800;margin-right:6px;">#${idx + 1}</span>
                <span style="font-weight:700;font-size:13px;color:#2e3a55;">${f.displayName}</span>
              </div>
              <span style="font-size:10px;color:#c05000;font-weight:700;background:#fef0e6;padding:2px 8px;border-radius:3px;">EXCLUDED</span>
            </div>
            <div style="padding:10px 12px;background:#f4f5f8;">
              <div style="font-size:9px;font-weight:700;color:#2e3a55;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Exclusion Reason</div>
              <div style="font-size:11px;color:${factorReason.trim() ? "#333" : "#c05000"};font-style:${factorReason.trim() ? "normal" : "italic"};line-height:1.5;">
                ${factorReason.trim() || "⚠ No reason provided"}
              </div>
              <div style="margin-top:6px;font-size:9px;color:#7a8099;">Base weight ${basePct}% — redistributed proportionally to active factors.</div>
            </div>
          </div>`;
      }

      const factorNote = notes[f.name] || "";
      return `
        <div style="margin-bottom:14px;border:1px solid #dde0ea;border-radius:6px;overflow:hidden;page-break-inside:avoid;">
          <div style="background:#f9fafc;border-bottom:1px solid #dde0ea;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <span style="font-size:10px;color:#c9a020;font-weight:800;margin-right:6px;">#${idx + 1}</span>
              <span style="font-weight:700;font-size:13px;color:#2e3a55;">${f.displayName}</span>
            </div>
            <div style="text-align:right;font-size:11px;white-space:nowrap;">
              <span style="font-weight:700;color:${weightChanged ? "#c9a020" : "#2e3a55"};">${weightPct}%</span>
              ${weightChanged ? `<span style="font-size:9px;color:#7a8099;margin-left:3px;">(base ${basePct}%)</span>` : ""}
              <span style="color:#7a8099;margin-left:4px;">wt</span>
              &nbsp;|&nbsp;
              <span style="font-weight:700;color:${tc.color};background:${tc.bg};padding:2px 8px;border-radius:3px;font-size:11px;">${f.score} — ${tc.label}</span>
              &nbsp;&nbsp;
              <span style="font-size:11px;color:#7a8099;">contrib: <strong style="color:#2e3a55;">${contribVal}</strong></span>
            </div>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#2e3a55;">
                <th style="padding:5px 8px;text-align:left;font-weight:700;color:#c9a020;font-size:10px;letter-spacing:.08em;width:48px;">SCORE</th>
                <th style="padding:5px 8px;text-align:left;font-weight:700;color:#c9a020;font-size:10px;letter-spacing:.08em;width:68px;">TIER</th>
                <th style="padding:5px 8px;text-align:left;font-weight:700;color:#c9a020;font-size:10px;letter-spacing:.08em;">CRITERIA</th>
              </tr>
            </thead>
            <tbody>${criteriaRows}</tbody>
          </table>
          ${factorNote.trim() ? `
          <div style="padding:8px 12px;border-top:1px solid #dde0ea;background:#fafbfc;">
            <div style="font-size:9px;font-weight:700;color:#2e3a55;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Analyst Notes</div>
            <div style="font-size:11px;color:#333;line-height:1.6;white-space:pre-wrap;">${factorNote.trim()}</div>
          </div>` : ""}
        </div>`;
    }).join("");

    const top5Rows = top5.map((f, i) => `
      <tr>
        <td style="padding:6px 10px;font-size:12px;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:#2e3a55;border:2px solid #c9a020;color:#c9a020;font-size:9px;font-weight:800;margin-right:8px;">${i + 1}</span>
          ${f.displayName}
        </td>
        <td style="padding:6px 10px;font-size:11px;color:#7a8099;">${(f.effectiveWeight * 100).toFixed(1)}% wt</td>
        <td style="padding:6px 10px;font-size:12px;font-weight:600;color:#2e3a55;">${f.score} — ${TIER_COLORS[f.score].label}</td>
        <td style="padding:6px 10px;font-size:12px;font-family:sans-serif;text-align:right;">${f.contrib.toFixed(3)}</td>
      </tr>`).join("");

    const tierRefRows = [
      ["1.00 – 1.50", "Low Risk",          "#2a7d4f", "#e6f4ec"],
      ["1.51 – 2.50", "Low-Medium Risk",   "#4a7c2f", "#eef5e6"],
      ["2.51 – 3.00", "Medium Risk",       "#b08000", "#fef9e6"],
      ["3.01 – 3.50", "Medium-High Risk",  "#c05000", "#fef0e6"],
      ["3.51 – 5.00", "High Risk",         "#b02020", "#fce8e8"],
    ].map(([range, label, color, bg]) => {
      const isCurrent = tier.label === label;
      return `<tr style="background:${isCurrent ? bg : "transparent"};">
        <td style="padding:5px 10px;font-size:11px;color:#7a8099;">${range}</td>
        <td style="padding:5px 10px;font-size:11px;font-weight:${isCurrent ? 700 : 500};color:${color};">${label}${isCurrent ? " ◀" : ""}</td>
      </tr>`;
    }).join("");

    const suit = fund.suitability;
    const suitabilityRows = [
      ["Risk Capacity", suit.riskCapacity],
      ["Risk Tolerance", suit.riskTolerance],
      ["Overall Risk Profile", suit.overallRiskProfile],
      ["Liquidity Needs", suit.liquidityNeeds],
      ["Time Horizon", suit.timeHorizon],
      ["Investment Objectives", suit.investmentObjectives],
    ].map(([label, val]) => `
      <tr>
        <td style="padding:5px 10px;font-size:11px;color:#7a8099;white-space:nowrap;">${label}</td>
        <td style="padding:5px 10px;font-size:11px;color:#2e3a55;font-weight:600;">${val}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>KYP Risk Report — ${fund.code}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #1a1a1a; font-size: 13px; }
    @page { size: A4; margin: 15mm 14mm; }
    @media print {
      .no-print { display: none !important; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    table { border-collapse: collapse; width: 100%; }
  </style>
</head>
<body>

<!-- Toolbar (hidden when printing) -->
<div class="no-print" style="background:#1a2236;border-bottom:2px solid #c9a020;padding:10px 28px;display:flex;align-items:center;justify-content:space-between;">
  <span style="font-size:11px;color:#7a8099;letter-spacing:.05em;">KYP Risk Report &nbsp;—&nbsp; ${fund.code}</span>
  <div style="display:flex;gap:10px;">
    <button onclick="window.print()" style="background:#c9a020;color:#1a2236;border:none;padding:8px 22px;font-size:12px;font-weight:800;border-radius:4px;cursor:pointer;letter-spacing:.06em;text-transform:uppercase;">
      🖨 Print / Save PDF
    </button>
    <button onclick="window.close()" style="background:transparent;color:#7a8099;border:1px solid #3a4a6a;padding:8px 16px;font-size:12px;border-radius:4px;cursor:pointer;">
      ✕ Close
    </button>
  </div>
</div>

<!-- Report Header -->
<div style="background:#2e3a55;padding:20px 28px;border-bottom:4px solid #c9a020;">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;">
    <div>
      <div style="font-size:9px;letter-spacing:.18em;color:#c9a020;text-transform:uppercase;font-weight:700;margin-bottom:6px;">Know Your Product (KYP) Risk Assessment</div>
      <div style="font-size:22px;font-weight:800;color:#ffffff;">${fund.code} — ${fund.legalName}</div>
      <div style="font-size:11px;color:#c8ccd8;margin-top:4px;">
        <span style="background:#c9a020;color:#2e3a55;padding:1px 8px;border-radius:3px;font-weight:700;font-size:10px;margin-right:8px;">${fund.strategyType}</span>
        ${framework.factorCount}-Factor Composite Risk Score Model — ${framework.label} &nbsp;|&nbsp; Version 1.0
      </div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:9px;color:#c9a020;text-transform:uppercase;letter-spacing:.1em;margin-bottom:3px;">Assessment Date</div>
      <div style="font-size:13px;color:#ffffff;">${today}</div>
      <div style="font-size:9px;color:#7a8099;margin-top:8px;">${activeContribs.length} of ${factors.length} factors active</div>
    </div>
  </div>
</div>

<!-- CRS Summary Bar -->
<div style="display:flex;align-items:stretch;border-bottom:3px solid #dde0ea;">

  <div style="background:${tierBgColor};border-right:1px solid ${tierBadgeColor}33;padding:16px 24px;min-width:180px;text-align:center;display:flex;flex-direction:column;justify-content:center;">
    <div style="font-size:10px;color:#7a8099;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;">Composite Risk Score</div>
    <div style="font-size:38px;font-weight:800;color:${tierBadgeColor};line-height:1;">${CRS.toFixed(2)}</div>
    <div style="font-size:11px;color:${tierBadgeColor};opacity:.7;margin-top:2px;">of 5.00</div>
    <div style="margin-top:8px;font-size:13px;font-weight:700;color:${tierBadgeColor};background:${tierBadgeColor}18;padding:4px 12px;border-radius:4px;border:1px solid ${tierBadgeColor}44;">${tier.label}</div>
  </div>

  <div style="flex:1;padding:14px 20px;">
    <div style="font-size:10px;color:#2e3a55;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">Top Risk Drivers</div>
    <table>
      <tbody>${top5Rows}</tbody>
    </table>
  </div>

  <div style="padding:14px 20px;min-width:200px;border-left:1px solid #dde0ea;">
    <div style="font-size:10px;color:#2e3a55;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">Risk Tier Reference</div>
    <table>${tierRefRows}</table>
    ${disabledCount > 0 ? `<div style="margin-top:10px;padding:6px 8px;background:#f5edd6;border:1px solid #c9a02055;border-radius:4px;font-size:10px;color:#6b5000;">⚠ ${disabledCount} factor${disabledCount > 1 ? "s" : ""} excluded — weights redistributed proportionally.</div>` : ""}
  </div>

</div>

<!-- Fund Reference & Suitability -->
<div style="padding:20px 28px 0;display:flex;gap:20px;">
  <div style="flex:1;padding:14px 16px;background:#f9fafc;border:1px solid #dde0ea;border-radius:6px;">
    <div style="font-size:10px;font-weight:700;color:#2e3a55;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Key Risk Drivers (Source Document)</div>
    <div style="font-size:11px;color:#333;line-height:1.6;">${fund.keyDrivers}</div>
    <div style="margin-top:8px;font-size:10px;color:#7a8099;">Source-document reference CRS: <strong style="color:#2e3a55;">${fund.crs.toFixed(2)} — ${fund.tierLabel}</strong></div>
  </div>
  <div style="flex:1;padding:14px 16px;background:#f9fafc;border:1px solid #dde0ea;border-radius:6px;">
    <div style="font-size:10px;font-weight:700;color:#2e3a55;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Client Suitability Framework</div>
    <table>${suitabilityRows}</table>
  </div>
</div>

<!-- Factor Detail -->
<div style="padding:20px 28px;">
  <div style="font-size:10px;font-weight:700;color:#c9a020;text-transform:uppercase;letter-spacing:.14em;background:#2e3a55;padding:8px 12px;border-radius:5px 5px 0 0;margin-bottom:0;">
    Factor Scoring Detail
  </div>
  <div style="padding:16px 0;">
    ${factorRows}
  </div>
</div>

<!-- Regulatory Note -->
<div style="margin:0 28px 28px;padding:12px 16px;background:#f4f5f8;border:1px solid #dde0ea;border-radius:5px;font-size:10px;color:#7a8099;line-height:1.7;">
  <strong style="color:#2e3a55;">Regulatory Note:</strong>
  This KYP risk assessment is produced pursuant to NI 31-103 s.13.2, CIRO Rule 3800, and CSA Client Focused Reforms.
  Factor scores and weightings reflect internal methodology approved by the Investment Committee.
  CRS thresholds align with the approved product risk classification framework.
  This document is intended for registered adviser use only and should be retained in the client file.
  <br/><br/>
  <strong style="color:#2e3a55;">Framework Comparability:</strong>
  Debt, Equity, and Hybrid fund structures are each scored using their own standardized risk-factor framework,
  with factor labels and category weights calibrated to the material risk drivers of that fund type.
  All three frameworks share the same five-point ordinal scale, the same tier boundaries, and the same CRS
  aggregation methodology, preserving cross-fund comparability at the summary level.
  <br/><br/>
  <strong style="color:#2e3a55;">Methodology:</strong>
  CRS = Σ (Score<sub>i</sub> × EffectiveWeight<sub>i</sub>) across all active factors.
  When factors are excluded, remaining weights are scaled proportionally so the CRS remains on the 1–5 scale.
  Active factors: ${activeContribs.length} / ${factors.length}. &nbsp; Report generated: ${new Date().toLocaleString("en-CA")}.
</div>

</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (!w) {
      alert("Popup blocked — please allow popups for this site and try again.");
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  return (
    <div style={{ fontFamily: "var(--ui-font)", background: "var(--app-bg)", minHeight: "100vh", color: "var(--text)" }}>

      {/* ── Header ── */}
      <div style={{ background: "var(--header-bg)", padding: "0 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: `3px solid ${EQ.gold}`, paddingBottom: 0 }}>
          <div style={{ padding: "18px 0 14px" }}>
            <div style={{ fontSize: 21, fontWeight: 700, color: "#ffffff" }}>
              Product Risk Assessment — Composite Risk Score Model
            </div>
            <div style={{ fontSize: 13, color: "#ffffff", marginTop: 4, opacity: 0.85 }}>
              {framework.factorCount}-Factor KYP Assessment Framework — {framework.label} (Version 1.0)
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "18px 0 14px" }}>
            {/* Date + factor count */}
            <div style={{ textAlign: "right", borderRight: "1px solid var(--accent-dim)", paddingRight: 24 }}>
              <div style={{ fontSize: 9, color: "#ffffff", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 2, opacity: 0.85 }}>Assessment Date</div>
              <div style={{ fontSize: 13, color: "#ffffff", fontWeight: 600 }}>{today}</div>
              <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 3 }}>{activeContribs.length} of {factors.length} factors active</div>
            </div>
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(d => !d)}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: darkMode ? "#000000" : "transparent",
                color: darkMode ? "#FF6600" : "#ffffff",
                border: darkMode ? "1px solid #FF6600" : "1px solid var(--accent-dim)",
                borderRadius: "var(--radius)",
                padding: "10px 16px",
                fontSize: 16,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all .2s ease",
                lineHeight: 1,
                boxShadow: darkMode ? "0 0 8px rgba(255,102,0,.35)" : "none",
              }}
              onMouseOver={e => e.currentTarget.style.opacity = ".8"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}
            >
              {darkMode ? "🌙" : "☀"}
            </button>

            {/* Reset button */}
            <button
              onClick={handleResetFund}
              title="Reset the current fund back to the source document's default scores and notes"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "transparent",
                color: "#ffffff",
                border: "1px solid var(--accent-dim)",
                borderRadius: "var(--radius)",
                padding: "10px 20px",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                letterSpacing: ".06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                transition: "opacity .15s ease",
              }}
              onMouseOver={e => e.currentTarget.style.opacity = ".7"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}
            >
              ↺ Reset Fund
            </button>
            {/* Print button */}
            <button
              onClick={generateReport}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "var(--accent)",
                color: "var(--accent-text)",
                border: "none",
                borderRadius: "var(--radius)",
                padding: "10px 20px",
                fontSize: 12,
                fontWeight: 800,
                fontFamily: "inherit",
                cursor: "pointer",
                letterSpacing: ".06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px var(--accent-glow)",
                transition: "opacity .15s ease",
              }}
              onMouseOver={e => e.currentTarget.style.opacity = ".85"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}
            >
              🖨 Print Report
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "minmax(200px,240px) 1fr", gap: 28, alignItems: "start" }}>

        {/* ── Left Panel ── */}
        <div>
          {/* Gauge card */}
          <div style={{ background: "var(--card-bg)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "16px 12px 12px", boxShadow: "var(--shadow)" }}>
            <GaugeArc crs={CRS} tier={tier} />
            <div style={{ marginTop: 10, padding: "10px 14px", background: tier.bg, borderRadius: "var(--radius)", border: `1px solid ${tier.color}33`, textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: tier.color }}>{tier.label}</div>
              <div style={{ fontSize: 11, color: tier.color, opacity: 0.8, marginTop: 2 }}>CRS: {CRS.toFixed(2)} / 5.00</div>
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: matchesDocument ? "var(--tier1-color)" : "var(--tier4-color)", textAlign: "center" }}>
              {matchesDocument ? "✓ Matches source-document CRS" : `Source document: ${fund.crs.toFixed(2)} — ${fund.tierLabel}`}
            </div>
          </div>

          {/* Top Risk Drivers */}
          <div style={{ marginTop: 16, background: "var(--card-bg)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
            <div style={{ background: "var(--card-header-bg)", padding: "8px 14px" }}>
              <span style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#ffffff", fontWeight: 700 }}>Top Risk Drivers</span>
            </div>
            <div style={{ padding: "12px 14px" }}>
              {top5.map((f, i) => (
                <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: i < 4 ? 9 : 0, paddingBottom: i < 4 ? 9 : 0, borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--card-header-bg)", border: `2px solid ${EQ.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: EQ.gold, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, fontSize: 12, fontWeight: 500, color: "var(--text-nav)" }}>{f.displayName}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "sans-serif" }}>{f.contrib.toFixed(3)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Tier Reference */}
          <div style={{ marginTop: 16, background: "var(--card-bg)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
            <div style={{ background: "var(--card-header-bg)", padding: "8px 14px" }}>
              <span style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#ffffff", fontWeight: 700 }}>Risk Tier Reference</span>
            </div>
            <div style={{ padding: "12px 14px" }}>
              {TIER_REF_ROWS.map(([range, label], i, arr) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, paddingBottom: i < arr.length - 1 ? 7 : 0, marginBottom: i < arr.length - 1 ? 7 : 0, borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ color: "var(--text-muted)", fontFamily: "sans-serif" }}>{range}</span>
                  <span style={{ color: TIER_COLORS[TIER_LABEL_INDEX[label]].color, fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score Breakdown */}
          {(() => {
            const anyDisabled = contribs.some(f => !f.isOn);
            const weightsNormalized = anyDisabled;
            const cols = weightsNormalized
              ? "1fr 44px 48px 32px 56px"
              : "1fr 48px 32px 56px";
            return (
              <div style={{ marginTop: 16, background: "var(--card-bg)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
                <div style={{ background: "var(--card-header-bg)", padding: "8px 14px" }}>
                  <span style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#ffffff", fontWeight: 700 }}>Score Breakdown</span>
                </div>
                <div style={{ padding: "10px 14px 6px" }}>
                  {weightsNormalized && (
                    <div style={{ fontSize: 9, color: "var(--text-muted)", fontStyle: "italic", marginBottom: 6, lineHeight: 1.4 }}>
                      Base Wt = model weight. Eff. Wt = renormalized across active factors only (sums to 100%). Weighted score uses Eff. Wt.
                    </div>
                  )}
                  {/* Header */}
                  <div style={{ display: "grid", gridTemplateColumns: cols, gap: 3, paddingBottom: 5, borderBottom: "1px solid var(--border)", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--text-nav)" }}>Factor</span>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--text-nav)", textAlign: "right" }}>Base</span>
                    {weightsNormalized && <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: EQ.gold, textAlign: "right" }}>Eff.</span>}
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--text-nav)", textAlign: "right" }}>Scr</span>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--text-nav)", textAlign: "right" }}>Wtd</span>
                  </div>
                  {/* Factor rows */}
                  {contribs.map((f, i) => (
                    <div key={f.name} style={{ padding: "3px 0", borderBottom: i < contribs.length - 1 ? "1px solid var(--border)" : "none", opacity: f.isOn ? 1 : 0.35 }}>
                      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 3, alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-nav)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.displayName}</span>
                        <span style={{ fontSize: 12, color: "var(--text-mid)", textAlign: "right", fontFamily: "monospace" }}>{(f.weight * 100).toFixed(1)}%</span>
                        {weightsNormalized && (
                          <span style={{ fontSize: 12, color: f.isOn && f.isComplete ? EQ.gold : "var(--text-muted)", textAlign: "right", fontFamily: "monospace", fontWeight: f.isOn && f.isComplete ? 700 : 400 }}>
                            {f.isOn && f.isComplete ? (f.effectiveWeight * 100).toFixed(1) + "%" : "—"}
                          </span>
                        )}
                        <span style={{ fontSize: 13, fontWeight: 700, color: f.isOn ? EQ.gold : "var(--text-muted)", textAlign: "right", fontFamily: "monospace" }}>
                          {f.isOn && f.score != null ? f.score : "—"}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: f.isOn && !f.isComplete ? "var(--tier4-color)" : "var(--text-nav)", textAlign: "right", fontFamily: "monospace" }}>
                          {f.isOn && f.isComplete ? f.contrib.toFixed(3) : f.isOn && !f.isComplete ? "N/A" : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                  {/* Total row */}
                  <div style={{ display: "grid", gridTemplateColumns: cols, gap: 3, paddingTop: 6, marginTop: 3, borderTop: "1px solid var(--border-dark)" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-nav)" }}>Total</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-nav)", textAlign: "right", fontFamily: "monospace" }}>
                      {(contribs.filter(f => f.isOn).reduce((s, f) => s + f.weight, 0) * 100).toFixed(0)}%
                    </span>
                    {weightsNormalized && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: EQ.gold, textAlign: "right", fontFamily: "monospace" }}>100%</span>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-nav)", textAlign: "right", fontFamily: "monospace" }}>—</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-nav)", textAlign: "right", fontFamily: "monospace" }}>{CRS.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── Right Panel ── */}
        <div>

          {/* ── Fund Details Card ── */}
          <div style={{ background: "var(--card-bg)", borderRadius: "var(--radius)", border: "1px solid var(--border)", marginBottom: 16, overflow: "hidden", boxShadow: "var(--shadow)" }}>
            <div style={{ background: "var(--card-header-bg)", padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13 }}>🏢</span>
              <span style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#ffffff", fontWeight: 700 }}>Fund Details</span>
            </div>
            <div style={{ padding: "16px" }}>

              {/* Fund selector */}
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>Fund</div>
              <div style={{ display: "flex", gap: 0, border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", marginBottom: 12 }}>
                {FUNDS.map((f, i) => {
                  const isActive = fundCode === f.code;
                  return (
                    <button
                      key={f.code}
                      onClick={() => setFundCode(f.code)}
                      title={f.legalName}
                      style={{
                        flex: 1,
                        padding: "8px 10px",
                        fontSize: 13,
                        fontWeight: isActive ? 700 : 500,
                        fontFamily: "inherit",
                        cursor: "pointer",
                        border: "none",
                        borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                        background: isActive ? EQ.navy : "var(--card-bg)",
                        color: isActive ? EQ.gold : "var(--text-muted)",
                        transition: "all .15s ease",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {f.code}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start" }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Legal Name</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-nav)" }}>{fund.legalName}</div>
                  {fund.altCodes.length > 0 && (
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3, fontStyle: "italic" }}>
                      Also referenced as {fund.altCodes.join(", ")} in source materials
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Framework</div>
                  <span style={{ display: "inline-block", padding: "4px 12px", fontSize: 12, fontWeight: 700, background: EQ.navy, color: EQ.gold, borderRadius: "var(--radius)" }}>
                    {fund.frameworkId} — {framework.factorCount} factors
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 12, fontSize: 10, color: "var(--text-muted)" }}>
                <strong style={{ color: "var(--text-nav)" }}>Strategy Type:</strong> {fund.strategyType}
              </div>

              {/* Key drivers / suitability reference */}
              <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--input-bg)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>
                  Key Risk Drivers (Source Document)
                </div>
                <div style={{ fontSize: 11, color: "var(--text)", lineHeight: 1.6 }}>{fund.keyDrivers}</div>
              </div>

              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[
                  ["Risk Capacity", fund.suitability.riskCapacity],
                  ["Time Horizon", fund.suitability.timeHorizon],
                  ["Liquidity Needs", fund.suitability.liquidityNeeds],
                ].map(([label, val]) => (
                  <div key={label} style={{ padding: "8px 10px", background: "var(--card-alt)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-nav)" }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 10, fontSize: 10, color: "var(--text-muted)", lineHeight: 1.5, fontStyle: "italic" }}>
                ⓘ {NAMING_NOTE}
              </div>
            </div>
          </div>

          {/* ── Risk Factor Configuration Card ── */}
          {(() => {
            const allNames = factors.map(f => f.name);

            const enableAll = () => {
              setEnabled(Object.fromEntries(allNames.map(n => [n, true])));
              setReasons(Object.fromEntries(allNames.map(n => [n, ""])));
            };
            const disableAll = () => {
              const newEnabled = Object.fromEntries(allNames.map(n => [n, false]));
              const newReasons = Object.fromEntries(allNames.map(n => {
                const presets = EXCLUSION_REASONS[n];
                return [n, presets?.[0] || ""];
              }));
              setEnabled(newEnabled);
              setReasons(newReasons);
            };

            const expandAll  = () => setCollapsedGroups(new Set());
            const collapseAll = () => setCollapsedGroups(new Set(CATEGORY_ORDER.map(c => CATEGORIES[c])));

            const toggleGroup = (groupFactors, targetState) => {
              setEnabled(prev => ({ ...prev, ...Object.fromEntries(groupFactors.map(n => [n, targetState])) }));
              if (!targetState) {
                setReasons(prev => ({
                  ...prev,
                  ...Object.fromEntries(groupFactors.map(n => [n, EXCLUSION_REASONS[n]?.[0] || prev[n] || ""])),
                }));
              } else {
                setReasons(prev => ({ ...prev, ...Object.fromEntries(groupFactors.map(n => [n, ""])) }));
              }
            };

            return (
              <div style={{ background: "var(--card-bg)", borderRadius: "var(--radius)", border: "1px solid var(--border)", marginBottom: 16, overflow: "hidden", boxShadow: "var(--shadow)" }}>
                {/* Header */}
                <div style={{ background: "var(--card-bg)", borderBottom: "1px solid var(--border)", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>⚙</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-nav)" }}>Risk Factor Configuration</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={expandAll} style={{ padding: "5px 14px", fontSize: 11, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", border: "1px solid var(--border-dark)", borderRadius: "var(--radius-sm)", background: "var(--card-bg)", color: "var(--text-nav)" }}>
                      Expand All
                    </button>
                    <button onClick={collapseAll} style={{ padding: "5px 14px", fontSize: 11, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", border: "1px solid var(--border-dark)", borderRadius: "var(--radius-sm)", background: "var(--card-bg)", color: "var(--text-nav)" }}>
                      Collapse All
                    </button>
                    <div style={{ width: 1, height: 20, background: "var(--border)" }} />
                    <button onClick={enableAll} style={{ padding: "5px 14px", fontSize: 11, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", border: "1px solid var(--tier1-color)", borderRadius: "var(--radius-sm)", background: "var(--card-bg)", color: "var(--tier1-color)" }}>
                      Enable All
                    </button>
                    <button onClick={disableAll} style={{ padding: "5px 14px", fontSize: 11, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", border: "1px solid var(--tier5-color)", borderRadius: "var(--radius-sm)", background: "var(--card-bg)", color: "var(--tier5-color)" }}>
                      Disable All
                    </button>
                  </div>
                </div>

                {/* Info note */}
                <div style={{ padding: "8px 16px", background: "var(--card-alt)", borderBottom: "1px solid var(--border)", display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>ⓘ</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
                    Toggle individual factors on or off. Disabled factors are excluded from scoring and weights are redistributed proportionally across active factors.
                  </span>
                </div>

                {/* Two-column category grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                  {CATEGORY_COLUMNS.map((catKeys, ci) => (
                    <div key={ci} style={{ borderRight: ci === 0 ? "1px solid var(--border)" : "none", padding: "12px 16px" }}>
                      {catKeys.filter(ck => groupedByCategory[ck].length > 0).map((catKey, gi, arr) => {
                        const groupFactors = groupedByCategory[catKey];
                        const groupLabel = CATEGORIES[catKey];
                        const groupNames = groupFactors.map(f => f.name);
                        const grpOff = groupNames.every(n => !enabled[n]);
                        return (
                          <div key={catKey} style={{ marginBottom: gi < arr.length - 1 ? 16 : 0 }}>
                            {/* Group header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: collapsedGroups.has(groupLabel) ? 0 : 8 }}>
                              <span
                                onClick={() => setCollapsedGroups(prev => {
                                  const next = new Set(prev);
                                  next.has(groupLabel) ? next.delete(groupLabel) : next.add(groupLabel);
                                  return next;
                                })}
                                style={{ fontSize: 11, fontWeight: 700, color: "var(--text-nav)", textTransform: "uppercase", letterSpacing: ".1em", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, userSelect: "none" }}
                              >
                                <span style={{ fontSize: 8, color: "var(--text-muted)", lineHeight: 1 }}>{collapsedGroups.has(groupLabel) ? "▶" : "▼"}</span>
                                {groupLabel}
                              </span>
                              {!collapsedGroups.has(groupLabel) && (
                                <button
                                  onClick={() => toggleGroup(groupNames, grpOff)}
                                  style={{ fontSize: 10, fontWeight: 700, color: "var(--text-nav)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textTransform: "uppercase", letterSpacing: ".05em", padding: 0 }}
                                >
                                  Toggle All
                                </button>
                              )}
                            </div>
                            {/* Factor rows */}
                            {!collapsedGroups.has(groupLabel) && groupFactors.map(f => {
                              const isOn = enabled[f.name];
                              return (
                                <div key={f.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 }}>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <span style={{ fontSize: 14, color: isOn ? "var(--text-nav-dark)" : "var(--text-muted)", fontWeight: 700, lineHeight: 1.3, display: "block" }}>
                                      {f.displayName}
                                    </span>
                                    <span style={{ fontSize: 11, color: "var(--text-mid)" }}>({(f.weight * 100).toFixed(1)}% base)</span>
                                  </div>
                                  <Toggle on={isOn} onChange={val => toggleFactor(f.name, val)} />
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Section label bar */}
          <div style={{ background: "var(--card-header-bg)", borderRadius: "var(--radius) var(--radius) 0 0", padding: "9px 16px", marginBottom: 0 }}>
            <span style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#ffffff", fontWeight: 700 }}>
              Factor Scoring — 1 (Low Risk) to 5 (High Risk)
            </span>
          </div>

          <div style={{ border: "1px solid var(--border)", borderTop: "none", borderRadius: "0 0 var(--radius) var(--radius)", background: "var(--card-bg)", padding: "16px", boxShadow: "var(--shadow)" }}>

            {disabledCount > 0 && (
              <div style={{ marginBottom: 12, padding: "8px 12px", background: "var(--gold-light)", border: "1px solid var(--accent-dim)", borderRadius: "var(--radius-sm)", fontSize: 11, color: "#6b5000", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13 }}>⚠</span>
                <span>
                  <strong>{disabledCount} factor{disabledCount > 1 ? "s" : ""} excluded.</strong>{" "}
                  Remaining active weights are scaled proportionally so the CRS stays on the 1–5 scale.
                  Effective weights shown in gold where adjusted.
                </span>
              </div>
            )}

            {contribs.map((f, idx) => {
              const barPct = f.isOn && f.isComplete ? (f.contrib / maxC) * 100 : 0;
              const isOpen = openCriteria.has(f.name);
              const weightChanged = f.isOn && Math.abs(f.effectiveWeight - f.weight) > 0.0001;
              const reason = reasons[f.name];
              const reasonMissing = !f.isOn && !reason.trim();

              return (
                <div
                  key={f.name}
                  style={{
                    border: `1px solid ${!f.isOn && reasonMissing ? "#c05000" : "var(--border)"}`,
                    borderRadius: "var(--radius)",
                    marginBottom: 8,
                    overflow: "hidden",
                    background: f.isOn ? "var(--card-bg)" : "var(--disabled-bg)",
                    transition: "border-color .2s ease",
                  }}
                >
                  {/* ── Factor Header Row ── */}
                  <div style={{ padding: "9px 12px 7px", display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 10, alignItems: "center", borderBottom: "1px solid var(--border)", background: f.isOn ? "var(--card-alt)" : "var(--disabled-hdr)" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
                      <span style={{ fontSize: 10, color: f.isOn ? EQ.gold : EQ.textMuted, fontWeight: 800 }}>#{idx + 1}</span>
                      <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-nav)" }}>{f.displayName}</span>
                    </div>

                    {/* Weight display */}
                    <div style={{ textAlign: "right", fontFamily: "sans-serif", fontSize: 11, whiteSpace: "nowrap" }}>
                      {f.isOn ? (
                        <>
                          <span style={{ fontWeight: 700, color: weightChanged ? EQ.gold : "var(--text-nav)" }}>
                            {(f.effectiveWeight * 100).toFixed(1)}%
                          </span>
                          {weightChanged && (
                            <span style={{ fontSize: 9, color: "var(--text-muted)", marginLeft: 3 }}>
                              (base {(f.weight * 100).toFixed(1)}%)
                            </span>
                          )}
                          <span style={{ marginLeft: 4, color: "var(--text-muted)" }}>wt</span>
                        </>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: 10 }}>excluded</span>
                      )}
                    </div>

                    {/* Contribution bar */}
                    <div style={{ width: 80 }}>
                      <div style={{ position: "relative", height: 5, background: "var(--input-bg)", borderRadius: "var(--radius-xs)" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barPct}%`, background: f.isOn ? "var(--accent)" : "var(--border-dark)", borderRadius: "var(--radius-xs)", transition: "width .25s ease" }} />
                      </div>
                      <div style={{ fontSize: 9, color: f.isOn && !f.isComplete ? "#c05000" : EQ.textMuted, marginTop: 2, fontFamily: "sans-serif", textAlign: "right" }}>
                        {f.isOn && f.isComplete ? f.contrib.toFixed(3) : f.isOn && !f.isComplete ? "incomplete" : "—"}
                      </div>
                    </div>

                    {/* Toggle */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: ".06em" }}>
                        {f.isOn ? "On" : "Off"}
                      </span>
                      <Toggle on={f.isOn} onChange={val => toggleFactor(f.name, val)} />
                    </div>
                  </div>

                  {/* ── Score Buttons (disabled when off) ── */}
                  {f.isOn && (
                    <div style={{ padding: "8px 12px 6px" }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {[1, 2, 3, 4, 5].map(v => {
                          const tc = TIER_COLORS[v];
                          const isSelected = f.score === v;
                          return (
                            <button key={v} onClick={() => setScores(prev => ({ ...prev, [f.name]: v }))}
                              style={{ flex: 1, minWidth: 60, padding: "5px 4px", fontSize: 11, fontFamily: "sans-serif", cursor: "pointer", border: isSelected ? `2px solid ${tc.color}` : "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: isSelected ? tc.bg : "var(--card-bg)", color: isSelected ? tc.color : "var(--text-mid)", fontWeight: isSelected ? 700 : 400, transition: "all .15s ease", whiteSpace: "nowrap", textAlign: "center" }}>
                              {v} — {tc.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Analyst Notes ── */}
                  {f.isOn && f.isComplete && (
                    <div style={{ padding: "8px 12px 10px", borderTop: "1px solid var(--border)", background: "var(--card-alt2)" }}>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "var(--text-nav)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>
                        Analyst Notes
                      </label>
                      <textarea
                        value={notes[f.name] || ""}
                        onChange={e => setNotes(prev => ({ ...prev, [f.name]: e.target.value }))}
                        placeholder="Enter your rationale for this rating…"
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          fontSize: 11,
                          fontFamily: "inherit",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--card-bg)",
                          color: "var(--text-nav)",
                          resize: "vertical",
                          boxSizing: "border-box",
                          outline: "none",
                          lineHeight: 1.5,
                        }}
                      />
                    </div>
                  )}

                  {/* ── Exclusion Reason ── */}
                  {!f.isOn && (
                    <div style={{ padding: "10px 12px 12px", borderTop: "1px solid var(--border-dark)", background: "var(--card-alt3)" }}>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: reasonMissing ? "#c05000" : "var(--text-nav)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
                        {reasonMissing ? "⚠ Exclusion reason required" : "Exclusion rationale"}
                      </label>

                      {/* Preset dropdown */}
                      <select
                        value=""
                        onChange={e => { if (e.target.value) setReason(f.name, e.target.value); }}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          fontSize: 11,
                          fontFamily: "inherit",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--card-bg)",
                          color: "var(--text-nav)",
                          marginBottom: 6,
                          cursor: "pointer",
                        }}
                      >
                        <option value="">— Select a pre-approved rationale or type below —</option>
                        {(EXCLUSION_REASONS[f.name] || []).map((r, i) => (
                          <option key={i} value={r}>{i === 0 ? `★ ${r}` : r}</option>
                        ))}
                        <option value="custom" disabled>── Custom ──</option>
                      </select>

                      {/* Editable text */}
                      <textarea
                        value={reason}
                        onChange={e => setReason(f.name, e.target.value)}
                        placeholder="Select a rationale above or type a custom exclusion reason here..."
                        rows={2}
                        style={{
                          width: "100%",
                          padding: "7px 10px",
                          fontSize: 11,
                          fontFamily: "inherit",
                          border: `1px solid ${reasonMissing ? "#c05000" : reason.trim() ? "var(--tier1-color)" : "var(--border)"}`,
                          borderRadius: "var(--radius-sm)",
                          background: reasonMissing ? "var(--tier4-bg)" : "var(--card-bg)",
                          color: "var(--text)",
                          resize: "vertical",
                          outline: "none",
                          lineHeight: 1.5,
                          boxSizing: "border-box",
                        }}
                        onFocus={e => e.target.style.borderColor = EQ.gold}
                        onBlur={e => e.target.style.borderColor = reasonMissing ? "#c05000" : reason.trim() ? "var(--tier1-color)" : "var(--border)"}
                      />
                      <div style={{ marginTop: 5, fontSize: 10, color: reason.trim() ? "#2a7d4f" : EQ.textMuted, fontStyle: "italic" }}>
                        {reason.trim() ? "✓ Rationale recorded — will appear in printed report" : "Required for regulatory compliance (NI 31-103 / CIRO Rule 3800)"}
                      </div>
                    </div>
                  )}

                  {/* ── View Criteria Toggle ── */}
                  {f.isOn && (
                    <button
                      onClick={() => toggleCriteria(f.name)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        margin: "2px 12px 8px",
                        padding: "3px 0",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 11,
                        color: EQ.gold,
                        fontFamily: "sans-serif",
                        fontWeight: 600,
                        letterSpacing: ".02em",
                      }}
                    >
                      <span style={{ display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .2s ease", fontSize: 8 }}>▶</span>
                      View Criteria
                    </button>
                  )}

                  {/* ── Criteria Dropdown ── */}
                  {f.isOn && isOpen && (
                    <div style={{ borderTop: "1px solid var(--border)" }}>
                      <CriteriaTable criteria={f.criteria} selectedScore={f.score} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* ── CRS Total ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--card-header-bg)", borderRadius: "var(--radius)", padding: "12px 16px", marginTop: 8 }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: EQ.gold, letterSpacing: ".04em" }}>Composite Risk Score (CRS)</span>
                <span style={{ marginLeft: 10, fontSize: 10, color: "#c8ccd8", fontFamily: "sans-serif" }}>
                  {activeContribs.length} of {factors.length} factors active
                </span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: tier.color, fontFamily: "sans-serif", background: tier.bg, padding: "2px 12px", borderRadius: "var(--radius-sm)" }}>{CRS.toFixed(3)}</span>
            </div>

            <div style={{ marginTop: 12, padding: "11px 14px", background: "var(--input-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.65 }}>
              <strong style={{ color: "var(--text-nav)" }}>Regulatory Note:</strong> This KYP risk assessment is produced pursuant to NI 31-103 s.13.2, CIRO Rule 3800, and CSA Client Focused Reforms. Factor scores and weightings reflect internal methodology approved by the Investment Committee. Debt, Equity, and Hybrid fund structures each use their own standardized risk-factor framework with factor labels and category weights calibrated to that fund type, while sharing the same five-point ordinal scale, tier boundaries, and CRS aggregation methodology across the product shelf. This document is intended for registered adviser use only.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
