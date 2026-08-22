## Approach

1. **User Authentication**

   * Users create an account using their name, email, and password.
   * Email verification is handled through a one-time OTP.
   * After successful verification/login, the user account is maintained on the application.

2. **Document Upload**

   * Users can upload **PDF, PNG, JPG, and JPEG** files up to **10 MB**.
   * The frontend sends the selected document and summary-length preference to the Node.js backend using Axios.

3. **Document Processing**

   * The backend receives the file using **Multer**.
   * PDF and image content is extracted using the appropriate processing/OCR method.
   * The extracted text is then passed to the AI summarization layer.

4. **AI Summarization**

   * The application uses **Gemini API** to generate summaries.
   * Users can choose **Short, Medium, or Long** summaries.
   * The AI returns a structured summary along with important **key points**. 

5. **History Management**

   * Logged-in users can save generated summaries to their personal history.
   * Saved documents are stored in **MongoDB** and associated with the user's ID.
   * History can be retrieved, viewed, and deleted through backend APIs. 

6. **PDF Export**

   * Generated summaries and key points can be formatted into a professional PDF using **jsPDF**.
   * Users can open/download their generated summary.

7. **Frontend Architecture**

   * The application is built with **React** using reusable components such as Navbar, UploadZone, AuthModal, History, Profile, and FilePreviewModal.
   * Axios is used for communication between frontend and backend.

8. **Backend & Database**

   * **Node.js + Express.js** provide REST APIs.
   * **MongoDB + Mongoose** store users and document history.
   * The backend is deployed on **Render**, while the frontend is deployed on **Vercel**.
