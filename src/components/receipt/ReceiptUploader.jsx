import { useEffect, useMemo, useRef, useState } from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';
import { formatFileSize } from '../../utils/format';

const ALLOWED = ['jpg', 'jpeg', 'png', 'pdf'];
const MAX_BYTES = 10 * 1024 * 1024;

export function validateReceiptFile(file) {
  const extension = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : '';
  if (!ALLOWED.includes(extension)) return 'Only JPG, JPEG, PNG and PDF files are allowed.';
  if (file.size > MAX_BYTES) return 'The file is too large. Maximum size is 10 MB.';
  if (file.size === 0) return 'The file is empty.';
  return '';
}

export default function ReceiptUploader({ file, onSelect, onClear, onAnalyze, busy, statusText }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState('');

  const previewUrl = useMemo(
    () => (file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null),
    [file]
  );
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  function pick(selected) {
    if (!selected) return;
    const message = validateReceiptFile(selected);
    if (message) {
      setLocalError(message);
      return;
    }
    setLocalError('');
    onSelect(selected);
  }

  return (
    <div className="card p-5">
      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pick(e.dataTransfer.files[0]);
          }}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-12 text-center transition ${
            dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <UploadCloud className="h-10 w-10 text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-700">Drag and drop your receipt here</p>
          <p className="mt-1 text-xs text-slate-500">JPG, JPEG, PNG or PDF, up to 10 MB</p>
          <button type="button" className="btn-primary mt-4" onClick={() => inputRef.current?.click()}>
            Choose file
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={(e) => {
              pick(e.target.files[0]);
              e.target.value = '';
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            {previewUrl ? (
              <img src={previewUrl} alt="Receipt preview" className="h-full w-full object-cover" />
            ) : (
              <FileText className="h-10 w-10 text-slate-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
            <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
            {busy && (
              <p className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                {statusText}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={onAnalyze} disabled={busy}>
              {busy ? 'Working...' : 'Analyze receipt'}
            </button>
            <button className="btn-secondary" onClick={onClear} disabled={busy} aria-label="Remove file">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      {localError && <p className="mt-3 text-sm text-red-600">{localError}</p>}
    </div>
  );
}
