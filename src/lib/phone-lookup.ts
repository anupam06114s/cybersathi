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
 * Indian location keywords — agar koi address part me ye milein to wo
 * geographic hai, person name nahi.
 */
const LOCATION_KEYWORDS = /\b(village|vill|vpo|post|tehsil|teh|dist|district|block|mandal|taluk|taluka|thana|ps|sector|colony|nagar|puram|pur|abad|ganj|garh|ghar|kheda|wadi|wala|mohalla|tola|ward|town|city|state|pradesh|bihar|jharkhand|odisha|maharashtra|rajasthan|gujarat|punjab|haryana|uttarakhand|uttar|madhya|andhra|telangana|karnataka|tamil|kerala|assam|bengal|sikkim|manipur|meghalaya|mizoram|nagaland|tripura|arunachal|goa|chhattisgarh|himachal|jammu|kashmir|ladakh|delhi|mumbai|kolkata|chennai|hyderabad|bangalore|bengaluru|pune|ahmedabad|jaipur|lucknow|kanpur|patna|indore|bhopal|ludhiana|agra|varanasi|allahabad|prayagraj|surat|nagpur|noida|gurgaon|gurugram|faridabad|ghaziabad|chandigarh|road|marg|chowk|bazaar|bazar|market|lane|gali|main|cross|circle|square|bridge|flyover|highway|nh|sh)\b/i;

/**
 * Pincode pattern — 6-digit Indian postal code.
 */
const PINCODE_RE = /\b\d{6}\b/;

/**
 * Address se sirf village / district / city / state / pincode nikaalti hai —
 * person ka naam ya flat number hata deti hai, taaki geocoding sahi ho.
 *
 * Telecom records ka address aksar aise aata hai:
 *   "Flat 1506!Ram Kumar!Village Khera!Dist Meerut!UP!250001"
 * Is function se output hoga: "Village Khera, Dist Meerut, UP, 250001"
 */
export function extractLocationForGeocoding(
  rawAddress?: string | null,
  fname?: string | null,
  name?: string | null
): string {
  if (!rawAddress) return "";

  // Split on '!' delimiters first, then commas
  let parts = rawAddress
    .split(/[!,]/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && p !== "." && p !== "-" && p !== "0");

  // Remove parts that match the person's name or father's name
  const namesToRemove = [fname, name]
    .filter(Boolean)
    .map((n) => n!.trim().toLowerCase())
    .filter((n) => n.length > 1);

  parts = parts.filter((part) => {
    const lower = part.toLowerCase();
    // Exact match with a name — skip it
    for (const n of namesToRemove) {
      if (lower === n) return false;
      // Also catch "S/O Ram Kumar", "D/O Sita", "W/O xyz" patterns
      if (/^[sdwc]\/o\s/i.test(part)) return false;
    }
    return true;
  });

  // Filter out parts that look like flat/tower/house numbers without location keywords
  const locationParts = parts.filter((part) => {
    // Keep if it contains a location keyword
    if (LOCATION_KEYWORDS.test(part)) return true;
    // Keep if it contains a pincode
    if (PINCODE_RE.test(part)) return true;
    // Keep if it looks like a state abbreviation (2-3 uppercase letters)
    if (/^[A-Z]{2,3}$/.test(part.trim())) return true;
    // Discard short numeric parts (flat no, tower no, etc.)
    if (/^\d{1,4}$/.test(part.trim())) return false;
    // Discard parts that start with flat/tower/house/room/floor
    if (/^(flat|tower|house|room|floor|bldg|building|plot|no|h\.no|hno)\b/i.test(part))
      return false;
    // Keep if it has 2+ words (likely a place name)
    if (part.trim().split(/\s+/).length >= 2) return true;
    // Keep longer single words (likely place names)
    if (part.trim().length >= 4) return true;
    return false;
  });

  // If we stripped too aggressively, fall back to pincode + India
  if (locationParts.length === 0) {
    const pincode = rawAddress.match(PINCODE_RE)?.[0];
    return pincode ? `${pincode}, India` : "";
  }

  // Clean and deduplicate
  const cleaned = cleanAddressForMaps(locationParts.join(", "));
  return cleaned || "";
}

/**
 * Do coordinates ke beech compass direction (N, NE, E, SE, S, SW, W, NW)
 * nikaalta hai — bearing ke hisaab se.
 */
export function compassBearing(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): string {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLon = toRad(toLon - fromLon);
  const lat1 = toRad(fromLat);
  const lat2 = toRad(toLat);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;

  const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
  const idx = Math.round(bearing / 45) % 8;
  return DIRS[idx];
}

/**
 * Haversine formula se do coordinates ke beech ka straight-line distance
 * (in km) nikaalta hai.
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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
