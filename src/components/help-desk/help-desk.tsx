"use client";

import * as React from "react";
import {
  FaArrowRight,
  FaFemale,
  FaFingerprint,
  FaKey,
  FaRupeeSign,
  FaUniversity,
} from "react-icons/fa";
import { ModalShell } from "./modal-shell";
import { WomenSafetyPanel } from "./women-safety-panel";
import { FinancialFraudPanel } from "./financial-fraud-panel";
import { BankDirectoryPanel } from "./bank-directory-panel";
import { cn } from "@/lib/utils";

type PanelId = "women" | "financial" | "banks";

interface Category {
  id: PanelId;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ReactNode;
  /** Card ka border + hover rang. */
  card: string;
  /** Icon tile ka rang. */
  tile: string;
  /** Modal header ke icon ka rang. */
  accent: string;
}

const CATEGORIES: Category[] = [
  {
    id: "women",
    title: "Women & Child Safety",
    subtitle: "Confidential reporting",
    desc: "Obscene calls, blackmail, morphed photos — anonymous complaints allowed",
    icon: <FaFemale />,
    card: "border-fuchsia-400/25 hover:border-fuchsia-400/70 hover:bg-fuchsia-950/25",
    tile: "border-fuchsia-400/40 bg-fuchsia-950/60 text-fuchsia-300",
    accent: "border-fuchsia-400/40 bg-fuchsia-950/60 text-fuchsia-300",
  },
  {
    id: "financial",
    title: "Financial Fraud",
    subtitle: "Guided complaint plan",
    desc: "Answer 3 questions and get a step-by-step plan for your case",
    icon: <FaRupeeSign />,
    card: "border-red-400/25 hover:border-red-400/70 hover:bg-red-950/25",
    tile: "border-red-400/40 bg-red-950/60 text-red-300",
    accent: "border-red-400/40 bg-red-950/60 text-red-300",
  },
  {
    id: "banks",
    title: "Bank Helpline Directory",
    subtitle: "All major Indian banks",
    desc: "Customer care and fraud reporting numbers, bank by bank",
    icon: <FaUniversity />,
    card: "border-emerald-400/25 hover:border-emerald-400/70 hover:bg-emerald-950/25",
    tile: "border-emerald-400/40 bg-emerald-950/60 text-emerald-300",
    accent: "border-emerald-400/40 bg-emerald-950/60 text-emerald-300",
  },
];

const MODALS: Record<
  PanelId,
  { title: string; subtitle: string; content: React.ReactNode }
> = {
  women: {
    title: "Women & Child Safety",
    subtitle: "Your complaint can stay confidential",
    content: <WomenSafetyPanel />,
  },
  financial: {
    title: "Financial Fraud",
    subtitle: "Answer 3 questions, get the full plan",
    content: <FinancialFraudPanel />,
  },
  banks: {
    title: "Bank Helpline Directory",
    subtitle: "Pick a bank to see every number",
    content: <BankDirectoryPanel />,
  },
};

export function HelpDesk() {
  const [open, setOpen] = React.useState<PanelId | null>(null);
  // Band hote waqt content mount rehna chahiye, warna exit animation nahi chalti.
  const [shown, setShown] = React.useState<PanelId>("women");

  const openPanel = React.useCallback((id: PanelId) => {
    setShown(id);
    setOpen(id);
  }, []);

  /** Track Fraudster — page par neeche number lookup tak le jaata hai. */
  const goToLookup = React.useCallback(() => {
    const input = document.getElementById("number-lookup-input");
    const target = input ?? document.getElementById("lookup-tool");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => input?.focus({ preventScroll: true }), 700);
  }, []);

  const active = MODALS[shown];
  const activeCategory = CATEGORIES.find((c) => c.id === shown)!;

  return (
    <section
      aria-label="Help desk"
      className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-8"
    >
      <div className="mb-4 text-center">
        <h2 className="text-lg font-black tracking-tight text-white sm:text-xl">
          What kind of problem are you facing?
        </h2>
        <p className="mt-1 text-[11.5px] text-white/55 sm:text-xs">
          Pick your category to get the full process — where to complain and how
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category, i) => (
          // Entrance CSS se — ye emergency helplines ka rasta hai, isse kabhi
          // kisi JS animation ke bharose chhupa nahi rehna chahiye.
          <button
            key={category.id}
            type="button"
            onClick={() => openPanel(category.id)}
            style={{ animationDelay: `${i * 0.06}s` }}
            className={cn(
              "group animate-dev-pop flex cursor-pointer flex-col gap-3 rounded-2xl border bg-black/40 p-4 text-left backdrop-blur-xl transition-all hover:-translate-y-1",
              category.card
            )}
          >
            <span
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border text-xl",
                category.tile
              )}
            >
              {category.icon}
            </span>

            <span className="flex-1">
              <span className="block text-[13.5px] font-black leading-snug text-white">
                {category.title}
              </span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-white/35">
                {category.subtitle}
              </span>
              <span className="mt-1.5 block text-[11.5px] leading-relaxed text-white/55">
                {category.desc}
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/50 transition-all group-hover:gap-2.5 group-hover:text-white">
              Open
              <FaArrowRight size={9} />
            </span>
          </button>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* KEY CARD — Track Fraudster                                           */}
      {/* ==================================================================== */}
      <button
        type="button"
        onClick={goToLookup}
        style={{ animationDelay: "0.24s" }}
        className="group animate-dev-pop relative mt-3 hover:-translate-y-1 flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-cyan-950/70 via-[#071a24] to-[#050713] p-4 text-left shadow-lg shadow-cyan-500/10 transition-all hover:border-cyan-300 sm:p-5"
      >
        {/* Key card ki chamak — hover par bayen se dayen jaati hai */}
        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-cyan-300/15 to-transparent transition-all duration-700 group-hover:left-full" />

        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/50 bg-cyan-950/70 text-2xl text-cyan-300 sm:h-14 sm:w-14">
          <FaFingerprint />
        </span>

        <span className="relative min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-950/60 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-cyan-300">
            <FaKey size={8} />
            Key Tool
          </span>
          <span className="mt-1.5 block text-base font-black leading-snug text-white sm:text-lg">
            Track the Fraudster
          </span>
          <span className="mt-0.5 block text-[11.5px] leading-relaxed text-cyan-100/65 sm:text-xs">
            Enter a suspicious number to pull its operator, circle and records instantly.
            These are the details that make a complaint stick.
          </span>
        </span>

        <span className="relative hidden shrink-0 items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-black text-black transition-all group-hover:bg-cyan-400 sm:inline-flex">
          Check the number
          <FaArrowRight size={10} />
        </span>
      </button>

      <ModalShell
          open={open !== null}
          onClose={() => setOpen(null)}
          title={active.title}
          subtitle={active.subtitle}
          icon={activeCategory.icon}
          accent={activeCategory.accent}
        >
          {active.content}
      </ModalShell>
    </section>
  );
}
