import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';

export interface SpotlightResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'app' | 'folder' | 'file';
  icon: string;
}

interface SpotlightProps {
  isOpen: boolean;
  results: SpotlightResult[];
  onClose: () => void;
  onSelect: (result: SpotlightResult) => void;
}

export const Spotlight = ({ isOpen, results, onClose, onSelect }: SpotlightProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
      return;
    }

    const timer = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return results;

    return results.filter((result) =>
      `${result.title} ${result.subtitle} ${result.type}`.toLowerCase().includes(normalizedQuery)
    );
  }, [query, results]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((current) => Math.min(current + 1, Math.max(filteredResults.length - 1, 0)));
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((current) => Math.max(current - 1, 0));
      }

      if (event.key === 'Enter' && filteredResults[selectedIndex]) {
        event.preventDefault();
        onSelect(filteredResults[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredResults, isOpen, onClose, onSelect, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10003] flex items-start justify-center bg-black/28 px-4 pt-24 backdrop-blur-md" onClick={onClose}>
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[28px] border shadow-2xl bg-[var(--color-window-bg)] border-[var(--color-window-border)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b px-5 py-4 bg-[var(--color-window-header)] border-[var(--color-window-header-border)]">
          <Search className="h-5 w-5 text-[var(--color-text-muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search apps, folders, files..."
            className="w-full bg-transparent text-base outline-none placeholder:text-[var(--color-text-subtle)] text-[var(--color-text)]"
          />
        </div>

        <div className="max-h-[420px] overflow-auto p-3 bg-[var(--color-panel-bg)]">
          {filteredResults.length === 0 ? (
            <div className="rounded-2xl px-4 py-10 text-center text-sm text-[var(--color-text-muted)]">
              No results found.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredResults.slice(0, 8).map((result, index) => {
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={result.id}
                    type="button"
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => onSelect(result)}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors"
                    style={{
                      backgroundColor: isSelected ? 'var(--color-accent-soft)' : 'transparent',
                    }}
                  >
                    <img src={result.icon} alt="" draggable={false} className="h-10 w-10 rounded-xl object-contain" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-[var(--color-text)]">{result.title}</div>
                      <div className="truncate text-xs text-[var(--color-text-muted)]">{result.subtitle}</div>
                    </div>
                    <div className="ml-auto rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-subtle)] bg-[var(--color-panel-soft)]">
                      {result.type}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
