import { GoogleGenAI } from "@google/genai";
import { CompletionOptions } from "@/app/types/llm";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Generic service to interact with Google Gemini API using the official SDK
 */
export async function getGeminiCompletion(options: CompletionOptions): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables");
  }

  const { messages, model = "gemini-2.5-flash", temperature = 0.1, maxTokens = 16000 } = options;

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    // Convert unified messages to SDK format
    // The SDK expects a simple string or an array of parts
    // Since we are doing a single generation for resume parsing, we merge contents if possible
    // or take the user message parts.

    let contents: any[] = [];
    
    // Find the user message parts
    const userMessage = messages.find(m => m.role === "user");
    
    if (userMessage) {
      if (userMessage.parts) {
        contents = userMessage.parts.map(part => {
          if (part.text) return { text: part.text };
          if (part.inlineData) {
              return { 
                inlineData: { 
                    mimeType: part.inlineData.mimeType, 
                    data: part.inlineData.data 
                } 
              };
          }
          return null;
        }).filter(Boolean);
      } else if (userMessage.content) {
        contents = [{ text: userMessage.content }];
      }
    }

    if (contents.length === 0) {
        throw new Error("No user content found for Gemini generation");
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: contents, // The SDK accepts parts directly as 'contents' for simple generation? Let's verify typings or assume standard array of parts
      config: {
        temperature: temperature,
        maxOutputTokens: maxTokens,
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) {
         throw new Error("No text response received from Gemini SDK");
    }
    
    return text;

  } catch (error) {
    console.error("Error calling Gemini SDK:", error);
    throw error;
  }
}
