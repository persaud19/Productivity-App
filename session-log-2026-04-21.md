# Session Log — 2026-04-21

## Summary
Three bug fixes + one architecture correction committed to `dev`. Deployed to `main`.

---

## Changes Made

### 1. AI Pantry Deduction with Semantic Matching + User Confirmation
**Problem:** Substring matcher failed on synonyms ("toast" did not match "bread"). No user confirmation before inventory was changed.

**Fix (modules/food-tab.js):**
- Replaced substring logic with `suggestPantryMatches()` — sends meal name + pantry list to `claude-haiku-4-5-20251001` via `/api/claude` proxy
- Prompt includes synonym examples ("toast = bread, yogurt = Greek yogurt")
- If 1 candidate: auto-selected. If multiple: user picks from list
- `PantryDeductionConfirm` modal added — shows candidates with qty +/- controls, Skip / Deduct buttons
- **No deduction ever happens without user clicking "Deduct"**
- `pendingDeduction` state: `{ mealName, candidates }` — cleared after confirm or skip

### 2. Additive Deduction Paths (ingredient-level + AI, not if/else)
**Problem:** If a meal had `fromInventory: true` and explicit `ing[]`, the AI matcher was silently skipped even when `computeDeductions()` returned empty (e.g. pantry item was out of stock). The two paths were effectively AND-gated, not OR.

**Fix (modules/food-tab.js):**
- Both paths now run sequentially
- Ingredient-level runs first, captures `ingredientDeductedIds`
- AI matcher runs on remaining items (excluding already-deducted IDs) to prevent double-deduction
- If AI finds candidates → `PantryDeductionConfirm` modal fires for remaining items

### 3. Joint/Household Reminders — Creator-Relative Perspective
**Problem:** Reminders with `assignedTo: "both"` were not showing for all household members. Single-person reminders (`"me"` / `"partner"`) showed from wrong perspective when viewed by the partner.

**Fix (modules/home-tab.js):**
- Added `createdBy: window.__current_uid || null` when creating reminders
- Replaced static `assignedTo === "me"` filter with creator-relative `isMine()` / `isForPartner()` functions:
  - If I created it: `"me"` = mine, `"partner"` = theirs (unchanged)
  - If partner created it: labels flip — `"me"` (their perspective) = appears in my list as partner's; `"partner"` (their perspective) = mine
- `"both"` reminders appear for all users in their own "Both" section

### 4. Tasks Completed Today — Evening Tab
**Problem:** Evening check-in had "Any chores completed?" but no visibility into which tasks were actually marked done that day.

**Fix (modules/personal-tab.js + app.js):**
- `tasks` prop passed to `Evening` component (app.js ~line 2958)
- Below "Reminders Completed Today": new card shows all tasks where `t.last === getToday()`
- Shows task name + `completedBy` if available, with green ✓ prefix

---

## Commits
| Hash | Message |
|------|---------|
| `0b989ca` | fix(food): make ingredient-level and AI pantry deduction paths additive |
| `ef4bb0d` | fix: AI-matched pantry deduction w/ confirm, joint reminders perspective, tasks-done in evening |
| `b8e564b` | feat(food): auto-deduct pantry qty when logging a matching meal |

---

## Files Changed
- `modules/food-tab.js` — AI matcher, confirm modal, additive deduction paths
- `modules/home-tab.js` — `createdBy` field, creator-relative reminder filter
- `modules/personal-tab.js` — tasks-done-today card in Evening
- `app.js` — `tasks` prop passed to Evening

---

## Known / Needs Browser Testing
- AI pantry matcher (network call to `/api/claude`) — confirm modal appears correctly
- Joint reminders show correctly for both Ryan and Sabrina
- Tasks-done list in Evening populates when a chore is completed today

---

## Deployment
- Merged `dev` → `main` on 2026-04-21
- Netlify auto-deploy triggered on push to `main`
