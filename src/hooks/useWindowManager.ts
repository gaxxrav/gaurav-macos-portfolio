import { useState, useCallback } from 'react';
import { WindowState } from '../types';

export const useWindowManager = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(100);

  const openWindow = useCallback((window: Omit<WindowState, 'zIndex'>) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === window.id);
      if (existing) {
        return prev.map(w =>
          w.id === window.id
            ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 }
            : w
        );
      }
      return [...prev, { ...window, zIndex: maxZIndex + 1 }];
    });
    setMaxZIndex(prev => prev + 1);
  }, [maxZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id
        ? { ...w, zIndex: maxZIndex + 1, isMinimized: false }
        : w
    ));
    setMaxZIndex(prev => prev + 1);
  }, [maxZIndex]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  }, []);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, position } : w
    ));
  }, []);

  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, size } : w
    ));
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  }, []);

  return {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    updateWindowPosition,
    updateWindowSize,
    toggleMaximize
  };
};
