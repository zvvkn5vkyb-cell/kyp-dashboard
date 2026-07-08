// Fund registry sourced from:
// "Equiton Debt and Equity Product - Risk Rating Summary" (Greg Placidi, June 9, 2026).
//
// Naming note: the source document is internally inconsistent in two places —
// the overview section refers to "EMIFT" and "ERIEDFT" once each, while every
// subsequent table, weighting section, and Appendix A rationale consistently
// uses "EMFIT" and "ERIED". This registry treats EMFIT and ERIED as the
// canonical app codes and surfaces the alternates only as a reference note.

export const NAMING_NOTE =
  "Source-document naming inconsistency: the overview section of the summary refers to “EMIFT” and " +
  "“ERIEDFT” once each; every subsequent table and Appendix A rationale uses “EMFIT” and “ERIED” " +
  "consistently. This dashboard uses EMFIT and ERIED as the canonical codes.";

export const FUNDS = [
  {
    code: "EMFIT",
    altCodes: ["EMIFT"],
    legalName: "Equiton Monthly Income Fund Trust",
    frameworkId: "Debt",
    strategyType: "Private Real Estate Debt",
    crs: 2.56,
    tierLabel: "Low-Medium",
    keyDrivers:
      "Short-duration secured lending with contractual cash flows and first-charge collateral security; CRS elevated by " +
      "early-stage Concentration (High), limited Track Record (High), and absence of a formal ESG policy (High), each of " +
      "which is expected to normalize as the fund scales and matures.",
    summaryInterpretation:
      "EMFIT represents the lowest-risk profile across the four funds, consistent with the contractual, short-duration, " +
      "first-charge-secured nature of private real estate lending. The CRS of 2.56 is explained by low scores on the most " +
      "structurally significant factors: Price Discovery, Liquidity, Interest Rate Risk, VaR/Drawdown, and Time Horizon. " +
      "Three High-scoring factors — Concentration/Diversification, Track Record, and ESG Governance — elevate the CRS " +
      "modestly but reflect early-stage conditions rather than structural risk. The 2.56 CRS is therefore partly a " +
      "lifecycle premium that will compress as the fund scales and matures.",
    suitability: {
      riskCapacity: "Low-Medium to High (>1.80)",
      riskTolerance: "Low-Medium to Medium-High (>1.80–4.20)",
      overallRiskProfile: "Low-Medium (core), Medium (select cases)",
      liquidityNeeds: "No need in 3+ years",
      timeHorizon: "3+ years",
      investmentObjectives: "Income / Preserve Capital, Balanced",
      narrative:
        "Suitable for clients with Low-Medium to High Risk Capacity and Risk Tolerance, investment horizons of 3+ years, " +
        "and no liquidity needs within 3 years. Appropriate for Income or Balanced objectives seeking contractual interest " +
        "and lower volatility. Could also be used in conjunction with growth funds to provide the income portion of a " +
        "balanced mandate.",
    },
    defaultScores: {
      PriceDiscovery: 2, Liquidity: 2, Leverage: 3, InterestRate: 2, VaR: 2,
      Concentration: 5, MandateScope: 3, ReturnVariability: 2, TimeHorizon: 2,
      ManagerDiscipline: 3, Registration: 2, TrackRecord: 5, KeyPerson: 3,
      ESGGovernance: 5, Cybersecurity: 1, FirmSize: 3, Distribution: 4,
      CurrencyHedging: 1, Derivatives: 1,
    },
    defaultNotes: {
      PriceDiscovery: "Short-duration secured lending with IFRS 9 ECL methodology, contractual cash flows, and primarily first-charge collateral providing frequent credit validation. Level 3 classification applies but valuation subjectivity is constrained by monthly payment performance indicators and overcollateralization.",
      Liquidity: "Short-duration loan structure (max 3-year terms, ~1-year average maturity) creates a recurring capital-recycling cadence. Liquidity is borrower-driven rather than market-driven; structured through progress-draw controls, QS oversight, and redemption pacing governance.",
      Leverage: "Reflects borrower leverage (~40% portfolio LTV currently, up to 75% permitted) rather than fund-level leverage. Enforcement pathways introduce timing and recovery uncertainty; construction loans carry cost-overrun risk. Mitigated by first-charge security, conservative underwriting, and covenant monitoring.",
      InterestRate: "Short-duration loan structure (average maturity ~1 year) allows rapid repricing and minimizes duration exposure. No fund-level leverage. Rising rates may affect borrower refinancing capacity; prepayment risk managed through one-month interest penalty.",
      VaR: "Stable contractual interest income with conservative LTVs (~40%) and first-charge security provides meaningful downside protection. Historical loss rates for comparable private credit strategies typically below 7%. Enforcement pathways introduce timing uncertainty but recovery expectations are supported by overcollateralization.",
      Concentration: "Early-stage fund with a limited number of loans and meaningful related-party seed asset concentration. No diversification yet achieved across borrower types, geographies, loan types, or charge rankings. Expected to moderate materially as the fund scales.",
      MandateScope: "Single asset class (Canadian real estate debt) but broad loan-type flexibility: residential, commercial, land, pre-development, construction, and mezzanine. Credit committee governance, sector caps, and borrower exposure limits provide oversight.",
      ReturnVariability: "Contractual interest income with monthly distributions provides a highly predictable return pattern. Variability may arise from IFRS 9 ECL provisioning, non-performing loans, or construction delays.",
      TimeHorizon: "Short-duration loan structure (max 3 years; average ~1 year) enables rapid capital recycling. Enforcement timelines and construction delays may lengthen actual horizons.",
      ManagerDiscipline: "Strong underwriting discipline and governance practices; early-stage concentration in related-party seed loans introduces incremental governance considerations. Structured credit committee, covenant monitoring, and conflict-of-interest controls are well-established.",
      Registration: "Operates under the NI 45-106 Offering Memorandum exemption with a majority-independent Board of Trustees and a structured credit committee governance overlay appropriate for a debt fund.",
      TrackRecord: "Greenfield debt fund with less than one year of operating history. No multi-cycle credit performance, no impairment history, and no demonstrated loan-loss outcomes. Expected to improve materially over a 3–5-year accumulation horizon.",
      KeyPerson: "Assessed on a platform basis reflecting Equiton Partners Inc.'s organizational structure; ownership of the manager is concentrated in a single key individual, with certain entity-level financial control functions vested in that person.",
      ESGGovernance: "Absence of any formal ESG policies at the fund level at the time of assessment. As a newly established debt fund, ESG governance infrastructure has not yet been developed. Expected to improve as the fund formalizes its ESG framework.",
      Cybersecurity: "Assessed on a platform basis. Enterprise-grade IT Cybersecurity Policy, 24/7 external threat monitoring, annual penetration testing, and a tested Disaster Recovery Plan overseen by the CEO as Disaster Planning Coordinator.",
      FirmSize: "Assessed on a platform basis. Equiton Partners Inc. manages approximately $1.7 billion in AUM across 50+ properties and 250+ professionals.",
      Distribution: "Early-stage distribution footprint concentrated within Equiton's affiliated retail channel. Expected to decline as the fund develops a performance track record and expands into wholesale and external EMD channels.",
      CurrencyHedging: "Invests exclusively in Canadian real estate assets, with all revenues, expenses, financing, and distributions denominated in Canadian dollars. No cross-border lending or currency derivative usage.",
      Derivatives: "Does not employ derivatives for leverage, speculation, or return enhancement. Offering Memorandum restricts derivative use to narrowly defined hedging purposes only.",
    },
  },
  {
    code: "ERIFT",
    altCodes: [],
    legalName: "Equiton Residential Income Fund Trust",
    frameworkId: "Equity",
    strategyType: "Stabilized Multi-Residential Equity",
    crs: 2.91,
    tierLabel: "Medium",
    keyDrivers:
      "Mature, diversified multi-residential portfolio with 10+ years of uninterrupted distributions, 4,325 units across " +
      "44 properties, and a predominantly CMHC-insured long-dated mortgage profile; CRS anchored by structural illiquidity " +
      "(Medium-High), appraisal-based valuation subjectivity, and the extended time horizon inherent to private real " +
      "estate equity.",
    summaryInterpretation:
      "ERIFT's CRS of 2.91 reflects the structural profile of a mature, well-governed, stabilized multi-residential " +
      "portfolio with exceptional performance consistency over more than a decade. The primary driver of CRS elevation " +
      "above the Low-Medium boundary is the structural illiquidity of private real estate equity, which scores Medium-High " +
      "at a 14 percent weight and cannot be eliminated through governance quality or operating history. The extended " +
      "value-realization horizon (Time Horizon: Medium-High, 5 percent weight) reinforces this effect. No other factor " +
      "scores above Medium — a meaningful governance signal for a fund with 4,325 units across 44 properties in 19 " +
      "communities and three provinces, predominantly CMHC-insured financing, uninterrupted monthly distributions, and the " +
      "strongest Track Record classification across all four funds.",
    suitability: {
      riskCapacity: "Medium to High (>2.60)",
      riskTolerance: "Medium to High (>2.60)",
      overallRiskProfile: "Medium (core) to High",
      liquidityNeeds: "No need in 5+ years",
      timeHorizon: "5+ years",
      investmentObjectives: "Income / Preserve Capital, Balanced, Growth",
      narrative:
        "Suitable for clients with Medium to High Risk Capacity and Risk Tolerance, long-term investment horizons of 5+ " +
        "years, and no anticipated liquidity needs within the next 5+ years. Appropriate for Income, Balanced, or Growth " +
        "objectives within a private real estate context.",
    },
    defaultScores: {
      PriceDiscovery: 3, Liquidity: 4, Leverage: 3, InterestRate: 3, VaR: 3,
      Concentration: 3, MandateScope: 3, ReturnVariability: 2, TimeHorizon: 4,
      ManagerDiscipline: 2, Registration: 2, TrackRecord: 1, KeyPerson: 3,
      ESGGovernance: 3, Cybersecurity: 1, FirmSize: 3, Distribution: 3,
      CurrencyHedging: 1, Derivatives: 1,
    },
    defaultNotes: {
      PriceDiscovery: "Quarterly internal valuations, periodic rotating third-party appraisals, and IFRS-compliant governance. A stabilized 44-property portfolio with Level 2 observable inputs (CMHC vacancy data, Yardi/CoStar) anchoring Level 3 cap-rate assumptions, but private-market transaction evidence remains limited or lagged.",
      Liquidity: "Monthly redemptions with 90-days' notice, subject to AALF pacing, deferral, or suspension mechanisms. Diversified operating cash flow across 4,325 units in 44 properties supports distributions but is not designed to fund sustained large-scale redemption demands. CMHC encumbrances constrain disposition speed.",
      Leverage: "Property-level leverage within 50–55% target LTV range; 90%+ CMHC-insured; ~7-year weighted-average mortgage term. Fund-level leverage used tactically for short-term bridging only. Staggered maturity profile limits refinancing concentration.",
      InterestRate: "Predominantly fixed-rate CMHC-insured mortgage profile; ~7-year weighted-average term with less than 10% maturing before 2027. Cap-rate sensitivity remains a structural feature of private multi-residential equity.",
      VaR: "No reported historical drawdown; 10+ years of uninterrupted distributions. Valuation elasticity tied to cap-rate movements and Level 3 model inputs. Leverage within 50–55% target LTV; CMHC-insured financing moderates refinancing-driven downside.",
      Concentration: "Diversification across 4,325 units, 44 properties, 19 communities, and three provinces (Ontario ~50–55%, Alberta and British Columbia comprising the balance). Concentration by asset class (Canadian multi-residential only) moderates the assessment.",
      MandateScope: "Focused multi-residential mandate with limited non-core exposure (Maison Riverain phase 1 reached stabilization in Q1 2026; non-core activity below 15% OM threshold). Geographic flexibility across Canadian provinces introduces regulatory and rent-control variability.",
      ReturnVariability: "10+ years of uninterrupted monthly distributions with no reductions. Income diversified across 4,325 units in 44 properties. NAV sensitivity to cap-rate movements introduces periodic appraisal-driven variability, moderated by the Fund's estimated 20% revenue gap-to-market.",
      TimeHorizon: "Five-or-more-year investment horizon recommended; value-add repositioning cycles are multi-year; appraisal-based NAV adjusts gradually. Weighted-average mortgage term of ~7 years reinforces long-cycle value realization.",
      ManagerDiscipline: "Consistent adherence to stated mandate; LTV within 50–55% target; 90%+ CMHC financing; related-party disclosures and formal approval processes in place. Majority-independent Board and investment committee oversight provide robust two-tier governance.",
      Registration: "Operates under the NI 45-106 Offering Memorandum exemption with a majority-independent Board of Trustees and annual audited financial statements; benefits from KPMG independent operational audits.",
      TrackRecord: "10+ years of audited performance history; uninterrupted monthly distributions; no distribution reductions; no reported capital impairment. The strongest track record classification across all four funds.",
      KeyPerson: "Assessed on a platform basis reflecting Equiton Partners Inc.'s organizational structure; ownership of the manager is concentrated in a single key individual, with certain entity-level financial control functions vested in that person.",
      ESGGovernance: "Formal ESG policies; PRI signatory; GRESB participant; periodic environmental performance reporting; energy-efficiency initiatives and tenant well-being programs embedded in asset management.",
      Cybersecurity: "Assessed on a platform basis. Enterprise-grade IT Cybersecurity Policy, 24/7 external threat monitoring, annual penetration testing, and a tested Disaster Recovery Plan overseen by the CEO as Disaster Planning Coordinator.",
      FirmSize: "Assessed on a platform basis. Equiton Partners Inc. manages approximately $1.7 billion in AUM across 50+ properties and 250+ professionals.",
      Distribution: "Distribution across 40+ independent registered dealers (EMDs, MFDs, PMs, CIRO), 10,000+ investors, and multiple intermediary channels. Affiliated flows represent approximately one-third of subscriptions.",
      CurrencyHedging: "Invests exclusively in Canadian real estate assets, with all revenues, expenses, financing, and distributions denominated in Canadian dollars. No cross-border lending or currency derivative usage.",
      Derivatives: "Does not employ derivatives for leverage, speculation, or return enhancement. Offering Memorandum restricts derivative use to narrowly defined hedging purposes only.",
    },
  },
  {
    code: "ERIED",
    altCodes: ["ERIEDFT"],
    legalName: "Equiton Real Estate Income and Development Fund Trust",
    frameworkId: "Hybrid",
    strategyType: "Hybrid — Commercial Income, Lending and Development",
    crs: 3.29,
    tierLabel: "Medium",
    keyDrivers:
      "Hybrid strategy combining stabilized commercial income, secured lending, and a multi-year GTA condominium " +
      "development pipeline; CRS elevated by Development & Construction Risk (Medium-High), Strategy Complexity " +
      "(Medium-High), Return Pattern Variability (Medium-High), and Look-Through Leverage (Medium-High), moderated by " +
      "stable commercial fundamentals and 80 consecutive months of positive returns.",
    summaryInterpretation:
      "ERIED sits just below the Medium-High boundary at 3.29, reflecting the structural complexity of a hybrid mandate " +
      "that simultaneously pursues stabilized commercial income, secured real estate lending, and a multi-phase GTA " +
      "condominium development pipeline. Unlike lifecycle-stage phenomena expected to moderate over time, ERIED's " +
      "highest-scoring factors are structural features of the strategy that will persist across market cycles. " +
      "Medium-High scores in Liquidity Risk, Development and Construction Risk, Strategy Complexity, and Return Pattern " +
      "Variability capture the realities of managing illiquid commercial assets, multi-year development projects, and " +
      "episodic development-driven capital appreciation tied to project completions in 2029 and 2030. Strong commercial " +
      "fundamentals, including 80 consecutive months of positive returns, 100 percent occupancy, and a 6.39-year " +
      "weighted-average lease term, anchor the CRS below the Medium-High threshold.",
    suitability: {
      riskCapacity: "Medium to High (>2.60)",
      riskTolerance: "Medium to High (>2.60)",
      overallRiskProfile: "Medium (core) to High",
      liquidityNeeds: "No need in 5+ years",
      timeHorizon: "5+ years",
      investmentObjectives: "Balanced, Growth",
      narrative:
        "Suitable for clients with Medium to High Risk Capacity and Risk Tolerance, long-term horizons of 5+ years, and " +
        "no liquidity needs within 5+ years. Appropriate for Balanced or Growth objectives requiring diversified exposure " +
        "across commercial income, private credit, and development.",
    },
    defaultScores: {
      PriceDiscovery: 3, Liquidity: 4, Leverage: 3, InterestRate: 3, VaR: 3,
      Concentration: 3, MandateScope: 4, ReturnVariability: 4, DevConstruction: 4, TimeHorizon: 4,
      ManagerDiscipline: 2, Registration: 2, TrackRecord: 1, KeyPerson: 3,
      ESGGovernance: 3, Cybersecurity: 1, FirmSize: 3, Distribution: 2,
      CurrencyHedging: 1, Derivatives: 1,
    },
    defaultNotes: {
      PriceDiscovery: "Layered valuation environment combining commercial appraisal-based inputs, development-stage proforma modelling, and EMFIT fund-of-funds NAV dependency. Stabilized commercial assets provide more observable inputs; development projects introduce forward-looking assumptions with limited transaction anchors.",
      Liquidity: "Monthly redemptions with a $50,000 monthly cash-redemption cap and potential issuance of Redemption Notes. Structural mismatch reflects a mix of commercial assets (illiquid), development projects (multi-year timelines to 2029–2030), and EMFIT units (themselves dependent on loan maturities).",
      Leverage: "Conservative commercial mortgage leverage (54.0% debt-to-gross-book-value); strong DSCR (1.33x) and ICR (1.98x). Development projects introduce future construction financing exposure; no fund-level leverage.",
      InterestRate: "Commercial mortgage terms averaging 1.42 years (Q1 2026) introduce near-term refinancing exposure. Development financing timelines extend to 2029–2030, exposing the fund to multiple future financing cycles. EMFIT exposure introduces additional rate sensitivity through borrower refinancing conditions.",
      VaR: "Stable commercial assets (100% occupancy, 60.7% NOI margins, 6.39-year WALT) anchor downside stability. Development projects introduce valuation elasticity driven by construction cost assumptions, absorption rates, and approval timelines.",
      Concentration: "Diversification across three real estate verticals (commercial income, lending, development). Commercial assets located in London and Guelph; development pipeline concentrated in the GTA across four projects, creating correlated exposure to municipal processes, housing demand, and construction markets.",
      MandateScope: "Three concurrent real estate strategies (commercial income, lending through EMFIT, and multi-phase GTA development) each requiring distinct expertise, oversight, and execution management. Fund-of-funds exposure adds EMFIT monitoring requirements.",
      ReturnVariability: "Stable commercial income and lending returns are supplemented by episodic development-driven capital appreciation and special distributions tied to project completions (2029–2030). Cross-strategy correlation means macroeconomic shocks can simultaneously affect commercial valuations, lending returns, and development feasibility.",
      DevConstruction: "Multi-year, multi-project GTA condominium pipeline (Vicinity Q3 2029; Sandstones Q3 2030; TEN99 Q2 2029; Wilson Station Q4 2030) requiring concurrent management of municipal approvals, design refinements, and construction cost/absorption risk across four projects simultaneously.",
      TimeHorizon: "Development pipeline extends to 2029–2030. Special distributions tied to development completions are long-dated and irregular. Commercial assets provide near-term stability, but the long-term return profile is materially influenced by development-driven capital appreciation.",
      ManagerDiscipline: "Vertically integrated development platform demonstrates structured project-level governance across municipal approvals, design, and construction. Finance Committee and trustee oversight provide oversight of commercial and lending activities.",
      Registration: "Operates under the NI 45-106 Offering Memorandum exemption with a majority-independent Board of Trustees and annual audited financial statements; audited by Ernst & Young LLP.",
      TrackRecord: "80 consecutive months of positive returns since inception (2019); stable commercial operations; Class A DRIP trailing 12-month return of 6.30%. Consistent project-milestone advancement across the development pipeline demonstrates execution discipline.",
      KeyPerson: "Assessed on a platform basis reflecting Equiton Partners Inc.'s organizational structure; ownership of the manager is concentrated in a single key individual, with certain entity-level financial control functions vested in that person.",
      ESGGovernance: "ESG governance applied across commercial, lending, and development strategies. Commercial assets maintain formal environmental performance monitoring. ESG reporting is maturing but fund-specific integration is not yet fully uniform across all three strategy verticals.",
      Cybersecurity: "Assessed on a platform basis. Enterprise-grade IT Cybersecurity Policy, 24/7 external threat monitoring, annual penetration testing, and a tested Disaster Recovery Plan overseen by the CEO as Disaster Planning Coordinator.",
      FirmSize: "Assessed on a platform basis. Equiton Partners Inc. manages approximately $1.7 billion in AUM across 50+ properties and 250+ professionals.",
      Distribution: "Growing national distribution across exempt-market channels; bilingual marketing materials; strong advisor recognition. 80 consecutive months of positive returns support advisor confidence and investor retention.",
      CurrencyHedging: "Invests exclusively in Canadian real estate assets, with all revenues, expenses, financing, and distributions denominated in Canadian dollars. No cross-border lending or currency derivative usage.",
      Derivatives: "Does not employ derivatives for leverage, speculation, or return enhancement. Offering Memorandum restricts derivative use to narrowly defined hedging purposes only.",
    },
  },
  {
    code: "ERGFI",
    altCodes: [],
    legalName: "Equiton Residential Growth Fund I Trust / LP",
    frameworkId: "Equity",
    strategyType: "Value-Add Multi-Residential Equity",
    crs: 3.51,
    tierLabel: "Medium-High",
    keyDrivers:
      "Nascent value-add fund in active acquisition and renovation mode with approximately four months of operating " +
      "history; CRS elevated by Concentration/Diversification (High), Track Record (High), Breadth of Distribution " +
      "(High), Price Discovery (Medium-High), and multiple execution-driven risk factors, consistent with the lifecycle " +
      "stage of a newly launched fund operating a capital-appreciation-oriented strategy.",
    summaryInterpretation:
      "ERGFI carries the highest CRS across the four funds, consistent with its status as a newly launched, actively " +
      "managed value-add fund with concentrated holdings, quarterly redemption caps, no audited performance history, and " +
      "a capital-appreciation-oriented return model that requires the successful completion of multi-year " +
      "acquisition-renovation-stabilization cycles before targeted returns can be realized. The CRS of 3.51 sits at the " +
      "boundary between the Medium and Medium-High tiers, reflecting a risk profile that is elevated not because the " +
      "strategy is structurally unsound, but because the fund has not yet demonstrated execution capability across a " +
      "full investment cycle. High-scoring factors in Concentration/Diversification, Track Record, and Breadth of " +
      "Distribution are lifecycle-appropriate for a fund in early deployment and are expected to moderate as the " +
      "portfolio scales, performance data accumulates, and distribution channels expand.",
    suitability: {
      riskCapacity: "Medium-High to High (>3.40)",
      riskTolerance: "Medium-High to High (>3.40)",
      overallRiskProfile: "Medium-High (core) to High",
      liquidityNeeds: "No need in 10 years",
      timeHorizon: "10+ years (core)",
      investmentObjectives: "Growth, Aggressive Growth",
      narrative:
        "Suitable for clients with Medium-High to High Risk Capacity and Risk Tolerance, long-term horizons of 10+ " +
        "years, and no liquidity needs for at least 10 years. Appropriate for Growth or Aggressive Growth objectives " +
        "focused on value-add real estate strategies. Could also be used in conjunction with EMFIT, which would provide " +
        "the income portion of a balanced mandate assuming the client's risk profile is Medium-High or High.",
    },
    defaultScores: {
      PriceDiscovery: 4, Liquidity: 4, Leverage: 3, InterestRate: 3, VaR: 4,
      Concentration: 5, MandateScope: 3, ReturnVariability: 3, TimeHorizon: 4,
      ManagerDiscipline: 2, Registration: 2, TrackRecord: 5, KeyPerson: 3,
      ESGGovernance: 3, Cybersecurity: 1, FirmSize: 3, Distribution: 5,
      CurrencyHedging: 1, Derivatives: 1,
    },
    defaultNotes: {
      PriceDiscovery: "Value-add fund with nascent portfolio and no stabilized NOI track record. Quarterly internal valuations depend heavily on renovation-timeline assumptions, projected lease-up trajectories, and post-repositioning market rents, all Level 3 inputs with elevated model sensitivity during active renovation phases.",
      Liquidity: "Quarterly redemptions with 90-days' notice, subject to a 2.5% per-quarter and 10% per-year NAV cap. More structurally restrictive than monthly redemption funds. Active renovation-stage properties may be more difficult to liquidate than stabilized assets.",
      Leverage: "Property-level mortgage financing consistent with value-add multi-residential norms. No established portfolio LTV track record given nascent status. Short-term bridge facilities may be used during renovation periods.",
      InterestRate: "Fixed-rate mortgage financing consistent with platform practice, but a fully staggered maturity profile is not yet established as a nascent fund. Pre-stabilization debt-service coverage during renovation periods introduces additional rate sensitivity.",
      VaR: "No fund-level performance history (~4 months); elevated valuation sensitivity during renovation phases where stabilized NOI has not yet been achieved. Renovation cost overruns, lease-up delays, and cap-rate shifts can affect NAV more materially than for a stabilized portfolio.",
      Concentration: "Nascent portfolio with a small initial number of acquisitions, each potentially representing a disproportionate share of NAV. Single-sector strategy with no cross-asset diversification. High rating is lifecycle-appropriate and expected to moderate as portfolio breadth increases.",
      MandateScope: "Clearly defined value-add multi-residential mandate focused on the Acquire–Enhance–Reinvest cycle. Discretion over renovation scope, capital deployment timing, and property selection introduces moderate complexity relative to a stabilized income strategy.",
      ReturnVariability: "Growth-and-capital-appreciation-oriented return profile with renovation-cycle lumpiness. During active renovation, properties may generate lower near-term income; post-renovation lease-up involves transition vacancies and incentive costs. Distributions are not guaranteed.",
      TimeHorizon: "Three-stage value-add cycle (Acquire–Enhance–Reinvest) targets a five-year-plus horizon. As a new fund, ERGFI has not yet progressed through a single full acquisition-renovation-stabilization cycle.",
      ManagerDiscipline: "Equiton platform-level governance provides a strong foundation; investment committee and majority-independent trustee oversight are in place. Fund-level discipline has not yet been demonstrated across a full investment cycle given ~4 months of operating history.",
      Registration: "Operates under the NI 45-106 Offering Memorandum exemption with a majority-independent Board of Trustees and annual audited financial statements; audited by Ernst & Young LLP.",
      TrackRecord: "Approximately four months of operating history (Trust inception February 2026; LP inception January 2026). No audited annual performance record; no full fiscal year of operations. The High rating reflects the structural absence of evidence rather than negative evidence.",
      KeyPerson: "Assessed on a platform basis reflecting Equiton Partners Inc.'s organizational structure; ownership of the manager is concentrated in a single key individual, with certain entity-level financial control functions vested in that person.",
      ESGGovernance: "Platform-level ESG practices and GRESB/PRI participation apply. As a newly launched fund, fund-specific ESG reporting has not yet been established; ESG integration at the property level will develop as the portfolio matures.",
      Cybersecurity: "Assessed on a platform basis. Enterprise-grade IT Cybersecurity Policy, 24/7 external threat monitoring, annual penetration testing, and a tested Disaster Recovery Plan overseen by the CEO as Disaster Planning Coordinator.",
      FirmSize: "Assessed on a platform basis. Equiton Partners Inc. manages approximately $1.7 billion in AUM across 50+ properties and 250+ professionals.",
      Distribution: "Newly launched fund with nascent investor base and limited dealer network relative to established Equiton vehicles. Distribution ramp supported by Equiton's existing dealer relationships and platform infrastructure; expected to moderate as distribution broadens.",
      CurrencyHedging: "Invests exclusively in Canadian real estate assets, with all revenues, expenses, financing, and distributions denominated in Canadian dollars. No cross-border lending or currency derivative usage.",
      Derivatives: "Does not employ derivatives for leverage, speculation, or return enhancement. Offering Memorandum restricts derivative use to narrowly defined hedging purposes only.",
    },
  },
];

export function getFund(code) {
  return FUNDS.find(f => f.code === code);
}
