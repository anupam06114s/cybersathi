/**
 * Financial fraud ka guided flow.
 *
 * User se 3 sawaal poochte hain — kis tarah ka fraud, kitna time hua, bank ko
 * bataya ya nahi — aur usi hisaab se step-by-step action plan banate hain.
 *
 * Liability ke niyam RBI ke "Customer Protection — Limiting Liability of
 * Customers in Unauthorised Electronic Banking Transactions" circular se hain.
 */

export interface FraudType {
  id: string;
  label: string;
  hint: string;
  /** Is fraud ke liye alag se zaroori kadam. */
  extraSteps: ActionStep[];
}

export interface TimeWindow {
  id: string;
  label: string;
  hint: string;
  /** RBI ke hisaab se customer ki zimmedari. */
  liability: {
    tone: "good" | "warn" | "bad";
    title: string;
    detail: string;
  };
}

export interface ActionStep {
  title: string;
  detail: string;
  action?: { label: string; href: string };
  urgent?: boolean;
}

export const FRAUD_TYPES: FraudType[] = [
  {
    id: "upi",
    label: "Money debited via UPI or net banking",
    hint: "GPay, PhonePe, Paytm, BHIM or your bank app",
    extraSteps: [
      {
        title: "Raise a dispute inside the UPI app too",
        detail:
          "The app you paid from has a 'Raise Dispute' or 'Report Fraud' option. Pull the UPI Reference Number (UTR) from there — it is the single most important detail in your complaint.",
      },
      {
        title: "Escalate to NPCI if nobody resolves it",
        detail:
          "If both the app and the bank fail to resolve the case within 30 days, the complaint can be escalated to NPCI.",
        action: {
          label: "NPCI dispute redressal",
          href: "https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism",
        },
      },
    ],
  },
  {
    id: "card",
    label: "Unauthorised card transaction",
    hint: "Credit or debit card, even without an OTP",
    extraSteps: [
      {
        title: "Block the card right now",
        detail:
          "Call the bank or block it from the app. Note the exact time and the reference number — that is what proves when you reported it.",
        urgent: true,
      },
      {
        title: "Ask for a chargeback in writing",
        detail:
          "Card networks have a chargeback process. Lodge the chargeback request in writing with your bank — telling them over the phone is not enough.",
      },
    ],
  },
  {
    id: "loan-app",
    label: "Fake loan app or loan-related fraud",
    hint: "They took a processing fee, or are threatening you",
    extraSteps: [
      {
        title: "Preserve the threats and blackmail",
        detail:
          "Illegal loan apps steal your contacts and photos and threaten to shame you. Keep the call recordings, screenshots and messages — and do not pay out of fear.",
        urgent: true,
      },
      {
        title: "Revoke permissions, then uninstall",
        detail:
          "In your phone's Settings, remove that app's contacts, photos and storage permissions, then uninstall it. Take your evidence screenshots first.",
      },
      {
        title: "Report the unregistered app to RBI",
        detail: "RBI's Sachet portal accepts complaints about illegal lending apps.",
        action: { label: "RBI Sachet", href: "https://sachet.rbi.org.in" },
      },
    ],
  },
  {
    id: "investment",
    label: "Investment, trading or crypto fraud",
    hint: "Fake trading app, WhatsApp group tips, double-your-money scheme",
    extraSteps: [
      {
        title: "Complain to SEBI as well",
        detail:
          "If shares, IPOs or trading were involved, file a complaint on SEBI SCORES.",
        action: { label: "SEBI SCORES", href: "https://scores.sebi.gov.in" },
      },
      {
        title: "Do not delete the groups or chats",
        detail:
          "The WhatsApp/Telegram group, the admin's number, the app link and all screenshots are your primary evidence.",
      },
    ],
  },
  {
    id: "job-lottery",
    label: "Job, lottery or gift scam",
    hint: "Task scam, work from home, 'you have won' message",
    extraSteps: [
      {
        title: "Do not send another rupee",
        detail:
          "They will say 'just send a little more and everything will be released'. That is how the loss keeps growing. What is gone is gone — stop here.",
        urgent: true,
      },
    ],
  },
  {
    id: "digital-arrest",
    label: "Digital Arrest / fake police or CBI call",
    hint: "They frightened you on a video call and took a transfer",
    extraSteps: [
      {
        title: "Understand this — 'digital arrest' does not exist",
        detail:
          "No police officer, CBI, ED, Customs or TRAI official arrests anyone over a video call, and none of them ask for money. It is entirely a scam.",
        urgent: true,
      },
      {
        title: "Save the call recording and screenshots",
        detail:
          "The number or WhatsApp account they called from, the fake ID card, the fake notice — keep all of it. This is your strongest evidence.",
      },
    ],
  },
  {
    id: "kyc",
    label: "Fake KYC update",
    hint: "Through a link, or by making you install an app",
    extraSteps: [
      {
        title: "Remove any screen-sharing app immediately",
        detail:
          "If they made you install AnyDesk, TeamViewer or QuickSupport, uninstall it now — otherwise they can still see your phone.",
        urgent: true,
      },
      {
        title: "Change every banking password",
        detail:
          "Change your net banking password, UPI PIN and email password from a different, safe device.",
      },
    ],
  },
];

export const TIME_WINDOWS: TimeWindow[] = [
  {
    id: "golden",
    label: "Within the last hour",
    hint: "Golden Hour — the money can still be stopped",
    liability: {
      tone: "good",
      title: "Best possible position — highest chance of getting the money back",
      detail:
        "Call 1930 now. Reported this fast, the money can be frozen before it reaches the next account. Under RBI rules, informing the bank within 3 working days keeps your liability at zero.",
    },
  },
  {
    id: "day1",
    label: "Within 24 hours",
    hint: "Still inside the zero-liability window",
    liability: {
      tone: "good",
      title: "Still zero liability — do not delay any further",
      detail:
        "Under RBI rules, if you report an unauthorised transaction to your bank within 3 working days, the bank bears the loss and your liability is zero.",
    },
  },
  {
    id: "day3",
    label: "Within 3 days",
    hint: "Get it to the bank in writing today",
    liability: {
      tone: "warn",
      title: "Today matters — put it in writing now",
      detail:
        "Zero liability applies up to 3 working days. Reporting between 4 and 7 working days caps your liability — up to ₹10,000 on a savings account, ₹5,000 on a BSBD account, and ₹25,000 on a current account or a high-limit credit card.",
    },
  },
  {
    id: "late",
    label: "More than 3 days ago",
    hint: "Still worth filing — do it anyway",
    liability: {
      tone: "bad",
      title: "It is late, but the case still gets registered",
      detail:
        "Beyond 7 working days, liability is decided by the bank's board-approved policy. Filing still matters — not only for recovery, but to trace the accused and protect the next victim.",
    },
  },
];

/** Har case me lagne wale documents — cybercrime.gov.in par yahi maange jaate hain. */
export const REQUIRED_DOCUMENTS = [
  "Bank statement for the last 6 months of the affected account",
  "Copies or screenshots of the SMS messages for those transactions",
  "ID proof and address proof as held in your bank records",
  "The fraudster's number, UPI ID, account number or website link — whatever you have",
];

/**
 * Sawaalon ke jawab se poora action plan banata hai.
 * Pehle common steps, phir fraud-type ke apne steps, phir follow-up.
 */
export function buildActionPlan(
  fraudType: FraudType,
  timeWindow: TimeWindow,
  toldBank: boolean
): ActionStep[] {
  const steps: ActionStep[] = [
    {
      title: "Call 1930 right now",
      detail:
        "This is the national cyber financial crime helpline. Your complaint enters the system immediately and the process of freezing the receiving account begins. Write down the acknowledgement number you are given.",
      action: { label: "Dial 1930", href: "tel:1930" },
      urgent: true,
    },
  ];

  if (!toldBank) {
    steps.push({
      title: "Inform your bank now",
      detail:
        "Call customer care and ask them to stop the transaction and freeze the account or card. A phone call alone is not enough — also send an email or raise a complaint in the bank app, and get a ticket number. That date decides your liability.",
      urgent: true,
    });
  } else {
    steps.push({
      title: "Get a written acknowledgement from the bank",
      detail:
        "If you only told them over the phone, send an email now and get the ticket or complaint number in writing. That is what proves when you notified them.",
    });
  }

  steps.push(...fraudType.extraSteps);

  steps.push(
    {
      title: "File the complaint on cybercrime.gov.in",
      detail:
        "Choose the 'Report Financial Fraud' category. Keep the Acknowledgement Number you get after submitting — every follow-up is tracked through it.",
      action: { label: "Open the portal", href: "https://cybercrime.gov.in" },
    },
    {
      title: "Register an FIR at the cyber police station",
      detail:
        "Take a printout of the online complaint, your bank statement and the other documents to the nearest cyber crime police station. The police cannot refuse to register an FIR. Submit a copy of the FIR to your bank as well.",
    },
    {
      title: "Hold the bank to the 10-day and 90-day rules",
      detail:
        "Under RBI rules the bank must credit the amount back within 10 working days of being notified, and close the complaint within 90 days.",
    },
    {
      title: "Escalate to the RBI Ombudsman after 30 days",
      detail:
        "If the bank does not respond within 30 days, or you are not satisfied with the response, file on RBI's Complaint Management System. The helpline is 14448.",
      action: { label: "RBI CMS", href: "https://cms.rbi.org.in" },
    }
  );

  // Golden hour me time hi sab kuchh hai — sabse upar chetavani jodte hain.
  if (timeWindow.id === "golden") {
    steps[0] = {
      ...steps[0],
      detail:
        "You are inside the Golden Hour — this is the most valuable time you will get. Everything else can wait; dial 1930 first. Reported this fast, the money can be stopped before it moves to the next account.",
    };
  }

  return steps;
}
