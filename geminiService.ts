
import { GoogleGenAI, Type } from "@google/genai";
import { MediaItem, MediaType } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRecommendations = async (
  prompt: string,
  selectedGenres: string[]
): Promise<MediaItem[]> => {
  const genreContext = selectedGenres.length > 0 
    ? `The user is specifically interested in these genres: ${selectedGenres.join(", ")}.` 
    : "";

  const fullPrompt = `
    Find 6 highly relevant movies or TV shows based on: "${prompt}".
    Context: ${genreContext}
    
    IMAGE & VIDEO GUIDELINES:
    1. POSTER: Primarily use the googleSearch tool to find official posters from IMDb (imdb.com).
    2. TRAILER: Use the googleSearch tool to find the official YouTube trailer.
       CRITICAL: 'trailerUrl' MUST be a direct watch link.
    3. CAST & DIRECTOR PHOTOS: Use the googleSearch tool to find official headshots or high-quality portraits for the director and each main cast member.
       - 'photoUrl' should be a direct link to the image.
       - If no specific photo is found, use null.
    4. IMAGE URL: 'posterUrl' should be a direct link to the high-resolution poster image.
    5. SOURCE PAGE: 'posterSourceUrl' should be the direct IMDb title page URL.
    6. CREDIT: Set 'posterSource' to "IMDb".
    7. FLEXIBILITY: Prioritize content relevance. If assets are missing, use null.

    Return the data in the specified JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              type: { type: Type.STRING, enum: Object.values(MediaType) },
              year: { type: Type.STRING },
              genres: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING },
              reviewScore: { type: Type.NUMBER },
              reviewSnippet: { type: Type.STRING },
              streamingPlatforms: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    url: { type: Type.STRING }
                  }
                }
              },
              posterUrl: { type: Type.STRING },
              posterSource: { type: Type.STRING },
              posterSourceUrl: { type: Type.STRING },
              cast: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    photoUrl: { type: Type.STRING, nullable: true }
                  },
                  required: ["name"]
                } 
              },
              director: { 
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  photoUrl: { type: Type.STRING, nullable: true }
                },
                required: ["name"]
              },
              duration: { type: Type.STRING },
              fullReason: { type: Type.STRING },
              trailerUrl: { type: Type.STRING, description: "Direct YouTube watch URL" }
            },
            required: [
              "title", "type", "summary", "streamingPlatforms", "cast", 
              "director", "duration"
            ]
          }
        }
      }
    });

    const text = response.text || "[]";
    const results = JSON.parse(text);
    return results.map((item: any, index: number) => ({
      ...item,
      id: `rec-${index}-${Date.now()}`
    }));
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};
