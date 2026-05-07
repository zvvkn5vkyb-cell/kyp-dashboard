# KYP Risk Dashboard - AI Agent Instructions

## Project Overview
This is a single-page React application for calculating KYP (Know Your Product) risk scores for investment funds. All logic resides in `src/App.jsx` with a monolithic component design for simplicity.

## Technology Stack
- React 19.2.5 with hooks
- Vite 8.0.10 for build tooling
- ESLint for linting
- Inline React styles (no CSS frameworks)

## Build and Run Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build locally

## Key Conventions
- **Factor Weights**: Must sum to 1.0 (100%). Always verify after changes.
- **Inline Styling**: Use `style={{}}` objects for all UI styling.
- **Color Palette**: Hardcoded risk tier colors (green to red spectrum) - update in multiple places for consistency.
- **State Management**: Simple `useState` for scores and fund name; no external libraries.
- **Computed Values**: Use `useMemo` for CRS, tier, and top5 calculations.

## Common Pitfalls
- **Weight Calibration**: Adding/removing factors requires adjusting others to maintain 1.0 sum.
- **Color Consistency**: Risk tier colors defined in `getTier()`, `GaugeArc` zones, and reference table.
- **No Persistence**: Scores reset on reload; consider localStorage for saving.
- **SVG Gauge**: Angle calculations sensitive to tier thresholds.
- **Regulatory Compliance**: CRS thresholds align with NI 31-103 / CIRO Rule 3800.

## Key Files
- `src/App.jsx` - Entire application logic and UI
- `README.md` - Setup, deployment, and common modification guides

For detailed setup and deployment instructions, see [README.md](README.md).</content>
<parameter name="filePath">c:\Users\ChadHiscock\Downloads\kyp-dashboard\kyp-dashboard\AGENTS.md