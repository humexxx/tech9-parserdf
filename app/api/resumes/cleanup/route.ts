import { NextResponse } from 'next/server';
import { resumeService } from '@/app/lib/services/resume-service';

/**
 * POST /api/resumes/cleanup
 * Trigger cleanup of old resumes (90+ days, non-favorited)
 */
export async function POST() {
  try {
    const deletedCount = await resumeService.cleanupOldResumes();
    return NextResponse.json({ 
      success: true, 
      deletedCount 
    });
  } catch (error) {
    console.error('Error cleaning up resumes:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup resumes' },
      { status: 500 }
    );
  }
}
