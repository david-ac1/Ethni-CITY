import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const mockZineData = {
  location: "Balogun Market, Lagos, Nigeria",
  headline: "The Pulse of Balogun Market.",
  subheadline: "Gold light, red peppers, and progress.",
  artistName: "ILÊ AIYÊ",
  artistSubtitle: '"O Mais Belo dos Belos"',
  artistBio:
    "A high-vibration sonic journey through the heart of Salvador, blending Neo-Pop aesthetics with ancestral rhythms. Discovered through the cultural resonance of Lagos street-market energy and Yoruba trade textile patterns.",
  genre: "Afro-Brazilian Neo-Pop",
  spotifyUrl: "#",
  appleUrl: "#",
};

interface ZinePageProps {
  params: Promise<{ id: string }>;
}

export default async function ZinePage({ params }: ZinePageProps) {
  const { id } = await params;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden" style={{ backgroundColor: "#fdf6e3" }}>
      <Header variant="zine" />

      <main className="flex-1 px-6 md:px-20 py-10 max-w-[1440px] mx-auto w-full">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8" style={{ color: "#94a3b8" }}>
          <Link href="/dashboard" className="hover:underline" style={{ color: "#9c06f9" }}>Dashboard</Link>
          <span>→</span>
          <span style={{ color: "#9c06f9" }}>Zine #{id}</span>
        </div>

        {/* Magazine Hero Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Hero Photo */}
          <div className="lg:col-span-8 relative group overflow-hidden rounded-xl" style={{ backgroundColor: "#374151" }}>
            <div
              className="vintage-sat h-[600px] w-full transition-transform duration-700 group-hover:scale-105 relative"
              style={{ background: "linear-gradient(135deg, #b87333 0%, #e2725b 30%, #d4af37 60%, #9c06f9 100%)" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "120px" }}>storefront</span>
                  <p className="text-sm font-bold uppercase tracking-widest mt-2">Lagos Market — AI Enhanced</p>
                </div>
              </div>
            </div>

            {/* Halftone overlay */}
            <div className="absolute inset-0 halftone-overlay" style={{ mixBlendMode: "multiply", color: "#1e293b" }} />
            {/* Gradient for caption */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)" }} />

            {/* Caption */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
              <h1 className="text-4xl md:text-6xl text-white italic leading-tight max-w-2xl" style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
                &ldquo;{mockZineData.headline}{" "}
                <span style={{ color: "#d4af37" }}>{mockZineData.subheadline}&rdquo;</span>
              </h1>
              <div className="flex items-center gap-2 mt-4">
                <span className="material-symbols-outlined text-sm" style={{ color: "#d4af37" }}>location_on</span>
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.8)" }}>{mockZineData.location}</span>
              </div>
            </div>

            {/* Watermark */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded text-white text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
              Ethni-CITY Zine #{id}
            </div>
          </div>

          {/* Featured Record Panel */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white p-8 rounded-xl border shadow-xl flex-1 flex flex-col" style={{ borderColor: "rgba(156,6,249,0.08)" }}>

              {/* Badges */}
              <div className="flex justify-between items-start mb-6">
                <span className="text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-[0.2em]" style={{ backgroundColor: "#9c06f9" }}>
                  Featured Release
                </span>
                <div className="flex items-center gap-1 opacity-80">
                  <svg fill="none" height="24" viewBox="0 0 32 32" width="24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="14" stroke="#b87333" strokeWidth="2" />
                    <path d="M16 8V24M8 16H24" stroke="#b87333" strokeWidth="2" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase" style={{ color: "#b87333" }}>GCP</span>
                </div>
              </div>

              {/* Vinyl Record */}
              <div className="relative mb-6">
                <div className="aspect-square w-full rounded-lg shadow-2xl relative overflow-hidden border-4 border-black">
                  <div
                    className="absolute inset-0 transition-transform duration-500"
                    style={{ background: "conic-gradient(from 0deg, #9c06f9, #e2725b, #d4af37, #00cf64, #9c06f9)" }}
                  />
                  <div className="absolute inset-0" style={{ backgroundColor: "rgba(156,6,249,0.2)", mixBlendMode: "overlay" }} />
                  <div className="absolute inset-1/4 border-4 border-white/30 rounded-full" />
                  <div className="absolute inset-[38%] rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.5)" }} />
                  </div>
                  <div className="absolute top-4 right-4 p-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#9c06f9", backdropFilter: "blur(4px)" }}>
                    <span className="material-symbols-outlined text-xl">palette</span>
                  </div>
                </div>
              </div>

              {/* Artist Info */}
              <div className="mb-8 flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h2 className="text-2xl font-bold" style={{ color: "#1b0f23" }}>{mockZineData.artistName}</h2>
                  <span className="text-[10px] font-black px-2 py-1 rounded uppercase" style={{ backgroundColor: "rgba(212,175,55,0.2)", color: "#b87333" }}>
                    {mockZineData.genre}
                  </span>
                </div>
                <p className="font-medium italic mb-4" style={{ color: "#9c06f9" }}>{mockZineData.artistSubtitle}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{mockZineData.artistBio}</p>

                {/* AI Discovery badge */}
                <div className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: "rgba(156,6,249,0.05)", border: "1px solid rgba(156,6,249,0.1)" }}>
                  <span className="material-symbols-outlined text-sm" style={{ color: "#9c06f9" }}>auto_awesome</span>
                  <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#9c06f9" }}>Discovered by Gemini ADK</span>
                </div>
              </div>

              {/* Streaming Buttons */}
              <div className="flex flex-col gap-3 mt-auto">
                <a href={mockZineData.spotifyUrl} className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer" style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="#1DB954" viewBox="0 0 168 168">
                      <path d="M84 0C37.6 0 0 37.6 0 84s37.6 84 84 84 84-37.6 84-84S130.4 0 84 0zm38.6 121.2c-1.6 2.6-5 3.4-7.6 1.8-20.8-12.7-47-15.6-77.8-8.5-3 .7-6-1.2-6.7-4.2-.7-3 1.2-6 4.2-6.7 33.7-7.7 62.6-4.4 85.9 9.2 2.6 1.5 3.4 5 1.8 7.6zm10.3-23.8c-2 3.2-6.2 4.2-9.4 2.2-23.8-14.6-60-18.8-88.1-10.3-3.6 1.1-7.4-.9-8.5-4.5-1.1-3.6.9-7.4 4.5-8.5 32.1-9.7 71.9-5 99.4 11.7 3.2 2 4.2 6.2 2.2 9.4zm.9-24.8c-28.6-17-75.7-18.6-103-10.2-4.4 1.3-9-1.2-10.3-5.6-1.3-4.4 1.2-9 5.6-10.3C52.1 37 103.8 38.8 136.6 58c3.9 2.3 5.2 7.4 2.9 11.2-2.3 3.9-7.4 5.2-11.3 2.9l.6.5z" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider">Listen on Spotify</span>
                  </div>
                  <span className="material-symbols-outlined text-sm" style={{ color: "#3b82f6" }}>verified</span>
                </a>
                <a href={mockZineData.appleUrl} className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer" style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl" style={{ color: "#475569" }}>music_note</span>
                    <span className="text-xs font-bold uppercase tracking-wider">Apple Music</span>
                  </div>
                  <span className="material-symbols-outlined text-sm" style={{ color: "#3b82f6" }}>verified</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Zine Content Strips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "record_voice_over", label: "AI Narration", desc: "The agentic DJ has spoken. Hear the full cultural context voiced by Gemini Live.", bg: "#9c06f9", textColor: "white" },
            { icon: "travel_explore", label: "Cultural Markers", desc: "Yoruba textile patterns, kente-adjacent colour principles, Lagos vernacular architecture.", bg: "#fdf6e3", textColor: "#1b0f23", border: true },
            { icon: "share", label: "Share & Credit", desc: "Every share credits ILÊ AIYÊ directly. Ethical visibility for niche artists.", bg: "#00cf64", textColor: "#1b0f23" },
          ].map(({ icon, label, desc, bg, textColor, border }) => (
            <div key={label} className="p-6 rounded-xl neo-brutalism-shadow-sm" style={{ backgroundColor: bg, border: border ? "4px solid #1b0f23" : "4px solid #1b0f23" }}>
              <span className="material-symbols-outlined text-4xl mb-3 block" style={{ color: textColor }}>{icon}</span>
              <h4 className="font-black text-lg uppercase mb-2" style={{ color: textColor }}>{label}</h4>
              <p className="font-bold text-sm" style={{ color: textColor, opacity: 0.8 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 py-10" style={{ borderTop: "1px solid rgba(156,6,249,0.15)" }}>
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h3 className="text-xl font-bold uppercase tracking-widest" style={{ color: "#9c06f9" }}>Support the Vision</h3>
            <p className="max-w-md" style={{ color: "#64748b" }}>
              Join 40,000+ sonic explorers in building the world&apos;s first decentralized ethno-music archive.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/dashboard">
              <button className="border-4 border-black px-8 py-4 rounded-xl font-black uppercase neo-brutalism-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all" style={{ backgroundColor: "white" }}>
                ← New Zine
              </button>
            </Link>
            <button className="hammered-texture px-12 py-4 rounded-xl text-white font-bold text-lg uppercase tracking-[0.2em] hover:scale-[1.02] transition-all flex items-center gap-4">
              <span className="material-symbols-outlined">share</span>
              Share &amp; Support Local Artists
            </button>
          </div>
        </div>
      </main>

      <Footer variant="zine" />
    </div>
  );
}
