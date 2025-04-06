import { SudokuGenerator } from './sudoku';

export function getDailyPuzzleSeed() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();
  return `${year}-${month}-${day}`;
}

export function generateDailyPuzzle() {
  const seed = getDailyPuzzleSeed();
  const generator = new SudokuGenerator();
  
  // Use the seed to generate a deterministic puzzle
  const seedNumber = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  Math.seedrandom(seedNumber.toString());
  
  return generator.generate('medium');
} 