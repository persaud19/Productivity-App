// Mission Log — History Tab Module
// Contains: DayDetailView, HistoryBrowser
// Loaded after app.js so window.__ml is available.
(function () {
  'use strict';
  const { DB, KEYS, getToday, fmtLong } = window.__ml;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

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
  const snackColors = ["var(--color-success)", "var(--color-accent-yellow)", "var(--color-accent-orange)", "var(--color-danger)"];
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
    color = "var(--color-primary)"
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
      color: "var(--color-accent-purple)",
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
      style: { padding: "7px 12px", background: "rgba(244,168,35,.15)", border: "1px solid rgba(244,168,35,.3)", color: "var(--color-primary)", borderRadius: 9, fontSize: 12, cursor: "pointer", fontWeight: 700 }
    }, "\u270F\uFE0F Edit"),
    /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      style: { padding: "7px 14px", background: "var(--card-bg-2)", border: "1px solid rgba(255,255,255,.1)", color: "var(--text-secondary)", borderRadius: 9, fontSize: 12, cursor: "pointer", fontWeight: 700 }
    }, "\u2190 Back")
  )), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, [["morning", "Morning", "var(--color-primary)", hasMorning], ["evening", "Evening", "var(--color-accent-blue)", hasEvening], ["both", "Both", "var(--color-accent-purple)", hasMorning || hasEvening]].map(([id, l, c, has]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setSection(id),
    disabled: !has,
    style: {
      flex: 1,
      padding: "7px 0",
      borderRadius: 7,
      border: "1px solid " + (section === id ? c : "var(--card-bg-4)"),
      background: section === id ? c + "18" : "transparent",
      color: section === id ? c : has ? "var(--text-secondary)" : "var(--text-disabled)",
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
      color: "var(--color-accent-purple)",
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
      color: "var(--color-primary)",
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
      background: "var(--color-primary)",
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
      color: "var(--color-primary)",
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
      color: "var(--color-accent-purple)",
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
      color: "var(--color-accent-teal)",
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
  }, [["Sleep Quality", m.sleep, "var(--color-accent-purple)"], ["Energy", m.energy, "var(--color-accent-blue)"], ["Readiness", m.readiness, "var(--color-success)"], ["Mood", m.mood, "var(--color-accent-pink)"], ["Hunger", m.hunger, "var(--color-accent-orange)"]].map(([l, v, c]) => v ? /*#__PURE__*/React.createElement("div", {
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
      color: "var(--color-accent-blue)",
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
      color: "var(--color-accent-orange)",
      fontSize: 11,
      fontWeight: 700
    }
  }, m.mobilityCount, "/10 exercises")), m.intention && /*#__PURE__*/React.createElement(Field, {
    label: "Intention",
    value: m.intention,
    color: "var(--color-primary)"
  }), m.gratitude && /*#__PURE__*/React.createElement(Field, {
    label: "Gratitude",
    value: m.gratitude,
    color: "var(--text-primary)"
  }))), (section === "evening" || section === "both") && /*#__PURE__*/React.createElement("div", null, section === "both" && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--color-accent-blue)",
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
      background: "var(--color-accent-blue)",
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
      color: "var(--color-success)",
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
      color: "var(--color-success)",
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
  }, [["Day Rating", e.dayRating, "var(--color-primary)"], ["Evening Mood", e.eveningMood, "var(--color-accent-purple)"], ["Food Quality", e.foodQuality, "var(--color-accent-orange)"]].map(([l, v, c]) => v ? /*#__PURE__*/React.createElement("div", {
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
      color: "var(--color-accent-purple)",
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
      color: "var(--color-accent-teal)",
      fontSize: 11,
      fontWeight: 700
    }
  }, "\u2713 Yes"))), e.win && /*#__PURE__*/React.createElement(Field, {
    label: "Win of the Day",
    value: e.win,
    color: "var(--color-primary)"
  }), e.familyMoment && /*#__PURE__*/React.createElement(Field, {
    label: "Family Moment",
    value: e.familyMoment,
    color: "var(--color-accent-pink)"
  }), e.financeNote && /*#__PURE__*/React.createElement(Field, {
    label: "Finance Note",
    value: e.financeNote,
    color: "var(--color-accent-teal)"
  }), e.moodNote && /*#__PURE__*/React.createElement(Field, {
    label: "Mood Note",
    value: e.moodNote,
    color: "var(--text-primary)"
  }), e.choresDone && e.choreNote && /*#__PURE__*/React.createElement(Field, {
    label: "Chore Completed",
    value: e.choreNote,
    color: "var(--color-accent-orange)"
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
      const userName = settings?.name || "the user";
      const prompt = "You are " + userName + "'s long-term accountability partner with access to their full history. Analyze ALL of this data and give a 6-8 sentence insight report that identifies real multi-week patterns — not just this week.\n\nSTATISTICS:\n- Total days logged: " + allLogs.length + "\n- Workout frequency: " + workoutRate + "% of logged days\n- Avg snacking level (0=none, 3=heavy): " + avgSnack + "/3\n- Weight data points: " + weightData.length + "\n- Sunday reviews saved: " + reviews.length + "\n\nSUNDAY REVIEW HISTORY (most recent first):\n" + reviewSummaries + "\n\nWrite a candid pattern analysis. Call out:\n1. What is consistently improving vs consistently struggling\n2. Any cycles or recurring patterns (e.g. good week → bad week → good week)\n3. Which pillar is most consistently underscored\n4. One thing the data suggests they are not seeing themselves\n5. One specific suggestion based on what works (reference actual good weeks)\n\nTone: Direct. Honest. Like a coach reviewing game tape. No generic advice — reference their actual data.";
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
      background: "var(--color-accent-purple)",
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      color: "var(--color-accent-purple)",
      fontFamily: "'Syne',sans-serif",
      fontSize: 18,
      margin: 0,
      fontWeight: 800
    }
  }, "History")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
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
      color: view === id ? "var(--color-accent-purple)" : "var(--text-secondary)",
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
      color: monthOffset === 0 ? "var(--text-disabled)" : "var(--text-secondary)",
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
        border: "1px solid " + (isSelected ? "var(--color-accent-purple)" : isToday ? "rgba(167,139,250,.5)" : hasLog ? "rgba(74,222,128,.3)" : "rgba(255,255,255,.06)"),
        background: isSelected ? "var(--color-accent-purple)" : isToday ? "rgba(167,139,250,.18)" : hasLog ? "rgba(74,222,128,.1)" : "rgba(255,255,255,.02)",
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
        color: isSelected ? "var(--bg)" : isToday ? "var(--color-accent-purple)" : hasLog ? "var(--color-success)" : "var(--text-muted)",
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
        background: isSelected ? "rgba(8,11,17,.5)" : hasMorning ? "var(--color-primary)" : "rgba(255,255,255,.15)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: isSelected ? "rgba(8,11,17,.5)" : hasEvening ? "var(--color-accent-blue)" : "rgba(255,255,255,.15)"
      }
    })), exceptional && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: 2,
        right: 3,
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: "var(--color-accent-purple)"
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
        background: "var(--color-accent-purple)"
      }
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 12,
      flexWrap: "wrap"
    }
  }, [["var(--color-primary)", "Morning logged"], ["var(--color-accent-blue)", "Evening logged"], ["var(--color-success)", "Both logged"], ["var(--color-accent-purple)", "Today / Exceptional"]].map(([c, l]) => /*#__PURE__*/React.createElement("div", {
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
      color: "var(--text-disabled)",
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
      color: "var(--text-disabled)",
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
        color: "var(--color-success)",
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
        color: "var(--color-success)",
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
      const c = v >= 4 ? "var(--color-success)" : v >= 3 ? "var(--color-primary)" : v >= 2 ? "var(--color-accent-orange)" : "var(--color-danger)";
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
        color: "var(--text-muted)",
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: ".06em",
        margin: "0 0 5px",
        fontWeight: 700
      }
    }, "AI Brief (saved)"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--color-accent-purple)",
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
      color: "var(--color-accent-purple)",
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
      color: insightLoading || allSundays.length === 0 ? "var(--text-muted)" : "var(--color-accent-purple)",
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
      background: "var(--color-accent-purple)",
      animation: "pulse 1.2s ease-in-out " + i * 0.2 + "s infinite"
    }
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--color-accent-purple)",
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
      color: "var(--color-accent-purple)",
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

  window.DayDetailView = DayDetailView;
  window.HistoryBrowser = HistoryBrowser;
})();
