import { parsePhoneNumberFromString } from "libphonenumber-js/max";

export interface ApiRecord {
  mobile?: string | null;
  name?: string | null;
  fname?: string | null;
  address?: string | null;
  alt?: string | null;
  circle?: string | null;
  id?: string | null;
  email?: string | null;
}

export interface ApiData {
  Main_Records?: ApiRecord[];
  Alt_Records?: ApiRecord[];
}

export interface RawApiResponse {
  status?: string;
  phone?: string;
  Data?: ApiData;
  error?: string;
  message?: string;
  [key: string]: unknown;
}

export interface PhoneLookupMetadata {
  query: string;
  cleanNumber: string;
  e164: string;
  international: string;
  national: string;
  countryCode: string | null;
  countryName: string | null;
  callingCode: string;
  numberType: string | null;
  valid: boolean;
  possible: boolean;
}

export interface PhoneLookupSuccess {
  ok: true;
  query: string;
  cleanNumber: string;
  metadata: PhoneLookupMetadata;
  apiData: ApiData;
  rawJson: RawApiResponse;
  mainCount: number;
  altCount: number;
  totalCount: number;
  lookedUpAt: string;
  notFound?: boolean;
  message?: string;
}

export interface PhoneLookupError {
  ok: false;
  query: string;
  cleanNumber?: string;
  error: string;
  rawJson?: RawApiResponse | null;
  metadata?: PhoneLookupMetadata;
}

export type PhoneLookupResponse = PhoneLookupSuccess | PhoneLookupError;

const TYPE_LABELS: Record<string, string> = {
  MOBILE: "Mobile",
  FIXED_LINE: "Fixed line",
  FIXED_LINE_OR_MOBILE: "Fixed line or mobile",
  TOLL_FREE: "Toll free",
  PREMIUM_RATE: "Premium rate",
  SHARED_COST: "Shared cost",
  VOIP: "VoIP",
  PERSONAL_NUMBER: "Personal number",
  PAGER: "Pager",
  UAN: "Universal access number",
  VOICEMAIL: "Voicemail",
};

let regionNames: Intl.DisplayNames | null = null;
export function countryNameFromCode(code: string | undefined): string | null {
  if (!code) return null;
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

/**
 * Parses and formats address strings, cleaning up '!' delimiters.
 */
export function formatAddress(rawAddress?: string | null): string {
  if (!rawAddress) return "Not Available";
  const parts = rawAddress
    .split("!")
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && p !== "." && p !== "-" && p !== "0" && p !== "! !");

  if (parts.length === 0) return rawAddress.trim() || "Not Available";
  return parts.join(", ");
}

/**
 * Address ko map ke layak banata hai.
 *
 * Telecom records me hisse aapas me chipke aate hain ("NoidaSector 100") aur
 * ek hi shehar do baar ghus jaata hai. Aise string ko na Google pehchanta hai
 * na Nominatim — isliye map par bhejne se pehle unhe alag karna zaroori hai.
 */
export function cleanAddressForMaps(rawAddress: string): string {
  const spaced = rawAddress
    // "NoidaSector" -> "Noida Sector"
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    // "Delhi110001" -> "Delhi 110001"
    .replace(/([A-Za-z])(\d{6})/g, "$1 $2")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const parts = spaced
    .split(", ")
    .map((part) => part.trim())
    .filter(Boolean);

  // Lagatar dohraav hata do ("Noida, Noida").
  return parts
    .filter((part, i) => part.toLowerCase() !== parts[i - 1]?.toLowerCase())
    .join(", ");
}

/**
 * Extracts digits only or clean phone number suitable for the API.
 */
export function cleanPhoneNumber(rawInput: string): string {
  const trimmed = rawInput.trim();
  // Remove non-digit characters except leading plus if any
  const digits = trimmed.replace(/\D/g, "");
  // If Indian 12 digits starting with 91, extract 10 digits
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  // If starting with 0 and length 11, extract 10 digits
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits || trimmed;
}

/**
 * Parses phone metadata locally using libphonenumber-js
 */
export function parseLocalPhoneMetadata(
  rawInput: string,
  defaultCountry: "IN" = "IN"
): PhoneLookupMetadata | null {
  const query = rawInput.trim();
  if (!query) return null;

  const phoneNumber = parsePhoneNumberFromString(
    query,
    query.startsWith("+") ? undefined : defaultCountry
  );

  const cleanNum = cleanPhoneNumber(query);

  if (!phoneNumber) {
    return {
      query,
      cleanNumber: cleanNum,
      e164: query,
      international: query,
      national: query,
      countryCode: "IN",
      countryName: "India",
      callingCode: "91",
      numberType: "Mobile",
      valid: cleanNum.length === 10,
      possible: cleanNum.length >= 7,
    };
  }

  const type = phoneNumber.getType() ?? null;

  return {
    query,
    cleanNumber: cleanNum,
    e164: phoneNumber.number,
    international: phoneNumber.formatInternational(),
    national: phoneNumber.formatNational(),
    countryCode: phoneNumber.country ?? null,
    countryName: countryNameFromCode(phoneNumber.country),
    callingCode: phoneNumber.countryCallingCode,
    numberType: type ? (TYPE_LABELS[type] ?? type) : null,
    valid: phoneNumber.isValid(),
    possible: phoneNumber.isPossible(),
  };
}

/**
 * Client-side helper to fetch phone details through our Next.js API route
 */
export async function fetchPhoneDetails(
  rawInput: string,
  signal?: AbortSignal
): Promise<PhoneLookupResponse> {
  const query = rawInput.trim();
  if (!query) {
    return { ok: false, query: "", error: "Please enter a valid phone number." };
  }

  try {
    const res = await fetch(`/api/lookup?number=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal,
    });

    const data = await res.json();

    if (!res.ok || data.ok === false) {
      return {
        ok: false,
        query,
        error: data.error || `Error fetching details (${res.status})`,
        rawJson: data.rawJson || data,
      };
    }

    return data as PhoneLookupSuccess;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, query, error: "Request was cancelled." };
    }
    return {
      ok: false,
      query,
      error:
        err instanceof Error
          ? err.message
          : "Failed to connect to the lookup service. Please try again.",
    };
  }
}
