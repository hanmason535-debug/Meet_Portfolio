/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { DATA } from "@/data/resume";

/**
 * Cat 3 Fix 2: Uses the same card style as Work/Education (no standalone glass-card).
 * Cat 4 Fix 1: Each certification has a Credly verification link.
 * Cat 5 Fix 3: Shows issuer + issued/expires dates for visual differentiation.
 * Cat 6 Fix 2: Entire card is clickable → links to Credly.
 */

function CertLogo({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border bg-muted flex-none" />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none"
      onError={() => setError(true)}
    />
  );
}

export default function CertificationsSection() {
  return (
    <div className="flex flex-col gap-6">
      {DATA.certifications.map((cert) => (
        <Link
          key={cert.name}
          href={cert.credlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-x-3 justify-between group hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-x-3 flex-1 min-w-0">
            <CertLogo src={cert.logoUrl} alt={cert.issuer} />
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <div className="font-semibold leading-none flex items-center gap-2">
                {cert.name}
                {/* Cat 4 Fix 1: external-link icon signals a verifiable credential */}
                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
              </div>
              {/* Cat 5 Fix 3: issuer shown for visual differentiation */}
              <div className="font-sans text-sm text-muted-foreground">
                {cert.issuer}
              </div>
            </div>
          </div>
          {/* Cat 5 Fix 3: issued + expires dates rendered in monospace (data-label) */}
          <div className="data-label text-muted-foreground text-right flex-none">
            <span>
              {cert.issued}
              {cert.expires ? ` – ${cert.expires}` : ""}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
