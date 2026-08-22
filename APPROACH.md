# 200-Word Approach

The project is organized as a modular full-stack application so new features can be added without placing all UI logic inside one component. React pages handle major screens while reusable components handle navigation, upload, previews, authentication dialogs, confirmation dialogs, icons, and feature sections. A shared stylesheet keeps the same navy, gold, typography, spacing, and modal design across the application.

The backend remains responsible for document processing. Uploaded PDFs are processed with a compatibility-fixed PDF parser, while images are passed through Tesseract.js OCR. Extracted text is sent to Gemini through a server-side environment variable so the API key is not exposed in the browser.

The user flow is separated into clear states: landing/upload, processing/result, authentication, and history. An eye action is provided for viewing the currently uploaded file, and history rows have individual delete controls with a centered confirmation modal.

The current version deliberately separates the UI architecture from permanent authentication and storage. The next backend stage can add a database for users and history, an email provider for OTP delivery, secure password hashing, sessions/JWT, and persistent document storage without requiring the frontend to be rewritten. This approach keeps the code clean, testable, and easier to explain during an assessment.
