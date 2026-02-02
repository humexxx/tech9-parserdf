/**
 * Common types for LLM services
 */

export interface LLMMessage {
  role: "system" | "user" | "assistant" | "model";
  content?: string;
  parts?: Array<{
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string;
    };
    image_url?: {
      url: string;
    };
  }>;
}

export interface CompletionOptions {
  messages: LLMMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number; // Normalized from max_tokens / maxOutputTokens
}
