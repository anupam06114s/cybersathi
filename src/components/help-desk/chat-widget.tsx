"use client";

import * as React from "react";
import { FaCommentDots, FaRobot, FaTimes } from "react-icons/fa";
import { CyberChatbotPanel } from "./cyber-chatbot-panel";
import { cn } from "@/lib/utils";

/** Itni der baad "Need help?" wala bubble apne aap dikhta hai. */
const TEASER_DELAY_MS = 6000;

/** Aur itni der baad wo bubble apne aap hat jaata hai. */
const TEASER_VISIBLE_MS = 12000;

/**
 * Corner me tairta hua chat button — jaisa zyadatar websites par hota hai.
 * Poore page par rehta hai, isliye madad hamesha ek click door hai.
 */
export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [showTeaser, setShowTeaser] = React.useState(false);
  /** Ek baar khol liya to teaser dobara nahi aana chahiye. */
  const [everOpened, setEverOpened] = React.useState(false);

  React.useEffect(() => {
    if (everOpened) return;
    // Aata hai, thodi der rukta hai, phir apne aap chala jaata hai — page ka
    // content permanently dhakna nahi chahiye.
    const show = window.setTimeout(() => setShowTeaser(true), TEASER_DELAY_MS);
    const hide = window.setTimeout(
      () => setShowTeaser(false),
      TEASER_DELAY_MS + TEASER_VISIBLE_MS
    );
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [everOpened]);

  // Escape se band ho jaye.
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const toggle = () => {
    setOpen((prev) => !prev);
    setEverOpened(true);
    setShowTeaser(false);
  };

  return (
    <>
      {/* ================================================================== */}
      {/* CHAT PANEL — corner me docked, mobile par lagbhag poori screen      */}
      {/* ================================================================== */}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Cyber Sathi Chatbot"
          className="animate-chat-in fixed bottom-[86px] right-3 z-50 flex h-[min(560px,calc(100dvh-140px))] w-[calc(100vw-1.5rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-indigo-400/30 bg-[#080b1a] shadow-2xl shadow-indigo-500/20 sm:bottom-24 sm:right-6"
        >
          <header className="flex shrink-0 items-center gap-2.5 border-b border-white/10 bg-gradient-to-r from-indigo-950/80 to-[#080b1a] px-3.5 py-3">
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-400/40 bg-indigo-950/70 text-indigo-300">
              <FaRobot size={15} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#080b1a] bg-emerald-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-black text-white">
                Cyber Sathi Chatbot
              </p>
              <p className="truncate text-[10.5px] text-emerald-300/80">
                Online · answers in every fraud category
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-white/60 transition-all hover:border-white/40 hover:text-white"
            >
              <FaTimes size={12} />
            </button>
          </header>

          <div className="min-h-0 flex-1">
            <CyberChatbotPanel />
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* "Need help?" teaser bubble                                          */}
      {/* ================================================================== */}
      {showTeaser && !open && (
        <button
          type="button"
          onClick={toggle}
          className="animate-chat-in fixed bottom-[86px] right-3 z-50 max-w-[240px] cursor-pointer rounded-2xl rounded-br-sm border border-indigo-400/35 bg-[#0d1128] px-3.5 py-2.5 text-left shadow-xl shadow-indigo-500/15 sm:bottom-24 sm:right-6"
        >
          <span className="block text-[12px] font-bold text-white">
            Been scammed? Ask me.
          </span>
          <span className="mt-0.5 block text-[11px] leading-snug text-white/55">
            Tell me what happened and I will tell you where to complain.
          </span>
        </button>
      )}

      {/* ================================================================== */}
      {/* FLOATING BUTTON                                                     */}
      {/* ================================================================== */}
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Close chat" : "Open Cyber Sathi chatbot"}
        aria-expanded={open}
        className={cn(
          "group fixed bottom-4 right-3 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6",
          open
            ? "bg-white/10 text-white backdrop-blur-xl"
            : "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/40"
        )}
      >
        {/* Dhyaan kheenchne wali halki ring — band hone par hi chalti hai */}
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-indigo-500/40 [animation-duration:2.5s]" />
        )}
        <span className="relative">
          {open ? <FaTimes size={18} /> : <FaCommentDots size={22} />}
        </span>
      </button>
    </>
  );
}
