"use client";

import * as React from "react";
import { FaExternalLinkAlt, FaLock, FaShieldAlt } from "react-icons/fa";
import { Callout, HelplineButton, SectionTitle, StepRow } from "./shared";

const HELPLINES = [
  { label: "Women Helpline", value: "181", href: "tel:181" },
  { label: "National Commission for Women", value: "14490", href: "tel:14490" },
  { label: "Police Women Helpline", value: "1091", href: "tel:1091" },
  { label: "Emergency", value: "112", href: "tel:112" },
  { label: "Cyber Crime", value: "1930", href: "tel:1930" },
  { label: "Childline", value: "1098", href: "tel:1098" },
];

const CRIME_TYPES = [
  "Obscene calls or messages",
  "Video call blackmail (sextortion)",
  "Morphed photos or deepfakes",
  "Fake profiles in your name",
  "Online stalking",
  "Threats to leak private photos",
  "Grooming a child online",
];

const STEPS = [
  {
    title: "First of all — do not delete anything",
    detail:
      "Wiping the chats, call log and messages in anger or fear is the single biggest mistake. That is your evidence. Screenshot everything first — the number, the profile link, and the date and time should be visible.",
    urgent: true,
  },
  {
    title: "Do not pay, under any circumstances",
    detail:
      "Once a blackmailer is paid, the demands never stop. In most cases they never publish anything — frightening you is their entire business model.",
    urgent: true,
  },
  {
    title: "Block them only after the evidence is safe",
    detail:
      "Take your screenshots, then block the number and the profile. Set your social media accounts to private for a few days.",
  },
  {
    title: "Call 181",
    detail:
      "This is the 24x7 women's helpline, and the people who answer are women too. They listen and route your complaint to the right authority.",
    action: { label: "Dial 181", href: "tel:181" },
  },
  {
    title: "File anonymously on cybercrime.gov.in",
    detail:
      "On the portal, choose 'Report Women/Child Related Crime'. For cases involving women and children you can file with your identity hidden — giving your name and address is not required.",
    action: { label: "Open the portal", href: "https://cybercrime.gov.in" },
  },
  {
    title: "If a private image has spread, use StopNCII",
    detail:
      "StopNCII.org never uploads your picture — it only creates a digital fingerprint (hash) of it, which lets Facebook, Instagram, TikTok and others block it automatically.",
    action: { label: "StopNCII.org", href: "https://stopncii.org" },
  },
  {
    title: "The police cannot refuse your complaint",
    detail:
      "For a cognisable offence against a woman, the police cannot refuse to register an FIR. You can walk into any police station regardless of where the offence took place — that is a Zero FIR.",
  },
];

export function WomenSafetyPanel() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5">
      <Callout
        tone="info"
        title="Your complaint can stay confidential"
        icon={<FaLock size={12} />}
      >
        For cyber crimes against women and children, the national portal offers an
        anonymous reporting option, and the 181 helpline is staffed by women. There is no
        reason to feel afraid or ashamed — none of this is your fault.
      </Callout>

      <div>
        <SectionTitle hint="Tap any number to call it directly">
          Immediate help
        </SectionTitle>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {HELPLINES.map((helpline) => (
            <HelplineButton key={helpline.value} {...helpline} />
          ))}
        </div>
      </div>

      <div>
        <SectionTitle hint="If any of these is happening, you have a case">
          All of these are crimes
        </SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {CRIME_TYPES.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-400/30 bg-fuchsia-950/40 px-2.5 py-1 text-[11px] font-semibold text-fuchsia-200"
            >
              <FaShieldAlt size={9} className="opacity-70" />
              {type}
            </span>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle hint="Work through these in order">What to do</SectionTitle>
        <ol className="flex flex-col gap-2">
          {STEPS.map((step, i) => (
            <StepRow key={step.title} index={i + 1} {...step} />
          ))}
        </ol>
      </div>

      <a
        href="https://cybercrime.gov.in"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-fuchsia-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:bg-fuchsia-400"
      >
        File on the national portal
        <FaExternalLinkAlt size={11} className="opacity-80" />
      </a>
    </div>
  );
}
