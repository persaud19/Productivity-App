# Session Log — 2026-05-17

**Type:** Planning / Architecture session (no code written)
**Focus:** Full build audit + revised roadmap for next phase of Corevado

---

## Session Summary

Deep audit of the full app.js codebase. Identified bugs, dead code, half-built features, and gaps. Discussed four major new feature areas: Google Calendar integration, phone notifications, smart landing page with 1-hour session restore, and a proper desktop layout. No code was changed this session — this is a planning document for the next sprint(s).

---

## 1. Full Build Audit Findings

### 🔴 Bugs / Broken Features (fix before building anything new)

**A. Silent Firebase failures (12+ locations)**
- `catch(e) {}` empty blocks throughout DB operations
- Data can fail to write with zero UI feedback to user
- Fix: add a toast/banner system — show "Sync failed" on any Firebase error

**B. `onAddToGrocery` is a dead stub**
- PantryTab receives `onAddToGrocery` prop but handler is literally `() => {}`
- Button exists, tapping does nothing
- Fix: implement the actual add-to-grocery logic (low-stock items → current week's grocery list)

**C. Auto-save race condition**
- `useAutoSave` debounces at 1.5s and merges on write
- Fast tab switching can merge a half-filled form over a complete prior one
- Fix: check `lastModified` timestamp before merge — only merge if incoming is newer

**D. `callClaude()` model hardcoded**
- `claude-sonnet-4-20250514` baked into line ~1291
- When model retires → silent API errors
- Fix: move to a `const AI_MODEL = 'claude-sonnet-4-20250514'` at top of app.js

**E. Partner UID resolution fragile**
- `window.__current_partner_uid` set from household meta, fallback to `settings.partnerUid`
- If Sabrina re-signs-up, partner features break silently
- Fix: always resolve from live household meta, never stale settings

**F. Achievement data written, never shown**
- `ml:achievements` persisted to Firebase on milestone events
- No UI ever reads or displays it
- Decision needed: build the achievements wall or stop writing the data

### 🟡 Incomplete / Half-Built Features

| Feature | Status | Gap |
|---|---|---|
| Sunday review modules | Firebase keys exist (`ml:sunday:module:<date>:<mod>`) | Keys defined, never loaded/rendered in Sunday tab |
| `generateWeeklyPlan()` | Full algorithm in app.js | Defined but never called anywhere in UI |
| History browser day tap | Calendar dots show | Tapping a day doesn't show the actual log — just confirmation something existed |
| Workout history summary | All data in `ml:train:history` | No weekly/monthly summary view (avg session length, frequency, etc.) |
| Finance `shareFinance` toggle | Written to Firebase | Never read back to gate UI access — writes but doesn't enforce |
| User switcher (partner toggle) | UI exists | Hidden behind `false &&` — dead code, should be removed or re-enabled |
| Habit goals | Data model has `ml:goals:habit:<id>` | Unclear if fully surfaced with streak tracking in UI |
| Recipe extraction | `callClaude()` works | Never called from any UI — no trigger exists |

### 🟢 Data Model Gaps (data exists, no display)

- **Workout history**: no chart or summary — data is there, visualization is not
- **Wins archive** (`ml:wins:all`): no dedicated view, just stored
- **Celebration log** (`ml:achievements`): stored, never displayed
- **Sunday modules**: keys for habit reflection, mental health, workout notes — never rendered

---

## 2. New Features Discussed

### Feature A — Smart Landing Page + 1-Hour Session Restore

**The idea:**
- On load, check localStorage for `{ section, subTab, timestamp }`
- If timestamp < 1 hour ago → silently restore user to exact tab/subTab
- If timestamp > 1 hour ago (or no saved state) → show Landing page

**Landing page purpose:**
- Triage view — big cards for each section
- Each card shows live context (morning done?, chores due, pantry alerts, finance status)
- User taps a card → goes to that section
- Also works as the "home base" / Today Dashboard that was missing

**Technical approach:**
- `activeSection` state initialized to `null` (= show landing) or restored section
- `localStorage.setItem('ml_last_active', JSON.stringify({ section, subTab, ts: Date.now() }))` on every tab change
- `if (!activeSection) return <LandingPage ...>` in App render

**Landing page card content:**
| Card | Shows |
|---|---|
| PERSONAL | Morning done? Evening done? Streak |
| HEALTH | Last workout (X days ago), today's mobility |
| HOME | Chores due today, low pantry items count |
| FINANCE | Month spend vs budget |
| HISTORY | Last Sunday review date |

**Decisions made:**
- Within 1 hour: restore exact tab + subTab (not just top-level section)
- Design desktop-first since it's the first impression on big screen
- Mobile: 2×3 card grid, scrollable
- Desktop: all cards visible at once, no scroll needed

---

### Feature B — Desktop Layout

**Current state:** Mobile-first inline styles, no breakpoints. Looks like a stretched phone on 1440px screens.

**Approach:**
1. Add `useDesktop()` hook — `window.innerWidth >= 900`, updates on resize
2. Add responsive CSS to `index.html` for hover states, sidebar width, scrollbars
3. Desktop nav: left sidebar (not top tab row)
4. Per-section 2-column layouts where valuable

**Desktop layout shell:**
```
┌─────────────────────────────────────────────┐
│  COREVADO    [streak]  [settings]           │  ← top bar
├──────────┬──────────────────────────────────┤
│ PERSONAL │                                  │
│ HEALTH   │     Section content              │
│ HOME     │     (2-col where it makes sense) │
│ FINANCE  │                                  │
│ HISTORY  │                                  │
└──────────┴──────────────────────────────────┘
```

**Per-section desktop upgrades:**
| Section | Desktop layout |
|---|---|
| Landing | Full dashboard, all cards at once |
| PERSONAL | Morning + Evening side by side |
| HOME | Chores left, Pantry right |
| HEALTH → Finance | Overview sidebar + transaction list main pane |
| HISTORY | Calendar left, log detail right |
| HEALTH → Train | Workout form left, history right |

**Build order for desktop:**
1. `useDesktop` hook
2. Left sidebar nav
3. Landing page (desktop-first)
4. HOME 2-col (highest daily use)
5. PERSONAL 2-col
6. Finance layout (most complex, last)

---

### Feature C — Google Calendar Integration

**What's already there:**
- `AuthGate` already does Google OAuth and stores `window.__google_access_token`
- Currently requests Google Tasks scope only

**Step 1:** Add `https://www.googleapis.com/auth/calendar.events` to OAuth scopes (one-line change in AuthGate)

**Step 2:** Use the existing token to call Google Calendar REST API directly — no library needed

**Use cases to build (priority order):**
1. Log workout → push as Calendar event after saving Train session
2. Chore due dates → add as Calendar reminder when due date is set
3. Pull today's events → show on Landing page / Today Dashboard
4. Sunday review → auto-create 30-min block every Sunday 9am
5. Meal plan → push dinner plans as evening Calendar events

**Token refresh gap:** Token expires ~58 min, expiry tracked in `window.__google_token_expiry` but no auto-refresh exists. Need a `getValidToken()` helper that re-auths silently before any Calendar call.

---

### Feature D — Phone Notifications

Two options, build in order:

**Option 1 — Browser Notification API (ship in ~1 day)**
- Works when app tab is open/backgrounded
- iOS: requires "Add to Home Screen" (PWA install)
- Request permission in SetupWizard
- Use `setTimeout` to schedule reminders within the session (e.g. 9pm evening nudge)
- Limitation: timers clear when tab closes

**Option 2 — Web Push (true background notifications, ~1 week)**
- Works when app is fully closed
- Requires: `sw.js` (service worker), VAPID keys, Netlify Function to send pushes, Firebase to store subscriptions
- Steps:
  1. Generate VAPID keys once: `npx web-push generate-vapid-keys`
  2. Add to Netlify env vars
  3. Create `sw.js` in repo root (push event listener)
  4. Subscribe browser at login, save subscription JSON to `ml:push:subscription` in Firebase
  5. Create `netlify/functions/send-push.js` using `web-push` npm package
  6. Trigger from Netlify scheduled function (8am morning, 9pm evening)

**Notification use cases:**
- 8am: "Morning check-in not done yet"
- 9pm: "Evening check-in not done yet"  
- Ad hoc: "3 pantry items expiring this week"
- Chore due: "Vacuum is due today"

---

## 3. Revised Action Plan

### Phase 0 — Bug Fixes (do first, ~2–3 hours)
These are broken things. Fix before adding anything new.

- [ ] Add toast/error system for Firebase failures (replace all `catch(e) {}`)
- [ ] Fix `onAddToGrocery` stub — implement low-stock → grocery list
- [ ] Move `AI_MODEL` to a top-of-file constant
- [ ] Remove dead user-switcher code (`false &&` block at ~line 2917)
- [ ] Fix auto-save race condition with timestamp check before merge

### Phase 1 — Landing Page + Desktop Shell (~1–2 days)
These two are the same build. Do together.

- [ ] Add `useDesktop()` hook to app.js
- [ ] Add responsive CSS block to index.html (sidebar width, hover states)
- [ ] Build left sidebar nav for desktop (collapses to tab row on mobile)
- [ ] Build `LandingPage` component — 2×3 card grid (mobile) / full dashboard (desktop)
  - Each card shows live context from already-loaded state
  - Tap navigates to section and saves to localStorage
- [ ] Add 1-hour session restore logic
  - `activeSection` state init reads localStorage
  - Every tab change writes `{ section, subTab, ts }` to localStorage
  - If < 1hr → restore silently; if > 1hr → show landing

### Phase 2 — Desktop Section Layouts (~2–3 days)
Highest daily-use sections first.

- [ ] HOME: Chores left col + Pantry right col on desktop
- [ ] PERSONAL: Morning + Evening side by side on desktop
- [ ] HISTORY: Calendar left + log detail right
- [ ] HEALTH → Train: workout form left + history right
- [ ] FINANCE: overview sidebar + transaction list (most complex, last)

### Phase 3 — Google Calendar (~half day)
- [ ] Add calendar scope to AuthGate OAuth
- [ ] Build `getValidToken()` helper with silent re-auth
- [ ] "Log to Calendar" button in Train tab
- [ ] Pull today's events for Landing page
- [ ] Chore due date → Calendar event

### Phase 4 — Notifications (~1 day for Option 1, ~1 week for Option 2)
- [ ] Request notification permission in SetupWizard
- [ ] In-app session reminders (morning + evening nudge via setTimeout)
- [ ] `sw.js` service worker
- [ ] VAPID keys in Netlify env
- [ ] `netlify/functions/send-push.js`
- [ ] Store push subscription in Firebase on login
- [ ] Netlify scheduled function: 8am + 9pm push triggers

### Phase 5 — Existing Feature Completion (ongoing)
Pick from this list as time allows:

- [ ] History browser: tap a calendar day → show full morning + evening log
- [ ] Workout history: weekly/monthly summary chart
- [ ] Sunday review modules: load and render habit/mental/workout modules
- [ ] Achievement wall: display `ml:achievements` data
- [ ] Pantry → Grocery: one-tap "add all low stock" button
- [ ] Chores: recurring schedule (auto-reset due date after completion)
- [ ] Finance: envelope overage alerts at 80% budget
- [ ] Finance: `shareFinance` toggle enforcement in UI
- [ ] Wins archive: dedicated view

### Phase 6 — Partner/Household Experience
- [ ] Sabrina "partner pulse" card on Landing — Ryan's mood + streak today
- [ ] Shared household timeline feed (chores completed, workouts logged)
- [ ] Proper partner view mode (see their day rating, not just your own data)

### Future Roadmap (already in ROADMAP.md, unchanged priority)
- Amazon/Costco order history enrichment (Finance)
- Weekly mid-week AI coach brief (Wednesday check-in)
- Receipt scanner → pantry OCR (Claude Vision)
- Apple Health / Google Fit step sync
- Full multi-user household invite system (Phase 2 of household build)

---

## Notes for Next Session

- Start with Phase 0 bug fixes — they're quick and clean up the foundation
- Phase 1 (Landing + Desktop shell) is the highest visual impact work
- Landing page and desktop layout should be designed together — same component, responsive
- Don't start Phase 3 (Calendar) until Phase 1 is live — Calendar events should appear on the Landing page Today view
- CLAUDE.md should be updated after Phase 1 to document the new `useDesktop` hook and landing page logic
