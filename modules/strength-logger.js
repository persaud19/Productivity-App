// Corevado — StrengthLogger
// Jefit/Lyfta-style strength session: set-by-set logging (weight × reps rows),
// previous-session values ghosted in, auto rest timer between sets, PR
// detection, and a session summary. Replaces the plain checklist in train-tab.
// History lives at ml:train:strengthlog → { [exId]: {date, sets:[{w,r}], maxW, maxR} }
(function () {
  'use strict';
  const { DB, getToday } = window.__ml;
  const { useState, useEffect, useRef, useMemo } = React;
  const h = React.createElement;
  const STRENGTH_POOL = window.STRENGTH_POOL || {};
  const EQUIP_COLORS = window.EQUIP_COLORS || {};
  const LOG_KEY = 'ml:train:strengthlog';

  // Same deterministic daily selection as the original StrengthSession
  function seededShuffle(arr, seed) {
    const a = [...arr];
    let s = seed;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor(s / 233280 * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const parseTarget = str => {
    const m = /(\d+)\s*[×x]\s*(\d+)?/.exec(str || '');
    return { sets: m ? parseInt(m[1]) : 3, reps: m && m[2] ? parseInt(m[2]) : 10 };
  };
  const fmtSets = sets => (sets || []).map(s => (s.w > 0 ? s.w + '×' : '') + s.r).join(', ');

  // ── Rest timer bottom sheet ──
  function RestTimer({ seconds, onDone, color }) {
    const [left, setLeft] = useState(seconds);
    useEffect(() => {
      if (left <= 0) {
        try { navigator.vibrate && navigator.vibrate([120, 60, 120]); } catch (e) {}
        onDone();
        return;
      }
      const t = setTimeout(() => setLeft(l => l - 1), 1000);
      return () => clearTimeout(t);
    }, [left]);
    const pct = left / Math.max(seconds, 1);
    return h('div', { className: 'flt-overlay', style: { position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 250, display: 'flex', justifyContent: 'center', pointerEvents: 'none' } },
      h('div', { className: 'flt-card', style: { pointerEvents: 'auto', width: '100%', maxWidth: 490, background: 'var(--bg-modal)', borderRadius: '22px 22px 0 0', border: '1px solid var(--card-border-2)', borderBottom: 'none', padding: '18px 20px calc(18px + env(safe-area-inset-bottom))', boxShadow: '0 -12px 40px rgba(0,0,0,.35)' } },
        h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 } },
          h('p', { style: { margin: 0, fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: '.07em', color: color } }, '⏳ REST'),
          h('span', { style: { fontFamily: "'Syne',sans-serif", fontSize: 40, fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1, animation: left <= 5 ? 'pulse 1s infinite' : 'none' } }, left + 's')),
        h('div', { style: { height: 7, background: 'var(--card-bg-2)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 } },
          h('div', { style: { width: pct * 100 + '%', height: '100%', background: color, borderRadius: 4, transition: 'width 1s linear' } })),
        h('div', { style: { display: 'flex', gap: 8 } },
          h('button', { className: 'flt-press', onClick: () => setLeft(l => l + 15), style: { flex: 1, padding: '11px 0', background: 'var(--card-bg-2)', border: '1px solid var(--card-border-2)', color: 'var(--text-primary)', borderRadius: 11, fontSize: 13, fontWeight: 700, cursor: 'pointer' } }, '+15s'),
          h('button', { className: 'flt-press', onClick: onDone, style: { flex: 2, padding: '11px 0', background: color, border: 'none', color: 'var(--ink-on-accent)', borderRadius: 11, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Syne',sans-serif", letterSpacing: '.04em' } }, 'GO — NEXT SET →'))));
  }

  function StrengthLogger({ date, pair, onDone }) {
    const pool = STRENGTH_POOL[pair.id] || [];
    const seed = date.split('-').reduce((a, c) => a * 100 + parseInt(c), 0);
    const dayPicks = useMemo(() => seededShuffle(pool, seed).slice(0, 8), [pair.id, date]);

    const [histStore, setHistStore] = useState(null);  // ml:train:strengthlog contents
    const [exList, setExList] = useState(dayPicks);
    const [rows, setRows] = useState({});               // { exId: [{w, r, done, pr}] }
    const [openEx, setOpenEx] = useState(null);
    const [rest, setRest] = useState(null);             // seconds when timer active
    const [showAdd, setShowAdd] = useState(false);
    const [summary, setSummary] = useState(null);
    const startRef = useRef(Date.now());

    // Load history once; initialize set rows from last session (ghost prefill) or targets
    useEffect(() => {
      let live = true;
      DB.get(LOG_KEY).then(store => {
        if (!live) return;
        const s = store || {};
        setHistStore(s);
        const init = {};
        dayPicks.forEach(ex => {
          const last = s[ex.id];
          const tgt = parseTarget(ex.sets);
          init[ex.id] = last && last.sets && last.sets.length
            ? last.sets.map(ls => ({ w: ls.w || 0, r: ls.r || tgt.reps, done: false, pr: false }))
            : Array.from({ length: tgt.sets }, () => ({ w: 0, r: tgt.reps, done: false, pr: false }));
        });
        setRows(init);
      });
      return () => { live = false; };
    }, []);

    const upd = (exId, i, patch) => setRows(p => ({ ...p, [exId]: p[exId].map((s, j) => j === i ? { ...s, ...patch } : s) }));

    const completeSet = (ex, i) => {
      const set = rows[ex.id][i];
      if (set.done) { upd(ex.id, i, { done: false, pr: false }); return; }
      const hist = (histStore || {})[ex.id] || {};
      const isPR = set.w > 0 ? set.w > (hist.maxW || 0) : set.r > (hist.maxR || 0) && (hist.maxR || 0) > 0;
      upd(ex.id, i, { done: true, pr: isPR });
      setRest({ id: Date.now(), s: 60 });
      try { navigator.vibrate && navigator.vibrate(30); } catch (e) {}
    };

    const addSet = ex => setRows(p => {
      const cur = p[ex.id] || [];
      const lastSet = cur[cur.length - 1] || { w: 0, r: 10 };
      return { ...p, [ex.id]: [...cur, { w: lastSet.w, r: lastSet.r, done: false, pr: false }] };
    });

    const addExercise = ex => {
      setExList(l => [...l, ex]);
      const last = (histStore || {})[ex.id];
      const tgt = parseTarget(ex.sets);
      setRows(p => ({ ...p, [ex.id]: last && last.sets && last.sets.length
        ? last.sets.map(ls => ({ w: ls.w || 0, r: ls.r || tgt.reps, done: false, pr: false }))
        : Array.from({ length: tgt.sets }, () => ({ w: 0, r: tgt.reps, done: false, pr: false })) }));
      setShowAdd(false);
      setOpenEx(ex.id);
    };

    // Live totals
    const doneSets = exList.reduce((a, ex) => a + (rows[ex.id] || []).filter(s => s.done).length, 0);
    const volume = exList.reduce((a, ex) => a + (rows[ex.id] || []).filter(s => s.done).reduce((v, s) => v + (s.w || 0) * (s.r || 0), 0), 0);
    const prs = exList.filter(ex => (rows[ex.id] || []).some(s => s.done && s.pr));
    const exercisesDone = exList.filter(ex => (rows[ex.id] || []).some(s => s.done)).length;
    const elapsedMin = Math.max(1, Math.round((Date.now() - startRef.current) / 60000));

    const finish = async () => {
      const store = { ...(histStore || {}) };
      exList.forEach(ex => {
        const done = (rows[ex.id] || []).filter(s => s.done);
        if (!done.length) return;
        const prev = store[ex.id] || {};
        store[ex.id] = {
          date,
          sets: done.map(s => ({ w: s.w || 0, r: s.r || 0 })),
          maxW: Math.max(prev.maxW || 0, ...done.map(s => s.w || 0)),
          maxR: Math.max(prev.maxR || 0, ...done.filter(s => !s.w).map(s => s.r || 0), 0)
        };
      });
      await DB.set(LOG_KEY, store);
      const sum = { exercises: exercisesDone, sets: doneSets, volume: Math.round(volume), durationMin: elapsedMin, prs: prs.map(p => p.name) };
      setSummary(sum);
      onDone && onDone(sum);
    };

    // ── Finished: summary card ──
    if (summary) {
      const grad = (window.__mlCards && window.__mlCards.gradFor) ? window.__mlCards.gradFor(pair.name) : pair.color;
      return h('div', { className: 'flt-card', style: { position: 'relative', borderRadius: 20, overflow: 'hidden', background: grad, boxShadow: '0 10px 28px -12px rgba(0,0,0,.45)', padding: '22px 18px' } },
        h('div', { style: { position: 'absolute', inset: 0, background: 'linear-gradient(transparent, rgba(0,0,0,.5))' } }),
        h('div', { style: { position: 'relative' } },
          h('p', { style: { margin: '0 0 2px', fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: '.08em', color: 'rgba(255,255,255,.85)' } }, 'SESSION COMPLETE ✓'),
          h('p', { style: { margin: '0 0 14px', fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: '#fff' } }, pair.name),
          h('div', { style: { display: 'flex', gap: 18, flexWrap: 'wrap' } },
            [['Exercises', summary.exercises], ['Sets', summary.sets], ['Volume', summary.volume.toLocaleString() + ' lb'], ['Time', summary.durationMin + ' min']].map(([l, v]) =>
              h('div', { key: l },
                h('p', { style: { margin: 0, fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: '#fff' } }, v),
                h('p', { style: { margin: 0, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.75)', textTransform: 'uppercase', letterSpacing: '.05em' } }, l)))),
          summary.prs.length > 0 && h('p', { style: { margin: '14px 0 0', fontSize: 13, fontWeight: 800, color: '#fff', background: 'rgba(0,0,0,.3)', borderRadius: 10, padding: '8px 12px' } }, '✨ New PR' + (summary.prs.length > 1 ? 's' : '') + ': ' + summary.prs.join(', '))));
    }

    if (!histStore || !Object.keys(rows).length) return h('p', { style: { color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: '24px 0' } }, 'Loading your numbers…');

    const remainingPool = pool.filter(p => !exList.some(e => e.id === p.id));

    return h('div', null,
      // Sticky live header
      h('div', { className: 'flt-glass', style: { position: 'sticky', top: 0, zIndex: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 2px', marginBottom: 10, borderBottom: '1px solid var(--card-border)' } },
        h('div', null,
          h('p', { style: { margin: 0, fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, color: pair.color } }, pair.name),
          h('p', { style: { margin: 0, fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600 } }, elapsedMin + ' min · ' + doneSets + ' sets · ' + Math.round(volume).toLocaleString() + ' lb volume' + (prs.length ? ' · ✨' + prs.length + ' PR' : ''))),
        h('button', {
          className: 'flt-press', onClick: finish, disabled: doneSets === 0,
          style: { padding: '10px 16px', background: doneSets ? pair.color : 'var(--card-bg-2)', color: doneSets ? 'var(--ink-on-accent)' : 'var(--text-muted)', border: 'none', borderRadius: 11, fontSize: 12, fontWeight: 800, cursor: doneSets ? 'pointer' : 'default', fontFamily: "'Syne',sans-serif", letterSpacing: '.03em' }
        }, 'FINISH ✓')),

      // Exercise cards
      exList.map(ex => {
        const exRows = rows[ex.id] || [];
        const doneCt = exRows.filter(s => s.done).length;
        const allDone = doneCt === exRows.length && exRows.length > 0;
        const open = openEx === ex.id;
        const last = histStore[ex.id];
        const ec = EQUIP_COLORS[ex.equip] || 'var(--text-secondary)';
        return h('div', { key: ex.id, style: { marginBottom: 8, borderRadius: 14, overflow: 'hidden', background: allDone ? 'rgba(74,222,128,.05)' : 'var(--card-bg)', border: `1px solid ${allDone ? 'rgba(74,222,128,.22)' : open ? pair.color + '44' : 'var(--card-border)'}`, transition: 'border-color .2s' } },
          // Header row
          h('div', { className: 'flt-press', onClick: () => setOpenEx(open ? null : ex.id), style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 13px', cursor: 'pointer' } },
            h('div', { style: { width: 34, height: 34, minHeight: 34, borderRadius: 10, background: allDone ? 'var(--color-success)' : ec + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: allDone ? 15 : 13, fontWeight: 800, color: allDone ? 'var(--ink-on-accent)' : ec, flexShrink: 0, fontFamily: "'Syne',sans-serif" } }, allDone ? '✓' : doneCt + '/' + exRows.length),
            h('div', { style: { flex: 1, minWidth: 0 } },
              h('p', { style: { margin: 0, fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' } }, ex.name, exRows.some(s => s.pr) ? ' ✨' : ''),
              h('p', { style: { margin: '1px 0 0', fontSize: 10.5, color: 'var(--text-muted)' } },
                last ? 'Last: ' + fmtSets(last.sets) + (last.maxW ? ' · best ' + last.maxW + ' lb' : '') : 'First time — set your baseline')),
            h('span', { style: { color: 'var(--text-muted)', fontSize: 11 } }, open ? '▲' : '▼')),

          // Set rows
          open && h('div', { style: { padding: '0 13px 12px' } },
            h('div', { style: { display: 'flex', gap: 8, padding: '0 0 5px 2px' } },
              h('span', { style: { width: 30, fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' } }, 'Set'),
              h('span', { style: { flex: 1, fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' } }, 'Weight (lb)'),
              h('span', { style: { flex: 1, fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' } }, 'Reps'),
              h('span', { style: { width: 44 } })),
            exRows.map((s, i) => h('div', { key: i, style: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 } },
              h('span', { style: { width: 30, fontSize: 12, fontWeight: 800, color: s.done ? 'var(--color-success)' : 'var(--text-muted)', fontFamily: "'Syne',sans-serif" } }, s.pr ? '✨' : i + 1),
              h('input', { type: 'number', inputMode: 'decimal', value: s.w || '', placeholder: '—', disabled: s.done,
                onChange: ev => upd(ex.id, i, { w: parseFloat(ev.target.value) || 0 }),
                style: { flex: 1, minWidth: 0, background: s.done ? 'transparent' : 'var(--card-bg-2)', border: '1px solid ' + (s.done ? 'transparent' : 'var(--card-border-2)'), borderRadius: 9, padding: '9px 10px', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', outline: 'none', textAlign: 'center', opacity: s.done ? .65 : 1 } }),
              h('input', { type: 'number', inputMode: 'numeric', value: s.r || '', placeholder: '—', disabled: s.done,
                onChange: ev => upd(ex.id, i, { r: parseInt(ev.target.value) || 0 }),
                style: { flex: 1, minWidth: 0, background: s.done ? 'transparent' : 'var(--card-bg-2)', border: '1px solid ' + (s.done ? 'transparent' : 'var(--card-border-2)'), borderRadius: 9, padding: '9px 10px', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', outline: 'none', textAlign: 'center', opacity: s.done ? .65 : 1 } }),
              h('button', { className: 'flt-press', onClick: () => completeSet(ex, i),
                style: { width: 44, height: 38, minHeight: 38, borderRadius: 10, border: s.done ? 'none' : '2px solid var(--border-strong)', background: s.done ? 'var(--color-success)' : 'transparent', color: s.done ? 'var(--ink-on-accent)' : 'var(--text-muted)', fontSize: 15, fontWeight: 800, cursor: 'pointer', flexShrink: 0 } }, '✓'))),
            h('div', { style: { display: 'flex', gap: 8, marginTop: 4 } },
              h('button', { className: 'flt-press', onClick: () => addSet(ex), style: { flex: 1, padding: '8px 0', background: 'transparent', border: '1px dashed var(--card-border-2)', borderRadius: 9, color: 'var(--text-secondary)', fontSize: 11, fontWeight: 700, cursor: 'pointer' } }, '+ Set'),
              ex.tip && h('button', { className: 'flt-press', onClick: () => alert(ex.name + '\n\n' + ex.tip), style: { padding: '8px 14px', background: 'transparent', border: '1px dashed var(--card-border-2)', borderRadius: 9, color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer' } }, 'how to'))));
      }),

      // Add exercise
      remainingPool.length > 0 && h('button', { className: 'flt-press', onClick: () => setShowAdd(!showAdd), style: { width: '100%', padding: '12px 0', background: 'var(--card-bg)', border: `2px dashed ${pair.color}45`, borderRadius: 13, color: pair.color, fontSize: 12, fontWeight: 700, cursor: 'pointer', marginBottom: 8 } }, showAdd ? 'Close' : '+ Add exercise'),
      showAdd && h('div', { className: 'flt-msg', style: { marginBottom: 8 } },
        remainingPool.map(ex => h('button', { key: ex.id, className: 'flt-press', onClick: () => addExercise(ex),
          style: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 13px', marginBottom: 5, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 11, cursor: 'pointer' } },
          h('span', { style: { fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'left' } }, ex.name),
          h('span', { style: { fontSize: 10, color: EQUIP_COLORS[ex.equip] || 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' } }, ex.equip)))),

      // Rest timer — keyed per activation so each completed set restarts the countdown
      rest && h(RestTimer, { key: rest.id, seconds: rest.s, color: pair.color, onDone: () => setRest(null) }));
  }

  window.StrengthLogger = StrengthLogger;

  // ───────────────────────────────────────────────────────────────────────────
  // MOBILITY FLOW — guided one-at-a-time stretch session: big card per
  // exercise, auto hold-timer, tap to advance. Two minutes, thumb-only.
  // ───────────────────────────────────────────────────────────────────────────
  function MobilityFlow({ exercises, checked, onCheck, zoneColors, onClose }) {
    const order = useMemo(() => {
      const todo = exercises.filter(e => !checked[e.id]);
      const done = exercises.filter(e => checked[e.id]);
      return [...todo, ...done];
    }, []);
    const [idx, setIdx] = useState(0);
    const [left, setLeft] = useState(30);
    const [running, setRunning] = useState(true);
    const [finished, setFinished] = useState(false);
    const ex = order[idx];
    const zc = ex ? (zoneColors[ex.zone] || 'var(--color-accent-purple)') : 'var(--color-accent-purple)';

    useEffect(() => { setLeft(30); setRunning(true); }, [idx]);
    useEffect(() => {
      if (!running || left <= 0 || finished) return;
      const t = setTimeout(() => setLeft(l => l - 1), 1000);
      return () => clearTimeout(t);
    }, [left, running, finished]);
    useEffect(() => {
      if (left === 0) { try { navigator.vibrate && navigator.vibrate(80); } catch (e) {} }
    }, [left]);

    const next = markDone => {
      if (markDone && ex) onCheck(ex.id);
      if (idx + 1 >= order.length) setFinished(true);
      else setIdx(idx + 1);
    };

    const doneCount = exercises.filter(e => checked[e.id]).length;

    return h('div', { className: 'flt-overlay', style: { position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 320, display: 'flex', flexDirection: 'column', maxWidth: 490, margin: '0 auto' } },
      // Header + progress dots
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 10px' } },
        h('div', { style: { display: 'flex', gap: 5 } },
          order.map((o, i) => h('div', { key: o.id, style: { width: i === idx && !finished ? 20 : 7, height: 7, borderRadius: 4, background: checked[o.id] || (finished) ? 'var(--color-success)' : i === idx ? zc : 'var(--card-bg-4)', transition: 'all .25s' } }))),
        h('button', { className: 'flt-press', onClick: onClose, style: { width: 38, height: 38, minHeight: 38, borderRadius: '50%', border: '1px solid var(--card-border-2)', background: 'var(--card-bg-2)', color: 'var(--text-secondary)', fontSize: 17, cursor: 'pointer' } }, '×')),

      finished || !ex
        ? // Celebration
          h('div', { className: 'flt-card', style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '0 30px', textAlign: 'center' } },
            h('p', { style: { fontSize: 56, margin: 0 } }, '🧘'),
            h('p', { style: { margin: 0, fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: 'var(--text-heading)' } }, 'Loose and limber'),
            h('p', { style: { margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 } }, doneCount + ' of ' + exercises.length + ' done today — your joints thank you.'),
            h('button', { className: 'flt-press', onClick: onClose, style: { marginTop: 14, padding: '13px 36px', background: 'var(--color-accent-purple)', border: 'none', borderRadius: 13, color: 'var(--ink-on-accent)', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Syne',sans-serif", letterSpacing: '.04em' } }, 'DONE ✓'))
        : // Active exercise
          h(React.Fragment, null,
            h('div', { key: ex.id, className: 'flt-card', style: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px' } },
              h('div', { style: { position: 'relative', borderRadius: 24, overflow: 'hidden', background: `radial-gradient(120% 110% at 18% 8%, rgba(255,255,255,.14), transparent 55%), linear-gradient(150deg, ${zc}, ${zc}99)`, padding: '34px 22px', boxShadow: `0 18px 44px -16px ${zc}88` } },
                h('p', { style: { margin: '0 0 4px', fontSize: 10.5, fontWeight: 800, letterSpacing: '.1em', color: 'rgba(255,255,255,.8)', textTransform: 'uppercase', fontFamily: "'Syne',sans-serif" } }, (ex.zone || 'full') + ' · ' + (idx + 1) + ' of ' + order.length + (checked[ex.id] ? ' · done ✓' : '')),
                h('p', { style: { margin: '0 0 6px', fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1.15 } }, ex.name),
                h('p', { style: { margin: 0, fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,.92)' } }, ex.reps || ''),
                ex.tip && h('p', { style: { margin: '14px 0 0', fontSize: 12.5, color: 'rgba(255,255,255,.85)', lineHeight: 1.6, background: 'rgba(0,0,0,.22)', borderRadius: 10, padding: '10px 12px' } }, ex.tip)),
              // Timer
              h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 22 } },
                h('button', { className: 'flt-press', onClick: () => setRunning(r => !r), style: { width: 44, height: 44, minHeight: 44, borderRadius: '50%', border: '1px solid var(--card-border-2)', background: 'var(--card-bg-2)', fontSize: 15, cursor: 'pointer' } }, running ? '⏸' : '▶'),
                h('span', { style: { fontFamily: "'Syne',sans-serif", fontSize: 44, fontWeight: 800, color: left === 0 ? 'var(--color-success)' : 'var(--text-heading)', minWidth: 92, textAlign: 'center', animation: left > 0 && left <= 5 ? 'pulse 1s infinite' : 'none' } }, left === 0 ? '✓' : left + 's'),
                h('button', { className: 'flt-press', onClick: () => setLeft(30), style: { width: 44, height: 44, minHeight: 44, borderRadius: '50%', border: '1px solid var(--card-border-2)', background: 'var(--card-bg-2)', fontSize: 14, cursor: 'pointer' } }, '↻'))),
            // Bottom actions
            h('div', { style: { display: 'flex', gap: 9, padding: '0 22px calc(22px + env(safe-area-inset-bottom))' } },
              h('button', { className: 'flt-press', onClick: () => next(false), style: { flex: 1, padding: '15px 0', background: 'transparent', border: '1px solid var(--card-border-2)', borderRadius: 14, color: 'var(--text-secondary)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' } }, 'Skip'),
              h('button', { className: 'flt-press', onClick: () => next(true), style: { flex: 2.4, padding: '15px 0', background: zc, border: 'none', borderRadius: 14, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "'Syne',sans-serif", letterSpacing: '.04em', boxShadow: `0 8px 22px -8px ${zc}` } }, 'DONE — NEXT →'))));
  }

  window.MobilityFlow = MobilityFlow;
})();
