# KYP Risk Dashboard — Assurican Private Wealth

Internal KYP (Know Your Product) risk scoring tool for private fund due diligence.
Produces a weighted Composite Risk Score (CRS) across 20 factors per NI 31-103 / CIRO Rule 3800.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [VS Code](https://code.visualstudio.com/)
- [Claude Code extension](https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-code) (VS Code Marketplace)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) for deployment

---

## First-Time Setup

```bash
# 1. Unzip the project and open the folder in VS Code
# File > Open Folder > select kyp-dashboard

# 2. Open the VS Code terminal (Ctrl+` or Cmd+`)

# 3. Install dependencies
npm install

# 4. Start local dev server — opens at http://localhost:5173
npm run dev
```

---

## Making Changes with Claude Code

1. Open Command Palette: `Ctrl+Shift+P` (Win) / `Cmd+Shift+P` (Mac)
2. Type `Claude` and open the Claude Code panel
3. Describe your change in plain English, e.g.:
   - "Add a PDF export button that prints the current scoring"
   - "Add a text notes field below each factor row"
   - "Change the Liquidity weight from 19% to 20% and reduce FX OM to 0%"
   - "Add a second tab to compare two funds side by side"
4. Claude Code will edit `src/App.jsx` directly
5. The dev server hot-reloads instantly — you see changes in the browser immediately

All scoring logic and factor weights are in `src/App.jsx` at the top — easy to find and edit.

---

## Deploying to Netlify

### One-time setup
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Log in to your Netlify account
netlify login

# Link to the existing site (run once)
netlify link --id cf2a6d75-9001-4480-baa2-329893bf7d75
```

### Every subsequent deployment
```bash
# Build and deploy to production in one command
netlify deploy --build --prod
```

Your live URL: **https://kyp-risk-dashboard.netlify.app**

---

## Project Structure

```
kyp-dashboard/
├── src/
│   ├── App.jsx        ← All dashboard logic, factors, weights, UI
│   ├── main.jsx       ← React entry point (don't touch)
│   └── index.css      ← Global resets (don't touch)
├── index.html         ← HTML shell (don't touch)
├── netlify.toml       ← Netlify build config
├── vite.config.js     ← Vite bundler config (don't touch)
└── package.json       ← Dependencies and npm scripts
```

**The only file you'll ever edit is `src/App.jsx`.**

---

## Common Requests for Claude Code

| What you want | What to say |
|---|---|
| Change a factor weight | "Change Concentration weight from 15% to 12% and add the difference to Pricing Risk" |
| Add a new factor | "Add a 'ESG Score' factor at 3% weight, reduce FX OM from 1% to 0%" |
| Add PDF export | "Add a Print / Export PDF button using window.print()" |
| Add fund notes | "Add a free-text notes field at the bottom of the page" |
| Compare two funds | "Add a second scoring column so I can assess two funds side by side" |
| Save scores to URL | "Encode the current scores into the URL so I can share a pre-filled assessment" |

---

## Regulatory Context

This tool is for internal registered adviser use under:
- NI 31-103 s.13.2 (Know Your Product)
- CIRO Rule 3800
- CSA Client Focused Reforms

Factor weights and tier thresholds reflect IC-approved methodology.
