import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

interface Artist {
  name: string;
  genre: string;
  origin: string;
  bio: string;
  why_discovered: string;
  spotify_search: string;
  youtube_search: string;
}

interface GenerateZineBody {
  location: {
    city: string;
    country: string;
    neighbourhood: string;
  };
  photo_analysis: {
    cultural_markers: string[];
    vibe_descriptors: string[];
    architecture_style: string;
  };
  photo_url: string;
  featured_artist: Artist;
  location_music_context: string;
  zine_hook: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as GenerateZineBody;
    const { location, photo_analysis, photo_url, featured_artist, location_music_context, zine_hook } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
      },
    });

    const prompt = `You are a Creative Director for a premium editorial magazine called "Ethni-CITY" — a publication that celebrates the niche music of the Global South through visual storytelling.

You have been handed a travel photo from ${location.neighbourhood}, ${location.city}, ${location.country}.
The photo's cultural markers: ${photo_analysis.cultural_markers.join(", ")}.
The vibe: ${photo_analysis.vibe_descriptors.join(", ")}.
You are featuring the artist: ${featured_artist.name} (${featured_artist.genre}).
Music scene context: ${location_music_context}
Proposed zine hook: "${zine_hook}"

Your task: Generate the editorial copy for a Sonic Story-Zine spread. Return ONLY valid JSON:

{
  "headline": "string — 6-10 words, Playfair Display italic style, evocative, NOT clickbait. Example: 'The Pulse of Balogun Market.'",
  "subheadline": "string — 5-8 words, gold accent style. Example: 'Gold light, red peppers, and progress.'",
  "pull_quote": "string — A powerful quote (12-20 words) IN the voice of the location/culture, italicized magazine style",
  "photo_caption": "string — 20-30 words. Describes the enhanced photo as a cultural artifact, references the specific cultural markers observed",
  "artist_bio_paragraph": "string — 60-80 words. Written in first person plural as if the magazine is introducing the artist to the world. Mention ${featured_artist.name} by name. Warm, authoritative editorial voice.",
  "location_lore": "string — 30-40 words about the specific musical history of ${location.neighbourhood}, ${location.city}",
  "share_caption": "string — 20-30 word Instagram-ready caption with 3 relevant hashtags that credit the artist",
  "zine_id": "string — URL-safe ID like '${location.city.toLowerCase().replace(/\s+/g, '-')}-${featured_artist.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-01'"
}`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();
    const jsonText = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    const zineContent = JSON.parse(jsonText);

    return NextResponse.json({
      success: true,
      zine: {
        ...zineContent,
        meta: {
          location,
          featured_artist,
          location_music_context,
          photo_url,
          generated_at: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("generate-zine error:", error);
    return NextResponse.json(
      { error: "Failed to generate Zine", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
