"use client";

import { useState } from "react";
import Image from "next/image";

interface FormatOption {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imagePosition: "top" | "bottom";
}

interface BulkFormattingViewProps {
  fileCount: number;
  onContinue?: (selectedFormat: string) => void;
}

const formatOptions: FormatOption[] = [
  {
    id: "skill-at-top",
    title: "Skill at Top",
    description: "Skills at Top format will be applied to all",
    imageUrl: "/format-skill-top.png",
    imagePosition: "top",
  },
  {
    id: "skill-at-bottom",
    title: "Skill at Bottom",
    description: "Skills at Bottom format will be applied to all",
    imageUrl: "/format-skill-bottom.png",
    imagePosition: "bottom",
  },
];

export default function BulkFormattingView({ fileCount, onContinue }: BulkFormattingViewProps) {
  const [selectedFormat, setSelectedFormat] = useState("skill-at-top");

  const handleContinue = () => {
    onContinue?.(selectedFormat);
  };

  return (
    <>
      {/* Description */}
      <div className="flex items-center pr-9 w-full max-w-171.5">
        <p className="font-inconsolata text-[16px] leading-6 text-[#0a0a0a] dark:text-zinc-200">
          Select how you want your template customised. Selected Format will be applied to all the {fileCount} Resumes.
        </p>
      </div>

      {/* Format Options */}
      <div className="flex gap-6 items-start py-4 w-full max-w-171.5">
        {formatOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedFormat(option.id)}
            className={`flex flex-col gap-2.5 items-center justify-center p-5 rounded-lg transition-all ${
              selectedFormat === option.id
                ? "w-82.75 bg-[rgba(62,190,237,0.18)] dark:bg-[rgba(62,190,237,0.1)] border-2 border-[#3CBCEC]"
                : "w-82.75 bg-[#f8f7f3] dark:bg-zinc-900 border-2 border-transparent hover:bg-[#f0efe9] dark:hover:bg-zinc-800"
            }`}
          >
            {option.imagePosition === "top" && (
              <div className="w-full h-auto relative overflow-hidden mb-2">
                <Image
                  src={option.imageUrl}
                  alt={option.title}
                  width={173}
                  height={223}
                  className="object-contain w-full h-auto"
                  unoptimized
                />
              </div>
            )}

            {/* Radio Button */}
            <div className="w-4.5 h-4.5 flex items-center justify-center shrink-0">
              {selectedFormat === option.id ? (
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

            <p className="font-inconsolata font-bold text-[16px] leading-6 text-[#0a0a0a] dark:text-zinc-200 whitespace-nowrap">
              {option.title}
            </p>

            <p className="font-mulish text-[12px] leading-5 text-[#52525b] dark:text-zinc-500 text-center w-full px-2">
              {option.description} {fileCount} resumes
            </p>

            {option.imagePosition === "bottom" && (
              <div className="w-full h-auto relative overflow-hidden mt-2">
                <Image
                  src={option.imageUrl}
                  alt={option.title}
                  width={173}
                  height={224}
                  className="object-contain w-full h-auto"
                  unoptimized
                />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Continue Button */}
      <div className="flex flex-col items-start pt-6 mb-8">
        <button
          onClick={handleContinue}
          className="bg-black hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white px-9 py-4 font-inconsolata text-[16px] leading-[20px] text-center transition-colors"
        >
          Continue to Preview
        </button>
      </div>
    </>
  );
}
