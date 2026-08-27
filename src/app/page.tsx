import { NumberLookup } from "@/components/number-lookup/number-lookup";
import { PiditaBanner } from "@/components/cyber-pidita/pidita-banner";
import { CyberSathiLogo } from "@/components/brand/cyber-sathi-logo";
import { HelpDesk } from "@/components/help-desk/help-desk";
import { ChatWidget } from "@/components/help-desk/chat-widget";

export default function Home() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#050713] text-white selection:bg-cyan-500/30 selection:text-white">
      {/* Top Navbar */}
      <header className="animate-fade-in-top z-30 flex shrink-0 flex-col items-center gap-2 border-b border-white/10 bg-black/50 px-3.5 py-2.5 backdrop-blur-xl sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-3 sm:px-6 sm:py-3.5">
        {/* Left — Live API status */}
        <div className="hidden sm:flex sm:items-center">
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-950/60 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400" />
            Live API
          </span>
        </div>

        {/* Brand — centered */}
        <CyberSathiLogo size="sm" />

        <div className="flex items-center justify-center gap-2 sm:justify-end">
          <a
            href="https://t.me/anupam0611"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-950/40 px-3 py-1.5 text-xs font-semibold text-sky-300 transition-all hover:bg-sky-900/60 hover:border-sky-300 shadow-sm"
          >
            <span>@anupam0611</span>
          </a>
        </div>
      </header>

      {/* Cyber Pidita Awareness Banner (auto-rotates every 10s) */}
      <PiditaBanner />

      {/* Problem categories — portal style, opens a guide per category */}
      <HelpDesk />

      {/* Main App Container */}
      <main
        id="lookup-tool"
        className="min-h-0 flex-1 p-2 sm:p-4 md:p-5 flex flex-col scroll-mt-20"
      >
        <NumberLookup />
      </main>

      {/* Floating chatbot — har page-scroll par corner me maujood */}
      <ChatWidget />
    </div>
  );
}
