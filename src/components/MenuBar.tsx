import { useState, useEffect } from 'react';
import { Wifi, Battery, Search } from 'lucide-react';

interface MenuBarProps {
  currentApp: string;
  onLogoClick: () => void;
}

export const MenuBar = ({ currentApp, onLogoClick }: MenuBarProps) => {
  const [time, setTime] = useState(new Date());

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
    <div className="fixed top-0 left-0 right-0 h-7 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 flex items-center justify-between px-4 text-white text-sm z-[9999] select-none">
      <div className="flex items-center gap-4">
        <button
          onClick={onLogoClick}
          className="font-bold text-base hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
        >

        </button>
        <span className="font-medium">{currentApp}</span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 font-medium">
        {currentApp === 'Finder' ? 'My Portfolio' : currentApp}
      </div>
      <div className="flex items-center gap-3">
        <Search className="w-4 h-4 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
        <Wifi className="w-4 h-4 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
        <Battery className="w-4 h-4 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
        <div className="flex items-center gap-1">
          <span>{formatDate(time)}</span>
          <span>{formatTime(time)}</span>
        </div>
      </div>
    </div>
  );
};
