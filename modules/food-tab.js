// Mission Log — Food Tab Module
// Standalone module: meal library, week planner, grocery route, macro tracking
// Depends on window.__ml (set by app.js) and React globals
(function () {
  'use strict';

  // Pull shared utilities from the bridge
  const { DB, KEYS, getToday, fmtDate, fmtLong, getSundayKey, addDays, daysBetween, callClaude, C, CL, inp, Lbl, SectionHead } = window.__ml;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  // MEALS_DB is loaded as a data file before app.js
  const MEALS_DB = window.MEALS_DB;

  // ── Food Tab functions ──────────────────────────────────────────────────────
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
    return [mk("A", "Lowest Total Cost", "🟢", "#22c55e", "Cheapest price per item, any store, any card. May require multiple cards.", item => item.cheapest), mk("B", "Best Card Strategy", "💳", "var(--color-accent-purple)", "Routes each item to the store where your best card earns the most — Cobalt 5x at Metro/Farm Boy, Costco MC at Costco, TD Aeroplan at Walmart.", item => {
      if (item.preferred === "costco") return "costco";
      if (amexStores.includes(item.preferred)) return item.preferred;
      return "walmart";
    }), mk("C", "Fewest Stops", "⚡", "var(--color-primary)", `Everything from ${STORES[singles[0].sid]?.name}. One trip, one card.`, () => singles[0].sid)];
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
    const mealCats = Array.isArray(meal.cat) ? meal.cat : (meal.cat ? [meal.cat] : ["B"]);
    const cc = C[mealCats[0]] || "var(--text-secondary)";
    const pm = pantryMatch(meal, pantryItems);
    const pmColor = pm.pct >= 80 ? "var(--color-success)" : pm.pct >= 50 ? "var(--color-primary)" : "var(--text-secondary)";
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
        border: `2px solid ${picked ? "var(--color-success)" : "rgba(255,255,255,.2)"}`,
        background: picked ? "var(--color-success)" : "transparent",
        cursor: "pointer",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        color: "var(--bg)",
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
    }, mealCats.map(c => CL[c] || c).join(" / ")), meal.fromInventory && /*#__PURE__*/React.createElement("span", {
      style: { background: "rgba(96,165,250,.12)", color: "var(--color-accent-blue)", fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "1px 6px", flexShrink: 0 }
    }, "\uD83C\uDFE0 Home"), pantryItems.length > 0 && pm.total > 0 && /*#__PURE__*/React.createElement("span", {
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
        color: "var(--color-primary)",
        fontSize: 10,
        fontWeight: 700
      }
    }, meal.cal, " cal"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--color-accent-blue)",
        fontSize: 10
      }
    }, meal.prot, "g protein"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--color-success)",
        fontSize: 10
      }
    }, "$", meal.cad.toFixed(2), "/srv"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--color-accent-blue)",
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
        color: "var(--text-muted)",
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
          color: inPantry ? "var(--text-secondary)" : "var(--text-secondary)",
          fontSize: 12,
          margin: "0 0 3px",
          textDecoration: inPantry ? "none" : "none"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: inPantry ? "var(--color-success)" : "var(--text-muted)",
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
        color: "var(--color-primary)",
        fontSize: 10,
        fontWeight: 700,
        margin: "0 0 3px"
      }
    }, "Need to buy (", pm.missing.length, ")"), pm.missing.map((m, i) => /*#__PURE__*/React.createElement("p", {
      key: i,
      style: {
        color: "var(--text-secondary)",
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
        color: "var(--color-accent-blue)",
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
        color: "var(--text-primary)",
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
      const hasCat = (m, c) => Array.isArray(m.cat) ? m.cat.includes(c) : m.cat === c;
      const B = sortByPantry(allMeals.filter(m => hasCat(m, "B")));
      const L = sortByPantry(allMeals.filter(m => hasCat(m, "L")));
      const D = sortByPantry(allMeals.filter(m => hasCat(m, "D")));
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
    const pickable = allMeals.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => pantryMatch(b, pantryItems).pct - pantryMatch(a, pantryItems).pct);
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
        color: "var(--color-success)",
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
        color: "var(--color-success)",
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
          color: dayIdx === i ? "var(--color-accent-blue)" : ok ? "var(--color-success)" : "var(--text-secondary)",
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
        color: "var(--color-accent-blue)",
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
        background: "var(--bg-modal)",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 14,
        padding: "20px",
        zIndex: 199
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--color-success)",
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
        color: "var(--text-muted)",
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
        color: "var(--color-primary)",
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
        background: "var(--color-success)",
        color: "var(--bg)",
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
          color: isCooked ? "var(--color-success)" : "var(--text-secondary)",
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
          border: `2px solid ${isCooked ? "var(--color-success)" : "rgba(255,255,255,.25)"}`,
          background: isCooked ? "var(--color-success)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9,
          color: "var(--bg)",
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
        background: "var(--bg-modal)",
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
        color: "var(--text-secondary)",
        borderRadius: 8,
        padding: "5px 14px",
        fontSize: 12,
        cursor: "pointer"
      }
    }, "Cancel")), /*#__PURE__*/React.createElement("input", {
      value: search,
      onChange: e => setSearch(e.target.value),
      placeholder: `Search all meals for ${CL[picking]?.toLowerCase() || "this slot"}... (${allMeals.length} options)`,
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
    importedMeals = [],
    importedLibMeta = [],
    onAddMeal,
    onDeleteCustom,
    pantryItems = []
  }) {
    const [cat, setCat] = useState("All");
    const [base, setBase] = useState("All");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("pantry");
    const [showAdd, setShowAdd] = useState(false);
    const [libSection, setLibSection] = useState("custom"); // default | custom | imported
    // Auto-switch to default only if user has zero custom meals AND no imported meals
    const autoSwitchedRef = React.useRef(false);
    useEffect(() => {
      if (!autoSwitchedRef.current && customMeals.length === 0 && importedMeals.length === 0) {
        setLibSection("default");
        autoSwitchedRef.current = true;
      }
      if (!autoSwitchedRef.current && (customMeals.length > 0 || importedMeals.length > 0)) {
        autoSwitchedRef.current = true; // stays on "custom"
      }
    }, [customMeals.length, importedMeals.length]);
    const allMeals = [...MEALS_DB, ...customMeals, ...importedMeals];
    const catMap = {
      "All": null,
      "Breakfast": "B",
      "Lunch": "L",
      "Dinner": "D"
    };
    function detectBase(meal) {
      const text = ((meal.name || "") + " " + (meal.ing || []).join(" ")).toLowerCase();
      if (/salmon|tuna|shrimp|prawn|cod|tilapia|halibut|seafood|fish/.test(text)) return "Seafood";
      if (/chicken/.test(text)) return "Chicken";
      if (/beef|steak|brisket/.test(text)) return "Beef";
      if (/pork|bacon|ham|sausage/.test(text)) return "Pork";
      if (/turkey/.test(text)) return "Turkey";
      return "Plant-Based";
    }
    // Which pool to show based on selected section
    const sectionPool = libSection === "custom" ? customMeals
      : libSection === "imported" ? importedMeals
      : MEALS_DB;
    const hasCatLib = (m, c) => Array.isArray(m.cat) ? m.cat.includes(c) : m.cat === c;
    const counts = {
      B: sectionPool.filter(m => hasCatLib(m, "B")).length,
      L: sectionPool.filter(m => hasCatLib(m, "L")).length,
      D: sectionPool.filter(m => hasCatLib(m, "D")).length
    };
    const BASES = ["All", "Chicken", "Turkey", "Seafood", "Beef", "Pork", "Plant-Based"];
    const baseCounts = BASES.slice(1).reduce((acc, b) => { acc[b] = sectionPool.filter(m => detectBase(m) === b).length; return acc; }, {});
    const filtered = sectionPool
      .filter(m => !catMap[cat] || hasCatLib(m, catMap[cat]))
      .filter(m => base === "All" || detectBase(m) === base)
      .filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
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
    return /*#__PURE__*/React.createElement("div", null,

      // ── Section switcher: Default / Mine / Imported ──
      React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 14, background: "rgba(255,255,255,.03)", borderRadius: 10, padding: 4 } },
        [
          ["default", "DEFAULT (" + MEALS_DB.length + ")", "var(--color-primary)"],
          ["custom", "MINE (" + customMeals.length + ")", "var(--color-accent-blue)"],
          ...(importedMeals.length > 0 ? [["imported", "\uD83D\uDCD6 STARTER (" + importedMeals.length + ")", "var(--color-accent-purple)"]] : [])
        ].map(([id, label, col]) =>
          React.createElement("button", {
            key: id, onClick: () => { setLibSection(id); setCat("All"); setBase("All"); setSearch(""); },
            style: { flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: ".05em", background: libSection === id ? col + "22" : "transparent", color: libSection === id ? col : "var(--text-muted)", fontFamily: "'Syne',sans-serif" }
          }, label)
        )
      ),

      // Imported library banner
      libSection === "imported" && importedLibMeta.length > 0 && React.createElement("div", {
        style: { background: "rgba(167,139,250,.08)", border: "1px solid rgba(167,139,250,.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }
      },
        React.createElement("p", { style: { color: "var(--color-accent-purple)", fontWeight: 800, fontSize: 12, margin: "0 0 2px", fontFamily: "'Syne',sans-serif" } }, "\uD83D\uDCD6 " + (importedLibMeta[0].name || "Starter Library")),
        React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: 0 } }, "Curated by " + (importedLibMeta[0].author || "Ryan") + " \xB7 Read-only \xB7 Available in your week planner")
      ),

      /*#__PURE__*/React.createElement("div", {
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
        color: "var(--color-primary)",
        fontSize: 11,
        fontWeight: 700,
        margin: "0 0 1px"
      }
    }, "\uD83D\uDCD6 ", sectionPool.length, " meals \xB7 ", counts.B, "B \xB7 ", counts.L, "L \xB7 ", counts.D, "D"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 10,
        margin: 0
      }
    }, canMakeNow > 0 ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--color-success)",
        fontWeight: 700
      }
    }, canMakeNow), " meals 80%+ covered by your pantry") : "Tap any card for ingredients + steps")),
    // Only show + Add button when viewing own custom meals section
    libSection === "custom" && /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowAdd(true),
      style: {
        padding: "10px 14px",
        background: "rgba(244,168,35,.15)",
        border: "1px solid rgba(244,168,35,.35)",
        color: "var(--color-primary)",
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
      const cc = C[catMap[c]] || "var(--color-primary)";
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
    })),

    // ── Protein base filter row ──
    React.createElement("div", { style: { display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" } },
      BASES.map(b => {
        const baseColors = { "Chicken": "var(--color-accent-orange)", "Turkey": "var(--color-accent-yellow)", "Seafood": "var(--color-accent-blue)", "Beef": "var(--color-danger)", "Pork": "var(--color-accent-pink)", "Plant-Based": "var(--color-success)", "All": "var(--text-muted)" };
        const bc = baseColors[b] || "var(--text-muted)";
        const cnt = b === "All" ? sectionPool.length : (baseCounts[b] || 0);
        if (b !== "All" && cnt === 0) return null;
        return React.createElement("button", {
          key: b,
          onClick: () => setBase(b),
          style: {
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 10,
            cursor: "pointer",
            border: `1px solid ${base === b ? bc : "rgba(255,255,255,.08)"}`,
            background: base === b ? `${bc}22` : "transparent",
            color: base === b ? bc : "var(--text-muted)",
            fontWeight: base === b ? 700 : 400,
            whiteSpace: "nowrap"
          }
        }, b === "All" ? "All bases" : b, b !== "All" ? ` (${cnt})` : "");
      })
    ),

    /*#__PURE__*/React.createElement("div", {
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
          color: "var(--color-danger)",
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
  - cat must be an array of one or more of: "B" (breakfast), "L" (lunch), "D" (dinner), "S" (snack). Example: ["D"] or ["B","S"]
  - cal, prot, carbs, fat are integers (per serving for 2 people)
  - prep and cook are integers in minutes
  - cad is estimated cost per serving in Canadian dollars (float)
  - ing is an array of ingredient strings with quantities
  - steps is an array of at least 3 detailed cooking instruction strings
  - If you cannot determine a value, make a reasonable estimate — never use null`;
  const EXTRACT_PROMPT_TWO_CARDS = `You have TWO images of a recipe card. The FIRST image is the FRONT of the card (typically shows the recipe name, ingredients list with amounts, and nutritional info). The SECOND image is the BACK of the card (typically shows the cooking instructions/steps).
  
  Extract the complete recipe and return ONLY a valid JSON object — no markdown fences, no explanation, just raw JSON.
  
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
  - Use the front image for: name, ingredients (ing), nutritional info (cal/prot/carbs/fat), and any notes
  - Use the back image for: cooking steps (steps), prep/cook times
  - cat must be exactly "B" (breakfast), "L" (lunch), or "D" (dinner)
  - cal, prot, carbs, fat are integers (per serving for 2 people)
  - prep and cook are integers in minutes
  - cad is estimated cost per serving in Canadian dollars (float)
  - ing is an array of ingredient strings with quantities
  - steps is an array of at least 3 detailed cooking instruction strings
  - If you cannot determine a value, make a reasonable estimate — never use null`;
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
    const [frontFile, setFrontFile] = useState(null);  // front of recipe card
    const [backFile, setBackFile] = useState(null);    // back of recipe card
    const fileRef = useRef(null);
    const backRef = useRef(null);
    // Resize + compress image to max 1200px wide, JPEG quality 0.82
    // Keeps recipe text legible while dropping file size from ~4MB → ~150KB
    const compressImage = file => new Promise((res, rej) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 1200;
        let w = img.width, h = img.height;
        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        // Always output JPEG so media_type is always consistent
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        res(dataUrl.split(",")[1]); // return base64 only
      };
      img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("Could not load image")); };
      img.src = url;
    });
  
    // ── Extract from photo(s) ────────────────────────────────────────────────
    // front = required (ingredients/macros), back = optional (instructions)
    const handlePhotos = async (front, back) => {
      setStatus("loading");
      try {
        const frontB64 = await compressImage(front);
        const content = [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: frontB64 } }
        ];
        if (back) {
          const backB64 = await compressImage(back);
          content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: backB64 } });
          content.push({ type: "text", text: EXTRACT_PROMPT_TWO_CARDS });
        } else {
          content.push({ type: "text", text: EXTRACT_PROMPT });
        }
        const result = await callClaude([{ role: "user", content }], null, back ? 4096 : 2000);
        setDraft({ ...result, id: `c${Date.now()}`, source: "photo" });
        setStatus("review");
      } catch (e) {
        setErrMsg("Extraction failed: " + (e.message || "Unknown error") + ". Try again or use a clearer photo.");
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
      const [d, setD] = useState(() => {
        const dr = draft || {};
        return { ...dr, cat: Array.isArray(dr.cat) ? dr.cat : (dr.cat ? [dr.cat] : ["D"]), fromInventory: dr.fromInventory || false };
      });
      if (!d) return null;
      const dCats = d.cat || ["D"];
      const cc = C[dCats[0]] || "var(--text-secondary)";
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
          color: "var(--color-success)",
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
          color: "var(--text-muted)",
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
          color: "var(--text-muted)",
          fontSize: 10,
          margin: "0 0 4px",
          textTransform: "uppercase",
          letterSpacing: ".07em"
        }
      }, "Meal Type (multi-select)"), /*#__PURE__*/React.createElement("div", {
        style: { display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }
      }, [["B", "Breakfast"], ["L", "Lunch"], ["D", "Dinner"], ["S", "Snack"]].map(([code, label]) => {
        const sel = dCats.includes(code);
        const col = C[code] || "var(--text-secondary)";
        return /*#__PURE__*/React.createElement("button", {
          key: code,
          onClick: () => {
            const next = sel ? dCats.filter(c => c !== code) : [...dCats, code];
            setD(p => ({ ...p, cat: next.length > 0 ? next : [code] }));
          },
          style: { padding: "5px 10px", borderRadius: 20, border: `1px solid ${sel ? col : "rgba(255,255,255,.12)"}`, background: sel ? col + "22" : "transparent", color: sel ? col : "var(--text-muted)", fontSize: 10, fontWeight: 700, cursor: "pointer" }
        }, label);
      })))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 6,
          marginBottom: 10
        }
      }, [["cal", "Cal", "var(--color-primary)"], ["prot", "Protein (g)", "var(--color-accent-blue)"], ["carbs", "Carbs (g)", "var(--color-accent-purple)"], ["fat", "Fat (g)", "var(--color-accent-orange)"]].map(([k, lbl, c]) => /*#__PURE__*/React.createElement("div", {
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
      }, [["prep", "Prep (min)", "var(--color-success)"], ["cook", "Cook (min)", "var(--color-success)"], ["cad", "$/serve (CAD)", "var(--color-accent-teal)"]].map(([k, lbl, c]) => /*#__PURE__*/React.createElement("div", {
        key: k,
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: {
          color: "var(--text-muted)",
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
          color: "var(--text-muted)",
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
          color: "var(--text-secondary)",
          fontSize: 12,
          margin: "0 0 3px"
        }
      }, "\xB7 ", ing)))), /*#__PURE__*/React.createElement("div", {
        style: {
          marginBottom: 16
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: {
          color: "var(--text-muted)",
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
          color: "var(--text-secondary)",
          fontSize: 12,
          margin: 0,
          lineHeight: 1.5
        }
      }, step))))), /*#__PURE__*/React.createElement("div", {
        style: { marginBottom: 12 }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => setD(p => ({ ...p, fromInventory: !p.fromInventory })),
        style: {
          width: "100%", padding: "10px 14px", borderRadius: 10,
          border: `1px solid ${d.fromInventory ? "rgba(96,165,250,.4)" : "rgba(255,255,255,.1)"}`,
          background: d.fromInventory ? "rgba(96,165,250,.12)" : "transparent",
          color: d.fromInventory ? "var(--color-accent-blue)" : "var(--text-muted)",
          fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "left"
        }
      }, d.fromInventory ? "\uD83C\uDFE0 Made at home \u2014 will deduct from inventory when logged" : "\uD83C\uDFE0 Mark as home-cooked (deduct from inventory)")), /*#__PURE__*/React.createElement("div", {
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
          background: d.name?.trim() ? "var(--color-success)" : "rgba(255,255,255,.05)",
          color: d.name?.trim() ? "var(--bg)" : "var(--text-muted)",
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
        background: "var(--bg-modal)",
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
        color: "var(--color-primary)",
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
        color: "var(--text-secondary)",
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
        color: mode === m ? "var(--color-primary)" : "var(--text-secondary)",
        fontSize: 11,
        fontWeight: mode === m ? 700 : 400,
        cursor: "pointer",
        fontFamily: "'Syne',sans-serif",
        letterSpacing: ".04em"
      }
    }, l))), mode === "photo" && /*#__PURE__*/React.createElement("div", null,
      /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 13, margin: "0 0 14px", lineHeight: 1.6 } }, "Recipe cards typically have 2 sides. Upload the front (ingredients) and back (instructions) — Claude combines both into one complete recipe."),
      /*#__PURE__*/React.createElement("input", { ref: fileRef, type: "file", accept: "image/*", capture: "environment", style: { display: "none" }, onChange: e => { if (e.target.files[0]) setFrontFile(e.target.files[0]); } }),
      /*#__PURE__*/React.createElement("input", { ref: backRef, type: "file", accept: "image/*", capture: "environment", style: { display: "none" }, onChange: e => { if (e.target.files[0]) setBackFile(e.target.files[0]); } }),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 14 } },
        /*#__PURE__*/React.createElement("button", {
          onClick: () => fileRef.current?.click(),
          style: { flex: 1, padding: "24px 8px", background: frontFile ? "rgba(74,222,128,.08)" : "var(--card-bg)", border: frontFile ? "2px solid rgba(74,222,128,.4)" : "2px dashed rgba(244,168,35,.3)", borderRadius: 12, color: frontFile ? "var(--color-success)" : "var(--color-primary)", fontSize: 12, cursor: "pointer", fontWeight: 600, textAlign: "center" }
        },
          /*#__PURE__*/React.createElement("span", { style: { display: "block", fontSize: 24, marginBottom: 6 } }, frontFile ? "\u2713" : "\uD83D\uDCF7"),
          frontFile ? "Front \u2713" : "Front Side",
          /*#__PURE__*/React.createElement("span", { style: { display: "block", fontSize: 9, color: "var(--text-muted)", marginTop: 4, fontWeight: 400 } }, "Ingredients + amounts")
        ),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => backRef.current?.click(),
          style: { flex: 1, padding: "24px 8px", background: backFile ? "rgba(74,222,128,.08)" : "var(--card-bg)", border: backFile ? "2px solid rgba(74,222,128,.4)" : "2px dashed rgba(96,165,250,.2)", borderRadius: 12, color: backFile ? "var(--color-success)" : "var(--color-accent-blue)", fontSize: 12, cursor: "pointer", fontWeight: 600, textAlign: "center" }
        },
          /*#__PURE__*/React.createElement("span", { style: { display: "block", fontSize: 24, marginBottom: 6 } }, backFile ? "\u2713" : "\uD83D\uDCF7"),
          backFile ? "Back \u2713" : "Back Side",
          /*#__PURE__*/React.createElement("span", { style: { display: "block", fontSize: 9, color: "var(--text-muted)", marginTop: 4, fontWeight: 400 } }, "Cooking instructions")
        )
      ),
      frontFile && /*#__PURE__*/React.createElement("button", {
        onClick: () => handlePhotos(frontFile, backFile),
        style: { width: "100%", padding: "13px 0", background: "var(--color-primary)", border: "none", borderRadius: 10, color: "var(--bg)", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif", marginBottom: 8 }
      }, backFile ? "\uD83E\uDDE0  Extract from Both Sides" : "\uD83E\uDDE0  Extract from Front Side Only"),
      /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: "4px 0 0", textAlign: "center" } }, frontFile ? (backFile ? "Both sides ready — tap to extract" : "Front uploaded \xB7 Back side is optional") : "Upload the front side to get started")), mode === "url" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 13,
        margin: "0 0 14px",
        lineHeight: 1.6
      }
    }, "Paste any recipe website URL \u2014 AllRecipes, Food Network, NYT Cooking, Serious Eats, personal blogs, etc."), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
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
        color: url.trim() && status !== "loading" ? "var(--color-primary)" : "var(--text-muted)",
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
        color: "var(--color-accent-purple)",
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
        color: "var(--text-secondary)"
      }
    }, "and"), " copy-paste the caption or recipe description from the post into the text field below.")), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
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
        color: "var(--text-muted)",
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
        color: (url.trim() || caption.trim()) && status !== "loading" ? "var(--color-accent-purple)" : "var(--text-muted)",
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
        background: "var(--color-primary)",
        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
      }
    }))), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-secondary)",
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
        color: "var(--color-danger)",
        fontSize: 12,
        fontWeight: 600,
        margin: "0 0 4px"
      }
    }, "Extraction failed"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-secondary)",
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
        color: "var(--text-secondary)",
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
        color: "var(--color-success)",
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
        color: "var(--color-danger)",
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
        color: "var(--text-secondary)",
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
        color: s.priceRank <= 2 ? "var(--color-success)" : s.priceRank === 3 ? "var(--color-primary)" : "var(--color-accent-orange)",
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
          color: "var(--text-muted)",
          fontSize: 11,
          margin: "4px 0 0",
          lineHeight: 1.4
        }
      }, r.note), r.cobaltTotal > 0 && /*#__PURE__*/React.createElement("p", {
        style: {
          color: "var(--color-accent-purple)",
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
          background: "var(--color-success)",
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
            border: `2px solid ${done ? "var(--color-success)" : "rgba(255,255,255,.2)"}`,
            background: done ? "var(--color-success)" : "transparent",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 800,
            color: "var(--bg)"
          }
        }, done ? "✓" : ""), /*#__PURE__*/React.createElement("span", {
          style: {
            flex: 1,
            fontSize: 12,
            color: done ? "var(--text-muted)" : "var(--text-primary)",
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
          color: "var(--text-secondary)",
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
  function MealLogChat({ slot, date, existing, mealLibrary, allMeals: allMealsLib = [], onSave, onClose, userName }) {
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
    const [mode, setMode] = useState("chat"); // "chat" | "pick"
    const [libSearch, setLibSearch] = useState("");
    const voiceRef = useRef(null);
    const chatEndRef = useRef(null);
    const libFiltered = allMealsLib.filter(m => !libSearch || m.name.toLowerCase().includes(libSearch.toLowerCase()));
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
      // API key lives server-side in Netlify env — no client-side key needed
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
          style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 10px", borderBottom: "1px solid rgba(255,255,255,.07)" }
        },
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
            /*#__PURE__*/React.createElement("span", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: "var(--color-accent-orange)", textTransform: "uppercase", letterSpacing: ".06em" } }, slot),
            /*#__PURE__*/React.createElement("div", { style: { display: "flex", background: "rgba(255,255,255,.06)", borderRadius: 8, padding: 2 } },
              ["chat", "pick"].map(m => /*#__PURE__*/React.createElement("button", {
                key: m, onClick: () => setMode(m),
                style: { padding: "4px 10px", borderRadius: 6, border: "none", background: mode === m ? "rgba(251,146,60,.2)" : "transparent", color: mode === m ? "var(--color-accent-orange)" : "var(--text-muted)", fontSize: 10, fontWeight: 700, cursor: "pointer" }
              }, m === "chat" ? "\uD83D\uDCAC Chat" : "\uD83D\uDCDA Library"))
            )
          ),
          /*#__PURE__*/React.createElement("button", { onClick: onClose, style: { background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 22, cursor: "pointer", lineHeight: 1 } }, "\xD7")
        ),

        // LIBRARY PICK MODE
        mode === "pick" && /*#__PURE__*/React.createElement("div", {
          style: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }
        },
          /*#__PURE__*/React.createElement("div", { style: { padding: "10px 16px 0" } },
            /*#__PURE__*/React.createElement("input", {
              type: "text", value: libSearch, onChange: e => setLibSearch(e.target.value),
              placeholder: `Search ${allMealsLib.length} meals\u2026`,
              style: { width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" }
            })
          ),
          /*#__PURE__*/React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "10px 16px 14px", display: "flex", flexDirection: "column", gap: 6 } },
            libFiltered.length === 0 && /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 12, textAlign: "center", padding: "20px 0" } }, "No meals found"),
            libFiltered.map(m => {
              const mCats = Array.isArray(m.cat) ? m.cat : (m.cat ? [m.cat] : []);
              return /*#__PURE__*/React.createElement("div", {
                key: m.id || m.name,
                onClick: () => {
                  onSave({ action: "save", name: m.name, calories: m.cal || m.calories || 0, protein: m.prot || m.protein || 0, carbs: m.carbs || 0, fat: m.fat || 0, portionDesc: "1 serving", fromInventory: m.fromInventory || false, ing: m.ing || [] });
                  onClose();
                },
                style: { padding: "10px 12px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, cursor: "pointer" }
              },
                /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 } },
                  /*#__PURE__*/React.createElement("div", null,
                    /*#__PURE__*/React.createElement("p", { style: { fontSize: 13, color: "var(--text-primary)", fontWeight: 600, margin: "0 0 3px" } }, m.name),
                    /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 5, flexWrap: "wrap" } },
                      mCats.map(c => /*#__PURE__*/React.createElement("span", { key: c, style: { fontSize: 9, color: C[c] || "var(--text-secondary)", fontWeight: 700 } }, CL[c] || c)),
                      m.fromInventory && /*#__PURE__*/React.createElement("span", { style: { fontSize: 9, color: "var(--color-accent-blue)", fontWeight: 700 } }, "\uD83C\uDFE0 Home")
                    )
                  ),
                  /*#__PURE__*/React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
                    /*#__PURE__*/React.createElement("p", { style: { fontSize: 12, color: "var(--color-primary)", fontWeight: 700, margin: "0 0 1px" } }, (m.cal || m.calories || 0) + " cal"),
                    /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", margin: 0 } }, (m.prot || m.protein || 0) + "g P")
                  )
                )
              );
            })
          )
        ),

        // CHAT MODE
        mode === "chat" && /*#__PURE__*/React.createElement(React.Fragment, null,
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
          /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, color: "var(--color-success)", fontWeight: 600 } }, confirmed.calories + "cal \xB7 " + confirmed.protein + "g P"),
          /*#__PURE__*/React.createElement("button", {
            onClick: handleConfirm,
            style: { background: "var(--color-success)", border: "none", borderRadius: 8, padding: "8px 18px", color: "var(--bg)", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
          }, "SAVE")
        ),
        // Input row
        /*#__PURE__*/React.createElement("div", {
          style: { display: "flex", gap: 8, padding: "10px 16px 14px", borderTop: "1px solid rgba(255,255,255,.06)" }
        },
          /*#__PURE__*/React.createElement("button", {
            onClick: listening ? () => { voiceRef.current?.stop(); setListening(false); } : startVoice,
            style: { width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: listening ? "rgba(239,68,68,.2)" : "rgba(167,139,250,.15)", border: `1px solid ${listening ? "rgba(239,68,68,.4)" : "rgba(167,139,250,.3)"}`, color: listening ? "var(--color-danger)" : "var(--color-accent-purple)", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }
          }, listening ? "\u23F9" : "\uD83C\uDFA4"),
          /*#__PURE__*/React.createElement("input", {
            type: "text", value: input, onChange: e => setInput(e.target.value),
            onKeyDown: e => e.key === "Enter" && send(input),
            placeholder: "Describe what you ate\u2026",
            style: { flex: 1, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "9px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif" }
          }),
          /*#__PURE__*/React.createElement("button", {
            onClick: () => send(input), disabled: !input.trim() || loading,
            style: { background: "var(--color-accent-purple)", border: "none", borderRadius: 10, padding: "9px 14px", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", flexShrink: 0, opacity: !input.trim() || loading ? .4 : 1 }
          }, "\u2192")
        ))
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
        /*#__PURE__*/React.createElement("span", { style: { fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: over ? "var(--color-danger)" : "var(--color-success)", letterSpacing: ".06em" } },
          over ? "OVER TARGET" : calPct + "% OF DAILY GOAL"
        ),
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, color: "var(--text-primary)", fontWeight: 700 } }, (logged.calories || 0) + " / " + targets.calories + " cal")
      ),
      barRow("PROT", logged.protein || 0, targets.protein, protPct, "var(--color-accent-orange)"),
      barRow("CARB", logged.carbs || 0, targets.carbs, carbPct, "var(--color-primary)"),
      barRow("FAT", logged.fat || 0, targets.fat, fatPct, "var(--color-accent-blue)")
    );
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // APP ROOT
  // ─────────────────────────────────────────────────────────────────────────────
  
  // FoodTab — integrates food module into Mission Log shell
  // mode: "health" → LOG only (daily macro tracking, lives in HEALTH section)
  //        "home"  → WEEK / LIBRARY / GROCERY (meal planning, lives in HOME section)
  function FoodTab({
    mode = "health",
    activeUser,
    settings,
    pantryItemsFromApp = []
  }) {
    const today = getToday();
    const userName = settings?.name || "Me";
    const partnerName = window.__ml.getPartnerName(settings);
    const isPartner = activeUser === "partner";
    const [subTab, setSubTab] = useState(() => mode === "home" ? "plan" : "log");
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
    const [deductionToast, setDeductionToast] = useState(""); // pantry deduction confirmation
    const [generatingTargets, setGeneratingTargets] = useState(false);
    const [sabrinaPrompts, setSabrinaPrompts] = useState([]);
    const [activeSabrinaPrompt, setActiveSabrinaPrompt] = useState(null);
    const [importedMeals, setImportedMeals] = useState([]); // meals from unlocked published libraries
    const [importedLibMeta, setImportedLibMeta] = useState([]); // [{ name, author, mealCount }]
    const [logDate, setLogDate] = useState(today); // which day is being logged (up to 7 days back)
    const sunKey = getSundayKey();
  
    useEffect(() => {
      (async () => {
        const hid = window.__current_household_id;

        // Pantry: use app-level prop if pre-loaded (already hh:-routed), else load directly
        if (pantryItemsFromApp && pantryItemsFromApp.length > 0) {
          setPantryItems(pantryItemsFromApp);
        } else {
          const p = await DB.get(hid ? KEYS.hhPantry() : KEYS.pantry());
          setPantryItems(p || []);
        }

        // Shared when in household, personal otherwise
        const wm = await DB.get(hid ? KEYS.hhWeekPlan(sunKey) : KEYS.weekPlan(sunKey));
        setWeekPlan(wm || {});
        const ci = await DB.get(hid ? KEYS.hhGroceryCheck(sunKey) : KEYS.groceryCheck(sunKey));
        setCheckedItems(ci || {});
        // Load custom meals — try hh path first, fall back to personal (handles migration)
        let cm = [];
        if (hid) {
          try { cm = (await DB.get(KEYS.hhCustomMeals())) || []; } catch(e) { cm = []; }
          if (cm.length === 0) {
            try { cm = (await DB.get(KEYS.customMeals())) || []; } catch(e) { cm = []; }
          }
        } else {
          cm = (await DB.get(KEYS.customMeals())) || [];
        }
        setCustomMeals(cm);

        // Load any published libraries this household has been granted access to
        if (hid && window.__firebase_db) {
          try {
            const metaSnap = await window.__firebase_db.ref(`households/${hid}/meta/unlockedLibraries`).once("value");
            if (metaSnap.exists()) {
              const unlockedHids = Object.keys(metaSnap.val() || {});
              const allImported = [];
              const allMeta = [];
              for (const libHid of unlockedHids) {
                const libSnap = await window.__firebase_db.ref(`publishedLibraries/${libHid}`).once("value");
                if (libSnap.exists()) {
                  const libData = libSnap.val();
                  const meals = Array.isArray(libData.meals) ? libData.meals : [];
                  // Tag each meal so LibraryTab knows it's read-only
                  meals.forEach(m => allImported.push({ ...m, _imported: true, _libName: libData.meta?.name || "Imported" }));
                  if (libData.meta) allMeta.push(libData.meta);
                }
              }
              setImportedMeals(allImported);
              setImportedLibMeta(allMeta);
            } else {
              setImportedMeals([]);
              setImportedLibMeta([]);
            }
          } catch(e) { setImportedMeals([]); setImportedLibMeta([]); }
        }

        const ck = await DB.get(KEYS.cookedMeals(sunKey)); // cooked log stays personal

        setCookedMeals(ck || {});

        // Health-mode only: daily log, macro targets, partner prompts
        if (mode === "health") {
          const ml = await DB.get(KEYS.mealLog(logDate));
          setMealLog(ml || {});
          const mt = await DB.get(KEYS.macroTargets());
          setMacroTargets(mt || null);
          const lib = await DB.get(KEYS.mealLibrary());
          setMealLibrary(Array.isArray(lib) ? lib : []);
          const sp = await DB.get(KEYS.partnerMealPrompts());
          const validPrompts = (sp || []).filter(p => {
            const age = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
            return age <= 3 && !p.answered;
          });
          setSabrinaPrompts(validPrompts);
          if (isPartner && validPrompts.length > 0) setActiveSabrinaPrompt(validPrompts[0]);
        }

        setLoadingFood(false);
      })();
    }, [activeUser, sunKey, today, mode]);
  
    // Reload meal log when user switches to a different log date
    useEffect(() => {
      if (mode !== "health" || loadingFood) return;
      DB.get(KEYS.mealLog(logDate)).then(ml => setMealLog(ml || {}));
    }, [logDate]);

    // Auto-generate macro targets when weight changes (or no targets exist)
    const generateMacroTargets = useCallback(async (weight) => {
      if (generatingTargets) return;
      setGeneratingTargets(true);
      try {
        const weightVal = weight || settings?.currentWeight || "unknown";
        const goal = settings?.weightGoal ? `target weight ${settings.weightGoal}lbs` : settings?.primaryGoal || "general fitness";
        const age = settings?.age || "unknown";
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
      if (!loadingFood && !macroTargets) {
        generateMacroTargets(null);
      }
    }, [loadingFood, macroTargets]);
  
    const saveMealLog = async (updated) => {
      setMealLog(updated);
      await DB.set(KEYS.mealLog(logDate), updated);
    };

    // Find the best-matching pantry item by name substring (longest match wins)
    const findPantryMatch = (mealName, items) => {
      if (!mealName || !items.length) return null;
      const ml = mealName.toLowerCase();
      const candidates = items.filter(p => {
        const pn = (p.name || "").toLowerCase();
        return pn.length >= 3 && ml.includes(pn);
      });
      if (!candidates.length) return null;
      return candidates.sort((a, b) => b.name.length - a.name.length)[0];
    };

    const handleSlotSave = async (slot, mealData) => {
      const updated = { ...mealLog };
      if (slot === "snack") {
        updated.snacks = [...(updated.snacks || []), { ...mealData, timestamp: new Date().toISOString(), id: "s_" + Date.now() }];
      } else {
        const planned = weekPlan[logDate + "_" + slot] || weekPlan[slot];
        updated[slot] = { ...mealData, plannedMeal: planned?.name || null, loggedAt: new Date().toISOString() };
      }
      await saveMealLog(updated);

      // Deduct from inventory if meal is flagged as home-cooked (ingredient-level)
      if (mealData.fromInventory && mealData.ing && mealData.ing.length > 0 && pantryItems.length > 0) {
        const deductions = computeDeductions({ ing: mealData.ing }, pantryItems);
        if (deductions.length > 0) {
          const deducted = pantryItems.map(item => {
            const d = deductions.find(d => d.pantryItem.id === item.id);
            return d ? { ...item, qty: d.resultQty, lastUpdated: new Date().toISOString().split("T")[0] } : item;
          });
          setPantryItems(deducted);
          const hhid = window.__current_household_id;
          await DB.set(hhid ? KEYS.hhPantry() : KEYS.pantry(), deducted);
        }
      } else if (pantryItems.length > 0 && mealData.name) {
        // Name-based deduction: match meal name against pantry item names
        const match = findPantryMatch(mealData.name, pantryItems);
        if (match && parseFloat(match.qty) > 0) {
          const today = new Date().toISOString().split("T")[0];
          const deducted = pantryItems.map(p =>
            p.id === match.id ? { ...p, qty: Math.max(0, parseFloat(p.qty || 0) - 1), lastUpdated: today } : p
          );
          setPantryItems(deducted);
          const hhid = window.__current_household_id;
          await DB.set(hhid ? KEYS.hhPantry() : KEYS.pantry(), deducted);
          setDeductionToast("−1 " + (match.unit || "unit") + " from pantry: " + match.name + " (" + Math.max(0, parseFloat(match.qty) - 1) + " left)");
          setTimeout(() => setDeductionToast(""), 5000);
        }
      }

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
        const prompts = await DB.get(KEYS.partnerMealPrompts()) || [];
        const newPrompt = {
          id: "sp_" + Date.now(),
          slot, meal: mealData.name, calories: mealData.calories, protein: mealData.protein,
          carbs: mealData.carbs, fat: mealData.fat, date: logDate,
          createdAt: new Date().toISOString(), answered: false
        };
        const cleaned = prompts.filter(p => {
          const age = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          return age <= 3 && !p.answered;
        });
        await DB.set(KEYS.partnerMealPrompts(), [newPrompt, ...cleaned]);
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
      const allPrompts = await DB.get(KEYS.partnerMealPrompts()) || [];
      const updatedPrompts = allPrompts.map(p => p.id === prompt.id ? { ...p, answered: true } : p);
      await DB.set(KEYS.partnerMealPrompts(), updatedPrompts);
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
  
    // importedMeals are tagged _imported:true — included in planning but read-only in library
    const allMeals = [...MEALS_DB, ...customMeals, ...importedMeals];
    const canMake = pantryItems.length > 0 ? allMeals.filter(m => pantryMatch(m, pantryItems).pct >= 80).length : 0;
    // health mode: LOG only. home mode: WEEK / LIBRARY / GROCERY only.
    const subTabs = mode === "home"
      ? [{ id: "plan", l: "WEEK", c: "var(--color-success)" }, { id: "library", l: "LIBRARY", c: "var(--color-primary)" }, { id: "grocery", l: "GROCERY", c: "var(--color-accent-purple)" }]
      : [{ id: "log", l: "LOG", c: "var(--color-accent-orange)" }];
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
    return /*#__PURE__*/React.createElement("div", null,
    deductionToast ? /*#__PURE__*/React.createElement("div", {
      style: { background: "rgba(74,222,128,.15)", border: "1px solid rgba(74,222,128,.35)", borderRadius: 8, padding: "8px 12px", marginBottom: 10, color: "#4ade80", fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }
    }, "✓ " + deductionToast, /*#__PURE__*/React.createElement("button", { onClick: () => setDeductionToast(""), style: { background: "none", border: "none", color: "#4ade80", cursor: "pointer", fontSize: 14, padding: 0 } }, "✕")) : null,
    /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(SectionHead, {
      label: mode === "home" ? "Food Planning" : "Food Log",
      color: mode === "home" ? "var(--color-success)" : "var(--color-accent-orange)"
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
        color: "var(--color-success)",
        fontSize: 10,
        fontWeight: 700
      }
    }, "\uD83D\uDFE2 ", canMake, " ready now"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        marginBottom: 14,
        borderBottom: "1px solid rgba(255,255,255,.06)"
      }
    // Only render sub-tab bar in home mode (health has only LOG — no picker needed)
    }, mode === "home" && subTabs.map(t => /*#__PURE__*/React.createElement("button", {
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
  
    /* ── Date picker — health mode only (log up to 7 days back) ── */
    mode === "health" && React.createElement("div", { style: { overflowX: "auto", marginBottom: 12, paddingBottom: 2 } },
      React.createElement("div", { style: { display: "flex", gap: 6, minWidth: "max-content" } },
        Array.from({ length: 7 }, (_, i) => {
          const d = addDays(today, -i);
          const active = d === logDate;
          const label = i === 0 ? "Today" : i === 1 ? "Yesterday" : fmtDate(d);
          return React.createElement("button", {
            key: d,
            onClick: () => setLogDate(d),
            style: {
              padding: "5px 12px", borderRadius: 20, border: `1px solid ${active ? "var(--color-accent-orange)" : "rgba(255,255,255,.08)"}`,
              background: active ? "rgba(251,146,60,.15)" : "transparent",
              color: active ? "var(--color-accent-orange)" : "var(--text-muted)",
              fontSize: 11, fontWeight: active ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap"
            }
          }, label);
        })
      )
    ),

    /* ── MacroBar — health mode only (daily calorie tracking) ── */
    mode === "health" && /*#__PURE__*/React.createElement(MacroBar, { logged: dailyLogged, targets: macroTargets }),

    /* ── Partner meal prompt — health mode only ── */
    mode === "health" && activeSabrinaPrompt && isPartner && /*#__PURE__*/React.createElement("div", {
      style: { background: "rgba(96,165,250,.08)", border: "1px solid rgba(96,165,250,.25)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }
    },
      /*#__PURE__*/React.createElement("p", { style: { fontSize: 13, color: "var(--text-primary)", fontWeight: 600, margin: "0 0 4px" } }, userName + " had " + activeSabrinaPrompt.meal + " for " + activeSabrinaPrompt.slot),
      /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: "0 0 12px" } }, activeSabrinaPrompt.calories + "cal \xB7 " + activeSabrinaPrompt.protein + "g protein — did you have the same?"),
      /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8 } },
        /*#__PURE__*/React.createElement("button", {
          onClick: () => handleSabrinaResponse(activeSabrinaPrompt, true),
          style: { flex: 1, background: "rgba(74,222,128,.15)", border: "1px solid rgba(74,222,128,.3)", borderRadius: 8, padding: "8px 0", color: "var(--color-success)", fontWeight: 700, fontSize: 12, cursor: "pointer" }
        }, "Yes, same meal"),
        /*#__PURE__*/React.createElement("button", {
          onClick: () => handleSabrinaResponse(activeSabrinaPrompt, false),
          style: { flex: 1, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "8px 0", color: "var(--text-secondary)", fontWeight: 700, fontSize: 12, cursor: "pointer" }
        }, "No, I\u2019ll log mine")
      )
    ),
  
    /* ── Macro target generation — health mode only ── */
    mode === "health" && generatingTargets && /*#__PURE__*/React.createElement("div", { style: { textAlign: "center", color: "var(--text-muted)", fontSize: 12, marginBottom: 12 } }, "Calculating your macro targets\u2026"),
    mode === "health" && macroTargets?.rationale && subTab === "log" && /*#__PURE__*/React.createElement("p", {
      style: { fontSize: 11, color: "var(--text-muted)", marginBottom: 12, lineHeight: 1.5 }
    }, "\uD83E\uDD16 ", macroTargets.rationale, " ",
      /*#__PURE__*/React.createElement("button", {
        onClick: () => generateMacroTargets(settings?.currentWeight),
        style: { background: "transparent", border: "none", color: "var(--color-accent-purple)", fontSize: 11, cursor: "pointer", padding: 0, textDecoration: "underline" }
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
            /*#__PURE__*/React.createElement("span", { style: { fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, color: logged ? "var(--color-success)" : "var(--text-secondary)", letterSpacing: ".06em", textTransform: "uppercase" } }, slot),
            logged
              ? /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--color-success)", fontWeight: 700 } }, logged.calories + " cal")
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
            style: { background: "rgba(251,146,60,.12)", border: "1px solid rgba(251,146,60,.25)", borderRadius: 8, padding: "5px 12px", fontSize: 10, color: "var(--color-accent-orange)", fontWeight: 700, cursor: "pointer" }
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
          /*#__PURE__*/React.createElement("span", { style: { fontSize: 12, color: "var(--color-accent-orange)", fontWeight: 700 } }, s.calories + " cal")
        ))
      )
    ),
  
    /* ── PLAN sub-tab ── */
    subTab === "plan" && /*#__PURE__*/React.createElement(WeekPlanTab, {
      plan: weekPlan,
      setPlan: async p => {
        const hid = window.__current_household_id;
        setWeekPlan(p);
        await DB.set(hid ? KEYS.hhWeekPlan(sunKey) : KEYS.weekPlan(sunKey), p);
      },
      allMeals: allMeals,
      pantryItems: pantryItems,
      cookedMeals: cookedMeals,
      onCookMeal: handleCookMeal
    }), subTab === "library" && /*#__PURE__*/React.createElement(LibraryTab, {
      customMeals: customMeals,
      importedMeals: importedMeals,
      importedLibMeta: importedLibMeta,
      onAddMeal: async m => {
        const hid = window.__current_household_id;
        const u = [...customMeals, m];
        setCustomMeals(u);
        await DB.set(hid ? KEYS.hhCustomMeals() : KEYS.customMeals(), u);
      },
      onDeleteCustom: async id => {
        const hid = window.__current_household_id;
        const u = customMeals.filter(m => m.id !== id);
        setCustomMeals(u);
        await DB.set(hid ? KEYS.hhCustomMeals() : KEYS.customMeals(), u);
      },
      pantryItems: pantryItems
    }), subTab === "grocery" && /*#__PURE__*/React.createElement(GroceryTab, {
      plan: weekPlan,
      checked: checkedItems,
      setChecked: async c => {
        const hid = window.__current_household_id;
        setCheckedItems(c);
        await DB.set(hid ? KEYS.hhGroceryCheck(sunKey) : KEYS.groceryCheck(sunKey), c);
      }
    }),
  
    /* MealLogChat modal */
    openSlot && /*#__PURE__*/React.createElement(MealLogChat, {
      slot: openSlot,
      date: today,
      existing: openSlot === "snack" ? null : mealLog[openSlot],
      mealLibrary: mealLibrary,
      allMeals: allMeals,
      userName: isPartner ? partnerName : userName,
      onSave: meal => handleSlotSave(openSlot, meal),
      onClose: () => setOpenSlot(null)
    }));
  }

  // Export
  window.FoodTab = FoodTab;
})();
