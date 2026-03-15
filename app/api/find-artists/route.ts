import { runSmartGemini } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

function buildArtistPrompt(
  city: string,
  country: string,
  neighbourhood: string,
  culturalMarkers: string[],
  vibeDescriptors: string[],
  userVibe?: string
): string {
  return `You are an expert ethnomusicologist and "Global South Radio DJ". 
    A user has uploaded a photo from ${neighbourhood}, ${city}, ${country}.

    CULTURAL CONTEXT FROM IMAGE ANALYSIS:
    - Markers: ${culturalMarkers?.join(", ")}
    - Visual Vibe: ${vibeDescriptors?.join(", ")}
    ${userVibe ? `- USER REQUESTED VIBE (CRITICAL): "${userVibe}"` : ""}

    TASK:
    Discover a set of exactly 12 artists from ${country} (with a strong focus on ${city} if possible).
    
    CURATION STRATEGY:
    1. ${userVibe ? `PRIMARY FILTER: Follow the user's requested vibe: "${userVibe}".` : "VIBE: Match the cultural markers and visual descriptors."}
    2. BALANCE: Provide 3 "Anchor" artists (major stars from the region) and 9 "Discovery" artists (niche acts).
    3. GEOGRAPHY: Prioritize artists from ${city}, but fallback to ${country} to ensure high quality recordings.
    4. PREVIEW PRIORITY: Only suggest artists likely to have audio previews on iTunes (well-produced recordings).

Return ONLY valid JSON in this exact schema:
{
  "artists": [
    {
      "name": "string - exact artist/band name",
      "genre": "string - specific genre",
      "origin": "string - city/region in ${country}",
      "bio": "string - 2 sentences. Story/sound + cultural connection",
      "recommended_song": "string - name of a specific, real song with a preview",
      "why_discovered": "string - 1 sentence explaining the link to a cultural marker",
      "spotify_search": "string",
      "youtube_search": "string",
      "streaming_likelihood": "high|medium|low"
    }
  ],
  "location_music_context": "string - scene history in ${country} (2-3 sentences)",
  "zine_hook": "string - Evocative 8-15 word pull quote"
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
      userVibe?: string;
    };

    const { city, country, neighbourhood, cultural_markers, vibe_descriptors, userVibe } = body;

    if (!country || country === "Undeterminable") {
      return NextResponse.json({ success: true, artists: [], location_music_context: "Country could not be determined.", zine_hook: "" });
    }

    const prompt = buildArtistPrompt(city, country, neighbourhood, cultural_markers, vibe_descriptors, userVibe);
    
    let validArtists: any[] = [];
    const seenNames = new Set<string>();
    let attempts = 0;
    let finalContext = "";
    let finalHook = "";
    
    const { validateArtistOnITunes } = await import("@/lib/itunes");
    const { getMarketCode } = await import("@/lib/music-utils");
    const market = getMarketCode(country);

    while (validArtists.length < 5 && attempts < 3) {
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
        attempts++;
        continue;
      }

      finalContext = artistData.location_music_context || finalContext;
      finalHook = artistData.zine_hook || finalHook;

      if (artistData.artists && Array.isArray(artistData.artists)) {
        for (const artist of artistData.artists) {
            if (validArtists.length >= 5) break;
            if (seenNames.has(artist.name.toLowerCase())) continue;

            try {
                const { isValid, topTracks } = await validateArtistOnITunes(artist.name, market);
                if (isValid) {
                    validArtists.push({
                        ...artist,
                        spotify_tracks: topTracks.map((t: any) => ({
                            trackName: t.trackName,
                            previewUrl: t.previewUrl,
                            albumArtUrl: t.albumArtUrl,
                            spotifyUrl: t.musicUrl
                        }))
                    });
                    seenNames.add(artist.name.toLowerCase());
                }
            } catch (err) {
                console.error("iTunes validation error:", err);
            }
        }
      }
      attempts++;
    }

    return NextResponse.json({
      success: true,
      artists: validArtists.slice(0, 5),
      location_music_context: finalContext,
      zine_hook: finalHook,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Discovery failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
