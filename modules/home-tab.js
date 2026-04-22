// Mission Log — Home Tab Module
// Contains: TasksTab (household tasks/chores) + RemindersTab
(function () {
  'use strict';
  const { DB, KEYS, getToday, fmtDate, addDays, daysBetween, C, CL, inp, Lbl, SectionHead } = window.__ml;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

const PRI_COLOR = {
  High: "var(--color-danger)",
  Medium: "var(--color-primary)",
  Low: "var(--color-success)"
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
  const [doneByState, setDoneByState] = useState("self");
  const myName = settings?.name || "Me";
  const partnerName = window.__ml.getPartnerName(settings);
  const saveTasks = async updated => {
    setTasks(updated);
    await DB.set(window.__current_household_id ? KEYS.hhChores() : KEYS.chores(), updated);
  };
  const handleDone = async () => {
    if (!doneTask) return;
    const completedByName = doneByState === "both" ? myName + " & " + partnerName : doneByState === "partner" ? partnerName : myName;
    await saveTasks(tasks.map(t => t.id === doneTask.id ? {
      ...t,
      last: doneDateState,
      completedBy: completedByName
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
    color: "var(--color-primary)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
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
      color: "var(--color-primary)",
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
    c: "var(--color-danger)",
    bg: "rgba(239,68,68,.1)",
    border: "rgba(239,68,68,.25)"
  }, {
    l: "Due Soon",
    n: counts.soon,
    c: "var(--color-primary)",
    bg: "rgba(244,168,35,.08)",
    border: "rgba(244,168,35,.2)"
  }, {
    l: "On Track",
    n: counts.ok,
    c: "var(--color-success)",
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
      color: "var(--color-danger)",
      fontSize: 11,
      fontWeight: 700,
      margin: "0 0 3px",
      textTransform: "uppercase",
      letterSpacing: ".04em"
    }
  }, "\uD83D\uDEA8 ", urgentHigh.length, " High Priority Need Attention"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
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
    c: "var(--text-secondary)"
  }, {
    id: "overdue",
    l: `Overdue (${counts.overdue})`,
    c: "var(--color-danger)"
  }, {
    id: "soon",
    l: `Soon (${counts.soon})`,
    c: "var(--color-primary)"
  }, {
    id: "ok",
    l: `On Track (${counts.ok})`,
    c: "var(--color-success)"
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
    const pc = p === "All" ? "var(--text-secondary)" : PRI_COLOR[p];
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
      color: ownerFilter === o ? "var(--color-accent-blue)" : "var(--text-secondary)",
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
    const sc = status === "overdue" ? "var(--color-danger)" : status === "soon" ? "var(--color-primary)" : "var(--color-success)";
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
        color: "var(--text-heading)",
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
        color: "var(--color-accent-blue)",
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
        color: "var(--text-disabled)",
        fontSize: 10
      }
    }, "Every ", task.freq, "d"), task.completedBy && /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--color-success)",
        fontSize: 10,
        fontStyle: "italic"
      }
    }, "\u2713 ", task.completedBy))), /*#__PURE__*/React.createElement("div", {
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
        setDoneByState("self");
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
      background: "var(--bg-modal)",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: 14,
      padding: "20px",
      zIndex: 201
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--color-success)",
      fontFamily: "'Syne',sans-serif",
      fontSize: 15,
      fontWeight: 800,
      margin: "0 0 4px"
    }
  }, "Mark as Done"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
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
  }), /*#__PURE__*/React.createElement(Lbl, {
    c: "Completed By"
  }), /*#__PURE__*/React.createElement("div", {
    style: { display: "flex", gap: 6, marginBottom: 14 }
  }, [["self", myName], ["partner", partnerName], ["both", "Both"]].map(([val, label]) =>
    /*#__PURE__*/React.createElement("button", {
      key: val,
      onClick: () => setDoneByState(val),
      style: {
        flex: 1, padding: "8px 4px", borderRadius: 8, border: "none", cursor: "pointer",
        fontSize: 11, fontWeight: 700, fontFamily: "'Syne',sans-serif",
        background: doneByState === val ? "rgba(74,222,128,.2)" : "rgba(255,255,255,.05)",
        color: doneByState === val ? "var(--color-success)" : "var(--text-secondary)"
      }
    }, label)
  )), /*#__PURE__*/React.createElement("div", {
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
      color: "var(--color-success)",
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
      background: "var(--color-success)",
      color: "var(--bg)",
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
      background: "var(--bg-modal)",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: 14,
      padding: "20px",
      zIndex: 201,
      maxHeight: "90vh",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--color-primary)",
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
        color: sel ? "var(--color-accent-blue)" : "var(--text-secondary)",
        fontSize: 12,
        fontWeight: sel ? 700 : 400,
        cursor: "pointer"
      }
    }, o);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    c: "Next Due"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--color-primary)",
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
      background: editTask.name?.trim() ? "var(--color-primary)" : "rgba(255,255,255,.05)",
      color: editTask.name?.trim() ? "var(--bg)" : "var(--text-muted)",
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
      color: "var(--color-danger)",
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
  const [view, setView] = useState("mine"); // mine | partner | both | done

  // ── Add form state ──
  const [newTitle, setNewTitle] = useState("");
  const [newDue, setNewDue] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newAssigned, setNewAssigned] = useState("me");
  const [showDetails, setShowDetails] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [listening, setListening] = useState(false);

  // ── Inline edit state ──
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDue, setEditDue] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editAssigned, setEditAssigned] = useState("me");
  const [editNotes, setEditNotes] = useState("");

  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const voiceRef = useRef(null);

  // Normalise old items: urgency → priority field for backward compat
  const norm = r => ({ ...r, priority: r.priority || r.urgency || "medium" });

  const loadReminders = useCallback(async () => {
    const hid = window.__current_household_id;
    const p = await DB.get(KEYS.reminders());
    const j = await DB.get(hid ? KEYS.hhJointReminders() : KEYS.jointReminders());
    setPersonal((Array.isArray(p) ? p : []).map(norm));
    setJoint((Array.isArray(j) ? j : []).map(norm));
  }, []);

  useEffect(() => { loadReminders(); }, [loadReminders]);

  const savePersonal = async items => { setPersonal(items); await DB.set(KEYS.reminders(), items); };
  const saveJoint = async items => {
    setJoint(items);
    const hid = window.__current_household_id;
    await DB.set(hid ? KEYS.hhJointReminders() : KEYS.jointReminders(), items);
  };

  const PRI_COLOR = { high: "var(--color-danger)", medium: "var(--color-primary)", low: "var(--color-accent-blue)" };
  const PRI_BG   = { high: "rgba(239,68,68,.12)", medium: "rgba(244,168,35,.12)", low: "rgba(96,165,250,.12)" };
  const PRI_BORDER = { high: "rgba(239,68,68,.3)", medium: "rgba(244,168,35,.3)", low: "rgba(96,165,250,.3)" };

  // ── Voice ──
  const startVoice = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) { alert("Voice input not supported. Try Chrome on Android."); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.continuous = false; r.lang = "en-CA"; r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onresult = e => setNewTitle(prev => (prev ? prev + " " : "") + e.results[0][0].transcript);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start(); voiceRef.current = r;
  };

  // ── Build item ──
  const makeItem = (fields) => {
    const assignedTo = fields.assignedTo || newAssigned || "me";
    // Default to "joint" (household-shared) for any non-"me" assignment OR explicit "both"
    const autoType = assignedTo === "me" ? "personal" : "joint";
    return {
      id: "r_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      title: fields.title || newTitle.trim(),
      notes: fields.notes || "",
      dueDate: fields.dueDate || newDue || "",
      dueTime: fields.dueTime || "",
      type: fields.type || autoType,
      priority: fields.priority || newPriority || "medium",
      urgency: fields.priority || newPriority || "medium", // keep legacy field in sync
      assignedTo,
      category: fields.category || "personal",
      done: false, doneAt: null,
      createdAt: new Date().toISOString(),
      createdBy: window.__current_uid || null, // UID of creator — used to flip "me"/"partner" perspective for other users
      googleTaskId: null
    };
  };

  // ── Add ──
  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    setAiLoading(true);
    // If user manually set due or priority, trust them — skip AI override of those fields
    const hasManualFields = newDue || newPriority !== "medium" || newAssigned !== "me";
    try {
      let parsed = {};
      if (!hasManualFields) {
        // AI parses natural language for date/priority/assigned
        const res = await fetch("/api/claude", {
          method: "POST",
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001", max_tokens: 200,
            messages: [{ role: "user", content: `Today is ${today}. Partner: ${window.__ml.getPartnerName(settings)}. Parse this reminder. Return ONLY valid JSON:\n{"title":"short title","notes":"detail or empty","dueDate":"YYYY-MM-DD or empty","priority":"low|medium|high","assignedTo":"me|partner|both","type":"personal|joint"}\nRules: type "joint" if involves both/household/we/our. assignedTo "partner" if mentions partner. priority "high" for urgent/ASAP. Parse relative dates from ${today}.\nInput: "${newTitle.trim()}"` }]
          })
        });
        const data = await res.json();
        try { parsed = JSON.parse(data.content?.[0]?.text || "{}"); } catch {}
      }
      const item = makeItem(parsed);
      if (item.type === "joint") await saveJoint([item, ...joint]);
      else await savePersonal([item, ...personal]);
      setNewTitle(""); setNewDue(""); setNewPriority("medium"); setNewAssigned("me"); setShowDetails(false);
    } catch(e) {
      const item = makeItem({});
      if (item.type === "joint") await saveJoint([item, ...joint]);
      else await savePersonal([item, ...personal]);
      setNewTitle(""); setNewDue(""); setNewPriority("medium"); setNewAssigned("me"); setShowDetails(false);
    }
    setAiLoading(false);
  };

  // ── Toggle done ──
  const toggleDone = async (item, isJoint) => {
    const updated = { ...item, done: !item.done, doneAt: !item.done ? new Date().toISOString() : null };
    if (isJoint) await saveJoint(joint.map(r => r.id === item.id ? updated : r));
    else await savePersonal(personal.map(r => r.id === item.id ? updated : r));
    if (updated.googleTaskId && window.__google_access_token) {
      try { await gtasksFetch(`/lists/@default/tasks/${updated.googleTaskId}`, { method: "PATCH", body: JSON.stringify({ status: updated.done ? "completed" : "needsAction" }) }); } catch {}
    }
  };

  // ── Delete ──
  const deleteItem = async (item, isJoint) => {
    if (!window.confirm("Delete this reminder?")) return;
    if (isJoint) await saveJoint(joint.filter(r => r.id !== item.id));
    else await savePersonal(personal.filter(r => r.id !== item.id));
    if (item.googleTaskId && window.__google_access_token) {
      try { await gtasksFetch(`/lists/@default/tasks/${item.googleTaskId}`, { method: "DELETE" }); } catch {}
    }
  };

  // ── Edit ──
  const openEdit = (r) => {
    setEditingId(r.id);
    setEditTitle(r.title);
    setEditDue(r.dueDate || "");
    setEditPriority(r.priority || r.urgency || "medium");
    setEditAssigned(r.assignedTo || "me");
    setEditNotes(r.notes || "");
  };
  const cancelEdit = () => setEditingId(null);
  const saveEdit = async (r, isJoint) => {
    const newAssignedTo = editAssigned;
    const newType = newAssignedTo === "me" ? "personal" : "joint";
    const updated = {
      ...r, title: editTitle.trim() || r.title, dueDate: editDue,
      priority: editPriority, urgency: editPriority,
      assignedTo: newAssignedTo, type: newType, notes: editNotes
    };
    // If assignment changed between personal↔joint, move between lists
    if (updated.type !== r.type) {
      if (updated.type === "joint") {
        await savePersonal(personal.filter(x => x.id !== r.id));
        await saveJoint([updated, ...joint]);
      } else {
        await saveJoint(joint.filter(x => x.id !== r.id));
        await savePersonal([updated, ...personal]);
      }
    } else {
      if (isJoint) await saveJoint(joint.map(x => x.id === r.id ? updated : x));
      else await savePersonal(personal.map(x => x.id === r.id ? updated : x));
    }
    setEditingId(null);
  };

  // ── Google Tasks sync ──
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
      setSyncMsg("Synced \u2014 " + changes + " change" + (changes !== 1 ? "s" : "") + " applied.");
    } catch(e) { setSyncMsg("Sync failed: " + (e.message || "unknown error")); }
    setSyncing(false); setTimeout(() => setSyncMsg(""), 5000);
  };

  // ── AI Summary ──
  const generateSummary = async () => {
    const openItems = [...personal.filter(r => !r.done), ...joint.filter(r => !r.done)];
    if (!openItems.length) { setAiSummary("Nothing open \u2014 you're clear!"); return; }
    setSummaryLoading(true);
    try {
      const list = openItems.map(r => "[" + (r.priority || "medium").toUpperCase() + "] " + r.title + (r.dueDate ? " (due " + r.dueDate + ")" : "")).join("\n");
      const res = await fetch("/api/claude", {
        method: "POST",
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 150, messages: [{ role: "user", content: "Today is " + today + ". Give a 2-sentence brief of these open reminders. Flag overdue items and what needs action today or this week. Be direct \u2014 no bullet points.\n\n" + list }] })
      });
      const d = await res.json();
      setAiSummary(d.content?.[0]?.text || "");
    } catch { setAiSummary("Summary failed."); }
    setSummaryLoading(false);
  };

  // ── Sorting: overdue first → due today → upcoming (nearest first) → no date (by priority) ──
  const PRI_RANK = { high: 0, medium: 1, low: 2 };
  const sortItems = items => [...items].sort((a, b) => {
    const aOver = a.dueDate && a.dueDate < today;
    const bOver = b.dueDate && b.dueDate < today;
    if (aOver && !bOver) return -1;
    if (!aOver && bOver) return 1;
    if (aOver && bOver) return a.dueDate.localeCompare(b.dueDate); // most overdue first
    const aToday = a.dueDate === today;
    const bToday = b.dueDate === today;
    if (aToday && !bToday) return -1;
    if (!aToday && bToday) return 1;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate); // nearest first
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    return (PRI_RANK[a.priority || "medium"] || 1) - (PRI_RANK[b.priority || "medium"] || 1);
  });

  const isOverdue = r => r.dueDate && r.dueDate < today && !r.done;
  const isDueToday = r => r.dueDate === today && !r.done;
  const allActive = [...personal.filter(r => !r.done), ...joint.filter(r => !r.done)];
  const doneAll = [...personal.filter(r => r.done), ...joint.filter(r => r.done)].sort((a, b) => (b.doneAt || "").localeCompare(a.doneAt || ""));
  const overdueCount = allActive.filter(isOverdue).length;
  const dueTodayCount = allActive.filter(isDueToday).length;
  const hasGoogleToken = !!window.__google_access_token && (!window.__google_token_expiry || Date.now() < window.__google_token_expiry);
  const partnerName = window.__ml.getPartnerName(settings);

  // "me"/"partner" are creator-relative. Flip them when viewing reminders created by someone else.
  // For items without createdBy (legacy), fall back to literal assignedTo interpretation.
  const myUid = window.__current_uid || null;
  const isMine = r => {
    const a = r.assignedTo || "me";
    if (a === "both") return false;
    if (!r.createdBy || r.createdBy === myUid) return a === "me";
    return a === "partner"; // partner assigned it "to partner" → i.e. to me
  };
  const isForPartner = r => {
    const a = r.assignedTo;
    if (a === "both") return false;
    if (!r.createdBy || r.createdBy === myUid) return a === "partner";
    return a === "me"; // partner assigned it "to me" → i.e. to them
  };

  const mineItems  = sortItems(allActive.filter(isMine));
  const partnerItems = sortItems(allActive.filter(isForPartner));
  const bothItems  = sortItems(allActive.filter(r => r.assignedTo === "both"));
  const displayItems = view === "mine" ? mineItems : view === "partner" ? partnerItems : view === "both" ? bothItems : doneAll;
  const isDoneView = view === "done";

  const tabBtn = (id, label, count, col) => React.createElement("button", {
    key: id, onClick: () => setView(id),
    style: { flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: ".05em", background: view === id ? col + "22" : "transparent", color: view === id ? col : "var(--text-muted)", fontFamily: "'Syne',sans-serif" }
  }, label + " (" + count + ")");

  // ── Priority pill selector (reused in add form + edit) ──
  const PriPicker = ({ value, onChange }) => React.createElement("div", { style: { display: "flex", gap: 4 } },
    ["high", "medium", "low"].map(p =>
      React.createElement("button", {
        key: p, onClick: () => onChange(p),
        style: { flex: 1, padding: "5px 0", borderRadius: 6, border: "1px solid " + (value === p ? PRI_BORDER[p] : "rgba(255,255,255,.08)"), background: value === p ? PRI_BG[p] : "transparent", color: value === p ? PRI_COLOR[p] : "var(--text-muted)", fontSize: 10, fontWeight: 800, cursor: "pointer", letterSpacing: ".05em", fontFamily: "'Syne',sans-serif" }
      }, p === "high" ? "HIGH" : p === "medium" ? "MED" : "LOW")
    )
  );

  const AssignPicker = ({ value, onChange }) => React.createElement("div", { style: { display: "flex", gap: 4 } },
    [["me", "MINE"], ["partner", partnerName.toUpperCase().slice(0,8)], ["both", "BOTH"]].map(([v, l]) =>
      React.createElement("button", {
        key: v, onClick: () => onChange(v),
        style: { flex: 1, padding: "5px 0", borderRadius: 6, border: "1px solid " + (value === v ? "rgba(167,139,250,.4)" : "rgba(255,255,255,.08)"), background: value === v ? "rgba(167,139,250,.15)" : "transparent", color: value === v ? "var(--color-accent-purple)" : "var(--text-muted)", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
      }, l)
    )
  );

  const fmtDue = r => {
    if (!r.dueDate) return null;
    const over = isOverdue(r);
    const today_ = isDueToday(r);
    if (over) return "OVERDUE \xB7 " + r.dueDate;
    if (today_) return "DUE TODAY" + (r.dueTime ? " " + r.dueTime : "");
    return r.dueDate + (r.dueTime ? " " + r.dueTime : "");
  };
  const dueDateColor = r => isOverdue(r) ? "var(--color-danger)" : isDueToday(r) ? "var(--color-primary)" : "var(--text-muted)";

  // ── Input style for inline inputs ──
  const iStyle = { background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "7px 10px", color: "var(--text-primary)", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif", width: "100%", boxSizing: "border-box" };

  return React.createElement("div", null,

    // ── Overdue / today banner ──
    (overdueCount > 0 || dueTodayCount > 0) && React.createElement("div", {
      style: { background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 14, alignItems: "center" }
    },
      overdueCount > 0 && React.createElement("span", { style: { color: "var(--color-danger)", fontWeight: 800, fontSize: 12 } }, overdueCount + " overdue"),
      dueTodayCount > 0 && React.createElement("span", { style: { color: "var(--color-primary)", fontWeight: 700, fontSize: 12 } }, dueTodayCount + " due today")
    ),

    // ── AI Summary ──
    React.createElement("div", { style: { marginBottom: 14 } },
      aiSummary && React.createElement("div", {
        style: { background: "rgba(167,139,250,.08)", border: "1px solid rgba(167,139,250,.2)", borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "var(--text-primary)", lineHeight: 1.65, marginBottom: 8 }
      }, aiSummary),
      React.createElement("button", {
        onClick: generateSummary, disabled: summaryLoading,
        style: { background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 8, padding: "6px 12px", fontSize: 11, color: "var(--color-accent-purple)", fontWeight: 700, cursor: "pointer", opacity: summaryLoading ? .6 : 1 }
      }, summaryLoading ? "Summarising..." : "\u2728 AI Brief")
    ),

    // ── Add form ──
    React.createElement("div", {
      style: { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }
    },
      // Title row
      React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: showDetails ? 12 : 0 } },
        React.createElement("button", {
          onClick: listening ? () => { voiceRef.current?.stop(); setListening(false); } : startVoice,
          style: { width: 38, height: 38, borderRadius: "50%", flexShrink: 0, cursor: "pointer", fontSize: 15, background: listening ? "rgba(239,68,68,.2)" : "rgba(167,139,250,.12)", border: "1px solid " + (listening ? "rgba(239,68,68,.4)" : "rgba(167,139,250,.3)"), color: listening ? "var(--color-danger)" : "var(--color-accent-purple)", display: "flex", alignItems: "center", justifyContent: "center" }
        }, listening ? "\u23F9" : "\uD83C\uDFA4"),
        React.createElement("input", {
          type: "text", value: newTitle,
          onChange: e => setNewTitle(e.target.value),
          onKeyDown: e => e.key === "Enter" && handleAdd(),
          onFocus: () => setShowDetails(true),
          placeholder: "Add a reminder\u2026",
          style: { flex: 1, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "9px 12px", color: "var(--text-primary)", fontSize: 14, outline: "none", fontFamily: "'DM Sans',sans-serif" }
        }),
        React.createElement("button", {
          onClick: handleAdd, disabled: !newTitle.trim() || aiLoading,
          style: { background: newTitle.trim() ? "var(--color-accent-purple)" : "rgba(167,139,250,.2)", border: "none", borderRadius: 10, padding: "9px 16px", color: newTitle.trim() ? "#fff" : "var(--text-muted)", fontWeight: 700, fontSize: 13, cursor: newTitle.trim() ? "pointer" : "not-allowed", flexShrink: 0, fontFamily: "'Syne',sans-serif" }
        }, aiLoading ? "\u2026" : "Add")
      ),

      // Expanded details
      showDetails && React.createElement("div", null,
        // Due date
        React.createElement("div", { style: { marginBottom: 10 } },
          React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".06em", margin: "0 0 6px", fontFamily: "'Syne',sans-serif" } }, "DUE DATE"),
          React.createElement("input", {
            type: "date", value: newDue,
            onChange: e => setNewDue(e.target.value),
            style: { ...iStyle, width: "auto", minWidth: 160 }
          })
        ),
        // Priority
        React.createElement("div", { style: { marginBottom: 10 } },
          React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".06em", margin: "0 0 6px", fontFamily: "'Syne',sans-serif" } }, "PRIORITY"),
          React.createElement(PriPicker, { value: newPriority, onChange: setNewPriority })
        ),
        // Assign to
        React.createElement("div", null,
          React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".06em", margin: "0 0 6px", fontFamily: "'Syne',sans-serif" } }, "ASSIGN TO"),
          React.createElement(AssignPicker, { value: newAssigned, onChange: setNewAssigned })
        )
      )
    ),

    // ── Tabs ──
    React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 16, background: "rgba(255,255,255,.03)", borderRadius: 10, padding: 4 } },
      tabBtn("mine", "MINE", mineItems.length, "var(--color-accent-purple)"),
      tabBtn("partner", partnerName.length > 8 ? partnerName.slice(0,8).toUpperCase() : partnerName.toUpperCase(), partnerItems.length, "var(--color-accent-blue)"),
      tabBtn("both", "BOTH", bothItems.length, "var(--color-accent-orange)"),
      tabBtn("done", "DONE", doneAll.length, "var(--color-success)")
    ),

    // ── Empty state ──
    displayItems.length === 0 && React.createElement("div", {
      style: { textAlign: "center", padding: "32px 0", color: "var(--text-muted)", fontSize: 13 }
    }, isDoneView ? "Nothing completed yet." : "Nothing here \u2014 add one above."),

    // ── Item cards ──
    ...displayItems.map(r => {
      const isJoint = r.type === "joint";
      const overdue = isOverdue(r);
      const dueTd = isDueToday(r);
      const pri = r.priority || r.urgency || "medium";
      const isEditing = editingId === r.id;

      return React.createElement("div", {
        key: r.id,
        style: {
          background: r.done ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.04)",
          border: "1px solid " + (overdue ? "rgba(239,68,68,.35)" : dueTd ? "rgba(244,168,35,.35)" : "rgba(255,255,255,.07)"),
          borderRadius: 10, padding: "12px 14px", marginBottom: 10
        }
      },
        // ── Normal card view ──
        !isEditing && React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: 12 } },
          // Done toggle
          !isDoneView && React.createElement("button", {
            onClick: () => toggleDone(r, isJoint),
            style: { width: 22, height: 22, borderRadius: "50%", flexShrink: 0, cursor: "pointer", marginTop: 1, background: "transparent", border: "2px solid " + (overdue ? "var(--color-danger)" : pri === "high" ? "rgba(239,68,68,.5)" : "rgba(255,255,255,.2)"), color: "var(--color-success)", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }
          }, ""),
          isDoneView && React.createElement("div", {
            style: { width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 1, background: "rgba(74,222,128,.15)", border: "2px solid #4ade80", color: "var(--color-success)", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }
          }, "\u2713"),

          // Content
          React.createElement("div", { style: { flex: 1, minWidth: 0, cursor: isDoneView ? "default" : "pointer" }, onClick: () => !isDoneView && openEdit(r) },
            React.createElement("div", { style: { fontSize: 14, color: r.done ? "var(--text-muted)" : "var(--text-primary)", fontWeight: 500, textDecoration: r.done ? "line-through" : "none", wordBreak: "break-word", marginBottom: 4 } }, r.title),
            r.notes && React.createElement("div", { style: { fontSize: 11, color: "var(--text-muted)", marginBottom: 5, lineHeight: 1.5 } }, r.notes),
            React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" } },
              // Priority pill — always shown
              React.createElement("span", {
                style: { fontSize: 9, fontWeight: 800, letterSpacing: ".05em", borderRadius: 4, padding: "2px 7px", background: PRI_BG[pri], color: PRI_COLOR[pri], border: "1px solid " + PRI_BORDER[pri] }
              }, pri.toUpperCase()),
              // Due date
              r.dueDate && React.createElement("span", {
                style: { fontSize: 10, fontWeight: 700, color: dueDateColor(r), letterSpacing: ".03em" }
              }, "\uD83D\uDCC5 " + fmtDue(r)),
              // Assigned to
              r.assignedTo && r.assignedTo !== "me" && React.createElement("span", {
                style: { fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 7px", background: r.assignedTo === "both" ? "rgba(251,146,60,.12)" : "rgba(96,165,250,.12)", border: "1px solid " + (r.assignedTo === "both" ? "rgba(251,146,60,.3)" : "rgba(96,165,250,.25)"), color: r.assignedTo === "both" ? "var(--color-accent-orange)" : "var(--color-accent-blue)" }
              }, r.assignedTo === "both" ? "BOTH" : "\u2192 " + partnerName),
              r.googleTaskId && React.createElement("span", { style: { fontSize: 9, color: "var(--text-muted)" } }, "\u2713 Google"),
              isDoneView && r.doneAt && React.createElement("span", { style: { fontSize: 10, color: "var(--text-muted)" } }, "Done " + r.doneAt.slice(0, 10))
            ),
            !isDoneView && React.createElement("div", { style: { fontSize: 10, color: "var(--text-muted)", marginTop: 4 } }, "Tap to edit")
          ),

          // Delete
          React.createElement("button", {
            onClick: e => { e.stopPropagation(); deleteItem(r, isJoint); },
            style: { background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18, padding: "0 2px", flexShrink: 0, lineHeight: 1 }
          }, "\xD7")
        ),

        // ── Inline edit panel ──
        isEditing && React.createElement("div", null,
          React.createElement("p", { style: { fontSize: 10, color: "var(--color-accent-purple)", fontWeight: 700, letterSpacing: ".07em", margin: "0 0 10px", fontFamily: "'Syne',sans-serif" } }, "EDIT REMINDER"),
          // Title
          React.createElement("input", {
            type: "text", value: editTitle, onChange: e => setEditTitle(e.target.value),
            style: { ...iStyle, marginBottom: 10 }
          }),
          // Notes
          React.createElement("textarea", {
            value: editNotes, onChange: e => setEditNotes(e.target.value),
            placeholder: "Notes (optional)",
            rows: 2,
            style: { ...iStyle, resize: "vertical", marginBottom: 10 }
          }),
          // Due date
          React.createElement("div", { style: { marginBottom: 10 } },
            React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".06em", margin: "0 0 6px", fontFamily: "'Syne',sans-serif" } }, "DUE DATE"),
            React.createElement("input", {
              type: "date", value: editDue, onChange: e => setEditDue(e.target.value),
              style: { ...iStyle, width: "auto", minWidth: 160 }
            })
          ),
          // Priority
          React.createElement("div", { style: { marginBottom: 10 } },
            React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".06em", margin: "0 0 6px", fontFamily: "'Syne',sans-serif" } }, "PRIORITY"),
            React.createElement(PriPicker, { value: editPriority, onChange: setEditPriority })
          ),
          // Assign
          React.createElement("div", { style: { marginBottom: 12 } },
            React.createElement("p", { style: { fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: ".06em", margin: "0 0 6px", fontFamily: "'Syne',sans-serif" } }, "ASSIGN TO"),
            React.createElement(AssignPicker, { value: editAssigned, onChange: setEditAssigned })
          ),
          // Save / cancel
          React.createElement("div", { style: { display: "flex", gap: 8 } },
            React.createElement("button", {
              onClick: () => saveEdit(r, isJoint),
              style: { flex: 1, padding: "9px 0", background: "var(--color-accent-purple)", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
            }, "Save"),
            React.createElement("button", {
              onClick: cancelEdit,
              style: { padding: "9px 16px", background: "transparent", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, color: "var(--text-muted)", fontSize: 13, cursor: "pointer" }
            }, "Cancel")
          )
        )
      );
    }),

    // ── Google Tasks footer ──
    React.createElement("div", {
      style: { marginTop: 24, padding: "14px 16px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12 }
    },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } },
        React.createElement("span", { style: { fontSize: 11, fontWeight: 700, letterSpacing: ".07em", color: hasGoogleToken ? "var(--color-success)" : "var(--text-muted)" } },
          hasGoogleToken ? "\u25CF GOOGLE TASKS CONNECTED" : "\u25CB GOOGLE TASKS"),
        React.createElement("button", {
          onClick: syncGoogleTasks, disabled: syncing,
          style: { background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "6px 12px", fontSize: 11, color: "var(--text-primary)", fontWeight: 700, cursor: "pointer", opacity: syncing ? .5 : 1 }
        }, syncing ? "Syncing\u2026" : "Sync Now")
      ),
      !hasGoogleToken && React.createElement("p", { style: { fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5, margin: 0 } },
        "Sign out and sign back in to connect Google Tasks \u2014 grants permission once."),
      syncMsg && React.createElement("p", { style: { fontSize: 11, color: "var(--color-success)", margin: "6px 0 0", fontWeight: 600 } }, syncMsg)
    )
  );
}


  window.TasksTab = TasksTab;
  window.RemindersTab = RemindersTab;
})();
