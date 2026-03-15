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
  dj_narration_script: string;
  meta: {
    location: { city: string; country: string; neighbourhood: string };
    featured_artist: ArtistData;
    all_artists: ArtistData[];
    location_music_context: string;
    photo_url?: string;
    generated_at: string;
  };
}

interface EthniCityState {
  // Trip management
  trips: PhotoTrip[];
  activeLocation: string;
  activeCoordinates: { lat: number; lng: number };
  agentStatus: string;

  // Artist discovery
  discoveredArtists: ArtistData[]; // Changed from Artist[] to ArtistData[] to match existing type
  locationMusicContext: string;
  zineHook: string;

  // Zine
  currentZine: ZineData | null; // Changed from any | null to ZineData | null to match existing type
  isGeneratingZine: boolean;

  // User input
  userVibe: string;
  interactionState: "idle" | "awaiting_vibe" | "curating" | "ready";

  // Actions
  addTrip: (trip: PhotoTrip) => void;
  updateTrip: (id: string, updates: Partial<PhotoTrip>) => void;
  setActiveLocation: (label: string, coords: { lat: number; lng: number }) => void;
  setAgentStatus: (status: string) => void;
  setDiscoveredArtists: (artists: ArtistData[], context: string, hook: string) => void; // Changed from Artist[] to ArtistData[]
  setCurrentZine: (zine: ZineData | null) => void; // Changed from any to ZineData | null
  setIsGeneratingZine: (isGenerating: boolean) => void; // Changed parameter name from loading to isGenerating
  setUserVibe: (vibe: string) => void;
  setInteractionState: (state: "idle" | "awaiting_vibe" | "curating" | "ready") => void;
}

export const useEthniStore = create<EthniCityState>((set) => ({ // Changed EthniState to EthniCityState
  trips: [],
  activeLocation: "Awaiting your photo...",
  activeCoordinates: { lat: 0, lng: 0 }, // Changed from null to initial object
  agentStatus: "Ready for your visual story.", // Changed default status
  discoveredArtists: [],
  locationMusicContext: "",
  zineHook: "",
  currentZine: null,
  isGeneratingZine: false,
  userVibe: "",
  interactionState: "idle",

  addTrip: (trip) =>
    set((state) => ({ trips: [...state.trips, trip] })),

  updateTrip: (id, updates) =>
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  setActiveLocation: (label, coords) => // Changed parameter name from location to label
    set({ activeLocation: label, activeCoordinates: coords }),

  setAgentStatus: (status) => set({ agentStatus: status }),

  setDiscoveredArtists: (artists, context, hook) =>
    set({ discoveredArtists: artists, locationMusicContext: context, zineHook: hook }),

  setCurrentZine: (zine) => set({ currentZine: zine }),
  setIsGeneratingZine: (isGenerating) => set({ isGeneratingZine: isGenerating }), // Changed parameter name from loading to isGenerating
  setUserVibe: (vibe) => set({ userVibe: vibe }),
  setInteractionState: (state) => set({ interactionState: state }),
}));
