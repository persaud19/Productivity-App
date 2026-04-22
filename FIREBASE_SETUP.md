# Firebase Setup Reference

## Project
- **Project ID:** mission-log-aef65
- **Console:** https://console.firebase.google.com/project/mission-log-aef65

## Services In Use
- **Realtime Database** — all app data
  URL: https://mission-log-aef65-default-rtdb.firebaseio.com
- **Authentication** — Google Sign-In
  Authorised domains: localhost, mission-log-aef65.firebaseapp.com, dailyappproductivity.netlify.app

## Database Structure
```
mission-log-aef65-default-rtdb/
├── users/
│   └── <uid>/              ← per-user namespace (new, post-auth)
│       └── ml/
│           ├── log/
│           │   └── 2026-03-28/    ← daily log (morning + evening)
│           ├── food/
│           │   ├── pantry         ← 235-item array
│           │   ├── weekplan/
│           │   └── grocery/
│           ├── settings
│           ├── setup/done
│           ├── streak
│           ├── goals
│           ├── chores
│           ├── allsundays
│           ├── wins/all
│           ├── week/              ← Sunday reviews
│           └── train/history
│
├── ml/                     ← OLD root-level data (pre-auth, being migrated)
├── food/                   ← OLD (migrate to users/<uid>/ml/food/)
├── log/                    ← OLD (migrate to users/<uid>/ml/log/)
└── settings                ← OLD (migrate to users/<uid>/ml/settings)
```

## Auth Flow
1. User opens app → AuthGate renders sign-in screen
2. User taps "Continue with Google" → Firebase popup
3. On success → `window.__current_uid = user.uid`
4. DB layer prepends `users/<uid>/` to all paths
5. loadAll() runs → fetches all user data

## Migration Logic (in loadAll)
On first login for a new user (empty pantry path):
1. Checks old root path `ml/food/pantry`
2. If data exists there → migrates to `users/<uid>/ml/food/pantry`
3. If no old data → seeds from PANTRY_SEED (235 items embedded in app.js)

## Firebase Security Rules (current — open, tighten before production)
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

Recommended production rules:
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## Shared Data (Future)
For Home (Chores) and Finance to be shared between Ryan and Sabrina,
create a shared household node:
```
households/
└── <householdId>/
    ├── chores
    ├── pantry
    └── finance
```
Users would be invited to a household. Not yet implemented.
