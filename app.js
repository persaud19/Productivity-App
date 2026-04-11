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
  // Shared household keys (food + chores) are routed to "households/<id>/..." when a household is active
  const SHARED_KEY_PREFIXES = ["ml/food/", "ml/chores", "ml/reminders/joint", "ml/finance/", "ml/mobility/"];
  const toPath = k => {
    const uid = window.__current_uid;
    const base = k.replace(/:/g, "/");
    const householdId = window.__household_id;
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
  mobilityWeek: monday => `ml:mobility:week:${monday}`
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
// SETUP INTERVIEW — first-run blocking screen
// ─────────────────────────────────────────────────────────────────────────────
function SetupInterview({
  onComplete
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "Ryan",
    partnerName: "Sabrina",
    sonName: "",
    weightStart: 210,
    weightGoal: 180,
    weightDeadline: "2026-12-31",
    stepGoal: 10000,
    sleepGoal: 7.5,
    loanBalance: 113000,
    loanDeadline: "2026-12-31",
    savingsTarget: 20000,
    savingsCurrent: 20000
  });
  const set = (k, v) => setData(p => ({
    ...p,
    [k]: v
  }));
  const steps = [{
    id: "welcome",
    title: "Welcome to Mission Log",
    sub: "Let's spend 60 seconds setting up your personal Life OS. Everything you enter here will be used throughout the app.",
    fields: null,
    cta: "Let's Go →"
  }, {
    id: "people",
    title: "Who's using this?",
    sub: "We'll personalise morning, evening, goals, and Sunday for you individually.",
    fields: [{
      k: "name",
      label: "Your first name",
      type: "text",
      placeholder: "Ryan"
    }, {
      k: "partnerName",
      label: "Partner's name",
      type: "text",
      placeholder: "Sabrina"
    }, {
      k: "sonName",
      label: "Your son's name (optional)",
      type: "text",
      placeholder: "e.g. Ethan"
    }],
    cta: "Next →"
  }, {
    id: "weight",
    title: "Weight Goal",
    sub: "This sets your goal arc, pace projections, and AI brief context.",
    fields: [{
      k: "weightStart",
      label: "Starting weight (lbs)",
      type: "number",
      placeholder: "210"
    }, {
      k: "weightGoal",
      label: "Goal weight (lbs)",
      type: "number",
      placeholder: "180"
    }, {
      k: "weightDeadline",
      label: "Target date",
      type: "date"
    }],
    cta: "Next →"
  }, {
    id: "activity",
    title: "Activity Goals",
    sub: "Used in the step counter, sleep tracking, and Sunday insights.",
    fields: [{
      k: "stepGoal",
      label: "Daily step goal",
      type: "number",
      placeholder: "10000"
    }, {
      k: "sleepGoal",
      label: "Sleep goal (hours)",
      type: "number",
      placeholder: "7.5",
      step: "0.5"
    }],
    cta: "Next →"
  }, {
    id: "finance",
    title: "Finance Baseline",
    sub: "Powers the Finance pillar and Sunday financial snapshot. Stays private.",
    fields: [{
      k: "loanBalance",
      label: "Family loan current balance ($)",
      type: "number",
      placeholder: "113000"
    }, {
      k: "loanDeadline",
      label: "Target payoff date",
      type: "date"
    }, {
      k: "savingsCurrent",
      label: "Current savings ($)",
      type: "number",
      placeholder: "20000"
    }, {
      k: "savingsTarget",
      label: "Savings target ($)",
      type: "number",
      placeholder: "20000"
    }],
    cta: "Next →"
  }, {
    id: "done",
    title: "You're set up.",
    sub: "Everything is ready. You can update any of these in the Goals tab at any time.",
    fields: null,
    cta: "Open Mission Log →"
  }];
  const current = steps[step];
  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
      return;
    }
    const settings = {
      ...DEFAULT_SETTINGS,
      name: data.name || "Ryan",
      partnerName: data.partnerName || "Sabrina",
      sonName: data.sonName || "",
      weightGoal: parseFloat(data.weightGoal) || 180,
      weightStart: parseFloat(data.weightStart) || 210,
      weightDeadline: data.weightDeadline || "2026-12-31",
      stepGoal: parseInt(data.stepGoal) || 10000,
      sleepGoal: parseFloat(data.sleepGoal) || 7.5,
      loanBalance: parseFloat(data.loanBalance) || 113000,
      loanStart: parseFloat(data.loanBalance) || 113000,
      loanDeadline: data.loanDeadline || "2026-12-31",
      savingsTarget: parseFloat(data.savingsTarget) || 20000,
      savingsCurrent: parseFloat(data.savingsCurrent) || 20000
    };
    await DB.set(KEYS.settings(), settings);
    await DB.set(KEYS.setupDone(), true);
    onComplete(settings);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      fontFamily: "'DM Sans',sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 32
    }
  }, steps.map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      height: 3,
      borderRadius: 2,
      background: i <= step ? "#f4a823" : "var(--card-border-2)",
      transition: "background .3s"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      color: "#f4a823",
      fontFamily: "'Syne',sans-serif",
      fontSize: 22,
      fontWeight: 800,
      margin: "0 0 10px",
      lineHeight: 1.2
    }
  }, current.title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#6b7280",
      fontSize: 14,
      margin: 0,
      lineHeight: 1.6
    }
  }, current.sub)), current.fields && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
      marginBottom: 28
    }
  }, current.fields.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.k
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: f.label
  }), /*#__PURE__*/React.createElement("input", {
    type: f.type || "text",
    value: data[f.k] || "",
    onChange: e => set(f.k, f.type === "number" ? e.target.value : e.target.value),
    placeholder: f.placeholder || "",
    step: f.step || undefined,
    style: {
      ...inp,
      fontSize: 15,
      colorScheme: "dark"
    }
  })))), current.id === "done" && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 28,
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, [`👤 ${data.name || "Ryan"} + ${data.partnerName || "Sabrina"}${data.sonName ? " + " + data.sonName : ""}`, `⚖️ ${data.weightStart} → ${data.weightGoal} lbs by ${fmtDate(data.weightDeadline || "2026-12-31")}`, `👟 ${parseInt(data.stepGoal || 10000).toLocaleString()} steps/day · ${data.sleepGoal || 7.5}h sleep`, `💰 Loan: $${parseFloat(data.loanBalance || 113000).toLocaleString()} · Savings: $${parseFloat(data.savingsCurrent || 20000).toLocaleString()}`].map((line, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "9px 13px",
      background: "var(--card-bg-3)",
      borderRadius: 9,
      border: "1px solid rgba(255,255,255,.07)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-primary)",
      fontSize: 12,
      margin: 0
    }
  }, line)))), /*#__PURE__*/React.createElement("button", {
    onClick: handleNext,
    style: {
      width: "100%",
      padding: "14px 0",
      background: "#f4a823",
      color: "#080b11",
      border: "none",
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif",
      letterSpacing: ".05em"
    }
  }, current.cta), step > 0 && step < steps.length - 1 && /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep(s => s - 1),
    style: {
      width: "100%",
      padding: "10px 0",
      background: "transparent",
      border: "none",
      color: "var(--text-muted)",
      fontSize: 12,
      cursor: "pointer",
      marginTop: 10
    }
  }, "\u2190 Back")));
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILITY EXERCISES — 50 pool, zone-balanced daily 10
// ─────────────────────────────────────────────────────────────────────────────
const ALL_EXERCISES = [
// SPINE (6)
{
  id: "cat_cow",
  zone: "spine",
  name: "Cat-Cow",
  reps: "10 slow",
  tip: "Arch and round on all fours with each breath."
}, {
  id: "childs_pose",
  zone: "spine",
  name: "Child's Pose",
  reps: "30s hold",
  tip: "Kneel, sit back on heels, arms forward."
}, {
  id: "cobra",
  zone: "spine",
  name: "Cobra Stretch",
  reps: "10 reps",
  tip: "Press chest up from the floor, elbows soft."
}, {
  id: "sphinx",
  zone: "spine",
  name: "Sphinx Pose",
  reps: "45s hold",
  tip: "Forearms flat, chest lifted, breathe deep."
}, {
  id: "seated_twist",
  zone: "spine",
  name: "Seated Twist",
  reps: "30s each",
  tip: "Cross one leg, twist toward it."
}, {
  id: "thoracic_rot",
  zone: "spine",
  name: "Thoracic Rotation",
  reps: "10 each",
  tip: "Hand behind head, rotate upper back open."
},
// HIPS (8)
{
  id: "hip_circles",
  zone: "hips",
  name: "Hip Circles",
  reps: "10 each way",
  tip: "Big slow circles, hands on hips."
}, {
  id: "hip_flexor",
  zone: "hips",
  name: "Hip Flexor Stretch",
  reps: "30s each",
  tip: "Kneel one knee down, tuck pelvis, lean forward."
}, {
  id: "worlds_great",
  zone: "hips",
  name: "World's Greatest",
  reps: "5 each",
  tip: "Lunge, rotate opposite arm to sky."
}, {
  id: "90_90",
  zone: "hips",
  name: "90/90 Hip Stretch",
  reps: "30s each",
  tip: "Both legs at 90° — sit tall and breathe."
}, {
  id: "pigeon_pose",
  zone: "hips",
  name: "Pigeon Pose",
  reps: "45s each",
  tip: "Shin across the front, hips square."
}, {
  id: "frog_stretch",
  zone: "hips",
  name: "Frog Stretch",
  reps: "45s hold",
  tip: "Knees wide, hips back."
}, {
  id: "lateral_lunge",
  zone: "hips",
  name: "Lateral Lunge",
  reps: "10 each",
  tip: "Shift side to side, bend one knee."
}, {
  id: "hip_hinge",
  zone: "hips",
  name: "Hip Hinge Drill",
  reps: "12",
  tip: "Push hips back toward the wall behind you."
},
// SHOULDERS (5)
{
  id: "shoulder_roll",
  zone: "shoulder",
  name: "Shoulder Rolls",
  reps: "10 fwd, 10 back",
  tip: "Lift to ears, roll backward and down."
}, {
  id: "chest_opener",
  zone: "shoulder",
  name: "Chest Opener",
  reps: "30s hold",
  tip: "Hands clasped behind, lift chest."
}, {
  id: "wall_angel",
  zone: "shoulder",
  name: "Wall Angels",
  reps: "10 slow",
  tip: "Back flat on wall, slide arms overhead."
}, {
  id: "cross_body",
  zone: "shoulder",
  name: "Cross-Body Stretch",
  reps: "30s each",
  tip: "Pull arm across chest gently."
}, {
  id: "thread_needle",
  zone: "shoulder",
  name: "Thread the Needle",
  reps: "10 each",
  tip: "Slide arm under body from all-fours."
},
// CORE (5)
{
  id: "dead_bug",
  zone: "core",
  name: "Dead Bug",
  reps: "10 each",
  tip: "Lower opposites slowly, back flat."
}, {
  id: "bird_dog",
  zone: "core",
  name: "Bird Dog",
  reps: "10 each",
  tip: "Opposite arm/leg, hold 2s."
}, {
  id: "glute_bridge",
  zone: "core",
  name: "Glute Bridges",
  reps: "15",
  tip: "Drive hips up, squeeze at the top."
}, {
  id: "pelvic_tilt",
  zone: "core",
  name: "Pelvic Tilts",
  reps: "15",
  tip: "Flatten lower back to mat."
}, {
  id: "hollow_hold",
  zone: "core",
  name: "Hollow Hold",
  reps: "3×20s",
  tip: "Press back to floor, legs and arms out."
},
// HAMSTRINGS (4)
{
  id: "supine_ham",
  zone: "hamstring",
  name: "Supine Hamstring",
  reps: "30s each",
  tip: "Lift leg, straighten, hold."
}, {
  id: "standing_fold",
  zone: "hamstring",
  name: "Standing Forward Fold",
  reps: "30s hold",
  tip: "Hinge from hips, soft knees."
}, {
  id: "good_morning",
  zone: "hamstring",
  name: "Good Mornings",
  reps: "12",
  tip: "Hinge at hips, feel the stretch."
}, {
  id: "inchworm",
  zone: "hamstring",
  name: "Inchworm",
  reps: "8",
  tip: "Walk hands to plank, back to feet."
},
// QUADS (4)
{
  id: "quad_stretch",
  zone: "quads",
  name: "Standing Quad Stretch",
  reps: "30s each",
  tip: "Pull foot to glute, stand tall."
}, {
  id: "kneeling_rock",
  zone: "quads",
  name: "Kneeling Quad Rock",
  reps: "10 slow",
  tip: "Hinge back from kneeling position."
}, {
  id: "wall_sit",
  zone: "quads",
  name: "Wall Sit",
  reps: "30s hold",
  tip: "Thighs parallel, back flat."
}, {
  id: "low_lunge_quad",
  zone: "quads",
  name: "Low Lunge Quad",
  reps: "30s each",
  tip: "Back foot up, grab and pull toward glute."
},
// GLUTES (4)
{
  id: "donkey_kick",
  zone: "glutes",
  name: "Donkey Kicks",
  reps: "12 each",
  tip: "Drive heel up, squeeze at top."
}, {
  id: "fire_hydrant",
  zone: "glutes",
  name: "Fire Hydrants",
  reps: "12 each",
  tip: "Lift knee out to side, hold 1s."
}, {
  id: "lying_glute",
  zone: "glutes",
  name: "Lying Glute Stretch",
  reps: "30s each",
  tip: "Ankle over knee, pull toward chest."
}, {
  id: "clamshell",
  zone: "glutes",
  name: "Clamshells",
  reps: "15 each",
  tip: "Side-lying, rotate knee up."
},
// CALVES/ANKLES (4)
{
  id: "calf_stretch",
  zone: "calves",
  name: "Calf Stretch",
  reps: "30s each",
  tip: "Back heel pressed firmly down."
}, {
  id: "calf_raise",
  zone: "calves",
  name: "Calf Raises",
  reps: "15 slow",
  tip: "Full range, pause at top."
}, {
  id: "ankle_circles",
  zone: "calves",
  name: "Ankle Circles",
  reps: "10 each way",
  tip: "Big slow circles."
}, {
  id: "ankle_alpha",
  zone: "calves",
  name: "Ankle Alphabet",
  reps: "1x per foot",
  tip: "Trace A–Z in the air."
},
// NECK (3)
{
  id: "neck_tilt",
  zone: "neck",
  name: "Neck Side Tilt",
  reps: "5 each, 5s hold",
  tip: "Drop ear to shoulder."
}, {
  id: "neck_rolls",
  zone: "neck",
  name: "Neck Rolls",
  reps: "5 each direction",
  tip: "Slow. Stop if any sharp pain."
}, {
  id: "chin_tuck",
  zone: "neck",
  name: "Chin Tucks",
  reps: "10",
  tip: "Pull chin straight back, not down."
},
// FULL BODY (7)
{
  id: "squat_stand",
  zone: "full",
  name: "Squat to Stand",
  reps: "10",
  tip: "Grab toes, squat deep, straighten legs."
}, {
  id: "spiderman",
  zone: "full",
  name: "Spiderman Stretch",
  reps: "6 each",
  tip: "Step foot outside same hand."
}, {
  id: "bear_hold",
  zone: "full",
  name: "Bear Hold",
  reps: "3×15s",
  tip: "Knees 2 inches off mat, back flat."
}, {
  id: "walkout_plank",
  zone: "full",
  name: "Walkout to Plank",
  reps: "8",
  tip: "Walk out, hold 5s, walk back."
}, {
  id: "standing_side",
  zone: "full",
  name: "Standing Side Bend",
  reps: "10 each",
  tip: "Reach overhead, lean slowly."
}, {
  id: "reach_roll",
  zone: "full",
  name: "Reach, Roll & Lift",
  reps: "8 each",
  tip: "Sweep arm in wide arc overhead."
}, {
  id: "hip_swing",
  zone: "full",
  name: "Leg Swings",
  reps: "15 each direction",
  tip: "Hold wall, swing leg front to back."
}];
const ZONE_COLORS = {
  spine: "#34d399",
  hips: "#f4a823",
  shoulder: "#a78bfa",
  core: "#4ade80",
  hamstring: "#facc15",
  quads: "#60a5fa",
  glutes: "#fb923c",
  calves: "#f472b6",
  neck: "#9ca3af",
  full: "#e2e5ed"
};

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
const CHORE_SEED = [{
  id: "c01",
  name: "Drano For All Sinks",
  last: "2025-11-25",
  freq: 180,
  priority: "High",
  owner: "Both"
}, {
  id: "c02",
  name: "Deep Clean Dishwasher",
  last: "2026-03-21",
  freq: 30,
  priority: "High",
  owner: "Both"
}, {
  id: "c03",
  name: "All Floors Main Floor Steamed",
  last: "2026-03-21",
  freq: 31,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c04",
  name: "Brita Filters Change",
  last: "2026-02-04",
  freq: 90,
  priority: "High",
  owner: "Both"
}, {
  id: "c05",
  name: "Coffee Machine Rinse Cycle",
  last: "2026-03-14",
  freq: 14,
  priority: "Low",
  owner: "Both"
}, {
  id: "c06",
  name: "Mini Fridge Cleaned",
  last: "2026-01-20",
  freq: 60,
  priority: "Low",
  owner: "Both"
}, {
  id: "c07",
  name: "Fridge & Freezer Clean",
  last: "2026-01-20",
  freq: 60,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c08",
  name: "Refill Rinse Aid In Dishwasher",
  last: "2026-03-19",
  freq: 21,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c09",
  name: "Upstairs Washroom Cleaned",
  last: "2026-03-15",
  freq: 14,
  priority: "High",
  owner: "Both"
}, {
  id: "c10",
  name: "Powder Room Cleaned",
  last: "2026-03-01",
  freq: 14,
  priority: "High",
  owner: "Both"
}, {
  id: "c11",
  name: "Water All Plants",
  last: "2026-03-21",
  freq: 7,
  priority: "High",
  owner: "Both"
}, {
  id: "c12",
  name: "Vacuum Upstairs",
  last: "2026-03-15",
  freq: 7,
  priority: "High",
  owner: "Both"
}, {
  id: "c13",
  name: "Deep Clean Sink",
  last: "2026-03-15",
  freq: 21,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c14",
  name: "Deep Clean Toaster",
  last: "2026-03-15",
  freq: 31,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c15",
  name: "Deep Clean Humidifier",
  last: "2026-03-21",
  freq: 7,
  priority: "High",
  owner: "Both"
}, {
  id: "c16",
  name: "Walls Dusted",
  last: "2026-03-21",
  freq: 90,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c17",
  name: "Printer Cleaned",
  last: "2026-03-21",
  freq: 90,
  priority: "Low",
  owner: "Both"
}, {
  id: "c18",
  name: "Shower Deep Clean",
  last: "2026-03-15",
  freq: 31,
  priority: "High",
  owner: "Both"
}, {
  id: "c19",
  name: "Vacuum Deep Clean",
  last: "2026-02-10",
  freq: 45,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c20",
  name: "Dusted Upstairs",
  last: "2026-03-21",
  freq: 15,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c21",
  name: "Surface Clean Appliances",
  last: "2026-02-16",
  freq: 30,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c22",
  name: "Surface Clean Cabinets",
  last: "2025-12-22",
  freq: 90,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c23",
  name: "Descale Nespresso",
  last: "2025-12-22",
  freq: 90,
  priority: "Low",
  owner: "Both"
}, {
  id: "c24",
  name: "Re-Moisturize Couch",
  last: "2025-12-23",
  freq: 300,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c25",
  name: "Downstairs Dusting",
  last: "2026-02-10",
  freq: 21,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c26",
  name: "Furnace Filter Changed",
  last: "2025-12-30",
  freq: 90,
  priority: "High",
  owner: "Both"
}, {
  id: "c27",
  name: "Dusted Fans",
  last: "2026-01-06",
  freq: 120,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c28",
  name: "Baby Brezza Formula Descale",
  last: "2026-03-21",
  freq: 30,
  priority: "High",
  owner: "Both"
}, {
  id: "c29",
  name: "Washroom Fan Dusted",
  last: "2026-01-19",
  freq: 180,
  priority: "Low",
  owner: "Both"
}, {
  id: "c30",
  name: "Change Humidifier Filter",
  last: "2026-02-28",
  freq: 45,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c31",
  name: "Update Financials",
  last: "2026-02-15",
  freq: 30,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c32",
  name: "Deep Clean Bed",
  last: "2026-02-21",
  freq: 60,
  priority: "Medium",
  owner: "Both"
}, {
  id: "c33",
  name: "Full Countertop Clean",
  last: "2026-03-21",
  freq: 21,
  priority: "Low",
  owner: "Both"
}, {
  id: "c34",
  name: "Deep Clean Washing Machine",
  last: "2026-03-01",
  freq: 14,
  priority: "Medium",
  owner: "Both"
}];
// TasksTab (Home chores) — extracted to modules/home-tab.js


// ─────────────────────────────────────────────────────────────────────────────
// APP SHELL
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// HISTORY BROWSER — full read-only log viewer, any date ever logged
// ─────────────────────────────────────────────────────────────────────────────

function DayDetailView({
  date,
  log,
  onClose,
  onEditLog
}) {
  const [section, setSection] = useState("morning"); // morning | evening | both
  const m = log?.morning || {};
  const e = log?.evening || {};
  const hasMorning = !!(m.weight || m.intention || m.gratitude || m.energy);
  const hasEvening = !!(e.win || e.dayRating || e.cardio || e.strength);
  const snackLabels = ["None 🟢", "Light 🟡", "Moderate 🟠", "Heavy 🔴"];
  const snackColors = ["#4ade80", "#facc15", "#fb923c", "#ef4444"];
  const Field = ({
    label,
    value,
    color = "var(--text-primary)"
  }) => value ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      padding: "10px 13px",
      background: "rgba(255,255,255,.035)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 9
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".07em",
      margin: 0,
      fontWeight: 600
    }
  }, label), /*#__PURE__*/React.createElement("p", {
    style: {
      color: color,
      fontSize: 13,
      margin: 0,
      fontWeight: 500,
      lineHeight: 1.5
    }
  }, value)) : null;
  const RatingDots = ({
    val,
    max = 5,
    color = "#f4a823"
  }) => val ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, Array.from({
    length: max
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: i < val ? color : "var(--card-border-2)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11,
      marginLeft: 3
    }
  }, val, "/5")) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "var(--bg)",
      zIndex: 300,
      overflowY: "auto",
      maxWidth: 490,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 0,
      background: "var(--bg)",
      borderBottom: "1px solid rgba(255,255,255,.08)",
      padding: "14px 20px",
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#a78bfa",
      fontFamily: "'Syne',sans-serif",
      fontSize: 16,
      fontWeight: 800,
      margin: "0 0 1px"
    }
  }, fmtLong(date)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 10,
      margin: 0
    }
  }, "Log entry")), /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } },
    onEditLog && /*#__PURE__*/React.createElement("button", {
      onClick: () => { onEditLog(date, section === "both" ? "morning" : section); onClose(); },
      style: { padding: "7px 12px", background: "rgba(244,168,35,.15)", border: "1px solid rgba(244,168,35,.3)", color: "#f4a823", borderRadius: 9, fontSize: 12, cursor: "pointer", fontWeight: 700 }
    }, "\u270F\uFE0F Edit"),
    /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      style: { padding: "7px 14px", background: "var(--card-bg-2)", border: "1px solid rgba(255,255,255,.1)", color: "#9ca3af", borderRadius: 9, fontSize: 12, cursor: "pointer", fontWeight: 700 }
    }, "\u2190 Back")
  )), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, [["morning", "Morning", "#f4a823", hasMorning], ["evening", "Evening", "#60a5fa", hasEvening], ["both", "Both", "#a78bfa", hasMorning || hasEvening]].map(([id, l, c, has]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setSection(id),
    disabled: !has,
    style: {
      flex: 1,
      padding: "7px 0",
      borderRadius: 7,
      border: "1px solid " + (section === id ? c : "var(--card-bg-4)"),
      background: section === id ? c + "18" : "transparent",
      color: section === id ? c : has ? "var(--text-secondary)" : "#2d3340",
      fontSize: 11,
      fontWeight: section === id ? 800 : 400,
      cursor: has ? "pointer" : "default",
      opacity: has ? 1 : 0.4
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 20px 60px"
    }
  }, (m.exceptionalDay || e.exceptionalDay) && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "9px 13px",
      background: "rgba(167,139,250,.08)",
      border: "1px solid rgba(167,139,250,.2)",
      borderRadius: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#a78bfa",
      fontSize: 11,
      fontWeight: 700,
      margin: 0
    }
  }, "\u26A1 Exceptional day", m.exceptionalReason || e.exceptionalReason ? " — " + (m.exceptionalReason || e.exceptionalReason) : "")), (section === "morning" || section === "both") && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: section === "both" ? 28 : 0
    }
  }, section === "both" && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: ".08em",
      textTransform: "uppercase",
      margin: "0 0 12px",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      width: 3,
      height: 16,
      background: "#f4a823",
      borderRadius: 2
    }
  }), "Morning"), !hasMorning && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 12,
      textAlign: "center",
      padding: "16px 0"
    }
  }, "No morning log for this day"), hasMorning && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, m.weight && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 80px",
      padding: "9px 11px",
      background: "rgba(244,168,35,.08)",
      border: "1px solid rgba(244,168,35,.2)",
      borderRadius: 9
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".06em",
      margin: "0 0 2px"
    }
  }, "Weight"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontFamily: "'Syne',sans-serif",
      fontSize: 20,
      fontWeight: 800,
      margin: 0
    }
  }, m.weight, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--text-secondary)",
      marginLeft: 3
    }
  }, "lbs"))), m.wakeTime && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 80px",
      padding: "9px 11px",
      background: "rgba(167,139,250,.06)",
      border: "1px solid rgba(167,139,250,.15)",
      borderRadius: 9
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".06em",
      margin: "0 0 2px"
    }
  }, "Wake"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#a78bfa",
      fontFamily: "'Syne',sans-serif",
      fontSize: 18,
      fontWeight: 800,
      margin: 0
    }
  }, m.wakeTime)), m.steps > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 80px",
      padding: "9px 11px",
      background: "rgba(52,211,153,.06)",
      border: "1px solid rgba(52,211,153,.15)",
      borderRadius: 9
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".06em",
      margin: "0 0 2px"
    }
  }, "Steps"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#34d399",
      fontFamily: "'Syne',sans-serif",
      fontSize: 18,
      fontWeight: 800,
      margin: 0
    }
  }, parseInt(m.steps).toLocaleString()))), (m.sleep || m.energy || m.mood || m.readiness || m.hunger) && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      background: "var(--card-bg)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 10,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, [["Sleep Quality", m.sleep, "#a78bfa"], ["Energy", m.energy, "#60a5fa"], ["Readiness", m.readiness, "#4ade80"], ["Mood", m.mood, "#f472b6"], ["Hunger", m.hunger, "#fb923c"]].map(([l, v, c]) => v ? /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11
    }
  }, l), /*#__PURE__*/React.createElement(RatingDots, {
    val: v,
    color: c
  })) : null), m.glasses > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11
    }
  }, "Water"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#60a5fa",
      fontSize: 11,
      fontWeight: 700
    }
  }, m.glasses, "/8 glasses"))), m.mobilityCount > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "9px 13px",
      background: "rgba(251,146,60,.06)",
      border: "1px solid rgba(251,146,60,.15)",
      borderRadius: 9,
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11
    }
  }, "Mobility"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#fb923c",
      fontSize: 11,
      fontWeight: 700
    }
  }, m.mobilityCount, "/10 exercises")), m.intention && /*#__PURE__*/React.createElement(Field, {
    label: "Intention",
    value: m.intention,
    color: "#f4a823"
  }), m.gratitude && /*#__PURE__*/React.createElement(Field, {
    label: "Gratitude",
    value: m.gratitude,
    color: "#c9ccd4"
  }))), (section === "evening" || section === "both") && /*#__PURE__*/React.createElement("div", null, section === "both" && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#60a5fa",
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: ".08em",
      textTransform: "uppercase",
      margin: "0 0 12px",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      width: 3,
      height: 16,
      background: "#60a5fa",
      borderRadius: 2
    }
  }), "Evening"), !hasEvening && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 12,
      textAlign: "center",
      padding: "16px 0"
    }
  }, "No evening log for this day"), hasEvening && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, e.cardio && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "9px",
      background: "rgba(74,222,128,.08)",
      border: "1px solid rgba(74,222,128,.2)",
      borderRadius: 8,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontSize: 11,
      fontWeight: 700,
      margin: 0
    }
  }, "\u2713 Cardio")), e.strength && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "9px",
      background: "rgba(74,222,128,.08)",
      border: "1px solid rgba(74,222,128,.2)",
      borderRadius: 8,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontSize: 11,
      fontWeight: 700,
      margin: 0
    }
  }, "\u2713 Strength")), typeof e.snack === "number" && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "9px",
      background: snackColors[e.snack] + "18",
      border: "1px solid " + snackColors[e.snack] + "40",
      borderRadius: 8,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: snackColors[e.snack],
      fontSize: 11,
      fontWeight: 700,
      margin: 0
    }
  }, snackLabels[e.snack]))), (e.dayRating || e.eveningMood || e.foodQuality) && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      background: "var(--card-bg)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 10,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, [["Day Rating", e.dayRating, "#f4a823"], ["Evening Mood", e.eveningMood, "#a78bfa"], ["Food Quality", e.foodQuality, "#fb923c"]].map(([l, v, c]) => v ? /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11
    }
  }, l), /*#__PURE__*/React.createElement(RatingDots, {
    val: v,
    color: c
  })) : null), e.bedtime && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11
    }
  }, "Bedtime"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#a78bfa",
      fontSize: 11,
      fontWeight: 700
    }
  }, e.bedtime)), e.financeWin && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11
    }
  }, "Finance Win"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#34d399",
      fontSize: 11,
      fontWeight: 700
    }
  }, "\u2713 Yes"))), e.win && /*#__PURE__*/React.createElement(Field, {
    label: "Win of the Day",
    value: e.win,
    color: "#f4a823"
  }), e.familyMoment && /*#__PURE__*/React.createElement(Field, {
    label: "Family Moment",
    value: e.familyMoment,
    color: "#f472b6"
  }), e.financeNote && /*#__PURE__*/React.createElement(Field, {
    label: "Finance Note",
    value: e.financeNote,
    color: "#34d399"
  }), e.moodNote && /*#__PURE__*/React.createElement(Field, {
    label: "Mood Note",
    value: e.moodNote,
    color: "#c9ccd4"
  }), e.choresDone && e.choreNote && /*#__PURE__*/React.createElement(Field, {
    label: "Chore Completed",
    value: e.choreNote,
    color: "#fb923c"
  })))));
}
function HistoryBrowser({
  allLogs,
  allSundays,
  settings,
  onEditLog
}) {
  const [view, setView] = useState("calendar"); // calendar | sundays | insights
  const [selectedDate, setSelectedDate] = useState(null);
  const [detailLog, setDetailLog] = useState(null);
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month
  const [loadingDate, setLoadingDate] = useState(null);
  const [insight, setInsight] = useState("");
  const [insightLoading, setInsightLoading] = useState(false);

  // Build a lookup set of dates with data
  const loggedDates = new Set(allLogs.map(l => l.date));

  // Current displayed month
  const displayDate = new Date();
  displayDate.setDate(1);
  displayDate.setMonth(displayDate.getMonth() - monthOffset);
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const monthLabel = displayDate.toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric"
  });

  // Build calendar grid
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = getToday();
  const openDay = async dateStr => {
    if (!loggedDates.has(dateStr)) return;
    setLoadingDate(dateStr);
    const log = allLogs.find(l => l.date === dateStr) || (await DB.get(KEYS.log(dateStr)));
    setDetailLog(log);
    setSelectedDate(dateStr);
    setLoadingDate(null);
  };

  // Pattern insight generator — reads ALL Sunday reviews ever saved
  const generateInsight = async () => {
    setInsightLoading(true);
    setInsight("");
    try {
      // Load all saved Sunday reviews from Firebase
      const reviews = [];
      for (let w = 0; w < 52; w++) {
        const d = new Date();
        d.setDate(d.getDate() - d.getDay() - w * 7);
        const key = d.toISOString().split("T")[0];
        const rev = await DB.get(KEYS.weekReview(key));
        if (rev) reviews.push({
          week: key,
          ...rev
        });
      }
      if (reviews.length === 0) {
        setInsight("No Sunday reviews saved yet. Complete your first Sunday review to start building pattern history.");
        setInsightLoading(false);
        return;
      }

      // Also pull all logs for weight trend + workout patterns
      const weightData = allLogs.filter(l => l.morning?.weight).slice(-90).map(l => ({
        date: l.date,
        w: l.morning.weight
      }));
      const workoutData = allLogs.filter(l => l.evening?.cardio || l.evening?.strength).slice(-90);
      const snackData = allLogs.filter(l => typeof l.evening?.snack === "number").slice(-90);
      const avgSnack = snackData.length ? (snackData.reduce((a, l) => a + l.evening.snack, 0) / snackData.length).toFixed(1) : "?";
      const workoutRate = allLogs.length ? Math.round(workoutData.length / Math.min(allLogs.length, 90) * 100) : 0;
      const reviewSummaries = reviews.slice(0, 12).map((r, i) => {
        const scores = Object.entries(r.pillarScores || {}).map(([k, v]) => k.slice(0, 3) + ":" + v).join(",");
        return "Week " + r.week + ": win=" + JSON.stringify(r.weekWin || "") + " gap=" + JSON.stringify(r.weekNote || "") + " pillars=" + scores + (r.aiBrief ? " brief=" + r.aiBrief.split("\n")[0] : "");
      }).join("\n");
      const prompt = "You are Ryan's long-term accountability partner with access to his full history. Analyze ALL of this data and give a 6-8 sentence insight report that identifies real multi-week patterns — not just this week.\n\nSTATISTICS:\n- Total days logged: " + allLogs.length + "\n- Workout frequency: " + workoutRate + "% of logged days\n- Avg snacking level (0=none, 3=heavy): " + avgSnack + "/3\n- Weight data points: " + weightData.length + "\n- Sunday reviews saved: " + reviews.length + "\n\nSUNDAY REVIEW HISTORY (most recent first):\n" + reviewSummaries + "\n\nWrite a candid pattern analysis. Call out:\n1. What is consistently improving vs consistently struggling\n2. Any cycles or recurring patterns (e.g. good week → bad week → good week)\n3. Which pillar is most consistently underscored\n4. One thing the data suggests he is not seeing himself\n5. One specific suggestion based on what works (reference actual good weeks)\n\nTone: Direct. Honest. Like a coach reviewing game tape. No generic advice — reference his actual data.";
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          messages: [{
            role: "user",
            content: prompt
          }]
        })
      });
      const data = await res.json();
      setInsight(data.content?.[0]?.text || "Could not generate insight.");
    } catch (e) {
      setInsight("Connection error. Try again.");
    }
    setInsightLoading(false);
  };
  if (selectedDate && detailLog !== null) {
    return /*#__PURE__*/React.createElement(DayDetailView, {
      date: selectedDate,
      log: detailLog,
      onClose: () => { setSelectedDate(null); setDetailLog(null); },
      onEditLog: onEditLog
    });
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
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
      background: "#a78bfa",
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      color: "#a78bfa",
      fontFamily: "'Syne',sans-serif",
      fontSize: 18,
      margin: 0,
      fontWeight: 800
    }
  }, "History")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#404755",
      fontSize: 11,
      margin: "0 0 0 13px"
    }
  }, loggedDates.size, " days logged total")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      marginBottom: 18
    }
  }, [["calendar", "📅 Calendar"], ["sundays", "☀️ Sunday Reports"], ["insights", "🧠 Pattern Insights"]].map(([id, l]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setView(id),
    style: {
      flex: 1,
      padding: "9px 0",
      borderRadius: 9,
      border: "1px solid " + (view === id ? "rgba(167,139,250,.4)" : "var(--card-bg-4)"),
      background: view === id ? "rgba(167,139,250,.12)" : "rgba(255,255,255,.02)",
      color: view === id ? "#a78bfa" : "var(--text-secondary)",
      fontSize: 10,
      fontWeight: view === id ? 800 : 400,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, l))), view === "calendar" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setMonthOffset(o => o + 1),
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      border: "1px solid rgba(255,255,255,.1)",
      background: "transparent",
      color: "var(--text-secondary)",
      cursor: "pointer",
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "\u2039"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-primary)",
      fontFamily: "'Syne',sans-serif",
      fontSize: 14,
      fontWeight: 800,
      margin: 0
    }
  }, monthLabel), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMonthOffset(o => Math.max(0, o - 1)),
    disabled: monthOffset === 0,
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      border: "1px solid rgba(255,255,255,.1)",
      background: "transparent",
      color: monthOffset === 0 ? "#2d3340" : "var(--text-secondary)",
      cursor: monthOffset === 0 ? "default" : "pointer",
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "\u203A")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)",
      gap: 3,
      marginBottom: 4
    }
  }, ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => /*#__PURE__*/React.createElement("p", {
    key: d,
    style: {
      color: "var(--text-muted)",
      fontSize: 9,
      textAlign: "center",
      margin: 0,
      fontWeight: 700,
      letterSpacing: ".05em"
    }
  }, d))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)",
      gap: 3
    }
  }, Array.from({
    length: firstDow
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: "e" + i
  })), Array.from({
    length: daysInMonth
  }).map((_, i) => {
    const d = i + 1;
    const dateStr = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
    const hasLog = loggedDates.has(dateStr);
    const isToday = dateStr === today;
    const isFuture = dateStr > today;
    const isLoading = loadingDate === dateStr;
    const isSelected = dateStr === selectedDate;
    const log = allLogs.find(l => l.date === dateStr);
    const hasMorning = !!(log?.morning?.weight || log?.morning?.intention);
    const hasEvening = !!(log?.evening?.win || log?.evening?.dayRating);
    const exceptional = log?.morning?.exceptionalDay || log?.evening?.exceptionalDay;
    return /*#__PURE__*/React.createElement("button", {
      key: dateStr,
      onClick: () => !isFuture && hasLog && openDay(dateStr),
      disabled: isFuture || !hasLog && !isToday,
      style: {
        aspectRatio: "1",
        borderRadius: 8,
        border: "1px solid " + (isSelected ? "#a78bfa" : isToday ? "rgba(167,139,250,.5)" : hasLog ? "rgba(74,222,128,.3)" : "rgba(255,255,255,.06)"),
        background: isSelected ? "#a78bfa" : isToday ? "rgba(167,139,250,.18)" : hasLog ? "rgba(74,222,128,.1)" : "rgba(255,255,255,.02)",
        cursor: hasLog && !isFuture ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3px 2px",
        gap: 2,
        opacity: isFuture ? 0.25 : 1,
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: isSelected ? "#080b11" : isToday ? "#a78bfa" : hasLog ? "#4ade80" : "var(--text-muted)",
        fontSize: 11,
        fontWeight: 800,
        margin: 0,
        fontFamily: "'Syne',sans-serif"
      }
    }, d), hasLog && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: isSelected ? "rgba(8,11,17,.5)" : hasMorning ? "#f4a823" : "rgba(255,255,255,.15)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: isSelected ? "rgba(8,11,17,.5)" : hasEvening ? "#60a5fa" : "rgba(255,255,255,.15)"
      }
    })), exceptional && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: 2,
        right: 3,
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: "#a78bfa"
      }
    }), isLoading && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background: "rgba(167,139,250,.2)",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "#a78bfa"
      }
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 12,
      flexWrap: "wrap"
    }
  }, [["#f4a823", "Morning logged"], ["#60a5fa", "Evening logged"], ["#4ade80", "Both logged"], ["#a78bfa", "Today / Exceptional"]].map(([c, l]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: c
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      fontSize: 10
    }
  }, l)))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#2d3340",
      fontSize: 10,
      margin: "12px 0 0",
      textAlign: "center"
    }
  }, "Tap any green day to view the full log entry")), view === "sundays" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11,
      margin: "0 0 14px",
      lineHeight: 1.6
    }
  }, "Every Sunday review you complete is saved here permanently. They're also fed into the AI brief for pattern recognition."), allSundays.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "32px 16px",
      textAlign: "center",
      background: "rgba(255,255,255,.02)",
      border: "1px solid rgba(255,255,255,.06)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 13,
      margin: "0 0 4px"
    }
  }, "No Sunday reviews saved yet"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#2d3340",
      fontSize: 11,
      margin: 0
    }
  }, "Complete a Sunday review to start building your history")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, allSundays.map((s, i) => {
    const pillarScores = s.pillarScores || {};
    const avgPillar = Object.values(pillarScores).length ? (Object.values(pillarScores).reduce((a, v) => a + v, 0) / Object.values(pillarScores).length).toFixed(1) : null;
    const topPillar = Object.entries(pillarScores).sort((a, b) => b[1] - a[1])[0];
    const lowPillar = Object.entries(pillarScores).sort((a, b) => a[1] - b[1])[0];
    return /*#__PURE__*/React.createElement("div", {
      key: s.date || i,
      style: {
        background: "rgba(255,255,255,.035)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 12,
        padding: "14px 16px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#4ade80",
        fontFamily: "'Syne',sans-serif",
        fontSize: 13,
        fontWeight: 800,
        margin: "0 0 2px"
      }
    }, "Week of ", fmtLong(s.date)), s.weekWin && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-primary)",
        fontSize: 12,
        margin: "0 0 1px",
        fontStyle: "italic"
      }
    }, "⭐ " + s.weekWin), s.weekNote && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 11,
        margin: 0
      }
    }, "→ Gap: " + s.weekNote)), avgPillar && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#4ade80",
        fontFamily: "'Syne',sans-serif",
        fontSize: 18,
        fontWeight: 800,
        margin: 0
      }
    }, avgPillar), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 9,
        margin: 0
      }
    }, "avg pillar"))), Object.keys(pillarScores).length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 4,
        marginBottom: s.aiBrief ? 10 : 0
      }
    }, ["family", "faith", "fitness", "finance", "learning", "fun", "marriage"].map(p => {
      const v = pillarScores[p] || 0;
      const c = v >= 4 ? "#4ade80" : v >= 3 ? "#f4a823" : v >= 2 ? "#fb923c" : "#ef4444";
      return /*#__PURE__*/React.createElement("div", {
        key: p,
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: "100%",
          height: 24,
          background: "var(--card-bg-2)",
          borderRadius: 4,
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: "100%",
          height: v / 5 * 100 + "%",
          background: c,
          borderRadius: 4,
          transition: "height .4s"
        }
      })), /*#__PURE__*/React.createElement("p", {
        style: {
          color: "var(--text-muted)",
          fontSize: 8,
          margin: 0,
          textTransform: "uppercase"
        }
      }, p.slice(0, 3)));
    })), s.aiBrief && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "9px 11px",
        background: "rgba(167,139,250,.06)",
        border: "1px solid rgba(167,139,250,.12)",
        borderRadius: 8,
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#6b7280",
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: ".06em",
        margin: "0 0 5px",
        fontWeight: 700
      }
    }, "AI Brief (saved)"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#c4b5fd",
        fontSize: 11,
        margin: 0,
        lineHeight: 1.6
      }
    }, s.aiBrief)));
  }))), view === "insights" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "13px 15px",
      background: "rgba(167,139,250,.06)",
      border: "1px solid rgba(167,139,250,.15)",
      borderRadius: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#a78bfa",
      fontFamily: "'Syne',sans-serif",
      fontSize: 14,
      fontWeight: 800,
      margin: "0 0 5px"
    }
  }, "\uD83E\uDDE0 Pattern Intelligence"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 12,
      margin: "0 0 12px",
      lineHeight: 1.6
    }
  }, "Reads every Sunday review ever saved, your full log history, and surfaces real multi-week patterns \u2014 what's actually changing, what keeps repeating, and what you're probably not seeing yourself."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 10,
      margin: "0 0 12px"
    }
  }, "Requires ", Math.max(0, 3 - allSundays.length), " more Sunday review", allSundays.length < 2 ? "s" : "", " before meaningful patterns emerge \xB7 You have ", allSundays.length, " saved"), /*#__PURE__*/React.createElement("button", {
    onClick: generateInsight,
    disabled: insightLoading || allSundays.length === 0,
    style: {
      width: "100%",
      padding: "13px 0",
      background: insightLoading || allSundays.length === 0 ? "var(--card-bg-3)" : "rgba(167,139,250,.15)",
      border: "1px solid " + (insightLoading || allSundays.length === 0 ? "var(--card-border)" : "rgba(167,139,250,.35)"),
      color: insightLoading || allSundays.length === 0 ? "var(--text-muted)" : "#a78bfa",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 800,
      cursor: insightLoading || allSundays.length === 0 ? "default" : "pointer",
      fontFamily: "'Syne',sans-serif",
      letterSpacing: ".05em"
    }
  }, insightLoading ? "Analyzing your history..." : "ANALYZE MY PATTERNS →")), insightLoading && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px",
      background: "rgba(167,139,250,.04)",
      border: "1px solid rgba(167,139,250,.1)",
      borderRadius: 12,
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: "#a78bfa",
      animation: "pulse 1.2s ease-in-out " + i * 0.2 + "s infinite"
    }
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#a78bfa",
      fontSize: 12,
      fontWeight: 700,
      margin: "0 0 2px"
    }
  }, "Reading ", allSundays.length, " Sunday reviews + ", allLogs.length, " daily logs..."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10,
      margin: 0
    }
  }, "This takes a few seconds")), /*#__PURE__*/React.createElement("style", null, "@keyframes pulse{0%,100%{opacity:.2}50%{opacity:1}}")), insight && !insightLoading && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--card-bg)",
      border: "1px solid rgba(255,255,255,.09)",
      borderRadius: 12,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#a78bfa",
      fontFamily: "'Syne',sans-serif",
      fontSize: 12,
      fontWeight: 800,
      margin: 0,
      letterSpacing: ".06em"
    }
  }, "PATTERN ANALYSIS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 10,
      margin: 0
    }
  }, allSundays.length, " reviews \xB7 ", allLogs.length, " days"), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigator.clipboard.writeText(insight),
    style: {
      padding: "3px 9px",
      background: "var(--card-bg-3)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "var(--text-secondary)",
      borderRadius: 6,
      fontSize: 10,
      cursor: "pointer"
    }
  }, "Copy"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-primary)",
      fontSize: 13,
      margin: 0,
      lineHeight: 1.8,
      whiteSpace: "pre-wrap"
    }
  }, insight)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 16px",
      background: "rgba(255,255,255,.02)",
      borderTop: "1px solid rgba(255,255,255,.05)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: generateInsight,
    style: {
      background: "transparent",
      border: "1px solid rgba(255,255,255,.08)",
      color: "var(--text-secondary)",
      borderRadius: 6,
      padding: "4px 12px",
      fontSize: 10,
      cursor: "pointer"
    }
  }, "Regenerate")))));
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS MODAL — API key + household setup
// ─────────────────────────────────────────────────────────────────────────────
function SettingsModal({ settings, onSave, onClose }) {
  const [apiKey, setApiKey] = useState(settings.claudeApiKey || "");
  const [householdId, setHouseholdId] = useState(settings.householdId || "");
  const [joinCode, setJoinCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [migrateStatus, setMigrateStatus] = useState("");
  const [theme, setTheme] = useState(settings.theme || "dark");

  const save = async () => {
    setSaving(true);
    const updated = { ...settings, claudeApiKey: apiKey.trim(), householdId: householdId.trim(), theme };
    await DB.set(KEYS.settings(), updated);
    onSave(updated);
    setMsg("Saved.");
    setSaving(false);
    setTimeout(() => { setMsg(""); onClose(); }, 800);
  };

  const createHousehold = async () => {
    const id = Math.random().toString(36).slice(2, 8).toUpperCase();
    setMigrateStatus("Creating household and migrating your data...");
    // Migrate existing personal pantry + chores to shared household path
    try {
      const pantry = await DB.get(KEYS.pantry());
      const chores = await DB.get(KEYS.chores());
      const customMeals = await DB.get(KEYS.customMeals());
      if (window.__firebase_db) {
        const base = `households/${id}/ml`;
        if (pantry) await window.__firebase_db.ref(`${base}/food/pantry`).set(pantry);
        if (chores) await window.__firebase_db.ref(`${base}/chores`).set(chores);
        if (customMeals) await window.__firebase_db.ref(`${base}/food/custommeal`).set(customMeals);
      }
    } catch(e) { /* migration best-effort */ }
    setHouseholdId(id);
    setMigrateStatus("Done! Your household code is: " + id);
  };

  const joinHousehold = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) return;
    setHouseholdId(code);
    setMigrateStatus("Joined household " + code + ". Save to activate.");
  };

  const leaveHousehold = () => {
    setHouseholdId("");
    setJoinCode("");
    setMigrateStatus("Left household. Your data is now personal.");
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
        React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 11, margin: "0 0 12px", lineHeight: 1.5 } },
          "Link your account with " + (settings.partnerName || "your partner") + " to share Pantry, Meals, and Chores."
        ),

        householdId
          ? React.createElement("div", null,
              React.createElement("div", { style: { background: "rgba(96,165,250,.08)", border: "1px solid rgba(96,165,250,.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 10 } },
                React.createElement("p", { style: { color: "#60a5fa", fontSize: 11, margin: "0 0 2px", fontWeight: 700 } }, "Active Household"),
                React.createElement("p", { style: { color: "var(--text-primary)", fontSize: 18, fontWeight: 800, margin: 0, fontFamily: "'Syne',sans-serif", letterSpacing: ".1em" } }, householdId),
                React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 10, margin: "4px 0 0" } }, "Share this code with " + (settings.partnerName || "your partner") + " so they can join.")
              ),
              React.createElement("button", { onClick: leaveHousehold, style: { background: "none", border: "1px solid rgba(239,68,68,.3)", borderRadius: 7, color: "#ef4444", fontSize: 11, padding: "6px 14px", cursor: "pointer" } }, "Leave Household")
            )
          : React.createElement("div", null,
              React.createElement("button", { onClick: createHousehold, style: { width: "100%", background: "rgba(96,165,250,.1)", border: "1px solid rgba(96,165,250,.25)", borderRadius: 8, color: "#60a5fa", fontSize: 12, fontWeight: 700, padding: "10px", cursor: "pointer", marginBottom: 10 } }, "Create Household (you go first)"),
              React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, textAlign: "center", margin: "0 0 10px" } }, "— or —"),
              React.createElement("div", { style: { display: "flex", gap: 8 } },
                React.createElement("input", { value: joinCode, onChange: e => setJoinCode(e.target.value.toUpperCase()), placeholder: "Enter code (e.g. AB3X9K)", style: { ...inp, flex: 1 }, maxLength: 8 }),
                React.createElement("button", { onClick: joinHousehold, style: { background: "rgba(96,165,250,.1)", border: "1px solid rgba(96,165,250,.25)", borderRadius: 8, color: "#60a5fa", fontSize: 12, fontWeight: 700, padding: "0 14px", cursor: "pointer", whiteSpace: "nowrap" } }, "Join")
              )
            ),

        migrateStatus && React.createElement("p", { style: { color: "#4ade80", fontSize: 11, margin: "10px 0 0" } }, migrateStatus)
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
  if (!setupDone) return /*#__PURE__*/React.createElement(SetupInterview, {
    onComplete: s => {
      setSettings(s);
      setSetupDone(true);
      setLoading(false);
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
  }), tab === "chores" && /*#__PURE__*/React.createElement(window.TasksTab, {
    tasks: tasks,
    setTasks: setTasks,
    settings: settings,
    activeUser: activeUser
  }), tab === "pantry" && /*#__PURE__*/React.createElement(window.PantryTab, {
    pantryItems: pantryItems,
    setPantryItems: setPantryItems,
    onAddToGrocery: () => {}
  }), tab === "goals" && /*#__PURE__*/React.createElement(window.Goals, {
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
  }), tab === "reminders" && /*#__PURE__*/React.createElement(window.RemindersTab, {
    settings: settings
  }), tab === "history" && /*#__PURE__*/React.createElement(HistoryBrowser, {
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
