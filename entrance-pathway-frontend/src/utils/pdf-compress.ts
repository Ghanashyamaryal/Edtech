import { PDFDocument } from "pdf-lib";

// Re-saves a PDF with object streams + metadata stripped. Typically reduces
// size by 10–30% on text-heavy PDFs and effectively 0% on already-optimized
// or scanned image PDFs. Falls back to the original file if anything throws
// or if compression doesn't actually shrink it.
export async function compressPdf(file: File): Promise<File> {
  if (file.type !== "application/pdf") return file;

  try {
    const inputBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(inputBytes, { ignoreEncryption: true });

    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("");
    pdfDoc.setCreator("");

    const outputBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    if (outputBytes.byteLength >= file.size) return file;

    return new File([outputBytes as BlobPart], file.name, {
      type: "application/pdf",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}
