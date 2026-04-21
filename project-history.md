# Mission Log — Full Project History
**App:** dailyappproductivity.netlify.app
**Repo:** github.com/persaud19/Productivity-App
**Stack:** React 18 (no build tool) · Firebase Realtime DB · Firebase Auth · Netlify · Claude API

---

## Session Log Index

> All session and weekly logs live in this folder. Upload whichever is most recent when starting a new Claude session.
> Text files have no size constraint — log verbosely.

| File | Period | Key Work |
|------|--------|----------|
| `session-log-2026-04-19.md` | Apr 19 2026 | Firebase persistence bug fix, dual qty tracking, duplicate detection, permanent delete, editable voice preview |
| `weekly-log-2026-W15.md` | Apr 6–12 2026 | Finance overhaul, Goals bug, Mobility tab, Scorecard, code cleanup |
| `session-log-2026-04-06.md` | Apr 6 2026 | Same detail as above — daily log for W15 Mon |

### Logging Rules
- **Daily log**: `session-log-YYYY-MM-DD.md` — created at end of each working day. Captures every change, bug, and decision made that day.
- **Weekly log**: `weekly-log-YYYY-Www.md` (ISO week, e.g. W15) — compiled every Sunday. Aggregates all daily logs for the week into one file.
- **This file** (`project-history.md`): Updated at the end of each week with a summary of what changed. The Session Log Index table above stays current.
- **Git**: All three types committed to `dev` branch. Never auto-deploy — merge to `main` only on explicit "deploy" instruction.

---

## Foundation (Initial Build)

### Auth & Infrastructure
- Google Sign-In via Firebase Auth
- Per-user data namespace: all data under `users/<uid>/ml/...`
- Shared household data: `households/<id>/...` for pantry, chores, finance, mobility
- `SHARED_KEY_PREFIXES` list controls routing: `["ml/food/", "ml/chores", "ml/reminders/joint", "ml/finance/", "ml/mobility/"]`
- `DB` abstraction layer handles Firebase + localStorage fallback
- `window.__current_uid` set on sign-in, used by DB layer for path resolution
- SetupInterview on first run

### Design System
- Background: `#080b11`, Text: `#d1d5db`, Muted: `#555e73`
- Accent colors: Amber `#f4a823` (Personal), Blue `#60a5fa` (Home/Evening), Orange `#fb923c` (Health), Green `#4ade80`, Purple `#a78bfa` (History/AI), Teal `#34d399` (Finance)
- Fonts: Syne 700/800 (headers), DM Sans (body)
- Loaded via CDN: React 18, Recharts, Leaflet, Firebase

---

## Personal Section

### Morning Check-in
- Weight, wake time, sleep hours, energy (1-5), hunger, readiness, mood
- Steps logged, gratitude (text), daily intention (text)
- Exceptional day flag with reason
- Auto-save 1.5s after change — merges, never overwrites (`useAutoSave`)

### Evening Check-in
- Workout logged (cardio Y/N, strength Y/N)
- Snacking level (0-3), snack note
- Water intake: 8-glass tracker (moved from Morning → Evening)
- Food quality rating, finance win of the day
- Evening mood + mood note
- Chores done flag, chore note
- Bedtime, family moment, day rating (1-10), daily win
- Finance win field

### Mobility (moved to Health)
- Originally in Morning check-in, moved to own tab in Health section
- Dynamic weekly plan generated from shared pool of exercises
- Pool Manager modal — add/remove exercises from household pool
- Hold timer / stopwatch per exercise
- Weekly plan auto-regenerates each Monday from pool
- Data saves to `KEYS.log(today).morning.mobilityChecked` (same path as before for consistency)
- Bug fixed: load() was calling `setMobility` (async Firebase save) instead of `setMobilityState` → infinite loop fixed

### Goals Tab (full rebuild)
- Old format: flat object with `weightGoal`, `weightStart`, etc. — caused Sabrina to see Ryan's values
- New format: array of goal objects, each with `id`, `type`, `label`, etc.
- Goal types: weight, habit, debt, savings, custom
- Per-goal habit log (`KEYS.goalHabitLog(id)`), progress log (`KEYS.goalProgressLog(id)`)
- Weight chart (Recharts), habit streak tracker, debt paydown tracker
- GoalWizard component for adding new goals
- Bug fixed: `useState(DEFAULT_GOALS)` → `useState([])` so new users (Sabrina) get empty goals

### Sunday Weekly Review
- Weekly review form: rating (1-10), wins, struggles, focus for next week
- AI accountability brief (5-line) generated via Claude
- History view — browse past Sunday reviews
- Pattern Insights: AI reads ALL Sunday history for multi-week trend analysis
- All Sundays archive stored at `KEYS.allSundays()`

---

## Health Section

**Tab order: MOBILITY · TRAIN · FOOD**

### Train Tab
- Decision tree: Strength / Cardio / Outdoor Walk / Indoor Walk
- **Strength session**: exercise pool, sets/reps/weight logger, interval timer
- **Cardio session**: duration, type, calories
- **Outdoor Walk**: GPS tracking via Leaflet map, distance calculated
- **Indoor Walk**: step counter, duration
- Congrats banner on completion
- Train history saved at `KEYS.trainHistory()`

### Health Scorecard (banner at top of all Health tabs)
- Calories IN: from `todayMealLog` (breakfast/lunch/dinner/snacks)
- Calories BURNED: from today's train history (explicit or estimated: strength=280, cardio=350)
- TDEE = BMR (from `macroTargets.calories` or 2000) + calBurned
- Net = calIn - TDEE; green banner if deficit, red if surplus
- Hidden when both calIn and calBurned are 0

### Food Tab
- **Week Planner**: drag-assign meals to breakfast/lunch/dinner/snacks per day
- Pantry match % per meal shown on meal card
- **Meal Library**: browse/search/filter built-in meals + custom user meals
- **Grocery Route Planner**: Costco → Walmart → Metro → No Frills with card strategy (Cobalt Amex 5x, Costco Mastercard)
- **Meal Log Chat**: AI-powered meal logging by slot (breakfast/lunch/dinner/snacks)
- **Macro tracking**: daily macro targets (calories, protein, carbs, fat), `MacroBar` progress component
- `KEYS.weekPlan(sun)`, `KEYS.customMeals()`, `KEYS.mealLog(date)`, `KEYS.macroTargets()`

---

## HOME Section

### Chores Tab
- 34 household tasks with due dates
- Ryan/Sabrina ownership per task
- Status: overdue / due today / upcoming / done
- Tap to mark complete, resets on due cycle

### Pantry Tab
- 235 items seeded on first launch (now removed from app.js — lives in Firebase)
- Categories: Produce, Protein, Dairy, Grains, Canned, Sauces, Spices, Frozen, Snacks, Other
- Low stock banners (qty < minQty)
- Expiry alerts (items expiring within 30 days)
- Quick adjust +/- buttons per item
- **Voice/Text Add**: describe item in plain English → Claude extracts structured data
- **Barcode Scanner**: uses html5-qrcode (replaced BarcodeDetector — iOS incompatible)
  - Looks up product via Open Food Facts API
- **Receipt Scanner**: upload photo → Claude OCR → matches to pantry items
- Essential/Must Have flag — archive non-essential items, restore on re-add
- PantryEditor list view with all items, search, filter by category

---

## HISTORY Section

### Calendar View
- Monthly calendar with dots on days that have morning/evening data
- Tap a day to see DayDetailView (morning + evening read-only summary)
- ✏️ Edit button in day detail → navigates Morning or Evening to history mode at that date
- `initialDate` prop added to Morning and Evening — if set and not today, opens in history view

### Sunday Reports Archive
- Browse all past Sunday reviews

### Pattern Insights
- AI reads all Sunday history for multi-week trend analysis
- Identifies cycles, consistent struggles, what's improving

---

## FINANCE Section

### Infrastructure
- Envelope budgeting system with 15+ default envelopes
- All data under `households/<id>/ml/finance/...` (shared between Ryan and Sabrina)
- `KEYS.financeTransactions(month)`, `KEYS.financeIncome(month)`, `KEYS.financeEnvelopes(month)`, `KEYS.financeAllMonths()`
- Deterministic `txnId`: djb2 hash of `prefix|date|amount|rawDesc` — prevents re-import duplicates
- Merchant Rules engine: 47+ pre-seeded keyword → envelope mappings
- Sub-category dropdown with custom add option

### Tab Structure (3 consolidated tabs)
**Before:** ENVELOPES | TRANSACTIONS | INCOME | SUMMARY | COACH | IMPORT | RULES (7 tabs)
**After:** 💰 BUDGET | 📊 INSIGHTS | 📥 IMPORT (3 main tabs with secondary pill nav)
- BUDGET → Envelopes · Money Out · Money In
- INSIGHTS → Summary · Coach
- IMPORT → Import CSV · ⚡ Rules

### Budget / Envelopes View
- Monthly envelope budget allocation
- Spent vs allocated per envelope with color-coded health bar
- Default budget template: "📌 Set as Default Budget" saves current month's allocations for all months
- Rollover: previous month's unspent carries forward
- Envelope drill-down: tap envelope name to expand inline transaction list

### Money Out (Transactions)
- Always-visible buttons: 💵 + CASH (pre-fills Cash card), + ADD EXPENSE
- Filter by card, filter by category, sort 6 ways (date↓↑, A→Z, Z→A, amount↓↑)
- ↑ Import more button always visible
- Edit transaction modal: change envelope/sub-category
  - ⇄ Move to Money In button
  - 🗑 Delete with confirm
- Colorscheme: dark on all dropdowns for readability

### Money In (Income)
- 9 income categories: Salary, Freelance, Business, Investment/Interest, Government/EI/CPP, E-Transfer Received, Rental Income, Tax Refund, Other
- Edit modal: source, amount, date, category
  - ⇄ Move to Money Out button
  - 🗑 Delete with confirm
- Claude bank import auto-classifies entries but often set type: "other" — edit modal fixes this

### CSV Import System
- **Amex XLSX**: direct XLSX parsing, no CSV conversion
- **CIBC Credit Card**: detects `YYYY-MM-DD,` + `*`. Splits debit/credit columns, prefixes refunds
- **TD Credit Card**: detects `MM/DD/YYYY,`. Converts date format, filters bare card rows
- **CIBC Bank Statement**: detects `YYYY-MM-DD,` + no `*`. Strips 10-digit reference numbers, pre-filters CC bill payments
- All formats normalize to `Date,Description,Debit,Credit` before sending to Claude
- `parseNormCsvRows` extracts raw rows client-side for stable ID generation
- Claude categorizes only (envelopeId + subCat) — never re-extracts descriptions
- **Batching**: 50 rows per API call to avoid Netlify 10s timeout (CIBC bank had 1,059 rows)
- Progress shown: "Processing batch X of Y…"

### Screenshot Scan
- Upload statement photo → Claude vision extracts + categorizes transactions
- Returns date, amount, desc, card, envelopeId, subCat in one call
- Merchant rules applied as fallback for "other" entries
- Bug fixed: was referencing undefined `CSS_CATEGORY_MAP` (typo), old logic couldn't match merchant names anyway

### Deduplicate All Months
- Scans every month in Firebase, removes duplicate transaction/income entries by ID

### Summary View
- Month totals: Income, Total Spent, Refunds, Budgeted, Net Cash Flow, transaction count
- Month history: browse past months

### Coach (AI)
- **Monthly Brief**: AI analysis of last 3 months — snapshot, watch out, wins, recommendations, trend
- **Financial Chatbot**: full conversation with access to all historical data
- Both use Netlify proxy (NOT `window.__claude_api_key`) — key lives server-side only
- Fix: removed wrong API key gate, added Content-Type header, added error handling for `data.type === "error"`

---

## Settings

- User name, partner name
- Claude API key field (legacy — key now lives in Netlify env vars, but field kept for non-proxy features)
- Household ID for shared data
- Dark/Light theme switching (Pinterest light theme for Sabrina)
- CSS variable system for theming

---

## Reminders / Notes Tab (PERSONAL section)
- Google Tasks two-way sync
- Personal reminders (`KEYS.reminders()`) and joint reminders (`KEYS.jointReminders()`)

---

## Netlify Proxy (Claude API)
- All Claude calls go through `/api/claude` → `netlify/functions/claude.js`
- Function reads `ANTHROPIC_API_KEY` from Netlify environment variables
- Client never holds the API key
- Build: `netlify/functions/claude.js` exists in repo

---

## Known Issues / Pending (as of 2026-04-06)
- [ ] Finance section — placeholder only for some features. Ryan has Amex, CIBC, TD CSV data imported
- [ ] Sunday AI brief — doesn't yet read ALL historical Sunday reviews for deep pattern recognition
- [ ] Shared Home/Pantry between Ryan and Sabrina — shared Firebase node logic exists but needs testing
- [ ] Workout favourites list — planned
- [ ] Receipt scanner → pantry — partially built, needs more testing

---

## Code Cleanup History
- **2026-04-06**: Removed `PANTRY_SEED` (36KB, 235 items — already in Firebase), `CSV_CATEGORY_MAP`, `parseFinanceCSV`
  - Before: 18,940 lines / 838KB → After: 18,858 lines / 761KB
  - Restore: git commit `5a88249` has full PANTRY_SEED intact

---

## Git Commit Reference (Key Milestones)
```
9f853d6  Session log 2026-04-06
f768d95  Cleanup: remove dead data (-58KB)
5a88249  Fix screenshot scan categorization
35bb0a2  Remove legacy Master CSV upload
e1dfa42  Finance: 3-tab consolidation
8d48603  Fix Finance coach Monthly Brief
7b0bc3b  Edit Money In + move between buckets
d527d87  Bank statement batch fix (50 rows/call)
3af43f3  Fix goals per-user (Sabrina bug)
3bd8e02  Fix MobilityTab loading + tab order
d7257d3  Health Scorecard + Mobility tab
8d05169  Edit past logs from History
669153c  Transaction filters + sort
af95ed5  Envelope drill-down
3781c74  Default budget template
9eb841f  Edit transaction modal + delete
67b7431  Deduplicate All Months tool
ec6ca5d  Fix duplicate transactions on re-import
494768b  CIBC bank statement parser
e99e3a7  TD CSV parser
83a7121  CIBC CC parser
6090131  Netlify Claude proxy (removes per-user key)
8198c80  Goals tab full rebuild
60dc11d  Hold timer for mobility
505d0a9  Mobility dynamic weekly plan + pool
61e9bd8  Finance COACH tab (brief + chatbot)
e280045  CC vs Bank Statement import modes
608cab1  Merchant rules engine (47 seeds)
fd51855  Edit transaction + add income modals
98c75e4  Finance envelope budgeting + CSV + rollover
390d267  Meal log, macro tracking, Train backlog
ec5abf7  Reminders + Google Tasks sync
360f46e  Receipt scanner → pantry
27085cb  Dark/Light theme switching
ecdc19e  Barcode scanner (html5-qrcode, iOS fix)
bfa3e05  Train decision tree + indoor walk
717011d  Claude API key settings + shared household
```
