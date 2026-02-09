"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Loader2, Star, Check, FileDown, Pencil, RotateCcw } from "lucide-react";
import { Resume } from "@/app/types/database";
import { ResumeData } from "@/app/types/resume";
import EditableResume from "@/app/components/resume-converter/EditableResume";
import { downloadResume } from "@/app/lib/resume-api";
import { Heading, Text } from "@/app/components/Typography";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ResumeDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [resumeId, setResumeId] = useState<string>("");
  const [isEditingFileName, setIsEditingFileName] = useState(false);
  const [tempFileName, setTempFileName] = useState("");
  const fileNameInputRef = useRef<HTMLInputElement>(null);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    params.then(({ id }) => {
      setResumeId(id);
      loadResume(id);
    });
  }, []);

  const loadResume = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/resumes/${id}`);
      if (!response.ok) throw new Error("Failed to fetch resume");

      const data = await response.json();
      setResume(data);
      setIsFavorite(data.isFavorite);
      
      // Mark initial load as complete after a short delay
      setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 100);
    } catch (error) {
      console.error("Error loading resume:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveResume = async (
    data: ResumeData,
    hiddenSections: string[]
  ) => {
    try {
      setSaveStatus("saving");

      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: data,
          hiddenSections,
        }),
      });

      if (!response.ok) throw new Error("Failed to save resume");

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving resume:", error);
      setSaveStatus("idle");
    }
  };

  const handleDataChange = (data: ResumeData) => {
    if (!resume) return;

    setResume((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, resumeData: data };
      
      // Don't auto-save on initial load
      if (!isInitialLoadRef.current) {
        saveResume(data, prev.hiddenSections || []);
      }
      
      return updated;
    });
  };

  const handleHiddenSectionsChange = (sections: string[]) => {
    if (!resume) return;

    setResume((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, hiddenSections: sections };
      
      // Don't auto-save on initial load
      if (!isInitialLoadRef.current) {
        saveResume(prev.resumeData, sections);
      }
      
      return updated;
    });
  };

  const handleStartEditingFileName = () => {
    setTempFileName(resume?.name.replace(/\.pdf$/i, "") || "");
    setIsEditingFileName(true);
    setTimeout(() => fileNameInputRef.current?.focus(), 0);
  };

  const handleSaveFileName = async () => {
    if (!resume || !tempFileName.trim()) {
      setIsEditingFileName(false);
      return;
    }

    const newFileName = tempFileName.trim() + ".pdf";

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFileName }),
      });

      if (!response.ok) throw new Error("Failed to update file name");

      setResume((prev) => prev ? { ...prev, name: newFileName } : prev);
      setIsEditingFileName(false);
    } catch (error) {
      console.error("Error updating file name:", error);
      setIsEditingFileName(false);
    }
  };

  const handleCancelEditingFileName = () => {
    setIsEditingFileName(false);
  };

  const handleToggleFavorite = async () => {
    const newFavoriteValue = !isFavorite;

    // Optimistic update
    setIsFavorite(newFavoriteValue);

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: newFavoriteValue }),
      });

      if (!response.ok) {
        // Revert on error
        setIsFavorite(!newFavoriteValue);
        throw new Error("Failed to toggle favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleDownloadOriginal = () => {
    if (!resume?.originalPdf) return;

    try {
      // Convert base64 to blob
      const byteString = atob(resume.originalPdf.split(",")[1]);
      const mimeString = resume.originalPdf.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = resume.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading original PDF:", error);
    }
  };

  const handleDownloadFormatted = async () => {
    if (!resume || isDownloading) return;

    setIsDownloading(true);
    try {
      await downloadResume(
        resume.resumeData,
        resume.format,
        resume.name,
        resume.hiddenSections || []
      );
    } catch (error) {
      console.error("Failed to download formatted resume:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-[#3CBCEC]" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-semibold">Resume not found</h2>
        <button
          onClick={() => router.push("/resumes")}
          className="text-[#3CBCEC] hover:underline"
        >
          Go back to resumes
        </button>
      </div>
    );
  }

  return (
    <div className="flex pt-6 pl-6">
      <div className="flex flex-col gap-8 items-start w-full max-w-302.5">
        {/* Header */}
        <div className="flex flex-col gap-2 items-start w-full">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/resumes")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors -ml-2"
              title="Back to resumes"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Heading level={1}>Edit</Heading>
          </div>
        </div>

        {/* Content - Border container like PreviewStep */}
        <div className="flex-1 border border-[#e8e8e8] dark:border-zinc-700 flex flex-col min-h-183.5 bg-white dark:bg-zinc-900 relative max-w-[702px] w-full">
          {/* Top bar with filename and actions */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-[#e8e8e8] dark:border-zinc-700">
            <div
              className={`cursor-pointer relative group px-4 pr-8 py-2 border rounded-sm transition-all ${
                isEditingFileName
                  ? "ring-2 ring-[#3CBCEC] border-[#3CBCEC]"
                  : "border-[#d4d4d4] dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
              }`}
              onClick={() => !isEditingFileName && handleStartEditingFileName()}
            >
              {!isEditingFileName && (
                <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              {isEditingFileName ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={fileNameInputRef}
                    type="text"
                    value={tempFileName}
                    onChange={(e) => setTempFileName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveFileName();
                      if (e.key === "Escape") handleCancelEditingFileName();
                    }}
                    className="w-44 bg-transparent border-b border-[#3CBCEC] focus:outline-none text-[#18181b] dark:text-zinc-200 text-[12px] font-normal"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={handleCancelEditingFileName}
                      className="px-2 py-0.5 text-[10px] border border-gray-300 dark:border-zinc-600 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveFileName}
                      className="px-2 py-0.5 text-[10px] bg-[#3CBCEC] text-white rounded hover:bg-[#2da5cc] transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-[#18181b] dark:text-zinc-200 text-[12px] font-normal">
                  {resume.name.replace(/\.pdf$/i, "")}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {/* Save status indicator */}
              {saveStatus !== "idle" && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-400">
                  {saveStatus === "saving" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Saved</span>
                    </>
                  )}
                </div>
              )}

              {/* Favorite button */}
              <button
                onClick={handleToggleFavorite}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star
                  className={`w-5 h-5 ${
                    isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                  }`}
                />
              </button>

              {/* Download Original PDF */}
              <button
                onClick={handleDownloadOriginal}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                title="Download original PDF"
              >
                <FileDown className="w-5 h-5" />
                <span className="text-sm font-medium">Original</span>
              </button>

              {/* Download Formatted PDF */}
              <button
                onClick={handleDownloadFormatted}
                disabled={isDownloading}
                className="flex items-center gap-3 px-4 py-2 bg-black text-white rounded hover:bg-zinc-800 transition-colors disabled:opacity-75"
              >
                <span className="font-inconsolata font-semibold text-[14px] leading-5">
                  {isDownloading ? "Downloading..." : "Download"}
                </span>
                {isDownloading ? (
                  <Loader2 className="w-6 h-6 animate-spin -rotate-90" />
                ) : (
                  <Download className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Resume content */}
          <div className="flex-1 overflow-auto flex items-start justify-center">
            <EditableResume
              data={resume.resumeData}
              format={resume.format}
              onDataChange={handleDataChange}
              onHiddenSectionsChange={handleHiddenSectionsChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
