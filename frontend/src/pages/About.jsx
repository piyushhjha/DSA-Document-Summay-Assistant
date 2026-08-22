import React from "react";

export default function About() {
  const features = [
    {
      icon: "✦",
      number: "01",
      title: "AI Summaries",
      text: "Turn lengthy documents into concise, readable summaries without manually going through every page.",
    },
    {
      icon: "≡",
      number: "02",
      title: "Key Points",
      text: "Important information is presented separately so you can quickly understand the core ideas.",
    },
    {
      icon: "◉",
      number: "03",
      title: "File Preview",
      text: "Preview your uploaded document before or after analysis whenever you need to check the original.",
    },
    {
      icon: "▣",
      number: "04",
      title: "History",
      text: "Save processed documents and revisit their summaries later from your personal history.",
    },
    {
      icon: "✓",
      number: "05",
      title: "Email Verification",
      text: "Create an account using email OTP verification so your personal history stays associated with your account.",
    },
    {
      icon: "↓",
      number: "06",
      title: "PDF Export",
      text: "Download your generated summary and key points in a clean, readable PDF format.",
    },
  ];

  return (
    <main className="modern-info-page">
      {/* HERO */}
      <section className="about-modern-hero">
        <div className="about-hero-copy">
          <span className="modern-label">ABOUT THE ASSISTANT</span>

          <h1>
            Read less.
            <br />
            <em>Understand more.</em>
          </h1>

          <p>
            Document Summary Assistant is built to make lengthy documents easier
            to understand by turning them into clear summaries and useful key
            points.
          </p>

          <div className="about-hero-stats">
            <div>
              <strong>AI</strong>
              <span>Powered</span>
            </div>

            <div>
              <strong>PDF</strong>
              <span>Support</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Accessible</span>
            </div>
          </div>
        </div>

        <div className="about-ai-visual">
          <div className="ai-orbit orbit-one" />
          <div className="ai-orbit orbit-two" />

          <div className="ai-core">
            <span>✦</span>
            <strong>AI</strong>
            <small>SUMMARY</small>
          </div>

          <div className="ai-floating-card card-one">
            <span>▤</span>
            <div>
              <strong>Document</strong>
              <small>Uploaded</small>
            </div>
          </div>

          <div className="ai-floating-card card-two">
            <span>✓</span>
            <div>
              <strong>Summary</strong>
              <small>Generated</small>
            </div>
          </div>
        </div>
      </section>

      {/* IDEA */}
      <section className="about-idea-section">
        <div className="about-idea-title">
          <span className="modern-label">THE IDEA</span>

          <h2>
            Information is everywhere.
            <br />
            <em>Understanding it shouldn't be difficult.</em>
          </h2>
        </div>

        <div className="about-idea-content">
          <p>
            Long reports, academic documents, resumes, research material and
            other files can take considerable time to read.
          </p>

          <p>
            The goal of Document Summary Assistant is simple: reduce the time
            between opening a document and understanding what actually matters
            inside it.
          </p>

          <div className="idea-highlight">
            <span>THE GOAL</span>

            <strong>
              Less reading.
              <br />
              More understanding.
            </strong>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="about-features-section">
        <div className="modern-section-heading">
          <div>
            <span className="modern-label">WHAT YOU GET</span>

            <h2>Built around the way you read.</h2>
          </div>

          <p>
            Everything you need to move from a document to a useful
            understanding of its content.
          </p>
        </div>

        <div className="about-feature-grid">
          {features.map((feature) => (
            <article className="about-modern-feature" key={feature.number}>
              <div className="feature-number">{feature.number}</div>

              <div className="feature-icon">{feature.icon}</div>

              <h3>{feature.title}</h3>

              <p>{feature.text}</p>

              <span className="feature-line" />
            </article>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="experience-section">
        <div className="experience-heading">
          <span className="modern-label">THE EXPERIENCE</span>

          <h2>
            Upload.
            <span> Analyze.</span>
            <span> Understand.</span>
          </h2>
        </div>

        <div className="experience-flow">
          <div className="experience-step">
            <strong>01</strong>
            <div className="experience-icon">▤</div>
            <span>UPLOAD</span>
          </div>

          <div className="experience-line" />

          <div className="experience-step">
            <strong>02</strong>
            <div className="experience-icon">⚙</div>
            <span>ANALYZE</span>
          </div>

          <div className="experience-line" />

          <div className="experience-step">
            <strong>03</strong>
            <div className="experience-icon">✦</div>
            <span>SUMMARIZE</span>
          </div>

          <div className="experience-line" />

          <div className="experience-step">
            <strong>04</strong>
            <div className="experience-icon">▣</div>
            <span>SAVE</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="modern-info-cta about-cta">
        <span className="modern-label">DOCUMENT SUMMARY ASSISTANT</span>

        <h2>
          Make every document
          <br />
          <em>easier to understand.</em>
        </h2>

        <p>Your next document is only one upload away.</p>
      </section>
    </main>
  );
}
