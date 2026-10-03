import { useEffect, useRef, useState } from 'react';
import { PROFILE, PROJECTS, JOBS, SITES, SKILLS, EDU } from './data.js';
import { ask, asset, useClock } from './util.js';

/* Variable-font headline: letters get heavier near the cursor. One entrance wave on load. */
export function Kinetic({ text }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1700);
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(hover: hover)').matches;
    if (calm) return () => clearTimeout(t);
    const letters = [...ref.current.querySelectorAll('[data-c]')];
    let raf;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => letters.forEach((s) => {
        const r = s.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        s.style.fontWeight = Math.round(380 + Math.max(0, 1 - d / 240) * 420);
      }));
    };
    window.addEventListener('pointermove', move);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); };
  }, []);
  let i = 0;
  return (
    <h1 ref={ref} className={'kin' + (ready ? '' : ' intro')} aria-label={text}>
      {text.split(' ').map((w) => (
        <span className="w" key={w} aria-hidden="true">{[...w].map((c) => <span key={i} data-c style={{ '--i': i++ }}>{c}</span>)}</span>
      ))}
    </h1>
  );
}

function useCount(to) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => { const k = Math.min(1, (t - t0) / 1000); setN(Math.round(to * (1 - (1 - k) ** 3))); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return [ref, n];
}

export function Bento() {
  const [g, setG] = useState(0);
  const [ref, n] = useCount(SITES.length);
  const time = useClock();
  return (
    <section className="bento" id="about" aria-label="At a glance">
      <article className="tile spot t-now">
        <h2>ServiceNow at Accenture</h2>
        <p>Admin and developer on the platform: forms, workflows, business rules, UI policies and access controls. I also work with Now Assist to speed up ticket handling and summaries.</p>
        <button className="btn ghost" onClick={() => ask('Tell me about ServiceNow')}>Ask about this role</button>
      </article>
      <article className="tile spot t-count" ref={ref}>
        <b className="big">{n}</b>
        <p>live client sites I built from scratch or took over to fix.</p>
        <a href="#shipped" className="link">See the list</a>
      </article>
      <article className="tile spot t-clock">
        <h3>Bulacan, Philippines</h3>
        <p className="muted">{time}</p>
        <button className="btn ghost" onClick={() => ask('Just need your info')}>Get contact info</button>
      </article>
      <article className="tile spot t-stack">
        <div className="tabs" role="tablist" aria-label="Skill groups">
          {SKILLS.map((s, i) => (
            <button key={s.id} role="tab" aria-selected={g === i} className={'tab' + (g === i ? ' on' : '')} onClick={() => setG(i)}>{s.name}</button>
          ))}
        </div>
        <ul className="tags" key={g}>{SKILLS[g].tags.map((t, i) => <li key={t} style={{ '--d': `${i * 35}ms` }}>{t}</li>)}</ul>
      </article>
      <article className="tile spot t-ask">
        <h3>Not sure where to start?</h3>
        {['What’s your stack?', 'Tell me about the JIMAC platform', 'Are you available for hire?'].map((q) => (
          <button key={q} className="q" onClick={() => ask(q)}>{q}</button>
        ))}
      </article>
    </section>
  );
}

export function Projects() {
  const sites = PROJECTS.filter((p) => p.kind === 'site');
  const apps = PROJECTS.filter((p) => p.kind === 'app');
  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className="cards">
        {sites.map((p) => (
          <article className="card spot" key={p.id}>
            <div className="shot"><img src={asset(p.img)} alt={`${p.name} homepage`} width="1100" height="550" loading="lazy" /></div>
            <h3>{p.name}</h3>
            <p className="muted">{p.blurb}</p>
            <ul className="tags sm">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            <div className="row">
              <a className="btn" href={p.url} target="_blank" rel="noreferrer">Visit site</a>
              <button className="btn ghost" onClick={() => ask(`Tell me about ${p.name}`)}>Ask in chat</button>
            </div>
          </article>
        ))}
      </div>
      <h3 className="sub-h">Applications</h3>
      <div className="cards two">
        {apps.map((p) => (
          <article className="card spot" key={p.id}>
            <div className="flow">{p.flow.map((f, i) => <span key={f}><i>{f}</i>{i < p.flow.length - 1 && <u aria-hidden="true" />}</span>)}</div>
            <h3>{p.name}</h3>
            <p className="muted">{p.blurb}</p>
            <ul className="tags sm">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            <div className="row"><button className="btn ghost" onClick={() => ask(`Tell me about ${p.name}`)}>Ask in chat</button></div>
          </article>
        ))}
      </div>
    </section>
  );
}

const FILTERS = [['all', `All ${SITES.length}`], ['scratch', 'Built from scratch'], ['wordpress', 'WordPress'], ['shopify', 'Shopify']];
const LIMIT = 5;

export function Sites() {
  const [f, setF] = useState('all');
  const [open, setOpen] = useState(false);
  const match = SITES.filter((s) => f === 'all' || (f === 'scratch' ? s.scratch : s.stack.toLowerCase() === f));
  const shown = open ? match : match.slice(0, LIMIT);
  return (
    <section id="shipped">
      <h2>Sites I’ve shipped</h2>
      <p className="muted sub-p">Every link is a live client website. I either built it from scratch or took over to add pages and fix problems.</p>
      <div className="filters" role="group" aria-label="Filter sites">
        {FILTERS.map(([k, l]) => <button key={k} aria-pressed={f === k} className={'fchip' + (f === k ? ' on' : '')} onClick={() => setF(k)}>{l}</button>)}
      </div>
      <ul className="sites">
        {shown.map((s) => (
          <li key={s.host}><a href={s.url} target="_blank" rel="noreferrer"><b>{s.host}</b><span>{s.stack}</span><em>{s.note}</em></a></li>
        ))}
      </ul>
      {match.length > LIMIT && (
        <button className="fchip" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Show fewer sites' : `Show all ${match.length} sites`}</button>
      )}
    </section>
  );
}

export function Experience() {
  const ref = useRef(null);
  const [sel, setSel] = useState('accenture');
  useEffect(() => {
    let raf;
    const upd = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
      el.style.setProperty('--p', p.toFixed(3));
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(upd); };
    upd(); window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  return (
    <section id="experience">
      <h2>Work experience</h2>
      <ol className="tl" ref={ref}>
        {JOBS.map((j) => (
          <li key={j.id} className={j.now ? 'now' : ''}>
            <div className="head">
              {j.logo ? <img className="logo" src={asset(j.logo)} alt="" width="44" height="44" /> : <span className="logo ph" aria-hidden="true">{j.mono}</span>}
              <div>
                {j.url ? <a className="co" href={j.url} target="_blank" rel="noreferrer">{j.co}</a> : <span className="co">{j.co}</span>}
                <p className="when">{j.when}</p>
              </div>
            </div>
            <h3>{j.role}</h3>
            <p className="muted">{j.summary}</p>
            <button className="more" aria-expanded={sel === j.id} onClick={() => setSel(sel === j.id ? '' : j.id)}>{sel === j.id ? 'Hide details' : 'Show details'}</button>
            {sel === j.id && <ul className="pts">{j.points.map((p) => <li key={p}>{p}</li>)}</ul>}
          </li>
        ))}
      </ol>
      <h3 className="sub-h">Education</h3>
      <p className="muted"><b className="ink">{EDU.degree}</b><br />{EDU.school}, {EDU.when}</p>
    </section>
  );
}

export function Contact() {
  const [ok, setOk] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(PROFILE.email); setOk(true); setTimeout(() => setOk(false), 1800); };
  return (
    <section id="contact" className="contact">
      <h2>Need a site built, fixed or sped up?</h2>
      <p className="muted sub-p">Send a short note about what you’re working on.</p>
      <a className="mail" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
      <div className="row">
        <button className="btn" onClick={copy} aria-live="polite">{ok ? 'Copied' : 'Copy email'}</button>
        <a className="btn ghost" href={asset(PROFILE.resume)} download>Download resume</a>
        <button className="btn ghost" onClick={() => ask('Are you available for hire?')}>Ask the chat instead</button>
      </div>
    </section>
  );
}
