import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "▤",
      title: "Upload",
      heading: "Add your document",
      text: "Upload a PDF or supported image and preview it before processing.",
    },
    {
      number: "02",
      icon: "⚙",
      title: "Analyze",
      heading: "Let AI read it",
      text: "The document is extracted and analyzed to identify the important information.",
    },
    {
      number: "03",
      icon: "✦",
      title: "Summarize",
      heading: "Get the essentials",
      text: "Receive an AI-generated summary together with useful key points.",
    },
    {
      number: "04",
      icon: "▣",
      title: "Save",
      heading: "Come back anytime",
      text: "Logged-in users can save summaries and revisit them through History.",
    },
  ];

  const formats = [
    ["PDF", "Documents"],
    ["PNG", "Images"],
    ["JPG", "Images"],
    ["10MB", "Maximum size"],
  ];

  return (
    <main className="modern-info-page">
      {/* HERO */}
      <section className="modern-info-hero">
        <div className="hero-copy">
          <span className="modern-label">HOW IT WORKS</span>

          <h1>
            From document
            <br />
            to <em>understanding.</em>
          </h1>

          <p>
            A simple workflow that turns lengthy documents into clear summaries
            and useful insights.
          </p>

          <div className="hero-flow-mini">
            <span>Upload</span>
            <b>→</b>
            <span>Analyze</span>
            <b>→</b>
            <span>Understand</span>
          </div>
        </div>

        <div className="hero-document-visual">
          <div className="visual-glow" />

          <div className="document-sheet">
            <div className="document-top">
              <span>PDF</span>
              <span>✦</span>
            </div>

            <div className="document-title-line" />
            <div className="document-line large" />
            <div className="document-line" />
            <div className="document-line" />

            <div className="document-highlight">
              <span>AI SUMMARY</span>
              <i />
              <i />
              <i />
            </div>

            <div className="document-line" />
            <div className="document-line short" />
          </div>

          <div className="floating-badge badge-top">✦ AI Analysis</div>

          <div className="floating-badge badge-bottom">✓ Summary Ready</div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process-section">
        <div className="modern-section-heading">
          <div>
            <span className="modern-label">THE PROCESS</span>
            <h2>Four steps. One simple experience.</h2>
          </div>

          <p>
            No complicated workflow. Upload your file and let the assistant
            handle the heavy reading.
          </p>
        </div>

        <div className="process-grid">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <article className="process-card">
                <div className="process-card-top">
                  <span className="process-number">{step.number}</span>

                  <span className="process-icon">{step.icon}</span>
                </div>

                <span className="process-small-title">{step.title}</span>

                <h3>{step.heading}</h3>

                <p>{step.text}</p>

                <div className="process-arrow">→</div>
              </article>

              {index < steps.length - 1 && (
                <div className="process-connector">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* WHAT HAPPENS */}
      <section className="explanation-section">
        <div className="explanation-visual">
          <div className="scan-card">
            <div className="scan-header">
              <span>DOCUMENT</span>
              <span className="scan-dot">●</span>
            </div>

            <div className="scan-lines">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <div className="scan-progress">
              <span />
            </div>

            <small>Analyzing document...</small>
          </div>
        </div>

        <div className="explanation-copy">
          <span className="modern-label">BEHIND THE PROCESS</span>

          <h2>
            Your document goes in.
            <em> Clarity comes out.</em>
          </h2>

          <p>
            Once your file is uploaded, the application extracts its content and
            sends the relevant information through the AI summarization process.
          </p>

          <div className="explanation-points">
            <div>
              <span>01</span>
              <p>Content is extracted from the uploaded file.</p>
            </div>

            <div>
              <span>02</span>
              <p>Important information is identified and condensed.</p>
            </div>

            <div>
              <span>03</span>
              <p>A readable summary and key points are presented to you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMATS */}
      <section className="formats-modern-section">
        <div className="modern-section-heading centered">
          <span className="modern-label">SUPPORTED FILES</span>

          <h2>Bring your document.</h2>

          <p>Start with one of the supported formats below.</p>
        </div>

        <div className="modern-format-grid">
          {formats.map(([type, description]) => (
            <div className="modern-format-card" key={type}>
              <div className="format-symbol">{type}</div>

              <div>
                <strong>{description}</strong>
                <span>Supported</span>
              </div>

              <b>✓</b>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="modern-info-cta">
        <span className="modern-label">READY TO START?</span>

        <h2>
          Stop reading everything.
          <br />
          <em>Understand what matters.</em>
        </h2>

        <p>
          Upload your first document and experience the assistant for yourself.
        </p>
      </section>
    </main>
  );
}
