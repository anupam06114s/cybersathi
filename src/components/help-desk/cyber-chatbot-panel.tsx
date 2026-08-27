"use client";

import * as React from "react";
import { FaListUl, FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";
import {
  FRAUD_KB,
  QUICK_ASKS,
  matchFraud,
  type FraudKbEntry,
} from "@/lib/help-desk/fraud-kb";
import { HelplineButton } from "./shared";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  /** Bot ka pakka jawab. */
  entry?: FraudKbEntry;
  /** Aur kya ho sakta hai — user galat match par doosra chun sake. */
  alternatives?: FraudKbEntry[];
  /** Kuch match na hone par poori list dikhate hain. */
  showAll?: boolean;
}

const GREETING: Message = {
  id: "greeting",
  role: "bot",
  text: "Hello, I am Cyber Sathi. Describe what happened in your own words — something like “money was debited through UPI” or “I keep getting obscene calls from an unknown number”. I will tell you exactly what to do next and where to complain.",
};

let messageCounter = 0;
const nextId = () => `m${++messageCounter}`;

export function CyberChatbotPanel() {
  const [messages, setMessages] = React.useState<Message[]>([GREETING]);
  const [input, setInput] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);

  // Pehle render par scroll nahi karna — warna modal khulte hi body jhatka khata hai.
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const ask = React.useCallback((rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    const matches = matchFraud(text);
    const bot: Message = matches.length
      ? {
          id: nextId(),
          role: "bot",
          text: `This sounds like a case of “${matches[0].entry.title}”.`,
          entry: matches[0].entry,
          alternatives: matches.slice(1).map((m) => m.entry),
        }
      : {
          id: nextId(),
          role: "bot",
          text: "I could not quite place that. Pick your problem from the list below, or try describing it in different words.",
          showAll: true,
        };

    setMessages((prev) => [...prev, { id: nextId(), role: "user", text }, bot]);
    setInput("");
  }, []);

  const pickEntry = React.useCallback((entry: FraudKbEntry) => {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", text: entry.title },
      {
        id: nextId(),
        role: "bot",
        text: `Here is what to do about “${entry.title}” —`,
        entry,
      },
    ]);
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Messages — apne andar scroll karte hain, poora widget nahi */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} onPick={pickEntry} />
        ))}
        <div ref={endRef} />
      </div>

      {/* Quick asks — sirf shuru me */}
      {messages.length === 1 && (
        <div className="shrink-0 px-4 pb-2">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-white/40">
            Common questions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_ASKS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                className="cursor-pointer rounded-full border border-indigo-400/35 bg-indigo-950/40 px-3 py-1.5 text-[11px] font-semibold text-indigo-200 transition-all hover:border-indigo-400 hover:bg-indigo-900/50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex shrink-0 gap-2 border-t border-white/10 bg-[#080b1a] p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your problem..."
          className="h-11 min-w-0 flex-1 rounded-xl border border-white/15 bg-black/50 px-3.5 text-sm text-white outline-none transition-all placeholder:text-white/35 focus:border-indigo-400/60"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send"
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-indigo-500 text-white transition-all hover:bg-indigo-400 disabled:opacity-40"
        >
          <FaPaperPlane size={13} />
        </button>
      </form>
    </div>
  );
}

function MessageBubble({
  message,
  onPick,
}: {
  message: Message;
  onPick: (entry: FraudKbEntry) => void;
}) {
  const isUser = message.role === "user";

  return (
    // Entrance CSS se hota hai, motion se nahi — agar JS animation kisi wajah se
    // na chale to message chhupa nahi rehna chahiye.
    <div className={cn("animate-dev-pop flex gap-2.5", isUser && "flex-row-reverse")}>
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px]",
          isUser ? "bg-white/10 text-white/70" : "bg-indigo-500/25 text-indigo-200"
        )}
      >
        {isUser ? <FaUser size={11} /> : <FaRobot size={12} />}
      </span>

      <div className={cn("min-w-0 max-w-[88%]", isUser && "text-right")}>
        <div
          className={cn(
            "inline-block rounded-2xl px-3.5 py-2.5 text-left text-[12.5px] leading-relaxed",
            isUser
              ? "rounded-tr-sm bg-indigo-500/20 text-white"
              : "rounded-tl-sm border border-white/12 bg-white/[0.04] text-white/85"
          )}
        >
          {message.text}
        </div>

        {message.entry && <AnswerCard entry={message.entry} />}

        {message.alternatives && message.alternatives.length > 0 && (
          <div className="mt-2">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-white/40">
              Not this? Maybe one of these
            </p>
            <div className="flex flex-wrap gap-1.5">
              {message.alternatives.map((entry) => (
                <ChipButton key={entry.id} onClick={() => onPick(entry)}>
                  {entry.title}
                </ChipButton>
              ))}
            </div>
          </div>
        )}

        {message.showAll && (
          <div className="mt-2">
            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-white/40">
              <FaListUl size={9} />
              Every type of fraud
            </p>
            <div className="flex flex-wrap gap-1.5">
              {FRAUD_KB.map((entry) => (
                <ChipButton key={entry.id} onClick={() => onPick(entry)}>
                  {entry.title}
                </ChipButton>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChipButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-white/70 transition-all hover:border-indigo-400/60 hover:bg-indigo-950/50 hover:text-indigo-200"
    >
      {children}
    </button>
  );
}

function AnswerCard({ entry }: { entry: FraudKbEntry }) {
  return (
    <div className="mt-2 rounded-2xl border border-indigo-400/25 bg-indigo-950/25 p-3.5 text-left">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-indigo-500/25 px-2 py-0.5 text-[9.5px] font-bold text-indigo-200">
          {entry.category}
        </span>
        {entry.severity === "high" && (
          <span className="rounded-full bg-red-500/25 px-2 py-0.5 text-[9.5px] font-bold text-red-200">
            Act immediately
          </span>
        )}
      </div>

      <p className="mt-2 text-[12px] leading-relaxed text-white/75">{entry.what}</p>

      <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-white/45">
        What to do
      </p>
      <ol className="mt-1.5 flex flex-col gap-1.5">
        {entry.steps.map((step, i) => (
          <li key={step} className="flex gap-2 text-[12px] leading-relaxed text-white/80">
            <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded bg-indigo-500/30 text-[9.5px] font-black text-indigo-100">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-white/45">
        Where to complain
      </p>
      <div className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {entry.helplines.map((helpline) => (
          <HelplineButton key={helpline.value} {...helpline} />
        ))}
      </div>
    </div>
  );
}
