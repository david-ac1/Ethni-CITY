"use client";

import { useState } from "react";
import Link from "next/link";
import SoundSpirit from "@/components/SoundSpirit";

const rawTrips = [
  { id: "01", label: "Lagos Market", status: "processed" },
  { id: "02", label: "Street Traffic", status: "processed" },
  { id: "03", label: "Street Art", status: "pending" },
];

const zinePages = [
  { label: "Page 01: Intro", rotation: "rotate(2deg)" },
  { label: "Page 02: Market", rotation: "rotate(-1deg)" },
  { label: "Page 03: Sounds", rotation: "rotate(3deg)" },
];

export default function DashboardPage() {
  const [agentStatus] = useState("Drop your photos here! Niche Mode: ON.");
  const [location] = useState("LAGOS, NIGERIA");
  const [progress] = useState(82);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div className="font-display min-h-screen" style={{ backgroundColor: "#1b0f23" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

      <div className="flex h-screen overflow-hidden p-4 gap-4">

        {/* ══ LEFT SIDEBAR ══════════════════════════════════════════════════ */}
        <aside className="w-80 flex flex-col gap-4 overflow-y-auto scrollbar-hide">

          {/* Mascot Card */}
          <div className="thick-outline bg-white p-6 rounded-xl mechanical-shadow flex flex-col gap-6">

            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="relative w-32 h-32 rounded-full thick-outline overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: "rgba(156,6,249,0.15)" }}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(156,6,249,0.3), rgba(143,0,255,0.5))" }}
                >
                  <span className="material-symbols-outlined text-white text-6xl">art_track</span>
                </div>
                <span
                  className="absolute bottom-2 right-2 w-4 h-4 border-2 border-white rounded-full"
                  style={{ backgroundColor: "#00cf64" }}
                />
              </div>
              <SoundSpirit speaking={isSpeaking} size="md" />
            </div>

            {/* Speech Bubble */}
            <div
              className="text-white p-4 thick-outline rounded-xl relative"
              style={{ backgroundColor: "#9c06f9" }}
            >
              <p className="font-bold text-sm uppercase leading-tight">&ldquo;{agentStatus}&rdquo;</p>
              <div
                className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 thick-outline rotate-45 border-t-0 border-r-0"
                style={{ backgroundColor: "#9c06f9" }}
              />
            </div>

            {/* Retro Terminal */}
            <div className="bg-black p-4 rounded-lg thick-outline">
              <p className="text-[10px] font-mono mb-1 uppercase tracking-widest" style={{ color: "rgba(57,255,20,0.5)" }}>System Beacon</p>
              <p className="retro-terminal font-mono text-sm leading-tight uppercase">{`SENSING LOCATION:\n${location}`}</p>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-2">
              {[
                { id: "dashboard", icon: "dashboard", label: "Dashboard" },
                { id: "explorer", icon: "map", label: "Explorer" },
                { id: "zine", icon: "auto_stories", label: "Zine Factory" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className="flex items-center gap-3 p-3 thick-outline rounded-lg transition-colors text-left"
                  style={{
                    backgroundColor: activeNav === item.id ? "rgba(156,6,249,0.12)" : "white",
                    borderLeft: activeNav === item.id ? "4px solid #9c06f9" : undefined,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: activeNav === item.id ? "#9c06f9" : "#1b0f23" }}>{item.icon}</span>
                  <span className="font-bold text-sm uppercase">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Analog Controls */}
          <div
            className="thick-outline p-6 rounded-xl flex-shrink-0 mechanical-shadow border-t-8 border-slate-400"
            style={{ background: "radial-gradient(#9c06f9 1px, transparent 1px), linear-gradient(45deg, #e8ddd0 25%, transparent 25%)", backgroundSize: "10px 10px, 40px 40px", backgroundColor: "#d9cebe" }}
          >
            <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: "#4a3728" }}>Sonic Controls</p>
            <div className="grid grid-cols-2 gap-4">
              {[{ label: "Frequency", rotate: "" }, { label: "Gain", rotate: "rotate(45deg)" }].map(({ label, rotate }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-inner cursor-pointer hover:scale-105 transition-transform"
                    style={{ background: "conic-gradient(from 0deg, #b87333, #8b4513, #b87333)", border: "2px solid #1b0f23" }}
                  >
                    <div className="w-1 h-6 bg-slate-900 -mt-6 rounded-full origin-bottom" style={{ transform: rotate || undefined }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase" style={{ color: "#4a3728" }}>{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <div className="w-12 h-20 bg-slate-800 rounded thick-outline relative flex flex-col items-center py-2 gap-4">
                <div className="w-8 h-4 thick-outline rounded" style={{ backgroundColor: "#b87333" }} />
                <div
                  className="w-8 h-8 thick-outline rounded-full shadow-lg cursor-pointer hover:bg-slate-300 transition-colors"
                  style={{ backgroundColor: "#94a3b8" }}
                  onClick={() => setIsSpeaking(!isSpeaking)}
                />
                <span className="absolute -bottom-6 text-[10px] font-bold uppercase text-white">Override</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ══ CENTER MAP ════════════════════════════════════════════════════ */}
        <main className="flex-grow relative flex flex-col gap-4 min-w-0">

          {/* Header Bar */}
          <header className="flex justify-between items-center bg-white thick-outline p-4 rounded-xl mechanical-shadow flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="size-8 rounded-lg thick-outline flex items-center justify-center" style={{ backgroundColor: "#9c06f9" }}>
                <span className="material-symbols-outlined text-white">star_rate</span>
              </div>
              <h1 className="text-2xl font-bold uppercase tracking-tighter italic">
                Ethni-CITY / <span style={{ color: "#9c06f9" }}>Lagos Core</span>
              </h1>
            </div>
            <div className="flex gap-4">
              <div className="thick-outline flex items-center px-4 rounded-lg h-10" style={{ backgroundColor: "#f1f5f9" }}>
                <span className="material-symbols-outlined text-slate-400 mr-2">search</span>
                <input className="bg-transparent border-none focus:ring-0 text-sm font-bold uppercase outline-none w-40" placeholder="Balogun Market" type="text" />
              </div>
              <div
                className="size-10 thick-outline rounded-full overflow-hidden flex items-center justify-center text-white font-black text-sm"
                style={{ backgroundColor: "#b87333" }}
              >
                DJ
              </div>
            </div>
          </header>

          {/* Map Porthole */}
          <div
            className="flex-grow thick-outline rounded-[3rem] overflow-hidden relative shadow-inner min-h-0"
            style={{ backgroundColor: "#0d0a14" }}
          >
            {/* Grid Map BG */}
            <div className="absolute inset-0">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#9c06f9" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
              </svg>
            </div>

            {/* Simulated city blocks */}
            {[
              { x: "15%", y: "20%", w: "12%", h: "8%" },
              { x: "30%", y: "15%", w: "18%", h: "12%" },
              { x: "55%", y: "25%", w: "10%", h: "15%" },
              { x: "10%", y: "40%", w: "20%", h: "10%" },
              { x: "40%", y: "50%", w: "14%", h: "14%" },
              { x: "65%", y: "45%", w: "16%", h: "8%" },
              { x: "20%", y: "65%", w: "18%", h: "12%" },
            ].map((block, i) => (
              <div
                key={i}
                className="absolute rounded"
                style={{ left: block.x, top: block.y, width: block.w, height: block.h, backgroundColor: "rgba(156,6,249,0.25)", border: "1px solid rgba(156,6,249,0.3)" }}
              />
            ))}

            {/* Sonic Pulse Rings + Location Pin */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-40 h-40 border-4 rounded-full sonic-ring" style={{ borderColor: "#d4af37" }} />
                <div className="absolute w-40 h-40 border-2 rounded-full sonic-ring" style={{ borderColor: "#d4af37", animationDelay: "0.6s" }} />
                <div className="absolute w-40 h-40 border rounded-full sonic-ring" style={{ borderColor: "rgba(212,175,55,0.4)", animationDelay: "1.2s" }} />
                <div className="bg-white thick-outline p-2 px-4 rounded-lg flex items-center gap-2 pointer-events-auto shadow-xl z-10">
                  <span className="material-symbols-outlined" style={{ color: "#9c06f9" }}>location_on</span>
                  <span className="font-bold text-xs uppercase">Balogun Market</span>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-10 right-10 flex flex-col gap-2">
              {[{ icon: "add", bg: "white" }, { icon: "remove", bg: "white" }].map(({ icon, bg }) => (
                <button key={icon} className="size-12 thick-outline flex items-center justify-center rounded transition-colors hover:opacity-80" style={{ backgroundColor: bg }}>
                  <span className="material-symbols-outlined">{icon}</span>
                </button>
              ))}
              <button className="size-12 thick-outline text-white flex items-center justify-center mt-4 rounded hover:opacity-80 transition-colors" style={{ backgroundColor: "#9c06f9" }}>
                <span className="material-symbols-outlined">near_me</span>
              </button>
            </div>

            <div className="absolute bottom-4 left-6 text-[10px] font-mono uppercase" style={{ color: "#4a3555" }}>
              CesiumJS × Google Maps 3D Tiles
            </div>
          </div>
        </main>

        {/* ══ RIGHT PANEL ═══════════════════════════════════════════════════ */}
        <aside className="w-96 flex flex-col gap-4 overflow-y-auto scrollbar-hide">

          {/* Raw Trips */}
          <div className="thick-outline bg-white p-6 rounded-xl mechanical-shadow flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold uppercase italic inline-block" style={{ borderBottom: "4px solid #9c06f9" }}>Your Raw Trips</h2>
              <p className="text-xs text-slate-500 mt-2 font-bold uppercase">Unedited captures from the field</p>
            </div>

            <div className="flex flex-col gap-4 relative">
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-200 -z-10" />
              {rawTrips.map((trip) => (
                <div key={trip.id} className="flex items-center gap-4">
                  <div className="size-12 bg-white thick-outline rounded flex items-center justify-center font-black flex-shrink-0">
                    {trip.id}
                  </div>
                  <div
                    className="flex-grow thick-outline overflow-hidden rounded-lg aspect-video relative"
                    style={{ opacity: trip.status === "pending" ? 0.5 : 1 }}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: trip.id === "01"
                          ? "linear-gradient(135deg, #e2725b, #d4af37)"
                          : trip.id === "02"
                          ? "linear-gradient(135deg, #9c06f9, #00cf64)"
                          : "linear-gradient(135deg, #b87333, #8b4513)"
                      }}
                    >
                      <span className="material-symbols-outlined text-white text-3xl">
                        {trip.status === "pending" ? "hourglass_empty" : "photo_camera"}
                      </span>
                    </div>
                    {trip.status === "processed" && (
                      <div className="absolute inset-0 mix-blend-overlay" style={{ backgroundColor: "rgba(57,255,20,0.15)" }} />
                    )}
                    <div className="absolute bottom-1 left-2 text-[10px] font-bold text-white uppercase px-1 rounded" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                      {trip.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/zine/lagos-market-01">
              <button
                className="w-full text-white p-4 thick-outline rounded-lg flex items-center justify-center gap-3 mechanical-shadow hover:translate-y-1 transition-transform font-bold uppercase italic"
                style={{ backgroundColor: "#9c06f9" }}
              >
                <span className="material-symbols-outlined">factory</span>
                Process to Zine
              </button>
            </Link>
          </div>

          {/* Zine Preview Strip */}
          <div className="thick-outline p-6 rounded-xl flex-grow mechanical-shadow flex flex-col gap-4 overflow-hidden" style={{ backgroundColor: "#1b0f23" }}>
            <div className="flex justify-between items-center flex-shrink-0">
              <h3 className="text-white font-bold uppercase text-xs tracking-widest">Zine Preview Strip</h3>
              <div className="flex gap-1">
                {[1, 0.3, 0.1].map((opacity, i) => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: "#39ff14", opacity }} />
                ))}
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
              {zinePages.map((page) => (
                <div
                  key={page.label}
                  className="min-w-[120px] aspect-[3/4] bg-white thick-outline flex-shrink-0 snap-start flex flex-col p-2 cursor-pointer hover:scale-105 transition-transform"
                  style={{ transform: page.rotation }}
                >
                  <div className="flex-grow rounded thick-outline overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#e2e8f0" }}>
                    <span className="material-symbols-outlined text-slate-400 text-3xl">auto_stories</span>
                  </div>
                  <span className="text-[8px] font-bold mt-2 uppercase">{page.label}</span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div
              className="mt-auto p-3 rounded thick-outline border-l-8"
              style={{ backgroundColor: "#2d1f3d", borderLeftColor: "#9c06f9" }}
            >
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-2">
                <span>Assembly Line active</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#3d2c58" }}>
                <div className="h-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: "#9c06f9" }} />
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
