import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Audit Dashboard — Visual Tier List",
  robots: { index: false, follow: false },
};

/* ─── Data ──────────────────────────────────────────────────────────────── */

type Grade = "S" | "A" | "B" | "C" | "D" | "F";

interface TierItem {
  component: string;
  rationale: string;
}

interface TierCategory {
  title: string;
  tiers: Partial<Record<Grade, TierItem[]>>;
  fixes: string[];
}

const AUDIT: TierCategory[] = [
  {
    title: "1. Animation Performance",
    tiers: {
      S: [
        { component: "Marquee (Tools)", rationale: "Pure CSS translateX keyframes — compositor-only, zero JS" },
        { component: "Skeleton Shimmer (WIP cards)", rationale: "CSS translateX only, no paint" },
        { component: "Card Spotlight", rationale: "CSS radial-gradient + opacity transition, GPU-friendly" },
      ],
      A: [
        { component: "BlurFade (all sections)", rationale: "Framer Motion opacity + translateY, compositor-friendly" },
        { component: "Skill Badge Glow/Ripple", rationale: "CSS pseudo-element with opacity transition + rAF-throttled mouse tracking" },
      ],
      B: [
        { component: "Hero Button Micro-interactions", rationale: "AnimatePresence icon swaps cause React reconciliation; whileHover scale triggers multiple repaints" },
        { component: "Card Tilt Hover", rationale: "rotateX/rotateY with perspective — uses will-change: transform but rotateX triggers paint on some browsers" },
        { component: "ProgressNav scroll handler", rationale: "Reads getBoundingClientRect on every scroll tick for 11 elements — potential layout thrashing" },
      ],
      C: [
        { component: "Certification Glass Cards", rationale: "backdrop-filter: blur(12px) is paint-heavy on every frame during scroll on lower-end GPUs" },
        { component: "canvas-confetti (Resume)", rationale: "Injects a <canvas> and runs a particle loop — acceptable as one-shot but heavy if spammed" },
      ],
    },
    fixes: [
      "Replace ProgressNav's per-scroll getBoundingClientRect loop with IntersectionObserver (one observer per section, no layout reads on scroll)",
      "Batch hero button animations: replace AnimatePresence mode='wait' icon swap with a single CSS color transition + content swap to avoid React reconciliation",
      "Add will-change: transform to .card-tilt only on mouseenter, remove on mouseleave to avoid permanent GPU layer allocation",
    ],
  },
  {
    title: "2. Component Loading Strategy",
    tiers: {
      S: [
        { component: "Work, Education, Certs, Skills, Tools, Projects, Blog, Hackathons, Contact", rationale: "React.lazy + Suspense + custom LazySection (200px IntersectionObserver margin) — zero CLS" },
        { component: "Hero, About", rationale: "Eager-loaded, above-the-fold, no shift" },
      ],
      A: [
        { component: "Images (Avatars, Logos)", rationale: 'loading="lazy" decoding="async" — native browser lazy loading' },
      ],
      B: [
        { component: "ProgressNav", rationale: "Always mounted, queries DOM for all 11 sections on mount even if they haven't lazy-loaded yet" },
        { component: "canvas-confetti", rationale: "Eagerly imported in HeroSection bundle even though it only fires on click" },
      ],
    },
    fixes: [
      "Dynamic-import canvas-confetti only on first click (import('canvas-confetti').then(...))",
      "Have ProgressNav gracefully skip null sections and re-check when lazy sections mount (use a MutationObserver or pass section refs)",
      "Add explicit width/height to Avatar images to reserve layout space and eliminate any micro-CLS",
    ],
  },
  {
    title: "3. Aesthetic & Color Sync",
    tiers: {
      S: [
        { component: "Work Section", rationale: "Clean card layout, subtle spotlight, muted alternating rows, consistent with dark/light palette" },
        { component: "Skills Section", rationale: "Categorized pills with glow effect — minimal yet interactive" },
      ],
      A: [
        { component: "Contact Section", rationale: "Clean centered layout, Magnetic wrapper adds polish" },
        { component: "Education Section", rationale: "Mirrors Work section card style — consistent" },
        { component: "Tools Marquee", rationale: "Grayscale-to-color hover is on-brand" },
      ],
      B: [
        { component: "Certifications", rationale: "Glass cards look good but backdrop-blur creates a visual inconsistency — no other section uses glassmorphism" },
        { component: "Hero Buttons", rationale: "Hardcoded hex colors (#FACC15, #22C55E, #0077B5) break the HSL design system" },
      ],
      C: [
        { component: "WIP Sections (Projects, Blog, Hackathons)", rationale: "Shimmer effect is nice but the sections look empty — no visual hierarchy beyond the shimmer" },
      ],
    },
    fixes: [
      "Replace hardcoded hero button hover colors with CSS custom properties derived from the HSL palette (e.g., --accent-email, --accent-phone), also use filled colors with appropriate shadow",
      "Unify Certifications cards with the same card-tilt style used in Work/Education instead of the standalone glass-card",
      "Add subtle category icons or section-specific accent tints to WIP skeleton cards",
    ],
  },
  {
    title: "4. Trust & Social Proof",
    tiers: {
      A: [
        { component: "Hero", rationale: "Links to email, phone, LinkedIn, resume download — all verifiable" },
        { component: "Contact", rationale: "Duplicates hero links with copy-to-clipboard" },
      ],
      B: [
        { component: "Work Section", rationale: "Company names present but no links to company pages or LinkedIn positions" },
        { component: "Education", rationale: "School names but no links to program pages" },
      ],
      C: [
        { component: "Certifications", rationale: "Plain text only — no Credly badges, no verification links" },
      ],
      D: [
        { component: "Projects", rationale: "WIP skeleton cards with no GitHub links, no live demos" },
        { component: "Blog/Hackathons", rationale: "Pure placeholder content with no external proof" },
      ],
    },
    fixes: [
      "Add Credly verification URLs to certifications and render them as clickable links with external-link icons",
      "Link each Work entry's company name to the company website or LinkedIn company page",
      "Add GitHub repo links to project cards (even if WIP, link to the repo)",
    ],
  },
  {
    title: "5. Readability & Density",
    tiers: {
      S: [
        { component: "About", rationale: "Clean paragraph, line-height: 1.6, text-pretty — excellent scannability" },
        { component: "Skills", rationale: "Categorized into 3 groups with uppercase labels — instant comprehension" },
      ],
      A: [
        { component: "Work", rationale: "Grouped by company, date ranges visible, hover for details" },
        { component: "Education", rationale: "Compact cards with degree + dates" },
      ],
      B: [
        { component: "Tools", rationale: "Marquee is visually appealing but auto-scrolling makes it hard to read specific tools; no way to see all tools at once" },
        { component: "Certifications", rationale: "2-column grid is good but all cards look identical — no visual differentiation" },
      ],
      C: [
        { component: "Contact", rationale: "text-3xl to text-5xl heading feels oversized relative to the rest of the minimal design" },
      ],
    },
    fixes: [
      "Add a 'pause on hover' tooltip or a static fallback view for the Tools marquee (already pauses on hover — add a visible 'hover to pause' hint)",
      "Reduce the Contact heading size to text-2xl / sm:text-3xl to match the rest of the page hierarchy",
      "Add cert issuer or date to certification cards for visual differentiation",
    ],
  },
  {
    title: "6. Interactive Micro-interactions",
    tiers: {
      S: [
        { component: "Email Button", rationale: "Icon swap (Mail → MailOpen) + tilt is delightful and communicates intent" },
        { component: "Resume Button", rationale: "Shimmer sweep + confetti on download is memorable" },
      ],
      A: [
        { component: "Phone Button", rationale: "Vibration effect is clever, green color matches intent" },
        { component: "LinkedIn Button", rationale: "Heartbeat scale + brand-blue is appropriate" },
        { component: "Skill Badges", rationale: "Glow + ripple on click feels responsive" },
        { component: "Work/Education Cards", rationale: "Directional popover + spotlight is polished" },
      ],
      B: [
        { component: "Tools Marquee Items", rationale: "Only grayscale-to-color on hover; no click action" },
        { component: "Certification Cards", rationale: "Hover lift is generic (scale: 1.02, y: -2) — same effect on every card" },
        { component: "Contact Buttons", rationale: "Magnetic wrapper is subtle but copy-to-clipboard feedback is animate-scale-in only — could use a toast" },
      ],
      C: [
        { component: "ProgressNav Dots", rationale: "Click-to-scroll works but dots have no hover feedback beyond the label appearing" },
      ],
    },
    fixes: [
      "Add a subtle scale or ring pulse to ProgressNav dots on hover",
      "Make certification cards link somewhere on click (Credly) rather than being dead-end hover effects",
      "Add a tooltip or small toast notification for Contact copy actions instead of the floating badge",
    ],
  },
  {
    title: "7. Cyber-Thematic Vibe",
    tiers: {
      A: [
        { component: "Skills Section", rationale: "'Offensive Security', 'Defensive Security', 'Compliance' categories feel professional and domain-specific" },
        { component: "Tools Marquee", rationale: "Security tool names + emoji icons convey the domain well" },
        { component: "Work Section", rationale: "Spotlight effect has a subtle 'scanning' feel" },
      ],
      B: [
        { component: "Hero", rationale: "Typewriter effect with security-themed phrases is good but the waving hand emoji softens the tech vibe" },
        { component: "Overall Typography", rationale: "System fonts are clean but lack the 'terminal/tech' feel a monospace accent would add" },
      ],
      C: [
        { component: "Color Palette", rationale: "Default shadcn blue-gray — no cyber-specific accent (e.g., green terminal, deep navy, neon accents)" },
        { component: "WIP Sections", rationale: "Generic skeleton shimmer — could use a 'loading terminal' or 'scanning' motif" },
      ],
    },
    fixes: [
      "Add a subtle monospace font only for data labels (dates, categories, cert names) while keeping body text as system sans-serif",
      "Introduce a secondary accent color (e.g., terminal green hsl(142, 71%, 45%)) for interactive highlights and hover states",
      "Replace the generic shimmer on WIP cards with a 'scanning line' animation (horizontal line sweep) for a more security-themed feel",
    ],
  },
];

/* ─── Tier colour map ────────────────────────────────────────────────────── */

const TIER_STYLES: Record<
  Grade,
  { label: string; bar: string; badge: string; text: string }
> = {
  S: { label: "S", bar: "bg-yellow-400/20 border-yellow-400/40", badge: "bg-yellow-400 text-yellow-950", text: "text-yellow-700 dark:text-yellow-300" },
  A: { label: "A", bar: "bg-green-500/20 border-green-500/40", badge: "bg-green-500 text-white", text: "text-green-700 dark:text-green-300" },
  B: { label: "B", bar: "bg-blue-500/20 border-blue-500/40", badge: "bg-blue-500 text-white", text: "text-blue-700 dark:text-blue-300" },
  C: { label: "C", bar: "bg-orange-400/20 border-orange-400/40", badge: "bg-orange-400 text-orange-950", text: "text-orange-700 dark:text-orange-300" },
  D: { label: "D", bar: "bg-red-500/20 border-red-500/40", badge: "bg-red-500 text-white", text: "text-red-700 dark:text-red-300" },
  F: { label: "F", bar: "bg-red-800/20 border-red-800/40", badge: "bg-red-800 text-white", text: "text-red-800 dark:text-red-400" },
};

const ORDERED_GRADES: Grade[] = ["S", "A", "B", "C", "D", "F"];

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function AuditDashboard() {
  return (
    <main className="min-h-dvh flex flex-col gap-10 py-12 pb-24 px-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to portfolio
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Full-Site Audit Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Visual tier-list grading of every section and component across 7 audit categories.
          </p>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-2 pt-1">
          {ORDERED_GRADES.map((g) => {
            const s = TIER_STYLES[g];
            return (
              <span
                key={g}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded ${s.badge}`}
              >
                {s.label}
              </span>
            );
          })}
          <span className="text-xs text-muted-foreground self-center">= tier grades</span>
        </div>
      </div>

      {/* Categories */}
      {AUDIT.map((category) => (
        <section key={category.title} className="flex flex-col gap-4">
          <h2 className="text-base font-semibold border-b pb-2">{category.title}</h2>

          {/* Tier rows */}
          <div className="flex flex-col gap-2">
            {ORDERED_GRADES.filter((g) => category.tiers[g]).map((grade) => {
              const items = category.tiers[grade]!;
              const style = TIER_STYLES[grade];
              return (
                <div
                  key={grade}
                  className={`flex gap-3 items-start border rounded-lg px-3 py-2.5 ${style.bar}`}
                >
                  {/* Grade badge */}
                  <span
                    className={`shrink-0 w-7 h-7 rounded flex items-center justify-center text-xs font-bold ${style.badge}`}
                    aria-label={`Grade ${grade}`}
                  >
                    {grade}
                  </span>
                  {/* Component pills */}
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {items.map((item) => (
                      <span
                        key={item.component}
                        title={item.rationale}
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium cursor-help ${style.text} border-current/20`}
                      >
                        {item.component}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fix recommendations */}
          <div className="rounded-lg border bg-muted/30 px-4 py-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Top 3 Fixes
            </p>
            <ol className="flex flex-col gap-1.5 list-decimal list-inside">
              {category.fixes.map((fix, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-snug">
                  {fix}
                </li>
              ))}
            </ol>
          </div>
        </section>
      ))}

      {/* Implementation status note */}
      <section className="rounded-lg border border-[var(--accent-cyber)]/30 bg-[var(--accent-cyber)]/5 px-4 py-4">
        <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--accent-cyber)" }}>
          Implementation Status
        </h2>
        <ul className="flex flex-col gap-1 text-sm text-muted-foreground list-disc list-inside">
          <li>✅ Cat 1 Fix 1 — ProgressNav rebuilt with IntersectionObserver</li>
          <li>✅ Cat 1 Fix 3 — dynamic <code>will-change: transform</code> on ProjectCard mouseenter/mouseleave</li>
          <li>✅ Cat 2 Fix 2 — ProgressNav skips null sections via MutationObserver re-check</li>
          <li>✅ Cat 2 Fix 3 — explicit <code>width</code>/<code>height</code> added to Avatar images</li>
          <li>✅ Cat 3 Fix 1 — <code>--accent-email</code>, <code>--accent-phone</code>, <code>--accent-linkedin</code> CSS vars added</li>
          <li>✅ Cat 3 Fix 2 — CertificationsSection uses same row card style as Work/Education</li>
          <li>✅ Cat 4 Fix 1 — Credly verification URLs render as clickable links with external-link icon</li>
          <li>✅ Cat 4 Fix 2 — Work company names linked to company URLs</li>
          <li>✅ Cat 4 Fix 3 — Project links already rendered via <code>links[]</code> on ProjectCard</li>
          <li>✅ Cat 5 Fix 2 — Contact heading reduced to text-2xl sm:text-3xl</li>
          <li>✅ Cat 5 Fix 3 — Certification issuer + issued/expires dates added</li>
          <li>✅ Cat 6 Fix 1 — ProgressNav dots get ring-pulse animation on hover</li>
          <li>✅ Cat 6 Fix 2 — Certification cards link to Credly on click</li>
          <li>✅ Cat 6 Fix 3 — Contact section copy-to-clipboard with check-mark visual feedback</li>
          <li>✅ Cat 7 Fix 1 — <code>data-label</code> class with <code>font-mono</code> applied to date elements</li>
          <li>✅ Cat 7 Fix 2 — <code>--accent-cyber</code> (terminal green) CSS var; applied to skill badge hover rings</li>
          <li>✅ Cat 7 Fix 3 — <code>scanning-card</code> / <code>scan-line</code> CSS animation keyframes added in globals.css</li>
          <li>⏭️ Cat 1 Fix 2 — No AnimatePresence hero buttons in current template (N/A)</li>
          <li>⏭️ Cat 2 Fix 1 — canvas-confetti not in project; resume button not yet added (N/A)</li>
          <li>⏭️ Cat 3 Fix 3 — WIP skeleton cards do not exist in current template (N/A)</li>
          <li>⏭️ Cat 5 Fix 1 — Tools marquee does not exist in current template (N/A)</li>
        </ul>
      </section>
    </main>
  );
}
