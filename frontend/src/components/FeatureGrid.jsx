import React from "react";
import { FeatureIcon } from "./Icons";

export default function FeatureGrid() {
  return (
    <section className="features" id="about">
      <div>
        <FeatureIcon type="extraction" />
        <div>
          <h3>Smart Extraction</h3>
          <p>Extract text from PDFs and images using OCR technology.</p>
        </div>
      </div>
      <div>
        <FeatureIcon type="ai" />
        <div>
          <h3>AI Summarization</h3>
          <p>Get concise, context-aware summaries in your preferred length.</p>
        </div>
      </div>
      <div>
        <FeatureIcon type="points" />
        <div>
          <h3>Key Points</h3>
          <p>Automatically identify the most important information.</p>
        </div>
      </div>
      <div>
        <FeatureIcon type="secure" />
        <div>
          <h3>Secure &amp; Private</h3>
          <p>
            Files are processed for your request and not permanently stored.
          </p>
        </div>
      </div>
    </section>
  );
}
