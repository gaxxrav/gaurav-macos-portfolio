import { useState } from 'react';
import { ChevronLeft, ChevronRight, Folder, FileText, Image, FileCode } from 'lucide-react';
import { FileSystemItem } from '../../types';
import { fileSystem } from '../../data/portfolio';

interface FinderProps {
  initialPath?: string;
  onFileOpen?: (file: FileSystemItem) => void;
}

export const Finder = ({ initialPath = 'root', onFileOpen }: FinderProps) => {
  const [currentPath, setCurrentPath] = useState<string[]>([initialPath]);
  const [history, setHistory] = useState<string[][]>([[initialPath]]);
  const [historyIndex, setHistoryIndex] = useState(0);

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

  const getFileIcon = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      return <Folder className="w-10 h-10 text-blue-500" />;
    }
    switch (item.fileType) {
      case 'img':
        return <Image className="w-10 h-10 text-green-500" />;
      case 'md':
        return <FileCode className="w-10 h-10 text-purple-500" />;
      default:
        return <FileText className="w-10 h-10 text-gray-500" />;
    }
  };

  const items = getCurrentItems();
  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="h-full flex">
      <div className="w-48 bg-gray-100/50 border-r border-gray-200 p-3">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-500 mb-2 px-2">FAVORITES</div>
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
              className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-200/70 transition-colors text-sm flex items-center gap-2"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-12 bg-gray-100/50 border-b border-gray-200 flex items-center px-3 gap-2">
          <button
            onClick={goBack}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <div key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-400">/</span>}
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
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <Folder className="w-10 h-10 text-gray-400 group-hover:text-gray-600" />
                <span className="text-sm text-center">...</span>
              </button>
            )}
            {items.map(item => (
              <button
                key={item.id}
                onDoubleClick={() => navigateToFolder(item)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                {getFileIcon(item)}
                <span className="text-sm text-center break-words max-w-full">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
