import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, NameStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeUsername = async (username: string, style: NameStyle): Promise<AnalysisResult> => {
  try {
    const styleContext = style === 'RANDOM' ? '' : `The user selected the "${style}" style.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `I have generated a random username using a dice roll mechanic: "${username}".
      ${styleContext}
      
      Please analyze this username.
      1. Give it a "Vibe" (e.g., "Chaotic Good", "Cyberpunk Glitch", "Ancient Rune") - keep it relevant to the ${style} style if specified.
      2. Give it a "Coolness Score" from 1 to 100.
      3. Write a short, funny, 1-sentence bio for the person who would use this name.
      4. Suggest 3 alternative usernames that are similar but slightly more readable or stylish, keeping the ${style} theme in mind.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vibe: { type: Type.STRING },
            score: { type: Type.NUMBER },
            bio: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["vibe", "score", "bio", "suggestions"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback for demo purposes if API fails or key is missing
    return {
      vibe: "Mystery Signal",
      score: 50,
      bio: "A username so enigmatic, even the AI is confused.",
      suggestions: [`${username}_x`, `TheReal${username}`, `Dr_${username}`]
    };
  }
};