"use client";

import Link from "next/link";

interface HeaderProps {
  variant?: "hook" | "dashboard" | "zine";
}

export default function Header({ variant = "hook" }: HeaderProps) {
  if (variant === "hook") {
    return (
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b-[6px] border-black"
        style={{ backgroundColor: "#fdf6e3" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div
            className="border-4 border-black p-2 rounded-lg neo-brutalism-shadow-sm"
            style={{ backgroundColor: "#e2725b", transform: "rotate(-2deg)" }}
          >
            <span className="material-symbols-outlined text-white text-3xl font-bold">graphic_eq</span>
          </div>
          <Link href="/">
            <h2
              className="text-3xl font-black tracking-tighter uppercase italic px-3 py-1 border-4 border-black rounded-xl cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: "white" }}
            >
              Ethni-CITY
            </h2>
          </Link>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <Link
            href="/"
            className="text-xl font-bold hover:text-primary transition-colors"
            style={{ textDecoration: "underline", textDecorationColor: "#00cf64", textDecorationThickness: "4px", textUnderlineOffset: "4px" }}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-xl font-bold transition-colors"
            style={{ textDecoration: "underline", textDecorationColor: "#e2725b", textDecorationThickness: "4px", textUnderlineOffset: "4px" }}
          >
            Explore
          </Link>
          <Link
            href="#"
            className="text-xl font-bold transition-colors"
            style={{ textDecoration: "underline", textDecorationColor: "#8f00ff", textDecorationThickness: "4px", textUnderlineOffset: "4px" }}
          >
            Community
          </Link>
        </nav>

        {/* CTA */}
        <Link href="/dashboard">
          <button
            className="text-white border-4 border-black px-6 py-2 font-black text-lg rounded-full neo-brutalism-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
            style={{ backgroundColor: "#8f00ff" }}
          >
            Connect
          </button>
        </Link>
      </header>
    );
  }

  if (variant === "zine") {
    return (
      <header
        className="flex items-center justify-between border-b px-6 md:px-20 py-4 backdrop-blur-md sticky top-0 z-50"
        style={{ backgroundColor: "rgba(253,246,227,0.85)", borderBottomColor: "rgba(156,6,249,0.1)" }}
      >
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3" style={{ color: "#9c06f9" }}>
            <div className="size-6">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tighter uppercase" style={{ color: "#1b0f23" }}>Ethni-CITY</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {["Stories", "Music", "Zine", "Archive"].map((item) => (
              <Link key={item} href="#" className="text-sm font-semibold uppercase tracking-widest transition-colors hover:text-purple-700" style={{ color: "#3d2c58" }}>
                {item}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <label className="hidden lg:flex flex-col min-w-48 h-10 max-w-64">
            <div
              className="flex w-full flex-1 items-stretch rounded-full h-full border"
              style={{ backgroundColor: "rgba(156,6,249,0.05)", borderColor: "rgba(156,6,249,0.15)" }}
            >
              <div className="flex items-center justify-center pl-4" style={{ color: "rgba(156,6,249,0.6)" }}>
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 px-3 text-sm font-normal outline-none" placeholder="Search the soundscape..." />
            </div>
          </label>
          <div className="flex gap-3">
            {["person", "shopping_bag"].map((icon) => (
              <button
                key={icon}
                className="flex items-center justify-center rounded-full h-10 w-10 transition-all relative"
                style={{ backgroundColor: "rgba(156,6,249,0.1)", color: "#9c06f9" }}
              >
                <span className="material-symbols-outlined">{icon}</span>
              </button>
            ))}
          </div>
        </div>
      </header>
    );
  }

  return null;
}
