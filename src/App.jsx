import React, { useState, useMemo } from "react";

const factors = [
  {
    name: "Liquidity", displayName: "Liquidity", weight: 0.19,
    desc: "Ease of redemption and lock-up terms",
    criteria: [
      "Monthly redemptions; no fee; no notice period; no aggregate cap; negligible gate risk.",
      "Monthly redemptions; 30-day notice; modest DSC phasing out within 18 months; aggregate cap up to 10% per month; no gate history.",
      "Quarterly redemptions; 90-day notice; aggregate cap 5–10% NAV per quarter; standard DSC schedule; theoretical gate risk; no gate history.",
      "Quarterly; gate risk elevated; active or recently triggered Managed Redemption Program; material DSC; redemption reliability uncertain.",
      "Redemptions suspended or indefinitely deferred; entirely at manager discretion; no secondary market.",
    ],
  },
  {
    name: "Concentration", displayName: "Concentration / Diversification", weight: 0.15,
    desc: "Single-issuer or sector exposure",
    criteria: [
      "200+ assets; 5+ provinces; multiple property types; thousands of residential tenants; no single asset over 2% of portfolio.",
      "100–200 assets; 3–4 provinces; primarily one asset type with meaningful sub-diversification; no single asset over 5%.",
      "30–100 assets; 2–3 provinces; single asset class; primary market concentration; diffuse residential or diversified commercial tenants.",
      "10–30 assets; 1–2 markets; single sector; top-5 tenants over 30% of revenue; limited sub-diversification.",
      "Fewer than 10 assets; single market; single asset type; 1–3 dominant tenants or single development project.",
    ],
  },
  {
    name: "Time Horizon", displayName: "Time Horizon", weight: 0.09,
    desc: "Alignment with client investment horizon",
    criteria: [
      "No minimum hold; monthly liquidity fee-free; suitable for any horizon including under 1 year.",
      "1–2 year minimum; monthly redemptions fee-free after 12–18 months; short-notice accessible.",
      "3–5 year minimum; quarterly redemptions; DSC phasing out over 3 years.",
      "5–7 year minimum; development pipeline adds 3–5 year stabilization period; quarterly gates possible.",
      "7–10+ year minimum; active development pipeline with uncertain completion dates; redemptions gated.",
    ],
  },
  {
    name: "Asset Class", displayName: "Asset Class", weight: 0.05,
    desc: "Inherent risk of underlying asset class",
    criteria: [
      "Exchange-listed or prospectus-qualified vehicle with daily liquidity (theoretical floor; outside private RE universe).",
      "OM-exempt fund with quarterly independent appraisals; majority-independent trustees; enhanced voluntary disclosure exceeding NI 45-106 minimums.",
      "Standard OM-exempt private RE fund; NI 45-106 compliant; annual independent appraisals; typical exempt-market disclosure; no exchange listing.",
      "OM-exempt fund with limited disclosure; infrequent or manager-directed appraisals; related-party governance structure.",
      "Minimal disclosure; no independent appraisals; unregistered or offshore structure; no regulatory filing.",
    ],
  },
  {
    name: "Track Record", displayName: "Track Record / Performance", weight: 0.05,
    desc: "Manager performance history and vintage",
    criteria: [
      "15+ year audited track record across multiple cycles including rising-rate environments; distributions never suspended; zero NAV impairment events.",
      "8–15 year audited track record; distributions maintained through at least one full market cycle; minor NAV fluctuation without capital impairment.",
      "5–8 year audited track record; distributions mostly maintained; not fully tested through a rising-rate cycle.",
      "2–5 year track record; distribution interruptions or reductions; fund established primarily in low-rate environment.",
      "Under 2 year track record; no audited performance; new fund or new manager.",
    ],
  },
  {
    name: "Mandate Scope", displayName: "Mandate Scope", weight: 0.05,
    desc: "Breadth of permitted investments in OM",
    criteria: [
      "Single asset class; single geography; single strategy — stabilized only; strict OM limits; no related-party structures.",
      "Single primary asset class; one or two minor permitted strategies (value-add renovation only); minimal related-party arrangements; tight OM boundaries.",
      "Single asset class with moderate flexibility (value-add permitted; limited development allowed); one region; standard related-party service agreements disclosed.",
      "Multi-strategy mandate (direct RE plus mortgage lending plus equity positions); multi-geography; material related-party arrangements.",
      "Unconstrained multi-asset, multi-geography, multi-strategy mandate; extensive related-party structures; broad manager discretion.",
    ],
  },
  {
    name: "Leverage Actual", displayName: "Leverage (actual use) LTV", weight: 0.05,
    desc: "Current leverage ratio deployed",
    criteria: [
      "Portfolio LTV under 40%; no construction debt; 100% long-term fixed-rate mortgages; strong DSCR headroom.",
      "Portfolio LTV 40–55%; primarily fixed-rate; no construction financing; conservative relative to sector norms.",
      "Portfolio LTV 55–65%; standard institutional leverage; mix of fixed and floating; no construction debt; adequate DSCR.",
      "Portfolio LTV 65–75%; elevated relative to peer group; some floating-rate or construction debt; DSCR approaching covenant minimum.",
      "Portfolio LTV over 75%; construction financing; DSCR covenant risk; at or approaching OM maximum.",
    ],
  },
  {
    name: "Development", displayName: "Non-Core Asset Exposure (Development)", weight: 0.05,
    desc: "Construction, entitlement or lease-up risk",
    criteria: [
      "0% development exposure; 100% stabilized income-producing assets; no construction financing; no pipeline commitments.",
      "Under 10% development; minor value-add renovation only; no speculative construction; pipeline completion within 12 months.",
      "10–25% development exposure; active but contained pipeline; some construction financing; completion expected within 2–3 years.",
      "25–50% development exposure; material active pipeline; significant construction financing; 3–5 year completion timelines.",
      "Over 50% development exposure; primarily pre-income assets; minimal current income; 5+ year completion horizons.",
    ],
  },
  {
    name: "Return Variability", displayName: "Variability of Distribution Pattern", weight: 0.04,
    desc: "Variability of Distribution Pattern",
    criteria: [
      "Consistent monthly distributions for 5+ years; 100% income-backed; no return of capital; NNN or long-term residential leases.",
      "Predominantly consistent distributions; minor variability of ±5–10% year-over-year; primarily income-backed; return of capital under 10%.",
      "Distributions maintained with moderate variability; return of capital 10–40%; modest lease-up or value-add activity affecting near-term income.",
      "Distributions variable or temporarily reduced or suspended; return of capital over 40%; material development assets limiting current income.",
      "Distributions suspended; return entirely from capital; no current income from development-stage assets.",
    ],
  },
  {
    name: "Manager Discipline", displayName: "Manager Discipline", weight: 0.04,
    desc: "Adherence to stated mandate and limits",
    criteria: [
      "Full mandate adherence for 10+ years; no style drift; LTV always within OM limits with meaningful headroom; transparent fees; no related-party conflicts; distributions fully income-backed.",
      "Consistent mandate adherence; minor LTV fluctuations within stated range; all related-party arrangements fully disclosed; distributions primarily income-backed.",
      "Generally consistent mandate adherence; LTV within limits but trending toward ceiling; standard related-party arrangements disclosed; distributions include modest return of capital.",
      "Evidence of style drift; LTV trending toward OM ceiling; distribution smoothing via significant return of capital; related-party fee escalation not fully disclosed.",
      "Clear mandate violations; LTV exceeding OM maximum; distributions sustained primarily by return of capital; undisclosed related-party arrangements; regulatory actions on record.",
    ],
  },
  {
    name: "Leverage OM", displayName: "Leverage (max in OM) LTV", weight: 0.04,
    desc: "Maximum leverage permitted under OM",
    criteria: [
      "OM maximum portfolio LTV of 50% or less; hard cap; no exceptions or carve-outs.",
      "OM maximum portfolio LTV 51–60%; conservative cap with limited headroom above typical operating leverage.",
      "OM maximum portfolio LTV 61–70%; standard range for stabilized RE; adequate headroom from typical operating leverage.",
      "OM maximum portfolio LTV 71–80%; elevated ceiling permitting significant leverage; possible construction debt carve-outs.",
      "OM maximum portfolio LTV over 80% or no stated maximum; construction financing carved out; no hard contractual leverage constraint.",
    ],
  },
  {
    name: "Derivatives Actual", displayName: "Derivatives (actual use)", weight: 0.03,
    desc: "Current use of derivatives",
    criteria: [
      "No derivative instruments in use; all exposures are direct property or mortgage positions.",
      "Minimal derivative use; limited to plain-vanilla interest rate swaps for liability hedging only.",
      "Moderate derivative use; standard hedging instruments with periodic mark-to-market; disclosed in OM.",
      "Active derivative use; some speculative or leveraged positions; material counterparty exposure.",
      "Extensive or complex derivative use; significant leverage amplification; limited transparency on positions.",
    ],
  },
  {
    name: "Pricing Risk", displayName: "Pricing Risk", weight: 0.03,
    desc: "Valuation opacity and IFRS NAV reliability",
    criteria: [
      "Quarterly independent appraisals by named national firm (e.g., CBRE or Cushman & Wakefield); majority-independent valuation committee; transaction-benchmarked NAV.",
      "Semi-annual independent appraisals; independent NAV review; consistent named appraisal firm.",
      "Annual independent AACI appraisals; standard exempt-market valuation; NAV updated annually or at acquisition.",
      "Annual appraisals with manager influence on key assumptions; limited independent valuation oversight; infrequent third-party benchmarking.",
      "Manager-directed valuations; no independent third-party appraisal; cost-method accounting; no valuation committee or independent governance of NAV.",
    ],
  },
  {
    name: "Interest Rate", displayName: "Interest Rate Risk — Mortgage Time to Maturity", weight: 0.03,
    desc: "Portfolio sensitivity to rate movements",
    criteria: [
      "Weighted avg remaining mortgage debt term over 7 years; 100% fixed-rate; no renewals due within 36 months; well-staggered maturity schedule.",
      "Weighted avg remaining debt term 5–7 years; predominantly fixed-rate; minimal near-term renewals; diversified lender base.",
      "Weighted avg remaining debt term 3–5 years; mix of fixed and floating; some near-term renewals manageable in current rate environment.",
      "Weighted avg remaining debt term 1–3 years; meaningful floating-rate exposure; material near-term renewals at higher rates; DSCR sensitive to rate reset.",
      "Weighted avg remaining debt term under 1 year; primarily floating-rate or construction financing; immediate refinancing required; covenant breach risk.",
    ],
  },
  {
    name: "Derivatives OM", displayName: "Derivatives (allowable in OM)", weight: 0.02,
    desc: "Derivative permissions under OM",
    criteria: [
      "OM explicitly prohibits all derivative instruments; no carve-outs.",
      "OM permits derivatives only for liability hedging with strict notional limits.",
      "OM permits standard hedging instruments; some discretionary use allowed within stated limits.",
      "OM permits broad derivative use with limited restrictions; manager has significant discretion.",
      "OM imposes no meaningful derivative restrictions; unconstrained speculative use permitted.",
    ],
  },
  {
    name: "VaR", displayName: "Value at Risk / Drawdown", weight: 0.02,
    desc: "Statistical value-at-risk exposure",
    criteria: [
      "Maximum historical NAV drawdown under 5%; estimated stress loss under 5% in a 20% property value correction; conservative leverage provides strong equity buffer.",
      "Maximum historical drawdown 5–10%; estimated stress loss 5–10%; conservative leverage and diversification provide meaningful downside protection.",
      "Maximum historical drawdown 10–20%; estimated stress loss 10–20%; moderate leverage and sector concentration expose fund to material downside in stress scenarios.",
      "Maximum historical drawdown 20–30%; estimated stress loss 20–30%; elevated leverage amplifies asset value declines; concentrated positions intensify downside.",
      "Maximum historical drawdown over 30% or equity impairment risk in a 20%+ property value correction at current LTV; development-stage assets with no income floor.",
    ],
  },
  {
    name: "Firm AUM", displayName: "Firm AUM", weight: 0.02,
    desc: "Manager scale and organizational stability",
    criteria: [
      "Firm AUM over $5B; deep institutional investment, operations, and compliance teams; established lender relationships; robust infrastructure.",
      "Firm AUM $1B–$5B; established multi-fund platform; experienced team; solid operational and compliance capacity.",
      "Firm AUM $500M–$1B; single or dual-fund manager; adequate but not deep operational capacity; standard compliance and reporting infrastructure.",
      "Firm AUM $100M–$500M; emerging manager; limited team depth; reliance on key individuals; growing but unproven operational infrastructure.",
      "Firm AUM under $100M or experiencing rapid AUM change; single fund; minimal institutional infrastructure; operational viability risk.",
    ],
  },
  {
    name: "Distribution", displayName: "Breadth of Distribution", weight: 0.02,
    desc: "Sustainability of stated distribution yield",
    criteria: [
      "Distributed through 10 or more independent registered dealers across EMD, MFDA, and CIRO categories; broad and diverse advisor population; multiple independent suitability assessments.",
      "5–10 independent or mixed affiliated and independent dealers; meaningful distribution breadth; reasonable advisor diversity; adequate independent suitability oversight.",
      "2–5 dealers; mix of affiliated and independent; moderate distribution concentration; some independent suitability oversight present.",
      "Primarily 1–2 affiliated dealers; limited independent suitability oversight; correlated redemption pressure risk from a concentrated and likely homogeneous client base.",
      "Exclusively affiliated dealer; no independent suitability assessment; complete conflict of interest between fund manager and distribution channel; maximum correlated redemption pressure risk.",
    ],
  },
  {
    name: "FX Hedging", displayName: "Hedging Currency (actual use)", weight: 0.02,
    desc: "Currency risk mitigation in place",
    criteria: [
      "100% of foreign currency exposures hedged with rolling FX forwards; hedge effectiveness consistently above 95%; minimal residual currency risk.",
      "Predominantly hedged (80–100%); short-term gaps managed; hedging program well-documented and consistently executed.",
      "Partially hedged (40–80%); some currency exposure accepted as a matter of policy; hedging reviewed periodically.",
      "Lightly hedged (under 40%); material unhedged foreign currency exposure; ad hoc hedging approach.",
      "No currency hedging in place; full FX risk passed to investors; fund with material foreign asset exposure and no mitigation.",
    ],
  },
  {
    name: "FX OM", displayName: "Hedging Currency (allowable in OM)", weight: 0.01,
    desc: "FX exposure permitted under OM",
    criteria: [
      "OM restricts fund to domestic assets only; no foreign currency exposure permitted.",
      "OM permits limited foreign exposure (under 10%); mandatory hedging required.",
      "OM permits moderate foreign exposure (10–30%); hedging encouraged but not mandatory.",
      "OM permits significant foreign exposure (30–60%); limited hedging requirements.",
      "OM permits unrestricted foreign exposure; no hedging requirements; broad manager discretion on currency risk.",
    ],
  },
];

const STRUCTURE_SENSITIVE = new Set([
  "Liquidity", "Concentration", "Time Horizon", "Asset Class",
  "Leverage Actual", "Development", "Return Variability", "Leverage OM",
  "Interest Rate", "VaR", "Derivatives Actual", "Derivatives OM",
]);

// Equiton brand palette
const EQ = {
  navy:       "#2e3a55",
  navyLight:  "#3d4a6a",
  gold:       "#c9a020",
  goldLight:  "#f5edd6",
  white:      "#ffffff",
  surface:    "#f4f5f8",
  border:     "#dde0ea",
  borderDark: "#c8ccd8",
  textMuted:  "#7a8099",
};

// Compliance-oriented exclusion rationales per factor (primary first, then alternatives)
const EXCLUSION_REASONS = {
  "Liquidity": [
    "Liquidity risk deemed non-primary for this mandate based on intended long-term holding profile.",
    "Excluded because liquidity characteristics are already captured through product structure, client suitability review, and redemption policy analysis elsewhere in the assessment.",
    "Excluded due to limited material differentiation across comparable products under review.",
  ],
  "Concentration": [
    "Excluded because concentration exposure is already incorporated within broader portfolio construction and issuer diversification oversight.",
    "Single-sector concentration is intentional and inherent to the mandate.",
    "Concentration risk assessed separately at the portfolio-allocation level.",
  ],
  "Time Horizon": [
    "Excluded because client-specific holding period suitability is assessed independently from product-level risk scoring.",
    "Time horizon considerations addressed through KYC and IPS process.",
    "Criterion removed to avoid duplication with suitability review.",
  ],
  "Asset Class": [
    "Excluded because the product universe under review shares substantially similar asset-class characteristics.",
    "Asset class risk considered baseline and non-differentiating for this category.",
    "Underlying asset exposure already reflected in other active factors.",
  ],
  "Track Record": [
    "Excluded due to limited relevance for newly launched or restructured products where historical comparability is constrained.",
    "Track record deemed non-representative of current strategy composition.",
    "Historical performance not relied upon as a primary risk determinant.",
  ],
  "Mandate Scope": [
    "Excluded because OM flexibility is narrow and not considered a material risk driver for this product.",
    "Mandate constraints sufficiently addressed through compliance oversight.",
    "Scope discretion assessed as immaterial relative to core portfolio risks.",
  ],
  "Leverage Actual": [
    "Excluded because current leverage levels are temporary, transitional, or expected to fluctuate materially.",
    "Current leverage not considered representative of long-term operating profile.",
    "Leverage assessed through covenant and structural review elsewhere.",
  ],
  "Development": [
    "Excluded because the fund has no meaningful active development exposure at the time of assessment.",
    "Criterion excluded due to de minimis construction and entitlement risk.",
    "Development exposure not material to current portfolio composition.",
  ],
  "Return Variability": [
    "Excluded because historical distribution consistency is not a primary determinant of forward-looking product risk.",
    "Insufficient operating history to produce meaningful variability analysis.",
    "Return volatility assessed indirectly through leverage and asset quality metrics.",
  ],
  "Manager Discipline": [
    "Excluded because governance and mandate adherence are reviewed qualitatively through separate due diligence procedures.",
    "No evidence of style drift or mandate deviation requiring differentiated scoring.",
    "Governance oversight assessed outside the quantitative framework.",
  ],
  "Leverage OM": [
    "Excluded because maximum permitted leverage materially exceeds expected operating leverage and is not viewed as reflective of actual practice.",
    "OM leverage ceiling considered theoretical rather than operational.",
    "Actual leverage metrics deemed more relevant than permitted limits.",
  ],
  "Derivatives Actual": [
    "Excluded because the fund currently does not utilize derivative instruments in a material capacity.",
    "Derivative exposure immaterial to overall risk profile.",
    "No active derivative strategy requiring standalone assessment.",
  ],
  "Pricing Risk": [
    "Excluded because valuation methodology is externally supported and considered sufficiently robust.",
    "Independent appraisal process reduces need for separate pricing-risk weighting.",
    "NAV methodology assessed independently through due diligence review.",
  ],
  "Interest Rate": [
    "Excluded because interest-rate exposure is already embedded within leverage and debt maturity analysis.",
    "Interest-rate risk considered secondary to broader real estate fundamentals.",
    "Criterion removed to reduce overlap with financing structure review.",
  ],
  "Derivatives OM": [
    "Excluded because the OM permits only limited or non-material derivative usage.",
    "Derivative permissions considered standard and non-differentiating.",
    "No practical expectation of speculative derivative utilization.",
  ],
  "VaR": [
    "Excluded because statistical VaR models are considered unreliable for illiquid private-market assets.",
    "Historical volatility data insufficient for meaningful VaR calibration.",
    "Scenario-based stress testing preferred over quantitative VaR metrics.",
  ],
  "Firm AUM": [
    "Excluded because organizational scale is not viewed as a direct proxy for product-level risk.",
    "Manager size deemed secondary to asset quality and governance.",
    "AUM not considered materially differentiating within peer group.",
  ],
  "Distribution": [
    "Excluded because dealer concentration risk is monitored separately through compliance and redemption oversight.",
    "Distribution structure not considered a material determinant of underlying investment risk.",
    "Criterion excluded to avoid overlap with conflict-of-interest review.",
  ],
  "FX Hedging": [
    "Excluded because the fund has no material foreign currency exposure.",
    "Currency fluctuations immaterial to expected return profile.",
    "FX risk negligible due to predominantly domestic asset base.",
  ],
  "FX OM": [
    "Excluded because the OM permits minimal or no meaningful foreign currency exposure.",
    "Foreign currency flexibility considered non-core to the mandate.",
    "FX exposure constraints sufficiently narrow to render separate scoring unnecessary.",
  ],
};

const SCORE_LABELS = { 1: "Low", 2: "Low-Med", 3: "Medium", 4: "Med-High", 5: "High" };

const FACTOR_GROUPS = [
  {
    col: "left",
    groups: [
      { label: "Core Structural",        factors: ["Liquidity", "Concentration", "Time Horizon"] },
      { label: "Portfolio & Strategy",   factors: ["Asset Class", "Track Record", "Mandate Scope", "Development", "Return Variability"] },
      { label: "Leverage",               factors: ["Leverage Actual", "Leverage OM"] },
      { label: "Management & Governance",factors: ["Manager Discipline", "Pricing Risk", "Firm AUM", "Distribution"] },
    ],
  },
  {
    col: "right",
    groups: [
      { label: "Market Risk",      factors: ["Interest Rate", "VaR"] },
      { label: "Derivatives",      factors: ["Derivatives Actual", "Derivatives OM"] },
      { label: "Currency Hedging", factors: ["FX Hedging", "FX OM"] },
    ],
  },
];

const TIER_COLORS = {
  1: { color: "#2a7d4f", bg: "#e6f4ec", label: "Low" },
  2: { color: "#4a7c2f", bg: "#eef5e6", label: "Low-Med" },
  3: { color: "#b08000", bg: "#fef9e6", label: "Medium" },
  4: { color: "#c05000", bg: "#fef0e6", label: "Med-High" },
  5: { color: "#b02020", bg: "#fce8e8", label: "High" },
};

function getTier(crs) {
  if (crs < 1.25) return { label: "Low Risk",         color: "#2a7d4f", bg: "#e6f4ec" };
  if (crs < 2.25) return { label: "Low-Medium Risk",  color: "#4a7c2f", bg: "#eef5e6" };
  if (crs < 3.25) return { label: "Medium Risk",      color: "#b08000", bg: "#fef9e6" };
  if (crs < 4.25) return { label: "Medium-High Risk", color: "#c05000", bg: "#fef0e6" };
  return               { label: "High Risk",           color: "#b02020", bg: "#fce8e8" };
}

function GaugeArc({ crs }) {
  const pct = Math.min(crs / 5, 1);
  const angle = -135 + pct * 270;
  const r = 70, cx = 100, cy = 100;
  const tier = getTier(crs);

  const pt = (deg, rad) => ({
    x: cx + rad * Math.cos(deg * Math.PI / 180),
    y: cy + rad * Math.sin(deg * Math.PI / 180),
  });

  const arc = (s, e) => {
    const a = pt(s, r), b = pt(e, r);
    return `M ${a.x} ${a.y} A ${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${b.x} ${b.y}`;
  };

  const zones = [
    [-135, -81, "#2a7d4f"],
    [-81,  -27, "#4a7c2f"],
    [-27,   27, "#b08000"],
    [27,    81, "#c05000"],
    [81,   135, "#b02020"],
  ];

  const needle = pt(angle, r - 12);

  return (
    <svg viewBox="0 0 200 160" style={{ width: "100%", maxWidth: 240, display: "block" }}>
      {zones.map(([s, e, c], i) => (
        <path key={i} d={arc(s, e)} fill="none" stroke={c} strokeWidth={12} strokeLinecap="round" opacity={0.22} />
      ))}
      <path d={arc(-135, angle)} fill="none" stroke={tier.color} strokeWidth={12} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke={tier.color} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={5} fill={tier.color} />
      <text x={cx} y={cy + 32} textAnchor="middle" fontSize={22} fontWeight={600} fill={tier.color} fontFamily="Inter,Helvetica Neue,Arial,sans-serif">
        {crs.toFixed(2)}
      </text>
      <text x={cx} y={cy + 47} textAnchor="middle" fontSize={9} fill="#999" fontFamily="sans-serif">
        of 5.00
      </text>
    </svg>
  );
}

function CriteriaTable({ criteria, selectedScore }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 0, fontSize: 11, fontFamily: "sans-serif" }}>
      <thead>
        <tr style={{ background: EQ.navy }}>
          <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 700, color: EQ.gold, fontSize: 10, letterSpacing: ".08em", width: 52 }}>SCORE</th>
          <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 700, color: EQ.gold, fontSize: 10, letterSpacing: ".08em", width: 70 }}>TIER</th>
          <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 700, color: EQ.gold, fontSize: 10, letterSpacing: ".08em" }}>CRITERIA</th>
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
                borderTop: "1px solid #e8eaef",
              }}
            >
              <td style={{ padding: "7px 10px", fontWeight: isSelected ? 700 : 400, color: isSelected ? tc.color : "#666", verticalAlign: "top" }}>{v}</td>
              <td style={{ padding: "7px 10px", fontWeight: isSelected ? 700 : 400, color: isSelected ? tc.color : "#888", verticalAlign: "top", whiteSpace: "nowrap" }}>{tc.label}</td>
              <td style={{ padding: "7px 10px", fontWeight: isSelected ? 600 : 400, color: isSelected ? "#1a1a1a" : "#555", verticalAlign: "top", lineHeight: 1.5 }}>{criteria[v - 1]}</td>
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
        boxShadow: "0 1px 3px rgba(0,0,0,.25)",
      }} />
    </button>
  );
}

export default function App() {
  const [scores,       setScores]      = useState(Object.fromEntries(factors.map(f => [f.name, 3])));
  const [debtScores,   setDebtScores]  = useState(Object.fromEntries(factors.map(f => [f.name, null])));
  const [enabled,      setEnabled]     = useState(Object.fromEntries(factors.map(f => [f.name, true])));
  const [reasons,      setReasons]     = useState(Object.fromEntries(factors.map(f => [f.name, ""])));
  const [fund,         setFund]        = useState("");
  const [fundType,     setFundType]    = useState("Equity");
  const [hybridSplit,  setHybridSplit] = useState(65); // equity %
  const [openCriteria, setOpenCriteria] = useState(new Set());

  // Factors that auto-exclude by fund type (with pre-set reasons)
  const FUND_TYPE_EXCLUSIONS = {
    Equity: {},
    Debt: {
      "Development":        "Excluded — development/construction exposure is not applicable to a debt fund structure; assessed via loan underwriting criteria instead.",
      "Return Variability":  "Excluded — distribution variability analysis not applicable; income stability assessed through interest coverage and covenant compliance.",
      "Mandate Scope":      "Excluded — mandate scope assessed through loan origination policy and credit underwriting standards rather than equity investment breadth.",
    },
    Hybrid: {},
  };

  const handleFundTypeChange = (newType) => {
    setFundType(newType);
  };

  const handleReset = () => {
    setScores(Object.fromEntries(factors.map(f => [f.name, 3])));
    setDebtScores(Object.fromEntries(factors.map(f => [f.name, null])));
    setEnabled(Object.fromEntries(factors.map(f => [f.name, true])));
    setReasons(Object.fromEntries(factors.map(f => [f.name, ""])));
    setFund("");
    setFundType("Equity");
    setHybridSplit(65);
    setOpenCriteria(new Set());
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
      // Pre-populate with the primary rationale for this factor
      const presets = EXCLUSION_REASONS[name];
      if (presets && presets.length > 0) {
        setReasons(prev => ({ ...prev, [name]: presets[0] }));
      }
    }
  };

  const setReason = (name, text) => setReasons(prev => ({ ...prev, [name]: text }));

  const isHybridSS = (name) => fundType === "Hybrid" && STRUCTURE_SENSITIVE.has(name);

  // Active weight sum — excludes disabled factors and incomplete hybrid dual-score factors
  const activeWeightSum = useMemo(
    () => factors.filter(f => {
      if (!enabled[f.name]) return false;
      if (isHybridSS(f.name) && debtScores[f.name] == null) return false;
      return true;
    }).reduce((s, f) => s + f.weight, 0),
    [enabled, fundType, debtScores]
  );

  const contribs = useMemo(() => factors.map(f => {
    const isOn = enabled[f.name];
    const needsDual = isHybridSS(f.name);
    const dScore = debtScores[f.name];
    const isComplete = !needsDual || dScore != null;
    const canContribute = isOn && isComplete;

    const blendedScore = needsDual && dScore != null
      ? scores[f.name] * (hybridSplit / 100) + dScore * ((100 - hybridSplit) / 100)
      : scores[f.name];

    const effectiveWeight = canContribute && activeWeightSum > 0 ? f.weight / activeWeightSum : 0;

    return {
      ...f,
      isOn,
      isComplete,
      needsDual,
      score: scores[f.name],
      debtScore: dScore,
      blendedScore,
      effectiveWeight,
      contrib: canContribute ? blendedScore * effectiveWeight : 0,
    };
  }), [scores, debtScores, enabled, fundType, hybridSplit, activeWeightSum]);

  const CRS     = useMemo(() => contribs.reduce((s, f) => s + f.contrib, 0), [contribs]);
  const activeContribs = useMemo(() => contribs.filter(f => f.isOn), [contribs]);
  const maxC    = useMemo(() => Math.max(...activeContribs.map(f => f.contrib), 0.001), [activeContribs]);
  const tier    = getTier(CRS);
  const top5    = [...activeContribs].sort((a, b) => b.contrib - a.contrib).slice(0, 5);
  const disabledCount = factors.length - activeContribs.length;
  const today   = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  const generateReport = () => {
    const tierBadgeColor = tier.color;
    const tierBgColor    = tier.bg;

    const factorRows = contribs.map((f, idx) => {
      const tc = TIER_COLORS[f.score] || TIER_COLORS[3];
      const weightPct = f.isOn ? (f.effectiveWeight * 100).toFixed(1) : "—";
      const basePct   = (f.weight * 100).toFixed(0);
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
                <span style="font-weight:700;font-size:13px;color:#2e3a55;">${f.name}</span>
                <span style="font-size:10px;color:#7a8099;margin-left:6px;">${f.desc}</span>
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

      return `
        <div style="margin-bottom:14px;border:1px solid #dde0ea;border-radius:6px;overflow:hidden;page-break-inside:avoid;">
          <div style="background:#f9fafc;border-bottom:1px solid #dde0ea;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <span style="font-size:10px;color:#c9a020;font-weight:800;margin-right:6px;">#${idx + 1}</span>
              <span style="font-weight:700;font-size:13px;color:#2e3a55;">${f.name}</span>
              <span style="font-size:10px;color:#7a8099;margin-left:6px;">${f.desc}</span>
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
        </div>`;
    }).join("");

    const top5Rows = top5.map((f, i) => `
      <tr>
        <td style="padding:6px 10px;font-size:12px;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:#2e3a55;border:2px solid #c9a020;color:#c9a020;font-size:9px;font-weight:800;margin-right:8px;">${i + 1}</span>
          ${f.name}
        </td>
        <td style="padding:6px 10px;font-size:11px;color:#7a8099;">${(f.effectiveWeight * 100).toFixed(1)}% wt</td>
        <td style="padding:6px 10px;font-size:12px;font-weight:600;color:#2e3a55;">${f.score} — ${TIER_COLORS[f.score].label}</td>
        <td style="padding:6px 10px;font-size:12px;font-family:sans-serif;text-align:right;">${f.contrib.toFixed(3)}</td>
      </tr>`).join("");

    const tierRefRows = [
      ["< 1.25",      "Low Risk",          "#2a7d4f", "#e6f4ec"],
      ["1.25 – 2.24", "Low-Medium Risk",   "#4a7c2f", "#eef5e6"],
      ["2.25 – 3.24", "Medium Risk",       "#b08000", "#fef9e6"],
      ["3.25 – 4.24", "Medium-High Risk",  "#c05000", "#fef0e6"],
      ["≥ 4.25",      "High Risk",         "#b02020", "#fce8e8"],
    ].map(([range, label, color, bg]) => {
      const isCurrent = tier.label === label;
      return `<tr style="background:${isCurrent ? bg : "transparent"};">
        <td style="padding:5px 10px;font-size:11px;color:#7a8099;">${range}</td>
        <td style="padding:5px 10px;font-size:11px;font-weight:${isCurrent ? 700 : 500};color:${color};">${label}${isCurrent ? " ◀" : ""}</td>
      </tr>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>KYP Risk Report — ${fund}</title>
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
  <span style="font-size:11px;color:#7a8099;letter-spacing:.05em;">KYP Risk Report &nbsp;—&nbsp; ${fund}</span>
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
      <div style="font-size:9px;letter-spacing:.18em;color:#c9a020;text-transform:uppercase;font-weight:700;margin-bottom:6px;">Equiton Capital — Know Your Product (KYP) Risk Assessment</div>
      <div style="font-size:22px;font-weight:800;color:#ffffff;">${fund || "Unnamed Fund"}</div>
      <div style="font-size:11px;color:#c8ccd8;margin-top:4px;">
        <span style="background:#c9a020;color:#2e3a55;padding:1px 8px;border-radius:3px;font-weight:700;font-size:10px;margin-right:8px;">${fundType} Fund${fundType === "Hybrid" ? ` — ${hybridSplit}% Equity / ${100 - hybridSplit}% Debt` : ""}</span>
        20-Factor Composite Risk Score Model &nbsp;|&nbsp; Version 3.0
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
  <strong style="color:#2e3a55;">Methodology:</strong>
  CRS = Σ (Score<sub>i</sub> × EffectiveWeight<sub>i</sub>) across all active factors.
  When factors are excluded, remaining weights are scaled proportionally so the CRS remains on the 1–5 scale.
  Active factors: ${activeContribs.length} / ${factors.length}. &nbsp; Report generated: ${new Date().toLocaleString("en-CA")}.
</div>

<script>
  // Auto-open print dialog after a short delay for rendering
  setTimeout(() => window.print(), 600);
</script>
</body>
</html>`;

    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  };

  return (
    <div style={{ fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", background: EQ.surface, minHeight: "100vh", color: "#1a1a1a" }}>

      {/* ── Header ── */}
      <div style={{ background: EQ.navy, padding: "0 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: `3px solid ${EQ.gold}`, paddingBottom: 0 }}>
          <div style={{ padding: "18px 0 14px" }}>
            <div style={{ fontSize: 10, letterSpacing: ".18em", color: EQ.gold, textTransform: "uppercase", marginBottom: 5, fontWeight: 700 }}>
              Equiton Capital — KYP Risk Assessment
            </div>
            <div style={{ fontSize: 21, fontWeight: 700, color: "#ffffff", minHeight: 32 }}>
              {fund || <span style={{ color: "#7a8099", fontStyle: "italic", fontWeight: 400, fontSize: 16 }}>Enter fund name below →</span>}
            </div>
            <div style={{ fontSize: 10, color: EQ.gold, marginTop: 3, opacity: 0.7 }}>
              {fundType} Fund
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "18px 0 14px" }}>
            {/* Date + factor count */}
            <div style={{ textAlign: "right", borderRight: `1px solid ${EQ.gold}30`, paddingRight: 24 }}>
              <div style={{ fontSize: 9, color: EQ.gold, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 2 }}>Assessment Date</div>
              <div style={{ fontSize: 13, color: "#ffffff", fontWeight: 600 }}>{today}</div>
              <div style={{ fontSize: 9, color: "#7a8099", marginTop: 3 }}>{activeContribs.length} of {factors.length} factors active</div>
            </div>
            {/* Reset button */}
            <button
              onClick={handleReset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "transparent",
                color: "#ffffff",
                border: `1px solid ${EQ.gold}60`,
                borderRadius: 5,
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
              ↺ Reset
            </button>
            {/* Print button */}
            <button
              onClick={generateReport}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: EQ.gold,
                color: EQ.navy,
                border: "none",
                borderRadius: 5,
                padding: "10px 20px",
                fontSize: 12,
                fontWeight: 800,
                fontFamily: "inherit",
                cursor: "pointer",
                letterSpacing: ".06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(201,160,32,.35)",
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
          <div style={{ background: EQ.white, borderRadius: 6, border: `1px solid ${EQ.border}`, padding: "16px 12px 12px", boxShadow: "0 1px 4px rgba(46,58,85,.07)" }}>
            <GaugeArc crs={CRS} />
            <div style={{ marginTop: 10, padding: "10px 14px", background: tier.bg, borderRadius: 5, border: `1px solid ${tier.color}33`, textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: tier.color }}>{tier.label}</div>
              <div style={{ fontSize: 11, color: tier.color, opacity: 0.8, marginTop: 2 }}>CRS: {CRS.toFixed(2)} / 5.00</div>
            </div>
          </div>

          {/* Top Risk Drivers */}
          <div style={{ marginTop: 16, background: EQ.white, borderRadius: 6, border: `1px solid ${EQ.border}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(46,58,85,.07)" }}>
            <div style={{ background: EQ.navy, padding: "8px 14px" }}>
              <span style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: EQ.gold, fontWeight: 700 }}>Top Risk Drivers</span>
            </div>
            <div style={{ padding: "12px 14px" }}>
              {top5.map((f, i) => (
                <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: i < 4 ? 9 : 0, paddingBottom: i < 4 ? 9 : 0, borderBottom: i < 4 ? `1px solid ${EQ.border}` : "none" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: EQ.navy, border: `2px solid ${EQ.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: EQ.gold, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, fontSize: 12, fontWeight: 500, color: EQ.navy }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: EQ.textMuted, fontFamily: "sans-serif" }}>{f.contrib.toFixed(3)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Tier Reference */}
          <div style={{ marginTop: 16, background: EQ.white, borderRadius: 6, border: `1px solid ${EQ.border}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(46,58,85,.07)" }}>
            <div style={{ background: EQ.navy, padding: "8px 14px" }}>
              <span style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: EQ.gold, fontWeight: 700 }}>Risk Tier Reference</span>
            </div>
            <div style={{ padding: "12px 14px" }}>
              {[
                ["< 1.25",      "Low",          "#2a7d4f"],
                ["1.25 – 2.24", "Low-Medium",   "#4a7c2f"],
                ["2.25 – 3.24", "Medium",       "#b08000"],
                ["3.25 – 4.24", "Medium-High",  "#c05000"],
                ["≥ 4.25",      "High",         "#b02020"],
              ].map(([range, label, color], i, arr) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, paddingBottom: i < arr.length - 1 ? 7 : 0, marginBottom: i < arr.length - 1 ? 7 : 0, borderBottom: i < arr.length - 1 ? `1px solid ${EQ.border}` : "none" }}>
                  <span style={{ color: EQ.textMuted, fontFamily: "sans-serif" }}>{range}</span>
                  <span style={{ color, fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score Breakdown */}
          <div style={{ marginTop: 16, background: EQ.white, borderRadius: 6, border: `1px solid ${EQ.border}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(46,58,85,.07)" }}>
            <div style={{ background: EQ.navy, padding: "8px 14px" }}>
              <span style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: EQ.gold, fontWeight: 700 }}>Score Breakdown</span>
            </div>
            <div style={{ padding: "10px 14px 6px" }}>
              <div style={{ fontSize: 10, color: EQ.textMuted, fontStyle: "italic", marginBottom: 8 }}>Weights reflect active factors only and sum to 100%.</div>
              {/* Header row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 42px 42px", gap: 4, paddingBottom: 6, borderBottom: `1px solid ${EQ.border}`, marginBottom: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: EQ.textMuted }}>Factor</span>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: EQ.textMuted, textAlign: "right" }}>Eff. Wt</span>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: EQ.textMuted, textAlign: "right" }}>Wtd</span>
              </div>
              {/* Factor rows */}
              {contribs.map((f, i) => (
                <div key={f.name} style={{ padding: "4px 0", borderBottom: i < contribs.length - 1 ? `1px solid ${EQ.border}88` : "none", opacity: f.isOn ? 1 : 0.38 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 42px 42px", gap: 4 }}>
                    <span style={{ fontSize: 10, color: EQ.navy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.displayName}</span>
                    <span style={{ fontSize: 10, color: EQ.textMuted, textAlign: "right", fontFamily: "monospace" }}>{f.isOn && f.isComplete ? (f.effectiveWeight * 100).toFixed(1) + "%" : "—"}</span>
                    <span style={{ fontSize: 10, color: f.isOn && !f.isComplete ? "#c05000" : EQ.navy, textAlign: "right", fontFamily: "monospace" }}>{f.isOn && f.isComplete ? f.contrib.toFixed(3) : f.isOn && !f.isComplete ? "incmpl" : "—"}</span>
                  </div>
                  {f.needsDual && f.isOn && (
                    <div style={{ fontSize: 9, color: EQ.textMuted, fontFamily: "monospace", marginTop: 1 }}>
                      E:{f.score} / D:{f.debtScore ?? "?"}
                    </div>
                  )}
                </div>
              ))}
              {/* Total row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 42px 42px", gap: 4, paddingTop: 7, marginTop: 3, borderTop: `2px solid ${EQ.navy}` }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: EQ.navy }}>Total</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: EQ.navy, textAlign: "right", fontFamily: "monospace" }}>—</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: EQ.navy, textAlign: "right", fontFamily: "monospace" }}>{CRS.toFixed(3)}</span>
              </div>
              {fundType === "Hybrid" && (
                <div style={{ marginTop: 8, fontSize: 9, color: EQ.textMuted, fontStyle: "italic" }}>* Blended score (Eq × {hybridSplit}% + Dt × {100 - hybridSplit}%)</div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div>

          {/* ── Fund Details Card ── */}
          <div style={{ background: EQ.white, borderRadius: 6, border: `1px solid ${EQ.border}`, marginBottom: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(46,58,85,.07)" }}>
            <div style={{ background: EQ.navy, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13 }}>🏢</span>
              <span style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: EQ.gold, fontWeight: 700 }}>Fund Details</span>
            </div>
            <div style={{ padding: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start" }}>

                {/* Fund Name */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: EQ.textMuted, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>Fund Name</div>
                  <input
                    value={fund}
                    onChange={e => setFund(e.target.value)}
                    placeholder="Enter fund name..."
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      fontSize: 13,
                      fontFamily: "inherit",
                      border: `1px solid ${EQ.border}`,
                      borderRadius: 5,
                      background: EQ.surface,
                      color: EQ.navy,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = EQ.gold}
                    onBlur={e => e.target.style.borderColor = EQ.border}
                  />
                </div>

                {/* Fund Type */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: EQ.textMuted, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>Fund Type</div>
                  <div style={{ display: "flex", gap: 0, border: `1px solid ${EQ.border}`, borderRadius: 5, overflow: "hidden" }}>
                    {["Equity", "Debt", "Hybrid"].map((type, i) => {
                      const isActive = fundType === type;
                      return (
                        <button
                          key={type}
                          onClick={() => handleFundTypeChange(type)}
                          style={{
                            padding: "8px 20px",
                            fontSize: 13,
                            fontWeight: isActive ? 700 : 500,
                            fontFamily: "inherit",
                            cursor: "pointer",
                            border: "none",
                            borderLeft: i > 0 ? `1px solid ${EQ.border}` : "none",
                            background: isActive ? EQ.navy : EQ.white,
                            color: isActive ? EQ.gold : EQ.textMuted,
                            transition: "all .15s ease",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Hybrid slider */}
              {fundType === "Hybrid" && (
                <div style={{ marginTop: 14, padding: "12px 14px", background: EQ.surface, borderRadius: 5, border: `1px solid ${EQ.border}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: EQ.textMuted, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>
                    Equity / Debt Component Split
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: EQ.navy, whiteSpace: "nowrap", minWidth: 52 }}>
                      {hybridSplit}% Eq
                    </span>
                    <div style={{ flex: 1, position: "relative" }}>
                      <input
                        type="range"
                        min={5} max={95} step={5}
                        value={hybridSplit}
                        onChange={e => setHybridSplit(Number(e.target.value))}
                        style={{
                          width: "100%",
                          height: 6,
                          appearance: "none",
                          WebkitAppearance: "none",
                          background: `linear-gradient(to right, ${EQ.navy} ${hybridSplit}%, #dde0ea ${hybridSplit}%)`,
                          borderRadius: 3,
                          outline: "none",
                          cursor: "pointer",
                        }}
                      />
                      <style>{`
                        input[type=range]::-webkit-slider-thumb {
                          -webkit-appearance: none;
                          width: 18px; height: 18px;
                          border-radius: 50%;
                          background: ${EQ.navy};
                          border: 2px solid #fff;
                          box-shadow: 0 1px 4px rgba(46,58,85,.35);
                          cursor: pointer;
                        }
                        input[type=range]::-moz-range-thumb {
                          width: 18px; height: 18px;
                          border-radius: 50%;
                          background: ${EQ.navy};
                          border: 2px solid #fff;
                          box-shadow: 0 1px 4px rgba(46,58,85,.35);
                          cursor: pointer;
                        }
                      `}</style>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: EQ.gold, whiteSpace: "nowrap", minWidth: 52, textAlign: "right" }}>
                      {100 - hybridSplit}% Debt
                    </span>
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 11, color: EQ.textMuted, flexShrink: 0 }}>ⓘ</span>
                    <span style={{ fontSize: 11, color: EQ.textMuted, lineHeight: 1.5 }}>
                      12 structure-sensitive factors scored separately per component; blended using this split. 8 fund-level factors use a single score.
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ── Risk Factor Configuration Card ── */}
          {(() => {
            const factorMap = Object.fromEntries(factors.map(f => [f.name, f]));
            const allNames = factors.map(f => f.name);
            const allOn = allNames.every(n => enabled[n]);
            const allOff = allNames.every(n => !enabled[n]);

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
              <div style={{ background: EQ.white, borderRadius: 6, border: `1px solid ${EQ.border}`, marginBottom: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(46,58,85,.07)" }}>
                {/* Header */}
                <div style={{ background: EQ.white, borderBottom: `1px solid ${EQ.border}`, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>⚙</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: EQ.navy }}>Risk Factor Configuration</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={enableAll} style={{ padding: "5px 14px", fontSize: 11, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", border: `1px solid #2a7d4f`, borderRadius: 4, background: "#fff", color: "#2a7d4f" }}>
                      Enable All
                    </button>
                    <button onClick={disableAll} style={{ padding: "5px 14px", fontSize: 11, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", border: `1px solid #b02020`, borderRadius: 4, background: "#fff", color: "#b02020" }}>
                      Disable All
                    </button>
                  </div>
                </div>

                {/* Info note */}
                <div style={{ padding: "8px 16px", background: "#f9fafc", borderBottom: `1px solid ${EQ.border}`, display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 12, color: EQ.textMuted, flexShrink: 0 }}>ⓘ</span>
                  <span style={{ fontSize: 11, color: EQ.textMuted, lineHeight: 1.5 }}>
                    Toggle individual factors on or off. Disabled factors are excluded from scoring and weights are redistributed proportionally across active factors.
                  </span>
                </div>

                {/* Two-column group grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                  {FACTOR_GROUPS.map((col, ci) => (
                    <div key={ci} style={{ borderRight: ci === 0 ? `1px solid ${EQ.border}` : "none", padding: "12px 16px" }}>
                      {col.groups.map((grp, gi) => {
                        const grpOn  = grp.factors.every(n => enabled[n]);
                        const grpOff = grp.factors.every(n => !enabled[n]);
                        return (
                          <div key={gi} style={{ marginBottom: gi < col.groups.length - 1 ? 16 : 0 }}>
                            {/* Group header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: EQ.textMuted, textTransform: "uppercase", letterSpacing: ".1em" }}>{grp.label}</span>
                              <button
                                onClick={() => toggleGroup(grp.factors, grpOff)}
                                style={{ fontSize: 10, fontWeight: 700, color: EQ.navy, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textTransform: "uppercase", letterSpacing: ".05em", padding: 0 }}
                              >
                                Toggle All
                              </button>
                            </div>
                            {/* Factor rows */}
                            {grp.factors.map(name => {
                              const f = factorMap[name];
                              if (!f) return null;
                              const isOn = enabled[name];
                              return (
                                <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 8 }}>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <span style={{ fontSize: 12, color: isOn ? EQ.navy : EQ.textMuted, fontWeight: isOn ? 500 : 400, lineHeight: 1.3, display: "block" }}>
                                      {f.displayName || f.name}
                                    </span>
                                    <span style={{ fontSize: 10, color: EQ.textMuted }}>({(f.weight * 100).toFixed(0)}% base)</span>
                                  </div>
                                  <Toggle on={isOn} onChange={val => toggleFactor(name, val)} />
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
          <div style={{ background: EQ.navy, borderRadius: "6px 6px 0 0", padding: "9px 16px", marginBottom: 0 }}>
            <span style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: EQ.gold, fontWeight: 700 }}>
              Factor Scoring — 1 (Low Risk) to 5 (High Risk)
            </span>
          </div>

          <div style={{ border: `1px solid ${EQ.border}`, borderTop: "none", borderRadius: "0 0 6px 6px", background: EQ.white, padding: "16px", boxShadow: "0 1px 4px rgba(46,58,85,.07)" }}>

            {disabledCount > 0 && (
              <div style={{ marginBottom: 12, padding: "8px 12px", background: EQ.goldLight, border: `1px solid ${EQ.gold}55`, borderRadius: 4, fontSize: 11, color: "#6b5000", display: "flex", alignItems: "center", gap: 8 }}>
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
              const barColor = f.blendedScore >= 4 ? "#c05000" : f.blendedScore >= 3 ? "#b08000" : "#2a7d4f";
              const isOpen = openCriteria.has(f.name);
              const weightChanged = f.isOn && Math.abs(f.effectiveWeight - f.weight) > 0.0001;
              const reason = reasons[f.name];
              const reasonMissing = !f.isOn && !reason.trim();

              return (
                <div
                  key={f.name}
                  style={{
                    border: `1px solid ${!f.isOn && reasonMissing ? "#c05000" : f.isOn ? EQ.border : EQ.borderDark}`,
                    borderRadius: 5,
                    marginBottom: 8,
                    overflow: "hidden",
                    background: f.isOn ? EQ.white : "#f0f1f5",
                    transition: "border-color .2s ease",
                  }}
                >
                  {/* ── Factor Header Row ── */}
                  <div style={{ padding: "9px 12px 7px", display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 10, alignItems: "center", borderBottom: `1px solid ${EQ.border}`, background: f.isOn ? "#f9fafc" : "#eaecf1" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
                      <span style={{ fontSize: 10, color: f.isOn ? EQ.gold : EQ.textMuted, fontWeight: 800 }}>#{idx + 1}</span>
                      <span style={{ fontWeight: 700, fontSize: 13, color: EQ.navy }}>{f.displayName || f.name}</span>
                      <span style={{ fontSize: 10, color: EQ.textMuted, marginLeft: 2 }}>{f.desc}</span>
                    </div>

                    {/* Weight display */}
                    <div style={{ textAlign: "right", fontFamily: "sans-serif", fontSize: 11, whiteSpace: "nowrap" }}>
                      {f.isOn ? (
                        <>
                          <span style={{ fontWeight: 700, color: weightChanged ? EQ.gold : EQ.navy }}>
                            {(f.effectiveWeight * 100).toFixed(1)}%
                          </span>
                          {weightChanged && (
                            <span style={{ fontSize: 9, color: EQ.textMuted, marginLeft: 3 }}>
                              (base {(f.weight * 100).toFixed(0)}%)
                            </span>
                          )}
                          <span style={{ marginLeft: 4, color: EQ.textMuted }}>wt</span>
                        </>
                      ) : (
                        <span style={{ color: EQ.textMuted, fontStyle: "italic", fontSize: 10 }}>excluded</span>
                      )}
                    </div>

                    {/* Contribution bar */}
                    <div style={{ width: 80 }}>
                      <div style={{ position: "relative", height: 5, background: EQ.surface, borderRadius: 3 }}>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barPct}%`, background: f.isOn ? EQ.gold : "#c8ccd8", borderRadius: 3, transition: "width .25s ease" }} />
                      </div>
                      <div style={{ fontSize: 9, color: f.isOn && !f.isComplete ? "#c05000" : EQ.textMuted, marginTop: 2, fontFamily: "sans-serif", textAlign: "right" }}>
                        {f.isOn && f.isComplete ? f.contrib.toFixed(3) : f.isOn && !f.isComplete ? "incomplete" : "—"}
                      </div>
                    </div>

                    {/* Toggle */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 9, color: EQ.textMuted, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: ".06em" }}>
                        {f.isOn ? "On" : "Off"}
                      </span>
                      <Toggle on={f.isOn} onChange={val => toggleFactor(f.name, val)} />
                    </div>
                  </div>

                  {/* ── Score Buttons (disabled when off) ── */}
                  {f.isOn && (
                    <div style={{ padding: "8px 12px 6px" }}>
                      {f.needsDual ? (
                        <>
                          {/* Equity row */}
                          <div style={{ marginBottom: 6 }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: EQ.navy, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>
                              Equity Component ({hybridSplit}%)
                            </div>
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                              {[1, 2, 3, 4, 5].map(v => {
                                const tc = TIER_COLORS[v];
                                const isSelected = f.score === v;
                                return (
                                  <button key={v} onClick={() => setScores(prev => ({ ...prev, [f.name]: v }))}
                                    style={{ flex: 1, minWidth: 60, padding: "5px 4px", fontSize: 11, fontFamily: "sans-serif", cursor: "pointer", border: isSelected ? `2px solid ${tc.color}` : `1px solid ${EQ.border}`, borderRadius: 4, background: isSelected ? tc.bg : EQ.white, color: isSelected ? tc.color : EQ.textMuted, fontWeight: isSelected ? 700 : 400, transition: "all .15s ease", whiteSpace: "nowrap", textAlign: "center" }}>
                                    {v} — {tc.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          {/* Debt row */}
                          <div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: EQ.navy, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                              Debt Component ({100 - hybridSplit}%)
                              {f.debtScore == null && <span style={{ fontSize: 9, color: "#c05000", fontWeight: 600 }}>— score required to include this factor</span>}
                            </div>
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                              {[1, 2, 3, 4, 5].map(v => {
                                const tc = TIER_COLORS[v];
                                const isSelected = f.debtScore === v;
                                return (
                                  <button key={v} onClick={() => setDebtScores(prev => ({ ...prev, [f.name]: v }))}
                                    style={{ flex: 1, minWidth: 60, padding: "5px 4px", fontSize: 11, fontFamily: "sans-serif", cursor: "pointer", border: isSelected ? `2px solid ${tc.color}` : `1px solid ${EQ.border}`, borderRadius: 4, background: isSelected ? tc.bg : EQ.white, color: isSelected ? tc.color : EQ.textMuted, fontWeight: isSelected ? 700 : 400, transition: "all .15s ease", whiteSpace: "nowrap", textAlign: "center" }}>
                                    {v} — {tc.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {[1, 2, 3, 4, 5].map(v => {
                            const tc = TIER_COLORS[v];
                            const isSelected = f.score === v;
                            return (
                              <button key={v} onClick={() => setScores(prev => ({ ...prev, [f.name]: v }))}
                                style={{ flex: 1, minWidth: 60, padding: "5px 4px", fontSize: 11, fontFamily: "sans-serif", cursor: "pointer", border: isSelected ? `2px solid ${tc.color}` : `1px solid ${EQ.border}`, borderRadius: 4, background: isSelected ? tc.bg : EQ.white, color: isSelected ? tc.color : EQ.textMuted, fontWeight: isSelected ? 700 : 400, transition: "all .15s ease", whiteSpace: "nowrap", textAlign: "center" }}>
                                {v} — {tc.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Exclusion Reason ── */}
                  {!f.isOn && (
                    <div style={{ padding: "10px 12px 12px", borderTop: `1px solid ${EQ.borderDark}`, background: "#f7f8fa" }}>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: reasonMissing ? "#c05000" : EQ.navy, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
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
                          border: `1px solid ${EQ.border}`,
                          borderRadius: 4,
                          background: EQ.white,
                          color: EQ.navy,
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
                          border: `1px solid ${reasonMissing ? "#c05000" : reason.trim() ? "#2a7d4f" : EQ.border}`,
                          borderRadius: 4,
                          background: reasonMissing ? "#fef0e6" : EQ.white,
                          color: "#1a1a1a",
                          resize: "vertical",
                          outline: "none",
                          lineHeight: 1.5,
                          boxSizing: "border-box",
                        }}
                        onFocus={e => e.target.style.borderColor = EQ.gold}
                        onBlur={e => e.target.style.borderColor = reasonMissing ? "#c05000" : reason.trim() ? "#2a7d4f" : EQ.border}
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
                    <div style={{ borderTop: `1px solid ${EQ.border}` }}>
                      <CriteriaTable criteria={f.criteria} selectedScore={f.score} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* ── CRS Total ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: EQ.navy, borderRadius: 5, padding: "12px 16px", marginTop: 8 }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: EQ.gold, letterSpacing: ".04em" }}>Composite Risk Score (CRS)</span>
                <span style={{ marginLeft: 10, fontSize: 10, color: "#c8ccd8", fontFamily: "sans-serif" }}>
                  {activeContribs.length} of {factors.length} factors active
                </span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: tier.color, fontFamily: "sans-serif", background: tier.bg, padding: "2px 12px", borderRadius: 4 }}>{CRS.toFixed(3)}</span>
            </div>

            <div style={{ marginTop: 12, padding: "11px 14px", background: EQ.surface, borderRadius: 4, border: `1px solid ${EQ.border}`, fontSize: 11, color: EQ.textMuted, lineHeight: 1.65 }}>
              <strong style={{ color: EQ.navy }}>Regulatory Note:</strong> This KYP risk assessment is produced pursuant to NI 31-103 s.13.2, CIRO Rule 3800, and CSA Client Focused Reforms. Factor scores and weightings reflect internal methodology approved by the Investment Committee. CRS thresholds align with the approved product risk classification framework. This document is intended for registered adviser use only.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
