import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { answer, STARTERS } from './engine.js';
import { PROFILE, PROJECTS, JOBS, SITES, SKILLS } from './data.js';
import { asset, useClock, useTheme } from './util.js';

const HINTS = ['Ask me anything', 'Try “what’s your stack?”', 'Try “tell me about Zenium”', 'Try “/help”'];

/* ---------- inline **bold** + typewriter ---------- */
const parse = (s) => s.split('**').map((t, i) => ({ b: i % 2 === 1, t }));

function Type({ text, live, done, bump }) {
  const segs = useMemo(() => parse(text), [text]);
  const total = segs.reduce((n, s) => n + s.t.length, 0);
  const [k, setK] = useState(live ? 0 : total);
  const doneRef = useRef(done);
  useEffect(() => {
    if (!live) { setK(total); return; }
    let raf, t0;
    const step = (t) => {
      t0 ??= t;
      const c = Math.min(total, Math.floor((t - t0) * 0.14));
      setK(c); bump();
      if (c < total) raf = requestAnimationFrame(step); else doneRef.current?.();
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [live, total, bump]);
  let left = k;
  return (
    <p>
      {segs.map((s, i) => {
        const part = s.t.slice(0, Math.max(0, left)); left -= s.t.length;
        return s.b ? <strong key={i}>{part}</strong> : part;
      })}
    </p>
  );
}

/* ---------- rich blocks ---------- */
const jump = (e, href) => {
  if (!href.startsWith('#')) return;
  e.preventDefault();
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
};

function Copy({ value }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className="mini-btn" onClick={() => { navigator.clipboard?.writeText(value); setOk(true); setTimeout(() => setOk(false), 1600); }}>
      {ok ? 'Copied' : 'Copy'}
    </button>
  );
}

function Contact() {
  const time = useClock();
  return (
    <div className="card-c">
      <img src={asset('profile.jpg')} alt="" width="52" height="52" />
      <div>
        <b>{PROFILE.name}</b>
        <span>{PROFILE.title}, Accenture</span>
      </div>
      <dl>
        <dt>Email</dt><dd><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a> <Copy value={PROFILE.email} /></dd>
        <dt>Based in</dt><dd>{PROFILE.location} · {time}</dd>
        <dt>Resume</dt><dd><a href={asset(PROFILE.resume)} download>Download PDF</a></dd>
        <dt>Sites</dt><dd><a href="#shipped" onClick={(e) => jump(e, '#shipped')}>{SITES.length} live client sites</a></dd>
        {PROFILE.links.map((l) => (<Fragment key={l.label}><dt>{l.label}</dt><dd><a href={l.href} target="_blank" rel="noreferrer">{l.href.replace(/^https?:\/\//, '')}</a></dd></Fragment>))}
      </dl>
    </div>
  );
}

function Block({ b, live, done, bump }) {
  useEffect(() => {
    if (b.t === 'text') return;
    bump();
    const id = live ? setTimeout(done, 240) : 0;
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (b.t) {
    case 'text': return <Type text={b.v} live={live} done={done} bump={bump} />;
    case 'list': return <ul className="list">{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
    case 'stats': return <div className="stats">{b.items.map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}</div>;
    case 'go': return (
      <div className="go">{b.links.map((l) => (
        <a key={l.label} className="mini-btn" href={l.download ? asset(l.href) : l.href} download={l.download} onClick={(e) => jump(e, l.href)}>{l.label}</a>
      ))}</div>
    );
    case 'projects': return (
      <div className="mini-grid">{b.ids.map((id) => {
        const p = PROJECTS.find((x) => x.id === id);
        return (
          <a key={id} className="mini" href={p.url || '#projects'} target={p.url ? '_blank' : undefined} rel="noreferrer" onClick={(e) => !p.url && jump(e, '#projects')}>
            {p.img ? <img src={asset(p.img)} alt="" loading="lazy" /> : <div className="mini-flow">{p.flow.map((f) => <i key={f}>{f}</i>)}</div>}
            <b>{p.name}</b><span>{p.blurb}</span><em>{p.tags.join(', ')}</em>
          </a>
        );
      })}</div>
    );
    case 'sites': {
      const all = SITES.filter((s) => b.filter === 'all' || s.stack.toLowerCase() === b.filter || (b.filter === 'seo' && /SEO/.test(s.note)));
      return (
        <ul className="rows">{all.slice(0, b.limit).map((s) => (
          <li key={s.host}><a href={s.url} target="_blank" rel="noreferrer"><b>{s.host}</b><span>{s.note}</span></a></li>
        ))}
          {all.length > b.limit && <li><a href="#shipped" onClick={(e) => jump(e, '#shipped')}><b>+ {all.length - b.limit} more in the Sites section</b></a></li>}
        </ul>
      );
    }
    case 'timeline': return (
      <ol className="rows tl-mini">{b.ids.map((id) => {
        const j = JOBS.find((x) => x.id === id);
        return (
          <li key={id}><a href="#experience" onClick={(e) => jump(e, '#experience')}>
            <b>{j.co}</b><span>{j.role}</span><em>{j.when}</em></a></li>
        );
      })}</ol>
    );
    case 'skills': return (
      <div className="skills">{SKILLS.map((g) => (
        <div key={g.id}><b>{g.name}</b><ul>{g.tags.map((t) => <li key={t}>{t}</li>)}</ul></div>
      ))}</div>
    );
    case 'contact': return <Contact />;
    default: return null;
  }
}

function Bot({ m, bump, onDone }) {
  const [n, setN] = useState(m.live ? 1 : m.blocks.length);
  useEffect(() => { if (!m.live) setN(m.blocks.length); }, [m.live, m.blocks.length]);
  const fin = (i) => () => {
    if (!m.live) return;
    if (i + 1 < m.blocks.length) setN((x) => Math.max(x, i + 2)); else onDone(m.id);
  };
  return (
    <div className="b">
      <img className="av" src={asset('profile.jpg')} alt="" width="30" height="30" />
      <div className="bc">{m.blocks.slice(0, n).map((b, i) => <Block key={i} b={b} live={m.live} done={fin(i)} bump={bump} />)}</div>
    </div>
  );
}

/* ---------- chat shell ---------- */
const Moon = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>;
const Sun = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
const Enter = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 5v6a3 3 0 0 1-3 3H5" /><path d="m9 18-4-4 4-4" /></svg>;

export default function Chat() {
  const [msgs, setMsgs] = useState([]);
  const [val, setVal] = useState('');
  const [thinking, setThinking] = useState(false);
  const [doneId, setDoneId] = useState(null);
  const [hint, setHint] = useState(0);
  const [theme, setTheme] = useTheme();
  const ctx = useRef({ topic: null });
  const hist = useRef([]);
  const hi = useRef(-1);
  const id = useRef(0);
  const busy = useRef(false);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const boxRef = useRef(null);

  const bump = useCallback(() => { const el = logRef.current; if (el) el.scrollTop = el.scrollHeight; }, []);
  const botSay = useCallback((blocks, follow, len = 0) => {
    busy.current = true; setThinking(true);
    setTimeout(() => {
      busy.current = false; setThinking(false);
      setMsgs((m) => [...m, { id: ++id.current, role: 'bot', blocks, follow, live: true }]);
    }, 360 + Math.min(len * 2, 600));
  }, []);

  const send = useCallback((raw) => {
    const text = raw.trim();
    if (!text || busy.current) return;
    hist.current.unshift(text); hi.current = -1; setVal('');
    const r = boxRef.current?.getBoundingClientRect();
    const low = text.toLowerCase();

    if (low === '/clear') { setMsgs([]); setDoneId(null); ctx.current = { topic: null }; return; }
    if (low === '/dark' || low === '/light') {
      setTheme(low.slice(1), r ? r.right - 60 : undefined, r ? r.top + 30 : undefined);
      setMsgs((m) => [...m.map((x) => ({ ...x, live: false })), { id: ++id.current, role: 'user', text }]);
      return botSay([{ t: 'text', v: `Switched to the ${low.slice(1)} theme.` }], ['Show me your work', 'Just need your info'], 30);
    }
    setMsgs((m) => [...m.map((x) => ({ ...x, live: false })), { id: ++id.current, role: 'user', text }]);
    const res = answer(text, ctx.current);
    botSay(res.blocks, res.follow, res.len);
  }, [botSay, setTheme]);

  // buttons elsewhere on the page ask the chat a question
  useEffect(() => {
    const onAsk = (e) => { document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' }); setTimeout(() => send(e.detail), 350); };
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); inputRef.current?.focus(); } };
    window.addEventListener('ask', onAsk); window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('ask', onAsk); window.removeEventListener('keydown', onKey); };
  }, [send]);

  useEffect(() => { const t = setInterval(() => setHint((h) => (h + 1) % HINTS.length), 3600); return () => clearInterval(t); }, []);
  useEffect(() => { bump(); }, [msgs, thinking, bump]);

  const lastBot = [...msgs].reverse().find((m) => m.role === 'bot');
  const chips = msgs.length === 0 ? STARTERS : lastBot && doneId === lastBot.id && !thinking ? lastBot.follow : [];

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp' && hist.current.length) { e.preventDefault(); hi.current = Math.min(hi.current + 1, hist.current.length - 1); setVal(hist.current[hi.current]); }
    if (e.key === 'ArrowDown' && hi.current >= 0) { e.preventDefault(); hi.current -= 1; setVal(hi.current >= 0 ? hist.current[hi.current] : ''); }
    if (e.key === 'Escape') setVal('');
  };

  return (
    <section className="chat" aria-label="Chat with Charlie’s site">
      {msgs.length > 0 && (
        <div className="log" ref={logRef} aria-live="polite">
          {msgs.map((m) => m.role === 'user'
            ? <p className="u" key={m.id}>{m.text}</p>
            : <Bot key={m.id} m={m} bump={bump} onDone={setDoneId} />)}
          {thinking && <div className="b"><img className="av" src={asset('profile.jpg')} alt="" width="30" height="30" /><span className="dots" role="status" aria-label="Typing"><i /><i /><i /></span></div>}
        </div>
      )}
      <div className="chips">
        {chips.map((c, i) => (
          <button key={c} type="button" className={'chip' + (msgs.length === 0 && i === 2 ? ' alt' : '')} onClick={() => send(c)}>{c}</button>
        ))}
      </div>
      <form className="box" ref={boxRef} onSubmit={(e) => { e.preventDefault(); send(val); }}>
        <input ref={inputRef} value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={onKeyDown}
          placeholder={HINTS[hint]} aria-label="Ask me anything" autoComplete="off" enterKeyHint="send" />
        <button type="button" className="ico" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setTheme(theme === 'dark' ? 'light' : 'dark', r.left + r.width / 2, r.top + r.height / 2); }}>
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
        <button type="submit" className="ico send" disabled={!val.trim()} aria-label="Send"><Enter /></button>
      </form>
      <p className="fine">Scripted answers written by Charlie, no live AI. Type /help for shortcuts.</p>
    </section>
  );
}
