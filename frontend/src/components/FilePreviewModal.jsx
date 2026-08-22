import React, { useEffect, useState } from "react";

export default function FilePreviewModal({ file, onClose }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!file) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <strong>{file.name}</strong>
          <button onClick={onClose}>×</button>
        </div>
        {file.type.startsWith("image/") ? (
          <img className="preview-image" src={url} alt="Uploaded document" />
        ) : (
          <iframe className="preview-frame" src={url} title="PDF preview" />
        )}
      </div>
    </div>
  );
}
