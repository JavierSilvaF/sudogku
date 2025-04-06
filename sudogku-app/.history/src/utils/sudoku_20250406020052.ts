type Grid = (number | null)[][];

export class SudokuGenerator {
  private grid: Grid = Array(9).fill(null).map(() => Array(9).fill(null));

  private isValid(row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (this.grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (this.grid[x][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.grid[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  }

  private fillDiagonal(): void {
    for (let i = 0; i < 9; i += 3) {
      this.fillBox(i, i);
    }
  }

  private fillBox(row: number, col: number): void {
    let num;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        do {
          num = Math.floor(Math.random() * 9) + 1;
        } while (!this.isValid(row + i, col + j, num));
        this.grid[row + i][col + j] = num;
      }
    }
  }

  private fillRemaining(row: number, col: number): boolean {
    if (col >= 9 && row < 8) {
      row++;
      col = 0;
    }
    if (row >= 9 && col >= 9) return true;
    if (row < 3) {
      if (col < 3) col = 3;
    } else if (row < 6) {
      if (col === Math.floor(row / 3) * 3) col += 3;
    } else {
      if (col === 6) {
        row++;
        col = 0;
        if (row >= 9) return true;
      }
    }

    for (let num = 1; num <= 9; num++) {
      if (this.isValid(row, col, num)) {
        this.grid[row][col] = num;
        if (this.fillRemaining(row, col + 1)) return true;
        this.grid[row][col] = null;
      }
    }
    return false;
  }

  private removeDigits(difficulty: 'easy' | 'medium' | 'hard'): void {
    const removeCount = {
      easy: 30,
      medium: 45,
      hard: 55
    }[difficulty];

    let count = removeCount;
    while (count > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (this.grid[row][col] !== null) {
        this.grid[row][col] = null;
        count--;
      }
    }
  }

  generate(difficulty: 'easy' | 'medium' | 'hard'): { puzzle: Grid, solution: Grid } {
    this.grid = Array(9).fill(null).map(() => Array(9).fill(null));
    this.fillDiagonal();
    this.fillRemaining(0, 3);
    const solution = this.grid.map(row => [...row]);
    this.removeDigits(difficulty);
    return {
      puzzle: this.grid.map(row => [...row]),
      solution
    };
  }
}

export class SudokuSolver {
  static isValidMove(grid: Grid, row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  }

  static isSolved(grid: Grid): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) return false;
      }
    }
    return true;
  }
} 