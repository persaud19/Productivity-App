// Corevado — MealBuilder
// Conversational meal creation: a chat that walks back and forth with the user
// (text, voice, photo, or pasted recipe text) until it has a COMPLETE library
// meal — name, category, macros, ingredients, steps — then saves it.
// Used from the Week planner ("Create new meal") and shares the studio card
// visual language with FoodLogThread via window.__mlCards.
(function () {
  'use strict';
  const { CL } = window.__ml;
  const { useState, useRef, useEffect } = React;
  const h = React.createElement;
  const cards = window.__mlCards || {};
  const gradFor = cards.gradFor || (() => 'var(--card-bg-2)');
  const emojiFor = cards.emojiFor || (() => '🍽️');
  const TypingDots = cards.TypingDots || (() => h('span', null, '…'));
  const compressImage = cards.compressImage;
  const rich = cards.rich || (t => t);

  const parseJson = (reply, action) => {
    try {
      let s = String(reply || '').trim();
      const wrapped = s.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (wrapped) s = wrapped[1].trim();
      if (s.startsWith('{')) { const p = JSON.parse(s); if (p && p.action === action) return p; }
    } catch (e) {}
    return null;
  };

  function MealBuilder({ onSave, onClose, userName, slotHint, allMeals = [] }) {
    const slotLabel = slotHint ? (CL[slotHint] || '').toLowerCase() : '';
    const [msgs, setMsgs] = useState([{
      role: 'assistant',
      content: `Let's build a new meal${slotLabel ? ' for ' + slotLabel : ''} 👨‍🍳 Describe it, snap a photo, or paste a recipe from anywhere — I'll ask about anything I can't figure out.`
    }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const [draft, setDraft] = useState(null); // completed save_meal JSON
    const [saving, setSaving] = useState(false);
    const [pasteOpen, setPasteOpen] = useState(false);
    const [pasteText, setPasteText] = useState('');
    const endRef = useRef(null);
    const photoRef = useRef(null);
    const msgsRef = useRef(msgs);
    msgsRef.current = msgs;

    useEffect(() => { endRef.current && endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, loading, draft]);

    const systemPrompt = () => `You are a recipe builder helping ${userName || 'the user'} add a new meal to their food library${slotLabel ? ` (intended for the ${slotLabel} slot)` : ''}.
Goal: assemble a COMPLETE meal through a short, friendly back-and-forth. You need: name, category, per-serving macros, ingredients with quantities, and brief cooking steps (cooked meals only — a shake or snack plate needs none).
EXISTING LIBRARY (don't duplicate — if the user describes one of these, tell them it already exists): ${allMeals.slice(0, 40).map(m => m.name).join('; ')}

Rules:
- Ask ONE question at a time, and at most ~4 questions total — estimate the rest confidently.
- If the user pastes recipe text or sends a photo, extract everything and only ask about real gaps.
- When you have enough, respond with ONLY this JSON (no fences, no other text):
{"action":"save_meal","name":"Breakfast Shake","emoji":"🥤","cat":["B","S"],"cal":420,"prot":38,"carbs":45,"fat":9,"prep":5,"cook":0,"cad":2.50,"tags":["quick","high-protein"],"ing":["1 scoop whey protein","1 banana","1 cup milk","1 tbsp peanut butter"],"steps":["Add everything to a blender.","Blend 45 seconds until smooth."],"portionDesc":"1 large glass"}
- cat: array from "B" (breakfast), "L" (lunch), "D" (dinner), "S" (snack). steps: [] for no-cook meals. cad = estimated cost per serving in CAD. emoji: single food emoji for the dish.
- Plain-text replies: 1–2 sentences, warm and brief.`;

    const callAI = async (apiMsgs, model) => {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 30000);
      const res = await fetch('/api/claude', {
        method: 'POST',
        body: JSON.stringify({ model: model || 'claude-haiku-4-5-20251001', max_tokens: 700, system: systemPrompt(), messages: apiMsgs }),
        signal: controller.signal
      });
      clearTimeout(tid);
      const data = await res.json();
      return (data.content && data.content[0] && data.content[0].text) || '';
    };

    const toApiMsgs = list => list.slice(-14).map(m => {
      if (m._imageB64) return { role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: m._imageB64 } }, { type: 'text', text: m.content || 'Here is the recipe / meal photo.' }] };
      return { role: m.role, content: m.content };
    });

    const runTurn = async (next, model) => {
      setMsgs(next);
      setLoading(true);
      try {
        const reply = await callAI(toApiMsgs(next), model);
        const parsed = parseJson(reply, 'save_meal');
        if (parsed) {
          setDraft(parsed);
          setMsgs([...msgsRef.current, { role: 'assistant', content: `Here's **${parsed.name}** — check it over and save, or keep tweaking.` }]);
        } else {
          setMsgs([...msgsRef.current, { role: 'assistant', content: reply }]);
        }
      } catch (e) {
        setMsgs([...msgsRef.current, { role: 'assistant', content: e.name === 'AbortError' ? 'Timed out — try again in a moment.' : "Couldn't reach the kitchen 🧑‍🍳 — check your connection and try again." }]);
      }
      setLoading(false);
    };

    const send = text => {
      if (!text.trim() || loading) return;
      setInput('');
      setDraft(null);
      runTurn([...msgs, { role: 'user', content: text.trim() }]);
    };

    const handlePhoto = async file => {
      if (!file || loading || !compressImage) return;
      setLoading(true);
      setDraft(null);
      try {
        const b64 = await compressImage(file);
        setLoading(false);
        runTurn([...msgsRef.current, { role: 'user', content: '📷 Recipe / meal photo', _imageB64: b64 }], 'claude-sonnet-4-6');
      } catch (e) {
        setLoading(false);
        setMsgs([...msgsRef.current, { role: 'assistant', content: "Couldn't read that photo — try again or describe the meal." }]);
      }
    };

    const submitPaste = () => {
      if (!pasteText.trim()) return;
      setPasteOpen(false);
      const t = pasteText.trim();
      setPasteText('');
      setDraft(null);
      runTurn([...msgs, { role: 'user', content: 'Here is the recipe text I found:\n\n' + t.slice(0, 4000) }]);
    };

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

    const confirmSave = async () => {
      if (!draft || saving) return;
      setSaving(true);
      const meal = {
        id: `c${Date.now()}`,
        source: 'ai-builder',
        name: draft.name,
        emoji: draft.emoji || '',
        cat: Array.isArray(draft.cat) ? draft.cat : [draft.cat || slotHint || 'D'],
        cal: draft.cal || 0, prot: draft.prot || 0, carbs: draft.carbs || 0, fat: draft.fat || 0,
        prep: draft.prep || 0, cook: draft.cook || 0, cad: draft.cad || 0,
        tags: draft.tags || [], ing: draft.ing || [], steps: draft.steps || [],
        portionDesc: draft.portionDesc || ''
      };
      await onSave(meal);
    };

    const iconBtn = extra => ({
      width: 40, height: 40, minHeight: 40, borderRadius: '50%', border: '1px solid var(--card-border-2)',
      background: 'var(--card-bg-2)', fontSize: 16, cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0
    , ...extra });

    return h('div', { className: 'flt-overlay', style: { position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 260, display: 'flex', flexDirection: 'column' } },
      // header
      h('div', { className: 'flt-glass', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 10px', borderBottom: '1px solid var(--card-border)' } },
        h('div', null,
          h('p', { style: { margin: 0, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: 'var(--text-heading)' } }, 'New Meal'),
          h('p', { style: { margin: 0, fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600 } }, slotLabel ? `For ${slotLabel} — saves to your Library` : 'Saves to your Library')),
        h('button', { className: 'flt-press', onClick: onClose, style: iconBtn({ fontSize: 18 }) }, '×')
      ),
      // thread
      h('div', { className: 'flt-thread', style: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: '14px 16px' } },
        msgs.map((m, i) => {
          const isUser = m.role === 'user';
          return h('div', { key: i, className: 'flt-msg', style: { display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' } },
            h('div', {
              style: {
                maxWidth: '86%', padding: '11px 15px',
                borderRadius: isUser ? '16px 16px 5px 16px' : '16px 16px 16px 5px',
                background: isUser ? 'linear-gradient(135deg, var(--color-success), #22c55e)' : 'var(--card-bg-2)',
                border: isUser ? 'none' : '1px solid var(--card-border)',
                color: isUser ? '#fff' : 'var(--text-primary)',
                fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                boxShadow: isUser ? '0 4px 14px -6px rgba(34,197,94,.5)' : 'none'
              }
            }, rich(m.content)));
        }),
        loading && h(TypingDots),
        // draft preview — studio card + save
        draft && h('div', { className: 'flt-card', style: { padding: '2px 4px' } },
          h('div', { style: { position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '16/10', background: gradFor(draft.name), boxShadow: '0 10px 28px -12px rgba(0,0,0,.45)' } },
            h('div', { style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, paddingBottom: 34, filter: 'drop-shadow(0 10px 16px rgba(0,0,0,.28))' } }, draft.emoji || emojiFor(draft)),
            h('div', { style: { position: 'absolute', top: 10, left: 10, fontSize: 10, fontWeight: 800, color: '#fff', background: 'rgba(0,0,0,.32)', backdropFilter: 'blur(6px)', padding: '4px 9px', borderRadius: 20, fontFamily: "'Syne',sans-serif", textTransform: 'uppercase', letterSpacing: '.05em' } },
              (Array.isArray(draft.cat) ? draft.cat : [draft.cat]).map(c => CL[c] || c).join(' · ')),
            h('div', { style: { position: 'absolute', top: 10, right: 10, fontSize: 11, fontWeight: 800, color: '#1a1a1a', background: 'rgba(255,255,255,.85)', padding: '4px 10px', borderRadius: 20, fontFamily: "'Syne',sans-serif" } }, (draft.cal || 0) + ' cal'),
            h('div', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: '26px 14px 12px', background: 'linear-gradient(transparent, rgba(0,0,0,.62))' } },
              h('p', { style: { margin: 0, color: '#fff', fontWeight: 700, fontSize: 15 } }, draft.name),
              h('p', { style: { margin: '3px 0 0', color: 'rgba(255,255,255,.85)', fontSize: 11, fontWeight: 600 } },
                `${draft.prot || 0}g P · ${draft.carbs || 0}g C · ${draft.fat || 0}g F · ${(draft.ing || []).length} ingredients${(draft.steps || []).length ? ' · ' + draft.steps.length + ' steps' : ''}`))
          ),
          h('div', { style: { display: 'flex', gap: 8, marginTop: 10 } },
            h('button', {
              className: 'flt-press', onClick: confirmSave, disabled: saving,
              style: { flex: 2, padding: '13px 0', background: 'var(--color-success)', color: 'var(--ink-on-accent)', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Syne',sans-serif", letterSpacing: '.04em' }
            }, saving ? 'SAVING…' : 'SAVE TO LIBRARY ✓'),
            h('button', {
              className: 'flt-press', onClick: () => setDraft(null),
              style: { flex: 1, padding: '13px 0', background: 'transparent', border: '1px solid var(--card-border-2)', color: 'var(--text-secondary)', borderRadius: 12, fontSize: 12, cursor: 'pointer' }
            }, 'Keep editing'))
        ),
        h('div', { ref: endRef })
      ),
      // composer
      h('div', { className: 'flt-glass', style: { display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px calc(12px + env(safe-area-inset-bottom))', borderTop: '1px solid var(--card-border)' } },
        h('input', { ref: photoRef, type: 'file', accept: 'image/*', style: { display: 'none' }, onChange: ev => { const f = ev.target.files && ev.target.files[0]; if (f) handlePhoto(f); ev.target.value = ''; } }),
        h('button', { className: 'flt-press', onClick: () => photoRef.current && photoRef.current.click(), disabled: loading, title: 'Photo', style: iconBtn() }, '📷'),
        h('button', { className: 'flt-press', onClick: () => setPasteOpen(true), title: 'Paste recipe text', style: iconBtn() }, '📋'),
        h('input', {
          type: 'text', value: input, placeholder: listening ? 'Listening…' : 'Describe the meal…',
          onChange: ev => setInput(ev.target.value),
          onKeyDown: ev => { if (ev.key === 'Enter') send(input); },
          style: { flex: 1, minWidth: 0, background: 'var(--card-bg-2)', border: '1px solid ' + (listening ? 'var(--color-success)' : 'var(--card-border-2)'), borderRadius: 22, padding: '11px 16px', fontSize: 15, color: 'var(--text-primary)', outline: 'none', fontFamily: "'DM Sans',sans-serif" }
        }),
        input.trim()
          ? h('button', { className: 'flt-press', onClick: () => send(input), disabled: loading, style: iconBtn({ background: 'var(--color-success)', border: 'none', color: 'var(--ink-on-accent)', fontWeight: 800 }) }, '↑')
          : h('button', { className: 'flt-press', onClick: startVoice, disabled: loading, title: 'Voice', style: iconBtn() }, '🎙️')
      ),
      // paste sheet
      pasteOpen && h('div', { className: 'flt-overlay', style: { position: 'fixed', inset: 0, background: 'var(--overlay)', zIndex: 270, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }, onClick: () => setPasteOpen(false) },
        h('div', { onClick: ev => ev.stopPropagation(), style: { background: 'var(--bg-modal)', borderRadius: '22px 22px 0 0', padding: '16px 16px calc(16px + env(safe-area-inset-bottom))' } },
          h('div', { style: { width: 38, height: 4, borderRadius: 2, background: 'var(--border-strong)', margin: '0 auto 12px' } }),
          h('p', { style: { margin: '0 0 8px', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 } }, 'Paste anything — a recipe website’s text, an Instagram caption, an ingredient list. I’ll extract the meal from it.'),
          h('textarea', {
            value: pasteText, autoFocus: true, onChange: ev => setPasteText(ev.target.value),
            placeholder: 'Paste recipe text here…',
            style: { width: '100%', minHeight: 140, boxSizing: 'border-box', background: 'var(--card-bg-2)', border: '1px solid var(--card-border-2)', borderRadius: 12, padding: '11px 14px', fontSize: 14, color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }
          }),
          h('button', {
            className: 'flt-press', onClick: submitPaste, disabled: !pasteText.trim(),
            style: { width: '100%', marginTop: 10, padding: '13px 0', background: pasteText.trim() ? 'var(--color-success)' : 'var(--card-bg-2)', color: pasteText.trim() ? 'var(--ink-on-accent)' : 'var(--text-muted)', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Syne',sans-serif" }
          }, 'EXTRACT MEAL →')
        )
      )
    );
  }

  window.MealBuilder = MealBuilder;
})();
