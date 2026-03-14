import { create } from "zustand";

export interface PhotoTrip {
  id: string;
  label: string;
  file: File;
  previewUrl: string;
  status: "uploading" | "analyzing" | "processed" | "error";
  analysis?: {
    country: string;
    city: string;
    neighbourhood: string;
    confidence: string;
    cultural_markers: string[];
    vibe_descriptors: string[];
    music_search_query: string;
    architecture_style: string;
    coordinates: { lat: number; lng: number };
  };
}

export interface ArtistData {
  name: string;
  genre: string;
  origin: string;
  bio: string;
  why_discovered: string;
  spotify_search: string;
  youtube_search: string;
  streaming_likelihood: string;
  spotify_tracks?: {
    trackName: string;
    previewUrl: string | null;
    albumArtUrl: string | null;
    spotifyUrl: string;
  }[];
}

export interface ZineData {
  zine_id: string;
  headline: string;
  subheadline: string;
  pull_quote: string;
  photo_caption: string;
  artist_bio_paragraph: string;
  location_lore: string;
  share_caption: string;
  meta: {
    location: { city: string; country: string; neighbourhood: string };
    featured_artist: ArtistData;
    location_music_context: string;
    photo_url?: string;
    generated_at: string;
  };
}

interface EthniCityState {
  // Trip management
  trips: PhotoTrip[];
  activeLocation: string;
  activeCoordinates: { lat: number; lng: number } | null;
  agentStatus: string;

  // Artist discovery
  discoveredArtists: ArtistData[];
  locationMusicContext: string;
  zineHook: string;

  // Zine
  currentZine: ZineData | null;
  isGeneratingZine: boolean;

  // Actions
  addTrip: (trip: PhotoTrip) => void;
  updateTrip: (id: string, updates: Partial<PhotoTrip>) => void;
  setActiveLocation: (location: string, coords: { lat: number; lng: number }) => void;
  setAgentStatus: (status: string) => void;
  setDiscoveredArtists: (artists: ArtistData[], context: string, hook: string) => void;
  setCurrentZine: (zine: ZineData | null) => void;
  setIsGeneratingZine: (loading: boolean) => void;
}

export const useEthniStore = create<EthniCityState>((set) => ({
  trips: [],
  activeLocation: "Awaiting your photo...",
  activeCoordinates: null,
  agentStatus: "Drop your photos here! Niche Mode: ON.",
  discoveredArtists: [],
  locationMusicContext: "",
  zineHook: "",
  currentZine: null,
  isGeneratingZine: false,

  addTrip: (trip) =>
    set((state) => ({ trips: [...state.trips, trip] })),

  updateTrip: (id, updates) =>
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  setActiveLocation: (location, coords) =>
    set({ activeLocation: location, activeCoordinates: coords }),

  setAgentStatus: (status) => set({ agentStatus: status }),

  setDiscoveredArtists: (artists, context, hook) =>
    set({ discoveredArtists: artists, locationMusicContext: context, zineHook: hook }),

  setCurrentZine: (zine) => set({ currentZine: zine }),
  setIsGeneratingZine: (loading) => set({ isGeneratingZine: loading }),
}));
