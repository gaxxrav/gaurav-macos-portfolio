import { useEffect, useState } from 'react';

type ModeStats = {
  label: string;
  rating: number | null;
  best: number | null;
  record: {
    win: number;
    loss: number;
    draw: number;
  } | null;
};

type ChessStatsResponse = {
  username: string;
  status: string | null;
  followers: number | null;
  league: string | null;
  joined: string | null;
  lastOnline: string | null;
  stats: ModeStats[];
  tactics: {
    highest: number | null;
    lowest: number | null;
  } | null;
  puzzleRush: {
    best: number | null;
  } | null;
  fetchedAt: string;
};

const CHESS_USERNAME = 'mikal_jakson';
const REFRESH_INTERVAL_MS = 60000;

const formatDateTime = (value: string | null) => {
  if (!value) return 'Unavailable';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const formatRecord = (record: ModeStats['record']) => {
  if (!record) return 'No games';
  return `${record.win}W ${record.loss}L ${record.draw}D`;
};

export const ChessStats = () => {
  const [data, setData] = useState<ChessStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadStats = async () => {
      try {
        const response = await fetch(`/api/chess/stats/${CHESS_USERNAME}`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as ChessStatsResponse;
        if (!isActive) return;

        setData(payload);
        setError(null);
      } catch (fetchError) {
        if (!isActive) return;

        setError(fetchError instanceof Error ? fetchError.message : 'Unable to load chess stats.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadStats();
    const intervalId = window.setInterval(() => {
      void loadStats();
    }, REFRESH_INTERVAL_MS);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="h-full overflow-auto bg-[var(--color-panel-bg)] text-[var(--color-text)]">
      <div className="border-b px-6 py-5 backdrop-blur-sm bg-[var(--color-panel-soft)] border-[var(--color-border)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Chess Stats</h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Live Chess.com snapshot for <span className="font-semibold text-[var(--color-accent)]">{CHESS_USERNAME}</span>.
            </p>
          </div>
          <div className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] border-[var(--color-border)] text-[var(--color-text-muted)]">
            Refreshes every minute
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {isLoading && !data ? (
          <div className="rounded-3xl border p-6 border-[var(--color-border)] bg-[var(--color-panel-soft)]">
            Loading live Chess.com data...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-3xl border p-6 border-emerald-500/20 bg-emerald-500/8 text-sm text-emerald-200">
            Failed to load chess stats. {error}
          </div>
        ) : null}

        {data ? (
          <>
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <div className="rounded-3xl border p-5 border-[var(--color-border)] bg-[var(--color-panel-soft)]">
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">Status</div>
                <div className="mt-3 text-2xl font-semibold">{data.status ?? 'Unknown'}</div>
              </div>
              <div className="rounded-3xl border p-5 border-[var(--color-border)] bg-[var(--color-panel-soft)]">
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">Followers</div>
                <div className="mt-3 text-2xl font-semibold">{data.followers ?? 'N/A'}</div>
              </div>
              <div className="rounded-3xl border p-5 border-[var(--color-border)] bg-[var(--color-panel-soft)]">
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">League</div>
                <div className="mt-3 text-2xl font-semibold">{data.league ?? 'N/A'}</div>
              </div>
              <div className="rounded-3xl border p-5 border-[var(--color-border)] bg-[var(--color-panel-soft)]">
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">Last Sync</div>
                <div className="mt-3 text-sm font-medium">{formatDateTime(data.fetchedAt)}</div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              {data.stats.map((mode) => (
                <div
                  key={mode.label}
                  className="rounded-3xl border p-5 border-[var(--color-border)] bg-[var(--color-panel-soft)]"
                >
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">{mode.label}</div>
                  <div className="mt-3 text-3xl font-semibold">{mode.rating ?? 'N/A'}</div>
                  <div className="mt-2 text-sm text-[var(--color-text-muted)]">Best: {mode.best ?? 'N/A'}</div>
                  <div className="mt-1 text-sm text-[var(--color-text-muted)]">Record: {formatRecord(mode.record)}</div>
                </div>
              ))}
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border p-5 border-[var(--color-border)] bg-[var(--color-panel-soft)]">
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">Tactics</div>
                <div className="mt-3 text-sm text-[var(--color-text-muted)]">Best puzzle rating: {data.tactics?.highest ?? 'N/A'}</div>
                <div className="mt-1 text-sm text-[var(--color-text-muted)]">Lowest tracked: {data.tactics?.lowest ?? 'N/A'}</div>
              </div>
              <div className="rounded-3xl border p-5 border-[var(--color-border)] bg-[var(--color-panel-soft)]">
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">Puzzle Rush</div>
                <div className="mt-3 text-sm text-[var(--color-text-muted)]">Best run: {data.puzzleRush?.best ?? 'N/A'}</div>
                <div className="mt-1 text-sm text-[var(--color-text-muted)]">Joined: {formatDateTime(data.joined)}</div>
                <div className="mt-1 text-sm text-[var(--color-text-muted)]">Last online: {formatDateTime(data.lastOnline)}</div>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
};
