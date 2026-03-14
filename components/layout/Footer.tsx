import Link from "next/link";

interface FooterProps {
  variant?: "hook" | "zine";
}

export default function Footer({ variant = "hook" }: FooterProps) {
  if (variant === "hook") {
    return (
      <footer
        className="mt-20 border-t-[6px] border-black grain-texture relative overflow-hidden"
        style={{ backgroundColor: "#f2e0b0" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          {/* Brand */}
          <div className="flex items-center gap-4 group">
            <div
              className="w-16 h-16 border-4 border-black rounded-lg neo-brutalism-shadow-sm flex items-center justify-center text-white group-hover:rotate-0 transition-transform"
              style={{ backgroundColor: "#b87333", transform: "rotate(-5deg)" }}
            >
              <span className="material-symbols-outlined text-4xl">cloud_done</span>
            </div>
            <div className="text-left">
              <h4 className="text-xl font-black uppercase" style={{ color: "#6b3a1f" }}>Hosted on the Global Frequency</h4>
              <p className="font-bold" style={{ color: "rgba(107,58,31,0.7)" }}>© 2025 Ethni-CITY | Sonic Sovereignty Protocol</p>
            </div>
          </div>

          {/* Legal */}
          <div
            className="flex gap-8 items-center border-4 border-black p-4 rounded-xl neo-brutalism-shadow-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
          >
            {["PRIVACY", "TERMS"].map((item) => (
              <Link key={item} href="#" className="font-black hover:underline transition-colors" style={{ color: "#1b0f23" }}>{item}</Link>
            ))}
            <span className="font-black" style={{ color: "#b87333" }}>GCP ☁</span>
          </div>

          {/* Social */}
          <div className="flex gap-4">
            <div
              className="w-12 h-12 border-4 border-black rounded-full flex items-center justify-center neo-brutalism-shadow-sm cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: "#00cf64" }}
            >
              <span className="material-symbols-outlined font-bold text-black">share</span>
            </div>
            <div
              className="w-12 h-12 border-4 border-black rounded-full flex items-center justify-center neo-brutalism-shadow-sm cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: "#8f00ff" }}
            >
              <span className="material-symbols-outlined font-bold text-white">public</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none opacity-40 grain-texture" />
      </footer>
    );
  }

  return (
    <footer style={{ backgroundColor: "#1b0f23", color: "#94a3b8" }} className="py-12 px-6 md:px-20">
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <div className="flex items-center gap-3 text-white mb-6">
            <div className="size-6">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="#9c06f9" />
              </svg>
            </div>
            <h2 className="text-lg font-bold uppercase tracking-tighter text-white">Ethni-CITY</h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed">
            The premier Sonic Story-Zine platform for Planet Oño Neo-Pop aesthetics and global ethnographic soundscapes.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-white">Connect</h4>
          <ul className="space-y-2 text-sm">
            {["Instagram", "Discord", "Mixcloud"].map((item) => (
              <li key={item}><Link href="#" className="hover:text-purple-400 transition-colors">{item}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-white">Legal</h4>
          <ul className="space-y-2 text-sm">
            {["Privacy", "Terms", "Licensing"].map((item) => (
              <li key={item}><Link href="#" className="hover:text-purple-400 transition-colors">{item}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className="max-w-[1440px] mx-auto border-t mt-12 pt-8 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold"
        style={{ borderTopColor: "#2d1f3d" }}
      >
        <span>© 2025 ETHNI-CITY COLLECTIVE</span>
        <span style={{ color: "#b87333" }}>Planet Oño Edition</span>
      </div>
    </footer>
  );
}
