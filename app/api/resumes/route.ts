import { NextRequest, NextResponse } from 'next/server';
import { resumeService } from '@/app/lib/services/resume-service';
import { CreateResumeInput } from '@/app/types/database';

/**
 * GET /api/resumes
 * Fetch all resumes (favorites + recent)
 */
export async function GET() {
  try {
    const resumes = await resumeService.getAllResumes();
    return NextResponse.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/resumes
 * Create or update a resume
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...input } = body as CreateResumeInput & { id?: string };

    const resume = await resumeService.saveResume(input, id);
    return NextResponse.json(resume);
  } catch (error) {
    console.error('Error saving resume:', error);
    return NextResponse.json(
      { error: 'Failed to save resume' },
      { status: 500 }
    );
  }
}
