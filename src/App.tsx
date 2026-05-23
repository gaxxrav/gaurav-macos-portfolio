import { useState, useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { Trophy } from 'lucide-react';
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
import { SystemPreferences } from './components/apps/SystemPreferences';
import { Achievements } from './components/apps/Achievements';
import { ChessStats } from './components/apps/ChessStats';
import { MonkeytypeStats } from './components/apps/MonkeytypeStats';
import { Spotlight, type SpotlightResult } from './components/apps/Spotlight';
import { useWindowManager } from './hooks/useWindowManager';
import { FileSystemItem } from './types';
import { fileSystem } from './data/portfolio';
type AchievementId =
  | 'first-boot'
  | 'first-spotlight'
  | 'desktop-explorer'
  | 'context-matters'
  | 'reference-check'
  | 'actually-read-it'
  | 'command-line-curious'
  | 'help-actually'
  | 'trash-explorer'
  | 'first-mine'
  | 'clean-board'
  | 'just-one-more'
  | 'gamer';

type WallpaperOption = {
  id: string;
  name: string;
  style: CSSProperties;
  previewStyle: CSSProperties;
};

type ThemeVars = Record<`--${string}`, string>;

type ThemeOption = {
  id: string;
  name: string;
  description: string;
  previewStyle: CSSProperties;
  vars: ThemeVars;
};

type AchievementDefinition = {
  id: AchievementId;
  name: string;
  description: string;
};

type AchievementNotification = {
  id: AchievementId;
  name: string;
};

type SearchEntry = SpotlightResult & {
  appType?: string;
  folderId?: string;
  file?: FileSystemItem;
};

type RenderTarget = {
  appType: string;
  title: string;
  data?: unknown;
};

type MobileScreenState = RenderTarget | null;

const BOOT_SCREEN_DURATION_MS = 2400;
const BOOT_SCREEN_FADE_MS = 420;

const wallpaperOptions: WallpaperOption[] = [
  {
    id: 'cat-default',
    name: 'Cat Default',
    style: {
      backgroundImage:
        'linear-gradient(rgba(4, 6, 10, 0.2), rgba(4, 6, 10, 0.1)), url("/wallpapers/cat-default.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    previewStyle: {
      backgroundImage:
        'linear-gradient(rgba(4, 6, 10, 0.12), rgba(4, 6, 10, 0.04)), url("/wallpapers/cat-default.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    style: { background: '#0f172a' },
    previewStyle: { background: '#0f172a' },
  },
  {
    id: 'nocturne-gradient',
    name: 'Nocturne',
    style: { background: 'linear-gradient(135deg, #050816 0%, #14213d 42%, #3a506b 100%)' },
    previewStyle: { background: 'linear-gradient(135deg, #050816 0%, #14213d 42%, #3a506b 100%)' },
  },
  {
    id: 'aurora-gradient',
    name: 'Aurora',
    style: { background: 'linear-gradient(145deg, #05151d 0%, #0c3340 38%, #1d5c63 68%, #7c3aed 100%)' },
    previewStyle: { background: 'linear-gradient(145deg, #05151d 0%, #0c3340 38%, #1d5c63 68%, #7c3aed 100%)' },
  },
  {
    id: 'abstract',
    name: 'Abstract',
    style: {
      backgroundImage:
        'linear-gradient(rgba(8, 11, 23, 0.58), rgba(8, 11, 23, 0.42)), url("/wallpapers/abstract.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    previewStyle: {
      backgroundImage:
        'linear-gradient(rgba(8, 11, 23, 0.52), rgba(8, 11, 23, 0.34)), url("/wallpapers/abstract.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
  },
  {
    id: 'venice',
    name: 'Venice',
    style: {
      backgroundImage:
        'linear-gradient(rgba(7, 10, 20, 0.56), rgba(18, 10, 14, 0.36)), url("/wallpapers/venice.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    previewStyle: {
      backgroundImage:
        'linear-gradient(rgba(7, 10, 20, 0.48), rgba(18, 10, 14, 0.28)), url("/wallpapers/venice.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
  },
  {
    id: 'water',
    name: 'Water',
    style: {
      backgroundImage:
        'linear-gradient(rgba(5, 16, 24, 0.56), rgba(5, 16, 24, 0.34)), url("/wallpapers/water.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    previewStyle: {
      backgroundImage:
        'linear-gradient(rgba(5, 16, 24, 0.46), rgba(5, 16, 24, 0.24)), url("/wallpapers/water.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
  },
  {
    id: 'black-sweater',
    name: 'Black Sweater',
    style: {
      backgroundImage:
        'linear-gradient(rgba(4, 6, 10, 0.42), rgba(4, 6, 10, 0.26)), url("/wallpapers/black-sweater.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    previewStyle: {
      backgroundImage:
        'linear-gradient(rgba(4, 6, 10, 0.34), rgba(4, 6, 10, 0.18)), url("/wallpapers/black-sweater.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
  },
  {
    id: 'hello-blue',
    name: 'Hello Blue',
    style: {
      backgroundImage:
        'linear-gradient(rgba(3, 10, 24, 0.28), rgba(3, 10, 24, 0.16)), url("/wallpapers/Hello-Blue.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    previewStyle: {
      backgroundImage:
        'linear-gradient(rgba(3, 10, 24, 0.22), rgba(3, 10, 24, 0.12)), url("/wallpapers/Hello-Blue.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
  },
];

const themeOptions: ThemeOption[] = [
  {
    id: 'graphite',
    name: 'Graphite',
    description: 'Dark brushed-metal windows with a clean neo-system feel.',
    previewStyle: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
    },
    vars: {
      '--font-ui': '"Inter", "Segoe UI", sans-serif',
      '--font-mono': '"JetBrains Mono", "SFMono-Regular", monospace',
      '--color-shell-text': '#f8fafc',
      '--color-menu-bg': 'rgba(15, 23, 42, 0.82)',
      '--color-menu-border': 'rgba(148, 163, 184, 0.18)',
      '--color-dock-bg': 'rgba(15, 23, 42, 0.80)',
      '--color-dock-border': 'rgba(148, 163, 184, 0.18)',
      '--color-window-bg': 'rgba(15, 23, 42, 0.88)',
      '--color-window-border': 'rgba(148, 163, 184, 0.18)',
      '--color-window-header': 'rgba(30, 41, 59, 0.88)',
      '--color-window-header-border': 'rgba(148, 163, 184, 0.18)',
      '--color-window-title': '#e2e8f0',
      '--color-panel-bg': '#0f172a',
      '--color-panel-muted': '#1e293b',
      '--color-panel-soft': 'rgba(30, 41, 59, 0.72)',
      '--color-border': 'rgba(148, 163, 184, 0.18)',
      '--color-text': '#e2e8f0',
      '--color-text-muted': '#94a3b8',
      '--color-text-subtle': '#64748b',
      '--color-accent': '#7dd3fc',
      '--color-accent-soft': 'rgba(125, 211, 252, 0.16)',
      '--color-selection': 'rgba(255,255,255,0.10)',
      '--color-selection-ring': 'rgba(255,255,255,0.16)',
      '--window-shadow': '0 24px 70px rgba(2, 6, 23, 0.55)',
    },
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Sharper, inky panes with high-contrast monochrome chrome.',
    previewStyle: {
      background: 'linear-gradient(135deg, #020617 0%, #111827 55%, #1f2937 100%)',
      fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
    },
    vars: {
      '--font-ui': '"Space Grotesk", "Segoe UI", sans-serif',
      '--font-mono': '"IBM Plex Mono", monospace',
      '--color-shell-text': '#f9fafb',
      '--color-menu-bg': 'rgba(2, 6, 23, 0.88)',
      '--color-menu-border': 'rgba(255, 255, 255, 0.09)',
      '--color-dock-bg': 'rgba(3, 7, 18, 0.82)',
      '--color-dock-border': 'rgba(255, 255, 255, 0.09)',
      '--color-window-bg': 'rgba(3, 7, 18, 0.90)',
      '--color-window-border': 'rgba(255, 255, 255, 0.10)',
      '--color-window-header': 'rgba(17, 24, 39, 0.94)',
      '--color-window-header-border': 'rgba(255, 255, 255, 0.08)',
      '--color-window-title': '#f9fafb',
      '--color-panel-bg': '#030712',
      '--color-panel-muted': '#111827',
      '--color-panel-soft': 'rgba(17, 24, 39, 0.72)',
      '--color-border': 'rgba(255,255,255,0.10)',
      '--color-text': '#f3f4f6',
      '--color-text-muted': '#9ca3af',
      '--color-text-subtle': '#6b7280',
      '--color-accent': '#f9fafb',
      '--color-accent-soft': 'rgba(255,255,255,0.10)',
      '--color-selection': 'rgba(255,255,255,0.08)',
      '--color-selection-ring': 'rgba(255,255,255,0.14)',
      '--window-shadow': '0 24px 70px rgba(0, 0, 0, 0.60)',
    },
  },
  {
    id: 'aurora-glass',
    name: 'Aurora Glass',
    description: 'Cool translucent panes with a brighter futuristic accent.',
    previewStyle: {
      background: 'linear-gradient(135deg, #082f49 0%, #164e63 50%, #4c1d95 100%)',
      fontFamily: '"Manrope", "Segoe UI", sans-serif',
    },
    vars: {
      '--font-ui': '"Manrope", "Segoe UI", sans-serif',
      '--font-mono': '"JetBrains Mono", monospace',
      '--color-shell-text': '#ecfeff',
      '--color-menu-bg': 'rgba(8, 47, 73, 0.76)',
      '--color-menu-border': 'rgba(103, 232, 249, 0.18)',
      '--color-dock-bg': 'rgba(15, 23, 42, 0.62)',
      '--color-dock-border': 'rgba(103, 232, 249, 0.18)',
      '--color-window-bg': 'rgba(12, 33, 56, 0.74)',
      '--color-window-border': 'rgba(103, 232, 249, 0.18)',
      '--color-window-header': 'rgba(15, 118, 110, 0.24)',
      '--color-window-header-border': 'rgba(103, 232, 249, 0.16)',
      '--color-window-title': '#ecfeff',
      '--color-panel-bg': '#082f49',
      '--color-panel-muted': '#164e63',
      '--color-panel-soft': 'rgba(14, 116, 144, 0.26)',
      '--color-border': 'rgba(103, 232, 249, 0.18)',
      '--color-text': '#ecfeff',
      '--color-text-muted': '#a5f3fc',
      '--color-text-subtle': '#67e8f9',
      '--color-accent': '#22d3ee',
      '--color-accent-soft': 'rgba(34, 211, 238, 0.18)',
      '--color-selection': 'rgba(255,255,255,0.10)',
      '--color-selection-ring': 'rgba(103,232,249,0.18)',
      '--window-shadow': '0 24px 70px rgba(3, 15, 25, 0.46)',
    },
  },
  {
    id: 'terminal-green',
    name: 'Terminal Green',
    description: 'Monospace-heavy dark mode with phosphor-green accents.',
    previewStyle: {
      background: 'linear-gradient(135deg, #020c06 0%, #052e16 60%, #14532d 100%)',
      fontFamily: '"IBM Plex Mono", monospace',
    },
    vars: {
      '--font-ui': '"IBM Plex Mono", monospace',
      '--font-mono': '"IBM Plex Mono", monospace',
      '--color-shell-text': '#dcfce7',
      '--color-menu-bg': 'rgba(2, 12, 6, 0.88)',
      '--color-menu-border': 'rgba(34, 197, 94, 0.18)',
      '--color-dock-bg': 'rgba(2, 12, 6, 0.84)',
      '--color-dock-border': 'rgba(34, 197, 94, 0.18)',
      '--color-window-bg': 'rgba(2, 12, 6, 0.90)',
      '--color-window-border': 'rgba(34, 197, 94, 0.16)',
      '--color-window-header': 'rgba(5, 46, 22, 0.92)',
      '--color-window-header-border': 'rgba(34, 197, 94, 0.16)',
      '--color-window-title': '#dcfce7',
      '--color-panel-bg': '#020c06',
      '--color-panel-muted': '#052e16',
      '--color-panel-soft': 'rgba(5, 46, 22, 0.78)',
      '--color-border': 'rgba(34, 197, 94, 0.16)',
      '--color-text': '#dcfce7',
      '--color-text-muted': '#86efac',
      '--color-text-subtle': '#4ade80',
      '--color-accent': '#4ade80',
      '--color-accent-soft': 'rgba(74, 222, 128, 0.16)',
      '--color-selection': 'rgba(74, 222, 128, 0.08)',
      '--color-selection-ring': 'rgba(74, 222, 128, 0.16)',
      '--window-shadow': '0 24px 70px rgba(0, 0, 0, 0.56)',
    },
  },
  {
    id: 'studio-paper',
    name: 'Studio Paper',
    description: 'Warm editorial panels with softer contrast and serif headers.',
    previewStyle: {
      background: 'linear-gradient(135deg, #f5efe4 0%, #e7dcc7 60%, #d6c7b0 100%)',
      fontFamily: '"Fraunces", Georgia, serif',
    },
    vars: {
      '--font-ui': '"Fraunces", Georgia, serif',
      '--font-mono': '"IBM Plex Mono", monospace',
      '--color-shell-text': '#1f1a17',
      '--color-menu-bg': 'rgba(241, 232, 216, 0.86)',
      '--color-menu-border': 'rgba(120, 87, 61, 0.16)',
      '--color-dock-bg': 'rgba(241, 232, 216, 0.82)',
      '--color-dock-border': 'rgba(120, 87, 61, 0.16)',
      '--color-window-bg': 'rgba(251, 248, 241, 0.94)',
      '--color-window-border': 'rgba(120, 87, 61, 0.16)',
      '--color-window-header': 'rgba(239, 229, 211, 0.96)',
      '--color-window-header-border': 'rgba(120, 87, 61, 0.14)',
      '--color-window-title': '#2c241f',
      '--color-panel-bg': '#fffaf1',
      '--color-panel-muted': '#efe5d3',
      '--color-panel-soft': 'rgba(239, 229, 211, 0.82)',
      '--color-border': 'rgba(120, 87, 61, 0.16)',
      '--color-text': '#2c241f',
      '--color-text-muted': '#6b5b4d',
      '--color-text-subtle': '#8c7666',
      '--color-accent': '#8b5e3c',
      '--color-accent-soft': 'rgba(139, 94, 60, 0.12)',
      '--color-selection': 'rgba(44, 36, 31, 0.06)',
      '--color-selection-ring': 'rgba(44, 36, 31, 0.12)',
      '--window-shadow': '0 24px 70px rgba(84, 63, 45, 0.18)',
    },
  },
];

const achievementDefinitions: AchievementDefinition[] = [
  { id: 'first-boot', name: 'First Boot', description: 'Started the OS for the first time this session.' },
  { id: 'first-spotlight', name: 'First Spotlight', description: 'Opened Spotlight search from the menu bar or dock.' },
  { id: 'desktop-explorer', name: 'Desktop Explorer', description: 'Opened several different files or folders across the desktop.' },
  { id: 'context-matters', name: 'Context Matters', description: 'Opened both About Me files.' },
  { id: 'reference-check', name: 'Reference Check', description: 'Opened the Mail app.' },
  { id: 'actually-read-it', name: 'Actually Read It', description: 'Opened the CV PDF.' },
  { id: 'command-line-curious', name: 'Command Line Curious', description: 'Entered a valid terminal command.' },
  { id: 'help-actually', name: 'Help, Actually', description: 'Used the help command in Terminal.' },
  { id: 'trash-explorer', name: 'Trash Explorer', description: 'Opened every file currently sitting in Trash.' },
  { id: 'first-mine', name: 'First Mine', description: 'Lost a game of Minesweeper.' },
  { id: 'clean-board', name: 'Clean Board', description: 'Won a game of Minesweeper.' },
  { id: 'just-one-more', name: 'Miner', description: 'Started the same mini-game more than once.' },
  { id: 'gamer', name: 'Gamer', description: 'Played both playful modes available in the OS.' },
];

const trashFileIds = new Set(
  (fileSystem.trash?.content ?? [])
    .filter((item) => item.type === 'file')
    .map((item) => item.id)
);

function BootScreen({ isVisible, isFading }: { isVisible: boolean; isFading: boolean }) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`boot-screen ${isFading ? 'boot-screen--fade' : ''}`}
      aria-hidden={!isVisible}
    >
      <div className="boot-screen__glow" />
      <div className="boot-screen__content">
        <img
          src="/icons/pixelated-pfp.png"
          alt="Pixel portrait"
          className="boot-screen__portrait"
          draggable={false}
        />
        <div className="boot-screen__loader" aria-hidden="true">
          <span className="boot-screen__loader-fill" />
        </div>
        <div className="boot-screen__fallback">Welcome</div>
      </div>
    </div>
  );
}

function App() {
  const {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    updateWindowPosition,
    updateWindowSize,
    toggleMaximize,
  } = useWindowManager();

  const [currentApp, setCurrentApp] = useState('Finder');
  const [selectedWallpaperId, setSelectedWallpaperId] = useState('cat-default');
  const [selectedThemeId, setSelectedThemeId] = useState('terminal-green');
  const [screensaverEnabled, setScreensaverEnabled] = useState(true);
  const [screensaverDelayMs, setScreensaverDelayMs] = useState(60000);
  const [isScreensaverActive, setIsScreensaverActive] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<AchievementId[]>([]);
  const [hasUnreadAchievement, setHasUnreadAchievement] = useState(false);
  const [achievementNotification, setAchievementNotification] = useState<AchievementNotification | null>(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [mobileScreen, setMobileScreen] = useState<MobileScreenState>(null);
  const [isBootVisible, setIsBootVisible] = useState(true);
  const [isBootFading, setIsBootFading] = useState(false);

  const inactivityTimeoutRef = useRef<number | null>(null);
  const notificationTimeoutRef = useRef<number | null>(null);
  const exploredTargetsRef = useRef(new Set<string>());
  const aboutFilesRef = useRef(new Set<string>());
  const trashFilesRef = useRef(new Set<string>());
  const playfulModesRef = useRef(new Set<string>());
  const minesweeperSessionsRef = useRef(0);

  const selectedWallpaper = useMemo(
    () => wallpaperOptions.find((option) => option.id === selectedWallpaperId) ?? wallpaperOptions[0],
    [selectedWallpaperId]
  );
  const selectedTheme = useMemo(
    () => themeOptions.find((option) => option.id === selectedThemeId) ?? themeOptions[0],
    [selectedThemeId]
  );
  const appThemeStyle = useMemo(
    () => selectedTheme.vars as CSSProperties,
    [selectedTheme]
  );

  const achievementsSet = useMemo(() => new Set(unlockedAchievementIds), [unlockedAchievementIds]);
  const spotlightEntries = useMemo<SearchEntry[]>(() => {
    const appEntries: SearchEntry[] = [
      { id: 'search-finder', title: 'Finder', subtitle: 'Browse folders and files', type: 'app', icon: '/icons/finder.png', appType: 'finder' },
      { id: 'search-terminal', title: 'Terminal', subtitle: 'Run portfolio commands', type: 'app', icon: '/icons/terminal.png', appType: 'terminal' },
      { id: 'search-mail', title: 'Mail', subtitle: 'Open testimonials and references', type: 'app', icon: '/icons/mail.png', appType: 'email' },
      { id: 'search-cv', title: 'CV', subtitle: 'Open cv.pdf', type: 'app', icon: '/icons/document.png', appType: 'pdf-viewer' },
      { id: 'search-settings', title: 'System Preferences', subtitle: 'Change wallpaper, themes, and screensaver', type: 'app', icon: '/icons/settings.png', appType: 'system-preferences' },
      { id: 'search-achievements', title: 'Achievements', subtitle: 'View unlocked achievements', type: 'app', icon: '/icons/achievements.png', appType: 'achievements' },
      { id: 'search-minesweeper', title: 'Minesweeper', subtitle: 'Play the mini-game', type: 'app', icon: '/icons/minesweeper.png', appType: 'minesweeper' },
    ];

    const folderEntries: SearchEntry[] = Object.values(fileSystem).map((item) => ({
      id: `folder-${item.id}`,
      title: item.name,
      subtitle: 'Folder',
      type: 'folder',
      icon: item.id === 'trash' ? '/icons/bin.png' : '/icons/folder.png',
      folderId: item.id,
    }));

    const fileEntries: SearchEntry[] = [];
    const walkItems = (items: FileSystemItem[]) => {
      items.forEach((item) => {
        if (item.type === 'folder' && item.content) {
          walkItems(item.content);
          return;
        }

        if (item.type === 'file') {
          fileEntries.push({
            id: `file-${item.id}`,
            title: item.name,
            subtitle: 'File',
            type: 'file',
            icon: '/icons/document.png',
            file: item,
          });
        }
      });
    };

    walkItems(Object.values(fileSystem));
    return [...appEntries, ...folderEntries, ...fileEntries];
  }, []);

  const openAchievementsWindow = () => {
    setHasUnreadAchievement(false);
    setIsSpotlightOpen(false);
    if (isMobile) {
      openMobileScreen({
        title: 'Achievements',
        appType: 'achievements',
      });
      return;
    }

    const existingWindow = windows.find((window) => window.appType === 'achievements');
    if (existingWindow) {
      focusWindow(existingWindow.id);
      setCurrentApp(existingWindow.title);
      return;
    }

    openWindow({
      id: 'achievements',
      title: 'Achievements',
      appType: 'achievements',
      position: { x: 260, y: 100 },
      size: { width: 520, height: 560 },
      isMinimized: false,
      isMaximized: false,
    });
    setCurrentApp('Achievements');
  };

  const unlockAchievement = (achievementId: AchievementId) => {
    setUnlockedAchievementIds((previous) => {
      if (previous.includes(achievementId)) {
        return previous;
      }

      const achievement = achievementDefinitions.find((item) => item.id === achievementId);
      if (achievement) {
        setAchievementNotification({ id: achievement.id, name: achievement.name });
        setHasUnreadAchievement(true);
      }

      return [...previous, achievementId];
    });
  };

  const recordExploration = (targetId: string) => {
    exploredTargetsRef.current.add(targetId);
    if (exploredTargetsRef.current.size >= 4) {
      unlockAchievement('desktop-explorer');
    }
  };

  const recordPlayfulMode = (mode: string) => {
    playfulModesRef.current.add(mode);
    if (playfulModesRef.current.has('minesweeper') && playfulModesRef.current.has('spotlight')) {
      unlockAchievement('gamer');
    }
  };

  useEffect(() => {
    const storedWallpaperId = window.localStorage.getItem('os-portfolio-wallpaper');
    const storedThemeId = window.localStorage.getItem('os-portfolio-theme');
    const storedScreensaverEnabled = window.localStorage.getItem('os-portfolio-screensaver-enabled');
    const storedScreensaverDelay = window.localStorage.getItem('os-portfolio-screensaver-delay');
    const storedAchievements = window.sessionStorage.getItem('os-portfolio-achievements');

    if (storedWallpaperId && wallpaperOptions.some((option) => option.id === storedWallpaperId)) {
      setSelectedWallpaperId(storedWallpaperId);
    }

    if (storedThemeId && themeOptions.some((option) => option.id === storedThemeId)) {
      setSelectedThemeId(storedThemeId);
    }

    if (storedScreensaverEnabled) {
      setScreensaverEnabled(storedScreensaverEnabled === 'true');
    }

    if (storedScreensaverDelay) {
      setScreensaverDelayMs(Number(storedScreensaverDelay));
    }

    if (storedAchievements) {
      setUnlockedAchievementIds(JSON.parse(storedAchievements) as AchievementId[]);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('os-portfolio-wallpaper', selectedWallpaperId);
  }, [selectedWallpaperId]);

  useEffect(() => {
    window.localStorage.setItem('os-portfolio-theme', selectedThemeId);
  }, [selectedThemeId]);

  useEffect(() => {
    window.localStorage.setItem('os-portfolio-screensaver-enabled', String(screensaverEnabled));
  }, [screensaverEnabled]);

  useEffect(() => {
    window.localStorage.setItem('os-portfolio-screensaver-delay', String(screensaverDelayMs));
  }, [screensaverDelayMs]);

  useEffect(() => {
    window.sessionStorage.setItem('os-portfolio-achievements', JSON.stringify(unlockedAchievementIds));
  }, [unlockedAchievementIds]);

  useEffect(() => {
    unlockAchievement('first-boot');
  }, []);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setIsBootFading(true);
    }, BOOT_SCREEN_DURATION_MS - BOOT_SCREEN_FADE_MS);

    const hideTimer = window.setTimeout(() => {
      setIsBootVisible(false);
      setIsBootFading(false);
    }, BOOT_SCREEN_DURATION_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (!achievementNotification) {
      return;
    }

    if (notificationTimeoutRef.current !== null) {
      window.clearTimeout(notificationTimeoutRef.current);
    }

    notificationTimeoutRef.current = window.setTimeout(() => {
      setAchievementNotification(null);
    }, 3800);

    return () => {
      if (notificationTimeoutRef.current !== null) {
        window.clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [achievementNotification]);

  useEffect(() => {
    const clearExistingTimeout = () => {
      if (inactivityTimeoutRef.current !== null) {
        window.clearTimeout(inactivityTimeoutRef.current);
      }
    };

    const resetInactivityTimer = () => {
      setIsScreensaverActive(false);
      clearExistingTimeout();

      if (!screensaverEnabled) return;

      inactivityTimeoutRef.current = window.setTimeout(() => {
        setIsScreensaverActive(true);
      }, screensaverDelayMs);
    };

    const dismissScreensaver = () => {
      if (isScreensaverActive) {
        setIsScreensaverActive(false);
      }
      resetInactivityTimer();
    };

    const activityEvents: Array<keyof WindowEventMap> = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, dismissScreensaver, { passive: true }));

    resetInactivityTimer();

    return () => {
      clearExistingTimeout();
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, dismissScreensaver));
    };
  }, [screensaverEnabled, screensaverDelayMs, isScreensaverActive]);

  const handleTerminalCommand = (command: string, args: string[]) => {
    switch (command) {
      case 'open':
        handleDesktopIconOpen(args[0], args[0] === 'trash' ? 'trash' : 'folder');
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
      case 'settings':
        handleAppClick('system-preferences');
        break;
    }
  };

  const openMobileScreen = (screen: MobileScreenState) => {
    setMobileScreen(screen);
    if (screen) {
      setCurrentApp(screen.title);
    }
  };

  const handleTerminalCommandEvent = ({
    command,
    isValid,
  }: {
    command: string;
    args: string[];
    isValid: boolean;
  }) => {
    if (!isValid) return;

    unlockAchievement('command-line-curious');
    if (command === 'help') {
      unlockAchievement('help-actually');
    }
  };

  const openFinderWindow = (path: string, title: string) => {
    if (isMobile) {
      openMobileScreen({
        title,
        appType: 'finder',
        data: { path },
      });
      return;
    }

    openWindow({
      id: `finder-${path}`,
      title,
      appType: 'finder',
      position: { x: 100, y: 100 },
      size: { width: 900, height: 600 },
      isMinimized: false,
      isMaximized: false,
      data: { path },
    });
    setCurrentApp('Finder');
  };

  const handleDesktopIconOpen = (id: string, type: string) => {
    if (!id) return;

    if (type === 'folder' || type === 'trash') {
      recordExploration(id);
      openFinderWindow(id, fileSystem[id]?.name || 'Finder');
      return;
    }

    if (type === 'pdf') {
      handleAppClick('pdf-viewer');
      return;
    }

    if (type === 'app' && id === 'mail') {
      handleAppClick('email');
    }
  };

  const handleAppClick = (appType: string) => {
    if (appType === 'spotlight') {
      unlockAchievement('first-spotlight');
      recordPlayfulMode('spotlight');
      setIsSpotlightOpen(true);
      return;
    }

    if (isMobile) {
      setIsSpotlightOpen(false);

      const mobileConfigs: Record<string, RenderTarget> = {
        finder: { title: 'Finder', appType: 'finder', data: { path: 'root' } },
        terminal: { title: 'Terminal', appType: 'terminal' },
        email: { title: 'Mail', appType: 'email' },
        minesweeper: { title: 'Minesweeper', appType: 'minesweeper' },
        'pdf-viewer': { title: 'cv.pdf', appType: 'pdf-viewer' },
        'system-preferences': { title: 'System Preferences', appType: 'system-preferences' },
        achievements: { title: 'Achievements', appType: 'achievements' },
      };

      const config = mobileConfigs[appType];
      if (!config) return;

      openMobileScreen(config);

      if (appType === 'email') {
        unlockAchievement('reference-check');
        recordExploration('email');
      }

      if (appType === 'pdf-viewer') {
        unlockAchievement('actually-read-it');
        recordExploration('cv');
      }

      if (appType === 'achievements') {
        setHasUnreadAchievement(false);
      }

      return;
    }

    setIsSpotlightOpen(false);
    const existingWindow = windows.find((window) => window.appType === appType);
    if (existingWindow) {
      focusWindow(existingWindow.id);
      setCurrentApp(existingWindow.title);
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
        isMaximized: false,
      },
      terminal: {
        id: 'terminal',
        title: 'Terminal',
        appType: 'terminal' as const,
        position: { x: 200, y: 150 },
        size: { width: 700, height: 450 },
        isMinimized: false,
        isMaximized: false,
      },
      email: {
        id: 'email',
        title: 'Mail',
        appType: 'email' as const,
        position: { x: 150, y: 100 },
        size: { width: 1000, height: 600 },
        isMinimized: false,
        isMaximized: false,
      },
      minesweeper: {
        id: 'minesweeper',
        title: 'Minesweeper',
        appType: 'minesweeper' as const,
        position: { x: 250, y: 150 },
        size: { width: 600, height: 700 },
        isMinimized: false,
        isMaximized: false,
      },
      'pdf-viewer': {
        id: 'pdf-viewer',
        title: 'cv.pdf',
        appType: 'pdf-viewer' as const,
        position: { x: 180, y: 120 },
        size: { width: 800, height: 600 },
        isMinimized: false,
        isMaximized: false,
      },
      'system-preferences': {
        id: 'system-preferences',
        title: 'System Preferences',
        appType: 'system-preferences' as const,
        position: { x: 220, y: 90 },
        size: { width: 860, height: 620 },
        isMinimized: false,
        isMaximized: false,
      },
      achievements: {
        id: 'achievements',
        title: 'Achievements',
        appType: 'achievements' as const,
        position: { x: 260, y: 100 },
        size: { width: 520, height: 560 },
        isMinimized: false,
        isMaximized: false,
      },
    };

    const config = configs[appType as keyof typeof configs];
    if (!config) return;

    openWindow(config);
    setCurrentApp(config.title);

    if (appType === 'email') {
      unlockAchievement('reference-check');
      recordExploration('email');
    }

    if (appType === 'pdf-viewer') {
      unlockAchievement('actually-read-it');
      recordExploration('cv');
    }

    if (appType === 'achievements') {
      setHasUnreadAchievement(false);
    }
  };

  const handleFolderOpen = (folder: FileSystemItem) => {
    recordExploration(folder.id);
  };

  const handleSpotlightSelect = (result: SpotlightResult) => {
    setIsSpotlightOpen(false);

    const entry = spotlightEntries.find((item) => item.id === result.id);
    if (!entry) return;

    if (entry.type === 'app' && entry.appType) {
      if (entry.appType === 'achievements') {
        openAchievementsWindow();
      } else {
        handleAppClick(entry.appType);
      }
      return;
    }

    if (entry.type === 'folder' && entry.folderId) {
      handleDesktopIconOpen(entry.folderId, entry.folderId === 'trash' ? 'trash' : 'folder');
      return;
    }

    if (entry.type === 'file' && entry.file) {
      handleFileOpen(entry.file);
    }
  };

  const handleFileOpen = (file: FileSystemItem) => {
    if (file.type === 'folder') return;

    recordExploration(file.id);

    if (file.id === 'bio' || file.id === 'values') {
      aboutFilesRef.current.add(file.id);
      if (aboutFilesRef.current.has('bio') && aboutFilesRef.current.has('values')) {
        unlockAchievement('context-matters');
      }
    }

    if (trashFileIds.has(file.id)) {
      trashFilesRef.current.add(file.id);
      if (trashFilesRef.current.size === trashFileIds.size && trashFileIds.size > 0) {
        unlockAchievement('trash-explorer');
      }
    }

    const windowId = `file-${file.id}`;

    if (file.appType === 'chess-stats' || file.appType === 'monkeytype-stats') {
      if (isMobile) {
        openMobileScreen({
          title: file.name,
          appType: file.appType,
        });
        return;
      }

      const existingWindow = windows.find((window) => window.id === windowId);
      if (existingWindow) {
        if (existingWindow.appType !== file.appType) {
          closeWindow(windowId);
        } else {
          focusWindow(windowId);
          setCurrentApp(existingWindow.title);
          return;
        }
      }

      openWindow({
        id: windowId,
        title: file.name,
        appType: file.appType,
        position: { x: 220, y: 130 },
        size: { width: 860, height: 620 },
        isMinimized: false,
        isMaximized: false,
      });
      setCurrentApp(file.name);
      return;
    }

    if (isMobile) {
      if (file.fileType === 'img') {
        openMobileScreen({
          title: file.name,
          appType: 'image-viewer',
          data: { src: file.filePath },
        });
        return;
      }

      openMobileScreen({
        title: file.name,
        appType: 'text-viewer',
        data: { content: file.fileContent, fileType: file.fileType },
      });
      return;
    }

    const existingWindow = windows.find((window) => window.id === windowId);

    if (existingWindow) {
      focusWindow(windowId);
      setCurrentApp(existingWindow.title);
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
        data: { src: file.filePath },
      });
      return;
    }

    openWindow({
      id: windowId,
      title: file.name,
      appType: 'text-viewer',
      position: { x: 200, y: 150 },
      size: { width: 700, height: 500 },
      isMinimized: false,
      isMaximized: false,
      data: { content: file.fileContent, fileType: file.fileType },
    });
  };

  const renderAppContent = ({ appType, title, data }: RenderTarget) => {
    const payload = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;

    switch (appType) {
      case 'finder':
        return (
          <Finder
            key={`finder-${String(payload.path || 'root')}`}
            initialPath={String(payload.path || 'root')}
            onFileOpen={handleFileOpen}
            onFolderOpen={handleFolderOpen}
          />
        );
      case 'terminal':
        return <Terminal onCommand={handleTerminalCommand} onCommandEvent={handleTerminalCommandEvent} />;
      case 'text-viewer':
        return <TextViewer content={String(payload.content || '')} fileType={payload.fileType as 'txt' | 'md' | undefined} />;
      case 'image-viewer':
        return <ImageViewer src={String(payload.src || '')} alt={title} />;
      case 'pdf-viewer':
        return <PDFViewer />;
      case 'email':
        return <EmailClient />;
      case 'minesweeper':
        return (
          <Minesweeper
            onGameStart={() => {
              minesweeperSessionsRef.current += 1;
              recordPlayfulMode('minesweeper');
              if (minesweeperSessionsRef.current > 1) {
                unlockAchievement('just-one-more');
              }
            }}
            onGameLose={() => unlockAchievement('first-mine')}
            onGameWin={() => unlockAchievement('clean-board')}
          />
        );
      case 'system-preferences':
        return (
          <SystemPreferences
            wallpapers={wallpaperOptions}
            selectedWallpaperId={selectedWallpaperId}
            onWallpaperChange={setSelectedWallpaperId}
            themes={themeOptions}
            selectedThemeId={selectedThemeId}
            onThemeChange={setSelectedThemeId}
            screensaverEnabled={screensaverEnabled}
            onScreensaverEnabledChange={setScreensaverEnabled}
            screensaverDelayMs={screensaverDelayMs}
            onScreensaverDelayChange={setScreensaverDelayMs}
          />
        );
      case 'achievements':
        return <Achievements achievements={achievementDefinitions} unlockedIds={achievementsSet} />;
      case 'chess-stats':
        return <ChessStats />;
      case 'monkeytype-stats':
        return <MonkeytypeStats />;
      default:
        return <div>Unknown app type</div>;
    }
  };

  const runningApps = Array.from(new Set(windows.map((window) => window.appType)));
  const mobileHomeItems = [
    { id: 'about', label: 'About Me', icon: '/icons/about-me.png', action: () => openFinderWindow('about', 'About Me') },
    { id: 'projects', label: 'Projects', icon: '/icons/folder.png', action: () => openFinderWindow('projects', 'Projects') },
    { id: 'experience', label: 'Experience', icon: '/icons/folder.png', action: () => openFinderWindow('experience', 'Experience') },
    { id: 'cv', label: 'CV', icon: '/icons/document.png', action: () => handleAppClick('pdf-viewer') },
    { id: 'mail', label: 'Mail', icon: '/icons/mail.png', action: () => handleAppClick('email') },
    { id: 'terminal', label: 'Terminal', icon: '/icons/terminal.png', action: () => handleAppClick('terminal') },
    { id: 'settings', label: 'Settings', icon: '/icons/settings.png', action: () => handleAppClick('system-preferences') },
    { id: 'achievements', label: 'Awards', icon: '/icons/achievements.png', action: openAchievementsWindow },
  ];
  const mobileDockItems = [
    { id: 'finder', label: 'Finder', icon: '/icons/finder.png', action: () => handleAppClick('finder') },
    { id: 'spotlight', label: 'Search', icon: '/icons/spotlight.png', action: () => handleAppClick('spotlight') },
    { id: 'mail', label: 'Mail', icon: '/icons/mail.png', action: () => handleAppClick('email') },
    { id: 'terminal', label: 'Terminal', icon: '/icons/terminal.png', action: () => handleAppClick('terminal') },
  ];

  if (isMobile) {
    return (
      <div className="min-h-screen w-full overflow-hidden" style={appThemeStyle}>
        <div className="fixed inset-0" style={selectedWallpaper.style} />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_34%)]" />
        <div className="fixed inset-0 bg-black/18" />

        <div className="relative z-10 flex min-h-screen flex-col px-4 pb-5 pt-4 text-white">
          <div className="flex items-center justify-between px-1 text-sm font-medium">
            <div>
              {new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: false,
              })}
            </div>
            <button
              type="button"
              onClick={() => {
                unlockAchievement('first-spotlight');
                recordPlayfulMode('spotlight');
                setIsSpotlightOpen(true);
              }}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md"
            >
              Search
            </button>
          </div>

          {mobileScreen ? (
            <div className="mt-4 flex-1 overflow-hidden rounded-[34px] border border-white/12 bg-[var(--color-window-bg)] shadow-[0_24px_60px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-[var(--color-window-header-border)] bg-[var(--color-window-header)] px-4 py-3 text-[var(--color-window-title)]">
                <button
                  type="button"
                  onClick={() => {
                    openMobileScreen(null);
                    setCurrentApp('Home');
                  }}
                  className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                >
                  Home
                </button>
                <div className="text-sm font-semibold">{mobileScreen.title}</div>
                <button
                  type="button"
                  onClick={() => setIsSpotlightOpen(true)}
                  className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                >
                  Search
                </button>
              </div>
              <div className="h-[calc(100vh-12rem)] overflow-auto">
                {renderAppContent(mobileScreen)}
              </div>
            </div>
          ) : (
            <>
              <div className="px-1 pt-8">
                <div className="text-4xl font-semibold tracking-tight">Gaurav</div>
                <div className="mt-2 max-w-xs text-sm text-white/75">
                  iPhone mode for the portfolio. Open apps, browse folders, and jump into projects without the desktop windowing.
                </div>
              </div>

              <div className="mt-8 grid grid-cols-4 gap-x-3 gap-y-6 px-1">
                {mobileHomeItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    className="flex flex-col items-center gap-2"
                  >
                    <img
                      src={item.icon}
                      alt=""
                      draggable={false}
                      className="h-16 w-16 rounded-[18px] object-contain shadow-[0_12px_24px_rgba(0,0,0,0.28)]"
                    />
                    <span className="text-center text-[11px] font-medium text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="mt-auto pt-5">
            <div className="rounded-[28px] border border-white/12 bg-white/12 px-3 py-3 backdrop-blur-2xl shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
              <div className="flex items-end justify-around gap-2">
                {mobileDockItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    className="flex flex-col items-center gap-1"
                  >
                    <img
                      src={item.icon}
                      alt=""
                      draggable={false}
                      className="h-14 w-14 object-contain"
                    />
                    <span className="text-[10px] font-medium text-white/80">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Spotlight
          isOpen={isSpotlightOpen}
          results={spotlightEntries}
          onClose={() => setIsSpotlightOpen(false)}
          onSelect={handleSpotlightSelect}
        />

        {achievementNotification && (
          <button
            type="button"
            onClick={() => {
              setAchievementNotification(null);
              openAchievementsWindow();
            }}
            className="fixed right-4 top-14 z-[10002] w-[calc(100vw-2rem)] max-w-sm rounded-2xl border p-4 text-left shadow-2xl backdrop-blur-xl transition-opacity bg-[var(--color-window-bg)] border-[var(--color-window-border)] text-[var(--color-text)]"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-xl bg-amber-300/15 p-2 text-amber-300">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">Achievement unlocked</div>
                <div className="mt-1 text-sm font-semibold text-[var(--color-text)]">{achievementNotification.name}</div>
              </div>
            </div>
          </button>
        )}

        {isScreensaverActive && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center" style={selectedWallpaper.style}>
            <div className="absolute inset-0 bg-black/45 backdrop-blur-md" />
            <div className="relative text-center text-white">
              <div className="text-xs uppercase tracking-[0.45em] text-white/70">Screensaver</div>
              <div className="mt-3 text-5xl font-semibold tracking-tight">
                {new Date().toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </div>
            </div>
          </div>
        )}

        <BootScreen isVisible={isBootVisible} isFading={isBootFading} />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden" style={appThemeStyle}>
      <MenuBar
        currentApp={currentApp}
        onLogoClick={() => undefined}
        onSearchClick={() => {
          unlockAchievement('first-spotlight');
          recordPlayfulMode('spotlight');
          setIsSpotlightOpen(true);
        }}
        onSystemPreferencesClick={() => handleAppClick('system-preferences')}
        onAchievementsClick={openAchievementsWindow}
        hasUnreadAchievement={hasUnreadAchievement}
      />

      <Desktop onIconDoubleClick={handleDesktopIconOpen} wallpaperStyle={selectedWallpaper.style} />

      <Spotlight
        isOpen={isSpotlightOpen}
        results={spotlightEntries}
        onClose={() => setIsSpotlightOpen(false)}
        onSelect={handleSpotlightSelect}
      />

      {windows.map((window) =>
        !window.isMinimized ? (
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
              if (window.appType === 'achievements') {
                setHasUnreadAchievement(false);
              }
            }}
            onPositionChange={(position) => updateWindowPosition(window.id, position)}
            onSizeChange={(nextSize, nextPosition) => {
              updateWindowSize(window.id, nextSize);
              if (nextPosition) {
                updateWindowPosition(window.id, nextPosition);
              }
            }}
            onMaximize={() => toggleMaximize(window.id)}
          >
            {renderAppContent(window)}
          </Window>
        ) : null
      )}

      <Dock runningApps={runningApps} onAppClick={handleAppClick} />

      {achievementNotification && (
        <button
          type="button"
          onClick={() => {
            setAchievementNotification(null);
            openAchievementsWindow();
          }}
          className="fixed right-5 top-12 z-[10002] w-72 rounded-2xl border p-4 text-left shadow-2xl backdrop-blur-xl transition-opacity bg-[var(--color-window-bg)] border-[var(--color-window-border)] text-[var(--color-text)]"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-amber-300/15 p-2 text-amber-300">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">Achievement unlocked</div>
              <div className="mt-1 text-sm font-semibold text-[var(--color-text)]">{achievementNotification.name}</div>
            </div>
          </div>
        </button>
      )}


      {isScreensaverActive && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center" style={selectedWallpaper.style}>
          <div className="absolute inset-0 bg-black/45 backdrop-blur-md" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_35%)] opacity-80" />
          <div className="relative text-center text-white">
            <div className="text-xs uppercase tracking-[0.45em] text-white/70">Screensaver</div>
            <div className="mt-3 text-6xl font-semibold tracking-tight">
              {new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </div>
            <div className="mt-3 text-sm text-white/75">Move the mouse or press any key to return to the desktop.</div>
          </div>
        </div>
      )}

      <BootScreen isVisible={isBootVisible} isFading={isBootFading} />
    </div>
  );
}

export default App;
