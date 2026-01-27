"use client";

import { useState } from "react";
import FileListStep from "../components/resume-converter/FileListStep";
import UploadStep from "../components/resume-converter/UploadStep";
import { Heading, Text } from "../components/Typography";

export default function ResumeConverterPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const handleRenameFile = (index: number, newName: string) => {
    const newFiles = [...selectedFiles];
    const file = newFiles[index];
    const renamedFile = new File([file], newName, { type: file.type });
    newFiles[index] = renamedFile;
    setSelectedFiles(newFiles);
  };

  const handleContinue = () => {
    console.log("Continue to format selection", selectedFiles);
  };

  return (
    <div className="flex pt-6 pl-6">
      <div className="flex flex-col gap-13 items-start w-full max-w-302.5">
        <div className="flex flex-col gap-3 items-start w-full">
          <Heading level={1}>Resume Converter</Heading>
          <Text>Upload Resumes to Customize in Tech9 Templates</Text>
        </div>

        {selectedFiles.length === 0 ? (
          <UploadStep onFilesSelected={handleFilesSelected} />
        ) : (
          <FileListStep 
            files={selectedFiles}
            onRemoveFile={handleRemoveFile}
            onRenameFile={handleRenameFile}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
}
