import pdf from "pdf-parse-debugging-disabled";
import { createWorker } from "tesseract.js";

export async function extractText(file) {
  const type = file.mimetype || "";

  if (type === "application/pdf") {
    const data = await pdf(file.buffer);
    if (data.text?.trim()) {
      return { text: data.text, method: "PDF text extraction" };
    }
    throw new Error("This PDF appears to be scanned. Upload its pages as images for OCR.");
  }

  if (type.startsWith("image/")) {
    const worker = await createWorker("eng");
    const { data } = await worker.recognize(file.buffer);
    await worker.terminate();
    return { text: data.text, method: "OCR" };
  }

  throw new Error("Unsupported file type. Please upload a PDF or image.");
}