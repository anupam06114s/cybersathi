"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const WORDMARK = "CYBER SATHI";
const TAGLINE = "HAR KADAM BEKHAUF";

/** Har akshar itni der baad uchhalta hai — isse lehar jaisa effect banta hai. */
const LETTER_STAGGER_S = 0.05;

/**
 * Shield = suraksha, andar signal waves = phone call / cyber.
 * Gradient neele se laal jaata hai — police beacon wali pehchan.
 */
export function CyberSathiMark({ className }: { className?: string }) {
  // Ek page par kai logo ho sakte hain, isliye gradient id har instance me alag.
  const gradId = `cs-shield-${React.useId()}`;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="6"
          y1="3"
          x2="42"
          y2="45"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="42%" stopColor="#2563eb" />
          <stop offset="58%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#f87171" />
        </linearGradient>
      </defs>

      {/* Bahar wali shield */}
      <path
        d="M24 3 L42 10 V24 C42 34.2 34.2 41.8 24 45.2 C13.8 41.8 6 34.2 6 24 V10 Z"
        fill={`url(#${gradId})`}
      />
      {/* Andar ka gehra hissa, taaki signal saaf dikhe */}
      <path
        d="M24 7.4 L38 12.8 V24 C38 32 31.8 38 24 40.8 C16.2 38 10 32 10 24 V12.8 Z"
        fill="#050713"
        fillOpacity="0.78"
      />

      {/* Signal waves + dot */}
      <g transform="translate(0 -3)">
        <g
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M18.6 27.6 a7.6 7.6 0 0 1 10.8 0" />
          <path d="M14.6 23.2 a13.2 13.2 0 0 1 18.8 0" />
        </g>
        <circle cx="24" cy="32.4" r="2.7" fill="#ffffff" />
      </g>
    </svg>
  );
}

interface CyberSathiLogoProps {
  /** "sm" navbar ke liye, "lg" hero ke liye. */
  size?: "sm" | "lg";
  /** "row" me shield bagal me, "stack" me upar. */
  orientation?: "row" | "stack";
  className?: string;
}

const SIZES = {
  sm: {
    mark: "h-9 w-9 sm:h-10 sm:w-10",
    word: "text-base sm:text-lg tracking-[0.2em]",
    tagline: "text-[8px] sm:text-[9px] tracking-[0.34em]",
    gap: "gap-2.5 sm:gap-3",
    rule: "w-3 sm:w-4",
  },
  lg: {
    mark: "h-14 w-14 sm:h-16 sm:w-16",
    word: "text-2xl sm:text-4xl tracking-[0.18em]",
    tagline: "text-[10px] sm:text-xs tracking-[0.4em]",
    gap: "gap-3 sm:gap-4",
    rule: "w-6 sm:w-8",
  },
} as const;

export function CyberSathiLogo({
  size = "sm",
  orientation = "row",
  className,
}: CyberSathiLogoProps) {
  const s = SIZES[size];
  const isStack = orientation === "stack";

  return (
    <div
      aria-label="Cyber Sathi — Har Kadam Bekhauf"
      className={cn(
        "flex select-none items-center",
        s.gap,
        isStack ? "flex-col" : "flex-row",
        className
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-2xl animate-police-beacon",
          s.mark
        )}
      >
        <CyberSathiMark className="h-full w-full" />
      </span>

      <div className={cn("min-w-0", isStack && "text-center")}>
        {/* Wordmark — har akshar apni baari par uchhalta aur rang badalta hai */}
        <div
          aria-hidden="true"
          className={cn(
            "font-black leading-none whitespace-nowrap",
            s.word
          )}
        >
          {WORDMARK.split("").map((char, i) =>
            char === " " ? (
              <span key={`sp-${i}`} className="inline-block w-[0.55em]" />
            ) : (
              <span
                key={`${char}-${i}`}
                style={{ animationDelay: `${i * LETTER_STAGGER_S}s` }}
                className="inline-block text-blue-300 animate-police-blink animate-letter-jump"
              >
                {char}
              </span>
            )
          )}
        </div>

        {/* Tagline */}
        <div
          aria-hidden="true"
          className={cn(
            "mt-1.5 flex items-center gap-2",
            isStack && "justify-center"
          )}
        >
          <span
            className={cn(
              "h-px bg-gradient-to-r from-transparent to-blue-400/60",
              s.rule
            )}
          />
          <span
            className={cn(
              "font-bold uppercase text-white/60",
              s.tagline
            )}
          >
            {TAGLINE}
          </span>
          <span
            className={cn(
              "h-px bg-gradient-to-l from-transparent to-red-400/60",
              s.rule
            )}
          />
        </div>
      </div>
    </div>
  );
}
