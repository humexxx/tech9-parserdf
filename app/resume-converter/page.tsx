"use client";

import { useState } from "react";
import FileListStep from "../components/resume-converter/FileListStep";
import FormatSelectionStep from "../components/resume-converter/FormatSelectionStep";
import PreviewStep from "../components/resume-converter/PreviewStep";
import UploadStep from "../components/resume-converter/UploadStep";
import { Heading, Text } from "../components/Typography";
import { ResumeData } from "../types/resume";

type Step = "upload" | "fileList" | "formatSelection" | "preview";

export default function ResumeConverterPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [selectedFormats, setSelectedFormats] = useState<Record<string, string>>({});

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setCurrentStep("fileList");
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    if (newFiles.length === 0) {
      setCurrentStep("upload");
    }
  };

  const handleRenameFile = (index: number, newName: string) => {
    const newFiles = [...selectedFiles];
    const file = newFiles[index];
    const renamedFile = new File([file], newName, { type: file.type });
    newFiles[index] = renamedFile;
    setSelectedFiles(newFiles);
  };

  const handleContinueToFormat = () => {
    setCurrentStep("formatSelection");
  };

  const handleContinueToPreview = (formats: Record<string, string>) => {
    setSelectedFormats(formats);
    setCurrentStep("preview");
  };

  const handleEdit = () => {
    setCurrentStep("formatSelection");
  };

  const handleDownload = async (resumeData: ResumeData, fileName: string) => {
    // TODO: Call downloadResume API when ready
    try {
      // const format = selectedFormats[fileName] || "skill-at-top";
      // await downloadResume(resumeData, format, fileName);
      alert("Download functionality is not yet implemented.");
      console.log("Downloading resume:", fileName);
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  const getTitle = () => {
    switch (currentStep) {
      case "formatSelection":
        return "Template Format";
      case "preview":
        return "Preview & Edit";
      default:
        return "Resume Converter";
    }
  };

  const getSubtitle = () => {
    switch (currentStep) {
      case "formatSelection":
        return "Select how you want your template customised";
      case "preview":
        return "Preview and edit your resumes before downloading";
      default:
        return "Upload Resumes to Customize in Tech9 Templates";
    }
  };

  return (
    <div className="flex pt-6 pl-6">
      <div className="flex flex-col gap-8 items-start w-full max-w-302.5">
        <div className="flex flex-col gap-2 items-start w-full">
          <Heading level={1}>{getTitle()}</Heading>
          <Text>{getSubtitle()}</Text>
        </div>

        {currentStep === "upload" && (
          <UploadStep onFilesSelected={handleFilesSelected} />
        )}

        {currentStep === "fileList" && (
          <FileListStep 
            files={selectedFiles}
            onRemoveFile={handleRemoveFile}
            onRenameFile={handleRenameFile}
            onContinue={handleContinueToFormat}
          />
        )}

        {currentStep === "formatSelection" && (
          <FormatSelectionStep
            fileCount={selectedFiles.length}
            files={selectedFiles}
            onContinue={handleContinueToPreview}
          />
        )}

        {currentStep === "preview" && (
          <PreviewStep
            files={selectedFiles}
            selectedFormats={selectedFormats}
            onEdit={handleEdit}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
}
