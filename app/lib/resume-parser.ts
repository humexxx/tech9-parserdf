import { RESUME_PARSING_PROMPT } from "@/app/lib/prompts";
import { LLMMessage } from "@/app/types/llm";

export function validateFile(file: File | null): string | null {
  if (!file) {
    return "No file provided";
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword"
  ];

  if (!allowedTypes.includes(file.type)) {
    return "Invalid file type. Only PDF and DOCX files are supported.";
  }

  return null;
}

export function getMimeType(fileName: string): string {
  return fileName.endsWith('.pdf') ? 'application/pdf' : 
         fileName.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
         'application/octet-stream';
}

export function constructGrokMessages(fileName: string, mimeType: string, base64File: string): LLMMessage[] {
  return [
    {
      role: "system",
      content: RESUME_PARSING_PROMPT
    },
    {
      role: "user",
      parts: [
        {
          text: `Parse this resume file: ${fileName}`
        },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64File
          }
        }
      ]
    }
  ];
}

export function constructGeminiMessages(fileName: string, mimeType: string, base64File: string): LLMMessage[] {
  return [
    {
      role: "user",
      parts: [
        {
          text: `${RESUME_PARSING_PROMPT}\n\nParse this resume file: ${fileName}`
        },
        {
          inlineData: {
            mimeType,
            data: base64File
          }
        }
      ]
    }
  ];
}

export function constructAnthropicMessages(fileName: string, mimeType: string, base64File: string): LLMMessage[] {
  return [
    {
      role: "system",
      content: RESUME_PARSING_PROMPT
    },
    {
      role: "user",
      parts: [
        {
          text: `Parse this resume file: ${fileName}`
        },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64File
          }
        }
      ]
    }
  ];
}

export function parseResponse(content: string) {
  const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
  const jsonString = jsonMatch ? jsonMatch[1] : content;
  return JSON.parse(jsonString.trim());
}

export function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;

    // Handle common API errors
    if (message.includes("401") || message.includes("API key not valid") || message.includes("UNAUTHENTICATED")) {
      return "Authentication failed. Please check the API configuration.";
    }
    
    if (message.includes("403") || message.includes("PERMISSION_DENIED")) {
      return "Access denied. Please check your API permissions.";
    }
    
    if (message.includes("429") || message.includes("RESOURCE_EXHAUSTED")) {
      return "Service is busy. Please try again in a moment.";
    }

    if (message.includes("400") || message.includes("INVALID_ARGUMENT")) {
      return "Invalid request. The file format might not be supported or is corrupted.";
    }
    
    // Clean up generic JSON error dumps if they slip through
    if (message.includes("{") && message.includes("}")) {
       try {
         // Attempt to extract helpful message from JSON string if possible, otherwise generic
         if (message.includes("API key not valid")) return "Invalid API Key configuration.";
         return "An error occurred with the AI service.";
       } catch {
         return "An unexpected error occurred.";
       }
    }

    return message;
  }
  
  return "An unexpected error occurred.";
}
