import { useEffect, useMemo, useState } from 'react';
import FileList from '../components/FileList';
import FileUploader from '../components/FileUploader';
import MergeButton from '../components/MergeButton';
import type { UploadedPdfFile } from '../types';
import { downloadMergedPdf, mergePdfFiles } from '../utils/pdfUtils';

type Theme = 'light' | 'dark';

function Home() {
  const [files, setFiles] = useState<UploadedPdfFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeProgress, setMergeProgress] = useState(0);
  const [mergedPdfBytes, setMergedPdfBytes] = useState<Uint8Array | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ?? (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccessMessage(null);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const selectedFileCountText = useMemo(() => {
    if (files.length === 0) {
      return 'No files selected';
    }

    if (files.length === 1) {
      return '1 file selected';
    }

    return `${files.length} files selected`;
  }, [files.length]);

  const handleThemeToggle = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';

    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    window.localStorage.setItem('theme', nextTheme);
  };

  const handleFilesAdded = (incomingFiles: File[]) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setMergedPdfBytes(null);

    const incoming = incomingFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size
    }));

    setFiles((previous) => [...previous, ...incoming]);
  };

  const handleMoveFile = (id: string, direction: 'up' | 'down') => {
    setSuccessMessage(null);
    setMergedPdfBytes(null);
    setFiles((previous) => {
      const index = previous.findIndex((item) => item.id === id);
      if (index === -1) {
        return previous;
      }

      const nextIndex = direction === 'up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= previous.length) {
        return previous;
      }

      const reordered = [...previous];
      const [moved] = reordered.splice(index, 1);
      reordered.splice(nextIndex, 0, moved);

      return reordered;
    });
  };

  const handleRemoveFile = (id: string) => {
    setSuccessMessage(null);
    setMergedPdfBytes(null);
    setFiles((previous) => previous.filter((item) => item.id !== id));
  };

  const handleMerge = async () => {
    if (files.length === 0) {
      setErrorMessage('Please add at least one PDF file to merge.');
      return;
    }

    setIsMerging(true);
    setMergeProgress(8);
    setErrorMessage(null);
    setSuccessMessage(null);

    const startedAt = performance.now();
    const minVisibleDurationMs = 900;
    const progressTimer = window.setInterval(() => {
      setMergeProgress((previous) => {
        const increment = Math.floor(Math.random() * 12) + 5;
        return Math.min(previous + increment, 92);
      });
    }, 150);

    try {
      const mergedBytes = await mergePdfFiles(files.map((item) => item.file));
      setMergedPdfBytes(mergedBytes);
      setMergeProgress(100);
      setSuccessMessage('Merged PDF is ready. You can download it now.');
    } catch {
      setErrorMessage('Unable to merge the selected PDFs. Please try a different file set.');
      setMergeProgress(0);
    } finally {
      window.clearInterval(progressTimer);
      const elapsed = performance.now() - startedAt;
      if (elapsed < minVisibleDurationMs) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, minVisibleDurationMs - elapsed)
        );
      }
      setIsMerging(false);
    }
  };

  const handleDownloadMergedPdf = () => {
    if (!mergedPdfBytes) {
      return;
    }

    downloadMergedPdf(mergedPdfBytes, 'merged-document.pdf');
    setSuccessMessage('Download started.');
  };

  return (
    <main className="page-bg relative min-h-screen overflow-hidden px-4 py-8 text-zinc-900 dark:text-zinc-100">
      <div
        className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-cyan-300/40 blur-3xl dark:bg-cyan-700/30"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-28 bottom-10 h-96 w-96 rounded-full bg-brand-300/40 blur-3xl dark:bg-brand-700/25"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-5">
        <header className="glass-panel animate-rise p-6 sm:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-brand-300/70 bg-brand-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-800 dark:border-brand-500/60 dark:bg-brand-800/40 dark:text-brand-100">
              Browser-Only PDF Merge
            </span>
            <button
              type="button"
              onClick={handleThemeToggle}
              className="button-secondary"
              aria-label="Toggle light and dark theme"
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>

          <h1 className="font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            Merge PDFs Fast.
            <br />
            <span className="bg-gradient-to-r from-brand-700 to-cyan-700 bg-clip-text text-transparent dark:from-brand-300 dark:to-cyan-300">
              Keep Every File Private.
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-zinc-700 dark:text-zinc-300 sm:text-base">
            Upload, reorder, merge, and download directly in your browser. No server,
            no waiting room, no file tracking.
          </p>

          <div className="mt-4 flex flex-wrap gap-2" role="status" aria-live="polite">
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
              {selectedFileCountText}
            </span>
            <span className="rounded-full border border-zinc-300/80 bg-white/75 px-3 py-1 text-xs font-semibold dark:border-zinc-600 dark:bg-zinc-900/55">
              100% client-side processing
            </span>
          </div>
        </header>

        <FileUploader onFilesAdded={handleFilesAdded} />

        <FileList
          files={files}
          onMoveUp={(id) => handleMoveFile(id, 'up')}
          onMoveDown={(id) => handleMoveFile(id, 'down')}
          onRemove={handleRemoveFile}
        />

        {errorMessage ? (
          <p
            className="animate-rise rounded-2xl border border-red-300/90 bg-red-50/90 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-700 dark:bg-red-950/35 dark:text-red-200"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        <section className="glass-panel animate-rise p-4 sm:p-5" aria-label="Merge controls">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Finalize your queue and generate one merged PDF document.
            </p>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <MergeButton
                disabled={files.length === 0}
                loading={isMerging}
                onMerge={handleMerge}
              />
              <button
                type="button"
                onClick={handleDownloadMergedPdf}
                disabled={!mergedPdfBytes || isMerging}
                className="button-secondary w-full sm:w-auto"
              >
                Download Merged PDF
              </button>
            </div>
          </div>
          {isMerging ? (
            <div className="mt-4" role="status" aria-live="polite" aria-label="Merge in progress">
              <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
                <span>Merging in progress</span>
                <span>{mergeProgress}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-bar"
                  style={{ width: `${mergeProgress}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          ) : null}
        </section>
      </div>
      {successMessage ? (
        <div className="toast-success" role="status" aria-live="polite" aria-atomic="true">
          {successMessage}
        </div>
      ) : null}
    </main>
  );
}

export default Home;
