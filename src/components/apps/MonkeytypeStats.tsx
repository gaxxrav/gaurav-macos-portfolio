import { useEffect, useMemo, useState } from 'react';

type PersonalBest = {
  category: string;
  label: string;
  wpm: number | null;
  raw: number | null;
  accuracy: number | null;
  consistency: number | null;
  timestamp: string | null;
  language: string | null;
  difficulty: string | null;
  punctuation: boolean;
  numbers: boolean;
};

type MonkeytypeProfileResponse = {
  username: string;
  personalBests: PersonalBest[];
  fetchedAt: string;
};

const REFRESH_INTERVAL_MS = 60000;
const MONKEYTYPE_USERNAME = 'gaxxrav';

const formatDateTime = (value: string | null) => {
  if (!value) return 'Unavailable';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const formatDecimal = (value: number | null, digits = 1) => {
  if (value === null) return 'N/A';
  return value.toFixed(digits);
};

const formatPbFlags = (best: PersonalBest) => {
  const flags = [best.language, best.difficulty].filter(Boolean);
  if (best.punctuation) flags.push('punct');
  if (best.numbers) flags.push('num');
  return flags.join(' • ') || 'default';
};

export const MonkeytypeStats = () => {
  const [data, setData] = useState<MonkeytypeProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadStats = async () => {
      try {
        const response = await fetch(`/api/monkeytype/profile/${encodeURIComponent(MONKEYTYPE_USERNAME)}`);
        if (!response.ok) {
          const detail = await response.text();
          throw new Error(detail || `Request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as MonkeytypeProfileResponse;
        if (!isActive) return;

        setData(payload);
        setError(null);
      } catch (fetchError) {
        if (!isActive) return;

        setError(fetchError instanceof Error ? fetchError.message : 'Unable to load Monkeytype stats.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    void loadStats();

    const intervalId = window.setInterval(() => {
      void loadStats();
    }, REFRESH_INTERVAL_MS);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const topPersonalBests = useMemo(() => data?.personalBests.slice(0, 6) ?? [], [data]);

  return (
    <div className="h-full overflow-auto bg-[var(--color-panel-bg)] text-[var(--color-text)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-panel-soft)] px-6 py-5 backdrop-blur-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Monkeytype Live Stats</h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Personal bests for <span className="font-semibold text-[var(--color-accent)]">{MONKEYTYPE_USERNAME}</span>.
            </p>
          </div>

          <div className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Refreshes every minute
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {isLoading && !data ? (
          <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-panel-soft)] p-6">
            Loading Monkeytype profile for <span className="font-semibold text-[var(--color-accent)]">{MONKEYTYPE_USERNAME}</span>...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-[28px] border border-amber-500/25 bg-amber-500/10 p-6 text-sm text-amber-100">
            Failed to load Monkeytype stats. {error}
          </div>
        ) : null}

        {data ? (
          <>
            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-panel-soft)] p-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">Player</div>
                  <div className="mt-3 text-3xl font-semibold">{data.username}</div>
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">Synced {formatDateTime(data.fetchedAt)}</div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">Top Personal Bests</div>
                  <div className="mt-2 text-sm text-[var(--color-text-muted)]">
                    Fastest saved Monkeytype runs across your tracked modes.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {topPersonalBests.map((best) => (
                  <div key={`${best.category}-${best.label}`} className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-panel-soft)] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">{best.label}</div>
                        <div className="mt-3 text-4xl font-semibold">{formatDecimal(best.wpm)}</div>
                        <div className="mt-1 text-sm text-[var(--color-text-muted)]">WPM</div>
                      </div>
                      <div className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                        {best.category}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[var(--color-text-muted)]">
                      <div>Raw: {formatDecimal(best.raw)}</div>
                      <div>Accuracy: {formatDecimal(best.accuracy)}%</div>
                      <div>Consistency: {formatDecimal(best.consistency)}%</div>
                      <div>Saved: {formatDateTime(best.timestamp)}</div>
                    </div>

                    <div className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">{formatPbFlags(best)}</div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
};
