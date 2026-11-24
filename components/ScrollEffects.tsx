"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TARGETS = [
  ".hero-lede",
  ".hero-actions",
  ".hero-meta",
  ".code-card",
  ".section-head",
  ".proj-card",
  ".skill-group",
  ".tl-item",
  ".edu-item",
  ".contact-card",
  ".detail-hero > *",
  ".shot",
  ".side-card",
].join(", ");

/**
 * Adds the motion layer that server components can't own:
 * reading progress, replayable reveal-on-scroll and pointer-reactive cards.
 *
 * Reset happens on scroll (not in the observer), because an observer only
 * reports intersection *changes* — an element left hundreds of pixels
 * off-screen would never fire again and would stop replaying.
 */
export default function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hover = window.matchMedia("(hover: hover)").matches;

    let nodes: HTMLElement[] = [];
    const bar = document.querySelector<HTMLElement>(".scroll-progress span");

    const resetNode = (el: HTMLElement) => {
      el.classList.remove("is-visible", "is-settled");
      if (el.classList.contains("proj-card")) {
        el.style.transform = "";
        el.style.removeProperty("--mx");
        el.style.removeProperty("--my");
      }
    };

    // Only reset once the element is fully out of view (with a safety
    // margin), so it can never flicker in and out at the viewport edge.
    const resetFarNodes = () => {
      if (!nodes.length) return;
      const vh = window.innerHeight;
      for (const el of nodes) {
        if (!el.classList.contains("is-visible")) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -80 || rect.top > vh + 80) resetNode(el);
      }
    };

    let queued = false;
    let frameId = 0;
    const onFrame = () => {
      queued = false;
      frameId = 0;
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        bar.style.setProperty("--p", ratio.toFixed(4));
      }
      resetFarNodes();
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      frameId = window.requestAnimationFrame(onFrame);
    };

    onFrame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    if (reduce || !hover) {
      return () => {
        if (frameId) window.cancelAnimationFrame(frameId);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    nodes = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
    nodes.forEach((node, index) => {
      node.classList.add("reveal-on-scroll");
      node.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-visible");
          if (el.classList.contains("proj-card")) el.classList.add("is-settled");
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
    );

    nodes.forEach((node) => observer.observe(node));

    // Pointer tilt + spotlight on project cards.
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".proj-card"));
    const cleanups: Array<() => void> = [];

    for (const card of cards) {
      let frame = 0;
      let nextX = 0;
      let nextY = 0;

      const apply = () => {
        frame = 0;
        const rect = card.getBoundingClientRect();
        const px = Math.min(1, Math.max(0, nextX / rect.width));
        const py = Math.min(1, Math.max(0, nextY / rect.height));
        card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
        card.style.transform = `perspective(900px) rotateX(${((0.5 - py) * 5).toFixed(
          2,
        )}deg) rotateY(${((px - 0.5) * 7).toFixed(2)}deg) translateY(-6px)`;
      };

      const onMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        nextX = event.clientX - rect.left;
        nextY = event.clientY - rect.top;
        if (!frame) frame = window.requestAnimationFrame(apply);
      };

      const onLeave = () => {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        card.style.transform = "";
        card.style.removeProperty("--mx");
        card.style.removeProperty("--my");
      };

      card.addEventListener("pointermove", onMove, { passive: true });
      card.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        if (frame) window.cancelAnimationFrame(frame);
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      });
    }

    return () => {
      observer.disconnect();
      if (frameId) window.cancelAnimationFrame(frameId);
      nodes.forEach((node) => {
        node.classList.remove("reveal-on-scroll", "is-visible", "is-settled");
        node.style.removeProperty("transition-delay");
      });
      cleanups.forEach((fn) => fn());
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
