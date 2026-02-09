export interface ResumeData {
  name: string;
  location: string;
  linkedIn: string;
  summary: string[];
  experience: Array<{
    company: string;
    location: string;
    title: string;
    period: string;
    description: string;
    technologies: string;
  }>;
  education: Array<{
    school: string;
    location: string;
    degree: string;
    period: string;
  }>;
  awards: string;
  projects: string;
  skills: string[];
}

export interface FilePreview {
  fileName: string;
  originalFileName?: string; // Keep track of original file name for file lookup
  status: "loading" | "completed" | "error";
  format: string;
  data?: ResumeData;
  errorMessage?: string;
  hiddenSections?: string[];
  resumeId?: string; // ID of saved resume in database
}


export type EditableSection = "name" | "location" | "linkedIn" | "summary" | "skills" | "experience" | "education" | "awards" | "projects" | null;
