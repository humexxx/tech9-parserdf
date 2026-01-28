import FileDropzone from "../FileDropzone";

interface UploadStepProps {
  onFilesSelected: (files: File[]) => void;
}

export default function UploadStep({ onFilesSelected }: UploadStepProps) {
  return (
    <FileDropzone
      maxSize={10 * 1024 * 1024}
      acceptedTypes={[".pdf", ".doc", ".docx"]}
      onFilesSelected={onFilesSelected}
    />
  );
}
