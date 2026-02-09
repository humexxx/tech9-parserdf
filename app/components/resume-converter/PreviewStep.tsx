"use client";

import { useState, useEffect, useRef } from "react";
import {
  Loader2,
  Download,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  Pencil,
  Star,
  Check,
} from "lucide-react";
import { FilePreview, ResumeData } from "@/app/types/resume";
import { processResume } from "@/app/lib/resume-api";
import EditableResume from "./EditableResume";

interface PreviewStepProps {
  files: File[];
  selectedFormats?: Record<string, string>;
  onEdit?: () => void;
  onDownload: (resumeData: ResumeData, fileName: string, hiddenSections: string[]) => Promise<void>;
}

export default function PreviewStep({
  files,
  selectedFormats,
  onDownload,
}: PreviewStepProps) {
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>(() =>
    files.map((file) => ({
      fileName: file.name,
      originalFileName: file.name,
      status: "loading" as const,
      format: selectedFormats?.[file.name] || "skill-at-top",
    })),
  );
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [editableFileNames, setEditableFileNames] = useState<
    Record<number, string>
  >({});
  const [isEditingFileName, setIsEditingFileName] = useState(false);
  const [tempFileName, setTempFileName] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [originalFiles, setOriginalFiles] = useState<Record<string, File>>({});
  const [favoriteStatus, setFavoriteStatus] = useState<Record<number, boolean>>({});
  const processedFilesRef = useRef<Set<string>>(new Set());
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const resumeIdsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(event.target as Node)
      ) {
        setShowDownloadMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadResumes = async () => {
      const filesToProcess = files.filter(
        (f) => !processedFilesRef.current.has(f.name),
      );

      if (filesToProcess.length === 0) return;

      filesToProcess.forEach((f) => processedFilesRef.current.add(f.name));

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        const format = selectedFormats?.[file.name] || "skill-at-top";
        const originalIndex = files.findIndex((f) => f.name === file.name);

        if (originalIndex === -1) continue;

        try {
          const data = await processResume(file, format);

          // Store original file for PDF encoding
          setOriginalFiles((prev) => ({ ...prev, [file.name]: file }));

          setFilePreviews((prev) => {
            const updated = [...prev];
            if (updated[originalIndex]) {
              updated[originalIndex] = {
                ...updated[originalIndex],
                originalFileName: file.name,
                status: "completed",
                data: data,
              };
            }
            return updated;
          });

          // Auto-save on initial load
          if (data) {
            await saveResume(file.name, data, format, [], file);
          }
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          // Update state with error
          setFilePreviews((prev) => {
            const updated = [...prev];
            if (updated[originalIndex]) {
              updated[originalIndex] = {
                ...updated[originalIndex],
                status: "error",
                errorMessage:
                  error instanceof Error
                    ? error.message
                    : "Failed to process resume",
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

    setFilePreviews((prev) =>
      prev.map((fp) => ({
        ...fp,
        format: selectedFormats[fp.fileName] || fp.format,
      })),
    );
  }, [selectedFormats]);

  const selectedFile = filePreviews[selectedFileIndex];

  // Convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Save resume to database
  const saveResume = async (
    fileName: string,
    data: ResumeData,
    format: string,
    hiddenSections: string[],
    originalFile: File,
    resumeId?: string
  ) => {
    try {
      setSaveStatus("saving");
      const pdfBase64 = await fileToBase64(originalFile);

      // Use ref to get the most up-to-date resumeId
      const currentResumeId = resumeId || resumeIdsRef.current[fileName];

      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentResumeId,
          name: fileName,
          resumeData: data,
          originalPdf: pdfBase64,
          format,
          hiddenSections,
          isFavorite: currentResumeId ? undefined : false,
        }),
      });

      if (!response.ok) throw new Error("Failed to save resume");

      const savedResume = await response.json();

      // Store resumeId in ref for immediate access
      resumeIdsRef.current[fileName] = savedResume.id;

      // Update file preview with resume ID
      setFilePreviews((prev) => {
        const updated = [...prev];
        const fileIndex = prev.findIndex((fp) => fp.fileName === fileName);
        if (fileIndex !== -1) {
          updated[fileIndex] = {
            ...updated[fileIndex],
            resumeId: savedResume.id,
          };
        }
        return updated;
      });

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving resume:", error);
      setSaveStatus("idle");
    }
  };

  const handleDataChange = (data: ResumeData) => {
    const currentFile = filePreviews[selectedFileIndex];
    const originalFile = originalFiles[currentFile?.originalFileName || currentFile?.fileName];
    
    // Update the file preview data when user edits
    setFilePreviews((prev) => {
      const updated = [...prev];
      updated[selectedFileIndex] = {
        ...updated[selectedFileIndex],
        data,
      };
      return updated;
    });

    // Save immediately after data change
    if (currentFile?.resumeId && originalFile) {
      const currentResumeId = currentFile.resumeId || resumeIdsRef.current[currentFile.originalFileName || currentFile.fileName];
      saveResume(
        currentFile.fileName,
        data,
        currentFile.format,
        currentFile.hiddenSections || [],
        originalFile,
        currentResumeId
      );
    }
  };

  const handleToggleFavorite = async () => {
    const currentFile = filePreviews[selectedFileIndex];
    if (!currentFile?.resumeId) return;

    const currentFavorite = favoriteStatus[selectedFileIndex] || false;
    const newFavoriteValue = !currentFavorite;

    // Optimistic update - update UI immediately
    setFavoriteStatus((prev) => ({
      ...prev,
      [selectedFileIndex]: newFavoriteValue,
    }));

    try {
      const response = await fetch(`/api/resumes/${currentFile.resumeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isFavorite: newFavoriteValue,
        }),
      });

      if (!response.ok) {
        // Revert on error
        setFavoriteStatus((prev) => ({
          ...prev,
          [selectedFileIndex]: currentFavorite,
        }));
        throw new Error("Failed to toggle favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // State already reverted above
    }
  };

  const handleHiddenSectionsChange = (sections: string[]) => {
    const currentFile = filePreviews[selectedFileIndex];
    const originalFile = originalFiles[currentFile?.originalFileName || currentFile?.fileName];
    
    setFilePreviews((prev) => {
      const updated = [...prev];
      updated[selectedFileIndex] = {
        ...updated[selectedFileIndex],
        hiddenSections: sections,
      };
      return updated;
    });

    // Save immediately after hidden sections change
    if (currentFile?.resumeId && originalFile && currentFile.data) {
      const currentResumeId = currentFile.resumeId || resumeIdsRef.current[currentFile.originalFileName || currentFile.fileName];
      saveResume(
        currentFile.fileName,
        currentFile.data,
        currentFile.format,
        sections,
        originalFile,
        currentResumeId
      );
    }
  };

  const handleDownload = async () => {
    if (!selectedFile?.data || isDownloading) return;

    setIsDownloading(true);
    setShowDownloadMenu(false);
    try {
      const fileName =
        editableFileNames[selectedFileIndex] || selectedFile.fileName;
      await onDownload(selectedFile.data, fileName, selectedFile.hiddenSections || []);
    } catch (error) {
      console.error("Failed to download resume:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    setShowDownloadMenu(false);
    try {
      for (let i = 0; i < filePreviews.length; i++) {
        const filePreview = filePreviews[i];
        if (filePreview.status === "completed" && filePreview.data) {
          const fileName = editableFileNames[i] || filePreview.fileName;
          await onDownload(filePreview.data, fileName, filePreview.hiddenSections || []);
        }
      }
    } catch (error) {
      console.error("Failed to download all resumes:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getDisplayFileName = (fileName: string, index?: number) => {
    if (index !== undefined && editableFileNames[index]) {
      return editableFileNames[index].replace(/\.pdf$/i, "");
    }
    return fileName.replace(/\.pdf$/i, "");
  };

  const getCurrentFileName = () => {
    return getDisplayFileName(selectedFile.fileName, selectedFileIndex);
  };

  const handleStartEditingFileName = () => {
    setTempFileName(getCurrentFileName());
    setIsEditingFileName(true);
  };

  const handleCancelEditFileName = () => {
    setIsEditingFileName(false);
    setTempFileName("");
  };

  const handleSaveFileName = () => {
    const newFileName = tempFileName.trim();
    if (newFileName) {
      const fullFileName = newFileName.endsWith(".pdf")
        ? newFileName
        : `${newFileName}.pdf`;
      setEditableFileNames((prev) => ({
        ...prev,
        [selectedFileIndex]: fullFileName,
      }));

      // Update the filePreviews array to reflect the new name
      setFilePreviews((prev) => {
        const updated = [...prev];
        if (updated[selectedFileIndex]) {
          updated[selectedFileIndex] = {
            ...updated[selectedFileIndex],
            fileName: fullFileName,
          };
        }
        return updated;
      });

      // Save the new file name to database
      const currentFile = filePreviews[selectedFileIndex];
      const originalFile = originalFiles[currentFile?.originalFileName || currentFile?.fileName];
      if (currentFile?.resumeId && originalFile && currentFile.data) {
        const currentResumeId = currentFile.resumeId || resumeIdsRef.current[currentFile.originalFileName || currentFile.fileName];
        saveResume(
          fullFileName,
          currentFile.data,
          currentFile.format,
          currentFile.hiddenSections || [],
          originalFile,
          currentResumeId
        );
      }
    }
    setIsEditingFileName(false);
    setTempFileName("");
  };

  const allCompleted = filePreviews.every((fp) => fp.status === "completed");

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
            <span
              className={`font-inconsolata font-bold text-[12px] leading-4 truncate ${filePreview.status === "loading"
                ? "text-gray-400 dark:text-zinc-600"
                : selectedFileIndex === index
                  ? "text-black dark:text-zinc-200"
                  : "text-black dark:text-zinc-200"
                }`}
            >
              {getDisplayFileName(filePreview.fileName, index)}
            </span>
          </button>
        ))}
      </div>

      {/* Middle - Preview */}
      <div className="flex-1 border border-[#e8e8e8] dark:border-zinc-700 flex flex-col min-h-183.5 bg-white dark:bg-zinc-900 relative max-w-[702px]">
        {selectedFile?.status === "completed" && (
          <div className="flex items-center justify-between px-8 py-4 border-b border-[#e8e8e8] dark:border-zinc-700">
            <div
              className={`cursor-pointer relative group px-4 pr-8 py-2 border rounded-sm transition-all ${isEditingFileName
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
                    type="text"
                    value={tempFileName}
                    onChange={(e) => setTempFileName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveFileName();
                      if (e.key === "Escape") handleCancelEditFileName();
                    }}
                    className="w-44 bg-transparent border-b border-[#3CBCEC] focus:outline-none text-[#18181b] dark:text-zinc-200 text-[12px] font-normal"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={handleCancelEditFileName}
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
                  {getCurrentFileName()}
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
              {selectedFile.resumeId && (
                <button
                  onClick={handleToggleFavorite}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  title={favoriteStatus[selectedFileIndex] ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star
                    className={`w-5 h-5 ${favoriteStatus[selectedFileIndex]
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                      }`}
                  />
                </button>
              )}

              {/* Download button with optional dropdown */}
              {selectedFile?.data && (
                <div className="relative" ref={downloadMenuRef}>
                  {files.length > 1 ? (
                    <div className="flex bg-black text-white">
                      <button
                        onClick={handleDownload}
                        disabled={isDownloading || !allCompleted}
                        className={`flex items-center gap-3 px-4 py-2 border-r border-white transition-colors ${isDownloading || !allCompleted
                          ? "opacity-75 cursor-not-allowed"
                          : "hover:bg-zinc-800"
                          }`}
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
                      <button
                        onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                        disabled={isDownloading || !allCompleted}
                        className="px-3 py-2 hover:bg-zinc-800 transition-colors disabled:opacity-75"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleDownload}
                      disabled={isDownloading || !allCompleted}
                      className={`flex items-center gap-3 px-4 py-2 bg-black text-white transition-colors ${isDownloading || !allCompleted
                        ? "opacity-75 cursor-not-allowed"
                        : "hover:bg-zinc-800"
                        }`}
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
                  )}

                  {/* Dropdown menu - only show for multiple files */}
                  {showDownloadMenu && files.length > 1 && (
                    <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-zinc-800 border border-[#e8e8e8] dark:border-zinc-700 shadow-lg rounded-sm z-20">
                      <button
                        onClick={handleDownload}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 font-inconsolata text-[#18181b] dark:text-zinc-200"
                      >
                        Download Current
                      </button>
                      <button
                        onClick={handleDownloadAll}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 font-inconsolata text-[#18181b] dark:text-zinc-200 border-t border-[#e8e8e8] dark:border-zinc-700"
                      >
                        Download All
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto flex items-start justify-center">
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
                {selectedFile.errorMessage ||
                  "There was an error processing this resume."}
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
              onHiddenSectionsChange={handleHiddenSectionsChange}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
