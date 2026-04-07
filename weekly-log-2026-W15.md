# Weekly Log — 2026 Week 15
**Period:** Monday 2026-04-06 → Sunday 2026-04-12
**App:** dailyappproductivity.netlify.app
**Repo:** github.com/persaud19/Productivity-App

---

## Week Summary
First full-logging week. Finance section received a major overhaul, code was audited and cleaned, and the session/history logging system was established.

---

## Sessions This Week

### Monday 2026-04-06 — Finance Overhaul + Code Cleanup
**Full log:** `session-log-2026-04-06.md`
**Commits:** `9f853d6`, `f768d95` (+ earlier commits this period: `e1dfa42`, `8d48603`, `7b0bc3b`, `d527d87`, `3af43f3`, `3bd8e02`)

#### What Was Built

**Finance — CSV Parsers (3 new formats):**
- CIBC Credit Card: detects `YYYY-MM-DD,` + `*`. Filters payments, splits debit/credit, prefixes refunds
- TD Credit Card: detects `MM/DD/YYYY,`. Converts date, filters bare card names
- CIBC Bank Statement: detects `YYYY-MM-DD,` + no `*`. Strips reference numbers, pre-filters CC bill payments

**Finance — Dedup fix:**
- Old `txnId` used Claude's returned description (non-deterministic → duplicates on re-import)
- Fix: `parseNormCsvRows` parses CSV client-side first, IDs from raw source: djb2 hash of `prefix|date|amount|rawDesc`

**Finance — Bank statement timeout fix:**
- Root cause: CIBC bank CSV had 1,059 rows → single API call → Netlify 10s timeout → HTML 504
- Fix: Batch 50 rows per call, loop through batches, progress "Processing batch X of Y…"

**Finance — 7 tabs → 3 consolidated tabs:**
- Before: ENVELOPES | TRANSACTIONS | INCOME | SUMMARY | COACH | IMPORT | RULES
- After: 💰 BUDGET (Envelopes · Money Out · Money In) | 📊 INSIGHTS (Summary · Coach) | 📥 IMPORT (Import CSV · Rules)
- `finTab` derived from `view` state — no new state needed

**Finance — Renamed:**
- "Transactions" → "Money Out" everywhere
- "Income" → "Money In" everywhere

**Finance — Edit Money In (income entries):**
- Tap any income row to open edit modal
- 9 income types: Salary, Freelance, Business, Investment/Interest, Government/EI/CPP, E-Transfer Received, Rental Income, Tax Refund, Other
- Claude bank import always set type "other" — modal lets you fix it

**Finance — Move between buckets:**
- Edit Money In → "⇄ Move to Money Out" — removes from income, adds to transactions as uncategorized
- Edit Transaction → "⇄ Move to Money In" — removes from transactions, adds to income

**Finance — Cash transactions:**
- "💵 + CASH" button always visible at top of Money Out view
- Opens Add Expense modal with card pre-set to "Cash"
- "+ ADD EXPENSE" also always visible

**Finance — Coach Monthly Brief fix:**
- Removed wrong `window.__claude_api_key` gate (proxy uses server-side key)
- Added `Content-Type: application/json` header
- Added error handling for `data.type === "error"` responses
- Swapped model to `claude-haiku-4-5-20251001` (confirmed working)
- Same fixes applied to `handleChatSend`

**Finance — Screenshot scan fix:**
- Crash: `CSS_CATEGORY_MAP` typo (undefined variable)
- Old match logic would never work anyway (category names ≠ merchant descriptions)
- Fix: Claude now returns `envelopeId` + `subCat` directly in scan response, same as CC import
- Merchant rules applied as fallback for "other" entries

**Finance — Remove legacy Master CSV upload:**
- Was a one-time historical import tool
- Removed: UI block, `handleImportCSV` handler, `fileRef` useRef, `importing` state

**Personal/Health — Goals bug fixed:**
- Sabrina was seeing Ryan's goals (weightGoal: 180, weightStart: 210)
- Root cause: `useState(DEFAULT_GOALS)` — Sabrina with no saved goals stayed at DEFAULT_GOALS
- Fix: `useState([])` — new users see empty goals list

**Health — Mobility Tab:**
- Moved morning mobility checklist to Health section as its own first tab
- Tab order: MOBILITY → TRAIN → FOOD
- Bug fix: `load()` called `setMobility` (Firebase save) instead of `setMobilityState` → infinite save loop
- Fix: `setMobilityState(logData?.morning?.mobilityChecked || {})`

**Health — Scorecard:**
- Banner at top of all Health tabs
- Cal IN from `todayMealLog`, Cal BURNED from `trainHistory` (strength=280, cardio=350 estimates)
- TDEE = BMR + calBurned. Net = calIn − TDEE. Green if deficit, red if surplus
- Hidden if both calIn and calBurned are 0

**History — Edit past logs:**
- ✏️ Edit button in History day detail → navigates Morning or Evening to that date in history mode
- `initialDate` prop added to Morning and Evening components

#### Code Cleanup
- Removed `PANTRY_SEED` (36KB one-line JSON, 235 items — already in Firebase)
- Removed `CSV_CATEGORY_MAP` (22 lines, dead code)
- Removed `parseFinanceCSV` (51 lines, dead since master CSV removed)
- `loadAll` pantry fallback → `setPantryItems([])` instead of seeding from constant
- Before: 18,940 lines / 838KB → After: 18,858 lines / 761KB (−58KB)
- Restore point: git commit `5a88249` has full PANTRY_SEED intact

#### Key Commits
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
```

---

## Week Notes
- No outstanding bugs at end of week
- Session log system established — daily logs + weekly compilation + project history updates
- Text/doc files have no size constraints (only app.js matters for browser performance)

---

## Pending / Up Next
- [ ] Health: Workout favourites list
- [ ] Finance: Verify shared household data path for Ryan + Sabrina
- [ ] Sunday: AI brief reading all historical Sunday reviews (deep pattern recognition)
- [ ] Receipt scanner → pantry: needs more testing
- [ ] New user pantry seed: if a new user registers and gets empty pantry, restore PANTRY_SEED from commit `5a88249`
