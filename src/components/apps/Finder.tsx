import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FileSystemItem } from '../../types';
import { fileSystem } from '../../data/portfolio';

interface FinderProps {
  initialPath?: string;
  onFileOpen?: (file: FileSystemItem) => void;
  onFolderOpen?: (folder: FileSystemItem) => void;
}

export const Finder = ({ initialPath = 'root', onFileOpen, onFolderOpen }: FinderProps) => {
  const [currentPath, setCurrentPath] = useState<string[]>([initialPath]);
  const [history, setHistory] = useState<string[][]>([[initialPath]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const getAssetIcon = (item: FileSystemItem) => {
    const rootIconMap: Record<string, string> = {
      about: '/icons/folder.png',
      experience: '/icons/folder.png',
      projects: '/icons/folder.png',
      playground: '/icons/folder.png',
      trash: '/icons/bin.png',
    };

    if (item.type === 'folder') {
      return rootIconMap[item.id] || '/icons/folder.png';
    }

    if (item.fileType === 'img') return '/icons/document.png';
    if (item.fileType === 'md') return '/icons/document.png';
    if (item.fileType === 'pdf') return '/icons/document.png';
    return '/icons/document.png';
  };

  const getCurrentItems = (): FileSystemItem[] => {
    if (currentPath[0] === 'root') {
      return Object.values(fileSystem);
    }

    let current: FileSystemItem | undefined = fileSystem[currentPath[0]];
    for (let i = 1; i < currentPath.length; i++) {
      current = current?.content?.find(item => item.id === currentPath[i]);
    }

    return current?.content || [];
  };

  const navigateToFolder = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      onFolderOpen?.(item);
      const newPath = [...currentPath, item.id];
      setCurrentPath(newPath);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newPath);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } else {
      onFileOpen?.(item);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  const navigateUp = () => {
    if (currentPath.length > 1) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newPath);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const getBreadcrumbs = () => {
    if (currentPath[0] === 'root') return ['Desktop'];
    const crumbs = ['Desktop'];

    let current: FileSystemItem | undefined = fileSystem[currentPath[0]];
    crumbs.push(current?.name || currentPath[0]);

    for (let i = 1; i < currentPath.length; i++) {
      current = current?.content?.find(item => item.id === currentPath[i]);
      if (current) crumbs.push(current.name);
    }

    return crumbs;
  };

  const items = getCurrentItems();
  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="h-full flex">
      <div className="w-48 border-r p-3 bg-[var(--color-panel-soft)] border-[var(--color-border)] text-[var(--color-text)]">
        <div className="space-y-1">
          <div className="mb-2 px-2 text-xs font-semibold text-[var(--color-text-subtle)]">FAVORITES</div>
          {Object.values(fileSystem).map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPath([item.id]);
                const newHistory = history.slice(0, historyIndex + 1);
                newHistory.push([item.id]);
                setHistory(newHistory);
                setHistoryIndex(newHistory.length - 1);
              }}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-[var(--color-accent-soft)]"
            >
              <img
                src={getAssetIcon(item)}
                alt=""
                draggable={false}
                className="h-5 w-5 object-contain"
              />
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[var(--color-panel-bg)] text-[var(--color-text)]">
        <div className="flex h-12 items-center gap-2 border-b px-3 bg-[var(--color-panel-soft)] border-[var(--color-border)]">
          <button
            onClick={goBack}
            disabled={historyIndex <= 0}
            className="rounded p-1.5 transition-colors hover:bg-[var(--color-accent-soft)] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className="rounded p-1.5 transition-colors hover:bg-[var(--color-accent-soft)] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <div key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-[var(--color-text-subtle)]">/</span>}
                <button
                  onClick={() => {
                    if (i === 0) {
                      setCurrentPath(['root']);
                    } else {
                      setCurrentPath(currentPath.slice(0, i));
                    }
                  }}
                  className="hover:underline"
                >
                  {crumb}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-4 gap-4">
            {currentPath.length > 1 && (
              <button
                onClick={navigateUp}
                className="group flex flex-col items-center gap-2 rounded-lg p-3 transition-colors hover:bg-[var(--color-accent-soft)]"
              >
                <img
                  src="/icons/folder.png"
                  alt=""
                  draggable={false}
                  className="h-12 w-12 object-contain opacity-80 transition-opacity group-hover:opacity-100"
                />
                <span className="text-sm text-center">...</span>
              </button>
            )}
            {items.map(item => (
              <button
                key={item.id}
                onDoubleClick={() => navigateToFolder(item)}
                className="group flex flex-col items-center gap-2 rounded-lg p-3 transition-colors hover:bg-[var(--color-accent-soft)]"
              >
                <img
                  src={getAssetIcon(item)}
                  alt=""
                  draggable={false}
                  className="h-12 w-12 object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)]"
                />
                <span className="text-sm text-center break-words max-w-full">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
