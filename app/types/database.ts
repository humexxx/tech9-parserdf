import { Resume, NewResume } from '../db/schema';
import { ResumeData } from './resume';

// Database types
export type { Resume, NewResume };

// Input types for API operations
export interface CreateResumeInput {
  name: string;
  resumeData: ResumeData;
  originalPdf: string; // base64 encoded
  format: string;
  hiddenSections?: string[];
  isFavorite?: boolean;
}

export interface UpdateResumeInput {
  name?: string;
  resumeData?: ResumeData;
  originalPdf?: string;
  format?: string;
  hiddenSections?: string[];
  isFavorite?: boolean;
}

// Response types
export interface ResumesListResponse {
  favorites: Resume[];
  recent: Resume[];
}
