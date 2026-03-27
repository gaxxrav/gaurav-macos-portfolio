import { useState, useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { MenuBar } from './components/MenuBar';
import { Dock } from './components/Dock';
import { Window } from './components/Window';
import { Terminal } from './components/apps/Terminal';
import { Finder } from './components/apps/Finder';
import { TextViewer } from './components/apps/TextViewer';
import { ImageViewer } from './components/apps/ImageViewer';
import { PDFViewer } from './components/apps/PDFViewer';
import { EmailClient } from './components/apps/EmailClient';
import { Minesweeper } from './components/apps/Minesweeper';
import { useWindowManager } from './hooks/useWindowManager';
import { FileSystemItem } from './types';
import { fileSystem } from './data/portfolio';

type EasterEgg = 'none' | 'matrix' | 'disco' | 'glitch';

function App() {
  const {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    updateWindowPosition,
    toggleMaximize
  } = useWindowManager();

  const [currentApp, setCurrentApp] = useState('Finder');
  const [easterEgg, setEasterEgg] = useState<EasterEgg>('none');
  const [konamiCode, setKonamiCode] = useState<string[]>([]);

  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newCode = [...konamiCode, e.key].slice(-10);
      setKonamiCode(newCode);

      if (newCode.join(',') === konamiSequence.join(',')) {
        triggerEasterEgg('glitch');
        setKonamiCode([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiCode]);

  const triggerEasterEgg = (egg: EasterEgg) => {
    setEasterEgg(egg);
    setTimeout(() => setEasterEgg('none'), egg === 'matrix' ? 5000 : 3000);
  };

  const handleTerminalCommand = (command: string, args: string[]) => {
    switch (command) {
      case 'open':
        handleDesktopIconOpen(args[0], 'folder');
        break;
      case 'cv':
        handleAppClick('pdf-viewer');
        break;
      case 'email':
        handleAppClick('email');
        break;
      case 'minesweeper':
        handleAppClick('minesweeper');
        break;
      case 'matrix':
        triggerEasterEgg('matrix');
        break;
      case 'disco':
        triggerEasterEgg('disco');
        break;
    }
  };

  const handleDesktopIconOpen = (id: string, type: string) => {
    if (type === 'folder') {
      openWindow({
        id: `finder-${id}`,
        title: fileSystem[id]?.name || 'Finder',
        appType: 'finder',
        position: { x: 100, y: 100 },
        size: { width: 900, height: 600 },
        isMinimized: false,
        isMaximized: false,
        data: { path: id }
      });
      setCurrentApp('Finder');
    } else if (type === 'pdf') {
      handleAppClick('pdf-viewer');
    } else if (type === 'app') {
      if (id === 'mail') handleAppClick('email');
    }
  };

  const handleAppClick = (appType: string) => {
    const existingWindow = windows.find(w => w.appType === appType);
    if (existingWindow) {
      focusWindow(existingWindow.id);
      return;
    }

    const configs = {
      finder: {
        id: 'finder-root',
        title: 'Finder',
        appType: 'finder' as const,
        position: { x: 100, y: 100 },
        size: { width: 900, height: 600 },
        isMinimized: false,
        isMaximized: false
      },
      terminal: {
        id: 'terminal',
        title: 'Terminal',
        appType: 'terminal' as const,
        position: { x: 200, y: 150 },
        size: { width: 700, height: 450 },
        isMinimized: false,
        isMaximized: false
      },
      email: {
        id: 'email',
        title: 'Mail',
        appType: 'email' as const,
        position: { x: 150, y: 100 },
        size: { width: 1000, height: 600 },
        isMinimized: false,
        isMaximized: false
      },
      minesweeper: {
        id: 'minesweeper',
        title: 'Minesweeper',
        appType: 'minesweeper' as const,
        position: { x: 250, y: 150 },
        size: { width: 600, height: 700 },
        isMinimized: false,
        isMaximized: false
      },
      'pdf-viewer': {
        id: 'pdf-viewer',
        title: 'cv.pdf',
        appType: 'pdf-viewer' as const,
        position: { x: 180, y: 120 },
        size: { width: 800, height: 600 },
        isMinimized: false,
        isMaximized: false
      }
    };

    const config = configs[appType as keyof typeof configs];
    if (config) {
      openWindow(config);
      setCurrentApp(config.title);
    }
  };

  const handleFileOpen = (file: FileSystemItem) => {
    if (file.type === 'folder') return;

    const windowId = `file-${file.id}`;
    const existingWindow = windows.find(w => w.id === windowId);

    if (existingWindow) {
      focusWindow(windowId);
      return;
    }

    if (file.fileType === 'img') {
      openWindow({
        id: windowId,
        title: file.name,
        appType: 'image-viewer',
        position: { x: 200, y: 150 },
        size: { width: 800, height: 600 },
        isMinimized: false,
        isMaximized: false,
        data: { src: file.filePath }
      });
    } else {
      openWindow({
        id: windowId,
        title: file.name,
        appType: 'text-viewer',
        position: { x: 200, y: 150 },
        size: { width: 700, height: 500 },
        isMinimized: false,
        isMaximized: false,
        data: { content: file.fileContent, fileType: file.fileType }
      });
    }
  };

  const renderWindowContent = (window: any) => {
    switch (window.appType) {
      case 'finder':
        return <Finder initialPath={window.data?.path || 'root'} onFileOpen={handleFileOpen} />;
      case 'terminal':
        return <Terminal onCommand={handleTerminalCommand} />;
      case 'text-viewer':
        return <TextViewer content={window.data?.content || ''} fileType={window.data?.fileType} />;
      case 'image-viewer':
        return <ImageViewer src={window.data?.src || ''} alt={window.title} />;
      case 'pdf-viewer':
        return <PDFViewer />;
      case 'email':
        return <EmailClient />;
      case 'minesweeper':
        return <Minesweeper />;
      default:
        return <div>Unknown app type</div>;
    }
  };

  const runningApps = Array.from(new Set(windows.map(w => w.appType)));

  return (
    <div className={`h-screen w-screen overflow-hidden ${easterEgg === 'disco' ? 'animate-disco' : ''}`}>
      <MenuBar
        currentApp={currentApp}
        onLogoClick={() => {
          if (easterEgg === 'none') {
            triggerEasterEgg('matrix');
          }
        }}
      />

      <Desktop onIconDoubleClick={handleDesktopIconOpen} />

      {windows.map(window => (
        !window.isMinimized && (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            position={window.position}
            size={window.size}
            zIndex={window.zIndex}
            isMaximized={window.isMaximized}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onFocus={() => {
              focusWindow(window.id);
              setCurrentApp(window.title);
            }}
            onPositionChange={(pos) => updateWindowPosition(window.id, pos)}
            onMaximize={() => toggleMaximize(window.id)}
          >
            {renderWindowContent(window)}
          </Window>
        )
      ))}

      <Dock runningApps={runningApps} onAppClick={handleAppClick} />

      {easterEgg === 'matrix' && (
        <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-green-500 font-mono text-sm animate-matrix opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {Array.from({ length: 30 }).map(() =>
                String.fromCharCode(0x30A0 + Math.random() * 96)
              ).join('\n')}
            </div>
          ))}
        </div>
      )}

      {easterEgg === 'glitch' && (
        <div className="fixed inset-0 pointer-events-none z-[10000] bg-black/10 animate-glitch" />
      )}
    </div>
  );
}

export default App;
