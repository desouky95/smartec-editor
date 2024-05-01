import { useState } from "react";
import "./App.css";
import { UploadButton } from "./components/upload-button/UploadButton";
import { ImageEditor } from "./components/image-editor/ImageEditor";

function App() {
  const [url, setURL] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  return (
    <>
      <div className="grid h-screen w-screen place-items-center">
        <UploadButton
          onChange={(url, file) => {
            setURL(url);
            setFile(file);
          }}
        />
      </div>

      {url && file && (
        <ImageEditor onClose={() => setURL(null)} src={url} file={file} />
      )}
    </>
  );
}

export default App;
