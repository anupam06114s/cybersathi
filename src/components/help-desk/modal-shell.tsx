"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaTimes } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  /** Header ki pill/icon ka rang. */
  accent: string;
  children: React.ReactNode;
}

export function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  icon,
  accent,
  children,
}: ModalShellProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Escape se band ho aur peeche ka page scroll na ho.
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-white/15 bg-[#080b1a] shadow-2xl outline-none sm:max-h-[88dvh] sm:rounded-2xl"
          >
            <header className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-black/50 px-4 py-3.5 sm:px-5">
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg",
                  accent
                )}
              >
                {icon}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-black text-white sm:text-base">
                  {title}
                </h2>
                {subtitle && (
                  <p className="truncate text-[11px] text-white/55">{subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-white/60 transition-all hover:border-white/40 hover:text-white"
              >
                <FaTimes size={13} />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
