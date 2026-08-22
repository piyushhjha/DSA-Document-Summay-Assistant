import React from "react";

export default function Footer({
  onHome,
  onHowItWorks,
  onAbout,
  onHistory,
  onProfile,
  user,
}) {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="site-footer">
      <div className="footer-main">
        {/* BRAND */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">▤</span>

            <span>
              Document <b>Summary Assistant</b>
            </span>
          </div>

          <p>
            Read less. Understand more.
            <br />
            Turn documents into clear insights.
          </p>

          <div className="footer-status">
            <span className="status-dot"></span>
            AI-powered document intelligence
          </div>
        </div>

        {/* PRODUCT */}
        <div className="footer-column">
          <h4>PRODUCT</h4>

          <button onClick={onHome}>Summarize Document</button>

          <button onClick={onHowItWorks}>How It Works</button>

          <button onClick={onAbout}>About</button>
        </div>

        {/* ACCOUNT */}
        <div className="footer-column">
          <h4>ACCOUNT</h4>

          {user ? (
            <>
              <button onClick={onHistory}>Summary History</button>

              <button onClick={onProfile}>My Profile</button>

              <button onClick={onHome}>Upload Document</button>
            </>
          ) : (
            <>
              <button onClick={onHome}>Get Started</button>

              <button onClick={onHome}>Login</button>
            </>
          )}
        </div>

        {/* FEATURES */}
        <div className="footer-column">
          <h4>FEATURES</h4>

          <span>AI Summaries</span>
          <span>Key Points</span>
          <span>PDF Export</span>
          <span>Secure History</span>
        </div>

        {/* INFO */}
        <div className="footer-column footer-info">
          <h4>INFO</h4>

          <button onClick={scrollTop}>Back to top ↑</button>

          <span>PDF · PNG · JPG · JPEG</span>
          <span>Fast. Simple. Intelligent.</span>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <span className="footer-copyright">
            © 2026 Document Summary Assistant · Built by Piyush Ranjan Jha
          </span>

          <span className="footer-built">
            Built for smarter reading
            <span className="footer-spark">✦</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
