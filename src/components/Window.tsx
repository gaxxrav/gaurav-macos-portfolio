import { useState, useRef, useEffect } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';

const MIN_WIDTH = 420;
const MIN_HEIGHT = 280;

type ResizeDirection = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

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
  onSizeChange: (size: { width: number; height: number }, position?: { x: number; y: number }) => void;
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
  onSizeChange,
  onMaximize
}: WindowProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeDirection | null>(null);
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
      setIsResizing(null);
    };

    const handleResize = (e: MouseEvent) => {
      if (!isResizing || isMaximized) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - 98;

      let nextX = position.x;
      let nextY = position.y;
      let nextWidth = size.width;
      let nextHeight = size.height;

      if (isResizing.includes('e')) {
        nextWidth = Math.max(MIN_WIDTH, Math.min(viewportWidth - position.x, e.clientX - position.x));
      }

      if (isResizing.includes('s')) {
        nextHeight = Math.max(MIN_HEIGHT, Math.min(viewportHeight - position.y, e.clientY - position.y));
      }

      if (isResizing.includes('w')) {
        const rightEdge = position.x + size.width;
        nextX = Math.max(0, Math.min(e.clientX, rightEdge - MIN_WIDTH));
        nextWidth = rightEdge - nextX;
      }

      if (isResizing.includes('n')) {
        const bottomEdge = position.y + size.height;
        nextY = Math.max(28, Math.min(e.clientY, bottomEdge - MIN_HEIGHT));
        nextHeight = bottomEdge - nextY;
      }

      onSizeChange(
        { width: nextWidth, height: nextHeight },
        { x: nextX, y: nextY }
      );
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position, size, isMaximized, onPositionChange, onSizeChange]);

  const handleResizeStart = (direction: ResizeDirection) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(direction);
    onFocus();
  };

  const resizeHandles = [
    { direction: 'n' as const, className: 'top-0 left-3 right-3 h-1 cursor-ns-resize' },
    { direction: 'e' as const, className: 'top-3 right-0 bottom-3 w-1 cursor-ew-resize' },
    { direction: 's' as const, className: 'right-3 bottom-0 left-3 h-1 cursor-ns-resize' },
    { direction: 'w' as const, className: 'top-3 bottom-3 left-0 w-1 cursor-ew-resize' },
    { direction: 'ne' as const, className: 'top-0 right-0 h-3 w-3 cursor-nesw-resize' },
    { direction: 'nw' as const, className: 'top-0 left-0 h-3 w-3 cursor-nwse-resize' },
    { direction: 'se' as const, className: 'right-0 bottom-0 h-3 w-3 cursor-nwse-resize' },
    { direction: 'sw' as const, className: 'bottom-0 left-0 h-3 w-3 cursor-nesw-resize' },
  ];

  const windowStyle = isMaximized
    ? {
        left: 0,
        top: 28,
        width: '100%',
        height: 'calc(100vh - 28px - 70px)',
        zIndex,
        boxShadow: 'var(--window-shadow)',
        fontFamily: 'var(--font-ui)',
      }
    : {
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
        boxShadow: 'var(--window-shadow)',
        fontFamily: 'var(--font-ui)',
      };

  return (
    <div
      ref={windowRef}
      className="fixed overflow-hidden rounded-xl border transition-all duration-300 animate-window-open backdrop-blur-xl bg-[var(--color-window-bg)] border-[var(--color-window-border)]"
      style={windowStyle}
      onMouseDown={onFocus}
    >
      <div
        className="flex h-11 cursor-move select-none items-center justify-between border-b px-4 backdrop-blur-sm bg-[var(--color-window-header)] border-[var(--color-window-header-border)]"
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
        <div className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-[var(--color-window-title)]">
          {title}
        </div>
        <div className="w-14" />
      </div>
      <div className="window-content h-[calc(100%-2.75rem)] overflow-auto">
        {children}
      </div>
      {!isMaximized && resizeHandles.map(handle => (
        <button
          key={handle.direction}
          type="button"
          aria-label={`Resize window ${handle.direction}`}
          className={`absolute ${handle.className} z-20 bg-transparent`}
          onMouseDown={handleResizeStart(handle.direction)}
        />
      ))}
    </div>
  );
};
