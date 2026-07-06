// Corevado — FoodLogThread
// Unified conversational day-thread for food logging (Health → Log).
// One chat per day: talk to the agent, it infers the slot, logs the meal,
// and renders it as a studio-styled card. Swipe between days, zoom out to
// a magazine timeline of everything you've eaten.
(function () {
  'use strict';
  const { DB, KEYS, getToday, addDays, fmtDate } = window.__ml;
  const { useState, useEffect, useRef, useMemo, useCallback } = React;
  const h = React.createElement;

  // ── Injected stylesheet: animations + glass surfaces ──
  if (!document.getElementById('flt-styles')) {
    const st = document.createElement('style');
    st.id = 'flt-styles';
    st.textContent = `
@keyframes flt-msg-in{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
@keyframes flt-card-in{0%{opacity:0;transform:translateY(18px) scale(.92)}60%{opacity:1;transform:translateY(-3px) scale(1.015)}100%{opacity:1;transform:none}}
@keyframes flt-page-l{from{opacity:0;transform:translateX(-26px)}to{opacity:1;transform:none}}
@keyframes flt-page-r{from{opacity:0;transform:translateX(26px)}to{opacity:1;transform:none}}
@keyframes flt-dot{0%,60%,100%{transform:none;opacity:.35}30%{transform:translateY(-4px);opacity:1}}
@keyframes flt-tl-in{from{opacity:0;transform:translateY(22px) scale(.96)}to{opacity:1;transform:none}}
@keyframes flt-overlay-in{from{opacity:0}to{opacity:1}}
@keyframes flt-sheen{from{transform:translateX(-120%) rotate(8deg)}to{transform:translateX(220%) rotate(8deg)}}
.flt-msg{animation:flt-msg-in .28s cubic-bezier(.21,1.02,.55,1) both}
.flt-card{animation:flt-card-in .5s cubic-bezier(.34,1.4,.64,1) both}
.flt-page-l{animation:flt-page-l .3s cubic-bezier(.21,1.02,.55,1) both}
.flt-page-r{animation:flt-page-r .3s cubic-bezier(.21,1.02,.55,1) both}
.flt-tl-item{animation:flt-tl-in .45s cubic-bezier(.21,1.02,.55,1) both}
.flt-overlay{animation:flt-overlay-in .22s ease both}
.flt-glass{background:color-mix(in srgb, var(--bg) 72%, transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.flt-press{transition:transform .12s cubic-bezier(.34,1.56,.64,1)}
.flt-press:active{transform:scale(.94)}
.flt-thread::-webkit-scrollbar{width:0}
`;
    document.head.appendChild(st);
  }

  // ── Studio card palette — curated food duotones, consistent lighting ──
  const PALETTES = [
    ['#FF9A8B', '#FF6A88'], // berry
    ['#FFD26F', '#FF8A5C'], // citrus
    ['#A8E063', '#56AB2F'], // greens
    ['#84FAB0', '#5BC8AC'], // mint
    ['#FCCB90', '#D57EEB'], // peach plum
    ['#A6C1EE', '#8EC5FC'], // sky
    ['#F6D365', '#FDA085'], // golden
    ['#F5B7B1', '#C39BD3']  // rose
  ];
  const hashStr = s => { let x = 0; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0; return x; };
  const gradFor = name => {
    const [a, b] = PALETTES[hashStr((name || 'meal').toLowerCase()) % PALETTES.length];
    return `radial-gradient(120% 110% at 18% 8%, rgba(255,255,255,.45), transparent 55%), linear-gradient(135deg, ${a}, ${b})`;
  };
  const EMOJI_MAP = [
    ['egg', '🍳'], ['omelet', '🍳'], ['toast', '🍞'], ['bread', '🍞'], ['sandwich', '🥪'], ['wrap', '🌯'],
    ['burrito', '🌯'], ['taco', '🌮'], ['pizza', '🍕'], ['burger', '🍔'], ['fries', '🍟'], ['hot dog', '🌭'],
    ['chicken', '🍗'], ['turkey', '🦃'], ['steak', '🥩'], ['beef', '🥩'], ['pork', '🥓'], ['bacon', '🥓'],
    ['fish', '🐟'], ['salmon', '🐟'], ['tuna', '🐟'], ['shrimp', '🍤'], ['sushi', '🍣'],
    ['salad', '🥗'], ['bowl', '🥣'], ['soup', '🍲'], ['stew', '🍲'], ['curry', '🍛'], ['rice', '🍚'],
    ['pasta', '🍝'], ['spaghetti', '🍝'], ['noodle', '🍜'], ['ramen', '🍜'], ['pho', '🍜'],
    ['oat', '🥣'], ['cereal', '🥣'], ['pancake', '🥞'], ['waffle', '🧇'], ['bagel', '🥯'], ['croissant', '🥐'],
    ['yogurt', '🥛'], ['milk', '🥛'], ['cheese', '🧀'], ['smoothie', '🥤'], ['shake', '🥤'], ['juice', '🧃'],
    ['coffee', '☕'], ['tea', '🍵'], ['banana', '🍌'], ['apple', '🍎'], ['orange', '🍊'], ['berr', '🫐'],
    ['grape', '🍇'], ['mango', '🥭'], ['avocado', '🥑'], ['fruit', '🍎'], ['nut', '🥜'], ['peanut', '🥜'],
    ['protein', '💪'], ['bar', '🍫'], ['chocolate', '🍫'], ['cookie', '🍪'], ['cake', '🍰'], ['ice cream', '🍨'],
    ['donut', '🍩'], ['chips', '🥔'], ['potato', '🥔'], ['corn', '🌽'], ['roti', '🫓'], ['naan', '🫓'],
    ['dosa', '🥞'], ['dal', '🍛'], ['biryani', '🍛'], ['kebab', '🍢'], ['popcorn', '🍿']
  ];
  const emojiFor = (meal) => {
    if (meal && meal.emoji) return meal.emoji;
    const n = ((meal && meal.name) || '').toLowerCase();
    for (const [k, em] of EMOJI_MAP) if (n.includes(k)) return em;
    return '🍽️';
  };
  const SLOT_META = {
    breakfast: { label: 'Breakfast', icon: '☀️' },
    lunch: { label: 'Lunch', icon: '🌤️' },
    dinner: { label: 'Dinner', icon: '🌙' },
    snack: { label: 'Snack', icon: '✨' }
  };
  const inferSlotByTime = (mealLog) => {
    const hr = new Date().getHours();
    let s = hr < 11 ? 'breakfast' : hr < 15 ? 'lunch' : hr < 17 ? 'snack' : hr < 22 ? 'dinner' : 'snack';
    if (s !== 'snack' && mealLog && mealLog[s]) s = 'snack';
    return s;
  };
  const fmtTime = ts => ts ? new Date(ts).toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' }) : '';
  const fmtDayLong = d => new Date(d + 'T12:00:00').toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' });

  // Minimal **bold** renderer for assistant text
  const rich = (text) => String(text || '').split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? h('strong', { key: i, style: { fontWeight: 700, color: 'var(--text-heading)' } }, part) : part);

  const threadKey = date => 'ml:food:thread:' + date;

  // Resize + compress image to max 1200px wide JPEG — shared with MealBuilder
  const compressImage = file => new Promise((res, rej) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1200;
      let w = img.naturalWidth, hh = img.naturalHeight;
      if (w > MAX) { hh = Math.round(hh * MAX / w); w = MAX; }
      const c = document.createElement('canvas');
      c.width = w; c.height = hh;
      c.getContext('2d').drawImage(img, 0, 0, w, hh);
      res(c.toDataURL('image/jpeg', 0.82).split(',')[1]);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('bad image')); };
    img.src = url;
  });

  // ── MealCard — the studio-styled hero card ──
  function MealCard({ meal, slot, ts, size = 'hero', deleted, onUndo, onClick, delay = 0 }) {
    const grad = gradFor(meal.name);
    const isHero = size === 'hero';
    return h('div', {
      className: isHero ? 'flt-card' : 'flt-tl-item',
      onClick,
      style: {
        position: 'relative', borderRadius: isHero ? 20 : 16, overflow: 'hidden',
        aspectRatio: isHero ? '16/10' : '1/1.08',
        boxShadow: '0 10px 28px -12px rgba(0,0,0,.45), 0 2px 8px rgba(0,0,0,.15)',
        background: grad, cursor: onClick ? 'pointer' : 'default',
        opacity: deleted ? .38 : 1, filter: deleted ? 'saturate(.2)' : 'none',
        transition: 'opacity .3s, filter .3s',
        animationDelay: delay + 'ms',
        WebkitTapHighlightColor: 'transparent'
      }
    },
      // sheen sweep on entrance
      isHero && h('div', { style: { position: 'absolute', top: '-40%', bottom: '-40%', width: '38%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)', animation: 'flt-sheen 1.1s .25s ease both', pointerEvents: 'none' } }),
      // emoji hero
      h('div', {
        style: {
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: isHero ? 64 : 44, paddingBottom: isHero ? 34 : 40,
          filter: 'drop-shadow(0 10px 16px rgba(0,0,0,.28))'
        }
      }, emojiFor(meal)),
      // slot + time chip
      h('div', { style: { position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 } },
        h('span', { style: { fontSize: 10, fontWeight: 800, letterSpacing: '.05em', color: '#fff', background: 'rgba(0,0,0,.32)', backdropFilter: 'blur(6px)', padding: '4px 9px', borderRadius: 20, fontFamily: "'Syne',sans-serif", textTransform: 'uppercase' } },
          isHero
            ? (SLOT_META[slot] || SLOT_META.snack).icon + ' ' + (SLOT_META[slot] || SLOT_META.snack).label + (ts ? ' · ' + fmtTime(ts) : '')
            : (SLOT_META[slot] || SLOT_META.snack).icon)
      ),
      // kcal pill
      h('div', { style: { position: 'absolute', top: 10, right: 10, fontSize: 11, fontWeight: 800, color: '#1a1a1a', background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(6px)', padding: '4px 10px', borderRadius: 20, fontFamily: "'Syne',sans-serif" } },
        (meal.calories || 0) + ' cal'),
      // glass footer
      h('div', {
        style: {
          position: 'absolute', left: 0, right: 0, bottom: 0, padding: isHero ? '26px 14px 12px' : '20px 11px 9px',
          background: 'linear-gradient(transparent, rgba(0,0,0,.62))'
        }
      },
        h('p', { style: { margin: 0, color: '#fff', fontWeight: 700, fontSize: isHero ? 15 : 12, lineHeight: 1.25, textShadow: '0 1px 6px rgba(0,0,0,.4)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } }, meal.name),
        h('p', { style: { margin: '3px 0 0', color: 'rgba(255,255,255,.85)', fontSize: isHero ? 11 : 9.5, fontWeight: 600, letterSpacing: '.02em' } },
          (meal.protein || 0) + 'g P · ' + (meal.carbs || 0) + 'g C · ' + (meal.fat || 0) + 'g F' + (isHero && meal.portionDesc ? '  ·  ' + meal.portionDesc : ''))
      ),
      // undo / removed state
      isHero && !deleted && onUndo && h('button', {
        className: 'flt-press',
        onClick: ev => { ev.stopPropagation(); onUndo(); },
        style: { position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,.32)', backdropFilter: 'blur(6px)', border: 'none', color: 'rgba(255,255,255,.9)', fontSize: 10, fontWeight: 700, padding: '5px 11px', borderRadius: 20, cursor: 'pointer' }
      }, 'Undo'),
      deleted && h('div', { style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
        h('span', { style: { background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '6px 14px', borderRadius: 20, fontFamily: "'Syne',sans-serif", letterSpacing: '.06em' } }, 'REMOVED'))
    );
  }

  function TypingDots() {
    return h('div', { className: 'flt-msg', style: { display: 'flex', gap: 4, padding: '12px 16px', background: 'var(--card-bg-2)', border: '1px solid var(--card-border)', borderRadius: '16px 16px 16px 5px', width: 'fit-content' } },
      [0, 1, 2].map(i => h('span', { key: i, style: { width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: `flt-dot 1.1s ${i * 0.14}s infinite` } })));
  }

  // ── Main component ──
  function FoodLogThread({ logDate, setLogDate, today, mealLog, dailyLogged, macroTargets, mealLibrary, allMeals, userName, onSaveMeal, onDeleteEntry, onSaveLibraryMeal }) {
    const [msgs, setMsgs] = useState(null); // null = loading
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const [pageDir, setPageDir] = useState('r');
    const [showTimeline, setShowTimeline] = useState(false);
    const [timelineDays, setTimelineDays] = useState(null);
    const [showLib, setShowLib] = useState(false);
    const [libSearch, setLibSearch] = useState('');
    const endRef = useRef(null);
    const photoRef = useRef(null);
    const touchRef = useRef(null);
    const msgsRef = useRef(msgs);
    msgsRef.current = msgs;

    const isToday = logDate === today;
    const oldest = addDays(today, -13);

    // Load / persist thread per day
    useEffect(() => {
      let live = true;
      setMsgs(null);
      DB.get(threadKey(logDate)).then(t => { if (live) setMsgs(Array.isArray(t) ? t : []); });
      return () => { live = false; };
    }, [logDate]);
    const persist = useCallback(next => {
      setMsgs(next);
      DB.set(threadKey(logDate), next.slice(-60));
    }, [logDate]);

    useEffect(() => { endRef.current && endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, loading]);

    // ── Greeting (computed, never stored) ──
    const greeting = useMemo(() => {
      const name = (userName || '').split(' ')[0];
      const target = macroTargets && macroTargets.calories;
      const eaten = (dailyLogged && dailyLogged.calories) || 0;
      if (!isToday) return `This is your log for ${fmtDayLong(logDate)}. Tell me anything you forgot to track.`;
      const hr = new Date().getHours();
      const hello = hr < 11 ? 'Morning' : hr < 17 ? 'Hey' : 'Evening';
      if (!eaten) return `${hello}${name ? ' ' + name : ''} — nothing logged yet. What was your first bite of the day?`;
      if (target) {
        const left = target - eaten;
        return left > 0
          ? `${hello}! You're at **${eaten} cal** — ${left} left in the tank. What's next?`
          : `You're at **${eaten} cal**, about ${Math.abs(left)} over target. Tomorrow's a fresh page — still want to log something?`;
      }
      return `${hello}! **${eaten} cal** logged so far. What did you have?`;
    }, [logDate, isToday, dailyLogged, macroTargets, userName]);

    // ── Day paging ──
    const page = dir => {
      const next = addDays(logDate, dir);
      if (next > today || next < oldest) return;
      setPageDir(dir > 0 ? 'r' : 'l');
      setLogDate(next);
    };
    const onTouchStart = ev => { touchRef.current = { x: ev.touches[0].clientX, y: ev.touches[0].clientY }; };
    const onTouchEnd = ev => {
      const t = touchRef.current; if (!t) return;
      const dx = ev.changedTouches[0].clientX - t.x, dy = ev.changedTouches[0].clientY - t.y;
      touchRef.current = null;
      if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 1.6) page(dx < 0 ? 1 : -1);
    };

    // ── Shared: append a logged-meal card (followUp lands after the card) ──
    const logMeal = async (parsed, note, followUp) => {
      const slot = ['breakfast', 'lunch', 'dinner', 'snack'].includes(parsed.slot) ? parsed.slot : inferSlotByTime(mealLog);
      const saved = await onSaveMeal(slot, parsed);
      const card = {
        role: 'card', slot, ts: new Date().toISOString(),
        snackId: slot === 'snack' && saved && saved.id ? saved.id : null,
        meal: { name: parsed.name, emoji: parsed.emoji || '', calories: parsed.calories || 0, protein: parsed.protein || 0, carbs: parsed.carbs || 0, fat: parsed.fat || 0, portionDesc: parsed.portionDesc || '' }
      };
      const withNote = note ? [{ role: 'assistant', content: note }] : [];
      const withFollowUp = followUp ? [{ role: 'assistant', content: followUp, ts: new Date().toISOString() }] : [];
      persist([...(msgsRef.current || []), ...withNote, card, ...withFollowUp]);
    };

    const undoCard = async (idx) => {
      const list = msgsRef.current || [];
      const card = list[idx];
      if (!card || card.role !== 'card' || card.deleted) return;
      await onDeleteEntry(card.slot, card.snackId);
      persist(list.map((m, i) => i === idx ? { ...m, deleted: true } : m));
    };

    // ── AI conversation ──
    const buildSystem = () => {
      const lib = (mealLibrary || []).slice(0, 30).map(m => `${m.name}: ${m.calories}cal, ${m.protein}g P, ${m.carbs}g C, ${m.fat}g F`).join('\n');
      const loggedLines = ['breakfast', 'lunch', 'dinner'].map(s => `${s}: ${mealLog && mealLog[s] ? `${mealLog[s].name} (${mealLog[s].calories}cal)` : '—'}`).join(' | ')
        + ` | snacks: ${((mealLog && mealLog.snacks) || []).length}`;
      const t = macroTargets || {};
      const targetLine = t.calories ? `DAILY TARGETS: ${t.calories}cal · ${t.protein}g P · ${t.carbs}g C · ${t.fat}g F. LOGGED SO FAR: ${dailyLogged.calories}cal · ${dailyLogged.protein}g P · ${dailyLogged.carbs}g C · ${dailyLogged.fat}g F.` : '';
      return `You are ${userName || 'the user'}'s personal nutrition companion inside their daily food log. Today's log date: ${logDate}. Current time: ${new Date().toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' })}.
${lib ? 'KNOWN MEALS (use these macros directly when they match):\n' + lib : ''}
ALREADY LOGGED THIS DAY → ${loggedLines}
${targetLine}

Personality: warm, brief, encouraging — a friend who happens to be a nutritionist. Never lecture, never moralize about food.

Rules:
- Infer the slot (breakfast/lunch/dinner/snack) from context and time of day. If that slot already has a meal, log additional food as a snack unless the user says they're replacing it.
- Conversational portions ("a medium bowl", "palm-sized") — grams only if the user uses grams.
- Known meal match → confirm with its macros, don't re-ask.
- Unfamiliar meal → at most ONE short clarifying question, then commit to an estimate.
- The user may log several foods in one message — combine them into one entry with a natural combined name.
- To log food, respond with ONLY valid JSON, no other text:
{"action":"save","slot":"lunch","name":"Chicken Curry & Roti","emoji":"🍛","calories":620,"protein":38,"carbs":72,"fat":14,"portionDesc":"medium bowl + 2 roti","isNew":true}
- "emoji": the single food emoji that best represents the dish. "isNew": true when not in KNOWN MEALS.
- After a NEW meal is logged, the app offers to save it to the library. If the user then describes what's in it (ingredients, rough amounts), respond with ONLY:
{"action":"enrich","name":"Breakfast Shake","emoji":"🥤","cat":["B","S"],"cal":420,"prot":38,"carbs":45,"fat":9,"prep":5,"cook":0,"tags":["quick"],"ing":["1 scoop whey protein","1 banana","1 cup milk"],"steps":[],"portionDesc":"1 large glass"}
Keep name + macros from the meal just logged unless the user corrects them. cat: array from "B","L","D","S".
- If the user declines the library offer, just carry on — never push.
- Questions about progress/remaining macros: answer conversationally from the numbers above.
- Plain-text replies: 1–2 sentences max.`;
    };

    const parseAction = reply => {
      try {
        let s = String(reply || '').trim();
        const wrapped = s.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (wrapped) s = wrapped[1].trim();
        if (s.startsWith('{')) { const p = JSON.parse(s); if (p && p.action) return p; }
      } catch (e) {}
      return null;
    };

    // Dispatch an AI reply: log a meal, enrich the library, or plain text
    const handleReply = async reply => {
      const parsed = parseAction(reply);
      if (parsed && parsed.action === 'save') {
        const followUp = parsed.isNew && onSaveLibraryMeal
          ? `That one's not in your library yet — tell me roughly what's in it and I'll save **${parsed.name}** as a full meal you can plan with. Or just say "skip".`
          : null;
        await logMeal(parsed, null, followUp);
      } else if (parsed && parsed.action === 'enrich' && onSaveLibraryMeal) {
        const saved = await onSaveLibraryMeal({
          name: parsed.name, emoji: parsed.emoji || '',
          cat: Array.isArray(parsed.cat) ? parsed.cat : [parsed.cat || 'S'],
          cal: parsed.cal || 0, prot: parsed.prot || 0, carbs: parsed.carbs || 0, fat: parsed.fat || 0,
          prep: parsed.prep || 0, cook: parsed.cook || 0, cad: parsed.cad || 0,
          tags: parsed.tags || [], ing: parsed.ing || [], steps: parsed.steps || [],
          portionDesc: parsed.portionDesc || '', source: 'log-enrich'
        });
        persist([...(msgsRef.current || []), { role: 'assistant', content: `📚 **${saved.name}** saved to your Library as a complete meal — it'll show up in the Week planner too.`, ts: new Date().toISOString() }]);
      } else {
        persist([...(msgsRef.current || []), { role: 'assistant', content: reply, ts: new Date().toISOString() }]);
      }
    };

    const callAI = async (apiMsgs, model, maxTokens) => {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 30000);
      const res = await fetch('/api/claude', {
        method: 'POST',
        body: JSON.stringify({ model: model || 'claude-haiku-4-5-20251001', max_tokens: maxTokens || 400, system: buildSystem(), messages: apiMsgs }),
        signal: controller.signal
      });
      clearTimeout(tid);
      const data = await res.json();
      return (data.content && data.content[0] && data.content[0].text) || '';
    };

    const toApiMsgs = list => list.filter(m => !m.deleted).slice(-16).map(m => {
      if (m.role === 'card') return { role: 'assistant', content: `[Logged ${m.slot}: ${m.meal.name} — ${m.meal.calories}cal]` };
      if (m._imageB64) return { role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: m._imageB64 } }, { type: 'text', text: m.content || 'Here is my meal photo.' }] };
      return { role: m.role, content: m.content };
    });

    const send = async (text) => {
      if (!text.trim() || loading || msgs === null) return;
      const next = [...msgs, { role: 'user', content: text.trim(), ts: new Date().toISOString() }];
      persist(next);
      setInput('');
      setLoading(true);
      try {
        const reply = await callAI(toApiMsgs(next));
        await handleReply(reply);
      } catch (e) {
        persist([...(msgsRef.current || []), { role: 'assistant', content: e.name === 'AbortError' ? 'Request timed out — try again in a moment.' : "I couldn't reach the kitchen 🧑‍🍳 Check your connection, or use the 📚 library to log without me.", ts: new Date().toISOString() }]);
      }
      setLoading(false);
    };

    // ── Photo ──
    const handlePhoto = async file => {
      if (!file || loading || msgs === null) return;
      setLoading(true);
      try {
        const b64 = await compressImage(file);
        const next = [...msgs, { role: 'user', content: '📷 Meal photo', _imageB64: b64, ts: new Date().toISOString() }];
        persist(next);
        const reply = await callAI(toApiMsgs(next), 'claude-sonnet-4-6', 400);
        await handleReply(reply);
      } catch (e) {
        persist([...(msgsRef.current || []), { role: 'assistant', content: "Couldn't read that photo — try again or just tell me what it was.", ts: new Date().toISOString() }]);
      }
      setLoading(false);
    };

    // ── Voice ──
    const startVoice = () => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { alert('Voice input not supported in this browser.'); return; }
      const r = new SR();
      r.continuous = false; r.lang = 'en-CA'; r.interimResults = false;
      r.onstart = () => setListening(true);
      r.onresult = ev => setInput(prev => (prev ? prev + ' ' : '') + ev.results[0][0].transcript);
      r.onend = () => setListening(false);
      r.onerror = () => setListening(false);
      r.start();
    };

    // ── Library quick-log ──
    const quickLog = m => {
      setShowLib(false); setLibSearch('');
      logMeal({
        slot: inferSlotByTime(mealLog),
        name: m.name, calories: m.cal || m.calories || 0, protein: m.prot || m.protein || 0,
        carbs: m.carbs || 0, fat: m.fat || 0, portionDesc: '1 serving',
        fromInventory: m.fromInventory || false, ing: m.ing || []
      });
    };

    // ── Timeline data ──
    const openTimeline = async () => {
      setShowTimeline(true);
      if (timelineDays) return;
      const days = [];
      for (let i = 0; i < 14; i++) {
        const d = addDays(today, -i);
        days.push(DB.get(KEYS.mealLog(d)).then(ml => ({ date: d, log: ml || {} })));
      }
      setTimelineDays(await Promise.all(days));
    };
    const timelineEntries = day => {
      const out = [];
      ['breakfast', 'lunch', 'dinner'].forEach(s => { if (day.log[s]) out.push({ slot: s, meal: day.log[s], ts: day.log[s].loggedAt }); });
      (day.log.snacks || []).forEach(s => out.push({ slot: 'snack', meal: s, ts: s.timestamp }));
      return out;
    };

    const libFiltered = (allMeals || []).filter(m => !libSearch || m.name.toLowerCase().includes(libSearch.toLowerCase())).slice(0, 40);
    const hasContent = msgs !== null && msgs.length > 0;
    const iconBtn = (extra) => ({
      width: 40, height: 40, minHeight: 40, borderRadius: '50%', border: '1px solid var(--card-border-2)',
      background: 'var(--card-bg-2)', fontSize: 16, cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...extra
    });

    // ═════════ RENDER ═════════
    return h('div', null,

      // ── Day pager header ──
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2px 0 10px' } },
        h('button', { className: 'flt-press', onClick: () => page(-1), disabled: logDate <= oldest, style: iconBtn({ opacity: logDate <= oldest ? .25 : 1 }) }, '‹'),
        h('div', { style: { textAlign: 'center' } },
          h('p', { style: { margin: 0, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: 'var(--text-heading)', letterSpacing: '.02em' } },
            isToday ? 'Today' : logDate === addDays(today, -1) ? 'Yesterday' : fmtDate(logDate)),
          h('p', { style: { margin: 0, fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 } }, fmtDayLong(logDate))
        ),
        h('div', { style: { display: 'flex', gap: 8 } },
          h('button', { className: 'flt-press', onClick: () => page(1), disabled: isToday, style: iconBtn({ opacity: isToday ? .25 : 1 }) }, '›'),
          h('button', { className: 'flt-press', onClick: openTimeline, title: 'Timeline', style: iconBtn({ fontSize: 14 }) }, '▦')
        )
      ),

      // ── Thread ──
      h('div', {
        key: logDate,
        className: 'flt-thread ' + (pageDir === 'r' ? 'flt-page-r' : 'flt-page-l'),
        onTouchStart, onTouchEnd,
        style: {
          height: 'clamp(340px, calc(100dvh - 430px), 640px)', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 2px 12px',
          overscrollBehaviorX: 'contain'
        }
      },
        msgs === null
          ? h('p', { style: { textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, padding: '30px 0' } }, '…')
          : h(React.Fragment, null,
            // greeting bubble
            h('div', { className: 'flt-msg', style: { display: 'flex', justifyContent: 'flex-start' } },
              h('div', { style: { maxWidth: '86%', padding: '11px 15px', borderRadius: '16px 16px 16px 5px', background: 'var(--card-bg-2)', border: '1px solid var(--card-border)', fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-primary)' } }, rich(greeting))),
            // suggestion chips on an empty day
            !hasContent && h('div', { className: 'flt-msg', style: { display: 'flex', gap: 8, flexWrap: 'wrap', animationDelay: '.12s' } },
              ['🍳 2 eggs and toast', '☕ Coffee with milk', '🥗 Big chicken salad'].map(s =>
                h('button', {
                  key: s, className: 'flt-press',
                  onClick: () => send(s.slice(s.indexOf(' ') + 1)),
                  style: { border: '1px solid var(--card-border-2)', background: 'var(--card-bg)', color: 'var(--text-secondary)', fontSize: 12, padding: '8px 13px', borderRadius: 20, cursor: 'pointer', fontWeight: 600 }
                }, s))),
            // messages + cards
            msgs.map((m, i) => {
              if (m.role === 'card') return h('div', { key: i, style: { padding: '2px 6px' } },
                h(MealCard, { meal: m.meal, slot: m.slot, ts: m.ts, deleted: m.deleted, onUndo: isToday || logDate ? () => undoCard(i) : null }));
              const isUser = m.role === 'user';
              return h('div', { key: i, className: 'flt-msg', style: { display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' } },
                h('div', {
                  style: {
                    maxWidth: '86%', padding: '11px 15px',
                    borderRadius: isUser ? '16px 16px 5px 16px' : '16px 16px 16px 5px',
                    background: isUser ? 'linear-gradient(135deg, var(--color-accent-orange), #f97316)' : 'var(--card-bg-2)',
                    border: isUser ? 'none' : '1px solid var(--card-border)',
                    color: isUser ? '#fff' : 'var(--text-primary)',
                    fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    boxShadow: isUser ? '0 4px 14px -6px rgba(249,115,22,.5)' : 'none'
                  }
                }, rich(m.content)));
            }),
            loading && h(TypingDots),
            h('div', { ref: endRef })
          )
      ),

      // ── Composer ──
      h('div', {
        className: 'flt-glass',
        style: {
          position: 'sticky', bottom: 0, display: 'flex', gap: 8, alignItems: 'center',
          padding: '10px 2px calc(10px + env(safe-area-inset-bottom))',
          borderTop: '1px solid var(--card-border)'
        }
      },
        h('input', { ref: photoRef, type: 'file', accept: 'image/*', capture: 'environment', style: { display: 'none' }, onChange: ev => { const f = ev.target.files && ev.target.files[0]; if (f) handlePhoto(f); ev.target.value = ''; } }),
        h('button', { className: 'flt-press', onClick: () => photoRef.current && photoRef.current.click(), disabled: loading, title: 'Photo', style: iconBtn() }, '📷'),
        h('button', { className: 'flt-press', onClick: () => setShowLib(true), title: 'Meal library', style: iconBtn() }, '📚'),
        h('input', {
          type: 'text', value: input, placeholder: listening ? 'Listening…' : 'What did you eat?',
          onChange: ev => setInput(ev.target.value),
          onKeyDown: ev => { if (ev.key === 'Enter') send(input); },
          style: {
            flex: 1, minWidth: 0, background: 'var(--card-bg-2)', border: '1px solid ' + (listening ? 'var(--color-accent-orange)' : 'var(--card-border-2)'),
            borderRadius: 22, padding: '11px 16px', fontSize: 15, color: 'var(--text-primary)', outline: 'none',
            fontFamily: "'DM Sans',sans-serif", transition: 'border-color .2s'
          }
        }),
        input.trim()
          ? h('button', { className: 'flt-press', onClick: () => send(input), disabled: loading, style: iconBtn({ background: 'var(--color-accent-orange)', border: 'none', color: 'var(--ink-on-accent)', fontWeight: 800, boxShadow: '0 4px 14px -4px rgba(249,115,22,.6)' }) }, '↑')
          : h('button', { className: 'flt-press', onClick: startVoice, disabled: loading, title: 'Voice', style: iconBtn({ background: listening ? 'rgba(251,146,60,.2)' : 'var(--card-bg-2)', border: '1px solid ' + (listening ? 'var(--color-accent-orange)' : 'var(--card-border-2)') }) }, '🎙️')
      ),

      // ── Library sheet ──
      showLib && h('div', { className: 'flt-overlay', style: { position: 'fixed', inset: 0, background: 'var(--overlay)', zIndex: 220, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }, onClick: () => setShowLib(false) },
        h('div', { className: 'flt-card', onClick: ev => ev.stopPropagation(), style: { background: 'var(--bg-modal)', borderRadius: '22px 22px 0 0', maxHeight: '72vh', display: 'flex', flexDirection: 'column', padding: '16px 16px calc(14px + env(safe-area-inset-bottom))', animationDuration: '.34s' } },
          h('div', { style: { width: 38, height: 4, borderRadius: 2, background: 'var(--border-strong)', margin: '0 auto 12px' } }),
          h('input', {
            type: 'text', value: libSearch, autoFocus: true, placeholder: `Search ${ (allMeals || []).length } meals…`,
            onChange: ev => setLibSearch(ev.target.value),
            style: { background: 'var(--card-bg-2)', border: '1px solid var(--card-border-2)', borderRadius: 12, padding: '11px 14px', fontSize: 15, color: 'var(--text-primary)', outline: 'none', marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }
          }),
          h('div', { style: { overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 } },
            libFiltered.length === 0 && h('p', { style: { textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, padding: '18px 0' } }, 'No meals found'),
            libFiltered.map((m, i) => h('button', {
              key: m.id || m.name || i, className: 'flt-press', onClick: () => quickLog(m),
              style: { display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 13, padding: '10px 12px', cursor: 'pointer' }
            },
              h('div', { style: { width: 40, height: 40, minHeight: 40, borderRadius: 11, background: gradFor(m.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 } }, emojiFor(m)),
              h('div', { style: { flex: 1, minWidth: 0 } },
                h('p', { style: { margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, m.name),
                h('p', { style: { margin: '1px 0 0', fontSize: 10.5, color: 'var(--text-muted)' } }, (m.prot || m.protein || 0) + 'g protein')),
              h('span', { style: { fontSize: 12, fontWeight: 800, color: 'var(--color-accent-orange)', fontFamily: "'Syne',sans-serif", flexShrink: 0 } }, (m.cal || m.calories || 0) + ' cal')
            ))
          )
        )
      ),

      // ── Timeline (magazine zoom-out) ──
      showTimeline && h('div', { className: 'flt-overlay', style: { position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 230, display: 'flex', flexDirection: 'column' } },
        h('div', { className: 'flt-glass', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 10px', position: 'sticky', top: 0, zIndex: 1, borderBottom: '1px solid var(--card-border)' } },
          h('div', null,
            h('p', { style: { margin: 0, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--text-heading)' } }, 'Your Table'),
            h('p', { style: { margin: 0, fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600 } }, 'Everything you\'ve eaten, the last 14 days')),
          h('button', { className: 'flt-press', onClick: () => setShowTimeline(false), style: iconBtn({ fontSize: 18 }) }, '×')
        ),
        h('div', { style: { flex: 1, overflowY: 'auto', padding: '14px 16px calc(20px + env(safe-area-inset-bottom))' } },
          timelineDays === null
            ? h('p', { style: { textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, padding: '40px 0' } }, 'Setting the table…')
            : (() => {
              const withFood = timelineDays.filter(d => timelineEntries(d).length > 0);
              if (!withFood.length) return h('p', { style: { textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '50px 20px', lineHeight: 1.6 } }, 'Nothing logged yet.\nYour meals will appear here as a gallery.');
              let anim = 0;
              return withFood.map(day => {
                const entries = timelineEntries(day);
                const total = entries.reduce((s, x) => s + (x.meal.calories || 0), 0);
                return h('div', { key: day.date, style: { marginBottom: 26 } },
                  h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '0 2px 10px' } },
                    h('p', { style: { margin: 0, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, color: 'var(--text-heading)', letterSpacing: '.03em', textTransform: 'uppercase' } },
                      day.date === today ? 'Today' : day.date === addDays(today, -1) ? 'Yesterday' : fmtDayLong(day.date)),
                    h('span', { style: { fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' } }, total + ' cal')),
                  h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 } },
                    entries.map((en, i) => h(MealCard, {
                      key: i, meal: en.meal, slot: en.slot, ts: en.ts, size: 'tile', delay: Math.min(anim++ * 45, 500),
                      onClick: () => { setShowTimeline(false); setPageDir(day.date > logDate ? 'r' : 'l'); setLogDate(day.date); }
                    })))
                );
              });
            })()
        )
      )
    );
  }

  window.FoodLogThread = FoodLogThread;
  // Shared visual language — MealBuilder and the Week planner reuse these so
  // every meal in the app renders with the same studio card styling.
  window.__mlCards = { gradFor, emojiFor, PALETTES, SLOT_META, MealCard, TypingDots, compressImage, rich };
})();
