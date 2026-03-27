import { useState, useRef, useEffect } from 'react';
import { portfolioContent } from '../../data/portfolio';

interface TerminalProps {
  onCommand?: (command: string, args: string[]) => void;
}

interface TerminalLine {
  type: 'command' | 'output' | 'error';
  content: string;
}

export const Terminal = ({ onCommand }: TerminalProps) => {
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
      '  matrix            - Enter the matrix',
      '  disco             - Party mode',
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
    whoami: () => 'A creative developer who builds delightful experiences',
    clear: () => {
      setLines([]);
      return '';
    },
    cat: (args) => {
      if (!args[0]) return 'Usage: cat <filename>';
      return `File not found: ${args[0]}. Try: cat about.txt`;
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
    matrix: () => {
      if (onCommand) onCommand('matrix', []);
      return 'Following the white rabbit...';
    },
    disco: () => {
      if (onCommand) onCommand('disco', []);
      return 'Party mode activated! 🎉';
    },
    echo: (args) => args.join(' '),
    date: () => new Date().toString(),
    pwd: () => '/Users/portfolio/Desktop'
  };

  const handleCommand = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const [cmd, ...args] = trimmed.split(' ');
    const command = commands[cmd.toLowerCase()];

    setLines(prev => [...prev, { type: 'command', content: `$ ${trimmed}` }]);

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
      className="h-full bg-black text-green-400 font-mono text-sm p-4 overflow-auto"
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
              : 'text-green-400'
          }`}
        >
          {line.content}
        </div>
      ))}
      <div className="flex items-center">
        <span className="text-blue-400 mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-green-400 font-mono"
          spellCheck={false}
          autoComplete="off"
        />
        <span className="animate-pulse ml-1">▊</span>
      </div>
    </div>
  );
};
