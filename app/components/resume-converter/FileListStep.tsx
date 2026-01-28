"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import { Text } from "../Typography";

interface FileListStepProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  onRenameFile?: (index: number, newName: string) => void;
  onContinue?: () => void;
}

export default function FileListStep({ files, onRemoveFile, onRenameFile, onContinue }: FileListStepProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleStartEdit = (index: number, currentName: string) => {
    setEditingIndex(index);
    // Extract name without extension
    const lastDotIndex = currentName.lastIndexOf(".");
    const nameWithoutExt = lastDotIndex > 0 ? currentName.substring(0, lastDotIndex) : currentName;
    setEditValue(nameWithoutExt);
  };

  const handleSaveEdit = (index: number) => {
    if (editValue.trim()) {
      const file = files[index];
      const lastDotIndex = file.name.lastIndexOf(".");
      const extension = lastDotIndex > 0 ? file.name.substring(lastDotIndex) : "";
      const newName = editValue.trim() + extension;
      
      if (newName !== file.name) {
        onRenameFile?.(index, newName);
      }
    }
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-3">
        <Text variant="body" className="font-semibold text-[#18181b] dark:text-zinc-200">
          Uploaded Files
        </Text>
        <div className="flex flex-col gap-3">
          {files.map((file, index) => (
          <div
            key={index}
            className="bg-[#f9f9f9] dark:bg-zinc-900 border border-[#d4d4d4] dark:border-zinc-800 rounded-lg p-3 w-160.5 flex items-start gap-2"
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mt-0.5">
                <circle cx="10" cy="10" r="7.5" stroke="#3CBCEC" strokeWidth="1.5"/>
                <path d="M7 10L9 12L13 8" stroke="#3CBCEC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0 leading-0">
              {editingIndex === index ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSaveEdit(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(index);
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    autoFocus
                    className="font-inconsolata font-semibold text-[16px] leading-6 text-[#18181b] dark:text-zinc-200 bg-transparent border-b border-[#3CBCEC] outline-none min-w-75"
                  />
                  <span className="font-inconsolata font-semibold text-[16px] leading-6 text-[#52525b] dark:text-zinc-500 ml-0.5">
                    {file.name.substring(file.name.lastIndexOf("."))}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <p className="font-inconsolata font-semibold text-[16px] leading-6 text-[#18181b] dark:text-zinc-200 truncate">
                    {file.name}
                  </p>
                  <button
                    onClick={() => handleStartEdit(index, file.name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-4 h-4 text-[#52525b] dark:text-zinc-500" strokeWidth={1.5} />
                  </button>
                </div>
              )}
              <p className="font-mulish text-[12px] leading-5 text-[#52525b] dark:text-zinc-500">
                {(file.size / 1024 / 1024).toFixed(2)}mb
              </p>
            </div>
            <button
              onClick={() => onRemoveFile(index)}
              className="w-6 h-6 flex items-center justify-center shrink-0 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 4L4 14H12L13 4M6 6V12M10 6V12M5 4V2H11V4" stroke="#ED3E41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ))}
        </div>
      </div>
      
      <button 
        onClick={onContinue}
        className="bg-black dark:bg-white text-white dark:text-black px-6 py-4 w-[345px] font-inconsolata text-[16px] leading-[20px] text-center hover:opacity-90 transition-opacity mt-20"
      >
        Continue to Selecting Format
      </button>
    </div>
  );
}
