# Document Summary Assistant — V3

A structured React + Node/Express document summarization application.

## Frontend structure

```text
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── UploadZone.jsx
│   ├── FilePreviewModal.jsx
│   ├── ConfirmModal.jsx
│   ├── AuthModal.jsx
│   ├── FeatureGrid.jsx
│   └── Icons.jsx
├── pages/
│   ├── Home.jsx
│   ├── Workspace.jsx
│   ├── History.jsx
│   └── HowItWorks.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Run backend

```powershell
cd backend
npm install
copy .env.example .env
npm run dev
```

## Run frontend

Open another VS Code terminal:

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

## Environment

Backend `.env`:

```env
PORT=5000
GEMINI_API_KEY=your_key_here
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000
```

The backend uses the fixed `pdf-parse-debugging-disabled` package to avoid the broken test-file startup error encountered with the old `pdf-parse` package.

## Current feature stage

The frontend is intentionally split into reusable components and pages. Upload, preview, summary UI, history UI, login UI, OTP UI, and centered delete confirmation are structured separately.

Authentication, real email OTP delivery, persistent user history, and permanent document storage should be connected to a database/email service in the next backend stage rather than faking those functions in the browser.
