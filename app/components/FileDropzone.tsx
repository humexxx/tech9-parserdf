"use client";

import { Upload } from "lucide-react";
import { useCallback, useState } from "react";

interface FileDropzoneProps {
  onFilesSelected?: (files: File[]) => void;
  maxSize?: number;
  acceptedTypes?: string[];
}

export default function FileDropzone({
  onFilesSelected,
  maxSize = 10 * 1024 * 1024,
  acceptedTypes = [".pdf", ".doc", ".docx"],
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter((file) => {
        const extension = "." + file.name.split(".").pop()?.toLowerCase();
        return acceptedTypes.includes(extension) && file.size <= maxSize;
      });

      if (validFiles.length > 0) {
        setSelectedFiles(validFiles);
        onFilesSelected?.(validFiles);
      }
    },
    [acceptedTypes, maxSize, onFilesSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const validFiles = files.filter((file) => {
        const extension = "." + file.name.split(".").pop()?.toLowerCase();
        return acceptedTypes.includes(extension) && file.size <= maxSize;
      });

      if (validFiles.length > 0) {
        setSelectedFiles(validFiles);
        onFilesSelected?.(validFiles);
      }
    },
    [acceptedTypes, maxSize, onFilesSelected]
  );

  const maxSizeMB = Math.floor(maxSize / (1024 * 1024));

  return (
    <div className="w-full max-w-[1210px] flex flex-col gap-[52px]">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center
          w-[642px] h-[258px] p-2
          border border-dashed rounded-[4px] gap-2
          transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? "bg-[#f9f9f9] dark:bg-zinc-900 border-[#52525b] dark:border-zinc-600 scale-[0.99]"
              : "bg-[#f9f9f9] dark:bg-zinc-950 border-[#52525b] dark:border-zinc-700 hover:border-primary dark:hover:border-primary"
          }
        `}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <Upload className="w-6 h-6 text-[#52525b] dark:text-zinc-400 mb-2" strokeWidth={1.5} />
          
          <div className="flex items-center gap-1 text-center">
            <span className="font-inconsolata text-[16px] leading-[24px] text-[#18181b] dark:text-zinc-200">
              Drag & Drop
            </span>
            <span className="font-mulish text-[14px] leading-[20px] text-[#18181b] dark:text-zinc-300">
              or
            </span>
            <span className="font-inconsolata font-semibold text-[16px] leading-[24px] text-primary">
              Browse Files
            </span>
          </div>
          
          <p className="font-inconsolata text-[14px] leading-[20px] text-[#52525b] dark:text-zinc-500 mt-1">
            {acceptedTypes.join(", ").replace(/\./g, "").toUpperCase()} files, up to {maxSizeMB}mb
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#18181b] dark:text-zinc-300">
            Selected files ({selectedFiles.length}):
          </h3>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-[#f9f9f9] dark:bg-zinc-900 border border-[#52525b] dark:border-zinc-800"
              >
                <span className="text-sm text-[#18181b] dark:text-zinc-300 truncate flex-1 font-inconsolata">
                  {file.name}
                </span>
                <span className="text-xs text-[#52525b] dark:text-zinc-400 ml-3 shrink-0">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
