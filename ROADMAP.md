# Corevado — Roadmap

## Status: Live
URL: https://corevado.netlify.app
Both Ryan and Sabrina can sign in with their own Google accounts.

Last updated: 2026-05-17 (full audit + planning session)

---

## Revised Action Plan (2026-05-17)

### Phase 0 — Bug Fixes 🔴 (do first)
Broken things. Fix before adding anything new. ~2–3 hours total.

- [ ] Add toast/error system for Firebase failures — replace all silent `catch(e) {}` with user-facing "Sync failed" feedback
- [ ] Fix `onAddToGrocery` dead stub — implement low-stock → grocery list
- [ ] Move `AI_MODEL` to a top-of-file constant (currently hardcoded `claude-sonnet-4-20250514` at ~line 1291)
- [ ] Remove dead user-switcher code (`false &&` block at ~line 2917)
- [ ] Fix auto-save race condition — check `lastModified` timestamp before merge to prevent half-filled form overwriting a complete one

### Phase 1 — Landing Page + Desktop Shell 🔴 (~1–2 days)
These two are the same build. Do together.

- [ ] Add `useDesktop()` hook to app.js (watches `window.innerWidth >= 900`)
- [ ] Add responsive CSS block to index.html (sidebar width, hover states, scrollbars)
- [ ] Build left sidebar nav for desktop (collapses to tab row on mobile)
- [ ] Build `LandingPage` component — 2×3 card grid (mobile) / full dashboard (desktop)
  - PERSONAL card: morning done? evening done? streak count
  - HEALTH card: last workout X days ago, today's mobility status
  - HOME card: chores due today count, low pantry items count
  - FINANCE card: month spend vs budget
  - HISTORY card: last Sunday review date
  - Tap any card → navigate to that section
- [ ] Add 1-hour session restore logic
  - `activeSection` state init reads `ml_last_active` from localStorage
  - Every tab change writes `{ section, subTab, ts: Date.now() }` to localStorage
  - If `Date.now() - ts < 3600000` → restore silently (skip landing)
  - Otherwise → show landing page

### Phase 2 — Desktop Section Layouts 🟡 (~2–3 days)
Highest daily-use sections first.

- [ ] HOME: Chores left col + Pantry right col on desktop
- [ ] PERSONAL: Morning + Evening side by side on desktop
- [ ] HISTORY: Calendar left + log detail right (tap a day → show full log)
- [ ] HEALTH → Train: workout form left + history/summary right
- [ ] FINANCE: overview sidebar + transaction list main pane

### Phase 3 — Google Calendar Integration 🟡 (~half day)
AuthGate already has Google OAuth — just needs calendar scope added.

- [ ] Add `https://www.googleapis.com/auth/calendar.events` scope to AuthGate
- [ ] Build `getValidToken()` helper with silent re-auth before expiry
- [ ] "Log to Calendar" button in Train tab (auto-push workout as event)
- [ ] Pull today's Calendar events → show on Landing page
- [ ] Chore due date → auto-create Calendar reminder when set
- [ ] Sunday review → auto-create 30-min block every Sunday 9am

### Phase 4 — Phone Notifications 🟡 (~1 day Option A / ~1 week Option B)

**Option A — Browser notifications (ship fast)**
- [ ] Request notification permission in SetupWizard
- [ ] 8am nudge: "Morning check-in not done yet"
- [ ] 9pm nudge: "Evening check-in not done yet"
- [ ] Note: requires tab open/backgrounded. iOS requires PWA install ("Add to Home Screen")

**Option B — Web Push (true background, phone vibrates when app closed)**
- [ ] Generate VAPID keys: `npx web-push generate-vapid-keys`
- [ ] Add VAPID keys to Netlify environment variables
- [ ] Create `sw.js` service worker in repo root
- [ ] Subscribe browser at login, save subscription to `ml:push:subscription` in Firebase
- [ ] Create `netlify/functions/send-push.js` using `web-push` npm package
- [ ] Netlify scheduled function: trigger 8am + 9pm pushes daily

### Phase 5 — Existing Feature Completion 🟢 (ongoing, pick as time allows)

**History / Data**
- [ ] History browser: tap a calendar day → show full morning + evening log (read-only card)
- [ ] Workout history: weekly/monthly summary chart (avg session length, frequency)
- [ ] Achievement wall: display `ml:achievements` data — currently written but never shown
- [ ] Wins archive: dedicated view for `ml:wins:all`
- [ ] Sunday review modules: load and render habit reflection, mental health, workout notes modules

**Home**
- [ ] Pantry → Grocery: one-tap "add all low stock" to this week's grocery list
- [ ] Chores: recurring schedule — auto-reset due date after completion (e.g. vacuum = +7 days)

**Finance**
- [ ] Envelope overage alerts at 80% budget — badge on Finance nav
- [ ] Enforce `shareFinance` toggle in UI (currently writes to Firebase but never gates access)

**Personal**
- [ ] Goals: verify habit goals fully surfaced with proper streak tracking

### Phase 6 — Partner/Household Experience 🟢
- [ ] Sabrina "partner pulse" card on Landing page — Ryan's mood + streak today
- [ ] Shared household timeline feed (chores completed, workouts logged, reverse-chron)
- [ ] Proper partner view mode on relevant sections

---

## Future Roadmap (larger builds)

**Amazon/Costco Order Enrichment** (flagged 2026-04-09 as top Finance priority)
- Import Amazon Order History CSV → match to CC transactions by date/amount
- Costco: receipt scan via existing Claude Vision OCR
- Result: transaction cards show line-item breakdown instead of just dollar amount
- Build plan in CLAUDE.md under "NEXT LEVEL FEATURE"

**Mid-week AI Coach Brief**
- Wednesday: Claude reads Mon–Wed logs → 3-sentence course-correction
- "You're trending low on water and skipped two workouts — here's a strong finish to the week"

**Daily Log AI Pattern Insights**
- Currently Pattern Insights only reads Sunday reports
- New: read 30 days of `ml:log/<date>` → surface daily patterns
- "Your energy is consistently low on Thursdays — you tend to sleep under 6h on Wednesdays"

**Receipt Scanner → Pantry**
- Photo a grocery receipt → Claude Vision OCR → map to pantry items → update quantities
- For unknowns: prompt barcode scan or manual correction
- Barcode scanner already built, just needs OCR layer

**Multi-User Household (Phase 2)**
- Invite code system (6-char code)
- Email pre-link (leader pre-links email before member signs up)
- Member join flow
- Full design in CLAUDE.md under "MAJOR ARCHITECTURE ROADMAP"

**Apple Health / Google Fit Sync**
- Replace manual step entry with wearable sync
- Sleep data from wearable

---

## Known Bugs (as of 2026-05-17 audit)

| Bug | Severity | Phase |
|---|---|---|
| Silent Firebase failures (12+ empty catch blocks) | High | Phase 0 |
| `onAddToGrocery` handler is empty stub — does nothing | High | Phase 0 |
| Hardcoded AI model name (will break on model retirement) | Medium | Phase 0 |
| Auto-save race condition on fast tab switching | Medium | Phase 0 |
| Partner UID falls back to stale settings value | Medium | Phase 0 |
| Dead user-switcher code (`false &&`) | Low | Phase 0 |
| Household `shareFinance` toggle writes but never enforces | Medium | Phase 5 |
| `generateWeeklyPlan()` defined but never called | Low | Phase 5 |
| Token refresh not implemented (Calendar calls will fail after 58 min) | Medium | Phase 3 |

---

## Development Workflow

### Making Changes
1. Open `app.js` in Claude Code
2. Find the section to change (grep by function name)
3. Make the edit
4. Push to `dev` branch (never auto-deploy)
5. Merge to `main` only on explicit "deploy" instruction from Ryan
6. Netlify auto-deploys from `main` in ~30 seconds

### Adding a New Feature
1. Define the data shape (add to KEYS if new Firebase path needed)
2. Add state to App component
3. Pass state down via props
4. Build the component
5. Add to NAV tabs if new section needed
6. Add render in App content area
7. Update session log + CLAUDE.md

### File to Edit
**Always edit `app.js`** — it is the single source of truth.
`index.html` only needs changes if adding new CDN dependencies or CSS blocks.
`sw.js` (service worker) is new — will be added in Phase 4.
`netlify/functions/` — new directory for push notification function in Phase 4.
