# Browser PDF Merger (React + TypeScript + Vite)

A simple and privacy-friendly PDF merger web app. Users can upload multiple PDFs, reorder files, remove files, merge them in the browser using `pdf-lib`, and download the merged output.

## Features

- Upload/select multiple PDF files
- View uploaded file name and file size
- Reorder files with move up/down controls
- Remove any file from the merge queue
- Merge PDFs completely client-side with `pdf-lib`
- Download merged PDF as `merged-document.pdf`
- Loading state while merging
- Responsive layout for mobile and desktop
- Light and dark theme toggle

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- pdf-lib
- ESLint + Prettier

## Project Structure

```text
src/
  components/
    FileUploader.tsx
    FileList.tsx
    MergeButton.tsx
  pages/
    Home.tsx
  styles/
    tailwind.css
  utils/
    pdfUtils.ts
  App.tsx
  main.tsx
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run in development

```bash
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## How PDF Merging Works

The app uses `pdf-lib` in `src/utils/pdfUtils.ts`:

1. It creates a new empty PDF document.
2. For each uploaded PDF file:
   - Reads file bytes in the browser (`arrayBuffer()`)
   - Loads source PDF with `PDFDocument.load(...)`
   - Copies all pages from source to the new document
3. Saves merged bytes with `mergedPdf.save()`
4. Creates a Blob URL and triggers download in the browser

No backend is used. Files are never uploaded to a server.

## UI Overview

- Header includes app title, privacy summary, and theme toggle.
- Upload section provides a file picker limited to `.pdf` files.
- File list shows selected files with size and reorder/remove actions.
- Merge button starts processing and shows a loading label.
- Error message appears if merge fails.

## Quality Tooling

- Run lint:

```bash
npm run lint
```

- Run formatter:

```bash
npm run format
```
