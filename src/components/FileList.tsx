import { useState } from 'react';
import type { UploadedPdfFile } from '../types';
import { formatFileSize } from '../utils/pdfUtils';

interface FileListProps {
  files: UploadedPdfFile[];
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (newOrder: string[]) => void;
}

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="4" r="1.5" />
      <circle cx="11" cy="4" r="1.5" />
      <circle cx="5" cy="8" r="1.5" />
      <circle cx="11" cy="8" r="1.5" />
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="11" cy="12" r="1.5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function FileList({ files, onMoveUp, onMoveDown, onRemove, onReorder }: FileListProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDraggingId(id);

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggingId !== id) setDragOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;
    const ids = files.map((f) => f.id);
    const from = ids.indexOf(draggingId);
    const to = ids.indexOf(targetId);
    const reordered = [...ids];
    reordered.splice(from, 1);
    reordered.splice(to, 0, draggingId);
    onReorder(reordered);
    setDraggingId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  const handlePreview = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank', 'noopener,noreferrer');
    // Object URL not revoked here — the opened tab holds the reference and
    // the browser cleans it up when that tab closes.
  };

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
          {files.length} {files.length === 1 ? 'file' : 'files'}
        </span>
      </div>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Drag to reorder, or use the arrow buttons.
      </p>

      <ul className="mt-4 space-y-2" aria-live="polite">
        {files.map((uploadedFile, index) => {
          const isBeingDragged = draggingId === uploadedFile.id;
          const isDropTarget = dragOverId === uploadedFile.id;

          return (
            <li
              key={uploadedFile.id}
              draggable
              onDragStart={() => handleDragStart(uploadedFile.id)}
              onDragOver={(e) => handleDragOver(e, uploadedFile.id)}
              onDrop={(e) => handleDrop(e, uploadedFile.id)}
              onDragEnd={handleDragEnd}
              style={{ animationDelay: `${index * 70}ms` }}
              className={`animate-rise flex items-center gap-3 rounded-2xl border p-3 shadow-sm transition-all duration-150 ${
                isDropTarget
                  ? 'border-brand-400 bg-brand-50/80 dark:border-brand-500 dark:bg-brand-900/20'
                  : 'border-zinc-200/90 bg-white/80 dark:border-zinc-700 dark:bg-zinc-900/60'
              } ${isBeingDragged ? 'opacity-40 shadow-none' : 'opacity-100'}`}
            >
              <span
                className="shrink-0 cursor-grab text-zinc-400 hover:text-zinc-600 active:cursor-grabbing dark:text-zinc-500 dark:hover:text-zinc-300"
                aria-hidden="true"
              >
                <GripIcon />
              </span>

              {/* flex-1 min-w-0 ensures this section shrinks and truncates before buttons ever wrap */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 rounded-md bg-brand-500/15 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
                    #{index + 1}
                  </span>
                  <p className="truncate text-sm font-semibold">{uploadedFile.name}</p>
                </div>
                <p className="mt-0.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>

              {/* shrink-0 + flex-nowrap keeps all buttons on one line always */}
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onMoveUp(uploadedFile.id)}
                  disabled={index === 0}
                  aria-label={`Move ${uploadedFile.name} up`}
                  className="button-secondary"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => onMoveDown(uploadedFile.id)}
                  disabled={index === files.length - 1}
                  aria-label={`Move ${uploadedFile.name} down`}
                  className="button-secondary"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handlePreview(uploadedFile.file)}
                  aria-label={`Preview ${uploadedFile.name} in new tab`}
                  title="Preview in new tab"
                  className="button-secondary"
                >
                  <EyeIcon />
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
          );
        })}
      </ul>
    </section>
  );
}

export default FileList;
