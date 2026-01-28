"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUp01, ArrowDown01 } from "lucide-react";

interface FileFormat {
  fileName: string;
  selectedFormat: "skill-at-top" | "skill-at-bottom";
}

interface IndividualFormattingViewProps {
  files: File[];
  onContinue?: (fileFormats: FileFormat[]) => void;
}

export default function IndividualFormattingView({ files, onContinue }: IndividualFormattingViewProps) {
  const [fileFormats, setFileFormats] = useState<FileFormat[]>(
    files.map(file => ({
      fileName: file.name,
      selectedFormat: "skill-at-top" as const,
    }))
  );
  const [previewFormat, setPreviewFormat] = useState<"skill-at-top" | "skill-at-bottom">("skill-at-top");

  const handleFormatChange = (index: number, format: "skill-at-top" | "skill-at-bottom") => {
    const newFormats = [...fileFormats];
    newFormats[index] = { ...newFormats[index], selectedFormat: format };
    setFileFormats(newFormats);
  };

  const handleContinue = () => {
    onContinue?.(fileFormats);
  };

  return (
    <div className="flex gap-6 w-full">
      {/* Left side - File list */}
      <div className="flex flex-col gap-6 w-146.75">
        <p className="font-inconsolata text-[16px] leading-6 text-[#0a0a0a] dark:text-zinc-200">
          Select Formats individually
        </p>

        <div className="flex flex-col gap-3 w-full">
          {fileFormats.map((fileFormat, index) => (
            <div
              key={index}
              className="bg-[#f9f9f9] dark:bg-zinc-900 border border-[#d4d4d4] dark:border-zinc-700 rounded-lg p-3 flex flex-col gap-2"
            >
              <p className="font-inconsolata font-semibold text-[16px] leading-6 text-[#18181b] dark:text-zinc-200">
                {fileFormat.fileName}
              </p>

              <div className="flex gap-6 items-start">
                {/* Skill at Top option */}
                <button
                  onClick={() => handleFormatChange(index, "skill-at-top")}
                  className="flex gap-2 items-center py-2 h-8.5"
                >
                  <div className="w-4.5 h-4.5 flex items-center justify-center shrink-0">
                    {fileFormat.selectedFormat === "skill-at-top" ? (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="8" stroke="#3CBCEC" strokeWidth="2"/>
                        <circle cx="9" cy="9" r="4" fill="#3CBCEC"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="8" stroke="#52525b" strokeWidth="1"/>
                      </svg>
                    )}
                  </div>
                  <span className="font-inter text-[14px] leading-5 text-[#18181b] dark:text-zinc-200">
                    Skill at Top
                  </span>
                  <ArrowUp01 className="w-4 h-4 text-[#18181b] dark:text-zinc-200" />
                </button>

                {/* Skill at Bottom option */}
                <button
                  onClick={() => handleFormatChange(index, "skill-at-bottom")}
                  className="flex gap-2 items-center py-2 h-8.5"
                >
                  <div className="w-4.5 h-4.5 flex items-center justify-center shrink-0">
                    {fileFormat.selectedFormat === "skill-at-bottom" ? (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="8" stroke="#3CBCEC" strokeWidth="2"/>
                        <circle cx="9" cy="9" r="4" fill="#3CBCEC"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="8" stroke="#52525b" strokeWidth="1"/>
                      </svg>
                    )}
                  </div>
                  <span className="font-inter text-[14px] leading-5 text-[#18181b] dark:text-zinc-200">
                    Skill at Bottom
                  </span>
                  <ArrowDown01 className="w-4 h-4 text-[#18181b] dark:text-zinc-200" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="bg-black hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white px-9 py-4 w-86.25 mt-6 mb-8 transition-colors"
        >
          <span className="font-inconsolata text-[16px] leading-5">
            Continue to Preview
          </span>
        </button>
      </div>

      {/* Right side - Preview panel */}
      <div className="fixed right-0 top-17 h-239 w-158.5 bg-[#f8f7f3] dark:bg-zinc-900 flex flex-col gap-6 pt-9 px-6 pb-2.5">
        {/* Preview tabs */}
        <div className="flex items-start w-full">
          <button
            onClick={() => setPreviewFormat("skill-at-top")}
            className={`flex flex-1 items-center justify-center gap-2.5 px-2 py-3 ${
              previewFormat === "skill-at-top"
                ? "border-b-2 border-[#3CBCEC]"
                : "border-b-0"
            }`}
          >
            <span
              className={`font-inconsolata text-[16px] leading-6 ${
                previewFormat === "skill-at-top" ? "font-bold text-[#18181b] dark:text-zinc-200" : "font-normal text-[#52525b] dark:text-zinc-500"
              }`}
            >
              Top Format Preview
            </span>
          </button>
          <button
            onClick={() => setPreviewFormat("skill-at-bottom")}
            className={`flex flex-1 items-center justify-center gap-2.5 px-2 py-3 ${
              previewFormat === "skill-at-bottom"
                ? "border-b-2 border-[#3CBCEC]"
                : "border-b-0"
            }`}
          >
            <span
              className={`font-inconsolata text-[16px] leading-6 ${
                previewFormat === "skill-at-bottom" ? "font-bold text-[#18181b] dark:text-zinc-200" : "font-normal text-[#52525b] dark:text-zinc-500"
              }`}
            >
              Bottom Format Preview
            </span>
          </button>
        </div>

        {/* Preview image */}
        <div className="w-full h-auto relative flex items-center justify-center">
          <Image
            src={previewFormat === "skill-at-top" ? "/format-skill-top.png" : "/format-skill-bottom.png"}
            alt={`${previewFormat} preview`}
            width={586}
            height={758}
            className="w-full h-auto object-contain max-h-189.5"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
