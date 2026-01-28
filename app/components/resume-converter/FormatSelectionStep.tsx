"use client";

import { useState } from "react";
import BulkFormattingView from "./BulkFormattingView";
import IndividualFormattingView from "./IndividualFormattingView";

interface FormatSelectionStepProps {
  fileCount: number;
  files: File[];
  onContinue?: (selectedFormats: Record<string, string>) => void;
}

type TabType = "bulk" | "individual";

export default function FormatSelectionStep({ fileCount, files, onContinue }: FormatSelectionStepProps) {
  const [activeTab, setActiveTab] = useState<TabType>("bulk" as TabType);

  return (
    <div className="flex flex-col justify-center items-start gap-6 w-full rounded-lg">
      {/* Tabs */}
      <div className="flex items-start pr-9 self-stretch w-full max-w-171.5">
        <button
          onClick={() => setActiveTab("bulk")}
          className={`flex flex-1 items-center justify-center gap-2.5 px-2 py-3 ${
            activeTab === "bulk"
              ? "border-b-2 border-[#3CBCEC]"
              : "border-b-0"
          }`}
        >
          <span
            className={`font-inconsolata text-[16px] leading-6 ${
              activeTab === "bulk" ? "font-bold text-[#18181b] dark:text-zinc-200" : "font-normal text-[#52525b] dark:text-zinc-500"
            }`}
          >
            Bulk Formatting
          </span>
        </button>
        <button
          onClick={() => setActiveTab("individual")}
          className={`flex flex-1 items-center justify-center gap-2.5 px-2 py-3 ${
            activeTab === "individual"
              ? "border-b-2 border-[#3CBCEC]"
              : "border-b-0"
          }`}
        >
          <span
            className={`font-inconsolata text-[16px] leading-6 ${
              activeTab === "individual" ? "font-bold text-[#18181b] dark:text-zinc-200" : "font-normal text-[#52525b] dark:text-zinc-500"
            }`}
          >
            Individual formatting
          </span>
        </button>
      </div>

      {activeTab === "individual" ? (
        <IndividualFormattingView 
          files={files} 
          onContinue={(fileFormats) => {
            const formats: Record<string, string> = {};
            fileFormats.forEach(ff => {
              formats[ff.fileName] = ff.selectedFormat;
            });
            onContinue?.(formats);
          }} 
        />
      ) : (
        <BulkFormattingView 
          fileCount={fileCount} 
          onContinue={(selectedFormat) => {
            const formats: Record<string, string> = {};
            files.forEach(file => {
              formats[file.name] = selectedFormat;
            });
            onContinue?.(formats);
          }} 
        />
      )}
    </div>
  );
}
