"use client";

import { useState } from "react";
import { ZineData } from "@/lib/store";

interface SocialMockupsProps {
  zine: ZineData;
  heroImageUrl: string;
}

export default function SocialMockups({ zine, heroImageUrl }: SocialMockupsProps) {
  const [activeTab, setActiveTab] = useState<"tiktok" | "instagram">("tiktok");
  const allArtists = zine.meta.all_artists || [];
  const primaryTrack = zine.meta.featured_artist.spotify_tracks?.[0] || null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-4 border-b-2 border-slate-200 w-full justify-center">
        <button
          onClick={() => setActiveTab("tiktok")}
          className={`pb-4 px-6 font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2 ${activeTab === "tiktok" ? "border-b-4 text-black" : "text-slate-400"}`}
          style={{ borderBottomColor: activeTab === "tiktok" ? "#9c06f9" : "transparent" }}
        >
          <span className="material-symbols-outlined text-lg">music_video</span>
          TikTok Voiceover
        </button>
        <button
          onClick={() => setActiveTab("instagram")}
          className={`pb-4 px-6 font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2 ${activeTab === "instagram" ? "border-b-4 text-black" : "text-slate-400"}`}
          style={{ borderBottomColor: activeTab === "instagram" ? "#e2725b" : "transparent" }}
        >
          <span className="material-symbols-outlined text-lg">photo_camera</span>
          Instagram Post
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start mt-4">
        {/* Phone Mockup Area */}
        <div className="flex-shrink-0">
          {activeTab === "tiktok" ? (
            <TikTokMockup zine={zine} heroImageUrl={heroImageUrl} primaryTrack={primaryTrack} />
          ) : (
            <InstagramMockup zine={zine} heroImageUrl={heroImageUrl} primaryTrack={primaryTrack} />
          )}
        </div>

        {/* Playable Tracklist sidebar */}
        {allArtists.length > 0 && (
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <h3 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-2 border-b border-slate-200 pb-2">
              🎵 Sounds of {zine.meta.location.city}
            </h3>
            {allArtists.map((artist, i) => {
              const track = artist.spotify_tracks?.[0];
              if (!track) return null;
              
              return (
              <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-colors">
                 {track.albumArtUrl ? (
                  <img src={track.albumArtUrl} alt="" className="w-12 h-12 rounded shadow-sm object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-[#1DB954] text-white flex items-center justify-center rounded shadow-sm">
                    <span className="material-symbols-outlined text-xl">music_note</span>
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-grow">
                  <span className="text-sm font-bold text-black truncate">{track.trackName}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest truncate">{artist.name}</span>
                </div>
                {track.previewUrl ? (
                  <audio controls src={track.previewUrl} className="h-8 w-[100px] border border-slate-200 rounded-full bg-slate-50" />
                ) : (
                  <a href={track.spotifyUrl} target="_blank" rel="noopener noreferrer" className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-[#1DB954] transition-colors">
                     <span className="material-symbols-outlined text-lg">open_in_new</span>
                  </a>
                )}
              </div>
            )})}
          </div>
        )}
        {allArtists.length === 0 && (
          <div className="w-full max-w-sm p-6 border-2 border-dashed border-slate-200 rounded-xl text-center">
             <span className="material-symbols-outlined text-slate-300 text-4xl mb-2 block">music_off</span>
             <p className="text-sm font-bold text-slate-500 uppercase">No Spotify Tracks Found</p>
             <p className="text-xs text-slate-400 mt-1">These artists might be too underground or not streaming their music.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TikTokMockup({ zine, heroImageUrl, primaryTrack }: any) {
  return (
    <div className="relative w-[340px] h-[720px] bg-black rounded-[2.5rem] border-[12px] border-slate-900 overflow-hidden shadow-2xl flex-shrink-0">
      {/* Safe Area Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-50" />

      {/* Video Content / Photo */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <img src={heroImageUrl} alt="" className="min-w-full min-h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
      </div>

      {/* Top UI */}
      <div className="absolute top-10 left-4 right-4 flex justify-between items-center text-white z-20 opacity-90">
        <span className="material-symbols-outlined shadow-black drop-shadow-md">search</span>
        <div className="flex gap-4 font-bold text-sm drop-shadow-md">
          <span>Following</span>
          <span className="border-b-2">For You</span>
        </div>
        <span className="material-symbols-outlined drop-shadow-md">live_tv</span>
      </div>

      {/* Side Actions UI */}
      <div className="absolute bottom-24 right-2 flex flex-col items-center gap-6 text-white z-20">
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-white rounded-full border-2 border-white overflow-hidden p-[2px]">
            <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-black">person</span>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs -mb-2">+</div>
          </div>
        </div>
        {[
          { icon: "favorite", label: "123K" },
          { icon: "chat_bubble", label: "1,240" },
          { icon: "bookmark", label: "14K" },
          { icon: "share", label: "4.2K" }
        ].map((btn) => (
          <div key={btn.icon} className="flex flex-col items-center gap-1 drop-shadow-md">
            <span className="material-symbols-outlined text-4xl">{btn.icon}</span>
            <span className="text-xs font-bold">{btn.label}</span>
          </div>
        ))}
      </div>

      {/* Bottom Text UI */}
      <div className="absolute bottom-20 left-4 right-16 text-white z-20 flex flex-col gap-2">
        <p className="font-bold text-sm drop-shadow-md">@EthniCITY_Sonic</p>
        <p className="text-sm line-clamp-3 drop-shadow-md">
          {zine.pull_quote} The vibe at {zine.meta.location.neighbourhood} is unmatched. Discovered the brilliant {zine.meta.featured_artist.name}. #EthniCITY #GlobalSouthCulture #{zine.meta.location.city.replace(/\s+/g, "")}
        </p>
      </div>

      {/* Spinning Record / Sound UI */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white z-20">
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
          <span className="material-symbols-outlined text-sm animate-pulse">music_note</span>
          <span className="text-xs font-bold truncate max-w-[150px]">
            {primaryTrack?.trackName || `${zine.meta.featured_artist.name} - Original Sound`}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full animate-spin bg-black border-4 border-[#252525] flex items-center justify-center" style={{ animationDuration: '3s' }}>
          {primaryTrack?.albumArtUrl ? (
            <img src={primaryTrack.albumArtUrl} alt="" className="w-4 h-4 rounded-full object-cover" />
          ) : (
            <div className="w-4 h-4 bg-primary rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
}

function InstagramMockup({ zine, heroImageUrl, primaryTrack }: any) {
  return (
    <div className="relative w-[400px] bg-white border border-slate-200 shadow-xl flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}>
            EC
          </div>
          <div>
            <p className="font-bold text-sm leading-tight text-black">ethni_city</p>
            {primaryTrack && (
              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                {zine.meta.location.city}, {zine.meta.location.country}
              </p>
            )}
          </div>
        </div>
        <span className="material-symbols-outlined text-slate-600">more_horiz</span>
      </div>

      {/* Media */}
      <div className="w-full aspect-square relative overflow-hidden">
        <img src={heroImageUrl} alt="" className="min-w-full min-h-full object-cover" />
        
        {/* Tag popup */}
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">person</span>
          {zine.meta.featured_artist.name.replace(/\s+/g, "").toLowerCase()}
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 flex justify-between items-center text-black">
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-3xl">favorite</span>
          <span className="material-symbols-outlined text-3xl">chat_bubble</span>
          <span className="material-symbols-outlined text-3xl">send</span>
        </div>
        <span className="material-symbols-outlined text-3xl">bookmark</span>
      </div>

      {/* Caption Area */}
      <div className="px-4 pb-4">
        <p className="font-bold text-sm mb-1 text-black">12,402 likes</p>
        <p className="text-sm text-black">
          <span className="font-bold mr-2">ethni_city</span>
          {zine.share_caption}
        </p>
        
        {primaryTrack && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors">
            {primaryTrack.albumArtUrl ? (
              <img src={primaryTrack.albumArtUrl} alt="" className="w-10 h-10 rounded shadow-sm object-cover" />
            ) : (
              <div className="w-10 h-10 bg-[#1DB954] text-white flex items-center justify-center rounded shadow-sm">
                <span className="material-symbols-outlined text-lg">music_note</span>
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-black truncate">{primaryTrack.trackName}</span>
              <span className="text-[10px] text-slate-500 truncate">{zine.meta.featured_artist.name}</span>
            </div>
          </div>
        )}
        
        <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-wider">2 hours ago</p>
      </div>
    </div>
  );
}
