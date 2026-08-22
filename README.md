<div align="center">

# 📄 DocPilot

### AI-Powered Document Summary Assistant

**Turn lengthy documents into clear, concise and actionable insights.**

Upload a PDF or image → Extract text with OCR → Generate an AI summary → Save it to your history.

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-DocPilot-efb532?style=for-the-badge)](https://docpilot-nu.vercel.app/)
[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

<br/>

[![AI](https://img.shields.io/badge/AI-Gemini_|_Groq_|_OpenRouter-8B5CF6?style=flat-square)](https://ai.google.dev/)
[![OCR](https://img.shields.io/badge/OCR-Enabled-F59E0B?style=flat-square)](#)
[![Deployment](https://img.shields.io/badge/Deployed-Vercel_|_Render-000000?style=flat-square)](#)

</div>

---

## ✨ What is DocPilot?

**DocPilot** is a full-stack AI document analysis platform built to make long documents easier and faster to understand.

Instead of manually reading through pages of content, users can upload a document and let DocPilot:

> 📄 **Extract** → 🔍 **Understand** → 🤖 **Summarize** → 💡 **Highlight Key Points** → 📚 **Save**

It supports both text-based documents and scanned/image documents through OCR.

---

## 🚀 Features

<table>
<tr>
<td width="50%">

### 📄 Smart Document Processing

- PDF document support
- Image/scanned document support
- Text extraction
- OCR processing
- File preview
- File size validation

</td>

<td width="50%">

### 🤖 AI Summarization

- AI-powered summaries
- Short summary
- Medium summary
- Long summary
- Automatic key points
- Multi-provider AI fallback

</td>
</tr>

<tr>
<td>

### 🔐 Secure Authentication

- Email-based registration
- OTP verification
- Password hashing
- Login/logout
- User profiles
- Account information

</td>

<td>

### 📚 Personal History

- Save generated summaries
- View previous summaries
- Reopen saved documents
- Delete history
- Document statistics

</td>
</tr>

<tr>
<td>

### 📥 Summary Management

- Summary preview
- Download summaries
- Structured formatting
- Clean readable output

</td>

<td>

### 📱 Modern Experience

- Responsive design
- Mobile navigation
- Dark professional UI
- Smooth animations
- Interactive components
- Responsive layouts

</td>
</tr>
</table>

---

# 🧠 AI Fallback Architecture

DocPilot doesn't depend on a single AI provider.

If the primary AI provider is unavailable or reaches its limit, the system can move to the next provider.

```text
                    Extracted Text
                          │
                          ▼
                 ┌─────────────────┐
                 │     Gemini      │
                 │   Primary AI    │
                 └────────┬────────┘
                          │
                       Success?
                       /       \
                     YES        NO
                      │          │
                      ▼          ▼
                   Summary      Groq
                                  │
                               Success?
                               /       \
                             YES        NO
                              │          │
                              ▼          ▼
                           Summary   OpenRouter
