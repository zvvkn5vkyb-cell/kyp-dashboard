// Risk-factor framework definitions sourced from:
// "Equiton Debt and Equity Product - Risk Rating Summary" (Greg Placidi, June 9, 2026).
//
// Three distinct scoring frameworks are modelled, matching the source document:
//   - Debt    (19 factors) — applied to EMFIT
//   - Equity  (19 factors) — applied to ERIFT and ERGFI
//   - Hybrid  (20 factors) — applied to ERIED
//
// All three share the same 1–5 ordinal scale, the same tier boundaries, and the same
// CRS aggregation methodology (CRS = sum(score x weight)). Only factor labels, category
// weights, and criteria wording differ by framework, per the document's "Framework
// Comparability" note.

export const CATEGORIES = {
  Structural:  "Structural / Inherent Risks",
  Financial:   "Financial & Capital Structure Risks",
  Portfolio:   "Portfolio & Strategy Execution Risks",
  Governance:  "Governance, Operational & Organizational Risks",
  Performance: "Performance & Ancillary Risks",
};

// ---------------------------------------------------------------------------
// Criteria shared verbatim across all three frameworks (platform-level factors
// the source document assesses identically "across all four funds").
// ---------------------------------------------------------------------------
const COMMON = {
  ManagerDiscipline: {
    displayName: "Manager Discipline",
    desc: "Consistency of adherence to the stated mandate, risk parameters, leverage limits, and governance policies.",
    criteria: [
      "Manager demonstrates strong, consistent adherence to the stated mandate and risk parameters. Internal controls and oversight mechanisms are well documented and consistently enforced, with no evidence of mandate drift.",
      "Manager shows generally strong discipline with occasional but controlled flexibility in mandate interpretation. Risk controls are solid but may vary slightly across assets or market conditions.",
      "Manager exhibits moderate discipline, with noticeable but not excessive deviations from mandate and risk parameters that require meaningful discretion, exercised within documented governance frameworks.",
      "Manager shows variability in adherence to mandate, with periodic deviations that could alter the fund's risk profile if not actively managed.",
      "Manager demonstrates weak or undemonstrated adherence to mandate, with limited or ineffective internal controls and a meaningful risk of mandate drift or discretion overreach.",
    ],
  },
  Registration: {
    displayName: "Registration / Corporate Governance",
    desc: "Adequacy of the fund's governance structure relative to regulatory and organizational requirements, including board independence, reporting frequency, and audit oversight.",
    criteria: [
      "Fund operates under a well-defined regulatory exemption with a fully independent board of trustees, frequent reporting, and rigorous, independently audited valuation governance.",
      "Fund operates under a clearly defined regulatory framework with a majority-independent board, quarterly reporting, and annual audited financial statements — consistent with standard exempt-market private real estate governance.",
      "Fund governance meets standard exempt-market requirements but with a smaller or newer independent-oversight track record, or less frequent third-party operational audit coverage.",
      "Fund governance is adequate but shows gaps in board independence, reporting cadence, or audit oversight relative to peer exempt-market vehicles.",
      "Fund governance falls materially short of standard exempt-market requirements, with limited board independence, infrequent reporting, or absent audit oversight.",
    ],
  },
  KeyPerson: {
    displayName: "Key Person & Team Stability",
    desc: "Dependency of the fund's investment process on specific named individuals, and the extent to which organizational depth mitigates key-person risk.",
    criteria: [
      "Decision-making is distributed across a deep, multi-layered team with two-tier governance (investment committee and majority-independent board) and no material single-individual dependency.",
      "Organization benefits from functional depth across asset management, finance, and capital markets, with two-tier governance oversight, though certain financial control functions remain concentrated in one senior individual.",
      "Organization has reasonable team depth and committee-based oversight, but a moderate degree of strategic and financial-control dependency rests with a small number of senior individuals.",
      "Organization shows narrower team depth with meaningful dependency on one or two individuals for critical decision-making or financial control functions.",
      "Organization is highly dependent on a single individual or small founding group for investment decisions and financial control, with limited redundancy or succession planning.",
    ],
  },
  ESGGovernance: {
    displayName: "ESG Governance",
    desc: "Maturity and integration of the fund's environmental, social, and governance policies, including formal ESG documentation and participation in industry frameworks (PRI, GRESB).",
    criteria: [
      "Comprehensive, formally documented ESG policies with active participation in recognized industry frameworks (e.g., PRI, GRESB), consistent reporting, and ESG considerations embedded across underwriting, asset management, and investment decision-making.",
      "Formal ESG policies exist with participation in at least one industry framework and periodic reporting; ESG integration is present across most, though not all, asset management and investment functions.",
      "ESG practices exist at the platform level with reasonable framework participation, but fund-specific ESG reporting or integration is still maturing and not yet fully uniform across the portfolio or strategy verticals.",
      "ESG policies are informal, inconsistently applied, or exist mainly at the platform level with limited fund-specific documentation; industry framework participation is minimal.",
      "No formal ESG policy exists at the fund level; ESG governance infrastructure has not yet been developed, and there is no meaningful framework participation or embedded ESG decision-making process.",
    ],
  },
  Cybersecurity: {
    displayName: "Cybersecurity & Business Continuity Governance",
    desc: "Adequacy of the manager's cybersecurity controls, data protection policies, business continuity planning, and disaster recovery procedures.",
    criteria: [
      "Enterprise-grade cybersecurity policy overseen by a dedicated security function, including MFA, encryption, role-based access, continuous vulnerability monitoring, 24/7 external threat monitoring, annual penetration testing, and a tested, formally owned disaster recovery plan.",
      "Documented cybersecurity and business continuity policies with regular testing and monitoring, though coverage or testing frequency is somewhat less comprehensive than a fully enterprise-grade program.",
      "Cybersecurity and business continuity practices are reasonably documented and applied but rely more heavily on internal resources, with less frequent independent testing or external monitoring.",
      "Cybersecurity and business continuity governance is informal, thinly resourced, or inconsistently tested, with meaningful gaps in monitoring, access controls, or recovery planning.",
      "No documented cybersecurity or business continuity/disaster recovery program is in place, or existing controls are materially inadequate relative to the scale and sensitivity of operations.",
    ],
  },
  FirmSize: {
    displayName: "Firm Size",
    desc: "Scale of the fund's manager relative to the complexity and capital demands of the strategy, including AUM, headcount, and governance infrastructure.",
    criteria: [
      "Manager has very large, stable AUM and deep, institutional-grade operational and compliance infrastructure supporting specialist teams and redundancy across functions.",
      "Manager has substantial AUM with capable, experienced teams and solid operational/compliance resources, though not at the scale of the largest institutional managers.",
      "Manager has meaningful scale — sufficient functional depth, access to financing, and investment in governance and technology infrastructure — while remaining below large national or global institutional managers.",
      "Manager has moderate AUM with adequate but uneven team experience and operational capacity that may be stretched across multiple mandates.",
      "Manager has small, declining, or unstable AUM with limited team depth and constrained operational and compliance infrastructure.",
    ],
  },
  Distribution: {
    displayName: "Breadth of Distribution",
    desc: "Breadth, maturity, and channel diversification of the fund's investor base and distribution network, including reliance on affiliated channels.",
    criteria: [
      "Broad, multi-channel distribution across a large, diversified independent dealer network with very low investor concentration and minimal reliance on affiliated channels.",
      "Distribution across a meaningful number of independent registered dealers and channels, with affiliated flows representing a modest share of subscriptions.",
      "Distribution reach is moderate, with a structural or lifecycle-stage limitation on channel breadth (e.g., OM-product channel access, or a still-developing dealer network) but no single channel dominating.",
      "Distribution is concentrated in a limited number of dealers or channels, with meaningful reliance on affiliated distribution.",
      "Distribution footprint is nascent or narrow, concentrated within an affiliated retail channel or a small number of initial investor relationships, as is typical for an early lifecycle stage.",
    ],
  },
  CurrencyHedging: {
    displayName: "Currency Hedging Risk",
    desc: "Exposure to foreign currency movements and the adequacy of any hedging arrangements for cross-border revenue, expense, or financing mismatches.",
    criteria: [
      "Fund invests exclusively in domestic assets with all revenues, expenses, financing, and distributions in the same currency; no cross-border exposure or currency derivative usage.",
      "Fund has minimal, well-hedged foreign currency exposure with no material unhedged mismatch.",
      "Fund has modest foreign currency exposure that is substantially, but not fully, hedged.",
      "Fund has meaningful unhedged or partially hedged foreign currency exposure.",
      "Fund has significant unhedged foreign currency exposure with no effective hedging program in place.",
    ],
  },
  Derivatives: {
    displayName: "Derivatives Risk",
    desc: "Use of derivative instruments, including the purpose, scope, and governance of any derivative positions.",
    criteria: [
      "Offering documents restrict derivative use to narrowly defined hedging purposes only; no derivatives are in use for leverage, speculation, or return enhancement.",
      "Derivatives are used primarily for hedging with limited flexibility for tactical or operational purposes; actual use remains hedging-oriented.",
      "Offering documents permit derivatives for both hedging and selective tactical portfolio management within defined limits.",
      "Offering documents permit meaningful use of derivatives for leverage or exposure modification beyond pure hedging.",
      "Offering documents permit extensive, loosely constrained derivative use for leverage, speculation, or exposure transformation.",
    ],
  },
  TrackRecord: {
    displayName: "Track Record & Performance",
    desc: "Length, depth, and continuity of the fund's audited performance history, including distribution consistency and the absence or presence of impairment events.",
    criteria: [
      "Long, well-established, audited performance history spanning multiple market or credit cycles, with consistent distributions and no reported capital impairment.",
      "Reasonably long audited performance history with generally consistent results and no material impairment events.",
      "Moderate performance history with some variability, or a shorter history for a fund whose strategy has nonetheless demonstrated consistent execution.",
      "Short or inconsistent performance history with limited evidence of repeatability across market or credit cycles.",
      "Minimal or no fund-level audited performance history; no full fiscal year of operations or multi-cycle track record demonstrated.",
    ],
  },
};

// ---------------------------------------------------------------------------
// Debt-framework-specific criteria (EMFIT) — private real estate lending framing.
// ---------------------------------------------------------------------------
const DEBT_SPECIFIC = {
  PriceDiscovery: {
    displayName: "Price Discovery & Pricing Risk",
    desc: "Reliability and governance of loan valuation, including reliance on IFRS 9 ECL methodology versus observable contractual payment performance.",
    criteria: [
      "Loan valuations are supported by frequent, observable contractual payment performance, robust IFRS 9 ECL methodology, and regular independent credit review, with minimal reliance on discretionary assumptions.",
      "Valuations rely on contractual cash flow validation and periodic credit review, with modest reliance on internally modelled loss assumptions and generally consistent governance.",
      "Valuations depend on a mix of contractual performance indicators and internally modelled credit assumptions (e.g., expected credit loss inputs), with periodic rather than continuous independent validation.",
      "Valuations rely significantly on internal credit models and management judgment with limited external validation, and are moderately sensitive to changes in loss assumptions or borrower performance.",
      "Valuations are highly dependent on discretionary internal credit assessments with minimal external validation or observable payment history.",
    ],
  },
  Liquidity: {
    displayName: "Liquidity Risk",
    desc: "Structural mismatch between investor redemption rights and the fund's ability to generate liquidity through loan maturities and capital recycling.",
    criteria: [
      "Short average loan maturities create frequent, contractual capital recycling; redemption capacity is closely matched to loan roll-off, with strong progress-draw and disbursement controls.",
      "Loan maturities support reasonably frequent capital recycling with generally adequate alignment between redemption terms and loan roll-off.",
      "Capital recycling is moderate in frequency; redemption terms are reasonably but not perfectly aligned with loan maturities, and pacing mechanisms may be needed periodically.",
      "Loan maturities are longer-dated or construction-linked, creating a more significant mismatch with redemption terms; pacing, deferral, or gating mechanisms are more likely to be invoked.",
      "Loan book is dominated by long-dated, illiquid, or non-performing positions with no meaningful secondary market, and redemption terms are materially mismatched to underlying loan liquidity.",
    ],
  },
  Leverage: {
    displayName: "Leverage Risk",
    desc: "Borrower-level LTV, collateral coverage, and recovery pathways available upon borrower default or construction cost overrun.",
    criteria: [
      "Borrower-level LTVs are conservative, first-charge security is standard, and covenant monitoring and underwriting discipline are strong, minimizing loss-given-default.",
      "Borrower LTVs are moderate and generally within conservative underwriting parameters, with sound collateral security and covenant monitoring.",
      "Borrower LTVs may reach the upper end of permitted ranges for a meaningful portion of the book, with adequate but less conservative collateral coverage and covenant protection.",
      "A meaningful share of the loan book carries elevated LTVs or subordinated/mezzanine positions, increasing loss-given-default risk and reliance on enforcement remedies.",
      "Loan book leverage is high or loosely constrained, with material exposure to subordinated positions, thin collateral coverage, and elevated loss-given-default risk.",
    ],
  },
  InterestRate: {
    displayName: "Interest Rate Risk",
    desc: "Duration profile of the loan book, repricing frequency, and borrower refinancing capacity under rate movements.",
    criteria: [
      "Very short average loan maturities allow rapid repricing to current market rates, with minimal duration exposure and no fund-level leverage; prepayment risk is well controlled contractually.",
      "Loan maturities are short to moderate, allowing reasonably frequent repricing with limited duration exposure and manageable prepayment or refinancing risk.",
      "Loan maturities are moderate in duration, creating periodic repricing lags and some borrower refinancing risk if rates move materially between originations.",
      "Loan maturities are longer-dated or construction-linked, creating meaningful duration exposure and borrower refinancing risk under rising-rate scenarios.",
      "Loan book carries long-dated exposure with limited repricing mechanisms, creating significant sensitivity to rate movements and borrower refinancing capacity.",
    ],
  },
  VaR: {
    displayName: "Value at Risk / Drawdown Risk",
    desc: "Potential magnitude of capital loss under adverse conditions, incorporating collateral coverage and historical loss-rate evidence for comparable lending strategies.",
    criteria: [
      "Conservative LTVs and first-charge security provide strong downside protection; historical loss rates for comparable strategies are low, and enforcement pathways are well defined.",
      "LTVs and collateral coverage provide reasonable downside protection, with modest historical loss experience and generally clear enforcement pathways.",
      "Downside protection is moderate, with collateral coverage adequate but not conservative, and enforcement timelines that could introduce some recovery uncertainty in a downturn.",
      "Downside protection is limited, with higher LTVs or subordinated exposure increasing potential loss severity, and enforcement pathways that may be slower or less certain.",
      "Collateral coverage is thin or unproven, loss experience is untested or elevated, and enforcement pathways carry significant timing and recovery uncertainty.",
    ],
  },
  Concentration: {
    displayName: "Concentration / Diversification Risk",
    desc: "Degree of concentration in a limited number of borrowers, geographies, loan types, or charge rankings.",
    criteria: [
      "Loan book is well diversified across borrowers, geographies, loan types, and charge rankings, with no meaningful related-party or single-borrower concentration.",
      "Loan book shows reasonable diversification with modest concentration in a limited number of borrowers, geographies, or loan types.",
      "Loan book shows noticeable concentration in a limited number of borrowers, sectors, or geographies, though diversification benefits remain present.",
      "Loan book is narrowly diversified, with a small number of borrowers or related-party positions representing a disproportionate share of the portfolio.",
      "Loan book is in an early or ramp-up stage with a limited number of loans and meaningful related-party seed-asset concentration, with no diversification yet achieved.",
    ],
  },
  MandateScope: {
    displayName: "Mandate Scope Risk",
    desc: "Breadth of permitted loan types and the discipline of credit committee governance and sector/borrower exposure limits.",
    criteria: [
      "Lending mandate is narrowly defined (e.g., a single loan type) with tight credit committee oversight and minimal discretion to pursue non-core loan types.",
      "Lending mandate permits a modest range of loan types within a defined credit box, with disciplined committee oversight and sector caps.",
      "Lending mandate permits a broad range of loan types (e.g., residential, commercial, land, construction, mezzanine), each with distinct risk drivers, requiring disciplined underwriting across a wider credit box.",
      "Lending mandate is broad and provides meaningful discretion across loan types, structures, and borrower profiles, with elevated reliance on manager judgment.",
      "Lending mandate is very broad or loosely constrained, permitting extensive discretion across loan types, structures, and risk profiles with limited hard caps.",
    ],
  },
  ReturnVariability: {
    displayName: "Variability of Return Pattern",
    desc: "Predictability of the fund's return stream, and the degree to which credit provisioning or non-performing loans introduce distribution variability.",
    criteria: [
      "Contractual interest income with regular distributions provides a highly predictable, mathematically determinable return pattern with minimal subjective adjustment.",
      "Returns are largely contractual and predictable, with modest variability arising from credit provisioning (e.g., IFRS 9 ECL adjustments) or occasional non-performing loans.",
      "Returns show noticeable variability tied to credit provisioning, prepayments, or construction-linked loan performance, though the overall pattern remains reasonably stable.",
      "Returns are meaningfully affected by non-performing loans, provisioning volatility, or construction delays, introducing periodic distribution variability.",
      "Returns are highly variable or unpredictable, driven by elevated non-performing loan activity, material provisioning swings, or workout situations.",
    ],
  },
  TimeHorizon: {
    displayName: "Time Horizon Risk",
    desc: "Minimum investment horizon required for the loan book's capital-recycling cadence to fully play out.",
    criteria: [
      "Short-duration loan structure enables rapid capital recycling, with a value-realization cycle measured in months rather than years.",
      "Loan maturities support a relatively short overall investment horizon, though some loans may extend recycling timelines modestly.",
      "A meaningful portion of the loan book carries medium-term maturities (e.g., construction or pre-development loans), extending the effective horizon required for full capital recycling.",
      "Loan book includes a significant share of longer-dated or development-linked loans, meaningfully extending the horizon before capital is fully recycled.",
      "Loan book is dominated by long-dated, development-stage, or workout positions, creating an extended and uncertain horizon before capital is recovered.",
    ],
  },
};

// ---------------------------------------------------------------------------
// Equity-framework-specific criteria (ERIFT, ERGFI) — private real estate
// equity framing (stabilized income or value-add growth).
// ---------------------------------------------------------------------------
const EQUITY_SPECIFIC = {
  PriceDiscovery: {
    displayName: "Price Discovery & Pricing Risk",
    desc: "Reliability, observability, and governance of the NAV/appraisal process, including reliance on Level 3 inputs.",
    criteria: [
      "Security relies on highly observable market inputs, with frequent price discovery, independent valuation, and minimal sensitivity to discretionary assumptions. Governance is strong, with robust oversight and standardized methodologies.",
      "Security uses mostly observable inputs, with regular price discovery and generally independent valuation, though some assumptions require judgment. Governance frameworks are solid.",
      "Security relies on a mix of observable and unobservable inputs, with periodic price discovery (e.g., quarterly appraisals). Independence may be partial, with internal models playing a meaningful role.",
      "Security depends heavily on unobservable inputs, with infrequent price discovery and limited external validation. Pricing is sensitive to changes in key assumptions.",
      "Security uses opaque, highly discretionary valuation practices, with minimal external oversight and rare price discovery. Valuations are extremely sensitive to internal assumptions.",
    ],
  },
  Liquidity: {
    displayName: "Liquidity Risk",
    desc: "Structural mismatch between investor redemption rights and the fund's ability to generate liquidity from its underlying real estate holdings.",
    criteria: [
      "Redemption terms are closely matched to the liquidity of underlying assets, with reliable execution even in stress and minimal reliance on gating mechanisms.",
      "Redemption terms are generally well supported by diversified operating cash flow, with pacing or deferral mechanisms available but rarely required.",
      "Redemption terms rely on structural pacing, deferral, or suspension mechanisms (e.g., an AALF) to manage a persistent mismatch between monthly liquidity and the illiquid nature of underlying real estate.",
      "Redemption capacity is constrained by financing encumbrances or disposition timelines, with pacing/gating mechanisms more likely to be invoked under stress.",
      "Underlying portfolio has no meaningful secondary market and redemption terms are frequently constrained, deferred, or suspended.",
    ],
  },
  Leverage: {
    displayName: "Leverage Risk",
    desc: "Property-level mortgage leverage, refinancing concentration, and the use of fund-level borrowing.",
    criteria: [
      "Property-level leverage is conservative and well within target LTV ranges, predominantly insured or guaranteed financing, with a staggered maturity profile limiting refinancing concentration.",
      "Property-level leverage is moderate and within target LTV ranges, with fund-level leverage used only tactically (e.g., short-term bridging) and manageable refinancing concentration.",
      "Property-level leverage is within a defined target range but financing profile (e.g., LTV, insured-financing mix) has not yet been established through a full portfolio cycle, as is typical for a newer or actively repositioning fund.",
      "Leverage is elevated relative to target ranges, or refinancing is concentrated in a shorter window, increasing sensitivity to financing market conditions.",
      "Leverage is high or loosely constrained, with material refinancing concentration and elevated sensitivity to financing market conditions.",
    ],
  },
  InterestRate: {
    displayName: "Interest Rate Risk",
    desc: "Duration and rate-type profile of property-level mortgage debt, and sensitivity of valuations to cap-rate movements.",
    criteria: [
      "Predominantly fixed-rate, long-dated, well-staggered mortgage profile with minimal near-term refinancing exposure and comprehensive hedging where applicable.",
      "Mostly fixed-rate mortgage profile with a reasonably staggered maturity ladder, moderating refinancing concentration risk.",
      "Fixed-rate financing profile consistent with platform practice, but a fully staggered maturity ladder has not yet been established (e.g., a newer fund pre-stabilization), introducing modest incremental rate sensitivity.",
      "Mortgage profile includes meaningful floating-rate or short-dated exposure, increasing sensitivity to rate movements and refinancing timing.",
      "Mortgage profile is short-dated, floating-rate, or concentrated, creating acute refinancing and reset risk.",
    ],
  },
  VaR: {
    displayName: "Value at Risk / Drawdown Risk",
    desc: "Potential magnitude of NAV loss under adverse conditions, incorporating historical drawdown evidence, leverage, and valuation elasticity.",
    criteria: [
      "No reported historical drawdown, stable leverage well within target ranges, and NAV elasticity to cap-rate movements is well contained.",
      "Limited historical drawdown evidence, leverage within target ranges, and moderate NAV sensitivity to cap-rate or discount-rate shifts.",
      "No reported historical drawdown, but NAV elasticity to cap-rate movements and Level 3 model inputs is a structural feature of the asset class that cannot be eliminated through governance quality alone.",
      "NAV shows meaningful sensitivity to cap-rate or assumption changes, and renovation, lease-up, or repositioning activity increases valuation elasticity versus a stabilized portfolio.",
      "No stabilized NOI track record; valuation depends heavily on renovation-timeline and lease-up assumptions, materially increasing NAV sensitivity relative to a stabilized portfolio.",
    ],
  },
  Concentration: {
    displayName: "Concentration / Diversification Risk",
    desc: "Degree to which the portfolio is concentrated in a limited number of properties, tenants, or geographies.",
    criteria: [
      "Security is highly diversified across many independent properties/geographies, with no single holding meaningfully influencing outcomes.",
      "Security is generally well diversified but shows moderate clustering across certain regions or property types; no single holding dominates.",
      "Security shows diversification across a meaningful number of properties and communities, but concentration by single asset class and correlated valuation drivers (e.g., cap rates, rent regulation) moderates the diversification benefit.",
      "Security is narrowly diversified, with a small number of properties or a single metro area representing a disproportionate share of NAV.",
      "Security is in an early or nascent stage with a small number of acquisitions, each potentially representing a disproportionate share of NAV, and no cross-asset diversification.",
    ],
  },
  MandateScope: {
    displayName: "Mandate Scope & Non-Core Asset Exposure",
    desc: "Breadth of the investment mandate and the degree of discretion required to execute value-add or repositioning activity.",
    criteria: [
      "Mandate is narrow and clearly defined, with minimal non-core exposure and negligible deviation from the primary strategy.",
      "Mandate is focused with limited non-core exposure (below typical OM thresholds); moderate repositioning activity requires judgment but does not materially alter the risk profile.",
      "Mandate is clearly defined around an acquisition/enhancement/reinvestment cycle, with discretion over renovation scope, capital deployment timing, and property selection introducing moderate complexity relative to a stabilized income strategy.",
      "Mandate provides meaningful discretion across asset types, geographies, or strategies, with non-core exposure materially influencing the portfolio's risk profile.",
      "Mandate is broad or loosely defined, with significant discretion to pursue varied or opportunistic strategies.",
    ],
  },
  ReturnVariability: {
    displayName: "Variability of Return Pattern",
    desc: "Predictability and consistency of distributions and NAV movements.",
    criteria: [
      "Highly stable and predictable return behaviour, with consistent distributions and minimal NAV fluctuation across market conditions.",
      "Generally stable return pattern with modest variability from occupancy cycles or periodic repositioning activity; distribution coverage is solid.",
      "Return pattern reflects normal operating variability (occupancy cycles, renovation periods, or repositioning activity), moderated by the fund's overall revenue and portfolio scale.",
      "Return pattern shows meaningful variability, with distributions or NAV influenced materially by renovation-cycle lumpiness, lease-up transition costs, or market conditions.",
      "Return pattern is highly variable, with distributions not guaranteed and NAV subject to significant renovation-driven or discretionary adjustment.",
    ],
  },
  TimeHorizon: {
    displayName: "Time Horizon Risk",
    desc: "Minimum holding period required for the fund's value-creation cycle to fully materialize, and the extent of structural illiquidity.",
    criteria: [
      "Short required holding period, with liquidity closely aligned to the underlying economic horizon.",
      "Moderate holding period (roughly 1–3 years) for return drivers to materialize, with liquidity reasonably aligned to the economic horizon.",
      "Multi-year holding period (roughly 3–5 years) typical of private real estate value-creation cycles.",
      "Extended holding period (5+ years) recommended; value-add repositioning cycles are multi-year and appraisal-based NAV adjusts gradually, with structural private-market illiquidity further extending the effective horizon.",
      "Very long holding period (5–10+ years) required for a full acquisition-renovation-stabilization or development cycle to complete; early exit could materially impair outcomes.",
    ],
  },
};

// ---------------------------------------------------------------------------
// Hybrid-framework-specific criteria (ERIED) — commercial income, lending,
// and development framing. Includes one factor (Development & Construction
// Risk) with no equivalent in the Debt/Equity frameworks.
// ---------------------------------------------------------------------------
const HYBRID_SPECIFIC = {
  PriceDiscovery: {
    displayName: "Price Discovery & Pricing Risk",
    desc: "Reliability of valuation across a layered commercial, lending, and development portfolio.",
    criteria: [
      "Valuation inputs across all strategy components are highly observable, frequently validated, and independently governed, with minimal reliance on forward-looking assumptions.",
      "Valuation combines observable commercial income data with periodic independent review; development-stage assumptions are present but well-supported and infrequent.",
      "Valuation blends appraisal-based commercial inputs, development-stage proforma modelling, and lending-fund NAV dependency; stabilized assets provide observable anchors while development assumptions rely on forward-looking, less-anchored inputs.",
      "Valuation relies significantly on forward-looking development assumptions and layered fund-of-funds NAV inputs with limited transaction-based validation.",
      "Valuation is dominated by discretionary, forward-looking assumptions across multiple strategy layers with minimal independent or transaction-based validation.",
    ],
  },
  Liquidity: {
    displayName: "Liquidity Risk",
    desc: "Structural mismatch between redemption rights and a mixed portfolio of illiquid commercial, lending, and development exposures.",
    criteria: [
      "Redemption terms are closely matched to the liquidity of the fund's underlying holdings, with no meaningful mismatch between investor redemption rights and asset-level liquidity.",
      "Redemption terms are reasonably aligned with underlying asset liquidity, with modest caps or pacing mechanisms providing an added layer of protection.",
      "Redemption terms include defined monthly cash caps and/or note-issuance mechanisms that address a structural mismatch between liquid redemption rights and a mix of illiquid commercial, lending, and development exposures.",
      "Redemption mechanisms are more actively relied upon to manage a meaningful mismatch across illiquid commercial assets, multi-year development timelines, and fund-of-funds lending exposure.",
      "Underlying portfolio is dominated by illiquid, long-dated, or development-stage exposures with limited near-term liquidity, and redemption mechanisms are frequently constrained, deferred, or suspended.",
    ],
  },
  Leverage: {
    displayName: "Look-Through Leverage Risk",
    desc: "Aggregate leverage across commercial mortgage debt, look-through exposure to a lending vehicle, and future development construction financing.",
    criteria: [
      "Commercial mortgage leverage is conservative with strong debt-service and interest coverage, no fund-level leverage, and minimal look-through exposure via lending-fund holdings.",
      "Commercial mortgage leverage is moderate with sound coverage ratios; look-through leverage exposure via lending-fund holdings is limited and well monitored.",
      "Commercial mortgage leverage is conservative-to-moderate with solid coverage ratios, but the combination of commercial financing, a look-through lending-fund leverage layer, and future development construction financing creates meaningful aggregate leverage complexity.",
      "Aggregate leverage across commercial, lending, and development financing layers is elevated, with increasing reliance on future construction financing and look-through exposure to the lending vehicle's leverage.",
      "Aggregate look-through leverage across all strategy layers is high or loosely monitored, materially amplifying downside sensitivity to financing or valuation shocks.",
    ],
  },
  InterestRate: {
    displayName: "Interest Rate Risk",
    desc: "Rate sensitivity across commercial mortgage terms, development financing timelines, and look-through lending exposure.",
    criteria: [
      "Financing across all strategy layers is predominantly long-dated and fixed rate, with minimal near-term refinancing exposure and strong staggering of maturities.",
      "Financing is mostly long-dated with modest near-term refinancing exposure across one or more strategy layers.",
      "Commercial mortgage terms carry near-term refinancing exposure, development financing extends across multiple future cycles, and look-through lending exposure adds incremental rate sensitivity via borrower refinancing conditions.",
      "A meaningful share of financing across strategy layers carries short-dated or floating-rate terms, creating elevated near-term refinancing and rate-reset exposure.",
      "Financing across strategy layers is short-dated, floating-rate, or opportunistically structured, creating acute and compounding refinancing and rate exposure.",
    ],
  },
  VaR: {
    displayName: "Value at Risk / Drawdown Risk",
    desc: "Downside sensitivity across stable commercial operations, development execution, and lending-book performance.",
    criteria: [
      "Stable, well-occupied commercial operations anchor downside protection, with no material valuation elasticity from development or lending components.",
      "Commercial operations provide solid downside anchoring; development and lending components introduce modest, well-contained valuation elasticity.",
      "Stable commercial fundamentals anchor downside stability, but development projects introduce valuation elasticity tied to construction cost assumptions, absorption rates, and approval timelines, producing a balanced but non-trivial drawdown profile.",
      "Development and lending components introduce meaningful valuation elasticity and downside sensitivity that is only partially offset by stable commercial fundamentals.",
      "Portfolio-wide downside is highly sensitive to construction cost overruns, absorption/approval delays, or lending-book credit events, with limited stabilized-asset anchoring.",
    ],
  },
  Concentration: {
    displayName: "Portfolio Composition & Platform Concentration Risk",
    desc: "Diversification across the fund's commercial income, lending, and development verticals and across geographies.",
    criteria: [
      "Exposure is broadly diversified across commercial, lending, and development verticals and across multiple, unrelated geographies with no material correlated concentration.",
      "Exposure is diversified across the three strategy verticals with modest geographic clustering that does not materially correlate risk drivers.",
      "Portfolio is diversified across three real estate verticals (commercial income, lending, development), but development pipeline concentration in a single metro region creates correlated exposure to municipal processes, housing demand, and construction markets.",
      "Diversification across strategy verticals is present but geographic or counterparty concentration within one or more verticals is meaningful enough to influence portfolio-level outcomes.",
      "Portfolio is dominated by a small number of assets, projects, or a single geographic cluster across strategy verticals, with limited diversification benefit.",
    ],
  },
  MandateScope: {
    displayName: "Strategy Complexity & Mandate Breadth Risk",
    desc: "Complexity of concurrently managing stabilized commercial income, real estate lending oversight, and multi-phase development execution.",
    criteria: [
      "Mandate is limited to a single, clearly defined real estate strategy with minimal cross-strategy coordination requirements.",
      "Mandate spans a small number of related strategies with manageable coordination requirements and clearly defined oversight.",
      "Mandate requires concurrent management of stabilized commercial income, real estate lending oversight (via a fund-of-funds structure), and multi-phase development execution — each requiring distinct expertise and amplifying coordination and operational demands.",
      "Mandate complexity is elevated by an expanding number of concurrent projects or strategy verticals, increasing execution dependencies and oversight requirements beyond a typical multi-strategy fund.",
      "Mandate is very broad, spanning numerous concurrent strategies, projects, or geographies with extensive discretion and limited structural constraints on scope.",
    ],
  },
  ReturnVariability: {
    displayName: "Variability of Return Pattern",
    desc: "Interplay between stable recurring commercial/lending income and episodic, development-driven capital appreciation.",
    criteria: [
      "Returns are dominated by stable, contractual, or recurring income with minimal episodic or development-driven variability.",
      "Returns are generally stable, with modest episodic contribution from development or lending components.",
      "Stable commercial income and lending returns are supplemented by episodic, development-driven capital appreciation and special distributions tied to project completions, and cross-strategy correlation means macroeconomic shocks can affect multiple return sources simultaneously.",
      "Episodic development-driven returns and cross-strategy correlation represent a significant share of the return profile, introducing meaningful timing and magnitude uncertainty.",
      "Returns are highly irregular, dominated by uncertain, long-dated development or workout outcomes with limited recurring income support.",
    ],
  },
  TimeHorizon: {
    displayName: "Time Horizon Risk",
    desc: "Extent to which targeted returns depend on multi-year development completions rather than near-term commercial or lending income.",
    criteria: [
      "Value-realization cycle is short, with limited reliance on multi-year development or lending timelines.",
      "Value-realization cycle is moderate, with a limited share of returns tied to multi-year development milestones.",
      "Development pipeline milestones extend several years into the future; special distributions tied to project completions are long-dated and irregular, while commercial assets provide near-term stability, requiring sustained investor commitment for the full return profile to materialize.",
      "A significant share of targeted returns depends on distant, multi-year development completions, meaningfully extending the effective horizon required to realize full value.",
      "Targeted returns are predominantly dependent on long-dated, multi-phase development or workout outcomes many years in the future, with limited near-term value realization.",
    ],
  },
  DevConstruction: {
    displayName: "Development & Construction Risk",
    desc: "Exposure to entitlement, construction cost, and absorption/pre-sale risk across the fund's multi-phase development pipeline.",
    criteria: [
      "Development activity is minimal or fully de-risked (e.g., pre-leased, fixed-price contracts, shovel-ready with approvals in hand), with minimal exposure to cost overrun, absorption, or approval risk.",
      "Development activity is limited in scale, with reasonable cost and timeline certainty and manageable approval or absorption risk.",
      "Development pipeline spans multiple concurrent projects at varying stages (entitlement, design, construction), with exposure to municipal approval timelines, construction cost assumptions, and pre-sale/absorption risk that is material but actively managed.",
      "Development pipeline carries elevated exposure to entitlement, construction cost, or absorption risk across multiple concurrent projects, with less-mature de-risking (e.g., limited pre-sales, pending approvals).",
      "Development pipeline is at an early stage with significant unresolved entitlement, construction cost, or absorption risk, and limited de-risking mechanisms in place.",
    ],
  },
};

// ---------------------------------------------------------------------------
// Weights (fractions of 1.00). Category subtotals match the source document's
// Weighting Summary Table exactly. Individual factor weights are calibrated so
// that scoring each fund per Appendix A's qualitative ratings reproduces the
// document's published CRS values (see funds.js for the scores themselves).
// Two individual weights are taken directly from the document's text: the
// Equity framework's Liquidity (14%) and Time Horizon (5%) factors.
// ---------------------------------------------------------------------------
const DEBT_WEIGHTS = {
  PriceDiscovery: 0.13, Liquidity: 0.13, TimeHorizon: 0.06, VaR: 0.10,
  Leverage: 0.1173, InterestRate: 0.0827,
  Concentration: 0.0610, MandateScope: 0.0418, ReturnVariability: 0.0472,
  ManagerDiscipline: 0.03, Registration: 0.0254, KeyPerson: 0.0201,
  ESGGovernance: 0.0292, Cybersecurity: 0.0208, FirmSize: 0.02, Distribution: 0.0346,
  TrackRecord: 0.0155, CurrencyHedging: 0.0172, Derivatives: 0.0172,
};

const EQUITY_WEIGHTS = {
  PriceDiscovery: 0.12, Liquidity: 0.14, TimeHorizon: 0.05, VaR: 0.10,
  Leverage: 0.10, InterestRate: 0.07,
  Concentration: 0.0734, MandateScope: 0.0578, ReturnVariability: 0.0588,
  ManagerDiscipline: 0.0362, Registration: 0.0262, KeyPerson: 0.0131,
  ESGGovernance: 0.0231, Cybersecurity: 0.0294, FirmSize: 0.0132, Distribution: 0.0388,
  TrackRecord: 0.0242, CurrencyHedging: 0.0129, Derivatives: 0.0129,
};

const HYBRID_WEIGHTS = {
  PriceDiscovery: 0.0829, Liquidity: 0.0971, TimeHorizon: 0.0871, VaR: 0.0829,
  Leverage: 0.09, InterestRate: 0.06,
  Concentration: 0.0843, MandateScope: 0.0886, ReturnVariability: 0.0886, DevConstruction: 0.0886,
  ManagerDiscipline: 0.0217, Registration: 0.0217, KeyPerson: 0.0159,
  ESGGovernance: 0.0159, Cybersecurity: 0.0171, FirmSize: 0.0059, Distribution: 0.0217,
  TrackRecord: 0.01, CurrencyHedging: 0.01, Derivatives: 0.01,
};

const ORDER_19 = [
  "PriceDiscovery", "Liquidity", "Leverage", "InterestRate", "VaR",
  "Concentration", "MandateScope", "ReturnVariability", "TimeHorizon",
  "ManagerDiscipline", "Registration", "TrackRecord", "KeyPerson",
  "ESGGovernance", "Cybersecurity", "FirmSize", "Distribution",
  "CurrencyHedging", "Derivatives",
];
const ORDER_20 = [
  "PriceDiscovery", "Liquidity", "Leverage", "InterestRate", "VaR",
  "Concentration", "MandateScope", "ReturnVariability", "DevConstruction", "TimeHorizon",
  "ManagerDiscipline", "Registration", "TrackRecord", "KeyPerson",
  "ESGGovernance", "Cybersecurity", "FirmSize", "Distribution",
  "CurrencyHedging", "Derivatives",
];

const CATEGORY_OF = {
  PriceDiscovery: "Structural", Liquidity: "Structural", TimeHorizon: "Structural", VaR: "Structural",
  Leverage: "Financial", InterestRate: "Financial",
  Concentration: "Portfolio", MandateScope: "Portfolio", ReturnVariability: "Portfolio", DevConstruction: "Portfolio",
  ManagerDiscipline: "Governance", Registration: "Governance", KeyPerson: "Governance",
  ESGGovernance: "Governance", Cybersecurity: "Governance", FirmSize: "Governance", Distribution: "Governance",
  TrackRecord: "Performance", CurrencyHedging: "Performance", Derivatives: "Performance",
};

function buildFactors(order, weights, specific) {
  return order.map(name => {
    const base = specific[name] || COMMON[name];
    return {
      name,
      category: CATEGORY_OF[name],
      weight: weights[name],
      displayName: base.displayName,
      desc: base.desc,
      criteria: base.criteria,
    };
  });
}

export const FRAMEWORKS = {
  Debt: {
    id: "Debt",
    label: "Private Real Estate Debt Framework",
    factorCount: 19,
    categoryWeights: { Structural: 0.42, Financial: 0.20, Portfolio: 0.15, Governance: 0.18, Performance: 0.05 },
    factors: buildFactors(ORDER_19, DEBT_WEIGHTS, DEBT_SPECIFIC),
  },
  Equity: {
    id: "Equity",
    label: "Private Real Estate Equity Framework",
    factorCount: 19,
    categoryWeights: { Structural: 0.41, Financial: 0.17, Portfolio: 0.19, Governance: 0.18, Performance: 0.05 },
    factors: buildFactors(ORDER_19, EQUITY_WEIGHTS, EQUITY_SPECIFIC),
  },
  Hybrid: {
    id: "Hybrid",
    label: "Hybrid — Commercial Income, Lending & Development Framework",
    factorCount: 20,
    categoryWeights: { Structural: 0.35, Financial: 0.15, Portfolio: 0.35, Governance: 0.12, Performance: 0.03 },
    factors: buildFactors(ORDER_20, HYBRID_WEIGHTS, HYBRID_SPECIFIC),
  },
};

export const TIER_BOUNDARIES = [
  { max: 1.50, label: "Low" },
  { max: 2.50, label: "Low-Medium" },
  { max: 3.00, label: "Medium" },
  { max: 3.50, label: "Medium-High" },
  { max: Infinity, label: "High" },
];

// Compliance-oriented exclusion rationales, keyed by canonical factor name
// (shared across frameworks even where the display label differs).
export const EXCLUSION_REASONS = {
  PriceDiscovery: [
    "Excluded because valuation methodology is externally supported, independently governed, and considered sufficiently robust to obviate a standalone pricing-risk score.",
    "Independent appraisal process and valuation committee oversight reduce the need for separate pricing-risk weighting.",
    "NAV/valuation methodology assessed independently through due diligence review; factor does not materially differentiate this product within the peer group.",
  ],
  Liquidity: [
    "Liquidity risk deemed non-primary for this mandate based on the intended long-term holding profile and absence of redemption pressure.",
    "Excluded because liquidity characteristics are already captured through product structure, client suitability review, and redemption policy analysis elsewhere in the assessment.",
    "Excluded due to limited material differentiation across comparable products under review.",
  ],
  Leverage: [
    "Excluded because current leverage levels are temporary, transitional, or expected to fluctuate materially, making a point-in-time score unreliable.",
    "Leverage assessed through covenant, structural, and offering document review outside the quantitative scoring framework.",
    "Offering document leverage constraints and actual operating leverage are sufficiently conservative to render differentiated scoring immaterial.",
  ],
  InterestRate: [
    "Excluded because interest-rate exposure is already embedded within the leverage and drawdown risk assessments.",
    "Interest-rate risk considered secondary to broader fundamental drivers for this product at the time of assessment.",
    "Criterion removed to reduce overlap with financing structure and duration analysis conducted separately.",
  ],
  VaR: [
    "Excluded because statistical drawdown models are considered unreliable or unavailable for illiquid or early-stage private-market assets.",
    "Insufficient performance history to produce a meaningful drawdown or VaR assessment.",
    "Scenario-based stress testing preferred over quantitative VaR metrics for this asset class; factor assessed qualitatively through separate due diligence.",
  ],
  Concentration: [
    "Excluded because concentration exposure is already incorporated within broader portfolio construction and issuer diversification oversight.",
    "Single-sector or single-strategy concentration is intentional and inherent to the mandate; the factor does not add discriminatory value.",
    "Concentration risk assessed separately at the portfolio-allocation level and does not require a standalone product-level score.",
  ],
  MandateScope: [
    "Excluded because the offering documents impose narrow investment restrictions and the fund's actual non-core exposure is negligible.",
    "Mandate scope risk assessed as immaterial relative to core portfolio risks; OM constraints are sufficiently tight.",
    "Non-core asset exposure is de minimis and fully disclosed; no material discretion exists to alter the product's risk profile.",
  ],
  ReturnVariability: [
    "Excluded because historical distribution consistency is not a primary determinant of forward-looking product risk for this mandate.",
    "Insufficient operating history to produce a meaningful return variability analysis.",
    "Distribution and NAV volatility assessed indirectly through leverage, drawdown, and asset quality metrics already included in the model.",
  ],
  TimeHorizon: [
    "Excluded because client-specific holding period suitability is assessed independently from product-level risk scoring through the KYC and IPS process.",
    "Time horizon considerations addressed through client suitability review; the product's terms are consistent with its peer group and do not require differentiated scoring.",
    "Criterion removed to avoid duplication with suitability review conducted at the account level.",
  ],
  ManagerDiscipline: [
    "Excluded because governance and mandate adherence are reviewed qualitatively through separate due diligence procedures and do not require a standalone quantitative score.",
    "No evidence of style drift, mandate deviation, or risk control deficiencies requiring differentiated scoring at this time.",
    "Manager discipline assessed outside the quantitative framework; scoring would not add discriminatory value for this product.",
  ],
  Registration: [
    "Excluded because the fund operates under a clearly defined regulatory framework and governance structure that is consistent with the peer group and does not require differentiated scoring.",
    "Regulatory and governance risk assessed through qualitative due diligence review; factor does not materially differentiate this product.",
    "Independent oversight, reporting standards, and conflict management are adequate; standalone scoring is not warranted.",
  ],
  TrackRecord: [
    "Excluded due to limited relevance for newly launched or restructured products where historical comparability is constrained.",
    "Track record deemed non-representative of the current strategy composition or team; historical performance not relied upon as a primary risk determinant.",
    "Manager's performance history assessed separately through qualitative due diligence; quantitative track record scoring not applicable.",
  ],
  KeyPerson: [
    "Excluded because the organization demonstrates adequate team depth, succession planning, and institutional retention structures that reduce key person dependency to an immaterial level.",
    "Key person risk assessed qualitatively through separate due diligence; factor does not materially differentiate this product within the peer group.",
    "Decision making is sufficiently distributed and the team is stable; standalone scoring is not warranted at this time.",
  ],
  ESGGovernance: [
    "Excluded because ESG governance is assessed on a platform basis through separate due diligence and does not require standalone product-level scoring.",
    "Fund is newly established; ESG governance infrastructure is being formalized and is tracked qualitatively rather than scored at this time.",
    "ESG policies and framework participation are consistent with the peer group; standalone scoring would not add discriminatory value.",
  ],
  Cybersecurity: [
    "Excluded because cybersecurity and business continuity governance are assessed on a platform basis and are consistent across the peer group.",
    "Manager-level cybersecurity and disaster recovery controls are reviewed through separate operational due diligence; standalone scoring is not warranted.",
    "No cybersecurity or business continuity deficiencies identified that would differentiate this product from its peer group.",
  ],
  FirmSize: [
    "Excluded because organizational scale is not viewed as a direct proxy for product-level risk for this mandate.",
    "Manager size deemed secondary to asset quality, governance, and team experience; AUM is not considered materially differentiating within the peer group.",
    "Firm AUM and operational capacity assessed through separate due diligence; factor does not add discriminatory value.",
  ],
  Distribution: [
    "Excluded because dealer concentration risk is monitored separately through compliance and redemption oversight.",
    "Distribution structure not considered a material determinant of underlying investment risk for this product.",
    "Criterion excluded to avoid overlap with conflict-of-interest review conducted at the firm level.",
  ],
  CurrencyHedging: [
    "Excluded because the fund has no material foreign currency exposure and hedging is not applicable.",
    "Currency fluctuations are immaterial to the expected return profile given the fund's predominantly domestic asset base.",
    "FX risk is negligible; offering document restrictions on foreign exposure are sufficiently narrow to render separate scoring unnecessary.",
  ],
  Derivatives: [
    "Excluded because the fund does not currently utilize derivative instruments in a material capacity and the offering documents impose restrictive limits.",
    "Derivative exposure is immaterial to the overall risk profile; no active derivative strategy requires standalone assessment.",
    "Derivative permissions are standard and non-differentiating within the peer group; no practical expectation of speculative utilization.",
  ],
  DevConstruction: [
    "Excluded because the development pipeline is de minimis relative to the fund's overall commercial and lending exposure at the time of assessment.",
    "Development and construction risk assessed qualitatively through separate project-level due diligence rather than standalone quantitative scoring.",
    "No active development or construction exposure exists in the current portfolio; factor is not applicable at this time.",
  ],
};
