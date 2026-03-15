"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import SoundSpirit from "@/components/SoundSpirit";
import { useEthniStore, PhotoTrip } from "@/lib/store";
import type { CesiumMapHandle } from "@/components/CesiumMap";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const compressImage = (file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" }));
            } else {
              resolve(file); // fallback to original if blob fails
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file); // fallback
    };
    reader.onerror = () => resolve(file); // fallback
  });
};

// Dynamically import CesiumMap (no SSR — uses browser APIs)
const CesiumMap = dynamic(() => import("@/components/CesiumMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#0d0a14" }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "#9c06f9", borderTopColor: "transparent" }} />
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "rgba(57,255,20,0.6)" }}>Loading 3D Globe...</p>
      </div>
    </div>
  ),
});

const PANELS = [
  { id: "dashboard", icon: "dashboard", label: "Dashboard" },
  { id: "explorer", icon: "map", label: "Explorer" },
  { id: "zine", icon: "auto_stories", label: "Zine Factory" },
];

export default function DashboardPage() {
  const router = useRouter();
  const mapRef = useRef<CesiumMapHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [isDragging, setIsDragging] = useState(false);
  const [processingTripId, setProcessingTripId] = useState<string | null>(null);

  const {
    trips,
    activeLocation,
    agentStatus,
    discoveredArtists,
    zineHook,
    isGeneratingZine,
    addTrip,
    updateTrip,
    setActiveLocation,
    setAgentStatus,
    setDiscoveredArtists,
    setUserVibe,
    setInteractionState,
    interactionState,
    userVibe,
    setIsGeneratingZine,
    setCurrentZine,
  } = useEthniStore();

  // --- Photo Upload & Analysis Pipeline ---
  const processPhoto = useCallback(async (file: File) => {
    const id = `trip-${Date.now()}`;
    const previewUrl = URL.createObjectURL(file);
    const tripNumber = String(trips.length + 1).padStart(2, "0");

    const newTrip: PhotoTrip = {
      id,
      label: file.name.split(".")[0].replace(/_/g, " "),
      file,
      previewUrl,
      status: "uploading",
    };

    addTrip(newTrip);
    setAgentStatus(`Uploading and compressing ${file.name}...`);

    try {
      // Step 0: Compress the image so we don't timeout the Gemini API with massive 10MB iPhone photos
      const compressedFile = await compressImage(file);

      // Step 1: Analyze photo with Gemini Vision
      updateTrip(id, { status: "analyzing" });
      setAgentStatus(`Gemini is reading the cultural markers... 🔍`);

      const formData = new FormData();
      formData.append("photo", compressedFile);

      const analyzeRes = await fetch("/api/analyze-photo", { method: "POST", body: formData });
      if (!analyzeRes.ok) throw new Error("Photo analysis failed");
      const { analysis } = await analyzeRes.json();

      // Update store + terminal
      updateTrip(id, { status: "processed", analysis });
      setActiveLocation(`${analysis.neighbourhood}, ${analysis.city.toUpperCase()}, ${analysis.country.toUpperCase()}`, analysis.coordinates);
      setAgentStatus(`📍 Detected: ${analysis.neighbourhood}, ${analysis.city}. Destination locked.`);
      setInteractionState("awaiting_vibe");
      setProcessingTripId(id);

      // Step 2: Fly CesiumMap to location
      if (analysis.coordinates.lat !== 0 && mapRef.current) {
        mapRef.current.flyTo(analysis.coordinates.lat, analysis.coordinates.lng, 1200);
      }

    } catch (err) {
      console.error("Processing error:", err);
      updateTrip(id, { status: "error" });
      setAgentStatus(`⚠️ Something went wrong. Try another photo.`);
    }
  }, [trips.length, addTrip, updateTrip, setActiveLocation, setAgentStatus, setInteractionState]);

  // --- Map Interaction ---
  const handleMapChange = useCallback((lat: number, lng: number) => {
    setActiveLocation("User Custom Location", { lat, lng });
    if (interactionState === "ready") {
      setInteractionState("awaiting_vibe"); // Re-open the DJ panel if they move the pin
      setAgentStatus("📍 Location refined. Want to update the vibe too?");
    }
  }, [setActiveLocation, interactionState, setInteractionState, setAgentStatus]);

  // --- Artist Discovery (Triggered by DJ Vibe) ---
  const handleDiscoverArtists = useCallback(async () => {
    const activeTrip = trips.find((t) => t.id === processingTripId);
    if (!activeTrip?.analysis) return;

    setInteractionState("curating");
    setAgentStatus(`🎵 DJ is curating ${userVibe || "the local sound"} for you...`);

    try {
      const artistRes = await fetch("/api/find-artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: activeTrip.analysis.city,
          country: activeTrip.analysis.country,
          neighbourhood: activeTrip.analysis.neighbourhood,
          cultural_markers: activeTrip.analysis.cultural_markers,
          vibe_descriptors: activeTrip.analysis.vibe_descriptors,
          userVibe: userVibe,
        }),
      });
      if (!artistRes.ok) throw new Error("Artist discovery failed");
      const artistData = await artistRes.json();

      setDiscoveredArtists(artistData.artists || [], artistData.location_music_context || "", artistData.zine_hook || "");
      setAgentStatus(`🎧 Vibe set! Found ${artistData.artists?.length || 0} artists. Ready to generate your Zine.`);
      setInteractionState("ready");

    } catch (err) {
      console.error("Discovery error:", err);
      setAgentStatus(`⚠️ DJ hit a snag. Try spinning back or adjusting the vibe.`);
      setInteractionState("awaiting_vibe");
    }
  }, [trips, processingTripId, userVibe, setAgentStatus, setDiscoveredArtists, setInteractionState]);

  // --- Zine Generation ---
  const handleGenerateZine = useCallback(async () => {
    const featuredArtist = discoveredArtists[0];
    const activeTrip = trips.find((t) => t.id === processingTripId);
    if (!featuredArtist || !activeTrip?.analysis) return;

    setIsGeneratingZine(true);
    setAgentStatus("✨ Writing your Sonic Story-Zine...");

    try {
      // Step 0: Convert the local file to a persistent Base64 string so it survives page navigation
      const base64Photo = await fileToBase64(activeTrip.file);

      const res = await fetch("/api/generate-zine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: {
            city: activeTrip.analysis.city,
            country: activeTrip.analysis.country,
            neighbourhood: activeTrip.analysis.neighbourhood,
          },
          photo_analysis: {
            cultural_markers: activeTrip.analysis.cultural_markers,
            vibe_descriptors: activeTrip.analysis.vibe_descriptors,
            architecture_style: activeTrip.analysis.architecture_style,
          },
          photo_url: base64Photo,
          featured_artist: featuredArtist,
          all_artists: discoveredArtists,
          location_music_context: useEthniStore.getState().locationMusicContext,
          zine_hook: zineHook,
        }),
      });

      if (!res.ok) throw new Error("Zine generation failed");
      const { zine } = await res.json();

      setCurrentZine(zine);
      setIsGeneratingZine(false);
      setAgentStatus("🎉 Zine ready! Click to open your Sonic Story.");

      // Navigate to zine page safely to preserve Zustand state
      router.push(`/zine/${zine.zine_id}`);

    } catch (err) {
      console.error("Zine generation error:", err);
      setIsGeneratingZine(false);
      setAgentStatus("⚠️ Zine generation failed. Try again.");
    }
  }, [discoveredArtists, processingTripId, trips, zineHook, setIsGeneratingZine, setCurrentZine, setAgentStatus]);

  // --- Drag & Drop ---
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    files.forEach(processPhoto);
  }, [processPhoto]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
    files.forEach(processPhoto);
  }, [processPhoto]);

  const hasProcessedTrips = trips.some((t) => t.status === "processed");
  const progress = Math.min(100, (trips.filter((t) => t.status === "processed").length / Math.max(1, trips.length)) * 100);

  return (
    <div className="font-display min-h-screen" style={{ backgroundColor: "#1b0f23" }}>
      <div className="flex h-screen overflow-hidden p-4 gap-4">

        {/* ══ LEFT SIDEBAR ══════════════════════════════════════════ */}
        <aside className="w-80 flex flex-col gap-4 overflow-y-auto scrollbar-hide">

          {/* Mascot Card */}
          <div className="thick-outline bg-white p-6 rounded-xl mechanical-shadow flex flex-col gap-5">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 rounded-full thick-outline overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(156,6,249,0.3), rgba(143,0,255,0.5))" }}>
                <span className="material-symbols-outlined text-white text-6xl">art_track</span>
                <span className="absolute bottom-2 right-2 w-4 h-4 border-2 border-white rounded-full" style={{ backgroundColor: "#00cf64" }} />
              </div>
              <SoundSpirit speaking={agentStatus.includes("🎵") || agentStatus.includes("✨")} size="md" />
            </div>

            {/* Live Status Bubble */}
            <div className="text-white p-4 thick-outline rounded-xl relative" style={{ backgroundColor: "#9c06f9" }}>
              <p className="font-bold text-sm leading-tight">{agentStatus}</p>
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 thick-outline rotate-45 border-t-0 border-r-0" style={{ backgroundColor: "#9c06f9" }} />
            </div>

            {/* Retro Terminal */}
            <div className="bg-black p-4 rounded-lg thick-outline">
              <p className="text-[10px] font-mono mb-1 uppercase tracking-widest" style={{ color: "rgba(57,255,20,0.5)" }}>System Beacon</p>
              <p className="retro-terminal font-mono text-sm leading-tight uppercase whitespace-pre-line">{`SENSING LOCATION:\n${activeLocation}`}</p>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-2">
              {PANELS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className="flex items-center gap-3 p-3 thick-outline rounded-lg transition-colors text-left"
                  style={{ backgroundColor: activeNav === item.id ? "rgba(156,6,249,0.12)" : "white", borderLeft: activeNav === item.id ? "4px solid #9c06f9" : undefined }}
                >
                  <span className="material-symbols-outlined" style={{ color: activeNav === item.id ? "#9c06f9" : "#1b0f23" }}>{item.icon}</span>
                  <span className="font-bold text-sm uppercase">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Discovered Artists Panel */}
          {interactionState === "awaiting_vibe" && (
            <div className="thick-outline p-6 rounded-xl mechanical-shadow flex flex-col gap-4 bg-white border-t-8" style={{ borderTopColor: "#9c06f9" }}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9c06f9] animate-pulse">record_voice_over</span>
                <p className="font-black text-xs uppercase tracking-widest text-[#9c06f9]">Agentic DJ Interaction</p>
              </div>
              <p className="text-sm font-bold leading-tight">"I'm locked on ${activeLocation.split(',')[1]?.trim() || 'the spot'}. What's the energy/vibe for this post, DJ?"</p>
              
              <div className="relative">
                <input 
                  type="text"
                  placeholder="e.g. Dark & Moody, Summer Night, High Energy..."
                  className="w-full p-3 thick-outline rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#9c06f9]"
                  value={userVibe}
                  onChange={(e) => setUserVibe(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDiscoverArtists()}
                />
              </div>

              <div className="flex gap-2">
                {["Chill", "Upbeat", "Dark", "Nostalgic"].map((v) => (
                  <button 
                    key={v}
                    onClick={() => { setUserVibe(v); }}
                    className="px-2 py-1 text-[10px] font-black uppercase border-2 border-black rounded hover:bg-[#9c06f9] hover:text-white transition-colors"
                  >
                    {v}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleDiscoverArtists}
                className="w-full bg-[#9c06f9] text-white p-3 thick-outline rounded-lg font-black uppercase italic mechanical-shadow hover:translate-y-1 hover:shadow-none transition-all"
              >
                Set the Vibe
              </button>
            </div>
          )}

          {interactionState === "curating" && (
            <div className="thick-outline p-6 rounded-xl mechanical-shadow flex flex-col items-center gap-4 bg-white">
              <div className="w-12 h-12 border-4 border-[#9c06f9] border-t-transparent rounded-full animate-spin" />
              <p className="font-black text-xs uppercase tracking-widest text-center">DJ is spinning the crates...</p>
            </div>
          )}

          {discoveredArtists.length > 0 && interactionState === "ready" && (
            <div className="thick-outline p-4 rounded-xl mechanical-shadow flex flex-col gap-3" style={{ backgroundColor: "#2d1f3d" }}>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#9c06f9" }}>🎧 Artists Discovered</p>
              {discoveredArtists.map((artist, i) => (
                <div key={i} className="bg-white thick-outline p-3 rounded-lg">
                  <p className="font-black text-sm uppercase">{artist.name}</p>
                  <p className="text-[11px] font-bold" style={{ color: "#9c06f9" }}>{artist.genre}</p>
                  <p className="text-[10px] mt-1" style={{ color: "#64748b" }}>{artist.bio}</p>
                </div>
              ))}
            </div>
          )}

          {/* Analog Controls */}
          <div className="thick-outline p-6 rounded-xl flex-shrink-0 mechanical-shadow border-t-8 border-slate-400" style={{ background: "radial-gradient(#9c06f9 1px, transparent 1px), linear-gradient(45deg, #e8ddd0 25%, transparent 25%)", backgroundSize: "10px 10px, 40px 40px", backgroundColor: "#d9cebe" }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: "#4a3728" }}>Sonic Controls</p>
            <div className="grid grid-cols-2 gap-4">
              {[{ label: "Frequency", rotate: "" }, { label: "Gain", rotate: "rotate(45deg)" }].map(({ label, rotate }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" style={{ background: "conic-gradient(from 0deg, #b87333, #8b4513, #b87333)", border: "2px solid #1b0f23" }}>
                    <div className="w-1 h-6 bg-slate-900 -mt-6 rounded-full origin-bottom" style={{ transform: rotate || undefined }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase" style={{ color: "#4a3728" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ══ CENTER: MAP ════════════════════════════════════════════ */}
        <main className="flex-grow relative flex flex-col gap-4 min-w-0">

          {/* Header bar */}
          <header className="flex justify-between items-center bg-white thick-outline p-4 rounded-xl mechanical-shadow flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="size-8 rounded-lg thick-outline flex items-center justify-center" style={{ backgroundColor: "#9c06f9" }}>
                <span className="material-symbols-outlined text-white">star_rate</span>
              </div>
              <h1 className="text-2xl font-bold uppercase tracking-tighter italic">
                Ethni-CITY / <span style={{ color: "#9c06f9" }}>{activeLocation.split(",")[1]?.trim() || "Global South"}</span>
              </h1>
            </div>
            <div className="flex gap-4 items-center">
              {/* Upload trigger */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border-4 border-black px-4 py-2 rounded-lg font-bold text-sm uppercase neo-brutalism-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                style={{ backgroundColor: "#00cf64" }}
              >
                <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
                Upload Photo
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} />
              <div className="size-10 thick-outline rounded-full overflow-hidden flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: "#b87333" }}>DJ</div>
            </div>
          </header>

          {/* CesiumJS Map Porthole */}
          <div
            className="flex-grow thick-outline rounded-[3rem] overflow-hidden relative min-h-0"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <CesiumMap ref={mapRef} onLocationChange={handleMapChange} className="w-full h-full" />

            {/* Drag overlay */}
            {isDragging && (
              <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[3rem]" style={{ backgroundColor: "rgba(156,6,249,0.85)" }}>
                <div className="text-center text-white">
                  <span className="material-symbols-outlined text-8xl mb-4 block">upload_file</span>
                  <p className="text-3xl font-black uppercase tracking-widest">Drop Photo Here</p>
                  <p className="font-bold mt-2 opacity-80">Gemini will read the culture</p>
                </div>
              </div>
            )}

            {/* Empty state overlay */}
            {trips.length === 0 && !isDragging && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="text-center px-8" style={{ backgroundColor: "rgba(27,15,35,0.7)", borderRadius: "2rem", padding: "3rem", backdropFilter: "blur(8px)" }}>
                  <span className="material-symbols-outlined text-6xl mb-4 block" style={{ color: "#9c06f9" }}>upload_file</span>
                  <p className="text-white font-black text-2xl uppercase">Drag a photo here</p>
                  <p className="font-bold mt-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>or use the Upload button above</p>
                  <p className="mt-4 text-[11px] uppercase tracking-widest font-bold" style={{ color: "#39ff14" }}>Gemini Vision will identify the culture</p>
                </div>
              </div>
            )}

            {/* Location pin overlay */}
            {activeLocation !== "Awaiting your photo..." && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <div className="bg-white thick-outline px-4 py-2 rounded-full flex items-center gap-2 neo-brutalism-shadow-sm">
                  <span className="material-symbols-outlined text-sm" style={{ color: "#9c06f9" }}>location_on</span>
                  <span className="font-bold text-xs uppercase">{activeLocation}</span>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#00cf64" }} />
                </div>
              </div>
            )}

            {/* Map Controls */}
            <div className="absolute bottom-10 right-10 flex flex-col gap-2 z-10">
              {["add", "remove"].map((icon) => (
                <button key={icon} className="size-12 bg-white thick-outline flex items-center justify-center rounded hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined">{icon}</span>
                </button>
              ))}
              <button className="size-12 thick-outline text-white flex items-center justify-center mt-4 rounded" style={{ backgroundColor: "#9c06f9" }}>
                <span className="material-symbols-outlined">near_me</span>
              </button>
            </div>

            <div className="absolute bottom-4 left-6 text-[10px] font-mono uppercase z-10" style={{ color: "#4a3555" }}>
              CesiumJS × Google Maps 3D Tiles
            </div>
          </div>
        </main>

        {/* ══ RIGHT PANEL ═══════════════════════════════════════════ */}
        <aside className="w-96 flex flex-col gap-4 overflow-y-auto scrollbar-hide">

          {/* Raw Trips */}
          <div className="thick-outline bg-white p-6 rounded-xl mechanical-shadow flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold uppercase italic inline-block" style={{ borderBottom: "4px solid #9c06f9" }}>Your Raw Trips</h2>
              <p className="text-xs text-slate-500 mt-2 font-bold uppercase">
                {trips.length === 0 ? "Upload a travel photo to begin" : `${trips.length} photo${trips.length > 1 ? "s" : ""} uploaded`}
              </p>
            </div>

            <div className="flex flex-col gap-4 relative">
              {trips.length > 0 && <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-200 -z-10" />}

              {/* Empty state */}
              {trips.length === 0 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-primary transition-colors cursor-pointer w-full"
                  style={{ backgroundColor: "#f8f5ff" }}
                >
                  <span className="material-symbols-outlined text-4xl" style={{ color: "#9c06f9" }}>add_photo_alternate</span>
                  <p className="font-black text-sm uppercase" style={{ color: "#9c06f9" }}>Click to Upload</p>
                  <p className="text-xs text-slate-500">or drag photos onto the map</p>
                </button>
              )}

              {trips.map((trip) => (
                <div key={trip.id} className="flex items-center gap-4">
                  <div className="size-12 bg-white thick-outline rounded flex items-center justify-center font-black flex-shrink-0 text-sm">
                    {trips.indexOf(trip) + 1 < 10 ? `0${trips.indexOf(trip) + 1}` : trips.indexOf(trip) + 1}
                  </div>
                  <div className="flex-grow thick-outline overflow-hidden rounded-lg aspect-video relative"
                    style={{ opacity: trip.status === "error" ? 0.4 : 1 }}>
                    {trip.previewUrl ? (
                      <img src={trip.previewUrl} alt={trip.label} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <span className="material-symbols-outlined text-slate-400 text-2xl">photo_camera</span>
                      </div>
                    )}

                    {/* Status overlay */}
                    {trip.status === "analyzing" && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(156,6,249,0.75)" }}>
                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {trip.status === "processed" && (
                      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,207,100,0.2)" }} />
                    )}

                    <div className="absolute bottom-1 left-2 text-[10px] font-bold text-white uppercase px-1 rounded flex items-center gap-1" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                      {trip.status === "processed" && <span className="material-symbols-outlined text-xs" style={{ color: "#00cf64", fontSize: "12px" }}>check_circle</span>}
                      {trip.status === "analyzing" && <span className="material-symbols-outlined text-xs animate-spin" style={{ color: "#9c06f9", fontSize: "12px" }}>sync</span>}
                      {trip.label.slice(0, 18)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Process to Zine */}
            <button
              onClick={hasProcessedTrips ? handleGenerateZine : () => fileInputRef.current?.click()}
              disabled={isGeneratingZine}
              className="w-full text-white p-4 thick-outline rounded-lg flex items-center justify-center gap-3 mechanical-shadow transition-all font-bold uppercase italic disabled:opacity-60"
              style={{
                backgroundColor: hasProcessedTrips ? "#9c06f9" : "#64748b",
                transform: isGeneratingZine ? "translateY(4px)" : undefined,
              }}
            >
              {isGeneratingZine ? (
                <>
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Zine...
                </>
              ) : hasProcessedTrips ? (
                <>
                  <span className="material-symbols-outlined">auto_stories</span>
                  Process to Zine
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">add_photo_alternate</span>
                  Upload a Photo First
                </>
              )}
            </button>
          </div>

          {/* Zine Preview Strip */}
          <div className="thick-outline p-6 rounded-xl flex-grow mechanical-shadow flex flex-col gap-4 overflow-hidden" style={{ backgroundColor: "#1b0f23" }}>
            <div className="flex justify-between items-center flex-shrink-0">
              <h3 className="text-white font-bold uppercase text-xs tracking-widest">Zine Preview Strip</h3>
              <div className="flex gap-1">
                {[1, 0.3, 0.1].map((op, i) => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: "#39ff14", opacity: op }} />
                ))}
              </div>
            </div>

            {/* Zine hook preview */}
            {zineHook && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(156,6,249,0.15)", border: "1px solid rgba(156,6,249,0.3)" }}>
                <p className="text-[11px] font-bold italic" style={{ color: "#d4af37", fontFamily: "Georgia, serif" }}>"{zineHook}"</p>
                <p className="text-[9px] mt-1 uppercase tracking-widest" style={{ color: "#9c06f9" }}>Zine Hook Preview</p>
              </div>
            )}

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
              {trips.filter((t) => t.status === "processed").map((trip, i) => (
                <div
                  key={trip.id}
                  className="min-w-[110px] aspect-[3/4] bg-white thick-outline flex-shrink-0 snap-start flex flex-col overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  style={{ transform: `rotate(${i % 2 === 0 ? 2 : -1}deg)` }}
                >
                  {trip.previewUrl && <img src={trip.previewUrl} alt="" className="flex-grow object-cover w-full vintage-sat" />}
                  <span className="text-[8px] font-bold p-1 uppercase">{trip.analysis?.city || trip.label}</span>
                </div>
              ))}
              {trips.filter((t) => t.status === "processed").length === 0 && (
                <p className="text-[10px] font-bold uppercase" style={{ color: "#4a3555" }}>Photos will appear here once processed</p>
              )}
            </div>

            {/* Progress */}
            <div className="mt-auto p-3 rounded thick-outline border-l-8" style={{ backgroundColor: "#2d1f3d", borderLeftColor: "#9c06f9" }}>
              <div className="flex justify-between text-[10px] font-bold uppercase mb-2" style={{ color: "#94a3b8" }}>
                <span>{trips.length === 0 ? "Waiting for photos" : `${trips.filter((t) => t.status === "processed").length}/${trips.length} processed`}</span>
                <span>{Math.round(progress)}%</span>
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
