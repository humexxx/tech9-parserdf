import { CompletionOptions } from "@/app/types/llm";

const GROK_API_KEY = process.env.GROK_API_KEY;
const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

/**
 * Generic service to interact with Grok AI API
 * This service is agnostic to business logic and handles only the API communication
 */
export async function getGrokCompletion(options: CompletionOptions): Promise<string> {
  if (!GROK_API_KEY) {
    throw new Error("GROK_API_KEY is not configured in environment variables");
  }

  const { messages, model = "grok-beta", temperature = 0.1, maxTokens = 16000 } = options;

  try {
    // Transform unified messages to Grok format if needed
    // Grok expects standard OpenAI-like message format
    const grokMessages = messages.map(msg => {
      // If parts are present (from unified format), transform to Grok content
      if (msg.parts) {
        const content = msg.parts.map(part => {
          if (part.text) return { type: "text", text: part.text };
          if (part.image_url) return { type: "image_url", image_url: part.image_url };
          if (part.inlineData) {
            // Transform common inlineData to image_url for Grok compatibility if needed
            return { 
              type: "image_url", 
              image_url: { 
                url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` 
              } 
            };
          }
          return null;
        }).filter(Boolean);
        
        return {
          role: msg.role === "model" ? "assistant" : msg.role,
          content
        };
      }
      
      // Standard content string
      return {
        role: msg.role === "model" ? "assistant" : msg.role,
        content: msg.content
      };
    });

    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: grokMessages,
        temperature,
        max_tokens: maxTokens
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Grok API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from Grok API");
    }

    return content;
  } catch (error) {
    console.error("Error calling Grok API:", error);
    throw error;
  }
}
