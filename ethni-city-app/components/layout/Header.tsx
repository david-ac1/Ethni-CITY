"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps {
    variant?: "hook" | "dashboard" | "zine";
}

export default function Header({ variant = "hook" }: HeaderProps) {
    if (variant === "hook") {
        return (
            <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-background-light border-b-6 border-black">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <div className="bg-terracotta border-4 border-black p-2 rounded-lg neo-brutalism-shadow-sm rotate-[-2deg]">
                        <span className="material-symbols-outlined text-white text-3xl font-bold">graphic_eq</span>
                    </div>
                    <Link href="/">
                        <h2 className="text-3xl font-black tracking-tighter uppercase italic sticker-logo bg-white px-3 py-1 border-4 border-black rounded-xl cursor-pointer hover:scale-105 transition-transform">
                            Ethni-CITY
                        </h2>
                    </Link>
                </div>
                {/* Nav */}
                <nav className="hidden md:flex items-center gap-10">
                    <Link href="/" className="text-xl font-bold hover:text-primary underline decoration-4 decoration-malachite underline-offset-4 transition-colors">Home</Link>
                    <Link href="/dashboard" className="text-xl font-bold hover:text-primary underline decoration-4 decoration-terracotta underline-offset-4 transition-colors">Explore</Link>
                    <Link href="#" className="text-xl font-bold hover:text-primary underline decoration-4 decoration-electric-violet underline-offset-4 transition-colors">Community</Link>
                </nav>
                {/* CTA */}
                <Link href="/dashboard">
                    <button className="bg-electric-violet text-white border-4 border-black px-6 py-2 font-black text-lg rounded-full neo-brutalism-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase">
                        Connect
                    </button>
                </Link>
            </header>
        );
    }

    if (variant === "zine") {
        return (
            <header className="flex items-center justify-between border-b border-primary/10 px-6 md:px-20 py-4 bg-background-light/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-3 text-primary">
                        <div className="size-6">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor" />
                            </svg>
                        </div>
                        <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tighter uppercase">Ethni-CITY</h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        {["Stories", "Music", "Zine", "Archive"].map((item) => (
                            <Link key={item} href="#" className="hover:text-primary transition-colors text-sm font-semibold uppercase tracking-widest">
                                {item}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <label className="hidden lg:flex flex-col min-w-48 h-10 max-w-64">
                        <div className="flex w-full flex-1 items-stretch rounded-full h-full bg-primary/5 border border-primary/10">
                            <div className="text-primary/60 flex items-center justify-center pl-4">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <input className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 px-3 text-sm font-normal outline-none" placeholder="Search the soundscape..." />
                        </div>
                    </label>
                    <div className="flex gap-3">
                        <button className="flex items-center justify-center rounded-full h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                            <span className="material-symbols-outlined">person</span>
                        </button>
                        <button className="flex items-center justify-center rounded-full h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all relative">
                            <span className="material-symbols-outlined">shopping_bag</span>
                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-accent-gold ring-2 ring-background-light" />
                        </button>
                    </div>
                </div>
            </header>
        );
    }

    // Dashboard variant handled inline in dashboard page
    return null;
}
