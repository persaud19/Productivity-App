// Mission Log — Pantry Tab Module
// Standalone module: inventory management, barcode scanner, AI add, receipt scan
// Depends on window.__ml (set by app.js) and React globals
(function () {
  'use strict';

  // Only the primitives Pantry needs from the shared bridge
  const { DB, KEYS, Lbl, inp } = window.__ml;
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  // ── [pantry block — verbatim from app.js] ──

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
  const expColor = daysToExp === null ? "var(--text-muted)" : daysToExp < 0 ? "#ef4444" : daysToExp <= 7 ? "#f4a823" : daysToExp <= 30 ? "#facc15" : "#4ade80";
  const expLabel = daysToExp === null ? "" : daysToExp < 0 ? `Expired ${Math.abs(daysToExp)}d ago` : daysToExp === 0 ? "Expires today" : daysToExp <= 30 ? `${daysToExp}d left` : "";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      background: "var(--card-bg)",
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
      color: "var(--text-primary)",
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
      color: "var(--text-secondary)",
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
      color: "var(--text-secondary)",
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
    brand: item.brand || "",
    location: item.location || item.notes || ""
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
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    c: "Storage Location"
  }), /*#__PURE__*/React.createElement("select", {
    value: form.location,
    onChange: e => s("location", e.target.value),
    style: { ...inp, fontSize: 13, padding: "10px 8px" }
  }, ["", "Kitchen", "Pantry Closet", "Bathroom", "Garage", "Laundry Room", "Bedroom", "Office", "Basement", "Car", "Other"].map(loc => /*#__PURE__*/React.createElement("option", { key: loc, value: loc }, loc || "\u2014 Select location \u2014"))))), /*#__PURE__*/React.createElement("div", {
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
        location: form.location,
        id: item.id || "p" + Date.now()
      });
    },
    disabled: !form.name.trim(),
    style: {
      flex: 1,
      padding: "12px 0",
      background: form.name.trim() ? "#f4a823" : "rgba(255,255,255,.05)",
      color: form.name.trim() ? "#080b11" : "var(--text-muted)",
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
      color: "var(--text-secondary)",
      borderRadius: 9,
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Cancel"))));
}
function PantryAIChat({
  onItemsExtracted,
  onItemsEdited,
  onClose,
  pantryItems
}) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hey! Tell me what you have or what you'd like to update. I can add new items or edit existing ones.\n\nExamples:\n• \"I bought a 2kg bag of rolled oats expiring Jan 2027\"\n• \"Update bananas to 6 pieces\"\n• \"I used 200g of coconut sugar\"\n• \"Change the oat milk expiry to March 2026\""
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [extracted, setExtracted] = useState([]);
  const [pendingEdits, setPendingEdits] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const voiceRef = useRef(null);
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    r.onresult = e => { setInput(prev => (prev ? prev + " " : "") + e.results[0][0].transcript); };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start();
    voiceRef.current = r;
  };
  const send = async text => {
    if (!text.trim()) return;
    // API key lives server-side in Netlify env — no client-side key needed
    const userMsg = { role: "user", content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const pantryList = (pantryItems || [])
        .filter(p => p.essential !== false)
        .map(p => `${p.name} | ${p.qty} ${p.unit}${p.expiry ? " | exp:" + p.expiry : ""}`)
        .join("\n");
      const systemPrompt = `You are a pantry assistant for a household. You can ADD new items or EDIT existing ones.

CURRENT PANTRY:
${pantryList || "(empty)"}

Respond with ONLY a JSON object in this format:
{
  "action": "add" | "edit" | "both" | "clarify",
  "items": [
    {"name":"Rolled Oats","qty":2,"unit":"kg","expiry":"2027-01","brand":""}
  ],
  "edits": [
    {"match":"exact name from pantry list","changes":{"qty":6}}
  ],
  "reply": "short friendly confirmation or clarifying question"
}

RULES:
- action "add": user is adding new items not in the pantry. Populate items[].
- action "edit": user is updating existing items. Populate edits[]. match must be a name from the CURRENT PANTRY list.
- action "both": user is doing both. Populate items[] AND edits[].
- action "clarify": request is ambiguous — ask a specific follow-up question in reply. Do NOT populate items or edits.
- For edits, "changes" can include: qty (set to this exact number), qtyDelta (positive or negative adjustment), unit, expiry (YYYY-MM), brand, name (rename), cat, notes.
- "I used 2 bananas" → qtyDelta: -2
- "Set bananas to 6" → qty: 6
- "Add 3 more bananas" → qtyDelta: 3
- "Update expiry of oat milk to March 2026" → changes: {expiry: "2026-03"}
- If the item name is unclear or matches multiple things, use action "clarify".
- unit must be one of: g, kg, ml, l, oz, lb, cup, tbsp, tsp, piece, can, bag, box, bottle, bunch, loaf, dozen, unit
- expiry: YYYY-MM format or empty string
- reply: 1-2 sentences max. Be specific about what you're changing.
Return ONLY valid JSON. No markdown fences.`;
      const apiMsgs = newMsgs.filter((m, i) => !(i === 0 && m.role === "assistant"));
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: systemPrompt,
          messages: apiMsgs
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || "API error");
      const raw = data.content?.[0]?.text || "{}";
      const clean = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
      const parsed = JSON.parse(clean);
      setMessages(prev => [...prev, { role: "assistant", content: parsed.reply || "Got it!" }]);
      if ((parsed.action === "add" || parsed.action === "both") && parsed.items?.length) {
        setExtracted(prev => [...prev, ...parsed.items.map(i => ({
          ...i,
          id: "p" + Date.now() + Math.random(),
          qty: parseFloat(i.qty) || 1
        }))]);
      }
      if ((parsed.action === "edit" || parsed.action === "both") && parsed.edits?.length) {
        setPendingEdits(prev => {
          // Merge: if same match already queued, merge the changes
          const merged = [...prev];
          parsed.edits.forEach(e => {
            const existing = merged.find(x => x.match.toLowerCase() === e.match.toLowerCase());
            if (existing) { existing.changes = { ...existing.changes, ...e.changes }; }
            else { merged.push(e); }
          });
          return merged;
        });
      }
    } catch (e) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Error: " + (e.message || "couldn't reach Claude. Check your API key in ⚙ Settings.")
      }]);
    }
    setLoading(false);
  };
  const confirm = () => {
    if (extracted.length > 0) onItemsExtracted(extracted);
    if (pendingEdits.length > 0 && onItemsEdited) onItemsEdited(pendingEdits);
    setConfirmed(true);
  };
  const hasPending = extracted.length > 0 || pendingEdits.length > 0;
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
      background: m.role === "user" ? "rgba(96,165,250,.18)" : "var(--card-bg-2)",
      border: `1px solid ${m.role === "user" ? "rgba(96,165,250,.3)" : "var(--card-bg-4)"}`
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-primary)",
      fontSize: 13,
      margin: 0,
      lineHeight: 1.55
    }
  }, m.content)))), loading && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      padding: "8px 13px",
      background: "var(--card-bg-3)",
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
  })), hasPending && !confirmed && /*#__PURE__*/React.createElement("div", {
    style: { padding: "10px 0", borderTop: "1px solid rgba(255,255,255,.07)", marginTop: 8 }
  },
    /*#__PURE__*/React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }
    },
      /*#__PURE__*/React.createElement("p", { style: { color: "#4ade80", fontSize: 11, fontWeight: 700, margin: 0 } },
        extracted.length > 0 ? extracted.length + " to add" : "",
        extracted.length > 0 && pendingEdits.length > 0 ? " \xB7 " : "",
        pendingEdits.length > 0 ? pendingEdits.length + " to update" : ""
      ),
      /*#__PURE__*/React.createElement("button", {
        onClick: confirm,
        style: { padding: "6px 14px", background: "#4ade80", color: "#080b11", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
      }, "APPLY ALL \u2192")
    ),
    /*#__PURE__*/React.createElement("div", {
      style: { maxHeight: 150, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }
    },
      extracted.map((item, i) => /*#__PURE__*/React.createElement("div", {
        key: "add-" + i,
        style: { display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "rgba(74,222,128,.06)", border: "1px solid rgba(74,222,128,.15)", borderRadius: 7 }
      },
        /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-primary)", fontSize: 12 } }, "\u2795 ", item.name),
        /*#__PURE__*/React.createElement("span", { style: { color: "#4ade80", fontSize: 11, fontWeight: 700 } }, item.qty, " ", item.unit, item.expiry ? " \xB7 " + item.expiry : "")
      )),
      pendingEdits.map((edit, i) => {
        const c = edit.changes || {};
        const parts = [];
        if (c.qty !== undefined) parts.push("qty \u2192 " + c.qty);
        if (c.qtyDelta !== undefined) parts.push((c.qtyDelta > 0 ? "+" : "") + c.qtyDelta);
        if (c.unit) parts.push("unit \u2192 " + c.unit);
        if (c.expiry !== undefined) parts.push("exp \u2192 " + (c.expiry || "cleared"));
        if (c.brand !== undefined) parts.push("brand \u2192 " + (c.brand || "cleared"));
        if (c.name) parts.push("rename \u2192 " + c.name);
        return /*#__PURE__*/React.createElement("div", {
          key: "edit-" + i,
          style: { display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "rgba(96,165,250,.06)", border: "1px solid rgba(96,165,250,.15)", borderRadius: 7, gap: 8 }
        },
          /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-primary)", fontSize: 12 } }, "\u270F ", edit.match),
          /*#__PURE__*/React.createElement("span", { style: { color: "#60a5fa", fontSize: 11, fontWeight: 700 } }, parts.join(" \xB7 ") || "update")
        );
      })
    )
  ), confirmed && /*#__PURE__*/React.createElement("div", {
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
      background: input.trim() && !loading ? "rgba(96,165,250,.15)" : "var(--card-bg-3)",
      border: `1px solid ${input.trim() && !loading ? "rgba(96,165,250,.3)" : "var(--card-border)"}`,
      color: input.trim() && !loading ? "#60a5fa" : "var(--text-muted)",
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
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("idle");
  const [foundItem, setFoundItem] = useState(null);
  const [form, setForm] = useState({ qty: 1, unit: "unit", expiry: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const scannerRef = useRef(null);
  const SCANNER_DIV_ID = "pantry-qr-scanner-div";

  const startCamera = async () => {
    if (!window.Html5Qrcode) {
      setErrorMsg("Scanner library not loaded. Please refresh the page.");
      setStatus("error");
      return;
    }
    try {
      setScanning(true);
      setStatus("scanning");
      const scanner = new window.Html5Qrcode(SCANNER_DIV_ID);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 5, qrbox: { width: 240, height: 100 } },
        (decodedText) => {
          stopCamera();
          lookupBarcode(decodedText);
        },
        () => {}
      );
    } catch (e) {
      setScanning(false);
      setStatus("error");
      setErrorMsg(e?.message?.includes("Permission") || e?.message?.includes("permission")
        ? "Camera permission denied. Please allow camera access in your browser settings."
        : "Could not start camera. Try refreshing the page.");
    }
  };

  const stopCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {}).finally(() => {
        scannerRef.current = null;
      });
    }
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
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
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
  useEffect(() => () => { stopCamera(); }, []);
  if (status === "error") return /*#__PURE__*/React.createElement("div", {
    style: { textAlign: "center", padding: "24px 16px" }
  }, /*#__PURE__*/React.createElement("p", {
    style: { color: "#ef4444", fontSize: 14, fontWeight: 700, margin: "0 0 8px" }
  }, "Camera error"), /*#__PURE__*/React.createElement("p", {
    style: { color: "var(--text-secondary)", fontSize: 12, margin: "0 0 14px", lineHeight: 1.6 }
  }, errorMsg || "Could not open camera. Try the voice/text method instead."), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: { padding: "10px 20px", background: "var(--card-bg-2)", border: "1px solid rgba(255,255,255,.1)", color: "var(--text-secondary)", borderRadius: 9, fontSize: 13, cursor: "pointer" }
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
      color: "var(--text-primary)",
      fontSize: 14,
      fontWeight: 700,
      margin: "0 0 2px"
    }
  }, foundItem.name), foundItem.brand && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 11,
      margin: "0 0 2px"
    }
  }, foundItem.brand), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
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
      color: "var(--text-secondary)",
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
      color: "var(--text-secondary)",
      fontSize: 12,
      margin: "0 0 12px",
      lineHeight: 1.6
    }
  }, "Point your camera at any food barcode. The scanner will detect it automatically."),
  /*#__PURE__*/React.createElement("div", {
    id: SCANNER_DIV_ID,
    style: {
      width: "100%",
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 12,
      minHeight: scanning ? 260 : 0
    }
  }),
  !scanning ? /*#__PURE__*/React.createElement("button", {
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
    style: { display: "block", fontSize: 28, marginBottom: 6 }
  }, "\uD83D\uDCF7"), "Tap to Start Scanner") : null, scanning && /*#__PURE__*/React.createElement("button", {
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
      color: "var(--text-muted)",
      fontSize: 10,
      margin: "10px 0 0",
      textAlign: "center"
    }
  }, "Requires camera permission \xB7 Works best in Chrome on Android"));
}
function PantryReceiptScanner({ pantryItems, onApply, onClose }) {
  const [phase, setPhase] = useState("capture"); // capture | processing | review | clarify | done
  const [procError, setProcError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [matched, setMatched] = useState([]);
  const [unknowns, setUnknowns] = useState([]);
  const [selectedMatched, setSelectedMatched] = useState({});
  const [clarifyIdx, setClarifyIdx] = useState(0);
  const [clarifyMsgs, setClarifyMsgs] = useState([]);
  const [clarifyInput, setClarifyInput] = useState("");
  const [clarifyLoading, setClarifyLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [resolved, setResolved] = useState([]);
  const fileRef = useRef(null);
  const voiceRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [clarifyMsgs]);

  const findBestMatch = (name) => {
    const n = name.toLowerCase().trim();
    const pool = pantryItems.filter(p => p.essential !== false);
    const exact = pool.find(p => p.name.toLowerCase() === n);
    if (exact) return exact;
    const contains = pool.find(p => p.name.toLowerCase().includes(n) || n.includes(p.name.toLowerCase()));
    if (contains) return contains;
    const words = n.split(/\s+/).filter(w => w.length > 2);
    let best = null, bestScore = 0;
    pool.forEach(p => {
      const pw = p.name.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const overlap = words.filter(w => pw.some(pw => pw.includes(w) || w.includes(pw))).length;
      const score = overlap / Math.max(words.length, pw.length, 1);
      if (score >= 0.5 && score > bestScore) { bestScore = score; best = p; }
    });
    return best;
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setImagePreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      const mediaType = file.type && file.type.startsWith("image/") ? file.type : "image/jpeg";
      setProcError("");
      setPhase("processing");
      try {
        const res = await fetch("/api/claude", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2000,
            messages: [{
              role: "user",
              content: [
                { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
                { type: "text", text: `Extract all food and grocery items from this receipt. Return ONLY valid JSON, no markdown:\n{\n  "items": [\n    {"rawText":"line as it appears on receipt","name":"clean readable name","qty":1,"unit":"piece"}\n  ]\n}\nRules:\n- name: clean human-readable name, not all-caps store abbreviations\n- qty: numeric quantity purchased (default 1)\n- unit: one of: g,kg,ml,l,oz,lb,piece,can,bag,box,bottle,bunch,loaf,dozen,unit\n- Only food/grocery items — skip taxes, fees, totals, store name\n- rawText: exact text from the receipt line` }
              ]
            }]
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        const raw = data.content?.[0]?.text || "{}";
        const clean = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
        const parsed = JSON.parse(clean);
        const items = (parsed.items || []).map(i => ({ ...i, qty: parseFloat(i.qty) || 1 }));
        const matchedArr = [], unknownsArr = [];
        items.forEach(item => {
          const pm = findBestMatch(item.name);
          if (pm) matchedArr.push({ extracted: item, pantryItem: pm });
          else unknownsArr.push(item);
        });
        setMatched(matchedArr);
        setUnknowns(unknownsArr);
        const sel = {};
        matchedArr.forEach((_, i) => { sel[i] = true; });
        setSelectedMatched(sel);
        setPhase("review");
      } catch (e) {
        setProcError("Could not read receipt: " + (e.message || "check your API key in Settings."));
        setPhase("capture");
      }
    };
    reader.readAsDataURL(file);
  };

  const startClarify = () => {
    const first = unknowns[0];
    setClarifyMsgs([{
      role: "assistant",
      content: "I found \"" + first.rawText + "\" on your receipt but couldn\u2019t match it to your pantry. What is this item? You can say things like \u201CThat\u2019s almond flour, 500g\u201D, \u201CIt\u2019s a bag of mixed nuts\u201D, or \u201CSkip this one\u201D."
    }]);
    setClarifyIdx(0);
    setResolved([]);
    setPhase("clarify");
  };

  const sendClarify = async (text) => {
    if (!text.trim() || clarifyLoading) return;
    const userMsg = { role: "user", content: text };
    const newMsgs = [...clarifyMsgs, userMsg];
    setClarifyMsgs(newMsgs);
    setClarifyInput("");
    setClarifyLoading(true);
    const current = unknowns[clarifyIdx];
    const pantryNames = pantryItems.filter(p => p.essential !== false).map(p => p.name).join(", ");
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          system: "You are helping a user identify a grocery item from a receipt. The receipt shows: \"" + current.rawText + "\". The user's pantry contains: " + pantryNames + ".\n\nRespond with ONLY valid JSON:\n{\"action\":\"resolved\"|\"skip\"|\"clarify\",\"pantryMatch\":\"exact name from pantry or null\",\"newItem\":{\"name\":\"\",\"qty\":1,\"unit\":\"piece\",\"cat\":\"Other\"}|null,\"qty\":1,\"reply\":\"short reply\"}\n\nRules:\n- resolved: user identified the item. Set pantryMatch if it exists in pantry, else newItem.\n- skip: user wants to skip.\n- clarify: response is ambiguous — ask one specific follow-up question.\n- qty: quantity purchased (from receipt or user message, default 1).\n- reply: 1-2 sentences. If resolved, confirm the match. If clarifying, ask one specific question.",
          messages: newMsgs.filter((m, i) => !(i === 0 && m.role === "assistant"))
        })
      });
      const d = await res.json();
      const raw = d.content?.[0]?.text || "{}";
      const clean = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
      const result = JSON.parse(clean);
      setClarifyMsgs(prev => [...prev, { role: "assistant", content: result.reply || "Got it!" }]);
      if (result.action === "resolved" || result.action === "skip") {
        const resolution = {
          extracted: current,
          action: result.action,
          pantryMatch: result.pantryMatch ? pantryItems.find(p => p.name.toLowerCase() === result.pantryMatch.toLowerCase()) || null : null,
          newItem: result.newItem || null,
          qty: parseFloat(result.qty) || current.qty
        };
        const newResolved = [...resolved, resolution];
        setResolved(newResolved);
        const nextIdx = clarifyIdx + 1;
        if (nextIdx < unknowns.length) {
          const next = unknowns[nextIdx];
          setTimeout(() => {
            setClarifyMsgs(prev => [...prev, {
              role: "assistant",
              content: "Next: I found \"" + next.rawText + "\" on your receipt. What is this item?"
            }]);
            setClarifyIdx(nextIdx);
          }, 500);
        } else {
          setTimeout(() => {
            setClarifyMsgs(prev => [...prev, {
              role: "assistant",
              content: "All done! Tap \u201CApply to Pantry\u201D to save everything."
            }]);
            setPhase("done");
          }, 500);
        }
      }
    } catch (e) {
      setClarifyMsgs(prev => [...prev, { role: "assistant", content: "Error — try again." }]);
    }
    setClarifyLoading(false);
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice not supported — try Chrome."); return; }
    const r = new SR();
    r.lang = "en-CA"; r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onresult = e => { setClarifyInput(prev => (prev ? prev + " " : "") + e.results[0][0].transcript); };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start();
    voiceRef.current = r;
  };

  const applyAll = () => {
    const edits = matched
      .filter((_, i) => selectedMatched[i])
      .map(m => ({ match: m.pantryItem.name, changes: { qtyDelta: m.extracted.qty } }));
    const resolvedEdits = resolved
      .filter(r => r.action === "resolved" && r.pantryMatch)
      .map(r => ({ match: r.pantryMatch.name, changes: { qtyDelta: r.qty } }));
    const newItems = resolved
      .filter(r => r.action === "resolved" && r.newItem)
      .map(r => ({ ...r.newItem, qty: r.qty, id: "p" + Date.now() + Math.random(), essential: true }));
    onApply({ edits: [...edits, ...resolvedEdits], newItems });
    onClose();
  };

  const skipAllUnknowns = () => {
    setResolved([]);
    setPhase("done");
  };

  const card = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 10, padding: "12px 14px", marginBottom: 8 };

  // ── Capture ──
  if (phase === "capture") return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("input", { ref: fileRef, type: "file", accept: "image/*", capture: "environment", onChange: handleFile, style: { display: "none" } }),
    /*#__PURE__*/React.createElement("div", {
      style: { background: "rgba(167,139,250,.06)", border: "2px dashed rgba(167,139,250,.25)", borderRadius: 14, padding: "32px 20px", textAlign: "center", marginBottom: 14 }
    },
      /*#__PURE__*/React.createElement("div", { style: { fontSize: 40, marginBottom: 10 } }, "\uD83E\uDDFE"),
      /*#__PURE__*/React.createElement("p", { style: { color: "#a78bfa", fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, margin: "0 0 6px" } }, "Scan a Receipt"),
      /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 12, margin: "0 0 20px", lineHeight: 1.6 } }, "Take a photo of your grocery receipt. Claude will read it and match items to your pantry automatically."),
      /*#__PURE__*/React.createElement("button", {
        onClick: () => fileRef.current?.click(),
        style: { width: "100%", padding: "14px", background: "rgba(167,139,250,.12)", border: "1px solid rgba(167,139,250,.3)", borderRadius: 10, color: "#a78bfa", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif", marginBottom: 8 }
      }, "\uD83D\uDCF8 Take Photo / Upload Receipt")
    ),
    procError && /*#__PURE__*/React.createElement("p", { style: { color: "#ef4444", fontSize: 11, textAlign: "center", margin: "0 0 12px" } }, procError),
    /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, textAlign: "center" } }, "Uses your Claude API key \xB7 Works on any grocery receipt")
  );

  // ── Processing ──
  if (phase === "processing") return /*#__PURE__*/React.createElement("div", { style: { textAlign: "center", padding: "40px 16px" } },
    imagePreview && /*#__PURE__*/React.createElement("img", { src: imagePreview, style: { width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 10, marginBottom: 16, opacity: 0.6 } }),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 6, justifyContent: "center", marginBottom: 12 } },
      [0,1,2].map(i => /*#__PURE__*/React.createElement("div", { key: i, style: { width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", animation: "pulse 1.2s " + (i*0.2) + "s ease-in-out infinite" } }))
    ),
    /*#__PURE__*/React.createElement("p", { style: { color: "#a78bfa", fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, margin: "0 0 4px" } }, "Reading your receipt\u2026"),
    /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 11 } }, "Claude is extracting items and matching them to your pantry")
  );

  // ── Review ──
  if (phase === "review") return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("p", { style: { color: "#a78bfa", fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, margin: "0 0 14px" } }, "Receipt Review"),
    matched.length > 0 && /*#__PURE__*/React.createElement("div", { style: { marginBottom: 14 } },
      /*#__PURE__*/React.createElement("p", { style: { color: "#4ade80", fontSize: 11, fontWeight: 700, margin: "0 0 8px" } }, "\u2713 " + matched.length + " matched to your pantry"),
      matched.map((m, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        onClick: () => setSelectedMatched(prev => ({ ...prev, [i]: !prev[i] })),
        style: { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: selectedMatched[i] ? "rgba(74,222,128,.06)" : "var(--card-bg)", border: "1px solid " + (selectedMatched[i] ? "rgba(74,222,128,.2)" : "var(--card-border)"), borderRadius: 9, marginBottom: 5, cursor: "pointer" }
      },
        /*#__PURE__*/React.createElement("span", { style: { fontSize: 16 } }, selectedMatched[i] ? "\u2705" : "\u25a1"),
        /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
          /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-primary)", fontSize: 12, fontWeight: 600, margin: "0 0 1px" } }, m.pantryItem.name),
          /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: 0 } }, "from: " + m.extracted.rawText)
        ),
        /*#__PURE__*/React.createElement("span", { style: { color: "#4ade80", fontSize: 11, fontWeight: 700, flexShrink: 0 } }, "+" + m.extracted.qty + " " + (m.extracted.unit || ""))
      ))
    ),
    unknowns.length > 0 && /*#__PURE__*/React.createElement("div", { style: { marginBottom: 14 } },
      /*#__PURE__*/React.createElement("p", { style: { color: "#f4a823", fontSize: 11, fontWeight: 700, margin: "0 0 8px" } }, "\u2753 " + unknowns.length + " item" + (unknowns.length !== 1 ? "s" : "") + " need clarification"),
      unknowns.map((u, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: { padding: "8px 12px", background: "rgba(244,168,35,.05)", border: "1px solid rgba(244,168,35,.18)", borderRadius: 9, marginBottom: 5 }
      },
        /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-primary)", fontSize: 12, margin: 0 } }, u.rawText),
        /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: "2px 0 0" } }, "best guess: " + u.name)
      ))
    ),
    matched.length === 0 && unknowns.length === 0 && /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 12, textAlign: "center", padding: 20 } }, "No grocery items found on the receipt. Try a clearer photo."),
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 8 } },
      unknowns.length > 0 && /*#__PURE__*/React.createElement("button", {
        onClick: startClarify,
        style: { width: "100%", padding: "13px", background: "#f4a823", border: "none", borderRadius: 10, color: "#080b11", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
      }, "Clarify " + unknowns.length + " Unknown Item" + (unknowns.length !== 1 ? "s" : "") + " \u2192"),
      /*#__PURE__*/React.createElement("button", {
        onClick: unknowns.length > 0 ? skipAllUnknowns : applyAll,
        style: { width: "100%", padding: "13px", background: "var(--card-bg-2)", border: "1px solid var(--card-border)", borderRadius: 10, color: "var(--text-secondary)", fontSize: 12, fontWeight: 700, cursor: "pointer" }
      }, unknowns.length > 0 ? "Skip unknowns \u2014 apply matched only" : "Apply to Pantry \u2192")
    )
  );

  // ── Clarify ──
  if (phase === "clarify" || phase === "done") return /*#__PURE__*/React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "58vh" } },
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
      /*#__PURE__*/React.createElement("p", { style: { color: "#f4a823", fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 800, margin: 0 } },
        phase === "done" ? "All clarified \u2713" : ("Item " + (clarifyIdx + 1) + " of " + unknowns.length)
      ),
      phase === "done" && /*#__PURE__*/React.createElement("button", {
        onClick: applyAll,
        style: { padding: "8px 18px", background: "#4ade80", border: "none", borderRadius: 8, color: "#080b11", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',sans-serif" }
      }, "Apply to Pantry \u2192")
    ),
    /*#__PURE__*/React.createElement("div", { style: { flex: 1, overflowY: "auto", paddingBottom: 8 } },
      clarifyMsgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: { display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }
      },
        /*#__PURE__*/React.createElement("div", {
          style: { maxWidth: "82%", padding: "10px 13px", borderRadius: m.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px", background: m.role === "user" ? "rgba(167,139,250,.18)" : "var(--card-bg-2)", border: "1px solid " + (m.role === "user" ? "rgba(167,139,250,.3)" : "var(--card-border)") }
        },
          /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-primary)", fontSize: 13, margin: 0, lineHeight: 1.55, whiteSpace: "pre-wrap" } }, m.content)
        )
      )),
      clarifyLoading && /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 5, padding: "8px 13px", background: "var(--card-bg-3)", borderRadius: 12, width: "fit-content" } },
        [0,1,2].map(i => /*#__PURE__*/React.createElement("div", { key: i, style: { width: 7, height: 7, borderRadius: "50%", background: "#f4a823", animation: "pulse 1.2s " + (i*0.2) + "s ease-in-out infinite" } }))
      ),
      /*#__PURE__*/React.createElement("div", { ref: chatEndRef })
    ),
    phase !== "done" && /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 7, paddingTop: 10, borderTop: "1px solid var(--card-border)" } },
      /*#__PURE__*/React.createElement("div", { style: { flex: 1, position: "relative" } },
        /*#__PURE__*/React.createElement("input", {
          value: clarifyInput,
          onChange: e => setClarifyInput(e.target.value),
          onKeyDown: e => e.key === "Enter" && sendClarify(clarifyInput),
          placeholder: "What is this item\u2026",
          style: { width: "100%", background: "var(--card-bg-2)", border: "1px solid var(--card-border-2)", borderRadius: 9, color: "var(--text-primary)", fontSize: 13, padding: "10px 42px 10px 12px", outline: "none", boxSizing: "border-box" }
        }),
        /*#__PURE__*/React.createElement("button", {
          onClick: listening ? () => { voiceRef.current?.stop(); setListening(false); } : startVoice,
          style: { position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, background: listening ? "rgba(239,68,68,.2)" : "rgba(167,139,250,.15)", border: "1px solid " + (listening ? "rgba(239,68,68,.4)" : "rgba(167,139,250,.3)"), borderRadius: 7, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }
        }, listening ? "\uD83D\uDD34" : "\uD83C\uDF99")
      ),
      /*#__PURE__*/React.createElement("button", {
        onClick: () => sendClarify(clarifyInput),
        disabled: !clarifyInput.trim() || clarifyLoading,
        style: { padding: "10px 14px", background: clarifyInput.trim() && !clarifyLoading ? "rgba(167,139,250,.15)" : "var(--card-bg-3)", border: "1px solid " + (clarifyInput.trim() && !clarifyLoading ? "rgba(167,139,250,.3)" : "var(--card-border)"), color: clarifyInput.trim() && !clarifyLoading ? "#a78bfa" : "var(--text-muted)", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: clarifyInput.trim() && !clarifyLoading ? "pointer" : "default" }
      }, "Send")
    )
  );

  return null;
}

function PantryTab({
  pantryItems,
  setPantryItems,
  onAddToGrocery
}) {
  const [mode, setMode] = useState("list"); // list | chat | barcode | receipt
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);

  const addItems = async newItems => {
    const merged = [...pantryItems];
    newItems.forEach(ni => {
      // Merge with existing if same name (case-insensitive) — also restores archived items
      const existing = merged.find(p => p.name.toLowerCase() === ni.name.toLowerCase());
      if (existing) {
        existing.qty = parseFloat(existing.qty || 0) + parseFloat(ni.qty || 1);
        if (ni.expiry) existing.expiry = ni.expiry;
        if (existing.essential === false) existing.essential = true; // restore from archive
      } else {
        merged.push({
          ...ni,
          id: ni.id || "p" + Date.now() + Math.random(),
          cat: ni.cat || "Other",
          minQty: 0,
          reorderQty: 1,
          essential: true
        });
      }
    });
    setPantryItems(merged);
    await DB.set(KEYS.pantry(), merged);
    setMode("list");
  };
  const addOneItem = async item => { await addItems([item]); };

  const applyReceipt = async ({ edits, newItems }) => {
    if (newItems?.length > 0) await addItems(newItems);
    if (edits?.length > 0) await editItems(edits);
  };

  const editItems = async edits => {
    const merged = [...pantryItems];
    edits.forEach(edit => {
      const existing = merged.find(p => p.name.toLowerCase() === (edit.match || "").toLowerCase());
      if (!existing) return;
      const c = edit.changes || {};
      if (c.qty !== undefined) existing.qty = Math.max(0, parseFloat(c.qty));
      if (c.qtyDelta !== undefined) existing.qty = Math.max(0, parseFloat(existing.qty || 0) + parseFloat(c.qtyDelta));
      if (c.unit) existing.unit = c.unit;
      if (c.expiry !== undefined) existing.expiry = c.expiry;
      if (c.brand !== undefined) existing.brand = c.brand;
      if (c.name) existing.name = c.name;
      if (c.cat) existing.cat = c.cat;
      if (c.notes !== undefined) existing.notes = c.notes;
      if (c.minQty !== undefined) existing.minQty = Math.max(0, parseFloat(c.minQty));
    });
    setPantryItems(merged);
    await DB.set(KEYS.pantry(), merged);
    setMode("list");
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
      color: "var(--text-secondary)",
      borderRadius: 7,
      fontSize: 11,
      cursor: "pointer"
    }
  }, "\u2190 Back")), /*#__PURE__*/React.createElement(PantryAIChat, {
    onItemsExtracted: addItems,
    onItemsEdited: editItems,
    onClose: () => setMode("list"),
    pantryItems: pantryItems
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
      color: "var(--text-secondary)",
      borderRadius: 7,
      fontSize: 11,
      cursor: "pointer"
    }
  }, "\u2190 Back")), /*#__PURE__*/React.createElement(PantryBarcodeScanner, {
    onItemFound: item => addOneItem(item),
    onClose: () => setMode("list")
  }));

  if (mode === "receipt") return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 } },
      /*#__PURE__*/React.createElement("p", { style: { color: "#a78bfa", fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, margin: 0 } }, "\uD83E\uDDFE Receipt Scanner"),
      /*#__PURE__*/React.createElement("button", { onClick: () => setMode("list"), style: { padding: "5px 12px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-secondary)", borderRadius: 7, fontSize: 11, cursor: "pointer" } }, "\u2190 Back")
    ),
    /*#__PURE__*/React.createElement(PantryReceiptScanner, {
      pantryItems: pantryItems,
      onApply: applyReceipt,
      onClose: () => setMode("list")
    })
  );

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
  }, "\uD83D\uDCF7 Scan Barcode"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowReceiptScanner(true),
    style: {
      flex: 1,
      padding: "10px 0",
      background: "rgba(167,139,250,.1)",
      border: "1px solid rgba(167,139,250,.25)",
      color: "#a78bfa",
      borderRadius: 9,
      fontSize: 11,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "'Syne',sans-serif"
    }
  }, "\uD83E\uDDFE Scan Receipt")), /*#__PURE__*/React.createElement(PantryEditor, {
    pantryItems: pantryItems,
    setPantryItems: setPantryItems,
    onAddToGrocery: onAddToGrocery
  }), showReceiptScanner && window.MissionReceiptScanner && /*#__PURE__*/React.createElement(window.MissionReceiptScanner, {
    pantryItems: pantryItems,
    onInventoryUpdate: applyReceipt,
    onClose: () => setShowReceiptScanner(false)
  }));
}

// ─── Pantry sub-components (used by PantryEditor) ───────────────────────────

function PantryItemRow({
  item,
  onEdit,
  onQuickAdjust,
  onToggleEssential
}) {
  const qty = parseFloat(item.qty) || 0;
  const minQty = parseFloat(item.minQty) || 0;
  const isLow = qty === 0 || minQty > 0 && qty <= minQty;
  const expiry = item.expiry ? new Date(item.expiry + "-01") : null;
  const daysToExp = expiry ? Math.round((expiry - new Date()) / 86400000) : null;
  const isExpiring = daysToExp !== null && daysToExp <= 7;
  const isExpired = daysToExp !== null && daysToExp < 0;
  const statusColor = qty === 0 ? "#ef4444" : isLow ? "#f4a823" : isExpired ? "#ef4444" : isExpiring ? "#facc15" : "#4ade80";
  const bg = qty === 0 || isLow ? "rgba(239,68,68,.05)" : isExpiring || isExpired ? "rgba(244,168,35,.05)" : "var(--card-bg)";
  const border = qty === 0 || isLow ? "rgba(239,68,68,.2)" : "var(--card-border)";
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
      color: "var(--text-primary)",
      fontSize: 13,
      fontWeight: 600
    }
  }, item.name), /*#__PURE__*/React.createElement("span", {
    style: {
      background: "var(--card-bg-2)",
      color: "var(--text-secondary)",
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
  }, expLabel)), (item.brand || item.location) && /*#__PURE__*/React.createElement("div", { style: { display: "flex", gap: 8 } },
    item.brand && /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-muted)", fontSize: 10 } }, item.brand),
    item.location && /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-muted)", fontSize: 10 } }, "\uD83D\uDCCD " + item.location)
  )), /*#__PURE__*/React.createElement("div", {
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
      color: "var(--text-secondary)",
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
      color: "var(--text-secondary)",
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
      color: "var(--text-secondary)",
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
      background: "var(--card-bg-3)",
      color: "var(--text-secondary)",
      cursor: "pointer",
      fontSize: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, "\u270E"), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onToggleEssential && onToggleEssential(item);
    },
    title: "Essential / Must Have — uncheck to archive",
    style: {
      width: 24,
      height: 24,
      borderRadius: 6,
      border: "1px solid " + (item.essential === false ? "var(--card-border)" : "rgba(244,168,35,.35)"),
      background: item.essential === false ? "transparent" : "rgba(244,168,35,.1)",
      color: item.essential === false ? "var(--text-muted)" : "#f4a823",
      cursor: "pointer",
      fontSize: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      flexShrink: 0
    }
  }, item.essential === false ? "\u2606" : "\u2605")));
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
      color: "var(--text-secondary)",
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
      background: "var(--card-bg-3)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "var(--text-secondary)",
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
        background: "var(--card-bg)",
        borderRadius: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-primary)",
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
      color: "var(--text-secondary)",
      fontSize: 10,
      margin: 0
    }
  }, expired.length > 0 ? `${expired.length} expired · ` : "", expiringItems.length - expired.length, " expiring soon")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setExpanded(!expanded),
    style: {
      padding: "5px 10px",
      background: "var(--card-bg-3)",
      border: "1px solid rgba(255,255,255,.1)",
      color: "var(--text-secondary)",
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
        background: "var(--card-bg)",
        borderRadius: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-primary)",
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
    const updated = pantryItems.map(p => p.id === item.id ? { ...p, qty: newQty } : p);
    setPantryItems(updated);
    await DB.set(KEYS.pantry(), updated);
  };
  const toggleEssential = async item => {
    const isNowArchived = item.essential !== false; // currently essential → archive it
    const updated = pantryItems.map(p => p.id === item.id ? { ...p, essential: !isNowArchived } : p);
    setPantryItems(updated);
    await DB.set(KEYS.pantry(), updated);
  };
  const [showArchived, setShowArchived] = useState(false);
  const handleAddAllToGrocery = () => {
    const lowItems = pantryItems.filter(p => {
      const {
        status
      } = pantryStatus(p);
      return status === "out" || status === "low";
    });
    onAddToGrocery && onAddToGrocery(lowItems);
  };

  // Categorised alert lists (essential items only)
  const lowItems = pantryItems.filter(p => {
    if (p.essential === false) return false;
    const { status } = pantryStatus(p);
    return status === "out" || status === "low";
  });
  const expiringItems = pantryItems.filter(p => {
    const {
      daysToExp
    } = pantryStatus(p);
    return daysToExp !== null && daysToExp <= 7;
  });
  const cats = ["All", ...PANTRY_CATEGORIES];
  const archivedItems = pantryItems.filter(p => p.essential === false);
  const filtered = pantryItems.filter(p => p.essential !== false).filter(p => catFilter === "All" || p.cat === catFilter).filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).filter(p => {
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
    c: "var(--text-primary)"
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
      background: "var(--card-bg)",
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
      color: "var(--text-secondary)",
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
      border: `1px solid ${statusFilter === id ? "rgba(251,146,60,.4)" : "var(--card-bg-4)"}`,
      background: statusFilter === id ? "rgba(251,146,60,.12)" : "transparent",
      color: statusFilter === id ? "#fb923c" : "var(--text-secondary)",
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
      border: `1px solid ${catFilter === c ? "rgba(251,146,60,.3)" : "var(--card-border)"}`,
      background: catFilter === c ? "rgba(251,146,60,.08)" : "transparent",
      color: catFilter === c ? "#fb923c" : "var(--text-muted)",
      fontWeight: catFilter === c ? 700 : 400
    }
  }, c))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
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
      color: "var(--text-muted)",
      fontSize: 28,
      margin: "0 0 8px"
    }
  }, "\uD83E\uDD6B"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary)",
      fontSize: 13,
      margin: "0 0 4px"
    }
  }, "Pantry is empty"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-muted)",
      fontSize: 11,
      margin: "0 0 14px"
    }
  }, "Use the PANTRY tab above to add items by voice, barcode, or manually")), filtered.map(item => /*#__PURE__*/React.createElement(PantryItemRow, {
    key: item.id,
    item: item,
    onEdit: i => { setIsNew(false); setEditItem(i); },
    onQuickAdjust: quickAdjust,
    onToggleEssential: toggleEssential
  })),
  archivedItems.length > 0 && /*#__PURE__*/React.createElement("div", { style: { marginTop: 18 } },
    /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowArchived(v => !v),
      style: { width: "100%", padding: "10px 14px", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 9, color: "var(--text-muted)", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Syne',sans-serif" }
    },
      /*#__PURE__*/React.createElement("span", null, "\u2606 Archived (" + archivedItems.length + ")"),
      /*#__PURE__*/React.createElement("span", null, showArchived ? "\u25B4" : "\u25BE")
    ),
    showArchived && /*#__PURE__*/React.createElement("div", { style: { marginTop: 8 } },
      /*#__PURE__*/React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 10, margin: "0 0 8px" } }, "These items are hidden from your main pantry. Tap \u2605 to restore."),
      archivedItems.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).map(item =>
        /*#__PURE__*/React.createElement("div", {
          key: item.id,
          style: { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 9, marginBottom: 5, opacity: 0.6 }
        },
          /*#__PURE__*/React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            /*#__PURE__*/React.createElement("span", { style: { color: "#6b7280", fontSize: 13, fontWeight: 600 } }, item.name),
            /*#__PURE__*/React.createElement("span", { style: { color: "var(--text-muted)", fontSize: 10, marginLeft: 8 } }, item.cat || "Other")
          ),
          /*#__PURE__*/React.createElement("button", {
            onClick: () => toggleEssential(item),
            style: { padding: "4px 10px", background: "rgba(244,168,35,.1)", border: "1px solid rgba(244,168,35,.3)", borderRadius: 7, color: "#f4a823", fontSize: 11, fontWeight: 700, cursor: "pointer" }
          }, "\u2605 Restore")
        )
      )
    )
  ),
  editItem && /*#__PURE__*/React.createElement(PantryEditModal, {
    item: editItem,
    isNew: isNew,
    onSave: save,
    onClose: () => {
      setEditItem(null);
      setIsNew(false);
    }
  }));
}

  // Export
  window.PantryTab = PantryTab;
})();
