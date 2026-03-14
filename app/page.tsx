import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SpeechBubble from "@/components/ui/SpeechBubble";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#fdf6e3" }}>

      <Header variant="hook" />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">

        {/* Decorative background blobs — forced vivid colors */}
        <div
          className="absolute top-20 left-10 w-40 h-40 border-4 border-black rounded-full neo-brutalism-shadow opacity-60 -z-10 animate-pulse"
          style={{ backgroundColor: "#00cf64" }}
        />
        <div
          className="absolute bottom-40 right-10 w-56 h-56 border-4 border-black rotate-12 neo-brutalism-shadow opacity-50 -z-10"
          style={{ backgroundColor: "#e2725b" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-28 h-28 border-4 border-black rounded-full opacity-40 -z-10"
          style={{ backgroundColor: "#d4af37", animation: "bounce 3s ease-in-out infinite" }}
        />

        <div className="max-w-4xl w-full flex flex-col items-center gap-12 text-center">

          {/* ── Mascot Box + Speech Bubble ── */}
          <div className="relative group mt-16">
            {/* Speech Bubble */}
            <div className="absolute -top-20 -right-8 md:-right-36 w-64 md:w-80 z-20">
              <SpeechBubble tailDirection="bottom-left" className="rotate-[-5deg]">
                <p className="text-lg font-bold leading-tight text-left text-black">
                  &ldquo;Ready to find the real frequency? Drop your photos to tune in.&rdquo;
                </p>
              </SpeechBubble>
            </div>

            {/* Mascot — forced electric-violet */}
            <div
              className="w-64 h-64 md:w-80 md:h-80 border-[6px] border-black rounded-3xl neo-brutalism-shadow flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500"
              style={{ backgroundColor: "#8f00ff" }}
            >
              <div className="flex flex-col items-center text-white">
                <span className="material-symbols-outlined text-white" style={{ fontSize: "100px" }}>art_track</span>
                <div className="flex gap-3 mt-3">
                  <span className="material-symbols-outlined text-white text-4xl animate-bounce" style={{ animationDelay: "0ms" }}>surround_sound</span>
                  <span className="material-symbols-outlined text-white text-4xl animate-bounce" style={{ animationDelay: "150ms" }}>music_note</span>
                  <span className="material-symbols-outlined text-white text-4xl animate-bounce" style={{ animationDelay: "300ms" }}>equalizer</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Badge ── */}
          <div
            className="border-4 border-black px-6 py-2 rounded-full neo-brutalism-shadow-sm rotate-[-1deg]"
            style={{ backgroundColor: "#00cf64" }}
          >
            <p className="font-black uppercase tracking-widest text-sm text-black">
              Creative Storyteller × Gemini Live
            </p>
          </div>

          {/* ── Headline ── */}
          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter uppercase" style={{ color: "#1b0f23" }}>
            Your Photos.{" "}
            <span className="italic" style={{ color: "#9c06f9" }}>Their Music.</span>
          </h1>

          <p className="text-xl md:text-2xl font-bold max-w-2xl" style={{ color: "#3d2c58" }}>
            Upload a travel photo. Ethni-CITY&apos;s AI finds the{" "}
            <span className="font-black" style={{ color: "#e2725b" }}>hyper-local niche artists</span>{" "}
            that soundtrack that exact corner of the globe—then generates a Sonic Story-Zine that credits them.
          </p>

          {/* ── CTA Button ── */}
          <div className="flex flex-col items-center gap-4 mt-4">
            <Link href="/dashboard">
              <button
                className="group relative flex items-center gap-4 text-white border-[6px] border-black px-12 py-6 rounded-2xl neo-brutalism-shadow hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all"
                style={{ backgroundColor: "#dc2626" }}
              >
                <div className="w-6 h-6 bg-white rounded-full animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.9)]" />
                <span className="text-2xl md:text-4xl font-black tracking-widest uppercase">Begin Your Sonic Journey</span>
              </button>
            </Link>
            <p className="font-bold uppercase tracking-widest flex items-center gap-2 text-sm" style={{ color: "#6b5b45" }}>
              <span className="material-symbols-outlined">upload_file</span>
              Drag &amp; drop assets here
            </p>
          </div>
        </div>

        {/* ── Features Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mt-24 px-4">
          {/* Malachite Rhythms */}
          <div
            className="border-4 border-black p-8 rounded-xl neo-brutalism-shadow hover:-translate-y-2 transition-transform cursor-default"
            style={{ backgroundColor: "#00cf64" }}
          >
            <span className="material-symbols-outlined text-5xl mb-4 text-white block">ecg_heart</span>
            <h3 className="text-2xl font-black mb-2 uppercase text-black">Malachite Rhythms</h3>
            <p className="font-bold text-black/80">Deep green grooves harvested from urban forests and concrete echoes.</p>
          </div>

          {/* Terracotta Beats */}
          <div
            className="border-4 border-black p-8 rounded-xl neo-brutalism-shadow hover:-translate-y-2 transition-transform rotate-2 cursor-default"
            style={{ backgroundColor: "#e2725b" }}
          >
            <span className="material-symbols-outlined text-5xl mb-4 text-white block">podcasts</span>
            <h3 className="text-2xl font-black mb-2 uppercase text-white">Terracotta Beats</h3>
            <p className="font-bold text-white">Earth tones meeting digital waves in a collision of ancient and futuristic.</p>
          </div>

          {/* Electric Freqs */}
          <div
            className="border-4 border-black p-8 rounded-xl neo-brutalism-shadow hover:-translate-y-2 transition-transform -rotate-1 cursor-default"
            style={{ backgroundColor: "#8f00ff" }}
          >
            <span className="material-symbols-outlined text-5xl mb-4 text-white block">bolt</span>
            <h3 className="text-2xl font-black mb-2 uppercase text-white">Electric Freqs</h3>
            <p className="font-bold text-white">High-voltage soundscapes powered by the collective pulse of the city.</p>
          </div>
        </div>

        {/* ── How It Works ── */}
        <div className="mt-32 max-w-6xl w-full px-4">
          <div className="text-center mb-16">
            <div
              className="inline-block border-4 border-black px-4 py-1 rounded-full mb-4 font-black text-xs uppercase tracking-widest"
              style={{ backgroundColor: "#d4af37", color: "#1b0f23" }}
            >
              The Process
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter" style={{ color: "#1b0f23" }}>
              How The <span className="italic" style={{ color: "#9c06f9" }}>Sonic Zoom</span> Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", icon: "photo_camera", label: "Upload Photos", desc: "Drop your travel photos from anywhere in the Global South.", bg: "#fdf6e3", border: true },
              { step: "02", icon: "travel_explore", label: "AI Analyses Culture", desc: "Gemini Vision reads the neighbourhood, architecture & cultural markers.", bg: "#00cf64", border: false },
              { step: "03", icon: "map", label: "Sonic Zoom", desc: "3D map cinematically flies to the exact location to tune in.", bg: "#e2725b", border: false },
              { step: "04", icon: "auto_stories", label: "Zine Generated", desc: "An interleaved Story-Zine credits local artists and their music.", bg: "#9c06f9", border: false },
            ].map(({ step, icon, label, desc, bg, border }) => (
              <div
                key={step}
                className="border-4 border-black p-6 rounded-xl neo-brutalism-shadow-sm relative"
                style={{ backgroundColor: bg }}
              >
                <div
                  className="absolute -top-4 -left-4 w-12 h-12 border-4 border-black rounded-full flex items-center justify-center font-black text-sm text-white"
                  style={{ backgroundColor: "#1b0f23" }}
                >
                  {step}
                </div>
                <span
                  className="material-symbols-outlined text-4xl mb-4 mt-4 block"
                  style={{ color: border ? "#1b0f23" : "white" }}
                >
                  {icon}
                </span>
                <h4 className="font-black text-lg uppercase mb-2" style={{ color: border ? "#1b0f23" : "white" }}>
                  {label}
                </h4>
                <p className="font-bold text-sm" style={{ color: border ? "#3d2c58" : "rgba(255,255,255,0.85)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Social Proof Strip ── */}
        <div className="mt-24 w-full max-w-6xl px-4">
          <div
            className="border-4 border-black p-6 rounded-xl neo-brutalism-shadow flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ backgroundColor: "#1b0f23" }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 border-4 border-black rounded-full flex items-center justify-center font-black text-xl text-black"
                style={{ backgroundColor: "#d4af37" }}
              >
                ★
              </div>
              <div>
                <p className="text-white font-black text-2xl">40,000+</p>
                <p className="font-bold uppercase tracking-widest text-xs" style={{ color: "#00cf64" }}>Sonic Explorers Worldwide</p>
              </div>
            </div>
            <div
              className="h-12 w-1 hidden md:block rounded-full"
              style={{ backgroundColor: "#9c06f9" }}
            />
            <div className="text-center">
              <p className="text-white font-black text-2xl">200+</p>
              <p className="font-bold uppercase tracking-widest text-xs" style={{ color: "#e2725b" }}>Artists Discovered & Credited</p>
            </div>
            <div
              className="h-12 w-1 hidden md:block rounded-full"
              style={{ backgroundColor: "#9c06f9" }}
            />
            <div className="text-center">
              <p className="text-white font-black text-2xl">50+</p>
              <p className="font-bold uppercase tracking-widest text-xs" style={{ color: "#d4af37" }}>Cities in the Global South</p>
            </div>
            <Link href="/dashboard">
              <button
                className="border-4 border-black px-8 py-3 rounded-full font-black uppercase tracking-wider text-black hover:translate-x-1 hover:translate-y-1 transition-all neo-brutalism-shadow-sm hover:shadow-none"
                style={{ backgroundColor: "#00cf64" }}
              >
                Start Exploring →
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer variant="hook" />
    </div>
  );
}
