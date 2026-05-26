import React, { useState, useMemo, useEffect } from "react";

const factors = [
  {
    name: "PriceDiscovery", displayName: "Price Discovery & Pricing Risk", weight: 0.12,
    desc: "Valuation observability, pricing frequency, and governance",
    criteria: [
      "Security relies on highly observable market inputs, with frequent price discovery (e.g., daily or continuous), independent valuation, and minimal sensitivity to discretionary assumptions. Governance is strong, with robust oversight and standardized methodologies.",
      "Security uses mostly observable inputs, with regular price discovery (e.g., monthly or frequent external validation). Valuations are generally independent, though some assumptions require judgment. Sensitivity to key inputs is moderate, and governance frameworks are solid.",
      "Security relies on a mix of observable and unobservable inputs, with periodic price discovery (e.g., quarterly appraisals or infrequent market evidence). Independence may be partial, with internal models playing a meaningful role. Valuations show moderate sensitivity to assumptions, and governance is adequate but not robust.",
      "Security depends heavily on unobservable inputs, with infrequent or inconsistent price discovery. Valuations rely substantially on internal models, with limited external validation. Pricing is highly sensitive to small changes in assumptions, and governance may be weak or inconsistently applied.",
      "Security uses opaque, highly discretionary valuation practices, with minimal external oversight and rare or absent price discovery. Inputs are largely unobservable, methodologies may lack transparency, and valuations are extremely sensitive to internal assumptions. Governance is weak or absent.",
    ],
  },
  {
    name: "Liquidity", displayName: "Liquidity", weight: 0.12,
    desc: "Market depth, execution quality, and secondary market reliability",
    criteria: [
      "Security trades in deep, high volume markets with tight spreads, fast execution, and minimal price impact. Liquidity remains reliable even in stress. Settlement is standard, and multiple market makers are active.",
      "Security has generally good liquidity, but with modest frictions. Volume is moderate, spreads are slightly wider, and some slippage may occur during volatility. Liquidity can thin under stress, though dealer support is usually present.",
      "Security shows lower depth and wider spreads, and execution quality depends on timing. Trades may require staging, and liquidity varies with market regime.",
      "Security trades thinly or episodically, with wide and volatile spreads, uncertain execution, and unreliable market maker support. Liquidity deteriorates sharply during stress.",
      "Security has no meaningful secondary market, infrequent valuation, and uncertain exit timing, often measured in quarters or years. Liquidity is fully discretionary or suspended, with a high likelihood of freezes.",
    ],
  },
  {
    name: "Leverage", displayName: "Leverage", weight: 0.10,
    desc: "Actual leverage deployed and offering document limits",
    criteria: [
      "The security employs conservative borrowing in practice and is subject to highly restrictive leverage limits in the offering documents. Actual leverage is minimal and stable, supported by strong cash flow coverage. Borrowing structures are long dated, covenant strong, and predominantly fixed rate, with low refinancing risk. Fund level leverage is absent or immaterial, and leverage behaviour is disciplined. Return enhancement through borrowing is avoided. The offering documents allow only basic senior borrowing, prohibit fund level leverage, and disallow mezzanine, preferred equity, cross collateralization, or leverage stacking.",
      "The security uses moderate borrowing in practice and is governed by offering documents that permit limited, clearly defined leverage flexibility. Actual leverage is manageable and stable, with healthy cash flow coverage. Fund level leverage may be used tactically, such as for short term facilities, but not structurally. Debt structures are generally sound, though some floating rate exposure or refinancing concentration may exist. The offering documents allow senior borrowing and short term facilities, but restrict long term fund level leverage and prohibit complex stacking structures.",
      "The security employs higher but controlled leverage in practice and is governed by offering documents that allow meaningful flexibility. Actual leverage may fluctuate due to acquisitions, refinancing, or market conditions. Fund level leverage may be used periodically for liquidity, acquisitions, or portfolio management. Debt structures may include shorter maturities or partial floating rate exposure, and refinancing risk is present but manageable. The offering documents permit senior borrowing, fund level term debt, and selective use of mezzanine or preferred equity, with combined leverage caps set at levels that allow substantial borrowing.",
      "The security uses elevated leverage in practice and is governed by offering documents that provide broad flexibility. Actual leverage is high and may be volatile, with meaningful compounding effects from both asset level and fund level borrowing. Debt structures may be shorter term, floating rate, layered, or cross collateralized, which increases refinancing and interest rate risk. Cash flow coverage is thinner, and leverage behaviour may be more aggressive. The offering documents allow mezzanine debt, preferred equity, cross collateralized facilities, and long term fund level borrowing. Combined leverage caps may be soft or broadly defined.",
      "The security employs very high leverage in practice and is governed by offering documents that allow extensive or loosely constrained borrowing. Actual leverage is substantial, rising, or persistent, with significant compounding effects from multiple layers of debt. Debt terms may be short dated, opportunistic, or highly flexible, creating acute refinancing risk. Cash flow coverage is minimal, and leverage behaviour may rely heavily on borrowing to drive returns. The offering documents may allow very high maximum leverage, extensive fund level borrowing, mezzanine debt, preferred equity, cross collateralized structures, and multiple layers of leverage with few hard caps.",
    ],
  },
  {
    name: "InterestRate", displayName: "Interest Rate Risk", weight: 0.08,
    desc: "Asset/liability matching, rate sensitivity, and hedging effectiveness",
    criteria: [
      "Security holds assets with low sensitivity to interest rate movements and maintains strong asset/liability matching. Debt structures closely align with the duration and stability of underlying cash flows. Term structures are long dated, fixed rate, and well staggered, minimizing exposure to resets or refinancing cycles. Hedging programs are comprehensive, effective, and consistently applied, ensuring that interest rate volatility has minimal impact on cash flows or valuations.",
      "Security holds assets with generally low to moderate sensitivity to rate movements and maintains reasonable asset/liability alignment. Term structures are mostly fixed rate or long dated, though some exposure to resets or refinancing exists. Hedging is present and effective in most conditions, though not fully comprehensive.",
      "Security holds assets with moderate sensitivity to interest rate changes and exhibits partial asset/liability matching. Term structures may include a mix of fixed and floating rate debt, with reset frequencies that introduce periodic variability in interest costs. Hedging programs may be partial, imperfectly aligned, or inconsistently applied.",
      "Security holds assets with high sensitivity to rate movements and demonstrates weak asset/liability matching, with debt terms that do not align well with asset cash flow characteristics. Term structures may be short dated, floating rate, or concentrated, increasing exposure to resets and refinancing cycles. Hedging is limited, misaligned, or only partially effective.",
      "Security holds assets that are extremely sensitive to interest rate movements and exhibits poor asset/liability matching, with short term, floating rate, or opportunistic debt structures that amplify rate exposure. Term structures may be highly concentrated or short dated, creating acute refinancing and reset risk. Hedging is minimal, ineffective, or absent.",
    ],
  },
  {
    name: "VaR", displayName: "Value at Risk / Drawdown Risk", weight: 0.08,
    desc: "Historical drawdown depth, cash flow stability, and loss amplification",
    criteria: [
      "Security has shallow historical drawdowns, stable cash flows, and minimal leverage, with valuations that adjust smoothly and proportionately to market conditions. Liquidity stress does not meaningfully amplify losses, and downside events tend to be short lived and recover quickly.",
      "Security shows modest historical drawdowns, generally stable cash flows, and moderate leverage that does not materially amplify downside. Valuation elasticity is controlled, with limited sensitivity to small assumption changes. Liquidity stress can widen drawdowns but is usually manageable.",
      "Security exhibits meaningful historical drawdowns, moderate cash flow volatility, and leverage that can amplify losses in stress scenarios. Valuation elasticity is noticeable, with NAV sensitive to cap rate or discount rate shifts. Liquidity stress can deepen drawdowns through redemption pressure or reduced transaction activity.",
      "Security has significant historical drawdowns, volatile or cyclical cash flows, and high leverage that materially magnifies downside. Valuation elasticity is high, with NAV highly sensitive to assumption changes or market shocks. Liquidity stress can force asset sales, widen discounts, or trigger gating, deepening losses.",
      "Security shows severe historical drawdowns, highly volatile or uncertain cash flows, and leverage structures that can trigger forced sales, covenant breaches, or insolvency risk. Valuation elasticity is extreme, with NAV highly dependent on discretionary assumptions. Liquidity stress transmission is strong, often turning valuation declines into prolonged or permanent capital impairment.",
    ],
  },
  {
    name: "Concentration", displayName: "Concentration / Diversification", weight: 0.08,
    desc: "Portfolio breadth across assets, geographies, and strategies",
    criteria: [
      "Security is highly diversified across many independent exposures, with no dominant asset, theme, or geography. The portfolio has broad asset types or investment strategies and regional balance. No single holding or cluster meaningfully influences outcomes. Correlation across exposures is low, and performance is driven by a wide base of underlying assets.",
      "Security is generally well-diversified but shows moderate clustering across certain regions, asset types or investment strategies, or thematic exposures. A few holdings or segments may influence performance, but none dominate. The portfolio still benefits from meaningful diversification, and no single exposure poses outsized risk.",
      "Security shows noticeable concentration, with meaningful exposure to a limited number of regions, asset types or investment strategies, or thematic drivers. Performance is influenced by a smaller set of exposures. Diversification benefits are present, but only to a moderate degree.",
      "Security is narrowly diversified, with heavy reliance on a small number of holdings, regions, or asset types or investment strategies. A few exposures drive most of the performance, and the portfolio is sensitive to localized shocks.",
      "Security is highly concentrated, often dominated by a single asset or investment strategy, region, or thematic exposure. Portfolio outcomes are driven almost entirely by a single exposure or a tightly correlated cluster. Diversification benefits are minimal or nonexistent.",
    ],
  },
  {
    name: "MandateScope", displayName: "Mandate Scope & Non-Core Asset Exposure", weight: 0.07,
    desc: "Breadth of permitted investments and actual non-core exposure",
    criteria: [
      "A Low Mandate Scope Risk security operates within a narrow, clearly defined mandate with minimal allowable flexibility and negligible non core exposure. The offering documents restrict investments to a tightly focused set of asset types, with no material ability to pursue alternative strategies, higher risk opportunities, or non traditional exposures. Actual non core exposure is near zero. Deviations from the primary mandate are rare, immaterial, and fully disclosed. The strategy is straightforward, transparent, and easy to monitor.",
      "A Low Medium Mandate Scope Risk security has a reasonably defined mandate with modest flexibility to pursue related or adjacent strategies. Actual non core exposure is present but minor, typically under 10 percent, and used selectively. The offering documents allow limited deviation from the primary strategy, but such activity does not materially alter the overall risk profile. Complexity is moderate, and monitoring remains manageable.",
      "A Medium Mandate Scope Risk security has a broader mandate with meaningful flexibility across asset types, strategies, or geographies. The offering documents permit a mixed approach, and actual non-core exposure is moderate, typically 10–20 percent. Non-core positions influence risk and return characteristics, but do not dominate the portfolio. Complexity increases as the manager can shift exposures based on market conditions. This requires more oversight.",
      "A Medium High Mandate Scope Risk security has a wide or loosely defined mandate with significant discretion to pursue varied or complex strategies. The offering documents allow substantial non core activity, including higher risk, opportunistic, or non traditional exposures. Actual non core exposure is significant, typically 20–35 percent, and materially influences the portfolio's risk profile. Future composition becomes less predictable, and monitoring requires heightened oversight.",
      "A High Mandate Scope Risk security has a very broad or highly flexible mandate with few restrictions on allowable investments. The manager has wide discretion to pursue complex, multi strategy, or non traditional exposures, including extensive non core or cross asset activity. Actual non core exposure is high, typically above 35 percent, and may dominate risk and return outcomes. The portfolio's profile may diverge materially from its stated strategy, and future exposures are difficult to predict.",
    ],
  },
  {
    name: "ReturnVariability", displayName: "Variability of Return Pattern", weight: 0.06,
    desc: "Distribution stability and NAV volatility",
    criteria: [
      "Security exhibits highly stable and predictable return behaviour, with consistent distributions and minimal NAV fluctuation. Income patterns are steady across market conditions, and valuation changes are modest and infrequent. Distribution coverage is strong, and interruptions are rare.",
      "Security shows generally stable return patterns with some modest variability in distributions or NAV; income may fluctuate slightly with operating conditions, and valuation changes occur periodically but remain controlled. Distribution coverage is solid, though occasional adjustments may occur.",
      "Security demonstrates noticeable variability in distributions and NAV. Return patterns are influenced by operating performance, market conditions, or asset level events. Distributions may fluctuate meaningfully, and NAV may show moderate volatility.",
      "Security has significant variability in distributions and NAV, with return patterns heavily influenced by asset level volatility, market cycles, or operational uncertainty; distributions may be inconsistent or periodically reduced, and NAV may experience sharp or frequent adjustments.",
      "Security exhibits highly unstable return behaviour, with unpredictable or suspended distributions and substantial NAV volatility. Valuation changes may be large, frequent, or discretionary, making return outcomes difficult to forecast.",
    ],
  },
  {
    name: "TimeHorizon", displayName: "Time Horizon", weight: 0.05,
    desc: "Required holding period and alignment with economic value creation cycle",
    criteria: [
      "Security has a short term required holding period, with outcomes driven by near term market pricing rather than long cycle value creation. Liquidity is frequent and reliable, and the investment's economic horizon is closely aligned with its redemption terms. Value creation cycles are short or continuous, with no need for multi year execution.",
      "Security requires a moderate holding period, typically 1–3 years, for return drivers to fully materialize. Liquidity is periodic but reasonably aligned with the economic horizon. Value creation cycles are present but not long duration, and early exit does not materially impair outcomes.",
      "Security requires a multi year holding period, typically 3–5 years, for value creation activities to unfold. Liquidity is limited but predictable, and generally aligned with the investment's economic cycle.",
      "Security requires a long holding period, often 5–7 years. Liquidity may be restricted or uncertain relative to the economic cycle. Value creation activities are more intensive and involve complex or multi phase business plans. An early exit may impair outcomes.",
      "Security requires a very long holding period, often 7+ years, with illiquid or discretionary liquidity terms. Value creation cycles have a long duration. An early exit can significantly impair returns.",
    ],
  },
  {
    name: "ManagerDiscipline", displayName: "Manager Discipline", weight: 0.05,
    desc: "Mandate adherence, risk controls, and capital allocation consistency",
    criteria: [
      "Security is managed with strong adherence to the stated mandate, robust and consistently applied risk controls, disciplined valuation practices, and prudent capital allocation. Deviations from guidelines are rare, well justified, and fully disclosed. Processes are stable, repeatable, and supported by a long tenured team with a strong governance framework.",
      "Security shows generally strong discipline with occasional but controlled flexibility in mandate interpretation; risk controls are solid but may vary slightly across assets or market conditions. Valuation practices are sound, and capital allocation is mostly consistent with stated strategy.",
      "Security exhibits moderate discipline, with noticeable but not excessive deviations from mandate, variable application of risk controls, and valuation practices that may rely more heavily on judgment or market conditions. Capital allocation decisions may shift meaningfully over time.",
      "Security shows significant variability in adherence to mandate, with frequent or material deviations that alter the fund's risk profile. Risk controls may be inconsistently applied, and valuation practices may lack rigor or transparency. Capital allocation may be opportunistic or reactive.",
      "Security demonstrates weak adherence to mandate, limited or ineffective risk controls, discretionary or opaque valuation practices, and capital allocation that is inconsistent, aggressive, or misaligned with stated objectives. Deviations from guidelines are frequent and may introduce significant unintended risk.",
    ],
  },
  {
    name: "Governance", displayName: "Registration / Corporate Governance", weight: 0.05,
    desc: "Regulatory oversight, board independence, and reporting transparency",
    criteria: [
      "Security operates under robust regulatory oversight, with a fully independent board, strong fiduciary standards, and high quality, frequent, transparent reporting. Governance structures include independent committees, rigorous valuation oversight, and well documented conflict management frameworks.",
      "Security has solid governance, with a majority independent board, clear reporting standards, and established oversight processes. Regulatory status is defined and stable, though not as comprehensive as fully regulated structures. Conflicts are monitored, and committees exist but may not be fully independent.",
      "Security shows mixed governance quality, with limited board independence, moderate disclosure standards, and oversight processes that rely partly on internal controls. Regulatory requirements may be lighter, and conflict management frameworks exist but may not be consistently applied.",
      "Security has weak governance structures, with little or no board independence, discretionary reporting practices, and oversight that is largely internal. Regulatory status may be minimal, and conflict management processes are informal or inconsistently followed.",
      "Security operates with minimal regulatory oversight, no independent governance, and opaque or discretionary reporting. Controls are weak, conflicts may be unmanaged, and investors rely almost entirely on the manager for valuation, decision making, and oversight.",
    ],
  },
  {
    name: "TrackRecord", displayName: "Track Record / Performance", weight: 0.04,
    desc: "Performance history length, consistency, and cycle testing",
    criteria: [
      "Security has a long, well established performance history across multiple market cycles. It demonstrates consistent returns, stable volatility, and clear evidence of manager skill. Performance patterns are repeatable and supported by a long tenured management team with a disciplined process.",
      "Security has a reasonably long performance history with generally consistent results, though with some variability across cycles. The manager has meaningful, but not extensive, tenure, and the return profile shows moderate but acceptable fluctuations.",
      "Security has a moderate performance history with noticeable variability, moderate cycle testing, or mixed consistency; manager tenure may be moderate, and the return pattern shows periods of both strength and weakness.",
      "Security has a short or inconsistent performance history, limited evidence of repeatability, or returns that vary significantly across periods; manager tenure may be short, and the strategy may not have been tested through different market environments.",
      "Security has minimal or no performance history, highly inconsistent results, or returns that lack any demonstrated pattern of repeatability; manager tenure is short or unproven, and the strategy has not been tested across market cycles.",
    ],
  },
  {
    name: "KeyPerson", displayName: "Key Person & Team Stability", weight: 0.03,
    desc: "Team depth, succession planning, and individual dependency",
    criteria: [
      "The manager is supported by deep, multi layered teams, long tenured leadership, and minimal dependency on any single individual. Succession planning is fully documented, and cross training is embedded. Decision making is committee based rather than concentrated. Turnover is low, retention programs are institutional grade, and the sponsor has a proven history of maintaining team stability through market cycles.",
      "The manager has several strong senior leaders, adequate team depth, and partial succession planning. Some individuals play outsized roles, but the broader team can maintain continuity if transitions occur. Turnover is manageable, and retention structures exist, though they may not be fully institutional. Decision making is shared, though senior leaders still influence outcomes.",
      "The manager has moderate team depth, noticeable dependency on one or two senior individuals, and limited or informal succession planning. Turnover may have occurred recently or may be higher than peers. Decision making is partially centralized, and the organization may lack redundancy in critical roles such as acquisitions, asset management, or development.",
      "The manager has narrow team depth, high dependency on one or two individuals, and no formal succession plan. The organization may be founder led or CIO centric, with limited ability to redistribute responsibilities. Turnover may be elevated, and retention structures may be insufficient to ensure continuity.",
      "The manager has very limited team depth, extreme dependency on one individual or a small founding group, and no succession planning whatsoever. The fund may rely heavily on personal relationships for deal sourcing, financing, or execution. Turnover may be recent or destabilizing, and the sponsor may lack the resources to recruit or retain replacements.",
    ],
  },
  {
    name: "FirmSize", displayName: "Firm Size", weight: 0.03,
    desc: "AUM scale, team experience, and operational infrastructure",
    criteria: [
      "Security is managed by a firm with very large and stable AUM (e.g., >$20B), a highly experienced multi cycle investment team, and deep, institutional grade operational and compliance infrastructure. Scale supports specialist teams, redundancy across functions, and robust governance. The firm demonstrates long term AUM stability across cycles and maintains strong operational continuity even under stress.",
      "Security is managed by a firm with meaningful AUM (e.g., $5–20B), a capable and experienced team, and solid operational and compliance resources. The firm benefits from scale, but may not have the depth of the largest institutions. Team experience is strong, with adequate bench strength and specialization. Operational and compliance functions are reliable, though not as extensive or redundant as those of very large managers.",
      "Security is managed by a firm with moderate AUM (e.g., $1–5B), adequate but uneven team experience, and functional but limited operational and compliance capacity. Scale benefits exist, but are modest. The team may be stretched across multiple mandates, and experience may be concentrated among a few senior individuals. Operational and compliance functions are sufficient for day to day needs, but may lack depth, automation, or redundancy.",
      "Security is managed by a firm with small or volatile AUM (e.g., $250M–$1B), limited team depth, and constrained operational and compliance capacity. The team may have uneven experience or limited multi cycle exposure, and it may rely heavily on a small number of key individuals. Operational and compliance functions may be thin, manual, or reactive, increasing execution and oversight risk.",
      "Security is managed by a firm with very small, declining, or unstable AUM (e.g., < $250M), minimal team experience or depth, and weak operational and compliance infrastructure. The firm may lack the resources to maintain robust governance, risk management, or oversight, and may be vulnerable to business continuity issues or key person departures. Operational and compliance functions may be under resourced, informal, or unable to support the demands of the strategy.",
    ],
  },
  {
    name: "Distribution", displayName: "Breadth of Distribution", weight: 0.02,
    desc: "Channel diversification, dealer network breadth, and affiliated dependency",
    criteria: [
      "Security is supported by a manager with broad, multi channel distribution, a large and diversified dealer network, very low investor concentration, and minimal reliance on affiliated distribution. The fund is accessible through numerous independent channels and dealer groups. No single platform or investor type represents a material share of assets. Affiliated distribution, if present, is immaterial and does not influence platform dependency.",
      "Security is supported by a manager with several strong distribution channels, a moderately diversified dealer network, manageable investor concentration, and limited but present affiliated distribution. A few channels or dealers may represent a meaningful share of assets, but no single source dominates. Affiliated distribution may contribute to flows, but does not materially drive them.",
      "Security is supported by a manager with moderate distribution reach, a limited number of active dealers, noticeable investor concentration, and meaningful reliance on affiliated distribution. A small number of channels or dealer groups may account for a significant portion of assets. Affiliated distribution may represent a material share of flows, increasing platform dependency.",
      "Security is supported by a manager with narrow distribution, few active dealers, high investor concentration, and heavy reliance on affiliated distribution. One or two channels, dealer groups, or affiliated platforms may dominate asset flows. This creates elevated dependency on a small number of relationships or internal channels.",
      "Security is supported by a manager with very limited distribution, minimal dealer coverage, extreme investor concentration, and near total reliance on affiliated distribution. The fund may depend on a single dealer, a single platform, or an affiliated channel for the majority of assets. This creates significant vulnerability to platform decisions, internal channel changes, or investor behaviour.",
    ],
  },
  {
    name: "HedgingCurrency", displayName: "Hedging Currency", weight: 0.01,
    desc: "FX hedging instrument permissions and actual use",
    criteria: [
      "A Low Hedging Currency Risk security has offering documents that permit only plain vanilla hedging instruments such as forwards or simple swaps and restrict their use solely to risk mitigation. Tactical positioning, speculative FX exposure, synthetic leverage, or over-hedging are prohibited. Maximum hedging ratios are typically capped at or near 100 percent. Actual use is minimal, transparent, and directly tied to underlying exposures. Hedging positions closely match the risks being mitigated.",
      "A Low Medium Hedging Currency Risk security allows derivatives primarily for hedging, but includes limited flexibility for tactical or operational purposes. Offering documents may permit simple interest rate or currency derivatives beyond pure hedging, but still prohibit speculative positions or material leverage creation. Actual use is mostly hedging oriented, though occasional tactical adjustments may introduce small, manageable exposure variability. Hedging remains aligned with underlying exposures and does not materially alter the portfolio's FX profile.",
      "A Medium Hedging Currency Risk security has broader derivative permissions that allow both hedging and selective use of derivatives for portfolio management or tactical positioning. Offering documents may permit derivatives that can introduce moderate leverage or alter exposures, provided they remain within defined limits. Actual use includes hedging, but also tactical rate positioning, partial exposure shifts, or opportunistic adjustments that may imperfectly align with underlying risks.",
      "A Medium High Hedging Currency Risk security has wide derivative permissions that allow meaningful flexibility in using derivatives for leverage, exposure modification, or return enhancement. Offering documents may permit complex structures, synthetic exposures, or derivatives that can materially alter the fund's risk profile. Actual use may include large or layered positions that amplify interest rate, currency, or market sensitivity, with hedging overshadowed by exposure enhancing strategies.",
      "A High Hedging Currency Risk security has very broad or loosely defined derivative permissions, allowing extensive use of derivatives for leverage, speculation, or exposure transformation. Offering documents may permit complex, leveraged, or synthetic derivative strategies with minimal constraints, enabling significant risk amplification. Actual use may include aggressive directional positions, significant leverage creation, or derivative structures that materially reshape the fund's economic exposure beyond its underlying assets.",
    ],
  },
  {
    name: "Derivatives", displayName: "Derivatives", weight: 0.01,
    desc: "Derivative permissions and actual use for hedging vs. leverage/speculation",
    criteria: [
      "The security has highly restrictive offering documents that permit only plain vanilla hedging instruments such as interest-rate swaps, caps, or FX forwards. Derivatives cannot be used for leverage, speculation, or exposure modification. Actual use is minimal, transparent, and directly tied to underlying exposures, with no synthetic positions or leverage creation. Derivative positions closely match the risks being hedged, and the program is consistently applied.",
      "The security allows derivatives primarily for hedging, but includes limited flexibility for tactical or operational purposes. Offering documents may permit simple interest rate or currency derivatives beyond pure hedging, but still prohibit speculative positions or material leverage creation. Actual use is mostly hedging oriented, though occasional tactical adjustments may introduce small, manageable exposure variability.",
      "The security has broader permissions that allow both hedging and selective use of derivatives for portfolio management or tactical positioning. Offering documents may permit derivatives that can introduce moderate leverage or alter exposures within defined limits. Actual use includes hedging, but also tactical rate positioning, partial exposure shifts, or opportunistic adjustments that may imperfectly align with underlying risks.",
      "The security has wide derivative permissions that allow meaningful flexibility to use derivatives for leverage, exposure modification, or return enhancement. Offering documents may permit complex structures, synthetic exposures, or derivatives that can materially alter the fund's risk profile. Actual use may include large or layered positions that amplify interest rate, currency, or market sensitivity, with hedging overshadowed by exposure enhancing strategies.",
      "The security has very broad or loosely defined derivative permissions, allowing extensive use of derivatives for leverage, speculation, or exposure transformation. Offering documents may permit complex, leveraged, or synthetic strategies with minimal constraints. Actual use may include aggressive directional positions, significant leverage creation, or derivative structures that materially reshape the fund's economic exposure beyond its underlying assets.",
    ],
  },
];

// No structure-sensitive dual scoring for Equity; will be defined when Debt/Hybrid factor sets are added
const STRUCTURE_SENSITIVE = new Set([]);

// Factors excluded from the scoring model by fund type (still shown in config panel)
const FUND_TYPE_MODEL_EXCLUSIONS = {
  Equity: new Set(),
  Debt:   new Set(),
  Hybrid: new Set(),
};

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

// Compliance-oriented exclusion rationales per factor (primary first, then alternatives)
const EXCLUSION_REASONS = {
  "PriceDiscovery": [
    "Excluded because valuation methodology is externally supported, independently governed, and considered sufficiently robust to obviate a standalone pricing-risk score.",
    "Independent appraisal process and valuation committee oversight reduce the need for separate pricing-risk weighting.",
    "NAV methodology assessed independently through due diligence review; factor does not materially differentiate this product within the peer group.",
  ],
  "Liquidity": [
    "Liquidity risk deemed non-primary for this mandate based on the intended long-term holding profile and absence of redemption pressure.",
    "Excluded because liquidity characteristics are already captured through product structure, client suitability review, and redemption policy analysis elsewhere in the assessment.",
    "Excluded due to limited material differentiation across comparable products under review.",
  ],
  "Leverage": [
    "Excluded because current leverage levels are temporary, transitional, or expected to fluctuate materially, making a point-in-time score unreliable.",
    "Leverage assessed through covenant, structural, and offering document review outside the quantitative scoring framework.",
    "Offering document leverage constraints and actual operating leverage are sufficiently conservative to render differentiated scoring immaterial.",
  ],
  "InterestRate": [
    "Excluded because interest-rate exposure is already embedded within the leverage and drawdown risk assessments.",
    "Interest-rate risk considered secondary to broader fundamental drivers for this product at the time of assessment.",
    "Criterion removed to reduce overlap with financing structure and duration analysis conducted separately.",
  ],
  "VaR": [
    "Excluded because statistical drawdown models are considered unreliable or unavailable for illiquid or early-stage private-market assets.",
    "Insufficient performance history to produce a meaningful drawdown or VaR assessment.",
    "Scenario-based stress testing preferred over quantitative VaR metrics for this asset class; factor assessed qualitatively through separate due diligence.",
  ],
  "Concentration": [
    "Excluded because concentration exposure is already incorporated within broader portfolio construction and issuer diversification oversight.",
    "Single-sector or single-strategy concentration is intentional and inherent to the mandate; the factor does not add discriminatory value.",
    "Concentration risk assessed separately at the portfolio-allocation level and does not require a standalone product-level score.",
  ],
  "MandateScope": [
    "Excluded because the offering documents impose narrow investment restrictions and the fund's actual non-core exposure is negligible.",
    "Mandate scope risk assessed as immaterial relative to core portfolio risks; OM constraints are sufficiently tight.",
    "Non-core asset exposure is de minimis and fully disclosed; no material discretion exists to alter the product's risk profile.",
  ],
  "ReturnVariability": [
    "Excluded because historical distribution consistency is not a primary determinant of forward-looking product risk for this mandate.",
    "Insufficient operating history to produce a meaningful return variability analysis.",
    "Distribution and NAV volatility assessed indirectly through leverage, drawdown, and asset quality metrics already included in the model.",
  ],
  "TimeHorizon": [
    "Excluded because client-specific holding period suitability is assessed independently from product-level risk scoring through the KYC and IPS process.",
    "Time horizon considerations addressed through client suitability review; the product's lock-up terms are consistent with its peer group and do not require differentiated scoring.",
    "Criterion removed to avoid duplication with suitability review conducted at the account level.",
  ],
  "ManagerDiscipline": [
    "Excluded because governance and mandate adherence are reviewed qualitatively through separate due diligence procedures and do not require a standalone quantitative score.",
    "No evidence of style drift, mandate deviation, or risk control deficiencies requiring differentiated scoring at this time.",
    "Manager discipline assessed outside the quantitative framework; scoring would not add discriminatory value for this product.",
  ],
  "Governance": [
    "Excluded because the fund operates under a clearly defined regulatory framework and governance structure that is consistent with the peer group and does not require differentiated scoring.",
    "Regulatory and governance risk assessed through qualitative due diligence review; factor does not materially differentiate this product.",
    "Independent oversight, reporting standards, and conflict management are adequate; standalone scoring is not warranted.",
  ],
  "TrackRecord": [
    "Excluded due to limited relevance for newly launched or restructured products where historical comparability is constrained.",
    "Track record deemed non-representative of the current strategy composition or team; historical performance not relied upon as a primary risk determinant.",
    "Manager's performance history assessed separately through qualitative due diligence; quantitative track record scoring not applicable.",
  ],
  "KeyPerson": [
    "Excluded because the organization demonstrates adequate team depth, succession planning, and institutional retention structures that reduce key person dependency to an immaterial level.",
    "Key person risk assessed qualitatively through separate due diligence; factor does not materially differentiate this product within the peer group.",
    "Decision making is sufficiently distributed and the team is stable; standalone scoring is not warranted at this time.",
  ],
  "FirmSize": [
    "Excluded because organizational scale is not viewed as a direct proxy for product-level risk for this mandate.",
    "Manager size deemed secondary to asset quality, governance, and team experience; AUM is not considered materially differentiating within the peer group.",
    "Firm AUM and operational capacity assessed through separate due diligence; factor does not add discriminatory value.",
  ],
  "Distribution": [
    "Excluded because dealer concentration risk is monitored separately through compliance and redemption oversight.",
    "Distribution structure not considered a material determinant of underlying investment risk for this product.",
    "Criterion excluded to avoid overlap with conflict-of-interest review conducted at the firm level.",
  ],
  "HedgingCurrency": [
    "Excluded because the fund has no material foreign currency exposure and hedging is not applicable.",
    "Currency fluctuations are immaterial to the expected return profile given the fund's predominantly domestic asset base.",
    "FX risk is negligible; offering document restrictions on foreign exposure are sufficiently narrow to render separate scoring unnecessary.",
  ],
  "Derivatives": [
    "Excluded because the fund does not currently utilize derivative instruments in a material capacity and the offering documents impose restrictive limits.",
    "Derivative exposure is immaterial to the overall risk profile; no active derivative strategy requires standalone assessment.",
    "Derivative permissions are standard and non-differentiating within the peer group; no practical expectation of speculative utilization.",
  ],
};

const SCORE_LABELS = { 1: "Low", 2: "Low-Med", 3: "Medium", 4: "Med-High", 5: "High" };

const FACTOR_GROUPS = [
  {
    col: "left",
    groups: [
      { label: "Market & Valuation Risk",  factors: ["PriceDiscovery", "Liquidity", "VaR"] },
      { label: "Portfolio Construction",   factors: ["Concentration", "MandateScope", "ReturnVariability", "TimeHorizon"] },
      { label: "Governance & Distribution",factors: ["Governance", "Distribution"] },
    ],
  },
  {
    col: "right",
    groups: [
      { label: "Capital Structure",      factors: ["Leverage", "InterestRate", "Derivatives", "HedgingCurrency"] },
      { label: "Manager & Firm Quality", factors: ["ManagerDiscipline", "TrackRecord", "KeyPerson", "FirmSize"] },
    ],
  },
];

const TIER_COLORS = {
  1: { color: "var(--tier1-color)", bg: "var(--tier1-bg)", label: "Low" },
  2: { color: "var(--tier2-color)", bg: "var(--tier2-bg)", label: "Low-Med" },
  3: { color: "var(--tier3-color)", bg: "var(--tier3-bg)", label: "Medium" },
  4: { color: "var(--tier4-color)", bg: "var(--tier4-bg)", label: "Med-High" },
  5: { color: "var(--tier5-color)", bg: "var(--tier5-bg)", label: "High" },
};

function getTier(crs) {
  if (crs < 1.25) return { label: "Low Risk",         color: "var(--tier1-color)", bg: "var(--tier1-bg)" };
  if (crs < 2.25) return { label: "Low-Medium Risk",  color: "var(--tier2-color)", bg: "var(--tier2-bg)" };
  if (crs < 3.25) return { label: "Medium Risk",      color: "var(--tier3-color)", bg: "var(--tier3-bg)" };
  if (crs < 4.25) return { label: "Medium-High Risk", color: "var(--tier4-color)", bg: "var(--tier4-bg)" };
  return               { label: "High Risk",           color: "var(--tier5-color)", bg: "var(--tier5-bg)" };
}

function GaugeArc({ crs }) {
  const score = Math.min(Math.max(crs, 0), 5);
  const pct   = score / 5;
  const angle = -135 + pct * 270;
  const tier  = getTier(score);

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
        boxShadow: "0 1px 3px rgba(0,0,0,.5)",
      }} />
    </button>
  );
}

export default function App() {
  const [scores,       setScores]      = useState(Object.fromEntries(factors.map(f => [f.name, null])));
  const [debtScores,   setDebtScores]  = useState(Object.fromEntries(factors.map(f => [f.name, null])));
  const [enabled,      setEnabled]     = useState(Object.fromEntries(factors.map(f => [f.name, true])));
  const [reasons,      setReasons]     = useState(Object.fromEntries(factors.map(f => [f.name, ""])));
  const [notes,        setNotes]       = useState(Object.fromEntries(factors.map(f => [f.name, ""])));
  const [fund,         setFund]        = useState("");
  const [fundType,     setFundType]    = useState("Equity");
  const [hybridSplit,  setHybridSplit] = useState(65); // equity %
  const [openCriteria, setOpenCriteria] = useState(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [darkMode,     setDarkMode]    = useState(() => localStorage.getItem("kyp-theme") !== "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("kyp-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Factors that auto-exclude by fund type (with pre-set reasons)
  const FUND_TYPE_EXCLUSIONS = {
    Equity: {},
    Debt:   {},
    Hybrid: {},
  };

  const handleFundTypeChange = (newType) => {
    setFundType(newType);
  };

  const handleReset = () => {
    setScores(Object.fromEntries(factors.map(f => [f.name, null])));
    setDebtScores(Object.fromEntries(factors.map(f => [f.name, null])));
    setEnabled(Object.fromEntries(factors.map(f => [f.name, true])));
    setReasons(Object.fromEntries(factors.map(f => [f.name, ""])));
    setNotes(Object.fromEntries(factors.map(f => [f.name, ""])));
    setFund("");
    setFundType("Equity");
    setHybridSplit(65);
    setOpenCriteria(new Set());
    setCollapsedGroups(new Set());
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
  const isModelExcluded = (name) => (FUND_TYPE_MODEL_EXCLUSIONS[fundType] || new Set()).has(name);

  // Active weight sum — excludes disabled, model-excluded, and incomplete hybrid factors
  const activeWeightSum = useMemo(
    () => factors.filter(f => {
      if (!enabled[f.name]) return false;
      if (isModelExcluded(f.name)) return false;
      if (scores[f.name] == null) return false;
      if (isHybridSS(f.name) && debtScores[f.name] == null) return false;
      return true;
    }).reduce((s, f) => s + f.weight, 0),
    [enabled, fundType, debtScores, scores]
  );

  const contribs = useMemo(() => factors.map(f => {
    const isOn = enabled[f.name];
    const modelExcluded = isModelExcluded(f.name);
    const needsDual = isHybridSS(f.name);
    const dScore = debtScores[f.name];
    const hasScore = scores[f.name] != null;
    const isComplete = hasScore && (!needsDual || dScore != null);
    const canContribute = isOn && !modelExcluded && isComplete;

    const blendedScore = !hasScore
      ? 0
      : needsDual && dScore != null
        ? scores[f.name] * (hybridSplit / 100) + dScore * ((100 - hybridSplit) / 100)
        : scores[f.name];

    const effectiveWeight = canContribute && activeWeightSum > 0 ? f.weight / activeWeightSum : 0;

    return {
      ...f,
      isOn,
      isComplete,
      modelExcluded,
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
              <span style="font-weight:700;font-size:13px;color:#2e3a55;">${f.displayName || f.name}</span>
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
      <div style="font-size:9px;letter-spacing:.18em;color:#c9a020;text-transform:uppercase;font-weight:700;margin-bottom:6px;">Assurican Private Wealth — Know Your Product (KYP) Risk Assessment</div>
      <div style="font-size:22px;font-weight:800;color:#ffffff;">${fund || "Unnamed Fund"}</div>
      <div style="font-size:11px;color:#c8ccd8;margin-top:4px;">
        <span style="background:#c9a020;color:#2e3a55;padding:1px 8px;border-radius:3px;font-weight:700;font-size:10px;margin-right:8px;">${fundType} Fund${fundType === "Hybrid" ? ` — ${hybridSplit}% Equity / ${100 - hybridSplit}% Debt` : ""}</span>
        17-Factor Composite Risk Score Model — Equity &nbsp;|&nbsp; Version 1.0
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
    <div style={{ fontFamily: "var(--ui-font)", background: "var(--app-bg)", minHeight: "100vh", color: "var(--text)" }}>

      {/* ── Header ── */}
      <div style={{ background: "var(--header-bg)", padding: "0 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: `3px solid ${EQ.gold}`, paddingBottom: 0 }}>
          <div style={{ padding: "18px 0 14px" }}>
            <div style={{ fontSize: 21, fontWeight: 700, color: "#ffffff" }}>
              Product Risk Assessment — Composite Risk Score Model
            </div>
            <div style={{ fontSize: 13, color: "#ffffff", marginTop: 4, opacity: 0.85 }}>
              17-Factor KYP Assessment Framework — Equity (Version 1.0)
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
              onClick={handleReset}
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
              ↺ Reset
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
            <GaugeArc crs={CRS} />
            <div style={{ marginTop: 10, padding: "10px 14px", background: tier.bg, borderRadius: "var(--radius)", border: `1px solid ${tier.color}33`, textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: tier.color }}>{tier.label}</div>
              <div style={{ fontSize: 11, color: tier.color, opacity: 0.8, marginTop: 2 }}>CRS: {CRS.toFixed(2)} / 5.00</div>
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
                  <div style={{ flex: 1, fontSize: 12, fontWeight: 500, color: "var(--text-nav)" }}>{f.name}</div>
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
              {[
                ["< 1.25",      "Low",          "var(--tier1-color)"],
                ["1.25 – 2.24", "Low-Medium",   "var(--tier2-color)"],
                ["2.25 – 3.24", "Medium",       "var(--tier3-color)"],
                ["3.25 – 4.24", "Medium-High",  "var(--tier4-color)"],
                ["≥ 4.25",      "High",         "var(--tier5-color)"],
              ].map(([range, label, color], i, arr) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, paddingBottom: i < arr.length - 1 ? 7 : 0, marginBottom: i < arr.length - 1 ? 7 : 0, borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ color: "var(--text-muted)", fontFamily: "sans-serif" }}>{range}</span>
                  <span style={{ color, fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score Breakdown */}
          {(() => {
            const scoringContribs = contribs.filter(f => !f.modelExcluded);
            const anyDisabled = scoringContribs.some(f => !f.isOn);
            const weightsNormalized = anyDisabled;
            // cols: Factor | Base Wt | [Eff. Wt if normalized] | Score | Weighted
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
                  {scoringContribs.map((f, i) => (
                    <div key={f.name} style={{ padding: "3px 0", borderBottom: i < scoringContribs.length - 1 ? "1px solid var(--border)" : "none", opacity: f.isOn ? 1 : 0.35 }}>
                      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 3, alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-nav)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.displayName}</span>
                        <span style={{ fontSize: 12, color: "var(--text-muted2)", textAlign: "right", fontFamily: "monospace" }}>{(f.weight * 100).toFixed(0)}%</span>
                        {weightsNormalized && (
                          <span style={{ fontSize: 12, color: f.isOn && f.isComplete ? EQ.gold : "var(--text-muted)", textAlign: "right", fontFamily: "monospace", fontWeight: f.isOn && f.isComplete ? 700 : 400 }}>
                            {f.isOn && f.isComplete ? (f.effectiveWeight * 100).toFixed(1) + "%" : "—"}
                          </span>
                        )}
                        <span style={{ fontSize: 13, fontWeight: 700, color: f.isOn ? EQ.gold : "var(--text-muted)", textAlign: "right", fontFamily: "monospace" }}>
                          {f.isOn && f.score != null && f.needsDual ? `E:${f.score}` : f.isOn && f.score != null ? f.score : "—"}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: f.isOn && !f.isComplete ? "var(--tier4-color)" : "var(--text-nav)", textAlign: "right", fontFamily: "monospace" }}>
                          {f.isOn && f.isComplete ? f.contrib.toFixed(3) : f.isOn && !f.isComplete ? "N/A" : "—"}
                        </span>
                      </div>
                      {f.needsDual && f.isOn && (
                        <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "monospace", marginTop: 1, textAlign: "right" }}>
                          D:{f.debtScore ?? "?"}
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Total row */}
                  <div style={{ display: "grid", gridTemplateColumns: cols, gap: 3, paddingTop: 6, marginTop: 3, borderTop: "1px solid var(--border-dark)" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-nav)" }}>Total</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-nav)", textAlign: "right", fontFamily: "monospace" }}>
                      {(scoringContribs.filter(f => f.isOn).reduce((s, f) => s + f.weight, 0) * 100).toFixed(0)}%
                    </span>
                    {weightsNormalized && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: EQ.gold, textAlign: "right", fontFamily: "monospace" }}>100%</span>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-nav)", textAlign: "right", fontFamily: "monospace" }}>—</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-nav)", textAlign: "right", fontFamily: "monospace" }}>{CRS.toFixed(3)}</span>
                  </div>
                  {fundType === "Hybrid" && (
                    <div style={{ marginTop: 6, fontSize: 9, color: "var(--text-muted)", fontStyle: "italic" }}>* Blended score (Eq × {hybridSplit}% + Dt × {100 - hybridSplit}%)</div>
                  )}
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start" }}>

                {/* Fund Name */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>Fund Name</div>
                  <input
                    value={fund}
                    onChange={e => setFund(e.target.value)}
                    placeholder="Enter fund name..."
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      fontSize: 13,
                      fontFamily: "inherit",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      background: "var(--input-bg)",
                      color: "var(--text-nav)",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = EQ.gold}
                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                  />
                </div>

                {/* Fund Type */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>Fund Type</div>
                  <div style={{ display: "flex", gap: 0, border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
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
                            borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                            background: isActive ? EQ.navy : "var(--card-bg)",
                            color: isActive ? EQ.gold : "var(--text-muted)",
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
                <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--input-bg)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>
                    Equity / Debt Component Split
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-nav)", whiteSpace: "nowrap", minWidth: 52 }}>
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
                          borderRadius: "var(--radius-xs)",
                          outline: "none",
                          cursor: "pointer",
                        }}
                      />
                      
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: EQ.gold, whiteSpace: "nowrap", minWidth: 52, textAlign: "right" }}>
                      {100 - hybridSplit}% Debt
                    </span>
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>ⓘ</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
                      Hybrid scoring will be configured when the Debt factor set is added. Scores currently reflect Equity factor definitions.
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

            const allGroupLabels = FACTOR_GROUPS.flatMap(col => col.groups.map(g => g.label));
            const expandAll  = () => setCollapsedGroups(new Set());
            const collapseAll = () => setCollapsedGroups(new Set(allGroupLabels));

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

                {/* Two-column group grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                  {FACTOR_GROUPS.map((col, ci) => (
                    <div key={ci} style={{ borderRight: ci === 0 ? "1px solid var(--border)" : "none", padding: "12px 16px" }}>
                      {col.groups.map((grp, gi) => {
                        const grpOn  = grp.factors.every(n => enabled[n]);
                        const grpOff = grp.factors.every(n => !enabled[n]);
                        return (
                          <div key={gi} style={{ marginBottom: gi < col.groups.length - 1 ? 16 : 0 }}>
                            {/* Group header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: collapsedGroups.has(grp.label) ? 0 : 8 }}>
                              <span
                                onClick={() => setCollapsedGroups(prev => {
                                  const next = new Set(prev);
                                  next.has(grp.label) ? next.delete(grp.label) : next.add(grp.label);
                                  return next;
                                })}
                                style={{ fontSize: 11, fontWeight: 700, color: "var(--text-nav)", textTransform: "uppercase", letterSpacing: ".12em", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, userSelect: "none" }}
                              >
                                <span style={{ fontSize: 8, color: "var(--text-muted)", lineHeight: 1 }}>{collapsedGroups.has(grp.label) ? "▶" : "▼"}</span>
                                {grp.label}
                              </span>
                              {!collapsedGroups.has(grp.label) && (
                                <button
                                  onClick={() => toggleGroup(grp.factors, grpOff)}
                                  style={{ fontSize: 10, fontWeight: 700, color: "var(--text-nav)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textTransform: "uppercase", letterSpacing: ".05em", padding: 0 }}
                                >
                                  Toggle All
                                </button>
                              )}
                            </div>
                            {/* Factor rows */}
                            {!collapsedGroups.has(grp.label) && grp.factors.map(name => {
                              const f = factorMap[name];
                              if (!f) return null;
                              const isOn = enabled[name];
                              return (
                                <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 }}>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <span style={{ fontSize: 14, color: isOn ? "var(--text-nav-dark)" : "var(--text-muted)", fontWeight: 700, lineHeight: 1.3, display: "block" }}>
                                      {f.displayName || f.name}
                                    </span>
                                    <span style={{ fontSize: 11, color: "var(--text-muted2)" }}>({(f.weight * 100).toFixed(0)}% base)</span>
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

            {contribs.filter(f => !f.modelExcluded).map((f, idx) => {
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
                      <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-nav)" }}>{f.displayName || f.name}</span>
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
                              (base {(f.weight * 100).toFixed(0)}%)
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
                      {f.needsDual ? (
                        <>
                          {/* Equity row */}
                          <div style={{ marginBottom: 6 }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text-nav)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>
                              Equity Component ({hybridSplit}%)
                            </div>
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                              {[1, 2, 3, 4, 5].map(v => {
                                const tc = TIER_COLORS[v];
                                const isSelected = f.score === v;
                                return (
                                  <button key={v} onClick={() => setScores(prev => ({ ...prev, [f.name]: v }))}
                                    style={{ flex: 1, minWidth: 60, padding: "5px 4px", fontSize: 11, fontFamily: "sans-serif", cursor: "pointer", border: isSelected ? `2px solid ${tc.color}` : "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: isSelected ? tc.bg : "var(--card-bg)", color: isSelected ? tc.color : "var(--text-muted)", fontWeight: isSelected ? 700 : 400, transition: "all .15s ease", whiteSpace: "nowrap", textAlign: "center" }}>
                                    {v} — {tc.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          {/* Debt row */}
                          <div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text-nav)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                              Debt Component ({100 - hybridSplit}%)
                              {f.debtScore == null && <span style={{ fontSize: 9, color: "#c05000", fontWeight: 600 }}>— score required to include this factor</span>}
                            </div>
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                              {[1, 2, 3, 4, 5].map(v => {
                                const tc = TIER_COLORS[v];
                                const isSelected = f.debtScore === v;
                                return (
                                  <button key={v} onClick={() => setDebtScores(prev => ({ ...prev, [f.name]: v }))}
                                    style={{ flex: 1, minWidth: 60, padding: "5px 4px", fontSize: 11, fontFamily: "sans-serif", cursor: "pointer", border: isSelected ? `2px solid ${tc.color}` : "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: isSelected ? tc.bg : "var(--card-bg)", color: isSelected ? tc.color : "var(--text-muted)", fontWeight: isSelected ? 700 : 400, transition: "all .15s ease", whiteSpace: "nowrap", textAlign: "center" }}>
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
                                style={{ flex: 1, minWidth: 60, padding: "5px 4px", fontSize: 11, fontFamily: "sans-serif", cursor: "pointer", border: isSelected ? `2px solid ${tc.color}` : "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: isSelected ? tc.bg : "var(--card-bg)", color: isSelected ? tc.color : "var(--text-muted)", fontWeight: isSelected ? 700 : 400, transition: "all .15s ease", whiteSpace: "nowrap", textAlign: "center" }}>
                                {v} — {tc.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
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
              <strong style={{ color: "var(--text-nav)" }}>Regulatory Note:</strong> This KYP risk assessment is produced pursuant to NI 31-103 s.13.2, CIRO Rule 3800, and CSA Client Focused Reforms. Factor scores and weightings reflect internal methodology approved by the Investment Committee. CRS thresholds align with the approved product risk classification framework. This document is intended for registered adviser use only.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
