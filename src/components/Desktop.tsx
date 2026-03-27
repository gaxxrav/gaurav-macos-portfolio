import { useState, type CSSProperties } from 'react';

interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
  position: { x: number; y: number };
  type: string;
}

interface DesktopProps {
  onIconDoubleClick: (id: string, type: string) => void;
  wallpaperStyle: CSSProperties;
}

const GRID_START_X = 40;
const GRID_START_Y = 80;
const GRID_STEP_X = 110;
const GRID_STEP_Y = 120;
const ICON_BOUNDS_WIDTH = 120;
const ICON_BOUNDS_HEIGHT = 150;

const defaultIcons: DesktopIcon[] = [
  { id: 'about', name: 'About Me', icon: '/icons/about-me.png', position: { x: 40, y: 80 }, type: 'folder' },
  { id: 'experience', name: 'Experience', icon: '/icons/folder.png', position: { x: 40, y: 200 }, type: 'folder' },
  { id: 'projects', name: 'Projects', icon: '/icons/folder.png', position: { x: 40, y: 320 }, type: 'folder' },
  { id: 'playground', name: 'Playground', icon: '/icons/folder.png', position: { x: 40, y: 440 }, type: 'folder' },
  { id: 'cv', name: 'cv.pdf', icon: '/icons/document.png', position: { x: 40, y: 560 }, type: 'pdf' },
  { id: 'mail', name: 'Mail', icon: '/icons/mail.png', position: { x: window.innerWidth - 140, y: 80 }, type: 'app' },
  { id: 'trash', name: 'Trash', icon: '/icons/bin.png', position: { x: window.innerWidth - 140, y: window.innerHeight - 180 }, type: 'trash' }
];

export const Desktop = ({ onIconDoubleClick, wallpaperStyle }: DesktopProps) => {
  const [icons, setIcons] = useState(defaultIcons);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, iconId: string) => {
    if (e.detail === 1) {
      setSelectedIcon(iconId);
      setDraggingIcon(iconId);
      const icon = icons.find(i => i.id === iconId);
      if (icon) {
        setDragOffset({
          x: e.clientX - icon.position.x,
          y: e.clientY - icon.position.y
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingIcon) {
      setIcons(prev => prev.map(icon =>
        icon.id === draggingIcon
          ? {
              ...icon,
              position: {
                x: Math.max(20, Math.min(window.innerWidth - ICON_BOUNDS_WIDTH, e.clientX - dragOffset.x)),
                y: Math.max(50, Math.min(window.innerHeight - ICON_BOUNDS_HEIGHT, e.clientY - dragOffset.y))
              }
            }
          : icon
      ));
    }
  };

  const handleMouseUp = () => {
    if (draggingIcon) {
      setIcons(prev => prev.map(icon => {
        if (icon.id !== draggingIcon) return icon;

        const snappedX = GRID_START_X + Math.round((icon.position.x - GRID_START_X) / GRID_STEP_X) * GRID_STEP_X;
        const snappedY = GRID_START_Y + Math.round((icon.position.y - GRID_START_Y) / GRID_STEP_Y) * GRID_STEP_Y;

        return {
          ...icon,
          position: {
            x: Math.max(20, Math.min(window.innerWidth - ICON_BOUNDS_WIDTH, snappedX)),
            y: Math.max(50, Math.min(window.innerHeight - ICON_BOUNDS_HEIGHT, snappedY))
          }
        };
      }));
    }

    setDraggingIcon(null);
  };

  const handleDoubleClick = (iconId: string, type: string) => {
    onIconDoubleClick(iconId, type);
  };

  const handleDesktopClick = () => {
    setSelectedIcon(null);
  };

  return (
    <div
      className="fixed inset-0"
      style={wallpaperStyle}
      onClick={handleDesktopClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'120\' height=\'120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'120\' height=\'120\' filter=\'url(%23noise)\' opacity=\'0.06\' /%3E%3C/svg%3E")',
        }}
      />
      {icons.map(icon => (
        <div
          key={icon.id}
          className={`absolute w-[112px] cursor-pointer select-none group ${
            selectedIcon === icon.id ? 'z-10' : 'z-0'
          }`}
          style={{ left: icon.position.x, top: icon.position.y }}
          onMouseDown={(e) => handleMouseDown(e, icon.id)}
          onDoubleClick={() => handleDoubleClick(icon.id, icon.type)}
          onClick={(e) => e.stopPropagation()}
        >
          {(() => {
            const isAboutIcon = icon.id === 'about';

            return (
          <div className={`flex w-full flex-col items-center gap-1 p-2 rounded-lg transition-all ${
            selectedIcon === icon.id
              ? 'shadow-[0_10px_24px_rgba(0,0,0,0.14)]'
              : 'hover:bg-white/8'
          }`}>
            <div
              className={isAboutIcon ? 'flex h-14 w-14 items-center justify-center overflow-hidden rounded-[18px] bg-white/10 shadow-[0_10px_24px_rgba(0,0,0,0.28)]' : undefined}
            >
              <img
                src={icon.icon}
                alt=""
                draggable={false}
                className={`select-none object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-transform group-hover:scale-105 ${
                  isAboutIcon ? 'h-full w-full object-cover' : 'h-14 w-14'
                }`}
              />
            </div>
            <span
              className="max-w-[100px] truncate rounded px-2 py-0.5 text-center text-xs font-medium text-white shadow-sm"
              style={{
                backgroundColor: selectedIcon === icon.id ? 'var(--color-selection)' : 'rgba(0,0,0,0.28)',
                boxShadow: selectedIcon === icon.id ? '0 0 0 1px var(--color-selection-ring)' : undefined,
              }}
            >
              {icon.name}
            </span>
          </div>
            );
          })()}
        </div>
      ))}
    </div>
  );
};
