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
// MORNING TAB
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// HISTORY STRIP — 14-day date picker for Morning / Evening
// ─────────────────────────────────────────────────────────────────────────────
function HistoryStrip({
  selectedDate,
  onSelectDate,
  allLogs,
  accentColor
}) {
  const ac = accentColor || "#f4a823";
  const days = Array.from({
    length: 14
  }, function (_, i) {
    const d = addDays(getToday(), -i);
    const log = allLogs.find(function (l) {
      return l.date === d;
    });
    const hasData = !!(log && (log.morning || log.evening));
    return {
      date: d,
      log: log,
      hasData: hasData,
      isToday: i === 0
    };
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      overflowX: "auto",
      paddingBottom: 4
    }
  }, days.map(function (item) {
    const date = item.date,
      hasData = item.hasData,
      isToday = item.isToday;
    const sel = date === selectedDate;
    const d = new Date(date + "T12:00:00");
    const dow = d.toLocaleDateString("en-CA", {
      weekday: "short"
    }).slice(0, 1);
    const dom = d.getDate();
    return /*#__PURE__*/React.createElement("button", {
      key: date,
      onClick: function () {
        onSelectDate(sel && !isToday ? getToday() : date);
      },
      style: {
        flexShrink: 0,
        width: 38,
        padding: "6px 2px",
        borderRadius: 8,
        border: "1px solid " + (sel ? ac : hasData ? "rgba(74,222,128,.3)" : "rgba(255,255,255,.08)"),
        background: sel ? ac : hasData ? "rgba(74,222,128,.08)" : "rgba(255,255,255,.02)",
        cursor: "pointer",
        transition: "all .12s"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: sel ? "#080b11" : isToday ? "var(--text-primary)" : "var(--text-secondary)",
        fontSize: 9,
        fontWeight: 700,
        margin: "0 0 2px",
        textTransform: "uppercase"
      }
    }, isToday ? "NOW" : dow), /*#__PURE__*/React.createElement("p", {
      style: {
        color: sel ? "#080b11" : hasData ? "#4ade80" : "var(--text-secondary)",
        fontFamily: "'Syne',sans-serif",
        fontSize: 14,
        fontWeight: 800,
        margin: 0
      }
    }, dom), hasData && /*#__PURE__*/React.createElement("div", {
      style: {
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: sel ? "#080b11" : "#4ade80",
        margin: "2px auto 0"
      }
    }));
  })));
}
function MorningReadOnly({
  log,
  date
}) {
  if (!log || !log.morning) return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px 16px",
      textAlign: "center",
      background: "rgba(255,255,255,.02)",
      border: "1px solid rgba(255,255,255,.06)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 13,
      margin: 0
    }
  }, "Nothing logged for ", fmtLong(date)));
  const m = log.morning;
  const fields = [];
  if (m.weight) fields.push({
    label: "Weight",
    value: m.weight + " lbs",
    c: "#f4a823"
  });
  if (m.wakeTime) fields.push({
    label: "Wake Time",
    value: m.wakeTime,
    c: "#a78bfa"
  });
  if (m.sleep) fields.push({
    label: "Sleep Quality",
    value: m.sleep + "/5",
    c: "#a78bfa"
  });
  if (m.energy) fields.push({
    label: "Energy",
    value: m.energy + "/5",
    c: "#60a5fa"
  });
  if (m.readiness) fields.push({
    label: "Readiness",
    value: m.readiness + "/5",
    c: "#4ade80"
  });
  if (m.mood) fields.push({
    label: "Mood",
    value: m.mood + "/5",
    c: "#f472b6"
  });
  if (m.hunger) fields.push({
    label: "Hunger",
    value: m.hunger + "/5",
    c: "#fb923c"
  });
  if (m.steps) fields.push({
    label: "Steps",
    value: parseInt(m.steps).toLocaleString(),
    c: "#34d399"
  });
  if (m.glasses) fields.push({
    label: "Water",
    value: m.glasses + "/8 glasses",
    c: "#60a5fa"
  });
  if (typeof m.mobilityCount !== "undefined") fields.push({
    label: "Mobility",
    value: m.mobilityCount + "/10",
    c: "#fb923c"
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, m.exceptionalDay && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 12px",
      background: "rgba(167,139,250,.08)",
      border: "1px solid rgba(167,139,250,.2)",
      borderRadius: 9
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#a78bfa",
      fontSize: 11,
      fontWeight: 700,
      margin: 0
    }
  }, "⚡ Exceptional day" + (m.exceptionalReason ? " — " + m.exceptionalReason : ""))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, fields.map(function (f) {
    return /*#__PURE__*/React.createElement("div", {
      key: f.label,
      style: {
        padding: "8px 11px",
        background: "var(--card-bg-3)",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 8,
        minWidth: 90
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: ".06em",
        margin: "0 0 2px"
      }
    }, f.label), /*#__PURE__*/React.createElement("p", {
      style: {
        color: f.c,
        fontSize: 14,
        fontWeight: 700,
        margin: 0,
        fontFamily: "'Syne',sans-serif"
      }
    }, f.value));
  })), m.intention && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Intention"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-primary)",
        fontSize: 13,
        margin: 0
      }
    }, m.intention))
  }), m.gratitude && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Gratitude"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-primary)",
        fontSize: 13,
        margin: 0,
        lineHeight: 1.6
      }
    }, m.gratitude))
  }));
}
function EveningReadOnly({
  log,
  date
}) {
  if (!log || !log.evening) return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px 16px",
      textAlign: "center",
      background: "rgba(255,255,255,.02)",
      border: "1px solid rgba(255,255,255,.06)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 13,
      margin: 0
    }
  }, "Nothing logged for ", fmtLong(date)));
  const e = log.evening;
  const snackLabels = ["None", "Light", "Moderate", "Heavy"];
  const snackColors = ["#4ade80", "#facc15", "#fb923c", "#ef4444"];
  const fields = [];
  if (e.cardio) fields.push({
    label: "Cardio",
    value: "✓ Done",
    c: "#4ade80"
  });
  if (e.strength) fields.push({
    label: "Strength",
    value: "✓ Done",
    c: "#4ade80"
  });
  if (typeof e.snack === "number") fields.push({
    label: "Snacking",
    value: snackLabels[e.snack] || "",
    c: snackColors[e.snack] || "#555"
  });
  if (e.foodQuality) fields.push({
    label: "Food Quality",
    value: e.foodQuality + "/5",
    c: "#fb923c"
  });
  if (e.financeWin) fields.push({
    label: "Finance Win",
    value: "✓ Yes",
    c: "#34d399"
  });
  if (e.eveningMood) fields.push({
    label: "Mood",
    value: e.eveningMood + "/5",
    c: "#a78bfa"
  });
  if (e.dayRating) fields.push({
    label: "Day Rating",
    value: e.dayRating + "/5",
    c: "#f4a823"
  });
  if (e.bedtime) fields.push({
    label: "Bedtime",
    value: e.bedtime,
    c: "#a78bfa"
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, e.exceptionalDay && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 12px",
      background: "rgba(167,139,250,.08)",
      border: "1px solid rgba(167,139,250,.2)",
      borderRadius: 9
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#a78bfa",
      fontSize: 11,
      fontWeight: 700,
      margin: 0
    }
  }, "\u26A1 Exceptional day")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, fields.map(function (f) {
    return /*#__PURE__*/React.createElement("div", {
      key: f.label,
      style: {
        padding: "8px 11px",
        background: "var(--card-bg-3)",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 8,
        minWidth: 90
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: ".06em",
        margin: "0 0 2px"
      }
    }, f.label), /*#__PURE__*/React.createElement("p", {
      style: {
        color: f.c,
        fontSize: 14,
        fontWeight: 700,
        margin: 0,
        fontFamily: "'Syne',sans-serif"
      }
    }, f.value));
  })), e.win && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Win of the Day"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-primary)",
        fontSize: 13,
        margin: 0
      }
    }, e.win))
  }), e.familyMoment && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Family Moment"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-primary)",
        fontSize: 13,
        margin: 0
      }
    }, e.familyMoment))
  }), e.financeNote && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Finance Note"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-primary)",
        fontSize: 13,
        margin: 0
      }
    }, e.financeNote))
  }), e.moodNote && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Mood Note"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-primary)",
        fontSize: 13,
        margin: 0
      }
    }, e.moodNote))
  }));
}
function Morning({
  todayLog,
  onSave,
  settings,
  onMilestone,
  allLogs,
  initialDate,
  onInitialDateConsumed
}) {
  const allLogsArr = allLogs || [];
  const [histDate, setHistDate] = useState(initialDate || getToday());
  const [view, setView] = useState(initialDate && initialDate !== getToday() ? "history" : "log"); // "log" | "history"
  const [histLog, setHistLog] = useState(null);
  const isHistory = view === "history";
  const ex = isHistory ? histLog && histLog.morning || {} : todayLog?.morning || {};
  const [wt, setWt] = useState(ex.weight || "");
  const [wake, setWake] = useState(ex.wakeTime || "");
  const [sl, setSl] = useState(ex.sleep || 0);
  const [en, setEn] = useState(ex.energy || 0);
  const [hu, setHu] = useState(ex.hunger || 0);
  const [ready, setReady] = useState(ex.readiness || 0);
  const [steps, setSteps] = useState(ex.steps || "");
  const [mood, setMood] = useState(ex.mood || 0);
  const [gr, setGr] = useState(ex.gratitude || "");
  const [it, setIt] = useState(ex.intention || "");
  const [mobility, setMobility] = useState(ex.mobilityChecked || {});
  const [isExceptional, setIsExceptional] = useState(ex.exceptionalDay || false);
  const [exceptionalReason, setExceptionalReason] = useState(ex.exceptionalReason || "");
  const [backfill, setBackfill] = useState(false);
  const [backfillDate, setBackfillDate] = useState(getPrevDay());
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [mobilityPool, setMobilityPool] = useState(ALL_EXERCISES);
  const [weekPlan, setWeekPlan] = useState(null);
  const [mobLoading, setMobLoading] = useState(true);
  const [showPoolManager, setShowPoolManager] = useState(false);
  const [poolForm, setPoolForm] = useState({ name: "", zone: "full", reps: "", tip: "" });

  // Load pool + generate/fetch weekly plan
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setMobLoading(true);
      const poolData = await DB.get(KEYS.mobilityPool());
      const pool = Array.isArray(poolData) && poolData.length ? poolData : ALL_EXERCISES;
      const monday = getMondayOfWeek(getToday());
      let plan = await DB.get(KEYS.mobilityWeek(monday));
      if (!plan || !plan.mon || !plan.mon.length) {
        plan = generateWeeklyPlan(pool, monday);
        await DB.set(KEYS.mobilityWeek(monday), plan);
      }
      if (!cancelled) { setMobilityPool(pool); setWeekPlan(plan); setMobLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Load history log when view or selected date changes
  useEffect(() => {
    if (view === "history") {
      DB.get(KEYS.log(histDate)).then(l => setHistLog(l || null));
    }
  }, [view, histDate]);

  // Reset form fields when history log loads so we edit the selected day
  useEffect(() => {
    if (view !== "history") return;
    const m = (histLog && histLog.morning) || {};
    setWt(m.weight || "");
    setWake(m.wakeTime || "");
    setSl(m.sleep || 0);
    setEn(m.energy || 0);
    setHu(m.hunger || 0);
    setReady(m.readiness || 0);
    setSteps(m.steps || "");
    setMood(m.mood || 0);
    setGr(m.gratitude || "");
    setIt(m.intention || "");
    setMobility(m.mobilityChecked || {});
    setIsExceptional(m.exceptionalDay || false);
    setExceptionalReason(m.exceptionalReason || "");
    setOk(false);
  }, [histLog]);

  const handleAddPoolExercise = async () => {
    if (!poolForm.name.trim()) return;
    const newEx = { id: "custom_" + Date.now(), name: poolForm.name.trim(), zone: poolForm.zone, reps: poolForm.reps.trim() || "10 reps", tip: poolForm.tip.trim() || "" };
    const updated = [...mobilityPool, newEx];
    setMobilityPool(updated);
    await DB.set(KEYS.mobilityPool(), updated);
    setPoolForm({ name: "", zone: "full", reps: "", tip: "" });
  };

  const handleDeletePoolExercise = async (id) => {
    const updated = mobilityPool.filter(e => e.id !== id);
    setMobilityPool(updated);
    await DB.set(KEYS.mobilityPool(), updated);
  };

  const handleResetPool = async () => {
    setMobilityPool(ALL_EXERCISES);
    await DB.set(KEYS.mobilityPool(), ALL_EXERCISES);
    // Regenerate this week's plan with the reset pool
    const monday = getMondayOfWeek(getToday());
    const plan = generateWeeklyPlan(ALL_EXERCISES, monday);
    setWeekPlan(plan);
    await DB.set(KEYS.mobilityWeek(monday), plan);
  };

  // Today's exercise objects from the week plan
  const todayDayKey = getDayKey(getToday());
  const todayIds = weekPlan?.[todayDayKey] || [];
  const dailyList = todayIds.map(id => mobilityPool.find(e => e.id === id)).filter(Boolean);
  const mobDone = dailyList.filter(e => mobility[e.id]).length;
  const gap = wt ? (parseFloat(wt) - (settings?.weightGoal || 180)).toFixed(1) : null;
  const stepGoal = settings?.stepGoal || 10000;
  const stepPct = steps ? Math.min(100, Math.round(parseInt(steps) / stepGoal * 100)) : 0;

  // Auto-calc sleep duration
  const sleepDuration = (() => {
    const lastBed = todayLog?.evening?.bedtime;
    if (!wake || !lastBed) return null;
    const [bh, bm] = lastBed.split(":").map(Number);
    const [wh, wm] = wake.split(":").map(Number);
    let mins = wh * 60 + wm - (bh * 60 + bm);
    if (mins < 0) mins += 1440;
    const h = Math.floor(mins / 60),
      m = mins % 60;
    return `${h}h ${m > 0 ? m + "m" : ""}`;
  })();
  const data = {
    weight: parseFloat(wt) || null,
    wakeTime: wake,
    sleep: sl,
    energy: en,
    hunger: hu,
    readiness: ready,
    steps: parseInt(steps) || 0,
    mood,
    gratitude: gr,
    intention: it,
    mobilityChecked: mobility,
    mobilityCount: mobDone,
    exceptionalDay: isExceptional,
    exceptionalReason
  };
  useAutoSave(backfill || isHistory ? null : KEYS.log(getToday()), {
    morning: data
  }, !busy && !isHistory);
  const go = async () => {
    setBusy(true);
    const date = backfill ? backfillDate : isHistory ? histDate : getToday();
    const existing = (await DB.get(KEYS.log(date))) || {};
    await DB.set(KEYS.log(date), {
      ...existing,
      morning: data
    });
    setBusy(false);
    setOk(true);
    onSave && onSave(); // refresh allLogs so History/Calendar update
    // Check milestones (only for today's log)
    const stepGoalHit = parseInt(steps) >= stepGoal;
    if (stepGoalHit && onMilestone && !isHistory) onMilestone(`${parseInt(steps).toLocaleString()} steps — goal hit! 💪`);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    label: "Morning Check-in",
    color: "#f4a823"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#404755",
      fontSize: 12,
      margin: "0 0 0 13px"
    }
  }, fmtMid(getToday()))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      borderRadius: 8,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,.09)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("log"),
    style: {
      padding: "6px 12px",
      border: "none",
      background: view === "log" ? "rgba(244,168,35,.15)" : "transparent",
      color: view === "log" ? "#f4a823" : "var(--text-secondary)",
      fontWeight: view === "log" ? 700 : 400,
      fontSize: 11,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "TODAY"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("history"),
    style: {
      padding: "6px 12px",
      border: "none",
      background: view === "history" ? "rgba(96,165,250,.15)" : "transparent",
      color: view === "history" ? "#60a5fa" : "var(--text-secondary)",
      fontWeight: view === "history" ? 700 : 400,
      fontSize: 11,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "HISTORY"))), view === "history" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(HistoryStrip, {
    selectedDate: histDate,
    onSelectDate: d => {
      setHistDate(d);
      setHistLog(null);
    },
    allLogs: allLogsArr,
    accentColor: "#f4a823"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "9px 13px",
      background: "rgba(244,168,35,.06)",
      border: "1px solid rgba(244,168,35,.15)",
      borderRadius: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontSize: 11,
      fontWeight: 700,
      margin: 0
    }
  }, "\u270f\ufe0f Editing " + fmtLong(histDate)))), ok && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#4ade80",
        margin: 0,
        fontSize: 13
      }
    }, "\u2713 Morning logged \u2014 stay intentional today."),
    s: {
      borderColor: "rgba(74,222,128,.25)",
      background: "rgba(74,222,128,.06)",
      marginBottom: 16
    }
  }), view === "log" && todayLog?.morning && !ok && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 13px",
      background: "rgba(244,168,35,.06)",
      border: "1px solid rgba(244,168,35,.15)",
      borderRadius: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontSize: 11,
      fontWeight: 700,
      margin: "0 0 2px"
    }
  }, "\u2713 Today already logged"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10,
      margin: 0
    }
  }, "Updates will overwrite. Scroll down to re-submit.")), (view === "log" || isHistory) && /*#__PURE__*/React.createElement(React.Fragment, null, view === "log" && new Date().getHours() >= 10 && !todayLog?.morning && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      padding: "10px 13px",
      background: "rgba(167,139,250,.06)",
      border: "1px solid rgba(167,139,250,.15)",
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#a78bfa",
      fontSize: 11,
      fontWeight: 700,
      margin: 0
    }
  }, "Did you miss yesterday?"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setBackfill(!backfill),
    style: {
      padding: "4px 10px",
      background: backfill ? "rgba(167,139,250,.2)" : "transparent",
      border: "1px solid rgba(167,139,250,.3)",
      color: "#a78bfa",
      borderRadius: 6,
      fontSize: 10,
      cursor: "pointer",
      fontWeight: 700
    }
  }, backfill ? "Cancel" : "Log Yesterday")), backfill && /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: backfillDate,
    onChange: e => setBackfillDate(e.target.value),
    style: {
      ...inp,
      marginTop: 8,
      fontSize: 13,
      colorScheme: "dark"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 13
    }
  }, /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Weight (lbs)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: wt,
      onChange: e => setWt(e.target.value),
      placeholder: String(settings?.weightStart || 210),
      style: {
        ...inp,
        width: 88
      }
    }), gap !== null && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#f4a823",
        fontWeight: 800,
        fontSize: 20,
        margin: 0,
        fontFamily: "'Syne',sans-serif"
      }
    }, parseFloat(gap) > 0 ? "+" : "", gap, " lbs"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#404755",
        fontSize: 10,
        margin: 0
      }
    }, "from ", settings?.weightGoal || 180, " lb goal"))))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Wake-up Time"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "time",
      value: wake,
      onChange: e => setWake(e.target.value),
      style: {
        ...inp,
        width: 130,
        colorScheme: "dark"
      }
    }), sleepDuration && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "6px 12px",
        background: "rgba(167,139,250,.1)",
        borderRadius: 8
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#a78bfa",
        fontSize: 13,
        fontWeight: 700,
        margin: 0
      }
    }, sleepDuration), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 10,
        margin: 0
      }
    }, "slept"))))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Sleep Quality"
    }), /*#__PURE__*/React.createElement(Dots, {
      val: sl,
      set: setSl,
      col: "#a78bfa"
    }))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Morning Energy (physical)"
    }), /*#__PURE__*/React.createElement(Dots, {
      val: en,
      set: setEn,
      col: "#60a5fa"
    }))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Hunger Level"
    }), /*#__PURE__*/React.createElement(Dots, {
      val: hu,
      set: setHu,
      col: "#fb923c"
    }))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Recovery / Readiness"
    }), /*#__PURE__*/React.createElement(Dots, {
      val: ready,
      set: setReady,
      col: "#4ade80"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 10,
        margin: "6px 0 0"
      }
    }, "Used in Train to flag low-recovery days"))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: `Yesterday's Steps (goal: ${stepGoal.toLocaleString()})`
    }), /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: steps,
      onChange: e => setSteps(e.target.value),
      placeholder: "e.g. 8432",
      style: {
        ...inp,
        width: 150,
        marginBottom: 8
      }
    }), steps && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ProgBar, {
      pct: stepPct,
      col: stepPct >= 100 ? "#4ade80" : "#60a5fa",
      h: 6
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: stepPct >= 100 ? "#4ade80" : "var(--text-secondary)",
        fontSize: 11,
        margin: "5px 0 0",
        fontWeight: stepPct >= 100 ? 700 : 400
      }
    }, stepPct >= 100 ? "Goal hit! ✓" : `${stepPct}% of goal`)), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 10,
        margin: "6px 0 0"
      }
    }, "Samsung Health sync available in Phase 2 (native app)"))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Mindset / Mood (emotional)"
    }), /*#__PURE__*/React.createElement(Dots, {
      val: mood,
      set: setMood,
      col: "#f472b6"
    }))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Gratitude \u2014 one thing"
    }), /*#__PURE__*/React.createElement("textarea", {
      value: gr,
      onChange: e => setGr(e.target.value),
      placeholder: "What are you grateful for today?",
      style: {
        ...inp,
        resize: "none",
        minHeight: 72,
        lineHeight: 1.6
      },
      maxLength: 200
    }))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Today's Intention"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: it,
      onChange: e => setIt(e.target.value),
      placeholder: "focused \xB7 present \xB7 strong...",
      style: inp,
      maxLength: 40
    }))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Exceptional Day?"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 11,
        margin: "0 0 8px",
        lineHeight: 1.5
      }
    }, "Sick, travelling, or outside normal circumstances? Flag it to protect your averages."), /*#__PURE__*/React.createElement(YN, {
      val: isExceptional,
      set: setIsExceptional
    }), isExceptional && /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: exceptionalReason,
      onChange: e => setExceptionalReason(e.target.value),
      placeholder: "Reason (optional)...",
      style: {
        ...inp,
        marginTop: 10,
        fontSize: 13
      }
    }))
  }),

  /*#__PURE__*/React.createElement("button", {
    onClick: go,
    disabled: busy,
    style: {
      background: busy ? "rgba(244,168,35,.45)" : "#f4a823",
      color: "#080b11",
      border: "none",
      borderRadius: 10,
      padding: "14px 0",
      fontSize: 15,
      fontWeight: 800,
      cursor: busy ? "wait" : "pointer",
      width: "100%",
      fontFamily: "'Syne',sans-serif",
      letterSpacing: ".05em"
    }
  }, busy ? "SAVING..." : isHistory ? "SAVE CHANGES \u2192" : "LOG MORNING \u2192"))));
}

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH SCORECARD — calorie in vs out banner shown at top of all Health tabs
// ─────────────────────────────────────────────────────────────────────────────
function HealthScorecard({ todayLog, todayMealLog, macroTargets }) {
  const [trainHistory, setTrainHistory] = useState([]);
  useEffect(() => {
    DB.get(KEYS.trainHistory()).then(h => setTrainHistory(Array.isArray(h) ? h : []));
  }, []);

  // Calories IN — from today's meal log
  const slots = ["breakfast", "lunch", "dinner"];
  let calIn = 0;
  if (todayMealLog) {
    slots.forEach(s => { if (todayMealLog[s]) calIn += todayMealLog[s].calories || 0; });
    (todayMealLog.snacks || []).forEach(s => { calIn += s.calories || 0; });
  }

  // Calories BURNED — today's train sessions (walk has explicit calories; strength/cardio use estimates)
  const today = getToday();
  const todaySessions = trainHistory.filter(s => s.date === today);
  const calBurned = todaySessions.reduce((sum, s) => {
    if (s.calories) return sum + s.calories;
    if (s.type === "strength") return sum + 280; // avg 45-min strength session
    if (s.type === "cardio") return sum + 350;   // avg cardio session
    return sum;
  }, 0);

  // BMR estimate from morning weight if available (rough 2000 baseline)
  const bmr = macroTargets?.calories || 2000;
  const tdee = bmr + calBurned;
  const net = calIn - tdee;
  const isDeficit = net <= 0;

  // Only show if there's some data to display
  if (calIn === 0 && calBurned === 0) return null;

  const pct = tdee > 0 ? Math.min(100, Math.round(calIn / tdee * 100)) : 0;
  const barColor = isDeficit ? "#4ade80" : "#ef4444";

  return /*#__PURE__*/React.createElement("div", {
    style: { background: isDeficit ? "rgba(74,222,128,.07)" : "rgba(239,68,68,.07)", border: `1px solid ${isDeficit ? "rgba(74,222,128,.2)" : "rgba(239,68,68,.2)"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 16 }
  },
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
      /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: barColor, letterSpacing: ".07em", margin: 0 } }, "TODAY'S CALORIE BALANCE"),
      /*#__PURE__*/React.createElement("p", { style: { fontSize: 13, fontWeight: 800, color: barColor, margin: 0 } }, (isDeficit ? "" : "+") + net.toFixed(0) + " kcal")
    ),
    /*#__PURE__*/React.createElement("div", { style: { height: 7, background: "rgba(255,255,255,.07)", borderRadius: 4, overflow: "hidden", marginBottom: 8 } },
      /*#__PURE__*/React.createElement("div", { style: { width: pct + "%", height: "100%", background: barColor, borderRadius: 4, transition: "width .3s" } })
    ),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between" } },
      /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)" } },
        "\uD83C\uDF7D " + (calIn > 0 ? calIn + " kcal in" : "No meals logged")
      ),
      /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)" } },
        "\uD83D\uDD25 " + tdee + " kcal out" + (calBurned > 0 ? " (" + calBurned + " exercise)" : " (BMR only)")
      )
    )
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILITY TAB — standalone tab for Health section
// ─────────────────────────────────────────────────────────────────────────────
function MobilityTab({ todayLog, onSave }) {
  const [mobility, setMobilityState] = useState({});
  const [mobilityPool, setMobilityPool] = useState(ALL_EXERCISES);
  const [weekPlan, setWeekPlan] = useState(null);
  const [mobLoading, setMobLoading] = useState(true);
  const [showPoolManager, setShowPoolManager] = useState(false);
  const [poolForm, setPoolForm] = useState({ name: "", zone: "full", reps: "", tip: "" });

  useEffect(() => {
    const load = async () => {
      setMobLoading(true);
      const poolData = await DB.get(KEYS.mobilityPool());
      const pool = Array.isArray(poolData) && poolData.length ? poolData : ALL_EXERCISES;
      const monday = getMondayOfWeek(getToday());
      let plan = await DB.get(KEYS.mobilityWeek(monday));
      if (!plan) { plan = generateWeeklyPlan(pool, monday); await DB.set(KEYS.mobilityWeek(monday), plan); }
      const logData = await DB.get(KEYS.log(getToday()));
      setMobilityState(logData?.morning?.mobilityChecked || {});
      setMobilityPool(pool);
      setWeekPlan(plan);
      setMobLoading(false);
    };
    load();
  }, []);

  // Keep a ref to the latest todayLog so setMobility never needs a DB.get round-trip
  const todayLogRef = useRef(todayLog);
  useEffect(() => { todayLogRef.current = todayLog; }, [todayLog]);

  const setMobility = async (updated) => {
    const checked = typeof updated === "function" ? updated(mobility) : updated;
    setMobilityState(checked);
    const todayDayKey = getDayKey(getToday());
    const todayIds = weekPlan?.[todayDayKey] || [];
    const dailyList = todayIds.map(id => mobilityPool.find(e => e.id === id)).filter(Boolean);
    const mobDone = dailyList.filter(e => checked[e.id]).length;
    // Use the ref instead of DB.get — no round-trip, instant save
    const existing = todayLogRef.current || {};
    await DB.set(KEYS.log(getToday()), { ...existing, morning: { ...(existing.morning || {}), mobilityChecked: checked, mobilityCount: mobDone } });
    onSave && onSave(checked, mobDone);
  };

  const handleAddPoolExercise = async () => {
    if (!poolForm.name.trim()) return;
    const newEx = { id: "custom_" + Date.now(), name: poolForm.name.trim(), zone: poolForm.zone, reps: poolForm.reps.trim() || "10 reps", tip: poolForm.tip.trim() || "" };
    const updated = [...mobilityPool, newEx];
    setMobilityPool(updated);
    await DB.set(KEYS.mobilityPool(), updated);
    setPoolForm({ name: "", zone: "full", reps: "", tip: "" });
  };

  const handleDeletePoolExercise = async (id) => {
    const updated = mobilityPool.filter(e => e.id !== id);
    setMobilityPool(updated);
    await DB.set(KEYS.mobilityPool(), updated);
  };

  const handleResetPool = async () => {
    setMobilityPool(ALL_EXERCISES);
    await DB.set(KEYS.mobilityPool(), ALL_EXERCISES);
    const monday = getMondayOfWeek(getToday());
    const plan = generateWeeklyPlan(ALL_EXERCISES, monday);
    setWeekPlan(plan);
    await DB.set(KEYS.mobilityWeek(monday), plan);
  };

  const todayDayKey = getDayKey(getToday());
  const todayIds = weekPlan?.[todayDayKey] || [];
  const dailyList = todayIds.map(id => mobilityPool.find(e => e.id === id)).filter(Boolean);
  const mobDone = dailyList.filter(e => mobility[e.id]).length;

  return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement(SectionHead, { label: "Mobility", color: "#a78bfa" }),
    /*#__PURE__*/React.createElement("p", { style: { fontSize: 12, color: "var(--text-muted)", margin: "0 0 16px 13px" } }, fmtMid(getToday()) + " \xB7 " + mobDone + "/10 done"),
    /*#__PURE__*/React.createElement(Card, {
      ch: mobLoading
        ? /*#__PURE__*/React.createElement("div", { style: { padding: "16px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 12 } }, "Loading mobility plan\u2026")
        : /*#__PURE__*/React.createElement(MobilityChecklist, { checked: mobility, setChecked: setMobility, dailyList: dailyList, onManagePool: () => setShowPoolManager(true) })
    }),
    // Pool Manager Modal
    showPoolManager && /*#__PURE__*/React.createElement(React.Fragment, null,
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 300 }, onClick: () => setShowPoolManager(false) }),
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "#080b11", zIndex: 301, display: "flex", flexDirection: "column" } },
        /*#__PURE__*/React.createElement("div", { style: { padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 } },
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: "#a78bfa", margin: 0 } }, "MOBILITY POOL"),
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" } }, mobilityPool.length + " exercises \xB7 " + Math.ceil(mobilityPool.length / 7) + "x coverage/week")
          ),
          /*#__PURE__*/React.createElement("button", { onClick: () => setShowPoolManager(false), style: { background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 22, cursor: "pointer", lineHeight: 1 } }, "\xD7")
        ),
        /*#__PURE__*/React.createElement("div", { style: { padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(167,139,250,.04)", flexShrink: 0 } },
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "#a78bfa", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 8px" } }, "ADD EXERCISE"),
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
            /*#__PURE__*/React.createElement("input", { placeholder: "Exercise name *", value: poolForm.name, onChange: e => setPoolForm(f => ({ ...f, name: e.target.value })), onKeyDown: e => e.key === "Enter" && handleAddPoolExercise(), style: { flex: "2 1 140px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "7px 10px", color: "var(--text-primary)", fontSize: 12, outline: "none" } }),
            /*#__PURE__*/React.createElement("select", { value: poolForm.zone, onChange: e => setPoolForm(f => ({ ...f, zone: e.target.value })), style: { flex: "1 1 90px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "7px 6px", color: "var(--text-primary)", fontSize: 12, outline: "none" } },
              Object.keys(ZONE_COLORS).map(z => /*#__PURE__*/React.createElement("option", { key: z, value: z }, z.charAt(0).toUpperCase() + z.slice(1)))
            ),
            /*#__PURE__*/React.createElement("input", { placeholder: "Reps/time", value: poolForm.reps, onChange: e => setPoolForm(f => ({ ...f, reps: e.target.value })), style: { flex: "1 1 110px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "7px 10px", color: "var(--text-primary)", fontSize: 12, outline: "none" } }),
            /*#__PURE__*/React.createElement("input", { placeholder: "Tip (optional)", value: poolForm.tip, onChange: e => setPoolForm(f => ({ ...f, tip: e.target.value })), style: { flex: "2 1 140px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "7px 10px", color: "var(--text-primary)", fontSize: 12, outline: "none" } }),
            /*#__PURE__*/React.createElement("button", { onClick: handleAddPoolExercise, style: { padding: "7px 16px", background: "#a78bfa", border: "none", borderRadius: 7, color: "#080b11", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "+ ADD")
          )
        ),
        /*#__PURE__*/React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "0 0 60px" } },
          mobilityPool.map(ex => {
            const zc = ZONE_COLORS[ex.zone] || "#555";
            return /*#__PURE__*/React.createElement("div", { key: ex.id, style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,.04)" } },
              /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 7 } },
                  /*#__PURE__*/React.createElement("p", { style: { fontSize: 13, color: "var(--text-primary)", margin: 0, fontWeight: 500 } }, ex.name),
                  /*#__PURE__*/React.createElement("span", { style: { fontSize: 9, fontWeight: 700, background: zc + "22", color: zc, borderRadius: 4, padding: "1px 5px", letterSpacing: ".04em", textTransform: "uppercase" } }, ex.zone)
                ),
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: "2px 0 0" } }, ex.reps + (ex.tip ? " \xB7 " + ex.tip : ""))
              ),
              /*#__PURE__*/React.createElement("button", { onClick: () => handleDeletePoolExercise(ex.id), style: { background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 18, cursor: "pointer", padding: "0 4px", flexShrink: 0 } }, "\xD7")
            );
          })
        ),
        /*#__PURE__*/React.createElement("div", { style: { padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,.06)", flexShrink: 0 } },
          /*#__PURE__*/React.createElement("button", { onClick: () => { if (window.confirm("Reset to 50 default exercises?")) handleResetPool(); }, style: { background: "transparent", border: "1px solid rgba(239,68,68,.3)", borderRadius: 8, padding: "8px 16px", color: "#ef4444", fontSize: 11, cursor: "pointer" } }, "Reset to defaults (50 exercises)")
        )
      )
    )
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRAIN TAB — Strength, Cardio, Outdoor Walk, History
// ─────────────────────────────────────────────────────────────────────────────
const EPOCH = new Date("2026-01-05");
const STRENGTH_PAIRS = [{
  id: "chest_tri",
  name: "Chest + Triceps",
  color: "#60a5fa"
}, {
  id: "back_bi",
  name: "Back + Biceps",
  color: "#a78bfa"
}, {
  id: "legs_glutes",
  name: "Legs + Glutes",
  color: "#f4a823"
}, {
  id: "shoulders_core",
  name: "Shoulders + Core",
  color: "#4ade80"
}, {
  id: "push_pull",
  name: "Chest + Back",
  color: "#fb923c"
}, {
  id: "arms_core",
  name: "Arms + Core",
  color: "#f472b6"
}];
const STRENGTH_POOL = window.STRENGTH_POOL;
const EQUIP_COLORS = window.EQUIP_COLORS;
function getTodaySchedule(date) {
  const d = new Date(date + "T12:00:00"),
    dow = d.getDay();
  const ds = Math.floor((d - EPOCH) / 86400000);
  const wn = Math.floor(Math.max(0, ds) / 7);
  if (dow === 0) return {
    type: "rest"
  };
  if ([1, 3, 5].includes(dow)) {
    const sow = dow === 1 ? 0 : dow === 3 ? 1 : 2;
    const pi = (wn * 3 + sow) % 6;
    return {
      type: "strength",
      pair: STRENGTH_PAIRS[pi]
    };
  }
  if ([2, 4, 6].includes(dow)) {
    const sow = dow === 2 ? 0 : dow === 4 ? 1 : 2;
    const isInt = (wn + sow) % 2 === 0;
    const isRower = wn % 2 === 0;
    return {
      type: "cardio",
      format: isInt ? isRower ? "rower_intervals" : "walk_intervals" : isRower ? "rower_steady" : "outdoor_walk"
    };
  }
  return {
    type: "rest"
  };
}
const CARDIO_SESSIONS = window.CARDIO_SESSIONS;
function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  const rand = () => {
    s = s * 1664525 + 1013904223 & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function IntervalTimer({
  blocks,
  onComplete
}) {
  const [bi, setBi] = useState(0);
  const [secs, setSecs] = useState(blocks[0]?.duration || 0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setSecs(s => {
        if (s <= 1) {
          clearInterval(ref.current);
          const next = bi + 1;
          if (next >= blocks.length) {
            setDone(true);
            setRunning(false);
            onComplete && onComplete();
            return 0;
          }
          setBi(next);
          setSecs(blocks[next].duration);
          setRunning(true);
          return blocks[next].duration;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running, bi]);
  const block = blocks[bi] || {},
    pct = block.duration ? Math.round((block.duration - secs) / block.duration * 100) : 0,
    mins = Math.floor(secs / 60),
    rem = secs % 60;
  if (done) return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "24px 0"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontFamily: "'Syne',sans-serif",
      fontSize: 22,
      fontWeight: 800,
      margin: "0 0 4px"
    }
  }, "SESSION DONE \u2713"));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 140,
      height: 140,
      margin: "0 auto 16px"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 140,
    height: 140
  }, /*#__PURE__*/React.createElement("circle", {
    cx: 70,
    cy: 70,
    r: 60,
    fill: "none",
    stroke: "var(--card-bg-2)",
    strokeWidth: 8
  }), /*#__PURE__*/React.createElement("circle", {
    cx: 70,
    cy: 70,
    r: 60,
    fill: "none",
    stroke: block.color || "#60a5fa",
    strokeWidth: 8,
    strokeLinecap: "round",
    strokeDasharray: `${2 * Math.PI * 60 * pct / 100} ${2 * Math.PI * 60}`,
    style: {
      transform: "rotate(-90deg)",
      transformOrigin: "70px 70px",
      transition: "stroke-dasharray .9s linear"
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: 70,
    y: 62,
    textAnchor: "middle",
    fill: block.color || "#60a5fa",
    fontSize: 28,
    fontWeight: 800,
    fontFamily: "'Syne',sans-serif"
  }, String(mins).padStart(2, "0"), ":", String(rem).padStart(2, "0")), /*#__PURE__*/React.createElement("text", {
    x: 70,
    y: 82,
    textAnchor: "middle",
    fill: "var(--text-secondary)",
    fontSize: 11
  }, block.label || ""))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#9ca3af",
      fontSize: 12,
      margin: "0 0 4px"
    }
  }, "Block ", bi + 1, "/", blocks.length), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-primary)",
      fontSize: 14,
      fontWeight: 600,
      margin: "0 0 16px"
    }
  }, block.instruction || ""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setRunning(r => !r),
    style: {
      padding: "12px 28px",
      background: running ? "rgba(239,68,68,.15)" : "rgba(96,165,250,.15)",
      border: `1px solid ${running ? "rgba(239,68,68,.3)" : "rgba(96,165,250,.3)"}`,
      color: running ? "#ef4444" : "#60a5fa",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, running ? "PAUSE" : "START"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const next = bi + 1;
      if (next >= blocks.length) {
        setDone(true);
        setRunning(false);
      } else {
        setBi(next);
        setSecs(blocks[next].duration);
        setRunning(false);
      }
    },
    style: {
      padding: "12px 16px",
      background: "var(--card-bg-3)",
      border: "1px solid rgba(255,255,255,.08)",
      color: "var(--text-secondary)",
      borderRadius: 10,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Skip \u2192")));
}

// Outdoor Walk with Leaflet map
function OutdoorWalk({
  onDone
}) {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const pointsRef = useRef([]);
  const [dist, setDist] = useState(0);
  const [time, setTime] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const haversine = (a, b) => {
    const R = 6371,
      dLat = (b.lat - a.lat) * Math.PI / 180,
      dLon = (b.lng - a.lng) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180,
      lat2 = b.lat * Math.PI / 180;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };
  useEffect(() => {
    if (mapReady || !mapRef.current) return;
    const loadLeaflet = async () => {
      if (!window.L) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(link);
        await new Promise(res => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
          s.onload = res;
          document.head.appendChild(s);
        });
      }
      const L = window.L;
      const map = L.map(mapRef.current, {
        zoomControl: true
      }).setView([43.5448, -80.2482], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19
      }).addTo(map);
      polylineRef.current = L.polyline([], {
        color: "#60a5fa",
        weight: 4,
        opacity: 0.85
      }).addTo(map);
      leafletRef.current = map;
      map.on("click", e => {
        const pts = [...pointsRef.current, e.latlng];
        pointsRef.current = pts;
        const icon = L.divIcon({
          html: `<div style="width:${pts.length === 1 ? 14 : 10}px;height:${pts.length === 1 ? 14 : 10}px;background:${pts.length === 1 ? "#4ade80" : "#60a5fa"};border:2px solid #fff;border-radius:50%;"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          className: ""
        });
        markersRef.current.push(L.marker(e.latlng, {
          icon
        }).addTo(map));
        polylineRef.current.setLatLngs(pts);
        let d = 0;
        for (let i = 1; i < pts.length; i++) d += haversine(pts[i - 1], pts[i]);
        setDist(parseFloat(d.toFixed(2)));
      });
      setMapReady(true);
    };
    loadLeaflet();
    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
        setMapReady(false);
      }
    };
  }, []);
  const pace = (() => {
    const m = parseFloat(time);
    if (!m || dist < 0.01) return null;
    const p = m / dist;
    const pm = Math.floor(p);
    const ps = Math.round((p - pm) * 60);
    return `${pm}:${String(ps).padStart(2, "0")} min/km`;
  })();
  const undoLast = () => {
    if (!pointsRef.current.length) return;
    pointsRef.current = pointsRef.current.slice(0, -1);
    const m = markersRef.current.pop();
    if (m && leafletRef.current) leafletRef.current.removeLayer(m);
    polylineRef.current?.setLatLngs(pointsRef.current);
    let d = 0;
    for (let i = 1; i < pointsRef.current.length; i++) d += haversine(pointsRef.current[i - 1], pointsRef.current[i]);
    setDist(parseFloat(d.toFixed(2)));
  };
  const save = () => {
    if (pointsRef.current.length < 2) {
      alert("Add at least 2 waypoints first.");
      return;
    }
    onDone && onDone({
      dist,
      time: parseFloat(time) || 0,
      pace,
      points: pointsRef.current.map(p => ({
        lat: p.lat,
        lng: p.lng
      }))
    });
    setSaved(true);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(74,222,128,.06)",
      border: "1px solid rgba(74,222,128,.15)",
      borderRadius: 12,
      padding: "13px 15px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontFamily: "'Syne',sans-serif",
      fontSize: 15,
      fontWeight: 800,
      margin: "0 0 3px"
    }
  }, "Outdoor Walk"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11,
      margin: 0
    }
  }, "Tap the map to trace your route after your walk \xB7 Distance auto-calculates")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 8,
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: undoLast,
    style: {
      padding: "5px 11px",
      background: "rgba(244,168,35,.1)",
      border: "1px solid rgba(244,168,35,.25)",
      color: "#f4a823",
      borderRadius: 7,
      fontSize: 11,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "\u21A9 Undo"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      pointsRef.current = [];
      markersRef.current.forEach(m => leafletRef.current?.removeLayer(m));
      markersRef.current = [];
      polylineRef.current?.setLatLngs([]);
      setDist(0);
    },
    style: {
      padding: "5px 11px",
      background: "rgba(239,68,68,.08)",
      border: "1px solid rgba(239,68,68,.18)",
      color: "#ef4444",
      borderRadius: 7,
      fontSize: 11,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "\u2715 Clear")), /*#__PURE__*/React.createElement("div", {
    ref: mapRef,
    style: {
      height: 280,
      borderRadius: 10,
      border: "1px solid rgba(255,255,255,.1)",
      overflow: "hidden",
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: "rgba(96,165,250,.08)",
      border: "1px solid rgba(96,165,250,.18)",
      borderRadius: 9,
      padding: "10px 12px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#6b7280",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".07em",
      margin: "0 0 2px"
    }
  }, "Distance"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#60a5fa",
      fontSize: 20,
      fontWeight: 800,
      margin: 0,
      fontFamily: "'Syne',sans-serif"
    }
  }, dist.toFixed(2), " km")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#6b7280",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".07em",
      margin: "0 0 5px"
    }
  }, "Time (minutes)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: time,
    onChange: e => setTime(e.target.value),
    placeholder: "e.g. 45",
    style: {
      ...inp,
      fontSize: 15
    }
  })), pace && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: "rgba(74,222,128,.07)",
      border: "1px solid rgba(74,222,128,.18)",
      borderRadius: 9,
      padding: "10px 12px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#6b7280",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".07em",
      margin: "0 0 2px"
    }
  }, "Pace"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontSize: 16,
      fontWeight: 800,
      margin: 0,
      fontFamily: "'Syne',sans-serif"
    }
  }, pace))), saved ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "11px 14px",
      background: "rgba(74,222,128,.08)",
      border: "1px solid rgba(74,222,128,.2)",
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontSize: 13,
      fontWeight: 700,
      margin: 0
    }
  }, "Walk logged \u2713 \u2014 ", dist.toFixed(2), " km", pace ? " · " + pace : "")) : /*#__PURE__*/React.createElement("button", {
    onClick: save,
    style: {
      width: "100%",
      padding: "13px 0",
      background: "rgba(74,222,128,.15)",
      border: "1px solid rgba(74,222,128,.3)",
      color: "#4ade80",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "LOG WALK \u2192"));
}
function StrengthSession({
  date,
  pair,
  onDone
}) {
  const pool = STRENGTH_POOL[pair.id] || [];
  const seed = date.split("-").reduce((a, c) => a * 100 + parseInt(c), 0);
  const exercises = seededShuffle(pool, seed).slice(0, 8);
  const [checked, setChecked] = useState({});
  const [tipOpen, setTipOpen] = useState(null);
  const [comp, setComp] = useState(false);
  const done = exercises.filter(e => checked[e.id]).length;
  if (comp) return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(74,222,128,.08)",
      border: "1px solid rgba(74,222,128,.25)",
      borderRadius: 12,
      padding: "16px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontFamily: "'Syne',sans-serif",
      fontSize: 18,
      fontWeight: 800,
      margin: 0
    }
  }, "Strength logged \u2713"));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${pair.color}10`,
      border: `1px solid ${pair.color}25`,
      borderRadius: 12,
      padding: "13px 15px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#6b7280",
      fontSize: 10,
      letterSpacing: ".07em",
      textTransform: "uppercase",
      margin: "0 0 3px",
      fontWeight: 600
    }
  }, "Today's Strength"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: pair.color,
      fontFamily: "'Syne',sans-serif",
      fontSize: 17,
      fontWeight: 800,
      margin: "0 0 2px"
    }
  }, pair.name), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 11,
      margin: 0
    }
  }, "8 exercises \xB7 ~15 min \xB7 bands, dumbbells, med ball, ab roller")), /*#__PURE__*/React.createElement("span", {
    style: {
      background: `${pair.color}18`,
      color: pair.color,
      fontSize: 11,
      fontWeight: 700,
      borderRadius: 6,
      padding: "4px 10px"
    }
  }, done, "/8"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 3,
      marginBottom: 12
    }
  }, exercises.map(ex => {
    const ck = !!checked[ex.id];
    const tip = tipOpen === ex.id;
    const ec = EQUIP_COLORS[ex.equip] || "#9ca3af";
    return /*#__PURE__*/React.createElement("div", {
      key: ex.id,
      style: {
        borderRadius: 8,
        background: ck ? "rgba(74,222,128,.05)" : "var(--card-bg)",
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
        background: `${ec}15`,
        color: ec,
        fontSize: 9,
        fontWeight: 700,
        borderRadius: 4,
        padding: "1px 5px",
        marginLeft: 6,
        textTransform: "uppercase",
        verticalAlign: "middle"
      }
    }, ex.equip)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)",
        fontSize: 10,
        flexShrink: 0,
        marginRight: 5
      }
    }, ex.sets), /*#__PURE__*/React.createElement("button", {
      onClick: () => setTipOpen(tip ? null : ex.id),
      style: {
        background: tip ? "rgba(244,168,35,.18)" : "transparent",
        border: `1px solid ${tip ? "rgba(244,168,35,.3)" : "var(--card-border)"}`,
        color: tip ? "#f4a823" : "var(--text-muted)",
        borderRadius: 6,
        padding: "3px 8px",
        fontSize: 10,
        cursor: "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0
      }
    }, "how to")), tip && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 10px 10px 40px"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#fcd34d",
        fontSize: 12,
        margin: 0,
        lineHeight: 1.6,
        background: "rgba(244,168,35,.07)",
        borderRadius: 7,
        padding: "8px 10px"
      }
    }, ex.tip)));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setComp(true);
      onDone && onDone();
    },
    disabled: done === 0,
    style: {
      width: "100%",
      padding: "13px 0",
      background: done === 0 ? "var(--card-bg-3)" : `${pair.color}20`,
      border: `1px solid ${done === 0 ? "var(--card-border)" : `${pair.color}35`}`,
      color: done === 0 ? "var(--text-muted)" : pair.color,
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 800,
      cursor: done === 0 ? "default" : "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, done === 0 ? "CHECK OFF EXERCISES TO FINISH" : `LOG SESSION (${done}/8) →`));
}
function IndoorWalk({
  onDone
}) {
  const [dist, setDist] = useState("");
  const [time, setTime] = useState("");
  const [calories, setCalories] = useState("");
  const [logged, setLogged] = useState(false);
  const speed = dist && time && parseFloat(time) > 0 ? (parseFloat(dist) / parseFloat(time) * 60).toFixed(1) : null;
  const inp = {
    width: "100%",
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 8,
    padding: "10px 12px",
    color: "var(--text-primary)",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box"
  };
  if (logged) return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(96,165,250,.08)",
      border: "1px solid rgba(96,165,250,.25)",
      borderRadius: 12,
      padding: 16,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#60a5fa",
      fontFamily: "'Syne',sans-serif",
      fontSize: 18,
      fontWeight: 800,
      margin: 0
    }
  }, "Indoor Walk logged \u2713"));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(96,165,250,.05)",
      border: "1px solid rgba(96,165,250,.15)",
      borderRadius: 12,
      padding: "14px 15px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#60a5fa",
      fontFamily: "'Syne',sans-serif",
      fontSize: 15,
      fontWeight: 800,
      margin: "0 0 14px"
    }
  }, "Indoor Walk"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#6b7280",
      fontSize: 10,
      fontWeight: 600,
      textTransform: "uppercase",
      margin: "0 0 5px",
      letterSpacing: ".06em"
    }
  }, "Distance (km)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    placeholder: "e.g. 3.5",
    value: dist,
    onChange: e => setDist(e.target.value),
    style: inp
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#6b7280",
      fontSize: 10,
      fontWeight: 600,
      textTransform: "uppercase",
      margin: "0 0 5px",
      letterSpacing: ".06em"
    }
  }, "Time (minutes)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    placeholder: "e.g. 45",
    value: time,
    onChange: e => setTime(e.target.value),
    style: inp
  })), speed && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      padding: "8px 12px",
      background: "rgba(96,165,250,.08)",
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#60a5fa",
      fontSize: 13,
      fontWeight: 700
    }
  }, "Avg Speed: ", speed, " km/h")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#6b7280",
      fontSize: 10,
      fontWeight: 600,
      textTransform: "uppercase",
      margin: "0 0 5px",
      letterSpacing: ".06em"
    }
  }, "Calories (optional)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    placeholder: "e.g. 250",
    value: calories,
    onChange: e => setCalories(e.target.value),
    style: inp
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!dist || !time) return;
      onDone({
        dist: parseFloat(dist),
        time: parseFloat(time),
        speed: speed ? parseFloat(speed) : 0,
        calories: parseFloat(calories) || 0
      });
      setLogged(true);
    },
    disabled: !dist || !time,
    style: {
      width: "100%",
      padding: "12px 0",
      background: dist && time ? "#60a5fa" : "rgba(255,255,255,.05)",
      border: "none",
      borderRadius: 9,
      color: dist && time ? "#0a0f1a" : "var(--text-muted)",
      fontSize: 13,
      fontWeight: 800,
      cursor: dist && time ? "pointer" : "default",
      fontFamily: "'Syne',sans-serif",
      marginTop: 4
    }
  }, "Log Indoor Walk")));
}
function Train({
  todayLog,
  onSave,
  settings
}) {
  const todayStr = getToday();
  const [trainView, setTrainView] = useState("today"); // "today" | "backlog"
  const [backlogDate, setBacklogDate] = useState(null); // selected past date
  const date = backlogDate || todayStr;
  const schedule = getTodaySchedule(date);
  const dow = new Date().getDay();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [walkDone, setWalkDone] = useState(false);
  const [history, setHistory] = useState([]);
  const [workoutType, setWorkoutType] = useState(null);
  const [cardioType, setCardioType] = useState(null);
  const [walkType, setWalkType] = useState(null);
  const [strengthPair, setStrengthPair] = useState(null);
  const [sessionDone, setSessionDone] = useState(null); // { type, label }

  // Past 7 days for backlog
  const past7 = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(todayStr, -(i + 1));
    return { date: d, label: new Date(d + "T12:00:00").toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" }) };
  });
  const resetChoices = () => {
    setWorkoutType(null);
    setCardioType(null);
    setWalkType(null);
    setStrengthPair(null);
  };
  useEffect(() => {
    (async () => {
      const h = await DB.get(KEYS.trainHistory());
      setHistory(h || []);
    })();
  }, []);
  const logSession = async (type, details = {}) => {
    const entry = {
      date,
      type,
      ...details,
      timestamp: new Date().toISOString()
    };
    const h = [entry, ...history].slice(0, 60);
    setHistory(h);
    await DB.set(KEYS.trainHistory(), h);
    const ex = (await DB.get(KEYS.log(date))) || {};
    await DB.set(KEYS.log(date), {
      ...ex,
      evening: {
        ...(ex.evening || {}),
        [type === "strength" ? "strength" : "cardio"]: true
      }
    });
    const label = type === "strength"
      ? (details.pair || "Strength")
      : details.format === "indoor_walk" ? "Indoor Walk"
      : details.format === "outdoor_walk" ? "Outdoor Walk"
      : details.format === "rower_intervals" ? "Rowing"
      : "Cardio";
    setSessionDone({ type, label });
    resetChoices();
  };
  const wk = [0, 1, 2, 3, 4, 5, 6].map(d => {
    const diff = (d - dow + 7) % 7;
    const dd = new Date();
    dd.setDate(new Date().getDate() + (d === dow ? 0 : diff));
    const ds = dd.toISOString().split("T")[0];
    const sc = getTodaySchedule(ds);
    return {
      dow: d,
      label: dayNames[d],
      date: ds,
      schedule: sc,
      isToday: d === dow
    };
  });
  const readiness = todayLog?.morning?.readiness || 0;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: { display: "flex", justifyContent: "space-between", alignItems: "center" }
  },
    /*#__PURE__*/React.createElement(SectionHead, { label: backlogDate ? fmtMid(backlogDate) : "Train", color: "#fb923c" }),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6, marginRight: 4 } },
      /*#__PURE__*/React.createElement("button", {
        onClick: () => { setTrainView("today"); setBacklogDate(null); setWorkoutType(null); setCardioType(null); setWalkType(null); setStrengthPair(null); setSessionDone(null); },
        style: { background: trainView === "today" ? "rgba(251,146,60,.18)" : "rgba(255,255,255,.04)", border: `1px solid ${trainView === "today" ? "rgba(251,146,60,.4)" : "rgba(255,255,255,.1)"}`, borderRadius: 8, padding: "5px 10px", fontSize: 10, fontWeight: 700, color: trainView === "today" ? "#fb923c" : "var(--text-secondary)", cursor: "pointer" }
      }, "TODAY"),
      /*#__PURE__*/React.createElement("button", {
        onClick: () => { setTrainView("backlog"); setBacklogDate(null); setWorkoutType(null); setCardioType(null); setWalkType(null); setStrengthPair(null); setSessionDone(null); },
        style: { background: trainView === "backlog" ? "rgba(251,146,60,.18)" : "rgba(255,255,255,.04)", border: `1px solid ${trainView === "backlog" ? "rgba(251,146,60,.4)" : "rgba(255,255,255,.1)"}`, borderRadius: 8, padding: "5px 10px", fontSize: 10, fontWeight: 700, color: trainView === "backlog" ? "#fb923c" : "var(--text-secondary)", cursor: "pointer" }
      }, "PAST 7")
    )
  ),
  /*#__PURE__*/React.createElement("p", {
    style: { color: "#404755", fontSize: 12, margin: "2px 0 0 13px" }
  }, backlogDate ? "Logging for " + fmtMid(backlogDate) : fmtMid(todayStr))),

  /* Backlog day picker */
  trainView === "backlog" && !backlogDate && /*#__PURE__*/React.createElement("div", {
    style: { marginBottom: 20 }
  },
    /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 12, marginBottom: 10, fontWeight: 600 } }, "Select a day to log:"),
    past7.map(({ date: d, label: lbl }) => {
      const hasLog = history.some(h => h.date === d);
      return /*#__PURE__*/React.createElement("button", {
        key: d,
        onClick: () => setBacklogDate(d),
        style: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, padding: "12px 16px", marginBottom: 8, cursor: "pointer", textAlign: "left" }
      },
        /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-primary)", fontSize: 13, fontWeight: 500 } }, lbl),
        hasLog
          ? /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "#4ade80", fontWeight: 700, background: "rgba(74,222,128,.12)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 6, padding: "2px 8px" } }, "LOGGED")
          : /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 600 } }, "tap to log \u203A")
      );
    })
  ),

  readiness > 0 && readiness <= 2 && trainView === "today" && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(244,168,35,.07)",
      border: "1px solid rgba(244,168,35,.2)",
      borderRadius: 10,
      padding: "10px 13px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontSize: 11,
      fontWeight: 700,
      margin: "0 0 2px"
    }
  }, "\u26A0\uFE0F Readiness ", readiness, "/5 this morning"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11,
      margin: 0
    }
  }, "Consider lighter effort or a mobility-only session today.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 18
    }
  }, wk.map(({
    dow: d,
    label,
    schedule: s,
    isToday
  }) => {
    const c = s.type === "strength" ? s.pair?.color || "#f4a823" : s.type === "cardio" ? "#60a5fa" : s.type === "rest" ? "#2d3340" : "#555";
    return /*#__PURE__*/React.createElement("div", {
      key: d,
      style: {
        flex: 1,
        textAlign: "center",
        padding: "7px 3px",
        borderRadius: 8,
        background: isToday ? `${c}18` : "rgba(255,255,255,.025)",
        border: `1px solid ${isToday ? `${c}35` : "var(--card-bg-2)"}`
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: isToday ? c : "var(--text-secondary)",
        fontSize: 9,
        fontWeight: isToday ? 800 : 500,
        margin: "0 0 2px"
      }
    }, label), /*#__PURE__*/React.createElement("p", {
      style: {
        color: isToday ? c : "var(--text-muted)",
        fontSize: 9,
        margin: 0
      }
    }, s.type === "strength" ? "STR" : s.type === "cardio" ? "CARD" : s.type === "rest" ? "REST" : "—"));
  })),
  sessionDone && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(74,222,128,.08)",
      border: "1px solid rgba(74,222,128,.25)",
      borderRadius: 14,
      padding: "18px 16px",
      marginBottom: 16,
      textAlign: "center"
    }
  },
    /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 28,
        margin: "0 0 6px"
      }
    }, "\uD83D\uDCAA"),
    /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#4ade80",
        fontFamily: "'Syne',sans-serif",
        fontSize: 18,
        fontWeight: 800,
        margin: "0 0 4px"
      }
    }, "Great work!"),
    /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#6b7280",
        fontSize: 12,
        margin: "0 0 12px"
      }
    }, sessionDone.label, " logged \u2713 \u2014 evening check-in updated automatically"),
    /*#__PURE__*/React.createElement("button", {
      onClick: () => setSessionDone(null),
      style: {
        background: "rgba(74,222,128,.12)",
        border: "1px solid rgba(74,222,128,.25)",
        borderRadius: 8,
        color: "#4ade80",
        fontSize: 11,
        fontWeight: 700,
        padding: "7px 16px",
        cursor: "pointer",
        fontFamily: "'Syne',sans-serif"
      }
    }, "Log another session")
  ),
  (trainView === "today" || backlogDate) && /*#__PURE__*/React.createElement("div", null,
    backlogDate && /*#__PURE__*/React.createElement("button", {
      onClick: () => { setBacklogDate(null); setWorkoutType(null); setCardioType(null); setWalkType(null); setStrengthPair(null); setSessionDone(null); },
      style: { background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 12, cursor: "pointer", padding: "0 0 12px", display: "flex", alignItems: "center", gap: 4 }
    }, "\u2190 Back to past days")
  ),
  /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  },
  /* ── Step 0: choose Strength or Cardio ── */
  (trainView === "today" || backlogDate) && !workoutType && !sessionDone && /*#__PURE__*/React.createElement("div", null,
    schedule.type !== "rest" && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 11,
        margin: "0 0 12px",
        textAlign: "center"
      }
    }, backlogDate ? "Logging for " + fmtMid(backlogDate) : "Today\u2019s plan: ", backlogDate ? null : /*#__PURE__*/React.createElement("span", {
      style: {
        color: schedule.type === "strength" ? "#f4a823" : "#60a5fa",
        fontWeight: 700
      }
    }, schedule.type === "strength" ? (schedule.pair?.name || "Strength") : schedule.format === "outdoor_walk" ? "Outdoor Walk" : (CARDIO_SESSIONS[schedule.format]?.title || "Cardio"))),
    schedule.type === "rest" && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#4ade80",
        fontSize: 11,
        margin: "0 0 12px",
        textAlign: "center",
        fontWeight: 700
      }
    }, "Scheduled rest day \u2014 feel free to skip or do something light"),
    /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10
      }
    },
      /*#__PURE__*/React.createElement("button", {
        onClick: () => setWorkoutType("strength"),
        style: {
          padding: "22px 10px",
          background: "rgba(244,168,35,.08)",
          border: "1px solid rgba(244,168,35,.25)",
          borderRadius: 12,
          color: "#f4a823",
          fontSize: 14,
          fontWeight: 800,
          cursor: "pointer",
          fontFamily: "'Syne',sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 24
        }
      }, "\uD83C\uDFCB"), "Strength"),
      /*#__PURE__*/React.createElement("button", {
        onClick: () => setWorkoutType("cardio"),
        style: {
          padding: "22px 10px",
          background: "rgba(96,165,250,.08)",
          border: "1px solid rgba(96,165,250,.25)",
          borderRadius: 12,
          color: "#60a5fa",
          fontSize: 14,
          fontWeight: 800,
          cursor: "pointer",
          fontFamily: "'Syne',sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 24
        }
      }, "\uD83C\uDFC3"), "Cardio")
    )
  ),
  /* ── Step 1a: Strength — pick muscle pair ── */
  workoutType === "strength" && !strengthPair && /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("button", {
      onClick: resetChoices,
      style: {
        background: "none",
        border: "none",
        color: "var(--text-secondary)",
        fontSize: 12,
        cursor: "pointer",
        padding: "0 0 12px",
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, "\u2190 Back"),
    /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#f4a823",
        fontFamily: "'Syne',sans-serif",
        fontSize: 14,
        fontWeight: 800,
        margin: "0 0 12px"
      }
    }, "Which muscle groups today?"),
    /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, STRENGTH_PAIRS.map(p => /*#__PURE__*/React.createElement("button", {
      key: p.id,
      onClick: () => setStrengthPair(p),
      style: {
        padding: "13px 16px",
        background: `${p.color}10`,
        border: `1px solid ${p.color}30`,
        borderRadius: 10,
        color: p.color,
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "'DM Sans',sans-serif"
      }
    }, p.name)))
  ),
  /* ── Step 1b: Strength session ── */
  workoutType === "strength" && strengthPair && /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("button", {
      onClick: () => setStrengthPair(null),
      style: {
        background: "none",
        border: "none",
        color: "var(--text-secondary)",
        fontSize: 12,
        cursor: "pointer",
        padding: "0 0 12px",
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, "\u2190 Back"),
    /*#__PURE__*/React.createElement(StrengthSession, {
      date: date,
      pair: strengthPair,
      onDone: () => logSession("strength", {
        pair: strengthPair.name
      })
    })
  ),
  /* ── Step 2: Cardio — Walk or Row ── */
  workoutType === "cardio" && !cardioType && /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("button", {
      onClick: resetChoices,
      style: {
        background: "none",
        border: "none",
        color: "var(--text-secondary)",
        fontSize: 12,
        cursor: "pointer",
        padding: "0 0 12px",
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, "\u2190 Back"),
    /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#60a5fa",
        fontFamily: "'Syne',sans-serif",
        fontSize: 14,
        fontWeight: 800,
        margin: "0 0 12px"
      }
    }, "What type of cardio?"),
    /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10
      }
    },
      /*#__PURE__*/React.createElement("button", {
        onClick: () => setCardioType("walk"),
        style: {
          padding: "22px 10px",
          background: "rgba(96,165,250,.08)",
          border: "1px solid rgba(96,165,250,.2)",
          borderRadius: 12,
          color: "#60a5fa",
          fontSize: 13,
          fontWeight: 800,
          cursor: "pointer",
          fontFamily: "'Syne',sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 24
        }
      }, "\uD83D\uDEB6"), "Walk"),
      /*#__PURE__*/React.createElement("button", {
        onClick: () => setCardioType("row"),
        style: {
          padding: "22px 10px",
          background: "rgba(96,165,250,.08)",
          border: "1px solid rgba(96,165,250,.2)",
          borderRadius: 12,
          color: "#60a5fa",
          fontSize: 13,
          fontWeight: 800,
          cursor: "pointer",
          fontFamily: "'Syne',sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 24
        }
      }, "\uD83D\uDEA3"), "Row")
    )
  ),
  /* ── Step 3: Walk — Indoor or Outdoor ── */
  workoutType === "cardio" && cardioType === "walk" && !walkType && /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("button", {
      onClick: () => setCardioType(null),
      style: {
        background: "none",
        border: "none",
        color: "var(--text-secondary)",
        fontSize: 12,
        cursor: "pointer",
        padding: "0 0 12px",
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, "\u2190 Back"),
    /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#60a5fa",
        fontFamily: "'Syne',sans-serif",
        fontSize: 14,
        fontWeight: 800,
        margin: "0 0 12px"
      }
    }, "Indoor or outdoor?"),
    /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10
      }
    },
      /*#__PURE__*/React.createElement("button", {
        onClick: () => setWalkType("indoor"),
        style: {
          padding: "22px 10px",
          background: "rgba(96,165,250,.08)",
          border: "1px solid rgba(96,165,250,.2)",
          borderRadius: 12,
          color: "#60a5fa",
          fontSize: 13,
          fontWeight: 800,
          cursor: "pointer",
          fontFamily: "'Syne',sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 24
        }
      }, "\uD83C\uDFE0"), "Indoor"),
      /*#__PURE__*/React.createElement("button", {
        onClick: () => setWalkType("outdoor"),
        style: {
          padding: "22px 10px",
          background: "rgba(96,165,250,.08)",
          border: "1px solid rgba(96,165,250,.2)",
          borderRadius: 12,
          color: "#60a5fa",
          fontSize: 13,
          fontWeight: 800,
          cursor: "pointer",
          fontFamily: "'Syne',sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 24
        }
      }, "\uD83C\uDF33"), "Outdoor")
    )
  ),
  /* ── Step 4a: Indoor walk form ── */
  workoutType === "cardio" && cardioType === "walk" && walkType === "indoor" && /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("button", {
      onClick: () => setWalkType(null),
      style: {
        background: "none",
        border: "none",
        color: "var(--text-secondary)",
        fontSize: 12,
        cursor: "pointer",
        padding: "0 0 12px",
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, "\u2190 Back"),
    /*#__PURE__*/React.createElement(IndoorWalk, {
      onDone: data => {
        setWalkDone(true);
        logSession("cardio", {
          format: "indoor_walk",
          ...data
        });
      }
    })
  ),
  /* ── Step 4b: Outdoor walk with map ── */
  workoutType === "cardio" && cardioType === "walk" && walkType === "outdoor" && /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("button", {
      onClick: () => setWalkType(null),
      style: {
        background: "none",
        border: "none",
        color: "var(--text-secondary)",
        fontSize: 12,
        cursor: "pointer",
        padding: "0 0 12px",
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, "\u2190 Back"),
    /*#__PURE__*/React.createElement(OutdoorWalk, {
      onDone: data => {
        setWalkDone(true);
        logSession("cardio", {
          format: "outdoor_walk",
          ...data
        });
      }
    })
  ),
  /* ── Step 4c: Row session ── */
  workoutType === "cardio" && cardioType === "row" && CARDIO_SESSIONS["rower_intervals"] && /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("button", {
      onClick: () => setCardioType(null),
      style: {
        background: "none",
        border: "none",
        color: "var(--text-secondary)",
        fontSize: 12,
        cursor: "pointer",
        padding: "0 0 12px",
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, "\u2190 Back"),
    /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(96,165,250,.06)",
        border: "1px solid rgba(96,165,250,.15)",
        borderRadius: 12,
        padding: "13px 15px",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#6b7280",
        fontSize: 10,
        letterSpacing: ".07em",
        textTransform: "uppercase",
        margin: "0 0 3px",
        fontWeight: 600
      }
    }, "Today\u2019s Cardio"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#60a5fa",
        fontFamily: "'Syne',sans-serif",
        fontSize: 17,
        fontWeight: 800,
        margin: "0 0 2px"
      }
    }, CARDIO_SESSIONS["rower_intervals"].title), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 11,
        margin: "0 0 3px"
      }
    }, CARDIO_SESSIONS["rower_intervals"].equipment), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 12,
        margin: 0
      }
    }, CARDIO_SESSIONS["rower_intervals"].summary)),
    /*#__PURE__*/React.createElement(Card, {
      ch: /*#__PURE__*/React.createElement(IntervalTimer, {
        blocks: CARDIO_SESSIONS["rower_intervals"].blocks,
        onComplete: () => logSession("cardio", {
          format: "rower_intervals"
        })
      })
    })
  )), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      paddingTop: 16,
      borderTop: "1px solid rgba(255,255,255,.06)"
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "Coming Up"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 5
    }
  }, wk.filter(w => !w.isToday && w.schedule.type !== "rest").slice(0, 3).map(({
    label,
    schedule: s
  }) => {
    const c = s.type === "strength" ? s.pair?.color || "#f4a823" : "#60a5fa";
    return /*#__PURE__*/React.createElement("div", {
      key: label,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 12px",
        background: "rgba(255,255,255,.025)",
        borderRadius: 9,
        border: "1px solid rgba(255,255,255,.06)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 11,
        width: 28,
        flexShrink: 0
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        background: `${c}15`,
        color: c,
        fontSize: 9,
        fontWeight: 700,
        borderRadius: 4,
        padding: "2px 7px",
        flexShrink: 0
      }
    }, s.type === "strength" ? "STR" : "CARD"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#9ca3af",
        fontSize: 12,
        flex: 1
      }
    }, s.type === "strength" ? s.pair?.name : s.format === "outdoor_walk" ? "Outdoor Walk" : CARDIO_SESSIONS[s.format]?.title || s.format));
  }))), history.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      paddingTop: 16,
      borderTop: "1px solid rgba(255,255,255,.06)"
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "Recent Sessions"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, history.slice(0, 10).map((h, i) => {
    const c = h.type === "strength" ? "#f4a823" : "#60a5fa";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 11px",
        background: "rgba(255,255,255,.025)",
        borderRadius: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        background: `${c}15`,
        color: c,
        fontSize: 9,
        fontWeight: 700,
        borderRadius: 4,
        padding: "2px 7px",
        flexShrink: 0
      }
    }, h.type === "strength" ? "STR" : "CARD"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#9ca3af",
        fontSize: 12,
        flex: 1
      }
    }, h.pair || h.format || h.type), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)",
        fontSize: 10,
        flexShrink: 0
      }
    }, fmtDate(h.date)), h.dist && /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#4ade80",
        fontSize: 10,
        flexShrink: 0
      }
    }, h.dist, "km"));
  }))));
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENING TAB
// ─────────────────────────────────────────────────────────────────────────────
function Evening({
  todayLog,
  onSave,
  settings,
  onMilestone,
  allLogs,
  reminders,
  jointReminders,
  mealLog,
  macroTargets,
  initialDate,
  onInitialDateConsumed
}) {
  const allLogsArr = allLogs || [];
  const [view, setView] = useState(initialDate && initialDate !== getToday() ? "history" : "log");
  const [histDate, setHistDate] = useState(initialDate || getToday());
  const [histLog, setHistLog] = useState(null);
  const isHistory = view === "history";
  useEffect(() => {
    if (isHistory) {
      DB.get(KEYS.log(histDate)).then(l => setHistLog(l || null));
    }
  }, [view, histDate]);
  const ex = todayLog?.evening || {};
  const [ca, setCa] = useState(ex.cardio ?? false);
  const [st, setSt] = useState(ex.strength ?? false);
  const [sn, setSn] = useState(ex.snack ?? null);
  const [fq, setFq] = useState(ex.foodQuality || 0);
  const [fw, setFw] = useState(ex.financeWin ?? false);
  const [fn, setFn] = useState(ex.financeNote || "");
  const [mood, setMood] = useState(ex.eveningMood || 0);
  const [moodNote, setMoodNote] = useState(ex.moodNote || "");
  const [choresDone, setChoresDone] = useState(ex.choresDone ?? false);
  const [choreNote, setChoreNote] = useState(ex.choreNote || "");
  const [bedtime, setBedtime] = useState(ex.bedtime || "");
  const [familyMoment, setFamilyMoment] = useState(ex.familyMoment || "");
  const [exceptional, setExceptional] = useState(ex.exceptionalDay ?? false);
  const [exceptReason, setExceptReason] = useState(ex.exceptionalReason || "");
  const [dr, setDr] = useState(ex.dayRating || 0);
  const [wi, setWi] = useState(ex.win || "");
  const [hy, setHy] = useState(ex.hydration ?? null);
  const [glasses, setGlasses] = useState(ex.glasses || 0);
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  // Reset form fields when history log loads so we edit the selected day
  useEffect(() => {
    if (!isHistory) return;
    const e = (histLog && histLog.evening) || {};
    setCa(e.cardio ?? false);
    setSt(e.strength ?? false);
    setSn(e.snack ?? null);
    setFq(e.foodQuality || 0);
    setFw(e.financeWin ?? false);
    setFn(e.financeNote || "");
    setMood(e.eveningMood || 0);
    setMoodNote(e.moodNote || "");
    setChoresDone(e.choresDone ?? false);
    setChoreNote(e.choreNote || "");
    setBedtime(e.bedtime || "");
    setFamilyMoment(e.familyMoment || "");
    setExceptional(e.exceptionalDay ?? false);
    setExceptReason(e.exceptionalReason || "");
    setDr(e.dayRating || 0);
    setWi(e.win || "");
    setHy(e.hydration ?? null);
    setGlasses(e.glasses || 0);
    setOk(false);
  }, [histLog]);

  const data = {
    cardio: ca,
    strength: st,
    snack: sn,
    foodQuality: fq,
    financeWin: fw,
    financeNote: fn,
    eveningMood: mood,
    moodNote,
    choresDone,
    choreNote,
    bedtime,
    familyMoment,
    exceptionalDay: exceptional,
    exceptionalReason: exceptReason,
    dayRating: dr,
    win: wi,
    hydration: hy,
    glasses
  };
  useAutoSave(isHistory ? null : KEYS.log(getToday()), {
    evening: data
  }, !busy && !isHistory);
  const go = async () => {
    setBusy(true);
    const saveDate = isHistory ? histDate : getToday();
    const existing = (await DB.get(KEYS.log(saveDate))) || {};
    await DB.set(KEYS.log(saveDate), {
      ...existing,
      evening: data
    });
    // Archive wins (only for today's log)
    if (!isHistory && wi.trim()) {
      const arch = (await DB.get(KEYS.winsArchive())) || [];
      if (!arch.find(w => w.date === getToday())) {
        await DB.set(KEYS.winsArchive(), [{
          date: getToday(),
          win: wi,
          ...(settings?.name ? {
            who: settings.name
          } : {})
        }, ...arch].slice(0, 365));
      }
    }
    setBusy(false);
    setOk(true);
    onSave && onSave(); // refresh allLogs so History/Calendar update
  };
  const snacks = [{
    l: "None",
    e: "★",
    c: "#4ade80"
  }, {
    l: "Light",
    e: "·",
    c: "#facc15"
  }, {
    l: "Moderate",
    e: "··",
    c: "#fb923c"
  }, {
    l: "Heavy",
    e: "✗",
    c: "#ef4444"
  }];
  const sonName = settings?.sonName || "your son";
  const partnerName = settings?.partnerName || "Sabrina";
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    label: "Evening Check-in",
    color: "#60a5fa"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#404755",
      fontSize: 12,
      margin: "0 0 0 13px"
    }
  }, fmtMid(getToday()))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      borderRadius: 8,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,.09)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("log"),
    style: {
      padding: "6px 12px",
      border: "none",
      background: view === "log" ? "rgba(96,165,250,.15)" : "transparent",
      color: view === "log" ? "#60a5fa" : "var(--text-secondary)",
      fontWeight: view === "log" ? 700 : 400,
      fontSize: 11,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "TODAY"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("history"),
    style: {
      padding: "6px 12px",
      border: "none",
      background: view === "history" ? "rgba(96,165,250,.15)" : "transparent",
      color: view === "history" ? "#60a5fa" : "var(--text-secondary)",
      fontWeight: view === "history" ? 700 : 400,
      fontSize: 11,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "HISTORY"))), view === "history" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(HistoryStrip, {
    selectedDate: histDate,
    onSelectDate: d => {
      setHistDate(d);
      setHistLog(null);
    },
    allLogs: allLogsArr,
    accentColor: "#60a5fa"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "9px 13px",
      background: "rgba(96,165,250,.06)",
      border: "1px solid rgba(96,165,250,.15)",
      borderRadius: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#60a5fa",
      fontSize: 11,
      fontWeight: 700,
      margin: 0
    }
  }, "\u270f\ufe0f Editing " + fmtLong(histDate)))), ok && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#60a5fa",
        margin: 0,
        fontSize: 13
      }
    }, "\u2713 Day closed. Rest well."),
    s: {
      borderColor: "rgba(96,165,250,.25)",
      background: "rgba(96,165,250,.06)",
      marginBottom: 16
    }
  }), (view === "log" || isHistory) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Workouts Completed"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 9
      }
    }, [["Cardio", ca, setCa], ["Strength", st, setSt]].map(([l, v, sv]) => /*#__PURE__*/React.createElement("button", {
      key: l,
      onClick: () => sv(!v),
      style: {
        flex: 1,
        padding: "10px 0",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 13,
        background: v ? "rgba(74,222,128,.13)" : "var(--card-bg-3)",
        border: `1px solid ${v ? "#4ade80" : "var(--card-border)"}`,
        color: v ? "#4ade80" : "var(--text-secondary)",
        fontWeight: v ? 700 : 400
      }
    }, v ? "✓ " : "", l))), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 10,
        margin: "7px 0 0"
      }
    }, "Auto-logged from Train tab \xB7 Mobility tracked in morning"))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Evening Snacking"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 7
      }
    }, snacks.map((s, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => setSn(i),
      style: {
        flex: 1,
        padding: "9px 3px",
        borderRadius: 8,
        fontSize: 11,
        cursor: "pointer",
        background: sn === i ? `${s.c}1f` : "var(--card-bg-3)",
        border: `1px solid ${sn === i ? s.c : "var(--card-border)"}`,
        color: sn === i ? s.c : "var(--text-secondary)",
        fontWeight: sn === i ? 700 : 400
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontSize: 14,
        marginBottom: 2
      }
    }, s.e), s.l))))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Overall Food Quality"
    }), /*#__PURE__*/React.createElement(Dots, {
      val: fq,
      set: setFq,
      col: "#fb923c"
    }))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Water Intake Today"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 4,
        flexWrap: "wrap"
      }
    }, [0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => /*#__PURE__*/React.createElement("button", {
      key: n,
      onClick: () => setGlasses(n),
      style: {
        width: 30,
        height: 30,
        borderRadius: 7,
        border: `2px solid ${glasses >= n && n > 0 ? "#60a5fa" : "rgba(255,255,255,.12)"}`,
        background: glasses >= n && n > 0 ? "rgba(96,165,250,.18)" : "transparent",
        cursor: "pointer",
        color: glasses >= n && n > 0 ? "#60a5fa" : "var(--text-muted)",
        fontSize: 12,
        fontWeight: 700,
        padding: 0
      }
    }, n === 0 ? "0" : n))), /*#__PURE__*/React.createElement("p", {
      style: {
        color: glasses >= 8 ? "#4ade80" : glasses >= 5 ? "#60a5fa" : "var(--text-secondary)",
        fontSize: 11,
        margin: 0,
        fontWeight: 700
      }
    }, glasses, "/8 glasses ", glasses >= 8 ? "✓" : "")))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Finance Win Today?"
    }), /*#__PURE__*/React.createElement(YN, {
      val: fw,
      set: setFw
    }), fw && /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: fn,
      onChange: e => setFn(e.target.value),
      placeholder: "What did you do?",
      style: {
        ...inp,
        marginTop: 10
      }
    }))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Evening Mood"
    }), /*#__PURE__*/React.createElement(Dots, {
      val: mood,
      set: setMood,
      col: "#a78bfa"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: moodNote,
      onChange: e => setMoodNote(e.target.value),
      placeholder: "How are you feeling? (optional)",
      style: {
        ...inp,
        marginTop: 10,
        fontSize: 13
      }
    }))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Tackled Any Chores Today?"
    }), /*#__PURE__*/React.createElement(YN, {
      val: choresDone,
      set: setChoresDone
    }), choresDone && /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: choreNote,
      onChange: e => setChoreNote(e.target.value),
      placeholder: "Which one(s)?",
      style: {
        ...inp,
        marginTop: 10,
        fontSize: 13
      }
    }))
  }), (() => {
    const today = getToday();
    const allRem = [...(reminders || []), ...(jointReminders || [])];
    const doneToday = allRem.filter(r => r.done && r.doneAt && r.doneAt.slice(0, 10) === today);
    if (!doneToday.length) return null;
    return /*#__PURE__*/React.createElement(Card, {
      ch: /*#__PURE__*/React.createElement(React.Fragment, null,
        /*#__PURE__*/React.createElement(Lbl, { c: "Reminders Completed Today" }),
        doneToday.map(r => /*#__PURE__*/React.createElement("div", {
          key: r.id,
          style: { display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: 13, color: "var(--text-secondary)" }
        },
          /*#__PURE__*/React.createElement("span", { style: { color: "#4ade80", fontSize: 12 } }, "\u2713"),
          /*#__PURE__*/React.createElement("span", { style: { flex: 1 } }, r.title),
          r.type === "joint" && /*#__PURE__*/React.createElement("span", {
            style: { fontSize: 10, background: "rgba(96,165,250,.15)", border: "1px solid rgba(96,165,250,.25)", borderRadius: 4, padding: "1px 6px", color: "#60a5fa", fontWeight: 700 }
          }, "JOINT")
        ))
      )
    });
  })(), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: `Moment with ${partnerName}${sonName ? " or " + sonName : ""}?`
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: familyMoment,
      onChange: e => setFamilyMoment(e.target.value),
      placeholder: `A moment worth remembering today...`,
      style: inp
    }))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Exceptional Day?"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 11,
        margin: "0 0 8px",
        lineHeight: 1.5
      }
    }, "Flag if today was outside normal \u2014 sick, travel, hard circumstance. Protects your averages."), /*#__PURE__*/React.createElement(YN, {
      val: exceptional,
      set: setExceptional
    }), exceptional && /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: exceptReason,
      onChange: e => setExceptReason(e.target.value),
      placeholder: "Reason...",
      style: {
        ...inp,
        marginTop: 10,
        fontSize: 13
      }
    }))
  }), (() => {
    // Compute macro-based day rating
    const score = macroTargets && mealLog ? macroScore((() => {
      const slots = ["breakfast","lunch","dinner"];
      let cal=0,prot=0,carbs=0,fat=0;
      slots.forEach(s => { if(mealLog[s]){cal+=mealLog[s].calories||0;prot+=mealLog[s].protein||0;carbs+=mealLog[s].carbs||0;fat+=mealLog[s].fat||0;}});
      (mealLog.snacks||[]).forEach(s=>{cal+=s.calories||0;prot+=s.protein||0;carbs+=s.carbs||0;fat+=s.fat||0;});
      return {calories:cal,protein:prot,carbs,fat};
    })(), macroTargets) : null;
    const computedRating = score !== null ? Math.max(1, Math.min(5, Math.round(score))) : null;
    // Keep dr in sync with computed rating for autosave/history
    if (computedRating !== null && computedRating !== dr) { setDr(computedRating); }
    const mealCount = ["breakfast","lunch","dinner"].filter(s => mealLog?.[s]).length + (mealLog?.snacks?.length || 0);
    const mealSummaryLines = ["breakfast","lunch","dinner"].filter(s => mealLog?.[s]).map(s => `${s.charAt(0).toUpperCase()+s.slice(1)}: ${mealLog[s].name} (${mealLog[s].calories}cal)`);
    const ratingLabel = computedRating ? ["","Poor","Below average","On track","Good","Nailed it"][computedRating] : null;
    return /*#__PURE__*/React.createElement(Card, {
      ch: /*#__PURE__*/React.createElement(React.Fragment, null,
        /*#__PURE__*/React.createElement(Lbl, { c: "Day Rating" }),
        computedRating !== null
          ? /*#__PURE__*/React.createElement("div", null,
              /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: mealCount > 0 ? 10 : 0 } },
                [1,2,3,4,5].map(n => /*#__PURE__*/React.createElement("div", {
                  key: n,
                  style: { width: 28, height: 28, borderRadius: "50%", background: n <= computedRating ? "#f4a823" : "rgba(255,255,255,.07)", border: `2px solid ${n <= computedRating ? "#f4a823" : "rgba(255,255,255,.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: n <= computedRating ? "#080b11" : "var(--text-muted)" }
                }, n)),
                /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, color: "#f4a823", fontWeight: 700 } }, ratingLabel)
              ),
              mealCount > 0 && /*#__PURE__*/React.createElement("div", null,
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", marginBottom: 4, letterSpacing: ".05em", fontWeight: 700 } }, mealCount + " MEAL" + (mealCount !== 1 ? "S" : "") + " LOGGED"),
                mealSummaryLines.map((line, i) => /*#__PURE__*/React.createElement("p", { key: i, style: { fontSize: 11, color: "var(--text-secondary)", margin: "0 0 2px", lineHeight: 1.4 } }, line)),
                mealLog?.snacks?.length > 0 && /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-secondary)", margin: 0 } }, "Snacks: " + mealLog.snacks.map(s => s.name).join(", "))
              ),
              !mealCount && /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", marginTop: 4 } }, "Log meals in the Food tab to see your full score")
            )
          : /*#__PURE__*/React.createElement("div", null,
              /*#__PURE__*/React.createElement(Dots, { val: dr, set: setDr, col: "#f4a823" }),
              /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", marginTop: 6 } }, "Log meals + set macro targets for auto-scoring")
            )
      )
    });
  })(), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Win of the Day"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: wi,
      onChange: e => setWi(e.target.value),
      placeholder: "One real win \u2014 no matter how small",
      style: inp
    }))
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Bedtime Tonight"
    }), /*#__PURE__*/React.createElement("input", {
      type: "time",
      value: bedtime,
      onChange: e => setBedtime(e.target.value),
      style: {
        ...inp,
        width: 130,
        colorScheme: "dark"
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 10,
        margin: "6px 0 0"
      }
    }, "Tomorrow's morning will calculate how long you slept"))
  }), /*#__PURE__*/React.createElement("button", {
    onClick: go,
    disabled: busy,
    style: {
      background: busy ? "rgba(96,165,250,.45)" : "#60a5fa",
      color: "#080b11",
      border: "none",
      borderRadius: 10,
      padding: "14px 0",
      fontSize: 15,
      fontWeight: 800,
      cursor: busy ? "wait" : "pointer",
      width: "100%",
      fontFamily: "'Syne',sans-serif",
      letterSpacing: ".05em"
    }
  }, busy ? "SAVING..." : isHistory ? "SAVE CHANGES \u2192" : "CLOSE THE DAY \u2192")));
}

// ─────────────────────────────────────────────────────────────────────────────
// GOALS TAB — user-editable goals, weight chart 30/90 day, wins archive
// ─────────────────────────────────────────────────────────────────────────────
function Arc({
  pct,
  col,
  size = 110,
  stroke = 9
}) {
  const r = (size - stroke * 2) / 2,
    cx = size / 2,
    cy = size / 2,
    circ = 2 * Math.PI * r,
    arc = circ * .75;
  const filled = arc * (Math.min(100, pct) / 100),
    rot = 135;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size
  }, /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: r,
    fill: "none",
    stroke: "var(--card-bg-2)",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeDasharray: `${arc} ${circ}`,
    style: {
      transform: `rotate(${rot}deg)`,
      transformOrigin: `${cx}px ${cy}px`
    }
  }), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: r,
    fill: "none",
    stroke: col,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeDasharray: `${filled} ${circ}`,
    style: {
      transform: `rotate(${rot}deg)`,
      transformOrigin: `${cx}px ${cy}px`,
      transition: "stroke-dasharray .6s ease"
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy - 5,
    textAnchor: "middle",
    fill: col,
    fontSize: 20,
    fontWeight: 800,
    fontFamily: "'Syne',sans-serif"
  }, pct, "%"), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy + 12,
    textAnchor: "middle",
    fill: "var(--text-secondary)",
    fontSize: 9
  }, "complete"));
}
// ─────────────────────────────────────────────────────────────────────────────
// GOALS v2 — user-defined, multi-category goal system
// ─────────────────────────────────────────────────────────────────────────────
const GOAL_CATEGORY_META = window.GOAL_CATEGORY_META;
const GOAL_TEMPLATES = window.GOAL_TEMPLATES;

function GoalWizard({ onSave, onClose }) {
  const [step, setStep] = useState(1);
  const [cat, setCat] = useState(null);
  const [form, setForm] = useState({});
  const sf = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const col = cat ? GOAL_CATEGORY_META[cat].color : "#34d399";

  const selectTemplate = tpl => { setForm({ ...tpl.fields }); setStep(3); };
  const handleSave = () => {
    const goal = { id: `goal_${Date.now()}`, type: cat, startDate: form.startDate || getToday(), createdAt: new Date().toISOString(), completedAt: null, ...form };
    onSave(goal);
  };

  return React.createElement(React.Fragment, null,
    React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 200 }, onClick: onClose }),
    React.createElement("div", {
      style: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "calc(100% - 32px)", maxWidth: 420, background: "#0e1420", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: "20px", zIndex: 201, maxHeight: "85vh", overflowY: "auto" }
    },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 } },
        React.createElement("p", { style: { color: col, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, margin: 0 } },
          step === 1 ? "CHOOSE A CATEGORY" : step === 2 ? "PICK A TEMPLATE" : "SET YOUR GOAL"),
        React.createElement("button", { onClick: onClose, style: { background: "none", border: "none", color: "#6b7280", fontSize: 20, cursor: "pointer", lineHeight: 1 } }, "\xD7")
      ),
      step > 1 && React.createElement("button", {
        onClick: () => setStep(s => s - 1),
        style: { background: "none", border: "none", color: "#6b7280", fontSize: 12, cursor: "pointer", padding: "0 0 14px 0" }
      }, "\u2190 Back"),

      step === 1 && React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
        ...Object.entries(GOAL_CATEGORY_META).map(([id, meta]) =>
          React.createElement("button", { key: id, onClick: () => { setCat(id); setStep(2); },
            style: { padding: "14px 12px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, cursor: "pointer", textAlign: "left" } },
            React.createElement("p", { style: { color: meta.color, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 11, margin: "0 0 4px", letterSpacing: ".06em" } }, meta.label.toUpperCase()),
            React.createElement("p", { style: { color: "#6b7280", fontSize: 11, margin: 0 } }, meta.desc)
          )
        )
      ),

      step === 2 && React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
        ...(GOAL_TEMPLATES[cat] || []).map(tpl =>
          React.createElement("button", { key: tpl.id, onClick: () => selectTemplate(tpl),
            style: { padding: "13px 14px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, cursor: "pointer", textAlign: "left", color: "#d1d5db", fontSize: 13, fontWeight: 500 } },
            tpl.label, " \u2192")
        )
      ),

      step === 3 && React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
        cat !== "habit" && React.createElement("div", null,
          React.createElement(Lbl, { c: "Goal name" }),
          React.createElement("input", { type: "text", value: form.label || "", placeholder: "Name this goal", onChange: e => sf("label", e.target.value), style: { ...inp, fontSize: 13 } })
        ),
        cat === "weight" && React.createElement(React.Fragment, null,
          React.createElement("div", null, React.createElement(Lbl, { c: "Starting weight (lbs)" }),
            React.createElement("input", { type: "number", value: form.startWeight || "", placeholder: "e.g. 210", onChange: e => sf("startWeight", parseFloat(e.target.value)), style: { ...inp, fontSize: 13 } })),
          React.createElement("div", null, React.createElement(Lbl, { c: "Target weight (lbs)" }),
            React.createElement("input", { type: "number", value: form.targetWeight || "", placeholder: "e.g. 185", onChange: e => sf("targetWeight", parseFloat(e.target.value)), style: { ...inp, fontSize: 13 } })),
          React.createElement("div", null, React.createElement(Lbl, { c: "Deadline" }),
            React.createElement("input", { type: "date", value: form.deadline || "", onChange: e => sf("deadline", e.target.value), style: { ...inp, fontSize: 13, colorScheme: "dark" } }))
        ),
        cat === "fitness_streak" && React.createElement("div", null,
          React.createElement(Lbl, { c: "Streak target (days)" }),
          React.createElement("input", { type: "number", value: form.targetDays || "", placeholder: "e.g. 30", onChange: e => sf("targetDays", parseInt(e.target.value)), style: { ...inp, fontSize: 13 } })
        ),
        cat === "habit" && React.createElement(React.Fragment, null,
          React.createElement("div", null, React.createElement(Lbl, { c: "Habit name" }),
            React.createElement("input", { type: "text", value: form.habitName || "", placeholder: "e.g. Meditate", onChange: e => { sf("habitName", e.target.value); sf("label", e.target.value); }, style: { ...inp, fontSize: 13 } })),
          React.createElement("div", null, React.createElement(Lbl, { c: "Target days in a row" }),
            React.createElement("input", { type: "number", value: form.targetDays || "", placeholder: "e.g. 30", onChange: e => sf("targetDays", parseInt(e.target.value)), style: { ...inp, fontSize: 13 } }))
        ),
        cat === "savings" && React.createElement(React.Fragment, null,
          React.createElement("div", null, React.createElement(Lbl, { c: "Savings target ($)" }),
            React.createElement("input", { type: "number", value: form.targetAmount || "", placeholder: "e.g. 10000", onChange: e => sf("targetAmount", parseFloat(e.target.value)), style: { ...inp, fontSize: 13 } })),
          React.createElement("div", null, React.createElement(Lbl, { c: "Target date (optional)" }),
            React.createElement("input", { type: "date", value: form.deadline || "", onChange: e => sf("deadline", e.target.value), style: { ...inp, fontSize: 13, colorScheme: "dark" } })),
          React.createElement("p", { style: { color: "#555e73", fontSize: 11, margin: "2px 0 0" } }, "Progress auto-calculated from Finance tab (income \u2212 spending from goal start date).")
        ),
        cat === "debt" && React.createElement(React.Fragment, null,
          React.createElement("div", null, React.createElement(Lbl, { c: "Starting balance ($)" }),
            React.createElement("input", { type: "number", value: form.startBalance || "", placeholder: "e.g. 15000", onChange: e => sf("startBalance", parseFloat(e.target.value)), style: { ...inp, fontSize: 13 } })),
          React.createElement("div", null, React.createElement(Lbl, { c: "Payoff deadline (optional)" }),
            React.createElement("input", { type: "date", value: form.deadline || "", onChange: e => sf("deadline", e.target.value), style: { ...inp, fontSize: 13, colorScheme: "dark" } }))
        ),
        cat === "custom" && React.createElement(React.Fragment, null,
          React.createElement("div", null, React.createElement(Lbl, { c: "Unit (e.g. books, km, reps)" }),
            React.createElement("input", { type: "text", value: form.unit || "", placeholder: "books", onChange: e => sf("unit", e.target.value), style: { ...inp, fontSize: 13 } })),
          React.createElement("div", null, React.createElement(Lbl, { c: "Starting value" }),
            React.createElement("input", { type: "number", value: form.startValue ?? "", placeholder: "0", onChange: e => sf("startValue", parseFloat(e.target.value)), style: { ...inp, fontSize: 13 } })),
          React.createElement("div", null, React.createElement(Lbl, { c: "Target value" }),
            React.createElement("input", { type: "number", value: form.targetValue || "", placeholder: "e.g. 12", onChange: e => sf("targetValue", parseFloat(e.target.value)), style: { ...inp, fontSize: 13 } })),
          React.createElement("div", null, React.createElement(Lbl, { c: "Deadline (optional)" }),
            React.createElement("input", { type: "date", value: form.deadline || "", onChange: e => sf("deadline", e.target.value), style: { ...inp, fontSize: 13, colorScheme: "dark" } }))
        ),
        React.createElement("button", {
          onClick: handleSave,
          style: { marginTop: 4, width: "100%", padding: "12px 0", background: col, color: "#080b11", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
        }, "ADD GOAL \u2192")
      )
    )
  );
}

// ─── Legacy GoalEditor stub (unused — kept to avoid reference errors) ─────────
function GoalEditor({
  goals,
  onSave,
  settings
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(goals);
  const s = (k, v) => setDraft(p => ({
    ...p,
    [k]: v
  }));
  if (!editing) return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDraft(goals);
      setEditing(true);
    },
    style: {
      padding: "6px 14px",
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "var(--text-secondary)",
      borderRadius: 8,
      fontSize: 12,
      cursor: "pointer"
    }
  }, "\u270E Edit Goals");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--card-bg)",
      border: "1px solid rgba(255,255,255,.08)",
      borderRadius: 12,
      padding: "16px",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontFamily: "'Syne',sans-serif",
      fontSize: 13,
      fontWeight: 800,
      margin: "0 0 14px"
    }
  }, "EDIT GOALS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, [["weightGoal", "Weight goal (lbs)", "number"], ["weightStart", "Starting weight (lbs)", "number"], ["weightDeadline", "Weight deadline", "date"], ["stepGoal", "Daily step goal", "number"], ["sleepGoal", "Sleep goal (hours)", "number"], ["loanBalance", "Loan current balance ($)", "number"], ["loanDeadline", "Loan payoff deadline", "date"], ["savingsCurrent", "Current savings ($)", "number"], ["savingsTarget", "Savings target ($)", "number"]].map(([k, lbl, type]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: lbl
  }), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: draft[k] || "",
    onChange: e => s(k, type === "number" ? parseFloat(e.target.value) : e.target.value),
    style: {
      ...inp,
      fontSize: 13,
      colorScheme: "dark"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onSave(draft);
      setEditing(false);
    },
    style: {
      flex: 1,
      padding: "11px 0",
      background: "#f4a823",
      color: "#080b11",
      border: "none",
      borderRadius: 9,
      fontSize: 13,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "SAVE \u2192"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditing(false),
    style: {
      flex: 1,
      padding: "11px 0",
      background: "transparent",
      border: "1px solid rgba(255,255,255,.1)",
      color: "var(--text-secondary)",
      borderRadius: 9,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Cancel")));
}
function Goals({
  goals: goalsData,
  onSaveGoals,
  allLogs,
  settings,
  onMilestone
}) {
  const [goalsList, setGoalsList] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [confirmGoal, setConfirmGoal] = useState(null);
  const [confirmNote, setConfirmNote] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [wins, setWins] = useState([]);
  const [winsFilter, setWinsFilter] = useState(30);
  const [weightRange, setWeightRange] = useState(30);
  const [showWizard, setShowWizard] = useState(false);
  const [trainHistory, setTrainHistory] = useState([]);
  const [financeMonthsData, setFinanceMonthsData] = useState({});
  const [habitLogs, setHabitLogs] = useState({});
  const [progressLogs, setProgressLogs] = useState({});
  const [balInputs, setBalInputs] = useState({});
  const [valInputs, setValInputs] = useState({});

  useEffect(() => {
    (async () => {
      const cg = await DB.get(KEYS.completedGoals());
      setCompletedGoals(cg || []);
      const wa = await DB.get(KEYS.winsArchive());
      setWins(wa || []);
      const th = await DB.get(KEYS.trainHistory());
      setTrainHistory(th || []);
      // Load goals — migrate old flat-object format if needed
      let arr = [];
      if (Array.isArray(goalsData)) {
        arr = goalsData;
      } else if (goalsData && typeof goalsData === "object" && (goalsData.weightGoal || goalsData.weightStart)) {
        arr = [{ id: "migrated_weight", type: "weight", label: "Weight Goal",
          startWeight: goalsData.weightStart || 0, targetWeight: goalsData.weightGoal || 0,
          direction: "lose", deadline: goalsData.weightDeadline || "",
          startDate: getToday(), createdAt: new Date().toISOString(), completedAt: null }];
      }
      setGoalsList(arr);
      // Finance data for savings goals
      const months = await DB.get(KEYS.financeAllMonths());
      if (months && months.length > 0) {
        const mObj = {};
        await Promise.all(months.map(async m => {
          const txns = await DB.get(KEYS.financeTransactions(m)) || [];
          const inc  = await DB.get(KEYS.financeIncome(m)) || [];
          mObj[m] = { txns, inc };
        }));
        setFinanceMonthsData(mObj);
      }
      // Per-goal habit + progress logs
      const hl = {}, pl = {};
      for (const g of arr) {
        if (g.type === "habit") hl[g.id] = await DB.get(KEYS.goalHabitLog(g.id)) || {};
        if (g.type === "debt" || g.type === "custom") pl[g.id] = await DB.get(KEYS.goalProgressLog(g.id)) || [];
      }
      setHabitLogs(hl);
      setProgressLogs(pl);
    })();
  }, []);
  const saveGoals = async arr => { setGoalsList(arr); onSaveGoals(arr); };

  const addGoal = async goal => {
    const updated = [...goalsList, goal];
    await saveGoals(updated);
    setShowWizard(false);
    if (goal.type === "habit") { await DB.set(KEYS.goalHabitLog(goal.id), {}); setHabitLogs(p => ({ ...p, [goal.id]: {} })); }
    if (goal.type === "debt" || goal.type === "custom") { await DB.set(KEYS.goalProgressLog(goal.id), []); setProgressLogs(p => ({ ...p, [goal.id]: [] })); }
  };
  const deleteGoal = async id => { await saveGoals(goalsList.filter(g => g.id !== id)); setDeleteConfirm(null); };
  const completeGoal = async () => {
    if (!confirmGoal) return;
    const entry = { ...confirmGoal, note: confirmNote, completedAt: new Date().toISOString() };
    const updated = [entry, ...completedGoals];
    setCompletedGoals(updated);
    await DB.set(KEYS.completedGoals(), updated);
    await saveGoals(goalsList.filter(g => g.id !== confirmGoal.id));
    setConfirmGoal(null); setConfirmNote("");
    onMilestone && onMilestone(`${confirmGoal.label} — COMPLETE! 🎉`);
  };
  const toggleHabit = async (goalId, date) => {
    const cur = habitLogs[goalId] || {};
    const updated = { ...cur, [date]: !cur[date] };
    setHabitLogs(p => ({ ...p, [goalId]: updated }));
    await DB.set(KEYS.goalHabitLog(goalId), updated);
  };
  const addProgress = async (goalId, value) => {
    const cur = progressLogs[goalId] || [];
    const updated = [...cur, { date: getToday(), value: parseFloat(value) }];
    setProgressLogs(p => ({ ...p, [goalId]: updated }));
    await DB.set(KEYS.goalProgressLog(goalId), updated);
  };
  const computeStreak = startDate => {
    const trainDates = new Set(trainHistory.map(h => h.date));
    const today = getToday();
    let cur = 0;
    let d = new Date(today);
    while (true) { const ds = d.toISOString().split("T")[0]; if (ds < startDate || !trainDates.has(ds)) break; cur++; d.setDate(d.getDate() - 1); }
    let run = 0, longest = 0;
    d = new Date(startDate);
    while (d <= new Date(today)) { const ds = d.toISOString().split("T")[0]; trainDates.has(ds) ? (run++, longest = Math.max(longest, run)) : (run = 0); d.setDate(d.getDate() + 1); }
    const last30 = [];
    for (let i = 29; i >= 0; i--) { const dd = new Date(today); dd.setDate(dd.getDate() - i); const ds = dd.toISOString().split("T")[0]; last30.push({ d: fmtDate(ds), v: trainDates.has(ds) ? 1 : 0 }); }
    return { cur, longest, last30 };
  };
  const computeSavings = startDate => {
    let totalIncome = 0, totalSpent = 0; const monthly = [];
    const startYM = startDate.substring(0, 7);
    Object.entries(financeMonthsData).sort().forEach(([m, data]) => {
      if (m < startYM) return;
      const inc = (data.inc || []).reduce((s, i) => s + (i.amount || 0), 0);
      const exp = (data.txns || []).reduce((s, t) => s + (t.amount || 0), 0);
      totalIncome += inc; totalSpent += exp;
      monthly.push({ month: m.substring(5), net: Math.round(inc - exp) });
    });
    return { netSaved: totalIncome - totalSpent, monthly };
  };
  const computeHabitStreak = (goalId, startDate) => {
    const log = habitLogs[goalId] || {}, today = getToday();
    let cur = 0; let d = new Date(today);
    while (true) { const ds = d.toISOString().split("T")[0]; if (ds < startDate || !log[ds]) break; cur++; d.setDate(d.getDate() - 1); }
    let total = 0; d = new Date(startDate);
    while (d <= new Date(today)) { const ds = d.toISOString().split("T")[0]; if (log[ds]) total++; d.setDate(d.getDate() + 1); }
    const last30 = [];
    for (let i = 29; i >= 0; i--) { const dd = new Date(today); dd.setDate(dd.getDate() - i); const ds = dd.toISOString().split("T")[0]; last30.push({ d: fmtDate(ds), v: log[ds] ? 1 : 0 }); }
    return { cur, total, last30 };
  };

  const today = getToday();
  const recentWins = wins.filter(w => daysBetween(w.date, today) <= winsFilter);
  const wtLogs = allLogs.filter(l => l.morning?.weight).sort((a, b) => a.date.localeCompare(b.date));
  const ttStyle = { background: "#111520", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, fontSize: 12 };
  const cardStyle = { background: "var(--card-bg)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "16px", marginBottom: 14 };

  const renderGoalCard = goal => {
    const meta = GOAL_CATEGORY_META[goal.type] || GOAL_CATEGORY_META.custom;
    const col = meta.color;
    const cardHeader = React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 } },
      React.createElement("div", null,
        React.createElement("span", { style: { display: "inline-block", padding: "2px 8px", background: `${col}22`, border: `1px solid ${col}44`, borderRadius: 5, color: col, fontSize: 9, fontWeight: 800, letterSpacing: ".07em", marginBottom: 6, fontFamily: "'Syne',sans-serif" } }, meta.label.toUpperCase()),
        React.createElement("p", { style: { color: "#d1d5db", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, margin: 0 } }, goal.label)
      ),
      React.createElement("div", { style: { display: "flex", gap: 6 } },
        React.createElement("button", { onClick: () => setConfirmGoal(goal), style: { padding: "5px 10px", background: `${col}22`, border: `1px solid ${col}44`, borderRadius: 7, color: col, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "\u2713 Done"),
        React.createElement("button", { onClick: () => setDeleteConfirm(goal.id), style: { padding: "5px 8px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.15)", borderRadius: 7, color: "#ef4444", fontSize: 12, cursor: "pointer" } }, "\xD7")
      )
    );

    if (goal.type === "weight") {
      const ws = goal.startWeight || 0, wg = goal.targetWeight || 0;
      const wtFiltered = wtLogs.filter(l => daysBetween(l.date, today) <= weightRange);
      const wtData = wtFiltered.map(l => ({ d: fmtDate(l.date), wt: l.morning.weight }));
      const cWt = wtLogs.length > 0 ? wtLogs[wtLogs.length - 1].morning.weight : ws;
      const totalDelta = Math.abs(ws - wg);
      const achieved = goal.direction === "gain" ? Math.max(0, cWt - ws) : Math.max(0, ws - cWt);
      const remaining = goal.direction === "gain" ? Math.max(0, wg - cWt) : Math.max(0, cWt - wg);
      const pct = totalDelta > 0 ? Math.min(100, Math.round(achieved / totalDelta * 100)) : 0;
      const dl = goal.deadline ? new Date(goal.deadline) : null;
      const daysLeft = dl ? Math.max(0, Math.ceil((dl - new Date()) / 86400000)) : null;
      let projLabel = null;
      if (wtLogs.length >= 2) {
        const first = wtLogs[0], last = wtLogs[wtLogs.length - 1];
        const daysDiff = Math.max(1, daysBetween(first.date, last.date));
        const lostPerDay = (first.morning.weight - last.morning.weight) / daysDiff;
        if ((goal.direction !== "gain" && lostPerDay > 0) || (goal.direction === "gain" && lostPerDay < 0)) {
          const proj = new Date(); proj.setDate(proj.getDate() + Math.round(remaining / Math.abs(lostPerDay)));
          projLabel = fmtDateFull(proj.toISOString().split("T")[0]);
        }
      }
      return React.createElement("div", { key: goal.id, style: { ...cardStyle, borderLeft: `3px solid ${col}` } },
        cardHeader,
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
          React.createElement("p", { style: { color: col, fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1 } }, cWt, React.createElement("span", { style: { fontSize: 13, color: "#6b7280", fontWeight: 400 } }, " lbs")),
          React.createElement(Arc, { pct, col })
        ),
        React.createElement(ProgBar, { pct, col, h: 5 }),
        React.createElement("div", { style: { display: "flex", gap: 0, marginTop: 10 } },
          React.createElement(StatCell, { lbl: goal.direction === "gain" ? "Still to Gain" : "Still to Lose", val: `${remaining.toFixed(1)} lbs`, c: col }),
          React.createElement(StatCell, { lbl: "Achieved", val: `${achieved.toFixed(1)} lbs`, c: "#4ade80" }),
          daysLeft !== null && React.createElement(StatCell, { lbl: "Days Left", val: daysLeft, c: "#60a5fa" })
        ),
        projLabel && React.createElement("p", { style: { color: "#6b7280", fontSize: 11, margin: "8px 0 10px" } }, "Current pace \u2192 reach goal by ", React.createElement("span", { style: { color: "#4ade80", fontWeight: 700 } }, projLabel)),
        wtData.length >= 2 && React.createElement("div", null,
          React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } },
            React.createElement(Lbl, { c: "Weight Trend" }),
            React.createElement("div", { style: { display: "flex", gap: 4 } },
              [30, 90, 365].map(r => React.createElement("button", { key: r, onClick: () => setWeightRange(r),
                style: { padding: "2px 7px", borderRadius: 5, fontSize: 10, cursor: "pointer", border: `1px solid ${weightRange === r ? col + "66" : "rgba(255,255,255,.07)"}`, background: weightRange === r ? col + "22" : "transparent", color: weightRange === r ? col : "#6b7280", fontWeight: weightRange === r ? 700 : 400 } }, r, "d"))
            )
          ),
          React.createElement("div", { style: { height: 120 } },
            React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
              React.createElement(LineChart, { data: wtData },
                React.createElement(XAxis, { dataKey: "d", tick: { fill: "#6b7280", fontSize: 9 }, axisLine: false, tickLine: false }),
                React.createElement(YAxis, { domain: ["auto", "auto"], tick: { fill: "#6b7280", fontSize: 9 }, axisLine: false, tickLine: false, width: 32 }),
                React.createElement(ReferenceLine, { y: wg, stroke: "#4ade80", strokeDasharray: "3 3" }),
                React.createElement(Tooltip, { contentStyle: ttStyle, labelStyle: { color: "#9ca3af" }, itemStyle: { color: col } }),
                React.createElement(Line, { type: "monotone", dataKey: "wt", stroke: col, strokeWidth: 2, dot: { fill: col, r: 2 }, name: "Weight" })
              )
            )
          )
        )
      );
    }

    if (goal.type === "fitness_streak") {
      const { cur, longest, last30 } = computeStreak(goal.startDate || today);
      const target = goal.targetDays || 30;
      const pct = Math.min(100, Math.round(cur / target * 100));
      return React.createElement("div", { key: goal.id, style: { ...cardStyle, borderLeft: `3px solid ${col}` } },
        cardHeader,
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
          React.createElement("div", null,
            React.createElement("p", { style: { color: col, fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1 } }, cur, React.createElement("span", { style: { fontSize: 13, color: "#6b7280", fontWeight: 400 } }, " day streak")),
            React.createElement("p", { style: { color: "#6b7280", fontSize: 11, margin: "4px 0 0" } }, "Target: ", target, " days \xB7 Best: ", longest, " days")
          ),
          React.createElement(Arc, { pct, col })
        ),
        React.createElement(ProgBar, { pct, col, h: 5 }),
        React.createElement("div", { style: { marginTop: 12, height: 80 } },
          React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
            React.createElement(BarChart, { data: last30, barSize: 6 },
              React.createElement(XAxis, { dataKey: "d", tick: false, axisLine: false, tickLine: false }),
              React.createElement(YAxis, { hide: true }),
              React.createElement(Tooltip, { contentStyle: ttStyle, formatter: (v) => [v ? "Worked out" : "Rest day", ""], labelFormatter: l => l }),
              React.createElement(Bar, { dataKey: "v", fill: col, radius: [3, 3, 0, 0] })
            )
          )
        ),
        React.createElement("p", { style: { color: "#555e73", fontSize: 10, textAlign: "center", margin: "4px 0 0" } }, "Last 30 days")
      );
    }

    if (goal.type === "habit") {
      const { cur, total, last30 } = computeHabitStreak(goal.id, goal.startDate || today);
      const target = goal.targetDays || 30;
      const pct = Math.min(100, Math.round(cur / target * 100));
      const todayDone = (habitLogs[goal.id] || {})[today];
      return React.createElement("div", { key: goal.id, style: { ...cardStyle, borderLeft: `3px solid ${col}` } },
        cardHeader,
        React.createElement("button", { onClick: () => toggleHabit(goal.id, today),
          style: { width: "100%", padding: "13px", marginBottom: 14, background: todayDone ? `${col}22` : "rgba(255,255,255,.03)", border: `2px solid ${todayDone ? col : "rgba(255,255,255,.08)"}`, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 } },
          React.createElement("div", { style: { width: 26, height: 26, borderRadius: "50%", background: todayDone ? col : "transparent", border: `2px solid ${todayDone ? col : "#555e73"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
            todayDone && React.createElement("span", { style: { color: "#080b11", fontWeight: 900, fontSize: 13 } }, "\u2713")),
          React.createElement("div", { style: { textAlign: "left" } },
            React.createElement("p", { style: { color: todayDone ? col : "#9ca3af", fontWeight: 700, fontSize: 13, margin: 0, fontFamily: "'Syne',sans-serif" } }, todayDone ? "Done today!" : "Mark today complete"),
            React.createElement("p", { style: { color: "#555e73", fontSize: 11, margin: "2px 0 0" } }, goal.habitName || goal.label)
          )
        ),
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
          React.createElement("p", { style: { color: col, fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, margin: 0 } }, cur, React.createElement("span", { style: { fontSize: 12, color: "#6b7280", fontWeight: 400 } }, " day streak")),
          React.createElement(Arc, { pct, col })
        ),
        React.createElement(ProgBar, { pct, col, h: 5 }),
        React.createElement("div", { style: { display: "flex", gap: 0, marginTop: 8 } },
          React.createElement(StatCell, { lbl: "Target", val: `${target} days`, c: col }),
          React.createElement(StatCell, { lbl: "Total Completions", val: total, c: "#4ade80" })
        ),
        React.createElement("div", { style: { marginTop: 10, height: 50 } },
          React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
            React.createElement(BarChart, { data: last30, barSize: 5 },
              React.createElement(XAxis, { dataKey: "d", tick: false, axisLine: false, tickLine: false }),
              React.createElement(YAxis, { hide: true }),
              React.createElement(Bar, { dataKey: "v", fill: col, radius: [3, 3, 0, 0] })
            )
          )
        ),
        React.createElement("p", { style: { color: "#555e73", fontSize: 10, textAlign: "center", margin: "2px 0 0" } }, "Last 30 days")
      );
    }

    if (goal.type === "savings") {
      const { netSaved, monthly } = computeSavings(goal.startDate || today);
      const target = goal.targetAmount || 1;
      const pct = Math.min(100, Math.max(0, Math.round(netSaved / target * 100)));
      const dl = goal.deadline ? new Date(goal.deadline) : null;
      const daysLeft = dl ? Math.max(0, Math.ceil((dl - new Date()) / 86400000)) : null;
      return React.createElement("div", { key: goal.id, style: { ...cardStyle, borderLeft: `3px solid ${col}` } },
        cardHeader,
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
          React.createElement("div", null,
            React.createElement("p", { style: { color: col, fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1 } }, "$", Math.round(netSaved).toLocaleString(), React.createElement("span", { style: { fontSize: 12, color: "#6b7280", fontWeight: 400 } }, " saved")),
            React.createElement("p", { style: { color: "#6b7280", fontSize: 11, margin: "4px 0 0" } }, "Target: $", target.toLocaleString(), daysLeft !== null ? ` \xB7 ${daysLeft} days left` : "")
          ),
          React.createElement(Arc, { pct, col })
        ),
        React.createElement(ProgBar, { pct, col, h: 5 }),
        React.createElement("div", { style: { display: "flex", gap: 0, marginTop: 8 } },
          React.createElement(StatCell, { lbl: "Still Needed", val: `$${Math.max(0, Math.round(target - netSaved)).toLocaleString()}`, c: col }),
          React.createElement(StatCell, { lbl: "Progress", val: `${pct}%`, c: "#4ade80" })
        ),
        Object.keys(financeMonthsData).length === 0 && React.createElement("p", { style: { color: "#555e73", fontSize: 11, margin: "10px 0 0", textAlign: "center" } }, "Import Finance data to auto-track progress."),
        monthly.length >= 2 && React.createElement("div", { style: { marginTop: 12, height: 100 } },
          React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
            React.createElement(BarChart, { data: monthly },
              React.createElement(XAxis, { dataKey: "month", tick: { fill: "#6b7280", fontSize: 9 }, axisLine: false, tickLine: false }),
              React.createElement(YAxis, { tick: { fill: "#6b7280", fontSize: 9 }, axisLine: false, tickLine: false, width: 40 }),
              React.createElement(Tooltip, { contentStyle: ttStyle, formatter: v => [`$${v.toLocaleString()}`, "Net"] }),
              React.createElement(Bar, { dataKey: "net", fill: col, radius: [3, 3, 0, 0] })
            )
          )
        )
      );
    }

    if (goal.type === "debt") {
      const entries = progressLogs[goal.id] || [];
      const startBal = goal.startBalance || 0;
      const currentBal = entries.length > 0 ? entries[entries.length - 1].value : startBal;
      const paid = Math.max(0, startBal - currentBal);
      const pct = startBal > 0 ? Math.min(100, Math.round(paid / startBal * 100)) : 0;
      const dl = goal.deadline ? new Date(goal.deadline) : null;
      const daysLeft = dl ? Math.max(0, Math.ceil((dl - new Date()) / 86400000)) : null;
      const chartData = [{ d: "Start", bal: startBal }, ...entries.map(e => ({ d: fmtDate(e.date), bal: e.value }))];
      return React.createElement("div", { key: goal.id, style: { ...cardStyle, borderLeft: `3px solid ${col}` } },
        cardHeader,
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
          React.createElement("div", null,
            React.createElement("p", { style: { color: col, fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1 } }, "$", Math.round(currentBal).toLocaleString(), React.createElement("span", { style: { fontSize: 12, color: "#6b7280", fontWeight: 400 } }, " remaining")),
            React.createElement("p", { style: { color: "#6b7280", fontSize: 11, margin: "4px 0 0" } }, "Started: $", startBal.toLocaleString(), daysLeft !== null ? ` \xB7 ${daysLeft} days left` : "")
          ),
          React.createElement(Arc, { pct, col })
        ),
        React.createElement(ProgBar, { pct, col, h: 5 }),
        React.createElement("div", { style: { display: "flex", gap: 0, marginTop: 8, marginBottom: 12 } },
          React.createElement(StatCell, { lbl: "Paid Off", val: `$${Math.round(paid).toLocaleString()}`, c: "#4ade80" }),
          React.createElement(StatCell, { lbl: "Remaining", val: `$${Math.round(currentBal).toLocaleString()}`, c: col })
        ),
        React.createElement("div", { style: { display: "flex", gap: 8 } },
          React.createElement("input", { type: "number", value: balInputs[goal.id] || "", onChange: e => setBalInputs(p => ({ ...p, [goal.id]: e.target.value })), placeholder: "Update current balance...", style: { ...inp, flex: 1, fontSize: 12 } }),
          React.createElement("button", { onClick: () => { if (!balInputs[goal.id]) return; addProgress(goal.id, balInputs[goal.id]); setBalInputs(p => ({ ...p, [goal.id]: "" })); },
            style: { padding: "0 14px", background: col, color: "#080b11", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "Update")
        ),
        chartData.length >= 2 && React.createElement("div", { style: { marginTop: 12, height: 100 } },
          React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
            React.createElement(LineChart, { data: chartData },
              React.createElement(XAxis, { dataKey: "d", tick: { fill: "#6b7280", fontSize: 9 }, axisLine: false, tickLine: false }),
              React.createElement(YAxis, { domain: ["auto", "auto"], tick: { fill: "#6b7280", fontSize: 9 }, axisLine: false, tickLine: false, width: 40 }),
              React.createElement(ReferenceLine, { y: 0, stroke: "#4ade80", strokeDasharray: "3 3" }),
              React.createElement(Tooltip, { contentStyle: ttStyle, formatter: v => [`$${v.toLocaleString()}`, "Balance"] }),
              React.createElement(Line, { type: "monotone", dataKey: "bal", stroke: col, strokeWidth: 2, dot: { fill: col, r: 3 }, name: "Balance" })
            )
          )
        )
      );
    }

    // Custom
    const entries = progressLogs[goal.id] || [];
    const startVal = goal.startValue || 0;
    const currentVal = entries.length > 0 ? entries[entries.length - 1].value : startVal;
    const targetVal = goal.targetValue || 1;
    const achieved = Math.max(0, currentVal - startVal);
    const total = Math.max(1, targetVal - startVal);
    const pct = Math.min(100, Math.round(achieved / total * 100));
    const dl = goal.deadline ? new Date(goal.deadline) : null;
    const daysLeft = dl ? Math.max(0, Math.ceil((dl - new Date()) / 86400000)) : null;
    return React.createElement("div", { key: goal.id, style: { ...cardStyle, borderLeft: `3px solid ${col}` } },
      cardHeader,
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
        React.createElement("div", null,
          React.createElement("p", { style: { color: col, fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1 } }, currentVal, React.createElement("span", { style: { fontSize: 12, color: "#6b7280", fontWeight: 400 } }, " ", goal.unit || "")),
          React.createElement("p", { style: { color: "#6b7280", fontSize: 11, margin: "4px 0 0" } }, "Target: ", targetVal, " ", goal.unit || "", daysLeft !== null ? ` \xB7 ${daysLeft} days left` : "")
        ),
        React.createElement(Arc, { pct, col })
      ),
      React.createElement(ProgBar, { pct, col, h: 5 }),
      React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 12 } },
        React.createElement("input", { type: "number", value: valInputs[goal.id] || "", onChange: e => setValInputs(p => ({ ...p, [goal.id]: e.target.value })), placeholder: `Log current ${goal.unit || "value"}...`, style: { ...inp, flex: 1, fontSize: 12 } }),
        React.createElement("button", { onClick: () => { if (!valInputs[goal.id]) return; addProgress(goal.id, valInputs[goal.id]); setValInputs(p => ({ ...p, [goal.id]: "" })); },
          style: { padding: "0 14px", background: col, color: "#080b11", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "Log")
      )
    );
  };

  return React.createElement("div", null,
    showWizard && React.createElement(GoalWizard, { onSave: addGoal, onClose: () => setShowWizard(false) }),
    confirmGoal && React.createElement(React.Fragment, null,
      React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200 }, onClick: () => setConfirmGoal(null) }),
      React.createElement("div", { style: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "calc(100% - 40px)", maxWidth: 360, background: "#0e1420", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "20px", zIndex: 201 } },
        React.createElement("p", { style: { color: "#4ade80", fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, margin: "0 0 4px" } }, "Mark as Complete?"),
        React.createElement("p", { style: { color: "#9ca3af", fontSize: 13, margin: "0 0 14px" } }, confirmGoal.label),
        React.createElement("input", { type: "text", value: confirmNote, onChange: e => setConfirmNote(e.target.value), placeholder: "Add a note (optional)...", style: { ...inp, marginBottom: 12, fontSize: 13 } }),
        React.createElement("div", { style: { display: "flex", gap: 8 } },
          React.createElement("button", { onClick: completeGoal, style: { flex: 1, padding: "11px 0", background: "#4ade80", color: "#080b11", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "CONFIRM \u2713"),
          React.createElement("button", { onClick: () => setConfirmGoal(null), style: { flex: 1, padding: "11px 0", background: "transparent", border: "1px solid rgba(255,255,255,.1)", color: "#6b7280", borderRadius: 9, fontSize: 13, cursor: "pointer" } }, "Cancel")
        )
      )
    ),
    deleteConfirm && React.createElement(React.Fragment, null,
      React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200 }, onClick: () => setDeleteConfirm(null) }),
      React.createElement("div", { style: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "calc(100% - 40px)", maxWidth: 340, background: "#0e1420", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "20px", zIndex: 201 } },
        React.createElement("p", { style: { color: "#ef4444", fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, margin: "0 0 8px" } }, "Delete this goal?"),
        React.createElement("p", { style: { color: "#6b7280", fontSize: 12, margin: "0 0 16px" } }, "This cannot be undone."),
        React.createElement("div", { style: { display: "flex", gap: 8 } },
          React.createElement("button", { onClick: () => deleteGoal(deleteConfirm), style: { flex: 1, padding: "10px 0", background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", color: "#ef4444", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "Delete"),
          React.createElement("button", { onClick: () => setDeleteConfirm(null), style: { flex: 1, padding: "10px 0", background: "transparent", border: "1px solid rgba(255,255,255,.1)", color: "#6b7280", borderRadius: 9, fontSize: 13, cursor: "pointer" } }, "Cancel")
        )
      )
    ),
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 } },
      React.createElement(SectionHead, { label: "My Goals", color: "#34d399" }),
      React.createElement("button", { onClick: () => setShowWizard(true), style: { padding: "8px 14px", background: "rgba(52,211,153,.12)", border: "1px solid rgba(52,211,153,.25)", color: "#34d399", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "+ Add Goal")
    ),
    goalsList.length === 0 && React.createElement("div", { style: { textAlign: "center", padding: "40px 20px", background: "var(--card-bg)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, marginBottom: 14 } },
      React.createElement("p", { style: { color: "#555e73", fontSize: 14, margin: "0 0 16px" } }, "No active goals yet."),
      React.createElement("button", { onClick: () => setShowWizard(true), style: { padding: "11px 20px", background: "#34d399", color: "#080b11", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "Set Your First Goal \u2192")
    ),
    ...goalsList.map(g => renderGoalCard(g)),
    wins.length > 0 && React.createElement("div", { style: { marginBottom: 14 } },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
        React.createElement(Lbl, { c: "Wins Archive" }),
        React.createElement("div", { style: { display: "flex", gap: 4 } },
          [7, 30, 90].map(f => React.createElement("button", { key: f, onClick: () => setWinsFilter(f),
            style: { padding: "2px 7px", borderRadius: 5, fontSize: 10, cursor: "pointer", border: `1px solid ${winsFilter === f ? "rgba(74,222,128,.4)" : "rgba(255,255,255,.07)"}`, background: winsFilter === f ? "rgba(74,222,128,.12)" : "transparent", color: winsFilter === f ? "#4ade80" : "#6b7280", fontWeight: winsFilter === f ? 700 : 400 } }, f, "d"))
        )
      ),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 5 } },
        recentWins.length === 0
          ? React.createElement("p", { style: { color: "#555e73", fontSize: 12, margin: 0, textAlign: "center", padding: "12px 0" } }, "No wins in the last ", winsFilter, " days.")
          : recentWins.slice(0, 10).map((w, i) => React.createElement("div", { key: i,
              style: { display: "flex", gap: 10, padding: "9px 12px", background: "var(--card-bg)", borderRadius: 9, border: "1px solid rgba(255,255,255,.06)", alignItems: "flex-start" } },
              React.createElement("span", { style: { color: "#f4a823", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 } }, fmtDate(w.date)),
              React.createElement("span", { style: { color: "#c9ccd4", fontSize: 12, flex: 1 } }, w.win)
            ))
      )
    ),
    completedGoals.length > 0 && React.createElement("div", null,
      React.createElement(Lbl, { c: "Completed Goals" }),
      completedGoals.map((g, i) => React.createElement("div", { key: i,
        style: { background: "rgba(74,222,128,.04)", border: "1px solid rgba(74,222,128,.12)", borderRadius: 10, padding: "11px 13px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
        React.createElement("div", null,
          React.createElement("p", { style: { color: "#d1d5db", fontSize: 13, fontWeight: 600, margin: "0 0 2px" } }, g.label),
          g.note && React.createElement("p", { style: { color: "#6b7280", fontSize: 11, margin: "0 0 2px", fontStyle: "italic" } }, "\u201C", g.note, "\u201D"),
          React.createElement("p", { style: { color: "#555e73", fontSize: 10, margin: 0 } }, "Completed ", g.completedAt ? fmtDateFull(g.completedAt.split("T")[0]) : "")
        ),
        React.createElement("span", { style: { background: "rgba(74,222,128,.15)", color: "#4ade80", fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "3px 9px", flexShrink: 0 } }, "DONE \u2713")
      ))
    )
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUNDAY TAB — full weekly review with all new sections
// ─────────────────────────────────────────────────────────────────────────────
const PILLARS = [{
  id: "family",
  l: "Family & Friends",
  c: "#f4a823"
}, {
  id: "faith",
  l: "Faith",
  c: "#a78bfa"
}, {
  id: "fitness",
  l: "Fitness & Health",
  c: "#4ade80"
}, {
  id: "finance",
  l: "Finance",
  c: "#34d399"
}, {
  id: "learning",
  l: "Learning & Growth",
  c: "#60a5fa"
}, {
  id: "fun",
  l: "Fun & Social",
  c: "#fb923c"
}, {
  id: "marriage",
  l: "Marriage",
  c: "#f472b6"
}];
function SundayBrief({
  wk,
  pillarScores,
  weekWin,
  weekNote,
  settings,
  allSundays
}) {
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);
  const buildCtx = () => {
    const ml = wk.filter(d => d.morning),
      el = wk.filter(d => d.evening);
    const wtV = ml.filter(d => d.morning?.weight);
    const avgWt = wtV.length ? (wtV.reduce((a, d) => a + d.morning.weight, 0) / wtV.length).toFixed(1) : null;
    const mob = ml.filter(d => (d.morning?.mobilityCount || 0) > 0).length;
    const ca = el.filter(d => d.evening?.cardio).length;
    const st = el.filter(d => d.evening?.strength).length;
    const snFree = el.filter(d => d.evening?.snack === 0).length;
    const snHeavy = el.filter(d => d.evening?.snack === 3).length;
    const fwCount = el.filter(d => d.evening?.financeWin).length;
    const hy = ml.filter(d => d.morning?.hydration).length;
    const drV = el.filter(d => d.evening?.dayRating > 0);
    const avgDr = drV.length ? (drV.reduce((a, d) => a + d.evening.dayRating, 0) / drV.length).toFixed(1) : null;
    const enV = ml.filter(d => d.morning?.energy > 0);
    const avgEn = enV.length ? (enV.reduce((a, d) => a + d.morning.energy, 0) / enV.length).toFixed(1) : null;
    const moodV = ml.filter(d => d.morning?.mood > 0);
    const avgMood = moodV.length ? (moodV.reduce((a, d) => a + d.morning.mood, 0) / moodV.length).toFixed(1) : null;
    const steps = ml.reduce((a, d) => a + (d.morning?.steps || 0), 0);
    const wins = el.filter(d => d.evening?.win).map(d => d.evening.win).join(" | ");
    const choresDone = el.filter(d => d.evening?.choresDone).length;
    const familyMoments = el.filter(d => d.evening?.familyMoment).length;
    const exceptional = wk.filter(d => d.morning?.exceptionalDay || d.evening?.exceptionalDay).length;
    const pillars = Object.entries(pillarScores || {}).map(([k, v]) => `${k}:${v}/5`).join(",");
    const prevWeeks = allSundays.slice(0, 4).map(s => `[Week of ${s.date}: mood=${s.avgMood || "?"},energy=${s.avgEnergy || "?"},snackFree=${s.snackFree || 0}/7,cardio=${s.cardio || 0}/7]`).join(" ");
    return `THIS WEEK|${wk.length}days|Weight:${avgWt || "?"}lbs|Mob:${mob}/7|Cardio:${ca}/7|Strength:${st}/7|SnackFree:${snFree}/7|SnackHeavy:${snHeavy}|Hy:${hy}/${ml.length}|Steps:${steps}|AvgDr:${avgDr || "?"}/5|AvgEnergy:${avgEn || "?"}/5|AvgMood:${avgMood || "?"}/5|FinanceWins:${fwCount}|ChoresDone:${choresDone}|FamilyMoments:${familyMoments}|Exceptional:${exceptional}|Pillars:${pillars}|Wins:${wins}|WeekWin:${weekWin || "none"}|Gap:${weekNote || "none"}||PREVIOUS_WEEKS(most recent first):${prevWeeks || "none"}`;
  };
  const generate = async () => {
    setLoading(true);
    setBrief("");
    setGenerated(false);
    const ctx = buildCtx();
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are Ryan's accountability partner. Ryan: 32, married to ${settings?.partnerName || "Sabrina"}, father of ${settings?.sonName || "a young son"}, High D/I personality, former athlete, 7 Pillars life framework.\n\nWrite a 5-line Sunday accountability brief:\n- Line 1 (Result): Biggest result with specific numbers.\n- Line 2 (Gap): The real gap — identify the data pattern, be direct, no softening.\n- Line 3 (Win): Something specific that went well this week.\n- Line 4 (Focus): The gap reframed as one concrete action for next week.\n- Line 5 (Close): One short sentence that lands. No fluff.\n\nIf previous weeks data is provided, reference trends across weeks — not just this week.\nTone: Direct, warm, no lectures, no guilt trips. Ryan responds to honesty and specific wins.`,
          messages: [{
            role: "user",
            content: `Data:\n\n${ctx}\n\nWrite the 5-line brief.`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "Couldn't generate.";
      setBrief(text);
      setGenerated(true);
      // Auto-cache
      const sun = (await DB.get(KEYS.weekReview(getSundayKey()))) || {};
      await DB.set(KEYS.weekReview(getSundayKey()), {
        ...sun,
        aiBrief: text,
        briefGeneratedAt: new Date().toISOString()
      });
    } catch {
      setBrief("Couldn't connect. Try again.");
    }
    setLoading(false);
  };
  const lines = brief ? brief.split("\n").filter(l => l.trim()) : [];
  const lc = ["#f4a823", "#ef4444", "#4ade80", "#60a5fa", "#a78bfa"];
  const ll = ["Result", "Gap", "Win", "Focus", "Close"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "AI Accountability Brief"
  }), generated && !loading && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      navigator.clipboard.writeText(brief);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    style: {
      background: copied ? "rgba(74,222,128,.15)" : "var(--card-bg-3)",
      border: `1px solid ${copied ? "rgba(74,222,128,.3)" : "var(--card-border-2)"}`,
      color: copied ? "#4ade80" : "var(--text-secondary)",
      borderRadius: 6,
      padding: "3px 10px",
      fontSize: 10,
      cursor: "pointer",
      fontWeight: copied ? 700 : 400
    }
  }, copied ? "COPIED ✓" : "COPY")), !generated && !loading && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,.025)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 12,
      padding: "14px",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 12,
      margin: "0 0 12px",
      lineHeight: 1.6
    }
  }, "5-line brief from your week data + all previous Sunday history."), /*#__PURE__*/React.createElement("button", {
    onClick: generate,
    style: {
      width: "100%",
      padding: "13px 0",
      background: "linear-gradient(135deg,rgba(167,139,250,.2),rgba(96,165,250,.2))",
      border: "1px solid rgba(167,139,250,.35)",
      color: "#c4b5fd",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif",
      letterSpacing: ".05em"
    }
  }, "GENERATE THIS WEEK'S BRIEF \u2192")), loading && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(167,139,250,.06)",
      border: "1px solid rgba(167,139,250,.15)",
      borderRadius: 12,
      padding: "18px",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "#a78bfa",
      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
    }
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#a78bfa",
      fontSize: 12,
      margin: 0
    }
  }, "Reading your week..."), /*#__PURE__*/React.createElement("style", null, `@keyframes pulse{0%,100%{opacity:.2}50%{opacity:1}}`)), generated && !loading && lines.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,.025)",
      border: "1px solid rgba(255,255,255,.08)",
      borderRadius: 12,
      overflow: "hidden"
    }
  }, lines.map((line, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      borderBottom: i < lines.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 3,
      background: lc[i] || "var(--text-secondary)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "12px 14px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      color: lc[i] || "var(--text-secondary)",
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: ".07em",
      textTransform: "uppercase",
      marginBottom: 3
    }
  }, ll[i] || ""), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-primary)",
      fontSize: 13,
      margin: 0,
      lineHeight: 1.6
    }
  }, line)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      background: "rgba(255,255,255,.02)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 10,
      margin: 0
    }
  }, "Generated ", fmtDate(getToday())), /*#__PURE__*/React.createElement("button", {
    onClick: generate,
    style: {
      background: "transparent",
      border: "1px solid rgba(255,255,255,.08)",
      color: "var(--text-secondary)",
      borderRadius: 6,
      padding: "3px 10px",
      fontSize: 10,
      cursor: "pointer"
    }
  }, "Regenerate"))));
}
function Sunday({
  wk,
  allLogs,
  settings,
  allSundays,
  choreTasks
}) {
  const allLogsArr = allLogs || [];
  const [selectedSunday, setSelectedSunday] = useState(getSundayKey());
  const isCurrentWeek = selectedSunday === getSundayKey();
  const [view, setView] = useState("review");
  const [histDate, setHistDate] = useState(getToday());
  const [histLog, setHistLog] = useState(null);
  useEffect(() => {
    if (view === "history") {
      DB.get(KEYS.log(histDate)).then(l => setHistLog(l || null));
    }
  }, [view, histDate]);
  const [ps, setPs] = useState({});
  const [wn, setWn] = useState("");
  const [ww, setWw] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [pagesRead, setPagesRead] = useState("");
  const [reflection, setReflection] = useState("");
  const [faithNote, setFaithNote] = useState("");
  const [faithScripture, setFaithScripture] = useState("");
  const [faithMoment, setFaithMoment] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState("");
  const [addingMs, setAddingMs] = useState(false);
  const [financeBalance, setFinanceBalance] = useState("");
  const [financePayment, setFinancePayment] = useState("");
  const [financeSavings, setFinanceSavings] = useState("");
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const sunKey = getSundayKey();
  useEffect(() => {
    (async () => {
      const d = await DB.get(KEYS.weekReview(sunKey));
      if (d) {
        setPs(d.pillarScores || {});
        setWn(d.weekNote || "");
        setWw(d.weekWin || "");
        setBookTitle(d.bookTitle || "");
        setPagesRead(d.pagesRead || "");
        setReflection(d.reflection || "");
        setFaithNote(d.faithNote || "");
        setFaithScripture(d.faithScripture || "");
        setFaithMoment(d.faithMoment || "");
        setFinanceBalance(d.financeBalance || "");
        setFinancePayment(d.financePayment || "");
        setFinanceSavings(d.financeSavings || "");
      }
      const ms = await DB.get(KEYS.milestones());
      setMilestones(ms || []);
    })();
  }, []);
  const reviewData = {
    pillarScores: ps,
    weekNote: wn,
    weekWin: ww,
    bookTitle,
    pagesRead,
    reflection,
    faithNote,
    faithScripture,
    faithMoment,
    financeBalance,
    financePayment,
    financeSavings
  };
  useAutoSave(KEYS.weekReview(sunKey), reviewData);
  const go = async () => {
    setBusy(true);
    await DB.set(KEYS.weekReview(sunKey), {
      ...reviewData,
      savedAt: new Date().toISOString()
    });
    // Save to allSundays history + permanent sunday index
    const ml = wk.filter(d => d.morning),
      el = wk.filter(d => d.evening);
    const summary = {
      date: sunKey,
      avgMood: ml.filter(d => d.morning?.mood > 0).length ? (ml.filter(d => d.morning?.mood > 0).reduce((a, d) => a + d.morning.mood, 0) / ml.filter(d => d.morning?.mood > 0).length).toFixed(1) : null,
      avgEnergy: ml.filter(d => d.morning?.energy > 0).length ? (ml.filter(d => d.morning?.energy > 0).reduce((a, d) => a + d.morning.energy, 0) / ml.filter(d => d.morning?.energy > 0).length).toFixed(1) : null,
      snackFree: el.filter(d => d.evening?.snack === 0).length,
      cardio: el.filter(d => d.evening?.cardio).length,
      strength: el.filter(d => d.evening?.strength).length,
      pillarScores: ps,
      weekWin: ww,
      weekNote: wn,
      bookTitle,
      pagesRead,
      financeBalance,
      financePayment,
      financeSavings,
      faithNote: faithNote.slice(0, 200),
      savedAt: new Date().toISOString()
    };
    const allS = (await DB.get(KEYS.allSundays())) || [];
    const filtered = allS.filter(s => s.date !== sunKey);
    const updatedAllS = [summary, ...filtered].slice(0, 104); // keep 2 years
    await DB.set(KEYS.allSundays(), updatedAllS);
    // Also save to permanent firebase index keyed by date — survives allSundays array rotation
    await DB.set(KEYS.sundayIndex() + ":" + sunKey, summary);
    setBusy(false);
    setOk(true);
  };
  const addMilestone = async () => {
    if (!newMilestone.trim()) return;
    const entry = {
      text: newMilestone,
      date: getToday(),
      timestamp: new Date().toISOString()
    };
    const updated = [entry, ...milestones];
    setMilestones(updated);
    await DB.set(KEYS.milestones(), updated);
    setNewMilestone("");
    setAddingMs(false);
  };
  const startVoice = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Voice input not supported on this browser. Use Chrome on Android.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.continuous = false;
    r.lang = "en-CA";
    r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onresult = e => {
      const t = e.results[0][0].transcript;
      setReflection(prev => (prev ? prev + " " : "") + t);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start();
  };

  // Stats
  const ml = wk.filter(d => d.morning),
    el = wk.filter(d => d.evening);
  const mobS = ml.filter(d => (d.morning?.mobilityCount || 0) > 0).length;
  const mobM = ml.reduce((a, d) => a + (d.morning?.mobilityCount || 0), 0);
  const ca = el.filter(d => d.evening?.cardio).length;
  const st = el.filter(d => d.evening?.strength).length;
  const snFree = el.filter(d => d.evening?.snack === 0).length;
  const wtV = ml.filter(d => d.morning?.weight);
  const avgWt = wtV.length ? (wtV.reduce((a, d) => a + d.morning.weight, 0) / wtV.length).toFixed(1) : null;
  const drV = el.filter(d => d.evening?.dayRating > 0);
  const avgDr = drV.length ? (drV.reduce((a, d) => a + d.evening.dayRating, 0) / drV.length).toFixed(1) : null;
  const fwC = el.filter(d => d.evening?.financeWin).length;
  const hyC = ml.filter(d => d.morning?.hydration).length;
  const enV = ml.filter(d => d.morning?.energy > 0);
  const avgEn = enV.length ? (enV.reduce((a, d) => a + d.morning.energy, 0) / enV.length).toFixed(1) : null;
  const moodV = ml.filter(d => d.morning?.mood > 0);
  const avgMood = moodV.length ? (moodV.reduce((a, d) => a + d.morning.mood, 0) / moodV.length).toFixed(1) : null;
  const avgSteps = ml.filter(d => d.morning?.steps > 0).length ? (ml.filter(d => d.morning?.steps > 0).reduce((a, d) => a + (d.morning?.steps || 0), 0) / ml.filter(d => d.morning?.steps > 0).length).toFixed(0) : null;
  const wins = el.filter(d => d.evening?.win).map(d => ({
    date: d.date,
    w: d.evening.win
  }));
  const grats = ml.filter(d => d.morning?.gratitude).map(d => ({
    date: d.date,
    g: d.morning.gratitude
  }));
  const familyMs = el.filter(d => d.evening?.familyMoment).map(d => ({
    date: d.date,
    m: d.evening.familyMoment
  }));
  const exDays = wk.filter(d => d.morning?.exceptionalDay || d.evening?.exceptionalDay).length;
  // Chore summary
  const overdueChores = choreTasks ? choreTasks.filter(t => {
    const nd = addDays(t.last, t.freq);
    return daysBetween(getToday(), nd) < 0;
  }).length : 0;
  const weekChoresDone = el.filter(d => d.evening?.choresDone).length;
  // Sleep insights
  const sleepData = ml.filter(d => d.morning?.wakeTime && d.evening?.bedtime && d.morning?.energy);
  const sleepCorr = sleepData.map(d => {
    const b = d.evening?.bedtime,
      w = d.morning.wakeTime;
    if (!b || !w) return null;
    const [bh, bm] = b.split(":").map(Number);
    const [wh, wm] = w.split(":").map(Number);
    let mins = wh * 60 + wm - (bh * 60 + bm);
    if (mins < 0) mins += 1440;
    return {
      h: parseFloat((mins / 60).toFixed(1)),
      en: d.morning.energy,
      date: d.date
    };
  }).filter(Boolean);
  const shortSleep = sleepCorr.filter(s => s.h < 6),
    longSleep = sleepCorr.filter(s => s.h >= 6);
  const avgEnShort = shortSleep.length ? (shortSleep.reduce((a, s) => a + s.en, 0) / shortSleep.length).toFixed(1) : null;
  const avgEnLong = longSleep.length ? (longSleep.reduce((a, s) => a + s.en, 0) / longSleep.length).toFixed(1) : null;
  const ttStyle = {
    background: "#111520",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 8,
    fontSize: 12
  };
  const wtChart = wtV.map(d => ({
    d: fmtShort(d.date),
    wt: d.morning.weight
  }));
  const woChart = wk.map(d => ({
    d: fmtShort(d.date),
    M: (d.morning?.mobilityCount || 0) > 0 ? 1 : 0,
    C: d.evening?.cardio ? 1 : 0,
    S: d.evening?.strength ? 1 : 0
  }));
  const snChart = el.filter(d => d.evening?.snack != null).map(d => ({
    d: fmtShort(d.date),
    sn: d.evening.snack
  }));
  const moodChart = ml.filter(d => d.morning?.mood > 0 || d.morning?.energy > 0).map(d => ({
    d: fmtShort(d.date),
    mood: d.morning?.mood || 0,
    energy: d.morning?.energy || 0
  }));
  const SC = ({
    lbl,
    val,
    sub,
    c = "#f4a823"
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--card-bg-3)",
      border: "1px solid rgba(255,255,255,.06)",
      borderRadius: 10,
      padding: "11px 12px",
      flex: "1 1 76px"
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
      fontSize: 20,
      fontWeight: 800,
      margin: "0 0 1px",
      fontFamily: "'Syne',sans-serif"
    }
  }, val ?? "-"), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 9,
      margin: 0
    }
  }, sub));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    label: "Sunday Review",
    color: "#4ade80"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#404755",
      fontSize: 12,
      margin: "0 0 0 13px"
    }
  }, wk.length, " days logged this week")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      borderRadius: 8,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,.09)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("review"),
    style: {
      padding: "6px 11px",
      border: "none",
      background: view === "review" ? "rgba(74,222,128,.15)" : "transparent",
      color: view === "review" ? "#4ade80" : "var(--text-secondary)",
      fontWeight: view === "review" ? 700 : 400,
      fontSize: 11,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "WEEK"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("history"),
    style: {
      padding: "6px 11px",
      border: "none",
      background: view === "history" ? "rgba(96,165,250,.15)" : "transparent",
      color: view === "history" ? "#60a5fa" : "var(--text-secondary)",
      fontWeight: view === "history" ? 700 : 400,
      fontSize: 11,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "HISTORY"))), view === "history" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(HistoryStrip, {
    selectedDate: histDate,
    onSelectDate: d => {
      setHistDate(d);
      setHistLog(null);
      DB.get(KEYS.log(d)).then(l => setHistLog(l || null));
    },
    allLogs: allLogsArr,
    accentColor: "#f4a823"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontSize: 12,
      fontWeight: 700,
      margin: "0 0 12px"
    }
  }, fmtMid(histDate), " \u2014 Morning"), /*#__PURE__*/React.createElement(MorningReadOnly, {
    log: histLog,
    date: histDate
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#60a5fa",
      fontSize: 12,
      fontWeight: 700,
      margin: "20px 0 12px"
    }
  }, fmtMid(histDate), " \u2014 Evening"), /*#__PURE__*/React.createElement(EveningReadOnly, {
    log: histLog,
    date: histDate
  })), view === "review" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SundayBrief, {
    wk: wk,
    pillarScores: ps,
    weekWin: ww,
    weekNote: wn,
    settings: settings,
    allSundays: allSundays
  }), /*#__PURE__*/React.createElement(Lbl, {
    c: "At a Glance"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(SC, {
    lbl: "Avg Weight",
    val: avgWt,
    sub: "lbs",
    c: "#f4a823"
  }), /*#__PURE__*/React.createElement(SC, {
    lbl: "Mobility",
    val: `${mobS}/7`,
    sub: `${mobM} moves`,
    c: "#fb923c"
  }), /*#__PURE__*/React.createElement(SC, {
    lbl: "Snack-Free",
    val: snFree,
    sub: "evenings",
    c: "#60a5fa"
  }), /*#__PURE__*/React.createElement(SC, {
    lbl: "Day Rating",
    val: avgDr,
    sub: "avg /5",
    c: "#a78bfa"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(SC, {
    lbl: "Cardio",
    val: `${ca}/7`,
    c: "#60a5fa"
  }), /*#__PURE__*/React.createElement(SC, {
    lbl: "Strength",
    val: `${st}/7`,
    c: "#4ade80"
  }), /*#__PURE__*/React.createElement(SC, {
    lbl: "Hydration",
    val: `${hyC}/7`,
    c: "#34d399"
  }), /*#__PURE__*/React.createElement(SC, {
    lbl: "Finance Wins",
    val: fwC,
    c: "#34d399"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      marginBottom: 18
    }
  }, avgEn && /*#__PURE__*/React.createElement(SC, {
    lbl: "Avg Energy",
    val: avgEn,
    sub: "/5 morning",
    c: "#60a5fa"
  }), avgMood && /*#__PURE__*/React.createElement(SC, {
    lbl: "Avg Mood",
    val: avgMood,
    sub: "/5 morning",
    c: "#f472b6"
  }), avgSteps && /*#__PURE__*/React.createElement(SC, {
    lbl: "Avg Steps",
    val: parseInt(avgSteps).toLocaleString(),
    c: "#4ade80"
  }), exDays > 0 && /*#__PURE__*/React.createElement(SC, {
    lbl: "Exceptional",
    val: exDays,
    sub: "days flagged",
    c: "#a78bfa"
  })), wtChart.length >= 2 && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Weight Trend"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 110
      }
    }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
      width: "100%",
      height: "100%"
    }, /*#__PURE__*/React.createElement(LineChart, {
      data: wtChart
    }, /*#__PURE__*/React.createElement(XAxis, {
      dataKey: "d",
      tick: {
        fill: "var(--text-secondary)",
        fontSize: 10
      },
      axisLine: false,
      tickLine: false
    }), /*#__PURE__*/React.createElement(YAxis, {
      domain: ["auto", "auto"],
      tick: {
        fill: "var(--text-secondary)",
        fontSize: 10
      },
      axisLine: false,
      tickLine: false,
      width: 34
    }), /*#__PURE__*/React.createElement(Tooltip, {
      contentStyle: ttStyle,
      labelStyle: {
        color: "#9ca3af"
      },
      itemStyle: {
        color: "#f4a823"
      }
    }), /*#__PURE__*/React.createElement(Line, {
      type: "monotone",
      dataKey: "wt",
      stroke: "#f4a823",
      strokeWidth: 2,
      dot: {
        fill: "#f4a823",
        r: 2
      },
      name: "Weight"
    }))))),
    s: {
      marginBottom: 12
    }
  }), woChart.length > 0 && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Daily Workouts"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 100
      }
    }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
      width: "100%",
      height: "100%"
    }, /*#__PURE__*/React.createElement(BarChart, {
      data: woChart,
      barGap: 2,
      barSize: 8
    }, /*#__PURE__*/React.createElement(XAxis, {
      dataKey: "d",
      tick: {
        fill: "var(--text-secondary)",
        fontSize: 10
      },
      axisLine: false,
      tickLine: false
    }), /*#__PURE__*/React.createElement(Tooltip, {
      contentStyle: ttStyle,
      labelStyle: {
        color: "#9ca3af"
      }
    }), /*#__PURE__*/React.createElement(Bar, {
      dataKey: "M",
      fill: "#fb923c",
      radius: [3, 3, 0, 0],
      name: "Mobility"
    }), /*#__PURE__*/React.createElement(Bar, {
      dataKey: "C",
      fill: "#60a5fa",
      radius: [3, 3, 0, 0],
      name: "Cardio"
    }), /*#__PURE__*/React.createElement(Bar, {
      dataKey: "S",
      fill: "#4ade80",
      radius: [3, 3, 0, 0],
      name: "Strength"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        marginTop: 6
      }
    }, [["Mobility", "#fb923c"], ["Cardio", "#60a5fa"], ["Strength", "#4ade80"]].map(([l, c]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 7,
        height: 7,
        borderRadius: 2,
        background: c
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 10
      }
    }, l))))),
    s: {
      marginBottom: 12
    }
  }), snChart.length > 0 && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Snacking Level (0=none \xB7 3=heavy)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 90
      }
    }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
      width: "100%",
      height: "100%"
    }, /*#__PURE__*/React.createElement(BarChart, {
      data: snChart,
      barSize: 16
    }, /*#__PURE__*/React.createElement(XAxis, {
      dataKey: "d",
      tick: {
        fill: "var(--text-secondary)",
        fontSize: 10
      },
      axisLine: false,
      tickLine: false
    }), /*#__PURE__*/React.createElement(YAxis, {
      domain: [0, 3],
      ticks: [0, 1, 2, 3],
      tick: {
        fill: "var(--text-secondary)",
        fontSize: 9
      },
      axisLine: false,
      tickLine: false,
      width: 16
    }), /*#__PURE__*/React.createElement(Tooltip, {
      contentStyle: ttStyle,
      labelStyle: {
        color: "#9ca3af"
      },
      itemStyle: {
        color: "#fb923c"
      }
    }), /*#__PURE__*/React.createElement(Bar, {
      dataKey: "sn",
      fill: "#fb923c",
      radius: [3, 3, 0, 0],
      name: "Snacking"
    }))))),
    s: {
      marginBottom: 12
    }
  }), moodChart.length > 0 && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Energy vs Mood"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 100
      }
    }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
      width: "100%",
      height: "100%"
    }, /*#__PURE__*/React.createElement(LineChart, {
      data: moodChart
    }, /*#__PURE__*/React.createElement(XAxis, {
      dataKey: "d",
      tick: {
        fill: "var(--text-secondary)",
        fontSize: 10
      },
      axisLine: false,
      tickLine: false
    }), /*#__PURE__*/React.createElement(YAxis, {
      domain: [0, 5],
      ticks: [1, 2, 3, 4, 5],
      tick: {
        fill: "var(--text-secondary)",
        fontSize: 9
      },
      axisLine: false,
      tickLine: false,
      width: 16
    }), /*#__PURE__*/React.createElement(Tooltip, {
      contentStyle: ttStyle,
      labelStyle: {
        color: "#9ca3af"
      }
    }), /*#__PURE__*/React.createElement(Line, {
      type: "monotone",
      dataKey: "energy",
      stroke: "#60a5fa",
      strokeWidth: 2,
      dot: {
        fill: "#60a5fa",
        r: 2
      },
      name: "Energy"
    }), /*#__PURE__*/React.createElement(Line, {
      type: "monotone",
      dataKey: "mood",
      stroke: "#f472b6",
      strokeWidth: 2,
      dot: {
        fill: "#f472b6",
        r: 2
      },
      name: "Mood",
      strokeDasharray: "4 2"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        marginTop: 5
      }
    }, [["Energy", "#60a5fa"], ["Mood", "#f472b6"]].map(([l, c]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 7,
        height: 7,
        borderRadius: 2,
        background: c
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 10
      }
    }, l))))),
    s: {
      marginBottom: 12
    }
  }), sleepCorr.length >= 3 && avgEnShort && avgEnLong && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Sleep Insights"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 12,
        margin: 0,
        lineHeight: 1.6
      }
    }, "Based on this week's data: on nights you slept under 6 hours your next-day energy averaged ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#ef4444",
        fontWeight: 700
      }
    }, avgEnShort, "/5"), ". On nights with 6+ hours it averaged ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#4ade80",
        fontWeight: 700
      }
    }, avgEnLong, "/5"), ". ", parseFloat(avgEnLong) - parseFloat(avgEnShort) >= 1 ? `That's a meaningful difference — ${parseFloat(avgEnLong) - parseFloat(avgEnShort)} points.` : "The pattern is emerging.")),
    s: {
      marginBottom: 12
    }
  }), choreTasks && choreTasks.length > 0 && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Home Summary"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 0
      }
    }, /*#__PURE__*/React.createElement(StatCell, {
      lbl: "Overdue",
      val: overdueChores,
      c: overdueChores > 0 ? "#ef4444" : "#4ade80"
    }), /*#__PURE__*/React.createElement(StatCell, {
      lbl: "Done This Week",
      val: weekChoresDone,
      c: "#4ade80"
    }), /*#__PURE__*/React.createElement(StatCell, {
      lbl: "Total Tasks",
      val: choreTasks.length,
      c: "var(--text-secondary)"
    }))),
    s: {
      marginBottom: 12
    }
  }), familyMs.length > 0 && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Family Moments This Week"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 7
      }
    }, familyMs.map(({
      date,
      m
    }, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#f4a823",
        fontSize: 10,
        fontWeight: 700,
        flexShrink: 0,
        marginTop: 2
      }
    }, fmtShort(date)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#c9ccd4",
        fontSize: 12
      }
    }, m))))),
    s: {
      marginBottom: 12
    }
  }), grats.length > 0 && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Gratitude This Week"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 7
      }
    }, grats.map(({
      date,
      g
    }, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#a78bfa",
        fontSize: 10,
        fontWeight: 700,
        flexShrink: 0,
        marginTop: 2
      }
    }, fmtShort(date)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#c9ccd4",
        fontSize: 12,
        fontStyle: "italic"
      }
    }, g))))),
    s: {
      marginBottom: 12
    }
  }), wins.length > 0 && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Wins This Week"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 7
      }
    }, wins.map(({
      date,
      w
    }, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        gap: 10,
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#f4a823",
        fontSize: 10,
        fontWeight: 700,
        flexShrink: 0,
        marginTop: 2
      }
    }, fmtShort(date)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#c9ccd4",
        fontSize: 12
      }
    }, w))))),
    s: {
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "7 Pillars \u2014 Weekly Self-Assessment"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, PILLARS.map(p => /*#__PURE__*/React.createElement("div", {
      key: p.id,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#9ca3af",
        fontSize: 12,
        width: 148,
        flexShrink: 0
      }
    }, p.l), /*#__PURE__*/React.createElement(Dots, {
      val: ps[p.id] || 0,
      set: v => setPs(prev => ({
        ...prev,
        [p.id]: v
      })),
      col: p.c,
      sz: 22
    }))))),
    s: {
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Faith"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 11,
        margin: "0 0 10px",
        lineHeight: 1.5
      }
    }, "Not performative \u2014 just yours."), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: faithScripture,
      onChange: e => setFaithScripture(e.target.value),
      placeholder: "A scripture or verse that stayed with you...",
      style: {
        ...inp,
        marginBottom: 8,
        fontSize: 13
      }
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: faithMoment,
      onChange: e => setFaithMoment(e.target.value),
      placeholder: "A moment this week where you felt it...",
      style: {
        ...inp,
        marginBottom: 8,
        fontSize: 13
      }
    }), /*#__PURE__*/React.createElement("textarea", {
      value: faithNote,
      onChange: e => setFaithNote(e.target.value),
      placeholder: "Anything else on your heart this week...",
      style: {
        ...inp,
        resize: "none",
        minHeight: 60,
        fontSize: 13,
        lineHeight: 1.6
      },
      rows: 2
    })),
    s: {
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Reading This Week"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: bookTitle,
      onChange: e => setBookTitle(e.target.value),
      placeholder: "Book title...",
      style: {
        ...inp,
        marginBottom: 8,
        fontSize: 13
      }
    }), /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: pagesRead,
      onChange: e => setPagesRead(e.target.value),
      placeholder: "Pages read this week",
      style: {
        ...inp,
        marginBottom: 8,
        fontSize: 13,
        width: 200
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("textarea", {
      value: reflection,
      onChange: e => setReflection(e.target.value),
      placeholder: "What stuck with you? What are you thinking about?",
      style: {
        ...inp,
        resize: "none",
        minHeight: 80,
        fontSize: 13,
        lineHeight: 1.6,
        paddingRight: 50
      },
      rows: 3
    }), /*#__PURE__*/React.createElement("button", {
      onClick: startVoice,
      style: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 34,
        height: 34,
        background: listening ? "rgba(239,68,68,.2)" : "rgba(167,139,250,.15)",
        border: `1px solid ${listening ? "rgba(239,68,68,.4)" : "rgba(167,139,250,.3)"}`,
        borderRadius: 8,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16
      }
    }, listening ? "🔴" : "🎙")), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 10,
        margin: "5px 0 0"
      }
    }, "\uD83C\uDF99 tap mic to dictate \xB7 appends to existing text")),
    s: {
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Financial Snapshot \u2014 This Week"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 11,
        margin: "0 0 10px"
      }
    }, "Quick pulse check \u2014 update once a week."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#6b7280",
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: ".06em",
        margin: "0 0 4px"
      }
    }, "Loan Balance ($)"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: financeBalance,
      onChange: e => setFinanceBalance(e.target.value),
      placeholder: settings?.loanBalance || "113000",
      style: {
        ...inp,
        fontSize: 13
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#6b7280",
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: ".06em",
        margin: "0 0 4px"
      }
    }, "Savings ($)"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: financeSavings,
      onChange: e => setFinanceSavings(e.target.value),
      placeholder: settings?.savingsCurrent || "20000",
      style: {
        ...inp,
        fontSize: 13
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#6b7280",
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: ".06em",
        margin: "0 0 4px"
      }
    }, "Payment Made This Week ($)"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: financePayment,
      onChange: e => setFinancePayment(e.target.value),
      placeholder: "0",
      style: {
        ...inp,
        fontSize: 13,
        width: 200
      }
    }))),
    s: {
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement(Lbl, {
      c: `${settings?.sonName || "Your Son"}'s Milestones`
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => setAddingMs(!addingMs),
      style: {
        padding: "4px 10px",
        background: "rgba(244,114,182,.12)",
        border: "1px solid rgba(244,114,182,.25)",
        color: "#f472b6",
        borderRadius: 7,
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer"
      }
    }, "+ Add")), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 11,
        margin: "0 0 10px",
        lineHeight: 1.5
      }
    }, "These moments are permanent \u2014 never overwritten."), addingMs && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 7,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("input", {
      value: newMilestone,
      onChange: e => setNewMilestone(e.target.value),
      placeholder: "A moment worth keeping forever...",
      style: {
        ...inp,
        flex: 1,
        fontSize: 13
      },
      onKeyDown: e => e.key === "Enter" && addMilestone()
    }), /*#__PURE__*/React.createElement("button", {
      onClick: addMilestone,
      style: {
        padding: "8px 13px",
        background: "#f472b6",
        color: "#080b11",
        border: "none",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 800,
        cursor: "pointer",
        flexShrink: 0
      }
    }, "\u2713")), milestones.length > 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 6
      }
    }, milestones.slice(0, 20).map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        gap: 9,
        padding: "8px 10px",
        background: "rgba(244,114,182,.04)",
        borderRadius: 8,
        border: "1px solid rgba(244,114,182,.1)",
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#f472b6",
        fontSize: 10,
        fontWeight: 700,
        flexShrink: 0,
        marginTop: 2
      }
    }, fmtDate(m.date)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#c9ccd4",
        fontSize: 12,
        flex: 1
      }
    }, m.text)))) : /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 12,
        margin: 0
      }
    }, "No milestones yet. Add the first one.")),
    s: {
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Biggest Win This Week"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: ww,
      onChange: e => setWw(e.target.value),
      placeholder: "One thing you're actually proud of",
      style: inp
    })),
    s: {
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "One Gap to Close Next Week"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: wn,
      onChange: e => setWn(e.target.value),
      placeholder: "The one thing that needs to move",
      style: inp
    })),
    s: {
      marginBottom: 12
    }
  }), ok && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#4ade80",
        margin: 0,
        fontSize: 13
      }
    }, "\u2713 Sunday review saved."),
    s: {
      borderColor: "rgba(74,222,128,.25)",
      background: "rgba(74,222,128,.06)",
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: go,
    disabled: busy,
    style: {
      background: busy ? "rgba(74,222,128,.45)" : "#4ade80",
      color: "#080b11",
      border: "none",
      borderRadius: 10,
      padding: "14px 0",
      fontSize: 15,
      fontWeight: 800,
      cursor: busy ? "wait" : "pointer",
      width: "100%",
      fontFamily: "'Syne',sans-serif",
      letterSpacing: ".05em"
    }
  }, busy ? "SAVING..." : "SAVE SUNDAY REVIEW →")));
}

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
const PRI_COLOR = {
  High: "#ef4444",
  Medium: "#f4a823",
  Low: "#4ade80"
};
function choreStatus(task) {
  const nextDue = addDays(task.last, task.freq);
  const daysUntil = daysBetween(getToday(), nextDue);
  return {
    nextDue,
    daysUntil,
    status: daysUntil < 0 ? "overdue" : daysUntil <= 7 ? "soon" : "ok"
  };
}
function Home({
  tasks,
  setTasks,
  settings,
  activeUser
}) {
  const [filter, setFilter] = useState("all");
  const [priFilter, setPriFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [doneTask, setDoneTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [doneDateState, setDoneDateState] = useState(getToday());
  const myName = settings?.name || "Ryan";
  const partnerName = settings?.partnerName || "Sabrina";
  const saveTasks = async updated => {
    setTasks(updated);
    await DB.set(KEYS.chores(), updated);
  };
  const handleDone = async () => {
    if (!doneTask) return;
    await saveTasks(tasks.map(t => t.id === doneTask.id ? {
      ...t,
      last: doneDateState
    } : t));
    setDoneTask(null);
  };
  const handleSave = async updated => {
    const exists = tasks.find(t => t.id === updated.id);
    await saveTasks(exists ? tasks.map(t => t.id === updated.id ? updated : t) : [...tasks, updated]);
    setEditTask(null);
  };
  const handleDelete = async id => {
    await saveTasks(tasks.filter(t => t.id !== id));
    setEditTask(null);
  };
  const sorted = [...tasks].sort((a, b) => {
    const sa = choreStatus(a),
      sb = choreStatus(b);
    const so = {
      overdue: 0,
      soon: 1,
      ok: 2
    };
    if (so[sa.status] !== so[sb.status]) return so[sa.status] - so[sb.status];
    if (sa.status === "overdue" || sa.status === "soon") return sa.daysUntil - sb.daysUntil;
    if ((PRI_COLOR[a.priority] || "") !== (PRI_COLOR[b.priority] || "")) return (PRI_COLOR[a.priority] || "") < (PRI_COLOR[b.priority] || "") ? -1 : 1;
    return sa.daysUntil - sb.daysUntil;
  });
  const filtered = sorted.filter(t => {
    const {
      status
    } = choreStatus(t);
    if (filter === "overdue" && status !== "overdue") return false;
    if (filter === "soon" && status !== "soon") return false;
    if (filter === "ok" && status !== "ok") return false;
    if (priFilter !== "All" && t.priority !== priFilter) return false;
    if (ownerFilter !== "All" && t.owner !== ownerFilter && t.owner !== "Both") return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const counts = {
    overdue: tasks.filter(t => choreStatus(t).status === "overdue").length,
    soon: tasks.filter(t => choreStatus(t).status === "soon").length,
    ok: tasks.filter(t => choreStatus(t).status === "ok").length
  };
  const urgentHigh = tasks.filter(t => {
    const {
      status
    } = choreStatus(t);
    return (status === "overdue" || status === "soon") && t.priority === "High";
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    label: "Home",
    color: "#f4a823"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#404755",
      fontSize: 12,
      margin: "0 0 0 13px"
    }
  }, tasks.length, " tasks \xB7 Chore & Maintenance Tracker")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditTask({
      name: "",
      last: getToday(),
      freq: 7,
      priority: "Medium",
      owner: "Both"
    }),
    style: {
      padding: "8px 13px",
      background: "rgba(244,168,35,.15)",
      border: "1px solid rgba(244,168,35,.3)",
      color: "#f4a823",
      borderRadius: 9,
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "+ Add"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 16
    }
  }, [{
    l: "Overdue",
    n: counts.overdue,
    c: "#ef4444",
    bg: "rgba(239,68,68,.1)",
    border: "rgba(239,68,68,.25)"
  }, {
    l: "Due Soon",
    n: counts.soon,
    c: "#f4a823",
    bg: "rgba(244,168,35,.08)",
    border: "rgba(244,168,35,.2)"
  }, {
    l: "On Track",
    n: counts.ok,
    c: "#4ade80",
    bg: "rgba(74,222,128,.07)",
    border: "rgba(74,222,128,.18)"
  }].map(({
    l,
    n,
    c,
    bg,
    border
  }) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      flex: 1,
      padding: "10px 0",
      textAlign: "center",
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: c,
      fontFamily: "'Syne',sans-serif",
      fontSize: 20,
      fontWeight: 800,
      margin: "0 0 1px"
    }
  }, n), /*#__PURE__*/React.createElement("p", {
    style: {
      color: c,
      fontSize: 9,
      fontWeight: 600,
      margin: 0,
      letterSpacing: ".05em",
      textTransform: "uppercase",
      opacity: .8
    }
  }, l)))), urgentHigh.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(239,68,68,.07)",
      border: "1px solid rgba(239,68,68,.2)",
      borderRadius: 10,
      padding: "10px 13px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#ef4444",
      fontSize: 11,
      fontWeight: 700,
      margin: "0 0 3px",
      textTransform: "uppercase",
      letterSpacing: ".04em"
    }
  }, "\uD83D\uDEA8 ", urgentHigh.length, " High Priority Need Attention"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#9ca3af",
      fontSize: 11,
      margin: 0,
      lineHeight: 1.5
    }
  }, urgentHigh.slice(0, 3).map(t => {
    const {
      daysUntil
    } = choreStatus(t);
    return `${t.name} (${daysUntil < 0 ? Math.abs(daysUntil) + "d overdue" : "today"})`;
  }).join(" · "), urgentHigh.length > 3 ? ` +${urgentHigh.length - 3} more` : "")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      marginBottom: 8,
      flexWrap: "wrap"
    }
  }, [{
    id: "all",
    l: `All (${tasks.length})`,
    c: "#9ca3af"
  }, {
    id: "overdue",
    l: `Overdue (${counts.overdue})`,
    c: "#ef4444"
  }, {
    id: "soon",
    l: `Soon (${counts.soon})`,
    c: "#f4a823"
  }, {
    id: "ok",
    l: `On Track (${counts.ok})`,
    c: "#4ade80"
  }].map(({
    id,
    l,
    c
  }) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setFilter(id),
    style: {
      padding: "4px 10px",
      borderRadius: 7,
      fontSize: 10,
      cursor: "pointer",
      border: `1px solid ${filter === id ? c : "var(--card-bg-4)"}`,
      background: filter === id ? `${c}18` : "transparent",
      color: filter === id ? c : "var(--text-secondary)",
      fontWeight: filter === id ? 700 : 400
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      marginBottom: 10,
      flexWrap: "wrap"
    }
  }, ["All", "High", "Medium", "Low"].map(p => {
    const pc = p === "All" ? "#9ca3af" : PRI_COLOR[p];
    return /*#__PURE__*/React.createElement("button", {
      key: p,
      onClick: () => setPriFilter(p),
      style: {
        padding: "3px 9px",
        borderRadius: 6,
        fontSize: 10,
        cursor: "pointer",
        border: `1px solid ${priFilter === p ? pc : "var(--card-border)"}`,
        background: priFilter === p ? `${pc}15` : "transparent",
        color: priFilter === p ? pc : "var(--text-secondary)",
        fontWeight: priFilter === p ? 700 : 400
      }
    }, p);
  }), ["All", myName, partnerName, "Both"].map(o => /*#__PURE__*/React.createElement("button", {
    key: o,
    onClick: () => setOwnerFilter(o),
    style: {
      padding: "3px 9px",
      borderRadius: 6,
      fontSize: 10,
      cursor: "pointer",
      border: `1px solid ${ownerFilter === o ? "rgba(96,165,250,.4)" : "var(--card-border)"}`,
      background: ownerFilter === o ? "rgba(96,165,250,.12)" : "transparent",
      color: ownerFilter === o ? "#60a5fa" : "var(--text-secondary)",
      fontWeight: ownerFilter === o ? 700 : 400
    }
  }, o)), /*#__PURE__*/React.createElement("input", {
    value: search,
    onChange: e => setSearch(e.target.value),
    placeholder: "Search...",
    style: {
      ...inp,
      fontSize: 11,
      padding: "4px 10px",
      height: "auto",
      flex: 1,
      minWidth: 80
    }
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10,
      margin: "0 0 8px"
    }
  }, filtered.length, " task", filtered.length !== 1 ? "s" : ""), filtered.map(task => {
    const {
      nextDue,
      daysUntil,
      status
    } = choreStatus(task);
    const sc = status === "overdue" ? "#ef4444" : status === "soon" ? "#f4a823" : "#4ade80";
    const sbg = status === "overdue" ? "rgba(239,68,68,.08)" : status === "soon" ? "rgba(244,168,35,.06)" : "rgba(74,222,128,.05)";
    const sbd = status === "overdue" ? "rgba(239,68,68,.2)" : status === "soon" ? "rgba(244,168,35,.15)" : "rgba(74,222,128,.12)";
    const pc = PRI_COLOR[task.priority] || "#555";
    const daysLabel = daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : daysUntil === 0 ? "Due today" : `${daysUntil}d left`;
    return /*#__PURE__*/React.createElement("div", {
      key: task.id,
      style: {
        background: sbg,
        border: `1px solid ${sbd}`,
        borderRadius: 10,
        padding: "11px 13px",
        marginBottom: 7,
        borderLeft: `3px solid ${sc}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        marginBottom: 3,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#e2e5ed",
        fontSize: 13,
        fontWeight: 600
      }
    }, task.name), /*#__PURE__*/React.createElement("span", {
      style: {
        background: `${pc}18`,
        color: pc,
        fontSize: 9,
        fontWeight: 700,
        borderRadius: 4,
        padding: "1px 5px"
      }
    }, task.priority), /*#__PURE__*/React.createElement("span", {
      style: {
        background: "rgba(96,165,250,.1)",
        color: "#60a5fa",
        fontSize: 9,
        fontWeight: 700,
        borderRadius: 4,
        padding: "1px 5px"
      }
    }, task.owner || "Both")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: sc,
        fontSize: 11,
        fontWeight: 700
      }
    }, daysLabel), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)",
        fontSize: 10
      }
    }, "Due ", fmtDate(nextDue)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#2d3340",
        fontSize: 10
      }
    }, "Every ", task.freq, "d"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 5,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setEditTask(task),
      style: {
        padding: "5px 9px",
        background: "rgba(255,255,255,.05)",
        border: "1px solid rgba(255,255,255,.09)",
        color: "var(--text-secondary)",
        borderRadius: 7,
        fontSize: 10,
        cursor: "pointer"
      }
    }, "\u270E"), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setDoneTask(task);
        setDoneDateState(getToday());
      },
      style: {
        padding: "5px 11px",
        background: status === "overdue" ? "rgba(239,68,68,.15)" : status === "soon" ? "rgba(244,168,35,.15)" : "rgba(74,222,128,.12)",
        border: `1px solid ${sc}40`,
        color: sc,
        borderRadius: 7,
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer"
      }
    }, "Done \u2713"))));
  }), doneTask && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,.7)",
      zIndex: 200
    },
    onClick: () => setDoneTask(null)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      width: "calc(100% - 40px)",
      maxWidth: 380,
      background: "#0e1420",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: 14,
      padding: "20px",
      zIndex: 201
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontFamily: "'Syne',sans-serif",
      fontSize: 15,
      fontWeight: 800,
      margin: "0 0 4px"
    }
  }, "Mark as Done"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#9ca3af",
      fontSize: 13,
      margin: "0 0 14px"
    }
  }, doneTask.name), /*#__PURE__*/React.createElement(Lbl, {
    c: "Date Completed"
  }), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: doneDateState,
    onChange: e => setDoneDateState(e.target.value),
    style: {
      ...inp,
      marginBottom: 12,
      colorScheme: "dark"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "9px 12px",
      background: "rgba(74,222,128,.06)",
      border: "1px solid rgba(74,222,128,.15)",
      borderRadius: 9,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11,
      margin: "0 0 2px"
    }
  }, "Next due:"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontSize: 14,
      fontWeight: 700,
      margin: 0
    }
  }, fmtDate(addDays(doneDateState, doneTask.freq)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleDone,
    style: {
      flex: 1,
      padding: "12px 0",
      background: "#4ade80",
      color: "#080b11",
      border: "none",
      borderRadius: 9,
      fontSize: 13,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "CONFIRM \u2713"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setDoneTask(null),
    style: {
      flex: 1,
      padding: "12px 0",
      background: "transparent",
      border: "1px solid rgba(255,255,255,.1)",
      color: "var(--text-secondary)",
      borderRadius: 9,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Cancel")))), editTask && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,.7)",
      zIndex: 200
    },
    onClick: () => setEditTask(null)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      width: "calc(100% - 32px)",
      maxWidth: 420,
      background: "#0e1420",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: 14,
      padding: "20px",
      zIndex: 201,
      maxHeight: "90vh",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontFamily: "'Syne',sans-serif",
      fontSize: 15,
      fontWeight: 800,
      margin: "0 0 16px"
    }
  }, editTask.id ? "EDIT TASK" : "ADD TASK"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    c: "Task Name"
  }), /*#__PURE__*/React.createElement("input", {
    value: editTask.name || "",
    onChange: e => setEditTask(p => ({
      ...p,
      name: e.target.value
    })),
    style: {
      ...inp,
      fontSize: 13
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "Last Done"
  }), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: editTask.last || getToday(),
    onChange: e => setEditTask(p => ({
      ...p,
      last: e.target.value
    })),
    style: {
      ...inp,
      fontSize: 13,
      colorScheme: "dark"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 80
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "Every (days)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: editTask.freq || 7,
    onChange: e => setEditTask(p => ({
      ...p,
      freq: parseInt(e.target.value) || 1
    })),
    style: {
      ...inp,
      fontSize: 13
    }
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    c: "Priority"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, ["High", "Medium", "Low"].map(p => {
    const pc = PRI_COLOR[p];
    const sel = editTask.priority === p;
    return /*#__PURE__*/React.createElement("button", {
      key: p,
      onClick: () => setEditTask(prev => ({
        ...prev,
        priority: p
      })),
      style: {
        flex: 1,
        padding: "8px 0",
        borderRadius: 8,
        border: `1px solid ${sel ? pc : "var(--card-bg-4)"}`,
        background: sel ? `${pc}18` : "transparent",
        color: sel ? pc : "var(--text-secondary)",
        fontSize: 12,
        fontWeight: sel ? 700 : 400,
        cursor: "pointer"
      }
    }, p);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    c: "Owner"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, [myName, partnerName, "Both"].map(o => {
    const sel = editTask.owner === o;
    return /*#__PURE__*/React.createElement("button", {
      key: o,
      onClick: () => setEditTask(p => ({
        ...p,
        owner: o
      })),
      style: {
        flex: 1,
        padding: "8px 0",
        borderRadius: 8,
        border: `1px solid ${sel ? "rgba(96,165,250,.4)" : "var(--card-bg-4)"}`,
        background: sel ? "rgba(96,165,250,.12)" : "transparent",
        color: sel ? "#60a5fa" : "var(--text-secondary)",
        fontSize: 12,
        fontWeight: sel ? 700 : 400,
        cursor: "pointer"
      }
    }, o);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    c: "Next Due"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontSize: 13,
      fontWeight: 700,
      margin: 0
    }
  }, fmtDate(addDays(editTask.last || getToday(), editTask.freq || 7))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleSave({
      ...editTask,
      id: editTask.id || `c${Date.now()}`
    }),
    disabled: !editTask.name?.trim(),
    style: {
      flex: 1,
      padding: "12px 0",
      background: editTask.name?.trim() ? "#f4a823" : "rgba(255,255,255,.05)",
      color: editTask.name?.trim() ? "#080b11" : "var(--text-muted)",
      border: "none",
      borderRadius: 9,
      fontSize: 13,
      fontWeight: 800,
      cursor: editTask.name?.trim() ? "pointer" : "default",
      fontFamily: "'Syne',sans-serif"
    }
  }, editTask.id ? "SAVE →" : "ADD →"), editTask.id && /*#__PURE__*/React.createElement("button", {
    onClick: () => handleDelete(editTask.id),
    style: {
      padding: "12px 13px",
      background: "rgba(239,68,68,.1)",
      border: "1px solid rgba(239,68,68,.2)",
      color: "#ef4444",
      borderRadius: 9,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Delete")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditTask(null),
    style: {
      width: "100%",
      marginTop: 8,
      padding: "9px 0",
      background: "transparent",
      border: "none",
      color: "var(--text-muted)",
      fontSize: 12,
      cursor: "pointer"
    }
  }, "Cancel"))));
}

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

// ─────────────────────────────────────────────────────────────────────────────
// REMINDERS / NOTES TAB
// ─────────────────────────────────────────────────────────────────────────────

const TASKS_API = "https://tasks.googleapis.com/tasks/v1";

function gtasksFetch(path, options = {}) {
  const token = window.__google_access_token;
  if (!token) throw new Error("no_token");
  return fetch(TASKS_API + path, {
    ...options,
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
}

function RemindersTab({ settings }) {
  const today = getToday();
  const [personal, setPersonal] = useState([]);
  const [joint, setJoint] = useState([]);
  const [view, setView] = useState("mine");
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const voiceRef = useRef(null);

  const loadReminders = useCallback(async () => {
    const p = await DB.get(KEYS.reminders());
    const j = await DB.get(KEYS.jointReminders());
    setPersonal(Array.isArray(p) ? p : []);
    setJoint(Array.isArray(j) ? j : []);
  }, []);

  useEffect(() => { loadReminders(); }, [loadReminders]);

  const savePersonal = async items => { setPersonal(items); await DB.set(KEYS.reminders(), items); };
  const saveJoint = async items => { setJoint(items); await DB.set(KEYS.jointReminders(), items); };

  const startVoice = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) { alert("Voice input not supported. Try Chrome on Android."); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.continuous = false; r.lang = "en-CA"; r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onresult = e => setInput(prev => (prev ? prev + " " : "") + e.results[0][0].transcript);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start(); voiceRef.current = r;
  };

  const makeItem = (fields, forceType) => {
    const assignedTo = fields.assignedTo || "me";
    // auto-route to joint if assigned to partner or both so they can see it
    const autoType = assignedTo === "me" ? "personal" : "joint";
    return {
      id: "r_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      title: fields.title || input.trim(), notes: fields.notes || "",
      dueDate: fields.dueDate || "", dueTime: fields.dueTime || "",
      type: forceType || fields.type || autoType,
      urgency: fields.urgency || "medium",
      assignedTo,
      category: fields.category || "personal",
      done: false, doneAt: null, createdAt: new Date().toISOString(), googleTaskId: null
    };
  };

  const handleAdd = async () => {
    if (!input.trim()) return;
    const defaultType = view === "joint" ? "joint" : "personal";
    setAiLoading(true);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001", max_tokens: 300,
          messages: [{ role: "user", content: `Today is ${today}. Partner name: ${settings?.partnerName || "Sabrina"}. Parse this reminder. Return ONLY valid JSON, no markdown:\n{"title":"short clear title","notes":"extra detail or empty","dueDate":"YYYY-MM-DD or empty","dueTime":"HH:MM 24h or empty","type":"personal or joint","urgency":"low|medium|high","assignedTo":"me|partner|both","category":"household|health|finance|family|personal|work"}\nRules:\n- type "joint" if involves both people/household/we/us/our\n- assignedTo "partner" if mentions partner by name or says "remind her/him"\n- assignedTo "both" if says "we need to" or "both of us"\n- urgency "high" for urgent/ASAP/emergency, "low" for someday/eventually\n- category: household=chores/home, health=medical/fitness, finance=bills/money\n- Parse relative dates like "Friday","tomorrow" relative to ${today}\nInput: "${input.trim()}"` }]
        })
      });
      const data = await res.json();
      let parsed = {};
      try { parsed = JSON.parse(data.content?.[0]?.text || "{}"); } catch {}
      const item = makeItem(parsed, view === "joint" ? "joint" : (parsed.type === "joint" ? "joint" : "personal"));
      if (item.type === "joint") await saveJoint([item, ...joint]); else await savePersonal([item, ...personal]);
      setInput("");
    } catch(e) {
      const item = makeItem({ title: input.trim() }, defaultType);
      if (item.type === "joint") await saveJoint([item, ...joint]); else await savePersonal([item, ...personal]);
      setInput("");
    }
    setAiLoading(false);
  };

  const toggleDone = async (item, isJoint) => {
    const updated = { ...item, done: !item.done, doneAt: !item.done ? new Date().toISOString() : null };
    if (isJoint) await saveJoint(joint.map(r => r.id === item.id ? updated : r));
    else await savePersonal(personal.map(r => r.id === item.id ? updated : r));
    if (updated.googleTaskId && window.__google_access_token) {
      try { await gtasksFetch(`/lists/@default/tasks/${updated.googleTaskId}`, { method: "PATCH", body: JSON.stringify({ status: updated.done ? "completed" : "needsAction" }) }); } catch {}
    }
  };

  const deleteItem = async (item, isJoint) => {
    if (isJoint) await saveJoint(joint.filter(r => r.id !== item.id));
    else await savePersonal(personal.filter(r => r.id !== item.id));
    if (item.googleTaskId && window.__google_access_token) {
      try { await gtasksFetch(`/lists/@default/tasks/${item.googleTaskId}`, { method: "DELETE" }); } catch {}
    }
  };

  const syncGoogleTasks = async () => {
    const tokenExpired = window.__google_token_expiry && Date.now() > window.__google_token_expiry;
    if (!window.__google_access_token || tokenExpired) { setSyncMsg("Token expired \u2014 sign out and sign back in to refresh."); return; }
    setSyncing(true); setSyncMsg("Syncing\u2026");
    try {
      const res = await gtasksFetch("/lists/@default/tasks?showCompleted=true&showHidden=true&maxResults=100");
      if (!res.ok) { const err = await res.json(); throw new Error(err.error?.message || "Tasks API error"); }
      const data = await res.json();
      const googleTaskMap = {};
      (data.items || []).forEach(t => { googleTaskMap[t.id] = t; });
      let changes = 0;
      const processItems = items => items.map(r => {
        if (!r.googleTaskId) return r;
        const gt = googleTaskMap[r.googleTaskId];
        if (!gt) { changes++; return null; }
        const googleDone = gt.status === "completed";
        if (googleDone !== r.done) { changes++; return { ...r, done: googleDone, doneAt: googleDone ? (gt.completed || new Date().toISOString()) : null }; }
        return r;
      }).filter(Boolean);
      let newPersonal = processItems([...personal]);
      let newJoint = processItems([...joint]);
      const allUnlinked = [...newPersonal.filter(r => !r.googleTaskId && !r.done), ...newJoint.filter(r => !r.googleTaskId && !r.done)];
      for (const r of allUnlinked) {
        try {
          const body = { title: r.title + (r.notes ? " \u2014 " + r.notes : "") };
          if (r.dueDate) body.due = r.dueDate + "T00:00:00.000Z";
          const cr = await gtasksFetch("/lists/@default/tasks", { method: "POST", body: JSON.stringify(body) });
          const created = await cr.json();
          if (created.id) {
            changes++;
            newPersonal = newPersonal.map(p => p.id === r.id ? { ...p, googleTaskId: created.id } : p);
            newJoint = newJoint.map(j => j.id === r.id ? { ...j, googleTaskId: created.id } : j);
          }
        } catch {}
      }
      await savePersonal(newPersonal); await saveJoint(newJoint);
      setSyncMsg(`Synced \u2014 ${changes} change${changes !== 1 ? "s" : ""} applied.`);
    } catch(e) { setSyncMsg("Sync failed: " + (e.message || "unknown error")); }
    setSyncing(false); setTimeout(() => setSyncMsg(""), 5000);
  };

  const generateSummary = async () => {
    const openItems = [...personal.filter(r => !r.done), ...joint.filter(r => !r.done)];
    if (!openItems.length) { setAiSummary("Nothing open \u2014 you're clear!"); return; }
    setSummaryLoading(true);
    try {
      const list = openItems.map(r => `[${r.type.toUpperCase()}] ${r.title}${r.notes ? " \u2014 " + r.notes : ""}${r.dueDate ? " (due " + r.dueDate + ")" : ""}`).join("\n");
      const res = await fetch("/api/claude", {
        method: "POST",
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 150, messages: [{ role: "user", content: `Today is ${today}. Give a 2-sentence brief of these open reminders. Flag overdue items and what needs action today or this week. Be direct \u2014 no bullet points.\n\nItems:\n${list}` }] })
      });
      const d = await res.json();
      setAiSummary(d.content?.[0]?.text || "");
    } catch { setAiSummary("Summary failed."); }
    setSummaryLoading(false);
  };

  const isOverdue = r => r.dueDate && r.dueDate < today && !r.done;
  const isDueToday = r => r.dueDate === today && !r.done;
  const allActive = [...personal.filter(r => !r.done), ...joint.filter(r => !r.done)];
  const doneAll = [...personal.filter(r => r.done), ...joint.filter(r => r.done)].sort((a, b) => (b.doneAt || "").localeCompare(a.doneAt || ""));
  const overdueCount = allActive.filter(isOverdue).length;
  const dueTodayCount = allActive.filter(isDueToday).length;
  const hasGoogleToken = !!window.__google_access_token && (!window.__google_token_expiry || Date.now() < window.__google_token_expiry);
  const partnerName = settings?.partnerName || "Sabrina";
  const mineItems = allActive.filter(r => !r.assignedTo || r.assignedTo === "me");
  const partnerItems = allActive.filter(r => r.assignedTo === "partner");
  const bothItems = allActive.filter(r => r.assignedTo === "both");
  const displayItems = view === "mine" ? mineItems : view === "partner" ? partnerItems : view === "both" ? bothItems : doneAll;
  const isDoneView = view === "done";

  const tabBtn = (id, label, count, col) => /*#__PURE__*/React.createElement("button", {
    key: id, onClick: () => setView(id),
    style: { flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: ".06em", background: view === id ? col + "22" : "transparent", color: view === id ? col : "var(--text-muted)" }
  }, `${label} (${count})`);

  return /*#__PURE__*/React.createElement("div", null,

    (overdueCount > 0 || dueTodayCount > 0) && /*#__PURE__*/React.createElement("div", {
      style: { background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12 }
    },
      overdueCount > 0 && /*#__PURE__*/React.createElement("span", { style: { color: "#ef4444", fontWeight: 700, marginRight: 12 } }, overdueCount + " overdue"),
      dueTodayCount > 0 && /*#__PURE__*/React.createElement("span", { style: { color: "#f4a823", fontWeight: 700 } }, dueTodayCount + " due today")
    ),

    /*#__PURE__*/React.createElement("div", { style: { marginBottom: 16 } },
      aiSummary && /*#__PURE__*/React.createElement("div", {
        style: { background: "rgba(167,139,250,.08)", border: "1px solid rgba(167,139,250,.2)", borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "var(--text-primary)", lineHeight: 1.65, marginBottom: 8 }
      }, aiSummary),
      /*#__PURE__*/React.createElement("button", {
        onClick: generateSummary, disabled: summaryLoading,
        style: { background: "rgba(167,139,250,.12)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 8, padding: "7px 14px", fontSize: 11, color: "#a78bfa", fontWeight: 700, cursor: "pointer", letterSpacing: ".05em", opacity: summaryLoading ? .6 : 1 }
      }, summaryLoading ? "Summarising..." : "AI Brief")
    ),

    /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16, alignItems: "center" } },
      /*#__PURE__*/React.createElement("button", {
        onClick: listening ? () => { voiceRef.current?.stop(); setListening(false); } : startVoice,
        style: { width: 40, height: 40, borderRadius: "50%", cursor: "pointer", fontSize: 16, flexShrink: 0, background: listening ? "rgba(239,68,68,.2)" : "rgba(167,139,250,.15)", border: `1px solid ${listening ? "rgba(239,68,68,.4)" : "rgba(167,139,250,.3)"}`, color: listening ? "#ef4444" : "#a78bfa", display: "flex", alignItems: "center", justifyContent: "center" }
      }, listening ? "\u23F9" : "\uD83C\uDFA4"),
      /*#__PURE__*/React.createElement("input", {
        type: "text", value: input, onChange: e => setInput(e.target.value),
        onKeyDown: e => e.key === "Enter" && handleAdd(),
        placeholder: "Add a reminder or note\u2026",
        style: { flex: 1, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "10px 12px", color: "var(--text-primary)", fontSize: 14, outline: "none", fontFamily: "'DM Sans',sans-serif" }
      }),
      /*#__PURE__*/React.createElement("button", {
        onClick: handleAdd, disabled: !input.trim() || aiLoading,
        style: { background: "#a78bfa", border: "none", borderRadius: 10, padding: "10px 14px", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", flexShrink: 0, opacity: !input.trim() || aiLoading ? .4 : 1 }
      }, aiLoading ? "\u2026" : "Add")
    ),

    /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 16, background: "rgba(255,255,255,.03)", borderRadius: 10, padding: 4 } },
      tabBtn("mine", "MINE", mineItems.length, "#a78bfa"),
      tabBtn("partner", partnerName.toUpperCase(), partnerItems.length, "#60a5fa"),
      tabBtn("both", "BOTH", bothItems.length, "#fb923c"),
      tabBtn("done", "DONE", doneAll.length, "#4ade80")
    ),

    displayItems.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: { textAlign: "center", padding: "32px 0", color: "var(--text-muted)", fontSize: 13 }
    }, isDoneView ? "Nothing completed yet." : "Nothing here \u2014 add one above."),

    ...displayItems.map(r => {
      const isJoint = r.type === "joint";
      const overdue = isOverdue(r);
      const dueToday = isDueToday(r);
      return /*#__PURE__*/React.createElement("div", {
        key: r.id,
        style: { background: r.done ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.04)", border: `1px solid ${overdue ? "rgba(239,68,68,.3)" : dueToday ? "rgba(244,168,35,.3)" : "rgba(255,255,255,.07)"}`, borderRadius: 10, padding: "12px 14px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 12 }
      },
        !isDoneView && /*#__PURE__*/React.createElement("button", {
          onClick: () => toggleDone(r, isJoint),
          style: { width: 22, height: 22, borderRadius: "50%", flexShrink: 0, cursor: "pointer", marginTop: 2, background: r.done ? "rgba(74,222,128,.2)" : "transparent", border: `2px solid ${r.done ? "#4ade80" : overdue ? "#ef4444" : "rgba(255,255,255,.2)"}`, color: "#4ade80", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }
        }, r.done ? "\u2713" : ""),
        /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
          /*#__PURE__*/React.createElement("div", {
            style: { fontSize: 14, color: r.done ? "var(--text-muted)" : "var(--text-primary)", fontWeight: 500, textDecoration: r.done ? "line-through" : "none", wordBreak: "break-word" }
          }, r.title),
          r.notes && /*#__PURE__*/React.createElement("div", { style: { fontSize: 11, color: "var(--text-secondary)", marginTop: 3, lineHeight: 1.5 } }, r.notes),
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap", alignItems: "center" } },
            r.urgency && r.urgency !== "medium" && /*#__PURE__*/React.createElement("span", {
              style: { fontSize: 9, fontWeight: 800, letterSpacing: ".05em", borderRadius: 4, padding: "2px 6px", background: r.urgency === "high" ? "rgba(239,68,68,.15)" : "rgba(156,163,175,.1)", color: r.urgency === "high" ? "#ef4444" : "#9ca3af", border: r.urgency === "high" ? "1px solid rgba(239,68,68,.3)" : "1px solid rgba(156,163,175,.2)" }
            }, r.urgency.toUpperCase()),
            r.assignedTo && r.assignedTo !== "me" && !isDoneView && /*#__PURE__*/React.createElement("span", {
              style: { fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px", background: r.assignedTo === "both" ? "rgba(251,146,60,.15)" : "rgba(96,165,250,.15)", border: r.assignedTo === "both" ? "1px solid rgba(251,146,60,.3)" : "1px solid rgba(96,165,250,.25)", color: r.assignedTo === "both" ? "#fb923c" : "#60a5fa" }
            }, r.assignedTo === "both" ? "BOTH" : "\u2192 " + partnerName.toUpperCase()),
            r.category && r.category !== "personal" && /*#__PURE__*/React.createElement("span", { style: { fontSize: 9, color: "var(--text-muted)", fontWeight: 600 } }, r.category),
            r.dueDate && /*#__PURE__*/React.createElement("span", {
              style: { fontSize: 10, fontWeight: 700, letterSpacing: ".04em", color: overdue ? "#ef4444" : dueToday ? "#f4a823" : "var(--text-muted)" }
            }, overdue ? "OVERDUE \xB7 " + r.dueDate : dueToday ? "TODAY" + (r.dueTime ? " \xB7 " + r.dueTime : "") : r.dueDate + (r.dueTime ? " \xB7 " + r.dueTime : "")),
            r.googleTaskId && /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)" } }, "\u2713 Google"),
            isDoneView && r.doneAt && /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)" } }, "Done " + r.doneAt.slice(0, 10))
          )
        ),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => deleteItem(r, isJoint),
          style: { background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18, padding: "0 2px", flexShrink: 0, lineHeight: 1 }
        }, "\xD7")
      );
    }),

    /*#__PURE__*/React.createElement("div", {
      style: { marginTop: 28, padding: "14px 16px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12 }
    },
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } },
        /*#__PURE__*/React.createElement("span", {
          style: { fontSize: 11, fontWeight: 700, letterSpacing: ".07em", color: hasGoogleToken ? "#4ade80" : "var(--text-muted)" }
        }, hasGoogleToken ? "\u25CF GOOGLE TASKS CONNECTED" : "\u25CB GOOGLE TASKS"),
        /*#__PURE__*/React.createElement("button", {
          onClick: syncGoogleTasks, disabled: syncing,
          style: { background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "6px 12px", fontSize: 11, color: "var(--text-primary)", fontWeight: 700, cursor: "pointer", opacity: syncing ? .5 : 1 }
        }, syncing ? "Syncing\u2026" : "Sync Now")
      ),
      !hasGoogleToken && /*#__PURE__*/React.createElement("p", {
        style: { fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }
      }, "Sign out and sign back in to connect Google Tasks \u2014 grants permission once."),
      syncMsg && /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "#4ade80", margin: "6px 0 0", fontWeight: 600 } }, syncMsg)
    )
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED MODULE BRIDGE
// Exposes core utilities so feature modules (finance-tab.js, etc.) can
// access them without being embedded in the monolith.
// ─────────────────────────────────────────────────────────────────────────────
window.__ml = {
  DB, KEYS,
  getToday, fmtDate, fmtLong, addDays, daysBetween, getSundayKey,
  callClaude,
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
    }, {
      id: "reminders",
      l: "REMINDERS",
      c: "#a78bfa"
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
  }, activeSection.id === "health" && /*#__PURE__*/React.createElement(HealthScorecard, {
    todayLog: todayLog,
    todayMealLog: todayMealLog,
    macroTargets: macroTargets
  }), tab === "morning" && /*#__PURE__*/React.createElement(Morning, {
    key: getToday(),
    todayLog: todayLog,
    onSave: loadAll,
    settings: settings,
    onMilestone: handleMilestone,
    allLogs: allLogs,
    initialDate: editLogDate?.section === "morning" ? editLogDate.date : null,
    onInitialDateConsumed: () => setEditLogDate(null)
  }), tab === "train" && /*#__PURE__*/React.createElement(Train, {
    todayLog: todayLog,
    onSave: loadAll,
    settings: settings
  }), tab === "mobility" && /*#__PURE__*/React.createElement(MobilityTab, {
    todayLog: todayLog,
    onSave: (checked, mobDone) => {
      // Silent patch — update todayLog state directly, no full reload
      setTodayLog(prev => ({
        ...prev,
        morning: { ...((prev || {}).morning || {}), mobilityChecked: checked, mobilityCount: mobDone }
      }));
    }
  }), tab === "evening" && /*#__PURE__*/React.createElement(Evening, {
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
  }), tab === "chores" && /*#__PURE__*/React.createElement(Home, {
    tasks: tasks,
    setTasks: setTasks,
    settings: settings,
    activeUser: activeUser
  }), tab === "pantry" && /*#__PURE__*/React.createElement(window.PantryTab, {
    pantryItems: pantryItems,
    setPantryItems: setPantryItems,
    onAddToGrocery: () => {}
  }), tab === "goals" && /*#__PURE__*/React.createElement(Goals, {
    goals: goals,
    onSaveGoals: handleSaveGoals,
    allLogs: allLogs,
    settings: settings,
    onMilestone: handleMilestone
  }), tab === "sunday" && /*#__PURE__*/React.createElement(Sunday, {
    wk: allLogs.filter(l => daysBetween(l.date, getToday()) <= 7),
    allLogs: allLogs,
    settings: settings,
    allSundays: allSundays,
    choreTasks: tasks
  }), tab === "reminders" && /*#__PURE__*/React.createElement(RemindersTab, {
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
