import { runSmartGemini } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

function buildArtistPrompt(
  city: string,
  country: string,
  neighbourhood: string,
  culturalMarkers: string[],
  vibeDescriptors: string[]
): string {
  return `You are an ethnomusicologist and cultural curator specializing in the Global South.
  
Your task: Find exactly 12 REAL artists from the COUNTRY of ${country}. While you should keep the vibe of ${city} and ${neighbourhood} in mind, PRIORITIZE finding artists from across the entire country to ensure we find tracks with playable audio previews on Spotify.

You MUST return a balanced roster:

1. THE ANCHORS (4-5 Artists): 
   - These are major, mainstream, or globally-recognized stars from ${country} (e.g., Burna Boy, Wizkid, Tems, Ayra Starr, Rema for Nigeria; or equivalent for other countries).
   - They MUST have high-quality audio previews on Spotify to "guarantee" a vibrant demo experience.
   - They provide the reliable, studio-quality sound for the Sonic Story-Zine.

2. THE DISCOVERIES (7-8 Artists):
   - These are NICHE, underground, or heritage local artists from across ${country}.
   - They should still represent the cultural pulse seen in the photo markers (${culturalMarkers.join(", ")}).
   - IMPORTANT: Even for niche artists, PRIORITIZE those with at least one high-quality track on Spotify. We need the 30-second audio previews to boost the app demo.

Location context: ${neighbourhood !== "Undeterminable" ? neighbourhood : "Unknown Neighbourhood"}, ${city !== "Undeterminable" ? city : "Unknown City"}, ${country}
Cultural markers: ${culturalMarkers.join(", ")}
Vibe: ${vibeDescriptors.join(", ")}

Return ONLY valid JSON in this exact schema:
{
  "artists": [
    {
      "name": "string — exact artist/band name",
      "genre": "string — specific genre",
      "origin": "string — city/region in ${country}",
      "bio": "string — 2 sentences. Story/sound + cultural connection",
      "recommended_song": "string — name of a specific, real song with a preview",
      "why_discovered": "string — 1 sentence explaining the link to a cultural marker",
      "spotify_search": "string",
      "youtube_search": "string",
      "streaming_likelihood": "high|medium|low"
    }
  ],
  "location_music_context": "string — scene history in ${country} (2-3 sentences)",
  "zine_hook": "string — Evocative 8-15 word pull quote"
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

    if (!country || country === "Undeterminable") {
      return NextResponse.json({ success: true, artists: [], location_music_context: "Country could not be determined from the photo.", zine_hook: "" });
    }

    // If city is unknown, we continue but with country-wide context
    const displayLocation = city === "Undeterminable" ? country : `${city}, ${country}`;
    console.log(`Starting artist discovery for: ${displayLocation}`);

    const prompt = buildArtistPrompt(city, country, neighbourhood, cultural_markers, vibe_descriptors);
    
    let validArtists: any[] = [];
    const seenNames = new Set<string>();
    let attempts = 0;
    let finalContext = "";
    let finalHook = "";
    const { validateArtistOnITunes } = await import("@/lib/itunes");
    const { getMarketCode } = await import("@/lib/music-utils");
    const market = getMarketCode(country);

    console.log(`Starting artist persistence loop for ${displayLocation} (iTunes Market: ${market})...`);

    while (validArtists.length < 5 && attempts < 3) {
      console.log(`Attempt ${attempts + 1}: Asking Gemini for artists...`);
      
      const rawText = await runSmartGemini(prompt, {
        temperature: 0.4,
        topP: 0.9,
        responseMimeType: "application/json",
      });
      
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
        console.log(`Found ${artistData.artists.length} raw artists from Gemini. Validating on iTunes...`);
        
        for (const artist of artistData.artists) {
            if (validArtists.length >= 5) break;
            if (seenNames.has(artist.name.toLowerCase())) continue;

            try {
                const { isValid, topTracks } = await validateArtistOnITunes(artist.name, market);
                if (isValid) {
                    const hasPreview = topTracks.some((t: any) => !!t.previewUrl);
                    console.log(`✅ Verified artist: ${artist.name} (Has Previews: ${hasPreview})`);
                    
                    validArtists.push({
                        ...artist,
                        spotify_tracks: topTracks.map((t: any) => ({
                            trackName: t.trackName,
                            previewUrl: t.previewUrl,
                            albumArtUrl: t.albumArtUrl,
                            spotifyUrl: t.musicUrl // Mapping iTunes URL to existing field
                        }))
                    });
                    seenNames.add(artist.name.toLowerCase());
                } else {
                    console.log(`❌ Artist not found on iTunes: ${artist.name}`);
                }
            } catch (err) {
                console.error(`Error validating ${artist.name}:`, err);
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
