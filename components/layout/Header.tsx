"use client";

import Link from "next/link";

interface HeaderProps {
  variant?: "hook" | "dashboard" | "zine";
  onUploadClick?: () => void;
  activeLocation?: string;
}

export default function Header({ variant = "hook", onUploadClick, activeLocation }: HeaderProps) {
  // --- Shared Logo Component ---
  const Logo = () => (
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
  );

  // --- Variant 1: Landing (Hook) ---
  if (variant === "hook") {
    return (
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b-[6px] border-black"
        style={{ backgroundColor: "#fdf6e3" }}
      >
        <Logo />

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

  // --- Variant 2: Dashboard ---
  if (variant === "dashboard") {
    return (
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b-[6px] border-black"
        style={{ backgroundColor: "#fdf6e3" }}
      >
        <div className="flex items-center gap-8">
          <Logo />
          {activeLocation && activeLocation !== "Awaiting your photo..." && (
            <div className="hidden lg:flex items-center gap-2 bg-white thick-outline px-4 py-1 rounded-full neo-brutalism-shadow-sm rotate-[-1deg]">
              <span className="material-symbols-outlined text-sm" style={{ color: "#9c06f9" }}>location_on</span>
              <span className="font-bold text-xs uppercase tracking-tighter">
                {activeLocation.split(",")[1]?.trim() || "Global South"}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-4 items-center">
          {onUploadClick && (
            <button
              onClick={onUploadClick}
              className="flex items-center gap-2 border-4 border-black px-4 py-2 rounded-lg font-bold text-sm uppercase neo-brutalism-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              style={{ backgroundColor: "#00cf64" }}
            >
              <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
              <span className="hidden sm:inline">Upload Photo</span>
            </button>
          )}
          <div className="size-10 border-4 border-black rounded-full overflow-hidden flex items-center justify-center text-white font-black text-sm neo-brutalism-shadow-sm" style={{ backgroundColor: "#b87333" }}>
            DJ
          </div>
        </div>
      </header>
    );
  }

  // --- Variant 3: Zine ---
  if (variant === "zine") {
    return (
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b-[6px] border-black"
        style={{ backgroundColor: "#fdf6e3" }}
      >
        <div className="flex items-center gap-12">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 px-4 py-1 border-4 border-black rounded-xl bg-white neo-brutalism-shadow-sm">
            {["Stories", "Music", "Zine", "Archive"].map((item) => (
              <Link key={item} href="#" className="text-sm font-black uppercase tracking-tight hover:text-purple-700 transition-colors" style={{ color: "#1b0f23" }}>
                {item}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex gap-4 items-center">
          <div className="hidden lg:flex items-stretch rounded-full h-10 border-4 border-black bg-white neo-brutalism-shadow-sm overflow-hidden min-w-[240px]">
            <div className="flex items-center justify-center pl-3 text-black">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input className="border-none bg-transparent focus:ring-0 px-3 text-sm font-bold uppercase outline-none" placeholder="Search..." />
          </div>
          <div className="flex gap-3">
             {["person", "shopping_bag"].map((icon) => (
              <button
                key={icon}
                className="flex items-center justify-center border-4 border-black rounded-full h-10 w-10 transition-all neo-brutalism-shadow-sm hover:translate-x-1 hover:translate-y-1"
                style={{ backgroundColor: icon === "person" ? "#00cf64" : "#ffcc00", color: "black" }}
              >
                <span className="material-symbols-outlined font-black">{icon}</span>
              </button>
            ))}
          </div>
        </div>
      </header>
    );
  }

  return null;
}
