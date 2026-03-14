import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

// In a real implementation, this data would be fetched from the API
// using the `id` param from the Gemini Zine generation endpoint.
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
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
            {/* Google Material Symbols */}
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

            <Header variant="zine" />

            <main className="flex-1 px-6 md:px-20 py-10 max-w-[1440px] mx-auto w-full">

                {/* ── Breadcrumb ── */}
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
                    <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                    <span>→</span>
                    <span className="text-primary">Zine #{id}</span>
                </div>

                {/* ── Magazine Hero Spread ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                    {/* Large Enhanced Photo */}
                    <div className="lg:col-span-8 relative group overflow-hidden rounded-xl bg-slate-700">
                        {/* Photo with vintage-sat filter */}
                        <div
                            className="vintage-sat h-[600px] w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105 relative"
                            style={{ backgroundImage: "linear-gradient(135deg, #b87333 0%, #e2725b 30%, #d4af37 60%, #9c06f9 100%)" }}
                        >
                            {/* Simulated rich market scene */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-white/20">
                                    <span className="material-symbols-outlined" style={{ fontSize: "120px" }}>storefront</span>
                                    <p className="text-sm font-bold uppercase tracking-widest mt-2">Lagos Market — AI Enhanced</p>
                                </div>
                            </div>
                        </div>

                        {/* Halftone Texture Overlay */}
                        <div className="absolute inset-0 halftone-overlay mix-blend-multiply text-slate-900" />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {/* Caption */}
                        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                            <h1 className="font-serif-display text-4xl md:text-6xl text-white italic leading-tight max-w-2xl drop-shadow-lg">
                                &ldquo;{mockZineData.headline}{" "}
                                <span className="text-accent-gold">{mockZineData.subheadline}&rdquo;</span>
                            </h1>

                            {/* Location tag */}
                            <div className="flex items-center gap-2 mt-4">
                                <span className="material-symbols-outlined text-accent-gold text-sm">location_on</span>
                                <span className="text-white/80 text-sm font-bold uppercase tracking-widest">{mockZineData.location}</span>
                            </div>
                        </div>

                        {/* Zine ID watermark */}
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-white text-[10px] font-bold uppercase tracking-widest">
                            Ethni-CITY Zine #{id}
                        </div>
                    </div>

                    {/* ── Side Content: Featured Record ── */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <div className="bg-white p-8 rounded-xl border border-primary/5 shadow-xl flex-1 flex flex-col">

                            {/* Header badges */}
                            <div className="flex justify-between items-start mb-6">
                                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-[0.2em]">
                                    Featured Release
                                </span>
                                {/* GCP Badge */}
                                <div className="flex items-center gap-1 opacity-80">
                                    <svg fill="none" height="24" viewBox="0 0 32 32" width="24" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="16" cy="16" r="14" stroke="#b87333" strokeWidth="2" />
                                        <path d="M16 8V24M8 16H24" stroke="#b87333" strokeWidth="2" />
                                    </svg>
                                    <span className="text-[10px] font-bold text-accent-copper uppercase">GCP</span>
                                </div>
                            </div>

                            {/* Vinyl Record Sleeve */}
                            <div className="relative mb-6">
                                <div className="aspect-square w-full rounded-lg shadow-2xl relative overflow-hidden group/vinyl border-4 border-black">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/vinyl:rotate-3"
                                        style={{ background: "conic-gradient(from 0deg, #9c06f9, #e2725b, #d4af37, #00cf64, #9c06f9)" }}
                                    />
                                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                                    {/* Centre groove */}
                                    <div className="absolute inset-1/4 border-4 border-white/30 rounded-full" />
                                    <div className="absolute inset-[38%] bg-black/80 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white/50 rounded-full" />
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full text-primary">
                                        <span className="material-symbols-outlined text-xl">palette</span>
                                    </div>
                                </div>
                            </div>

                            {/* Artist Info */}
                            <div className="mb-8 flex-1">
                                <div className="flex items-start justify-between mb-1">
                                    <h2 className="text-2xl font-bold text-slate-900">{mockZineData.artistName}</h2>
                                    <span className="bg-accent-gold/20 text-accent-copper text-[10px] font-black px-2 py-1 rounded uppercase">
                                        {mockZineData.genre}
                                    </span>
                                </div>
                                <p className="text-primary font-medium italic mb-4">{mockZineData.artistSubtitle}</p>
                                <p className="text-slate-500 text-sm leading-relaxed">{mockZineData.artistBio}</p>

                                {/* AI Discovery badge */}
                                <div className="mt-4 flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
                                    <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                                    <span className="text-[11px] font-bold text-primary uppercase tracking-wide">Discovered by Gemini ADK</span>
                                </div>
                            </div>

                            {/* Streaming Buttons */}
                            <div className="flex flex-col gap-3 mt-auto">
                                <a
                                    href={mockZineData.spotifyUrl}
                                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-slate-100 border border-slate-200 hover:border-primary/40 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="text-[#1DB954] w-5 h-5" fill="currentColor" viewBox="0 0 168 168">
                                            <path d="M84 0C37.6 0 0 37.6 0 84s37.6 84 84 84 84-37.6 84-84S130.4 0 84 0zm38.6 121.2c-1.6 2.6-5 3.4-7.6 1.8-20.8-12.7-47-15.6-77.8-8.5-3 .7-6-1.2-6.7-4.2-.7-3 1.2-6 4.2-6.7 33.7-7.7 62.6-4.4 85.9 9.2 2.6 1.5 3.4 5 1.8 7.6zm10.3-23.8c-2 3.2-6.2 4.2-9.4 2.2-23.8-14.6-60-18.8-88.1-10.3-3.6 1.1-7.4-.9-8.5-4.5-1.1-3.6.9-7.4 4.5-8.5 32.1-9.7 71.9-5 99.4 11.7 3.2 2 4.2 6.2 2.2 9.4zm.9-24.8c-28.6-17-75.7-18.6-103-10.2-4.4 1.3-9-1.2-10.3-5.6-1.3-4.4 1.2-9 5.6-10.3C52.1 37 103.8 38.8 136.6 58c3.9 2.3 5.2 7.4 2.9 11.2-2.3 3.9-7.4 5.2-11.3 2.9l.6.5z" />
                                        </svg>
                                        <span className="text-xs font-bold uppercase tracking-wider">Listen on Spotify</span>
                                    </div>
                                    <span className="material-symbols-outlined text-blue-500 text-sm fill-1">verified</span>
                                </a>
                                <a
                                    href={mockZineData.appleUrl}
                                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-slate-100 border border-slate-200 hover:border-primary/40 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-slate-700 w-5 h-5 text-xl">music_note</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">Apple Music</span>
                                    </div>
                                    <span className="material-symbols-outlined text-blue-500 text-sm fill-1">verified</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Zine Content Strips ── */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: "record_voice_over", label: "AI Narration", desc: "The agentic DJ has spoken. Hear the full cultural context voiced by Gemini Live.", color: "bg-primary text-white" },
                        { icon: "travel_explore", label: "Cultural Markers", desc: "Yoruba textile patterns, kente-adjacent colour principles, Lagos vernacular architecture.", color: "bg-background-light border-4 border-black" },
                        { icon: "share", label: "Share & Credit", desc: "Every share credits ILÊ AIYÊ directly. Ethical visibility for niche artists.", color: "bg-malachite" },
                    ].map(({ icon, label, desc, color }) => (
                        <div key={label} className={`${color} p-6 rounded-xl neo-brutalism-shadow-sm`}>
                            <span className="material-symbols-outlined text-4xl mb-3 block">{icon}</span>
                            <h4 className="font-black text-lg uppercase mb-2">{label}</h4>
                            <p className="font-bold text-sm opacity-80">{desc}</p>
                        </div>
                    ))}
                </div>

                {/* ── Footer CTA ── */}
                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 py-10 border-t border-primary/10">
                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-primary">Support the Vision</h3>
                        <p className="text-slate-500 max-w-md">
                            Join 40,000+ sonic explorers in building the world&apos;s first decentralized ethno-music archive.
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Link href="/dashboard">
                            <button className="bg-white border-4 border-black px-8 py-4 rounded-xl font-black uppercase neo-brutalism-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                                ← New Zine
                            </button>
                        </Link>
                        <button className="hammered-texture w-full md:w-auto px-12 py-4 rounded-xl text-white font-bold text-lg uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
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
