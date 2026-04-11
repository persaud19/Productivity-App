// Mission Log — Personal Tab Module
// Contains: Morning, Evening, Goals, Sunday and all sub-components
(function () {
  'use strict';
  const { DB, KEYS, getToday, fmtDate, fmtMid, fmtLong, addDays, daysBetween, getSundayKey, callClaude, useAutoSave, getMondayOfWeek, getDayKey, ALL_EXERCISES, C, CL, inp, Lbl, SectionHead } = window.__ml;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;
  const GOAL_CATEGORY_META = window.GOAL_CATEGORY_META;
  const GOAL_TEMPLATES = window.GOAL_TEMPLATES;

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

  window.Morning = Morning;
  window.Evening = Evening;
  window.Goals = Goals;
  window.Sunday = Sunday;
  window.MobilityTab = MobilityTab;
  window.MorningReadOnly = MorningReadOnly;
  window.EveningReadOnly = EveningReadOnly;
  window.HealthScorecard = HealthScorecard;
})();
