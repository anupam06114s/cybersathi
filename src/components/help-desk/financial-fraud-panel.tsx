"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaChevronRight,
  FaFileAlt,
  FaRedo,
  FaTimesCircle,
} from "react-icons/fa";
import {
  FRAUD_TYPES,
  REQUIRED_DOCUMENTS,
  TIME_WINDOWS,
  buildActionPlan,
  type FraudType,
  type TimeWindow,
} from "@/lib/help-desk/fraud-flow";
import { Callout, SectionTitle, StepRow } from "./shared";
import { cn } from "@/lib/utils";

const QUESTIONS = ["Type of fraud", "How long ago", "Bank informed?"];

export function FinancialFraudPanel() {
  const [fraudType, setFraudType] = React.useState<FraudType | null>(null);
  const [timeWindow, setTimeWindow] = React.useState<TimeWindow | null>(null);
  const [toldBank, setToldBank] = React.useState<boolean | null>(null);

  // Kaunsa sawaal ab dikhana hai — 3 ka matlab jawab taiyaar hai.
  const step = fraudType === null ? 0 : timeWindow === null ? 1 : toldBank === null ? 2 : 3;

  const reset = () => {
    setFraudType(null);
    setTimeWindow(null);
    setToldBank(null);
  };

  const goBack = () => {
    if (toldBank !== null) setToldBank(null);
    else if (timeWindow !== null) setTimeWindow(null);
    else setFraudType(null);
  };

  return (
    <div className="p-4 sm:p-5">
      {/* Progress */}
      <div className="mb-4 flex items-center gap-1.5">
        {QUESTIONS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col gap-1.5">
            <span
              className={cn(
                "h-1 rounded-full transition-colors duration-300",
                i < step ? "bg-red-400" : i === step ? "bg-red-400/50" : "bg-white/12"
              )}
            />
            <span
              className={cn(
                "text-[9px] font-bold uppercase tracking-wide transition-colors",
                i <= step ? "text-white/60" : "text-white/25"
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {step === 0 && (
            <div>
              <SectionTitle hint="Pick whichever is closest to what happened">
                What kind of fraud happened to you?
              </SectionTitle>
              <div className="flex flex-col gap-2">
                {FRAUD_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFraudType(type)}
                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/12 bg-white/[0.03] p-3.5 text-left transition-all hover:border-red-400/50 hover:bg-red-950/30"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-bold text-white">
                        {type.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-white/50">
                        {type.hint}
                      </span>
                    </span>
                    <FaChevronRight
                      size={12}
                      className="shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-red-300"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <SectionTitle hint="This decides how likely you are to get the money back">
                How long ago did it happen?
              </SectionTitle>
              <div className="flex flex-col gap-2">
                {TIME_WINDOWS.map((window) => (
                  <button
                    key={window.id}
                    type="button"
                    onClick={() => setTimeWindow(window)}
                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/12 bg-white/[0.03] p-3.5 text-left transition-all hover:border-red-400/50 hover:bg-red-950/30"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-bold text-white">
                        {window.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-white/50">
                        {window.hint}
                      </span>
                    </span>
                    <FaChevronRight
                      size={12}
                      className="shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-red-300"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <SectionTitle hint="The date you notified the bank is what decides your liability">
                Have you already informed your bank?
              </SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setToldBank(true)}
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] p-5 transition-all hover:border-emerald-400/50 hover:bg-emerald-950/30"
                >
                  <FaCheckCircle size={22} className="text-emerald-400" />
                  <span className="text-[13px] font-bold text-white">Yes, informed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setToldBank(false)}
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] p-5 transition-all hover:border-red-400/50 hover:bg-red-950/30"
                >
                  <FaTimesCircle size={22} className="text-red-400" />
                  <span className="text-[13px] font-bold text-white">No, not yet</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && fraudType && timeWindow && toldBank !== null && (
            <ActionPlan
              fraudType={fraudType}
              timeWindow={timeWindow}
              toldBank={toldBank}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Neeche navigation */}
      {step > 0 && (
        <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3.5">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-[11px] font-bold text-white/70 transition-all hover:border-white/40 hover:text-white"
          >
            <FaArrowLeft size={10} />
            Back
          </button>
          {step === 3 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-[11px] font-bold text-white/70 transition-all hover:border-white/40 hover:text-white"
            >
              <FaRedo size={10} />
              Start over
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ActionPlan({
  fraudType,
  timeWindow,
  toldBank,
}: {
  fraudType: FraudType;
  timeWindow: TimeWindow;
  toldBank: boolean;
}) {
  const steps = React.useMemo(
    () => buildActionPlan(fraudType, timeWindow, toldBank),
    [fraudType, timeWindow, toldBank]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-white/12 bg-white/[0.03] p-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-white/45">
          Your case
        </p>
        <p className="mt-1 text-[13px] font-bold text-white">{fraudType.label}</p>
        <p className="text-[11px] text-white/55">
          {timeWindow.label} · bank {toldBank ? "informed" : "not informed yet"}
        </p>
      </div>

      <Callout tone={timeWindow.liability.tone} title={timeWindow.liability.title}>
        {timeWindow.liability.detail}
      </Callout>

      <div>
        <SectionTitle hint="Work through these in order, top to bottom">
          What to do now
        </SectionTitle>
        <ol className="flex flex-col gap-2">
          {steps.map((step, i) => (
            <StepRow
              key={`${step.title}-${i}`}
              index={i + 1}
              title={step.title}
              detail={step.detail}
              urgent={step.urgent}
              action={step.action}
            />
          ))}
        </ol>
      </div>

      <div>
        <SectionTitle hint="Keep these ready when you file">
          Documents you will need
        </SectionTitle>
        <ul className="flex flex-col gap-1.5">
          {REQUIRED_DOCUMENTS.map((doc) => (
            <li
              key={doc}
              className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-[11.5px] text-white/70"
            >
              <FaFileAlt size={11} className="mt-0.5 shrink-0 text-cyan-300/70" />
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
