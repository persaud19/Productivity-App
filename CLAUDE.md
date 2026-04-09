# Mission Log — Claude Code Context

## What This App Is
Mission Log is a mobile-first personal life OS for Ryan Persaud and Sabrina (his wife).
It tracks daily logs, workouts, meals, household chores, pantry inventory, goals, and weekly reviews.
Live at: https://dailyappproductivity.netlify.app
GitHub: https://github.com/persaud19/Productivity-App (user: persaud19)

## Tech Stack
- **React 18** — compiled JSX (no build tool, pre-compiled via Babel at dev time)
- **Firebase Realtime Database** — all persistent data
- **Firebase Auth** — Google Sign-In, per-user data namespacing
- **Netlify** — static hosting, auto-deploys from GitHub main branch
- **Recharts** — charts (loaded via CDN)
- **Leaflet** — maps for outdoor walk tracker (loaded via CDN)
- **No npm project** — all dependencies loaded via CDN in index.html

## File Structure
```
index.html      ← Shell only (4KB). Loads CDNs, Firebase config, then app.js
app.js          ← Entire compiled React app (~470KB). THIS IS THE ONLY FILE TO EDIT.
pantry-seed.json ← NOT USED (seed is now embedded in app.js). Can delete.
```

## Critical Architecture Rules

### NEVER inline JS in index.html
The app.js must always be a separate file loaded via `<script src="app.js"></script>`.
Inline JS breaks when regex patterns like `/<script[^>]*/` appear — the HTML parser
treats them as real script tags and splits the file. This was the #1 crash cause in
the original build. Keep app.js separate always.

### Firebase data namespace
All data is stored under: `users/<uid>/ml/...`
The DB layer in app.js converts KEYS like `ml:log:2026-03-22` → `users/<uid>/ml/log/2026-03-22`
This is done via `window.__current_uid` which is set when the user signs in via AuthGate.

### No JSX transpilation at runtime
The app.js is pre-compiled JSX. When editing source, you need to run Babel:
```bash
npx @babel/core@latest --presets @babel/preset-react,@babel/preset-env src/app.jsx -o app.js
```
Or edit app.js directly (it's readable compiled JS — painful but doable for small fixes).

### React globals
React hooks are destructured at the top of index.html:
```js
const {useState, useEffect, useRef, useCallback, useMemo} = React;
```
These are available globally — no imports needed in app.js.

## Firebase Config
```javascript
{
  apiKey: "AIzaSyCj8PxuyCTmOa6jZXnZ6PJ_w0a9u0Qv_mU",
  authDomain: "mission-log-aef65.firebaseapp.com",
  databaseURL: "https://mission-log-aef65-default-rtdb.firebaseio.com",
  projectId: "mission-log-aef65",
  storageBucket: "mission-log-aef65.firebasestorage.app",
  messagingSenderId: "1085357597387",
  appId: "1:1085357597387:web:d46f54d04627cea258f14e"
}
```
Firebase Auth: Google Sign-In enabled. Authorised domain: `dailyappproductivity.netlify.app`

## App Structure (Navigation)

### Section Nav (top row)
| Section  | Color    | Sub-tabs                          |
|----------|----------|-----------------------------------|
| PERSONAL | #f4a823  | Morning · Evening · Goals · Sunday |
| HEALTH   | #fb923c  | Train · Food                      |
| HOME     | #60a5fa  | Chores · Pantry                   |
| HISTORY  | #a78bfa  | Calendar · Sunday Reports · Pattern Insights |
| FINANCE  | #34d399  | Coming soon                       |

### Key Components (all in app.js)
```
AuthGate          — Google Sign-In gate. Wraps entire App.
App               — Root. Manages all state. Calls loadAll().
DB                — Firebase/localStorage abstraction layer.
KEYS              — All Firebase path keys.
useAutoSave       — Auto-saves form state 1.5s after change (merges, doesn't overwrite).

Morning           — Daily morning check-in (weight, sleep, energy, mood, steps, intention, gratitude)
Evening           — Daily evening check-in (workout, snacking, water, day rating, wins, family moment)
Train             — Workout tracker (strength, cardio, outdoor walk with Leaflet map)
Goals             — Goal tracking with progress charts
Sunday            — Weekly review with AI accountability brief
FoodTab           — Week planner, meal library, grocery route planner
PantryTab         — Pantry inventory (voice add, barcode scan, manual)
PantryEditor      — List view with low stock banners, expiry alerts, quick adjust
Home              — Chore tracker (34 household tasks, due dates, Ryan/Sabrina ownership)
HistoryBrowser    — Calendar view, Sunday reports archive, AI pattern insights
```

## Data Model (KEYS → Firebase paths)
```javascript
KEYS.log(date)           // ml:log:2026-03-28  → daily morning+evening log
KEYS.weekReview(sun)     // ml:week:2026-03-23 → Sunday review data
KEYS.settings()          // ml:settings        → user name, partner name, goals
KEYS.setupDone()         // ml:setup:done      → first-run flag
KEYS.streak()            // ml:streak          → consecutive days logged
KEYS.goals()             // ml:goals           → goal objects
KEYS.chores()            // ml:chores          → chore task list
KEYS.pantry()            // ml:food:pantry     → pantry items array (235 items seeded)
KEYS.weekPlan(sun)       // ml:food:weekplan:* → weekly meal plan
KEYS.customMeals()       // ml:food:custommeal → user-added meals
KEYS.trainHistory()      // ml:train:history   → workout history
KEYS.allSundays()        // ml:allsundays      → all Sunday review summaries
KEYS.winsArchive()       // ml:wins:all        → daily wins log
```

## Log Data Shape
```javascript
// Stored at KEYS.log(date) = users/<uid>/ml/log/YYYY-MM-DD
{
  morning: {
    weight, wakeTime, sleep, energy, hunger, readiness, mood,
    steps, gratitude, intention,
    mobilityChecked, mobilityCount,
    exceptionalDay, exceptionalReason
  },
  evening: {
    cardio, strength, snack, snackNote,
    foodQuality, financeWin, financeNote,
    eveningMood, moodNote, choresDone, choreNote,
    bedtime, familyMoment, dayRating, win,
    hydration, glasses,  // ← water tracking (moved from morning)
    exceptionalDay, exceptionalReason
  }
}
```

## Pantry Item Shape
```javascript
{
  id: "seed000",          // unique string
  name: "Coconut Sugar",
  qty: 500,               // current quantity
  minQty: 100,            // alert threshold
  reorderQty: 100,        // how much to add to grocery list
  unit: "g",              // g|kg|ml|l|oz|lb|cup|tbsp|tsp|piece|can|bag|box|bottle|unit|pack|jar
  cat: "Grains",          // Produce|Protein|Dairy|Grains|Canned|Sauces|Spices|Frozen|Snacks|Other
  expiry: "2026-08",      // YYYY-MM format or ""
  notes: "Cooking Area",  // location
  brand: ""
}
```

## Users / Auth
- **Ryan** — primary user, Google account: ryanpersaud19@gmail.com
- **Sabrina** — secondary user, her own Google account
- Each user has completely separate data under their own UID
- Home tab (Chores) and Finance tab are intended to be shared eventually
  (not yet implemented — future: shared household Firebase node)

## 🚀 NEXT LEVEL FEATURE — HIGH PRIORITY
> Ryan flagged this 2026-04-09 as a top priority for the next major Finance upgrade.

### Amazon + Costco Order History Enrichment
**The idea:** Match CC transactions to actual line-item purchase data so every Amazon/Costco charge shows *what was bought*, not just a dollar amount.

**How it works:**
- **Amazon** → download Order History CSV from `amazon.ca/gp/b2b/reports`
  - Fields: Order Date, Item Title, Category, Qty, Unit Price, Total Owed
  - Match to CC transaction by **date + amount**
  - Attach line items to the transaction card in Finance
- **Costco** → use existing Receipt Scanner (Claude Vision OCR) to scan in-store receipts
  - Match to CC transaction by date/amount
  - Same line-item enrichment

**Result:** Instead of `AMAZON.CA $127.45` you see:
  - Protein Powder — $45.00
  - Resistance Bands — $32.00
  - Kitchen Scale — $50.45

**Build plan (when ready):**
1. "Import Amazon Orders" button in Finance — accepts Amazon order history CSV
2. Parse + store line items in Firebase (`KEYS.amazonOrders()`) keyed by date
3. Transaction cards that match an Amazon order get an expand arrow showing items
4. Costco receipt scan → same enrichment flow via existing receipt scanner

---

## Known Issues / In Progress
- [ ] Receipt scanner → pantry (planned: Claude Vision API to OCR receipt, map to pantry items)
- [ ] Workout favourites list (planned: save favourite exercises per user)
- [ ] Remove "slams" from workout options
- [ ] Shared Home/Pantry between Ryan and Sabrina (requires shared Firebase node logic)
- [ ] Sunday AI brief reads all historical Sunday reviews for pattern recognition

## Completed Features
- [x] Google Sign-In with per-user Firebase namespacing
- [x] Morning check-in — weight, sleep, energy, mood, steps, mobility, gratitude, intention
- [x] Evening check-in — workout, snacking, water (8 glasses), day rating, family moment, finance win
- [x] Water intake moved from Morning → Evening
- [x] useAutoSave merges (doesn't overwrite) — morning/evening data safe
- [x] History/Calendar — logs now save correctly (onSave() called after go())
- [x] Calendar shows dots for days with morning/evening data
- [x] Train tab — strength, cardio, outdoor walk with GPS map
- [x] Weekly meal planner with pantry match %
- [x] Grocery route planner (Costco, Walmart, Metro, No Frills — with card strategy)
- [x] Pantry — 235 items seeded from household inventory
- [x] Pantry — low stock banners, expiry alerts, quick adjust +/-
- [x] Pantry — voice/text add via Claude API, barcode scanner via Open Food Facts
- [x] HOME section — Chores tab + Pantry tab
- [x] Sunday weekly review with AI 5-line accountability brief
- [x] Pattern Insights — AI reads all Sunday history for multi-week trend analysis
- [x] History browser — calendar, Sunday reports archive
- [x] Goals tracker with weight/progress charts
- [x] Milestone celebrations
- [x] Firebase authorised domain added: dailyappproductivity.netlify.app
- [x] Prep time color on meal cards changed to #60a5fa (readable)

## Design System
```
Background:     #080b11 (near black)
Text primary:   #d1d5db
Text secondary: #555e73
Text muted:     #374151

Accent amber:   #f4a823  (Morning, Personal)
Accent blue:    #60a5fa  (Evening, Home)
Accent orange:  #fb923c  (Train, Health)
Accent green:   #4ade80  (positive, success)
Accent purple:  #a78bfa  (History, AI)
Accent teal:    #34d399  (Goals, Finance)
Danger:         #ef4444

Font headers:   'Syne' 700/800
Font body:      'DM Sans' 300/400/500
Border radius:  8-12px cards, 50% circles
Card style:     background: rgba(255,255,255,.03), border: 1px solid rgba(255,255,255,.07)
```

## Deployment
1. Edit app.js
2. Push to https://github.com/persaud19/Productivity-App (main branch)
3. Netlify auto-deploys in ~30 seconds

## Claude Code Session Tips
- Always read app.js structure before making changes
- The app is ~14,000 lines of compiled JS — use grep/search to find sections
- Key function locations change build-to-build; always search by function name
- When adding new components, verify they are defined BEFORE they are referenced
- Run a grep for undefined component names before delivering: `grep -c "function ComponentName" app.js`
- The DB layer handles Firebase + localStorage fallback automatically — always use DB.get/set
- Never write directly to Firebase refs in component code — always go through DB layer
- Test pantry path: users/<uid>/ml/food/pantry
- Test log path: users/<uid>/ml/log/YYYY-MM-DD
