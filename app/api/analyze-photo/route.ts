import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const ANALYSIS_PROMPT = `You are an expert cultural geographer and ethnomusicologist specializing in the Global South.

Analyze this travel photo and extract the following information as JSON. Be highly specific — avoid generic descriptions. Focus on hyper-local, neighbourhood-level details that could help identify niche local music.

Return ONLY valid JSON in this exact schema:
{
  "country": "string",
  "city": "string", 
  "neighbourhood": "string (be as specific as possible — market name, district, barrio, etc.)",
  "confidence": "high|medium|low",
  "cultural_markers": ["array of specific visual cultural markers observed"],
  "architecture_style": "string",
  "vibe_descriptors": ["array of evocative sensory/emotional descriptors"],
  "music_search_query": "string — a targeted Google search query to find niche local artists from this exact place",
  "coordinates_hint": "string — city, country for geocoding (e.g. 'Lagos Island, Lagos, Nigeria')"
}

Examples of good cultural_markers: ["Yoruba agbada fabric patterns", "open-air market stalls with zinc roofing", "painted concrete walls with Oshun motifs"]
Examples of good vibe_descriptors: ["humid market intensity", "chaotic abundance", "informal economy energy", "Afrobeats in the distance"]`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("photo") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No photo provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Convert file to base64 for Gemini
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    let result;
    let retries = 3;
    while (retries > 0) {
      try {
        result = await model.generateContent([
          {
            inlineData: {
              mimeType: file.type as "image/jpeg" | "image/png" | "image/webp",
              data: base64,
            },
          },
          ANALYSIS_PROMPT,
        ]);
        break; // Success, break out of loop
      } catch (err: any) {
        retries--;
        console.warn(`Gemini API error in analyze-photo, retries left: ${retries} | Error: ${err.message}`);
        if (retries === 0) throw err;
        // Wait 3 seconds before retrying to let the gateway clear
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
    
    if (!result) throw new Error("Failed to generate content after retries");

    const rawText = result.response.text().trim();

    // Strip markdown code fences if present
    const jsonText = rawText.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    const analysis = JSON.parse(jsonText);

    // Geocode the location using Google Maps Geocoding API
    let coordinates = { lat: 0, lng: 0 };
    if (process.env.GOOGLE_MAPS_API_KEY && analysis.coordinates_hint) {
      try {
        const geocodeRes = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(analysis.coordinates_hint)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );
        const geocodeData = await geocodeRes.json();
        if (geocodeData.results?.[0]?.geometry?.location) {
          coordinates = geocodeData.results[0].geometry.location;
        }
      } catch {
        // Geocoding failed — coordinates will be (0,0), map won't fly
        console.warn("Geocoding failed, proceeding without coordinates");
      }
    }

    return NextResponse.json({
      success: true,
      analysis: {
        ...analysis,
        coordinates,
      },
    });
  } catch (error) {
    console.error("analyze-photo error:", error);
    return NextResponse.json(
      { error: "Failed to analyze photo", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
