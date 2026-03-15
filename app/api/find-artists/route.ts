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

Your task: Find exactly 8 REAL, NICHE local artists from this specific location. These must be:
- Genuinely from or deeply associated with this exact area (not just the country)
- NON-MAINSTREAM — not on international charts, not globally famous
- Must be actively streaming on Spotify (do not hallucinate artists, pick real ones)
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
      "spotify_search": "string — exact Spotify search query to find them (usually just their exact name)",
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

    if (!city || !country || city === "Undeterminable") {
      return NextResponse.json({ success: true, artists: [], location_music_context: "Location could not be determined from the photo.", zine_hook: "" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        responseMimeType: "application/json",
      },
    });

    const prompt = buildArtistPrompt(city, country, neighbourhood, cultural_markers, vibe_descriptors);
    
    let validArtists: any[] = [];
    let attempts = 0;
    let finalContext = "";
    let finalHook = "";
    const { searchArtistTrack } = await import("@/lib/spotify");

    console.log(`Starting artist persistence loop for ${city}, ${country}...`);

    while (validArtists.length < 5 && attempts < 3) {
      console.log(`Attempt ${attempts + 1}: Asking Gemini for 8 artists...`);
      const result = await model.generateContent(prompt);
      const rawText = result.response.text().trim();
      const jsonText = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
      
      let artistData;
      try {
        artistData = JSON.parse(jsonText);
      } catch (e) {
        console.error("Failed to parse Gemini JSON:", e);
        attempts++;
        continue;
      }

      finalContext = artistData.location_music_context || finalContext;
      finalHook = artistData.zine_hook || finalHook;

      if (artistData.artists && Array.isArray(artistData.artists)) {
        console.log(`Found ${artistData.artists.length} raw artists from Gemini. Validating on Spotify...`);
        const enrichedArtists = await Promise.all(
          artistData.artists.map(async (artist: any) => {
            const spotifyTracks = await searchArtistTrack(artist.name, artist.recommended_song || "");
            return {
              ...artist,
              spotify_tracks: spotifyTracks,
            };
          })
        );
        
        // Filter out any artists that we couldn't find a single valid Spotify track for
        const filtered = enrichedArtists.filter((a) => a.spotify_tracks && a.spotify_tracks.length > 0);
        
        for (const f of filtered) {
          if (!validArtists.find(va => va.name === f.name)) {
            validArtists.push(f);
            console.log(`✅ Verified streamable artist: ${f.name}`);
          }
        }
      }
      
      console.log(`End of attempt ${attempts + 1}. Valid roster size: ${validArtists.length}/5`);
      attempts++;
    }

    // Trim to exactly 5 artists max
    const finalRoster = validArtists.slice(0, 5);

    return NextResponse.json({
      success: true,
      artists: finalRoster,
      location_music_context: finalContext,
      zine_hook: finalHook,
    });
  } catch (error) {
    console.error("find-artists error:", error);
    return NextResponse.json(
      { error: "Failed to find artists", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
