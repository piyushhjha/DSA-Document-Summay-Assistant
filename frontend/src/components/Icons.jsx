import React from "react";
export function DocumentIcon({ small = false }) {
  return (
    <svg
      className={small ? "document-icon small" : "document-icon"}
      viewBox="0 0 64 64"
    >
      <path d="M16 6h22l14 14v38H16z" />
      <path d="M38 6v15h14" />
      <path d="M25 32h18M25 41h18M25 50h11" />
    </svg>
  );
}

export function FeatureIcon({ type }) {
  const paths = {
    extraction: (
      <>
        <path d="M18 7h18l10 10v40H18z" />
        <path d="M36 7v11h10M26 31h12M26 40h12M26 49h7" />
      </>
    ),
    ai: (
      <>
        <path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M49 15l-6 6M21 43l-6 6" />
        <circle cx="32" cy="32" r="12" />
      </>
    ),
    points: (
      <>
        <path d="M32 7l7.7 15.6 17.3 2.5-12.5 12.2 3 17.2L32 46.4 16.5 54.5l3-17.2L7 25.1l17.3-2.5z" />
      </>
    ),
    secure: (
      <>
        <path d="M32 6l21 8v15c0 13-8.7 24.1-21 29-12.3-4.9-21-16-21-29V14z" />
        <path d="M22 31l7 7 14-15" />
      </>
    ),
  };
  return (
    <svg className="feature-icon" viewBox="0 0 64 64">
      {paths[type]}
    </svg>
  );
}
