import React, { useState } from "react";

export default function History({ history = [], onDelete }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const confirmDelete = async () => {
    if (!deleteItem) return;

    try {
      await onDelete(deleteItem.id);
      setDeleteItem(null);

      if (selectedItem && selectedItem.id === deleteItem.id) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error("Delete history error:", error);
    }
  };

  return (
    <main className="history-page">
      <section className="history-header">
        <h1>Summary History</h1>

        <p>Previously processed documents will appear here.</p>
      </section>

      {history.length === 0 ? (
        <div className="history-empty">
          <div className="history-empty-icon">▤</div>

          <h2>No documents yet</h2>

          <p>Documents that you save to history will appear here.</p>
        </div>
      ) : (
        <section className="history-list">
          {history.map((item) => (
            <article
              className="history-item"
              key={item.id}
              onClick={() => setSelectedItem(item)}
            >
              {/* FILE ICON */}
              <div className="history-file-icon">PDF</div>

              {/* FILE INFORMATION */}
              <div className="history-file-info">
                <h3 title={item.fileName || item.name}>
                  {item.fileName || item.name}
                </h3>

                <div className="history-meta">
                  <span>{item.length || "short"}</span>

                  <span>•</span>

                  <span>
                    {item.date ||
                      new Date(item.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>

              {/* SHORT SUMMARY */}
              <div className="history-summary-preview">{item.summary}</div>

              {/* DELETE */}
              <button
                className="history-delete"
                title="Delete from history"
                onClick={(event) => {
                  event.stopPropagation();
                  setDeleteItem(item);
                }}
              >
                ×
              </button>
            </article>
          ))}
        </section>
      )}

      {/* =========================
          COMPLETE SUMMARY MODAL
         ========================= */}

      {selectedItem && (
        <div
          className="history-modal-overlay"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="history-detail-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="history-modal-close"
              onClick={() => setSelectedItem(null)}
            >
              ×
            </button>

            <p className="section-label">SAVED SUMMARY</p>

            <h2>{selectedItem.fileName || selectedItem.name}</h2>

            <div className="history-detail-meta">
              <span>{selectedItem.length || "short"} summary</span>

              <span>•</span>

              <span>
                {selectedItem.date ||
                  new Date(selectedItem.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>

            <div className="history-detail-content">
              <h3>Summary</h3>

              <p>{selectedItem.summary}</p>

              {selectedItem.keyPoints && selectedItem.keyPoints.length > 0 && (
                <div className="history-detail-points">
                  <h3>Key Points</h3>

                  <ul>
                    {selectedItem.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              className="history-modal-done"
              onClick={() => setSelectedItem(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* =========================
          DELETE CONFIRMATION
         ========================= */}

      {deleteItem && (
        <div
          className="delete-modal-overlay"
          onClick={() => setDeleteItem(null)}
        >
          <div
            className="delete-confirm-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="delete-warning-icon">×</div>

            <h2>Delete this document?</h2>

            <p>This will permanently remove this document from your history.</p>

            <div className="delete-actions">
              <button
                className="delete-cancel"
                onClick={() => setDeleteItem(null)}
              >
                Cancel
              </button>

              <button className="delete-confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
