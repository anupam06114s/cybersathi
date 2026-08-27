"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface InteractiveSelectorPanel {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  background: React.ReactNode;
  content?: React.ReactNode;
  /** "caption" (default) pins content bottom-left above the label. "center" centers it. "fill" takes full height and width. */
  contentLayout?: "caption" | "center" | "fill";
}

interface InteractiveSelectorProps {
  panels: InteractiveSelectorPanel[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  className?: string;
}

export function InteractiveSelector({
  panels,
  activeIndex,
  onActiveIndexChange,
  className,
}: InteractiveSelectorProps) {
  const activePanel = panels[activeIndex] || panels[0];

  return (
    <div className={cn("flex h-full w-full flex-col gap-3", className)}>
      {/* =================================================================== */}
      {/* 1. MOBILE & DESKTOP HEADER NAVIGATION PILLS                         */}
      {/* =================================================================== */}
      <div className="flex w-full shrink-0 overflow-x-auto no-scrollbar rounded-2xl border border-white/10 bg-black/60 p-1.5 backdrop-blur-2xl shadow-xl">
        <div className="flex w-full min-w-max gap-1">
          {panels.map((panel, idx) => {
            const isActive = activeIndex === idx;
            return (
              <motion.button
                key={panel.id}
                type="button"
                onClick={() => onActiveIndexChange(idx)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors duration-200 z-10 cursor-pointer",
                  isActive
                    ? "text-white"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/25 via-indigo-500/25 to-fuchsia-500/25 border border-cyan-400/40 shadow-lg shadow-cyan-500/15"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                      mass: 0.8,
                    }}
                  />
                )}

                <div
                  className={cn(
                    "relative z-10 flex h-6 w-6 items-center justify-center transition-transform duration-300",
                    isActive ? "scale-110 text-cyan-300" : "text-white/60"
                  )}
                >
                  {panel.icon}
                </div>
                <span className="relative z-10 tracking-wide font-extrabold">{panel.title}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. MOBILE VIEW CONTAINER (< md screens)                             */}
      {/* =================================================================== */}
      <div className="flex md:hidden relative min-h-[540px] flex-1 w-full overflow-hidden rounded-2xl border border-white/15 bg-black/70 shadow-2xl backdrop-blur-2xl">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          {activePanel.background}
        </div>

        {/* Animated Content Transition with Motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`mobile-${activePanel.id}`}
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.985 }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 flex h-full w-full flex-col overflow-y-auto p-3.5 sm:p-5"
          >
            {activePanel.contentLayout === "center" ? (
              <div className="my-auto flex w-full flex-col items-center justify-center py-4">
                <div className="w-full max-w-lg">{activePanel.content}</div>
              </div>
            ) : (
              <div className="w-full min-h-full flex flex-col">{activePanel.content}</div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =================================================================== */}
      {/* 3. DESKTOP INTERACTIVE EXPANDING ACCORDION (>= md screens)          */}
      {/* =================================================================== */}
      <div className="hidden md:flex h-full min-h-[560px] w-full flex-row overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black/40">
        {panels.map((panel, index) => {
          const isActive = activeIndex === index;
          const isCentered = panel.contentLayout === "center";
          const isFill = panel.contentLayout === "fill";

          return (
            <motion.div
              key={panel.id}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              aria-label={panel.title}
              onClick={() => onActiveIndexChange(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onActiveIndexChange(index);
                }
              }}
              className={cn(
                "group relative min-w-16 cursor-pointer overflow-hidden border-r last:border-r-0 border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                isActive ? "border-white/30" : "hover:border-white/20"
              )}
              animate={{
                flexGrow: isActive ? 8.5 : 1.2,
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                flexShrink: 1,
                flexBasis: 0,
                zIndex: isActive ? 10 : 1,
                boxShadow: isActive
                  ? "0 25px 60px -15px rgba(0,0,0,0.85)"
                  : "0 10px 25px rgba(0,0,0,0.4)",
              }}
            >
              {/* Background Layer */}
              <div className="absolute inset-0">{panel.background}</div>

              {/* Bottom Gradient Overlay */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/95 via-black/55 to-transparent transition-opacity duration-500"
                style={{ opacity: isActive ? 1 : 0.85 }}
              />

              {/* Active Content Container */}
              <AnimatePresence>
                {isActive && panel.content && (
                  <motion.div
                    key={`content-${panel.id}`}
                    initial={{ opacity: 0, y: 14, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 14, scale: 0.985 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={cn(
                      "absolute inset-0 z-10 flex",
                      isFill
                        ? "items-start justify-start p-4 lg:p-6 pb-20 overflow-hidden"
                        : isCentered
                        ? "items-center justify-center p-4 lg:p-8 pb-20 overflow-y-auto"
                        : "items-end justify-start px-6 pb-24 overflow-y-auto"
                    )}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <div
                      className={cn(
                        "w-full",
                        isFill
                          ? "h-full overflow-hidden"
                          : isCentered
                          ? "max-w-xl"
                          : ""
                      )}
                    >
                      {panel.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Panel Tab Icon & Label */}
              <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 px-4 pb-5">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-black/60 shadow-lg backdrop-blur-md transition-all duration-300",
                    isActive
                      ? "border-cyan-400/50 bg-cyan-950/50 text-cyan-300 shadow-cyan-500/20"
                      : "group-hover:border-white/40 group-hover:bg-black/80"
                  )}
                >
                  {panel.icon}
                </motion.div>
                <div className="min-w-0 text-white">
                  <motion.div
                    animate={{
                      opacity: isActive ? 1 : 0,
                      x: isActive ? 0 : 16,
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="truncate text-base font-extrabold tracking-tight"
                  >
                    {panel.title}
                  </motion.div>
                  <motion.div
                    animate={{
                      opacity: isActive ? 1 : 0,
                      x: isActive ? 0 : 16,
                    }}
                    transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="truncate text-xs text-white/60"
                  >
                    {panel.description}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
