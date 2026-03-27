import { useState, useRef, useEffect } from 'react';
import { fileSystem, portfolioContent } from '../../data/portfolio';
import type { FileSystemItem } from '../../types';

interface TerminalProps {
  onCommand?: (command: string, args: string[]) => void;
  onCommandEvent?: (payload: { command: string; args: string[]; isValid: boolean }) => void;
}

interface TerminalLine {
  type: 'command' | 'output' | 'error';
  content: string;
}

export const Terminal = ({ onCommand, onCommandEvent }: TerminalProps) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Portfolio Terminal v1.0.0' },
    { type: 'output', content: 'Type "help" for available commands' },
    { type: 'output', content: '' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const normalizePathSegment = (value: string) =>
    value.toLowerCase().replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]+/g, '');

  const findFileByPath = (inputPath: string): FileSystemItem | null => {
    const segments = inputPath
      .split('/')
      .map((segment) => segment.trim())
      .filter(Boolean);

    if (segments.length === 0) {
      return null;
    }

    let currentItems = Object.values(fileSystem);
    let currentItem: FileSystemItem | null = null;

    for (const segment of segments) {
      const normalizedSegment = normalizePathSegment(segment);
      const nextItem =
        currentItems.find((item) => normalizePathSegment(item.name) === normalizedSegment) ??
        currentItems.find((item) => normalizePathSegment(item.id) === normalizedSegment);

      if (!nextItem) {
        return null;
      }

      currentItem = nextItem;
      currentItems = nextItem.content ?? [];
    }

    return currentItem;
  };

  const findFileAnywhere = (inputName: string): FileSystemItem | null => {
    const normalizedInput = normalizePathSegment(inputName);
    const stack = Object.values(fileSystem);

    while (stack.length > 0) {
      const item = stack.pop();
      if (!item) continue;

      if (
        normalizePathSegment(item.name) === normalizedInput ||
        normalizePathSegment(item.id) === normalizedInput
      ) {
        return item;
      }

      if (item.content) {
        stack.push(...item.content);
      }
    }

    return null;
  };

  const readFile = (inputPath: string): string | string[] => {
    const target = findFileByPath(inputPath) ?? findFileAnywhere(inputPath);

    if (!target) {
      return `File not found: ${inputPath}. Try: cat bio.txt or cat about/bio.txt`;
    }

    if (target.type !== 'file') {
      return `${target.name} is a folder. Try a file inside it.`;
    }

    if (target.fileContent) {
      return target.fileContent.split('\n');
    }

    if (target.filePath) {
      return [`${target.name}`, '', `Binary/asset file: ${target.filePath}`];
    }

    return `Nothing to display for ${target.name}.`;
  };

  const commands: Record<string, (args: string[]) => string | string[]> = {
    help: () => [
      'Available commands:',
      '  help              - Show this help message',
      '  about             - Learn about me',
      '  projects          - View my projects',
      '  experience        - View my work experience',
      '  cv                - Open my CV',
      '  email             - Open email client',
      '  minesweeper       - Play minesweeper',
      '  ls                - List desktop items',
      '  cat <file>        - Read a file',
      '  open <item>       - Open an item',
      '  whoami            - Who am I?',
      '  clear             - Clear terminal',
      '  konami            - Try the konami code (↑↑↓↓←→←→BA)',
      '',
      'Tip: Use ↑↓ arrows to navigate command history'
    ],
    about: () => portfolioContent.about.split('\n'),
    projects: () => [
      'Projects:',
      '',
      ...portfolioContent.projects.map(p => `  ${p.name}\n  ${p.description}\n  Tech: ${p.tech}\n`)
    ],
    experience: () => [
      'Experience:',
      '',
      ...portfolioContent.experiences.map(e => `  ${e.role} @ ${e.company}\n  ${e.period}\n  ${e.technologies}\n`)
    ],
    ls: () => [
      'Desktop Items:',
      '  About Me/',
      '  Experience/',
      '  Projects/',
      '  Playground/',
      '  cv.pdf',
      '  Mail.app',
      '  Trash/'
    ],
    whoami: () => [
      'Gaurav Murali',
      'Backend-leaning full-stack developer focused on AI-powered applications and production APIs',
      'GitHub: https://github.com/gaxxrav',
      'LinkedIn: https://www.linkedin.com/in/gaurav-murali-9098bb258/',
      'LeetCode: https://leetcode.com/u/gaxxrav/'
    ],
    clear: () => {
      setLines([]);
      return '';
    },
    cat: (args) => {
      if (!args[0]) return 'Usage: cat <filename>';
      return readFile(args.join(' '));
    },
    open: (args) => {
      if (!args[0]) return 'Usage: open <item>';
      if (onCommand) onCommand('open', args);
      return `Opening ${args[0]}...`;
    },
    cv: () => {
      if (onCommand) onCommand('cv', []);
      return 'Opening CV...';
    },
    email: () => {
      if (onCommand) onCommand('email', []);
      return 'Opening email client...';
    },
    minesweeper: () => {
      if (onCommand) onCommand('minesweeper', []);
      return 'Launching minesweeper...';
    },
    echo: (args) => args.join(' '),
    date: () => new Date().toString(),
    pwd: () => '/Users/portfolio/Desktop'
  };

  const handleCommand = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const [cmd, ...args] = trimmed.split(' ');
    const normalizedCommand = cmd.toLowerCase();
    const command = commands[normalizedCommand];

    setLines(prev => [...prev, { type: 'command', content: `$ ${trimmed}` }]);
    onCommandEvent?.({ command: normalizedCommand, args, isValid: Boolean(command) });

    if (command) {
      const output = command(args);
      if (output) {
        const outputLines = Array.isArray(output) ? output : [output];
        setLines(prev => [...prev, ...outputLines.map(line => ({ type: 'output' as const, content: line }))]);
      }
    } else {
      setLines(prev => [...prev, { type: 'error', content: `Command not found: ${cmd}. Type "help" for available commands.` }]);
    }

    setLines(prev => [...prev, { type: 'output', content: '' }]);
    setHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(history.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setCurrentInput(history[newIndex]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      ref={terminalRef}
      className="h-full overflow-auto p-4 text-sm font-mono"
      style={{
        backgroundColor: 'var(--color-panel-bg)',
        color: 'var(--color-accent)',
        fontFamily: 'var(--font-mono)',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className={`mb-1 ${
            line.type === 'command'
              ? 'text-blue-400'
              : line.type === 'error'
              ? 'text-red-400'
              : 'text-[var(--color-accent)]'
          }`}
        >
          {line.content}
        </div>
      ))}
      <div className="flex items-center">
        <span className="mr-2 text-[var(--color-accent)]">$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-[var(--color-text)] font-mono"
          spellCheck={false}
          autoComplete="off"
        />
        <span className="animate-pulse ml-1">▊</span>
      </div>
    </div>
  );
};
