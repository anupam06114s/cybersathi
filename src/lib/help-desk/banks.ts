/**
 * Bharat ke banks ki helpline directory.
 *
 * SBI aur ICICI ke number un banks ki official site se verify kiye gaye hain.
 * Baaki banks ke number publicly listed toll-free numbers hain — har bank ke
 * saath uski official site ka link diya gaya hai taaki user khud verify kar sake.
 *
 * Zyadatar Indian banks ab region-wise number nahi rakhte, ek hi national
 * toll-free number chalta hai. Isliye contacts ko "kis kaam ke liye" ke hisaab
 * se baanta gaya hai — jo fraud victim ke liye region se zyada kaam ka hai.
 */

export type ContactKind = "general" | "fraud" | "other";

export interface BankContact {
  label: string;
  numbers: string[];
  kind: ContactKind;
}

export type BankGroup = "public" | "private" | "sfb";

export interface Bank {
  id: string;
  name: string;
  /** Logo circle me dikhne wale 2-3 akshar. */
  short: string;
  group: BankGroup;
  contacts: BankContact[];
  site?: string;
  /** Official site se verify kiya gaya hai ya nahi. */
  verified?: boolean;
}

export const BANK_GROUPS: { id: BankGroup; label: string }[] = [
  { id: "public", label: "Public Sector" },
  { id: "private", label: "Private" },
  { id: "sfb", label: "Small Finance" },
];

const CUSTOMER_CARE = "Customer care";
const FRAUD_LINE = "Fraud / unauthorised transaction";

export const BANKS: Bank[] = [
  // ------------------------------- PUBLIC -------------------------------
  {
    id: "sbi",
    name: "State Bank of India (SBI)",
    short: "SBI",
    group: "public",
    verified: true,
    site: "https://sbi.co.in",
    contacts: [
      { label: CUSTOMER_CARE, numbers: ["1800 1234", "1800 2100"], kind: "general" },
      { label: "Alternate toll-free", numbers: ["1800 112211", "1800 425 3800"], kind: "general" },
      { label: FRAUD_LINE, numbers: ["1800 1111 09"], kind: "fraud" },
      { label: "Senior citizens & differently abled", numbers: ["1800 8888"], kind: "other" },
      { label: "YONO app support", numbers: ["1800 1111 01"], kind: "other" },
    ],
  },
  {
    id: "pnb",
    name: "Punjab National Bank (PNB)",
    short: "PNB",
    group: "public",
    site: "https://www.pnbindia.in",
    contacts: [
      { label: CUSTOMER_CARE, numbers: ["1800 180 2222", "1800 103 2222"], kind: "general" },
    ],
  },
  {
    id: "bob",
    name: "Bank of Baroda",
    short: "BOB",
    group: "public",
    site: "https://www.bankofbaroda.in",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 5700", "1800 5000"], kind: "general" }],
  },
  {
    id: "canara",
    name: "Canara Bank",
    short: "CB",
    group: "public",
    site: "https://canarabank.com",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 1030"], kind: "general" }],
  },
  {
    id: "union",
    name: "Union Bank of India",
    short: "UBI",
    group: "public",
    site: "https://www.unionbankofindia.co.in",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 2222 44"], kind: "general" }],
  },
  {
    id: "indian-bank",
    name: "Indian Bank",
    short: "IB",
    group: "public",
    site: "https://www.indianbank.in",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 4250 0000"], kind: "general" }],
  },
  {
    id: "central-bank",
    name: "Central Bank of India",
    short: "CBI",
    group: "public",
    site: "https://www.centralbankofindia.co.in",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 22 1911"], kind: "general" }],
  },
  {
    id: "boi",
    name: "Bank of India",
    short: "BOI",
    group: "public",
    site: "https://bankofindia.co.in",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 220 229"], kind: "general" }],
  },
  {
    id: "iob",
    name: "Indian Overseas Bank (IOB)",
    short: "IOB",
    group: "public",
    site: "https://www.iob.in",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 425 4445"], kind: "general" }],
  },
  {
    id: "uco",
    name: "UCO Bank",
    short: "UCO",
    group: "public",
    site: "https://www.ucobank.com",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 103 0123"], kind: "general" }],
  },
  {
    id: "psb",
    name: "Punjab & Sind Bank",
    short: "PSB",
    group: "public",
    site: "https://punjabandsindbank.co.in",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 419 8300"], kind: "general" }],
  },
  {
    id: "bom",
    name: "Bank of Maharashtra",
    short: "BOM",
    group: "public",
    site: "https://bankofmaharashtra.in",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 233 4526"], kind: "general" }],
  },

  // ------------------------------ PRIVATE -------------------------------
  {
    id: "hdfc",
    name: "HDFC Bank",
    short: "HDFC",
    group: "private",
    site: "https://www.hdfcbank.com",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 1600", "1800 2600"], kind: "general" }],
  },
  {
    id: "icici",
    name: "ICICI Bank",
    short: "ICICI",
    group: "private",
    verified: true,
    site: "https://www.icicibank.com",
    contacts: [
      { label: CUSTOMER_CARE, numbers: ["1800 1080"], kind: "general" },
      { label: FRAUD_LINE, numbers: ["1800 2662"], kind: "fraud" },
      { label: "While travelling abroad", numbers: ["+91 22 3366 7777"], kind: "other" },
    ],
  },
  {
    id: "axis",
    name: "Axis Bank",
    short: "AXIS",
    group: "private",
    site: "https://www.axisbank.com",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1860 419 5555", "1860 500 5555"], kind: "general" }],
  },
  {
    id: "kotak",
    name: "Kotak Mahindra Bank",
    short: "KMB",
    group: "private",
    site: "https://www.kotak.com",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1860 266 2666"], kind: "general" }],
  },
  {
    id: "indusind",
    name: "IndusInd Bank",
    short: "IIB",
    group: "private",
    site: "https://www.indusind.com",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1860 267 7777"], kind: "general" }],
  },
  {
    id: "yes",
    name: "YES Bank",
    short: "YES",
    group: "private",
    site: "https://www.yesbank.in",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 1200"], kind: "general" }],
  },
  {
    id: "federal",
    name: "Federal Bank",
    short: "FED",
    group: "private",
    site: "https://www.federalbank.co.in",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 425 1199"], kind: "general" }],
  },
  {
    id: "idfc",
    name: "IDFC FIRST Bank",
    short: "IDFC",
    group: "private",
    site: "https://www.idfcfirstbank.com",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 10 888"], kind: "general" }],
  },
  {
    id: "bandhan",
    name: "Bandhan Bank",
    short: "BDN",
    group: "private",
    site: "https://bandhanbank.com",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 258 8181"], kind: "general" }],
  },
  {
    id: "rbl",
    name: "RBL Bank",
    short: "RBL",
    group: "private",
    site: "https://www.rblbank.com",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["022 6232 7777"], kind: "general" }],
  },
  {
    id: "idbi",
    name: "IDBI Bank",
    short: "IDBI",
    group: "private",
    site: "https://www.idbibank.in",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 209 4324"], kind: "general" }],
  },
  {
    id: "karnataka",
    name: "Karnataka Bank",
    short: "KBL",
    group: "private",
    site: "https://karnatakabank.com",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 425 1444"], kind: "general" }],
  },
  {
    id: "kvb",
    name: "Karur Vysya Bank",
    short: "KVB",
    group: "private",
    site: "https://www.kvb.co.in",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1860 258 1916"], kind: "general" }],
  },
  {
    id: "cub",
    name: "City Union Bank",
    short: "CUB",
    group: "private",
    site: "https://www.cityunionbank.com",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["044 7122 5000"], kind: "general" }],
  },
  {
    id: "sib",
    name: "South Indian Bank",
    short: "SIB",
    group: "private",
    site: "https://www.southindianbank.com",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 425 1809"], kind: "general" }],
  },
  {
    id: "tmb",
    name: "Tamilnad Mercantile Bank",
    short: "TMB",
    group: "private",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 425 0426"], kind: "general" }],
  },
  {
    id: "csb",
    name: "CSB Bank",
    short: "CSB",
    group: "private",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 266 9090"], kind: "general" }],
  },
  {
    id: "dcb",
    name: "DCB Bank",
    short: "DCB",
    group: "private",
    site: "https://www.dcbbank.com",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["022 6899 7777"], kind: "general" }],
  },

  // --------------------------- SMALL FINANCE ----------------------------
  {
    id: "au",
    name: "AU Small Finance Bank",
    short: "AU",
    group: "sfb",
    site: "https://www.aubank.in",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 1200 1200"], kind: "general" }],
  },
  {
    id: "ujjivan",
    name: "Ujjivan Small Finance Bank",
    short: "USFB",
    group: "sfb",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 208 2121"], kind: "general" }],
  },
  {
    id: "equitas",
    name: "Equitas Small Finance Bank",
    short: "ESFB",
    group: "sfb",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 103 1222"], kind: "general" }],
  },
  {
    id: "jana",
    name: "Jana Small Finance Bank",
    short: "JANA",
    group: "sfb",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 2080"], kind: "general" }],
  },
  {
    id: "utkarsh",
    name: "Utkarsh Small Finance Bank",
    short: "UTK",
    group: "sfb",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 123 9878"], kind: "general" }],
  },
  {
    id: "esaf",
    name: "ESAF Small Finance Bank",
    short: "ESAF",
    group: "sfb",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 103 3723"], kind: "general" }],
  },
  {
    id: "capital",
    name: "Capital Small Finance Bank",
    short: "CSFB",
    group: "sfb",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 120 1600"], kind: "general" }],
  },
  {
    id: "unity",
    name: "Unity Small Finance Bank",
    short: "UNTY",
    group: "sfb",
    contacts: [{ label: CUSTOMER_CARE, numbers: ["1800 209 1122"], kind: "general" }],
  },
];

/** RBI ke apne channel — jab bank 30 din me shikayat na suljhaye. */
export const RBI_CONTACTS = {
  helpline: "14448",
  missedCall: "14440",
  cms: "https://cms.rbi.org.in",
  note: "If the bank has not resolved your complaint in 30 days, or you are not satisfied with its response, take it to the RBI Ombudsman.",
};

/** Telephone link ke liye number se space/dash hata dete hain. */
export function telHref(number: string): string {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}
