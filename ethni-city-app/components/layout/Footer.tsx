import Link from "next/link";

interface FooterProps {
    variant?: "hook" | "zine";
}

export default function Footer({ variant = "hook" }: FooterProps) {
    if (variant === "hook") {
        return (
            <footer className="mt-20 border-t-6 border-black bg-[#f2e8d5] grain-texture relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
                    {/* Brand */}
                    <div className="flex items-center gap-4 group">
                        <div className="w-16 h-16 bg-accent-copper border-4 border-black rounded-lg neo-brutalism-shadow-sm flex items-center justify-center text-white rotate-[-5deg] group-hover:rotate-0 transition-transform">
                            <span className="material-symbols-outlined text-4xl">cloud_done</span>
                        </div>
                        <div className="text-left">
                            <h4 className="text-xl font-black uppercase text-[#8b4513]">Hosted on the Global Frequency</h4>
                            <p className="font-bold text-[#8b4513]/70">© 2025 Ethni-CITY | Sonic Sovereignty Protocol</p>
                        </div>
                    </div>
                    {/* Legal */}
                    <div className="flex gap-8 items-center bg-white/50 border-4 border-black p-4 rounded-xl neo-brutalism-shadow-sm">
                        <Link href="#" className="font-black hover:text-terracotta transition-colors">PRIVACY</Link>
                        <Link href="#" className="font-black hover:text-terracotta transition-colors">TERMS</Link>
                        <span className="font-black text-accent-copper">GCP</span>
                    </div>
                    {/* Social */}
                    <div className="flex gap-4">
                        <div className="w-12 h-12 border-4 border-black rounded-full flex items-center justify-center bg-malachite neo-brutalism-shadow-sm cursor-pointer hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined font-bold">share</span>
                        </div>
                        <div className="w-12 h-12 border-4 border-black rounded-full flex items-center justify-center bg-electric-violet text-white neo-brutalism-shadow-sm cursor-pointer hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined font-bold">public</span>
                        </div>
                    </div>
                </div>
                {/* Vellum Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-40 grain-texture" />
            </footer>
        );
    }

    return (
        <footer className="bg-slate-900 text-slate-500 py-12 px-6 md:px-20">
            <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                <div className="col-span-2">
                    <div className="flex items-center gap-3 text-white mb-6">
                        <div className="size-6">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold uppercase tracking-tighter">Ethni-CITY</h2>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed">
                        The premier Sonic Story-Zine platform for Planet Oño Neo-Pop aesthetics and global ethnographic soundscapes.
                    </p>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Connect</h4>
                    <ul className="space-y-2 text-sm">
                        {["Instagram", "Discord", "Mixcloud"].map((item) => (
                            <li key={item}><Link href="#" className="hover:text-primary transition-colors">{item}</Link></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        {["Privacy", "Terms", "Licensing"].map((item) => (
                            <li key={item}><Link href="#" className="hover:text-primary transition-colors">{item}</Link></li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="max-w-[1440px] mx-auto border-t border-slate-800 mt-12 pt-8 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                <span>© 2025 ETHNI-CITY COLLECTIVE</span>
                <span className="text-accent-copper">Planet Oño Edition</span>
            </div>
        </footer>
    );
}
