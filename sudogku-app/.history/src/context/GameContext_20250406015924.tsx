import { createContext, useContext, useState, useEffect } from 'react'
import { SudokuGenerator, SudokuSolver } from '@/utils/sudoku'
import { generateDailyPuzzle, getDailyPuzzleSeed } from '@/utils/dailyPuzzle'

type GameMode = 'easy' | 'medium' | 'hard'
type CellValue = number | null
type PencilMarks = Set<number>

export interface GameContextType {
  board: CellValue[][]
  initialBoard: CellValue[][]
  solution: CellValue[][]
  pencilMarks: Map<string, Set<number>>
  gameMode: GameMode
  timer: number
  isComplete: boolean
  isPaused: boolean
  isDailyPuzzle: boolean
  selectedCell: [number, number] | null
  setSelectedCell: (cell: [number, number] | null) => void
  setGameMode: (mode: GameMode) => void
  setCellValue: (row: number, col: number, value: CellValue) => void
  togglePencilMark: (row: number, col: number, value: number) => void
  checkSolution: () => boolean
  revealSolution: () => void
  resetGame: () => void
  switchToDaily: () => void
  switchToRandom: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [board, setBoard] = useState<CellValue[][]>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  )
  const [initialBoard, setInitialBoard] = useState<CellValue[][]>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  )
  const [solution, setSolution] = useState<CellValue[][]>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  )
  const [pencilMarks, setPencilMarks] = useState<Map<string, Set<number>>>(
    new Map()
  )
  const [gameMode, setGameMode] = useState<GameMode>('medium')
  const [timer, setTimer] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isDailyPuzzle, setIsDailyPuzzle] = useState(false)
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  )

  useEffect(() => {
    // Load game state from localStorage
    const savedState = localStorage.getItem('sudogku-game')
    if (savedState) {
      const { board, initialBoard, solution, pencilMarks, gameMode, timer } =
        JSON.parse(savedState)
      setBoard(board)
      setInitialBoard(initialBoard)
      setSolution(solution)
      setPencilMarks(new Map(pencilMarks))
      setGameMode(gameMode)
      setTimer(timer)
    } else {
      generateNewPuzzle(gameMode)
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (!isPaused && !isComplete) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPaused, isComplete])

  const generateNewPuzzle = (mode: GameMode) => {
    const generator = new SudokuGenerator()
    const { puzzle, solution } = generator.generate(mode)
    setBoard(puzzle)
    setInitialBoard(puzzle)
    setSolution(solution)
    setPencilMarks(new Map())
    setTimer(0)
    setIsComplete(false)
    setIsPaused(false)
  }

  const setCellValue = (row: number, col: number, value: CellValue) => {
    if (initialBoard[row][col] !== null) return

    setBoard((prev) => {
      const newBoard = prev.map((r) => [...r])
      newBoard[row][col] = value
      return newBoard
    })

    // Remove pencil marks for this cell
    if (value !== null) {
      setPencilMarks((prev) => {
        const next = new Map(prev)
        next.delete(`${row}-${col}`)
        return next
      })
    }

    // Check if puzzle is complete
    if (SudokuSolver.isSolved(board)) {
      setIsComplete(true)
      updateStats()
    }
  }

  const togglePencilMark = (row: number, col: number, value: number) => {
    if (initialBoard[row][col] !== null || board[row][col] !== null) return

    setPencilMarks((prev) => {
      const next = new Map(prev)
      const key = `${row}-${col}`
      const currentMarks = prev.get(key) || new Set()
      if (currentMarks.has(value)) {
        currentMarks.delete(value)
      } else {
        currentMarks.add(value)
      }
      next.set(key, currentMarks)
      return next
    })
  }

  const checkSolution = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== solution[row][col]) {
          return false
        }
      }
    }
    return true
  }

  const revealSolution = () => {
    setBoard(solution.map((row) => [...row]))
    setIsComplete(true)
    updateStats(false)
  }

  const resetGame = () => {
    setBoard(initialBoard.map((row) => [...row]))
    setPencilMarks(new Map())
    setTimer(0)
    setIsComplete(false)
    setIsPaused(false)
  }

  const updateStats = (won: boolean = true) => {
    const savedStats = localStorage.getItem('sudogku-stats')
    const stats = savedStats
      ? JSON.parse(savedStats)
      : {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          bestStreak: 0,
          averageTime: 0,
          bestTime: 0,
        }

    stats.gamesPlayed++
    if (won) {
      stats.gamesWon++
      stats.currentStreak++
      stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak)
      stats.bestTime =
        stats.bestTime === 0 ? timer : Math.min(stats.bestTime, timer)
      stats.averageTime = Math.round(
        (stats.averageTime * (stats.gamesWon - 1) + timer) / stats.gamesWon
      )
    } else {
      stats.currentStreak = 0
    }

    localStorage.setItem('sudogku-stats', JSON.stringify(stats))
  }

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'sudogku-game',
      JSON.stringify({
        board,
        initialBoard,
        solution,
        pencilMarks: Array.from(pencilMarks.entries()),
        gameMode,
        timer,
      })
    )
  }, [board, initialBoard, solution, pencilMarks, gameMode, timer])

  const switchToDaily = () => {
    const lastPlayedDaily = localStorage.getItem('sudogku-last-daily')
    const currentSeed = getDailyPuzzleSeed()

    if (lastPlayedDaily === currentSeed) {
      // Load saved daily progress
      const savedDaily = localStorage.getItem('sudogku-daily-progress')
      if (savedDaily) {
        const { board, solution } = JSON.parse(savedDaily)
        setBoard(board)
        setSolution(solution)
        setInitialBoard(board)
        return
      }
    }

    // Generate new daily puzzle
    const { puzzle, solution } = generateDailyPuzzle()
    setBoard(puzzle)
    setInitialBoard(puzzle)
    setSolution(solution)
    setPencilMarks(new Map())
    setTimer(0)
    setIsComplete(false)
    setIsPaused(false)
    setIsDailyPuzzle(true)

    localStorage.setItem('sudogku-last-daily', currentSeed)
    localStorage.setItem(
      'sudogku-daily-progress',
      JSON.stringify({ board: puzzle, solution })
    )
  }

  const switchToRandom = () => {
    setIsDailyPuzzle(false)
    generateNewPuzzle(gameMode)
  }

  const value: GameContextType = {
    board,
    initialBoard,
    solution,
    pencilMarks,
    gameMode,
    timer,
    isComplete,
    isPaused,
    isDailyPuzzle,
    selectedCell,
    setSelectedCell,
    setGameMode,
    setCellValue,
    togglePencilMark,
    checkSolution,
    revealSolution,
    resetGame,
    switchToDaily,
    switchToRandom,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
