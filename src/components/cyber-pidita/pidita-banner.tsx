"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaFemale,
  FaPhoneAlt,
  FaRupeeSign,
  FaSearchLocation,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

/** Har banner kitni der screen par rahega (10 seconds). */
const ROTATE_MS = 10_000;

interface BannerCta {
  label: string;
  href: string;
  primary?: boolean;
  icon?: React.ReactNode;
}

interface PiditaBanner {
  id: string;
  tag: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  ctas: BannerCta[];
  /** public/banners/ me padi asli photograph. */
  photo: string;
  /** Screen-reader ke liye photo ka description. */
  photoAlt: string;
  /** Crop karte waqt photo ka kaunsa hissa dikhe. */
  focus: string;
  /** Photo ke upar chadhaya jaane wala rang ka tint. */
  tint: string;
  /** Upar wali chhoti pill aur icon badge ka style. */
  chip: string;
  /** Primary CTA button ka style. */
  primaryBtn: string;
  /** Neeche wali countdown bar ka rang. */
  bar: string;
}

const BANNERS: PiditaBanner[] = [
  {
    id: "financial-fraud",
    tag: "Banking & Financial Fraud",
    title: "Money gone? The first hour matters most",
    desc: "UPI, OTP, card or fake loan app fraud — report it on 1930 within the Golden Hour and the money can still be frozen and returned.",
    icon: <FaRupeeSign />,
    ctas: [
      { label: "Call 1930 now", href: "tel:1930", primary: true, icon: <FaPhoneAlt size={11} /> },
      { label: "File online", href: "https://cybercrime.gov.in" },
    ],
    photo: "/banners/financial-fraud.jpg",
    photoAlt: "A person holding a bank card while typing at a computer",
    focus: "object-[62%_32%]",
    tint: "bg-gradient-to-r from-[#2b0508]/95 via-[#160309]/70 to-red-900/25",
    chip: "border-red-400/50 bg-red-950/70 text-red-300",
    primaryBtn: "bg-red-500 text-white hover:bg-red-400 shadow-red-500/30",
    bar: "bg-red-400",
  },
  {
    id: "women-safety",
    tag: "Women's Safety · Fully Confidential",
    title: "Harassed by unknown calls? You are not alone",
    desc: "Obscene calls, messages, blackmail or sextortion — a woman's complaint is kept confidential. Report it on 181 or 1930 right away.",
    icon: <FaFemale />,
    ctas: [
      { label: "Women helpline 181", href: "tel:181", primary: true, icon: <FaPhoneAlt size={11} /> },
      { label: "Report confidentially", href: "https://cybercrime.gov.in" },
    ],
    photo: "/banners/women-safety.jpg",
    photoAlt: "A worried woman on a phone call",
    focus: "object-[72%_28%]",
    tint: "bg-gradient-to-r from-[#2a0526]/95 via-[#160318]/70 to-fuchsia-900/25",
    chip: "border-fuchsia-400/50 bg-fuchsia-950/70 text-fuchsia-200",
    primaryBtn: "bg-fuchsia-500 text-white hover:bg-fuchsia-400 shadow-fuchsia-500/30",
    bar: "bg-fuchsia-400",
  },
  {
    id: "identify-caller",
    tag: "Identify the Number",
    title: "Who called you? Find out first",
    desc: "Check any suspicious number's operator, circle and records right here. Accurate details make your complaint far stronger.",
    icon: <FaSearchLocation />,
    ctas: [
      { label: "Check a number", href: "#number-lookup-input", primary: true },
      { label: "Helpline 1930", href: "tel:1930" },
    ],
    photo: "/banners/identify-caller.jpg",
    photoAlt: "A glowing mobile phone keypad in the dark",
    focus: "object-center",
    tint: "bg-gradient-to-r from-[#020d16]/95 via-[#03121d]/70 to-cyan-900/25",
    chip: "border-cyan-400/50 bg-cyan-950/70 text-cyan-300",
    primaryBtn: "bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/30",
    bar: "bg-cyan-400",
  },
  {
    id: "awareness",
    tag: "Stay Alert",
    title: "Anyone asking for your OTP is not your friend",
    desc: "No bank, police officer or company ever asks for an OTP, PIN or CVV. Watch out for Digital Arrest, fake KYC updates and lottery scams.",
    icon: <FaExclamationTriangle />,
    ctas: [
      { label: "Emergency 112", href: "tel:112", primary: true, icon: <FaPhoneAlt size={11} /> },
      { label: "cybercrime.gov.in", href: "https://cybercrime.gov.in" },
    ],
    photo: "/banners/awareness.jpg",
    photoAlt: "A smartphone wrapped in a chain and padlock",
    focus: "object-[58%_50%]",
    tint: "bg-gradient-to-r from-[#231404]/95 via-[#160f03]/70 to-amber-900/25",
    chip: "border-amber-400/50 bg-amber-950/70 text-amber-200",
    primaryBtn: "bg-amber-400 text-black hover:bg-amber-300 shadow-amber-400/30",
    bar: "bg-amber-400",
  },
];

export function PiditaBanner() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  /** Timer jab bhi dobara shuru hota hai tab badhta hai — countdown bar isi se reset hoti hai. */
  const [cycle, setCycle] = React.useState(0);

  const goTo = React.useCallback((next: number) => {
    setIndex((next + BANNERS.length) % BANNERS.length);
    setCycle((c) => c + 1);
  }, []);

  React.useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => goTo(index + 1), ROTATE_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, cycle, goTo]);

  const banner = BANNERS[index];

  return (
    <section
      aria-label="Cyber victim support"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative z-20 w-full shrink-0 overflow-hidden border-b border-white/10 bg-[#050713]"
    >
      <div className="relative h-[292px] sm:h-[252px] md:h-[268px] w-full">
        {/* ================================================================= */}
        {/* PHOTOGRAPHS — chaaron ek saath load hoti hain aur crossfade karti  */}
        {/* hain, isliye slide badalte waqt koi pop-in nahi dikhta.            */}
        {/* ================================================================= */}
        {BANNERS.map((item, idx) => (
          <motion.div
            key={item.id}
            aria-hidden={idx !== index}
            initial={false}
            animate={{ opacity: idx === index ? 1 : 0, scale: idx === index ? 1 : 1.04 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={item.photo}
              alt={idx === index ? item.photoAlt : ""}
              fill
              sizes="100vw"
              loading={idx === 0 ? "eager" : undefined}
              fetchPriority={idx === 0 ? "high" : undefined}
              className={cn("object-cover", item.focus)}
            />
            {/* Text padhne layak rahe iske liye gehra scrim + rang ka tint */}
            <div className={cn("absolute inset-0", item.tint)} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050713] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
          </motion.div>
        ))}

        {/* Halka grid texture — baaki site ke cyber look se mel khata hai */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:38px_38px]" />

        {/* ================================================================= */}
        {/* TEXT — har slide par naye sire se andar slide hota hai            */}
        {/* ================================================================= */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, x: 26 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -26 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${BANNERS.length} — ${banner.tag}`}
              className="flex w-full items-center gap-5"
            >
              <div
                className={cn(
                  "hidden shrink-0 items-center justify-center rounded-2xl border text-2xl backdrop-blur-md md:flex md:h-16 md:w-16",
                  banner.chip
                )}
              >
                {banner.icon}
              </div>

              <div className="min-w-0 flex-1">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur-md",
                    banner.chip
                  )}
                >
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-current" />
                  {banner.tag}
                </span>

                <h2 className="mt-2 max-w-2xl text-lg font-black leading-snug tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-xl md:text-2xl">
                  {banner.title}
                </h2>

                <p className="mt-1.5 line-clamp-3 max-w-2xl text-[11.5px] leading-relaxed text-white/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] sm:text-xs md:text-sm">
                  {banner.desc}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {banner.ctas.map((cta) => {
                    const isExternal = cta.href.startsWith("http");
                    return (
                      <a
                        key={cta.href}
                        href={cta.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[11px] font-bold transition-all sm:text-xs",
                          cta.primary
                            ? cn("shadow-lg hover:scale-[1.03]", banner.primaryBtn)
                            : "border border-white/25 bg-black/40 text-white/90 backdrop-blur-md hover:border-white/50 hover:bg-black/60"
                        )}
                      >
                        {cta.icon}
                        <span>{cta.label}</span>
                        {isExternal && <FaExternalLinkAlt size={9} className="opacity-70" />}
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pichla / Agla */}
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous banner"
          className="absolute left-1.5 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 backdrop-blur-md transition-all hover:border-white/40 hover:text-white sm:flex"
        >
          <FaChevronLeft size={12} />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next banner"
          className="absolute right-1.5 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 backdrop-blur-md transition-all hover:border-white/40 hover:text-white sm:flex"
        >
          <FaChevronRight size={12} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
          {BANNERS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Banner ${idx + 1}: ${item.tag}`}
              aria-current={idx === index}
              className={cn(
                "h-1.5 cursor-pointer rounded-full transition-all duration-300",
                idx === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
              )}
            />
          ))}
        </div>

        {/* Photo credit — Pexels attribution zaroori nahi, phir bhi shishtachar */}
        <span className="absolute bottom-2.5 right-3 z-20 text-[9px] font-medium tracking-wide text-white/30">
          Photos: Pexels
        </span>
      </div>

      {/* 10 second countdown bar */}
      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/10">
        <motion.div
          key={`${banner.id}-${cycle}-${paused}`}
          initial={{ width: "0%" }}
          animate={{ width: paused ? "0%" : "100%" }}
          transition={{ duration: paused ? 0 : ROTATE_MS / 1000, ease: "linear" }}
          className={cn("h-full", banner.bar)}
        />
      </div>
    </section>
  );
}
