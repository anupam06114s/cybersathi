"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  FaBicycle,
  FaBus,
  FaCar,
  FaClock,
  FaCrosshairs,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaRoute,
  FaSearch,
  FaSpinner,
  FaWalking,
} from "react-icons/fa";
import {
  cleanAddressForMaps,
  formatAddress,
  type ApiRecord,
  type PhoneLookupResponse,
} from "@/lib/phone-lookup";
import { cn } from "@/lib/utils";

/* ========================================================================= */
/* TRAVEL MODES                                                              */
/* ========================================================================= */

interface TravelMode {
  id: string;
  label: string;
  icon: React.ReactNode;
  /** Classic Google Maps embed ka direction flag. */
  dirflg: string;
  /** Google deep link ka travelmode parameter. */
  travelmode: string;
  /** Hamare routing API ka profile — transit ke liye koi nahi hai. */
  osrm: "car" | "bike" | "foot" | null;
}

const TRAVEL_MODES: TravelMode[] = [
  { id: "driving", label: "Driving", icon: <FaCar size={13} />, dirflg: "d", travelmode: "driving", osrm: "car" },
  { id: "transit", label: "Transit", icon: <FaBus size={13} />, dirflg: "r", travelmode: "transit", osrm: null },
  { id: "walking", label: "Walking", icon: <FaWalking size={13} />, dirflg: "w", travelmode: "walking", osrm: "foot" },
  { id: "cycling", label: "Cycling", icon: <FaBicycle size={13} />, dirflg: "b", travelmode: "bicycling", osrm: "bike" },
];

/* ========================================================================= */
/* HELPERS                                                                   */
/* ========================================================================= */

interface Coords {
  lat: number;
  lon: number;
}

interface RouteStep {
  text: string;
  distanceM: number;
}

type RouteState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; distanceKm: number; durationMin: number; steps: RouteStep[] }
  | { status: "error"; message: string };

function formatStepDistance(metres: number): string {
  if (metres < 1000) return `${metres} m`;
  return `${(metres / 1000).toFixed(1)} km`;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}

interface Destination {
  id: string;
  address: string;
  name: string;
  circle: string;
  source: "main" | "alt";
}

/**
 * Kitne address tak chunne diye jaayein.
 *
 * Alt_Records me hazaaron entries aa sakti hain (ek number par 80,000+ tak
 * dekhe gaye hain). Sabke liye chip banana bekaar hai aur browser ko hang bhi
 * kar sakta hai — main records pehle, phir kuch alt, bas itna hi.
 */
const MAX_DESTINATIONS = 8;

/** Result me se address wale records nikaalta hai (upar wali seema tak). */
function collectDestinations(result: PhoneLookupResponse | null): Destination[] {
  if (!result?.ok) return [];

  const toDestination = (
    record: ApiRecord,
    source: "main" | "alt",
    index: number
  ): Destination => ({
    id: `${source}-${index}`,
    address: cleanAddressForMaps(formatAddress(record.address)),
    name: record.name?.trim() || "Unknown",
    circle: record.circle?.trim() || "",
    source,
  });

  const usable = (d: Destination) => d.address && d.address !== "Not Available";

  const main = (result.apiData?.Main_Records ?? [])
    .slice(0, MAX_DESTINATIONS)
    .map((r, i) => toDestination(r, "main", i))
    .filter(usable);

  if (main.length >= MAX_DESTINATIONS) return main.slice(0, MAX_DESTINATIONS);

  const alt = (result.apiData?.Alt_Records ?? [])
    .slice(0, MAX_DESTINATIONS)
    .map((r, i) => toDestination(r, "alt", i))
    .filter(usable);

  return [...main, ...alt].slice(0, MAX_DESTINATIONS);
}

/* ========================================================================= */
/* MAIN VIEW                                                                 */
/* ========================================================================= */

interface TrackLocationViewProps {
  result: PhoneLookupResponse | null;
  isLoading: boolean;
  onGoSearch: () => void;
}

type OriginState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "ready"; coords: Coords; label: string }
  | { status: "error"; message: string };

export function TrackLocationView({
  result,
  isLoading,
  onGoSearch,
}: TrackLocationViewProps) {
  const destinations = React.useMemo(() => collectDestinations(result), [result]);

  // Selection ko result ke saath baandha hai — naya number search hote hi ye
  // apne aap pehle address par laut jaata hai, bina kisi reset effect ke.
  const [selection, setSelection] = React.useState<{
    result: PhoneLookupResponse | null;
    id: string;
  } | null>(null);
  const [origin, setOrigin] = React.useState<OriginState>({ status: "idle" });
  const [manualOrigin, setManualOrigin] = React.useState("");
  const [mode, setMode] = React.useState(TRAVEL_MODES[0]);
  const [showAllSteps, setShowAllSteps] = React.useState(false);
  /** Address ke saath store hota hai, taaki purane address ka route na dikhe. */
  const [geocoded, setGeocoded] = React.useState<{
    address: string;
    coords: Coords | null;
  } | null>(null);
  const [route, setRoute] = React.useState<RouteState>({ status: "idle" });

  const selectedId = selection?.result === result ? selection.id : null;
  const destination =
    destinations.find((d) => d.id === selectedId) ?? destinations[0] ?? null;

  const geocodeForDestination =
    geocoded && destination && geocoded.address === destination.address
      ? geocoded
      : null;
  const destCoords = geocodeForDestination?.coords ?? null;

  // Destination ke coordinates — routing ke liye zaroori hain.
  React.useEffect(() => {
    if (!destination) return;
    const { address } = destination;
    let cancelled = false;

    fetch(`/api/geocode?q=${encodeURIComponent(address)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setGeocoded({
          address,
          coords: data.ok ? { lat: data.lat, lon: data.lon } : null,
        });
      })
      .catch(() => {
        // Coordinates na milen to bhi map chalta rahega — Google khud address
        // dhoondh leta hai, jo Indian addresses par Nominatim se behtar hai.
        if (!cancelled) setGeocoded({ address, coords: null });
      });

    return () => {
      cancelled = true;
    };
  }, [destination]);

  // Asli sadak wala raasta — origin, destination ya travel mode badalne par.
  const originCoords = origin.status === "ready" ? origin.coords : null;
  React.useEffect(() => {
    if (!originCoords || !destCoords) return;

    if (!mode.osrm) {
      setRoute({
        status: "error",
        message:
          "Public transit routes are not available here — use the Google Maps button below.",
      });
      return;
    }

    let cancelled = false;
    setRoute({ status: "loading" });

    const query = new URLSearchParams({
      from: `${originCoords.lat},${originCoords.lon}`,
      to: `${destCoords.lat},${destCoords.lon}`,
      mode: mode.osrm,
    });

    fetch(`/api/route?${query}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setRoute(
          data.ok
            ? {
                status: "ready",
                distanceKm: data.distanceKm,
                durationMin: data.durationMin,
                steps: data.steps ?? [],
              }
            : { status: "error", message: data.error ?? "Could not work out a route." }
        );
      })
      .catch(() => {
        if (!cancelled) {
          setRoute({ status: "error", message: "Could not reach the routing service." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [originCoords, destCoords, mode]);

  const requestLocation = React.useCallback(() => {
    if (!("geolocation" in navigator)) {
      setOrigin({
        status: "error",
        message:
          "This browser does not support location access. Type your area below instead.",
      });
      return;
    }

    setOrigin({ status: "locating" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigin({
          status: "ready",
          coords: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          label: "Your current location",
        });
      },
      (error) => {
        const messages: Record<number, string> = {
          1: "Location access was blocked. Allow it in your browser settings, or type your area below.",
          2: "Your location could not be determined right now. Try again, or type your area below.",
          3: "Locating you took too long. Try again, or type your area below.",
        };
        setOrigin({
          status: "error",
          message: messages[error.code] ?? "Could not get your location.",
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, []);

  const applyManualOrigin = React.useCallback(async () => {
    const query = manualOrigin.trim();
    if (!query) return;

    setOrigin({ status: "locating" });
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.ok) {
        setOrigin({
          status: "ready",
          coords: { lat: data.lat, lon: data.lon },
          label: data.displayName ?? query,
        });
      } else {
        setOrigin({
          status: "error",
          message:
            data.error ?? "That place could not be found. Try a nearby landmark or city.",
        });
      }
    } catch {
      setOrigin({ status: "error", message: "Could not reach the geocoding service." });
    }
  }, [manualOrigin]);

  /* ----------------------------- Empty states ---------------------------- */

  if (isLoading) {
    return (
      <StatusPanel
        icon={<FaSpinner className="animate-spin text-2xl text-sky-400" />}
        title="Fetching records"
        detail="The address will appear here once the lookup finishes."
      />
    );
  }

  if (!result) {
    return (
      <StatusPanel
        icon={<FaSearch className="text-2xl text-sky-400" />}
        title="Search a number first"
        detail="Once a number returns an address, you can map the route to it from where you are."
        action={{ label: "Go to Search", onClick: onGoSearch }}
      />
    );
  }

  if (!destinations.length) {
    return (
      <StatusPanel
        icon={<FaMapMarkerAlt className="text-2xl text-amber-400" />}
        title="No address in this record"
        detail="This number returned no usable address, so there is nothing to map. Try another number."
        action={{ label: "Search another number", onClick: onGoSearch }}
      />
    );
  }

  /* ------------------------------- Main UI ------------------------------- */

  const isReady = origin.status === "ready";
  const originParam = isReady ? `${origin.coords.lat},${origin.coords.lon}` : "";

  // Coordinates mil gaye ho to unhi se link banao — Google seedha us point par
  // khulta hai, address dhoondhne ka step hi nahi aata.
  const destParam = destCoords
    ? `${destCoords.lat},${destCoords.lon}`
    : (destination?.address ?? "");

  const embedSrc = isReady
    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(originParam)}` +
      `&daddr=${encodeURIComponent(destParam)}&dirflg=${mode.dirflg}&hl=en&output=embed`
    : "";

  const deepLink = isReady
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originParam)}` +
      `&destination=${encodeURIComponent(destParam)}&travelmode=${mode.travelmode}`
    : "";

  const visibleSteps =
    route.status === "ready"
      ? showAllSteps
        ? route.steps
        : route.steps.slice(0, 6)
      : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full w-full flex-col gap-3 overflow-y-auto p-3 sm:p-4"
    >
      {/* ------------------------- Destination ------------------------- */}
      <div className="shrink-0 rounded-xl border border-rose-400/30 bg-rose-950/25 p-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/25 text-rose-300">
            <FaMapMarkerAlt size={12} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[9.5px] font-black uppercase tracking-wider text-rose-300/80">
              Destination · from the fetched record
            </p>
            <p className="mt-0.5 text-[12.5px] font-bold leading-snug text-white">
              {destination!.address}
            </p>
            <p className="mt-0.5 text-[11px] text-white/50">
              {destination!.name}
              {destination!.circle ? ` · ${destination!.circle}` : ""}
            </p>
          </div>
        </div>

        {destinations.length > 1 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-white/10 pt-2.5">
            {destinations.map((d, i) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setSelection({ result, id: d.id });
                  setShowAllSteps(false);
                }}
                className={cn(
                  "cursor-pointer rounded-lg border px-2.5 py-1 text-[10.5px] font-bold transition-all",
                  d.id === destination!.id
                    ? "border-rose-400/70 bg-rose-500/20 text-rose-100"
                    : "border-white/15 bg-white/[0.03] text-white/55 hover:border-white/35 hover:text-white"
                )}
              >
                Address {i + 1}
                {d.source === "alt" ? " (alt)" : ""}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --------------------------- Origin ---------------------------- */}
      {!isReady ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-white/12 bg-black/40 p-5 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-950/40">
            {origin.status === "locating" ? (
              <FaSpinner className="animate-spin text-xl text-sky-400" />
            ) : (
              <FaCrosshairs className="text-xl text-sky-400" />
            )}
          </span>

          <div>
            <p className="text-sm font-black text-white">
              {origin.status === "locating"
                ? "Finding where you are..."
                : "Where are you starting from?"}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-[11.5px] leading-relaxed text-white/55">
              Your location becomes the starting point and the address above becomes the
              destination. You then get the road distance, the travel time and the
              turn-by-turn directions right here.
            </p>
          </div>

          {origin.status === "error" && (
            <p className="flex max-w-sm items-start gap-2 rounded-lg border border-amber-400/35 bg-amber-950/35 px-3 py-2 text-left text-[11px] leading-relaxed text-amber-100">
              <FaExclamationTriangle size={11} className="mt-0.5 shrink-0" />
              {origin.message}
            </p>
          )}

          <button
            type="button"
            onClick={requestLocation}
            disabled={origin.status === "locating"}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-black text-black shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-400 disabled:opacity-50"
          >
            <FaCrosshairs size={12} />
            Use my current location
          </button>

          <div className="flex w-full max-w-sm items-center gap-2 pt-1">
            <span className="h-px flex-1 bg-white/12" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
              or type it
            </span>
            <span className="h-px flex-1 bg-white/12" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              applyManualOrigin();
            }}
            className="flex w-full max-w-sm gap-2"
          >
            <input
              value={manualOrigin}
              onChange={(e) => setManualOrigin(e.target.value)}
              placeholder="Your city, area or landmark"
              className="h-10 min-w-0 flex-1 rounded-xl border border-white/15 bg-black/50 px-3 text-xs text-white outline-none transition-all placeholder:text-white/35 focus:border-sky-400/60"
            />
            <button
              type="submit"
              disabled={!manualOrigin.trim() || origin.status === "locating"}
              className="shrink-0 cursor-pointer rounded-xl border border-sky-400/40 bg-sky-500/10 px-3.5 text-xs font-bold text-sky-200 transition-all hover:bg-sky-500/20 disabled:opacity-40"
            >
              Set
            </button>
          </form>

          <p className="max-w-sm text-[10px] leading-relaxed text-white/35">
            Your coordinates stay in this browser — they are only used to work out the
            route. Nothing about your location is saved.
          </p>
        </div>
      ) : (
        <>
          {/* ------------------------ Route summary ------------------------ */}
          <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4">
            <SummaryTile
              label="Total distance"
              value={
                route.status === "ready"
                  ? `${route.distanceKm} km`
                  : route.status === "loading"
                    ? "Working it out..."
                    : "Not available"
              }
              accent="text-emerald-300"
              icon={<FaRoute size={11} />}
            />
            <SummaryTile
              label="Travel time"
              value={
                route.status === "ready"
                  ? formatDuration(route.durationMin)
                  : route.status === "loading"
                    ? "..."
                    : "Not available"
              }
              accent="text-amber-300"
              icon={<FaClock size={11} />}
            />
            <SummaryTile
              label="Starting point"
              value={origin.label}
              accent="text-sky-300"
              icon={<FaCrosshairs size={11} />}
            />
            <button
              type="button"
              onClick={() => setOrigin({ status: "idle" })}
              className="cursor-pointer rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2 text-[11px] font-bold text-white/60 transition-all hover:border-white/40 hover:text-white"
            >
              Change starting point
            </button>
          </div>

          {/* -------------------------- Travel ways ------------------------ */}
          <div className="flex shrink-0 gap-1.5 overflow-x-auto">
            {TRAVEL_MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMode(m);
                  setShowAllSteps(false);
                }}
                className={cn(
                  "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-bold transition-all",
                  m.id === mode.id
                    ? "border-sky-400/70 bg-sky-500/20 text-sky-100"
                    : "border-white/15 bg-white/[0.03] text-white/55 hover:border-white/35 hover:text-white"
                )}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>

          {route.status === "error" && (
            <p className="flex shrink-0 items-start gap-2 rounded-lg border border-amber-400/35 bg-amber-950/35 px-3 py-2 text-[11px] leading-relaxed text-amber-100">
              <FaExclamationTriangle size={11} className="mt-0.5 shrink-0" />
              {route.message}
            </p>
          )}

          {/* ----------------------------- Map ----------------------------- */}
          <div className="shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black/60">
            <iframe
              key={`${destination!.id}-${mode.id}-${originParam}`}
              src={embedSrc}
              title={`Route from ${origin.label} to ${destination!.address}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[360px] w-full border-0"
            />
          </div>

          {/* --------------------- Turn-by-turn directions ----------------- */}
          {route.status === "ready" && route.steps.length > 0 && (
            <div className="shrink-0">
              <p className="mb-2 text-[9.5px] font-black uppercase tracking-wider text-white/45">
                Directions · {route.steps.length} steps
              </p>
              <ol className="flex flex-col gap-1.5">
                {visibleSteps.map((step, i) => (
                  <li
                    key={`${i}-${step.text}`}
                    className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
                  >
                    <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded bg-sky-500/25 text-[9.5px] font-black text-sky-200">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 text-[11.5px] leading-relaxed text-white/80">
                      {step.text}
                    </span>
                    <span className="shrink-0 text-[10.5px] font-bold text-white/40">
                      {formatStepDistance(step.distanceM)}
                    </span>
                  </li>
                ))}
              </ol>

              {route.steps.length > 6 && (
                <button
                  type="button"
                  onClick={() => setShowAllSteps((prev) => !prev)}
                  className="mt-2 w-full cursor-pointer rounded-lg border border-white/15 bg-white/[0.03] py-2 text-[11px] font-bold text-white/60 transition-all hover:border-white/40 hover:text-white"
                >
                  {showAllSteps
                    ? "Show fewer steps"
                    : `Show all ${route.steps.length} steps`}
                </button>
              )}
            </div>
          )}

          {/* ------------------------- Open in Maps ------------------------ */}
          <a
            href={deepLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-black text-black shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-400"
          >
            Open this route in Google Maps
            <FaExternalLinkAlt size={10} className="opacity-70" />
          </a>

          <p className="shrink-0 text-[10px] leading-relaxed text-white/35">
            Distance, time and directions come from OSRM on OpenStreetMap data. Address
            lookup by OpenStreetMap Nominatim.
          </p>
        </>
      )}
    </motion.div>
  );
}

/* ========================================================================= */
/* SMALL PIECES                                                              */
/* ========================================================================= */

function SummaryTile({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2">
      <p
        className={cn(
          "flex items-center gap-1.5 text-[9.5px] font-black uppercase tracking-wider",
          accent
        )}
      >
        {icon}
        {label}
      </p>
      <p className="mt-0.5 truncate text-[12px] font-bold text-white">{value}</p>
    </div>
  );
}

function StatusPanel({
  icon,
  title,
  detail,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex h-full min-h-[350px] w-full flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-950/40 backdrop-blur-md">
        {icon}
      </div>
      <h3 className="text-base font-black text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-white/55">{detail}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 cursor-pointer rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-black text-black shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-400"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
