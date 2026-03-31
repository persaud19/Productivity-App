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
      await window.__firebase_auth.signInWithPopup(provider);
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
      background: "#080b11",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#374151",
      fontFamily: "'Syne',sans-serif",
      fontSize: 12,
      letterSpacing: ".1em"
    }
  }, "LOADING..."));
  if (!user) return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "#080b11",
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
      color: "#374151",
      fontSize: 12,
      margin: "0 0 48px",
      letterSpacing: ".08em",
      textTransform: "uppercase"
    }
  }, "Daily Life OS"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,.04)",
      border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 16,
      padding: "32px 24px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#d1d5db",
      fontSize: 14,
      margin: "0 0 8px",
      fontWeight: 500
    }
  }, "Sign in to access your personal logs"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#374151",
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
      background: signingIn ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.1)",
      border: "1px solid rgba(255,255,255,.15)",
      borderRadius: 12,
      color: signingIn ? "#374151" : "#d1d5db",
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
  const SHARED_KEY_PREFIXES = ["ml/food/", "ml/chores"];
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
const getToday = () => new Date().toISOString().split("T")[0];
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
  sundayIndex: () => `ml:sunday:index`
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
  householdId: ""
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
    color: "#555e73",
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
      color: on ? i === 1 ? "#4ade80" : "#ef4444" : "#555e73",
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
    background: "rgba(255,255,255,.07)",
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
    color: "#555e73",
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
    color: "#374151",
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
      color: "#555e73",
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
      color: "#374151",
      fontSize: 9,
      margin: 0,
      letterSpacing: ".04em"
    }
  }, "DAY STREAK")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 32,
      background: "rgba(255,255,255,.08)",
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
      color: "#374151",
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
      color: "#374151",
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
      color: "#374151",
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
      background: "#080b11",
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
      background: i <= step ? "#f4a823" : "rgba(255,255,255,.1)",
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
      background: "rgba(255,255,255,.04)",
      borderRadius: 9,
      border: "1px solid rgba(255,255,255,.07)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#d1d5db",
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
      color: "#374151",
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
function MobilityChecklist({
  checked,
  setChecked,
  dailyList
}) {
  const [tipOpen, setTipOpen] = useState(null);
  const done = dailyList.filter(e => checked[e.id]).length;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
      color: done === 10 ? "#4ade80" : done >= 5 ? "#f4a823" : "#555e73",
      background: done === 10 ? "rgba(74,222,128,.12)" : done >= 5 ? "rgba(244,168,35,.1)" : "rgba(255,255,255,.04)"
    }
  }, done === 10 ? "DONE ✓" : `${done}/10`)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#374151",
      fontSize: 10,
      margin: "0 0 8px"
    }
  }, "Zone-balanced \xB7 Fresh selection every day"), /*#__PURE__*/React.createElement("div", {
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
        border: `1px solid ${ck ? "rgba(74,222,128,.15)" : "rgba(255,255,255,.06)"}`
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
        color: ck ? "#6b7280" : "#d1d5db",
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
        color: "#374151",
        fontSize: 10,
        flexShrink: 0,
        marginRight: 5
      }
    }, ex.reps), /*#__PURE__*/React.createElement("button", {
      onClick: () => setTipOpen(tip ? null : ex.id),
      style: {
        background: tip ? "rgba(96,165,250,.18)" : "transparent",
        border: `1px solid ${tip ? "rgba(96,165,250,.3)" : "rgba(255,255,255,.07)"}`,
        color: tip ? "#60a5fa" : "#374151",
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
        border: "1px solid " + (sel ? ac : hasData ? "rgba(74,222,128,.25)" : "rgba(255,255,255,.07)"),
        background: sel ? ac.replace(/[^,]+\)$/, "0.08)").replace("rgb(", "rgba(") : hasData ? "rgba(74,222,128,.05)" : "rgba(255,255,255,.02)",
        cursor: "pointer",
        transition: "all .12s"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: sel ? ac : isToday ? "#d1d5db" : "#555e73",
        fontSize: 9,
        fontWeight: sel ? 800 : 500,
        margin: "0 0 2px",
        textTransform: "uppercase"
      }
    }, isToday ? "NOW" : dow), /*#__PURE__*/React.createElement("p", {
      style: {
        color: sel ? ac : hasData ? "#4ade80" : "#374151",
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
      color: "#374151",
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
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 8,
        minWidth: 90
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#555e73",
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
        color: "#d1d5db",
        fontSize: 13,
        margin: 0
      }
    }, m.intention))
  }), m.gratitude && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Gratitude"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#d1d5db",
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
      color: "#374151",
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
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 8,
        minWidth: 90
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#555e73",
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
        color: "#d1d5db",
        fontSize: 13,
        margin: 0
      }
    }, e.win))
  }), e.familyMoment && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Family Moment"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#d1d5db",
        fontSize: 13,
        margin: 0
      }
    }, e.familyMoment))
  }), e.financeNote && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Finance Note"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#d1d5db",
        fontSize: 13,
        margin: 0
      }
    }, e.financeNote))
  }), e.moodNote && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Mood Note"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#d1d5db",
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
  allLogs
}) {
  const allLogsArr = allLogs || [];
  const [histDate, setHistDate] = useState(getToday());
  const [view, setView] = useState("log"); // "log" | "history"
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
  const dailyList = pickDailyExercises(getToday(), ALL_EXERCISES, 10);
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
      color: view === "log" ? "#f4a823" : "#555e73",
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
      color: view === "history" ? "#60a5fa" : "#555e73",
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
      color: "#555e73",
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
        color: "#374151",
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
        color: "#374151",
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
        color: stepPct >= 100 ? "#4ade80" : "#555e73",
        fontSize: 11,
        margin: "5px 0 0",
        fontWeight: stepPct >= 100 ? 700 : 400
      }
    }, stepPct >= 100 ? "Goal hit! ✓" : `${stepPct}% of goal`)), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#374151",
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
        color: "#555e73",
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
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(MobilityChecklist, {
      checked: mobility,
      setChecked: setMobility,
      dailyList: dailyList
    })
  }), /*#__PURE__*/React.createElement("button", {
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
    stroke: "rgba(255,255,255,.06)",
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
    fill: "#555e73",
    fontSize: 11
  }, block.label || ""))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#9ca3af",
      fontSize: 12,
      margin: "0 0 4px"
    }
  }, "Block ", bi + 1, "/", blocks.length), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#d1d5db",
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
      background: "rgba(255,255,255,.04)",
      border: "1px solid rgba(255,255,255,.08)",
      color: "#555e73",
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
      color: "#555e73",
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
      color: "#374151",
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
        background: ck ? "rgba(74,222,128,.05)" : "rgba(255,255,255,.03)",
        border: `1px solid ${ck ? "rgba(74,222,128,.15)" : "rgba(255,255,255,.06)"}`
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
        color: ck ? "#6b7280" : "#d1d5db",
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
        color: "#374151",
        fontSize: 10,
        flexShrink: 0,
        marginRight: 5
      }
    }, ex.sets), /*#__PURE__*/React.createElement("button", {
      onClick: () => setTipOpen(tip ? null : ex.id),
      style: {
        background: tip ? "rgba(244,168,35,.18)" : "transparent",
        border: `1px solid ${tip ? "rgba(244,168,35,.3)" : "rgba(255,255,255,.07)"}`,
        color: tip ? "#f4a823" : "#374151",
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
      background: done === 0 ? "rgba(255,255,255,.04)" : `${pair.color}20`,
      border: `1px solid ${done === 0 ? "rgba(255,255,255,.07)" : `${pair.color}35`}`,
      color: done === 0 ? "#374151" : pair.color,
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 800,
      cursor: done === 0 ? "default" : "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, done === 0 ? "CHECK OFF EXERCISES TO FINISH" : `LOG SESSION (${done}/8) →`));
}
function Train({
  todayLog,
  onSave,
  settings
}) {
  const date = getToday();
  const schedule = getTodaySchedule(date);
  const dow = new Date().getDay();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [walkDone, setWalkDone] = useState(false);
  const [history, setHistory] = useState([]);
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
  }, /*#__PURE__*/React.createElement(SectionHead, {
    label: "Train",
    color: "#fb923c"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#404755",
      fontSize: 12,
      margin: "0 0 0 13px"
    }
  }, fmtMid(date))), readiness > 0 && readiness <= 2 && /*#__PURE__*/React.createElement("div", {
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
      color: "#555e73",
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
        border: `1px solid ${isToday ? `${c}35` : "rgba(255,255,255,.06)"}`
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: isToday ? c : "#555e73",
        fontSize: 9,
        fontWeight: isToday ? 800 : 500,
        margin: "0 0 2px"
      }
    }, label), /*#__PURE__*/React.createElement("p", {
      style: {
        color: isToday ? c : "#374151",
        fontSize: 9,
        margin: 0
      }
    }, s.type === "strength" ? "STR" : s.type === "cardio" ? "CARD" : s.type === "rest" ? "REST" : "—"));
  })), schedule.type === "rest" && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "32px 16px",
      background: "rgba(255,255,255,.02)",
      border: "1px solid rgba(255,255,255,.06)",
      borderRadius: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontFamily: "'Syne',sans-serif",
      fontSize: 22,
      fontWeight: 800,
      margin: "0 0 8px"
    }
  }, "Rest Day"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#555e73",
      fontSize: 13,
      margin: 0
    }
  }, "Recovery is part of the program.")), schedule.type === "strength" && /*#__PURE__*/React.createElement(StrengthSession, {
    date: date,
    pair: schedule.pair,
    onDone: () => logSession("strength", {
      pair: schedule.pair?.name
    })
  }), schedule.type === "cardio" && schedule.format !== "outdoor_walk" && CARDIO_SESSIONS[schedule.format] && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
  }, "Today's Cardio"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#60a5fa",
      fontFamily: "'Syne',sans-serif",
      fontSize: 17,
      fontWeight: 800,
      margin: "0 0 2px"
    }
  }, CARDIO_SESSIONS[schedule.format].title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#374151",
      fontSize: 11,
      margin: "0 0 3px"
    }
  }, CARDIO_SESSIONS[schedule.format].equipment), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#555e73",
      fontSize: 12,
      margin: 0
    }
  }, CARDIO_SESSIONS[schedule.format].summary)), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(IntervalTimer, {
      blocks: CARDIO_SESSIONS[schedule.format].blocks,
      onComplete: () => logSession("cardio", {
        format: schedule.format
      })
    })
  })), schedule.type === "cardio" && schedule.format === "outdoor_walk" && /*#__PURE__*/React.createElement(OutdoorWalk, {
    onDone: data => {
      setWalkDone(true);
      logSession("cardio", {
        format: "outdoor_walk",
        ...data
      });
    }
  }), /*#__PURE__*/React.createElement("div", {
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
        color: "#555e73",
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
        color: "#374151",
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
  onMilestone
}) {
  const [view, setView] = useState("log");
  const [histDate, setHistDate] = useState(getToday());
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
      color: view === "log" ? "#60a5fa" : "#555e73",
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
      color: view === "history" ? "#60a5fa" : "#555e73",
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
        background: v ? "rgba(74,222,128,.13)" : "rgba(255,255,255,.04)",
        border: `1px solid ${v ? "#4ade80" : "rgba(255,255,255,.07)"}`,
        color: v ? "#4ade80" : "#555e73",
        fontWeight: v ? 700 : 400
      }
    }, v ? "✓ " : "", l))), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#374151",
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
        background: sn === i ? `${s.c}1f` : "rgba(255,255,255,.04)",
        border: `1px solid ${sn === i ? s.c : "rgba(255,255,255,.07)"}`,
        color: sn === i ? s.c : "#555e73",
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
        color: glasses >= n && n > 0 ? "#60a5fa" : "#374151",
        fontSize: 12,
        fontWeight: 700,
        padding: 0
      }
    }, n === 0 ? "0" : n))), /*#__PURE__*/React.createElement("p", {
      style: {
        color: glasses >= 8 ? "#4ade80" : glasses >= 5 ? "#60a5fa" : "#555e73",
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
  }), /*#__PURE__*/React.createElement(Card, {
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
        color: "#555e73",
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
  }), /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: "Overall Day Rating"
    }), /*#__PURE__*/React.createElement(Dots, {
      val: dr,
      set: setDr,
      col: "#f4a823"
    }))
  }), /*#__PURE__*/React.createElement(Card, {
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
        color: "#374151",
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
    stroke: "rgba(255,255,255,.06)",
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
    fill: "#555e73",
    fontSize: 9
  }, "complete"));
}
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
      color: "#555e73",
      borderRadius: 8,
      fontSize: 12,
      cursor: "pointer"
    }
  }, "\u270E Edit Goals");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,.03)",
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
      color: "#555e73",
      borderRadius: 9,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Cancel")));
}
function Goals({
  goals,
  onSaveGoals,
  allLogs,
  settings,
  onMilestone
}) {
  const [completedGoals, setCompletedGoals] = useState([]);
  const [confirmGoal, setConfirmGoal] = useState(null);
  const [confirmNote, setConfirmNote] = useState("");
  const [wins, setWins] = useState([]);
  const [winsFilter, setWinsFilter] = useState(30);
  const [weightRange, setWeightRange] = useState(30);
  useEffect(() => {
    (async () => {
      const cg = await DB.get(KEYS.completedGoals());
      setCompletedGoals(cg || []);
      const wa = await DB.get(KEYS.winsArchive());
      setWins(wa || []);
    })();
  }, []);
  const completeGoal = async () => {
    if (!confirmGoal) return;
    const entry = {
      ...confirmGoal,
      note: confirmNote,
      completedAt: new Date().toISOString()
    };
    const updated = [entry, ...completedGoals];
    setCompletedGoals(updated);
    await DB.set(KEYS.completedGoals(), updated);
    setConfirmGoal(null);
    setConfirmNote("");
    onMilestone && onMilestone(`${confirmGoal.label} — COMPLETE! 🎉`);
  };

  // Weight data
  const wtLogs = allLogs.filter(l => l.morning?.weight).sort((a, b) => a.date.localeCompare(b.date));
  const wtData = wtLogs.map(l => ({
    d: fmtDate(l.date),
    wt: l.morning.weight,
    date: l.date
  }));
  const wtFiltered = wtData.filter(d => daysBetween(d.date, getToday()) <= weightRange);
  const ws = goals.weightStart || 210,
    wg = goals.weightGoal || 180;
  const cWt = wtLogs.length > 0 ? wtLogs[wtLogs.length - 1].morning.weight : ws;
  const wLost = Math.max(0, ws - cWt),
    wRemain = Math.max(0, cWt - wg);
  const wPct = Math.min(100, Math.round(wLost / (ws - wg) * 100));
  const dl = new Date(goals.weightDeadline || "2026-12-31");
  const daysLeft = Math.max(0, Math.ceil((dl - new Date()) / 86400000));

  // Pace & projection
  let projDate = null,
    projLabel = null,
    paceLabel = null,
    projStatus = "neutral";
  if (wtLogs.length >= 2) {
    const first = wtLogs[0],
      last = wtLogs[wtLogs.length - 1];
    const daysDiff = Math.max(1, daysBetween(first.date, last.date));
    const lostPerDay = (first.morning.weight - last.morning.weight) / daysDiff;
    if (lostPerDay > 0) {
      const daysToGoal = Math.round(wRemain / lostPerDay);
      const proj = new Date();
      proj.setDate(proj.getDate() + daysToGoal);
      projDate = proj.toISOString().split("T")[0];
      projLabel = fmtDateFull(projDate);
      paceLabel = `${(lostPerDay * 7).toFixed(2)} lbs/week current pace`;
      projStatus = proj <= dl ? "ahead" : "behind";
    }
  }
  const recentWins = wins.filter(w => daysBetween(w.date, getToday()) <= winsFilter);
  const ttStyle = {
    background: "#111520",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 8,
    fontSize: 12
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    label: "Goal Runway",
    color: "#34d399"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#404755",
      fontSize: 12,
      margin: "0 0 0 13px"
    }
  }, daysLeft, " days to ", fmtDateFull(goals.weightDeadline || "2026-12-31"))), /*#__PURE__*/React.createElement(GoalEditor, {
    goals: goals,
    onSave: onSaveGoals,
    settings: settings
  }), confirmGoal && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,.7)",
      zIndex: 200
    },
    onClick: () => setConfirmGoal(null)
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
  }, "Mark as Complete?"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#9ca3af",
      fontSize: 13,
      margin: "0 0 14px"
    }
  }, confirmGoal.label), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: confirmNote,
    onChange: e => setConfirmNote(e.target.value),
    placeholder: "Optional note...",
    style: {
      ...inp,
      marginBottom: 12,
      fontSize: 13
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: completeGoal,
    style: {
      flex: 1,
      padding: "11px 0",
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
    onClick: () => setConfirmGoal(null),
    style: {
      flex: 1,
      padding: "11px 0",
      background: "transparent",
      border: "1px solid rgba(255,255,255,.1)",
      color: "#555e73",
      borderRadius: 9,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Cancel")))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,.03)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 14,
      padding: "16px",
      marginBottom: 14
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
      color: "#6b7280",
      fontSize: 10,
      letterSpacing: ".07em",
      textTransform: "uppercase",
      margin: "0 0 4px",
      fontWeight: 600
    }
  }, "Weight Goal"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontFamily: "'Syne',sans-serif",
      fontSize: 26,
      fontWeight: 800,
      margin: "0 0 2px",
      lineHeight: 1
    }
  }, cWt, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "#555e73",
      fontWeight: 400
    }
  }, "lbs")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#374151",
      fontSize: 11,
      margin: 0
    }
  }, "Target: ", wg, " lbs \xB7 ", fmtDateFull(goals.weightDeadline || "2026-12-31"))), /*#__PURE__*/React.createElement(Arc, {
    pct: wPct,
    col: "#f4a823"
  })), /*#__PURE__*/React.createElement(ProgBar, {
    pct: wPct,
    col: "#f4a823",
    h: 5
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 0,
      marginTop: 12,
      paddingTop: 10,
      borderTop: "1px solid rgba(255,255,255,.05)"
    }
  }, /*#__PURE__*/React.createElement(StatCell, {
    lbl: "Still to Lose",
    val: `${wRemain.toFixed(1)} lbs`,
    c: "#f4a823"
  }), /*#__PURE__*/React.createElement(StatCell, {
    lbl: "Lost So Far",
    val: `${wLost.toFixed(1)} lbs`,
    c: "#4ade80"
  }), /*#__PURE__*/React.createElement(StatCell, {
    lbl: "Days Left",
    val: daysLeft,
    c: "#60a5fa"
  })), paceLabel && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      padding: "8px 11px",
      background: "rgba(244,168,35,.06)",
      borderRadius: 8,
      border: "1px solid rgba(244,168,35,.1)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#9ca3af",
      fontSize: 11,
      margin: 0
    }
  }, paceLabel, projLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      color: projStatus === "ahead" ? "#4ade80" : "#ef4444",
      fontWeight: 700
    }
  }, " \xB7 Projected: ", projLabel))), cWt <= wg && /*#__PURE__*/React.createElement("button", {
    onClick: () => setConfirmGoal({
      id: "weight",
      label: `Weight Goal: ${ws} → ${wg} lbs`
    }),
    style: {
      width: "100%",
      marginTop: 12,
      padding: "10px 0",
      background: "rgba(74,222,128,.12)",
      border: "1px solid rgba(74,222,128,.25)",
      color: "#4ade80",
      borderRadius: 9,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "MARK AS COMPLETE \u2192")), wtFiltered.length >= 2 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,.03)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 12,
      padding: "14px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "Weight Trend"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5
    }
  }, [30, 90, 365].map(r => /*#__PURE__*/React.createElement("button", {
    key: r,
    onClick: () => setWeightRange(r),
    style: {
      padding: "3px 8px",
      borderRadius: 6,
      fontSize: 10,
      cursor: "pointer",
      border: `1px solid ${weightRange === r ? "rgba(244,168,35,.4)" : "rgba(255,255,255,.08)"}`,
      background: weightRange === r ? "rgba(244,168,35,.12)" : "transparent",
      color: weightRange === r ? "#f4a823" : "#555e73",
      fontWeight: weightRange === r ? 700 : 400
    }
  }, r, "d")))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 140
    }
  }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement(LineChart, {
    data: wtFiltered
  }, /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "d",
    tick: {
      fill: "#555e73",
      fontSize: 10
    },
    axisLine: false,
    tickLine: false
  }), /*#__PURE__*/React.createElement(YAxis, {
    domain: ["auto", "auto"],
    tick: {
      fill: "#555e73",
      fontSize: 10
    },
    axisLine: false,
    tickLine: false,
    width: 36
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    y: wg,
    stroke: "#4ade80",
    strokeDasharray: "4 4",
    label: {
      value: "Goal",
      fill: "#4ade80",
      fontSize: 9,
      position: "right"
    }
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
  }))))), (goals.loanBalance || goals.savingsCurrent) && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(52,211,153,.05)",
      border: "1px solid rgba(52,211,153,.15)",
      borderRadius: 12,
      padding: "14px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "Finance Snapshot"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 0
    }
  }, goals.loanBalance && /*#__PURE__*/React.createElement(StatCell, {
    lbl: "Loan Balance",
    val: `$${parseFloat(goals.loanBalance).toLocaleString()}`,
    sub: `Target: $0 by ${fmtDate(goals.loanDeadline || "2026-12-31")}`,
    c: "#ef4444"
  }), goals.savingsCurrent && /*#__PURE__*/React.createElement(StatCell, {
    lbl: "Savings",
    val: `$${parseFloat(goals.savingsCurrent).toLocaleString()}`,
    sub: `Target: $${parseFloat(goals.savingsTarget || 20000).toLocaleString()}`,
    c: "#34d399"
  }))), wins.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Lbl, {
    c: "Wins Archive"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5
    }
  }, [7, 30, 90].map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    onClick: () => setWinsFilter(f),
    style: {
      padding: "3px 8px",
      borderRadius: 6,
      fontSize: 10,
      cursor: "pointer",
      border: `1px solid ${winsFilter === f ? "rgba(74,222,128,.4)" : "rgba(255,255,255,.08)"}`,
      background: winsFilter === f ? "rgba(74,222,128,.12)" : "transparent",
      color: winsFilter === f ? "#4ade80" : "#555e73",
      fontWeight: winsFilter === f ? 700 : 400
    }
  }, f, "d")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 5
    }
  }, recentWins.slice(0, 10).map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      padding: "9px 12px",
      background: "rgba(255,255,255,.03)",
      borderRadius: 9,
      border: "1px solid rgba(255,255,255,.06)",
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
  }, fmtDate(w.date)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#c9ccd4",
      fontSize: 12,
      flex: 1
    }
  }, w.win))), recentWins.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#374151",
      fontSize: 12,
      margin: 0,
      textAlign: "center",
      padding: "12px 0"
    }
  }, "No wins logged in the last ", winsFilter, " days."))), completedGoals.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    c: "Completed Goals"
  }), completedGoals.map((g, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: "rgba(74,222,128,.04)",
      border: "1px solid rgba(74,222,128,.12)",
      borderRadius: 10,
      padding: "11px 13px",
      marginBottom: 6,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#d1d5db",
      fontSize: 13,
      fontWeight: 600,
      margin: "0 0 2px"
    }
  }, g.label), g.note && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#6b7280",
      fontSize: 11,
      margin: "0 0 2px",
      fontStyle: "italic"
    }
  }, "\"", g.note, "\""), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#374151",
      fontSize: 10,
      margin: 0
    }
  }, "Completed ", g.completedAt ? fmtDateFull(g.completedAt.split("T")[0]) : "")), /*#__PURE__*/React.createElement("span", {
    style: {
      background: "rgba(74,222,128,.15)",
      color: "#4ade80",
      fontSize: 10,
      fontWeight: 700,
      borderRadius: 6,
      padding: "3px 9px",
      flexShrink: 0
    }
  }, "DONE \u2713")))));
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
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": window.__claude_api_key || "",
          "anthropic-dangerous-direct-browser-access": "true"
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
      background: copied ? "rgba(74,222,128,.15)" : "rgba(255,255,255,.04)",
      border: `1px solid ${copied ? "rgba(74,222,128,.3)" : "rgba(255,255,255,.1)"}`,
      color: copied ? "#4ade80" : "#555e73",
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
      color: "#555e73",
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
      background: lc[i] || "#555e73",
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
      color: lc[i] || "#555e73",
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: ".07em",
      textTransform: "uppercase",
      marginBottom: 3
    }
  }, ll[i] || ""), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#d1d5db",
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
      color: "#374151",
      fontSize: 10,
      margin: 0
    }
  }, "Generated ", fmtDate(getToday())), /*#__PURE__*/React.createElement("button", {
    onClick: generate,
    style: {
      background: "transparent",
      border: "1px solid rgba(255,255,255,.08)",
      color: "#555e73",
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
      background: "rgba(255,255,255,.04)",
      border: "1px solid rgba(255,255,255,.06)",
      borderRadius: 10,
      padding: "11px 12px",
      flex: "1 1 76px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#555e73",
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
      color: "#374151",
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
      color: view === "review" ? "#4ade80" : "#555e73",
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
      color: view === "history" ? "#60a5fa" : "#555e73",
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
        fill: "#555e73",
        fontSize: 10
      },
      axisLine: false,
      tickLine: false
    }), /*#__PURE__*/React.createElement(YAxis, {
      domain: ["auto", "auto"],
      tick: {
        fill: "#555e73",
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
        fill: "#555e73",
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
        color: "#555e73",
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
        fill: "#555e73",
        fontSize: 10
      },
      axisLine: false,
      tickLine: false
    }), /*#__PURE__*/React.createElement(YAxis, {
      domain: [0, 3],
      ticks: [0, 1, 2, 3],
      tick: {
        fill: "#555e73",
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
        fill: "#555e73",
        fontSize: 10
      },
      axisLine: false,
      tickLine: false
    }), /*#__PURE__*/React.createElement(YAxis, {
      domain: [0, 5],
      ticks: [1, 2, 3, 4, 5],
      tick: {
        fill: "#555e73",
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
        color: "#555e73",
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
        color: "#555e73",
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
      c: "#555e73"
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
        color: "#374151",
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
        color: "#374151",
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
        color: "#374151",
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
        color: "#374151",
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
        color: "#374151",
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
  const expColor = daysToExp === null ? "#374151" : daysToExp < 0 ? "#ef4444" : daysToExp <= 7 ? "#f4a823" : daysToExp <= 30 ? "#facc15" : "#4ade80";
  const expLabel = daysToExp === null ? "" : daysToExp < 0 ? `Expired ${Math.abs(daysToExp)}d ago` : daysToExp === 0 ? "Expires today" : daysToExp <= 30 ? `${daysToExp}d left` : "";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      background: "rgba(255,255,255,.03)",
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
      color: "#d1d5db",
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
      color: "#555e73",
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
      color: "#555e73",
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
    brand: item.brand || ""
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
  }))), /*#__PURE__*/React.createElement("div", {
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
        id: item.id || "p" + Date.now()
      });
    },
    disabled: !form.name.trim(),
    style: {
      flex: 1,
      padding: "12px 0",
      background: form.name.trim() ? "#f4a823" : "rgba(255,255,255,.05)",
      color: form.name.trim() ? "#080b11" : "#374151",
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
      color: "#555e73",
      borderRadius: 9,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Cancel"))));
}
function PantryAIChat({
  onItemsExtracted,
  onClose
}) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hey! Tell me what you have in your pantry — just talk naturally. For example: \"I have a 2kg bag of rolled oats expiring January 2027, a can of black beans, and 500ml of olive oil.\" I'll pull out the details and add them for you."
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [extracted, setExtracted] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const voiceRef = useRef(null);
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
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
    r.onresult = e => {
      setInput(prev => (prev ? prev + " " : "") + e.results[0][0].transcript);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start();
    voiceRef.current = r;
  };
  const send = async text => {
    if (!text.trim()) return;
    const userMsg = {
      role: "user",
      content: text
    };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const systemPrompt = `You are a pantry assistant. The user is telling you what food items they have.
Extract ALL pantry items mentioned and return a JSON object with:
{
  "items": [
    {"name":"Rolled Oats","qty":2,"unit":"kg","expiry":"2027-01","brand":"Bob's Red Mill"},
    ...
  ],
  "reply": "Got it! I found X items. [brief friendly confirmation listing what you added]"
}

Rules:
- name: the food item name (specific, not generic where possible)
- qty: numeric quantity (default 1 if not mentioned)  
- unit: one of: g, kg, ml, l, oz, lb, cup, tbsp, tsp, piece, can, bag, box, bottle, bunch, loaf, dozen, unit
- expiry: YYYY-MM format if mentioned, empty string if not
- brand: brand name if mentioned, empty string if not
- reply: short friendly confirmation (1-2 sentences max)
Return ONLY valid JSON. No markdown fences.`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": window.__claude_api_key || "",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMsgs
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      const clean = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
      const parsed = JSON.parse(clean);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: parsed.reply || "Got it!"
      }]);
      if (parsed.items?.length) {
        setExtracted(prev => [...prev, ...parsed.items.map(i => ({
          ...i,
          id: "p" + Date.now() + Math.random(),
          qty: parseFloat(i.qty) || 1
        }))]);
      }
    } catch (e) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Hmm, couldn't parse that. Try again — list items one by one if needed."
      }]);
    }
    setLoading(false);
  };
  const confirm = () => {
    onItemsExtracted(extracted);
    setConfirmed(true);
  };
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
      background: m.role === "user" ? "rgba(96,165,250,.18)" : "rgba(255,255,255,.06)",
      border: `1px solid ${m.role === "user" ? "rgba(96,165,250,.3)" : "rgba(255,255,255,.08)"}`
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#d1d5db",
      fontSize: 13,
      margin: 0,
      lineHeight: 1.55
    }
  }, m.content)))), loading && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      padding: "8px 13px",
      background: "rgba(255,255,255,.04)",
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
  })), extracted.length > 0 && !confirmed && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 0",
      borderTop: "1px solid rgba(255,255,255,.07)",
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#4ade80",
      fontSize: 11,
      fontWeight: 700,
      margin: 0
    }
  }, "\u2713 ", extracted.length, " item", extracted.length !== 1 ? "s" : "", " ready to add"), /*#__PURE__*/React.createElement("button", {
    onClick: confirm,
    style: {
      padding: "6px 14px",
      background: "#4ade80",
      color: "#080b11",
      border: "none",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "ADD ALL \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 120,
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, extracted.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "6px 10px",
      background: "rgba(74,222,128,.06)",
      border: "1px solid rgba(74,222,128,.15)",
      borderRadius: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#d1d5db",
      fontSize: 12
    }
  }, item.name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#f4a823",
      fontSize: 11,
      fontWeight: 700
    }
  }, item.qty, " ", item.unit, item.expiry ? " · " + item.expiry : ""))))), confirmed && /*#__PURE__*/React.createElement("div", {
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
      background: input.trim() && !loading ? "rgba(96,165,250,.15)" : "rgba(255,255,255,.04)",
      border: `1px solid ${input.trim() && !loading ? "rgba(96,165,250,.3)" : "rgba(255,255,255,.07)"}`,
      color: input.trim() && !loading ? "#60a5fa" : "#374151",
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
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | scanning | looking_up | found | error
  const [foundItem, setFoundItem] = useState(null);
  const [form, setForm] = useState({
    qty: 1,
    unit: "unit",
    expiry: ""
  });
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const intervalRef = useRef(null);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment"
        }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setScanning(true);
      setStatus("scanning");
      if ("BarcodeDetector" in window) {
        detectorRef.current = new BarcodeDetector({
          formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "qr_code"]
        });
        intervalRef.current = setInterval(detectBarcode, 500);
      } else {
        setStatus("error");
        setScanning(false);
      }
    } catch (e) {
      setStatus("error");
    }
  };
  const detectBarcode = async () => {
    if (!videoRef.current || !detectorRef.current) return;
    try {
      const barcodes = await detectorRef.current.detect(videoRef.current);
      if (barcodes.length > 0) {
        clearInterval(intervalRef.current);
        stopCamera();
        lookupBarcode(barcodes[0].rawValue);
      }
    } catch (e) {}
  };
  const stopCamera = () => {
    clearInterval(intervalRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
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
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": window.__claude_api_key || "",
          "anthropic-dangerous-direct-browser-access": "true"
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
  useEffect(() => () => {
    stopCamera();
  }, []);
  if (status === "error") return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "24px 16px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#ef4444",
      fontSize: 14,
      fontWeight: 700,
      margin: "0 0 8px"
    }
  }, "Barcode scanner not available"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#555e73",
      fontSize: 12,
      margin: "0 0 14px",
      lineHeight: 1.6
    }
  }, "Your browser doesn't support the BarcodeDetector API. Try Chrome on Android, or use the voice/text method instead."), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      padding: "10px 20px",
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "#555e73",
      borderRadius: 9,
      fontSize: 13,
      cursor: "pointer"
    }
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
      color: "#d1d5db",
      fontSize: 14,
      fontWeight: 700,
      margin: "0 0 2px"
    }
  }, foundItem.name), foundItem.brand && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#555e73",
      fontSize: 11,
      margin: "0 0 2px"
    }
  }, foundItem.brand), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#374151",
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
      color: "#555e73",
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
      color: "#555e73",
      fontSize: 12,
      margin: "0 0 12px",
      lineHeight: 1.6
    }
  }, "Point your camera at any food barcode. The scanner will detect it automatically."), !scanning ? /*#__PURE__*/React.createElement("button", {
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
    style: {
      display: "block",
      fontSize: 28,
      marginBottom: 6
    }
  }, "\uD83D\uDCF7"), "Tap to Start Scanner") : /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("video", {
    ref: videoRef,
    autoPlay: true,
    playsInline: true,
    muted: true,
    style: {
      width: "100%",
      borderRadius: 10,
      border: "1px solid rgba(244,168,35,.3)",
      background: "#000",
      aspectRatio: "4/3",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220,
      height: 100,
      border: "2px solid #f4a823",
      borderRadius: 8,
      boxShadow: "0 0 0 2000px rgba(0,0,0,.4)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 10,
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0,0,0,.7)",
      borderRadius: 8,
      padding: "5px 12px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#f4a823",
      fontSize: 11,
      fontWeight: 700,
      margin: 0
    }
  }, "Scanning..."))), scanning && /*#__PURE__*/React.createElement("button", {
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
      color: "#374151",
      fontSize: 10,
      margin: "10px 0 0",
      textAlign: "center"
    }
  }, "Requires camera permission \xB7 Works best in Chrome on Android"));
}
function PantryTab({
  pantryItems,
  setPantryItems,
  onAddToGrocery
}) {
  const [mode, setMode] = useState("list"); // list | chat | barcode

  const addItems = async newItems => {
    const merged = [...pantryItems];
    newItems.forEach(ni => {
      // Merge with existing if same name (case-insensitive)
      const existing = merged.find(p => p.name.toLowerCase() === ni.name.toLowerCase());
      if (existing) {
        existing.qty = parseFloat(existing.qty || 0) + parseFloat(ni.qty || 1);
        if (ni.expiry) existing.expiry = ni.expiry;
      } else {
        merged.push({
          ...ni,
          id: ni.id || "p" + Date.now() + Math.random(),
          cat: ni.cat || "Other",
          minQty: 0,
          reorderQty: 1
        });
      }
    });
    setPantryItems(merged);
    await DB.set(KEYS.pantry(), merged);
    setMode("list");
  };
  const addOneItem = async item => {
    await addItems([item]);
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
      color: "#555e73",
      borderRadius: 7,
      fontSize: 11,
      cursor: "pointer"
    }
  }, "\u2190 Back")), /*#__PURE__*/React.createElement(PantryAIChat, {
    onItemsExtracted: addItems,
    onClose: () => setMode("list")
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
      color: "#555e73",
      borderRadius: 7,
      fontSize: 11,
      cursor: "pointer"
    }
  }, "\u2190 Back")), /*#__PURE__*/React.createElement(PantryBarcodeScanner, {
    onItemFound: item => addOneItem(item),
    onClose: () => setMode("list")
  }));

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
  onQuickAdjust
}) {
  const qty = parseFloat(item.qty) || 0;
  const minQty = parseFloat(item.minQty) || 0;
  const isLow = qty === 0 || minQty > 0 && qty <= minQty;
  const expiry = item.expiry ? new Date(item.expiry + "-01") : null;
  const daysToExp = expiry ? Math.round((expiry - new Date()) / 86400000) : null;
  const isExpiring = daysToExp !== null && daysToExp <= 7;
  const isExpired = daysToExp !== null && daysToExp < 0;
  const statusColor = qty === 0 ? "#ef4444" : isLow ? "#f4a823" : isExpired ? "#ef4444" : isExpiring ? "#facc15" : "#4ade80";
  const bg = qty === 0 || isLow ? "rgba(239,68,68,.05)" : isExpiring || isExpired ? "rgba(244,168,35,.05)" : "rgba(255,255,255,.03)";
  const border = qty === 0 || isLow ? "rgba(239,68,68,.2)" : "rgba(255,255,255,.07)";
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
      color: "#d1d5db",
      fontSize: 13,
      fontWeight: 600
    }
  }, item.name), /*#__PURE__*/React.createElement("span", {
    style: {
      background: "rgba(255,255,255,.06)",
      color: "#555e73",
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
  }, expLabel)), item.brand && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#374151",
      fontSize: 10,
      margin: 0
    }
  }, item.brand)), /*#__PURE__*/React.createElement("div", {
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
      color: "#555e73",
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
      color: "#555e73",
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
      color: "#555e73",
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
      background: "rgba(255,255,255,.04)",
      color: "#555e73",
      cursor: "pointer",
      fontSize: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, "\u270E")));
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
      color: "#555e73",
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
      background: "rgba(255,255,255,.04)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "#555e73",
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
        background: "rgba(255,255,255,.03)",
        borderRadius: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#d1d5db",
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
      color: "#555e73",
      fontSize: 10,
      margin: 0
    }
  }, expired.length > 0 ? `${expired.length} expired · ` : "", expiringItems.length - expired.length, " expiring soon")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setExpanded(!expanded),
    style: {
      padding: "5px 10px",
      background: "rgba(255,255,255,.04)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "#555e73",
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
        background: "rgba(255,255,255,.03)",
        borderRadius: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#d1d5db",
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
    const updated = pantryItems.map(p => p.id === item.id ? {
      ...p,
      qty: newQty
    } : p);
    setPantryItems(updated);
    await DB.set(KEYS.pantry(), updated);
  };
  const handleAddAllToGrocery = () => {
    const lowItems = pantryItems.filter(p => {
      const {
        status
      } = pantryStatus(p);
      return status === "out" || status === "low";
    });
    onAddToGrocery && onAddToGrocery(lowItems);
  };

  // Categorised alert lists
  const lowItems = pantryItems.filter(p => {
    const {
      status
    } = pantryStatus(p);
    return status === "out" || status === "low";
  });
  const expiringItems = pantryItems.filter(p => {
    const {
      daysToExp
    } = pantryStatus(p);
    return daysToExp !== null && daysToExp <= 7;
  });
  const cats = ["All", ...PANTRY_CATEGORIES];
  const filtered = pantryItems.filter(p => catFilter === "All" || p.cat === catFilter).filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).filter(p => {
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
    c: "#d1d5db"
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
      background: "rgba(255,255,255,.03)",
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
      color: "#555e73",
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
      border: `1px solid ${statusFilter === id ? "rgba(251,146,60,.4)" : "rgba(255,255,255,.08)"}`,
      background: statusFilter === id ? "rgba(251,146,60,.12)" : "transparent",
      color: statusFilter === id ? "#fb923c" : "#555e73",
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
      border: `1px solid ${catFilter === c ? "rgba(251,146,60,.3)" : "rgba(255,255,255,.07)"}`,
      background: catFilter === c ? "rgba(251,146,60,.08)" : "transparent",
      color: catFilter === c ? "#fb923c" : "#374151",
      fontWeight: catFilter === c ? 700 : 400
    }
  }, c))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#555e73",
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
      color: "#374151",
      fontSize: 28,
      margin: "0 0 8px"
    }
  }, "\uD83E\uDD6B"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#555e73",
      fontSize: 13,
      margin: "0 0 4px"
    }
  }, "Pantry is empty"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#374151",
      fontSize: 11,
      margin: "0 0 14px"
    }
  }, "Use the PANTRY tab above to add items by voice, barcode, or manually")), filtered.map(item => /*#__PURE__*/React.createElement(PantryItemRow, {
    key: item.id,
    item: item,
    onEdit: i => {
      setIsNew(false);
      setEditItem(i);
    },
    onQuickAdjust: quickAdjust
  })), editItem && /*#__PURE__*/React.createElement(PantryEditModal, {
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
  const pmColor = pm.pct >= 80 ? "#4ade80" : pm.pct >= 50 ? "#f4a823" : "#555e73";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 10,
      background: picked ? "rgba(74,222,128,.06)" : "rgba(255,255,255,.03)",
      border: `1px solid ${picked ? "rgba(74,222,128,.2)" : "rgba(255,255,255,.07)"}`,
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
      color: "#d1d5db",
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
      color: "#374151",
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
      border: `1px solid ${tab === t ? cc : "rgba(255,255,255,.08)"}`,
      background: tab === t ? `${cc}18` : "transparent",
      color: tab === t ? cc : "#555e73",
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
      background: "rgba(255,255,255,.04)",
      color: "#6b7280",
      fontSize: 10,
      borderRadius: 5,
      padding: "2px 7px"
    }
  }, t))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#555e73",
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
        color: inPantry ? "#555e73" : "#9ca3af",
        fontSize: 12,
        margin: "0 0 3px",
        textDecoration: inPantry ? "none" : "none"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: inPantry ? "#4ade80" : "#374151",
        marginRight: 4
      }
    }, inPantry ? "✓" : "·"), i, inPantry && /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#374151",
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
      background: "rgba(255,255,255,.03)",
      borderRadius: 7,
      display: "flex",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#555e73",
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
      color: "#555e73",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".05em",
      margin: "0 0 2px"
    }
  }, "Cook"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#d1d5db",
      fontSize: 12,
      fontWeight: 700,
      margin: 0
    }
  }, meal.cook, " min")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#555e73",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".05em",
      margin: "0 0 2px"
    }
  }, "Carbs"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#d1d5db",
      fontSize: 12,
      fontWeight: 700,
      margin: 0
    }
  }, meal.carbs, "g")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#555e73",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".05em",
      margin: "0 0 2px"
    }
  }, "Fat"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#d1d5db",
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
      color: "#555e73",
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
      color: "#555e73",
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
        border: `1px solid ${dayIdx === i ? "rgba(96,165,250,.4)" : ok ? "rgba(74,222,128,.2)" : "rgba(255,255,255,.07)"}`,
        background: dayIdx === i ? "rgba(96,165,250,.12)" : ok ? "rgba(74,222,128,.05)" : "rgba(255,255,255,.02)",
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: dayIdx === i ? "#60a5fa" : ok ? "#4ade80" : "#555e73",
        fontSize: 9,
        fontWeight: dayIdx === i ? 800 : 500,
        margin: 0
      }
    }, d), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#374151",
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
      color: "#555e73",
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
      color: "#374151",
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
      color: "#555e73",
      fontSize: 12,
      margin: "0 0 14px",
      lineHeight: 1.5
    }
  }, "This will update your pantry to reflect what was used."), deductions.length > 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,.03)",
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
      color: "#d1d5db",
      fontSize: 12
    }
  }, d.pantryItem.name), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#555e73",
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
      background: "rgba(255,255,255,.03)",
      border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 9,
      padding: "10px 12px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#555e73",
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
      color: "#555e73",
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
        border: `1px solid ${isCooked ? "rgba(74,222,128,.35)" : "rgba(255,255,255,.1)"}`,
        background: isCooked ? "rgba(74,222,128,.1)" : "rgba(255,255,255,.04)",
        color: isCooked ? "#4ade80" : "#555e73",
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
        color: "#555e73",
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
        color: "#374151",
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
      color: "#374151",
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
      color: "#555e73",
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
        border: `1px solid ${cat === c ? cc : "rgba(255,255,255,.08)"}`,
        background: cat === c ? `${cc}18` : "transparent",
        color: cat === c ? cc : "#555e73",
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
      color: "#555e73",
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
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": window.__claude_api_key || "",
      "anthropic-dangerous-direct-browser-access": "true"
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
        color: "#555e73",
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
        background: "rgba(255,255,255,.03)",
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
        background: "rgba(255,255,255,.03)",
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
        color: d.name?.trim() ? "#080b11" : "#374151",
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
        color: "#555e73",
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
      background: "rgba(255,255,255,.04)",
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
      background: mode === m ? "rgba(255,255,255,.08)" : "transparent",
      color: mode === m ? "#f4a823" : "#555e73",
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
      background: "rgba(255,255,255,.03)",
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
      color: "#374151",
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
      background: url.trim() && status !== "loading" ? "rgba(244,168,35,.15)" : "rgba(255,255,255,.04)",
      border: `1px solid ${url.trim() && status !== "loading" ? "rgba(244,168,35,.3)" : "rgba(255,255,255,.07)"}`,
      color: url.trim() && status !== "loading" ? "#f4a823" : "#374151",
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
      color: "#555e73",
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
      color: "#374151",
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
      background: (url.trim() || caption.trim()) && status !== "loading" ? "rgba(167,139,250,.15)" : "rgba(255,255,255,.04)",
      border: `1px solid ${(url.trim() || caption.trim()) && status !== "loading" ? "rgba(167,139,250,.3)" : "rgba(255,255,255,.07)"}`,
      color: (url.trim() || caption.trim()) && status !== "loading" ? "#a78bfa" : "#374151",
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
      color: "#555e73",
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
      background: "rgba(255,255,255,.03)",
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
      color: "#d1d5db",
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
      color: "#555e73",
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
      color: "#555e73",
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
      color: "#d1d5db",
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
      background: "rgba(255,255,255,.06)",
      color: "#9ca3af",
      fontSize: 9,
      fontWeight: 600,
      borderRadius: 4,
      padding: "1px 6px"
    }
  }, s.cardEmoji, " ", s.card)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#555e73",
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
        background: sel ? `${r.color}10` : "rgba(255,255,255,.03)",
        border: `2px solid ${sel ? r.color : "rgba(255,255,255,.07)"}`,
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
        color: sel ? r.color : "#d1d5db",
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
        color: "#555e73",
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
        color: "#555e73",
        fontSize: 11
      }
    }, done, "/", allItems.length), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 60,
        height: 4,
        background: "rgba(255,255,255,.07)",
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
      color: "#374151",
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
        color: "#555e73",
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
        color: "#374151",
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
          color: done ? "#6b7280" : "#d1d5db",
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
          color: "#555e73",
          fontSize: 10
        }
      }, "~$", item.price), per100Label && /*#__PURE__*/React.createElement("span", {
        style: {
          color: "#374151",
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
        color: "#555e73",
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
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────

// FoodTab — integrates food module into Mission Log shell
function FoodTab({
  activeUser,
  settings,
  pantryItemsFromApp = []
}) {
  const [subTab, setSubTab] = useState("plan");
  const [pantryItems, setPantryItems] = useState(pantryItemsFromApp || []);
  const [weekPlan, setWeekPlan] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [customMeals, setCustomMeals] = useState([]);
  const [cookedMeals, setCookedMeals] = useState({});
  const [loadingFood, setLoadingFood] = useState(true);
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
      setLoadingFood(false);
    })();
  }, [activeUser, sunKey]);
  const handleCookMeal = async (key, deductions) => {
    const updatedCooked = {
      ...cookedMeals,
      [key]: true
    };
    setCookedMeals(updatedCooked);
    await DB.set(KEYS.cookedMeals(sunKey), updatedCooked);
    if (deductions.length > 0) {
      const upd = pantryItems.map(item => {
        const d = deductions.find(d => d.pantryItem.id === item.id);
        return d ? {
          ...item,
          qty: d.resultQty
        } : item;
      });
      setPantryItems(upd);
      await DB.set(KEYS.pantry(), upd);
    }
  };
  const allMeals = [...MEALS_DB, ...customMeals];
  const canMake = pantryItems.length > 0 ? allMeals.filter(m => pantryMatch(m, pantryItems).pct >= 80).length : 0;
  const subTabs = [{
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
      color: "#374151",
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
      color: "#374151",
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
      color: subTab === t.id ? t.c : "#374151",
      fontWeight: subTab === t.id ? 800 : 500,
      fontSize: 10,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif",
      letterSpacing: ".04em",
      borderBottom: `2px solid ${subTab === t.id ? t.c : "transparent"}`
    }
  }, t.l))), subTab === "plan" && /*#__PURE__*/React.createElement(WeekPlanTab, {
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
      border: `1px solid ${filter === id ? c : "rgba(255,255,255,.08)"}`,
      background: filter === id ? `${c}18` : "transparent",
      color: filter === id ? c : "#555e73",
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
        border: `1px solid ${priFilter === p ? pc : "rgba(255,255,255,.07)"}`,
        background: priFilter === p ? `${pc}15` : "transparent",
        color: priFilter === p ? pc : "#555e73",
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
      border: `1px solid ${ownerFilter === o ? "rgba(96,165,250,.4)" : "rgba(255,255,255,.07)"}`,
      background: ownerFilter === o ? "rgba(96,165,250,.12)" : "transparent",
      color: ownerFilter === o ? "#60a5fa" : "#555e73",
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
      color: "#555e73",
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
        color: "#374151",
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
        color: "#555e73",
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
      color: "#555e73",
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
      color: "#555e73",
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
        border: `1px solid ${sel ? pc : "rgba(255,255,255,.08)"}`,
        background: sel ? `${pc}18` : "transparent",
        color: sel ? pc : "#555e73",
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
        border: `1px solid ${sel ? "rgba(96,165,250,.4)" : "rgba(255,255,255,.08)"}`,
        background: sel ? "rgba(96,165,250,.12)" : "transparent",
        color: sel ? "#60a5fa" : "#555e73",
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
      color: editTask.name?.trim() ? "#080b11" : "#374151",
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
      color: "#374151",
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
  onClose
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
    color = "#d1d5db"
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
      color: "#555e73",
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
      background: i < val ? color : "rgba(255,255,255,.1)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#555e73",
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
      background: "#080b11",
      zIndex: 300,
      overflowY: "auto",
      maxWidth: 490,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 0,
      background: "#080b11",
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
      color: "#374151",
      fontSize: 10,
      margin: 0
    }
  }, "Read-only log entry")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      padding: "7px 14px",
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "#9ca3af",
      borderRadius: 9,
      fontSize: 12,
      cursor: "pointer",
      fontWeight: 700
    }
  }, "\u2190 Back")), /*#__PURE__*/React.createElement("div", {
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
      border: "1px solid " + (section === id ? c : "rgba(255,255,255,.08)"),
      background: section === id ? c + "18" : "transparent",
      color: section === id ? c : has ? "#555e73" : "#2d3340",
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
      color: "#374151",
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
      color: "#555e73",
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
      color: "#555e73",
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
      color: "#555e73",
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
      color: "#555e73",
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
      background: "rgba(255,255,255,.03)",
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
      color: "#555e73",
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
      color: "#555e73",
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
      color: "#555e73",
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
      color: "#374151",
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
      background: "rgba(255,255,255,.03)",
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
      color: "#555e73",
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
      color: "#555e73",
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
      color: "#555e73",
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
  settings
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
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": window.__claude_api_key || "",
          "anthropic-dangerous-direct-browser-access": "true"
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
      onClose: () => {
        setSelectedDate(null);
        setDetailLog(null);
      }
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
      border: "1px solid " + (view === id ? "rgba(167,139,250,.4)" : "rgba(255,255,255,.08)"),
      background: view === id ? "rgba(167,139,250,.12)" : "rgba(255,255,255,.02)",
      color: view === id ? "#a78bfa" : "#555e73",
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
      color: "#555e73",
      cursor: "pointer",
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "\u2039"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#d1d5db",
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
      color: monthOffset === 0 ? "#2d3340" : "#555e73",
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
      color: "#374151",
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
        color: isToday ? "#a78bfa" : hasLog ? "#4ade80" : "#374151",
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
        background: hasMorning ? "#f4a823" : "rgba(255,255,255,.1)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: hasEvening ? "#60a5fa" : "rgba(255,255,255,.1)"
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
      color: "#374151",
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
      color: "#555e73",
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
      color: "#374151",
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
        color: "#d1d5db",
        fontSize: 12,
        margin: "0 0 1px",
        fontStyle: "italic"
      }
    }, "⭐ " + s.weekWin), s.weekNote && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "#555e73",
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
        color: "#374151",
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
          background: "rgba(255,255,255,.06)",
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
          color: "#374151",
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
      color: "#555e73",
      fontSize: 12,
      margin: "0 0 12px",
      lineHeight: 1.6
    }
  }, "Reads every Sunday review ever saved, your full log history, and surfaces real multi-week patterns \u2014 what's actually changing, what keeps repeating, and what you're probably not seeing yourself."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#374151",
      fontSize: 10,
      margin: "0 0 12px"
    }
  }, "Requires ", Math.max(0, 3 - allSundays.length), " more Sunday review", allSundays.length < 2 ? "s" : "", " before meaningful patterns emerge \xB7 You have ", allSundays.length, " saved"), /*#__PURE__*/React.createElement("button", {
    onClick: generateInsight,
    disabled: insightLoading || allSundays.length === 0,
    style: {
      width: "100%",
      padding: "13px 0",
      background: insightLoading || allSundays.length === 0 ? "rgba(255,255,255,.04)" : "rgba(167,139,250,.15)",
      border: "1px solid " + (insightLoading || allSundays.length === 0 ? "rgba(255,255,255,.07)" : "rgba(167,139,250,.35)"),
      color: insightLoading || allSundays.length === 0 ? "#374151" : "#a78bfa",
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
      color: "#555e73",
      fontSize: 10,
      margin: 0
    }
  }, "This takes a few seconds")), /*#__PURE__*/React.createElement("style", null, "@keyframes pulse{0%,100%{opacity:.2}50%{opacity:1}}")), insight && !insightLoading && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,.03)",
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
      color: "#374151",
      fontSize: 10,
      margin: 0
    }
  }, allSundays.length, " reviews \xB7 ", allLogs.length, " days"), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigator.clipboard.writeText(insight),
    style: {
      padding: "3px 9px",
      background: "rgba(255,255,255,.04)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "#555e73",
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
      color: "#d1d5db",
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
      color: "#555e73",
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

  const save = async () => {
    setSaving(true);
    const updated = { ...settings, claudeApiKey: apiKey.trim(), householdId: householdId.trim() };
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

  const card = { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, padding: "16px 18px", marginBottom: 14 };
  const label = { color: "#555e73", fontSize: 10, fontFamily: "'Syne',sans-serif", letterSpacing: ".07em", marginBottom: 6, display: "block" };
  const inp = { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "#d1d5db", fontSize: 13, padding: "9px 12px", boxSizing: "border-box", outline: "none", fontFamily: "'DM Sans',sans-serif" };

  return React.createElement("div", {
    style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" },
    onClick: e => { if (e.target === e.currentTarget) onClose(); }
  },
    React.createElement("div", {
      style: { background: "#0f1520", borderRadius: "18px 18px 0 0", width: "100%", maxWidth: 490, padding: "24px 20px 36px", maxHeight: "92vh", overflowY: "auto" }
    },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 } },
        React.createElement("p", { style: { color: "#e2e5ed", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, margin: 0, letterSpacing: ".05em" } }, "SETTINGS"),
        React.createElement("button", { onClick: onClose, style: { background: "none", border: "none", color: "#555e73", fontSize: 20, cursor: "pointer", padding: 0 } }, "✕")
      ),

      // ── Claude API Key ──
      React.createElement("div", { style: card },
        React.createElement("p", { style: { ...label, color: "#a78bfa" } }, "CLAUDE API KEY"),
        React.createElement("p", { style: { color: "#555e73", fontSize: 11, margin: "0 0 10px", lineHeight: 1.5 } },
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

      // ── Household ──
      React.createElement("div", { style: card },
        React.createElement("p", { style: { ...label, color: "#60a5fa" } }, "HOUSEHOLD"),
        React.createElement("p", { style: { color: "#555e73", fontSize: 11, margin: "0 0 12px", lineHeight: 1.5 } },
          "Link your account with " + (settings.partnerName || "your partner") + " to share Pantry, Meals, and Chores."
        ),

        householdId
          ? React.createElement("div", null,
              React.createElement("div", { style: { background: "rgba(96,165,250,.08)", border: "1px solid rgba(96,165,250,.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 10 } },
                React.createElement("p", { style: { color: "#60a5fa", fontSize: 11, margin: "0 0 2px", fontWeight: 700 } }, "Active Household"),
                React.createElement("p", { style: { color: "#d1d5db", fontSize: 18, fontWeight: 800, margin: 0, fontFamily: "'Syne',sans-serif", letterSpacing: ".1em" } }, householdId),
                React.createElement("p", { style: { color: "#555e73", fontSize: 10, margin: "4px 0 0" } }, "Share this code with " + (settings.partnerName || "your partner") + " so they can join.")
              ),
              React.createElement("button", { onClick: leaveHousehold, style: { background: "none", border: "1px solid rgba(239,68,68,.3)", borderRadius: 7, color: "#ef4444", fontSize: 11, padding: "6px 14px", cursor: "pointer" } }, "Leave Household")
            )
          : React.createElement("div", null,
              React.createElement("button", { onClick: createHousehold, style: { width: "100%", background: "rgba(96,165,250,.1)", border: "1px solid rgba(96,165,250,.25)", borderRadius: 8, color: "#60a5fa", fontSize: 12, fontWeight: 700, padding: "10px", cursor: "pointer", marginBottom: 10 } }, "Create Household (you go first)"),
              React.createElement("p", { style: { color: "#374151", fontSize: 10, textAlign: "center", margin: "0 0 10px" } }, "— or —"),
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
  const [todayLog, setTodayLog] = useState(null);
  const [allLogs, setAllLogs] = useState([]);
  const [allSundays, setAllSundays] = useState([]);
  const [streak, setStreak] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);
  const [celebration, setCelebration] = useState(null);
  const [activeUser, setActiveUser] = useState("self"); // self | partner
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Keep API key and household ID in sync so all components can use them
  React.useEffect(() => {
    window.__claude_api_key = settings.claudeApiKey || "";
    window.__household_id = settings.householdId || "";
  }, [settings.claudeApiKey, settings.householdId]);

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
    // Also update settings with new goal values
    const newSettings = {
      ...settings,
      ...updated
    };
    setSettings(newSettings);
    await DB.set(KEYS.settings(), newSettings);
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
    tabs: [],
    comingSoon: true
  }];

  // Derive active section from current tab
  const activeSection = NAV.find(s => s.tabs.some(t => t.id === tab) || s.id === tab) || NAV[0];
  if (loading || setupDone === null) return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "#080b11",
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
      background: "#080b11",
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
      background: "#080b11",
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
      color: "#374151",
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
      color: activeUser === "self" ? "#60a5fa" : "#555e73",
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
      color: activeUser === "partner" ? "#a78bfa" : "#555e73",
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
      color: "#374151",
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
        color: isActive ? section.color : "#374151",
        fontSize: 9,
        fontWeight: isActive ? 800 : 500,
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
      color: tab === t.id ? t.c : "#374151",
      fontWeight: tab === t.id ? 700 : 400,
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
  }, tab === "morning" && /*#__PURE__*/React.createElement(Morning, {
    todayLog: todayLog,
    onSave: loadAll,
    settings: settings,
    onMilestone: handleMilestone,
    allLogs: allLogs
  }), tab === "train" && /*#__PURE__*/React.createElement(Train, {
    todayLog: todayLog,
    onSave: loadAll,
    settings: settings
  }), tab === "evening" && /*#__PURE__*/React.createElement(Evening, {
    todayLog: todayLog,
    onSave: loadAll,
    settings: settings,
    onMilestone: handleMilestone,
    allLogs: allLogs
  }), tab === "food" && /*#__PURE__*/React.createElement(FoodTab, {
    uid: settings.uid || "ryan",
    partnerUid: settings.partnerUid || "sabrina",
    activeUser: activeUser,
    pantryItemsFromApp: pantryItems
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
  }), tab === "history" && /*#__PURE__*/React.createElement(HistoryBrowser, {
    allLogs: allLogs,
    allSundays: allSundays,
    settings: settings
  }), tab === "finance" && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "48px 20px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 36,
      margin: "0 0 16px"
    }
  }, "\uD83D\uDCB0"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#34d399",
      fontFamily: "'Syne',sans-serif",
      fontSize: 20,
      fontWeight: 800,
      margin: "0 0 8px"
    }
  }, "Finance"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#555e73",
      fontSize: 13,
      margin: "0 0 24px",
      lineHeight: 1.6
    }
  }, "Coming soon \u2014 credit card import (Amex, CIBC, TD), spending by category, payoff goal tracker, savings runway, and monthly expense analysis."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      maxWidth: 300,
      margin: "0 auto"
    }
  }, ["CC statement import (CSV/OFX)", "2-year spending categorization", "Loan payoff projection", "Monthly budget vs actual", "Savings milestone tracker"].map(f => /*#__PURE__*/React.createElement("div", {
    key: f,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      padding: "9px 13px",
      background: "rgba(52,211,153,.05)",
      border: "1px solid rgba(52,211,153,.12)",
      borderRadius: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#34d399",
      fontSize: 11
    }
  }, "\u25CB"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#555e73",
      fontSize: 12
    }
  }, f)))))), /*#__PURE__*/React.createElement("button", {
    onClick: handleExport,
    style: {
      position: "fixed",
      bottom: 20,
      right: 20,
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "#374151",
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
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "#374151",
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
      background: settings.claudeApiKey ? "rgba(167,139,250,.15)" : "rgba(255,255,255,.06)",
      border: settings.claudeApiKey ? "1px solid rgba(167,139,250,.35)" : "1px solid rgba(255,255,255,.1)",
      color: settings.claudeApiKey ? "#a78bfa" : "#555e73",
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