/**
 * Chatbot ka knowledge base.
 *
 * Ye rule-based chatbot hai — koi AI API call nahi hoti, isliye ye offline bhi
 * chalta hai, free hai aur jawab hamesha wahi rehta hai jo yahan likha gaya hai
 * (koi cheez "bana" nahi sakta). User jo type karta hai use keywords se match
 * karke sabse milta-julta fraud dhoondha jata hai.
 */

export interface KbHelpline {
  label: string;
  value: string;
  href?: string;
}

export interface FraudKbEntry {
  id: string;
  title: string;
  category: string;
  severity: "high" | "medium";
  /** English aur Hinglish dono — user kaise bhi likhe. */
  keywords: string[];
  what: string;
  steps: string[];
  helplines: KbHelpline[];
}

const CYBER_1930: KbHelpline = { label: "Cyber Crime Helpline", value: "1930", href: "tel:1930" };
const PORTAL: KbHelpline = {
  label: "File Online",
  value: "cybercrime.gov.in",
  href: "https://cybercrime.gov.in",
};
const WOMEN_181: KbHelpline = { label: "Women Helpline", value: "181", href: "tel:181" };
const NCW_14490: KbHelpline = { label: "National Commission for Women", value: "14490", href: "tel:14490" };
const EMERGENCY_112: KbHelpline = { label: "Emergency", value: "112", href: "tel:112" };
const CHILD_1098: KbHelpline = { label: "Childline", value: "1098", href: "tel:1098" };
const RBI_14448: KbHelpline = { label: "RBI Complaints", value: "14448", href: "tel:14448" };

export const FRAUD_KB: FraudKbEntry[] = [
  {
    id: "upi-fraud",
    title: "Money debited through UPI",
    category: "Financial",
    severity: "high",
    keywords: [
      "upi", "gpay", "google pay", "phonepe", "paytm", "bhim", "money gone",
      "money debited", "paisa kat", "paise kat", "transaction", "debited",
      "qr", "scan", "collect request", "wrong transfer",
    ],
    what:
      "Fraudsters either send a fake QR code, or send a 'collect request' claiming they are sending you money. Remember — you never need to enter your PIN to RECEIVE money. A PIN is only required when money leaves your account.",
    steps: [
      "Call 1930 right now — within the Golden Hour the money can still be frozen.",
      "Open your UPI app and note down the UTR / Reference Number of that transaction.",
      "Use 'Raise Dispute' or 'Report Fraud' inside the same app.",
      "Email your bank so the complaint is in writing, and get a ticket number.",
      "File a complaint on cybercrime.gov.in under 'Report Financial Fraud'.",
    ],
    helplines: [CYBER_1930, PORTAL, RBI_14448],
  },
  {
    id: "otp-fraud",
    title: "I shared my OTP and lost money",
    category: "Financial",
    severity: "high",
    keywords: [
      "otp", "one time password", "shared otp", "told otp", "pin share",
      "cvv", "gave code", "otp de diya", "password share",
    ],
    what:
      "No bank, police officer or company will ever ask for your OTP, PIN, CVV or password. Whoever asked was a fraudster — this is not your fault, it is a well-rehearsed script.",
    steps: [
      "Call 1930 immediately.",
      "Phone your bank and get your card and net banking blocked.",
      "Change your net banking password, UPI PIN and email password.",
      "File a complaint on cybercrime.gov.in and save the acknowledgement number.",
      "Inform the bank in writing within 3 working days — that keeps your liability at zero.",
    ],
    helplines: [CYBER_1930, PORTAL, RBI_14448],
  },
  {
    id: "digital-arrest",
    title: "Digital Arrest / fake police or CBI call",
    category: "Threat",
    severity: "high",
    keywords: [
      "digital arrest", "cbi", "ed call", "police call", "customs", "parcel",
      "trai", "arrest", "warrant", "narcotics", "money laundering", "fake officer",
      "video call police", "aadhaar misuse case",
    ],
    what:
      "There is no such thing as a 'digital arrest' in Indian law. No police officer, CBI, ED, Customs or TRAI official arrests anyone over a video call, and none of them ever ask for money. This is 100% a scam.",
    steps: [
      "Hang up. Do not be afraid — they cannot touch you.",
      "Do not transfer a single rupee, no matter how much they threaten you.",
      "Save the call recording, screenshots, the fake ID card and any 'notice' they sent.",
      "If money has already gone, call 1930 immediately.",
      "File on cybercrime.gov.in and register an FIR at your nearest cyber police station.",
    ],
    helplines: [CYBER_1930, EMERGENCY_112, PORTAL],
  },
  {
    id: "sextortion",
    title: "Video call blackmail (sextortion)",
    category: "Women & Safety",
    severity: "high",
    keywords: [
      "sextortion", "blackmail", "video call", "nude", "obscene video",
      "recording", "viral", "photo leak", "screen record", "threatening to share",
      "extortion", "morphed video",
    ],
    what:
      "A stranger video calls, behaves obscenely, records the screen and then demands money threatening to 'make it viral'. In the vast majority of cases they never publish anything — frightening you IS their entire business.",
    steps: [
      "Do not pay. Paying once guarantees the demands will keep coming.",
      "Screenshot everything as evidence — number, profile, chat, payment demand — then block them.",
      "Set your social media profiles to private for a few days.",
      "Call 1930 or file on cybercrime.gov.in — women victims can report anonymously.",
      "If a private image has actually spread, StopNCII.org helps get it taken down.",
    ],
    helplines: [CYBER_1930, WOMEN_181, NCW_14490, PORTAL],
  },
  {
    id: "obscene-calls",
    title: "Obscene calls or messages",
    category: "Women & Safety",
    severity: "high",
    keywords: [
      "obscene call", "dirty call", "harassment", "harassing", "unknown number call",
      "repeated calls", "abusive", "stalking", "following", "vulgar messages",
      "creepy messages", "pareshan",
    ],
    what:
      "Repeated calls from an unknown number, obscene messages or online stalking are criminal offences. Your identity can be kept confidential when you complain.",
    steps: [
      "Do not delete the chats or call log — that is your evidence. Take screenshots first.",
      "Secure the evidence before you block the number.",
      "Call 181, the women's helpline — the people answering are women too.",
      "On cybercrime.gov.in choose 'Report Women/Child Related Crime', which has an anonymous option.",
      "If you feel in immediate danger, dial 112.",
    ],
    helplines: [WOMEN_181, NCW_14490, EMERGENCY_112, PORTAL],
  },
  {
    id: "morphed-photo",
    title: "Morphed photo or deepfake",
    category: "Women & Safety",
    severity: "high",
    keywords: [
      "morph", "morphed", "deepfake", "fake photo", "edited photo", "photoshop",
      "ai photo", "fake video", "face swap", "obscene edit",
    ],
    what:
      "Editing someone's photo to make it obscene and circulating it is a serious offence under both the IT Act and the BNS.",
    steps: [
      "Save the link and a screenshot of wherever the photo or video appears.",
      "Report it on that platform (Instagram, Facebook, X) and demand takedown.",
      "File on cybercrime.gov.in under the women/child category — anonymous reporting is available.",
      "StopNCII.org creates a hash of the image so multiple platforms block it at once.",
      "You can also call 1930 for guidance.",
    ],
    helplines: [WOMEN_181, NCW_14490, CYBER_1930, PORTAL],
  },
  {
    id: "loan-app",
    title: "Fake loan app threatening me",
    category: "Financial",
    severity: "high",
    keywords: [
      "loan app", "instant loan", "recovery agent", "threatening", "contact list",
      "defaming", "processing fee", "chinese app", "loan harassment",
      "messaged my contacts",
    ],
    what:
      "Illegal loan apps steal your contact list and photos, then message your relatives to shame you. This kind of recovery is itself unlawful — you are the victim here.",
    steps: [
      "Do not pay out of fear — the demands never end.",
      "Revoke the app's permissions (contacts, photos, storage), screenshot everything, then uninstall it.",
      "Preserve the threatening messages, call recordings and payment details.",
      "Call 1930 and file a complaint on cybercrime.gov.in.",
      "Report the unregistered lending app to RBI on sachet.rbi.org.in.",
    ],
    helplines: [CYBER_1930, RBI_14448, PORTAL],
  },
  {
    id: "investment-scam",
    title: "Investment, trading or crypto scam",
    category: "Financial",
    severity: "high",
    keywords: [
      "investment", "trading", "crypto", "bitcoin", "shares", "stock", "ipo",
      "profit", "double money", "whatsapp group", "telegram group", "tips",
      "withdrawal fee", "trading app",
    ],
    what:
      "A fake trading app shows you profits early to win your trust, then takes a large deposit and disappears. The 'pay tax to withdraw' step is part of the same trap.",
    steps: [
      "Do not send more money — the 'withdrawal fee' or 'tax' is part of the fraud.",
      "Save screenshots of the app, website link, WhatsApp/Telegram group and the admin's number.",
      "Call 1930 and file a complaint on cybercrime.gov.in.",
      "If shares or IPOs were involved, also complain on SEBI SCORES (scores.sebi.gov.in).",
      "Tell your bank so further transfers can be stopped.",
    ],
    helplines: [CYBER_1930, PORTAL, RBI_14448],
  },
  {
    id: "job-scam",
    title: "Job, task or work-from-home scam",
    category: "Financial",
    severity: "medium",
    keywords: [
      "job", "work from home", "task", "like video", "registration fee",
      "part time", "youtube like", "review task", "interview", "job offer",
      "earn daily", "telegram task",
    ],
    what:
      "Small tasks pay you real money at first to build trust, then you are asked to 'deposit to earn more' and the larger amount is stolen. A genuine employer never asks you for money.",
    steps: [
      "Do not make any further deposit.",
      "Save the chats, the task app, payment screenshots and the sender's number.",
      "Call 1930, then file a complaint on cybercrime.gov.in.",
      "Include the exact bank account or UPI ID you sent money to in your complaint.",
    ],
    helplines: [CYBER_1930, PORTAL],
  },
  {
    id: "lottery-gift",
    title: "Lottery, gift or prize scam",
    category: "Financial",
    severity: "medium",
    keywords: [
      "lottery", "gift", "prize", "lucky draw", "kbc", "you have won", "won",
      "coupon", "scratch card", "reward", "claim prize",
    ],
    what:
      "You cannot win a lottery you never entered. Asking for 'tax' or 'courier charges' is the entire point of the message.",
    steps: [
      "Do not pay any fee, tax or charge.",
      "Screenshot the message, the call and the sender's number.",
      "If money has gone, call 1930.",
      "File a complaint on cybercrime.gov.in.",
    ],
    helplines: [CYBER_1930, PORTAL],
  },
  {
    id: "fake-customer-care",
    title: "Fake customer care number",
    category: "Financial",
    severity: "high",
    keywords: [
      "customer care", "google search number", "helpline number", "fake number",
      "refund", "complaint number", "support number", "called customer care",
    ],
    what:
      "Fraudsters plant fake customer care numbers on Google. When you call, they get you to install a screen-sharing app or read out an OTP, and empty your account.",
    steps: [
      "Always take a customer care number from the company's official website or app — never from a Google search result.",
      "If you installed AnyDesk, TeamViewer or QuickSupport, uninstall it now.",
      "Call 1930 and inform your bank.",
      "Change all banking passwords and your UPI PIN from a different, safe device.",
    ],
    helplines: [CYBER_1930, PORTAL, RBI_14448],
  },
  {
    id: "screen-share",
    title: "Screen sharing or remote access app",
    category: "Technical",
    severity: "high",
    keywords: [
      "anydesk", "teamviewer", "quicksupport", "screen share", "remote access",
      "remote", "asked me to install", "app download", "mirroring",
    ],
    what:
      "These apps let the other person see your entire phone — your OTPs, your balance, your passwords. No bank ever asks you to install one.",
    steps: [
      "Uninstall the app now and take the phone off the internet for a while.",
      "Call your bank and block net banking and your cards.",
      "Change every password and your UPI PIN from a different, safe device.",
      "If money has gone, call 1930 and file on cybercrime.gov.in.",
    ],
    helplines: [CYBER_1930, PORTAL],
  },
  {
    id: "phishing-link",
    title: "Phishing link or fake website",
    category: "Technical",
    severity: "medium",
    keywords: [
      "link", "phishing", "fake website", "clicked link", "sms link", "apk",
      "unknown app install", "suspicious link", "whatsapp link",
    ],
    what:
      "A link arriving by SMS or WhatsApp opens a fake site that looks exactly like your bank. Everything you type there goes straight to the fraudster.",
    steps: [
      "Turn off the internet and uninstall any unknown app, especially a .apk you side-loaded.",
      "Change your banking password, UPI PIN and email password.",
      "Check your account statement for any transaction you do not recognise.",
      "Screenshot the link and report it on cybercrime.gov.in.",
      "If money was debited, call 1930.",
    ],
    helplines: [CYBER_1930, PORTAL],
  },
  {
    id: "kyc-fraud",
    title: "Fake KYC update",
    category: "Financial",
    severity: "high",
    keywords: [
      "kyc", "kyc update", "account will be blocked", "account closed",
      "aadhaar link", "pan update", "verification", "kyc pending", "kyc sms",
    ],
    what:
      "'Update your KYC or your account will be closed' by SMS or call is a scam. A real bank never completes KYC by sending you a link or asking for details over the phone.",
    steps: [
      "Do not click the link and do not share an OTP or any detail.",
      "Do KYC only at a branch or through the bank's official app or website.",
      "If you already shared details, call the bank immediately and get the account frozen.",
      "Call 1930 and file a complaint on cybercrime.gov.in.",
    ],
    helplines: [CYBER_1930, PORTAL, RBI_14448],
  },
  {
    id: "sim-swap",
    title: "SIM swap — my number went dead",
    category: "Technical",
    severity: "high",
    keywords: [
      "sim swap", "sim blocked", "no network", "no signal", "duplicate sim",
      "number not working", "sim deactivated", "lost network",
    ],
    what:
      "Fraudsters use your details to get a duplicate SIM from the telecom operator. Your number goes dead and your OTPs start reaching them instead.",
    steps: [
      "If your network disappears suddenly and stays down for hours, contact your telecom operator at once.",
      "From another phone, call your bank and block net banking and your cards.",
      "Change your email password — account recovery usually runs through email.",
      "Call 1930 and file a complaint on cybercrime.gov.in.",
    ],
    helplines: [CYBER_1930, PORTAL],
  },
  {
    id: "matrimonial",
    title: "Matrimonial or dating scam",
    category: "Social",
    severity: "medium",
    keywords: [
      "matrimonial", "dating", "shaadi", "marriage site", "girlfriend",
      "boyfriend", "romance", "love", "gift from abroad", "custom duty",
      "army officer", "foreign gift", "tinder",
    ],
    what:
      "Trust is built over months, then money is requested for a 'medical emergency', 'customs duty' or to 'release a gift'. The profile photo is usually stolen from someone else.",
    steps: [
      "Stop sending money immediately.",
      "Run the profile photo through Google Reverse Image Search — it usually belongs to someone else.",
      "Save screenshots of the chats, the profile and the payment details.",
      "Call 1930 and file a complaint on cybercrime.gov.in.",
    ],
    helplines: [CYBER_1930, PORTAL],
  },
  {
    id: "account-hack",
    title: "Social media or email account hacked",
    category: "Technical",
    severity: "medium",
    keywords: [
      "hack", "hacked", "account hacked", "facebook hacked", "instagram hacked",
      "whatsapp hacked", "password changed", "cannot login", "id hacked",
      "someone logged in",
    ],
    what:
      "Hackers use your account to ask your own friends and family for money. So recovering the account and warning your contacts are equally urgent.",
    steps: [
      "Run the platform's 'Forgot password' or account recovery flow.",
      "Change your email password first and turn on 2-Step Verification.",
      "Tell your contacts through another channel that the account is hacked and not to send money.",
      "File a complaint on cybercrime.gov.in.",
      "If anyone lost money through your account, call 1930 as well.",
    ],
    helplines: [CYBER_1930, PORTAL],
  },
  {
    id: "courier-scam",
    title: "Courier or parcel 'drugs found' call",
    category: "Threat",
    severity: "high",
    keywords: [
      "courier", "fedex", "parcel", "drugs", "customs", "narcotics",
      "parcel in your name", "package seized", "airport customs",
    ],
    what:
      "'Drugs were found in a parcel sent in your name' is used to frighten you, then a fake police officer takes over and gets you to transfer money for 'verification'.",
    steps: [
      "Hang up — no real courier company or customs officer makes such a call.",
      "Never send money for any kind of 'verification'.",
      "Save the number and the call recording.",
      "If money has gone, call 1930 and file a complaint on cybercrime.gov.in.",
    ],
    helplines: [CYBER_1930, EMERGENCY_112, PORTAL],
  },
  {
    id: "electricity-bill",
    title: "Electricity bill disconnection SMS",
    category: "Financial",
    severity: "medium",
    keywords: [
      "electricity", "bijli", "power bill", "bill", "connection cut", "meter",
      "disconnection", "power cut sms", "electricity sms",
    ],
    what:
      "'Your power will be cut tonight, call this number' is a scam SMS. On the call they get you to install a screen-sharing app and drain your account.",
    steps: [
      "Do not call the number given in the SMS.",
      "Get your electricity board's number from your actual bill or their official website.",
      "If you installed any app, uninstall it right away.",
      "If money has gone, call 1930 and file a complaint on cybercrime.gov.in.",
    ],
    helplines: [CYBER_1930, PORTAL],
  },
  {
    id: "child-safety",
    title: "Online crime involving a child",
    category: "Women & Safety",
    severity: "high",
    keywords: [
      "child", "kid", "minor", "grooming", "online game friend", "csam",
      "child photo", "my daughter", "my son", "school student",
    ],
    what:
      "Children are befriended through online games and social media and then trapped. These cases can also be reported anonymously.",
    steps: [
      "Do not scold the child — reassure them first that this is not their fault.",
      "Preserve the chats, the profile and screenshots; delete nothing.",
      "File anonymously on cybercrime.gov.in under 'Report Women/Child Related Crime'.",
      "Call 1098 Childline for help and counselling.",
      "If there is immediate danger, dial 112.",
    ],
    helplines: [CHILD_1098, EMERGENCY_112, CYBER_1930, PORTAL],
  },
  {
    id: "card-unauthorised",
    title: "Unauthorised card transaction",
    category: "Financial",
    severity: "high",
    keywords: [
      "credit card", "debit card", "unauthorised", "unauthorized",
      "card transaction", "chargeback", "international transaction",
      "card used", "did not do this transaction",
    ],
    what:
      "Under RBI rules, if you inform your bank within 3 working days of an unauthorised electronic transaction, your liability is zero and the bank has to return the money.",
    steps: [
      "Block the card immediately and note down the block reference number.",
      "File a written complaint with the bank asking for a chargeback — a phone call is not enough.",
      "Call 1930 and file a complaint on cybercrime.gov.in.",
      "The bank must credit the amount within 10 working days and close the case within 90 days.",
      "If it is unresolved after 30 days, escalate to RBI CMS (cms.rbi.org.in).",
    ],
    helplines: [CYBER_1930, RBI_14448, PORTAL],
  },
];

/** Chat me dikhne wale shuruaati suggestion chips. */
export const QUICK_ASKS = [
  "Money debited through UPI",
  "Getting obscene calls from an unknown number",
  "I got a digital arrest call",
  "Being blackmailed after a video call",
  "Loan app people are threatening me",
  "I shared my OTP",
];

/** Matching se pehle text ko saaf karte hain. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[।.,!?'"()\-_/\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface KbMatch {
  entry: FraudKbEntry;
  score: number;
}

/**
 * User ke sawaal ko knowledge base se match karta hai.
 *
 * Multi-word keyword poore vaakya me dhoondha jata hai, single word ko token
 * ke roop me — taaki "upi" aur "upiwala" jaise galat match na ho. Lambe keyword
 * ko zyada weight milta hai kyunki wo zyada specific hota hai.
 */
export function matchFraud(query: string, limit = 3): KbMatch[] {
  const text = normalize(query);
  if (!text) return [];

  const tokens = new Set(text.split(" "));

  const scored = FRAUD_KB.map((entry) => {
    let score = 0;

    for (const raw of entry.keywords) {
      const keyword = normalize(raw);
      if (!keyword) continue;

      if (keyword.includes(" ")) {
        if (text.includes(keyword)) score += 3;
      } else if (tokens.has(keyword)) {
        score += 2;
      } else if (keyword.length >= 5 && text.includes(keyword)) {
        score += 1;
      }
    }

    // Title me seedha match ho to wo sabse pakka signal hai.
    if (text.includes(normalize(entry.title))) score += 4;

    return { entry, score };
  });

  return scored
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
