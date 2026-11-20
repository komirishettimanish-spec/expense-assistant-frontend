import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { getSavingSuggestions } from '../../api/aiApi';
import { getErrorMessage } from '../../utils/errors';

const UNAVAILABLE = 'AI suggestions are temporarily unavailable. Please try again later.';

export default function SuggestionsCard() {
  const [state, setState] = useState({ loading: true, suggestions: [], error: '' });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const data = await getSavingSuggestions();
      setState({ loading: false, suggestions: data.suggestions || [], error: '' });
    } catch (err) {
      const status = err.response?.status;
      const unavailable = !err.response || status === 502 || status === 503 || status === 504;
      setState({ loading: false, suggestions: [], error: unavailable ? UNAVAILABLE : getErrorMessage(err) });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-slate-800">
          <span className="rounded-lg bg-violet-100 p-1.5 text-violet-600">
            <Sparkles className="h-4 w-4" />
          </span>
          AI Saving Suggestions
        </h3>
        <button
          onClick={load}
          disabled={state.loading}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          aria-label="Refresh suggestions"
        >
          <RefreshCw className={`h-4 w-4 ${state.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {state.loading && <p className="py-6 text-center text-sm text-slate-500">Generating suggestions...</p>}

      {!state.loading && state.error && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{state.error}</p>
      )}

      {!state.loading && !state.error && state.suggestions.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-500">No suggestions available right now.</p>
      )}

      {!state.loading && state.suggestions.length > 0 && (
        <ul className="space-y-3">
          {state.suggestions.map((text, index) => (
            <li key={index} className="flex gap-3 text-sm text-slate-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                {index + 1}
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
