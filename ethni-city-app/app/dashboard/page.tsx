"use client";

import { useState } from "react";
import Link from "next/link";
import SoundSpirit from "@/components/SoundSpirit";

const rawTrips = [
    { id: "01", label: "Lagos Market", status: "processed", color: "bg-retro-green/20" },
    { id: "02", label: "Street Traffic", status: "processed", color: "" },
    { id: "03", label: "Street Art", status: "pending", color: "" },
];

const zinePages = [
    { label: "Page 01: Intro", rotation: "rotate-2" },
    { label: "Page 02: Market", rotation: "-rotate-1" },
    { label: "Page 03: Sounds", rotation: "rotate-3" },
];

export default function DashboardPage() {
    const [agentStatus, setAgentStatus] = useState("Drop your photos here! Niche Mode: ON.");
    const [location, setLocation] = useState("LAGOS, NIGERIA");
    const [progress, setProgress] = useState(82);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [activeNav, setActiveNav] = useState("dashboard");

    return (
        <div className="bg-background-light font-display min-h-screen">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

            <div className="flex h-screen overflow-hidden p-4 gap-4">

                {/* ══ LEFT SIDEBAR ════════════════════════════════════════ */}
                <aside className="w-80 flex flex-col gap-4 overflow-y-auto scrollbar-hide">

                    {/* Mascot + Speech Bubble Card */}
                    <div className="thick-outline bg-white p-6 rounded-xl mechanical-shadow flex flex-col gap-6 relative">

                        {/* Mascot Avatar */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-32 h-32 rounded-full thick-outline overflow-hidden bg-primary/20 flex items-center justify-center">
                                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-electric-violet/40 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-6xl">art_track</span>
                                </div>
                                {/* Green online indicator */}
                                <span className="absolute bottom-2 right-2 w-4 h-4 bg-malachite border-2 border-white rounded-full" />
                            </div>

                            {/* Waveform */}
                            <SoundSpirit speaking={isSpeaking} size="md" />
                        </div>

                        {/* Speech Bubble */}
                        <div className="bg-primary text-white p-4 thick-outline rounded-xl relative">
                            <p className="font-bold text-sm uppercase leading-tight">&ldquo;{agentStatus}&rdquo;</p>
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary thick-outline rotate-45 border-t-0 border-r-0" />
                        </div>

                        {/* Retro Terminal Display */}
                        <div className="bg-black p-4 rounded-lg thick-outline">
                            <p className="text-[10px] text-retro-green/50 font-mono mb-1 uppercase tracking-widest">System Beacon</p>
                            <p className="retro-terminal font-mono text-sm leading-tight uppercase">
                                SENSING LOCATION:<br />{location}
                            </p>
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
                                    className={`flex items-center gap-3 p-3 thick-outline rounded-lg transition-colors text-left ${activeNav === item.id ? "bg-primary/10 hover:bg-primary/20" : "bg-white hover:bg-slate-50"
                                        }`}
                                >
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                    <span className="font-bold text-sm uppercase">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Analog Controls */}
                    <div className="thick-outline bg-slate-200 p-6 rounded-xl flex-shrink-0 mechanical-shadow pattern-clash border-t-8 border-slate-300">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-slate-600">Sonic Controls</p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Frequency", rotate: "" },
                                { label: "Gain", rotate: "rotate-45" },
                            ].map(({ label, rotate }) => (
                                <div key={label} className="flex flex-col items-center gap-2">
                                    <div className="dial-knob w-16 h-16 rounded-full flex items-center justify-center shadow-inner cursor-pointer hover:scale-105 transition-transform">
                                        <div className={`w-1 h-6 bg-slate-900 -mt-6 rounded-full origin-bottom ${rotate}`} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Override Lever */}
                        <div className="mt-8 flex justify-center">
                            <div className="w-12 h-20 bg-slate-800 rounded thick-outline relative flex flex-col items-center py-2 gap-4">
                                <div className="w-8 h-4 bg-mechanical-copper thick-outline rounded" />
                                <div
                                    className="w-8 h-8 bg-slate-400 thick-outline rounded-full shadow-lg cursor-pointer hover:bg-slate-300 transition-colors"
                                    onClick={() => setIsSpeaking(!isSpeaking)}
                                />
                                <span className="absolute -bottom-6 text-[10px] font-bold uppercase">Override</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ══ CENTER: MAP PORTHOLE ════════════════════════════════ */}
                <main className="flex-grow relative flex flex-col gap-4 min-w-0">

                    {/* Dashboard Header */}
                    <header className="flex justify-between items-center bg-white thick-outline p-4 rounded-xl mechanical-shadow flex-shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="size-8 bg-primary rounded-lg thick-outline flex items-center justify-center">
                                <span className="material-symbols-outlined text-white">star_rate</span>
                            </div>
                            <h1 className="text-2xl font-bold uppercase tracking-tighter italic">
                                Ethni-CITY / <span className="text-primary">Lagos Core</span>
                            </h1>
                        </div>
                        <div className="flex gap-4">
                            <div className="thick-outline bg-slate-100 flex items-center px-4 rounded-lg h-10">
                                <span className="material-symbols-outlined text-slate-400 mr-2">search</span>
                                <input
                                    className="bg-transparent border-none focus:ring-0 text-sm font-bold uppercase outline-none w-40"
                                    placeholder="Balogun Market"
                                    type="text"
                                />
                            </div>
                            <div className="size-10 bg-mechanical-copper thick-outline rounded-full overflow-hidden flex items-center justify-center text-white font-black text-sm">
                                DJ
                            </div>
                        </div>
                    </header>

                    {/* Map Porthole */}
                    <div className="flex-grow bg-slate-900 thick-outline rounded-[3rem] overflow-hidden relative shadow-inner min-h-0">
                        {/* Simulated Map Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
                            {/* Grid pattern to simulate map */}
                            <div className="absolute inset-0 opacity-20">
                                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#9c06f9" strokeWidth="0.5" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid)" />
                                </svg>
                            </div>
                            {/* Simulated city blocks */}
                            {[
                                { x: "15%", y: "20%", w: "12%", h: "8%", opacity: "0.3" },
                                { x: "30%", y: "15%", w: "18%", h: "12%", opacity: "0.2" },
                                { x: "55%", y: "25%", w: "10%", h: "15%", opacity: "0.35" },
                                { x: "10%", y: "40%", w: "20%", h: "10%", opacity: "0.25" },
                                { x: "40%", y: "50%", w: "14%", h: "14%", opacity: "0.3" },
                                { x: "65%", y: "45%", w: "16%", h: "8%", opacity: "0.2" },
                                { x: "20%", y: "65%", w: "18%", h: "12%", opacity: "0.25" },
                                { x: "50%", y: "70%", w: "10%", h: "10%", opacity: "0.3" },
                            ].map((block, i) => (
                                <div
                                    key={i}
                                    className="absolute bg-primary/40 border border-primary/20 rounded"
                                    style={{ left: block.x, top: block.y, width: block.w, height: block.h, opacity: block.opacity }}
                                />
                            ))}
                        </div>

                        {/* Map Overlays */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative flex items-center justify-center">
                                {/* Sonic Pulse Rings */}
                                <div className="absolute w-40 h-40 border-4 border-accent-gold rounded-full sonic-ring" />
                                <div className="absolute w-40 h-40 border-2 border-accent-gold rounded-full sonic-ring" style={{ animationDelay: "0.6s" }} />
                                <div className="absolute w-40 h-40 border border-accent-gold/50 rounded-full sonic-ring" style={{ animationDelay: "1.2s" }} />

                                {/* Location Cursor */}
                                <div className="bg-white thick-outline p-2 px-4 rounded-lg flex items-center gap-2 pointer-events-auto shadow-xl z-10">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                    <span className="font-bold text-xs uppercase">Balogun Market</span>
                                </div>
                            </div>
                        </div>

                        {/* Map Controls */}
                        <div className="absolute bottom-10 right-10 flex flex-col gap-2">
                            <button className="size-12 bg-white thick-outline flex items-center justify-center hover:bg-slate-100 transition-colors rounded">
                                <span className="material-symbols-outlined">add</span>
                            </button>
                            <button className="size-12 bg-white thick-outline flex items-center justify-center hover:bg-slate-100 transition-colors rounded">
                                <span className="material-symbols-outlined">remove</span>
                            </button>
                            <button className="size-12 bg-primary thick-outline text-white flex items-center justify-center mt-4 rounded hover:bg-primary/80 transition-colors">
                                <span className="material-symbols-outlined">near_me</span>
                            </button>
                        </div>

                        {/* Map Attribution */}
                        <div className="absolute bottom-4 left-6 text-[10px] text-slate-400 font-mono uppercase">
                            CesiumJS × Google Maps 3D Tiles
                        </div>
                    </div>
                </main>

                {/* ══ RIGHT PANEL ════════════════════════════════════════ */}
                <aside className="w-96 flex flex-col gap-4 overflow-y-auto scrollbar-hide">

                    {/* Raw Trips Panel */}
                    <div className="thick-outline bg-white p-6 rounded-xl mechanical-shadow flex flex-col gap-6">
                        <div>
                            <h2 className="text-xl font-bold uppercase italic border-b-4 border-primary inline-block">Your Raw Trips</h2>
                            <p className="text-xs text-slate-500 mt-2 font-bold uppercase">Unedited captures from the field</p>
                        </div>

                        {/* Photo Assembly Line */}
                        <div className="flex flex-col gap-4 relative">
                            {/* Vertical timeline line */}
                            <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-200 -z-10" />

                            {rawTrips.map((trip) => (
                                <div key={trip.id} className="flex items-center gap-4">
                                    <div className="size-12 bg-white thick-outline rounded flex items-center justify-center font-black flex-shrink-0">
                                        {trip.id}
                                    </div>
                                    <div className={`flex-grow thick-outline overflow-hidden rounded-lg aspect-video relative ${trip.status === "pending" ? "opacity-50" : ""}`}>
                                        <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-600 text-3xl">
                                                {trip.status === "pending" ? "hourglass_empty" : "photo_camera"}
                                            </span>
                                        </div>
                                        {trip.color && (
                                            <div className={`absolute inset-0 ${trip.color} mix-blend-overlay`} />
                                        )}
                                        <div className="absolute bottom-1 left-2 text-[10px] font-bold text-white uppercase bg-black/40 px-1 rounded">
                                            {trip.label}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Process CTA */}
                        <Link href="/zine/lagos-market-01">
                            <button className="w-full bg-primary text-white p-4 thick-outline rounded-lg flex items-center justify-center gap-3 mechanical-shadow hover:translate-y-1 transition-transform font-bold uppercase italic">
                                <span className="material-symbols-outlined">factory</span>
                                Process to Zine
                            </button>
                        </Link>
                    </div>

                    {/* Zine Preview Strip */}
                    <div className="thick-outline bg-slate-900 p-6 rounded-xl flex-grow mechanical-shadow flex flex-col gap-4 overflow-hidden">
                        <div className="flex justify-between items-center flex-shrink-0">
                            <h3 className="text-white font-bold uppercase text-xs tracking-widest">Zine Preview Strip</h3>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-retro-green" />
                                <div className="w-2 h-2 rounded-full bg-retro-green opacity-30" />
                                <div className="w-2 h-2 rounded-full bg-retro-green opacity-10" />
                            </div>
                        </div>

                        {/* Scrollable Zine Pages */}
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
                            {zinePages.map((page) => (
                                <div
                                    key={page.label}
                                    className={`min-w-[120px] aspect-[3/4] bg-white thick-outline flex-shrink-0 snap-start ${page.rotation} flex flex-col p-2 cursor-pointer hover:scale-105 transition-transform`}
                                >
                                    <div className="bg-slate-200 flex-grow rounded thick-outline overflow-hidden flex items-center justify-center">
                                        <span className="material-symbols-outlined text-slate-400 text-3xl">auto_stories</span>
                                    </div>
                                    <span className="text-[8px] font-bold mt-2 uppercase">{page.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Assembly Progress */}
                        <div className="mt-auto bg-slate-800 p-3 rounded thick-outline border-l-8 border-primary">
                            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-2">
                                <span>Assembly Line active</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-1000"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}
