import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import UploadZone from "../components/UploadZone";
import FilePreviewModal from "../components/FilePreviewModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Home({ user, onLogin, onHistorySaved }) {
  const [file, setFile] = useState(null);
  const [length, setLength] = useState("short");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = (selected, message) => {
    setError(message || "");
    setFile(selected);
    setResult(null);
  };

  const summarize = async () => {
    if (!file) {
      setError("Please select a document first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("length", length);

      const response = await axios.post(`${API_URL}/api/summarize`, data);

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to process the document.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetDocument = () => {
    setFile(null);
    setResult(null);
    setError("");
  };

  const downloadSummaryPDF = () => {
    if (!result) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 18;
    const contentWidth = pageWidth - margin * 2;

    let y = 20;

    const addPageIfNeeded = (height = 10) => {
      if (y + height > pageHeight - 18) {
        pdf.addPage();
        y = 20;
      }
    };

    // -------------------------------------------------
    // HEADER
    // -------------------------------------------------

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(239, 181, 50);

    pdf.text("DOCUMENT SUMMARY ASSISTANT", margin, y);

    y += 9;

    pdf.setFont("times", "bold");
    pdf.setFontSize(25);
    pdf.setTextColor(20, 35, 50);

    const summaryTitle =
      length.charAt(0).toUpperCase() + length.slice(1) + " Summary";

    pdf.text(summaryTitle, margin, y);

    y += 8;

    // -------------------------------------------------
    // DOCUMENT NAME
    // -------------------------------------------------

    if (file?.name) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(100, 115, 130);

      const fileName = `Document: ${file.name}`;

      pdf.text(fileName, margin, y);

      y += 9;
    }

    // -------------------------------------------------
    // DIVIDER
    // -------------------------------------------------

    pdf.setDrawColor(210, 218, 225);
    pdf.setLineWidth(0.3);

    pdf.line(margin, y, pageWidth - margin, y);

    y += 10;

    // -------------------------------------------------
    // SUMMARY HEADING
    // -------------------------------------------------

    addPageIfNeeded(15);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(239, 181, 50);

    pdf.text("Summary", margin, y);

    y += 8;

    // -------------------------------------------------
    // SUMMARY TEXT
    // -------------------------------------------------

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10.5);
    pdf.setTextColor(35, 45, 55);

    const summaryLines = pdf.splitTextToSize(
      result.summary || "",
      contentWidth,
    );

    for (const line of summaryLines) {
      addPageIfNeeded(6);

      pdf.text(line, margin, y);

      y += 5.8;
    }

    y += 7;

    // -------------------------------------------------
    // KEY POINTS
    // -------------------------------------------------

    if (result.keyPoints && result.keyPoints.length > 0) {
      addPageIfNeeded(20);

      pdf.setDrawColor(210, 218, 225);
      pdf.setLineWidth(0.3);

      pdf.line(margin, y, pageWidth - margin, y);

      y += 10;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(239, 181, 50);

      pdf.text("Key Points", margin, y);

      y += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10.5);
      pdf.setTextColor(35, 45, 55);

      result.keyPoints.forEach((point) => {
        const pointLines = pdf.splitTextToSize(point, contentWidth - 7);

        addPageIfNeeded(7);

        pdf.setFont("helvetica", "bold");
        pdf.text("•", margin, y);

        pdf.setFont("helvetica", "normal");

        pointLines.forEach((line, index) => {
          addPageIfNeeded(6);

          pdf.text(line, margin + 6, y);

          y += 5.8;
        });

        y += 2;
      });
    }

    // -------------------------------------------------
    // FOOTER ON EVERY PAGE
    // -------------------------------------------------

    const totalPages = pdf.getNumberOfPages();

    for (let page = 1; page <= totalPages; page++) {
      pdf.setPage(page);

      pdf.setDrawColor(210, 218, 225);
      pdf.setLineWidth(0.3);

      pdf.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(120, 130, 140);

      pdf.text("Document Summary Assistant", margin, pageHeight - 8);

      pdf.text(
        `Page ${page} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 8,
        { align: "right" },
      );
    }

    // -------------------------------------------------
    // DOWNLOAD
    // -------------------------------------------------

    // const safeName = file?.name
    //   ? file.name.replace(/\.[^/.]+$/, "")
    //   : "document";

    // pdf.save(`${safeName}_summary.pdf`);
    const safeName = file?.name
      ? file.name.replace(/\.[^/.]+$/, "")
      : "document";

    const pdfBlob = pdf.output("blob");

    const pdfUrl = URL.createObjectURL(pdfBlob);

    window.open(pdfUrl, "_blank");
  };

  const goToHowItWorks = () => {
    window.dispatchEvent(new CustomEvent("open-how"));
  };

  return (
    <main className="home-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      {!result && (
        <>
          <section className="home-hero">
            <div className="home-hero-content">
              <span className="home-eyebrow">DOCUMENT SUMMARY ASSISTANT</span>

              <h1>
                Summarize Any
                <br />
                Document in <em>Seconds.</em>
              </h1>

              <p className="home-hero-description">
                Upload your PDF or image file and get an AI-generated summary
                with key points.
                <br />
                Save time. Understand faster.
              </p>

              <div className="home-process-mini">
                <div className="home-mini-step">
                  <span className="home-mini-icon">▤</span>

                  <strong>Upload</strong>
                </div>

                <span className="home-mini-arrow">→</span>

                <div className="home-mini-step">
                  <span className="home-mini-icon">✦</span>

                  <strong>Analyze</strong>
                </div>

                <span className="home-mini-arrow">→</span>

                <div className="home-mini-step">
                  <span className="home-mini-icon">✓</span>

                  <strong>Understand</strong>
                </div>
              </div>
            </div>

            {/* HERO VISUAL */}

            <div className="home-hero-visual">
              <div className="home-visual-glow" />

              <div className="home-orbit orbit-a" />
              <div className="home-orbit orbit-b" />

              <div className="home-document-card">
                <div className="home-document-header">
                  <span>PDF</span>
                  <span>✦</span>
                </div>

                <div className="home-document-title" />

                <div className="home-document-line large" />
                <div className="home-document-line" />
                <div className="home-document-line" />
                <div className="home-document-line short" />

                <div className="home-document-image">
                  <span>▧</span>
                </div>

                <div className="home-document-line" />
                <div className="home-document-line short" />
              </div>

              <div className="home-ai-card">
                <div className="home-ai-header">
                  <span>✦</span>
                  <strong>AI SUMMARY</strong>
                </div>

                <div className="home-summary-lines">
                  <i />
                  <i />
                  <i />
                </div>

                <div className="home-summary-points">
                  <span />
                  <i />
                </div>

                <div className="home-summary-points">
                  <span />
                  <i />
                </div>

                <div className="home-summary-points">
                  <span />
                  <i />
                </div>
              </div>

              <div className="home-ai-badge">✦ AI Powered</div>
            </div>
          </section>

          {/* =================================================
              UPLOAD SECTION
          ================================================= */}

          <section className="home-upload-section">
            <UploadZone
              file={file}
              onFile={handleFile}
              error={error}
              onPreview={() => setPreview(true)}
            />

            {file && (
              <div className="home-upload-controls">
                <div>
                  <p className="home-section-label">SUMMARY LENGTH</p>

                  <div className="home-length-buttons">
                    {["short", "medium", "long"].map((item) => (
                      <button
                        key={item}
                        className={length === item ? "selected" : ""}
                        onClick={() => setLength(item)}
                      >
                        <span>
                          {item === "short"
                            ? "☰"
                            : item === "medium"
                              ? "☷"
                              : "≡"}
                        </span>

                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="home-generate-button"
                  onClick={summarize}
                  disabled={loading}
                >
                  {loading ? "Analyzing document..." : "✦ Generate Summary"}
                </button>
              </div>
            )}
          </section>

          {/* =================================================
              FEATURE STRIP
          ================================================= */}

          <section className="home-feature-strip">
            <div className="home-feature-item">
              <div className="home-feature-icon">✦</div>

              <div>
                <h3>AI-Powered Summary</h3>
                <p>Generate concise, useful summaries in seconds.</p>
              </div>
            </div>

            <div className="home-feature-divider" />

            <div className="home-feature-item">
              <div className="home-feature-icon">≡</div>

              <div>
                <h3>Key Points Extraction</h3>
                <p>Get the most important points, clearly listed.</p>
              </div>
            </div>

            <div className="home-feature-divider" />

            <div className="home-feature-item">
              <div className="home-feature-icon">▣</div>

              <div>
                <h3>Save & Revisit</h3>
                <p>Access your summaries anytime from History.</p>
              </div>
            </div>
          </section>

          {/* =================================================
              HOW IT WORKS PREVIEW
          ================================================= */}

          <section className="home-how-section">
            <div className="home-how-header">
              <div>
                <span className="home-section-label">HOW IT WORKS</span>

                <h2>
                  Simple steps to
                  <em> instant understanding.</em>
                </h2>
              </div>

              <button className="home-learn-button" onClick={goToHowItWorks}>
                Learn More →
              </button>
            </div>

            <div className="home-how-grid">
              <div className="home-how-step">
                <div className="home-how-icon">▤</div>

                <span className="home-how-number">1</span>

                <h3>Upload Document</h3>

                <p>Upload your PDF or image file using the upload area.</p>
              </div>

              <div className="home-how-arrow">→</div>

              <div className="home-how-step">
                <div className="home-how-icon">⚙</div>

                <span className="home-how-number">2</span>

                <h3>AI Analysis</h3>

                <p>Our AI reads and analyzes the document content.</p>
              </div>

              <div className="home-how-arrow">→</div>

              <div className="home-how-step">
                <div className="home-how-icon">✦</div>

                <span className="home-how-number">3</span>

                <h3>Get Summary</h3>

                <p>Receive a clear summary and key points instantly.</p>
              </div>

              <div className="home-how-arrow">→</div>

              <div className="home-how-step">
                <div className="home-how-icon">▣</div>

                <span className="home-how-number">4</span>

                <h3>Save & Access</h3>

                <p>Save your results and access them later in History.</p>
              </div>
            </div>
          </section>

          {/* =================================================
              BOTTOM CTA
          ================================================= */}

          <section className="home-bottom-cta">
            <div className="home-cta-icon">✦</div>

            <div className="home-cta-text">
              <h2>
                Understand more.
                <em> Achieve more.</em>
              </h2>

              <p>
                Document Summary Assistant helps you focus on what matters by
                turning long documents into clear insights.
              </p>
            </div>

            <button
              className="home-cta-button"
              onClick={() =>
                document.querySelector(".home-upload-section")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Get Started Now →
            </button>
          </section>

          {/* =====================================================
    FEATURES
===================================================== */}

          <section className="home-features-section">
            <div className="home-features-heading">
              <span className="home-section-label">EVERYTHING YOU NEED</span>

              <h2>
                Built for <em>smarter reading.</em>
              </h2>

              <p>
                From secure authentication to saved summaries, everything is
                designed to make document understanding faster and easier.
              </p>
            </div>

            <div className="home-features-grid">
              {/* FEATURE 1 */}

              <div className="home-feature-card feature-large">
                <div className="home-feature-card-icon">▤</div>

                <div className="home-feature-card-content">
                  <span className="home-feature-number">01</span>

                  <h3>Upload Any Supported Document</h3>

                  <p>
                    Upload PDF, PNG, JPG, or JPEG files directly through the
                    simple drag-and-drop interface.
                  </p>

                  <div className="feature-tags">
                    <span>PDF</span>
                    <span>PNG</span>
                    <span>JPG</span>
                    <span>JPEG</span>
                    <span>10MB</span>
                  </div>
                </div>
              </div>

              {/* FEATURE 2 */}

              <div className="home-feature-card">
                <div className="home-feature-card-icon">✦</div>

                <span className="home-feature-number">02</span>

                <h3>AI-Powered Summaries</h3>

                <p>
                  Transform lengthy documents into clear, useful summaries using
                  AI.
                </p>

                <div className="feature-decoration">✦ AI</div>
              </div>

              {/* FEATURE 3 */}

              <div className="home-feature-card">
                <div className="home-feature-card-icon">≡</div>

                <span className="home-feature-number">03</span>

                <h3>Choose Your Summary Length</h3>

                <p>
                  Control how detailed your result should be with Short, Medium,
                  and Long options.
                </p>

                <div className="feature-length-preview">
                  <span className="active">Short</span>
                  <span>Medium</span>
                  <span>Long</span>
                </div>
              </div>

              {/* FEATURE 4 */}

              <div className="home-feature-card feature-auth">
                <div className="home-feature-card-icon">✓</div>

                <span className="home-feature-number">04</span>

                <h3>Secure Email Authentication</h3>

                <p>
                  Create your account using email verification with a one-time
                  OTP before accessing your account.
                </p>

                <div className="feature-security">
                  <span>✉</span>
                  <span>OTP Verified</span>
                  <span>✓</span>
                </div>
              </div>

              {/* FEATURE 5 */}

              <div className="home-feature-card feature-history">
                <div className="home-feature-card-icon">▣</div>

                <span className="home-feature-number">05</span>

                <h3>Save Your Summary History</h3>

                <p>
                  Logged-in users can save processed documents and revisit their
                  summaries whenever they need them.
                </p>

                <div className="feature-history-preview">
                  <div>
                    <span className="mini-pdf">PDF</span>
                    <span>Resume.pdf</span>
                  </div>

                  <div>
                    <span className="mini-pdf">PDF</span>
                    <span>Research.pdf</span>
                  </div>
                </div>
              </div>

              {/* FEATURE 6 */}

              <div className="home-feature-card">
                <div className="home-feature-card-icon">👤</div>

                <span className="home-feature-number">06</span>

                <h3>Personal Profile & Statistics</h3>

                <p>
                  View your account information and useful statistics about your
                  document-summary activity.
                </p>

                <div className="feature-stat-preview">
                  <div>
                    <strong>12</strong>
                    <span>Documents</span>
                  </div>

                  <div>
                    <strong>18</strong>
                    <span>Summaries</span>
                  </div>

                  <div>
                    <strong>7</strong>
                    <span>Days Active</span>
                  </div>
                </div>
              </div>

              {/* FEATURE 7 */}

              <div className="home-feature-card">
                <div className="home-feature-card-icon">↓</div>

                <span className="home-feature-number">07</span>

                <h3>Download Your Results</h3>

                <p>
                  Save your generated summary and key points as a professionally
                  formatted PDF.
                </p>

                <div className="feature-download-preview">
                  <span>PDF</span>
                  <span>Summary + Key Points</span>
                  <b>↓</b>
                </div>
              </div>

              {/* FEATURE 8 */}

              <div className="home-feature-card">
                <div className="home-feature-card-icon">◉</div>

                <span className="home-feature-number">08</span>

                <h3>Revisit Anytime</h3>

                <p>
                  Return to your saved history, open a previous document, and
                  read its complete summary again.
                </p>

                <div className="feature-revisit">
                  <span>History</span>
                  <b>→</b>
                  <span>Summary</span>
                </div>
              </div>
            </div>

            {/* FEATURE FOOTER */}

            <div className="home-features-footer">
              <div>
                <span className="feature-footer-icon">✦</span>

                <div>
                  <strong>Your documents. Your summaries. Your history.</strong>

                  <p>Everything stays organized under your account.</p>
                </div>
              </div>

              <button
                onClick={() =>
                  document
                    .querySelector(".home-upload-section")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                Start Summarizing →
              </button>
            </div>
          </section>
        </>
      )}

      {/* =====================================================
          AFTER ANALYSIS
      ===================================================== */}

      {result && (
        <section className="analysis-layout">
          <div className="analysis-left">
            <div className="analysis-upload-card">
              <p className="section-label">DOCUMENT</p>

              <h2>Upload another file</h2>

              <p className="analysis-description">
                Replace the current document and generate another summary.
              </p>

              <UploadZone
                file={file}
                onFile={handleFile}
                error={error}
                onPreview={() => setPreview(true)}
              />

              <button
                className="secondary-upload-button"
                onClick={resetDocument}
              >
                + Upload Another Document
              </button>
            </div>
          </div>

          <div className="analysis-right">
            <div className="summary-result">
              <div className="summary-result-top">
                <div>
                  <p className="section-label">SUMMARY READY</p>

                  <h2>
                    {length.charAt(0).toUpperCase() + length.slice(1)} Summary
                  </h2>
                </div>

                <button
                  className="download-summary-button"
                  onClick={downloadSummaryPDF}
                >
                  ↓ Download PDF
                </button>
              </div>

              <p className="summary-text">{result.summary}</p>

              {result.keyPoints && result.keyPoints.length > 0 && (
                <div className="key-points">
                  <h3>Key Points</h3>

                  <ul>
                    {result.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="result-actions">
                <button onClick={() => setPreview(true)}>◉ View File</button>

                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("open-history"));

                    if (onHistorySaved) {
                      onHistorySaved();
                    }
                  }}
                >
                  Save to History
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <FilePreviewModal
        file={preview ? file : null}
        onClose={() => setPreview(false)}
      />
    </main>
  );
}
