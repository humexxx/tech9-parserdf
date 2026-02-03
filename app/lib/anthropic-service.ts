import Anthropic from '@anthropic-ai/sdk';
import { CompletionOptions } from "@/app/types/llm";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

/**
 * Service to interact with Anthropic Claude API
 */
export async function getAnthropicCompletion(options: CompletionOptions): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured in environment variables");
  }

  const { messages, model = "claude-haiku-4-5", temperature = 0, maxTokens = 4096 } = options;

  try {
    const client = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });

    let systemPrompt: string | undefined = undefined;
    const anthropicMessages: Anthropic.MessageParam[] = [];

    // Extract system message
    const systemMessage = messages.find(m => m.role === "system");
    if (systemMessage) {
      if (systemMessage.content) {
        systemPrompt = systemMessage.content;
      } else if (systemMessage.parts && systemMessage.parts.length > 0) {
        systemPrompt = systemMessage.parts.map(p => p.text).join("\n");
      }
    }

    const userMessage = messages.find(m => m.role === "user");

    if (userMessage) {
      const content: Anthropic.ContentBlockParam[] = [];

      if (userMessage.content) {
        content.push({ type: "text", text: userMessage.content });
      }

      if (userMessage.parts) {
        for (const part of userMessage.parts) {
          if (part.text) {
            content.push({ type: "text", text: part.text });
          }
          
          if (part.inlineData) {
            const { mimeType, data } = part.inlineData;
            
            if (mimeType === "application/pdf") {
              content.push({
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: data
                }
              });
            } else if (mimeType.startsWith("image/")) {
               const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
               if (validImageTypes.includes(mimeType as typeof validImageTypes[number])) {
                   content.push({
                       type: "image",
                       source: {
                           type: "base64",
                           media_type: mimeType as typeof validImageTypes[number],
                           data: data
                       }
                   });
               } else {
                   console.warn(`Unsupported image type for Anthropic: ${mimeType}`);
               }
            } else {
                console.warn(`Unsupported mime type for Anthropic: ${mimeType}`);
            }
          }
        }
      }

      if (content.length > 0) {
        anthropicMessages.push({
          role: "user",
          content: content
        });
      }
    }

    if (anthropicMessages.length === 0) {
         throw new Error("No user content found for Anthropic generation");
    }

    const response = await client.messages.create({
      model: model,
      max_tokens: maxTokens,
      temperature: temperature,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    // Extract text from response
    if (response.content && response.content.length > 0) {
        const textBlocks = response.content.filter(b => b.type === 'text');
        if (textBlocks.length > 0) {
            return textBlocks.map(b => (b as Anthropic.TextBlock).text).join("\n");
        }
    }
    
    throw new Error("No text response received from Anthropic");

  } catch (error) {
    console.error("Error calling Anthropic SDK:", error);
    throw error;
  }
}
