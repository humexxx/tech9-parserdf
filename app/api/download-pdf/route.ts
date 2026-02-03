import { NextRequest, NextResponse } from "next/server";
import { generateResumeHTML } from "@/app/lib/templates/resume-pdf-template";
import { env } from "@/app/lib/env";
import { ResumeData } from "@/app/types/resume";

interface DownloadPDFRequest {
  resumeData: ResumeData;
  format: string;
  fileName: string;
  hiddenSections?: string[];
}

// URL to the Chromium binary package hosted in /public
// Use production URL if available, otherwise use the current deployment URL
const CHROMIUM_PACK_URL = env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}/chromium-pack.tar`
  : env.VERCEL_URL
  ? `https://${env.VERCEL_URL}/chromium-pack.tar`
  : "https://github.com/humexxx/tech9-parserdf/raw/refs/heads/main/public/chromium-pack.tar";

// Cache the Chromium executable path to avoid re-downloading on subsequent requests
let cachedExecutablePath: string | null = null;
let downloadPromise: Promise<string> | null = null;

/**
 * Downloads and caches the Chromium executable path.
 * Uses a download promise to prevent concurrent downloads.
 */
async function getChromiumPath(): Promise<string> {
  // Return cached path if available
  if (cachedExecutablePath) return cachedExecutablePath;

  // Prevent concurrent downloads by reusing the same promise
  if (!downloadPromise) {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    downloadPromise = chromium
      .executablePath(CHROMIUM_PACK_URL)
      .then((path) => {
        cachedExecutablePath = path;
        return path;
      })
      .catch((error) => {
        console.error("Failed to get Chromium path:", error);
        downloadPromise = null;
        throw error;
      });
  }

  return downloadPromise;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as DownloadPDFRequest;
    const { resumeData, format, fileName, hiddenSections = [] } = body;

    if (!resumeData || !format || !fileName) {
      return NextResponse.json(
        { error: "resumeData, format, and fileName are required" },
        { status: 400 }
      );
    }

    // Configure browser based on environment
    const isVercel = !!env.VERCEL_ENV;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let puppeteer: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let launchOptions: any = {
      headless: true,
    };

    if (isVercel) {
      // Vercel: Use puppeteer-core with downloaded Chromium binary
      const chromium = (await import("@sparticuz/chromium-min")).default;
      puppeteer = await import("puppeteer-core");
      const executablePath = await getChromiumPath();
      launchOptions = {
        ...launchOptions,
        args: chromium.args,
        executablePath,
      };
    } else {
      // Local: Use regular puppeteer with bundled Chromium
      puppeteer = await import("puppeteer");
    }

    // Launch browser
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Generate HTML and set content
    const htmlContent = generateResumeHTML(resumeData, format, hiddenSections);
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '18mm',
        right: '16mm',
        bottom: '16mm',
        left: '16mm'
      }
    });

    await browser.close();

    // Create filename with proper encoding for non-ASCII characters
    const cleanFileName = fileName.replace(/\.[^/.]+$/, ""); // Remove extension
    const pdfFileName = `${cleanFileName.replace(/\s+/g, '_')}_Resume.pdf`;
    const encodedFilename = encodeURIComponent(pdfFileName);

    // Return PDF as response
    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
      },
    });

  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate PDF",
        details: env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}
