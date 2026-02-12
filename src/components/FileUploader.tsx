import type { ChangeEvent } from 'react';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
}

function FileUploader({ onFilesAdded }: FileUploaderProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const pdfFiles = selectedFiles.filter(
      (file) => file.type === 'application/pdf' || file.name.endsWith('.pdf')
    );

    if (pdfFiles.length > 0) {
      onFilesAdded(pdfFiles);
    }

    // Reset input so selecting the same file again still triggers onChange.
    event.target.value = '';
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
        className="group block cursor-pointer rounded-2xl border-2 border-dashed border-zinc-300/90 bg-white/70 p-6 transition hover:border-brand-400 hover:bg-white dark:border-zinc-600 dark:bg-zinc-900/60 dark:hover:border-brand-500 dark:hover:bg-zinc-900"
      >
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-brand-700 dark:text-brand-300">
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
          <p className="text-base font-semibold">Drop PDFs here or click to browse</p>
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
