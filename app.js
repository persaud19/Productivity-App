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
  financeTransactions: month => `ml:finance:txns:${month}`,
  financeAllMonths: () => `ml:finance:months`,
  financeRollover: month => `ml:finance:rollover:${month}`,
  financeIncome: month => `ml:finance:income:${month}`,
  merchantRules: () => `ml:finance:merchant_rules`,
  customSubCats: () => `ml:finance:custom_subcats`,
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
// PANTRY SEED — loaded at runtime from /pantry-seed.json (keeps JS lean)
// ─────────────────────────────────────────────────────────────────────────────
const PANTRY_SEED = [{"id":"seed000","name":"Coconut Sugar","qty":500.0,"minQty":100.0,"reorderQty":100.0,"unit":"g","cat":"Grains","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed001","name":"Baking Powder","qty":248.0,"minQty":100.0,"reorderQty":100.0,"unit":"g","cat":"Grains","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed002","name":"Baking Soda","qty":500.0,"minQty":100.0,"reorderQty":100.0,"unit":"g","cat":"Grains","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed003","name":"Artificial Vanilla Extract","qty":150.0,"minQty":10.0,"reorderQty":10.0,"unit":"ml","cat":"Grains","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed004","name":"Coconut Oil","qty":250.0,"minQty":100.0,"reorderQty":100.0,"unit":"ml","cat":"Grains","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed005","name":"White Corn Syrup","qty":450.0,"minQty":100.0,"reorderQty":100.0,"unit":"ml","cat":"Grains","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed006","name":"Soy Sauce","qty":300.0,"minQty":100.0,"reorderQty":100.0,"unit":"ml","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed007","name":"Balsamic Vinegar","qty":500.0,"minQty":100.0,"reorderQty":100.0,"unit":"ml","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed008","name":"Oyster Sauce","qty":100.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed009","name":"Sweet Soy Sauce","qty":450.0,"minQty":100.0,"reorderQty":100.0,"unit":"ml","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed010","name":"Hoisin Sauce","qty":200.0,"minQty":100.0,"reorderQty":100.0,"unit":"ml","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed011","name":"Rice Vinegar","qty":325.0,"minQty":100.0,"reorderQty":100.0,"unit":"ml","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed012","name":"Mirin","qty":150.0,"minQty":100.0,"reorderQty":100.0,"unit":"ml","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed013","name":"Roasted Sesame Oil","qty":90.0,"minQty":10.0,"reorderQty":10.0,"unit":"ml","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed014","name":"Ikea Gravy Mix","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed015","name":"Shepherds Pie Mix","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed016","name":"Hollandaise Sauce","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed017","name":"Four Peppercorn Gravy Mix","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed018","name":"Brown Gravy Mix","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed019","name":"Vegetarian Brown Gravy Mix","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed020","name":"Chow Mein Sauce","qty":3.0,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed021","name":"Chicken Bouillon Mix","qty":6.0,"minQty":6.0,"reorderQty":6.0,"unit":"unit","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed022","name":"Shaoxing Wine","qty":50.0,"minQty":10.0,"reorderQty":10.0,"unit":"ml","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed023","name":"Rice","qty":500.0,"minQty":500.0,"reorderQty":500.0,"unit":"g","cat":"Grains","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed024","name":"Ghee","qty":600.0,"minQty":100.0,"reorderQty":100.0,"unit":"g","cat":"Sauces","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed025","name":"Greek Seasoning","qty":525.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed026","name":"Montreal Chicken","qty":675.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed027","name":"Barbecue Chicken","qty":200.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed028","name":"Smoked Paprika And Onion","qty":360.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed029","name":"Taco Seasoning","qty":500.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed030","name":"Garlic Parmesan","qty":320.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed031","name":"Sea Salt","qty":850.0,"minQty":100.0,"reorderQty":100.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed032","name":"Shawarma","qty":75.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed033","name":"Montreal Burger","qty":60.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed034","name":"Steak Seasoning","qty":100.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed035","name":"Ground Black Pepper","qty":150.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed036","name":"Cajun Seasoning","qty":150.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed037","name":"Trader Joes Allspice","qty":65.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed038","name":"Everything Bagel Seasoning","qty":65.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed039","name":"Garlic Powder","qty":100.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed040","name":"White Pepper","qty":34.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed041","name":"Italian Seasoning","qty":20.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed042","name":"Mediterranean Salad Seasoning","qty":20.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed043","name":"Onion Powder","qty":116.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed044","name":"Dried Parsley","qty":6.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed045","name":"Tahini","qty":125.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed046","name":"Nutmeg Ground","qty":22.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed047","name":"Ground Cinnamon","qty":5.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Spices","expiry":"","notes":"Cooking Area","brand":""},{"id":"seed048","name":"Shawna Paratha","qty":10.0,"minQty":2.0,"reorderQty":2.0,"unit":"pack","cat":"Frozen","expiry":"","notes":"Freezer","brand":""},{"id":"seed049","name":"Breakfast Sausages","qty":15.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Frozen","expiry":"","notes":"Freezer","brand":""},{"id":"seed050","name":"California Mix Veggies","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"bag","cat":"Frozen","expiry":"2027-11","notes":"Freezer","brand":""},{"id":"seed051","name":"Berry Blend Frozen Fruits","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"bag","cat":"Frozen","expiry":"2027-02","notes":"Freezer","brand":""},{"id":"seed052","name":"Wild Blueberries","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"bag","cat":"Frozen","expiry":"2027-02","notes":"Freezer","brand":""},{"id":"seed053","name":"Stir Fry Medley","qty":0.5,"minQty":1.0,"reorderQty":1,"unit":"bag","cat":"Frozen","expiry":"","notes":"Freezer","brand":""},{"id":"seed054","name":"Fries","qty":0.0,"minQty":1.0,"reorderQty":1,"unit":"bag","cat":"Frozen","expiry":"","notes":"Freezer","brand":""},{"id":"seed055","name":"Chicken Strips","qty":13.0,"minQty":6.0,"reorderQty":6.0,"unit":"unit","cat":"Frozen","expiry":"","notes":"Freezer","brand":""},{"id":"seed056","name":"Onion Rings","qty":0.05,"minQty":0.5,"reorderQty":1,"unit":"bag","cat":"Frozen","expiry":"","notes":"Freezer","brand":""},{"id":"seed057","name":"Jamaican Patty","qty":2.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Frozen","expiry":"","notes":"Freezer","brand":""},{"id":"seed058","name":"Veggie Burger","qty":2.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Frozen","expiry":"","notes":"Freezer","brand":""},{"id":"seed059","name":"Vanilla Ice Cream","qty":0.5,"minQty":0.2,"reorderQty":1,"unit":"box","cat":"Snacks","expiry":"","notes":"Freezer","brand":""},{"id":"seed060","name":"Ice Cream Sandwiches","qty":4.5,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Snacks","expiry":"","notes":"Freezer","brand":""},{"id":"seed061","name":"Pita","qty":5.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Produce","expiry":"","notes":"Freezer","brand":""},{"id":"seed062","name":"Tandoori Naan","qty":5.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Produce","expiry":"","notes":"Freezer","brand":""},{"id":"seed063","name":"Garlic Naan","qty":5.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Produce","expiry":"","notes":"Freezer","brand":""},{"id":"seed064","name":"Stewing Beef","qty":875.0,"minQty":500.0,"reorderQty":500.0,"unit":"g","cat":"Protein","expiry":"","notes":"Freezer","brand":""},{"id":"seed065","name":"Ground Beef","qty":1000.0,"minQty":500.0,"reorderQty":500.0,"unit":"g","cat":"Protein","expiry":"","notes":"Freezer","brand":""},{"id":"seed066","name":"Sirloin Steak","qty":3.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Protein","expiry":"","notes":"Freezer","brand":""},{"id":"seed067","name":"Beef Burger","qty":6.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Protein","expiry":"","notes":"Freezer","brand":""},{"id":"seed068","name":"Sausage","qty":10.0,"minQty":5.0,"reorderQty":5.0,"unit":"unit","cat":"Protein","expiry":"","notes":"Freezer","brand":""},{"id":"seed069","name":"Cool Whip","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Produce","expiry":"","notes":"Freezer","brand":""},{"id":"seed070","name":"Homemade Momos","qty":0.5,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Produce","expiry":"","notes":"Freezer","brand":""},{"id":"seed071","name":"Sausage Rolls","qty":32.0,"minQty":10.0,"reorderQty":10.0,"unit":"unit","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed072","name":"Pentys Wings","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed073","name":"Brar Samosa","qty":25.0,"minQty":5.0,"reorderQty":5.0,"unit":"unit","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed074","name":"Chicken Broccoli And Cheese","qty":8.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed075","name":"Chicken Parmesan","qty":2.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed076","name":"Veggie Burgers","qty":12.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed077","name":"Frozen Pizza","qty":6.0,"minQty":2.0,"reorderQty":2.0,"unit":"box","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed078","name":"Frozen Momos Costco","qty":0.5,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed079","name":"Spring Rolls","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"box","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed080","name":"Open Wings","qty":0.2,"minQty":0.0,"reorderQty":1,"unit":"unit","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed081","name":"Ginger Beef","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed082","name":"Salmon Fillets","qty":4.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed083","name":"Chicken Nuggets","qty":0.75,"minQty":0.2,"reorderQty":1,"unit":"box","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed084","name":"Rainbow Tortellini Seven Cheese","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"bag","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed085","name":"Swedish Meatballs Ikea","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"bag","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed086","name":"Sweet Potato Fries","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"bag","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed087","name":"Jamaican Patty Garage","qty":3.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed088","name":"Homefries","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"bag","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed089","name":"Onion Rings Garage","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"bag","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed090","name":"Kit Kat","qty":6.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Snacks","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed091","name":"Mango Sorbet","qty":4.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Snacks","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed092","name":"Volcano Cake","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Snacks","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed093","name":"Frozen Chicken Breast","qty":16.0,"minQty":4.0,"reorderQty":4.0,"unit":"unit","cat":"Protein","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed094","name":"Teriyaki Chicken","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Protein","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed095","name":"Chipotle Chicken","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Protein","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed096","name":"Halim","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Produce","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed097","name":"Kidney Beans Frozen","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Produce","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed098","name":"Subzi","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Produce","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed099","name":"Bacon","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"bag","cat":"Protein","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed100","name":"Tacoitos","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"box","cat":"Frozen","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed101","name":"Shawarma Rice","qty":4.0,"minQty":1.0,"reorderQty":1,"unit":"bag","cat":"Produce","expiry":"","notes":"Garage Freezer","brand":""},{"id":"seed102","name":"Steel Wool","qty":4.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"","notes":"Kitchen Sink","brand":""},{"id":"seed103","name":"Steel Sponges","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Kitchen Sink","brand":""},{"id":"seed104","name":"Disposable Gloves","qty":10.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"","notes":"Kitchen Sink","brand":""},{"id":"seed105","name":"Lysol Kitchen","qty":0.5,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Kitchen Sink","brand":""},{"id":"seed106","name":"Febreze","qty":3.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Kitchen Sink","brand":""},{"id":"seed107","name":"Jet-Dry Rinse Aid","qty":1.5,"minQty":0.5,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Kitchen Sink","brand":""},{"id":"seed108","name":"Comet","qty":0.5,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Kitchen Sink","brand":""},{"id":"seed109","name":"Windex Kitchen","qty":0.25,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Kitchen Sink","brand":""},{"id":"seed110","name":"Rubbing Alcohol 70%","qty":0.25,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Kitchen Sink","brand":""},{"id":"seed111","name":"Dishwasher Tablets","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"box","cat":"Other","expiry":"2028-04","notes":"Kitchen Sink","brand":""},{"id":"seed112","name":"Hand Soap Kitchen","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Kitchen Sink","brand":""},{"id":"seed113","name":"Dryer Sheets","qty":4.5,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Other","expiry":"","notes":"Laundry Room","brand":""},{"id":"seed114","name":"Oxiclean","qty":0.5,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Laundry Room","brand":""},{"id":"seed115","name":"Laundry Detergent","qty":2.25,"minQty":0.5,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Laundry Room","brand":""},{"id":"seed116","name":"Fabric Softener","qty":1.0,"minQty":0.5,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Laundry Room","brand":""},{"id":"seed117","name":"Bleach","qty":0.5,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Laundry Room","brand":""},{"id":"seed118","name":"Air Wick","qty":6.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"","notes":"Laundry Room","brand":""},{"id":"seed119","name":"Humidifier Filters","qty":7.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Laundry Room","brand":""},{"id":"seed120","name":"Ryans Toothbrush Heads","qty":9.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed121","name":"Ryans Deodorant","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed122","name":"Ryans Shampoo","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed123","name":"Ryans Body Wash","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed124","name":"Sabrinas Deodorant","qty":3.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed125","name":"Sabrinas Conditioner","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed126","name":"Sabrinas Shampoo","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed127","name":"Toothpaste","qty":4.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed128","name":"Ryans Razor Blades","qty":16.0,"minQty":4.0,"reorderQty":4.0,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed129","name":"Ryans Hair Wax","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed130","name":"Floss Picks","qty":90.0,"minQty":45.0,"reorderQty":45.0,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed131","name":"Cotton Swabs","qty":0.8,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed132","name":"Toothpaste (2)","qty":4.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed133","name":"Ryans Razor Blades (2)","qty":16.0,"minQty":4.0,"reorderQty":4.0,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed134","name":"Ovulation Test","qty":23.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"2027-06","notes":"Linen Closet","brand":""},{"id":"seed135","name":"Pregnancy Test","qty":15.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"2027-06","notes":"Linen Closet","brand":""},{"id":"seed136","name":"Sunscreen Cream","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed137","name":"Sunscreen Spray","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed138","name":"Insect Repellent","qty":4.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Linen Closet","brand":""},{"id":"seed139","name":"Crazy Glue","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Main Floor Closet","brand":""},{"id":"seed140","name":"Painters Tape","qty":2.0,"minQty":0.5,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Main Floor Closet","brand":""},{"id":"seed141","name":"Packing Tape","qty":6.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"","notes":"Laundry Room","brand":""},{"id":"seed142","name":"Toilet Bowl Cleaner","qty":0.25,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Main Washroom","brand":""},{"id":"seed143","name":"Lysol Washroom","qty":0.8,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Main Washroom","brand":""},{"id":"seed144","name":"Tilex","qty":1.0,"minQty":0.1,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Main Washroom","brand":""},{"id":"seed145","name":"Scrubbing Bubbles","qty":0.5,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Main Washroom","brand":""},{"id":"seed146","name":"Windex Washroom","qty":0.4,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Main Washroom","brand":""},{"id":"seed147","name":"Lysol Office","qty":4.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"","notes":"Office Closet","brand":""},{"id":"seed148","name":"Plastic Whiskey Glasses","qty":48.0,"minQty":6.0,"reorderQty":6.0,"unit":"unit","cat":"Other","expiry":"","notes":"Office Closet","brand":""},{"id":"seed149","name":"Wine Tumbler","qty":10.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"","notes":"Office Closet","brand":""},{"id":"seed150","name":"Long Cocktail Glass","qty":39.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"","notes":"Office Closet","brand":""},{"id":"seed151","name":"Wine Glass With Stem","qty":13.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"","notes":"Office Closet","brand":""},{"id":"seed152","name":"Bounty Paper Towels","qty":35.0,"minQty":12.0,"reorderQty":12.0,"unit":"unit","cat":"Other","expiry":"","notes":"Office Closet","brand":""},{"id":"seed153","name":"Toilet Paper","qty":60.0,"minQty":30.0,"reorderQty":30.0,"unit":"unit","cat":"Other","expiry":"","notes":"Office Closet","brand":""},{"id":"seed154","name":"Kleenex Box","qty":15.0,"minQty":6.0,"reorderQty":6.0,"unit":"unit","cat":"Other","expiry":"","notes":"Office Closet","brand":""},{"id":"seed155","name":"Red Lobster Biscuit Mix","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Grains","expiry":"","notes":"Pantry","brand":""},{"id":"seed156","name":"Buldak","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Frozen","expiry":"","notes":"Pantry","brand":""},{"id":"seed157","name":"KD Kraft Dinner","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Frozen","expiry":"","notes":"Pantry","brand":""},{"id":"seed158","name":"Instant Noodles","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Frozen","expiry":"","notes":"Pantry","brand":""},{"id":"seed159","name":"Taco Dinner Kit","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Frozen","expiry":"","notes":"Pantry","brand":""},{"id":"seed160","name":"Coconut Milk","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"can","cat":"Canned","expiry":"2026-08","notes":"Pantry","brand":""},{"id":"seed161","name":"Canned Beans Heinz","qty":4.0,"minQty":1.0,"reorderQty":1,"unit":"can","cat":"Canned","expiry":"2026-06","notes":"Pantry","brand":""},{"id":"seed162","name":"Sweetened Condensed Milk","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"can","cat":"Canned","expiry":"2026-03","notes":"Pantry","brand":""},{"id":"seed163","name":"Pineapple Chunks","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"can","cat":"Canned","expiry":"2026-12","notes":"Pantry","brand":""},{"id":"seed164","name":"Mango Pulp","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"can","cat":"Canned","expiry":"","notes":"Pantry","brand":""},{"id":"seed165","name":"Cream of Mushroom Soup","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"can","cat":"Canned","expiry":"","notes":"Pantry","brand":""},{"id":"seed166","name":"Cream of Chicken Soup","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"can","cat":"Canned","expiry":"","notes":"Pantry","brand":""},{"id":"seed167","name":"Campbells Chunky Beef Soup","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"can","cat":"Canned","expiry":"","notes":"Pantry","brand":""},{"id":"seed168","name":"Black Olives","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"can","cat":"Canned","expiry":"","notes":"Pantry","brand":""},{"id":"seed169","name":"Canned Chicken","qty":11.0,"minQty":6.0,"reorderQty":6.0,"unit":"can","cat":"Canned","expiry":"2028-10","notes":"Pantry","brand":""},{"id":"seed170","name":"Black Beans","qty":2.0,"minQty":2.0,"reorderQty":2.0,"unit":"can","cat":"Canned","expiry":"2027-12","notes":"Pantry","brand":""},{"id":"seed171","name":"Dark Red Kidney Beans","qty":2.0,"minQty":2.0,"reorderQty":2.0,"unit":"can","cat":"Canned","expiry":"2026-11","notes":"Pantry","brand":""},{"id":"seed172","name":"Chickpeas","qty":4.0,"minQty":2.0,"reorderQty":2.0,"unit":"can","cat":"Canned","expiry":"2027-11","notes":"Pantry","brand":""},{"id":"seed173","name":"Swiffer Wet Cloths","qty":0.6,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed174","name":"Swiffer Dry Cloths","qty":0.2,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed175","name":"Kirkland Water Filters","qty":10.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed176","name":"Fridge Water Filter","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed177","name":"Finish Dishwasher Cleaner","qty":12.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"2026-08","notes":"Pantry","brand":""},{"id":"seed178","name":"Finish Jet Dry","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed179","name":"Beef Broth","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Sauces","expiry":"","notes":"Pantry","brand":""},{"id":"seed180","name":"Ketchup","qty":3.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Sauces","expiry":"","notes":"Pantry","brand":""},{"id":"seed181","name":"Salsa","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Sauces","expiry":"","notes":"Pantry","brand":""},{"id":"seed182","name":"Butter Chicken Sauce","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Sauces","expiry":"","notes":"Pantry","brand":""},{"id":"seed183","name":"Teriyaki Sauce","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Sauces","expiry":"2026-11","notes":"Pantry","brand":""},{"id":"seed184","name":"Oyster Sauce Pantry","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Sauces","expiry":"2026-11","notes":"Pantry","brand":""},{"id":"seed185","name":"Vinegar","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Sauces","expiry":"2029-10","notes":"Pantry","brand":""},{"id":"seed186","name":"Mayo","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Sauces","expiry":"","notes":"Pantry","brand":""},{"id":"seed187","name":"Relish","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Sauces","expiry":"","notes":"Pantry","brand":""},{"id":"seed188","name":"Pasta Sauce","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Sauces","expiry":"","notes":"Pantry","brand":""},{"id":"seed189","name":"Ice Cream Sugar Cones","qty":12.0,"minQty":6.0,"reorderQty":6.0,"unit":"unit","cat":"Snacks","expiry":"","notes":"Pantry","brand":""},{"id":"seed190","name":"Ice Cream Waffle Cones","qty":8.0,"minQty":6.0,"reorderQty":6.0,"unit":"unit","cat":"Snacks","expiry":"","notes":"Pantry","brand":""},{"id":"seed191","name":"Salad Topper","qty":1.0,"minQty":0.2,"reorderQty":1,"unit":"kg","cat":"Grains","expiry":"","notes":"Pantry","brand":""},{"id":"seed192","name":"Roasted Chana","qty":400.0,"minQty":100.0,"reorderQty":100.0,"unit":"g","cat":"Grains","expiry":"","notes":"Pantry","brand":""},{"id":"seed193","name":"Rice Krispie Cereal","qty":0.66,"minQty":0.5,"reorderQty":1,"unit":"box","cat":"Grains","expiry":"2026-02","notes":"Pantry","brand":""},{"id":"seed194","name":"Harvest Crunch Granola","qty":1.5,"minQty":0.5,"reorderQty":1,"unit":"box","cat":"Grains","expiry":"","notes":"Pantry","brand":""},{"id":"seed195","name":"Red Lentil Pasta","qty":1.0,"minQty":0.2,"reorderQty":1,"unit":"kg","cat":"Grains","expiry":"","notes":"Pantry","brand":""},{"id":"seed196","name":"Brown Rice","qty":1.0,"minQty":0.2,"reorderQty":1,"unit":"kg","cat":"Grains","expiry":"","notes":"Pantry","brand":""},{"id":"seed197","name":"Spaghetti","qty":1.25,"minQty":0.5,"reorderQty":1,"unit":"pack","cat":"Grains","expiry":"","notes":"Pantry","brand":""},{"id":"seed198","name":"Vega Protein Powder","qty":0.7,"minQty":0.25,"reorderQty":1,"unit":"unit","cat":"Grains","expiry":"","notes":"Pantry","brand":""},{"id":"seed199","name":"Quinoa","qty":0.5,"minQty":0.25,"reorderQty":1,"unit":"unit","cat":"Grains","expiry":"","notes":"Pantry","brand":""},{"id":"seed200","name":"Thai White Glutinous Rice","qty":0.8,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Grains","expiry":"","notes":"Pantry","brand":""},{"id":"seed201","name":"Tetley Orange Pekoe Tea","qty":300.0,"minQty":20.0,"reorderQty":20.0,"unit":"unit","cat":"Grains","expiry":"2028-07","notes":"Pantry","brand":""},{"id":"seed202","name":"Club Soda","qty":6.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed203","name":"Coke","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed204","name":"Captain Morgan Mix","qty":6.0,"minQty":3.0,"reorderQty":3.0,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed205","name":"Tonic Water","qty":6.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed206","name":"White Potatoes","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"lb","cat":"Produce","expiry":"","notes":"Pantry","brand":""},{"id":"seed207","name":"Yellow Onions","qty":9.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Produce","expiry":"","notes":"Pantry","brand":""},{"id":"seed208","name":"Liquid IV","qty":46.0,"minQty":10.0,"reorderQty":10.0,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed209","name":"NyQuil Night Time","qty":21.0,"minQty":5.0,"reorderQty":5.0,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed210","name":"Gummy Multivitamins","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed211","name":"Vitamin D","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed212","name":"Metamucil","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed213","name":"Garbage Bags Black","qty":1.5,"minQty":0.5,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed214","name":"Garbage Bags White","qty":0.6,"minQty":0.2,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed215","name":"Recycling Bags","qty":0.25,"minQty":0.25,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed216","name":"Organic Garbage Bags","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"pack","cat":"Other","expiry":"2027-05","notes":"Pantry","brand":""},{"id":"seed217","name":"Bounty Pantry","qty":8.0,"minQty":2.0,"reorderQty":2.0,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed218","name":"Hot Mango Chutney","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Canned","expiry":"","notes":"Pantry","brand":""},{"id":"seed219","name":"Italian Herb Pesto","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Canned","expiry":"2027-07","notes":"Pantry","brand":""},{"id":"seed220","name":"Pickled Jalapenos","qty":0.0,"minQty":1.0,"reorderQty":1,"unit":"jar","cat":"Canned","expiry":"2027-05","notes":"Pantry","brand":""},{"id":"seed221","name":"Green Olives","qty":0.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Canned","expiry":"","notes":"Pantry","brand":""},{"id":"seed222","name":"Ziploc Freezer Medium","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed223","name":"Ziploc Freezer Large","qty":3.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed224","name":"Aluminum Foil","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed225","name":"Parchment Paper","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed226","name":"Scrub Daddy Sponges","qty":7.0,"minQty":3.0,"reorderQty":3.0,"unit":"unit","cat":"Other","expiry":"2026-12","notes":"Pantry","brand":""},{"id":"seed227","name":"Dawn Power Wash","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Other","expiry":"","notes":"Pantry","brand":""},{"id":"seed228","name":"Avocado Oil","qty":2.0,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Sauces","expiry":"","notes":"Pantry","brand":""},{"id":"seed229","name":"Greek Olive Oil","qty":0.0,"minQty":0.5,"reorderQty":1,"unit":"unit","cat":"Sauces","expiry":"2026-01","notes":"Pantry","brand":""},{"id":"seed230","name":"Olive Oil","qty":1.5,"minQty":1.0,"reorderQty":1,"unit":"unit","cat":"Sauces","expiry":"2026-08","notes":"Pantry","brand":""},{"id":"seed231","name":"Vegetable Oil","qty":0.8,"minQty":0.5,"reorderQty":1,"unit":"unit","cat":"Sauces","expiry":"2026-05","notes":"Pantry","brand":""},{"id":"seed232","name":"White Cheddar Popcorn","qty":110.0,"minQty":10.0,"reorderQty":10.0,"unit":"g","cat":"Snacks","expiry":"","notes":"Pantry","brand":""},{"id":"seed233","name":"Doritos","qty":1.0,"minQty":0.0,"reorderQty":1,"unit":"bag","cat":"Snacks","expiry":"","notes":"Pantry","brand":""},{"id":"seed234","name":"Nachos","qty":1.0,"minQty":1.0,"reorderQty":1,"unit":"bag","cat":"Snacks","expiry":"","notes":"Pantry","brand":""}];

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
        border: "1px solid " + (sel ? ac : hasData ? "rgba(74,222,128,.25)" : "var(--card-border)"),
        background: sel ? ac.replace(/[^,]+\)$/, "0.08)").replace("rgb(", "rgba(") : hasData ? "rgba(74,222,128,.05)" : "rgba(255,255,255,.02)",
        cursor: "pointer",
        transition: "all .12s"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: sel ? ac : isToday ? "var(--text-primary)" : "var(--text-secondary)",
        fontSize: 9,
        fontWeight: sel ? 800 : 500,
        margin: "0 0 2px",
        textTransform: "uppercase"
      }
    }, isToday ? "NOW" : dow), /*#__PURE__*/React.createElement("p", {
      style: {
        color: sel ? ac : hasData ? "#4ade80" : "var(--text-muted)",
        fontFamily: "'Syne',sans-serif",
        fontSize: 14,
        fontWeight: sel ? 800 : 600,
        margin: 0
      }
    }, dom), hasData && /*#__PURE__*/React.createElement("div", {
      style: {
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: sel ? ac : "#4ade80",
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
  useAutoSave(backfill ? null : KEYS.log(getToday()), {
    morning: data
  }, !busy);
  const go = async () => {
    setBusy(true);
    const date = backfill ? backfillDate : getToday();
    const existing = (await DB.get(KEYS.log(date))) || {};
    await DB.set(KEYS.log(date), {
      ...existing,
      morning: data
    });
    setBusy(false);
    setOk(true);
    onSave && onSave(); // refresh allLogs so History/Calendar update
    // Check milestones
    const stepGoalHit = parseInt(steps) >= stepGoal;
    if (stepGoalHit && onMilestone) onMilestone(`${parseInt(steps).toLocaleString()} steps — goal hit! 💪`);
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
      DB.get(KEYS.log(d)).then(l => setHistLog(l || null));
    },
    allLogs: allLogsArr,
    accentColor: "#f4a823"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#60a5fa",
      fontSize: 12,
      fontWeight: 700,
      margin: "0 0 12px"
    }
  }, fmtMid(histDate), " \u2014 Morning Log"), /*#__PURE__*/React.createElement(MorningReadOnly, {
    log: histLog,
    date: histDate
  }), histDate !== getToday() && histLog?.evening && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#60a5fa",
      fontSize: 12,
      fontWeight: 700,
      margin: "0 0 12px"
    }
  }, "Same day \u2014 Evening Log"), /*#__PURE__*/React.createElement(EveningReadOnly, {
    log: histLog,
    date: histDate
  })))), view === "log" && ok && /*#__PURE__*/React.createElement(Card, {
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
  }, "Updates will overwrite. Scroll down to re-submit.")), view === "log" && /*#__PURE__*/React.createElement(React.Fragment, null, new Date().getHours() >= 10 && !todayLog?.morning && /*#__PURE__*/React.createElement("div", {
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
  }, busy ? "SAVING..." : "LOG MORNING →"))));
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
      setMobility(logData?.morning?.mobilityChecked || {});
      setMobilityPool(pool);
      setWeekPlan(plan);
      setMobLoading(false);
    };
    load();
  }, []);

  const setMobility = async (updated) => {
    setMobilityState(typeof updated === "function" ? updated(mobility) : updated);
    const checked = typeof updated === "function" ? updated(mobility) : updated;
    const todayDayKey = getDayKey(getToday());
    const todayIds = weekPlan?.[todayDayKey] || [];
    const dailyList = todayIds.map(id => mobilityPool.find(e => e.id === id)).filter(Boolean);
    const mobDone = dailyList.filter(e => checked[e.id]).length;
    const existing = (await DB.get(KEYS.log(getToday()))) || {};
    await DB.set(KEYS.log(getToday()), { ...existing, morning: { ...(existing.morning || {}), mobilityChecked: checked, mobilityCount: mobDone } });
    onSave && onSave();
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
const STRENGTH_POOL = {
  chest_tri: [{
    id: "bp_floor",
    name: "Dumbbell Floor Press",
    sets: "3×12",
    equip: "dumbbells",
    tip: "DBs at chest, press up, elbows at 45°."
  }, {
    id: "pushup",
    name: "Push-Ups",
    sets: "3×max",
    equip: "bodyweight",
    tip: "Chest touches floor, full range every rep."
  }, {
    id: "diamond",
    name: "Diamond Push-Ups",
    sets: "3×10",
    equip: "bodyweight",
    tip: "Hands form triangle. Hits triceps hard."
  }, {
    id: "tri_push",
    name: "Band Tricep Pushdown",
    sets: "3×15",
    equip: "band",
    tip: "Elbows tucked, push to full extension."
  }, {
    id: "tri_oh",
    name: "Band Overhead Tricep Extension",
    sets: "3×12",
    equip: "band",
    tip: "Stand on band, extend overhead."
  }, {
    id: "chest_fly",
    name: "Dumbbell Chest Fly",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Wide arc, squeeze at top."
  }, {
    id: "band_chest",
    name: "Band Chest Press",
    sets: "3×15",
    equip: "band",
    tip: "Anchor behind, press forward."
  }, {
    id: "mb_pushup",
    name: "Med Ball Push-Up",
    sets: "3×10",
    equip: "med ball",
    tip: "Both hands on ball, extra stability."
  }, {
    id: "close_press",
    name: "Close-Grip DB Press",
    sets: "3×12",
    equip: "dumbbells",
    tip: "DBs touching throughout."
  }, {
    id: "tri_kick",
    name: "Tricep Kickback",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Hinge forward, kick DB back."
  }],
  back_bi: [{
    id: "db_row",
    name: "Dumbbell Row",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Flat back, drive elbow up and back."
  }, {
    id: "band_row",
    name: "Band Seated Row",
    sets: "3×15",
    equip: "band",
    tip: "Row to ribs, squeeze shoulder blades."
  }, {
    id: "face_pull",
    name: "Band Face Pulls",
    sets: "3×15",
    equip: "band",
    tip: "Anchor eye level, pull to face, elbows high."
  }, {
    id: "lat_pull",
    name: "Band Lat Pulldown",
    sets: "3×12",
    equip: "band",
    tip: "Anchor overhead, pull to upper chest."
  }, {
    id: "pull_apart",
    name: "Band Pull-Aparts",
    sets: "3×15",
    equip: "band",
    tip: "Arms straight, pull apart to chest."
  }, {
    id: "rev_fly",
    name: "Band Reverse Fly",
    sets: "3×12",
    equip: "band",
    tip: "Hinge forward, arms out like wings."
  }, {
    id: "band_curl",
    name: "Band Bicep Curls",
    sets: "3×15",
    equip: "band",
    tip: "Elbows pinned to sides."
  }, {
    id: "db_curl",
    name: "Dumbbell Bicep Curls",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Supinate at top."
  }, {
    id: "hammer",
    name: "Hammer Curls",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Neutral grip, hits brachialis."
  }, {
    id: "conc_curl",
    name: "Concentration Curls",
    sets: "3×10",
    equip: "dumbbells",
    tip: "Elbow on thigh, one arm at a time."
  }],
  legs_glutes: [{
    id: "band_squat",
    name: "Band Squats",
    sets: "3×15",
    equip: "band",
    tip: "Stand on band, hold at shoulders."
  }, {
    id: "goblet",
    name: "Med Ball Goblet Squat",
    sets: "3×12",
    equip: "med ball",
    tip: "Hold at chest, deep squat."
  }, {
    id: "rdl",
    name: "Dumbbell RDL",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Hinge at hips, feel hamstrings load."
  }, {
    id: "split_squat",
    name: "Rear-Foot Elevated Split Squat",
    sets: "3×10",
    equip: "bodyweight",
    tip: "Back foot on couch."
  }, {
    id: "rev_lunge",
    name: "Reverse Lunges",
    sets: "3×10",
    equip: "dumbbells",
    tip: "Step back, lower knee to floor."
  }, {
    id: "band_abduct",
    name: "Band Hip Abductions",
    sets: "3×15",
    equip: "band",
    tip: "Band at ankles, kick out to side."
  }, {
    id: "band_lat",
    name: "Band Lateral Walks",
    sets: "3×20",
    equip: "band",
    tip: "10 steps each direction."
  }, {
    id: "glute_kick",
    name: "Band Glute Kickbacks",
    sets: "3×15",
    equip: "band",
    tip: "Drive heel back and squeeze."
  }, {
    id: "sumo",
    name: "Sumo Squat",
    sets: "3×12",
    equip: "med ball",
    tip: "Wide stance, hold ball between legs."
  }, {
    id: "clamshell_b",
    name: "Band Clamshells",
    sets: "3×20",
    equip: "band",
    tip: "Side-lying, rotate knee up."
  }],
  shoulders_core: [{
    id: "db_press",
    name: "DB Shoulder Press",
    sets: "3×12",
    equip: "dumbbells",
    tip: "DBs at ear level, press overhead."
  }, {
    id: "lat_raise",
    name: "Lateral Raises",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Lead with elbows, shoulder height."
  }, {
    id: "ab_roller",
    name: "Ab Roller Rollouts",
    sets: "3×8",
    equip: "ab roller",
    tip: "Roll forward, pull back with abs — no hip sag."
  }, {
    id: "mb_twist",
    name: "Med Ball Russian Twists",
    sets: "3×20",
    equip: "med ball",
    tip: "Feet off floor, twist side to side."
  }, {
    id: "plank",
    name: "Plank Hold",
    sets: "3×30s",
    equip: "bodyweight",
    tip: "Squeeze everything."
  }, {
    id: "mb_slam",
    name: "Med Ball Slam",
    sets: "3×10",
    equip: "med ball",
    tip: "Slam hard, catch the bounce."
  }, {
    id: "band_press",
    name: "Band Overhead Press",
    sets: "3×15",
    equip: "band",
    tip: "Stand on band, press overhead."
  }, {
    id: "front_raise",
    name: "Front Raises",
    sets: "3×12",
    equip: "band",
    tip: "One arm at a time."
  }, {
    id: "upright_row",
    name: "Band Upright Row",
    sets: "3×12",
    equip: "band",
    tip: "Pull to chin, elbows flare out."
  }, {
    id: "roller_pike",
    name: "Ab Roller Pike",
    sets: "3×8",
    equip: "ab roller",
    tip: "Start in plank, pike hips up."
  }],
  push_pull: [{
    id: "pp_pushup",
    name: "Push-Ups (controlled)",
    sets: "3×12",
    equip: "bodyweight",
    tip: "3 sec down, explode up."
  }, {
    id: "pp_row",
    name: "Band Row (wide grip)",
    sets: "3×15",
    equip: "band",
    tip: "Elbows wide for upper back."
  }, {
    id: "pp_floor",
    name: "DB Floor Press",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Full range of motion."
  }, {
    id: "pp_revfly",
    name: "Band Reverse Fly",
    sets: "3×12",
    equip: "band",
    tip: "Pull arms wide, rear delts."
  }, {
    id: "pp_mbpush",
    name: "Med Ball Push-Up",
    sets: "3×10",
    equip: "med ball",
    tip: "Extra stabilizers."
  }, {
    id: "pp_facepull",
    name: "Face Pulls",
    sets: "3×15",
    equip: "band",
    tip: "Non-negotiable for shoulder health."
  }, {
    id: "pp_bandchest",
    name: "Band Chest Fly",
    sets: "3×12",
    equip: "band",
    tip: "Bring hands together."
  }, {
    id: "pp_latpull",
    name: "Band Lat Pulldown",
    sets: "3×12",
    equip: "band",
    tip: "Pull to upper chest."
  }, {
    id: "pp_pike",
    name: "Pike Push-Up",
    sets: "3×10",
    equip: "bodyweight",
    tip: "Hips high."
  }, {
    id: "pp_apart",
    name: "Band Pull-Aparts",
    sets: "3×20",
    equip: "band",
    tip: "Every. Single. Day."
  }],
  arms_core: [{
    id: "ac_curl",
    name: "DB Bicep Curls",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Full range."
  }, {
    id: "ac_dip",
    name: "Tricep Dips",
    sets: "3×12",
    equip: "bodyweight",
    tip: "Lower to 90°."
  }, {
    id: "ac_hammer",
    name: "Hammer Curls",
    sets: "3×12",
    equip: "dumbbells",
    tip: "Neutral grip."
  }, {
    id: "ac_band_tri",
    name: "Band Tricep Pushdown",
    sets: "3×15",
    equip: "band",
    tip: "Elbows glued to sides."
  }, {
    id: "ac_roll",
    name: "Ab Roller Rollouts",
    sets: "3×8",
    equip: "ab roller",
    tip: "Hips must not sag."
  }, {
    id: "ac_twist",
    name: "Med Ball Russian Twists",
    sets: "3×20",
    equip: "med ball",
    tip: "Feet off floor."
  }, {
    id: "ac_conc",
    name: "Concentration Curls",
    sets: "3×10",
    equip: "dumbbells",
    tip: "Squeeze at peak."
  }, {
    id: "ac_oh_ext",
    name: "Band Overhead Extension",
    sets: "3×12",
    equip: "band",
    tip: "Stand on band, elbows close."
  }, {
    id: "ac_deadbug",
    name: "Dead Bug",
    sets: "3×10",
    equip: "bodyweight",
    tip: "Back flat throughout."
  }, {
    id: "ac_hollow",
    name: "Hollow Body Hold",
    sets: "3×20s",
    equip: "bodyweight",
    tip: "Press lower back to floor."
  }]
};
const EQUIP_COLORS = {
  dumbbells: "#60a5fa",
  band: "#4ade80",
  bodyweight: "#9ca3af",
  "med ball": "#fb923c",
  "ab roller": "#f472b6"
};
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
const CARDIO_SESSIONS = {
  rower_intervals: {
    title: "Rower Intervals",
    equipment: "Water Rower",
    totalMin: 20,
    summary: "6 rounds · 2 min hard / 1 min easy",
    blocks: [{
      label: "Warmup",
      duration: 300,
      color: "#34d399",
      instruction: "Easy ~18 spm"
    }, {
      label: "Hard",
      duration: 120,
      color: "#ef4444",
      instruction: "Push 26-28 spm"
    }, {
      label: "Easy",
      duration: 60,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Hard",
      duration: 120,
      color: "#ef4444",
      instruction: "Round 2 — drive through heels"
    }, {
      label: "Easy",
      duration: 60,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Hard",
      duration: 120,
      color: "#ef4444",
      instruction: "Round 3"
    }, {
      label: "Easy",
      duration: 60,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Hard",
      duration: 120,
      color: "#ef4444",
      instruction: "Round 4"
    }, {
      label: "Easy",
      duration: 60,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Hard",
      duration: 120,
      color: "#ef4444",
      instruction: "Round 5"
    }, {
      label: "Easy",
      duration: 60,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Hard",
      duration: 120,
      color: "#ef4444",
      instruction: "Final round"
    }, {
      label: "Cooldown",
      duration: 240,
      color: "#60a5fa",
      instruction: "Very easy, heart rate down"
    }]
  },
  rower_steady: {
    title: "Rower Steady State",
    equipment: "Water Rower",
    totalMin: 22,
    summary: "22 min zone 2 · 20-22 spm",
    blocks: [{
      label: "Warmup",
      duration: 180,
      color: "#34d399",
      instruction: "Easy 18 spm"
    }, {
      label: "Zone 2",
      duration: 1080,
      color: "#60a5fa",
      instruction: "Sustainable pace. Talk test. 20-22 spm."
    }, {
      label: "Cooldown",
      duration: 180,
      color: "#34d399",
      instruction: "Slow down"
    }]
  },
  walk_intervals: {
    title: "Walking Pad Intervals",
    equipment: "Walking Pad",
    totalMin: 20,
    summary: "5 rounds · 2 min fast / 2 min recovery",
    blocks: [{
      label: "Warmup",
      duration: 180,
      color: "#34d399",
      instruction: "Flat 3.5 km/h"
    }, {
      label: "Fast",
      duration: 120,
      color: "#ef4444",
      instruction: "5.5-6 km/h"
    }, {
      label: "Recovery",
      duration: 120,
      color: "#34d399",
      instruction: "3.5 km/h"
    }, {
      label: "Fast",
      duration: 120,
      color: "#ef4444",
      instruction: "Round 2"
    }, {
      label: "Recovery",
      duration: 120,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Fast",
      duration: 120,
      color: "#ef4444",
      instruction: "Round 3"
    }, {
      label: "Recovery",
      duration: 120,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Fast",
      duration: 120,
      color: "#ef4444",
      instruction: "Round 4"
    }, {
      label: "Recovery",
      duration: 120,
      color: "#34d399",
      instruction: "Recover"
    }, {
      label: "Fast",
      duration: 120,
      color: "#ef4444",
      instruction: "Final"
    }, {
      label: "Cooldown",
      duration: 180,
      color: "#60a5fa",
      instruction: "Flat slow"
    }]
  }
};
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
  useEffect(() => {
    if (view === "history") {
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
  useAutoSave(KEYS.log(getToday()), {
    evening: data,
    ...(todayLog || {})
  });
  const go = async () => {
    setBusy(true);
    const existing = (await DB.get(KEYS.log(getToday()))) || {};
    await DB.set(KEYS.log(getToday()), {
      ...existing,
      evening: data
    });
    // Archive wins
    if (wi.trim()) {
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
      DB.get(KEYS.log(d)).then(l => setHistLog(l || null));
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
  }, "Viewing " + fmtLong(histDate) + " · read only")), /*#__PURE__*/React.createElement(EveningReadOnly, {
    log: histLog,
    date: histDate
  })), view === "log" && ok && /*#__PURE__*/React.createElement(Card, {
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
  }), view === "log" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Card, {
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
  }, busy ? "SAVING..." : "CLOSE THE DAY →")));
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
const GOAL_CATEGORY_META = {
  weight:         { label: "Weight",         color: "#f4a823", desc: "Track body weight progress" },
  fitness_streak: { label: "Fitness Streak", color: "#fb923c", desc: "Build consecutive workout days" },
  habit:          { label: "Habit",          color: "#a78bfa", desc: "Build a daily habit" },
  savings:        { label: "Savings",        color: "#34d399", desc: "Hit a savings target" },
  debt:           { label: "Debt Payoff",    color: "#4ade80", desc: "Pay down a balance" },
  custom:         { label: "Custom",         color: "#60a5fa", desc: "Any measurable goal" },
};
const GOAL_TEMPLATES = {
  weight: [
    { id: "lose_weight", label: "Lose Weight",     fields: { label: "Lose Weight",     direction: "lose" } },
    { id: "gain_weight", label: "Gain Weight",     fields: { label: "Gain Weight",     direction: "gain" } },
    { id: "maintain",    label: "Maintain Weight", fields: { label: "Maintain Weight", direction: "maintain" } },
  ],
  fitness_streak: [
    { id: "workout_streak", label: "Build a Workout Streak", fields: { label: "Workout Streak", targetDays: 30 } },
    { id: "stay_active",    label: "Stay Active",             fields: { label: "Stay Active",    targetDays: 90 } },
    { id: "custom_streak",  label: "Custom Streak Goal",      fields: { label: "",               targetDays: 30 } },
  ],
  habit: [
    { id: "meditate",     label: "Meditate Daily", fields: { label: "Meditate Daily",  habitName: "Meditate",     targetDays: 30 } },
    { id: "read",         label: "Read Daily",     fields: { label: "Read Daily",      habitName: "Read",         targetDays: 30 } },
    { id: "no_junk",      label: "No Junk Food",   fields: { label: "No Junk Food",    habitName: "No junk food", targetDays: 30 } },
    { id: "early_rise",   label: "Wake Up Early",  fields: { label: "Wake Up Early",   habitName: "Wake up early",targetDays: 30 } },
    { id: "custom_habit", label: "Custom Habit",   fields: { label: "",                habitName: "",             targetDays: 30 } },
  ],
  savings: [
    { id: "emergency",   label: "Emergency Fund",     fields: { label: "Emergency Fund",    targetAmount: 10000 } },
    { id: "vacation",    label: "Vacation Fund",       fields: { label: "Vacation Fund",      targetAmount: 3000 } },
    { id: "down_pay",    label: "House Down Payment",  fields: { label: "House Down Payment", targetAmount: 50000 } },
    { id: "custom_save", label: "Custom Savings Goal", fields: { label: "",                   targetAmount: 0 } },
  ],
  debt: [
    { id: "credit_card",  label: "Pay Off Credit Card", fields: { label: "Credit Card Debt", startBalance: 0 } },
    { id: "car_loan",     label: "Pay Off Car Loan",    fields: { label: "Car Loan",         startBalance: 0 } },
    { id: "student_loan", label: "Student Loan",        fields: { label: "Student Loan",     startBalance: 0 } },
    { id: "custom_debt",  label: "Custom Debt",         fields: { label: "",                 startBalance: 0 } },
  ],
  custom: [
    { id: "number_goal", label: "Hit a Number",       fields: { label: "", unit: "",           startValue: 0, targetValue: 100 } },
    { id: "completion",  label: "Complete a Project", fields: { label: "", unit: "% complete",  startValue: 0, targetValue: 100 } },
  ],
};

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

// ─────────────────────────────────────────────────────────────────────────────
// PANTRY TAB — barcode scanner + AI conversational add + item management
// ─────────────────────────────────────────────────────────────────────────────

const PANTRY_UNITS = ["g", "kg", "ml", "l", "oz", "lb", "cup", "tbsp", "tsp", "piece", "can", "bag", "box", "bottle", "bunch", "loaf", "dozen", "unit"];

// ─── Pantry helpers ─────────────────────────────────────────────────────────
const PANTRY_CATEGORIES = ["Produce", "Protein", "Dairy", "Grains", "Canned", "Sauces", "Spices", "Frozen", "Snacks", "Other"];
function pantryStatus(item) {
  const qty = parseFloat(item.qty || 0);
  const minQty = parseFloat(item.minQty || 0);
  const expiry = item.expiry ? new Date(item.expiry + "-01") : null;
  const daysToExp = expiry ? Math.round((expiry - new Date()) / 86400000) : null;
  let status = "ok";
  if (qty === 0) status = "out";else if (minQty > 0 && qty <= minQty) status = "low";else if (daysToExp !== null && daysToExp < 0) status = "expired";else if (daysToExp !== null && daysToExp <= 7) status = "expiring";
  return {
    status,
    qty,
    minQty,
    daysToExp
  };
}
function PantryItemCard({
  item,
  onEdit,
  onDelete
}) {
  const expDate = item.expiry ? new Date(item.expiry + "T12:00:00") : null;
  const today = new Date();
  const daysToExp = expDate ? Math.round((expDate - today) / 86400000) : null;
  const expColor = daysToExp === null ? "var(--text-muted)" : daysToExp < 0 ? "#ef4444" : daysToExp <= 7 ? "#f4a823" : daysToExp <= 30 ? "#facc15" : "#4ade80";
  const expLabel = daysToExp === null ? "" : daysToExp < 0 ? `Expired ${Math.abs(daysToExp)}d ago` : daysToExp === 0 ? "Expires today" : daysToExp <= 30 ? `${daysToExp}d left` : "";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      background: "var(--card-bg)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 9,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-primary)",
      fontSize: 13,
      fontWeight: 600,
      margin: "0 0 2px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, item.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#f4a823",
      fontSize: 11,
      fontWeight: 700
    }
  }, item.qty, " ", item.unit), expLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      color: expColor,
      fontSize: 10,
      fontWeight: 700
    }
  }, expLabel), item.brand && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10
    }
  }, item.brand))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onEdit(item),
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
    onClick: () => onDelete(item.id),
    style: {
      padding: "5px 9px",
      background: "rgba(239,68,68,.08)",
      border: "1px solid rgba(239,68,68,.18)",
      color: "#ef4444",
      borderRadius: 7,
      fontSize: 10,
      cursor: "pointer"
    }
  }, "\u2715")));
}
function PantryEditModal({
  item,
  onSave,
  onClose
}) {
  const [form, setForm] = useState({
    name: item.name || "",
    qty: item.qty || 1,
    unit: item.unit || "unit",
    expiry: item.expiry || "",
    brand: item.brand || "",
    location: item.location || item.notes || ""
  });
  const s = (k, v) => setForm(p => ({
    ...p,
    [k]: v
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,.75)",
      zIndex: 200
    },
    onClick: onClose
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
      zIndex: 201
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontFamily: "'Syne',sans-serif",
      fontSize: 15,
      fontWeight: 800,
      margin: "0 0 16px"
    }
  }, item.id ? "EDIT ITEM" : "ADD ITEM"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    c: "Item Name"
  }), /*#__PURE__*/React.createElement("input", {
    value: form.name,
    onChange: e => s("name", e.target.value),
    placeholder: "e.g. Rolled Oats",
    style: {
      ...inp,
      fontSize: 13
    },
    autoFocus: true
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
    c: "Quantity"
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: form.qty,
    onChange: e => s("qty", parseFloat(e.target.value) || 1),
    style: {
      ...inp,
      fontSize: 13
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 110
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "Unit"
  }), /*#__PURE__*/React.createElement("select", {
    value: form.unit,
    onChange: e => s("unit", e.target.value),
    style: {
      ...inp,
      fontSize: 13,
      padding: "10px 8px"
    }
  }, PANTRY_UNITS.map(u => /*#__PURE__*/React.createElement("option", {
    key: u,
    value: u
  }, u))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    c: "Expiry Date (optional)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: form.expiry,
    onChange: e => s("expiry", e.target.value),
    style: {
      ...inp,
      fontSize: 13,
      colorScheme: "dark"
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    c: "Brand (optional)"
  }), /*#__PURE__*/React.createElement("input", {
    value: form.brand,
    onChange: e => s("brand", e.target.value),
    placeholder: "e.g. Bob's Red Mill",
    style: {
      ...inp,
      fontSize: 13
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    c: "Storage Location"
  }), /*#__PURE__*/React.createElement("select", {
    value: form.location,
    onChange: e => s("location", e.target.value),
    style: { ...inp, fontSize: 13, padding: "10px 8px" }
  }, ["", "Kitchen", "Pantry Closet", "Bathroom", "Garage", "Laundry Room", "Bedroom", "Office", "Basement", "Car", "Other"].map(loc => /*#__PURE__*/React.createElement("option", { key: loc, value: loc }, loc || "\u2014 Select location \u2014"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (form.name.trim()) onSave({
        ...item,
        ...form,
        qty: parseFloat(form.qty) || 1,
        location: form.location,
        id: item.id || "p" + Date.now()
      });
    },
    disabled: !form.name.trim(),
    style: {
      flex: 1,
      padding: "12px 0",
      background: form.name.trim() ? "#f4a823" : "rgba(255,255,255,.05)",
      color: form.name.trim() ? "#080b11" : "var(--text-muted)",
      border: "none",
      borderRadius: 9,
      fontSize: 13,
      fontWeight: 800,
      cursor: form.name.trim() ? "pointer" : "default",
      fontFamily: "'Syne',sans-serif"
    }
  }, "SAVE \u2192"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
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
  }, "Cancel"))));
}
function PantryAIChat({
  onItemsExtracted,
  onItemsEdited,
  onClose,
  pantryItems
}) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hey! Tell me what you have or what you'd like to update. I can add new items or edit existing ones.\n\nExamples:\n• \"I bought a 2kg bag of rolled oats expiring Jan 2027\"\n• \"Update bananas to 6 pieces\"\n• \"I used 200g of coconut sugar\"\n• \"Change the oat milk expiry to March 2026\""
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [extracted, setExtracted] = useState([]);
  const [pendingEdits, setPendingEdits] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const voiceRef = useRef(null);
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const startVoice = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Voice input not supported. Try Chrome on Android.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.continuous = false;
    r.lang = "en-CA";
    r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onresult = e => { setInput(prev => (prev ? prev + " " : "") + e.results[0][0].transcript); };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start();
    voiceRef.current = r;
  };
  const send = async text => {
    if (!text.trim()) return;
    if (!window.__claude_api_key) {
      setMessages(prev => [...prev, { role: "user", content: text }, { role: "assistant", content: "No Claude API key set. Tap the ⚙ button (bottom-right) and add your key first." }]);
      setInput("");
      return;
    }
    const userMsg = { role: "user", content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const pantryList = (pantryItems || [])
        .filter(p => p.essential !== false)
        .map(p => `${p.name} | ${p.qty} ${p.unit}${p.expiry ? " | exp:" + p.expiry : ""}`)
        .join("\n");
      const systemPrompt = `You are a pantry assistant for a household. You can ADD new items or EDIT existing ones.

CURRENT PANTRY:
${pantryList || "(empty)"}

Respond with ONLY a JSON object in this format:
{
  "action": "add" | "edit" | "both" | "clarify",
  "items": [
    {"name":"Rolled Oats","qty":2,"unit":"kg","expiry":"2027-01","brand":""}
  ],
  "edits": [
    {"match":"exact name from pantry list","changes":{"qty":6}}
  ],
  "reply": "short friendly confirmation or clarifying question"
}

RULES:
- action "add": user is adding new items not in the pantry. Populate items[].
- action "edit": user is updating existing items. Populate edits[]. match must be a name from the CURRENT PANTRY list.
- action "both": user is doing both. Populate items[] AND edits[].
- action "clarify": request is ambiguous — ask a specific follow-up question in reply. Do NOT populate items or edits.
- For edits, "changes" can include: qty (set to this exact number), qtyDelta (positive or negative adjustment), unit, expiry (YYYY-MM), brand, name (rename), cat, notes.
- "I used 2 bananas" → qtyDelta: -2
- "Set bananas to 6" → qty: 6
- "Add 3 more bananas" → qtyDelta: 3
- "Update expiry of oat milk to March 2026" → changes: {expiry: "2026-03"}
- If the item name is unclear or matches multiple things, use action "clarify".
- unit must be one of: g, kg, ml, l, oz, lb, cup, tbsp, tsp, piece, can, bag, box, bottle, bunch, loaf, dozen, unit
- expiry: YYYY-MM format or empty string
- reply: 1-2 sentences max. Be specific about what you're changing.
Return ONLY valid JSON. No markdown fences.`;
      const apiMsgs = newMsgs.filter((m, i) => !(i === 0 && m.role === "assistant"));
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: systemPrompt,
          messages: apiMsgs
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || "API error");
      const raw = data.content?.[0]?.text || "{}";
      const clean = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
      const parsed = JSON.parse(clean);
      setMessages(prev => [...prev, { role: "assistant", content: parsed.reply || "Got it!" }]);
      if ((parsed.action === "add" || parsed.action === "both") && parsed.items?.length) {
        setExtracted(prev => [...prev, ...parsed.items.map(i => ({
          ...i,
          id: "p" + Date.now() + Math.random(),
          qty: parseFloat(i.qty) || 1
        }))]);
      }
      if ((parsed.action === "edit" || parsed.action === "both") && parsed.edits?.length) {
        setPendingEdits(prev => {
          // Merge: if same match already queued, merge the changes
          const merged = [...prev];
          parsed.edits.forEach(e => {
            const existing = merged.find(x => x.match.toLowerCase() === e.match.toLowerCase());
            if (existing) { existing.changes = { ...existing.changes, ...e.changes }; }
            else { merged.push(e); }
          });
          return merged;
        });
      }
    } catch (e) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Error: " + (e.message || "couldn't reach Claude. Check your API key in ⚙ Settings.")
      }]);
    }
    setLoading(false);
  };
  const confirm = () => {
    if (extracted.length > 0) onItemsExtracted(extracted);
    if (pendingEdits.length > 0 && onItemsEdited) onItemsEdited(pendingEdits);
    setConfirmed(true);
  };
  const hasPending = extracted.length > 0 || pendingEdits.length > 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "0 0 10px"
    }
  }, messages.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      justifyContent: m.role === "user" ? "flex-end" : "flex-start",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "82%",
      padding: "10px 13px",
      borderRadius: m.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
      background: m.role === "user" ? "rgba(96,165,250,.18)" : "var(--card-bg-2)",
      border: `1px solid ${m.role === "user" ? "rgba(96,165,250,.3)" : "var(--card-bg-4)"}`
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-primary)",
      fontSize: 13,
      margin: 0,
      lineHeight: 1.55
    }
  }, m.content)))), loading && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      padding: "8px 13px",
      background: "var(--card-bg-3)",
      borderRadius: 12,
      width: "fit-content",
      marginBottom: 10
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: "#f4a823",
      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
    }
  })), /*#__PURE__*/React.createElement("style", null, `@keyframes pulse{0%,100%{opacity:.2}50%{opacity:1}}`)), /*#__PURE__*/React.createElement("div", {
    ref: chatEndRef
  })), hasPending && !confirmed && /*#__PURE__*/React.createElement("div", {
    style: { padding: "10px 0", borderTop: "1px solid rgba(255,255,255,.07)", marginTop: 8 }
  },
    /*#__PURE__*/React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }
    },
      /*#__PURE__*/React.createElement("p", { style: { color: "#4ade80", fontSize: 11, fontWeight: 700, margin: 0 } },
        extracted.length > 0 ? extracted.length + " to add" : "",
        extracted.length > 0 && pendingEdits.length > 0 ? " \xB7 " : "",
        pendingEdits.length > 0 ? pendingEdits.length + " to update" : ""
      ),
      /*#__PURE__*/React.createElement("button", {
        onClick: confirm,
        style: { padding: "6px 14px", background: "#4ade80", color: "#080b11", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
      }, "APPLY ALL \u2192")
    ),
    /*#__PURE__*/React.createElement("div", {
      style: { maxHeight: 150, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }
    },
      extracted.map((item, i) => /*#__PURE__*/React.createElement("div", {
        key: "add-" + i,
        style: { display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "rgba(74,222,128,.06)", border: "1px solid rgba(74,222,128,.15)", borderRadius: 7 }
      },
        /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-primary)", fontSize: 12 } }, "\u2795 ", item.name),
        /*#__PURE__*/React.createElement("span", { style: { color: "#4ade80", fontSize: 11, fontWeight: 700 } }, item.qty, " ", item.unit, item.expiry ? " \xB7 " + item.expiry : "")
      )),
      pendingEdits.map((edit, i) => {
        const c = edit.changes || {};
        const parts = [];
        if (c.qty !== undefined) parts.push("qty \u2192 " + c.qty);
        if (c.qtyDelta !== undefined) parts.push((c.qtyDelta > 0 ? "+" : "") + c.qtyDelta);
        if (c.unit) parts.push("unit \u2192 " + c.unit);
        if (c.expiry !== undefined) parts.push("exp \u2192 " + (c.expiry || "cleared"));
        if (c.brand !== undefined) parts.push("brand \u2192 " + (c.brand || "cleared"));
        if (c.name) parts.push("rename \u2192 " + c.name);
        return /*#__PURE__*/React.createElement("div", {
          key: "edit-" + i,
          style: { display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "rgba(96,165,250,.06)", border: "1px solid rgba(96,165,250,.15)", borderRadius: 7, gap: 8 }
        },
          /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-primary)", fontSize: 12 } }, "\u270F ", edit.match),
          /*#__PURE__*/React.createElement("span", { style: { color: "#60a5fa", fontSize: 11, fontWeight: 700 } }, parts.join(" \xB7 ") || "update")
        );
      })
    )
  ), confirmed && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px",
      background: "rgba(74,222,128,.08)",
      border: "1px solid rgba(74,222,128,.2)",
      borderRadius: 9,
      marginTop: 8,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontSize: 13,
      fontWeight: 700,
      margin: "0 0 6px"
    }
  }, "\u2713 Added to pantry!"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      padding: "7px 16px",
      background: "rgba(74,222,128,.15)",
      border: "1px solid rgba(74,222,128,.3)",
      color: "#4ade80",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Done")), !confirmed && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      paddingTop: 10,
      borderTop: "1px solid rgba(255,255,255,.07)",
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: e => e.key === "Enter" && send(input),
    placeholder: "Type what you have...",
    style: {
      ...inp,
      fontSize: 13,
      paddingRight: 42
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: listening ? () => {
      voiceRef.current?.stop();
      setListening(false);
    } : startVoice,
    style: {
      position: "absolute",
      right: 6,
      top: "50%",
      transform: "translateY(-50%)",
      width: 30,
      height: 30,
      background: listening ? "rgba(239,68,68,.2)" : "rgba(167,139,250,.15)",
      border: `1px solid ${listening ? "rgba(239,68,68,.4)" : "rgba(167,139,250,.3)"}`,
      borderRadius: 7,
      cursor: "pointer",
      fontSize: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, listening ? "🔴" : "🎙")), /*#__PURE__*/React.createElement("button", {
    onClick: () => send(input),
    disabled: !input.trim() || loading,
    style: {
      padding: "10px 14px",
      background: input.trim() && !loading ? "rgba(96,165,250,.15)" : "var(--card-bg-3)",
      border: `1px solid ${input.trim() && !loading ? "rgba(96,165,250,.3)" : "var(--card-border)"}`,
      color: input.trim() && !loading ? "#60a5fa" : "var(--text-muted)",
      borderRadius: 9,
      fontSize: 13,
      fontWeight: 700,
      cursor: input.trim() && !loading ? "pointer" : "default"
    }
  }, "Send")));
}
function PantryBarcodeScanner({
  onItemFound,
  onClose
}) {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("idle");
  const [foundItem, setFoundItem] = useState(null);
  const [form, setForm] = useState({ qty: 1, unit: "unit", expiry: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const scannerRef = useRef(null);
  const SCANNER_DIV_ID = "pantry-qr-scanner-div";

  const startCamera = async () => {
    if (!window.Html5Qrcode) {
      setErrorMsg("Scanner library not loaded. Please refresh the page.");
      setStatus("error");
      return;
    }
    try {
      setScanning(true);
      setStatus("scanning");
      const scanner = new window.Html5Qrcode(SCANNER_DIV_ID);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 5, qrbox: { width: 240, height: 100 } },
        (decodedText) => {
          stopCamera();
          lookupBarcode(decodedText);
        },
        () => {}
      );
    } catch (e) {
      setScanning(false);
      setStatus("error");
      setErrorMsg(e?.message?.includes("Permission") || e?.message?.includes("permission")
        ? "Camera permission denied. Please allow camera access in your browser settings."
        : "Could not start camera. Try refreshing the page.");
    }
  };

  const stopCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {}).finally(() => {
        scannerRef.current = null;
      });
    }
    setScanning(false);
  };
  const lookupBarcode = async barcode => {
    setStatus("looking_up");
    try {
      // Try Open Food Facts API
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        const p = data.product;
        const name = p.product_name || p.generic_name || "Unknown product";
        const brand = p.brands || "";
        const qty = parseFloat(p.quantity) || 1;
        const unit = p.quantity?.replace(/[d.]/g, "").trim().toLowerCase() || "unit";
        const validUnit = PANTRY_UNITS.includes(unit) ? unit : "unit";
        setFoundItem({
          name,
          brand,
          qty,
          unit: validUnit,
          barcode
        });
        setForm({
          qty,
          unit: validUnit,
          expiry: ""
        });
        setStatus("found");
      } else {
        // Item not in database - ask Claude
        lookupWithClaude(barcode);
      }
    } catch (e) {
      lookupWithClaude(barcode);
    }
  };
  const lookupWithClaude = async barcode => {
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          messages: [{
            role: "user",
            content: `Barcode ${barcode}. What product is this likely to be? Return JSON only: {"name":"product name","brand":"brand","qty":1,"unit":"unit"}. Guess based on barcode structure if needed.`
          }]
        })
      });
      const d = await res.json();
      const raw = d.content?.[0]?.text || "{}";
      const clean = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
      const item = JSON.parse(clean);
      setFoundItem({
        ...item,
        barcode,
        qty: parseFloat(item.qty) || 1,
        unit: PANTRY_UNITS.includes(item.unit) ? item.unit : "unit"
      });
      setForm({
        qty: item.qty || 1,
        unit: PANTRY_UNITS.includes(item.unit) ? item.unit : "unit",
        expiry: ""
      });
      setStatus("found");
    } catch {
      setFoundItem({
        name: "Unknown Product",
        barcode,
        qty: 1,
        unit: "unit",
        brand: ""
      });
      setForm({
        qty: 1,
        unit: "unit",
        expiry: ""
      });
      setStatus("found");
    }
  };
  useEffect(() => () => { stopCamera(); }, []);
  if (status === "error") return /*#__PURE__*/React.createElement("div", {
    style: { textAlign: "center", padding: "24px 16px" }
  }, /*#__PURE__*/React.createElement("p", {
    style: { color: "#ef4444", fontSize: 14, fontWeight: 700, margin: "0 0 8px" }
  }, "Camera error"), /*#__PURE__*/React.createElement("p", {
    style: { color: "var(--text-secondary)", fontSize: 12, margin: "0 0 14px", lineHeight: 1.6 }
  }, errorMsg || "Could not open camera. Try the voice/text method instead."), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: { padding: "10px 20px", background: "var(--card-bg-2)", border: "1px solid rgba(255,255,255,.1)", color: "var(--text-secondary)", borderRadius: 9, fontSize: 13, cursor: "pointer" }
  }, "Go Back"));
  if (status === "found" && foundItem) return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(74,222,128,.06)",
      border: "1px solid rgba(74,222,128,.15)",
      borderRadius: 10,
      padding: "12px 14px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontSize: 11,
      fontWeight: 700,
      margin: "0 0 3px"
    }
  }, "\u2713 Product identified"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-primary)",
      fontSize: 14,
      fontWeight: 700,
      margin: "0 0 2px"
    }
  }, foundItem.name), foundItem.brand && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11,
      margin: "0 0 2px"
    }
  }, foundItem.brand), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 10,
      margin: 0
    }
  }, "Barcode: ", foundItem.barcode)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "Quantity"
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: form.qty,
    onChange: e => setForm(p => ({
      ...p,
      qty: parseFloat(e.target.value) || 1
    })),
    style: {
      ...inp,
      fontSize: 13
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 110
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "Unit"
  }), /*#__PURE__*/React.createElement("select", {
    value: form.unit,
    onChange: e => setForm(p => ({
      ...p,
      unit: e.target.value
    })),
    style: {
      ...inp,
      fontSize: 13,
      padding: "10px 8px"
    }
  }, PANTRY_UNITS.map(u => /*#__PURE__*/React.createElement("option", {
    key: u,
    value: u
  }, u))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    c: "Expiry Date (optional)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: form.expiry,
    onChange: e => setForm(p => ({
      ...p,
      expiry: e.target.value
    })),
    style: {
      ...inp,
      fontSize: 13,
      colorScheme: "dark"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onItemFound({
      id: "p" + Date.now(),
      name: foundItem.name,
      brand: foundItem.brand || "",
      barcode: foundItem.barcode,
      qty: parseFloat(form.qty) || 1,
      unit: form.unit,
      expiry: form.expiry
    }),
    style: {
      flex: 1,
      padding: "12px 0",
      background: "#f4a823",
      color: "#080b11",
      border: "none",
      borderRadius: 9,
      fontSize: 14,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "ADD TO PANTRY \u2192"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
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
  }, "Cancel")));
  if (status === "looking_up") return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "32px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      justifyContent: "center",
      marginBottom: 12
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "#f4a823",
      animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite`
    }
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontSize: 13,
      fontWeight: 700,
      margin: 0
    }
  }, "Looking up product..."));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 12,
      margin: "0 0 12px",
      lineHeight: 1.6
    }
  }, "Point your camera at any food barcode. The scanner will detect it automatically."),
  /*#__PURE__*/React.createElement("div", {
    id: SCANNER_DIV_ID,
    style: {
      width: "100%",
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 12,
      minHeight: scanning ? 260 : 0
    }
  }),
  !scanning ? /*#__PURE__*/React.createElement("button", {
    onClick: startCamera,
    style: {
      width: "100%",
      padding: "20px 0",
      background: "rgba(244,168,35,.1)",
      border: "2px dashed rgba(244,168,35,.3)",
      borderRadius: 12,
      color: "#f4a823",
      fontSize: 14,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: { display: "block", fontSize: 28, marginBottom: 6 }
  }, "\uD83D\uDCF7"), "Tap to Start Scanner") : null, scanning && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      stopCamera();
      setStatus("idle");
    },
    style: {
      width: "100%",
      padding: "11px 0",
      background: "rgba(239,68,68,.1)",
      border: "1px solid rgba(239,68,68,.2)",
      color: "#ef4444",
      borderRadius: 9,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Stop Scanner"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 10,
      margin: "10px 0 0",
      textAlign: "center"
    }
  }, "Requires camera permission \xB7 Works best in Chrome on Android"));
}
function PantryReceiptScanner({ pantryItems, onApply, onClose }) {
  const [phase, setPhase] = useState("capture"); // capture | processing | review | clarify | done
  const [procError, setProcError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [matched, setMatched] = useState([]);
  const [unknowns, setUnknowns] = useState([]);
  const [selectedMatched, setSelectedMatched] = useState({});
  const [clarifyIdx, setClarifyIdx] = useState(0);
  const [clarifyMsgs, setClarifyMsgs] = useState([]);
  const [clarifyInput, setClarifyInput] = useState("");
  const [clarifyLoading, setClarifyLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [resolved, setResolved] = useState([]);
  const fileRef = useRef(null);
  const voiceRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [clarifyMsgs]);

  const findBestMatch = (name) => {
    const n = name.toLowerCase().trim();
    const pool = pantryItems.filter(p => p.essential !== false);
    const exact = pool.find(p => p.name.toLowerCase() === n);
    if (exact) return exact;
    const contains = pool.find(p => p.name.toLowerCase().includes(n) || n.includes(p.name.toLowerCase()));
    if (contains) return contains;
    const words = n.split(/\s+/).filter(w => w.length > 2);
    let best = null, bestScore = 0;
    pool.forEach(p => {
      const pw = p.name.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const overlap = words.filter(w => pw.some(pw => pw.includes(w) || w.includes(pw))).length;
      const score = overlap / Math.max(words.length, pw.length, 1);
      if (score >= 0.5 && score > bestScore) { bestScore = score; best = p; }
    });
    return best;
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setImagePreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      const mediaType = file.type && file.type.startsWith("image/") ? file.type : "image/jpeg";
      setProcError("");
      setPhase("processing");
      try {
        const res = await fetch("/api/claude", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2000,
            messages: [{
              role: "user",
              content: [
                { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
                { type: "text", text: `Extract all food and grocery items from this receipt. Return ONLY valid JSON, no markdown:\n{\n  "items": [\n    {"rawText":"line as it appears on receipt","name":"clean readable name","qty":1,"unit":"piece"}\n  ]\n}\nRules:\n- name: clean human-readable name, not all-caps store abbreviations\n- qty: numeric quantity purchased (default 1)\n- unit: one of: g,kg,ml,l,oz,lb,piece,can,bag,box,bottle,bunch,loaf,dozen,unit\n- Only food/grocery items — skip taxes, fees, totals, store name\n- rawText: exact text from the receipt line` }
              ]
            }]
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        const raw = data.content?.[0]?.text || "{}";
        const clean = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
        const parsed = JSON.parse(clean);
        const items = (parsed.items || []).map(i => ({ ...i, qty: parseFloat(i.qty) || 1 }));
        const matchedArr = [], unknownsArr = [];
        items.forEach(item => {
          const pm = findBestMatch(item.name);
          if (pm) matchedArr.push({ extracted: item, pantryItem: pm });
          else unknownsArr.push(item);
        });
        setMatched(matchedArr);
        setUnknowns(unknownsArr);
        const sel = {};
        matchedArr.forEach((_, i) => { sel[i] = true; });
        setSelectedMatched(sel);
        setPhase("review");
      } catch (e) {
        setProcError("Could not read receipt: " + (e.message || "check your API key in Settings."));
        setPhase("capture");
      }
    };
    reader.readAsDataURL(file);
  };

  const startClarify = () => {
    const first = unknowns[0];
    setClarifyMsgs([{
      role: "assistant",
      content: "I found \"" + first.rawText + "\" on your receipt but couldn\u2019t match it to your pantry. What is this item? You can say things like \u201CThat\u2019s almond flour, 500g\u201D, \u201CIt\u2019s a bag of mixed nuts\u201D, or \u201CSkip this one\u201D."
    }]);
    setClarifyIdx(0);
    setResolved([]);
    setPhase("clarify");
  };

  const sendClarify = async (text) => {
    if (!text.trim() || clarifyLoading) return;
    const userMsg = { role: "user", content: text };
    const newMsgs = [...clarifyMsgs, userMsg];
    setClarifyMsgs(newMsgs);
    setClarifyInput("");
    setClarifyLoading(true);
    const current = unknowns[clarifyIdx];
    const pantryNames = pantryItems.filter(p => p.essential !== false).map(p => p.name).join(", ");
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          system: "You are helping a user identify a grocery item from a receipt. The receipt shows: \"" + current.rawText + "\". The user's pantry contains: " + pantryNames + ".\n\nRespond with ONLY valid JSON:\n{\"action\":\"resolved\"|\"skip\"|\"clarify\",\"pantryMatch\":\"exact name from pantry or null\",\"newItem\":{\"name\":\"\",\"qty\":1,\"unit\":\"piece\",\"cat\":\"Other\"}|null,\"qty\":1,\"reply\":\"short reply\"}\n\nRules:\n- resolved: user identified the item. Set pantryMatch if it exists in pantry, else newItem.\n- skip: user wants to skip.\n- clarify: response is ambiguous — ask one specific follow-up question.\n- qty: quantity purchased (from receipt or user message, default 1).\n- reply: 1-2 sentences. If resolved, confirm the match. If clarifying, ask one specific question.",
          messages: newMsgs.filter((m, i) => !(i === 0 && m.role === "assistant"))
        })
      });
      const d = await res.json();
      const raw = d.content?.[0]?.text || "{}";
      const clean = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
      const result = JSON.parse(clean);
      setClarifyMsgs(prev => [...prev, { role: "assistant", content: result.reply || "Got it!" }]);
      if (result.action === "resolved" || result.action === "skip") {
        const resolution = {
          extracted: current,
          action: result.action,
          pantryMatch: result.pantryMatch ? pantryItems.find(p => p.name.toLowerCase() === result.pantryMatch.toLowerCase()) || null : null,
          newItem: result.newItem || null,
          qty: parseFloat(result.qty) || current.qty
        };
        const newResolved = [...resolved, resolution];
        setResolved(newResolved);
        const nextIdx = clarifyIdx + 1;
        if (nextIdx < unknowns.length) {
          const next = unknowns[nextIdx];
          setTimeout(() => {
            setClarifyMsgs(prev => [...prev, {
              role: "assistant",
              content: "Next: I found \"" + next.rawText + "\" on your receipt. What is this item?"
            }]);
            setClarifyIdx(nextIdx);
          }, 500);
        } else {
          setTimeout(() => {
            setClarifyMsgs(prev => [...prev, {
              role: "assistant",
              content: "All done! Tap \u201CApply to Pantry\u201D to save everything."
            }]);
            setPhase("done");
          }, 500);
        }
      }
    } catch (e) {
      setClarifyMsgs(prev => [...prev, { role: "assistant", content: "Error — try again." }]);
    }
    setClarifyLoading(false);
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice not supported — try Chrome."); return; }
    const r = new SR();
    r.lang = "en-CA"; r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onresult = e => { setClarifyInput(prev => (prev ? prev + " " : "") + e.results[0][0].transcript); };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start();
    voiceRef.current = r;
  };

  const applyAll = () => {
    const edits = matched
      .filter((_, i) => selectedMatched[i])
      .map(m => ({ match: m.pantryItem.name, changes: { qtyDelta: m.extracted.qty } }));
    const resolvedEdits = resolved
      .filter(r => r.action === "resolved" && r.pantryMatch)
      .map(r => ({ match: r.pantryMatch.name, changes: { qtyDelta: r.qty } }));
    const newItems = resolved
      .filter(r => r.action === "resolved" && r.newItem)
      .map(r => ({ ...r.newItem, qty: r.qty, id: "p" + Date.now() + Math.random(), essential: true }));
    onApply({ edits: [...edits, ...resolvedEdits], newItems });
    onClose();
  };

  const skipAllUnknowns = () => {
    setResolved([]);
    setPhase("done");
  };

  const card = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 10, padding: "12px 14px", marginBottom: 8 };

  // ── Capture ──
  if (phase === "capture") return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("input", { ref: fileRef, type: "file", accept: "image/*", capture: "environment", onChange: handleFile, style: { display: "none" } }),
    /*#__PURE__*/React.createElement("div", {
      style: { background: "rgba(167,139,250,.06)", border: "2px dashed rgba(167,139,250,.25)", borderRadius: 14, padding: "32px 20px", textAlign: "center", marginBottom: 14 }
    },
      /*#__PURE__*/React.createElement("div", { style: { fontSize: 40, marginBottom: 10 } }, "\uD83E\uDDFE"),
      /*#__PURE__*/React.createElement("p", { style: { color: "#a78bfa", fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, margin: "0 0 6px" } }, "Scan a Receipt"),
      /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 12, margin: "0 0 20px", lineHeight: 1.6 } }, "Take a photo of your grocery receipt. Claude will read it and match items to your pantry automatically."),
      /*#__PURE__*/React.createElement("button", {
        onClick: () => fileRef.current?.click(),
        style: { width: "100%", padding: "14px", background: "rgba(167,139,250,.12)", border: "1px solid rgba(167,139,250,.3)", borderRadius: 10, color: "#a78bfa", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif", marginBottom: 8 }
      }, "\uD83D\uDCF8 Take Photo / Upload Receipt")
    ),
    procError && /*#__PURE__*/React.createElement("p", { style: { color: "#ef4444", fontSize: 11, textAlign: "center", margin: "0 0 12px" } }, procError),
    /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, textAlign: "center" } }, "Uses your Claude API key \xB7 Works on any grocery receipt")
  );

  // ── Processing ──
  if (phase === "processing") return /*#__PURE__*/React.createElement("div", { style: { textAlign: "center", padding: "40px 16px" } },
    imagePreview && /*#__PURE__*/React.createElement("img", { src: imagePreview, style: { width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 10, marginBottom: 16, opacity: 0.6 } }),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6, justifyContent: "center", marginBottom: 12 } },
      [0,1,2].map(i => /*#__PURE__*/React.createElement("div", { key: i, style: { width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", animation: "pulse 1.2s " + (i*0.2) + "s ease-in-out infinite" } }))
    ),
    /*#__PURE__*/React.createElement("p", { style: { color: "#a78bfa", fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, margin: "0 0 4px" } }, "Reading your receipt\u2026"),
    /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 11 } }, "Claude is extracting items and matching them to your pantry")
  );

  // ── Review ──
  if (phase === "review") return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("p", { style: { color: "#a78bfa", fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, margin: "0 0 14px" } }, "Receipt Review"),
    matched.length > 0 && /*#__PURE__*/React.createElement("div", { style: { marginBottom: 14 } },
      /*#__PURE__*/React.createElement("p", { style: { color: "#4ade80", fontSize: 11, fontWeight: 700, margin: "0 0 8px" } }, "\u2713 " + matched.length + " matched to your pantry"),
      matched.map((m, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        onClick: () => setSelectedMatched(prev => ({ ...prev, [i]: !prev[i] })),
        style: { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: selectedMatched[i] ? "rgba(74,222,128,.06)" : "var(--card-bg)", border: "1px solid " + (selectedMatched[i] ? "rgba(74,222,128,.2)" : "var(--card-border)"), borderRadius: 9, marginBottom: 5, cursor: "pointer" }
      },
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 16 } }, selectedMatched[i] ? "\u2705" : "\u25a1"),
        /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
          /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-primary)", fontSize: 12, fontWeight: 600, margin: "0 0 1px" } }, m.pantryItem.name),
          /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: 0 } }, "from: " + m.extracted.rawText)
        ),
        /*#__PURE__*/React.createElement("span", { style: { color: "#4ade80", fontSize: 11, fontWeight: 700, flexShrink: 0 } }, "+" + m.extracted.qty + " " + (m.extracted.unit || ""))
      ))
    ),
    unknowns.length > 0 && /*#__PURE__*/React.createElement("div", { style: { marginBottom: 14 } },
      /*#__PURE__*/React.createElement("p", { style: { color: "#f4a823", fontSize: 11, fontWeight: 700, margin: "0 0 8px" } }, "\u2753 " + unknowns.length + " item" + (unknowns.length !== 1 ? "s" : "") + " need clarification"),
      unknowns.map((u, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: { padding: "8px 12px", background: "rgba(244,168,35,.05)", border: "1px solid rgba(244,168,35,.18)", borderRadius: 9, marginBottom: 5 }
      },
        /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-primary)", fontSize: 12, margin: 0 } }, u.rawText),
        /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: "2px 0 0" } }, "best guess: " + u.name)
      ))
    ),
    matched.length === 0 && unknowns.length === 0 && /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 12, textAlign: "center", padding: 20 } }, "No grocery items found on the receipt. Try a clearer photo."),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 8 } },
      unknowns.length > 0 && /*#__PURE__*/React.createElement("button", {
        onClick: startClarify,
        style: { width: "100%", padding: "13px", background: "#f4a823", border: "none", borderRadius: 10, color: "#080b11", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
      }, "Clarify " + unknowns.length + " Unknown Item" + (unknowns.length !== 1 ? "s" : "") + " \u2192"),
      /*#__PURE__*/React.createElement("button", {
        onClick: unknowns.length > 0 ? skipAllUnknowns : applyAll,
        style: { width: "100%", padding: "13px", background: "var(--card-bg-2)", border: "1px solid var(--card-border)", borderRadius: 10, color: "var(--text-secondary)", fontSize: 12, fontWeight: 700, cursor: "pointer" }
      }, unknowns.length > 0 ? "Skip unknowns \u2014 apply matched only" : "Apply to Pantry \u2192")
    )
  );

  // ── Clarify ──
  if (phase === "clarify" || phase === "done") return /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "58vh" } },
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
      /*#__PURE__*/React.createElement("p", { style: { color: "#f4a823", fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 800, margin: 0 } },
        phase === "done" ? "All clarified \u2713" : ("Item " + (clarifyIdx + 1) + " of " + unknowns.length)
      ),
      phase === "done" && /*#__PURE__*/React.createElement("button", {
        onClick: applyAll,
        style: { padding: "8px 18px", background: "#4ade80", border: "none", borderRadius: 8, color: "#080b11", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
      }, "Apply to Pantry \u2192")
    ),
    /*#__PURE__*/React.createElement("div", { style: { flex: 1, overflowY: "auto", paddingBottom: 8 } },
      clarifyMsgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: { display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }
      },
        /*#__PURE__*/React.createElement("div", {
          style: { maxWidth: "82%", padding: "10px 13px", borderRadius: m.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px", background: m.role === "user" ? "rgba(167,139,250,.18)" : "var(--card-bg-2)", border: "1px solid " + (m.role === "user" ? "rgba(167,139,250,.3)" : "var(--card-border)") }
        },
          /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-primary)", fontSize: 13, margin: 0, lineHeight: 1.55, whiteSpace: "pre-wrap" } }, m.content)
        )
      )),
      clarifyLoading && /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 5, padding: "8px 13px", background: "var(--card-bg-3)", borderRadius: 12, width: "fit-content" } },
        [0,1,2].map(i => /*#__PURE__*/React.createElement("div", { key: i, style: { width: 7, height: 7, borderRadius: "50%", background: "#f4a823", animation: "pulse 1.2s " + (i*0.2) + "s ease-in-out infinite" } }))
      ),
      /*#__PURE__*/React.createElement("div", { ref: chatEndRef })
    ),
    phase !== "done" && /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 7, paddingTop: 10, borderTop: "1px solid var(--card-border)" } },
      /*#__PURE__*/React.createElement("div", { style: { flex: 1, position: "relative" } },
        /*#__PURE__*/React.createElement("input", {
          value: clarifyInput,
          onChange: e => setClarifyInput(e.target.value),
          onKeyDown: e => e.key === "Enter" && sendClarify(clarifyInput),
          placeholder: "What is this item\u2026",
          style: { width: "100%", background: "var(--card-bg-2)", border: "1px solid var(--card-border-2)", borderRadius: 9, color: "var(--text-primary)", fontSize: 13, padding: "10px 42px 10px 12px", outline: "none", boxSizing: "border-box" }
        }),
        /*#__PURE__*/React.createElement("button", {
          onClick: listening ? () => { voiceRef.current?.stop(); setListening(false); } : startVoice,
          style: { position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, background: listening ? "rgba(239,68,68,.2)" : "rgba(167,139,250,.15)", border: "1px solid " + (listening ? "rgba(239,68,68,.4)" : "rgba(167,139,250,.3)"), borderRadius: 7, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }
        }, listening ? "\uD83D\uDD34" : "\uD83C\uDF99")
      ),
      /*#__PURE__*/React.createElement("button", {
        onClick: () => sendClarify(clarifyInput),
        disabled: !clarifyInput.trim() || clarifyLoading,
        style: { padding: "10px 14px", background: clarifyInput.trim() && !clarifyLoading ? "rgba(167,139,250,.15)" : "var(--card-bg-3)", border: "1px solid " + (clarifyInput.trim() && !clarifyLoading ? "rgba(167,139,250,.3)" : "var(--card-border)"), color: clarifyInput.trim() && !clarifyLoading ? "#a78bfa" : "var(--text-muted)", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: clarifyInput.trim() && !clarifyLoading ? "pointer" : "default" }
      }, "Send")
    )
  );

  return null;
}

function PantryTab({
  pantryItems,
  setPantryItems,
  onAddToGrocery
}) {
  const [mode, setMode] = useState("list"); // list | chat | barcode | receipt

  const addItems = async newItems => {
    const merged = [...pantryItems];
    newItems.forEach(ni => {
      // Merge with existing if same name (case-insensitive) — also restores archived items
      const existing = merged.find(p => p.name.toLowerCase() === ni.name.toLowerCase());
      if (existing) {
        existing.qty = parseFloat(existing.qty || 0) + parseFloat(ni.qty || 1);
        if (ni.expiry) existing.expiry = ni.expiry;
        if (existing.essential === false) existing.essential = true; // restore from archive
      } else {
        merged.push({
          ...ni,
          id: ni.id || "p" + Date.now() + Math.random(),
          cat: ni.cat || "Other",
          minQty: 0,
          reorderQty: 1,
          essential: true
        });
      }
    });
    setPantryItems(merged);
    await DB.set(KEYS.pantry(), merged);
    setMode("list");
  };
  const addOneItem = async item => { await addItems([item]); };

  const applyReceipt = async ({ edits, newItems }) => {
    if (newItems?.length > 0) await addItems(newItems);
    if (edits?.length > 0) await editItems(edits);
  };

  const editItems = async edits => {
    const merged = [...pantryItems];
    edits.forEach(edit => {
      const existing = merged.find(p => p.name.toLowerCase() === (edit.match || "").toLowerCase());
      if (!existing) return;
      const c = edit.changes || {};
      if (c.qty !== undefined) existing.qty = Math.max(0, parseFloat(c.qty));
      if (c.qtyDelta !== undefined) existing.qty = Math.max(0, parseFloat(existing.qty || 0) + parseFloat(c.qtyDelta));
      if (c.unit) existing.unit = c.unit;
      if (c.expiry !== undefined) existing.expiry = c.expiry;
      if (c.brand !== undefined) existing.brand = c.brand;
      if (c.name) existing.name = c.name;
      if (c.cat) existing.cat = c.cat;
      if (c.notes !== undefined) existing.notes = c.notes;
      if (c.minQty !== undefined) existing.minQty = Math.max(0, parseFloat(c.minQty));
    });
    setPantryItems(merged);
    await DB.set(KEYS.pantry(), merged);
    setMode("list");
  };
  if (mode === "chat") return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "58vh"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontFamily: "'Syne',sans-serif",
      fontSize: 14,
      fontWeight: 800,
      margin: 0
    }
  }, "\uD83C\uDF99 Add by Voice / Text"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMode("list"),
    style: {
      padding: "5px 12px",
      background: "transparent",
      border: "1px solid rgba(255,255,255,.1)",
      color: "var(--text-secondary)",
      borderRadius: 7,
      fontSize: 11,
      cursor: "pointer"
    }
  }, "\u2190 Back")), /*#__PURE__*/React.createElement(PantryAIChat, {
    onItemsExtracted: addItems,
    onItemsEdited: editItems,
    onClose: () => setMode("list"),
    pantryItems: pantryItems
  }));
  if (mode === "barcode") return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#60a5fa",
      fontFamily: "'Syne',sans-serif",
      fontSize: 14,
      fontWeight: 800,
      margin: 0
    }
  }, "\uD83D\uDCF7 Barcode Scanner"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMode("list"),
    style: {
      padding: "5px 12px",
      background: "transparent",
      border: "1px solid rgba(255,255,255,.1)",
      color: "var(--text-secondary)",
      borderRadius: 7,
      fontSize: 11,
      cursor: "pointer"
    }
  }, "\u2190 Back")), /*#__PURE__*/React.createElement(PantryBarcodeScanner, {
    onItemFound: item => addOneItem(item),
    onClose: () => setMode("list")
  }));

  if (mode === "receipt") return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 } },
      /*#__PURE__*/React.createElement("p", { style: { color: "#a78bfa", fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, margin: 0 } }, "\uD83E\uDDFE Receipt Scanner"),
      /*#__PURE__*/React.createElement("button", { onClick: () => setMode("list"), style: { padding: "5px 12px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-secondary)", borderRadius: 7, fontSize: 11, cursor: "pointer" } }, "\u2190 Back")
    ),
    /*#__PURE__*/React.createElement(PantryReceiptScanner, {
      pantryItems: pantryItems,
      onApply: applyReceipt,
      onClose: () => setMode("list")
    })
  );

  // List mode — show add buttons + PantryEditor
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setMode("chat"),
    style: {
      flex: 1,
      padding: "10px 0",
      background: "rgba(244,168,35,.1)",
      border: "1px solid rgba(244,168,35,.25)",
      color: "#f4a823",
      borderRadius: 9,
      fontSize: 11,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "\uD83C\uDF99 Voice/Text Add"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMode("barcode"),
    style: {
      flex: 1,
      padding: "10px 0",
      background: "rgba(96,165,250,.1)",
      border: "1px solid rgba(96,165,250,.25)",
      color: "#60a5fa",
      borderRadius: 9,
      fontSize: 11,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "\uD83D\uDCF7 Scan Barcode")), /*#__PURE__*/React.createElement(PantryEditor, {
    pantryItems: pantryItems,
    setPantryItems: setPantryItems,
    onAddToGrocery: onAddToGrocery
  }));
}

// ─── Pantry sub-components (used by PantryEditor) ───────────────────────────

function PantryItemRow({
  item,
  onEdit,
  onQuickAdjust,
  onToggleEssential
}) {
  const qty = parseFloat(item.qty) || 0;
  const minQty = parseFloat(item.minQty) || 0;
  const isLow = qty === 0 || minQty > 0 && qty <= minQty;
  const expiry = item.expiry ? new Date(item.expiry + "-01") : null;
  const daysToExp = expiry ? Math.round((expiry - new Date()) / 86400000) : null;
  const isExpiring = daysToExp !== null && daysToExp <= 7;
  const isExpired = daysToExp !== null && daysToExp < 0;
  const statusColor = qty === 0 ? "#ef4444" : isLow ? "#f4a823" : isExpired ? "#ef4444" : isExpiring ? "#facc15" : "#4ade80";
  const bg = qty === 0 || isLow ? "rgba(239,68,68,.05)" : isExpiring || isExpired ? "rgba(244,168,35,.05)" : "var(--card-bg)";
  const border = qty === 0 || isLow ? "rgba(239,68,68,.2)" : "var(--card-border)";
  const expLabel = daysToExp === null ? null : daysToExp < 0 ? `Expired ${Math.abs(daysToExp)}d ago` : daysToExp === 0 ? "Expires today" : daysToExp <= 7 ? `Expires in ${daysToExp}d` : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 9,
      marginBottom: 5,
      borderLeft: `3px solid ${statusColor}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center",
      flexWrap: "wrap",
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-primary)",
      fontSize: 13,
      fontWeight: 600
    }
  }, item.name), /*#__PURE__*/React.createElement("span", {
    style: {
      background: "var(--card-bg-2)",
      color: "var(--text-secondary)",
      fontSize: 9,
      fontWeight: 600,
      borderRadius: 4,
      padding: "1px 5px"
    }
  }, item.cat || "Other"), qty === 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      background: "rgba(239,68,68,.15)",
      color: "#ef4444",
      fontSize: 9,
      fontWeight: 700,
      borderRadius: 4,
      padding: "1px 6px"
    }
  }, "OUT"), qty > 0 && isLow && /*#__PURE__*/React.createElement("span", {
    style: {
      background: "rgba(244,168,35,.15)",
      color: "#f4a823",
      fontSize: 9,
      fontWeight: 700,
      borderRadius: 4,
      padding: "1px 6px"
    }
  }, "LOW"), expLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      background: "rgba(244,168,35,.12)",
      color: isExpired ? "#ef4444" : "#facc15",
      fontSize: 9,
      fontWeight: 700,
      borderRadius: 4,
      padding: "1px 6px"
    }
  }, expLabel)), (item.brand || item.location) && /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8 } },
    item.brand && /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-muted)", fontSize: 10 } }, item.brand),
    item.location && /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-muted)", fontSize: 10 } }, "\uD83D\uDCCD " + item.location)
  )), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onQuickAdjust(item, -1);
    },
    style: {
      width: 24,
      height: 24,
      borderRadius: 6,
      border: "1px solid rgba(255,255,255,.1)",
      background: "transparent",
      color: "var(--text-secondary)",
      cursor: "pointer",
      fontSize: 15,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, "\u2212"), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 48,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: statusColor,
      fontSize: 15,
      fontWeight: 800,
      fontFamily: "'Syne',sans-serif"
    }
  }, qty), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10,
      marginLeft: 3
    }
  }, item.unit)), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onQuickAdjust(item, 1);
    },
    style: {
      width: 24,
      height: 24,
      borderRadius: 6,
      border: "1px solid rgba(255,255,255,.1)",
      background: "transparent",
      color: "var(--text-secondary)",
      cursor: "pointer",
      fontSize: 15,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, "+"), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onEdit(item);
    },
    style: {
      width: 24,
      height: 24,
      borderRadius: 6,
      border: "1px solid rgba(255,255,255,.09)",
      background: "var(--card-bg-3)",
      color: "var(--text-secondary)",
      cursor: "pointer",
      fontSize: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, "\u270E"), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onToggleEssential && onToggleEssential(item);
    },
    title: "Essential / Must Have — uncheck to archive",
    style: {
      width: 24,
      height: 24,
      borderRadius: 6,
      border: "1px solid " + (item.essential === false ? "var(--card-border)" : "rgba(244,168,35,.35)"),
      background: item.essential === false ? "transparent" : "rgba(244,168,35,.1)",
      color: item.essential === false ? "var(--text-muted)" : "#f4a823",
      cursor: "pointer",
      fontSize: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      flexShrink: 0
    }
  }, item.essential === false ? "\u2606" : "\u2605")));
}
function PantryLowStockBanner({
  lowItems,
  onAddAllToGrocery
}) {
  const [expanded, setExpanded] = useState(false);
  if (!lowItems || lowItems.length === 0) return null;
  const outCount = lowItems.filter(i => parseFloat(i.qty || 0) === 0).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(239,68,68,.07)",
      border: "1px solid rgba(239,68,68,.22)",
      borderRadius: 11,
      padding: "11px 14px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#ef4444",
      fontSize: 12,
      fontWeight: 800,
      margin: "0 0 2px"
    }
  }, "\u26A0 ", lowItems.length, " item", lowItems.length !== 1 ? "s" : "", " need restocking"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10,
      margin: 0
    }
  }, outCount, " out \xB7 ", lowItems.length - outCount, " running low")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setExpanded(!expanded),
    style: {
      padding: "5px 10px",
      background: "var(--card-bg-3)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "var(--text-secondary)",
      borderRadius: 7,
      fontSize: 10,
      cursor: "pointer"
    }
  }, expanded ? "▲" : "▼"), /*#__PURE__*/React.createElement("button", {
    onClick: onAddAllToGrocery,
    style: {
      padding: "5px 11px",
      background: "rgba(239,68,68,.15)",
      border: "1px solid rgba(239,68,68,.3)",
      color: "#ef4444",
      borderRadius: 7,
      fontSize: 10,
      fontWeight: 700,
      cursor: "pointer",
      whiteSpace: "nowrap"
    }
  }, "+ Grocery List"))), expanded && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, lowItems.map(item => {
    const qty = parseFloat(item.qty || 0);
    return /*#__PURE__*/React.createElement("div", {
      key: item.id,
      style: {
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 10px",
        background: "var(--card-bg)",
        borderRadius: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-primary)",
        fontSize: 12
      }
    }, item.name), /*#__PURE__*/React.createElement("span", {
      style: {
        color: qty === 0 ? "#ef4444" : "#f4a823",
        fontSize: 11,
        fontWeight: 700
      }
    }, qty === 0 ? "OUT" : `${qty} ${item.unit}`));
  })));
}
function PantryExpiryBanner({
  expiringItems
}) {
  const [expanded, setExpanded] = useState(false);
  if (!expiringItems || expiringItems.length === 0) return null;
  const expired = expiringItems.filter(i => {
    const d = i.expiry ? new Date(i.expiry + "-01") : null;
    return d && Math.round((d - new Date()) / 86400000) < 0;
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(244,168,35,.06)",
      border: "1px solid rgba(244,168,35,.2)",
      borderRadius: 11,
      padding: "11px 14px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontSize: 12,
      fontWeight: 800,
      margin: "0 0 2px"
    }
  }, "\uD83D\uDDD3 Expiry Alert"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10,
      margin: 0
    }
  }, expired.length > 0 ? `${expired.length} expired · ` : "", expiringItems.length - expired.length, " expiring soon")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setExpanded(!expanded),
    style: {
      padding: "5px 10px",
      background: "var(--card-bg-3)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "var(--text-secondary)",
      borderRadius: 7,
      fontSize: 10,
      cursor: "pointer"
    }
  }, expanded ? "▲" : "▼")), expanded && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, expiringItems.map(item => {
    const d = item.expiry ? new Date(item.expiry + "-01") : null;
    const days = d ? Math.round((d - new Date()) / 86400000) : null;
    const c = days < 0 ? "#ef4444" : days === 0 ? "#f4a823" : "#facc15";
    const label = days < 0 ? `${Math.abs(days)}d ago` : days === 0 ? "Today" : `${days}d`;
    return /*#__PURE__*/React.createElement("div", {
      key: item.id,
      style: {
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 10px",
        background: "var(--card-bg)",
        borderRadius: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-primary)",
        fontSize: 12
      }
    }, item.name), /*#__PURE__*/React.createElement("span", {
      style: {
        color: c,
        fontSize: 11,
        fontWeight: 700
      }
    }, days < 0 ? "Expired " : "Expires ", label));
  })));
}
function PantryEditor({
  pantryItems,
  setPantryItems,
  onAddToGrocery
}) {
  const [editItem, setEditItem] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const save = async item => {
    if (item === null) {
      // Delete
      const updated = pantryItems.filter(p => p.id !== editItem.id);
      setPantryItems(updated);
      await DB.set(KEYS.pantry(), updated);
      setEditItem(null);
      return;
    }
    const exists = pantryItems.find(p => p.id === item.id);
    const updated = exists ? pantryItems.map(p => p.id === item.id ? item : p) : [...pantryItems, item];
    setPantryItems(updated);
    await DB.set(KEYS.pantry(), updated);
    setEditItem(null);
    setIsNew(false);
  };
  const quickAdjust = async (item, delta) => {
    const newQty = Math.max(0, parseFloat(item.qty || 0) + delta);
    const updated = pantryItems.map(p => p.id === item.id ? { ...p, qty: newQty } : p);
    setPantryItems(updated);
    await DB.set(KEYS.pantry(), updated);
  };
  const toggleEssential = async item => {
    const isNowArchived = item.essential !== false; // currently essential → archive it
    const updated = pantryItems.map(p => p.id === item.id ? { ...p, essential: !isNowArchived } : p);
    setPantryItems(updated);
    await DB.set(KEYS.pantry(), updated);
  };
  const [showArchived, setShowArchived] = useState(false);
  const handleAddAllToGrocery = () => {
    const lowItems = pantryItems.filter(p => {
      const {
        status
      } = pantryStatus(p);
      return status === "out" || status === "low";
    });
    onAddToGrocery && onAddToGrocery(lowItems);
  };

  // Categorised alert lists (essential items only)
  const lowItems = pantryItems.filter(p => {
    if (p.essential === false) return false;
    const { status } = pantryStatus(p);
    return status === "out" || status === "low";
  });
  const expiringItems = pantryItems.filter(p => {
    const {
      daysToExp
    } = pantryStatus(p);
    return daysToExp !== null && daysToExp <= 7;
  });
  const cats = ["All", ...PANTRY_CATEGORIES];
  const archivedItems = pantryItems.filter(p => p.essential === false);
  const filtered = pantryItems.filter(p => p.essential !== false).filter(p => catFilter === "All" || p.cat === catFilter).filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).filter(p => {
    if (statusFilter === "low") {
      const {
        status
      } = pantryStatus(p);
      return status === "out" || status === "low";
    }
    if (statusFilter === "expiring") {
      const {
        daysToExp
      } = pantryStatus(p);
      return daysToExp !== null && daysToExp <= 14;
    }
    return true;
  }).sort((a, b) => {
    // Sort: out first, then low, then expiring, then ok
    const order = {
      out: 0,
      low: 1,
      expiring: 2,
      expired: 2,
      ok: 3
    };
    const sa = pantryStatus(a).status,
      sb = pantryStatus(b).status;
    if (order[sa] !== order[sb]) return order[sa] - order[sb];
    return a.name.localeCompare(b.name);
  });

  // Summary stats
  const outCount = pantryItems.filter(p => pantryStatus(p).status === "out").length;
  const lowCount = pantryItems.filter(p => pantryStatus(p).status === "low").length;
  const expiringCount = pantryItems.filter(p => {
    const {
      daysToExp
    } = pantryStatus(p);
    return daysToExp !== null && daysToExp <= 7 && daysToExp >= 0;
  }).length;
  const expiredCount = pantryItems.filter(p => {
    const {
      daysToExp
    } = pantryStatus(p);
    return daysToExp !== null && daysToExp < 0;
  }).length;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 14,
      flexWrap: "wrap"
    }
  }, [{
    l: "Total",
    v: pantryItems.length,
    c: "var(--text-primary)"
  }, {
    l: "Out",
    v: outCount,
    c: "#ef4444"
  }, {
    l: "Low",
    v: lowCount,
    c: "#f4a823"
  }, {
    l: "Expiring",
    v: expiringCount + expiredCount,
    c: "#facc15"
  }].map(({
    l,
    v,
    c
  }) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      padding: "8px 12px",
      background: "var(--card-bg)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 8,
      flex: "1 1 60px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: c,
      fontFamily: "'Syne',sans-serif",
      fontSize: 18,
      fontWeight: 800,
      margin: 0
    }
  }, v), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".06em",
      margin: 0
    }
  }, l))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setIsNew(true);
      setEditItem({
        name: "",
        qty: 1,
        unit: "unit",
        cat: "Other",
        minQty: 0,
        reorderQty: 1,
        expiry: "",
        brand: "",
        notes: "",
        id: "p" + Date.now()
      });
    },
    style: {
      padding: "8px 14px",
      background: "rgba(251,146,60,.15)",
      border: "1px solid rgba(251,146,60,.3)",
      color: "#fb923c",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif",
      flexShrink: 0
    }
  }, "+ Add")), /*#__PURE__*/React.createElement(PantryLowStockBanner, {
    lowItems: lowItems,
    onAddAllToGrocery: handleAddAllToGrocery
  }), /*#__PURE__*/React.createElement(PantryExpiryBanner, {
    expiringItems: expiringItems
  }), /*#__PURE__*/React.createElement("input", {
    value: search,
    onChange: e => setSearch(e.target.value),
    placeholder: `Search ${pantryItems.length} items...`,
    style: {
      ...inp,
      marginBottom: 10,
      fontSize: 13
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 8,
      flexWrap: "wrap"
    }
  }, [["all", "All"], ["low", "Low/Out"], ["expiring", "Expiring"]].map(([id, l]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setStatusFilter(id),
    style: {
      padding: "4px 10px",
      borderRadius: 7,
      fontSize: 10,
      cursor: "pointer",
      border: `1px solid ${statusFilter === id ? "rgba(251,146,60,.4)" : "var(--card-bg-4)"}`,
      background: statusFilter === id ? "rgba(251,146,60,.12)" : "transparent",
      color: statusFilter === id ? "#fb923c" : "var(--text-secondary)",
      fontWeight: statusFilter === id ? 700 : 400
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 12,
      flexWrap: "wrap"
    }
  }, cats.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => setCatFilter(c),
    style: {
      padding: "3px 8px",
      borderRadius: 6,
      fontSize: 10,
      cursor: "pointer",
      border: `1px solid ${catFilter === c ? "rgba(251,146,60,.3)" : "var(--card-border)"}`,
      background: catFilter === c ? "rgba(251,146,60,.08)" : "transparent",
      color: catFilter === c ? "#fb923c" : "var(--text-muted)",
      fontWeight: catFilter === c ? 700 : 400
    }
  }, c))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10,
      margin: "0 0 8px"
    }
  }, filtered.length, " item", filtered.length !== 1 ? "s" : ""), filtered.length === 0 && pantryItems.length === 0 && /*#__PURE__*/React.createElement("div", {
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
      fontSize: 28,
      margin: "0 0 8px"
    }
  }, "\uD83E\uDD6B"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 13,
      margin: "0 0 4px"
    }
  }, "Pantry is empty"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 11,
      margin: "0 0 14px"
    }
  }, "Use the PANTRY tab above to add items by voice, barcode, or manually")), filtered.map(item => /*#__PURE__*/React.createElement(PantryItemRow, {
    key: item.id,
    item: item,
    onEdit: i => { setIsNew(false); setEditItem(i); },
    onQuickAdjust: quickAdjust,
    onToggleEssential: toggleEssential
  })),
  archivedItems.length > 0 && /*#__PURE__*/React.createElement("div", { style: { marginTop: 18 } },
    /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowArchived(v => !v),
      style: { width: "100%", padding: "10px 14px", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 9, color: "var(--text-muted)", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Syne',sans-serif" }
    },
      /*#__PURE__*/React.createElement("span", null, "\u2606 Archived (" + archivedItems.length + ")"),
      /*#__PURE__*/React.createElement("span", null, showArchived ? "\u25B4" : "\u25BE")
    ),
    showArchived && /*#__PURE__*/React.createElement("div", { style: { marginTop: 8 } },
      /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: "0 0 8px" } }, "These items are hidden from your main pantry. Tap \u2605 to restore."),
      archivedItems.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).map(item =>
        /*#__PURE__*/React.createElement("div", {
          key: item.id,
          style: { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 9, marginBottom: 5, opacity: 0.6 }
        },
          /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            /*#__PURE__*/React.createElement("span", { style: { color: "#6b7280", fontSize: 13, fontWeight: 600 } }, item.name),
            /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-muted)", fontSize: 10, marginLeft: 8 } }, item.cat || "Other")
          ),
          /*#__PURE__*/React.createElement("button", {
            onClick: () => toggleEssential(item),
            style: { padding: "4px 10px", background: "rgba(244,168,35,.1)", border: "1px solid rgba(244,168,35,.3)", borderRadius: 7, color: "#f4a823", fontSize: 11, fontWeight: 700, cursor: "pointer" }
          }, "\u2605 Restore")
        )
      )
    )
  ),
  editItem && /*#__PURE__*/React.createElement(PantryEditModal, {
    item: editItem,
    isNew: isNew,
    onSave: save,
    onClose: () => {
      setEditItem(null);
      setIsNew(false);
    }
  }));
}
const MEALS_DB = [
// ══════════════════════════════════════════════════════════════
// BREAKFASTS
// ══════════════════════════════════════════════════════════════
{
  id: "b01",
  name: "Overnight Oats with Berries",
  cat: "B",
  cal: 380,
  prot: 18,
  carbs: 58,
  fat: 9,
  prep: 5,
  cook: 0,
  cad: 2.20,
  tags: ["meal-prep", "high-fiber", "budget", "no-cook", "couples-easy"],
  ing: ["1 cup rolled oats", "2 tbsp chia seeds", "1 cup low-fat milk", "½ cup mixed berries (fresh or frozen)", "1 tbsp honey", "¼ cup plain Greek yogurt (0%)"],
  steps: ["Add oats and chia seeds to a jar or container with a lid.", "Pour in milk and stir well — make sure all oats are wet.", "Stir in honey. Top with Greek yogurt.", "Cover and refrigerate overnight (minimum 6 hours).", "In the morning, top with berries and eat cold. No heating needed.", "Tip: Make 2 jars at once — one for each of you. Keeps 3 days in the fridge."]
}, {
  id: "b02",
  name: "Veggie Scrambled Eggs",
  cat: "B",
  cal: 310,
  prot: 22,
  carbs: 12,
  fat: 18,
  prep: 5,
  cook: 8,
  cad: 2.50,
  tags: ["high-protein", "low-carb", "quick"],
  ing: ["4 large eggs", "½ cup diced bell pepper (any colour)", "½ cup baby spinach", "¼ cup diced white onion", "1 tsp olive oil", "Salt & black pepper to taste"],
  steps: ["Crack eggs into a bowl, add a pinch of salt and pepper, and whisk until combined.", "Heat olive oil in a non-stick pan over medium heat.", "Add onion and bell pepper. Cook 3–4 minutes until softened, stirring occasionally.", "Add spinach and stir for 30 seconds until just wilted.", "Pour eggs over the veggies. Let sit 10 seconds, then gently fold with a spatula every 15–20 seconds.", "Remove from heat when eggs are just set but still slightly glossy — they continue cooking off heat.", "Serve immediately. Optional: add hot sauce or a slice of whole grain toast."]
}, {
  id: "b03",
  name: "Greek Yogurt Parfait",
  cat: "B",
  cal: 340,
  prot: 24,
  carbs: 44,
  fat: 8,
  prep: 5,
  cook: 0,
  cad: 3.00,
  tags: ["quick", "high-protein", "no-cook", "couples-easy"],
  ing: ["1½ cups plain Greek yogurt (0%)", "¾ cup low-sugar granola", "½ cup fresh blueberries (or mixed berries)", "1 tbsp honey", "2 tbsp sliced almonds"],
  steps: ["Spoon half the yogurt into a glass or bowl.", "Add half the granola in an even layer.", "Add half the berries.", "Repeat layers: yogurt, granola, berries.", "Drizzle honey over top and scatter almonds.", "Eat immediately — or pack the yogurt and toppings separately if taking to go.", "Tip: Buy a large tub of 0% Greek yogurt from Costco for best value."]
}, {
  id: "b04",
  name: "Cottage Cheese Protein Pancakes",
  cat: "B",
  cal: 350,
  prot: 28,
  carbs: 32,
  fat: 10,
  prep: 5,
  cook: 12,
  cad: 2.80,
  tags: ["high-protein", "meal-prep", "filling"],
  ing: ["1 cup cottage cheese (2%)", "2 large eggs", "½ cup rolled oats", "1 tsp vanilla extract", "½ tsp cinnamon", "1 tsp coconut oil (for pan)", "½ cup mixed berries (topping)", "1 tbsp maple syrup (topping)"],
  steps: ["Blend cottage cheese, eggs, oats, vanilla, and cinnamon in a blender for 30 seconds until smooth.", "Let batter rest 2 minutes — it will thicken slightly.", "Heat coconut oil in a non-stick pan over medium-low heat.", "Pour small rounds of batter (~¼ cup each). Don't spread — they'll spread themselves.", "Cook 2–3 minutes until bubbles form on surface and edges look set. Flip gently.", "Cook 1–2 more minutes on second side until golden.", "Serve topped with berries and a small drizzle of maple syrup.", "Note: These are denser than regular pancakes — that's normal and intentional for the protein hit."]
}, {
  id: "b05",
  name: "Turkey & Veggie Omelette",
  cat: "B",
  cal: 290,
  prot: 26,
  carbs: 8,
  fat: 16,
  prep: 5,
  cook: 8,
  cad: 3.20,
  tags: ["high-protein", "low-carb", "quick"],
  ing: ["3 large eggs", "50g sliced turkey breast (deli style)", "¼ cup sliced mushrooms", "¼ cup diced tomato", "1 tbsp olive oil", "Salt, pepper, dried herbs (thyme or oregano)"],
  steps: ["Whisk eggs with a pinch of salt, pepper, and herbs in a bowl.", "Heat olive oil in an 8-inch non-stick pan over medium heat.", "Add mushrooms and cook 2 minutes until lightly browned.", "Pour eggs over mushrooms. Tilt pan to spread evenly.", "Let cook undisturbed 1 minute until edges start setting.", "Add turkey and tomato to one half of the omelette.", "When eggs are set (no longer jiggly), fold empty half over the filled half.", "Slide onto plate and serve immediately."]
},
// ══════════════════════════════════════════════════════════════
// LUNCHES
// ══════════════════════════════════════════════════════════════
{
  id: "l01",
  name: "Chicken & Quinoa Power Bowl",
  cat: "L",
  cal: 490,
  prot: 40,
  carbs: 46,
  fat: 12,
  prep: 10,
  cook: 20,
  cad: 5.50,
  tags: ["high-protein", "meal-prep", "balanced", "mediterranean"],
  ing: ["2 chicken breasts (approx 300g total)", "1 cup dry quinoa", "2 cups arugula or mixed greens", "½ cup canned chickpeas (drained and rinsed)", "½ cup cucumber (diced)", "2 tbsp tahini", "1 tbsp lemon juice", "1 tbsp water", "Salt, pepper, garlic powder, olive oil"],
  steps: ["Cook quinoa: rinse well, add to pot with 2 cups water and a pinch of salt. Bring to boil, reduce heat, cover and simmer 15 minutes. Remove from heat and let sit 5 minutes covered. Fluff with fork.", "While quinoa cooks, season chicken with olive oil, garlic powder, salt and pepper.", "Heat a pan over medium-high. Cook chicken 6–7 minutes per side until internal temp reaches 74°C (165°F). Let rest 3 minutes before slicing.", "Make tahini dressing: whisk tahini, lemon juice, and water until smooth. Season with salt.", "Build bowls: add greens, then quinoa, sliced chicken, chickpeas, and cucumber.", "Drizzle tahini dressing over everything and serve.", "Meal prep tip: Make a double batch of quinoa and chicken on Sunday for 3 days of lunches."]
}, {
  id: "l02",
  name: "Turkey Lettuce Wraps",
  cat: "L",
  cal: 320,
  prot: 28,
  carbs: 14,
  fat: 12,
  prep: 10,
  cook: 10,
  cad: 4.00,
  tags: ["low-carb", "quick", "high-protein"],
  ing: ["300g lean ground turkey", "8–10 large butter lettuce leaves", "½ cup water chestnuts (canned, diced small)", "2 tbsp hoisin sauce", "1 tbsp low-sodium soy sauce", "1 tsp sesame oil", "3 cloves garlic (minced)", "1 tsp fresh ginger (grated)", "Green onions for garnish"],
  steps: ["Mix hoisin, soy sauce, and sesame oil together in a small bowl. Set aside.", "Heat a non-stick pan over medium-high heat. Add turkey and break apart immediately.", "Cook turkey 5–6 minutes, stirring, until no longer pink.", "Push turkey to the sides. Add garlic and ginger to the center and cook 30 seconds until fragrant.", "Stir in sauce mixture and water chestnuts. Cook 2 more minutes until everything is coated and sauce thickens slightly.", "Separate lettuce leaves and lay flat on a plate.", "Spoon turkey filling into each lettuce cup.", "Garnish with sliced green onions and serve immediately."]
}, {
  id: "l03",
  name: "Red Lentil Soup",
  cat: "L",
  cal: 380,
  prot: 22,
  carbs: 58,
  fat: 8,
  prep: 10,
  cook: 25,
  cad: 2.20,
  tags: ["budget", "high-fiber", "meal-prep", "plant-based"],
  ing: ["1 cup dry red lentils", "1 can (400ml) diced tomatoes", "1 medium onion (diced)", "3 cloves garlic (minced)", "1 tsp ground cumin", "1 tsp turmeric", "½ tsp smoked paprika", "2 cups low-sodium vegetable broth", "2 cups baby spinach", "1 tbsp olive oil", "Salt, pepper, lemon juice"],
  steps: ["Rinse lentils in cold water until water runs clear. Set aside.", "Heat olive oil in a large pot over medium heat. Add onion and cook 4–5 minutes until softened.", "Add garlic, cumin, turmeric, and paprika. Stir and cook 1 minute until fragrant.", "Add diced tomatoes (with liquid), lentils, and vegetable broth. Stir to combine.", "Bring to a boil, then reduce heat to medium-low. Simmer 20 minutes uncovered, stirring occasionally, until lentils are completely soft.", "Use a hand blender to partially blend (leave some texture) — or blend half and stir back in.", "Stir in spinach until wilted (about 1 minute).", "Season with salt, pepper, and a squeeze of lemon juice. Serve with crusty bread.", "Stores well: refrigerate up to 5 days or freeze in portions."]
}, {
  id: "l04",
  name: "Mediterranean Chicken Wrap",
  cat: "L",
  cal: 450,
  prot: 36,
  carbs: 38,
  fat: 14,
  prep: 10,
  cook: 15,
  cad: 4.80,
  tags: ["high-protein", "portable", "mediterranean"],
  ing: ["2 chicken breasts (approx 280g total)", "2 large whole wheat wraps", "4 tbsp hummus", "½ cup cucumber (sliced)", "½ cup cherry tomatoes (halved)", "¼ red onion (thinly sliced)", "1 cup mixed greens", "4 tbsp tzatziki", "3 tbsp feta crumbles", "1 tsp Greek seasoning", "1 tbsp olive oil"],
  steps: ["Rub chicken with olive oil and Greek seasoning.", "Cook in a pan over medium-high heat, 6–7 minutes per side, until cooked through (74°C internal). Rest 3 minutes, then slice thin.", "Warm wraps in a dry pan or microwave for 20 seconds to make them pliable.", "Spread 2 tbsp hummus across each wrap, leaving a 1-inch border.", "Layer greens, chicken slices, cucumber, tomatoes, and red onion down the centre.", "Add a spoon of tzatziki and scatter feta over top.", "Fold in the sides, then roll tightly from the bottom up.", "Cut in half diagonally. Wrap in foil if taking to go — stays fresh 4 hours."]
}, {
  id: "l05",
  name: "Black Bean Burrito Bowl",
  cat: "L",
  cal: 460,
  prot: 22,
  carbs: 68,
  fat: 12,
  prep: 10,
  cook: 15,
  cad: 3.00,
  tags: ["plant-based", "budget", "high-fiber"],
  ing: ["1 cup dry brown rice (or 2 cups cooked)", "1 can (400ml) black beans (drained and rinsed)", "½ cup frozen corn (thawed)", "½ cup fresh salsa", "½ avocado (sliced)", "¼ cup plain Greek yogurt (sour cream substitute)", "Juice of 1 lime", "Fresh cilantro", "½ tsp cumin, salt, garlic powder"],
  steps: ["Cook rice according to package directions (about 15 minutes for instant brown rice).", "While rice cooks, warm black beans in a small pot with cumin, garlic powder, and a pinch of salt. Cook on medium-low 5 minutes.", "Warm corn in a pan or microwave for 2 minutes.", "Build the bowl: rice on the bottom, then beans and corn.", "Top with salsa, avocado slices, and a spoon of Greek yogurt.", "Squeeze lime juice over everything and top with fresh cilantro.", "Optional heat: add hot sauce or jalapeño slices."]
}, {
  id: "l06",
  name: "Asian Chicken Salad",
  cat: "L",
  cal: 400,
  prot: 34,
  carbs: 28,
  fat: 14,
  prep: 15,
  cook: 15,
  cad: 4.50,
  tags: ["high-protein", "meal-prep", "fresh"],
  ing: ["2 chicken breasts", "3 cups green cabbage (shredded)", "1 cup purple cabbage (shredded)", "1 cup shredded carrots", "¼ cup frozen edamame (thawed)", "3 tbsp rice vinegar", "2 tbsp soy sauce", "1 tbsp sesame oil", "1 tbsp honey", "1 tsp fresh ginger (grated)", "¼ cup sliced almonds", "2 mandarin orange segments (from can, drained)"],
  steps: ["Season chicken with salt and pepper. Cook in a pan over medium-high, 6–7 minutes per side until done. Let rest, then shred or slice thin.", "Make dressing: whisk rice vinegar, soy sauce, sesame oil, honey, and ginger together.", "In a large bowl, combine both cabbages, carrots, and edamame.", "Pour dressing over vegetables and toss well to coat.", "Top with chicken, mandarin segments, and sliced almonds.", "Serve immediately or refrigerate up to 2 days (keep dressing separate if making ahead)."]
}, {
  id: "l07",
  name: "Cottage Cheese Power Bowl",
  cat: "L",
  cal: 310,
  prot: 28,
  carbs: 28,
  fat: 8,
  prep: 8,
  cook: 0,
  cad: 3.00,
  tags: ["high-protein", "no-cook", "budget", "quick"],
  ing: ["1 cup cottage cheese (2%)", "½ cup cherry tomatoes (halved)", "½ cucumber (diced)", "¼ cup radishes (sliced)", "1 tbsp olive oil", "1 tsp everything bagel seasoning", "Salt, black pepper", "Whole grain crackers on the side (optional)"],
  steps: ["Spoon cottage cheese into a bowl and spread slightly.", "Arrange cherry tomatoes, cucumber, and radishes on top.", "Drizzle olive oil evenly over everything.", "Sprinkle everything bagel seasoning, a pinch of salt, and black pepper.", "Serve immediately with crackers on the side for dipping.", "Note: This is a no-cook, 8-minute lunch that's surprisingly filling. Great for busy weekdays."]
},
// ══════════════════════════════════════════════════════════════
// DINNERS
// ══════════════════════════════════════════════════════════════
{
  id: "d01",
  name: "Lemon Herb Baked Salmon",
  cat: "D",
  cal: 520,
  prot: 46,
  carbs: 18,
  fat: 24,
  prep: 10,
  cook: 20,
  cad: 8.00,
  tags: ["omega-3", "high-protein", "sheet-pan", "couples-easy"],
  ing: ["2 salmon fillets (approx 200g each)", "1 lemon (half sliced, half for juice)", "2 tbsp fresh dill (or 1 tsp dried)", "2 tbsp fresh parsley", "2 cloves garlic (minced)", "1 tbsp olive oil", "1 bunch asparagus (trimmed)", "Salt & black pepper"],
  steps: ["Preheat oven to 400°F (200°C). Line a baking sheet with foil.", "Place asparagus on one half of the sheet. Drizzle with olive oil, season with salt and pepper.", "Place salmon fillets on the other half of the sheet, skin side down.", "Mix garlic, dill, parsley, and a drizzle of olive oil. Spread evenly over the salmon tops.", "Place lemon slices over the salmon. Squeeze the other lemon half over asparagus.", "Bake 15–18 minutes until salmon flakes easily with a fork and asparagus is tender-crisp.", "Salmon is done when it turns from translucent to opaque in the centre.", "Serve directly from the sheet — minimal cleanup."]
}, {
  id: "d02",
  name: "Chicken & Broccoli Stir Fry",
  cat: "D",
  cal: 480,
  prot: 44,
  carbs: 36,
  fat: 14,
  prep: 10,
  cook: 15,
  cad: 5.00,
  tags: ["high-protein", "quick", "budget"],
  ing: ["2 chicken breasts (sliced thin, against the grain)", "3 cups broccoli florets", "1 cup brown rice (cooked)", "2 tbsp low-sodium soy sauce", "1 tbsp oyster sauce", "1 tsp sesame oil", "3 cloves garlic (minced)", "1 tsp fresh ginger (grated)", "1 tsp cornstarch", "1 tbsp vegetable oil", "Sesame seeds to garnish"],
  steps: ["Mix soy sauce, oyster sauce, sesame oil, and cornstarch in a bowl. Set aside as the stir fry sauce.", "Toss sliced chicken with a pinch of salt and pepper.", "Heat vegetable oil in a wok or large pan over high heat until smoking hot.", "Add chicken in a single layer. Don't stir for 90 seconds — let it sear and develop colour.", "Stir and cook another 2 minutes until chicken is cooked through. Remove to a plate.", "In the same pan, add broccoli. Stir fry 3–4 minutes until bright green and tender-crisp.", "Add garlic and ginger. Cook 30 seconds.", "Return chicken to pan. Pour sauce over everything and toss to coat. Cook 1 more minute until sauce thickens.", "Serve over brown rice and garnish with sesame seeds."]
}, {
  id: "d03",
  name: "Turkey Meatballs & Zucchini Noodles",
  cat: "D",
  cal: 460,
  prot: 40,
  carbs: 24,
  fat: 18,
  prep: 15,
  cook: 25,
  cad: 5.50,
  tags: ["low-carb", "high-protein", "italian"],
  ing: ["400g lean ground turkey", "1 large egg", "¼ cup breadcrumbs (or almond flour for lower carb)", "¼ cup grated parmesan", "2 tsp Italian seasoning", "1 tsp garlic powder", "½ tsp onion powder", "3 medium zucchini", "1 cup good quality marinara sauce", "1 tbsp olive oil", "Salt & pepper"],
  steps: ["Preheat oven to 400°F (200°C).", "Combine turkey, egg, breadcrumbs, parmesan, Italian seasoning, garlic powder, onion powder, salt and pepper. Mix gently — overworking makes tough meatballs.", "Roll into 16 equal balls (about the size of a golf ball).", "Place on a lined baking sheet and bake 18–20 minutes until cooked through and lightly browned.", "While meatballs bake, spiralize zucchini into noodles (or use a vegetable peeler for ribbons).", "Heat olive oil in a pan over medium heat. Add zucchini noodles and toss for 2–3 minutes. Season lightly — don't overcook or they go mushy.", "Warm marinara in a small pot.", "Plate zucchini noodles, top with meatballs and marinara, and extra parmesan."]
}, {
  id: "d04",
  name: "Sheet Pan Chicken & Vegetables",
  cat: "D",
  cal: 510,
  prot: 46,
  carbs: 28,
  fat: 16,
  prep: 10,
  cook: 30,
  cad: 5.50,
  tags: ["meal-prep", "sheet-pan", "high-protein", "couples-easy"],
  ing: ["2 chicken breasts", "1 cup broccoli florets", "1 red bell pepper (sliced)", "1 medium onion (sliced)", "2 small sweet potatoes (cubed, 1 inch pieces)", "2 tbsp olive oil", "1 tsp smoked paprika", "1 tsp garlic powder", "1 tsp Italian seasoning", "Salt & pepper"],
  steps: ["Preheat oven to 425°F (220°C). Line a large baking sheet with foil.", "Place sweet potato cubes on the sheet. Toss with 1 tbsp olive oil, paprika, salt and pepper. Roast 10 minutes first (they take longer).", "While sweet potatoes start cooking, rub chicken with remaining olive oil, garlic powder, Italian seasoning, salt and pepper.", "After 10 minutes, move sweet potatoes to one side. Add chicken to centre and broccoli, pepper, and onion to the other side.", "Roast everything together for 20 more minutes.", "Chicken is done when internal temp reaches 74°C (165°F) and juices run clear.", "Vegetables should be tender with slight caramelised edges.", "Serve directly from the pan. Great for batch cooking — doubles easily."]
}, {
  id: "d05",
  name: "Ground Turkey Taco Skillet",
  cat: "D",
  cal: 490,
  prot: 38,
  carbs: 40,
  fat: 16,
  prep: 10,
  cook: 20,
  cad: 4.50,
  tags: ["high-protein", "one-pan", "budget", "crowd-pleaser"],
  ing: ["400g lean ground turkey", "1 can (400ml) black beans (drained)", "1 can (340ml) corn (drained)", "1 can (400ml) diced tomatoes", "2 tbsp taco seasoning", "¼ cup shredded low-fat cheddar", "½ cup plain Greek yogurt", "Juice of 1 lime", "Fresh cilantro", "Hot sauce", "1 tsp olive oil"],
  steps: ["Heat olive oil in a large pan over medium-high. Add turkey, breaking it apart as it cooks.", "Cook 6–8 minutes until browned and no longer pink.", "Add taco seasoning and stir to coat. Cook 1 minute.", "Add diced tomatoes (with liquid), black beans, and corn. Stir to combine.", "Reduce heat to medium. Simmer 8–10 minutes until liquid reduces slightly and everything is heated through.", "Taste and adjust seasoning with salt, lime juice, and hot sauce.", "Serve directly from the skillet topped with shredded cheese, Greek yogurt, and cilantro.", "Optional: serve with brown rice or warm tortillas on the side."]
}, {
  id: "d06",
  name: "Greek Chicken Bowl",
  cat: "D",
  cal: 530,
  prot: 44,
  carbs: 40,
  fat: 16,
  prep: 10,
  cook: 20,
  cad: 5.50,
  tags: ["mediterranean", "high-protein", "meal-prep"],
  ing: ["2 chicken breasts", "1 cup dry quinoa", "½ cup cucumber (diced)", "1 cup cherry tomatoes (halved)", "¼ red onion (thinly sliced)", "¼ cup kalamata olives", "½ cup tzatziki", "3 tbsp feta crumbles", "1 tbsp olive oil", "1½ tsp Greek seasoning (or oregano + garlic + paprika)", "Juice of ½ lemon"],
  steps: ["Cook quinoa: rinse well, add to pot with 2 cups water. Bring to boil, reduce heat, cover and simmer 15 minutes. Fluff with fork.", "Rub chicken with olive oil, Greek seasoning, salt, pepper, and lemon juice.", "Cook chicken in a pan over medium-high, 6–7 minutes per side until cooked through. Rest 3 minutes, then slice.", "While chicken rests, prepare toppings: dice cucumber, halve tomatoes, slice red onion thin.", "Build bowls: quinoa base, then sliced chicken, cucumber, tomatoes, olives, and red onion.", "Spoon tzatziki over top and crumble feta.", "Finish with a squeeze of lemon and drizzle of olive oil."]
}, {
  id: "d07",
  name: "Black Bean & Beef Chili",
  cat: "D",
  cal: 530,
  prot: 40,
  carbs: 48,
  fat: 14,
  prep: 10,
  cook: 35,
  cad: 5.00,
  tags: ["high-protein", "high-fiber", "batch-cooking", "budget"],
  ing: ["300g lean ground beef (90/10)", "2 cans (400ml each) black beans (drained)", "1 can (400ml) diced tomatoes", "1 medium onion (diced)", "3 cloves garlic (minced)", "1 red bell pepper (diced)", "2 tbsp chili powder", "1 tsp cumin", "1 tsp smoked paprika", "½ tsp cayenne (optional for heat)", "1 cup low-sodium beef broth", "Plain Greek yogurt and green onions for topping", "1 tsp olive oil"],
  steps: ["Heat olive oil in a large pot over medium-high. Add beef, breaking apart. Cook 5–6 minutes until browned.", "Add onion and bell pepper. Cook 4 minutes until softened.", "Add garlic, chili powder, cumin, paprika, and cayenne. Stir and cook 1 minute until fragrant.", "Add diced tomatoes, black beans, and broth. Stir to combine.", "Bring to a boil, then reduce heat to low. Simmer uncovered 25–30 minutes, stirring occasionally, until thickened.", "Taste and season with salt and pepper.", "Serve topped with a spoon of Greek yogurt (instead of sour cream — more protein, same creaminess) and sliced green onions.", "Best the next day. Freezes perfectly in portions for up to 3 months."]
}, {
  id: "d08",
  name: "One-Pot Chicken & Rice",
  cat: "D",
  cal: 530,
  prot: 44,
  carbs: 52,
  fat: 12,
  prep: 10,
  cook: 30,
  cad: 4.50,
  tags: ["budget", "one-pot", "high-protein", "comfort", "couples-easy"],
  ing: ["2 chicken breasts", "1 cup dry brown rice", "2 cups low-sodium chicken broth", "1 cup frozen peas", "1 medium onion (diced)", "3 cloves garlic (minced)", "1 tsp smoked paprika", "1 tsp cumin", "Juice of ½ lemon", "Fresh parsley", "1 tbsp olive oil", "Salt & pepper"],
  steps: ["Season chicken on both sides with paprika, cumin, salt, and pepper.", "Heat olive oil in a large pot or Dutch oven over medium-high heat. Sear chicken 3 minutes per side until golden. Remove and set aside — it won't be cooked through yet.", "In the same pot, add onion. Cook 3 minutes until softened.", "Add garlic and cook 30 seconds.", "Add dry rice and stir to coat in the oil for 1 minute.", "Pour in chicken broth. Stir and scrape any bits from the bottom.", "Nestle chicken breasts on top of the rice. Bring to a boil.", "Reduce heat to low, cover tightly, and cook 25 minutes without lifting the lid.", "After 25 minutes, check rice is tender and chicken is cooked through. Add peas, cover 3 more minutes.", "Squeeze lemon over top, scatter fresh parsley, and serve from the pot."]
}

// ══════════════════════════════════════════════════════════════
// ── ADD MORE MEALS HERE ──────────────────────────────────────
//
// Template:
// {
//   id:"d09", name:"Your Meal Name", cat:"D",
//   cal:000, prot:00, carbs:00, fat:00, prep:0, cook:0, cad:0.00,
//   tags:["tag1","tag2"],
//   ing:[
//     "ingredient 1",
//     "ingredient 2"
//   ],
//   steps:[
//     "Step 1 instruction.",
//     "Step 2 instruction.",
//     "Step 3 instruction."
//   ]
// },
// ══════════════════════════════════════════════════════════════
];

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
const STORES = {
  costco: {
    name: "Costco",
    emoji: "🏪",
    color: "#3b82f6",
    amex: false,
    card: "Costco Mastercard",
    cardEmoji: "🟦",
    cardNote: "2% cash back at Costco · Only accepted card",
    priceRank: 1,
    priceTier: "Budget",
    bestFor: "Bulk proteins, salmon, eggs, oats, olive oil, nuts, frozen veg, Greek yogurt (large tub), protein powder",
    note: "Mastercard ONLY in Canada. Best bulk unit prices by far.",
    avoid: false
  },
  walmart: {
    name: "Walmart",
    emoji: "🛒",
    color: "#fbbf24",
    amex: false,
    card: "TD Visa Infinite Aeroplan",
    cardEmoji: "🟥",
    cardNote: "1.5x Aeroplan on groceries · Amex not accepted here",
    priceRank: 2,
    priceTier: "Budget",
    bestFor: "Pantry staples, canned goods, rice, pasta, dairy, condiments, sauces",
    note: "Visa/MC only. Reliable low prices. General merchandise MCC.",
    avoid: false
  },
  metro: {
    name: "Metro",
    emoji: "🥬",
    color: "#ef4444",
    amex: true,
    card: "Cobalt Amex",
    cardEmoji: "🟩",
    cardNote: "5x MR points on groceries · Grocery MCC · Air Miles",
    priceRank: 3,
    priceTier: "Mid-range",
    bestFor: "Fresh produce, weekly sales, fresh meat, deli items",
    note: "Amex ✓ — Cobalt earns 5x MR here. Air Miles also earns.",
    avoid: false
  },
  farmboy: {
    name: "Farm Boy",
    emoji: "🌽",
    color: "#22c55e",
    amex: true,
    card: "Cobalt Amex",
    cardEmoji: "🟩",
    cardNote: "5x MR points on groceries · Grocery MCC",
    priceRank: 4,
    priceTier: "Premium",
    bestFor: "Best fresh fish, premium produce, specialty/health items, prepared foods",
    note: "Amex ✓ — Cobalt earns 5x MR here. Higher prices but top quality.",
    avoid: false
  },
  longos: {
    name: "Longos",
    emoji: "🍋",
    color: "#a855f7",
    amex: true,
    card: "Cobalt Amex",
    cardEmoji: "🟩",
    cardNote: "5x MR points on groceries · Grocery MCC",
    priceRank: 4,
    priceTier: "Premium",
    bestFor: "Specialty items, prepared foods, bakery, fresh produce",
    note: "Amex ✓ — Cobalt earns 5x MR here. Verify Guelph location.",
    avoid: false
  }
};

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
function buildRoutes(ingredients) {
  const items = ingredients.map(ing => {
    const prices = {};
    Object.keys(STORES).forEach(sid => {
      prices[sid] = estimatePrice(ing, sid);
    });
    const ranked = storeRanking(ing);
    return {
      ing,
      prices,
      cheapest: Object.entries(prices).sort((a, b) => a[1] - b[1])[0][0],
      preferred: ranked[0]
    };
  });
  const mk = (id, name, icon, color, note, picker) => {
    const byStore = {};
    let total = 0;
    items.forEach(item => {
      const sid = picker(item);
      if (!byStore[sid]) byStore[sid] = [];
      byStore[sid].push({
        ing: item.ing,
        price: item.prices[sid]
      });
      total += item.prices[sid];
    });
    const cobaltTotal = Object.entries(byStore).filter(([s]) => STORES[s]?.card === "Cobalt Amex").reduce((a, [, is]) => a + is.reduce((b, i) => b + i.price, 0), 0);
    return {
      id,
      name,
      icon,
      color,
      note,
      byStore,
      total,
      cobaltTotal,
      stops: Object.keys(byStore).length
    };
  };
  const amexStores = Object.entries(STORES).filter(([, s]) => s.amex).map(([id]) => id);
  const singles = Object.keys(STORES).map(sid => ({
    sid,
    t: items.reduce((a, i) => a + i.prices[sid], 0)
  })).sort((a, b) => a.t - b.t);
  return [mk("A", "Lowest Total Cost", "🟢", "#22c55e", "Cheapest price per item, any store, any card. May require multiple cards.", item => item.cheapest), mk("B", "Best Card Strategy", "💳", "#a78bfa", "Routes each item to the store where your best card earns the most — Cobalt 5x at Metro/Farm Boy, Costco MC at Costco, TD Aeroplan at Walmart.", item => {
    if (item.preferred === "costco") return "costco";
    if (amexStores.includes(item.preferred)) return item.preferred;
    return "walmart";
  }), mk("C", "Fewest Stops", "⚡", "#f4a823", `Everything from ${STORES[singles[0].sid]?.name}. One trip, one card.`, () => singles[0].sid)];
}

// ─────────────────────────────────────────────────────────────────────────────
// PANTRY MATCHING — score 0–100 how many ingredients are already in pantry
// ─────────────────────────────────────────────────────────────────────────────

// Extract the core ingredient name from a string like "2 tbsp soy sauce (low sodium)"
function coreIngredient(raw) {
  return raw.toLowerCase().replace(/^[\d¼½¾⅓⅔]+\s*[\d/]*\s*(cup|tbsp|tsp|g|kg|ml|lb|oz|clove|slice|piece|can|pack|bunch|head|sprig|dash|pinch|handful|unit|bag|bottle|jar|box)s?\s*/i, "").replace(/\(.*?\)/g, "") // strip parenthetical notes
  .replace(/,.*$/, "") // strip anything after comma
  .replace(/[^a-z\s]/g, "") // strip symbols
  .trim().split(/\s+/).slice(0, 4).join(" "); // first 4 words only
}

// Return {matched, total, pct, missing[]} for a meal against a pantry list
function pantryMatch(meal, pantryItems) {
  if (!pantryItems || pantryItems.length === 0) return {
    matched: 0,
    total: 0,
    pct: 0,
    missing: []
  };

  // Build a single searchable string from all pantry item names
  const pantryStr = pantryItems.map(p => p.name.toLowerCase()).join(" | ");

  // Filter out pure seasonings/oils/spices — they're almost always in-pantry background
  const mainIngs = meal.ing.filter(ing => {
    const s = ing.toLowerCase();
    return !/^\s*salt|pepper\b|olive oil|avocado oil|coconut oil|vegetable oil|garlic powder|onion powder|cumin|paprika|turmeric|cinnamon|seasoning|spice|herb|bay leaf|thyme|rosemary|oregano|dill|parsley|cilantro|basil|cloves|allspice|nutmeg|Italian seasoning/.test(s);
  });
  if (mainIngs.length === 0) return {
    matched: 0,
    total: 0,
    pct: 100,
    missing: []
  };
  const missing = [];
  let matched = 0;
  mainIngs.forEach(ing => {
    const core = coreIngredient(ing);
    // Check if any pantry item name contains the core ingredient or vice versa
    const words = core.split(/\s+/).filter(w => w.length > 2); // meaningful words only
    const hit = words.some(w => pantryStr.includes(w));
    if (hit) matched++;else missing.push(ing);
  });
  return {
    matched,
    total: mainIngs.length,
    pct: Math.round(matched / mainIngs.length * 100),
    missing
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COST PER 100G — rough estimate for grocery list display
// ─────────────────────────────────────────────────────────────────────────────
function estimatePer100g(ing) {
  const s = ing.toLowerCase();
  // Return [price_per_100g_CAD, typical_qty_g] — null if not applicable
  if (/salmon|fresh fish/.test(s)) return [2.80, 200];
  if (/shrimp/.test(s)) return [2.20, 200];
  if (/chicken breast|ground beef|ground turkey|steak|pork/.test(s)) return [1.80, 300];
  if (/egg/.test(s)) return null; // sold by count
  if (/yogurt|cottage cheese/.test(s)) return [0.55, 500];
  if (/feta|parmesan|mozzarella|cheddar/.test(s)) return [1.20, 200];
  if (/broccoli|spinach|kale|cabbage|asparagus/.test(s)) return [0.60, 300];
  if (/bell pepper|tomato|cucumber|zucchini/.test(s)) return [0.50, 200];
  if (/avocado/.test(s)) return [0.90, 150];
  if (/onion|carrot/.test(s)) return [0.25, 500];
  if (/rice|quinoa|oat/.test(s)) return [0.22, 500];
  if (/pasta|noodle/.test(s)) return [0.30, 400];
  if (/olive oil|avocado oil/.test(s)) return [1.00, 500]; // per 500ml
  if (/almond|walnut|cashew/.test(s)) return [1.80, 150];
  if (/black bean|kidney bean|chickpea/.test(s)) return [0.35, 540]; // per can
  if (/diced tomato/.test(s)) return [0.24, 796];
  if (/coconut milk/.test(s)) return [0.60, 400];
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// PANTRY DEDUCTION ENGINE
// Parses ingredient strings → matches pantry items → computes quantities to deduct
// ─────────────────────────────────────────────────────────────────────────────

// Fraction map for unicode and text fractions
const FRACS = {
  "½": 0.5,
  "¼": 0.25,
  "¾": 0.75,
  "⅓": 0.333,
  "⅔": 0.667,
  "⅛": 0.125,
  "⅜": 0.375,
  "⅝": 0.625,
  "⅞": 0.875
};
function parseIngQty(raw) {
  let s = raw.trim();

  // Replace unicode fractions
  Object.entries(FRACS).forEach(([f, v]) => {
    s = s.replace(new RegExp(f, "g"), ` ${v} `);
  });

  // Extract leading number (handles "2", "1.5", "0.5 2" = "1/2 2" leftovers)
  const numMatch = s.match(/^([\d.]+)\s*([\d.]+)?/);
  let qty = 0;
  if (numMatch) {
    qty = parseFloat(numMatch[1]);
    if (numMatch[2]) qty += parseFloat(numMatch[2]); // e.g. "0.5 2" won't happen but safe
  }

  // Extract unit
  const unitMatch = s.match(/\b(cup|cups|tbsp|tablespoon|tsp|teaspoon|g|kg|ml|l|lb|lbs|oz|can|cans|pack|packs|bag|bags|unit|units|piece|pieces|clove|cloves|bunch|head|heads|fillet|fillets|slice|slices)\b/i);
  const unit = unitMatch ? unitMatch[1].toLowerCase().replace(/s$/, "") : "unit";

  // Remaining words = ingredient name
  const name = s.replace(/^[\d.\s]+/, "").replace(/\b(cup|cups|tbsp|tablespoon|tsp|teaspoon|g|kg|ml|l|lb|lbs|oz|can|cans|pack|packs|bag|bags|unit|units|piece|pieces|clove|cloves|bunch|head|heads|fillet|fillets|slice|slices)\b/gi, "").replace(/\(.*?\)/g, "").replace(/,.*$/, "").replace(/\s+/g, " ").trim();
  return {
    qty: qty || 1,
    unit,
    name
  };
}

// Rough unit conversions to a common base for deduction
// Returns qty in the pantry's unit, or null if can't convert
function convertToUnit(qty, fromUnit, toUnit) {
  const from = fromUnit.toLowerCase().replace(/s$/, "");
  const to = toUnit.toLowerCase().replace(/s$/, "");
  if (from === to) return qty;

  // Volume: ml base
  const toMl = {
    ml: 1,
    l: 1000,
    tsp: 5,
    teaspoon: 5,
    tbsp: 15,
    tablespoon: 15,
    cup: 237,
    "fl oz": 30
  };
  // Weight: g base
  const toG = {
    g: 1,
    kg: 1000,
    oz: 28.35,
    lb: 453.6,
    lbs: 453.6
  };
  // Count synonyms
  const countUnits = ["unit", "piece", "fillet", "slice", "clove", "bunch", "head", "can", "pack", "bag"];
  if (toMl[from] && toMl[to]) return qty * toMl[from] / toMl[to];
  if (toG[from] && toG[to]) return qty * toG[from] / toG[to];
  // cup → g rough (for rice/flour/oats/etc) — 1 cup ≈ 175g average
  if (from === "cup" && toG[to]) return qty * 175 / toG[to];
  if (toG[from] && to === "cup") return qty * toG[from] / 175;
  // count → count: if both are count-ish, treat as same
  if (countUnits.includes(from) && countUnits.includes(to)) return qty;
  return null; // can't convert — skip deduction for this item
}

// Build list of {pantryItem, deductAmt, resultQty, label} for a meal
function computeDeductions(meal, pantryItems) {
  if (!pantryItems || pantryItems.length === 0) return [];

  // Skip pure background/seasoning ingredients
  const mainIngs = meal.ing.filter(ing => {
    const s = ing.toLowerCase();
    return !/^(salt|pepper\b|olive oil|avocado oil|coconut oil|vegetable oil|garlic powder|onion powder|cumin|paprika|turmeric|cinnamon|seasoning|spice|herbs?|bay leaf|thyme|rosemary|oregano|dill|parsley|cilantro|basil|allspice|nutmeg|chili flake)/i.test(s.trim());
  });
  const deductions = [];
  mainIngs.forEach(ing => {
    const parsed = parseIngQty(ing);
    if (!parsed.name || parsed.qty === 0) return;

    // Find best pantry match — score by word overlap
    const ingWords = parsed.name.split(/\s+/).filter(w => w.length > 2);
    let bestItem = null,
      bestScore = 0;
    pantryItems.forEach(item => {
      const itemWords = item.name.toLowerCase().split(/\s+/);
      const score = ingWords.filter(w => itemWords.some(iw => iw.includes(w) || w.includes(iw))).length;
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    });
    if (!bestItem || bestScore === 0) return; // no match

    // Convert ingredient qty to pantry unit
    const deductInPantryUnit = convertToUnit(parsed.qty, parsed.unit, bestItem.unit);
    if (deductInPantryUnit === null) return; // can't convert safely

    const deductAmt = Math.min(parseFloat(deductInPantryUnit.toFixed(2)), bestItem.qty);
    const resultQty = Math.max(0, parseFloat((bestItem.qty - deductAmt).toFixed(2)));
    deductions.push({
      pantryItem: bestItem,
      deductAmt,
      resultQty,
      label: `${bestItem.name}: ${bestItem.qty} ${bestItem.unit} → ${resultQty} ${bestItem.unit}  (−${deductAmt})`
    });
  });

  // Deduplicate — if same pantry item matched twice, keep larger deduction
  const seen = {};
  return deductions.filter(d => {
    if (seen[d.pantryItem.id]) return false;
    seen[d.pantryItem.id] = true;
    return true;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI
// ─────────────────────────────────────────────────────────────────────────────
// (C, CL, inp, Lbl, DAYS, SHORT_DAYS, SLOTS already declared above)
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SHORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["B", "L", "D"];

// ─────────────────────────────────────────────────────────────────────────────
// MEAL CARD — with expandable cooking steps
// ─────────────────────────────────────────────────────────────────────────────
function MealCard({
  meal,
  onPick,
  picked,
  pantryItems = []
}) {
  const [tab, setTab] = useState("info"); // "info" | "recipe"
  const [open, setOpen] = useState(false);
  const cc = C[meal.cat] || "#9ca3af";
  const pm = pantryMatch(meal, pantryItems);
  const pmColor = pm.pct >= 80 ? "#4ade80" : pm.pct >= 50 ? "#f4a823" : "var(--text-secondary)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 10,
      background: picked ? "rgba(74,222,128,.06)" : "var(--card-bg)",
      border: `1px solid ${picked ? "rgba(74,222,128,.2)" : "var(--card-border)"}`,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "10px 12px",
      cursor: "pointer"
    },
    onClick: () => setOpen(!open)
  }, onPick && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onPick(meal);
    },
    style: {
      width: 22,
      height: 22,
      borderRadius: 6,
      border: `2px solid ${picked ? "#4ade80" : "rgba(255,255,255,.2)"}`,
      background: picked ? "#4ade80" : "transparent",
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
  }, picked ? "✓" : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 2,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--text-primary)",
      fontWeight: 600
    }
  }, meal.name), /*#__PURE__*/React.createElement("span", {
    style: {
      background: `${cc}18`,
      color: cc,
      fontSize: 9,
      fontWeight: 700,
      borderRadius: 4,
      padding: "1px 6px",
      letterSpacing: ".04em",
      flexShrink: 0
    }
  }, CL[meal.cat]), pantryItems.length > 0 && pm.total > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      background: `${pmColor}15`,
      color: pmColor,
      fontSize: 9,
      fontWeight: 700,
      borderRadius: 4,
      padding: "1px 6px",
      flexShrink: 0
    }
  }, pm.pct >= 80 ? "🟢" : pm.pct >= 50 ? "🟡" : "🔴", " ", pm.matched, "/", pm.total, " in pantry")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#f4a823",
      fontSize: 10,
      fontWeight: 700
    }
  }, meal.cal, " cal"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#60a5fa",
      fontSize: 10
    }
  }, meal.prot, "g protein"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#4ade80",
      fontSize: 10
    }
  }, "$", meal.cad.toFixed(2), "/srv"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#60a5fa",
      fontSize: 10,
      fontWeight: 600
    }
  }, meal.prep + meal.cook, " min"))), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      fontSize: 11,
      flexShrink: 0
    }
  }, open ? "▲" : "▼")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid rgba(255,255,255,.05)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      padding: "8px 12px 0",
      gap: 6
    }
  }, [["info", "Ingredients"], ["recipe", "How to Cook"]].map(([t, l]) => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setTab(t),
    style: {
      padding: "5px 12px",
      borderRadius: 6,
      fontSize: 11,
      cursor: "pointer",
      border: `1px solid ${tab === t ? cc : "var(--card-bg-4)"}`,
      background: tab === t ? `${cc}18` : "transparent",
      color: tab === t ? cc : "var(--text-secondary)",
      fontWeight: tab === t ? 700 : 400
    }
  }, l))), tab === "info" && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      flexWrap: "wrap",
      marginBottom: 8
    }
  }, meal.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      background: "var(--card-bg-3)",
      color: "#6b7280",
      fontSize: 10,
      borderRadius: 5,
      padding: "2px 7px"
    }
  }, t))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10,
      margin: "0 0 6px",
      textTransform: "uppercase",
      letterSpacing: ".06em",
      fontWeight: 600
    }
  }, "Ingredients (per serving)"), meal.ing.map((i, idx) => {
    const inPantry = pantryItems.length > 0 && coreIngredient(i).split(/\s+/).filter(w => w.length > 2).some(w => pantryItems.map(p => p.name.toLowerCase()).join(" ").includes(w));
    return /*#__PURE__*/React.createElement("p", {
      key: idx,
      style: {
        color: inPantry ? "var(--text-secondary)" : "#9ca3af",
        fontSize: 12,
        margin: "0 0 3px",
        textDecoration: inPantry ? "none" : "none"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: inPantry ? "#4ade80" : "var(--text-muted)",
        marginRight: 4
      }
    }, inPantry ? "✓" : "·"), i, inPantry && /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)",
        fontSize: 9,
        marginLeft: 5
      }
    }, "in pantry"));
  }), pantryItems.length > 0 && pm.missing.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      padding: "7px 10px",
      background: "rgba(244,168,35,.06)",
      border: "1px solid rgba(244,168,35,.12)",
      borderRadius: 7
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontSize: 10,
      fontWeight: 700,
      margin: "0 0 3px"
    }
  }, "Need to buy (", pm.missing.length, ")"), pm.missing.map((m, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    style: {
      color: "#9ca3af",
      fontSize: 11,
      margin: "0 0 1px"
    }
  }, "\xB7 ", m))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      padding: "8px 10px",
      background: "var(--card-bg)",
      borderRadius: 7,
      display: "flex",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".05em",
      margin: "0 0 2px"
    }
  }, "Prep"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#60a5fa",
      fontSize: 12,
      fontWeight: 700,
      margin: 0
    }
  }, meal.prep, " min")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".05em",
      margin: "0 0 2px"
    }
  }, "Cook"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-primary)",
      fontSize: 12,
      fontWeight: 700,
      margin: 0
    }
  }, meal.cook, " min")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".05em",
      margin: "0 0 2px"
    }
  }, "Carbs"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-primary)",
      fontSize: 12,
      fontWeight: 700,
      margin: 0
    }
  }, meal.carbs, "g")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".05em",
      margin: "0 0 2px"
    }
  }, "Fat"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-primary)",
      fontSize: 12,
      fontWeight: 700,
      margin: 0
    }
  }, meal.fat, "g")))), tab === "recipe" && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px 12px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10,
      margin: "0 0 8px",
      textTransform: "uppercase",
      letterSpacing: ".06em",
      fontWeight: 600
    }
  }, "Cooking Instructions"), meal.steps.map((step, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 8,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: `${cc}20`,
      color: cc,
      fontSize: 10,
      fontWeight: 800,
      borderRadius: 5,
      padding: "2px 7px",
      flexShrink: 0,
      minWidth: 24,
      textAlign: "center",
      lineHeight: "18px"
    }
  }, i + 1), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#c9ccd4",
      fontSize: 12,
      margin: 0,
      lineHeight: 1.6
    }
  }, step))))));
}

// ─────────────────────────────────────────────────────────────────────────────
// WEEK PLAN TAB
// ─────────────────────────────────────────────────────────────────────────────
function WeekPlanTab({
  plan,
  setPlan,
  allMeals = MEALS_DB,
  pantryItems = [],
  cookedMeals = {},
  onCookMeal
}) {
  const [dayIdx, setDayIdx] = useState(0);
  const [picking, setPicking] = useState(null);
  const [search, setSearch] = useState("");
  const [confirmKey, setConfirmKey] = useState(null); // "dayIdx:slot" pending confirm
  const [deductions, setDeductions] = useState([]);
  const assign = async meal => {
    const up = {
      ...plan,
      [dayIdx]: {
        ...(plan[dayIdx] || {}),
        [picking]: meal
      }
    };
    setPlan(up);
    await DB.set(KEYS.weekPlan(), up);
    setPicking(null);
    setSearch("");
  };
  const remove = async (day, slot) => {
    const up = {
      ...plan,
      [day]: {
        ...(plan[day] || {})
      }
    };
    delete up[day][slot];
    setPlan(up);
    await DB.set(KEYS.weekPlan(), up);
  };

  // Auto-fill: pick meals with highest pantry match per category
  const autoFill = async () => {
    const sortByPantry = meals => [...meals].sort((a, b) => pantryMatch(b, pantryItems).pct - pantryMatch(a, pantryItems).pct);
    const B = sortByPantry(allMeals.filter(m => m.cat === "B"));
    const L = sortByPantry(allMeals.filter(m => m.cat === "L"));
    const D = sortByPantry(allMeals.filter(m => m.cat === "D"));
    const up = {};
    for (let d = 0; d < 7; d++) up[d] = {
      B: B[d % B.length],
      L: L[d % L.length],
      D: D[d % D.length]
    };
    setPlan(up);
    await DB.set(KEYS.weekPlan(), up);
  };

  // Open confirm dialog for marking a meal as cooked
  const requestCook = (dayI, slot, meal) => {
    const key = `${dayI}:${slot}`;
    const deds = computeDeductions(meal, pantryItems);
    setDeductions(deds);
    setConfirmKey(key);
  };

  // User confirmed — deduct from pantry + mark cooked
  const confirmCook = async () => {
    if (confirmKey) {
      await onCookMeal(confirmKey, deductions);
      setConfirmKey(null);
      setDeductions([]);
    }
  };
  const day = plan[dayIdx] || {};
  const totalCal = Object.values(day).reduce((a, m) => a + (m?.cal || 0), 0);
  const totalProt = Object.values(day).reduce((a, m) => a + (m?.prot || 0), 0);
  const weekDone = [0, 1, 2, 3, 4, 5, 6].every(d => plan[d]?.B && plan[d]?.L && plan[d]?.D);
  const pickable = allMeals.filter(m => m.cat === picking && (!search || m.name.toLowerCase().includes(search.toLowerCase()))).sort((a, b) => pantryMatch(b, pantryItems).pct - pantryMatch(a, pantryItems).pct);
  return /*#__PURE__*/React.createElement("div", null, !weekDone && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(74,222,128,.06)",
      border: "1px solid rgba(74,222,128,.15)",
      borderRadius: 12,
      padding: "13px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontWeight: 700,
      fontSize: 13,
      margin: "0 0 5px"
    }
  }, "Plan your week"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 12,
      margin: "0 0 10px",
      lineHeight: 1.5
    }
  }, "Tap any slot to pick from ", allMeals.length, " meals, or auto-fill all 7 days."), /*#__PURE__*/React.createElement("button", {
    onClick: autoFill,
    style: {
      width: "100%",
      padding: "11px 0",
      background: "rgba(74,222,128,.15)",
      border: "1px solid rgba(74,222,128,.3)",
      color: "#4ade80",
      borderRadius: 9,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "\u26A1 AUTO-FILL WEEK \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 14
    }
  }, SHORT_DAYS.map((d, i) => {
    const ok = plan[i]?.B && plan[i]?.L && plan[i]?.D;
    const cookedCount = [`${i}:B`, `${i}:L`, `${i}:D`].filter(k => cookedMeals[k]).length;
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      onClick: () => setDayIdx(i),
      style: {
        flex: 1,
        padding: "7px 2px",
        borderRadius: 7,
        border: `1px solid ${dayIdx === i ? "rgba(96,165,250,.4)" : ok ? "rgba(74,222,128,.2)" : "var(--card-border)"}`,
        background: dayIdx === i ? "rgba(96,165,250,.12)" : ok ? "rgba(74,222,128,.05)" : "rgba(255,255,255,.02)",
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: dayIdx === i ? "#60a5fa" : ok ? "#4ade80" : "var(--text-secondary)",
        fontSize: 9,
        fontWeight: dayIdx === i ? 800 : 500,
        margin: 0
      }
    }, d), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 8,
        margin: "2px 0 0"
      }
    }, cookedCount > 0 ? `🍳${cookedCount}` : ok ? "✓" : "—"));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#60a5fa",
      fontFamily: "'Syne',sans-serif",
      fontSize: 16,
      fontWeight: 800,
      margin: 0
    }
  }, DAYS[dayIdx]), totalCal > 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11,
      margin: "2px 0 0"
    }
  }, totalCal, " cal \xB7 ", totalProt, "g protein")), /*#__PURE__*/React.createElement("button", {
    onClick: async () => {
      const u = {
        ...plan
      };
      delete u[dayIdx];
      setPlan(u);
      await DB.set(KEYS.weekPlan(), u);
    },
    style: {
      padding: "5px 11px",
      background: "transparent",
      border: "1px solid rgba(255,255,255,.08)",
      color: "var(--text-muted)",
      borderRadius: 7,
      fontSize: 11,
      cursor: "pointer"
    }
  }, "Clear day")), confirmKey && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,.7)",
      zIndex: 198
    },
    onClick: () => setConfirmKey(null)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      width: "calc(100% - 40px)",
      maxWidth: 420,
      background: "#0e1420",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: 14,
      padding: "20px",
      zIndex: 199
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontFamily: "'Syne',sans-serif",
      fontSize: 15,
      fontWeight: 800,
      margin: "0 0 4px"
    }
  }, "Mark as Cooked?"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 12,
      margin: "0 0 14px",
      lineHeight: 1.5
    }
  }, "This will update your pantry to reflect what was used."), deductions.length > 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--card-bg)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 9,
      padding: "10px 12px",
      marginBottom: 14,
      maxHeight: 200,
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#6b7280",
      fontSize: 10,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: ".07em",
      margin: "0 0 8px"
    }
  }, "Pantry updates"), deductions.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5,
      paddingBottom: 5,
      borderBottom: i < deductions.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-primary)",
      fontSize: 12
    }
  }, d.pantryItem.name), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10,
      textDecoration: "line-through",
      marginRight: 6
    }
  }, d.pantryItem.qty, " ", d.pantryItem.unit), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#f4a823",
      fontSize: 12,
      fontWeight: 700
    }
  }, d.resultQty, " ", d.pantryItem.unit))))) : /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--card-bg)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 9,
      padding: "10px 12px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 12,
      margin: 0
    }
  }, "No matching pantry items found to deduct \u2014 meal will be marked cooked without pantry changes.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: confirmCook,
    style: {
      flex: 1,
      padding: "12px 0",
      background: "#4ade80",
      color: "#080b11",
      border: "none",
      borderRadius: 9,
      fontSize: 14,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "CONFIRM \u2713"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setConfirmKey(null),
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
  }, "Cancel")))), SLOTS.map(slot => {
    const meal = day[slot];
    const cc = C[slot];
    const cookKey = `${dayIdx}:${slot}`;
    const isCooked = !!cookedMeals[cookKey];
    return /*#__PURE__*/React.createElement("div", {
      key: slot,
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: cc,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: ".07em",
        textTransform: "uppercase",
        margin: 0
      }
    }, CL[slot]), meal && /*#__PURE__*/React.createElement("button", {
      onClick: () => isCooked ? null : requestCook(dayIdx, slot, meal),
      disabled: isCooked,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: 7,
        border: `1px solid ${isCooked ? "rgba(74,222,128,.35)" : "var(--card-border-2)"}`,
        background: isCooked ? "rgba(74,222,128,.1)" : "var(--card-bg-3)",
        color: isCooked ? "#4ade80" : "var(--text-secondary)",
        fontSize: 11,
        fontWeight: isCooked ? 700 : 400,
        cursor: isCooked ? "default" : "pointer",
        transition: "all .15s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 14,
        height: 14,
        borderRadius: 3,
        border: `2px solid ${isCooked ? "#4ade80" : "rgba(255,255,255,.25)"}`,
        background: isCooked ? "#4ade80" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 9,
        color: "#080b11",
        fontWeight: 800,
        flexShrink: 0
      }
    }, isCooked ? "✓" : ""), isCooked ? "Cooked ✓" : "Mark as Cooked")), meal ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 7,
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        opacity: isCooked ? 0.6 : 1
      }
    }, /*#__PURE__*/React.createElement(MealCard, {
      meal: meal,
      pantryItems: pantryItems
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setPicking(slot);
        setSearch("");
      },
      style: {
        padding: "6px 10px",
        background: "rgba(255,255,255,.05)",
        border: "1px solid rgba(255,255,255,.1)",
        color: "var(--text-secondary)",
        borderRadius: 7,
        fontSize: 10,
        cursor: "pointer"
      }
    }, "\u21BB"), /*#__PURE__*/React.createElement("button", {
      onClick: () => remove(dayIdx, slot),
      style: {
        padding: "6px 10px",
        background: "transparent",
        border: "1px solid rgba(255,255,255,.07)",
        color: "var(--text-muted)",
        borderRadius: 7,
        fontSize: 10,
        cursor: "pointer"
      }
    }, "\xD7"))) : /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setPicking(slot);
        setSearch("");
      },
      style: {
        width: "100%",
        padding: "14px 0",
        background: "rgba(255,255,255,.02)",
        border: `2px dashed ${cc}40`,
        borderRadius: 9,
        color: cc,
        fontSize: 12,
        cursor: "pointer",
        fontWeight: 600
      }
    }, "+ Pick ", CL[slot]));
  }), picking && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,.6)",
      zIndex: 98
    },
    onClick: () => setPicking(null)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 490,
      background: "#0d111a",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: "16px 16px 0 0",
      padding: "16px 16px 32px",
      zIndex: 99,
      maxHeight: "75vh",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: C[picking],
      fontWeight: 700,
      fontSize: 15,
      margin: 0
    }
  }, "Pick ", CL[picking]), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPicking(null),
    style: {
      background: "transparent",
      border: "1px solid rgba(255,255,255,.1)",
      color: "#9ca3af",
      borderRadius: 8,
      padding: "5px 14px",
      fontSize: 12,
      cursor: "pointer"
    }
  }, "Cancel")), /*#__PURE__*/React.createElement("input", {
    value: search,
    onChange: e => setSearch(e.target.value),
    placeholder: `Search ${CL[picking]?.toLowerCase()}s... (${allMeals.filter(m => m.cat === picking).length} options)`,
    style: {
      ...inp,
      marginBottom: 10,
      fontSize: 13,
      padding: "9px 13px"
    },
    autoFocus: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: "auto",
      flex: 1
    }
  }, pickable.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 12,
      margin: "12px 0"
    }
  }, "No meals match."), pickable.map(m => /*#__PURE__*/React.createElement(MealCard, {
    key: m.id,
    meal: m,
    onPick: assign,
    pantryItems: pantryItems
  }))))));
}

// ─────────────────────────────────────────────────────────────────────────────
// LIBRARY TAB
// ─────────────────────────────────────────────────────────────────────────────
function LibraryTab({
  customMeals,
  onAddMeal,
  onDeleteCustom,
  pantryItems = []
}) {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("pantry");
  const [showAdd, setShowAdd] = useState(false);
  const allMeals = [...MEALS_DB, ...customMeals];
  const catMap = {
    "All": null,
    "Breakfast": "B",
    "Lunch": "L",
    "Dinner": "D"
  };
  const counts = {
    B: allMeals.filter(m => m.cat === "B").length,
    L: allMeals.filter(m => m.cat === "L").length,
    D: allMeals.filter(m => m.cat === "D").length
  };
  const filtered = allMeals.filter(m => !catMap[cat] || m.cat === catMap[cat]).filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
    if (sort === "pantry") return pantryMatch(b, pantryItems).pct - pantryMatch(a, pantryItems).pct;
    if (sort === "cal") return a.cal - b.cal;
    if (sort === "prot") return b.prot - a.prot;
    if (sort === "cad") return a.cad - b.cad;
    return 0;
  });
  const handleSave = meal => {
    onAddMeal(meal);
    setShowAdd(false);
  };
  const canMakeNow = pantryItems.length > 0 ? allMeals.filter(m => pantryMatch(m, pantryItems).pct >= 80).length : 0;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(244,168,35,.06)",
      border: "1px solid rgba(244,168,35,.12)",
      borderRadius: 10,
      padding: "9px 12px",
      flex: 1,
      marginRight: 10
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontSize: 11,
      fontWeight: 700,
      margin: "0 0 1px"
    }
  }, "\uD83D\uDCD6 ", allMeals.length, " meals \xB7 ", counts.B, "B \xB7 ", counts.L, "L \xB7 ", counts.D, "D"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10,
      margin: 0
    }
  }, canMakeNow > 0 ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#4ade80",
      fontWeight: 700
    }
  }, canMakeNow), " meals 80%+ covered by your pantry") : "Tap any card for ingredients + steps")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowAdd(true),
    style: {
      padding: "10px 14px",
      background: "rgba(244,168,35,.15)",
      border: "1px solid rgba(244,168,35,.35)",
      color: "#f4a823",
      borderRadius: 10,
      fontSize: 12,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif",
      letterSpacing: ".04em",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, "+ Add")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      marginBottom: 10,
      flexWrap: "wrap"
    }
  }, Object.keys(catMap).map(c => {
    const cc = C[catMap[c]] || "#f4a823";
    return /*#__PURE__*/React.createElement("button", {
      key: c,
      onClick: () => setCat(c),
      style: {
        padding: "5px 11px",
        borderRadius: 7,
        fontSize: 11,
        cursor: "pointer",
        border: `1px solid ${cat === c ? cc : "var(--card-bg-4)"}`,
        background: cat === c ? `${cc}18` : "transparent",
        color: cat === c ? cc : "var(--text-secondary)",
        fontWeight: cat === c ? 700 : 400
      }
    }, c, catMap[c] ? ` (${counts[catMap[c]]})` : "");
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: search,
    onChange: e => setSearch(e.target.value),
    placeholder: `Search ${allMeals.length} meals...`,
    style: {
      ...inp,
      flex: 1,
      fontSize: 13,
      padding: "8px 12px"
    }
  }), /*#__PURE__*/React.createElement("select", {
    value: sort,
    onChange: e => setSort(e.target.value),
    style: {
      ...inp,
      width: 148,
      fontSize: 12,
      padding: "8px 10px"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "pantry"
  }, "\uD83D\uDFE2 Pantry First"), /*#__PURE__*/React.createElement("option", {
    value: "cal"
  }, "\u2191 Calories"), /*#__PURE__*/React.createElement("option", {
    value: "prot"
  }, "\u2193 Protein"), /*#__PURE__*/React.createElement("option", {
    value: "cad"
  }, "\u2191 Cost"))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11,
      margin: "0 0 10px"
    }
  }, filtered.length, " meals"), filtered.map(m => {
    const isCustom = customMeals.some(c => c.id === m.id);
    return /*#__PURE__*/React.createElement("div", {
      key: m.id,
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement(MealCard, {
      meal: m,
      pantryItems: pantryItems
    }), isCustom && /*#__PURE__*/React.createElement("button", {
      onClick: () => onDeleteCustom(m.id),
      title: "Remove this meal",
      style: {
        position: "absolute",
        top: 8,
        right: 8,
        background: "rgba(239,68,68,.15)",
        border: "1px solid rgba(239,68,68,.2)",
        color: "#ef4444",
        borderRadius: 6,
        padding: "2px 7px",
        fontSize: 10,
        cursor: "pointer",
        fontWeight: 700,
        zIndex: 2
      }
    }, "Remove"));
  }), showAdd && /*#__PURE__*/React.createElement(AddMealModal, {
    onSave: handleSave,
    onClose: () => setShowAdd(false)
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD MEAL MODAL — photo, website URL, Instagram
// ─────────────────────────────────────────────────────────────────────────────
const EXTRACT_PROMPT = `Extract this recipe and return ONLY a valid JSON object — no markdown fences, no explanation, just raw JSON.

Required format (fill in real values, no nulls):
{
  "name": "Recipe Name",
  "cat": "D",
  "cal": 480,
  "prot": 35,
  "carbs": 40,
  "fat": 14,
  "prep": 10,
  "cook": 25,
  "cad": 5.50,
  "tags": ["high-protein","quick"],
  "ing": ["2 chicken breasts","1 cup brown rice","1 tbsp olive oil"],
  "steps": [
    "Detailed step 1 — be specific about technique, heat, and timing.",
    "Detailed step 2.",
    "Detailed step 3."
  ]
}

Rules:
- cat must be exactly "B" (breakfast), "L" (lunch), or "D" (dinner)
- cal, prot, carbs, fat are integers (per serving for 2 people)
- prep and cook are integers in minutes
- cad is estimated cost per serving in Canadian dollars (float)
- ing is an array of ingredient strings with quantities
- steps is an array of at least 3 detailed cooking instruction strings
- If you cannot determine a value, make a reasonable estimate — never use null`;
async function callClaude(messages, system) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
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
function AddMealModal({
  onSave,
  onClose
}) {
  const [mode, setMode] = useState("photo"); // "photo" | "url" | "instagram"
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | review | error
  const [errMsg, setErrMsg] = useState("");
  const [draft, setDraft] = useState(null);
  const fileRef = useRef(null);
  const fileToBase64 = file => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  // ── Extract from photo ───────────────────────────────────────────────────
  const handlePhoto = async file => {
    setStatus("loading");
    try {
      const b64 = await fileToBase64(file);
      const result = await callClaude([{
        role: "user",
        content: [{
          type: "image",
          source: {
            type: "base64",
            media_type: file.type,
            data: b64
          }
        }, {
          type: "text",
          text: EXTRACT_PROMPT
        }]
      }]);
      setDraft({
        ...result,
        id: `c${Date.now()}`,
        source: "photo"
      });
      setStatus("review");
    } catch (e) {
      setErrMsg("Couldn't read that image — try a clearer photo with visible text.");
      setStatus("error");
    }
  };

  // ── Extract from website URL ─────────────────────────────────────────────
  const handleUrl = async () => {
    if (!url.trim()) return;
    setStatus("loading");
    try {
      // Try to fetch the page text; fall back to asking Claude with just the URL
      let pageText = "";
      try {
        const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const r = await fetch(proxy);
        if (r.ok) {
          const html = await r.text();
          // Strip tags, compress whitespace, take first 6000 chars
          pageText = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 6000);
        }
      } catch {}
      const prompt = pageText ? `Recipe from this website (${url}):\n\n${pageText}\n\n${EXTRACT_PROMPT}` : `Extract the recipe from this URL: ${url}\n\n${EXTRACT_PROMPT}`;
      const result = await callClaude([{
        role: "user",
        content: prompt
      }]);
      setDraft({
        ...result,
        id: `c${Date.now()}`,
        source: url
      });
      setStatus("review");
    } catch (e) {
      setErrMsg("Couldn't extract a recipe from that URL. Try pasting the page text directly into the Instagram tab.");
      setStatus("error");
    }
  };

  // ── Extract from Instagram ───────────────────────────────────────────────
  // Instagram blocks direct fetching — best path is URL + caption/text
  const handleInstagram = async () => {
    if (!url.trim() && !caption.trim()) return;
    setStatus("loading");
    try {
      const prompt = `Instagram recipe post.
URL: ${url || "(not provided)"}
Caption / recipe text pasted by user:
${caption || "(not provided — extract from URL context only)"}

${EXTRACT_PROMPT}`;
      const result = await callClaude([{
        role: "user",
        content: prompt
      }]);
      setDraft({
        ...result,
        id: `c${Date.now()}`,
        source: url || "instagram"
      });
      setStatus("review");
    } catch (e) {
      setErrMsg("Couldn't extract recipe. Make sure you've pasted the caption or recipe text.");
      setStatus("error");
    }
  };
  const handleSubmit = () => {
    if (mode === "url") handleUrl();else if (mode === "instagram") handleInstagram();
  };

  // ── Draft editor — let user tweak before saving ──────────────────────────
  const DraftEditor = () => {
    const [d, setD] = useState(draft);
    if (!d) return null;
    const cc = {
      B: "#f4a823",
      L: "#4ade80",
      D: "#60a5fa"
    }[d.cat] || "#9ca3af";
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(74,222,128,.07)",
        border: "1px solid rgba(74,222,128,.2)",
        borderRadius: 10,
        padding: "12px 14px",
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#4ade80",
        fontSize: 11,
        fontWeight: 700,
        margin: "0 0 2px"
      }
    }, "\u2713 Recipe extracted \u2014 review before saving"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 10,
        margin: 0
      }
    }, "Edit any field if something looks off.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#6b7280",
        fontSize: 10,
        margin: "0 0 4px",
        textTransform: "uppercase",
        letterSpacing: ".07em"
      }
    }, "Name"), /*#__PURE__*/React.createElement("input", {
      value: d.name,
      onChange: e => setD(p => ({
        ...p,
        name: e.target.value
      })),
      style: {
        ...inp,
        fontSize: 13
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 90
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#6b7280",
        fontSize: 10,
        margin: "0 0 4px",
        textTransform: "uppercase",
        letterSpacing: ".07em"
      }
    }, "Meal Type"), /*#__PURE__*/React.createElement("select", {
      value: d.cat,
      onChange: e => setD(p => ({
        ...p,
        cat: e.target.value
      })),
      style: {
        ...inp,
        fontSize: 13,
        padding: "10px 8px"
      }
    }, /*#__PURE__*/React.createElement("option", {
      value: "B"
    }, "Breakfast"), /*#__PURE__*/React.createElement("option", {
      value: "L"
    }, "Lunch"), /*#__PURE__*/React.createElement("option", {
      value: "D"
    }, "Dinner")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        marginBottom: 10
      }
    }, [["cal", "Cal", "#f4a823"], ["prot", "Protein (g)", "#60a5fa"], ["carbs", "Carbs (g)", "#a78bfa"], ["fat", "Fat (g)", "#fb923c"]].map(([k, lbl, c]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: c,
        fontSize: 9,
        margin: "0 0 3px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: ".06em"
      }
    }, lbl), /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: d[k],
      onChange: e => setD(p => ({
        ...p,
        [k]: parseInt(e.target.value) || 0
      })),
      style: {
        ...inp,
        fontSize: 12,
        padding: "7px 8px",
        textAlign: "center"
      }
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        marginBottom: 10
      }
    }, [["prep", "Prep (min)", "#4ade80"], ["cook", "Cook (min)", "#4ade80"], ["cad", "$/serve (CAD)", "#34d399"]].map(([k, lbl, c]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#6b7280",
        fontSize: 9,
        margin: "0 0 3px",
        textTransform: "uppercase",
        letterSpacing: ".06em"
      }
    }, lbl), /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: d[k],
      onChange: e => setD(p => ({
        ...p,
        [k]: parseFloat(e.target.value) || 0
      })),
      style: {
        ...inp,
        fontSize: 12,
        padding: "7px 8px",
        textAlign: "center"
      }
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#6b7280",
        fontSize: 10,
        margin: "0 0 5px",
        textTransform: "uppercase",
        letterSpacing: ".07em"
      }
    }, "Ingredients (", d.ing?.length || 0, ")"), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--card-bg)",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 9,
        padding: "10px 12px",
        maxHeight: 140,
        overflowY: "auto"
      }
    }, (d.ing || []).map((ing, i) => /*#__PURE__*/React.createElement("p", {
      key: i,
      style: {
        color: "#9ca3af",
        fontSize: 12,
        margin: "0 0 3px"
      }
    }, "\xB7 ", ing)))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#6b7280",
        fontSize: 10,
        margin: "0 0 5px",
        textTransform: "uppercase",
        letterSpacing: ".07em"
      }
    }, "Cooking Steps (", d.steps?.length || 0, ")"), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--card-bg)",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 9,
        padding: "10px 12px",
        maxHeight: 180,
        overflowY: "auto"
      }
    }, (d.steps || []).map((step, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        gap: 8,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: cc,
        fontSize: 10,
        fontWeight: 800,
        flexShrink: 0,
        marginTop: 2
      }
    }, i + 1, "."), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#9ca3af",
        fontSize: 12,
        margin: 0,
        lineHeight: 1.5
      }
    }, step))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onSave(d),
      disabled: !d.name?.trim(),
      style: {
        flex: 1,
        padding: "13px 0",
        background: d.name?.trim() ? "#4ade80" : "rgba(255,255,255,.05)",
        color: d.name?.trim() ? "#080b11" : "var(--text-muted)",
        border: "none",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 800,
        cursor: d.name?.trim() ? "pointer" : "default",
        fontFamily: "'Syne',sans-serif",
        letterSpacing: ".05em"
      }
    }, "SAVE TO LIBRARY \u2192"), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setDraft(null);
        setStatus("idle");
      },
      style: {
        padding: "13px 14px",
        background: "transparent",
        border: "1px solid rgba(255,255,255,.1)",
        color: "var(--text-secondary)",
        borderRadius: 10,
        fontSize: 13,
        cursor: "pointer"
      }
    }, "\u21A9")));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,.7)",
      zIndex: 200
    },
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      width: "calc(100% - 32px)",
      maxWidth: 458,
      maxHeight: "90vh",
      background: "#0e1420",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: 16,
      zIndex: 201,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 18px",
      borderBottom: "1px solid rgba(255,255,255,.08)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontFamily: "'Syne',sans-serif",
      fontSize: 15,
      fontWeight: 800,
      margin: 0,
      letterSpacing: ".05em"
    }
  }, "ADD MEAL"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: "transparent",
      border: "1px solid rgba(255,255,255,.1)",
      color: "#9ca3af",
      borderRadius: 8,
      padding: "5px 14px",
      fontSize: 12,
      cursor: "pointer"
    }
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: "auto",
      flex: 1,
      padding: "16px 18px 24px"
    }
  }, status === "review" ? /*#__PURE__*/React.createElement(DraftEditor, null) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      marginBottom: 16,
      background: "var(--card-bg-3)",
      borderRadius: 9,
      padding: 4
    }
  }, [["photo", "📷 Photo"], ["url", "🔗 Website"], ["instagram", "📱 Instagram"]].map(([m, l]) => /*#__PURE__*/React.createElement("button", {
    key: m,
    onClick: () => {
      setMode(m);
      setStatus("idle");
      setErrMsg("");
    },
    style: {
      flex: 1,
      padding: "8px 0",
      border: "none",
      borderRadius: 6,
      background: mode === m ? "var(--card-bg-4)" : "transparent",
      color: mode === m ? "#f4a823" : "var(--text-secondary)",
      fontSize: 11,
      fontWeight: mode === m ? 700 : 400,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif",
      letterSpacing: ".04em"
    }
  }, l))), mode === "photo" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#9ca3af",
      fontSize: 13,
      margin: "0 0 14px",
      lineHeight: 1.6
    }
  }, "Take a photo of a recipe card, cookbook page, or printed recipe. Claude reads the image and extracts everything automatically."), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    capture: "environment",
    style: {
      display: "none"
    },
    onChange: e => e.target.files[0] && handlePhoto(e.target.files[0])
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => fileRef.current?.click(),
    style: {
      width: "100%",
      padding: "36px 0",
      background: "var(--card-bg)",
      border: "2px dashed rgba(244,168,35,.3)",
      borderRadius: 12,
      color: "#f4a823",
      fontSize: 13,
      cursor: "pointer",
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: 32,
      marginBottom: 8
    }
  }, "\uD83D\uDCF7"), "Take photo or upload image"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 10,
      margin: "10px 0 0",
      textAlign: "center"
    }
  }, "Works best with clear, well-lit photos where recipe text is readable")), mode === "url" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#9ca3af",
      fontSize: 13,
      margin: "0 0 14px",
      lineHeight: 1.6
    }
  }, "Paste any recipe website URL \u2014 AllRecipes, Food Network, NYT Cooking, Serious Eats, personal blogs, etc."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#6b7280",
      fontSize: 10,
      margin: "0 0 5px",
      textTransform: "uppercase",
      letterSpacing: ".07em"
    }
  }, "Recipe URL"), /*#__PURE__*/React.createElement("input", {
    value: url,
    onChange: e => setUrl(e.target.value),
    placeholder: "https://www.allrecipes.com/recipe/...",
    style: {
      ...inp,
      fontSize: 13,
      marginBottom: 12
    },
    onKeyDown: e => e.key === "Enter" && handleSubmit()
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleSubmit,
    disabled: !url.trim() || status === "loading",
    style: {
      width: "100%",
      padding: "13px 0",
      background: url.trim() && status !== "loading" ? "rgba(244,168,35,.15)" : "var(--card-bg-3)",
      border: `1px solid ${url.trim() && status !== "loading" ? "rgba(244,168,35,.3)" : "var(--card-border)"}`,
      color: url.trim() && status !== "loading" ? "#f4a823" : "var(--text-muted)",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 700,
      cursor: url.trim() && status !== "loading" ? "pointer" : "default"
    }
  }, status === "loading" ? "Extracting..." : "Extract Recipe →")), mode === "instagram" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(167,139,250,.06)",
      border: "1px solid rgba(167,139,250,.15)",
      borderRadius: 9,
      padding: "10px 13px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#a78bfa",
      fontSize: 11,
      fontWeight: 700,
      margin: "0 0 3px"
    }
  }, "Instagram blocks direct fetching"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11,
      margin: 0,
      lineHeight: 1.5
    }
  }, "For best results: paste the URL ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "#9ca3af"
    }
  }, "and"), " copy-paste the caption or recipe description from the post into the text field below.")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#6b7280",
      fontSize: 10,
      margin: "0 0 5px",
      textTransform: "uppercase",
      letterSpacing: ".07em"
    }
  }, "Instagram Reel / Post URL"), /*#__PURE__*/React.createElement("input", {
    value: url,
    onChange: e => setUrl(e.target.value),
    placeholder: "https://www.instagram.com/reel/...",
    style: {
      ...inp,
      fontSize: 13,
      marginBottom: 10
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#6b7280",
      fontSize: 10,
      margin: "0 0 5px",
      textTransform: "uppercase",
      letterSpacing: ".07em"
    }
  }, "Caption or Recipe Text ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      textTransform: "none",
      letterSpacing: "normal"
    }
  }, "(paste from the post)")), /*#__PURE__*/React.createElement("textarea", {
    value: caption,
    onChange: e => setCaption(e.target.value),
    placeholder: "Paste the Instagram caption, ingredient list, or any recipe text from the post here...\n\nThe more text you paste, the better the extraction.",
    rows: 6,
    style: {
      ...inp,
      fontSize: 12,
      resize: "none",
      marginBottom: 12,
      lineHeight: 1.6
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleSubmit,
    disabled: !url.trim() && !caption.trim() || status === "loading",
    style: {
      width: "100%",
      padding: "13px 0",
      background: (url.trim() || caption.trim()) && status !== "loading" ? "rgba(167,139,250,.15)" : "var(--card-bg-3)",
      border: `1px solid ${(url.trim() || caption.trim()) && status !== "loading" ? "rgba(167,139,250,.3)" : "var(--card-border)"}`,
      color: (url.trim() || caption.trim()) && status !== "loading" ? "#a78bfa" : "var(--text-muted)",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 700,
      cursor: (url.trim() || caption.trim()) && status !== "loading" ? "pointer" : "default"
    }
  }, status === "loading" ? "Extracting..." : "Extract Recipe →")), status === "loading" && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "18px 0 4px"
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
      background: "#f4a823",
      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
    }
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#9ca3af",
      fontSize: 12,
      margin: 0
    }
  }, "Reading recipe..."), /*#__PURE__*/React.createElement("style", null, `@keyframes pulse{0%,100%{opacity:.2}50%{opacity:1}}`)), status === "error" && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(239,68,68,.07)",
      border: "1px solid rgba(239,68,68,.2)",
      borderRadius: 9,
      padding: "11px 13px",
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#ef4444",
      fontSize: 12,
      fontWeight: 600,
      margin: "0 0 4px"
    }
  }, "Extraction failed"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#9ca3af",
      fontSize: 11,
      margin: "0 0 10px",
      lineHeight: 1.5
    }
  }, errMsg), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setStatus("idle");
      setErrMsg("");
    },
    style: {
      padding: "6px 14px",
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "#9ca3af",
      borderRadius: 7,
      fontSize: 11,
      cursor: "pointer"
    }
  }, "Try Again"))))));
}

// ─────────────────────────────────────────────────────────────────────────────
// GROCERY ROUTE TAB — multi-store, card-optimised
// ─────────────────────────────────────────────────────────────────────────────
function GroceryTab({
  plan,
  checked,
  setChecked
}) {
  const [activeRouteId, setActiveRouteId] = useState(null);
  const [expandedStore, setExpandedStore] = useState(null);
  const hasPlan = Object.values(plan).some(d => d?.B || d?.L || d?.D);

  // Collect and deduplicate ingredients
  const allIng = [];
  const seen = new Set();
  Object.values(plan).forEach(day => {
    Object.values(day || {}).forEach(meal => {
      (meal?.ing || []).forEach(ing => {
        const norm = ing.replace(/^[\d¼½¾⅓⅔\s]+[\w]* /, "").trim().toLowerCase().slice(0, 50);
        if (!seen.has(norm)) {
          seen.add(norm);
          allIng.push(ing);
        }
      });
    });
  });
  const routes = hasPlan ? buildRoutes(allIng) : [];
  const active = activeRouteId ? routes.find(r => r.id === activeRouteId) : null;
  const toggle = async key => {
    const up = {
      ...checked,
      [key]: !checked[key]
    };
    setChecked(up);
    await DB.set(KEYS.checked(), up);
  };
  return /*#__PURE__*/React.createElement("div", null, !hasPlan && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px 0",
      textAlign: "center",
      background: "rgba(255,255,255,.02)",
      border: "1px solid rgba(255,255,255,.05)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 13,
      margin: 0
    }
  }, "Build your week plan first, then come back here.")), hasPlan && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "Your Cards \u2014 How They're Routed"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 5
    }
  }, [{
    id: "cobalt",
    emoji: "🟩",
    name: "Cobalt Amex",
    earn: "5x MR at Metro, Farm Boy, Longos",
    use: "Amex-accepting grocery stores (grocery MCC)"
  }, {
    id: "costco",
    emoji: "🟦",
    name: "Costco Mastercard",
    earn: "2% cash back at Costco",
    use: "Costco only — required + best rewards there"
  }, {
    id: "td",
    emoji: "🟥",
    name: "TD Visa Infinite Aeroplan",
    earn: "1.5x Aeroplan at grocery stores",
    use: "Walmart + anywhere Amex isn't accepted"
  }].map(card => /*#__PURE__*/React.createElement("div", {
    key: card.id,
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "9px 12px",
      background: "var(--card-bg)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      flexShrink: 0,
      marginTop: 1
    }
  }, card.emoji), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-primary)",
      fontSize: 12,
      fontWeight: 600,
      margin: "0 0 2px"
    }
  }, card.name), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontSize: 10,
      margin: "0 0 1px"
    }
  }, card.earn), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10,
      margin: 0
    }
  }, card.use))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      padding: "7px 11px",
      background: "rgba(239,68,68,.05)",
      borderRadius: 8,
      border: "1px solid rgba(239,68,68,.1)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#ef4444",
      fontSize: 10,
      margin: "0 0 1px",
      fontWeight: 700
    }
  }, "\uD83D\uDEAB Avoided \u2014 Loblaws group"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10,
      margin: 0
    }
  }, "No Frills, Fortinos, Zehrs, Loblaws, Real Canadian Superstore, Independent, T&T"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "Guelph Stores"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 5
    }
  }, Object.entries(STORES).map(([id, s]) => /*#__PURE__*/React.createElement("div", {
    key: id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "8px 11px",
      background: "rgba(255,255,255,.02)",
      border: "1px solid rgba(255,255,255,.06)",
      borderRadius: 9,
      borderLeft: `3px solid ${s.color}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, s.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-primary)",
      fontSize: 12,
      fontWeight: 600
    }
  }, s.name), /*#__PURE__*/React.createElement("span", {
    style: {
      background: `${s.color}20`,
      color: s.color,
      fontSize: 9,
      fontWeight: 700,
      borderRadius: 4,
      padding: "1px 6px"
    }
  }, s.priceTier), /*#__PURE__*/React.createElement("span", {
    style: {
      background: "var(--card-bg-2)",
      color: "#9ca3af",
      fontSize: 9,
      fontWeight: 600,
      borderRadius: 4,
      padding: "1px 6px"
    }
  }, s.cardEmoji, " ", s.card)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 10,
      margin: "2px 0 0"
    }
  }, s.cardNote)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: s.priceRank <= 2 ? "#4ade80" : s.priceRank === 3 ? "#f4a823" : "#fb923c",
      fontSize: 11,
      fontWeight: 700,
      flexShrink: 0
    }
  }, "$".repeat(s.priceRank)))))), /*#__PURE__*/React.createElement(Lbl, {
    c: "Pick Your Shopping Strategy"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9,
      marginBottom: 18
    }
  }, routes.map(r => {
    const sel = activeRouteId === r.id;
    return /*#__PURE__*/React.createElement("button", {
      key: r.id,
      onClick: () => {
        setActiveRouteId(sel ? null : r.id);
        setExpandedStore(null);
      },
      style: {
        textAlign: "left",
        padding: "13px 14px",
        background: sel ? `${r.color}10` : "var(--card-bg)",
        border: `2px solid ${sel ? r.color : "var(--card-border)"}`,
        borderRadius: 12,
        cursor: "pointer",
        width: "100%",
        transition: "all .15s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 17
      }
    }, r.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        color: sel ? r.color : "var(--text-primary)",
        fontSize: 13,
        fontWeight: 800,
        margin: "0 0 3px",
        fontFamily: "'Syne',sans-serif"
      }
    }, r.name), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 4,
        flexWrap: "wrap"
      }
    }, Object.keys(r.byStore).map(sid => /*#__PURE__*/React.createElement("span", {
      key: sid,
      style: {
        background: `${STORES[sid]?.color || "#555"}20`,
        color: STORES[sid]?.color || "#555",
        fontSize: 9,
        fontWeight: 700,
        borderRadius: 4,
        padding: "1px 6px"
      }
    }, STORES[sid]?.emoji, " ", STORES[sid]?.name))))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right",
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: r.color,
        fontFamily: "'Syne',sans-serif",
        fontSize: 20,
        fontWeight: 800,
        margin: "0 0 1px"
      }
    }, "$", r.total.toFixed(0)), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 9,
        margin: 0
      }
    }, r.stops, " stop", r.stops !== 1 ? "s" : "", " \xB7 ", allIng.length, " items"))), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#6b7280",
        fontSize: 11,
        margin: "4px 0 0",
        lineHeight: 1.4
      }
    }, r.note), r.cobaltTotal > 0 && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#a78bfa",
        fontSize: 10,
        margin: "3px 0 0"
      }
    }, "\uD83D\uDFE9 ~$", r.cobaltTotal.toFixed(0), " on Cobalt Amex \u2192 ", Math.round(r.cobaltTotal * 5), " MR points earned"));
  })), active && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "Shopping List by Store"
  }), (() => {
    const allItems = Object.values(active.byStore).flat();
    const done = Object.values(checked).filter(Boolean).length;
    const pct = allItems.length ? Math.round(done / allItems.length * 100) : 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 11
      }
    }, done, "/", allItems.length), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 60,
        height: 4,
        background: "var(--card-border)",
        borderRadius: 2,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: `${pct}%`,
        background: "#4ade80",
        borderRadius: 2
      }
    })));
  })()), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 10,
      margin: "0 0 12px",
      lineHeight: 1.5
    }
  }, "\u26A0\uFE0F Prices are estimates. Check Flipp app for current flyers before leaving."), Object.entries(active.byStore).map(([sid, items]) => {
    const store = STORES[sid],
      sc = store?.color || "#555",
      sub = items.reduce((a, i) => a + i.price, 0);
    const done2 = items.filter((_, j) => checked[`${sid}:${j}`]).length;
    return /*#__PURE__*/React.createElement("div", {
      key: sid,
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        background: `${sc}12`,
        borderRadius: "10px 10px 0 0",
        border: `1px solid ${sc}30`,
        borderBottom: "none",
        cursor: "pointer"
      },
      onClick: () => setExpandedStore(expandedStore === sid ? null : sid)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15
      }
    }, store?.emoji), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: sc,
        fontWeight: 700,
        fontSize: 13,
        margin: 0
      }
    }, store?.name), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 10,
        margin: "1px 0 0"
      }
    }, items.length, " items \xB7 ", done2, "/", items.length, " done \xB7 Pay with ", store?.cardEmoji, " ", store?.card)), /*#__PURE__*/React.createElement("p", {
      style: {
        color: sc,
        fontWeight: 800,
        fontSize: 15,
        margin: 0,
        fontFamily: "'Syne',sans-serif"
      }
    }, "$", sub.toFixed(0)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)",
        fontSize: 10
      }
    }, expandedStore === sid ? "▲" : "▼")), expandedStore === sid && /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${sc}30`,
        borderTop: "none",
        borderRadius: "0 0 10px 10px"
      }
    }, items.map((item, j) => {
      const key = `${sid}:${j}`;
      const done = !!checked[key];
      const p100 = estimatePer100g(item.ing);
      const per100Label = p100 ? `$${p100[0].toFixed(2)}/100g` : null;
      return /*#__PURE__*/React.createElement("button", {
        key: j,
        onClick: () => toggle(key),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "9px 12px",
          background: done ? "rgba(74,222,128,.04)" : "rgba(255,255,255,.02)",
          borderBottom: j < items.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
          border: "none",
          borderLeft: "none",
          borderRight: "none",
          borderTop: "none"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 18,
          height: 18,
          borderRadius: 5,
          border: `2px solid ${done ? "#4ade80" : "rgba(255,255,255,.2)"}`,
          background: done ? "#4ade80" : "transparent",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 800,
          color: "#080b11"
        }
      }, done ? "✓" : ""), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1,
          fontSize: 12,
          color: done ? "#6b7280" : "var(--text-primary)",
          textDecoration: done ? "line-through" : "none"
        }
      }, item.ing), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          flexShrink: 0,
          gap: 1
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: "var(--text-secondary)",
          fontSize: 10
        }
      }, "~$", item.price), per100Label && /*#__PURE__*/React.createElement("span", {
        style: {
          color: "var(--text-muted)",
          fontSize: 9
        }
      }, per100Label)));
    }), "                      ", /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "8px 12px",
        background: "rgba(255,255,255,.02)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 10
      }
    }, "Subtotal (estimate)"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: sc,
        fontWeight: 700,
        fontSize: 12
      }
    }, "$", sub.toFixed(2))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "6px 12px",
        background: "rgba(255,255,255,.02)",
        borderTop: "1px solid rgba(255,255,255,.04)"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#9ca3af",
        fontSize: 10,
        margin: 0
      }
    }, "Pay with ", store?.cardEmoji, " ", /*#__PURE__*/React.createElement("strong", null, store?.card), " \u2014 ", store?.cardNote))));
  }))));
}

// ─────────────────────────────────────────────────────────────────────────────
// MEAL LOG — conversational macro tracking
// ─────────────────────────────────────────────────────────────────────────────

// Compute macro adherence score 0–5 from logged vs targets
function macroScore(logged, targets) {
  if (!targets || !logged) return null;
  const calPct = targets.calories ? logged.calories / targets.calories : 1;
  const protPct = targets.protein ? logged.protein / targets.protein : 1;
  // Score: 5 if within 10% of cal target AND ≥90% protein, scale down from there
  const calScore = Math.max(0, 5 - Math.abs(calPct - 1) * 10);
  const protScore = Math.min(5, (protPct * 5));
  return Math.round((calScore * 0.6 + protScore * 0.4) * 10) / 10;
}

// MealLogChat — conversational meal entry for one slot
function MealLogChat({ slot, date, existing, mealLibrary, onSave, onClose, userName }) {
  const [msgs, setMsgs] = useState(() => {
    const greeting = existing?.name
      ? [{ role: "assistant", content: `You logged **${existing.name}** here earlier (${existing.calories || "?"}cal · ${existing.protein || "?"}g protein). Want to update it?` }]
      : [{ role: "assistant", content: `What did you have for ${slot}?` }];
    return greeting;
  });
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(null); // final meal object
  const voiceRef = useRef(null);
  const chatEndRef = useRef(null);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const startVoice = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) { alert("Voice not supported. Try Chrome."); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.continuous = false; r.lang = "en-CA"; r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onresult = e => setInput(prev => (prev ? prev + " " : "") + e.results[0][0].transcript);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start(); voiceRef.current = r;
  };

  const send = async text => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setInput("");
    if (!window.__claude_api_key) {
      setMsgs(prev => [...prev, { role: "assistant", content: "No Claude API key set. Go to ⚙ Settings and add your key." }]);
      return;
    }
    setLoading(true);
    try {
      // Build library context
      const libContext = mealLibrary.length
        ? "KNOWN MEALS (use these macros if the meal matches, no need to ask again):\n" + mealLibrary.slice(0, 30).map(m => `${m.name}: ${m.calories}cal, ${m.protein}g protein, ${m.carbs}g carbs, ${m.fat}g fat`).join("\n")
        : "";

      const systemPrompt = `You are a friendly nutritionist helping ${userName || "the user"} log what they ate for ${slot} on ${date}.

${libContext}

Your job is to estimate macros through natural conversation. Rules:
- Use conversational portion language: "a medium banana", "a palm-sized piece", "a big bowl" — NOT grams unless the user mentions grams
- If the meal is in KNOWN MEALS, use those macros directly and confirm without asking again
- If the meal is unfamiliar, ask ONE clarifying question at a time (portion size, cooking method, key ingredients)
- For mixed dishes (curry, stew, pasta), ask to describe what's in it briefly
- Once you have enough info, provide your best estimate — don't over-ask
- When ready to save, respond with ONLY valid JSON (no markdown, no extra text):
{"action":"save","name":"Chicken Curry & Roti","calories":620,"protein":38,"carbs":72,"fat":14,"portionDesc":"2 roti, medium bowl of curry","isNew":true}
- isNew: true if this meal isn't in KNOWN MEALS (so it gets saved to the library)
- action "clarify": still gathering info — respond normally in plain text
- Keep responses SHORT (1–2 sentences max when clarifying)`;

      const apiMsgs = newMsgs.map(m => ({ role: m.role, content: m.content }));
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const res = await fetch("/api/claude", {
        method: "POST",
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 400, system: systemPrompt, messages: apiMsgs }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      const reply = data.content?.[0]?.text || "";

      // Try to parse as save action — handle raw JSON or markdown-wrapped ```json ... ```
      let parsed = null;
      try {
        let jsonStr = reply.trim();
        const wrapped = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (wrapped) jsonStr = wrapped[1].trim();
        if (jsonStr.startsWith("{")) parsed = JSON.parse(jsonStr);
      } catch {}

      if (parsed?.action === "save") {
        setConfirmed(parsed);
        setMsgs(prev => [...prev, {
          role: "assistant",
          content: `Got it — **${parsed.name}** · ${parsed.calories}cal · ${parsed.protein}g protein · ${parsed.carbs}g carbs · ${parsed.fat}g fat${parsed.portionDesc ? "\n_" + parsed.portionDesc + "_" : ""}`
        }]);
      } else {
        setMsgs(prev => [...prev, { role: "assistant", content: reply }]);
      }
    } catch(e) {
      setMsgs(prev => [...prev, { role: "assistant", content: e.name === "AbortError" ? "Request timed out — check your connection and try again." : "Something went wrong. Try again." }]);
    }
    setLoading(false);
  };

  const handleConfirm = () => {
    if (!confirmed) return;
    onSave(confirmed);
  };

  const bubbleStyle = isUser => ({
    maxWidth: "82%",
    padding: "9px 13px",
    borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
    background: isUser ? "rgba(167,139,250,.18)" : "rgba(255,255,255,.05)",
    border: `1px solid ${isUser ? "rgba(167,139,250,.3)" : "rgba(255,255,255,.08)"}`,
    fontSize: 13,
    lineHeight: 1.55,
    color: "var(--text-primary)",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap"
  });

  return /*#__PURE__*/React.createElement("div", {
    style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }
  },
    /*#__PURE__*/React.createElement("div", {
      style: { background: "var(--bg)", borderRadius: "20px 20px 0 0", padding: "0 0 env(safe-area-inset-bottom)", maxHeight: "85vh", display: "flex", flexDirection: "column" }
    },
      // Header
      /*#__PURE__*/React.createElement("div", {
        style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,.07)" }
      },
        /*#__PURE__*/React.createElement("span", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: "#fb923c", textTransform: "uppercase", letterSpacing: ".06em" } }, slot),
        /*#__PURE__*/React.createElement("button", { onClick: onClose, style: { background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 22, cursor: "pointer", lineHeight: 1 } }, "\xD7")
      ),
      // Chat messages
      /*#__PURE__*/React.createElement("div", {
        style: { flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }
      },
        msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
          key: i, style: { display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }
        },
          /*#__PURE__*/React.createElement("div", { style: bubbleStyle(m.role === "user") }, m.content)
        )),
        loading && /*#__PURE__*/React.createElement("div", { style: { display: "flex" } },
          /*#__PURE__*/React.createElement("div", { style: { ...bubbleStyle(false), color: "var(--text-muted)" } }, "...")
        ),
        /*#__PURE__*/React.createElement("div", { ref: chatEndRef })
      ),
      // Confirm banner
      confirmed && /*#__PURE__*/React.createElement("div", {
        style: { margin: "0 16px 10px", padding: "12px 14px", background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }
      },
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, color: "#4ade80", fontWeight: 600 } }, confirmed.calories + "cal \xB7 " + confirmed.protein + "g P"),
        /*#__PURE__*/React.createElement("button", {
          onClick: handleConfirm,
          style: { background: "#4ade80", border: "none", borderRadius: 8, padding: "8px 18px", color: "#080b11", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
        }, "SAVE")
      ),
      // Input row
      /*#__PURE__*/React.createElement("div", {
        style: { display: "flex", gap: 8, padding: "10px 16px 14px", borderTop: "1px solid rgba(255,255,255,.06)" }
      },
        /*#__PURE__*/React.createElement("button", {
          onClick: listening ? () => { voiceRef.current?.stop(); setListening(false); } : startVoice,
          style: { width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: listening ? "rgba(239,68,68,.2)" : "rgba(167,139,250,.15)", border: `1px solid ${listening ? "rgba(239,68,68,.4)" : "rgba(167,139,250,.3)"}`, color: listening ? "#ef4444" : "#a78bfa", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
        }, listening ? "\u23F9" : "\uD83C\uDFA4"),
        /*#__PURE__*/React.createElement("input", {
          type: "text", value: input, onChange: e => setInput(e.target.value),
          onKeyDown: e => e.key === "Enter" && send(input),
          placeholder: "Describe what you ate\u2026",
          style: { flex: 1, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif" }
        }),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => send(input), disabled: !input.trim() || loading,
          style: { background: "#a78bfa", border: "none", borderRadius: 10, padding: "9px 14px", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", flexShrink: 0, opacity: !input.trim() || loading ? .4 : 1 }
        }, "\u2192")
      )
    )
  );
}

// MacroBar — compact calorie + macro progress bar
function MacroBar({ logged, targets }) {
  if (!targets) return null;
  const pct = (val, max) => max ? Math.min(100, Math.round(val / max * 100)) : 0;
  const calPct = pct(logged.calories || 0, targets.calories);
  const protPct = pct(logged.protein || 0, targets.protein);
  const carbPct = pct(logged.carbs || 0, targets.carbs);
  const fatPct = pct(logged.fat || 0, targets.fat);
  const over = (logged.calories || 0) > (targets.calories || 9999);

  const barRow = (label, val, target, p, color) => /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 5 } },
    /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)", width: 36, flexShrink: 0, fontWeight: 600 } }, label),
    /*#__PURE__*/React.createElement("div", { style: { flex: 1, height: 6, background: "rgba(255,255,255,.07)", borderRadius: 3, overflow: "hidden" } },
      /*#__PURE__*/React.createElement("div", { style: { width: p + "%", height: "100%", background: color, borderRadius: 3, transition: "width .3s" } })
    ),
    /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: p >= 90 ? color : "var(--text-muted)", width: 52, textAlign: "right", flexShrink: 0 } }, val + "/" + target)
  );

  return /*#__PURE__*/React.createElement("div", {
    style: { background: over ? "rgba(239,68,68,.07)" : "rgba(255,255,255,.03)", border: `1px solid ${over ? "rgba(239,68,68,.2)" : "rgba(255,255,255,.07)"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 16 }
  },
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 } },
      /*#__PURE__*/React.createElement("span", { style: { fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: over ? "#ef4444" : "#4ade80", letterSpacing: ".06em" } },
        over ? "OVER TARGET" : calPct + "% OF DAILY GOAL"
      ),
      /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, color: "var(--text-primary)", fontWeight: 700 } }, (logged.calories || 0) + " / " + targets.calories + " cal")
    ),
    barRow("PROT", logged.protein || 0, targets.protein, protPct, "#fb923c"),
    barRow("CARB", logged.carbs || 0, targets.carbs, carbPct, "#f4a823"),
    barRow("FAT", logged.fat || 0, targets.fat, fatPct, "#60a5fa")
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────

// FoodTab — integrates food module into Mission Log shell
function FoodTab({
  activeUser,
  settings,
  pantryItemsFromApp = []
}) {
  const today = getToday();
  const userName = settings?.name || "Ryan";
  const partnerName = settings?.partnerName || "Sabrina";
  const isPartner = activeUser === "partner";
  const [subTab, setSubTab] = useState("log");
  const [pantryItems, setPantryItems] = useState(pantryItemsFromApp || []);
  const [weekPlan, setWeekPlan] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [customMeals, setCustomMeals] = useState([]);
  const [cookedMeals, setCookedMeals] = useState({});
  const [loadingFood, setLoadingFood] = useState(true);
  // Meal log state
  const [mealLog, setMealLog] = useState({}); // { breakfast: {...}, lunch: {...}, dinner: {...}, snacks: [...] }
  const [macroTargets, setMacroTargets] = useState(null); // { calories, protein, carbs, fat }
  const [mealLibrary, setMealLibrary] = useState([]); // [{ name, calories, protein, carbs, fat }]
  const [openSlot, setOpenSlot] = useState(null); // slot being logged
  const [generatingTargets, setGeneratingTargets] = useState(false);
  const [sabrinaPrompts, setSabrinaPrompts] = useState([]);
  const [activeSabrinaPrompt, setActiveSabrinaPrompt] = useState(null);
  const sunKey = getSundayKey();

  useEffect(() => {
    (async () => {
      const p = await DB.get(KEYS.pantry());
      setPantryItems(p || []);
      const wm = await DB.get(KEYS.weekPlan(sunKey));
      setWeekPlan(wm || {});
      const ci = await DB.get(KEYS.groceryCheck(sunKey));
      setCheckedItems(ci || {});
      const cm = await DB.get(KEYS.customMeals());
      setCustomMeals(cm || []);
      const ck = await DB.get(KEYS.cookedMeals(sunKey));
      setCookedMeals(ck || {});
      const ml = await DB.get(KEYS.mealLog(today));
      setMealLog(ml || {});
      const mt = await DB.get(KEYS.macroTargets());
      setMacroTargets(mt || null);
      const lib = await DB.get(KEYS.mealLibrary());
      setMealLibrary(Array.isArray(lib) ? lib : []);
      // Sabrina prompts (only for partner view)
      const sp = await DB.get(KEYS.sabinaPrompts());
      const validPrompts = (sp || []).filter(p => {
        const age = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        return age <= 3 && !p.answered;
      });
      setSabrinaPrompts(validPrompts);
      if (isPartner && validPrompts.length > 0) setActiveSabrinaPrompt(validPrompts[0]);
      setLoadingFood(false);
    })();
  }, [activeUser, sunKey, today]);

  // Auto-generate macro targets when weight changes (or no targets exist)
  const generateMacroTargets = useCallback(async (weight) => {
    if (!window.__claude_api_key || generatingTargets) return;
    setGeneratingTargets(true);
    try {
      const weightVal = weight || settings?.currentWeight || "unknown";
      const goal = settings?.weightGoal ? `target weight ${settings.weightGoal}lbs` : settings?.primaryGoal || "general fitness";
      const age = settings?.age || 32;
      const res = await fetch("/api/claude", {
        method: "POST",
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001", max_tokens: 200,
          messages: [{ role: "user", content: `You are a fitness nutritionist. Set daily macro targets for:\n- Age: ${age}\n- Current weight: ${weightVal}lbs\n- Goal: ${goal}\n- Activity: moderate (3-5 workouts/week)\n\nReturn ONLY valid JSON, no markdown:\n{"calories":2200,"protein":175,"carbs":220,"fat":65,"rationale":"one sentence"}\nUse evidence-based recommendations. Prioritize adequate protein for the goal.` }]
        })
      });
      const data = await res.json();
      let parsed = {};
      try { parsed = JSON.parse(data.content?.[0]?.text || "{}"); } catch {}
      if (parsed.calories) {
        setMacroTargets(parsed);
        await DB.set(KEYS.macroTargets(), parsed);
      }
    } catch(e) { console.warn("[FoodTab] Target gen failed:", e); }
    setGeneratingTargets(false);
  }, [settings, generatingTargets]);

  // Auto-trigger target generation if none exist
  useEffect(() => {
    if (!loadingFood && !macroTargets && window.__claude_api_key) {
      generateMacroTargets(null);
    }
  }, [loadingFood, macroTargets]);

  const saveMealLog = async (updated) => {
    setMealLog(updated);
    await DB.set(KEYS.mealLog(today), updated);
  };

  const handleSlotSave = async (slot, mealData) => {
    const updated = { ...mealLog };
    if (slot === "snack") {
      updated.snacks = [...(updated.snacks || []), { ...mealData, timestamp: new Date().toISOString(), id: "s_" + Date.now() }];
    } else {
      const planned = weekPlan[today + "_" + slot] || weekPlan[slot];
      updated[slot] = { ...mealData, plannedMeal: planned?.name || null, loggedAt: new Date().toISOString() };
    }
    await saveMealLog(updated);

    // Save to meal library if new
    if (mealData.isNew && mealData.name) {
      const libEntry = { name: mealData.name, calories: mealData.calories, protein: mealData.protein, carbs: mealData.carbs, fat: mealData.fat, portionDesc: mealData.portionDesc || "" };
      const existingIdx = mealLibrary.findIndex(m => m.name.toLowerCase() === mealData.name.toLowerCase());
      let newLib;
      if (existingIdx >= 0) { newLib = mealLibrary.map((m, i) => i === existingIdx ? libEntry : m); }
      else { newLib = [libEntry, ...mealLibrary].slice(0, 200); }
      setMealLibrary(newLib);
      await DB.set(KEYS.mealLibrary(), newLib);
    }

    // Queue Sabrina prompt (only if Ryan is logging, not partner)
    if (!isPartner) {
      const prompts = await DB.get(KEYS.sabinaPrompts()) || [];
      const newPrompt = {
        id: "sp_" + Date.now(),
        slot, meal: mealData.name, calories: mealData.calories, protein: mealData.protein,
        carbs: mealData.carbs, fat: mealData.fat, date: today,
        createdAt: new Date().toISOString(), answered: false
      };
      const cleaned = prompts.filter(p => {
        const age = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        return age <= 3 && !p.answered;
      });
      await DB.set(KEYS.sabinaPrompts(), [newPrompt, ...cleaned]);
    }
    setOpenSlot(null);
  };

  const handleSabrinaResponse = async (prompt, same) => {
    if (same) {
      const updated = { ...mealLog };
      if (prompt.slot === "snack") {
        updated.snacks = [...(updated.snacks || []), { name: prompt.meal, calories: prompt.calories, protein: prompt.protein, carbs: prompt.carbs, fat: prompt.fat, timestamp: new Date().toISOString(), id: "s_" + Date.now() }];
      } else {
        updated[prompt.slot] = { name: prompt.meal, calories: prompt.calories, protein: prompt.protein, carbs: prompt.carbs, fat: prompt.fat, loggedAt: new Date().toISOString() };
      }
      await saveMealLog(updated);
    }
    // Mark prompt answered
    const allPrompts = await DB.get(KEYS.sabinaPrompts()) || [];
    const updatedPrompts = allPrompts.map(p => p.id === prompt.id ? { ...p, answered: true } : p);
    await DB.set(KEYS.sabinaPrompts(), updatedPrompts);
    const remaining = sabrinaPrompts.filter(p => p.id !== prompt.id);
    setSabrinaPrompts(remaining);
    setActiveSabrinaPrompt(remaining.length > 0 ? remaining[0] : null);
  };

  const handleCookMeal = async (key, deductions) => {
    const updatedCooked = { ...cookedMeals, [key]: true };
    setCookedMeals(updatedCooked);
    await DB.set(KEYS.cookedMeals(sunKey), updatedCooked);
    if (deductions.length > 0) {
      const upd = pantryItems.map(item => {
        const d = deductions.find(d => d.pantryItem.id === item.id);
        return d ? { ...item, qty: d.resultQty } : item;
      });
      setPantryItems(upd);
      await DB.set(KEYS.pantry(), upd);
    }
  };

  // Compute daily logged totals
  const dailyLogged = useMemo(() => {
    const slots = ["breakfast", "lunch", "dinner"];
    let cal = 0, prot = 0, carbs = 0, fat = 0;
    slots.forEach(s => { if (mealLog[s]) { cal += mealLog[s].calories || 0; prot += mealLog[s].protein || 0; carbs += mealLog[s].carbs || 0; fat += mealLog[s].fat || 0; } });
    (mealLog.snacks || []).forEach(s => { cal += s.calories || 0; prot += s.protein || 0; carbs += s.carbs || 0; fat += s.fat || 0; });
    return { calories: cal, protein: prot, carbs, fat };
  }, [mealLog]);

  const allMeals = [...MEALS_DB, ...customMeals];
  const canMake = pantryItems.length > 0 ? allMeals.filter(m => pantryMatch(m, pantryItems).pct >= 80).length : 0;
  const subTabs = [{
    id: "log",
    l: "LOG",
    c: "#fb923c"
  }, {
    id: "plan",
    l: "WEEK",
    c: "#4ade80"
  }, {
    id: "library",
    l: "LIBRARY",
    c: "#f4a823"
  }, {
    id: "grocery",
    l: "GROCERY",
    c: "#a78bfa"
  }];
  if (loadingFood) return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "32px 0",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 12,
      margin: 0
    }
  }, "Loading..."));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    label: "Food",
    color: "#fb923c"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      margin: "2px 0 0 13px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 10,
      margin: 0
    }
  }, allMeals.length, " meals"), canMake > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#4ade80",
      fontSize: 10,
      fontWeight: 700
    }
  }, "\uD83D\uDFE2 ", canMake, " ready now"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      marginBottom: 14,
      borderBottom: "1px solid rgba(255,255,255,.06)"
    }
  }, subTabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setSubTab(t.id),
    style: {
      flex: 1,
      padding: "9px 0",
      border: "none",
      background: "transparent",
      color: subTab === t.id ? t.c : "var(--text-muted)",
      fontWeight: subTab === t.id ? 800 : 500,
      fontSize: 10,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif",
      letterSpacing: ".04em",
      borderBottom: `2px solid ${subTab === t.id ? t.c : "transparent"}`
    }
  }, t.l))),

  /* ── MacroBar always visible at top ── */
  /*#__PURE__*/React.createElement(MacroBar, { logged: dailyLogged, targets: macroTargets }),

  /* ── Sabrina prompt (partner view) ── */
  activeSabrinaPrompt && isPartner && /*#__PURE__*/React.createElement("div", {
    style: { background: "rgba(96,165,250,.08)", border: "1px solid rgba(96,165,250,.25)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }
  },
    /*#__PURE__*/React.createElement("p", { style: { fontSize: 13, color: "var(--text-primary)", fontWeight: 600, margin: "0 0 4px" } }, userName + " had " + activeSabrinaPrompt.meal + " for " + activeSabrinaPrompt.slot),
    /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: "0 0 12px" } }, activeSabrinaPrompt.calories + "cal \xB7 " + activeSabrinaPrompt.protein + "g protein — did you have the same?"),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8 } },
      /*#__PURE__*/React.createElement("button", {
        onClick: () => handleSabrinaResponse(activeSabrinaPrompt, true),
        style: { flex: 1, background: "rgba(74,222,128,.15)", border: "1px solid rgba(74,222,128,.3)", borderRadius: 8, padding: "8px 0", color: "#4ade80", fontWeight: 700, fontSize: 12, cursor: "pointer" }
      }, "Yes, same meal"),
      /*#__PURE__*/React.createElement("button", {
        onClick: () => handleSabrinaResponse(activeSabrinaPrompt, false),
        style: { flex: 1, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "8px 0", color: "var(--text-secondary)", fontWeight: 700, fontSize: 12, cursor: "pointer" }
      }, "No, I\u2019ll log mine")
    )
  ),

  /* ── Macro target generation ── */
  !macroTargets && !generatingTargets && !window.__claude_api_key && /*#__PURE__*/React.createElement("div", {
    style: { background: "rgba(244,168,35,.07)", border: "1px solid rgba(244,168,35,.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#f4a823" }
  }, "Add your Claude API key in Settings to get personalised macro targets."),
  generatingTargets && /*#__PURE__*/React.createElement("div", { style: { textAlign: "center", color: "var(--text-muted)", fontSize: 12, marginBottom: 12 } }, "Calculating your macro targets\u2026"),
  macroTargets?.rationale && subTab === "log" && /*#__PURE__*/React.createElement("p", {
    style: { fontSize: 11, color: "var(--text-muted)", marginBottom: 12, lineHeight: 1.5 }
  }, "\uD83E\uDD16 ", macroTargets.rationale, " ",
    /*#__PURE__*/React.createElement("button", {
      onClick: () => generateMacroTargets(settings?.currentWeight),
      style: { background: "transparent", border: "none", color: "#a78bfa", fontSize: 11, cursor: "pointer", padding: 0, textDecoration: "underline" }
    }, "Recalculate")
  ),

  /* ── LOG sub-tab ── */
  subTab === "log" && /*#__PURE__*/React.createElement("div", null,
    ["breakfast", "lunch", "dinner"].map(slot => {
      const logged = mealLog[slot];
      const planned = weekPlan[today + "_" + slot] || weekPlan[slot];
      return /*#__PURE__*/React.createElement("div", {
        key: slot,
        onClick: () => setOpenSlot(slot),
        style: { background: "rgba(255,255,255,.04)", border: `1px solid ${logged ? "rgba(74,222,128,.25)" : "rgba(255,255,255,.08)"}`, borderRadius: 12, padding: "13px 15px", marginBottom: 10, cursor: "pointer" }
      },
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: logged ? 6 : 0 } },
          /*#__PURE__*/React.createElement("span", { style: { fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, color: logged ? "#4ade80" : "var(--text-secondary)", letterSpacing: ".06em", textTransform: "uppercase" } }, slot),
          logged
            ? /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "#4ade80", fontWeight: 700 } }, logged.calories + " cal")
            : /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)" } }, "tap to log \u203A")
        ),
        logged && /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 13, color: "var(--text-primary)", fontWeight: 500, margin: "0 0 3px" } }, logged.name),
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: "0 0 2px" } }, logged.protein + "g P \xB7 " + logged.carbs + "g C \xB7 " + logged.fat + "g F"),
          logged.plannedMeal && logged.plannedMeal !== logged.name && /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: 0 } }, "Planned: ", /*#__PURE__*/React.createElement("span", { style: { textDecoration: "line-through" } }, logged.plannedMeal))
        ),
        !logged && planned && /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: "4px 0 0" } }, "Planned: ", planned.name || planned)
      );
    }),

    /* Snacks section */
    /*#__PURE__*/React.createElement("div", { style: { marginTop: 18 } },
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
        /*#__PURE__*/React.createElement("span", { style: { fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: "var(--text-secondary)", letterSpacing: ".06em" } }, "SNACKS"),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => setOpenSlot("snack"),
          style: { background: "rgba(251,146,60,.12)", border: "1px solid rgba(251,146,60,.25)", borderRadius: 8, padding: "5px 12px", fontSize: 10, color: "#fb923c", fontWeight: 700, cursor: "pointer" }
        }, "+ Add Snack")
      ),
      (mealLog.snacks || []).length === 0 && /*#__PURE__*/React.createElement("p", { style: { fontSize: 12, color: "var(--text-muted)", textAlign: "center", padding: "12px 0" } }, "No snacks logged"),
      (mealLog.snacks || []).map((s, i) => /*#__PURE__*/React.createElement("div", {
        key: s.id || i,
        style: { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: "10px 13px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }
      },
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 13, color: "var(--text-primary)", margin: "0 0 2px", fontWeight: 500 } }, s.name),
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: 0 } }, s.timestamp ? new Date(s.timestamp).toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" }) : "")
        ),
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, color: "#fb923c", fontWeight: 700 } }, s.calories + " cal")
      ))
    )
  ),

  /* ── PLAN sub-tab ── */
  subTab === "plan" && /*#__PURE__*/React.createElement(WeekPlanTab, {
    plan: weekPlan,
    setPlan: async p => {
      setWeekPlan(p);
      await DB.set(KEYS.weekPlan(sunKey), p);
    },
    allMeals: allMeals,
    pantryItems: pantryItems,
    cookedMeals: cookedMeals,
    onCookMeal: handleCookMeal
  }), subTab === "library" && /*#__PURE__*/React.createElement(LibraryTab, {
    customMeals: customMeals,
    onAddMeal: async m => {
      const u = [...customMeals, m];
      setCustomMeals(u);
      await DB.set(KEYS.customMeals(), u);
    },
    onDeleteCustom: async id => {
      const u = customMeals.filter(m => m.id !== id);
      setCustomMeals(u);
      await DB.set(KEYS.customMeals(), u);
    },
    pantryItems: pantryItems
  }), subTab === "grocery" && /*#__PURE__*/React.createElement(GroceryTab, {
    plan: weekPlan,
    checked: checkedItems,
    setChecked: async c => {
      setCheckedItems(c);
      await DB.set(KEYS.groceryCheck(sunKey), c);
    }
  }),

  /* MealLogChat modal */
  openSlot && /*#__PURE__*/React.createElement(MealLogChat, {
    slot: openSlot,
    date: today,
    existing: openSlot === "snack" ? null : mealLog[openSlot],
    mealLibrary: mealLibrary,
    userName: isPartner ? partnerName : userName,
    onSave: meal => handleSlotSave(openSlot, meal),
    onClose: () => setOpenSlot(null)
  }));
}

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
        border: "1px solid " + (isToday ? "rgba(167,139,250,.5)" : hasLog ? "rgba(74,222,128,.25)" : "rgba(255,255,255,.05)"),
        background: isToday ? "rgba(167,139,250,.15)" : hasLog ? "rgba(74,222,128,.07)" : "rgba(255,255,255,.02)",
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
        color: isToday ? "#a78bfa" : hasLog ? "#4ade80" : "var(--text-muted)",
        fontSize: 11,
        fontWeight: isToday || hasLog ? 800 : 400,
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
        background: hasMorning ? "#f4a823" : "var(--card-border-2)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: hasEvening ? "#60a5fa" : "var(--card-border-2)"
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

// ─────────────────────────────────────────────────────────────────────────────
// FINANCE TAB — envelope budgeting, CSV import, rollover
// ─────────────────────────────────────────────────────────────────────────────

// Sub-category options per envelope — derived from 2 years of transaction history
const SUBCATEGORY_OPTIONS = {
  food_drink:     ["Coffee", "Fast Food", "Restaurant", "Grocery", "Alcohol", "Catering", "Entertaining", "Hosting", "Meal Kit", "Gift"],
  household:      ["Costco", "Home & Garden", "TJX", "Dollarama", "Walmart", "Electronics", "Medical", "Water Softener", "Makeup", "Gift", "Tax"],
  transportation: ["Gas", "Parking", "Go Transit", "Uber", "Car Payment", "Repair", "Licences", "Toll"],
  subscriptions:  ["Phone Bill", "Internet", "Insurance", "Netflix", "Spotify", "Credit Card", "Google", "YouTube", "Playstation", "ChatGPT", "Meal Prep", "Learning"],
  clothing:       ["TJX", "Shoes", "Makeup", "Dry Cleaning", "Online"],
  amazon:         ["Household", "Clothing", "Electronics", "Medical", "Gift", "Home & Garden"],
  entertainment:  ["Concert", "Movies", "Golf", "Electronics", "Catering", "Entertaining", "Event", "Alcohol"],
  health:         ["Medical", "Pharmacy", "Massage", "Insurance", "Makeup"],
  travel:         ["Hotel", "Flights", "Food & Drink", "Alcohol", "Gift", "Activities"],
  alcohol:        ["Alcohol", "Beer", "Wine", "Spirits"],
  weed:           ["Weed"],
  gifts:          ["Present", "Gift Cards", "Food & Drink", "Catering"],
  yugioh:         ["Singles", "Packs", "Tournament", "Accessories"],
  learning:       ["Online Course", "Professional", "Books"],
  work_expense:   ["Restaurant", "Catering", "Tolls", "Supplies"],
  other:          ["General"]
};

// Dropdown component for sub-categories — shows list per envelope + "＋ Add new..." option
function SubCatSelect({ envelopeId, value, onChange, extraOpts, onAdd, style }) {
  const [adding, setAdding] = React.useState(false);
  const [newVal, setNewVal] = React.useState("");

  const baseOpts = SUBCATEGORY_OPTIONS[envelopeId] || [];
  const custom = extraOpts || [];
  const all = [...new Set([...baseOpts, ...custom])].sort((a, b) => a.localeCompare(b));

  const inputStyle = { background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 7, padding: "8px 10px", color: "var(--text-primary)", fontSize: 12, outline: "none", colorScheme: "dark" };

  if (adding) {
    return /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6 } },
      /*#__PURE__*/React.createElement("input", { autoFocus: true, value: newVal, onChange: e => setNewVal(e.target.value), placeholder: "New sub-category", onKeyDown: e => { if (e.key === "Enter" && newVal.trim()) { onAdd && onAdd(newVal.trim()); onChange(newVal.trim()); setAdding(false); setNewVal(""); } if (e.key === "Escape") { setAdding(false); setNewVal(""); } }, style: { ...inputStyle, flex: 1 } }),
      /*#__PURE__*/React.createElement("button", { onClick: () => { if (newVal.trim()) { onAdd && onAdd(newVal.trim()); onChange(newVal.trim()); } setAdding(false); setNewVal(""); }, style: { padding: "7px 12px", background: "#a78bfa", border: "none", borderRadius: 7, color: "#080b11", fontWeight: 800, fontSize: 12, cursor: "pointer" } }, "✓"),
      /*#__PURE__*/React.createElement("button", { onClick: () => { setAdding(false); setNewVal(""); }, style: { padding: "7px 10px", background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, color: "var(--text-muted)", fontSize: 12, cursor: "pointer" } }, "✕")
    );
  }

  return /*#__PURE__*/React.createElement("select", {
    value: value || "",
    onChange: e => { if (e.target.value === "__add__") { setAdding(true); } else { onChange(e.target.value); } },
    style: { ...inputStyle, width: "100%", ...(style || {}) }
  },
    /*#__PURE__*/React.createElement("option", { value: "" }, "— none —"),
    all.map(s => /*#__PURE__*/React.createElement("option", { key: s, value: s }, s)),
    /*#__PURE__*/React.createElement("option", { value: "__add__" }, "＋ Add new...")
  );
}

// Pre-seeded merchant rules derived from 2 years of historical spending data
const MERCHANT_RULES_SEED = [
  { id:"mr_001", keyword:"lcbo",                  displayName:"LCBO",                   envelopeId:"alcohol",        subCat:"Alcohol" },
  { id:"mr_002", keyword:"the beer store",         displayName:"The Beer Store",         envelopeId:"alcohol",        subCat:"Alcohol" },
  { id:"mr_003", keyword:"tim hortons",            displayName:"Tim Hortons",            envelopeId:"food_drink",     subCat:"Coffee" },
  { id:"mr_004", keyword:"starbucks",              displayName:"Starbucks",              envelopeId:"food_drink",     subCat:"Coffee" },
  { id:"mr_005", keyword:"costco wholesale",       displayName:"Costco Wholesale",       envelopeId:"household",      subCat:"Costco" },
  { id:"mr_006", keyword:"costco gas",             displayName:"Costco Gas",             envelopeId:"transportation", subCat:"Gas" },
  { id:"mr_007", keyword:"winners",                displayName:"Winners",                envelopeId:"clothing",       subCat:"TJX" },
  { id:"mr_008", keyword:"marshalls",              displayName:"Marshalls",              envelopeId:"clothing",       subCat:"TJX" },
  { id:"mr_009", keyword:"homesense",              displayName:"HomeSense",              envelopeId:"household",      subCat:"TJX" },
  { id:"mr_010", keyword:"spotify",                displayName:"Spotify",                envelopeId:"subscriptions",  subCat:"Spotify" },
  { id:"mr_011", keyword:"netflix",                displayName:"Netflix",                envelopeId:"subscriptions",  subCat:"Netflix" },
  { id:"mr_012", keyword:"fido mobile",            displayName:"Fido Mobile",            envelopeId:"subscriptions",  subCat:"Phone Bill" },
  { id:"mr_013", keyword:"bell canada",            displayName:"Bell Canada",            envelopeId:"subscriptions",  subCat:"Internet" },
  { id:"mr_014", keyword:"wendy",                  displayName:"Wendy's",                envelopeId:"food_drink",     subCat:"Fast Food" },
  { id:"mr_015", keyword:"uber eats",              displayName:"Uber Eats",              envelopeId:"food_drink",     subCat:"Fast Food" },
  { id:"mr_016", keyword:"doordash",               displayName:"DoorDash",               envelopeId:"food_drink",     subCat:"Fast Food" },
  { id:"mr_017", keyword:"skip the dishes",        displayName:"SkipTheDishes",          envelopeId:"food_drink",     subCat:"Fast Food" },
  { id:"mr_018", keyword:"mcdonald",               displayName:"McDonald's",             envelopeId:"food_drink",     subCat:"Fast Food" },
  { id:"mr_019", keyword:"subway",                 displayName:"Subway",                 envelopeId:"food_drink",     subCat:"Fast Food" },
  { id:"mr_020", keyword:"domino",                 displayName:"Domino's Pizza",         envelopeId:"food_drink",     subCat:"Fast Food" },
  { id:"mr_021", keyword:"harvey",                 displayName:"Harvey's",               envelopeId:"food_drink",     subCat:"Fast Food" },
  { id:"mr_022", keyword:"esso circle k",          displayName:"Esso Circle K",          envelopeId:"transportation", subCat:"Gas" },
  { id:"mr_023", keyword:"canadian tire gas",      displayName:"Canadian Tire Gas Bar",  envelopeId:"transportation", subCat:"Gas" },
  { id:"mr_024", keyword:"petro-canada",           displayName:"Petro-Canada",           envelopeId:"transportation", subCat:"Gas" },
  { id:"mr_025", keyword:"shell",                  displayName:"Shell Gas",              envelopeId:"transportation", subCat:"Gas" },
  { id:"mr_026", keyword:"presto",                 displayName:"Presto",                 envelopeId:"transportation", subCat:"Go Transit" },
  { id:"mr_027", keyword:"uber",                   displayName:"Uber",                   envelopeId:"transportation", subCat:"Uber" },
  { id:"mr_028", keyword:"shoppers drug mart",     displayName:"Shoppers Drug Mart",     envelopeId:"health",         subCat:"Pharmacy" },
  { id:"mr_029", keyword:"shein",                  displayName:"Shein",                  envelopeId:"clothing",       subCat:"Online" },
  { id:"mr_030", keyword:"foodland",               displayName:"Foodland",               envelopeId:"food_drink",     subCat:"Grocery" },
  { id:"mr_031", keyword:"wal-mart",               displayName:"Walmart",                envelopeId:"food_drink",     subCat:"Groceries" },
  { id:"mr_032", keyword:"walmart",                displayName:"Walmart",                envelopeId:"food_drink",     subCat:"Groceries" },
  { id:"mr_033", keyword:"chefs plate",            displayName:"Chef's Plate",           envelopeId:"food_drink",     subCat:"Meal Kit" },
  { id:"mr_034", keyword:"hello fresh",            displayName:"HelloFresh",             envelopeId:"food_drink",     subCat:"Meal Kit" },
  { id:"mr_035", keyword:"dragon world",           displayName:"Dragon World Card Games",envelopeId:"yugioh",         subCat:"" },
  { id:"mr_036", keyword:"security national",      displayName:"Security National Insurance", envelopeId:"subscriptions", subCat:"Insurance" },
  { id:"mr_037", keyword:"google *youtube",        displayName:"YouTube Premium",        envelopeId:"subscriptions",  subCat:"YouTube" },
  { id:"mr_038", keyword:"google *google",         displayName:"Google One",             envelopeId:"subscriptions",  subCat:"Google" },
  { id:"mr_039", keyword:"apple.com/bill",         displayName:"Apple Subscription",     envelopeId:"subscriptions",  subCat:"Apple" },
  { id:"mr_040", keyword:"membership fee installmen", displayName:"Credit Card Membership Fee", envelopeId:"subscriptions", subCat:"Credit Card" },
  { id:"mr_041", keyword:"dollarama",              displayName:"Dollarama",              envelopeId:"household",      subCat:"Home & Garden" },
  { id:"mr_042", keyword:"no frills",              displayName:"No Frills",              envelopeId:"food_drink",     subCat:"Grocery" },
  { id:"mr_043", keyword:"metro",                  displayName:"Metro",                  envelopeId:"food_drink",     subCat:"Grocery" },
  { id:"mr_044", keyword:"sobeys",                 displayName:"Sobeys",                 envelopeId:"food_drink",     subCat:"Grocery" },
  { id:"mr_045", keyword:"loblaws",                displayName:"Loblaws",                envelopeId:"food_drink",     subCat:"Grocery" },
  { id:"mr_046", keyword:"real canadian",          displayName:"Real Canadian Superstore",envelopeId:"food_drink",    subCat:"Grocery" },
  { id:"mr_047", keyword:"circle k",               displayName:"Circle K",               envelopeId:"transportation", subCat:"Gas" },
];

// Returns { isVague: bool } — true if description looks like a numbered company (no real name)
function isVagueMerchant(desc) {
  const d = desc.toUpperCase();
  return /^\d{4,}/.test(d.trim()) || /\b(INC|LTD|CORP|CO\.?)\b/.test(d) || /^[A-Z]{2,4}\s*\d{5,}/.test(d.trim());
}

// Extracts a clean display name from a raw statement description
function extractMerchantName(raw) {
  return raw
    .replace(/\s+\d{3,}.*$/, "")           // strip trailing numbers and everything after
    .replace(/\s+(ON|CA|QC|BC|AB)\s*$/, "")// strip province codes
    .replace(/\s*#\d+.*$/, "")              // strip store numbers
    .replace(/\*[A-Z0-9]+$/, "")           // strip transaction codes
    .replace(/\s{2,}/g, " ")               // collapse spaces
    .trim()
    .split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

// Deterministic transaction ID — same content always produces the same ID
// Prevents duplicates when re-importing the same CSV or overlapping date ranges
function txnId(prefix, date, amount, desc) {
  const raw = `${prefix}|${date}|${String(amount)}|${(desc || "").toLowerCase().trim().replace(/\s+/g, " ")}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) { h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0; }
  return `${prefix}_${Math.abs(h).toString(36)}`;
}

// Apply merchant rules to a list of transactions, returns augmented list
function applyMerchantRules(transactions, rules) {
  return transactions.map(t => {
    const descLower = (t.desc || "").toLowerCase();
    const match = rules.find(r => r.keyword && descLower.includes(r.keyword.toLowerCase()));
    if (match) {
      return { ...t, envelopeId: match.envelopeId, subCat: match.subCat || t.subCat || "", _ruleApplied: match.id };
    }
    return t;
  });
}

// Default envelope categories derived from actual spending data
const FINANCE_ENVELOPES_DEFAULT = [
  { id: "food_drink",      name: "Food & Drink",      color: "#fb923c", icon: "🍽", highlevel: "Food"          },
  { id: "household",       name: "Household",         color: "#60a5fa", icon: "🏠", highlevel: "Household"     },
  { id: "transportation",  name: "Transportation",    color: "#f4a823", icon: "🚗", highlevel: "Transportation" },
  { id: "subscriptions",   name: "Subscriptions",     color: "#a78bfa", icon: "📱", highlevel: "Reoccuring Bills" },
  { id: "clothing",        name: "Clothing",          color: "#ec4899", icon: "👗", highlevel: "Leisure"       },
  { id: "amazon",          name: "Amazon",            color: "#f97316", icon: "📦", highlevel: "Household"     },
  { id: "entertainment",   name: "Entertainment",     color: "#8b5cf6", icon: "🎬", highlevel: "Leisure"       },
  { id: "health",          name: "Health",            color: "#4ade80", icon: "💊", highlevel: "Household"     },
  { id: "travel",          name: "Travel",            color: "#06b6d4", icon: "✈️",  highlevel: "Leisure"      },
  { id: "alcohol",         name: "Alcohol",           color: "#ef4444", icon: "🍺", highlevel: "Leisure"       },
  { id: "weed",            name: "Weed",              color: "#22c55e", icon: "🌿", highlevel: "Leisure"       },
  { id: "gifts",           name: "Gifts",             color: "#f43f5e", icon: "🎁", highlevel: "Leisure"       },
  { id: "yugioh",          name: "Yugioh / TCG",      color: "#eab308", icon: "🃏", highlevel: "Leisure"       },
  { id: "learning",        name: "Learning",          color: "#34d399", icon: "📚", highlevel: "Household"     },
  { id: "work_expense",    name: "Work Expense",      color: "#64748b", icon: "💼", highlevel: "Household"     },
  { id: "other",           name: "Other",             color: "#6b7280", icon: "📋", highlevel: ""              }
];

// Map CSV Category column → envelope id
const CSV_CATEGORY_MAP = {
  "food & drink": "food_drink",
  "household":    "household",
  "transportation":"transportation",
  "subscription": "subscriptions",
  "reoccuring bills":"subscriptions",
  "clothing":     "clothing",
  "amazon":       "amazon",
  "entertainment":"entertainment",
  "health":       "health",
  "travel":       "travel",
  "alcohol":      "alcohol",
  "weed":         "weed",
  "gift":         "gifts",
  "gift cards":   "gifts",
  "yugioh":       "yugioh",
  "learning":     "learning",
  "work expense": "work_expense",
  "payment":      null, // ignore — credit card payments
  "azai":         "other",
  "baby":         "household"
};

// Parse the CSV format: Date,Credit Card,Amount,Category,Sub Category,Description,Highlevel
function parseFinanceCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  const txns = [];
  for (let i = 1; i < lines.length; i++) {
    // Handle commas inside quoted fields
    const cols = [];
    let cur = "", inQ = false;
    for (const ch of lines[i]) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    cols.push(cur.trim());

    const [dateRaw, card, amtRaw, catRaw, subCat, desc, highlevel] = cols;
    if (!dateRaw || !amtRaw) continue;

    // Parse amount — strip $, handle negatives (refunds)
    const amtStr = (amtRaw || "").replace(/[$,\s"]/g, "");
    const amount = parseFloat(amtStr);
    if (isNaN(amount)) continue;

    // Parse date MM-DD-YYYY or MM/DD/YYYY
    const dateParts = dateRaw.replace(/\//g, "-").split("-");
    let isoDate = "";
    if (dateParts.length === 3) {
      const [m, d, y] = dateParts;
      isoDate = `${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`;
    }
    if (!isoDate) continue;

    const cat = (catRaw || "").trim();
    const envId = CSV_CATEGORY_MAP[cat.toLowerCase()] ?? "other";
    if (envId === null) continue; // skip payment rows

    txns.push({
      id: `t_${isoDate}_${i}`,
      date: isoDate,
      month: isoDate.slice(0, 7),
      card: (card || "").trim(),
      amount,
      isRefund: amount < 0,
      category: cat,
      subCat: (subCat || "").trim(),
      desc: (desc || "").trim(),
      highlevel: (highlevel || "").trim(),
      envelopeId: envId
    });
  }
  return txns;
}

// FinanceTab component
function FinanceTab({ settings }) {
  const [view, setView] = useState("envelopes"); // envelopes | transactions | summary | import
  const [currentMonth, setCurrentMonth] = useState(() => getToday().slice(0, 7));
  const [envelopes, setEnvelopes] = useState([]); // [{ ...default, allocated: 0 }]
  const [transactions, setTransactions] = useState([]);
  const [rolloverIn, setRolloverIn] = useState({});
  const [allMonths, setAllMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const [editingEnvelope, setEditingEnvelope] = useState(null);
  const [drillEnvelope, setDrillEnvelope] = useState(null); // envelope id being drilled into
  const [txnFilter, setTxnFilter] = useState({ card: "", envelopeId: "", sort: "date_desc" });
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [showAddTxn, setShowAddTxn] = useState(false);
  const [addTxnForm, setAddTxnForm] = useState({ date: getToday(), amount: "", desc: "", card: "Amex", envelopeId: "food_drink", subCat: "" });
  const [editingTxn, setEditingTxn] = useState(null);
  const [income, setIncome] = useState([]);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [addIncomeForm, setAddIncomeForm] = useState({ date: getToday(), amount: "", source: "Salary", type: "salary" });
  const [importMode, setImportMode] = useState("credit_card"); // "credit_card" | "bank_statement"
  const [cardParsing, setCardParsing] = useState(false);
  const [cardResults, setCardResults] = useState(null);
  const [deduping, setDeduping] = useState(false);
  const [merchantRules, setMerchantRules] = useState(MERCHANT_RULES_SEED);
  const [showRulesTable, setShowRulesTable] = useState(false);
  const [rulePrompt, setRulePrompt] = useState(null); // {txn, suggestedName, envelopeId, subCat}
  const [ruleForm, setRuleForm] = useState({ keyword: "", displayName: "", envelopeId: "food_drink", subCat: "" });
  const [vaguePrompt, setVaguePrompt] = useState(null); // {txn, suggestions: [{label, envelopeId, subCat}]}
  const [editTxnForm, setEditTxnForm] = useState({ envelopeId: "other", subCat: "" });
  const [customSubCats, setCustomSubCats] = useState({});
  const [coachReport, setCoachReport] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const fileRef = useRef(null);
  const scanRef = useRef(null);
  const cardFileRef = useRef(null);

  const loadMonth = useCallback(async (month) => {
    setLoading(true);
    const saved = await DB.get(KEYS.financeEnvelopes(month));
    const txns = await DB.get(KEYS.financeTransactions(month));
    const rollover = await DB.get(KEYS.financeRollover(month));
    const months = await DB.get(KEYS.financeAllMonths());

    // If this month has no saved allocations, fall back to the default budget template
    const defaultEnvs = (!saved || !saved.length) ? (await DB.get(KEYS.financeDefaultEnvelopes()) || []) : [];
    const sourceEnvs = (saved && saved.length) ? saved : defaultEnvs;
    const baseEnvelopes = FINANCE_ENVELOPES_DEFAULT.map(def => {
      const s = sourceEnvs.find(e => e.id === def.id);
      return { ...def, allocated: s?.allocated ?? 0 };
    });
    const incomeData = await DB.get(KEYS.financeIncome(month));
    const rulesData = await DB.get(KEYS.merchantRules());
    const customSubData = await DB.get(KEYS.customSubCats());
    setEnvelopes(baseEnvelopes);
    setTransactions(Array.isArray(txns) ? txns : []);
    setRolloverIn(rollover || {});
    setAllMonths(Array.isArray(months) ? months : []);
    setIncome(Array.isArray(incomeData) ? incomeData : []);
    setMerchantRules(Array.isArray(rulesData) && rulesData.length ? rulesData : MERCHANT_RULES_SEED);
    setCustomSubCats(customSubData && typeof customSubData === "object" ? customSubData : {});
    setLoading(false);
  }, []);

  useEffect(() => { loadMonth(currentMonth); }, [currentMonth, loadMonth]);

  const saveEnvelopes = async (updated) => {
    setEnvelopes(updated);
    await DB.set(KEYS.financeEnvelopes(currentMonth), updated);
  };

  const setDefaultBudget = async () => {
    await DB.set(KEYS.financeDefaultEnvelopes(), envelopes);
    setImportMsg("Default budget saved — all months without a custom budget will now use these values.");
  };

  const handleImportCSV = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportMsg("Parsing...");
    try {
      const text = await file.text();
      const parsed = parseFinanceCSV(text);
      // Group by month
      const byMonth = {};
      parsed.forEach(t => {
        if (!byMonth[t.month]) byMonth[t.month] = [];
        byMonth[t.month].push(t);
      });
      // Save each month's transactions
      const monthList = Object.keys(byMonth).sort();
      for (const m of monthList) {
        const existing = await DB.get(KEYS.financeTransactions(m)) || [];
        // Merge — deduplicate by id
        const existingIds = new Set(existing.map(t => t.id));
        const newTxns = byMonth[m].filter(t => !existingIds.has(t.id));
        await DB.set(KEYS.financeTransactions(m), [...existing, ...newTxns]);
      }
      await DB.set(KEYS.financeAllMonths(), monthList);
      setAllMonths(monthList);
      // Reload current month
      const curTxns = await DB.get(KEYS.financeTransactions(currentMonth));
      setTransactions(Array.isArray(curTxns) ? curTxns : []);
      setImportMsg(`Imported ${parsed.length} transactions across ${monthList.length} months.`);
      setView("transactions");
    } catch(err) {
      setImportMsg("Import failed: " + err.message);
    }
    setImporting(false);
    // Only auto-clear success messages — errors stay until dismissed
    setTimeout(() => setImportMsg(m => m.startsWith("Import") ? "" : m), 8000);
  };

  const handleScanStatement = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true); setScanResults(null); setImportMsg("");
    try {
      const base64 = await new Promise(resolve => { const r = new FileReader(); r.onload = () => resolve(r.result.split(",")[1]); r.readAsDataURL(file); });
      const mediaType = file.type || "image/jpeg";
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 45000);
      const res = await fetch("/api/claude", {
        method: "POST", signal: controller.signal,
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 2000, messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Extract all purchase transactions from this credit card statement. Ignore payment/balance rows.\nReturn ONLY a JSON array, no markdown:\n[{\"date\":\"YYYY-MM-DD\",\"amount\":45.99,\"desc\":\"MERCHANT\",\"card\":\"Amex\"}]\namount: positive number. card: Amex, TD Visa, CIBC, PC Financial, or Unknown." }
        ]}] })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "";
      const match = reply.match(/\[[\s\S]*\]/);
      if (!match) { setImportMsg("No transactions found — try a clearer screenshot."); setScanning(false); return; }
      const txns = JSON.parse(match[0]);
      setScanResults(txns.map(t => ({ ...t, month: (t.date || "").slice(0, 7), id: txnId("scan", t.date, t.amount, t.desc), isRefund: false, category: "Scanned", subCat: "", highlevel: "", envelopeId: CSS_CATEGORY_MAP[t.desc?.toLowerCase()] || "other" })));
    } catch(err) {
      setImportMsg(err.name === "AbortError" ? "Scan timed out — try a smaller/clearer image." : "Scan failed: " + err.message);
    }
    setScanning(false);
    if (scanRef.current) scanRef.current.value = "";
  };

  const confirmScan = async () => {
    if (!scanResults?.length) return;
    const byMonth = {};
    scanResults.forEach(t => { if (!byMonth[t.month]) byMonth[t.month] = []; byMonth[t.month].push(t); });
    for (const m of Object.keys(byMonth)) {
      const existing = await DB.get(KEYS.financeTransactions(m)) || [];
      const ids = new Set(existing.map(t => t.id));
      await DB.set(KEYS.financeTransactions(m), [...existing, ...byMonth[m].filter(t => !ids.has(t.id))]);
    }
    const months = [...new Set([...allMonths, ...Object.keys(byMonth)])].sort();
    await DB.set(KEYS.financeAllMonths(), months); setAllMonths(months);
    setScanResults(null); await loadMonth(currentMonth);
    setImportMsg(`Added ${scanResults.length} transactions from screenshot.`); setView("transactions");
  };

  // Parse a month string like "02 Apr. 2026" → "2026-04-02"
  const parseAmexDate = raw => {
    if (!raw) return "";
    const MONTHS = { "jan":1,"feb":2,"mar":3,"apr":4,"may":5,"jun":6,"jul":7,"aug":8,"sep":9,"oct":10,"nov":11,"dec":12 };
    const parts = String(raw).trim().split(/\s+/);
    if (parts.length < 3) return "";
    const day = parts[0].padStart(2, "0");
    const mon = String(MONTHS[parts[1].toLowerCase().replace(/\./g, "")] || 0).padStart(2, "0");
    const yr = parts[2];
    return mon && yr ? `${yr}-${mon}-${day}` : "";
  };

  // Convert an XLSX file to CSV text Claude can read, detecting the header row automatically
  const xlsxToCsvText = async (file) => {
    if (!window.XLSX) throw new Error("XLSX library not loaded — refresh the page.");
    const buffer = await file.arrayBuffer();
    const wb = window.XLSX.read(new Uint8Array(buffer), { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = window.XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    // Find header row: first row where any cell equals "Date" or "Description"
    let headerIdx = rows.findIndex(r => r.some(c => /^date$/i.test(String(c).trim())));
    if (headerIdx < 0) headerIdx = 11; // Amex default fallback

    const headerRow = rows[headerIdx];
    const dateCol   = headerRow.findIndex(c => /^date$/i.test(String(c).trim()));
    const descCol   = headerRow.findIndex(c => /desc|description|merchant/i.test(String(c).trim()));
    const amtCol    = headerRow.findIndex(c => /^amount$/i.test(String(c).trim()));

    const csvRows = [
      ["Date","Description","Amount"],
      ...rows.slice(headerIdx + 1)
        .filter(r => r[dateCol] && r[amtCol]) // skip blank/summary rows
        .map(r => {
          const rawDate = String(r[dateCol] || "").trim();
          // Handle both "02 Apr. 2026" (Amex) and standard date objects/strings
          const date = /[a-zA-Z]/.test(rawDate) ? parseAmexDate(rawDate) : rawDate;
          const rawAmt = String(r[amtCol] || "").replace(/[$,]/g, "");
          const amount = parseFloat(rawAmt) || 0;
          const desc = String(r[descCol] || "").trim();
          return [date, desc, amount];
        })
        .filter(r => r[0] && r[2] > 0) // must have a valid date and positive amount
    ];

    return csvRows.map(r => r.map(c => {
      const s = String(c).replace(/"/g, '""');
      return String(c).includes(",") ? `"${s}"` : s;
    }).join(",")).join("\n");
  };

  // Detect CIBC CSV format: no header row, cols = [Date YYYY-MM-DD, Desc, Debit, Credit, CardNum]
  const isCibcFormat = (text) => {
    const firstLine = text.split(/\r?\n/).find(l => l.trim());
    if (!firstLine) return false;
    // First cell must be a YYYY-MM-DD date and last cell must contain * (masked card number)
    return /^\d{4}-\d{2}-\d{2},/.test(firstLine.trim()) && /\*/.test(firstLine);
  };

  // Normalise CIBC CSV to standard Date,Description,Amount CSV for Claude
  const parseCibcCsv = (text) => {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const csvRows = [["Date", "Description", "Amount"]];
    for (const line of lines) {
      // Manual CSV parse to handle quoted description fields
      const cols = [];
      let cur = "", inQ = false;
      for (const ch of line) {
        if (ch === '"') { inQ = !inQ; }
        else if (ch === ',' && !inQ) { cols.push(cur); cur = ""; }
        else { cur += ch; }
      }
      cols.push(cur);
      if (cols.length < 3) continue;
      const date = cols[0].trim();
      const desc = cols[1].trim().replace(/^"|"$/g, "");
      const debit  = parseFloat(cols[2]) || 0;
      const credit = parseFloat(cols[3] || "") || 0;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
      if (/payment thank you|paiemen/i.test(desc)) continue;
      if (debit > 0)  csvRows.push([date, desc, debit]);
      else if (credit > 0) csvRows.push([date, "REFUND: " + desc, credit]); // prefix so Claude sets isRefund:true
    }
    return csvRows.map(r => r.map(c => {
      const s = String(c).replace(/"/g, '""');
      return String(c).includes(",") ? `"${s}"` : s;
    }).join(",")).join("\n");
  };

  // Detect TD CSV format: no header, date is MM/DD/YYYY, no masked card number in last col
  const isTdFormat = (text) => {
    const firstLine = text.split(/\r?\n/).find(l => l.trim());
    if (!firstLine) return false;
    return /^\d{2}\/\d{2}\/\d{4},/.test(firstLine.trim());
  };

  // Normalise TD CSV to standard Date,Description,Amount CSV for Claude
  const parseTdCsv = (text) => {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const csvRows = [["Date", "Description", "Amount"]];
    for (const line of lines) {
      const cols = [];
      let cur = "", inQ = false;
      for (const ch of line) {
        if (ch === '"') { inQ = !inQ; }
        else if (ch === ',' && !inQ) { cols.push(cur); cur = ""; }
        else { cur += ch; }
      }
      cols.push(cur);
      if (cols.length < 3) continue;
      const rawDate = cols[0].trim();
      const desc    = cols[1].trim().replace(/^"|"$/g, "");
      const debit   = parseFloat(cols[2]) || 0;
      const credit  = parseFloat(cols[3] || "") || 0;
      // Convert MM/DD/YYYY → YYYY-MM-DD
      const dp = rawDate.split("/");
      if (dp.length !== 3) continue;
      const date = `${dp[2]}-${dp[0].padStart(2,"0")}-${dp[1].padStart(2,"0")}`;
      // Skip inter-card payments (e.g. "CIBC", "PAYMENT", plain bank/card names)
      if (/^(payment|cibc|amex|td|visa payment|mastercard payment|e-transfer)$/i.test(desc.trim())) continue;
      if (debit > 0)  csvRows.push([date, desc, debit]);
      else if (credit > 0) csvRows.push([date, "REFUND: " + desc, credit]);
    }
    return csvRows.map(r => r.map(c => {
      const s = String(c).replace(/"/g, '""');
      return String(c).includes(",") ? `"${s}"` : s;
    }).join(",")).join("\n");
  };

  // Detect CIBC bank statement: starts with YYYY-MM-DD, 4 cols, no masked card * (unlike CIBC CC)
  const isCibcBankFormat = (text) => {
    const firstLine = text.split(/\r?\n/).find(l => l.trim());
    if (!firstLine) return false;
    return /^\d{4}-\d{2}-\d{2},/.test(firstLine.trim()) && !/\*/.test(firstLine);
  };

  // Normalise CIBC bank statement CSV: add header, strip ref numbers, pre-filter CC payments
  const parseCibcBankCsv = (text) => {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const csvRows = [["Date", "Description", "Debit", "Credit"]];
    for (const line of lines) {
      const cols = [];
      let cur = "", inQ = false;
      for (const ch of line) {
        if (ch === '"') { inQ = !inQ; }
        else if (ch === ',' && !inQ) { cols.push(cur); cur = ""; }
        else { cur += ch; }
      }
      cols.push(cur);
      if (cols.length < 3) continue;
      const date  = cols[0].trim();
      const desc  = cols[1].trim().replace(/^"|"$/g, "");
      const debit  = parseFloat(cols[2]) || 0;
      const credit = parseFloat(cols[3] || "") || 0;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
      if (!debit && !credit) continue;
      // Pre-filter CC bill payments — already captured in CC imports
      if (/INTERNET BILL PAY.*(VISA|AMERICAN EXPRESS|AMEX|MASTERCARD)/i.test(desc)) continue;
      // Clean description: strip 10+ digit transaction reference numbers
      const cleanDesc = desc.replace(/\s+\d{10,}\s*/g, " ").replace(/\s{2,}/g, " ").trim();
      csvRows.push([date, cleanDesc, debit || "", credit || ""]);
    }
    return csvRows.map(r => r.map(c => {
      const s = String(c).replace(/"/g, '""');
      return String(c).includes(",") ? `"${s}"` : s;
    }).join(",")).join("\n");
  };

  // Parse our normalised CSV (with header row) into raw row objects — used for stable txnId generation
  const parseNormCsvRows = (csvText) => {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return [];
    const splitLine = line => {
      const cols = []; let cur = "", inQ = false;
      for (const ch of line) {
        if (ch === '"') { inQ = !inQ; }
        else if (ch === ',' && !inQ) { cols.push(cur); cur = ""; }
        else { cur += ch; }
      }
      cols.push(cur);
      return cols.map(c => c.trim().replace(/^"|"$/g, ""));
    };
    const hdr = splitLine(lines[0]);
    const di  = hdr.findIndex(h => /^date$/i.test(h));
    const ni  = hdr.findIndex(h => /^desc/i.test(h));
    const ai  = hdr.findIndex(h => /^amount$/i.test(h));
    const dbi = hdr.findIndex(h => /^debit$/i.test(h));
    const cri = hdr.findIndex(h => /^credit$/i.test(h));
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const c = splitLine(lines[i]);
      const date    = c[di >= 0 ? di : 0] || "";
      const rawDesc = (c[ni >= 0 ? ni : 1] || "").replace(/^REFUND:\s*/i, "");
      const isRefund = (c[ni >= 0 ? ni : 1] || "").toUpperCase().startsWith("REFUND:");
      let amount = 0;
      if (ai >= 0) {
        amount = Math.abs(parseFloat(c[ai]) || 0);
      } else {
        const deb = parseFloat(c[dbi] || "") || 0;
        const cred = parseFloat(c[cri] || "") || 0;
        amount = deb > 0 ? deb : cred;
      }
      if (date && amount > 0) rows.push({ date, rawDesc, amount, isRefund });
    }
    return rows;
  };

  const handleCardCSV = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCardParsing(true); setCardResults(null); setImportMsg("");
    try {
      let text;
      const isXlsx = /\.xlsx?$/i.test(file.name);
      if (isXlsx) {
        text = await xlsxToCsvText(file);
        if (!text || text.split("\n").length < 2) {
          setImportMsg("Could not extract transactions from XLSX — check the file format.");
          setCardParsing(false);
          if (cardFileRef.current) cardFileRef.current.value = "";
          return;
        }
      } else {
        text = await file.text();
        // Auto-detect and normalise known CC formats before sending to Claude
        if (isCibcFormat(text)) {
          text = parseCibcCsv(text);
          if (!text || text.split("\n").length < 2) {
            setImportMsg("Could not extract transactions from CIBC file — check the format.");
            setCardParsing(false);
            if (cardFileRef.current) cardFileRef.current.value = "";
            return;
          }
        } else if (isTdFormat(text)) {
          text = parseTdCsv(text);
          if (!text || text.split("\n").length < 2) {
            setImportMsg("Could not extract transactions from TD file — check the format.");
            setCardParsing(false);
            if (cardFileRef.current) cardFileRef.current.value = "";
            return;
          }
        } else if (isCibcBankFormat(text)) {
          text = parseCibcBankCsv(text);
          if (!text || text.split("\n").length < 2) {
            setImportMsg("Could not extract transactions from bank statement — check the format.");
            setCardParsing(false);
            if (cardFileRef.current) cardFileRef.current.value = "";
            return;
          }
        }
      }
      // Parse our normalised CSV into raw rows — IDs will be built from these, not from Claude output
      const rawRows = parseNormCsvRows(text).slice(0, 300);
      if (!rawRows.length) { setImportMsg("Could not parse any transactions from the file — check the format."); setCardParsing(false); if (cardFileRef.current) cardFileRef.current.value = ""; return; }

      const envelopeList = FINANCE_ENVELOPES_DEFAULT.map(env => `  ${env.id}: ${env.name}`).join("\n");
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 60000);

      // Build a simple numbered list for Claude — categorization only, no extraction needed
      const txnList = rawRows.map((r, i) => `${i}: ${r.date} | ${r.rawDesc}${r.isRefund ? " [REFUND]" : ""} | $${r.amount}`).join("\n");

      let prompt;
      if (importMode === "bank_statement") {
        prompt = `Classify each bank transaction as INCOME, EXPENSE, or SKIP.

INCOME: deposits, e-transfers received, payroll, government benefits (EI/CPP), interest.
EXPENSE: utility bills (hydro, gas, water), mortgage, property tax, insurance, subscriptions billed from bank. Do NOT include credit card payments.
SKIP: credit card bill payments (any row paying Visa/Amex/Mastercard/CIBC/TD), inter-account transfers, service charges/fees.

Transactions:
${txnList}

Return a JSON array — one entry per row, same order, no extras:
[{"idx":0,"type":"INCOME","envelopeId":"","subCat":"","source":"Payroll"}, ...]
- idx: row number from list above
- type: INCOME | EXPENSE | SKIP
- envelopeId: from list below (EXPENSE only, else "")
- source: for INCOME, infer a short source name (e.g. "Ryan Persaud Payroll", "EI Benefit")
- subCat: short sub-category or ""
Envelopes:
${envelopeList}
Return exactly ${rawRows.length} objects. No markdown.`;
      } else {
        prompt = `Categorize each credit card transaction. Do NOT change descriptions or amounts — only assign envelope + subCat.

Transactions:
${txnList}

Return a JSON array — one entry per row, same order:
[{"idx":0,"envelopeId":"food_drink","subCat":"Coffee"}, ...]
- idx: row number from list above
- envelopeId: best match from list below
- subCat: short sub-category (e.g. Coffee, Gas, Grocery) or ""
Envelopes:
${envelopeList}
Return exactly ${rawRows.length} objects. No markdown.`;
      }

      const res = await fetch("/api/claude", {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 8192, messages: [{ role: "user", content: prompt }] })
      });
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch(jsonErr) {
        if (rawText.trim().startsWith("<")) {
          setImportMsg("Error: Netlify function not reachable — ANTHROPIC_API_KEY is probably not set. Go to Netlify \u2192 Site configuration \u2192 Environment variables, add ANTHROPIC_API_KEY, then trigger a redeploy.");
        } else {
          setImportMsg("Error: Unexpected server response — " + rawText.slice(0, 120));
        }
        setCardParsing(false);
        if (cardFileRef.current) cardFileRef.current.value = "";
        return;
      }

      // Surface Netlify / API errors clearly
      if (data.error || data.type === "error") {
        const msg = data.error?.message || data.error || "API error — check that ANTHROPIC_API_KEY is set in Netlify.";
        setImportMsg("Error: " + msg);
        setCardParsing(false);
        if (cardFileRef.current) cardFileRef.current.value = "";
        return;
      }

      const reply = data.content?.[0]?.text || "";
      if (!reply) { setImportMsg("Empty response from Claude — check Netlify ANTHROPIC_API_KEY env var."); setCardParsing(false); if (cardFileRef.current) cardFileRef.current.value = ""; return; }

      // Strip markdown fences from reply (handles both ``` and ```json wrappers)
      const stripFences = str => { const m = str.match(/```(?:json)?\s*([\s\S]*?)```/); return m ? m[1].trim() : str.trim(); };
      const srcLabel = file.name.replace(/\.(csv|xlsx?|txt)$/i, "");

      const cleaned = stripFences(reply);
      const arrMatch = cleaned.match(/\[[\s\S]*\]/);
      if (!arrMatch) { setImportMsg("Could not parse Claude response — " + reply.slice(0, 120)); setCardParsing(false); if (cardFileRef.current) cardFileRef.current.value = ""; return; }
      const cats = JSON.parse(arrMatch[0]);
      // Build a map from idx → category so order mismatches don't matter
      const catMap = {};
      cats.forEach(c => { if (c.idx != null) catMap[c.idx] = c; });

      if (importMode === "bank_statement") {
        const expenses = [], incItems = [];
        rawRows.forEach((r, i) => {
          const cat = catMap[i] || cats[i] || {};
          if (!cat.type || cat.type === "SKIP") return;
          if (cat.type === "INCOME") {
            incItems.push({ id: txnId("binc", r.date, r.amount, r.rawDesc), date: r.date, month: r.date.slice(0, 7), amount: r.amount, source: cat.source || r.rawDesc, type: "other", desc: r.rawDesc });
          } else if (cat.type === "EXPENSE") {
            expenses.push({ date: r.date, amount: r.amount, desc: r.rawDesc, month: r.date.slice(0, 7), id: txnId("bexp", r.date, r.amount, r.rawDesc), card: "Bank", isRefund: false, envelopeId: cat.envelopeId || "other", subCat: cat.subCat || "", category: "Bank", highlevel: "" });
          }
        });
        if (!expenses.length && !incItems.length) { setImportMsg("No transactions classified — try re-importing or check the file format."); setCardParsing(false); if (cardFileRef.current) cardFileRef.current.value = ""; return; }
        setCardResults({ mode: "bank_statement", expenses, income: incItems, label: srcLabel });
      } else {
        const expenses = rawRows.map((r, i) => {
          const cat = catMap[i] || cats[i] || {};
          return { date: r.date, amount: r.amount, desc: r.rawDesc, isRefund: r.isRefund, month: r.date.slice(0, 7), id: txnId("cc", r.date, r.amount, r.rawDesc), card: srcLabel, category: srcLabel, envelopeId: cat.envelopeId || "other", subCat: cat.subCat || "", highlevel: "" };
        });
        if (!expenses.length) { setImportMsg("No transactions found in file."); setCardParsing(false); if (cardFileRef.current) cardFileRef.current.value = ""; return; }
        setCardResults({ mode: "credit_card", expenses, income: [], label: srcLabel });
      }
    } catch(err) {
      setImportMsg(err.name === "AbortError" ? "Timed out — try splitting into smaller date ranges." : "Parse failed: " + err.message);
    }
    setCardParsing(false);
    if (cardFileRef.current) cardFileRef.current.value = "";
  };

  const dedupeAllMonths = async () => {
    setDeduping(true);
    setImportMsg("");
    try {
      const months = await DB.get(KEYS.financeAllMonths()) || [];
      let totalRemoved = 0;
      for (const m of months) {
        // Dedupe transactions
        const txns = await DB.get(KEYS.financeTransactions(m)) || [];
        const seenIds = new Set();
        const clean = txns.filter(t => {
          if (!t.id || seenIds.has(t.id)) return false;
          seenIds.add(t.id); return true;
        });
        if (clean.length < txns.length) {
          totalRemoved += txns.length - clean.length;
          await DB.set(KEYS.financeTransactions(m), clean);
        }
        // Dedupe income
        const inc = await DB.get(KEYS.financeIncome(m)) || [];
        const seenInc = new Set();
        const cleanInc = inc.filter(i => {
          if (!i.id || seenInc.has(i.id)) return false;
          seenInc.add(i.id); return true;
        });
        if (cleanInc.length < inc.length) {
          totalRemoved += inc.length - cleanInc.length;
          await DB.set(KEYS.financeIncome(m), cleanInc);
        }
      }
      setImportMsg(totalRemoved > 0 ? `Removed ${totalRemoved} duplicate${totalRemoved !== 1 ? "s" : ""} across ${months.length} months.` : `No duplicates found across ${months.length} months — all clean.`);
      await loadMonth(currentMonth);
    } catch(err) {
      setImportMsg("Dedup failed: " + err.message);
    }
    setDeduping(false);
  };

  const confirmCardResults = async () => {
    if (!cardResults) return;
    const { expenses = [], income: incItems = [], label = "" } = cardResults;

    // Save expenses (with merchant rules applied)
    if (expenses.length) {
      const ruled = applyMerchantRules(expenses, merchantRules);
      const byMonth = {};
      ruled.forEach(t => { if (!byMonth[t.month]) byMonth[t.month] = []; byMonth[t.month].push(t); });
      for (const m of Object.keys(byMonth)) {
        const existing = await DB.get(KEYS.financeTransactions(m)) || [];
        const ids = new Set(existing.map(t => t.id));
        await DB.set(KEYS.financeTransactions(m), [...existing, ...byMonth[m].filter(t => !ids.has(t.id))]);
      }
      const months = [...new Set([...allMonths, ...Object.keys(byMonth)])].sort();
      await DB.set(KEYS.financeAllMonths(), months); setAllMonths(months);
      const ruleCount = ruled.filter(t => t._ruleApplied).length;
      const msg = `Saved ${ruled.length} expense${ruled.length !== 1 ? "s" : ""}${ruleCount ? " (" + ruleCount + " matched rules)" : ""}`;
      setImportMsg(incItems.length ? msg + " + " + incItems.length + " income entries from " + label + "." : msg + " from " + label + ".");
    }

    // Save income entries
    if (incItems.length) {
      for (const inc of incItems) {
        const m = inc.month;
        if (!m) continue;
        const existing = await DB.get(KEYS.financeIncome(m)) || [];
        const ids = new Set(existing.map(i => i.id));
        if (!ids.has(inc.id)) await DB.set(KEYS.financeIncome(m), [...existing, inc]);
      }
      if (!expenses.length) setImportMsg(`Saved ${incItems.length} income entries from ${label}.`);
    }

    setCardResults(null);
    await loadMonth(currentMonth);
    setView(incItems.length && !expenses.length ? "income" : "transactions");
  };

  const handleEditTxn = async (txn, newEnvelopeId, newSubCat) => {
    const subCatVal = newSubCat !== undefined ? newSubCat : (txn.subCat || "");
    const updated = transactions.map(t => t.id === txn.id ? { ...t, envelopeId: newEnvelopeId, subCat: subCatVal } : t);
    setTransactions(updated);
    await DB.set(KEYS.financeTransactions(currentMonth), updated);
    setEditingTxn(null);
    // Offer rule creation if envelope changed
    if (newEnvelopeId !== txn.envelopeId) {
      const suggestedName = extractMerchantName(txn.desc || "");
      const suggestedKeyword = suggestedName.toLowerCase();
      const alreadyHasRule = merchantRules.some(r => suggestedKeyword.includes(r.keyword.toLowerCase()) || r.keyword.toLowerCase().includes(suggestedKeyword));
      setRuleForm({ keyword: suggestedKeyword, displayName: suggestedName, envelopeId: newEnvelopeId, subCat: subCatVal });
      setRulePrompt({ txn, alreadyHasRule });
    }
  };

  const handleDeleteTxn = async (txn) => {
    const updated = transactions.filter(t => t.id !== txn.id);
    setTransactions(updated);
    await DB.set(KEYS.financeTransactions(txn.month || currentMonth), updated);
    setEditingTxn(null);
  };

  const handleSaveRule = async () => {
    if (!ruleForm.keyword.trim()) return;
    const newRule = { id: "mr_u" + Date.now(), keyword: ruleForm.keyword.trim().toLowerCase(), displayName: ruleForm.displayName.trim() || ruleForm.keyword.trim(), envelopeId: ruleForm.envelopeId, subCat: ruleForm.subCat.trim() };
    const updated = [...merchantRules.filter(r => r.keyword !== newRule.keyword), newRule];
    setMerchantRules(updated);
    await DB.set(KEYS.merchantRules(), updated);
    setRulePrompt(null);
  };

  const handleDeleteRule = async (id) => {
    const updated = merchantRules.filter(r => r.id !== id);
    setMerchantRules(updated);
    await DB.set(KEYS.merchantRules(), updated);
  };

  const handleAddRule = async () => {
    if (!ruleForm.keyword.trim()) return;
    const newRule = { id: "mr_u" + Date.now(), keyword: ruleForm.keyword.trim().toLowerCase(), displayName: ruleForm.displayName.trim() || ruleForm.keyword.trim(), envelopeId: ruleForm.envelopeId, subCat: ruleForm.subCat.trim() };
    const updated = [...merchantRules.filter(r => r.keyword !== newRule.keyword), newRule];
    setMerchantRules(updated);
    await DB.set(KEYS.merchantRules(), updated);
    setRuleForm({ keyword: "", displayName: "", envelopeId: "food_drink", subCat: "" });
  };

  // Build financial context string for Claude.
  // full=false → last 3 months only (for monthly report)
  // full=true  → all available months + all-time summary (for chatbot)
  const buildFinanceContext = async (full = false) => {
    const now = new Date();
    const recentMonths = [0, 1, 2].map(offset => {
      const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      return d.toISOString().slice(0, 7);
    });

    let monthsToLoad = recentMonths;
    if (full) {
      const saved = await DB.get(KEYS.financeAllMonths()) || [];
      monthsToLoad = [...new Set([...saved, ...recentMonths])].sort().reverse(); // newest first
    }

    const monthData = await Promise.all(monthsToLoad.map(async m => {
      const txns = await DB.get(KEYS.financeTransactions(m)) || [];
      const inc  = await DB.get(KEYS.financeIncome(m))       || [];
      const envs = await DB.get(KEYS.financeEnvelopes(m))    || [];
      return { month: m, txns, inc, envs };
    }));

    let ctx = `FINANCIAL DATA — Ryan & Sabrina Persaud\nGenerated: ${getToday()}\n`;
    ctx += `Data range: ${monthsToLoad[monthsToLoad.length - 1]} to ${monthsToLoad[0]} (${monthsToLoad.length} month${monthsToLoad.length !== 1 ? "s" : ""})\n\n`;

    // ── All-time summary (full mode only) ──────────────────────────────
    if (full && monthData.length > 1) {
      const allSpending  = monthData.flatMap(d => d.txns.filter(t => !t.isRefund));
      const allRefunds   = monthData.flatMap(d => d.txns.filter(t => t.isRefund));
      const allIncome    = monthData.flatMap(d => d.inc);
      const grandSpent   = allSpending.reduce((a, t) => a + (t.amount || 0), 0);
      const grandRefunds = allRefunds.reduce((a, t)  => a + (t.amount || 0), 0);
      const grandIncome  = allIncome.reduce((a, i)   => a + (i.amount || 0), 0);
      const grandNet     = grandIncome - (grandSpent - grandRefunds);

      ctx += `=== ALL-TIME SUMMARY (${monthsToLoad.length} months) ===\n`;
      ctx += `Total income: $${grandIncome.toFixed(2)} | Total spent: $${grandSpent.toFixed(2)} | Total refunds: $${grandRefunds.toFixed(2)} | Net: ${grandNet >= 0 ? "+" : ""}$${grandNet.toFixed(2)}\n`;
      ctx += `Monthly averages: income $${(grandIncome / monthsToLoad.length).toFixed(0)} | spent $${(grandSpent / monthsToLoad.length).toFixed(0)}\n`;

      // All-time by envelope
      const allByEnv = {};
      allSpending.forEach(t => { allByEnv[t.envelopeId] = (allByEnv[t.envelopeId] || 0) + (t.amount || 0); });
      const topEnvs = FINANCE_ENVELOPES_DEFAULT.filter(e => allByEnv[e.id]).sort((a, b) => (allByEnv[b.id] || 0) - (allByEnv[a.id] || 0));
      ctx += `All-time by category: ${topEnvs.map(e => e.name + " $" + allByEnv[e.id].toFixed(0)).join(", ")}\n`;

      // All-time top 10 merchants
      const allByMerchant = {};
      allSpending.forEach(t => {
        const key = extractMerchantName(t.desc || t.card || "Unknown");
        allByMerchant[key] = (allByMerchant[key] || 0) + (t.amount || 0);
      });
      const top10 = Object.entries(allByMerchant).sort((a, b) => b[1] - a[1]).slice(0, 10);
      ctx += `All-time top merchants: ${top10.map(([k, v]) => k + " $" + v.toFixed(0)).join(", ")}\n`;

      // Best / worst months by net
      const monthNets = monthData.map(d => {
        const s = d.txns.filter(t => !t.isRefund).reduce((a, t) => a + (t.amount || 0), 0);
        const r = d.txns.filter(t => t.isRefund).reduce((a, t) => a + (t.amount || 0), 0);
        const i = d.inc.reduce((a, x) => a + (x.amount || 0), 0);
        return { month: d.month, net: i - (s - r), spent: s };
      }).filter(x => x.spent > 0);
      if (monthNets.length) {
        const best  = monthNets.reduce((a, b) => b.net > a.net ? b : a);
        const worst = monthNets.reduce((a, b) => b.net < a.net ? b : a);
        ctx += `Best month: ${best.month} (net ${best.net >= 0 ? "+" : ""}$${best.net.toFixed(0)}) | Highest spend month: ${monthNets.reduce((a,b) => b.spent > a.spent ? b : a).month} ($${monthNets.reduce((a,b) => b.spent > a.spent ? b : a).spent.toFixed(0)})\n`;
      }
      ctx += "\n";
    }

    // ── Per-month breakdown ────────────────────────────────────────────
    ctx += "=== MONTHLY BREAKDOWN ===\n";
    for (const { month, txns, inc, envs } of monthData) {
      const spending = txns.filter(t => !t.isRefund);
      const refunds  = txns.filter(t => t.isRefund);
      const totalSpent   = spending.reduce((a, t) => a + (t.amount || 0), 0);
      const totalRefunds = refunds.reduce((a, t)  => a + (t.amount || 0), 0);
      const totalInc     = inc.reduce((a, i)       => a + (i.amount || 0), 0);
      const net          = totalInc - (totalSpent - totalRefunds);

      ctx += `\n[${month}] Income: $${totalInc.toFixed(0)} | Spent: $${totalSpent.toFixed(0)} | Refunds: $${totalRefunds.toFixed(0)} | Net: ${net >= 0 ? "+" : ""}$${net.toFixed(0)}\n`;

      if (inc.length) ctx += `  Income: ${inc.map(i => i.source + " $" + (i.amount || 0).toFixed(0)).join(", ")}\n`;

      // By envelope (skip zeros)
      const byEnv = {};
      spending.forEach(t => { byEnv[t.envelopeId] = (byEnv[t.envelopeId] || 0) + (t.amount || 0); });
      const envLines = FINANCE_ENVELOPES_DEFAULT.filter(e => byEnv[e.id]).map(e => {
        const budget = envs.find(ev => ev.id === e.id)?.allocated || 0;
        return `${e.name} $${byEnv[e.id].toFixed(0)}${budget > 0 ? "/" + budget.toFixed(0) : ""}`;
      });
      if (envLines.length) ctx += `  Categories: ${envLines.join(", ")}\n`;

      // Sub-cat breakdown for all categories that have it
      const subBreakdowns = [];
      FINANCE_ENVELOPES_DEFAULT.forEach(e => {
        const subs = spending.filter(t => t.envelopeId === e.id && t.subCat);
        if (!subs.length) return;
        const bySub = {};
        subs.forEach(t => { bySub[t.subCat] = (bySub[t.subCat] || 0) + (t.amount || 0); });
        subBreakdowns.push(`${e.name}: ${Object.entries(bySub).sort((a,b) => b[1]-a[1]).map(([k,v]) => k + " $" + v.toFixed(0)).join(", ")}`);
      });
      if (subBreakdowns.length) ctx += `  Sub-cats: ${subBreakdowns.join(" | ")}\n`;

      // Top 5 merchants this month
      const byMerchant = {};
      spending.forEach(t => {
        const key = extractMerchantName(t.desc || t.card || "Unknown");
        byMerchant[key] = (byMerchant[key] || 0) + (t.amount || 0);
      });
      const top5 = Object.entries(byMerchant).sort((a, b) => b[1] - a[1]).slice(0, 5);
      if (top5.length) ctx += `  Top merchants: ${top5.map(([k, v]) => k + " $" + v.toFixed(0)).join(", ")}\n`;
    }

    return ctx;
  };

  const handleGenerateReport = async () => {
    if (!window.__claude_api_key) { setCoachReport("No Claude API key — add it in \u2699 Settings."); return; }
    setCoachLoading(true); setCoachReport("");
    try {
      const ctx = await buildFinanceContext();
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 45000);
      const res = await fetch("/api/claude", {
        method: "POST", signal: controller.signal,
        body: JSON.stringify({ model: "claude-sonnet-4-5-20251001", max_tokens: 1024,
          messages: [{ role: "user", content: `You are a personal financial coach for Ryan and Sabrina Persaud (a Canadian couple). Analyze their spending data and write a concise Monthly Financial Brief.

${ctx}

Write a brief with these sections (use plain text, NO markdown headers, use emoji for visual structure):
📊 SNAPSHOT — 2-3 sentences on overall financial health this month vs last month
🔥 WATCH OUT — 2-3 biggest spending concerns with specific dollar amounts
✅ WINS — 1-2 things they did well
💡 RECOMMENDATIONS — 3-4 specific, actionable steps with dollar targets
📈 TREND — 1 sentence on the 3-month trajectory

Be direct, specific (use their real numbers), and conversational. Not a list of generic tips — real advice based on their actual data.` }] })
      });
      const data = await res.json();
      setCoachReport(data.content?.[0]?.text || "Could not generate report.");
    } catch(err) {
      setCoachReport(err.name === "AbortError" ? "Timed out — try again." : "Error: " + err.message);
    }
    setCoachLoading(false);
  };

  const handleChatSend = async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    if (!window.__claude_api_key) { setChatMessages(m => [...m, { role: "assistant", content: "No Claude API key — add it in \u2699 Settings." }]); return; }
    const newMessages = [...chatMessages, { role: "user", content: msg }];
    setChatMessages(newMessages); setChatInput(""); setChatLoading(true);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    try {
      const ctx = await buildFinanceContext(true); // loads ALL months
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 45000);
      const res = await fetch("/api/claude", {
        method: "POST", signal: controller.signal,
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001", max_tokens: 768,
          system: `You are a personal financial coach for Ryan and Sabrina Persaud (Canadian couple). You have their COMPLETE financial history below — every month of data available. Answer questions using ONLY this data. Always cite specific months and dollar amounts. Be direct, specific, and actionable. Never give generic advice — every answer must reference their actual numbers.\n\n${ctx}`,
          messages: newMessages.slice(-10).map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "No response.";
      setChatMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch(err) {
      setChatMessages(m => [...m, { role: "assistant", content: err.name === "AbortError" ? "Timed out — try again." : "Error: " + err.message }]);
    }
    setChatLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleAddSubCat = async (envelopeId, newSubCat) => {
    const existing = customSubCats[envelopeId] || [];
    if (existing.includes(newSubCat)) return;
    const updated = { ...customSubCats, [envelopeId]: [...existing, newSubCat] };
    setCustomSubCats(updated);
    await DB.set(KEYS.customSubCats(), updated);
  };

  // Resolve a vague merchant: user picks one of the 3 suggestions
  const handleVaguePick = async (txn, pick) => {
    const updated = transactions.map(t => t.id === txn.id ? { ...t, envelopeId: pick.envelopeId, subCat: pick.subCat } : t);
    setTransactions(updated);
    await DB.set(KEYS.financeTransactions(currentMonth), updated);
    // Also save as a rule
    const newRule = { id: "mr_u" + Date.now(), keyword: pick.keyword.toLowerCase(), displayName: pick.label, envelopeId: pick.envelopeId, subCat: pick.subCat };
    const updatedRules = [...merchantRules.filter(r => r.keyword !== newRule.keyword), newRule];
    setMerchantRules(updatedRules);
    await DB.set(KEYS.merchantRules(), updatedRules);
    setVaguePrompt(null);
  };

  const handleAddIncome = async () => {
    const amt = parseFloat(addIncomeForm.amount);
    if (!addIncomeForm.source.trim() || isNaN(amt) || amt <= 0) return;
    const month = addIncomeForm.date.slice(0, 7);
    const entry = { id: "inc_" + Date.now(), date: addIncomeForm.date, month, amount: amt, source: addIncomeForm.source.trim(), type: addIncomeForm.type };
    const updated = [...income, entry];
    setIncome(updated);
    await DB.set(KEYS.financeIncome(month), updated);
    setShowAddIncome(false);
    setAddIncomeForm({ date: getToday(), amount: "", source: "Salary", type: "salary" });
  };

  const handleDeleteIncome = async (id) => {
    const updated = income.filter(i => i.id !== id);
    setIncome(updated);
    await DB.set(KEYS.financeIncome(currentMonth), updated);
  };

  const handleAddTxn = async () => {
    const amt = parseFloat(addTxnForm.amount);
    if (!addTxnForm.desc.trim() || isNaN(amt) || amt <= 0) return;
    const month = addTxnForm.date.slice(0, 7);
    const txn = { id: "manual_" + Date.now(), date: addTxnForm.date, month, card: addTxnForm.card, amount: amt, isRefund: false, category: "Manual", subCat: addTxnForm.subCat || "", desc: addTxnForm.desc.trim(), highlevel: "", envelopeId: addTxnForm.envelopeId };
    const existing = await DB.get(KEYS.financeTransactions(month)) || [];
    await DB.set(KEYS.financeTransactions(month), [...existing, txn]);
    const months = [...new Set([...allMonths, month])].sort();
    await DB.set(KEYS.financeAllMonths(), months); setAllMonths(months);
    setShowAddTxn(false); setAddTxnForm({ date: getToday(), amount: "", desc: "", card: "Amex", envelopeId: "food_drink", subCat: "" });
    await loadMonth(currentMonth);
  };

  // Compute spent per envelope for current month
  const spentByEnvelope = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      if (t.isRefund) return;
      map[t.envelopeId] = (map[t.envelopeId] || 0) + t.amount;
    });
    return map;
  }, [transactions]);

  const totalAllocated = envelopes.reduce((a, e) => a + (e.allocated || 0), 0);
  const totalSpent = Object.values(spentByEnvelope).reduce((a, v) => a + v, 0);
  const totalRefunds = transactions.filter(t => t.isRefund).reduce((a, t) => a + Math.abs(t.amount), 0);
  const netSpent = totalSpent - totalRefunds;
  const totalIncome = income.reduce((a, i) => a + (i.amount || 0), 0);
  const netCashFlow = totalIncome - netSpent;

  // Compute rollover: previous month's unspent → this month
  const computeRollover = async () => {
    const months = allMonths.filter(m => m < currentMonth).sort();
    if (!months.length) return;
    const prevMonth = months[months.length - 1];
    const prevEnv = await DB.get(KEYS.financeEnvelopes(prevMonth)) || [];
    const prevTxns = await DB.get(KEYS.financeTransactions(prevMonth)) || [];
    const prevSpent = {};
    prevTxns.forEach(t => { if (!t.isRefund) prevSpent[t.envelopeId] = (prevSpent[t.envelopeId] || 0) + t.amount; });
    const rollover = {};
    prevEnv.forEach(e => {
      const unspent = (e.allocated || 0) - (prevSpent[e.id] || 0);
      if (unspent > 0) rollover[e.id] = Math.round(unspent * 100) / 100;
    });
    setRolloverIn(rollover);
    await DB.set(KEYS.financeRollover(currentMonth), rollover);
  };

  const monthLabel = m => new Date(m + "-15").toLocaleDateString("en-CA", { month: "long", year: "numeric" });
  const fmt = n => "$" + Math.abs(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // ── Render ──────────────────────────────────────────────────────────────
  const tabBtn = (id, label, col) => /*#__PURE__*/React.createElement("button", {
    onClick: () => setView(id),
    style: { flexShrink: 0, padding: "10px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: 10, fontWeight: view === id ? 800 : 500, fontFamily: "'Syne',sans-serif", letterSpacing: ".06em", color: view === id ? col : "#c8d0dc", borderBottom: `2px solid ${view === id ? col : "transparent"}`, whiteSpace: "nowrap" }
  }, label);

  if (loading) return /*#__PURE__*/React.createElement("div", { style: { textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 13 } }, "Loading...");

  return /*#__PURE__*/React.createElement("div", null,

    // Header
    /*#__PURE__*/React.createElement("div", { style: { marginBottom: 16 } },
      /*#__PURE__*/React.createElement(SectionHead, { label: "Finance", color: "#34d399" }),

      // Month picker
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, margin: "6px 0 0 13px" } },
        /*#__PURE__*/React.createElement("button", {
          onClick: () => { const d = new Date(currentMonth + "-15"); d.setMonth(d.getMonth()-1); setCurrentMonth(d.toISOString().slice(0,7)); },
          style: { background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1 }
        }, "\u2039"),
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 13, color: "var(--text-primary)", fontWeight: 600 } }, monthLabel(currentMonth)),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => { const d = new Date(currentMonth + "-15"); d.setMonth(d.getMonth()+1); setCurrentMonth(d.toISOString().slice(0,7)); },
          style: { background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1 }
        }, "\u203a")
      )
    ),

    // Sub-tabs
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,.06)", marginBottom: 16, scrollbarWidth: "none" } },
      tabBtn("envelopes",    "ENVELOPES",    "#34d399"),
      tabBtn("transactions", "TRANSACTIONS", "#60a5fa"),
      tabBtn("income",       "INCOME",       "#4ade80"),
      tabBtn("summary",      "SUMMARY",      "#f4a823"),
      tabBtn("coach",        "COACH",        "#fb923c"),
      tabBtn("import",       "IMPORT",       "#a78bfa"),
      /*#__PURE__*/React.createElement("button", {
        onClick: () => { setRuleForm({ keyword: "", displayName: "", envelopeId: "food_drink", subCat: "" }); setShowRulesTable(true); },
        style: { flexShrink: 0, padding: "10px 14px", background: "transparent", border: "none", borderBottom: "2px solid transparent", color: "#a78bfa", fontSize: 10, fontWeight: 700, letterSpacing: ".06em", cursor: "pointer", whiteSpace: "nowrap" }
      }, "⚡ RULES")
    ),

    // ── ENVELOPES VIEW ──────────────────────────────────────────────────
    view === "envelopes" && /*#__PURE__*/React.createElement("div", null,

      // Quick add expense button
      /*#__PURE__*/React.createElement("button", {
        onClick: () => setShowAddTxn(true),
        style: { width: "100%", marginBottom: 12, padding: "10px 0", background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.25)", borderRadius: 10, color: "#34d399", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif", letterSpacing: ".04em" }
      }, "+ ADD EXPENSE"),

      // Budget health bar
      /*#__PURE__*/React.createElement("div", {
        style: { background: netSpent > totalAllocated ? "rgba(239,68,68,.08)" : "rgba(52,211,153,.07)", border: `1px solid ${netSpent > totalAllocated ? "rgba(239,68,68,.2)" : "rgba(52,211,153,.2)"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 16 }
      },
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 } },
          /*#__PURE__*/React.createElement("span", { style: { fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: "#34d399", letterSpacing: ".07em" } }, "MONTHLY BUDGET"),
          /*#__PURE__*/React.createElement("span", { style: { fontSize: 13, color: "var(--text-primary)", fontWeight: 700 } }, fmt(netSpent) + " / " + fmt(totalAllocated))
        ),
        /*#__PURE__*/React.createElement("div", { style: { height: 8, background: "rgba(255,255,255,.07)", borderRadius: 4, overflow: "hidden" } },
          /*#__PURE__*/React.createElement("div", { style: { width: totalAllocated ? Math.min(100, netSpent/totalAllocated*100) + "%" : "0%", height: "100%", background: netSpent > totalAllocated ? "#ef4444" : "#34d399", borderRadius: 4, transition: "width .3s" } })
        ),
        totalAllocated === 0 && /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: "6px 0 0" } }, "Tap an envelope to set your monthly allocation"),
        Object.keys(rolloverIn).length > 0 && /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "#4ade80", margin: "6px 0 0", fontWeight: 600 } },
          "\u21A9 Rollover from last month: " + fmt(Object.values(rolloverIn).reduce((a,v)=>a+v,0))
        )
      ),

      // Rollover button
      allMonths.some(m => m < currentMonth) && /*#__PURE__*/React.createElement("button", {
        onClick: computeRollover,
        style: { background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 8, padding: "6px 14px", fontSize: 11, color: "#4ade80", fontWeight: 700, cursor: "pointer", marginBottom: 14 }
      }, "\u21A9 Pull rollover from " + monthLabel(allMonths.filter(m=>m<currentMonth).sort().pop())),

      // Set as default budget button
      totalAllocated > 0 && /*#__PURE__*/React.createElement("button", {
        onClick: setDefaultBudget,
        style: { background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 8, padding: "6px 14px", fontSize: 11, color: "#a78bfa", fontWeight: 700, cursor: "pointer", marginBottom: 14, marginLeft: allMonths.some(m => m < currentMonth) ? 8 : 0 }
      }, "\uD83D\uDCCC Set as Default Budget"),

      // Envelope list
      envelopes.map(env => {
        const spent = spentByEnvelope[env.id] || 0;
        const rollover = rolloverIn[env.id] || 0;
        const effective = (env.allocated || 0) + rollover;
        const remaining = effective - spent;
        const over = remaining < 0;
        const pct = effective > 0 ? Math.min(100, spent / effective * 100) : 0;
        const isEditing = editingEnvelope === env.id;

        return /*#__PURE__*/React.createElement("div", {
          key: env.id,
          style: { background: over ? "rgba(239,68,68,.06)" : "rgba(255,255,255,.03)", border: `1px solid ${over ? "rgba(239,68,68,.25)" : "rgba(255,255,255,.07)"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 10 }
        },
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } },
            /*#__PURE__*/React.createElement("div", {
              style: { display: "flex", alignItems: "center", gap: 8, cursor: spent > 0 ? "pointer" : "default", flex: 1 },
              onClick: () => spent > 0 && setDrillEnvelope(drillEnvelope === env.id ? null : env.id)
            },
              /*#__PURE__*/React.createElement("span", { style: { fontSize: 16 } }, env.icon),
              /*#__PURE__*/React.createElement("span", { style: { fontSize: 13, color: "var(--text-primary)", fontWeight: 600 } }, env.name),
              rollover > 0 && /*#__PURE__*/React.createElement("span", { style: { fontSize: 9, color: "#4ade80", fontWeight: 700, background: "rgba(74,222,128,.12)", borderRadius: 4, padding: "1px 5px" } }, "+" + fmt(rollover)),
              spent > 0 && /*#__PURE__*/React.createElement("span", { style: { fontSize: 9, color: "var(--text-muted)", marginLeft: 2 } }, drillEnvelope === env.id ? "▲" : "▼")
            ),
            /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
              isEditing
                ? /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 4, alignItems: "center" } },
                    /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-muted)", fontSize: 12 } }, "$"),
                    /*#__PURE__*/React.createElement("input", {
                      type: "number", min: "0", step: "10",
                      defaultValue: env.allocated || "",
                      autoFocus: true,
                      onBlur: async e => {
                        const val = parseFloat(e.target.value) || 0;
                        const updated = envelopes.map(ev => ev.id === env.id ? { ...ev, allocated: val } : ev);
                        await saveEnvelopes(updated);
                        setEditingEnvelope(null);
                      },
                      onKeyDown: e => e.key === "Enter" && e.target.blur(),
                      style: { width: 80, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 6, padding: "4px 8px", color: "var(--text-primary)", fontSize: 13, outline: "none", textAlign: "right" }
                    })
                  )
                : /*#__PURE__*/React.createElement("button", {
                    onClick: () => setEditingEnvelope(env.id),
                    style: { background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 6, padding: "3px 10px", fontSize: 12, color: env.allocated ? "var(--text-primary)" : "var(--text-muted)", cursor: "pointer", fontWeight: env.allocated ? 600 : 400 }
                  }, env.allocated ? fmt(env.allocated) : "Set budget"),
              /*#__PURE__*/React.createElement("span", {
                style: { fontSize: 12, fontWeight: 700, color: over ? "#ef4444" : remaining < env.allocated * 0.2 ? "#f4a823" : "#4ade80", minWidth: 52, textAlign: "right" }
              }, over ? "-" + fmt(Math.abs(remaining)) : fmt(remaining))
            )
          ),
          effective > 0 && /*#__PURE__*/React.createElement("div", { style: { height: 5, background: "rgba(255,255,255,.06)", borderRadius: 3, overflow: "hidden" } },
            /*#__PURE__*/React.createElement("div", { style: { width: pct + "%", height: "100%", background: over ? "#ef4444" : pct > 80 ? "#f4a823" : env.color, borderRadius: 3, transition: "width .3s" } })
          ),
          effective > 0 && /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 4 } },
            /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)" } }, "Spent: " + fmt(spent)),
            /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)" } }, "Budget: " + fmt(effective))
          ),
          // Drill-down: transactions for this envelope
          drillEnvelope === env.id && /*#__PURE__*/React.createElement("div", { style: { marginTop: 10, borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 10 } },
            [...transactions].filter(t => t.envelopeId === env.id && !t.isRefund).sort((a,b) => b.date.localeCompare(a.date)).map((t, i) => /*#__PURE__*/React.createElement("div", {
              key: t.id || i,
              style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,.04)", cursor: "pointer" },
              onClick: e => { e.stopPropagation(); setEditingTxn(t); setEditTxnForm({ envelopeId: t.envelopeId || "other", subCat: t.subCat || "" }); }
            },
              /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-primary)", margin: "0 0 1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t.desc || t.category),
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 9, color: "var(--text-muted)", margin: 0 } }, t.date + (t.subCat ? " \xB7 " + t.subCat : "") + " \xB7 " + t.card)
              ),
              /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: "var(--text-primary)", flexShrink: 0, paddingLeft: 8 } }, "-" + fmt(t.amount))
            )),
            transactions.filter(t => t.envelopeId === env.id && !t.isRefund).length === 0 && /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: 0 } }, "No transactions yet")
          )
        );
      })
    ),

    // ── TRANSACTIONS VIEW ───────────────────────────────────────────────
    view === "transactions" && /*#__PURE__*/React.createElement("div", null,
      transactions.length === 0
        ? /*#__PURE__*/React.createElement("div", { style: { textAlign: "center", padding: "40px 0" } },
            /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 13, marginBottom: 12 } }, "No transactions for " + monthLabel(currentMonth)),
            /*#__PURE__*/React.createElement("button", { onClick: () => setView("import"), style: { background: "rgba(167,139,250,.12)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 8, padding: "8px 18px", color: "#a78bfa", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "Import CSV")
          )
        : /*#__PURE__*/React.createElement("div", null,
            // ── Filter + sort bar ──
            /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" } },
              /*#__PURE__*/React.createElement("select", {
                value: txnFilter.card,
                onChange: e => setTxnFilter(f => ({ ...f, card: e.target.value })),
                style: { flex: 1, minWidth: 100, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "6px 8px", color: "var(--text-secondary)", fontSize: 11, outline: "none", colorScheme: "dark" }
              },
                /*#__PURE__*/React.createElement("option", { value: "" }, "All Cards"),
                [...new Set(transactions.map(t => t.card).filter(Boolean))].sort().map(c => /*#__PURE__*/React.createElement("option", { key: c, value: c }, c))
              ),
              /*#__PURE__*/React.createElement("select", {
                value: txnFilter.envelopeId,
                onChange: e => setTxnFilter(f => ({ ...f, envelopeId: e.target.value })),
                style: { flex: 1, minWidth: 110, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "6px 8px", color: "var(--text-secondary)", fontSize: 11, outline: "none", colorScheme: "dark" }
              },
                /*#__PURE__*/React.createElement("option", { value: "" }, "All Categories"),
                FINANCE_ENVELOPES_DEFAULT.map(e => /*#__PURE__*/React.createElement("option", { key: e.id, value: e.id }, e.icon + " " + e.name))
              ),
              /*#__PURE__*/React.createElement("select", {
                value: txnFilter.sort,
                onChange: e => setTxnFilter(f => ({ ...f, sort: e.target.value })),
                style: { flex: 1, minWidth: 110, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "6px 8px", color: "var(--text-secondary)", fontSize: 11, outline: "none", colorScheme: "dark" }
              },
                /*#__PURE__*/React.createElement("option", { value: "date_desc" }, "Date \u2193 Newest"),
                /*#__PURE__*/React.createElement("option", { value: "date_asc" }, "Date \u2191 Oldest"),
                /*#__PURE__*/React.createElement("option", { value: "alpha_asc" }, "A \u2192 Z"),
                /*#__PURE__*/React.createElement("option", { value: "alpha_desc" }, "Z \u2192 A"),
                /*#__PURE__*/React.createElement("option", { value: "amount_desc" }, "Amount \u2193 Highest"),
                /*#__PURE__*/React.createElement("option", { value: "amount_asc" }, "Amount \u2191 Lowest")
              )
            ),
            // ── Count + import ──
            /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 } },
              /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: 0 } }, (() => {
                const filtered = transactions.filter(t => (!txnFilter.card || t.card === txnFilter.card) && (!txnFilter.envelopeId || t.envelopeId === txnFilter.envelopeId));
                return filtered.length + " transaction" + (filtered.length !== 1 ? "s" : "") + (txnFilter.card || txnFilter.envelopeId ? " (filtered)" : " \xB7 " + transactions.filter(t=>t.isRefund).length + " refunds");
              })()),
              /*#__PURE__*/React.createElement("button", { onClick: () => setView("import"), style: { background: "rgba(167,139,250,.12)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 6, padding: "4px 10px", color: "#a78bfa", fontSize: 10, fontWeight: 700, cursor: "pointer" } }, "\u2B06 Import more")
            ),
            // ── Transaction rows ──
            (() => {
              const sortFns = {
                date_desc: (a,b) => b.date.localeCompare(a.date),
                date_asc:  (a,b) => a.date.localeCompare(b.date),
                alpha_asc: (a,b) => (a.desc||"").localeCompare(b.desc||""),
                alpha_desc:(a,b) => (b.desc||"").localeCompare(a.desc||""),
                amount_desc:(a,b) => b.amount - a.amount,
                amount_asc: (a,b) => a.amount - b.amount,
              };
              const visible = [...transactions]
                .filter(t => (!txnFilter.card || t.card === txnFilter.card) && (!txnFilter.envelopeId || t.envelopeId === txnFilter.envelopeId))
                .sort(sortFns[txnFilter.sort] || sortFns.date_desc);
              return visible.map((t, i) => {
                const env = FINANCE_ENVELOPES_DEFAULT.find(e => e.id === t.envelopeId);
                return /*#__PURE__*/React.createElement("div", {
                  key: t.id || i,
                  style: { display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, marginBottom: 6 }
                },
                  /*#__PURE__*/React.createElement("span", { style: { fontSize: 18, flexShrink: 0, marginTop: 1 } }, env?.icon || "📋"),
                  /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                    /*#__PURE__*/React.createElement("p", { style: { fontSize: 12, color: "var(--text-primary)", margin: "0 0 2px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t.desc || t.category),
                    /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: 0 } }, t.date + " \xB7 " + t.card + " \xB7 " + (env?.name || t.category) + (t.subCat ? " \xB7 " + t.subCat : ""))
                  ),
                  /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 } },
                    /*#__PURE__*/React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: t.isRefund ? "#4ade80" : "var(--text-primary)" } }, (t.isRefund ? "+" : "-") + fmt(Math.abs(t.amount))),
                    /*#__PURE__*/React.createElement("button", { onClick: () => { setEditingTxn(t); setEditTxnForm({ envelopeId: t.envelopeId || "other", subCat: t.subCat || "" }); }, style: { fontSize: 9, color: "var(--text-muted)", background: "rgba(255,255,255,.06)", border: "none", borderRadius: 4, padding: "2px 6px", cursor: "pointer" } }, "edit")
                  )
                );
              });
            })()
          )
    ),

    // ── SUMMARY VIEW ────────────────────────────────────────────────────
    view === "summary" && /*#__PURE__*/React.createElement("div", null,

      // Month totals
      /*#__PURE__*/React.createElement("div", { style: { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "16px", marginBottom: 16 } },
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 800, color: "#34d399", letterSpacing: ".07em", margin: "0 0 14px" } }, monthLabel(currentMonth).toUpperCase()),
        [
          ["Income",          totalIncome > 0 ? fmt(totalIncome) : "—",  "#4ade80"],
          ["Total Spent",     fmt(netSpent),        netSpent > totalAllocated ? "#ef4444" : "var(--text-primary)"],
          ["Refunds",         "+" + fmt(totalRefunds), "#4ade80"],
          ["Budgeted",        fmt(totalAllocated), "#34d399"],
          ["Net Cash Flow",   totalIncome > 0 ? (netCashFlow >= 0 ? "+" : "") + fmt(netCashFlow) : "—", netCashFlow >= 0 ? "#4ade80" : "#ef4444"],
          ["Transactions",    transactions.length.toString(), "var(--text-muted)"]
        ].map(([label, val, col]) => /*#__PURE__*/React.createElement("div", {
          key: label, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }
        },
          /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, color: "var(--text-secondary)" } }, label),
          /*#__PURE__*/React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: col } }, val)
        ))
      ),

      // Top spending categories
      /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: ".08em", marginBottom: 10 } }, "BY ENVELOPE"),
      [...envelopes]
        .filter(e => spentByEnvelope[e.id] > 0)
        .sort((a,b) => (spentByEnvelope[b.id]||0) - (spentByEnvelope[a.id]||0))
        .map(env => {
          const spent = spentByEnvelope[env.id] || 0;
          const allocated = env.allocated || 0;
          const over = allocated > 0 && spent > allocated;
          return /*#__PURE__*/React.createElement("div", {
            key: env.id,
            style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: over ? "rgba(239,68,68,.06)" : "rgba(255,255,255,.03)", borderRadius: 8, marginBottom: 6, border: `1px solid ${over ? "rgba(239,68,68,.2)" : "rgba(255,255,255,.06)"}` }
          },
            /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, color: "var(--text-primary)" } }, env.icon + " " + env.name),
            /*#__PURE__*/React.createElement("div", { style: { textAlign: "right" } },
              /*#__PURE__*/React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: over ? "#ef4444" : "var(--text-primary)" } }, fmt(spent)),
              allocated > 0 && /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)", marginLeft: 4 } }, "/ " + fmt(allocated))
            )
          );
        }),

      // Historical months nav
      allMonths.length > 0 && /*#__PURE__*/React.createElement("div", { style: { marginTop: 20 } },
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: ".08em", marginBottom: 10 } }, "PAST MONTHS"),
        [...allMonths].sort((a,b)=>b.localeCompare(a)).map(m => /*#__PURE__*/React.createElement("button", {
          key: m, onClick: () => { setCurrentMonth(m); setView("envelopes"); },
          style: { display: "block", width: "100%", textAlign: "left", background: m === currentMonth ? "rgba(52,211,153,.1)" : "rgba(255,255,255,.03)", border: `1px solid ${m === currentMonth ? "rgba(52,211,153,.25)" : "rgba(255,255,255,.06)"}`, borderRadius: 8, padding: "9px 12px", marginBottom: 6, color: m === currentMonth ? "#34d399" : "var(--text-secondary)", fontSize: 12, fontWeight: m === currentMonth ? 700 : 400, cursor: "pointer" }
        }, monthLabel(m)))
      )
    ),

    // ── INCOME VIEW ─────────────────────────────────────────────────────
    view === "income" && /*#__PURE__*/React.createElement("div", null,
      // Income header
      /*#__PURE__*/React.createElement("div", { style: { background: "rgba(74,222,128,.07)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" } },
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: "#4ade80", letterSpacing: ".07em", margin: "0 0 2px" } }, "TOTAL INCOME"),
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 22, fontWeight: 800, color: "#4ade80", margin: 0, fontFamily: "'Syne',sans-serif" } }, fmt(totalIncome))
        ),
        /*#__PURE__*/React.createElement("button", { onClick: () => setShowAddIncome(true), style: { background: "#4ade80", border: "none", borderRadius: 10, padding: "10px 16px", color: "#080b11", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "+ ADD")
      ),
      // Income entries list
      income.length === 0
        ? /*#__PURE__*/React.createElement("p", { style: { textAlign: "center", color: "var(--text-muted)", fontSize: 13, padding: "30px 0" } }, "No income logged for " + monthLabel(currentMonth) + ". Tap + ADD.")
        : income.map(inc => /*#__PURE__*/React.createElement("div", { key: inc.id, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "rgba(74,222,128,.04)", border: "1px solid rgba(74,222,128,.12)", borderRadius: 10, marginBottom: 8 } },
            /*#__PURE__*/React.createElement("div", null,
              /*#__PURE__*/React.createElement("p", { style: { fontSize: 13, color: "var(--text-primary)", margin: "0 0 2px", fontWeight: 600 } }, inc.source),
              /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: 0 } }, inc.date + " \xB7 " + inc.type)
            ),
            /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
              /*#__PURE__*/React.createElement("span", { style: { fontSize: 15, fontWeight: 700, color: "#4ade80" } }, "+" + fmt(inc.amount)),
              /*#__PURE__*/React.createElement("button", { onClick: () => handleDeleteIncome(inc.id), style: { background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 16, cursor: "pointer", lineHeight: 1 } }, "\xD7")
            )
          )),
      // Net cash flow callout
      totalIncome > 0 && /*#__PURE__*/React.createElement("div", { style: { marginTop: 16, padding: "12px 16px", background: netCashFlow >= 0 ? "rgba(74,222,128,.08)" : "rgba(239,68,68,.08)", border: `1px solid ${netCashFlow >= 0 ? "rgba(74,222,128,.2)" : "rgba(239,68,68,.2)"}`, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" } },
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, color: "var(--text-secondary)", fontWeight: 700 } }, "NET CASH FLOW"),
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 16, fontWeight: 800, color: netCashFlow >= 0 ? "#4ade80" : "#ef4444", fontFamily: "'Syne',sans-serif" } }, (netCashFlow >= 0 ? "+" : "") + fmt(netCashFlow))
      )
    ),

    // ── COACH VIEW ──────────────────────────────────────────────────────
    view === "coach" && /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } },

      // ── Monthly Brief ──
      /*#__PURE__*/React.createElement("div", { style: { background: "rgba(251,146,60,.06)", border: "1px solid rgba(251,146,60,.2)", borderRadius: 16, padding: "18px 16px" } },
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: coachReport ? 14 : 0 } },
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, color: "#fb923c", margin: 0, letterSpacing: ".05em" } }, "📊 MONTHLY BRIEF"),
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: "3px 0 0" } }, "AI analysis of your last 3 months")
          ),
          /*#__PURE__*/React.createElement("button", {
            onClick: handleGenerateReport, disabled: coachLoading,
            style: { padding: "9px 18px", background: coachLoading ? "rgba(251,146,60,.3)" : "#fb923c", border: "none", borderRadius: 10, color: "#080b11", fontSize: 12, fontWeight: 800, cursor: coachLoading ? "not-allowed" : "pointer", fontFamily: "'Syne',sans-serif", flexShrink: 0 }
          }, coachLoading ? "Analysing\u2026" : coachReport ? "Refresh" : "Generate")
        ),
        coachReport && /*#__PURE__*/React.createElement("div", { style: { fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" } }, coachReport)
      ),

      // ── Chat divider ──
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
        /*#__PURE__*/React.createElement("div", { style: { flex: 1, height: 1, background: "rgba(255,255,255,.06)" } }),
        /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".06em", margin: 0 } }, "ASK YOUR COACH"),
        /*#__PURE__*/React.createElement("div", { style: { flex: 1, height: 1, background: "rgba(255,255,255,.06)" } })
      ),

      // ── Suggested questions ──
      chatMessages.length === 0 && /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
        [
          "Where am I overspending this month?",
          "How does my food spending compare to last month?",
          "What\u2019s my biggest expense category?",
          "Am I spending more or less than I earn?",
          "Where can I cut back to save $200/month?"
        ].map(q => /*#__PURE__*/React.createElement("button", {
          key: q, onClick: () => { setChatInput(q); },
          style: { textAlign: "left", padding: "10px 14px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, color: "var(--text-secondary)", fontSize: 12, cursor: "pointer" }
        }, q))
      ),

      // ── Chat messages ──
      chatMessages.length > 0 && /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, maxHeight: 400, overflowY: "auto", padding: "4px 0" } },
        chatMessages.map((m, i) => /*#__PURE__*/React.createElement("div", { key: i, style: { display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" } },
          /*#__PURE__*/React.createElement("div", {
            style: {
              maxWidth: "85%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: m.role === "user" ? "rgba(251,146,60,.18)" : "rgba(255,255,255,.05)",
              border: m.role === "user" ? "1px solid rgba(251,146,60,.3)" : "1px solid rgba(255,255,255,.08)",
              fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6, whiteSpace: "pre-wrap"
            }
          }, m.content)
        )),
        chatLoading && /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "flex-start" } },
          /*#__PURE__*/React.createElement("div", { style: { padding: "10px 14px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "14px 14px 14px 4px", fontSize: 13, color: "var(--text-muted)" } }, "Thinking\u2026")
        ),
        /*#__PURE__*/React.createElement("div", { ref: chatEndRef })
      ),

      // ── Chat input ──
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, position: "sticky", bottom: 0, background: "#080b11", paddingBottom: 4 } },
        /*#__PURE__*/React.createElement("input", {
          value: chatInput,
          onChange: e => setChatInput(e.target.value),
          onKeyDown: e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleChatSend(); } },
          placeholder: "Ask about your finances\u2026",
          style: { flex: 1, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, padding: "11px 14px", color: "var(--text-primary)", fontSize: 13, outline: "none" }
        }),
        /*#__PURE__*/React.createElement("button", {
          onClick: handleChatSend, disabled: chatLoading || !chatInput.trim(),
          style: { padding: "11px 18px", background: chatInput.trim() ? "#fb923c" : "rgba(255,255,255,.06)", border: "none", borderRadius: 12, color: chatInput.trim() ? "#080b11" : "var(--text-muted)", fontSize: 13, fontWeight: 800, cursor: chatInput.trim() ? "pointer" : "default", fontFamily: "'Syne',sans-serif", transition: "all .2s" }
        }, "\u2191")
      ),

      // Clear chat button
      chatMessages.length > 0 && /*#__PURE__*/React.createElement("button", {
        onClick: () => setChatMessages([]),
        style: { alignSelf: "center", background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", textDecoration: "underline" }
      }, "Clear conversation")
    ),

    // ── IMPORT VIEW ─────────────────────────────────────────────────────
    view === "import" && /*#__PURE__*/React.createElement("div", null,

      // ── Filename callout ──
      /*#__PURE__*/React.createElement("div", { style: { background: "rgba(244,168,35,.07)", border: "1px solid rgba(244,168,35,.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start" } },
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 18, lineHeight: 1, marginTop: 1 } }, "\uD83D\uDCC2"),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 12, fontWeight: 800, color: "#f4a823", margin: "0 0 4px", fontFamily: "'Syne',sans-serif", letterSpacing: ".04em" } }, "NAME YOUR FILE BEFORE UPLOADING"),
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 } },
            "Include card type + date range so you know what\u2019s been imported:",
            /*#__PURE__*/React.createElement("br", null),
            /*#__PURE__*/React.createElement("span", { style: { fontFamily: "monospace", color: "#f4a823", fontSize: 11 } }, "Amex_2026-01.xlsx"),
            /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-muted)" } }, " \xB7 "),
            /*#__PURE__*/React.createElement("span", { style: { fontFamily: "monospace", color: "#60a5fa", fontSize: 11 } }, "TD_Chequing_2026-01.csv"),
            /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-muted)" } }, " \xB7 "),
            /*#__PURE__*/React.createElement("span", { style: { fontFamily: "monospace", color: "#4ade80", fontSize: 11 } }, "CIBC_2025-Q4.csv"),
            /*#__PURE__*/React.createElement("br", null),
            /*#__PURE__*/React.createElement("span", { style: { color: "#555e73", fontSize: 10 } }, "Amex .xlsx exports are supported directly \u2014 no CSV conversion needed.")
          )
        )
      ),

      // ── Import type selector ──
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 16 } },
        ["credit_card", "bank_statement"].map(mode => {
          const active = importMode === mode;
          const label = mode === "credit_card" ? "💳 Credit Card" : "🏦 Bank Statement";
          const desc = mode === "credit_card" ? "All rows = spending" : "Splits income + direct expenses";
          const col = mode === "credit_card" ? "#60a5fa" : "#4ade80";
          return /*#__PURE__*/React.createElement("button", {
            key: mode, onClick: () => { setImportMode(mode); setCardResults(null); },
            style: { flex: 1, padding: "14px 12px", borderRadius: 12, border: `2px solid ${active ? col : "rgba(255,255,255,.08)"}`, background: active ? `rgba(${mode === "credit_card" ? "96,165,250" : "74,222,128"},.1)` : "rgba(255,255,255,.02)", cursor: "pointer", textAlign: "left" }
          },
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 13, fontWeight: 800, color: active ? col : "var(--text-secondary)", margin: "0 0 3px", fontFamily: "'Syne',sans-serif" } }, label),
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: 0 } }, desc)
          );
        })
      ),

      // ── Mode description ──
      importMode === "bank_statement" && /*#__PURE__*/React.createElement("div", { style: { background: "rgba(74,222,128,.06)", border: "1px solid rgba(74,222,128,.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 } },
        /*#__PURE__*/React.createElement("span", { style: { color: "#4ade80", fontWeight: 700 } }, "INCOME: "),
        "deposits, payroll, e-transfers in, refunds",
        /*#__PURE__*/React.createElement("br", null),
        /*#__PURE__*/React.createElement("span", { style: { color: "#fb923c", fontWeight: 700 } }, "EXPENSES: "),
        "utilities, property tax, mortgage, insurance billed from bank",
        /*#__PURE__*/React.createElement("br", null),
        /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-muted)", fontWeight: 700 } }, "SKIPPED: "),
        "credit card payments (already captured in CC import)"
      ),

      // ── Upload button ──
      !cardResults && /*#__PURE__*/React.createElement("div", { style: { marginBottom: 16 } },
        /*#__PURE__*/React.createElement("input", { ref: cardFileRef, type: "file", accept: ".csv,.txt,.xlsx,.xls", style: { display: "none" }, onChange: handleCardCSV }),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => { setImportMsg(""); cardFileRef.current?.click(); },
          disabled: cardParsing,
          style: { width: "100%", padding: "14px 0", background: importMode === "credit_card" ? "#60a5fa" : "#4ade80", border: "none", borderRadius: 12, color: "#080b11", fontSize: 13, fontWeight: 800, cursor: cardParsing ? "not-allowed" : "pointer", fontFamily: "'Syne',sans-serif", opacity: cardParsing ? .6 : 1 }
        }, cardParsing ? "Parsing with Claude\u2026" : (importMode === "credit_card" ? "\uD83D\uDCC4 Upload CC File (.csv or .xlsx)" : "\uD83C\uDFE6 Upload Bank Statement (.csv or .xlsx)"))
      ),

      // ── Results preview ──
      cardResults && /*#__PURE__*/React.createElement("div", { style: { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "16px", marginBottom: 16 } },
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: "#4ade80", margin: "0 0 12px", letterSpacing: ".05em" } },
          "REVIEW: " + cardResults.label + " — " +
          (cardResults.expenses.length ? cardResults.expenses.length + " expense" + (cardResults.expenses.length !== 1 ? "s" : "") : "") +
          (cardResults.income.length && cardResults.expenses.length ? " + " : "") +
          (cardResults.income.length ? cardResults.income.length + " income" : "")
        ),

        // Expenses section
        cardResults.expenses.length > 0 && /*#__PURE__*/React.createElement("div", { style: { marginBottom: cardResults.income.length ? 12 : 0 } },
          cardResults.income.length > 0 && /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "#fb923c", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 6px" } }, "EXPENSES"),
          /*#__PURE__*/React.createElement("div", { style: { maxHeight: 200, overflowY: "auto" } },
            cardResults.expenses.slice(0, 50).map((t, i) => {
              const env = FINANCE_ENVELOPES_DEFAULT.find(ev => ev.id === t.envelopeId);
              return /*#__PURE__*/React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,.04)" } },
                /*#__PURE__*/React.createElement("div", { style: { minWidth: 0, flex: 1, paddingRight: 8 } },
                  /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t.desc),
                  /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: 0 } }, t.date + " \xB7 " + (env?.icon || "") + " " + (env?.name || "Other") + (t.subCat ? " / " + t.subCat : ""))
                ),
                /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: t.isRefund ? "#4ade80" : "var(--text-primary)", flexShrink: 0 } }, (t.isRefund ? "+" : "-") + fmt(Math.abs(t.amount || 0)))
              );
            })
          ),
          cardResults.expenses.length > 50 && /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: "4px 0 0" } }, "Showing 50 of " + cardResults.expenses.length)
        ),

        // Income section
        cardResults.income.length > 0 && /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "#4ade80", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 6px" } }, "INCOME"),
          /*#__PURE__*/React.createElement("div", { style: { maxHeight: 150, overflowY: "auto" } },
            cardResults.income.map((t, i) => /*#__PURE__*/React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,.04)" } },
              /*#__PURE__*/React.createElement("div", null,
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-primary)", margin: 0 } }, t.source || t.desc),
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: 0 } }, t.date)
              ),
              /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: "#4ade80", flexShrink: 0 } }, "+" + fmt(t.amount || 0))
            ))
          )
        ),

        /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 14 } },
          /*#__PURE__*/React.createElement("button", { onClick: confirmCardResults, style: { flex: 1, padding: "10px 0", background: "#4ade80", border: "none", borderRadius: 9, color: "#080b11", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "Confirm & Save"),
          /*#__PURE__*/React.createElement("button", { onClick: () => setCardResults(null), style: { flex: 1, padding: "10px 0", background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 9, color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" } }, "Discard")
        )
      ),

      // ── Master CSV (legacy) ──
      /*#__PURE__*/React.createElement("div", { style: { background: "rgba(167,139,250,.05)", border: "1px solid rgba(167,139,250,.15)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 } },
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: "#a78bfa", letterSpacing: ".06em", margin: "0 0 4px" } }, "MASTER CSV"),
        /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: "0 0 10px" } }, "Legacy: Date, Credit Card, Amount, Category, Sub Category, Description, Highlevel"),
        /*#__PURE__*/React.createElement("input", { ref: fileRef, type: "file", accept: ".csv", style: { display: "none" }, onChange: handleImportCSV }),
        /*#__PURE__*/React.createElement("button", { onClick: () => fileRef.current?.click(), disabled: importing, style: { padding: "9px 18px", background: "#a78bfa", border: "none", borderRadius: 9, color: "#080b11", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif", opacity: importing ? .6 : 1 } }, importing ? "Importing\u2026" : "Choose CSV File")
      ),

      // ── Screenshot scan ──
      /*#__PURE__*/React.createElement("div", { style: { background: "rgba(96,165,250,.05)", border: "1px solid rgba(96,165,250,.15)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 } },
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: "#60a5fa", letterSpacing: ".06em", margin: "0 0 4px" } }, "SCAN STATEMENT"),
        /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: "0 0 10px" } }, "Upload a screenshot — Claude extracts transactions automatically."),
        /*#__PURE__*/React.createElement("input", { ref: scanRef, type: "file", accept: "image/*", style: { display: "none" }, onChange: handleScanStatement }),
        /*#__PURE__*/React.createElement("button", { onClick: () => scanRef.current?.click(), disabled: scanning, style: { padding: "9px 18px", background: "#60a5fa", border: "none", borderRadius: 9, color: "#080b11", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif", opacity: scanning ? .6 : 1 } }, scanning ? "Scanning\u2026" : "\uD83D\uDCF8 Upload Screenshot")
      ),

      // Scan results
      scanResults && /*#__PURE__*/React.createElement("div", { style: { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "16px", marginBottom: 16 } },
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, color: "#4ade80", margin: "0 0 12px" } }, "FOUND " + scanResults.length + " TRANSACTIONS"),
        /*#__PURE__*/React.createElement("div", { style: { maxHeight: 300, overflowY: "auto", marginBottom: 12 } },
          scanResults.map((t, i) => {
            const env = FINANCE_ENVELOPES_DEFAULT.find(e => e.id === t.envelopeId);
            return /*#__PURE__*/React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,.05)" } },
              /*#__PURE__*/React.createElement("div", null,
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 12, color: "var(--text-primary)", margin: 0, fontWeight: 500 } }, t.desc),
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: 0 } }, t.date + " \xB7 " + (env?.icon || "") + " " + (env?.name || "Other"))
              ),
              /*#__PURE__*/React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--text-primary)" } }, "-$" + (t.amount || 0).toFixed(2))
            );
          })
        ),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8 } },
          /*#__PURE__*/React.createElement("button", { onClick: confirmScan, style: { flex: 1, padding: "10px 0", background: "#4ade80", border: "none", borderRadius: 9, color: "#080b11", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "Confirm & Save"),
          /*#__PURE__*/React.createElement("button", { onClick: () => setScanResults(null), style: { flex: 1, padding: "10px 0", background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 9, color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" } }, "Discard")
        )
      ),

      // ── Dedup tool ──
      /*#__PURE__*/React.createElement("div", { style: { background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.15)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 } },
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: "#ef4444", letterSpacing: ".06em", margin: "0 0 4px" } }, "REMOVE DUPLICATES"),
        /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: "0 0 10px", lineHeight: 1.5 } }, "Scans every month in Firebase and removes any duplicate transaction or income entries."),
        /*#__PURE__*/React.createElement("button", {
          onClick: dedupeAllMonths, disabled: deduping,
          style: { padding: "9px 18px", background: deduping ? "rgba(239,68,68,.3)" : "#ef4444", border: "none", borderRadius: 9, color: "#fff", fontSize: 12, fontWeight: 800, cursor: deduping ? "not-allowed" : "pointer", fontFamily: "'Syne',sans-serif", opacity: deduping ? .7 : 1 }
        }, deduping ? "Scanning\u2026" : "\uD83E\uDDF9 Deduplicate All Months")
      ),

      importMsg && /*#__PURE__*/React.createElement("div", {
        style: { background: importMsg.includes("fail") || importMsg.includes("Error") || importMsg.includes("error") ? "rgba(239,68,68,.1)" : "rgba(74,222,128,.1)", border: `1px solid ${importMsg.includes("fail") || importMsg.includes("Error") || importMsg.includes("error") ? "rgba(239,68,68,.25)" : "rgba(74,222,128,.25)"}`, borderRadius: 10, padding: "12px 14px", fontSize: 12, color: importMsg.includes("fail") || importMsg.includes("Error") || importMsg.includes("error") ? "#ef4444" : "#4ade80", fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }
      },
        React.createElement("span", null, importMsg),
        React.createElement("button", { onClick: () => setImportMsg(""), style: { background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 16, lineHeight: 1, flexShrink: 0, opacity: .7 } }, "\xD7")
      )
    ),

    // ── ADD EXPENSE MODAL ───────────────────────────────────────────────
    showAddTxn && /*#__PURE__*/React.createElement(React.Fragment, null,
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200 }, onClick: () => setShowAddTxn(false) }),
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "calc(100% - 32px)", maxWidth: 400, background: "#0e1420", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: 20, zIndex: 201 } },
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: "#34d399", margin: "0 0 16px" } }, "ADD EXPENSE"),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "DATE"),
            /*#__PURE__*/React.createElement("input", { type: "date", value: addTxnForm.date, onChange: e => setAddTxnForm(f => ({ ...f, date: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", colorScheme: "dark" } })
          ),
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "AMOUNT ($)"),
            /*#__PURE__*/React.createElement("input", { type: "number", min: "0", step: "0.01", placeholder: "0.00", value: addTxnForm.amount, onChange: e => setAddTxnForm(f => ({ ...f, amount: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" } })
          ),
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "DESCRIPTION"),
            /*#__PURE__*/React.createElement("input", { placeholder: "e.g. Costco groceries", value: addTxnForm.desc, onChange: e => setAddTxnForm(f => ({ ...f, desc: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" } })
          ),
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8 } },
            /*#__PURE__*/React.createElement("div", { style: { flex: 1 } },
              /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "CARD"),
              /*#__PURE__*/React.createElement("select", { value: addTxnForm.card, onChange: e => setAddTxnForm(f => ({ ...f, card: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 8px", color: "var(--text-primary)", fontSize: 12, outline: "none" } },
                ["Amex", "TD Visa", "CIBC", "PC Financial", "Cash", "Other"].map(c => /*#__PURE__*/React.createElement("option", { key: c, value: c }, c))
              )
            ),
            /*#__PURE__*/React.createElement("div", { style: { flex: 1 } },
              /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "CATEGORY"),
              /*#__PURE__*/React.createElement("select", { value: addTxnForm.envelopeId, onChange: e => setAddTxnForm(f => ({ ...f, envelopeId: e.target.value, subCat: "" })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 8px", color: "var(--text-primary)", fontSize: 12, outline: "none" } },
                FINANCE_ENVELOPES_DEFAULT.map(e => /*#__PURE__*/React.createElement("option", { key: e.id, value: e.id }, e.icon + " " + e.name))
              )
            )
          ),
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "SUB-CATEGORY"),
            /*#__PURE__*/React.createElement(SubCatSelect, { envelopeId: addTxnForm.envelopeId, value: addTxnForm.subCat, onChange: v => setAddTxnForm(f => ({ ...f, subCat: v })), extraOpts: customSubCats[addTxnForm.envelopeId] || [], onAdd: sub => handleAddSubCat(addTxnForm.envelopeId, sub) })
          )
        ),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 16 } },
          /*#__PURE__*/React.createElement("button", { onClick: handleAddTxn, style: { flex: 1, padding: "12px 0", background: "#34d399", border: "none", borderRadius: 9, color: "#080b11", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "SAVE"),
          /*#__PURE__*/React.createElement("button", { onClick: () => setShowAddTxn(false), style: { flex: 1, padding: "12px 0", background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 9, color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" } }, "Cancel")
        )
      )
    ),

    // ── Edit Transaction Modal ──────────────────────────────────────────────
    editingTxn && /*#__PURE__*/React.createElement(React.Fragment, null,
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200 }, onClick: () => setEditingTxn(null) }),
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "calc(100% - 32px)", maxWidth: 400, background: "#0e1420", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: 20, zIndex: 201 } },
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: "#34d399", margin: "0 0 4px" } }, "EDIT TRANSACTION"),
        /*#__PURE__*/React.createElement("p", { style: { fontSize: 12, color: "var(--text-muted)", margin: "0 0 16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, editingTxn.desc),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 12 } },
          /*#__PURE__*/React.createElement("div", { style: { flex: 1 } },
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "DATE"),
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 13, color: "var(--text-primary)" } }, editingTxn.date)
          ),
          /*#__PURE__*/React.createElement("div", { style: { flex: 1 } },
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "AMOUNT"),
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 13, color: editingTxn.isRefund ? "#4ade80" : "var(--text-primary)" } }, (editingTxn.isRefund ? "+" : "-") + "$" + (editingTxn.amount || 0).toFixed(2))
          )
        ),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "CATEGORY"),
            /*#__PURE__*/React.createElement("select", {
              value: editTxnForm.envelopeId,
              onChange: e => setEditTxnForm(f => ({ ...f, envelopeId: e.target.value })),
              style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 8px", color: "var(--text-primary)", fontSize: 13, outline: "none", colorScheme: "dark" }
            },
              FINANCE_ENVELOPES_DEFAULT.map(e => /*#__PURE__*/React.createElement("option", { key: e.id, value: e.id }, e.icon + " " + e.name))
            )
          ),
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "SUB-CATEGORY"),
            /*#__PURE__*/React.createElement(SubCatSelect, { envelopeId: editTxnForm.envelopeId, value: editTxnForm.subCat, onChange: v => setEditTxnForm(f => ({ ...f, subCat: v })), extraOpts: customSubCats[editTxnForm.envelopeId] || [], onAdd: sub => handleAddSubCat(editTxnForm.envelopeId, sub) })
          )
        ),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 16 } },
          /*#__PURE__*/React.createElement("button", {
            onClick: () => handleEditTxn(editingTxn, editTxnForm.envelopeId, editTxnForm.subCat),
            style: { flex: 1, padding: "12px 0", background: "#34d399", border: "none", borderRadius: 9, color: "#080b11", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
          }, "SAVE"),
          /*#__PURE__*/React.createElement("button", { onClick: () => setEditingTxn(null), style: { flex: 1, padding: "12px 0", background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 9, color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" } }, "Cancel")
        ),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => { if (window.confirm("Delete this transaction? This cannot be undone.")) handleDeleteTxn(editingTxn); },
          style: { width: "100%", marginTop: 8, padding: "10px 0", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 9, color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer" }
        }, "\uD83D\uDDD1 Delete Transaction")
      )
    ),

    // ── Add Income Modal ────────────────────────────────────────────────────
    showAddIncome && /*#__PURE__*/React.createElement(React.Fragment, null,
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200 }, onClick: () => setShowAddIncome(false) }),
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "calc(100% - 32px)", maxWidth: 400, background: "#0e1420", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: 20, zIndex: 201 } },
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: "#4ade80", margin: "0 0 16px" } }, "ADD INCOME"),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "DATE"),
            /*#__PURE__*/React.createElement("input", { type: "date", value: addIncomeForm.date, onChange: e => setAddIncomeForm(f => ({ ...f, date: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", colorScheme: "dark" } })
          ),
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "AMOUNT ($)"),
            /*#__PURE__*/React.createElement("input", { type: "number", min: "0", step: "0.01", placeholder: "0.00", value: addIncomeForm.amount, onChange: e => setAddIncomeForm(f => ({ ...f, amount: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" } })
          ),
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "SOURCE"),
            /*#__PURE__*/React.createElement("input", { placeholder: "e.g. Ryan Salary, Freelance", value: addIncomeForm.source, onChange: e => setAddIncomeForm(f => ({ ...f, source: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" } })
          ),
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "TYPE"),
            /*#__PURE__*/React.createElement("select", { value: addIncomeForm.type, onChange: e => setAddIncomeForm(f => ({ ...f, type: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 8px", color: "var(--text-primary)", fontSize: 13, outline: "none" } },
              [["salary","💼 Salary"],["freelance","🧑‍💻 Freelance"],["business","🏢 Business"],["investment","📈 Investment"],["government","🏛️ Government / Benefits"],["other","📦 Other"]].map(([v,l]) => /*#__PURE__*/React.createElement("option", { key: v, value: v }, l))
            )
          )
        ),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 16 } },
          /*#__PURE__*/React.createElement("button", { onClick: handleAddIncome, style: { flex: 1, padding: "12px 0", background: "#4ade80", border: "none", borderRadius: 9, color: "#080b11", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "SAVE"),
          /*#__PURE__*/React.createElement("button", { onClick: () => setShowAddIncome(false), style: { flex: 1, padding: "12px 0", background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 9, color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" } }, "Cancel")
        )
      )
    ),

    // ── Create Rule Prompt (after editing a transaction) ────────────────────
    rulePrompt && /*#__PURE__*/React.createElement(React.Fragment, null,
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 210 }, onClick: () => setRulePrompt(null) }),
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "calc(100% - 32px)", maxWidth: 420, background: "#0e1420", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: 20, zIndex: 211 } },
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, color: "#a78bfa", margin: "0 0 4px" } }, "CREATE MERCHANT RULE?"),
        /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: "0 0 14px" } }, "Save this mapping so future imports are auto-categorized."),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "MATCH KEYWORD"),
            /*#__PURE__*/React.createElement("input", { placeholder: "e.g. tim hortons", value: ruleForm.keyword, onChange: e => setRuleForm(f => ({ ...f, keyword: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" } }),
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", marginTop: 3 } }, "Any transaction description containing this keyword will be auto-assigned.")
          ),
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "DISPLAY NAME"),
            /*#__PURE__*/React.createElement("input", { placeholder: "e.g. Tim Hortons", value: ruleForm.displayName, onChange: e => setRuleForm(f => ({ ...f, displayName: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" } })
          ),
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8 } },
            /*#__PURE__*/React.createElement("div", { style: { flex: 2 } },
              /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "CATEGORY"),
              /*#__PURE__*/React.createElement("select", { value: ruleForm.envelopeId, onChange: e => setRuleForm(f => ({ ...f, envelopeId: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 8px", color: "var(--text-primary)", fontSize: 12, outline: "none" } },
                FINANCE_ENVELOPES_DEFAULT.map(e => /*#__PURE__*/React.createElement("option", { key: e.id, value: e.id }, e.icon + " " + e.name))
              )
            ),
            /*#__PURE__*/React.createElement("div", { style: { flex: 1 } },
              /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "SUB-CAT"),
              /*#__PURE__*/React.createElement(SubCatSelect, { envelopeId: ruleForm.envelopeId, value: ruleForm.subCat, onChange: v => setRuleForm(f => ({ ...f, subCat: v })), extraOpts: customSubCats[ruleForm.envelopeId] || [], onAdd: sub => handleAddSubCat(ruleForm.envelopeId, sub) })
            )
          )
        ),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 16 } },
          /*#__PURE__*/React.createElement("button", { onClick: handleSaveRule, style: { flex: 1, padding: "12px 0", background: "#a78bfa", border: "none", borderRadius: 9, color: "#080b11", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "SAVE RULE"),
          /*#__PURE__*/React.createElement("button", { onClick: () => setRulePrompt(null), style: { flex: 1, padding: "12px 0", background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 9, color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" } }, "Skip")
        )
      )
    ),

    // ── Merchant Rules Table ────────────────────────────────────────────────
    showRulesTable && /*#__PURE__*/React.createElement(React.Fragment, null,
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 220 }, onClick: () => setShowRulesTable(false) }),
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "#080b11", zIndex: 221, display: "flex", flexDirection: "column" } },
        // Header
        /*#__PURE__*/React.createElement("div", { style: { padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "space-between" } },
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: "#a78bfa", margin: 0 } }, "MERCHANT RULES"),
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" } }, merchantRules.length + " rules — applied automatically on CSV import")
          ),
          /*#__PURE__*/React.createElement("button", { onClick: () => setShowRulesTable(false), style: { background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer", lineHeight: 1 } }, "\xD7")
        ),
        // Add new rule row
        /*#__PURE__*/React.createElement("div", { style: { padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(167,139,250,.05)" } },
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "#a78bfa", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 8px" } }, "ADD NEW RULE"),
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
            /*#__PURE__*/React.createElement("input", { placeholder: "keyword", value: ruleForm.keyword, onChange: e => setRuleForm(f => ({ ...f, keyword: e.target.value })), style: { flex: "1 1 100px", minWidth: 80, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "7px 9px", color: "var(--text-primary)", fontSize: 12, outline: "none" } }),
            /*#__PURE__*/React.createElement("input", { placeholder: "display name", value: ruleForm.displayName, onChange: e => setRuleForm(f => ({ ...f, displayName: e.target.value })), style: { flex: "1 1 100px", minWidth: 80, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "7px 9px", color: "var(--text-primary)", fontSize: 12, outline: "none" } }),
            /*#__PURE__*/React.createElement("select", { value: ruleForm.envelopeId, onChange: e => setRuleForm(f => ({ ...f, envelopeId: e.target.value })), style: { flex: "1 1 110px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "7px 6px", color: "var(--text-primary)", fontSize: 11, outline: "none" } },
              FINANCE_ENVELOPES_DEFAULT.map(e => /*#__PURE__*/React.createElement("option", { key: e.id, value: e.id }, e.icon + " " + e.name))
            ),
            /*#__PURE__*/React.createElement("div", { style: { flex: "1 1 100px", minWidth: 80 } },
              /*#__PURE__*/React.createElement(SubCatSelect, { envelopeId: ruleForm.envelopeId, value: ruleForm.subCat, onChange: v => setRuleForm(f => ({ ...f, subCat: v })), extraOpts: customSubCats[ruleForm.envelopeId] || [], onAdd: sub => handleAddSubCat(ruleForm.envelopeId, sub) })
            ),
            /*#__PURE__*/React.createElement("button", { onClick: handleAddRule, style: { padding: "7px 14px", background: "#a78bfa", border: "none", borderRadius: 7, color: "#080b11", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "+ ADD")
          )
        ),
        // Rules list
        /*#__PURE__*/React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "0 0 40px" } },
          merchantRules.map(rule => {
            const env = FINANCE_ENVELOPES_DEFAULT.find(e => e.id === rule.envelopeId);
            return /*#__PURE__*/React.createElement("div", { key: rule.id, style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,.04)" } },
              /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 13, color: "var(--text-primary)", margin: 0, fontWeight: 500 } }, rule.displayName || rule.keyword),
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: "2px 0 0" } }, "keyword: " + rule.keyword)
              ),
              /*#__PURE__*/React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: env?.color || "var(--text-muted)", margin: 0, fontWeight: 700 } }, (env?.icon || "") + " " + (env?.name || rule.envelopeId)),
                rule.subCat && /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: "2px 0 0" } }, rule.subCat)
              ),
              /*#__PURE__*/React.createElement("button", { onClick: () => handleDeleteRule(rule.id), style: { background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 16, cursor: "pointer", padding: "0 4px", flexShrink: 0 } }, "\xD7")
            );
          })
        )
      )
    )
  );
}

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
  const [view, setView] = useState("personal");
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

  const makeItem = (fields, forceType) => ({
    id: "r_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    title: fields.title || input.trim(), notes: fields.notes || "",
    dueDate: fields.dueDate || "", dueTime: fields.dueTime || "",
    type: forceType || fields.type || "personal",
    done: false, doneAt: null, createdAt: new Date().toISOString(), googleTaskId: null
  });

  const handleAdd = async () => {
    if (!input.trim()) return;
    const defaultType = view === "joint" ? "joint" : "personal";
    if (!window.__claude_api_key) {
      const item = makeItem({ title: input.trim() }, defaultType);
      if (item.type === "joint") await saveJoint([item, ...joint]); else await savePersonal([item, ...personal]);
      setInput(""); return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001", max_tokens: 300,
          messages: [{ role: "user", content: `Today is ${today}. Parse this into a reminder/note. Return ONLY valid JSON, no markdown:\n{"title":"short clear title","notes":"extra detail or empty","dueDate":"YYYY-MM-DD or empty","dueTime":"HH:MM 24h or empty","type":"personal or joint"}\nRules: type "joint" if it involves both people/household/we/us/our. Parse relative dates like "Friday","tomorrow" relative to ${today}. Keep title concise.\nInput: "${input.trim()}"` }]
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
    if (!window.__claude_api_key) { setAiSummary("Add your Claude API key in Settings first."); return; }
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
  const activePersonal = personal.filter(r => !r.done);
  const activeJoint = joint.filter(r => !r.done);
  const doneAll = [...personal.filter(r => r.done), ...joint.filter(r => r.done)].sort((a, b) => (b.doneAt || "").localeCompare(a.doneAt || ""));
  const overdueCount = [...activePersonal, ...activeJoint].filter(isOverdue).length;
  const dueTodayCount = [...activePersonal, ...activeJoint].filter(isDueToday).length;
  const hasGoogleToken = !!window.__google_access_token && (!window.__google_token_expiry || Date.now() < window.__google_token_expiry);
  const displayItems = view === "personal" ? activePersonal : view === "joint" ? activeJoint : doneAll;
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
      tabBtn("personal", "MINE", activePersonal.length, "#a78bfa"),
      tabBtn("joint", "JOINT", activeJoint.length, "#60a5fa"),
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
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 5, flexWrap: "wrap", alignItems: "center" } },
            r.dueDate && /*#__PURE__*/React.createElement("span", {
              style: { fontSize: 10, fontWeight: 700, letterSpacing: ".04em", color: overdue ? "#ef4444" : dueToday ? "#f4a823" : "var(--text-muted)" }
            }, overdue ? "OVERDUE \xB7 " + r.dueDate : dueToday ? "TODAY" + (r.dueTime ? " \xB7 " + r.dueTime : "") : r.dueDate + (r.dueTime ? " \xB7 " + r.dueTime : "")),
            isJoint && !isDoneView && /*#__PURE__*/React.createElement("span", {
              style: { fontSize: 10, background: "rgba(96,165,250,.15)", border: "1px solid rgba(96,165,250,.25)", borderRadius: 4, padding: "1px 6px", color: "#60a5fa", fontWeight: 700 }
            }, "JOINT"),
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
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [tab, setTab] = useState("morning");
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

  // Keep API key and household ID in sync so all components can use them
  React.useEffect(() => {
    window.__claude_api_key = settings.claudeApiKey || "";
    window.__household_id = settings.householdId || "";
  }, [settings.claudeApiKey, settings.householdId]);

  // Apply colour theme whenever it changes
  React.useEffect(() => { applyTheme(settings.theme || "dark"); }, [settings.theme]);

  // Auto-tab by time of day — maps to section sub-tabs
  useEffect(() => {
    const h = new Date().getHours(),
      dow = new Date().getDay();
    if (dow === 0) setTab("sunday"); // Sunday → PERSONAL > Sunday
    else if (h >= 18) setTab("evening"); // Evening → PERSONAL > Evening
    else if (h >= 5 && h < 12) setTab("morning"); // Morning → PERSONAL > Morning
    else setTab("train"); // Midday → HEALTH > Train
  }, []);
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
        // Seed from embedded baseline (235 household items)
        setPantryItems(PANTRY_SEED);
        await DB.set(KEYS.pantry(), PANTRY_SEED);
        console.log("[Mission Log] Pantry seeded with", PANTRY_SEED.length, "baseline items");
      }
    }
    setSetupDone(!!sd);
    if (st) setSettings(st);
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
      id: "train",
      l: "TRAIN",
      c: "#fb923c"
    }, {
      id: "food",
      l: "FOOD",
      c: "#4ade80"
    }, {
      id: "mobility",
      l: "MOBILITY",
      c: "#a78bfa"
    }]
  }, {
    id: "home",
    label: "HOME",
    color: "#60a5fa",
    tabs: [{
      id: "chores",
      l: "CHORES",
      c: "#60a5fa"
    }, {
      id: "pantry",
      l: "PANTRY",
      c: "#fb923c"
    }]
  }, {
    id: "history",
    label: "HISTORY",
    color: "#a78bfa",
    tabs: []
  }, {
    id: "finance",
    label: "FINANCE",
    color: "#34d399",
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
    onSave: loadAll
  }), tab === "evening" && /*#__PURE__*/React.createElement(Evening, {
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
  }), tab === "food" && /*#__PURE__*/React.createElement(FoodTab, {
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
  }), tab === "pantry" && /*#__PURE__*/React.createElement(PantryTab, {
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
  }), tab === "finance" && /*#__PURE__*/React.createElement(FinanceTab, {
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
