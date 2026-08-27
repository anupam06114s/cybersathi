"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaChevronRight,
  FaExternalLinkAlt,
  FaPhoneAlt,
  FaSearch,
} from "react-icons/fa";
import {
  BANKS,
  BANK_GROUPS,
  RBI_CONTACTS,
  telHref,
  type Bank,
  type BankGroup,
} from "@/lib/help-desk/banks";
import { Callout, HelplineButton, SectionTitle } from "./shared";
import { cn } from "@/lib/utils";

type Filter = BankGroup | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  ...BANK_GROUPS.map((g) => ({ id: g.id as Filter, label: g.label })),
];

export function BankDirectoryPanel() {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [selected, setSelected] = React.useState<Bank | null>(null);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return BANKS.filter((bank) => {
      const matchesGroup = filter === "all" || bank.group === filter;
      const matchesQuery =
        !q ||
        bank.name.toLowerCase().includes(q) ||
        bank.short.toLowerCase().includes(q);
      return matchesGroup && matchesQuery;
    });
  }, [query, filter]);

  if (selected) {
    return <BankDetail bank={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5">
      <Callout tone="warn" title="If the bank does not resolve it in 30 days, go to RBI">
        {RBI_CONTACTS.note} RBI helpline{" "}
        <a href={telHref(RBI_CONTACTS.helpline)} className="font-black underline">
          {RBI_CONTACTS.helpline}
        </a>{" "}
        (9:30 am to 5:15 pm), or file online at{" "}
        <a
          href={RBI_CONTACTS.cms}
          target="_blank"
          rel="noopener noreferrer"
          className="font-black underline"
        >
          cms.rbi.org.in
        </a>{" "}
        .
      </Callout>

      {/* Search */}
      <div className="relative">
        <FaSearch
          size={12}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a bank..."
          className="h-11 w-full rounded-xl border border-white/15 bg-black/50 pl-9 pr-3 text-sm text-white outline-none transition-all placeholder:text-white/35 focus:border-emerald-400/60"
        />
      </div>

      {/* Group filters */}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "cursor-pointer rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all",
              filter === f.id
                ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-200"
                : "border-white/15 bg-white/[0.03] text-white/55 hover:border-white/35 hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Bank list */}
      {visible.length === 0 ? (
        <p className="py-8 text-center text-xs text-white/45">
          No bank matches that name.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {visible.map((bank) => (
            <button
              key={bank.id}
              type="button"
              onClick={() => setSelected(bank)}
              className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/12 bg-white/[0.03] p-3 text-left transition-all hover:border-emerald-400/50 hover:bg-emerald-950/30"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/25 to-cyan-500/25 text-[10px] font-black text-emerald-200">
                {bank.short}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-bold text-white">
                  {bank.name}
                </span>
                <span className="block truncate text-[11px] text-white/45">
                  {bank.contacts[0]?.numbers.join(" · ")}
                </span>
              </span>
              <FaChevronRight
                size={11}
                className="shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-300"
              />
            </button>
          ))}
        </div>
      )}

      <p className="text-[10.5px] leading-relaxed text-white/40">
        Note: most Indian banks no longer run separate region-wise numbers — a single
        national toll-free line handles everything — so the contacts here are grouped by
        purpose instead. Please confirm a number on the bank&rsquo;s official website
        before you call.
      </p>
    </div>
  );
}

function BankDetail({ bank, onBack }: { bank: Bank; onBack: () => void }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={bank.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-4 p-4 sm:p-5"
      >
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-[11px] font-bold text-white/70 transition-all hover:border-white/40 hover:text-white"
        >
          <FaArrowLeft size={10} />
          All banks
        </button>

        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/25 to-cyan-500/25 text-xs font-black text-emerald-200">
            {bank.short}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-white sm:text-base">{bank.name}</h3>
            {bank.verified && (
              <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300">
                <FaCheckCircle size={9} />
                Verified on the bank’s official site
              </span>
            )}
          </div>
        </div>

        {bank.contacts.map((contact) => (
          <div key={contact.label}>
            <SectionTitle>{contact.label}</SectionTitle>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {contact.numbers.map((number) => (
                <a
                  key={number}
                  href={telHref(number)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all",
                    contact.kind === "fraud"
                      ? "border-red-400/40 bg-red-950/30 hover:border-red-400"
                      : "border-white/15 bg-white/[0.04] hover:border-emerald-400/50"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      contact.kind === "fraud"
                        ? "bg-red-500/25 text-red-200"
                        : "bg-white/10 text-white/80"
                    )}
                  >
                    <FaPhoneAlt size={11} />
                  </span>
                  <span className="text-sm font-black text-white">{number}</span>
                </a>
              ))}
            </div>
          </div>
        ))}

        <Callout tone="bad" title="Call 1930 before you call the bank">
          If money has already left your account, report it to the cyber helpline 1930
          first — that is what starts the process of freezing it. Then inform the bank and
          make sure you get a ticket number in writing.
        </Callout>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <HelplineButton label="Cyber Crime Helpline" value="1930" href="tel:1930" />
          <HelplineButton
            label="RBI Complaints"
            value={RBI_CONTACTS.helpline}
            href={telHref(RBI_CONTACTS.helpline)}
          />
        </div>

        {bank.site && (
          <a
            href={bank.site}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-200 transition-all hover:bg-emerald-500/20"
          >
            Verify these on the official website
            <FaExternalLinkAlt size={10} className="opacity-70" />
          </a>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
