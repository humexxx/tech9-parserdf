"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Download, AlertCircle, RefreshCw } from "lucide-react";
import { FilePreview, ResumeData } from "@/app/types/resume";
import { processResume } from "@/app/lib/resume-api";
import EditableResume from "./EditableResume";

interface PreviewStepProps {
  files: File[];
  selectedFormats?: Record<string, string>;
  onEdit?: () => void;
  onDownload: (resumeData: ResumeData, fileName: string) => Promise<void>;
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
  const [isDownloading, setIsDownloading] = useState(false);
  const processedFilesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const loadResumes = async () => {
      const filesToProcess = files.filter(f => !processedFilesRef.current.has(f.name));

      if (filesToProcess.length === 0) return;

      filesToProcess.forEach(f => processedFilesRef.current.add(f.name));

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        const format = selectedFormats?.[file.name] || "skill-at-top";
        const originalIndex = files.findIndex(f => f.name === file.name);

        if (originalIndex === -1) continue;

        try {
          const data = await processResume(file, format);

          setFilePreviews(prev => {
            const updated = [...prev];
            if (updated[originalIndex]) {
              updated[originalIndex] = {
                ...updated[originalIndex],
                status: "completed",
                data: data
              };
            }
            return updated;
          });
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          // Update state with error
          setFilePreviews(prev => {
            const updated = [...prev];
            if (updated[originalIndex]) {
              updated[originalIndex] = {
                ...updated[originalIndex],
                status: "error",
                errorMessage: error instanceof Error ? error.message : "Failed to process resume"
              };
            }
            return updated;
          });
        }
      }
    };

    loadResumes();
  }, [files]);

  useEffect(() => {
    if (!selectedFormats) return;

    setFilePreviews(prev => prev.map(fp => ({
      ...fp,
      format: selectedFormats[fp.fileName] || fp.format
    })));
  }, [selectedFormats]);

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

  const handleDownload = async () => {
    if (!selectedFile?.data || isDownloading) return;

    setIsDownloading(true);
    try {
      await onDownload(selectedFile.data, selectedFile.fileName);
    } catch (error) {
      console.error("Failed to download resume:", error);
    } finally {
      setIsDownloading(false);
    }
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
            className={`w-56 px-6 py-3 border flex items-center justify-start gap-2 transition-all ${filePreview.status === "loading"
              ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
              : selectedFileIndex === index
                ? "bg-[rgba(62,190,237,0.18)] dark:bg-[rgba(62,190,237,0.1)] border-[#3CBCEC]"
                : filePreview.status === "error"
                  ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30"
                  : "bg-[#f9f9f9] dark:bg-zinc-900 border-[#d4d4d4] dark:border-zinc-700"
              }`}
          >
            {filePreview.status === "loading" && (
              <Loader2 className="w-4 h-4 animate-spin text-[#3CBCEC]" />
            )}
            {filePreview.status === "error" && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span className={`font-inconsolata font-bold text-[12px] leading-4 truncate ${filePreview.status === "loading"
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
            disabled={isDownloading}
            className={`absolute top-4 right-4 p-2 text-white rounded-full transition-colors z-10 ${isDownloading
              ? "bg-[#2da5cc]"
              : "bg-[#3CBCEC] hover:bg-[#2da5cc]"
              }`}
            title={isDownloading ? "Generating PDF..." : "Download Resume"}
          >
            {isDownloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
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
          ) : selectedFile?.status === "error" ? (
            <div className="flex flex-col items-center gap-4 mt-20 text-center max-w-lg px-6">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-inconsolata font-bold text-xl text-gray-800 dark:text-zinc-200">
                Parsing Failed
              </h3>
              <p className="font-inconsolata text-gray-600 dark:text-zinc-400">
                {selectedFile.errorMessage || "There was an error processing this resume."}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-md transition-colors text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
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
