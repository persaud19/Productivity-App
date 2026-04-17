// Mission Log — Train Tab Module
// Contains: Train, StrengthSession, CardioSession, IntervalTimer, OutdoorWalk, IndoorWalk
(function () {
  'use strict';
  const { DB, KEYS, getToday, fmtDate, fmtLong, addDays, daysBetween, C, CL, inp, Lbl, SectionHead } = window.__ml;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─────────────────────────────────────────────────────────────────────────────
// TRAIN TAB — Strength, Cardio, Outdoor Walk, History
// ─────────────────────────────────────────────────────────────────────────────
const EPOCH = new Date("2026-01-05");
const STRENGTH_PAIRS = [{
  id: "chest_tri",
  name: "Chest + Triceps",
  color: "var(--color-accent-blue)"
}, {
  id: "back_bi",
  name: "Back + Biceps",
  color: "var(--color-accent-purple)"
}, {
  id: "legs_glutes",
  name: "Legs + Glutes",
  color: "var(--color-primary)"
}, {
  id: "shoulders_core",
  name: "Shoulders + Core",
  color: "var(--color-success)"
}, {
  id: "push_pull",
  name: "Chest + Back",
  color: "var(--color-accent-orange)"
}, {
  id: "arms_core",
  name: "Arms + Core",
  color: "var(--color-accent-pink)"
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
      color: "var(--color-success)",
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
    stroke: block.color || "var(--color-accent-blue)",
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
    fill: block.color || "var(--color-accent-blue)",
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
      color: "var(--text-secondary)",
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
      color: running ? "var(--color-danger)" : "var(--color-accent-blue)",
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
        color: "var(--color-accent-blue)",
        weight: 4,
        opacity: 0.85
      }).addTo(map);
      leafletRef.current = map;
      map.on("click", e => {
        const pts = [...pointsRef.current, e.latlng];
        pointsRef.current = pts;
        const icon = L.divIcon({
          html: `<div style="width:${pts.length === 1 ? 14 : 10}px;height:${pts.length === 1 ? 14 : 10}px;background:${pts.length === 1 ? "var(--color-success)" : "var(--color-accent-blue)"};border:2px solid #fff;border-radius:50%;"></div>`,
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
      color: "var(--color-success)",
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
      color: "var(--color-primary)",
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
      color: "var(--color-danger)",
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
      color: "var(--text-muted)",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".07em",
      margin: "0 0 2px"
    }
  }, "Distance"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--color-accent-blue)",
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
      color: "var(--text-muted)",
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
      color: "var(--text-muted)",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: ".07em",
      margin: "0 0 2px"
    }
  }, "Pace"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--color-success)",
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
      color: "var(--color-success)",
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
      color: "var(--color-success)",
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
      color: "var(--color-success)",
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
      color: "var(--text-muted)",
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
    const ec = EQUIP_COLORS[ex.equip] || "var(--text-secondary)";
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
        border: `2px solid ${ck ? "var(--color-success)" : "rgba(255,255,255,.18)"}`,
        background: ck ? "var(--color-success)" : "transparent",
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
    }, ck ? "✓" : ""), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: ck ? "var(--text-muted)" : "var(--text-primary)",
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
        color: tip ? "var(--color-primary)" : "var(--text-muted)",
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
        color: "var(--color-accent-yellow)",
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
      color: "var(--color-accent-blue)",
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
      color: "var(--color-accent-blue)",
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
      color: "var(--text-muted)",
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
      color: "var(--text-muted)",
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
      color: "var(--color-accent-blue)",
      fontSize: 13,
      fontWeight: 700
    }
  }, "Avg Speed: ", speed, " km/h")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
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
      background: dist && time ? "var(--color-accent-blue)" : "rgba(255,255,255,.05)",
      border: "none",
      borderRadius: 9,
      color: dist && time ? "var(--bg-nav)" : "var(--text-muted)",
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
    /*#__PURE__*/React.createElement(SectionHead, { label: backlogDate ? fmtMid(backlogDate) : "Train", color: "var(--color-accent-orange)" }),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6, marginRight: 4 } },
      /*#__PURE__*/React.createElement("button", {
        onClick: () => { setTrainView("today"); setBacklogDate(null); setWorkoutType(null); setCardioType(null); setWalkType(null); setStrengthPair(null); setSessionDone(null); },
        style: { background: trainView === "today" ? "rgba(251,146,60,.18)" : "rgba(255,255,255,.04)", border: `1px solid ${trainView === "today" ? "rgba(251,146,60,.4)" : "rgba(255,255,255,.1)"}`, borderRadius: 8, padding: "5px 10px", fontSize: 10, fontWeight: 700, color: trainView === "today" ? "var(--color-accent-orange)" : "var(--text-secondary)", cursor: "pointer" }
      }, "TODAY"),
      /*#__PURE__*/React.createElement("button", {
        onClick: () => { setTrainView("backlog"); setBacklogDate(null); setWorkoutType(null); setCardioType(null); setWalkType(null); setStrengthPair(null); setSessionDone(null); },
        style: { background: trainView === "backlog" ? "rgba(251,146,60,.18)" : "rgba(255,255,255,.04)", border: `1px solid ${trainView === "backlog" ? "rgba(251,146,60,.4)" : "rgba(255,255,255,.1)"}`, borderRadius: 8, padding: "5px 10px", fontSize: 10, fontWeight: 700, color: trainView === "backlog" ? "var(--color-accent-orange)" : "var(--text-secondary)", cursor: "pointer" }
      }, "PAST 7")
    )
  ),
  /*#__PURE__*/React.createElement("p", {
    style: { color: "var(--text-muted)", fontSize: 12, margin: "2px 0 0 13px" }
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
          ? /*#__PURE__*/React.createElement("span", { style: { fontSize: 10, color: "var(--color-success)", fontWeight: 700, background: "rgba(74,222,128,.12)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 6, padding: "2px 8px" } }, "LOGGED")
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
      color: "var(--color-primary)",
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
    const c = s.type === "strength" ? s.pair?.color || "var(--color-primary)" : s.type === "cardio" ? "var(--color-accent-blue)" : s.type === "rest" ? "var(--text-disabled)" : "#555";
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
        color: "var(--color-success)",
        fontFamily: "'Syne',sans-serif",
        fontSize: 18,
        fontWeight: 800,
        margin: "0 0 4px"
      }
    }, "Great work!"),
    /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
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
        color: "var(--color-success)",
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
        color: schedule.type === "strength" ? "var(--color-primary)" : "var(--color-accent-blue)",
        fontWeight: 700
      }
    }, schedule.type === "strength" ? (schedule.pair?.name || "Strength") : schedule.format === "outdoor_walk" ? "Outdoor Walk" : (CARDIO_SESSIONS[schedule.format]?.title || "Cardio"))),
    schedule.type === "rest" && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--color-success)",
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
          color: "var(--color-primary)",
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
          color: "var(--color-accent-blue)",
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
        color: "var(--color-primary)",
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
        color: "var(--color-accent-blue)",
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
          color: "var(--color-accent-blue)",
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
          color: "var(--color-accent-blue)",
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
        color: "var(--color-accent-blue)",
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
          color: "var(--color-accent-blue)",
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
          color: "var(--color-accent-blue)",
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
        color: "var(--text-muted)",
        fontSize: 10,
        letterSpacing: ".07em",
        textTransform: "uppercase",
        margin: "0 0 3px",
        fontWeight: 600
      }
    }, "Today\u2019s Cardio"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--color-accent-blue)",
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
    const c = s.type === "strength" ? s.pair?.color || "var(--color-primary)" : "var(--color-accent-blue)";
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
        color: "var(--text-secondary)",
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
    const c = h.type === "strength" ? "var(--color-primary)" : "var(--color-accent-blue)";
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
        color: "var(--text-secondary)",
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
        color: "var(--color-success)",
        fontSize: 10,
        flexShrink: 0
      }
    }, h.dist, "km"));
  }))));
}


  window.TrainTab = Train;
})();
