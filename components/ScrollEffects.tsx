"use client";

import { useEffect } from "react";

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
].join(", ");

/** Adds staggered reveal-on-scroll motion without touching server components. */
export default function ScrollEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
    nodes.forEach((node, index) => {
      node.classList.add("reveal-on-scroll");
      node.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
      nodes.forEach((node) => {
        node.classList.remove("reveal-on-scroll", "is-visible");
        node.style.removeProperty("transition-delay");
      });
    };
  }, []);

  return null;
}
