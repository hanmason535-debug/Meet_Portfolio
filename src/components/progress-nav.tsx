"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Cat 1 Fix 1: Uses IntersectionObserver instead of per-scroll getBoundingClientRect.
 * Cat 2 Fix 2: Gracefully skips sections that haven't mounted yet (null getElementById).
 * Cat 6 Fix 1: Dots get a ring-pulse animation on hover.
 */

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "hackathons", label: "Hackathons" },
  { id: "contact", label: "Contact" },
];

export default function ProgressNav() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Cat 1 Fix 1 + Cat 2 Fix 2: IntersectionObserver; skip null elements.
    const observedSet = new Set<Element>();

    const observe = (el: Element) => {
      if (!observedSet.has(el)) {
        observedSet.add(el);
        observerRef.current?.observe(el);
      }
    };

    const candidates = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];

    if (candidates.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Take the first intersecting entry to set the active section.
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      }
    );

    candidates.forEach(observe);

    // Re-observe when lazy sections mount via MutationObserver on document.body.
    const mutationObserver = new MutationObserver(() => {
      SECTIONS.map((s) => document.getElementById(s.id))
        .filter(Boolean)
        .forEach((el) => observe(el as HTMLElement));
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observerRef.current?.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    // Cat 2 Fix 2: gracefully skip if section not yet in DOM.
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col gap-2"
    >
      {SECTIONS.map((section) => {
        const isActive = activeId === section.id;
        return (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            aria-label={`Scroll to ${section.label}`}
            title={section.label}
            // Cat 6 Fix 1: hover triggers ring-pulse via group-hover + CSS animation.
            className={cn(
              "group relative flex items-center justify-end gap-2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
            )}
          >
            {/* Label appears on hover */}
            <span
              className={cn(
                "text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap select-none",
                isActive && "opacity-100 text-foreground font-medium"
              )}
            >
              {section.label}
            </span>
            {/* Dot */}
            <span
              className={cn(
                "block rounded-full transition-all duration-200",
                "group-hover:[animation:ring-pulse_0.6s_ease-in-out_1]",
                isActive
                  ? "size-2.5 bg-[var(--accent-cyber)]"
                  : "size-1.5 bg-muted-foreground/40 group-hover:bg-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
