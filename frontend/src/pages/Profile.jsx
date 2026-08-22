import React from "react";

export default function Profile({ user, history, onHistory }) {
  const name = user?.name || "User";
  const email = user?.email || "No email available";

  const initial = name.charAt(0).toUpperCase();

  const pdfCount = history.filter(
    (item) =>
      item.type === "pdf" || item.fileName?.toLowerCase().endsWith(".pdf"),
  ).length;

  const imageCount = history.filter(
    (item) =>
      item.type === "image" ||
      /\.(png|jpg|jpeg|webp)$/i.test(item.fileName || ""),
  ).length;

  return (
    <main className="profile-page">
      {/* HEADER */}
      <section className="profile-header">
        <p className="section-label">MY PROFILE</p>

        <h1>Your Account</h1>

        <p>Manage your account and view your document activity.</p>
      </section>

      {/* PROFILE CARD */}
      <section className="profile-card">
        <div className="profile-main">
          <div className="profile-avatar">{initial}</div>

          <div className="profile-identity">
            <h2>{name}</h2>
            <p>{email}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <span>FULL NAME</span>
            <strong>{name}</strong>
          </div>

          <div className="profile-detail">
            <span>EMAIL ADDRESS</span>
            <strong>{email}</strong>
          </div>

          <div className="profile-detail">
            <span>MEMBER SINCE</span>
            <strong>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })
                : "August 2026"}
            </strong>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="profile-section">
        <div className="profile-section-heading">
          <div>
            <p className="section-label">DOCUMENT ACTIVITY</p>
            <h2>Your Statistics</h2>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat-card">
            <span className="stat-icon">▣</span>
            <strong>{history.length}</strong>
            <p>Documents Summarized</p>
          </div>

          <div className="profile-stat-card">
            <span className="stat-icon">▤</span>
            <strong>{pdfCount}</strong>
            <p>PDFs Processed</p>
          </div>

          <div className="profile-stat-card">
            <span className="stat-icon">▧</span>
            <strong>{imageCount}</strong>
            <p>Images Processed</p>
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITY */}
      <section className="profile-section">
        <div className="profile-section-heading">
          <div>
            <p className="section-label">RECENT ACTIVITY</p>
            <h2>Recent Documents</h2>
          </div>

          {history.length > 0 && (
            <button className="profile-history-button" onClick={onHistory}>
              View History →
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="profile-empty">
            <div className="profile-empty-icon">▣</div>

            <h3>No documents yet</h3>

            <p>
              Your summarized documents will appear here after you process your
              first file.
            </p>
          </div>
        ) : (
          <div className="profile-recent-list">
            {history.slice(0, 5).map((item) => (
              <div className="profile-recent-row" key={item.id}>
                <div className="recent-file-icon">
                  {item.fileName?.toLowerCase().endsWith(".pdf")
                    ? "PDF"
                    : "IMG"}
                </div>

                <div className="recent-file-info">
                  <strong>{item.fileName || "Untitled Document"}</strong>

                  <span>
                    {item.length
                      ? `${item.length
                          .charAt(0)
                          .toUpperCase()}${item.length.slice(1)} summary`
                      : "Document summary"}
                  </span>
                </div>

                <div className="recent-date">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })
                    : "Recently"}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
