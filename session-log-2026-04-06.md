# Mission Log — Session Log
**Period:** ~2026-03-28 to 2026-04-06
**File:** app.js | Repo: persaud19/Productivity-App | Live: dailyappproductivity.netlify.app

---

## What Was Built This Period

### Finance Tab (Major Overhaul)

**CSV Parsers — 3 new formats added:**
- CIBC Credit Card: detects `YYYY-MM-DD,` + `*` in row. Filters `PAYMENT THANK YOU`, splits debit/credit, prefixes refunds with `REFUND:`
- TD Credit Card: detects `MM/DD/YYYY,` format. Converts date, filters bare card names
- CIBC Bank Statement: detects `YYYY-MM-DD,` + no `*`. Strips 10+ digit reference numbers, pre-filters CC bill payments

**Dedup fix — deterministic transaction IDs:**
- Old: `txnId` used Claude's returned description (non-deterministic → duplicates on re-import)
- Fix: `parseNormCsvRows` parses CSV client-side first, computes IDs from raw source data (date + amount + rawDesc)
- Hash function: djb2 via `txnId(prefix, date, amount, desc)`

**Bank statement timeout fix:**
- Root cause: CIBC Income CSV had 1,059 rows → 200-300 rows sent to Claude in one shot → Netlify 10s timeout → HTML 504
- Fix: Batch rows into groups of 50, loop through batches, show "Processing batch X of Y…"
- Per-batch max_tokens reduced to 4096

**Finance tab consolidation — 7 tabs → 3:**
- Before: ENVELOPES | TRANSACTIONS | INCOME | SUMMARY | COACH | IMPORT | RULES
- After: 💰 BUDGET (Envelopes · Money Out · Money In) | 📊 INSIGHTS (Summary · Coach) | 📥 IMPORT (Import CSV · Rules)
- `finTab` is derived from `view` state — no extra state needed

**Renamed:**
- "Transactions" → "Money Out" everywhere
- "Income" → "Money In" everywhere (headers, modals, buttons, empty states)

**Edit Money In (income entries):**
- Tap any income row to open Edit modal
- Fields: Source, Amount, Date, Category (9 types: Salary, Freelance, Business, Investment/Interest, Government/EI/CPP, E-Transfer Received, Rental Income, Tax Refund, Other)
- Claude bank import was always setting type: "other" — edit modal lets you fix this

**Move between buckets:**
- Edit Money In → "⇄ Move to Money Out" — removes from income, adds to transactions as uncategorized
- Edit Transaction → "⇄ Move to Money In" — removes from transactions, adds to income

**Cash transactions:**
- "💵 + CASH" button always visible at top of Money Out view
- Opens Add Expense modal with card pre-set to "Cash"
- "+ ADD EXPENSE" button also always visible alongside it

**Monthly Brief (Coach) fix:**
- Was checking `window.__claude_api_key` gate — wrong, Netlify proxy uses server-side key
- Missing `Content-Type: application/json` header
- No error handling for `data.type === "error"` responses — silently showed "Could not generate report."
- Model `claude-sonnet-4-5-20251001` replaced with `claude-haiku-4-5-20251001` (confirmed working)
- Same fixes applied to `handleChatSend`

**Screenshot scan fix:**
- Crash: `CSS_CATEGORY_MAP` typo (should be `CSV_CATEGORY_MAP`, but even that wouldn't work)
- Old logic tried to match merchant descriptions against category name map — never worked
- Fix: Claude now returns `envelopeId` + `subCat` directly in the scan response, same as CC import flow
- Merchant rules applied as fallback for any "other" entries
- Added `Content-Type` header + proper HTML timeout error handling

**Default budget template:**
- "📌 Set as Default Budget" button saves current month's allocations
- All months without custom budgets fall back to default template

**Deduplicate All Months tool:**
- Scans all months in Firebase, removes duplicate transaction/income entries by ID

**Import CSV always visible:**
- "↑ Import more" button always shows in Money Out view even when transactions exist

**Remove legacy Master CSV upload:**
- Was a one-time historical import tool
- Removed: MASTER CSV UI block, `handleImportCSV` handler, `fileRef` useRef, `importing` state

---

### Personal / Health

**Goals bug fixed:**
- Sabrina was seeing Ryan's goals
- Root cause: `goals` state initialized with `DEFAULT_GOALS` (hardcoded `weightGoal: 180, weightStart: 210`)
- If Sabrina had no saved goals, Firebase returned null → state stayed as DEFAULT_GOALS → Goals component migrated Ryan's hardcoded values
- Fix: `useState([])` instead of `useState(DEFAULT_GOALS)`

**Mobility Tab:**
- Moved morning mobility checklist to Health section as its own first tab
- Tab order: MOBILITY → TRAIN → FOOD
- Bug fix: `load()` was calling `setMobility` (async Firebase save) instead of `setMobilityState` → infinite save loop → loading never finished
- Fix: changed to `setMobilityState(logData?.morning?.mobilityChecked || {})`

**Health Scorecard:**
- Banner at top of all Health tabs
- Calories IN: from `todayMealLog` (breakfast/lunch/dinner/snacks)
- Calories BURNED: from today's trainHistory (explicit or estimated: strength=280, cardio=350)
- TDEE = BMR (from `macroTargets.calories` or 2000) + calBurned
- Net = calIn - TDEE; green if deficit, red if surplus
- Hidden if both calIn and calBurned are 0

**Edit past logs from History:**
- ✏️ Edit button in History day detail view
- Navigates Morning or Evening to history mode at that specific date
- `initialDate` prop added to Morning and Evening components

---

### History / Sunday

**Envelope drill-down:**
- Tap envelope name to expand inline transaction list
- Each drill row tappable → opens edit modal

**Transaction filters + sort:**
- Filter by card, filter by category, sort 6 ways (date↓↑, A→Z, Z→A, amount↓↑)

---

## Code Cleanup (2026-04-06)

**Removed dead data from app.js:**
- `PANTRY_SEED` (line 463, 36KB one-line JSON array, 235 pantry items) — already seeded in Firebase, no longer needed
- `CSV_CATEGORY_MAP` (22 lines) — only used by parseFinanceCSV
- `parseFinanceCSV` function (51 lines) — dead since master CSV was removed
- `loadAll` pantry fallback updated to `setPantryItems([])` instead of seeding from constant

**Before/After:**
- Before: 18,940 lines / 838KB
- After: 18,858 lines / 761KB (−58KB)

**If pantry breaks for a new user:**
- Full 235-item seed is preserved in git at commit `5a88249`
- To restore: copy PANTRY_SEED array from that commit back into app.js before the SHARED UI COMPONENTS section
- Or fetch from `/pantry-seed.json` (the file exists in repo but is not currently used)

---

## Key Architecture Reminders

- All calls go through Netlify proxy `/api/claude` → `netlify/functions/claude.js` → Anthropic
- `window.__claude_api_key` is set from app Settings but is NOT needed for Finance/Coach — proxy uses `ANTHROPIC_API_KEY` env var
- Shared paths (pantry, chores, finance, mobility) go to `households/<id>/...` via `SHARED_KEY_PREFIXES`
- Personal paths (logs, goals, settings) go to `users/<uid>/ml/...`
- `KEYS.goals()` → `ml:goals` → per-user (NOT shared) — this was the root of the Sabrina/Ryan goals bug
- Model confirmed working: `claude-haiku-4-5-20251001`
- Batch size for large CSV imports: 50 rows per API call

---

## Current Git State (2026-04-06)

- `main` = deployed to Netlify (latest: cleanup commit f768d95)
- `dev` = in sync with main
- Workflow: always commit to dev first, merge to main only on explicit "deploy"
