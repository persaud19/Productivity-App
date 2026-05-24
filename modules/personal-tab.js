// Corevado — Personal Tab Module
// Contains: Morning, Evening, Goals, Sunday and all sub-components
(function () {
  'use strict';
  const { DB, KEYS, getToday, fmtDate, fmtMid, fmtLong, addDays, daysBetween, getSundayKey, callClaude, useAutoSave, getMondayOfWeek, getDayKey, ALL_EXERCISES, C, CL, inp, Lbl, SectionHead, getChildren } = window.__ml;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;
  const GOAL_CATEGORY_META = window.GOAL_CATEGORY_META;
  const GOAL_TEMPLATES = window.GOAL_TEMPLATES;

  // ── Shared components from app.js ──
  // These are defined in app.js global scope and must be pulled in explicitly
  // inside this IIFE so they're accessible without window. prefix.
  const ProgBar = window.ProgBar;
  const StatCell = window.StatCell;
  const fmtDateFull = window.fmtDateFull;

  // ── Recharts ──
  const { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
          ResponsiveContainer, ReferenceLine, CartesianGrid } = window.Recharts || {};

  // ── Mobility zone colours (defined in data/mobility-exercises.js) ──
  const ZONE_COLORS = window.ZONE_COLORS || {};

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
  const ac = accentColor || "var(--color-primary)";
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
        color: sel ? "var(--bg)" : isToday ? "var(--text-primary)" : "var(--text-secondary)",
        fontSize: 9,
        fontWeight: 700,
        margin: "0 0 2px",
        textTransform: "uppercase"
      }
    }, isToday ? "NOW" : dow), /*#__PURE__*/React.createElement("p", {
      style: {
        color: sel ? "var(--bg)" : hasData ? "var(--color-success)" : "var(--text-secondary)",
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
        background: sel ? "var(--bg)" : "var(--color-success)",
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
    c: "var(--color-primary)"
  });
  if (m.wakeTime) fields.push({
    label: "Wake Time",
    value: m.wakeTime,
    c: "var(--color-accent-purple)"
  });
  if (m.sleep) fields.push({
    label: "Sleep Quality",
    value: m.sleep + "/5",
    c: "var(--color-accent-purple)"
  });
  if (m.energy) fields.push({
    label: "Energy",
    value: m.energy + "/5",
    c: "var(--color-accent-blue)"
  });
  if (m.readiness) fields.push({
    label: "Readiness",
    value: m.readiness + "/5",
    c: "var(--color-success)"
  });
  if (m.showingUp) fields.push({
    label: "Showing Up",
    value: m.showingUp + "/5",
    c: "var(--color-accent-blue)"
  });
  if (m.mood) fields.push({
    label: "Mood",
    value: m.mood + "/5",
    c: "var(--color-accent-pink)"
  });
  if (m.hunger) fields.push({
    label: "Hunger",
    value: m.hunger + "/5",
    c: "var(--color-accent-orange)"
  });
  if (m.steps) fields.push({
    label: "Steps",
    value: parseInt(m.steps).toLocaleString(),
    c: "var(--color-accent-teal)"
  });
  if (m.glasses) fields.push({
    label: "Water",
    value: m.glasses + "/8 glasses",
    c: "var(--color-accent-blue)"
  });
  if (typeof m.mobilityCount !== "undefined") fields.push({
    label: "Mobility",
    value: m.mobilityCount + "/10",
    c: "var(--color-accent-orange)"
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
      color: "var(--color-accent-purple)",
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
  }), m.reflection && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: m.reflectionPrompt ? "Check-in (" + m.reflectionPrompt + ")" : "Morning Reflection"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-primary)",
        fontSize: 13,
        margin: 0,
        lineHeight: 1.6
      }
    }, m.reflection))
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
  const snackColors = ["var(--color-success)", "var(--color-accent-yellow)", "var(--color-accent-orange)", "var(--color-danger)"];
  const fields = [];
  if (e.steps) fields.push({
    label: "Steps",
    value: parseInt(e.steps).toLocaleString(),
    c: "var(--color-accent-teal)"
  });
  if (e.cardio) fields.push({
    label: "Cardio",
    value: "✓ Done",
    c: "var(--color-success)"
  });
  if (e.strength) fields.push({
    label: "Strength",
    value: "✓ Done",
    c: "var(--color-success)"
  });
  if (typeof e.snack === "number") fields.push({
    label: "Snacking",
    value: snackLabels[e.snack] || "",
    c: snackColors[e.snack] || "#555"
  });
  if (e.foodQuality) fields.push({
    label: "Food Quality",
    value: e.foodQuality + "/5",
    c: "var(--color-accent-orange)"
  });
  if (e.financeWin) fields.push({
    label: "Finance Win",
    value: "✓ Yes",
    c: "var(--color-accent-teal)"
  });
  if (e.eveningMood) fields.push({
    label: "Mood",
    value: e.eveningMood + "/5",
    c: "var(--color-accent-purple)"
  });
  if (e.dayRating) fields.push({
    label: "Day Rating",
    value: e.dayRating + "/5",
    c: "var(--color-primary)"
  });
  if (e.bedtime) fields.push({
    label: "Bedtime",
    value: e.bedtime,
    c: "var(--color-accent-purple)"
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
      color: "var(--color-accent-purple)",
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
  }), e.reflection && /*#__PURE__*/React.createElement(Card, {
    ch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
      c: e.reflectionPrompt ? "Reflection (" + e.reflectionPrompt + ")" : "Evening Reflection"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-primary)",
        fontSize: 13,
        margin: 0,
        lineHeight: 1.6
      }
    }, e.reflection))
  }));
}
// ── AI-powered dynamic prompt engine ──
// Summarizes recent logs into a compact snapshot for the AI call
function buildLogSnapshot(allLogs, trainHistory, todayLog, type) {
  const recent = (allLogs || []).slice(0, 14);
  if (!recent.length) return null;
  var lines = [];
  recent.forEach(function(l) {
    var parts = [l.date];
    if (l.morning) {
      var m = l.morning;
      if (m.showingUp || m.energy) parts.push("showing-up:" + (m.showingUp || m.energy) + "/5");
      if (m.sleep) parts.push("sleep:" + m.sleep + "/5");
      if (m.weight) parts.push("wt:" + m.weight);
      if (m.intention) parts.push('intention:"' + m.intention + '"');
      if (m.reflection) parts.push('reflection:"' + m.reflection.slice(0, 80) + '"');
      if (m.gratitude) parts.push('gratitude:"' + m.gratitude.slice(0, 60) + '"');
    }
    if (l.evening) {
      var e = l.evening;
      if (e.dayRating) parts.push("dayRating:" + e.dayRating + "/5");
      if (e.win) parts.push('win:"' + e.win.slice(0, 60) + '"');
      if (e.steps) parts.push("steps:" + e.steps);
      if (e.glasses) parts.push("water:" + e.glasses + "/8");
      if (e.reflection) parts.push('evReflection:"' + e.reflection.slice(0, 80) + '"');
      if (e.cardio) parts.push("cardio:yes");
      if (e.strength) parts.push("strength:yes");
      if (e.familyMoment) parts.push('family:"' + e.familyMoment.slice(0, 60) + '"');
    }
    if (parts.length > 1) lines.push(parts.join(" | "));
  });
  // Add training context
  var trainDates = new Set((trainHistory || []).map(function(s) { return s.date; }));
  var daysNoTrain = 0;
  for (var i = 0; i < 7; i++) {
    if (!trainDates.has(addDays(getToday(), -i))) daysNoTrain++; else break;
  }
  if (daysNoTrain >= 2) lines.push("NOTE: " + daysNoTrain + " consecutive days without training");
  // Add today's morning context for evening prompts
  if (type === "evening" && todayLog?.morning) {
    var tm = todayLog.morning;
    var todayParts = ["TODAY morning:"];
    if (tm.intention) todayParts.push('intention="' + tm.intention + '"');
    if (tm.showingUp) todayParts.push("showing-up:" + tm.showingUp + "/5");
    if (tm.sleep) todayParts.push("sleep:" + tm.sleep + "/5");
    if (tm.reflection) todayParts.push('reflection="' + tm.reflection.slice(0, 100) + '"');
    lines.push(todayParts.join(" | "));
  }
  return lines.join("\n");
}

// Cache key for localStorage — one prompt per type per day
function promptCacheKey(type) { return "corevado_prompt_" + type + "_" + getToday(); }

// Instant fallback while AI loads (or if API fails)
function getFallbackPrompt(type, allLogs, todayLog, trainHistory, settings) {
  var dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  if (type === "morning") {
    var bank = [
      "What's one thing you've been avoiding?",
      "Who needs your attention today?",
      "What would make today a 5 out of 5?",
      "What are you grateful for right now?",
      "Where do you want to put your energy today?",
      "What do you need to let go of to show up fully today?",
      "What went well yesterday that you want to repeat?",
      "What's one boundary you need to hold today?",
      "What will future-you thank you for doing today?",
      "What does success look like for you today?"
    ];
    return { id: "fallback", prompt: bank[dayOfYear % bank.length], color: "var(--color-primary)" };
  }
  // Evening — check intention first
  var intention = todayLog?.morning?.intention;
  if (intention) return { id: "intention_check", prompt: 'Your intention was "' + intention + '." Did you live it?', color: "var(--color-primary)" };
  var eBank = [
    "What surprised you today?",
    "If you could redo one thing today, what would it be?",
    "What moment today are you most proud of?",
    "What did you learn today that you didn't know yesterday?",
    "What's the one thing you want to carry into tomorrow?"
  ];
  return { id: "fallback", prompt: eBank[dayOfYear % eBank.length], color: "var(--color-accent-blue)" };
}

// AI prompt generator — calls Claude to analyze recent data and create a personalized question
async function generateAIPrompt(type, allLogs, trainHistory, todayLog, settings) {
  var cacheKey = promptCacheKey(type);
  var cached = null;
  try { cached = JSON.parse(localStorage.getItem(cacheKey)); } catch(e) {}
  if (cached && cached.prompt) return cached;

  var snapshot = buildLogSnapshot(allLogs, trainHistory, todayLog, type);
  if (!snapshot) return null;

  var userName = settings?.name || "the user";
  var partnerName = window.__ml?.getPartnerName ? window.__ml.getPartnerName(settings || {}) : "their partner";

  var systemPrompt = "You are a personal life coach embedded in a daily check-in app. " +
    "The user's name is " + userName + " and their partner is " + partnerName + ". " +
    "You will receive 7-14 days of their daily log data (sleep, energy, mood, wins, reflections, workouts, weight, etc). " +
    "Your job is to generate ONE deeply personal " + type + " check-in question based on patterns you notice. " +
    "Look for: streaks (good or bad), momentum shifts, recurring themes in reflections, training gaps, " +
    "weight trends, sleep patterns, missing data, emotional patterns, consistency wins. " +
    "The question should feel like it comes from someone who's been watching their journey — specific, " +
    "not generic. Reference actual data points when relevant (e.g. '3 good days in a row', 'your sleep dipped Tuesday'). " +
    "Return JSON: {\"prompt\": \"the question\", \"id\": \"short_slug\", \"color\": \"one of: var(--color-primary), var(--color-accent-blue), var(--color-accent-purple), var(--color-accent-orange), var(--color-success), var(--color-accent-teal), var(--color-accent-pink), var(--color-danger)\"}. " +
    "Keep the question under 120 characters. Be warm but direct. " +
    (type === "morning" ? "This is a MORNING prompt — forward-looking, about intention and planning." : "This is an EVENING prompt — reflective, about what happened and what to learn.");

  try {
    var result = await callClaude(
      [{ role: "user", content: "Here are the recent daily logs:\n\n" + snapshot + "\n\nGenerate one personalized " + type + " check-in question." }],
      systemPrompt,
      200
    );
    if (result && result.prompt) {
      localStorage.setItem(cacheKey, JSON.stringify(result));
      return result;
    }
  } catch(e) {
    // API failure — silently fall back
  }
  return null;
}

// React hook: returns prompt object, starts with fallback, upgrades to AI when ready
function useSmartPrompt(type, allLogs, trainHistory, todayLog, settings) {
  var fallback = getFallbackPrompt(type, allLogs, todayLog, trainHistory, settings);
  var _s = useState(function() {
    try { var c = JSON.parse(localStorage.getItem(promptCacheKey(type))); if (c && c.prompt) return c; } catch(e) {}
    return fallback;
  });
  var prompt = _s[0], setPrompt = _s[1];
  var _l = useState(false);
  var loading = _l[0], setLoading = _l[1];

  useEffect(function() {
    if (!allLogs || allLogs.length < 3) return;
    var cached = null;
    try { cached = JSON.parse(localStorage.getItem(promptCacheKey(type))); } catch(e) {}
    if (cached && cached.prompt) { setPrompt(cached); return; }

    var cancelled = false;
    setLoading(true);
    generateAIPrompt(type, allLogs, trainHistory, todayLog, settings).then(function(result) {
      if (cancelled) return;
      if (result && result.prompt) setPrompt(result);
      setLoading(false);
    }).catch(function() { if (!cancelled) setLoading(false); });
    return function() { cancelled = true; };
  }, [allLogs?.length >= 3 ? 1 : 0]);

  return { prompt: prompt, loading: loading };
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
  const [view, setView] = useState(initialDate && initialDate !== getToday() ? "history" : "log");
  const [histLog, setHistLog] = useState(null);
  const isHistory = view === "history";
  const ex = isHistory ? histLog && histLog.morning || {} : todayLog?.morning || {};
  const [wt, setWt] = useState(ex.weight || "");
  const [wake, setWake] = useState(ex.wakeTime || "");
  const [sl, setSl] = useState(ex.sleep || 0);
  const [showUp, setShowUp] = useState(ex.showingUp || ex.energy || 0);
  const [it, setIt] = useState(ex.intention || "");
  const [reflection, setReflection] = useState(ex.reflection || "");
  const [isExceptional, setIsExceptional] = useState(ex.exceptionalDay || false);
  const [exceptionalReason, setExceptionalReason] = useState(ex.exceptionalReason || "");
  const [backfill, setBackfill] = useState(false);
  const [backfillDate, setBackfillDate] = useState(getPrevDay());
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (view === "history") {
      DB.get(KEYS.log(histDate)).then(l => setHistLog(l || null));
    }
  }, [view, histDate]);

  useEffect(() => {
    if (view !== "history") return;
    const m = (histLog && histLog.morning) || {};
    setWt(m.weight || "");
    setWake(m.wakeTime || "");
    setSl(m.sleep || 0);
    setShowUp(m.showingUp || m.energy || 0);
    setIt(m.intention || "");
    setReflection(m.reflection || "");
    setIsExceptional(m.exceptionalDay || false);
    setExceptionalReason(m.exceptionalReason || "");
    setOk(false);
  }, [histLog]);

  const smartPrompt = useSmartPrompt("morning", allLogsArr, null, todayLog, settings);
  const promptInfo = smartPrompt.prompt;
  const gap = (wt && settings?.weightGoal) ? (parseFloat(wt) - parseFloat(settings.weightGoal)).toFixed(1) : null;

  const sleepDuration = (() => {
    const yesterday = getPrevDay();
    const yLog = allLogsArr.find(l => l.date === yesterday);
    const lastBed = yLog?.evening?.bedtime || todayLog?.evening?.bedtime;
    if (!wake || !lastBed) return null;
    const [bh, bm] = lastBed.split(":").map(Number);
    const [wh, wm] = wake.split(":").map(Number);
    let mins = wh * 60 + wm - (bh * 60 + bm);
    if (mins < 0) mins += 1440;
    const h = Math.floor(mins / 60), m = mins % 60;
    return h + "h " + (m > 0 ? m + "m" : "");
  })();

  const data = {
    weight: parseFloat(wt) || null,
    wakeTime: wake,
    sleep: sl,
    showingUp: showUp,
    intention: it,
    reflection: reflection,
    reflectionPrompt: promptInfo.id,
    exceptionalDay: isExceptional,
    exceptionalReason
  };
  useAutoSave(backfill || isHistory ? null : KEYS.log(getToday()), { morning: data }, !busy && !isHistory);

  const go = async () => {
    setBusy(true);
    const date = backfill ? backfillDate : isHistory ? histDate : getToday();
    const existing = (await DB.get(KEYS.log(date))) || {};
    await DB.set(KEYS.log(date), { ...existing, morning: data });
    setBusy(false);
    setOk(true);
    onSave && onSave();
  };

  const insightBanner = useMemo(() => {
    if (isHistory || allLogsArr.length < 3) return null;
    const last7 = allLogsArr.slice(0, 7);
    const sleepScores = last7.map(l => l.morning?.sleep).filter(Boolean);
    const avgSleep = sleepScores.length ? (sleepScores.reduce((a, b) => a + b, 0) / sleepScores.length).toFixed(1) : null;
    const showUpScores = last7.map(l => l.morning?.showingUp || l.morning?.energy).filter(Boolean);
    const avgShowUp = showUpScores.length ? (showUpScores.reduce((a, b) => a + b, 0) / showUpScores.length).toFixed(1) : null;
    const streak = allLogsArr.filter((l, i) => i < 14 && l.morning).length;
    const parts = [];
    if (avgSleep) parts.push("Sleep avg: " + avgSleep + "/5");
    if (avgShowUp) parts.push("Showing up avg: " + avgShowUp + "/5");
    if (streak >= 3) parts.push(streak + " day streak");
    if (!parts.length) return null;
    return parts.join("  \xB7  ");
  }, [allLogsArr.length, isHistory]);

  return React.createElement("div", null,
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 } },
      React.createElement("div", null,
        React.createElement(SectionHead, { label: "Morning Check-in", color: "var(--color-primary)" }),
        React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 12, margin: "0 0 0 13px" } }, fmtMid(getToday()))
      ),
      React.createElement("div", { style: { display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,.09)" } },
        React.createElement("button", { onClick: () => setView("log"), style: { padding: "6px 12px", border: "none", background: view === "log" ? "rgba(244,168,35,.15)" : "transparent", color: view === "log" ? "var(--color-primary)" : "var(--text-secondary)", fontWeight: view === "log" ? 700 : 400, fontSize: 11, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "TODAY"),
        React.createElement("button", { onClick: () => setView("history"), style: { padding: "6px 12px", border: "none", background: view === "history" ? "rgba(96,165,250,.15)" : "transparent", color: view === "history" ? "var(--color-accent-blue)" : "var(--text-secondary)", fontWeight: view === "history" ? 700 : 400, fontSize: 11, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "HISTORY")
      )
    ),

    view === "history" && React.createElement("div", null,
      React.createElement(HistoryStrip, { selectedDate: histDate, onSelectDate: function(d) { setHistDate(d); setHistLog(null); }, allLogs: allLogsArr, accentColor: "var(--color-primary)" }),
      React.createElement("div", { style: { padding: "9px 13px", background: "rgba(244,168,35,.06)", border: "1px solid rgba(244,168,35,.15)", borderRadius: 10, marginBottom: 16 } },
        React.createElement("p", { style: { color: "var(--color-primary)", fontSize: 11, fontWeight: 700, margin: 0 } }, "✏️ Editing " + fmtLong(histDate))
      )
    ),

    ok && React.createElement(Card, { ch: React.createElement("p", { style: { color: "var(--color-success)", margin: 0, fontSize: 13 } }, "✓ Morning logged — stay intentional today."), s: { borderColor: "rgba(74,222,128,.25)", background: "rgba(74,222,128,.06)", marginBottom: 16 } }),

    view === "log" && todayLog?.morning && !ok && React.createElement("div", { style: { padding: "10px 13px", background: "rgba(244,168,35,.06)", border: "1px solid rgba(244,168,35,.15)", borderRadius: 10, marginBottom: 14 } },
      React.createElement("p", { style: { color: "var(--color-primary)", fontSize: 11, fontWeight: 700, margin: "0 0 2px" } }, "✓ Today already logged"),
      React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 10, margin: 0 } }, "Updates will overwrite. Scroll down to re-submit.")
    ),

    insightBanner && view === "log" && React.createElement("div", { style: { padding: "10px 14px", background: "rgba(167,139,250,.06)", border: "1px solid rgba(167,139,250,.12)", borderRadius: 10, marginBottom: 14 } },
      React.createElement("p", { style: { color: "var(--color-accent-purple)", fontSize: 11, fontWeight: 700, margin: 0, letterSpacing: ".03em" } }, insightBanner)
    ),

    (view === "log" || isHistory) && React.createElement(React.Fragment, null,

      view === "log" && new Date().getHours() >= 10 && !todayLog?.morning && React.createElement("div", { style: { marginBottom: 14, padding: "10px 13px", background: "rgba(167,139,250,.06)", border: "1px solid rgba(167,139,250,.15)", borderRadius: 10 } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
          React.createElement("p", { style: { color: "var(--color-accent-purple)", fontSize: 11, fontWeight: 700, margin: 0 } }, "Did you miss yesterday?"),
          React.createElement("button", { onClick: function() { setBackfill(!backfill); }, style: { padding: "4px 10px", background: backfill ? "rgba(167,139,250,.2)" : "transparent", border: "1px solid rgba(167,139,250,.3)", color: "var(--color-accent-purple)", borderRadius: 6, fontSize: 10, cursor: "pointer", fontWeight: 700 } }, backfill ? "Cancel" : "Log Yesterday")
        ),
        backfill && React.createElement("input", { type: "date", value: backfillDate, onChange: function(e) { setBackfillDate(e.target.value); }, style: { ...inp, marginTop: 8, fontSize: 13, colorScheme: "dark" } })
      ),

      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 13 } },

        // 1. Weight
        React.createElement(Card, { ch: React.createElement(React.Fragment, null,
          React.createElement(Lbl, { c: "Weight (lbs)" }),
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16 } },
            React.createElement("input", { type: "number", value: wt, onChange: function(e) { setWt(e.target.value); }, placeholder: settings?.weightStart ? String(settings.weightStart) : "lbs", style: { ...inp, width: 88 } }),
            gap !== null && React.createElement("div", null,
              React.createElement("p", { style: { color: "var(--color-primary)", fontWeight: 800, fontSize: 20, margin: 0, fontFamily: "'Syne',sans-serif" } }, parseFloat(gap) > 0 ? "+" : "", gap, " lbs"),
              React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: 0 } }, settings?.weightGoal ? "from " + settings.weightGoal + " lb goal" : "set a weight goal in Goals")
            )
          )
        ) }),

        // 2. Wake Time + sleep calc
        React.createElement(Card, { ch: React.createElement(React.Fragment, null,
          React.createElement(Lbl, { c: "Wake-up Time" }),
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
            React.createElement("input", { type: "time", value: wake, onChange: function(e) { setWake(e.target.value); }, style: { ...inp, width: 130, colorScheme: "dark" } }),
            sleepDuration && React.createElement("div", { style: { padding: "6px 12px", background: "rgba(167,139,250,.1)", borderRadius: 8 } },
              React.createElement("p", { style: { color: "var(--color-accent-purple)", fontSize: 13, fontWeight: 700, margin: 0 } }, sleepDuration),
              React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: 0 } }, "slept")
            )
          )
        ) }),

        // 3. Sleep Quality
        React.createElement(Card, { ch: React.createElement(React.Fragment, null,
          React.createElement(Lbl, { c: "Sleep Quality" }),
          React.createElement(Dots, { val: sl, set: setSl, col: "var(--color-accent-purple)" })
        ) }),

        // 4. How are you showing up? (merged energy + mood)
        React.createElement(Card, { ch: React.createElement(React.Fragment, null,
          React.createElement(Lbl, { c: "How are you showing up today?" }),
          React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: "0 0 8px" } }, "Body + mind combined — 1 = struggling, 5 = locked in"),
          React.createElement(Dots, { val: showUp, set: setShowUp, col: "var(--color-accent-blue)" })
        ) }),

        // 5. Intention
        React.createElement(Card, { ch: React.createElement(React.Fragment, null,
          React.createElement(Lbl, { c: "Today's Intention" }),
          React.createElement("input", { type: "text", value: it, onChange: function(e) { setIt(e.target.value); }, placeholder: "focused \xB7 present \xB7 disciplined...", style: inp, maxLength: 60 })
        ) }),

        // 6. Contextual rotating prompt
        React.createElement(Card, { s: { borderColor: promptInfo.color + "33", background: promptInfo.color + "0a" }, ch: React.createElement(React.Fragment, null,
          React.createElement("p", { style: { color: promptInfo.color, fontSize: 11, fontWeight: 800, letterSpacing: ".05em", margin: "0 0 4px", fontFamily: "'Syne',sans-serif" } }, smartPrompt.loading ? "GENERATING YOUR CHECK-IN…" : "TODAY'S CHECK-IN"),
          React.createElement("p", { style: { color: "var(--text-primary)", fontSize: 14, margin: "0 0 10px", lineHeight: 1.5, fontWeight: 500 } }, promptInfo.prompt),
          React.createElement("textarea", { value: reflection, onChange: function(e) { setReflection(e.target.value); }, placeholder: "Take a moment…", style: { ...inp, resize: "none", minHeight: 80, lineHeight: 1.6, fontSize: 13 }, maxLength: 500 })
        ) }),

        // Exceptional day — collapsed toggle
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0" } },
          React.createElement("button", { onClick: function() { setIsExceptional(!isExceptional); }, style: { background: isExceptional ? "rgba(167,139,250,.15)" : "transparent", border: "1px solid " + (isExceptional ? "rgba(167,139,250,.3)" : "rgba(255,255,255,.1)"), borderRadius: 8, padding: "6px 12px", color: isExceptional ? "var(--color-accent-purple)" : "var(--text-muted)", fontSize: 11, cursor: "pointer", fontWeight: isExceptional ? 700 : 400 } }, isExceptional ? "⚡ Exceptional day" : "Flag as exceptional day"),
          isExceptional && React.createElement("input", { type: "text", value: exceptionalReason, onChange: function(e) { setExceptionalReason(e.target.value); }, placeholder: "Reason...", style: { ...inp, flex: 1, fontSize: 12 } })
        ),

        // Submit
        React.createElement("button", { onClick: go, disabled: busy, style: { background: busy ? "rgba(244,168,35,.45)" : "var(--color-primary)", color: "var(--bg)", border: "none", borderRadius: 10, padding: "14px 0", fontSize: 15, fontWeight: 800, cursor: busy ? "wait" : "pointer", width: "100%", fontFamily: "'Syne',sans-serif", letterSpacing: ".05em" } }, busy ? "SAVING..." : isHistory ? "SAVE CHANGES →" : "LOG MORNING →")
      )
    )
  );
}

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
  const barColor = isDeficit ? "var(--color-success)" : "var(--color-danger)";

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

  const poolById = useMemo(() => new Map(mobilityPool.map(e => [e.id, e])), [mobilityPool]);

  const setMobility = async (updated) => {
    const checked = typeof updated === "function" ? updated(mobility) : updated;
    setMobilityState(checked);
    const todayDayKey = getDayKey(getToday());
    const todayIds = weekPlan?.[todayDayKey] || [];
    const dailyList = todayIds.map(id => poolById.get(id)).filter(Boolean);
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
  const dailyList = todayIds.map(id => poolById.get(id)).filter(Boolean);
  const mobDone = dailyList.filter(e => mobility[e.id]).length;

  return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement(SectionHead, { label: "Mobility", color: "var(--color-accent-purple)" }),
    /*#__PURE__*/React.createElement("p", { style: { fontSize: 12, color: "var(--text-muted)", margin: "0 0 16px 13px" } }, fmtMid(getToday()) + " \xB7 " + mobDone + "/10 done"),
    /*#__PURE__*/React.createElement(Card, {
      ch: mobLoading
        ? /*#__PURE__*/React.createElement("div", { style: { padding: "16px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 12 } }, "Loading mobility plan\u2026")
        : /*#__PURE__*/React.createElement(MobilityChecklist, { checked: mobility, setChecked: setMobility, dailyList: dailyList, onManagePool: () => setShowPoolManager(true) })
    }),
    // Pool Manager Modal
    showPoolManager && /*#__PURE__*/React.createElement(React.Fragment, null,
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 300 }, onClick: () => setShowPoolManager(false) }),
      /*#__PURE__*/React.createElement("div", { style: { position: "fixed", inset: 0, background: "var(--bg)", zIndex: 301, display: "flex", flexDirection: "column" } },
        /*#__PURE__*/React.createElement("div", { style: { padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 } },
          /*#__PURE__*/React.createElement("div", null,
            /*#__PURE__*/React.createElement("p", { style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: "var(--color-accent-purple)", margin: 0 } }, "MOBILITY POOL"),
            /*#__PURE__*/React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" } }, mobilityPool.length + " exercises \xB7 " + Math.ceil(mobilityPool.length / 7) + "x coverage/week")
          ),
          /*#__PURE__*/React.createElement("button", { onClick: () => setShowPoolManager(false), style: { background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 22, cursor: "pointer", lineHeight: 1 } }, "\xD7")
        ),
        /*#__PURE__*/React.createElement("div", { style: { padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(167,139,250,.04)", flexShrink: 0 } },
          /*#__PURE__*/React.createElement("p", { style: { fontSize: 10, color: "var(--color-accent-purple)", fontWeight: 700, letterSpacing: ".05em", margin: "0 0 8px" } }, "ADD EXERCISE"),
          /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
            /*#__PURE__*/React.createElement("input", { placeholder: "Exercise name *", value: poolForm.name, onChange: e => setPoolForm(f => ({ ...f, name: e.target.value })), onKeyDown: e => e.key === "Enter" && handleAddPoolExercise(), style: { flex: "2 1 140px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "7px 10px", color: "var(--text-primary)", fontSize: 12, outline: "none" } }),
            /*#__PURE__*/React.createElement("select", { value: poolForm.zone, onChange: e => setPoolForm(f => ({ ...f, zone: e.target.value })), style: { flex: "1 1 90px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "7px 6px", color: "var(--text-primary)", fontSize: 12, outline: "none" } },
              Object.keys(ZONE_COLORS).map(z => /*#__PURE__*/React.createElement("option", { key: z, value: z }, z.charAt(0).toUpperCase() + z.slice(1)))
            ),
            /*#__PURE__*/React.createElement("input", { placeholder: "Reps/time", value: poolForm.reps, onChange: e => setPoolForm(f => ({ ...f, reps: e.target.value })), style: { flex: "1 1 110px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "7px 10px", color: "var(--text-primary)", fontSize: 12, outline: "none" } }),
            /*#__PURE__*/React.createElement("input", { placeholder: "Tip (optional)", value: poolForm.tip, onChange: e => setPoolForm(f => ({ ...f, tip: e.target.value })), style: { flex: "2 1 140px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "7px 10px", color: "var(--text-primary)", fontSize: 12, outline: "none" } }),
            /*#__PURE__*/React.createElement("button", { onClick: handleAddPoolExercise, style: { padding: "7px 16px", background: "var(--color-accent-purple)", border: "none", borderRadius: 7, color: "var(--bg)", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "+ ADD")
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
          /*#__PURE__*/React.createElement("button", { onClick: () => { if (window.confirm("Reset to 50 default exercises?")) handleResetPool(); }, style: { background: "transparent", border: "1px solid rgba(239,68,68,.3)", borderRadius: 8, padding: "8px 16px", color: "var(--color-danger)", fontSize: 11, cursor: "pointer" } }, "Reset to defaults (50 exercises)")
        )
      )
    )
  );
}

// TrainTab — extracted to modules/train-tab.js


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
  tasks,
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
  const [trainHistory, setTrainHistory] = useState([]);
  useEffect(function() {
    if (isHistory) {
      DB.get(KEYS.log(histDate)).then(function(l) { setHistLog(l || null); });
    }
  }, [view, histDate]);
  useEffect(function() {
    DB.get(KEYS.trainHistory()).then(function(h) { setTrainHistory(Array.isArray(h) ? h : []); });
  }, []);

  const ex = todayLog?.evening || {};
  const [steps, setSteps] = useState(ex.steps || "");
  const [glasses, setGlasses] = useState(ex.glasses || 0);
  const [dr, setDr] = useState(ex.dayRating || 0);
  const [wi, setWi] = useState(ex.win || "");
  const [bedtime, setBedtime] = useState(ex.bedtime || "");
  const [reflection, setReflection] = useState(ex.reflection || "");
  const [exceptional, setExceptional] = useState(ex.exceptionalDay || false);
  const [exceptReason, setExceptReason] = useState(ex.exceptionalReason || "");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  // Reset form fields when history log loads
  useEffect(function() {
    if (!isHistory) return;
    var e = (histLog && histLog.evening) || {};
    setSteps(e.steps || "");
    setGlasses(e.glasses || 0);
    setDr(e.dayRating || 0);
    setWi(e.win || "");
    setBedtime(e.bedtime || "");
    setReflection(e.reflection || "");
    setExceptional(e.exceptionalDay || false);
    setExceptReason(e.exceptionalReason || "");
    setOk(false);
  }, [histLog]);

  const stepGoal = settings?.stepGoal || 10000;
  const stepPct = steps ? Math.min(100, Math.round(parseInt(steps) / stepGoal * 100)) : 0;

  const smartPrompt = useSmartPrompt("evening", allLogsArr, trainHistory, todayLog, settings);
  const promptInfo = smartPrompt.prompt;

  // Auto-detect workouts from Train tab
  const todaySessions = useMemo(function() {
    return trainHistory.filter(function(s) { return s.date === getToday(); });
  }, [trainHistory]);
  const didCardio = todaySessions.some(function(s) { return s.type === "cardio" || s.type === "walk"; });
  const didStrength = todaySessions.some(function(s) { return s.type === "strength"; });

  // No-meals-logged nudge
  const mealsLogged = mealLog ? ["breakfast", "lunch", "dinner"].filter(function(s) { return mealLog[s]; }).length : 0;

  const data = {
    steps: parseInt(steps) || 0,
    glasses: glasses,
    dayRating: dr,
    win: wi,
    bedtime: bedtime,
    reflection: reflection,
    reflectionPrompt: promptInfo.id,
    exceptionalDay: exceptional,
    exceptionalReason: exceptReason,
    // Preserve auto-detected workout flags for backward compat with history/Sunday
    cardio: didCardio,
    strength: didStrength
  };
  useAutoSave(isHistory ? null : KEYS.log(getToday()), { evening: data }, !busy && !isHistory);

  const go = async function() {
    setBusy(true);
    var saveDate = isHistory ? histDate : getToday();
    var existing = (await DB.get(KEYS.log(saveDate))) || {};
    await DB.set(KEYS.log(saveDate), { ...existing, evening: data });
    // Archive wins (only for today's log)
    if (!isHistory && wi.trim()) {
      var arch = (await DB.get(KEYS.winsArchive())) || [];
      if (!arch.find(function(w) { return w.date === getToday(); })) {
        await DB.set(KEYS.winsArchive(), [{ date: getToday(), win: wi, ...(settings?.name ? { who: settings.name } : {}) }, ...arch].slice(0, 365));
      }
    }
    setBusy(false);
    setOk(true);
    onSave && onSave();
  };

  // Accountability banners
  var accountabilityBanners = [];

  // No training for 2+ days
  if (!isHistory) {
    var trainDates = new Set(trainHistory.map(function(s) { return s.date; }));
    var daysNoTrain = 0;
    for (var i = 0; i < 4; i++) {
      var d = addDays(getToday(), -i);
      if (!trainDates.has(d)) daysNoTrain++; else break;
    }
    if (daysNoTrain >= 2) {
      accountabilityBanners.push({ color: "var(--color-accent-orange)", bg: "rgba(251,146,60,.07)", border: "rgba(251,146,60,.15)", text: daysNoTrain + " days without training — what's been the blocker?" });
    }

    // No meals logged today
    if (mealsLogged === 0) {
      accountabilityBanners.push({ color: "var(--color-accent-orange)", bg: "rgba(251,146,60,.05)", border: "rgba(251,146,60,.12)", text: "No meals logged today — head to Food tab to track what you ate." });
    }
  }

  return React.createElement("div", null,
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 } },
      React.createElement("div", null,
        React.createElement(SectionHead, { label: "Evening Check-in", color: "var(--color-accent-blue)" }),
        React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 12, margin: "0 0 0 13px" } }, fmtMid(getToday()))
      ),
      React.createElement("div", { style: { display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,.09)" } },
        React.createElement("button", { onClick: function() { setView("log"); }, style: { padding: "6px 12px", border: "none", background: view === "log" ? "rgba(96,165,250,.15)" : "transparent", color: view === "log" ? "var(--color-accent-blue)" : "var(--text-secondary)", fontWeight: view === "log" ? 700 : 400, fontSize: 11, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "TODAY"),
        React.createElement("button", { onClick: function() { setView("history"); }, style: { padding: "6px 12px", border: "none", background: view === "history" ? "rgba(96,165,250,.15)" : "transparent", color: view === "history" ? "var(--color-accent-blue)" : "var(--text-secondary)", fontWeight: view === "history" ? 700 : 400, fontSize: 11, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "HISTORY")
      )
    ),

    view === "history" && React.createElement("div", null,
      React.createElement(HistoryStrip, { selectedDate: histDate, onSelectDate: function(d) { setHistDate(d); setHistLog(null); }, allLogs: allLogsArr, accentColor: "var(--color-accent-blue)" }),
      React.createElement("div", { style: { padding: "9px 13px", background: "rgba(96,165,250,.06)", border: "1px solid rgba(96,165,250,.15)", borderRadius: 10, marginBottom: 16 } },
        React.createElement("p", { style: { color: "var(--color-accent-blue)", fontSize: 11, fontWeight: 700, margin: 0 } }, "✏️ Editing " + fmtLong(histDate))
      )
    ),

    ok && React.createElement(Card, { ch: React.createElement("p", { style: { color: "var(--color-accent-blue)", margin: 0, fontSize: 13 } }, "✓ Day closed. Rest well."), s: { borderColor: "rgba(96,165,250,.25)", background: "rgba(96,165,250,.06)", marginBottom: 16 } }),

    // Accountability banners
    accountabilityBanners.map(function(b, idx) {
      return React.createElement("div", { key: idx, style: { padding: "10px 13px", background: b.bg, border: "1px solid " + b.border, borderRadius: 10, marginBottom: 12 } },
        React.createElement("p", { style: { color: b.color, fontSize: 12, fontWeight: 700, margin: 0, lineHeight: 1.5 } }, b.text)
      );
    }),

    // Auto-detected workout summary
    !isHistory && (didCardio || didStrength) && React.createElement("div", { style: { padding: "10px 13px", background: "rgba(74,222,128,.06)", border: "1px solid rgba(74,222,128,.15)", borderRadius: 10, marginBottom: 12 } },
      React.createElement("p", { style: { color: "var(--color-success)", fontSize: 12, fontWeight: 700, margin: 0 } },
        "✓ Today's training: " + [didStrength && "Strength", didCardio && "Cardio"].filter(Boolean).join(" + ") + " (" + todaySessions.length + " session" + (todaySessions.length !== 1 ? "s" : "") + ")"
      )
    ),

    (view === "log" || isHistory) && React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 13 } },

      // 1. Steps
      React.createElement(Card, { ch: React.createElement(React.Fragment, null,
        React.createElement(Lbl, { c: "Today's Steps (goal: " + stepGoal.toLocaleString() + ")" }),
        React.createElement("input", { type: "number", value: steps, onChange: function(e) { setSteps(e.target.value); }, placeholder: "e.g. 8432", style: { ...inp, width: 150, marginBottom: 8 } }),
        steps && React.createElement(React.Fragment, null,
          React.createElement(ProgBar, { pct: stepPct, col: stepPct >= 100 ? "var(--color-success)" : "var(--color-accent-blue)", h: 6 }),
          React.createElement("p", { style: { color: stepPct >= 100 ? "var(--color-success)" : "var(--text-secondary)", fontSize: 11, margin: "5px 0 0", fontWeight: stepPct >= 100 ? 700 : 400 } }, stepPct >= 100 ? "Goal hit! ✓" : stepPct + "% of goal")
        )
      ) }),

      // 2. Water
      React.createElement(Card, { ch: React.createElement(React.Fragment, null,
        React.createElement(Lbl, { c: "Water Intake Today" }),
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 8 } },
          React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } },
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function(n) {
              return React.createElement("button", { key: n, onClick: function() { setGlasses(n); }, style: { width: 30, height: 30, borderRadius: 7, border: "2px solid " + (glasses >= n && n > 0 ? "var(--color-accent-blue)" : "rgba(255,255,255,.12)"), background: glasses >= n && n > 0 ? "rgba(96,165,250,.18)" : "transparent", cursor: "pointer", color: glasses >= n && n > 0 ? "var(--color-accent-blue)" : "var(--text-muted)", fontSize: 12, fontWeight: 700, padding: 0 } }, n === 0 ? "0" : n);
            })
          ),
          React.createElement("p", { style: { color: glasses >= 8 ? "var(--color-success)" : glasses >= 5 ? "var(--color-accent-blue)" : "var(--text-secondary)", fontSize: 11, margin: 0, fontWeight: 700 } }, glasses + "/8 glasses " + (glasses >= 8 ? "✓" : ""))
        )
      ) }),

      // 3. Day Rating
      (function() {
        var computedRating = null;
        if (macroTargets && mealLog) {
          var slots = ["breakfast","lunch","dinner"];
          var cal=0,prot=0,carbs=0,fat=0;
          slots.forEach(function(s) { if(mealLog[s]){cal+=mealLog[s].calories||0;prot+=mealLog[s].protein||0;carbs+=mealLog[s].carbs||0;fat+=mealLog[s].fat||0;}});
          (mealLog.snacks||[]).forEach(function(s){cal+=s.calories||0;prot+=s.protein||0;carbs+=s.carbs||0;fat+=s.fat||0;});
          if (typeof macroScore === "function") {
            var score = macroScore({calories:cal,protein:prot,carbs:carbs,fat:fat}, macroTargets);
            computedRating = score !== null ? Math.max(1, Math.min(5, Math.round(score))) : null;
          }
        }
        if (computedRating !== null && computedRating !== dr) { setDr(computedRating); }
        var ratingLabel = dr ? ["","Poor","Below avg","On track","Good","Nailed it"][dr] : null;
        return React.createElement(Card, { ch: React.createElement(React.Fragment, null,
          React.createElement(Lbl, { c: "Day Rating" }),
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
            [1,2,3,4,5].map(function(n) {
              return React.createElement("div", { key: n, onClick: function() { setDr(n); }, style: { width: 28, height: 28, borderRadius: "50%", background: n <= dr ? "var(--color-primary)" : "rgba(255,255,255,.07)", border: "2px solid " + (n <= dr ? "var(--color-primary)" : "rgba(255,255,255,.1)"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: n <= dr ? "var(--bg)" : "var(--text-muted)", cursor: "pointer" } }, n);
            }),
            ratingLabel && React.createElement("span", { style: { fontSize: 12, color: "var(--color-primary)", fontWeight: 700 } }, ratingLabel)
          ),
          computedRating !== null && React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", marginTop: 6 } }, "Auto-scored from your meals + macro targets"),
          mealsLogged > 0 && React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", marginTop: 4 } }, mealsLogged + " meal" + (mealsLogged !== 1 ? "s" : "") + " logged today")
        ) });
      })(),

      // 4. Contextual rotating reflection
      React.createElement(Card, { s: { borderColor: promptInfo.color + "33", background: promptInfo.color + "0a" }, ch: React.createElement(React.Fragment, null,
        React.createElement("p", { style: { color: promptInfo.color, fontSize: 11, fontWeight: 800, letterSpacing: ".05em", margin: "0 0 4px", fontFamily: "'Syne',sans-serif" } }, smartPrompt.loading ? "READING YOUR WEEK…" : "EVENING REFLECTION"),
        React.createElement("p", { style: { color: "var(--text-primary)", fontSize: 14, margin: "0 0 10px", lineHeight: 1.5, fontWeight: 500 } }, promptInfo.prompt),
        React.createElement("textarea", { value: reflection, onChange: function(e) { setReflection(e.target.value); }, placeholder: "Be honest with yourself…", style: { ...inp, resize: "none", minHeight: 80, lineHeight: 1.6, fontSize: 13 }, maxLength: 500 })
      ) }),

      // 5. Win of the Day
      React.createElement(Card, { ch: React.createElement(React.Fragment, null,
        React.createElement(Lbl, { c: "Win of the Day" }),
        React.createElement("input", { type: "text", value: wi, onChange: function(e) { setWi(e.target.value); }, placeholder: "One real win — no matter how small", style: inp })
      ) }),

      // Reminders completed today
      (function() {
        var today = getToday();
        var allRem = [].concat(reminders || [], jointReminders || []);
        var doneToday = allRem.filter(function(r) { return r.done && r.doneAt && r.doneAt.slice(0, 10) === today; });
        if (!doneToday.length) return null;
        return React.createElement(Card, { ch: React.createElement(React.Fragment, null,
          React.createElement(Lbl, { c: "Reminders Completed Today" }),
          doneToday.map(function(r) {
            return React.createElement("div", { key: r.id, style: { display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: 13, color: "var(--text-secondary)" } },
              React.createElement("span", { style: { color: "var(--color-success)", fontSize: 12 } }, "✓"),
              React.createElement("span", { style: { flex: 1 } }, r.title),
              r.type === "joint" && React.createElement("span", { style: { fontSize: 10, background: "rgba(96,165,250,.15)", border: "1px solid rgba(96,165,250,.25)", borderRadius: 4, padding: "1px 6px", color: "var(--color-accent-blue)", fontWeight: 700 } }, "JOINT")
            );
          })
        ) });
      })(),

      // Tasks completed today
      (function() {
        var today = getToday();
        var tasksDoneToday = (tasks || []).filter(function(t) { return t.last === today; });
        if (!tasksDoneToday.length) return null;
        return React.createElement(Card, { ch: React.createElement(React.Fragment, null,
          React.createElement(Lbl, { c: "Tasks Completed Today" }),
          tasksDoneToday.map(function(t) {
            return React.createElement("div", { key: t.id, style: { display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: 13, color: "var(--text-secondary)" } },
              React.createElement("span", { style: { color: "var(--color-success)", fontSize: 12 } }, "✓"),
              React.createElement("span", { style: { flex: 1 } }, t.name || t.title),
              t.completedBy && React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)" } }, t.completedBy)
            );
          })
        ) });
      })(),

      // 6. Bedtime
      React.createElement(Card, { ch: React.createElement(React.Fragment, null,
        React.createElement(Lbl, { c: "Bedtime Tonight" }),
        React.createElement("input", { type: "time", value: bedtime, onChange: function(e) { setBedtime(e.target.value); }, style: { ...inp, width: 130, colorScheme: "dark" } }),
        React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: "6px 0 0" } }, "Tomorrow's morning will calculate how long you slept")
      ) }),

      // Exceptional day — collapsed toggle
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0" } },
        React.createElement("button", { onClick: function() { setExceptional(!exceptional); }, style: { background: exceptional ? "rgba(167,139,250,.15)" : "transparent", border: "1px solid " + (exceptional ? "rgba(167,139,250,.3)" : "rgba(255,255,255,.1)"), borderRadius: 8, padding: "6px 12px", color: exceptional ? "var(--color-accent-purple)" : "var(--text-muted)", fontSize: 11, cursor: "pointer", fontWeight: exceptional ? 700 : 400 } }, exceptional ? "⚡ Exceptional day" : "Flag as exceptional day"),
        exceptional && React.createElement("input", { type: "text", value: exceptReason, onChange: function(e) { setExceptReason(e.target.value); }, placeholder: "Reason...", style: { ...inp, flex: 1, fontSize: 12 } })
      ),

      // Submit
      React.createElement("button", { onClick: go, disabled: busy, style: { background: busy ? "rgba(96,165,250,.45)" : "var(--color-accent-blue)", color: "var(--bg)", border: "none", borderRadius: 10, padding: "14px 0", fontSize: 15, fontWeight: 800, cursor: busy ? "wait" : "pointer", width: "100%", fontFamily: "'Syne',sans-serif", letterSpacing: ".05em" } }, busy ? "SAVING..." : isHistory ? "SAVE CHANGES →" : "CLOSE THE DAY →")
    )
  );
}

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

function GoalWizard({ onSave, onClose }) {
  const [step, setStep] = useState(1);
  const [cat, setCat] = useState(null);
  const [form, setForm] = useState({});
  const sf = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const col = cat ? GOAL_CATEGORY_META[cat].color : "var(--color-accent-teal)";

  const selectTemplate = tpl => { setForm({ ...tpl.fields }); setStep(3); };
  const handleSave = () => {
    const goal = { id: `goal_${Date.now()}`, type: cat, startDate: form.startDate || getToday(), createdAt: new Date().toISOString(), completedAt: null, ...form };
    onSave(goal);
  };

  return React.createElement(React.Fragment, null,
    React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 200 }, onClick: onClose }),
    React.createElement("div", {
      style: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "calc(100% - 32px)", maxWidth: 420, background: "var(--bg-modal)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: "20px", zIndex: 201, maxHeight: "85vh", overflowY: "auto" }
    },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 } },
        React.createElement("p", { style: { color: col, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, margin: 0 } },
          step === 1 ? "CHOOSE A CATEGORY" : step === 2 ? "PICK A TEMPLATE" : "SET YOUR GOAL"),
        React.createElement("button", { onClick: onClose, style: { background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer", lineHeight: 1 } }, "\xD7")
      ),
      step > 1 && React.createElement("button", {
        onClick: () => setStep(s => s - 1),
        style: { background: "none", border: "none", color: "var(--text-muted)", fontSize: 12, cursor: "pointer", padding: "0 0 14px 0" }
      }, "\u2190 Back"),

      step === 1 && React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
        ...Object.entries(GOAL_CATEGORY_META).map(([id, meta]) =>
          React.createElement("button", { key: id, onClick: () => { setCat(id); setStep(2); },
            style: { padding: "14px 12px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, cursor: "pointer", textAlign: "left" } },
            React.createElement("p", { style: { color: meta.color, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 11, margin: "0 0 4px", letterSpacing: ".06em" } }, meta.label.toUpperCase()),
            React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: 0 } }, meta.desc)
          )
        )
      ),

      step === 2 && React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
        ...(GOAL_TEMPLATES[cat] || []).map(tpl =>
          React.createElement("button", { key: tpl.id, onClick: () => selectTemplate(tpl),
            style: { padding: "13px 14px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, cursor: "pointer", textAlign: "left", color: "var(--text-primary)", fontSize: 13, fontWeight: 500 } },
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
          React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "2px 0 0" } }, "Progress auto-calculated from Finance tab (income \u2212 spending from goal start date).")
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
          style: { marginTop: 4, width: "100%", padding: "12px 0", background: col, color: "var(--bg)", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
        }, "ADD GOAL \u2192")
      )
    )
  );
}

// Shared helper: count consecutive days ending today where hasFn(dateStr) is true
function countCurrentStreak(startDate, today, hasFn) {
  let cur = 0;
  let d = new Date(today);
  while (true) {
    const ds = d.toISOString().split("T")[0];
    if (ds < startDate || !hasFn(ds)) break;
    cur++;
    d.setDate(d.getDate() - 1);
  }
  return cur;
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
    const cur = countCurrentStreak(startDate, today, ds => trainDates.has(ds));
    let run = 0, longest = 0;
    let d = new Date(startDate);
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
    const cur = countCurrentStreak(startDate, today, ds => !!log[ds]);
    let total = 0; let d = new Date(startDate);
    while (d <= new Date(today)) { const ds = d.toISOString().split("T")[0]; if (log[ds]) total++; d.setDate(d.getDate() + 1); }
    const last30 = [];
    for (let i = 29; i >= 0; i--) { const dd = new Date(today); dd.setDate(dd.getDate() - i); const ds = dd.toISOString().split("T")[0]; last30.push({ d: fmtDate(ds), v: log[ds] ? 1 : 0 }); }
    return { cur, total, last30 };
  };

  const today = getToday();
  const recentWins = wins.filter(w => daysBetween(w.date, today) <= winsFilter);
  const wtLogs = allLogs.filter(l => l.morning?.weight).sort((a, b) => a.date.localeCompare(b.date));
  const ttStyle = { background: "var(--bg-tooltip)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, fontSize: 12 };
  const cardStyle = { background: "var(--card-bg)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "16px", marginBottom: 14 };

  const renderGoalCard = goal => {
    const meta = GOAL_CATEGORY_META[goal.type] || GOAL_CATEGORY_META.custom;
    const col = meta.color;
    const cardHeader = React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 } },
      React.createElement("div", null,
        React.createElement("span", { style: { display: "inline-block", padding: "2px 8px", background: `${col}22`, border: `1px solid ${col}44`, borderRadius: 5, color: col, fontSize: 9, fontWeight: 800, letterSpacing: ".07em", marginBottom: 6, fontFamily: "'Syne',sans-serif" } }, meta.label.toUpperCase()),
        React.createElement("p", { style: { color: "var(--text-primary)", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, margin: 0 } }, goal.label)
      ),
      React.createElement("div", { style: { display: "flex", gap: 6 } },
        React.createElement("button", { onClick: () => setConfirmGoal(goal), style: { padding: "5px 10px", background: `${col}22`, border: `1px solid ${col}44`, borderRadius: 7, color: col, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "\u2713 Done"),
        React.createElement("button", { onClick: () => setDeleteConfirm(goal.id), style: { padding: "5px 8px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.15)", borderRadius: 7, color: "var(--color-danger)", fontSize: 12, cursor: "pointer" } }, "\xD7")
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
          React.createElement("p", { style: { color: col, fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1 } }, cWt, React.createElement("span", { style: { fontSize: 13, color: "var(--text-muted)", fontWeight: 400 } }, " lbs")),
          React.createElement(Arc, { pct, col })
        ),
        React.createElement(ProgBar, { pct, col, h: 5 }),
        React.createElement("div", { style: { display: "flex", gap: 0, marginTop: 10 } },
          React.createElement(StatCell, { lbl: goal.direction === "gain" ? "Still to Gain" : "Still to Lose", val: `${remaining.toFixed(1)} lbs`, c: col }),
          React.createElement(StatCell, { lbl: "Achieved", val: `${achieved.toFixed(1)} lbs`, c: "var(--color-success)" }),
          daysLeft !== null && React.createElement(StatCell, { lbl: "Days Left", val: daysLeft, c: "var(--color-accent-blue)" })
        ),
        projLabel && React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "8px 0 10px" } }, "Current pace \u2192 reach goal by ", React.createElement("span", { style: { color: "var(--color-success)", fontWeight: 700 } }, projLabel)),
        wtData.length >= 2 && React.createElement("div", null,
          React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } },
            React.createElement(Lbl, { c: "Weight Trend" }),
            React.createElement("div", { style: { display: "flex", gap: 4 } },
              [30, 90, 365].map(r => React.createElement("button", { key: r, onClick: () => setWeightRange(r),
                style: { padding: "2px 7px", borderRadius: 5, fontSize: 10, cursor: "pointer", border: `1px solid ${weightRange === r ? col + "66" : "rgba(255,255,255,.07)"}`, background: weightRange === r ? col + "22" : "transparent", color: weightRange === r ? col : "var(--text-muted)", fontWeight: weightRange === r ? 700 : 400 } }, r, "d"))
            )
          ),
          React.createElement("div", { style: { height: 120 } },
            React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
              React.createElement(LineChart, { data: wtData },
                React.createElement(XAxis, { dataKey: "d", tick: { fill: "var(--text-muted)", fontSize: 9 }, axisLine: false, tickLine: false }),
                React.createElement(YAxis, { domain: ["auto", "auto"], tick: { fill: "var(--text-muted)", fontSize: 9 }, axisLine: false, tickLine: false, width: 32 }),
                React.createElement(ReferenceLine, { y: wg, stroke: "var(--color-success)", strokeDasharray: "3 3" }),
                React.createElement(Tooltip, { contentStyle: ttStyle, labelStyle: { color: "var(--text-secondary)" }, itemStyle: { color: col } }),
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
            React.createElement("p", { style: { color: col, fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1 } }, cur, React.createElement("span", { style: { fontSize: 13, color: "var(--text-muted)", fontWeight: 400 } }, " day streak")),
            React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "4px 0 0" } }, "Target: ", target, " days \xB7 Best: ", longest, " days")
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
        React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, textAlign: "center", margin: "4px 0 0" } }, "Last 30 days")
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
          React.createElement("div", { style: { width: 26, height: 26, borderRadius: "50%", background: todayDone ? col : "transparent", border: `2px solid ${todayDone ? col : "var(--text-muted)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
            todayDone && React.createElement("span", { style: { color: "var(--bg)", fontWeight: 900, fontSize: 13 } }, "\u2713")),
          React.createElement("div", { style: { textAlign: "left" } },
            React.createElement("p", { style: { color: todayDone ? col : "var(--text-secondary)", fontWeight: 700, fontSize: 13, margin: 0, fontFamily: "'Syne',sans-serif" } }, todayDone ? "Done today!" : "Mark today complete"),
            React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "2px 0 0" } }, goal.habitName || goal.label)
          )
        ),
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
          React.createElement("p", { style: { color: col, fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, margin: 0 } }, cur, React.createElement("span", { style: { fontSize: 12, color: "var(--text-muted)", fontWeight: 400 } }, " day streak")),
          React.createElement(Arc, { pct, col })
        ),
        React.createElement(ProgBar, { pct, col, h: 5 }),
        React.createElement("div", { style: { display: "flex", gap: 0, marginTop: 8 } },
          React.createElement(StatCell, { lbl: "Target", val: `${target} days`, c: col }),
          React.createElement(StatCell, { lbl: "Total Completions", val: total, c: "var(--color-success)" })
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
        React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, textAlign: "center", margin: "2px 0 0" } }, "Last 30 days")
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
            React.createElement("p", { style: { color: col, fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1 } }, "$", Math.round(netSaved).toLocaleString(), React.createElement("span", { style: { fontSize: 12, color: "var(--text-muted)", fontWeight: 400 } }, " saved")),
            React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "4px 0 0" } }, "Target: $", target.toLocaleString(), daysLeft !== null ? ` \xB7 ${daysLeft} days left` : "")
          ),
          React.createElement(Arc, { pct, col })
        ),
        React.createElement(ProgBar, { pct, col, h: 5 }),
        React.createElement("div", { style: { display: "flex", gap: 0, marginTop: 8 } },
          React.createElement(StatCell, { lbl: "Still Needed", val: `$${Math.max(0, Math.round(target - netSaved)).toLocaleString()}`, c: col }),
          React.createElement(StatCell, { lbl: "Progress", val: `${pct}%`, c: "var(--color-success)" })
        ),
        Object.keys(financeMonthsData).length === 0 && React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "10px 0 0", textAlign: "center" } }, "Import Finance data to auto-track progress."),
        monthly.length >= 2 && React.createElement("div", { style: { marginTop: 12, height: 100 } },
          React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
            React.createElement(BarChart, { data: monthly },
              React.createElement(XAxis, { dataKey: "month", tick: { fill: "var(--text-muted)", fontSize: 9 }, axisLine: false, tickLine: false }),
              React.createElement(YAxis, { tick: { fill: "var(--text-muted)", fontSize: 9 }, axisLine: false, tickLine: false, width: 40 }),
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
            React.createElement("p", { style: { color: col, fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1 } }, "$", Math.round(currentBal).toLocaleString(), React.createElement("span", { style: { fontSize: 12, color: "var(--text-muted)", fontWeight: 400 } }, " remaining")),
            React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "4px 0 0" } }, "Started: $", startBal.toLocaleString(), daysLeft !== null ? ` \xB7 ${daysLeft} days left` : "")
          ),
          React.createElement(Arc, { pct, col })
        ),
        React.createElement(ProgBar, { pct, col, h: 5 }),
        React.createElement("div", { style: { display: "flex", gap: 0, marginTop: 8, marginBottom: 12 } },
          React.createElement(StatCell, { lbl: "Paid Off", val: `$${Math.round(paid).toLocaleString()}`, c: "var(--color-success)" }),
          React.createElement(StatCell, { lbl: "Remaining", val: `$${Math.round(currentBal).toLocaleString()}`, c: col })
        ),
        React.createElement("div", { style: { display: "flex", gap: 8 } },
          React.createElement("input", { type: "number", value: balInputs[goal.id] || "", onChange: e => setBalInputs(p => ({ ...p, [goal.id]: e.target.value })), placeholder: "Update current balance...", style: { ...inp, flex: 1, fontSize: 12 } }),
          React.createElement("button", { onClick: () => { if (!balInputs[goal.id]) return; addProgress(goal.id, balInputs[goal.id]); setBalInputs(p => ({ ...p, [goal.id]: "" })); },
            style: { padding: "0 14px", background: col, color: "var(--bg)", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "Update")
        ),
        chartData.length >= 2 && React.createElement("div", { style: { marginTop: 12, height: 100 } },
          React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
            React.createElement(LineChart, { data: chartData },
              React.createElement(XAxis, { dataKey: "d", tick: { fill: "var(--text-muted)", fontSize: 9 }, axisLine: false, tickLine: false }),
              React.createElement(YAxis, { domain: ["auto", "auto"], tick: { fill: "var(--text-muted)", fontSize: 9 }, axisLine: false, tickLine: false, width: 40 }),
              React.createElement(ReferenceLine, { y: 0, stroke: "var(--color-success)", strokeDasharray: "3 3" }),
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
          React.createElement("p", { style: { color: col, fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1 } }, currentVal, React.createElement("span", { style: { fontSize: 12, color: "var(--text-muted)", fontWeight: 400 } }, " ", goal.unit || "")),
          React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "4px 0 0" } }, "Target: ", targetVal, " ", goal.unit || "", daysLeft !== null ? ` \xB7 ${daysLeft} days left` : "")
        ),
        React.createElement(Arc, { pct, col })
      ),
      React.createElement(ProgBar, { pct, col, h: 5 }),
      React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 12 } },
        React.createElement("input", { type: "number", value: valInputs[goal.id] || "", onChange: e => setValInputs(p => ({ ...p, [goal.id]: e.target.value })), placeholder: `Log current ${goal.unit || "value"}...`, style: { ...inp, flex: 1, fontSize: 12 } }),
        React.createElement("button", { onClick: () => { if (!valInputs[goal.id]) return; addProgress(goal.id, valInputs[goal.id]); setValInputs(p => ({ ...p, [goal.id]: "" })); },
          style: { padding: "0 14px", background: col, color: "var(--bg)", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "Log")
      )
    );
  };

  return React.createElement("div", null,
    showWizard && React.createElement(GoalWizard, { onSave: addGoal, onClose: () => setShowWizard(false) }),
    confirmGoal && React.createElement(React.Fragment, null,
      React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200 }, onClick: () => setConfirmGoal(null) }),
      React.createElement("div", { style: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "calc(100% - 40px)", maxWidth: 360, background: "var(--bg-modal)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "20px", zIndex: 201 } },
        React.createElement("p", { style: { color: "var(--color-success)", fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, margin: "0 0 4px" } }, "Mark as Complete?"),
        React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 13, margin: "0 0 14px" } }, confirmGoal.label),
        React.createElement("input", { type: "text", value: confirmNote, onChange: e => setConfirmNote(e.target.value), placeholder: "Add a note (optional)...", style: { ...inp, marginBottom: 12, fontSize: 13 } }),
        React.createElement("div", { style: { display: "flex", gap: 8 } },
          React.createElement("button", { onClick: completeGoal, style: { flex: 1, padding: "11px 0", background: "var(--color-success)", color: "var(--bg)", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "CONFIRM \u2713"),
          React.createElement("button", { onClick: () => setConfirmGoal(null), style: { flex: 1, padding: "11px 0", background: "transparent", border: "1px solid rgba(255,255,255,.1)", color: "var(--text-muted)", borderRadius: 9, fontSize: 13, cursor: "pointer" } }, "Cancel")
        )
      )
    ),
    deleteConfirm && React.createElement(React.Fragment, null,
      React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200 }, onClick: () => setDeleteConfirm(null) }),
      React.createElement("div", { style: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "calc(100% - 40px)", maxWidth: 340, background: "var(--bg-modal)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "20px", zIndex: 201 } },
        React.createElement("p", { style: { color: "var(--color-danger)", fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, margin: "0 0 8px" } }, "Delete this goal?"),
        React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 12, margin: "0 0 16px" } }, "This cannot be undone."),
        React.createElement("div", { style: { display: "flex", gap: 8 } },
          React.createElement("button", { onClick: () => deleteGoal(deleteConfirm), style: { flex: 1, padding: "10px 0", background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", color: "var(--color-danger)", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "Delete"),
          React.createElement("button", { onClick: () => setDeleteConfirm(null), style: { flex: 1, padding: "10px 0", background: "transparent", border: "1px solid rgba(255,255,255,.1)", color: "var(--text-muted)", borderRadius: 9, fontSize: 13, cursor: "pointer" } }, "Cancel")
        )
      )
    ),
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 } },
      React.createElement(SectionHead, { label: "My Goals", color: "var(--color-accent-teal)" }),
      React.createElement("button", { onClick: () => setShowWizard(true), style: { padding: "8px 14px", background: "rgba(52,211,153,.12)", border: "1px solid rgba(52,211,153,.25)", color: "var(--color-accent-teal)", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "+ Add Goal")
    ),
    goalsList.length === 0 && React.createElement("div", { style: { textAlign: "center", padding: "40px 20px", background: "var(--card-bg)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, marginBottom: 14 } },
      React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 14, margin: "0 0 16px" } }, "No active goals yet."),
      React.createElement("button", { onClick: () => setShowWizard(true), style: { padding: "11px 20px", background: "var(--color-accent-teal)", color: "var(--bg)", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" } }, "Set Your First Goal \u2192")
    ),
    ...goalsList.map(g => renderGoalCard(g)),
    wins.length > 0 && React.createElement("div", { style: { marginBottom: 14 } },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
        React.createElement(Lbl, { c: "Wins Archive" }),
        React.createElement("div", { style: { display: "flex", gap: 4 } },
          [7, 30, 90].map(f => React.createElement("button", { key: f, onClick: () => setWinsFilter(f),
            style: { padding: "2px 7px", borderRadius: 5, fontSize: 10, cursor: "pointer", border: `1px solid ${winsFilter === f ? "rgba(74,222,128,.4)" : "rgba(255,255,255,.07)"}`, background: winsFilter === f ? "rgba(74,222,128,.12)" : "transparent", color: winsFilter === f ? "var(--color-success)" : "var(--text-muted)", fontWeight: winsFilter === f ? 700 : 400 } }, f, "d"))
        )
      ),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 5 } },
        recentWins.length === 0
          ? React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 12, margin: 0, textAlign: "center", padding: "12px 0" } }, "No wins in the last ", winsFilter, " days.")
          : recentWins.slice(0, 10).map((w, i) => React.createElement("div", { key: i,
              style: { display: "flex", gap: 10, padding: "9px 12px", background: "var(--card-bg)", borderRadius: 9, border: "1px solid rgba(255,255,255,.06)", alignItems: "flex-start" } },
              React.createElement("span", { style: { color: "var(--color-primary)", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 } }, fmtDate(w.date)),
              React.createElement("span", { style: { color: "var(--text-primary)", fontSize: 12, flex: 1 } }, w.win)
            ))
      )
    ),
    completedGoals.length > 0 && React.createElement("div", null,
      React.createElement(Lbl, { c: "Completed Goals" }),
      completedGoals.map((g, i) => React.createElement("div", { key: i,
        style: { background: "rgba(74,222,128,.04)", border: "1px solid rgba(74,222,128,.12)", borderRadius: 10, padding: "11px 13px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
        React.createElement("div", null,
          React.createElement("p", { style: { color: "var(--text-primary)", fontSize: 13, fontWeight: 600, margin: "0 0 2px" } }, g.label),
          g.note && React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "0 0 2px", fontStyle: "italic" } }, "\u201C", g.note, "\u201D"),
          React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: 0 } }, "Completed ", g.completedAt ? fmtDateFull(g.completedAt.split("T")[0]) : "")
        ),
        React.createElement("span", { style: { background: "rgba(74,222,128,.15)", color: "var(--color-success)", fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "3px 9px", flexShrink: 0 } }, "DONE \u2713")
      ))
    )
  );
}


  window.Morning = Morning;
  window.Evening = Evening;
  window.Goals = Goals;
  window.MobilityTab = MobilityTab;
  window.MorningReadOnly = MorningReadOnly;
  window.EveningReadOnly = EveningReadOnly;
  window.HealthScorecard = HealthScorecard;
})();
