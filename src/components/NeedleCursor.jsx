import { useEffect, useRef } from 'react';
import { useMediaQuery, useReducedMotion } from '../hooks';

/*
 * Lightweight SVG Aari-needle cursor with a verlet silk thread.
 * - Desktop (fine pointer + hover) only; disabled for touch and prefers-reduced-motion.
 * - Overlay is pointer-events:none, so clicking, scrolling and selection are untouched.
 * - The rAF loop sleeps when the needle and thread are at rest.
 * - Any runtime error removes the class that hides the native cursor.
 */

const NEEDLE_LEN = 52;
const BASE_ANGLE = 52; // degrees: body trails down-right, tip points up-left like a normal cursor
const SEGMENTS = 14;
const SEG_LEN = 8;
const GRAVITY = 0.32;
const INTERACTIVE = 'a, button, select, label, summary, [role="button"], input[type="submit"], input[type="checkbox"], input[type="radio"]';
const TEXT_FIELDS = 'input:not([type="submit"]):not([type="checkbox"]):not([type="radio"]):not([type="button"]), textarea, [contenteditable="true"]';

export default function NeedleCursor() {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;

  const svgRef = useRef(null);
  const needleRef = useRef(null);
  const threadRef = useRef(null);
  const marksRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.documentElement;
    let raf = 0;
    let running = false;
    const timers = new Set();

    const state = {
      x: -100, y: -100, tx: -100, ty: -100,
      angle: BASE_ANGLE, targetAngle: BASE_ANGLE,
      scale: 1, targetScale: 1,
      push: 0, pushT: 0,
      visible: false, overText: false,
      idle: 0,
    };
    const pts = Array.from({ length: SEGMENTS }, () => ({ x: -100, y: -100, px: -100, py: -100 }));

    const fail = (err) => {
      console.warn('[needle-cursor] disabled:', err);
      root.classList.remove('needle-cursor-on');
      cancelAnimationFrame(raf);
      running = false;
      if (svgRef.current) svgRef.current.style.display = 'none';
    };

    const frame = () => {
      try {
        const s = state;
        const dx = s.tx - s.x;
        const dy = s.ty - s.y;
        s.x += dx * 0.45;
        s.y += dy * 0.45;

        // Tilt with horizontal velocity, clamped and eased.
        const tilt = Math.max(-14, Math.min(14, dx * 0.6));
        s.angle += (s.targetAngle + tilt - s.angle) * 0.18;
        s.scale += (s.targetScale - s.scale) * 0.2;

        // Click "stitch": push along the needle axis and back.
        if (s.pushT > 0) {
          s.pushT = Math.max(0, s.pushT - 1 / 16);
          s.push = Math.sin(s.pushT * Math.PI) * 7;
        } else s.push = 0;

        const rad = (s.angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const tipX = s.x - cos * s.push;
        const tipY = s.y - sin * s.push;
        needleRef.current.setAttribute(
          'transform',
          `translate(${tipX.toFixed(2)} ${tipY.toFixed(2)}) rotate(${s.angle.toFixed(2)}) scale(${s.scale.toFixed(3)})`
        );

        // Thread: pinned to the needle eye, verlet rope with gravity.
        const eyeX = tipX + cos * (NEEDLE_LEN - 5) * s.scale;
        const eyeY = tipY + sin * (NEEDLE_LEN - 5) * s.scale;
        let motion = Math.abs(dx) + Math.abs(dy) + (s.pushT > 0 ? 1 : 0);
        for (let i = 1; i < SEGMENTS; i++) {
          const p = pts[i];
          const vx = (p.x - p.px) * 0.9;
          const vy = (p.y - p.py) * 0.9;
          p.px = p.x; p.py = p.y;
          p.x += vx;
          p.y += vy + GRAVITY;
          motion += Math.abs(vx) + Math.abs(vy);
        }
        pts[0].x = eyeX; pts[0].y = eyeY;
        for (let k = 0; k < 3; k++) {
          for (let i = 1; i < SEGMENTS; i++) {
            const a = pts[i - 1];
            const b = pts[i];
            const ddx = b.x - a.x;
            const ddy = b.y - a.y;
            const d = Math.hypot(ddx, ddy) || 0.0001;
            const diff = (d - SEG_LEN) / d;
            if (i === 1) { b.x -= ddx * diff; b.y -= ddy * diff; }
            else { a.x += ddx * diff * 0.5; a.y += ddy * diff * 0.5; b.x -= ddx * diff * 0.5; b.y -= ddy * diff * 0.5; }
          }
          pts[0].x = eyeX; pts[0].y = eyeY;
        }

        let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        for (let i = 1; i < SEGMENTS - 1; i++) {
          const mx = (pts[i].x + pts[i + 1].x) / 2;
          const my = (pts[i].y + pts[i + 1].y) / 2;
          d += ` Q${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
        }
        threadRef.current.setAttribute('d', d);

        // Sleep once everything has settled.
        s.idle = motion < 0.05 && Math.abs(s.scale - s.targetScale) < 0.002 ? s.idle + 1 : 0;
        if (s.idle > 20) { running = false; return; }
        raf = requestAnimationFrame(frame);
      } catch (err) {
        fail(err);
      }
    };

    const wake = () => {
      if (!running) { running = true; state.idle = 0; raf = requestAnimationFrame(frame); }
    };

    const setVisible = (v) => {
      state.visible = v;
      svgRef.current.style.opacity = v && !state.overText ? '1' : '0';
    };

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      if (!state.visible) {
        // First appearance: snap everything to the pointer so the thread doesn't fly in.
        state.x = state.tx = e.clientX; state.y = state.ty = e.clientY;
        pts.forEach((p, i) => { p.x = p.px = e.clientX + 30; p.y = p.py = e.clientY + 30 + i * SEG_LEN; });
      }
      state.tx = e.clientX; state.ty = e.clientY;
      setVisible(true);
      wake();
    };

    const onOver = (e) => {
      const t = e.target instanceof Element ? e.target : null;
      state.overText = !!t?.closest(TEXT_FIELDS);
      const interactive = !!t?.closest(INTERACTIVE);
      state.targetScale = interactive ? 1.14 : 1;
      state.targetAngle = interactive ? BASE_ANGLE - 12 : BASE_ANGLE;
      setVisible(state.visible);
      wake();
    };

    const onDown = (e) => {
      if (e.button !== 0) return;
      state.pushT = 1;
      // Leave a tiny running-stitch mark that fades out.
      const mark = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const x = e.clientX; const y = e.clientY;
      mark.setAttribute('d', `M${x - 9} ${y + 3} L${x - 3} ${y + 1} M${x + 2} ${y - 1} L${x + 8} ${y - 3}`);
      mark.setAttribute('class', 'needle-cursor__mark');
      marksRef.current.appendChild(mark);
      const id = setTimeout(() => { mark.remove(); timers.delete(id); }, 700);
      timers.add(id);
      wake();
    };

    const onLeave = () => setVisible(false);

    try {
      root.classList.add('needle-cursor-on');
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      document.addEventListener('pointerover', onOver, { passive: true });
      document.documentElement.addEventListener('mouseleave', onLeave);
      window.addEventListener('blur', onLeave);
    } catch (err) {
      fail(err);
    }

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      root.classList.remove('needle-cursor-on');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <svg ref={svgRef} className="needle-cursor" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="needleGold" x1="0" y1="-2" x2="0" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F1D6A6" />
          <stop offset="0.45" stopColor="#B9844F" />
          <stop offset="1" stopColor="#5E3D1E" />
        </linearGradient>
      </defs>
      <g ref={marksRef} />
      <path ref={threadRef} className="needle-cursor__thread" d="" />
      <g ref={needleRef}>
        {/* soft shadow */}
        <path d="M2 3.5 L54 1.4 L54 6.6 Z" fill="#2A1210" opacity="0.16" />
        {/* hooked Aari tip */}
        <path d="M0.2 0 C-0.9 -2 1 -3.2 3.2 -2.3" fill="none" stroke="#6E4824" strokeWidth="1.1" strokeLinecap="round" />
        {/* tapered shaft */}
        <path d="M0 0 L52 -2.3 Q54.6 0 52 2.3 Z" fill="url(#needleGold)" stroke="#6E4824" strokeWidth="0.5" strokeLinejoin="round" />
        <path d="M4 -0.4 L50 -1.4" stroke="#FFF6E6" strokeWidth="0.6" strokeLinecap="round" opacity="0.8" />
        {/* eye */}
        <ellipse cx="46.5" cy="0" rx="3" ry="0.85" fill="#FBF0E5" stroke="#6E4824" strokeWidth="0.35" />
      </g>
    </svg>
  );
}
