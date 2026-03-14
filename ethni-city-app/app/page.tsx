import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NeoButton from "@/components/ui/NeoButton";
import SpeechBubble from "@/components/ui/SpeechBubble";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Import Google Material Symbols */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

      <Header variant="hook" />

      {/* ── Main Hero ─────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-malachite border-4 border-black rounded-full neo-brutalism-shadow opacity-20 -z-10 animate-pulse" />
        <div className="absolute bottom-40 right-10 w-48 h-48 bg-terracotta border-4 border-black rotate-12 neo-brutalism-shadow opacity-20 -z-10" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent-gold border-4 border-black rounded-full opacity-10 -z-10 animate-bounce" style={{ animationDuration: "3s" }} />

        <div className="max-w-4xl w-full flex flex-col items-center gap-12 text-center">

          {/* ── Sound Spirit Mascot ── */}
          <div className="relative group mt-8">
            {/* Speech Bubble */}
            <div className="absolute -top-16 -right-16 md:-right-32 w-64 md:w-80 z-10">
              <SpeechBubble tailDirection="bottom-left" className="rotate-[-5deg]">
                <p className="text-xl font-bold leading-tight text-left">
                  &ldquo;Ready to find the real frequency? Drop your photos to tune in.&rdquo;
                </p>
              </SpeechBubble>
            </div>

            {/* Mascot Box */}
            <div className="w-64 h-64 md:w-80 md:h-80 bg-electric-violet border-[6px] border-black rounded-3xl neo-brutalism-shadow flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <div className="flex flex-col items-center text-white">
                <span className="material-symbols-outlined" style={{ fontSize: "96px" }}>art_track</span>
                <div className="flex gap-2 mt-2">
                  <span className="material-symbols-outlined text-4xl animate-bounce" style={{ animationDelay: "0ms" }}>surround_sound</span>
                  <span className="material-symbols-outlined text-4xl animate-bounce" style={{ animationDelay: "100ms" }}>music_note</span>
                  <span className="material-symbols-outlined text-4xl animate-bounce" style={{ animationDelay: "200ms" }}>equalizer</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Headline ── */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-malachite border-4 border-black px-6 py-2 rounded-full neo-brutalism-shadow-sm rotate-[-1deg]">
              <p className="font-black uppercase tracking-widest text-sm">Creative Storyteller × Gemini Live</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter uppercase">
              Your Photos.{" "}
              <span className="text-primary italic">Their Music.</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold text-slate-600 max-w-2xl">
              Upload a travel photo. Ethni-CITY&apos;s AI finds the{" "}
              <span className="text-terracotta font-black">hyper-local niche artists</span>{" "}
              that soundtrack that exact corner of the globe—then generates a Sonic Story-Zine that credits them.
            </p>
          </div>

          {/* ── CTA ── */}
          <div className="flex flex-col items-center gap-4 mt-4">
            <Link href="/dashboard">
              <button className="group relative flex items-center gap-4 bg-red-600 text-white border-[6px] border-black px-12 py-6 rounded-2xl neo-brutalism-shadow hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">
                <div className="w-6 h-6 bg-white rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                <span className="text-2xl md:text-4xl font-black tracking-widest uppercase">
                  Begin Your Sonic Journey
                </span>
              </button>
            </Link>
            <p className="text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined">upload_file</span>
              Drag &amp; drop assets here
            </p>
          </div>
        </div>

        {/* ── Features Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mt-32 px-4">
          {/* Card 1: Malachite Rhythms */}
          <div className="bg-malachite border-4 border-black p-8 rounded-xl neo-brutalism-shadow hover:-translate-y-2 transition-transform cursor-default">
            <span className="material-symbols-outlined text-5xl mb-4 text-white block">ecg_heart</span>
            <h3 className="text-2xl font-black mb-2 uppercase">Malachite Rhythms</h3>
            <p className="font-bold text-slate-900/80">Deep green grooves harvested from urban forests and concrete echoes.</p>
          </div>

          {/* Card 2: Terracotta Beats */}
          <div className="bg-terracotta border-4 border-black p-8 rounded-xl neo-brutalism-shadow hover:-translate-y-2 transition-transform rotate-2 cursor-default">
            <span className="material-symbols-outlined text-5xl mb-4 text-white block">podcasts</span>
            <h3 className="text-2xl font-black mb-2 uppercase text-white">Terracotta Beats</h3>
            <p className="font-bold text-white">Earth tones meeting digital waves in a collision of ancient and futuristic.</p>
          </div>

          {/* Card 3: Electric Freqs */}
          <div className="bg-electric-violet border-4 border-black p-8 rounded-xl neo-brutalism-shadow hover:-translate-y-2 transition-transform -rotate-1 cursor-default">
            <span className="material-symbols-outlined text-5xl mb-4 text-white block">bolt</span>
            <h3 className="text-2xl font-black mb-2 uppercase text-white">Electric Freqs</h3>
            <p className="font-bold text-white">High-voltage soundscapes powered by the collective pulse of the city.</p>
          </div>
        </div>

        {/* ── How It Works ── */}
        <div className="mt-32 max-w-6xl w-full px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              How The <span className="text-primary italic">Sonic Zoom</span> Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", icon: "photo_camera", label: "Upload Photos", desc: "Drop your travel photos from anywhere in the Global South.", color: "bg-background-light" },
              { step: "02", icon: "travel_explore", label: "AI Analyses Culture", desc: "Gemini Vision reads the neighbourhood, architecture & cultural markers.", color: "bg-malachite" },
              { step: "03", icon: "map", label: "Sonic Zoom", desc: "3D map cinematically flies to the exact location to tune in.", color: "bg-terracotta" },
              { step: "04", icon: "auto_stories", label: "Zine Generated", desc: "An interleaved Sonic Story-Zine credits local artists and music.", color: "bg-primary text-white" },
            ].map(({ step, icon, label, desc, color }) => (
              <div key={step} className={`${color} border-4 border-black p-6 rounded-xl neo-brutalism-shadow-sm relative`}>
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-black text-white border-4 border-black rounded-full flex items-center justify-center font-black text-sm">
                  {step}
                </div>
                <span className="material-symbols-outlined text-4xl mb-4 mt-4 block">{icon}</span>
                <h4 className="font-black text-lg uppercase mb-2">{label}</h4>
                <p className="font-bold text-sm opacity-80">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer variant="hook" />
    </div>
  );
}
