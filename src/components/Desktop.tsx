import { useState } from 'react';
import { Folder, FileText, Mail, Trash2 } from 'lucide-react';

interface DesktopIcon {
  id: string;
  name: string;
  icon: JSX.Element;
  position: { x: number; y: number };
  type: string;
}

interface DesktopProps {
  onIconDoubleClick: (id: string, type: string) => void;
}

const defaultIcons: DesktopIcon[] = [
  { id: 'about', name: 'About Me', icon: <Folder className="w-12 h-12" />, position: { x: 40, y: 80 }, type: 'folder' },
  { id: 'experience', name: 'Experience', icon: <Folder className="w-12 h-12" />, position: { x: 40, y: 200 }, type: 'folder' },
  { id: 'projects', name: 'Projects', icon: <Folder className="w-12 h-12" />, position: { x: 40, y: 320 }, type: 'folder' },
  { id: 'playground', name: 'Playground', icon: <Folder className="w-12 h-12" />, position: { x: 40, y: 440 }, type: 'folder' },
  { id: 'cv', name: 'cv.pdf', icon: <FileText className="w-12 h-12" />, position: { x: 40, y: 560 }, type: 'pdf' },
  { id: 'mail', name: 'Mail', icon: <Mail className="w-12 h-12" />, position: { x: window.innerWidth - 140, y: 80 }, type: 'app' },
  { id: 'trash', name: 'Trash', icon: <Trash2 className="w-12 h-12" />, position: { x: window.innerWidth - 140, y: window.innerHeight - 180 }, type: 'trash' }
];

export const Desktop = ({ onIconDoubleClick }: DesktopProps) => {
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
                x: Math.max(20, Math.min(window.innerWidth - 120, e.clientX - dragOffset.x)),
                y: Math.max(50, Math.min(window.innerHeight - 150, e.clientY - dragOffset.y))
              }
            }
          : icon
      ));
    }
  };

  const handleMouseUp = () => {
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
      className="fixed inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300"
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.05\' /%3E%3C/svg%3E")',
      }}
      onClick={handleDesktopClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {icons.map(icon => (
        <div
          key={icon.id}
          className={`absolute cursor-pointer select-none group ${
            selectedIcon === icon.id ? 'z-10' : 'z-0'
          }`}
          style={{ left: icon.position.x, top: icon.position.y }}
          onMouseDown={(e) => handleMouseDown(e, icon.id)}
          onDoubleClick={() => handleDoubleClick(icon.id, icon.type)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
            selectedIcon === icon.id
              ? 'bg-blue-500/20 backdrop-blur-sm'
              : 'hover:bg-black/5'
          }`}>
            <div className="text-gray-700 group-hover:scale-105 transition-transform">
              {icon.icon}
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded max-w-[100px] text-center truncate ${
              selectedIcon === icon.id
                ? 'bg-blue-600 text-white'
                : 'bg-white/80 text-gray-800'
            }`}>
              {icon.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
