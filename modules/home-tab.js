// Mission Log — Home Tab Module
// Contains: TasksTab (household tasks/chores) + RemindersTab
(function () {
  'use strict';
  const { DB, KEYS, getToday, fmtDate, addDays, daysBetween, C, CL, inp, Lbl, SectionHead } = window.__ml;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

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
function TasksTab({
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
  const myName = settings?.name || "Me";
  const partnerName = window.__ml.getPartnerName(settings);
  const saveTasks = async updated => {
    setTasks(updated);
    await DB.set(window.__current_household_id ? KEYS.hhChores() : KEYS.chores(), updated);
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
    const hid = window.__current_household_id;
    const p = await DB.get(KEYS.reminders());
    const j = await DB.get(hid ? KEYS.hhJointReminders() : KEYS.jointReminders());
    setPersonal(Array.isArray(p) ? p : []);
    setJoint(Array.isArray(j) ? j : []);
  }, []);

  useEffect(() => { loadReminders(); }, [loadReminders]);

  const savePersonal = async items => { setPersonal(items); await DB.set(KEYS.reminders(), items); };
  const saveJoint = async items => {
    setJoint(items);
    const hid = window.__current_household_id;
    await DB.set(hid ? KEYS.hhJointReminders() : KEYS.jointReminders(), items);
  };

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
          messages: [{ role: "user", content: `Today is ${today}. Partner name: ${window.__ml.getPartnerName(settings)}. Parse this reminder. Return ONLY valid JSON, no markdown:\n{"title":"short clear title","notes":"extra detail or empty","dueDate":"YYYY-MM-DD or empty","dueTime":"HH:MM 24h or empty","type":"personal or joint","urgency":"low|medium|high","assignedTo":"me|partner|both","category":"household|health|finance|family|personal|work"}\nRules:\n- type "joint" if involves both people/household/we/us/our\n- assignedTo "partner" if mentions partner by name or says "remind her/him"\n- assignedTo "both" if says "we need to" or "both of us"\n- urgency "high" for urgent/ASAP/emergency, "low" for someday/eventually\n- category: household=chores/home, health=medical/fitness, finance=bills/money\n- Parse relative dates like "Friday","tomorrow" relative to ${today}\nInput: "${input.trim()}"` }]
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
  const partnerName = window.__ml.getPartnerName(settings);
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


  window.TasksTab = TasksTab;
  window.RemindersTab = RemindersTab;
})();
