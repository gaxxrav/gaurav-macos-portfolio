import { useState, useRef, useEffect } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onMaximize: () => void;
}

export const Window = ({
  title,
  children,
  position,
  size,
  zIndex,
  isMaximized,
  onClose,
  onMinimize,
  onFocus,
  onPositionChange,
  onMaximize
}: WindowProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.traffic-lights, .window-content')) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onFocus();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        onPositionChange({
          x: e.clientX - dragOffset.x,
          y: Math.max(28, e.clientY - dragOffset.y)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, position, isMaximized, onPositionChange]);

  const windowStyle = isMaximized
    ? {
        left: 0,
        top: 28,
        width: '100%',
        height: 'calc(100vh - 28px - 70px)',
        zIndex
      }
    : {
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex
      };

  return (
    <div
      ref={windowRef}
      className="fixed bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden transition-all duration-300 animate-window-open"
      style={windowStyle}
      onMouseDown={onFocus}
    >
      <div
        className="h-11 bg-gray-100/80 backdrop-blur-sm border-b border-gray-200/50 flex items-center justify-between px-4 cursor-move select-none"
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center gap-2 traffic-lights">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors group relative"
          >
            <X className="w-2 h-2 text-red-900 absolute inset-0 m-auto opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={onMinimize}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors group relative"
          >
            <Minus className="w-2 h-2 text-yellow-900 absolute inset-0 m-auto opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={onMaximize}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors group relative"
          >
            <Maximize2 className="w-2 h-2 text-green-900 absolute inset-0 m-auto opacity-0 group-hover:opacity-100" />
          </button>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-gray-700">
          {title}
        </div>
        <div className="w-14" />
      </div>
      <div className="window-content h-[calc(100%-2.75rem)] overflow-auto">
        {children}
      </div>
    </div>
  );
};
