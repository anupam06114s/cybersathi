"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FaCheck,
  FaEnvelope,
  FaFileAlt,
  FaFilter,
  FaIdCard,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegCopy,
  FaSearch,
  FaSignal,
  FaSpinner,
  FaTelegramPlane,
  FaUser,
  FaUserAstronaut,
  FaUsers,
  FaUserTie,
  FaLayerGroup,
  FaListUl,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaGlobeAmericas,
} from "react-icons/fa";

import { CyberSathiLogo } from "@/components/brand/cyber-sathi-logo";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  InteractiveSelector,
  type InteractiveSelectorPanel,
} from "@/components/ui/interactive-selector";
import {
  fetchPhoneDetails,
  formatAddress,
  type ApiRecord,
  type PhoneLookupResponse,
  type PhoneLookupSuccess,
} from "@/lib/phone-lookup";
import { TrackLocationView } from "./track-location-view";
import {
  CosmicBackground,
  CyberBackground,
  DeveloperBackground,
} from "./backgrounds";

export function NumberLookup() {
  const [query, setQuery] = React.useState("");
  const [result, setResult] = React.useState<PhoneLookupResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const performSearch = async (numberToSearch: string) => {
    const clean = numberToSearch.trim();
    if (!clean) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setResult(null);

    // Switch to Panel 1 (Records view) immediately with smooth motion transition
    setActiveIndex(1);

    const response = await fetchPhoneDetails(clean, controller.signal);
    setResult(response);
    setIsLoading(false);
  };

  const handleSearch = (event?: React.FormEvent) => {
    event?.preventDefault();
    performSearch(query);
  };

  const panels: InteractiveSelectorPanel[] = [
    {
      id: "search",
      title: "Search",
      description: "Live Number Lookup",
      icon: <FaSearch size={16} className="text-white" />,
      background: <CyberBackground />,
      contentLayout: "center",
      content: (
        <div className="flex w-full flex-col gap-4">
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5 rounded-2xl sm:rounded-3xl border border-cyan-400/30 bg-black/75 p-6 sm:p-9 shadow-2xl shadow-cyan-500/15 backdrop-blur-2xl"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/50 px-3.5 py-1 text-xs font-bold text-cyan-300 shadow-sm"
              >
                <span className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
                Live Telecom Intelligence
              </motion.div>
              <CyberSathiLogo size="lg" orientation="stack" className="mx-auto" />
              <p className="mt-3 text-xs sm:text-sm text-cyan-200/75 leading-relaxed">
                Fetch instant Subscriber KYC, Circle & Linked Records
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row pt-1">
              <div className="relative flex-1">
                <Input
                  id="number-lookup-input"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Enter 10-digit mobile number..."
                  className="h-12 sm:h-14 border-cyan-400/40 bg-black/60 px-4 text-base sm:text-lg text-white placeholder:text-white/40 focus-visible:border-cyan-400 focus-visible:ring-cyan-400/50 rounded-xl transition-all"
                  disabled={isLoading}
                />
              </div>
              <motion.button
                type="submit"
                disabled={isLoading || !query.trim()}
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.96 }}
                className="h-12 sm:h-14 shrink-0 cursor-pointer rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-7 text-base font-bold text-black shadow-lg shadow-cyan-500/25 hover:from-cyan-300 hover:to-cyan-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" size={16} />
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <FaSearch size={16} />
                    <span>Search</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        </div>
      ),
    },
    {
      id: "plain",
      title: "Records",
      description: "Formatted KYC details",
      icon: <FaFileAlt size={16} className="text-white" />,
      background: <CosmicBackground />,
      contentLayout: "fill",
      content: (
        <NormalFormatView
          result={result}
          isLoading={isLoading}
          onRetry={() => performSearch(query)}
          onGoSearch={() => setActiveIndex(0)}
        />
      ),
    },
    {
      id: "track",
      title: "Track Location",
      description: "Route to the fetched address",
      icon: <FaMapMarkedAlt size={16} className="text-white" />,
      background: <CosmicBackground />,
      contentLayout: "fill",
      content: (
        <TrackLocationView
          result={result}
          isLoading={isLoading}
          onGoSearch={() => setActiveIndex(0)}
        />
      ),
    },
    {
      id: "developer",
      title: "Developer",
      description: "About the maker",
      icon: <FaUserAstronaut size={16} className="text-white" />,
      background: <DeveloperBackground />,
      contentLayout: "center",
      content: <DeveloperCredit />,
    },
  ];

  return (
    <InteractiveSelector
      panels={panels}
      activeIndex={activeIndex}
      onActiveIndexChange={setActiveIndex}
    />
  );
}

/* ========================================================================= */
/* SHEET 2: NORMAL FORMAT (STRUCTURED MAIN DETAILS LIST & ALT RECORDS)       */
/* ========================================================================= */

interface NormalFormatViewProps {
  result: PhoneLookupResponse | null;
  isLoading: boolean;
  onRetry: () => void;
  onGoSearch: () => void;
}

function NormalFormatView({
  result,
  isLoading,
  onRetry,
  onGoSearch,
}: NormalFormatViewProps) {
  const [tab, setTab] = React.useState<"main" | "alt" | "telecom">("main");
  const [selectedMainIdx, setSelectedMainIdx] = React.useState(0);
  const [filterText, setFilterText] = React.useState("");
  const [copiedItem, setCopiedItem] = React.useState<string | null>(null);

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(null), 1500);
    } catch {
      // ignore
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-full min-h-[350px] w-full flex-col items-center justify-center p-6 text-center"
      >
        <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-fuchsia-400/30 bg-fuchsia-950/50 backdrop-blur-md shadow-lg shadow-fuchsia-500/20">
          <FaSpinner className="animate-spin text-2xl text-fuchsia-300" />
        </div>
        <h3 className="text-lg font-bold text-white">Fetching Live Records...</h3>
        <p className="mt-1 max-w-sm text-xs sm:text-sm text-fuchsia-200/70">
          Querying remote telecom registry for complete subscriber profile & caller records.
        </p>
      </motion.div>
    );
  }

  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-full min-h-[350px] w-full flex-col items-center justify-center p-6 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
          <FaSearch className="text-2xl text-white/50" />
        </div>
        <h3 className="text-lg font-bold text-white">No Number Searched Yet</h3>
        <p className="mt-1 max-w-sm text-xs sm:text-sm text-white/60">
          Search a phone number in the search panel to view clean formatted records
          here.
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onGoSearch}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition-all cursor-pointer"
        >
          <FaSearch size={13} />
          Go to Search
        </motion.button>
      </motion.div>
    );
  }

  if (!result.ok) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-full min-h-[350px] w-full flex-col items-center justify-center p-6 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-950/50 backdrop-blur-md">
          <FaPhoneAlt className="text-2xl text-rose-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Lookup Notice</h3>
        <p className="mt-1 max-w-md text-xs sm:text-sm text-rose-300/80">{result.error}</p>
        <div className="mt-4 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRetry}
            className="cursor-pointer gap-2 rounded-xl bg-rose-500/25 px-4 py-2 text-xs font-bold text-rose-200 hover:bg-rose-500/35"
          >
            Retry Search
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onGoSearch}
            className="cursor-pointer rounded-xl border border-white/20 px-4 py-2 text-xs font-bold text-white hover:bg-white/10"
          >
            Change Number
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const successResult = result as PhoneLookupSuccess;
  const rawMainRecords = successResult.apiData?.Main_Records || [];
  const rawAltRecords = successResult.apiData?.Alt_Records || [];

  // Fallback so Main Records is NEVER empty if any records exist
  const mainRecords =
    rawMainRecords.length > 0
      ? rawMainRecords
      : rawAltRecords.length > 0
      ? rawAltRecords
      : [];

  const altRecords = rawAltRecords;

  const currentMainRecord =
    mainRecords.length > 0
      ? mainRecords[Math.min(selectedMainIdx, mainRecords.length - 1)]
      : null;

  const recordsToDisplay = tab === "main" ? mainRecords : altRecords;

  const filteredRecords = recordsToDisplay.filter((rec) => {
    if (!filterText.trim()) return true;
    const lower = filterText.toLowerCase();
    return (
      (rec.name && rec.name.toLowerCase().includes(lower)) ||
      (rec.fname && rec.fname.toLowerCase().includes(lower)) ||
      (rec.mobile && rec.mobile.includes(lower)) ||
      (rec.circle && rec.circle.toLowerCase().includes(lower)) ||
      (rec.address && rec.address.toLowerCase().includes(lower)) ||
      (rec.email && rec.email.toLowerCase().includes(lower))
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-black/75 shadow-2xl backdrop-blur-2xl"
    >
      {/* Top Header Bar */}
      <div className="flex flex-col gap-3 border-b border-white/10 bg-white/5 p-3.5 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30">
            <FaPhoneAlt size={15} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-lg font-black tracking-wide text-white sm:text-xl">
                {successResult.query}
              </span>
              <Badge
                variant="outline"
                className="border-emerald-500/40 bg-emerald-500/10 text-[11px] font-semibold text-emerald-300"
              >
                ● Live Result
              </Badge>
            </div>
            <p className="text-[11px] sm:text-xs text-white/60">
              {successResult.metadata.countryName || "India"} •{" "}
              {successResult.metadata.numberType || "Mobile"} • Total:{" "}
              <span className="font-semibold text-white">
                {successResult.totalCount} records
              </span>
            </p>
          </div>
        </div>

        {/* Tab switchers with Motion Spring Pill */}
        <div className="flex overflow-x-auto no-scrollbar rounded-xl border border-white/10 bg-black/50 p-1">
          {[
            { key: "main", label: `Main Details (${mainRecords.length})` },
            { key: "alt", label: `Alt Records (${altRecords.length})` },
            { key: "telecom", label: "Telecom Meta" },
          ].map((t) => {
            const isTabActive = tab === t.key;
            return (
              <motion.button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key as "main" | "alt" | "telecom")}
                whileTap={{ scale: 0.96 }}
                className="relative cursor-pointer shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors text-white z-10"
              >
                {isTabActive && (
                  <motion.div
                    layoutId="recordsSubTab"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-indigo-500/30"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isTabActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {t.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area with Smooth Motion Transitions */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4">
        <AnimatePresence mode="wait">
          {/* ================================================================= */}
          {/* TAB 1: MAIN DETAILS LIST                                          */}
          {/* ================================================================= */}
          {tab === "main" && (
            <motion.div
              key="tab-main"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {currentMainRecord ? (
                <>
                  {/* Selector pill if more than 1 main record */}
                  {mainRecords.length > 1 && (
                    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                        <FaLayerGroup size={12} className="text-violet-400" />
                        Select Profile:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {mainRecords.map((rec, idx) => (
                          <motion.button
                            key={idx}
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setSelectedMainIdx(idx)}
                            className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                              selectedMainIdx === idx
                                ? "bg-violet-600 text-white shadow-sm ring-1 ring-white/30"
                                : "bg-black/40 text-white/60 hover:bg-black/60 hover:text-white"
                            }`}
                          >
                            #{idx + 1} {rec.name || "Subscriber"} ({rec.circle || "SIM"})
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STRUCTURED MAIN DETAILS LIST CARD */}
                  <MainDetailsStructuredList
                    record={currentMainRecord}
                    recordIndex={selectedMainIdx}
                    totalMainRecords={mainRecords.length}
                    successResult={successResult}
                    copiedItem={copiedItem}
                    onCopy={copyText}
                  />

                  {/* If multiple records, show all in structured record cards */}
                  {mainRecords.length > 1 && (
                    <div className="pt-2">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70">
                          <FaListUl size={12} className="text-violet-400" />
                          All Linked Records ({mainRecords.length})
                        </h4>
                        <span className="text-[11px] text-white/50">
                          Tap card to view above
                        </span>
                      </div>
                      <div className="grid gap-3.5 sm:grid-cols-2">
                        {mainRecords.map((record, index) => (
                          <motion.div
                            key={`main-sub-${index}`}
                            whileHover={{ y: -3, scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                            onClick={() => setSelectedMainIdx(index)}
                            className={`cursor-pointer rounded-xl transition-all ${
                              selectedMainIdx === index
                                ? "ring-2 ring-violet-500 shadow-lg shadow-violet-500/20"
                                : "opacity-85 hover:opacity-100"
                            }`}
                          >
                            <RecordCard
                              record={record}
                              index={index}
                              isMain={true}
                              copiedItem={copiedItem}
                              onCopy={copyText}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 text-center space-y-4"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-950/40 text-amber-300 shadow-lg shadow-amber-500/10">
                    <FaSearch size={22} />
                  </div>
                  <div className="max-w-md space-y-1.5">
                    <h4 className="text-lg sm:text-xl font-extrabold text-white">
                      No Subscriber Record Found for {successResult.query}
                    </h4>
                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                      This phone number is a valid{" "}
                      <span className="font-semibold text-cyan-300">
                        {successResult.metadata.countryName || "India"}{" "}
                        {successResult.metadata.numberType || "Mobile"}
                      </span>{" "}
                      number, but no indexed subscriber name or KYC profile was found in the telecom directory.
                    </p>
                  </div>

                  {/* Telecom preview chips */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <span className="rounded-lg border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 font-mono">
                      Country: {successResult.metadata.countryName || "India"} (+{successResult.metadata.callingCode || "91"})
                    </span>
                    <span className="rounded-lg border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80 font-mono">
                      Type: {successResult.metadata.numberType || "Mobile"}
                    </span>
                    <span className="rounded-lg border border-white/10 bg-black/40 px-3 py-1 text-xs text-emerald-400 font-mono">
                      Format: Valid
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={onGoSearch}
                      className="cursor-pointer flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-black hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
                    >
                      <FaSearch size={12} />
                      Search Another Number
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => setTab("telecom")}
                      className="cursor-pointer flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-xs font-bold text-white hover:bg-white/10"
                    >
                      <FaSignal size={12} />
                      View Telecom Meta
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: ALTERNATE RECORDS LIST                                     */}
          {/* ================================================================= */}
          {tab === "alt" && (
            <motion.div
              key="tab-alt"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              {/* Filter Search Bar */}
              {altRecords.length > 1 && (
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5">
                  <FaFilter size={12} className="text-violet-400" />
                  <input
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder={`Search in ${altRecords.length} alternate records...`}
                    className="w-full bg-transparent text-xs text-white placeholder:text-white/40 focus:outline-none"
                  />
                  {filterText && (
                    <button
                      onClick={() => setFilterText("")}
                      className="cursor-pointer text-xs text-white/50 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}

              {filteredRecords.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center text-center text-white/50">
                  <p className="text-sm">
                    {filterText
                      ? "No alternate records match your search filter."
                      : "No alternate records found."}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3.5 sm:grid-cols-2">
                  {filteredRecords.map((record, index) => (
                    <motion.div
                      key={`alt-${index}-${record.mobile || index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <RecordCard
                        record={record}
                        index={index}
                        isMain={false}
                        copiedItem={copiedItem}
                        onCopy={copyText}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: TELECOM METADATA                                           */}
          {/* ================================================================= */}
          {tab === "telecom" && (
            <motion.div
              key="tab-telecom"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-3 sm:grid-cols-2"
            >
              <TelecomInfoCard
                label="Query Input"
                value={successResult.query}
                icon={<FaPhoneAlt size={14} className="text-sky-400" />}
              />
              <TelecomInfoCard
                label="E.164 Format"
                value={successResult.metadata.e164 || successResult.query}
                icon={<FaPhoneAlt size={14} className="text-cyan-400" />}
              />
              <TelecomInfoCard
                label="International"
                value={successResult.metadata.international || successResult.query}
                icon={<FaSignal size={14} className="text-emerald-400" />}
              />
              <TelecomInfoCard
                label="National Format"
                value={successResult.metadata.national || successResult.query}
                icon={<FaSignal size={14} className="text-emerald-400" />}
              />
              <TelecomInfoCard
                label="Country"
                value={`${successResult.metadata.countryName || "India"} (${
                  successResult.metadata.countryCode || "IN"
                })`}
                icon={<FaMapMarkerAlt size={14} className="text-amber-400" />}
              />
              <TelecomInfoCard
                label="Calling Code"
                value={`+${successResult.metadata.callingCode || "91"}`}
                icon={<FaSignal size={14} className="text-indigo-400" />}
              />
              <TelecomInfoCard
                label="Total Records Found"
                value={`${successResult.totalCount} records (${successResult.mainCount} Main, ${successResult.altCount} Alternate)`}
                icon={<FaUsers size={14} className="text-purple-400" />}
              />
              <TelecomInfoCard
                label="Fetched At"
                value={new Date(successResult.lookedUpAt).toLocaleString()}
                icon={<FaCheck size={14} className="text-teal-400" />}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ========================================================================= */
/* STRUCTURED MAIN DETAILS LIST VIEW COMPONENT                               */
/* ========================================================================= */

interface MainDetailsStructuredListProps {
  record: ApiRecord;
  recordIndex: number;
  totalMainRecords: number;
  successResult: PhoneLookupSuccess;
  copiedItem: string | null;
  onCopy: (text: string, id: string) => void;
}

function MainDetailsStructuredList({
  record,
  recordIndex,
  totalMainRecords,
  successResult,
  copiedItem,
  onCopy,
}: MainDetailsStructuredListProps) {
  const formattedAddr = formatAddress(record.address);
  const cardId = `hero-main-${recordIndex}`;

  const displayName =
    record.name && record.name.trim() ? record.name.trim() : "Primary Subscriber";

  const displayFatherName =
    record.fname && record.fname.trim()
      ? record.fname.trim()
      : "Not Specified in Telecom KYC";

  const displayMobile =
    record.mobile && record.mobile.trim()
      ? record.mobile.trim()
      : successResult.query;

  const displayAlt =
    record.alt && record.alt.trim() && record.alt !== displayMobile
      ? record.alt.trim()
      : "Not Linked";

  const displayCircle =
    record.circle && record.circle.trim()
      ? record.circle.trim()
      : successResult.metadata.countryName
      ? `${successResult.metadata.countryName} Telecom Network`
      : "National Telecom Operator";

  const displayAddress =
    formattedAddr && formattedAddr !== "Not Available"
      ? formattedAddr
      : "Address registered under telecom subscriber plan";

  const displayEmail =
    record.email && record.email.trim()
      ? record.email.trim()
      : "Not Linked to SIM Profile";

  const displayId =
    record.id && record.id.trim()
      ? record.id.trim()
      : "Telecom Masked / Verified";

  const allSummaryText = `Name: ${displayName}
Father's Name: ${displayFatherName}
Mobile: ${displayMobile}
Circle/Operator: ${displayCircle}
Address: ${displayAddress}
Alternate: ${displayAlt}
Email: ${displayEmail}
ID/Ref: ${displayId}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border-2 border-violet-500/40 bg-gradient-to-b from-violet-950/40 via-black/80 to-black/90 shadow-2xl shadow-violet-500/15 backdrop-blur-2xl"
    >
      {/* Top Banner with Name & Copy Button */}
      <div className="flex flex-col gap-4 border-b border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-violet-600/40 ring-2 ring-white/20">
            <FaUserTie className="text-xl" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300">
                Primary Profile {totalMainRecords > 1 ? `#${recordIndex + 1}` : ""}
              </span>
              <Badge
                variant="outline"
                className="border-indigo-400/40 bg-indigo-500/20 px-2 py-0.5 text-[11px] font-bold text-indigo-200"
              >
                <FaSignal size={9} className="mr-1 inline text-indigo-300" />
                {displayCircle}
              </Badge>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {displayName}
            </h3>
          </div>
        </div>

        {/* Copy All Details Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => onCopy(allSummaryText, `all-${cardId}`)}
          className="h-9 cursor-pointer gap-2 self-start rounded-xl bg-violet-600/30 px-3.5 text-xs font-bold text-violet-200 transition-all hover:bg-violet-600 hover:text-white sm:self-center flex items-center"
        >
          {copiedItem === `all-${cardId}` ? (
            <>
              <FaCheck size={12} className="text-emerald-400" />
              <span>Copied All Details!</span>
            </>
          ) : (
            <>
              <FaRegCopy size={12} />
              <span>Copy Full Record</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Structured Details List */}
      <div className="divide-y divide-white/10 p-2.5 sm:p-4">
        <DetailListRow
          icon={<FaUser className="text-violet-400" size={13} />}
          label="Full Name"
          value={displayName}
          highlighted={true}
          onCopy={() => onCopy(displayName, `name-${cardId}`)}
          isCopied={copiedItem === `name-${cardId}`}
        />
        <DetailListRow
          icon={<FaUsers className="text-indigo-400" size={13} />}
          label="Father's Name"
          value={displayFatherName}
          onCopy={() => onCopy(displayFatherName, `fname-${cardId}`)}
          isCopied={copiedItem === `fname-${cardId}`}
        />
        <DetailListRow
          icon={<FaPhoneAlt className="text-cyan-400" size={13} />}
          label="Primary Mobile"
          value={displayMobile}
          isMono={true}
          onCopy={() => onCopy(displayMobile, `m-${cardId}`)}
          isCopied={copiedItem === `m-${cardId}`}
        />
        <DetailListRow
          icon={<FaPhoneAlt className="text-amber-400" size={13} />}
          label="Alternate Number"
          value={displayAlt}
          isMono={true}
          onCopy={
            displayAlt !== "Not Linked"
              ? () => onCopy(displayAlt, `alt-${cardId}`)
              : undefined
          }
          isCopied={copiedItem === `alt-${cardId}`}
        />
        <DetailListRow
          icon={<FaSignal className="text-emerald-400" size={13} />}
          label="Circle & Operator"
          value={displayCircle}
          isBadge={true}
          onCopy={() => onCopy(displayCircle, `circle-${cardId}`)}
          isCopied={copiedItem === `circle-${cardId}`}
        />
        <DetailListRow
          icon={<FaMapMarkerAlt className="text-fuchsia-400" size={13} />}
          label="Registered Address"
          value={displayAddress}
          isAddress={true}
          onCopy={() => onCopy(displayAddress, `addr-${cardId}`)}
          isCopied={copiedItem === `addr-${cardId}`}
        />
        <DetailListRow
          icon={<FaEnvelope className="text-sky-400" size={13} />}
          label="Email Address"
          value={displayEmail}
          isEmail={record.email ? true : false}
          emailHref={record.email ? `mailto:${record.email}` : undefined}
          onCopy={
            record.email
              ? () => onCopy(record.email!, `email-${cardId}`)
              : undefined
          }
          isCopied={copiedItem === `email-${cardId}`}
        />
        <DetailListRow
          icon={<FaIdCard className="text-teal-400" size={13} />}
          label="Reference ID"
          value={displayId}
          isMono={true}
          onCopy={() => onCopy(displayId, `id-${cardId}`)}
          isCopied={copiedItem === `id-${cardId}`}
        />
        <DetailListRow
          icon={<FaShieldAlt className="text-emerald-400" size={13} />}
          label="KYC Status"
          value="Active KYC Verified Record"
          isBadge={true}
        />
        <DetailListRow
          icon={<FaGlobeAmericas className="text-blue-400" size={13} />}
          label="Country & Calling Code"
          value={`${successResult.metadata.countryName || "India"} (+${
            successResult.metadata.callingCode || "91"
          })`}
          isMono={true}
        />
      </div>
    </motion.div>
  );
}

function DetailListRow({
  icon,
  label,
  value,
  highlighted,
  isMono,
  isBadge,
  isAddress,
  isEmail,
  emailHref,
  onCopy,
  isCopied,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlighted?: boolean;
  isMono?: boolean;
  isBadge?: boolean;
  isAddress?: boolean;
  isEmail?: boolean;
  emailHref?: string;
  onCopy?: () => void;
  isCopied?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-center sm:justify-between px-2.5 transition-colors hover:bg-white/[0.04] rounded-xl">
      {/* Label and Icon */}
      <div className="flex items-center gap-2.5 min-w-[180px] sm:min-w-[220px] text-xs font-semibold text-white/60">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-violet-300">
          {icon}
        </div>
        <span>{label}</span>
      </div>

      {/* Value and Copy Button */}
      <div className="flex items-center justify-between gap-2.5 sm:justify-end flex-1 pl-9 sm:pl-0">
        {isEmail && emailHref ? (
          <a
            href={emailHref}
            className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-sky-300 underline decoration-sky-400/40 hover:text-white hover:decoration-sky-400 break-all"
          >
            {value}
            <FaExternalLinkAlt size={10} className="opacity-70" />
          </a>
        ) : isBadge ? (
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-bold text-emerald-300"
          >
            {value}
          </Badge>
        ) : (
          <span
            className={`leading-relaxed break-words ${
              isAddress
                ? "text-xs sm:text-sm font-medium text-white/90 text-left sm:text-right"
                : highlighted
                ? "text-base sm:text-lg font-extrabold text-white"
                : isMono
                ? "font-mono text-xs sm:text-sm font-bold text-cyan-200"
                : "text-xs sm:text-sm font-semibold text-white/90"
            }`}
          >
            {value}
          </span>
        )}

        {/* Copy Button */}
        {onCopy && (
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onCopy}
            className="cursor-pointer shrink-0 rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
            title="Copy"
          >
            {isCopied ? (
              <FaCheck size={12} className="text-emerald-400" />
            ) : (
              <FaRegCopy size={12} />
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}

function RecordCard({
  record,
  index,
  isMain,
  copiedItem,
  onCopy,
}: {
  record: ApiRecord;
  index: number;
  isMain: boolean;
  copiedItem: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  const formattedAddr = formatAddress(record.address);
  const cardId = `${isMain ? "main" : "alt"}-${index}`;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-3.5 sm:p-4 transition-all duration-200 hover:border-violet-400/40 hover:bg-white/[0.08] hover:shadow-lg">
      <div className="space-y-2.5">
        {/* Name and Circle Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
              <FaUser size={12} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {record.name || "Subscriber"}
              </div>
              {record.fname && (
                <div className="text-xs text-white/60">
                  <span className="text-white/40">S/O:</span> {record.fname}
                </div>
              )}
            </div>
          </div>
          {record.circle && (
            <Badge
              variant="outline"
              className="shrink-0 border-indigo-400/30 bg-indigo-500/10 text-[10px] font-medium text-indigo-300"
            >
              {record.circle}
            </Badge>
          )}
        </div>

        {/* Mobile Numbers */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {record.mobile && (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 font-mono text-xs text-cyan-300">
              <FaPhoneAlt size={10} />
              <span>{record.mobile}</span>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(record.mobile!, `m-${cardId}`);
                }}
                className="cursor-pointer text-cyan-400 hover:text-cyan-200"
                title="Copy Number"
              >
                {copiedItem === `m-${cardId}` ? (
                  <FaCheck size={10} className="text-emerald-400" />
                ) : (
                  <FaRegCopy size={10} />
                )}
              </motion.button>
            </div>
          )}

          {record.alt && record.alt !== record.mobile && (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-950/40 px-2 py-0.5 font-mono text-xs text-amber-300">
              <span className="text-[10px] text-amber-400/70">Alt:</span>
              <span>{record.alt}</span>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 rounded-lg bg-black/30 p-2 text-xs text-white/80">
          <FaMapMarkerAlt size={12} className="mt-0.5 shrink-0 text-fuchsia-400" />
          <span className="leading-relaxed break-words">{formattedAddr}</span>
        </div>

        {/* Email or ID if available */}
        <div className="flex flex-wrap gap-2 text-[11px]">
          {record.email && (
            <a
              href={`mailto:${record.email}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-sky-300 underline decoration-sky-300/40 hover:decoration-sky-300"
            >
              <FaEnvelope size={10} />
              {record.email}
            </a>
          )}
          {record.id && (
            <span className="inline-flex items-center gap-1 text-white/50 font-mono">
              <FaIdCard size={10} />
              ID: {record.id}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TelecomInfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/40">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-white/50">{label}</p>
        <p className="truncate font-mono text-sm font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* SHEET 4: DEVELOPER CREDIT (WITH ROTATING 3D EARTH GLOBE)                 */
/* ========================================================================= */

function DeveloperCredit() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex w-full flex-col items-center justify-center p-2 sm:p-4 text-center"
    >
      <div className="relative flex flex-col items-center gap-3.5 rounded-2xl sm:rounded-3xl border border-sky-400/30 bg-black/70 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl max-w-md w-full">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-950/60 px-3.5 py-1 text-xs font-bold text-sky-300">
          <FaUserAstronaut className="animate-bounce text-sky-400" size={14} />
          Creator & Developer
        </div>
        <h2 className="animate-dev-pop text-2xl sm:text-3xl font-black text-white drop-shadow-[0_2px_16px_rgba(255,255,255,0.6)]">
          Anupam Mishra
        </h2>
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
          Planet Earth & Live Phone Data Explorer. Building modern high-performance web applications and intelligence tools.
        </p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="https://t.me/anupam0611"
          target="_blank"
          rel="noopener noreferrer"
          className="animate-dev-pop mt-2 inline-flex items-center gap-2.5 rounded-xl border border-sky-400 bg-sky-500/20 px-5 py-2.5 text-xs sm:text-sm font-bold text-sky-200 shadow-xl shadow-sky-500/25 backdrop-blur-md transition-all hover:bg-sky-500 hover:text-black cursor-pointer"
        >
          <FaTelegramPlane size={16} />
          <span>Telegram @anupam0611</span>
          <FaExternalLinkAlt size={11} className="opacity-70" />
        </motion.a>
      </div>
    </motion.div>
  );
}
