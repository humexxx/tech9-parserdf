"use client";

import FileDropzone from "../components/FileDropzone";
import { Heading, Text } from "../components/Typography";

export default function ResumeConverterPage() {
  return (
    <div className="flex pt-4 pl-6">
      <div className="flex flex-col gap-13 items-start w-full max-w-302.5">
        <div className="flex flex-col gap-3 items-start w-full">
          <Heading level={1}>Resume Converter</Heading>
          <Text>Upload Resumes to Customize in Tech9 Templates</Text>
        </div>

        <FileDropzone
          maxSize={10 * 1024 * 1024}
          acceptedTypes={[".pdf", ".doc", ".docx"]}
          onFilesSelected={(files) => {
            console.log("Files selected:", files);
          }}
        />
      </div>
    </div>
  );
}
