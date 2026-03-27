import type { CSSProperties } from 'react';

interface WallpaperOption {
  id: string;
  name: string;
  style: CSSProperties;
  previewStyle: CSSProperties;
}

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  previewStyle: CSSProperties;
}

interface SystemPreferencesProps {
  wallpapers: WallpaperOption[];
  selectedWallpaperId: string;
  onWallpaperChange: (wallpaperId: string) => void;
  themes: ThemeOption[];
  selectedThemeId: string;
  onThemeChange: (themeId: string) => void;
  screensaverEnabled: boolean;
  onScreensaverEnabledChange: (enabled: boolean) => void;
  screensaverDelayMs: number;
  onScreensaverDelayChange: (delayMs: number) => void;
}

const screensaverOptions = [
  { label: '15 seconds', value: 15000 },
  { label: '30 seconds', value: 30000 },
  { label: '1 minute', value: 60000 },
  { label: '2 minutes', value: 120000 },
  { label: '5 minutes', value: 300000 },
];

export const SystemPreferences = ({
  wallpapers,
  selectedWallpaperId,
  onWallpaperChange,
  themes,
  selectedThemeId,
  onThemeChange,
  screensaverEnabled,
  onScreensaverEnabledChange,
  screensaverDelayMs,
  onScreensaverDelayChange,
}: SystemPreferencesProps) => {
  return (
    <div className="h-full overflow-auto bg-[var(--color-panel-bg)] text-[var(--color-text)]">
      <div className="border-b px-6 py-5 backdrop-blur-sm bg-[var(--color-panel-soft)] border-[var(--color-border)]">
        <h2 className="text-xl font-semibold tracking-tight">System Preferences</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Personalize the desktop wallpaper and control when the screensaver appears after inactivity.
        </p>
      </div>

      <div className="space-y-8 p-6">
        <section>
          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">Theme</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Change the overall character of windows, typography, and interface chrome.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {themes.map((theme) => {
              const selected = theme.id === selectedThemeId;

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onThemeChange(theme.id)}
                  className={`overflow-hidden rounded-2xl border text-left transition-all ${
                    selected
                      ? 'shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                  style={{
                    borderColor: selected ? 'var(--color-accent)' : 'var(--color-border)',
                    boxShadow: selected ? '0 20px 38px rgba(0,0,0,0.18)' : undefined,
                  }}
                >
                  <div className="aspect-[16/8] w-full border-b border-black/10" style={theme.previewStyle} />
                  <div className="px-4 py-3 bg-[var(--color-panel-bg)]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-[var(--color-text)]">{theme.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          selected ? 'text-white' : 'bg-[var(--color-panel-soft)] text-[var(--color-text-muted)]'
                        }`}
                        style={selected ? { backgroundColor: 'var(--color-accent)' } : undefined}
                      >
                        {selected ? 'Active' : 'Apply'}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-[var(--color-text-muted)]">{theme.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">Wallpaper</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Choose a background that defines the mood of the desktop.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            {wallpapers.map((wallpaper) => {
              const selected = wallpaper.id === selectedWallpaperId;

              return (
                <button
                  key={wallpaper.id}
                  type="button"
                  onClick={() => onWallpaperChange(wallpaper.id)}
                  className={`overflow-hidden rounded-2xl border text-left transition-all ${
                    selected
                      ? 'shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                  style={{
                    borderColor: selected ? 'var(--color-accent)' : 'var(--color-border)',
                    boxShadow: selected ? '0 20px 38px rgba(0,0,0,0.18)' : undefined,
                  }}
                >
                  <div className="aspect-[4/3] w-full" style={wallpaper.previewStyle} />
                  <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-panel-bg)]">
                    <span className="text-sm font-medium text-[var(--color-text)]">{wallpaper.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        selected ? 'text-white' : 'bg-[var(--color-panel-soft)] text-[var(--color-text-muted)]'
                      }`}
                      style={selected ? { backgroundColor: 'var(--color-accent)' } : undefined}
                    >
                      {selected ? 'Active' : 'Apply'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border p-5 shadow-sm bg-[var(--color-panel-bg)] border-[var(--color-border)]">
          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">Screensaver</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Fade to a minimal ambient view when the desktop is idle.
            </p>
          </div>

          <label className="flex items-center justify-between rounded-2xl border px-4 py-3 border-[var(--color-border)] bg-[var(--color-panel-soft)]">
            <div>
              <div className="font-medium text-[var(--color-text)]">Enable screensaver</div>
              <div className="text-sm text-[var(--color-text-muted)]">Shows a full-screen overlay after inactivity.</div>
            </div>
            <input
              type="checkbox"
              checked={screensaverEnabled}
              onChange={(event) => onScreensaverEnabledChange(event.target.checked)}
              className="h-5 w-5"
              style={{ accentColor: 'var(--color-accent)' }}
            />
          </label>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Start after</label>
            <select
              value={screensaverDelayMs}
              onChange={(event) => onScreensaverDelayChange(Number(event.target.value))}
              disabled={!screensaverEnabled}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-50 bg-[var(--color-panel-soft)] border-[var(--color-border)] text-[var(--color-text)]"
            >
              {screensaverOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </section>
      </div>
    </div>
  );
};
