// A small scripted "assistant": keyword scoring + conversation context + typo tolerance.
// No network, no AI. Every answer comes from data.js.
import { PROFILE, PROJECTS, JOBS, SITES, SKILLS, EDU, TECH } from './data.js';
import { manilaTime } from './time.js';

export const STARTERS = ['Who are you?', 'Show me your work', 'Just need your info'];
const TOPICS = ['Who are you?', 'Show me your work', 'Work experience', 'What’s your stack?', 'Just need your info'];

const T = (v) => ({ t: 'text', v });
const norm = (s) => ' ' + s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9+#]+/g, ' ').trim() + ' ';
const has = (text, key) => text.includes(' ' + norm(key).trim() + ' ');
const years = () => new Date().getFullYear() - 2021;

const ALL = [];
const add = (id, keys, fn, more, follow) => ALL.push({ id, keys, fn, more, follow });

add('greet', [['hi', 2], ['hello', 2], ['hey', 2], ['kumusta', 2], ['good morning', 2], ['good evening', 2], ['good afternoon', 2]],
  () => [T('Hi! I’m the assistant on Charlie’s site. Ask about his projects, stack or experience, or tap one of the suggestions.')]);

add('who', [['who are you', 6], ['who is charlie', 6], ['about', 3], ['introduce', 3], ['yourself', 3], ['bio', 3], ['background', 3], ['tell me about you', 5], ['whos charlie', 6]],
  () => [T(`I’m **Charlie Lahorra**, a software developer from Bulacan, Philippines. I build, fix and ship websites and web apps that businesses use every day: WordPress and Shopify for clients, Laravel and React for internal platforms.`),
    T('Right now I’m an **Advanced App Engineering Analyst at Accenture**, working as a ServiceNow administrator and developer.'),
    { t: 'stats', items: [[SITES.length, 'live client sites'], [`${years()}`, 'years shipping web work'], [4, 'platforms: WordPress, Shopify, Laravel, React']] }],
  () => [T('Charlie started as a web developer at iPhiTech in **Oct 2021**, moved up to project lead, freelanced for international clients through 2023, then spent two and a half years as Developer Lead at **JIMAC** before joining Accenture in **Aug 2026**.'),
    { t: 'go', links: [{ label: 'See the full timeline', href: '#experience' }] }],
  () => ['Work experience', 'Show me your work', 'What’s your stack?']);

add('work', [['show me your work', 8], ['work', 2], ['projects', 4], ['project', 3], ['portfolio', 3], ['built', 2], ['case study', 4], ['case studies', 4], ['examples', 3], ['made', 1]],
  () => [T('Here are the projects I’d start with. Three are live sites and two are applications I built or maintained at JIMAC.'),
    { t: 'projects', ids: PROJECTS.map((p) => p.id) }],
  () => [T('Want the whole list? Every client site I built or fixed is in the Sites section, with filters for WordPress, Shopify and builds from scratch.'), { t: 'go', links: [{ label: 'Open the sites list', href: '#shipped' }] }],
  () => ['Tell me about the JIMAC platform', 'See the live sites', 'Laravel']);

add('sites', [['sites', 4], ['websites', 4], ['website', 3], ['live', 3], ['clients', 3], ['client', 2], ['urls', 3], ['links', 2], ['shipped', 4]],
  () => [T(`I’ve shipped ${SITES.length} live client sites. ${SITES.filter((s) => s.scratch).length} I built from scratch, the rest I took over to add pages and fix problems. A few of them:`),
    { t: 'sites', filter: 'all', limit: 6 }],
  null, () => ['Show me your work', 'Shopify', 'SEO']);

add('experience', [['experience', 4], ['work experience', 7], ['career', 4], ['jobs', 4], ['job', 3], ['history', 3], ['timeline', 4], ['employment', 4], ['worked', 3], ['employer', 3], ['roles', 3]],
  () => [T('Four stops in five years, moving from building pages to leading projects, then to full-stack platforms, and now ServiceNow.'), { t: 'timeline', ids: JOBS.map((j) => j.id) }],
  () => [T('The details behind the most recent role:'), { t: 'list', items: JOBS[0].points }],
  () => ['Tell me about ServiceNow', 'Tell me about the JIMAC platform', 'Education']);

add('skills', [['skills', 5], ['stack', 6], ['tech', 3], ['technologies', 5], ['tools', 3], ['expertise', 5], ['what can you do', 6], ['what do you use', 5], ['languages', 4], ['good at', 4], ['whats your stack', 8]],
  () => [T('Here’s the toolbox, grouped by what I use it for.'), { t: 'skills' }],
  () => [T('If you want depth on one, ask by name: Laravel, React, WordPress, Shopify, ServiceNow, APIs or SEO.')],
  () => ['Laravel', 'WordPress', 'ServiceNow']);

add('contact', [['just need your info', 9], ['info', 3], ['contact', 6], ['email', 6], ['reach', 4], ['message', 3], ['get in touch', 6], ['talk', 2], ['connect', 3], ['phone', 4], ['number', 2], ['linkedin', 4], ['github', 4]],
  () => [T('Here’s the short version. Email is the best way to reach Charlie.'), { t: 'contact' }],
  null, () => ['Download resume', 'Are you available for hire?', 'Show me your work']);

add('resume', [['resume', 7], ['cv', 6], ['curriculum', 5], ['download', 3], ['pdf', 3]],
  () => [T('Here’s the resume as a PDF. It matches what’s on this page.'), { t: 'go', links: [{ label: 'Download resume (PDF)', href: PROFILE.resume, download: true }] }],
  null, () => ['Work experience', 'Just need your info']);

add('edu', [['education', 6], ['school', 4], ['university', 5], ['degree', 5], ['studied', 4], ['college', 4], ['bsu', 5], ['graduate', 4], ['graduated', 4]],
  () => [T(`**${EDU.degree}** at ${EDU.school}, ${EDU.when}. Charlie started his first web developer role a month after graduating.`)],
  null, () => ['Work experience', 'What’s your stack?']);

add('where', [['where', 3], ['location', 5], ['based', 4], ['live', 1], ['timezone', 5], ['time zone', 5], ['what time', 5], ['philippines', 4], ['remote', 3]],
  () => [T(`Charlie is based in **${PROFILE.location}**, in the Philippines time zone (UTC+8). It’s ${manilaTime()} there right now.`),
    T('He has worked remotely with international clients, so a time difference is rarely a problem.')],
  null, () => ['Just need your info', 'Are you available for hire?']);

add('hire', [['hire', 6], ['available', 5], ['availability', 5], ['freelance', 5], ['open to work', 6], ['rate', 4], ['rates', 4], ['price', 4], ['pricing', 4], ['cost', 3], ['quote', 4], ['job offer', 4], ['collaborate', 4], ['work with you', 5], ['work together', 5]],
  () => [T('Charlie is working full-time at Accenture, so whether a project fits is best settled with a short email. Include what you’re building, the platform, and your deadline.'),
    T('I won’t guess at pricing in a chat box. He’ll answer with real numbers once he sees the scope.'),
    { t: 'go', links: [{ label: 'Email Charlie', href: `mailto:${PROFILE.email}` }, { label: 'Download resume', href: PROFILE.resume, download: true }] }],
  null, () => ['Show me your work', 'Just need your info']);

add('ai', [['ai', 4], ['are you an ai', 8], ['are you ai', 7], ['robot', 4], ['real person', 6], ['are you real', 7], ['are you a bot', 7], ['bot', 3], ['chatgpt', 4], ['gpt', 3], ['llm', 4], ['how do you work', 6], ['how does this work', 6], ['are you human', 7], ['claude', 3]],
  () => [T('I’m a scripted assistant. No live AI behind me: every answer is written by Charlie and stored in the site’s code. I match your words to topics, so if I miss, try a simpler phrase or tap a suggestion.')],
  null, () => TOPICS.slice(0, 3));

add('help', [['help', 6], ['commands', 5], ['what can i ask', 7], ['options', 3], ['menu', 3], ['what can you answer', 6]],
  () => [T('Ask in plain words, or tap a suggestion. Things I can answer:'),
    { t: 'list', items: ['Who Charlie is and what he does', 'Projects, live sites and how they were built', 'Experience, education and the current role', 'Any technology by name: Laravel, React, WordPress, Shopify, ServiceNow, APIs, SEO', 'How to reach him, and whether he is available'] },
    T('Shortcuts: **/resume**, **/clear**, **/dark**, **/light**, and **Ctrl K** to jump to this box. Say “tell me more” after any answer for detail.')],
  null, () => TOPICS);

add('thanks', [['thanks', 4], ['thank you', 4], ['thx', 3], ['cool', 2], ['nice', 2], ['great', 2], ['awesome', 2]],
  () => [T('Anytime. If you want to take it further, the email is on the contact card.')], null, () => ['Just need your info', 'Show me your work']);

PROJECTS.forEach((p) => {
  const keys = { zenium: ['zenium', 'lubricant', 'lubricants'], tsceres: ['tsceres', 'ceres', 'landing page'], hoshitech: ['hoshitech', 'hoshi', 'printer', 'printers'],
    platform: ['platform', 'dashboard', 'ordering', 'back office', 'internal'], rdms: ['rdms', 'pos', 'point of sale', 'yii'] }[p.id];
  add('p-' + p.id, keys.map((k) => [k, 6]),
    () => [T(`**${p.name}.** ${p.blurb}`), { t: 'projects', ids: [p.id] }],
    () => [{ t: 'list', items: p.more }],
    () => ['Show me your work', ...(p.kind === 'app' ? ['Laravel', 'APIs'] : ['WordPress', 'See the live sites'])]);
});

Object.entries(TECH).forEach(([id, t]) => {
  add('t-' + id, t.keys.map((k) => [k, 5]),
    () => [T(t.used), ...(t.projects ? [{ t: 'projects', ids: t.projects }] : []), ...(t.sites ? [{ t: 'sites', filter: t.sites, limit: 5 }] : [])],
    () => [T(`Want to see ${t.label} in context? The projects and experience sections show where each piece was used.`), { t: 'go', links: [{ label: 'Projects', href: '#projects' }, { label: 'Experience', href: '#experience' }] }],
    () => ['Show me your work', 'What’s your stack?', 'Just need your info']);
});

const BY_ID = Object.fromEntries(ALL.map((i) => [i.id, i]));
const MORE = ['tell me more', 'more', 'go on', 'continue', 'elaborate', 'details', 'more details', 'what else', 'and', 'why', 'how'];

function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

// Typo tolerance: "larvel", "wordpres", "experiance" still land somewhere sensible
function fuzzy(text) {
  const toks = text.trim().split(' ').filter((t) => t.length >= 5);
  for (const tok of toks) for (const it of ALL) for (const [k] of it.keys) {
    const key = norm(k).trim();
    if (key.includes(' ') || key.length < 5) continue;
    if (lev(tok, key) <= (key.length >= 8 ? 2 : 1)) return it;
  }
  return null;
}

const pack = (blocks, follow) => ({ blocks, follow, len: blocks.reduce((n, b) => n + (b.t === 'text' ? b.v.length : 40), 0) });

export function answer(raw, ctx) {
  const text = norm(raw.replace(/^\//, ''));
  const words = text.trim().split(' ').length;

  if (words <= 4 && MORE.some((m) => has(text, m)) && !ALL.some((i) => i.keys.some(([k, w]) => w >= 4 && has(text, k)))) {
    const cur = BY_ID[ctx.topic];
    if (cur?.more) return pack(cur.more(), cur.follow?.() ?? TOPICS);
    return pack([T('More on what? Pick a topic and I’ll go deeper.')], TOPICS);
  }

  let best = null, score = 0;
  for (const it of ALL) {
    const s = it.keys.reduce((a, [k, w]) => a + (has(text, k) ? w : 0), 0);
    if (s > score) { score = s; best = it; }
  }
  if (!best || score < 2) best = fuzzy(text);

  if (!best) {
    ctx.misses = (ctx.misses || 0) + 1;
    const line = ctx.misses > 1 ? 'Still no match, sorry. Email is the surest way to get an answer from Charlie himself.' : 'I don’t have a scripted answer for that. I can cover Charlie’s background, projects, live sites, stack, experience, education and how to reach him.';
    return pack([T(line), { t: 'go', links: [{ label: 'Email Charlie', href: `mailto:${PROFILE.email}` }] }], TOPICS);
  }

  const again = ctx.topic === best.id && best.more;
  const blocks = again ? [T('You asked about this one already. Here’s more detail.'), ...best.more()] : best.fn();
  ctx.topic = best.id;
  return pack(blocks, best.follow?.() ?? TOPICS.slice(0, 3));
}
