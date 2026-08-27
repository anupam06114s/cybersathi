import { NextRequest, NextResponse } from "next/server";

/**
 * Do point ke beech asli sadak wala raasta nikaalta hai.
 *
 * FOSSGIS ke public OSRM server ka istemal hota hai — OpenStreetMap ke data par
 * chalta hai, free hai aur koi API key nahi maangta. Isse road distance, lagne
 * wala samay aur turn-by-turn directions milte hain, jo hum apni hi site par
 * dikha sakte hain.
 */

export const runtime = "nodejs";
export const revalidate = 3600;

/** Har travel mode ka apna OSRM profile. */
const PROFILES: Record<string, string> = {
  car: "routed-car",
  bike: "routed-bike",
  foot: "routed-foot",
};

const OSRM_HOST = "https://routing.openstreetmap.de";

interface OsrmManeuver {
  type?: string;
  modifier?: string;
  exit?: number;
}

interface OsrmStep {
  name?: string;
  distance: number;
  maneuver: OsrmManeuver;
}

interface OsrmRoute {
  distance: number;
  duration: number;
  legs: { steps: OsrmStep[] }[];
}

/** OSRM ke maneuver ko padhne layak vaakya me badalta hai. */
function describeStep(step: OsrmStep): string {
  const { type, modifier, exit } = step.maneuver;
  const road = step.name?.trim();
  const onto = road ? ` onto ${road}` : "";
  const along = road ? ` along ${road}` : "";
  const direction = modifier ?? "ahead";

  switch (type) {
    case "depart":
      return road ? `Head out on ${road}` : "Start your journey";
    case "arrive":
      return "Arrive at the destination";
    case "roundabout":
    case "rotary":
      return exit
        ? `At the roundabout, take exit ${exit}${onto}`
        : `Go around the roundabout${onto}`;
    case "roundabout turn":
      return `At the roundabout, turn ${direction}${onto}`;
    case "merge":
      return `Merge ${direction}${onto}`;
    case "fork":
      return `Keep ${direction}${onto}`;
    case "end of road":
      return `At the end of the road, turn ${direction}${onto}`;
    case "on ramp":
      return `Take the ramp${onto}`;
    case "off ramp":
      return `Take the exit ${direction}${onto}`;
    case "new name":
    case "continue":
      return `Continue${along}`;
    case "turn":
    default:
      return `Turn ${direction}${onto}`;
  }
}

/** "28.6139,77.209" ko parse karta hai, galat hone par null. */
function parsePoint(value: string | null): { lat: number; lon: number } | null {
  if (!value) return null;
  const [lat, lon] = value.split(",").map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const from = parsePoint(params.get("from"));
  const to = parsePoint(params.get("to"));
  const mode = params.get("mode") ?? "car";

  if (!from || !to) {
    return NextResponse.json(
      { ok: false, error: "Both a start and an end point are required." },
      { status: 400 }
    );
  }

  const profile = PROFILES[mode];
  if (!profile) {
    return NextResponse.json({
      ok: false,
      error:
        "Public transit routes are not available here — open Google Maps for those.",
      unsupportedMode: true,
    });
  }

  const url =
    `${OSRM_HOST}/${profile}/route/v1/driving/` +
    `${from.lon},${from.lat};${to.lon},${to.lat}` +
    `?overview=false&steps=true&annotations=false`;

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(20000),
      next: { revalidate },
    });

    if (!response.ok) {
      return NextResponse.json({
        ok: false,
        error: `The routing service returned HTTP ${response.status}.`,
      });
    }

    const data = (await response.json()) as { routes?: OsrmRoute[] };
    const route = data.routes?.[0];

    if (!route) {
      return NextResponse.json({
        ok: false,
        error: "No road route could be found between these two points.",
      });
    }

    const steps = route.legs
      .flatMap((leg) => leg.steps)
      .map((step) => ({
        text: describeStep(step),
        distanceM: Math.round(step.distance),
      }))
      // OSRM aksar 0 metre wale bekaar step deta hai — unhe chhod dete hain.
      .filter((step, i, all) => step.distanceM > 0 || i === all.length - 1);

    return NextResponse.json({
      ok: true,
      mode,
      distanceKm: Number((route.distance / 1000).toFixed(1)),
      durationMin: Math.round(route.duration / 60),
      steps,
      attribution: "Routing by OSRM on OpenStreetMap data",
    });
  } catch (error: unknown) {
    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");

    return NextResponse.json({
      ok: false,
      error: isTimeout
        ? "The routing service took too long to respond."
        : "Could not reach the routing service.",
    });
  }
}
