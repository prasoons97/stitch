import type { UploadedPdfFile } from '../types';
import { formatFileSize } from '../utils/pdfUtils';

interface FileListProps {
  files: UploadedPdfFile[];
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onRemove: (id: string) => void;
}

function FileList({ files, onMoveUp, onMoveDown, onRemove }: FileListProps) {
  if (files.length === 0) {
    return (
      <section className="glass-panel animate-rise px-5 py-8 text-center sm:px-6">
        <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-zinc-300/90 bg-white/60 px-5 py-8 dark:border-zinc-600 dark:bg-zinc-900/50">
          <p className="font-display text-xl font-bold tracking-tight">No PDFs in queue yet</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Upload files above, then reorder them before merging.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="glass-panel animate-rise p-5 sm:p-6" aria-labelledby="file-list-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="file-list-heading" className="font-display text-xl font-bold tracking-tight">
          Merge Queue
        </h2>
        <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
          {files.length} files
        </span>
      </div>

      <ul className="mt-4 space-y-3" aria-live="polite">
        {files.map((uploadedFile, index) => (
          <li
            key={uploadedFile.id}
            style={{ animationDelay: `${index * 70}ms` }}
            className="animate-rise flex flex-col gap-4 rounded-2xl border border-zinc-200/90 bg-white/80 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/60 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-md bg-brand-500/15 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
                  #{index + 1}
                </span>
                <p className="truncate text-sm font-semibold sm:text-base">{uploadedFile.name}</p>
              </div>
              <p className="font-mono text-xs text-zinc-600 dark:text-zinc-300">
                {formatFileSize(uploadedFile.size)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onMoveUp(uploadedFile.id)}
                disabled={index === 0}
                aria-label={`Move ${uploadedFile.name} up`}
                className="button-secondary"
              >
                Move Up
              </button>
              <button
                type="button"
                onClick={() => onMoveDown(uploadedFile.id)}
                disabled={index === files.length - 1}
                aria-label={`Move ${uploadedFile.name} down`}
                className="button-secondary"
              >
                Move Down
              </button>
              <button
                type="button"
                onClick={() => onRemove(uploadedFile.id)}
                aria-label={`Remove ${uploadedFile.name}`}
                className="button-danger"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FileList;
