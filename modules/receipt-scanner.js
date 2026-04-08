/**
 * MissionReceiptScanner — Module v1.0
 * ─────────────────────────────────────────────────────────────────────────────
 * Standalone receipt scanning module for Mission Log.
 * Loaded via <script src="modules/receipt-scanner.js"> AFTER app.js.
 * Uses globals already in scope: React, useState, useEffect, useRef,
 *   useCallback, DB, KEYS (all defined in app.js / index.html).
 *
 * Exports: window.MissionReceiptScanner
 *
 * Props:
 *   pantryItems        {Array}    — current inventory items
 *   onInventoryUpdate  {Function} — fn({ edits, newItems }) called on confirm
 *   onClose            {Function} — close the scanner
 *
 * The module handles internally:
 *   - Claude Vision OCR via /api/claude Netlify proxy
 *   - Loading transactions from Firebase for the linking step
 *   - Saving receipt object to Firebase at KEYS.receipt(id)
 *   - Updating the linked transaction with receiptId
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  "use strict";

  // ── Helpers ────────────────────────────────────────────────────────────────

  function genId() {
    return "rcpt_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function toBase64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result.split(",")[1]); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function guessMediaType(file) {
    if (file.type && file.type.startsWith("image/")) return file.type;
    var ext = (file.name || "").split(".").pop().toLowerCase();
    var map = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", heic: "image/heic", heif: "image/heic" };
    return map[ext] || "image/jpeg";
  }

  function currentYearMonth() {
    return new Date().toISOString().slice(0, 7);
  }

  // Fuzzy match a receipt item name against inventory items.
  // Returns the best match or null.
  function fuzzyMatch(rawName, inventoryItems) {
    if (!rawName || !inventoryItems || !inventoryItems.length) return null;
    var name = rawName.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    var words = name.split(" ").filter(function (w) { return w.length > 2; });
    if (!words.length) return null;

    var best = null;
    var bestScore = 0;
    inventoryItems.forEach(function (item) {
      if (item.essential === false) return; // skip archived
      var iname = (item.name || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
      var score = 0;
      if (iname === name) score = 100;
      else if (iname.includes(name) || name.includes(iname)) score = 80;
      else {
        var matched = words.filter(function (w) { return iname.includes(w); });
        if (matched.length > 0) score = (matched.length / Math.max(words.length, 1)) * 60;
      }
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return bestScore >= 30 ? best : null;
  }

  // ── Claude Vision call ─────────────────────────────────────────────────────

  async function extractReceiptData(base64, mediaType) {
    var prompt = [
      "You are a receipt OCR assistant. Extract ALL data from this receipt image.",
      "",
      "Return ONLY valid JSON with no markdown fences or explanation:",
      "{",
      '  "vendor": "Store Name",',
      '  "date": "YYYY-MM-DD",',
      '  "card": "Visa|Mastercard|Amex|Debit|Cash",',
      '  "subtotal": 0.00,',
      '  "tax": 0.00,',
      '  "total": 0.00,',
      '  "lineItems": [',
      '    {',
      '      "rawText": "exact text as shown on receipt",',
      '      "name": "Clean readable product name",',
      '      "qty": 1,',
      '      "unit": "piece",',
      '      "unitPrice": 0.00,',
      '      "totalPrice": 0.00,',
      '      "category": "Produce|Protein|Dairy|Grains|Canned|Sauces|Spices|Frozen|Snacks|Other"',
      "    }",
      "  ]",
      "}",
      "",
      "Rules:",
      "- date: YYYY-MM-DD format. If year not shown, use current year.",
      "- card: detect from receipt footer (VISA, MC, AMEX, DEBIT) or null if not visible.",
      "- amounts: numbers only, no $ symbol. Use null if not visible.",
      "- lineItems: ALL purchased products. SKIP tax lines, subtotal, total, payment tender, store name lines.",
      "- name: clean human-readable name, not ALL-CAPS store abbreviations.",
      "- unit: one of g, kg, ml, l, oz, lb, piece, can, bag, box, bottle, bunch, loaf, dozen, unit.",
      "- unitPrice: price per single unit (null if not shown).",
      "- totalPrice: this line's total cost. Use negative number for discounts/coupons.",
      "- Include discount/coupon lines as separate items with negative totalPrice.",
    ].join("\n");

    var controller = new AbortController();
    setTimeout(function () { controller.abort(); }, 55000);

    var res = await fetch("/api/claude", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 3000,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
            { type: "text", text: prompt }
          ]
        }]
      })
    });

    var rawText = await res.text();
    var data;
    try { data = JSON.parse(rawText); }
    catch (e) { throw new Error("Server returned an unreadable response — try again."); }

    if (data.error || data.type === "error") {
      throw new Error(data.error && data.error.message ? data.error.message : "Claude API error");
    }

    var text = (data.content && data.content[0] && data.content[0].text) ? data.content[0].text : "";
    // Strip any markdown fences if model included them
    var jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No receipt data found — try a clearer photo.");
    try { return JSON.parse(jsonMatch[0]); }
    catch (e) { throw new Error("Receipt data could not be parsed — try a clearer photo."); }
  }

  // ── Design tokens ──────────────────────────────────────────────────────────

  var C = {
    amber:  "#f4a823",
    blue:   "#60a5fa",
    green:  "#4ade80",
    purple: "#a78bfa",
    orange: "#fb923c",
    red:    "#ef4444",
    muted:  "#7a8699",
    text:   "#d1d5db",
    textSec:"#c4cdd9",
  };

  var inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 8, color: C.text,
    padding: "10px 12px", fontSize: 13,
    fontFamily: "'DM Sans',sans-serif",
    outline: "none"
  };

  var labelStyle = {
    display: "block", color: C.muted,
    fontSize: 10, fontWeight: 700,
    letterSpacing: ".06em", marginBottom: 4,
    textTransform: "uppercase"
  };

  var cardStyle = {
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.07)",
    borderRadius: 10, padding: "12px 14px", marginBottom: 8
  };

  function btn(color, ghost, extra) {
    return Object.assign({
      width: "100%", padding: "12px 20px",
      borderRadius: 10, fontFamily: "'Syne',sans-serif",
      fontWeight: 700, fontSize: 13, cursor: "pointer",
      marginTop: 8,
      background: ghost ? "transparent" : "rgba(" + hexToRgb(color) + ",.12)",
      border: "1px solid rgba(" + hexToRgb(color) + ",.3)",
      color: color
    }, extra || {});
  }

  function hexToRgb(hex) {
    var h = hex.replace("#", "");
    return parseInt(h.slice(0,2),16) + "," + parseInt(h.slice(2,4),16) + "," + parseInt(h.slice(4,6),16);
  }

  // ── Step 1: Capture ────────────────────────────────────────────────────────

  function StepCapture({ onCapture, onClose }) {
    var [preview, setPreview] = useState(null);
    var [file, setFile] = useState(null);
    var fileRef = useRef(null);

    function handleFile(f) {
      if (!f) return;
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }

    return React.createElement("div", null,
      React.createElement("p", {
        style: { color: C.textSec, fontSize: 13, lineHeight: 1.7, marginBottom: 20 }
      },
        "Take a photo of any receipt. Claude will extract the vendor, date, all line items, and match them to your inventory. You can then link it to a transaction in Finance."
      ),

      preview && React.createElement("div", {
        style: { textAlign: "center", marginBottom: 16 }
      },
        React.createElement("img", {
          src: preview, alt: "Receipt preview",
          style: {
            maxWidth: "100%", maxHeight: 280,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,.1)",
            objectFit: "contain"
          }
        })
      ),

      React.createElement("input", {
        ref: fileRef, type: "file",
        accept: "image/*", capture: "environment",
        style: { display: "none" },
        onChange: function (e) { handleFile(e.target.files && e.target.files[0]); }
      }),

      !preview
        ? React.createElement("button", {
            style: btn(C.amber),
            onClick: function () { fileRef.current && fileRef.current.click(); }
          }, "📷  Take Photo / Upload Receipt")
        : React.createElement(React.Fragment, null,
            React.createElement("button", {
              style: btn(C.green),
              onClick: function () { onCapture(file); }
            }, "✓  Scan This Receipt →"),
            React.createElement("button", {
              style: btn(C.muted, true, { marginTop: 6 }),
              onClick: function () {
                setPreview(null); setFile(null);
                if (fileRef.current) fileRef.current.value = "";
              }
            }, "Choose a Different Photo")
          )
    );
  }

  // ── Step 2: Extracting ─────────────────────────────────────────────────────

  function StepExtracting() {
    return React.createElement("div", {
      style: { textAlign: "center", padding: "50px 20px" }
    },
      React.createElement("div", { style: { fontSize: 52, marginBottom: 18 } }, "🧾"),
      React.createElement("p", {
        style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: C.amber, margin: "0 0 10px" }
      }, "Reading your receipt…"),
      React.createElement("p", {
        style: { color: C.muted, fontSize: 12, lineHeight: 1.6 }
      }, "Claude is extracting vendor, date, card, line items, and totals.")
    );
  }

  // ── Step 3: Review Header ──────────────────────────────────────────────────

  function StepReviewHeader({ extracted, onConfirm, onBack }) {
    var CARDS = ["Amex", "Visa", "Mastercard", "Debit", "Cash", "Other"];

    var [form, setForm] = useState({
      vendor:   extracted.vendor   || "",
      date:     extracted.date     || "",
      card:     extracted.card     || "",
      subtotal: extracted.subtotal != null ? String(extracted.subtotal) : "",
      tax:      extracted.tax      != null ? String(extracted.tax)      : "",
      total:    extracted.total    != null ? String(extracted.total)    : ""
    });

    function set(k, v) { setForm(function (f) { return Object.assign({}, f, { [k]: v }); }); }

    return React.createElement("div", null,
      React.createElement("p", {
        style: { color: C.textSec, fontSize: 12, lineHeight: 1.6, marginBottom: 16 }
      },
        "Review what Claude extracted. Correct any OCR errors before continuing."
      ),

      // Vendor + Date row
      React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 2 } },
        React.createElement("div", { style: { flex: 2 } },
          React.createElement("label", { style: labelStyle }, "Vendor"),
          React.createElement("input", {
            style: inputStyle,
            value: form.vendor,
            onChange: function (e) { set("vendor", e.target.value); },
            placeholder: "e.g. Farm Boy"
          })
        ),
        React.createElement("div", { style: { flex: 1 } },
          React.createElement("label", { style: labelStyle }, "Date"),
          React.createElement("input", {
            style: Object.assign({}, inputStyle, { colorScheme: "dark" }),
            type: "date",
            value: form.date,
            onChange: function (e) { set("date", e.target.value); }
          })
        )
      ),

      // Card
      React.createElement("div", { style: { marginBottom: 2 } },
        React.createElement("label", { style: labelStyle }, "Card Used"),
        React.createElement("select", {
          style: Object.assign({}, inputStyle, { colorScheme: "dark" }),
          value: form.card,
          onChange: function (e) { set("card", e.target.value); }
        },
          React.createElement("option", { value: "" }, "— Not visible on receipt —"),
          CARDS.map(function (c) { return React.createElement("option", { key: c, value: c }, c); })
        )
      ),

      // Amounts row
      React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 2 } },
        ["subtotal", "tax", "total"].map(function (field) {
          return React.createElement("div", { key: field, style: { flex: 1 } },
            React.createElement("label", { style: labelStyle }, field.charAt(0).toUpperCase() + field.slice(1)),
            React.createElement("input", {
              style: inputStyle,
              type: "number", step: "0.01", min: "0",
              value: form[field],
              onChange: function (e) { set(field, e.target.value); },
              placeholder: "0.00"
            })
          );
        })
      ),

      React.createElement("p", {
        style: { color: C.muted, fontSize: 11, marginTop: 10, marginBottom: 0 }
      },
        (extracted.lineItems || []).length + " line item" + ((extracted.lineItems || []).length !== 1 ? "s" : "") + " found on receipt"
      ),

      React.createElement("button", {
        style: btn(C.amber, false, { marginTop: 14 }),
        onClick: function () { onConfirm(form); }
      }, "Looks Good — Match Items →"),

      React.createElement("button", {
        style: btn(C.muted, true, { marginTop: 4 }),
        onClick: onBack
      }, "← Retake Photo")
    );
  }

  // ── Step 4: Match Items ────────────────────────────────────────────────────

  function StepMatchItems({ lineItems, pantryItems, onConfirm, onBack }) {
    // Build initial matches from fuzzy search
    var init = lineItems.map(function (li) {
      var match = fuzzyMatch(li.name || li.rawText, pantryItems);
      return {
        lineItem: li,
        matchedItem: match,
        action: match ? "update" : "skip",
        qty: li.qty || 1
      };
    });

    var [matches, setMatches] = useState(init);

    function setMatch(i, patch) {
      setMatches(function (ms) {
        return ms.map(function (m, idx) { return idx === i ? Object.assign({}, m, patch) : m; });
      });
    }

    var actionCount = matches.filter(function (m) { return m.action !== "skip"; }).length;

    return React.createElement("div", null,
      React.createElement("p", {
        style: { color: C.textSec, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }
      },
        "Review how each receipt item maps to your inventory. Change the action or quantity as needed."
      ),

      React.createElement("div", { style: { maxHeight: "50vh", overflowY: "auto" } },
        matches.map(function (m, i) {
          var li = m.lineItem;
          var skipped = m.action === "skip";
          return React.createElement("div", {
            key: i,
            style: Object.assign({}, cardStyle, { opacity: skipped ? 0.4 : 1 })
          },
            // Receipt line info
            React.createElement("div", {
              style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }
            },
              React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement("p", {
                  style: { fontSize: 12, fontWeight: 700, color: C.text, margin: "0 0 1px",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
                }, li.name || li.rawText),
                li.rawText !== li.name && React.createElement("p", {
                  style: { fontSize: 9, color: C.muted, margin: 0 }
                }, li.rawText)
              ),
              li.totalPrice != null && React.createElement("p", {
                style: { fontSize: 12, fontWeight: 700, color: li.totalPrice < 0 ? C.green : C.textSec,
                  margin: 0, flexShrink: 0, paddingLeft: 8 }
              }, (li.totalPrice < 0 ? "-" : "") + "$" + Math.abs(parseFloat(li.totalPrice) || 0).toFixed(2))
            ),

            // Action + qty row
            React.createElement("div", { style: { display: "flex", gap: 8 } },
              React.createElement("select", {
                style: Object.assign({}, inputStyle, {
                  flex: 1, padding: "6px 8px", fontSize: 11,
                  marginBottom: 0, colorScheme: "dark"
                }),
                value: m.action,
                onChange: function (e) { setMatch(i, { action: e.target.value }); }
              },
                React.createElement("option", { value: "skip" }, "⊘  Skip"),
                React.createElement("option", { value: "update" },
                  m.matchedItem ? ("↑  Update: " + m.matchedItem.name) : "↑  Update qty (search below)…"
                ),
                React.createElement("option", { value: "add" }, "+  Add as new item")
              ),
              React.createElement("input", {
                type: "number", min: 0.1, step: 0.1,
                style: Object.assign({}, inputStyle, {
                  width: 66, flexShrink: 0, textAlign: "center",
                  padding: "6px 6px", fontSize: 11, marginBottom: 0
                }),
                value: m.qty,
                onChange: function (e) { setMatch(i, { qty: parseFloat(e.target.value) || 1 }); }
              })
            ),

            // Status line
            m.action === "update" && m.matchedItem && React.createElement("p", {
              style: { fontSize: 10, color: C.green, margin: "5px 0 0" }
            }, "✓  " + m.matchedItem.name + " · current qty: " + m.matchedItem.qty + " " + m.matchedItem.unit),

            m.action === "update" && !m.matchedItem && React.createElement("p", {
              style: { fontSize: 10, color: C.orange, margin: "5px 0 0" }
            }, "No inventory match found — switch to \"Add as new item\" or skip"),

            m.action === "add" && React.createElement("p", {
              style: { fontSize: 10, color: C.blue, margin: "5px 0 0" }
            }, "+ Will add to inventory: " + (li.name || li.rawText) + " · " + m.qty + " " + (li.unit || "piece"))
          );
        })
      ),

      React.createElement("button", {
        style: btn(C.green, false, { marginTop: 12 }),
        onClick: function () { onConfirm(matches); }
      },
        actionCount > 0
          ? ("Apply " + actionCount + " item" + (actionCount !== 1 ? "s" : "") + " → Link to Finance")
          : "Skip inventory changes → Link to Finance"
      ),

      React.createElement("button", {
        style: btn(C.muted, true, { marginTop: 4 }),
        onClick: onBack
      }, "← Back to Header")
    );
  }

  // ── Step 5: Link to Transaction ────────────────────────────────────────────

  function StepLinkTransaction({ header, onLink, onSkip, onBack }) {
    var [candidates, setCandidates] = useState(null); // null = loading
    var [selected, setSelected] = useState(null);
    var [loadErr, setLoadErr] = useState(null);
    var month = (header.date || "").slice(0, 7) || currentYearMonth();

    // Load transactions for the receipt's month (and adjacent month for edge cases)
    useEffect(function () {
      async function load() {
        try {
          var txns = await DB.get(KEYS.financeTransactions(month)) || [];
          var receiptTotal = parseFloat(header.total) || 0;
          var receiptDate = header.date || "";

          // Score each transaction — prefer close amount AND close date
          var scored = txns
            .filter(function (t) { return !t.receiptId; }) // skip already-linked
            .map(function (t) {
              var amount = parseFloat(t.amount) || 0;
              var amountDiff = receiptTotal > 0 ? Math.abs(amount - receiptTotal) / receiptTotal : 1;
              var dateDiff = receiptDate && t.date
                ? Math.abs(new Date(t.date) - new Date(receiptDate)) / 86400000
                : 99;
              var score = (amountDiff < 0.03 ? 50 : amountDiff < 0.10 ? 30 : 0) +
                          (dateDiff === 0 ? 30 : dateDiff <= 1 ? 20 : dateDiff <= 3 ? 10 : 0);
              return { txn: t, score: score };
            })
            .filter(function (s) { return s.score > 0; })
            .sort(function (a, b) { return b.score - a.score; })
            .slice(0, 5)
            .map(function (s) { return s.txn; });

          setCandidates(scored);
          if (scored.length > 0) setSelected(scored[0].id);
        } catch (e) {
          setLoadErr("Could not load transactions: " + e.message);
          setCandidates([]);
        }
      }
      load();
    }, []);

    var fmt = function (n) { return "$" + (parseFloat(n) || 0).toFixed(2); };

    if (candidates === null) {
      return React.createElement("div", { style: { textAlign: "center", padding: "40px 0" } },
        React.createElement("p", { style: { color: C.muted, fontSize: 13 } }, "Loading transactions…")
      );
    }

    return React.createElement("div", null,
      React.createElement("p", {
        style: { color: C.textSec, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }
      },
        "Link this receipt to a Finance transaction so you can see the full breakdown when you tap that transaction."
      ),

      // Receipt summary badge
      React.createElement("div", {
        style: Object.assign({}, cardStyle, { borderColor: "rgba(244,168,35,.25)", marginBottom: 16 })
      },
        React.createElement("p", {
          style: { margin: 0, fontSize: 12, color: C.amber, fontWeight: 600 }
        },
          (header.vendor || "Receipt") + "  ·  " + (header.date || "?") +
          (header.total ? "  ·  " + fmt(header.total) : "") +
          (header.card ? "  ·  " + header.card : "")
        )
      ),

      loadErr && React.createElement("p", {
        style: { color: C.orange, fontSize: 12, marginBottom: 10 }
      }, loadErr),

      candidates.length > 0
        ? React.createElement(React.Fragment, null,
            React.createElement("p", {
              style: { fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: ".06em", marginBottom: 8 }
            }, "SUGGESTED MATCHES"),

            candidates.map(function (t) {
              var isSelected = selected === t.id;
              return React.createElement("div", {
                key: t.id,
                onClick: function () { setSelected(t.id); },
                style: Object.assign({}, cardStyle, {
                  cursor: "pointer", marginBottom: 6,
                  borderColor: isSelected ? "rgba(244,168,35,.45)" : "rgba(255,255,255,.07)",
                  background: isSelected ? "rgba(244,168,35,.06)" : "rgba(255,255,255,.03)"
                })
              },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                  React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                    React.createElement("p", {
                      style: { fontSize: 12, fontWeight: 600, color: C.text, margin: "0 0 2px",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
                    }, t.desc || "Transaction"),
                    React.createElement("p", {
                      style: { fontSize: 10, color: C.muted, margin: 0 }
                    }, t.date + "  ·  " + (t.card || "") + "  ·  " + (t.envelopeId || ""))
                  ),
                  React.createElement("p", {
                    style: { fontSize: 13, fontWeight: 700, color: C.green, margin: 0, paddingLeft: 12, flexShrink: 0 }
                  }, fmt(t.amount))
                )
              );
            }),

            React.createElement("button", {
              style: btn(C.amber, false, { marginTop: 12 }),
              onClick: function () { onLink(selected); }
            }, selected ? "Link to Selected Transaction →" : "Select a transaction above"),

            React.createElement("button", {
              style: btn(C.muted, true, { marginTop: 4 }),
              onClick: function () { onSkip(); }
            }, "Save receipt without linking →")
          )
        : React.createElement(React.Fragment, null,
            React.createElement("p", {
              style: { color: C.muted, fontSize: 12, textAlign: "center", padding: "16px 0 20px" }
            }, "No matching transactions found for this amount/date in " + month + ". You can still save the receipt."),
            React.createElement("button", {
              style: btn(C.green),
              onClick: function () { onSkip(); }
            }, "Save Receipt without Linking →")
          ),

      React.createElement("button", {
        style: btn(C.muted, true, { marginTop: 4 }),
        onClick: onBack
      }, "← Back to Items")
    );
  }

  // ── Step 6: Done ───────────────────────────────────────────────────────────

  function StepDone({ receipt, inventoryChanges, onClose }) {
    var lineCount = (receipt.lineItems || []).length;
    return React.createElement("div", {
      style: { textAlign: "center", padding: "36px 10px" }
    },
      React.createElement("div", { style: { fontSize: 54, marginBottom: 16 } }, "✅"),
      React.createElement("p", {
        style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: C.green, margin: "0 0 12px" }
      }, "Receipt Saved!"),
      React.createElement("p", {
        style: { fontSize: 14, color: C.text, margin: "0 0 6px", fontWeight: 600 }
      }, receipt.vendor || "Receipt"),
      receipt.total != null && React.createElement("p", {
        style: { fontSize: 13, color: C.textSec, margin: "0 0 6px" }
      }, "$" + parseFloat(receipt.total).toFixed(2) + (receipt.date ? "  ·  " + receipt.date : "")),
      React.createElement("p", {
        style: { fontSize: 12, color: C.muted, margin: "0 0 4px" }
      }, lineCount + " line item" + (lineCount !== 1 ? "s" : "") + " recorded"),
      inventoryChanges > 0 && React.createElement("p", {
        style: { fontSize: 12, color: C.green, margin: "0 0 4px" }
      }, inventoryChanges + " inventory item" + (inventoryChanges !== 1 ? "s" : "") + " updated"),
      receipt.linkedTransactionId
        ? React.createElement("p", {
            style: { fontSize: 12, color: C.amber, margin: "0 0 0" }
          }, "🔗  Linked to Finance transaction")
        : React.createElement("p", {
            style: { fontSize: 12, color: C.muted, margin: "0 0 0" }
          }, "Saved without Finance link"),
      React.createElement("button", {
        style: btn(C.amber, false, { marginTop: 24 }),
        onClick: onClose
      }, "Done ✓")
    );
  }

  // ── Step 7: Saving ─────────────────────────────────────────────────────────

  function StepSaving() {
    return React.createElement("div", {
      style: { textAlign: "center", padding: "60px 20px" }
    },
      React.createElement("p", {
        style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: C.amber }
      }, "Saving…")
    );
  }

  // ── Main Component ─────────────────────────────────────────────────────────

  function MissionReceiptScanner({ pantryItems, onInventoryUpdate, onClose }) {
    var [step, setStep] = useState("capture");
    // capture | extracting | review | matching | linking | saving | done
    var [imageFile, setImageFile] = useState(null);
    var [extracted, setExtracted] = useState(null);  // raw Claude output
    var [header, setHeader] = useState(null);         // user-reviewed header
    var [matchResults, setMatchResults] = useState(null);
    var [savedReceipt, setSavedReceipt] = useState(null);
    var [invChanges, setInvChanges] = useState(0);
    var [error, setError] = useState(null);

    var STEP_LABELS = {
      capture:    "Step 1 · Upload",
      extracting: "Step 2 · Scanning",
      review:     "Step 3 · Review Header",
      matching:   "Step 4 · Match Items",
      linking:    "Step 5 · Link Finance",
      saving:     "Saving…",
      done:       "Complete"
    };

    // ── Handlers ──

    async function handleCapture(file) {
      setImageFile(file);
      setError(null);
      setStep("extracting");
      try {
        var base64 = await toBase64(file);
        var mediaType = guessMediaType(file);
        var data = await extractReceiptData(base64, mediaType);
        setExtracted(data);
        setStep("review");
      } catch (e) {
        setError(e.message || "Could not read receipt — try a clearer photo.");
        setStep("capture");
      }
    }

    function handleConfirmHeader(h) {
      setHeader(h);
      setStep("matching");
    }

    function handleConfirmMatches(matches) {
      setMatchResults(matches);
      setStep("linking");
    }

    async function handleFinish(linkedTxnId) {
      setStep("saving");
      setError(null);

      try {
        // Build receipt object
        var receiptId = genId();
        var finalReceipt = {
          id: receiptId,
          scannedAt: new Date().toISOString(),
          vendor:   header.vendor   || (extracted && extracted.vendor)   || "",
          date:     header.date     || (extracted && extracted.date)     || "",
          card:     header.card     || (extracted && extracted.card)     || null,
          subtotal: parseFloat(header.subtotal) || null,
          tax:      parseFloat(header.tax)      || null,
          total:    parseFloat(header.total)    || null,
          lineItems: (extracted && extracted.lineItems ? extracted.lineItems : []).map(function (li, i) {
            var mr = matchResults && matchResults[i];
            return Object.assign({}, li, {
              inventoryAction:     mr ? mr.action : "skip",
              matchedInventoryName: mr && mr.matchedItem ? mr.matchedItem.name : null
            });
          }),
          linkedTransactionId: linkedTxnId || null,
          month: (header.date || "").slice(0, 7) || currentYearMonth()
        };

        // Apply inventory updates
        var edits    = [];
        var newItems = [];
        var changedCount = 0;

        if (matchResults) {
          matchResults.forEach(function (m) {
            if (m.action === "update" && m.matchedItem) {
              edits.push({ match: m.matchedItem.name, changes: { qtyDelta: parseFloat(m.qty) || 1 } });
              changedCount++;
            } else if (m.action === "add") {
              var li = m.lineItem;
              newItems.push({
                id: "pi_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
                name:   li.name || li.rawText,
                qty:    parseFloat(m.qty) || 1,
                unit:   li.unit   || "piece",
                cat:    li.category || "Other",
                minQty: 0, reorderQty: 1, essential: true
              });
              changedCount++;
            }
          });
        }

        if (edits.length > 0 || newItems.length > 0) {
          await onInventoryUpdate({ edits: edits, newItems: newItems });
        }
        setInvChanges(changedCount);

        // Save receipt to Firebase
        await DB.set(KEYS.receipt(receiptId), finalReceipt);

        // Link to transaction if selected
        if (linkedTxnId) {
          var month = finalReceipt.month;
          var txns = await DB.get(KEYS.financeTransactions(month)) || [];
          var updated = txns.map(function (t) {
            return t.id === linkedTxnId ? Object.assign({}, t, { receiptId: receiptId }) : t;
          });
          await DB.set(KEYS.financeTransactions(month), updated);
        }

        setSavedReceipt(finalReceipt);
        setStep("done");

      } catch (e) {
        setError(e.message || "Error saving receipt — please try again.");
        setStep("linking");
      }
    }

    // ── Render ──

    return React.createElement("div", {
      style: {
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,.88)",
        zIndex: 1000,
        display: "flex", flexDirection: "column",
        overflowY: "auto",
        fontFamily: "'DM Sans',sans-serif"
      }
    },
      React.createElement("div", {
        style: {
          background: "#0d1117",
          borderRadius: "20px 20px 0 0",
          marginTop: "auto",
          padding: "20px 16px 48px",
          minHeight: "72vh"
        }
      },
        // ── Header row ──
        React.createElement("div", {
          style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }
        },
          React.createElement("div", null,
            React.createElement("p", {
              style: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: C.amber, margin: "0 0 2px" }
            }, "🧾  Receipt Scanner"),
            React.createElement("p", {
              style: { fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: ".08em", margin: 0, textTransform: "uppercase" }
            }, STEP_LABELS[step] || step)
          ),
          React.createElement("button", {
            onClick: onClose,
            style: { background: "none", border: "none", color: C.muted, fontSize: 24, cursor: "pointer", padding: "0 4px", lineHeight: 1 }
          }, "✕")
        ),

        // ── Error banner ──
        error && React.createElement("div", {
          style: {
            background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)",
            borderRadius: 8, padding: "10px 14px", marginBottom: 16
          }
        },
          React.createElement("p", { style: { color: C.red, fontSize: 12, margin: 0 } }, "⚠  " + error)
        ),

        // ── Step content ──
        step === "capture"    && React.createElement(StepCapture,          { onCapture: handleCapture, onClose: onClose }),
        step === "extracting" && React.createElement(StepExtracting),
        step === "review"     && extracted && React.createElement(StepReviewHeader, {
          extracted: extracted,
          onConfirm: handleConfirmHeader,
          onBack: function () { setStep("capture"); }
        }),
        step === "matching" && extracted && React.createElement(StepMatchItems, {
          lineItems: extracted.lineItems || [],
          pantryItems: pantryItems || [],
          onConfirm: handleConfirmMatches,
          onBack: function () { setStep("review"); }
        }),
        step === "linking" && React.createElement(StepLinkTransaction, {
          header: header || {},
          onLink: handleFinish,
          onSkip: function () { handleFinish(null); },
          onBack: function () { setStep("matching"); }
        }),
        step === "saving" && React.createElement(StepSaving),
        step === "done" && savedReceipt && React.createElement(StepDone, {
          receipt: savedReceipt,
          inventoryChanges: invChanges,
          onClose: onClose
        })
      )
    );
  }

  // ── Export ─────────────────────────────────────────────────────────────────
  window.MissionReceiptScanner = MissionReceiptScanner;

})();
