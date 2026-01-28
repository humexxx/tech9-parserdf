import { ResumeData } from "@/app/types/resume";

const getMockResumeData = (fileName: string): ResumeData => ({
  name: "[Insert Name]",
  location: "Location:",
  linkedIn: "LinkedIn Profile:",
  summary: "[Insert brief 3-4 sentence summary about the candidate with an emphasis on the client's requirements]",
  experience: [
    {
      company: "[Most Recent Company Name]",
      location: "Location",
      title: "Job Title",
      period: "MONTH 20XX - PRESENT",
      description: "[Insert 4-5 bullet points detailing a problem, action, and result of that action]",
      technologies: "[Insert 5-6 main technologies you used during your time here]"
    },
    {
      company: "Company Name",
      location: "Location",
      title: "Job Title",
      period: "MONTH 20XX - PRESENT",
      description: "[Insert 4-5 bullet points detailing a problem, action, and result of that action]",
      technologies: "[Insert 5-6 main technologies you used during your time here]"
    }
  ],
  education: [
    {
      school: "[School Name]",
      location: "Location",
      degree: "Degree",
      period: "MONTH 20XX - MONTH 20XX"
    }
  ],
  awards: "[Insert brief 3-4 sentence summary about the candidate with an emphasis on the client's requirements]",
  projects: "[Insert project details here]",
  skills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"]
});

export async function processResumes(
  files: File[],
  formats: Record<string, string>
): Promise<{ fileName: string; data: ResumeData }[]> {
  // TODO: Implement LLM parsing logic here
  // This will send the files to an API endpoint that processes them with LLM
  // and returns the structured ResumeData
  
  // For now, return mock data
  return files.map(file => ({
    fileName: file.name,
    data: getMockResumeData(file.name)
  }));
}

export async function downloadResume(
  resumeData: ResumeData,
  format: string,
  fileName: string
): Promise<void> {
  // TODO: Implement PDF generation and download logic here
  // This will convert the ResumeData to a formatted PDF
  // and trigger a download
  
  throw new Error("Not implemented yet");
}
