"use client";

import * as React from "react";
import { FaExternalLinkAlt, FaPhoneAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";

/** Ek helpline — number ho to dial hota hai, link ho to naye tab me khulta hai. */
export function HelplineButton({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const isExternal = href?.startsWith("http") ?? false;
  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/80">
        {isExternal ? <FaExternalLinkAlt size={11} /> : <FaPhoneAlt size={11} />}
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-white/45">
          {label}
        </span>
        <span className="block truncate text-sm font-black text-white">{value}</span>
      </span>
    </>
  );

  const className =
    "flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10";

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={className}
    >
      {content}
    </a>
  );
}

const TONES = {
  info: "border-cyan-400/35 bg-cyan-950/40 text-cyan-100",
  good: "border-emerald-400/35 bg-emerald-950/40 text-emerald-100",
  warn: "border-amber-400/35 bg-amber-950/40 text-amber-100",
  bad: "border-red-400/35 bg-red-950/40 text-red-100",
} as const;

export type CalloutTone = keyof typeof TONES;

export function Callout({
  tone = "info",
  title,
  icon,
  children,
}: {
  tone?: CalloutTone;
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border p-3.5", TONES[tone])}>
      <p className="flex items-start gap-2 text-xs font-black sm:text-sm">
        {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
        <span>{title}</span>
      </p>
      {children && (
        <div className="mt-1.5 text-[11.5px] leading-relaxed opacity-85 sm:text-xs">
          {children}
        </div>
      )}
    </div>
  );
}

/** Panel ke andar ek section ka heading. */
export function SectionTitle({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-2.5">
      <h3 className="text-xs font-black uppercase tracking-[0.14em] text-white/70">
        {children}
      </h3>
      {hint && <p className="mt-0.5 text-[11px] text-white/45">{hint}</p>}
    </div>
  );
}

/** Numbered step list — dono guides me isi format me kadam dikhte hain. */
export function StepRow({
  index,
  title,
  detail,
  urgent,
  action,
}: {
  index: number;
  title: string;
  detail: string;
  urgent?: boolean;
  action?: { label: string; href: string };
}) {
  const isExternal = action?.href.startsWith("http") ?? false;

  return (
    <li
      className={cn(
        "relative rounded-xl border p-3.5",
        urgent
          ? "border-red-400/40 bg-red-950/30"
          : "border-white/12 bg-white/[0.03]"
      )}
    >
      <div className="flex gap-3">
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-black",
            urgent ? "bg-red-500 text-white" : "bg-white/12 text-white/80"
          )}
        >
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold leading-snug text-white">{title}</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-white/65 sm:text-xs">
            {detail}
          </p>
          {action && (
            <a
              href={action.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-2.5 py-1.5 text-[11px] font-bold text-cyan-200 transition-all hover:bg-cyan-500/20"
            >
              {isExternal ? <FaExternalLinkAlt size={9} /> : <FaPhoneAlt size={9} />}
              {action.label}
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
