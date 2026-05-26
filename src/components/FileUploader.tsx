import { useState } from 'react';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
  onFilesRejected: (rejectedCount: number, allRejected: boolean) => void;
}

function FileUploader({ onFilesAdded, onFilesRejected }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const processFiles = (rawFiles: File[]) => {
    if (rawFiles.length === 0) return;

    const pdfFiles = rawFiles.filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    const rejectedCount = rawFiles.length - pdfFiles.length;

    if (rejectedCount > 0) {
      onFilesRejected(rejectedCount, pdfFiles.length === 0);
    }

    if (pdfFiles.length > 0) {
      onFilesAdded(pdfFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(Array.from(e.target.files ?? []));
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear when leaving the drop zone entirely, not when moving over child elements.
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <section className="glass-panel animate-rise p-5 sm:p-6" aria-labelledby="upload-heading">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 id="upload-heading" className="font-display text-xl font-bold tracking-tight">
            Add PDF Files
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Select multiple PDFs. Files stay on your device and are never uploaded.
          </p>
        </div>
        <span className="rounded-full border border-cyan-300/70 bg-cyan-100/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-800 dark:border-cyan-500/60 dark:bg-cyan-900/40 dark:text-cyan-200">
          Private
        </span>
      </div>

      <label
        htmlFor="pdf-uploader"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group block cursor-pointer rounded-2xl border-2 border-dashed p-6 transition ${
          isDragOver
            ? 'border-brand-400 bg-brand-50/80 dark:border-brand-400 dark:bg-brand-900/25'
            : 'border-zinc-300/90 bg-white/70 hover:border-brand-400 hover:bg-white dark:border-zinc-600 dark:bg-zinc-900/60 dark:hover:border-brand-500 dark:hover:bg-zinc-900'
        }`}
      >
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">
          <div
            className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl transition ${
              isDragOver
                ? 'bg-brand-500/25 text-brand-600 dark:text-brand-300'
                : 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M12 16V6" />
              <path d="m8 10 4-4 4 4" />
              <path d="M20 15v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
            </svg>
          </div>
          <p className="text-base font-semibold">
            {isDragOver ? 'Release to add PDFs' : 'Drop PDFs here or click to browse'}
          </p>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
            Supports selecting multiple files in one go
          </p>
        </div>
      </label>

      <input
        id="pdf-uploader"
        type="file"
        accept="application/pdf,.pdf"
        multiple
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Select PDF files"
      />
    </section>
  );
}

export default FileUploader;
