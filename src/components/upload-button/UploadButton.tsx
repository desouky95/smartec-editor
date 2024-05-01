import React, { useState } from "react";
type UploadButtonProps = {
  onChange?: (url: string, file: File) => void;
};
export const UploadButton = ({ onChange }: UploadButtonProps) => {
  const [_file, setFile] = useState<File | undefined>();
  const [_url, setURL] = useState<string | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setFile(file);
    setURL(url);
    onChange?.(url, file);
  };

  const fileInput = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        type="file"
        onChange={handleFileChange}
        onClick={(e) => ((e.target as HTMLInputElement).value = null as any)}
        placeholder="Upload file"
        hidden
        ref={fileInput}
      />

      <button
        onClick={() => fileInput.current?.click()}
        className="rounded-md bg-blue-500 text-white p-3 hover:bg-blue-400 active:scale-105 transition-transform"
      >
        Upload Image
      </button>
    </>
  );
};
