import { GoogleGenerativeAI, GenerativeModel, GenerationConfig, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const DEFAULT_SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export async function runSmartGemini(
  prompt: string | any[],
  config: GenerationConfig = {}
): Promise<string> {
  const models = ["gemini-2.5-flash", "gemini-1.5-flash"];
  
  for (const modelName of models) {
    try {
      console.log(`[Gemini] Attempting request with ${modelName}...`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: config,
        safetySettings: DEFAULT_SAFETY_SETTINGS,
      });

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error: any) {
      if (error.message?.includes("429") || error.status === 429 || error.message?.includes("quota")) {
        console.warn(`[Gemini] ${modelName} quota exceeded, falling back...`);
        continue; // Try the next model
      }
      throw error; // If it's not a quota issue, re-throw
    }
  }

  throw new Error("All Gemini models failed (likely quota exceeded on all available models)");
}
