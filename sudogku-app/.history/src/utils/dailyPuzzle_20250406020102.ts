import { SudokuGenerator, Grid } from './sudoku';
import seedrandom from 'seedrandom';

export function getDailyPuzzleSeed() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();
  return `${year}-${month}-${day}`;
}

export function generateDailyPuzzle(): { puzzle: Grid, solution: Grid } {
  const seed = getDailyPuzzleSeed();
  const generator = new SudokuGenerator();
  
  // Use the seed to generate a deterministic puzzle
  const seedNumber = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  seedrandom(seedNumber.toString());
  
  return generator.generate('medium');
} 