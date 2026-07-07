// Corevado — VoiceCheckin
// Voice-first Morning/Evening capture: talk your check-in off the day's prompt,
// AI parses the transcript into the structured form fields, you confirm and save.
// Rendered by personal-tab above the Morning/Evening forms.
(function () {
  'use strict';
  const { useState, useRef, useEffect } = React;
  const h = React.createElement;
  const cards = window.__mlCards || {};
  const rich = cards.rich || (t => t);

  const FIELD_SPECS = {
    morning: {
      color: 'var(--color-primary)',
      glow: 'rgba(244,168,35,.45)',
      hint: 'e.g. “Weighed one ninety two, up at six forty five, slept pretty good, feeling locked in. Today I want to stay patient with the kids…”',
      labels: { weight: 'Weight', wakeTime: 'Wake time', sleep: 'Sleep', showingUp: 'Showing up', intention: 'Intention', reflection: 'Reflection', exceptionalDay: 'Exceptional day' },
      schema: `weight (number, lbs), wakeTime ("HH:MM" 24-hour), sleep (integer 1-5), showingUp (integer 1-5), intention (short phrase, their words), reflection (their answer to the reflection prompt — their words, lightly cleaned), exceptionalDay (boolean), exceptionalReason (string)`
    },
    evening: {
      color: 'var(--color-accent-blue)',
      glow: 'rgba(96,165,250,.45)',
      hint: 'e.g. “About nine thousand steps, six glasses of water, solid four out of five day. Big win was closing the report. Bed by ten thirty…”',
      labels: { steps: 'Steps', glasses: 'Water', dayRating: 'Day rating', win: 'Win', bedtime: 'Bedtime', reflection: 'Reflection', dailyMemory: 'Memory', exceptionalDay: 'Exceptional day' },
      schema: `steps (integer), glasses (integer 0-8, glasses of water), dayRating (integer 1-5), win (string, their words), bedtime ("HH:MM" 24-hour), reflection (their answer to the reflection prompt — their words, lightly cleaned), dailyMemory (a family or memorable moment they mention), exceptionalDay (boolean), exceptionalReason (string)`
    }
  };

  function VoiceCheckin({ mode, promptText, userName, onParsed }) {
    const spec = FIELD_SPECS[mode] || FIELD_SPECS.morning;
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interim, setInterim] = useState('');
    const [parsing, setParsing] = useState(false);
    const [filled, setFilled] = useState(null);   // { keys: [], note: "" }
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const recRef = useRef(null);
    const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

    useEffect(() => () => { try { recRef.current && recRef.current.stop(); } catch (e) {} }, []);

    const toggleMic = () => {
      if (listening) { try { recRef.current && recRef.current.stop(); } catch (e) {} return; }
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return;
      const r = new SR();
      r.continuous = true;
      r.interimResults = true;
      r.lang = 'en-CA';
      r.onstart = () => { setListening(true); setError(''); setFilled(null); };
      r.onresult = ev => {
        let fin = '', tmp = '';
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          if (ev.results[i].isFinal) fin += ev.results[i][0].transcript + ' ';
          else tmp += ev.results[i][0].transcript;
        }
        if (fin) setTranscript(prev => (prev ? prev.trimEnd() + ' ' : '') + fin.trim());
        setInterim(tmp);
      };
      r.onend = () => { setListening(false); setInterim(''); };
      r.onerror = ev => { setListening(false); setInterim(''); if (ev.error !== 'aborted' && ev.error !== 'no-speech') setError('Mic error: ' + ev.error); };
      recRef.current = r;
      r.start();
    };

    const parse = async () => {
      const text = transcript.trim();
      if (!text || parsing) return;
      setParsing(true);
      setError('');
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 30000);
        const res = await fetch('/api/claude', {
          method: 'POST',
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 500,
            system: `You parse ${userName || 'the user'}'s spoken ${mode} check-in into structured fields. Today's reflection prompt shown to them was: "${promptText || ''}"

Return ONLY valid JSON, no fences: {"fields":{...},"note":"one warm sentence acknowledging what they shared"}
Allowed fields (include ONLY what they actually said — never invent or guess): ${spec.schema}

Rules:
- Spoken times → 24-hour "HH:MM": "six forty five" → "06:45", "ten thirty at night" → "22:30".
- Quality words → 1-5 scale: amazing/great=5, pretty good/good=4, okay/fine=3, rough/meh=2, terrible/awful=1.
- Spoken numbers → digits: "one ninety two" (weight context) → 192, "nine thousand" → 9000.
- If their words answer the reflection prompt, put that in "reflection" — keep their voice, only fix grammar.
- exceptionalDay: true only if they call the day exceptional/special/one-for-the-books.`,
            messages: [{ role: 'user', content: text }]
          }),
          signal: controller.signal
        });
        clearTimeout(tid);
        const data = await res.json();
        if (data.error) throw new Error(data.error.message || data.error.type);
        let s = (data.content && data.content[0] && data.content[0].text || '').trim();
        const wrapped = s.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (wrapped) s = wrapped[1].trim();
        const parsed = JSON.parse(s);
        const fields = parsed.fields || {};
        const keys = Object.keys(fields).filter(k => fields[k] !== null && fields[k] !== undefined && fields[k] !== '');
        if (!keys.length) { setError("I couldn't pick out any fields — try adding a bit more detail."); setParsing(false); return; }
        onParsed(fields);
        setFilled({ keys, note: parsed.note || 'Filled in — give it a quick look below.' });
      } catch (e) {
        setError(e.name === 'AbortError' ? 'Timed out — try again.' : 'Could not parse that: ' + (e.message || 'connection issue'));
      }
      setParsing(false);
    };

    const reset = () => { setTranscript(''); setInterim(''); setFilled(null); setError(''); };

    if (!supported && !open) return null;

    // Collapsed pill
    if (!open) {
      return h('button', {
        className: 'flt-press',
        onClick: () => setOpen(true),
        style: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: '13px 0', marginBottom: 13, background: 'var(--card-bg)', border: `1.5px dashed ${spec.color}55`, borderRadius: 13, color: spec.color, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Syne',sans-serif", letterSpacing: '.03em' }
      }, '🎙️ TALK YOUR CHECK-IN');
    }

    return h('div', { className: 'flt-msg', style: { background: 'var(--card-bg)', border: '1px solid var(--card-border-2)', borderRadius: 16, padding: '16px', marginBottom: 13 } },
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 } },
        h('p', { style: { margin: 0, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 12, color: spec.color, letterSpacing: '.05em' } }, '🎙️ VOICE CHECK-IN'),
        h('button', { onClick: () => { reset(); setOpen(false); }, style: { background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: 0 } }, '×')),

      // Mic button + live state
      h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 12 } },
        h('button', {
          className: 'flt-press', onClick: toggleMic, disabled: !supported,
          style: {
            width: 74, height: 74, minHeight: 74, borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: 28,
            background: listening ? spec.color : 'var(--card-bg-2)',
            boxShadow: listening ? `0 0 0 8px ${spec.glow.replace('.45', '.15')}, 0 8px 24px -6px ${spec.glow}` : 'none',
            animation: listening ? 'pulse 1.6s infinite' : 'none',
            transition: 'all .25s'
          }
        }, listening ? '⏹️' : '🎙️'),
        h('p', { style: { margin: 0, fontSize: 11, color: listening ? spec.color : 'var(--text-muted)', fontWeight: listening ? 700 : 400 } },
          listening ? 'Listening — tap to stop' : transcript ? 'Tap to add more' : 'Tap and just talk')),

      // Prompt they can answer
      promptText && !transcript && !listening && h('p', { style: { margin: '0 0 10px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55, textAlign: 'center', fontStyle: 'italic' } }, '“' + promptText + '”'),

      // Live transcript (editable once stopped)
      (transcript || interim) && h('div', { style: { marginBottom: 10 } },
        h('textarea', {
          value: transcript + (interim ? (transcript ? ' ' : '') + interim : ''),
          onChange: ev => { if (!listening) setTranscript(ev.target.value); },
          readOnly: listening,
          style: { width: '100%', minHeight: 76, boxSizing: 'border-box', background: 'var(--card-bg-2)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '11px 13px', fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontFamily: "'DM Sans',sans-serif" }
        })),

      !transcript && !listening && h('p', { style: { margin: '0 0 4px', fontSize: 10.5, color: 'var(--text-muted)', lineHeight: 1.5, textAlign: 'center' } }, spec.hint),

      // Result chips
      filled && h('div', { className: 'flt-msg', style: { marginBottom: 10 } },
        h('p', { style: { margin: '0 0 7px', fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.5 } }, rich(filled.note)),
        h('div', { style: { display: 'flex', gap: 5, flexWrap: 'wrap' } },
          filled.keys.map(k => h('span', { key: k, style: { fontSize: 10, fontWeight: 700, color: spec.color, background: 'var(--card-bg-2)', border: `1px solid ${spec.color}44`, borderRadius: 12, padding: '3px 9px' } }, '✓ ' + (spec.labels[k] || k))))),

      error && h('p', { style: { margin: '0 0 10px', fontSize: 11.5, color: 'var(--color-danger)', lineHeight: 1.5 } }, error),

      // Actions
      transcript && !listening && h('div', { style: { display: 'flex', gap: 8 } },
        h('button', {
          className: 'flt-press', onClick: parse, disabled: parsing,
          style: { flex: 2, padding: '12px 0', background: spec.color, color: 'var(--ink-on-accent)', border: 'none', borderRadius: 11, fontSize: 12.5, fontWeight: 800, cursor: 'pointer', fontFamily: "'Syne',sans-serif", letterSpacing: '.04em', opacity: parsing ? .6 : 1 }
        }, parsing ? 'READING IT…' : filled ? 'FILL AGAIN ✨' : 'FILL MY CHECK-IN ✨'),
        h('button', {
          className: 'flt-press', onClick: reset,
          style: { flex: 1, padding: '12px 0', background: 'transparent', border: '1px solid var(--card-border-2)', color: 'var(--text-secondary)', borderRadius: 11, fontSize: 12, cursor: 'pointer' }
        }, 'Clear')),

      filled && h('p', { style: { margin: '10px 0 0', fontSize: 10.5, color: 'var(--text-muted)', textAlign: 'center' } }, 'Review the form below, tweak anything, then save as usual.')
    );
  }

  window.VoiceCheckin = VoiceCheckin;
})();
