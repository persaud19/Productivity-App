# Mission Log — Roadmap

## Status: Live
URL: https://dailyappproductivity.netlify.app
Both Ryan and Sabrina can sign in with their own Google accounts.

---

## Backlog (Priority Order)

### 🔴 High Priority

**Finance Section**
- Import CC statements (Amex, CIBC, TD — CSV format)
- Ryan has 2 years of categorised spending data ready
- Features needed:
  - CSV upload → auto-categorise transactions
  - Monthly spend by category (charts)
  - Budget vs actual
  - Loan payoff projection ($113K family loan + car)
  - Savings runway tracker
  - CC card strategy (which card to use where)
- Note: Amex Cobalt = 5x MR at grocery; TD Visa Infinite = 1.5x Aeroplan at grocery; Costco MC = required at Costco

**Shared Home Access**
- Ryan and Sabrina should both see the same chores list and pantry
- Requires household Firebase node (see FIREBASE_SETUP.md)
- Today: each user has their own separate chores/pantry

**Receipt Scanner → Pantry**
- User photos a grocery receipt
- Claude Vision API extracts items + quantities
- Maps to existing pantry items (updates qty) or adds new ones
- For unknown items: prompt user to scan barcode or correct manually
- Barcode scanner already built — just needs receipt OCR layer

### 🟡 Medium Priority

**Workout Favourites**
- User can star/save favourite exercises from the exercise library
- Favourites appear at top of the list when logging
- Remove "slams" from the exercise options (Ryan doesn't use it)

**Sunday AI Pattern Intelligence**
- Currently reads last 4 Sundays
- Should read ALL Sunday reviews ever saved
- Surface multi-week trends: what consistently improves, what keeps cycling, lowest pillar over time

**Shared Reporting Dashboard**
- Ryan and Sabrina see combined household stats (chores, pantry, finances)
- Each still has private personal log (morning, evening, goals)

### 🟢 Nice to Have

**Pantry Improvements**
- Bulk update quantities (after grocery run)
- Photo of receipt → update multiple items at once
- Grocery list auto-generation from low stock items (partially built)
- Pantry by location filter (Freezer / Garage Freezer / Pantry / etc.)

**Finance Integrations**
- Connect directly to bank APIs (further future)
- Auto-categorise based on merchant name
- Weekly spend summary in Sunday AI brief

**Health Integrations**
- Apple Health / Google Fit step sync (instead of manual entry)
- Sleep data from wearable

**Notifications**
- Morning reminder to log
- Evening reminder to log
- Pantry items expiring this week

---

## Development Workflow

### Making Changes
1. Open `app.js` in Claude Code
2. Find the section to change (grep by function name)
3. Make the edit
4. Upload to GitHub → Netlify auto-deploys

### Adding a New Feature
1. Define the data shape (add to KEYS if new Firebase path needed)
2. Add state to App component
3. Pass state down via props
4. Build the component
5. Add to NAV tabs if new section needed
6. Add render in App content area

### Testing
- No test suite currently
- Test manually in browser after deploy
- Check Firebase console to verify data is being written to correct path
- Use browser console to check for React errors

### File to Edit
**Always edit `app.js`** — it is the single source of truth.
`index.html` only needs changes if adding new CDN dependencies.
