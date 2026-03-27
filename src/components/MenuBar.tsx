import { useState, useEffect } from 'react';
import { Wifi, Battery, Search, Volume2, Trophy } from 'lucide-react';

interface MenuBarProps {
  currentApp: string;
  onLogoClick: () => void;
  onSearchClick: () => void;
  onSystemPreferencesClick: () => void;
  onAchievementsClick: () => void;
  hasUnreadAchievement: boolean;
}

export const MenuBar = ({
  currentApp,
  onLogoClick,
  onSearchClick,
  onSystemPreferencesClick,
  onAchievementsClick,
  hasUnreadAchievement,
}: MenuBarProps) => {
  const [time, setTime] = useState(new Date());
  const isSystemPreferencesActive = currentApp === 'System Preferences';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] flex h-7 select-none items-center justify-between border-b px-4 text-sm backdrop-blur-xl text-[var(--color-shell-text)]"
      style={{
        backgroundColor: 'rgba(22, 22, 24, 0.82)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        color: '#f5f5f7',
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onLogoClick}
          className="rounded px-2 py-0.5 text-base font-bold transition-colors hover:bg-white/10"
          aria-label="Apple menu"
        >
          &#63743;
        </button>
        {!isSystemPreferencesActive && (
          <button
            onClick={onSystemPreferencesClick}
            className="rounded px-2 py-0.5 text-sm font-medium opacity-90 transition-colors hover:bg-white/10 hover:opacity-100"
          >
            System Preferences
          </button>
        )}
        <span className="font-medium">{currentApp}</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onSearchClick}
          className="rounded-md p-1 opacity-80 transition-opacity hover:bg-white/10 hover:opacity-100"
          aria-label="Open search"
        >
          <Search className="h-4 w-4" />
        </button>
        <Wifi className="w-4 h-4 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
        <Battery className="w-4 h-4 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
        <Volume2 className="w-4 h-4 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
        <button
          onClick={onAchievementsClick}
          className={`relative rounded-md p-1 transition-all hover:bg-white/10 ${
            hasUnreadAchievement ? 'text-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.22)]' : 'opacity-80'
          }`}
          aria-label="Open achievements"
        >
          <Trophy className={`h-4 w-4 ${hasUnreadAchievement ? 'animate-pulse' : ''}`} />
          {hasUnreadAchievement && <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-amber-300" />}
        </button>
        <div className="flex items-center gap-1">
          <span>{formatDate(time)}</span>
          <span>{formatTime(time)}</span>
        </div>
      </div>
    </div>
  );
};
