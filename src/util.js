import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export const asset = (p) => `${import.meta.env.BASE_URL}${p}`;

// Any button on the page can hand a question to the chat box
export const ask = (q) => window.dispatchEvent(new CustomEvent('ask', { detail: q }));

import { manilaTime } from './time.js';

export function useClock() {
  const [t, setT] = useState(manilaTime);
  useEffect(() => {
    const id = setInterval(() => setT(manilaTime()), 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// Light/dark toggle with a circular reveal (View Transitions API) and a plain fallback
export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  const apply = (next, x = innerWidth / 2, y = innerHeight / 2) => {
    const go = () => {
      document.documentElement.dataset.theme = next;
      setTheme(next);
      try { localStorage.setItem('theme', next); } catch { /* storage blocked */ }
    };
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return go();
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(() => flushSync(go)).ready.then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
      )
    );
  };
  return [theme, apply];
}

// Cursor-follow highlight for any element with class "spot"
export function useSpotlight() {
  useEffect(() => {
    const move = (e) => {
      const el = e.target.closest?.('.spot');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', move);
    return () => document.removeEventListener('pointermove', move);
  }, []);
}
