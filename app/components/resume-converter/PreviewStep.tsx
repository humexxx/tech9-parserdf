"use client";

import { useState, useEffect } from "react";
import { Loader2, Download } from "lucide-react";
import { FilePreview, ResumeData } from "@/app/types/resume";
import { processResume } from "@/app/lib/resume-api";
import EditableResume from "./EditableResume";

interface PreviewStepProps {
  files: File[];
  selectedFormats?: Record<string, string>;
  onEdit?: () => void;
  onDownload?: (resumeData: ResumeData, fileName: string) => Promise<void>;
}

export default function PreviewStep({ files, selectedFormats, onDownload }: PreviewStepProps) {
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>(() => 
    files.map(file => ({
      fileName: file.name,
      status: "loading" as const,
      format: selectedFormats?.[file.name] || "skill-at-top",
    }))
  );
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  useEffect(() => {
    // Process files one by one
    const loadResumes = async () => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const format = selectedFormats?.[file.name] || "skill-at-top";
        
        // Process single resume
        const data = await processResume(file, format);
        
        // Update state immediately after each file is processed
        setFilePreviews(prev => {
          const updated = [...prev];
          updated[i] = { 
            ...updated[i], 
            status: "completed",
            data: data
          };
          return updated;
        });
      }
    };

    loadResumes();
  }, [files, selectedFormats]);

  const selectedFile = filePreviews[selectedFileIndex];

  const handleDataChange = (data: ResumeData) => {
    // Update the file preview data when user edits
    setFilePreviews(prev => {
      const updated = [...prev];
      updated[selectedFileIndex] = {
        ...updated[selectedFileIndex],
        data
      };
      return updated;
    });
  };

  const handleDownload = () => {
    console.log("Downloading resume:", selectedFile?.fileName);
    onDownload?.(selectedFile!.data!, selectedFile!.fileName);
  };

  const allCompleted = filePreviews.every(fp => fp.status === "completed");

  return (
    <div className="flex gap-6 w-full max-w-360">
      {/* Left side - File tabs */}
      <div className="flex flex-col gap-2.5 w-auto shrink-0">
        {filePreviews.map((filePreview, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedFileIndex(index);
            }}
            disabled={filePreview.status === "loading"}
            className={`w-56 px-6 py-3 border flex items-center justify-start gap-2 transition-all ${
              filePreview.status === "loading"
                ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
                : selectedFileIndex === index
                ? "bg-[rgba(62,190,237,0.18)] dark:bg-[rgba(62,190,237,0.1)] border-[#3CBCEC]"
                : "bg-[#f9f9f9] dark:bg-zinc-900 border-[#d4d4d4] dark:border-zinc-700"
            }`}
          >
            {filePreview.status === "loading" && (
              <Loader2 className="w-4 h-4 animate-spin text-[#3CBCEC]" />
            )}
            <span className={`font-inconsolata font-bold text-[12px] leading-4 truncate ${
              filePreview.status === "loading"
                ? "text-gray-400 dark:text-zinc-600"
                : selectedFileIndex === index 
                ? "text-black dark:text-zinc-200" 
                : "text-black dark:text-zinc-200"
            }`}>
              {filePreview.fileName}
            </span>
          </button>
        ))}
      </div>

      {/* Middle - Preview */}
      <div className="flex-1 border border-[#e8e8e8] dark:border-zinc-700 flex flex-col min-h-183.5 bg-white dark:bg-zinc-900 relative">
        {/* Download button - top right */}
        {selectedFile?.status === "completed" && allCompleted && (
          <button
            onClick={handleDownload}
            className="absolute top-4 right-4 p-2 bg-[#3CBCEC] hover:bg-[#2da5cc] text-white rounded-full transition-colors z-10"
            title="Download Resume"
          >
            <Download className="w-5 h-5" />
          </button>
        )}

        <div className="flex-1 overflow-auto flex items-start justify-center p-4">
          {selectedFile?.status === "loading" ? (
            <div className="flex flex-col items-center gap-4 mt-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#3CBCEC]" />
              <p className="font-inconsolata text-[16px] text-[#52525b] dark:text-zinc-500">
                Processing {selectedFile.fileName}...
              </p>
            </div>
          ) : selectedFile?.data ? (
            <EditableResume 
              data={selectedFile.data}
              format={selectedFile.format}
              onDataChange={handleDataChange}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
