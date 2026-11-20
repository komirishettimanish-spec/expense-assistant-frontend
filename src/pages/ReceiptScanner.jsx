import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { uploadReceipt } from '../api/receiptApi';
import { createExpense } from '../api/expenseApi';
import { getErrorMessage } from '../utils/errors';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/common/PageHeader';
import ErrorMessage from '../components/common/ErrorMessage';
import ReceiptUploader from '../components/receipt/ReceiptUploader';
import ExpenseForm from '../components/expenses/ExpenseForm';

export default function ReceiptScanner() {
  const navigate = useNavigate();
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function analyze() {
    setBusy(true);
    setUploadError('');
    setStatusText('Uploading receipt...');
    let uploadFinished = false;
    try {
      const data = await uploadReceipt(file, (event) => {
        if (!uploadFinished && event.total && event.loaded >= event.total) {
          uploadFinished = true;
          setStatusText('Reading receipt...');
          timer.current = setTimeout(() => setStatusText('Analyzing receipt...'), 5000);
        }
      });
      setResult(data);
    } catch (err) {
      setUploadError(getErrorMessage(err, 'The receipt could not be analyzed.'));
    } finally {
      clearTimeout(timer.current);
      setBusy(false);
      setStatusText('');
    }
  }

  function reset() {
    setFile(null);
    setResult(null);
    setUploadError('');
    setSaveError('');
  }

  async function save(payload) {
    setSaving(true);
    setSaveError('');
    try {
      await createExpense(payload);
      toast.success('Expense saved successfully.');
      navigate('/expenses');
    } catch (err) {
      setSaveError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const missing = result
    ? [
        !result.merchantName && 'merchant',
        !result.expenseDate && 'date',
        !result.amount && 'amount',
      ].filter(Boolean)
    : [];

  return (
    <div>
      <PageHeader
        title="Receipt Scanner"
        subtitle="Upload a receipt. We read it, extract the details, and you review them before saving."
      />

      {!result && (
        <div className="space-y-4">
          <ReceiptUploader
            file={file}
            onSelect={(selected) => {
              setFile(selected);
              setUploadError('');
            }}
            onClear={reset}
            onAnalyze={analyze}
            busy={busy}
            statusText={statusText}
          />
          <ErrorMessage message={uploadError} onRetry={file && !busy ? analyze : undefined} />
        </div>
      )}

      {result && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="card p-5 lg:col-span-3">
            <h2 className="mb-1 text-base font-semibold text-slate-900">Review extracted details</h2>
            <p className="mb-4 text-sm text-slate-500">Check every field and correct anything the scan got wrong.</p>
            {missing.length > 0 && (
              <p className="mb-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                Could not read the {missing.join(', ')} from this receipt. Please fill it in before saving.
              </p>
            )}
            <ExpenseForm
              initial={{
                merchantName: result.merchantName || '',
                expenseDate: result.expenseDate || undefined,
                amount: result.amount ?? '',
                category: result.category || 'OTHER',
                description: result.description || '',
                items: result.items || [],
                receiptFileName: result.receiptFileName,
              }}
              onSubmit={save}
              onCancel={reset}
              submitLabel="Save Expense"
              saving={saving}
              serverError={saveError}
            />
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="card p-5">
              <h3 className="mb-2 text-sm font-semibold text-slate-800">Scan another receipt</h3>
              <p className="mb-3 text-sm text-slate-500">Discard this result and upload a different file.</p>
              <button className="btn-secondary w-full" onClick={reset} disabled={saving}>
                Scan another receipt
              </button>
            </div>
            <details className="card p-5">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800">Show OCR text</summary>
              <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                {result.ocrText || 'No text was returned.'}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
