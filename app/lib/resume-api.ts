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

export async function processResume(
  file: File,
  format: string
): Promise<ResumeData> {
  try {
    // Create FormData to send file to API
    const formData = new FormData();
    formData.append('file', file);

    // Call the parse-resume API endpoint
    const response = await fetch('/api/parse-resume', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to parse resume');
    }

    const result = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error('Invalid response from parse API');
    }

    return result.data;
  } catch (error) {
    console.error('Error processing resume:', error);
    throw error;
  }
}

export async function processResumes(
  files: File[],
  formats: Record<string, string>,
  onProgress?: (fileName: string, data: ResumeData, index: number) => void
): Promise<{ fileName: string; data: ResumeData }[]> {
  const results: { fileName: string; data: ResumeData }[] = [];
  
  // Process files one by one
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const format = formats[file.name] || "skill-at-top";
    
    const data = await processResume(file, format);
    
    results.push({
      fileName: file.name,
      data
    });
    
    // Call progress callback if provided
    if (onProgress) {
      onProgress(file.name, data, i);
    }
  }
  
  return results;
}

export async function downloadResume(
  resumeData: ResumeData,
  format: string,
  fileName: string,
  hiddenSections: string[] = []
): Promise<void> {
  try {
    // Make POST request to PDF generation API
    const response = await fetch('/api/download-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData,
        format,
        fileName,
        hiddenSections,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate PDF');
    }

    // Get the PDF blob from response
    const blob = await response.blob();

    // Create a download link and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace(/\.[^/.]+$/, "")}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading resume:', error);
    throw error;
  }
}
