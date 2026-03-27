import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trophy, Clock, Flag } from 'lucide-react';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface MinesweeperProps {
  onGameStart?: () => void;
  onGameLose?: () => void;
  onGameWin?: () => void;
}

const DIFFICULTIES = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 25 },
  hard: { rows: 16, cols: 16, mines: 50 }
};

export const Minesweeper = ({ onGameStart, onGameLose, onGameWin }: MinesweeperProps) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [time, setTime] = useState(0);
  const [flagsLeft, setFlagsLeft] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);

  const config = DIFFICULTIES[difficulty];

  const createBoard = useCallback((safeRow?: number, safeCol?: number) => {
    const newBoard: Cell[][] = Array(config.rows).fill(null).map(() =>
      Array(config.cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    let minesToPlace = config.mines;
    while (minesToPlace > 0) {
      const row = Math.floor(Math.random() * config.rows);
      const col = Math.floor(Math.random() * config.cols);

      if (safeRow !== undefined && safeCol !== undefined) {
        if (Math.abs(row - safeRow) <= 1 && Math.abs(col - safeCol) <= 1) continue;
      }

      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesToPlace--;
      }
    }

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr;
              const newCol = col + dc;
              if (
                newRow >= 0 && newRow < config.rows &&
                newCol >= 0 && newCol < config.cols &&
                newBoard[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }

    return newBoard;
  }, [config.rows, config.cols, config.mines]);

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => setTime(t => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  const resetGame = () => {
    setBoard(createBoard());
    setGameState('playing');
    setTime(0);
    setFlagsLeft(config.mines);
    setIsFirstClick(true);
    onGameStart?.();
  };

  const revealCell = (row: number, col: number) => {
    if (gameState !== 'playing') return;

    if (isFirstClick) {
      setBoard(createBoard(row, col));
      setIsFirstClick(false);
    }

    const newBoard = [...board.map(r => [...r])];
    const cell = newBoard[row][col];

    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;

    if (cell.isMine) {
      setGameState('lost');
      onGameLose?.();
      newBoard.forEach(row => row.forEach(c => {
        if (c.isMine) c.isRevealed = true;
      }));
    } else if (cell.neighborMines === 0) {
      const queue: [number, number][] = [[row, col]];
      const visited = new Set<string>();

      while (queue.length > 0) {
        const [r, c] = queue.shift()!;
        const key = `${r},${c}`;
        if (visited.has(key)) continue;
        visited.add(key);

        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const newRow = r + dr;
            const newCol = c + dc;
            if (
              newRow >= 0 && newRow < config.rows &&
              newCol >= 0 && newCol < config.cols &&
              !newBoard[newRow][newCol].isRevealed &&
              !newBoard[newRow][newCol].isFlagged
            ) {
              newBoard[newRow][newCol].isRevealed = true;
              if (newBoard[newRow][newCol].neighborMines === 0) {
                queue.push([newRow, newCol]);
              }
            }
          }
        }
      }
    }

    setBoard(newBoard);

    const unrevealedNonMines = newBoard.flat().filter(c => !c.isRevealed && !c.isMine).length;
    if (unrevealedNonMines === 0) {
      setGameState('won');
      onGameWin?.();
    }
  };

  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== 'playing') return;

    const newBoard = [...board.map(r => [...r])];
    const cell = newBoard[row][col];

    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    setFlagsLeft(prev => cell.isFlagged ? prev - 1 : prev + 1);
    setBoard(newBoard);
  };

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) return <Flag className="w-4 h-4 text-red-500" />;
    if (!cell.isRevealed) return null;
    if (cell.isMine) return '💣';
    if (cell.neighborMines === 0) return '';
    return cell.neighborMines;
  };

  const getCellColor = (num: number) => {
    const colors = [
      '',
      'text-blue-600',
      'text-green-600',
      'text-red-600',
      'text-purple-600',
      'text-yellow-600',
      'text-pink-600',
      'text-gray-900',
      'text-gray-600'
    ];
    return colors[num] || '';
  };

  return (
    <div className="flex h-full flex-col items-center overflow-auto p-6 bg-[var(--color-panel-soft)] text-[var(--color-text)]">
      <div className="max-w-full rounded-lg p-6 shadow-lg bg-[var(--color-panel-bg)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  difficulty === d
                    ? 'text-white'
                    : 'bg-[var(--color-panel-soft)] hover:bg-[var(--color-accent-soft)]'
                }`}
                style={difficulty === d ? { backgroundColor: 'var(--color-accent)' } : undefined}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={resetGame}
            className="rounded-lg p-2 transition-colors bg-[var(--color-panel-soft)] hover:bg-[var(--color-accent-soft)]"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm font-medium">
          <div className="flex items-center gap-2 rounded px-3 py-2 bg-[var(--color-panel-soft)]">
            <Flag className="w-4 h-4" />
            <span>{flagsLeft}</span>
          </div>
          <div className="flex items-center gap-2 rounded px-3 py-2 bg-[var(--color-panel-soft)]">
            <Clock className="w-4 h-4" />
            <span>{String(Math.floor(time / 60)).padStart(2, '0')}:{String(time % 60).padStart(2, '0')}</span>
          </div>
        </div>

        {gameState !== 'playing' && (
          <div className={`mb-4 rounded-lg p-4 text-center font-semibold ${
            gameState === 'won' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'
          }`}>
            {gameState === 'won' ? (
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5" />
                You Won! Time: {time}s
              </div>
            ) : (
              'Game Over! Try Again'
            )}
          </div>
        )}

        <div
          className="inline-grid gap-0.5 rounded bg-[var(--color-border)] p-0.5"
          style={{
            gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
                className={`w-8 h-8 flex items-center justify-center font-bold text-sm transition-colors ${
                  cell.isRevealed
                    ? cell.isMine
                      ? 'bg-red-300/60'
                      : 'bg-[var(--color-panel-bg)]'
                    : 'bg-[var(--color-panel-soft)] hover:bg-[var(--color-accent-soft)] active:brightness-90'
                } ${getCellColor(cell.neighborMines)}`}
              >
                {getCellContent(cell)}
              </button>
            ))
          )}
        </div>

        <div className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
          Left click to reveal • Right click to flag
        </div>
      </div>
    </div>
  );
};
