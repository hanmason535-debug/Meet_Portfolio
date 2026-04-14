"use client";
import { useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { DATA } from "@/data/resume";

/**
 * Cat 5 Fix 2: Heading reduced from text-3xl sm:text-5xl → text-2xl sm:text-3xl.
 * Cat 6 Fix 3: Email and phone show copy-to-clipboard with visual check-mark feedback.
 */

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable – silently fail.
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
    >
      {value}
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[var(--accent-cyber)]" aria-hidden />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden />
      )}
    </button>
  );
}

export default function ContactSection() {
  return (
    <div className="border rounded-xl p-10 relative">
      <div className="absolute -top-4 border bg-primary z-10 rounded-xl px-4 py-1 left-1/2 -translate-x-1/2">
        <span className="text-background text-sm font-medium">Contact</span>
      </div>
      <div className="absolute inset-0 top-0 left-0 right-0 h-1/2 rounded-xl overflow-hidden">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={2}
          gridGap={2}
          style={{
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>
      <div className="relative flex flex-col items-center gap-4 text-center">
        {/* Cat 5 Fix 2: reduced heading size for hierarchy consistency */}
        <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
          Get in Touch
        </h2>
        <p className="mx-auto max-w-lg text-muted-foreground text-balance">
          Want to chat? Just shoot me a dm{" "}
          <Link
            href={DATA.contact.social.X.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            with a direct question on twitter
          </Link>{" "}
          and I&apos;ll respond whenever I can. I will ignore all
          soliciting.
        </p>
        {/* Cat 6 Fix 3: quick-copy row for email and phone */}
        <div className="flex flex-wrap justify-center gap-4 pt-1">
          <CopyButton value={DATA.contact.email} label="email address" />
          <CopyButton value={DATA.contact.tel} label="phone number" />
        </div>
      </div>
    </div>
  );
}


