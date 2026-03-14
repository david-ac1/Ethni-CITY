"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useEthniStore, ZineData } from "@/lib/store";
import SocialMockups from "@/components/ui/SocialMockups";

interface ZinePageProps {
  params: Promise<{ id: string }>;
}

// Fallback mock data while real data loads or if no zine in store
const FALLBACK_ZINE: Partial<ZineData> = {
  headline: "The Pulse of Balogun Market.",
  subheadline: "Gold light, red peppers, and progress.",
  pull_quote: "Here, every corner hums a different frequency.",
  photo_caption: "Open-air stalls bathed in equatorial gold, where Yoruba textile merchants compose an accidental symphony.",
  artist_bio_paragraph: "ILÊ AIYÊ emerged from the Libertad neighbourhood of Salvador to forge a new sonic covenant between the diaspora and its roots. Their music is a living archive — part ancestral memory, part urban prophecy.",
  location_lore: "Balogun Market in Lagos Island has been the beating commercial heart of Lagos since the colonial era, its alleyways soundtracked by Jùjú radio and the percussion of commerce.",
  share_caption: "The streets of Lagos spoke and we listened. 🎵 @IleAiye discovered via #EthniCITY #SonicStoryzine #GlobalSouth",
};

export default function ZinePage({ params }: ZinePageProps) {
  const [zineId, setZineId] = useState<string>("");
  const { currentZine, discoveredArtists } = useEthniStore();

  useEffect(() => {
    params.then((p) => setZineId(p.id));
  }, [params]);

  // Use real generated data if available, otherwise fall back to mock
  const zine = currentZine || null;
  const displayData = {
    headline: zine?.headline || FALLBACK_ZINE.headline || "",
    subheadline: zine?.subheadline || FALLBACK_ZINE.subheadline || "",
    pull_quote: zine?.pull_quote || FALLBACK_ZINE.pull_quote || "",
    photo_caption: zine?.photo_caption || FALLBACK_ZINE.photo_caption || "",
    artist_bio_paragraph: zine?.artist_bio_paragraph || FALLBACK_ZINE.artist_bio_paragraph || "",
    location_lore: zine?.location_lore || FALLBACK_ZINE.location_lore || "",
    share_caption: zine?.share_caption || FALLBACK_ZINE.share_caption || "",
    photo_url: zine?.meta?.photo_url || "",
    location: zine?.meta?.location || { city: "Lagos", country: "Nigeria", neighbourhood: "Balogun Market" },
    artist: zine?.meta?.featured_artist || discoveredArtists[0] || { name: "ILÊ AIYÊ", genre: "Afro-Brazilian Neo-Pop", spotify_search: "Ilê Aiyê", youtube_search: "Ilê Aiyê music" },
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden" style={{ backgroundColor: "#fdf6e3" }}>
      <Header variant="zine" />

      <main className="flex-1 px-6 md:px-20 py-10 max-w-[1440px] mx-auto w-full">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8" style={{ color: "#94a3b8" }}>
          <Link href="/dashboard" className="hover:underline" style={{ color: "#9c06f9" }}>Dashboard</Link>
          <span>→</span>
          <span style={{ color: "#9c06f9" }}>Zine #{zineId}</span>
          {zine && <span className="ml-2 px-2 py-0.5 rounded text-white text-[9px] font-black uppercase" style={{ backgroundColor: "#9c06f9" }}>AI Generated</span>}
        </div>

        {/* Hero Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Hero Photo */}
          <div className="lg:col-span-8 relative group overflow-hidden rounded-xl bg-slate-800">
            <div className="h-[600px] w-full relative">
              {displayData.photo_url ? (
                <img src={displayData.photo_url} alt="" className="w-full h-full object-cover vintage-sat transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div
                  className="w-full h-full vintage-sat transition-transform duration-700 group-hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #b87333 0%, #e2725b 30%, #d4af37 60%, #9c06f9 100%)" }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "120px" }}>storefront</span>
                      <p className="text-sm font-bold uppercase tracking-widest mt-2">{displayData.location.neighbourhood} — AI Enhanced</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute inset-0 halftone-overlay pointer-events-none mix-blend-multiply" style={{ color: "#1e293b" }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }} />

            {/* Pull quote in hero */}
            {displayData.pull_quote && (
              <div className="absolute top-8 right-8 max-w-xs p-4 rounded-xl neo-brutalism-shadow-sm z-10" style={{ backgroundColor: "rgba(212,175,55,0.9)" }}>
                <p className="font-bold text-sm italic text-black">"{displayData.pull_quote}"</p>
              </div>
            )}

            {/* Caption */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full z-10">
              <h1 className="text-4xl md:text-6xl text-white italic leading-tight max-w-2xl" style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}>
                &ldquo;{displayData.headline}{" "}
                <span style={{ color: "#d4af37" }}>{displayData.subheadline}&rdquo;</span>
              </h1>
              {displayData.photo_caption && (
                <p className="text-white/90 text-sm mt-3 max-w-lg font-medium drop-shadow-md">{displayData.photo_caption}</p>
              )}
              <div className="flex items-center gap-2 mt-4 drop-shadow-md">
                <span className="material-symbols-outlined text-sm" style={{ color: "#d4af37" }}>location_on</span>
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.9)" }}>
                  {displayData.location.neighbourhood}, {displayData.location.city}, {displayData.location.country}
                </span>
              </div>
            </div>

            <div className="absolute top-4 left-4 px-3 py-1 rounded text-white text-[10px] font-bold uppercase tracking-widest z-10" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
              Ethni-CITY Zine #{zineId}
            </div>
          </div>

          {/* Featured Artist Panel */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white p-8 rounded-xl border shadow-xl flex-1 flex flex-col" style={{ borderColor: "rgba(156,6,249,0.08)" }}>

              <div className="flex justify-between items-start mb-6">
                <span className="text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-[0.2em]" style={{ backgroundColor: "#9c06f9" }}>Featured Release</span>
                <div className="flex items-center gap-1 opacity-80">
                  <svg fill="none" height="24" viewBox="0 0 32 32" width="24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="14" stroke="#b87333" strokeWidth="2" />
                    <path d="M16 8V24M8 16H24" stroke="#b87333" strokeWidth="2" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase" style={{ color: "#b87333" }}>GCP Powered</span>
                </div>
              </div>

              {/* Vinyl */}
              <div className="aspect-square w-full rounded-lg shadow-2xl relative overflow-hidden border-4 border-black mb-6 group/vinyl">
                <div className="absolute inset-0" style={{ background: "conic-gradient(from 0deg, #9c06f9, #e2725b, #d4af37, #00cf64, #9c06f9)" }} />
                <div className="absolute inset-0" style={{ backgroundColor: "rgba(156,6,249,0.2)", mixBlendMode: "overlay" }} />
                <div className="absolute inset-1/4 border-4 border-white/30 rounded-full" />
                <div className="absolute inset-[38%] rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
                  <div className="w-2 h-2 rounded-full bg-white/50" />
                </div>
                <div className="absolute top-4 right-4 p-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)", color: "#9c06f9" }}>
                  <span className="material-symbols-outlined text-xl">music_note</span>
                </div>
              </div>

              {/* Artist info */}
              <div className="mb-6 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-2xl font-bold" style={{ color: "#1b0f23" }}>{displayData.artist.name}</h2>
                  <span className="text-[10px] font-black px-2 py-1 rounded uppercase" style={{ backgroundColor: "rgba(212,175,55,0.2)", color: "#b87333" }}>{displayData.artist.genre}</span>
                </div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#64748b" }}>{displayData.artist_bio_paragraph}</p>

                {displayData.location_lore && (
                  <div className="p-3 rounded-lg text-sm italic" style={{ backgroundColor: "rgba(156,6,249,0.05)", borderLeft: "3px solid #9c06f9", color: "#3d2c58" }}>
                    {displayData.location_lore}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: "rgba(156,6,249,0.05)", border: "1px solid rgba(156,6,249,0.1)" }}>
                  <span className="material-symbols-outlined text-sm" style={{ color: "#9c06f9" }}>auto_awesome</span>
                  <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#9c06f9" }}>Discovered by Gemini ADK</span>
                </div>
              </div>

              {/* Streaming Buttons */}
              <div className="flex flex-col gap-3 mt-auto">
                <a
                  href={`https://open.spotify.com/search/${encodeURIComponent(displayData.artist.spotify_search || displayData.artist.name)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer"
                  style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="#1DB954" viewBox="0 0 168 168">
                      <path d="M84 0C37.6 0 0 37.6 0 84s37.6 84 84 84 84-37.6 84-84S130.4 0 84 0zm38.6 121.2c-1.6 2.6-5 3.4-7.6 1.8-20.8-12.7-47-15.6-77.8-8.5-3 .7-6-1.2-6.7-4.2-.7-3 1.2-6 4.2-6.7 33.7-7.7 62.6-4.4 85.9 9.2 2.6 1.5 3.4 5 1.8 7.6zm10.3-23.8c-2 3.2-6.2 4.2-9.4 2.2-23.8-14.6-60-18.8-88.1-10.3-3.6 1.1-7.4-.9-8.5-4.5-1.1-3.6.9-7.4 4.5-8.5 32.1-9.7 71.9-5 99.4 11.7 3.2 2 4.2 6.2 2.2 9.4zm.9-24.8c-28.6-17-75.7-18.6-103-10.2-4.4 1.3-9-1.2-10.3-5.6-1.3-4.4 1.2-9 5.6-10.3C52.1 37 103.8 38.8 136.6 58c3.9 2.3 5.2 7.4 2.9 11.2-2.3 3.9-7.4 5.2-11.3 2.9l.6.5z" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider">Search on Spotify</span>
                  </div>
                  <span className="material-symbols-outlined text-sm" style={{ color: "#3b82f6" }}>open_in_new</span>
                </a>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(displayData.artist.youtube_search || displayData.artist.name)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer"
                  style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="#FF0000" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider">Watch on YouTube</span>
                  </div>
                  <span className="material-symbols-outlined text-sm" style={{ color: "#3b82f6" }}>open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content Strips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "record_voice_over", label: "AI Narration", desc: "The agentic DJ has spoken. Hear the full cultural context voiced by Gemini Live.", bg: "#9c06f9", textColor: "white" },
            { icon: "travel_explore", label: "Cultural Markers", desc: displayData.location_lore || "Yoruba textile patterns, kente-adjacent colour principles, Lagos vernacular architecture.", bg: "#fdf6e3", textColor: "#1b0f23", border: true },
            { icon: "share", label: "Share & Credit", desc: displayData.share_caption || "Every share credits this artist directly. Ethical visibility for niche artists.", bg: "#00cf64", textColor: "#1b0f23" },
          ].map(({ icon, label, desc, bg, textColor, border }) => (
            <div key={label} className="p-6 rounded-xl neo-brutalism-shadow-sm" style={{ backgroundColor: bg, border: border ? "4px solid #1b0f23" : "4px solid #1b0f23" }}>
              <span className="material-symbols-outlined text-4xl mb-3 block" style={{ color: textColor }}>{icon}</span>
              <h4 className="font-black text-lg uppercase mb-2" style={{ color: textColor }}>{label}</h4>
              <p className="font-bold text-sm" style={{ color: textColor, opacity: 0.85 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Social Mockups Section */}
        {zine && zine.meta && (
          <div className="mt-20 flex flex-col items-center">
            <div className="text-center mb-10 max-w-2xl">
              <span className="material-symbols-outlined text-4xl mb-4" style={{ color: "#9c06f9" }}>campaign</span>
              <h2 className="text-3xl font-black uppercase italic tracking-widest mb-4" style={{ color: "#1b0f23" }}>Preview Your Share</h2>
              <p className="font-bold text-slate-500">
                This is how your Sonic Story-Zine will look when you amplify {displayData.artist.name} to the world. The algorithm loves a good track.
              </p>
            </div>
            
            {/* The mockups component takes the full zine object to build the UI */}
            <SocialMockups 
              zine={zine} 
              heroImageUrl="https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?q=80&w=1000&auto=format&fit=crop" 
            />
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 py-10" style={{ borderTop: "1px solid rgba(156,6,249,0.15)" }}>
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h3 className="text-xl font-bold uppercase tracking-widest" style={{ color: "#9c06f9" }}>Support the Vision</h3>
            <p className="max-w-md" style={{ color: "#64748b" }}>
              Join 40,000+ sonic explorers building the world&apos;s first decentralized ethno-music archive.
            </p>
          </div>
          <div className="flex gap-4 items-center flex-wrap justify-center">
            <Link href="/dashboard">
              <button className="border-4 border-black px-8 py-4 rounded-xl font-black uppercase neo-brutalism-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all" style={{ backgroundColor: "white" }}>
                ← New Zine
              </button>
            </Link>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: "Ethni-CITY Sonic Story-Zine", text: displayData.share_caption, url: window.location.href });
                }
              }}
              className="hammered-texture px-12 py-4 rounded-xl text-white font-bold text-lg uppercase tracking-widest flex items-center gap-4 hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined">share</span>
              Share &amp; Credit Artist
            </button>
          </div>
        </div>
      </main>

      <Footer variant="zine" />
    </div>
  );
}
