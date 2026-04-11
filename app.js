// ─────────────────────────────────────────────────────────────────────────────
// DB LAYER — Firebase Realtime Database with localStorage fallback
// Set FIREBASE_CONFIG in the HTML before this script loads to enable Firebase.
// Falls back to localStorage automatically if Firebase is not configured.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// AUTH — Google Sign-In via Firebase Auth
// Each user gets their own data namespace: ml/users/<uid>/...
// ─────────────────────────────────────────────────────────────────────────────

function AuthGate({
  children
}) {
  const [user, setUser] = useState(null); // firebase user object
  const [authReady, setAuthReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!window.__firebase_auth) return;
    const unsub = window.__firebase_auth.onAuthStateChanged(u => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);
  const signIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      const provider = new window.__GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/tasks");
      const result = await window.__firebase_auth.signInWithPopup(provider);
      // Capture Google access token for Tasks API
      const cred = window.__GoogleAuthProvider.credentialFromResult(result);
      if (cred?.accessToken) {
        window.__google_access_token = cred.accessToken;
        window.__google_token_expiry = Date.now() + 3500000; // ~58 min
      }
    } catch (e) {
      setError(e.message?.includes("popup-closed") ? null : "Sign-in failed. Try again.");
    }
    setSigningIn(false);
  };
  const signOut = async () => {
    await window.__firebase_auth.signOut();
  };
  if (!authReady) return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontFamily: "'Syne',sans-serif",
      fontSize: 12,
      letterSpacing: ".1em"
    }
  }, "LOADING..."));
  if (!user) return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 32px",
      fontFamily: "'DM Sans',sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontFamily: "'Syne',sans-serif",
      fontSize: 28,
      fontWeight: 800,
      margin: "0 0 4px",
      letterSpacing: ".05em"
    }
  }, "MISSION LOG"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 12,
      margin: "0 0 48px",
      letterSpacing: ".08em",
      textTransform: "uppercase"
    }
  }, "Daily Life OS"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--card-bg-3)",
      border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 16,
      padding: "32px 24px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-primary)",
      fontSize: 14,
      margin: "0 0 8px",
      fontWeight: 500
    }
  }, "Sign in to access your personal logs"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 11,
      margin: "0 0 28px",
      lineHeight: 1.6
    }
  }, "Ryan and Sabrina each have their own separate data, history, and reports."), error && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#ef4444",
      fontSize: 11,
      margin: "0 0 14px"
    }
  }, error), /*#__PURE__*/React.createElement("button", {
    onClick: signIn,
    disabled: signingIn,
    style: {
      width: "100%",
      padding: "14px 0",
      background: signingIn ? "var(--card-bg-2)" : "var(--card-border-2)",
      border: "1px solid rgba(255,255,255,.15)",
      borderRadius: 12,
      color: signingIn ? "var(--text-muted)" : "var(--text-primary)",
      fontSize: 14,
      fontWeight: 700,
      cursor: signingIn ? "default" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      fontFamily: "'DM Sans',sans-serif"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#4285F4",
    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#34A853",
    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FBBC05",
    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#EA4335",
    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
  })), signingIn ? "Signing in..." : "Continue with Google")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#2d3340",
      fontSize: 10,
      margin: "20px 0 0",
      lineHeight: 1.6
    }
  }, "Your data is stored privately in Firebase under your Google account. No one else can access your logs.")));
  return /*#__PURE__*/React.createElement(UserContext.Provider, {
    value: {
      user,
      signOut,
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    }
  }, children);
}
const UserContext = React.createContext(null);
const useUser = () => React.useContext(UserContext);
const DB = (() => {
  // Firebase path helpers — convert key like "ml:log:2026-03-22" to "users/<uid>/ml/log/2026-03-22"
  // hh: prefix → households/<householdId>/ml/<rest>
  // up: prefix → users/<uid>/<rest>  (no ml/ namespace — for profile-level fields like householdId)
  const toPath = k => {
    const uid = window.__current_uid;
    // hh: prefix — household shared data
    if (k.startsWith("hh:")) {
      const hid = window.__current_household_id;
      if (!hid) throw new Error("No household ID — user has not joined a household");
      const subPath = k.slice(3).replace(/:/g, "/");
      return `households/${hid}/ml/${subPath}`;
    }
    // up: prefix — user profile data (sits directly under users/<uid>/, no ml/ namespace)
    if (k.startsWith("up:")) {
      const subPath = k.slice(3).replace(/:/g, "/");
      return uid ? `users/${uid}/${subPath}` : subPath;
    }
    // legacy household routing for old ml/food/, ml/chores, ml/finance/ keys
    const base = k.replace(/:/g, "/");
    const householdId = window.__household_id;
    const SHARED_KEY_PREFIXES = ["ml/food/", "ml/chores", "ml/reminders/joint", "ml/finance/", "ml/mobility/"];
    if (householdId && SHARED_KEY_PREFIXES.some(p => base.startsWith(p))) {
      return `households/${householdId}/${base}`;
    }
    return uid ? `users/${uid}/${base}` : base;
  };

  // Firebase ref getter — returns null if Firebase not ready
  const fbRef = k => {
    if (!window.__firebase_db) return null;
    return window.__firebase_db.ref(toPath(k));
  };

  // localStorage fallback
  const lsGet = k => {
    try {
      const v = localStorage.getItem("ml2:" + k);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  };
  const lsSet = (k, v) => {
    try {
      localStorage.setItem("ml2:" + k, JSON.stringify(v));
      return true;
    } catch {
      return false;
    }
  };
  const lsDel = k => {
    try {
      localStorage.removeItem("ml2:" + k);
      return true;
    } catch {
      return false;
    }
  };
  return {
    get: async k => {
      try {
        const ref = fbRef(k);
        if (ref) {
          const snap = await ref.once("value");
          return snap.exists() ? snap.val() : null;
        }
        return lsGet(k);
      } catch {
        return lsGet(k);
      }
    },
    set: async (k, v) => {
      try {
        const ref = fbRef(k);
        if (ref) {
          await ref.set(v);
          return true;
        }
        return lsSet(k, v);
      } catch {
        return lsSet(k, v);
      }
    },
    del: async k => {
      try {
        const ref = fbRef(k);
        if (ref) {
          await ref.remove();
          return true;
        }
        return lsDel(k);
      } catch {
        return lsDel(k);
      }
    },
    // Used on startup to migrate existing localStorage data to Firebase
    migrateFromLocalStorage: async () => {
      if (!window.__firebase_db) return;
      const prefix = "ml:";
      const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix) || k.startsWith("ml2:"));
      let migrated = 0;
      for (const lsKey of keys) {
        try {
          const rawKey = lsKey.replace(/^ml2?:/, "");
          const val = JSON.parse(localStorage.getItem(lsKey));
          if (val !== null && val !== undefined) {
            await window.__firebase_db.ref(toPath(rawKey)).set(val);
            migrated++;
          }
        } catch {}
      }
      if (migrated > 0) {
        console.log("[Mission Log] Migrated", migrated, "records from localStorage to Firebase");
        localStorage.setItem("ml_migrated", "true");
      }
    },
    isFirebase: () => !!window.__firebase_db
  };
})();

// ─────────────────────────────────────────────────────────────────────────────
// KEYS
// ─────────────────────────────────────────────────────────────────────────────
const getToday = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Toronto" });
const getSundayKey = () => {
  const d = new Date(),
    s = new Date(d);
  s.setDate(d.getDate() - d.getDay());
  return s.toISOString().split("T")[0];
};
const KEYS = {
  log: date => `ml:log:${date}`,
  weekReview: sun => `ml:week:${sun}`,
  settings: () => `ml:settings`,
  setupDone: () => `ml:setup:done`,
  streak: () => `ml:streak`,
  goals: () => `ml:goals`,
  completedGoals: () => `ml:goals:completed`,
  milestones: () => `ml:milestones`,
  chores: () => `ml:chores`,
  pantry: () => `ml:food:pantry`,
  weekPlan: sun => `ml:food:weekplan:${sun}`,
  groceryCheck: sun => `ml:food:grocery:${sun}`,
  customMeals: () => `ml:food:custommeal`,
  cookedMeals: sun => `ml:food:cooked:${sun}`,
  trainHistory: () => `ml:train:history`,
  allSundays: () => `ml:allsundays`,
  winsArchive: () => `ml:wins:all`,
  sundayIndex: () => `ml:sunday:index`,
  reminders: () => `ml:reminders:personal`,
  jointReminders: () => `ml:reminders:joint`,
  mealLog: date => `ml:meallog:${date}`,
  macroTargets: () => `ml:macro:targets`,
  mealLibrary: () => `ml:meal:library`,
  sabinaPrompts: () => `ml:sabrina:mealPrompts`,
  financeEnvelopes: month => `ml:finance:envelopes:${month}`,
  financeDefaultEnvelopes: () => `ml:finance:envelopes:default`,
  financeEnvelopeCatalog: () => `ml:finance:envelopes:catalog`,
  financeTransactions: month => `ml:finance:txns:${month}`,
  financeAllMonths: () => `ml:finance:months`,
  financeRollover: month => `ml:finance:rollover:${month}`,
  financeIncome: month => `ml:finance:income:${month}`,
  merchantRules: () => `ml:finance:merchant_rules`,
  customSubCats: () => `ml:finance:custom_subcats`,
  receipt: id => `ml:receipts:${id}`,
  goalHabitLog: id => `ml:goals:habit:${id}`,
  goalProgressLog: id => `ml:goals:progress:${id}`,
  mobilityPool: () => `ml:mobility:pool`,
  mobilityWeek: monday => `ml:mobility:week:${monday}`,

  // ── User profile (up: prefix — stored at users/<uid>/xxx, no ml namespace) ──
  userHouseholdId: () => `up:householdId`,

  // ── Household shared paths (hh: prefix — stored at households/<hid>/ml/xxx) ──
  hhChores: () => `hh:chores`,
  hhPantry: () => `hh:food:pantry`,
  hhFinanceEnvelopes: month => `hh:finance:envelopes:${month}`,
  hhFinanceDefaultEnvelopes: () => `hh:finance:envelopes:default`,
  hhFinanceEnvelopeCatalog: () => `hh:finance:envelopes:catalog`,
  hhFinanceTransactions: month => `hh:finance:txns:${month}`,
  hhFinanceAllMonths: () => `hh:finance:months`,
  hhFinanceRollover: month => `hh:finance:rollover:${month}`,
  hhFinanceIncome: month => `hh:finance:income:${month}`,
  hhMerchantRules: () => `hh:finance:merchant_rules`,
  hhCustomSubCats: () => `hh:finance:custom_subcats`,
  hhFinanceCoach: () => `hh:finance:coach`,
  hhReceipt: id => `hh:receipts:${id}`
};

// ─────────────────────────────────────────────────────────────────────────────
// DATE UTILS
// ─────────────────────────────────────────────────────────────────────────────
const fmtLong = d => new Date(d + "T12:00:00").toLocaleDateString("en-CA", {
  weekday: "long",
  month: "long",
  day: "numeric"
});
const fmtMid = d => new Date(d + "T12:00:00").toLocaleDateString("en-CA", {
  weekday: "short",
  month: "short",
  day: "numeric"
});
const fmtShort = d => new Date(d + "T12:00:00").toLocaleDateString("en-CA", {
  weekday: "short"
});
const fmtDate = d => new Date(d + "T12:00:00").toLocaleDateString("en-CA", {
  month: "short",
  day: "numeric"
});
const fmtDateFull = d => new Date(d + "T12:00:00").toLocaleDateString("en-CA", {
  month: "short",
  day: "numeric",
  year: "numeric"
});
const addDays = (d, n) => {
  const r = new Date(d + "T12:00:00");
  r.setDate(r.getDate() + n);
  return r.toISOString().split("T")[0];
};
const daysBetween = (a, b) => Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 86400000);
const getPrevDay = () => addDays(getToday(), -1);

// ─────────────────────────────────────────────────────────────────────────────
// AUTO-SAVE HOOK — debounced, fires 1.5s after last change
// ─────────────────────────────────────────────────────────────────────────────
function useAutoSave(key, data, enabled = true) {
  const timer = useRef(null);
  useEffect(() => {
    if (!enabled || !key) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      // Always merge with existing so morning/evening don't overwrite each other
      const existing = (await DB.get(key)) || {};
      await DB.set(key, {
        ...existing,
        ...data
      });
    }, 1500);
    return () => clearTimeout(timer.current);
  }, [JSON.stringify(data), key, enabled]);
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
// ─── Theme system ──────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    "--bg":           "#080b11",
    "--bg-nav":       "#0a0f1a",
    "--card-bg":      "var(--card-bg)",
    "--card-bg-2":    "var(--card-bg-2)",
    "--card-bg-3":    "var(--card-bg-3)",
    "--card-bg-4":    "var(--card-bg-4)",
    "--card-border":  "var(--card-border)",
    "--card-border-2":"var(--card-border-2)",
    "--text-primary": "var(--text-primary)",
    "--text-secondary":"var(--text-secondary)",
    "--text-muted":   "var(--text-muted)"
  },
  light: {
    "--bg":           "#fef9fb",
    "--bg-nav":       "#fff0f6",
    "--card-bg":      "rgba(255,255,255,.88)",
    "--card-bg-2":    "rgba(255,255,255,.72)",
    "--card-bg-3":    "rgba(255,255,255,.78)",
    "--card-bg-4":    "rgba(255,255,255,.62)",
    "--card-border":  "rgba(210,150,190,.28)",
    "--card-border-2":"rgba(210,150,190,.38)",
    "--text-primary": "#2d1b4e",
    "--text-secondary":"#8b5a9b",
    "--text-muted":   "#b39abf"
  }
};
function applyTheme(name) {
  const vars = THEMES[name] || THEMES.dark;
  Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  document.body.style.background = vars["--bg"];
}

const DEFAULT_SETTINGS = {
  name: "Ryan",
  partnerName: "Sabrina",
  sonName: "",
  weightGoal: 180,
  weightStart: 210,
  weightDeadline: "2026-12-31",
  stepGoal: 10000,
  sleepGoal: 7.5,
  loanBalance: 113000,
  loanStart: 113000,
  loanDeadline: "2026-12-31",
  savingsTarget: 20000,
  savingsCurrent: 20000,
  uid: "ryan",
  partnerUid: "sabrina",
  claudeApiKey: "",
  householdId: "",
  theme: "dark"
};
const DEFAULT_GOALS = {
  weightGoal: 180,
  weightStart: 210,
  weightDeadline: "2026-12-31",
  stepGoal: 10000,
  sleepGoal: 7.5,
  loanBalance: 113000,
  loanTarget: 0,
  loanDeadline: "2026-12-31",
  savingsTarget: 20000,
  savingsCurrent: 20000
};


// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  B: "#f4a823",
  L: "#4ade80",
  D: "#60a5fa"
};
const CL = {
  B: "Breakfast",
  L: "Lunch",
  D: "Dinner"
};
const inp = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 8,
  color: "#e2e5ed",
  padding: "10px 13px",
  fontSize: 14,
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "inherit"
};
const Lbl = ({
  c
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    color: "#6b7280",
    fontSize: 10,
    letterSpacing: ".09em",
    textTransform: "uppercase",
    margin: "0 0 7px 0",
    fontWeight: 600
  }
}, c);
const Card = ({
  ch,
  s = {}
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12,
    padding: "15px 17px",
    ...s
  }
}, ch);
const SectionHead = ({
  label,
  color = "#f4a823"
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 4
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 3,
    height: 24,
    background: color,
    borderRadius: 2
  }
}), /*#__PURE__*/React.createElement("h2", {
  style: {
    color,
    fontFamily: "'Syne',sans-serif",
    fontSize: 18,
    margin: 0,
    fontWeight: 800
  }
}, label));
const Dots = ({
  val,
  set,
  max = 5,
  col = "#f4a823",
  sz = 26
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 7,
    alignItems: "center"
  }
}, Array.from({
  length: max
}).map((_, i) => /*#__PURE__*/React.createElement("button", {
  key: i,
  onClick: () => set(i + 1),
  style: {
    width: sz,
    height: sz,
    borderRadius: "50%",
    padding: 0,
    cursor: "pointer",
    background: i < val ? col : "rgba(255,255,255,0.06)",
    border: `2px solid ${i < val ? col : "rgba(255,255,255,0.11)"}`,
    transform: i < val ? "scale(1.07)" : "scale(1)",
    transition: "all .12s"
  }
})), /*#__PURE__*/React.createElement("span", {
  style: {
    color: "var(--text-secondary)",
    fontSize: 12,
    marginLeft: 3
  }
}, val, "/5"));
const YN = ({
  val,
  set
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    borderRadius: 8,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.09)",
    width: 130
  }
}, ["No", "Yes"].map((lbl, i) => {
  const on = val === (i === 1);
  return /*#__PURE__*/React.createElement("button", {
    key: lbl,
    onClick: () => set(i === 1),
    style: {
      flex: 1,
      padding: "9px 0",
      border: "none",
      cursor: "pointer",
      background: on ? i === 1 ? "rgba(74,222,128,.2)" : "rgba(239,68,68,.18)" : "transparent",
      color: on ? i === 1 ? "#4ade80" : "#ef4444" : "var(--text-secondary)",
      fontWeight: on ? 700 : 400,
      fontSize: 13,
      transition: "all .12s"
    }
  }, lbl);
}));
const ProgBar = ({
  pct,
  col = "#f4a823",
  h = 5
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    height: h,
    background: "var(--card-border)",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 4
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    height: "100%",
    width: `${Math.min(100, Math.max(0, pct))}%`,
    background: col,
    borderRadius: 3,
    transition: "width .6s"
  }
}));
const StatCell = ({
  lbl,
  val,
  sub,
  c = "#e2e5ed"
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    flex: "1 1 0",
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("p", {
  style: {
    color: "var(--text-secondary)",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: ".07em",
    margin: "0 0 2px"
  }
}, lbl), /*#__PURE__*/React.createElement("p", {
  style: {
    color: c,
    fontSize: 15,
    fontWeight: 800,
    margin: "0 0 1px",
    fontFamily: "'Syne',sans-serif",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
}, val), sub && /*#__PURE__*/React.createElement("p", {
  style: {
    color: "var(--text-muted)",
    fontSize: 9,
    margin: 0
  }
}, sub));

// Celebration overlay — fires for milestones
function CelebrationOverlay({
  msg,
  onDismiss
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,.85)",
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    },
    onClick: onDismiss
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      maxWidth: 300
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 60,
      marginBottom: 16
    }
  }, "\uD83C\uDF89"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontFamily: "'Syne',sans-serif",
      fontSize: 24,
      fontWeight: 800,
      margin: "0 0 12px",
      lineHeight: 1.2
    }
  }, msg), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 12,
      margin: 0
    }
  }, "Tap anywhere to continue")));
}

// Today at a glance strip
function TodayStrip({
  todayLog,
  streak,
  settings,
  overdueChores,
  pantryLowCount
}) {
  const m = todayLog?.morning || {};
  const e = todayLog?.evening || {};
  const morningDone = !!(m.weight || m.intention);
  const eveningDone = !!e.win;
  const mobDone = m.mobilityCount || 0;
  const workouts = [mobDone > 0, e.cardio, e.strength].filter(Boolean).length;
  const steps = m.steps || 0;
  const stepGoal = settings?.stepGoal || 10000;
  const stepPct = Math.min(100, Math.round(steps / stepGoal * 100));
  const isExceptional = e.exceptionalDay;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,.025)",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      padding: "10px 20px",
      display: "flex",
      gap: 14,
      alignItems: "center",
      overflowX: "auto"
    }
  }, streak > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontFamily: "'Syne',sans-serif",
      fontSize: 18,
      fontWeight: 800,
      margin: 0,
      lineHeight: 1
    }
  }, streak), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 9,
      margin: 0,
      letterSpacing: ".04em"
    }
  }, "DAY STREAK")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 32,
      background: "var(--card-bg-4)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 9,
      height: 9,
      borderRadius: "50%",
      background: morningDone ? "#f4a823" : "#1f2631"
    },
    title: "Morning"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 9,
      height: 9,
      borderRadius: "50%",
      background: eveningDone ? "#60a5fa" : "#1f2631"
    },
    title: "Evening"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: workouts === 3 ? "#4ade80" : workouts > 0 ? "#f4a823" : "#2d3340",
      fontFamily: "'Syne',sans-serif",
      fontSize: 18,
      fontWeight: 800,
      margin: 0,
      lineHeight: 1
    }
  }, workouts, "/3"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 9,
      margin: 0,
      letterSpacing: ".04em"
    }
  }, "SESSIONS")), steps > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      minWidth: 60
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: stepPct >= 100 ? "#4ade80" : "#9ca3af",
      fontSize: 11,
      fontWeight: 700,
      margin: "0 0 2px"
    }
  }, steps.toLocaleString()), /*#__PURE__*/React.createElement(ProgBar, {
    pct: stepPct,
    col: stepPct >= 100 ? "#4ade80" : "#60a5fa",
    h: 3
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 9,
      margin: "1px 0 0"
    }
  }, "STEPS")), mobDone > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: mobDone === 10 ? "#4ade80" : "#fb923c",
      fontFamily: "'Syne',sans-serif",
      fontSize: 18,
      fontWeight: 800,
      margin: 0,
      lineHeight: 1
    }
  }, mobDone, "/10"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 9,
      margin: 0,
      letterSpacing: ".04em"
    }
  }, "MOBILITY")), overdueChores > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(239,68,68,.1)",
      border: "1px solid rgba(239,68,68,.2)",
      borderRadius: 7,
      padding: "3px 8px",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#ef4444",
      fontSize: 10,
      fontWeight: 700,
      margin: 0
    }
  }, "\uD83C\uDFE0 ", overdueChores, " overdue")), pantryLowCount > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(244,168,35,.1)",
      border: "1px solid rgba(244,168,35,.2)",
      borderRadius: 7,
      padding: "3px 8px",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontSize: 10,
      fontWeight: 700,
      margin: 0
    }
  }, "\uD83E\uDD6B ", pantryLowCount, " low")), isExceptional && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(167,139,250,.1)",
      border: "1px solid rgba(167,139,250,.2)",
      borderRadius: 7,
      padding: "3px 8px",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#a78bfa",
      fontSize: 10,
      fontWeight: 700,
      margin: 0
    }
  }, "\u26A1 Exceptional day")));
}



// ─────────────────────────────────────────────────────────────────────────────
// MOBILITY EXERCISES — 50 pool, zone-balanced daily 10
// ─────────────────────────────────────────────────────────────────────────────
const ALL_EXERCISES = window.ALL_EXERCISES;
const ZONE_COLORS = window.ZONE_COLORS;

// Zone-balanced daily picker: always include spine, hips, full-body, then random fill
function pickDailyExercises(date, all, n = 10) {
  const seed = date.split("-").reduce((a, c) => a * 100 + parseInt(c), 0);
  const rand = (() => {
    let s = seed;
    return () => {
      s = s * 1664525 + 1013904223 & 0xffffffff;
      return (s >>> 0) / 0xffffffff;
    };
  })();
  const zones = {};
  all.forEach(e => {
    if (!zones[e.zone]) zones[e.zone] = [];
    zones[e.zone].push(e);
  });
  const mandatoryZones = ["spine", "hips", "full"];
  const picked = [];
  const usedIds = new Set();
  mandatoryZones.forEach(z => {
    if (zones[z] && picked.length < n) {
      const pool = zones[z].filter(e => !usedIds.has(e.id));
      const idx = Math.floor(rand() * pool.length);
      if (pool[idx]) {
        picked.push(pool[idx]);
        usedIds.add(pool[idx].id);
      }
    }
  });
  const remaining = all.filter(e => !usedIds.has(e.id));
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }
  for (const e of remaining) {
    if (picked.length >= n) break;
    picked.push(e);
  }
  return picked;
}
// Returns the Monday date string (YYYY-MM-DD) for the week containing dateStr
function getMondayOfWeek(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

// Returns "mon"/"tue"/"wed"/"thu"/"fri"/"sat"/"sun" for a date string
function getDayKey(dateStr) {
  return ["sun","mon","tue","wed","thu","fri","sat"][new Date(dateStr + "T12:00:00").getDay()];
}

// Generates a weekly plan: {mon:[id,...10], tue:[...], ...}
// Uses a seeded shuffle so same Monday always produces the same plan
// Different step offset per day guarantees no two days share the same set
function generateWeeklyPlan(pool, mondayDate) {
  if (!pool || pool.length < 1) return {};
  const seedStr = mondayDate.replace(/-/g, "");
  let s = seedStr.split("").reduce((a, c) => ((a * 31) + c.charCodeAt(0)) >>> 0, 7);
  const rand = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0x100000000; };
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const days = ["mon","tue","wed","thu","fri","sat","sun"];
  const n = shuffled.length;
  const step = Math.max(1, Math.floor(n / 7));
  const plan = {};
  days.forEach((day, dayIdx) => {
    const start = (dayIdx * step) % n;
    const picked = [], used = new Set();
    let pos = start, attempts = 0;
    while (picked.length < Math.min(10, n) && attempts < n * 2) {
      const ex = shuffled[pos % n];
      if (!used.has(ex.id)) { picked.push(ex.id); used.add(ex.id); }
      pos++; attempts++;
    }
    plan[day] = picked;
  });
  return plan;
}

function MobilityChecklist({
  checked,
  setChecked,
  dailyList,
  onManagePool
}) {
  const [tipOpen, setTipOpen] = useState(null);
  const [swRunning, setSwRunning] = useState(false);
  const [swElapsed, setSwElapsed] = useState(0);
  const swRef = useRef(null);

  const swStart = () => {
    if (swRunning) return;
    setSwRunning(true);
    swRef.current = setInterval(() => setSwElapsed(s => s + 1), 1000);
  };
  const swPause = () => {
    setSwRunning(false);
    clearInterval(swRef.current);
  };
  const swReset = () => {
    setSwRunning(false);
    clearInterval(swRef.current);
    setSwElapsed(0);
  };
  useEffect(() => () => clearInterval(swRef.current), []);

  const swMins = String(Math.floor(swElapsed / 60)).padStart(2, "0");
  const swSecs = String(swElapsed % 60).padStart(2, "0");

  const done = dailyList.filter(e => checked[e.id]).length;
  return /*#__PURE__*/React.createElement("div", null,

    // ── Stopwatch ──────────────────────────────────────────────────────
    /*#__PURE__*/React.createElement("div", { style: { background: "rgba(244,168,35,.07)", border: "1px solid rgba(244,168,35,.18)", borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" } },
      /*#__PURE__*/React.createElement("div", null,
        /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".06em", margin: "0 0 2px" } }, "HOLD TIMER"),
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 28, color: swRunning ? "#f4a823" : swElapsed > 0 ? "#d1d5db" : "var(--text-muted)", margin: 0, letterSpacing: ".04em", lineHeight: 1 } }, swMins + ":" + swSecs)
      ),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } },
        swRunning
          ? /*#__PURE__*/React.createElement("button", { onClick: swPause, style: { padding: "9px 18px", background: "rgba(244,168,35,.18)", border: "1px solid rgba(244,168,35,.4)", borderRadius: 9, color: "#f4a823", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "\u23F8 Pause")
          : /*#__PURE__*/React.createElement("button", { onClick: swStart, style: { padding: "9px 18px", background: "#f4a823", border: "none", borderRadius: 9, color: "#080b11", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, swElapsed > 0 ? "\u25B6 Resume" : "\u25B6 Start"),
        swElapsed > 0 && /*#__PURE__*/React.createElement("button", { onClick: swReset, style: { padding: "9px 14px", background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 9, color: "var(--text-muted)", fontSize: 12, cursor: "pointer" } }, "\u21BA")
      )
    ),

    /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "Morning Mobility"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      padding: "2px 9px",
      borderRadius: 6,
      color: done === 10 ? "#4ade80" : done >= 5 ? "#f4a823" : "var(--text-secondary)",
      background: done === 10 ? "rgba(74,222,128,.12)" : done >= 5 ? "rgba(244,168,35,.1)" : "var(--card-bg-3)"
    }
  }, done === 10 ? "DONE ✓" : `${done}/10`)), /*#__PURE__*/React.createElement("div", {
    style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }
  },
    /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: 0 } }, "Weekly plan \xB7 No two days the same"),
    onManagePool && /*#__PURE__*/React.createElement("button", { onClick: onManagePool, style: { background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 6, padding: "3px 9px", color: "var(--text-muted)", fontSize: 10, cursor: "pointer" } }, "\u2699\uFE0F Pool")
  ), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 3
    }
  }, dailyList.map(ex => {
    const ck = !!checked[ex.id],
      tip = tipOpen === ex.id;
    const zc = ZONE_COLORS[ex.zone] || "#555";
    return /*#__PURE__*/React.createElement("div", {
      key: ex.id,
      style: {
        borderRadius: 8,
        background: ck ? "rgba(74,222,128,.05)" : "rgba(255,255,255,.025)",
        border: `1px solid ${ck ? "rgba(74,222,128,.15)" : "var(--card-bg-2)"}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "9px 10px"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setChecked(p => ({
        ...p,
        [ex.id]: !p[ex.id]
      })),
      style: {
        width: 21,
        height: 21,
        borderRadius: 5,
        border: `2px solid ${ck ? "#4ade80" : "rgba(255,255,255,.18)"}`,
        background: ck ? "#4ade80" : "transparent",
        cursor: "pointer",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        color: "#080b11",
        fontSize: 11,
        fontWeight: 800
      }
    }, ck ? "✓" : ""), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: ck ? "#6b7280" : "var(--text-primary)",
        textDecoration: ck ? "line-through" : "none",
        fontWeight: 500
      }
    }, ex.name), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-block",
        background: `${zc}18`,
        color: zc,
        fontSize: 9,
        fontWeight: 700,
        borderRadius: 4,
        padding: "1px 5px",
        marginLeft: 7,
        letterSpacing: ".04em",
        textTransform: "uppercase",
        verticalAlign: "middle"
      }
    }, ex.zone)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)",
        fontSize: 10,
        flexShrink: 0,
        marginRight: 5
      }
    }, ex.reps), /*#__PURE__*/React.createElement("button", {
      onClick: () => setTipOpen(tip ? null : ex.id),
      style: {
        background: tip ? "rgba(96,165,250,.18)" : "transparent",
        border: `1px solid ${tip ? "rgba(96,165,250,.3)" : "var(--card-border)"}`,
        color: tip ? "#60a5fa" : "var(--text-muted)",
        borderRadius: 6,
        padding: "3px 8px",
        fontSize: 10,
        cursor: "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0
      }
    }, "how")), tip && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 10px 10px 40px"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#93c5fd",
        fontSize: 12,
        margin: 0,
        lineHeight: 1.6,
        background: "rgba(96,165,250,.07)",
        borderRadius: 7,
        padding: "8px 10px"
      }
    }, ex.tip)));
  })));
}

// ─────────────────────────────────────────────────────────────────────────────
// Personal tabs (Morning, Evening, Goals, Sunday) — extracted to modules/personal-tab.js

// PantryTab — extracted to modules/pantry-tab.js
const MEALS_DB = window.MEALS_DB;

// ─────────────────────────────────────────────────────────────────────────────
// GUELPH STORES + CARD STRATEGY
//
// Cards on file:
//   Cobalt Amex       — 5x MR pts at eligible grocery stores (Amex MCC)
//   TD Visa Infinite  — 1.5x Aeroplan at grocery stores + eligible merchants
//   Costco Mastercard — Required at Costco + 2% cash back there
//
// Optimal routing:
//   Costco   → Costco Mastercard (only card accepted + 2% back)
//   Metro / Farm Boy / Longos → Cobalt Amex (5x grocery MR = ~5% value)
//   Walmart  → TD Visa Infinite Aeroplan (Amex not accepted; 1.5x Aeroplan)
// ─────────────────────────────────────────────────────────────────────────────
const STORES = window.STORES;

// ── Ingredient → best store routing ─────────────────────────────────────────
function storeRanking(ing) {
  const s = ing.toLowerCase();
  if (/salmon|shrimp|cod|tilapia|fresh fish/.test(s)) return ["farmboy", "metro", "costco"];
  if (/chicken breast|ground beef|ground turkey|turkey breast|steak|pork/.test(s)) return ["costco", "metro", "farmboy"];
  if (/egg/.test(s)) return ["costco", "walmart", "metro"];
  if (/spinach|kale|arugula|broccoli|bell pepper|tomato|cucumber|zucchini|lettuce|avocado|asparagus|cabbage|carrot/.test(s)) return ["metro", "farmboy", "walmart"];
  if (/onion|garlic|ginger/.test(s)) return ["walmart", "metro"];
  if (/yogurt|cottage cheese|feta|parmesan|mozzarella|cheese|butter|milk/.test(s)) return ["walmart", "costco", "metro"];
  if (/cream cheese/.test(s)) return ["walmart", "metro"];
  if (/can |canned|diced tomato|black bean|kidney bean|chickpea|coconut milk|broth|lentil/.test(s)) return ["walmart", "metro"];
  if (/rice|pasta|quinoa|oat|noodle|bread|wrap|tortilla|pita|breadcrumb/.test(s)) return ["walmart", "costco"];
  if (/olive oil|avocado oil|sesame oil|coconut oil/.test(s)) return ["costco", "walmart"];
  if (/almond|walnut|cashew|pecan|peanut|nut butter/.test(s)) return ["costco", "walmart"];
  if (/frozen/.test(s)) return ["costco", "walmart"];
  if (/soy sauce|hoisin|oyster sauce|tahini|hummus|mustard|ketchup|vinegar|mayo|hot sauce|sriracha/.test(s)) return ["walmart", "metro"];
  if (/salt|pepper|cumin|paprika|turmeric|cinnamon|garlic powder|seasoning|spice|herb|dill|cilantro|parsley/.test(s)) return ["walmart", "costco"];
  if (/honey|maple syrup/.test(s)) return ["costco", "walmart"];
  if (/protein powder/.test(s)) return ["costco", "walmart"];
  return ["walmart", "metro"];
}
function estimatePrice(ing, storeId) {
  const s = ing.toLowerCase();
  const store = STORES[storeId];
  let base = 1.00;
  if (/salmon|fresh fish/.test(s)) base = 5.50;else if (/shrimp/.test(s)) base = 4.50;else if (/chicken breast|ground beef|ground turkey|steak|pork/.test(s)) base = 4.20;else if (/avocado/.test(s)) base = 1.80;else if (/cod|tilapia/.test(s)) base = 3.50;else if (/yogurt|cottage cheese/.test(s)) base = 2.20;else if (/feta|parmesan|mozzarella/.test(s)) base = 2.80;else if (/spinach|kale|arugula|broccoli|bell pepper|tomato|cucumber|zucchini|lettuce|asparagus|cabbage/.test(s)) base = 1.60;else if (/onion|carrot|ginger/.test(s)) base = 0.60;else if (/egg/.test(s)) base = 0.50;else if (/milk|butter/.test(s)) base = 1.20;else if (/can |canned|diced tomato|black bean|kidney bean|chickpea|broth/.test(s)) base = 1.90;else if (/coconut milk/.test(s)) base = 2.50;else if (/olive oil|avocado oil/.test(s)) base = 1.20;else if (/almond|walnut|cashew|nut butter/.test(s)) base = 1.50;else if (/rice|pasta|quinoa|oat|noodle/.test(s)) base = 0.90;else if (/bread|wrap|tortilla|pita/.test(s)) base = 1.10;else if (/frozen veg|frozen/.test(s)) base = 1.00;else if (/sauce|soy sauce|hoisin|condiment/.test(s)) base = 0.70;else if (/seasoning|spice|herb/.test(s)) base = 0.50;
  const mult = [0.72, 0.82, 1.00, 1.14][store.priceRank - 1] ?? 1.00;
  return parseFloat((base * mult).toFixed(2));
}

async function callClaude(messages, system, maxTokens) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens || 2000,
      system: system || "You are a recipe extraction assistant. Return ONLY valid JSON.",
      messages
    })
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  const text = data.content?.[0]?.text || "";
  // Strip any accidental markdown fences
  const clean = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(clean);
}

// FoodTab — extracted to modules/food-tab.js

// ─────────────────────────────────────────────────────────────────────────────
// HOME TAB — chore tracker with ownership
// ─────────────────────────────────────────────────────────────────────────────
const CHORE_SEED = window.CHORE_SEED;
// TasksTab (Home chores) — extracted to modules/home-tab.js


// ─────────────────────────────────────────────────────────────────────────────
// APP SHELL
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS MODAL — API key + household setup
// ─────────────────────────────────────────────────────────────────────────────
function SettingsModal({ settings, onSave, onClose, householdId, householdMeta }) {
  const [apiKey, setApiKey] = useState(settings.claudeApiKey || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [theme, setTheme] = useState(settings.theme || "dark");

  const save = async () => {
    setSaving(true);
    const updated = { ...settings, claudeApiKey: apiKey.trim(), theme };
    await DB.set(KEYS.settings(), updated);
    onSave(updated);
    setMsg("Saved.");
    setSaving(false);
    setTimeout(() => { setMsg(""); onClose(); }, 800);
  };

  const card = { background: "var(--card-bg)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, padding: "16px 18px", marginBottom: 14 };
  const label = { color: "var(--text-secondary)", fontSize: 10, fontFamily: "'Syne',sans-serif", letterSpacing: ".07em", marginBottom: 6, display: "block" };
  const inp = { width: "100%", background: "var(--card-bg-2)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "var(--text-primary)", fontSize: 13, padding: "9px 12px", boxSizing: "border-box", outline: "none", fontFamily: "'DM Sans',sans-serif" };

  return React.createElement("div", {
    style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" },
    onClick: e => { if (e.target === e.currentTarget) onClose(); }
  },
    React.createElement("div", {
      style: { background: "#0f1520", borderRadius: "18px 18px 0 0", width: "100%", maxWidth: 490, padding: "24px 20px 36px", maxHeight: "92vh", overflowY: "auto" }
    },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 } },
        React.createElement("p", { style: { color: "#e2e5ed", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, margin: 0, letterSpacing: ".05em" } }, "SETTINGS"),
        React.createElement("button", { onClick: onClose, style: { background: "none", border: "none", color: "var(--text-secondary)", fontSize: 20, cursor: "pointer", padding: 0 } }, "✕")
      ),

      // ── Claude API Key ──
      React.createElement("div", { style: card },
        React.createElement("p", { style: { ...label, color: "#a78bfa" } }, "CLAUDE API KEY"),
        React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 11, margin: "0 0 10px", lineHeight: 1.5 } },
          "Required for AI features: Sunday brief, pantry voice-add, recipe search, pattern insights."
        ),
        React.createElement("input", {
          type: "password",
          value: apiKey,
          onChange: e => setApiKey(e.target.value),
          placeholder: "sk-ant-...",
          style: inp,
          autoComplete: "off"
        }),
        apiKey && React.createElement("p", { style: { color: "#4ade80", fontSize: 10, margin: "6px 0 0" } }, "Key entered — AI features will be active after saving.")
      ),

      // ── Theme ──
      React.createElement("div", { style: card },
        React.createElement("p", { style: { ...label, color: "#f472b6" } }, "COLOUR THEME"),
        React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 11, margin: "0 0 12px", lineHeight: 1.5 } },
          "Dark is the default. Light is Sabrina\u2019s bright Pinterest-style theme."
        ),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } },
          ["dark", "light"].map(t =>
            React.createElement("button", {
              key: t,
              onClick: () => { setTheme(t); applyTheme(t); },
              style: {
                padding: "14px 10px",
                background: theme === t
                  ? (t === "dark" ? "rgba(167,139,250,.15)" : "rgba(244,114,182,.15)")
                  : "var(--card-bg-2)",
                border: "1px solid " + (theme === t
                  ? (t === "dark" ? "rgba(167,139,250,.4)" : "rgba(244,114,182,.4)")
                  : "var(--card-border)"),
                borderRadius: 10,
                cursor: "pointer",
                textAlign: "center"
              }
            },
              React.createElement("div", { style: { fontSize: 22, marginBottom: 5 } }, t === "dark" ? "\uD83C\uDF19" : "\u2600\uFE0F"),
              React.createElement("p", {
                style: {
                  color: theme === t ? (t === "dark" ? "#a78bfa" : "#f472b6") : "var(--text-secondary)",
                  fontSize: 11,
                  fontWeight: 700,
                  margin: 0,
                  fontFamily: "'Syne',sans-serif",
                  textTransform: "uppercase"
                }
              }, t === "dark" ? "Dark" : "Light"),
              React.createElement("p", {
                style: { color: "var(--text-muted)", fontSize: 9, margin: "3px 0 0" }
              }, t === "dark" ? "Ryan's default" : "Sabrina's pick")
            )
          )
        )
      ),

      // ── Household ──
      React.createElement("div", { style: card },
        React.createElement("p", { style: { ...label, color: "#60a5fa" } }, "HOUSEHOLD"),

        householdId && householdMeta
          ? React.createElement("div", null,
              // Active household info
              React.createElement("div", { style: { background: "rgba(96,165,250,.08)", border: "1px solid rgba(96,165,250,.2)", borderRadius: 8, padding: "12px 14px", marginBottom: 12 } },
                React.createElement("p", { style: { color: "#60a5fa", fontSize: 11, margin: "0 0 2px", fontWeight: 700, letterSpacing: ".05em" } }, "ACTIVE HOUSEHOLD"),
                React.createElement("p", { style: { color: "var(--text-primary)", fontSize: 17, fontWeight: 800, margin: "2px 0 6px", fontFamily: "'Syne',sans-serif" } }, householdMeta.name || householdId),
                householdMeta.inviteCode && React.createElement("div", null,
                  React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: "0 0 4px", letterSpacing: ".04em" } }, "INVITE CODE — share with your household"),
                  React.createElement("p", { style: { color: "#4ade80", fontSize: 22, fontWeight: 800, margin: 0, fontFamily: "'Syne',sans-serif", letterSpacing: ".2em" } }, householdMeta.inviteCode)
                )
              ),
              // Member list
              householdMeta.members && React.createElement("div", { style: { marginBottom: 12 } },
                React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 8px" } }, "MEMBERS"),
                Object.entries(householdMeta.members).map(([uid, m]) =>
                  React.createElement("div", { key: uid, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,.04)" } },
                    React.createElement("span", { style: { color: "var(--text-primary)", fontSize: 12 } }, m.name || "Member"),
                    React.createElement("span", { style: { color: m.role === "leader" ? "#f4a823" : "var(--text-muted)", fontSize: 10, fontWeight: 700 } }, m.role === "leader" ? "LEADER" : "MEMBER")
                  )
                )
              ),
              // Leave button (only for non-leaders)
              householdMeta.leaderId !== window.__current_uid && React.createElement("button", {
                onClick: async () => {
                  if (!window.confirm("Leave household? Your personal data is unaffected.")) return;
                  await window.__firebase_db.ref(`users/${window.__current_uid}/householdId`).remove();
                  window.__current_household_id = null;
                  onClose();
                  window.location.reload();
                },
                style: { background: "none", border: "1px solid rgba(239,68,68,.3)", borderRadius: 7, color: "#ef4444", fontSize: 11, padding: "6px 14px", cursor: "pointer" }
              }, "Leave Household")
            )
          : React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 12, lineHeight: 1.5, margin: 0 } },
              "No household set up. Go to the HOME tab and tap \u201CSet Up Household\u201D to create or join one."
            )
      ),

      // ── Save ──
      React.createElement("button", {
        onClick: save,
        disabled: saving,
        style: { width: "100%", background: "#f4a823", border: "none", borderRadius: 10, color: "#080b11", fontSize: 13, fontWeight: 800, padding: "14px", cursor: "pointer", fontFamily: "'Syne',sans-serif", letterSpacing: ".05em" }
      }, saving ? "SAVING..." : "SAVE SETTINGS"),
      msg && React.createElement("p", { style: { color: "#4ade80", textAlign: "center", fontSize: 12, margin: "10px 0 0" } }, msg)
    )
  );
}

// FinanceTab — extracted to modules/finance-tab.js

// RemindersTab — extracted to modules/home-tab.js

// ─────────────────────────────────────────────────────────────────────────────
// HOUSEHOLD JOIN PROMPT — shown in HOME tab when user has no household
// ─────────────────────────────────────────────────────────────────────────────
function HouseholdJoinPrompt({ onSetup }) {
  return React.createElement("div", { style: { padding: "40px 24px", textAlign: "center" } },
    React.createElement("div", { style: { fontSize: 48, marginBottom: 16 } }, "\uD83C\uDFE0"),
    React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "#60a5fa", margin: "0 0 8px" } }, "Join a Household"),
    React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 13, margin: "0 0 24px", lineHeight: 1.6 } }, "Tasks, pantry, and reminders are shared with your household. Set up or join one to get started."),
    React.createElement("button", { onClick: onSetup, style: { padding: "14px 28px", background: "#60a5fa", border: "none", borderRadius: 10, color: "#080b11", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "Set Up Household \u2192")
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOUSEHOLD SETUP — create or join a household (full-screen flow)
// ─────────────────────────────────────────────────────────────────────────────
function HouseholdSetup({ currentUser, allPersonalData, onComplete }) {
  const [view, setView] = useState("choose"); // choose | create | join
  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [migrating, setMigrating] = useState(false);
  const [migrateMsg, setMigrateMsg] = useState("");

  const generateCode = () => Math.random().toString(36).substr(2, 6).toUpperCase();

  const createHousehold = async () => {
    if (!householdName.trim()) { setError("Enter a household name"); return; }
    setMigrating(true);
    setMigrateMsg("Creating household...");
    try {
      const hid = "hh_" + Date.now();
      const code = generateCode();
      const uid = window.__current_uid;
      const db = window.__firebase_db;

      // 1. Write household meta directly (DB layer hh: not usable until hid is set)
      const meta = {
        name: householdName.trim(),
        leaderId: uid,
        inviteCode: code,
        shareFinance: true,
        createdAt: new Date().toISOString(),
        members: {
          [uid]: {
            name: (currentUser && currentUser.displayName) || "Leader",
            email: (currentUser && currentUser.email) || "",
            role: "leader",
            joinedAt: new Date().toISOString()
          }
        }
      };
      await db.ref(`households/${hid}/meta`).set(meta);

      // 2. Write invite code lookup index
      await db.ref(`householdCodes/${code}`).set(hid);

      // 3. Set householdId on current user profile (direct write — up: not ready yet)
      await db.ref(`users/${uid}/householdId`).set(hid);

      // 4. Activate hh: routing
      window.__current_household_id = hid;

      // 5. Migrate existing personal data to household paths
      setMigrateMsg("Migrating your data...");

      if (allPersonalData && allPersonalData.chores && allPersonalData.chores.length > 0) {
        await DB.set(KEYS.hhChores(), allPersonalData.chores);
      }
      if (allPersonalData && allPersonalData.pantryItems && allPersonalData.pantryItems.length > 0) {
        setMigrateMsg("Migrating pantry...");
        await DB.set(KEYS.hhPantry(), allPersonalData.pantryItems);
      }
      if (allPersonalData && allPersonalData.financeMonths && allPersonalData.financeMonths.length > 0) {
        setMigrateMsg("Migrating " + allPersonalData.financeMonths.length + " months of finance data...");
        const monthList = allPersonalData.financeMonths.map(m => m.month);
        await DB.set(KEYS.hhFinanceAllMonths(), monthList);
        for (const m of allPersonalData.financeMonths) {
          if (m.txns && m.txns.length)     await DB.set(KEYS.hhFinanceTransactions(m.month), m.txns);
          if (m.income && m.income.length)  await DB.set(KEYS.hhFinanceIncome(m.month), m.income);
          if (m.envelopes && m.envelopes.length) await DB.set(KEYS.hhFinanceEnvelopes(m.month), m.envelopes);
          if (m.rollover)                   await DB.set(KEYS.hhFinanceRollover(m.month), m.rollover);
        }
        if (allPersonalData.merchantRules)    await DB.set(KEYS.hhMerchantRules(), allPersonalData.merchantRules);
        if (allPersonalData.customSubCats)    await DB.set(KEYS.hhCustomSubCats(), allPersonalData.customSubCats);
        if (allPersonalData.envelopeCatalog)  await DB.set(KEYS.hhFinanceEnvelopeCatalog(), allPersonalData.envelopeCatalog);
        if (allPersonalData.defaultEnvelopes) await DB.set(KEYS.hhFinanceDefaultEnvelopes(), allPersonalData.defaultEnvelopes);
      }

      setMigrateMsg("Done!");
      onComplete(hid, meta);
    } catch (e) {
      setError("Error creating household: " + e.message);
      setMigrating(false);
    }
  };

  const joinHousehold = async () => {
    const code = inviteCode.trim().toUpperCase();
    if (code.length !== 6) { setError("Enter the 6-character invite code"); return; }
    setError("");
    try {
      const db = window.__firebase_db;
      const uid = window.__current_uid;

      // Look up invite code
      const snap = await db.ref(`householdCodes/${code}`).once("value");
      if (!snap.exists()) { setError("Invalid invite code — check with your household leader"); return; }
      const hid = snap.val();

      // Load meta, check member limit
      const metaSnap = await db.ref(`households/${hid}/meta`).once("value");
      if (!metaSnap.exists()) { setError("Household not found"); return; }
      const meta = metaSnap.val();
      const memberCount = Object.keys(meta.members || {}).length;
      if (memberCount >= 6) { setError("This household is full (max 6 members)"); return; }

      // Add this user as a member
      const auth = window.__firebase_auth;
      await db.ref(`households/${hid}/meta/members/${uid}`).set({
        name: (auth && auth.currentUser && auth.currentUser.displayName) || "Member",
        email: (auth && auth.currentUser && auth.currentUser.email) || "",
        role: "member",
        joinedAt: new Date().toISOString()
      });

      // Set householdId on user profile
      await db.ref(`users/${uid}/householdId`).set(hid);
      window.__current_household_id = hid;

      onComplete(hid, { ...meta, members: { ...(meta.members || {}), [uid]: { role: "member" } } });
    } catch (e) {
      setError("Error joining household: " + e.message);
    }
  };

  // ── Migrating spinner ──
  if (migrating) return React.createElement("div", {
    style: { minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 24 }
  },
    React.createElement("div", { style: { width: 40, height: 40, border: "3px solid rgba(96,165,250,.2)", borderTopColor: "#60a5fa", borderRadius: "50%", animation: "spin 1s linear infinite" } }),
    React.createElement("p", { style: { color: "#60a5fa", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13 } }, migrateMsg),
    error && React.createElement("p", { style: { color: "#ef4444", fontSize: 12 } }, error)
  );

  const cardStyle = { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: 20 };

  // ── Choose view ──
  if (view === "choose") return React.createElement("div", {
    style: { minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }
  },
    React.createElement("div", { style: { width: "100%", maxWidth: 420 } },
      React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: "#60a5fa", margin: "0 0 6px" } }, "\uD83C\uDFE0 Set Up Your Household"),
      React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 13, margin: "0 0 28px", lineHeight: 1.5 } },
        "Create a household to share tasks, pantry, and finances with your family. Or join an existing one with an invite code."
      ),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
        React.createElement("button", {
          onClick: () => setView("create"),
          style: { padding: "16px 20px", background: "rgba(96,165,250,.12)", border: "1px solid rgba(96,165,250,.3)", borderRadius: 12, color: "#60a5fa", fontSize: 14, fontWeight: 800, cursor: "pointer", textAlign: "left", fontFamily: "'Syne',sans-serif" }
        },
          React.createElement("div", null, "\uD83C\uDFD7 Create a Household"),
          React.createElement("div", { style: { fontSize: 11, fontWeight: 400, color: "var(--text-muted)", marginTop: 4 } }, "Start a new household and invite your family")
        ),
        React.createElement("button", {
          onClick: () => setView("join"),
          style: { padding: "16px 20px", background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 12, color: "#4ade80", fontSize: 14, fontWeight: 800, cursor: "pointer", textAlign: "left", fontFamily: "'Syne',sans-serif" }
        },
          React.createElement("div", null, "\uD83D\uDD11 Join with Invite Code"),
          React.createElement("div", { style: { fontSize: 11, fontWeight: 400, color: "var(--text-muted)", marginTop: 4 } }, "Enter the 6-character code from your household leader")
        )
      )
    )
  );

  // ── Create view ──
  if (view === "create") return React.createElement("div", {
    style: { minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }
  },
    React.createElement("div", { style: { width: "100%", maxWidth: 420 } },
      React.createElement("button", { onClick: () => setView("choose"), style: { background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 13, cursor: "pointer", marginBottom: 20, padding: 0 } }, "\u2190 Back"),
      React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: "#60a5fa", margin: "0 0 6px" } }, "\uD83C\uDFD7 Create Household"),
      React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 12, margin: "0 0 20px", lineHeight: 1.5 } },
        "Your existing tasks, pantry, and finance data will be migrated to the new household. Nothing will be lost."
      ),
      React.createElement("div", { style: { ...cardStyle, marginBottom: 16 } },
        React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 8px" } }, "HOUSEHOLD NAME"),
        React.createElement("input", {
          placeholder: "e.g. The Persaud House",
          value: householdName,
          onChange: e => { setHouseholdName(e.target.value); setError(""); },
          style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "10px 12px", color: "var(--text-primary)", fontSize: 14, outline: "none", boxSizing: "border-box" }
        })
      ),
      error && React.createElement("p", { style: { color: "#ef4444", fontSize: 12, marginBottom: 12 } }, error),
      React.createElement("button", {
        onClick: createHousehold,
        disabled: !householdName.trim(),
        style: { width: "100%", padding: "14px 0", background: householdName.trim() ? "#60a5fa" : "rgba(96,165,250,.2)", border: "none", borderRadius: 10, color: householdName.trim() ? "#080b11" : "var(--text-muted)", fontSize: 14, fontWeight: 800, cursor: householdName.trim() ? "pointer" : "not-allowed", fontFamily: "'Syne',sans-serif" }
      }, "CREATE & MIGRATE DATA \u2192")
    )
  );

  // ── Join view ──
  if (view === "join") return React.createElement("div", {
    style: { minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }
  },
    React.createElement("div", { style: { width: "100%", maxWidth: 420 } },
      React.createElement("button", { onClick: () => setView("choose"), style: { background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 13, cursor: "pointer", marginBottom: 20, padding: 0 } }, "\u2190 Back"),
      React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: "#4ade80", margin: "0 0 6px" } }, "\uD83D\uDD11 Join a Household"),
      React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 12, margin: "0 0 20px" } }, "Ask your household leader for the 6-character invite code."),
      React.createElement("div", { style: { ...cardStyle, marginBottom: 16 } },
        React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 8px" } }, "INVITE CODE"),
        React.createElement("input", {
          placeholder: "e.g. X7K2M9",
          value: inviteCode,
          onChange: e => { setInviteCode(e.target.value.toUpperCase()); setError(""); },
          maxLength: 6,
          style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "10px 12px", color: "var(--text-primary)", fontSize: 18, fontWeight: 800, outline: "none", letterSpacing: ".15em", boxSizing: "border-box", textTransform: "uppercase", fontFamily: "'Syne',sans-serif" }
        })
      ),
      error && React.createElement("p", { style: { color: "#ef4444", fontSize: 12, marginBottom: 12 } }, error),
      React.createElement("button", {
        onClick: joinHousehold,
        disabled: inviteCode.trim().length !== 6,
        style: { width: "100%", padding: "14px 0", background: inviteCode.trim().length === 6 ? "#4ade80" : "rgba(74,222,128,.2)", border: "none", borderRadius: 10, color: inviteCode.trim().length === 6 ? "#080b11" : "var(--text-muted)", fontSize: 14, fontWeight: 800, cursor: inviteCode.trim().length === 6 ? "pointer" : "not-allowed", fontFamily: "'Syne',sans-serif" }
      }, "JOIN HOUSEHOLD \u2192")
    )
  );

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED MODULE BRIDGE
// Exposes core utilities so feature modules (finance-tab.js, etc.) can
// access them without being embedded in the monolith.
// ─────────────────────────────────────────────────────────────────────────────
window.__ml = {
  DB, KEYS,
  getToday, fmtDate, fmtMid, fmtLong, addDays, daysBetween, getSundayKey,
  callClaude,
  useAutoSave, getMondayOfWeek, getDayKey, ALL_EXERCISES,
  C, CL, inp, Lbl, SectionHead,
  // Household helpers — modules use these to check household state
  getHouseholdId: () => window.__current_household_id || null,
};

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
function App() {
  const userCtx = useUser();
  // Keep window.__current_uid in sync so DB layer can namespace queries
  React.useEffect(() => {
    window.__current_uid = userCtx?.uid || null;
  }, [userCtx?.uid]);
  const [setupDone, setSetupDone] = useState(null); // null=loading
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [goals, setGoals] = useState([]);
  const [tab, setTab] = useState(() => {
    // Restore last tab if session ended < 1 hour ago
    try {
      const saved = JSON.parse(localStorage.getItem("ml_last_tab") || "null");
      if (saved && saved.tab && (Date.now() - saved.ts) < 3600000) return saved.tab;
    } catch {}
    // > 1 hour or no saved tab — pick by time of day
    const h = new Date().getHours(), dow = new Date().getDay();
    if (dow === 0) return "sunday";
    if (h >= 18) return "evening";
    if (h >= 5 && h < 12) return "morning";
    return "train";
  });
  const [editLogDate, setEditLogDate] = useState(null); // {date, section} when navigating to edit a past log
  const [todayLog, setTodayLog] = useState(null);
  const [allLogs, setAllLogs] = useState([]);
  const [allSundays, setAllSundays] = useState([]);
  const [streak, setStreak] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [jointReminders, setJointReminders] = useState([]);
  const [todayMealLog, setTodayMealLog] = useState({});
  const [macroTargets, setMacroTargets] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [activeUser, setActiveUser] = useState("self"); // self | partner
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [householdId, setHouseholdId] = useState(null);
  const [householdMeta, setHouseholdMeta] = useState(null);
  const [showHouseholdSetup, setShowHouseholdSetup] = useState(false);
  const [personalDataForMigration, setPersonalDataForMigration] = useState(null);

  // API calls go through the Netlify proxy (/api/claude) — key is server-side.
  // Always set truthy so all components skip their "no API key" guard checks.
  React.useEffect(() => {
    window.__claude_api_key = "proxy";
    window.__household_id = settings.householdId || "";
  }, [settings.householdId]);

  // Apply colour theme whenever it changes
  React.useEffect(() => { applyTheme(settings.theme || "dark"); }, [settings.theme]);

  // Persist last-visited tab on every change — read back via lazy useState initializer above
  useEffect(() => {
    if (tab) localStorage.setItem("ml_last_tab", JSON.stringify({ tab, ts: Date.now() }));
  }, [tab]);
  useEffect(() => {
    const lnk = document.createElement("link");
    lnk.rel = "stylesheet";
    lnk.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(lnk);
    // Migrate localStorage → Firebase if first time with Firebase
    if (DB.isFirebase() && !localStorage.getItem("ml_migrated")) {
      DB.migrateFromLocalStorage().then(() => loadAll());
    } else {
      loadAll();
    }
    // Silently re-fetch today's log whenever the app comes back to the foreground
    // (handles overnight stale state — tab left open past midnight).
    // Does NOT call loadAll() so the loading screen never fires mid-session.
    const handleVisibility = async () => {
      if (document.hidden) return;
      const td = await DB.get(KEYS.log(getToday()));
      setTodayLog(td || null);
      const ml = await DB.get(KEYS.mealLog(getToday()));
      setTodayMealLog(ml || {});
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
  const loadAll = async () => {
    setLoading(true);
    const sd = await DB.get(KEYS.setupDone());
    const st = await DB.get(KEYS.settings());
    const go = await DB.get(KEYS.goals());
    const sk = await DB.get(KEYS.streak());
    const ch = await DB.get(KEYS.chores());
    const as = await DB.get(KEYS.allSundays());
    const pan = await DB.get(KEYS.pantry());
    if (pan && pan.length > 0) {
      setPantryItems(pan);
    } else {
      // First launch for this user — check if old root-level pantry data exists (pre-auth migration)
      let migrated = false;
      if (window.__firebase_db && window.__current_uid) {
        try {
          const oldSnap = await window.__firebase_db.ref("ml/food/pantry").once("value");
          if (oldSnap.exists()) {
            const oldData = oldSnap.val();
            if (Array.isArray(oldData) && oldData.length > 0) {
              setPantryItems(oldData);
              await DB.set(KEYS.pantry(), oldData);
              migrated = true;
              console.log("[Mission Log] Migrated", oldData.length, "pantry items from old path");
            }
          }
        } catch(e) { /* migration optional — continue */ }
      }
      if (!migrated) {
        // No seed data — pantry already exists in Firebase for existing users
        setPantryItems([]);
      }
    }
    if (!sd) {
      // New user (e.g. Sabrina) — skip the onboarding wizard entirely.
      // Auto-complete setup using their Google display name and sensible defaults.
      const displayName = (window.__firebase_auth && window.__firebase_auth.currentUser && window.__firebase_auth.currentUser.displayName) || "";
      const firstName = displayName.split(" ")[0] || "User";
      const autoSettings = { ...DEFAULT_SETTINGS, name: firstName };
      await DB.set(KEYS.settings(), autoSettings);
      await DB.set(KEYS.setupDone(), true);
      setSettings(autoSettings);
      setSetupDone(true);
    } else {
      setSetupDone(true);
      if (st) setSettings(st);
    }
    if (go) setGoals(go);
    setStreak(sk || 0);
    setTasks(ch || CHORE_SEED);
    setAllSundays(as || []);

    // Load household membership
    try {
      const hid = await DB.get(KEYS.userHouseholdId());
      if (hid) {
        window.__current_household_id = hid;
        setHouseholdId(hid);
        try {
          const metaSnap = await window.__firebase_db.ref(`households/${hid}/meta`).once("value");
          if (metaSnap.exists()) setHouseholdMeta(metaSnap.val());
        } catch(e) {}
      } else {
        window.__current_household_id = null;
        setHouseholdId(null);
        setHouseholdMeta(null);
      }
    } catch(e) {}

    // Load today's log
    const td = await DB.get(KEYS.log(getToday()));
    setTodayLog(td || null);

    // Load last 90 days for Goals charts
    const logs = [];
    for (let i = 0; i < 90; i++) {
      const d = addDays(getToday(), -i);
      const l = await DB.get(KEYS.log(d));
      if (l) logs.push({
        date: d,
        ...l
      });
    }
    setAllLogs(logs);

    // Load reminders
    const rp = await DB.get(KEYS.reminders());
    const rj = await DB.get(KEYS.jointReminders());
    setReminders(Array.isArray(rp) ? rp : []);
    setJointReminders(Array.isArray(rj) ? rj : []);

    // Load today's meal log + macro targets for Evening rating
    const ml = await DB.get(KEYS.mealLog(getToday()));
    setTodayMealLog(ml || {});
    const mt = await DB.get(KEYS.macroTargets());
    setMacroTargets(mt || null);

    // Calculate streak
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const d = addDays(getToday(), -i);
      const l = await DB.get(KEYS.log(d));
      if (l?.morning || l?.evening) {
        s++;
      } else {
        break;
      }
    }
    setStreak(s);
    await DB.set(KEYS.streak(), s);
    setLoading(false);
  };
  const handleSaveGoals = async updated => {
    setGoals(updated);
    await DB.set(KEYS.goals(), updated);
  };
  const handleMilestone = msg => {
    setCelebration(msg);
    // Store in milestones
    DB.get(KEYS.milestones()).then(ms => {
      DB.set(KEYS.milestones(), [{
        text: msg,
        date: getToday(),
        timestamp: new Date().toISOString()
      }, ...(ms || [])].slice(0, 200));
    });
  };

  // Export all data
  const handleExport = async () => {
    const exportData = {
      settings,
      goals,
      streak,
      tasks,
      allSundays
    };
    const logs = {};
    for (let i = 0; i < 365; i++) {
      const d = addDays(getToday(), -i);
      const l = await DB.get(KEYS.log(d));
      if (l) logs[d] = l;
    }
    exportData.logs = logs;
    exportData.customMeals = (await DB.get(KEYS.customMeals())) || [];
    exportData.milestones = (await DB.get(KEYS.milestones())) || [];
    exportData.winsArchive = (await DB.get(KEYS.winsArchive())) || [];
    exportData.exportedAt = new Date().toISOString();
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mission-log-export-${getToday()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const overdueChores = tasks.filter(t => {
    const nd = addDays(t.last, t.freq);
    return daysBetween(getToday(), nd) < 0;
  }).length;

  // Collect personal data for migration when user creates a household
  const getPersonalDataForMigration = async () => {
    const chores = tasks;
    const pantryItemsSnap = pantryItems;
    const months = (await DB.get(KEYS.financeAllMonths())) || [];
    const financeMonths = await Promise.all(months.map(async m => ({
      month: m,
      txns: (await DB.get(KEYS.financeTransactions(m))) || [],
      income: (await DB.get(KEYS.financeIncome(m))) || [],
      envelopes: (await DB.get(KEYS.financeEnvelopes(m))) || [],
      rollover: (await DB.get(KEYS.financeRollover(m))) || null
    })));
    const merchantRules = await DB.get(KEYS.merchantRules());
    const customSubCats = await DB.get(KEYS.customSubCats());
    const envelopeCatalog = await DB.get(KEYS.financeEnvelopeCatalog());
    const defaultEnvelopes = await DB.get(KEYS.financeDefaultEnvelopes());
    return { chores, pantryItems: pantryItemsSnap, financeMonths, merchantRules, customSubCats, envelopeCatalog, defaultEnvelopes };
  };

  const handleShowHouseholdSetup = async () => {
    const data = await getPersonalDataForMigration();
    setPersonalDataForMigration(data);
    setShowHouseholdSetup(true);
  };

  // ── Section + sub-tab nav structure ────────────────────────────────────────
  const NAV = [{
    id: "personal",
    label: "PERSONAL",
    color: "#f4a823",
    tabs: [{
      id: "morning",
      l: "MORNING",
      c: "#f4a823"
    }, {
      id: "evening",
      l: "EVENING",
      c: "#60a5fa"
    }, {
      id: "goals",
      l: "GOALS",
      c: "#34d399"
    }, {
      id: "sunday",
      l: "SUNDAY",
      c: "#4ade80"
    }]
  }, {
    id: "health",
    label: "HEALTH",
    color: "#fb923c",
    tabs: [{
      id: "mobility",
      l: "MOBILITY",
      c: "#a78bfa"
    }, {
      id: "train",
      l: "TRAIN",
      c: "#fb923c"
    }, {
      id: "food",
      l: "FOOD",
      c: "#4ade80"
    }]
  }, {
    id: "home",
    label: "HOME",
    color: "#60a5fa",
    tabs: [{
      id: "pantry",
      l: "INVENTORY",
      c: "#fb923c"
    }, {
      id: "chores",
      l: "TASKS",
      c: "#60a5fa"
    }, {
      id: "reminders",
      l: "REMINDERS",
      c: "#a78bfa"
    }]
  }, {
    id: "finance",
    label: "FINANCE",
    color: "#34d399",
    tabs: []
  }, {
    id: "history",
    label: "OVERVIEW",
    color: "#a78bfa",
    tabs: []
  }];

  // Derive active section from current tab
  const activeSection = NAV.find(s => s.tabs.some(t => t.id === tab) || s.id === tab) || NAV[0];
  if (loading || setupDone === null) return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Syne',sans-serif",
      color: "#f4a823",
      fontSize: 14,
      letterSpacing: ".1em"
    }
  }, "LOADING...");
  // Full-screen household setup flow
  if (showHouseholdSetup) return /*#__PURE__*/React.createElement(HouseholdSetup, {
    currentUser: window.__firebase_auth && window.__firebase_auth.currentUser,
    allPersonalData: personalDataForMigration,
    onComplete: (hid, meta) => {
      setHouseholdId(hid);
      setHouseholdMeta(meta);
      setShowHouseholdSetup(false);
      setPersonalDataForMigration(null);
      loadAll();
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--bg)",
      fontFamily: "'DM Sans',sans-serif",
      color: "#e2e5ed",
      maxWidth: 490,
      margin: "0 auto"
    }
  }, showSettings && /*#__PURE__*/React.createElement(SettingsModal, {
    settings: settings,
    householdId: householdId,
    householdMeta: householdMeta,
    onSave: s => { setSettings(s); window.__claude_api_key = s.claudeApiKey || ""; window.__household_id = s.householdId || ""; },
    onClose: () => setShowSettings(false)
  }), celebration && /*#__PURE__*/React.createElement(CelebrationOverlay, {
    msg: celebration,
    onDismiss: () => setCelebration(null)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 20px 0",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      position: "sticky",
      top: 0,
      background: "var(--bg)",
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "'Syne',sans-serif",
      fontSize: 15,
      fontWeight: 800,
      margin: "0 0 1px",
      color: "#e2e5ed",
      letterSpacing: ".06em"
    }
  }, "MISSION LOG"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 10,
      margin: 0,
      letterSpacing: ".05em"
    }
  }, fmtLong(getToday()).toUpperCase())), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, (activeSection.id === "health" || tab === "home") && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      borderRadius: 7,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,.09)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveUser("self"),
    style: {
      padding: "4px 9px",
      border: "none",
      background: activeUser === "self" ? "rgba(96,165,250,.2)" : "transparent",
      color: activeUser === "self" ? "#60a5fa" : "var(--text-secondary)",
      fontSize: 10,
      fontWeight: activeUser === "self" ? 700 : 400,
      cursor: "pointer"
    }
  }, settings.name), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveUser("partner"),
    style: {
      padding: "4px 9px",
      border: "none",
      background: activeUser === "partner" ? "rgba(167,139,250,.2)" : "transparent",
      color: activeUser === "partner" ? "#a78bfa" : "var(--text-secondary)",
      fontSize: 10,
      fontWeight: activeUser === "partner" ? 700 : 400,
      cursor: "pointer"
    }
  }, settings.partnerName)), streak > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontFamily: "'Syne',sans-serif",
      fontSize: 18,
      fontWeight: 800,
      margin: 0,
      lineHeight: 1
    }
  }, streak), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 8,
      margin: 0,
      letterSpacing: ".04em"
    }
  }, "DAY STREAK")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: todayLog?.morning ? "#f4a823" : "#1f2631"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: todayLog?.evening ? "#60a5fa" : "#1f2631"
    }
  })))), /*#__PURE__*/React.createElement(TodayStrip, {
    todayLog: todayLog,
    streak: streak,
    settings: settings,
    overdueChores: overdueChores,
    pantryLowCount: pantryItems.filter(p => {
      const qty = parseFloat(p.qty || 0);
      return qty === 0 || p.minQty && qty <= parseFloat(p.minQty);
    }).length
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      marginTop: 6
    }
  }, NAV.map(section => {
    const isActive = activeSection.id === section.id;
    const alertCount = section.id === "home" ? overdueChores : section.id === "personal" ? 0 : 0;
    return /*#__PURE__*/React.createElement("button", {
      key: section.id,
      onClick: () => {
        if (section.comingSoon) return;
        if (section.tabs.length > 0) {
          // Go to first tab in section if not already in it
          if (!section.tabs.some(t => t.id === tab)) setTab(section.tabs[0].id);
        } else {
          setTab(section.id);
        }
      },
      style: {
        flex: 1,
        padding: "8px 2px",
        border: "none",
        background: "transparent",
        cursor: section.comingSoon ? "default" : "pointer",
        borderBottom: `2px solid ${isActive ? section.color : "transparent"}`,
        opacity: section.comingSoon ? 0.4 : 1,
        transition: "all .14s",
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: isActive ? section.color : "#c8d0dc",
        fontSize: 9,
        fontWeight: isActive ? 800 : 700,
        margin: 0,
        fontFamily: "'Syne',sans-serif",
        letterSpacing: ".05em",
        whiteSpace: "nowrap"
      }
    }, section.label, section.comingSoon && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 7,
        marginLeft: 2,
        color: "#34d399",
        fontWeight: 700
      }
    }, "SOON")), alertCount > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: 4,
        right: 4,
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: "#ef4444",
        color: "#fff",
        fontSize: 8,
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, alertCount));
  })), activeSection.tabs.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      overflowX: "auto",
      gap: 0,
      background: "rgba(255,255,255,.02)",
      borderBottom: "1px solid rgba(255,255,255,.04)"
    }
  }, activeSection.tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    style: {
      flexShrink: 0,
      padding: "7px 10px",
      border: "none",
      background: "transparent",
      color: tab === t.id ? t.c : "#c8d0dc",
      fontWeight: tab === t.id ? 700 : 600,
      fontSize: 9,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif",
      letterSpacing: ".05em",
      borderBottom: `2px solid ${tab === t.id ? t.c : "transparent"}`,
      whiteSpace: "nowrap",
      transition: "all .14s"
    }
  }, t.l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 20px 80px"
    }
  }, activeSection.id === "health" && /*#__PURE__*/React.createElement(window.HealthScorecard, {
    todayLog: todayLog,
    todayMealLog: todayMealLog,
    macroTargets: macroTargets
  }), tab === "morning" && /*#__PURE__*/React.createElement(window.Morning, {
    key: getToday(),
    todayLog: todayLog,
    onSave: loadAll,
    settings: settings,
    onMilestone: handleMilestone,
    allLogs: allLogs,
    initialDate: editLogDate?.section === "morning" ? editLogDate.date : null,
    onInitialDateConsumed: () => setEditLogDate(null)
  }), tab === "train" && /*#__PURE__*/React.createElement(window.TrainTab, {
    todayLog: todayLog,
    onSave: loadAll,
    settings: settings
  }), tab === "mobility" && /*#__PURE__*/React.createElement(window.MobilityTab, {
    todayLog: todayLog,
    onSave: (checked, mobDone) => {
      // Silent patch — update todayLog state directly, no full reload
      setTodayLog(prev => ({
        ...prev,
        morning: { ...((prev || {}).morning || {}), mobilityChecked: checked, mobilityCount: mobDone }
      }));
    }
  }), tab === "evening" && /*#__PURE__*/React.createElement(window.Evening, {
    key: getToday(),
    todayLog: todayLog,
    onSave: loadAll,
    settings: settings,
    onMilestone: handleMilestone,
    allLogs: allLogs,
    reminders: reminders,
    jointReminders: jointReminders,
    mealLog: todayMealLog,
    macroTargets: macroTargets,
    initialDate: editLogDate?.section === "evening" ? editLogDate.date : null,
    onInitialDateConsumed: () => setEditLogDate(null)
  }), tab === "food" && /*#__PURE__*/React.createElement(window.FoodTab, {
    uid: settings.uid || "ryan",
    partnerUid: settings.partnerUid || "sabrina",
    activeUser: activeUser,
    pantryItemsFromApp: pantryItems,
    settings: settings
  }), tab === "chores" && (
    householdId
      ? /*#__PURE__*/React.createElement(window.TasksTab, {
          tasks: tasks,
          setTasks: setTasks,
          settings: settings,
          activeUser: activeUser
        })
      : /*#__PURE__*/React.createElement(HouseholdJoinPrompt, { onSetup: handleShowHouseholdSetup })
  ), tab === "pantry" && (
    householdId
      ? /*#__PURE__*/React.createElement(window.PantryTab, {
          pantryItems: pantryItems,
          setPantryItems: setPantryItems,
          onAddToGrocery: () => {}
        })
      : /*#__PURE__*/React.createElement(HouseholdJoinPrompt, { onSetup: handleShowHouseholdSetup })
  ), tab === "reminders" && (
    householdId
      ? /*#__PURE__*/React.createElement(window.RemindersTab, { settings: settings })
      : /*#__PURE__*/React.createElement(HouseholdJoinPrompt, { onSetup: handleShowHouseholdSetup })
  ), tab === "goals" && /*#__PURE__*/React.createElement(window.Goals, {
    goals: goals,
    onSaveGoals: handleSaveGoals,
    allLogs: allLogs,
    settings: settings,
    onMilestone: handleMilestone
  }), tab === "sunday" && /*#__PURE__*/React.createElement(window.Sunday, {
    wk: allLogs.filter(l => daysBetween(l.date, getToday()) <= 7),
    allLogs: allLogs,
    settings: settings,
    allSundays: allSundays,
    choreTasks: tasks
  ), tab === "history" && /*#__PURE__*/React.createElement(window.HistoryBrowser, {
    allLogs: allLogs,
    allSundays: allSundays,
    settings: settings,
    onEditLog: (date, section) => { setEditLogDate({ date, section }); setTab(section === "evening" ? "evening" : "morning"); }
  }), tab === "finance" && /*#__PURE__*/React.createElement(window.FinanceTab, {
    settings: settings
  })), /*#__PURE__*/React.createElement("button", {
    onClick: handleExport,
    style: {
      position: "fixed",
      bottom: 20,
      right: 20,
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "var(--card-bg-2)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "var(--text-muted)",
      fontSize: 14,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 40
    },
    title: "Export all data"
  }, "\u2B07"), userCtx && /*#__PURE__*/React.createElement("button", {
    onClick: () => userCtx.signOut(),
    style: {
      position: "fixed",
      bottom: 64,
      right: 20,
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "var(--card-bg-2)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "var(--text-muted)",
      fontSize: 14,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 40
    },
    title: `Sign out (${userCtx.email?.split("@")[0] || "user"})`
  }, userCtx.photoURL ? /*#__PURE__*/React.createElement("img", {
    src: userCtx.photoURL,
    alt: "",
    style: {
      width: 26,
      height: 26,
      borderRadius: "50%",
      objectFit: "cover"
    },
    referrerPolicy: "no-referrer"
  }) : "⏻"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowSettings(true),
    style: {
      position: "fixed",
      bottom: 108,
      right: 20,
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: settings.claudeApiKey ? "rgba(167,139,250,.15)" : "var(--card-bg-2)",
      border: settings.claudeApiKey ? "1px solid rgba(167,139,250,.35)" : "1px solid rgba(255,255,255,.1)",
      color: settings.claudeApiKey ? "#a78bfa" : "var(--text-secondary)",
      fontSize: 16,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 40
    },
    title: "Settings"
  }, "⚙"));
}
