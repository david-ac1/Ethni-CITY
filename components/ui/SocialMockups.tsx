"use client";

import { useState, useRef, useCallback } from "react";
import { ZineData } from "@/lib/store";
import { toPng } from "html-to-image";

interface SocialMockupsProps {
  zine: ZineData;
  heroImageUrl: string;
}

export default function SocialMockups({ zine, heroImageUrl }: SocialMockupsProps) {
  const [activeTab, setActiveTab] = useState<"tiktok" | "instagram">("tiktok");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const allArtists = zine.meta.all_artists || [];
  
  const handleDownload = useCallback(async () => {
    if (!mockupRef.current) return;
    
    try {
      const dataUrl = await toPng(mockupRef.current, { 
        cacheBust: true,
        backgroundColor: activeTab === "instagram" ? "#ffffff" : "#000000",
        // Ensure styles are captured correctly
        style: {
          borderRadius: '0'
        }
      });
      const link = document.createElement("a");
      link.download = `ethni-city-zine-${activeTab}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  }, [activeTab]);

  const togglePlay = (trackUrl: string) => {
    if (playingId === trackUrl) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      setPlayingId(trackUrl);
      if (audioRef.current) {
        audioRef.current.src = trackUrl;
        audioRef.current.play().catch(err => console.error("Playback failed:", err));
      }
    }
  };

  const currentTrack = allArtists.flatMap(a => a.spotify_tracks || []).find(t => t.previewUrl === playingId) 
    || zine.meta.featured_artist.spotify_tracks?.[0] 
    || null;

  const currentArtistName = allArtists.find(a => a.spotify_tracks?.some(t => t.previewUrl === playingId))?.name 
    || zine.meta.featured_artist.name;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* Hidden master audio element */}
      <audio 
        ref={audioRef}
        onEnded={() => setPlayingId(null)}
        className="hidden"
      />

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
        <div className="flex flex-col items-center gap-6">
          <div ref={mockupRef}>
            {activeTab === "tiktok" ? (
              <TikTokMockup 
                zine={zine} 
                heroImageUrl={heroImageUrl} 
                primaryTrack={currentTrack} 
                isPlaying={!!playingId} 
                artistName={currentArtistName}
              />
            ) : (
              <InstagramMockup 
                zine={zine} 
                heroImageUrl={heroImageUrl} 
                primaryTrack={currentTrack} 
                artistName={currentArtistName}
                isPlaying={!!playingId}
              />
            )}
          </div>
          
          <button 
            onClick={handleDownload}
            className="flex items-center gap-3 border-4 border-black px-8 py-4 rounded-xl font-black uppercase neo-brutalism-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            style={{ backgroundColor: activeTab === "tiktok" ? "#9c06f9" : "#e2725b", color: 'white' }}
          >
            <span className="material-symbols-outlined">download</span>
            Save to Camera Roll
          </button>
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
              <div 
                key={i} 
                onClick={() => track.previewUrl && togglePlay(track.previewUrl)}
                className={`flex items-center gap-3 p-3 bg-white border rounded-xl shadow-sm transition-all cursor-pointer group ${playingId === track.previewUrl ? 'border-[#9c06f9] ring-2 ring-[#9c06f9]/10' : 'border-slate-200 hover:border-slate-300'}`}
              >
                 {track.albumArtUrl ? (
                   <div className="relative w-12 h-12 flex-shrink-0">
                    <img src={track.albumArtUrl} alt="" className="w-full h-full rounded shadow-sm object-cover" />
                    {track.previewUrl && (
                      <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-xl">
                          {playingId === track.previewUrl ? 'pause' : 'play_arrow'}
                        </span>
                      </div>
                    )}
                   </div>
                ) : (
                  <div className="w-12 h-12 bg-[#1DB954] text-white flex-shrink-0 flex items-center justify-center rounded shadow-sm">
                    <span className="material-symbols-outlined text-xl">music_note</span>
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-grow">
                  <span className="text-sm font-bold text-black truncate group-hover:text-[#9c06f9] transition-colors">{track.trackName}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest truncate">{artist.name}</span>
                </div>
                
                {track.previewUrl ? (
                  <div className={`size-8 rounded-full flex items-center justify-center transition-colors ${playingId === track.previewUrl ? 'bg-[#9c06f9] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                    <span className="material-symbols-outlined text-xl leading-none">
                      {playingId === track.previewUrl ? 'pause' : 'play_arrow'}
                    </span>
                  </div>
                ) : (
                  <a 
                    href={track.spotifyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={(e) => e.stopPropagation()}
                    className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 hover:text-[#1DB954] transition-colors"
                  >
                     <span className="material-symbols-outlined text-lg">open_in_new</span>
                  </a>
                )}
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}

function TikTokMockup({ zine, heroImageUrl, primaryTrack, ...anyOtherProps }: any) {
  return (
    <div className="relative w-[340px] h-[720px] bg-black rounded-[2.5rem] border-[12px] border-slate-900 overflow-hidden shadow-2xl flex-shrink-0">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-50" />
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <img src={heroImageUrl} alt="" className="min-w-full min-h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
      </div>
      <div className="absolute top-10 left-4 right-4 flex justify-between items-center text-white z-20 opacity-90">
        <span className="material-symbols-outlined shadow-black drop-shadow-md">search</span>
        <div className="flex gap-4 font-bold text-sm drop-shadow-md">
          <span>Following</span>
          <span className="border-b-2">For You</span>
        </div>
        <span className="material-symbols-outlined drop-shadow-md">live_tv</span>
      </div>
      <div className="absolute bottom-24 right-2 flex flex-col items-center gap-6 text-white z-20">
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-white rounded-full border-2 border-white overflow-hidden p-[2px]">
            <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-black">
              P
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
      <div className="absolute bottom-20 left-4 right-16 text-white z-20 flex flex-col gap-2">
        <p className="font-bold text-sm drop-shadow-md">@EthniCITY_Sonic</p>
        <p className="text-sm line-clamp-3 drop-shadow-md">
          {zine.pull_quote} The vibe at {zine.meta.location.neighbourhood} is unmatched. Discovered the brilliant {zine.meta.featured_artist.name}. #EthniCITY #GlobalSouthCulture #{zine.meta.location.city.replace(/\s+/g, "")}
        </p>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white z-20">
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
          <span className={`material-symbols-outlined text-sm ${anyOtherProps.isPlaying ? 'animate-pulse text-[#39ff14]' : ''}`}>music_note</span>
          <span className="text-xs font-bold truncate max-w-[150px]">
            {primaryTrack?.trackName || `${anyOtherProps.artistName} - Original Sound`}
          </span>
        </div>
        <div className={`w-10 h-10 rounded-full bg-black border-4 border-[#252525] flex items-center justify-center ${anyOtherProps.isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
          {primaryTrack?.albumArtUrl ? (
            <img src={primaryTrack.albumArtUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
          ) : (
            <div className="w-4 h-4 bg-primary rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
}

function InstagramMockup({ zine, heroImageUrl, primaryTrack, ...anyOtherProps }: any) {
  return (
    <div className="relative w-[400px] bg-white border border-slate-200 shadow-xl flex-shrink-0">
      <div className="flex items-center justify-between p-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}>
            EC
          </div>
            <div>
            <p className="font-bold text-sm leading-tight text-black">ethni_city</p>
              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                {zine.meta.location.city}, {zine.meta.location.country}
                {anyOtherProps.isPlaying && (
                  <span className="material-symbols-outlined text-[10px] animate-pulse text-[#00cf64]">music_note</span>
                )}
              </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-slate-600">more_horiz</span>
      </div>
      <div className="w-full aspect-square relative overflow-hidden">
        <img src={heroImageUrl} alt="" className="min-w-full min-h-full object-cover" />
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">person</span>
          {zine.meta.featured_artist.name.replace(/\s+/g, "").toLowerCase()}
        </div>
      </div>
      <div className="p-3 flex justify-between items-center text-black">
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-3xl">favorite</span>
          <span className="material-symbols-outlined text-3xl">chat_bubble</span>
          <span className="material-symbols-outlined text-3xl">send</span>
        </div>
        <span className="material-symbols-outlined text-3xl">bookmark</span>
      </div>
      <div className="px-4 pb-4">
        <p className="font-bold text-sm mb-1 text-black">12,402 likes</p>
        <p className="text-sm text-black">
          <span className="font-bold mr-2">ethni_city</span>
          {zine.share_caption}
        </p>
        {primaryTrack && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
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
