import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

function buildArtistPrompt(
  city: string,
  country: string,
  neighbourhood: string,
  culturalMarkers: string[],
  vibeDescriptors: string[]
): string {
  return `You are an ethnomusicologist and cultural curator specializing in niche, underground, and heritage music from the Global South.

Your task: Find 2–3 REAL, NICHE local artists from this specific location. These must be:
- Genuinely from or deeply associated with this exact area (not just the country)
- NON-MAINSTREAM — not on international charts, not globally famous
- Authentic to the local culture — can be either traditional/heritage instrumentalists OR contemporary niche acts (e.g., local underground electronic, indie, regional hip-hop, experimental, modern RnB) as long as they represent the creative pulse of this specific location.
- Streamable on at least one platform (Spotify, Apple Music, YouTube, Bandcamp, or SoundCloud)

Location: ${neighbourhood}, ${city}, ${country}
Cultural markers observed: ${culturalMarkers.join(", ")}
Vibe: ${vibeDescriptors.join(", ")}

Search for artists using these approaches:
1. "${city} underground ${country} music niche artists"
2. "${neighbourhood} ${city} local musicians traditional"
3. "${country} Global South heritage music ${culturalMarkers[0] || ""}"

Return ONLY valid JSON in this exact schema:
{
  "artists": [
    {
      "name": "string — exact artist/band name",
      "genre": "string — specific genre (e.g. 'Afrobeats Lagos underground', 'Lagos Fuji revival')",
      "origin": "string — specific city/neighbourhood they are from",
      "bio": "string — 2 sentences. First: their story/sound. Second: cultural connection to this location.",
      "recommended_song": "string — name of a specific, real song by this artist that fits the vibe",
      "why_discovered": "string — 1 sentence explaining what cultural marker led to this discovery",
      "spotify_search": "string — exact Spotify search query to find them",
      "youtube_search": "string — exact YouTube search query",
      "streaming_likelihood": "high|medium|low"
    }
  ],
  "location_music_context": "string — 2-3 sentences about the music scene/history of this specific location",
  "zine_hook": "string — An evocative 8-15 word pull quote for the Sonic Story-Zine (Playfair Display italic style)"
}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      city: string;
      country: string;
      neighbourhood: string;
      cultural_markers: string[];
      vibe_descriptors: string[];
      music_search_query?: string;
    };

    const { city, country, neighbourhood, cultural_markers, vibe_descriptors } = body;

    if (!city || !country) {
      return NextResponse.json({ error: "city and country are required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const prompt = buildArtistPrompt(city, country, neighbourhood, cultural_markers, vibe_descriptors);

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    // Strip markdown fences
    const jsonText = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    const artistData = JSON.parse(jsonText);

    // Fetch real Spotify tracks for the discovered artists
    if (artistData.artists && Array.isArray(artistData.artists)) {
      const { searchArtistTrack } = await import("@/lib/spotify");
      
      const enrichedArtists = await Promise.all(
        artistData.artists.map(async (artist: any) => {
          const spotifyTrack = await searchArtistTrack(artist.name, artist.recommended_song || "");
          return {
            ...artist,
            spotify_track: spotifyTrack,
          };
        })
      );
      
      artistData.artists = enrichedArtists;
    }

    return NextResponse.json({
      success: true,
      ...artistData,
    });
  } catch (error) {
    console.error("find-artists error:", error);
    return NextResponse.json(
      { error: "Failed to find artists", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
