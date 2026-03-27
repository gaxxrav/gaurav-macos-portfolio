import { useState } from 'react';
import { Folder, Terminal, Mail, Gamepad2, FileText } from 'lucide-react';

interface DockApp {
  id: string;
  name: string;
  icon: JSX.Element;
  appType: string;
}

interface DockProps {
  runningApps: string[];
  onAppClick: (appType: string) => void;
}

const dockApps: DockApp[] = [
  { id: 'finder', name: 'Finder', icon: <Folder className="w-6 h-6" />, appType: 'finder' },
  { id: 'terminal', name: 'Terminal', icon: <Terminal className="w-6 h-6" />, appType: 'terminal' },
  { id: 'mail', name: 'Mail', icon: <Mail className="w-6 h-6" />, appType: 'email' },
  { id: 'minesweeper', name: 'Minesweeper', icon: <Gamepad2 className="w-6 h-6" />, appType: 'minesweeper' },
  { id: 'cv', name: 'CV', icon: <FileText className="w-6 h-6" />, appType: 'pdf-viewer' }
];

export const Dock = ({ runningApps, onAppClick }: DockProps) => {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998]">
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl px-3 py-2 shadow-2xl border border-gray-800/50">
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
                  className="w-12 h-12 rounded-xl bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 flex items-center justify-center text-white transition-all duration-200 relative"
                  style={{
                    transform: `scale(${scale}) translateY(${isHovered ? '-8px' : '0'})`,
                  }}
                >
                  {app.icon}
                  {isRunning && (
                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white" />
                  )}
                </button>
                {isHovered && (
                  <div className="absolute -top-10 bg-gray-900/95 backdrop-blur-sm text-white text-xs px-2 py-1 rounded whitespace-nowrap">
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
