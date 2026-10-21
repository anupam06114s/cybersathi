import { NextRequest, NextResponse } from "next/server";

/**
 * Address ko latitude/longitude me badalta hai.
 *
 * OpenStreetMap ke Nominatim ka istemal hota hai — free hai, koi API key nahi
 * chahiye. Ye call browser se seedhe nahi ki jaati kyunki Nominatim ki policy
 * ek pehchaan-yogya User-Agent maangti hai, jo browser set nahi karne deta.
 * Isliye server se jaati hai, jahan header sahi bheja ja sakta hai.
 */

export const runtime = "nodejs";
/** Ek hi address baar-baar geocode na ho — 24 ghante cache. */
export const revalidate = 86400;

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "CyberSathi/1.0 (cyber crime victim assistance tool)";
/** Nominatim ki policy: 1 request per second. Isliye attempts seemit rakhe hain. */
const MAX_ATTEMPTS = 4;
const GAP_MS = 1100;

interface NominatimHit {
  lat: string;
  lon: string;
  display_name: string;
}

type Precision = "exact" | "landmark" | "pincode";

/**
 * Telecom records ke address bahut detailed hote hain ("Tower 9 Flat 1506, ...")
 * aur koi bhi geocoder flat-level tak nahi jaata. Isliye dhire-dhire mota
 * karke dobara koshish karte hain:
 *   1. poora address
 *   2. flat/tower wala pehla hissa hataakar — bacha hua landmark + ilaaka
 *   3. sirf pincode
 */
function buildCandidates(address: string): { q: string; precision: Precision }[] {
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const candidates: { q: string; precision: Precision }[] = [
    { q: address, precision: "exact" },
  ];

  // Pehla hissa aksar flat/tower number hota hai — usse koi geocoder nahi
  // pehchanta, par uske baad ka landmark aksar seedha mil jaata hai.
  if (parts.length > 2) {
    candidates.push({ q: parts.slice(1, 4).join(", "), precision: "landmark" });
  }

  // Aakhri 2-3 parts aksar district + state hote hain — zyada reliable.
  if (parts.length > 3) {
    candidates.push({
      q: parts.slice(-3).join(", ") + ", India",
      precision: "landmark",
    });
  } else if (parts.length > 2) {
    candidates.push({
      q: parts.slice(-2).join(", ") + ", India",
      precision: "landmark",
    });
  }

  const pincode = address.match(/(\d{6})/)?.[1];
  if (pincode) {
    candidates.push({ q: `${pincode}, India`, precision: "pincode" });
  }

  const seen = new Set<string>();
  return candidates
    .filter((c) => {
      const key = c.q.toLowerCase();
      if (seen.has(key) || !c.q) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_ATTEMPTS);
}

async function lookup(query: string): Promise<NominatimHit | null> {
  const url = `${NOMINATIM}?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=0`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      signal: controller.signal,
      next: { revalidate },
    });
    if (!response.ok) return null;
    const hits = (await response.json()) as NominatimHit[];
    return hits[0] ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      { ok: false, error: "An address is required." },
      { status: 400 }
    );
  }

  const candidates = buildCandidates(query);

  for (const [index, candidate] of candidates.entries()) {
    if (index > 0) await new Promise((r) => setTimeout(r, GAP_MS));

    const hit = await lookup(candidate.q);
    if (!hit) continue;

    return NextResponse.json({
      ok: true,
      query,
      matchedOn: candidate.q,
      precision: candidate.precision,
      lat: Number(hit.lat),
      lon: Number(hit.lon),
      displayName: hit.display_name,
      attribution: "Geocoding by OpenStreetMap Nominatim",
    });
  }

  return NextResponse.json({
    ok: false,
    query,
    error: "This address could not be pinpointed on the map.",
  });
}
