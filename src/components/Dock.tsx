import { useState } from 'react';

interface DockApp {
  id: string;
  name: string;
  icon: string;
  appType: string;
}

interface DockProps {
  runningApps: string[];
  onAppClick: (appType: string) => void;
}

const dockApps: DockApp[] = [
  { id: 'spotlight', name: 'Spotlight - Search', icon: '/icons/spotlight.png', appType: 'spotlight' },
  { id: 'finder', name: 'Finder', icon: '/icons/finder.png', appType: 'finder' },
  { id: 'terminal', name: 'Terminal', icon: '/icons/terminal.png', appType: 'terminal' },
  { id: 'mail', name: 'Mail', icon: '/icons/mail.png', appType: 'email' },
  { id: 'minesweeper', name: 'Minesweeper', icon: '/icons/minesweeper.png', appType: 'minesweeper' },
  { id: 'cv', name: 'CV', icon: '/icons/document.png', appType: 'pdf-viewer' }
];

export const Dock = ({ runningApps, onAppClick }: DockProps) => {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998]">
      <div
        className="rounded-[22px] border px-3 py-2 shadow-2xl backdrop-blur-2xl"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))',
          borderColor: 'rgba(255,255,255,0.16)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
        }}
      >
        <div className="flex items-end gap-1">
          {dockApps.map((app, index) => {
            const isHovered = hoveredApp === app.id;
            const isNearby = hoveredApp
              ? Math.abs(dockApps.findIndex(a => a.id === hoveredApp) - index) === 1
              : false;

            const scale = isHovered ? 1.4 : isNearby ? 1.15 : 1;
            const isRunning = runningApps.includes(app.appType);

            return (
              <div key={app.id} className="relative flex flex-col items-center">
                <button
                  onMouseEnter={() => setHoveredApp(app.id)}
                  onMouseLeave={() => setHoveredApp(null)}
                  onClick={() => onAppClick(app.appType)}
                  className="relative flex h-12 w-12 items-center justify-center text-[var(--color-shell-text)] transition-all duration-200"
                  style={{
                    transform: `scale(${scale}) translateY(${isHovered ? '-8px' : '0'})`,
                  }}
                >
                  <img
                    src={app.icon}
                    alt=""
                    draggable={false}
                    className="h-12 w-12 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.28)]"
                  />
                  {isRunning && (
                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white" />
                  )}
                </button>
                {isHovered && (
                  <div className="absolute -top-10 whitespace-nowrap rounded px-2 py-1 text-xs backdrop-blur-sm bg-[var(--color-menu-bg)] text-[var(--color-shell-text)]">
                    {app.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
