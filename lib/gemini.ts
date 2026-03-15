import { GoogleGenerativeAI, GenerationConfig, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize separate clients for Paid and Regular (Free) keys
const paidKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY_PAID;
const freeKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY_FREE || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

const paidGenAI = paidKey ? new GoogleGenerativeAI(paidKey) : null;
const freeGenAI = freeKey ? new GoogleGenerativeAI(freeKey) : null;

const DEFAULT_SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

interface ModelConfig {
  name: string;
  client: "paid" | "free";
}

/**
 * Executes a Gemini request with hierarchical multi-key fallbacks.
 * Strategy: 
 * 1. Paid Key -> gemini-1.5-pro (Highest quality)
 * 2. Regular Key -> gemini-2.0-flash (Fastest baseline)
 * 3. Regular Key -> gemini-1.5-flash (Reliable legacy fallback)
 */
export async function runSmartGemini(
  prompt: string | any[],
  config: GenerationConfig = {}
): Promise<string> {
  const modelChain: ModelConfig[] = [
    { name: "gemini-3.1-pro-preview", client: "paid" },
    { name: "gemini-2.0-flash", client: "free" },
    { name: "gemini-1.5-flash", client: "free" },
    { name: "gemini-1.5-flash-8b", client: "free" }, // Extra safety
  ];

  for (const { name: modelName, client: clientType } of modelChain) {
    const client = clientType === "paid" ? paidGenAI : freeGenAI;
    
    // Skip if client for this tier isn't configured
    if (!client) {
      console.warn(`[Gemini] skipping tier ${clientType} (${modelName}): API key not provided.`);
      continue;
    }

    try {
      console.log(`[Gemini] Attempting ${clientType} tier request with ${modelName}...`);
      const model = client.getGenerativeModel({
        model: modelName,
        generationConfig: config,
        safetySettings: DEFAULT_SAFETY_SETTINGS,
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      if (!text) {
        throw new Error("Empty response from Gemini");
      }
      
      return text.trim();
    } catch (error: any) {
      const isQuotaError = 
        error.message?.includes("429") || 
        error.status === 429 || 
        error.message?.includes("quota") ||
        error.message?.includes("finishReason: OTHER"); // Sometimes quota manifests as OTHER

      if (isQuotaError) {
        console.warn(`[Gemini] ${clientType} tier (${modelName}) quota exceeded or blocked, falling back...`);
        continue; 
      }
      
      console.error(`[Gemini] Hard error on ${modelName}:`, error.message);
      // If it's the last model, we'll throw at the end, otherwise try next fallback
      if (modelName === modelChain[modelChain.length - 1].name) {
          throw error;
      }
    }
  }

  throw new Error("All Gemini tiers and models failed. Please check your API keys and quotas.");
}
