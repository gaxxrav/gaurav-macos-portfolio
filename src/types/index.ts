export interface DesktopIcon {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'app';
  icon: string;
  position: { x: number; y: number };
  content?: FileSystemItem[];
  fileType?: 'txt' | 'md' | 'pdf' | 'img';
  filePath?: string;
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon: string;
  content?: FileSystemItem[];
  fileType?: 'txt' | 'md' | 'pdf' | 'img';
  fileContent?: string;
  filePath?: string;
}

export interface WindowState {
  id: string;
  title: string;
  appType: 'finder' | 'terminal' | 'text-viewer' | 'image-viewer' | 'pdf-viewer' | 'email' | 'minesweeper' | 'system-preferences' | 'achievements';
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  data?: any;
}

export interface DockApp {
  id: string;
  name: string;
  icon: string;
  appType: string;
}

export interface Command {
  name: string;
  description: string;
  action: (args?: string[]) => void;
}
