# Gemini Project Context: Mission Log

## What This App Is
Mission Log is a mobile-first personal life OS for Ryan Persaud and Sabrina. It tracks daily logs, workouts, meals, household chores, pantry inventory, goals, and weekly reviews.
- **Live URL:** https://dailyappproductivity.netlify.app
- **GitHub:** https://github.com/persaud19/Productivity-App

## Tech Stack
- **Frontend:** React 18 (compiled JSX, no build tool, pre-compiled via Babel at dev time).
- **Backend:** Firebase Realtime Database (persistent data) & Firebase Auth (Google Sign-In, per-user data namespacing).
- **Hosting:** Netlify (auto-deploys from GitHub main branch).
- **Libraries:** Recharts (charts), Leaflet (maps) — all loaded via CDN.
- **Dependency Management:** No `npm` project. All dependencies are loaded via CDN in `index.html`.

## File Structure & Critical Architecture Rules
- **`index.html`:** Shell only (4KB). Loads CDNs, Firebase config, then `app.js`.
- **`app.js`:** Entire compiled React app. **THIS IS THE ONLY FILE TO EDIT.**

### 🚨 CRITICAL RULES 🚨
1. **NEVER inline JS in `index.html`**: `app.js` must always be a separate file loaded via `<script src="app.js"></script>`. Inline JS breaks the HTML parser when regex patterns appear.
2. **Firebase Data Namespace**: All data is stored under `users/<uid>/ml/...`. The DB layer in `app.js` converts KEYS (e.g., `ml:log:2026-03-22`) to the full path. This relies on `window.__current_uid`.
3. **No JSX Transpilation at Runtime**: `app.js` is pre-compiled JSX.
4. **React Globals**: React hooks (`useState`, `useEffect`, `useRef`, etc.) are destructured globally at the top of `index.html`. No imports are needed in `app.js`.

## Data Model & Keys
- `KEYS.log(date)`: Daily morning + evening log
- `KEYS.weekReview(sun)`: Sunday review data
- `KEYS.settings()`: User name, partner name, goals
- `KEYS.chores()`: Chore task list
- `KEYS.pantry()`: Pantry inventory
- `KEYS.weekPlan(sun)`: Weekly meal plan
- `KEYS.trainHistory()`: Workout history

## Major Architecture Roadmap: Multi-User Household
**Goal:** Transition to a Homegroup System where Home (Chores + Pantry) and Finance tabs are shared, while Morning, Evening, Goals, Train, and Food remain personal.
- **Roles:** Master, Homegroup Leader, Member.
- **Shared Path:** `households/<householdId>/ml/...` (via `hh:` prefix routing).
- **Solo Mode Fallback:** If no household exists, fallback to `users/<uid>/ml/...` for Home/Finance.

## Personal Context (Ryan Persaud)
- **Identity:** 32, married to Sabrina, young son. BI Manager. High I / High D personality (direct, strategic).
- **7 Pillars:** Family/Relationships, Faith, Fitness/Health, Finance, Learning/Growth, Fun/Social, Marriage/Partnership.
- **Fitness Goals:** 210 lbs → 180 lbs (end of 2026). Daily short sessions (Mobility, Cardio, Strength).
- **Finance Context:** Target payoff for family loan end of 2026.
- **Communication Style for AI:** Direct, warm, accountability partner tone. No lectures, celebrate specific wins based on data.

## Deployment Workflow
1. Edit `app.js`.
2. Push to GitHub (`main` branch).
3. Netlify auto-deploys in ~30 seconds.
