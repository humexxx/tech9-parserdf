import { NextRequest, NextResponse } from "next/server";
import { getGrokCompletion } from "@/app/lib/grok-service";
import { getGeminiCompletion } from "@/app/lib/gemini-service";
import { getAnthropicCompletion } from "@/app/lib/anthropic-service";
import { 
  validateFile, 
  getMimeType, 
  constructGrokMessages, 
  constructGeminiMessages,
  constructAnthropicMessages,
  parseResponse,
  normalizeError 
} from "@/app/lib/resume-parser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    const validationError = validateFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const url = new URL(request.url);
    const provider = url.searchParams.get("provider") || "anthropic";

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = buffer.toString('base64');
    const mimeType = file.type || getMimeType(file.name);

    let content = "";

    if (provider === "grok") {
      const messages = constructGrokMessages(file.name, mimeType, base64File);
      content = await getGrokCompletion({ messages, temperature: 0.1 });
    } else if (provider === "gemini") {
        const messages = constructGeminiMessages(file.name, mimeType, base64File);
        content = await getGeminiCompletion({ messages, temperature: 0.1 });
    } else {
        const messages = constructAnthropicMessages(file.name, mimeType, base64File);
        content = await getAnthropicCompletion({ messages, temperature: 0.1 });
    }

    const resumeData = parseResponse(content);

    return NextResponse.json({
      success: true,
      data: resumeData
    });

  } catch (error) {
    console.error("Error in parse-resume API:", error);
    
    const errorMessage = normalizeError(error);
    
    return NextResponse.json(
      { 
        error: "Failed to parse resume",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
