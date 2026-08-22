import React, { useRef, useState } from "react";
import { DocumentIcon } from "./Icons";

export default function UploadZone({ file, onFile, error, onPreview }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const validate = (selected) => {
    if (!selected) return;
    const valid = ["application/pdf", "image/png", "image/jpeg"];
    if (!valid.includes(selected.type)) {
      onFile(null, "Please upload a PDF, PNG, JPG, or JPEG file.");
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      onFile(null, "File size must be 10 MB or less.");
      return;
    }
    onFile(selected, "");
  };

  return (
    <>
      <div
        className={`drop-zone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          validate(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => validate(e.target.files?.[0])}
        />
        <DocumentIcon />
        <h2>Drag &amp; drop your file here</h2>
        <div className="or">
          <span></span>or<span></span>
        </div>
        <button
          className="browse"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          ▣ &nbsp; Browse Files
        </button>
        <p>Supported formats: PDF, PNG, JPG, JPEG</p>
        <p>Max file size: 10MB</p>
      </div>
      {file && (
        <div className="selected-file">
          <div className="file-left">
            <div className="pdf-badge">
              {file.type === "application/pdf" ? "PDF" : "IMG"}
            </div>
            <div>
              <strong>{file.name}</strong>
              <span>{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          </div>
          <button
            className="eye-button"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof onPreview === "function") {
                onPreview();
              }
            }}
          >
            ◉
          </button>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </>
  );
}
