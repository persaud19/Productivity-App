// Mission Log — Sunday Tab Module
// Contains: SundayBrief, Sunday (weekly review + all optional modules)
(function () {
  'use strict';
  const { DB, KEYS, getToday, fmtDate, fmtMid, fmtLong, addDays, daysBetween, getSundayKey, callClaude, useAutoSave, getMondayOfWeek, getDayKey, inp, Lbl, SectionHead, getChildren } = window.__ml;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;
  const { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } = (window.Recharts || {});
  const StatCell = window.StatCell;

  // ── Local helpers not in window.__ml ──
  const fmtShort = d => new Date(d + "T12:00:00").toLocaleDateString("en-CA", { weekday: "short" });
  const Card = ({ ch, s = {} }) => React.createElement("div", { style: { background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "15px 17px", ...s } }, ch);
  const Dots = ({ val, set, max = 5, col = "#f4a823", sz = 26 }) => React.createElement("div", { style: { display: "flex", gap: 7, alignItems: "center" } },
    Array.from({ length: max }).map((_, i) => React.createElement("button", {
      key: i, onClick: () => set(i + 1),
      style: { width: sz, height: sz, borderRadius: "50%", padding: 0, cursor: "pointer", background: i < val ? col : "rgba(255,255,255,0.06)", border: `2px solid ${i < val ? col : "rgba(255,255,255,0.11)"}`, transform: i < val ? "scale(1.07)" : "scale(1)", transition: "all .12s" }
    })),
    React.createElement("span", { style: { color: "var(--text-secondary)", fontSize: 12, marginLeft: 3 } }, val + "/" + max)
  );
  const C = window.__ml.C;
  const CL = window.__ml.CL;

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
            system: (() => {
              const kids = getChildren(settings);
              const kidsStr = kids.length > 0 ? " and " + kids.map(c => c.name).join(", ") : (settings?.sonName ? " and " + settings.sonName : "");
              return `You are ${settings?.name || "the user"}'s accountability partner. ${settings?.name || "User"} lives with ${window.__ml.getPartnerName(settings)}${kidsStr}, follows a 7 Pillars life framework.\n\nWrite a 5-line Sunday accountability brief:\n- Line 1 (Result): Biggest result with specific numbers.\n- Line 2 (Gap): The real gap — identify the data pattern, be direct, no softening.\n- Line 3 (Win): Something specific that went well this week.\n- Line 4 (Focus): The gap reframed as one concrete action for next week.\n- Line 5 (Close): One short sentence that lands. No fluff.\n\nIf previous weeks data is provided, reference trends across weeks — not just this week.\nTone: Direct, warm, no lectures, no guilt trips. Be honest and reference specific wins.`;
            })(),
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
    return React.createElement("div", {
      style: { marginBottom: 20 }
    }, React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }
    }, React.createElement(Lbl, { c: "AI Accountability Brief" }), generated && !loading && React.createElement("button", {
      onClick: () => {
        navigator.clipboard.writeText(brief);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      style: {
        background: copied ? "rgba(74,222,128,.15)" : "var(--card-bg-3)",
        border: `1px solid ${copied ? "rgba(74,222,128,.3)" : "var(--card-border-2)"}`,
        color: copied ? "#4ade80" : "var(--text-secondary)",
        borderRadius: 6, padding: "3px 10px", fontSize: 10, cursor: "pointer", fontWeight: copied ? 700 : 400
      }
    }, copied ? "COPIED ✓" : "COPY")), !generated && !loading && React.createElement("div", {
      style: { background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, padding: "14px", marginBottom: 10 }
    }, React.createElement("p", {
      style: { color: "var(--text-secondary)", fontSize: 12, margin: "0 0 12px", lineHeight: 1.6 }
    }, "5-line brief from your week data + all previous Sunday history."), React.createElement("button", {
      onClick: generate,
      style: { width: "100%", padding: "13px 0", background: "linear-gradient(135deg,rgba(167,139,250,.2),rgba(96,165,250,.2))", border: "1px solid rgba(167,139,250,.35)", color: "#c4b5fd", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif", letterSpacing: ".05em" }
    }, "GENERATE THIS WEEK'S BRIEF \u2192")), loading && React.createElement("div", {
      style: { background: "rgba(167,139,250,.06)", border: "1px solid rgba(167,139,250,.15)", borderRadius: 12, padding: "18px", display: "flex", alignItems: "center", gap: 10 }
    }, React.createElement("div", {
      style: { display: "flex", gap: 4 }
    }, [0, 1, 2].map(i => React.createElement("div", {
      key: i,
      style: { width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }
    }))), React.createElement("p", { style: { color: "#a78bfa", fontSize: 12, margin: 0 } }, "Reading your week..."), React.createElement("style", null, `@keyframes pulse{0%,100%{opacity:.2}50%{opacity:1}}`)), generated && !loading && lines.length > 0 && React.createElement("div", {
      style: { background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, overflow: "hidden" }
    }, lines.map((line, i) => React.createElement("div", {
      key: i,
      style: { display: "flex", borderBottom: i < lines.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none" }
    }, React.createElement("div", {
      style: { width: 3, background: lc[i] || "var(--text-secondary)", flexShrink: 0 }
    }), React.createElement("div", {
      style: { flex: 1, padding: "12px 14px" }
    }, React.createElement("span", {
      style: { display: "block", color: lc[i] || "var(--text-secondary)", fontSize: 9, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 3 }
    }, ll[i] || ""), React.createElement("p", {
      style: { color: "var(--text-primary)", fontSize: 13, margin: 0, lineHeight: 1.6 }
    }, line)))), React.createElement("div", {
      style: { padding: "10px 14px", background: "rgba(255,255,255,.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }
    }, React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: 0 } }, "Generated ", fmtDate(getToday())), React.createElement("button", {
      onClick: generate,
      style: { background: "transparent", border: "1px solid rgba(255,255,255,.08)", color: "var(--text-secondary)", borderRadius: 6, padding: "3px 10px", fontSize: 10, cursor: "pointer" }
    }, "Regenerate"))));
  }

  function Sunday({
    wk,
    allLogs,
    settings,
    allSundays,
    choreTasks
  }) {
    const HistoryStrip = window.HistoryStrip;
    const MorningReadOnly = window.MorningReadOnly;
    const EveningReadOnly = window.EveningReadOnly;

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
    const [childMilestonesMap, setChildMilestonesMap] = useState({});
    const [newMilestoneMap, setNewMilestoneMap] = useState({});
    const [addingMsFor, setAddingMsFor] = useState(null);
    const [sundayOpts, setSundayOpts] = useState({ showFaith: true, showReading: true, showChildren: true, showWorkout: false, showMentalHealth: false, showHabits: false, showRelationships: false, showNutrition: false, showRecovery: false, showSunlight: false, showGiving: false, showHomeEnv: false, showWork: false, showScreen: false, showIdeas: false, showCreative: false });
    // Workout Notes state
    const [woTrainingQuality, setWoTrainingQuality] = useState(0);
    const [woBestSession, setWoBestSession] = useState("");
    const [woBodyFeel, setWoBodyFeel] = useState("");
    const [woBlocked, setWoBlocked] = useState("");
    const [woNextFocus, setWoNextFocus] = useState("");
    // Mental Health state
    const [mhAnxiety, setMhAnxiety] = useState(0);
    const [mhRegulation, setMhRegulation] = useState(0);
    const [mhConnection, setMhConnection] = useState(0);
    const [mhPractices, setMhPractices] = useState({ therapy: false, journaling: false, meditation: false, exercise: false });
    const [mhHelped, setMhHelped] = useState("");
    const [mhHardest, setMhHardest] = useState("");
    // Habit reflection state
    const [habitGoals, setHabitGoals] = useState([]);
    const [habitLogsWeek, setHabitLogsWeek] = useState({});
    const [habitHardest, setHabitHardest] = useState("");
    const [habitAdjust, setHabitAdjust] = useState("");
    const [habitConsistency, setHabitConsistency] = useState(0);
    // Relationships
    const [relPartner, setRelPartner] = useState(0);
    const [relFamily, setRelFamily] = useState(0);
    const [relFriends, setRelFriends] = useState(0);
    const [relDeepConvo, setRelDeepConvo] = useState(false);
    const [relMoment, setRelMoment] = useState("");
    // Nutrition
    const [nutQuality, setNutQuality] = useState(0);
    const [nutHomeMeals, setNutHomeMeals] = useState(0);
    const [nutMealPrep, setNutMealPrep] = useState(false);
    const [nutGaps, setNutGaps] = useState([]);
    // Recovery
    const [recSleepQuality, setRecSleepQuality] = useState(0);
    const [recSoreness, setRecSoreness] = useState(0);
    const [recPractices, setRecPractices] = useState([]);
    const [recBodyNote, setRecBodyNote] = useState("");
    // Sunlight
    const [sunDaysOutside, setSunDaysOutside] = useState(0);
    const [sunTimeOutside, setSunTimeOutside] = useState("");
    const [sunNatureMoment, setSunNatureMoment] = useState("");
    // Giving
    const [giveDidIt, setGiveDidIt] = useState(false);
    const [giveHow, setGiveHow] = useState([]);
    const [giveMoment, setGiveMoment] = useState("");
    // Home Environment
    const [homeSpaceFeel, setHomeSpaceFeel] = useState(0);
    const [homeMaintenance, setHomeMaintenance] = useState([]);
    const [homeNeedsAttention, setHomeNeedsAttention] = useState([]);
    const [homeImprovement, setHomeImprovement] = useState("");
    // Work & Career
    const [workEnergy, setWorkEnergy] = useState(0);
    const [workMode, setWorkMode] = useState([]);
    const [workBlocker, setWorkBlocker] = useState([]);
    const [workWin, setWorkWin] = useState("");
    // Screen & Focus
    const [screenTime, setScreenTime] = useState("");
    const [screenFocusQuality, setScreenFocusQuality] = useState(0);
    const [screenSinks, setScreenSinks] = useState([]);
    const [screenDeepWork, setScreenDeepWork] = useState(0);
    // Ideas & Insights
    const [ideasHadIdea, setIdeasHadIdea] = useState(false);
    const [ideasSource, setIdeasSource] = useState([]);
    const [ideasText, setIdeasText] = useState("");
    const [ideasShift, setIdeasShift] = useState("");
    // Creative Output
    const [createdSomething, setCreatedSomething] = useState(false);
    const [creativeType, setCreativeType] = useState([]);
    const [creativeSatisfaction, setCreativeSatisfaction] = useState(0);
    const [creativeNote, setCreativeNote] = useState("");

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
        }
        // Load per-child milestones — also migrate legacy ml:milestones to first child if present
        const childList = getChildren(settings);
        const map = {};
        for (const child of childList) {
          const ms = await DB.get(KEYS.childMilestones(child.id));
          map[child.id] = ms || [];
        }
        // Migration: if legacy milestones exist and not yet migrated, move them to first child
        const legacyMs = await DB.get(KEYS.milestones());
        if (legacyMs && legacyMs.length > 0 && childList.length > 0) {
          const firstId = childList[0].id;
          if (!map[firstId] || map[firstId].length === 0) {
            map[firstId] = legacyMs;
            await DB.set(KEYS.childMilestones(firstId), legacyMs);
          }
        }
        setChildMilestonesMap(map);
        const opts = await DB.get(KEYS.sundayOptions());
        if (opts) setSundayOpts(prev => ({ ...prev, ...opts }));

        // Load workout notes
        const wn2 = await DB.get(KEYS.workoutNotes(sunKey));
        if (wn2) {
          setWoTrainingQuality(wn2.trainingQuality || 0);
          setWoBestSession(wn2.bestSession || "");
          setWoBodyFeel(wn2.bodyFeel || "");
          setWoBlocked(wn2.blocked || "");
          setWoNextFocus(wn2.nextFocus || "");
        }
        // Load mental health
        const mh = await DB.get(KEYS.mentalHealth(sunKey));
        if (mh) {
          setMhAnxiety(mh.anxiety || 0);
          setMhRegulation(mh.regulation || 0);
          setMhConnection(mh.connection || 0);
          setMhPractices(mh.practices || { therapy: false, journaling: false, meditation: false, exercise: false });
          setMhHelped(mh.helped || "");
          setMhHardest(mh.hardest || "");
        }
        // Load habit reflection
        const hr = await DB.get(KEYS.habitReflection(sunKey));
        if (hr) {
          setHabitHardest(hr.hardest || "");
          setHabitAdjust(hr.adjust || "");
          setHabitConsistency(hr.consistency || 0);
        }
        // Load active habit goals + this week's logs for habit tracker
        const allGoals = await DB.get(KEYS.goals()) || [];
        const habitGs = allGoals.filter(g => g.type === "habit");
        setHabitGoals(habitGs);
        const hlMap = {};
        for (const g of habitGs) {
          hlMap[g.id] = await DB.get(KEYS.goalHabitLog(g.id)) || {};
        }
        setHabitLogsWeek(hlMap);
        // Load all weekly modules
        const relD = await DB.get(KEYS.weeklyModule(sunKey, "relationships"));
        if (relD) { setRelPartner(relD.partner||0); setRelFamily(relD.family||0); setRelFriends(relD.friends||0); setRelDeepConvo(relD.deepConvo||false); setRelMoment(relD.moment||""); }
        const nutD = await DB.get(KEYS.weeklyModule(sunKey, "nutrition"));
        if (nutD) { setNutQuality(nutD.quality||0); setNutHomeMeals(nutD.homeMeals||0); setNutMealPrep(nutD.mealPrep||false); setNutGaps(nutD.gaps||[]); }
        const recD = await DB.get(KEYS.weeklyModule(sunKey, "recovery"));
        if (recD) { setRecSleepQuality(recD.sleepQuality||0); setRecSoreness(recD.soreness||0); setRecPractices(recD.practices||[]); setRecBodyNote(recD.bodyNote||""); }
        const sunD = await DB.get(KEYS.weeklyModule(sunKey, "sunlight"));
        if (sunD) { setSunDaysOutside(sunD.daysOutside||0); setSunTimeOutside(sunD.timeOutside||""); setSunNatureMoment(sunD.natureMoment||""); }
        const givD = await DB.get(KEYS.weeklyModule(sunKey, "giving"));
        if (givD) { setGiveDidIt(givD.didIt||false); setGiveHow(givD.how||[]); setGiveMoment(givD.moment||""); }
        const homeD = await DB.get(KEYS.weeklyModule(sunKey, "home"));
        if (homeD) { setHomeSpaceFeel(homeD.spaceFeel||0); setHomeMaintenance(homeD.maintenance||[]); setHomeNeedsAttention(homeD.needsAttention||[]); setHomeImprovement(homeD.improvement||""); }
        const workD = await DB.get(KEYS.weeklyModule(sunKey, "work"));
        if (workD) { setWorkEnergy(workD.energy||0); setWorkMode(workD.mode||[]); setWorkBlocker(workD.blocker||[]); setWorkWin(workD.win||""); }
        const scrD = await DB.get(KEYS.weeklyModule(sunKey, "screen"));
        if (scrD) { setScreenTime(scrD.screenTime||""); setScreenFocusQuality(scrD.focusQuality||0); setScreenSinks(scrD.sinks||[]); setScreenDeepWork(scrD.deepWork||0); }
        const ideaD = await DB.get(KEYS.weeklyModule(sunKey, "ideas"));
        if (ideaD) { setIdeasHadIdea(ideaD.hadIdea||false); setIdeasSource(ideaD.source||[]); setIdeasText(ideaD.text||""); setIdeasShift(ideaD.shift||""); }
        const creD = await DB.get(KEYS.weeklyModule(sunKey, "creative"));
        if (creD) { setCreatedSomething(creD.created||false); setCreativeType(creD.type||[]); setCreativeSatisfaction(creD.satisfaction||0); setCreativeNote(creD.note||""); }
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
      faithMoment
    };
    const workoutNotesData = { trainingQuality: woTrainingQuality, bestSession: woBestSession, bodyFeel: woBodyFeel, blocked: woBlocked, nextFocus: woNextFocus };
    const mentalHealthData = { anxiety: mhAnxiety, regulation: mhRegulation, connection: mhConnection, practices: mhPractices, helped: mhHelped, hardest: mhHardest };
    const habitReflectionData = { hardest: habitHardest, adjust: habitAdjust, consistency: habitConsistency };
    useAutoSave(KEYS.weekReview(sunKey), reviewData);
    useAutoSave(KEYS.workoutNotes(sunKey), workoutNotesData);
    useAutoSave(KEYS.mentalHealth(sunKey), mentalHealthData);
    useAutoSave(KEYS.habitReflection(sunKey), habitReflectionData);
    useAutoSave(KEYS.weeklyModule(sunKey, "relationships"), { partner: relPartner, family: relFamily, friends: relFriends, deepConvo: relDeepConvo, moment: relMoment });
    useAutoSave(KEYS.weeklyModule(sunKey, "nutrition"), { quality: nutQuality, homeMeals: nutHomeMeals, mealPrep: nutMealPrep, gaps: nutGaps });
    useAutoSave(KEYS.weeklyModule(sunKey, "recovery"), { sleepQuality: recSleepQuality, soreness: recSoreness, practices: recPractices, bodyNote: recBodyNote });
    useAutoSave(KEYS.weeklyModule(sunKey, "sunlight"), { daysOutside: sunDaysOutside, timeOutside: sunTimeOutside, natureMoment: sunNatureMoment });
    useAutoSave(KEYS.weeklyModule(sunKey, "giving"), { didIt: giveDidIt, how: giveHow, moment: giveMoment });
    useAutoSave(KEYS.weeklyModule(sunKey, "home"), { spaceFeel: homeSpaceFeel, maintenance: homeMaintenance, needsAttention: homeNeedsAttention, improvement: homeImprovement });
    useAutoSave(KEYS.weeklyModule(sunKey, "work"), { energy: workEnergy, mode: workMode, blocker: workBlocker, win: workWin });
    useAutoSave(KEYS.weeklyModule(sunKey, "screen"), { screenTime, focusQuality: screenFocusQuality, sinks: screenSinks, deepWork: screenDeepWork });
    useAutoSave(KEYS.weeklyModule(sunKey, "ideas"), { hadIdea: ideasHadIdea, source: ideasSource, text: ideasText, shift: ideasShift });
    useAutoSave(KEYS.weeklyModule(sunKey, "creative"), { created: createdSomething, type: creativeType, satisfaction: creativeSatisfaction, note: creativeNote });

    const go = async () => {
      setBusy(true);
      await DB.set(KEYS.weekReview(sunKey), {
        ...reviewData,
        savedAt: new Date().toISOString()
      });
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
        faithNote: faithNote.slice(0, 200),
        savedAt: new Date().toISOString()
      };
      const allS = (await DB.get(KEYS.allSundays())) || [];
      const filtered = allS.filter(s => s.date !== sunKey);
      const updatedAllS = [summary, ...filtered].slice(0, 104);
      await DB.set(KEYS.allSundays(), updatedAllS);
      await DB.set(KEYS.sundayIndex() + ":" + sunKey, summary);
      setBusy(false);
      setOk(true);
    };
    const addMilestone = async (childId) => {
      const text = (newMilestoneMap[childId] || "").trim();
      if (!text) return;
      const entry = { text, date: getToday(), timestamp: new Date().toISOString() };
      const existing = childMilestonesMap[childId] || [];
      const updated = [entry, ...existing];
      setChildMilestonesMap(prev => ({ ...prev, [childId]: updated }));
      setNewMilestoneMap(prev => ({ ...prev, [childId]: "" }));
      setAddingMsFor(null);
      await DB.set(KEYS.childMilestones(childId), updated);
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
    const wins = el.filter(d => d.evening?.win).map(d => ({ date: d.date, w: d.evening.win }));
    const grats = ml.filter(d => d.morning?.gratitude).map(d => ({ date: d.date, g: d.morning.gratitude }));
    const familyMs = el.filter(d => d.evening?.familyMoment).map(d => ({ date: d.date, m: d.evening.familyMoment }));
    const exDays = wk.filter(d => d.morning?.exceptionalDay || d.evening?.exceptionalDay).length;
    const overdueChores = choreTasks ? choreTasks.filter(t => {
      const nd = addDays(t.last, t.freq);
      return daysBetween(getToday(), nd) < 0;
    }).length : 0;
    const weekChoresDone = el.filter(d => d.evening?.choresDone).length;
    const sleepData = ml.filter(d => d.morning?.wakeTime && d.evening?.bedtime && d.morning?.energy);
    const sleepCorr = sleepData.map(d => {
      const b = d.evening?.bedtime, w = d.morning.wakeTime;
      if (!b || !w) return null;
      const [bh, bm] = b.split(":").map(Number);
      const [wh, wm] = w.split(":").map(Number);
      let mins = wh * 60 + wm - (bh * 60 + bm);
      if (mins < 0) mins += 1440;
      return { h: parseFloat((mins / 60).toFixed(1)), en: d.morning.energy, date: d.date };
    }).filter(Boolean);
    const shortSleep = sleepCorr.filter(s => s.h < 6), longSleep = sleepCorr.filter(s => s.h >= 6);
    const avgEnShort = shortSleep.length ? (shortSleep.reduce((a, s) => a + s.en, 0) / shortSleep.length).toFixed(1) : null;
    const avgEnLong = longSleep.length ? (longSleep.reduce((a, s) => a + s.en, 0) / longSleep.length).toFixed(1) : null;
    const ttStyle = { background: "#111520", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, fontSize: 12 };
    const toggleSundayOpt = async key => {
      const updated = { ...sundayOpts, [key]: !sundayOpts[key] };
      setSundayOpts(updated);
      await DB.set(KEYS.sundayOptions(), updated);
    };
    const monday = getMondayOfWeek(getToday());
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
    const dayLogMap = {};
    wk.forEach(d => { dayLogMap[d.date] = d; });
    const wtChart = weekDates.map(date => ({ d: fmtShort(date), wt: dayLogMap[date]?.morning?.weight > 0 ? dayLogMap[date].morning.weight : null }));
    const woChart = weekDates.map(date => {
      const d = dayLogMap[date];
      return { d: fmtShort(date), M: (d?.morning?.mobilityCount || 0) > 0 ? 1 : 0, C: d?.evening?.cardio ? 1 : 0, S: d?.evening?.strength ? 1 : 0 };
    });
    const snChart = weekDates.map(date => ({ d: fmtShort(date), sn: dayLogMap[date]?.evening?.snack ?? null }));
    const moodChart = weekDates.map(date => {
      const d = dayLogMap[date];
      return { d: fmtShort(date), mood: d?.morning?.mood > 0 ? d.morning.mood : null, energy: d?.morning?.energy > 0 ? d.morning.energy : null };
    });
    const SC = ({ lbl, val, sub, c = "#f4a823" }) => React.createElement("div", {
      style: { background: "var(--card-bg-3)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, padding: "11px 12px", flex: "1 1 76px" }
    }, React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 9, textTransform: "uppercase", letterSpacing: ".07em", margin: "0 0 2px" } }, lbl),
      React.createElement("p", { style: { color: c, fontSize: 20, fontWeight: 800, margin: "0 0 1px", fontFamily: "'Syne',sans-serif" } }, val ?? "-"),
      sub && React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 9, margin: 0 } }, sub));

    // Helper components defined in function scope
    const ChipSelect = ({ options, selected, onToggle, col = "#60a5fa" }) =>
      React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
        options.map(([val, label]) =>
          React.createElement("button", {
            key: val,
            onClick: () => onToggle(val),
            style: { padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700,
              background: selected.includes(val) ? col + "33" : "rgba(255,255,255,.05)",
              color: selected.includes(val) ? col : "#374151" }
          }, (selected.includes(val) ? "✓ " : "") + label)
        )
      );
    const toggleArr = (arr, val) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
    const Stepper = ({ val, set, min = 0, max = 14, label = "" }) =>
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
        React.createElement("button", { onClick: () => set(Math.max(min, val - 1)), style: { width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "var(--text-secondary)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } }, "\u2212"),
        React.createElement("span", { style: { color: "#d1d5db", fontSize: 18, fontWeight: 800, minWidth: 32, textAlign: "center", fontFamily: "'Syne',sans-serif" } }, val),
        React.createElement("button", { onClick: () => set(Math.min(max, val + 1)), style: { width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "var(--text-secondary)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } }, "+"),
        label && React.createElement("span", { style: { color: "var(--text-muted)", fontSize: 11 } }, label)
      );
    const FieldLabel = ({ t }) => React.createElement("p", { style: { color: "#6b7280", fontSize: 9, textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 6px" } }, t);
    const YesNo = ({ val, set, yesLabel = "Yes", noLabel = "No" }) =>
      React.createElement("div", { style: { display: "flex", gap: 8 } },
        React.createElement("button", { onClick: () => set(true), style: { flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: val === true ? "rgba(74,222,128,.2)" : "rgba(255,255,255,.05)", color: val === true ? "#4ade80" : "#374151" } }, yesLabel),
        React.createElement("button", { onClick: () => set(false), style: { flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: val === false ? "rgba(239,68,68,.15)" : "rgba(255,255,255,.05)", color: val === false ? "#ef4444" : "#374151" } }, noLabel)
      );

    return React.createElement("div", null,
      React.createElement("div", {
        style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }
      },
        React.createElement("div", null,
          React.createElement(SectionHead, { label: "Sunday Review", color: "#4ade80" }),
          React.createElement("p", { style: { color: "#404755", fontSize: 12, margin: "0 0 0 13px" } }, wk.length, " days logged this week")
        ),
        React.createElement("div", {
          style: { display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,.09)" }
        },
          React.createElement("button", {
            onClick: () => setView("review"),
            style: { padding: "6px 11px", border: "none", background: view === "review" ? "rgba(74,222,128,.15)" : "transparent", color: view === "review" ? "#4ade80" : "var(--text-secondary)", fontWeight: view === "review" ? 700 : 400, fontSize: 11, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
          }, "WEEK"),
          React.createElement("button", {
            onClick: () => setView("history"),
            style: { padding: "6px 11px", border: "none", background: view === "history" ? "rgba(96,165,250,.15)" : "transparent", color: view === "history" ? "#60a5fa" : "var(--text-secondary)", fontWeight: view === "history" ? 700 : 400, fontSize: 11, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
          }, "HISTORY")
        )
      ),
      view === "history" && React.createElement("div", null,
        React.createElement(HistoryStrip, {
          selectedDate: histDate,
          onSelectDate: d => { setHistDate(d); setHistLog(null); DB.get(KEYS.log(d)).then(l => setHistLog(l || null)); },
          allLogs: allLogsArr,
          accentColor: "#f4a823"
        }),
        React.createElement("p", { style: { color: "#f4a823", fontSize: 12, fontWeight: 700, margin: "0 0 12px" } }, fmtMid(histDate), " \u2014 Morning"),
        React.createElement(MorningReadOnly, { log: histLog, date: histDate }),
        React.createElement("p", { style: { color: "#60a5fa", fontSize: 12, fontWeight: 700, margin: "20px 0 12px" } }, fmtMid(histDate), " \u2014 Evening"),
        React.createElement(EveningReadOnly, { log: histLog, date: histDate })
      ),
      view === "review" && React.createElement(React.Fragment, null,
        React.createElement(SundayBrief, { wk, pillarScores: ps, weekWin: ww, weekNote: wn, settings, allSundays }),
        React.createElement("div", {
          style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }
        },
          React.createElement(Lbl, { c: "At a Glance" }),
          React.createElement("div", { style: { display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" } },
            [[...getChildren(settings).length > 0 ? [["showChildren", "👶 Kids"]] : [],
              ["showFaith", "💜 Faith"],
              ["showReading", "📚 Reading"],
              ["showWorkout", "🏋️ Training"],
              ["showMentalHealth", "🧠 Mind"],
              ["showHabits", "🌱 Habits"],
              ["showRelationships", "🤝 Relations"],
              ["showNutrition", "🧾 Nutrition"],
              ["showRecovery", "🌿 Recovery"],
              ["showSunlight", "☀️ Sunlight"],
              ["showGiving", "🫶 Giving"],
              ["showHomeEnv", "🏠 Home Vibe"],
              ["showWork", "💼 Work"],
              ["showScreen", "📱 Focus"],
              ["showIdeas", "💡 Ideas"],
              ["showCreative", "🎨 Create"]
            ]].flat().map(([key, label]) =>
              React.createElement("button", {
                key,
                onClick: () => toggleSundayOpt(key),
                style: { padding: "3px 9px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, background: sundayOpts[key] ? "rgba(167,139,250,.18)" : "rgba(255,255,255,.05)", color: sundayOpts[key] ? "#a78bfa" : "#374151" }
              }, label + (sundayOpts[key] ? " ●" : " ○"))
            )
          )
        ),
        React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 } },
          React.createElement(SC, { lbl: "Avg Weight", val: avgWt, sub: "lbs", c: "#f4a823" }),
          React.createElement(SC, { lbl: "Mobility", val: `${mobS}/7`, sub: `${mobM} moves`, c: "#fb923c" }),
          React.createElement(SC, { lbl: "Snack-Free", val: snFree, sub: "evenings", c: "#60a5fa" }),
          React.createElement(SC, { lbl: "Day Rating", val: avgDr, sub: "avg /5", c: "#a78bfa" })
        ),
        React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 } },
          React.createElement(SC, { lbl: "Cardio", val: `${ca}/7`, c: "#60a5fa" }),
          React.createElement(SC, { lbl: "Strength", val: `${st}/7`, c: "#4ade80" }),
          React.createElement(SC, { lbl: "Hydration", val: `${hyC}/7`, c: "#34d399" }),
          React.createElement(SC, { lbl: "Finance Wins", val: fwC, c: "#34d399" })
        ),
        React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 } },
          avgEn && React.createElement(SC, { lbl: "Avg Energy", val: avgEn, sub: "/5 morning", c: "#60a5fa" }),
          avgMood && React.createElement(SC, { lbl: "Avg Mood", val: avgMood, sub: "/5 morning", c: "#f472b6" }),
          avgSteps && React.createElement(SC, { lbl: "Avg Steps", val: parseInt(avgSteps).toLocaleString(), c: "#4ade80" }),
          exDays > 0 && React.createElement(SC, { lbl: "Exceptional", val: exDays, sub: "days flagged", c: "#a78bfa" })
        ),
        wtV.length >= 2 && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Weight Trend" }),
            React.createElement("div", { style: { height: 110 } },
              React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
                React.createElement(LineChart, { data: wtChart },
                  React.createElement(XAxis, { dataKey: "d", tick: { fill: "var(--text-secondary)", fontSize: 10 }, axisLine: false, tickLine: false }),
                  React.createElement(YAxis, { domain: ["auto", "auto"], tick: { fill: "var(--text-secondary)", fontSize: 10 }, axisLine: false, tickLine: false, width: 34 }),
                  React.createElement(Tooltip, { contentStyle: ttStyle, labelStyle: { color: "#9ca3af" }, itemStyle: { color: "#f4a823" } }),
                  React.createElement(Line, { type: "monotone", dataKey: "wt", stroke: "#f4a823", strokeWidth: 2, dot: { fill: "#f4a823", r: 2 }, name: "Weight" })
                )
              )
            )
          ),
          s: { marginBottom: 12 }
        }),
        (ca + st + mobS) > 0 && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Daily Workouts" }),
            React.createElement("div", { style: { height: 100 } },
              React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
                React.createElement(BarChart, { data: woChart, barGap: 2, barSize: 8 },
                  React.createElement(XAxis, { dataKey: "d", tick: { fill: "var(--text-secondary)", fontSize: 10 }, axisLine: false, tickLine: false }),
                  React.createElement(Tooltip, { contentStyle: ttStyle, labelStyle: { color: "#9ca3af" } }),
                  React.createElement(Bar, { dataKey: "M", fill: "#fb923c", radius: [3, 3, 0, 0], name: "Mobility" }),
                  React.createElement(Bar, { dataKey: "C", fill: "#60a5fa", radius: [3, 3, 0, 0], name: "Cardio" }),
                  React.createElement(Bar, { dataKey: "S", fill: "#4ade80", radius: [3, 3, 0, 0], name: "Strength" })
                )
              )
            ),
            React.createElement("div", { style: { display: "flex", gap: 12, marginTop: 6 } },
              [["Mobility", "#fb923c"], ["Cardio", "#60a5fa"], ["Strength", "#4ade80"]].map(([l, c]) =>
                React.createElement("div", { key: l, style: { display: "flex", alignItems: "center", gap: 4 } },
                  React.createElement("div", { style: { width: 7, height: 7, borderRadius: 2, background: c } }),
                  React.createElement("span", { style: { color: "var(--text-secondary)", fontSize: 10 } }, l)
                )
              )
            )
          ),
          s: { marginBottom: 12 }
        }),
        el.length > 0 && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Snacking Level (0=none \xB7 3=heavy)" }),
            React.createElement("div", { style: { height: 90 } },
              React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
                React.createElement(BarChart, { data: snChart, barSize: 16 },
                  React.createElement(XAxis, { dataKey: "d", tick: { fill: "var(--text-secondary)", fontSize: 10 }, axisLine: false, tickLine: false }),
                  React.createElement(YAxis, { domain: [0, 3], ticks: [0, 1, 2, 3], tick: { fill: "var(--text-secondary)", fontSize: 9 }, axisLine: false, tickLine: false, width: 16 }),
                  React.createElement(Tooltip, { contentStyle: ttStyle, labelStyle: { color: "#9ca3af" }, itemStyle: { color: "#fb923c" } }),
                  React.createElement(Bar, { dataKey: "sn", fill: "#fb923c", radius: [3, 3, 0, 0], name: "Snacking" })
                )
              )
            )
          ),
          s: { marginBottom: 12 }
        }),
        ml.length > 0 && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Energy vs Mood" }),
            React.createElement("div", { style: { height: 100 } },
              React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
                React.createElement(LineChart, { data: moodChart },
                  React.createElement(XAxis, { dataKey: "d", tick: { fill: "var(--text-secondary)", fontSize: 10 }, axisLine: false, tickLine: false }),
                  React.createElement(YAxis, { domain: [0, 5], ticks: [1, 2, 3, 4, 5], tick: { fill: "var(--text-secondary)", fontSize: 9 }, axisLine: false, tickLine: false, width: 16 }),
                  React.createElement(Tooltip, { contentStyle: ttStyle, labelStyle: { color: "#9ca3af" } }),
                  React.createElement(Line, { type: "monotone", dataKey: "energy", stroke: "#60a5fa", strokeWidth: 2, dot: { fill: "#60a5fa", r: 2 }, name: "Energy" }),
                  React.createElement(Line, { type: "monotone", dataKey: "mood", stroke: "#f472b6", strokeWidth: 2, dot: { fill: "#f472b6", r: 2 }, name: "Mood", strokeDasharray: "4 2" })
                )
              )
            ),
            React.createElement("div", { style: { display: "flex", gap: 12, marginTop: 5 } },
              [["Energy", "#60a5fa"], ["Mood", "#f472b6"]].map(([l, c]) =>
                React.createElement("div", { key: l, style: { display: "flex", alignItems: "center", gap: 4 } },
                  React.createElement("div", { style: { width: 7, height: 7, borderRadius: 2, background: c } }),
                  React.createElement("span", { style: { color: "var(--text-secondary)", fontSize: 10 } }, l)
                )
              )
            )
          ),
          s: { marginBottom: 12 }
        }),
        sleepCorr.length >= 3 && avgEnShort && avgEnLong && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Sleep Insights" }),
            React.createElement("p", {
              style: { color: "var(--text-secondary)", fontSize: 12, margin: 0, lineHeight: 1.6 }
            }, "Based on this week's data: on nights you slept under 6 hours your next-day energy averaged ",
              React.createElement("span", { style: { color: "#ef4444", fontWeight: 700 } }, avgEnShort, "/5"),
              ". On nights with 6+ hours it averaged ",
              React.createElement("span", { style: { color: "#4ade80", fontWeight: 700 } }, avgEnLong, "/5"),
              ". ", parseFloat(avgEnLong) - parseFloat(avgEnShort) >= 1 ? `That's a meaningful difference — ${parseFloat(avgEnLong) - parseFloat(avgEnShort)} points.` : "The pattern is emerging.")
          ),
          s: { marginBottom: 12 }
        }),
        choreTasks && choreTasks.length > 0 && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Home Summary" }),
            React.createElement("div", { style: { display: "flex", gap: 0 } },
              React.createElement(StatCell, { lbl: "Overdue", val: overdueChores, c: overdueChores > 0 ? "#ef4444" : "#4ade80" }),
              React.createElement(StatCell, { lbl: "Done This Week", val: weekChoresDone, c: "#4ade80" }),
              React.createElement(StatCell, { lbl: "Total Tasks", val: choreTasks.length, c: "var(--text-secondary)" })
            )
          ),
          s: { marginBottom: 12 }
        }),
        familyMs.length > 0 && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Family Moments This Week" }),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 7 } },
              familyMs.map(({ date, m }, i) =>
                React.createElement("div", { key: i, style: { display: "flex", gap: 10 } },
                  React.createElement("span", { style: { color: "#f4a823", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 } }, fmtShort(date)),
                  React.createElement("span", { style: { color: "#c9ccd4", fontSize: 12 } }, m)
                )
              )
            )
          ),
          s: { marginBottom: 12 }
        }),
        grats.length > 0 && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Gratitude This Week" }),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 7 } },
              grats.map(({ date, g }, i) =>
                React.createElement("div", { key: i, style: { display: "flex", gap: 10 } },
                  React.createElement("span", { style: { color: "#a78bfa", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 } }, fmtShort(date)),
                  React.createElement("span", { style: { color: "#c9ccd4", fontSize: 12, fontStyle: "italic" } }, g)
                )
              )
            )
          ),
          s: { marginBottom: 12 }
        }),
        wins.length > 0 && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Wins This Week" }),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 7 } },
              wins.map(({ date, w }, i) =>
                React.createElement("div", { key: i, style: { display: "flex", gap: 10, alignItems: "flex-start" } },
                  React.createElement("span", { style: { color: "#f4a823", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 } }, fmtShort(date)),
                  React.createElement("span", { style: { color: "#c9ccd4", fontSize: 12 } }, w)
                )
              )
            )
          ),
          s: { marginBottom: 12 }
        }),
        React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "7 Pillars \u2014 Weekly Self-Assessment" }),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
              PILLARS.map(p =>
                React.createElement("div", { key: p.id, style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
                  React.createElement("span", { style: { color: "#9ca3af", fontSize: 12, width: 148, flexShrink: 0 } }, p.l),
                  React.createElement(Dots, { val: ps[p.id] || 0, set: v => setPs(prev => ({ ...prev, [p.id]: v })), col: p.c, sz: 22 })
                )
              )
            )
          ),
          s: { marginBottom: 12 }
        }),
        sundayOpts.showFaith && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Faith" }),
            React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "0 0 10px", lineHeight: 1.5 } }, "Not performative \u2014 just yours."),
            React.createElement("input", { type: "text", value: faithScripture, onChange: e => setFaithScripture(e.target.value), placeholder: "A scripture or verse that stayed with you...", style: { ...inp, marginBottom: 8, fontSize: 13 } }),
            React.createElement("input", { type: "text", value: faithMoment, onChange: e => setFaithMoment(e.target.value), placeholder: "A moment this week where you felt it...", style: { ...inp, marginBottom: 8, fontSize: 13 } }),
            React.createElement("textarea", { value: faithNote, onChange: e => setFaithNote(e.target.value), placeholder: "Anything else on your heart this week...", style: { ...inp, resize: "none", minHeight: 60, fontSize: 13, lineHeight: 1.6 }, rows: 2 })
          ),
          s: { marginBottom: 12 }
        }),
        sundayOpts.showReading && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Reading This Week" }),
            React.createElement("input", { type: "text", value: bookTitle, onChange: e => setBookTitle(e.target.value), placeholder: "Book title...", style: { ...inp, marginBottom: 8, fontSize: 13 } }),
            React.createElement("input", { type: "number", value: pagesRead, onChange: e => setPagesRead(e.target.value), placeholder: "Pages read this week", style: { ...inp, marginBottom: 8, fontSize: 13, width: 200 } }),
            React.createElement("div", { style: { position: "relative" } },
              React.createElement("textarea", { value: reflection, onChange: e => setReflection(e.target.value), placeholder: "What stuck with you? What are you thinking about?", style: { ...inp, resize: "none", minHeight: 80, fontSize: 13, lineHeight: 1.6, paddingRight: 50 }, rows: 3 }),
              React.createElement("button", {
                onClick: startVoice,
                style: { position: "absolute", top: 8, right: 8, width: 34, height: 34, background: listening ? "rgba(239,68,68,.2)" : "rgba(167,139,250,.15)", border: `1px solid ${listening ? "rgba(239,68,68,.4)" : "rgba(167,139,250,.3)"}`, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }
              }, listening ? "🔴" : "🎙")
            ),
            React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: "5px 0 0" } }, "\uD83C\uDF99 tap mic to dictate \xB7 appends to existing text")
          ),
          s: { marginBottom: 12 }
        }),
        sundayOpts.showWorkout && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
              React.createElement(Lbl, { c: "Training Notes" }),
              React.createElement("div", { style: { display: "flex", gap: 10 } },
                React.createElement("span", { style: { color: "#fb923c", fontSize: 11, fontWeight: 700 } }, ca + "/" + wk.length + " cardio"),
                React.createElement("span", { style: { color: "#4ade80", fontSize: 11, fontWeight: 700 } }, st + "/" + wk.length + " strength")
              )
            ),
            React.createElement("div", { style: { marginBottom: 12 } },
              React.createElement("p", { style: { color: "#6b7280", fontSize: 9, textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 6px" } }, "Training Quality This Week"),
              React.createElement(Dots, { val: woTrainingQuality, set: setWoTrainingQuality, col: "#fb923c", sz: 22 })
            ),
            React.createElement("p", { style: { color: "#6b7280", fontSize: 9, textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 4px" } }, "Best Session / Highlight"),
            React.createElement("input", { type: "text", value: woBestSession, onChange: e => setWoBestSession(e.target.value), placeholder: "e.g. 5km run PR, hit 225lb squat, full mobility flow...", style: { ...inp, marginBottom: 10, fontSize: 13 } }),
            React.createElement("p", { style: { color: "#6b7280", fontSize: 9, textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 4px" } }, "How Did Your Body Feel? (soreness, energy, recovery)"),
            React.createElement("textarea", { value: woBodyFeel, onChange: e => setWoBodyFeel(e.target.value), placeholder: "e.g. Left knee tight Monday, energy was high by Wednesday, sleeping well...", style: { ...inp, resize: "none", minHeight: 60, fontSize: 13, lineHeight: 1.6, marginBottom: 10 }, rows: 2 }),
            React.createElement("p", { style: { color: "#6b7280", fontSize: 9, textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 4px" } }, "What Held Training Back? (skip if nothing)"),
            React.createElement("input", { type: "text", value: woBlocked, onChange: e => setWoBlocked(e.target.value), placeholder: "e.g. Time, motivation dip, travel, minor injury...", style: { ...inp, marginBottom: 10, fontSize: 13 } }),
            React.createElement("p", { style: { color: "#6b7280", fontSize: 9, textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 4px" } }, "Next Week's Training Focus"),
            React.createElement("input", { type: "text", value: woNextFocus, onChange: e => setWoNextFocus(e.target.value), placeholder: "e.g. Prioritise strength, hit 4 sessions, fix sleep first...", style: { ...inp, fontSize: 13 } })
          ),
          s: { marginBottom: 12 }
        }),
        sundayOpts.showMentalHealth && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
              React.createElement(Lbl, { c: "Mental Health Check-in" }),
              React.createElement("span", { style: { padding: "3px 10px", background: "rgba(167,139,250,.12)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 20, color: "#a78bfa", fontSize: 10, fontWeight: 700 } }, "COMING SOON")
            ),
            React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 12, margin: 0, lineHeight: 1.6 } }, "Planned: Anxiety level, emotional regulation, social connection scores, practices done (therapy/journaling/meditation), what helped most, what was hardest. Building after Relationship + Recovery modules are stable.")
          ),
          s: { marginBottom: 12, opacity: 0.6 }
        }),
        sundayOpts.showHabits && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Habit Tracker Summary" }),
            habitGoals.length === 0
              ? React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 12, margin: 0 } }, "No active habit goals yet. Add some in the Goals tab to track them here.")
              : React.createElement(React.Fragment, null,
                  React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 } },
                    habitGoals.map(g => {
                      const log = habitLogsWeek[g.id] || {};
                      const monday2 = getMondayOfWeek(getToday());
                      const weekDates2 = Array.from({ length: 7 }, (_, i) => addDays(monday2, i));
                      const done = weekDates2.filter(d => log[d]).length;
                      const pct = Math.round(done / 7 * 100);
                      const barCol = pct >= 80 ? "#4ade80" : pct >= 50 ? "#f4a823" : "#ef4444";
                      return React.createElement("div", { key: g.id, style: { padding: "10px 12px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10 } },
                        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } },
                          React.createElement("p", { style: { color: "#c9ccd4", fontSize: 13, fontWeight: 600, margin: 0 } }, g.label),
                          React.createElement("p", { style: { color: barCol, fontSize: 12, fontWeight: 800, margin: 0, fontFamily: "'Syne',sans-serif" } }, done + "/7 days")
                        ),
                        React.createElement("div", { style: { display: "flex", gap: 3 } },
                          weekDates2.map((d, i) =>
                            React.createElement("div", { key: i, title: d, style: { flex: 1, height: 6, borderRadius: 3, background: log[d] ? barCol : "rgba(255,255,255,.06)" } })
                          )
                        ),
                        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 3 } },
                          React.createElement("span", { style: { color: "#374151", fontSize: 9 } }, "Mon"),
                          React.createElement("span", { style: { color: "#374151", fontSize: 9 } }, "Sun")
                        )
                      );
                    })
                  ),
                  React.createElement("div", { style: { marginBottom: 12 } },
                    React.createElement("p", { style: { color: "#6b7280", fontSize: 9, textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 6px" } }, "Overall Habit Consistency Feeling"),
                    React.createElement(Dots, { val: habitConsistency, set: setHabitConsistency, col: "#4ade80", sz: 22 })
                  ),
                  React.createElement("p", { style: { color: "#6b7280", fontSize: 9, textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 4px" } }, "Hardest Habit to Keep This Week"),
                  React.createElement("input", { type: "text", value: habitHardest, onChange: e => setHabitHardest(e.target.value), placeholder: "Which habit broke down and why?", style: { ...inp, marginBottom: 10, fontSize: 13 } }),
                  React.createElement("p", { style: { color: "#6b7280", fontSize: 9, textTransform: "uppercase", letterSpacing: ".06em", margin: "0 0 4px" } }, "One Habit Adjustment for Next Week"),
                  React.createElement("input", { type: "text", value: habitAdjust, onChange: e => setHabitAdjust(e.target.value), placeholder: "e.g. Move meditation to morning, reduce target to 5/7...", style: { ...inp, fontSize: 13 } })
                )
          ),
          s: { marginBottom: 12 }
        }),
        // ── 10 NEW WEEKLY MODULES ──
        sundayOpts.showRelationships && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Relationships" }),
            React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "0 0 14px", lineHeight: 1.5 } }, "How connected did you feel to the people that matter?"),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 } },
              [["Partner", relPartner, setRelPartner, "#f472b6"], ["Family", relFamily, setRelFamily, "#f4a823"], ["Friends", relFriends, setRelFriends, "#60a5fa"]].map(([lbl, val, set, col]) =>
                React.createElement("div", { key: lbl, style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                  React.createElement("p", { style: { color: "#9ca3af", fontSize: 12, margin: 0, width: 70 } }, lbl),
                  React.createElement(Dots, { val, set, col, sz: 22 })
                )
              )
            ),
            FieldLabel({ t: "Had a meaningful conversation this week?" }),
            React.createElement("div", { style: { marginBottom: 12 } }, React.createElement(YesNo, { val: relDeepConvo, set: setRelDeepConvo })),
            FieldLabel({ t: "One moment worth keeping (optional)" }),
            React.createElement("input", { type: "text", value: relMoment, onChange: e => setRelMoment(e.target.value), placeholder: "e.g. Long talk with Sabrina about the future...", style: { ...inp, fontSize: 13 } })
          ),
          s: { marginBottom: 12 }
        }),
        sundayOpts.showNutrition && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Nutrition Quality" }),
            React.createElement("div", { style: { marginBottom: 12 } },
              FieldLabel({ t: "Overall food quality this week" }),
              React.createElement(Dots, { val: nutQuality, set: setNutQuality, col: "#4ade80", sz: 22 })
            ),
            React.createElement("div", { style: { display: "flex", gap: 14, marginBottom: 12, alignItems: "flex-end" } },
              React.createElement("div", null,
                FieldLabel({ t: "Home-cooked meals" }),
                React.createElement(Stepper, { val: nutHomeMeals, set: setNutHomeMeals, min: 0, max: 21, label: "/ week" })
              ),
              React.createElement("div", { style: { flex: 1 } },
                FieldLabel({ t: "Meal prep done?" }),
                React.createElement(YesNo, { val: nutMealPrep, set: setNutMealPrep })
              )
            ),
            FieldLabel({ t: "Gaps this week (select all that apply)" }),
            React.createElement(ChipSelect, {
              options: [["protein", "Protein"], ["veg", "Vegetables"], ["hydration", "Hydration"], ["alcohol", "Alcohol"], ["snacking", "Late snacking"], ["processed", "Processed food"]],
              selected: nutGaps, onToggle: v => setNutGaps(prev => toggleArr(prev, v)), col: "#fb923c"
            })
          ),
          s: { marginBottom: 12 }
        }),
        sundayOpts.showRecovery && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Recovery & Body" }),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 } },
              [["Sleep Quality (not hours)", recSleepQuality, setRecSleepQuality, "#a78bfa", "1 = poor · 5 = deep & restorative"], ["Body Soreness", recSoreness, setRecSoreness, "#fb923c", "1 = fresh · 5 = beat up"]].map(([lbl, val, set, col, hint]) =>
                React.createElement("div", { key: lbl },
                  React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 } },
                    React.createElement("p", { style: { color: "#9ca3af", fontSize: 12, margin: 0 } }, lbl),
                    React.createElement("p", { style: { color: "#4b5563", fontSize: 10, margin: 0 } }, hint)
                  ),
                  React.createElement(Dots, { val, set, col, sz: 22 })
                )
              )
            ),
            FieldLabel({ t: "Recovery practices done" }),
            React.createElement("div", { style: { marginBottom: 12 } },
              React.createElement(ChipSelect, {
                options: [["stretch", "Stretching"], ["walk", "Walk"], ["sauna", "Sauna"], ["sleep", "Extra sleep"], ["massage", "Massage"], ["ice", "Ice bath"]],
                selected: recPractices, onToggle: v => setRecPractices(prev => toggleArr(prev, v)), col: "#4ade80"
              })
            ),
            FieldLabel({ t: "One body signal to note (optional)" }),
            React.createElement("input", { type: "text", value: recBodyNote, onChange: e => setRecBodyNote(e.target.value), placeholder: "e.g. Left knee tight, back feeling strong...", style: { ...inp, fontSize: 13 } })
          ),
          s: { marginBottom: 12 }
        }),
        sundayOpts.showSunlight && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Sunlight & Nature" }),
            React.createElement("div", { style: { display: "flex", gap: 20, marginBottom: 12, alignItems: "flex-end" } },
              React.createElement("div", null,
                FieldLabel({ t: "Days spent outside" }),
                React.createElement(Stepper, { val: sunDaysOutside, set: setSunDaysOutside, min: 0, max: 7, label: "/ 7" })
              ),
              React.createElement("div", { style: { flex: 1 } },
                FieldLabel({ t: "Avg time outside / day" }),
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4 } },
                  [["<15min", "< 15 min"], ["15-30min", "15\u201330 min"], ["30-60min", "30\u201360 min"], ["1h+", "1h+"]].map(([val, label]) =>
                    React.createElement("button", {
                      key: val, onClick: () => setSunTimeOutside(val),
                      style: { padding: "6px 10px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, textAlign: "left",
                        background: sunTimeOutside === val ? "rgba(244,168,35,.2)" : "rgba(255,255,255,.05)",
                        color: sunTimeOutside === val ? "#f4a823" : "#374151" }
                    }, label)
                  )
                )
              )
            ),
            FieldLabel({ t: "A nature moment this week (optional)" }),
            React.createElement("input", { type: "text", value: sunNatureMoment, onChange: e => setSunNatureMoment(e.target.value), placeholder: "e.g. Evening walk by the water, sat outside with coffee...", style: { ...inp, fontSize: 13 } })
          ),
          s: { marginBottom: 12 }
        }),
        sundayOpts.showGiving && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Acts of Giving" }),
            React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "0 0 12px", lineHeight: 1.5 } }, "Generosity tracked \u2014 so it doesn't die quietly."),
            FieldLabel({ t: "Did you give back or help someone this week?" }),
            React.createElement("div", { style: { marginBottom: 12 } }, React.createElement(YesNo, { val: giveDidIt, set: setGiveDidIt, yesLabel: "Yes \u2713", noLabel: "Not this week" })),
            giveDidIt && React.createElement(React.Fragment, null,
              FieldLabel({ t: "How?" }),
              React.createElement("div", { style: { marginBottom: 12 } },
                React.createElement(ChipSelect, {
                  options: [["friend", "Helped a friend"], ["donated", "Donated"], ["volunteer", "Volunteered"], ["encouraged", "Encouraged someone"], ["checked-in", "Checked in on family"]],
                  selected: giveHow, onToggle: v => setGiveHow(prev => toggleArr(prev, v)), col: "#4ade80"
                })
              ),
              FieldLabel({ t: "One moment (optional)" }),
              React.createElement("input", { type: "text", value: giveMoment, onChange: e => setGiveMoment(e.target.value), placeholder: "e.g. Helped Marcus with his resume...", style: { ...inp, fontSize: 13 } })
            )
          ),
          s: { marginBottom: 12 }
        }),
        sundayOpts.showHomeEnv && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Home Environment" }),
            React.createElement("div", { style: { marginBottom: 12 } },
              FieldLabel({ t: "How did the space feel this week?" }),
              React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 } },
                React.createElement("span", { style: { color: "#4b5563", fontSize: 10 } }, "Chaotic"),
                React.createElement("span", { style: { color: "#4b5563", fontSize: 10 } }, "Calm & Organised")
              ),
              React.createElement(Dots, { val: homeSpaceFeel, set: setHomeSpaceFeel, col: "#34d399", sz: 22 })
            ),
            FieldLabel({ t: "Maintenance done" }),
            React.createElement("div", { style: { marginBottom: 12 } },
              React.createElement(ChipSelect, {
                options: [["cleaning", "Cleaning"], ["laundry", "Laundry"], ["groceries", "Groceries"], ["organising", "Organising"], ["repairs", "Repairs"]],
                selected: homeMaintenance, onToggle: v => setHomeMaintenance(prev => toggleArr(prev, v)), col: "#34d399"
              })
            ),
            FieldLabel({ t: "Area needing most attention" }),
            React.createElement("div", { style: { marginBottom: 12 } },
              React.createElement(ChipSelect, {
                options: [["kitchen", "Kitchen"], ["bedroom", "Bedroom"], ["living", "Living room"], ["office", "Office"], ["garage", "Garage"], ["car", "Car"]],
                selected: homeNeedsAttention, onToggle: v => setHomeNeedsAttention(prev => toggleArr(prev, v)), col: "#fb923c"
              })
            ),
            FieldLabel({ t: "One improvement made (optional)" }),
            React.createElement("input", { type: "text", value: homeImprovement, onChange: e => setHomeImprovement(e.target.value), placeholder: "e.g. Cleared out the office desk, deep-cleaned kitchen...", style: { ...inp, fontSize: 13 } })
          ),
          s: { marginBottom: 12 }
        }),
        sundayOpts.showWork && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Work & Career" }),
            React.createElement("div", { style: { marginBottom: 12 } },
              FieldLabel({ t: "Work energy this week" }),
              React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 } },
                React.createElement("span", { style: { color: "#4b5563", fontSize: 10 } }, "Drained"),
                React.createElement("span", { style: { color: "#4b5563", fontSize: 10 } }, "Energised")
              ),
              React.createElement(Dots, { val: workEnergy, set: setWorkEnergy, col: "#60a5fa", sz: 22 })
            ),
            FieldLabel({ t: "Work mode this week" }),
            React.createElement("div", { style: { marginBottom: 12 } },
              React.createElement(ChipSelect, {
                options: [["deep", "Deep Work"], ["meetings", "Meetings"], ["creative", "Creative"], ["admin", "Admin"], ["travel", "Travel"]],
                selected: workMode, onToggle: v => setWorkMode(prev => toggleArr(prev, v)), col: "#60a5fa"
              })
            ),
            FieldLabel({ t: "Biggest blocker" }),
            React.createElement("div", { style: { marginBottom: 12 } },
              React.createElement(ChipSelect, {
                options: [["time", "Time"], ["clarity", "Clarity"], ["energy", "Energy"], ["people", "People"], ["tech", "Tech"], ["motivation", "Motivation"]],
                selected: workBlocker, onToggle: v => setWorkBlocker(prev => toggleArr(prev, v)), col: "#ef4444"
              })
            ),
            FieldLabel({ t: "One work win (optional)" }),
            React.createElement("input", { type: "text", value: workWin, onChange: e => setWorkWin(e.target.value), placeholder: "e.g. Shipped the feature, landed the client, finished the proposal...", style: { ...inp, fontSize: 13 } })
          ),
          s: { marginBottom: 12 }
        }),
        sundayOpts.showScreen && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Screen & Focus" }),
            React.createElement("div", { style: { marginBottom: 12 } },
              FieldLabel({ t: "Average daily screen time" }),
              React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
                [["<2h", "< 2h"], ["2-4h", "2\u20134h"], ["4-6h", "4\u20136h"], ["6-8h", "6\u20138h"], ["8h+", "8h+"]].map(([val, label]) =>
                  React.createElement("button", {
                    key: val, onClick: () => setScreenTime(val),
                    style: { padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700,
                      background: screenTime === val ? "rgba(239,68,68,.2)" : "rgba(255,255,255,.05)",
                      color: screenTime === val ? "#ef4444" : "#374151" }
                  }, label)
                )
              )
            ),
            React.createElement("div", { style: { marginBottom: 12 } },
              FieldLabel({ t: "Focus quality this week" }),
              React.createElement(Dots, { val: screenFocusQuality, set: setScreenFocusQuality, col: "#a78bfa", sz: 22 })
            ),
            FieldLabel({ t: "Biggest time sinks" }),
            React.createElement("div", { style: { marginBottom: 12 } },
              React.createElement(ChipSelect, {
                options: [["social", "Social media"], ["youtube", "YouTube"], ["news", "News"], ["gaming", "Gaming"], ["messaging", "Messaging"]],
                selected: screenSinks, onToggle: v => setScreenSinks(prev => toggleArr(prev, v)), col: "#ef4444"
              })
            ),
            FieldLabel({ t: "Deep work sessions" }),
            React.createElement(Stepper, { val: screenDeepWork, set: setScreenDeepWork, min: 0, max: 7, label: "days this week" })
          ),
          s: { marginBottom: 12 }
        }),
        sundayOpts.showIdeas && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Ideas & Insights" }),
            React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "0 0 12px", lineHeight: 1.5 } }, "The second brain, weekly capture."),
            FieldLabel({ t: "Had a new idea worth keeping?" }),
            React.createElement("div", { style: { marginBottom: 12 } }, React.createElement(YesNo, { val: ideasHadIdea, set: setIdeasHadIdea })),
            ideasHadIdea && React.createElement(React.Fragment, null,
              FieldLabel({ t: "Where did it come from?" }),
              React.createElement("div", { style: { marginBottom: 12 } },
                React.createElement(ChipSelect, {
                  options: [["book", "Book"], ["convo", "Conversation"], ["walk", "Walk"], ["work", "Work"], ["podcast", "Podcast"], ["random", "Random"]],
                  selected: ideasSource, onToggle: v => setIdeasSource(prev => toggleArr(prev, v)), col: "#a78bfa"
                })
              ),
              FieldLabel({ t: "One sentence on the idea" }),
              React.createElement("input", { type: "text", value: ideasText, onChange: e => setIdeasText(e.target.value), placeholder: "The idea in one sentence...", style: { ...inp, marginBottom: 10, fontSize: 13 } })
            ),
            FieldLabel({ t: "One perspective shift this week (optional)" }),
            React.createElement("input", { type: "text", value: ideasShift, onChange: e => setIdeasShift(e.target.value), placeholder: "Something that changed how you see things...", style: { ...inp, fontSize: 13 } })
          ),
          s: { marginBottom: 12 }
        }),
        sundayOpts.showCreative && React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Creative Output" }),
            React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "0 0 12px", lineHeight: 1.5 } }, "Creativity dies when it goes untracked."),
            FieldLabel({ t: "Made or created something this week?" }),
            React.createElement("div", { style: { marginBottom: 12 } }, React.createElement(YesNo, { val: createdSomething, set: setCreatedSomething })),
            createdSomething && React.createElement(React.Fragment, null,
              FieldLabel({ t: "What type?" }),
              React.createElement("div", { style: { marginBottom: 12 } },
                React.createElement(ChipSelect, {
                  options: [["cooking", "Cooking"], ["music", "Music"], ["writing", "Writing"], ["art", "Art"], ["diy", "DIY"], ["code", "Code"], ["other", "Other"]],
                  selected: creativeType, onToggle: v => setCreativeType(prev => toggleArr(prev, v)), col: "#f472b6"
                })
              ),
              FieldLabel({ t: "Creative satisfaction" }),
              React.createElement("div", { style: { marginBottom: 12 } },
                React.createElement(Dots, { val: creativeSatisfaction, set: setCreativeSatisfaction, col: "#f472b6", sz: 22 })
              )
            ),
            FieldLabel({ t: "One sentence (optional)" }),
            React.createElement("input", { type: "text", value: creativeNote, onChange: e => setCreativeNote(e.target.value), placeholder: "What you made, how it felt...", style: { ...inp, fontSize: 13 } })
          ),
          s: { marginBottom: 12 }
        }),
        // ── Children ──
        sundayOpts.showChildren && getChildren(settings).map(child =>
          React.createElement(Card, {
            key: child.id,
            ch: React.createElement(React.Fragment, null,
              React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } },
                React.createElement(Lbl, { c: child.name + "'s Milestones" }),
                React.createElement("button", {
                  onClick: () => setAddingMsFor(addingMsFor === child.id ? null : child.id),
                  style: { padding: "4px 10px", background: "rgba(244,114,182,.12)", border: "1px solid rgba(244,114,182,.25)", color: "#f472b6", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer" }
                }, "+ Add")
              ),
              React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 11, margin: "0 0 10px", lineHeight: 1.5 } }, "These moments are permanent \u2014 never overwritten."),
              addingMsFor === child.id && React.createElement("div", { style: { display: "flex", gap: 7, marginBottom: 10 } },
                React.createElement("input", {
                  value: newMilestoneMap[child.id] || "",
                  onChange: e => setNewMilestoneMap(prev => ({ ...prev, [child.id]: e.target.value })),
                  placeholder: "A moment worth keeping forever...",
                  style: { ...inp, flex: 1, fontSize: 13 },
                  onKeyDown: e => e.key === "Enter" && addMilestone(child.id),
                  autoFocus: true
                }),
                React.createElement("button", {
                  onClick: () => addMilestone(child.id),
                  style: { padding: "8px 13px", background: "#f472b6", color: "#080b11", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer", flexShrink: 0 }
                }, "\u2713")
              ),
              (childMilestonesMap[child.id] || []).length > 0
                ? React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
                    (childMilestonesMap[child.id] || []).slice(0, 20).map((m, i) =>
                      React.createElement("div", { key: i, style: { display: "flex", gap: 9, padding: "8px 10px", background: "rgba(244,114,182,.04)", borderRadius: 8, border: "1px solid rgba(244,114,182,.1)", alignItems: "flex-start" } },
                        React.createElement("span", { style: { color: "#f472b6", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 } }, fmtDate(m.date)),
                        React.createElement("span", { style: { color: "#c9ccd4", fontSize: 12, flex: 1 } }, m.text)
                      )
                    )
                  )
                : React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 12, margin: 0 } }, "No milestones yet. Add the first one.")
            ),
            s: { marginBottom: 12 }
          })
        ),
        React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "Biggest Win This Week" }),
            React.createElement("input", { type: "text", value: ww, onChange: e => setWw(e.target.value), placeholder: "One thing you're actually proud of", style: inp })
          ),
          s: { marginBottom: 12 }
        }),
        React.createElement(Card, {
          ch: React.createElement(React.Fragment, null,
            React.createElement(Lbl, { c: "One Gap to Close Next Week" }),
            React.createElement("input", { type: "text", value: wn, onChange: e => setWn(e.target.value), placeholder: "The one thing that needs to move", style: inp })
          ),
          s: { marginBottom: 12 }
        }),
        ok && React.createElement(Card, {
          ch: React.createElement("p", { style: { color: "#4ade80", margin: 0, fontSize: 13 } }, "\u2713 Sunday review saved."),
          s: { borderColor: "rgba(74,222,128,.25)", background: "rgba(74,222,128,.06)", marginBottom: 12 }
        }),
        (() => {
          const recs = [
            { key: "showChildren", icon: "👶", title: "Children & Milestones", active: sundayOpts.showChildren && getChildren(settings).length > 0, hint: getChildren(settings).length === 0 ? "Add children in Settings → Profile" : "Toggle on with pill above" },
            { key: "showFaith", icon: "💜", title: "Faith & Reflection", active: sundayOpts.showFaith, hint: "Toggle on with pill above" },
            { key: "showReading", icon: "📚", title: "Reading Log", active: sundayOpts.showReading, hint: "Toggle on with pill above" },
            { key: "showWorkout", icon: "🏋️", title: "Training Notes", active: sundayOpts.showWorkout, hint: "Toggle on with pill above" },
            { key: "showHabits", icon: "🌱", title: "Habit Tracker", active: sundayOpts.showHabits, hint: habitGoals.length === 0 ? "Add habit goals in Goals tab first" : "Toggle on with pill above" },
            { key: "showRelationships", icon: "🤝", title: "Relationships", active: sundayOpts.showRelationships, hint: "Toggle on with pill above" },
            { key: "showNutrition", icon: "🧾", title: "Nutrition Quality", active: sundayOpts.showNutrition, hint: "Toggle on with pill above" },
            { key: "showRecovery", icon: "🌿", title: "Recovery & Body", active: sundayOpts.showRecovery, hint: "Toggle on with pill above" },
            { key: "showSunlight", icon: "☀️", title: "Sunlight & Nature", active: sundayOpts.showSunlight, hint: "Toggle on with pill above" },
            { key: "showGiving", icon: "🫶", title: "Acts of Giving", active: sundayOpts.showGiving, hint: "Toggle on with pill above" },
            { key: "showHomeEnv", icon: "🏠", title: "Home Environment", active: sundayOpts.showHomeEnv, hint: "Toggle on with pill above" },
            { key: "showWork", icon: "💼", title: "Work & Career", active: sundayOpts.showWork, hint: "Toggle on with pill above" },
            { key: "showScreen", icon: "📱", title: "Screen & Focus", active: sundayOpts.showScreen, hint: "Toggle on with pill above" },
            { key: "showIdeas", icon: "💡", title: "Ideas & Insights", active: sundayOpts.showIdeas, hint: "Toggle on with pill above" },
            { key: "showCreative", icon: "🎨", title: "Creative Output", active: sundayOpts.showCreative, hint: "Toggle on with pill above" },
            { key: "showMentalHealth", icon: "🧠", title: "Mental Health Check-in", active: false, hint: "🔜 Coming soon — toggle shows a preview card" },
          ];
          const inactive = recs.filter(r => !r.active);
          if (inactive.length === 0) return null;
          return React.createElement(Card, {
            ch: React.createElement(React.Fragment, null,
              React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
                React.createElement("p", { style: { color: "#a78bfa", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 12, margin: 0 } }, "\u2728 MODULES YOU COULD ADD"),
                React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: 0 } }, inactive.length + " available")
              ),
              React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
                inactive.map((r, i) =>
                  React.createElement("div", { key: i, style: { display: "flex", gap: 11, padding: "10px 12px", background: "rgba(167,139,250,.04)", border: "1px solid rgba(167,139,250,.1)", borderRadius: 10, alignItems: "flex-start" } },
                    React.createElement("span", { style: { fontSize: 20, flexShrink: 0, marginTop: 1 } }, r.icon),
                    React.createElement("div", { style: { flex: 1 } },
                      React.createElement("p", { style: { color: "#c9ccd4", fontSize: 12, fontWeight: 700, margin: "0 0 2px" } }, r.title),
                      React.createElement("p", { style: { color: "#a78bfa", fontSize: 10, margin: 0, opacity: 0.7 } }, r.hint)
                    )
                  )
                )
              )
            ),
            s: { marginBottom: 12 }
          });
        })(),
        React.createElement("button", {
          onClick: go,
          disabled: busy,
          style: { background: busy ? "rgba(74,222,128,.45)" : "#4ade80", color: "#080b11", border: "none", borderRadius: 10, padding: "14px 0", fontSize: 15, fontWeight: 800, cursor: busy ? "wait" : "pointer", width: "100%", fontFamily: "'Syne',sans-serif", letterSpacing: ".05em" }
        }, busy ? "SAVING..." : "SAVE SUNDAY REVIEW \u2192")
      )
    );
  }

  window.Sunday = Sunday;
})();
