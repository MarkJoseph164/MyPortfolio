"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  size: number;
  glyph: string | null;
};

type Ripple = { x: number; y: number; r: number; a: number };

/**
 * A pointer-following particle constellation: nodes, linking edges,
 * binary glyphs and click ripples. Reads like a live dependency graph.
 */
export default function CodeCursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (/^\/(cv|admin)/.test(window.location.pathname)) return;

    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const nodes: Node[] = [];
    const ripples: Ripple[] = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let pointerX = -999;
    let pointerY = -999;
    let lastX = -999;
    let lastY = -999;
    let frame = 0;
    let on = false;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number, burst = 1) => {
      for (let i = 0; i < burst; i += 1) {
        if (nodes.length > 150) nodes.shift();
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.15 + Math.random() * 0.55;
        nodes.push({
          x: x + (Math.random() - 0.5) * 22,
          y: y + (Math.random() - 0.5) * 22,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.12,
          life: 0,
          ttl: 900 + Math.random() * 900,
          size: 0.9 + Math.random() * 1.7,
          glyph: Math.random() < 0.22 ? (Math.random() < 0.5 ? "0" : "1") : null,
        });
      }
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!on) {
        on = true;
        canvas.classList.add("is-on");
      }
      if (Math.hypot(pointerX - lastX, pointerY - lastY) > 7) {
        lastX = pointerX;
        lastY = pointerY;
        spawn(pointerX, pointerY, 1);
      }
    };

    const onDown = (event: PointerEvent) => {
      ripples.push({ x: event.clientX, y: event.clientY, r: 6, a: 0.55 });
      spawn(event.clientX, event.clientY, 10);
    };

    const onLeave = () => {
      on = false;
      canvas.classList.remove("is-on");
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height);

      // Edges between nearby nodes: a live graph.
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > 92) continue;
          const alpha = (1 - dist / 92) * 0.22 * Math.min(1, a.life / 140);
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Nodes fade, drift and shrink.
      for (let i = nodes.length - 1; i >= 0; i -= 1) {
        const n = nodes[i];
        n.life += dt;
        if (n.life > n.ttl) {
          nodes.splice(i, 1);
          continue;
        }
        n.x += n.vx;
        n.y += n.vy;
        n.vx *= 0.995;
        n.vy *= 0.995;
        const fade = Math.min(1, n.life / 160) * Math.max(0, 1 - n.life / n.ttl);

        if (n.glyph) {
          ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
          ctx.fillStyle = `rgba(232, 121, 249, ${fade * 0.55})`;
          ctx.fillText(n.glyph, n.x, n.y);
        } else {
          ctx.beginPath();
          ctx.fillStyle = `rgba(192, 132, 252, ${fade * 0.7})`;
          ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Click ripples expand like a ping.
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const r = ripples[i];
        r.r += dt * 0.42;
        r.a -= dt * 0.0011;
        if (r.a <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.strokeStyle = `rgba(232, 121, 249, ${r.a})`;
        ctx.lineWidth = 1.1;
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // A small reticle keeps the CS/HUD feel at the pointer.
      if (on) {
        const t = performance.now() / 900;
        ctx.save();
        ctx.translate(pointerX, pointerY);
        ctx.rotate(t);
        ctx.strokeStyle = "rgba(192, 132, 252, 0.4)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(0, 0, 13, 0.4, 1.6);
        ctx.arc(0, 0, 13, Math.PI + 0.4, Math.PI + 1.6);
        ctx.stroke();
        ctx.restore();
      }
    };

    let previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(48, now - previous);
      previous = now;
      draw(dt);
      frame = window.requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="code-cursor" aria-hidden />;
}
