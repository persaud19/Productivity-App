// Mission Log — Finance Tab Module
// Standalone module: envelope budgeting, transaction import, spending analytics
// Depends on window.__ml (set by app.js) and React globals
(function () {
  'use strict';

  // Pull shared utilities from the bridge app.js sets up
  const { DB, KEYS, getToday, fmtDate, fmtLong, addDays, daysBetween, getSundayKey, callClaude, C, CL, inp, Lbl, SectionHead } = window.__ml;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  // ── Finance Key Router ──────────────────────────────────────────────────────
  // Routes all finance KEYS to household paths when a household is active,
  // falling back to personal paths when there is no household.
  const FK = {
    envelopes:        m  => window.__current_household_id ? KEYS.hhFinanceEnvelopes(m)        : KEYS.financeEnvelopes(m),
    defaultEnvelopes: () => window.__current_household_id ? KEYS.hhFinanceDefaultEnvelopes()  : KEYS.financeDefaultEnvelopes(),
    envelopeCatalog:  () => window.__current_household_id ? KEYS.hhFinanceEnvelopeCatalog()   : KEYS.financeEnvelopeCatalog(),
    transactions:     m  => window.__current_household_id ? KEYS.hhFinanceTransactions(m)     : KEYS.financeTransactions(m),
    allMonths:        () => window.__current_household_id ? KEYS.hhFinanceAllMonths()          : KEYS.financeAllMonths(),
    rollover:         m  => window.__current_household_id ? KEYS.hhFinanceRollover(m)          : KEYS.financeRollover(m),
    income:           m  => window.__current_household_id ? KEYS.hhFinanceIncome(m)            : KEYS.financeIncome(m),
    merchantRules:    () => window.__current_household_id ? KEYS.hhMerchantRules()             : KEYS.merchantRules(),
    customSubCats:    () => window.__current_household_id ? KEYS.hhCustomSubCats()             : KEYS.customSubCats(),
    receipt:          id => window.__current_household_id ? KEYS.hhReceipt(id)                 : KEYS.receipt(id),
  };

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
  { id: "fixed_costs",     name: "Fixed Costs",       color: "#94a3b8", icon: "🏦", highlevel: "Fixed"         },
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


// Icon picker groups for new envelope creation
const ICON_GROUPS = [
  { label: "Food",     icons: ["🍽","🍕","🍔","🛒","☕","🥡","🧁","🍷","🥩","🍜"] },
  { label: "Home",     icons: ["🏠","🛋","🔧","🧹","💡","🚿","🏡","🛏","🪴","🧺"] },
  { label: "Transport",icons: ["🚗","✈️","🚌","⛽","🚂","🛵","🚲","🚕","🛳","🏍"] },
  { label: "Health",   icons: ["💊","🏥","💪","🧘","🦷","🩺","🥗","🧬","🧴","❤️"] },
  { label: "Finance",  icons: ["💰","🏦","💳","📈","💵","🪙","📉","💹","🤑","💸"] },
  { label: "Shopping", icons: ["🛍","👗","📦","👟","🕶","💍","🧥","👜","🎒","🧣"] },
  { label: "Fun",      icons: ["🎬","🎮","🎵","📺","🎭","🃏","🎲","🌿","⛳","🎾"] },
  { label: "Other",    icons: ["📋","🎁","📚","💼","🎓","✨","⭐","🔑","🏆","🎯"] },
];

// Preset color palette for envelopes
const ENV_COLORS = [
  "#94a3b8","#fb923c","#60a5fa","#f4a823","#a78bfa","#ec4899",
  "#f97316","#8b5cf6","#4ade80","#06b6d4","#ef4444","#22c55e",
  "#f43f5e","#eab308","#34d399","#64748b","#e879f9","#38bdf8",
];

// FinanceTab component
function FinanceTab({ settings }) {
  const [view, setView] = useState("envelopes"); // envelopes | transactions | summary | import
  const [currentMonth, setCurrentMonth] = useState(() => getToday().slice(0, 7));
  const [envelopes, setEnvelopes] = useState([]); // [{ ...default, allocated: 0 }]
  const [transactions, setTransactions] = useState([]);
  const [rolloverIn, setRolloverIn] = useState({});
  const [allMonths, setAllMonths] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [flaggedScanIds, setFlaggedScanIds] = useState(new Set());
  const [flaggedCardIds, setFlaggedCardIds] = useState(new Set());
  const [deduping, setDeduping] = useState(false);
  const [merchantRules, setMerchantRules] = useState(MERCHANT_RULES_SEED);
  const [showRulesTable, setShowRulesTable] = useState(false);
  const [runningRules, setRunningRules] = useState(false);
  const [rulesRunMsg, setRulesRunMsg] = useState("");
  const [envelopeCatalog, setEnvelopeCatalog] = useState(FINANCE_ENVELOPES_DEFAULT);
  const [showManageEnvelopes, setShowManageEnvelopes] = useState(false);
  const [newEnvForm, setNewEnvForm] = useState({ name: "", icon: "📋", color: "#6b7280", highlevel: "" });
  const [iconGroupTab, setIconGroupTab] = useState(0);
  const [rulePrompt, setRulePrompt] = useState(null); // {txn, suggestedName, envelopeId, subCat}
  const [ruleForm, setRuleForm] = useState({ keyword: "", displayName: "", envelopeId: "food_drink", subCat: "" });
  const [vaguePrompt, setVaguePrompt] = useState(null); // {txn, suggestions: [{label, envelopeId, subCat}]}
  const [editTxnForm, setEditTxnForm] = useState({ envelopeId: "other", subCat: "" });
  const [txnReceiptData, setTxnReceiptData] = useState(null); // receipt linked to editingTxn
  const [editingIncome, setEditingIncome] = useState(null);
  const [editIncomeForm, setEditIncomeForm] = useState({ source: "", amount: "", date: "", type: "other" });
  const [customSubCats, setCustomSubCats] = useState({});
  const [dismissedHouseholdBanner, setDismissedHouseholdBanner] = useState(false);
  const [coachReport, setCoachReport] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const scanRef = useRef(null);
  const cardFileRef = useRef(null);

  const loadMonth = useCallback(async (month) => {
    setLoading(true);
    const saved = await DB.get(FK.envelopes(month));
    const txns = await DB.get(FK.transactions(month));
    const rollover = await DB.get(FK.rollover(month));
    const months = await DB.get(FK.allMonths());

    // Load user's envelope catalog (custom + default, with hidden flags)
    const catalogData = await DB.get(FK.envelopeCatalog());
    const catalog = (catalogData && catalogData.length) ? catalogData : FINANCE_ENVELOPES_DEFAULT;
    setEnvelopeCatalog(catalog);

    // If this month has no saved allocations, fall back to the default budget template
    const defaultEnvs = (!saved || !saved.length) ? (await DB.get(FK.defaultEnvelopes()) || []) : [];
    const sourceEnvs = (saved && saved.length) ? saved : defaultEnvs;
    const baseEnvelopes = catalog.map(def => {
      const s = sourceEnvs.find(e => e.id === def.id);
      return { ...def, allocated: s?.allocated ?? 0 };
    });
    const incomeData = await DB.get(FK.income(month));
    const rulesData = await DB.get(FK.merchantRules());
    const customSubData = await DB.get(FK.customSubCats());
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

  // Load receipt data when a transaction with a linked receipt is opened
  useEffect(() => {
    if (editingTxn?.receiptId) {
      DB.get(FK.receipt(editingTxn.receiptId)).then(r => setTxnReceiptData(r || null));
    } else {
      setTxnReceiptData(null);
    }
  }, [editingTxn?.receiptId]);

  const saveEnvelopes = async (updated) => {
    setEnvelopes(updated);
    await DB.set(FK.envelopes(currentMonth), updated);
  };

  const saveEnvelopeCatalog = async (updated) => {
    setEnvelopeCatalog(updated);
    await DB.set(FK.envelopeCatalog(), updated);
    // Also rebuild current month's envelopes so new/hidden envelopes take effect
    const saved = await DB.get(FK.envelopes(currentMonth)) || [];
    const newMonthEnvs = updated.map(def => {
      const s = saved.find(e => e.id === def.id);
      return { ...def, allocated: s?.allocated ?? 0 };
    });
    setEnvelopes(newMonthEnvs);
  };

  const handleAddEnvelope = async () => {
    if (!newEnvForm.name.trim()) return;
    const id = "env_u" + Date.now();
    const newEnv = { id, name: newEnvForm.name.trim(), icon: newEnvForm.icon, color: newEnvForm.color, highlevel: newEnvForm.highlevel, custom: true };
    const updated = [...envelopeCatalog, newEnv];
    await saveEnvelopeCatalog(updated);
    setNewEnvForm({ name: "", icon: "📋", color: "#6b7280", highlevel: "" });
  };

  const handleToggleEnvelopeVisibility = async (id) => {
    const updated = envelopeCatalog.map(e => e.id === id ? { ...e, hidden: !e.hidden } : e);
    await saveEnvelopeCatalog(updated);
  };

  const handleDeleteCustomEnvelope = async (id) => {
    const updated = envelopeCatalog.filter(e => e.id !== id);
    await saveEnvelopeCatalog(updated);
  };

  const setDefaultBudget = async () => {
    await DB.set(FK.defaultEnvelopes(), envelopes);
    setImportMsg("Default budget saved — all months without a custom budget will now use these values.");
  };

  const handleScanStatement = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true); setScanResults(null); setImportMsg("Scanning image…");
    try {
      const base64 = await new Promise(resolve => { const r = new FileReader(); r.onload = () => resolve(r.result.split(",")[1]); r.readAsDataURL(file); });
      const mediaType = file.type || "image/jpeg";
      const envelopeList = envelopeCatalog.map(e => `${e.id}: ${e.name}`).join(", ");
      const todayStr = getToday(); // e.g. "2026-04-09"
      const currentYear = todayStr.slice(0, 4);
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 45000);
      const res = await fetch("/api/claude", {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 3000, messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: `Today is ${todayStr}. Extract all purchase transactions from this statement screenshot. Ignore payment rows, balance rows, and totals.
Return ONLY a JSON array, no markdown:
[{"date":"YYYY-MM-DD","amount":45.99,"desc":"MERCHANT NAME","card":"Amex","envelopeId":"food_drink","subCat":"Grocery"}]
- date: use full YYYY-MM-DD format. If the statement only shows month/day without year, use ${currentYear} as the year.
- amount: positive number
- card: Amex, TD Visa, CIBC, PC Financial, or Unknown
- envelopeId: best match from — ${envelopeList}
- subCat: short sub-category (e.g. Grocery, Coffee, Gas) or ""` }
        ]}] })
      });
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch(e) {
        setImportMsg(rawText.trim().startsWith("<") ? "Scan failed: Netlify function timed out — try again." : "Scan failed: Unexpected response.");
        setScanning(false); return;
      }
      if (data.error || data.type === "error") {
        setImportMsg("Scan failed: " + (data.error?.message || "API error"));
        setScanning(false); return;
      }
      const reply = data.content?.[0]?.text || "";
      const match = reply.match(/\[[\s\S]*\]/);
      if (!match) { setImportMsg("No transactions found in image — try a clearer screenshot."); setScanning(false); return; }
      const txns = JSON.parse(match[0]);
      // Apply merchant rules as fallback for uncategorized entries
      const applyRules = (desc, envelopeId) => {
        if (envelopeId && envelopeId !== "other") return envelopeId;
        const d = (desc || "").toLowerCase();
        const rule = merchantRules.find(r => d.includes(r.keyword.toLowerCase()));
        return rule ? rule.envelopeId : (envelopeId || "other");
      };
      // Sanitize date: if year is missing, empty, or looks wrong (pre-2020 or >1yr future) fix it
      const sanitizeDate = raw => {
        if (!raw || raw.length < 7) return `${currentYear}-${todayStr.slice(5, 7)}-01`;
        const yr = parseInt(raw.slice(0, 4));
        if (yr < 2020 || yr > parseInt(currentYear) + 1) {
          // Keep month/day, correct the year
          return `${currentYear}-${raw.slice(5)}`;
        }
        return raw;
      };
      setScanResults(txns.map(t => {
        const cleanDate = sanitizeDate(t.date);
        return {
          ...t,
          date: cleanDate,
          month: cleanDate.slice(0, 7),
          id: txnId("scan", cleanDate, t.amount, t.desc),
          isRefund: false,
          category: "Scanned",
          highlevel: "",
          envelopeId: applyRules(t.desc, t.envelopeId),
          subCat: t.subCat || ""
        };
      }));
      setImportMsg("");
    } catch(err) {
      setImportMsg(err.name === "AbortError" ? "Scan timed out — try a smaller/clearer image." : "Scan failed: " + err.message);
    }
    setScanning(false);
    if (scanRef.current) scanRef.current.value = "";
  };

  const confirmScan = async () => {
    if (!scanResults?.length) return;
    const byMonth = {};
    scanResults.forEach(t => {
      const txn = { ...t, needsReview: flaggedScanIds.has(t.id) };
      if (!byMonth[txn.month]) byMonth[txn.month] = [];
      byMonth[txn.month].push(txn);
    });
    for (const m of Object.keys(byMonth)) {
      const existing = await DB.get(FK.transactions(m)) || [];
      const ids = new Set(existing.map(t => t.id));
      await DB.set(FK.transactions(m), [...existing, ...byMonth[m].filter(t => !ids.has(t.id))]);
    }
    const months = [...new Set([...allMonths, ...Object.keys(byMonth)])].sort();
    await DB.set(FK.allMonths(), months); setAllMonths(months);
    setScanResults(null);
    const flagCount = flaggedScanIds.size;
    setFlaggedScanIds(new Set());
    // Switch to the month that was actually imported (fixes wrong-month display bug)
    const targetMonth = Object.keys(byMonth).sort().pop() || currentMonth;
    if (targetMonth !== currentMonth) setCurrentMonth(targetMonth);
    await loadMonth(targetMonth);
    setImportMsg(`Imported ${scanResults.length} transaction${scanResults.length !== 1 ? "s" : ""}${flagCount ? ` · ${flagCount} flagged for review` : ""}.`);
    setView("transactions");
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

      const envelopeList = envelopeCatalog.map(env => `  ${env.id}: ${env.name}`).join("\n");

      // Batch rows to avoid Netlify's 10-second function timeout on large CSVs
      const BATCH_SIZE = 50;
      const totalBatches = Math.ceil(rawRows.length / BATCH_SIZE);
      const catMap = {};
      const stripFences = str => { const m = str.match(/```(?:json)?\s*([\s\S]*?)```/); return m ? m[1].trim() : str.trim(); };
      const srcLabel = file.name.replace(/\.(csv|xlsx?|txt)$/i, "");

      for (let b = 0; b < totalBatches; b++) {
        const bStart = b * BATCH_SIZE;
        const bRows = rawRows.slice(bStart, bStart + BATCH_SIZE);
        setImportMsg(totalBatches > 1 ? `Processing batch ${b + 1} of ${totalBatches}…` : "Processing…");

        const txnList = bRows.map((r, j) => `${bStart + j}: ${r.date} | ${r.rawDesc}${r.isRefund ? " [REFUND]" : ""} | $${r.amount}`).join("\n");

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
Return exactly ${bRows.length} objects. No markdown.`;
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
Return exactly ${bRows.length} objects. No markdown.`;
        }

        const controller = new AbortController();
        setTimeout(() => controller.abort(), 25000);

        const res = await fetch("/api/claude", {
          method: "POST", signal: controller.signal,
          headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
          body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 4096, messages: [{ role: "user", content: prompt }] })
        });
        const rawText = await res.text();
        let data;
        try { data = JSON.parse(rawText); } catch(jsonErr) {
          if (rawText.trim().startsWith("<")) {
            setImportMsg("Error: Netlify function timed out or is unreachable. If this keeps happening, try a smaller date range. (Check that ANTHROPIC_API_KEY is set in Netlify \u2192 Site configuration \u2192 Environment variables.)");
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

        const cleaned = stripFences(reply);
        const arrMatch = cleaned.match(/\[[\s\S]*\]/);
        if (!arrMatch) { setImportMsg(`Could not parse Claude response (batch ${b + 1}) — ` + reply.slice(0, 120)); setCardParsing(false); if (cardFileRef.current) cardFileRef.current.value = ""; return; }
        JSON.parse(arrMatch[0]).forEach(c => { if (c.idx != null) catMap[c.idx] = c; });
      }

      if (importMode === "bank_statement") {
        const expenses = [], incItems = [];
        rawRows.forEach((r, i) => {
          const cat = catMap[i] || {};
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
          const cat = catMap[i] || {};
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
      const months = await DB.get(FK.allMonths()) || [];
      let totalRemoved = 0;
      for (const m of months) {
        // Dedupe transactions
        const txns = await DB.get(FK.transactions(m)) || [];
        const seenIds = new Set();
        const clean = txns.filter(t => {
          if (!t.id || seenIds.has(t.id)) return false;
          seenIds.add(t.id); return true;
        });
        if (clean.length < txns.length) {
          totalRemoved += txns.length - clean.length;
          await DB.set(FK.transactions(m), clean);
        }
        // Dedupe income
        const inc = await DB.get(FK.income(m)) || [];
        const seenInc = new Set();
        const cleanInc = inc.filter(i => {
          if (!i.id || seenInc.has(i.id)) return false;
          seenInc.add(i.id); return true;
        });
        if (cleanInc.length < inc.length) {
          totalRemoved += inc.length - cleanInc.length;
          await DB.set(FK.income(m), cleanInc);
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
        const existing = await DB.get(FK.transactions(m)) || [];
        const ids = new Set(existing.map(t => t.id));
        await DB.set(FK.transactions(m), [...existing, ...byMonth[m].map(t => ({ ...t, needsReview: flaggedCardIds.has(t.id) })).filter(t => !ids.has(t.id))]);
      }
      setFlaggedCardIds(new Set());
      const months = [...new Set([...allMonths, ...Object.keys(byMonth)])].sort();
      await DB.set(FK.allMonths(), months); setAllMonths(months);
      const ruleCount = ruled.filter(t => t._ruleApplied).length;
      const msg = `Saved ${ruled.length} expense${ruled.length !== 1 ? "s" : ""}${ruleCount ? " (" + ruleCount + " matched rules)" : ""}`;
      setImportMsg(incItems.length ? msg + " + " + incItems.length + " income entries from " + label + "." : msg + " from " + label + ".");
    }

    // Save income entries
    if (incItems.length) {
      for (const inc of incItems) {
        const m = inc.month;
        if (!m) continue;
        const existing = await DB.get(FK.income(m)) || [];
        const ids = new Set(existing.map(i => i.id));
        if (!ids.has(inc.id)) await DB.set(FK.income(m), [...existing, inc]);
      }
      if (!expenses.length) setImportMsg(`Saved ${incItems.length} income entries from ${label}.`);
    }

    setCardResults(null);
    await loadMonth(currentMonth);
    setView(incItems.length && !expenses.length ? "income" : "transactions");
  };

  const handleEditTxn = async (txn, newEnvelopeId, newSubCat) => {
    const subCatVal = newSubCat !== undefined ? newSubCat : (txn.subCat || "");
    const txnMonth = txn.month || txn.date?.slice(0, 7) || currentMonth;
    if (txnMonth === currentMonth) {
      // In-memory update for current month
      const updated = transactions.map(t => t.id === txn.id ? { ...t, envelopeId: newEnvelopeId, subCat: subCatVal } : t);
      setTransactions(updated);
      await DB.set(FK.transactions(currentMonth), updated);
    } else {
      // Transaction belongs to a different month — load that month from Firebase
      const existing = await DB.get(FK.transactions(txnMonth)) || [];
      const updated = existing.map(t => t.id === txn.id ? { ...t, envelopeId: newEnvelopeId, subCat: subCatVal } : t);
      await DB.set(FK.transactions(txnMonth), updated);
    }
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
    const txnMonth = txn.month || txn.date?.slice(0, 7) || currentMonth;
    if (txnMonth === currentMonth) {
      const updated = transactions.filter(t => t.id !== txn.id);
      setTransactions(updated);
      await DB.set(FK.transactions(currentMonth), updated);
    } else {
      const existing = await DB.get(FK.transactions(txnMonth)) || [];
      await DB.set(FK.transactions(txnMonth), existing.filter(t => t.id !== txn.id));
    }
    setEditingTxn(null);
  };

  // Apply a set of rules across ALL historical months and update Firebase
  const handleRunRules = async (rulesToApply) => {
    if (!rulesToApply || rulesToApply.length === 0) return;
    setRunningRules(true);
    setRulesRunMsg("");
    try {
      const allMonths = await DB.get(FK.allMonths()) || [];
      let totalUpdated = 0;
      let monthsAffected = 0;
      await Promise.all(allMonths.map(async (m) => {
        const txns = await DB.get(FK.transactions(m)) || [];
        if (txns.length === 0) return;
        const updated = applyMerchantRules(txns, rulesToApply);
        // Count actual changes
        let changed = 0;
        for (let i = 0; i < txns.length; i++) {
          if (txns[i].envelopeId !== updated[i].envelopeId || txns[i].subCat !== updated[i].subCat) changed++;
        }
        if (changed > 0) {
          await DB.set(FK.transactions(m), updated);
          totalUpdated += changed;
          monthsAffected++;
          // Refresh current month in UI if it was one of the updated months
          if (m === currentMonth) {
            setTransactions(updated);
          }
        }
      }));
      setRulesRunMsg(totalUpdated > 0
        ? `✓ Updated ${totalUpdated} transaction${totalUpdated !== 1 ? "s" : ""} across ${monthsAffected} month${monthsAffected !== 1 ? "s" : ""}`
        : "✓ No changes needed — all transactions already match rules"
      );
    } catch (err) {
      setRulesRunMsg("⚠ Error running rules: " + err.message);
    }
    setRunningRules(false);
  };

  const handleSaveRule = async () => {
    if (!ruleForm.keyword.trim()) return;
    const newRule = { id: "mr_u" + Date.now(), keyword: ruleForm.keyword.trim().toLowerCase(), displayName: ruleForm.displayName.trim() || ruleForm.keyword.trim(), envelopeId: ruleForm.envelopeId, subCat: ruleForm.subCat.trim() };
    const updated = [...merchantRules.filter(r => r.keyword !== newRule.keyword), newRule];
    setMerchantRules(updated);
    await DB.set(FK.merchantRules(), updated);
    setRulePrompt(null);
    // Auto-run the new rule against all historical data
    await handleRunRules([newRule]);
  };

  const handleDeleteRule = async (id) => {
    const updated = merchantRules.filter(r => r.id !== id);
    setMerchantRules(updated);
    await DB.set(FK.merchantRules(), updated);
  };

  const handleAddRule = async () => {
    if (!ruleForm.keyword.trim()) return;
    const newRule = { id: "mr_u" + Date.now(), keyword: ruleForm.keyword.trim().toLowerCase(), displayName: ruleForm.displayName.trim() || ruleForm.keyword.trim(), envelopeId: ruleForm.envelopeId, subCat: ruleForm.subCat.trim() };
    const updated = [...merchantRules.filter(r => r.keyword !== newRule.keyword), newRule];
    setMerchantRules(updated);
    await DB.set(FK.merchantRules(), updated);
    setRuleForm({ keyword: "", displayName: "", envelopeId: "food_drink", subCat: "" });
    // Auto-run the new rule against all historical data
    await handleRunRules([newRule]);
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
      const saved = await DB.get(FK.allMonths()) || [];
      monthsToLoad = [...new Set([...saved, ...recentMonths])].sort().reverse(); // newest first
    }

    const monthData = await Promise.all(monthsToLoad.map(async m => {
      const txns = await DB.get(FK.transactions(m)) || [];
      const inc  = await DB.get(FK.income(m))       || [];
      const envs = await DB.get(FK.envelopes(m))    || [];
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
      const topEnvs = envelopeCatalog.filter(e => allByEnv[e.id]).sort((a, b) => (allByEnv[b.id] || 0) - (allByEnv[a.id] || 0));
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
      const envLines = envelopeCatalog.filter(e => byEnv[e.id]).map(e => {
        const budget = envs.find(ev => ev.id === e.id)?.allocated || 0;
        return `${e.name} $${byEnv[e.id].toFixed(0)}${budget > 0 ? "/" + budget.toFixed(0) : ""}`;
      });
      if (envLines.length) ctx += `  Categories: ${envLines.join(", ")}\n`;

      // Sub-cat breakdown for all categories that have it
      const subBreakdowns = [];
      envelopeCatalog.forEach(e => {
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
    setCoachLoading(true); setCoachReport("");
    try {
      const ctx = await buildFinanceContext();
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 45000);
      const res = await fetch("/api/claude", {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 1200,
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
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch(e) {
        setCoachReport(rawText.trim().startsWith("<") ? "Error: Netlify function timed out — try again in a moment." : "Error: Unexpected response — " + rawText.slice(0, 100));
        setCoachLoading(false); return;
      }
      if (data.error || data.type === "error") {
        setCoachReport("Error: " + (data.error?.message || JSON.stringify(data.error) || "API error"));
        setCoachLoading(false); return;
      }
      setCoachReport(data.content?.[0]?.text || "No report returned — check that your data has at least one month imported.");
    } catch(err) {
      setCoachReport(err.name === "AbortError" ? "Timed out — try again." : "Error: " + err.message);
    }
    setCoachLoading(false);
  };

  const handleChatSend = async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    const newMessages = [...chatMessages, { role: "user", content: msg }];
    setChatMessages(newMessages); setChatInput(""); setChatLoading(true);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    try {
      const ctx = await buildFinanceContext(true); // loads ALL months
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 45000);
      const res = await fetch("/api/claude", {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001", max_tokens: 900,
          system: `You are a personal financial coach for Ryan and Sabrina Persaud (Canadian couple). You have their COMPLETE financial history below — every month of data available. Answer questions using ONLY this data. Always cite specific months and dollar amounts. Be direct, specific, and actionable. Never give generic advice — every answer must reference their actual numbers.\n\n${ctx}`,
          messages: newMessages.slice(-10).map(m => ({ role: m.role, content: m.content }))
        })
      });
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch(e) {
        const errMsg = rawText.trim().startsWith("<") ? "Netlify function timed out — try again." : "Unexpected response — " + rawText.slice(0, 100);
        setChatMessages(m => [...m, { role: "assistant", content: "Error: " + errMsg }]);
        setChatLoading(false); return;
      }
      if (data.error || data.type === "error") {
        setChatMessages(m => [...m, { role: "assistant", content: "Error: " + (data.error?.message || JSON.stringify(data.error)) }]);
        setChatLoading(false); return;
      }
      const reply = data.content?.[0]?.text || "No response received.";
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
    await DB.set(FK.customSubCats(), updated);
  };

  // Resolve a vague merchant: user picks one of the 3 suggestions
  const handleVaguePick = async (txn, pick) => {
    const updated = transactions.map(t => t.id === txn.id ? { ...t, envelopeId: pick.envelopeId, subCat: pick.subCat } : t);
    setTransactions(updated);
    await DB.set(FK.transactions(currentMonth), updated);
    // Also save as a rule
    const newRule = { id: "mr_u" + Date.now(), keyword: pick.keyword.toLowerCase(), displayName: pick.label, envelopeId: pick.envelopeId, subCat: pick.subCat };
    const updatedRules = [...merchantRules.filter(r => r.keyword !== newRule.keyword), newRule];
    setMerchantRules(updatedRules);
    await DB.set(FK.merchantRules(), updatedRules);
    setVaguePrompt(null);
  };

  const handleAddIncome = async () => {
    const amt = parseFloat(addIncomeForm.amount);
    if (!addIncomeForm.source.trim() || isNaN(amt) || amt <= 0) return;
    const entryMonth = addIncomeForm.date.slice(0, 7);
    const entry = { id: "inc_" + Date.now(), date: addIncomeForm.date, month: entryMonth, amount: amt, source: addIncomeForm.source.trim(), type: addIncomeForm.type };
    if (entryMonth === currentMonth) {
      // Same month — update in-memory state and save
      const updated = [...income, entry];
      setIncome(updated);
      await DB.set(FK.income(currentMonth), updated);
    } else {
      // Different month — load that month's array from Firebase and append there only
      const existing = await DB.get(FK.income(entryMonth)) || [];
      await DB.set(FK.income(entryMonth), [...existing, entry]);
      // Ensure the target month is in the months index
      if (!allMonths.includes(entryMonth)) {
        const updatedMonths = [...allMonths, entryMonth].sort();
        setAllMonths(updatedMonths);
        await DB.set(FK.allMonths(), updatedMonths);
      }
    }
    setShowAddIncome(false);
    setAddIncomeForm({ date: getToday(), amount: "", source: "Salary", type: "salary" });
  };

  const handleDeleteIncome = async (id) => {
    const entry = income.find(i => i.id === id);
    const entryMonth = entry?.month || entry?.date?.slice(0, 7) || currentMonth;
    if (entryMonth === currentMonth) {
      const updated = income.filter(i => i.id !== id);
      setIncome(updated);
      await DB.set(FK.income(currentMonth), updated);
    } else {
      const existing = await DB.get(FK.income(entryMonth)) || [];
      await DB.set(FK.income(entryMonth), existing.filter(i => i.id !== id));
    }
  };

  const handleEditIncome = async () => {
    if (!editingIncome) return;
    const amt = parseFloat(editIncomeForm.amount);
    if (!editIncomeForm.source.trim() || isNaN(amt) || amt <= 0) return;
    const originalMonth = editingIncome.month || editingIncome.date?.slice(0, 7) || currentMonth;
    const newMonth = editIncomeForm.date.slice(0, 7);
    const updatedEntry = { ...editingIncome, source: editIncomeForm.source.trim(), amount: amt, date: editIncomeForm.date, month: newMonth, type: editIncomeForm.type };
    if (originalMonth === newMonth && originalMonth === currentMonth) {
      // Same month, in-memory update
      const updated = income.map(i => i.id === editingIncome.id ? updatedEntry : i);
      setIncome(updated);
      await DB.set(FK.income(currentMonth), updated);
    } else {
      // Remove from original month
      const origArr = originalMonth === currentMonth ? income : (await DB.get(FK.income(originalMonth)) || []);
      const withoutOld = origArr.filter(i => i.id !== editingIncome.id);
      await DB.set(FK.income(originalMonth), withoutOld);
      if (originalMonth === currentMonth) setIncome(withoutOld);
      // Add to new month
      const newArr = newMonth === currentMonth ? withoutOld : (await DB.get(FK.income(newMonth)) || []);
      const withNew = newMonth === currentMonth ? [...income.filter(i => i.id !== editingIncome.id), updatedEntry] : [...newArr, updatedEntry];
      await DB.set(FK.income(newMonth), withNew);
      if (newMonth === currentMonth) setIncome(withNew);
    }
    setEditingIncome(null);
  };

  // Move an income entry → transactions (user can then recategorize it)
  const handleMoveIncomeToTxn = async () => {
    if (!editingIncome) return;
    if (!window.confirm("Move this entry to Transactions? It will appear as an uncategorized expense.")) return;
    const inc = editingIncome;
    const txn = { id: "moved_" + Date.now(), date: inc.date, month: inc.month || inc.date.slice(0, 7), amount: inc.amount, desc: inc.source, isRefund: false, card: "Bank", category: "Bank", envelopeId: "other", subCat: "", highlevel: "" };
    const updInc = income.filter(i => i.id !== inc.id);
    setIncome(updInc);
    await DB.set(FK.income(currentMonth), updInc);
    const existingTxns = await DB.get(FK.transactions(txn.month)) || [];
    await DB.set(FK.transactions(txn.month), [...existingTxns, txn]);
    setTransactions(prev => [...prev, txn]);
    setEditingIncome(null);
    setView("transactions");
  };

  // Move a transaction → income (e.g. a deposit miscategorized as expense)
  const handleMoveTxnToIncome = async () => {
    if (!editingTxn) return;
    if (!window.confirm("Move this entry to Income?")) return;
    const t = editingTxn;
    const inc = { id: "moved_" + Date.now(), date: t.date, month: t.month || t.date.slice(0, 7), amount: t.amount, source: t.desc || "Income", type: "other", desc: t.desc || "" };
    const updTxns = transactions.filter(x => x.id !== t.id);
    setTransactions(updTxns);
    await DB.set(FK.transactions(t.month || currentMonth), updTxns);
    const existingInc = await DB.get(FK.income(inc.month)) || [];
    await DB.set(FK.income(inc.month), [...existingInc, inc]);
    setIncome(prev => [...prev, inc]);
    setEditingTxn(null);
    setView("income");
  };

  const handleAddTxn = async () => {
    const amt = parseFloat(addTxnForm.amount);
    if (!addTxnForm.desc.trim() || isNaN(amt) || amt <= 0) return;
    const month = addTxnForm.date.slice(0, 7);
    const txn = { id: "manual_" + Date.now(), date: addTxnForm.date, month, card: addTxnForm.card, amount: amt, isRefund: false, category: "Manual", subCat: addTxnForm.subCat || "", desc: addTxnForm.desc.trim(), highlevel: "", envelopeId: addTxnForm.envelopeId };
    const existing = await DB.get(FK.transactions(month)) || [];
    await DB.set(FK.transactions(month), [...existing, txn]);
    const months = [...new Set([...allMonths, month])].sort();
    await DB.set(FK.allMonths(), months); setAllMonths(months);
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
    const prevEnv = await DB.get(FK.envelopes(prevMonth)) || [];
    const prevTxns = await DB.get(FK.transactions(prevMonth)) || [];
    const prevSpent = {};
    prevTxns.forEach(t => { if (!t.isRefund) prevSpent[t.envelopeId] = (prevSpent[t.envelopeId] || 0) + t.amount; });
    const rollover = {};
    prevEnv.forEach(e => {
      const unspent = (e.allocated || 0) - (prevSpent[e.id] || 0);
      if (unspent > 0) rollover[e.id] = Math.round(unspent * 100) / 100;
    });
    setRolloverIn(rollover);
    await DB.set(FK.rollover(currentMonth), rollover);
  };

  const monthLabel = m => new Date(m + "-15").toLocaleDateString("en-CA", { month: "long", year: "numeric" });
  const fmt = n => "$" + Math.abs(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // ── Render ──────────────────────────────────────────────────────────────
  // Derive active main tab from view
  const finTab = ["envelopes","transactions","income"].includes(view) ? "budget"
    : ["summary","coach"].includes(view) ? "insights"
    : "import";

  const mainTabBtn = (id, label, col, defaultView) => /*#__PURE__*/React.createElement("button", {
    onClick: () => { if (finTab !== id) setView(defaultView); },
    style: { flex: 1, padding: "12px 0", border: "none", background: finTab === id ? `rgba(${col},0.12)` : "transparent", cursor: "pointer", fontSize: 11, fontWeight: finTab === id ? 800 : 500, fontFamily: "'Syne',sans-serif", letterSpacing: ".06em", color: finTab === id ? `rgb(${col})` : "#6b7585", borderBottom: `2px solid ${finTab === id ? `rgb(${col})` : "transparent"}`, whiteSpace: "nowrap", transition: "all .15s" }
  }, label);

  const subTabBtn = (id, label, col) => /*#__PURE__*/React.createElement("button", {
    onClick: () => setView(id),
    style: { padding: "6px 14px", border: `1px solid ${view === id ? col : "rgba(255,255,255,.08)"}`, background: view === id ? `${col}18` : "transparent", borderRadius: 20, cursor: "pointer", fontSize: 11, fontWeight: view === id ? 700 : 400, color: view === id ? col : "var(--text-muted)", whiteSpace: "nowrap", transition: "all .15s" }
  }, label);

  if (loading) return /*#__PURE__*/React.createElement("div", { style: { textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 13 } }, "Loading...");

  return /*#__PURE__*/React.createElement("div", null,

    // Solo-mode banner — dismissable, shown when no household is set up
    !window.__current_household_id && !dismissedHouseholdBanner && /*#__PURE__*/React.createElement("div", {
      style: { background: "rgba(96,165,250,.08)", border: "1px solid rgba(96,165,250,.2)", borderRadius: 10, padding: "10px 14px", margin: "12px 13px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }
    },
      /*#__PURE__*/React.createElement("p", { style: { fontSize: 12, color: "#60a5fa", margin: 0 } }, "\uD83C\uDFE0 Set up a household to share finances with your family"),
      /*#__PURE__*/React.createElement("button", { onClick: () => setDismissedHouseholdBanner(true), style: { background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 16, cursor: "pointer", padding: "0 4px" } }, "\u00D7")
    ),

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

    // Main tabs (3 consolidated)
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", borderBottom: "1px solid rgba(255,255,255,.06)", marginBottom: 12 } },
      mainTabBtn("budget",   "💰 BUDGET",   "52,211,153",  "envelopes"),
      mainTabBtn("insights", "📊 INSIGHTS", "251,146,60",  "summary"),
      mainTabBtn("import",   "📥 IMPORT",   "167,139,250", "import")
    ),

    // Secondary nav row
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", marginBottom: 16, paddingBottom: 2 } },
      finTab === "budget" && /*#__PURE__*/React.createElement(React.Fragment, null,
        subTabBtn("envelopes",    "Envelopes",    "#34d399"),
        subTabBtn("transactions", "Money Out", "#60a5fa"),
        subTabBtn("income",       "Money In",  "#4ade80")
      ),
      finTab === "insights" && /*#__PURE__*/React.createElement(React.Fragment, null,
        subTabBtn("summary", "Summary", "#f4a823"),
        subTabBtn("coach",   "Coach",   "#fb923c")
      ),
      finTab === "import" && /*#__PURE__*/React.createElement(React.Fragment, null,
        subTabBtn("import", "Import CSV", "#a78bfa"),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => { setRuleForm({ keyword: "", displayName: "", envelopeId: "food_drink", subCat: "" }); setShowRulesTable(true); },
          style: { padding: "6px 14px", border: "1px solid rgba(167,139,250,.25)", background: "transparent", borderRadius: 20, cursor: "pointer", fontSize: 11, fontWeight: 400, color: "var(--text-muted)", whiteSpace: "nowrap" }
        }, "⚡ Rules")
      )
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

      // Action buttons row
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" } },
        allMonths.some(m => m < currentMonth) && /*#__PURE__*/React.createElement("button", {
          onClick: computeRollover,
          style: { background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 8, padding: "6px 14px", fontSize: 11, color: "#4ade80", fontWeight: 700, cursor: "pointer" }
        }, "\u21A9 Pull rollover from " + monthLabel(allMonths.filter(m=>m<currentMonth).sort().pop())),
        totalAllocated > 0 && /*#__PURE__*/React.createElement("button", {
          onClick: setDefaultBudget,
          style: { background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 8, padding: "6px 14px", fontSize: 11, color: "#a78bfa", fontWeight: 700, cursor: "pointer" }
        }, "\uD83D\uDCCC Set as Default Budget"),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => setShowManageEnvelopes(true),
          style: { background: "rgba(52,211,153,.08)", border: "1px solid rgba(52,211,153,.2)", borderRadius: 8, padding: "6px 14px", fontSize: 11, color: "#34d399", fontWeight: 700, cursor: "pointer", marginLeft: "auto" }
        }, "\u2699\uFE0F Manage Envelopes")
      ),

      // Envelope list (hidden envelopes excluded from main view but still tracked)
      envelopes.filter(env => !env.hidden).map(env => {
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
            (() => {
              const envTxns = [...transactions].filter(t => t.envelopeId === env.id && !t.isRefund).sort((a,b) => b.date.localeCompare(a.date));
              if (envTxns.length === 0) return /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: 0 } }, "No transactions yet");
              // Group by subCat
              const groups = {};
              envTxns.forEach(t => {
                const key = t.subCat && t.subCat.trim() ? t.subCat.trim() : "Uncategorized";
                if (!groups[key]) groups[key] = [];
                groups[key].push(t);
              });
              // Sort groups: named sub-cats first (alphabetical), Uncategorized last
              const sortedKeys = Object.keys(groups).sort((a, b) => {
                if (a === "Uncategorized") return 1;
                if (b === "Uncategorized") return -1;
                return a.localeCompare(b);
              });
              return sortedKeys.map(subKey =>
                /*#__PURE__*/React.createElement("div", { key: subKey, style: { marginBottom: 8 } },
                  // Sub-cat header
                  /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0 5px", marginBottom: 2 } },
                    /*#__PURE__*/React.createElement("span", { style: { fontSize: 9, fontWeight: 800, color: env.color, letterSpacing: ".07em", fontFamily: "'Syne',sans-serif", textTransform: "uppercase" } }, subKey),
                    /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: env.color } },
                      fmt(groups[subKey].reduce((s, t) => s + (t.amount || 0), 0))
                    )
                  ),
                  // Transactions in this sub-cat
                  groups[subKey].map((t, i) =>
                    /*#__PURE__*/React.createElement("div", {
                      key: t.id || i,
                      style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0 5px 8px", borderBottom: "1px solid rgba(255,255,255,.03)", cursor: "pointer" },
                      onClick: e => { e.stopPropagation(); setEditingTxn(t); setEditTxnForm({ envelopeId: t.envelopeId || "other", subCat: t.subCat || "" }); }
                    },
                      /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                        /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-primary)", margin: "0 0 1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t.desc || t.category),
                        /*#__PURE__*/React.createElement("p", { style: { fontSize: 9, color: "var(--text-muted)", margin: 0 } }, t.date + " \xB7 " + t.card)
                      ),
                      /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: "var(--text-primary)", flexShrink: 0, paddingLeft: 8 } }, "-" + fmt(t.amount))
                    )
                  )
                )
              );
            })()
          )
        );
      })
    ),

    // ── TRANSACTIONS VIEW ───────────────────────────────────────────────
    view === "transactions" && /*#__PURE__*/React.createElement("div", null,
      // Add Cash / Add Expense buttons — always visible
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 12 } },
        /*#__PURE__*/React.createElement("button", {
          onClick: () => { setAddTxnForm(f => ({ ...f, card: "Cash", date: getToday(), amount: "", desc: "" })); setShowAddTxn(true); },
          style: { flex: 1, padding: "10px 0", background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.3)", borderRadius: 10, color: "#fbbf24", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif", letterSpacing: ".04em" }
        }, "💵 + CASH"),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => { setAddTxnForm(f => ({ ...f, card: "Amex", date: getToday(), amount: "", desc: "" })); setShowAddTxn(true); },
          style: { flex: 1, padding: "10px 0", background: "rgba(52,211,153,.08)", border: "1px solid rgba(52,211,153,.25)", borderRadius: 10, color: "#34d399", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif", letterSpacing: ".04em" }
        }, "+ ADD EXPENSE")
      ),
      transactions.length === 0
        ? /*#__PURE__*/React.createElement("div", { style: { textAlign: "center", padding: "30px 0" } },
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
                envelopeCatalog.map(e => /*#__PURE__*/React.createElement("option", { key: e.id, value: e.id }, e.icon + " " + e.name))
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
                const env = envelopeCatalog.find(e => e.id === t.envelopeId);
                return /*#__PURE__*/React.createElement("div", {
                  key: t.id || i,
                  style: { display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", background: t.needsReview ? "rgba(244,168,35,.04)" : "rgba(255,255,255,.03)", border: t.needsReview ? "1px solid rgba(244,168,35,.25)" : "1px solid rgba(255,255,255,.06)", borderRadius: 10, marginBottom: 6 }
                },
                  /*#__PURE__*/React.createElement("span", { style: { fontSize: 18, flexShrink: 0, marginTop: 1 } }, env?.icon || "📋"),
                  /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                    /*#__PURE__*/React.createElement("p", { style: { fontSize: 12, color: "var(--text-primary)", margin: "0 0 2px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t.desc || t.category),
                    /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: 0 } }, t.date + " \xB7 " + t.card + " \xB7 " + (env?.name || t.category) + (t.subCat ? " \xB7 " + t.subCat : ""))
                  ),
                  /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 } },
                    /*#__PURE__*/React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: t.isRefund ? "#4ade80" : "var(--text-primary)" } }, (t.isRefund ? "+" : "-") + fmt(Math.abs(t.amount))),
                    /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 4 } },
                      t.receiptId && /*#__PURE__*/React.createElement("span", { title: "Receipt attached", style: { fontSize: 9, color: "#a78bfa", background: "rgba(167,139,250,.12)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 4, padding: "2px 5px" } }, "\uD83E\uDDFE"),
                      t.needsReview && /*#__PURE__*/React.createElement("span", { title: "Flagged for review", style: { fontSize: 9, color: "#f4a823", background: "rgba(244,168,35,.12)", border: "1px solid rgba(244,168,35,.3)", borderRadius: 4, padding: "2px 5px" } }, "\uD83D\uDEA9 Review"),
                      /*#__PURE__*/React.createElement("button", { onClick: () => { setEditingTxn(t); setEditTxnForm({ envelopeId: t.envelopeId || "other", subCat: t.subCat || "" }); }, style: { fontSize: 9, color: "var(--text-muted)", background: "rgba(255,255,255,.06)", border: "none", borderRadius: 4, padding: "2px 6px", cursor: "pointer" } }, "edit")
                    )
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
          ["Money Out",    transactions.length.toString(), "var(--text-muted)"]
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
      // Header row — total + add button
      /*#__PURE__*/React.createElement("div", { style: { background: "rgba(74,222,128,.07)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" } },
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: "#4ade80", letterSpacing: ".07em", margin: "0 0 2px" } }, "TOTAL MONEY IN — " + monthLabel(currentMonth).toUpperCase()),
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 22, fontWeight: 800, color: "#4ade80", margin: 0, fontFamily: "'Syne',sans-serif" } }, fmt(totalIncome))
        ),
        /*#__PURE__*/React.createElement("button", { onClick: () => setShowAddIncome(true), style: { background: "#4ade80", border: "none", borderRadius: 10, padding: "10px 16px", color: "#080b11", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "+ ADD")
      ),

      // Entry count + sort hint
      income.length > 0 && /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: "0 0 10px" } },
        income.length + " entr" + (income.length === 1 ? "y" : "ies") + " \xB7 tap to edit"
      ),

      // Income entries — sorted newest first
      income.length === 0
        ? /*#__PURE__*/React.createElement("p", { style: { textAlign: "center", color: "var(--text-muted)", fontSize: 13, padding: "20px 0" } }, "No income logged for " + monthLabel(currentMonth) + ". Tap + ADD.")
        : [...income].sort((a, b) => (b.date || "").localeCompare(a.date || "")).map(inc =>
            /*#__PURE__*/React.createElement("div", {
              key: inc.id,
              style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "rgba(74,222,128,.04)", border: "1px solid rgba(74,222,128,.12)", borderRadius: 10, marginBottom: 8, cursor: "pointer" },
              onClick: () => { setEditingIncome(inc); setEditIncomeForm({ source: inc.source || "", amount: String(inc.amount || ""), date: inc.date || getToday(), type: inc.type || "other" }); }
            },
              /*#__PURE__*/React.createElement("div", null,
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 13, color: "var(--text-primary)", margin: "0 0 2px", fontWeight: 600 } }, inc.source),
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: 0 } }, inc.date + " \xB7 " + (inc.type || "other"))
              ),
              /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                /*#__PURE__*/React.createElement("span", { style: { fontSize: 15, fontWeight: 700, color: "#4ade80" } }, "+" + fmt(inc.amount)),
                /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)", background: "rgba(255,255,255,.06)", borderRadius: 4, padding: "2px 6px" } }, "edit")
              )
            )
          ),

      // Net cash flow callout
      totalIncome > 0 && /*#__PURE__*/React.createElement("div", { style: { marginTop: 12, padding: "12px 16px", background: netCashFlow >= 0 ? "rgba(74,222,128,.08)" : "rgba(239,68,68,.08)", border: `1px solid ${netCashFlow >= 0 ? "rgba(74,222,128,.2)" : "rgba(239,68,68,.2)"}`, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" } },
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, color: "var(--text-secondary)", fontWeight: 700 } }, "NET CASH FLOW"),
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 16, fontWeight: 800, color: netCashFlow >= 0 ? "#4ade80" : "#ef4444", fontFamily: "'Syne',sans-serif" } }, (netCashFlow >= 0 ? "+" : "") + fmt(netCashFlow))
      ),

      // Past months browser — tap any month to load it
      allMonths.length > 1 && /*#__PURE__*/React.createElement("div", { style: { marginTop: 20 } },
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: ".08em", marginBottom: 10 } }, "ALL MONTHS"),
        [...allMonths].sort((a, b) => b.localeCompare(a)).map(m =>
          /*#__PURE__*/React.createElement("button", {
            key: m,
            onClick: () => setCurrentMonth(m),
            style: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", textAlign: "left", background: m === currentMonth ? "rgba(74,222,128,.1)" : "rgba(255,255,255,.03)", border: `1px solid ${m === currentMonth ? "rgba(74,222,128,.3)" : "rgba(255,255,255,.06)"}`, borderRadius: 8, padding: "9px 12px", marginBottom: 6, cursor: "pointer" }
          },
            /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, color: m === currentMonth ? "#4ade80" : "var(--text-secondary)", fontWeight: m === currentMonth ? 700 : 400 } }, monthLabel(m)),
            m === currentMonth && income.length > 0 && /*#__PURE__*/React.createElement("span", { style: { fontSize: 11, color: "#4ade80", fontWeight: 700 } }, fmt(totalIncome))
          )
        )
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
              const env = envelopeCatalog.find(ev => ev.id === t.envelopeId);
              const isFlagged = flaggedCardIds.has(t.id);
              return /*#__PURE__*/React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 6, padding: "6px 4px", borderBottom: "1px solid rgba(255,255,255,.04)", background: isFlagged ? "rgba(244,168,35,.06)" : "transparent", borderRadius: 4 } },
                /*#__PURE__*/React.createElement("button", {
                  onClick: () => setFlaggedCardIds(prev => { const next = new Set(prev); isFlagged ? next.delete(t.id) : next.add(t.id); return next; }),
                  style: { background: "none", border: "none", cursor: "pointer", fontSize: 12, padding: 0, opacity: isFlagged ? 1 : 0.2, flexShrink: 0 }
                }, "\uD83D\uDEA9"),
                /*#__PURE__*/React.createElement("div", { style: { minWidth: 0, flex: 1 } },
                  /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: isFlagged ? "#f4a823" : "var(--text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t.desc),
                  /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: 0 } }, t.date + " \xB7 " + (env?.icon || "") + " " + (env?.name || "Other") + (t.subCat ? " / " + t.subCat : ""))
                ),
                /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: t.isRefund ? "#4ade80" : isFlagged ? "#f4a823" : "var(--text-primary)", flexShrink: 0 } }, (t.isRefund ? "+" : "-") + fmt(Math.abs(t.amount || 0)))
              );
            })
          ),
          cardResults.expenses.length > 50 && /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: "4px 0 0" } }, "Showing 50 of " + cardResults.expenses.length)
        ),

        // Income section
        cardResults.income.length > 0 && /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "#4ade80", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 6px" } }, "MONEY IN"),
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
          /*#__PURE__*/React.createElement("button", { onClick: confirmCardResults, style: { flex: 1, padding: "10px 0", background: "#4ade80", border: "none", borderRadius: 9, color: "#080b11", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, flaggedCardIds.size ? "Import All (" + flaggedCardIds.size + " flagged)" : "Import All"),
          /*#__PURE__*/React.createElement("button", { onClick: () => { setCardResults(null); setFlaggedCardIds(new Set()); }, style: { flex: 1, padding: "10px 0", background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 9, color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" } }, "Discard")
        )
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
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
          /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, color: "#4ade80", margin: 0 } }, "FOUND " + scanResults.length + " TRANSACTIONS"),
          flaggedScanIds.size > 0 && /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "#f4a823", fontWeight: 700 } }, flaggedScanIds.size + " flagged for review")
        ),
        /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: "0 0 10px", lineHeight: 1.5 } }, "Tap \uD83D\uDEA9 to flag any transaction that looks wrong — it will be saved but marked for review."),
        /*#__PURE__*/React.createElement("div", { style: { maxHeight: 300, overflowY: "auto", marginBottom: 12 } },
          scanResults.map((t, i) => {
            const env = envelopeCatalog.find(e => e.id === t.envelopeId);
            const isFlagged = flaggedScanIds.has(t.id);
            return /*#__PURE__*/React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 8, padding: "7px 6px", borderBottom: "1px solid rgba(255,255,255,.05)", background: isFlagged ? "rgba(244,168,35,.06)" : "transparent", borderRadius: 6 } },
              /*#__PURE__*/React.createElement("button", {
                onClick: () => setFlaggedScanIds(prev => { const next = new Set(prev); isFlagged ? next.delete(t.id) : next.add(t.id); return next; }),
                style: { background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: 0, opacity: isFlagged ? 1 : 0.25, flexShrink: 0 }
              }, "\uD83D\uDEA9"),
              /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 12, color: isFlagged ? "#f4a823" : "var(--text-primary)", margin: 0, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t.desc),
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: 0 } }, t.date + " \xB7 " + (env?.icon || "") + " " + (env?.name || "Other"))
              ),
              /*#__PURE__*/React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: isFlagged ? "#f4a823" : "var(--text-primary)", flexShrink: 0 } }, "-$" + (t.amount || 0).toFixed(2))
            );
          })
        ),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8 } },
          /*#__PURE__*/React.createElement("button", { onClick: confirmScan, style: { flex: 1, padding: "10px 0", background: "#4ade80", border: "none", borderRadius: 9, color: "#080b11", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, flaggedScanIds.size ? "Import All (" + flaggedScanIds.size + " flagged)" : "Import All"),
          /*#__PURE__*/React.createElement("button", { onClick: () => { setScanResults(null); setFlaggedScanIds(new Set()); }, style: { flex: 1, padding: "10px 0", background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 9, color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" } }, "Discard")
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
              /*#__PURE__*/React.createElement("select", { value: addTxnForm.card, onChange: e => setAddTxnForm(f => ({ ...f, card: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 8px", color: "var(--text-primary)", fontSize: 12, outline: "none", colorScheme: "dark" } },
                ["Amex", "TD Visa", "CIBC", "PC Financial", "Cash", "Other"].map(c => /*#__PURE__*/React.createElement("option", { key: c, value: c }, c))
              )
            ),
            /*#__PURE__*/React.createElement("div", { style: { flex: 1 } },
              /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "CATEGORY"),
              /*#__PURE__*/React.createElement("select", { value: addTxnForm.envelopeId, onChange: e => setAddTxnForm(f => ({ ...f, envelopeId: e.target.value, subCat: "" })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 8px", color: "var(--text-primary)", fontSize: 12, outline: "none" } },
                envelopeCatalog.map(e => /*#__PURE__*/React.createElement("option", { key: e.id, value: e.id }, e.icon + " " + e.name))
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
              envelopeCatalog.map(e => /*#__PURE__*/React.createElement("option", { key: e.id, value: e.id }, e.icon + " " + e.name))
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
        /*#__PURE__*/React.createElement("button", { onClick: handleMoveTxnToIncome, style: { width: "100%", marginTop: 8, padding: "10px 0", background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 9, color: "#4ade80", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "\u21C4 Move to Money In"),
        txnReceiptData && /*#__PURE__*/React.createElement("div", { style: { marginTop: 14, borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 12 } },
          /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: "#a78bfa", letterSpacing: ".06em", margin: "0 0 8px" } }, "\uD83E\uDDFE RECEIPT: " + (txnReceiptData.vendor || "") + (txnReceiptData.date ? "  \xB7  " + txnReceiptData.date : "")),
          (txnReceiptData.lineItems || []).filter(li => li.totalPrice != null && (li.name || li.rawText)).map((li, i) =>
            /*#__PURE__*/React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,.04)" } },
              /*#__PURE__*/React.createElement("span", { style: { fontSize: 11, color: "var(--text-secondary)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, li.qty > 1 ? li.qty + "×  " + (li.name || li.rawText) : (li.name || li.rawText)),
              /*#__PURE__*/React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: li.totalPrice < 0 ? "#4ade80" : "var(--text-primary)", flexShrink: 0, paddingLeft: 8 } }, (li.totalPrice < 0 ? "-" : "") + "$" + Math.abs(parseFloat(li.totalPrice) || 0).toFixed(2))
            )
          ),
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 6, paddingTop: 4 } },
            txnReceiptData.subtotal != null && /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)" } }, "Subtotal $" + parseFloat(txnReceiptData.subtotal).toFixed(2)),
            txnReceiptData.tax != null && /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)" } }, "Tax $" + parseFloat(txnReceiptData.tax).toFixed(2)),
            txnReceiptData.total != null && /*#__PURE__*/React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: "#d1d5db" } }, "Total $" + parseFloat(txnReceiptData.total).toFixed(2))
          )
        ),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => { if (window.confirm("Delete this transaction? This cannot be undone.")) handleDeleteTxn(editingTxn); },
          style: { width: "100%", marginTop: 8, padding: "10px 0", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 9, color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer" }
        }, "\uD83D\uDDD1 Delete Transaction")
      )
    ),

    // ── Edit Income Modal ───────────────────────────────────────────────────
    editingIncome && /*#__PURE__*/React.createElement(React.Fragment, null,
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200 }, onClick: () => setEditingIncome(null) }),
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "calc(100% - 32px)", maxWidth: 400, background: "#0e1420", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: 20, zIndex: 201 } },
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: "#4ade80", margin: "0 0 16px" } }, "EDIT MONEY IN"),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "SOURCE"),
            /*#__PURE__*/React.createElement("input", { value: editIncomeForm.source, onChange: e => setEditIncomeForm(f => ({ ...f, source: e.target.value })), placeholder: "e.g. Ryan Salary, EI Benefit", style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", boxSizing: "border-box" } })
          ),
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8 } },
            /*#__PURE__*/React.createElement("div", { style: { flex: 1 } },
              /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "AMOUNT ($)"),
              /*#__PURE__*/React.createElement("input", { type: "number", min: "0", step: "0.01", value: editIncomeForm.amount, onChange: e => setEditIncomeForm(f => ({ ...f, amount: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", boxSizing: "border-box" } })
            ),
            /*#__PURE__*/React.createElement("div", { style: { flex: 1 } },
              /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "DATE"),
              /*#__PURE__*/React.createElement("input", { type: "date", value: editIncomeForm.date, onChange: e => setEditIncomeForm(f => ({ ...f, date: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 8px", color: "var(--text-primary)", fontSize: 13, outline: "none", colorScheme: "dark", boxSizing: "border-box" } })
            )
          ),
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 4px" } }, "CATEGORY"),
            /*#__PURE__*/React.createElement("select", { value: editIncomeForm.type, onChange: e => setEditIncomeForm(f => ({ ...f, type: e.target.value })), style: { width: "100%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 8px", color: "var(--text-primary)", fontSize: 13, outline: "none", colorScheme: "dark" } },
              [["salary","💼 Salary / Employment"],["freelance","🧑‍💻 Freelance"],["business","🏢 Business"],["investment","📈 Investment / Interest"],["government","🏛️ Government / EI / CPP"],["etransfer","📲 E-Transfer Received"],["rental","🏠 Rental Income"],["tax_refund","🧾 Tax Refund"],["other","📦 Other"]].map(([v, l]) => /*#__PURE__*/React.createElement("option", { key: v, value: v }, l))
            )
          )
        ),
        /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 16 } },
          /*#__PURE__*/React.createElement("button", { onClick: handleEditIncome, style: { flex: 1, padding: "12px 0", background: "#4ade80", border: "none", borderRadius: 9, color: "#080b11", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "SAVE"),
          /*#__PURE__*/React.createElement("button", { onClick: () => setEditingIncome(null), style: { flex: 1, padding: "12px 0", background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 9, color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" } }, "Cancel")
        ),
        /*#__PURE__*/React.createElement("button", { onClick: handleMoveIncomeToTxn, style: { width: "100%", marginTop: 8, padding: "10px 0", background: "rgba(96,165,250,.08)", border: "1px solid rgba(96,165,250,.25)", borderRadius: 9, color: "#60a5fa", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "\u21C4 Move to Money Out"),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => { if (window.confirm("Delete this income entry? This cannot be undone.")) { handleDeleteIncome(editingIncome.id); setEditingIncome(null); } },
          style: { width: "100%", marginTop: 8, padding: "10px 0", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 9, color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer" }
        }, "\uD83D\uDDD1 Delete Entry")
      )
    ),

    // ── Add Income Modal ────────────────────────────────────────────────────
    showAddIncome && /*#__PURE__*/React.createElement(React.Fragment, null,
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200 }, onClick: () => setShowAddIncome(false) }),
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "calc(100% - 32px)", maxWidth: 400, background: "#0e1420", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: 20, zIndex: 201 } },
        /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: "#4ade80", margin: "0 0 16px" } }, "ADD MONEY IN"),
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
                envelopeCatalog.map(e => /*#__PURE__*/React.createElement("option", { key: e.id, value: e.id }, e.icon + " " + e.name))
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

    // ── Manage Envelopes Modal ──────────────────────────────────────────────
    showManageEnvelopes && /*#__PURE__*/React.createElement(React.Fragment, null,
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 220 }, onClick: () => setShowManageEnvelopes(false) }),
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "#080b11", zIndex: 221, display: "flex", flexDirection: "column" } },

        // Header
        /*#__PURE__*/React.createElement("div", { style: { padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 } },
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: "#34d399", margin: 0 } }, "MANAGE ENVELOPES"),
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" } }, envelopeCatalog.length + " envelopes — toggle visibility or add new")
          ),
          /*#__PURE__*/React.createElement("button", { onClick: () => setShowManageEnvelopes(false), style: { background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer", lineHeight: 1 } }, "\xD7")
        ),

        /*#__PURE__*/React.createElement("div", { style: { flex: 1, overflowY: "auto" } },

          // ── ADD NEW ENVELOPE ──
          /*#__PURE__*/React.createElement("div", { style: { padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(52,211,153,.04)" } },
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "#34d399", fontWeight: 800, letterSpacing: ".07em", margin: "0 0 12px", fontFamily: "'Syne',sans-serif" } }, "+ ADD NEW ENVELOPE"),

            // Name + current icon preview
            /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 10 } },
              /*#__PURE__*/React.createElement("span", { style: { fontSize: 24, lineHeight: 1 } }, newEnvForm.icon),
              /*#__PURE__*/React.createElement("input", {
                placeholder: "Envelope name…",
                value: newEnvForm.name,
                onChange: e => setNewEnvForm(f => ({ ...f, name: e.target.value })),
                style: { flex: 1, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" }
              }),
              /*#__PURE__*/React.createElement("select", {
                value: newEnvForm.highlevel,
                onChange: e => setNewEnvForm(f => ({ ...f, highlevel: e.target.value })),
                style: { width: 110, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "9px 6px", color: "var(--text-primary)", fontSize: 11, outline: "none" }
              },
                /*#__PURE__*/React.createElement("option", { value: "" }, "Group…"),
                ["Fixed","Food","Household","Transportation","Reoccuring Bills","Leisure","Other"].map(g =>
                  /*#__PURE__*/React.createElement("option", { key: g, value: g }, g)
                )
              )
            ),

            // Icon picker — group tabs
            /*#__PURE__*/React.createElement("div", { style: { marginBottom: 8 } },
              /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 4, overflowX: "auto", scrollbarWidth: "none", marginBottom: 8 } },
                ICON_GROUPS.map((g, i) =>
                  /*#__PURE__*/React.createElement("button", {
                    key: g.label,
                    onClick: () => setIconGroupTab(i),
                    style: { padding: "4px 10px", borderRadius: 12, border: "1px solid " + (iconGroupTab === i ? "rgba(52,211,153,.5)" : "rgba(255,255,255,.1)"), background: iconGroupTab === i ? "rgba(52,211,153,.12)" : "transparent", color: iconGroupTab === i ? "#34d399" : "var(--text-muted)", fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }
                  }, g.label)
                )
              ),
              /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } },
                ICON_GROUPS[iconGroupTab].icons.map(ic =>
                  /*#__PURE__*/React.createElement("button", {
                    key: ic,
                    onClick: () => setNewEnvForm(f => ({ ...f, icon: ic })),
                    style: { width: 38, height: 38, borderRadius: 8, border: "1px solid " + (newEnvForm.icon === ic ? "rgba(52,211,153,.6)" : "rgba(255,255,255,.08)"), background: newEnvForm.icon === ic ? "rgba(52,211,153,.15)" : "rgba(255,255,255,.03)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
                  }, ic)
                )
              )
            ),

            // Color picker
            /*#__PURE__*/React.createElement("div", { style: { marginBottom: 12 } },
              /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 6px" } }, "COLOUR"),
              /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } },
                ENV_COLORS.map(c =>
                  /*#__PURE__*/React.createElement("button", {
                    key: c,
                    onClick: () => setNewEnvForm(f => ({ ...f, color: c })),
                    style: { width: 26, height: 26, borderRadius: "50%", background: c, border: newEnvForm.color === c ? "3px solid #fff" : "2px solid transparent", cursor: "pointer", outline: "none", boxSizing: "border-box" }
                  })
                )
              )
            ),

            // Add button
            /*#__PURE__*/React.createElement("button", {
              onClick: handleAddEnvelope,
              disabled: !newEnvForm.name.trim(),
              style: { width: "100%", padding: "11px 0", background: newEnvForm.name.trim() ? "#34d399" : "rgba(52,211,153,.2)", border: "none", borderRadius: 9, color: newEnvForm.name.trim() ? "#080b11" : "var(--text-muted)", fontSize: 13, fontWeight: 800, cursor: newEnvForm.name.trim() ? "pointer" : "not-allowed", fontFamily: "'Syne',sans-serif" }
            }, "+ CREATE ENVELOPE")
          ),

          // ── EXISTING ENVELOPES ──
          /*#__PURE__*/React.createElement("div", { style: { padding: "12px 16px 6px" } },
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 10px" } }, "YOUR ENVELOPES — tap eye to hide/show")
          ),
          envelopeCatalog.map(env =>
            /*#__PURE__*/React.createElement("div", {
              key: env.id,
              style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,.04)", opacity: env.hidden ? 0.4 : 1 }
            },
              /*#__PURE__*/React.createElement("span", { style: { fontSize: 18, flexShrink: 0 } }, env.icon),
              /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                /*#__PURE__*/React.createElement("p", { style: { fontSize: 13, color: env.color, margin: 0, fontWeight: 700 } }, env.name),
                env.highlevel && /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: "1px 0 0" } }, env.highlevel)
              ),
              // Hide/show toggle
              /*#__PURE__*/React.createElement("button", {
                onClick: () => handleToggleEnvelopeVisibility(env.id),
                title: env.hidden ? "Show" : "Hide",
                style: { background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "5px 10px", color: env.hidden ? "var(--text-muted)" : "#34d399", fontSize: 14, cursor: "pointer", flexShrink: 0 }
              }, env.hidden ? "👁\u200D🗨 Hidden" : "👁 Visible"),
              // Delete button (custom envelopes only)
              env.custom && /*#__PURE__*/React.createElement("button", {
                onClick: () => handleDeleteCustomEnvelope(env.id),
                style: { background: "transparent", border: "none", color: "rgba(239,68,68,.5)", fontSize: 16, cursor: "pointer", padding: "0 4px", flexShrink: 0 }
              }, "\xD7")
            )
          )
        )
      )
    ),

    // ── Merchant Rules Table ────────────────────────────────────────────────
    showRulesTable && /*#__PURE__*/React.createElement(React.Fragment, null,
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 220 }, onClick: () => setShowRulesTable(false) }),
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "#080b11", zIndex: 221, display: "flex", flexDirection: "column" } },
        // Header
        /*#__PURE__*/React.createElement("div", { style: { padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,.08)" } },
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
            /*#__PURE__*/React.createElement("div", null,
              /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: "#a78bfa", margin: 0 } }, "MERCHANT RULES"),
              /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" } }, merchantRules.length + " rules — applied automatically on CSV import")
            ),
            /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
              /*#__PURE__*/React.createElement("button", {
                onClick: () => { setRulesRunMsg(""); handleRunRules(merchantRules); },
                disabled: runningRules,
                style: { padding: "7px 14px", background: runningRules ? "rgba(167,139,250,.2)" : "rgba(167,139,250,.15)", border: "1px solid rgba(167,139,250,.3)", borderRadius: 8, color: runningRules ? "var(--text-muted)" : "#a78bfa", fontSize: 12, fontWeight: 700, cursor: runningRules ? "not-allowed" : "pointer", fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap" }
              }, runningRules ? "Running…" : "⚡ Run All Rules"),
              /*#__PURE__*/React.createElement("button", { onClick: () => { setShowRulesTable(false); setRulesRunMsg(""); }, style: { background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer", lineHeight: 1 } }, "\xD7")
            )
          ),
          rulesRunMsg && /*#__PURE__*/React.createElement("p", { style: { margin: "8px 0 0", fontSize: 12, color: rulesRunMsg.startsWith("✓") ? "#4ade80" : "#ef4444", fontWeight: 600 } }, rulesRunMsg)
        ),
        // Add new rule row
        /*#__PURE__*/React.createElement("div", { style: { padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(167,139,250,.05)" } },
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "#a78bfa", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 8px" } }, "ADD NEW RULE"),
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
            /*#__PURE__*/React.createElement("input", { placeholder: "keyword", value: ruleForm.keyword, onChange: e => setRuleForm(f => ({ ...f, keyword: e.target.value })), style: { flex: "1 1 100px", minWidth: 80, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "7px 9px", color: "var(--text-primary)", fontSize: 12, outline: "none" } }),
            /*#__PURE__*/React.createElement("input", { placeholder: "display name", value: ruleForm.displayName, onChange: e => setRuleForm(f => ({ ...f, displayName: e.target.value })), style: { flex: "1 1 100px", minWidth: 80, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "7px 9px", color: "var(--text-primary)", fontSize: 12, outline: "none" } }),
            /*#__PURE__*/React.createElement("select", { value: ruleForm.envelopeId, onChange: e => setRuleForm(f => ({ ...f, envelopeId: e.target.value })), style: { flex: "1 1 110px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "7px 6px", color: "var(--text-primary)", fontSize: 11, outline: "none" } },
              envelopeCatalog.map(e => /*#__PURE__*/React.createElement("option", { key: e.id, value: e.id }, e.icon + " " + e.name))
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
            const env = envelopeCatalog.find(e => e.id === rule.envelopeId);
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

  // Export
  window.FinanceTab = FinanceTab;
})();
