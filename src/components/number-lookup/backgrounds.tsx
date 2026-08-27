const STARS = [
  { left: "8%", top: "18%", size: 2, delay: 0 },
  { left: "18%", top: "42%", size: 3, delay: 0.3 },
  { left: "27%", top: "12%", size: 2, delay: 0.6 },
  { left: "35%", top: "68%", size: 2, delay: 0.9 },
  { left: "44%", top: "30%", size: 3, delay: 0.2 },
  { left: "52%", top: "78%", size: 2, delay: 1.1 },
  { left: "61%", top: "22%", size: 2, delay: 0.5 },
  { left: "69%", top: "55%", size: 3, delay: 0.8 },
  { left: "77%", top: "15%", size: 2, delay: 1.3 },
  { left: "85%", top: "62%", size: 2, delay: 0.4 },
  { left: "14%", top: "82%", size: 2, delay: 1.5 },
  { left: "58%", top: "9%", size: 2, delay: 0.7 },
  { left: "91%", top: "38%", size: 3, delay: 1.0 },
  { left: "23%", top: "58%", size: 2, delay: 1.7 },
  { left: "40%", top: "88%", size: 2, delay: 0.15 },
];

const CODE_LINES = [
  "const lookup = async (number) => {",
  "  const parsed = parsePhoneNumber(number);",
  "  if (!parsed.isValid()) throw new Error('invalid');",
  "  return {",
  "    country: parsed.country,",
  "    type: parsed.getType(),",
  "    e164: parsed.number,",
  "  };",
  "};",
  "",
  "export function formatResult(result) {",
  "  return JSON.stringify(result, null, 2);",
  "}",
  "",
  "// cyber sathi — number-lookup v1.0",
];

export function CyberBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050814]">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.25) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          transform: "perspective(480px) rotateX(58deg) scale(1.7)",
          transformOrigin: "center bottom",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-transparent to-[#0a1130]" />
      <div className="absolute -top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/25 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="animate-cyber-scanline absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-300/0 via-cyan-300/25 to-cyan-300/0" />
    </div>
  );
}

export function CosmicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0b0620]">
      <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-fuchsia-600/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-violet-500/20 blur-2xl" />
      {STARS.map((star, i) => (
        <span
          key={i}
          className="animate-cosmic-twinkle absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function CodeBackground() {
  const text = [...CODE_LINES, ...CODE_LINES, ...CODE_LINES].join("\n");
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050806]">
      <pre className="absolute inset-0 m-0 scale-105 [filter:blur(6px)] select-none whitespace-pre-wrap p-3 font-mono text-[11px] leading-[15px] text-emerald-400/40">
        {text}
      </pre>
      <div className="animate-code-scanline absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-emerald-400/0 via-emerald-400/15 to-emerald-400/0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050806] via-transparent to-[#050806]/70" />
    </div>
  );
}

const SPACE_STARS = [
  { left: "5%", top: "12%", size: 2, delay: 0 },
  { left: "15%", top: "35%", size: 1.5, delay: 0.4 },
  { left: "22%", top: "80%", size: 2.5, delay: 0.8 },
  { left: "32%", top: "18%", size: 1, delay: 1.2 },
  { left: "45%", top: "65%", size: 3, delay: 0.2 },
  { left: "55%", top: "25%", size: 2, delay: 1.5 },
  { left: "68%", top: "78%", size: 1.5, delay: 0.6 },
  { left: "78%", top: "15%", size: 2.5, delay: 1.0 },
  { left: "88%", top: "50%", size: 2, delay: 0.3 },
  { left: "94%", top: "85%", size: 1.5, delay: 1.7 },
  { left: "12%", top: "60%", size: 2, delay: 0.9 },
  { left: "62%", top: "42%", size: 1, delay: 1.3 },
  { left: "82%", top: "68%", size: 2, delay: 0.7 },
  { left: "38%", top: "90%", size: 1.5, delay: 1.1 },
];

export function DeveloperBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#01040d] select-none">
      {/* Deep Space Nebulae */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-blue-950/40 blur-[100px]" />
      <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-indigo-950/40 blur-[100px]" />

      {/* Twinkling Cosmic Stars */}
      {SPACE_STARS.map((star, i) => (
        <span
          key={`star-${i}`}
          className="animate-cosmic-twinkle absolute rounded-full bg-white shadow-sm shadow-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Full-Card Covering Zooming & Rotating 3D Earth Globe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="animate-earth-zoom relative flex items-center justify-center">
          {/* Earth Globe Sphere */}
          <div
            className="animate-atmosphere-pulse relative h-[280px] w-[280px] max-w-[85vw] max-h-[85vw] sm:h-[480px] sm:w-[480px] lg:h-[600px] lg:w-[600px] rounded-full overflow-hidden shadow-[0_0_60px_20px_rgba(14,165,233,0.4)] ring-1 ring-sky-300/40"
            style={{
              background: "#0c2847",
            }}
          >
            {/* Base Rotating Earth Surface / Continents Layer */}
            <div
              className="animate-earth-rotate absolute inset-0 opacity-90"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse at 20% 30%, rgba(34,197,94,0.85) 0%, rgba(21,128,61,0.7) 18%, transparent 32%),
                  radial-gradient(ellipse at 65% 45%, rgba(22,101,52,0.85) 0%, rgba(15,76,38,0.7) 22%, transparent 38%),
                  radial-gradient(ellipse at 120% 30%, rgba(34,197,94,0.85) 0%, rgba(21,128,61,0.7) 18%, transparent 32%),
                  radial-gradient(ellipse at 165% 45%, rgba(22,101,52,0.85) 0%, rgba(15,76,38,0.7) 22%, transparent 38%),
                  radial-gradient(circle at 40% 70%, rgba(202,138,4,0.6) 0%, transparent 16%),
                  radial-gradient(circle at 140% 70%, rgba(202,138,4,0.6) 0%, transparent 16%),
                  linear-gradient(90deg, #075985 0%, #0284c7 25%, #0369a1 50%, #075985 75%, #0284c7 100%)
                `,
                backgroundSize: "200% 100%",
              }}
            />

            {/* Swirling White Clouds Layer */}
            <div
              className="animate-clouds-rotate absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.9) 0%, transparent 20%),
                  radial-gradient(ellipse at 75% 55%, rgba(255,255,255,0.85) 0%, transparent 25%),
                  radial-gradient(ellipse at 50% 80%, rgba(255,255,255,0.75) 0%, transparent 18%),
                  radial-gradient(ellipse at 130% 25%, rgba(255,255,255,0.9) 0%, transparent 20%),
                  radial-gradient(ellipse at 175% 55%, rgba(255,255,255,0.85) 0%, transparent 25%),
                  radial-gradient(ellipse at 150% 80%, rgba(255,255,255,0.75) 0%, transparent 18%)
                `,
                backgroundSize: "200% 100%",
              }}
            />

            {/* Polar Ice Caps */}
            <div className="absolute -top-3 inset-x-0 h-10 bg-gradient-to-b from-white via-white/80 to-transparent opacity-80" />
            <div className="absolute -bottom-3 inset-x-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent opacity-80" />

            {/* 3D Spherical Day/Night Shadow & Atmosphere Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.85) 30%, transparent 70%), linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(0,0,0,0.75) 80%)",
                boxShadow: "inset -25px -25px 60px 10px rgba(0,0,0,0.9)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Cinematic Subtle Contrast Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60 pointer-events-none" />
    </div>
  );
}
